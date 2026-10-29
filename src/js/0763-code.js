/* ===== CODE LAB: programming, a strand of its own (approved by Tony on 28 October: "Approve the plan of attack").
   Why: programming runs through every subject at good intermediate schools. Before this, the game's coding was grid puzzles inside the countries (moves and repeats only).
   Twelve stations that teach the ideas of programming in order: the first four built on 28 October, the other eight on 29 October (Tony: "proceed with developing the rest of the code lab stations"):
     1 Steps in order (a sequence)   2 Find the bug (debugging)   3 Repeat (loops)   4 Draw with loops (patterns, a loop inside a loop)
     5 If (decisions)  6 If or else  7 Repeat until  8 Counters (variables)  9 My own blocks (functions)  10 Blocks with numbers (parameters)  11 Buttons and events  12 Real code (Python)
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
/* a program written short:
   F forward (F3 forward three; Fx forward by the block's own number), cw and acw turns, C add one to the counter, M my own block (M2 with the number 2),
   R3( … ) repeat three times (Rc( … ) repeat as many times as the counter says), I(wall: … ) if, E(wall: … | … ) if or else, U(goal: … ) repeat until.
   The questions a program can ask (sensors): wall (the way ahead is blocked: a crate or the edge), gem (on a gem's square), blue and yellow (on a square of that colour), goal (on the battery) */
const CD_BOX = { R: 1, I: 1, E: 1, U: 1 };
const cdKids = n => n.t === 'E' ? [n.body, n.alt] : CD_BOX[n.t] ? [n.body] : [];
function cdParse(s) {
  const tok = String(s).replace(/([():|])/g, ' $1 ').trim().split(/\s+/).filter(Boolean); let i = 0;
  const list = () => { const out = []; while (i < tok.length && tok[i] !== ')' && tok[i] !== '|') { const t = tok[i++]; let m;
      if ((m = /^R(\d|c)$/.exec(t))) { i++; const body = list(); i++; out.push({ t: 'R', n: m[1] === 'c' ? 'c' : Number(m[1]), body }); }
      else if (t === 'I' || t === 'E' || t === 'U') { i++; const c = tok[i++]; i++; const body = list(); const n = { t, c, body }; if (t === 'E') { i++; n.alt = list(); } i++; out.push(n); }
      else if ((m = /^F(\d|x)$/.exec(t))) out.push({ t: 'F', n: m[1] === 'x' ? 'x' : Number(m[1]) });
      else if ((m = /^M(\d)?$/.exec(t))) out.push(m[1] ? { t: 'M', n: Number(m[1]) } : { t: 'M' });
      else out.push({ t }); } return out; };
  return list();
}
const cdCount = l => l.reduce((a, n) => a + 1 + cdKids(n).reduce((s, k) => s + cdCount(k), 0), 0);
const cdText = l => l.map(n => n.t === 'R' ? 'R' + n.n + '(' + cdText(n.body) + ')' : n.t === 'E' ? 'E(' + n.c + ': ' + cdText(n.body) + ' | ' + cdText(n.alt) + ')'
  : CD_BOX[n.t] ? n.t + '(' + n.c + ': ' + cdText(n.body) + ')' : (n.t === 'F' || n.t === 'M') && n.n != null ? n.t + n.n : n.t).join(' ').replace(/\s+/g, ' ').replace(/: \)/g, ':)').replace(/ \)/g, ')');
const cdClone = l => l.map(n => { const c = Object.assign({}, n); if (n.body) c.body = cdClone(n.body); if (n.alt) c.alt = cdClone(n.alt); return c; });
/* every block in reading order (a box, then what is inside it): a bug is found by its place in this list */
const cdFlat = l => l.flatMap(n => [n].concat(...cdKids(n).map(cdFlat)));
const cdUses = l => new Set(cdFlat(l).flatMap(n => [n.t].concat(n.c ? ['?' + n.c] : [], n.n === 'c' ? ['Rc'] : [], n.n != null && n.t === 'F' ? ['Fn'] : [])));

/* the two lists of stations 9 and 10: my own block (the star), and the program */
const CD_MROOTS = [{ id: 'M', label: 'My block is', icon: 'star', hint: 'Drag blocks here' }, { id: 'main', label: 'Program', icon: 'robot' }];
/* the buttons of station 11: [picture, colour, name] */
const CD_BTN = { g: ['green-circle', '#2E9E5B', 'green'], o: ['orange-circle', '#F28C28', 'orange'], p: ['purple-circle', '#7A5CC9', 'purple'] };
const cdBtnRoots = ks => ks.map(k => ({ id: k, label: 'When pressed', icon: CD_BTN[k][0], hint: 'Drag blocks here' }));
/* ---- the twelve stations ---- */
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
  /* stations 5 to 8 (29 October, Tony: "proceed with developing the rest of the code lab stations"). From here a build puzzle has two boards and one program must work on both:
     that is what if, until and counters are for. A program written for one board, step by step, fails the other (the content test checks every puzzle for this) */
  { name: 'If', icon: 'thinking-face', idea: 'If asks a question. Yes: the blocks inside run.',
    ideaSay: 'An if block asks the robot a question, like: am I on a blue square? If the answer is yes, the blocks inside it run. If the answer is no, the robot skips them. So one program can work on different boards.',
    blocks: ['F', 'cw', 'acw', 'R', 'I'], sensors: ['blue', 'yellow', 'wall'],
    meet: [{ bs: [{ cols: 5, rows: 4, start: [0, 0], face: 'r', blue: [[2, 0]], goal: [2, 3] }, { cols: 5, rows: 4, start: [0, 0], face: 'r', blue: [[4, 0]], goal: [4, 1] }], prog: 'R5(F I(blue: cw))' }],
    items: [
      { id: '5a', k: 'build', bs: [{ cols: 5, rows: 5, start: [0, 0], face: 'r', blue: [[4, 0]], goal: [4, 2] }, { cols: 5, rows: 5, start: [0, 0], face: 'r', blue: [[2, 0]], goal: [2, 4] }], sol: 'R6(F I(blue: cw))',
        text: 'Turn clockwise on blue. One program for both boards.',
        hint: ['The robot must ask: am I on blue?', 'The robot cannot know where to turn. An if block lets it ask: am I on a blue square? If yes, turn clockwise.'],
        hint2: ['Count the forwards on each board. The same?', 'Count the squares the robot moves on board 1, then on board 2. If it is the same number, one repeat can do it.'] },
      { id: '5b', k: 'predict', b: { cols: 5, rows: 4, start: [0, 0], face: 'r', blue: [[3, 0]] }, prog: 'R4(F I(blue: cw))', text: 'Where will it stop? Watch for the blue square.' },
      { id: '5c', k: 'build', bs: [{ cols: 4, rows: 4, start: [0, 0], face: 'r', goal: [3, 3] }, { cols: 5, rows: 3, start: [0, 0], face: 'r', goal: [4, 2] }], sol: 'R6(I(wall: cw) F)',
        text: 'If the way is blocked, turn clockwise. Both boards.',
        hint: ['Ask first: is the way blocked?', 'Before each forward, the robot can ask: is the way ahead blocked? If yes, it turns clockwise first.'],
        hint2: ['Count every forward. Same on both boards?', 'Count how many squares the robot moves on each board. If it is the same, one repeat can hold the steps.'] },
      { id: '5d', k: 'fix', bs: [{ cols: 5, rows: 5, start: [0, 0], face: 'r', blue: [[3, 0]], goal: [3, 3] }, { cols: 5, rows: 5, start: [0, 0], face: 'r', blue: [[2, 0]], goal: [2, 4] }], prog: 'R6(F I(blue: acw))', bug: 3, sol: 'R6(F I(blue: cw))',
        text: 'Test it. Find the bug and fix it, for both boards.' },
      { id: '5e', k: 'predict', b: { cols: 3, rows: 3, start: [0, 0], face: 'r' }, prog: 'R5(I(wall: cw) F)', text: 'Where will it stop? It turns when blocked.' },
      { id: '5f', k: 'build', bs: [{ cols: 5, rows: 5, start: [0, 0], face: 'r', blue: [[2, 0], [4, 2]], yellow: [[2, 2]], goal: [4, 4] }, { cols: 5, rows: 6, start: [0, 0], face: 'r', blue: [[1, 0], [3, 4]], yellow: [[1, 4]], goal: [3, 5] }],
        sol: 'R8(F I(blue: cw) I(yellow: acw))',
        text: 'Blue: turn clockwise. Yellow: turn anticlockwise. Both boards.',
        hint: ['Use two ifs: one for blue, one for yellow.', 'After each forward the robot needs two questions: am I on blue? And am I on yellow? Each has its own turn inside.'],
        hint2: ['Count the forwards on each board.', 'Count every square the robot moves on each board. The repeat needs that many.'] }] },
  { name: 'If or else', icon: 'magnifying-glass-tilted-left', idea: 'If or else: yes does one thing, no does another.',
    ideaSay: 'An if or else block asks a question and always does one of two things. If the answer is yes, it does the blocks at the top. If the answer is no, it does the blocks after else.',
    blocks: ['F', 'cw', 'acw', 'R', 'I', 'E'], sensors: ['wall', 'blue'],
    meet: [{ bs: [{ cols: 4, rows: 3, start: [0, 0], face: 'r', goal: [3, 2] }, { cols: 3, rows: 4, start: [0, 0], face: 'r', goal: [2, 3] }], prog: 'R6(E(wall: cw | F))' }],
    items: [
      { id: '6a', k: 'predict', b: { cols: 3, rows: 3, start: [0, 0], face: 'r' }, prog: 'R5(E(wall: cw | F))', text: 'Where will it stop? Yes: turn. No: forward.' },
      { id: '6b', k: 'build', bs: [{ cols: 5, rows: 3, start: [0, 1], face: 'r', crates: [[3, 1]], goal: [0, 2] }, { cols: 4, rows: 4, start: [0, 0], face: 'r', crates: [[2, 0]], goal: [0, 3] }], sol: 'R7(E(wall: cw | F))',
        text: 'Blocked: turn clockwise. Else: forward. Both boards.',
        hint: ['Each step does one thing: turn, or go.', 'Each time round, the robot does only one thing. If the way is blocked it turns. If not, it goes. That is if or else.'],
        hint2: ['Count every turn and every forward.', 'Count each turn and each forward on board 1. The repeat needs that many. Is it the same on board 2?'] },
      { id: '6c', k: 'bug', b: { cols: 4, rows: 3, start: [0, 0], face: 'r', goal: [3, 2] }, prog: 'R6(E(wall: acw | F))', bug: 2, text: 'Which block is the bug? Test it, then tap it.' },
      { id: '6d', k: 'build', bs: [{ cols: 5, rows: 4, start: [0, 0], face: 'r', blue: [[3, 0]], goal: [3, 3] }, { cols: 5, rows: 4, start: [0, 0], face: 'r', blue: [[2, 0], [2, 2]], goal: [0, 2] }], sol: 'R6(E(blue: cw F | F))',
        text: 'On blue: turn clockwise, then go. Else: go. Both boards.',
        hint: ['Yes and no each need their own blocks.', 'The top part runs on blue. The else part runs everywhere else. What should each part do?'],
        hint2: ['Count the forwards on each board.', 'Count every square the robot moves on board 1, then on board 2. The repeat needs that many.'] },
      { id: '6e', k: 'predict', b: { cols: 4, rows: 4, start: [0, 3], face: 'u', blue: [[0, 1]] }, prog: 'R4(E(blue: cw F | F))', text: 'Where will it stop? Read the if and the else.' },
      { id: '6f', k: 'build', bs: [{ cols: 3, rows: 3, start: [0, 0], face: 'r', goal: [0, 2] }, { cols: 4, rows: 2, start: [0, 0], face: 'r', goal: [1, 1] }], max: 4, sol: 'R8(E(wall: cw | F))',
        text: 'Follow the walls on both boards. 4 blocks or fewer.',
        hint: ['Each step: blocked? Turn. If not, go.', 'Each time round, the robot asks: is the way blocked? Yes: turn clockwise. No: go forward.'],
        hint2: ['Count the turns and forwards on board 1.', 'Count every turn and every forward on board 1. That is the number for the repeat.'] }] },
  { name: 'Repeat until', icon: 'battery', idea: 'Repeat until goes on until the answer is yes.',
    ideaSay: 'Repeat until asks a question before each go. While the answer is no, it does the blocks inside again. When the answer is yes, it stops. You do not need to count!',
    blocks: ['F', 'cw', 'acw', 'U', 'I', 'E'], sensors: ['wall', 'blue'], untils: ['goal', 'wall', 'blue'],
    meet: [{ bs: [{ cols: 6, rows: 2, start: [0, 0], face: 'r', goal: [5, 0] }, { cols: 4, rows: 2, start: [0, 0], face: 'r', goal: [3, 0] }], prog: 'R5(F)', bug: true,
      after: 'Repeat 5 fits board 1 only. Repeat until fits both.', afterSay: 'Repeat 5 only fits board 1. On board 2 it bumps. Repeat until the battery fits both boards, with no counting.', fixed: 'U(goal: F)' }],
    items: [
      { id: '7a', k: 'build', bs: [{ cols: 6, rows: 2, start: [0, 0], face: 'r', goal: [5, 0] }, { cols: 3, rows: 3, start: [0, 1], face: 'r', goal: [2, 1] }], max: 2, sol: 'U(goal: F)',
        text: 'Get to the battery on both boards. 2 blocks.',
        hint: ['Do not count. Repeat until the battery.', 'The boards are different lengths, so no number fits both. Repeat until keeps going until the robot is at the battery.'],
        hint2: ['Which question tells it to stop?', 'Tap the question on repeat until. Which one is true only at the end of the trip?'] },
      { id: '7b', k: 'predict', b: { cols: 5, rows: 4, start: [0, 1], face: 'r' }, prog: 'U(wall: F) cw F', text: 'Where will it stop? It goes until blocked.' },
      { id: '7c', k: 'build', bs: [{ cols: 5, rows: 4, start: [0, 0], face: 'r', goal: [4, 3] }, { cols: 3, rows: 5, start: [0, 0], face: 'r', goal: [2, 4] }], sol: 'U(wall: F) cw U(goal: F)',
        text: 'To the wall, turn, then to the battery. Both boards.',
        hint: ['Two loops, with two different questions.', 'The first loop stops when the way is blocked. The second stops at the battery.'],
        hint2: ['The turn goes between the two loops.', 'The turn happens once, between the two loops, not inside them.'] },
      { id: '7d', k: 'fix', bs: [{ cols: 6, rows: 2, start: [0, 0], face: 'r', goal: [5, 0] }, { cols: 4, rows: 3, start: [0, 1], face: 'r', goal: [3, 1] }], prog: 'R5(F)', bug: 0, sol: 'U(goal: F)',
        text: 'It only works on board 1. Fix it for both.' },
      { id: '7e', k: 'predict', b: { cols: 4, rows: 4, start: [0, 0], face: 'r', blue: [[2, 0]] }, prog: 'U(blue: F) cw U(wall: F)', text: 'Where will it stop? Two loops, two questions.' },
      { id: '7f', k: 'build', bs: [{ cols: 4, rows: 4, start: [0, 0], face: 'r', goal: [0, 3] }, { cols: 5, rows: 3, start: [0, 0], face: 'r', goal: [1, 2] }], max: 4, sol: 'U(goal: E(wall: cw | F))',
        text: 'Follow the walls to the battery. 4 blocks or fewer.',
        hint: ['Put an if or else inside repeat until.', 'Repeat until the battery. Inside, each step asks: is the way blocked?'],
        hint2: ['Blocked: turn clockwise. Not blocked: forward.', 'If the way is blocked, the robot turns clockwise. If not, it goes forward.'] }] },
  { name: 'Counters', icon: 'gem-stone', idea: 'A counter remembers a number. Add 1 makes it bigger.',
    ideaSay: 'A counter is a box that remembers a number. Programmers call it a variable. It starts at 0. Add 1 makes it one bigger. The robot can count things, and use the number later.',
    blocks: ['F', 'cw', 'acw', 'R', 'I', 'E', 'C'], sensors: ['gem', 'wall'], counter: true,
    meet: [{ b: { cols: 6, rows: 2, start: [0, 0], face: 'r', gems: [[1, 0], [3, 0], [4, 0]] }, prog: 'R5(F I(gem: C))' }],
    items: [
      { id: '8a', k: 'count', b: { cols: 5, rows: 2, start: [0, 0], face: 'r', gems: [[1, 0], [2, 0], [4, 0]] }, prog: 'R4(F I(gem: C))', opts: [2, 4], text: 'What will the counter say at the end?' },
      { id: '8b', k: 'build', bs: [{ cols: 6, rows: 2, start: [0, 0], face: 'r', gems: [[1, 0], [4, 0]], goal: [5, 0], count: 2 }, { cols: 6, rows: 2, start: [0, 0], face: 'r', gems: [[1, 0], [2, 0], [3, 0]], goal: [5, 0], count: 3 }], sol: 'R5(F I(gem: C))',
        text: 'Count every gem. Stop on the battery. Both boards.',
        hint: ['After each forward ask: on a gem?', 'After each step the robot can ask: am I on a gem? If yes, add 1 to the counter.'],
        hint2: ['Count the forwards to the battery.', 'Count how many squares the robot moves to reach the battery. The repeat needs that many.'] },
      { id: '8c', k: 'count', b: { cols: 3, rows: 2, start: [0, 0], face: 'r' }, prog: 'R3(C C)', opts: [3, 5], text: 'What will the counter say? Count each add 1.' },
      { id: '8d', k: 'build', bs: [{ cols: 4, rows: 4, start: [0, 0], face: 'r', gems: [[2, 0], [3, 2]], goal: [3, 3], count: 2 }, { cols: 5, rows: 4, start: [0, 0], face: 'r', gems: [[1, 0], [3, 0], [4, 1]], goal: [4, 2], count: 3 }], sol: 'R7(E(wall: cw | F I(gem: C)))',
        text: 'Count the gems round the corner. Both boards.',
        hint: ['Each step: turn, or go forward.', 'Each time round, the robot either turns, when it is blocked, or goes forward. Use if or else.'],
        hint2: ['After going forward, ask about a gem.', 'Only after a forward can the robot be on a new gem. Ask then: am I on a gem? If yes, add 1.'] },
      { id: '8e', k: 'predict', b: { cols: 5, rows: 5, start: [0, 0], face: 'r', gems: [[1, 0], [3, 0]] }, prog: 'R4(F I(gem: C)) cw Rc(F)', text: 'Count the gems. Then where will it stop?' },
      { id: '8f', k: 'build', bs: [{ cols: 5, rows: 4, start: [0, 0], face: 'r', gems: [[1, 0], [3, 0]], goal: [4, 2] }, { cols: 5, rows: 4, start: [0, 0], face: 'r', gems: [[1, 0], [2, 0], [4, 0]], goal: [4, 3] }], sol: 'R4(F I(gem: C)) cw Rc(F)',
        text: 'Count the gems. Go down that many to the battery.',
        hint: ['The counter remembers how many gems.', 'Count the gems on the top row first. The counter remembers the number for later.'],
        hint2: ['A repeat can use the counter as its number.', 'Tap the number on a repeat. The counter is one of the choices. It repeats as many times as the counter says.'] }] },
  /* stations 9 to 12 (29 October). 9 and 10 have two lists: my own block (the star) and the program. A puzzle marked need: 'M' must use the star block.
     A shape marked drawn: true takes its dotted target from its own answer (cdPath), so the dots and the answer always agree */
  { name: 'My own blocks', icon: 'puzzle-piece', idea: 'Make your own block once. Use it again and again.',
    ideaSay: 'You can make a block of your own. Put some blocks inside the star, once. Then the star block does all of them, wherever you use it. Programmers call this a function.',
    blocks: ['F', 'cw', 'acw', 'R', 'M'], roots: CD_MROOTS,
    meet: [{ b: { cols: 5, rows: 3, start: [0, 2], face: 'u', pen: true }, def: 'R4(F cw)', prog: 'M cw F F acw M' }],
    items: [
      { id: '9a', k: 'build', b: { cols: 5, rows: 5, start: [0, 4], face: 'r', gems: [[1, 3], [2, 2], [3, 1]], goal: [4, 0] }, def: 'F acw F cw', sol: 'M M M M', need: 'M',
        text: 'Make my block one stair. Use it to climb.',
        hint: ['One stair: forward, turn, forward, turn back.', 'One stair is: forward, turn anticlockwise, forward, turn clockwise. Put those inside the star. Then use the star block.'],
        hint2: ['Use the star block once for each stair.', 'Count the stairs to the battery. Use the star block once for each stair.'] },
      { id: '9b', k: 'predict', b: { cols: 5, rows: 4, start: [0, 3], face: 'u' }, def: 'F F cw', prog: 'M M', text: 'Where will it stop? Read my block first.' },
      { id: '9c', k: 'build', b: { cols: 3, rows: 3, start: [1, 1], face: 'u', pen: true, drawn: true }, def: 'R4(F cw)', sol: 'R4(M cw)', need: 'M',
        text: 'Draw the window: four squares. Use my block.',
        hint: ['Make my block draw one small square.', 'Put a square inside the star: repeat 4, forward, turn clockwise. Then the program draws it four times.'],
        hint2: ['After each square, turn clockwise.', 'Draw a square, turn clockwise, and do it again. Four times.'] },
      { id: '9d', k: 'fix', b: { cols: 5, rows: 5, start: [0, 0], face: 'r', gems: [[1, 1], [2, 2], [3, 3]], goal: [4, 4] }, def: 'F cw F cw', sdef: 'F cw F acw', prog: 'M M M M', sol: 'M M M M', bug: 3, bugIn: 'M',
        text: 'Test it. Find the bug and fix it.' },
      { id: '9e', k: 'predict', b: { cols: 4, rows: 4, start: [1, 0], face: 'r' }, def: 'F cw', prog: 'R2(M) F', text: 'My block is in a repeat. Where will it stop?' },
      { id: '9f', k: 'build', b: { cols: 6, rows: 3, start: [0, 2], face: 'u', pen: true, drawn: true }, def: 'R4(F cw)', sol: 'M cw F F acw M cw F F acw M', need: 'M',
        text: 'Draw all three squares. Use my block.',
        hint: ['Make my block draw one square.', 'Put one square inside the star. Then the program uses it three times, moving along in between.'],
        hint2: ['Between squares: turn, two forwards, turn back.', 'After each square, turn clockwise, go forward two, and turn anticlockwise. Then the next square.'] }] },
  { name: 'Blocks with numbers', icon: 'control-knobs', idea: 'A number in a block says how much.',
    ideaSay: 'A block can carry a number. Forward 3 moves three squares, in one block. Tap the number on a block to change it. Your own block can take a number too, and use it inside. Programmers call that number a parameter.',
    blocks: ['F', 'cw', 'acw', 'R', 'M'], fnum: true, mnum: true, xnum: true, roots: CD_MROOTS,
    meet: [{ b: { cols: 6, rows: 3, start: [0, 2], face: 'r', goal: [4, 0] }, prog: 'F F F F acw F F', after: 'Seven blocks. With numbers, three blocks.', afterSay: 'That was seven blocks. With numbers, it is only three: forward 4, turn, forward 2.', fixed: 'F4 acw F2' }],
    items: [
      { id: '10a', k: 'build', b: { cols: 6, rows: 4, start: [0, 3], face: 'u', goal: [5, 0] }, max: 3, sol: 'F3 cw F5', text: 'Get to the battery in 3 blocks. Use numbers.',
        hint: ['Tap the number on forward to change it.', 'One forward block can go many squares. Tap its number and choose how many.'],
        hint2: ['Count the squares up. Then across.', 'Count the squares up to the top row. Then count across to the battery. Those are your two numbers.'] },
      { id: '10b', k: 'predict', b: { cols: 5, rows: 5, start: [0, 0], face: 'r' }, prog: 'F2 cw F3 acw F1', text: 'Where will it stop? Read each number.' },
      { id: '10c', k: 'build', b: { cols: 5, rows: 3, start: [0, 2], face: 'u', pen: true, drawn: true }, max: 5, sol: 'R2(F2 cw F4 cw)', text: 'Draw the rectangle. 5 blocks or fewer.',
        hint: ['A rectangle: short side, turn, long side, turn.', 'A rectangle is a short side, a turn, a long side, a turn, and the same again. Numbers make each side one block.'],
        hint2: ['Count the squares along each side.', 'Count how many squares the short side goes, then the long side. Put those numbers on forward.'] },
      { id: '10d', k: 'build', b: { cols: 4, rows: 4, start: [0, 3], face: 'u', pen: true, drawn: true }, def: 'R4(Fx cw)', sol: 'M3 M1', need: 'M',
        text: 'Draw both squares. My block takes a number.',
        hint: ['Inside my block, forward goes the block\'s number.', 'Inside the star, tap the number on forward and choose the block\'s number. Then star 3 draws a big square, star 1 a small one.'],
        hint2: ['My block: repeat 4, forward, turn.', 'Make the star draw a square: repeat 4, forward by the block\'s number, turn clockwise. Then use it with 3, and with 1.'] },
      { id: '10e', k: 'predict', b: { cols: 5, rows: 5, start: [0, 4], face: 'u' }, def: 'Fx cw', prog: 'M3 M2', text: 'Where will it stop? The number goes into my block.' },
      { id: '10f', k: 'fix', b: { cols: 4, rows: 4, start: [0, 3], face: 'u', pen: true, drawn: true }, def: 'R4(F2 cw)', sdef: 'R4(Fx cw)', prog: 'M1 M3', sol: 'M1 M3', bug: 1, bugIn: 'M',
        text: 'Test it. Find the bug in my block. Fix it.' }] },
  { name: 'Buttons and events', icon: 'joystick', idea: 'When a button is pressed, its blocks run.',
    ideaSay: 'Games are made of events. The program waits. When a button is pressed, the blocks for that button run. Each button has its own little program.',
    blocks: ['F', 'cw', 'acw', 'R'],
    meet: [{ b: { cols: 5, rows: 3, start: [0, 0], face: 'r', goal: [2, 2] }, btns: { g: 'F', o: 'cw' }, press: 'g g o g g' }],
    items: [
      { id: '11a', k: 'events', b: { cols: 5, rows: 3, start: [0, 0], face: 'r', goal: [3, 2] }, btns: ['g', 'o'], press: 'g g g o g g', sol: { g: 'F', o: 'cw' },
        text: 'Green goes forward. Orange turns clockwise. Make them.',
        hint: ['Green: one forward. Orange: one clockwise turn.', 'Put one forward under the green button, and one clockwise turn under the orange button.'],
        hint2: ['Watch each press, one at a time.', 'Watch which button is pressed, and what the robot should do each time.'] },
      { id: '11b', k: 'drive', b: { cols: 5, rows: 4, start: [0, 3], face: 'u', gems: [[0, 1], [3, 0]], crates: [[2, 2]], goal: [4, 2] }, btns: { g: 'F', o: 'cw', p: 'acw' },
        text: 'Drive the robot! Get the gems, then the battery.' },
      { id: '11c', k: 'predict', b: { cols: 5, rows: 4, start: [0, 3], face: 'u' }, btns: { g: 'F F', o: 'cw' }, press: 'g o g', text: 'Where will it stop? Green does two forwards.' },
      { id: '11d', k: 'events', b: { cols: 5, rows: 5, start: [0, 4], face: 'u', goal: [2, 0] }, btns: ['g', 'o', 'p'], press: 'g o g p g', sol: { g: 'F F', o: 'cw', p: 'acw' },
        text: 'Each green press goes two squares. Make all three.',
        hint: ['Green: two forwards. Orange and purple: turns.', 'Green moves two squares each press. Orange turns clockwise. Purple turns anticlockwise.'],
        hint2: ['Watch each press, one at a time.', 'Watch which button is pressed, and where the robot should be after it.'] },
      { id: '11e', k: 'events', b: { cols: 4, rows: 4, start: [0, 0], face: 'r', goal: [2, 2] }, btns: ['g', 'o'], press: 'g g o g g', start: { g: 'F', o: 'acw' }, sol: { g: 'F', o: 'cw' }, bug: 'o',
        text: 'Test it. One button is wrong. Fix it.',
        hint: ['Watch the orange press closely.', 'Press Go and watch what the robot does when orange is pressed.'],
        hint2: ['Which way should orange turn?', 'After orange, the robot should face down the board. Which turn does that?'] },
      { id: '11f', k: 'events', b: { cols: 7, rows: 4, start: [0, 3], face: 'r', goal: [6, 0] }, btns: ['g', 'p'], press: 'g g p g', sol: { g: 'R3(F)', p: 'acw' },
        text: 'Green dashes three squares. Purple turns anticlockwise.',
        hint: ['Green: a repeat 3 with forward inside.', 'Each green press moves three squares. A repeat can do that in one go.'],
        hint2: ['Count the squares from one press to the next.', 'Count how far the robot goes for each green press. Then purple turns it anticlockwise.'] }] },
  { name: 'Real code', icon: 'keyboard', idea: 'Programmers type code. Each block is one line.',
    ideaSay: 'Real programmers type their programs as code. Here is the same program as blocks, and as code in a language called Python. Each block is one line. The lines inside a loop are pushed in, so you can see what is inside.',
    blocks: ['F', 'cw', 'acw', 'R', 'I', 'E', 'U'], sensors: ['wall', 'blue'], untils: ['goal', 'wall'], code: true,
    meet: [{ b: { cols: 4, rows: 4, start: [0, 3], face: 'u', pen: true }, prog: 'R4(F F cw)' }],
    items: [
      { id: '12a', k: 'code', prog: 'R3(F cw)', opts: ['R3(F acw)', 'R4(F cw)'], text: 'Which code matches the blocks? Tap it.' },
      { id: '12b', k: 'build', code: true, b: { cols: 5, rows: 3, start: [0, 0], face: 'r', goal: [2, 2] }, sol: 'F F cw F F', text: 'Build the blocks for this code. Then Go.',
        hint: ['Each line of code is one block.', 'Read the code from the top. Each line is one block, in the same order.'],
        hint2: ['forward() is the forward block.', 'forward is the forward block. turn_clockwise is the clockwise turn.'] },
      { id: '12c', k: 'predict', asCode: true, b: { cols: 5, rows: 4, start: [0, 3], face: 'u' }, prog: 'R3(F) cw F F', text: 'Read the code. Where will the robot stop?' },
      { id: '12d', k: 'code', prog: 'R5(F I(blue: cw))', opts: ['R5(F I(wall: cw))', 'R5(I(blue: cw) F)'], text: 'Which code matches the blocks? Tap it.' },
      { id: '12e', k: 'fixcode', b: { cols: 4, rows: 4, start: [0, 0], face: 'r', goal: [2, 2] }, prog: 'R2(F) acw R2(F)', bug: 2, text: 'Which line is the bug? Test it, then tap it.' },
      { id: '12f', k: 'build', code: true, b: { cols: 4, rows: 3, start: [0, 0], face: 'r', goal: [0, 2] }, sol: 'U(goal: E(wall: cw | F))', text: 'Build the blocks for this code. Then Go.',
        hint: ['while not is repeat until.', 'while not at battery is the repeat until block, asking: at the battery? Inside it goes an if or else.'],
        hint2: ['if blocked is if or else, asking: blocked?', 'if blocked is an if or else block with the question: blocked? Turn under if, forward under else.'] }] }
];
const CD_BUILT = CD_ST.filter(s => !s.soon).length;
/* a gift for her room at every station: things a programmer would have (shop shelf "Code Lab gifts") */
const CD_GIFTS = [['robot', 'Robot friend'], ['lady-beetle', 'The bug you caught'], ['joystick', 'Joystick'], ['desktop-computer', 'Computer'],
  ['light-bulb', 'Bright idea lamp'], ['vertical-traffic-light', 'Traffic light'], ['stopwatch', 'Stopwatch'], ['abacus', 'Abacus'],
  ['puzzle-piece', 'Puzzle piece'], ['level-slider', 'Sound slider'], ['video-game', 'Game controller'], ['laptop', 'Laptop']]
  .map((g, i) => ({ id: 'cdg-' + g[0], art: g[0], name: g[1], price: 0, cd: i + 1 }));
/* the path a program draws (the start, then every square it moves to): a shape marked drawn takes its dotted target from its own answer */
const cdPath = (b, prog, env) => [b.start.slice()].concat(cdSim(b, prog, null, env).trace.filter(s => s.nd.t === 'F' && !s.bump).map(s => [s.x, s.y]));
const cdEnvOf = d => d ? { defs: { M: cdParse(d) } } : null;
CD_ST.forEach(s => (s.items || []).forEach(it => {
  if (it.b && it.b.drawn) it.b.target = cdPath(it.b, cdParse(it.sol), cdEnvOf(it.sdef || it.def));
  if (typeof it.sol === 'string') it.best = it.best || cdCount(cdParse(it.sol)) + (it.sdef || it.def ? cdCount(cdParse(it.sdef || it.def)) : 0);
  else if (it.sol) it.best = it.best || Object.values(it.sol).reduce((a, p) => a + cdCount(cdParse(p)), 0); }));
const cdState = () => { if (!S.code || typeof S.code !== 'object') S.code = { st: 0, gold: {}, weak: {} }; if (!S.code.gold) S.code.gold = {}; if (!S.code.weak) S.code.weak = {}; return S.code; };

/* ---- running a program: every step the robot takes, where it is, and what happened ---- */
/* env: { defs: { M: [blocks of my own block] }, x: the number given to my own block } */
function cdSim(b, prog, from, env) {
  env = env || {};
  const crates = new Set((b.crates || []).map(c => c + '')), gems = new Set((b.gems || []).map(c => c + '')), blue = new Set((b.blue || []).map(c => c + '')), yellow = new Set((b.yellow || []).map(c => c + ''));
  let x = (from || b.start)[0], y = (from || b.start)[1], f = from && from.length > 2 ? from[2] : CD_FACE[b.face]; const trace = [], got = new Set(), edges = new Set();
  let bump = false, stuck = false, n = 0, checks = 0, count = 0;
  const blocked = () => { const nx = x + CD_DIR[f][0], ny = y + CD_DIR[f][1]; return nx < 0 || ny < 0 || nx >= b.cols || ny >= b.rows || crates.has(nx + ',' + ny); };
  const sense = c => c === 'wall' ? blocked() : c === 'gem' ? gems.has(x + ',' + y) : c === 'blue' ? blue.has(x + ',' + y) : c === 'yellow' ? yellow.has(x + ',' + y) : c === 'goal' ? !!b.goal && x === b.goal[0] && y === b.goal[1] : false;
  const ask = (nd, anc) => { checks++; const val = sense(nd.c); trace.push({ nd, anc, x, y, f, check: true, val }); return val; };
  const over = () => { if (n > 200 || checks > 300) stuck = true; return bump || stuck; };
  const walk = (list, anc, xv, depth) => { for (const nd of list) { if (over()) return;
      const a2 = anc.concat([nd]);
      if (nd.t === 'R') { const k = nd.n === 'c' ? count : nd.n; for (let j = 0; j < k && !over(); j++) walk(nd.body, a2, xv, depth); continue; }
      if (nd.t === 'I' || nd.t === 'E') { if (ask(nd, anc)) walk(nd.body, a2, xv, depth); else if (nd.t === 'E') walk(nd.alt, a2, xv, depth); continue; }
      if (nd.t === 'U') { for (let g = 0; !over(); g++) { if (ask(nd, anc)) break; if (g >= 60) { stuck = true; break; } walk(nd.body, a2, xv, depth); } continue; }
      if (nd.t === 'M') { n++; trace.push({ nd, anc, x, y, f, call: true }); if (!depth && env.defs && env.defs.M) walk(env.defs.M, a2, nd.n == null ? 1 : nd.n, 1); continue; }
      if (nd.t === 'C') { n++; count++; trace.push({ nd, anc, x, y, f, count }); continue; }
      if (nd.t === 'F') { const k = nd.n == null ? 1 : nd.n === 'x' ? (xv || 1) : nd.n;
        for (let j = 0; j < k; j++) { if (over()) return; n++; const nx = x + CD_DIR[f][0], ny = y + CD_DIR[f][1];
          if (blocked()) { bump = true; trace.push({ nd, anc, x, y, f, bump: true }); return; }
          if (b.pen) edges.add([[x, y], [nx, ny]].map(String).sort().join('|'));
          x = nx; y = ny; if (gems.has(x + ',' + y)) got.add(x + ',' + y); trace.push({ nd, anc, x, y, f }); }
        continue; }
      n++; f = (f + (nd.t === 'cw' ? 1 : 3)) % 4; trace.push({ nd, anc, x, y, f }); } };
  walk(prog, [], env.x, 0);
  return { trace, x, y, f, bump, stuck, count, got, edges, gems };
}
const cdEdgesOf = route => new Set(route.slice(1).map((c, i) => [route[i], c].map(String).sort().join('|')));
/* did it do the job? reached the battery, collected every gem, drew the shape */
function cdWin(b, r) {
  if (r.bump || r.stuck) return false;
  if (b.count != null && r.count !== b.count) return false;
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
    (b.target ? [...cdEdgesOf(b.target)].map(e => { const [a, z] = e.split('|').map(q => q.split(',').map(Number)); return '<line class="cd-target" x1="' + (a[0] + .5) + '" y1="' + (a[1] + .5) + '" x2="' + (z[0] + .5) + '" y2="' + (z[1] + .5) + '"/>'; }).join('') : '') + '<g class="cd-ink"></g></svg>' });
  grid.append(svg); const ink = svg.querySelector('.cd-ink');
  (b.blue || []).forEach(c => cells[c + ''].classList.add('t-blue')); (b.yellow || []).forEach(c => cells[c + ''].classList.add('t-yellow'));
  (b.crates || []).forEach(c => cells[c + ''].append(art('package', 'cd-crate')));
  const ctr = o.counter || b.count != null ? h('div', { class: 'cd-ctr', 'aria-label': 'Counter' }, ic('abacus'), h('b', null, '0')) : null;   /* placed by the caller, beside the program */
  const gemEls = {}; (b.gems || []).forEach(c => { const g = art('gem-stone', 'cd-gem'); gemEls[c + ''] = g; cells[c + ''].append(g); });
  if (b.goal) cells[b.goal + ''].append(art('battery', 'cd-goal'));
  const bot = h('div', { class: 'cd-bot', style: { width: (100 / W2) + '%', height: (100 / H2) + '%' } }, h('div', { class: 'cd-botin', html: CD_BOT }));
  grid.append(bot); wrap.append(grid);
  let ang = 0, flagEl = null;
  const B = {
    el: wrap, grid, cells, ctr,
    put(x, y, f, instant) { if (instant) bot.style.transition = 'none'; bot.style.left = (x * 100 / W2) + '%'; bot.style.top = (y * 100 / H2) + '%';
      if (f != null) { let d = ((f * 90 - ang) % 360 + 540) % 360 - 180; if (instant) ang = f * 90; else ang += d; bot.firstChild.style.transform = 'rotate(' + ang + 'deg)'; }
      if (instant) { void bot.offsetWidth; bot.style.transition = ''; } },
    bump() { bot.classList.remove('cd-bonk'); void bot.offsetWidth; bot.classList.add('cd-bonk'); },
    line(a, z) { ink.insertAdjacentHTML('beforeend', '<line x1="' + (a[0] + .5) + '" y1="' + (a[1] + .5) + '" x2="' + (z[0] + .5) + '" y2="' + (z[1] + .5) + '"/>'); },
    take(x, y) { const g = gemEls[x + ',' + y]; if (g) g.classList.add('got'); },
    counter(v) { if (!ctr) return; ctr.lastChild.textContent = v; ctr.classList.remove('bump'); void ctr.offsetWidth; if (v) ctr.classList.add('bump'); },
    reset() { ink.innerHTML = ''; B.counter(0); Object.values(gemEls).forEach(g => g.classList.remove('got')); $$('.cd-cell.stop,.cd-cell.num', grid).forEach(c => { c.classList.remove('stop', 'num'); c.removeAttribute('data-n'); }); B.put(b.start[0], b.start[1], CD_FACE[b.face], true); },
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
const CD_TXT = (t, w, fs) => '<svg viewBox="0 0 ' + (w || 24) + ' 24"><text x="' + ((w || 24) / 2) + '" y="17.5" text-anchor="middle" font-size="' + (fs || 15) + '" font-weight="700" fill="currentColor" font-family="Fredoka,sans-serif">' + t + '</text></svg>';
const CD_ICON = {
  F: '<svg viewBox="0 0 24 24"><path d="M12 3l7 8h-4.500v10h-5V11H5z" fill="currentColor"/></svg>',
  cw: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 0 8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 0l5 4-5 4z" fill="currentColor"/></svg>',
  acw: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 1-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 0l-5 4 5 4z" fill="currentColor"/></svg>',
  C: CD_TXT('+1'),
  /* if: the decision diamond of a flowchart, asking a question; if or else: the same diamond with its two ways out */
  I: '<svg viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor" font-family="Fredoka,sans-serif">?</text></svg>',
  E: '<svg viewBox="0 0 24 24"><path d="M12 1l8 8-8 8-8-8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><text x="12" y="13" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor" font-family="Fredoka,sans-serif">?</text><path d="M7 14l-4 7M17 14l4 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  M: '<svg viewBox="0 0 24 24"><path d="M12 2l2.900 6.600 7.100.6-5.400 4.700 1.600 7-6.200-3.700-6.200 3.700 1.600-7L2 9.200l7.100-.6z" fill="currentColor"/></svg>'
};
const CD_WORD = { F: 'forward', cw: 'turn ↻', acw: 'turn ↺', R: 'repeat', I: 'if', E: 'if or else', U: 'until', C: 'add 1', M: 'my block' };
const CD_SAY = { F: 'forward', cw: 'turn clockwise', acw: 'turn anticlockwise', R: 'repeat', I: 'if', E: 'if, or else', U: 'repeat until', C: 'add one to the counter', M: 'my own block' };
/* the questions a block can ask: [picture, short label, spoken] */
const CD_SENSE = { wall: ['brick', 'blocked', 'the way ahead is blocked'], gem: ['gem-stone', 'on a gem', 'the robot is on a gem'], blue: ['blue-square', 'on blue', 'the robot is on a blue square'],
  yellow: ['yellow-square', 'on yellow', 'the robot is on a yellow square'], goal: ['battery', 'at the battery', 'the robot is at the battery'] };
function cdEditor(allowed, o) {
  o = o || {}; const sensors = o.sensors || ['wall'], untils = o.untils || sensors;
  /* roots: the lists a program is made of. Usually one (the program); My own blocks adds the block's own list; Buttons and events has one list per button */
  const roots = (o.roots || [{ id: 'main' }]).map(r => Object.assign({ list: [] }, r));
  const mainRoot = () => roots.find(r => r.id === 'main') || roots[roots.length - 1], main = () => mainRoot().list;
  let cur = { list: main(), i: 0 }, sel = null, locked = !!o.locked, justDragged = false, pick = null;
  const els = new Map(), heads = new Map(), ends = new Map(), opts = new Map(), bodies = new Map(), rootEls = new Map(), keep = new Set();   /* keep: blocks marked to stay marked (the dashed suspects) */
  const strip = h('div', { class: 'cd-prog' + (locked ? ' ro' : '') + (roots.length > 1 || roots[0].label ? ' multi' : '') }), count = h('span', { class: 'cd-count' }), marker = h('i', { class: 'cd-drop' });
  const allTop = () => roots.flatMap(r => r.list);
  const parentOf = node => { const f = list => { for (let i = 0; i < list.length; i++) { if (list[i] === node) return { list, i }; for (const k of cdKids(list[i])) { const r = f(k); if (r) return r; } } return null; };
    for (const r of roots) { const p = f(r.list); if (p) return p; } return null; };
  const inTree = l => roots.some(r => r.list === l) || (function f(ls) { return ls.some(n => cdKids(n).some(k => k === l || f(k))); })(allTop());
  const ownerOf = l => { let o2 = null; const f = ls => ls.forEach(n => cdKids(n).forEach(k => { if (k === l) o2 = n; f(k); })); f(allTop()); return o2; };
  const rootOf = l => roots.find(r => r.list === l || (function f(ls) { return ls.some(n => cdKids(n).some(k => k === l || f(k))); })(r.list));
  /* my own block cannot be used inside itself */
  const fits = (node, l) => { const r = rootOf(l); return !(r && r.id === 'M' && cdFlat([node]).some(n => n.t === 'M')); };
  const changed = () => { if (o.onChange) o.onChange(); };
  const caret = () => h('i', { class: 'cd-caret' });
  const free = () => !locked && !o.onTap;
  const optFace = n => n.t === 'R' ? (n.n === 'c' ? ['×', ic('abacus')] : ['×' + n.n]) : n.t === 'U' ? [h('small', null, 'until'), ic(CD_SENSE[n.c][0])] : [ic(CD_SENSE[n.c][0]), h('span', null, '?')];
  const optSay = n => n.t === 'R' ? 'Repeat ' + (n.n === 'c' ? 'as many times as the counter says' : n.n + ' times') + '. Tap to choose' : (n.t === 'U' ? 'Until ' : 'If ') + CD_SENSE[n.c][2] + '. Tap to choose';
  const fnum = n => n.t === 'F' && n.n != null ? h('span', { class: 'cd-fn', 'data-fn': 1 }, n.n === 'x' ? '▢' : String(n.n)) : n.t === 'M' && n.n != null ? h('span', { class: 'cd-fn', 'data-fn': 1 }, String(n.n)) : null;
  const chip = n => {
    if (!CD_BOX[n.t]) { const b = h('button', { class: 'cd-b cd-' + n.t + (n === sel ? ' sel' : '') + (keep.has(n) ? ' suspect' : '') + (n.n != null ? ' has-n' : ''), 'aria-label': CD_SAY[n.t] + (n.n != null ? ' ' + (n.n === 'x' ? 'by the number' : n.n) : ''), html: CD_ICON[n.t] }); els.set(n, b);
      const fn = fnum(n); if (fn) b.append(fn);
      b.addEventListener('click', e => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap();
        if (fn && (e.target.closest('.cd-fn') || n === sel)) { openPick(n, b); return; }
        const p = parentOf(n); sel = n; cur = { list: p.list, i: p.i + 1 }; draw(); });
      b.addEventListener('pointerdown', e => startDrag(e, { node: n })); return b; }
    const head = h('button', { class: 'cd-rh' + (n === sel ? ' sel' : ''), 'aria-label': CD_SAY[n.t] }, n.t === 'R' || n.t === 'U' ? ic('repeat-button') : h('b', null, 'if'));
    const num = h('button', { class: 'cd-n', 'aria-label': optSay(n) }, optFace(n)), end = h('button', { class: 'cd-re', 'aria-label': 'After the ' + CD_WORD[n.t] });
    const conts = cdKids(n).map((k, j) => h('span', { class: 'cd-body' + (j ? ' alt' : '') }));
    const parts = [head, num, conts[0]]; if (n.t === 'E') parts.push(h('span', { class: 'cd-else' }, 'else'), conts[1]); parts.push(end);
    const box = h('span', { class: 'cd-rep cd-k-' + n.t + (n === sel ? ' sel' : '') + (keep.has(n) ? ' suspect' : '') }, parts); els.set(n, box); heads.set(n, head); ends.set(n, end); opts.set(n, num); bodies.set(n, conts);
    head.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); sel = n; cur = { list: n.body, i: n.body.length }; draw(); });
    head.addEventListener('pointerdown', e => startDrag(e, { node: n }));
    num.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); openPick(n, num); });
    end.addEventListener('click', () => { if (justDragged) return; if (o.onTap) return o.onTap(n); if (locked) return; sfx.tap(); const p = parentOf(n); sel = n; cur = { list: p.list, i: p.i + 1 }; draw(); });
    cdKids(n).forEach((k, j) => list(k, conts[j])); return box; };
  const list = (l, into) => { if (!locked && cur.list === l && cur.i === 0) into.append(caret()); l.forEach((n, i) => { into.append(chip(n)); if (!locked && cur.list === l && cur.i === i + 1) into.append(caret()); }); };
  function draw() {
    closePick(); if (!inTree(cur.list)) cur = { list: main(), i: main().length };
    els.clear(); heads.clear(); ends.clear(); opts.clear(); bodies.clear(); rootEls.clear(); strip.innerHTML = '';
    if (roots.length === 1 && !roots[0].label) { rootEls.set(roots[0].list, strip); list(roots[0].list, strip); if (!roots[0].list.length) strip.append(h('span', { class: 'cd-empty' }, locked ? '' : 'Tap or drag the blocks below')); }
    else roots.forEach(r => { const c = h('span', { class: 'cd-rlist' }); rootEls.set(r.list, c); list(r.list, c); if (!r.list.length && !locked) c.append(h('span', { class: 'cd-empty' }, r.hint || 'Drag blocks here'));
      strip.append(h('div', { class: 'cd-root', 'data-root': r.id }, h('span', { class: 'cd-rl' }, r.icon ? ic(r.icon) : null, r.label || ''), c)); });
    const nb = roots.reduce((a, r) => a + cdCount(r.list), 0);
    count.textContent = nb + (o.max ? ' of ' + o.max : '') + ' blocks'; count.classList.toggle('over', !!o.max && nb > o.max); }
  const total = () => roots.reduce((a, r) => a + cdCount(r.list), 0);
  const newNode = t => t === 'R' ? { t: 'R', n: 2, body: [] } : t === 'I' ? { t: 'I', c: sensors[0], body: [] } : t === 'E' ? { t: 'E', c: sensors[0], body: [], alt: [] }
    : t === 'U' ? { t: 'U', c: untils.includes('goal') ? 'goal' : untils[0], body: [] } : t === 'F' && o.fnum ? { t: 'F', n: 1 } : t === 'M' && o.mnum ? { t: 'M', n: 1 } : { t };
  const add = t => { if (locked) return; const n = newNode(t); if (total() >= 30 || !fits(n, cur.list)) { sfx.soft(); return; } sfx.tap(); cur.list.splice(cur.i, 0, n); sel = n; cur = CD_BOX[t] ? { list: n.body, i: 0 } : { list: cur.list, i: cur.i + 1 }; draw(); changed(); };
  /* ✕ takes off the chosen block; with none chosen, the block just before the pink line, or the last one */
  const del = () => { if (locked || !total()) return; sfx.tap(); let p = sel ? parentOf(sel) : null;
    if (!p) p = cur.i > 0 && inTree(cur.list) ? { list: cur.list, i: cur.i - 1 } : main().length ? { list: main(), i: main().length - 1 } : null;
    if (!p) { const r = roots.slice().reverse().find(r2 => r2.list.length); if (!r) return; p = { list: r.list, i: r.list.length - 1 }; }
    p.list.splice(p.i, 1); sel = null; cur = { list: p.list, i: p.i }; if (!inTree(cur.list)) cur = { list: main(), i: main().length }; draw(); changed(); };

  /* every place a block can go: each gap in each list, as points on the screen. A gap between two blocks on different rows gets a point at both */
  const gaps = (exclude, node) => { const out = [], pt = (el, side) => { const r = el.getBoundingClientRect(); return { x: side === 'l' ? r.left - 2 : r.right + 2, y: r.top + r.height / 2, h: r.height }; };
    const startOf = n => CD_BOX[n.t] ? heads.get(n) : els.get(n), endOf = n => CD_BOX[n.t] ? ends.get(n) : els.get(n);
    const walk = (l, cont) => { if (node && !fits(node, l)) { l.forEach(n => { if (CD_BOX[n.t] && n !== exclude) cdKids(n).forEach((k, j) => walk(k, bodies.get(n)[j])); }); return; }
      if (!l.length) { const r = cont.getBoundingClientRect(); out.push({ list: l, i: 0, x: r.left + 8, y: r.top + r.height / 2, h: Math.max(30, r.height) }); }
      for (let i = 0; i < l.length; i++) { out.push(Object.assign({ list: l, i }, pt(startOf(l[i]), 'l'))); if (i > 0) out.push(Object.assign({ list: l, i }, pt(endOf(l[i - 1]), 'r'))); }
      if (l.length) out.push(Object.assign({ list: l, i: l.length }, pt(endOf(l[l.length - 1]), 'r')));
      l.forEach(n => { if (CD_BOX[n.t] && n !== exclude) cdKids(n).forEach((k, j) => walk(k, bodies.get(n)[j])); }); };
    roots.forEach(r => walk(r.list, rootEls.get(r.list))); return out; };
  const nearest = (x, y, exclude, node) => { let best = null, bd = 1e9; gaps(exclude, node).forEach(g => { const d = Math.abs(x - g.x) + 3 * Math.max(0, Math.abs(y - g.y) - g.h / 2); if (d < bd) { bd = d; best = g; } }); return best; };
  /* tapping a gap (not a block) puts the pink line there */
  strip.addEventListener('click', e => { if (justDragged || !free() || e.target.closest('button')) return; const g = nearest(e.clientX, e.clientY); if (!g) return; sfx.tap(); sel = null; cur = { list: g.list, i: g.i }; draw(); });

  /* dragging. src: { node } a block in the program, or { t } a new block from the bottom row */
  function startDrag(e, src) {
    if (!free() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.target.closest && e.target.closest('.cd-fn')) return;
    const sx = e.clientX, sy = e.clientY, probe = src.node || newNode(src.t); let on = false, ghost = null, target = null, off = false, lit = null;
    const light = n => { if (lit === n) return; if (lit && els.get(lit)) els.get(lit).classList.remove('into'); lit = n; if (n && els.get(n)) els.get(n).classList.add('into'); };
    const move = ev => {
      if (!on) { if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return; on = true; closePick(); ghost = ghostOf(src); document.body.append(ghost);
        if (src.node && els.get(src.node)) els.get(src.node).classList.add('dragging'); strip.classList.add('dropping'); strip.append(marker); }
      ev.preventDefault(); ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
      const r = strip.getBoundingClientRect(), pad = 28; off = ev.clientX < r.left - pad || ev.clientX > r.right + pad || ev.clientY < r.top - pad || ev.clientY > r.bottom + pad;
      target = off ? null : nearest(ev.clientX, ev.clientY, src.node, probe); ghost.classList.toggle('bin', off && !!src.node);
      if (target) { marker.style.display = 'block'; marker.style.left = (target.x - r.left + strip.scrollLeft - 2) + 'px'; marker.style.top = (target.y - r.top + strip.scrollTop - Math.min(target.h, 46) / 2) + 'px'; marker.style.height = Math.min(target.h, 46) + 'px'; light(roots.some(q => q.list === target.list) ? null : ownerOf(target.list)); }
      else { marker.style.display = 'none'; light(null); } };
    const end = (ev, cancel) => {
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', cancelled);
      if (!on) return; justDragged = true; setTimeout(() => { justDragged = false; }, 0);
      ghost.remove(); marker.remove(); strip.classList.remove('dropping'); light(null);
      if (cancel) { draw(); return; }
      if (src.node) { const p = parentOf(src.node);
        if (off) { p.list.splice(p.i, 1); sel = null; cur = { list: p.list, i: p.i }; sfx.tap(); }   /* dropped off the program: taken off */
        else if (target) { p.list.splice(p.i, 1); let i = target.i; if (target.list === p.list && p.i < i) i--; target.list.splice(i, 0, src.node); sel = src.node; cur = { list: target.list, i: i + 1 }; sfx.pop(); }
      } else if (target) { if (total() >= 30) { sfx.soft(); draw(); return; }
        const n = probe; target.list.splice(target.i, 0, n); sel = n; cur = CD_BOX[n.t] ? { list: n.body, i: 0 } : { list: target.list, i: target.i + 1 }; sfx.pop(); }
      draw(); changed(); };
    const up = ev => end(ev, false), cancelled = ev => end(ev, true);
    document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', cancelled);
  }
  const ghostOf = src => { const t = src.node ? src.node.t : src.t, nd = src.node || newNode(t);
    return h('div', { class: 'cd-ghost' }, CD_BOX[t] ? h('span', { class: 'cd-rep cd-k-' + t }, h('span', { class: 'cd-rh' }, t === 'R' || t === 'U' ? ic('repeat-button') : h('b', null, 'if')), h('span', { class: 'cd-n' }, optFace(nd)), src.node && cdCount(cdKids(nd).flat()) ? h('span', { class: 'cd-more' }, '+' + cdKids(nd).reduce((a, k) => a + cdCount(k), 0)) : null)
      : h('span', { class: 'cd-b cd-' + t, html: CD_ICON[t] }), ic('wastebasket', 'cd-bin')); };

  /* the picker of a box: a repeat's number (2 to 9, or the counter), a question for if and until; a forward's number (1 to 9, or my block's number) */
  function closePick() { if (pick) { pick.remove(); pick = null; document.removeEventListener('pointerdown', outsidePick, true); } }
  function outsidePick(e) { if (pick && !pick.contains(e.target)) closePick(); }
  function openPick(n, anchor) {
    closePick(); const r = anchor.getBoundingClientRect();
    const inM = (rootOf(parentOf(n).list) || {}).id === 'M';
    const choices = n.t === 'R' ? [2, 3, 4, 5, 6, 7, 8, 9].concat(o.counter ? ['c'] : []) : n.t === 'F' || n.t === 'M' ? [1, 2, 3, 4, 5, 6, 7, 8, 9].concat(n.t === 'F' && inM && o.xnum ? ['x'] : []) : n.t === 'U' ? untils : sensors;
    const isNum = n.t === 'R' || n.t === 'F' || n.t === 'M', now = isNum ? n.n : n.c;
    const face = k => k === 'c' ? [ic('abacus'), h('small', null, 'counter')] : k === 'x' ? [h('b', null, '▢'), h('small', null, "block's number")] : isNum ? String(k) : [ic(CD_SENSE[k][0]), h('small', null, CD_SENSE[k][1])];
    pick = h('div', { class: 'cd-pick' + (isNum ? '' : ' words'), role: 'dialog', 'aria-label': isNum ? 'How many?' : 'Which question?' }, h('small', null, n.t === 'R' ? 'How many times?' : isNum ? 'How many squares?' : n.t === 'U' ? 'Repeat until…' : 'If…'),
      h('div', { class: 'cd-pick-row' + (choices.length < 4 ? ' few' : '') }, choices.map(k => h('button', { class: 'cd-pk' + (k === now ? ' on' : '') + (typeof k === 'string' && isNum ? ' wide' : ''), 'data-n': k, 'aria-label': isNum ? (k === 'c' ? 'The counter' : k === 'x' ? "My block's number" : k + (n.t === 'R' ? ' times' : '')) : CD_SENSE[k][2],
        onclick: () => { if (isNum) n.n = k; else n.c = k; sfx.pop(); if (!isNum) Speech.say((n.t === 'U' ? 'Until ' : 'If ') + CD_SENSE[k][2] + '.'); sel = n; draw(); changed(); } }, face(k)))));
    document.body.append(pick);
    const pw = pick.offsetWidth, ph = pick.offsetHeight; let top = r.bottom + 6; if (top + ph > innerHeight - 6) top = Math.max(6, r.top - ph - 6);
    pick.style.left = Math.max(6, Math.min(innerWidth - pw - 6, r.left + r.width / 2 - pw / 2)) + 'px'; pick.style.top = top + 'px';
    setTimeout(() => { if (pick) document.addEventListener('pointerdown', outsidePick, true); }, 0);
    const watch = setInterval(() => { if (!strip.isConnected || !pick) { clearInterval(watch); closePick(); } }, 400); }

  const pal = h('div', { class: 'cd-pal' }, allowed.map(t => { const b = h('button', { class: 'cd-pb cd-' + t, 'data-t': t, 'aria-label': CD_SAY[t], onclick: () => { if (!justDragged) add(t); } }, t === 'R' || t === 'U' ? ic('repeat-button') : h('span', { class: 'cd-pi', html: CD_ICON[t] }), h('small', null, CD_WORD[t]));
    b.addEventListener('pointerdown', e => startDrag(e, { t })); return b; }));
  const E = {
    strip, pal, count, roots, get prog() { return main(); }, list: id => (roots.find(r => r.id === id) || {}).list,
    env: () => { const m = roots.find(r => r.id === 'M'); return m ? { defs: { M: m.list } } : {}; },
    text: () => roots.length === 1 ? cdText(main()) : roots.map(r => r.id + '=' + cdText(r.list)).join('; '),
    total,
    set(p, more) { roots.forEach(r => { r.list = more && more[r.id] ? cdClone(more[r.id]) : r.id === 'main' || roots.length === 1 ? cdClone(p || []) : []; }); keep.clear(); cur = { list: main(), i: main().length }; sel = null; draw(); },
    suspect(nodes) { nodes.forEach(n => n && keep.add(n)); draw(); },
    clear() { E.set([]); },
    lock(on) { locked = on; strip.classList.toggle('ro', !!on); pal.classList.toggle('off', !!on); draw(); },
    hi(nd, anc) { $$('.run', strip).forEach(e => e.classList.remove('run')); [nd].concat(anc || []).forEach(n => { const e = els.get(n); if (e) e.classList.add('run'); }); },
    flash(nd, val) { const e = opts.get(nd); if (!e) return; e.classList.remove('yes', 'no'); void e.offsetWidth; e.classList.add(val ? 'yes' : 'no'); setTimeout(() => e.classList.remove('yes', 'no'), W.fast ? 5 : 700); },
    mark(nd, cls) { const e = els.get(nd); if (e) e.classList.add(cls); },
    unmark() { $$('.run,.bumped,.gone,.done', strip).forEach(e => e.classList.remove('run', 'bumped', 'gone', 'done')); },
    el(nd) { return els.get(nd); },
    add, del, max(m) { o.max = m; draw(); }
  };
  draw(); return E;
}

/* run a program on the board, step by step, lighting each block as it runs. Resolves with what happened */
async function cdRun(ui, B, E, b, prog, o) {
  o = o || {}; const r = cdSim(b, prog, o.from, o.env || (E && E.env ? E.env() : null)); let steps = o.upto != null ? r.trace.slice(0, o.upto) : r.trace;
  if (r.stuck) steps = steps.slice(0, 40);   /* a loop that never ends: show a little of it, then say so */
  let px = (o.from || b.start)[0], py = (o.from || b.start)[1];
  for (const s of steps) { if (!ui.alive) return r; E && E.hi(s.nd, s.anc);
    if (s.check) { if (E) E.flash(s.nd, s.val); sfx.tap(); await ui.wait(W.fast ? 2 : o.slow ? 560 : 300); continue; }   /* an if or until asks its question: a tick or a cross on its block */
    if (s.call) { sfx.pop(); await ui.wait(W.fast ? 2 : 260); continue; }
    if (s.count != null) { B.counter(s.count); sfx.pop(); await ui.wait(W.fast ? 2 : o.slow ? 560 : 340); continue; }
    if (s.bump) { B.put(s.x, s.y, s.f); sfx.bonk(); B.bump(); if (E) E.mark(s.nd, 'bumped'); await ui.wait(W.fast ? 5 : 500); break; }
    if (b.pen && (s.x !== px || s.y !== py)) B.line([px, py], [s.x, s.y]);
    B.put(s.x, s.y, s.f); if (s.nd.t === 'F') { sfx.step(); B.take(s.x, s.y); } else sfx.tap(); px = s.x; py = s.y;
    await ui.wait(W.fast ? 2 : o.slow ? 650 : 380); }
  if (E) $$('.run', E.strip).forEach(e => e.classList.remove('run'));
  return Object.assign(r, { shown: steps.length });
}

/* ---- REAL CODE (station 12): any program as Python, line by line. Each line remembers its block, so a line lights as its block runs ---- */
const CD_PYQ = { wall: 'blocked()', gem: 'on_gem()', blue: 'on_blue()', yellow: 'on_yellow()', goal: 'at_battery()' };
function cdPy(prog, def) {
  const out = [], line = (d, t, nd) => out.push({ d, t, nd: nd || null }), num = n => n === 'c' ? 'counter' : n === 'x' ? 'n' : String(n);
  const walk = (list, d) => { if (!list.length) line(d, 'pass'); list.forEach(nd => {
    if (nd.t === 'F') line(d, 'forward(' + (nd.n == null ? '' : num(nd.n)) + ')', nd);
    else if (nd.t === 'cw') line(d, 'turn_clockwise()', nd); else if (nd.t === 'acw') line(d, 'turn_anticlockwise()', nd);
    else if (nd.t === 'C') line(d, 'counter = counter + 1', nd); else if (nd.t === 'M') line(d, 'my_block(' + (nd.n == null ? '' : num(nd.n)) + ')', nd);
    else if (nd.t === 'R') { line(d, 'for i in range(' + num(nd.n) + '):', nd); walk(nd.body, d + 1); }
    else if (nd.t === 'I') { line(d, 'if ' + CD_PYQ[nd.c] + ':', nd); walk(nd.body, d + 1); }
    else if (nd.t === 'E') { line(d, 'if ' + CD_PYQ[nd.c] + ':', nd); walk(nd.body, d + 1); line(d, 'else:'); walk(nd.alt, d + 1); }
    else if (nd.t === 'U') { line(d, 'while not ' + CD_PYQ[nd.c] + ':', nd); walk(nd.body, d + 1); } }); };
  if (def && def.length) { line(0, 'def my_block(' + (cdFlat(def).some(n => n.n === 'x') ? 'n' : '') + '):'); walk(def, 1); line(0, ''); }
  if (cdUses(prog.concat(def || [])).has('C')) line(0, 'counter = 0');
  walk(prog, 0); return out;
}
/* colour a line the way a code editor does: keywords, names that are called, numbers */
const cdPyHtml = t => t.replace(/\b(for|in|range|if|else|while|not|def|pass)\b|([a-z_]+)(?=\()|\b(\d+)\b/g, (m, k, f, n) => k ? '<b class="kw">' + k + '</b>' : f ? '<b class="fn">' + f + '</b>' : '<b class="nm">' + n + '</b>');
/* the code on screen. o.tap(line index): lines become buttons. Works as the "editor" for cdRun: hi, flash, mark, strip */
function cdCodeView(lines, o) {
  o = o || {}; const el = h('div', { class: 'cd-code', 'aria-label': 'The program as Python code' }), byNode = new Map(), rows = [];
  lines.forEach((l, i) => { const tag = o.tap && l.nd ? 'button' : 'div';
    const r = h(tag, { class: 'cd-ln', 'data-i': i, 'aria-label': o.tap && l.nd ? 'Line ' + (i + 1) : null }, h('i', null, String(i + 1)), h('span', { class: 't', style: { 'padding-left': (l.d * 2) + 'ch' }, html: cdPyHtml(l.t) || '&nbsp;' }));
    if (o.tap && l.nd) r.addEventListener('click', () => o.tap(i));
    if (l.nd && !byNode.has(l.nd)) byNode.set(l.nd, r); rows.push(r); el.append(r); });
  const V = { el, rows, lines, strip: el,
    hi(nd) { $$('.run', el).forEach(e => e.classList.remove('run')); const r = byNode.get(nd); if (r) r.classList.add('run'); },
    flash(nd, val) { const r = byNode.get(nd); if (!r) return; r.classList.remove('yes', 'no'); void r.offsetWidth; r.classList.add(val ? 'yes' : 'no'); setTimeout(() => r.classList.remove('yes', 'no'), W.fast ? 5 : 700); },
    mark(nd, cls) { const r = byNode.get(nd); if (r) r.classList.add(cls); }, line: i => rows[i], env: () => o.env || null };
  return V;
}
/* blocks and code side by side, lighting together (the meet of station 12) */
const cdBoth = (E, V, box) => ({ strip: box, hi(n, a) { E.hi(n, a); V.hi(n); }, flash(n, v) { E.flash(n, v); V.flash(n, v); }, mark(n, c) { E.mark(n, c); V.mark(n, c); }, env: () => E.env() });

/* ---- BUTTONS AND EVENTS (station 11): the buttons, the presses the game will make, and running them ---- */
function cdPad(ks, onPress) {
  const el = h('div', { class: 'cd-pad' }), bs = {};
  ks.forEach(k => { const b = h('button', { class: 'cd-btn', 'data-btn': k, style: { '--c': CD_BTN[k][1] }, 'aria-label': 'The ' + CD_BTN[k][2] + ' button', disabled: !onPress }); if (onPress) b.addEventListener('click', () => onPress(k)); bs[k] = b; el.append(b); });
  return { el, bs, flash(k) { const b = bs[k]; if (!b) return; b.classList.remove('press'); void b.offsetWidth; b.classList.add('press'); setTimeout(() => b.classList.remove('press'), W.fast ? 5 : 450); }, on(v) { Object.values(bs).forEach(b => { b.disabled = !v; }); } };
}
function cdPressRow(presses) {
  const dots = presses.map(k => h('i', { class: 'cd-pr', style: { '--c': CD_BTN[k][1] }, 'aria-label': CD_BTN[k][2] }));
  const el = h('div', { class: 'cd-presses', 'aria-label': 'The buttons the game will press, in order' }, h('small', null, 'Presses:'), dots);
  return { el, at(i) { dots.forEach((d, j) => { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i); }); }, clear() { dots.forEach(d => d.classList.remove('on', 'done')); } };
}
/* run the presses one at a time: the button goes down, its blocks run from where the robot is. Resolves with the whole run (as one program, for the check) */
async function cdRunPresses(ui, B, E, b, presses, lists, pad, row) {
  let at = null;
  for (let i = 0; i < presses.length; i++) { if (!ui.alive) return null; const k = presses[i]; if (row) row.at(i); if (pad) pad.flash(k); sfx.tap(); await ui.wait(W.fast ? 2 : 420);
    const r = await cdRun(ui, B, E, b, lists[k], { from: at }); if (r.bump || r.stuck) { if (row) row.at(-1); return Object.assign(cdSim(b, presses.slice(0, i + 1).flatMap(q => lists[q])), { at: i }); }
    at = [r.x, r.y, r.f]; await ui.wait(W.fast ? 2 : 200); }
  if (row) row.at(presses.length);
  return cdSim(b, presses.flatMap(q => lists[q]));
}

/* what a shown program is made of, for predicting: the blocks (with my block's list, or a list per button, when the puzzle has them) */
function cdShown(it, st) {
  if (it.btns && it.press) { const ks = Object.keys(it.btns), E = cdEditor([], { locked: true, roots: cdBtnRoots(ks) }), more = {};
    ks.forEach(k => { more[k] = cdParse(it.btns[k]); }); E.set([], more); E.lock(true); const presses = it.press.split(' ');
    return { E, prog: presses.flatMap(k => E.list(k)), env: null, presses }; }
  const E = cdEditor([], { locked: true, roots: it.def ? CD_MROOTS : null }); E.set(cdParse(it.prog), it.def ? { M: cdParse(it.def) } : null); E.lock(true);
  return { E, prog: E.prog, env: E.env() };
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

/* ---- BUILD (and FIX): she builds (or mends) a program until the robot does the job.
   From station 5 a puzzle can have two boards (bs): one program must work on both, which is what if, until and counters are for.
   Go runs it on board 1, then board 2. The help ladder for two boards: what went wrong and on which board; then make it work on board 1 first (or the idea, said plainly, when board 1 already works);
   then the idea again in other words, with the failing board's squares counted out. A puzzle of plain steps and repeats still breaks into parts with flags, as before ---- */
const cdOpts = st => ({ sensors: st.sensors, untils: st.untils, counter: st.counter, fnum: st.fnum, mnum: st.mnum, xnum: st.xnum, roots: st.roots });
const cdSimple = it => !it.bs && !it.def && !it.code && [...cdUses(cdParse(it.sol))].every(u => ['F', 'cw', 'acw', 'R'].includes(u));
const cdWhy = (b, r) => r.bump ? 'bump' : r.stuck ? 'stuck' : r.got.size < r.gems.size ? 'gem' : b.goal && !(r.x === b.goal[0] && r.y === b.goal[1]) ? 'stop' : b.count != null && r.count !== b.count ? 'count' : 'shape';
function cdBuild(ui, it, st) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const boards = it.bs || [it.b], b0 = boards[0], multi = boards.length > 1, simple = cdSimple(it), E = cdEditor(st.blocks, Object.assign(cdOpts(st), { max: it.max }));
    const counter = st.blocks.includes('C');
    let B = null, bi = 0, misses = 0, shortMiss = 0, phase = 'full', running = false, legs = null, leg = 0, here = null, helped = false, numsOn = false;
    const holder = h('div', { class: 'cd-bwrap' }), ctrSlot = h('span', { class: 'cd-ctrs' });
    const tabs = multi ? h('div', { class: 'cd-tabs' }, boards.map((bb, k) => h('button', { class: 'cd-tab', 'data-b': k, 'aria-label': 'Board ' + (k + 1), onclick: () => { if (running) return; sfx.tap(); show(k); } }, 'Board ' + (k + 1), ic('check-mark-button', 'cd-tok')))) : null;
    function show(k) { bi = k; B = cdBoard(boards[k], { counter }); holder.innerHTML = ''; holder.append(B.el); ctrSlot.innerHTML = ''; if (B.ctr) ctrSlot.append(B.ctr);
      if (tabs) $$('.cd-tab', tabs).forEach((t, j) => t.classList.toggle('on', j === k)); if (numsOn && !simple && boards[k].goal) B.nums(cdRoute(boards[k]).slice(1)); }
    const okTab = (k, on) => { if (tabs) $$('.cd-tab', tabs)[k].classList.toggle('ok', on); };
    show(0);
    /* station 12: the code to build, above the board; a line that does not match yet is marked */
    const want = it.code ? cdPy(cdParse(it.sol)) : null, CV = want ? cdCodeView(want) : null;
    ui.stage.append(multi ? h('div', { class: 'cd-multi' }, tabs, holder) : CV ? h('div', { class: 'cd-multi' }, CV.el, holder) : holder);
    const route = cdRoute(b0);
    if (it.k === 'fix') E.set(cdParse(it.prog), it.def ? { M: cdParse(it.def) } : null);
    const box = h('div', { class: 'cd-edit' }, h('div', { class: 'cd-ph' }, E.strip, ctrSlot, E.count), cdControls(E, () => go()));
    ui.answer.append(box);
    const base = () => it.text;
    ui.prompt(base(), (it.say || it.text) + (it.k === 'fix' ? ' Press Go to test it first.' : ' Then press Go.') + (multi ? ' Go runs it on board 1, then on board 2.' : ''));
    const hook = () => { W.cur = { type: 'act', cd: it.id, phase, auto: () => solve(), miss: () => wrong(), prog: () => E.text(), fill: () => E.set(cdParse(it.sol), it.sdef || it.def ? { M: cdParse(it.sdef || it.def) } : null) }; };   /* prog: what is built, for the drag test */
    /* for the tests: put in a right program for this part, or a wrong one, and press Go */
    const solve = () => { if (running) return; if (phase === 'legs') E.set(cdLegProg(route, here, route[legs[leg]])); else E.set(cdParse(it.sol), it.sdef || it.def ? { M: cdParse(it.sdef || it.def) } : null); go(); };
    const wrong = () => { if (running) return; const p = cdParse(it.sol); p.pop(); E.set(p.length ? p : [{ t: 'cw' }]); go(); };
    async function go() {
      if (running) return; if (!E.total()) { sfx.soft(); ui.prompt('Add some blocks first. Then Go.', 'Tap or drag some blocks to build the program first. Then press Go.'); return; }
      running = true; W.cur = null; E.lock(true); E.unmark();
      const limit = it.max && phase !== 'free' && phase !== 'legs';
      if (limit && E.total() > it.max) { await miss('long'); return; }
      if (it.need && !cdUses(E.prog).has(it.need)) { await miss('need'); return; }
      if (CV) { $$('.diff', CV.el).forEach(e => e.classList.remove('diff')); const got = cdPy(E.prog).map(l => l.t), i = want.findIndex((l, j) => l.t !== got[j]), j = i < 0 && got.length > want.length ? want.length : i;
        if (j >= 0) { await miss('code', { line: j }); return; } }
      if (phase === 'legs') {
        B.reset(); if (here) { B.put(here.at[0], here.at[1], here.f, true); B.flag(route[legs[leg]]); }
        B.nums(numsOn ? route.slice(legs[leg - 1] != null ? legs[leg - 1] + 1 : 1, legs[leg] + 1) : null);
        const r = await cdRun(ui, B, E, b0, E.prog, { from: here ? [here.at[0], here.at[1], here.f] : null }); ui.check();
        const to = route[legs[leg]]; if (!r.bump && r.x === to[0] && r.y === to[1]) return partDone(r); return miss(r.bump ? 'bump' : 'stop', r, 0);
      }
      const list = phase === 'one' ? [0] : boards.map((x, k) => k);
      for (const k of list) {
        if (multi) { show(k); await ui.wait(W.fast ? 2 : 350); } else B.reset();
        const r = await cdRun(ui, B, E, boards[k], E.prog); ui.check();
        if (!cdWin(boards[k], r)) return miss(cdWhy(boards[k], r), r, k);
        okTab(k, true); if (multi && k < list[list.length - 1]) { sfx.good(); await ui.wait(W.fast ? 2 : 600); }
      }
      if (phase === 'one') return oneDone();
      return win();
    }
    async function miss(why, r, k) {
      misses++; helped = true; sfx.soft(); if (phase === 'short') shortMiss++; k = k || 0;
      if (tabs) $$('.cd-tab', tabs).forEach((t, j) => { if (j >= k) t.classList.remove('ok'); });
      const tell = (t, s) => Promise.race([ui.prompt(t, s), wait(4200)]);
      const on = multi ? 'Board ' + (k + 1) + ': ' : '', onS = multi ? 'On board ' + (k + 1) + ', ' : '';
      /* never stuck: after many tries, or two more in the make-it-short part, it comes back at the end of the station */
      if (misses >= 8 || shortMiss >= 2) { await tell(shortMiss >= 2 ? 'It works! We will make it shorter later.' : 'Good trying! We will come back to this one.', shortMiss >= 2 ? 'Your program works. We will come back and make it shorter later.' : 'Good trying. We will come back to this one at the end.'); ui.check();
        W.cur = null; ui.help(false); cdTick(false, it); return res(false); }
      const bk = boards[k];
      if (why === 'need') await tell('Use my block, the star, in the program.', 'The program needs to use my block, the star block. Put the steps inside the star, then use the star in the program.');
      else if (why === 'code') { const ln = CV.line(Math.min(r.line, want.length - 1)); if (ln) ln.classList.add('diff');
        await tell(r.line >= want.length ? 'Your blocks have more lines than the code.' : 'Line ' + (r.line + 1) + ' is not the same yet.', r.line >= want.length ? 'Your blocks make more lines than the code has. Take off the extra blocks.' : 'Line ' + (r.line + 1) + ' of the code is not the same as your blocks yet. Look at it again.'); }
      else if (why === 'long') await tell('Too many blocks. Use ' + it.max + ' or fewer.', 'That program has too many blocks. Use ' + it.max + ' blocks or fewer. Look for blocks that repeat.');
      else if (why === 'bump') await tell(on + 'it bumped after the red block.', onS + 'the robot bumped into something after the red block. Fix the program, then press Go.');
      else if (why === 'stuck') await tell(on + 'it never stopped. What ends the loop?', onS + 'the robot kept going and never stopped. Look at the loop. What makes it stop?');
      else if (why === 'gem') await tell(on + 'it missed a gem. Every gem, then the battery.', onS + 'the robot missed a gem. It must collect every gem, then reach the battery.');
      else if (why === 'count') await tell(on + 'the counter says ' + r.count + '. It should say ' + bk.count + '.', onS + 'the counter says ' + r.count + ', but it should say ' + bk.count + '. Add one each time, and only when it should.');
      else if (why === 'shape') await tell('The lines are not the dotted shape yet.', 'The lines it drew are not the same as the dotted shape. Follow the dots with your finger, then fix the program.');
      else { if (r) B.stop(r.x, r.y); await tell(on + 'it stopped on the red square.', onS + 'the robot stopped on the red square. That is not where it needs to be. Fix the program, then press Go.'); }
      ui.check();
      /* the second miss: break it down */
      if (misses === 2 && phase === 'full') {
        if (it.max) { phase = 'free'; E.max(0); ui.help(true); await tell('Make it work first, with any number of blocks.', 'Let us make it work first, with as many blocks as you like. Then we will make it short.'); }
        else if (it.k === 'fix' && it.bugIn === 'M') { ui.help(true); await tell('The bug is inside my block.', 'Here is a clue. The program is fine. The bug is inside my block, the star. Test it again and watch my block.'); }
        else if (it.k === 'fix') { const half = Math.ceil(cdFlat(cdParse(it.prog)).length / 2), inFirst = it.bug < half;
          ui.help(true); await tell('The bug is in the ' + (inFirst ? 'first' : 'second') + ' half of the program.', 'Here is a clue. The bug is in the ' + (inFirst ? 'first' : 'second') + ' half of the program. Test it again and watch that part.'); }
        else if (simple) { legs = cdCorners(route); if (legs.length > 1) { phase = 'legs'; leg = 0; here = { at: route[0].slice(), f: CD_FACE[b0.face] }; E.clear(); B.reset(); B.flag(route[legs[0]]); ui.help(true);
            await tell('First, just get to the flag.', 'Let us do it in parts. First, build a program that gets the robot to the flag. Then press Go.'); } }
        else if (multi && k === 0) { phase = 'one'; ui.help(true); await tell('First, make it work on board 1.', 'Let us take it one board at a time. First make it work on board 1. ' + (it.hint ? it.hint[1] : '')); }
        else { ui.help(true); await tell(it.hint ? it.hint[0] : 'Watch it again, block by block.', it.hint ? it.hint[1] : 'Watch it again, block by block.'); }
      }
      /* the third: count it out, or the idea in other words */
      else if (misses >= 3 && phase !== 'short') { numsOn = true; ui.help(true);
        if (phase === 'legs') { B.nums(route.slice(legs[leg - 1] != null ? legs[leg - 1] + 1 : 1, legs[leg] + 1)); await tell('Count the numbered squares. Then build it.', 'Count the numbered squares to the flag. Each forward moves one square.'); }
        else if (it.k === 'fix') { const p = cdParse(it.prog), inM = it.bugIn === 'M', fl = cdFlat(inM ? cdParse(it.def) : p).length, lo = Math.max(0, Math.min(it.bug, fl) - 1); E.set(p, it.def ? { M: cdParse(it.def) } : null); const f2 = cdFlat(inM ? E.list('M') : E.prog); E.suspect([f2[lo], f2[lo + 1]]);
          await tell('Back to the start. The bug is one of the dashed blocks.', 'Here is the program as it started. The bug is in one of the two blocks with a dashed line. Test it, and watch them.'); }
        else if (!simple) { const hh = it.hint2 || it.hint; await tell(hh ? hh[0] : 'Count the numbered squares. Then fix it.', (hh ? hh[1] + ' ' : '') + (bk.goal ? 'The numbered squares show the way.' : '')); }
        else { B.reset(); B.nums(route.slice(1)); await tell('Count the numbered squares. Each forward moves one.', 'Count the numbered squares on the way. Each forward moves the robot one square. Then build it.'); } }
      running = false; E.lock(false);
      if (multi) show(k); else if (here && phase === 'legs') B.put(here.at[0], here.at[1], here.f, true); else { B.reset(); if (numsOn && phase !== 'legs' && (simple ? !b0.target : !!b0.goal)) B.nums(simple ? route.slice(1) : cdRoute(b0).slice(1)); }
      if (phase === 'legs') B.flag(route[legs[leg]]);
      ui.prompt(phase === 'legs' ? 'Get to the flag. Then Go.' : phase === 'free' ? 'Make it work, any length. Then Go.' : phase === 'one' ? 'Make it work on board 1. Then Go.' : base(), ' ');
      hook();
    }
    async function oneDone() {
      sfx.good(); phase = 'both'; await Promise.race([ui.prompt('Board 1 works! Now make it work on board 2 too.', 'Board 1 works! Now change the program so the same program works on board 2 too. ' + (it.hint ? it.hint[1] : '')), wait(4200)]); ui.check();
      show(1); running = false; E.lock(false); hook();
    }
    async function partDone(r) {
      sfx.good(); here = { at: [r.x, r.y], f: r.f }; leg++; E.clear(); B.flag(null); B.nums(null);
      if (leg < legs.length) { await Promise.race([ui.prompt('Yes! Now from here to the next flag.', 'Yes! Now build the next part, from here to the next flag.'), wait(2600)]); ui.check(); B.flag(route[legs[leg]]); }
      else { phase = 'whole'; here = null; numsOn = false; ui.help(false); await Promise.race([ui.prompt('Every part done! Now the whole trip in one go.', 'You did every part. Now build the whole trip in one program.'), wait(3200)]); ui.check(); B.reset(); }
      running = false; E.lock(false); hook();
    }
    async function win() {
      if (phase === 'free') { sfx.good(); phase = 'short'; E.max(it.max); ui.help(true);
        await Promise.race([ui.prompt('It works! Now make it ' + it.max + ' blocks. Find what repeats.', 'It works! Now make it shorter: ' + it.max + ' blocks or fewer. Look at your program. Which blocks happen again and again? Put them once, inside repeat.'), wait(5200)]); ui.check();
        running = false; E.lock(false); B.reset(); hook(); return; }
      W.cur = null; ui.help(false); const n = E.total(), gold = n <= it.best;
      cdTick(!helped, it); sfx.great(); confetti(24); kiwiMood(ui.root, 'cheer');
      if (gold) { const st2 = cdState(); if (!st2.gold[it.id]) CDS.gold++; st2.gold[it.id] = 1; ui.stage.append(h('div', { class: 'cd-gear' }, ic('gear'), h('b', null, 'Fewest blocks!'))); }
      const both = multi ? (boards.length === 2 ? ' On both boards!' : ' On every board!') : '';
      await Promise.race([ui.prompt(gold ? 'It works, in the fewest blocks! A gold gear.' : 'It works!' + (multi ? both : ' ' + n + ' blocks.'), gold ? 'It works, and in the fewest blocks. A gold gear for you!' + both : 'It works!' + both + ' Can you find a shorter way next time?'), wait(3000)]); ui.check();
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
function cdPredict(ui, it, st) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    /* the program shown as blocks (with my block, or the buttons and their presses), or as code (station 12): either one lights as the robot runs */
    const sh = cdShown(it, st), b = it.b, prog = sh.prog, env = sh.env, B = cdBoard(b, { pick: true, counter: cdUses(prog).has('C') });
    const V = it.asCode ? cdCodeView(cdPy(prog), { env }) : null, X = V || sh.E, row = sh.presses ? cdPressRow(sh.presses) : null;
    ui.stage.append(row ? h('div', { class: 'cd-multi' }, row.el, h('div', { class: 'cd-bwrap' }, B.el)) : B.el);
    ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' + (V ? ' code' : '') }, V ? V.el : sh.E.strip, B.ctr || null)));
    const run = o => sh.presses ? cdRunSome(o) : cdRun(ui, B, X, b, prog, Object.assign({ env }, o || {}));
    /* with presses, the robot runs press by press and the press lights; with upto, it stops part way */
    const cdRunSome = async o => { const lists = {}; Object.keys(it.btns).forEach(k => { lists[k] = sh.E.list(k); }); if (!o || o.upto == null) return cdRunPresses(ui, B, sh.E, b, sh.presses, lists, null, row);
      return cdRun(ui, B, sh.E, b, prog, o); };
    const full = cdSim(b, prog, null, env), cells = Object.values(B.cells), ans = cells.findIndex(c => +c.dataset.x === full.x && +c.dataset.y === full.y);
    let miss = 0, busy = false, shown = 0;
    const pick = async i => { const c = cells[i]; if (busy || c.disabled) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); c.classList.add('ok'); cdTick(miss === 0, it); B.reset(); if (row) row.clear(); await run(); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); c.classList.add('gone'); c.disabled = true;
      if (miss === 1) await Promise.race([ui.prompt(V ? 'Read each line. Point at each square.' : 'Follow each block with your finger.', V ? 'Not there. Read the code one line at a time, and point to where the robot is after each line.' : 'Not there. Follow each block with your finger. Forward moves one square the way the robot faces. A turn turns it on the spot.'), wait(4200)]);
      else { /* run part of the way, so the rest is shorter */ const rest = full.trace.length - shown, k = Math.max(1, Math.floor(rest / 2)); B.reset(); shown = Math.min(full.trace.length - 1, shown + k);
        await cdRun(ui, B, X, b, prog, { upto: shown, slow: true, env }); X.hi(null); full.trace.slice(0, shown).forEach(s2 => X.mark(s2.nd, 'done'));
        await Promise.race([ui.prompt(V ? 'It has done the grey lines. Where now?' : 'It has done the grey blocks. Where now?', 'The robot has done the grey ' + (V ? 'lines' : 'blocks') + '. Follow the rest from here. Where will it stop?'), wait(4200)]); }
      ui.check(); busy = false; hook(); };
    cells.forEach((c, i) => c.addEventListener('click', () => pick(i)));
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: cells.length, item: it.id, give: i => { if (cells[i].disabled) i = ans; pick(i); } }; };
    ui.prompt(it.text, it.text + (V ? ' Read the code first, line by line.' : ' Read the program first, block by block.')); hook();
  });
}

/* ---- BUG: which block is the bug? She can test the program as often as she likes (on each board), then taps the block. Blocks inside a box count too ---- */
function cdBug(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const boards = it.bs || [it.b], prog = cdParse(it.prog), counter = cdUses(prog).has('C'); let miss = 0, busy = false, B = null;
    const E = cdEditor([], { locked: true, onTap: n => pick(cdFlat(E.prog).indexOf(n)) }); E.set(prog); E.lock(true);
    const flat = () => cdFlat(E.prog), holder = h('div', { class: 'cd-bwrap' }), ctrSlot = h('span', { class: 'cd-ctrs' });
    const show = k => { B = cdBoard(boards[k], { counter }); holder.innerHTML = ''; holder.append(B.el); ctrSlot.innerHTML = ''; if (B.ctr) ctrSlot.append(B.ctr); if (tabs) $$('.cd-tab', tabs).forEach((t, j) => t.classList.toggle('on', j === k)); };
    const tabs = boards.length > 1 ? h('div', { class: 'cd-tabs' }, boards.map((bb, k) => h('button', { class: 'cd-tab', 'data-b': k, onclick: () => { if (busy) return; sfx.tap(); show(k); } }, 'Board ' + (k + 1)))) : null;
    show(0);
    const test = h('button', { class: 'btn quiet cd-test', 'data-k': 'test', onclick: async () => { if (busy) return; busy = true; sfx.tap();
      for (let k = 0; k < boards.length; k++) { if (tabs) { show(k); await ui.wait(W.fast ? 2 : 300); } else B.reset(); await cdRun(ui, B, E, boards[k], E.prog, { slow: true }); if (!ui.alive) return; await ui.wait(W.fast ? 2 : 500); }
      busy = false; } }, ic('play-button'), 'Test it');
    ui.stage.append(tabs ? h('div', { class: 'cd-multi' }, tabs, holder) : holder); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip, ctrSlot), h('div', { class: 'cd-run' }, test)));
    const pick = async i => { const nd = flat()[i], el = E.el(nd); if (busy || !el || el.classList.contains('gone')) return; busy = true; W.cur = null;
      if (i === it.bug) { sfx.pop(); el.classList.add('ok'); cdTick(miss === 0, it); await Promise.race([ui.prompt('Found it! That block was the bug.', 'You found it. That block was the bug.'), wait(2600)]); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); el.classList.add('gone');
      await Promise.race([ui.prompt(miss === 1 ? 'Not that one. Test it, and watch closely.' : 'Watch where it first goes wrong.', miss === 1 ? 'That block is fine. Press Test it, and watch the robot closely.' : 'Press Test it again. Watch for the first block where the robot goes the wrong way.'), wait(3800)]);
      ui.check(); busy = false; hook(); };
    const hook = () => { W.cur = { type: 'choice', answer: it.bug, n: flat().length, item: it.id, give: i => { const el = E.el(flat()[i]); if (!el || el.classList.contains('gone')) i = it.bug; pick(i); } }; };
    ui.prompt(it.text, 'Which block is the bug? Press Test it to watch the robot. Then tap the block that is wrong.'); hook();
  });
}

/* ---- COUNT: what will the counter say? She taps a number. A miss crosses it out; another runs part of the program with the counter showing ---- */
function cdCountQ(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, B = cdBoard(b, { counter: true }), E = cdEditor([], { locked: true }); E.set(cdParse(it.prog)); E.lock(true); const prog = E.prog;
    const full = cdSim(b, prog), ans = full.count, nums = shuffle([ans].concat(it.opts)); let miss = 0, busy = false, shown = 0;
    const row = h('div', { class: 'cd-nums' }), btns = nums.map((v, i) => { const bt = h('button', { class: 'cd-numb', 'data-i': i, onclick: () => choose(i) }, String(v)); row.append(bt); return bt; });
    ui.stage.append(B.el); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip, B.ctr), row));
    const choose = async i => { if (busy || btns[i].disabled) return; busy = true; W.cur = null;
      if (nums[i] === ans) { sfx.pop(); btns[i].classList.add('ok'); cdTick(miss === 0, it); B.reset(); await cdRun(ui, B, E, b, prog); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); btns[i].classList.add('gone'); btns[i].disabled = true;
      if (miss === 1) await Promise.race([ui.prompt('Follow the blocks. Count each add 1.', 'Not that number. Follow the blocks with your finger, and count each time the robot does add 1.'), wait(4200)]);
      else { B.reset(); shown = Math.min(full.trace.length - 1, shown + Math.max(1, Math.floor((full.trace.length - shown) / 2))); await cdRun(ui, B, E, b, prog, { upto: shown, slow: true }); E.hi(null);
        await Promise.race([ui.prompt('Here is part of it. What will it say at the end?', 'The robot has done part of the program. Look at the counter. What will it say at the end?'), wait(4200)]); }
      ui.check(); busy = false; hook(); };
    const hook = () => { const a = nums.indexOf(ans); W.cur = { type: 'choice', answer: a, n: nums.length, item: it.id, give: i => { if (btns[i].disabled) i = a; choose(i); } }; };
    ui.prompt(it.text, it.text + ' Read the program, block by block.'); hook();
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
/* ---- EVENTS: she gives each button its blocks. Go makes the presses shown above the board, one at a time; each press runs that button's blocks from where the robot is.
   The help ladder: what went wrong (and after which press); then the idea in other words; then the presses watched slowly, one at a time ---- */
function cdEvents(ui, it, st) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, presses = it.press.split(' '), E = cdEditor(st.blocks, { roots: cdBtnRoots(it.btns) }), pad = cdPad(it.btns), row = cdPressRow(presses);
    const parsed = o => { const m = {}; Object.keys(o).forEach(k => { m[k] = cdParse(o[k]); }); return m; };
    if (it.start) E.set([], parsed(it.start));
    let B = cdBoard(b), misses = 0, running = false, helped = false;
    const holder = h('div', { class: 'cd-bwrap' }, B.el);
    ui.stage.append(h('div', { class: 'cd-multi' }, h('div', { class: 'cd-evtop' }, row.el, pad.el), holder));
    ui.answer.append(h('div', { class: 'cd-edit' }, h('div', { class: 'cd-ph' }, E.strip, E.count), cdControls(E, () => go())));
    ui.prompt(it.text, it.text + (it.start ? ' Press Go to test it first.' : ' Then press Go. The game presses the buttons shown, in order.'));
    const lists = () => { const l = {}; it.btns.forEach(k => { l[k] = E.list(k); }); return l; };
    const hook = () => { W.cur = { type: 'act', cd: it.id, phase: 'full', auto: () => { if (running) return; E.set([], parsed(it.sol)); go(); }, miss: () => { if (running) return; const w = parsed(it.sol); w[it.btns[0]] = []; E.set([], w); go(); }, prog: () => E.text(), fill: () => E.set([], parsed(it.sol)) }; };
    async function go() {
      if (running) return; if (!E.total()) { sfx.soft(); ui.prompt('Add some blocks first. Then Go.', 'Give the buttons some blocks first. Then press Go.'); return; }
      running = true; W.cur = null; E.lock(true); E.unmark(); B.reset();
      const r = await cdRunPresses(ui, B, E, b, presses, lists(), pad, row); ui.check(); if (!r) return;
      if (cdWin(b, r)) return win();
      misses++; helped = true; sfx.soft(); const tell = (t, s2) => Promise.race([ui.prompt(t, s2), wait(4200)]);
      if (misses >= 8) { await tell('Good trying! We will come back to this one.', 'Good trying. We will come back to this one at the end.'); ui.check(); W.cur = null; cdTick(false, it); return res(false); }
      const after = r.at != null ? 'press ' + (r.at + 1) : 'the last press';
      if (r.bump) await tell('It bumped on ' + after + '.', 'The robot bumped into something on ' + after + '. Which button was that? Fix its blocks.');
      else { B.stop(r.x, r.y); await tell('It stopped on the red square.', 'After every press, the robot stopped on the red square. That is not the battery. Fix the buttons, then press Go.'); }
      ui.check();
      if (misses === 2) { ui.help(true); await tell(it.hint[0], it.hint[1]); ui.check(); }
      else if (misses >= 3) { ui.help(true); await tell(it.hint2[0], it.hint2[1]); ui.check(); }
      running = false; E.lock(false); B.reset(); row.clear(); ui.prompt(it.text, ' '); hook();
    }
    async function win() {
      W.cur = null; ui.help(false); const n = E.total(), gold = n <= it.best; cdTick(!helped, it); sfx.great(); confetti(24); kiwiMood(ui.root, 'cheer');
      if (gold) { const s2 = cdState(); if (!s2.gold[it.id]) CDS.gold++; s2.gold[it.id] = 1; ui.stage.append(h('div', { class: 'cd-gear' }, ic('gear'), h('b', null, 'Fewest blocks!'))); }
      await Promise.race([ui.prompt(gold ? 'Every press worked, in the fewest blocks!' : 'Every press worked!', gold ? 'Every press did the right thing, in the fewest blocks. A gold gear for you!' : 'Every press did the right thing!'), wait(3000)]); ui.check();
      await ui.wait(W.fast ? 5 : 500); res(!helped);
    }
    hook();
  });
}
/* ---- DRIVE: the buttons already have their blocks. She presses them to drive the robot: every gem, then the battery. A bump sends it back to the start;
   after two bumps the squares of a way through are numbered ---- */
function cdDrive(ui, it, st) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, ks = Object.keys(it.btns), E = cdEditor([], { locked: true, roots: cdBtnRoots(ks) }), more = {}; ks.forEach(k => { more[k] = cdParse(it.btns[k]); }); E.set([], more); E.lock(true);
    const B = cdBoard(b), route = cdRoute(b); let done = [], at = null, busy = false, bumps = 0, presses = 0, driving = false;
    const pad = cdPad(ks, k => press(k));
    ui.stage.append(B.el); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph' }, E.strip)), h('div', { class: 'cd-drive' }, pad.el));
    ui.prompt(it.text, it.text + ' Each button does the blocks under it. Look at them first.');
    async function press(k) {
      if (busy) return; busy = true; W.cur = null; presses++;
      pad.flash(k); const r = await cdRun(ui, B, E, b, E.list(k), { from: at }); ui.check();
      if (r.bump) { bumps++; sfx.soft(); await Promise.race([ui.prompt('Bumped! Back to the start.', 'Bump! The robot goes back to the start. Look where it is facing before you press.'), wait(3000)]); ui.check();
        done = []; at = null; B.reset(); if (bumps >= 2) { B.nums(route.slice(1)); ui.help(true); ui.prompt('Follow the numbered squares.', 'Follow the numbered squares. Look which way the robot faces, then press.'); } busy = false; hook(); return; }
      done.push(k); at = [r.x, r.y, r.f];
      const all = cdSim(b, done.flatMap(q => E.list(q)));
      if (cdWin(b, all)) { W.cur = null; ui.help(false); cdTick(bumps === 0, it); sfx.great(); confetti(30); kiwiMood(ui.root, 'cheer');
        await Promise.race([ui.prompt('You drove it there! ' + done.length + ' presses.', 'You drove the robot to every gem and the battery, in ' + done.length + ' presses.'), wait(3000)]); ui.check(); await ui.wait(W.fast ? 5 : 500); return res(bumps === 0); }
      if (presses > 60) { W.cur = null; await Promise.race([ui.prompt('Good driving! We will come back to this one.', 'Good driving. We will come back to this one at the end.'), wait(3000)]); ui.check(); cdTick(false, it); return res(false); }
      busy = false; hook();
    }
    /* for the tests: the presses of the shortest way, from the start (each button does one block) */
    const plan = () => { const blk = {}; ks.forEach(k => { blk[it.btns[k]] = k; }); return cdLegProg(route, { at: b.start, f: CD_FACE[b.face] }, route[route.length - 1]).map(n => blk[n.t]); };
    const hook = () => { W.cur = { type: 'act', cd: it.id, phase: 'drive', auto: async () => { if (driving) return; driving = true; if (done.length || at) { done = []; at = null; B.reset(); } for (const k of plan()) { while (busy) await wait(20); await press(k); if (!ui.alive) return; } }, miss: () => {}, prog: () => done.join(' ') }; };
    hook();
  });
}
/* ---- CODE: which code matches the blocks? Three programs as code; a miss crosses one out; another marks the first line of the other wrong one that does not match ---- */
function cdCodeQ(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const E = cdEditor([], { locked: true }); E.set(cdParse(it.prog)); E.lock(true);
    const list = shuffle([it.prog].concat(it.opts)), ans = list.indexOf(it.prog), right = cdPy(cdParse(it.prog)); let miss = 0, busy = false;
    const views = list.map(p => cdCodeView(cdPy(cdParse(p)))), btns = views.map((v, i) => h('button', { class: 'cd-copt', 'data-i': i, 'aria-label': 'Code ' + (i + 1), onclick: () => choose(i) }, v.el));
    ui.stage.append(h('div', { class: 'cd-codeq' }, h('div', { class: 'cd-ph' }, E.strip))); ui.answer.append(h('div', { class: 'cd-copts' }, btns));
    const choose = async i => { if (busy || btns[i].disabled) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); btns[i].classList.add('ok'); cdTick(miss === 0, it); await Promise.race([ui.prompt('Yes! Each block is one line.', 'Yes. Each block is one line of that code.'), wait(2400)]); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); btns[i].classList.add('gone'); btns[i].disabled = true;
      if (miss === 1) await Promise.race([ui.prompt('Match each block to a line, top to bottom.', 'Not that one. Take the blocks one at a time, and find each one as a line of code, from the top.'), wait(4200)]);
      else { const j = btns.findIndex((bt, q) => q !== ans && !bt.disabled); if (j >= 0) { const v = views[j], k = v.lines.findIndex((l, q) => !right[q] || l.t !== right[q].t); const ln = v.line(k < 0 ? v.lines.length - 1 : k); if (ln) ln.classList.add('diff'); }
        await Promise.race([ui.prompt('The dashed line does not match a block.', 'Look at the dashed line. It does not match the blocks. Which code is left?'), wait(4200)]); }
      ui.check(); busy = false; hook(); };
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: list.length, item: it.id, give: i => { if (btns[i].disabled) i = ans; choose(i); } }; };
    ui.prompt(it.text, it.text + ' Read each block, then each line of code.'); hook();
  });
}
/* ---- FIX THE CODE: which line is the bug? She tests it as often as she likes, then taps the line ---- */
function cdFixCode(ui, it) {
  return new Promise(res => {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const b = it.b, prog = cdParse(it.prog), flat = cdFlat(prog), bugNode = flat[it.bug]; let B = cdBoard(b), miss = 0, busy = false;
    const V = cdCodeView(cdPy(prog), { tap: i => pick(i) }), ans = V.lines.findIndex(l => l.nd === bugNode);
    const test = h('button', { class: 'btn quiet cd-test', 'data-k': 'test', onclick: async () => { if (busy) return; busy = true; sfx.tap(); B.reset(); await cdRun(ui, B, V, b, prog, { slow: true }); if (!ui.alive) return; busy = false; } }, ic('play-button'), 'Test it');
    ui.stage.append(h('div', { class: 'cd-multi' }, h('div', { class: 'cd-bwrap' }, B.el), test)); ui.answer.append(h('div', { class: 'cd-edit ro' }, h('div', { class: 'cd-ph code' }, V.el)));   /* Test it under the board, so the code's lines have the room */
    const pick = async i => { const r = V.line(i); if (busy || !r || r.classList.contains('gone')) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); r.classList.add('ok'); cdTick(miss === 0, it); await Promise.race([ui.prompt('Found it! That line was the bug.', 'You found it. That line of code was the bug.'), wait(2600)]); ui.check(); await ui.good(null); return res(miss === 0); }
      miss++; sfx.soft(); r.classList.add('gone');
      await Promise.race([ui.prompt(miss === 1 ? 'Not that line. Test it, and watch.' : 'Watch where it first goes wrong.', miss === 1 ? 'That line is fine. Press Test it, and watch which line lights when the robot goes wrong.' : 'Press Test it again. Watch the line that is lit when the robot first goes the wrong way.'), wait(3800)]);
      ui.check(); busy = false; hook(); };
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: V.lines.length, item: it.id, give: i => { const r = V.line(i); if (!r || r.tagName !== 'BUTTON' || r.classList.contains('gone')) i = ans; pick(i); } }; };
    ui.prompt(it.text, 'Which line of code is the bug? Press Test it to watch the robot. Then tap the line that is wrong.'); hook();
  });
}
const cdAsk = (ui, it, st) => it.k === 'build' || it.k === 'fix' ? cdBuild(ui, it, st) : it.k === 'predict' ? cdPredict(ui, it, st) : it.k === 'bug' ? cdBug(ui, it) : it.k === 'count' ? cdCountQ(ui, it)
  : it.k === 'events' ? cdEvents(ui, it, st) : it.k === 'drive' ? cdDrive(ui, it, st) : it.k === 'code' ? cdCodeQ(ui, it) : it.k === 'fixcode' ? cdFixCode(ui, it) : cdShape(ui, it);

/* ---- MEET: the station's idea, shown by the robot. Watch it as often as she likes ---- */
async function cdMeet(ui, n) {
  const st = CD_ST[n - 1];
  for (const m of st.meet) {
    ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const boards = m.bs || [m.b], defs = d => d ? { M: cdParse(d) } : null, counter = st.blocks.includes('C');
    /* buttons (station 11): one list per button, and the presses; my own block (9, 10): two lists; real code (12): the blocks and the code side by side */
    const ks = m.btns ? Object.keys(m.btns) : null, presses = m.press ? m.press.split(' ') : null;
    const E = cdEditor([], { locked: true, roots: ks ? cdBtnRoots(ks) : m.def || m.fdef ? st.roots : null });
    const fill = (p, d) => { if (ks) { const more = {}; ks.forEach(k => { more[k] = cdParse(m.btns[k]); }); E.set([], more); } else E.set(cdParse(p), defs(d)); E.lock(true); };
    fill(m.prog, m.def);
    let B = null, V = null; const holder = h('div', { class: 'cd-bwrap' }), lbl = h('span', { class: 'cd-blbl' }), ctrSlot = h('span', { class: 'cd-ctrs' }), codeSlot = h('div', { class: 'cd-codeslot' });
    const pad = ks ? cdPad(ks) : null, row = presses ? cdPressRow(presses) : null;
    const show = k => { B = cdBoard(boards[k], { counter }); holder.innerHTML = ''; holder.append(B.el); ctrSlot.innerHTML = ''; if (B.ctr) ctrSlot.append(B.ctr); lbl.textContent = boards.length > 1 ? 'Board ' + (k + 1) : ''; };
    const code = () => { if (!st.code) return; V = cdCodeView(cdPy(E.prog, E.list('M'))); codeSlot.innerHTML = ''; codeSlot.append(V.el); };
    show(0); code();
    const ph = h('div', { class: 'cd-ph' + (st.code ? ' both' : '') }, E.strip, ctrSlot, st.code ? codeSlot : null), ed = h('div', { class: 'cd-edit ro' }, ph);
    ui.stage.append(h('div', { class: 'cd-meet' }, h('div', { class: 'cd-idea' }, art(st.icon), h('b', null, st.idea), lbl), ks ? h('div', { class: 'cd-evtop' }, row.el, pad.el) : null, holder)); ui.answer.append(ed);
    await Promise.race([ui.prompt(st.idea, st.ideaSay), wait(9000)]); ui.check();
    const X = () => V ? cdBoth(E, V, ph) : E;
    const runAll = async () => { for (let k = 0; k < boards.length; k++) { show(k); await ui.wait(W.fast ? 2 : 300);
        if (ks) { const lists = {}; ks.forEach(q => { lists[q] = E.list(q); }); row.clear(); await cdRunPresses(ui, B, E, boards[k], presses, lists, pad, row); }
        else await cdRun(ui, B, X(), boards[k], E.prog, { slow: true });
        ui.check(); if (k < boards.length - 1) await ui.wait(W.fast ? 2 : 700); } };
    const play = async () => { fill(m.prog, m.def); code(); await runAll();
      if (m.fixed) { await Promise.race([ui.prompt(m.after, m.afterSay || m.after), wait(4500)]); ui.check(); fill(m.fixed, m.fdef || m.def); code(); await runAll(); } };
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
  W.cur = null; const st = CD_ST[n - 1], S0 = cdState(), first = S0.st < n, items = st.items.slice(), missed = [];
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
  const pool = CD_ST.slice(0, n - 1).flatMap(s => s.items.filter(it => it.k === 'predict' || it.k === 'shape' || it.k === 'count').map(it => [it, s])), weak = cdState().weak;
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
  if (n === CD_BUILT) { const all = CD_BUILT === CD_ST.length; await Promise.race([ui.prompt(all ? 'Every station! You are a programmer!' : 'Every station so far! More are coming.', all ? 'You have done every Code Lab station. You can write real code now. You are a programmer!' : 'You have done every Code Lab station so far. More stations are coming soon.'), wait(4000)]); ui.check(); }
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
      all ? (CD_BUILT === CD_ST.length ? 'Every station done! Play any again.' : 'Every station so far! Play any again.') : 'Tap station ' + n + ': ' + CD_ST[n - 1].name.toLowerCase() + '.',
      all ? (CD_BUILT === CD_ST.length ? 'You have done every Code Lab station. Tap any station to play it again.' : 'You have done every Code Lab station so far. More are coming soon. Tap any station to play it again.') : (S0.st ? 'Tap the pink chip, station ' + n + ', to go on. You can play a station you have done again.' : 'Welcome to the Code Lab! Here you learn to program a robot. Tap the first chip to start.'));
    ui.check(); await run(); ui.check();
  }
}
SCREENS.code = () => {
  const ui = makeUI(() => go('map'), ''); show(ui.root); ui.root.classList.add('c-cd');
  (async () => { try { await cdHome(ui); } catch (e) { if (e !== ABORT) { console.error(e); throw e; } } })();
};
W.code = { cdAskOne: (ui, it, st) => cdAsk(ui, it, st), cdPy, cdPath, CD_BTN, cdEditor, cdBuild, cdPredict, cdBug, cdShape, cdCountQ, cdMeet, cdStation, CD_ST, CD_GIFTS, CD_BUILT, CD_SENSE, cdParse, cdCount, cdText, cdSim, cdWin, cdRoute, cdCorners, cdLegProg, cdState, cdShapeSvg, cdFlat, cdUses };
