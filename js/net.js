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

  /* The line from the book that backs the answer. */
  function evidence(rv) {
    if (!rv || !rv.ev) return '';
    const ev = rv.ev;
    const q = ev.fact ? esc(ev.q) : '\u201C' + esc(ev.q) + '\u201D';
    return `<div class="evidence"><p class="quote">${q} <span class="cite">(${esc(ev.cite)})</span></p>${ev.fact || !ev.who ? '' : `<p class="who">${esc(ev.who)}</p>`}</div>`;
  }

  const MODES = { double: 'double points', lightning: 'lightning' };
  const POWERS = { fifty: '50/50', double: '2x', peek: 'peek' };
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Square confetti, falling from the top of a box. */
  function confetti(box, n) {
    if (calm || !box || !box.animate) return;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    const colours = ['#15181c', '#1c6b37', '#b8860b', '#15181c', '#c9c4b6'];
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

  window.HTS = { rpc, esc, ord, fmt, LETTERS, MODES, POWERS, phaseNow, evidence, confetti, calm, now: () => Date.now() + offset };
})();
