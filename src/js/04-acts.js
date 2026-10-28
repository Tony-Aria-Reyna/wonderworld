/* ===== the activity shell and the kit of things-to-do ===== */
const ABORT = { abort: true };
const BACKSPACE = '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12 9l5 6M17 9l-5 6"/></svg>';
let activeUI = null;
document.addEventListener('keydown', e => { if (activeUI && activeUI.alive && activeUI.key) activeUI.key(e); });

function makeUI(onHome, cid) {
  const stage = h('div', { class: 'stage' }), answer = h('div', { class: 'answer' }), bub = bubble('', ''), stepsEl = h('div', { class: 'steps' });
  const root = h('div', { class: 'screen act' },
    h('div', { class: 'act-top' },
      h('button', { class: 'round', 'aria-label': 'Back to the path', onclick: () => { sfx.tap(); onHome(); } }, ic('house')),
      stepsEl, h('div', { class: 'pill' }, ic('star'), h('span', { class: 'starcount' }, S.stars))),
    h('div', { class: 'act-body' }, h('div', { class: 'prompt' }, kiwi('', cid), bub), stage, answer));   /* the guide belongs to the country she is in */
  const ui = {
    root, stage, answer, bub, alive: true, key: null,
    check() { if (!ui.alive) throw ABORT; },
    async wait(ms) { await wait(ms); ui.check(); },
    dispose() { ui.alive = false; ui.key = null; W.cur = null; },
    steps(n, i) { stepsEl.innerHTML = ''; for (let k = 0; k < n; k++) stepsEl.append(h('i', { class: k < i ? 'done' : k === i ? 'now' : '' })); },
    prompt(text, say, o) { ui.check(); return bub.set(text, say, o); },
    help(on) { root.classList.toggle('help', !!on); kiwiMood(root, on ? 'think' : ''); },
    wide(on) { root.classList.toggle('wide', !!on); },
    clear() { stage.innerHTML = ''; answer.innerHTML = ''; ui.key = null; },
    async good(word, icon) { if (icon) sfx.great(); else sfx.good(); kiwiMood(root, 'cheer'); const f = h('div', { class: 'flash ok' }, ic(icon || 'check-mark-button')); stage.append(f); bub.set(word || pick(CHEERS.concat(W.cheers || [])), icon ? word : ' '); if (icon) confetti(24); await ui.wait(icon ? 1500 : 850); f.remove(); },
    async soft() { sfx.soft(); stage.classList.add('wobble'); const t = pick(SOFT); const p = bub.set(t); await Promise.race([p, wait(2600)]); await ui.wait(350); stage.classList.remove('wobble'); },
    /* a single big button; resolves when pressed */
    next(label, into, cls) {
      return new Promise(res => {
        const b = h('button', { class: 'btn go big ' + (cls || ''), onclick: () => { sfx.pop(); ui.key = null; b.remove(); res(); } }, label || 'Next');
        (into || answer).append(b); ui.key = e => { if (e.key === 'Enter') b.click(); };
        W.cur = { type: 'btn', auto: () => b.click() };
      });
    }
  };
  activeUI = ui; return ui;
}

/* ---------- asking: number pad ---------- */
function askNum(ui, it) {
  return new Promise(res => {
    ui.answer.innerHTML = ''; let val = '';
    const disp = h('div', { class: 'disp empty' }, '?');
    const upd = () => { disp.textContent = val || '?'; disp.classList.toggle('empty', !val); };
    const done = () => { if (!val) { disp.classList.add('wobble'); setTimeout(() => disp.classList.remove('wobble'), 400); return; } ui.key = null; res(Number(val)); };
    const press = k => { sfx.tap(); if (k === 'del') val = val.slice(0, -1); else if (k === 'ok') return done(); else if (val.length < 4) val = (val === '0' ? '' : val) + k; upd(); };
    const key = (k, label, cls) => h('button', { class: cls || '', 'data-k': k, onclick: () => press(k) }, label);
    const np = h('div', { class: 'np' }, disp, ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => key(d, d)),
      h('button', { class: 'del', 'data-k': 'del', 'aria-label': 'Rub out', html: BACKSPACE, onclick: () => press('del') }), key('0', '0'), key('ok', 'OK', 'ok'));
    ui.answer.append(np);
    ui.key = e => { if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Enter') press('ok'); };
    W.cur = { type: 'num', answer: it.answer, give: v => { val = String(v); upd(); done(); } };
  });
}
/* ---------- asking: tap a choice ---------- */
function askChoice(ui, it) {
  return new Promise(res => {
    ui.answer.innerHTML = '';
    const wrap = h('div', { class: 'opts' + (it.options.length === 2 ? ' two' : '') });
    it.options.forEach((o, i) => {
      const out = (it.gone || []).includes(i);
      const b = h('button', { class: 'opt' + (out ? ' gone' : ''), disabled: out, onclick: () => { sfx.tap(); ui.key = null; res(i); } },
        o.svg ? h('span', { html: o.svg }) : (o.icon ? art(o.icon) : null), o.ar ? h('span', { class: 'ar' }, o.ar) : null, o.label ? h('span', null, o.label) : null);
      wrap.append(b);
    });
    ui.answer.append(wrap);
    ui.key = e => { const n = Number(e.key); if (n >= 1 && n <= it.options.length && !(it.gone || []).includes(n - 1)) { ui.key = null; res(n - 1); } };
    W.cur = { type: 'choice', answer: it.answer, n: it.options.length, give: i => { ui.key = null; res(i); } };
  });
}
async function askItem(ui, it) {
  ui.check(); ui.stage.innerHTML = '';
  if (it.visual) it.visual(ui.stage);
  const p = ui.prompt(it.text, it.say);
  if (it.audio) p.then(() => { if (ui.alive) it.audio(); });
  const got = it.type === 'num' ? await askNum(ui, it) : await askChoice(ui, it);
  ui.check(); it._got = got;
  return got === it.answer;
}

/* ---------- re-teaching. The game never says or lights up an answer.
   A missed question is broken into smaller steps. A missed step becomes hands-on: she works it with a tool on the screen.
   If that still does not land, scaffold() returns false and the engine gives an easier question instead. ---------- */
async function scaffold(ui, item) {
  ui.help(true);
  for (const step of (item.steps || [])) {
    let miss = 0, view = null, gone = [];
    if (step.pre) view = await runHands(ui, step.pre);                       // some steps start with her hands
    for (;;) {
      const ask = Object.assign({}, step, view ? { visual: view.draw, text: view.text || step.text, say: view.say || view.text || step.say } : null, { gone });
      const ok = await askItem(ui, ask);
      if (ok) { sfx.pop(); const f = h('div', { class: 'flash ok' }, ic('check-mark-button')); ui.stage.append(f); await ui.wait(550); f.remove(); break; }
      miss++; sfx.soft();
      if (step.type !== 'num') {                                             // a choice: rule out her pick, look at the clue again
        gone = gone.concat(ask._got); if (gone.length >= step.options.length - 1 && !gone.includes(step.answer)) gone = gone.slice(-(step.options.length - 1));
        await Promise.race([ui.prompt(step.nudge || 'Not that one. Look at the clue again.'), wait(2600)]); await ui.wait(250);
        continue;
      }
      const tools = (step.hands && step.hands.length) ? step.hands : (step.pre ? [step.pre] : []);
      if (!tools.length || miss > tools.length + 1) { ui.help(false); return false; }
      await Promise.race([ui.prompt(miss === 1 ? "Let's use our hands." : "Let's do it once more, slowly."), wait(2200)]); await ui.wait(200);
      view = await runHands(ui, tools[Math.min(miss, tools.length) - 1]);
    }
  }
  await explain(ui, item);
  ui.help(false); return true;
}

/* ---------- hands-on tools. Each resolves to { draw(el), text, say }: the finished picture and what to ask about it.
   The game counts along as she taps, but never says or shows the last number: that one is hers. ---------- */
const HANDS = {};
function runHands(ui, tool) { ui.check(); ui.answer.innerHTML = ''; ui.key = null; return new Promise((res, rej) => { const stop = setInterval(() => { if (!ui.alive) { clearInterval(stop); rej(ABORT); } }, 300); HANDS[tool.k](ui, tool).then(v => { clearInterval(stop); res(v); }); }); }
const tokFace = (v, t) => t.icon && Math.abs(v) === 1 ? art(t.icon)
  : t.rows && v > 0 && v <= 10 ? h('i', { class: 'rowface' }, Array.from({ length: v }, () => h('u')))        // one row of v blocks
  : (v === 1 && !t.signed ? h('i', { class: 'blk' }) : h('span', null, (v > 0 ? '+' : '−') + Math.abs(v)));
/* tap tokens to count. t: start, steps [each token's worth], icon, tally (count the taps, not the total), pre (tokens already counted), text, say, ask, askSay */
HANDS.tap = (ui, t) => new Promise(res => {
  const n = t.steps.length, uniform = t.steps.every(x => x === t.steps[0]), order = [];
  const total = k => (t.start || 0) + t.steps.slice(0, k).reduce((a, b) => a + b, 0);
  const draw = (el, live) => {
    el.innerHTML = ''; const row = h('div', { class: 'htoks' + (t.stack ? ' stack' : '') + (t.rows ? ' rows' : '') });
    for (let i = 0; i < (t.pre || 0); i++) row.append(h('div', { class: 'htok pre' }, tokFace(1, t)));
    t.steps.forEach((v, i) => {
      const k = order.indexOf(i), on = k >= 0, last = on && k === n - 1 && !t.tally;
      const e = h(live && !on ? 'button' : 'div', { class: 'htok' + (on ? ' on' : '') + (last ? ' q' : '') + (Math.abs(v) >= 100 ? ' big' : Math.abs(v) >= 10 ? ' mid' : ''), 'aria-label': 'Tap to count' }, tokFace(v, t), on ? h('b', null, last ? '?' : total(k + 1)) : null);
      if (live && !on) e.addEventListener('click', () => tap(uniform ? i : order.length));
      row.append(e);
    });
    el.append(h('div', { class: 'hands' }, t.start ? h('div', { class: 'hstart' }, h('small', null, 'start'), t.start) : null, t.stack && t.under ? h('div', { class: 'hstackwrap' }, row, art(t.under.art), h('span', null, t.under.name)) : row));
  };
  const tap = i => {
    if (order.includes(i)) return; order.push(i); const k = order.length; sfx.step();
    if (t.tally) Speech.say(String(total(k))); else if (k < n) Speech.say(String(total(k)));
    draw(ui.stage, true);
    if (k === n) { W.cur = null; setTimeout(() => res({ draw: el => draw(el, false), text: t.ask || 'What number comes last?', say: t.askSay }), W.fast ? 10 : 600); }
  };
  if (!n) return res({ draw: el => draw(el, false), text: t.ask, say: t.askSay });
  ui.stage.innerHTML = ''; draw(ui.stage, true); ui.prompt(t.text, t.say);
  W.cur = { type: 'hands', auto: () => { for (let i = 0; i < n; i++) tap(uniform ? i : order.length); } };
});
/* share things out fairly: each tap on the pile gives one to every group. t: n, groups, icon */
HANDS.deal = (ui, t) => new Promise(res => {
  const per = t.n / t.groups; let rounds = 0;
  const draw = (el, live) => {
    el.innerHTML = ''; const plates = h('div', { class: 'hplates' });
    for (let g = 0; g < t.groups; g++) { const p = h('div', { class: 'hplate' }); for (let i = 0; i < rounds; i++) p.append(art(t.icon)); plates.append(p); }
    const left = (per - rounds) * t.groups, pile = left ? h(live ? 'button' : 'div', { class: 'hpile', 'aria-label': 'Share them out' }, Array.from({ length: left }, () => art(t.icon))) : null;
    if (pile && live) pile.addEventListener('click', go);
    el.append(h('div', { class: 'hands deal' }, pile, plates));
  };
  function go() { if (rounds >= per) return; rounds++; sfx.place(); draw(ui.stage, true);
    if (rounds === per) { W.cur = null; setTimeout(() => res({ draw: el => draw(el, false), text: t.ask || 'How many in one group?', say: t.askSay }), W.fast ? 10 : 600); } }
  ui.stage.innerHTML = ''; draw(ui.stage, true);
  ui.prompt('Share them out. Tap the pile.', 'Share them out fairly. Tap the pile to give one to each group. Keep going until the pile is gone.');
  W.cur = { type: 'hands', auto: () => { while (rounds < per) go(); } };
});
/* tap each side or corner of a shape to count it. t: n, mode ('sides' | 'corners'), name */
HANDS.spots = (ui, t) => new Promise(res => {
  const order = [], pts = V.polySpots(t.n, t.mode);
  const draw = (el, live) => {
    el.innerHTML = ''; const pic = h('div', { class: 'pic' }); V.poly(pic, t.n, t.mode, 0, order, order.length === t.n);
    const box = h('div', { class: 'spots' }, pic);
    if (live) pts.forEach((p, i) => { if (!order.includes(i)) box.append(h('button', { class: 'spot', 'aria-label': 'Tap to count', style: { left: (p[0] * 100) + '%', top: (p[1] * 100) + '%' }, onclick: () => tap(i) })); });
    el.append(h('div', { class: 'cq' }, box));
  };
  const tap = i => { if (order.includes(i)) return; order.push(i); sfx.step(); if (order.length < t.n) Speech.say(String(order.length)); draw(ui.stage, true);
    if (order.length === t.n) { W.cur = null; setTimeout(() => res({ draw: el => draw(el, false), text: 'What number comes last?', say: 'You touched every one. What number comes last?' }), W.fast ? 10 : 600); } };
  ui.stage.innerHTML = ''; draw(ui.stage, true);
  ui.prompt('Tap each ' + t.mode.slice(0, -1) + ' of the ' + t.name + '.', 'Tap each ' + t.mode.slice(0, -1) + ' of the ' + t.name + ', one at a time, and count with me. You say the last number.');
  W.cur = { type: 'hands', auto: () => { for (let i = 0; i < t.n; i++) tap(i); } };
});
/* turn the pointer herself. t: from, to, ccw, unit (2 = quarter turns, 1 = half-quarter steps), eight, goal (show where to stop), text, say, ask, askSay */
HANDS.turn = (ui, t) => new Promise(res => {
  const unit = t.unit || 2, all = [0, 1, 2, 3, 4, 5, 6, 7], total = (((t.ccw ? t.from - t.to : t.to - t.from) + 8) % 8 || 8) / unit; let taps = 0;
  const at = () => (t.from + (t.ccw ? -1 : 1) * taps * unit + 64) % 8;
  const draw = el => V.compass(el, { eight: t.eight, show: t.eight ? all : null, was: taps ? t.from : null, face: at(), spin: t.ccw ? 'ccw' : 'cw', ask: null, goal: t.goal ? t.to : null,
    arc: taps ? { from: t.from, to: at(), ccw: t.ccw, unit, dots: true } : null });
  const btn = h('button', { class: 'btn big turnbtn', onclick: go }, h('span', { class: 'turnic' + (t.ccw ? ' ccw' : ''), html: '<svg viewBox="-16 -16 32 32"><path d="M-9 5A10 10 0 1 1 5 9" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M-2 4 7 12 -3 17Z" fill="currentColor"/></svg>' }), 'Turn');
  function go() { if (taps >= total) return; taps++; sfx.step(); draw(ui.stage);
    if (taps === total) { W.cur = null; btn.remove(); setTimeout(() => res({ draw, text: t.ask, say: t.askSay }), W.fast ? 10 : 700); } }
  ui.stage.innerHTML = ''; draw(ui.stage); ui.answer.innerHTML = ''; ui.answer.append(btn); ui.prompt(t.text, t.say);
  W.cur = { type: 'hands', auto: () => { while (taps < total) go(); } };
});

/* work it on the picture itself: the graph, the thermometer, the clock. Tony's rule: the hands-on help happens on the thing she was asked about, never on a separate screen of boxes.
   t: n (taps to make), draw(el, walk) draws the picture with walk = { done, n, labels, live }; whatever it draws with class "hot" takes her tap, and each tap is the next step along.
   on: the labels count on from start in steps of by (or by each amount in steps); otherwise they count 1, 2, 3. The last label is always "?": that number is hers. */
HANDS.pic = (ui, t) => new Promise(res => {
  const seq = [], show = t.fmt || String;    /* seq: which tappable thing she tapped, in the order she tapped them. A square or a counter takes its number where she touched it */
  const amt = i => t.steps ? t.steps[i] : t.on ? t.by : 1, val = k => (t.on || t.steps ? t.start : 0) + seq.slice(0, k).reduce((x, i) => x + amt(i), 0);
  const walk = live => ({ done: seq.length, n: t.n, live, seq: seq.slice(), labels: seq.map((_, k) => k === t.n - 1 ? '?' : show(val(k + 1))) });
  const draw = (el, live) => { t.draw(el, walk(live)); if (live) el.querySelectorAll('.hot').forEach(x => x.addEventListener('click', tap)); };
  function tap(e) { if (seq.length >= t.n) return; if (e && e.stopPropagation) e.stopPropagation();
    let i = e && e.currentTarget && e.currentTarget.getAttribute('data-i'); i = i == null ? -1 : Number(i); if (i < 0 || seq.includes(i)) for (i = 0; seq.includes(i); i++);
    seq.push(i); const k = seq.length; sfx.step(); if (k < t.n) Speech.say(t.speak ? t.speak(val(k)) : String(val(k))); draw(ui.stage, true);
    if (k === t.n) { W.cur = null; setTimeout(() => res({ draw: el => draw(el, false), text: t.ask, say: t.askSay }), W.fast ? 10 : 600); } }
  ui.stage.innerHTML = ''; draw(ui.stage, true); ui.prompt(t.text, t.say);
  W.cur = { type: 'hands', auto: () => { while (seq.length < t.n) tap(); } };
});

async function explain(ui, item) {
  const ex = item.explain; if (!ex) return;
  ui.stage.innerHTML = ''; const vis = item.visualDone || item.visual; if (vis) vis(ui.stage);
  ui.answer.innerHTML = '';
  const box = h('div', { class: 'explain' }, ex.pic ? art(ex.pic, 'ex-ic') : ic('light-bulb', 'ex-ic'), h('p', null, ex.text));
  ui.answer.append(box);
  ui.prompt('Now you know!', ex.say || ex.text);
  await ui.next('Got it!', box);
  box.remove();
}

/* ---------- drag-or-tap helper ---------- */
function dragTap(el, onTap, onDrop) {
  el.addEventListener('pointerdown', e => {
    if (el.classList.contains('used')) return;
    const sx = e.clientX, sy = e.clientY; let ghost = null, ox = 0, oy = 0;
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 10) {
        const r = el.getBoundingClientRect(); ghost = el.cloneNode(true); ghost.classList.remove('glow', 'sel'); ghost.classList.add('drag'); ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
        ox = sx - r.left; oy = sy - r.top; document.body.append(ghost); el.style.opacity = '.3';
      }
      if (ghost) { ghost.style.left = (ev.clientX - ox) + 'px'; ghost.style.top = (ev.clientY - oy) + 'px'; }
    };
    const up = ev => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      el.style.opacity = '';
      if (ghost) { ghost.remove(); const t = document.elementFromPoint(ev.clientX, ev.clientY); if (onDrop) onDrop(t, ev.clientX, ev.clientY); } else onTap();
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
}

const ACTS = {};

/* ---------- drag pieces onto a picture ---------- */
ACTS.place = (ui, d) => new Promise(res => {
  ui.wide(true); ui.prompt(d.text, d.say);
  const board = h('div', { class: 'board' + (d.cls ? ' ' + d.cls : ''), html: d.board }), tray = h('div', { class: 'tray' });
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'placewrap fill' }, h('div', { class: 'cq' }, board), tray));
  let sel = null, left = d.items.length; const slots = {}, chips = {}, miss = {};
  const finish = async () => { sfx.great(); kiwiMood(ui.root, 'cheer'); if (d.done) await Promise.race([ui.prompt(d.done.text, d.done.say), wait(3500)]); try { await ui.wait(500); } catch (e) { return; } res(); };
  const tryPlace = (it, slot) => {
    if (!slot || !slot._it || slot.classList.contains('filled')) return;
    if ((slot._it.kind || slot._it.id) === (it.kind || it.id)) {
      slot.classList.add('filled'); slot.classList.remove('hint'); if (d.tags) { slot.classList.add('tag'); slot.style.width = 'auto'; slot.style.aspectRatio = 'auto'; slot.textContent = slot._it.label; } else slot.append(art(slot._it.art)); chips[it.id].classList.add('used'); chips[it.id].classList.remove('sel'); sel = null; sfx.place();
      if (it.fact) ui.prompt(it.fact.text, it.fact.say);
      if (--left === 0) finish();
    } else {
      sfx.soft(); slot.classList.add('wobble'); setTimeout(() => slot.classList.remove('wobble'), 400);
      miss[it.id] = (miss[it.id] || 0) + 1;
      if (it.hint) ui.prompt(it.hint.text, it.hint.say);
    }
  };
  /* a tap or drop counts for the nearest empty place, so small places on a small screen are still easy to hit */
  const nearest = (x, y) => { let best = null, bd = 1e9; d.items.forEach(o => { const s = slots[o.id]; if (s.classList.contains('filled')) return; const r = s.getBoundingClientRect(), dist = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (dist < bd) { bd = dist; best = s; } }); const br = board.getBoundingClientRect(); return bd <= Math.max(34, br.width * .13) ? best : null; };
  board.addEventListener('click', e => { if (sel && !e.target.closest('.slot')) { const s = nearest(e.clientX, e.clientY); if (s) tryPlace(sel, s); } });
  d.items.forEach(it => {
    const s = h('button', { class: 'slot', style: { left: it.x + '%', top: it.y + '%', width: (it.w || 17) + '%', 'aspect-ratio': String(it.ar || 1) }, 'aria-label': 'A place on the picture', onclick: () => { if (sel) tryPlace(sel, s); } });
    s._it = it; slots[it.id] = s; board.append(s);
  });
  shuffle(d.items).forEach(it => {
    const c = h('div', { class: 'chip' + (it.art ? '' : ' word'), role: 'button' }, it.art ? art(it.art) : null, h('span', null, it.label)); chips[it.id] = c; tray.append(c);
    dragTap(c, () => { sfx.tap(); $$('.chip', tray).forEach(x => x.classList.remove('sel')); sel = it; c.classList.add('sel'); },
      (t, x, y) => tryPlace(it, (t && t.closest && t.closest('.slot:not(.filled)')) || nearest(x, y)));
  });
  W.cur = { type: 'act', auto: () => d.items.forEach(it => { if (!chips[it.id].classList.contains('used')) tryPlace(it, slots[it.id]); }) };
});

/* ---------- sort things into two groups ---------- */
ACTS.sort = (ui, d) => new Promise(res => {
  ui.wide(true); const intro = ui.prompt(d.text, d.say); let told = false;
  const card = h('div', { class: 'sortcard' }), got = [h('div', { class: 'got' }), h('div', { class: 'got' })];
  const bins = d.bins.map((b, i) => h('button', { class: 'bin ' + (i ? 'b' : 'a') + (d.even ? ' even' : ''), onclick: () => choose(i) }, ic(b.icon), b.label, got[i]));
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'sortwrap fill' }, card, bins));
  const items = shuffle(d.items); let i = -1, cur = null;
  const show = () => { i++; if (i >= items.length) { sfx.great(); kiwiMood(ui.root, 'cheer'); const p = d.done ? ui.prompt(d.done.text, d.done.say) : Promise.resolve(); Promise.race([p, wait(3500)]).then(() => res()); return; }
    cur = items[i]; card.innerHTML = ''; card.append(art(cur.art || cur.icon), h('div', null, cur.label)); card.classList.remove('wobble');
    /* the first name waits for the instructions to finish; a hint from the last bird is cleared */
    const mine = cur, name = () => { if (cur === mine && ui.alive) Speech.say(mine.say ? mine.say() : mine.label); };
    if (told) { told = false; ui.bub.set(d.text, ' '); }
    if (i === 0) intro.then(name); else name(); };
  function choose(b) {
    if (!cur) return;
    if (b === cur.bin) { sfx.place(); got[b].append(art(cur.art || cur.icon)); cur = null; show(); }
    else { sfx.soft(); card.classList.remove('wobble'); void card.offsetWidth; card.classList.add('wobble'); told = true; ui.prompt(cur.why); }
  }
  show();
  W.cur = { type: 'act', auto: () => { while (cur) choose(cur.bin); } };
});

/* ---------- match pairs ---------- */
ACTS.match = (ui, d) => new Promise(res => {
  ui.wide(true); ui.prompt(d.text, d.say);
  const wrap = h('div', { class: 'matchwrap' }); ui.stage.innerHTML = ''; ui.stage.append(wrap);
  const right = shuffle(d.pairs.map((_, i) => i)); let selL = null, selR = null, left = d.pairs.length, misses = 0; const L = [], R = [];
  const check = () => {
    if (selL == null || selR == null) return;
    if (selL === selR) { const p = d.pairs[selL]; L[selL].classList.add('done'); R[selR].classList.add('done'); sfx.place(); if (p.text || p.say) ui.prompt(p.text || p.say, p.say); selL = selR = null; $$('.sel', wrap).forEach(x => x.classList.remove('sel', 'glow')); if (--left === 0) { sfx.great(); kiwiMood(ui.root, 'cheer'); setTimeout(res, W.fast ? 10 : 1800); } }
    else { sfx.soft(); const a = L[selL], b = R[selR]; [a, b].forEach(x => { x.classList.add('wobble'); setTimeout(() => x.classList.remove('wobble', 'sel'), 400); }); misses++; selR = null; const keep = selL; selL = null; setTimeout(() => { selL = keep; L[keep].classList.add('sel'); }, 420); }
  };
  d.pairs.forEach((p, i) => {
    L[i] = h('button', { class: 'mcard', onclick: () => { sfx.tap(); $$('.mcard.sel', wrap).forEach(x => x.classList.remove('sel')); selL = i; selR = null; L[i].classList.add('sel'); } }, art(p.a.art), h('span', null, p.a.label));
    R[i] = h('button', { class: 'mcard', onclick: () => { sfx.tap(); if (selL == null) return; selR = i; R[i].classList.add('sel'); check(); } }, p.b.art ? art(p.b.art) : null, h('span', null, p.b.label));
  });
  d.pairs.forEach((_, i) => wrap.append(L[i], R[right[i]]));
  W.cur = { type: 'act', auto: () => d.pairs.forEach((_, i) => { selL = i; selR = i; check(); }) };
});

/* ---------- put things in order ---------- */
ACTS.order = (ui, d) => new Promise(res => {
  ui.wide(true); ui.prompt(d.text, d.say);
  const slots = d.steps.map((_, i) => h('div', { class: 'oslot' }, i + 1)), cards = [];
  const sl = h('div', { class: 'oslots' }, slots), cl = h('div', { class: 'ocards' });
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'orderwrap' }, sl, cl));
  let next = 0, misses = 0;
  const tap = i => {
    if (i === next) { const c = cards[i]; slots[next].innerHTML = ''; slots[next].append(c); c.classList.remove('glow'); sfx.place(); if (d.steps[i].say) ui.prompt(d.steps[i].say); next++; misses = 0;
      if (next === d.steps.length) { sfx.great(); kiwiMood(ui.root, 'cheer'); setTimeout(res, W.fast ? 10 : 2200); } }
    else { sfx.soft(); cards[i].classList.add('wobble'); setTimeout(() => cards[i].classList.remove('wobble'), 400); misses++; if (d.hints) ui.prompt(d.hints[next]); }
  };
  d.steps.forEach((s, i) => { cards[i] = h('button', { class: 'ocard', onclick: () => tap(i) }, art(s.art || s.icon), h('span', null, s.label)); });
  shuffle(cards.slice()).forEach(c => cl.append(c));
  W.cur = { type: 'act', auto: () => { while (next < d.steps.length) tap(next); } };
});

/* ---------- meet new words. They are spoken by a real voice for the language (the device's own, or a recording).
   With no real voice the cards are read, not heard: tapping a card says only what it means, in English. ---------- */
ACTS.meet = (ui, d) => new Promise(res => {
  const voiced = d.words.filter(w => Speech.can(d.lang, w.native)).length, heard = voiced === d.words.length, some = voiced > 0 && !heard;
  if (some) ui.prompt('Tap each card. Listen or read. Say the word out loud!', 'Tap each card. Some words you can hear. Some you read. Say each word out loud.');
  else ui.prompt(heard ? d.text : (d.textRead || 'Tap each card. Say the word out loud!'), heard ? d.say : (d.sayRead || d.say));
  ui.wide(true);
  const wrap = h('div', { class: 'words' }), box = h('div', { class: 'col' }, wrap); ui.stage.innerHTML = ''; ui.stage.append(box);
  let seen = 0, shown = false;
  d.words.forEach(w => {
    const c = h('button', { class: 'wcard', onclick: () => { sfx.tap();
        if (Speech.can(d.lang, w.native)) Speech.say([{ t: w.native, lang: d.lang, fallback: w.phon }, w.en]); else Speech.say('This word means ' + w.en + '. Say it out loud!');
        if (!c.classList.contains('heard')) { c.classList.add('heard'); seen++; }
        if (seen === d.words.length && !shown) { shown = true; ui.next(heard ? "I've heard them all" : some ? "I've done them all" : "I've read them all", box).then(res); } } },
      art(w.icon), h('span', { class: 'ar' + (d.lang === 'ar' ? '' : ' ltr') }, w.native), w.rom !== w.native ? h('span', { class: 'rom' }, w.rom) : null, h('span', null, w.en));
    wrap.append(c);
  });
  W.cur = { type: 'act', auto: () => { $$('.wcard', wrap).forEach(c => c.click()); setTimeout(() => { const b = $('.btn', box); if (b) b.click(); }, 20); } };
});

/* ---------- predict, test, explain ---------- */
ACTS.predict = async (ui, d) => {
  ui.wide(false); ui.stage.innerHTML = ''; d.setup(ui.stage);
  ui.prompt(d.q, d.qsay);
  const guess = await askChoice(ui, { options: d.options, answer: d.answer }); ui.check();
  ui.answer.innerHTML = ''; await Promise.race([ui.prompt("Good guess. Let's test it!"), wait(2500)]); ui.check();
  W.cur = null; await d.sim(ui.stage, ui); ui.check();
  const right = guess === d.answer; if (right) { sfx.great(); kiwiMood(ui.root, 'cheer'); confetti(30); } else sfx.pop();
  ui.prompt(right ? d.right : d.wrong);
  await ui.next('Next');
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'col' }, d.tryit.pic ? h('div', { class: 'trypic', html: d.tryit.pic.svg }) : art(d.tryit.icon, 'hero'), h('div', { class: 'bigtext', style: { 'font-size': '1.9rem' } }, d.tryit.big)));   /* tryit.pic: a wide drawing of what to set up, shown large */
  ui.prompt(d.tryit.text, d.tryit.say);
  await ui.next('I did it!');
};

/* ---------- find a country on the map ---------- */
ACTS.findmap = (ui, d) => new Promise(res => {
  ui.wide(true); ui.prompt(d.text, d.say);
  const cols = ['#FF7A6B', '#8B7BEA', '#34C17B', '#FFC83D'];
  let s = ''; for (const id in MAP.c) if (!d.targets.includes(id)) s += '<path d="' + MAP.c[id].d + '" fill="#F6E7B8" stroke="#E2CB8B" stroke-width=".5"/>';
  d.targets.forEach((id, i) => { const c = MAP.c[id]; s += '<g class="tgt" data-id="' + id + '" style="cursor:pointer"><path d="' + c.d + '" fill="' + cols[i] + '" stroke="#1B2A4E" stroke-width="1.2"/><circle cx="' + c.x + '" cy="' + c.y + '" r="15" fill="transparent"/></g>'; });
  ui.stage.innerHTML = '<svg class="viz" viewBox="' + d.view.join(' ') + '" style="background:#BDEEF2;border-radius:1rem" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  let misses = 0;
  const tap = id => {
    const g = $('.tgt[data-id="' + id + '"]', ui.stage);
    if (id === d.answer) { sfx.great(); kiwiMood(ui.root, 'cheer'); g.firstChild.setAttribute('fill', '#FFC83D'); g.firstChild.setAttribute('stroke-width', '3'); const p = ui.prompt(d.done.text, d.done.say); Promise.race([p, wait(3500)]).then(() => setTimeout(res, W.fast ? 5 : 500)); }
    else { sfx.soft(); g.style.opacity = '.35'; ui.prompt(d.hint.text, d.hint.say); if (++misses >= 2) { const a = $('.tgt[data-id="' + d.answer + '"] path', ui.stage); a.setAttribute('stroke', '#8B7BEA'); a.setAttribute('stroke-width', '4'); } }
  };
  $$('.tgt', ui.stage).forEach(g => g.addEventListener('click', () => tap(g.getAttribute('data-id'))));
  W.cur = { type: 'act', auto: () => tap(d.answer) };
});

/* ---------- build the pyramid ---------- */
ACTS.build = (ui, d) => new Promise(res => {
  ui.wide(true); ui.prompt(d.text, d.say);
  const rows = d.rows, total = rows.reduce((a, b) => a + b, 0), filled = rows.map(n => Array(n).fill(false)); let count = 0, hintT = null;
  const cnt = h('div', { class: 'pyr-count' }, '0 of ' + total), rowsEl = h('div', { class: 'pyr-rows' }), el = [];
  const can = (r, i) => !filled[r][i] && (r === 0 || (filled[r - 1][i] && filled[r - 1][i + 1]));
  const showOk = () => { rows.forEach((n, r) => { for (let i = 0; i < n; i++) el[r][i].classList.toggle('ok', can(r, i)); }); clearTimeout(hintT); hintT = setTimeout(() => $$('.pslot.ok', rowsEl).forEach(x => x.classList.remove('ok')), 3500); };
  const tap = (r, i) => {
    if (filled[r][i]) return;
    if (can(r, i)) { filled[r][i] = true; const e = el[r][i]; e.classList.remove('ok'); e.classList.add('full'); if (r === rows.length - 1) e.classList.add('gold'); sfx.place(); count++; cnt.textContent = count + ' of ' + total;
      if (count === total) { sfx.win(); confetti(50); kiwiMood(ui.root, 'cheer'); const p = ui.prompt(d.done.text, d.done.say); Promise.race([p, wait(4500)]).then(() => ui.next('Next', box).then(res)); } }
    else { sfx.bonk(); el[r][i].classList.add('wobble'); setTimeout(() => el[r][i].classList.remove('wobble'), 400); ui.prompt(d.hint.text, d.hint.say); showOk(); }
  };
  for (let r = rows.length - 1; r >= 0; r--) { const re = h('div', { class: 'pyr-row' }); el[r] = []; for (let i = 0; i < rows[r]; i++) { const b = h('button', { class: 'pslot', 'aria-label': 'A space for a block', onclick: () => tap(r, i) }); el[r][i] = b; re.append(b); } rowsEl.append(re); }
  const box = h('div', { class: 'pyr fill' }, h('div', { class: 'sun-rays' }), cnt, rowsEl);
  ui.stage.innerHTML = ''; ui.stage.append(box);
  W.cur = { type: 'act', auto: () => { rows.forEach((n, r) => { for (let i = 0; i < n; i++) tap(r, i); }); setTimeout(() => { const b = $('.btn', box); if (b) b.click(); }, 60); } };
});

/* ---------- code a mover across a grid. p.look names the pieces: { mover, rock, goal, goalName, flag, flagName, cls } ---------- */
const ARROW = { u: '↑', d: '↓', l: '←', r: '→' }, DELTA = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }, DIRWORD = { u: 'up', d: 'down', l: 'left', r: 'right' };
const timesWord = n => n === 1 ? 'once' : n === 2 ? 'twice' : n + ' times';
ACTS.code = async (ui, p, ctx) => {
  ui.wide(false);
  const L = Object.assign({ mover: 'camel', rock: 'rock', goal: PYRAMID_ART, goalName: 'pyramid', flag: 'triangular-flag', flagName: 'flag', cls: '' }, p.look || {});
  const key = (x, y) => x + ',' + y, rocks = new Set((p.rocks || []).map(r => key(r[0], r[1])));
  const wrap = h('div', { class: 'cq' }), grid = h('div', { class: 'codegrid ' + L.cls, style: { '--cols': p.cols, '--rows': p.rows, 'grid-template-columns': 'repeat(' + p.cols + ',1fr)', 'grid-template-rows': 'repeat(' + p.rows + ',1fr)', width: 'min(100cqw,calc(100cqh*' + (p.cols / p.rows) + '))', height: 'auto' } });
  const cells = {}; for (let y = 0; y < p.rows; y++) for (let x = 0; x < p.cols; x++) { const c = h('div', { class: 'cell' }); cells[key(x, y)] = c; grid.append(c); }
  rocks.forEach(k => cells[k].append(art(L.rock)));
  const camel = h('div', { class: 'camel', style: { width: (100 / p.cols) + '%', height: (100 / p.rows) + '%' } }, art(L.mover));
  grid.append(camel); wrap.append(grid); ui.stage.innerHTML = ''; ui.stage.append(wrap);
  let pos, prog = [], selIdx = -1, running = false, target, startPos = p.start.slice(), mode = 'full', leg = 0, fails = 0, subFails = 0, helped = false, marker = null, ghost = null, guide = false;
  const same = (a, b) => a[0] === b[0] && a[1] === b[1], isGoal = () => same(target, p.goal), tname = () => isGoal() ? L.goalName : L.flagName;
  const setPos = (xy, instant) => { pos = xy.slice(); if (instant) camel.style.transition = 'none'; camel.style.left = (xy[0] * 100 / p.cols) + '%'; camel.style.top = (xy[1] * 100 / p.rows) + '%'; if (instant) { void camel.offsetWidth; camel.style.transition = ''; } };
  /* a goal with a front (look.aim: a football net, drawn with its mouth on the left) is turned to face the way the mover arrives on its last step, so she shoots straight into it */
  const aim = el => { if (!L.aim || p.path.length < 2) return; const a = p.path[p.path.length - 2], b = p.path[p.path.length - 1]; el.style.transform = 'rotate(' + (b[0] > a[0] ? 0 : b[1] > a[1] ? 90 : b[0] < a[0] ? 180 : 270) + 'deg)'; };
  const setTarget = xy => { target = xy.slice(); if (marker) marker.remove(); if (ghost) { ghost.remove(); ghost = null; } marker = art(isGoal() ? L.goal : L.flag); cells[key(xy[0], xy[1])].append(marker); if (isGoal()) aim(marker); else { ghost = art(L.goal); ghost.style.opacity = '.35'; aim(ghost); cells[key(p.goal[0], p.goal[1])].append(ghost); } };
  /* the squares from where the camel stands to the current target, and the same trip as runs of one direction */
  const legCells = () => { const i0 = p.path.findIndex(c => same(c, startPos)), i1 = p.path.findIndex(c => same(c, target)); return p.path.slice(i0, i1 + 1); };
  const legSegs = () => { const c = legCells(), out = []; for (let i = 1; i < c.length; i++) { const dx = c[i][0] - c[i - 1][0], dy = c[i][1] - c[i - 1][1], d = dx > 0 ? 'r' : dx < 0 ? 'l' : dy > 0 ? 'd' : 'u'; if (out.length && out[out.length - 1].d === d) out[out.length - 1].n++; else out.push({ d, n: 1 }); } return out; };
  const legPlan = () => p.repeat ? legSegs() : legSegs().reduce((a, s) => a.concat(Array.from({ length: s.n }, () => ({ d: s.d, n: 1 }))), []);
  /* how to do this bit, in words: count the squares, then which arrows to press */
  const legHelp = () => {
    const segs = legSegs(), sq = n => n + (n === 1 ? ' square ' : ' squares '), T = tname();
    if (segs.length === 1) { const s = segs[0], count = Array.from({ length: s.n }, (_, i) => i + 1).join(', ');
      return p.repeat && s.n > 1 ? { text: sq(s.n) + DIRWORD[s.d] + '. Tap ' + ARROW[s.d] + ', then ×' + s.n + ', then Go.', say: 'Count the squares to the ' + T + '. ' + count + '. That is ' + sq(s.n) + DIRWORD[s.d] + '. Tap the ' + DIRWORD[s.d] + ' arrow. Then tap times ' + s.n + ' to repeat it. Then tap Go.' }
        : { text: sq(s.n) + DIRWORD[s.d] + '. Tap ' + ARROW[s.d] + ' ' + timesWord(s.n) + ', then Go.', say: 'Count the squares to the ' + T + '. ' + count + '. That is ' + sq(s.n) + DIRWORD[s.d] + '. So tap the ' + DIRWORD[s.d] + ' arrow ' + timesWord(s.n) + '. Then tap Go.' }; }
    return { text: segs.map(s => s.n + ' ' + DIRWORD[s.d]).join(', then ') + '. Tap ' + legPlan().map(b => ARROW[b.d] + (b.n > 1 ? '×' + b.n : '')).join(' ') + ', then Go.',
      say: 'Count the squares to the ' + T + '. ' + segs.map(s => sq(s.n) + DIRWORD[s.d]).join(', then ') + '. So tap ' + segs.map(s => 'the ' + DIRWORD[s.d] + ' arrow ' + (p.repeat && s.n > 1 ? 'and times ' + s.n : timesWord(s.n))).join(', then ') + '. Then tap Go.' };
  };
  const numberPath = on => { $$('.hintp', grid).forEach(c => { c.classList.remove('hintp', 'hintt'); c.removeAttribute('data-n'); }); if (!on) return; legCells().forEach((c, i) => { if (!i) return; const el = cells[key(c[0], c[1])]; el.classList.add('hintp'); el.setAttribute('data-n', i); if (same(c, target)) el.classList.add('hintt'); }); };

  /* ----- the program strip: tap or drag arrows in, drag blocks to reorder, drag out to remove ----- */
  const strip = h('div', { class: 'prog' });
  const slotAt = t => { const s = t && t.closest ? t.closest('.pb') : null; return s && strip.contains(s) ? Number(s.getAttribute('data-i')) : (t && (t === strip || strip.contains(t)) ? prog.length : -1); };
  const full = () => { strip.classList.add('wobble'); setTimeout(() => strip.classList.remove('wobble'), 400); sfx.soft(); };
  /* the main instruction stays on screen; a short warning replaces it only until her next good move */
  let base = { text: p.text, say: p.say }, warned = false;
  const tell = (text, say) => { base = { text, say: say || text }; warned = false; return ui.prompt(text, say); };
  const warn = (text, say) => { warned = true; sfx.soft(); ui.prompt(text, say); };
  const unwarn = () => { if (!warned) return; warned = false; ui.bub.set(base.text, ' '); ui.bub._say = base.say; };
  const addBlock = (d, at) => { if (running) return; if (prog.length >= p.slots) return full(); const i = (at == null || at > prog.length) ? prog.length : at; prog.splice(i, 0, { d, n: 1 }); selIdx = i; sfx.tap(); unwarn(); draw(); };
  const setRep = (n, i) => { if (running) return; if (i == null) i = selIdx; if (i < 0 || !prog[i]) { warn('Tap an arrow first. Then the number.', 'Tap an arrow first. Then tap the number to repeat it.'); return; } prog[i].n = n; selIdx = i; sfx.pop(); unwarn(); draw(); };
  const removeBlock = () => { if (running || !prog.length) return; sfx.tap(); prog.splice(selIdx >= 0 && prog[selIdx] ? selIdx : prog.length - 1, 1); selIdx = prog.length - 1; draw(); };
  function draw(at) {
    strip.innerHTML = '';
    for (let i = 0; i < p.slots; i++) {
      const b = prog[i], e = h('div', { class: 'pb' + (b ? '' : ' empty') + (at === i ? ' run' : '') + (b && i === selIdx && at == null ? ' sel' : ''), 'data-i': i }, b ? ARROW[b.d] : '', b && (b.n > 1 || p.repeat) ? h('small', { class: b.n > 1 ? '' : 'one' }, '×' + b.n) : null);   /* in a repeat puzzle every block shows its number, ×1 included */
      strip.append(e);
      if (b) dragTap(e, () => { if (running) return; sfx.tap(); selIdx = i; draw(); },
        t => { if (running) return; const j = slotAt(t), blk = prog.splice(i, 1)[0]; if (j >= 0) { const k = Math.min(j, prog.length); prog.splice(k, 0, blk); selIdx = k; sfx.place(); } else { selIdx = prog.length - 1; sfx.pop(); } draw(); });
    }
    glowNext();
  }
  const arrowBtn = {}, repBtn = {};
  const arrows = h('div', { class: 'arrows' }, ['u', 'l', 'd', 'r'].map(d => { const b = h('button', { class: d, 'aria-label': 'Go ' + DIRWORD[d] }, ARROW[d]); arrowBtn[d] = b;
    dragTap(b, () => addBlock(d), t => { const j = slotAt(t); if (j < 0) return; if (prog[j] && prog.length >= p.slots) { prog[j] = { d, n: 1 }; selIdx = j; sfx.tap(); draw(); } else addBlock(d, j); }); return b; }));
  const reps = p.repeat ? h('div', { class: 'reps' }, [1, 2, 3, 4, 5].map(n => { const b = h('button', { 'aria-label': 'Repeat ' + n + ' times' }, '×' + n); repBtn[n] = b;
    dragTap(b, () => setRep(n), t => { const j = slotAt(t); if (j >= 0 && prog[j]) setRep(n, j); }); return b; })) : null;
  const runBtn = h('button', { class: 'btn go', onclick: () => run() }, 'Go!'), undo = h('button', { class: 'btn quiet', 'aria-label': 'Take an arrow off', html: BACKSPACE, onclick: removeBlock });
  ui.answer.innerHTML = ''; ui.answer.append(h('div', { class: 'progwrap' }, strip, h('div', { class: 'coderow' }, arrows, h('div', { class: 'col2' }, runBtn, undo)), reps));
  ui.key = e => { const d = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r' }[e.key]; if (d) { e.preventDefault(); addBlock(d); } else if (e.key === 'Enter') run(); else if (e.key === 'Backspace') removeBlock(); else if (p.repeat && /^[1-5]$/.test(e.key)) setRep(Number(e.key)); };
  function glowNext() { $$('.glow', ui.answer).forEach(b => b.classList.remove('glow')); }   // nothing lights up: the numbered squares and the words are the help
  let resolve; const finished = new Promise(r => { resolve = r; });
  const explainLeg = lead => { const hlp = legHelp(); numberPath(true); tell(hlp.text, (lead || '') + hlp.say); };
  async function run() {
    if (running || !prog.length) return; running = true; let bonk = false; $$('.glow', ui.answer).forEach(b => b.classList.remove('glow'));
    try {
      outer: for (let i = 0; i < prog.length; i++) { draw(i); for (let k = 0; k < prog[i].n; k++) {
        const nx = [pos[0] + DELTA[prog[i].d][0], pos[1] + DELTA[prog[i].d][1]];
        if (nx[0] < 0 || nx[1] < 0 || nx[0] >= p.cols || nx[1] >= p.rows || rocks.has(key(nx[0], nx[1]))) { bonk = true; sfx.bonk(); camel.classList.add('bonk'); await ui.wait(450); camel.classList.remove('bonk'); break outer; }
        setPos(nx); sfx.step(); await ui.wait(340);
      } }
      const there = same(pos, target);
      if (there && mode === 'full') { sfx.great(); kiwiMood(ui.root, 'cheer'); confetti(30); await ui.wait(900); resolve(); return; }
      if (there) {                                   // reached this bit's target: on to the next bit, or hand the whole trip back
        sfx.good(); leg++; startPos = pos.slice(); prog = []; selIdx = -1; subFails = 0; guide = false; numberPath(false);
        if (leg < p.legs.length) { setTarget(p.legs[leg]); running = false; draw(); numberPath(true); tell('Yes! Now count the squares to the ' + tname() + '.'); }
        else { mode = 'full'; leg = 0; fails = 0; startPos = p.start.slice(); ui.help(false); await ui.wait(700); setPos(startPos, true); setTarget(p.goal); running = false; draw(); tell('You did every part! Now the whole trip.', 'You did every part. Now do the whole trip to the ' + L.goalName + ' in one go.'); }
        return;
      }
      running = false;
      if (mode === 'full') {
        fails++; await ui.wait(500); setPos(startPos, true);
        if (fails < 2) { draw(); tell(bonk ? 'Bonk! Fix your arrows and try again.' : 'Not at the ' + L.goalName + ' yet. Fix your arrows.', bonk ? 'Bonk! Count the squares, fix your arrows, and try again.' : 'Not at the ' + L.goalName + ' yet. Count the squares and fix your arrows.'); }
        else { helped = true; mode = 'sub'; leg = 0; prog = []; selIdx = -1; subFails = 0; logReteach('coding', 1); ui.help(true); setTarget(p.legs[0]); draw(); explainLeg("That is a long trip. Let's do one bit at a time. "); }
      } else {
        subFails++; await ui.wait(400); setPos(startPos, true); prog = []; selIdx = -1; guide = subFails >= 2; draw();
        explainLeg(guide ? 'Slowly now. Touch each numbered square and count out loud. ' : (bonk ? 'Bonk! ' : 'Not quite. '));
      }
    } catch (e) { if (e !== ABORT) throw e; }
  }
  setPos(startPos, true); setTarget(p.goal); draw(); tell(p.text, p.say);
  const loadPlan = plan => { prog = plan.map(b => ({ d: b.d, n: b.n })); selIdx = prog.length - 1; const keep = p.slots; p.slots = Math.max(p.slots, prog.length); draw(); p.slots = keep; run(); };
  W.cur = { type: 'act', auto: () => loadPlan(p.solution.map(s => ({ d: s[0], n: s[1] || 1 }))), autoFail: () => loadPlan([{ d: 'l', n: 1 }]), autoLeg: () => loadPlan(legPlan()),
    state: () => ({ mode, running, guide, target: tname(), prog: prog.map(b => b.d + b.n).join(' ') }) };
  await finished; ui.check();
  if (ctx) { if (helped) ctx.helped++; else ctx.clean++; }
  ui.help(false);
};

/* ---------- tukutuku weaving: finish a woven panel by symmetry. A panel is a rule, panel.at(d, e, y, H), that gives the thread
   (0 none, 1 white, 2 gold) for each crossing: d = squares from the upright mirror line (0 touches it), e = squares from the level
   mirror line, y = row from the top. sym 1: one side is woven and she weaves its mirror image. sym 2: a quarter is woven and she
   reflects it across both lines. A wide screen gets the panel's wide size and a tall screen its tall size (a short wide one its low size),
   so squares stay big enough to tap.
   Help never lights a square she must weave: it flashes a finished stitch and numbers the squares out from the mirror line. ---------- */
function weaveGrid(p, wide) {
  const sz = wide === 'low' ? p.low : wide ? p.wide : p.tall, Wd = sz[0], Hd = sz[1], g = [];
  for (let y = 0; y < Hd; y++) { g.push([]); for (let x = 0; x < Wd; x++) {
    const d = x < Wd / 2 ? Wd / 2 - 1 - x : x - Wd / 2, e = y < Hd / 2 ? Math.ceil(Hd / 2) - 1 - y : y - Math.floor(Hd / 2);
    g[y].push(p.at(d, e, y, Hd, Wd) || 0); } }
  return { W: Wd, H: Hd, g, given: (x, y) => x < Wd / 2 && (p.sym === 1 || y < Hd / 2) };
}
const STITCH = t => '<svg class="st t' + t + '" viewBox="0 0 20 20" preserveAspectRatio="none" aria-hidden="true"><path class="so" d="M4.500 -1.500 15.500 21.500M15.500 -1.500 4.500 21.500"/><path class="si" d="M4.500 -1.500 15.500 21.500"/><path class="si" d="M15.500 -1.500 4.500 21.500"/></svg>';
function weavePanel(p, wide, onTap) {
  const G = weaveGrid(p, wide), el = {};
  const panel = h('div', { class: 'tuku ' + (p.look || 'black'), style: { '--cols': G.W, '--rows': G.H, width: 'min(100cqw - 1.4rem, (100cqh - 1.4rem) * ' + (G.W / G.H) + ')' } });
  for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) {
    const t = G.g[y][x], giv = G.given(x, y) || !onTap;
    const c = giv ? h('div', { class: 'tcell' + (t ? ' on' : ''), html: t ? STITCH(t) : '' }) : h('button', { class: 'tcell tapme', 'aria-label': 'A square to stitch', onclick: () => onTap(x, y) });
    el[x + ',' + y] = c; panel.append(c);
  }
  if (onTap) { panel.append(h('i', { class: 'tline v' })); if (p.sym === 2) panel.append(h('i', { class: 'tline h' })); }
  return { panel, G, el };
}
function weaveOne(ui, p, more) {
  return new Promise(res => {
    /* a short wide screen (a phone on its side) gets the panel's low size, if it has one, so the squares stay big enough to tap */
    const sw = ui.stage.clientWidth, sh = ui.stage.clientHeight, fit = sz => Math.min((sw - 40) / sz[0], (sh - 40) / sz[1]);
    const wide = sw < sh * 1.05 ? false : (p.low && fit(p.wide) < 36) ? 'low' : true;
    const threads = []; let left = 0, misses = 0, guide = false, over = false, cur = 1;
    const key = (x, y) => x + ',' + y;
    const P = weavePanel(p, wide, (x, y) => tap(x, y)), G = P.G, el = P.el;
    for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) { const t = G.g[y][x]; if (t && threads.indexOf(t) < 0) threads.push(t); if (t && !G.given(x, y)) left++; }
    threads.sort(); cur = threads[0];
    const done = (x, y) => G.given(x, y) ? !!G.g[y][x] : el[key(x, y)].classList.contains('on');
    /* the finished stitch she should copy: across the upright line for the top (or only) half, across the level line below it */
    const twinOf = (x, y) => (p.sym === 1 || y < G.H / 2) ? [G.W - 1 - x, y, 'v'] : [x, G.H - 1 - y, 'h'];
    const clearGuide = () => { $$('.pulse', P.panel).forEach(x => x.classList.remove('pulse')); $$('.mnum', P.panel).forEach(x => x.remove()); };
    const showGuide = () => { clearGuide(); if (!guide || over) return;
      let pickd = null;
      for (let pass = 0; pass < 2 && !pickd; pass++) for (let y = 0; y < G.H && !pickd; y++) for (let x = 0; x < G.W && !pickd; x++) {
        if (G.given(x, y) || !G.g[y][x] || done(x, y)) continue; const tw = twinOf(x, y); if (pass || done(tw[0], tw[1])) pickd = [x, y, tw]; }
      if (!pickd) return; const tw = pickd[2]; el[key(tw[0], tw[1])].classList.add('pulse');
      if (tw[2] === 'v') for (let x = 0; x < G.W; x++) el[key(x, pickd[1])].append(h('span', { class: 'mnum' }, x < G.W / 2 ? G.W / 2 - x : x - G.W / 2 + 1));
      else for (let y = 0; y < G.H; y++) el[key(pickd[0], y)].append(h('span', { class: 'mnum' }, y < G.H / 2 ? G.H / 2 - y : y - G.H / 2 + 1)); };
    const say = (t, s) => { const pr = ui.prompt(t, s); if (pr && pr.catch) pr.catch(() => {}); return pr; };
    const tap = (x, y) => {
      const c = el[key(x, y)], t = G.g[y][x]; if (over || c.classList.contains('on')) return;
      if (t && t === cur) {
        c.classList.add('on'); c.insertAdjacentHTML('beforeend', STITCH(t)); sfx.place(); left--; showGuide();
        if (!left) { over = true; clearGuide(); sfx.win(); confetti(40); kiwiMood(ui.root, 'cheer'); P.panel.classList.add('done'); if (picker) picker.remove();
          const pr = say(p.done.text, p.done.say);
          Promise.race([pr, wait(4200)]).then(() => { if (!ui.alive) return;
            const fin = v => { sfx.pop(); ui.key = null; row.remove(); res(v); };
            const b1 = h('button', { class: 'btn go big', onclick: () => fin(false) }, 'Next'), b2 = more ? h('button', { class: 'btn big', onclick: () => fin(true) }, 'Weave another') : null;
            const row = h('div', { class: 'row wrow' }, b1, b2); box.append(row); ui.key = e => { if (e.key === 'Enter') b1.click(); };
            W.cur = { type: 'btn', auto: () => b1.click(), more: b2 ? () => b2.click() : null }; }); }
        return; }
      sfx.bonk(); c.classList.add('wobble'); setTimeout(() => c.classList.remove('wobble'), 400);
      if (t) { say('Right place! Now check the thread colour.', 'That is the right place. But look at its twin across the mirror line. Which colour thread is it? Pick that thread, then tap again.'); return; }
      misses++; guide = misses >= 2;
      if (guide) say('Find the flashing stitch. Tap the same number across the line.', 'Look at the flashing stitch on the finished side. The numbers count the squares out from the mirror line. Its twin has the same number, on the other side of the line. Tap it.');
      else say('Not there. Count squares from the mirror line.', 'Not there. Pick a stitch on the finished side. Count how many squares it is from the mirror line. Its twin is the same number of squares from the line, on the other side.');
      showGuide();
    };
    const NAMES = { 1: 'White', 2: 'Gold' };
    const picker = threads.length > 1 ? h('div', { class: 'tpick' }, threads.map(t => h('button', { class: 'tbtn' + (t === cur ? ' sel' : ''), 'data-t': t, 'aria-label': NAMES[t] + ' thread', onclick: e => { sfx.tap(); cur = t; $$('.tbtn', picker).forEach(b => b.classList.toggle('sel', b === e.currentTarget)); } }, h('span', { class: 'tsw', html: STITCH(t) }), NAMES[t]))) : null;
    const box = h('div', { class: 'col' }, h('div', { class: 'weave' + (wide ? ' wide' : ' tall') }, h('div', { class: 'cq' }, P.panel), picker));
    ui.stage.innerHTML = ''; ui.stage.append(box);
    const setThread = t => { if (picker && cur !== t) { const b = $('.tbtn[data-t="' + t + '"]', picker); if (b) b.click(); } };
    W.cur = { type: 'act', panel: p.id, wide,
      auto: () => { for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) { const t = G.g[y][x]; if (t && !G.given(x, y) && !done(x, y)) { setThread(t); tap(x, y); } } setTimeout(() => { const b = $('.wrow .btn', box); if (b) b.click(); }, 60); },
      miss: () => { for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) if (!G.given(x, y) && !G.g[y][x]) return tap(x, y); } };
  });
}
ACTS.weave = async (ui, d) => {
  const N = d.panels.length; let first = true;
  for (;;) {
    /* her next panel; once every panel is woven, the three hardest come round in turn */
    const woven = clamp(S.weave || 0, 0, N), idx = woven < N ? woven : N - 1 - ((S.weaveN = (S.weaveN || 0) + 1) % Math.min(3, N)), p = d.panels[idx];
    ui.wide(true); ui.clear();
    const two = p.sym === 2, col = p.threads > 1;
    ui.prompt(two ? 'Weave the rest. Match across both mirror lines.' : 'Weave the other side. Make both sides match.',
      (first ? 'This is a tukutuku panel. Weavers cross threads over wooden slats to make patterns, and every pattern has a meaning. ' : 'A new panel. ') +
      (two ? 'One quarter is woven. This panel has two mirror lines. Weave the rest, so it matches across both lines.' : 'One side is woven. Weave the other side so that both sides match, like a mirror.') +
      (col ? ' Pick the white thread or the gold thread, then tap a square to make a stitch.' : ' Tap a square to make a stitch.'));
    const again = await weaveOne(ui, p, woven + 1 < N); ui.check();
    if (idx === woven) { S.weave = woven + 1; saveState(); }
    if (!again) break;
    addStars(2); first = false;
  }
};
/* a finished panel, for the grown-ups page and the test sheets */
W.weavePreview = (host, p, wide) => { const P = weavePanel(p, wide, null); host.innerHTML = ''; host.append(h('div', { class: 'cq' }, P.panel)); };

/* ---------- pixel pictures: finish a pixel-art picture by mirror symmetry, then watch it come alive.
   A picture is rows of letters, one letter per square ('.' is empty), with a palette that gives each letter a colour.
   pic: { id, pal, names, big { rows, frames }, small { rows, frames }, move, done {text, say} }. rows must be a mirror image left to right.
   big is for a laptop or tablet; small is for a phone, so the squares stay big enough to tap. frames are whole pictures of the same size, shown in turn once she finishes.
   She picks a colour, then taps a square or drags along a run of them. A wrong square never sticks. Help never lights the square she must find. ---------- */
function pixelSize(p, sw, sh) { const fit = z => Math.min((sw - 120) / z.rows[0].length, (sh - 44) / z.rows.length); return (!p.small || fit(p.big) >= 30) ? p.big : p.small; }
function pixelOne(ui, p, more) {
  return new Promise(res => {
    const sw = ui.stage.clientWidth, sh = ui.stage.clientHeight, wide = sw >= sh * 1.05, Z = pixelSize(p, sw, sh), rows = Z.rows, Wd = rows[0].length, Hd = rows.length;
    const key = (x, y) => x + ',' + y, at = (x, y) => rows[y][x] === '.' ? '' : rows[y][x], given = x => x < Wd / 2;
    const el = {}, cols = []; let left = 0, misses = 0, guide = false, over = false, timer = null, drag = false, last = null;
    const panel = h('div', { class: 'pix', style: { '--cols': Wd, '--rows': Hd, width: 'min(100cqw - 1rem, (100cqh - 1rem) * ' + (Wd / Hd) + ')' } });
    for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) {
      const t = at(x, y), c = given(x) ? h('div', { class: 'pcell' + (t ? ' on' : ''), style: t ? { background: p.pal[t] } : null }) : h('div', { class: 'pcell tapme', role: 'button', 'aria-label': 'A square to colour', 'data-x': x, 'data-y': y });
      if (t && cols.indexOf(t) < 0) cols.push(t); if (t && !given(x)) left++;
      el[key(x, y)] = c; panel.append(c);
    }
    panel.append(h('i', { class: 'pline' }));
    let cur = cols[0];
    const clearGuide = () => { $$('.pulse', panel).forEach(x => x.classList.remove('pulse')); $$('.mnum', panel).forEach(x => x.remove()); };
    /* stuck: flash one finished square and number its row out from the mirror line, both sides. She finds the twin. */
    const showGuide = () => { clearGuide(); if (!guide || over) return;
      for (let y = 0; y < Hd; y++) for (let x = Wd / 2; x < Wd; x++) if (at(x, y) && !el[key(x, y)].classList.contains('on')) {
        el[key(Wd - 1 - x, y)].classList.add('pulse');
        for (let k = 0; k < Wd; k++) el[key(k, y)].append(h('span', { class: 'mnum' }, k < Wd / 2 ? Wd / 2 - k : k - Wd / 2 + 1)); return; } };
    const say = (t, s) => ui.prompt(t, s);
    const finish = () => { over = true; clearGuide(); sfx.win(); confetti(40); kiwiMood(ui.root, 'cheer'); if (picker) picker.remove();
      /* it comes alive: the grid lines go, and its frames play in turn */
      panel.classList.add('alive', 'move-' + (p.move || 'bob'));
      const frames = Z.frames && Z.frames.length ? Z.frames : [rows]; let f = 0;
      const paint = fr => { for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) { const ch = fr[y][x], c = el[key(x, y)]; c.style.background = ch === '.' ? '' : p.pal[ch]; c.classList.toggle('on', ch !== '.'); } };
      timer = setInterval(() => { if (!ui.alive || !panel.isConnected) { clearInterval(timer); return; } f = (f + 1) % frames.length; paint(frames[f]); }, p.beat || 380);
      const pr = say(p.done.text, p.done.say);
      Promise.race([pr, wait(4200)]).then(() => { if (!ui.alive) return;
        const fin = v => { sfx.pop(); ui.key = null; clearInterval(timer); res(v); };
        const b1 = h('button', { class: 'btn go big', onclick: () => fin(false) }, 'Next'), b2 = more ? h('button', { class: 'btn big', onclick: () => fin(true) }, 'Make another') : null;
        box.append(h('div', { class: 'row wrow' }, b1, b2)); ui.key = e => { if (e.key === 'Enter') b1.click(); };
        W.cur = { type: 'btn', auto: () => b1.click(), more: b2 ? () => b2.click() : null }; }); };
    /* returns true if the square took the colour */
    const tap = (x, y) => {
      const c = el[key(x, y)], t = at(x, y); if (over || c.classList.contains('on')) return false;
      if (t && t === cur) { c.classList.add('on'); c.style.background = p.pal[t]; sfx.place(); left--; showGuide(); if (!left) finish(); return true; }
      sfx.bonk(); c.classList.add('wobble'); setTimeout(() => c.classList.remove('wobble'), 400);
      if (t) { say('Right square! Now check the colour.', 'That is the right square. But look at its twin across the mirror line. What colour is it? Pick that colour, then tap again.'); return false; }
      misses++; guide = misses >= 2;
      if (guide) say('Find the flashing square. Tap the same number across the line.', 'Look at the flashing square on the finished side. The numbers count the squares out from the mirror line. Its twin has the same number, on the other side of the line. Tap it.');
      else say('Not there. Count squares from the mirror line.', 'Not there. Pick a coloured square on the finished side. Count how many squares it is from the mirror line. Its twin is the same number of squares from the line, on the other side.');
      showGuide(); return false;
    };
    /* tap one square, or drag along a run of them. The drag stops at the first square that is wrong. */
    const cellAt = e => { const t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest ? t.closest('.pcell.tapme') : null; return c && panel.contains(c) ? c : null; };
    const hit = c => { last = c; return tap(+c.dataset.x, +c.dataset.y); };
    panel.addEventListener('pointerdown', e => { const c = cellAt(e); if (!c) return; e.preventDefault(); drag = hit(c); });
    panel.addEventListener('pointermove', e => { if (!drag) return; const c = cellAt(e); if (!c || c === last || c.classList.contains('on')) return; drag = hit(c); });
    const up = () => { drag = false; last = null; }; panel.addEventListener('pointerup', up); panel.addEventListener('pointercancel', up); panel.addEventListener('pointerleave', up);
    const picker = cols.length > 1 ? h('div', { class: 'ppick' }, cols.map(t => h('button', { class: 'pbtn' + (t === cur ? ' sel' : ''), 'data-t': t, 'aria-label': (p.names && p.names[t]) || 'Colour', style: { '--c': p.pal[t] }, onclick: e => { sfx.tap(); cur = t; $$('.pbtn', picker).forEach(b => b.classList.toggle('sel', b === e.currentTarget)); } }))) : null;
    const box = h('div', { class: 'col' }, h('div', { class: 'weave' + (wide ? ' wide' : ' tall') }, h('div', { class: 'cq' }, panel), picker));
    ui.stage.innerHTML = ''; ui.stage.append(box);
    const setCol = t => { if (picker && cur !== t) { const b = $('.pbtn[data-t="' + t + '"]', picker); if (b) b.click(); } };
    W.cur = { type: 'act', pic: p.id, size: Z === p.big ? 'big' : 'small',
      auto: () => { for (let y = 0; y < Hd; y++) for (let x = Wd / 2; x < Wd; x++) { const t = at(x, y); if (t && !el[key(x, y)].classList.contains('on')) { setCol(t); tap(x, y); } } setTimeout(() => { const b = $('.wrow .btn', box); if (b) b.click(); }, 60); },
      miss: () => { for (let y = 0; y < Hd; y++) for (let x = Wd / 2; x < Wd; x++) if (!at(x, y)) return tap(x, y); } };
  });
}
ACTS.pixel = async (ui, d) => {
  const N = d.pics.length; let first = true;
  for (;;) {
    /* her next picture; once every picture is made, they come round again in turn */
    const made = clamp(S.pixel || 0, 0, N), idx = made < N ? made : (S.pixelN = (S.pixelN || 0) + 1) % N, p = d.pics[idx];
    ui.wide(true); ui.clear();
    ui.prompt(p.text || 'Finish the pixel picture. Make both sides match.',
      (first ? (d.say || 'Here is half of a picture made of little squares, called pixels.') + ' ' : 'A new picture. ') + 'Finish it, so that both sides match like a mirror. Pick a colour. Then tap a square, or drag along a row of squares.');
    const again = await pixelOne(ui, p, made + 1 < N); ui.check();
    if (idx === made) { S.pixel = made + 1; saveState(); }
    if (!again) break;
    addStars(2); first = false;
  }
};
/* a finished picture (frame k), for the test sheets */
W.pixelPreview = (host, p, size, k) => { const Z = p[size], fr = k ? Z.frames[k] : Z.rows, Wd = fr[0].length, panel = h('div', { class: 'pix alive', style: { '--cols': Wd, '--rows': fr.length, width: 'min(100cqw, 100cqh * ' + (Wd / fr.length) + ')' } });
  fr.forEach(r => r.split('').forEach(ch => panel.append(h('div', { class: 'pcell' + (ch === '.' ? '' : ' on'), style: ch === '.' ? null : { background: p.pal[ch] } })))); host.innerHTML = ''; host.append(h('div', { class: 'cq' }, panel)); };
W.pixelSize = pixelSize;
/* ---------- origami: fold a paper model, one fold at a time. Every fold is a mirror-line puzzle:
   the dotted line is the fold, the star is where one corner will land, and she picks the corner that lands there.
   d: size (the drawing is size x size), start [{pts, fill}], face (svg drawn on the finished model), done {text, say},
   folds [{ line [[x,y],[x,y]], corner [x,y], decoys [[x,y]…], flap [[x,y]…] (the part that moves, as it lies before the fold), fill (its colour before), back (its colour after),
            under [{pts, fill}] (what stays still), after [{pts, fill}] (the picture once folded), text, say, done {text, say}, ask {text, say, options, answer, nudge} }] ---------- */
const foldMirror = (p, L) => { const ax = L[0][0], ay = L[0][1], dx = L[1][0] - ax, dy = L[1][1] - ay, t = ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy); return [2 * (ax + t * dx) - p[0], 2 * (ay + t * dy) - p[1]]; };
ACTS.fold = async (ui, d) => {
  ui.wide(true);
  const SZ = d.size || 200, str = P => P.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const poly = (P, fill) => '<polygon points="' + str(P) + '" fill="' + fill + '" stroke="#1B2A4E" stroke-width="2.4" stroke-linejoin="round"/>';
  const draw = list => list.map(p => poly(p.pts, p.fill)).join('');
  const svg = inner => '<svg viewBox="0 0 ' + SZ + ' ' + SZ + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  const star = p => '<path transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')" d="M0-12 3.500-3.800 12-3.800 5.200 1.700 7.600 10.400 0 5.400-7.600 10.400-5.200 1.700-12-3.800-3.500-3.800z" fill="#FFC83D" stroke="#E99A16" stroke-width="1.800" stroke-linejoin="round"/>';
  const dash = L => '<line x1="' + L[0][0] + '" y1="' + L[0][1] + '" x2="' + L[1][0] + '" y2="' + L[1][1] + '" stroke="#6453C9" stroke-width="3.200" stroke-dasharray="7 6" stroke-linecap="round"/>';
  const paper = h('div', { class: 'foldpaper' }), box = h('div', { class: 'col' }, h('div', { class: 'cq' }, paper));
  ui.stage.innerHTML = ''; ui.stage.append(box);
  for (let i = 0; i < d.folds.length; i++) {
    const F = d.folds[i], land = foldMirror(F.corner, F.line), before = i ? d.folds[i - 1].after : d.start;
    /* 1. which corner lands on the star? */
    await new Promise(res => {
      let misses = 0, right = null; const wrong = [];
      const show = guide => { const old = $('svg', paper); if (old) old.remove();
        paper.insertAdjacentHTML('afterbegin', svg(draw(before) + dash(F.line) + (guide ? '<line x1="' + land[0] + '" y1="' + land[1] + '" x2="' + F.corner[0] + '" y2="' + F.corner[1] + '" stroke="#E99A16" stroke-width="2.400" stroke-dasharray="2 5" stroke-linecap="round"/>' : '') + star(land))); };
      paper.innerHTML = ''; show(false);
      shuffle([F.corner].concat(F.decoys)).forEach(c => {
        const b = h('button', { class: 'spot', 'aria-label': 'A corner of the paper', style: { left: (c[0] / SZ * 100) + '%', top: (c[1] / SZ * 100) + '%' } });
        b.addEventListener('click', () => {
          if (c === F.corner) { sfx.place(); W.cur = null; res(); return; }
          sfx.soft(); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 500); misses++;
          if (misses >= 2) show(true);
          ui.prompt(misses >= 2 ? 'Follow the dots from the star, straight across the line.' : 'Not that one. A fold works like a mirror.',
            misses >= 2 ? 'Follow the dots from the star, straight across the fold line. Which corner do they reach?' : 'Not that one. A fold works like a mirror. The corner and the star are the same distance from the dotted line, on opposite sides.');
        });
        if (c === F.corner) right = b; else wrong.push(b); paper.append(b);
      });
      ui.prompt(F.text, F.say);
      W.cur = { type: 'act', auto: () => right.click(), miss: () => wrong[0].click() };
    });
    ui.check(); $$('.spot', paper).forEach(b => b.remove());
    /* 2. the fold: seen from above, every point of the flap slides straight across the fold line */
    const foot = p => { const m = foldMirror(p, F.line); return [(p[0] + m[0]) / 2, (p[1] + m[1]) / 2]; };
    const frame = c => { const P = F.flap.map(p => { const f = foot(p); return [f[0] + c * (p[0] - f[0]), f[1] + c * (p[1] - f[1])]; }); paper.innerHTML = svg(draw(F.under) + poly(P, c >= 0 ? F.fill : F.back) + dash(F.line)); };
    if (!W.fast) { sfx.step(); const t0 = performance.now(), T = 700;
      await new Promise(res => { const tick = now => { if (!ui.alive) return res(); const t = Math.min(1, (now - t0) / T); frame(Math.cos(Math.PI * t)); if (t < 1) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); }); ui.check(); }
    paper.innerHTML = svg(draw(F.after)); sfx.good(); kiwiMood(ui.root, 'cheer');
    if (F.done) { await Promise.race([ui.prompt(F.done.text, F.done.say), wait(2600)]); await ui.wait(500); }
    /* 3. sometimes a quick question about the shape she has just made */
    if (F.ask) await new Promise(res => {
      const row = h('div', { class: 'opts foldopts' }); let rightBtn = null;
      F.ask.options.forEach((o, k) => { const b = h('button', { class: 'opt' }, o.svg ? h('span', { html: o.svg }) : (o.icon ? art(o.icon) : null), o.label ? h('span', null, o.label) : null);
        b.addEventListener('click', () => { if (k === F.ask.answer) { sfx.good(); W.cur = null; row.remove(); res(); } else { sfx.soft(); b.classList.add('gone'); b.disabled = true; ui.prompt(F.ask.nudge || 'Not that one. Look again.'); } });
        if (k === F.ask.answer) rightBtn = b; row.append(b); });
      box.append(row); ui.prompt(F.ask.text, F.ask.say);
      W.cur = { type: 'act', auto: () => rightBtn.click() };
    });
    ui.check();
  }
  paper.innerHTML = svg(draw(d.folds[d.folds.length - 1].after) + '<g class="foldface">' + (d.face || '') + '</g>');
  sfx.win(); confetti(40); kiwiMood(ui.root, 'cheer');
  await Promise.race([ui.prompt(d.done.text, d.done.say), wait(4500)]); ui.check();
  await ui.next('Next', box);
};

/* ---------- a band to build: she copies each instrument's beat by ear, one instrument at a time, and the band plays it back.
   d.parts [{ id, name, sayName (how the narrator says it), art, sound ('low' | 'shake' | 'bell' | 'tick'), col, hits ('x...x...': eight boxes, one bar), intro {text, say}, done {text, say} }].
   Her progress is S.beat (parts learnt). Each round adds the next part over the ones she has; once she has them all, the round is free play: every box is hers.
   Help never shows a box. Listening is unhurried from the start, and the numbers 1 to 8 light as it plays, so she can follow which numbers it plays on.
   It is broken down (Tony, 9 October: "the player really struggled with this and gave up. We need to break it down a bit, or slow it down"):
   a first miss splits the bar in half, and she does boxes 1 to 4, slowly, then 5 to 8; two misses in a half and it goes one box at a time:
   the bar plays up to that box, which is ringed, and she says whether there was a hit on it. The full bar then plays back as her reward. ---------- */
const BEAT_STEPS = 8;
/* one hit of a drum, synthesised. Which hits are stronger (or the higher bell) depends only on where in the bar they fall, never on the pattern, so her own boxes sound exactly as the real part would */
const beatStrong = (sound, i) => sound === 'low' ? i === 4 : sound === 'shake' ? i % 4 === 0 : sound === 'bell' ? i % 2 === 0 : false;
function drum(sound, at, strong) {
  if (!S.sound || W.fast) return []; const a = ac(); if (!a) return []; const t = a.currentTime + (at || 0), out = [];
  const env = (g, d) => { const n = a.createGain(); n.gain.setValueAtTime(0.0001, t); n.gain.exponentialRampToValueAtTime(g, t + .006); n.gain.exponentialRampToValueAtTime(0.0001, t + d); n.connect(a.destination); return n; };
  const osc = (type, f0, f1, g, d) => { const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + d); o.connect(env(g, d)); o.start(t); o.stop(t + d + .03); out.push(o); };
  const noise = (g, d, hp) => { const len = Math.ceil(a.sampleRate * d), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; s.buffer = buf; s.connect(f); f.connect(env(g, d)); s.start(t); s.stop(t + d + .02); out.push(s); };
  if (sound === 'low') { osc('sine', strong ? 150 : 200, strong ? 60 : 95, strong ? .6 : .42, .34); osc('triangle', strong ? 300 : 400, 130, .14, .12); }
  else if (sound === 'shake') noise(strong ? .17 : .09, .07, 5200);
  else if (sound === 'bell') { const f = strong ? 1320 : 990; osc('triangle', f, 0, .17, .24); osc('sine', f * 1.5, 0, .07, .16); }
  else { noise(.2, .045, 1800); osc('triangle', 920, 700, .15, .05); }
  return out;
}
function beatOne(ui, d, idx, cid) {
  return new Promise(res => {
    const parts = d.parts, free = idx < 0, shown = free ? parts : parts.slice(0, idx + 1), mine = free ? null : parts[idx], hitsOf = p => p.hits.split('').map(ch => ch === '.' ? 0 : 1);
    const rows = shown.map(p => ({ p, target: hitsOf(p), cur: (free || p !== mine) ? hitsOf(p) : Array(BEAT_STEPS).fill(0), open: free || p === mine, cells: [], ins: null }));
    const my = free ? null : rows[rows.length - 1]; let misses = 0, over = false, run = 0, nodes = [], half = -1, halfMiss = 0, boxK = -1;
    const rng = () => half < 0 ? [0, BEAT_STEPS] : half === 0 ? [0, BEAT_STEPS / 2] : [BEAT_STEPS / 2, BEAT_STEPS];
    const nums = Array.from({ length: BEAT_STEPS }, (_, i) => h('b', { class: i % 4 === 0 ? 'down' : '' }, i + 1));
    const grid = h('div', { class: 'bgrid' }, h('div', { class: 'brow bhead' }, h('span'), nums));
    rows.forEach(r => { r.ins = h('button', { class: 'bins', 'aria-label': 'Hear the ' + r.p.name, onclick: () => { nodes.push(...drum(r.p.sound, 0, true)); bump(r.ins); } }, art(r.p.art));
      const row = h('div', { class: 'brow' + (r.open ? ' open' : ''), style: { '--c': r.p.col } }, r.ins);
      for (let i = 0; i < BEAT_STEPS; i++) { const c = h('button', { class: 'bcell' + (r.open ? ' tapme' : ' lock') + (r.cur[i] ? ' on' : ''), disabled: !r.open, 'aria-label': r.p.name + ', box ' + (i + 1), onclick: () => toggle(r, i) }); r.cells.push(c); row.append(c); }
      r.el = row; grid.append(row); });
    const bump = el => { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); };
    const toggle = (r, i) => { if (over || !r.open || r.cells[i].disabled) return; r.cur[i] = r.cur[i] ? 0 : 1; r.cells[i].classList.toggle('on', !!r.cur[i]); if (r.cur[i]) { nodes.push(...drum(r.p.sound, 0, beatStrong(r.p.sound, i))); bump(r.ins); } else sfx.tap(); };
    const stop = () => { run++; nodes.forEach(n => { try { n.stop(); } catch (e) {} }); nodes = []; nums.forEach(n => n.classList.remove('now')); band.classList.remove('playing'); };
    /* play some rows (their target, or what she has put in) for a number of bars. o: slow, count (light the numbers), loops, dance */
    const play = (list, o) => { stop(); if (W.fast || !ui.alive) return Promise.resolve(); const me = run, step = o.slow ? .46 : o.mid ? .34 : .25, loops = o.loops || 2, from = o.from || 0, span = (o.to || BEAT_STEPS) - from, total = span * loops;
      if (o.dance) band.classList.add('playing');
      return new Promise(done => { for (let k = 0; k < total; k++) { const i = from + k % span;
        list.forEach(x => { if (x.hits[i]) nodes.push(...drum(x.r.p.sound, .06 + k * step, beatStrong(x.r.p.sound, i))); });
        setTimeout(() => { if (run !== me || !ui.alive) return; if (o.count) nums.forEach((n, j) => n.classList.toggle('now', j === i)); list.forEach(x => { if (x.hits[i]) bump(x.r.ins); }); }, (.06 + k * step) * 1000); }
        setTimeout(() => { if (run !== me) return done(); nums.forEach(n => n.classList.remove('now')); band.classList.remove('playing'); done(); }, (.06 + total * step) * 1000 + 120); }); };
    const hearIt = () => { const [a, b] = rng(); return play([{ r: my, hits: my.target }], boxK >= 0 ? { slow: true, count: true, from: a, to: boxK + 1, loops: 2 } : { slow: half >= 0, mid: true, count: true, from: a, to: b, loops: half >= 0 ? 3 : 2 }); }   /* with the sound off she can still do it: the drum jumps on each hit and the numbers light */, hearMine = () => play([{ r: my, hits: my.cur }], {}), hearAll = o => play(rows.map(r => ({ r, hits: r.cur })), Object.assign({ dance: true }, o));
    const finish = () => { over = true; stop(); ui.help(false); sfx.great(); confetti(40); kiwiMood(ui.root, 'cheer'); btns.innerHTML = ''; btns.style.display = ''; boxK = -1; boxBtns.remove(); my.cells.forEach(c => c.classList.remove('bfocus', 'bdim')); nums.forEach(n => n.classList.remove('bfocus', 'bdim')); rows.forEach(r => { r.open = false; r.el.classList.remove('open'); r.cells.forEach(c => { c.classList.remove('tapme'); c.classList.add('lock'); c.disabled = true; }); });
      const pr = ui.prompt(mine.done.text, mine.done.say);
      Promise.race([pr, wait(W.fast ? 5 : 1400)]).then(() => hearAll({ loops: 3 })).then(() => { if (!ui.alive) return; const more = idx + 1 < parts.length;
        const fin = v => { sfx.pop(); stop(); ui.key = null; res(v); };
        const b1 = h('button', { class: 'btn go big', onclick: () => fin(false) }, 'Next'), b2 = h('button', { class: 'btn big', onclick: () => fin(true) }, more ? 'Add a drum' : 'Make my own'), b3 = h('button', { class: 'btn quiet big', 'aria-label': 'Play the band again', onclick: () => hearAll({ loops: 3 }) }, ic('speaker-high-volume'));
        btns.append(b3, b1, b2); ui.key = e => { if (e.key === 'Enter') b1.click(); };
        W.cur = { type: 'btn', auto: () => b1.click(), more: () => b2.click() }; }); };
    /* a half of the bar: the other half's boxes are dimmed and cannot be changed */
    const setHalf = hh => { half = hh; halfMiss = 0; const [a, b] = rng(); my.cells.forEach((c, i) => { const inside = i >= a && i < b; c.disabled = !inside; c.classList.toggle('bdim', !inside); c.classList.toggle('tapme', inside); }); nums.forEach((n, i) => n.classList.toggle('bdim', i < a || i >= b)); };
    const nameOf = () => mine.sayName || mine.name;
    const halfDone = () => { if (my.cur.every((v, i) => v === my.target[i])) return finish();
      sfx.good(); setHalf(1); ui.prompt('Boxes 1 to 4 are right! Now 5 to 8.', 'Boxes one to four are right! Now the second half: five, six, seven and eight. Listen, and watch the numbers.').then(() => { if (!over && ui.alive) hearIt(); }); };
    /* one box at a time: the bar plays up to box k, which is ringed; she says whether the drum played on it */
    const boxBtns = h('div', { class: 'row wrow bbtns' });
    const askBox = () => { if (over || !ui.alive) return; const [, b] = rng(); if (boxK >= b) { boxK = -1; my.cells.forEach(c => c.classList.remove('bfocus')); nums.forEach(n => n.classList.remove('bfocus')); boxBtns.remove(); btns.style.display = ''; return halfDone(); }
      my.cells.forEach((c, i) => c.classList.toggle('bfocus', i === boxK)); nums.forEach((n, i) => n.classList.toggle('bfocus', i === boxK));
      ui.prompt('Box ' + (boxK + 1) + '. Does the ' + mine.name + ' play on it?', 'Listen up to box ' + (boxK + 1) + ', the one in the ring. Does the ' + nameOf() + ' play on box ' + (boxK + 1) + '?').then(() => { if (!over && ui.alive && boxK >= 0) hearIt(); }); };
    const sayBox = yes => { if (over || boxK < 0) return; stop();
      if (!!my.target[boxK] === yes) { sfx.pop(); if (yes && !my.cur[boxK]) toggle(my, boxK); if (!yes && my.cur[boxK]) toggle(my, boxK); boxK++; askBox(); }
      else { sfx.soft(); ui.prompt('Listen again. Watch box ' + (boxK + 1) + ' in the ring.', 'Not quite. Listen again, slowly, and watch box ' + (boxK + 1) + ' in the ring. Do you hear the ' + nameOf() + ' on it?').then(() => { if (!over && ui.alive && boxK >= 0) hearIt(); }); } };
    const startBoxes = () => { const [a, b] = rng(); for (let i = a; i < b; i++) if (my.cur[i]) toggle(my, i); boxK = a; btns.style.display = 'none'; btns.after(boxBtns);
      boxBtns.innerHTML = ''; boxBtns.append(h('button', { class: 'btn big', 'data-b': 'again', onclick: () => { sfx.tap(); hearIt(); } }, ic('ear'), 'Again'), h('button', { class: 'btn quiet big', 'data-b': 'none', onclick: () => sayBox(false) }, 'No hit'), h('button', { class: 'btn go big', 'data-b': 'hit', onclick: () => sayBox(true) }, ic('drum'), 'A hit'));
      ui.prompt('One box at a time. Listen to each one.', 'Let us go one box at a time. The drum plays up to the box in the ring. Did it play on that box, or not?').then(() => askBox()); };
    const check = () => { if (over) return; stop();
      if (my.cur.every((v, i) => v === my.target[i])) return finish();
      const [a, b] = rng();
      if (half >= 0 && my.cur.slice(a, b).every((v, i) => v === my.target[a + i])) return halfDone();
      misses++; sfx.soft(); grid.classList.add('wobble'); setTimeout(() => grid.classList.remove('wobble'), 400); ui.help(true);
      if (half < 0) { setHalf(0); ui.prompt('Let’s do half at a time. Just boxes 1 to 4.', 'That one is tricky. Let us do it in halves. Listen to just the first half, one, two, three, four, slowly. Watch the numbers light up. Which of them does the ' + nameOf() + ' play on?').then(() => { if (!over && ui.alive) hearIt(); }); return; }
      if (++halfMiss >= 2) return startBoxes();
      ui.prompt('Not the same yet. Listen again, and watch the numbers.', 'Not the same yet. Listen again, slowly, and watch the numbers light up. Which numbers does the ' + nameOf() + ' play on?').then(() => { if (!over && ui.alive) hearIt(); }); };
    const btn = (cls, icon, label, fn, key) => h('button', { class: 'btn ' + cls, 'data-b': key, onclick: () => { sfx.tap(); fn(); } }, icon ? ic(icon) : null, label);
    const btns = h('div', { class: 'row wrow bbtns' });
    const me = S.me && W.home ? h('div', { class: 'bme', html: W.home.meSvg(S.me, {}) }) : null, band = h('div', { class: 'bband' }, me, kiwi('bguide', cid));
    const box = h('div', { class: 'beat' + (free ? ' free' : '') }, band, h('div', { class: 'bmain' }, grid, btns));
    if (free) { btns.append(btn('big', 'speaker-high-volume', 'Play', () => hearAll({ loops: 3 }), 'play'), h('button', { class: 'btn go big', 'data-b': 'next', onclick: () => { sfx.pop(); stop(); res(false); } }, 'Next'));
      W.cur = { type: 'act', auto: () => { stop(); res(false); } }; }
    else { btns.append(btn('big', 'ear', 'Listen', hearIt, 'listen'), btn('quiet big', 'speaker-high-volume', 'Mine', hearMine, 'mine'), btn('go big', null, 'Check', check, 'check'));
      W.cur = { type: 'act', part: mine.id, auto: () => { my.target.forEach((v, i) => { my.cur[i] = v; my.cells[i].classList.toggle('on', !!v); }); check(); setTimeout(() => { const b = $('.bbtns .btn.go', box); if (b && over) b.click(); }, 80); },
        miss: () => { const i = my.target.findIndex((v, k) => !v && !my.cur[k]); if (i >= 0) toggle(my, i); check(); if (i >= 0) toggle(my, i); } }; }
    ui.stage.innerHTML = ''; ui.stage.append(box);
    const p0 = free ? ui.prompt('Your own samba! Tap the boxes. Then press Play.', 'You know every part now. Change any box you like, and make your own beat. Then press Play to hear your band.') : ui.prompt(mine.intro.text, mine.intro.say);
    if (!free) Promise.race([p0, wait(9000)]).then(() => { if (!over && ui.alive && !misses && my.cur.every(v => !v)) hearIt(); });
  });
}
ACTS.beat = async (ui, d, ctx) => {
  const N = d.parts.length;
  for (;;) {
    const made = clamp(S.beat || 0, 0, N), idx = made < N ? made : -1;
    ui.wide(true); ui.clear(); ui.help(false);
    const again = await beatOne(ui, d, idx, ctx && ctx.tag); ui.check();
    if (idx >= 0) { S.beat = made + 1; saveState(); }
    if (!again) break;
    addStars(2);
  }
};

/* ---------- a flashcard race (asked for by Tony, 4 October 2026): quick recall, against a rival that runs at one steady speed from the start line to the finish and never stops.
   She is the tortoise. A card shows a sum and four answers. Right: the tortoise takes a step. Wrong: that answer greys out and she has one more try. Wrong again: the card changes.
   Nothing ever shows an answer. Cards missed twice come back after the race, one at a time, with dots to count and no rival; and they are in the pack again next race.
   Her progress is S.race { lv, again [card keys], wins }. She moves up a level only by winning. A level is a set of cards and a speed: each set is raced at RACE_PACE[0] seconds a step, then at RACE_PACE[1].
   d: me, rival (pictures), rivalName, track (steps to the finish, default 10), intro { text, say }, win { text, say }, lose { text, say } ---------- */
const RACE_PACE = [7, 5], RACE_SETS = 6, RACE_LEVELS = RACE_SETS * RACE_PACE.length;
const raceMk = (a, op, b) => ({ a, op, b, ans: op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b, key: a + op + b });
const raceFromKey = k => { const m = /^(\d+)([+−×÷])(\d+)$/.exec(String(k)); if (!m) return null; const c = raceMk(Number(m[1]), m[2], Number(m[3])); return Number.isInteger(c.ans) && c.ans >= 0 ? c : null; };
/* the six sets of cards: number bonds and doubles; adding and taking away within 20; the 2, 5 and 10 times tables; the 3 and 4; the 6, 7, 8 and 9; dividing, mixed with multiplying */
function raceCard(set) {
  const swap = (a, b) => rnd(0, 1) ? raceMk(a, '×', b) : raceMk(b, '×', a);
  if (set <= 1) { if (rnd(0, 2) === 0) { const a = rnd(1, 10); return raceMk(a, '+', a); } const a = rnd(1, 8); return raceMk(a, '+', rnd(1, 10 - a)); }
  if (set === 2) { if (rnd(0, 1)) { const a = rnd(6, 12); return raceMk(a, '+', rnd(3, Math.min(8, 20 - a))); } const a = rnd(11, 20); return raceMk(a, '−', rnd(2, 9)); }
  if (set === 3) return swap(pick([2, 5, 10]), rnd(1, 10));
  if (set === 4) return swap(rnd(0, 2) ? pick([3, 4]) : pick([2, 5, 10]), rnd(2, 10));
  if (set === 5) return swap(pick([6, 7, 8, 9]), rnd(2, 10));
  if (rnd(0, 1)) { const dv = rnd(2, 10); return raceMk(dv * rnd(2, 10), '÷', dv); } return swap(rnd(3, 9), rnd(3, 9));
}
const raceSay = c => c.a + ({ '+': ' plus ', '−': ' take away ', '×': ' times ', '÷': ' divided by ' })[c.op] + c.b;
/* four answers to choose from: the right one, and three that a slip would give */
function raceOpts(c) {
  const x = c.ans, cand = c.op === '×' ? [c.a * (c.b + 1), c.a * (c.b - 1), (c.a + 1) * c.b, (c.a - 1) * c.b, x + 1, x - 1, c.a + c.b] : c.op === '÷' ? [x + 1, x - 1, x + 2, x - 2, c.b, x * 2] : c.op === '−' ? [x + 1, x - 1, x + 2, x - 2, c.a + c.b, x + 10] : [x + 1, x - 1, x + 2, x - 2, x + 10, Math.abs(c.a - c.b)];
  const pool = shuffle(cand.filter((v, i) => v >= 0 && v !== x && cand.indexOf(v) === i)); for (let i = 3; pool.length < 3; i++) if (!pool.includes(x + i)) pool.push(x + i);
  return shuffle([x].concat(pool.slice(0, 3)));
}
/* dots to work from, for a card that comes back after the race. It never prints a number: a + b is two colours of dots, a − b is a dots with b crossed out, a × b is a rows of b, n ÷ d is n dots in rows of d.
   Adding and taking away are laid out in tens (Tony, 8 October: "is there a better way to work through this?"): each row is a box of ten, so she can fill the ten or go back to ten instead of counting every dot.
   For a − b, the crosses in the second box are purple and any that reach into the first ten are red: two steps she can see. */
function raceDots(el, c) {
  const sp = 26, r = 10, dot = (x, y, col, cross) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + col + '" stroke="' + INK + '" stroke-width="1.500"' + (cross ? ' opacity=".45"' : '') + '/>' + (cross ? '<path d="M' + (x - 7) + ' ' + (y - 7) + 'l14 14m0-14-14 14" stroke="' + cross + '" stroke-width="3.200" stroke-linecap="round"/>' : '');
  let s = '', W0, H0;
  if (c.op === '×' || c.op === '÷') { const rows = c.op === '×' ? c.a : c.ans, cols = c.b; W0 = cols * sp + 24; H0 = rows * sp + 24;
    for (let y = 0; y < rows; y++) { s += '<rect x="6" y="' + (y * sp + 13) + '" width="' + (cols * sp + 12) + '" height="' + (sp - 2) + '" rx="' + (sp / 2 - 1) + '" fill="' + (y % 2 ? '#EEF1F8' : '#FFF6D6') + '"/>'; for (let x = 0; x < cols; x++) s += dot(12 + x * sp + sp / 2, 12 + y * sp + sp / 2, y % 2 ? '#5CC8D6' : '#FFC83D'); } }
  else { const n = c.op === '+' ? c.a + c.b : c.a, tens = n > 10, cols = tens ? 10 : 5, rows = Math.ceil(n / cols), rg = tens ? 8 : 0, gx = x => 14 + x * sp + sp / 2 + (x >= 5 && tens ? 10 : 0), gy = y => 14 + y * (sp + rg) + sp / 2; W0 = cols * sp + 28 + (tens ? 10 : 0); H0 = rows * (sp + rg) - rg + 28;
    if (tens) for (let y = 0; y < rows; y++) s += '<rect x="8" y="' + (gy(y) - sp / 2 - 3) + '" width="' + (W0 - 16) + '" height="' + (sp + 6) + '" rx="12" fill="' + (y ? '#EEF1F8' : '#FFF6D6') + '" stroke="' + (y ? '#C9CEDA' : '#EBCB7C') + '" stroke-width="1.500"/>';
    for (let i = 0; i < n; i++) s += dot(gx(i % cols), gy(Math.floor(i / cols)), c.op === '+' ? (i < c.a ? '#FFC83D' : '#5CC8D6') : '#FFC83D', c.op === '−' && i >= n - c.b ? (tens && i < 10 ? '#E5484D' : '#6453C9') : null); }
  V.put(el, Math.max(W0, 150), H0, '<g transform="translate(' + (Math.max(0, 150 - W0) / 2) + ' 0)">' + s + '</g>');
}
/* how to work a card out, in words: a method, never the answer. { text (after the sum itself), say (after the sum read aloud) } */
function raceHow(c) {
  if (c.op === '×') return { text: c.a + (c.a === 1 ? ' row of ' : ' rows of ') + c.b + '. Count in ' + c.b + 's.', say: 'There ' + (c.a === 1 ? 'is 1 row' : 'are ' + c.a + ' rows') + ' of ' + c.b + '. Count the rows in ' + c.b + 's.' };
  if (c.op === '÷') return { text: 'Rows of ' + c.b + '. Count the rows.', say: 'The dots are in rows of ' + c.b + '. How many rows are there?' };
  if (c.op === '+') { const n = c.a + c.b;
    if (n > 10 && c.a < 10) return { text: 'Fill the ten first. Then count the rest.', say: 'The top box holds ten. The blue dots fill it up first. Then count how many blue dots are left over, underneath. Ten, and how many more?' };
    return { text: 'Start at ' + c.a + '. Count on the blue dots.', say: 'Do not count them all. Start at ' + c.a + ', and count on the blue dots.' }; }
  const ones = c.a > 10 ? c.a - 10 : 0;
  if (!ones) return { text: 'Count the dots that are left.', say: 'The crossed out dots are taken away. Count the dots that are left.' };
  if (c.b <= ones) return { text: 'Take ' + c.b + ' from the second box.', say: 'The top box is a full ten. Take ' + c.b + ' away from the second box. Ten, and how many are left?' };
  return { text: 'Take ' + ones + ' to reach 10. Then ' + (c.b - ones) + ' more.', say: 'Do it in two steps. First take away ' + ones + ', the purple crosses. That gets you back to ten. Then take away ' + (c.b - ones) + ' more, the red ' + (c.b - ones === 1 ? 'cross' : 'crosses') + '. What is left?' };
}
const raceStart = () => { const m = S.skills.arrays, a = S.skills.addsub; return m && m.lv >= 3 ? 5 : a && a.lv >= 3 ? 3 : 1; };   /* a child who already multiplies does not start with number bonds */
const raceState = () => (S.race && typeof S.race === 'object') ? S.race : (S.race = { lv: raceStart(), again: [], wins: 0 });
function raceOne(ui, d, cid) {
  return new Promise(res => {
    const R = raceState(), lv = clamp(R.lv, 1, RACE_LEVELS), set = Math.ceil(lv / RACE_PACE.length), pace = RACE_PACE[(lv - 1) % RACE_PACE.length], L = d.track || 10, first = !R.wins && !R.seen;
    const pack = [], seen = {}; (R.again || []).forEach(k => { const c = raceFromKey(k); if (c && !seen[c.key]) { seen[c.key] = 1; pack.push(c); } });
    for (let g = 0; pack.length < L + 10 && g < 600; g++) { const c = raceCard(set); if (!seen[c.key]) { seen[c.key] = 1; pack.push(c); } }
    let t = 0, elapsed = 0, idx = 0, tries = 0, over = false, started = false, busy = false, last = 0, timer = null; const missed = [];
    const sum = h('div', { class: 'rc-sum' }), note = h('div', { class: 'rc-note' }), card = h('div', { class: 'rc-card' }, sum), opts = h('div', { class: 'rc-opts' });
    const hare = h('div', { class: 'rc-run rc-rival' }, art(d.rival)), tort = h('div', { class: 'rc-run rc-me' }, art(d.me));
    const ticks = h('div', { class: 'rc-ticks' }, Array.from({ length: L + 1 }, () => h('i')));
    const track = h('div', { class: 'rc-track' }, ticks, h('div', { class: 'rc-flag' }, ic('chequered-flag')), h('div', { class: 'rc-lane' }, hare), h('div', { class: 'rc-lane' }, tort));
    const go = h('button', { class: 'btn go big rc-go', onclick: () => begin() }, 'Go!');
    const box = h('div', { class: 'race' }, h('div', { class: 'rc-top' }, h('div', { class: 'rc-lv' }, 'Level ' + lv), card, note), opts, track);
    const put = (el, p) => el.style.setProperty('--p', Math.min(1, p / L).toFixed(4));
    const tick = () => { const now = performance.now(), dt = Math.min(.3, (now - last) / 1000); last = now; if (!started || over || !ui.alive) { if (!ui.alive) clearInterval(timer); return; }
      elapsed += dt; put(hare, elapsed / pace); if (elapsed >= L * pace) end(false); };
    const show = () => { if (over) return; const c = pack[idx % pack.length], vals = raceOpts(c); tries = 0; note.textContent = ''; sum.textContent = c.a + ' ' + c.op + ' ' + c.b; opts.innerHTML = '';
      vals.forEach(v => opts.append(h('button', { class: 'rc-opt', 'data-v': v, onclick: e => choose(c, v, e.currentTarget) }, String(v))));
      card.classList.remove('rc-in', 'rc-out'); void card.offsetWidth; card.classList.add('rc-in');
      const btn = ok => [...opts.children].find(b => !b.disabled && (Number(b.dataset.v) === c.ans) === ok);
      W.cur = { type: 'act', race: lv, auto: () => { const b = btn(true); if (b) b.click(); }, miss: () => { const b = btn(false); if (b) b.click(); }, lose: () => { elapsed = L * pace; } }; };
    const choose = (c, v, b) => { if (over || busy || !started) return;
      if (v === c.ans) { busy = true; W.cur = null; b.classList.add('rc-ok'); sfx.pop(); t++; put(tort, t); tort.classList.remove('rc-hop'); void tort.offsetWidth; tort.classList.add('rc-hop');
        if (t >= L) return end(true); setTimeout(() => { busy = false; idx++; show(); }, W.fast ? 10 : 300); return; }
      tries++; sfx.soft(); b.classList.add('gone'); b.disabled = true;
      if (tries >= 2) { busy = true; W.cur = null; if (!missed.some(m => m.key === c.key)) missed.push(c); card.classList.add('rc-out'); note.textContent = 'That card comes back after the race.';
        setTimeout(() => { busy = false; idx++; show(); }, W.fast ? 10 : 520); }
      else { card.classList.remove('wobble'); void card.offsetWidth; card.classList.add('wobble'); note.textContent = 'Not that one. One more try!'; } };
    const end = won => { if (over) return; over = true; clearInterval(timer); W.cur = null; [...opts.children].forEach(b => { b.disabled = true; });
      R.again = missed.slice(0, 4).map(c => c.key); R.seen = 1; if (won) { R.wins = (R.wins || 0) + 1; R.lv = Math.min(RACE_LEVELS, lv + 1); } saveState();
      box.classList.add(won ? 'rc-won' : 'rc-lost'); if (won) { sfx.great(); confetti(40); kiwiMood(ui.root, 'cheer'); } else { put(hare, L); sfx.soft(); }
      const p = ui.prompt(won ? d.win.text : d.lose.text, won ? d.win.say : d.lose.say);
      Promise.race([p, wait(4200)]).then(() => wait(W.fast ? 10 : 900)).then(() => res({ won, missed, lv, top: lv >= RACE_LEVELS })); };
    const begin = () => { if (started) return; started = true; sfx.pop(); go.remove(); box.classList.add('rc-on'); Speech.stop(); ui.prompt('Tap the right answer. Beat the ' + (d.rivalName || 'hare') + '!', ' '); last = performance.now(); timer = setInterval(tick, 100); show(); };
    put(hare, 0); put(tort, 0); sum.textContent = '?'; opts.append(go);
    ui.stage.innerHTML = ''; ui.stage.append(box);
    ui.prompt(first ? d.intro.text : 'Level ' + lv + '. Ready? Press Go!', first ? d.intro.say : 'Level ' + lv + '. The ' + (d.rivalName || 'hare') + ' takes ' + pace + ' seconds for each step. Ready? Press Go!');
    ui.key = e => { if (e.key === 'Enter' && !started) begin(); else if (started && !over && /^[1-4]$/.test(e.key)) { const b = opts.children[Number(e.key) - 1]; if (b && !b.disabled) b.click(); } };
    W.cur = { type: 'btn', auto: () => begin() };
  });
}
/* a card that changed during the race, with no rival and no clock: dots laid out in tens or rows, a line saying how to work it out, and four answers. A wrong one greys out; the answer is never shown */
async function raceReview(ui, c) {
  const vals = raceOpts(c); let gone = [];
  for (;;) {
    const how = raceHow(c), it = { type: 'choice', text: c.a + ' ' + c.op + ' ' + c.b + '. ' + how.text, say: raceSay(c) + '. ' + how.say, options: vals.map(v => ({ label: String(v) })), answer: vals.indexOf(c.ans), visual: el => raceDots(el, c), gone };
    if (await askItem(ui, it)) { sfx.pop(); const f = h('div', { class: 'flash ok' }, ic('check-mark-button')); ui.stage.append(f); await ui.wait(550); f.remove(); return; }
    sfx.soft(); gone = gone.concat(it._got); await Promise.race([ui.prompt('Not that one. Look at the dots again.'), wait(2400)]); await ui.wait(200);
  }
}
ACTS.race = async (ui, d, ctx) => {
  for (;;) {
    ui.wide(true); ui.clear(); ui.help(false);
    const r = await raceOne(ui, d, ctx && ctx.tag); ui.check();
    if (r.missed.length) { ui.wide(false); ui.clear(); ui.help(true);
      await Promise.race([ui.prompt('Now the cards that changed. No rush this time.', 'Now, the cards that changed. There is no race this time, so take as long as you like. Count the dots to work each one out.'), wait(5200)]); ui.check();
      for (const c of r.missed) { await raceReview(ui, c); ui.check(); }
      ui.help(false); }
    ui.wide(true); ui.clear();
    const again = await new Promise(res => {
      const fin = v => { sfx.pop(); ui.key = null; res(v); }, next = h('button', { class: 'btn big' + (r.won ? ' go' : ''), onclick: () => fin(false) }, 'Next'), more = h('button', { class: 'btn big' + (r.won ? '' : ' go'), onclick: () => fin(true) }, 'Race again');
      ui.stage.append(h('div', { class: 'col rc-end' }, h('div', { class: 'rc-pair' }, art(d.me, 'hero'), art(d.rival, 'hero' + (r.won ? ' rc-dim' : ''))), h('div', { class: 'bigtext rc-endt' }, r.won ? (r.top ? 'Top level!' : 'Level ' + (r.lv + 1) + ' next!') : 'Level ' + r.lv), h('div', { class: 'row wrow' }, r.won ? [next, more] : [more, next])));
      ui.prompt(r.won ? (r.top ? 'You won at the top level! Race again?' : 'You won! You move up to level ' + (r.lv + 1) + '.') : 'Win a race to move up. Race again?', r.won ? (r.top ? 'You won at the top level! You can race again, as often as you like.' : 'You won, so you move up to level ' + (r.lv + 1) + '. The cards get trickier, or the ' + (d.rivalName || 'hare') + ' gets faster.') : 'You only move up a level when you win. Would you like to race again?');
      ui.key = e => { if (e.key === 'Enter') (r.won ? next : more).click(); };
      W.cur = { type: 'btn', auto: () => next.click(), more: () => more.click() };
    }); ui.check();
    if (!again) break; addStars(2);
  }
};

/* ---------- the sieve of Eratosthenes (Greece). The numbers 1 to 50 stand in a grid (1 to 100 the next time she plays). For each of 2, 3, 5 and 7 in turn she crosses out its multiples;
   whatever is never crossed out is prime. She taps, or drags across, the multiples. Once she has shown she has the pattern (SIEVE_SHOW of them), the rest of that times table sweeps itself out.
   A tap on a number that is not a multiple only wobbles. Help never lights a square: after two slips it tells her where to count on from.
   Her progress is S.sieve: 0 not played, 1 the grid to 50 done, 2 the grid to 100 done. d: intro { text, say }, done { text, say } ---------- */
const SIEVE_SHOW = 5, SIEVE_COL = { 2: '#5CC8D6', 3: '#FF9A8C', 5: '#B8A9FF', 7: '#9BD48C' };
ACTS.sieve = (ui, d) => new Promise(res => {
  ui.wide(true); ui.help(false);
  const big = (S.sieve || 0) >= 1, N = big ? 100 : 50, primes = [2, 3, 5, 7], wideGrid = ui.stage.clientWidth > ui.stage.clientHeight * 2.4, cols = wideGrid && big ? 20 : 10, rows = Math.ceil(N / cols);     /* a phone on its side: twenty across, so the squares stay big enough to tap */
  const grid = h('div', { class: 'sv-grid', style: { '--cols': cols, '--rows': rows } }), note = h('div', { class: 'sv-note' }), cell = {};
  for (let v = 1; v <= N; v++) { const c = h('button', { class: 'sv-c' + (v === 1 ? ' out one' : ''), 'data-v': v }, String(v)); cell[v] = c; grid.append(c); }
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'sv-wrap' }, h('div', { class: 'cq sv-cq' }, grid), note));
  let pi = -1, p = 0, mine = 0, slips = 0, sweeping = false, over = false, dragging = false;
  const todo = () => { const out = []; for (let v = p * 2; v <= N; v += p) if (!cell[v].classList.contains('out')) out.push(v); return out; };
  const cross = v => { const c = cell[v]; c.classList.add('out'); c.style.setProperty('--x', SIEVE_COL[p]); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); };
  const hook = () => { W.cur = { type: 'act', sieve: p, auto: () => { const t = todo(); if (t.length) tap(t[0], true); }, miss: () => { for (let v = p + 1; v <= N; v++) if (v % p && !cell[v].classList.contains('out')) return tap(v, true); } }; };
  const sweep = async list => { sweeping = true; W.cur = null; note.textContent = 'You have the pattern! Watch the rest go.'; sfx.great();
    for (const v of list) { if (!ui.alive) return; cross(v); if (!W.fast) { sfx.step(); await wait(list.length > 20 ? 55 : 90); } } sweeping = false; step(); };
  const step = () => { pi++; if (pi >= primes.length) return finish(); p = primes[pi]; mine = 0; slips = 0; const t = todo(); if (!t.length) return step();
    $$('.sv-c.keep', grid).forEach(c => c.classList.remove('now')); cell[p].classList.add('keep', 'now'); cell[p].style.setProperty('--x', SIEVE_COL[p]);
    note.textContent = p + ' is prime: keep it. Cross out ' + p * 2 + ', and so on.';
    ui.prompt(pi === 0 ? 'Count in 2s. Cross out every number you land on.' : 'Now count in ' + p + 's. Cross out each landing.', pi === 0 ? (d.intro ? d.intro.say : 'Two is a prime number, so it stays. Now count in twos from two, and tap every number you land on: those are its multiples, so they are not prime.') : p + ' has not been crossed out, so it is prime. It stays. Now count in ' + p + 's from ' + p + ', and cross out every number you land on that is still there.');
    hook(); };
  const tap = (v, real) => { if (over || sweeping || !p || v === p) return; const c = cell[v]; if (c.classList.contains('out')) return;
    if (v % p === 0) { cross(v); sfx.pop(); mine++; const t = todo(); if (!t.length) return step(); if (mine >= SIEVE_SHOW && t.length > 2) return sweep(t); note.textContent = t.length + ' more to find.'; hook(); return; }
    if (!real) return;                                                    /* dragging across a number that is not a multiple is not a slip */
    slips++; sfx.soft(); c.classList.remove('wobble'); void c.offsetWidth; c.classList.add('wobble'); let last = p; for (let u = p; u <= N; u += p) { if (u !== p && !cell[u].classList.contains('out')) break; last = u; }
    if (slips >= 2) ui.prompt('Start at ' + last + '. Count on ' + p + '.', v + ' is not in the ' + p + ' times table. Put your finger on ' + last + ', and count on ' + p + ' more.'); else note.textContent = v + ' is not in the ' + p + ' times table.'; hook(); };
  const finish = () => { over = true; W.cur = null; const left = []; for (let v = 2; v <= N; v++) if (!cell[v].classList.contains('out')) left.push(v);
    $$('.sv-c.now', grid).forEach(c => c.classList.remove('now')); left.forEach((v, i) => { cell[v].classList.add('prime'); cell[v].style.animationDelay = (W.fast ? 0 : i * 70) + 'ms'; });
    S.sieve = Math.max(S.sieve || 0, big ? 2 : 1); saveState(); sfx.great(); kiwiMood(ui.root, 'cheer'); confetti(40);
    note.textContent = left.length + ' prime numbers up to ' + N + '.';
    ui.prompt('What is left is prime. You sieved the primes!', (d.done && d.done.say) || 'Every number that is left is a prime number. Nothing divides it exactly, except one and itself. You have just done what Eratosthenes did, more than two thousand years ago.');
    ui.next('Next', note, 'sv-go').then(res); W.cur = { type: 'btn', auto: () => { const b = $('.sv-go', note); if (b) b.click(); } }; };
  grid.addEventListener('pointerdown', e => { const c = e.target.closest('.sv-c'); if (!c) return; dragging = true; tap(Number(c.dataset.v), true); });
  grid.addEventListener('pointermove', e => { if (!dragging) return; const t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest && t.closest('.sv-c'); if (c && grid.contains(c)) tap(Number(c.dataset.v), false); });
  const stop = () => { dragging = false; }; window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', stop);
  note.textContent = '1 is special: it is not a prime number.';
  step();
});

/* ---------- the Lo Shu magic square (China). The numbers 1 to 9 in a square, so that every row, every column and both diagonals make 15.
   The story goes that a turtle came out of the River Luo with the pattern on its shell. She puts back the numbers that have "washed off": tap a number then a square, or drag it.
   A line that is full shows its total beside it: gold for 15, pink for anything else. Nothing lights the square a number belongs in.
   After two wrong lines the help points at two numbers already in one line and asks how many more make 15: the sum is hers to do.
   Levels (S.magic counts the levels done): 0 three numbers missing; 1 only the four corners left; 2 the middle, a corner and the edge beside it; 3 the middle alone, and any square that works is right.
   d: { act: 'magic', intro: { say } } ---------- */
const LO_SHU = [4, 9, 2, 3, 5, 7, 8, 1, 6], LO_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], MAGIC_LEVELS = 4;
/* the same square turned (t & 3 quarter turns) and flipped (t & 4): eight squares in all, and every one is magic */
const loTurn = (q, t) => { let a = q.slice(); for (let i = 0; i < (t & 3); i++) a = [a[6], a[3], a[0], a[7], a[4], a[1], a[8], a[5], a[2]]; return t & 4 ? [a[2], a[1], a[0], a[5], a[4], a[3], a[8], a[7], a[6]] : a; };
const loGiven = lv => lv === 0 ? shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 6) : lv === 1 ? [0, 2, 6, 8] : lv === 2 ? [4, 0, 1] : [4];
const LO_TURTLE = '<svg viewBox="0 0 484 466" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#7CC08F" stroke="#2F6E4A" stroke-width="5" stroke-linejoin="round"><ellipse cx="92" cy="84" rx="46" ry="25" transform="rotate(38 92 84)"/><ellipse cx="392" cy="84" rx="46" ry="25" transform="rotate(-38 392 84)"/>' +
  '<ellipse cx="96" cy="372" rx="36" ry="21" transform="rotate(-38 96 372)"/><ellipse cx="388" cy="372" rx="36" ry="21" transform="rotate(38 388 372)"/><path d="M226 384q16 46 32 0z"/><ellipse cx="242" cy="42" rx="42" ry="37"/></g>' +
  '<circle cx="225" cy="30" r="7" fill="#1B2A4E"/><circle cx="259" cy="30" r="7" fill="#1B2A4E"/><circle cx="227.500" cy="27.500" r="2.400" fill="#fff"/><circle cx="261.500" cy="27.500" r="2.400" fill="#fff"/><path d="M232 46q10 7 20 0" fill="none" stroke="#1B2A4E" stroke-width="3.500" stroke-linecap="round"/>' +
  '<rect x="68" y="50" width="348" height="348" rx="98" fill="#3F8A5E" stroke="#2F6E4A" stroke-width="6"/><rect x="82" y="64" width="320" height="320" rx="86" fill="#58A777"/></svg>';
ACTS.magic = (ui, d) => new Promise(res => {
  ui.wide(true); ui.help(false);
  const lv = clamp(S.magic || 0, 0, MAGIC_LEVELS - 1), sq = loTurn(LO_SHU, rnd(0, 7)), given = loGiven(lv), val = Array(9).fill(0), side = ui.stage.clientWidth > ui.stage.clientHeight * 1.45;
  given.forEach(i => { val[i] = sq[i]; });
  const board = h('div', { class: 'lo-board', html: LO_TURTLE }), tray = h('div', { class: 'lo-tray' }), note = h('div', { class: 'lo-note' }, 'Tap a number, then a square. Or drag it.'), cells = [], sums = [], tiles = {};
  let sel = 0, bad = 0, over = false;
  const where = [[5, 2], [5, 3], [5, 4], [2, 5], [3, 5], [4, 5], [5, 5], [1, 5]];     /* where each line's total sits: at the end of its row, under its column, at the foot of its diagonal */
  const lineSum = L => L.every(i => val[i]) ? L.reduce((s, i) => s + val[i], 0) : 0;
  const refresh = () => { let ok = 0; LO_LINES.forEach((L, k) => { const s = lineSum(L), b = sums[k]; b.textContent = s ? String(s) : ''; b.className = 'lo-sum' + (k === 6 ? ' dg1' : k === 7 ? ' dg2' : '') + (s === 15 ? ' ok' : s ? ' bad' : ''); if (s === 15) ok++; }); return ok; };
  const unlook = () => cells.forEach(c => c.classList.remove('look'));
  /* the help: two numbers already in a line with one gap, when the number that completes them is still in the tray. It says which two, and asks; it never says the missing number or lights its square */
  const clue = () => { unlook(); const free = Object.keys(tiles).map(Number).filter(v => !tiles[v].classList.contains('used'));
    for (const L of shuffle(LO_LINES.slice())) { const got = L.filter(i => val[i]); if (got.length !== 2) continue; const p = val[got[0]], q = val[got[1]]; if (!free.includes(15 - p - q)) continue;
      got.forEach(i => cells[i].classList.add('look')); return ui.prompt(p + ' and ' + q + ' are in one line. How many more makes 15?', 'Look at ' + p + ' and ' + q + '. They are in one line. Add them up. How many more do you need, to make fifteen?'); }
    if (bad >= 4 && lv === 3) return ui.prompt('Try the even numbers in the corners.', 'Here is another clue. On the turtle, the even numbers, two, four, six and eight, were in the corners.');
    ui.prompt('Across the middle, two numbers always make 10.', 'Here is a clue. Two numbers on opposite sides of the middle always make ten. With the five between them, that is fifteen.'); };
  const hook = () => { W.cur = { type: 'act', magic: lv, auto: () => { cells.forEach((c, i) => { if (c.classList.contains('mine')) lift(i, true); }); for (let i = 0; i < 9 && !over; i++) if (!val[i]) put(sq[i], i); },
    miss: () => { for (const L of LO_LINES) { const gap = L.filter(i => !val[i]); if (gap.length !== 1) continue; const v = Object.keys(tiles).map(Number).find(x => !tiles[x].classList.contains('used') && x !== sq[gap[0]]); if (v) return put(v, gap[0]); } } }; };
  function lift(i, quiet) { const v = val[i]; if (!v || given.includes(i) || over) return; val[i] = 0; cells[i].textContent = ''; cells[i].classList.remove('mine'); tiles[v].classList.remove('used'); refresh();
    if (!quiet) { sfx.tap(); if (bad >= 2) clue(); else note.textContent = 'Lifted. Try another number there.'; hook(); } }
  function put(v, i) { if (over || val[i] || !tiles[v] || tiles[v].classList.contains('used')) return; unlook();
    val[i] = v; const c = cells[i]; c.textContent = String(v); c.classList.add('mine'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); tiles[v].classList.add('used'); tiles[v].classList.remove('sel'); sel = 0; sfx.place();
    if (refresh() === 8) return finish();
    const wrong = LO_LINES.filter(L => L.includes(i) && lineSum(L) && lineSum(L) !== 15);
    if (wrong.length) { bad++; sfx.soft(); const s = lineSum(wrong[0]); wrong[0].forEach(j => { cells[j].classList.remove('wobble'); void cells[j].offsetWidth; cells[j].classList.add('wobble'); });
      note.textContent = 'Tap a number you placed to lift it off.';
      ui.prompt('That line makes ' + s + ', not 15. Lift a number off.', 'That line makes ' + s + '. Every line must make fifteen. Tap a number you placed, to lift it off, and try another.'); }
    else { const left = val.filter(x => !x).length; note.textContent = left === 1 ? '1 more to place.' : left + ' more to place.'; }
    hook(); }
  const finish = () => { over = true; W.cur = null; unlook(); S.magic = Math.max(S.magic || 0, Math.min(lv + 1, MAGIC_LEVELS)); saveState(); sfx.great(); kiwiMood(ui.root, 'cheer'); confetti(40); board.classList.add('done');
    note.textContent = 'Three rows, three columns, two diagonals: all 15.';
    ui.prompt('Every line makes 15. A magic square!', (d.done && d.done.say) || 'Every row, every column, and both diagonals make fifteen. That is a magic square! People in China have known this one for about two thousand years.');
    ui.next('Next', note, 'lo-go').then(res); W.cur = { type: 'btn', auto: () => { const b = $('.lo-go', note); if (b) b.click(); } }; };
  for (let i = 0; i < 9; i++) { const c = h('button', { class: 'lo-c' + (val[i] ? ' giv' : ''), style: { 'grid-column': String(i % 3 + 2), 'grid-row': String(Math.floor(i / 3) + 2) }, 'data-i': i, 'aria-label': 'A square on the shell',
      onclick: () => { if (over) return; if (c.classList.contains('mine')) lift(i); else if (sel && !val[i]) put(sel, i); } }, val[i] ? String(val[i]) : ''); cells.push(c); board.append(c); }
  LO_LINES.forEach((L, k) => { const b = h('div', { class: 'lo-sum', style: { 'grid-column': String(where[k][0]), 'grid-row': String(where[k][1]) } }); sums.push(b); board.append(b); });
  sq.filter((v, i) => !given.includes(i)).sort((a, b) => a - b).forEach(v => { const t = h('div', { class: 'lo-t', role: 'button', 'data-v': v }, String(v)); tiles[v] = t; tray.append(t);
    dragTap(t, () => { if (over) return; sfx.tap(); $$('.lo-t', tray).forEach(x => x.classList.remove('sel')); sel = v; t.classList.add('sel'); },
      el => { const c = el && el.closest && el.closest('.lo-c'); if (c && board.contains(c)) put(v, Number(c.dataset.i)); }); });
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'lo-wrap' + (side ? ' side' : '') }, h('div', { class: 'lo-main' }, h('div', { class: 'cq lo-cq' }, board), note), tray));
  refresh();
  ui.prompt(lv === 0 ? 'Put the numbers back. Every line must make 15.' : lv === 3 ? 'Only the middle is left! Every line makes 15.' : 'More numbers washed off. Every line must make 15.',
    lv === 0 ? ((d.intro && d.intro.say) || 'Some numbers have washed off the turtle’s shell. Put them back, so that every row, every column, and both diagonals add up to fifteen.')
      : lv === 3 ? 'This time, only the five in the middle is left. Can you rebuild the whole magic square? Every row, every column, and both diagonals must add up to fifteen.'
        : 'More numbers have washed off this time. Put them back, so that every row, every column, and both diagonals add up to fifteen.');
  hook();
});
