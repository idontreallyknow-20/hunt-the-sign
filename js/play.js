/* Hunt the Sign (live). The phone page. */
(function () {
  'use strict';
  const { rpc, esc, ord, fmt, LETTERS, phaseNow, now, MODES, POWERS, confetti } = window.HTS;
  const main = document.getElementById('main');
  const who = document.getElementById('who');
  const net = document.getElementById('net');
  const KEY = 'hts-live-v1';

  let session = null;      // { game, player, token, name }
  let lastName = '';
  let s = null;            // latest state from the server
  let pending = null;      // { q, choice } tapped but not yet confirmed
  let power = null;        // { q, power, hide } used on this question, known before the server echoes it
  let late = null;         // question index where the tap arrived too late
  let notice = '';         // one line shown on the join screen
  let viewKey = '';
  let scene = '';          // which screen is up, so a redraw of the same one does not animate again
  let fails = 0;
  let pollTimer = 0;
  let joining = false;
  let lastCount = '';

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) { session = saved.session || null; lastName = saved.name || ''; }
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ session, name: lastName })); } catch (e) {} };

  /* ---------- talking to the server ---------- */

  async function poll() {
    clearTimeout(pollTimer);
    try {
      const r = await rpc('hts_state', session ? { p_player: session.player, p_token: session.token } : {});
      fails = 0;
      s = r;
      if (session && (r.gone || r.game !== session.game)) {
        notice = r.gone === 'kicked' ? 'The host removed that name. Use your own.' : '';
        session = null; pending = null; power = null; save();
      }
    } catch (e) {
      fails++;
    }
    net.hidden = fails < 2;
    draw();
    const p = phaseNow(s);
    let wait = 1000;
    if (!session) wait = 2000;
    else if (p === 'open' && !answered()) wait = peeking() ? 1000 : 2000;
    else if (p === 'closed') wait = 500;
    if (fails) wait = Math.min(3000, 800 * fails);
    pollTimer = setTimeout(poll, wait + Math.random() * 200);
  }

  const me = () => (s && s.me) || {};
  const answered = () => !!me().answered || !!(pending && s && pending.q === s.q);
  const choice = () => (pending && s && pending.q === s.q ? pending.choice : me().answered ? me().choice : null);
  /* Which superpower is in play on this question, and which are spent. */
  const powerNow = () => {
    if (power && s && power.q === s.q) return power.power;
    const used = me().powers || {};
    return Object.keys(used).find(k => used[k] === s.q) || null;
  };
  const spent = name => (me().powers || {})[name] !== undefined || !!(power && power.power === name);
  const hidden = () => (power && s && power.q === s.q && power.hide) || me().hide || [];
  const peeking = () => powerNow() === 'peek';

  async function join(name) {
    if (joining) return;
    joining = true;
    notice = '';
    draw(true);
    try {
      const r = await rpc('hts_join', { p_name: name });
      if (r.error) {
        notice = r.error === 'no_game' ? 'No game is open yet.' : r.error === 'full' ? 'The game is full.' : 'Pick a different name.';
      } else {
        session = { game: r.game, player: r.player, token: r.token, name: r.name };
        lastName = name;
        save();
      }
    } catch (e) {
      notice = 'No connection. Try again.';
    }
    joining = false;
    draw(true);
    poll();
  }

  async function answer(i) {
    if (!s || !session || answered() || phaseNow(s) !== 'open' || hidden().includes(i)) return;
    const q = s.q;
    pending = { q, choice: i };
    draw();
    for (let tries = 0; tries < 4; tries++) {
      try {
        const r = await rpc('hts_answer', { p_player: session.player, p_token: session.token, p_q: q, p_choice: i }, 4000);
        if (!r.ok && r.why !== 'already') { pending = null; late = q; }
        break;
      } catch (e) {
        if (!s || s.q !== q || now() > s.closes_at) { pending = null; late = q; break; }
        await new Promise(res => setTimeout(res, 350));
      }
    }
    poll();
  }

  async function usePower(name) {
    if (!s || !session || answered() || phaseNow(s) !== 'open' || powerNow() || spent(name)) return;
    const q = s.q;
    power = { q, power: name, hide: null };
    draw();
    try {
      const r = await rpc('hts_power', { p_player: session.player, p_token: session.token, p_q: q, p_power: name }, 4000);
      if (r.ok) { if (power && power.q === q) power.hide = r.hide || null; }
      else if (power && power.q === q) power = null;
      draw();
    } catch (e) {
      if (power && power.q === q) power = null;
    }
    poll();
  }

  /* ---------- screens ---------- */

  const modeChip = q => (q && MODES[q.mode] ? `<span class="chip">${MODES[q.mode]}</span>` : '');

  function draw(force) {
    const p = phaseNow(s);
    who.textContent = session ? session.name : '';
    let key, html, tone = '';
    if (!session) {
      key = 'join|' + notice + '|' + joining;
      if (key === viewKey && !force) return;
      html = `<div class="screen join">
        <h1 class="title">Hunt the Sign</h1>
        <form id="jf" autocomplete="off">
          <input id="nm" maxlength="14" placeholder="your name" aria-label="your name" autocapitalize="words" enterkeyhint="go" value="${esc(lastName)}" required>
          <button class="btn primary" ${joining ? 'disabled' : ''}>join</button>
        </form>
        <p class="err" role="alert">${esc(notice)}</p>
        <a class="credits" href="credits.html">credits</a>
      </div>`;
    } else if (!s || p === 'none') {
      key = 'none';
      html = `<div class="screen center"><div class="dots"><i></i><i></i><i></i></div></div>`;
    } else if (p === 'lobby') {
      key = 'lobby';
      html = `<div class="screen center"><p class="big pop">You are in, ${esc(session.name)}.</p><div class="dots"><i></i><i></i><i></i></div></div>`;
    } else if (p === 'ready') {
      key = 'ready|' + s.q;
      html = `<div class="screen"><p class="label">${s.q + 1} of ${s.total} ${modeChip(s.question)}</p>
        <p class="prompt">${esc(s.question.prompt)}</p>
        <p class="count" id="count"></p></div>`;
    } else if (p === 'open' || p === 'closed') {
      const c = choice(), done = c !== null, q = s.question, shut = done || p === 'closed';
      const pn = powerNow(), hide = hidden(), peek = (peeking() && me().peek) || null;
      const scored = q.kind !== 'poll';
      key = [p, s.q, c, late === s.q, pn, hide.join(''), peek ? peek.join(',') : ''].join('|');
      const powers = scored ? `<div class="powers">${Object.keys(POWERS).map(name => {
        const on = pn === name, na = name === 'fifty' && q.opts.length < 4;
        const off = shut || na || (!on && (pn || spent(name)));
        return `<button class="pw ${on ? 'on' : ''} ${spent(name) && !on ? 'spent' : ''}" data-p="${name}" ${off || on ? 'disabled' : ''}>${POWERS[name]}</button>`;
      }).join('')}</div>` : '';
      html = `<div class="screen"><div class="clockrow"><span>${s.q + 1} of ${s.total} ${modeChip(q)}${pn === 'double' ? '<span class="chip">2x</span>' : ''}</span><b id="secs"></b></div>
        <div class="bar" id="bar"><i></i></div>
        <p class="prompt">${esc(q.prompt)}</p>
        <div class="opts ${shut ? 'locked' : ''}">${q.opts.map((o, i) =>
          `<button class="opt ${c === i ? 'picked' : ''} ${hide.includes(i) ? 'gone' : ''}" data-i="${i}" style="--i:${i}" ${shut || hide.includes(i) ? 'disabled' : ''}><span class="k">${LETTERS[i]}</span><span>${esc(o)}</span><span class="n">${peek ? peek[i] || 0 : ''}</span></button>`).join('')}</div>
        ${powers}
        <p class="wait" role="status">${done ? 'Locked in.' : p === 'closed' ? (late === s.q ? 'Too late.' : 'Time.') : ''}</p></div>`;
    } else if (p === 'reveal') {
      const m = me(), poll = s.question.kind === 'poll';
      key = 'reveal|' + s.q;
      const moved = (m.prev_rank || m.rank) - m.rank;
      let verdict;
      if (poll) verdict = m.answered ? 'Noted.' : 'No answer.';
      else if (!m.answered) { verdict = 'No answer.'; tone = 'no'; }
      else if (m.correct) { verdict = 'Correct.'; tone = 'ok'; }
      else { verdict = 'Wrong.'; tone = 'no'; }
      html = `<div class="screen res center">
        <p class="verdict ${tone} pop">${verdict}</p>
        <p class="gain" id="gain" data-to="${m.gain || 0}">+0</p>
        ${!poll && m.streak >= 2 ? `<p class="streak">streak of ${m.streak}</p>` : ''}
        <p class="rank">${ord(m.rank || 1)}${moved > 0 ? ` <span class="up">▲ ${moved}</span>` : moved < 0 ? ` <span class="down">▼ ${-moved}</span>` : ''}</p>
        <p class="pts">${fmt(m.score)}</p></div>`;
    } else if (p === 'final') {
      const m = me();
      key = 'final';
      tone = m.rank <= 3 ? 'ok' : '';
      html = `<div class="screen res center"><p class="place pop">${ord(m.rank || 1)}</p>
        <p class="tier">${esc(m.tier || '')}</p>
        <p class="pts">${fmt(m.score)}</p>
        <p class="label">${m.correct_count || 0} of ${m.scored || 0}</p></div>`;
    }
    if (key !== viewKey || force) {
      viewKey = key;
      const keepName = document.getElementById('nm');
      const typed = keepName ? keepName.value : null;
      main.innerHTML = html;
      const sc = key.split('|')[0].replace('closed', 'open') + (s && session ? s.q : '');
      if (sc === scene && main.firstElementChild) main.firstElementChild.classList.add('still');
      const fresh = sc !== scene;
      scene = sc;
      const nm = document.getElementById('nm');
      if (nm && typed !== null) nm.value = typed;
      document.body.className = tone ? 'tone-' + tone : '';
      lastCount = '';
      if (fresh) window.scrollTo(0, 0);
      const gain = document.getElementById('gain');
      if (gain) countUp(gain, Number(gain.dataset.to));
      if (fresh && key === 'final' && me().rank <= 3) confetti(document.querySelector('.play'), 60);
    }
    tick();
  }

  function countUp(el, to) {
    const t0 = performance.now(), dur = 700;
    const run = t => {
      const f = Math.min(1, (t - t0) / dur);
      el.textContent = '+' + fmt(Math.round(to * (1 - Math.pow(1 - f, 3))));
      if (f < 1 && el.isConnected) requestAnimationFrame(run);
    };
    if (to > 0) requestAnimationFrame(run);
  }

  /* The countdown and the timer bar, ten times a second. */
  function tick() {
    if (!s) return;
    const p = phaseNow(s);
    if (session && (p === 'open' || p === 'closed' || p === 'ready') && !viewKey.startsWith(p + '|')) return draw();
    const t = now();
    const count = document.getElementById('count');
    if (count) {
      const n = String(Math.max(1, Math.min(3, Math.ceil((s.opens_at - t) / 1000))));
      if (n !== lastCount) { lastCount = n; count.textContent = n; count.classList.remove('pop'); void count.offsetWidth; count.classList.add('pop'); }
    }
    const secs = document.getElementById('secs');
    const bar = document.getElementById('bar');
    if (secs && bar) {
      const left = Math.max(0, s.closes_at - t);
      const span = Math.max(1, s.closes_at - s.opens_at);
      secs.textContent = Math.ceil(left / 1000);
      bar.firstElementChild.style.transform = `scaleX(${Math.min(1, left / span)})`;
      bar.classList.toggle('low', left <= 5000);
    }
  }
  setInterval(tick, 100);

  main.addEventListener('click', e => {
    const b = e.target.closest('.opt[data-i]');
    if (b && !b.disabled) return answer(Number(b.dataset.i));
    const w = e.target.closest('.pw[data-p]');
    if (w && !w.disabled) usePower(w.dataset.p);
  });
  main.addEventListener('submit', e => {
    e.preventDefault();
    const v = (document.getElementById('nm').value || '').trim();
    if (v) { lastName = v; join(v); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });

  poll();
})();
