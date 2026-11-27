/* Hunt the Sign (live). The host page, for the projector. */
(function () {
  'use strict';
  const { rpc, esc, fmt, LETTERS, MODES, POWERS, phaseNow, evidence, confetti, now } = window.HTS;
  const paintScene = window.HTS.scene || (() => {}), night = window.HTS.night || (() => {});
  const mood = window.HTS.mood || (() => {});
  const sound = window.HTS.sound || { play() {}, ambient() {}, on: () => false, toggle: () => false };
  const stage = document.getElementById('stage');
  const ctl = document.getElementById('ctl');
  const where = document.getElementById('where');
  const lead = document.getElementById('lead');
  const count = document.getElementById('count');
  const KEY = 'hts-host-key';
  const SHOWN = 8;                      // leaderboard rows on screen
  const TIERS = ['Guide', 'Sign Reader', 'Tracker', 'Walker'];

  /* The host link carries the key after the #. Keep it on this computer and take it
     out of the address bar, so it never shows on the projector. */
  let key = '';
  try {
    const m = location.hash.match(/k=([^&]+)/);
    if (m) { localStorage.setItem(KEY, decodeURIComponent(m[1])); history.replaceState(null, '', location.pathname + location.search); }
    key = localStorage.getItem(KEY) || '';
  } catch (e) {
    const m = location.hash.match(/k=([^&]+)/);
    key = m ? decodeURIComponent(m[1]) : '';
  }

  const joinUrl = new URL('./', location.href).href.split('?')[0];
  const joinText = joinUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  let s = null, viewKey = '', ctlKey = '', busy = false, fails = 0, denied = false;
  let armed = '', armedTimer = 0, lastGo = 0, pollTimer = 0, timers = [];
  let lastCount = '', lastLead = '', lastN = -1;
  let liveRows = null;                  // leaderboard rows on a question screen, by player id
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const clearLater = () => { timers.forEach(clearTimeout); timers = []; };
  const pop = el => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };

  const phase = () => phaseNow(s);
  /* The step name the server uses, so a double press cannot advance twice. */
  const step = () => {
    const p = phase();
    if (p === 'lobby' || p === 'final') return p;
    return s.q + ':' + (p === 'closed' ? 'reveal' : p);
  };

  /* ---------- talking to the server ---------- */

  async function poll() {
    clearTimeout(pollTimer);
    if (!key || denied) return draw();
    if (!busy) {
      try {
        s = await rpc('hts_host_state', { p_key: key });
        fails = 0;
      } catch (e) {
        if (/not the host/.test(e.message)) denied = true; else fails++;
      }
    }
    draw();
    pollTimer = setTimeout(poll, phase() === 'closed' ? 300 : 700);
  }

  async function act(fn, args) {
    if (busy) return;
    busy = true; drawCtl();
    try {
      s = await rpc(fn, Object.assign({ p_key: key }, args || {}));
      fails = 0;
    } catch (e) {
      fails++;
    }
    busy = false;
    draw();
  }

  function go() {
    if (!s || Date.now() - lastGo < 500) return;
    lastGo = Date.now();
    const p = phase();
    if (p === 'none') return act('hts_host_new');
    if (p === 'ready' || p === 'final') return;
    act('hts_host_next', { p_step: step() });
  }

  /* ---------- screens ---------- */

  function draw() {
    if (!key || denied) {
      const gk = 'gate|' + denied;
      if (viewKey !== gk) {
        viewKey = gk;
        stage.innerHTML = `<div class="view gate"><h1 class="title">Hunt the Sign</h1>
          <p>${denied ? 'That password is not right.' : 'Host password'}</p>
          <form id="gf" autocomplete="off"><input id="gk" type="password" aria-label="host password" autocomplete="off"><button class="btn primary">open</button></form></div>`;
        ctl.innerHTML = '';
        ctlKey = '';
        const box = document.getElementById('gk');
        if (box) box.focus();
      }
      return;
    }
    if (!s) return;
    const p = phase();
    const inGame = p !== 'none' && p !== 'lobby';
    night(true);
    setMood();
    count.textContent = p === 'none' ? '' : s.players + (s.players === 1 ? ' player' : ' players');
    where.textContent = inGame && p !== 'final' ? `${s.q + 1} / ${s.total}` : '';

    /* Who is leading. Points from the question on screen stay hidden until the reveal. */
    const f = p === 'reveal' || p === 'final' ? 'score' : 'prev';
    const first = inGame && p !== 'final' ? (s.board || []).slice().sort((a, b) => b[f] - a[f] || a.name.localeCompare(b.name))[0] : null;
    const leadKey = first && first[f] > 0 ? first.name + '|' + first[f] : '';
    if (leadKey !== lastLead) {
      const changed = leadKey.split('|')[0] !== lastLead.split('|')[0];
      lastLead = leadKey;
      lead.innerHTML = leadKey ? `<span class="label">leading</span> <b>${esc(first.name)}</b> ${fmt(first[f])}` : '';
      if (leadKey && changed) pop(lead);
    }

    let k;
    if (p === 'none') k = 'none';
    else if (p === 'lobby') k = 'lobby|' + s.game;
    else if (p === 'ready' || p === 'open' || p === 'closed') k = 'q|' + s.game + s.q;
    else if (p === 'reveal') k = 'r|' + s.game + s.q;
    else k = 'final|' + s.game;

    if (k !== viewKey) {
      viewKey = k;
      clearLater();
      lastCount = ''; lastN = -1; liveRows = null;
      if (p === 'none') stage.innerHTML = `<div class="view gate"><h1 class="title">Hunt the Sign</h1></div>`;
      else if (p === 'lobby') drawLobby();
      else if (p === 'reveal') { drawReveal(); sound.play('reveal'); }
      else if (p === 'final') drawFinal();
      else drawQuestion();
    }
    if (p === 'lobby') updateLobby();
    drawCtl();
    tick();
  }

  function drawLobby() {
    let qr = '';
    try {
      const code = window.qrcode(0, 'M');
      code.addData(joinUrl);
      code.make();
      qr = code.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
    } catch (e) {}
    stage.innerHTML = `<div class="view lobby">
      <div class="how"><h1 class="title">Hunt the Sign</h1>
        <p class="url">${joinText.split('/').map((part, i, all) => `<span>${esc(part)}${i < all.length - 1 ? '/' : ''}</span>`).join('<wbr>')}</p>
        <div class="qr">${qr}</div></div>
      <div class="who"><p class="n" id="n">0</p>
        <div class="names" id="names"></div></div></div>`;
    stage.querySelector('.qr svg') && stage.querySelector('.qr svg').setAttribute('aria-label', 'QR code for ' + joinText);
  }

  function updateLobby() {
    const box = document.getElementById('names');
    if (!box) return;
    const n = document.getElementById('n');
    if (s.board.length !== lastN) { if (lastN >= 0 && s.board.length > lastN) { sound.play('join'); if (window.HTS_SKY) window.HTS_SKY.burst(0.7); } lastN = s.board.length; n.textContent = lastN; pop(n); }
    const have = new Map([...box.children].map(b => [b.dataset.id, b]));
    for (const pl of s.board.slice().sort((a, b) => a.name.localeCompare(b.name))) {
      if (have.has(pl.id)) { have.delete(pl.id); continue; }
      const b = document.createElement('button');
      b.dataset.id = pl.id; b.dataset.a = 'kick'; b.textContent = pl.name; b.title = 'Remove ' + pl.name;
      box.appendChild(b);
    }
    have.forEach(b => b.remove());
  }

  const optsHtml = (q, extra) => `<div class="hopts ${q.opts.length === 3 ? 'three' : ''} ${extra || ''}" id="hopts">${q.opts.map((o, i) =>
    `<div class="hopt" data-i="${i}" style="--i:${i}"><i class="fill"></i><span class="k">${LETTERS[i]}</span><span>${esc(o)}</span><span class="n"></span></div>`).join('')}</div>`;

  const banner = q => (MODES[q.mode] ? `<div class="banner">${MODES[q.mode]}</div>` : '');

  function drawQuestion() {
    const q = s.question;
    stage.innerHTML = `<div class="view q solo live"><div class="left">
      ${banner(q)}
      <div class="timer"><span class="secs" id="secs"></span><div class="bar" id="bar"><i></i></div></div>
      <h1 class="prompt serif">${esc(q.prompt)}</h1>
      ${optsHtml(q, 'hold stag')}
      <div class="pips" id="pips"></div></div>
      <aside class="board"><div class="rows" id="rows"></div></aside></div>`;
    drawBoard(true);
  }

  function drawReveal() {
    const q = s.question, rv = s.reveal || {}, poll = q.kind === 'poll';
    const counts = rv.counts || [], total = counts.reduce((a, b) => a + b, 0), most = Math.max(1, ...counts);
    stage.innerHTML = `<div class="view q revealed"><div class="left">
      ${banner(q)}
      <h1 class="prompt serif">${esc(q.prompt)}</h1>
      ${optsHtml(q)}
      ${evidence(rv)}</div>
      <aside class="board"><div class="rows" id="rows"></div></aside></div>`;
    stage.querySelectorAll('.hopt').forEach((el, i) => {
      const n = counts[i] || 0;
      el.querySelector('.n').textContent = poll ? (total ? Math.round(100 * n / total) : 0) + '%' : n;
      later(() => { el.querySelector('.fill').style.transform = `scaleX(${n / (poll ? Math.max(1, total) : most)})`; }, 60);
      if (!poll) later(() => { el.classList.add(i === rv.answer ? 'right' : 'dim'); }, 500);
    });
    drawBoard();
  }

  /* The leaderboard. It stays up through every question in the order from before that
     question, with a mark beside each player whose answer is in. On the reveal the rows
     slide to the new order while the scores count up. */
  function drawBoard(live) {
    const rows = document.getElementById('rows');
    const h = Math.max(36, Math.floor(rows.clientHeight / SHOWN));
    const before = s.board.slice().sort((a, b) => b.prev - a.prev || a.name.localeCompare(b.name));
    const after = s.board.slice().sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const rankIn = (list, f, pl) => 1 + list.filter(x => x[f] > pl[f]).length;
    const used = s.used || {};
    const els = new Map();
    const place = (el, i) => {
      el.style.transform = `translateY(${Math.min(i, SHOWN) * h}px)`;
      el.classList.toggle('out', i >= SHOWN);
    };
    before.forEach((pl, i) => {
      const el = document.createElement('div');
      el.className = 'row';
      el.style.height = h + 'px';
      const chips = live ? '' : (used[pl.id] ? `<i class="chip">${POWERS[used[pl.id]]}</i>` : '') + (pl.streak >= 3 ? `<i class="chip line">${pl.streak} in a row</i>` : '');
      el.innerHTML = `<span class="r">${rankIn(before, 'prev', pl)}</span><span class="nm"><span>${esc(pl.name)}</span>${chips}</span><span class="mv"></span><span class="sc"><span class="v">${fmt(pl.prev)}</span><span class="gn"></span></span>`;
      place(el, i);
      rows.appendChild(el);
      els.set(pl.id, el);
    });
    if (live) {
      if (before[0] && before[0].prev > 0 && (!before[1] || before[0].prev > before[1].prev)) els.get(before[0].id).classList.add('first');
      liveRows = els;
      return;
    }
    later(() => {
      sound.play('board');
      const t0 = performance.now(), dur = 800;
      after.forEach((pl, i) => {
        const el = els.get(pl.id);
        place(el, i);
        const was = rankIn(before, 'prev', pl), is = rankIn(after, 'score', pl);
        el.querySelector('.r').textContent = is;
        const mv = el.querySelector('.mv');
        mv.textContent = is < was ? '▲' + (was - is) : is > was ? '▼' + (is - was) : '';
        mv.className = 'mv ' + (is < was ? 'up' : 'down');
        const gn = el.querySelector('.gn');
        gn.textContent = pl.gain ? '+' + fmt(pl.gain) : pl.answered ? '+0' : '';
        gn.classList.toggle('zero', !pl.gain);
        el.classList.toggle('first', i === 0 && pl.score > 0);
        if (pl.gain && i > 0) el.classList.add('hit');
      });
      const run = t => {
        const f = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - f, 3);
        after.forEach(pl => { const el = els.get(pl.id); if (el.isConnected) el.querySelector('.v').textContent = fmt(Math.round(pl.prev + (pl.score - pl.prev) * e)); });
        if (f < 1 && rows.isConnected) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, 1300);
  }

  function drawFinal() {
    const b = s.board, top = b.slice(0, 3);
    const tiers = s.tiers || {};
    const pod = [1, 0, 2].map(i => top[i] ? `<div class="step p${i + 1}" data-p="${i + 1}"><p class="nm">${esc(top[i].name)}</p><p class="sc">${fmt(top[i].score)}</p><div class="blk">${i + 1}</div></div>` : '<div></div>').join('');
    stage.innerHTML = `<div class="view final"><div class="podium">${pod}</div>
      <div class="side">
        <div class="tiers">${TIERS.map(t => `<div><b>${tiers[t] || 0}</b><span>${t}${(tiers[t] || 0) === 1 ? '' : 's'}</span></div>`).join('')}</div>
        <div class="rest">${b.slice(3, 15).map((pl, i) => `<div style="--i:${i}"><span class="muted">${i + 4}</span><span>${esc(pl.name)}</span><b>${fmt(pl.score)}</b></div>`).join('')}</div>
      </div></div>`;
    [[3, 600], [2, 1900], [1, 3400]].forEach(([n, ms]) => later(() => {
      const el = stage.querySelector('.step.p' + n); if (el) el.classList.add('show');
      sound.play(n === 1 ? 'fanfare' : 'step');
      if (n === 1) { confetti(stage, 140); const side = stage.querySelector('.side'); if (side) side.classList.add('show'); }
    }, ms));
  }

  /* ---------- the control bar ---------- */

  function drawCtl() {
    if (!s) return;
    const p = phase();
    const last = s.q + 1 >= s.total;
    const label = p === 'none' ? 'open a game' : p === 'lobby' ? 'start' : p === 'ready' ? 'get ready'
      : p === 'open' ? 'end question' : p === 'final' ? 'game over' : last ? 'podium' : 'next question';
    const inQ = p === 'ready' || p === 'open';
    const canSkip = (p === 'lobby' || p === 'reveal' || p === 'closed') && s.q + 2 < s.total;
    const k = [p, s.q, s.secs, armed, busy, fails > 1, label, sound.on()].join('|');
    if (k === ctlKey) return;
    ctlKey = k;
    ctl.innerHTML = `<button class="btn primary" data-a="go" ${busy || p === 'ready' || p === 'final' ? 'disabled' : ''}>${label}</button>
      ${inQ ? `<button class="btn small" data-a="time" data-v="10">+10 s</button><button class="btn small" data-a="time" data-v="-5">−5 s</button>` : ''}
      ${p !== 'none' && p !== 'final' ? `<span class="sep"></span><span class="label">timer</span>${[10, 15, 20, 30].map(n => `<button class="btn small ${s.secs === n ? 'on' : ''}" data-a="secs" data-v="${n}">${n}</button>`).join('')}` : ''}
      ${canSkip ? `<span class="sep"></span><button class="btn small" data-a="skip">skip next</button>` : ''}
      <span class="gap"></span>
      ${fails > 1 ? '<span class="msg">reconnecting</span>' : ''}
      <button class="btn small" data-a="snd" title="M">${sound.on() ? 'sound on' : 'sound off'}</button>
      <button class="btn small" data-a="full">full screen</button>
      ${p !== 'none' && p !== 'final' && p !== 'lobby' ? `<button class="btn small warn" data-a="end">${armed === 'end' ? 'press again' : 'end game'}</button>` : ''}
      ${p !== 'none' ? `<button class="btn small warn" data-a="new">${armed === 'new' ? 'press again' : 'new game'}</button>` : ''}`;
  }

  function arm(what) {
    if (armed === what) { armed = ''; clearTimeout(armedTimer); return true; }
    armed = what; clearTimeout(armedTimer);
    armedTimer = setTimeout(() => { armed = ''; drawCtl(); }, 3000);
    drawCtl();
    return false;
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    const a = b.dataset.a, v = Number(b.dataset.v);
    if (a === 'go') go();
    else if (a === 'time') act('hts_host_time', { p_delta: v });
    else if (a === 'secs') act('hts_host_secs', { p_secs: v });
    else if (a === 'skip') act('hts_host_goto', { p_step: step(), p_q: s.q + 2 });
    else if (a === 'kick') act('hts_host_kick', { p_player: b.dataset.id });
    else if (a === 'end') { if (arm('end')) act('hts_host_end'); }
    else if (a === 'new') { if (arm('new')) act('hts_host_new'); }
    else if (a === 'snd') { sound.toggle(); drawCtl(); }
    else if (a === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
    if (b.blur) b.blur();
  });

  /* The password box on the gate screen. */
  document.addEventListener('submit', e => {
    if (!e.target || e.target.id !== 'gf') return;
    e.preventDefault();
    const v = document.getElementById('gk').value;
    if (!v) return;
    key = v; denied = false; viewKey = '';
    try { localStorage.setItem(KEY, v); } catch (err) {}
    stage.innerHTML = '';
    poll();
  });

  /* Space, Enter, right arrow or Page Down (a slide clicker) all press the main button. */
  document.addEventListener('keydown', e => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if ([' ', 'Enter', 'ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); go(); }
    else if (e.key === '+' || e.key === '=') { if (phase() === 'open' || phase() === 'ready') act('hts_host_time', { p_delta: 10 }); }
    else if (e.key === 'f' || e.key === 'F') { const b = ctl.querySelector('[data-a="full"]'); if (b) b.click(); }
    else if (e.key === 'm' || e.key === 'M') { sound.toggle(); drawCtl(); }
  });

  /* The valley follows the game: closer for a question, a flare in the last five seconds. */
  function setMood() {
    if (!s) return;
    const p = phase();
    const m = p === 'none' || p === 'lobby' ? 'lobby' : p === 'ready' ? 'ready' : p === 'reveal' ? 'reveal' : p === 'final' ? 'final'
      : p === 'open' && s.closes_at - now() <= 5000 ? 'low' : 'open';
    mood(m, typeof s.q === 'number' ? s.q : 0);
  }

  /* The clock, ten times a second. */
  let lastP = '';
  function tick() {
    if (!s) return;
    const p = phase();
    if (p !== lastP) { if (p === 'open' && lastP === 'ready') sound.play('go'); lastP = p; }
    if (p === 'open') setMood();
    if ((p === 'open' || p === 'closed') && ctlKey.split('|')[0] !== p) drawCtl();
    const secs = document.getElementById('secs');
    if (!secs) return;
    const bar = document.getElementById('bar'), opts = document.getElementById('hopts'), pips = document.getElementById('pips');
    const t = now(), left = Math.max(0, s.closes_at - t), span = Math.max(1, s.closes_at - s.opens_at);
    const n = String(p === 'ready' ? Math.max(1, Math.min(3, Math.ceil((s.opens_at - t) / 1000))) : Math.ceil(left / 1000));
    if (n !== lastCount) {
      lastCount = n; secs.textContent = n;
      if (p === 'ready' || (left <= 5000 && left > 0)) pop(secs);
      if (p === 'ready') sound.play('tick'); else if (p === 'open' && left <= 5000 && left > 0) sound.play('low');
    }
    secs.classList.toggle('soon', p === 'ready');
    secs.classList.toggle('low', p !== 'ready' && left <= 5000);
    bar.classList.toggle('low', p !== 'ready' && left <= 5000);
    bar.firstElementChild.style.transform = `scaleX(${p === 'ready' ? 1 : Math.min(1, left / span)})`;
    opts.classList.toggle('hold', p === 'ready');
    if (stage.firstElementChild) stage.firstElementChild.classList.toggle('is-ready', p === 'ready');
    /* One square for each player, filled in as the answers arrive. */
    if (pips.children.length !== s.players) pips.innerHTML = '<i></i>'.repeat(s.players);
    for (let i = 0; i < pips.children.length; i++) pips.children[i].classList.toggle('on', i < s.answered);
    if (liveRows) for (const pl of s.board) { const el = liveRows.get(pl.id); if (el) el.classList.toggle('in', !!pl.answered && p !== 'ready'); }
  }
  setInterval(tick, 100);

  sound.ambient(true);
  paintScene({ moon: [1480, 170, 40], shoot: [1130, 70] });
  poll();
})();
