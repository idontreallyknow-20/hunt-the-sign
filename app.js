/* Hunt the Sign. A seminar game for Medicine Walk by Richard Wagamese. Made with AI assistance (Claude). */

/* ---------- configuration ---------- */
/* The public address of the site. Leave empty to hide the join code. */
const SITE_URL = "https://idontreallyknow-20.github.io/hunt-the-sign";
/* Shared leaderboard. Empty means no backend: players hold up their score and the host types the top scores in.
   To plug one in, put a JSON endpoint here (GET returns [{name, score}], POST takes {name, score})
   and add its origin to connect-src in the Content-Security-Policy tag in index.html. */
const LEADERBOARD_API = "";

/* =====================================================================================
   GROUP CONTENT
   Every quote was checked word for word against the novel. Every page comes from the
   checked paper-book page list. Do not change a quote or a page without checking your copy.
   The prompts and explanations were drafted with AI assistance (Claude), which the footer
   credits. Read them, check them, and put them in your own voice.
   ===================================================================================== */
const GAME = {
  title: 'Hunt the Sign',
  novel: 'Medicine Walk',
  author: 'Richard Wagamese',
  idea: 'Protect someone, or turn away?',
  minutes: 5,            // room clock on the host join screen
  shareSeconds: 60       // partner talk on each debrief question
};
const ILT = {
  human: 'How do we learn to be human?',
  relatives: 'How do we learn to be good relatives?',
  ancestors: 'How do we become good ancestors?',
  together: 'How do we learn to live together?'
};
const THEME = { truth: 'Truth heals', land: 'The land teaches', story: 'Stories are inheritance', pain: 'Facing pain' };

/* Question types: stand (no wrong answer), mc, tf, order, match, spot.
   ev   : the textual evidence shown after the answer, as [quote, page, who says it].
   why  : one or two sentences that tie the choice to the big idea. */
const QUESTIONS = [
  { type: 'stand', art: 'fire', ilt: 'relatives', theme: 'truth',
    prompt: 'Someone you love keeps hurting you. What do you do?',
    opts: ['Stay and keep trying', 'Stay, but say what has to change', 'Leave to protect yourself', 'Leave, and leave the door open'],
    lead: 'Frank goes with the father who failed him, and says this to his face:',
    ev: [['You ain’t no warrior.', 23, 'Frank to Eldon']],
    why: 'Frank does not pick between staying and speaking up. He does both, and that is how the truth finally gets told.' },

  { type: 'mc', art: 'bear', ilt: 'human', theme: 'pain',
    prompt: 'A grizzly blocks the trail. Eldon is too weak to run. What does Frank choose?',
    opts: ['Turn back the way they came', 'Hide Eldon and wait it out', 'Walk toward the bear', 'Keep still and hope it passes'], answer: 2,
    ev: [['Can’t run … Gotta face him.', 107, 'Frank to Eldon']],
    why: 'Turning his back would show fear, so the only way left is forward. Frank is scared and walks toward it anyway.' },

  { type: 'tf', art: 'fire', ilt: 'ancestors', theme: 'story',
    prompt: 'True or false?',
    statement: 'Eldon chooses to give Frank only his good memories.', answer: false,
    ev: [['Weren’t no good old days. But you need to hear still. It’s all I got to give ya.', 23, 'Eldon to Frank']],
    why: 'Eldon has nothing easy to hand down. He chooses the truth of his life over a comfortable silence, and that story is his gift.' },

  { type: 'order', art: 'fire', ilt: 'human', theme: 'pain', secs: 35,
    prompt: 'Frank’s verdict on running away. Put his words in order.',
    tiles: ['Gettin’ half killed once’s', 'gotta be better’n', 'bein’ half alive', 'forever.'], join: ' ',
    ev: [['Gettin’ half killed once’s gotta be better’n bein’ half alive forever.', 102, 'Frank to Eldon']],
    why: 'A beating ends. A life spent hiding from shame never fully starts. Frank names the real cost of flight.' },

  { type: 'mc', art: 'farm', ilt: 'relatives', theme: 'pain',
    prompt: 'Eldon walked away from his mother and never went back. What does he say kept him gone?',
    opts: ['He stopped caring about her', 'Guilt and shame he could not face', 'He never learned where she lived', 'Jimmy talked him out of it'], answer: 1,
    ev: [['Love an’ shame never mix', 100, 'Eldon']],
    why: 'Anger made leaving easy. Shame made going back impossible. One choice to run turned into a habit of running.' },

  { type: 'match', art: 'trail', ilt: 'relatives', secs: 40,
    prompt: 'Match each line to the decision it shows.',
    pairs: [['Can’t run … Gotta face him.', 107, 'Face the danger'], ['It’s all I got to give ya.', 23, 'Tell the hard truth'],
            ['He’ll be my responsibility', 229, 'Take in someone else’s child'], ['War’s over, Eldon', 238, 'Let the anger go']],
    ev: [],
    why: 'Four people stand at the same fork: protect someone, or turn away. Each line is the moment they choose.' },

  { type: 'spot', art: 'farm', ilt: 'relatives',
    prompt: 'Bunky agrees to raise another man’s son. Tap the words that show who he is protecting.',
    phrases: ['I’ll do it.', 'Not for you.', 'For him and for her.'], answer: 2,
    ev: [['I’ll do it. Not for you. For him and for her.', 229, 'Bunky to Eldon']],
    why: 'Bunky refuses to do it as a favour to Eldon. The choice is for the baby, and for the mother he also loved.' },

  { type: 'tf', art: 'farm', ilt: 'ancestors', theme: 'pain',
    prompt: 'True or false?',
    statement: 'The old man tells Frank that what breaks inside a person mends as easily as anything else.', answer: false,
    ev: [['Things get busted sometimes. When they happen in the world you can fix ’em most times. But when they happen inside a person they’re harder to mend.', 56, 'The old man to Frank']],
    why: 'He does not excuse Eldon and he does not write him off. He asks Frank to see why a person turns away before judging it.' },

  { type: 'order', art: 'trail', ilt: 'human', secs: 35,
    prompt: 'Put Frank’s decisions in the order he makes them.',
    tiles: ['Agrees to take Eldon into the backcountry', 'Walks toward the bear', 'Buries Eldon and says the war is over', 'Rides home to the old man'], join: '. ',
    ev: [], pages: [23, 107, 238, 246],
    why: 'Each choice is a step toward his father, not away from him. By the last one Frank has someone to ride home to.' },

  { type: 'mc', art: 'fire', ilt: 'together', theme: 'story',
    prompt: 'Angie tells Eldon that sharing stories changes things. What is she asking him to choose?',
    opts: ['To leave his past behind', 'To speak instead of staying silent', 'To write his stories down', 'To go back to the war'], answer: 1,
    ev: [['When you share stories you change things.', 203, 'Angie to Eldon']],
    why: 'Silence is how Eldon keeps running. Angie offers the other choice: say the hard thing and let it change you.' },

  { type: 'stand', art: 'ridge', ilt: 'ancestors', theme: 'truth',
    prompt: 'Eldon ran for most of his life, then told the truth at the end. Does a late truth count?',
    opts: ['Yes. Late is still told', 'Partly. It frees Frank more than Eldon', 'No. The damage is already done'],
    lead: 'Frank’s answer, at his father’s grave:',
    ev: [['War’s over, Eldon', 238, 'Frank']],
    why: 'Once Frank has the whole story, he can end the fight instead of inheriting it.' },

  { type: 'mc', art: 'farm', ilt: 'relatives',
    prompt: 'Frank calls the old man his father. What made him one?',
    opts: ['He is Frank’s uncle by blood', 'A court named him guardian', 'He chose to stay and raise him', 'Eldon paid him to do it'], answer: 2,
    ev: [['You were my father all these years.', 244, 'Frank to the old man']],
    why: 'Fatherhood here is a decision repeated every day for sixteen years. The old man protected Frank by staying.' }
];

/* The host debrief: three questions that carry the game back to the themes and the ILT questions.
   stand: the index of the "where do you stand" question whose options the host tallies by a show of hands. */
const DEBRIEF = [
  { q: 'Frank walks toward the bear. Eldon walks away from his mother. What makes one person stay and another run?', ilt: 'human', theme: 'pain', stand: 0,
    ev: [['Can’t run … Gotta face him.', 107, 'Frank'], ['Love an’ shame never mix', 100, 'Eldon'], ['Gettin’ half killed once’s gotta be better’n bein’ half alive forever.', 102, 'Frank']],
    ours: 'Frank was taught, sign by sign, to read what is in front of him before he acts, so he can face what scares him. Eldon was told to run at the worst moment of his life, and shame kept him running. Courage in this novel is a habit someone teaches you, not a trait you are born with.' },
  { q: 'Bunky raises a child who is not his. Eldon gives up the child who is. Who is the good relative, and is it that simple?', ilt: 'relatives',
    ev: [['I’ll do it. Not for you. For him and for her.', 229, 'Bunky'], ['I didn’t want to hate you.', 226, 'Eldon'], ['You were my father all these years.', 244, 'Frank']],
    ours: 'Both choices protect Frank. Bunky protects him by staying. Eldon, drunk and grieving, protects him by handing him to someone who can. Kinship in the novel is made by who shows up, and by knowing when you cannot.' },
  { q: 'Eldon tells the truth only when he is dying. Is that turning toward Frank at last, or one more way of leaving?', ilt: 'ancestors', theme: 'truth', stand: 10,
    ev: [['It’s all I got to give ya.', 23, 'Eldon'], ['It doesn’t have to be right. It just needs to be said.', 203, 'Angie'], ['War’s over, Eldon', 238, 'Frank']],
    ours: 'The story costs Eldon his pride and gives Frank his name, his mother and his place in a line of people. Because the truth is finally said, Frank can end the war instead of inheriting it.' }
];

/* The reward. */
const GIFT = {
  title: 'A gift, given with thanks',
  body: 'The old man teaches Frank to stop and give thanks for what he takes. Before you open yours, thank one person in this room.',
  ev: [['But me, I figure everything’s holy.', 36, 'The old man'], ['there’s worse ways to live than stopping to thank the mystery', 38, 'The old man']],
  ilt: 'human'
};
/* Earned by the number of scored questions answered correctly (10 are scored). */
const TIERS = [[10, 'Guide'], [8, 'Sign Reader'], [5, 'Tracker'], [0, 'Walker']];
/* ============================ END OF GROUP CONTENT ============================ */

const NOTES = {
  lobby: ['Leave this up while the class scans the code or types the address.', 'Everyone enters a name and presses Play. Space starts the room clock.', 'When the clock ends, ask players to hold up their score screens.'],
  board: ['Ask for the highest scores out loud and type them in. Enter adds a row.', 'Five or six names are enough. Then go to the podium.'],
  podium: ['Call the top three up. Let the room clap before you move on.'],
  gift: ['Hand out the reward here. Read one of the two lines aloud.', 'Say the ILT question out loud: how do we learn to be human?'],
  debrief: ['Read the question. Give partners 60 seconds (Space starts the clock).', 'If there is a tally, ask for hands and click the counts.', 'Take two answers before you show our reading. Ask each speaker for words from a quote.', 'Use a course term out loud: kinship, intergenerational trauma, ancestor.']
};
const KEYS = 'Arrow keys or Enter: next and back. Space: clock. J: join code. N: notes. S: settings. F: full screen.';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const calm = () => document.documentElement.classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const cite = p => `(Wagamese ${p})`;
const SCORED = QUESTIONS.filter(q => q.type !== 'stand').length;
const tierFor = n => TIERS.find(t => n >= t[0])[1];
/* A fixed shuffle per question, so every player sees the same layout. */
function mix(n, seed) { const a = [...Array(n).keys()]; let s = seed * 7919 + 13; for (let i = n - 1; i > 0; i--) { s = (s * 1103515245 + 12345) & 0x7fffffff; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } if (n > 1 && a.every((v, i) => v === i)) a.push(a.shift()); return a; }

/* ---------- state ---------- */
const KEY = 'hunt-the-sign-v5';
const defSet = () => ({ contrast: false, large: false, calm: false, theme: 'system' });
let prefs = { name: '', set: defSet() };
let state = { who: 'solo', screen: 'title', run: null, host: { step: 0, board: [], tally: {}, shown: {} }, notes: false };
let sheetOpen = false;
function loadPrefs() { try { const p = JSON.parse(localStorage.getItem(KEY) || 'null'); if (p) { prefs.name = String(p.name || '').slice(0, 14); prefs.set = Object.assign(defSet(), p.set || {}); if (Array.isArray(p.board)) state.host.board = p.board.slice(0, 40); } } catch (e) {} }
function savePrefs() { try { localStorage.setItem(KEY, JSON.stringify({ name: prefs.name, set: prefs.set, board: state.host.board })); } catch (e) {} }
function applySet(first) {
  const r = document.documentElement, s = prefs.set;
  if (s.theme !== 'system') r.setAttribute('data-theme', s.theme); else if (!first) r.removeAttribute('data-theme');
  if (s.contrast) r.setAttribute('data-contrast', 'high'); else r.removeAttribute('data-contrast');
  r.classList.toggle('large', !!s.large); r.classList.toggle('calm', !!s.calm);
}
const Board = {
  async submit(entry) { if (!LEADERBOARD_API) return false; try { await fetch(LEADERBOARD_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }); return true; } catch (e) { return false; } },
  async load() { if (!LEADERBOARD_API) return null; try { const r = await fetch(LEADERBOARD_API); const d = await r.json(); return Array.isArray(d) ? d : null; } catch (e) { return null; } }
};

/* ---------- illustrations: line drawings, one weight, drawn here ---------- */
const PIECE = {
  spruce: (x, y, h) => { const w = h * .3; let d = `M${x} ${y}V${y - h}`; for (let i = 1; i <= 4; i++) { const yy = y - h + h * .2 * i + h * .08, ww = w * i / 4; d += `M${x - ww} ${yy}L${x} ${yy - h * .2}L${x + ww} ${yy}`; } return `<path d="${d}"/>`; },
  bear: '<path class="fl" d="M72 118 74 98Q68 84 80 74 98 62 118 66 130 52 146 58 155 62 160 68L163 62Q167 59 169 66 180 70 187 80L193 84Q195 89 190 91L178 93Q170 95 166 92 161 100 158 102V118H144L145 104 138 106 136 118H124L126 103Q112 106 104 102V118H92V104L90 118Z"/>',
  fire: '<path d="M92 122 148 106M92 106 148 122"/><path class="fa" d="M120 106Q102 88 117 64 120 80 127 72 142 90 120 106Z"/><path class="dash" d="M121 56Q112 44 122 34 131 24 122 12"/>',
  cabin: '<path d="M64 116V84L96 64 128 84V116ZM58 88 96 64 134 88M88 116V98H102V116M110 70V56H118V75M112 92H122V101H112Z"/><path class="dash" d="M114 50Q108 42 115 34"/>',
  fence: '<path d="M140 116V98M160 116V98M180 116V98M200 116V98M220 116V98M134 103H226M134 110H226"/>',
  cairn: (x, y) => `<path d="M${x - 11} ${y}h22v-7h-22zM${x - 8} ${y - 7}h16v-6h-16zM${x - 5} ${y - 13}h10v-5h-10z"/>`,
  moon: (x, y, r) => `<circle class="ac" cx="${x}" cy="${y}" r="${r}"/>`,
  stars: '<path d="M38 26h6M41 23v6M196 20h6M199 17v6M152 40h4M154 38v4M70 46h4M72 44v4"/>'
};
const ART = {
  bear: `<path d="M0 118H240M0 96 34 76 60 88M200 92 222 78 240 86M14 130H96M150 130H226"/>${PIECE.spruce(28, 118, 40)}${PIECE.spruce(214, 118, 52)}${PIECE.spruce(46, 118, 26)}${PIECE.bear}${PIECE.moon(206, 30, 12)}`,
  fire: `<path d="M20 124H220M0 96 52 72 96 88"/>${PIECE.stars}${PIECE.fire}${PIECE.spruce(40, 124, 46)}${PIECE.spruce(198, 124, 58)}${PIECE.spruce(216, 124, 34)}${PIECE.moon(176, 34, 11)}`,
  farm: `<path d="M0 116H240M0 80 40 62 70 74M150 72 190 54 240 78M20 128H110M130 128H230M40 138H200"/>${PIECE.cabin}${PIECE.fence}${PIECE.spruce(34, 116, 44)}`,
  ridge: `<path d="M0 112 46 86 84 98 132 54 172 90 204 76 240 100M0 132 70 118 150 126 240 112"/>${PIECE.cairn(132, 54)}${PIECE.moon(190, 32, 14)}${PIECE.spruce(30, 112, 30)}${PIECE.spruce(222, 104, 36)}<path d="M52 30h6M55 27v6M96 22h4M98 20v4"/>`,
  trail: `<path d="M0 124H240M0 70 60 48 104 62 160 30 240 60"/><path class="dash" d="M18 124Q60 96 96 104T170 78 214 44"/><path class="fa" d="M36 104h10v10h-10zM90 98h10v10h-10zM150 78h10v10h-10z"/>${PIECE.cairn(214, 44)}${PIECE.spruce(120, 124, 34)}`
};
const art = k => `<svg class="art" viewBox="0 0 240 150" aria-hidden="true">${ART[k] || ART.ridge}</svg>`;
/* The title scene: the farm at one end of the trail, the ridge at the other. */
const SCENE = (() => {
  const far = [[-900, 176], [0, 150], [110, 120], [250, 150], [400, 96], [560, 146], [700, 84], [860, 140], [1010, 104], [1180, 60], [1330, 128], [1460, 96], [1600, 140], [2500, 176]];
  const near = [[-900, 232], [440, 232], [600, 222], [800, 236], [980, 218], [1220, 232], [1420, 214], [1600, 224], [2500, 224]];
  const line = pts => 'M' + pts.map(p => p.join(' ')).join('L');
  const sp = [[40, 232, 52], [500, 228, 62], [540, 226, 40], [900, 226, 72], [942, 222, 46], [1090, 224, 34], [1470, 216, 78], [1522, 220, 50], [-120, 232, 70], [1700, 224, 66]].map(a => PIECE.spruce(...a)).join('');
  return `<svg class="art scene" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax meet" overflow="visible" aria-hidden="true">
    <path d="${line(far)}"/><path d="${line(near)}"/>${sp}${PIECE.moon(1345, 46, 24)}${PIECE.cairn(1180, 60)}
    <g transform="translate(60 58) scale(1.5)">${PIECE.cabin}${PIECE.fence}</g>
    <path class="dash" d="M206 238Q340 280 520 270T690 264M748 258Q900 250 1010 196T1174 68"/>
    <g transform="translate(580 122) scale(1.15)">${PIECE.fire}</g>
    <g transform="translate(1212 142) scale(.7)">${PIECE.bear}</g>
    <path d="M-900 288H2500M250 274h110M860 278h170M1250 270h190"/>
    <path d="M520 50h10M525 45v10M800 34h8M804 30v8M990 60h8M994 56v8M250 70h8M254 66v8M1500 40h8M1504 36v8M90 60h8M94 56v8"/>
  </svg>`;
})();

/* ---------- room clock (host) ---------- */
let clock = { left: GAME.minutes * 60, iv: 0, end: 0 };
const running = () => !!clock.iv;
function startClock() { if (clock.left <= 0) return; clock.end = Date.now() + clock.left * 1000; clock.iv = setInterval(() => { const r = Math.max(0, Math.ceil((clock.end - Date.now()) / 1000)); if (r !== clock.left) { clock.left = r; paintClock(); } if (r <= 0) { stopClock(); chime(); } }, 200); paintClock(); }
function stopClock() { clearInterval(clock.iv); clock.iv = 0; paintClock(); }
function setClock(sec) { stopClock(); clock.left = sec; paintClock(); }
function nudge(d) { clock.left = Math.max(0, Math.min(1800, clock.left + d)); if (running()) clock.end = Date.now() + clock.left * 1000; paintClock(); }
function paintClock() { $('#time').textContent = fmt(clock.left); const c = $('#clock'); c.classList.toggle('low', clock.left <= 30 && clock.left > 0); c.classList.toggle('done', clock.left === 0); $('#playBtn').textContent = running() ? 'Pause' : 'Start'; }
function chime() { try { const A = new (window.AudioContext || window.webkitAudioContext)(); [0, .28].forEach((t, i) => { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = i ? 494 : 659; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(.0001, A.currentTime + t); g.gain.exponentialRampToValueAtTime(.18, A.currentTime + t + .03); g.gain.exponentialRampToValueAtTime(.0001, A.currentTime + t + .5); o.start(A.currentTime + t); o.stop(A.currentTime + t + .55); }); } catch (e) {} }

/* ---------- the game ---------- */
const secsFor = q => q.secs || 20;
const mult = streak => streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
function newRun(practice) {
  state.who = 'solo';
  state.run = { practice: !!practice, i: 0, score: 0, streak: 0, best: 0, correct: 0, phase: 'ask', log: [], cur: null, t0: 0, limit: 0, left: 0 };
  beginQuestion(); go('q');
}
function beginQuestion() {
  const r = state.run, q = QUESTIONS[r.i];
  r.phase = 'ask'; r.cur = { seq: [], map: {}, sel: 0, last: null, fresh: true };
  if (q.type === 'order') r.cur.lay = mix(q.tiles.length, r.i + 1);
  if (q.type === 'match') r.cur.lay = mix(q.pairs.length, r.i + 3);
  r.limit = secsFor(q); r.left = r.limit; r.t0 = performance.now();
}
let raf = 0;
function tickBar() {
  cancelAnimationFrame(raf); const r = state.run; if (!r || r.practice || r.phase !== 'ask' || state.screen !== 'q') return;
  const loop = () => {
    const rr = state.run; if (!rr || rr.phase !== 'ask' || state.screen !== 'q') return;
    rr.left = Math.max(0, rr.limit - (performance.now() - rr.t0) / 1000);
    const bar = $('#tbar'), shown = calm() ? Math.ceil(rr.left) : rr.left;
    if (bar) { bar.style.transform = `scaleX(${(shown / rr.limit).toFixed(4)})`; bar.classList.toggle('low', rr.left <= 5); }
    if (rr.left <= 0) { settle(null, true); return; }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
}
/* given: what the player chose. timeout: the bar ran out. */
function settle(given, timeout) {
  const r = state.run, q = QUESTIONS[r.i]; if (r.phase !== 'ask') return; cancelAnimationFrame(raf);
  let ok = null, gain = 0, speed = 0, m = 1;
  if (q.type === 'stand') { if (!timeout) gain = 100; }
  else {
    if (timeout) ok = false;
    else if (q.type === 'mc' || q.type === 'spot') ok = given === q.answer;
    else if (q.type === 'tf') ok = given === q.answer;
    else if (q.type === 'order') ok = r.cur.seq.every((v, i) => v === i) && r.cur.seq.length === q.tiles.length;
    else if (q.type === 'match') ok = q.pairs.every((_, i) => r.cur.map[i] === i);
    if (ok) { r.streak++; r.best = Math.max(r.best, r.streak); r.correct++; m = mult(r.streak); speed = r.practice ? 0 : Math.round(50 * r.left / r.limit); gain = (100 + speed) * m; }
    else r.streak = 0;
  }
  r.score += gain; r.phase = 'fb'; r.cur.last = { ok, gain, speed, m, timeout: !!timeout, given };
  r.log.push({ ok, gain });
  render('#go'); if (gain) { const hs = $('#hudScore'); countUp(hs, r.score, r.score - gain, 600); if (hs) hs.classList.add('pop'); } const fb = $('.fb'); if (fb && innerWidth <= 820) fb.scrollIntoView({ block: 'start', behavior: calm() ? 'auto' : 'smooth' });
}
function nextQuestion() { const r = state.run; if (!r || r.phase !== 'fb') return; if (r.i + 1 >= QUESTIONS.length) { finishRun(); return; } r.i++; beginQuestion(); render(); scrollTo(0, 0); tickBar(); }
function finishRun() { const r = state.run; r.phase = 'done'; if (!r.practice) Board.submit({ name: prefs.name || 'Player', score: r.score }); go('end'); countUp($('#bigScore'), r.score); if (!r.practice) confetti(); }

/* ---------- views ---------- */
const V = {};
const evHTML = ev => (ev || []).map(e => `<blockquote class="ev">“${esc(e[0])}”<cite>${esc(e[2])} ${cite(e[1])}</cite></blockquote>`).join('');
const tagsHTML = q => `<p class="tags">${q.theme ? `<span>${esc(THEME[q.theme])}</span>` : ''}<span>${esc(ILT[q.ilt])}</span></p>`;

V.title = () => `<div class="page gut t-title">
    <h1>${esc(GAME.title)}</h1>
    <div class="t-rule">
      <div class="t-idea"><p class="idea">${esc(GAME.idea)}</p>
        <p class="sub">Twelve questions on the choices in <i>${esc(GAME.novel)}</i> by ${esc(GAME.author)}.</p></div>
      <form class="t-go" id="nameForm" novalidate>
        <label for="name">Your name</label>
        <input id="name" maxlength="14" autocomplete="off" autocapitalize="words" spellcheck="false" value="${esc(prefs.name)}">
        <div class="acts"><button class="btn" type="submit" id="go">Play</button><button class="link" type="button" data-act="practice">Practice, no timer</button></div>
        <button class="link" type="button" data-act="host">Host on the projector</button>
      </form>
    </div>
  </div>
  <div class="strip">${SCENE}</div>`;

function bodyHTML(q, r) {
  const c = r.cur, fb = r.phase === 'fb', dis = fb ? ' disabled' : '';
  if (q.type === 'mc' || q.type === 'stand') return `<ol class="opts">${q.opts.map((o, k) => `<li><button class="opt${fb && q.type === 'mc' && k === q.answer ? ' right' : ''}${fb && c.last.given === k ? (q.type === 'stand' ? ' mine' : k !== q.answer ? ' wrong' : '') : ''}" data-act="answer" data-k="${k}"${dis}><span class="n">${k + 1}</span><span class="nm">${esc(o)}</span></button></li>`).join('')}</ol>`;
  if (q.type === 'tf') return `<div class="tf">${[true, false].map((v, k) => `<button class="big${fb && v === q.answer ? ' right' : ''}${fb && c.last.given === v && v !== q.answer ? ' wrong' : ''}" data-act="answer" data-k="${k}"${dis}><span class="n">${k + 1}</span>${v ? 'True' : 'False'}</button>`).join('')}</div>`;
  if (q.type === 'spot') return `<div class="spot">${q.phrases.map((p, k) => `<button class="ph${fb && k === q.answer ? ' right' : ''}${fb && c.last.given === k && k !== q.answer ? ' wrong' : ''}" data-act="answer" data-k="${k}"${dis}>${esc(p)}</button>`).join(' ')}</div>`;
  if (q.type === 'order') { const full = c.seq.length === q.tiles.length;
    return `<div class="order"><ol class="slots" aria-label="Your order">${q.tiles.map((_, i) => c.seq[i] === undefined ? `<li class="slot"><span class="n">${i + 1}</span></li>` : `<li><button class="tile placed${fb ? (c.seq[i] === i ? ' right' : ' wrong') : ''}" data-act="unplace" data-i="${i}"${dis}><span class="n">${i + 1}</span>${esc(q.tiles[c.seq[i]])}</button></li>`).join('')}</ol>
      ${fb ? '' : `<div class="pool" aria-label="Pieces">${c.lay.map((t, k) => `<button class="tile" data-act="place" data-t="${t}"${c.seq.includes(t) ? ' disabled' : ''}><span class="n">${k + 1}</span>${esc(q.tiles[t])}</button>`).join('')}</div>
      <div class="acts"><button class="btn" data-act="check" id="go"${full ? '' : ' disabled'}>Check</button></div>`}</div>`; }
  if (q.type === 'match') { const full = q.pairs.every((_, i) => c.map[i] !== undefined);
    return `<div class="match"><ol class="mq" aria-label="Lines">${q.pairs.map((p, i) => `<li><button class="mrow${!fb && c.sel === i ? ' sel' : ''}${fb ? (c.map[i] === i ? ' right' : ' wrong') : ''}" data-act="msel" data-i="${i}"${dis}><span class="q">“${esc(p[0])}” <i>${cite(p[1])}</i></span><span class="a">${fb ? esc(p[2]) : c.map[i] !== undefined ? esc(q.pairs[c.map[i]][2]) : ''}</span></button></li>`).join('')}</ol>
      ${fb ? '' : `<div class="pool" aria-label="Decisions">${c.lay.map((t, k) => `<button class="tile${Object.values(c.map).includes(t) ? ' used' : ''}" data-act="massign" data-t="${t}"><span class="n">${k + 1}</span>${esc(q.pairs[t][2])}</button>`).join('')}</div>
      <div class="acts"><button class="btn" data-act="check" id="go"${full ? '' : ' disabled'}>Check</button></div>`}</div>`; }
  return '';
}
function fbHTML(q, r) {
  const l = r.cur.last, stand = q.type === 'stand', last = r.i + 1 >= QUESTIONS.length;
  const head = stand ? (l.timeout ? 'Time' : 'No wrong answer') : l.timeout ? 'Time' : l.ok ? 'Right' : 'Not this time';
  const pts = l.gain ? `<p class="gain" aria-label="${l.gain} points"><b>+${l.gain}</b>${l.speed ? `<span>${l.speed} for speed</span>` : ''}${l.m > 1 ? `<span class="x">×${l.m} streak</span>` : ''}</p>` : '';
  return `<div class="fb ${stand ? 'stand' : l.ok ? 'ok' : 'no'}" aria-live="polite">
    <h2>${head}</h2>${pts}
    ${q.lead ? `<p class="lead">${esc(q.lead)}</p>` : ''}${evHTML(q.ev)}${q.pages ? `<ol class="seq">${q.tiles.map((t, i) => `<li>${esc(t)} <i>${cite(q.pages[i])}</i></li>`).join('')}</ol>` : ''}
    <p class="why">${esc(q.why)}</p>${tagsHTML(q)}
    <div class="acts"><button class="btn" data-act="next" id="go">${last ? 'Finish' : 'Next'}</button></div></div>`;
}
V.q = () => { const r = state.run, q = QUESTIONS[r.i], fb = r.phase === 'fb', wide = q.type === 'order' || q.type === 'match', inMain = wide || q.type === 'spot', fresh = r.cur.fresh; r.cur.fresh = false;
  const dots = QUESTIONS.map((_, i) => `<i class="${i < r.log.length ? (r.log[i].ok === null ? 'st' : r.log[i].ok ? 'ok' : 'no') : i === r.i ? 'now' : ''}"></i>`).join('');
  const m = mult(r.streak);
  return `<div class="hud gut"><p class="pos">${r.i + 1}<small>/ ${QUESTIONS.length}</small></p><div class="dots" aria-hidden="true">${dots}</div>
      <p class="streak${m > 1 ? ' on' : ''}" ${m > 1 ? '' : 'hidden'}>×${m}<span>streak</span></p>
      <p class="score" aria-label="Score ${r.score}"><span>${r.practice ? 'Practice' : 'Score'}</span><b id="hudScore">${r.score}</b></p></div>
    <div class="tbar" aria-hidden="true"${r.practice ? ' hidden' : ''}><i id="tbar" style="transform:scaleX(${fb ? (r.left / r.limit).toFixed(4) : 1})"></i></div>
    <div class="page gut q q-${q.type}${wide ? ' wide' : ''}${fresh ? ' enter' : ''}${fb ? ' is-fb' : ''}">
      <div class="q-main"><h1>${esc(q.prompt)}</h1>${q.statement ? `<p class="statement">${esc(q.statement)}</p>` : ''}${inMain ? bodyHTML(q, r) : fb ? fbHTML(q, r) : ''}</div>
      <div class="q-side">${fb && inMain ? fbHTML(q, r) : `<div class="plate">${art(q.art)}</div>`}${inMain ? '' : bodyHTML(q, r)}</div>
    </div>`; };

V.end = () => { const r = state.run, tier = tierFor(r.correct), name = prefs.name || 'Player';
  return `<canvas class="confetti" id="confetti" aria-hidden="true"></canvas>
    <div class="page gut end">
      <div class="e-main"><p class="e-name">${esc(name)}</p>
        <p class="e-score" id="bigScore" aria-label="Score ${r.score}">${r.score}</p>
        ${r.practice ? '<p class="e-tier">Practice run</p>' : `<p class="e-tier"><span>${esc(tier)}</span></p>`}</div>
      <div class="e-side"><div class="plate">${art('ridge')}</div>
        <ul class="e-stats"><li><b>${r.correct}</b> of ${SCORED} right</li><li><b>${r.best}</b> best streak</li><li><b>${r.log.filter(l => l.ok === null && l.gain).length}</b> of ${QUESTIONS.length - SCORED} stands taken</li></ul>
        <div class="acts"><button class="btn" data-act="play" id="go">Play again</button><button class="link" data-act="practice">Practice</button><button class="link" data-act="home">Title</button></div></div>
    </div>`; };

/* ---------- host ---------- */
const STEPS = ['lobby', 'board', 'podium', 'gift', 'debrief0', 'debrief1', 'debrief2'];
const STEP_NAMES = ['Join', 'Leaderboard', 'Podium', 'Gift', 'Debrief 1', 'Debrief 2', 'Debrief 3'];
const stepKey = () => STEPS[state.host.step];
const shortUrl = () => SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
const sorted = () => state.host.board.slice().sort((a, b) => b.score - a.score);
const stepper = () => `<nav class="stepper gut" aria-label="Host steps">${STEP_NAMES.map((n, i) => `<button class="link" data-act="step" data-i="${i}"${i === state.host.step ? ' aria-current="step"' : ''}>${n}</button>`).join('')}<span class="grow"></span><button class="btn sm" data-act="hnext" id="go">${state.host.step === STEPS.length - 1 ? 'Done' : 'Next'}</button></nav>`;
V.host = () => { const k = stepKey(), h = state.host; let body = '';
  if (k === 'lobby') body = `<div class="page gut"><div class="h-main"><h1>Join</h1><p class="url">${esc(shortUrl() || 'Open the game on your own device')}</p>
        <ol class="how"><li>Type your name.</li><li>Press Play.</li><li>Hold up your score at the end.</li></ol></div>
      <div class="h-side">${SITE_URL ? '<span class="qr" data-qr></span>' : `<div class="plate">${art('trail')}</div>`}</div></div>`;
  else if (k === 'board') { const s = sorted();
    body = `<div class="page gut"><div class="h-main"><h1>Leaderboard</h1>
        <form class="entry" id="entry" novalidate><label class="sr" for="e-name">Name</label><input id="e-name" maxlength="14" placeholder="Name" autocomplete="off">
          <label class="sr" for="e-score">Score</label><input id="e-score" inputmode="numeric" maxlength="5" placeholder="Score" autocomplete="off"><button class="btn sm" type="submit">Add</button></form>
        ${s.length ? '' : '<p class="hint">Ask for the highest scores in the room.</p>'}</div>
      <div class="h-side"><ol class="rank">${s.map((e, i) => `<li><span class="n">${i + 1}</span><span class="nm">${esc(e.name)}</span><span class="big">${e.score}</span><button class="link" data-act="drop" data-id="${e.id}" aria-label="Remove ${esc(e.name)}">Remove</button></li>`).join('')}</ol>
        ${s.length ? '<button class="link" data-act="clear">Clear all</button>' : ''}</div></div>`; }
  else if (k === 'podium') { const s = sorted(), top = [s[1], s[0], s[2]], hts = [62, 100, 44], pl = [2, 1, 3];
    body = `<canvas class="confetti" id="confetti" aria-hidden="true"></canvas><div class="page gut podium-page"><h1 class="sr">Podium</h1>
      ${s.length ? `<div class="podium">${top.map((e, i) => e ? `<div class="pcol p${pl[i]}" style="--h:${hts[i]}"><p class="pn">${esc(e.name)}</p><p class="ps">${e.score}</p><div class="pbar"><span>${pl[i]}</span></div></div>` : '<div class="pcol"></div>').join('')}</div>
      ${s.length > 3 ? `<ol class="rank rest" start="4">${s.slice(3, 8).map((e, i) => `<li><span class="n">${i + 4}</span><span class="nm">${esc(e.name)}</span><span class="big">${e.score}</span></li>`).join('')}</ol>` : ''}` : '<p class="hint">Add scores on the leaderboard first.</p>'}</div>`; }
  else if (k === 'gift') body = `<div class="page gut"><div class="h-main"><h1>${esc(GIFT.title)}</h1><p class="lede">${esc(GIFT.body)}</p><p class="tags"><span>${esc(ILT[GIFT.ilt])}</span></p></div>
      <div class="h-side"><div class="plate">${art('fire')}</div>${evHTML(GIFT.ev)}</div></div>`;
  else { const di = +k.slice(-1), d = DEBRIEF[di], sq = d.stand !== undefined ? QUESTIONS[d.stand] : null, t = h.tally[di] || (h.tally[di] = sq ? sq.opts.map(() => 0) : []), max = Math.max(1, ...t), open = !!h.shown[di];
    body = `<div class="page gut"><div class="h-main"><h1 class="dq">${esc(d.q)}</h1>
        ${sq ? `<div class="tally" aria-label="Show of hands"><p class="tl">${esc(sq.prompt)}</p>${sq.opts.map((o, i) => `<div class="trow"><span class="nm">${esc(o)}</span><i style="width:${(t[i] / max * 100).toFixed(0)}%"></i><button class="pm" data-act="tally" data-d="${di}" data-i="${i}" data-v="-1" aria-label="One fewer for ${esc(o)}">&minus;</button><b>${t[i]}</b><button class="pm" data-act="tally" data-d="${di}" data-i="${i}" data-v="1" aria-label="One more for ${esc(o)}">+</button></div>`).join('')}</div>` : ''}
        <div class="reading">${open ? `<h2>Our reading</h2><p>${esc(d.ours)}</p>${tagsHTML(d)}` : `<button class="btn" data-act="ours" data-d="${di}">Show our reading</button>`}</div></div>
      <div class="h-side">${evHTML(d.ev)}</div></div>`; }
  return stepper() + body; };

/* ---------- settings and join ---------- */
const seg = (act, items, cur, label, extra = '') => `<div class="seg" role="group" aria-label="${esc(label)}">${items.map(([v, l]) => `<button data-act="${act}" ${extra} data-v="${esc(v)}" aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join('')}</div>`;
function renderSheet() {
  const el = $('#sheet'), sc = $('#scrim'); el.hidden = sc.hidden = !sheetOpen; if (!sheetOpen) { el.innerHTML = ''; return; }
  const s = prefs.set, onoff = [[false, 'Off'], [true, 'On']], row = (k, label, items) => `<div class="set"><span>${label}</span>${seg('set', items, s[k], label, `data-k="${k}"`)}</div>`;
  el.innerHTML = `<header><h2 id="sheet-h">Settings</h2><button class="link" data-act="settings" id="sheetDone">Done</button></header>
    ${row('theme', 'Theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']])}${row('contrast', 'High contrast', onoff)}${row('large', 'Larger text', onoff)}${row('calm', 'Reduce motion', onoff)}`;
}
function paintQR() { $$('[data-qr]').forEach(el => { if (el.firstChild || !SITE_URL) return; if (!window.QRCode) { el.hidden = true; return; } try { new QRCode(el, { text: SITE_URL, width: 640, height: 640, colorDark: '#1F2A24', colorLight: '#F5F1E8', correctLevel: QRCode.CorrectLevel.M }); el.removeAttribute('title'); } catch (e) { el.hidden = true; } }); }
function toggleJoin(on) { const o = $('#join'); if (on && SITE_URL) { o.innerHTML = `<div class="page gut"><div class="j-t"><h1>Join</h1><p class="url">${esc(shortUrl())}</p><button class="link" data-act="join-close">Close</button></div><div class="j-q"><span class="qr" data-qr></span></div></div>`; o.hidden = false; paintQR(); $('.link', o).focus(); } else { o.hidden = true; o.innerHTML = ''; } }
function toggleSheet(on) { sheetOpen = on; renderSheet(); if (on) $('#sheetDone').focus(); else $('#setBtn').focus(); }

/* ---------- motion ---------- */
function countUp(el, to, from = 0, dur = 1100) { if (!el) return; if (calm() || to === from) { el.textContent = to; return; } const t0 = performance.now(); const f = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(from + (to - from) * e); if (p < 1 && el.isConnected) requestAnimationFrame(f); }; el.textContent = from; requestAnimationFrame(f); }
function confetti() {
  const cv = $('#confetti'); if (!cv || calm()) return; const cs = getComputedStyle(document.documentElement), cols = ['--accent', '--rule', '--accent-ink', '--soft'].map(v => cs.getPropertyValue(v).trim() || '#C9822B');
  const dpr = Math.min(2, devicePixelRatio || 1), W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr, x = cv.getContext('2d');
  const bits = [...Array(110)].map((_, i) => ({ x: Math.random() * W, y: -Math.random() * H * .6, s: (5 + Math.random() * 9) * dpr, vy: (1.6 + Math.random() * 2.6) * dpr, vx: (Math.random() - .5) * 1.4 * dpr, r: Math.random() * 6.28, vr: (Math.random() - .5) * .14, c: cols[i % cols.length] }));
  const t0 = performance.now(); const f = now => { if (!cv.isConnected) return; const age = now - t0; x.clearRect(0, 0, W, H); x.globalAlpha = Math.max(0, Math.min(1, (4200 - age) / 900));
    bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.r += b.vr; x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * .6); x.restore(); });
    if (age < 4200) requestAnimationFrame(f); else x.clearRect(0, 0, W, H); }; requestAnimationFrame(f);
}

/* ---------- rendering and flow ---------- */
const app = $('#app'), main = $('#main');
function render(focus) {
  const scr = state.screen; app.dataset.screen = scr; app.dataset.who = state.who; app.dataset.step = scr === 'host' ? stepKey().replace(/\d$/, '') : '';
  main.innerHTML = V[scr]();
  const host = scr === 'host';
  $('#clock').hidden = !host || !['lobby', 'debrief0', 'debrief1', 'debrief2'].includes(stepKey());
  $('#joinBtn').hidden = !(host && SITE_URL && stepKey() !== 'lobby'); $('#notesBtn').hidden = !host;
  renderNotes(); paintClock(); paintQR();
  const f = focus && $(focus); if (f) f.focus({ preventScroll: true });
}
function renderNotes() {
  const el = $('#notes'), on = state.notes && state.screen === 'host'; el.hidden = !on; $('#notesBtn').setAttribute('aria-pressed', state.notes); if (!on) return;
  const k = stepKey().replace(/\d$/, '');
  el.innerHTML = `<div><h2>Now</h2><ol>${NOTES[k].map(n => `<li>${esc(n)}</li>`).join('')}</ol></div><div><h2>Keys</h2><p>${KEYS}</p></div>`;
}
function go(name, focus) { state.screen = name; render(focus === undefined ? '#go' : focus); scrollTo(0, 0); if (name === 'q') tickBar(); }
function hostStep(i) { const h = state.host; i = Math.max(0, Math.min(STEPS.length - 1, i)); const was = h.step; h.step = i; const k = stepKey();
  if (k.startsWith('debrief') && was !== i) setClock(GAME.shareSeconds); if (k === 'lobby' && was !== i) setClock(GAME.minutes * 60);
  render(k === 'board' ? '#e-name' : '#go'); scrollTo(0, 0); if (k === 'podium') confetti(); }
function fullscreen() { try { if (document.fullscreenElement) document.exitFullscreen(); else { const p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {}); } } catch (e) {} }
const parseV = v => v === 'true' ? true : v === 'false' ? false : v;
function readName() { const el = $('#name'); if (el) { prefs.name = el.value.trim().replace(/\s+/g, ' ').slice(0, 14); savePrefs(); } }
function place(t) { const r = state.run, c = r.cur, q = QUESTIONS[r.i]; if (r.phase !== 'ask' || c.seq.includes(t) || c.seq.length >= q.tiles.length) return; c.seq.push(t); render(c.seq.length === q.tiles.length ? '#go' : null); }
function massign(t) { const r = state.run, c = r.cur, q = QUESTIONS[r.i]; if (r.phase !== 'ask') return; Object.keys(c.map).forEach(k => { if (c.map[k] === t) delete c.map[k]; }); c.map[c.sel] = t;
  const nxt = q.pairs.findIndex((_, i) => c.map[i] === undefined); if (nxt >= 0) c.sel = nxt; render(nxt < 0 ? '#go' : null); }

document.addEventListener('submit', e => { e.preventDefault();
  if (e.target.id === 'nameForm') { readName(); newRun(false); }
  else if (e.target.id === 'entry') { const n = $('#e-name').value.trim().slice(0, 14), s = parseInt($('#e-score').value.replace(/\D/g, ''), 10); if (!n || isNaN(s)) { (n ? $('#e-score') : $('#e-name')).focus(); return; }
    state.host.board.push({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: n, score: Math.min(99999, s) }); savePrefs(); render('#e-name'); } });
document.addEventListener('click', e => {
  if (e.target.id === 'scrim') { toggleSheet(false); return; }
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, r = state.run, h = state.host;
  if (a === 'home') { cancelAnimationFrame(raf); stopClock(); state.who = 'solo'; go('title', '#name'); }
  else if (a === 'play') newRun(false);
  else if (a === 'practice') { readName(); newRun(true); }
  else if (a === 'host') { readName(); state.who = 'host'; h.step = 0; setClock(GAME.minutes * 60); go('host'); }
  else if (a === 'answer') { const q = QUESTIONS[r.i], k = +b.dataset.k; settle(q.type === 'tf' ? k === 0 : k, false); }
  else if (a === 'place') place(+b.dataset.t);
  else if (a === 'unplace') { if (r.phase === 'ask') { r.cur.seq.splice(+b.dataset.i, 1); render(); } }
  else if (a === 'msel') { if (r.phase === 'ask') { r.cur.sel = +b.dataset.i; render(`.mrow[data-i="${b.dataset.i}"]`); } }
  else if (a === 'massign') massign(+b.dataset.t);
  else if (a === 'check') settle(null, false);
  else if (a === 'next') nextQuestion();
  else if (a === 'step') hostStep(+b.dataset.i);
  else if (a === 'hnext') { if (h.step === STEPS.length - 1) { stopClock(); state.who = 'solo'; go('title', '#name'); } else hostStep(h.step + 1); }
  else if (a === 'drop') { h.board = h.board.filter(x => x.id !== b.dataset.id); savePrefs(); render('#e-name'); }
  else if (a === 'clear') { h.board = []; savePrefs(); render('#e-name'); }
  else if (a === 'tally') { const t = h.tally[+b.dataset.d]; t[+b.dataset.i] = Math.max(0, t[+b.dataset.i] + (+b.dataset.v)); render(`.pm[data-i="${b.dataset.i}"][data-v="${b.dataset.v}"]`); }
  else if (a === 'ours') { h.shown[+b.dataset.d] = true; render('#go'); }
  else if (a === 'clock') running() ? stopClock() : startClock();
  else if (a === 'less') nudge(-30); else if (a === 'more') nudge(30);
  else if (a === 'notes') { state.notes = !state.notes; renderNotes(); }
  else if (a === 'settings') toggleSheet(!sheetOpen);
  else if (a === 'set') { const k = b.dataset.k; prefs.set[k] = parseV(b.dataset.v); applySet(); savePrefs(); renderSheet(); const f = $(`#sheet [data-k="${k}"][aria-pressed="true"]`); if (f) f.focus(); }
  else if (a === 'join') toggleJoin(true); else if (a === 'join-close') toggleJoin(false);
});
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const inField = e.target.tagName === 'INPUT', k = e.key.length === 1 ? e.key.toLowerCase() : e.key, scr = state.screen, num = /^[1-9]$/.test(k) ? +k : 0;
  if (!$('#join').hidden) { if (k === 'Escape' || k === 'Enter' || (k === 'j' && !inField)) { e.preventDefault(); toggleJoin(false); } return; }
  if (sheetOpen) { if (k === 'Escape' || k === 's') { e.preventDefault(); toggleSheet(false); } return; }
  if (inField) return;
  if (k === 'f') { fullscreen(); return; }
  if (k === 's') { toggleSheet(true); return; }
  if (scr === 'host') {
    if (k === ' ') { e.preventDefault(); if (!$('#clock').hidden) running() ? stopClock() : startClock(); }
    else if (k === 'n') { state.notes = !state.notes; renderNotes(); }
    else if (k === 'j') toggleJoin(true);
    else if (k === 'ArrowRight') { e.preventDefault(); hostStep(state.host.step + 1); }
    else if (k === 'ArrowLeft') { e.preventDefault(); hostStep(state.host.step - 1); }
    return;
  }
  if (scr === 'q') { const r = state.run, q = QUESTIONS[r.i], c = r.cur;
    if (r.phase === 'fb') { if (k === 'Enter' || k === 'ArrowRight') { e.preventDefault(); nextQuestion(); } return; }
    if (q.type === 'mc' || q.type === 'stand') { if (num && num <= q.opts.length) settle(num - 1, false); }
    else if (q.type === 'spot') { if (num && num <= q.phrases.length) settle(num - 1, false); }
    else if (q.type === 'tf') { if (k === '1' || k === 't') settle(true, false); else if (k === '2') settle(false, false); }
    else if (q.type === 'order') { if (num && num <= c.lay.length) place(c.lay[num - 1]); else if (k === 'Backspace') { e.preventDefault(); c.seq.pop(); render(); } else if (k === 'Enter' && c.seq.length === q.tiles.length) { e.preventDefault(); settle(null, false); } }
    else if (q.type === 'match') { if (num && num <= c.lay.length) massign(c.lay[num - 1]); else if (k === 'ArrowDown') { e.preventDefault(); c.sel = (c.sel + 1) % q.pairs.length; render(); } else if (k === 'ArrowUp') { e.preventDefault(); c.sel = (c.sel + q.pairs.length - 1) % q.pairs.length; render(); } else if (k === 'Enter' && q.pairs.every((_, i) => c.map[i] !== undefined)) { e.preventDefault(); settle(null, false); } }
  }
});
document.addEventListener('keyup', e => { if (e.key === ' ' && e.target.tagName !== 'INPUT' && state.screen === 'host') e.preventDefault(); });

loadPrefs(); applySet(true); render();
try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => state); } catch (e) {}
