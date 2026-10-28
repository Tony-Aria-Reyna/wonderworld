// Generates thousands of questions from every skill at every level and checks each one is well-formed and solvable by its own steps.
import fs from 'fs'; import vm from 'vm';
const files = fs.readdirSync('src/js').filter(f => f.endsWith('.js') && !f.startsWith('08')).sort();
const js = files.map(f => fs.readFileSync('src/js/' + f, 'utf8')).join('\n');
const ctx = { window: { addEventListener() {} }, document: { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] }, localStorage: { getItem: () => null, setItem() {} }, console, setTimeout, ICONS: new Proxy({}, { get: () => '<g/>' }), FLAGS: JSON.parse(fs.readFileSync('node_modules/@iconify-json/circle-flags/icons.json', 'utf8')).icons, MAP: { c: {}, pt: {} }, btoa: s => s, requestAnimationFrame() {}, KANA_STROKES: JSON.parse(fs.readFileSync('gen/kana.json', 'utf8')) };
vm.createContext(ctx);
vm.runInContext(js + '\nthis.SKILLS=SKILLS; this.COUNTRIES=COUNTRIES; this.weaveGrid=weaveGrid; this.CHEERS=CHEERS; this.raceCard=raceCard; this.raceOpts=raceOpts; this.raceFromKey=raceFromKey; this.raceDots=raceDots; this.RACE_SETS=RACE_SETS; this.RACE_PACE=RACE_PACE; this.ELEMENTS=ELEMENTS; this.ATLAS=ATLAS; this.elGroupGame=elGroupGame; this.elClue=elClue; this.EL_GIFTS=EL_GIFTS; this.V=V; this.EL_FAMILY=EL_FAMILY; this.JPW=W.jp; this.TOWNW=W.town; this.CODEW=W.code; this.JP_N=JP_N; this.JP_PACE=JP_PACE;', ctx);
const words = t => t.trim().split(/\s+/).length;
let n = 0, bad = [], maxWords = 0, maxAns = 0, pics = 0, shapeQ = 0;
const check = (id, lv, it, where) => {
  const tag = `${id} L${lv} ${where}: "${it.text}"`;
  if (!it.text || /undefined|NaN/.test(it.text + (it.say || ''))) bad.push('TEXT ' + tag);
  maxWords = Math.max(maxWords, words(it.text)); if (words(it.text) > 12) bad.push('LONG(' + words(it.text) + ') ' + tag);
  if (it.type === 'num') { if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer > 9999) bad.push('ANSWER ' + it.answer + ' ' + tag); maxAns = Math.max(maxAns, it.answer); }
  else if (it.type === 'choice') { if (!(it.answer >= 0 && it.answer < it.options.length)) bad.push('CHOICE ' + tag);
    if (it._pic !== undefined && JSON.stringify(it._pic) === JSON.stringify(it.options[it.answer].icon)) bad.push('PICTURE-SHOWS-ANSWER ' + tag); if ('_idea' in it || where !== 'main') pics++; const labels = it.options.map(o => o.label || o.icon || o.svg); if (new Set(labels.map(x => JSON.stringify(x))).size !== labels.length) bad.push('DUP-OPTIONS ' + tag); it.options.forEach(o => { if (o.label && words(o.label) > 4) bad.push('OPT-LONG ' + o.label); }); }
  else bad.push('TYPE ' + tag);
  if (typeof it.visual !== 'function') bad.push('NOVISUAL ' + tag);
};
// every skill is generated plain, and again the way each country asks it (its own question bank, things to count and names)
const CIDS = Object.keys(ctx.COUNTRIES), looks = [{}].concat(CIDS.map(c => ({ tag: c, thing: ctx.COUNTRIES[c].thing, things: ctx.COUNTRIES[c].things, boat: ctx.COUNTRIES[c].boat })));
// The teaching rule: help never tells. Every number step must carry a hands-on tool, and working that tool must land on the step's answer.
let tools = 0;
const toolOK = (t, ans) => {
  if (t.k === 'tap') { if (!t.steps.length || t.steps.length + (t.pre || 0) > 20) return 'needs 1 to 20 things to tap, has ' + t.steps.length; const end = (t.start || 0) + t.steps.reduce((a, b) => a + b, 0); if (t.tally ? t.steps.length !== ans : end !== ans) return 'does not land on the answer (' + (t.tally ? t.steps.length : end) + ' not ' + ans + ')'; if (!t.text || !t.ask) return 'needs words'; return null; }
  if (t.k === 'deal') return (t.n % t.groups === 0 && t.n / t.groups === ans && t.n <= 30) ? null : 'sharing ' + t.n + ' into ' + t.groups + ' does not give ' + ans;
  if (t.k === 'spots') return t.n === ans ? null : 'has ' + t.n + ' spots, answer ' + ans;
  if (t.k === 'turn') { const n = (((t.ccw ? t.from - t.to : t.to - t.from) + 8) % 8 || 8) / (t.unit || 2); return (ans == null || n === ans) && t.text && t.ask ? null : 'turn tool gives ' + n + ' taps, answer ' + ans; }
  if (t.k === 'pic') { if (!(t.n >= 1 && t.n <= 25)) return 'needs 1 to 25 taps, has ' + t.n; const end = t.steps ? t.start + t.steps.reduce((x, y) => x + y, 0) : t.on ? t.start + t.by * t.n : t.n; if (t.steps && t.steps.length !== t.n) return 'steps and taps do not match'; if (end !== t.land && Math.abs(end) !== t.land) return 'walk ends at ' + end + ', says it lands on ' + t.land; if (t.land !== ans) return 'does not land on the answer (' + t.land + ' not ' + ans + ')'; if (!t.text || !t.ask) return 'needs words';
    for (const done of [0, 1, t.n]) { const el = { innerHTML: '', append() {}, querySelectorAll: () => [] }; try { t.draw(el, { done, n: t.n, live: done < t.n, labels: Array.from({ length: done }, (_, i) => i === t.n - 1 ? '?' : String(i + 1)) }); } catch (e) { return 'its picture fails to draw: ' + e.message; } if (done < t.n && !/class="hot/.test(el.innerHTML)) return 'its picture has nothing to tap'; if (done === t.n && /class="hot/.test(el.innerHTML)) return 'still tappable when finished'; } return null; }
  return 'unknown tool ' + t.k;
};
const teach = (id, lv, s, i) => {
  const tag = `${id} L${lv} step${i} "${s.text}"`;
  if (s.show || s.glow != null) bad.push('TELLS-ANSWER ' + tag);
  if (/\bIt is \d/.test(s.text + ' ' + (typeof s.say === 'string' ? s.say : ''))) bad.push('TELLS-ANSWER ' + tag);
  const list = (s.hands || []).concat(s.pre ? [s.pre] : []);
  if (s.type === 'num' && !(s.hands || []).length) bad.push('NO-HANDS-ON-TOOL ' + tag);
  list.forEach(t => { tools++; const why = toolOK(t, s.type === 'num' ? s.answer : null); if (why) bad.push('TOOL ' + tag + ': ' + why); for (const k of ['text', 'ask']) if (t[k] && words(t[k]) > 12) bad.push('TOOL-LONG ' + t[k]); });
};
for (const id of Object.keys(ctx.SKILLS)) {
  const sk = ctx.SKILLS[id]; if (id === 'coding') continue;
  for (const look of looks) for (let lv = 1; lv <= sk.max; lv++) for (let k = 0; k < (look.tag ? 150 : 400); k++) {
    const it = sk.gen(lv, Object.assign({}, look)); n++;
    check(id, lv, it, 'main');
    if (id === 'shapes') { shapeQ++; if (!/(triangle|square|rectangle|circle|pentagon|hexagon|octagon|L shape)/.test(it.text)) bad.push('SHAPE-NOT-NAMED L' + lv + ': ' + it.text); }
    if (!it.steps || !it.steps.length) bad.push('NOSTEPS ' + id + ' L' + lv);
    (it.steps || []).forEach((s, i) => { check(id, lv, s, 'step' + (i + 1)); teach(id, lv, s, i + 1); });
    if (it.show || it.glow != null) bad.push('TELLS-ANSWER main ' + id);
    if (!it.explain || !it.explain.text) bad.push('NOEXPLAIN ' + id); else if (words(it.explain.text) > 12) bad.push('EXPLAIN-LONG(' + words(it.explain.text) + ') ' + it.explain.text);
    // for number questions the last step must land on the answer, so the breakdown really solves the question
    if (it.type === 'num') { const last = it.steps[it.steps.length - 1]; if (last.type === 'num' && last.answer !== it.answer) bad.push(`STEPS-DONT-REACH ${id} L${lv}: "${it.text}" ans ${it.answer} but last step "${last.text}" = ${last.answer}`); }
    const rt = sk.gen(lv, Object.assign({}, look, { retestOf: it })); check(id, lv, rt, 'retest');
  }
}
// content text limits, coding puzzles, tukutuku panels, rounds and unlocks: every country
const texts = []; const D = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }; let puzzles = 0, panels = 0, mirrors = 0, folds = 0, beats = 0, races = 0, cards = 0; const seenPanels = new Set(), seenPics = new Set(), seenParts = new Set();
for (const cid of CIDS) { const E = ctx.COUNTRIES[cid], mids = E.missions.map(m => m.id);
  [E.hello].forEach(t => texts.push(t));
  E.missions.forEach(m => { texts.push(m.intro.text); m.rounds.forEach(r => {
    if (r.skill && r.skill !== '@review' && !ctx.SKILLS[r.skill]) bad.push(cid + ' unknown skill ' + r.skill);
    if (r.skill === '@review' && !ctx.SKILLS[r.or]) bad.push(cid + ' review round needs a fallback skill (or:)');
    ['text', 'q', 'right', 'wrong'].forEach(k => r[k] && texts.push(r[k])); (r.items || []).forEach(i => { ['fact', 'hint'].forEach(k => i[k] && texts.push(i[k].text)); i.why && texts.push(i.why); });
    ['hint', 'done'].forEach(k => r[k] && texts.push(r[k].text)); r.tryit && texts.push(r.tryit.text); (r.hints || []).forEach(t => texts.push(t));
    (r.pairs || []).forEach(p => texts.push(p.text || p.say || '')); (r.steps || []).forEach(st => st.say && texts.push(st.say));
    (r.options || []).forEach(o => { if (o.label && words(o.label) > 4) bad.push('OPT-LONG ' + o.label); }); }); });
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'code').forEach(p => { puzzles++;
    const rock = new Set(p.rocks.map(r => r.join())); let pos = p.start.slice(), ok = true;
    p.solution.forEach(st => { for (let k = 0; k < (st[1] || 1); k++) { pos = [pos[0] + D[st[0]][0], pos[1] + D[st[0]][1]]; if (pos[0] < 0 || pos[1] < 0 || pos[0] >= p.cols || pos[1] >= p.rows || rock.has(pos.join())) ok = false; } });
    if (!ok || pos.join() !== p.goal.join()) bad.push('PUZZLE solution fails: ' + p.text);
    if (p.solution.length > p.slots) bad.push('PUZZLE solution longer than boxes: ' + p.text);
    if (p.path[0].join() !== p.start.join() || p.path[p.path.length - 1].join() !== p.goal.join()) bad.push('PUZZLE path ends: ' + p.text);
    p.path.forEach((c, i) => { if (rock.has(c.join())) bad.push('PUZZLE path through rock: ' + p.text); if (i && Math.abs(c[0] - p.path[i - 1][0]) + Math.abs(c[1] - p.path[i - 1][1]) !== 1) bad.push('PUZZLE path jump: ' + p.text); });
    p.legs.forEach(l => { if (!p.path.some(c => c.join() === l.join())) bad.push('PUZZLE flag off path: ' + p.text); });
    if (p.legs[p.legs.length - 1].join() !== p.goal.join()) bad.push('PUZZLE last flag is not the goal: ' + p.text);
    // the path walked as arrows must match the stored solution, so the hints teach the same route
    const segs = []; p.path.forEach((c, i) => { if (!i) return; const dx = c[0] - p.path[i - 1][0], dy = c[1] - p.path[i - 1][1], d = dx > 0 ? 'r' : dx < 0 ? 'l' : dy > 0 ? 'd' : 'u'; if (p.repeat && segs.length && segs[segs.length - 1][0] === d) segs[segs.length - 1][1]++; else segs.push([d, 1]); });
    if (JSON.stringify(segs) !== JSON.stringify(p.solution.map(x => [x[0], x[1] || 1]))) bad.push('PUZZLE path and solution differ: ' + p.text);
    if (p.repeat && segs.some(x => x[1] > 5)) bad.push('PUZZLE needs a repeat above 5: ' + p.text);
  }));
  // tukutuku panels: each must really be symmetrical, in both its wide and its tall size, small enough to tap on a phone, and worth weaving
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'weave').forEach(r => r.panels.forEach(p => { if (seenPanels.has(p)) return; seenPanels.add(p); panels++;
    if (!p.name || !p.means || !p.done || !p.done.text) bad.push('WEAVE panel needs a name, a meaning and a done line: ' + p.id); else texts.push(p.done.text);
    [[true, p.wide, 12, 8], [false, p.tall, 8, 12]].concat(p.low ? [['low', p.low, 12, 6]] : []).forEach(([wide, sz, maxW, maxH]) => { const tag = 'WEAVE ' + p.id + (wide === 'low' ? ' low' : wide ? ' wide' : ' tall') + ': ';
      if (sz[0] % 2 || sz[0] > maxW || sz[1] > maxH) bad.push(tag + 'size ' + sz.join('x') + ' must be even across and at most ' + maxW + 'x' + maxH);
      if (wide === true && sz[1] > 6 && !p.low) bad.push(tag + 'more than 6 rows needs a low size for a phone on its side');
      if (p.sym === 2 && sz[1] % 2) bad.push(tag + 'two mirror lines need an even number of rows');
      const G = ctx.weaveGrid(p, wide); let hers = 0, given = 0; const used = new Set();
      for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) { const t = G.g[y][x]; if (![0, 1, 2].includes(t)) bad.push(tag + 'odd thread ' + t); if (t) { used.add(t); if (G.given(x, y)) given++; else hers++; }
        if (G.g[y][G.W - 1 - x] !== t) bad.push(tag + 'not a mirror image left to right at ' + x + ',' + y);
        if (p.sym === 2 && G.g[G.H - 1 - y][x] !== t) bad.push(tag + 'not a mirror image top to bottom at ' + x + ',' + y); }
      if (hers < 6 || hers > 45) bad.push(tag + hers + ' stitches to weave (wants 6 to 45)');
      if (!given) bad.push(tag + 'nothing woven to copy'); if (used.size !== p.threads) bad.push(tag + 'uses ' + used.size + ' thread colours, says ' + p.threads);
    }); })));
  // origami: every fold must really move its corner, land it on the paper's square, and offer other corners to choose from
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'fold').forEach(p => { folds += p.folds.length; if (!p.done || !p.start) bad.push('FOLD needs a start and a done line');
    p.folds.forEach((f, i) => { [f.text, f.done && f.done.text, f.ask && f.ask.text, f.ask && f.ask.nudge].forEach(t => t && texts.push(t));
      const [A, B] = f.line, dx = B[0] - A[0], dy = B[1] - A[1], side = q => Math.sign((q[0] - A[0]) * dy - (q[1] - A[1]) * dx), s0 = side(f.corner);
      if (!s0) bad.push('FOLD ' + (i + 1) + ': the corner is on the fold line'); if (!f.decoys || !f.decoys.length) bad.push('FOLD ' + (i + 1) + ' has no other corners to choose from');
      if (!f.flap.includes(f.corner)) bad.push('FOLD ' + (i + 1) + ': the corner is not part of the flap'); f.flap.forEach(q => { if (side(q) && side(q) !== s0) bad.push('FOLD ' + (i + 1) + ': the flap crosses the fold line'); });
      if (!f.after || !f.under || !f.fill || !f.back) bad.push('FOLD ' + (i + 1) + ' is missing a picture or a colour');
      if (f.ask && !(f.ask.answer >= 0 && f.ask.answer < f.ask.options.length)) bad.push('FOLD ' + (i + 1) + ' question has no right answer'); }); }));
  // pixel pictures: a true mirror image, every letter in the palette, frames the same size, small enough to tap, and a done line
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'pixel').forEach(r => r.pics.forEach(p => { if (seenPics.has(p)) return; seenPics.add(p); mirrors++;
    if (!p.done || !p.done.text) bad.push('PIXEL ' + p.id + ' has no done line'); else texts.push(p.done.text);
    [['big', 16, 14, 100], ['small', 8, 10, 40]].forEach(([size, maxW, maxH, maxTaps]) => { const Z = p[size], tag = 'PIXEL ' + p.id + ' ' + size + ': '; if (!Z) { bad.push(tag + 'missing'); return; }
      const Wd = Z.rows[0].length, Hd = Z.rows.length; let hers = 0; const used = new Set();
      if (Wd % 2 || Wd > maxW || Hd > maxH) bad.push(tag + 'size ' + Wd + 'x' + Hd + ' must be even across and at most ' + maxW + 'x' + maxH);
      Z.rows.forEach((row, y) => { if (row.length !== Wd) bad.push(tag + 'row ' + y + ' is the wrong length'); row.split('').forEach((ch, x) => { if (ch !== '.' && !p.pal[ch]) bad.push(tag + 'letter ' + ch + ' has no colour'); if (row[Wd - 1 - x] !== ch) bad.push(tag + 'not a mirror image at ' + x + ',' + y); if (ch !== '.' && x >= Wd / 2) { hers++; used.add(ch); } }); });
      if (hers < 8 || hers > maxTaps) bad.push(tag + hers + ' squares to colour (wants 8 to ' + maxTaps + ')'); if (used.size > 6) bad.push(tag + used.size + ' colours is too many for the palette');
      used.forEach(ch => { if (!p.names || !p.names[ch]) bad.push(tag + 'colour ' + ch + ' has no name'); });
      if (!Z.frames || Z.frames.length < 2) bad.push(tag + 'needs at least two frames to move');
      (Z.frames || []).forEach((fr, k) => { if (fr.length !== Hd || fr.some(row => row.length !== Wd)) bad.push(tag + 'frame ' + k + ' is a different size'); fr.forEach(row => row.split('').forEach(ch => { if (ch !== '.' && !p.pal[ch]) bad.push(tag + 'frame ' + k + ' letter ' + ch + ' has no colour'); })); });
      if (JSON.stringify(Z.frames || []) === JSON.stringify((Z.frames || []).map(() => Z.frames[0]))) bad.push(tag + 'every frame is the same, so nothing moves');
    }); })));
  // a band to build: each part is eight boxes with at least one hit, a known sound, and words to open and close it; the country must reset it
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'beat').forEach(r => { if (!(E.ladders || []).includes('beat')) bad.push(cid + ' has a band but does not list beat in its ladders');
    r.parts.forEach(p => { if (seenParts.has(p)) return; seenParts.add(p); beats++;
      if (!/^[x.]{8}$/.test(p.hits) || !/x/.test(p.hits)) bad.push('BEAT ' + p.id + ' needs eight boxes of x and . with at least one hit');
      if (!['low', 'shake', 'bell', 'tick'].includes(p.sound)) bad.push('BEAT ' + p.id + ' has an unknown sound ' + p.sound);
      if (!p.name || !p.art || !p.col) bad.push('BEAT ' + p.id + ' needs a name, a picture and a colour');
      [p.intro, p.done].forEach(t => { if (!t || !t.text || !t.say) bad.push('BEAT ' + p.id + ' needs an opening and a closing line, each with words to say'); else texts.push(t.text); }); }); }));
  // a flashcard race: runners, an opening line, a line for winning and one for losing, and the country must reset it
  E.missions.forEach(m => m.rounds.filter(r => r.act === 'race').forEach(r => { races++; if (!CIDS.some(o => (ctx.COUNTRIES[o].ladders || []).includes('race'))) bad.push(cid + ' has a race, but no country lists race in its ladders');     // the race ladder belongs to the country that first has it (France); later countries carry it on
    if (!r.me || !r.rival) bad.push(cid + ' race needs a picture for each runner'); if (!(r.track >= 6 && r.track <= 12)) bad.push(cid + ' race track should be 6 to 12 steps');
    [r.intro, r.win, r.lose].forEach(t => { if (!t || !t.text || !t.say) bad.push(cid + ' race needs an opening line, a winning line and a losing line, each with words to say'); else texts.push(t.text); }); }));
  // a cheer in a country's language belongs to that country only ("Ka pai!" turned up in Japan once)
  (E.cheers || []).forEach(ch => { if (ctx.CHEERS.includes(ch)) bad.push(cid + ' cheer is also in the cheers every country uses: ' + ch); if (words(ch) > 3) bad.push(cid + ' cheer too long: ' + ch); CIDS.forEach(o => { if (o !== cid && (ctx.COUNTRIES[o].cheers || []).includes(ch)) bad.push(ch + ' is a cheer in both ' + cid + ' and ' + o); }); });
  if (ctx.CHEERS.some(ch => /ka pai|sugoi|mumtaz/i.test(ch))) bad.push('a cheer in another language is in the list every country uses');
  // unlocks must point at real things
  E.gates.forEach(g => { g.after.forEach(a => { if (!mids.includes(a)) bad.push(cid + ' gate after unknown mission ' + a); }); (g.give || g.choose).forEach(v => { if (!E.videos[v]) bad.push(cid + ' gate gives unknown video ' + v); }); });
  E.path.forEach(nn => { if (nn.m && !mids.includes(nn.m)) bad.push(cid + ' path has unknown mission ' + nn.m); if (nn.video && !E.gates.some(g => g.id === nn.video)) bad.push(cid + ' path has unknown gate ' + nn.video); });
  mids.forEach(id => { if (!E.path.some(nn => nn.m === id)) bad.push(cid + ' mission ' + id + ' is not on the path'); });
  (E.souvenirs || []).forEach(sv => { if (!mids.includes(sv.need)) bad.push(cid + ' souvenir needs unknown mission ' + sv.need); if (!sv.id.startsWith(cid.slice(0, 2))) bad.push(cid + ' souvenir id should start with the country: ' + sv.id); });
  Object.values(E.videos).forEach(v => { if (!/^[A-Za-z0-9_-]{11}$/.test(v.yt)) bad.push(cid + ' odd video id ' + v.yt); });
}

texts.forEach(t => { if (words(t) > 12) bad.push('CONTENT-LONG(' + words(t) + ') ' + t); });
// the science rule: a clue or a reason names the real mechanism in real words. "Something that pushes" teaches nothing.
for (const id of Object.keys(ctx.SKILLS)) (ctx.SKILLS[id].bank || []).forEach(idea => { [idea.why, idea.hint].concat(idea.ask.map(q => q.h)).forEach(t => { if (t && /\bsomething (that|which|in there)\b|\bturns into something\b|\bis pushing something\b/i.test(t)) bad.push('VAGUE-SCIENCE ' + id + ': ' + t); }); });
// bank ideas: every idea needs two ways of asking, a hint and a reason
for (const id of Object.keys(ctx.SKILLS)) (ctx.SKILLS[id].bank || []).forEach(idea => { if (idea.ask.length < 2) bad.push('BANK ' + id + ' idea needs two ways of asking: ' + idea.why); idea.ask.forEach(q => { if (!(q.h || idea.hint)) bad.push('BANK ' + id + ' no hint: ' + q.t); if (!(q.pic || idea.pic)) bad.push('BANK ' + id + ' no picture: ' + q.t); if (q.o.length < 3) bad.push('BANK ' + id + ' needs 3 options: ' + q.t); }); });
// the race cards: every set makes whole-number sums, four different answers to choose from with the right one among them, a card that can be found again from its key, and dots that draw without printing a number
for (let set = 1; set <= ctx.RACE_SETS; set++) { const seen = new Set(); for (let k = 0; k < 1500; k++) { const c = ctx.raceCard(set), o = ctx.raceOpts(c), tag = 'RACE set ' + set + ' card ' + c.key + ': '; cards++; seen.add(c.key);
  if (!Number.isInteger(c.ans) || c.ans < 0) bad.push(tag + 'answer ' + c.ans);
  if (o.length !== 4 || new Set(o).size !== 4 || !o.includes(c.ans) || o.some(v => !Number.isInteger(v) || v < 0)) bad.push(tag + 'needs four different whole answers with the right one among them: ' + o.join(','));
  const back = ctx.raceFromKey(c.key); if (!back || back.ans !== c.ans) bad.push(tag + 'cannot be found again from its key');
  const el = { innerHTML: '' }; try { ctx.raceDots(el, c); } catch (e) { bad.push(tag + 'dots fail to draw: ' + e.message); } if (/<text/.test(el.innerHTML)) bad.push(tag + 'the dots picture prints something'); const dots = (el.innerHTML.match(/<circle/g) || []).length, want = c.op === '+' ? c.a + c.b : c.op === '−' ? c.a : c.op === '×' ? c.a * c.b : c.a; if (dots !== want) bad.push(tag + 'draws ' + dots + ' dots, wants ' + want); }
  if (seen.size < 20) bad.push('RACE set ' + set + ' has only ' + seen.size + ' different cards: a race needs 20'); }
if (!(ctx.RACE_PACE.length >= 1 && ctx.RACE_PACE.every(p => p >= 3 && p <= 12))) bad.push('RACE pace should be 3 to 12 seconds a step');
// ----- the spine: the periodic table and the body atlas (068-spine.js) -----
// all 118 elements, in order, against an independent list (the npm package "periodic-table"; it spells aluminium and caesium the American way and may hold the old temporary names of the newest elements)
let elChecked = 0, spineRounds = 0, atlasParts = 0;
{ const E = ctx.ELEMENTS; if (E.length !== 118) bad.push('ELEMENTS should hold 118, holds ' + E.length);
  E.forEach((e, i) => { if (e.z !== i + 1) bad.push('ELEMENT out of order: ' + e.name); if (!/^[A-Z][a-z]?$/.test(e.sym)) bad.push('ELEMENT odd symbol: ' + e.sym); if (e.ex && words(e.ex) > 5) bad.push('ELEMENT clue too long: ' + e.ex);
    [1, 2].forEach(m => { const c = ctx.elClue(e.z, m); if (c.toLowerCase().includes(e.name.toLowerCase())) bad.push('ELEMENT clue names the element: ' + c);
      if (/comes (straight )?after|follows/i.test(c)) bad.push('ELEMENT clue only says what it comes after (Tony, 11 October): ' + c); });
    if (!e.ex) bad.push('ELEMENT has no fact for its first clue: ' + e.name);
    if (ctx.elClue(e.z, 1) === ctx.elClue(e.z, 2)) bad.push('ELEMENT second clue is the same as the first: ' + e.name); });
  ctx.EL_GIFTS.forEach(g => { if (!JSON.parse(fs.readFileSync('node_modules/@iconify-json/fluent-emoji-flat/icons.json', 'utf8')).icons[g.art]) bad.push('ELEMENT gift picture missing: ' + g.art); });
  if (ctx.EL_GIFTS.length !== 12 || ctx.EL_GIFTS.some((g, i, A) => i && g.el <= A[i - 1].el)) bad.push('ELEMENT gifts must be 12, in rising order');
  if (new Set(E.map(e => e.sym)).size !== 118 || new Set(E.map(e => e.name)).size !== 118) bad.push('ELEMENTS has a repeated name or symbol');
  let ref = null; try { ref = (await import('periodic-table')).default.all(); } catch (e) { console.log('  (the "periodic-table" package is not installed: the element names were not cross-checked. Run npm install.)'); }
  if (ref) { const us = { Aluminium: 'Aluminum', Caesium: 'Cesium' }, fam = { 'alkali metal': 'alk', 'alkaline earth metal': 'ae', halogen: 'hal', 'noble gas': 'ng' };
    E.forEach(e => { const r = ref.find(x => x.atomicNumber === e.z); if (!r) { bad.push('ELEMENT ' + e.z + ' not in the reference list'); return; } elChecked++;
      if (r.symbol !== e.sym && !/^Uu/.test(r.symbol)) bad.push('ELEMENT ' + e.z + ' symbol ' + e.sym + ', reference says ' + r.symbol);
      if (r.name !== (us[e.name] || e.name) && !/^Unun/.test(r.name)) bad.push('ELEMENT ' + e.z + ' name ' + e.name + ', reference says ' + r.name);
      if (e.z <= 86 && r.standardState && r.standardState !== e.state) bad.push('ELEMENT ' + e.name + ' state ' + e.state + ', reference says ' + r.standardState);
      if (e.z <= 86 && (fam[r.groupBlock] || null) !== (ctx.EL_FAMILY[e.fam] ? e.fam : null)) bad.push('ELEMENT ' + e.name + ' family ' + e.fam + ', reference says ' + r.groupBlock);
      if (e.z <= 20 && e.metal && ((r.groupBlock === 'nonmetal' || r.groupBlock === 'noble gas' || r.groupBlock === 'halogen') !== (e.metal === 'no')) && r.groupBlock !== 'metalloid') bad.push('ELEMENT ' + e.name + ' metal: ' + e.metal + ', reference says ' + r.groupBlock); }); }
  // the grouping games: every card must be in the bin its own facts put it in, for a child who knows 20, 25 or 36
  for (const n of [20, 25, 36]) for (let lv = 1; lv <= 4; lv++) for (let k = 0; k < 60; k++) { const g = ctx.elGroupGame(lv, n);
    if (g.kind === 'sort') { if (g.items.length < 4) bad.push('GROUP game ' + lv + ' has only ' + g.items.length + ' cards'); texts.push(g.text); g.items.forEach(it => { const e = E.find(x => x.name === it.label); if (!e || e.z > n) bad.push('GROUP game ' + lv + ' uses ' + it.label + ', which she has not learnt at ' + n);
        const want = lv === 1 ? (e.metal === 'yes' ? 0 : e.metal === 'no' ? 1 : -1) : lv === 2 ? (e.state === 'gas' ? 0 : e.state === 'solid' ? 1 : -1) : (e.fam === 'alk' ? 0 : e.fam === 'ng' ? 1 : -1); if (want !== it.bin) bad.push('GROUP game ' + lv + ': ' + it.label + ' is in the wrong bin'); if (words(it.why) > 12) bad.push('GROUP reason too long: ' + it.why); }); }
    else g.items.forEach(e => { if (!g.fams.includes(e.fam) || e.z > n) bad.push('GROUP quiz asks about ' + e.name); }); } }
// the body atlas: every system has a picture and named parts with a fact and a clue; every "point to it" round names a real system and real parts
for (const id of Object.keys(ctx.ATLAS)) { const a = ctx.ATLAS[id]; if (!a.name || !a.board || !a.icon || !ctx.COUNTRIES[a.cid]) bad.push('ATLAS ' + id + ' needs a name, a picture, an icon and its country');
  if (a.need) { const [c, m] = a.need.split('.'); if (!ctx.COUNTRIES[c] || !ctx.COUNTRIES[c].missions.some(x => x.id === m)) bad.push('ATLAS ' + id + ' opens with an unknown mission ' + a.need); }
  a.parts.forEach(p => { atlasParts++; if (!p.id || !p.label || !(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100)) bad.push('ATLAS ' + id + ' part needs an id, a name and a place: ' + JSON.stringify(p).slice(0, 60));
    if (!p.fact || !p.hint) bad.push('ATLAS ' + id + ' ' + p.id + ' needs a fact and a clue'); else { [p.fact.text, p.hint.text].forEach(t => { if (words(t) > 12) bad.push('ATLAS-LONG(' + words(t) + ') ' + t); }); if (new RegExp('^The ' + p.label + ' is here', 'i').test(p.hint.text)) bad.push('ATLAS clue points at the place: ' + p.hint.text); } }); }
for (const cid of CIDS) ctx.COUNTRIES[cid].missions.forEach(m => m.rounds.forEach(r => {
  if (r.act === 'point') { spineRounds++; const a = ctx.ATLAS[r.system]; if (!a) bad.push(cid + ' point round names an unknown system ' + r.system); else (r.ids || []).forEach(i => { if (!a.parts.some(p => p.id === i)) bad.push(cid + ' point round names an unknown part ' + i); }); }
  if (r.act === 'elements') spineRounds++;
  if (r.act === 'sieve' && !(ctx.COUNTRIES[cid].ladders || []).includes('sieve')) bad.push(cid + ' has a sieve but does not list sieve in its ladders'); }));

// money outside Brazil is New Zealand dollars and cents (Tony, 11 October): no reais, centavos or R$ in any line or picture; and Brazil keeps its own
{ let nzq = 0; const grab = f => { const el = { innerHTML: '', set html(v) { this.innerHTML = v; } }; try { f(el); } catch (e) { bad.push('MONEY picture fails to draw: ' + e.message); } return el.innerHTML || ''; };
  for (const tag of ['nz', 'japan', 'canada', undefined]) for (let lv = 1; lv <= 6; lv++) for (let k = 0; k < 60; k++) { const it = ctx.SKILLS.money.gen(lv, { tag }); nzq++;
    const all = [it.text, JSON.stringify(it.say), it.explain && it.explain.text].concat(it.steps.map(st => st.text + ' ' + JSON.stringify(st.say))).join(' ') + grab(it.visual) + grab(it.visualDone);
    if (!/<svg[\s\S]*(\$|\dc<)/.test(all)) bad.push('MONEY picture did not draw New Zealand money: L' + lv);
    if (/R\$|centavo|reais|\breal\b|ray-/.test(all)) bad.push('MONEY in ' + (tag || 'no country') + ' L' + lv + ' is not New Zealand money: ' + it.text); }
  const br = ctx.SKILLS.money.gen(5, { tag: 'brazil' }); if (!/R\$/.test(br.text)) bad.push('MONEY in Brazil should stay in reais: ' + br.text);
  console.log(`Money: ${nzq} New Zealand questions in dollars and cents; Brazil keeps reais.`); }
// ----- にほんご, the Japanese strand (0761-nihongo.js) -----
// every word can be read with the letters met by its station; every letter has its strokes; every picture exists and no two words share one (a picture card must have one answer);
// romaji can be made for every word and line (a device with no Japanese voice sounds them out); every line she reads is short; every conversation's right reply is not among its wrong ones
{ const J = ctx.JPW, flat = JSON.parse(fs.readFileSync('node_modules/@iconify-json/fluent-emoji-flat/icons.json', 'utf8')).icons; let jw = 0, jt = 0;
  const pics = {};
  J.JP_ST.forEach((st, i) => { const n = i + 1;
    [...st.kana].forEach(k => { if (!ctx.KANA_STROKES[k]) bad.push('JP station ' + n + ': no strokes for ' + k); });
    if (!st.rule || words(st.rule.text) > 12) bad.push('JP station ' + n + ' rule needs a line of 12 words or fewer');
    if (!st.rule.intro) bad.push('JP station ' + n + ' rule needs an intro');
    [].concat(st.rule.intro, st.rule.outro || []).forEach(x => { if (typeof x === 'string' && /[\u3040-\u30ff]/.test(x)) bad.push('JP station ' + n + ': kana handed to the English voice: ' + x); });
    st.anch.forEach(a => { if (!flat[a[2]]) bad.push('JP anchor picture missing: ' + a[2]); });
    if (!st.marks && !st.small && st.anch.length !== st.kana.length) bad.push('JP station ' + n + ' needs one picture word for each letter');
    st.words.forEach(w => { jw++; if (!J.jpCan(w[0], n)) bad.push('JP station ' + n + ': ' + w[0] + ' uses a letter she has not met');
      if (!flat[w[2]] && w[2] !== 'me' && !(/^flag:/.test(w[2]) && ctx.FLAGS[w[2].slice(5)])) bad.push('JP picture missing: ' + w[2]); if (pics[w[2]] && pics[w[2]] !== w[0]) bad.push('JP two words share a picture: ' + w[0] + ' and ' + pics[w[2]]); pics[w[2]] = w[0];
      const r = J.jpRom(w[0]); if (!r || /undefined/.test(r) || J.jpMora(w[0]).length < 1) bad.push('JP no romaji for ' + w[0]); });
    if (st.words.length < 5) bad.push('JP station ' + n + ' needs at least five words');
    st.talk.forEach(t => { jt++; if (t.count) { if (!(t.count[0] >= 1 && t.count[1] <= 10 && flat[t.thing])) bad.push('JP count talk at station ' + n); return; }
      [t.ask, t.clue].forEach(x => { if (!x || words(x) > 12) bad.push('JP talk line needs 12 words or fewer: ' + x); });
      [t.dog, t.me, t.after].concat(t.no || []).concat((t.opts || []).map(o => o[0])).filter(Boolean).forEach(x => { if (/undefined/.test(J.jpRom(x.replace('{name}', 'ありあ').replace('{kname}', 'アリア')))) bad.push('JP line has a letter with no sound: ' + x); });
      if (!t.any && (!t.me || (t.no || []).includes(t.me) || (t.no || []).length < 2)) bad.push('JP talk at station ' + n + ' needs a right reply and two different wrong ones');
      if (t.any && !(t.opts && t.opts.length >= 2)) bad.push('JP talk at station ' + n + ' needs choices');
      [t.thing, t.want].filter(Boolean).forEach(p => { if (!flat[p]) bad.push('JP talk picture missing: ' + p); }); }); });
  // the race deck for every station: enough cards, and every card has three other choices with different pictures
  for (let n = 1; n <= ctx.JP_N; n++) { const d = J.jpDeck(n); if (d.cards.length < 12) bad.push('JP station ' + n + ' race has only ' + d.cards.length + ' cards'); cards += d.cards.length; }
  if (J.jpRom('わたしは ありあ です。') !== 'watashiwa aria desu' || J.jpRom('きゃ') !== 'kya' || J.jpRom('がっこう') !== 'gakkou' || J.jpRom('ぎゅうにゅう') !== 'gyuunyuu') bad.push('JP romaji rules are wrong: ' + [J.jpRom('わたしは ありあ です。'), J.jpRom('きゃ'), J.jpRom('がっこう'), J.jpRom('ぎゅうにゅう')].join(' | '));
  // katakana (11 October): romaji with the long line and a small letter; twins are never offered side by side; a station's listening pool has no marks on their own
  if (J.jpRom('ニュージーランド') !== 'nyuujiirando' || J.jpRom('ケーキ') !== 'keeki' || J.jpRom('アリア') !== 'aria' || J.jpKata('ありあ') !== 'アリア') bad.push('JP katakana romaji is wrong: ' + [J.jpRom('ニュージーランド'), J.jpRom('ケーキ'), J.jpKata('ありあ')].join(' | '));
  if (!J.jpAlike('あ', 'ア') || J.jpAlike('ア', 'イ')) bad.push('JP katakana twins must count as alike');
  if (J.jpSlowParts('ジュース').map(p => p.t).join('|') !== 'ジュー|ス') bad.push('JP slowly should hold a long sound: ' + J.jpSlowParts('ジュース').map(p => p.t).join('|'));
  J.JP_ST.forEach((st, i) => { if (st.kata) { if (J.jpListenPool(st).some(k => 'ーュャョッ'.includes(k))) bad.push('JP station ' + (i + 1) + ' asks a mark on its own');
    if (st.words.some(w => !J.jpIsKata(w[0]))) bad.push('JP katakana station ' + (i + 1) + ' has a word not in katakana'); } });
  { const k = J.JP_ST.filter(s => s.kata).flatMap(s => s.words.map(w => w[0])); ['ニュージーランド', 'パン'].forEach(w => { if (!k.includes(w)) bad.push('JP katakana must teach ' + w); }); }
  // every hiragana on the chart, the marked ones and the small ones has its strokes
  [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' + J.JP_MARKED + 'ゃゅょっ'].forEach(k => { if (!ctx.KANA_STROKES[k]) bad.push('JP no strokes for ' + k); });
  // every letter's picture word has that letter in it (11 October: ぱ was shown with えんぴつ); every letter the listening check asks has been met first in its family
  J.JP_ST.forEach((st, i) => { const L = st.marks ? ['が', 'ざ', 'だ', 'ば', 'ぱ'] : st.small ? ['ゃ', 'ゅ', 'ょ', 'っ'] : [...st.kana];
    L.forEach((k, j) => { const a = st.anch[j]; if (!a || !a[0].includes(k)) bad.push('JP station ' + (i + 1) + ': the picture word for ' + k + ' does not have it in it: ' + (a && a[0])); });
    if (st.marks || st.small) { const met = new Set(L.flatMap(k => J.jpFamilyOf(st, k).map(f => f.to)).concat(L)); (st.marks ? J.JP_MARKPOOL : J.JP_SMALLPOOL).forEach(k => { if (!met.has(k)) bad.push('JP station ' + (i + 1) + ': ' + k + ' is asked but never met'); }); } });
  if (J.JP_NUM[4] !== 'し' || J.JP_NUM[7] !== 'しち') bad.push('JP counting on says し and しち');
  if (J.jpSlowParts('そら').length !== 2 || J.jpSlowParts('こんにちは').slice(-1)[0].t !== 'わ' || J.jpSlowParts('これは ねこ です。').length !== 3) bad.push('JP slowly does not break words into sounds: ' + JSON.stringify(J.jpSlowParts('こんにちは')));
  J.JP_GIFTS.forEach(g => { if (!flat[g.art]) bad.push('JP gift picture missing: ' + g.art); }); if (J.JP_GIFTS.length !== ctx.JP_N) bad.push('JP needs one gift for each station');
  J.JP_STOPS.forEach(s => { if (!flat[s.icon]) bad.push('JP stop picture missing: ' + s.icon); });
  /* KENTA'S TOWN: every line uses only letters met on the line; every prompt is 12 words or fewer; every picture exists; each step has a right answer; the role-play has five turns */
  { const T = ctx.TOWNW, pic = p => flat[p] || ['me', 'kenta'].includes(p) || (/^flag:/.test(p) && ctx.FLAGS[p.slice(5)]) || /^(age|yen|coin):\d+$/.test(p); let tl = 0;
    const can = (x, where) => { tl++; const t = String(x).replace('{kname}', 'アリア').replace('{name}', 'ありあ').replace('＿', ''); if (!J.jpCan(t, ctx.JP_N)) bad.push('TOWN ' + where + ': a letter she has not met in ' + x); if (/undefined/.test(J.jpRom(t))) bad.push('TOWN ' + where + ': no sound for ' + x); };
    const en = (x, where) => { if (!x || words(x) > 12) bad.push('TOWN ' + where + ' needs a line of 12 words or fewer: ' + x); if (/[\u3040-\u30ff]/.test(x) && where !== 'clue') bad.push('TOWN ' + where + ': kana in a line the English voice reads: ' + x); };   /* clues are spoken through townMix */
    T.TOWN.filter(p => !p.soon).forEach(P => { const w = 'place ' + P.id;
      if (!P.friend || !flat[P.friend.art] || !flat[P.icon] || !P.card || P.card.length !== 3 || !P.tip) bad.push('TOWN ' + w + ' needs a friend, a sign, a card of three and a tip');
      P.watch.forEach(l => { can(l[1], w + ' watch'); if (l[3] && l[3] !== 'rin' && !pic(l[3])) bad.push('TOWN picture missing: ' + l[3]); }); if (P.watch.length < 4 || P.watch.length > 6) bad.push('TOWN ' + w + ': the dialogue should be four to six lines');
      P.words.forEach(x => { can(x[0], w + ' words'); if (!pic(x[2])) bad.push('TOWN picture missing: ' + x[2]); });
      P.swap.forEach(it => { can(T.townWhole(it), w + ' swap'); it.no.forEach(x => can(x, w + ' swap')); en(it.ask, w + ' swap'); en(it.clue, 'clue'); if (!pic(it.img)) bad.push('TOWN picture missing: ' + it.img); if (it.no.includes(it.fill) || !it.frame.includes('＿')) bad.push('TOWN ' + w + ' swap needs a gap and two wrong words'); });
      P.own.forEach(o => { can(o.dog, w + ' own'); o.opts.forEach(x => can(x[0], w + ' own')); en(o.ask, w + ' own'); });
      P.ask.forEach(it => { [it.q, it.ans].concat(it.no).forEach(x => can(x, w + ' ask')); en(it.want, w + ' ask'); en(it.check, w + ' ask'); if (it.no.includes(it.q)) bad.push('TOWN ' + w + ': the right question is among the wrong ones'); it.pics.forEach(p => { if (!pic(p[2])) bad.push('TOWN picture missing: ' + p[2]); }); });
      P.listen.forEach(it => { can(it.t, w + ' listen'); en(it.ask, w + ' listen'); it.pics.forEach(p => { if (!pic(p[2])) bad.push('TOWN picture missing: ' + p[2]); }); if (new Set(it.pics.map(p => p[2])).size !== it.pics.length) bad.push('TOWN ' + w + ': two pictures the same'); });
      if (P.role.length !== 5) bad.push('TOWN ' + w + ': the role-play should have five turns');
      P.role.slice(0, 4).forEach(t => (t.me ? [t.me] : []).concat(t.no || []).concat((t.any || []).map(x => x[0])).forEach(x => { if (!T.townEn(x)) bad.push('TOWN ' + w + ': no English for the reply ' + x + ' (English goes under every reply or none)'); }));
      P.role.forEach(t => { can(t.dog, w + ' role'); (t.me ? [t.me] : []).concat(t.no || []).concat((t.any || []).map(x => x[0])).forEach(x => can(x, w + ' role')); en(t.ask, w + ' role'); if (!t.any && (!t.me || t.no.includes(t.me) || t.no.length < 2)) bad.push('TOWN ' + w + ' role turn needs a right reply and two wrong ones'); if (t.thing && !pic(t.thing)) bad.push('TOWN picture missing: ' + t.thing); });
      P.card.forEach(r => { can(r[0], w + ' card'); can(r[2], w + ' card'); });
      if (T.townLines(P).length < 20) bad.push('TOWN ' + w + ' has too few lines to record'); });
    T.TOWN_STEPS.forEach(s => { if (!flat[s.icon]) bad.push('TOWN step picture missing: ' + s.icon); });
    if (T.TOWN.length !== 8) bad.push('TOWN should show eight places');
    console.log(`Kenta's Town: ${T.TOWN.filter(p => !p.soon).length} places built, ${tl} lines each readable from the letters met on the line.`); }
  /* CODE LAB (28 October): every puzzle can be done, within its block limit, in its best count; a limit really needs a loop; a buggy program really fails; the broken-down parts can each be done;
     every prediction lands on the board away from the start; the shapes differ; prompts are 12 words or fewer; pictures and gifts exist */
  { const C = ctx.CODEW; let np = 0; const ids = new Set();
    const onBoard = (b, c) => c[0] >= 0 && c[1] >= 0 && c[0] < b.cols && c[1] < b.rows;
    C.CD_ST.forEach((st, si) => { const w = 'CODE station ' + (si + 1);
      if (!flat[st.icon]) bad.push(w + ': picture missing ' + st.icon); if (st.soon) return;
      if (words(st.idea) > 12 || /[\u3040-\u30ff]/.test(st.ideaSay)) bad.push(w + ': the idea needs 12 words or fewer');
      st.meet.forEach(m => { const r = C.cdSim(m.b, C.cdParse(m.prog)); if (m.fixed) { if ((m.bug && C.cdWin(m.b, r)) || (!m.bug && !C.cdWin(m.b, r)) || !C.cdWin(m.b, C.cdSim(m.b, C.cdParse(m.fixed)))) bad.push(w + ': the demo should fail, then work when fixed'); } else if (r.bump) bad.push(w + ': the demo bumps'); });
      st.items.forEach(it => { np++; const x = w + ' ' + it.id; if (ids.has(it.id)) bad.push(x + ': id used twice'); ids.add(it.id);
        if (!it.text || words(it.text) > 12) bad.push(x + ': prompt needs 12 words or fewer');
        const b = it.b; if (b) { [b.start].concat(b.gems || [], b.goal ? [b.goal] : [], b.crates || []).forEach(c => { if (!onBoard(b, c)) bad.push(x + ': off the board ' + c); });
          if ((b.crates || []).some(c => c + '' === b.start + '')) bad.push(x + ': starts on a crate'); }
        if (it.k === 'build' || it.k === 'fix') { const sol = C.cdParse(it.sol), r = C.cdSim(b, sol), n = C.cdCount(sol);
          if (!C.cdWin(b, r)) bad.push(x + ': its own answer does not work: ' + it.sol);
          if (it.max && n > it.max) bad.push(x + ': answer over the block limit');
          if (it.best > n) bad.push(x + ': best is more than the answer');
          const route = C.cdRoute(b), legs = C.cdCorners(route); let here = { at: b.start, f: { u: 0, r: 1, d: 2, l: 3 }[b.face] };
          if (route.length < 2) bad.push(x + ': no route');
          legs.forEach(li => { const to = route[li], p = C.cdLegProg(route, here, to), rr = C.cdSim(b, p, [here.at[0], here.at[1], here.f]); if (rr.bump || rr.x !== to[0] || rr.y !== to[1]) bad.push(x + ': a part of the trip cannot be done'); here = { at: to, f: rr.f }; });
          const whole = C.cdLegProg(route, { at: b.start, f: { u: 0, r: 1, d: 2, l: 3 }[b.face] }, route[route.length - 1]);
          if (!C.cdWin(b, C.cdSim(b, whole))) bad.push(x + ': the step-by-step route does not do the job');
          if (it.max && C.cdCount(whole) <= it.max) bad.push(x + ': the limit does not need a loop'); }
        if (it.k === 'fix' || it.k === 'bug') { const p = C.cdParse(it.prog); if (C.cdWin(b, C.cdSim(b, p))) bad.push(x + ': the buggy program works'); if (!(it.bug >= 0 && it.bug <= p.length)) bad.push(x + ': bug out of range'); }
        if (it.k === 'predict') { const r = C.cdSim(b, C.cdParse(it.prog)); if (r.bump) bad.push(x + ': the robot bumps'); if (r.x === b.start[0] && r.y === b.start[1]) bad.push(x + ': it ends where it starts'); }
        if (it.k === 'shape') { const sv = [it.prog].concat(it.opts).map(q => C.cdShapeSvg(C.cdParse(q))); if (new Set(sv).size !== sv.length) bad.push(x + ': two shapes look the same'); } }); });
    if (C.CD_GIFTS.length !== C.CD_BUILT) bad.push('CODE needs one gift for each built station'); C.CD_GIFTS.forEach(g => { if (!flat[g.art]) bad.push('CODE gift picture missing: ' + g.art); });
    console.log(`Code Lab: ${C.CD_ST.length} stations planned, ${C.CD_BUILT} built, ${np} puzzles each checked: the answer works within its limit, every part of a broken-down trip can be done, a limit needs a loop.`); }
  console.log(`Japanese: ${ctx.JP_N} stations, ${jw} words each readable from the letters met so far, ${jt} conversations, every letter's strokes, the race at ${ctx.JP_PACE} seconds a step.`); }
texts.forEach(t => { if (words(t) > 12) bad.push('CONTENT-LONG(' + words(t) + ') ' + t); });
const uniq = [...new Set(bad)];
console.log(`118 elements in order${elChecked ? ', ' + elChecked + ' checked against an independent list' : ''}; ${atlasParts} body-atlas parts; ${spineRounds} periodic-table and point-to-it rounds; grouping games checked for a child who knows 20, 25 and 36.`);
console.log(`${shapeQ} shape questions all name their shape; no picture shows its own answer.`);
console.log(`${tools} hands-on tools checked: each one lands on its step's answer, and no help line tells an answer.`);
console.log(`${n} questions generated across ${CIDS.length} countries (${CIDS.join(', ')}); ${texts.length} content lines, ${puzzles} coding puzzles, ${panels} tukutuku panels, ${mirrors} pixel pictures, ${folds} paper folds, ${beats} band parts, ${races} races and ${cards} race cards checked. Longest question: ${maxWords} words. Largest answer: ${maxAns}. Problems: ${uniq.length}`);
uniq.slice(0, 40).forEach(b => console.log('  ' + b));
process.exit(uniq.length ? 1 : 0);
