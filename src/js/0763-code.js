/* ===== CODE LAB: programming, a strand of its own (approved by Tony on 28 October: "Approve the plan of attack").
   Why: programming runs through every subject at good intermediate schools. Before this, the game's coding was grid puzzles inside the countries (moves and repeats only).
   The plan: twelve stations that teach the ideas of programming in order, the first four built and reviewed before the rest:
     1 Steps in order (a sequence)   2 Find the bug (debugging)   3 Repeat (loops)   4 Draw with loops (patterns, a loop inside a loop)
     still to come: 5 If (decisions)  6 If or else  7 Repeat until  8 Counters (variables)  9 My own blocks (functions)  10 Blocks with numbers  11 Buttons and events  12 Real code
   Pitched against the New Zealand Curriculum, Technology, computational thinking for digital technologies (read 28 October 2026, tki.org.nz):
     progress outcome 1, "a set of precise, unambiguous, step by step instructions"; 2, "give, follow, and debug simple algorithms";
     3, "predict the behaviour of the programs ... more than one algorithm for the same problem ... develop and debug simple programs that use ... sequence, and iteration";
     4, "the three building blocks of programming" (sequence, selection, iteration).
   A small robot on a grid, seen from above, faces one way. Blocks: forward (one square the way it faces), turn clockwise, turn anticlockwise, repeat.
   Turns are clockwise or anticlockwise, never left or right (the game's rule). Blocks are tapped in, so it works on the tablet and phone.
   The teaching rule holds: a wrong program runs and shows what it did (it bumps, or stops in the wrong place), and the help points at what is there: the block it bumped after,
   then the trip broken into parts with a flag, then the squares of the part counted out. A puzzle with a block limit is made to work first, then made short.
   Nothing lights up the answer. Anything missed comes back at the end of the station until it is right first time.
   Her place: S.code { st: stations passed, gold: { puzzle: 1 } fewest-blocks gears, weak: { puzzle: misses }, day }. No country owns it ===== */

const CD_DIR = [[0, -1], [1, 0], [0, 1], [-1, 0]], CD_FACE = { u: 0, r: 1, d: 2, l: 3 };
/* a program written short: F forward, cw and acw turns, R3( … ) repeat three times */
function cdParse(s) {
  const tok = String(s).replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/).filter(Boolean); let i = 0;
  const list = () => { const out = []; while (i < tok.length && tok[i] !== ')') { const t = tok[i++];
      if (/^R\d$/.test(t)) { i++; const body = list(); i++; out.push({ t: 'R', n: Number(t[1]), body }); } else out.push({ t: t === 'F' ? 'F' : t }); } return out; };
  return list();
}
const cdCount = l => l.reduce((a, n) => a + 1 + (n.t === 'R' ? cdCount(n.body) : 0), 0);
const cdText = l => l.map(n => n.t === 'R' ? 'R' + n.n + '(' + cdText(n.body) + ')' : n.t).join(' ');
const cdClone = l => l.map(n => n.t === 'R' ? { t: 'R', n: n.n, body: cdClone(n.body) } : { t: n.t });

/* ---- the twelve stations; the first four built ---- */
const CD_ST = [
  { name: 'Steps in order', icon: 'footprints', idea: 'A program is exact steps, done in order.',
    ideaSay: 'A program is a list of exact steps. The robot does them in order, one at a time. Forward moves one square the way the robot faces. A turn turns it on the spot, clockwise or anticlockwise.',
    blocks: ['F', 'cw', 'acw'],
    meet: [{ b: { cols: 5, rows: 3, start: [0, 1], face: 'r', goal: [3, 2] }, prog: 'F F cw F acw F' }],
    items: [
      { id: '1a', k: 'build', b: { cols: 5, rows: 3, start: [0, 1], face: 'r', goal: [3, 1] }, sol: 'F F F', text: 'Get the robot to the battery.' },
      { id: '1b', k: 'build', b: { cols: 4, rows: 4, start: [0, 3], face: 'u', goal: [2, 1] }, sol: 'F F cw F F', text: 'Get the robot to the battery.' },
      { id: '1c', k: 'predict', b: { cols: 5, rows: 4, start: [1, 0], face: 'r' }, prog: 'F cw F F', text: 'Where will the robot stop? Tap the square.' },
      { id: '1d', k: 'build', b: { cols: 5, rows: 3, start: [0, 1], face: 'r', goal: [4, 1], crates: [[2, 1]] }, sol: 'F acw F cw F F F cw F', text: 'Go round the crate to the battery.' },
      { id: '1e', k: 'build', b: { cols: 5, rows: 3, start: [0, 0], face: 'r', gems: [[2, 0], [2, 2]], goal: [4, 2] }, sol: 'F F cw F F acw F F', text: 'Collect both gems, then the battery.' },
      { id: '1f', k: 'predict', b: { cols: 5, rows: 4, start: [3, 3], face: 'u' }, prog: 'F acw F F cw F', text: 'Where will the robot stop? Tap the square.' }] },
  { name: 'Find the bug', icon: 'lady-beetle', idea: 'A bug is a mistake. Test it, find it, fix it.',
    ideaSay: 'Programmers call a mistake in a program a bug. They test the program, watch where it goes wrong, find the bug, and fix it. Watch this one go wrong.',
    blocks: ['F', 'cw', 'acw'],
    meet: [{ b: { cols: 5, rows: 3, start: [0, 1], face: 'r', goal: [4, 1] }, prog: 'F F acw F F', bug: true, after: 'One turn went the wrong way. Fixed, it works.', fixed: 'F F F F' }],
    items: [
      { id: '2a', k: 'fix', b: { cols: 5, rows: 3, start: [0, 1], face: 'r', goal: [4, 1] }, prog: 'F F F', bug: 3, sol: 'F F F F', text: 'Test it. Then find the bug and fix it.' },
      { id: '2b', k: 'bug', b: { cols: 5, rows: 4, start: [0, 3], face: 'u', goal: [3, 0] }, prog: 'F F F acw F F F', bug: 3, text: 'Which block is the bug? Test it, then tap it.' },
      { id: '2c', k: 'fix', b: { cols: 4, rows: 4, start: [0, 0], face: 'r', goal: [2, 2] }, prog: 'F F cw F F F', bug: 5, sol: 'F F cw F F', text: 'Test it. Then find the bug and fix it.' },
      { id: '2d', k: 'predict', b: { cols: 4, rows: 4, start: [0, 1], face: 'r' }, prog: 'F cw F F', text: 'Where will this program stop? Tap the square.' },
      { id: '2e', k: 'fix', b: { cols: 5, rows: 3, start: [0, 2], face: 'r', goal: [3, 1], crates: [[2, 2]] }, prog: 'F F acw F cw F', bug: 1, sol: 'F acw F cw F F', text: 'A block is in the wrong place. Fix it.' }] },
  { name: 'Repeat', icon: 'repeat-button', idea: 'Repeat does the blocks inside it again.',
    ideaSay: 'When steps repeat, a loop says them once. Repeat five, with forward inside it, does forward five times. Shorter, and easy to read.',
    blocks: ['F', 'cw', 'acw', 'R'],
    meet: [{ b: { cols: 6, rows: 2, start: [0, 0], face: 'r', goal: [5, 0] }, prog: 'F F F F F', after: 'Five blocks. Now the same with a loop: two blocks.', fixed: 'R5(F)' }],
    items: [
      { id: '3a', k: 'build', b: { cols: 6, rows: 2, start: [0, 0], face: 'r', goal: [5, 0] }, max: 2, sol: 'R5(F)', text: 'Get to the battery. Use 2 blocks or fewer.' },
      { id: '3b', k: 'predict', b: { cols: 5, rows: 3, start: [0, 0], face: 'r' }, prog: 'R3(F) cw F', text: 'Where will the robot stop? Tap the square.' },
      { id: '3c', k: 'build', b: { cols: 5, rows: 5, start: [0, 4], face: 'u', gems: [[1, 3], [2, 2], [3, 1]], goal: [4, 0] }, max: 5, sol: 'R4(F cw F acw)', text: 'Collect every gem. Use 5 blocks or fewer.' },
      { id: '3d', k: 'build', b: { cols: 3, rows: 3, start: [0, 0], face: 'r', gems: [[2, 0], [2, 2], [0, 2]], goal: [0, 0] }, max: 4, sol: 'R4(F F cw)', text: 'Collect the gems, then come back. 4 blocks.' },
      { id: '3e', k: 'predict', b: { cols: 4, rows: 4, start: [0, 0], face: 'r' }, prog: 'R2(F F cw)', text: 'Where will the robot stop? Tap the square.' },
      { id: '3f', k: 'build', b: { cols: 6, rows: 4, start: [0, 3], face: 'r', goal: [5, 0] }, max: 5, sol: 'R5(F) acw R3(F)', text: 'Get to the battery. Use 5 blocks or fewer.' }] },
  { name: 'Draw with loops', icon: 'paintbrush', idea: 'The robot draws as it goes. Loops make patterns.',
    ideaSay: 'Now the robot has a pen. It draws a line wherever it goes. A square is the same side and the same turn, four times, so a loop draws it.',
    blocks: ['F', 'cw', 'acw', 'R'],
    meet: [{ b: { cols: 4, rows: 4, start: [1, 2], face: 'u', pen: true }, prog: 'R4(F cw)' }],
    items: [
      { id: '4a', k: 'build', b: { cols: 4, rows: 4, start: [1, 3], face: 'u', pen: true, target: [[1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3]] }, max: 4, sol: 'R4(F F cw)', text: 'Draw the dotted square. Use 4 blocks or fewer.' },
      { id: '4b', k: 'shape', prog: 'R4(F cw)', opts: ['R4(F F)', 'F F cw F F'], text: 'Which shape will the robot draw?' },
      { id: '4c', k: 'build', b: { cols: 5, rows: 4, start: [0, 1], face: 'r', pen: true, target: [[0, 1], [1, 1], [2, 1], [3, 1], [3, 2], [2, 2], [1, 2], [0, 2], [0, 1]] }, max: 7, sol: 'R2(F F F cw F cw)', text: 'Draw the dotted shape. Use 7 blocks or fewer.' },
      { id: '4d', k: 'build', b: { cols: 5, rows: 5, start: [0, 4], face: 'r', pen: true, target: [[0, 4], [1, 4], [1, 3], [2, 3], [2, 2], [3, 2], [3, 1], [4, 1], [4, 0]] }, max: 5, sol: 'R4(F acw F cw)', text: 'Draw the dotted stairs. Use 5 blocks or fewer.' },
      { id: '4e', k: 'shape', prog: 'R2(F F cw F cw)', opts: ['R4(F F cw)', 'R4(F acw F cw)'], text: 'Which shape will the robot draw?' },
      { id: '4f', k: 'build', b: { cols: 5, rows: 5, start: [1, 4], face: 'u', pen: true, target: [[1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [4, 2], [4, 3], [4, 4], [3, 4], [2, 4], [1, 4]] }, max: 5, best: 3, sol: 'R4(R3(F) cw)', text: 'Draw the big dotted square. Use 5 blocks or fewer.' }] },
  { name: 'If', icon: 'thinking-face', soon: true }, { name: 'If or else', icon: 'magnifying-glass-tilted-left', soon: true }, { name: 'Repeat until', icon: 'battery', soon: true },
  { name: 'Counters', icon: 'gem-stone', soon: true }, { name: 'My own blocks', icon: 'puzzle-piece', soon: true }, { name: 'Blocks with numbers', icon: 'control-knobs', soon: true },
  { name: 'Buttons and events', icon: 'joystick', soon: true }, { name: 'Real code', icon: 'keyboard', soon: true }
];
const CD_BUILT = CD_ST.filter(s => !s.soon).length;
/* a gift for her room at every station: things a programmer would have (shop shelf "Code Lab gifts") */
const CD_GIFTS = [['robot', 'Robot friend'], ['lady-beetle', 'The bug you caught'], ['joystick', 'Joystick'], ['desktop-computer', 'Computer']]
  .map((g, i) => ({ id: 'cdg-' + g[0], art: g[0], name: g[1], price: 0, cd: i + 1 }));
CD_ST.forEach(s => (s.items || []).forEach(it => { if (it.sol) it.best = it.best || cdCount(cdParse(it.sol)); }));
const cdState = () => { if (!S.code || typeof S.code !== 'object') S.code = { st: 0, gold: {}, weak: {} }; if (!S.code.gold) S.code.gold = {}; if (!S.code.weak) S.code.weak = {}; return S.code; };

/* ---- running a program: every step the robot takes, where it is, and what happened ---- */
function cdSim(b, prog, from) {
  const crates = new Set((b.crates || []).map(c => c + '')), gems = new Set((b.gems || []).map(c => c + ''));
  let x = (from || b.start)[0], y = (from || b.start)[1], f = from && from.length > 2 ? from[2] : CD_FACE[b.face]; const trace = [], got = new Set(), edges = new Set();
  let bump = false, n = 0;
  const walk = (list, anc) => { for (const nd of list) { if (bump || n > 200) return;
      if (nd.t === 'R') { for (let k = 0; k < nd.n && !bump; k++) walk(nd.body, anc.concat([nd])); continue; }
      n++;
      if (nd.t === 'F') { const nx = x + CD_DIR[f][0], ny = y + CD_DIR[f][1];
        if (nx < 0 || ny < 0 || nx >= b.cols || ny >= b.rows || crates.has(nx + ',' + ny)) { bump = true; trace.push({ nd, anc, x, y, f, bump: true }); return; }
        if (b.pen) edges.add([[x, y], [nx, ny]].map(String).sort().join('|'));
        x = nx; y = ny; if (gems.has(x + ',' + y)) got.add(x + ',' + y); }
      else f = (f + (nd.t === 'cw' ? 1 : 3)) % 4;
      trace.push({ nd, anc, x, y, f }); } };
  walk(prog, []);
  return { trace, x, y, f, bump, got, edges, gems };
}
const cdEdgesOf = route => new Set(route.slice(1).map((c, i) => [route[i], c].map(String).sort().join('|')));
/* did it do the job? reached the battery, collected every gem, drew the shape */
function cdWin(b, r) {
  if (r.bump) return false;
  if (b.goal && !(r.x === b.goal[0] && r.y === b.goal[1])) return false;
  if (r.got.size < r.gems.size) return false;
  if (b.target) { const t = cdEdgesOf(b.target); if (t.size !== r.edges.size || [...t].some(e => !r.edges.has(e))) return false; }
  return true;
}
/* the shortest trip (gems in order, then the battery), or the shape's own route: used to break a missed trip into parts */
function cdRoute(b) {
  if (b.target) return b.target.map(c => c.slice());
  const crates = new Set((b.crates || []).map(c => c + '')), stops = (b.gems || []).concat(b.goal ? [b.goal] : []);
  const bfs = (a, z) => { const prev = { [a + '']: null }, q = [a]; while (q.length) { const c = q.shift(); if (c + '' === z + '') break;
      for (const d of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const n = [c[0] + d[0], c[1] + d[1]], k = n + ''; if (n[0] < 0 || n[1] < 0 || n[0] >= b.cols || n[1] >= b.rows || crates.has(k) || k in prev) continue; prev[k] = c; q.push(n); } }
    const out = []; for (let c = z; c; c = prev[c + '']) out.unshift(c); return out; };
  let route = [b.start.slice()]; stops.forEach(s => { route = route.concat(bfs(route[route.length - 1], s).slice(1)); });
  return route;
}
/* where the trip turns a corner (and where it ends): each part of a broken-down trip ends at one */
function cdCorners(route) { const out = []; for (let i = 1; i < route.length; i++) { const nx = route[i + 1]; if (!nx) { out.push(i); break; }
    const d1 = [route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]], d2 = [nx[0] - route[i][0], nx[1] - route[i][1]]; if (d1[0] !== d2[0] || d1[1] !== d2[1]) out.push(i); } return out; }

/* ---- the board: a grid seen from above, the robot, crates, gems, the battery, the pen's lines and the dotted shape to draw ---- */
const CD_BOT = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="22" width="13" height="58" rx="6" fill="#2B3A55"/><rect x="75" y="22" width="13" height="58" rx="6" fill="#2B3A55"/>' +
  '<rect x="21" y="16" width="58" height="70" rx="17" fill="#4C6FD8"/><rect x="29" y="23" width="42" height="24" rx="9" fill="#DCE7FF"/><circle cx="41" cy="35" r="5.500" fill="#1B2A4E"/><circle cx="59" cy="35" r="5.500" fill="#1B2A4E"/>' +
  '<path d="M50 3v14" stroke="#1B2A4E" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="4" r="5" fill="#F2C14E"/><rect x="35" y="58" width="30" height="14" rx="5" fill="#F28C28"/></svg>';
function cdBoard(b, o) {
  o = o || {}; const W2 = b.cols, H2 = b.rows, wrap = h('div', { class: 'cq cd-cq' });
  const grid = h('div', { class: 'cd-grid' + (b.pen ? ' pen' : ''), style: { 'grid-template-columns': 'repeat(' + W2 + ',1fr)', 'grid-template-rows': 'repeat(' + H2 + ',1fr)', width: 'min(100cqw,calc(100cqh*' + (W2 / H2) + '))', 'aspect-ratio': W2 + ' / ' + H2 } });
  const cells = {}; for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const c = h(o.pick ? 'button' : 'div', { class: 'cd-cell', 'data-x': x, 'data-y': y, 'aria-label': o.pick ? 'Square ' + (x + 1) + ', ' + (y + 1) : null }); cells[x + ',' + y] = c; grid.append(c); }
  const svg = h('div', { class: 'cd-lines', html: '<svg viewBox="0 0 ' + W2 + ' ' + H2 + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    (b.target ? '<polyline class="cd-target" points="' + b.target.map(c => (c[0] + .5) + ',' + (c[1] + .5)).join(' ') + '"/>' : '') + '<g class="cd-ink"></g></svg>' });
  grid.append(svg); const ink = svg.querySelector('.cd-ink');
  (b.crates || []).forEach(c => cells[c + ''].append(art('package', 'cd-crate')));
  const gemEls = {}; (b.gems || []).forEach(c => { const g = art('gem-stone', 'cd-gem'); gemEls[c + ''] = g; cells[c + ''].append(g); });
  if (b.goal) cells[b.goal + ''].append(art('battery', 'cd-goal'));
  const bot = h('div', { class: 'cd-bot', style: { width: (100 / W2) + '%', height: (100 / H2) + '%' } }, h('div', { class: 'cd-botin', html: CD_BOT }));
  grid.append(bot); wrap.append(grid);
  let ang = 0, flagEl = null;
  const B = {
    el: wrap, grid, cells,
    put(x, y, f, instant) { if (instant) bot.style.transition = 'none'; bot.style.left = (x * 100 / W2) + '%'; bot.style.top = (y * 100 / H2) + '%';
      if (f != null) { let d = ((f * 90 - ang) % 360 + 540) % 360 - 180; if (instant) ang = f * 90; else ang += d; bot.firstChild.style.transform = 'rotate(' + ang + 'deg)'; }
      if (instant) { void bot.offsetWidth; bot.style.transition = ''; } },
    bump() { bot.classList.remove('cd-bonk'); void bot.offsetWidth; bot.classList.add('cd-bonk'); },
    line(a, z) { ink.insertAdjacentHTML('beforeend', '<line x1="' + (a[0] + .5) + '" y1="' + (a[1] + .5) + '" x2="' + (z[0] + .5) + '" y2="' + (z[1] + .5) + '"/>'); },
    take(x, y) { const g = gemEls[x + ',' + y]; if (g) g.classList.add('got'); },
    reset() { ink.innerHTML = ''; Object.values(gemEls).forEach(g => g.classList.remove('got')); $$('.cd-cell.stop,.cd-cell.num', grid).forEach(c => { c.classList.remove('stop', 'num'); c.removeAttribute('data-n'); }); B.put(b.start[0], b.start[1], CD_FACE[b.face], true); },
    flag(c) { if (flagEl) flagEl.remove(); flagEl = null; if (c) { flagEl = art('triangular-flag', 'cd-flag'); cells[c + ''].append(flagEl); } },
    nums(list) { $$('.cd-cell.num', grid).forEach(c => { c.classList.remove('num'); c.removeAttribute('data-n'); }); (list || []).forEach((c, i) => { const e = cells[c + '']; e.classList.add('num'); e.setAttribute('data-n', i + 1); }); },
    stop(x, y) { cells[x + ',' + y].classList.add('stop'); }
  };
  B.put(b.start[0], b.start[1], CD_FACE[b.face], true);
  return B;
}

/* ---- the program. Two ways to build it, and both always work:
   DRAG (Tony, 29 October: "Ideally i want to be able to move the blocks around by clicking and dragging"): drag a block from the bottom row to where it should go;
     drag a block already in the program to move it (a repeat moves with everything inside it), into a repeat, out of one, or after it; drag it off the program to take it off.
     While dragging, a pink line shows where it will land, and a repeat it would go inside lights up.
   TAP: a block from the bottom row goes in at the pink line. Tap any gap between blocks (or the space before or after a repeat) to move the line there;
     tap a block to put the line after it, a repeat's head to go inside it, its end to come out after it.
   The number on a repeat opens a row of numbers (2 to 9) to pick from, so a wrong number is fixed with one tap ("if I accidently click too many repeat cycles, i need to delete the cycle").
   ✕ takes off the chosen block. Mouse and touch both work (pointer events; blocks have touch-action: none so a finger drags instead of scrolling) ---- */
const CD_ICON = {
  F: '<svg viewBox="0 0 24 24"><path d="M12 3l7 8h-4.500v10h-5V11H5z" fill="currentColor"/></svg>',
  cw: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 0 8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 0l5 4-5 4z" fill="currentColor"/></svg>',
  acw: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 1-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 0l-5 4 5 4z" fill="currentColor"/></svg>'
};
const CD_WORD = { F: 'forward', cw: 'turn ↻', acw: 'turn ↺', R: 'repeat' }, CD_SAY = { F: 'forward', cw: 'turn clockwise', acw: 'turn anticlockwise', R: 'repeat' };
function cdEditor(allowed, o) {
  o = o || {}; let prog = [], cur = { list: prog, i: 0 }, sel = null, locked = !!o.locked, justDragged = false, pick = null;
  const els = new Map(), heads = new Map(), ends = new Map(), bodies = new Map(), keep = new Set();   /* keep: blocks marked to stay marked (the dashed suspects) */
  const strip = h('div', { class: 'cd-prog' + (locked ? ' ro' : '') }), count = h('span', { class: 'cd-count' }), marker = h('i', { class: 'cd-drop' });
  const parentOf = (node, list = prog) => { for (let i = 0; i < list.length; i++) { if (list[i] === node) return { list, i }; if (list[i].t === 'R') { const r = parentOf(node, list[i].body); if (r) return r; } } return null; };
  const inTree = l => l === prog || (function f(ls) { return ls.some(n => n.t === 'R' && (n.body === l || f(n.body))); })(prog);
  const ownerOf = l => { let o2 = null; (function f(ls) { ls.forEach(n => { if (n.t === 'R') { if (n.body === l) o2 = n; f(n.body); } }); })(prog); return o2; };
  const changed = () => { if (o.onChange) o.onChange(); };
  const caret = () => h('i', { class: 'cd-caret' });
  const free = () => !locked && !o.onTap;
  const chip = n => {
    if (n.t !== 'R') { const b = h('button', { class: 'cd-b cd-' + n.t + (n === sel ? ' sel' : '') + (keep.has(n) ? ' suspect' : ''), 'aria-label': CD_SAY[n.t], html: CD_ICON[n.t] }); els.set(n, b);
      b.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); const p = parentOf(n); sel = n; cur = { list: p.list, i: p.i + 1 }; draw(); });
      b.addEventListener('pointerdown', e => startDrag(e, { node: n })); return b; }
    const num = h('button', { class: 'cd-n', 'aria-label': 'Repeat ' + n.n + ' times. Tap to choose how many' }, '×' + n.n), head = h('button', { class: 'cd-rh' + (n === sel ? ' sel' : ''), 'aria-label': 'Repeat' }, ic('repeat-button'));
    const end = h('button', { class: 'cd-re', 'aria-label': 'After the repeat' }), body = h('span', { class: 'cd-body' });
    const box = h('span', { class: 'cd-rep' + (n === sel ? ' sel' : '') }, head, num, body, end); els.set(n, box); heads.set(n, head); ends.set(n, end); bodies.set(n, body);
    head.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); sel = n; cur = { list: n.body, i: n.body.length }; draw(); });
    head.addEventListener('pointerdown', e => startDrag(e, { node: n }));
    num.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); openPick(n, num); });
    end.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); const p = parentOf(n); sel = n; cur = { list: p.list, i: p.i + 1 }; draw(); });
    list(n.body, body); return box; };
  const list = (l, into) => { if (!locked && cur.list === l && cur.i === 0) into.append(caret()); l.forEach((n, i) => { into.append(chip(n)); if (!locked && cur.list === l && cur.i === i + 1) into.append(caret()); }); };
  function draw() {
    closePick(); if (!inTree(cur.list)) cur = { list: prog, i: prog.length };
    els.clear(); heads.clear(); ends.clear(); bodies.clear(); strip.innerHTML = ''; list(prog, strip);
    if (!prog.length) strip.append(h('span', { class: 'cd-empty' }, locked ? '' : 'Tap or drag the blocks below'));
    count.textContent = cdCount(prog) + (o.max ? ' of ' + o.max : '') + ' blocks'; count.classList.toggle('over', !!o.max && cdCount(prog) > o.max); }
  const add = t => { if (locked) return; if (cdCount(prog) >= 24) { sfx.soft(); return; } sfx.tap(); const n = t === 'R' ? { t: 'R', n: 2, body: [] } : { t }; cur.list.splice(cur.i, 0, n); sel = n; cur = t === 'R' ? { list: n.body, i: 0 } : { list: cur.list, i: cur.i + 1 }; draw(); changed(); };
  /* ✕ takes off the chosen block; with none chosen, the block just before the pink line, or the last one */
  const del = () => { if (locked || !prog.length) return; sfx.tap(); let p = sel ? parentOf(sel) : null;
    if (!p) p = cur.i > 0 && inTree(cur.list) ? { list: cur.list, i: cur.i - 1 } : { list: prog, i: prog.length - 1 };
    p.list.splice(p.i, 1); sel = null; cur = { list: p.list, i: p.i }; if (!inTree(cur.list)) cur = { list: prog, i: prog.length }; draw(); changed(); };

  /* every place a block can go: each gap in each list, as points on the screen. A gap between two blocks on different rows gets a point at both */
  const gaps = exclude => { const out = [], pt = (el, side) => { const r = el.getBoundingClientRect(); return { x: side === 'l' ? r.left - 2 : r.right + 2, y: r.top + r.height / 2, h: r.height }; };
    const startOf = n => n.t === 'R' ? heads.get(n) : els.get(n), endOf = n => n.t === 'R' ? ends.get(n) : els.get(n);
    const walk = (l, cont) => {
      if (!l.length) { const r = cont.getBoundingClientRect(); out.push({ list: l, i: 0, x: r.left + 8, y: r.top + r.height / 2, h: Math.max(30, r.height) }); }
      for (let i = 0; i < l.length; i++) { out.push(Object.assign({ list: l, i }, pt(startOf(l[i]), 'l'))); if (i > 0) out.push(Object.assign({ list: l, i }, pt(endOf(l[i - 1]), 'r'))); }
      if (l.length) out.push(Object.assign({ list: l, i: l.length }, pt(endOf(l[l.length - 1]), 'r')));
      l.forEach(n => { if (n.t === 'R' && n !== exclude) walk(n.body, bodies.get(n)); }); };
    walk(prog, strip); return out; };
  const nearest = (x, y, exclude) => { let best = null, bd = 1e9; gaps(exclude).forEach(g => { const d = Math.abs(x - g.x) + 3 * Math.max(0, Math.abs(y - g.y) - g.h / 2); if (d < bd) { bd = d; best = g; } }); return best; };
  /* tapping a gap (not a block) puts the pink line there */
  strip.addEventListener('click', e => { if (justDragged || !free() || e.target.closest('button')) return; const g = nearest(e.clientX, e.clientY); if (!g) return; sfx.tap(); sel = null; cur = { list: g.list, i: g.i }; draw(); });

  /* dragging. src: { node } a block in the program, or { t } a new block from the bottom row */
  function startDrag(e, src) {
    if (!free() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const sx = e.clientX, sy = e.clientY; let on = false, ghost = null, target = null, off = false, lit = null;
    const light = n => { if (lit === n) return; if (lit && els.get(lit)) els.get(lit).classList.remove('into'); lit = n; if (n && els.get(n)) els.get(n).classList.add('into'); };
    const move = ev => {
      if (!on) { if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return; on = true; closePick(); ghost = ghostOf(src); document.body.append(ghost);
        if (src.node && els.get(src.node)) els.get(src.node).classList.add('dragging'); strip.classList.add('dropping'); strip.append(marker); }
      ev.preventDefault(); ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
      const r = strip.getBoundingClientRect(), pad = 28; off = ev.clientX < r.left - pad || ev.clientX > r.right + pad || ev.clientY < r.top - pad || ev.clientY > r.bottom + pad;
      target = off ? null : nearest(ev.clientX, ev.clientY, src.node); ghost.classList.toggle('bin', off && !!src.node);
      if (target) { marker.style.display = 'block'; marker.style.left = (target.x - r.left + strip.scrollLeft - 2) + 'px'; marker.style.top = (target.y - r.top + strip.scrollTop - Math.min(target.h, 46) / 2) + 'px'; marker.style.height = Math.min(target.h, 46) + 'px'; light(target.list === prog ? null : ownerOf(target.list)); }
      else { marker.style.display = 'none'; light(null); } };
    const end = (ev, cancel) => {
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', cancelled);
      if (!on) return; justDragged = true; setTimeout(() => { justDragged = false; }, 0);
      ghost.remove(); marker.remove(); strip.classList.remove('dropping'); light(null);
      if (cancel) { draw(); return; }
      if (src.node) { const p = parentOf(src.node);
        if (off) { p.list.splice(p.i, 1); sel = null; cur = { list: p.list, i: p.i }; sfx.tap(); }   /* dropped off the program: taken off */
        else if (target) { p.list.splice(p.i, 1); let i = target.i; if (target.list === p.list && p.i < i) i--; target.list.splice(i, 0, src.node); sel = src.node; cur = { list: target.list, i: i + 1 }; sfx.pop(); }
      } else if (target) { if (cdCount(prog) >= 24) { sfx.soft(); draw(); return; }
        const n = src.t === 'R' ? { t: 'R', n: 2, body: [] } : { t: src.t }; target.list.splice(target.i, 0, n); sel = n; cur = src.t === 'R' ? { list: n.body, i: 0 } : { list: target.list, i: target.i + 1 }; sfx.pop(); }
      draw(); changed(); };
    const up = ev => end(ev, false), cancelled = ev => end(ev, true);
    document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', cancelled);
  }
  const ghostOf = src => { const t = src.node ? src.node.t : src.t;
    return h('div', { class: 'cd-ghost' }, t === 'R' ? h('span', { class: 'cd-rep' }, h('span', { class: 'cd-rh' }, ic('repeat-button')), h('span', { class: 'cd-n' }, '×' + (src.node ? src.node.n : 2)), src.node && src.node.body.length ? h('span', { class: 'cd-more' }, '+' + cdCount(src.node.body)) : null)
      : h('span', { class: 'cd-b cd-' + t, html: CD_ICON[t] }), ic('wastebasket', 'cd-bin')); };

  /* the number picker of a repeat: 2 to 9, the current one marked */
  function closePick() { if (pick) { pick.remove(); pick = null; document.removeEventListener('pointerdown', outsidePick, true); } }
  function outsidePick(e) { if (pick && !pick.contains(e.target)) closePick(); }
  function openPick(n, anchor) {
    closePick(); const r = anchor.getBoundingClientRect();
    pick = h('div', { class: 'cd-pick', role: 'dialog', 'aria-label': 'How many times?' }, h('small', null, 'How many times?'),
      h('div', { class: 'cd-pick-row' }, [2, 3, 4, 5, 6, 7, 8, 9].map(k => h('button', { class: 'cd-pk' + (k === n.n ? ' on' : ''), 'data-n': k, 'aria-label': k + ' times', onclick: () => { n.n = k; sfx.pop(); sel = n; draw(); changed(); } }, String(k)))));
    document.body.append(pick);
    const pw = pick.offsetWidth, ph = pick.offsetHeight; let top = r.bottom + 6; if (top + ph > innerHeight - 6) top = Math.max(6, r.top - ph - 6);
    pick.style.left = Math.max(6, Math.min(innerWidth - pw - 6, r.left + r.width / 2 - pw / 2)) + 'px'; pick.style.top = top + 'px';
    setTimeout(() => { if (pick) document.addEventListener('pointerdown', outsidePick, true); }, 0);
    const watch = setInterval(() => { if (!strip.isConnected || !pick) { clearInterval(watch); closePick(); } }, 400); }

  const pal = h('div', { class: 'cd-pal' }, allowed.map(t => { const b = h('button', { class: 'cd-pb cd-' + t, 'data-t': t, 'aria-label': CD_SAY[t], onclick: () => { if (!justDragged) add(t); } }, t === 'R' ? ic('repeat-button') : h('span', { class: 'cd-pi', html: CD_ICON[t] }), h('small', null, CD_WORD[t]));
    b.addEventListener('pointerdown', e => startDrag(e, { t })); return b; }));
  const E = {
    strip, pal, count, get prog() { return prog; },
    set(p) { prog = cdClone(p); keep.clear(); cur = { list: prog, i: prog.length }; sel = null; draw(); },
    suspect(nodes) { nodes.forEach(n => n && keep.add(n)); draw(); },
    clear() { E.set([]); },
    lock(on) { locked = on; strip.classList.toggle('ro', !!on); pal.classList.toggle('off', !!on); draw(); },
    hi(nd, anc) { $$('.run', strip).forEach(e => e.classList.remove('run')); [nd].concat(anc || []).forEach(n => { const e = els.get(n); if (e) e.classList.add('run'); }); },
    mark(nd, cls) { const e = els.get(nd); if (e) e.classList.add(cls); },
    unmark() { $$('.run,.bumped,.gone,.done', strip).forEach(e => e.classList.remove('run', 'bumped', 'gone', 'done')); },
    el(nd) { return els.get(nd); },
    add, del, max(m) { o.max = m; draw(); }
  };
  draw(); return E;
}

/* run a program on the board, step by step, lighting each block as it runs. Resolves with what happened */
async function cdRun(ui, B, E, b, prog, o) {
  o = o || {}; const r = cdSim(b, prog, o.from), steps = o.upto != null ? r.trace.slice(0, o.upto) : r.trace;
  let px = (o.from || b.start)[0], py = (o.from || b.start)[1];
  for (const s of steps) { if (!ui.alive) return r; E && E.hi(s.nd, s.anc);
    if (s.bump) { B.put(s.x, s.y, s.f); sfx.bonk(); B.bump(); if (E) E.mark(s.nd, 'bumped'); await ui.wait(W.fast ? 5 : 500); break; }
    if (b.pen && (s.x !== px || s.y !== py)) B.line([px, py], [s.x, s.y]);
    B.put(s.x, s.y, s.f); if (s.nd.t === 'F') { sfx.step(); B.take(s.x, s.y); } else sfx.tap(); px = s.x; py = s.y;
    await ui.wait(W.fast ? 2 : o.slow ? 650 : 380); }
  if (E) $$('.run', E.strip).forEach(e => e.classList.remove('run'));
  return Object.assign(r, { shown: steps.length });
}

/* ---- score, cheers and the summary: the same principles as the Japanese line ---- */
const CDS = { total: 0, done: 0, first: 0, asked: 0, combo: 0, best: 0, gold: 0, fixed: 0, left: 0, mode: '', ui: null };
function cdScore(ui, total) { Object.assign(CDS, { total, done: 0, first: 0, asked: 0, combo: 0, best: 0, gold: 0, fixed: 0, left: 0, mode: '', ui }); ui.steps(total, 0); }
function cdTick(ok, it) {
  const ui = CDS.ui; if (!ui || !ui.alive) return;
  if (!CDS.mode) { CDS.done = Math.min(CDS.total, CDS.done + 1); CDS.asked++; if (ok) CDS.first++; ui.steps(CDS.total, CDS.done); } else if (CDS.mode === 'retry' && ok) CDS.fixed++;
  const st = cdState(); if (it) { if (!ok) st.weak[it.id] = (st.weak[it.id] || 0) + 1; else if (st.weak[it.id]) { st.weak[it.id]--; if (!st.weak[it.id]) delete st.weak[it.id]; } }
  if (!ok) { CDS.combo = 0; return; }
  CDS.combo++; CDS.best = Math.max(CDS.best, CDS.combo); kiwiMood(ui.root, 'cheer');
  if ([3, 5, 8].includes(CDS.combo)) { sfx.great(); const c = h('div', { class: 'jp-combo' }, ic('sparkles'), CDS.combo + ' in a row!'); ui.root.append(c); Speech.say(CDS.combo + ' in a row!'); setTimeout(() => c.remove(), W.fast ? 10 : 1900); }
}

/* ---- the controls under a program: Go!, and take a block off ---- */
function cdControls(E, onGo, extra) {
  const go2 = h('button', { class: 'btn go cd-go', 'data-k': 'go', onclick: onGo }, 'Go!'), del = h('button', { class: 'btn quiet cd-del', 'aria-label': 'Take a block off', html: BACKSPACE, onclick: () => E.del() });
  return h('div', { class: 'cd-ctl' }, E.pal, h('div', { class: 'cd-run' }, extra || null, go2, del));
}

/* ---- BUILD (and FIX): she builds (or mends) a program until the robot does the job ---- */
function cdBuild(ui, it, st) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b0 = it.b, B = cdBoard(b0), E = cdEditor(st.blocks, { max: it.max }); ui.stage.append(B.el);
    let b = Object.assign({}, b0), misses = 0, shortMiss = 0, phase = 'full', running = false, legs = null, leg = 0, here = null, helped = false;
    const route = cdRoute(b0);
    if (it.k === 'fix') E.set(cdParse(it.prog));
    const box = h('div', { class: 'cd-edit' }, h('div', { class: 'cd-ph' }, E.strip, E.count), cdControls(E, () => go()));
    ui.answer.append(box);
    const base = () => it.text + (it.max && phase !== 'free' ? '' : '');
    ui.prompt(base(), (it.say || it.text) + (it.k === 'fix' ? ' Press Go to test it first.' : ' Then press Go.'));
    const hook = () => { W.cur = { type: 'act', cd: it.id, phase, auto: () => solve(), miss: () => wrong(), prog: () => cdText(E.prog) }; };   /* prog: what is built, for the drag test */
    /* for the tests: put in a right program for this part, or a wrong one, and press Go */
    const solve = () => { if (running) return; if (phase === 'legs') E.set(cdLegProg(route, here, route[legs[leg]])); else E.set(cdParse(it.sol)); go(); };
    const wrong = () => { if (running) return; const p = cdParse(it.sol); p.pop(); E.set(p.length ? p : [{ t: 'cw' }]); go(); };
    async function go() {
      if (running) return; if (!E.prog.length) { sfx.soft(); ui.prompt('Add some blocks first. Then Go.', 'Tap or drag some blocks to build the program first. Then press Go.'); return; }
      running = true; W.cur = null; E.lock(true); E.unmark();
      const limit = it.max && phase !== 'free' && phase !== 'legs';
      if (limit && cdCount(E.prog) > it.max) { await miss('long'); return; }
      B.reset(); if (here) { B.put(here.at[0], here.at[1], here.f, true); if (phase === 'legs') B.flag(route[legs[leg]]); }
      if (phase === 'legs') { B.nums(numsOn ? route.slice(legs[leg - 1] != null ? legs[leg - 1] + 1 : 1, legs[leg] + 1) : null); }
      const from = here ? [here.at[0], here.at[1], here.f] : null;
      const r = await cdRun(ui, B, E, b, E.prog, { from }); ui.check();
      if (phase === 'legs') { const to = route[legs[leg]]; if (!r.bump && r.x === to[0] && r.y === to[1]) return partDone(r); return miss(r.bump ? 'bump' : 'stop', r); }
      if (cdWin(b0, r)) return win(r);
      return miss(r.bump ? 'bump' : r.got.size < r.gems.size ? 'gem' : b0.target ? 'shape' : 'stop', r);
    }
    let numsOn = false;
    async function miss(why, r) {
      misses++; helped = true; sfx.soft(); if (phase === 'short') shortMiss++;
      const tell = (t, s) => Promise.race([ui.prompt(t, s), wait(4200)]);
      /* never stuck: after many tries, or two more in the make-it-short part, it comes back at the end of the station */
      if (misses >= 8 || shortMiss >= 2) { await tell(shortMiss >= 2 ? 'It works! We will make it shorter later.' : 'Good trying! We will come back to this one.', shortMiss >= 2 ? 'Your program works. We will come back and make it shorter later.' : 'Good trying. We will come back to this one at the end.'); ui.check();
        W.cur = null; ui.help(false); cdTick(false, it); return res(false); }
      if (why === 'long') await tell('Too many blocks. Use ' + it.max + ' or fewer.', 'That program has too many blocks. Use ' + it.max + ' blocks or fewer. Look for blocks that repeat.');
      else if (why === 'bump') await tell('It bumped after the red block. Fix it, then Go.', 'The robot bumped into something after the red block. Fix the program, then press Go.');
      else if (why === 'gem') await tell('It missed a gem. Every gem, then the battery.', 'The robot missed a gem. It must collect every gem, then reach the battery.');
      else if (why === 'shape') await tell('The lines are not the dotted shape yet.', 'The lines it drew are not the same as the dotted shape. Follow the dots with your finger, then fix the program.');
      else { if (r) B.stop(r.x, r.y); await tell('It stopped on the red square. Fix it, then Go.', 'The robot stopped on the red square. That is not where it needs to be. Fix the program, then press Go.'); }
      ui.check();
      /* the second miss: break it down. A puzzle with a block limit: make it work first, any length; then make it short */
      if (misses === 2 && phase === 'full') {
        if (it.max) { phase = 'free'; E.max(0); ui.help(true); await tell('Make it work first, with any number of blocks.', 'Let us make it work first, with as many blocks as you like. Then we will make it short.'); }
        else if (it.k === 'fix') { const half = Math.ceil(cdParse(it.prog).length / 2), inFirst = it.bug < half;
          ui.help(true); await tell('The bug is in the ' + (inFirst ? 'first' : 'second') + ' half of the program.', 'Here is a clue. The bug is in the ' + (inFirst ? 'first' : 'second') + ' half of the program. Test it again and watch that part.'); }
        else { legs = cdCorners(route); if (legs.length > 1) { phase = 'legs'; leg = 0; here = { at: route[0].slice(), f: CD_FACE[b0.face] }; E.clear(); B.reset(); B.flag(route[legs[0]]); ui.help(true);
            await tell('First, just get to the flag.', 'Let us do it in parts. First, build a program that gets the robot to the flag. Then press Go.'); } }
      }
      /* the third: count it out. The squares of this part are numbered */
      else if (misses >= 3 && phase !== 'short') { numsOn = true;
        if (phase === 'legs') { B.nums(route.slice(legs[leg - 1] != null ? legs[leg - 1] + 1 : 1, legs[leg] + 1)); await tell('Count the numbered squares. Then build it.', 'Count the numbered squares to the flag. Each forward moves one square.'); }
        else if (it.k === 'fix') { const p = cdParse(it.prog), lo = Math.max(0, Math.min(it.bug, p.length) - 1); E.set(p); E.suspect([E.prog[lo], E.prog[lo + 1]]);
          await tell('Back to the start. The bug is one of the dashed blocks.', 'Here is the program as it started. The bug is in one of the two blocks with a dashed line. Test it, and watch them.'); }
        else { B.reset(); B.nums(route.slice(1)); await tell('Count the numbered squares. Each forward moves one.', 'Count the numbered squares on the way. Each forward moves the robot one square. Then build it.'); } }
      running = false; E.lock(false); if (here && phase === 'legs') B.put(here.at[0], here.at[1], here.f, true); else { B.reset(); if (numsOn && !b0.target && phase !== 'legs') B.nums(route.slice(1)); }
      if (phase === 'legs') B.flag(route[legs[leg]]);
      ui.prompt(phase === 'legs' ? 'Get to the flag. Then Go.' : phase === 'free' ? 'Make it work, any length. Then Go.' : base(), ' ');
      hook();
    }
    async function partDone(r) {
      sfx.good(); here = { at: [r.x, r.y], f: r.f }; leg++; E.clear(); B.flag(null); B.nums(null);
      if (leg < legs.length) { await Promise.race([ui.prompt('Yes! Now from here to the next flag.', 'Yes! Now build the next part, from here to the next flag.'), wait(2600)]); ui.check(); B.flag(route[legs[leg]]); }
      else { phase = 'whole'; here = null; numsOn = false; ui.help(false); await Promise.race([ui.prompt('Every part done! Now the whole trip in one go.', 'You did every part. Now build the whole trip in one program.'), wait(3200)]); ui.check(); B.reset(); }
      running = false; E.lock(false); hook();
    }
    async function win(r) {
      if (phase === 'free') { sfx.good(); phase = 'short'; E.max(it.max); ui.help(true);
        await Promise.race([ui.prompt('It works! Now make it ' + it.max + ' blocks. Find what repeats.', 'It works! Now make it shorter: ' + it.max + ' blocks or fewer. Look at your program. Which blocks happen again and again? Put them once, inside repeat.'), wait(5200)]); ui.check();
        running = false; E.lock(false); B.reset(); hook(); return; }
      W.cur = null; ui.help(false); const n = cdCount(E.prog), gold = n <= it.best;
      cdTick(!helped, it); sfx.great(); confetti(24); kiwiMood(ui.root, 'cheer');
      if (gold) { const st2 = cdState(); if (!st2.gold[it.id]) CDS.gold++; st2.gold[it.id] = 1; ui.stage.append(h('div', { class: 'cd-gear' }, ic('gear'), h('b', null, 'Fewest blocks!'))); }
      await Promise.race([ui.prompt(gold ? 'It works, in the fewest blocks! A gold gear.' : 'It works! ' + n + ' blocks.', gold ? 'It works, and in the fewest blocks. A gold gear for you!' : 'It works! Can you find a shorter way next time?'), wait(3000)]); ui.check();
      await ui.wait(W.fast ? 5 : 500); res(!helped);
    }
    hook();
  });
}
/* the blocks for one straight-and-turn part of a route (for the tests' "solve" of a part) */
function cdLegProg(route, here, to) {
  const out = []; let f = here.f, at = here.at.slice(); const i0 = route.findIndex(c => c[0] === at[0] && c[1] === at[1]), i1 = route.findIndex((c, i) => i > i0 && c[0] === to[0] && c[1] === to[1]);
  for (let i = i0 + 1; i <= i1; i++) { const d = [route[i][0] - at[0], route[i][1] - at[1]], want = CD_DIR.findIndex(x => x[0] === d[0] && x[1] === d[1]);
    const turn = (want - f + 4) % 4; if (turn === 1) out.push({ t: 'cw' }); else if (turn === 3) out.push({ t: 'acw' }); else if (turn === 2) out.push({ t: 'cw' }, { t: 'cw' }); f = want; out.push({ t: 'F' }); at = route[i].slice(); }
  return out;
}

/* ---- PREDICT: where will the robot stop? She taps a square. A miss crosses the square out and gives a clue; another runs the first half, and she goes on from there ---- */
function cdPredict(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, B = cdBoard(b, { pick: true }), E = cdEditor([], { locked: true }); E.set(cdParse(it.prog)); E.lock(true); const prog = E.prog;   /* the shown blocks themselves, so each lights as it runs */
    ui.stage.append(B.el); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip)));
    const full = cdSim(b, prog), cells = Object.values(B.cells), ans = cells.findIndex(c => +c.dataset.x === full.x && +c.dataset.y === full.y);
    let miss = 0, busy = false, from = null, shown = 0;
    const pick = async i => { const c = cells[i]; if (busy || c.disabled) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); c.classList.add('ok'); cdTick(miss === 0, it); B.reset(); await cdRun(ui, B, E, b, prog); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); c.classList.add('gone'); c.disabled = true;
      if (miss === 1) await Promise.race([ui.prompt('Follow each block with your finger.', 'Not there. Follow each block with your finger. Forward moves one square the way the robot faces. A turn turns it on the spot.'), wait(4200)]);
      else { /* run part of the way, so the rest is shorter */ const rest = full.trace.length - shown, k = Math.max(1, Math.floor(rest / 2)); B.reset(); shown = Math.min(full.trace.length - 1, shown + k);
        await cdRun(ui, B, E, b, prog, { upto: shown, slow: true }); E.hi(null); full.trace.slice(0, shown).forEach(s => E.mark(s.nd, 'done'));
        await Promise.race([ui.prompt('It has done the grey blocks. Where now?', 'The robot has done the grey blocks. Follow the rest from here. Where will it stop?'), wait(4200)]); }
      ui.check(); busy = false; hook(); };
    cells.forEach((c, i) => c.addEventListener('click', () => pick(i)));
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: cells.length, item: it.id, give: i => { if (cells[i].disabled) i = ans; pick(i); } }; };
    ui.prompt(it.text, it.text + ' Read the program first, block by block.'); hook();
  });
}

/* ---- BUG: which block is the bug? She can test the program as often as she likes, then taps the block ---- */
function cdBug(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, prog = cdParse(it.prog), B = cdBoard(b); let miss = 0, busy = false;
    const E = cdEditor([], { locked: true, onTap: n => pick(E.prog.indexOf(n)) }); E.set(prog); E.lock(true);
    const progNow = E.prog;
    const test = h('button', { class: 'btn quiet cd-test', 'data-k': 'test', onclick: async () => { if (busy) return; busy = true; sfx.tap(); B.reset(); await cdRun(ui, B, E, b, progNow, { slow: true }); busy = false; } }, ic('play-button'), 'Test it');
    ui.stage.append(B.el); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip), h('div', { class: 'cd-run' }, test)));
    const pick = async i => { const nd = progNow[i], el = E.el(nd); if (busy || !el || el.classList.contains('gone')) return; busy = true; W.cur = null;
      if (i === it.bug) { sfx.pop(); el.classList.add('ok'); cdTick(miss === 0, it); await Promise.race([ui.prompt('Found it! That block was the bug.', 'You found it. That block was the bug.'), wait(2600)]); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); el.classList.add('gone');
      await Promise.race([ui.prompt(miss === 1 ? 'Not that one. Test it, and watch closely.' : 'Watch where it first goes wrong.', miss === 1 ? 'That block is fine. Press Test it, and watch the robot closely.' : 'Press Test it again. Watch for the first block where the robot goes the wrong way.'), wait(3800)]);
      ui.check(); busy = false; hook(); };
    const hook = () => { W.cur = { type: 'choice', answer: it.bug, n: progNow.length, item: it.id, give: i => { const el = E.el(progNow[i]); if (!el || el.classList.contains('gone')) i = it.bug; pick(i); } }; };
    ui.prompt(it.text, 'Which block is the bug? Press Test it to watch the robot. Then tap the block that is wrong.'); hook();
  });
}

/* ---- SHAPE: which shape will it draw? Three small drawings; a miss runs part of the program on a board ---- */
function cdShapeSvg(prog) {
  const b = { cols: 9, rows: 9, start: [4, 4], face: 'u', pen: true }, r = cdSim(b, prog), pts = [...r.edges].map(e => e.split('|').map(p => p.split(',').map(Number)));
  const xs = pts.flat().map(p => p[0]), ys = pts.flat().map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(1, Math.max(...xs) - x0), hh = Math.max(1, Math.max(...ys) - y0), s = 80 / Math.max(w, hh, 2);
  return '<svg viewBox="-10 -10 100 100" xmlns="http://www.w3.org/2000/svg">' + pts.map(([a, z]) => '<line x1="' + ((a[0] - x0) * s) + '" y1="' + ((a[1] - y0) * s) + '" x2="' + ((z[0] - x0) * s) + '" y2="' + ((z[1] - y0) * s) + '"/>').join('') + '</svg>';
}
function cdShape(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const prog0 = cdParse(it.prog), b = { cols: 5, rows: 5, start: [1, 3], face: 'u', pen: true };
    const fits = (() => { const r = cdSim(b, prog0); return !r.bump; })(), bb = fits ? b : { cols: 7, rows: 7, start: [3, 3], face: 'u', pen: true };
    const B = cdBoard(bb), E = cdEditor([], { locked: true }); E.set(prog0); E.lock(true); const prog = E.prog;
    const list = shuffle([it.prog].concat(it.opts)), ans = list.indexOf(it.prog); let miss = 0, busy = false, shown = 0;
    const row = h('div', { class: 'cd-shapes' }), btns = list.map((p, i) => { const btn = h('button', { class: 'cd-shp', 'data-i': i, html: cdShapeSvg(cdParse(p)), onclick: () => choose(i) }); row.append(btn); return btn; });
    ui.stage.append(h('div', { class: 'cd-shapeq' }, h('div', { class: 'cd-ph' }, E.strip), B.el)); ui.answer.append(row);
    const full = cdSim(bb, prog);
    const choose = async i => { if (busy || btns[i].disabled) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); btns[i].classList.add('ok'); cdTick(miss === 0, it); B.reset(); await cdRun(ui, B, E, bb, prog); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); btns[i].classList.add('gone'); btns[i].disabled = true;
      if (miss === 1) await Promise.race([ui.prompt('Follow the blocks. Each forward draws one line.', 'Not that one. Follow the blocks with your finger. Each forward draws one line. Each turn turns the corner.'), wait(4000)]);
      else { B.reset(); shown = Math.min(full.trace.length - 1, shown + Math.max(1, Math.floor((full.trace.length - shown) / 2))); await cdRun(ui, B, E, bb, prog, { upto: shown, slow: true });
        await Promise.race([ui.prompt('Here is part of it. Which shape now?', 'The robot has drawn part of it. Which shape will it be when it finishes?'), wait(3800)]); }
      ui.check(); busy = false; hook(); };
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: list.length, item: it.id, give: i => { if (btns[i].disabled) i = ans; choose(i); } }; };
    ui.prompt(it.text, it.text + ' Read the program, block by block.'); hook();
  });
}
const cdAsk = (ui, it, st) => it.k === 'build' || it.k === 'fix' ? cdBuild(ui, it, st) : it.k === 'predict' ? cdPredict(ui, it) : it.k === 'bug' ? cdBug(ui, it) : cdShape(ui, it);

/* ---- MEET: the station's idea, shown by the robot. Watch it as often as she likes ---- */
async function cdMeet(ui, n) {
  const st = CD_ST[n - 1];
  for (const m of st.meet) {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const B = cdBoard(m.b), E = cdEditor([], { locked: true }); E.set(cdParse(m.prog)); E.lock(true);
    const ed = h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip));
    ui.stage.append(h('div', { class: 'cd-meet' }, h('div', { class: 'cd-idea' }, art(st.icon), h('b', null, st.idea)), B.el)); ui.answer.append(ed);
    await Promise.race([ui.prompt(st.idea, st.ideaSay), wait(9000)]); ui.check();
    const play = async () => { B.reset(); E.set(cdParse(m.prog)); E.lock(true); await cdRun(ui, B, E, m.b, E.prog, { slow: true }); ui.check();
      if (m.fixed) { await Promise.race([ui.prompt(m.after, m.after), wait(4000)]); ui.check(); B.reset(); E.set(cdParse(m.fixed)); E.lock(true); await cdRun(ui, B, E, m.b, E.prog, { slow: true }); ui.check(); } };
    await play();
    await new Promise(res => { const again = h('button', { class: 'btn quiet', 'data-k': 'again', onclick: async () => { sfx.tap(); again.disabled = true; await play(); again.disabled = false; } }, ic('repeat-button'), 'Watch again');
      const ok = h('button', { class: 'btn go', 'data-k': 'go', onclick: () => { sfx.pop(); res(); } }, 'Got it!'); ed.append(h('div', { class: 'row wrow cd-wrow' }, again, ok));
      ui.prompt('Watch again, or start.', 'Watch again, or start.'); W.cur = { type: 'btn', auto: () => ok.click() }; }); ui.check();
  }
}

/* practise until right: anything that needed help comes back, without help, until it is right first time (at most two more rounds) */
async function cdMaster(ui, missed, st) {
  let left = missed.slice(); if (!left.length) return;
  for (let round = 0; left.length && round < 2 && ui.alive; round++) {
    await Promise.race([ui.prompt(round ? 'Once more. You nearly have it!' : 'Practise the tricky ones until easy!', round ? 'Once more. You nearly have it.' : "Let's practise the tricky ones until they are easy."), wait(3000)]); ui.check();
    CDS.mode = 'retry'; const still = []; for (const it of left) { if (!await cdAsk(ui, it, st)) still.push(it); ui.check(); } CDS.mode = ''; left = still;
  }
  CDS.left = left.length;
}

/* ---- a station: meet the idea, the puzzles (a look back half way), the tricky ones again, the summary, and the first time through, the prizes ---- */
async function cdStation(ui, n) {
  const st = CD_ST[n - 1], S0 = cdState(), first = S0.st < n, items = st.items.slice(), missed = [];
  cdScore(ui, items.length);
  await cdMeet(ui, n); ui.check();
  const half = Math.ceil(items.length / 2);
  for (let i = 0; i < items.length; i++) {
    if (i === half && n > 1) { await cdLookBack(ui, n); ui.check(); }
    if (!await cdAsk(ui, items[i], st)) missed.push(items[i]); ui.check();
    addStars(1);
  }
  await cdMaster(ui, missed, st); ui.check();
  S0.day = jpToday(); saveState();
  ui.wide(true); ui.clear(); sfx.great(); kiwiMood(ui.root, 'cheer'); ui.steps(CDS.total, CDS.total);
  ui.stage.append(h('div', { class: 'jp-prize jp-summary' }, art(st.icon, 'hero sticker'), h('div', { class: 'bigtext' }, st.name + ': done!'),
    h('div', { class: 'jp-sumrow' }, h('span', null, ic('check-mark-button'), CDS.first + ' of ' + CDS.asked + ' right first time'), CDS.fixed ? h('span', { class: 'jp-fixed' }, ic('flexed-biceps'), CDS.fixed + ' tricky ' + (CDS.fixed === 1 ? 'one' : 'ones') + ' now right') : null,
      CDS.left ? h('span', null, ic('repeat-button'), CDS.left + ' to practise next time') : null, CDS.gold ? h('span', null, ic('gear'), CDS.gold + ' gold ' + (CDS.gold === 1 ? 'gear' : 'gears')) : null,
      CDS.best >= 3 ? h('span', null, ic('sparkles'), 'Best: ' + CDS.best + ' in a row') : null, h('span', null, ic('star'), '+' + items.length + ' stars'))));
  await jpHold(ui.prompt('Station done! ' + st.name + '.', 'Station ' + n + ' is done: ' + st.name + '.'), 1500, 4000); ui.check();
  await ui.next('Next', ui.stage.firstChild); ui.check();
  if (first) await cdPassed(ui, n);
}
/* half way through a station from the second on: one question from an earlier station */
async function cdLookBack(ui, n) {
  const pool = CD_ST.slice(0, n - 1).flatMap(s => s.items.filter(it => it.k === 'predict' || it.k === 'shape').map(it => [it, s])), weak = cdState().weak;
  if (!pool.length) return; const [it, s] = shuffle(pool.slice()).sort((a, b) => (weak[b[0].id] || 0) - (weak[a[0].id] || 0))[0];
  ui.wide(true); ui.clear(); W.cur = null; sfx.great();
  ui.stage.append(h('div', { class: 'jp-lookback' }, h('div', { class: 'jp-lbl' }, ic('gear'), ic('gear'), ic('gear')), h('b', null, 'Look back!'), h('span', null, 'Do you remember this?')));
  await jpHold(Promise.race([ui.prompt('Look back! Do you remember this?', 'Time to look back! Do you remember this one?'), wait(3000)]), 1800, 3500); ui.check();
  CDS.mode = 'review'; const ok = await cdAsk(ui, it, s); CDS.mode = ''; ui.check();
  if (!ok) { CDS.mode = 'retry'; await cdAsk(ui, it, s); CDS.mode = ''; ui.check(); }
}
/* the first time through a station: its badge, a gift for her room, 5 stars */
async function cdPassed(ui, n) {
  const S0 = cdState(), st = CD_ST[n - 1], g = CD_GIFTS[n - 1]; S0.st = Math.max(S0.st, n); saveState();
  ui.wide(true); ui.clear(); confetti(40); sfx.great();
  ui.stage.append(h('div', { class: 'jp-prize' }, h('div', { class: 'cd-badge big' }, art(st.icon), h('b', null, n)), h('div', { class: 'bigtext' }, 'Badge: ' + st.name + '!')));
  await jpHold(ui.prompt('A new badge for your Code Lab!', 'A new badge for your Code Lab: ' + st.name + '.'), 2600, 5000); ui.check();
  if (g) { if (!S.owned) S.owned = {}; S.owned[g.id] = true; ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-prize' }, art(g.art, 'hero sticker jp-gift-big'), h('div', { class: 'bigtext' }, g.name))); sfx.great();
    ui.prompt('A gift for your room: ' + g.name.toLowerCase() + '!', 'And a present for your room: ' + g.name.toLowerCase() + '. Find it in your toy box at home.'); await ui.next('Hooray!', ui.stage.firstChild); ui.check(); }
  addStars(5); saveState();
  if (n === CD_BUILT) { await Promise.race([ui.prompt('Every station so far! More are coming.', 'You have done every Code Lab station so far. More stations are coming soon.'), wait(4000)]); ui.check(); }
}

/* ---- the Code Lab home: a circuit board of twelve chips, one per station ---- */
function cdChips(pick) {
  const S0 = cdState(), box = h('div', { class: 'cd-board' });
  CD_ST.forEach((s, i) => { const n = i + 1, done = S0.st >= n, now = !s.soon && S0.st + 1 === n, lock = s.soon || (!done && !now);
    const b = h('button', { class: 'cd-chip' + (done ? ' done' : '') + (now ? ' now' : '') + (lock ? ' lock' : '') + (s.soon ? ' soon' : ''), 'data-k': now ? 'next' : 'stn-' + n, 'aria-label': 'Station ' + n + ': ' + s.name },
      h('i', { class: 'cd-pin' }), h('span', { class: 'cd-cn' }, n), art(s.soon ? s.icon : lock ? 'locked' : s.icon), h('small', null, s.name), s.soon ? h('em', null, 'Coming soon') : done ? ic('check-mark-button', 'cd-tick') : null);
    b.addEventListener('click', () => { if (lock) { sfx.soft(); b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble'); Speech.say(s.soon ? s.name + ' is coming soon.' : 'Finish station ' + (n - 1) + ' first.'); return; } sfx.pop(); pick(n); });
    box.append(b); });
  return box;
}
async function cdHome(ui) {
  for (;;) {
    const S0 = cdState(), n = Math.min(CD_BUILT, S0.st + 1), all = S0.st >= CD_BUILT, gears = Object.keys(S0.gold).length;
    const run = await labMenu(ui, res => h('div', { class: 'cd-home' }, cdChips(k => res(() => cdStation(ui, k))),
        h('div', { class: 'cd-bar' }, h('b', null, 'Code Lab'), h('span', null, ic('gear'), gears + ' gold ' + (gears === 1 ? 'gear' : 'gears')), S0.st ? h('span', { class: 'cd-badges' }, CD_ST.slice(0, S0.st).map((s, i) => h('span', { class: 'cd-badge' }, art(s.icon), h('b', null, i + 1)))) : null)), [],
      all ? 'Every station so far! Play any again.' : 'Tap station ' + n + ': ' + CD_ST[n - 1].name.toLowerCase() + '.',
      all ? 'You have done every Code Lab station so far. More are coming soon. Tap any station to play it again.' : (S0.st ? 'Tap the pink chip, station ' + n + ', to go on. You can play a station you have done again.' : 'Welcome to the Code Lab! Here you learn to program a robot. Tap the first chip to start.'));
    ui.check(); await run(); ui.check();
  }
}
SCREENS.code = () => {
  const ui = makeUI(() => go('map'), ''); show(ui.root); ui.root.classList.add('c-cd');
  (async () => { try { await cdHome(ui); } catch (e) { if (e !== ABORT) { console.error(e); throw e; } } })();
};
W.code = { cdEditor, cdBuild, cdPredict, cdBug, cdShape, cdMeet, cdStation, CD_ST, CD_GIFTS, CD_BUILT, cdParse, cdCount, cdText, cdSim, cdWin, cdRoute, cdCorners, cdLegProg, cdState, cdShapeSvg };
