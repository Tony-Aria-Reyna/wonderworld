/* ===== skills: question generators.
   Each returns a question, the smaller steps used to re-teach it, and a one-line explanation.
   Levels 1-8 run roughly from NZ Curriculum Year 1 to Year 8.

   HOW WE TEACH (see "How WonderWorld teaches" in the plan). The game never says or shows an answer.
   1. A missed question is broken into smaller steps, each one answerable from the picture.
   2. A missed step becomes hands-on: a tool she works herself (tap to count, share out, hop along, turn the pointer).
      The game counts along, but the last number is always hers to say.
   3. If that does not land, she gets an easier question.
   So: every number step lists its hands-on tools, and no step picture prints the step's own answer. ===== */
const SKILLS = {};
/* a number step: words, answer, picture, spoken line, hands-on tools for when it is missed (in order), and optionally a tool she starts with */
const N = (text, answer, visual, say, hands, pre) => ({ type: 'num', text, say: say || text, answer, visual, hands: hands || [], pre: pre || null });
const C = (text, options, answer, visual, say) => ({ type: 'choice', text, say: say || text, options, answer, visual });
const cap1 = t => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------- the hands-on tools (drawn by HANDS in 04-acts.js) ---------- */
const places = b => Array(Math.floor(b / 100)).fill(100).concat(Array(Math.floor(b % 100 / 10)).fill(10), Array(b % 10).fill(1));
const LAST = ' The last number is yours to say.';
const H = {
  /* tap each thing to count it */
  count: (n, o) => Object.assign({ k: 'tap', start: 0, steps: Array(n).fill(1), text: 'Tap each one to count.', say: 'Tap each one, and count with me.' + LAST, ask: 'How many did you count?', askSay: 'How many did you count? You say the last number.' }, o),
  /* n lots of "by": count in steps */
  skip: (n, by, rows) => ({ k: 'tap', start: 0, steps: Array(n).fill(by), signed: true, rows: !!rows, text: rows ? 'Tap each row. Count in ' + by + 's.' : 'Tap each ' + by + '. Count in ' + by + 's.', say: 'Each one is a lot of ' + by + '. Tap them one at a time, and count in ' + by + 's with me.' + LAST, ask: 'What number comes last?', askSay: 'You counted in ' + by + 's. What number comes last?' }),
  /* a + b: count on from a in hundreds, tens and ones */
  on(a, b) { let st = places(b); if (st.length === 1 && st[0] > 1) st = Array(10).fill(st[0] / 10);
    return { k: 'tap', start: a, steps: st, signed: true, text: 'Start at ' + a + '. Tap to count on.', say: 'Start at ' + a + '. Tap each one, and count on with me.' + LAST, ask: 'What number comes last?', askSay: 'You counted on from ' + a + '. What number comes last?' }; },
  /* a - b: count back from a */
  back(a, b) { let st = places(b); if (st.length === 1 && st[0] > 1) st = Array(10).fill(st[0] / 10);
    return { k: 'tap', start: a, steps: st.map(x => -x), signed: true, text: 'Start at ' + a + '. Tap to count back.', say: 'Start at ' + a + '. Tap each one, and count back with me.' + LAST, ask: 'What number comes last?', askSay: 'You counted back from ' + a + '. What number comes last?' }; },
  /* how far from a to b: hop one at a time, then count the hops */
  gap: (a, b) => ({ k: 'tap', start: a, steps: Array(Math.abs(b - a)).fill(b > a ? 1 : -1), signed: true, tally: true, text: 'Hop from ' + a + ' to ' + b + '. Tap each hop.', say: 'Hop from ' + a + ' to ' + b + ', one at a time. Then count how many hops you made.', ask: 'How many hops?', askSay: 'Count your hops. How many did it take?' }),
  /* b things, k already used: count the rest */
  rest: (b, k) => ({ k: 'tap', start: 0, pre: k, steps: Array(b - k).fill(1), text: k + ' are used. Tap the rest.', say: 'The grey ones are used up. Tap the rest, and count with me.' + LAST, ask: 'How many did you tap?', askSay: 'How many did you tap? You say the last number.' }),
  /* share n things fairly between some groups */
  deal: (n, groups, icon, ask) => ({ k: 'deal', n, groups, icon: icon || 'red-apple', ask: ask || 'How many in one group?' }),
  /* count the sides or corners of a shape by touching each */
  spots: (n, mode, name) => ({ k: 'spots', n, mode, name }),
  /* turn the pointer herself */
  turn: o => Object.assign({ k: 'turn' }, o),
  /* work it on the picture itself (HANDS.pic). draw(walk) gives the picture function for that many taps made. n taps, counted 1, 2, 3 and the last is hers */
  walk: (n, draw, o) => Object.assign({ k: 'pic', n, land: n, draw: (el, wk) => draw(wk)(el), text: 'Tap each step. Count with me.', say: 'Tap each step, one at a time, and count with me.' + LAST, ask: 'How many steps?', askSay: 'How many steps did you count? You say the last number.' }, o),
  /* the same, counting on from "start" in steps of "by": the labels are the numbers she lands on */
  /* counting on by a different amount each tap: place-value counters (1000, 1000, 100, 10, 1) */
  walkSteps: (start, steps, draw, o) => Object.assign({ k: 'pic', n: steps.length, on: true, start, steps, land: start + steps.reduce((x, y) => x + y, 0), draw: (el, wk) => draw(wk)(el), text: 'Tap each counter. Count on.', say: 'Tap each counter, biggest first, and count on with me.' + LAST, ask: 'What number comes last?', askSay: 'You counted every counter. What number comes last?' }, o),
  walkOn: (start, by, n, draw, o) => Object.assign({ k: 'pic', n, on: true, start, by, land: start + by * n, draw: (el, wk) => draw(wk)(el), text: 'Start at ' + start + '. Tap each step.', say: 'Start at ' + start + '. Tap each step, and count on with me.' + LAST, ask: 'What number comes last?', askSay: 'You counted on from ' + start + '. What number comes last?' }, o)
};

/* ---------- multiplication as rows of blocks ---------- */
SKILLS.arrays = {
  name: 'Multiplying (rows of blocks)', strand: 'number', start: 2, max: 7,
  gen(lv) {
    if (lv <= 1) {
      const n = rnd(4, 9);
      return { type: 'num', text: 'How many blocks?', answer: n, visual: el => V.blocks(el, 1, n), visualDone: el => V.blocks(el, 1, n, { nums: true }),
        steps: [N('Count along the row.', n, el => V.blocks(el, 1, n), 'Count along the row. How many?', [H.count(n)], H.count(n))],
        explain: { text: 'Touch each block once as you count.' } };
    }
    if (lv <= 5) {
      const R = { 2: [2, 2, 2, 5], 3: [2, 5, 2, 5], 4: [3, 6, 3, 6], 5: [4, 9, 6, 9] }[lv];
      let r = rnd(R[0], R[1]), c = rnd(R[2], R[3]); if (lv === 3 && rnd(0, 2) === 0) c = 10; if (lv === 4 && r === c && r === 3) c = 4;
      const t = r * c;
      return { type: 'num', text: 'How many blocks?', say: 'How many blocks are there?', answer: t, visual: el => V.blocks(el, r, c), visualDone: el => V.blocks(el, r, c, { totals: r, rowTags: true }),
        steps: [
          N('Count one row.', c, el => V.blocks(el, r, c, { hiRow: 0, dimOthers: true }), 'Every row is the same. Count the blocks in one row.', [H.count(c)]),
          N('How many rows?', r, el => V.blocks(el, r, c, { rowTags: 'dots' }), 'Each dot marks a row. How many rows?', [H.count(r, { text: 'Tap once for each row.', say: 'Tap once for each row, and count with me.' + LAST })]),
          N(r + ' rows of ' + c + '. How many?', t, el => V.blocks(el, r, c, { totals: r - 1, rowTags: 'dots' }), r + ' rows of ' + c + '. Count up in ' + c + 's.', [H.skip(r, c, true)])
        ],
        explain: { text: r + ' rows of ' + c + ' makes ' + t + '.', say: r + ' rows of ' + c + ' makes ' + t + '. That is ' + r + ' times ' + c + '.' } };
    }
    const a = lv === 6 ? rnd(12, 19) : rnd(21, 39), b = lv === 6 ? rnd(2, 5) : rnd(3, 7);
    const tens = Math.floor(a / 10) * 10, ones = a % 10, t = a * b;
    if (ones < 2) return SKILLS.arrays.gen(lv);
    return { type: 'num', text: b + ' rows of ' + a + '. How many?', answer: t, visual: el => V.blocks(el, b, a, { split: tens }),
      steps: [
        N(b + ' rows of ' + tens + '?', b * tens, el => V.blocks(el, b, a, { split: tens, part: 'tens' }), 'Do the big part first. ' + b + ' rows of ' + tens + '.', [H.skip(b, tens)]),
        N(b + ' rows of ' + ones + '?', b * ones, el => V.blocks(el, b, a, { split: tens, part: 'ones' }), 'Now the small part. ' + b + ' rows of ' + ones + '.', [H.skip(b, ones)]),
        N((b * tens) + ' + ' + (b * ones) + ' = ?', t, el => V.blocks(el, b, a, { split: tens }), 'Add the two parts. ' + (b * tens) + ' plus ' + (b * ones) + '.', [H.on(b * tens, b * ones)])
      ],
      explain: { text: 'Split it: ' + (b * tens) + ' and ' + (b * ones) + ' makes ' + t + '.', say: 'Split a big number into tens and ones. ' + (b * tens) + ' and ' + (b * ones) + ' makes ' + t + '.' } };
  }
};

/* ---------- adding and subtracting ---------- */
const hop = (c0, p, plus) => plus ? H.on(c0, p) : H.back(c0, p);
function onesSteps(cur, o, op) {            // add or take a single digit, bridging through the ten when needed
  const steps = [], u = cur % 10, plus = op === '+';
  if (!o) return { steps, cur };
  if (plus && u !== 0 && u + o > 10) {
    const k = 10 - u, T = cur + k, rest = o - k, c0 = cur;
    steps.push(N(c0 + ' + ' + k + ' = ?', T, el => V.line(el, T - 10, T + 10, [{ from: c0, to: T, label: '+' + k }], [T - 10, c0, T + 10], [T]), 'Jump to the next ten. ' + c0 + ' plus ' + k + '.', [H.on(c0, k)]));
    steps.push(N(T + ' + ' + rest + ' = ?', T + rest, el => V.line(el, T - 10, T + 10, [{ from: c0, to: T, label: '+' + k }, { from: T, to: T + rest, label: '+' + rest }], [T - 10, c0, T, T + 10], [T + rest]), 'Now ' + rest + ' more. ' + T + ' plus ' + rest + '.', [H.on(T, rest)]));
    return { steps, cur: T + rest };
  }
  if (!plus && u !== 0 && u < o) {
    const T = cur - u, rest = o - u, c0 = cur;
    steps.push(N(c0 + ' − ' + u + ' = ?', T, el => V.line(el, T - 10, T + 10, [{ from: c0, to: T, label: '−' + u }], [T - 10, c0, T + 10], [T]), 'Go back to the ten. ' + c0 + ' take away ' + u + '.', [H.back(c0, u)]));
    steps.push(N(T + ' − ' + rest + ' = ?', T - rest, el => V.line(el, T - 10, T + 10, [{ from: c0, to: T, label: '−' + u }, { from: T, to: T - rest, label: '−' + rest }], [T - 10, T, c0, T + 10], [T - rest]), 'Now ' + rest + ' more. ' + T + ' take away ' + rest + '.', [H.back(T, rest)]));
    return { steps, cur: T - rest };
  }
  const nx = plus ? cur + o : cur - o, c0 = cur, lo = Math.floor(Math.min(c0, nx) / 10) * 10, hi = Math.max(lo + 10, Math.ceil(Math.max(c0, nx) / 10) * 10);
  steps.push(N(c0 + ' ' + op + ' ' + o + ' = ?', nx, el => V.line(el, lo, hi, [{ from: c0, to: nx, label: op + o }], Array.from(new Set([lo, c0, hi])), [nx]), c0 + (plus ? ' plus ' : ' take away ') + o + '.', [hop(c0, o, plus)]));
  return { steps, cur: nx };
}
function jumpSteps(a, b, op) {              // break b into hundreds, tens, ones and jump one part at a time
  const big = [Math.floor(b / 100) * 100, Math.floor(b % 100 / 10) * 10].filter(x => x > 0); let steps = [], cur = a;
  big.forEach(p => { const nx = op === '+' ? cur + p : cur - p, c0 = cur;
    steps.push(N(c0 + ' ' + op + ' ' + p + ' = ?', nx, el => V.equation(el, c0 + ' ' + op + ' ' + p), c0 + (op === '+' ? ' plus ' : ' take away ') + p + '.', [hop(c0, p, op === '+')])); cur = nx; });
  const o = onesSteps(cur, b % 10, op);
  return steps.concat(o.steps);
}
SKILLS.addsub = {
  name: 'Adding and subtracting', strand: 'number', start: 2, max: 7,
  gen(lv, ctx) {
    const plus = rnd(0, 1) === 0, op = plus ? '+' : '−', word = plus ? ' plus ' : ' take away ', thing = (ctx && ctx.thing) || 'amphora';
    let a, b;
    if (lv <= 1) {                              // within 10, with things to count
      if (plus) { a = rnd(2, 6); b = rnd(1, 9 - a); } else { a = rnd(5, 10); b = rnd(1, a - 2); }
      const ans = plus ? a + b : a - b, cnt = H.count(ans, { icon: thing });
      return { type: 'num', text: a + ' ' + op + ' ' + b + ' = ?', say: a + word + b + '.', answer: ans, visual: el => V.things(el, thing, a, b, op), visualDone: el => V.things(el, thing, a, b, op, { nums: true }),
        steps: [N(plus ? 'Count them all.' : 'Count the ones left.', ans, el => V.things(el, thing, a, b, op), null, [cnt], cnt)],
        explain: { text: plus ? 'Adding means counting them all together.' : 'Taking away leaves fewer. Count what is left.' } };
    }
    if (lv === 2) {                             // crossing ten
      if (plus) { a = rnd(6, 9); b = rnd(11 - a + 1, 9); const k = 10 - a, rest = b - k, ans = a + b;
        return { type: 'num', text: a + ' + ' + b + ' = ?', say: a + ' plus ' + b + '.', answer: ans, visual: el => V.things(el, thing, a, b, '+'),
          steps: [
            N(a + ' + ? = 10', k, el => V.line(el, 0, 20, [{ from: a, to: 10, label: '+?' }], [0, a, 10, 20]), 'Make ten first. ' + a + ' plus what makes 10?', [H.gap(a, 10)]),
            N(b + ' is ' + k + ' and ?', rest, el => V.equation(el, b + ' = ' + k + ' + ?'), 'We used ' + k + '. ' + b + ' is ' + k + ' and how many more?', [H.rest(b, k)]),
            N('10 + ' + rest + ' = ?', ans, el => V.line(el, 0, 20, [{ from: a, to: 10, label: '+' + k }, { from: 10, to: ans, label: '+' + rest }], [0, a, 10, 20], [ans]), '10 plus ' + rest + '.', [H.on(10, rest)])
          ], explain: { text: 'Make ten, then add the rest.' } };
      }
      a = rnd(11, 17); b = rnd(a - 10 + 1, 9); const k = a - 10, rest = b - k, ans = a - b;
      return { type: 'num', text: a + ' − ' + b + ' = ?', say: a + ' take away ' + b + '.', answer: ans, visual: el => V.equation(el, a + ' − ' + b),
        steps: [
          N(a + ' − ' + k + ' = ?', 10, el => V.line(el, 0, 20, [{ from: a, to: 10, label: '−' + k }], [0, a, 20], [10]), 'Go back to the ten first. ' + a + ' take away ' + k + '.', [H.back(a, k)]),
          N('10 − ' + rest + ' = ?', ans, el => V.line(el, 0, 20, [{ from: a, to: 10, label: '−' + k }, { from: 10, to: ans, label: '−' + rest }], [0, 10, a, 20], [ans]), 'Now take away ' + rest + ' more.', [H.back(10, rest)])
        ], explain: { text: 'Go back to ten, then take the rest.' } };
    }
    if (lv === 3) { b = rnd(4, 9); a = plus ? rnd(1, 8) * 10 + rnd(11 - b, 9) : rnd(2, 9) * 10 + rnd(1, b - 1); }
    else if (lv === 4) { a = rnd(23, 68); b = rnd(12, plus ? 99 - a : a - 5); if (plus && b > 99 - a) b = 99 - a; }
    else if (lv === 5) { a = rnd(120, 860); b = rnd(14, 95); }
    else if (lv === 6) { a = rnd(250, 640); b = rnd(110, plus ? 990 - a : a - 30); }
    if (lv >= 3 && lv <= 6) {
      const ans = plus ? a + b : a - b;
      let steps;
      if (lv === 4 && plus) {
        const ta = Math.floor(a / 10) * 10, tb = Math.floor(b / 10) * 10, oa = a % 10, ob = b % 10;
        steps = [N(ta + ' + ' + tb + ' = ?', ta + tb, el => V.equation(el, ta + ' + ' + tb), 'Tens first. ' + ta + ' plus ' + tb + '.', [H.on(ta, tb)]),
          N(oa + ' + ' + ob + ' = ?', oa + ob, el => V.equation(el, oa + ' + ' + ob), 'Now the ones. ' + oa + ' plus ' + ob + '.', [H.on(oa, ob)]),
          N((ta + tb) + ' + ' + (oa + ob) + ' = ?', ans, el => V.equation(el, (ta + tb) + ' + ' + (oa + ob)), 'Put them together.', [H.on(ta + tb, oa + ob)])].filter(st => !/\+ 0 =/.test(st.text) && !/^0 \+/.test(st.text));
        if (!steps.length || steps[steps.length - 1].answer !== ans) steps = jumpSteps(a, b, op);
      } else steps = jumpSteps(a, b, op);
      return { type: 'num', text: a + ' ' + op + ' ' + b + ' = ?', say: a + word + b + '.', answer: ans, visual: el => V.baseTen(el, a, b, op), steps,
        explain: { text: plus ? 'Big sums are easier in small jumps.' : 'Take away in small jumps: tens, then ones.', say: 'Big sums are easier in small jumps. Hundreds, then tens, then ones.' } };
    }
    /* level 7: find the missing number */
    b = rnd(18, 49); const c = rnd(b + 15, 95), miss = c - b;
    const form = plus ? '? + ' + b + ' = ' + c : c + ' − ? = ' + b;
    return { type: 'num', text: form, say: plus ? 'What plus ' + b + ' makes ' + c + '?' : c + ' take away what leaves ' + b + '?', answer: miss, visual: el => V.equation(el, form.replace('?', '▢')),
      steps: [C('Which sum finds it?', [{ label: c + ' − ' + b }, { label: c + ' + ' + b }], 0, el => V.equation(el, form.replace('?', '▢')), 'Which sum finds the missing number?')].concat(jumpSteps(c, b, '−')),
      explain: { text: 'Work backwards: take ' + b + ' away from ' + c + '.' } };
  }
};

/* ---------- number patterns ---------- */
SKILLS.patterns = {
  name: 'Number patterns', strand: 'patterns', start: 2, max: 7,
  gen(lv) {
    let nums, steps, explain;
    const constant = (start, d, len) => {
      nums = Array.from({ length: len }, (_, i) => start + i * d); const last = nums[len - 2], ans = nums[len - 1], ad = Math.abs(d), up = d > 0;
      steps = [N(nums[0] + ' to ' + nums[1] + '. How big is the jump?', ad, el => V.seq(el, nums.slice(0, -1).concat(null), nums.slice(0, -1).map((_, i) => i === 0 ? '?' : null), 0), 'From ' + nums[0] + ' to ' + nums[1] + '. How big is the jump?', [H.gap(nums[0], nums[1])]),
        N(last + (up ? ' + ' : ' − ') + ad + ' = ?', ans, el => V.seq(el, nums.slice(0, -1).concat(null), nums.slice(0, -1).map(() => (up ? '+' : '−') + ad)), 'Same jump again. ' + last + (up ? ' plus ' : ' take away ') + ad + '.', [hop(last, ad, up)])];
      explain = { text: 'The rule: ' + (up ? 'add ' : 'take away ') + ad + ' each time.' };
    };
    if (lv <= 1) constant(rnd(1, 9), rnd(1, 2), 5);
    else if (lv === 2) { const d = pick([5, 10, -1, -2]); constant(d === 5 ? rnd(0, 4) * 5 : d === 10 ? rnd(1, 9) : rnd(14, 20), d, 5); }
    else if (lv === 3) { const d = pick([3, 4, 6, -3]); constant(d > 0 ? rnd(1, 9) : rnd(20, 30), d, 5); }
    else if (lv === 4) {
      const s0 = rnd(2, 5); nums = [s0, s0 * 2, s0 * 4, s0 * 8, s0 * 16]; const last = nums[3];
      steps = [N(last + ' + ' + last + ' = ?', nums[4], el => V.seq(el, nums.slice(0, 4).concat(null), ['×2', '×2', '×2', '×2']), 'Each number doubles. ' + last + ' plus ' + last + '.', [H.on(last, last)])];
      explain = { text: 'The rule: double each time.' };
    } else if (lv === 5 || lv === 6) {
      const s0 = rnd(1, 6), j0 = lv === 5 ? rnd(1, 3) : 1, jumps = lv === 5 ? [j0, j0 + 1, j0 + 2, j0 + 3] : [1, 2, 4, 8];
      nums = [s0]; jumps.forEach(j => nums.push(nums[nums.length - 1] + j)); const last = nums[3];
      steps = [N('Jumps: +' + jumps.slice(0, 3).join(', +') + '. Next jump?', jumps[3], el => V.seq(el, nums.slice(0, 4).concat(null), jumps.slice(0, 3).map(j => '+' + j).concat('?'), 3), 'Look at the jumps. They ' + (lv === 5 ? 'grow by one' : 'double') + ' each time. What is the next jump?', [lv === 5 ? H.on(jumps[2], 1) : H.on(jumps[2], jumps[2])]),
        N(last + ' + ' + jumps[3] + ' = ?', nums[4], el => V.seq(el, nums.slice(0, 4).concat(null), jumps.map(j => '+' + j)), last + ' plus ' + jumps[3] + '.', [H.on(last, jumps[3])])];
      explain = { text: lv === 5 ? 'The jumps grow by 1 each time.' : 'The jumps double each time.' };
    } else {
      const a = rnd(1, 3), b = a + rnd(1, 3); nums = [a, b]; while (nums.length < 6) nums.push(nums[nums.length - 1] + nums[nums.length - 2]);
      const p = nums[3], q = nums[4], sums = shuffle([nums[1] + ' + ' + nums[2], nums[2] + ' + ' + nums[2], nums[2] + ' + 1']);
      steps = [C('Which sum makes ' + nums[3] + '?', sums.map(x => ({ label: x })), sums.indexOf(nums[1] + ' + ' + nums[2]), el => V.seq(el, nums.slice(0, 5).concat(null)), 'Look for the rule. Which of these sums makes ' + nums[3] + '?'),
        N(p + ' + ' + q + ' = ?', nums[5], el => V.seq(el, nums.slice(0, 5).concat(null)), 'Each number is the two before it, added. So add the last two. ' + p + ' plus ' + q + '.', [H.on(p, q)])];
      explain = { text: 'The rule: add the two numbers before.' };
    }
    const ans = nums[nums.length - 1], shown = nums.slice(0, -1).concat(null);
    return { type: 'num', text: 'What comes next?', say: 'Look at the pattern. What comes next?', answer: ans, visual: el => V.seq(el, shown), visualDone: el => V.seq(el, nums, nums.slice(1).map((v, i) => { const d = v - nums[i]; return lv === 4 ? '×2' : (d >= 0 ? '+' : '−') + Math.abs(d); })), steps, explain };
  }
};

/* ---------- shapes, perimeter and area ---------- */
const SHAPE_FACT = { triangle: 'A triangle has 3 sides.', square: 'A square has 4 equal sides.', circle: 'A circle is perfectly round.', rectangle: 'A rectangle has 2 long and 2 short sides.', pentagon: 'A pentagon has 5 sides.', hexagon: 'A hexagon has 6 sides.' };
const POLY = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
SKILLS.shapes = {
  name: 'Shapes, perimeter and area', strand: 'geometry', start: 2, max: 7,
  gen(lv) {
    if (lv <= 1) {
      const kinds = shuffle(['triangle', 'square', 'circle', 'rectangle', 'pentagon', 'hexagon']).slice(0, 4), ai = rnd(0, 3), k = kinds[ai];
      const cols = ['#19A7B8', '#FFC83D', '#FF7A6B', '#34C17B'];
      const opts = kinds.map((n, i) => ({ svg: V.shapeSvg(n, cols[i]) }));
      const other = (ai + 1 + rnd(0, 2)) % 4, two = shuffle([ai, other]);
      return { type: 'choice', text: 'Tap the ' + k + '.', answer: ai, options: opts, visual: el => V.equation(el, k),
        steps: [C('Which one is the ' + k + '?', two.map(i => opts[i]), two.indexOf(ai), el => V.equation(el, k), SHAPE_FACT[k] + ' Which one is it?')],
        explain: { text: SHAPE_FACT[k] } };
    }
    if (lv <= 3) {
      const mode = lv === 2 ? 'sides' : 'corners', n = lv === 2 ? pick([3, 4, 5, 6]) : pick([5, 6, 8]), tool = H.spots(n, mode, POLY[n]);
      return { type: 'num', text: 'How many ' + mode + ' does the ' + POLY[n] + ' have?', answer: n, visual: el => V.poly(el, n, mode, 0), visualDone: el => V.poly(el, n, mode, n),
        steps: [N('Count the ' + POLY[n] + "'s " + mode + '.', n, el => V.poly(el, n, mode, 0), 'Count the ' + mode + ' of the ' + POLY[n] + '.', [tool], tool)],
        explain: { text: 'Touch each ' + mode.slice(0, -1) + ' once, all the way round.' } };
    }
    if (lv === 4) {
      let w = rnd(3, 7); const hh = rnd(2, 5 - (w > 5 ? 1 : 0)); if (w === hh) w++; const p = 2 * w + 2 * hh, base = { outline: V.rectOutline(w, hh), plain: true };
      return { type: 'num', text: 'How far around the rectangle?', say: 'How far is it all the way around the rectangle?', answer: p, visual: el => V.grid(el, w, hh, Object.assign({ labels: V.sideLabels(w, hh) }, base)),
        steps: [N('Top and bottom: ' + w + ' + ' + w + ' = ?', 2 * w, el => V.grid(el, w, hh, Object.assign({ labels: V.sideLabels(w, hh, { w: 1 }) }, base)), 'Top and bottom. ' + w + ' plus ' + w + '.', [H.on(w, w)]),
          N('Two sides: ' + hh + ' + ' + hh + ' = ?', 2 * hh, el => V.grid(el, w, hh, Object.assign({ labels: V.sideLabels(w, hh, { h: 1 }) }, base)), 'Now the two sides. ' + hh + ' plus ' + hh + '.', [H.on(hh, hh)]),
          N((2 * w) + ' + ' + (2 * hh) + ' = ?', p, el => V.grid(el, w, hh, Object.assign({ labels: V.sideLabels(w, hh) }, base)), 'Add them together.', [H.on(2 * w, 2 * hh)])],
        explain: { text: 'Around a shape: add up every side.' } };
    }
    if (lv === 5) {
      let w = rnd(3, 8); const hh = rnd(2, 5); if (w === hh) w++; const t = w * hh;
      return { type: 'num', text: 'How many squares inside the rectangle?', answer: t, visual: el => V.grid(el, w, hh, { outline: V.rectOutline(w, hh) }),
        steps: [N('Squares in one row of the rectangle?', w, el => V.grid(el, w, hh, { hiRow: 0, outline: V.rectOutline(w, hh) }), 'How many squares in one row?', [H.count(w)]),
          N(hh + ' rows of ' + w + '?', t, el => V.grid(el, w, hh, { outline: V.rectOutline(w, hh), labels: Array.from({ length: hh - 1 }, (_, i) => ({ x: w + .55, y: i + .5, t: (i + 1) * w, c: '#6453C9' })) }), hh + ' rows of ' + w + '. Count in ' + w + 's.', [H.skip(hh, w, true)])],
        explain: { text: 'Area is rows times squares in a row.' } };
    }
    if (lv === 6) {
      const w1 = rnd(2, 4), h1 = rnd(3, 5), w2 = rnd(2, 4), h2 = rnd(2, h1 - 1), cells = [];
      for (let y = 0; y < h1; y++) for (let x = 0; x < w1; x++) cells.push([x, y, 0]);
      for (let y = h1 - h2; y < h1; y++) for (let x = w1; x < w1 + w2; x++) cells.push([x, y, 1]);
      const outline = [[0, 0], [w1, 0], [w1, h1 - h2], [w1 + w2, h1 - h2], [w1 + w2, h1], [0, h1]], t = w1 * h1 + w2 * h2;
      const vis = hi => el => V.grid(el, w1 + w2, h1, { cells, outline, hi });
      return { type: 'num', text: 'How many squares in the L shape?', answer: t, visual: vis(null),
        steps: [N('Blue part: ' + h1 + ' rows of ' + w1 + '?', w1 * h1, vis(0), 'Split it in two. The blue part: ' + h1 + ' rows of ' + w1 + '.', [H.skip(h1, w1, true)]),
          N('Pink part: ' + h2 + ' rows of ' + w2 + '?', w2 * h2, vis(1), 'Now the pink part: ' + h2 + ' rows of ' + w2 + '.', [H.skip(h2, w2, true)]),
          N((w1 * h1) + ' + ' + (w2 * h2) + ' = ?', t, vis(null), 'Add the two parts.', [H.on(w1 * h1, w2 * h2)])],
        explain: { text: 'Split the L shape into two rectangles.' } };
    }
    let w = rnd(2, 6), hh = rnd(2, 5); if ((w * hh) % 2) w++;
    const full = w * hh;
    return { type: 'num', text: 'How many squares inside the triangle?', say: 'How many squares fit inside the purple triangle?', answer: full / 2, visual: el => V.grid(el, w, hh, { tri: true }),
      steps: [N('Whole rectangle: ' + hh + ' rows of ' + w + '?', full, el => V.grid(el, w, hh, { tri: true, showRect: true }), 'First the whole rectangle. ' + hh + ' rows of ' + w + '.', [H.skip(hh, w, true)]),
        N('Half of ' + full + '?', full / 2, el => V.grid(el, w, hh, { tri: true, showRect: true }), 'The triangle is half the rectangle. What is half of ' + full + '?', [H.deal(full, 2, 'blue-square', 'How many in one half?')])],
      explain: { text: 'A triangle is half of its rectangle.' } };
  }
};

/* ---------- fractions ---------- */
SKILLS.fractions = {
  name: 'Fractions', strand: 'number', start: 2, max: 7,
  gen(lv, ctx) {
    const thing = (ctx && ctx.thing) || 'red-apple';
    if (lv <= 1) {
      const d = pick([2, 4, 3, 2, 4]), cols = shuffle(['#FFC83D', '#19A7B8', '#FF7A6B', '#34C17B']);
      const kinds = shuffle([[d, false], [d, true]].concat([2, 3, 4].filter(x => x !== d).map(x => [x, false])));
      const opts = kinds.map((k, i) => ({ svg: V.fracOpt(k[0], 1, k[1], cols[i]) })), ai = kinds.findIndex(k => k[0] === d && !k[1]), un = kinds.findIndex(k => k[0] === d && k[1]), two = shuffle([ai, un]);
      return { type: 'choice', text: 'Tap ' + fracWord(1, d) + '.', answer: ai, options: opts, visual: el => V.fracBig(el, 1, d),
        steps: [C(d + ' equal parts, 1 coloured. Which one?', two.map(i => opts[i]), two.indexOf(ai), el => V.fracBig(el, 1, d), cap1(fracWord(1, d)) + ' means ' + d + ' equal parts, with 1 coloured. The parts must be the same size. Which one?')],
        explain: { text: cap1(fracWord(1, d)) + ' is 1 of ' + d + ' equal parts.' } };
    }
    if (lv <= 3) {
      const d = lv === 2 ? 2 : pick([4, 3, 4]), q = lv === 2 ? rnd(2, 8) : rnd(2, 5), n = d * q, lead = d === 2 ? 'half' : fracWord(1, d), deal = H.deal(n, d, thing);
      return { type: 'num', text: 'What is ' + lead + ' of ' + n + '?', answer: q, visual: el => V.share(el, thing, n, d), visualDone: el => V.share(el, thing, n, d, { split: true, nums: true }),
        steps: [N(d + ' equal groups. Count one group.', q, el => V.share(el, thing, n, d, { split: true }), 'To find ' + lead + ', share them into ' + d + ' equal groups. Then count one group.', [H.count(q, { icon: thing, text: 'Tap each one in one group.', say: 'Here is one group. Tap each one, and count with me.' + LAST })], deal)],
        explain: { text: cap1(lead) + ' means ' + d + ' equal groups. Count one.', say: 'To find ' + lead + ', share into ' + d + ' equal groups, and count one group.' } };
    }
    if (lv === 4) {
      const d = pick([2, 3, 4, 5, 10]), q = rnd(3, 10), n = d * q;
      return { type: 'num', text: '1/' + d + ' of ' + n + ' = ?', say: 'What is ' + fracWord(1, d) + ' of ' + n + '?', answer: q, visual: el => V.fracOf(el, 1, d, n), visualDone: el => V.fracOf(el, 1, d, n, { part: q, rest: q }),
        steps: [N('How many equal parts in the bar?', d, el => V.fracOf(el, 1, d, n, { bare: true }), 'Look at the bar. How many equal parts is it cut into?', [H.count(d, { text: 'Tap once for each part of the bar.', say: 'Tap once for each part of the bar, and count with me.' + LAST })]),
          N(n + ' blocks in ' + d + ' rows. Count one row.', q, el => V.blocks(el, d, q, { hiRow: 0, dimOthers: true }), n + ' shared into ' + d + ' equal rows. Count one row.', [H.count(q)])],
        explain: { text: 'The bottom number says how many equal parts.', say: 'The bottom number of a fraction says how many equal parts to share into.' } };
    }
    if (lv === 6) {
      const P = pick([[1, 2, 4], [1, 2, 6], [1, 2, 8], [1, 2, 10], [1, 3, 6], [1, 4, 8], [2, 3, 6], [3, 4, 8], [1, 5, 10], [2, 5, 10]]), k = P[0], d = P[1], d2 = P[2], m = k * d2 / d;
      return { type: 'num', text: k + '/' + d + ' = ?/' + d2, say: cap1(fracWord(k, d)) + ' is the same as how many ' + FRAC_NAME[d2][1] + '?', answer: m, visual: el => V.fracPair(el, k, d, d2), visualDone: el => V.fracPair(el, k, d, d2, { done: true }),
        steps: [N('Count the small parts up to the line.', m, el => V.fracPair(el, k, d, d2, { line: true }), 'The dotted line marks the same amount on both bars. Count the small parts up to the line.', [H.count(m, { text: 'Tap once for each small part before the line.', say: 'Tap once for each small part before the dotted line, and count with me.' + LAST })])],
        explain: { text: 'Same amount, cut into more parts.', say: 'It is the same amount of the bar. It is just cut into more, smaller parts.' } };
    }
    const d = lv === 5 ? pick([3, 4, 5]) : pick([5, 6, 8, 10]), k = rnd(2, d - 1), q = lv === 5 ? rnd(2, 6) : rnd(3, 10), n = d * q;
    return { type: 'num', text: k + '/' + d + ' of ' + n + ' = ?', say: 'What is ' + fracWord(k, d) + ' of ' + n + '?', answer: k * q, visual: el => V.fracOf(el, k, d, n), visualDone: el => V.fracOf(el, k, d, n, { part: q, rest: q }),
      steps: [N('First, 1/' + d + ' of ' + n + '?', q, el => V.blocks(el, d, q, { hiRow: 0, dimOthers: true }), 'First find ' + fracWord(1, d) + '. ' + n + ' blocks in ' + d + ' equal rows. Count one row.', [H.count(q)]),
        N(k + ' rows of ' + q + '?', k * q, el => V.blocks(el, d, q, { rowsOn: k, totals: k - 1, rowTags: 'dots' }), 'Now we want ' + k + ' of those parts. ' + k + ' rows of ' + q + '.', [H.skip(k, q, true)])],
      explain: { text: 'Find one part, then times by the top number.' } };
  }
};

/* ---------- turns and compass directions. Turns are always called clockwise or anticlockwise, never left or right. ---------- */
const DIR4 = [0, 2, 4, 6], DIAG = [1, 3, 5, 7], DIR8 = [0, 1, 2, 3, 4, 5, 6, 7], dirOpt = i => ({ label: cap1(DIR_NAME[i]) });
const CW_SAY = 'Clockwise is the way the hands of a clock go round.', CCW_SAY = 'Anticlockwise is the other way from the hands of a clock.';
SKILLS.turns = {
  name: 'Turns and directions', strand: 'geometry', start: 1, max: 6,
  gen(lv, ctx) {
    const boat = (ctx && ctx.boat) || 'boat', Boat = 'the ' + boat;
    if (lv <= 1) {
      const to = pick([2, 4, 6]), order = shuffle(DIR4), cols = ['#19A7B8', '#FFC83D', '#FF7A6B', '#34C17B'], opts = order.map((i, k) => ({ svg: V.arrowSvg(i, cols[k]) }));
      const other = pick(DIR4.filter(i => i !== to)), two = shuffle([to, other]);
      return { type: 'choice', text: 'Which way is ' + DIR_NAME[to] + '?', say: 'North is at the top. Which way is ' + DIR_NAME[to] + '?', options: opts, answer: order.indexOf(to), visual: el => V.compass(el, { show: [0] }), visualDone: el => V.compass(el, { face: to }),
        steps: [C('Which arrow points ' + DIR_NAME[to] + '?', two.map(i => opts[order.indexOf(i)]), two.indexOf(to), el => V.compass(el, { show: [0], spin: 'cw' }), 'Never Eat Soggy Weet-Bix! Start at north, at the top, and go round clockwise. North, east, south, west. Which arrow points ' + DIR_NAME[to] + '?')],
        explain: { text: 'Never Eat Soggy Weet-Bix: N, E, S, W.', say: 'Start at the top and go round clockwise. Never, Eat, Soggy, Weet-Bix. North, east, south, west.' } };
    }
    if (lv <= 3) {
      const from = pick(DIR4), kind = lv === 2 ? 'cw' : pick(['ccw', 'half', 'half', 'ccw', 'cw']), ccw = kind === 'ccw', to = (from + (kind === 'cw' ? 2 : ccw ? -2 : 4) + 8) % 8, F = DIR_NAME[from];
      const turn = kind === 'half' ? 'Half turn clockwise' : 'Quarter turn ' + (ccw ? 'anticlockwise' : 'clockwise'), order = shuffle(DIR4), arc = { from, to, ccw };
      const tool = H.turn({ from, to, ccw, text: kind === 'half' ? 'A half turn is two quarter turns. Tap Turn twice.' : 'Tap Turn to make a quarter turn.',
        say: (ccw ? CCW_SAY : CW_SAY) + (kind === 'half' ? ' A half turn is two quarter turns. Tap the Turn button twice, and watch ' + Boat + '.' : ' Tap the Turn button once, and watch ' + Boat + ' make a quarter turn.'),
        ask: 'Which way is it pointing now?', askSay: 'You turned it. Which way is ' + Boat + ' pointing now?' });
      return { type: 'choice', text: 'Facing ' + F + '. ' + turn + '. Now facing?', say: cap1(Boat) + ' is facing ' + F + '. It makes a ' + turn.toLowerCase() + '. Which way is it facing now?', options: order.map(dirOpt), answer: order.indexOf(to),
        visual: el => V.compass(el, { face: from, spin: ccw ? 'ccw' : 'cw' }), visualDone: el => V.compass(el, { was: from, face: to, arc, spin: ccw ? 'ccw' : 'cw' }),
        steps: [Object.assign(C('Which way is it pointing now?', order.map(dirOpt), order.indexOf(to), el => V.compass(el, { face: from, spin: ccw ? 'ccw' : 'cw' })), { pre: tool })],
        explain: { text: kind === 'half' ? 'A half turn points you the opposite way.' : (ccw ? 'Anticlockwise: the other way from a clock.' : 'Clockwise: the way clock hands go round.'), say: kind === 'half' ? 'A half turn is two quarter turns. It points you the opposite way.' : (ccw ? CCW_SAY : CW_SAY) } };
    }
    if (lv === 4) {
      const from = pick(DIR4), q = pick([2, 3, 2, 3, 4]), to = (from + q * 2) % 8, deg = q * 90, arc = { from, to }, key = 'quarter turn = 90°';
      const seq = el => V.seq(el, Array.from({ length: q - 1 }, (_, i) => (i + 1) * 90).concat(null), Array.from({ length: q - 1 }, () => '+90'));
      const tool = H.turn({ from, to, goal: true, text: q === 4 ? 'Tap Turn until it points ' + DIR_NAME[to] + ' again.' : 'Tap Turn until it points ' + DIR_NAME[to] + '.', say: 'Each tap is one quarter turn. Tap the Turn button until ' + Boat + ' points ' + DIR_NAME[to] + (q === 4 ? ' again' : '') + '. Count your taps.', ask: 'How many quarter turns?', askSay: 'Each dot is one quarter turn. How many quarter turns did you make?' });
      return { type: 'num', text: q === 4 ? 'A full turn. How many degrees?' : 'Turn clockwise from ' + DIR_NAME[from] + ' to ' + DIR_NAME[to] + '. How many degrees?', say: (q === 4 ? cap1(Boat) + ' turns all the way around. ' : cap1(Boat) + ' turns clockwise, from ' + DIR_NAME[from] + ' to ' + DIR_NAME[to] + '. ') + 'A quarter turn is 90 degrees. How many degrees is the whole turn?', answer: deg,
        visual: el => V.compass(el, { face: from, arc, key, spin: 'cw' }), visualDone: el => V.compass(el, { was: from, face: to, arc: { from, to, nums: true }, key, spin: 'cw' }),
        steps: [N('How many quarter turns?', q, el => V.compass(el, { face: from, arc: { from, to, dots: true }, key, spin: 'cw' }), 'Each dot on the arrow is one quarter turn. How many quarter turns?', [tool]),
          N(q + ' lots of 90 = ?', deg, seq, 'Each quarter turn is 90 degrees. ' + q + ' lots of 90.', [H.skip(q, 90)])],
        explain: { text: 'Count the quarter turns. Each one is 90 degrees.' } };
    }
    if (lv === 5) {
      const order = shuffle(DIAG);
      if (rnd(0, 1)) {
        const to = pick(DIAG), a = (to + 7) % 8, b = (to + 1) % 8, ns = a % 4 === 0 ? a : b, ew = a % 4 === 0 ? b : a, two = shuffle([to, pick(DIAG.filter(i => i !== to))]);
        return { type: 'choice', text: 'What is halfway between ' + DIR_NAME[ns] + ' and ' + DIR_NAME[ew] + '?', options: order.map(dirOpt), answer: order.indexOf(to), visual: el => V.compass(el, { eight: true, ask: to }), visualDone: el => V.compass(el, { eight: true, show: DIR8, face: to }),
          steps: [C(cap1(DIR_NAME[ns]) + ' and ' + DIR_NAME[ew] + ' together make…', two.map(dirOpt), two.indexOf(to), el => V.compass(el, { eight: true, ask: to }), 'The in-between points use both names. North or south always goes first. ' + cap1(DIR_NAME[ns]) + ' and ' + DIR_NAME[ew] + ' together make…')],
          explain: { text: 'In-between points use both names. North or south first.' } };
      }
      const from = pick(DIAG), ccw = rnd(0, 1) === 1, to = (from + (ccw ? 6 : 2)) % 8, arc = { from, to, ccw, unit: 1 }, way = ccw ? 'anticlockwise' : 'clockwise';
      const tool = H.turn({ from, to, ccw, unit: 1, eight: true, text: 'A quarter turn is two small steps. Tap Turn twice.', say: (ccw ? CCW_SAY : CW_SAY) + ' On this compass a quarter turn is two small steps. Tap the Turn button twice.', ask: 'Which way is it pointing now?', askSay: 'You turned it. Which way is ' + Boat + ' pointing now?' });
      return { type: 'choice', text: 'Facing ' + DIR_NAME[from] + '. Quarter turn ' + way + '. Now facing?', say: cap1(Boat) + ' is facing ' + DIR_NAME[from] + '. It makes a quarter turn ' + way + '. Which way is it facing now?', options: order.map(dirOpt), answer: order.indexOf(to),
        visual: el => V.compass(el, { eight: true, show: DIR8, face: from, spin: ccw ? 'ccw' : 'cw' }), visualDone: el => V.compass(el, { eight: true, show: DIR8, was: from, face: to, arc, spin: ccw ? 'ccw' : 'cw' }),
        steps: [Object.assign(C('Which way is it pointing now?', order.map(dirOpt), order.indexOf(to), el => V.compass(el, { eight: true, show: DIR8, face: from, spin: ccw ? 'ccw' : 'cw' })), { pre: tool })],
        explain: { text: 'A quarter turn is two small steps round.' } };
    }
    const from = pick(DIR4), k = pick([3, 5, 3]), to = (from + k) % 8, deg = k * 45, arc = { from, to, unit: 1 }, key = 'small step = 45°';
    const seq = el => V.seq(el, Array.from({ length: k - 1 }, (_, i) => (i + 1) * 45).concat(null), Array.from({ length: k - 1 }, () => '+45'));
    const tool = H.turn({ from, to, unit: 1, eight: true, goal: true, text: 'Tap Turn until it points ' + DIR_NAME[to] + '.', say: 'Each tap is one small step. Tap the Turn button until ' + Boat + ' points ' + DIR_NAME[to] + '. Count your taps.', ask: 'How many small steps?', askSay: 'Each dot is one small step. How many small steps did you make?' });
    return { type: 'num', text: 'Turn clockwise from ' + DIR_NAME[from] + ' to ' + DIR_NAME[to] + '. How many degrees?', say: cap1(Boat) + ' turns clockwise, from ' + DIR_NAME[from] + ' to ' + DIR_NAME[to] + '. Each small step is 45 degrees. How many degrees is the whole turn?', answer: deg,
      visual: el => V.compass(el, { eight: true, show: DIR8, face: from, arc, key, spin: 'cw' }), visualDone: el => V.compass(el, { eight: true, show: DIR8, was: from, face: to, arc: Object.assign({ nums: true }, arc), key, spin: 'cw' }),
      steps: [N('How many small steps?', k, el => V.compass(el, { eight: true, show: DIR8, face: from, arc: Object.assign({ dots: true }, arc), key, spin: 'cw' }), 'Each dot on the arrow is one small step. How many small steps?', [tool]),
        N(k + ' lots of 45 = ?', deg, seq, 'Each small step is 45 degrees. ' + k + ' lots of 45.', [H.skip(k, 45)])],
      explain: { text: 'Count the small steps. Each one is 45 degrees.' } };
  }
};

/* ---------- reading block graphs. A country can supply its own things to count: GRAPH_SETS[tag] ---------- */
const GRAPH_SETS = { default: { noun: 'fruit', one: 'fruit', items: [{ name: 'apples', art: 'red-apple' }, { name: 'bananas', art: 'banana' }, { name: 'pears', art: 'pear' }, { name: 'lemons', art: 'lemon' }, { name: 'peaches', art: 'peach' }] } };
SKILLS.graphs = {
  name: 'Reading graphs', strand: 'data', start: 2, max: 6,
  gen(lv, ctx) {
    const set = GRAPH_SETS[ctx && ctx.tag] || GRAPH_SETS.default, n = lv === 4 ? 3 : 4, sc = lv >= 5 ? pick([2, 5, 10]) : 1;
    const range = lv <= 2 ? [1, 6] : lv >= 5 ? [2, 6] : [1, 8], vals = shuffle(Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i)).slice(0, n);
    const data = shuffle(set.items).slice(0, n).map((it, i) => ({ name: it.name, art: it.art, v: vals[i], sn: it.say ? it.say() : it.name }));
    const vis = o => el => V.bars(el, data, Object.assign({ scale: sc, noun: set.noun }, o));
    const blocksOf = x => H.count(x.v, { stack: true, under: { art: x.art, name: x.name }, text: 'Tap each ' + x.name + ' block.', say: 'Tap once for each block in the ' + x.sn + ' bar, and count with me.' + LAST });
    const i = rnd(0, n - 1), b = data[i];
    let ia = rnd(0, n - 1), ib = (ia + rnd(1, n - 1)) % n; if (data[ia].v < data[ib].v) { const t = ia; ia = ib; ib = t; } const A = data[ia], B = data[ib];
    if (lv <= 1) return { type: 'num', text: 'How many ' + b.name + ' did we count?', say: 'Look at the graph. How many ' + b.sn + ' did we count?', answer: b.v, visual: vis({}), visualDone: vis({ hi: i, nums: true }),
      steps: [N('Count the ' + b.name + ' blocks.', b.v, vis({ hi: i }), 'Find the ' + b.sn + ' bar. Count its blocks.', [blocksOf(b)])],
      explain: { text: 'Find the bar, then count its blocks.' } };
    if (lv === 2) {
      const most = rnd(0, 1) === 1, best = data.reduce((m, x, k) => (most ? x.v > data[m].v : x.v < data[m].v) ? k : m, 0), two = shuffle([best, (best + rnd(1, n - 1)) % n]), opt = k => ({ label: cap1(data[k].name), icon: data[k].art });
      return { type: 'choice', text: 'Which ' + set.one + ' did we count ' + (most ? 'most' : 'least') + '?', options: data.map((_, k) => opt(k)), answer: best, visual: vis({}), visualDone: vis({ hi: best, tops: true }),
        steps: [C('Which bar is ' + (most ? 'taller' : 'shorter') + '?', two.map(opt), two.indexOf(best), vis({ hi: two }), 'Look at these two bars. Which bar is ' + (most ? 'taller' : 'shorter') + '?')],
        explain: { text: most ? 'The tallest bar shows the most.' : 'The shortest bar shows the least.' } };
    }
    if (lv === 3) return { type: 'num', text: 'How many more ' + A.name + ' than ' + B.name + '?', say: 'How many more ' + A.sn + ' than ' + B.sn + ' did we count?', answer: A.v - B.v, visual: vis({}), visualDone: vis({ hi: [ia, ib], tops: true }),
      steps: [N('How many ' + A.name + '?', A.v, vis({ hi: ia }), 'First, how many ' + A.sn + '? Count the blocks.', [blocksOf(A)]), N('How many ' + B.name + '?', B.v, vis({ hi: ib }), 'Now, how many ' + B.sn + '?', [blocksOf(B)]),
        N(A.v + ' − ' + B.v + ' = ?', A.v - B.v, vis({ hi: [ia, ib], tops: true }), 'Now take away. ' + A.v + ' take away ' + B.v + '.', [H.back(A.v, B.v)])],
      explain: { text: 'Find both bars, then take away.' } };
    if (lv === 4) { const s2 = data[0].v + data[1].v, sum = s2 + data[2].v;
      return { type: 'num', text: 'How many ' + set.noun + ' altogether?', say: 'How many ' + set.noun + ' did we count altogether?', answer: sum, visual: vis({}), visualDone: vis({ tops: true }),
        steps: [N(data[0].v + ' + ' + data[1].v + ' = ?', s2, vis({ hi: [0, 1], tops: true }), 'Add the first two bars. ' + data[0].v + ' plus ' + data[1].v + '.', [H.on(data[0].v, data[1].v)]), N(s2 + ' + ' + data[2].v + ' = ?', sum, vis({ hi: [2], tops: true }), 'Now add the last bar. ' + s2 + ' plus ' + data[2].v + '.', [H.on(s2, data[2].v)])],
        explain: { text: 'Altogether means add up every bar.' } }; }
    if (lv === 5) return { type: 'num', text: 'Each block is ' + sc + ' ' + set.noun + '. How many ' + b.name + '?', say: 'Careful! Each block is worth ' + sc + ' ' + set.noun + '. How many ' + b.sn + ' did we count?', answer: b.v * sc, visual: vis({}), visualDone: vis({ hi: i, tops: true }),
      steps: [N('How many ' + b.name + ' blocks?', b.v, vis({ hi: i }), 'Count the blocks in the ' + b.sn + ' bar.', [blocksOf(b)]), N(b.v + ' lots of ' + sc + ' = ?', b.v * sc, vis({ hi: i }), 'Each block is worth ' + sc + '. ' + b.v + ' lots of ' + sc + '.', [H.skip(b.v, sc)])],
      explain: { text: 'Each block is worth ' + sc + '. Count in ' + sc + 's.' } };
    return { type: 'num', text: 'Each block is ' + sc + '. How many more ' + A.name + ' than ' + B.name + '?', say: 'Each block is worth ' + sc + ' ' + set.noun + '. How many more ' + A.sn + ' than ' + B.sn + ' did we count?', answer: (A.v - B.v) * sc, visual: vis({}), visualDone: vis({ hi: [ia, ib], tops: true }),
      steps: [N(cap1(A.name) + ': ' + A.v + ' lots of ' + sc + ' = ?', A.v * sc, vis({ hi: ia }), 'First the ' + A.sn + ' bar. ' + A.v + ' blocks, each worth ' + sc + '.', [H.skip(A.v, sc)]),
        N(cap1(B.name) + ': ' + B.v + ' lots of ' + sc + ' = ?', B.v * sc, vis({ hi: ib }), 'Now the ' + B.sn + ' bar. ' + B.v + ' blocks, each worth ' + sc + '.', [H.skip(B.v, sc)]),
        N((A.v * sc) + ' − ' + (B.v * sc) + ' = ?', (A.v - B.v) * sc, vis({ hi: [ia, ib], tops: true }), 'Now take away. ' + (A.v * sc) + ' take away ' + (B.v * sc) + '.', [H.back(A.v * sc, B.v * sc)])],
      explain: { text: 'Work out each bar, then take away.' } };
  }
};

/* ---------- telling the time: hours, minutes in fives, and how long a trip takes ---------- */
H.jumps = (q, by) => ({ k: 'tap', start: 0, steps: Array(q).fill(by), signed: true, tally: true, text: 'Count in ' + by + 's. Tap each jump.', say: 'Count in ' + by + 's, up to ' + (q * by) + '. Tap each jump, and count with me. Then count how many jumps you made.', ask: 'How many jumps?', askSay: 'Count your jumps. How many did it take?' });
SKILLS.clock = {
  name: 'Telling the time', strand: 'geometry', start: 2, max: 7,
  gen(lv) {
    /* the help is worked on the clock itself: each tap puts a counter on the next number round the dial */
    const round = (hr, m, o, from) => wk => el => V.clock(el, hr, m, Object.assign({}, o, { walk: Object.assign({ from: from || 0 }, wk) }));
    const numbers = (k, hr, m, o) => H.walk(k, round(hr, m, o), { text: 'Tap the clock. Count each number from 1.', say: 'Start at 1 and go round the clock to the hand. Tap the clock once for each number, and count with me.' + LAST, ask: 'What number comes last?' });
    const fives = (k, hr, m, o, from) => H.walkOn(0, 5, k, round(hr, m, o, from), { text: 'Tap the clock. Count in 5s.', say: 'Each number on the clock is 5 minutes. Tap the clock once for each jump, and count in fives with me.' + LAST, askSay: 'You counted in fives. What number comes last?' });
    const dotsOf = (k, hr, m, o, from) => H.walk(k, round(hr, m, o, from), { text: 'Tap the clock. Count each jump.', say: 'Tap the clock once for each jump, from the faint hand to the dark one, and count with me.' + LAST, ask: 'How many jumps?' });
    const FIVES = 'Each number on the clock is 5 minutes.';
    const clear = (hr, m) => Math.abs(((hr + m / 60) * 30 - m * 6 + 540) % 360 - 180) >= 32;      // the two hands are never drawn one on top of the other
    if (lv <= 1) {
      const hr = rnd(1, 12);
      return { type: 'num', text: "It is ? o'clock. Which hour?", say: "The long hand points straight up, so it is something o'clock. The short hand shows the hour. Which hour is it?", answer: hr,
        visual: el => V.clock(el, hr, 0), visualDone: el => V.clock(el, hr, 0, { hi: 'hr', label: hr + " o'clock" }),
        steps: [N('Which number is the short hand on?', hr, el => V.clock(el, hr, 0, { hi: 'hr' }), 'Find the short, thick hand. Which number is it pointing at?', [numbers(hr, hr, 0, { hi: 'hr' })])],
        explain: { text: 'The short hand shows the hour.', say: "The short hand shows the hour. When the long hand points straight up, it is exactly o'clock." } };
    }
    if (lv <= 3) {
      let hr, k; do { hr = rnd(1, 11); k = lv === 2 ? pick([3, 6, 9]) : pick([1, 2, 4, 5, 7, 8, 10, 11]); } while (!clear(hr, k * 5));
      const m = k * 5;
      const longOn = N('Which number is the long hand on?', k, el => V.clock(el, hr, m, { hi: 'min' }), 'Find the long, thin hand. Which number is it pointing at?', [numbers(k, hr, m, { hi: 'min' })]);
      const lots = N(k + ' lots of 5 minutes = ?', m, el => V.clock(el, hr, m, { hi: 'min', dots: { from: 0, to: m } }), FIVES + ' ' + k + ' lots of 5.', [fives(k, hr, m, { hi: 'min' })]);
      const done = el => V.clock(el, hr, m, { dots: { from: 0, to: m }, label: clockT(hr, m) });
      if (lv === 3 && rnd(0, 1)) {
        const right = clockT(hr, m), wrong = [clockT(hr % 12 + 1, m), clockT(hr, k), clockT(k, (hr * 5) % 60), clockT(hr, (m + 30) % 60)].filter((x, i, a) => x !== right && a.indexOf(x) === i).slice(0, 2);
        const opts = shuffle([right].concat(wrong)), two = shuffle([hr, hr % 12 + 1]);
        return { type: 'choice', text: 'What time is it?', say: 'Look at both hands. What time is it?', options: opts.map(x => ({ label: x })), answer: opts.indexOf(right), visual: el => V.clock(el, hr, m), visualDone: done,
          steps: [C('Which hour has the short hand passed?', two.map(x => ({ label: String(x) })), two.indexOf(hr), el => V.clock(el, hr, m, { hi: 'hr' }), 'The short hand is between two numbers. Which hour has it already gone past?'), lots],
          explain: { text: 'Short hand: the hour. Long hand: minutes, in fives.', say: 'The short hand gives the hour. The long hand gives the minutes. Count them in fives from the top.' } };
      }
      return { type: 'num', text: 'How many minutes past ' + hr + '?', say: 'The short hand has gone past ' + hr + '. The long hand counts the minutes. How many minutes past ' + hr + ' is it?', answer: m, visual: el => V.clock(el, hr, m), visualDone: done,
        steps: [longOn, lots], explain: { text: FIVES, say: FIVES + ' Count round in fives from the top.' } };
    }
    if (lv === 4) {
      const a = rnd(1, 8), d = rnd(2, Math.min(6, 12 - a)), b = a + d;
      if (rnd(0, 1)) return { type: 'num', text: 'Leaves at ' + a + ':00, arrives at ' + b + ':00. How many hours?', say: "The train leaves at " + a + " o'clock and arrives at " + b + " o'clock. How many hours does the trip take?", answer: d, visual: el => V.clocks(el, [a, 0], [b, 0]),
        steps: [N('Hop from ' + a + ' to ' + b + '. How many hops?', d, el => V.clocks(el, [a, 0], [b, 0]), 'Count on from ' + a + ' to ' + b + ', one hour at a time. How many hours?', [H.walk(d, round(a, 0, { hi: 'hr' }, a * 5), { text: 'Start at ' + a + '. Tap round to ' + b + '.', say: 'This clock shows when the train leaves. Start at ' + a + '. Tap the clock once for each hour, round to ' + b + ', and count with me.' + LAST, ask: 'How many hours?' })])],
        explain: { text: 'Count the hours from start to finish.' } };
      return { type: 'num', text: 'Leaves at ' + a + ':00. The trip takes ' + d + ' hours. Arrives at?', say: "The train leaves at " + a + " o'clock. The trip takes " + d + " hours. At what hour does it arrive?", answer: b,
        visual: el => V.clock(el, a, 0, { label: 'Leaves' }), visualDone: el => V.clock(el, b, 0, { label: 'Arrives' }),
        steps: [N(a + ' + ' + d + ' = ?', b, el => V.line(el, 0, 12, [{ from: a, to: b, label: '+' + d }], [0, a, 12], [b]), 'Count on ' + d + ' hours from ' + a + '.', [H.walkOn(a, 1, d, round(a, 0, { hi: 'hr' }, a * 5), { text: 'Start at ' + a + '. Tap ' + d + ' hours on.', say: 'Start at ' + a + " o'clock. Tap the clock once for each hour of the trip, and count on with me." + LAST })])],
        explain: { text: 'Count on the hours to find the finish.' } };
    }
    if (lv === 5) {
      let hr, k1, k; do { hr = rnd(1, 11); k1 = rnd(0, 7); k = rnd(2, Math.min(8, 11 - k1)); } while (!clear(hr, k1 * 5) || !clear(hr, (k1 + k) * 5));
      const m1 = k1 * 5, m2 = m1 + k * 5, pic = el => V.clock(el, hr, m2, { ghost: m1, sector: { from: m1, to: m2 }, dots: { from: m1, to: m2 } });
      return { type: 'num', text: 'Leaves at ' + clockT(hr, m1) + ', arrives at ' + clockT(hr, m2) + '. How many minutes?', say: 'The train leaves at ' + clockT(hr, m1) + ' and arrives at ' + clockT(hr, m2) + '. How many minutes does the trip take?', answer: k * 5, visual: el => V.clocks(el, [hr, m1], [hr, m2]), visualDone: pic,
        steps: [N('Count the jumps of 5. How many?', k, pic, 'The long hand moved from the faint hand to the dark one. Each dot is one jump of 5 minutes. How many dots?', [dotsOf(k, hr, m2, { ghost: m1, sector: { from: m1, to: m2 } }, m1)]),
          N(k + ' lots of 5 minutes = ?', k * 5, pic, 'Each jump is 5 minutes. ' + k + ' lots of 5.', [fives(k, hr, m2, { ghost: m1, sector: { from: m1, to: m2 } }, m1)])],
        explain: { text: 'Count the jumps round the clock in fives.' } };
    }
    if (lv === 6) {
      let hr, m1, m2; do { hr = rnd(1, 10); m1 = pick([35, 40, 45, 50]); m2 = pick([10, 15, 20, 25, 30]); } while (!clear(hr, m1) || !clear(hr + 1, m2));
      const a = 60 - m1;
      return { type: 'num', text: 'Leaves at ' + clockT(hr, m1) + ', arrives at ' + clockT(hr + 1, m2) + '. How many minutes?', say: 'The train leaves at ' + clockT(hr, m1) + ' and arrives at ' + clockT(hr + 1, m2) + '. How many minutes does the trip take?', answer: a + m2, visual: el => V.clocks(el, [hr, m1], [hr + 1, m2]),
        steps: [N(clockT(hr, m1) + ' to ' + clockT(hr + 1, 0) + '. How many minutes?', a, el => V.clock(el, hr + 1, 0, { ghost: m1, sector: { from: m1, to: 60 }, dots: { from: m1, to: 60 } }), 'First go up to the next hour. Count the jumps of 5 from the faint hand to the top.', [fives(a / 5, hr + 1, 0, { ghost: m1, sector: { from: m1, to: 60 } }, m1)]),
          N(clockT(hr + 1, 0) + ' to ' + clockT(hr + 1, m2) + '. How many minutes?', m2, el => V.clock(el, hr + 1, m2, { ghost: 0, sector: { from: 0, to: m2 }, dots: { from: 0, to: m2 } }), 'Now from the top round to the long hand. Count in fives.', [fives(m2 / 5, hr + 1, m2, { ghost: 0, sector: { from: 0, to: m2 } }, 0)]),
          N(a + ' + ' + m2 + ' = ?', a + m2, el => V.equation(el, a + ' + ' + m2), 'Add the two parts. ' + a + ' plus ' + m2 + '.', [H.on(a, m2)])],
        explain: { text: 'Go to the next hour first. Then add the rest.' } };
    }
    if (rnd(0, 1)) {
      const hh = rnd(2, 3), mm = rnd(1, 11) * 5, t = hh * 60 + mm;
      return { type: 'num', text: 'The trip takes ' + hh + ' hours ' + mm + ' minutes. How many minutes?', say: 'The trip takes ' + hh + ' hours and ' + mm + ' minutes. How many minutes is that altogether?', answer: t, visual: el => V.equation(el, hh + ' h ' + mm + ' min'),
        steps: [N(hh + ' lots of 60 = ?', hh * 60, el => V.equation(el, hh + ' × 60'), 'One hour is 60 minutes. ' + hh + ' lots of 60.', [H.skip(hh, 60)]),
          N((hh * 60) + ' + ' + mm + ' = ?', t, el => V.equation(el, (hh * 60) + ' + ' + mm), 'Now add the extra minutes. ' + (hh * 60) + ' plus ' + mm + '.', [H.on(hh * 60, mm)])],
        explain: { text: 'One hour is 60 minutes.' } };
    }
    const t = rnd(13, 23) * 5, over = t - 60;
    return { type: 'num', text: t + ' minutes is 1 hour and ? minutes.', say: 'A trip takes ' + t + ' minutes. That is 1 hour, and how many minutes more?', answer: over, visual: el => V.equation(el, t + ' min'),
      steps: [N(t + ' − 60 = ?', over, el => V.equation(el, t + ' − 60'), 'One hour is 60 minutes. Take 60 away from ' + t + '.', [H.back(t, 60)])],
      explain: { text: 'One hour is 60 minutes.' } };
  }
};

/* ---------- sharing and dividing: fair shares, equal groups, left-overs, and undoing a divide ---------- */
/* what the things being shared are called. A sharing question says what is shared, and between whom (Tony: "Share 8 boomerangs between 4 people. How many does each person get?") */
const THING_NAMES = { 'red-apple': 'apples', amphora: 'jars', 'kiwi-fruit': 'kiwifruit', 'rice-ball': 'rice balls', boomerang: 'boomerangs' };
SKILLS.divide = {
  name: 'Sharing and dividing', strand: 'number', start: 2, max: 7,
  gen(lv, ctx) {
    const thing = (ctx && ctx.thing) || 'red-apple', things = (ctx && ctx.things) || THING_NAMES[thing] || 'things';
    if (lv <= 2) {
      const d = lv <= 1 ? 2 : rnd(3, 5), q = lv <= 1 ? rnd(2, 6) : rnd(2, Math.floor(20 / d)), n = d * q, long = / /.test(things);
      return { type: 'num', text: 'Share ' + n + ' ' + things + ' between ' + d + ' people. How many does each ' + (long ? '' : 'person ') + 'get?', say: 'Share ' + n + ' ' + things + ' fairly between ' + d + ' people. How many does each person get?', answer: q, visual: el => V.share(el, thing, n, d, { people: true }), visualDone: el => V.share(el, thing, n, d, { split: true, nums: true, people: true }),
        steps: [N('One group for each person. Count one group.', q, el => V.share(el, thing, n, d, { split: true, people: true }), 'Share the ' + things + ' into ' + d + ' equal groups, one group for each person. Then count one group.', [H.count(q, { icon: thing, text: 'Tap each one in one group.', say: "Here is one person's group. Tap each one, and count with me." + LAST })], H.deal(n, d, thing, 'How many does one person get?'))],
        explain: { text: 'Sharing fairly gives each person the same.' } };
    }
    if (lv === 3) {
      const g = pick([2, 5, 3, 10, 2, 5]), q = rnd(2, Math.min(6, Math.floor(20 / g))), n = g * q;
      return { type: 'num', text: n + ' ' + things + ' in groups of ' + g + '. How many groups?', say: 'There are ' + n + ' ' + things + '. Put them into groups of ' + g + '. How many groups can you make?', answer: q, visual: el => V.share(el, thing, n, 1), visualDone: el => V.groups(el, thing, n, g),
        steps: [N('Count in ' + g + 's to ' + n + '. How many jumps?', q, el => V.blocks(el, q, g, { rowTags: 'dots' }), 'Make rows of ' + g + '. Count in ' + g + 's until you reach ' + n + '. How many rows is that?', [H.jumps(q, g)])],
        explain: { text: 'Count in ' + g + 's. Each jump is one group.' } };
    }
    if (lv === 4) {
      const g = pick([2, 3, 4, 5, 10, 6]), q = rnd(3, 10), n = g * q;
      return { type: 'num', text: n + ' ÷ ' + g + ' = ?', say: n + ' divided by ' + g + '. How many ' + g + 's make ' + n + '?', answer: q, visual: el => V.equation(el, n + ' ÷ ' + g), visualDone: el => V.blocks(el, q, g, { totals: q, rowTags: true }),
        steps: [N('How many ' + g + 's make ' + n + '?', q, el => V.blocks(el, q, g, { rowTags: 'dots' }), 'Dividing asks: how many ' + g + 's make ' + n + '? Each row is one ' + g + '. Count the rows.', [H.jumps(q, g)])],
        explain: { text: 'Dividing asks how many groups fit.' } };
    }
    if (lv === 5) {
      const g = rnd(3, 5), q = rnd(2, 4), r = rnd(1, g - 1), n = g * q + r, pile = el => V.share(el, thing, n, 1), grouped = el => V.groups(el, thing, n, g, { rest: 'hi' });
      const fit = N('How many ' + g + 's fit in ' + n + '?', q, el => V.groups(el, thing, n, g), 'Make groups of ' + g + '. Count in ' + g + 's, and stop before you pass ' + n + '. How many full groups?', [H.jumps(q, g)]);
      if (rnd(0, 1)) return { type: 'num', text: n + ' ' + things + ' in groups of ' + g + '. How many full groups?', say: 'There are ' + n + ' ' + things + '. Put them into groups of ' + g + '. How many full groups can you make?', answer: q, visual: pile, visualDone: grouped,
        steps: [fit], explain: { text: 'Make full groups. The rest is left over.' } };
      return { type: 'num', text: n + ' ' + things + ' in groups of ' + g + '. How many left over?', say: 'There are ' + n + ' ' + things + '. Put them into groups of ' + g + '. How many are left over?', answer: r, visual: pile, visualDone: grouped,
        steps: [fit, N(q + ' lots of ' + g + ' = ?', q * g, el => V.blocks(el, q, g, { totals: q - 1, rowTags: 'dots' }), q + ' full groups of ' + g + '. Count up in ' + g + 's.', [H.skip(q, g, true)]),
          N(n + ' − ' + (q * g) + ' = ?', r, grouped, 'The full groups use ' + (q * g) + '. Hop from ' + (q * g) + ' up to ' + n + '. How many are left over?', [H.gap(q * g, n)])],
        explain: { text: 'The left-overs are called the remainder.' } };
    }
    if (lv === 6) {
      const g = pick([2, 3, 4]), a = rnd(1, Math.floor(9 / g)), b = rnd(1, Math.floor(9 / g)), T = g * a, U = g * b, n = T * 10 + U, q = a * 10 + b;
      return { type: 'num', text: n + ' ÷ ' + g + ' = ?', say: n + ' divided by ' + g + '. Split it into tens and ones.', answer: q, visual: el => V.baseTen(el, T * 10, U, '+', { eq: n + ' ÷ ' + g + ' = ?' }),
        steps: [N(T + ' tens shared by ' + g + '. How many tens each?', a, el => V.equation(el, T + ' tens ÷ ' + g), 'Tens first. Share ' + T + ' tens between ' + g + '. How many tens does each one get?', [H.deal(T, g, 'keycap-10', 'How many tens in one group?')]),
          N(U + ' ones shared by ' + g + '. How many each?', b, el => V.equation(el, U + ' ones ÷ ' + g), 'Now the ones. Share ' + U + ' ones between ' + g + '.', [H.deal(U, g, 'blue-square')]),
          N(a + ' tens and ' + b + ' ones = ?', q, el => V.equation(el, (a * 10) + ' + ' + b), 'Put them together. ' + (a * 10) + ' plus ' + b + '.', [H.on(a * 10, b)])],
        explain: { text: 'Share the tens. Then share the ones.' } };
    }
    const g = rnd(3, 9), q = rnd(3, 9), n = g * q;
    if (rnd(0, 1)) {
      const form = '? ÷ ' + g + ' = ' + q, sums = shuffle([q + ' × ' + g, q + ' ÷ ' + g, q + ' + ' + g]), eq = el => V.equation(el, form.replace('?', '▢'));
      return { type: 'num', text: form, say: 'What number, divided by ' + g + ', gives ' + q + '?', answer: n, visual: eq, visualDone: el => V.blocks(el, q, g, { totals: q, rowTags: true }),
        steps: [C('Which sum finds it?', sums.map(x => ({ label: x })), sums.indexOf(q + ' × ' + g), eq, 'Work backwards. ' + q + ' groups of ' + g + ' were shared out. Which sum puts them back together?'),
          N(q + ' lots of ' + g + ' = ?', n, el => V.blocks(el, q, g, { totals: q - 1, rowTags: 'dots' }), q + ' lots of ' + g + '. Count up in ' + g + 's.', [H.skip(q, g, true)])],
        explain: { text: 'Multiply to undo a divide.' } };
    }
    const form = n + ' ÷ ? = ' + q;
    return { type: 'num', text: form, say: n + ' divided by what number gives ' + q + '?', answer: g, visual: el => V.equation(el, form.replace('?', '▢')), visualDone: el => V.blocks(el, g, q, { totals: g, rowTags: true }),
      steps: [N('How many ' + q + 's make ' + n + '?', g, el => V.blocks(el, g, q, { rowTags: 'dots' }), 'Count in ' + q + 's until you reach ' + n + '. How many jumps is that?', [H.jumps(g, q)])],
      explain: { text: 'Dividing asks how many groups fit.' } };
  }
};

/* ---------- bank skills: fixed ideas, each with two ways of asking. A retest asks the other way.
   A country adds its own ideas to a skill by calling this again with its tag; inside that country only its ideas are asked. ---------- */
function bankSkill(id, name, strand, ideas, tag) {
  ideas.forEach(i => { i.tag = tag || null; });
  if (SKILLS[id]) { SKILLS[id].bank.push(...ideas); return; }
  const bank = ideas.slice();
  SKILLS[id] = { name, strand, start: 1, max: 1, bank,
    gen(lv, ctx) {
      ctx = ctx || {}; let idea, vi;
      if (ctx.retestOf && ctx.retestOf._idea != null) { idea = bank[ctx.retestOf._idea]; vi = (ctx.retestOf._v + 1) % idea.ask.length; }
      else { const mine = bank.filter(i => i.tag === ctx.tag), from = mine.length ? mine : bank, used = ctx.used || (ctx.used = {}); const pool = from.filter(i => !used[id + bank.indexOf(i)]); idea = pick(pool.length ? pool : from); used[id + bank.indexOf(idea)] = 1; vi = rnd(0, idea.ask.length - 1); }
      const q = idea.ask[vi], order = shuffle(q.o.map((_, i) => i)), opts = order.map(i => q.o[i]), ans = order.indexOf(0);
      const wrong = order.filter(i => i !== 0), two = shuffle([0, wrong[0]]).map(i => q.o[i]);
      const pic = q.pic || idea.pic, hint = q.h || idea.hint, hpic = q.hp || pic;     /* q.hp: a different picture for the help step; q.why: this ask's own closing line */     /* the picture is a clue to the question, never a picture of the answer */
      return { type: 'choice', text: q.t, say: q.s || q.t, options: opts, answer: ans, visual: el => { el.innerHTML = ''; el.append(art(pic, 'hero')); }, _idea: bank.indexOf(idea), _v: vi, _pic: pic,
        steps: [Object.assign(C(q.t, two, two.indexOf(q.o[0]), el => { el.innerHTML = ''; el.append(h('div', { class: 'col' }, art(hpic, 'hero'), h('div', { style: { 'font-size': '1.35rem', 'font-weight': '600', 'text-align': 'center', 'max-width': '18em' } }, hint))); }, hint + ' ' + (q.s || q.t)), { _pic: hpic, nudge: 'Not that one. Read the clue again.' })],
        explain: { text: q.why || idea.why, pic: idea.pic } };
    } };
}
const O = (label, icon) => ({ label, icon });

/* ---------- word skills: meet a word in another language and pick what it means. words: [{native, rom, en, icon, phon}]
   With a real voice for the language (the device's own, or a recording) she listens. Without one she reads the word:
   the game never fakes a language with the wrong voice. ---------- */
function wordSkill(id, name, lang, words) {
  SKILLS[id] = { name, strand: 'world', start: 1, max: 1, words, lang,
    gen(lv, ctx) {
      ctx = ctx || {}; let w;
      if (ctx.retestOf && ctx.retestOf._w) w = ctx.retestOf._w;
      else { const used = ctx.used || (ctx.used = {}); const pool = words.filter(x => !used[id + x.rom]); w = pick(pool.length ? pool : words); used[id + w.rom] = 1; }
      const others = shuffle(words.filter(x => x !== w)), opts = shuffle([w, others[0], others[1]]), two = shuffle([w, others[0]]);
      const heard = Speech.can(lang, w.native) && S.sound;
      const hear = slow => () => Speech.say(w.native, { lang, fallback: w.phon, rate: slow ? .6 : .8 });
      const o = x => ({ label: x.en, icon: x.icon });
      const wordEl = () => [h('div', { class: 'word-ar' + (lang === 'ar' ? '' : ' ltr') }, w.native), w.rom !== w.native ? h('div', { class: 'word-rom' }, w.rom) : null];
      const speaker = (el, withWord) => { el.innerHTML = ''; el.append(h('div', { class: 'col' }, heard ? h('button', { class: 'spkbig', 'aria-label': 'Hear the word', onclick: hear(withWord) }, ic('speaker-high-volume')) : null, (withWord || !heard) ? wordEl() : null)); };
      return { type: 'choice', text: heard ? 'Listen. What does it mean?' : 'Read the word. What does it mean?', say: heard ? 'Listen.' : 'Read the word. Say it out loud. What does it mean?', audio: heard ? hear(false) : null, options: opts.map(o), answer: opts.indexOf(w), visual: el => speaker(el, false), _w: w,
        steps: [{ type: 'choice', text: heard ? 'Listen again, slowly.' : 'Look at the word again.', say: heard ? 'Listen again, slowly.' : 'Look at the word again. Which picture goes with it?', audio: heard ? hear(true) : null, options: two.map(o), answer: two.indexOf(w), visual: el => speaker(el, true), nudge: 'Not that one. Have another look.' }],
        explain: { text: '"' + w.rom + '" means ' + w.en + '.', say: heard ? [{ t: w.native, lang, fallback: w.phon }, 'means ' + w.en + '.'] : 'This word means ' + w.en + '.', pic: w.icon } };
    } };
}
/* ---------- coordinates: where is it on the map? Along first, then up. ---------- */
const MAP_ANIMALS = [['kangaroo', 'kangaroo'], ['koala', 'koala'], ['turtle', 'turtle'], ['crocodile', 'crocodile'], ['parrot', 'parrot'], ['shark', 'shark']];
SKILLS.coords = {
  name: 'Coordinates and maps', strand: 'geometry', start: 1, max: 6,
  gen(lv) {
    const A = shuffle(MAP_ANIMALS.slice()), a = A[0], b = A[1], c = A[2];
    const G = (w, hgt, pts, o) => el => V.coordGrid(el, Object.assign({ w, h: hgt, pts }, o));
    /* the help is worked on the map itself: she taps each step along the bottom (or up the side), and a hop is drawn for each */
    const hop = (n, along, w, hgt, P) => H.walk(n, wk => G(w, hgt, P, { drop: along ? 'x' : 'y', walk: Object.assign({ axis: along ? 'x' : 'y', from: 0 }, wk) }), { text: along ? 'Tap each step along from 0.' : 'Tap each step up from 0.', say: (along ? 'Start at zero, in the corner. Tap each step along the bottom, as far as the dotted line, and count with me.' : 'Start at zero, in the corner. Tap each step up the side, as far as the dotted line, and count with me.') + LAST });
    if (lv <= 2) {
      const w = 6, hgt = 4, x = rnd(1, w), y = rnd(1, hgt), along = lv === 1, P = [{ x, y, art: a[0] }], v = along ? x : y;
      return { type: 'num', text: along ? 'How far along is the ' + a[1] + '?' : 'How far up is the ' + a[1] + '?',
        say: along ? 'This is a map with a grid. Start at zero, in the corner. How many steps along the bottom is the ' + a[1] + '?' : 'Start at zero, in the corner. How many steps up the side is the ' + a[1] + '?', answer: v, visual: G(w, hgt, P), visualDone: G(w, hgt, P, { drop: along ? 'x' : 'y' }),
        steps: [N(along ? 'Follow the dotted line down. Count the steps along.' : 'Follow the dotted line across. Count the steps up.', v, G(w, hgt, P, { drop: along ? 'x' : 'y' }), along ? 'Follow the dotted line down to the bottom. Now count the steps along from zero.' : 'Follow the dotted line across to the side. Now count the steps up from zero.', [hop(v, along, w, hgt, P)])],
        explain: { text: along ? 'Count along the bottom, starting from zero.' : 'Count up the side, starting from zero.' } };
    }
    if (lv === 3) {
      const w = 6, hgt = 5, x = rnd(1, w), y = rnd(1, hgt), mx = rnd(0, 1) === 1; let x2, y2; do { x2 = rnd(1, w); y2 = rnd(1, hgt); } while (x2 === x || y2 === y);
      const P = [{ x, y, art: a[0] }, { x: x2, y: y2, art: b[0] }], v = mx ? x : y;
      return { type: 'num', text: 'The ' + a[1] + ' is at ' + (mx ? '(?, ' + y + ')' : '(' + x + ', ?)') + '. Find the missing number.',
        say: 'A place on the map has two numbers. Along comes first, then up. The ' + a[1] + ' is at ' + (mx ? 'something, ' + y : x + ', something') + '. What is the missing number?', answer: v, visual: G(w, hgt, P), visualDone: G(w, hgt, P, { drop: mx ? 'x' : 'y' }),
        steps: [N(mx ? 'The first number is along. How far along?' : 'The second number is up. How far up?', v, G(w, hgt, P, { drop: mx ? 'x' : 'y' }), mx ? 'The first number says how far along. Follow the dotted line down, and count along from zero.' : 'The second number says how far up. Follow the dotted line across, and count up from zero.', [hop(v, mx, w, hgt, P)])],
        explain: { text: 'Along comes first. Then up.' } };
    }
    if (lv === 4) {
      const w = 6, hgt = 5; let x, y, x2; do { x = rnd(1, w); y = rnd(1, hgt); x2 = rnd(1, w); } while (x === y || y > w || x > hgt || x2 === x || x2 === y);
      const P = [{ x, y, art: a[0] }, { x: x2, y, art: b[0] }, { x: y, y: x, art: c[0] }], opts = shuffle([a, b, c]), two = shuffle([a, b]), o = t => ({ label: cap1(t[1]), icon: t[0] });
      return { type: 'choice', text: 'Who is at (' + x + ', ' + y + ')?', say: 'Along first, then up. Who is at ' + x + ', ' + y + '?', options: opts.map(o), answer: opts.indexOf(a), visual: G(w, hgt, P), visualDone: G(w, hgt, [P[0]], { drop: 'x' }),
        steps: [Object.assign(C('Go along ' + x + ' first. Who is on the yellow line?', two.map(o), two.indexOf(a), G(w, hgt, P, { hiX: x }), 'The first number is ' + x + ', so go along ' + x + '. That is the yellow line. Who is on it?'), { nudge: 'Not that one. Look along the yellow line.' })],
        explain: { text: 'Along first, then up. Like walking, then climbing.' } };
    }
    if (lv === 5) {
      const w = 8, hgt = 5, flat = rnd(0, 1) === 1, lim = flat ? w : hgt, p1 = rnd(0, lim - 3), p2 = rnd(p1 + 2, lim), q = rnd(1, flat ? hgt : w);
      const A1 = flat ? [p1, q] : [q, p1], A2 = flat ? [p2, q] : [q, p2], P = [{ x: A1[0], y: A1[1], art: a[0] }, { x: A2[0], y: A2[1], art: b[0] }], d = p2 - p1;
      return { type: 'num', text: 'How many steps from the ' + a[1] + ' to the ' + b[1] + '?', say: 'The ' + a[1] + ' is at ' + A1[0] + ', ' + A1[1] + '. The ' + b[1] + ' is at ' + A2[0] + ', ' + A2[1] + '. How many steps is it from one to the other?', answer: d, visual: G(w, hgt, P), visualDone: G(w, hgt, P, { seg: [A1, A2] }),
        steps: [N(p2 + ' − ' + p1 + ' = ?', d, G(w, hgt, P, { seg: [A1, A2] }), 'They are on the same line. One is at ' + p1 + ' and the other is at ' + p2 + '. Hop from ' + p1 + ' to ' + p2 + '. How many hops?', [H.walk(d, wk => G(w, hgt, P, { walk: Object.assign({ axis: flat ? 'x' : 'y', at: q, from: p1 }, wk) }), { text: 'Tap each step between the two.', say: 'Start at the ' + a[1] + '. Tap each step to the ' + b[1] + ', and count with me.' + LAST })])],
        explain: { text: 'On the same line, take one number from the other.' } };
    }
    const w = 8, hgt = 6, x = rnd(0, 3), y = rnd(0, 2), dx = rnd(2, w - x - 1), dy = rnd(2, hgt - y - 1), along = rnd(0, 1) === 1, P = [{ x, y, art: a[0] }], s0 = along ? x : y, d0 = along ? dx : dy;
    return { type: 'num', text: 'From (' + x + ', ' + y + ') go ' + dx + ' along, ' + dy + ' up. How far ' + (along ? 'along' : 'up') + ' now?',
      say: 'The ' + a[1] + ' is at ' + x + ', ' + y + '. It goes ' + dx + ' along and ' + dy + ' up. How far ' + (along ? 'along' : 'up') + ' is it now?', answer: s0 + d0, visual: G(w, hgt, P), visualDone: G(w, hgt, P, { move: [x, y, dx, dy] }),
      steps: [N(s0 + ' + ' + d0 + ' = ?', s0 + d0, G(w, hgt, P, { move: [x, y, dx, dy] }), along ? 'Going along changes the first number. It was ' + x + '. Add ' + dx + '.' : 'Going up changes the second number. It was ' + y + '. Add ' + dy + '.', [H.walkOn(s0, 1, d0, wk => G(w, hgt, P, { move: [x, y, dx, dy], walk: Object.assign({ axis: along ? 'x' : 'y', at: along ? y : x + dx, from: s0 }, wk) }), { text: 'Start at ' + s0 + '. Tap each step ' + (along ? 'along.' : 'up.'), say: 'Start at ' + s0 + '. Tap each step ' + (along ? 'along' : 'up') + ' the blue line, and count on with me.' + LAST })])],
      explain: { text: 'Along changes the first number. Up changes the second.' } };
  }
};

/* ---------- temperature: read a scale, compare, and go below zero ---------- */
SKILLS.temp = {
  name: 'Temperature and scales', strand: 'geometry', start: 1, max: 6,
  gen(lv) {
    const T = base => o => el => V.thermo(el, Object.assign({}, base, o));
    /* the help is worked on the thermometer itself: each tap moves a marker one mark up or down */
    const climb = (t, from, by, o) => wk => t(Object.assign({ walk: Object.assign({ from, by }, wk) }, o));
    const below = v => v < 0 ? '−' + (-v) : String(v), belowSay = v => v < 0 ? (-v) + ' below zero' : String(v);
    if (lv === 1) {
      const base = pick([0, 5, 10, 15]), v = base + rnd(1, 4), t = T({ lo: 0, hi: 20, major: 5, minor: 1, v });
      return { type: 'num', text: 'What temperature is it?', say: 'This is a thermometer. The red line shows how hot it is. Each small mark is one degree. What temperature is it?', answer: v, visual: t(), visualDone: t({ from: base }),
        steps: [N('Start at ' + base + '. Count the marks up to the red.', v, t({ from: base }), 'The red line stops just above ' + base + '. Start at ' + base + ', and count up one mark at a time.', [H.walkOn(base, 1, v - base, climb(t, base, 1, { from: base }), { text: 'Start at ' + base + '. Tap the thermometer to climb.', say: 'Start at ' + base + '. Tap the thermometer to climb one mark at a time, and count on with me.' + LAST })])],
        explain: { text: 'Find the number below. Then count the small marks up.' } };
    }
    if (lv === 2) {
      const base = pick([0, 10, 20, 30, 40]), k = rnd(1, 4), v = base + 2 * k, t = T({ lo: 0, hi: 50, major: 10, minor: 2, v });
      return { type: 'num', text: 'Each small mark is 2°. What temperature is it?', say: 'Careful. On this thermometer, each small mark is worth two degrees. What temperature is it?', answer: v, visual: t(), visualDone: t({ from: base }),
        steps: [N('How many small marks above ' + base + '?', k, t({ from: base }), 'The red line stops above ' + base + '. How many small marks above ' + base + ' is it?', [H.walk(k, climb(t, base, 2, { from: base }), { text: 'Tap the thermometer. Count each small mark.', say: 'Tap the thermometer once for each small mark between ' + base + ' and the top of the red, and count with me.' + LAST, ask: 'How many small marks?' })]),
          N(base + ' and ' + k + ' lots of 2 = ?', v, t({ from: base }), 'Each mark is worth two. Start at ' + base + ', and count on in twos, ' + k + ' times.', [H.walkOn(base, 2, k, climb(t, base, 2, { from: base }), { text: 'Start at ' + base + '. Each tap is 2 degrees.', say: 'Start at ' + base + '. Tap the thermometer. Each tap climbs one mark, worth two degrees. Count on with me.' + LAST, askSay: 'You counted on in twos from ' + base + '. What number comes last?' })])],
        explain: { text: 'First check what each small mark is worth.' } };
    }
    if (lv === 3) {
      const a = rnd(4, 15), d = rnd(4, 14), b = a + d, sc = { lo: 0, hi: 30, major: 10, minor: 1 };
      return { type: 'num', text: 'Morning ' + a + '°. Afternoon ' + b + '°. How much warmer?', say: 'In the morning it was ' + a + ' degrees. In the afternoon it was ' + b + ' degrees. How many degrees warmer was the afternoon?', answer: d,
        visual: el => V.thermos(el, Object.assign({ v: a, cap: 'Morning' }, sc), Object.assign({ v: b, cap: 'Afternoon' }, sc)),
        steps: [N(b + ' − ' + a + ' = ?', d, el => V.line(el, a - 2, b + 2, [{ from: a, to: b, label: '?' }], [a, b]), 'How far is it from ' + a + ' up to ' + b + '? Hop up one degree at a time, and count the hops.', [H.walk(d, wk => el => V.thermo(el, Object.assign({ v: b, from: a, walk: Object.assign({ from: a, by: 1 }, wk) }, sc)), { text: 'Start at ' + a + '. Tap to climb to ' + b + '.', say: 'This is the afternoon thermometer. The ring marks the morning, ' + a + ' degrees. Tap the thermometer to climb one degree at a time, up to ' + b + ', and count with me.' + LAST, ask: 'How many degrees did it climb?' })])],
        explain: { text: 'Count up from the cooler one to the warmer one.' } };
    }
    if (lv === 4) {
      const k = rnd(1, 9), t = T({ lo: -10, hi: 10, major: 5, minor: 1, v: -k });
      return { type: 'num', text: 'How many degrees below zero is it?', say: 'Brrr. Water freezes at zero degrees. This thermometer has gone below zero. How many degrees below zero is it?', answer: k, visual: t(), visualDone: t({ from: 0 }),
        steps: [N('Start at 0. Count the marks down to the red.', k, t({ from: 0 }), 'Find zero, on the dotted line. Now count the small marks down to the top of the red.', [H.walk(k, climb(t, 0, -1, { from: 0 }), { text: 'Tap the thermometer. Count each mark below 0.', say: 'Start at zero. Tap the thermometer to go down one mark at a time, and count with me.' + LAST, ask: 'How many marks below zero?' })])],
        explain: { text: 'Below zero we count down, and write a minus sign.' } };
    }
    if (lv === 5) {
      const a = rnd(2, 8), more = rnd(2, 9), f = a + more, t = T({ lo: -10, hi: 10, major: 5, minor: 1, v: a });
      return { type: 'num', text: 'It was ' + a + '°. It fell ' + f + '°. How far below zero?', say: 'In the desert, nights get very cold. It was ' + a + ' degrees. Then the temperature fell by ' + f + ' degrees. How many degrees below zero is it now?', answer: more, visual: t(), visualDone: t({ from: 0 }),
        steps: [N('From ' + a + '° down to 0°. How many degrees?', a, t({ from: 0 }), 'First it has to fall to zero. How many degrees is it from ' + a + ' down to zero?', [H.walk(a, climb(t, a, -1, { from: 0 }), { text: 'Start at ' + a + '. Tap down to 0.', say: 'Start at ' + a + '. Tap the thermometer to fall one degree at a time, down to zero, and count with me.' + LAST, ask: 'How many degrees down to zero?' })]),
          N(f + ' − ' + a + ' = ?', more, el => V.line(el, -10, 10, [{ from: a, to: 0, label: '−' + a }, { from: 0, to: -more, label: '?' }], [a, 0], [-more]), 'It fell ' + f + ' altogether. ' + a + ' of those got it down to zero. How many more are left to fall?', [H.walkOn(a, -1, f, climb(t, a, -1, {}), { land: more, fmt: below, speak: belowSay, text: 'Start at ' + a + '. Tap ' + f + ' times to fall.', say: 'Act it out. Start at ' + a + ' degrees. It falls ' + f + ' degrees, so tap the thermometer ' + f + ' times. Watch it go through zero.' + LAST, ask: 'How far below zero is it now?', askSay: 'It fell ' + f + ' degrees from ' + a + '. Read the thermometer. How far below zero is it now?' })])],
        explain: { text: 'Get down to zero first. Then keep going.' } };
    }
    const k = rnd(1, 8), d = rnd(3, 15), sc = { lo: -10, hi: 20, major: 5, minor: 1 };
    return { type: 'num', text: 'Night: ' + k + '° below zero. Day: ' + d + '°. How much warmer?', say: 'At night it was ' + k + ' degrees below zero. In the day it was ' + d + ' degrees. How many degrees warmer was the day?', answer: k + d,
      visual: el => V.thermos(el, Object.assign({ v: -k, cap: 'Night' }, sc), Object.assign({ v: d, cap: 'Day' }, sc)),
      steps: [N('From ' + k + ' below zero up to 0. How many?', k, el => V.thermo(el, Object.assign({ v: -k, from: 0 }, sc)), 'First climb up to zero. How many degrees is that?', [H.walk(k, wk => el => V.thermo(el, Object.assign({ v: -k, from: 0, walk: Object.assign({ from: -k, by: 1 }, wk) }, sc)), { text: 'Tap the thermometer. Climb up to 0.', say: 'Start at the top of the red. Tap the thermometer to climb one degree at a time, up to zero, and count with me.' + LAST, ask: 'How many degrees up to zero?' })]),
        N(k + ' + ' + d + ' = ?', k + d, el => V.line(el, -k - 1, d + 1, [{ from: -k, to: 0, label: '+' + k }, { from: 0, to: d, label: '+' + d }], [-k, 0, d]), 'Up to zero is ' + k + '. Then on up to ' + d + '. Add the two parts.', [H.walkOn(k, 1, d, wk => el => V.thermo(el, Object.assign({ v: d, from: 0, walk: Object.assign({ from: 0, by: 1 }, wk) }, sc)), { text: 'Up to 0 was ' + k + '. Keep counting up.', say: 'You climbed ' + k + ' degrees to reach zero. Now tap the thermometer to keep climbing, up to ' + d + ', and count on from ' + k + ' with me.' + LAST, askSay: 'You counted on from ' + k + '. What number comes last?' })])],
      explain: { text: 'Up to zero, then on up. Add the two parts.' } };
  }
};

/* ---------- place value: counters on a chart. Every hands-on tool here is worked on the chart itself: she taps the counters and counts on. ---------- */
const PLACE_ONE = ['one', 'ten', 'hundred', 'thousand'];
SKILLS.place = {
  name: 'Place value and big numbers', strand: 'number', start: 1, max: 6,
  gen(lv) {
    const chart = (n, o) => el => V.placeChart(el, n, o), dig = (n, p) => Math.floor(n / PLACE[p].v) % 10;
    /* count the counters of one column, on from "start" */
    const col = (n, p, start, o) => H.walkOn(start, PLACE[p].v, dig(n, p), wk => chart(n, Object.assign({ hi: p, walk: Object.assign({ order: V.placeOrder(n, [p]) }, wk) }, o)),
      { text: start ? 'Start at ' + start + '. Tap each ' + PLACE_ONE[p] + '.' : p ? 'Tap each ' + PLACE_ONE[p] + '. Count in ' + PLACE[p].v + 's.' : 'Tap each one. Count with me.',
        say: (start ? 'Start at ' + start + '. ' : '') + 'Each counter in this column is worth ' + PLACE[p].v + '. Tap each one, and count ' + (start ? 'on ' : '') + 'with me.' + LAST });
    /* count every counter, biggest first */
    const all = (n, places, start, o) => H.walkSteps(start, V.placeOrder(n, places).map(c => PLACE[c[0]].v), wk => chart(n, Object.assign({ walk: Object.assign({ order: V.placeOrder(n, places) }, wk) }, o)), start ? { text: 'Start at ' + start + '. Tap each counter.', say: 'Start at ' + start + '. Tap each counter that is left, biggest first, and count on with me.' + LAST } : null);
    const READ = 'What number do the counters make?';
    if (lv <= 1) {
      const t = rnd(1, 9), o = rnd(1, 9), n = t * 10 + o;
      return { type: 'num', text: READ, say: 'This is a place value chart. Each yellow counter is worth ten. Each red counter is worth one. What number do the counters make?', answer: n, visual: chart(n), visualDone: chart(n, { digits: true }),
        steps: [N('Count the tens. What do they make?', t * 10, chart(n, { hi: 1 }), 'Look at the tens column. Each counter is worth ten. Count in tens. What do they make?', [col(n, 1, 0)]),
          N(t * 10 + ' and ' + o + ' more = ?', n, chart(n, { hi: 0 }), 'Now the ones. Start at ' + (t * 10) + ', and count on ' + o + '.', [col(n, 0, t * 10)])],
        explain: { text: 'Count the tens first. Then count on the ones.' } };
    }
    if (lv === 2) {
      const hd = rnd(1, 9), t = rnd(1, 9), o = rnd(1, 9), n = hd * 100 + t * 10 + o;
      return { type: 'num', text: READ, say: 'Now there is a hundreds column too. Each blue counter is worth one hundred. What number do the counters make?', answer: n, visual: chart(n), visualDone: chart(n, { digits: true }),
        steps: [N('Count the hundreds. What do they make?', hd * 100, chart(n, { hi: 2 }), 'Each blue counter is worth one hundred. Count in hundreds. What do they make?', [col(n, 2, 0)]),
          N(hd * 100 + ' and ' + t + ' tens = ?', hd * 100 + t * 10, chart(n, { hi: 1 }), 'Now the tens. Start at ' + (hd * 100) + ', and count on in tens.', [col(n, 1, hd * 100)]),
          N((hd * 100 + t * 10) + ' and ' + o + ' ones = ?', n, chart(n, { hi: 0 }), 'Last, the ones. Start at ' + (hd * 100 + t * 10) + ', and count on.', [col(n, 0, hd * 100 + t * 10)])],
        explain: { text: 'Hundreds, then tens, then ones.' } };
    }
    if (lv === 3) {
      const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), n = ds[0] * 100 + ds[1] * 10 + ds[2], p = rnd(1, 2), d = dig(n, p), names = ['Hundreds', 'Tens', 'Ones'], two = shuffle([names[2 - p], names[p === 1 ? 0 : 1]]);
      return { type: 'num', text: 'In ' + n + ', what is the ' + d + ' worth?', say: 'Look at the number ' + n + '. One digit has a ring round it. What is that ' + d + ' worth?', answer: d * PLACE[p].v, visual: chart(n, { big: n, mark: p }), visualDone: chart(n, { big: n, mark: p, hi: p }),
        steps: [Object.assign(C('Which column is the ' + d + ' in?', two.map(x => ({ label: x })), two.indexOf(names[2 - p]), chart(n, { big: n, mark: p }), 'Find the digit with the ring. Count the columns from the right: ones, tens, hundreds. Which column is it in?'), { nudge: 'Not that one. Count the columns from the right.' }),
          N(d + ' ' + PLACE[p].name + ' = ?', d * PLACE[p].v, chart(n, { big: n, mark: p, hi: p }), 'The ' + d + ' is in the ' + PLACE[p].name + ' column. ' + d + ' ' + PLACE[p].name + '. Count in ' + PLACE[p].v + 's.', [col(n, p, 0, { big: n, mark: p })])],
        explain: { text: 'The further left a digit sits, the more it is worth.' } };
    }
    if (lv === 4) {
      const th = rnd(1, 5), gap = rnd(1, 2), hd = gap === 2 ? 0 : rnd(1, 4), t = gap === 1 ? 0 : rnd(1, 4), o = rnd(1, 4), n = th * 1000 + hd * 100 + t * 10 + o, opts = shuffle(['0', '1', '10']);
      return { type: 'num', text: READ, say: 'Now there are thousands. And one column is empty. What number do the counters make?', answer: n, visual: chart(n), visualDone: chart(n, { digits: true }),
        steps: [N('Count the thousands. What do they make?', th * 1000, chart(n, { hi: 3 }), 'Each purple counter is worth one thousand. Count in thousands. What do they make?', [col(n, 3, 0)]),
          Object.assign(C('One column is empty. Which digit goes there?', opts.map(x => ({ label: x })), opts.indexOf('0'), chart(n, { hi: gap }), 'The ' + PLACE[gap].name + ' column has no counters. Which digit do we write for an empty column?'), { nudge: 'Not that one. How many counters are in that column?' }),
          N('Start at ' + (th * 1000) + '. Count on the rest.', n, chart(n), 'Start at ' + (th * 1000) + '. Count on the counters that are left.', [all(n, [2, 1, 0], th * 1000)])],
        explain: { text: 'An empty column is a zero. It holds the place.' } };
    }
    if (lv === 5) {
      const p = rnd(1, 3), more = rnd(0, 1) === 1, ds = [rnd(1, 4), rnd(1, 4), rnd(1, 4), rnd(1, 3)]; ds[p] = more ? rnd(1, 4) : rnd(2, 5);
      const n = ds[3] * 1000 + ds[2] * 100 + ds[1] * 10 + ds[0], ans = n + (more ? 1 : -1) * PLACE[p].v, names = ['Thousands', 'Hundreds', 'Tens'], opts = shuffle(names.slice());
      return { type: 'num', text: 'What is ' + PLACE[p].v + (more ? ' more than ' : ' less than ') + n + '?', answer: ans, visual: chart(n, { big: n }), visualDone: chart(ans, { digits: true, hi: p }),
        steps: [Object.assign(C('Which column changes?', opts.map(x => ({ label: x })), opts.indexOf(names[3 - p]), chart(n, { big: n }), (more ? 'We are adding ' : 'We are taking away ') + PLACE[p].v + '. That is one ' + PLACE_ONE[p] + '. Which column changes?'), { nudge: 'Not that one. Which counters are worth ' + PLACE[p].v + '?' }),
          N('One ' + (more ? 'more ' : 'less ') + PLACE_ONE[p] + '. What number now?', ans, chart(ans, { hi: p, ring: more ? [p, dig(ans, p) - 1] : null }), more ? 'One more counter has gone into the ' + PLACE[p].name + ' column. The other columns have not changed. What number is it now?' : 'One counter has been taken out of the ' + PLACE[p].name + ' column. The other columns have not changed. What number is it now?', [all(ans, [3, 2, 1, 0], 0, { hi: p })])],
        explain: { text: 'Only one column changes. The rest stay the same.' } };
    }
    if (rnd(0, 1)) {
      const a = rnd(2, 9);
      return { type: 'num', text: 'A rocket flies ' + a + ' km each second. How far in 100 seconds?', say: 'A rocket flies ' + a + ' kilometres every second. How far does it fly in 100 seconds?', answer: a * 100, visual: chart(a, { cols: 3, big: a + ' × 100' }), visualDone: chart(a * 100, { cols: 3, digits: true }),
        steps: [N('First, 10 seconds. ' + a + ' lots of 10 = ?', a * 10, chart(a * 10, { cols: 3, hi: 1 }), 'Do it in two jumps. First, ten seconds. ' + a + ' lots of ten. Each one becomes a ten.', [col(a * 10, 1, 0, { cols: 3 })]),
          N('Ten times more again. ' + (a * 10) + ' lots of 10 = ?', a * 100, chart(a * 100, { cols: 3, hi: 2 }), 'Now ten times more again. Each ten becomes a hundred. Count in hundreds.', [col(a * 100, 2, 0, { cols: 3 })])],
        explain: { text: 'Times 10 moves every digit one place left.' } };
    }
    const a = rnd(1, 4), b = rnd(1, 9), ab = a * 10 + b, n = ab * 10;
    return { type: 'num', text: ab + ' × 10 = ?', say: ab + ' times ten. Every digit moves one place to the left.', answer: n, visual: chart(ab, { cols: 3, big: ab + ' × 10' }), visualDone: chart(n, { cols: 3, digits: true }),
      steps: [N(a + ' tens become ' + a + ' hundreds. That makes?', a * 100, chart(n, { cols: 3, hi: 2 }), 'Times ten makes each ten into a hundred. ' + a + ' hundreds. Count in hundreds.', [col(n, 2, 0, { cols: 3 })]),
        N(b + ' ones become ' + b + ' tens. ' + (a * 100) + ' and ' + b + ' tens = ?', n, chart(n, { cols: 3, hi: 1 }), 'Times ten makes each one into a ten. Start at ' + (a * 100) + ', and count on in tens.', [col(n, 1, a * 100, { cols: 3 })])],
      explain: { text: 'Times 10 moves every digit one place left.' } };
  }
};

/* ---------- area and perimeter, on solar panels made of squares. The help is worked on the panel: she taps its squares, its edges or its rows. ---------- */
const PANELS = ['X..|X..|XXX', 'XXX|.X.|.X.', 'XXXX|X...|X...', '.X.|XXX|.X.', 'XX..|XXXX|..XX', 'X..X|XXXX|X..X', 'XXXXX|X...X|X...X', 'XX..|XX..|XXXX|XXXX', 'XXX|X..|XXX|X..', '.XX.|XXXX|XXXX|.XX.'].map(t => { const rows = t.split('|'), cells = []; rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch === 'X') cells.push([x, y]); })); return { w: rows[0].length, h: rows.length, cells }; });
SKILLS.area = {
  name: 'Area and perimeter', strand: 'geometry', start: 1, max: 6,
  gen(lv) {
    const G = o => el => V.gridShape(el, o), seq = n => Array.from({ length: n }, (_, i) => i);
    const squares = (base, order, o) => H.walk(order.length, wk => G(Object.assign({}, base, { walk: Object.assign({ mode: 'cells', order }, wk) })), Object.assign({ text: 'Tap each square. Count with me.', say: 'Tap each square, one at a time, and count with me.' + LAST, ask: 'How many squares?' }, o));
    if (lv <= 2) {
      const sh = lv <= 1 ? (() => { const w = rnd(2, 5), hh = rnd(2, 3); return { w, h: hh, cells: V.rectCells(w, hh) }; })() : pick(PANELS), A = sh.cells.length;
      return { type: 'num', text: lv <= 1 ? 'Area: how many squares cover the panel?' : 'What is the area of this panel?', say: lv <= 1 ? 'This is a solar panel for a space station. Its area is the number of squares that cover it. How many squares cover the panel?' : 'This panel is an odd shape. Its area is still the number of squares that cover it. What is its area?', answer: A, visual: G(sh),
        steps: [N('Count every square of the panel.', A, G(sh), 'Touch each square once, and count.', [squares(sh, sh.cells)])],
        explain: { text: 'Area is how many squares cover a shape.' } };
    }
    if (lv === 3) {
      const w = rnd(2, 5), hh = rnd(2, 4), P = 2 * (w + hh), base = { w, h: hh };
      return { type: 'num', text: 'Perimeter: how far around the panel?', say: 'Perimeter means the distance all the way around the outside. Each edge of a square is one step. How many steps is it around the panel?', answer: P, visual: G(base),
        steps: [N('Walk around the outside. Count the edges.', P, G(base), 'Start at a corner. Count each edge as you go around the outside, back to where you started.', [H.walk(P, wk => G(Object.assign({}, base, { walk: Object.assign({ mode: 'edges', order: V.rectEdges(w, hh) }, wk) })), { text: 'Tap each edge around the outside.', say: 'Start at a corner. Tap each edge around the outside, and count with me.' + LAST, ask: 'How many edges?' })])],
        explain: { text: 'Perimeter is the distance around the outside.' } };
    }
    if (lv === 4) {
      const w = rnd(4, 8), hh = rnd(3, 6), A = w * hh, base = { w, h: hh };
      const rows = (o, on) => (on ? H.walkOn(0, w, hh, wk => G(Object.assign({}, base, { walk: Object.assign({ mode: 'rows', order: seq(hh) }, wk) })), o) : H.walk(hh, wk => G(Object.assign({}, base, { walk: Object.assign({ mode: 'rows', order: seq(hh) }, wk) })), o));
      return { type: 'num', text: 'What is the area of this panel?', say: 'This panel is big. Counting every square is slow. Count one row, then count the rows. What is its area?', answer: A, visual: G(base),
        steps: [N('How many squares in one row?', w, G(Object.assign({ hiRow: 0 }, base)), 'Look at the gold row. How many squares are in it?', [squares(Object.assign({ hiRow: 0 }, base), seq(w).map(x => [x, 0]), { text: 'Tap each square in the gold row.' })]),
          N('How many rows?', hh, G(Object.assign({ hiCol: 0 }, base)), 'Every row is the same. The gold squares mark one for each row. How many rows?', [rows({ text: 'Tap each row. Count the rows.', say: 'Tap each row, top to bottom, and count with me.' + LAST, ask: 'How many rows?' })]),
          N(hh + ' rows of ' + w + ' = ?', A, G(base), hh + ' rows, with ' + w + ' squares in each. Count in ' + w + 's.', [rows({ text: 'Tap each row. Count in ' + w + 's.', say: 'Each row has ' + w + ' squares. Tap each row, and count in ' + w + 's with me.' + LAST }, true)])],
        explain: { text: 'Rows times squares in a row gives the area.' } };
    }
    if (lv === 5) {
      let w, hh; do { w = rnd(3, 8); hh = rnd(2, 5); } while (w + hh > 12 || w === hh);
      const half = w + hh, P = 2 * half, dims = [w + ' m', hh + ' m'], plain = { w, h: hh, grid: false, dims }, lined = { w, h: hh, faint: true, dims }, E = V.rectEdges(w, hh);
      return { type: 'num', text: 'A panel is ' + w + ' m long, ' + hh + ' m wide. How far around?', say: 'A solar panel is ' + w + ' metres long and ' + hh + ' metres wide. How far is it all the way around? That is its perimeter.', answer: P, visual: G(plain),
        steps: [N('Walk along the top and one side. How far?', half, G(lined), 'Start at a corner. Walk along the top, ' + w + ' metres. Then down the side, ' + hh + ' metres. How far is that?', [H.walk(half, wk => G(Object.assign({}, lined, { walk: Object.assign({ mode: 'edges', order: E.slice(0, half) }, wk) })), { text: 'Tap each metre along two sides.', say: 'Each edge is one metre. Tap each metre along the top, then down the side, and count with me.' + LAST, ask: 'How many metres?' })]),
          N('The other two sides match. ' + half + ' + ' + half + ' = ?', P, G(lined), 'The bottom is as long as the top. The other side matches too. So add the same again.', [H.walkOn(half, 1, half, wk => G(Object.assign({}, lined, { walk: Object.assign({ mode: 'edges', order: E.slice(half) }, wk) })), { text: 'Start at ' + half + '. Tap the other two sides.', say: 'You have walked ' + half + ' metres. Tap each metre along the bottom and up the last side, and count on with me.' + LAST })])],
        explain: { text: 'Add two sides. Then double it.' } };
    }
    const w = rnd(3, 8), hh = rnd(2, 6), A = w * hh;
    return { type: 'num', text: 'A panel has ' + A + ' squares in rows of ' + w + '. How many rows?', say: 'A solar panel has an area of ' + A + ' squares. Each row has ' + w + ' squares. How many rows does it have?', answer: hh, visual: G({ w, h: 1 }), visualDone: G({ w, h: hh }),
      steps: [N('Count in ' + w + 's to ' + A + '. How many rows?', hh, G({ w, h: hh, rowsShown: 1 }), 'Add one row at a time. Count in ' + w + 's until you reach ' + A + '. How many rows is that?', [H.walk(hh, wk => G({ w, h: hh, rowsShown: 0, walk: Object.assign({ mode: 'rows', order: seq(hh) }, wk) }), { text: 'Tap each row of ' + w + '. Count the rows.', say: 'Each row has ' + w + ' squares. Tap one row at a time until the panel is full, and count the rows with me.' + LAST, ask: 'How many rows?' })])],
      explain: { text: 'Divide the area by one side to find the other.' } };
  }
};

SKILLS.coding = { name: 'Coding (sequences and repeats)', strand: 'patterns', start: 1, max: 1, gen() { return null; } };

/* ---------- money: Brazilian reais and centavos. Counting coins and notes, giving change, and reading R$2.75 as 2 reais and 75 centavos (her first decimals).
   Every answer is a whole number: reais at Levels 1 to 3, centavos from Level 4. Brazil writes R$2,75 with a comma; the game uses the point she is taught in New Zealand.
   The help is worked on the money itself: she taps each coin and note, in any order, and it takes the running total. ---------- */
const SNACKS = [['coconut', 'A coconut'], ['mango', 'A mango'], ['ear-of-corn', 'Corn'], ['soft-ice-cream', 'An ice cream'], ['tropical-drink', 'Juice'], ['popcorn', 'Popcorn'], ['pineapple', 'A pineapple'], ['watermelon', 'Watermelon']];
const REAIS = 'ray-ice', REAL = 'ray-al';     /* how the English narrator says "reais" and "real" */
SKILLS.money = {
  name: 'Money and decimals', strand: 'number', start: 1, max: 6,
  /* Brazil counts in reais; everywhere else she counts in New Zealand dollars and cents, her own money (Tony, 11 October) */
  gen(lv, ctx) { return ctx && ctx.tag === 'brazil' ? SKILLS.money.genBR(lv) : moneyNZ(lv); },
  genBR(lv) {
    const M = o => el => V.money(el, o), desc = a => a.slice().sort((x, y) => y - x), sum = a => a.reduce((x, y) => x + y, 0), seq = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0)), rS = v => 'R$' + v, cS = v => v + 'c';
    /* tap the coins and notes named in "order", counting on from "start". unit 100 counts in reais, unit 1 in centavos */
    const count = (items, order, start, unit, o, words) => H.walkSteps(start, order.map(i => items[i] / unit), wk => M(Object.assign({ items, walk: Object.assign({ order }, wk) }, o)),
      Object.assign({ fmt: unit === 100 ? rS : cS, text: start ? 'Start at ' + start + '. Tap the rest.' : 'Tap each one. Count on with me.', say: (start ? 'Start at ' + start + '. ' : '') + 'Tap each coin and note, biggest first, and count on with me.' + LAST }, words));
    if (lv <= 2) {
      let items; do { items = lv <= 1 ? desc(Array(rnd(1, 3)).fill(100).concat(Array(rnd(1, 2)).fill(200), rnd(0, 1) ? [500] : [])) : desc([pick([2000, 1000]), pick([1000, 500]), pick([500, 200]), pick([200, 100])].concat(rnd(0, 1) ? [100] : [])); } while (items.length < 3);
      const total = sum(items) / 100, all = seq(items.length), first = (items[0] + items[1]) / 100;
      return { type: 'num', text: 'How many reais are here?', say: lv <= 1 ? 'This is money from Brazil. One is called a ' + REAL + '. More than one are called ' + REAIS + '. The gold and silver coin is one ' + REAL + '. Each note says how many it is worth. How many ' + REAIS + ' are here?' : 'More notes this time. Each note says how many ' + REAIS + ' it is worth. How many ' + REAIS + ' are here altogether?', answer: total, visual: M({ items }), visualDone: M({ items, cap: 'R$' + total }),
        steps: lv <= 1 ? [N('Start with the biggest. Count on the rest.', total, M({ items }), 'Start with the biggest one, and count on the others.', [count(items, all, 0, 100)])]
          : [N('Add the two biggest notes.', first, M({ items, hi: [0, 1] }), 'Start with the two biggest notes, in the dotted rings. What do they make together?', [count(items, [0, 1], 0, 100, { hi: [0, 1] }, { text: 'Tap the two biggest notes.', say: 'Tap the two notes in the dotted rings, and count on with me.' + LAST })]),
            N(first + ' and the rest = ?', total, M({ items }), 'You have ' + first + ' so far. Now count on the others.', [count(items, all.slice(2), first, 100)])],
        explain: { text: 'Start with the biggest. Then count on.' } };
    }
    if (lv === 3) {
      /* change, counted up the way a shopkeeper does it, with the money Brazil really has: a R$1 coin, and R$2 and R$5 notes (Tony, 8 October: "this would likely be 2 x R$2 and 1 x R$5").
         Change of exactly 2 or 5 is left out: one note would print the answer. The smaller money comes first, so the count lands on a round number before the R$5 */
      const sn = pick(SNACKS), paid = pick([5, 10, 10, 20]), d = pick([3, 4, 6, 7, 8, 9].filter(v => v < paid)), price = paid - d, notes = ({ 3: [1, 2], 4: [2, 2], 6: [1, 5], 7: [2, 5], 8: [1, 2, 5], 9: [2, 2, 5] })[d].map(v => v * 100), base = { tag: { icon: sn[0], price: price * 100 }, paid: paid * 100 };
      return { type: 'num', text: sn[1] + ' costs R$' + price + '. You pay R$' + paid + '. How much change?', say: sn[1] + ' costs ' + price + ' ' + REAIS + '. You pay with a ' + paid + ' note. How many ' + REAIS + ' do you get back as change?', answer: d, visual: M(base), visualDone: M(Object.assign({ items: notes, cap: 'R$' + paid + ' − R$' + price, reach: price * 100 }, base)),
        steps: [N('Count up from ' + price + ' to ' + paid + '. Add up the change.', d, M(Object.assign({ items: notes, ghost: true, reach: price * 100 }, base)), 'Change is what is left over. The shopkeeper counts it up, from ' + price + ' to ' + paid + ', with coins and notes. Add up the money she gives you back.',
          [H.walkSteps(0, notes.map(v => v / 100), wk => M(Object.assign({ items: notes, ghost: true, reach: price * 100, walk: Object.assign({ order: seq(notes.length) }, wk) }, base)), { fmt: rS, text: 'Tap the change. Add it up.', say: 'The shopkeeper counts your change, up from ' + price + ' to ' + paid + '. Tap each coin and note she gives you, and add them up with me.' + LAST, ask: 'How many reais of change?', askSay: 'You counted up to ' + paid + '. How many ' + REAIS + ' of change is that altogether?' })])],
        explain: { text: 'Count up from the price to what you paid.' } };
    }
    if (lv === 4) {
      let items; do { items = desc(shuffle([50, 25, 25, 10, 10, 10, 5, 5]).slice(0, rnd(3, 5))); } while (sum(items) > 100);
      const total = sum(items);
      return { type: 'num', text: 'How many centavos are here?', say: 'These small coins are centavos. One hundred centavos make one ' + REAL + '. Each coin says how many centavos it is worth. How many centavos are here?', answer: total, visual: M({ items }), visualDone: M({ items, cap: total + ' centavos' }),
        steps: [N('Start with the biggest coin. Count on.', total, M({ items }), 'Start with the biggest coin, and count on the others.', [count(items, seq(items.length), 0, 1)])],
        explain: { text: 'One hundred centavos make one real.' } };
    }
    if (lv === 5) {
      let small; do { small = desc(shuffle([50, 25, 25, 10, 5]).slice(0, rnd(2, 3))); } while (sum(small) >= 100);
      const n1 = rnd(1, 3), items = Array(n1).fill(100).concat(small), rest = sum(small), total = n1 * 100 + rest;
      return { type: 'num', text: 'R$1 is 100 centavos. How many centavos are here?', say: 'Now there are both. Each gold and silver coin is one ' + REAL + ', and one ' + REAL + ' is 100 centavos. How many centavos are here altogether?', answer: total, visual: M({ items }), visualDone: M({ items, cap: brl(total) }),
        steps: [N('Count the reais. Each one is 100 centavos.', n1 * 100, M({ items, hi: seq(n1) }), 'First the ' + REAIS + ', in the dotted rings. Each one is worth 100 centavos. Count in hundreds.', [count(items, seq(n1), 0, 1, { hi: seq(n1) }, { text: 'Tap each real. Count in 100s.', say: 'Tap each ' + REAL + ', and count in hundreds with me.' + LAST })]),
          N((n1 * 100) + ' and the small coins = ?', total, M({ items }), 'Now the small coins. Start at ' + (n1 * 100) + ', and count on.', [count(items, seq(small.length, n1), n1 * 100, 1)])],
        explain: { text: brl(total) + ' means ' + n1 + (n1 === 1 ? ' real and ' : ' reais and ') + rest + ' centavos.' } };
    }
    const sn = pick(SNACKS), paid = pick([5, 10]), w = rnd(0, 2), cents = pick([25, 50, 75]), whole = paid - w - 1, price = whole * 100 + cents, up = 100 - cents, change = w * 100 + up, base = { tag: { icon: sn[0], price }, paid: paid * 100 };
    const quarters = Array(up / 25).fill(25), ones = Array(w).fill(100), both = ones.concat(quarters);
    const steps = [N('From ' + brl(price) + ' up to R$' + (whole + 1) + '. How many centavos?', up, M(Object.assign({ items: quarters, ghost: true }, base)), 'First count up to the next whole ' + REAL + '. From ' + cents + ' centavos up to 100. Each coin here is 25 centavos.',
      [H.walkOn(0, 25, up / 25, wk => M(Object.assign({ items: quarters, ghost: true, walk: Object.assign({ order: seq(up / 25) }, wk) }, base)), { fmt: cS, text: 'Tap each coin. Count in 25s.', say: 'Each coin is 25 centavos. Tap one at a time, up to the next whole ' + REAL + ', and count in twenty-fives with me.' + LAST })])];
    if (w) steps.push(N('From R$' + (whole + 1) + ' up to R$' + paid + '. How many centavos?', w * 100, M(Object.assign({ items: ones, ghost: true }, base)), 'Now count up the whole ' + REAIS + ', from ' + (whole + 1) + ' to ' + paid + '. Each one is 100 centavos.',
      [H.walkOn(0, 100, w, wk => M(Object.assign({ items: ones, ghost: true, walk: Object.assign({ order: seq(w) }, wk) }, base)), { fmt: cS, text: 'Tap each real. Count in 100s.', say: 'Each coin is one ' + REAL + ', worth 100 centavos. Tap one at a time, and count in hundreds with me.' + LAST })]),
      N(up + ' + ' + (w * 100) + ' = ?', change, M(Object.assign({ items: both }, base)), 'Put the two parts together. ' + (w * 100) + ' and ' + up + ' more.', [count(both, seq(both.length), 0, 1, base)]));
    return { type: 'num', text: sn[1] + ' costs ' + brl(price) + '. You pay R$' + paid + '. How many centavos change?', say: sn[1] + ' costs ' + whole + ' ' + REAIS + ' and ' + cents + ' centavos. You pay with a ' + paid + ' note. How many centavos do you get back as change?', answer: change,
      visual: M(base), visualDone: M(Object.assign({ items: both, cap: brl(change) + ' change' }, base)), steps, explain: { text: 'Count up to the next real. Then count the reais.' } };
  }
};

/* ---------- money in New Zealand dollars and cents, at the same six levels as Brazil's: dollars (1 to 2), change (3), cents (4), dollars and cents (5), change in cents (6).
   New Zealand has no 5c or 25c coin, so change in cents is counted up with 10c, 20c and 50c coins: from $7.30 up to $8 is 50c and 20c. Two coins at least, so no picture prints the answer ---------- */
const SNACKS_NZ = [['kiwi-fruit', 'A kiwifruit'], ['soft-ice-cream', 'An ice cream'], ['red-apple', 'An apple'], ['pie', 'A pie'], ['sandwich', 'A sandwich'], ['popcorn', 'Popcorn'], ['doughnut', 'A doughnut'], ['cup-with-straw', 'A drink']];
function moneyNZ(lv) {
  const M = o => el => V.money(el, Object.assign({ cur: 'nzd' }, o)), desc = a => a.slice().sort((x, y) => y - x), sum = a => a.reduce((x, y) => x + y, 0), seq = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0)), dS = v => '$' + v, cS = v => v + 'c';
  const count = (items, order, start, unit, o, words) => H.walkSteps(start, order.map(i => items[i] / unit), wk => M(Object.assign({ items, walk: Object.assign({ order }, wk) }, o)),
    Object.assign({ fmt: unit === 100 ? dS : cS, text: start ? 'Start at ' + start + '. Tap the rest.' : 'Tap each one. Count on with me.', say: (start ? 'Start at ' + start + '. ' : '') + 'Tap each coin and note, biggest first, and count on with me.' + LAST }, words));
  if (lv <= 2) {
    let items; do { items = lv <= 1 ? desc(Array(rnd(1, 3)).fill(100).concat(Array(rnd(1, 2)).fill(200), rnd(0, 1) ? [500] : [])) : desc([pick([2000, 1000]), pick([1000, 500]), pick([500, 200]), pick([200, 100])].concat(rnd(0, 1) ? [100] : [])); } while (items.length < 3);
    const total = sum(items) / 100, all = seq(items.length), first = (items[0] + items[1]) / 100;
    return { type: 'num', text: 'How many dollars are here?', say: lv <= 1 ? 'This is New Zealand money. The gold coins are one dollar and two dollars. Each note says how many dollars it is worth. How many dollars are here?' : 'More notes this time. Each one says how many dollars it is worth. How many dollars are here altogether?', answer: total, visual: M({ items }), visualDone: M({ items, cap: '$' + total }),
      steps: lv <= 1 ? [N('Start with the biggest. Count on the rest.', total, M({ items }), 'Start with the biggest one, and count on the others.', [count(items, all, 0, 100)])]
        : [N('Add the two biggest notes.', first, M({ items, hi: [0, 1] }), 'Start with the two biggest notes, in the dotted rings. What do they make together?', [count(items, [0, 1], 0, 100, { hi: [0, 1] }, { text: 'Tap the two biggest notes.', say: 'Tap the two notes in the dotted rings, and count on with me.' + LAST })]),
          N(first + ' and the rest = ?', total, M({ items }), 'You have ' + first + ' so far. Now count on the others.', [count(items, all.slice(2), first, 100)])],
      explain: { text: 'Start with the biggest. Then count on.' } };
  }
  if (lv === 3) {
    /* change counted up the way a shopkeeper does, with $1 and $2 coins and a $5 note. Change of exactly 2 or 5 is left out: one coin or note would print the answer */
    const sn = pick(SNACKS_NZ), paid = pick([5, 10, 10, 20]), d = pick([3, 4, 6, 7, 8, 9].filter(v => v < paid)), price = paid - d, notes = ({ 3: [1, 2], 4: [2, 2], 6: [1, 5], 7: [2, 5], 8: [1, 2, 5], 9: [2, 2, 5] })[d].map(v => v * 100), base = { tag: { icon: sn[0], price: price * 100 }, paid: paid * 100 };
    return { type: 'num', text: sn[1] + ' costs $' + price + '. You pay $' + paid + '. How much change?', say: sn[1] + ' costs ' + price + ' dollars. You pay with ' + (paid === 5 ? 'a five' : paid === 10 ? 'a ten' : 'a twenty') + ' dollar note. How many dollars do you get back as change?', answer: d, visual: M(base), visualDone: M(Object.assign({ items: notes, cap: '$' + paid + ' − $' + price, reach: price * 100 }, base)),
      steps: [N('Count up from ' + price + ' to ' + paid + '. Add up the change.', d, M(Object.assign({ items: notes, ghost: true, reach: price * 100 }, base)), 'Change is what is left over. The shopkeeper counts it up, from ' + price + ' to ' + paid + ', with coins and notes. Add up the money she gives you back.',
        [H.walkSteps(0, notes.map(v => v / 100), wk => M(Object.assign({ items: notes, ghost: true, reach: price * 100, walk: Object.assign({ order: seq(notes.length) }, wk) }, base)), { fmt: dS, text: 'Tap the change. Add it up.', say: 'The shopkeeper counts your change, up from ' + price + ' to ' + paid + '. Tap each coin and note she gives you, and add them up with me.' + LAST, ask: 'How many dollars of change?', askSay: 'You counted up to ' + paid + '. How many dollars of change is that altogether?' })])],
      explain: { text: 'Count up from the price to what you paid.' } };
  }
  if (lv === 4) {
    let items; do { items = desc(shuffle([50, 20, 20, 10, 10, 10]).slice(0, rnd(3, 5))); } while (sum(items) > 100);
    const total = sum(items);
    return { type: 'num', text: 'How many cents are here?', say: 'These small coins are cents. One hundred cents make one dollar. Each coin says how many cents it is worth. How many cents are here?', answer: total, visual: M({ items }), visualDone: M({ items, cap: total + 'c' }),
      steps: [N('Start with the biggest coin. Count on.', total, M({ items }), 'Start with the biggest coin, and count on the others.', [count(items, seq(items.length), 0, 1)])],
      explain: { text: 'One hundred cents make one dollar.' } };
  }
  if (lv === 5) {
    let small; do { small = desc(shuffle([50, 20, 20, 10]).slice(0, rnd(2, 3))); } while (sum(small) >= 100);
    const n1 = rnd(1, 3), items = Array(n1).fill(100).concat(small), rest = sum(small), total = n1 * 100 + rest;
    return { type: 'num', text: '$1 is 100 cents. How many cents are here?', say: 'Now there are both. Each one dollar coin is 100 cents. How many cents are here altogether?', answer: total, visual: M({ items }), visualDone: M({ items, cap: nzd(total) }),
      steps: [N('Count the dollars. Each one is 100 cents.', n1 * 100, M({ items, hi: seq(n1) }), 'First the dollar coins, in the dotted rings. Each one is worth 100 cents. Count in hundreds.', [count(items, seq(n1), 0, 1, { hi: seq(n1) }, { text: 'Tap each dollar. Count in 100s.', say: 'Tap each dollar coin, and count in hundreds with me.' + LAST })]),
        N((n1 * 100) + ' and the small coins = ?', total, M({ items }), 'Now the small coins. Start at ' + (n1 * 100) + ', and count on.', [count(items, seq(small.length, n1), n1 * 100, 1)])],
      explain: { text: nzd(total) + ' means ' + n1 + (n1 === 1 ? ' dollar and ' : ' dollars and ') + rest + ' cents.' } };
  }
  const sn = pick(SNACKS_NZ), paid = pick([5, 10]), w = rnd(0, 2), cents = pick([30, 40, 60, 70, 80]), whole = paid - w - 1, price = whole * 100 + cents, up = 100 - cents, change = w * 100 + up, base = { tag: { icon: sn[0], price }, paid: paid * 100 };
  const small = ({ 20: [10, 10], 30: [20, 10], 40: [20, 20], 60: [50, 10], 70: [50, 20] })[up], ones = Array(w).fill(100), both = ones.concat(small);
  const steps = [N('From ' + nzd(price) + ' up to $' + (whole + 1) + '. How many cents?', up, M(Object.assign({ items: small, ghost: true }, base)), 'First count up to the next whole dollar. From ' + cents + ' cents up to 100.',
    [H.walkSteps(0, small, wk => M(Object.assign({ items: small, ghost: true, walk: Object.assign({ order: seq(small.length) }, wk) }, base)), { fmt: cS, text: 'Tap each coin. Count on.', say: 'Tap one coin at a time, up to the next whole dollar, and count on with me.' + LAST })])];
  if (w) steps.push(N('From $' + (whole + 1) + ' up to $' + paid + '. How many cents?', w * 100, M(Object.assign({ items: ones, ghost: true }, base)), 'Now count up the whole dollars, from ' + (whole + 1) + ' to ' + paid + '. Each one is 100 cents.',
    [H.walkOn(0, 100, w, wk => M(Object.assign({ items: ones, ghost: true, walk: Object.assign({ order: seq(w) }, wk) }, base)), { fmt: cS, text: 'Tap each dollar. Count in 100s.', say: 'Each coin is one dollar, worth 100 cents. Tap one at a time, and count in hundreds with me.' + LAST })]),
    N(up + ' + ' + (w * 100) + ' = ?', change, M(Object.assign({ items: both }, base)), 'Put the two parts together. ' + (w * 100) + ' and ' + up + ' more.', [count(both, seq(both.length), 0, 1, base)]));
  return { type: 'num', text: sn[1] + ' costs ' + nzd(price) + '. You pay $' + paid + '. How many cents change?', say: sn[1] + ' costs ' + whole + ' dollars and ' + cents + ' cents. You pay with ' + (paid === 5 ? 'a five' : 'a ten') + ' dollar note. How many cents do you get back as change?', answer: change,
    visual: M(base), visualDone: M(Object.assign({ items: both, cap: nzd(change) + ' change' }, base)), steps, explain: { text: 'Count up to the next dollar. Then count the dollars.' } };
}

/* ---------- angles, measured in degrees, on a football pitch. The fan of faint slices is a protractor: she counts slices, in 30s, then 10s.
   Square corners (90), past the square corner (obtuse), angles on a straight line (180), turns (360) and the corners of a triangle (180).
   The help is worked on the fan itself: each tap fills the next slice. ---------- */
SKILLS.angles = {
  name: 'Angles', strand: 'geometry', start: 1, max: 6,
  gen(lv) {
    const A = o => el => V.angle(el, o), deg = v => v + '°';
    /* fill n slices of "by" degrees starting at "from"; the labels count on from "start" */
    const slices = (from, by, n, start, o, words) => H.walkOn(start, by, n, wk => A(Object.assign({}, o, { ask: null, walk: Object.assign({ from, by }, wk) })), Object.assign({ fmt: deg, text: 'Tap the fan. Count each slice.', say: 'Tap once for each slice, and count with me.' + LAST }, words));
    if (lv <= 2) {
      const m = lv <= 1 ? 30 : 10, a = lv <= 1 ? pick([60, 90, 120, 150]) : 10 * rnd(2, 8), o = { a, slice: m };
      return { type: 'num', text: 'Each slice is ' + m + ' degrees. How many degrees is this pass?', say: (lv <= 1 ? 'You are on the white line, and you pass the ball to your team-mate. The opening between the line and the pass is called an angle. We measure an angle in degrees, starting from zero, at the orange line. ' : 'The slices are thinner now. ') + 'Each slice is ' + m + ' degrees. How many degrees is this pass?', answer: a, visual: A(o), visualDone: A({ a, slice: m, given: [{ from: 0, to: a, text: a + '°' }] }),
        steps: [N('Count the slices from 0 to the pass, in ' + m + 's.', a, A(o), 'Start at zero, at the orange line on the right. Count each slice, round to the pass. Each one is ' + m + ' degrees.', [slices(0, m, a / m, 0, o, { text: 'Tap the fan. Count in ' + m + 's.', say: 'Tap once for each slice, from the orange line round to the pass, and count in ' + m + 's with me.' + LAST })])],
        explain: { text: 'An angle is how far something has turned.' } };
    }
    if (lv === 3) {
      const a = 90 + 10 * rnd(1, 7), o = { a, slice: 10, sq: true }, o2 = { a, slice: 10, sq: true, given: [{ from: 0, to: 90, text: '90°' }] };
      return { type: 'num', text: 'This pass goes past the square corner. How many degrees?', say: 'A square corner is 90 degrees. This pass goes further round, past the square corner. Each slice is 10 degrees. How many degrees is the pass?', answer: a, visual: A(o), visualDone: A({ a, slice: 10, sq: true, given: [{ from: 0, to: a, text: a + '°' }] }),
        steps: [N('A square corner is 90. Count on from 90.', a, A(o2), 'The yellow part is a square corner, 90 degrees. Start at 90, and count on each slice past it, in tens.', [slices(90, 10, (a - 90) / 10, 90, o2, { text: 'Start at 90. Tap each slice past it.', say: 'Start at 90. Tap once for each slice past the square corner, and count on in tens with me.' + LAST })])],
        explain: { text: 'Bigger than a square corner is called obtuse.' } };
    }
    if (lv === 4) {
      let a; do { a = 10 * rnd(6, 15); } while (a === 90);     /* at 90 the two angles would be the same, and the one written in would give the other away */
      const b = 180 - a, o = { a, slice: 10, line: true, given: [{ from: 0, to: a, text: a + '°' }], ask: [a, 180] };
      return { type: 'num', text: 'A straight line is 180°. What is the missing angle?', say: 'The white line is a straight line, and a straight line is 180 degrees. The pass splits it into two angles. One is ' + a + ' degrees. How many degrees is the other one?', answer: b, visual: A(o), visualDone: A({ a, slice: 10, line: true, given: [{ from: 0, to: a, text: a + '°' }, { from: a, to: 180, text: b + '°' }] }),
        steps: [N('Count the slices from the pass to the line.', b, A(o), 'Look at the other side of the pass. Count each slice, from the pass round to the white line on the left. Each slice is 10 degrees.', [slices(a, 10, b / 10, 0, o, { text: 'Tap each slice on the left. Count in 10s.', say: 'Tap once for each slice on the left of the pass, and count in tens with me.' + LAST })])],
        explain: { text: 'Angles on a straight line add up to 180 degrees.' } };
    }
    if (lv === 5) {
      const k = rnd(2, 4), a = 90 * k, o = { full: true, a, slice: 90 };
      return { type: 'num', text: 'A quarter turn is 90°. How far has the ball turned?', say: 'Look down on the ball from above. It is spinning, like the hands of a clock. The red dot started at the top. A quarter turn is 90 degrees. How many degrees has the ball turned?', answer: a, visual: A(o),
        steps: [N('Count the quarter turns, in 90s.', a, A(o), 'Start at the top. Count each quarter turn, round to the red dot. Each one is 90 degrees.', [slices(0, 90, k, 0, o, { text: 'Tap the ball for each quarter turn.', say: 'Tap once for each quarter turn, from the top round to the red dot, and count in nineties with me.' + LAST })])],
        explain: { text: 'A full turn is 360 degrees. A quarter turn is 90.' } };
    }
    let a, b; do { a = 10 * rnd(3, 8); b = 10 * rnd(3, 8); } while (a + b > 150 || a === b);
    const c = 180 - a - b, o1 = { slice: 10, line: true, plain: true, rays: [a, a + b], given: [{ from: 0, to: a, text: a + '°' }, { from: a, to: a + b, text: b + '°' }] }, o2 = Object.assign({}, o1, { ask: [a + b, 180] });
    return { type: 'num', text: 'Two corners are ' + a + '° and ' + b + '°. What is the third?', say: 'Three players pass the ball in a triangle. The three corners of any triangle always add up to 180 degrees. Two of the corners are ' + a + ' degrees and ' + b + ' degrees. How many degrees is the third corner?', answer: c, visual: el => V.tri(el, a, b), visualDone: el => V.tri(el, a, b, { show: true }),
      steps: [N(a + ' + ' + b + ' = ?', a + b, A(o1), 'Lay the two corners side by side on a straight line. Start at ' + a + ', and count on ' + b + ' more, in tens.', [slices(a, 10, b / 10, a, o1, { text: 'Start at ' + a + '. Tap each slice of the blue corner.', say: 'Start at ' + a + '. Tap once for each slice of the blue corner, and count on in tens with me.' + LAST })]),
        N('A straight line is 180. 180 − ' + (a + b) + ' = ?', c, A(o2), 'The three corners fill a straight line, 180 degrees. The two you know use up ' + (a + b) + '. How many degrees are left for the third?', [slices(a + b, 10, c / 10, 0, o2, { text: 'Tap each slice that is left. Count in 10s.', say: 'Tap once for each slice that is left, and count in tens with me.' + LAST })])],
      explain: { text: 'The corners of a triangle add up to 180 degrees.' } };
  }
};

/* ---------- measuring in metric: the system France invented in the 1790s, where every unit is ten, a hundred or a thousand of the next.
   Reading a ruler in centimetres; a length is the gap between two ends, not the number at one end; millimetres, metres and kilometres; and one decimal place of a kilometre.
   The help is worked on the ruler itself: each tap moves one mark along. ---------- */
const MEASURE_CM = [['baguette', 'baguette'], ['pencil', 'pencil'], ['carrot', 'carrot']], MEASURE_MM = [['caterpillar', 'caterpillar'], ['nail', 'nail'], ['twig', 'twig']], MEASURE_M = [['ladder', 'ladder'], ['canoe', 'canoe'], ['board', 'surfboard']];
SKILLS.measure = {
  name: 'Measuring in metric', strand: 'geometry', start: 1, max: 6,
  gen(lv) {
    const R = base => o => el => V.ruler(el, Object.assign({}, base, o));
    const along = (r, from, by, o) => wk => r(Object.assign({ walk: Object.assign({ from, by }, wk) }, o));
    if (lv === 1) {
      const th = pick(MEASURE_CM), base = pick([0, 5, 10]), v = base + rnd(1, 4), r = R({ lo: 0, hi: 15, minor: 1, major: 5, unit: 'cm', a: 0, b: v, shape: th[0] });
      return { type: 'num', text: 'How many centimetres long is the ' + th[1] + '?', say: 'This is a ruler. It measures in centimetres. Each small mark is one centimetre. How many centimetres long is the ' + th[1] + '?', answer: v, visual: r(), visualDone: r({ from: base }),
        steps: [N('Start at ' + base + '. Count the marks to the end.', v, r({ from: base }), 'Follow the dotted line down from the end of the ' + th[1] + '. It lands just past ' + base + '. Start at ' + base + ', and count on one mark at a time.',
          [H.walkOn(base, 1, v - base, along(r, base, 1, { from: base }), { text: 'Start at ' + base + '. Tap the ruler to step along.', say: 'Start at ' + base + '. Tap the ruler to step along one mark at a time, and count on with me.' + LAST })])],
        explain: { text: 'Find the number before. Then count the small marks on.' } };
    }
    if (lv === 2) {
      const th = pick(MEASURE_CM), a = rnd(1, 6), d = rnd(3, 8), b = a + d, r = R({ lo: 0, hi: 15, minor: 1, major: 5, unit: 'cm', a, b, shape: th[0] });
      return { type: 'num', text: 'This ' + th[1] + ' does not start at 0. How long is it?', say: 'Careful. This ' + th[1] + ' does not start at zero on the ruler. How many centimetres long is it?', answer: d, visual: r(), visualDone: r({ walk: { from: a, by: 1, n: d, done: d, labels: Array.from({ length: d }, (_, i) => i + 1) } }),
        steps: [N('Count the steps from one end to the other.', d, r(), 'The length is the gap between the two ends. Count each step along the ruler, from the start of the ' + th[1] + ' to its end.',
          [H.walk(d, along(r, a, 1), { text: 'Tap the ruler. Count each step along.', say: 'Tap the ruler once for each centimetre, from one end of the ' + th[1] + ' to the other, and count with me.' + LAST, ask: 'How many steps long?' })])],
        explain: { text: 'A length is the gap between the two ends.' } };
    }
    if (lv === 3) {
      const th = pick(MEASURE_MM), c = rnd(1, 5), k = rnd(1, 9), v = c * 10 + k, r = R({ lo: 0, hi: 60, minor: 1, mid: 5, major: 10, fmt: x => x / 10, unit: 'cm', a: 0, b: v, shape: th[0] });
      return { type: 'num', text: '1 cm is 10 mm. How many millimetres long is the ' + th[1] + '?', say: 'Look closely at this ruler. Between each centimetre there are ten tiny marks. Each one is a millimetre. One centimetre is ten millimetres. How many millimetres long is the ' + th[1] + '?', answer: v, visual: r(), visualDone: r({ from: c * 10 }),
        steps: [N('Count the whole centimetres in 10s.', c * 10, r({ from: c * 10 }), 'First the whole centimetres. Each one is ten millimetres. Count in tens, up to the last number before the end.',
          [H.walkOn(0, 10, c, along(r, 0, 10, { from: c * 10 }), { text: 'Tap for each centimetre. Count in 10s.', say: 'Tap the ruler once for each whole centimetre, and count in tens with me.' + LAST })]),
          N((c * 10) + ' and the tiny marks = ?', v, r({ from: c * 10 }), 'Now the tiny marks after ' + c + ' centimetres. Start at ' + (c * 10) + ', and count on each one.',
            [H.walkOn(c * 10, 1, k, along(r, c * 10, 1, { from: c * 10 }), { text: 'Start at ' + (c * 10) + '. Tap for each tiny mark.', say: 'Start at ' + (c * 10) + '. Tap the ruler once for each tiny mark, and count on with me.' + LAST })])],
        explain: { text: 'Milli means a thousandth. Ten millimetres make one centimetre.' } };
    }
    if (lv === 4) {
      const th = pick(MEASURE_M), m = rnd(1, 2), k = rnd(1, 9), v = m * 100 + k * 10, r = R({ lo: 0, hi: 300, minor: 10, mid: 50, major: 100, fmt: x => x ? x / 100 + ' m' : '0', a: 0, b: v, shape: th[0] });
      return { type: 'num', text: '1 m is 100 cm. How many centimetres long is the ' + th[1] + '?', say: 'This is a long tape measure. It is marked in metres. One metre is 100 centimetres, and each small mark is 10 centimetres. How many centimetres long is the ' + th[1] + '?', answer: v, visual: r(), visualDone: r({ from: m * 100 }),
        steps: [N('Count the whole metres in 100s.', m * 100, r({ from: m * 100 }), 'First the whole metres. Each one is 100 centimetres. Count in hundreds.',
          [H.walkOn(0, 100, m, along(r, 0, 100, { from: m * 100 }), { text: 'Tap for each metre. Count in 100s.', say: 'Tap the tape once for each whole metre, and count in hundreds with me.' + LAST })]),
          N((m * 100) + ' and the small marks = ?', v, r({ from: m * 100 }), 'Now the small marks after ' + m + (m === 1 ? ' metre' : ' metres') + '. Each one is 10 centimetres. Start at ' + (m * 100) + ', and count on in tens.',
            [H.walkOn(m * 100, 10, k, along(r, m * 100, 10, { from: m * 100 }), { text: 'Start at ' + (m * 100) + '. Each tap is 10 cm.', say: 'Start at ' + (m * 100) + '. Tap the tape once for each small mark, and count on in tens with me.' + LAST })])],
        explain: { text: 'Centi means a hundredth. 100 centimetres make one metre.' } };
    }
    const K = rnd(1, 4), hm = rnd(1, 9), v = K * 1000 + hm * 100, dec = lv >= 6, r = R(Object.assign({ lo: 0, hi: 5000, minor: 100, mid: 500, major: 1000, fmt: x => x ? x / 1000 + ' km' : '0', a: 0, b: v, art: 'person-biking', kind: 'road' }, dec ? { sign: K + '.' + hm + ' km' } : null));
    return { type: 'num', text: dec ? 'The rider has gone ' + K + '.' + hm + ' km. How many metres?' : '1 km is 1,000 m. How many metres has she ridden?', say: (dec ? 'The sign says the rider has gone ' + K + ' point ' + hm + ' kilometres. One kilometre is 1,000 metres. How many metres is that?' : 'This is a bike race, like the Tour de France. The road is marked in kilometres. One kilometre is 1,000 metres, and each small mark is 100 metres. How many metres has the rider gone?'), answer: v, visual: r(), visualDone: r({ from: K * 1000 }),
      steps: [N(dec ? 'The ' + K + ' is whole kilometres. Count in 1,000s.' : 'Count the whole kilometres in 1,000s.', K * 1000, r({ from: K * 1000 }), 'First the whole kilometres. Each one is 1,000 metres. Count in thousands.',
        [H.walkOn(0, 1000, K, along(r, 0, 1000, { from: K * 1000 }), { text: 'Tap for each kilometre. Count in 1,000s.', say: 'Tap the road once for each whole kilometre, and count in thousands with me.' + LAST })]),
        N(dec ? 'Point ' + hm + ' is ' + hm + ' marks of 100 m. Count on.' : (K * 1000) + ' and the small marks = ?', v, r({ from: K * 1000 }), (dec ? 'The number after the point counts tenths of a kilometre. One tenth of a kilometre is 100 metres, one small mark. ' : 'Now the small marks. Each one is 100 metres. ') + 'Start at ' + (K * 1000) + ', and count on in hundreds.',
          [H.walkOn(K * 1000, 100, hm, along(r, K * 1000, 100, { from: K * 1000 }), { text: 'Start at ' + (K * 1000) + '. Each tap is 100 m.', say: 'Start at ' + (K * 1000) + '. Tap the road once for each small mark, and count on in hundreds with me.' + LAST })])],
      explain: { text: dec ? 'One tenth of a kilometre is 100 metres.' : 'Kilo means a thousand. One kilometre is 1,000 metres.' } };
  }
};

/* ---------- chance: a box of macarons, and one picked without looking. Blaise Pascal and Pierre de Fermat began the maths of chance in France, in letters they wrote in 1654.
   Most likely; the words impossible, unlikely, likely and certain; a chance as "so many out of so many"; an even chance; how many to expect in many picks; and the chance of it not happening.
   The help is worked in the box itself: she taps each macaron, in any order, and it takes the next number. ---------- */
SKILLS.chance = {
  name: 'Chance', strand: 'data', start: 1, max: 6,
  gen(lv) {
    const J = o => el => V.jar(el, o), cols = shuffle(Object.keys(MAC)), nm = c => MAC[c].name, Nm = c => cap1(nm(c)), idx = (items, test) => items.map((c, i) => test(c, i) ? i : -1).filter(i => i >= 0);
    /* tap every macaron picked out by "which" (a list of places in the box) */
    const tapAll = (o, which, words) => H.walk(which.length, wk => J(Object.assign({}, o, { hi: null, walk: Object.assign({ order: which }, wk) })), Object.assign({ text: 'Tap each one. Count with me.', say: 'Tap each one, in any order, and count with me.' + LAST, ask: 'How many did you count?' }, words));
    const count = (items, c) => N('How many ' + nm(c) + ' ones?', items.filter(x => x === c).length, J({ items, hi: c }), 'Look at the ' + nm(c) + ' ones, in the dotted rings. How many are there?', [tapAll({ items }, idx(items, x => x === c), { text: 'Tap each ' + nm(c) + ' one.', say: 'Tap each ' + nm(c) + ' macaron, and count with me.' + LAST })]);
    if (lv === 1) {
      const n = pick([[5, 2, 1], [4, 2, 1], [5, 3, 1], [6, 2, 2], [4, 3, 1], [5, 3, 2]]), three = cols.slice(0, 3), items = shuffle([].concat(...three.map((c, i) => Array(n[i]).fill(c)))), opts = shuffle(three);
      return { type: 'choice', text: 'Pick one without looking. Which colour is most likely?', say: 'This is a box of macarons, little French cakes. Shut your eyes and pick one. Which colour are you most likely to get?', options: opts.map(c => ({ label: Nm(c), svg: macIcon(c) })), answer: opts.indexOf(three[0]), visual: J({ items }),
        steps: [count(items, three[0]), count(items, three[1])],
        explain: { text: 'The colour with the most is the most likely.' } };
    }
    if (lv === 2) {
      const kind = pick(['certain', 'impossible', 'likely', 'unlikely']), a = cols[0], b = cols[1], n = rnd(8, 10), WORDS = ['Certain', 'Likely', 'Unlikely', 'Impossible'], opts = WORDS.map(w => ({ label: w }));
      const few = rnd(1, 2), items = kind === 'certain' ? Array(n).fill(a) : kind === 'impossible' ? shuffle(Array(n - 3).fill(b).concat(Array(3).fill(cols[2]))) : shuffle(Array(kind === 'likely' ? n - few : few).fill(a).concat(Array(kind === 'likely' ? few : n - few).fill(b)));
      const k = items.filter(x => x === a).length, most = [{ label: 'Most of them' }, { label: 'Only a few' }];
      const steps = kind === 'certain' ? [C('Is every macaron ' + nm(a) + '?', [{ label: 'Yes, every one' }, { label: 'No' }], 0, J({ items }), 'Look in the box. Is every single macaron ' + nm(a) + '?')]
        : kind === 'impossible' ? [C('Can you find a ' + nm(a) + ' one?', [{ label: 'No, none' }, { label: 'Yes' }], 0, J({ items }), 'Look in the box. Can you find even one ' + nm(a) + ' macaron?')]
          : [count(items, a), C(k + ' out of ' + n + ' are ' + nm(a) + '. That is…', most, kind === 'likely' ? 0 : 1, J({ items, hi: a }), k + ' out of ' + n + ' are ' + nm(a) + '. Is that most of them, or only a few?')];
      steps.forEach(s => { if (s.type === 'choice') s.nudge = 'Not that one. Look in the box again.'; });
      return { type: 'choice', text: 'Pick one without looking. Getting ' + nm(a) + ' is…', say: 'Shut your eyes and pick one macaron. How likely is it that you get a ' + nm(a) + ' one? Certain means it must happen. Impossible means it cannot happen.', options: opts, answer: WORDS.indexOf(cap1(kind)), visual: J({ items }), steps,
        explain: { text: { certain: 'Certain means it will always happen.', impossible: 'Impossible means it can never happen.', likely: 'Likely means it happens more often than not.', unlikely: 'Unlikely means it does not happen often.' }[kind] } };
    }
    if (lv === 3) {
      const a = cols[0], n = pick([6, 8, 10]), k = rnd(2, n - 2), items = shuffle(Array(k).fill(a).concat(Array(n - k).fill(cols[1])));
      return { type: 'num', text: 'The chance of ' + nm(a) + ' is how many out of ' + n + '?', say: 'There are ' + n + ' macarons in the box. You pick one without looking. We write a chance as so many out of ' + n + '. The chance of ' + nm(a) + ' is how many out of ' + n + '?', answer: k, visual: J({ items }), visualDone: J({ items, hi: a, cap: k + ' out of ' + n }),
        steps: [count(items, a)], explain: { text: 'A chance is how many you want, out of them all.' } };
    }
    if (lv === 4) {
      const a = cols[0], b = cols[1], nb = rnd(2, 4), d = rnd(1, 3), na = nb + d, items = shuffle(Array(na).fill(a).concat(Array(nb).fill(b))), ghost = Array(d).fill(b), n0 = items.length;
      return { type: 'num', text: 'How many more ' + nm(b) + ' ones make it an even chance?', say: 'Right now, ' + nm(a) + ' is more likely than ' + nm(b) + '. An even chance means each colour is just as likely. How many more ' + nm(b) + ' macarons must go in the box to make it an even chance?', answer: d, visual: J({ items }), visualDone: J({ items: items.concat(ghost), cap: na + ' and ' + na }),
        steps: [count(items, a), count(items, b),
          N('From ' + nb + ' up to ' + na + '. How many more?', d, J({ items, ghost }), 'There are ' + na + ' ' + nm(a) + ' ones, and only ' + nb + ' ' + nm(b) + ' ones. Add ' + nm(b) + ' ones, one at a time, until there are ' + na + ' of each. How many did you add?',
            [H.walk(d, wk => J({ items, ghost, walk: Object.assign({ order: ghost.map((_, i) => n0 + i) }, wk) }), { text: 'Tap each empty one to fill it.', say: 'Tap each empty macaron to add a ' + nm(b) + ' one, and count with me.' + LAST, ask: 'How many did you add?' })])],
        explain: { text: 'An even chance means the same number of each.' } };
    }
    if (lv === 5) {
      const a = cols[0], d = pick([2, 4, 5]), g = rnd(3, d === 5 ? 5 : 6), n = d * g, items = shuffle([a].concat(Array(d - 1).fill(cols[1]))), P = o => el => V.picks(el, Object.assign({ n, d, col: a }, o));
      return { type: 'num', text: '1 in ' + d + ' is ' + nm(a) + '. In ' + n + ' picks, about how many?', say: 'One macaron out of every ' + d + ' is ' + nm(a) + '. You pick one, look at it, and put it back. You do that ' + n + ' times. About how many times would you expect to get ' + nm(a) + '?', answer: g, visual: J({ items, cap: 'pick ' + n + ' times' }), visualDone: P({ walk: { order: Array.from({ length: g }, (_, i) => i), done: g, labels: Array.from({ length: g }, (_, i) => i + 1) } }),
        steps: [N('About one ' + nm(a) + ' in each group of ' + d + '. How many groups?', g, P(), 'Here are your ' + n + ' picks, put into groups of ' + d + '. In each group, about one will be ' + nm(a) + '. Count the groups.',
          [H.walk(g, wk => P({ walk: Object.assign({ order: Array.from({ length: g }, (_, i) => i) }, wk) }), { text: 'Tap each group of ' + d + '. Count them.', say: 'Tap each group of ' + d + ' picks. One pick in it turns ' + nm(a) + '. Count the groups with me.' + LAST, ask: 'How many groups?' })])],
        explain: { text: 'Share the picks into equal groups. Expect one from each.' } };
    }
    const a = cols[0], n = pick([8, 10, 12]), k = rnd(2, 4), rest = n - k, others = [cols[1], cols[2]], items = shuffle(Array(k).fill(a).concat(Array(Math.ceil(rest / 2)).fill(others[0]), Array(Math.floor(rest / 2)).fill(others[1])));
    return { type: 'num', text: k + ' out of ' + n + ' are ' + nm(a) + '. How many are not ' + nm(a) + '?', say: 'The chance of picking ' + nm(a) + ' is ' + k + ' out of ' + n + '. What is the chance of not picking ' + nm(a) + '? How many out of ' + n + ' are not ' + nm(a) + '?', answer: rest, visual: J({ items }), visualDone: J({ items, cap: k + ' and ' + rest + ' make ' + n }),
      steps: [N('Count every one that is not ' + nm(a) + '.', rest, J({ items }), 'Look at all the macarons that are not ' + nm(a) + '. How many are there?', [tapAll({ items }, idx(items, x => x !== a), { text: 'Tap each one that is not ' + nm(a) + '.', say: 'Tap each macaron that is not ' + nm(a) + ', and count with me.' + LAST })])],
      explain: { text: 'It happens, or it does not. The two chances make the whole.' } };
  }
};

/* ---------- factors and primes. The Greeks studied them first: Euclid proved (Elements, book 9) that the primes never run out, and Eratosthenes of Cyrene gave the sieve that finds them.
   The picture is a set of square tiles. A factor is a number of tiles in a row that leaves none over; a prime number of tiles makes no rectangle but one long row.
   New Zealand Curriculum (2026): factors Year 5, square numbers Year 6, primes to 100 Year 7. Levels: 1 does it fit exactly; 2 the other number of a factor pair; 3 pick a factor; 4 square numbers; 5 primes to 30; 6 primes to 100.
   The help is worked on the tiles: she taps the rows, the tiles in a row, or the tiles left over. ---------- */
SKILLS.factors = {
  name: 'Factors and primes', strand: 'number', start: 1, max: 6,
  gen(lv) {
    const T = o => el => V.tiles(el, o);
    const countRows = (n, per, o) => { const r = n / per; return N(n + ' tiles in rows of ' + per + '. How many rows?', r, T({ n, per }), 'Here are ' + n + ' tiles, in rows of ' + per + '. How many rows are there?', [H.walk(r, wk => T({ n, per, mode: 'rows', walk: wk }), Object.assign({ text: 'Tap each row. Count the rows.', say: 'Tap each row, and count with me.' + LAST, ask: 'How many rows?' }, o))]); };
    const countLeft = (n, per) => { const m = n % per; return N('Rows of ' + per + '. How many tiles are left over?', m, T({ n, per }), 'Here are ' + n + ' tiles, put into rows of ' + per + '. The pink ones do not fill a row. How many are left over?', [H.walk(m, wk => T({ n, per, mode: 'left', walk: wk }), { text: 'Tap each pink tile. Count them.', say: 'Tap each pink tile, and count with me.' + LAST, ask: 'How many left over?' })]); };
    const countPer = (n, rows) => { const per = n / rows; return N(rows + ' equal rows. How many tiles in each row?', per, T({ n, per }), 'The ' + n + ' tiles are now in ' + rows + ' equal rows. How many tiles are in each row?', [H.walk(per, wk => T({ n, per, mode: 'cols', walk: wk }), { text: 'Tap along one row. Count the tiles.', say: 'Tap along the top, one tile at a time, and count with me.' + LAST, ask: 'How many in each row?' })]); };
    if (lv <= 1) {
      const fits = rnd(0, 1) === 1, per = rnd(2, 6), rows = rnd(2, 5), n = fits ? per * rows : per * rows + rnd(1, per - 1), opts = [{ label: 'Yes, exactly' }, { label: 'No, some left over' }];
      return { type: 'choice', text: n + ' tiles. Do rows of ' + per + ' fit exactly?', say: 'Here are ' + n + ' tiles. Can you put them all into rows of ' + per + ', with none left over?', options: opts, answer: fits ? 0 : 1, visual: T({ n, loose: true }), visualDone: T({ n, per }),
        steps: [fits ? countRows(n, per) : countLeft(n, per)], explain: { text: fits ? 'None left over. So ' + per + ' is a factor of ' + n + '.' : 'Some are left over. So ' + per + ' is not a factor.' } };
    }
    if (lv === 2) {
      const a = rnd(2, 6), b = rnd(3, 9), n = a * b;
      return { type: 'num', text: a + ' times what makes ' + n + '?', say: a + ' and another number are a factor pair of ' + n + '. ' + a + ' times what makes ' + n + '?', answer: b, visual: T({ n, loose: true }), visualDone: T({ n, per: b, cap: a + ' × ' + b + ' = ' + n }),
        steps: [countPer(n, a)], explain: { text: 'Two factors that multiply to make it are a factor pair.' } };
    }
    if (lv === 3) {
      const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40]), fs = [], non = []; for (let i = 3; i <= Math.min(9, n - 1); i++) (n % i === 0 ? fs : non).push(i);
      const f = pick(fs), wrong = shuffle(non).slice(0, 2), opts = shuffle([f].concat(wrong));
      return { type: 'choice', text: 'Which number is a factor of ' + n + '?', say: 'A factor of ' + n + ' makes equal rows of ' + n + ' tiles, with none left over. Which of these is a factor of ' + n + '?', options: opts.map(v => ({ label: String(v) })), answer: opts.indexOf(f), visual: T({ n, loose: true }), visualDone: T({ n, per: Math.max(f, n / f), cap: f + ' is a factor of ' + n }),
        steps: [countLeft(n, wrong[0]), countRows(n, f)], explain: { text: 'A factor makes equal rows, with none left over.' } };
    }
    if (lv === 4) {
      if (rnd(0, 1)) { const k = rnd(3, 9), n = k * k;
        return { type: 'num', text: 'A square of tiles: ' + k + ' rows of ' + k + '. How many tiles?', say: 'This is a square of tiles. It has ' + k + ' rows, with ' + k + ' tiles in each row. How many tiles is that? A number like this is called a square number.', answer: n, visual: T({ n, per: k }), visualDone: T({ n, per: k, cap: k + ' × ' + k + ' = ' + n }),
          steps: [N(k + ' rows of ' + k + '. Count in ' + k + 's.', n, T({ n, per: k }), 'There are ' + k + ' rows of ' + k + '. Count in ' + k + 's, one row at a time. What number do you end on?', [H.walkOn(0, k, k, wk => T({ n, per: k, mode: 'rows', walk: wk }), { text: 'Tap each row. Count in ' + k + 's.', say: 'Tap each row, and count in ' + k + 's with me.' + LAST })])], explain: { text: 'A number times itself is a square number.' } }; }
      const k = rnd(3, 7), n = k * k, wrong = shuffle([n - k, n + k, n - 2, n + 2, n + 1].filter(v => Math.round(Math.sqrt(v)) ** 2 !== v)).slice(0, 2), opts = shuffle([n].concat(wrong));
      return { type: 'choice', text: 'Which is a square number?', say: 'A square number of tiles makes a perfect square: as many rows as there are tiles in a row. Which of these is a square number?', options: opts.map(v => ({ label: String(v) })), answer: opts.indexOf(n), visual: el => V.bags(el, opts), visualDone: T({ n, per: k, cap: k + ' × ' + k + ' = ' + n }),
        steps: [N(k + ' rows of ' + k + '. Count in ' + k + 's.', n, T({ n, per: k }), 'Here is a square: ' + k + ' rows of ' + k + '. Count in ' + k + 's, one row at a time. What number do you end on?', [H.walkOn(0, k, k, wk => T({ n, per: k, mode: 'rows', walk: wk }), { text: 'Tap each row. Count in ' + k + 's.', say: 'Tap each row, and count in ' + k + 's with me.' + LAST })])], explain: { text: 'A number times itself is a square number.' } };
    }
    /* which one is prime? One prime and two numbers that make rectangles */
    const sets = lv === 5 ? [[5, 6, 9], [7, 8, 15], [11, 9, 12], [13, 15, 21], [17, 21, 25], [19, 15, 27], [23, 21, 25], [29, 27, 25], [13, 14, 9], [11, 10, 21]]
      : [[53, 51, 57], [89, 87, 91], [41, 39, 49], [79, 77, 81], [97, 91, 93], [59, 57, 63], [61, 63, 65], [71, 69, 77], [83, 85, 87], [43, 45, 49], [67, 65, 69], [47, 49, 51], [73, 75, 77], [37, 35, 39]];
    const set = pick(sets), p = set[0], c = pick(set.slice(1)), opts = shuffle(set), small = v => { for (let i = 2; i * i <= v; i++) if (v % i === 0) return i; return v; }, d = small(c), per = Math.max(d, c / d), q = lv === 5 ? (p <= 12 ? 2 : p <= 20 ? 3 : 5) : 7;      /* rows wide enough that the picture is never a tall thin strip; none of these primes is a multiple of its q */
    return { type: 'choice', text: 'Which number is prime?', say: 'A prime number of tiles can only make one long row. It cannot make a rectangle. Its only factors are one, and itself. Which of these numbers is prime?', options: opts.map(v => ({ label: String(v) })), answer: opts.indexOf(p), visual: el => V.bags(el, opts), visualDone: T({ n: p, per: p > 30 ? Math.ceil(p / 3) : p, cap: p + ' makes no rectangle' }),
      steps: [countRows(c, per, { text: 'Tap each row. ' + c + ' makes a rectangle!', say: 'Look: ' + c + ' tiles make a rectangle. Tap each row, and count with me.' + LAST }), countLeft(p, q)], explain: { text: 'A prime has only two factors: 1 and itself.' } };
  }
};

/* ---------- ratio and scaling (China). "1 panda eats 3 sticks. 4 pandas eat how many?" A ratio is the same in every group, so she counts the groups and scales.
   Levels: 1 one-to-many, scale up; 2 the same, backwards (how many groups?); 3 two or three to many; 4 find what one gets, then scale; 5 backwards with groups of two or three; 6 a mix shared in a ratio.
   The Nine Chapters on the Mathematical Art (China, finished by the 1st century CE) gives a whole chapter to this: the "rule of three". NZ Curriculum: ratios and proportions, about Levels 3 to 5.
   The picture shows the rule as one group, and a loose heap of what she has; the help draws the equal groups and she taps them. ---------- */
const RATIO_SETS = [
  { A: 'panda', a: ['panda', 'pandas'], B: STICK_ART, b: ['stick', 'sticks'], v: ['eats', 'eat'], back: 'feed', what: 'bamboo sticks' },
  { A: 'teapot', a: ['teapot', 'teapots'], B: 'teacup-without-handle', b: ['cup', 'cups'], v: ['fills', 'fill'], back: 'need', what: 'cups of tea' },
  { A: 'bento-box', a: ['box', 'boxes'], B: 'dumpling', b: ['dumpling', 'dumplings'], v: ['holds', 'hold'], back: 'fill', what: 'dumplings' }
];
const RATIO_MIX = [{ A: 'red-paper-lantern', a: ['lantern', 'lanterns'], B: 'star', b: ['star', 'stars'], whole: 'a string of decorations' }, { A: 'kite', a: ['kite', 'kites'], B: 'balloon', b: ['balloon', 'balloons'], whole: 'the sky at a festival' }];
/* ---------- decimals: tenths and hundredths, on the ice. Canada (asked for 9 October: "My daughter loves ice skating").
   A puck sliding along a lane marked in tenths of a metre; speed skaters' times in tenths and hundredths of a second, where less time is faster.
   Levels: tenths of a metre; metres and tenths as tenths; who was faster (tenths); adding tenths past a whole metre; who was faster (hundredths); how much faster, bridging through the whole second.
   The help is worked on the scale itself: each tap moves one mark along. The times are made up, not records. ---------- */
const DEC_NAMES = ['Mia', 'Ava', 'Leah', 'Zoe', 'Isla', 'Ruby', 'Noor', 'Maya'];
const decT = v => (v / 10).toFixed(1), decH = v => (v / 100).toFixed(2);
SKILLS.decimals = {
  name: 'Decimals: tenths and hundredths', strand: 'number', start: 1, max: 6,
  gen(lv) {
    const R = base => o => el => V.ruler(el, Object.assign({}, base, o));
    const along = (r, from, by, o) => wk => r(Object.assign({ walk: Object.assign({ from, by }, wk) }, o));
    const two = () => { const a = pick(DEC_NAMES); return [a, pick(DEC_NAMES.filter(b => b !== a))]; };
    if (lv === 1) {
      const k = rnd(2, 9), r = R({ lo: 0, hi: 10, minor: 1, mid: 5, major: 10, fmt: v => v / 10, unit: 'm', a: 0, b: k, kind: 'ice' });
      return { type: 'num', text: 'The puck slid less than 1 m. How many tenths?', say: 'This ice lane is one metre long, cut into ten equal parts. Each part is one tenth of a metre. How many tenths of a metre did the puck slide?', answer: k,
        visual: r(), visualDone: r({ sign: '0.' + k + ' m' }),
        steps: [N('Count the tenths from 0 to the puck.', k, r(), 'Count each tenth of a metre, from zero along to the puck.',
          [H.walk(k, along(r, 0, 1), { text: 'Tap the lane. Count each tenth.', say: 'Tap the lane once for each tenth, and count with me.' + LAST, ask: 'How many tenths?' })])],
        explain: { text: 'The number after the point counts tenths.' } };
    }
    if (lv === 2) {
      const m = rnd(1, 2), k = rnd(1, 9), v = m * 10 + k, r = R({ lo: 0, hi: 30, minor: 1, mid: 5, major: 10, fmt: v => v / 10, unit: 'm', a: 0, b: v, kind: 'ice', sign: m + '.' + k + ' m' });
      return { type: 'num', text: 'The puck slid ' + m + '.' + k + ' m. How many tenths of a metre?', say: 'The puck slid ' + m + ' point ' + k + ' metres. Each metre is ten tenths. How many tenths of a metre is that altogether?', answer: v,
        visual: r(), visualDone: r({ from: m * 10 }),
        steps: [N('Each whole metre is 10 tenths. Count in 10s.', m * 10, r({ from: m * 10 }), 'First the whole metres. Each one is ten tenths. Count in tens.',
          [H.walkOn(0, 10, m, along(r, 0, 10, { from: m * 10 }), { text: 'Tap for each metre. Count in 10s.', say: 'Tap the lane once for each whole metre, and count in tens with me.' + LAST })]),
          N((m * 10) + ' and ' + k + ' more tenths = ?', v, r({ from: m * 10 }), 'Now the tenths after ' + m + (m === 1 ? ' metre' : ' metres') + '. Start at ' + (m * 10) + ', and count on.',
            [H.walkOn(m * 10, 1, k, along(r, m * 10, 1, { from: m * 10 }), { text: 'Start at ' + (m * 10) + '. Tap for each tenth.', say: 'Start at ' + (m * 10) + '. Tap the lane once for each tenth, and count on with me.' + LAST })])],
        explain: { text: 'One metre is ten tenths of a metre.' } };
    }
    if (lv === 3 || lv === 5) {
      const hund = lv === 5, [A, B] = two(), w = rnd(36, 44);
      let a, b; if (hund && rnd(0, 1)) { const t1 = rnd(1, 8), t2 = pick([1, 2, 3, 4, 5, 6, 7, 8].filter(v => v !== t1)), h = rnd(1, 9); a = w * 100 + t1 * 10 + h; b = w * 100 + t2 * 10 + (10 - h) % 10 + (h === 5 ? 1 : 0); }   /* the tenths differ: the hundredths must not decide it */
      else if (hund) { const t = rnd(1, 8), h1 = rnd(1, 9); let h2; do { h2 = rnd(1, 9); } while (h2 === h1); a = w * 100 + t * 10 + h1; b = w * 100 + t * 10 + h2; }   /* the same tenths: now the hundredths decide */
      else { a = w * 10 + rnd(1, 9); do { b = w * 10 + rnd(1, 9); } while (b === a); }
      const fmt = hund ? decH : decT, fast = a < b ? 0 : 1, lo = hund ? Math.floor(Math.min(a, b) / 10) * 10 - 10 : w * 10, hi = hund ? lo + Math.max(40, Math.ceil((Math.max(a, b) + 10 - lo) / 10) * 10) : w * 10 + 10;
      const r = R({ lo, hi, minor: 1, mid: 5, major: 10, fmt: v => hund ? (v / 100).toFixed(1) : v / 10, unit: hund ? null : 's', marks: [{ v: a, label: A }, { v: b, label: B }] });
      const ta = fmt(a), tb = fmt(b), opts = [O(A, 'ice-skate'), O(B, 'ice-skate')];
      const sameT = hund && Math.floor(a / 10) === Math.floor(b / 10), part = hund ? (sameT ? 'hundredths' : 'tenths') : 'tenths', dig = v => hund ? (sameT ? v % 10 : Math.floor(v / 10) % 10) : v % 10;
      return { type: 'choice', text: A + ': ' + ta + ' s. ' + B + ': ' + tb + ' s. Who was faster?', say: 'Two speed skaters raced 500 metres. ' + A + ' took ' + ta + ' seconds. ' + B + ' took ' + tb + ' seconds. Who was faster?', options: opts, answer: fast,
        visual: r(), visualDone: r({ cap: (fast ? B : A) + ' was faster' }),
        steps: [C('Both took ' + w + ' whole seconds. Compare the ' + part + '.', [O(dig(a) + ' ' + part, 'stopwatch'), O(dig(b) + ' ' + part, 'stopwatch')].map((o, i) => Object.assign(o, { label: (i ? B : A) + ': ' + o.label })), fast, r(),
          'Both skaters took ' + w + ' whole seconds. ' + (hund && !sameT ? 'So look at the first number after the point: the tenths. ' : hund ? 'The tenths are the same too. So look at the hundredths. ' : 'So look at the number after the point: the tenths. ') + 'Who took fewer ' + part + '?')],
        explain: { text: 'Less time means faster. Compare whole seconds, then tenths.' } };
    }
    if (lv === 4) {
      const a = rnd(3, 9), b = rnd(Math.max(2, 11 - a), 9), t = a + b, r = R({ lo: 0, hi: 20, minor: 1, mid: 5, major: 10, fmt: v => v / 10, unit: 'm', a: 0, b: a, kind: 'ice' });
      const right = decT(t) + ' m', opts = shuffle([right, t + ' m', '0.' + t + ' m']), ans = opts.indexOf(right), k0 = O('One metre, ' + (t - 10) + ' tenths', 'straight-ruler'), o3 = shuffle([k0, O(t + ' whole metres', 'straight-ruler'), O('Under 1 metre', 'straight-ruler')]);
      return { type: 'choice', text: 'The puck slid 0.' + a + ' m, then 0.' + b + ' m more. How far?', say: 'The puck slid zero point ' + a + ' metres. Then it was hit again, and slid zero point ' + b + ' metres more. How far did it slide altogether?', options: opts.map(l => O(l, 'straight-ruler')), answer: ans,
        visual: r(), visualDone: r({ b: t, sign: right }),
        steps: [N(a + ' tenths and ' + b + ' more tenths. How many tenths?', t, r({ from: a }), 'Zero point ' + a + ' is ' + a + ' tenths. Start at ' + a + ', and count on ' + b + ' more tenths.',
            [H.walkOn(a, 1, b, along(r, a, 1, { from: a }), { text: 'Start at ' + a + '. Tap for each tenth.', say: 'Start at ' + a + '. Tap the lane once for each tenth, and count on with me.' + LAST })]),
          C(t + ' tenths of a metre is…', o3, o3.indexOf(k0), r({ b: t }), 'Ten tenths make one whole metre. So ' + t + ' tenths is one metre, and how many tenths more?')],
        explain: { text: 'Ten tenths make one whole. Then count the tenths left.' } };
    }
    /* level 6: how much faster, bridging through the whole second, the way she would count on with money */
    const [A, B] = two(), w = rnd(38, 44), x = rnd(4, 9), y = rnd(1, 6), a = w * 10 + x, b = (w + 1) * 10 + y, up = 10 - x, d = up + y;
    const r = R({ lo: w * 10, hi: (w + 2) * 10, minor: 1, mid: 5, major: 10, fmt: v => v / 10, unit: 's', marks: [{ v: a, label: A }, { v: b, label: B }] });
    return { type: 'num', text: A + ': ' + decT(a) + ' s. ' + B + ': ' + decT(b) + ' s. How many tenths faster?', say: A + ' skated in ' + decT(a) + ' seconds. ' + B + ' skated in ' + decT(b) + ' seconds. How many tenths of a second faster was ' + A + '?', answer: d,
      visual: r(), visualDone: r({ cap: A + ' was ' + decT(d) + ' s faster' }),
      steps: [N('From ' + decT(a) + ' up to ' + (w + 1) + '. How many tenths?', up, r({ from: (w + 1) * 10 }), 'Count on from ' + A + '’s time to the next whole second, ' + (w + 1) + '. How many tenths is that?',
          [H.walk(up, along(r, a, 1), { text: 'Tap the scale. Count each tenth.', say: 'Tap the scale once for each tenth, from ' + A + ' up to ' + (w + 1) + ', and count with me.' + LAST, ask: 'How many tenths?' })]),
        N('Then ' + (w + 1) + ' to ' + decT(b) + '. ' + up + ' and how many more?', d, r({ from: (w + 1) * 10 }), 'That was ' + up + ' tenths. Now count on from ' + (w + 1) + ' to ' + B + '’s time. Start at ' + up + '.',
          [H.walkOn(up, 1, y, along(r, (w + 1) * 10, 1, { from: (w + 1) * 10 }), { text: 'Start at ' + up + '. Tap for each tenth.', say: 'Start at ' + up + '. Tap the scale once for each tenth, and count on with me.' + LAST })])],
      explain: { text: 'Count up to the whole second first. Then count on.' } };
  }
};

SKILLS.ratio = {
  name: 'Ratio and scaling', strand: 'number', start: 1, max: 6,
  gen(lv) {
    const R = el => o => V.ratio(el, o), T = o => el => V.ratio(el, o), pl = (w, n) => w[n === 1 ? 0 : 1];
    if (lv >= 6) {
      const S = pick(RATIO_MIX), a = pick([1, 2, 3]), b = pick([2, 3, 4].filter(v => v !== a && !(a === 2 && v === 4))), k = rnd(2, 5), n = (a + b) * k, base = { A: S.A, B: S.B, na: a, nb: b };
      return { type: 'num', text: a + ' ' + pl(S.a, a) + ' for every ' + b + ' ' + S.b[1] + '. ' + n + ' things. How many ' + S.a[1] + '?',
        say: 'Look at ' + S.whole + '. There ' + (a === 1 ? 'is ' : 'are ') + a + ' ' + pl(S.a, a) + ' for every ' + b + ' ' + S.b[1] + '. There are ' + n + ' things altogether. How many of them are ' + S.a[1] + '?', answer: a * k,
        visual: T(Object.assign({ k: 1 }, base)), visualDone: T(Object.assign({ k, cap: k + ' groups of ' + a + ' ' + pl(S.a, a) }, base)),
        steps: [N('One group: ' + a + ' ' + pl(S.a, a) + ' and ' + b + ' ' + S.b[1] + '. How many things?', a + b, T(Object.assign({ k: 1 }, base)), 'One group has ' + a + ' ' + pl(S.a, a) + ' and ' + b + ' ' + S.b[1] + '. How many things is that in one group?', [H.walk(a + b, wk => T(Object.assign({ k: 1, mode: 'in', inAll: true, walk: wk }, base)), { text: 'Tap each thing in the group. Count.', say: 'Tap each thing in the group, and count with me.' + LAST, ask: 'How many things in one group?' })]),
          N(n + ' things. How many groups of ' + (a + b) + '?', k, T(Object.assign({ k }, base)), 'There are ' + n + ' things, in groups of ' + (a + b) + '. How many groups is that?', [H.walk(k, wk => T(Object.assign({ k, mode: 'sets', walk: wk }, base)), { text: 'Tap each group. Count the groups.', say: 'Tap each group, and count with me.' + LAST, ask: 'How many groups?' })]),
          N(k + ' groups, ' + a + ' ' + pl(S.a, a) + ' in each. How many ' + S.a[1] + '?', a * k, T(Object.assign({ k }, base)), 'There are ' + k + ' groups, with ' + a + ' ' + pl(S.a, a) + ' in each one. Count in ' + a + 's. How many ' + S.a[1] + '?', [H.walkOn(0, a, k, wk => T(Object.assign({ k, mode: 'sets', walk: wk }, base)), { text: 'Tap each group. Count in ' + a + 's.', say: 'Tap each group, and count the ' + S.a[1] + ' in ' + a + 's with me.' + LAST, askSay: 'You counted in ' + a + 's. What number comes last?' })])],
        explain: { text: 'Count whole groups first. Each group has the same mix.' } };
    }
    const S = pick(RATIO_SETS);
    if (lv === 4) {
      const g = pick([2, 3, 4]), u = rnd(2, 5), m = pick([3, 4, 5, 6, 7].filter(v => v !== g)), tot = g * u;
      return { type: 'num', text: g + ' ' + S.a[1] + ' ' + S.v[1] + ' ' + tot + ' ' + S.b[1] + '. ' + m + ' ' + S.a[1] + ' ' + S.v[1] + ' how many?',
        say: g + ' ' + S.a[1] + ' ' + S.v[1] + ' ' + tot + ' ' + S.what + ', and each one ' + S.v[0] + ' the same. How many do ' + m + ' ' + S.a[1] + ' ' + S.v[1] + '? First find what one ' + S.a[0] + ' ' + S.v[0] + '.', answer: m * u,
        visual: T({ k: 1, na: g, nb: tot, per: Math.min(tot, 10), A: S.A, B: S.B, pile: { n: m, art: S.A } }), visualDone: T({ k: m, na: 1, nb: u, A: S.A, B: S.B, cap: m + ' × ' + u + ' = ' + (m * u) }),
        steps: [N(tot + ' ' + S.b[1] + ' shared by ' + g + ' ' + S.a[1] + '. One ' + S.v[0] + '…?', u, T({ k: g, na: 1, nb: u, A: S.A, B: S.B }), 'Share the ' + tot + ' ' + S.b[1] + ' equally between the ' + g + ' ' + S.a[1] + '. How many does one ' + S.a[0] + ' ' + (S.v[1] === 'eat' ? 'get' : S.v[1]) + '?', [H.walk(u, wk => T({ k: g, na: 1, nb: u, A: S.A, B: S.B, mode: 'in', walk: wk }), { text: 'Tap each ' + S.b[0] + ' in one group. Count.', say: 'Look at the first group. Tap each ' + S.b[0] + ' in it, and count with me.' + LAST, ask: 'How many for one ' + S.a[0] + '?' })]),
          N(m + ' ' + S.a[1] + ', ' + u + ' ' + S.b[1] + ' each. Count in ' + u + 's.', m * u, T({ k: m, na: 1, nb: u, A: S.A, B: S.B }), 'Now there are ' + m + ' ' + S.a[1] + ', with ' + u + ' ' + S.b[1] + ' each. Count in ' + u + 's. What number do you end on?', [H.walkOn(0, u, m, wk => T({ k: m, na: 1, nb: u, A: S.A, B: S.B, mode: 'sets', walk: wk }), { text: 'Tap each group. Count in ' + u + 's.', say: 'Tap each group, and count in ' + u + 's with me.' + LAST, askSay: 'You counted in ' + u + 's. What number comes last?' })])],
        explain: { text: 'Find what one gets first. Then scale it up.' } };
    }
    const many = lv === 3 || lv === 5, a = many ? pick([2, 3]) : 1, b = pick((many ? [3, 4, 5] : lv === 1 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6]).filter(v => v !== a)), k = lv === 1 ? rnd(2, 5) : many ? rnd(2, 5) : rnd(3, 8), base = { A: S.A, B: S.B, na: a, nb: b };
    const rule = a + ' ' + pl(S.a, a) + ' ' + pl(S.v, a) + ' ' + b + ' ' + S.b[1] + '. ';
    if (lv === 2 || lv === 5) {
      const n = b * k, ans = a * k, groups = N(n + ' ' + S.b[1] + '. How many groups of ' + b + '?', k, T({ k, na: 0, nb: b, A: S.A, B: S.B }), 'Put the ' + n + ' ' + S.b[1] + ' into groups of ' + b + '. How many groups are there?', [H.walk(k, wk => T({ k, na: 0, nb: b, A: S.A, B: S.B, mode: 'sets', walk: wk }), { text: 'Tap each group of ' + b + '. Count the groups.', say: 'Tap each group of ' + b + ', and count the groups with me.' + LAST, ask: 'How many groups?' })]);
      return { type: 'num', text: rule + n + ' ' + S.b[1] + ' ' + S.back + ' how many ' + S.a[1] + '?',
        say: rule + 'There are ' + n + ' ' + S.what + '. How many ' + S.a[1] + ' do they ' + S.back + '?', answer: ans,
        visual: T(Object.assign({ k: 1, pile: { n, art: S.B } }, base)), visualDone: T(Object.assign({ k, cap: n + ' ÷ ' + b + ' = ' + k + (a > 1 ? ' groups' : '') }, base)),
        steps: a === 1 ? [groups] : [groups, N(k + ' groups, ' + a + ' ' + S.a[1] + ' in each. Count in ' + a + 's.', ans, T(Object.assign({ k }, base)), 'There are ' + k + ' groups, and each group ' + S.back + 's ' + a + ' ' + S.a[1] + '. Count in ' + a + 's. What number do you end on?', [H.walkOn(0, a, k, wk => T(Object.assign({ k, mode: 'sets', walk: wk }, base)), { text: 'Tap each group. Count in ' + a + 's.', say: 'Tap each group, and count the ' + S.a[1] + ' in ' + a + 's with me.' + LAST, askSay: 'You counted in ' + a + 's. What number comes last?' })])],
        explain: { text: 'Find how many groups. The ratio is the same in each.' } };
    }
    const m = a * k, ans = b * k, scale = N(k + (a > 1 ? ' groups, ' : ' ' + pl(S.a, k) + ', ') + b + ' ' + S.b[1] + ' each. Count in ' + b + 's.', ans, T(Object.assign({ k }, base)), (a > 1 ? 'There are ' + k + ' groups, with ' : 'There are ' + k + ' ' + pl(S.a, k) + ', with ') + b + ' ' + S.b[1] + ' each. Count in ' + b + 's. What number do you end on?', [H.walkOn(0, b, k, wk => T(Object.assign({ k, mode: 'sets', walk: wk }, base)), { text: 'Tap each group. Count in ' + b + 's.', say: 'Tap each group, and count the ' + S.b[1] + ' in ' + b + 's with me.' + LAST, askSay: 'You counted in ' + b + 's. What number comes last?' })]);
    return { type: 'num', text: rule + m + ' ' + S.a[1] + ' ' + S.v[1] + ' how many?',
      say: rule + 'How many ' + S.what + ' do ' + m + ' ' + S.a[1] + ' ' + S.v[1] + '?', answer: ans,
      visual: T(Object.assign({ k: 1, pile: { n: m, art: S.A } }, base)), visualDone: T(Object.assign({ k, cap: k + ' × ' + b + ' = ' + ans }, base)),
      steps: a === 1 ? [scale] : [N(m + ' ' + S.a[1] + '. How many groups of ' + a + '?', k, T({ k, na: a, nb: 0, A: S.A, B: S.B }), 'Put the ' + m + ' ' + S.a[1] + ' into groups of ' + a + '. How many groups are there?', [H.walk(k, wk => T({ k, na: a, nb: 0, A: S.A, B: S.B, mode: 'sets', walk: wk }), { text: 'Tap each group of ' + a + '. Count the groups.', say: 'Tap each group of ' + a + ', and count the groups with me.' + LAST, ask: 'How many groups?' })]), scale],
      explain: { text: 'A ratio is the same in every group.' } };
  }
};
