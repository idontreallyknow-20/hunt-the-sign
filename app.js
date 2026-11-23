/* Hunt the Sign. A class game for Medicine Walk by Richard Wagamese. Made with AI assistance (Claude). */
/* The public address of the deployed site. Leave empty to hide the join code. */
const SITE_URL = "https://idontreallyknow-20.github.io/hunt-the-sign";

/* =====================================================================================
   EDIT HERE: GROUP CONTENT
   Everything the class sees comes from this block. Anything in [square brackets] is a
   placeholder for the group's own analysis. Replace the whole bracket, including the
   brackets, with your own words. Quotes, speakers and pages were checked against the
   novel. Do not change those without checking your paper copy.
   ===================================================================================== */
const GAME = {
  title: 'Hunt the Sign',
  novel: 'Medicine Walk',
  author: 'Richard Wagamese',
  course: 'NBE3U Book Club Seminar',
  crew: ['Joseph', 'Ethan', 'Nicholas', 'Horace', 'Bryan'],
  minutes: 4,          // length of the hunt
  talkSeconds: 20,     // table talk before each vote
  shareSeconds: 60     // partner talk on the final question
};

/* The four themes the class votes on. */
const THEMES = [
  { id: 'truth', name: 'Truth heals',            about: 'Honesty repairs what silence broke' },
  { id: 'land',  name: 'The land teaches',       about: 'Nature is where Frank learns who to be' },
  { id: 'story', name: 'Stories are inheritance', about: 'A story is what one generation leaves the next' },
  { id: 'pain',  name: 'Facing pain',            about: 'Turning toward what hurts makes a full life' }
];

/* The eight signs.
   ourPick     : the theme id your group chose (truth, land, story or pain). Confirm each one.
   ourReason   : YOUR explanation of why the quote fits the theme.
   ourEvidence : the exact words inside the quote that prove it.
   ourILT      : which Indigenous Literary Theory question it answers, and how.
   reader      : who reads this sign aloud. Change freely so everyone speaks. */
const SIGNS = [
  { quote: 'You don’t hunt the animal. You hunt their sign.', page: 33,
    speaker: 'The old man', context: 'teaching Frank to track', ourPick: 'land', reader: 'Joseph',
    ourReason: 'The old man teaches Frank to track before he lets him do anything else. Reading sign makes Frank slow down and learn how an animal thinks, so the land trains his patience before he ever takes from it.',
    ourEvidence: '“hunt their sign”: you follow a sign by paying attention, not by force.',
    ourILT: 'How do we learn to be human? By watching and listening to the land before taking from it.' },
  { quote: 'But me, I figure everything’s holy.', page: 36,
    speaker: 'The old man', context: 'teaching Frank to give thanks for the buck', ourPick: 'land', reader: 'Ethan',
    ourReason: 'The old man has Frank thank the buck for its life before anything else. If everything is holy, the land is not a storehouse. A life taken from it is a gift that has to be honoured.',
    ourEvidence: '“everything’s holy”: everything includes the buck, so the kill calls for thanks.',
    ourILT: 'How do we learn to be human? Through gratitude and respect for living things.' },
  { quote: 'Weren’t no good old days. But you need to hear still. It’s all I got to give ya.', page: 23,
    speaker: 'Eldon', context: 'to Frank, before the walk begins', ourPick: 'story', reader: 'Nicholas',
    ourReason: 'Eldon has no farm, no money and no good memories to hand down. The only thing he can leave his son is the truth of his life, so his story becomes Frank’s inheritance.',
    ourEvidence: '“It’s all I got to give ya”: the story is the whole gift.',
    ourILT: 'How do we become good ancestors? By passing down our story, even a painful one.' },
  { quote: 'It’s all we are in the end. Our stories.', page: 103,
    speaker: 'Becka Charlie', context: 'to Frank', ourPick: 'story', reader: 'Horace',
    ourReason: 'Frank complains that all he has from Eldon is stories. Becka turns that around. Stories are not a poor substitute for knowing a person. They are the person, and they are what is left when a life ends.',
    ourEvidence: '“all we are in the end”: when a life is over, the story is what remains.',
    ourILT: 'How do we become good ancestors? What we leave behind is the story others carry.' },
  { quote: 'a man oughta know why he’s called what he is', page: 158,
    speaker: 'Eldon', context: 'passing on what Jimmy told him', ourPick: 'truth', reader: 'Bryan',
    ourReason: 'Eldon never knew where his own name came from until Jimmy told him. Now he passes that on to Frank, and the truth gives Frank a piece of his identity that silence had kept from him.',
    ourEvidence: '“oughta know”: knowing who you are is something a person is owed.',
    ourILT: 'How do we learn to be good relatives? By telling family the truth about who they are.' },
  { quote: 'War’s over, Eldon', page: 238,
    speaker: 'Frank', context: 'at his father’s grave', ourPick: 'truth', reader: 'Joseph',
    ourReason: 'Frank says this only after Eldon has told him everything, including the truth about his mother. Once he knows the whole story he feels weightless, and he can wish his father peace.',
    ourEvidence: '“over”: the fight inside Eldon, and between father and son, has ended.',
    ourILT: 'How do we learn to be good relatives? Through honesty, and the forgiveness it makes possible.' },
  { quote: 'Can’t run … Gotta face him.', page: 107,
    speaker: 'Frank', context: 'to Eldon, when the grizzly comes', ourPick: 'pain', reader: 'Ethan',
    ourReason: 'Frank admits he is scared, but he knows turning his back would show fear. He walks toward the bear, which is what Eldon could never do with his own trouble.',
    ourEvidence: '“Gotta face him”: the only way left is forward.',
    ourILT: 'How do we learn to be human? Courage means going forward while you are afraid.' },
  { quote: 'Gettin’ half killed once’s gotta be better’n bein’ half alive forever.', page: 102,
    speaker: 'Frank', context: 'to Eldon', ourPick: 'pain', reader: 'Nicholas',
    ourReason: 'Eldon says he ran because Jenks’ friends would have half killed him. Frank answers that running cost more. A beating ends, but a life spent hiding from shame never fully starts.',
    ourEvidence: '“half alive forever”: avoiding pain turns into a smaller life.',
    ourILT: 'How do we learn to be human? By facing what hurts instead of hiding from it.' }
];

/* The closing discussion. The question is yours to reword. */
const FINAL = {
  question: 'What’s the sign that tells you who someone really is?',
  ourLink: 'Frank learns who Eldon is the same way he learned to track. He does not chase him. He reads the signs Eldon leaves in his stories.',
  ourWorld: 'Richard Wagamese was taken from his family as a child and found them again as a young man. Like Frank, he had to learn who he was from the stories he was finally told.'
};

/* One personal cue per presenter, shown only in presenter notes. */
const CUES = {
  Joseph:   '[Joseph: your own cue or opening line]',
  Ethan:    '[Ethan: your own cue or opening line]',
  Nicholas: '[Nicholas: your own cue or opening line]',
  Horace:   '[Horace: your own cue or opening line]',
  Bryan:    '[Bryan: your own cue or opening line]'
};
/* ============================ END OF GROUP CONTENT ============================ */

/* ---------- question sets, built only from the content above ---------- */
const MODES = [
  { id: 'hunt',   name: 'Hunt',                ask: 'Which theme?' },
  { id: 'who',    name: 'Who said it',         ask: 'Who said it?' },
  { id: 'gap',    name: 'Fill the gap',        ask: 'Which word?' },
  { id: 'ilt',    name: 'Which ILT question',  ask: 'Which ILT question?' },
  { id: 'sprint', name: 'Timed sprint',        ask: 'Which theme?', tag: '90 s' }
];
const SPRINT_SECONDS = 90;
const SPEAKERS = [...new Set(SIGNS.map(s => s.speaker))];
const ILTQ = [
  { q: 'How do we learn to be human?', short: 'Human' },
  { q: 'How do we learn to be good relatives?', short: 'Good relatives' },
  { q: 'How do we become good ancestors?', short: 'Good ancestors' },
  { q: 'How do we learn to live together?', short: 'Live together' }
];
/* One blanked word per sign, in sign order. The first word is the answer; the others are words from the eight quotes. */
const GAPS = [
  ['sign', 'stories', 'animal', 'days'], ['holy', 'alive', 'over', 'killed'], ['give', 'hear', 'face', 'hunt'], ['stories', 'days', 'sign', 'war'],
  ['called', 'killed', 'holy', 'alive'], ['War', 'Sign', 'Days', 'End'], ['face', 'hunt', 'hear', 'give'], ['alive', 'killed', 'holy', 'over']
];
function choices(m, si) {
  const s = SIGNS[si];
  if (m === 'who') return { list: SPEAKERS.map(x => ({ id: x, label: x, short: x })), correct: s.speaker };
  if (m === 'ilt') return { list: ILTQ.map(x => ({ id: x.q, label: x.q, short: x.short })), correct: (ILTQ.find(x => s.ourILT.startsWith(x.q)) || ILTQ[0]).q };
  if (m === 'gap') { const g = GAPS[si], rot = (si * 3 + 1) % 4; return { list: g.map((_, k) => g[(k + rot) % 4]).map(x => ({ id: x, label: x, short: x })), correct: g[0] }; }
  return { list: THEMES.map(t => ({ id: t.id, label: t.name, short: t.name })), correct: s.ourPick };
}

/* Presenter logistics for each screen. Shown only in Notes. */
const NOTES = {
  tables: ['Leave this screen up while the class scans the code.', 'Pick the mode, the number of tables and the minutes you have.', 'Explain the rules out loud: a match scores 1, proving a pick with the quote scores 1 more.'],
  trail: ['Space starts the clock.', 'Let a different table choose each sign number.', 'Number keys open a sign. E jumps to the final question.'],
  sign: ['Read the quote aloud once, slowly.', 'Give tables about 20 seconds, then click each vote.', 'R reveals. Explain our pick in your own words, eyes on the class.', 'Ask one table to prove its answer with words from the quote, then click Proved.', 'Enter goes back to the trail.'],
  final: ['Read the question aloud, then start the 60 seconds.', 'Take three answers from different tables and mark each one.', 'Link one answer back to the novel, then hand off.'],
  results: ['Use the lowest row to pick one sign worth a second look.']
};
const KEYS = 'Space: clock. Number keys: open a sign. R: reveal. Enter: continue. E: final question. J: join code. N: notes. S: settings. F: full screen.';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const todo = s => /^\s*\[/.test(String(s || '')) ? `<span class="todo">${esc(s)}</span>` : esc(s);
const theme = id => THEMES.find(t => t.id === id) || THEMES[0];
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const modeOf = id => MODES.find(m => m.id === id) || MODES[0];

/* ---------- state (kept in memory; saved only as a convenience) ---------- */
const KEY = 'hunt-the-sign-v4';
const defSet = () => ({ count: 8, shuffle: false, timer: false, secs: 120, pages: true, reveal: 'each', contrast: false, large: false, calm: false, theme: 'system' });
const fresh = () => ({ who: 'solo', screen: 'title', open: null, sel: 0, play: null,
  host: { mode: 'hunt', teamCount: 4, teamNames: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'], order: [], rec: {}, answers: 0 },
  total: GAME.minutes * 60, remaining: GAME.minutes * 60, timeUp: false, runner: GAME.crew[0], notes: false, set: defSet() });
let state = fresh(), sheetOpen = false;
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.host && s.set) { state = Object.assign(fresh(), s, { open: null, screen: 'title', notes: false }); state.set = Object.assign(defSet(), s.set); } } catch (e) {} }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
const solo = () => state.who === 'solo';
const G = () => solo() ? state.play : state.host;
const N = () => G().order.length;
const qmode = () => G().mode === 'sprint' ? 'hunt' : G().mode;
const signAt = pos => SIGNS[G().order[pos]];
const ch = pos => choices(qmode(), G().order[pos]);
const rec = pos => state.host.rec[pos] || (state.host.rec[pos] = { votes: {}, bonus: {}, revealed: false });
const teams = () => state.host.teamNames.slice(0, state.host.teamCount);
const isFound = pos => solo() ? !!state.play.locked[pos] : !!(state.host.rec[pos] && state.host.rec[pos].revealed);
const isHit = pos => !!state.play.locked[pos] && state.play.ans[pos] === ch(pos).correct;
const shown = pos => solo() ? !!state.play.locked[pos] && (state.set.reveal === 'each' || state.play.done) : rec(pos).revealed;
const foundCount = () => G().order.filter((_, p) => isFound(p)).length;
const hits = () => state.play.order.filter((_, p) => isHit(p)).length;
function signPoints(pos, t) { const r = state.host.rec[pos]; if (!r || !r.revealed) return 0; return (r.votes[t] === ch(pos).correct ? 1 : 0) + (r.bonus[t] ? 1 : 0); }
const score = t => state.host.order.reduce((n, _, p) => n + signPoints(p, t), 0);
function makeOrder(count, shuffle) {
  const a = SIGNS.map((_, i) => i);
  if (shuffle) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, count); }
  return ({ 4: [0, 3, 5, 7], 6: [0, 1, 3, 4, 5, 7] })[count] || a;
}
function applySet(first) {
  const r = document.documentElement, s = state.set;
  if (s.theme !== 'system') r.setAttribute('data-theme', s.theme); else if (!first) r.removeAttribute('data-theme');
  if (s.contrast) r.setAttribute('data-contrast', 'high'); else r.removeAttribute('data-contrast');
  r.classList.toggle('large', !!s.large); r.classList.toggle('calm', !!s.calm);
}

/* ---------- the map: contour lines from a small height field, and the trail across it ---------- */
const MAP = (() => {
  const W = 1600, H = 1000, nx = 100, ny = 62, dx = W / nx, dy = H / ny;
  let seed = 41; const r = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const hills = [...Array(10)].map(() => ({ x: r() * W, y: r() * H, s: 150 + r() * 230, a: .45 + r() * .9 }));
  const f = (x, y) => hills.reduce((v, h) => v + h.a * Math.exp(-((x - h.x) ** 2 + (y - h.y) ** 2) / (2 * h.s * h.s)), 0) + x / W * .7 + (1 - y / H) * .7;
  const g = []; let max = 0; for (let j = 0; j <= ny; j++) { g[j] = []; for (let i = 0; i <= nx; i++) { g[j][i] = f(i * dx, j * dy); max = Math.max(max, g[j][i]); } }
  const SEG = { 1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]], 5: [[3, 0], [2, 1]], 6: [[0, 2]], 7: [[3, 0]], 8: [[3, 0]], 9: [[0, 2]], 10: [[0, 1], [3, 2]], 11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]] };
  let thin = '', thick = '', k = 0;
  for (let L = .12; L < max; L += .11, k++) {
    let d = '';
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], e = g[j + 1][i];
      const id = (a > L) << 3 | (b > L) << 2 | (c > L) << 1 | (e > L); if (!id || id === 15) continue;
      const pt = n => n === 0 ? [(i + (L - a) / (b - a)) * dx, j * dy] : n === 1 ? [(i + 1) * dx, (j + (L - b) / (c - b)) * dy] : n === 2 ? [(i + (L - e) / (c - e)) * dx, (j + 1) * dy] : [i * dx, (j + (L - a) / (e - a)) * dy];
      SEG[id].forEach(([p, q]) => { const A = pt(p), B = pt(q); d += `M${A[0].toFixed(1)} ${A[1].toFixed(1)}L${B[0].toFixed(1)} ${B[1].toFixed(1)}`; });
    }
    if (k % 4 === 3) thick += d; else thin += d;
  }
  const marks = [[250, 800], [520, 860], [800, 735], [1100, 805], [1340, 640], [1020, 520], [700, 405], [1010, 250]];
  const P = [[60, 930], ...marks, [1440, 120]];
  let route = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; route += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`; }
  const svg = fit => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="${fit}" aria-hidden="true"><path class="ct" d="${thin}"/><path class="ci" d="${thick}"/><path class="rt" d="${route}"/></svg>`;
  const pct = marks.map(([x, y]) => [x / W * 100, y / H * 100]);
  const marksFor = n => (({ 4: [0, 2, 5, 7], 6: [0, 1, 3, 4, 6, 7] })[n] || pct.map((_, i) => i)).map(i => pct[i]);
  return { svg, marksFor };
})();

/* ---------- clock ---------- */
let deadline = 0, iv = 0, talkIv = 0, talkLeft = 0;
const running = () => !!iv;
function startClock() { if (state.remaining <= 0) return; state.timeUp = false; deadline = Date.now() + state.remaining * 1000; iv = setInterval(tickClock, 200); paintClock(); }
function stopClock() { clearInterval(iv); iv = 0; paintClock(); }
function tickClock() { const r = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); if (r !== state.remaining) { state.remaining = r; paintClock(); save(); } if (r <= 0) { stopClock(); chime(); if (solo()) finishPlay(); else { state.timeUp = true; if (state.screen === 'trail' && state.open === null) render(); } } }
function nudge(d) { state.remaining = Math.max(0, Math.min(1800, state.remaining + d)); state.total = Math.max(state.total, state.remaining); if (running()) deadline = Date.now() + state.remaining * 1000; if (state.remaining > 0) state.timeUp = false; paintClock(); save(); }
function setClock(sec) { stopClock(); state.total = state.remaining = sec; state.timeUp = false; paintClock(); save(); }
function paintClock() {
  $('#time').textContent = fmt(state.remaining);
  const c = $('#clock'); c.classList.toggle('low', state.remaining <= 30 && state.remaining > 0); c.classList.toggle('done', state.remaining === 0);
  $('#playBtn').textContent = running() ? 'Pause' : 'Start';
}
function chime() { try { const A = new (window.AudioContext || window.webkitAudioContext)(); [0, .28].forEach((t, i) => { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = i ? 494 : 659; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(.0001, A.currentTime + t); g.gain.exponentialRampToValueAtTime(.18, A.currentTime + t + .03); g.gain.exponentialRampToValueAtTime(.0001, A.currentTime + t + .5); o.start(A.currentTime + t); o.stop(A.currentTime + t + .55); }); } catch (e) {} }

/* ---------- shared pieces ---------- */
const cite = s => state.set.pages ? ` (Wagamese ${s.page})` : '';
const blanked = pos => { const si = G().order[pos]; return esc(SIGNS[si].quote).replace(esc(GAPS[si][0]), '<span class="gap"></span><span class="sr">blank</span>'); };
const blankedText = pos => { const si = G().order[pos]; return SIGNS[si].quote.replace(GAPS[si][0], '_____'); };
const oursHTML = s => `<div class="ours" aria-live="polite"><h2><span>Our pick</span>${esc(theme(s.ourPick).name)}</h2><p>${todo(s.ourReason)}</p><p class="ev">${todo(s.ourEvidence)}</p><p class="ilt">${todo(s.ourILT)}</p></div>`;
function quoteHTML(pos, open) {
  const s = signAt(pos), m = qmode();
  const text = m === 'gap' && !open ? blanked(pos) : esc(s.quote);
  const who = m === 'who' && !open ? cite(s).trim() : `<b>${esc(s.speaker)}</b>, ${esc(s.context)}${cite(s)}`;
  return `<div class="s-quote"><blockquote class="quote">“${text}”</blockquote><p class="who">${who}</p>${open ? oursHTML(s) : ''}</div>`;
}
const seg = (act, items, cur, label, extra = '') => `<div class="seg" role="group" aria-label="${esc(label)}">${items.map(([v, l]) => `<button data-act="${act}" ${extra} data-v="${esc(v)}" aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join('')}</div>`;
const shortUrl = () => SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* ---------- views ---------- */
const V = {};
V.title = () => { const p = state.play, mid = p && !p.done && p.mode !== 'sprint' && Object.keys(p.locked).length > 0;
  return `<div class="page gut t-title">
    <h1>${esc(GAME.title)}</h1>
    <div class="t-rule">
      <blockquote class="epi">“${esc(SIGNS[0].quote)}”<cite>${esc(GAME.author)}, <i>${esc(GAME.novel)}</i> (${SIGNS[0].page})</cite></blockquote>
      <div class="t-go">
        <ol class="opts modes" aria-label="Game modes">${MODES.map((m, k) => `<li><button class="opt" data-act="start" data-mode="${m.id}"${k ? '' : ' id="go"'}><span class="n">${k + 1}</span><span class="nm">${esc(m.name)}</span><span class="tag">${m.tag || ''}</span></button></li>`).join('')}</ol>
        <div class="acts"><button class="link" data-act="host">Host on the projector</button>${mid ? `<button class="link" data-act="resume-play">Resume ${esc(modeOf(p.mode).name)}</button>` : ''}</div>
      </div>
    </div>
  </div>
  <div class="strip">${MAP.svg('xMidYMid slice')}</div>`; };

V.tables = () => { const h = state.host, has = h.order.some((_, p) => h.rec[p] && h.rec[p].revealed);
  return `<div class="page gut">
    <div class="t-form"><h1>Tables</h1>
      <div class="field"><span>Mode</span>${seg('hmode', MODES.filter(m => m.id !== 'sprint').map(m => [m.id, m.name]), h.mode, 'Mode')}</div>
      <div class="field"><span>How many</span>${seg('count', [3, 4, 5].map(n => [n, n]), h.teamCount, 'How many tables')}</div>
      <div class="field"><span>Names</span><div class="names">${teams().map((n, i) => `<input id="team-name-${i}" data-team="${i}" maxlength="16" value="${esc(n)}" aria-label="Name for table ${i + 1}" autocomplete="off">`).join('')}</div></div>
      <div class="field"><span>Minutes</span>${seg('mins', [3, 4, 5, 6].map(n => [n, n]), state.total / 60, 'Minutes')}</div>
      <div class="acts"><button class="btn" data-act="begin" id="go">Begin</button>${has ? '<button class="link" data-act="resume">Resume</button>' : ''}</div>
    </div>
    ${SITE_URL ? `<div class="t-join"><span class="qr" data-qr></span><p class="url">${esc(shortUrl())}</p></div>` : ''}
  </div>`; };

V.trail = () => { const n = N(), f = foundCount(), all = f === n, pos = MAP.marksFor(n), m = qmode();
  const marks = G().order.map((_, p) => `<button class="mk${isFound(p) ? ' found' : ''}${p === state.sel ? ' sel' : ''}" style="left:${pos[p][0].toFixed(2)}%;top:${pos[p][1].toFixed(2)}%" data-act="open" data-i="${p}" aria-label="Sign ${p + 1}${isFound(p) ? ', found' : ''}">${p + 1}</button>`).join('');
  let side = `<p class="kind">${esc(modeOf(G().mode).name)}</p><p class="count" aria-label="${f} of ${n} signs found">${f}<small>/ ${n}</small></p>`;
  if (solo()) { const each = state.set.reveal === 'each';
    const index = `<ol class="list" aria-label="Signs found">${G().order.map((_, p) => isFound(p)
      ? `<li><button class="rowb" data-act="open" data-i="${p}"><span class="n">${p + 1}</span><span class="q">${esc(m === 'gap' && !shown(p) ? blankedText(p) : signAt(p).quote)}</span><span class="p"><i class="sq${each ? (isHit(p) ? ' on' : '') : ' done'}"></i></span></button></li>` : '').join('')}</ol>`;
    side += f ? index + `<div class="acts">${all ? '<button class="btn" data-act="final" id="go">Score</button>' : (each ? `<span class="note">${hits()} right</span>` : '') + '<button class="link" data-act="final">Finish</button>'}</div>`
      : `<p class="hint">Open a sign. ${esc(modeOf(G().mode).ask)}</p>`; }
  else { const sc = teams().map((_, i) => score(i)), max = Math.max(...sc);
    side += `<ol class="list" aria-label="Scores">${teams().map((t, i) => `<li class="${max > 0 && sc[i] === max ? 'lead' : ''}"><div class="rowt"><span class="nm">${esc(t)}</span><span class="big">${sc[i]}</span></div></li>`).join('')}</ol>
      <div class="acts">${all || state.timeUp ? '<button class="btn" data-act="final" id="go">Final question</button>' : '<button class="link" data-act="final">Final question</button>'}${state.timeUp && !all ? '<span class="note">Time</span>' : ''}</div>`; }
  return `<div class="page gut trail"><div class="t-side">${side}</div><div class="t-map"><div class="map">${MAP.svg('none')}${marks}</div></div></div>`; };

V.sign = () => { const pos = state.open, c = ch(pos), long = qmode() === 'ilt';
  if (solo()) { const p = state.play, locked = !!p.locked[pos], mine = p.ans[pos], open = shown(pos), fact = qmode() === 'who' || qmode() === 'gap';
    const head = !locked ? modeOf(p.mode).ask : !open ? 'Locked in' : isHit(pos) ? (fact ? 'Correct' : 'Matched') : (fact ? 'Not this time' : 'We read it differently');
    return `<div class="page gut">${quoteHTML(pos, open)}
      <div class="s-ask"><h2>${head}</h2>
        <ol class="opts${long ? ' long' : ''}">${c.list.map((o, k) => `<li><button class="opt${open && o.id === c.correct ? ' pick' : ''}" data-act="pick" data-k="${k}" aria-pressed="${mine === o.id}"${locked ? ' disabled' : ''}><span class="n">${k + 1}</span><span class="nm">${esc(o.label)}</span><span class="tag">${open ? (o.id === c.correct ? (fact ? 'Answer' : 'Our pick') : mine === o.id ? 'Yours' : '') : ''}</span></button></li>`).join('')}</ol>
        <div class="acts">${locked ? '<button class="btn" data-act="close" id="go">Continue</button>' : `<button class="btn" data-act="lock" id="go"${mine ? '' : ' disabled'}>Lock in</button>`}</div>
      </div></div>`; }
  const r = rec(pos), T = teams();
  return `<div class="page gut">${quoteHTML(pos, r.revealed)}
    <div class="s-ask wide">
      ${r.revealed ? '' : '<div class="talk" aria-hidden="true"><i id="talkBar"></i></div>'}
      <table class="votes"><colgroup><col class="c-name"><col><col><col><col>${r.revealed ? '<col class="c-pts">' : ''}</colgroup>
        <thead><tr><th scope="col"><span class="sr">Table</span></th>${c.list.map(o => `<th scope="col" class="${r.revealed && o.id === c.correct ? 'pick' : ''}">${esc(o.short)}</th>`).join('')}${r.revealed ? '<th scope="col"><span class="sr">Points</span></th>' : ''}</tr></thead>
        <tbody>${T.map((n, t) => `<tr><th scope="row">${esc(n)}</th>${c.list.map((o, k) => `<td><button class="cell${r.revealed && o.id === c.correct ? ' pick' : ''}" data-act="vote" data-team="${t}" data-k="${k}" aria-pressed="${r.votes[t] === o.id}" aria-label="${esc(n)}: ${esc(o.short)}"${r.revealed ? ' disabled' : ''}></button></td>`).join('')}${r.revealed ? `<td><div class="pts"><button class="prove" data-act="prove" data-team="${t}" aria-pressed="${!!r.bonus[t]}">Proved</button><span id="pts-${t}">${signPoints(pos, t)}</span></div></td>` : ''}</tr>`).join('')}</tbody></table>
      <div class="acts">${r.revealed ? '<button class="btn" data-act="close" id="go">Continue</button>' : '<button class="btn" data-act="reveal" id="go">Reveal</button><button class="link" data-act="close">Back</button>'}</div>
    </div></div>`; };

V.sprint = () => { const p = state.play, pos = p.cur, c = ch(pos);
  return `<div class="page gut">${quoteHTML(pos, false)}
    <div class="s-ask"><h2>${pos + 1} / ${N()}</h2>
      <ol class="opts">${c.list.map((o, k) => `<li><button class="opt" data-act="sprint-pick" data-k="${k}"><span class="n">${k + 1}</span><span class="nm">${esc(o.label)}</span><span class="tag"></span></button></li>`).join('')}</ol>
    </div></div>`; };

const sprintScore = p => hits() * 100 + (Object.keys(p.locked).length === p.order.length ? (p.left || 0) * 5 : 0);
V.final = () => {
  if (solo()) { const p = state.play, n = N(), h = hits(), done = Object.keys(p.locked).length, sp = p.mode === 'sprint';
    const big = sp ? `<p class="sc-n long" aria-label="Score: ${sprintScore(p)}">${sprintScore(p)}<em>${h} of ${n} right${done === n ? `, ${p.left || 0} s left` : ''}</em></p>`
      : `<p class="sc-n" aria-label="Score: ${h} out of ${n}">${h}<small>/ ${n}</small>${done < n ? `<em>${done} of ${n} answered</em>` : ''}</p>`;
    const rows = p.order.map((_, pos) => { const c = ch(pos), mine = p.ans[pos], ok = isHit(pos), lab = id => (c.list.find(o => o.id === id) || {}).short || '';
      return `<li><span class="n">${pos + 1}</span><span class="q">${esc(signAt(pos).quote)}</span><i class="sq${ok ? ' on' : ''}"></i><span class="a">${esc(lab(c.correct))}${ok ? '' : `<s>${mine ? esc(lab(mine)) : 'no answer'}</s>`}</span></li>`; }).join('');
    return `<div class="page gut" style="flex:1;align-content:end">${big}
      <div class="sc-side"><h1>${esc(modeOf(p.mode).name)}</h1>
        <ol class="brk" aria-label="Score by sign">${rows}</ol>
        <div class="acts"><button class="btn" data-act="home" id="go">Play another mode</button><button class="link" data-act="again">Again</button></div></div>
    </div>`; }
  const T = teams(), sc = T.map((_, i) => score(i)), max = Math.max(...sc), order = T.map((n, i) => ({ n, s: sc[i] })).sort((a, b) => b.s - a.s);
  let bars = '';
  if (state.host.mode !== 'gap' && N()) { const list = ch(0).list, ta = {}; list.forEach(o => ta[o.id] = 0);
    state.host.order.forEach((_, p) => { const r = state.host.rec[p]; if (r && r.revealed) for (let t = 0; t < state.host.teamCount; t++) if (r.votes[t] in ta) ta[r.votes[t]]++; });
    const tmax = Math.max(1, ...Object.values(ta)); if (Object.values(ta).some(v => v > 0)) bars = `<div class="bars" aria-label="Votes">${list.map(o => `<div class="${ta[o.id] === tmax ? 'top' : ''}"><span>${esc(o.short)}</span><i style="width:${(ta[o.id] / tmax * 100).toFixed(0)}%"></i><b>${ta[o.id]}</b></div>`).join('')}</div>`; }
  return `<div class="page gut">
    <div class="f-q"><h1>${esc(FINAL.question)}</h1>
      <div class="acts"><button class="btn" data-act="share" id="go">${GAME.shareSeconds} seconds</button>
        <span class="heard">Answers ${[0, 1, 2].map(k => `<button data-act="heard" data-k="${k}" aria-pressed="${state.host.answers > k}" aria-label="Answer ${k + 1} heard"></button>`).join('')}</span></div>
      <p>${todo(FINAL.ourLink)}</p><p class="world">${todo(FINAL.ourWorld)}</p>
    </div>
    <div class="f-side">
      <ol class="list" aria-label="Final standings">${order.map(o => `<li class="${max > 0 && o.s === max ? 'lead' : ''}"><div class="rowt"><span class="nm">${esc(o.n)}</span><span class="big">${o.s}</span></div></li>`).join('')}</ol>
      ${bars}
      <div class="acts"><button class="link" data-act="results">Results</button><button class="link" data-act="trail">Back to the trail</button><button class="link" data-act="host">New hunt</button></div>
    </div></div>`; };

V.results = () => { const h = state.host, tc = h.teamCount; let tot = 0, seen = 0;
  const rows = h.order.map((_, p) => { const r = h.rec[p], c = ch(p), s = signAt(p), done = r && r.revealed;
    let k = 0; if (done) { for (let t = 0; t < tc; t++) if (r.votes[t] === c.correct) k++; tot += k; seen += tc; }
    return `<tr><td class="n">${p + 1}</td><td class="q">${esc(s.quote)}</td><td class="a">${esc((c.list.find(o => o.id === c.correct) || {}).short || '')}</td><td class="k">${done ? `${k} / ${tc}` : ''}</td><td class="b">${done ? `<i style="width:${(k / tc * 100).toFixed(0)}%"></i>` : ''}</td></tr>`; }).join('');
  return `<div class="page gut">
    <div class="r-head"><h1>Results</h1><div class="acts"><button class="link" data-act="final-back">Final question</button><button class="link" data-act="trail">Back to the trail</button><button class="link" data-act="host">New hunt</button></div></div>
    <div class="r-body"><table class="res"><thead><tr><th scope="col">Sign</th><th scope="col" class="q">Quote</th><th scope="col">Answer</th><th scope="col">Tables right</th><th scope="col" class="b"><span class="sr">Share</span></th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="5">${esc(modeOf(h.mode).name)}. ${seen ? `${Math.round(tot / seen * 100)}% of votes matched.` : 'No signs revealed yet.'}</td></tr></tfoot></table></div>
  </div>`; };

/* ---------- settings, join ---------- */
function renderSheet() {
  const el = $('#sheet'), sc = $('#scrim'); el.hidden = sc.hidden = !sheetOpen; if (!sheetOpen) { el.innerHTML = ''; return; }
  const s = state.set, onoff = [[false, 'Off'], [true, 'On']];
  const row = (k, label, items) => `<div class="set"><span>${label}</span>${seg('set', items, s[k], label, `data-k="${k}"`)}</div>`;
  el.innerHTML = `<header><h2 id="sheet-h">Settings</h2><button class="link" data-act="settings" id="sheetDone">Done</button></header>
    ${row('count', 'Signs', [[4, '4'], [6, '6'], [8, '8']])}
    ${row('shuffle', 'Shuffle', onoff)}
    ${row('timer', 'Timer', onoff)}
    ${s.timer ? row('secs', 'Length', [[60, '1:00'], [90, '1:30'], [120, '2:00'], [180, '3:00']]) : ''}
    ${row('pages', 'Page numbers', onoff)}
    ${row('reveal', 'Reveal', [['each', 'Each pick'], ['end', 'At the end']])}
    ${row('contrast', 'High contrast', onoff)}
    ${row('large', 'Larger text', onoff)}
    ${row('calm', 'Reduce motion', onoff)}
    ${row('theme', 'Theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']])}`;
}
function paintQR() { $$('[data-qr]').forEach(el => { if (el.firstChild || !SITE_URL) return; if (!window.QRCode) { el.hidden = true; return; } try { new QRCode(el, { text: SITE_URL, width: 640, height: 640, colorDark: '#1F2A24', colorLight: '#F5F1E8', correctLevel: QRCode.CorrectLevel.M }); el.removeAttribute('title'); } catch (e) { el.hidden = true; } }); }
function toggleJoin(on) { const o = $('#join'); if (on && SITE_URL) { o.innerHTML = `<div class="page gut"><div class="j-t"><h1>Join</h1><p class="url">${esc(shortUrl())}</p><button class="link" data-act="join-close">Close</button></div><div class="j-q"><span class="qr" data-qr></span></div></div>`; o.hidden = false; paintQR(); $('.link', o).focus(); } else { o.hidden = true; o.innerHTML = ''; } }

/* ---------- rendering and flow ---------- */
const app = $('#app'), main = $('#main');
const screenNow = () => state.open !== null ? 'sign' : state.screen;
function render(focus) {
  const scr = screenNow();
  app.dataset.screen = scr; app.dataset.who = state.who;
  main.innerHTML = V[scr]();
  const host = !solo() && scr !== 'title', timed = solo() && scr !== 'title' && scr !== 'final' && state.play && (state.play.mode === 'sprint' || state.play.timed);
  $('#clock').hidden = !((host && ['trail', 'sign', 'final'].includes(scr)) || timed);
  $('#clock').classList.toggle('ro', !!timed);
  $('#joinBtn').hidden = !(host && SITE_URL && scr !== 'tables');
  $('#notesBtn').hidden = !host;
  renderNotes(); paintClock(); paintQR(); paintTalk();
  const f = focus && $(focus); if (f) f.focus({ preventScroll: true });
}
function renderNotes() {
  const el = $('#notes'), scr = screenNow(), on = state.notes && !solo() && !!NOTES[scr];
  el.hidden = !on; $('#notesBtn').setAttribute('aria-pressed', state.notes); if (!on) return;
  const who = state.runner, mine = state.host.order.map((si, p) => SIGNS[si].reader === who ? p + 1 : 0).filter(Boolean);
  el.innerHTML = `<div><h2>Running it</h2><div class="crew">${GAME.crew.map(n => `<button class="link" data-act="runner" data-n="${esc(n)}" aria-pressed="${n === who}">${esc(n)}</button>`).join('')}</div>
      <p>${todo(CUES[who])}</p><p>${mine.length ? `Reads sign${mine.length > 1 ? 's' : ''} ${mine.join(' and ')}.` : ''}${scr === 'sign' ? ` This one: ${esc(signAt(state.open).reader)}.` : ''}</p></div>
    <div><h2>Now</h2><ol>${NOTES[scr].map(n => `<li>${esc(n)}</li>`).join('')}</ol></div>
    <div><h2>Keys</h2><p>${KEYS}</p></div>`;
}
function go(name, focus) { clearInterval(talkIv); state.screen = name; state.open = null; save(); render(focus || '#go'); scrollTo(0, 0); }
function startPlay(mode) {
  const s = state.set, sp = mode === 'sprint';
  state.who = 'solo'; state.sel = 0;
  state.play = { mode, order: makeOrder(sp ? SIGNS.length : s.count, s.shuffle), ans: {}, locked: {}, cur: 0, done: false, timed: !sp && s.timer, left: 0 };
  if (sp) { setClock(SPRINT_SECONDS); startClock(); go('sprint', '#none'); }
  else { if (s.timer) { setClock(s.secs); startClock(); } else stopClock(); go('trail', '.mk'); }
}
function finishPlay() { const p = state.play; if (!p) return; p.left = state.remaining; stopClock(); p.done = true; go('final'); }
function openSign(pos) { if (pos < 0 || pos >= N()) return; state.sel = pos; state.open = pos; if (!solo() && !rec(pos).revealed) { talkLeft = GAME.talkSeconds; clearInterval(talkIv); talkIv = setInterval(() => { talkLeft = Math.max(0, talkLeft - 1); paintTalk(); if (!talkLeft) clearInterval(talkIv); }, 1000); } render(solo() ? null : '#go'); scrollTo(0, 0); }
function paintTalk() { const b = $('#talkBar'); if (b) b.style.width = (talkLeft / GAME.talkSeconds * 100) + '%'; }
function closeSign() {
  if (state.open === null) return; clearInterval(talkIv); const pos = state.open; state.open = null;
  if (foundCount() === N() && isFound(pos)) { toFinal(); return; }
  const nxt = G().order.findIndex((_, p) => !isFound(p)); if (nxt >= 0 && isFound(pos)) state.sel = nxt;
  save(); render(`.mk[data-i="${state.sel}"]`); scrollTo(0, 0);
}
function toFinal() { if (solo()) { finishPlay(); return; } setClock(GAME.shareSeconds); go('final'); }
function reveal() { if (solo() || state.open === null) return; const r = rec(state.open); if (r.revealed) return; clearInterval(talkIv); r.revealed = true; save(); render('#go'); }
function pick(k) { const p = state.play, pos = state.open; if (pos === null || p.locked[pos]) return; const o = ch(pos).list[k]; if (!o) return; p.ans[pos] = o.id; save(); render('#go'); }
function lock() { const p = state.play, pos = state.open; if (pos === null || p.locked[pos] || !p.ans[pos]) return; p.locked[pos] = true; save(); if (state.set.reveal === 'end') { closeSign(); return; } render('#go'); if (innerWidth <= 820) scrollTo(0, 0); }
function sprintPick(k) { const p = state.play; if (!p || p.done) return; const o = ch(p.cur).list[k]; if (!o) return; p.ans[p.cur] = o.id; p.locked[p.cur] = true; p.cur++; if (p.cur >= N()) finishPlay(); else { save(); render(); } }
function fullscreen() { try { if (document.fullscreenElement) document.exitFullscreen(); else { const p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {}); } } catch (e) {} }
function toggleSheet(on) { sheetOpen = on; renderSheet(); if (on) $('#sheetDone').focus(); else $('#setBtn').focus(); }
const parseV = v => v === 'true' ? true : v === 'false' ? false : /^\d+$/.test(v) ? +v : v;

document.addEventListener('click', e => {
  if (e.target.id === 'scrim') { toggleSheet(false); return; }
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, h = state.host;
  if (a === 'home') { stopClock(); state.who = 'solo'; go('title'); }
  else if (a === 'start') startPlay(b.dataset.mode);
  else if (a === 'again') startPlay(state.play.mode);
  else if (a === 'resume-play') { state.who = 'solo'; if (state.play.timed && state.remaining > 0) startClock(); go('trail', '.mk'); }
  else if (a === 'host') { stopClock(); state.who = 'host'; go('tables'); }
  else if (a === 'begin') { h.order = makeOrder(state.set.count, state.set.shuffle); h.rec = {}; h.answers = 0; state.sel = 0; setClock(state.total); go('trail', '.mk'); }
  else if (a === 'resume' || a === 'trail') { if (!solo() && state.screen === 'final') setClock(GAME.minutes * 60); go('trail', '.mk'); }
  else if (a === 'final') toFinal();
  else if (a === 'final-back') go('final');
  else if (a === 'results') { stopClock(); go('results', '.link'); }
  else if (a === 'clock') running() ? stopClock() : startClock();
  else if (a === 'less') nudge(-30); else if (a === 'more') nudge(30);
  else if (a === 'notes') { state.notes = !state.notes; renderNotes(); }
  else if (a === 'settings') toggleSheet(!sheetOpen);
  else if (a === 'set') { const k = b.dataset.k; state.set[k] = parseV(b.dataset.v); applySet(); save(); renderSheet(); render(); const f = $(`#sheet [data-k="${k}"][aria-pressed="true"]`); if (f) f.focus(); }
  else if (a === 'join') toggleJoin(true); else if (a === 'join-close') toggleJoin(false);
  else if (a === 'hmode') { h.mode = b.dataset.v; save(); render(`[data-act="hmode"][data-v="${b.dataset.v}"]`); }
  else if (a === 'count') { h.teamCount = +b.dataset.v; save(); render(`[data-act="count"][data-v="${b.dataset.v}"]`); }
  else if (a === 'mins') { setClock(+b.dataset.v * 60); render(`[data-act="mins"][data-v="${b.dataset.v}"]`); }
  else if (a === 'open') openSign(+b.dataset.i);
  else if (a === 'close') closeSign();
  else if (a === 'reveal') reveal();
  else if (a === 'pick') pick(+b.dataset.k);
  else if (a === 'lock') lock();
  else if (a === 'sprint-pick') sprintPick(+b.dataset.k);
  else if (a === 'vote') { const r = rec(state.open), t = +b.dataset.team, id = ch(state.open).list[+b.dataset.k].id; if (r.revealed) return; r.votes[t] = r.votes[t] === id ? null : id; $$(`.cell[data-team="${t}"]`).forEach(c => c.setAttribute('aria-pressed', c === b && r.votes[t] === id)); save(); }
  else if (a === 'prove') { const r = rec(state.open), t = +b.dataset.team; r.bonus[t] = !r.bonus[t]; b.setAttribute('aria-pressed', r.bonus[t]); $('#pts-' + t).textContent = signPoints(state.open, t); save(); }
  else if (a === 'runner') { state.runner = b.dataset.n; renderNotes(); }
  else if (a === 'share') { setClock(GAME.shareSeconds); startClock(); }
  else if (a === 'heard') { const k = +b.dataset.k; h.answers = h.answers === k + 1 ? k : k + 1; save(); $$('.heard button').forEach((x, j) => x.setAttribute('aria-pressed', h.answers > j)); }
});
document.addEventListener('input', e => { const t = e.target; if (t.matches('input[data-team]')) { state.host.teamNames[+t.dataset.team] = t.value.trim() || `Table ${+t.dataset.team + 1}`; save(); } });
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, scr = screenNow(), onBtn = !!e.target.closest('button'), num = /^[1-9]$/.test(k) ? +k : 0;
  if (!$('#join').hidden) { if (k === 'Escape' || k === 'Enter' || k === 'j') { e.preventDefault(); toggleJoin(false); } return; }
  if (sheetOpen) { if (k === 'Escape' || k === 's') { e.preventDefault(); toggleSheet(false); } return; }
  if (k === 'f') { fullscreen(); return; }
  if (k === 's') { toggleSheet(true); return; }
  if (!solo() && scr !== 'title') {
    if (k === ' ') { e.preventDefault(); if (['trail', 'sign', 'final'].includes(scr)) running() ? stopClock() : startClock(); return; }
    if (k === 'n' || k === 'p') { state.notes = !state.notes; renderNotes(); return; }
    if (k === 'j') { toggleJoin(true); return; }
    if (k === 'e' && (scr === 'trail' || scr === 'sign')) { toFinal(); return; }
  }
  if (scr === 'title') { if (num && num <= MODES.length) startPlay(MODES[num - 1].id); else if (k === 'Enter' && !onBtn) { e.preventDefault(); $('#go').click(); } }
  else if (scr === 'sprint') { if (num) sprintPick(num - 1); }
  else if (scr === 'sign') {
    if (k === 'Escape') closeSign();
    else if (solo()) { const locked = state.play.locked[state.open];
      if (!locked && num) pick(num - 1);
      else if (k === 'Enter') { e.preventDefault(); locked ? closeSign() : lock(); } }
    else if (k === 'r') reveal();
    else if (k === 'Enter' && rec(state.open).revealed) { e.preventDefault(); closeSign(); }
  }
  else if (scr === 'trail') { const n = N();
    if (num && num <= n) openSign(num - 1);
    else if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); state.sel = (state.sel + 1) % n; render(`.mk[data-i="${state.sel}"]`); }
    else if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); state.sel = (state.sel + n - 1) % n; render(`.mk[data-i="${state.sel}"]`); }
    else if (k === 'Enter' && !onBtn) { e.preventDefault(); openSign(state.sel); }
  }
});
document.addEventListener('keyup', e => { if (e.key === ' ' && e.target.tagName !== 'INPUT' && !solo() && state.screen !== 'title') e.preventDefault(); });

load(); applySet(true); render();
try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => state); } catch (e) {}
