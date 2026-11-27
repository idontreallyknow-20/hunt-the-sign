/* Hunt the Sign (live). Shared by the phone page and the host page:
   calls to the game server, a clock matched to the server's, small helpers. */
(function () {
  'use strict';
  const C = window.HTS_CONFIG;
  /* On a test machine the page talks to a local stand-in, unless the address ends in ?live. */
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !/[?&]live\b/.test(location.search);
  const base = (local ? location.origin : C.api) + '/rest/v1/rpc/';

  /* Every phone's clock is a little off. Each reply carries the server's time, and the
     reply that came back fastest gives the best estimate of the difference. */
  const samples = [];
  let offset = 0;
  function sync(serverNow, t0, t1) {
    samples.push({ rtt: t1 - t0, off: serverNow - (t0 + t1) / 2 });
    if (samples.length > 12) samples.shift();
    offset = samples.reduce((a, b) => (b.rtt < a.rtt ? b : a)).off;
  }

  async function rpc(fn, args, timeout) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout || 6000);
    const t0 = Date.now();
    try {
      const r = await fetch(base + fn, {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: C.key, authorization: 'Bearer ' + C.key },
        body: JSON.stringify(args || {}),
        signal: ctl.signal,
        cache: 'no-store'
      });
      const t1 = Date.now();
      const j = await r.json();
      if (!r.ok) {
        const e = new Error((j && j.message) || 'http ' + r.status);
        e.status = r.status;
        throw e;
      }
      if (j && typeof j.now === 'number') sync(j.now, t0, t1);
      return j;
    } finally {
      clearTimeout(timer);
    }
  }

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ord = n => {
    const v = n % 100;
    return n + (v >= 11 && v <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  };
  const fmt = n => Number(n || 0).toLocaleString('en-CA');
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* What the screen should show right now. The server only stores when a question
     opens and closes, so "ready", "open" and "closed" are worked out from the clock. */
  function phaseNow(s) {
    if (!s) return 'none';
    if (s.phase !== 'ready' && s.phase !== 'open') return s.phase;
    const t = Date.now() + offset;
    if (t < s.opens_at) return 'ready';
    if (t < s.closes_at) return 'open';
    return 'closed';
  }

  /* Why the answer is the answer: a short line, then the line from the book that backs it. */
  function evidence(rv) {
    if (!rv || (!rv.ev && !rv.why)) return '';
    const ev = rv.ev;
    const why = rv.why ? `<p class="why">${esc(rv.why)}</p>` : '';
    const lead = rv.lead && ev ? `<p class="lead">${esc(rv.lead)}</p>` : '';
    if (!ev) return `<div class="evidence">${why}</div>`;
    const q = ev.fact ? esc(ev.q) : '\u201C' + esc(ev.q) + '\u201D';
    return `<div class="evidence">${why}${lead}<p class="quote">${q} <span class="cite">(${esc(ev.cite)})</span></p>${ev.fact || !ev.who ? '' : `<p class="who">${esc(ev.who)}</p>`}</div>`;
  }

  const MODES = { double: 'double points', lightning: 'lightning' };
  const POWERS = { fifty: '50/50', double: '2x', peek: 'peek' };
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Square confetti, falling from the top of a box. */
  function confetti(box, n) {
    if (calm || !box || !box.animate) return;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    const colours = ['#f1eadb', '#f0aa4f', '#86dba0', '#c9822b', '#f1eadb'];
    const h = box.clientHeight || window.innerHeight;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i');
      const size = 6 + Math.random() * 10;
      el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;background:${colours[i % colours.length]}`;
      layer.appendChild(el);
      const drift = (Math.random() - 0.5) * 240, spin = (Math.random() - 0.5) * 1080;
      el.animate([
        { transform: 'translate(0,-30px) rotate(0deg)', opacity: 1 },
        { transform: `translate(${drift}px,${h + 40}px) rotate(${spin}deg)`, opacity: 1 }
      ], { duration: 2200 + Math.random() * 2200, delay: Math.random() * 1400, easing: 'cubic-bezier(0.3,0,0.7,1)', fill: 'both' });
    }
    box.appendChild(layer);
    setTimeout(() => layer.remove(), 6200);
  }

  /* The flat night scene: stars, a moon, three ridges, spruce, a trail of signs and a small
     fire. It goes up first, and stays if the 3D valley (js/sky.js) cannot run on this device. */
  function scene(o) {
    if (document.querySelector('.scene')) return;
    let seed = 11;
    const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const W = 1600, H = 900, n = v => v.toFixed(1);
    let stars = '';
    for (let i = 0; i < 110; i++) {
      const z = r() < 0.18 ? 3.4 : 2;
      stars += `<rect class="st${i % 3 === 0 ? ' tw' : ''}" style="--d:${n(r() * 6)}s" x="${n(r() * W)}" y="${n(r() * 640)}" width="${z}" height="${z}" opacity="${n(0.35 + r() * 0.65)}"/>`;
    }
    const ridge = (base, a1, f1, a2, f2, jit, step, fill) => {
      let d = `M-20 ${H}`;
      for (let x = -20; x <= W + 20; x += step) d += `L${x} ${n(base + a1 * Math.sin(x / f1 + base) + a2 * Math.sin(x / f2 + 2) + (r() - 0.5) * jit)}`;
      return `<path d="${d}L${W + 20} ${H}Z" fill="${fill}"/>`;
    };
    const hill = x => 806 + 16 * Math.sin(x / 250 + 1.3) + 7 * Math.sin(x / 83 + 0.4);
    let near = `M-20 ${H}`;
    for (let x = -20; x <= W + 20; x += 20) near += `L${x} ${n(hill(x))}`;
    let trees = '';
    for (let i = 0; i < 30; i++) {
      const x = r() * W;
      if (Math.abs(x - 800) < 150) continue;
      const h = 46 + r() * 84, w = h * 0.2, y = hill(x) + 4;
      trees += `<path d="M${n(x)} ${n(y - h)}L${n(x + w * 0.5)} ${n(y - h * 0.62)}L${n(x + w * 0.22)} ${n(y - h * 0.62)}L${n(x + w * 0.8)} ${n(y - h * 0.3)}L${n(x + w * 0.3)} ${n(y - h * 0.3)}L${n(x + w)} ${n(y)}L${n(x - w)} ${n(y)}L${n(x - w * 0.3)} ${n(y - h * 0.3)}L${n(x - w * 0.8)} ${n(y - h * 0.3)}L${n(x - w * 0.22)} ${n(y - h * 0.62)}L${n(x - w * 0.5)} ${n(y - h * 0.62)}Z"/>`;
    }
    let trail = '';
    for (let x = 270; x <= 750; x += 30) trail += (trail ? 'L' : 'M') + x + ' ' + n(hill(x) + 22 - (x - 270) / 480 * 12);
    let embers = '';
    for (let i = 0; i < 9; i++) embers += `<rect class="em" x="${n(-10 + r() * 20)}" y="-34" width="3" height="3" fill="#e0a458" style="--x:${n((r() - 0.5) * 70)}px;--t:${n(2.4 + r() * 2.6)}s;--d:${n(r() * 4)}s"/>`;
    const [mx, my, mq] = o.moon, fy = n(hill(800) + 6);
    const el = document.createElement('div');
    el.className = 'scene';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" focusable="false">
      <defs><radialGradient id="sc-m"><stop offset="0" stop-color="#f3e7c9" stop-opacity="0.45"/><stop offset="1" stop-color="#f3e7c9" stop-opacity="0"/></radialGradient>
      <radialGradient id="sc-f"><stop offset="0" stop-color="#e0a458" stop-opacity="0.55"/><stop offset="0.5" stop-color="#c9822b" stop-opacity="0.16"/><stop offset="1" stop-color="#c9822b" stop-opacity="0"/></radialGradient></defs>
      <g fill="#f3e9d2">${stars}</g>
      <g transform="rotate(20 ${o.shoot[0]} ${o.shoot[1]})"><rect class="shoot" x="${o.shoot[0]}" y="${o.shoot[1]}" width="70" height="2" fill="#f3e9d2"/></g>
      <circle cx="${mx}" cy="${my}" r="${mq * 4.4}" fill="url(#sc-m)"/><circle cx="${mx}" cy="${my}" r="${mq}" fill="#f3e9d2"/>
      <circle cx="${mx - mq * 0.3}" cy="${my - mq * 0.25}" r="${mq * 0.2}" fill="#dccfb0"/><circle cx="${mx + mq * 0.28}" cy="${my + mq * 0.3}" r="${mq * 0.14}" fill="#dccfb0"/>
      ${ridge(640, 46, 210, 22, 61, 26, 46, '#33403a')}${ridge(716, 34, 170, 16, 47, 18, 38, '#232e28')}
      <path d="${near}L${W + 20} ${H}Z" fill="#141c17"/>
      <g fill="#0d1411">${trees}</g>
      <path class="trail" d="${trail}" fill="none" stroke="#c9822b" stroke-width="4"/>
      <g transform="translate(800 ${fy}) scale(1.5)">
        <circle class="glow" r="120" fill="url(#sc-f)"/>
        <path class="fl f1" d="M-16 0Q-24 -26 0 -54Q24 -26 16 0Z" fill="#c9822b"/>
        <path class="fl f2" d="M-10 0Q-14 -18 0 -37Q14 -18 10 0Z" fill="#e0a458"/>
        <path class="fl f3" d="M-5 0Q-7 -10 0 -21Q7 -10 5 0Z" fill="#ffe9b0"/>
        <rect x="-25" y="-3" width="50" height="6" fill="#070b09" transform="rotate(11)"/><rect x="-25" y="-3" width="50" height="6" fill="#070b09" transform="rotate(-11)"/>
        ${embers}
      </g></svg><i class="veil"></i><i class="wash"></i>`;
    document.body.insertBefore(el, document.body.firstChild);
    loadSky();
  }
  /* Every screen is a night screen now. Kept so an older page script can still call it. */
  function night() {
    document.documentElement.classList.add('night');
  }

  /* The 3D valley is one extra file, fetched after the game is already on screen.
     ?sky=off in the address turns it off. */
  function loadSky() {
    if (/[?&]sky=off\b/.test(location.search)) return;
    if (navigator.connection && navigator.connection.saveData) return;
    const go = () => {
      const tag = document.createElement('script');
      tag.src = 'js/sky.js?v=5';
      tag.async = true;
      document.head.appendChild(tag);
    };
    if (document.readyState === 'complete') setTimeout(go, 60);
    else window.addEventListener('load', () => setTimeout(go, 60));
  }

  /* What the valley should feel like right now: 'lobby', 'ready', 'open', 'low', 'locked',
     'reveal', 'ok', 'no', 'poll' or 'final'. The stylesheet reads it too. */
  let moodKey = '';
  function mood(name, q) {
    const k = name + '|' + (typeof q === 'number' ? q : '');
    if (k === moodKey) return;
    moodKey = k;
    window.HTS.moodNow = [name, q];
    document.documentElement.setAttribute('data-mood', name);
    if (window.HTS_SKY) window.HTS_SKY.mood(name, q);
  }

  /* ---------- sound: a small synth, clean tones only (no noise, no audio files) ---------- */

  const SND = 'hts-sound';
  let sndOn = true, unlocked = false, ac = null, out = null;
  try { sndOn = localStorage.getItem(SND) !== '0'; } catch (e) {}
  function audio() {
    if (!sndOn || !unlocked) return null;
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ac = new AC(); } catch (e) { return null; }
      const comp = ac.createDynamicsCompressor();
      out = ac.createGain();
      out.gain.value = 0.6;
      out.connect(comp); comp.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    return ac.state === 'closed' ? null : ac;
  }
  function tone(f, at, dur, o) {
    o = o || {};
    const t = ac.currentTime + at, osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.dest || out);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  const bell = (f, at, dur, vol) => { tone(f, at, dur, { vol }); tone(f * 2.01, at, dur * 0.6, { vol: vol * 0.3 }); tone(f * 3.02, at, dur * 0.3, { vol: vol * 0.1 }); };
  const thud = (at, vol) => { tone(130, at, 0.28, { to: 48, vol: vol || 0.5, attack: 0.004 }); };
  const SOUNDS = {
    tick: () => { tone(740, 0, 0.1, { type: 'triangle', vol: 0.22 }); tone(370, 0, 0.12, { vol: 0.12 }); },
    go: () => { bell(659.25, 0, 0.3, 0.2); bell(987.77, 0.1, 0.55, 0.22); },
    low: () => { tone(1046.5, 0, 0.07, { type: 'triangle', vol: 0.2 }); tone(98, 0, 0.16, { to: 62, vol: 0.3 }); },
    lock: () => { tone(520, 0, 0.13, { to: 830, type: 'triangle', vol: 0.22 }); },
    power: () => { tone(330, 0, 0.26, { to: 1320, type: 'sawtooth', vol: 0.07 }); bell(1318.5, 0.2, 0.4, 0.14); },
    join: () => { tone(620, 0, 0.1, { to: 1040, vol: 0.16 }); },
    ok: () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(f, i * 0.085, 0.6, 0.2)); },
    no: () => { tone(311.13, 0, 0.24, { type: 'triangle', vol: 0.2 }); tone(233.08, 0.2, 0.42, { type: 'triangle', vol: 0.2 }); thud(0.2, 0.4); },
    poll: () => { bell(587.33, 0, 0.5, 0.16); },
    reveal: () => { tone(196, 0, 0.45, { to: 392, vol: 0.1, attack: 0.3 }); thud(0.45, 0.55); [392, 523.25, 659.25].forEach(f => bell(f, 0.47, 0.9, 0.13)); },
    board: () => { tone(330, 0, 0.35, { to: 660, vol: 0.08, attack: 0.2 }); },
    step: () => { thud(0, 0.6); bell(392, 0.02, 0.5, 0.12); },
    fanfare: () => {
      thud(0, 0.7);
      [523.25, 659.25, 783.99].forEach((f, i) => bell(f, i * 0.11, 0.4, 0.2));
      [1046.5, 1318.5, 1568].forEach(f => { bell(f, 0.36, 1.6, 0.16); tone(f / 2, 0.36, 1.4, { type: 'triangle', vol: 0.07 }); });
    }
  };
  function play(name) {
    if (!SOUNDS[name] || !audio()) return;
    try { SOUNDS[name](); } catch (e) {}
  }
  /* No background sound: the looping fire was filtered noise and read as static in the room.
     Kept as a no-op so the host screen can still call it. */
  function ambient() {}
  function setSound(on) {
    sndOn = !!on;
    try { localStorage.setItem(SND, sndOn ? '1' : '0'); } catch (e) {}
  }
  /* Browsers only allow sound after a tap or a key press. */
  const unlock = () => { unlocked = true; audio(); };
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  const buzz = pattern => { try { if (sndOn && navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
  const sound = { play, ambient, buzz, on: () => sndOn, set: setSound, toggle: () => { setSound(!sndOn); return sndOn; } };

  window.HTS = { rpc, esc, ord, fmt, LETTERS, MODES, POWERS, phaseNow, evidence, confetti, calm, scene, night, mood, sound, now: () => Date.now() + offset };
})();
