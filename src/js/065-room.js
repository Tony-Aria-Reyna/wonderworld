/* ===== Her home: rooms and a garden to decorate, things that move, and an explorer of her own to design and dress.
   - The shop sells things with stars. Anything that moves in real life moves here (MOVES), and living things change with the room colour (THEME_LOOK): asleep in the Night sky room, a brimmed hat in the Outback room.
   - Her explorer (S.me) is designed in the wardrobe, and everything about her can be changed at any time: skin, hair, eyes, mouth, freckles, eyelashes, glasses, a hearing aid,
     and her own clothes piece by piece (top, bottoms, shoes, each with its colour). All of that is free. Whole costumes and extras cost stars.
   - More of the house opens as she earns gold stamps (PLACES). The garden is open from the start. ===== */
const SHOP = [
  { cat: 'Furniture', items: [['bed', 'Bed', 30], ['couch-and-lamp', 'Sofa and lamp', 30], ['chair', 'Chair', 14], ['books', 'Books', 12], ['framed-picture', 'Picture', 12], ['mantelpiece-clock', 'Clock', 12], ['potted-plant', 'Pot plant', 10], ['mirror', 'Mirror', 15]] },
  { cat: 'Science gear', items: [['telescope', 'Telescope', 25], ['microscope', 'Microscope', 25], ['globe-showing-asia-australia', 'Globe', 20], ['rocket', 'Rocket', 35], ['robot', 'Robot', 35], ['abacus', 'Abacus', 14], ['magnet', 'Magnet', 10], ['dna', 'DNA model', 16]] },
  { cat: 'Pets and friends', items: [['cat', 'Cat', 25], ['dog', 'Dog', 25], ['parrot', 'Parrot', 20], ['turtle', 'Turtle', 15], ['tropical-fish', 'Fish', 12], ['owl', 'Owl', 20], ['teddy-bear', 'Teddy', 15], ['unicorn', 'Unicorn', 40]] },
  { cat: 'Fun things', items: [['balloon', 'Balloon', 6], ['sunflower', 'Sunflower', 8], ['tulip', 'Tulip', 8], ['rainbow', 'Rainbow', 20], ['soccer-ball', 'Ball', 8], ['guitar', 'Guitar', 15], ['kite', 'Kite', 10], ['artist-palette', 'Paints', 12], ['birthday-cake', 'Cake', 15], ['crescent-moon', 'Moon', 10], ['glowing-star', 'Star', 6], ['trophy', 'Trophy', 30]] },
  { cat: 'Outside things', items: [['deciduous-tree', 'Tree', 15], ['evergreen-tree', 'Pine tree', 15], ['palm-tree', 'Palm tree', 15], ['tent', 'Tent', 20], ['playground-slide', 'Slide', 30], ['bicycle', 'Bike', 20], ['kick-scooter', 'Scooter', 15], ['skateboard', 'Skateboard', 12],
    ['carousel-horse', 'Carousel horse', 30], ['ferris-wheel', 'Big wheel', 40], ['fountain', 'Fountain', 30], ['snowman', 'Snowman', 15], ['sailboat', 'Sailing boat', 20], ['basketball', 'Basketball', 8], ['hibiscus', 'Flower', 8], ['mushroom', 'Mushroom', 6]] },
  { cat: 'Garden friends', items: [['rabbit', 'Rabbit', 20], ['duck', 'Duck', 15], ['hedgehog', 'Hedgehog', 15], ['frog', 'Frog', 10], ['snail', 'Snail', 8], ['bird', 'Bird', 12], ['horse', 'Horse', 40], ['hatching-chick', 'Chick', 10], ['butterfly', 'Butterfly', 10], ['honeybee', 'Bee', 8], ['lady-beetle', 'Ladybird', 8], ['sun-with-face', 'Smiling sun', 12]] }
];
const ROOM_THEMES = {
  sun: { name: 'Sunny', price: 0, wall: '#FFE9A8', wall2: '#FFDF8A', floor: '#E0A458', line: '#C98B3F', rug: '#FF7A6B', sky: ['#8FDCF7', '#D8F3FF'] },
  ocean: { name: 'Ocean', price: 30, wall: '#BDEEF2', wall2: '#A6E4EA', floor: '#3FA9B8', line: '#2B8E9E', rug: '#FFC83D', sky: ['#63C9F2', '#BFEBF7'] },
  blossom: { name: 'Blossom', price: 30, wall: '#FFE0EA', wall2: '#FFD0DE', floor: '#F29AB5', line: '#DB7C9A', rug: '#8B7BEA', sky: ['#FFD3E0', '#FFF1F5'] },
  jungle: { name: 'Jungle', price: 30, wall: '#D5F2CC', wall2: '#C0E9B4', floor: '#6FAF5A', line: '#57944A', rug: '#FFC83D', sky: ['#8FDCF7', '#E3F8D9'] },
  night: { name: 'Night sky', price: 40, wall: '#34478A', wall2: '#2C3D7B', floor: '#6453C9', line: '#5140B0', rug: '#19A7B8', sky: ['#141C44', '#2C3D7B'], night: true }
};

/* ----- how things move. Keyed by the picture's name, so a country's souvenir that uses the same picture moves the same way; a souvenir can also give its own `move` ----- */
const MOVES = { cat: 'hop', dog: 'hop', parrot: 'flap', turtle: 'crawl', 'tropical-fish': 'swim', owl: 'flap', 'teddy-bear': 'rock', unicorn: 'hop', rocket: 'hover', robot: 'wobble', 'mantelpiece-clock': 'tick', 'potted-plant': 'sway',
  'globe-showing-asia-australia': 'wobble', balloon: 'float', sunflower: 'sway', tulip: 'sway', rainbow: 'twinkle', 'soccer-ball': 'bounce', guitar: 'strum', kite: 'float', 'crescent-moon': 'twinkle', 'glowing-star': 'twinkle',
  'deciduous-tree': 'sway', 'evergreen-tree': 'sway', 'palm-tree': 'sway', bicycle: 'slide', 'kick-scooter': 'slide', skateboard: 'slide', 'carousel-horse': 'bob', 'ferris-wheel': 'twinkle', fountain: 'twinkle', sailboat: 'rock', basketball: 'bounce', hibiscus: 'sway',
  rabbit: 'hop', duck: 'waddle', hedgehog: 'crawl', frog: 'hop', snail: 'crawl', bird: 'flap', horse: 'hop', 'hatching-chick': 'waddle', butterfly: 'flutter', honeybee: 'flutter', 'lady-beetle': 'crawl', 'sun-with-face': 'twinkle',
  sloth: 'sway', kangaroo: 'hop', koala: 'rock', boomerang: 'spin', tiger: 'prowl', seal: 'rock', bear: 'rock', camel: 'rock', 'nesting-dolls': 'wobble', satellite: 'hover', 'woman-astronaut': 'float', 'bullet-train': 'slide', coral: 'sway', 'cherry-blossom': 'sway', 'red-paper-lantern': 'sway' };
/* living things: where the top of the head is, as [across %, down %, hat width %] of the picture. They wear the room's hat and fall asleep at night */
const HEADS = { cat: [22, 34, 34], dog: [30, 26, 32], parrot: [32, 10, 40], turtle: [9, 64, 24], 'tropical-fish': [48, 24, 44], owl: [50, 14, 66], 'teddy-bear': [50, 22, 50], unicorn: [30, 38, 36], robot: [50, 17, 60],
  rabbit: [22, 26, 34], duck: [32, 14, 44], hedgehog: [25, 62, 30], frog: [50, 14, 64], snail: [15, 12, 32], bird: [36, 16, 46], horse: [27, 14, 34], 'hatching-chick': [50, 16, 50], kangaroo: [26, 20, 30], koala: [50, 12, 62], tiger: [15, 38, 30], seal: [22, 30, 34], bear: [50, 16, 60], camel: [13, 20, 28],
  'woman-astronaut': [50, 8, 50], sloth: [21, 52, 36] };
const moveOf = th => th.move || MOVES[typeof th.art === 'string' ? th.art : ''] || '';
const headOf = th => th.head || HEADS[typeof th.art === 'string' ? th.art : ''] || null;

/* ----- what each room colour does to living things: a hat that belongs to that room, and something drifting in the air. In the Night sky room they sleep. The hat sits in a 60 x 44 box, its bottom middle on the head ----- */
const HAT = inner => '<svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
const THEME_LOOK = {
  sun: { fx: 'spark', hat: '<path d="M12 38q0-22 18-22t18 22z" fill="#E5484D"/><path d="M44 36q13 0 15 6H38z" fill="#C0392B"/><circle cx="30" cy="16" r="2.800" fill="#fff"/>' },
  ocean: { fx: 'bubble', hat: '<path d="M10 37q2-18 20-18t20 18z" fill="#fff" stroke="#1B2A4E" stroke-width="1.500"/><path d="M8 35h44v6H8z" fill="#3B6FD4"/><path d="M14 30q16-5 32 0" stroke="#3B6FD4" stroke-width="1.800" fill="none" stroke-linecap="round"/>' },
  blossom: { fx: 'petal', hat: '<path d="M8 40q22-11 44 0" stroke="#3FA36B" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#FF8FB1"><circle cx="12" cy="36" r="5"/><circle cx="30" cy="31" r="6"/><circle cx="48" cy="36" r="5"/></g><g fill="#fff"><circle cx="21" cy="32" r="4.500"/><circle cx="39" cy="32" r="4.500"/></g><g fill="#FFC83D"><circle cx="12" cy="36" r="1.800"/><circle cx="30" cy="31" r="2.200"/><circle cx="48" cy="36" r="1.800"/><circle cx="21" cy="32" r="1.600"/><circle cx="39" cy="32" r="1.600"/></g>' },
  jungle: { fx: 'leaf', hat: '<path d="M30 42Q4 36 8 8q28 2 22 34z" fill="#3FA36B"/><path d="M30 42q22-8 24-28-20 0-24 28z" fill="#57BF7F"/><path d="M28 39Q22 26 13 14M32 39q6-10 16-18" stroke="#2E7D4F" stroke-width="1.500" fill="none" stroke-linecap="round"/>' },
  night: { fx: 'zzz', sleep: true, hat: '<path d="M10 40q0-18 18-20 16-2 24-14 4 18-6 24-4 3-4 10z" fill="#6453C9"/><path d="M8 35h36v7H8z" fill="#fff"/><circle cx="52" cy="7" r="5" fill="#FFC83D"/><g fill="#FFC83D"><circle cx="22" cy="28" r="1.500"/><circle cx="34" cy="24" r="1.500"/></g>' },
  tent: { fx: 'dust', hat: '<path d="M16 40l4-24h20l4 24z" fill="#C0392B"/><path d="M30 16q11 2 13 15" stroke="#1B2A4E" stroke-width="1.500" fill="none"/><circle cx="43" cy="32" r="2.800" fill="#FFC83D"/>' },
  bush: { fx: 'leaf', hat: '<path d="M14 36q2-20 16-20t16 20z" fill="#5E9E63"/><path d="M5 38q25-9 50 0-25 9-50 0z" fill="#4B864F"/><path d="M24 30q6-10 14-10M27 28l3-5M31 26l3-4" stroke="#DDF2D3" stroke-width="1.600" fill="none" stroke-linecap="round"/>' },
  tatami: { fx: 'petal', hat: '<path d="M8 33q22-9 44 0v8q-22-9-44 0z" fill="#fff" stroke="#C9CEDA" stroke-width="1"/><circle cx="30" cy="33" r="4.200" fill="#E5484D"/><path d="M52 35l7-5-1 10z" fill="#fff" stroke="#C9CEDA" stroke-width="1"/>' },
  outback: { fx: 'dust', hat: '<ellipse cx="30" cy="37" rx="29" ry="6" fill="#B98A4E"/><path d="M14 37q2-23 16-23t16 23z" fill="#D2A363"/><path d="M14.500 32h31v5h-32z" fill="#7A4A1E"/>' },
  carnival: { fx: 'confetti', hat: '<g transform="rotate(-58 30 37)"><ellipse cx="30" cy="17" rx="5.500" ry="15" fill="#19A7B8"/><path d="M30 5v26" stroke="#fff" stroke-width="1" opacity=".6"/></g><g transform="rotate(-29 30 37)"><ellipse cx="30" cy="17" rx="5.500" ry="15" fill="#FF7A6B"/><path d="M30 5v26" stroke="#fff" stroke-width="1" opacity=".6"/></g><g transform="rotate(0 30 37)"><ellipse cx="30" cy="17" rx="5.500" ry="15" fill="#FFC83D"/><path d="M30 5v26" stroke="#fff" stroke-width="1" opacity=".6"/></g><g transform="rotate(29 30 37)"><ellipse cx="30" cy="17" rx="5.500" ry="15" fill="#E86AA6"/><path d="M30 5v26" stroke="#fff" stroke-width="1" opacity=".6"/></g><g transform="rotate(58 30 37)"><ellipse cx="30" cy="17" rx="5.500" ry="15" fill="#8B7BEA"/><path d="M30 5v26" stroke="#fff" stroke-width="1" opacity=".6"/></g><path d="M11 36q19-9 38 0v7q-19-9-38 0z" fill="#FFC83D" stroke="#E9A416" stroke-width="1"/><circle cx="30" cy="35.500" r="3" fill="#E5484D"/>' },
  aegean: { fx: 'leaf', hat: '<path d="M9 38a21 21 0 0 1 42 0" fill="none" stroke="#6B8F4E" stroke-width="3" stroke-linecap="round"/><g fill="#7DB85F"><ellipse cx="10" cy="32" rx="7" ry="3" transform="rotate(-70 10 32)"/><ellipse cx="16" cy="23" rx="7" ry="3" transform="rotate(-45 16 23)"/><ellipse cx="25" cy="18" rx="7" ry="3" transform="rotate(-15 25 18)"/><ellipse cx="35" cy="18" rx="7" ry="3" transform="rotate(15 35 18)"/><ellipse cx="44" cy="23" rx="7" ry="3" transform="rotate(45 44 23)"/><ellipse cx="50" cy="32" rx="7" ry="3" transform="rotate(70 50 32)"/></g><g fill="#3E4A5E"><circle cx="20" cy="28" r="1.800"/><circle cx="40" cy="28" r="1.800"/></g>' },
  paris: { fx: 'spark', hat: '<path d="M6 34q2-17 25-17 22 0 24 15 1 7-25 8Q5 41 6 34z" fill="#C0392B"/><path d="M10 37q20 5 42-1" stroke="#8E2A20" stroke-width="2.500" fill="none" stroke-linecap="round"/><path d="M30 17q1-6 5-7" stroke="#8E2A20" stroke-width="2.500" fill="none" stroke-linecap="round"/>' },
  snowy: { fx: 'snow', hat: '<path d="M8 38q0-27 22-27t22 27q-22-8-44 0z" fill="#5A678A"/><path d="M6 40q24-10 48 0v-9q-24-10-48 0z" fill="#3E4A5E"/><path d="M6 34q-6 4-4 10h8zM54 34q6 4 4 10h-8z" fill="#5A678A"/><circle cx="30" cy="12" r="3.500" fill="#3E4A5E"/>' }
};
const themeLook = id => THEME_LOOK[id] || THEME_LOOK.sun;

/* ----- the parts of the house. Each keeps its own things and its own colour. `gold` is how many gold stamps open it; once open it stays open ----- */
const PLACES = [
  { id: 'bedroom', name: 'Bedroom', icon: 'bed', gold: 0 },
  { id: 'garden', name: 'Garden', icon: 'house-with-garden', gold: 0, outside: true },
  { id: 'play', name: 'Playroom', icon: 'teddy-bear', gold: 3 },
  { id: 'lab', name: 'Science lab', icon: 'microscope', gold: 8 },
  { id: 'attic', name: 'Star attic', icon: 'telescope', gold: 15 }
];
const goldCount = () => Object.keys(S.missions).filter(k => S.missions[k].gold).length;
function roomState(id) {
  if (!S.room) S.room = { theme: 'sun', items: [] };     /* the bedroom keeps its old name, so everything she already put out stays where it is */
  if (!S.owned) S.owned = {}; if (!S.themes) S.themes = { sun: true };
  if (!S.places) S.places = {}; if (!S.open) S.open = {};
  if (!S.place || !PLACES.some(p => p.id === S.place)) S.place = 'bedroom';
  id = id || S.place; if (id === 'bedroom') return S.room;
  return S.places[id] || (S.places[id] = { theme: 'sun', items: [] });
}
function placeOpen(p) { roomState(); if (!p.gold || S.open[p.id]) return true; if (goldCount() >= p.gold) { S.open[p.id] = true; return true; } return false; }

/* every thing that can be bought: the shop shelves plus each country's souvenirs */
function shopShelves() {
  const shelves = SHOP.map(s => ({ cat: s.cat, items: s.items.map(i => ({ id: i[0], art: i[0], name: i[1], price: i[2] })) }));
  for (const cid in COUNTRIES) { const c = COUNTRIES[cid]; if (c.souvenirs) shelves.push({ cat: c.name + ' souvenirs', items: c.souvenirs.map(s => Object.assign({ cid }, s)) }); }
  /* gifts from the Japanese train line (0761-nihongo.js): one for each station passed, given free into her toy box */
  if (typeof JP_GIFTS !== 'undefined') shelves.push({ cat: 'Japanese train gifts', items: JP_GIFTS });
  if (typeof EL_GIFTS !== 'undefined') shelves.push({ cat: 'Lab gifts', items: EL_GIFTS });
  if (typeof CD_GIFTS !== 'undefined') shelves.push({ cat: 'Code Lab gifts', items: CD_GIFTS });
  return shelves;
}
function findThing(id) { for (const sh of shopShelves()) for (const it of sh.items) if (it.id === id) return it; return null; }
function thingLocked(it) { if (it.jp) return ((S.jp && S.jp.st) || 0) < it.jp; if (it.cd) return ((S.code && S.code.st) || 0) < it.cd; if (it.el) return ((S.elem && S.elem.n) || 0) < it.el; return it.need && !(S.missions[it.cid + '.' + it.need] && S.missions[it.cid + '.' + it.need].done); }
function findTheme(id) { for (const cid in COUNTRIES) { const t = (COUNTRIES[cid].themes || {})[id]; if (t) return t; } return null; }
function allThemes() { const out = Object.keys(ROOM_THEMES).map(id => Object.assign({ id }, ROOM_THEMES[id])); for (const cid in COUNTRIES) for (const id in (COUNTRIES[cid].themes || {})) out.push(Object.assign({ id, cid }, COUNTRIES[cid].themes[id])); return out; }
const themeOf = id => ROOM_THEMES[id] || findTheme(id) || ROOM_THEMES.sun;

/* ----- the picture behind each part of the house, in the colours of its room colour ----- */
const GROUND = { snowy: '#F4F9FF', tent: '#EDC98A', outback: '#D9824A', night: '#3E7A5A', ocean: '#6FCFA0' };
function roomSvg(t, place, tid) {
  place = place || 'bedroom';
  let s = '<svg class="scene" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + t.sky[0] + '"/><stop offset="1" stop-color="' + t.sky[1] + '"/></linearGradient></defs>';
  const sky = (x, y, w, hh) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="6" fill="url(#rsky)"/>' + (t.night
    ? '<circle cx="' + (x + w * .76) + '" cy="' + (y + hh * .26) + '" r="' + (hh * .13) + '" fill="#FFF3B0"/><circle cx="' + (x + w * .8) + '" cy="' + (y + hh * .22) + '" r="' + (hh * .12) + '" fill="' + t.sky[0] + '"/><g fill="#fff"><circle cx="' + (x + w * .2) + '" cy="' + (y + hh * .2) + '" r="3"/><circle cx="' + (x + w * .42) + '" cy="' + (y + hh * .4) + '" r="2.500"/><circle cx="' + (x + w * .26) + '" cy="' + (y + hh * .66) + '" r="2.500"/><circle cx="' + (x + w * .6) + '" cy="' + (y + hh * .72) + '" r="3"/></g>'
    : '<circle cx="' + (x + w * .76) + '" cy="' + (y + hh * .27) + '" r="' + (hh * .14) + '" fill="#FFD23F"/><g fill="#fff"><ellipse cx="' + (x + w * .3) + '" cy="' + (y + hh * .34) + '" rx="' + (w * .16) + '" ry="' + (hh * .07) + '"/><ellipse cx="' + (x + w * .42) + '" cy="' + (y + hh * .28) + '" rx="' + (w * .1) + '" ry="' + (hh * .06) + '"/></g>');
  /* the wall and the floor carry on past the edges of the picture (EX0..EX1 across, EY0 up, EY1 down), so a screen of any shape is filled when the whole room is shown */
  const EX0 = -900, EX1 = 1900, EY0 = -1500, EY1 = 2100, EW = EX1 - EX0;
  const room = () => { let r = '<rect x="' + EX0 + '" y="' + EY0 + '" width="' + EW + '" height="' + (420 - EY0) + '" fill="' + t.wall + '"/>'; for (let x = EX0; x < EX1; x += 100) r += '<rect x="' + x + '" y="' + EY0 + '" width="50" height="' + (420 - EY0) + '" fill="' + t.wall2 + '"/>';
    r += '<rect x="' + EX0 + '" y="415" width="' + EW + '" height="' + (EY1 - 415) + '" fill="' + t.floor + '"/>'; for (let y = 452; y < EY1; y += 38) r += '<line x1="' + EX0 + '" y1="' + y + '" x2="' + EX1 + '" y2="' + y + '" stroke="' + t.line + '" stroke-width="3"/>';
    for (let i = -12; i < 26; i++) { const k = ((i % 4) + 4) % 4, x = 40 + i * 75 + (((i % 2) + 2) % 2) * 30; r += '<line x1="' + x + '" y1="' + (415 + k * 38) + '" x2="' + x + '" y2="' + (453 + k * 38) + '" stroke="' + t.line + '" stroke-width="3"/>'; }
    for (let row = 5; 415 + row * 38 < EY1; row++) for (let i = -3; i < 7; i++) { const x = 90 + i * 300 + (row % 3) * 110; r += '<line x1="' + x + '" y1="' + (415 + row * 38 - 1) + '" x2="' + x + '" y2="' + (453 + row * 38 - 1) + '" stroke="' + t.line + '" stroke-width="3"/>'; }
    return r + '<rect x="' + EX0 + '" y="404" width="' + EW + '" height="16" fill="#fff"/>'; };
  const rug = (cx, rx) => '<ellipse cx="' + cx + '" cy="520" rx="' + rx + '" ry="58" fill="' + t.rug + '" opacity=".85"/><ellipse cx="' + cx + '" cy="520" rx="' + (rx - 50) + '" ry="44" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" opacity=".8"/>';
  if (place === 'garden') {
    const ground = GROUND[tid] || '#7CCF8A', dark = t.night;
    s += '<rect x="' + EX0 + '" y="' + EY0 + '" width="' + EW + '" height="' + (2 - EY0) + '" fill="' + t.sky[0] + '"/><rect x="' + EX0 + '" width="' + EW + '" height="600" fill="url(#rsky)"/>' + (dark ? '<circle cx="820" cy="96" r="44" fill="#FFF3B0"/><circle cx="838" cy="84" r="40" fill="' + t.sky[0] + '"/><g fill="#fff"><circle cx="120" cy="70" r="3"/><circle cx="300" cy="40" r="2.500"/><circle cx="470" cy="96" r="3"/><circle cx="620" cy="50" r="2.500"/><circle cx="930" cy="190" r="2.500"/><circle cx="60" cy="190" r="2.500"/></g>'
      : '<circle cx="830" cy="96" r="50" fill="#FFD23F"/><g fill="#fff" opacity=".95"><ellipse cx="520" cy="84" rx="70" ry="20"/><ellipse cx="580" cy="68" rx="46" ry="18"/><ellipse cx="130" cy="120" rx="56" ry="16"/></g>');
    s += '<path d="M' + EX0 + ' 350Q-450 290 0 330Q200 270 420 310T1000 290Q1450 250 ' + EX1 + ' 320V420H' + EX0 + 'z" fill="' + ground + '" opacity=".55"/>';
    /* the house */
    s += '<g><path d="M70 196 240 84l170 112z" fill="' + t.rug + '"/><path d="M70 196 240 84l170 112" fill="none" stroke="#1B2A4E" stroke-opacity=".18" stroke-width="6"/><rect x="96" y="196" width="288" height="190" fill="' + t.wall + '"/><rect x="96" y="196" width="288" height="14" fill="' + t.wall2 + '"/>' +
      '<rect x="206" y="282" width="68" height="104" rx="8" fill="' + t.floor + '"/><circle cx="260" cy="338" r="5" fill="#FFC83D"/><rect x="122" y="232" width="62" height="62" rx="6" fill="#fff"/><rect x="128" y="238" width="50" height="50" fill="' + (dark ? '#FFE27A' : '#BFE8F8') + '"/><path d="M153 238v50M128 263h50" stroke="#fff" stroke-width="5"/>' +
      '<rect x="296" y="232" width="62" height="62" rx="6" fill="#fff"/><rect x="302" y="238" width="50" height="50" fill="' + (dark ? '#FFE27A' : '#BFE8F8') + '"/><path d="M327 238v50M302 263h50" stroke="#fff" stroke-width="5"/><rect x="316" y="110" width="30" height="56" fill="' + t.floor + '"/></g>';
    s += '<path d="M' + EX0 + ' 366Q-450 392 0 380Q250 350 500 372T1000 360Q1450 372 ' + EX1 + ' 362V' + EY1 + 'H' + EX0 + 'z" fill="' + ground + '"/>';
    for (let x = 430; x < EX1; x += 46) s += '<path d="M' + x + ' 372v-44l11-12 11 12v44z" fill="#fff" stroke="#D5DAE6" stroke-width="2"/>'; s += '<rect x="424" y="342" width="' + (EX1 - 424) + '" height="8" fill="#fff" stroke="#D5DAE6" stroke-width="1.500"/>';
    s += '<path d="M206 386q10 60-60 110t-70 104h170q-20-60 30-110t28-104z" fill="#F3E3C8" opacity=".9"/>';
    s += '<g fill="' + (tid === 'snowy' ? '#DCE9F8' : 'rgba(27,42,78,.08)') + '"><ellipse cx="640" cy="470" rx="60" ry="10"/><ellipse cx="860" cy="540" rx="70" ry="11"/><ellipse cx="420" cy="560" rx="50" ry="9"/></g>';
    return s + '</svg>';
  }
  s += room();
  if (place === 'play') {
    s += '<g><path d="M620 300V170q0-110 140-110t140 110v130z" fill="#fff"/><path d="M636 286V172q0-96 124-96t124 96v114z" fill="url(#rsky)"/>' + (t.night ? '<g fill="#fff"><circle cx="700" cy="150" r="3"/><circle cx="790" cy="120" r="2.500"/><circle cx="840" cy="210" r="3"/></g><circle cx="760" cy="180" r="22" fill="#FFF3B0"/>' : '<circle cx="820" cy="150" r="26" fill="#FFD23F"/><path d="M636 286v-40q60-36 124-8t124-12v60z" fill="#7CCF8A"/>') + '<path d="M760 76v210M636 196h248" stroke="#fff" stroke-width="10"/></g>';
    const cols = ['#FF7A6B', '#FFC83D', '#34C17B', '#19A7B8', '#8B7BEA']; let b = '<path d="M30 36Q300 96 590 40" stroke="#fff" stroke-width="4" fill="none"/>';
    for (let i = 0; i < 9; i++) { const x = 60 + i * 60, y = 44 + Math.sin(i / 8 * Math.PI) * 30; b += '<path d="M' + (x - 16) + ' ' + y + 'h32l-16 34z" fill="' + cols[i % 5] + '"/>'; } s += b;
    s += '<g><rect x="70" y="270" width="360" height="136" rx="10" fill="#fff"/>'; for (let i = 0; i < 3; i++) s += '<rect x="' + (84 + i * 116) + '" y="284" width="100" height="108" rx="8" fill="' + t.wall2 + '"/><rect x="' + (96 + i * 116) + '" y="330" width="76" height="52" rx="8" fill="' + cols[(i * 2) % 5] + '"/>'; s += '</g>';
    return s + rug(560, 300) + '</svg>';
  }
  if (place === 'lab') {
    s += '<g><rect x="70" y="60" width="420" height="230" rx="12" fill="#8A5A34"/><rect x="84" y="74" width="392" height="202" rx="6" fill="#2E5E4A"/><g stroke="#EAF6EF" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"><path d="M120 230l50-90 50 90z"/><circle cx="300" cy="150" r="34"/><ellipse cx="300" cy="150" rx="60" ry="18" transform="rotate(30 300 150)"/><ellipse cx="300" cy="150" rx="60" ry="18" transform="rotate(-30 300 150)"/><path d="M380 230h70M380 210h44M130 110h70"/></g><circle cx="300" cy="150" r="7" fill="#FFC83D"/></g>';
    s += '<g><rect x="560" y="300" width="400" height="20" rx="6" fill="#fff"/><path d="M584 320v86M936 320v86" stroke="#C9CEDA" stroke-width="14"/><rect x="600" y="330" width="320" height="60" rx="8" fill="' + t.wall2 + '"/>' +
      '<path d="M640 300v-34h-8v-10h36v10h-8v34q22 30-10 30t-10-30z" fill="#DFF3FF" stroke="#1B2A4E" stroke-opacity=".3" stroke-width="2"/><path d="M634 312q16 20 32 0z" fill="#34C17B"/>' +
      '<path d="M720 300v-70h24v70q0 12-12 12t-12-12z" fill="#DFF3FF" stroke="#1B2A4E" stroke-opacity=".3" stroke-width="2"/><path d="M722 270h20v30q0 10-10 10t-10-10z" fill="#FF7A6B"/><path d="M780 300v-54h24v54q0 12-12 12t-12-12z" fill="#DFF3FF" stroke="#1B2A4E" stroke-opacity=".3" stroke-width="2"/><path d="M782 280h20v20q0 10-10 10t-10-10z" fill="#8B7BEA"/></g>';
    s += '<g><circle cx="780" cy="130" r="64" fill="#fff"/><circle cx="780" cy="130" r="52" fill="url(#rsky)"/><path d="M780 78v104M728 130h104" stroke="#fff" stroke-width="8"/></g>';
    return s + rug(360, 250) + '</svg>';
  }
  if (place === 'attic') {
    s += '<path d="M-260 404 500 -76 1260 404H' + EX1 + 'V' + EY0 + 'H' + EX0 + 'V404z" fill="' + t.floor + '"/><path d="M-260 404 500 -76 1260 404" fill="none" stroke="' + t.line + '" stroke-width="12" stroke-linejoin="round"/><path d="M-406 404 500 -162 1406 404" fill="none" stroke="' + t.line + '" stroke-width="5" opacity=".7"/>';
    s += '<g><path d="M380 250V110q0-70 120-70t120 70v140z" fill="#fff"/><path d="M396 236V112q0-56 104-56t104 56v124z" fill="#141C44"/><g fill="#fff"><circle cx="440" cy="110" r="3"/><circle cx="480" cy="170" r="2.500"/><circle cx="530" cy="96" r="3"/><circle cx="570" cy="150" r="2.500"/><circle cx="520" cy="206" r="2.500"/><circle cx="436" cy="200" r="2"/></g><circle cx="560" cy="110" r="16" fill="#FFF3B0"/><circle cx="567" cy="105" r="14" fill="#141C44"/>' +
      '<path d="M440 110 480 170 530 96 570 150" stroke="#9FB4FF" stroke-width="2" fill="none" stroke-dasharray="3 5"/><path d="M500 56v180M396 150h208" stroke="#fff" stroke-width="9"/></g>';
    s += '<g fill="#FFE27A" opacity=".9"><circle cx="150" cy="330" r="5"/><circle cx="230" cy="300" r="4"/><circle cx="310" cy="336" r="5"/><circle cx="700" cy="330" r="5"/><circle cx="780" cy="300" r="4"/><circle cx="860" cy="336" r="5"/></g><path d="M110 322q120-50 240 6M660 322q120-50 240 6" stroke="#fff" stroke-width="2.500" fill="none" opacity=".8"/>';
    return s + rug(500, 280) + '</svg>';
  }
  s += rug(500, 290);
  s += '<g><rect x="96" y="76" width="236" height="206" rx="14" fill="#fff"/>' + sky(110, 90, 208, 178) + (t.night ? '' : '<path d="M110 268v-34q52-34 104-6t104-10v50z" fill="#7CCF8A"/>');
  s += '<path d="M214 90v178M110 179h208" stroke="#fff" stroke-width="10"/></g>';
  s += '<g><rect x="640" y="214" width="280" height="14" rx="5" fill="#B9793F"/><path d="M668 228v22l22-22zM892 228v22l-22-22z" fill="#9A632F"/></g>';
  return s + '</svg>';
}

/* ===== her explorer: a person she designs. Everything is drawn from the choices in S.me, in a 100 x 150 box ===== */
const SKIN = ['#FCE3C8', '#F3CFA5', '#E0AC7E', '#C68B5E', '#9C6A43', '#6B4426'];
const HAIRCOL = ['#1F1A17', '#4A2F1D', '#8A5A34', '#D9A441', '#C4532D', '#9AA3B5', '#E86AA6', '#3B6FD4'];
const OUTCOL = ['#19A7B8', '#E5484D', '#FF9A3D', '#FFC83D', '#34C17B', '#3B6FD4', '#8B7BEA', '#E86AA6'];
const HAIRS = [
  { id: 'short', name: 'Short', front: c => '<path d="M25 46q-3-30 25-31 28 1 25 31-4-12-12-16-12 6-26 3-8 3-12 13z" fill="' + c + '"/>' },
  { id: 'spiky', name: 'Spiky', front: c => '<path d="M25 46q-3-12 3-22l-4-9 10 4 3-10 8 8 6-10 5 10 9-6-1 11 9-2-5 10q5 10 2 26-4-12-12-16-12 6-26 3-8 3-12 13z" fill="' + c + '"/>' },
  { id: 'bob', name: 'Bob', back: c => '<path d="M23 46q-2-32 27-32t27 32v16q0 8-8 8H31q-8 0-8-8z" fill="' + c + '"/>', front: c => '<path d="M26 44q-1-26 24-27 25 1 24 27-8-14-24-14t-24 14z" fill="' + c + '"/>' },
  { id: 'long', name: 'Long', back: c => '<path d="M21 46q-2-33 29-33t29 33v44q-8 7-15 0V52H36v38q-7 7-15 0z" fill="' + c + '"/>', front: c => '<path d="M26 44q-1-26 24-27 25 1 24 27-6-12-16-15-14 8-28 4-3 4-4 11z" fill="' + c + '"/>' },
  { id: 'pony', name: 'Ponytail', back: c => '<path d="M70 24q20 4 18 34-1 14-10 18 4-16-2-30-4-8-10-10z" fill="' + c + '"/><circle cx="72" cy="27" r="4" fill="#FFC83D"/>', front: c => '<path d="M25 46q-3-30 25-31 28 1 25 31-4-12-12-16-12 6-26 3-8 3-12 13z" fill="' + c + '"/>' },
  { id: 'curly', name: 'Curly', back: c => '<g fill="' + c + '"><circle cx="24" cy="48" r="9"/><circle cx="76" cy="48" r="9"/><circle cx="23" cy="62" r="8"/><circle cx="77" cy="62" r="8"/></g>', front: c => '<g fill="' + c + '"><circle cx="30" cy="30" r="10"/><circle cx="42" cy="22" r="10"/><circle cx="56" cy="20" r="10"/><circle cx="69" cy="27" r="10"/><circle cx="75" cy="38" r="8"/><circle cx="25" cy="40" r="8"/><circle cx="50" cy="27" r="9"/></g>' },
  { id: 'afro', name: 'Afro', back: c => '<circle cx="50" cy="36" r="34" fill="' + c + '"/>', front: c => '<path d="M28 40q4-16 22-16t22 16q-10-8-22-8t-22 8z" fill="' + c + '"/>' },
  { id: 'braids', name: 'Braids', back: c => '<g fill="' + c + '">' + [0, 1, 2, 3, 4].map(i => '<circle cx="' + (24 - i * .6) + '" cy="' + (56 + i * 10) + '" r="6"/><circle cx="' + (76 + i * .6) + '" cy="' + (56 + i * 10) + '" r="6"/>').join('') + '</g><g fill="#E5484D"><circle cx="21.500" cy="103" r="3.500"/><circle cx="78.500" cy="103" r="3.500"/></g>', front: c => '<path d="M25 46q-3-30 25-31 28 1 25 31-6-14-25-18-19 4-25 18z" fill="' + c + '"/><path d="M50 16v12" stroke="#fff" stroke-width="1.500" opacity=".5"/>' },
  { id: 'buns', name: 'Buns', back: c => '<g fill="' + c + '"><circle cx="29" cy="20" r="11"/><circle cx="71" cy="20" r="11"/></g>', front: c => '<path d="M25 46q-3-30 25-31 28 1 25 31-4-12-12-16-12 6-26 3-8 3-12 13z" fill="' + c + '"/>' },
  { id: 'pigtails', name: 'Pigtails', back: c => '<g fill="' + c + '"><ellipse cx="19" cy="58" rx="8" ry="14"/><ellipse cx="81" cy="58" rx="8" ry="14"/></g><g fill="#FFC83D"><circle cx="23" cy="45" r="3.500"/><circle cx="77" cy="45" r="3.500"/></g>', front: c => '<path d="M25 46q-3-30 25-31 28 1 25 31-4-12-12-16-12 6-26 3-8 3-12 13z" fill="' + c + '"/>' },
  { id: 'shaved', name: 'Shaved', front: c => '<path d="M26.500 40q1-22 23.500-22t23.500 22q-7-12-23.500-12T26.500 40z" fill="' + c + '" opacity=".8"/>' },
  { id: 'scarf', name: 'Headscarf', back: c => '<path d="M24 60q-6 22 4 34h44q10-12 4-34z" fill="' + c + '"/>', front: c => '<path fill-rule="evenodd" d="M21 48q0-36 29-36t29 36q0 20-9 30H30q-9-10-9-30zM31 47q0 20 19 20t19-20q0-17-19-17T31 47z" fill="' + c + '"/>', cover: true }
];
/* her own clothes are chosen piece by piece and are all free: a top, bottoms and shoes, each with its own colour */
const BOTCOL = ['#B98A4E', '#3B6FD4', '#3E4A5E', '#E5484D', '#34C17B', '#8B7BEA', '#E86AA6', '#F2F4F8'];
const SHOECOL = ['#7A4A1E', '#1B2A4E', '#E5484D', '#F2F4F8', '#FFC83D', '#19A7B8'];
const EYECOL = ['#4A2F1D', '#1B2A4E', '#2F6FB8', '#3F8F5A', '#9A6B2A', '#6B7C93'];
const TOPS = [{ id: 'shirt', name: 'Shirt' }, { id: 'tee', name: 'T-shirt' }, { id: 'stripe', name: 'Stripy top' }, { id: 'hoodie', name: 'Hoodie' }, { id: 'sport', name: 'Sports top' }, { id: 'dress', name: 'Dress' }];
const BOTS = [{ id: 'shorts', name: 'Shorts' }, { id: 'trousers', name: 'Trousers' }, { id: 'skirt', name: 'Skirt' }, { id: 'long', name: 'Long skirt' }];
const SHOES = [{ id: 'boots', name: 'Boots' }, { id: 'trainers', name: 'Trainers' }, { id: 'sandals', name: 'Sandals' }];
const MOUTHS = [{ id: 'smile', name: 'Smile' }, { id: 'grin', name: 'Big grin' }, { id: 'gap', name: 'Gap tooth' }, { id: 'small', name: 'Little smile' }];
/* whole costumes cost stars and replace her own clothes while she wears them. 'explorer' means her own clothes */
const KINDS = [
  { id: 'explorer', name: 'My clothes', price: 0 }, { id: 'scientist', name: 'Scientist', price: 20 }, { id: 'artist', name: 'Artist', price: 20 }, { id: 'hero', name: 'Superhero', price: 30 }, { id: 'astronaut', name: 'Astronaut', price: 35 }
];
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = v => clamp(Math.round(v * k), 0, 255); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => ('0' + f(v).toString(16)).slice(-2)).join(''); };
function outfitSvg(m, col, skin) {
  const kind = m.kind, dk = shade(col, .78), INKC = '#1B2A4E', arm = (x1, y1, x2, y2, sleeve, hand) => '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + sleeve + '" stroke-width="10" stroke-linecap="round"/><circle cx="' + x2 + '" cy="' + (y2 + 2) + '" r="5.500" fill="' + hand + '"/>';
  const legs = (top, low, shoe) => '<rect x="38" y="106" width="10.500" height="30" rx="5" fill="' + low + '"/><rect x="51.500" y="106" width="10.500" height="30" rx="5" fill="' + low + '"/><rect x="36.500" y="104" width="27" height="15" rx="6" fill="' + top + '"/><ellipse cx="42" cy="139" rx="8" ry="4.500" fill="' + shoe + '"/><ellipse cx="58" cy="139" rx="8" ry="4.500" fill="' + shoe + '"/>';
  const torso = fill => '<path d="M34 80q0-8 9-8h14q9 0 9 8v28q0 5-5 5H39q-5 0-5-5z" fill="' + fill + '"/>';
  if (kind === 'scientist') return legs('#3E4A5E', '#3E4A5E', INKC) + arm(34, 80, 25, 104, '#fff', skin) + arm(66, 80, 75, 104, '#fff', skin) + torso(col) + '<path d="M34 80q0-8 9-8h3l4 12 4-12h3q9 0 9 8v38q0 4-4 4H38q-4 0-4-4z" fill="#fff" stroke="#D5DAE6" stroke-width="1"/><path d="M46 72l4 12 4-12" fill="' + col + '"/><path d="M50 86v34" stroke="#D5DAE6" stroke-width="1.500"/><g fill="#C9CEDA"><circle cx="53" cy="94" r="1.300"/><circle cx="53" cy="104" r="1.300"/></g><rect x="38" y="96" width="8" height="7" rx="1.500" fill="#EEF1F8" stroke="#D5DAE6" stroke-width=".8"/><path d="M40 96v-4" stroke="#3B6FD4" stroke-width="1.500" stroke-linecap="round"/>';
  if (kind === 'artist') return legs('#3B6FD4', '#3B6FD4', '#E5484D') + arm(34, 80, 25, 104, col, skin) + arm(66, 80, 75, 104, col, skin) + torso(col) + '<path d="M34 84h32M34 92h32" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M39 113V90q0-3 3-3h16q3 0 3 3v23z" fill="#3B6FD4"/><path d="M42 87V75M58 87V75" stroke="#3B6FD4" stroke-width="4"/><g><circle cx="45" cy="98" r="2.200" fill="#FFC83D"/><circle cx="55" cy="104" r="2.200" fill="#E5484D"/><circle cx="48" cy="108" r="1.800" fill="#34C17B"/></g>';
  if (kind === 'hero') return legs(dk, col, dk) + arm(34, 80, 25, 104, col, skin) + arm(66, 80, 75, 104, col, skin) + torso(col) + '<rect x="34" y="103" width="32" height="6" rx="2" fill="#FFC83D"/><path d="M50 82l3 6.500 7 .7-5.300 4.600 1.700 7L50 97l-6.400 3.800 1.700-7L40 89.200l7-.7z" fill="#FFC83D"/>';
  if (kind === 'astronaut') return legs('#F2F4F8', '#F2F4F8', col) + arm(34, 80, 25, 104, '#F2F4F8', '#F2F4F8') + arm(66, 80, 75, 104, '#F2F4F8', '#F2F4F8') + '<path d="M25 100l-4 6M75 100l4 6" stroke="' + col + '" stroke-width="10" stroke-linecap="round" opacity=".0"/>' + torso('#F2F4F8') + '<path d="M34 80q0-8 9-8h14q9 0 9 8" fill="none" stroke="' + col + '" stroke-width="3"/><rect x="41" y="86" width="18" height="13" rx="3" fill="#D9DEE8" stroke="#9AA3B5" stroke-width="1"/><circle cx="46" cy="92.500" r="2" fill="#E5484D"/><circle cx="52" cy="92.500" r="2" fill="#34C17B"/><rect x="34" y="104" width="32" height="5" rx="2" fill="' + col + '"/>';
  /* her own clothes */
  const bc = BOTCOL[m.bcol] || BOTCOL[0], sc = SHOECOL[m.scol] || SHOECOL[0], top = m.top || 'shirt', bot = m.bot || 'shorts', shoe = m.shoe || 'boots', leg = bot === 'trousers' ? bc : skin;
  let s = '<rect x="38" y="106" width="10.500" height="30" rx="5" fill="' + leg + '"/><rect x="51.500" y="106" width="10.500" height="30" rx="5" fill="' + leg + '"/>';
  if (shoe === 'sandals') s += '<ellipse cx="42" cy="139" rx="8" ry="4.500" fill="' + skin + '"/><ellipse cx="58" cy="139" rx="8" ry="4.500" fill="' + skin + '"/><path d="M35 142.500h14M51 142.500h14" stroke="' + sc + '" stroke-width="2.600" stroke-linecap="round"/><path d="M36 138q6-5 12 0M52 138q6-5 12 0" stroke="' + sc + '" stroke-width="2.800" fill="none" stroke-linecap="round"/>';
  else s += '<ellipse cx="42" cy="139" rx="8" ry="4.500" fill="' + sc + '"/><ellipse cx="58" cy="139" rx="8" ry="4.500" fill="' + sc + '"/>' +
    (shoe === 'boots' ? '<rect x="37.500" y="125" width="11.500" height="12" rx="3.500" fill="' + sc + '"/><rect x="51" y="125" width="11.500" height="12" rx="3.500" fill="' + sc + '"/>'
      : '<path d="M35.500 142h13M51.500 142h13" stroke="' + (sc === '#F2F4F8' ? '#9AA3B5' : '#fff') + '" stroke-width="2" stroke-linecap="round"/><path d="M40 136.500h4.500M56 136.500h4.500" stroke="' + (sc === '#F2F4F8' ? '#9AA3B5' : '#fff') + '" stroke-width="1.500" stroke-linecap="round"/>');
  s += bot === 'skirt' ? '<path d="M36 103h28l6 17q-20 5.500-40 0z" fill="' + bc + '"/>' : bot === 'long' ? '<path d="M36 103h28l5.500 28q-19.500 4.500-39 0z" fill="' + bc + '"/>' : '<rect x="36.500" y="104" width="27" height="15" rx="6" fill="' + bc + '"/>';
  const longSleeve = top === 'shirt' || top === 'stripe' || top === 'hoodie';
  if (top === 'hoodie') s += '<path d="M34 80q16-17 32 0z" fill="' + dk + '"/>';
  s += longSleeve ? arm(34, 80, 25, 104, col, skin) + arm(66, 80, 75, 104, col, skin)
    : arm(34, 80, 25, 104, skin, skin) + arm(66, 80, 75, 104, skin, skin) + '<path d="M34 80l-3.500 9.500M66 80l3.500 9.500" stroke="' + col + '" stroke-width="10.800" stroke-linecap="round"/>';
  s += torso(col);
  if (top === 'shirt') s += '<path d="M46 72l4 7 4-7" fill="' + shade(col, 1.25) + '"/><rect x="54" y="86" width="8" height="8" rx="1.500" fill="' + dk + '"/><rect x="34" y="102" width="32" height="5" rx="2" fill="#7A4A1E"/><rect x="47" y="101.500" width="6" height="6" rx="1" fill="#FFC83D" stroke="#5A3413" stroke-width=".9"/>';
  else if (top === 'tee') s += '<circle cx="50" cy="92" r="6" fill="' + shade(col, 1.3) + '"/><path d="M50 83.500v-2.500M50 100.500v2.500M41.500 92H39M58.500 92H61M44 86l-1.800-1.800M56 86l1.800-1.800M44 98l-1.800 1.800M56 98l1.800 1.800" stroke="' + shade(col, 1.3) + '" stroke-width="1.800" stroke-linecap="round"/>';
  else if (top === 'stripe') s += '<path d="M34 85h32M34 93h32M34 101h32" stroke="#fff" stroke-width="3.400" opacity=".85"/>';
  else if (top === 'hoodie') s += '<path d="M41 97h18v8q0 3-3 3H44q-3 0-3-3z" fill="' + dk + '"/><path d="M46.500 77v9M53.500 77v9" stroke="#fff" stroke-width="1.700" stroke-linecap="round"/><rect x="34" y="109" width="32" height="4" rx="2" fill="' + dk + '"/>';
  else if (top === 'sport') s += '<rect x="34" y="86" width="32" height="7" fill="#fff" opacity=".92"/><rect x="34" y="94.500" width="32" height="2.500" fill="' + dk + '"/>';
  else if (top === 'dress') s += '<path d="M34 98h32l7 24q-23 6-46 0z" fill="' + col + '"/><rect x="34" y="96.500" width="32" height="4" rx="2" fill="' + dk + '"/><path d="M30 119q20 5 40 0" stroke="' + shade(col, 1.25) + '" stroke-width="2" fill="none"/>';
  return s;
}
/* extras she can buy and wear, one for each place on her: head, face, neck, back and hand */
const EXTRAS = [
  { id: 'x-hat', slot: 'head', name: 'Explorer hat', price: 10, svg: '<ellipse cx="50" cy="26" rx="30" ry="7" fill="#E9B95C"/><path d="M32 26q2-20 18-20t18 20z" fill="#F4C97B"/><path d="M33 21.500h34v4.500H32.500z" fill="#C9643B"/>' },
  { id: 'x-cap', slot: 'head', name: 'Cap', price: 10, svg: '<path d="M28 30q0-22 22-22t22 22z" fill="#3B6FD4"/><path d="M66 27q16 0 18 7H58z" fill="#2A54A8"/><circle cx="50" cy="9" r="2.800" fill="#fff"/>' },
  { id: 'x-bow', slot: 'head', name: 'Bow', price: 8, svg: '<path d="M50 18 34 9v18zM50 18l16-9v18z" fill="#E86AA6"/><circle cx="50" cy="18" r="4.500" fill="#C94B88"/>' },
  { id: 'x-flowers', slot: 'head', name: 'Flower crown', price: 15, svg: '<path d="M27 30q23-12 46 0" stroke="#3FA36B" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#FF8FB1"><circle cx="31" cy="26" r="5"/><circle cx="50" cy="20" r="6"/><circle cx="69" cy="26" r="5"/></g><g fill="#fff"><circle cx="40" cy="21.500" r="4.500"/><circle cx="60" cy="21.500" r="4.500"/></g><g fill="#FFC83D"><circle cx="31" cy="26" r="1.800"/><circle cx="50" cy="20" r="2.200"/><circle cx="69" cy="26" r="1.800"/><circle cx="40" cy="21.500" r="1.600"/><circle cx="60" cy="21.500" r="1.600"/></g>' },
  { id: 'x-wizard', slot: 'head', name: 'Wizard hat', price: 20, svg: '<path d="M30 28 52-12l18 40z" fill="#6453C9"/><ellipse cx="50" cy="28" rx="30" ry="6.500" fill="#5140B0"/><g fill="#FFC83D"><circle cx="48" cy="12" r="2"/><circle cx="56" cy="20" r="1.600"/><circle cx="43" cy="21" r="1.400"/></g>' },
  { id: 'x-crown', slot: 'head', name: 'Crown', price: 25, svg: '<path d="M31 28V10l9.500 9L50 6l9.500 13L69 10v18z" fill="#FFC83D" stroke="#E9A416" stroke-width="1.500" stroke-linejoin="round"/><g fill="#E5484D"><circle cx="50" cy="22" r="2.500"/></g><g fill="#3B6FD4"><circle cx="39" cy="23" r="2"/><circle cx="61" cy="23" r="2"/></g>' },
  { id: 'x-helmet', slot: 'head', name: 'Space helmet', price: 30, over: true, svg: '<circle cx="50" cy="44" r="33" fill="#CDEBFF" opacity=".35" stroke="#F2F4F8" stroke-width="4"/><path d="M27 30q8-12 20-14" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/><rect x="34" y="70" width="32" height="8" rx="4" fill="#F2F4F8" stroke="#C9CEDA" stroke-width="1"/>' },
  { id: 'x-shades', slot: 'face', name: 'Sunglasses', price: 10, svg: '<rect x="32" y="42.500" width="15" height="10" rx="4.500" fill="#1B2A4E"/><rect x="53" y="42.500" width="15" height="10" rx="4.500" fill="#1B2A4E"/><path d="M47 46h6M32 46l-6-2M68 46l6-2" stroke="#1B2A4E" stroke-width="2" stroke-linecap="round"/>' },
  { id: 'x-scarf', slot: 'neck', name: 'Scarf', price: 8, svg: '<path d="M36 70q14 8 28 0v8q-14 8-28 0z" fill="#E5484D"/><path d="M58 76l6 20-9-2z" fill="#C0392B"/>' },
  { id: 'x-medal', slot: 'neck', name: 'Gold medal', price: 15, svg: '<path d="M42 72l8 16 8-16" stroke="#3B6FD4" stroke-width="3" fill="none"/><circle cx="50" cy="91" r="6" fill="#FFC83D" stroke="#E9A416" stroke-width="1.500"/>' },
  { id: 'x-pack', slot: 'back', name: 'Backpack', price: 12, back: '<rect x="27" y="74" width="46" height="34" rx="10" fill="#19A7B8"/>', svg: '<path d="M38 74v30M62 74v30" stroke="#0C7C8C" stroke-width="4" stroke-linecap="round"/>' },
  { id: 'x-cape', slot: 'back', name: 'Cape', price: 20, back: '<path d="M36 74q-18 30-14 62 28 8 56 0 4-32-14-62z" fill="#E5484D"/>', svg: '<path d="M38 73q12 6 24 0" stroke="#C0392B" stroke-width="3.500" fill="none" stroke-linecap="round"/>' },
  { id: 'x-wings', slot: 'back', name: 'Wings', price: 30, back: '<g fill="#fff" stroke="#B8A9FF" stroke-width="2"><path d="M34 84Q4 60 8 96q2 18 26 12z"/><path d="M66 84q30-24 26 12-2 18-26 12z"/></g>' },
  { id: 'x-lens', slot: 'hand', name: 'Magnifying glass', price: 12, svg: '<path d="M77 104l5 12" stroke="#7A4A1E" stroke-width="4" stroke-linecap="round"/><circle cx="74" cy="95" r="9" fill="#CDEBFF" stroke="#5A678A" stroke-width="3"/>' },
  { id: 'x-balloon', slot: 'hand', name: 'Balloon', price: 8, svg: '<path d="M75 104Q84 84 80 62" stroke="#5A678A" stroke-width="1.500" fill="none"/><ellipse cx="80" cy="46" rx="12" ry="15" fill="#FF7A6B"/><path d="M74 40q3-5 8-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  { id: 'x-wand', slot: 'hand', name: 'Magic wand', price: 15, svg: '<path d="M75 106 86 78" stroke="#7A4A1E" stroke-width="3" stroke-linecap="round"/><path d="M87 66l2.600 5.600 6 .6-4.500 4 1.400 6L87 79l-5.500 3.200 1.400-6-4.500-4 6-.6z" fill="#FFC83D" stroke="#E9A416" stroke-width="1"/>' }
];
const PRESETS = [{ skin: 1, hair: 'long', hc: 2, col: 0, top: 'tee', bot: 'skirt', bcol: 5, shoe: 'trainers', scol: 3, eye: 2 }, { skin: 4, hair: 'afro', hc: 0, col: 2, top: 'hoodie', bot: 'trousers', bcol: 1, shoe: 'trainers', scol: 2, eye: 0 },
  { skin: 2, hair: 'short', hc: 0, col: 5, top: 'shirt', bot: 'shorts', bcol: 0, shoe: 'boots', scol: 0, eye: 1 }, { skin: 5, hair: 'braids', hc: 0, col: 6, top: 'dress', bot: 'shorts', bcol: 6, shoe: 'sandals', scol: 4, eye: 0 },
  { skin: 0, hair: 'buns', hc: 4, col: 7, top: 'stripe', bot: 'trousers', bcol: 2, shoe: 'boots', scol: 1, eye: 3, freck: true }, { skin: 3, hair: 'spiky', hc: 1, col: 4, top: 'sport', bot: 'shorts', bcol: 2, shoe: 'trainers', scol: 5, eye: 0 }];
const newMe = p => Object.assign({ kind: 'explorer', top: 'shirt', bot: 'shorts', shoe: 'boots', bcol: 0, scol: 0, eye: 0, mouth: 'smile', lash: false, freck: false, aid: false, glasses: false, wear: {}, kinds: { explorer: true }, extras: {}, x: 50, y: 92, s: 1.9, f: false }, p);
/* draw her. o.hat: the room's hat (worn when she has none of her own); o.sleep: eyes shut */
function meSvg(m, o) {
  o = o || {}; const skin = SKIN[m.skin] || SKIN[1], hc = HAIRCOL[m.hc] || HAIRCOL[0], col = OUTCOL[m.col] || OUTCOL[0], hair = HAIRS.find(x => x.id === m.hair) || HAIRS[0], ec = EYECOL[m.eye] || EYECOL[0], worn = slot => EXTRAS.find(x => x.id === (m.wear || {})[slot]);
  const head = worn('head'), face = worn('face'), neck = worn('neck'), back = worn('back'), hand = worn('hand');
  let s = '<svg class="mesvg" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="143" rx="24" ry="4" fill="rgba(27,42,78,.15)"/>';
  if (back && back.back) s += back.back;
  if (hair.back) s += hair.back(hc);
  s += outfitSvg(m, col, skin) + '<rect x="45" y="64" width="10" height="12" rx="4" fill="' + shade(skin, .92) + '"/>';
  if (back && back.svg) s += back.svg;
  if (neck) s += neck.svg;
  s += '<circle cx="26" cy="48" r="5" fill="' + skin + '"/><circle cx="74" cy="48" r="5" fill="' + skin + '"/><ellipse cx="50" cy="45" rx="24" ry="25" fill="' + skin + '"/>';
  s += o.sleep ? '<path d="M37 49q4 3 8 0M55 49q4 3 8 0" stroke="#1B2A4E" stroke-width="2" fill="none" stroke-linecap="round"/>'
    : '<g class="eyes">' + [41, 59].map(x => '<ellipse cx="' + x + '" cy="48" rx="3.300" ry="4.100" fill="' + ec + '" stroke="#1B2A4E" stroke-width="1"/><ellipse cx="' + x + '" cy="48.300" rx="1.800" ry="2.300" fill="#1B2A4E"/><circle cx="' + (x + 1.2) + '" cy="46.400" r="1.100" fill="#fff"/>').join('') + '</g>' +
      (m.lash ? '<path d="M37.300 45l-2.600-1.500M38.600 43.300l-1.800-2.300M62.700 45l2.600-1.500M61.400 43.300l1.800-2.300" stroke="#1B2A4E" stroke-width="1.400" stroke-linecap="round"/>' : '');
  const mouth = m.mouth || 'smile';
  s += mouth === 'small' ? '<path d="M46 59q4 3 8 0" stroke="#1B2A4E" stroke-width="2" fill="none" stroke-linecap="round"/>'
    : mouth === 'grin' || mouth === 'gap' ? '<path d="M42 56.500q8 10.500 16 0z" fill="#7A2E3A" stroke="#1B2A4E" stroke-width="1.600" stroke-linejoin="round"/><path d="M43.800 57.400h12.400q-1 2.200-2.200 2.600h-8q-1.200-.4-2.200-2.600z" fill="#fff"/>' + (mouth === 'gap' ? '<rect x="48.300" y="57.200" width="3.400" height="3.200" fill="#7A2E3A"/>' : '')
    : '<path d="M43 58q7 6 14 0" stroke="#1B2A4E" stroke-width="2" fill="none" stroke-linecap="round"/>';
  s += '<ellipse cx="34" cy="56" rx="4.500" ry="2.800" fill="#FF9E8E" opacity=".55"/><ellipse cx="66" cy="56" rx="4.500" ry="2.800" fill="#FF9E8E" opacity=".55"/>';
  if (m.freck) s += '<g fill="' + shade(skin, .68) + '">' + [[33, 53], [36.500, 54.500], [31.500, 56.500], [67, 53], [63.500, 54.500], [68.500, 56.500], [47, 52.500], [53, 52.500]].map(q => '<circle cx="' + q[0] + '" cy="' + q[1] + '" r=".9"/>').join('') + '</g>';
  s += hair.front(hc);
  if (m.aid && !hair.cover) s += '<path d="M77.500 40.500q6 1.500 5 9-.8 5.500-4.500 7" stroke="#19A7B8" stroke-width="3.200" fill="none" stroke-linecap="round"/><circle cx="76.500" cy="50" r="2.200" fill="#19A7B8"/>';
  if (m.glasses && !face) s += '<g fill="rgba(255,255,255,.35)" stroke="#1B2A4E" stroke-width="1.800">' + (m.glasses === 'square' ? '<rect x="33" y="41.500" width="15.500" height="12.500" rx="3"/><rect x="51.500" y="41.500" width="15.500" height="12.500" rx="3"/>' : '<circle cx="41" cy="48" r="7.500"/><circle cx="59" cy="48" r="7.500"/>') + '</g><path d="M48.500 47h3" stroke="#1B2A4E" stroke-width="1.800"/>';
  if (face) s += face.svg;
  if (head) s += head.svg; else if (o.hat) s += '<g transform="translate(18 -18) scale(1.07)">' + o.hat + '</g>';
  if (hand) s += hand.svg;
  return s + '</svg>';
}
const meEl = (m, o, cls) => h('div', { class: 'me-pic ' + (cls || ''), html: meSvg(m, o) });

/* ----- buying anything: the subtraction is shown, as in the shop ----- */
function askBuy(name, artEl, price, buy, after) {
  const left = S.stars - price, can = left >= 0;
  const c = overlay(h('div', { class: 'card' }, artEl, h('h3', null, name),
    h('div', { class: 'sum' }, ic('star'), can ? S.stars + ' − ' + price + ' = ' + left : price + ' − ' + S.stars + ' = ' + (-left)),
    h('p', null, can ? 'You will have ' + left + ' stars left.' : 'You need ' + (-left) + ' more stars.'),
    h('div', { class: 'row' }, can ? h('button', { class: 'btn go big', onclick: () => { c.remove(); S.stars -= price; buy(); saveState(); sfx.great(); confetti(30); if (after) after(); } }, 'Buy it') : null,
      h('button', { class: 'btn quiet', onclick: () => { sfx.tap(); c.remove(); } }, can ? 'Not now' : 'OK'))));
  Speech.say(can ? name + '. It costs ' + price + ' stars. You will have ' + left + ' left.' : name + ' costs ' + price + ' stars. You need ' + (-left) + ' more.');
}

/* ----- the wardrobe: design her, change her clothes, buy and wear extras. first: she is choosing for the first time ----- */
function openWardrobe(onClose, first) {
  roomState(); let o, tab = first ? 'start' : 'body';
  const starEl = h('span', { class: 'starcount' }, S.stars), pic = h('div', { class: 'ward-pic' }), body = h('div', { class: 'ward-body' }), tabs = h('div', { class: 'ward-tabs' });
  const done = () => { saveState(); o.remove(); onClose(); };
  const show = () => { pic.innerHTML = ''; if (S.me) pic.append(meEl(S.me, null, 'big')); starEl.textContent = S.stars; };
  const sw = (cols, cur, set) => h('div', { class: 'sw-row' }, cols.map((c, i) => h('button', { class: 'sw' + (i === cur ? ' on' : ''), style: { background: c }, 'aria-label': 'Colour ' + (i + 1), onclick: () => { sfx.tap(); set(i); saveState(); render(); } })));
  const render = () => {
    show(); body.innerHTML = ''; tabs.innerHTML = ''; pic.style.display = tab === 'start' ? 'none' : '';
    if (tab === 'start') {
      body.append(h('h4', null, 'Choose your explorer'), h('div', { class: 'me-grid' }, PRESETS.map((p, i) => h('button', { class: 'me-card', 'data-i': i, 'aria-label': 'Explorer ' + (i + 1), onclick: () => { sfx.great(); S.me = newMe(p); tab = 'body'; saveState(); render(); Speech.say('Now make your explorer look just how you like.'); } }, meEl(newMe(p))))));
      return;
    }
    [['body', 'Me'], ['face', 'Face'], ['clothes', 'Clothes'], ['extras', 'Extras']].forEach(t => tabs.append(h('button', { class: 'btn ' + (tab === t[0] ? 'go' : 'quiet'), 'data-tab': t[0], onclick: () => { sfx.tap(); tab = t[0]; render(); } }, t[1])));
    const m = S.me;
    const cards = (list, key, attr, cls) => h('div', { class: 'me-grid small' }, list.map(x => h('button', { class: 'me-card' + ((m[key] || list[0].id) === x.id ? ' on' : ''), ['data-' + attr]: x.id, onclick: () => { sfx.tap(); m[key] = x.id; saveState(); render(); } },
      meEl(Object.assign({}, m, { [key]: x.id, kind: key === 'hair' || key === 'mouth' ? m.kind : 'explorer', wear: {} }), null, cls), h('span', { class: 'nm' }, x.name))));
    const flip = (key, label) => h('button', { class: 'btn ' + (m[key] ? 'go' : 'quiet'), 'data-flip': key, 'aria-pressed': m[key] ? 'true' : 'false', onclick: () => { sfx.tap(); m[key] = !m[key]; saveState(); render(); } }, label);
    if (tab === 'body') {
      body.append(h('h4', null, 'Skin'), sw(SKIN, m.skin, i => { m.skin = i; }), h('h4', null, 'Hair'), cards(HAIRS, 'hair', 'hair', 'headonly'),
        h('h4', null, (HAIRS.find(x => x.id === m.hair) || {}).cover ? 'Scarf colour' : 'Hair colour'), sw(HAIRCOL, m.hc, i => { m.hc = i; }));
    } else if (tab === 'face') {
      const g = m.glasses === true ? 'round' : m.glasses || 'no';
      body.append(h('h4', null, 'Eyes'), sw(EYECOL, m.eye || 0, i => { m.eye = i; }), h('h4', null, 'Mouth'), cards(MOUTHS, 'mouth', 'mouth', 'headonly'),
        h('h4', null, 'Glasses'), h('div', { class: 'sw-row' }, [['no', 'No glasses', false], ['round', 'Round', true], ['square', 'Square', 'square']].map(q => h('button', { class: 'btn ' + (g === q[0] ? 'go' : 'quiet'), 'data-glasses': q[0] === 'round' ? 'yes' : q[0], onclick: () => { sfx.tap(); m.glasses = q[2]; saveState(); render(); } }, q[1]))),
        h('h4', null, 'More'), h('div', { class: 'sw-row' }, flip('freck', 'Freckles'), flip('lash', 'Eyelashes'), flip('aid', 'Hearing aid')));
    } else if (tab === 'clothes') {
      body.append(h('h4', null, 'Outfit'),
        h('div', { class: 'me-grid' }, KINDS.map(k => { const own = !!m.kinds[k.id], on = m.kind === k.id;
          return h('button', { class: 'me-card' + (on ? ' on' : ''), 'data-kind': k.id, onclick: () => { if (own) { sfx.pop(); m.kind = k.id; saveState(); render(); return; }
            sfx.tap(); askBuy(k.name + ' clothes', meEl(Object.assign({}, m, { kind: k.id })), k.price, () => { m.kinds[k.id] = true; m.kind = k.id; }, render); } },
            meEl(Object.assign({}, m, { kind: k.id })), h('span', { class: 'nm' }, k.name), h('span', { class: 'pr' }, on ? 'On now' : own ? 'Tap to wear' : [ic('star'), k.price])); })));
      if (m.kind === 'explorer') body.append(h('h4', null, 'Top'), cards(TOPS, 'top', 'top', 'bodyonly'), h('h4', null, 'Top colour'), sw(OUTCOL, m.col, i => { m.col = i; }),
        h('h4', null, 'Bottoms'), cards(BOTS, 'bot', 'bot', 'bodyonly'), h('h4', null, 'Bottoms colour'), sw(BOTCOL, m.bcol || 0, i => { m.bcol = i; }),
        h('h4', null, 'Shoes'), cards(SHOES, 'shoe', 'shoe', 'bodyonly'), h('h4', null, 'Shoe colour'), sw(SHOECOL, m.scol || 0, i => { m.scol = i; }));
      else body.append(h('h4', null, 'Colour'), sw(OUTCOL, m.col, i => { m.col = i; }));
    } else {
      body.append(h('h4', null, 'Extras to wear'), h('div', { class: 'me-grid' }, EXTRAS.map(x => { const own = !!m.extras[x.id], on = m.wear[x.slot] === x.id;
        return h('button', { class: 'me-card' + (on ? ' on' : ''), 'data-extra': x.id, onclick: () => { if (own) { sfx.pop(); if (on) delete m.wear[x.slot]; else m.wear[x.slot] = x.id; saveState(); render(); return; }
          sfx.tap(); const w = Object.assign({}, m.wear); w[x.slot] = x.id; askBuy(x.name, meEl(Object.assign({}, m, { wear: w })), x.price, () => { m.extras[x.id] = true; m.wear[x.slot] = x.id; }, render); } },
          meEl(Object.assign({}, m, { wear: (() => { const w = {}; w[x.slot] = x.id; return w; })() })), h('span', { class: 'nm' }, x.name), h('span', { class: 'pr' }, on ? 'Wearing' : own ? 'Tap to wear' : [ic('star'), x.price])); })));
    }
  };
  o = overlay(h('div', { class: 'shop ward' }, h('div', { class: 'shop-top' }, h('h3', null, first ? 'Your explorer' : 'My explorer'), h('div', { class: 'pill' }, ic('star'), starEl), h('button', { class: 'btn go', onclick: () => { sfx.tap(); if (!S.me) { S.me = newMe(PRESETS[0]); } done(); } }, 'Done')),
    h('div', { class: 'ward-main' }, pic, h('div', { class: 'ward-side' }, tabs, body))));
  render(); if (first) Speech.say('Choose your explorer. You can change everything afterwards.');
  W.cur = { type: 'ward', pick: i => $('.me-card[data-i="' + i + '"]', body).click(), tab: t => $('.ward-tabs [data-tab="' + t + '"]', o).click(), tap: sel => $(sel, body).click(), buy: () => { const y = $$('.overlay').pop().querySelector('.btn.go'); if (y) y.click(); }, close: done };
}

/* ----- which part of the house? More parts open with gold stamps ----- */
function openHouse(onPick) {
  roomState(); const g = goldCount(); let o;
  const cards = PLACES.map(p => { const open = placeOpen(p), here = S.place === p.id;
    return h('button', { class: 'shop-item place' + (here ? ' own' : '') + (open ? '' : ' lock'), 'data-place': p.id, onclick: () => {
      if (!open) { sfx.soft(); Speech.say('The ' + p.name + ' opens when you have ' + p.gold + ' gold stamps. You have ' + g + '. A gold stamp is for a mission with every answer right first time.'); return; }
      sfx.pop(); o.remove(); onPick(p.id); } },
      art(open ? p.icon : 'locked', open ? 'sticker' : ''), h('span', { class: 'nm' }, p.name), h('span', { class: 'pr' }, here ? 'You are here' : open ? 'Go' : [ic('1st-place-medal'), g + ' of ' + p.gold])); });
  o = overlay(h('div', { class: 'shop house' }, h('div', { class: 'shop-top' }, h('h3', null, 'My home'), h('div', { class: 'pill' }, ic('1st-place-medal'), h('span', null, g)), h('button', { class: 'btn go', onclick: () => { sfx.tap(); o.remove(); } }, 'Done')),
    h('div', { class: 'shop-body' }, h('div', { class: 'shop-grid' }, cards), h('p', { class: 'note' }, 'Gold stamps open more of your home. You get one for a mission with every answer right first time.'))));
  saveState();
  W.cur = { type: 'house', go: id => $('.place[data-place="' + id + '"]', o).click(), close: () => o.remove() };
}

SCREENS.room = () => {
  roomState(); let R = roomState(), sel = null; const bub = bubble('', '');
  const sceneEl = h('div', { class: 'room-scene' }), layer = h('div', { class: 'room-layer' }), tray = h('div', { class: 'room-tray' }), tools = h('div', { class: 'room-tools' });
  /* the room is a place 5 wide and 3 high, bigger than a phone held upright: she drags it to look around and pinches or taps + and − to zoom (panZoom).
     Things sit at a place in the room, not on the screen, so the room is laid out the same on every device. --u is one hundredth of the room's height: things are sized from it */
  const stage = h('div', { class: 'room-stage' }, sceneEl, layer), view = h('div', { class: 'pz-view room-view' }, stage);
  const pz = panZoom(view, stage, { ratio: .6, skip: t => !!t.closest('.ritem'), on: (st, zoomed) => { if (zoomed) stage.style.setProperty('--u', (st.w * .006).toFixed(3) + 'px'); },
    limits: (vw, vh) => { const fit = Math.min(vw, vh / .6), cover = Math.max(vw, vh / .6), foot = $('.room-foot', scr);
      return { min: fit, max: Math.max(cover, fit * 2.2), start: Math.min(cover, fit * clamp(vh / vw / .6 * .55, 1, 2)), bars: [8.8 * remPx(), foot && foot.offsetHeight ? foot.offsetHeight + 1.1 * remPx() : 0] }; } });
  const lookAt = () => pz.reset(S.me ? S.me.x / 100 : .5, .5);
  const starEl = h('span', { class: 'starcount' }, S.stars), title = h('h2', null, '');
  const place = () => PLACES.find(p => p.id === S.place) || PLACES[0];
  const drawScene = () => { sceneEl.innerHTML = roomSvg(themeOf(R.theme), S.place, R.theme); scr.className = 'screen room t-' + R.theme + ' p-' + S.place + (themeLook(R.theme).sleep ? ' asleep' : ''); title.textContent = S.place === 'bedroom' ? S.name + "'s room" : place().name; };
  const select = it => { sel = it; $$('.ritem', layer).forEach(e => e.classList.toggle('sel', e._it === it)); drawTools(); };
  const drawTools = () => {
    tools.innerHTML = ''; if (!sel) { settle(); return; }
    const b = (label, icon, fn) => h('button', { class: 'btn quiet', onclick: () => { sfx.tap(); fn(); saveState(); draw(); select(sel); } }, ic(icon), label);
    tools.append(b('Bigger', 'plus', () => { sel.s = clamp((sel.s || 1) + .3, .7, 2.5); }), b('Smaller', 'minus', () => { sel.s = clamp((sel.s || 1) - .3, .7, 2.5); }), b('Flip', 'left-right-arrow', () => { sel.f = !sel.f; }),
      sel === S.me ? h('button', { class: 'btn quiet', onclick: () => { sfx.pop(); wardrobe(); } }, ic('t-shirt'), 'Dress up')
        : h('button', { class: 'btn quiet', onclick: () => { sfx.pop(); R.items.splice(R.items.indexOf(sel), 1); sel = null; saveState(); draw(); drawTools(); } }, ic('package'), 'Put away'));
    settle();
  };
  /* one thing in the room: the picture, a hat if it is alive, and whatever drifts in the air of this room colour */
  const piece = (it, inner, cls, head, i) => {
    const look = themeLook(R.theme), fl = h('div', { class: 'fl' }, inner);
    if (head) fl.append(h('div', { class: 'hat', html: HAT(look.hat), style: { left: head[0] + '%', top: head[1] + '%', width: head[2] + '%' } }));
    const e = h('div', { class: 'ritem ' + cls + (it === sel ? ' sel' : ''), style: { left: it.x + '%', top: it.y + '%', '--s': it.s || 1, '--d': (-(i % 7) * .37) + 's', 'z-index': Math.round(it.y * 10) } },
      h('div', { class: 'mv' }, fl), cls.includes('live') ? h('div', { class: 'fx fx-' + look.fx }, h('i'), h('i'), h('i')) : null);
    if (it.f) fl.style.transform = 'scaleX(-1)';
    e._it = it; layer.append(e);
    e.addEventListener('pointerdown', ev => {
      ev.preventDefault(); select(it); const box0 = layer.getBoundingClientRect(), sx = ev.clientX, sy = ev.clientY; let moved = false, last = ev, auto = 0;
      const offX = sx - (box0.left + it.x / 100 * box0.width), offY = sy - (box0.top + it.y / 100 * box0.height);
      const el = $$('.ritem', layer).find(n => n._it === it);
      const put = () => { const box = layer.getBoundingClientRect(); it.x = clamp((last.clientX - offX - box.left) / box.width * 100, 3, 97); it.y = clamp((last.clientY - offY - box.top) / box.height * 100, 8, 96); el.style.left = it.x + '%'; el.style.top = it.y + '%'; el.style.zIndex = Math.round(it.y * 10); };
      /* carried to the edge of the screen, the room slides along, so a thing can go all the way across */
      const edge = () => { auto = 0; if (!moved) return; const v = view.getBoundingClientRect(), m = Math.min(56, v.width * .14), dx = last.clientX < v.left + m ? 1 : last.clientX > v.right - m ? -1 : 0, dy = last.clientY < v.top + m ? 1 : last.clientY > v.bottom - m ? -1 : 0;
        if (!dx && !dy) return; const d = pz.nudge(dx * 9, dy * 9); if (d[0] || d[1]) { put(); auto = requestAnimationFrame(edge); } };
      const mv = m => { if (m.pointerId !== ev.pointerId) return; last = m; if (Math.hypot(m.clientX - sx, m.clientY - sy) > 6) moved = true; put(); if (!auto) auto = requestAnimationFrame(edge); };
      const up = m => { if (m.pointerId !== ev.pointerId) return; cancelAnimationFrame(auto); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        if (moved) { sfx.place(); saveState(); } else { sfx.tap(); el.classList.remove('trick'); void el.offsetWidth; el.classList.add('trick'); setTimeout(() => el.classList.remove('trick'), 900); } };   /* a tap makes it do its trick */
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    });
  };
  const draw = () => {
    layer.innerHTML = ''; const look = themeLook(R.theme);
    R.items.forEach((it, i) => { const th = findThing(it.id); if (!th) return; const mv = moveOf(th), head = headOf(th);
      piece(it, art(th.art, 'sticker'), (mv ? 'mover mv-' + mv : '') + (head ? ' live' : ''), head, i); });
    if (S.me) piece(S.me, meEl(S.me, { hat: look.hat, sleep: look.sleep }), 'me live mover mv-idle', null, 3);
    tray.innerHTML = '';
    const out = {}; PLACES.forEach(p => roomState(p.id).items.forEach(i => { out[i.id] = 1; }));
    const boxed = Object.keys(S.owned).filter(id => S.owned[id] && findThing(id) && !out[id]);
    boxed.forEach(id => tray.append(h('button', { class: 'chip', 'aria-label': 'Put out the ' + findThing(id).name, onclick: () => { sfx.pop(); const it = { id, x: clamp(Math.round(pz.spot().x), 6, 94), y: 72, s: 1 }; R.items.push(it); saveState(); draw(); select(it); } }, art(findThing(id).art))));
    tray.style.display = boxed.length ? '' : 'none';
  };
  const refresh = () => { starEl.textContent = S.stars; R = roomState(); drawScene(); draw(); drawTools(); say(); };
  const settle = () => { if (scr.isConnected) pz.apply(); };      /* the arrows keep clear of the box of things and the buttons for a chosen thing, which come and go */
  const wardrobe = first => openWardrobe(() => { sel = null; refresh(); W.cur = cur; }, first);
  const goPlace = id => { S.place = id; sel = null; saveState(); refresh(); lookAt(); say(); W.cur = cur; };
  view.addEventListener('pointerdown', e => { if (sel && !e.target.closest('.ritem')) { sel = null; $$('.ritem.sel', layer).forEach(x => x.classList.remove('sel')); drawTools(); } });
  const scr = h('div', { class: 'screen room' }, view,
    h('div', { class: 'topbar act-top' }, h('button', { class: 'round', 'aria-label': 'Back to the world map', onclick: () => { sfx.tap(); go('map'); } }, ic('world-map')),
      title, h('div', { class: 'pill' }, ic('star'), starEl),
      h('button', { class: 'btn tb', 'data-do': 'house', 'aria-label': 'My home', onclick: () => { sfx.pop(); openHouse(goPlace); } }, ic('house'), h('span', { class: 'lbl' }, 'Home')),
      h('button', { class: 'btn tb', 'data-do': 'me', 'aria-label': 'My explorer', onclick: () => { sfx.pop(); wardrobe(!S.me); } }, ic('t-shirt'), h('span', { class: 'lbl' }, 'Me')),
      h('button', { class: 'btn tb', 'data-do': 'shop', 'aria-label': 'Shop', onclick: () => { sfx.pop(); openShop(() => { refresh(); $('.room-hint', scr).classList.remove('gone'); W.cur = cur; }, () => pz.spot()); } }, ic('shopping-bags'), h('span', { class: 'lbl' }, 'Shop'))),
    h('div', { class: 'room-hint' }, kiwi(), bub), h('div', { class: 'room-foot' }, tools, tray), pz.ctl, Object.values(pz.arrows));
  const say = () => { const n = R.items.length, owned = Object.keys(S.owned).length;
    const fresh = PLACES.find(p => p.gold && placeOpen(p) && !(S.seen || {})[p.id]);
    if (fresh) { S.seen = S.seen || {}; S.seen[fresh.id] = true; saveState(); bub.set('New! The ' + fresh.name + ' is open. Tap Home.', 'Your gold stamps have opened a new part of your home: the ' + fresh.name + '. Tap Home to go there.'); sfx.great(); confetti(30); return; }
    bub.set(!S.me ? 'Tap Me to choose your explorer.' : !owned ? 'This is your home! Buy things in the shop.' : S.place === 'garden' && !n ? 'This is your garden. Put things out here too!' : n ? (pz.more() ? 'Slide the room to look around. Drag things to move them.' : 'Drag your things about. Tap one to see its trick.') : 'Tap a thing in your box to put it out.'); };
  const cur = { type: 'room', pz, shop: () => $('.room .topbar [data-do="shop"]').click(), me: () => $('.room .topbar [data-do="me"]').click(), house: () => $('.room .topbar [data-do="house"]').click() };
  show(scr); lookAt(); refresh();
  const hint = $('.room-hint', scr), hide = () => hint.classList.add('gone'); view.addEventListener('pointerdown', hide); setTimeout(hide, W.fast ? 400 : 7000);
  W.cur = cur;
  if (!S.me && !W.fast) wardrobe(true);     /* the first visit: choose an explorer */
};

/* spot: where in the room she is looking, so what she buys lands where she can see it */
function openShop(onClose, spot) {
  const R = roomState(); let o;
  const starEl = h('span', { class: 'starcount' }, S.stars), body = h('div', { class: 'shop-body' });
  const close = () => { o.remove(); onClose(); };
  const confirm = (name, artEl, price, buy) => askBuy(name, artEl, price, buy, () => { starEl.textContent = S.stars; render(); });
  const render = () => {
    body.innerHTML = '';
    shopShelves().forEach(sh => {
      const grid = h('div', { class: 'shop-grid' });
      sh.items.forEach(it => {
        const own = !!S.owned[it.id], lock = thingLocked(it);
        grid.append(h('button', { class: 'shop-item' + (own ? ' own' : '') + (lock ? ' lock' : ''), 'data-id': it.id, onclick: () => {
          if (own) { sfx.tap(); Speech.say('You already have the ' + it.name + '.'); return; }
          if (lock && it.jp) { sfx.soft(); Speech.say('Pass station ' + it.jp + ' on the Japanese train line to get this.'); return; }
          if (lock && it.el) { sfx.soft(); Speech.say('Learn ' + it.el + ' elements in order to get this.'); return; }
          if (lock && it.cd) { sfx.soft(); Speech.say('Finish station ' + it.cd + ' in the Code Lab to get this.'); return; }
          if (lock) { sfx.soft(); const m = COUNTRIES[it.cid].missions.find(m => m.id === it.need); Speech.say(m.nameSay ? ['Finish', m.nameSay, 'in ' + COUNTRIES[it.cid].name + ' to unlock this.'] : 'Finish ' + m.name + ' in ' + COUNTRIES[it.cid].name + ' to unlock this.'); return; }
          sfx.tap(); confirm(it.name, art(it.art, 'hero sticker'), it.price, () => { S.owned[it.id] = true; R.items.push({ id: it.id, x: spot ? clamp(Math.round(spot().x) + rnd(-12, 12), 6, 94) : rnd(30, 70), y: rnd(60, 80), s: 1 }); });
        } }, art(lock ? 'locked' : it.art, lock ? '' : 'sticker'), h('span', { class: 'nm' }, it.name), h('span', { class: 'pr' }, own ? 'You have it' : lock ? 'Locked' : [ic('star'), it.price])));
      });
      body.append(h('h4', null, sh.cat), grid);
    });
    const tg = h('div', { class: 'shop-grid' });
    allThemes().forEach(t => {
      const own = !!S.themes[t.id], on = R.theme === t.id, lock = t.need && thingLocked(t);
      tg.append(h('button', { class: 'shop-item theme' + (on ? ' own' : '') + (lock ? ' lock' : ''), 'data-id': 'theme-' + t.id, onclick: () => {
        if (lock) { sfx.soft(); Speech.say('Finish the ' + COUNTRIES[t.cid].name + ' challenge to unlock this.'); return; }
        if (own) { sfx.pop(); R.theme = t.id; saveState(); render(); return; }
        sfx.tap(); confirm(t.name + ' room', h('span', { class: 'swatch big', style: { background: 'linear-gradient(' + t.wall + ' 62%,' + t.floor + ' 62%)' } }), t.price, () => { S.themes[t.id] = true; R.theme = t.id; });
      } }, h('span', { class: 'swatch', style: { background: 'linear-gradient(' + t.wall + ' 62%,' + t.floor + ' 62%)' } }), h('span', { class: 'nm' }, t.name), h('span', { class: 'pr' }, on ? 'On now' : own ? 'Tap to use' : lock ? 'Locked' : [ic('star'), t.price])));
    });
    body.append(h('h4', null, 'Room colours'), tg);
  };
  o = overlay(h('div', { class: 'shop' }, h('div', { class: 'shop-top' }, h('h3', null, 'Shop'), h('div', { class: 'pill' }, ic('star'), starEl), h('button', { class: 'btn go', onclick: () => { sfx.tap(); close(); } }, 'Done')), body));
  render();
  W.cur = { type: 'shop', buy: id => { const b = $('.shop-item[data-id="' + id + '"]', body); b.click(); const y = $$('.overlay').pop().querySelector('.btn.go'); if (y) y.click(); }, close };
}
W.home = { HEADS, THEME_LOOK, HAT, PLACES, EXTRAS, KINDS, HAIRS, PRESETS, TOPS, BOTS, SHOES, MOUTHS, SKIN, HAIRCOL, OUTCOL, BOTCOL, SHOECOL, EYECOL, meSvg, newMe, goldCount, roomSvg, themeOf };
