/* ===== The spine: two strands that run through every country from Greece on.
   Tony, 4 October: "We need a bit of structure across all the countries", "we need the player to recite the tables", "the player needs to be a master" of anatomy.
   1. THE PERIODIC TABLE. She says the elements in order first, then sorts them into groups ("practicing through in order to help memorise first and then we are wanting to start grouping them").
      Her place is S.elem { n: how many she can put in order, placed, g: grouping level, tries }. It is not any country's ladder: resetting a country leaves it alone.
      A country carries the strand with { act: 'elements' } and, later in the same mission, { act: 'elements', part: 'group' }.
      A visit: the first time, "how far can you go?" finds her place. Then the next five: meet them, say them aloud and check, put them in order. One slip at most moves her on.
      Grouping starts once she has the first twenty: metal or not, gas or solid, the first and last columns, then four families.
      The game never shows the next element. A wrong tile greys out and a clue about that element is given (what it is found in), never its name.
   2. THE BODY ATLAS. Each country adds one body system to ATLAS: a picture, parts with their real names, and a "point to it" test: { act: 'point', system: '<id>' }.
   Both can be practised any day from the passport (SCREENS.labbook), without playing a mission.
   Names and symbols follow IUPAC, spelled the New Zealand way (aluminium, caesium, sulfur). tools/test_skills.mjs checks all 118 against the npm package "periodic-table".
   What each is found in: the Royal Society of Chemistry's periodic table (periodic-table.rsc.org), "Uses" and "Biological role", read 4 October 2026. ===== */
const EL_RAW = 'H Hydrogen|He Helium|Li Lithium|Be Beryllium|B Boron|C Carbon|N Nitrogen|O Oxygen|F Fluorine|Ne Neon|Na Sodium|Mg Magnesium|Al Aluminium|Si Silicon|P Phosphorus|S Sulfur|Cl Chlorine|Ar Argon|K Potassium|Ca Calcium|' +
  'Sc Scandium|Ti Titanium|V Vanadium|Cr Chromium|Mn Manganese|Fe Iron|Co Cobalt|Ni Nickel|Cu Copper|Zn Zinc|Ga Gallium|Ge Germanium|As Arsenic|Se Selenium|Br Bromine|Kr Krypton|' +
  'Rb Rubidium|Sr Strontium|Y Yttrium|Zr Zirconium|Nb Niobium|Mo Molybdenum|Tc Technetium|Ru Ruthenium|Rh Rhodium|Pd Palladium|Ag Silver|Cd Cadmium|In Indium|Sn Tin|Sb Antimony|Te Tellurium|I Iodine|Xe Xenon|' +
  'Cs Caesium|Ba Barium|La Lanthanum|Ce Cerium|Pr Praseodymium|Nd Neodymium|Pm Promethium|Sm Samarium|Eu Europium|Gd Gadolinium|Tb Terbium|Dy Dysprosium|Ho Holmium|Er Erbium|Tm Thulium|Yb Ytterbium|Lu Lutetium|' +
  'Hf Hafnium|Ta Tantalum|W Tungsten|Re Rhenium|Os Osmium|Ir Iridium|Pt Platinum|Au Gold|Hg Mercury|Tl Thallium|Pb Lead|Bi Bismuth|Po Polonium|At Astatine|Rn Radon|' +
  'Fr Francium|Ra Radium|Ac Actinium|Th Thorium|Pa Protactinium|U Uranium|Np Neptunium|Pu Plutonium|Am Americium|Cm Curium|Bk Berkelium|Cf Californium|Es Einsteinium|Fm Fermium|Md Mendelevium|No Nobelium|Lr Lawrencium|' +
  'Rf Rutherfordium|Db Dubnium|Sg Seaborgium|Bh Bohrium|Hs Hassium|Mt Meitnerium|Ds Darmstadtium|Rg Roentgenium|Cn Copernicium|Nh Nihonium|Fl Flerovium|Mc Moscovium|Lv Livermorium|Ts Tennessine|Og Oganesson';
/* what it is found in: a clue she can hold on to, and a picture for the first thirty-six */
const EL_EX = { 1: ['in every drop of water', 'droplet'], 2: ['fills party balloons', 'balloon'], 3: ['in rechargeable batteries', 'battery'], 4: ['in green emeralds', 'gem-stone'], 5: ['in heatproof glass', 'alembic'],
  6: ['in pencils and diamonds', 'pencil'], 7: ['most of the air', 'wind-face'], 8: ['the gas we breathe', 'lungs'], 9: ['in toothpaste, as fluoride', 'toothbrush'], 10: ['glows in red signs', 'red-circle'],
  11: ['in table salt', 'salt'], 12: ['burns white in sparklers', 'sparkler'], 13: ['drink cans and foil', 'canned-food'], 14: ['in sand and computer chips', 'laptop'], 15: ['in bones and matchboxes', 'bone'],
  16: ['yellow, found by volcanoes', 'volcano'], 17: ['keeps swimming pools clean', 'person-swimming'], 18: ['the gas inside light bulbs', 'light-bulb'], 19: ['in bananas and plant food', 'banana'], 20: ['in bones, teeth and chalk', 'tooth'],
  21: ['in light bike frames', 'bicycle'], 22: ['in aircraft and new hips', 'airplane'], 23: ['in tough steel tools', 'wrench'], 24: ['shiny chrome; makes rubies red', 'ring'], 25: ['in steel railway tracks', 'railway-track'],
  26: ['in steel and your blood', 'drop-of-blood'], 27: ['makes glass deep blue', 'large-blue-diamond'], 28: ['in coins and stainless steel', 'coin'], 29: ['in electrical wires', 'electric-plug'], 30: ['stops steel from rusting', 'nut-and-bolt'],
  31: ['in LED lights', 'flashlight'], 32: ['in camera lenses', 'camera'], 33: ['a poison; in some chips', 'computer-disk'], 34: ['in anti-dandruff shampoo', 'lotion-bottle'], 35: ['a red-brown liquid', 'test-tube'], 36: ['in camera flash lamps', 'camera-with-flash'],
  /* 37 to 118: what each is used for, or a story about it that does not give its name away (Tony, 11 October, on "it comes straight after strontium": "stupid hint!").
     Uses and stories from the Royal Society of Chemistry's periodic table (rsc.org/periodic-table), checked 11 October 2026 */
  37: ['melts on a hot day'], 38: ['makes fireworks glow red'], 39: ['named after a Swedish village'], 40: ['in sparkly fake diamonds'], 41: ['in rocket engine nozzles'], 42: ['makes tool steel extra strong'],
  43: ['used in hospital bone scans'], 44: ['in computer hard drives'], 45: ['cleans car exhaust fumes'], 46: ['in white gold jewellery'],
  47: ['in jewellery and mirrors'], 48: ["bright yellow artists' paint"], 49: ['in phone touch screens'], 50: ['coats food cans'], 51: ['Egyptian black eye make-up'], 52: ['in some solar panels'],
  53: ['a purple solid; cleans cuts'], 54: ['in bright car headlamps'], 55: ['defines one exact second'], 56: ['shows tummies on X-rays'],
  57: ['in hybrid car batteries'], 58: ['sparks in lighter flints'], 59: ["colours welders' goggles"], 60: ['in super-strong magnets'], 61: ['named after a Greek fire-thief'],
  62: ['magnets that work when hot'], 63: ['glows on banknotes under UV'], 64: ['helps MRI scans show more'], 65: ['makes green light in screens'], 66: ['in electric car motor magnets'],
  67: ["doctors' lasers for kidney stones"], 68: ['boosts internet in glass cables'], 69: ['in small portable X-ray machines'], 70: ['in lasers that cut metal'], 71: ['in hospital PET scanners'],
  72: ['in submarine nuclear engines'], 73: ['in phones and laptops'], 74: ['wire in old light bulbs'], 75: ['in jet engine blades'], 76: ['the densest metal of all'], 77: ['left by the dinosaur asteroid'],
  78: ['in precious rings'], 79: ['in jewellery and treasure'], 80: ['a liquid metal'], 81: ['once used as rat poison'], 82: ['a heavy metal; stops X-rays'], 83: ['in pink tummy medicine'],
  84: ["named after Marie Curie's homeland"], 85: ['among the rarest on Earth'], 86: ['a gas from rocks'], 87: ['named after a European country'], 88: ['once made clock hands glow'],
  89: ['glows pale blue in dark'], 90: ['named after a thunder god'], 91: ['its name means "before actinium"'], 92: ['the fuel in nuclear power'], 93: ['named after the eighth planet'],
  94: ['powers faraway space probes'], 95: ['in some smoke alarms'], 96: ['helped Mars rovers study rocks'], 97: ['named after a Californian university'], 98: ['helps find gold underground'],
  99: ['named after a famous physicist'], 100: ['named after a nuclear pioneer'], 101: ["honours the table's inventor"], 102: ['named after a prize founder'],
  103: ["named after the cyclotron's inventor"], 104: ['honours a New Zealand scientist'], 105: ['named after a Russian town'], 106: ['named after a living scientist'],
  107: ['honours a Danish atom scientist'], 108: ['named after a German state'], 109: ['honours an Austrian woman physicist'], 110: ['named after a German city'], 111: ['honours the discoverer of X-rays'],
  112: ['honours a famous Sun astronomer'], 113: ['its name means Japan!'], 114: ['named after a Russian laboratory'], 115: ["named after Moscow's region"],
  116: ['named after a Californian laboratory'], 117: ['named after a US state'], 118: ['honours an Armenian-Russian scientist'] };
const EL_GAS = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86], EL_LIQ = [35, 80], EL_NONMETAL = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 86], EL_SEMI = [5, 14, 32, 33, 51, 52];
/* where an element sits: its period (row) and group (column 1 to 18; 0 for the two rows drawn underneath), and its family by column */
function elPos(z) {
  const ends = [2, 10, 18, 36, 54, 86, 118]; let period = ends.findIndex(e => z <= e) + 1, first = period === 1 ? 1 : ends[period - 2] + 1, k = z - first, group;
  if (period === 1) group = z === 1 ? 1 : 18;
  else if (period <= 3) group = k < 2 ? k + 1 : k + 11;
  else if (period <= 5) group = k + 1;
  else group = k < 2 ? k + 1 : k < 17 ? 0 : k - 13;          /* 57 to 71 and 89 to 103 are the two rows underneath */
  const fam = z === 1 ? 'h' : group === 1 ? 'alk' : group === 2 ? 'ae' : group === 17 ? 'hal' : group === 18 ? 'ng' : group === 0 ? (period === 6 ? 'lan' : 'act') : group <= 12 ? 'tm' : 'p';
  return { period, group, fam };
}
const ELEMENTS = EL_RAW.split('|').map((s, i) => { const z = i + 1, p = s.split(' '), ex = EL_EX[z] || [];
  const state = EL_GAS.includes(z) ? 'gas' : EL_LIQ.includes(z) ? 'liquid' : 'solid', metal = EL_NONMETAL.includes(z) ? 'no' : EL_SEMI.includes(z) ? 'semi' : z === 85 || z >= 104 ? '' : 'yes';
  return Object.assign({ z, sym: p[0], name: p[1], ex: ex[0] || '', icon: ex[1] || null, state, metal }, elPos(z)); });
const EL = z => ELEMENTS[z - 1];
const elKind = e => e.z >= 104 ? 'made in a laboratory' : e.metal === 'yes' ? (e.state === 'liquid' ? 'a liquid metal' : 'a metal') : e.metal === 'semi' ? 'a semi-metal' : e.metal === 'no' ? 'a non-metal ' + (e.state === 'solid' ? 'solid' : e.state) : 'very rare';
const EL_FAMILY = { alk: 'Alkali metals', ae: 'Alkaline earth metals', hal: 'Halogens', ng: 'Noble gases' };
const EL_CHUNK = 5;
const elState = () => (S.elem && typeof S.elem === 'object') ? S.elem : (S.elem = { n: 0, placed: false, g: 0, tries: 0 });
/* a clue for the element she is looking for, never its name. The first miss: what it is used for or a story about it. Another miss: where it sits in the table,
   under the element above it in its column, so the clue teaches the columns too. Never "it comes after": she can see that already (Tony, 11 October: "stupid hint! of course it comes after strontium") */
const elAbove = z => { const e = EL(z); if (!e.group || e.period < 2) return null; return ELEMENTS.find(x => x.group === e.group && x.period === e.period - 1) || null; };
const elClue = (z, m) => { const e = EL(z), up = elAbove(z);
  if ((m || 1) >= 2) return up ? 'Clue: it sits right under ' + up.name.toLowerCase() + ' in the table.' : e.group ? 'Clue: row ' + e.period + ', column ' + e.group + ' of the table.' : 'Clue: it is in a row drawn underneath.';
  if (e.ex) return 'Clue: ' + e.ex + '.';
  return up ? 'Clue: it sits right under ' + up.name.toLowerCase() + ' in the table.' : 'Clue: it is ' + elKind(e) + '.'; };

/* ----- the table. Up to twenty elements it is drawn eight columns wide (groups 1, 2 and 13 to 18), so the tiles are big; beyond that, all eighteen columns.
   o: upto (the highest number that gets a slot), on(z) (is its symbol showing), colour (tint the families) ----- */
function elTable(o) {
  const top = clamp(o.upto, 2, 118), short = top <= 20, cols = short ? 8 : 18, lastP = EL(top).period, under = top > 56;
  const t = h('div', { class: 'el-tab' + (short ? ' short' : '') + (o.colour ? ' col' : ''), style: { '--cols': cols, '--rows': lastP + (under ? (lastP > 6 ? 2.3 : 1.3) : 0) } });
  ELEMENTS.forEach(e => { if (e.period > lastP || (short && e.z > 20)) return;
    const col = e.group ? (short ? (e.group <= 2 ? e.group : e.group - 10) : e.group) : 3 + e.z - (e.period === 6 ? 57 : 89), row = e.group ? e.period : e.period + 2;
    t.append(h('div', { class: 'el-c f-' + e.fam + (o.on && o.on(e.z) ? ' on' : ''), 'data-z': e.z, style: { 'grid-column': col, 'grid-row': row } }, h('i', null, e.z), h('b', null, e.sym))); });
  t.cell = z => $('.el-c[data-z="' + z + '"]', t);
  t.show = (z, pop) => { const c = t.cell(z); if (c) { c.classList.add('on'); if (pop) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } } };
  return t;
}
const elFrame = (ui, table, zone) => { ui.stage.innerHTML = ''; const box = h('div', { class: 'elx' }, h('div', { class: 'el-top' }, table), zone); ui.stage.append(box); return box; };
const elCard = (e, o) => h('button', Object.assign({ class: 'el-card' + (o && o.cls ? ' ' + o.cls : ''), 'data-z': e.z }, o && o.attrs),
  h('i', { class: 'el-n' }, e.z), h('b', { class: 'el-s' }, e.sym), h('span', { class: 'el-nm' }, e.name), o && o.ex && e.ex ? h('span', { class: 'el-ex' }, e.icon ? ic(e.icon) : null, e.ex) : null);
const elSpeak = e => e.z + '. ' + e.name + '. ' + cap1(elKind(e)) + '.' + (e.ex ? ' ' + cap1(e.ex) + '.' : '');
const elRange = (a, b) => ELEMENTS.slice(a - 1, b);

/* how far can she already go? From hydrogen, tap what comes next, until the first slip. No slip is marked wrong: it is only where we start */
function elPlacement(ui) {
  return new Promise(res => {
    const st = elState(), span = z => z <= 10 ? 10 : z <= 20 ? 20 : z <= 36 ? 36 : z <= 54 ? 54 : 118; let z = 1, cur = 10, table = elTable({ upto: 10 }), over = false; const zone = h('div', { class: 'el-zone' }), opts = h('div', { class: 'el-opts' }); zone.append(opts);
    const frame = () => elFrame(ui, table, zone);
    const end = () => { if (over) return; over = true; W.cur = null; st.placed = true; st.n = z - 1; saveState(); opts.innerHTML = '';
      const p = ui.prompt(st.n ? 'You know ' + st.n + ' in order. We start there!' : 'This is where we start. Here come the first five!', st.n ? 'You put ' + st.n + ' elements in order. That is where we will start.' : 'This is where we start. Here come the first five.');
      if (st.n >= 10) { sfx.great(); confetti(30); kiwiMood(ui.root, 'cheer'); } Promise.race([p, wait(4000)]).then(() => wait(W.fast ? 10 : 700)).then(res); };
    const show = () => { if (z > 118) return end();
      if (span(z) !== cur) { cur = span(z); table = elTable({ upto: cur, on: k => k < z }); frame(); }      /* the table grows a row, or widens to eighteen columns, as she goes */
      const pool = shuffle(elRange(z + 1, Math.min(118, z + 7)).concat(z > 3 ? [EL(z - 2)] : [])).slice(0, 3), list = shuffle([EL(z)].concat(pool));
      opts.innerHTML = ''; list.forEach(e => opts.append(h('button', { class: 'btn quiet el-opt', 'data-z': e.z, onclick: () => choose(e.z) }, e.name)));
      const btn = ok => [...opts.children].find(b => (Number(b.dataset.z) === z) === ok);
      W.cur = { type: 'act', elem: 'place', auto: () => { if (z > (W.elStop || 12)) { const b = btn(false); if (b) return b.click(); } btn(true).click(); }, miss: () => { const b = btn(false); if (b) b.click(); } }; };
    const choose = k => { if (over) return; if (k !== z) { sfx.soft(); return end(); } sfx.pop(); table.show(z, true); z++; show(); };
    frame(); ui.prompt('How far can you go? Tap what comes next.', 'Let us see how much of the periodic table you already know. Start at number one. Tap the element that comes next, and keep going as far as you can. It does not matter where you stop.');
    show();
  });
}
/* meet the new ones: tap each tile to hear its number, its name, what kind of thing it is and where she has met it */
function elMeet(ui, a, b) {
  return new Promise(res => {
    const table = elTable({ upto: b, on: z => z < a, colour: elState().g > 2 }), zone = h('div', { class: 'el-zone' }), cards = h('div', { class: 'el-cards' }); zone.append(cards); let seen = 0, shown = false;
    elRange(a, b).forEach(e => { const c = elCard(e, { ex: true, cls: 'meet' }); cards.append(c);
      c.addEventListener('click', () => { sfx.tap(); Speech.say(elSpeak(e)); table.show(e.z, !c.classList.contains('heard')); if (!c.classList.contains('heard')) { c.classList.add('heard'); seen++; }
        if (seen === b - a + 1 && !shown) { shown = true; ui.next("I've met them all", zone, 'el-go').then(res); } }); });
    elFrame(ui, table, zone);
    ui.prompt(a === 1 ? 'The first five elements. Tap each one!' : 'Numbers ' + a + ' to ' + b + '. Tap each one!', a === 1 ? 'Everything in the world is made of elements. Here are the first five, in order. Tap each one to hear its name, and where you have met it.' : 'Here are the next ones: numbers ' + a + ' to ' + b + '. Tap each one to hear its name, and where you have met it.');
    W.cur = { type: 'act', auto: () => { $$('.el-card', cards).forEach(c => c.click()); setTimeout(() => { const g = $('.el-go', zone); if (g) g.click(); }, 20); } };
  });
}
/* say it, then check it: the tiles are face down, showing only their numbers. She says the name aloud and taps to see if she was right. In order, one at a time */
function elSay(ui, a, b) {
  return new Promise(res => {
    const table = elTable({ upto: b, on: z => z < a, colour: elState().g > 2 }), zone = h('div', { class: 'el-zone' }), cards = h('div', { class: 'el-cards say' + (b - a > 9 ? ' many' : '') }); zone.append(cards); let next = a;
    const list = elRange(a, b).map(e => { const c = elCard(e, { cls: 'back' }); cards.append(c); c.addEventListener('click', () => flip(e, c)); return c; });
    const mark = () => list.forEach((c, i) => c.classList.toggle('now', a + i === next));
    const flip = (e, c) => { if (e.z !== next) { if (e.z > next) { sfx.soft(); c.classList.remove('wobble'); void c.offsetWidth; c.classList.add('wobble'); } else Speech.say(e.name); return; }
      sfx.pop(); c.classList.remove('back'); c.classList.add('heard'); table.show(e.z, true); Speech.say(e.name); next++; mark(); c.scrollIntoView && cards.classList.contains('many') && c.scrollIntoView({ block: 'nearest' });
      if (next > b) ui.next('I said them all', zone, 'el-go').then(res); };
    mark(); elFrame(ui, table, zone);
    ui.prompt('Say each one out loud. Then tap to check.', 'Now you say them. Start at number ' + a + '. Say its name out loud, then tap the tile to check. Keep going, in order.');
    W.cur = { type: 'act', auto: () => { list.forEach(c => c.click()); setTimeout(() => { const g = $('.el-go', zone); if (g) g.click(); }, 20); } };
  });
}
/* listen along: each tile lights as its name is said, in order. She joins in */
async function elChant(ui, a, b) {
  const table = elTable({ upto: b, on: z => z < a, colour: elState().g > 2 }), zone = h('div', { class: 'el-zone' }), big = h('div', { class: 'el-big' }); zone.append(big);
  elFrame(ui, table, zone); W.cur = null;
  await Promise.race([ui.prompt('Say them with me!', 'Say them with me, from number ' + a + '.'), wait(3000)]); ui.check();
  for (const e of elRange(a, b)) { big.innerHTML = ''; big.append(h('i', null, e.z), h('b', null, e.sym), h('span', null, e.name)); table.show(e.z, true); sfx.step(); await Promise.race([Speech.say(e.name), wait(2200)]); await ui.wait(W.fast ? 5 : 260); }
}
/* the test: the tiles are shuffled and carry no numbers. She taps them in order. A wrong tile greys out and a clue is given. Returns how many slips */
function elOrder(ui, a, b, o) {
  return new Promise(res => {
    const table = elTable({ upto: b, on: z => z < a, colour: elState().g > 2 }), zone = h('div', { class: 'el-zone' }), tiles = h('div', { class: 'el-tiles' }); zone.append(tiles);
    let next = a, slips = 0, here = 0, busy = false; const T = {};
    shuffle(elRange(a, b)).forEach(e => { const t = h('button', { class: 'el-tile', 'data-z': e.z, onclick: () => tap(e.z) }, h('b', null, e.sym), h('span', null, e.name)); T[e.z] = t; tiles.append(t); });
    const fresh = () => { Object.values(T).forEach(t => { t.classList.remove('gone'); t.disabled = t.classList.contains('used'); }); };
    const hook = () => { const left = Object.keys(T).map(Number).filter(z => !T[z].classList.contains('used') && !T[z].disabled);
      W.cur = { type: 'act', elem: 'order', answer: next, auto: () => tap(next), miss: () => { const w = left.find(z => z !== next); if (w) tap(w); else tap(next); } }; };
    const tap = z => { if (busy || !T[z] || T[z].disabled) return;
      if (z === next) { sfx.pop(); elTick(ui, here === 0); T[z].classList.add('used'); T[z].disabled = true; table.show(z, true); next++; here = 0; fresh();
        if (next > b) { busy = true; W.cur = null; sfx.great(); kiwiMood(ui.root, 'cheer'); setTimeout(() => res(slips), W.fast ? 10 : 900); return; }
        ui.bub.set(o && o.review ? 'Keep going. What comes next?' : 'Yes! What comes next?', ' '); hook(); return; }
      slips++; here++; sfx.soft(); T[z].classList.add('gone'); T[z].disabled = true; T[z].classList.remove('wobble'); void T[z].offsetWidth; T[z].classList.add('wobble');
      ui.prompt(elClue(next, here)); hook(); };
    elFrame(ui, table, zone);
    ui.prompt(a === 1 ? 'Now put them in order. Tap number 1 first.' : 'Now put them in order. Tap number ' + a + ' first.', 'Now put them in order. The tiles are mixed up, and they have no numbers. Tap number ' + a + ' first, then the one that comes next.');
    hook();
  });
}
/* the next five: meet, say, order. One slip at most and she moves on; otherwise the same five come back next time */
async function elLearn(ui) {
  const st = elState();
  if (st.n >= 118) { const a = rnd(1, 111); await elSay(ui, a, a + 7); ui.check(); await elOrder(ui, a, a + 7, { review: true }); ui.check(); return { review: true }; }
  const a = st.n + 1, b = Math.min(118, st.n + EL_CHUNK), from = Math.max(1, a - EL_CHUNK), before = st.n;
  ui.help(false); await elMeet(ui, a, b); ui.check();
  await elSay(ui, from, b); ui.check();
  elScore(ui, b - from + 1);
  const slips = await elOrder(ui, from, b); ui.check();
  st.tries = (st.tries || 0) + 1; const passed = slips <= 1;
  if (passed) { st.n = b; confetti(40); } saveState();
  await elSummary(ui, a, b, passed); ui.check();
  if (passed) { await elPrizes(ui, before, b); ui.check(); }
  return { passed, n: st.n };
}

/* ----- REWARDS (Tony, 11 October: "the periodic table needs to have a similar reward system as the learning japanese. Small rewards along the way and it needs to be fun!").
   The same principles as the Japanese line: a progress bar while she orders; a cheer at 3, 5, 8 and 12 in a row; a summary after every five, with stars; a daily streak of atoms;
   a row of the table lighting up when she completes it (a row is a period); and every ten elements a medal and a lab gift for her room (the shop's "Lab gifts" shelf, given into her toy box).
   No lives to lose: a slip only means a clue ----- */
const ELS = { total: 0, done: 0, first: 0, asked: 0, combo: 0, best: 0, ui: null };
function elScore(ui, total) { Object.assign(ELS, { total, done: 0, first: 0, asked: 0, combo: 0, best: 0, ui }); ui.steps(total, 0); }
function elTick(ui, ok) {
  if (ELS.ui !== ui || !ui.alive) return; ELS.done = Math.min(ELS.total, ELS.done + 1); ELS.asked++; ui.steps(ELS.total, ELS.done);
  if (!ok) { ELS.combo = 0; return; }
  ELS.first++; ELS.combo++; ELS.best = Math.max(ELS.best, ELS.combo);
  if ([3, 5, 8, 12].includes(ELS.combo)) { sfx.great(); const c = h('div', { class: 'jp-combo el-combo' }, ic('atom-symbol'), ELS.combo + ' in a row!'); ui.root.append(c); Speech.say(pick(['Brilliant!', 'Element-ary!', 'Super scientist!']) + ' ' + ELS.combo + ' in a row!'); setTimeout(() => c.remove(), W.fast ? 10 : 1900); }
}
const elToday = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
function elStreak() { const st = elState(), today = elToday(); if (st.sday === today) return false;
  const y = new Date(); y.setDate(y.getDate() - 1); const yday = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
  st.streak = st.sday === yday ? (st.streak || 0) + 1 : 1; st.sday = today; saveState(); return true; }
const elHold = (p, min, max) => Promise.all([Promise.race([p, wait(max)]), wait(W.fast ? 0 : min)]);   /* a prize screen stays long enough to see with the sound off */
const EL_ROWS = [2, 10, 18, 36, 54, 86, 118], EL_MILES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 118];
const EL_GIFTS = [['test-tube', 'Test tube'], ['goggles', 'Safety goggles'], ['alembic', 'Glass still'], ['magnet', 'Magnet'], ['microscope', 'Microscope'], ['petri-dish', 'Petri dish'],
  ['balance-scale', 'Balance'], ['lab-coat', 'Lab coat'], ['dna', 'DNA model'], ['telescope', 'Telescope'], ['atom-symbol', 'Atom model'], ['rocket', 'Rocket']].map((g, i) => ({ id: 'elg-' + g[0], art: g[0], name: g[1], price: 0, el: EL_MILES[i] }));
/* her place on the table's home screen: how many of 118, her medals, her streak, and the next gift to aim for */
function elHomebar() {
  const st = elState(), n = st.n || 0, got = EL_MILES.filter(m => n >= m), nx = EL_GIFTS.find(g => n < g.el);
  return h('div', { class: 'el-homebar' }, h('div', { class: 'el-prog' }, h('i', { style: { width: (n / 118 * 100).toFixed(1) + '%' } }), h('b', null, n + ' of 118')),
    got.length ? h('div', { class: 'el-medals' }, got.map(m => h('span', { class: 'el-medal' }, ic('sports-medal'), h('b', null, m)))) : null,
    st.streak && st.sday ? h('div', { class: 'jp-streak' }, ic('atom-symbol'), h('b', null, st.streak + (st.streak === 1 ? ' day' : ' days'))) : null,
    nx ? h('div', { class: 'el-next' }, ic(nx.art), h('span', null, 'Next gift at ' + nx.el)) : null);
}
/* the summary after a set: how it went, the stars, the streak */
async function elSummary(ui, a, b, passed, review) {
  const stars = review ? 1 : passed ? 3 : 1; addStars(stars);
  ui.wide(true); ui.clear(); $$('.jp-combo', ui.root).forEach(c => c.remove()); sfx.great(); kiwiMood(ui.root, 'cheer'); ui.steps(ELS.total, ELS.total);
  const newDay = elStreak(), stk = elState().streak || 1;
  ui.stage.append(h('div', { class: 'jp-prize jp-summary el-summary' }, art(passed ? 'atom-symbol' : 'flexed-biceps', 'hero sticker'),
    h('div', { class: 'bigtext' }, review ? 'Numbers ' + a + ' to ' + b + ': done!' : passed ? 'Elements ' + a + ' to ' + b + ': learnt!' : 'Nearly there!'),
    h('div', { class: 'jp-sumrow' }, ELS.asked ? h('span', null, ic('check-mark-button'), ELS.first + ' of ' + ELS.asked + ' right first time') : null, ELS.best >= 3 ? h('span', null, ic('sparkles'), 'Best: ' + ELS.best + ' in a row') : null,
      h('span', null, ic('star'), '+' + stars + (stars === 1 ? ' star' : ' stars')), !review ? h('span', null, ic('test-tube'), elState().n + ' of 118') : null),
    newDay ? h('div', { class: 'jp-streak big' }, Array.from({ length: Math.min(stk, 7) }, () => ic('atom-symbol')), h('b', null, stk === 1 ? 'Day 1. Come back tomorrow!' : stk + ' days in a row!')) : null));
  await Promise.race([ui.prompt(review ? 'All in order! A star for you.' : passed ? 'You can say ' + b + ' elements in order!' : 'Nearly! These five come back next time.',
    (review ? 'All in order. Here is a star.' : passed ? 'Brilliant! You can now put ' + b + ' elements in order.' + (b >= 20 && a <= 20 ? ' That is the first twenty. Next, you can start to group them.' : '') : 'Nearly. Those were tricky, so these ones will come back next time, until they stick. Here is a star for trying.') + (newDay && stk > 1 ? ' And that is ' + stk + ' days in a row!' : '')), wait(4500)]); ui.check();
  await ui.next('Next', ui.stage.firstChild); ui.check();
}
/* passing a row end or a tenth element: the row lights up; a medal; a lab gift */
async function elPrizes(ui, before, after) {
  for (const r of EL_ROWS) if (before < r && after >= r) {
    const p = EL_ROWS.indexOf(r) + 1, table = elTable({ upto: r, on: z => z <= r, colour: elState().g > 2 });
    ui.wide(true); ui.clear(); ui.stage.append(h('div', { class: 'jp-prize el-rowwin' }, h('div', { class: 'el-top' }, table), h('div', { class: 'bigtext' }, 'Row ' + p + ' complete!')));
    ELEMENTS.filter(e => e.period === p).forEach((e, i) => { const c = table.cell(e.z); if (c) { c.style.setProperty('--d', (i * .06).toFixed(2) + 's'); c.classList.add('sweep'); } });
    sfx.great(); confetti(30);
    await elHold(ui.prompt('Row ' + p + ' complete! A row is called a period.', 'You have finished row ' + p + ' of the periodic table. Scientists call a row a period. Every element in a row has the same number of shells for its electrons.'), 2600, 7000); ui.check();
  }
  for (const g of EL_GIFTS) if (before < g.el && after >= g.el) {
    ui.clear(); ui.stage.append(h('div', { class: 'jp-prize' }, h('div', { class: 'el-medalbig' }, ic('sports-medal'), h('b', null, g.el)), h('div', { class: 'bigtext' }, g.el + ' elements!'))); sfx.great(); confetti(40);
    await elHold(ui.prompt('A medal! ' + g.el + ' elements in order!', 'A medal for you! You can put ' + g.el + ' elements in order. That is a real scientist.'), 2600, 5000); ui.check();
    if (!S.owned) S.owned = {}; S.owned[g.id] = true;
    ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-prize' }, art(g.art, 'hero sticker jp-gift-big'), h('div', { class: 'bigtext' }, g.name))); sfx.great();
    ui.prompt('A gift for your room: ' + g.name.toLowerCase() + '!', 'And a present for your room: a ' + g.name.toLowerCase() + '. Find it in your toy box at home.'); await ui.next('Hooray!', ui.stage.firstChild); ui.check();
    addStars(5); saveState();
  }
}

/* ----- grouping, once she has the first twenty. Each game uses only elements she can already put in order.
   1 metal or not; 2 gas or solid; 3 the first column and the last (alkali metals, noble gases); 4 four families by their columns ----- */
const elSortItem = (e, bin, why) => ({ art: { svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="56" height="56" rx="12" fill="#FFF6D6" stroke="#1B2A4E" stroke-width="2.500"/><text x="32" y="43" font-size="28" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + e.sym + '</text></svg>' }, label: e.name, bin, why });
function elGroupGame(lv, n) {
  const known = ELEMENTS.filter(e => e.z <= Math.min(n, 36)), take = (list, k) => shuffle(list).slice(0, k);
  if (lv <= 1) { const m = known.filter(e => e.metal === 'yes'), x = known.filter(e => e.metal === 'no');
    return { kind: 'sort', even: true, text: 'Is it a metal, or not a metal?', say: 'Most elements are metals: shiny, and good at carrying electricity. Some are not. Is this one a metal, or not a metal?', bins: [{ label: 'A metal', icon: 'nut-and-bolt' }, { label: 'Not a metal', icon: 'wind-face' }],
      items: take(m, 4).map(e => elSortItem(e, 0, e.name + ' is a metal. ' + cap1(e.ex || 'it is shiny') + '.')).concat(take(x, 4).map(e => elSortItem(e, 1, e.name + ' is not a metal. ' + cap1(e.ex || 'it is not shiny') + '.'))), done: { text: 'Metals on the left of the table. Non-metals on the right.' } }; }
  if (lv === 2) { const g = known.filter(e => e.state === 'gas'), s = known.filter(e => e.state === 'solid');
    return { kind: 'sort', even: true, text: 'In this room, is it a gas or a solid?', say: 'At the warmth of this room, some elements are gases, and most are solids. Is this one a gas, or a solid?', bins: [{ label: 'A gas', icon: 'balloon' }, { label: 'A solid', icon: 'rock' }],
      items: take(g, 4).map(e => elSortItem(e, 0, e.name + ' is a gas. ' + cap1(e.ex || 'you cannot see it') + '.')).concat(take(s, 4).map(e => elSortItem(e, 1, e.name + ' is a solid. ' + cap1(e.ex || 'you can hold it') + '.'))), done: { text: 'Eight of the first twenty are gases.' } }; }
  if (lv === 3) { const A = known.filter(e => e.fam === 'alk'), G = known.filter(e => e.fam === 'ng');
    return { kind: 'sort', even: true, cols: [1, 18], text: 'First column, or last column?', say: 'The table is built in columns, called groups. The first column is the alkali metals: soft metals that fizz in water. The last column is the noble gases: gases that hardly ever react. Which column is this one in?', bins: [{ label: 'Alkali metals', icon: 'bubbles' }, { label: 'Noble gases', icon: 'balloon' }],
      items: take(A, 3).map(e => elSortItem(e, 0, e.name + ' is in the first column. It fizzes in water.')).concat(take(G, 3).map(e => elSortItem(e, 1, e.name + ' is in the last column. It hardly ever reacts.'))), done: { text: 'A column is a group: a family of elements.' } }; }
  const fams = ['alk', 'ae', 'hal', 'ng'], pool = known.filter(e => fams.includes(e.fam));
  return { kind: 'quiz', items: take(pool, 5), fams };
}
const EL_FAM_HINT = { alk: 'Alkali metals are in column 1, on the far left.', ae: 'Alkaline earth metals are in column 2.', hal: 'Halogens are in column 17, next to the last.', ng: 'Noble gases are in column 18, on the far right.' };
async function elGroup(ui) {
  const st = elState(), lv = clamp((st.g || 0) + 1, 1, 4), game = elGroupGame(lv, st.n); let slips = 0;
  ui.help(false); ui.wide(true);
  if (game.kind === 'sort') {
    /* count the slips by watching the card wobble: ACTS.sort tells her why and lets her choose again */
    const p = ACTS.sort(ui, game), wrap = $('.sortwrap', ui.stage), card = $('.sortcard', ui.stage), table = elTable({ upto: st.n > 20 ? 36 : 20, on: z => z <= Math.max(st.n, 20), colour: lv >= 3 });
    if (wrap) { wrap.classList.add('el-sort'); wrap.prepend(h('div', { class: 'el-top mini' }, table)); if (game.cols) game.cols.forEach(g => ELEMENTS.filter(e => e.group === g && e.z > 1 && table.cell(e.z)).forEach(e => table.cell(e.z).classList.add('band'))); }
    const mo = new MutationObserver(() => { if (card.classList.contains('wobble')) slips++; }); mo.observe(card, { attributes: true, attributeFilter: ['class'] });
    await p; mo.disconnect(); ui.check();
  } else {
    await Promise.race([ui.prompt('Four families. Which one is each element in?', 'Now, four families. The alkali metals are column one. The alkaline earth metals are column two. The halogens are column seventeen. The noble gases are column eighteen, the last one.'), wait(W.fast ? 10 : 9000)]); ui.check();
    for (const e of game.items) { let gone = [];
      const table = () => { const t = elTable({ upto: e.z > 20 ? 36 : 20, on: () => true, colour: false }); t.cell(e.z).classList.add('ask'); return t; };
      for (;;) { const opts = game.fams.map(f => ({ label: EL_FAMILY[f] })), it = { type: 'choice', text: 'Which family is ' + e.name.toLowerCase() + ' in?', options: opts, answer: game.fams.indexOf(e.fam), gone, visual: el => { el.innerHTML = ''; el.append(h('div', { class: 'elx' }, h('div', { class: 'el-top' }, table()))); } };
        ui.wide(false); if (await askItem(ui, it)) { sfx.pop(); break; } slips++; sfx.soft(); gone = gone.concat(it._got); await Promise.race([ui.prompt(EL_FAM_HINT[e.fam]), wait(3200)]); ui.check(); } }
    ui.wide(true);
  }
  st.tries = (st.tries || 0) + 1;
  if (slips <= 1 && (st.g || 0) < 4) { st.g = lv; saveState(); confetti(30); await Promise.race([ui.prompt(lv >= 4 ? 'You know four families of elements!' : 'You are grouping the elements!', lv >= 4 ? 'You know four families of elements, by their columns. That is real chemistry.' : 'Well done. That is one way to group the elements. There are more to come.'), wait(4000)]); }
  else saveState();
  await ui.wait(400); return { passed: slips <= 1 };
}
ACTS.elements = async (ui, d) => {
  const st = elState(); ui.wide(true); ui.help(false);
  if (!st.placed) { await elPlacement(ui); ui.check(); }
  if (d && d.part === 'group' && st.n >= 20) await elGroup(ui); else await elLearn(ui);
};

/* ===== the body atlas. A country adds a system: ATLAS.<id> = { name, icon, need ('greece.m2': the mission that opens it), board (a square picture, 0 to 100 each way),
   parts: [{ id, kind (parts that share a name), label, x, y, w, fact { text, say }, hint { text }, art (for a picture part) }] } ===== */
const ATLAS = {};
const atlasOpen = id => { const a = ATLAS[id]; return WHO === 'test' || !a.need || !!(S.missions[a.need] && S.missions[a.need].done) || !!((S.atlas || {})[id]); };
const atlasState = id => { if (!S.atlas || typeof S.atlas !== 'object') S.atlas = {}; return S.atlas[id] || (S.atlas[id] = { best: 0, n: 0 }); };
const atlasBoard = (sys, cls) => { const board = h('div', { class: 'board at-board ' + (cls || ''), html: sys.board }), spots = {};
  sys.parts.forEach(p => { const s = h('button', { class: 'slot at-spot', 'data-id': p.id, 'aria-label': 'A place on the picture', style: { left: p.x + '%', top: p.y + '%', width: (p.w || 12) + '%', 'aspect-ratio': String(p.ar || 1) } }); s._p = p; spots[p.id] = s; board.append(s); });
  return { board, spots }; };
/* a part is shown as found: a picture part appears in its place; a named part gets a dot where it is and its name beside the picture (lx, ly), at the end of its line */
const atlasFill = (s, p) => { s.classList.add('filled'); s.innerHTML = '';
  if (p.art) s.append(art(p.art));
  else if (p.lx != null) { s.classList.add('dot'); const l = h('div', { class: 'slot tag filled at-lab', 'data-for': p.id, style: { left: p.lx + '%', top: p.ly + '%' } }, p.label); l._p = p; s.parentNode.append(l); }
  else { s.classList.add('tag'); s.style.width = 'auto'; s.style.aspectRatio = 'auto'; s.textContent = p.label; } };
/* "Tap the femur." Every part of the system is a place to tap, and none is named. A wrong tap is marked and the clue is given; the right place is never shown.
   d: system, n (how many to ask), ids (only these), text, say */
ACTS.point = (ui, d) => new Promise(res => {
  const sys = ATLAS[d.system], st = atlasState(d.system), B = atlasBoard(sys, 'point'), kind = p => p.kind || p.id;
  const pool = sys.parts.filter(p => !d.ids || d.ids.includes(p.id)), kinds = shuffle(pool.map(kind).filter((k, i, a) => a.indexOf(k) === i)).slice(0, d.n || 6), ask = kinds.map(k => pool.find(p => kind(p) === k));
  ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'cq at-cq' }, B.board));
  let i = 0, slips = 0, busy = false;
  const nearest = (x, y) => { let best = null, bd = 1e9; sys.parts.forEach(o => { const s = B.spots[o.id]; if (s.classList.contains('filled')) return; const r = s.getBoundingClientRect(), dist = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (dist < bd) { bd = dist; best = s; } }); const br = B.board.getBoundingClientRect(); return bd <= Math.max(30, br.width * .1) ? best : null; };
  const say = () => { const p = ask[i], nm = p.label.toLowerCase(); ui.prompt((d.text || 'Tap the ') + nm + '.', 'Tap the ' + nm + '.'); $$('.at-spot.no', B.board).forEach(s => s.classList.remove('no'));
    W.cur = { type: 'act', auto: () => hit(B.spots[sys.parts.find(q => kind(q) === kind(p) && !B.spots[q.id].classList.contains('filled')).id]), miss: () => { const w = sys.parts.find(q => kind(q) !== kind(p) && !B.spots[q.id].classList.contains('filled') && !B.spots[q.id].classList.contains('no')); hit(B.spots[(w || p).id]); } }; };
  const hit = s => { if (busy || !s || s.classList.contains('filled')) return; const p = ask[i];
    if (kind(s._p) === kind(p)) { sfx.place(); atlasFill(s, s._p); i++; const told = p.fact ? ui.prompt(p.fact.text, p.fact.say) : Promise.resolve();
      if (i >= ask.length) { busy = true; W.cur = null; st.n = (st.n || 0) + 1; st.best = Math.max(st.best || 0, ask.length - Math.min(slips, ask.length)); saveState(); sfx.great(); kiwiMood(ui.root, 'cheer');
        const pr = ui.prompt(slips ? 'You found every one!' : 'Every one, first time. A real doctor!', ' '); Promise.race([pr, wait(2500)]).then(() => setTimeout(() => res(slips), W.fast ? 10 : 900)); return; }
      busy = true; W.cur = null; Promise.race([told, wait(5000)]).then(() => wait(W.fast ? 10 : 500)).then(() => { busy = false; if (ui.alive) say(); }); return; }
    slips++; sfx.soft(); s.classList.add('no'); s.classList.remove('wobble'); void s.offsetWidth; s.classList.add('wobble'); ui.prompt(p.hint ? p.hint.text : 'Not there. Look again.', p.hint && p.hint.say); };
  B.board.addEventListener('click', e => { const t = e.target.closest('.at-spot') || nearest(e.clientX, e.clientY); if (t) hit(t); });
  say();
});

/* ===== practice, from the passport: no mission needed. which: 'elements' or 'atlas' ===== */
const labMenu = (ui, top, buttons, text, say) => new Promise(res => {
  ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; if (typeof top === 'function') top = top(res);   /* a picture that is itself a menu (the Japanese line) gets the resolver */
  const row = h('div', { class: 'lb-row' }, buttons.filter(Boolean).map(b => h('button', { class: 'btn ' + (b.go ? 'go' : 'quiet') + ' lb-b', 'data-k': b.k, onclick: () => { sfx.pop(); res(b.run); } }, b.icon ? ic(b.icon) : null, b.label)));
  ui.stage.append(h('div', { class: 'elx lb' }, top, row)); ui.prompt(text, say);
  W.cur = { type: 'labmenu', pick: k => { const b = $('.lb-b[data-k="' + k + '"]', row) || $('.lb [data-k="' + k + '"]', ui.stage); if (b) b.click(); return !!b; } };
});
async function elemPractice(ui) {
  const st = elState();
  if (!st.placed) { await elPlacement(ui); ui.check(); }
  for (;;) {
    const n = st.n, table = elTable({ upto: Math.max(n + 1, 10), on: z => z <= n, colour: st.g > 2 });
    const run = await labMenu(ui, h('div', { class: 'el-home' }, h('div', { class: 'el-top' }, table), elHomebar()), [
      n < 118 ? { k: 'next', go: true, icon: 'sparkles', label: n ? 'The next five' : 'The first five', run: () => elLearn(ui) } : null,
      n ? { k: 'say', icon: 'speaking-head', label: 'Say them all', run: () => elSay(ui, 1, n) } : null,
      n ? { k: 'chant', icon: 'musical-notes', label: 'Say them with me', run: () => elChant(ui, 1, n) } : null,
      n >= 6 ? { k: 'order', icon: 'input-numbers', label: 'Put some in order', run: async () => { const a = rnd(1, Math.max(1, n - 7)), b = Math.min(n, a + 7); elScore(ui, b - a + 1); await elOrder(ui, a, b, { review: true }); ui.check(); await elSummary(ui, a, b, true, true); } } : null,
      n >= 20 ? { k: 'group', icon: 'puzzle-piece', label: 'Group them', run: async () => { const r = await elGroup(ui); if (r.passed) addStars(3); } } : null],
      n ? 'You know ' + n + ' of 118 elements in order.' : 'The periodic table: every element there is.', n ? 'You know ' + n + ' of the 118 elements in order. What would you like to do?' : 'This is the periodic table. It lists every element there is.');
    ui.check(); await run(); ui.check();
  }
}
async function atlasPractice(ui) {
  for (;;) {
    const ids = Object.keys(ATLAS), cards = h('div', { class: 'lb-sys' });
    const run = await new Promise(res => {
      ui.wide(true); ui.help(false); ui.stage.innerHTML = '';
      ids.forEach(id => { const a = ATLAS[id], open = atlasOpen(id);
        cards.append(h('button', { class: 'shop-item lb-card' + (open ? '' : ' lock'), 'data-sys': id, onclick: () => { if (!open) { sfx.soft(); Speech.say('Play ' + (COUNTRIES[a.cid] ? COUNTRIES[a.cid].name : 'that country') + ' to open this page.'); return; } sfx.pop(); res(() => atlasPage(ui, id)); } },
          art(open ? a.icon : 'locked', open ? 'sticker' : ''), h('span', { class: 'nm' }, a.name), h('span', { class: 'pr' }, open ? (atlasState(id).n ? 'Best: ' + atlasState(id).best : 'Open') : 'Locked'))); });
      ui.stage.append(h('div', { class: 'elx lb' }, cards)); ui.prompt('Your body atlas. Pick a page.', 'This is your body atlas. Each country adds a page. Pick one.');
      W.cur = { type: 'labmenu', pick: k => { const b = $('.lb-card[data-sys="' + k + '"]', cards); if (b) b.click(); return !!b; } };
    });
    ui.check(); await run(); ui.check();
  }
}
/* one page of the atlas: every part named. Tap a name to hear about it; then "Test me" */
function atlasPage(ui, id) {
  return new Promise(res => {
    const sys = ATLAS[id], B = atlasBoard(sys, 'page'); sys.parts.forEach(p => atlasFill(B.spots[p.id], p));
    ui.stage.innerHTML = ''; const bar = h('div', { class: 'lb-row' },
      h('button', { class: 'btn go lb-b', 'data-k': 'test', onclick: async () => { sfx.pop(); W.cur = null; try { const slips = await ACTS.point(ui, { system: id, n: Math.min(8, sys.parts.length) }); if (!slips) addStars(3); } catch (e) { if (e !== ABORT) throw e; return; } res(); } }, ic('stethoscope'), 'Test me'),
      h('button', { class: 'btn quiet lb-b', 'data-k': 'back', onclick: () => { sfx.tap(); res(); } }, 'Back'));
    ui.stage.append(h('div', { class: 'elx lb' }, h('div', { class: 'cq at-cq' }, B.board), bar));
    B.board.addEventListener('click', e => { const s = e.target.closest('.at-spot, .at-lab'); if (!s) return; sfx.tap(); const p = s._p; $$('.sel', B.board).forEach(x => x.classList.remove('sel')); s.classList.add('sel'); ui.prompt(p.fact ? p.fact.text : p.label, p.fact ? [p.label + '.', p.fact.say || p.fact.text] : p.label); });
    ui.prompt(sys.name + '. Tap a name to hear about it.', sys.name + '. Tap any name to hear about it. Then press Test me.');
    W.cur = { type: 'labmenu', pick: k => { const b = $('.lb-b[data-k="' + k + '"]', bar); if (b) b.click(); return !!b; } };
  });
}
SCREENS.labbook = which => {
  const ui = makeUI(() => go('passport')); show(ui.root); ui.root.classList.add('c-lab'); W.cheers = [];
  (async () => { try { if (which === 'atlas') await atlasPractice(ui); else await elemPractice(ui); } catch (e) { if (e !== ABORT) { console.error(e); throw e; } } })();
};
