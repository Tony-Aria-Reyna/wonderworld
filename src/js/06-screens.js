/* ===== screens: title, world map, country path, passport, grown-ups ===== */
const SCREENS = {};
function show(el) { const a = $('#app'); a.innerHTML = ''; a.append(el); }
function go(name, arg) { if (activeUI) { activeUI.dispose(); activeUI = null; } W.cur = null; Speech.stop(); $$('.overlay').forEach(o => o.remove()); SCREENS[name](arg); }

const WORLD = [
  { id: 'egypt', name: 'Egypt', iso: '818', flag: 'eg' }, { id: 'japan', name: 'Japan', iso: '392', flag: 'jp' },
  { id: 'greece', name: 'Greece', iso: '300', flag: 'gr' }, { id: 'nz', name: 'New Zealand', iso: '554', flag: 'nz' },
  { id: 'netherlands', name: 'the Netherlands', iso: '528', flag: 'nl' }, { id: 'india', name: 'India', iso: '356', flag: 'in' },
  { id: 'china', name: 'China', iso: '156', flag: 'cn' }, { id: 'italy', name: 'Italy', iso: '380', flag: 'it' },
  { id: 'france', name: 'France', iso: '250', flag: 'fr' }, { id: 'brazil', name: 'Brazil', iso: '076', flag: 'br' },
  { id: 'kenya', name: 'Kenya', iso: '404', flag: 'ke' }, { id: 'australia', name: 'Australia', iso: '036', flag: 'au' },
  { id: 'russia', name: 'Russia', iso: '643', flag: 'ru' }, { id: 'canada', name: 'Canada', iso: '124', flag: 'ca' }
];
W.WORLD = WORLD;
const PLANT = [[0, 'seedling', 'Seedling'], [30, 'potted-plant', 'Little plant'], [80, 'herb', 'Leafy plant'], [150, 'deciduous-tree', 'Tree'], [260, 'cherry-blossom', 'Blossom tree']];
function plantStage() { let s = 0; PLANT.forEach((p, i) => { if (S.life >= p[0]) s = i; }); return s; }
function countryDone(cid) { const c = COUNTRIES[cid]; return c && c.missions.every(m => S.missions[cid + '.' + m.id] && S.missions[cid + '.' + m.id].done); }
/* countries open one at a time, in this order (Tony, 29 October: "The over all structure of the game should only allow the kid to unlock each country as they pass each one").
   The next opens when every mission of the one before is done. A country already started stays open, so no saved progress is shut away; the test player sees every country.
   A new country goes on the end of ORDER */
const ORDER = ['egypt', 'nz', 'japan', 'australia', 'russia', 'brazil', 'france', 'greece', 'canada', 'china'];
const countryStarted = cid => !!COUNTRIES[cid] && COUNTRIES[cid].missions.some(m => (S.missions[cid + '.' + m.id] || {}).done);
function countryOpen(cid) {
  if (!COUNTRIES[cid]) return false; if (WHO === 'test') return true;
  const i = ORDER.indexOf(cid); return i <= 0 || countryStarted(cid) || countryDone(ORDER[i - 1]);
}
const countryBefore = cid => { const i = ORDER.indexOf(cid); return i > 0 ? COUNTRIES[ORDER[i - 1]] : null; };
const countryAfter = cid => { const i = ORDER.indexOf(cid); return i >= 0 && i < ORDER.length - 1 ? COUNTRIES[ORDER[i + 1]] : null; };
/* the bonus areas: Japanese once Japan is reached (or already started), the Code Lab from the start */
const jpOpen = () => WHO === 'test' || countryOpen('japan') || jpState().st > 0 || Object.keys(jpState().met || {}).length > 0;

function hud(extra) {
  return h('div', { class: 'hud' },
    h('div', { class: 'pill' }, ic('star'), h('span', { class: 'starcount' }, S.stars)),
    h('div', { class: 'sp' }), extra || null,
    h('button', { class: 'round', 'aria-label': 'Sound on or off', onclick: e => { S.sound = !S.sound; saveState(); if (!S.sound) Speech.stop(); e.currentTarget.innerHTML = ''; e.currentTarget.append(ic(S.sound ? 'speaker-high-volume' : 'muted-speaker')); } }, ic(S.sound ? 'speaker-high-volume' : 'muted-speaker')));
}

/* ---------- title ---------- */
SCREENS.title = () => {
  if (!S.name) return go('welcome');   /* first launch on this device: the Welcome guide asks the player's name */
  const letters = 'WonderWorld'.split('').map((c, i) => h('span', { style: { 'animation-delay': (i * .09) + 's' } }, c));
  show(h('div', { class: 'screen title' },
    ic('globe-showing-europe-africa', 'globe sticker'), h('h1', null, letters),
    h('div', { class: 'hi' }, 'Hi ' + S.name + '! Ready to explore?'),
    h('button', { class: 'btn go big', onclick: () => { ac(); sfx.great(); go('map'); } }, 'Play'), h('button', { class: 'btn quiet about-b', onclick: () => { sfx.tap(); go('about', 'title'); } }, ic('information'), 'About')));
  W.cur = { type: 'btn', auto: () => $('.title .btn').click() };
};

/* ---------- world map ----------
   The map can be dragged about and zoomed (panZoom), and it starts on the country that is next.
   Flags keep their size as the map grows, so zooming in pulls a crowd of them apart. They also make room for each other:
   place() nudges any two that touch until none do, and draws a line from a flag that had to move back to its own country.
   So a new country needs no hand-set flag position. */
const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
SCREENS.map = () => {
  let land = '', shade = '';
  const activeIso = {}, soonIso = {}; WORLD.forEach(w => { (COUNTRIES[w.id] ? activeIso : soonIso)[w.iso] = 1; });
  for (const id in MAP.c) { land += '<path class="land' + (activeIso[id] ? ' on' : soonIso[id] ? ' soon' : '') + '" d="' + MAP.c[id].d + '"/>'; shade += MAP.c[id].d; }
  const wrap = h('div', { class: 'map-wrap' }), view = h('div', { class: 'pz-view map-view' }, wrap), bub = bubble('', '');
  wrap.innerHTML = '<svg class="map-land" viewBox="0 0 ' + MAP.w + ' ' + MAP.h + '" xmlns="http://www.w3.org/2000/svg"><path class="land-sh" transform="translate(0 2.500)" d="' + shade + '"/>' + land + '</svg><svg class="map-lines" xmlns="http://www.w3.org/2000/svg"></svg>';
  const lines = $('.map-lines', wrap);
  const pins = WORLD.map(w => {
    const on = !!COUNTRIES[w.id], open = on && countryOpen(w.id), fin = on && countryDone(w.id), lbl = h('span', { class: 'lbl' }, cap(w.name).replace(/^The /, ''));
    /* a finished country carries a trophy and a gold ring; a country not yet open shows a lock and says which one opens it */
    const b = h('button', { class: 'pin ' + (on ? 'on' : 'soon') + (on && !open ? ' locked' : '') + (fin ? ' done' : ''), 'data-id': w.id, 'aria-label': w.name + (fin ? ', finished' : on && !open ? ', locked' : ''),
      onclick: () => { if (open) { sfx.great(); go('country', w.id); } else if (on) { sfx.soft(); const pv = countryBefore(w.id); bub.set('Finish ' + pv.name + ' first. Then ' + cap(w.name) + ' opens!'); } else { sfx.tap(); bub.set(cap(w.name) + ' is coming soon!'); } } },
      h('img', { src: flag(w.flag), alt: '' }), lbl, fin ? ic('trophy', 'pin-done') : on && !open ? ic('locked', 'pin-lock') : null);
    wrap.append(b); return { w, on, b, lbl, at: MAP.pt[w.id] };
  });
  const st = PLANT[plantStage()];
  const hudEl = hud([h('button', { class: 'pill', 'aria-label': 'My room', onclick: () => { sfx.tap(); go('room'); } }, ic('house-with-garden'), h('span', { class: 'lbl' }, 'My room')),
    h('button', { class: 'pill', 'aria-label': 'My passport', onclick: () => { sfx.tap(); go('passport'); } }, ic(st[1]), h('span', { class: 'lbl' }, 'Passport')),
    h('button', { class: 'round', 'aria-label': 'For grown-ups', onclick: () => { sfx.tap(); go('parent'); } }, ic('gear'))]);
  /* the bonus row under the top bar, labelled so it is clear what each one is (Tony, 29 October: "The coding and japanese icon at the top needs to be highlighted as a bonus section and clearly identify what it is").
     Japanese lives in Japan: its button joins the row once Japan is reached. A dot shows until today's Japanese ride */
  const bonus = h('div', { class: 'bonus-row' }, h('span', { class: 'bonus-tag' }, ic('sparkles'), 'Bonus'),
    jpOpen() ? h('button', { class: 'bonus-b jp-pill' + (jpState().day === jpToday() ? '' : ' due'), 'data-k': 'nihongo', 'aria-label': 'Bonus: Japanese', onclick: () => { sfx.tap(); go('nihongo'); } }, ic('japanese-symbol-for-beginner'), h('span', null, 'Japanese', h('small', { class: 'jp' }, 'にほんご'))) : null,
    h('button', { class: 'bonus-b cd-pill', 'data-k': 'code', 'aria-label': 'Bonus: Code Lab', onclick: () => { sfx.tap(); go('code'); } }, ic('robot'), h('span', null, 'Code Lab', h('small', null, 'Coding'))));
  const foot = h('div', { class: 'map-foot' }, kiwi(), bub);
  /* how big the map may be. It never gets so small that the flags cover it, and it starts big enough to tell the countries apart */
  const limits = (vw, vh) => {
    const r = remPx(), m = 3.4 * r, top = bonus.offsetTop + bonus.offsetHeight + .3 * r, bot = foot.offsetHeight, ext = [m, .6 * r, m, 1.8 * r];
    const fit = Math.max(12 * r, Math.min(vw - 2 * m, (vh - top - bot - ext[1] - ext[3]) * MAP.w / MAP.h));
    const start = Math.max(fit, vh > vw ? Math.min(70 * r, .62 * vh * MAP.w / MAP.h) : Math.min(vw - 2 * m, 52 * r));
    return { min: Math.max(fit, Math.min(40 * r, start)), start, max: 3 * Math.max(start, 52 * r), pad: [0, top, 0, bot], ext };
  };
  const place = () => {
    const L = pz.lim(), W0 = pz.st.w, H0 = W0 * MAP.h / MAP.w, k = W0 / MAP.w, r = remPx(), ps = clamp(W0 / (52 * r), .72, 1), gap = .4 * r;
    wrap.style.setProperty('--ps', ps.toFixed(3));
    const B = pins.map(p => { const d = (p.on ? 4.6 : 2.7) * r * ps, x = p.at[0] * k, y = p.at[1] * k;
      return { p, d, ax: x, ay: y, x, y, hw: Math.max(d, p.lbl.offsetWidth) / 2 + gap, up: d / 2 + gap, dn: d / 2 + .3 * r + p.lbl.offsetHeight + gap }; });
    const bound = () => B.forEach(b => { b.x = clamp(b.x, -L.ext[0] + b.hw, W0 + L.ext[2] - b.hw); b.y = clamp(b.y, -L.ext[1] + b.up, H0 + L.ext[3] - b.dn); });
    /* any two that touch move apart along the side that needs less. A country that is open keeps closer to its place than one still to come */
    const apart = () => { let hit = false;
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j];
        const ox = a.hw + b.hw - Math.abs(a.x - b.x), oy = Math.min(a.y + a.dn, b.y + b.dn) - Math.max(a.y - a.up, b.y - b.up);
        if (ox <= .5 || oy <= .5) continue; hit = true; const wa = a.p.on === b.p.on ? .5 : a.p.on ? .25 : .75;
        if (ox < oy) { const sg = (a.x - b.x || a.ax - b.ax || i - j) < 0 ? -1 : 1; a.x += sg * ox * wa; b.x -= sg * ox * (1 - wa); }
        else { const sg = ((a.y + (a.dn - a.up) / 2) - (b.y + (b.dn - b.up) / 2) || a.ay - b.ay || i - j) < 0 ? -1 : 1; a.y += sg * oy * wa; b.y -= sg * oy * (1 - wa); } }
      return hit; };
    for (let n = 0; n < 160; n++) { B.forEach(b => { b.x += (b.ax - b.x) * .04; b.y += (b.ay - b.y) * .04; }); apart(); bound(); }
    for (let n = 0; n < 400 && apart(); n++) bound();       /* then no pull at all, until nothing touches: with eight open countries a crowd needs more rounds than it did with seven */
    let ln = '';
    B.forEach(b => { b.p.b.style.left = b.x.toFixed(1) + 'px'; b.p.b.style.top = b.y.toFixed(1) + 'px';
      if (Math.hypot(b.x - b.ax, b.y - b.ay) > b.d * .4) ln += '<line x1="' + b.ax.toFixed(1) + '" y1="' + b.ay.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/><circle cx="' + b.ax.toFixed(1) + '" cy="' + b.ay.toFixed(1) + '" r="' + (.22 * r).toFixed(1) + '"/>'; });
    lines.innerHTML = ln;
  };
  const pz = panZoom(view, wrap, { ratio: MAP.h / MAP.w, limits, on: (s, zoomed) => { if (zoomed) place(); } });
  show(h('div', { class: 'screen map' }, h('div', { class: 'wave' }), view, hudEl, bonus, foot, pz.ctl, Object.values(pz.arrows)));
  const active = ORDER.map(id => WORLD.find(w => w.id === id)).filter(w => w && COUNTRIES[w.id] && countryOpen(w.id)), fresh = S.played ? active.find(w => !countryStarted(w.id)) : null;
  const todo = fresh || active.find(w => !countryDone(w.id)) || active[active.length - 1];
  const plain = S.played && !fresh && S.stars < 20;
  bub.set(!S.played ? 'Tap ' + todo.name + ' to start!' : fresh ? cap(fresh.name) + ' is open! Tap it to explore.' : !plain ? 'You have ' + S.stars + ' stars. Spend them in your room!' : 'Where shall we go, ' + S.name + '?');
  /* start on the country that is next. Where the map is bigger than the screen, the guide says how to move it (the bubble's height is part of the sum, so the map is placed again) */
  const home = MAP.pt[todo.id]; pz.reset(home[0] / MAP.w, home[1] / MAP.h);
  if (plain && pz.more()) { bub.set('Where shall we go, ' + S.name + '? Slide the map to look around.'); pz.reset(home[0] / MAP.w, home[1] / MAP.h); }
  W.cur = { type: 'map', pz, auto: id => $('.pin[data-id="' + (id || todo.id) + '"]', wrap).click(), bonus: k => { const b = $('.bonus-b[data-k="' + k + '"]', bonus); if (b) b.click(); return !!b; } };
};
const cap = s => s.replace(/^the /, 'The ');

/* ---------- a country: the path of missions ---------- */
SCREENS.country = cid => {
  const c = COUNTRIES[cid], done = id => !!(S.missions[cid + '.' + id] && S.missions[cid + '.' + id].done), have = S.videos[cid] || {};
  const portrait = window.innerHeight > window.innerWidth;
  const layer = h('div', { class: 'path-layer' }), bub = bubble('', '');
  let prevDone = true, nextUp = null; const pts = [];
  c.path.forEach(n => {
    const x = portrait ? n.px : n.x, y = portrait ? n.py : n.y; pts.push([x, y]);
    let state, iconArt, name, click;
    if (n.video) {
      const g = c.gates.find(g => g.id === n.video), ids = g.give || g.choose, got = ids.filter(v => have[v]).length, ready = g.after.every(done);
      state = got ? 'open' : 'locked'; iconArt = 'clapper-board'; name = got ? 'Watch!' : 'Video';
      click = () => { if (got) { sfx.tap(); cinema(cid); } else { sfx.soft(); bub.set(ready ? 'Open your ticket on the path!' : 'Finish the missions before it to win this video.'); } };
    } else if (n.soon) {     /* a mission that is planned but not built yet: it shows on the path, greyed, so she can see what is coming. It cannot be played */
      state = 'locked soon'; iconArt = n.icon; name = n.soon; click = () => { sfx.soft(); bub.set('That one is coming soon!'); };
    } else {
      const m = c.missions.find(m => m.id === n.m), d = done(m.id), rec = S.missions[cid + '.' + m.id];
      state = d ? 'done' : (prevDone || WHO === 'test') ? 'open' : 'locked'; iconArt = m.icon; name = m.name;
      if (state === 'open' && !nextUp) nextUp = m;
      click = () => { if (state === 'locked') { sfx.soft(); bub.set('Finish the one before it first.'); } else { sfx.pop(); runMission(cid, m.id); } };
      prevDone = d;
      n._badge = d ? (rec.gold ? '1st-place-medal' : 'check-mark-button') : null;
    }
    layer.append(h('button', { class: 'node ' + state + (n.video ? ' video' : ''), 'data-n': n.m || n.video || 'soon', style: { left: x + '%', top: y + '%' }, onclick: click },
      h('div', { class: 'disc' }, art(iconArt), n._badge ? ic(n._badge, 'badge') : null, state === 'locked' && !n.video ? ic('locked', 'badge') : n.soon ? ic('hourglass-not-done', 'badge') : null), h('span', { class: 'nm' }, name)));
  });
  const trail = '<svg class="scene" viewBox="0 0 100 100" preserveAspectRatio="none" style="pointer-events:none"><polyline class="trail" vector-effect="non-scaling-stroke" points="' + pts.map(p => p.join(',')).join(' ') + '"/></svg>';
  const scr = h('div', { class: 'screen country' },
    h('div', { html: c.scene, style: { position: 'absolute', inset: '0' } }), h('div', { html: trail, style: { position: 'absolute', inset: '0' } }),
    h('div', { class: 'topbar' }, h('button', { class: 'round', 'aria-label': 'Back to the world map', onclick: () => { sfx.tap(); go('map'); } }, ic('world-map')),
      h('h2', null, c.name),
      /* a country's bonus area, in its top bar (Japan: the Japanese line and Kenta's Town, which live in Japan) */
      (c.bonus || []).length ? h('div', { class: 'bonus-row in-country' }, h('span', { class: 'bonus-tag' }, ic('sparkles'), 'Bonus'), c.bonus.map(x => h('button', { class: 'bonus-b', 'data-k': x.go, 'aria-label': 'Bonus: ' + x.label, onclick: () => { sfx.tap(); go(x.go); } }, ic(x.icon), h('span', null, x.label, x.jp ? h('small', { class: 'jp' }, x.jp) : null)))) : null,
      h('div', { class: 'pill' }, ic('star'), h('span', { class: 'starcount' }, S.stars))),
    layer, h('div', { class: 'foot' }, kiwi('', cid), bub));
  scr._cid = cid; scr._portrait = portrait; show(scr);
  if (nextUp && !c.missions.some(m => done(m.id))) bub.set(c.hello, c.helloSay); else bub.set(nextUp ? 'Next up: ' + nextUp.name.replace(/!$/, '') + '!' : c.path.some(n => n.soon) ? 'More of ' + c.name + ' is coming soon!' : countryAfter(cid) ? 'You finished ' + c.name + '! ' + countryAfter(cid).name + ' is open on the map.' : 'You finished ' + c.name + '! Play again for gold stamps.', nextUp && nextUp.nameSay ? ['Next up:', nextUp.nameSay] : null);
  W.cur = { type: 'country', next: nextUp && nextUp.id, auto: id => $('.node[data-n="' + (id || nextUp.id) + '"]', layer).click(), bonus: k => { const b = $('.bonus-b[data-k="' + k + '"]', scr); if (b) b.click(); return !!b; } };
};
window.addEventListener('resize', () => { const s = $('.screen.country'); if (s && s._cid && s._portrait !== (window.innerHeight > window.innerWidth)) SCREENS.country(s._cid); });

function cinema(cid) {
  const c = COUNTRIES[cid], have = S.videos[cid] || {};
  const o = overlay(h('div', { class: 'card' }, h('h3', null, c.name + ' videos'),
    h('div', { class: 'vids' }, Object.keys(c.videos).map(id => { const v = c.videos[id], got = !!have[id];
      return h('button', { class: 'vid' + (got ? '' : ' locked'), onclick: () => { if (got) { sfx.pop(); o.remove(); playVideo(v); } else { sfx.soft(); Speech.say('Win a gold stamp to open this one.'); } } }, art(got ? v.icon : 'locked'), v.title, h('small', null, got ? v.by : 'Win a gold stamp')); })),
    h('button', { class: 'btn quiet', onclick: () => { sfx.tap(); o.remove(); } }, 'Close')));
}

/* ---------- passport ---------- */
SCREENS.passport = () => {
  const si = plantStage(), st = PLANT[si], nx = PLANT[si + 1];
  const cards = [h('div', { class: 'pp-card' }, h('h4', null, 'My plant'), h('div', { class: 'plant' }, ic(st[1]), h('div', { style: { flex: '1' } }, h('div', { style: { 'font-weight': '700', 'font-size': '1.3rem' } }, st[2]),
    h('div', { class: 'bar' }, h('i', { style: { width: (nx ? clamp((S.life - st[0]) / (nx[0] - st[0]) * 100, 4, 100) : 100) + '%' } })), h('div', null, nx ? (nx[0] - S.life) + ' more stars to grow' : 'Fully grown!'))))];
  /* her lab book: the periodic table and the body atlas, to practise any day (068-spine.js) */
  const en = elState().n, pages = Object.keys(ATLAS).filter(atlasOpen).length;
  cards.push(h('div', { class: 'pp-card pp-lab' }, h('h4', null, 'My lab book'),
    h('div', { class: 'pp-labs' },
      h('button', { class: 'btn quiet', 'data-lab': 'elements', onclick: () => { sfx.pop(); go('labbook', 'elements'); } }, ic('test-tube'), h('span', null, 'Periodic table', h('small', null, en ? en + ' of 118 in order' : 'Start here'))),
      h('button', { class: 'btn quiet', 'data-lab': 'atlas', onclick: () => { sfx.pop(); go('labbook', 'atlas'); } }, ic('stethoscope'), h('span', null, 'Body atlas', h('small', null, pages + (pages === 1 ? ' page open' : ' pages open')))),
      h('button', { class: 'btn quiet' + (jpOpen() ? '' : ' locked'), 'data-lab': 'nihongo', onclick: () => { if (!jpOpen()) { sfx.soft(); Speech.say('Japanese opens when you reach Japan on the map.'); return; } sfx.pop(); go('nihongo'); } }, ic(jpOpen() ? 'japanese-symbol-for-beginner' : 'locked'), h('span', null, 'Japanese', h('small', null, !jpOpen() ? 'Opens in Japan' : jpState().st ? jpState().st + ' of ' + JP_N + ' stations' : 'Start here'))),
      h('button', { class: 'btn quiet', 'data-lab': 'code', onclick: () => { sfx.pop(); go('code'); } }, ic('robot'), h('span', null, 'Code Lab', h('small', null, cdState().st ? cdState().st + ' of ' + CD_ST.length + ' stations' : 'Start here'))))));
  WORLD.forEach(w => { const c = COUNTRIES[w.id]; if (!c) return;
    cards.push(h('div', { class: 'pp-card' }, h('h4', null, h('img', { src: flag(w.flag), alt: '' }), c.name),
      h('div', { class: 'pp-stk' }, c.missions.map(m => { const r = S.missions[w.id + '.' + m.id]; return art(m.sticker, 'sticker' + (r && r.done ? '' : ' off')); })),
      h('div', null, c.missions.filter(m => (S.missions[w.id + '.' + m.id] || {}).gold).length + ' gold stamps of ' + c.missions.length))); });
  show(h('div', { class: 'screen passport' }, h('div', { class: 'topbar act-top' }, h('button', { class: 'round', 'aria-label': 'Back to the map', onclick: () => { sfx.tap(); go('map'); } }, ic('world-map')), h('h2', null, S.name + "'s passport"), h('div', { class: 'pill' }, ic('star'), h('span', { class: 'starcount' }, S.stars))),
    h('div', { class: 'pp-body' }, cards)));
  W.cur = { type: 'passport', lab: k => $('.pp-labs [data-lab="' + k + '"]').click() };
};

/* ---------- grown-ups ---------- */
const STRANDS = { number: 'Number and calculation', patterns: 'Patterns and logic', geometry: 'Geometry and measurement', data: 'Statistics and data', science: 'Science', world: 'Language and world' };
SCREENS.parent = () => {
  const top = h('div', { class: 'topbar' }, h('button', { class: 's', onclick: () => go('map'), style: { padding: '.4rem 1rem', 'border-radius': '.6rem', background: '#EEF0F6' } }, '← Back to the game'), h('h2', null, 'For grown-ups'));
  const body = h('div', { class: 'pa-body' });
  show(h('div', { class: 'screen parent' }, top, body));
  let entry = '';
  const pinpad = (title, cb) => {
    body.innerHTML = ''; entry = '';
    const dots = h('div', { class: 'dots' }, '');
    const press = k => { if (k === 'del') entry = entry.slice(0, -1); else if (entry.length < 4) entry += k; dots.textContent = '●'.repeat(entry.length); if (entry.length === 4) setTimeout(() => cb(entry), 150); };
    body.append(h('div', { class: 'pinpad' }, h('h3', null, title), dots, h('div', { class: 'np', style: { 'grid-template-columns': 'repeat(3,1fr)', width: '15rem' } }, ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => h('button', { onclick: () => press(d) }, d)), h('button', { class: 'del', html: BACKSPACE, onclick: () => press('del') }), h('button', { onclick: () => press('0') }, '0'))));
  };
  const askPin = title => pinpad(title, p => { if (p === S.pin) dash(); else askPin('Not that one. Enter your PIN'); });
  if (!S.pin) pinpad('Choose a 4-digit PIN for this page', p => { S.pin = p; saveState(); dash(); });
  else askPin('Enter your PIN');
  /* ----- real voices for languages no device can speak: record with the microphone, or choose a sound file ----- */
  const groupsOf = vc => vc.groups || [{ title: '', words: vc.words }];
  const saveVoices = () => { const blob = new Blob([JSON.stringify(Speech.clips())], { type: 'application/json' }), a = h('a', { href: URL.createObjectURL(blob), download: 'wonderworld-voices.json' }); document.body.append(a); a.click(); a.remove(); };
  function voiceRows() {
    const out = [];
    for (const cid in COUNTRIES) { const vc = COUNTRIES[cid].voices; if (!vc || Speech.native(vc.lang)) continue;
      const mineOf = w => !!(Speech.clips()[vc.lang] || {})[Speech.key(w)];
      const have = vc.words.filter(w => Speech.clip(vc.lang, w)).length, mineN = vc.words.filter(mineOf).length, note = h('p', { class: 'note' }, '');
      const rows = [];
      groupsOf(vc).forEach(g => { if (g.title) rows.push(h('tr', { class: 'grp' }, h('th', { colspan: 3 }, g.title)));
        g.words.forEach(w => {
          const row = h('tr', { class: 'w' }), paint = msg => { const mine = mineOf(w), any = !!Speech.clip(vc.lang, w); row.innerHTML = '';
            const file = h('input', { type: 'file', accept: 'audio/*', style: { display: 'none' }, onchange: e => { const f = e.target.files[0]; if (f) tidyClip(f).then(u => { Speech.setClip(vc.lang, w, u) ? paint('Saved.') : paint('Could not save: storage is full.'); }).catch(() => paint('That file could not be read as sound.')); } });
            row.append(h('td', { style: { 'font-weight': '600', 'font-size': '1.1rem' } }, w, vc.means && vc.means[w] ? h('small', { style: { 'font-weight': '400', color: 'var(--ink-soft)', 'margin-left': '.5rem' } }, vc.means[w]) : null), h('td', null, msg || (mine ? 'Your recording' : any ? 'Built into the game' : 'No voice yet: shown, not spoken')),
              h('td', null, h('button', { class: 's', onclick: () => { paint('Get ready…'); recordClip(st => paint(st)).then(u => { Speech.setClip(vc.lang, w, u) ? paint('Saved.') : paint('Could not save: storage is full.'); Speech.playClip(u); }).catch(() => paint('No microphone here. Use "Choose a sound file", or start the game with Play WonderWorld.')); } }, mine ? 'Record again' : 'Record'),
                h('button', { class: 's', onclick: () => file.click() }, 'Choose a sound file'), file,
                any ? h('button', { class: 's', onclick: () => Speech.playClip(Speech.clip(vc.lang, w)) }, 'Play') : null,
                mine ? h('button', { class: 's', onclick: () => { Speech.setClip(vc.lang, w, null); paint(); } }, 'Remove') : null)); };
          paint(); rows.push(row); }); });
      const load = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' }, onchange: e => { const f = e.target.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => { try { const o = JSON.parse(fr.result); let n = 0; for (const lang in o) for (const k in o[lang]) if (/^data:audio\//.test(o[lang][k])) { Speech.setClip(lang, k, o[lang][k]); n++; } dash(); } catch (err) { note.textContent = 'That file is not a WonderWorld voices file.'; } }; fr.readAsText(f); } });
      out.push(h('h3', null, 'Your voice for ' + vc.label + ' (' + mineN + ' of ' + vc.words.length + ' recorded' + (have > mineN ? ', ' + (have - mineN) + ' more built in' : '') + ')'),
        h('p', { class: 'note' }, 'No laptop, tablet or phone has a ' + vc.label + ' voice, and the game will not fake one with an English voice. Every ' + vc.label + ' word is said by a real recording: yours. Until a word has one it is shown for ' + S.name + ' to read, not spoken. "Record all the words" takes you through them one at a time, about three minutes in all. Say each word clearly, once; silence at each end is trimmed off. Your recording always replaces one built into the game.'),
        h('div', null, h('button', { class: 's go', onclick: () => studio(vc) }, mineN ? 'Record the words (carry on or redo)' : 'Record all the words')),
        h('table', null, rows),
        h('div', null, h('button', { class: 's', onclick: saveVoices }, 'Save the recordings to a file'),
          h('button', { class: 's', onclick: () => load.click() }, 'Load recordings from a file'), load),
        h('p', { class: 'note' }, 'Recordings stay in this browser on this device. To use them on the tablet or phone, save them to a file here and load that file there. Or put the file in the Education Apps folder and ask Claude to build the voices into the game itself, so every device has them.'), note);
    }
    return out;
  }
  /* JAPANESE WITH THE FAMILY (approved 11 October: a Japanese-speaking family member will talk with her and record). This week's talk card, three phrases from the place
     she is on in Kenta's Town, to copy into a message or print; and the recording studio for Japanese: a family member's voice replaces the computer's for any line they record */
  function jpFamilyRows() {
    const c = townCard(), said = h('span', { class: 'note' });
    const card = h('div', { class: 'tw-card' }, h('h4', null, "Talk card: Kenta's Town, " + c.P.name.toLowerCase()), h('p', { class: 'note' }, c.P.teaches),
      h('table', null, c.rows.map(r => [h('tr', { class: 'tw-q' }, h('td', { class: 'jp', lang: 'ja' }, r[0]), h('td', { class: 'note' }, jpRom(r[0])), h('td', null, r[1])),
        h('tr', { class: 'tw-a' }, h('td', { class: 'jp', lang: 'ja' }, '→ ' + r[2]), h('td', { class: 'note' }, jpRom(r[2].replace('＿', ''))), h('td', null, r[3]))]).flat()),
      h('p', null, c.tip));
    const copy = () => { const t = townCardText(), ok = () => { said.textContent = 'Copied. Paste it into a message to the family.'; }, no = () => { said.textContent = 'Could not copy here. Use Print, or read it out.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, no); else no(); };
    const print = () => { document.body.classList.add('print-card'); try { window.print(); } catch (e) {} setTimeout(() => document.body.classList.remove('print-card'), 800); };
    /* every line of each built place, and the line's conversations and words, as groups to record */
    const groups = TOWN.filter(p => !p.soon).map(p => ({ title: "Kenta's Town: " + p.name.toLowerCase(), words: townLines(p) }));
    const talks = [], words = [];
    JP_ST.forEach(st => { st.talk.forEach(t => { if (t.count) return; [[t.dog, t.dogEn], [jpFill(t.me || ''), (t.meEn || '').replace('{en}', S.name)], [t.after, t.afterEn]].concat((t.opts || []).map(o => [o[0], o[1]])).forEach(([x, en]) => { if (x && !talks.some(y => y[0] === x)) talks.push([x, en || '']); }); });
      st.words.forEach(w => { if (!words.some(y => y[0] === w[0])) words.push([w[0], w[1]]); }); });
    groups.push({ title: 'Conversations on the line', words: talks }, { title: 'Words on the line', words: words });
    const means = {}; groups.forEach(g => g.words.forEach(([w, en]) => { means[w] = en; }));
    const mine = ws => ws.filter(([w]) => (Speech.clips().ja || {})[Speech.key(w)]).length;
    const load = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' }, onchange: e => { const f = e.target.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => { try { const o = JSON.parse(fr.result); for (const lang in o) for (const k in o[lang]) if (/^data:audio\//.test(o[lang][k])) Speech.setClip(lang, k, o[lang][k]); dash(); } catch (err) { said.textContent = 'That file is not a WonderWorld voices file.'; } }; fr.readAsText(f); } });
    const test = WHO === 'test' ? [h('p', { class: 'note' }, "Test player only: open every Japanese station, so you can try the katakana stations and Kenta's Town without passing each race first."),
      h('div', null, h('button', { class: 's', 'data-b': 'jp-open', onclick: () => { const J = jpState(); J.placed = true; J.st = JP_N; J.stop = J.stop || {}; for (let i = 1; i <= JP_N; i++) { J.met[i] = 1; J.stop[i] = 5; } saveState(); dash(); } }, 'Open every Japanese station (test player)'))] : [];
    return [h('h3', null, 'Japanese with the family'),
      h('p', { class: 'note' }, 'Talking with a real person is the biggest step from set phrases to conversation. Each week, give this card to a Japanese-speaking family member: three things to say together, from the place ' + S.name + ' is on in Kenta\'s Town. The card changes when she finishes a place.'),
      card, h('div', null, h('button', { class: 's go', 'data-b': 'card-copy', onclick: copy }, 'Copy the card'), h('button', { class: 's', 'data-b': 'card-print', onclick: print }, 'Print the card'), said),
      h('h3', null, 'A family voice for Japanese'),
      h('p', { class: 'note' }, 'A Japanese-speaking family member can record the lines in their own voice. The game then plays their recording instead of the computer voice, wherever that line is said. Record one group at a time; each line takes a few seconds. Recordings stay on this device: save them to a file to use them on the tablet and phone, or put the file in the Education Apps folder and ask Claude to build them into the game.'),
      h('div', { class: 'jp-recgroups' }, groups.map(g => h('button', { class: 's', onclick: () => studio({ lang: 'ja', label: 'Japanese', unit: 'Line', groups: [g].map(x => ({ title: x.title, words: x.words.map(y => y[0]) })), words: g.words.map(y => y[0]), means }) }, 'Record: ' + g.title + ' (' + mine(g.words) + ' of ' + g.words.length + ')'))),
      h('div', null, h('button', { class: 's', onclick: saveVoices }, 'Save the recordings to a file'), h('button', { class: 's', onclick: () => load.click() }, 'Load recordings from a file'), load),
      ...test];
  }
  /* the recording studio: one word at a time. Record, listen back, keep it or go again. */
  function studio(vc) {
    const words = []; groupsOf(vc).forEach(g => g.words.forEach(w => words.push({ w, g: g.title })));
    const mineOf = w => !!(Speech.clips()[vc.lang] || {})[Speech.key(w)];
    let i = words.findIndex(x => !mineOf(x.w)); if (i < 0) i = 0;
    let stop = null, busy = false;
    const card = h('div', { class: 'card studio' }), o = overlay(card);
    const close = () => { if (stop) stop(); o.remove(); dash(); };
    const paint = (msg, live) => {
      card.innerHTML = '';
      if (i >= words.length) { const n = words.filter(x => mineOf(x.w)).length;
        card.append(ic('studio-microphone', 'hero'), h('h3', null, n + ' of ' + words.length + ' ' + (vc.unit || 'word').toLowerCase() + 's recorded'),
          h('p', { class: 'note' }, 'They are saved on this device and ' + S.name + ' will hear them straight away. To put them on the tablet and phone, save them to a file.'),
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: saveVoices }, 'Save to a file'), h('button', { class: 'btn go', onclick: close }, 'Finished')));
        return; }
      const x = words[i], mine = mineOf(x.w), any = !!Speech.clip(vc.lang, x.w);
      card.append(h('div', { class: 'note' }, (vc.unit || 'Word') + ' ' + (i + 1) + ' of ' + words.length + (x.g ? ' · ' + x.g : '')),
        h('div', { class: 'sword' }, x.w), vc.means && vc.means[x.w] ? h('div', { class: 'smeans' }, vc.means[x.w]) : null,
        h('div', { class: 'sstate' + (live ? ' live' : '') }, msg || (mine ? 'Recorded. Listen, then keep it or go again.' : any ? 'This word has a built-in recording. Record your own to replace it.' : 'Press Record, then say the ' + (vc.unit || 'word').toLowerCase() + ' once.')),
        h('div', { class: 'row' },
          live ? h('button', { class: 'btn go', onclick: () => stop && stop() }, 'Stop')
            : h('button', { class: 'btn go', disabled: busy || null, onclick: rec }, mine ? 'Record again' : 'Record'),
          !live && any ? h('button', { class: 'btn', onclick: () => Speech.playClip(Speech.clip(vc.lang, x.w)) }, 'Listen') : null,
          !live ? h('button', { class: 'btn', disabled: busy || null, onclick: () => { i++; paint(); } }, mine ? 'Keep it. Next word' : 'Skip') : null),
        h('div', { class: 'row' }, i > 0 && !live ? h('button', { class: 'btn quiet', onclick: () => { i--; paint(); } }, 'Back') : null, !live ? h('button', { class: 'btn quiet', onclick: close }, 'Close') : null));
    };
    const rec = () => { busy = true; paint('Get ready…');
      recordClip(st => paint(st, /^Recording/.test(st)), f => { stop = f; }).then(u => { stop = null; busy = false; if (Speech.setClip(vc.lang, words[i].w, u)) { paint('Saved. Listen: happy with it?'); Speech.playClip(u); } else paint('Could not save: storage is full.'); })
        .catch(e => { stop = null; busy = false; paint(e && e.message === 'silent' ? 'Nothing was heard. Check the microphone and try again.' : 'No microphone here. Close this and use "Choose a sound file", or start the game with Play WonderWorld.'); }); };
    paint();
  }
  /* record up to four seconds from the microphone; "Stop" ends it sooner */
  function recordClip(onState, onStop) {
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => new Promise((res, rej) => {
      const rec = new MediaRecorder(stream), chunks = [], end = () => { if (rec.state !== 'inactive') rec.stop(); };
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); onState('Tidying…'); tidyClip(new Blob(chunks, { type: rec.mimeType })).then(res, rej); };
      rec.start(); onState('Recording: say it now'); if (onStop) onStop(end); setTimeout(end, 4000);
    }));
  }
  /* any sound (a recording or a chosen file) becomes a short clear clip: one channel, silence trimmed from both ends, evened out in loudness */
  function tidyClip(blob) {
    return blob.arrayBuffer().then(buf => { const AC2 = window.AudioContext || window.webkitAudioContext, ctx = new AC2(); return ctx.decodeAudioData(buf).then(au => { try { ctx.close(); } catch (e) {} return au; }); }).then(au => {
      const rate = 16000, len = Math.min(Math.ceil(au.duration * rate), rate * 6), off = new OfflineAudioContext(1, len, rate), src = off.createBufferSource(); src.buffer = au; src.connect(off.destination); src.start();
      return off.startRendering().then(r => {
        const d = r.getChannelData(0); let peak = 0; for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); if (peak < .01) throw new Error('silent');
        const th = peak * .08, pad = Math.round(rate * .07); let a = 0, b = d.length - 1; while (a < b && Math.abs(d[a]) < th) a++; while (b > a && Math.abs(d[b]) < th) b--;
        a = Math.max(0, a - pad); b = Math.min(d.length - 1, b + pad * 2); const n = b - a + 1, gain = .9 / peak, fade = Math.round(rate * .01);
        const wav = new DataView(new ArrayBuffer(44 + n * 2)), str = (o, t) => { for (let i = 0; i < t.length; i++) wav.setUint8(o + i, t.charCodeAt(i)); };
        str(0, 'RIFF'); wav.setUint32(4, 36 + n * 2, true); str(8, 'WAVEfmt '); wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true); wav.setUint32(24, rate, true); wav.setUint32(28, rate * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true); str(36, 'data'); wav.setUint32(40, n * 2, true);
        for (let i = 0; i < n; i++) { const env = Math.min(1, i / fade, (n - 1 - i) / fade); wav.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[a + i] * gain * env)) * 32767, true); }
        let bin = ''; const u8 = new Uint8Array(wav.buffer); for (let i = 0; i < u8.length; i += 8192) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
        return 'data:audio/wav;base64,' + btoa(bin);
      });
    });
  }
  /* weaving is not a levelled question skill, so it reports here: how many of the tukutuku panels she has woven */
  function weaveNote() { let n = 0; for (const cid in COUNTRIES) COUNTRIES[cid].missions.forEach(m => m.rounds.forEach(r => { if (r.act === 'weave') n = Math.max(n, r.panels.length); }));
    return n && S.weave ? [h('p', { class: 'note' }, 'Tukutuku weaving (symmetry and reflection): ' + Math.min(S.weave, n) + ' of ' + n + ' panels woven. The panels get bigger and add a second thread colour, then a second mirror line.')] : []; }
  /* the flashcard race is not a levelled question skill either: its level, what that level is, and the cards waiting to come back */
  function raceNote() { const R = S.race; if (!R || typeof R !== 'object' || !R.seen) return []; const lv = clamp(R.lv, 1, RACE_LEVELS), set = Math.ceil(lv / RACE_PACE.length), pace = RACE_PACE[(lv - 1) % RACE_PACE.length];
    const names = ['number bonds and doubles', 'adding and taking away within 20', 'the 2, 5 and 10 times tables', 'the 3 and 4 times tables', 'the 6 to 9 times tables', 'dividing and multiplying'];
    return [h('p', { class: 'note race-note' }, 'Flashcard race (quick recall): level ' + lv + ' of ' + RACE_LEVELS + ', ' + (R.wins || 0) + ' won. This level is ' + names[set - 1] + ', with the hare taking ' + pace + ' seconds a step. She moves up only by winning.' + ((R.again || []).length ? ' Cards she missed twice, to come back next race: ' + R.again.join(', ') + '.' : ''))]; }
  /* the two strands that run through every country (068-spine.js): how far she is with the periodic table, and the pages of her body atlas. Neither is reset with a country */
  function spineNote() { const out = [], E = S.elem, groups = ['not started', 'metal or not', 'gas or solid', 'first and last columns', 'four families'];
    if (E && typeof E === 'object' && E.placed) out.push(h('p', { class: 'note elem-note' }, 'Periodic table: she can put ' + E.n + ' of the 118 elements in order' + (E.n ? ' (up to ' + EL(E.n).name.toLowerCase() + ')' : '') + '. Each visit teaches the next five, and she moves on with one slip at most. Grouping (from 20 elements): ' + groups[clamp(E.g || 0, 0, 4)] + (E.g ? ' passed' : '') + '. Practice is open any day from the passport, under "My lab book". ',
      sure('Start the table again', 'Sure? Press again', () => { delete S.elem; saveState(); const n = $('.elem-note'); if (n) n.textContent = 'Periodic table: cleared. The game will ask how far she can go again.'; })));
    const J = S.jp, JCRED = 'Hiragana and katakana stroke order from KanjiVG by Ulrich Apel (CC BY-SA 3.0); letters drawn in Klee One by Fontworks (SIL Open Font License). ';
    if (!(J && typeof J === 'object' && J.placed)) out.push(h('p', { class: 'note jp-note' }, 'Japanese: not started yet. ' + JCRED));
    if (J && typeof J === 'object' && J.placed) out.push(h('p', { class: 'note jp-note' }, 'Japanese: she has passed ' + (J.st || 0) + ' of the ' + JP_N + ' stations' + (J.st ? ' (up to ' + JP_ST[J.st - 1].name.toLowerCase() + ')' : '') + '. She moves on only by beating the fox in the flashcard race; races won: ' + (J.wins || 0) + '. ' +
      (J.day ? 'Last ride: ' + (([y, m, d]) => d + ' ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1])(J.day.split('-').map(Number)) + '. ' : '') + 'She can ride any day from the にほんご button on the map. ' + JCRED, sure('Start Japanese again', 'Sure? Press again', () => { delete S.jp; saveState(); const n = $('.jp-note'); if (n) n.textContent = 'Japanese: cleared. The game will ask how far she can read again.'; })));
    const C = S.code; out.push(h('p', { class: 'note cd-note' }, C && C.st ? 'Code Lab (programming a robot): ' + C.st + ' of ' + CD_ST.length + ' stations passed (' + CD_BUILT + ' built so far), ' + Object.keys(C.gold || {}).length + ' puzzles done in the fewest blocks. ' : 'Code Lab (programming a robot): not started yet. It is on the map and in the passport. ',
      C && C.st ? sure('Start the Code Lab again', 'Sure? Press again', () => { delete S.code; saveState(); const n = $('.cd-note'); if (n) n.textContent = 'Code Lab: cleared.'; }) : null));
    const pages = Object.keys(ATLAS).filter(id => (S.atlas || {})[id] && S.atlas[id].n);
    if (pages.length) out.push(h('p', { class: 'note atlas-note' }, 'Body atlas ("point to it" tests): ' + pages.map(id => ATLAS[id].name.toLowerCase() + ', ' + S.atlas[id].n + (S.atlas[id].n === 1 ? ' test' : ' tests') + ', best ' + S.atlas[id].best + ' found without a slip').join('; ') + '. Each country from Greece on adds a body system.'));
    if (S.magic) out.push(h('p', { class: 'note' }, 'Magic square (every line makes 15): ' + Math.min(S.magic, MAGIC_LEVELS) + ' of ' + MAGIC_LEVELS + ' levels done. The last level leaves only the middle number.'));
    if (S.sieve) out.push(h('p', { class: 'note' }, 'Sieve of Eratosthenes (prime numbers): done to ' + (S.sieve >= 2 ? 100 : 50) + '.'));
    return out; }
  /* a button that must be pressed twice, so nothing is wiped by accident */
  const sure = (label, again, act) => h('button', { class: 's', onclick: e => { const b = e.currentTarget; if (b.dataset.sure) act(); else { b.dataset.sure = 1; b.textContent = again; b.classList.add('warn'); setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.textContent = label; b.classList.remove('warn'); } }, 4000); } } }, label);
  /* who is playing, and putting one country back to the start */
  function playerRows() {
    const test = WHO === 'test';
    const rows = Object.keys(COUNTRIES).map(cid => { const c = COUNTRIES[cid], n = c.missions.filter(m => S.missions[cid + '.' + m.id] && S.missions[cid + '.' + m.id].done).length, own = ownSkills(cid).filter(id => S.skills[id]).map(id => SKILLS[id].name);
      return h('tr', null, h('td', { style: { 'font-weight': '600' } }, cap(c.name)), h('td', null, n + ' of ' + c.missions.length + ' missions done'),
        h('td', null, sure('Reset ' + cap(c.name), 'Press again to reset ' + cap(c.name), () => { resetCountry(cid); dash(); })),
        h('td', { class: 'note' }, own.length ? 'Also clears: ' + own.join(', ') : '')); });
    const who = [h('h3', null, 'Who is playing: ' + (test ? 'the test player' : S.name)),
      h('p', { class: 'note' }, test ? 'You are the test player. Every mission is open and nothing you do here changes ' + S.name + "'s stars, levels or missions. A red \"Test player\" label shows on every screen. Switch back before " + S.name + ' plays.'
        : 'To try the game yourself without changing ' + S.name + "'s progress, switch to the test player. It has its own stars, levels and missions, with every mission open. " + S.name + "'s progress is kept exactly as it is until you switch back."),
      h('div', null, h('button', { class: 's go', onclick: () => { setPlayer(test ? '' : 'test'); dash(); } }, test ? 'Switch back to ' + S.name : 'Switch to the test player'))];
    return { who, reset: [h('h3', null, 'Reset a country' + (test ? ' (test player)' : '')),
      h('p', { class: 'note' }, 'Puts one country back to never played for ' + (test ? 'the test player' : S.name) + ': its missions, stamps and videos, and the skills only that country teaches. Stars, the room and every other country are kept. Skills shared between countries can be cleared one at a time in the table above.'),
      h('table', null, rows)] };
  }
  function dash() {
    body.innerHTML = ''; const week = Date.now() - 7 * 864e5;
    const rows = Object.keys(SKILLS).map(id => { const sk = SKILLS[id], st = S.skills[id]; if (!st) return null; const re = S.log.filter(l => l.s === id && l.t > week).length;
      return h('tr', null, h('td', null, sk.name), h('td', null, STRANDS[sk.strand] || sk.strand),
        h('td', null, sk.max > 1 ? h('div', { class: 'lv' }, h('div', { class: 'bar' }, h('i', { style: { width: (st.lv / 8 * 100) + '%' } })), 'Level ' + st.lv + ' (about Year ' + st.lv + ')') : 'Ideas, not levelled'),
        h('td', null, st.clean), h('td', null, st.helped), h('td', null, re || '–'), h('td', null, st.review ? 'Coming back to it' : 'Secure'),
        h('td', null, sure('Clear', 'Press again to clear', () => { clearSkill(id); dash(); }))); }).filter(Boolean);
    const en = Speech.english(), arv = Speech.native('ar'), jav = Speech.native('ja'), ruv = Speech.native('ru'), ptv = Speech.native('pt'), frv = Speech.native('fr'), elv = Speech.native('el'), zhv = Speech.native('zh'), cav = Speech.native('fr-ca');
    const vids = []; for (const cid in COUNTRIES) for (const id in COUNTRIES[cid].videos) { const v = COUNTRIES[cid].videos[id]; vids.push(h('button', { class: 's', onclick: () => playVideo(v) }, 'Play: ' + v.title)); }
    /* the backup code: one button copies all of it; the box below takes a code by Paste (a button, so it works without a keyboard) or by typing */
    const backup = h('textarea', { readonly: true, class: 'bk-code', 'aria-label': 'Backup code for this device', onclick: e => e.currentTarget.select() }, btoa(unescape(encodeURIComponent(JSON.stringify(S)))));
    const restore = h('textarea', { class: 'bk-in', 'aria-label': 'Paste a backup code here', placeholder: 'Press Paste, or tap here and paste a backup code. Then press Restore.', inputmode: 'text', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', spellcheck: 'false' });
    const said = h('span', { class: 'note bk-said' });
    const say = t => { said.textContent = t; };
    const copyCode = () => { const done = ok => say(ok ? 'Copied. Paste it into an email or a note to yourself.' : 'Could not copy. The code is selected: press and hold it, then choose Copy.');
      backup.focus(); backup.select(); try { backup.setSelectionRange(0, backup.value.length); } catch (e) {}
      const old = () => { let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} done(ok); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(backup.value).then(() => done(true), old); else old(); };
    const pasteCode = () => { const manual = () => { restore.focus(); say('Tap in the box, hold your finger down, and choose Paste.'); };
      if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then(t => { if (t && t.trim()) { restore.value = t.trim(); say('Pasted. Now press Restore.'); } else manual(); }, manual); else manual(); };
    const players = playerRows();
    /* the player's own name (asked for in the Welcome guide; friends each put in their own), the Welcome guide again, and About */
    const nameIn = h('input', { class: 'nm-in', type: 'text', maxlength: 16, value: S.name || '', 'aria-label': "Player's name", autocomplete: 'off', autocapitalize: 'words', spellcheck: 'false' }), nameSaid = h('span', { class: 'note' });
    const nameRow = [h('h3', null, "Player's name"), h('div', { class: 'nm-row' }, nameIn, h('button', { class: 's go', 'data-b': 'name-save', onclick: () => { const v = cleanName(nameIn.value); if (!v) { nameSaid.textContent = 'Type a name first.'; return; } S.name = v; saveState(); nameSaid.textContent = 'Saved. The game now calls the player ' + v + '.'; } }, 'Save'), nameSaid),
      h('div', { class: 'nm-row' }, h('button', { class: 's', 'data-b': 'welcome', onclick: () => go('welcome', 'again') }, 'Show the Welcome guide'), h('button', { class: 's', 'data-b': 'about', onclick: () => go('about', 'parent') }, 'About WonderWorld'))];
    body.append(
      ...players.who, ...nameRow,
      h('h3', null, 'Where ' + (WHO === 'test' ? 'the test player' : S.name) + ' is working'),
      rows.length ? h('table', null, h('tr', null, ['Skill', 'Strand', 'Working level', 'Right first time', 'Needed re-teaching', 'Re-taught this week', 'Status', ''].map(t => h('th', null, t))), rows) : h('p', { class: 'note' }, 'Nothing played yet.'),
      h('p', { class: 'note' }, '"Clear" forgets one skill: its level and counts go back to the start, and the game finds the right level again. Levels 1 to 8 are pitched roughly at New Zealand Curriculum Years 1 to 8. A level rises after right-first-time answers and steps down when a question needed re-teaching twice.'),
      ...weaveNote(), ...raceNote(), ...spineNote(),
      ...players.reset,
      h('h3', null, 'Voices on this device'),
      h('p', { class: 'note' }, 'Narration: ' + (en ? en.name : 'no English voice found') + '. Arabic: ' + (arv ? arv.name + ' (native speaker voice)' : 'no Arabic voice found, so Arabic words are sounded out by the English voice. On a Windows laptop, opening this file in Microsoft Edge gives natural voices, including Arabic, when online. On Android, add Arabic in Settings, Text-to-speech.') +
        (COUNTRIES.japan ? ' Japanese: ' + (jav ? jav.name + ' (native speaker voice).' : 'no Japanese voice found, so Japanese words are sounded out by the English voice. Microsoft Edge has a Japanese voice when online. On Android, add Japanese in Settings, Text-to-speech.') : '') +
        (COUNTRIES.russia ? ' Russian: ' + (ruv ? ruv.name + ' (native speaker voice).' : 'no Russian voice found, so Russian words are sounded out by the English voice. Microsoft Edge has a Russian voice when online. On Android, add Russian in Settings, Text-to-speech.') : '') +
        (COUNTRIES.brazil ? ' Portuguese: ' + (ptv ? ptv.name + ' (native speaker voice).' : 'no Portuguese voice found, so Portuguese words are sounded out by the English voice. Microsoft Edge has a Brazilian Portuguese voice when online. On Android, add Portuguese (Brazil) in Settings, Text-to-speech.') : '') +
        (COUNTRIES.france ? ' French: ' + (frv ? frv.name + ' (native speaker voice).' : 'no French voice found, so French words are sounded out by the English voice. Microsoft Edge has a French voice when online. On Android, add French (France) in Settings, Text-to-speech.') : '') +
        (COUNTRIES.greece ? ' Greek: ' + (elv ? elv.name + ' (native speaker voice).' : 'no Greek voice found, so Greek words are sounded out by the English voice. Microsoft Edge has a Greek voice when online. On Android, add Greek in Settings, Text-to-speech.') : '') +
        (COUNTRIES.china ? ' Mandarin Chinese: ' + (zhv ? zhv.name + ' (native speaker voice).' : 'no Mandarin voice found, so Chinese words are sounded out by the English voice. Microsoft Edge has Mandarin voices when online. On Android, add Chinese (China) in Settings, Text-to-speech. A Cantonese voice is never used for them.') : '') +
        (COUNTRIES.canada ? ' Canadian French: ' + (cav ? cav.name + (/^fr-ca/i.test(cav.lang.replace('_', '-')) ? ' (Canadian voice).' : ' (a French voice: no Canadian French voice found; on Android, add French (Canada) in Settings, Text-to-speech).') : 'no French voice found, so the Canadian French words are sounded out by the English voice. Microsoft Edge has Canadian French voices when online.') : '') +
        ' This is ' + (/Edg\//.test(navigator.userAgent) ? 'Microsoft Edge' : /OPR\//.test(navigator.userAgent) ? 'Opera' : /Chrome\//.test(navigator.userAgent) ? 'Google Chrome (it has no Arabic voice: use Microsoft Edge on the laptop)' : /Firefox\//.test(navigator.userAgent) ? 'Firefox' : /Safari\//.test(navigator.userAgent) ? 'Safari' : 'an unknown browser') + '.' +
        (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? ' This device is in dark mode. ' + (/SamsungBrowser/.test(navigator.userAgent) ? 'Samsung Internet then darkens the game and changes its colours. To see the real colours: Samsung Internet menu, Settings, Labs, turn on "Use website dark theme"; or turn dark mode off in the browser.' : 'If the game looks dark, turn off the dark mode in this browser: the game has one set of colours, and they are light.') : '') +
        ' This device is offering ' + Speech.list().length + ' voices right now (' + Speech.list().filter(v => v.localService === false).length + ' of them online voices, which need the internet).'),
      ...voiceRows(), ...jpFamilyRows(),
      h('h3', null, 'Check the videos play on this device'), h('div', null, vids),
      h('p', { class: 'note' }, /^http/.test(location.protocol) ? 'This copy is running from a web address, so videos can play inside the game.' : 'This copy was opened as a file. YouTube does not allow videos to play inside a page opened that way, so rewards open in YouTube. Start the game with "Play WonderWorld" to have them play inside the game.'),
      h('div', null, h('button', { class: 's', onclick: () => { S.vmode = videoMode() === 'yt' ? 'in' : 'yt'; S.vset = true; saveState(); dash(); } }, videoMode() === 'yt' ? 'Videos now open in YouTube. Switch to playing inside the game' : 'Videos now play inside the game. Switch to opening in YouTube')),
      h('h3', null, 'Stars and progress'),
      h('p', { class: 'note' }, S.life + ' stars earned in total' + (S.carried ? ' (including ' + S.carried + ' carried over from the first WonderWorld)' : '') + '. ' + (canSave() ? 'Progress is being saved in this browser on this device.' : 'WARNING: this browser is not letting the game save. Progress will be lost when it is closed. Use the backup code below, or open the file in Chrome or Edge.')),
      h('h3', null, 'Backup'), h('p', { class: 'note' }, 'To back up progress, or to move it to another device: copy this code and keep it somewhere safe.'), backup,
      h('div', null, h('button', { class: 's go', 'data-b': 'copy', onclick: copyCode }, 'Copy the code')),
      h('p', { class: 'note' }, 'To bring progress in from a backup: paste the code here, then press Restore. It replaces the progress on this device.'), restore,
      h('div', null, h('button', { class: 's', 'data-b': 'paste', onclick: pasteCode }, 'Paste'), h('button', { class: 's', 'data-b': 'restore', onclick: () => { try { const o = JSON.parse(decodeURIComponent(escape(atob(restore.value.trim())))); if (o && o.v) { S = Object.assign(JSON.parse(JSON.stringify(DEF)), o); saveState(); dash(); } } catch (e) { restore.value = ''; restore.placeholder = 'That code did not work. Paste the whole code.'; say('That code did not work. Copy the whole code, and try again.'); } } }, 'Restore'),
        h('button', { class: 's', onclick: e => { if (e.currentTarget.dataset.sure) { const pin = S.pin; S = JSON.parse(JSON.stringify(DEF)); S.pin = pin; S.imported = true; saveState(); dash(); } else { e.currentTarget.dataset.sure = 1; e.currentTarget.textContent = 'Press again to erase all progress'; } } }, 'Start again from zero')), said
    );
  }
};
