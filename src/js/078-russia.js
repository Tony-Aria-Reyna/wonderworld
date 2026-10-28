/* ===== Russia: the fifth country. Everything here is content, not code.
   (B64, B32 and O, the small helpers, and labStep come from the earlier files.)
   Three labs she works herself: the rocket lab (every push has an equal push back), the orbit lab (an orbit is falling around the Earth) and the ice lab (why ice floats).
   Sources: Wikipedia, "Sputnik 1" (4 October 1957, 58 cm, 83.6 kg, one orbit in 96 minutes), "Vostok 1" (Gagarin, 12 April 1961, 108 minutes), "Valentina Tereshkova" (16 June 1963, 48 orbits, almost 3 days),
   "Lunokhod 1" (17 November 1970, eight wheels, the first rover on another world), "Lake Baikal" (1,642 m deep, ice 0.5 to 1.4 m, the Baikal seal), "Properties of water" (densest at 4 °C, about 9% more room as ice),
   "Matryoshka doll" (1890s, Zvyozdochkin and Malyutin); ESA Kids, "Space velocity" (28,000 km/h to orbit, 40,300 km/h to escape). ===== */

/* ----- hand-drawn pieces ----- */
const SPUTNIK_ART = B64('<g stroke="#9AA3B5" stroke-width="2.200" stroke-linecap="round"><path d="M27 31 5 52M31 35 13 61M35 37 31 62M25 27 3 36"/></g><circle cx="39" cy="24" r="16" fill="#D9DEE8" stroke="#1B2A4E" stroke-width="2"/><path d="M28 17q8-8 20-5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M23.500 27q14 7 31-3" stroke="#9AA3B5" stroke-width="1.500" fill="none"/>');
const LUNOKHOD_ART = B64('<path d="M20 30 14 12h26l6 18z" fill="#3B6FD4" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/><path d="M19 18h22M21 24h23M27 12l3 18M35 12l4 18" stroke="#9DB8F2" stroke-width="1.200"/>' +
  '<path d="M12 32h40l-5 13H17z" fill="#D9DEE8" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/><circle cx="46" cy="37" r="2.400" fill="#1B2A4E"/><circle cx="40" cy="37" r="2.400" fill="#1B2A4E"/><path d="M52 34l8-10" stroke="#1B2A4E" stroke-width="2" stroke-linecap="round"/><circle cx="60.500" cy="23" r="2.200" fill="#E5484D"/>' +
  '<g fill="#5A678A" stroke="#1B2A4E" stroke-width="1.800"><circle cx="15" cy="51" r="6"/><circle cx="27" cy="51" r="6"/><circle cx="39" cy="51" r="6"/><circle cx="51" cy="51" r="6"/></g><g fill="#D9DEE8"><circle cx="15" cy="51" r="2"/><circle cx="27" cy="51" r="2"/><circle cx="39" cy="51" r="2"/><circle cx="51" cy="51" r="2"/></g>');
const CRATER_ART = B32('<ellipse cx="16" cy="18" rx="13" ry="8" fill="#8E95A6"/><ellipse cx="16" cy="17" rx="10" ry="5.500" fill="#5F677B"/><path d="M6.500 16q9.500-7 19 0" stroke="#C3C8D4" stroke-width="1.800" fill="none" stroke-linecap="round"/><circle cx="7" cy="8" r="2" fill="#8E95A6"/><circle cx="26" cy="27" r="1.600" fill="#8E95A6"/>');
/* a matryoshka, drawn at any size inside the same box: nested dolls are the same doll, smaller */
const dollArt = k => B32('<g transform="translate(16 30) scale(' + k + ') translate(-16 -30)"><path d="M16 3q-6 0-6 6.500 0 3 2 5-5 3.500-5 9.500 0 6 3.500 6h11q3.500 0 3.500-6 0-6-5-9.500 2-2 2-5Q22 3 16 3z" fill="#E5484D" stroke="#1B2A4E" stroke-width="' + (1.2 / k).toFixed(2) + '" stroke-linejoin="round"/>' +
  '<circle cx="16" cy="9.500" r="4" fill="#FCE3C8"/><path d="M12 8.500q4-4 8 0" stroke="#7A4A1E" stroke-width="1.300" fill="none" stroke-linecap="round"/><circle cx="14.500" cy="9.800" r=".6" fill="#1B2A4E"/><circle cx="17.500" cy="9.800" r=".6" fill="#1B2A4E"/><path d="M14.800 11.500q1.200.9 2.400 0" stroke="#C0392B" stroke-width=".7" fill="none" stroke-linecap="round"/>' +
  '<ellipse cx="16" cy="23" rx="5" ry="5.500" fill="#FFC83D"/><circle cx="16" cy="22.500" r="2" fill="#E5484D"/><g fill="#3FA36B"><ellipse cx="12.800" cy="25" rx="1.800" ry=".9" transform="rotate(-30 12.800 25)"/><ellipse cx="19.200" cy="25" rx="1.800" ry=".9" transform="rotate(30 19.200 25)"/></g></g>');
const DOLL_4 = dollArt(1), DOLL_3 = dollArt(.78), DOLL_2 = dollArt(.58), DOLL_1 = dollArt(.4);
const DOMES_ART = B64('<rect x="2" y="2" width="60" height="60" rx="14" fill="#BFE3F7"/><path d="M2 50q30-8 60 0v2q0 10-14 10H16Q2 62 2 52z" fill="#fff"/><g stroke="#1B2A4E" stroke-width="1.300" stroke-linejoin="round"><path d="M12 52V36h8v16zM24 52V28h10v24zM38 52V34h8v18z" fill="#F3E3C8"/>' +
  '<path d="M16 22q-6 5-5 10 1 4 5 4t5-4q1-5-5-10z" fill="#3FA36B"/><path d="M29 10q-8 7-7 13 1 5 7 5t7-5q1-6-7-13z" fill="#E5484D"/><path d="M42 20q-6 5-5 10 1 4 5 4t5-4q1-5-5-10z" fill="#3B6FD4"/></g><path d="M29 10V5M16 22v-4M42 20v-4" stroke="#FFC83D" stroke-width="1.800" stroke-linecap="round"/>');
const letterArt = ch => B32('<rect x="3" y="3" width="26" height="26" rx="7" fill="#EEF3FF" stroke="#8B7BEA" stroke-width="1.600"/><text x="16" y="23.500" font-size="20" font-weight="700" font-family="Segoe UI,Roboto,Noto Sans,Arial,sans-serif" text-anchor="middle" fill="#1B2A4E">' + ch + '</text>');
/* how water particles sit: packed close in liquid water, locked in six-sided rings with gaps in ice */
const LATTICE_ART = B32([[16, 6], [24.700, 11], [24.700, 21], [16, 26], [7.300, 21], [7.300, 11]].map((p, i, a) => { const q = a[(i + 1) % 6]; return '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#9FC6EE" stroke-width="1.600"/>'; }).join('') +
  [[16, 6], [24.700, 11], [24.700, 21], [16, 26], [7.300, 21], [7.300, 11]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.200" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="1"/>').join(''));
const ORBIT_ART = B32('<circle cx="16" cy="17" r="8" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="1.200"/><path d="M11 13q4-2 6 1t5 0" stroke="#57BF7F" stroke-width="2.600" fill="none" stroke-linecap="round"/><ellipse cx="16" cy="17" rx="14" ry="13" fill="none" stroke="#8B7BEA" stroke-width="1.500" stroke-dasharray="1.500 3" stroke-linecap="round"/><circle cx="16" cy="4" r="2.600" fill="#D9DEE8" stroke="#1B2A4E" stroke-width="1"/>');

/* the rocket, for naming its parts: a capsule on top, tanks in the body, boosters on the sides, engines underneath */
const rocketSvg = (cx, base, k) => { const X = v => cx + v * k, Y = v => base - v * k, P = pts => pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('') + 'z';
  return '<g class="boost" stroke="#1B2A4E" stroke-width="' + (1.1 * k).toFixed(2) + '" stroke-linejoin="round"><path d="' + P([[-17, 6], [-17, 34], [-12, 44], [-7, 34], [-7, 6]]) + '" fill="#F2F4F8"/><path d="' + P([[17, 6], [17, 34], [12, 44], [7, 34], [7, 6]]) + '" fill="#F2F4F8"/>' +
    '<path d="' + P([[-16, 6], [-18, 0], [-6, 0], [-8, 6]]) + '" fill="#5A678A"/><path d="' + P([[16, 6], [18, 0], [6, 0], [8, 6]]) + '" fill="#5A678A"/></g>' +
    '<g stroke="#1B2A4E" stroke-width="' + (1.1 * k).toFixed(2) + '" stroke-linejoin="round"><path d="' + P([[-7, 6], [-7, 66], [7, 66], [7, 6]]) + '" fill="#fff"/><path class="fuel" d="' + P([[-5.500, 8], [-5.500, 64], [5.500, 64], [5.500, 8]]) + '" fill="#FFB02E" stroke="none"/>' +
    '<path d="' + P([[-7, 66], [-5, 72], [5, 72], [7, 66]]) + '" fill="#C9CEDA"/><path d="' + P([[-5, 72], [-5, 80], [0, 90], [5, 80], [5, 72]]) + '" fill="#E5484D"/><path d="' + P([[-6, 6], [-8, 0], [8, 0], [6, 6]]) + '" fill="#5A678A"/></g>' +
    '<circle cx="' + X(0) + '" cy="' + Y(78) + '" r="' + (2.2 * k) + '" fill="#BFE3F7" stroke="#1B2A4E" stroke-width="' + (.9 * k).toFixed(2) + '"/>'; };
const ROCKET_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="6" fill="#BFE3F7"/><path d="M0 92q25-5 50 0t50 0v8H0z" fill="#fff"/>' + rocketSvg(50, 92, .92) + '</svg>';
const ROCKET_PARTS = [
  { id: 'cap', label: 'Capsule', x: 50, y: 14, w: 12, fact: { text: 'The cosmonaut sits in the capsule, right at the top.' }, hint: { text: 'The capsule is the small red part at the top.' } },
  { id: 'tank', label: 'Fuel tank', x: 50, y: 50, w: 12, fact: { text: 'The tanks hold fuel, and oxygen to burn it.' }, hint: { text: 'The tanks are the long white body.' } },
  { id: 'boost', label: 'Booster', x: 28, y: 62, w: 12, fact: { text: 'Boosters give extra push. Then they drop away.' }, hint: { text: 'The boosters are strapped to the sides.' } },
  { id: 'eng', label: 'Engine', x: 50, y: 91, w: 12, fact: { text: 'The engine burns fuel and pushes hot gas down.' }, hint: { text: 'The engines are the dark bells at the bottom.' } }
];

/* ----- the scene behind the mission path: a winter evening, onion domes, birch trees, and a rocket climbing ----- */
const dome = (x, y, w, col, col2) => '<path d="M' + x + ' ' + (y - w * 1.25) + 'q' + (-w * .95) + ' ' + (w * .7) + ' ' + (-w * .78) + ' ' + (w * 1.05) + ' ' + (w * .12) + ' ' + (w * .32) + ' ' + (w * .78) + ' ' + (w * .32) + ' ' + (w * .66) + ' 0 ' + (w * .78) + ' ' + (-w * .32) + ' ' + (w * .17) + ' ' + (-w * .35) + ' ' + (-w * .78) + ' ' + (-w * 1.05) + 'z" fill="' + col + '"/>' +
  '<path d="M' + x + ' ' + (y - w * 1.2) + 'q' + (-w * .62) + ' ' + (w * .66) + ' ' + (-w * .36) + ' ' + (w * 1.26) + 'M' + x + ' ' + (y - w * 1.2) + 'q' + (w * .62) + ' ' + (w * .66) + ' ' + (w * .36) + ' ' + (w * 1.26) + 'M' + x + ' ' + (y - w * 1.2) + 'v' + (w * 1.28) + '" stroke="' + col2 + '" stroke-width="' + (w * .11) + '" fill="none" stroke-linecap="round"/>' +
  '<path d="M' + x + ' ' + (y - w * 1.25) + 'v' + (-w * .5) + '" stroke="#FFC83D" stroke-width="' + (w * .12) + '" stroke-linecap="round"/><circle cx="' + x + '" cy="' + (y - w * 1.85) + '" r="' + (w * .13) + '" fill="#FFC83D"/>';
const tower = (x, y, w, hgt, col, col2) => '<rect x="' + (x - w / 2) + '" y="' + (y - hgt) + '" width="' + w + '" height="' + hgt + '" fill="#F6ECDD"/><rect x="' + (x - w / 2) + '" y="' + (y - hgt) + '" width="' + w + '" height="' + (w * .22) + '" fill="#D9562F"/><rect x="' + (x - w * .14) + '" y="' + (y - hgt * .62) + '" width="' + (w * .28) + '" height="' + (hgt * .3) + '" rx="' + (w * .14) + '" fill="#5A678A"/>' + dome(x, y - hgt, w * .62, col, col2);
const birch = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-6 0q3-70-2-150h14q-4 80 4 150z" fill="#F7F4EC"/><g fill="#3A4660"><rect x="-5" y="-36" width="7" height="3" rx="1.500"/><rect x="0" y="-70" width="8" height="3" rx="1.500"/><rect x="-6" y="-104" width="6" height="3" rx="1.500"/><rect x="1" y="-128" width="6" height="3" rx="1.500"/></g>' +
  '<path d="M1-96q-22-14-34-40M3-118q18-16 28-44M0-140q-6-22 0-42" stroke="#F7F4EC" stroke-width="6" stroke-linecap="round" fill="none"/><g fill="#fff"><ellipse cx="-36" cy="-140" rx="24" ry="9"/><ellipse cx="32" cy="-166" rx="24" ry="9"/><ellipse cx="0" cy="-186" rx="26" ry="10"/></g></g>';
const RU_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="rusky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B7FD6"/><stop offset=".55" stop-color="#B9D6F5"/><stop offset="1" stop-color="#FDE9EF"/></linearGradient>' +
  '<filter id="rush" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".16"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#rusky)"/>' +
  '<g fill="#fff"><circle cx="90" cy="60" r="2.500"/><circle cx="250" cy="34" r="2"/><circle cx="420" cy="70" r="2.500"/><circle cx="640" cy="40" r="2"/><circle cx="760" cy="96" r="2.500"/><circle cx="930" cy="60" r="2"/><circle cx="560" cy="120" r="1.800"/><circle cx="170" cy="130" r="1.800"/></g>' +
  '<g transform="translate(846 150) rotate(34)"><path d="M0 60q-10 60 0 130 10-70 0-130z" fill="#fff" opacity=".7"/><path d="M-9 0q9-26 18 0v52h-18z" fill="#F2F4F8" stroke="#1B2A4E" stroke-width="2"/><path d="M-9 0q9-26 18 0z" fill="#E5484D" stroke="#1B2A4E" stroke-width="2"/><path d="M-9 40l-9 14h9zM9 40l9 14H9z" fill="#5A678A" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/><path d="M-6 52q6 22 12 0z" fill="#FFB02E"/></g>' +
  '<path filter="url(#rush)" d="M0 392Q170 350 340 376T680 362T1000 384V600H0z" fill="#E7F1FB"/>' +
  '<g filter="url(#rush)">' + tower(404, 400, 44, 86, '#3FA36B', '#F2D14B') + tower(600, 400, 44, 80, '#3B6FD4', '#fff') + tower(452, 400, 40, 112, '#E5484D', '#fff') + tower(552, 400, 40, 108, '#F2A33B', '#3FA36B') + tower(502, 400, 52, 150, '#D9562F', '#F2D14B') + '</g>' +
  '<path filter="url(#rush)" d="M0 430Q230 384 500 420T1000 404V600H0z" fill="#F4F9FF"/>' +
  '<g fill="#3F7A5E"><path d="M150 440l-22 44h44zM150 418l-17 34h34zM840 432l-24 48h48zM840 408l-18 36h36zM270 452l-16 32h32zM710 448l-16 32h32z"/></g><g fill="#fff"><path d="M150 418l-8 16h16zM840 408l-9 18h18z"/></g>' +
  '<path filter="url(#rush)" d="M0 540Q260 498 520 530T1000 514V600H0z" fill="#fff"/>' +
  '<g filter="url(#rush)">' + birch(914, 580, 1.15) + birch(70, 586, .95) + '</g>' +
  '<g fill="#fff" opacity=".9"><circle cx="210" cy="220" r="4"/><circle cx="330" cy="300" r="3"/><circle cx="700" cy="250" r="4"/><circle cx="800" cy="330" r="3"/><circle cx="120" cy="330" r="3"/><circle cx="930" cy="250" r="3.500"/><circle cx="480" cy="200" r="3"/><circle cx="610" cy="330" r="3"/></g>' +
  '</svg>';

/* ----- Russian words. Edge and Android both have a Russian voice; without one, the English voice sounds the word out from the spelling beside it ----- */
const RU = (t, phon, inline) => ({ t, lang: 'ru', fallback: phon, inline: !!inline });
const RUSSIAN = [
  { native: 'привет', rom: 'privet', en: 'hello', icon: 'waving-hand', phon: 'pree-vyet' },
  { native: 'спасибо', rom: 'spasibo', en: 'thank you', icon: 'folded-hands', phon: 'spah-see-bah' },
  { native: 'да', rom: 'da', en: 'yes', icon: 'thumbs-up', phon: 'dah' },
  { native: 'нет', rom: 'nyet', en: 'no', icon: 'thumbs-down', phon: 'nyet' },
  { native: 'кот', rom: 'kot', en: 'cat', icon: 'cat', phon: 'kot' },
  { native: 'космос', rom: 'kosmos', en: 'space', icon: 'milky-way', phon: 'koss-moss' }
];
wordSkill('russian', 'Russian words', 'ru', RUSSIAN);

/* ----- reading Cyrillic: each letter has one sound, so with a key she can read real words. Many are words she already knows ----- */
const CYR = { 'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'З': 'z', 'И': 'i', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Ш': 'sh' };
const CYR_OF = { a: 'А', b: 'Б', c: 'К', d: 'Д', e: 'Е', f: 'Ф', g: 'Г', i: 'И', k: 'К', l: 'Л', m: 'М', n: 'Н', o: 'О', p: 'П', r: 'Р', s: 'С', t: 'Т', u: 'У', v: 'В', w: 'В', y: 'И', z: 'З' };
const cyrRom = w => w.split('').map(c => CYR[c]).join('');
/* a name spelled letter by letter in Cyrillic, when every letter has a match here (the player: А-Р-И-А) */
const cyrName = name => { const out = String(name).toLowerCase().split('').map(c => CYR_OF[c]); return out.every(Boolean) ? out.join('') : null; };
/* [word, meaning, picture] */
const CWORDS = {
  1: [['КОТ', 'cat', 'cat'], ['ДОМ', 'house', 'house'], ['ЛУНА', 'moon', 'full-moon'], ['МАМА', 'mum', 'woman'], ['ПАПА', 'dad', 'man'], ['РОЗА', 'rose', 'rose'], ['СОК', 'juice', 'beverage-box'], ['НОС', 'nose', 'nose'], ['СУП', 'soup', 'pot-of-food'], ['ТОРТ', 'cake', 'birthday-cake'], ['ПАРК', 'park', 'national-park'], ['ЛЕС', 'forest', 'evergreen-tree']],
  2: [['РАКЕТА', 'rocket', 'rocket'], ['КОСМОС', 'space', 'milky-way'], ['РОБОТ', 'robot', 'robot'], ['БАНАН', 'banana', 'banana'], ['ЛИМОН', 'lemon', 'lemon'], ['ТИГР', 'tiger', 'tiger'], ['ВОДА', 'water', 'droplet'], ['ЗИМА', 'winter', 'snowflake'], ['ЗВЕЗДА', 'star', 'star'], ['ЛАМПА', 'lamp', 'light-bulb']],
  3: [['СПУТНИК', 'satellite', 'satellite'], ['КОСМОНАВТ', 'cosmonaut', 'woman-astronaut'], ['ШОКОЛАД', 'chocolate', 'chocolate-bar'], ['ТЕЛЕФОН', 'telephone', 'telephone-receiver'], ['ДИНОЗАВР', 'dinosaur', 't-rex'], ['ПИНГВИН', 'penguin', 'penguin'], ['КРОКОДИЛ', 'crocodile', 'crocodile'], ['МАТЕМАТИКА', 'maths', 'abacus']]
};
function cyrItem(word, pool) {
  const k = word[0], chars = k.split(''), rom = cyrRom(k), uniq = chars.filter((c, i) => chars.indexOf(c) === i);
  const keyChars = shuffle(uniq.concat(shuffle(Object.keys(CYR).filter(c => !uniq.includes(c))).slice(0, Math.max(3, 8 - uniq.length))));
  const gw = 'min(5.6rem,14vmin,' + (78 / chars.length).toFixed(1) + 'vmin)';
  const view = (hi, known) => el => { el.innerHTML = ''; el.append(h('div', { class: 'codewrap' },
    h('div', { class: 'glyphs' }, chars.map(c => h('div', { class: 'glyph kana cyr' + (hi === c ? ' hi' : ''), style: { '--gw': gw } }, h('b', null, c), h('small', null, known.includes(c) ? CYR[c] : '')))),
    h('div', { class: 'key kana cyr' }, keyChars.map(c => h('div', { class: 'k' }, h('b', null, c), '= ' + CYR[c]))))); };
  const same = pool.filter(x => x[0] !== k && x[0].length === k.length), others = shuffle(same.length >= 2 ? same : pool.filter(x => x[0] !== k)).slice(0, 2), opts = shuffle([word].concat(others));
  const steps = uniq.map((c, i) => { const ls = shuffle([CYR[c]].concat(shuffle(keyChars.filter(x => x !== c)).slice(0, 2).map(x => CYR[x])));
    return { type: 'choice', text: 'Find ' + c + ' in the key. Which sound?', say: 'Look at the key. Find the letter with the purple ring. Which sound does it make?', options: ls.map(x => ({ label: x })), answer: ls.indexOf(CYR[c]), visual: view(c, uniq.slice(0, i)), nudge: 'Not that one. Find the letter in the key.' }; });
  return { type: 'choice', text: 'Read the Russian letters. Which word?', say: 'These are Russian letters. Each one makes a sound. Some look like ours but say something different. Use the key to read the word. Which word is it?', options: opts.map(x => ({ label: cyrRom(x[0]) })), answer: opts.indexOf(word), visual: view(null, []), visualDone: view(null, uniq), steps,
    explain: { text: chars.join('-') + ' says ' + rom + '. It means ' + word[1] + '.', say: [RU(k.toLowerCase(), rom), 'means ' + word[1] + '.'], pic: word[2] } };
}
SKILLS.cyr = { name: 'Reading Russian letters', strand: 'world', start: 1, max: 3,
  gen(lv, ctx) { ctx = ctx || {}; const pool = CWORDS[clamp(lv, 1, 3)], used = ctx.used || (ctx.used = {}), free = pool.filter(x => !used['cy' + x[0]]), w = pick(free.length ? free : pool); used['cy' + w[0]] = 1; return cyrItem(w, pool); } };

/* ----- rockets and orbits ----- */
bankSkill('space', 'Rockets and orbits', 'science', [
  { pic: 'rocket', why: 'A rocket pushes gas down. The gas pushes it up.',
    ask: [{ t: 'A rocket engine pushes hot gas…', pic: 'rocket', h: 'Think of the flame under the rocket. Which way is it going?', o: [O('Down', 'down-arrow'), O('Up', 'up-arrow'), O('Sideways', 'right-arrow')] },
      { t: 'What pushes a rocket up?', pic: 'rocket', h: 'The engine pushes gas down, very fast. Every push has an equal push back.', o: [O('Its own gas', 'dashing-away'), O('The ground', 'desert'), O('The wind', 'wind-face')] }] },
  { pic: 'balloon', why: 'Every push has an equal push back.',
    ask: [{ t: 'A balloon shoots air out backwards. The balloon goes…', pic: 'balloon', h: 'The balloon pushes the air one way. The air pushes the balloon the other way.', o: [O('Forwards', 'right-arrow'), O('Backwards', 'left-arrow'), O('Nowhere', 'stop-sign')] },
      { t: 'In space there is no air. A rocket engine…', pic: 'milky-way', h: 'A rocket does not push on the air. It pushes on its own gas.', o: [O('Still works', 'thumbs-up'), O('Stops working', 'thumbs-down'), O('Melts', 'fire')] }] },
  { pic: ORBIT_ART, why: 'An orbit is falling around the Earth, and never landing.',
    ask: [{ t: 'What pulls a satellite towards the Earth?', pic: ORBIT_ART, h: 'It is the same pull that brings a thrown ball back down.', o: [O('Gravity', 'down-arrow'), O('Wind', 'wind-face'), O('Magnets', 'magnet')] },
      { t: 'A satellite in orbit is always…', pic: ORBIT_ART, h: 'It moves so fast that the ground curves away beneath it.', o: [O('Falling around Earth', 'counterclockwise-arrows-button'), O('Standing still', 'stop-sign'), O('Flying away', 'right-arrow')] }] },
  { pic: 'high-voltage', why: 'To stay in orbit takes 28,000 km an hour.',
    ask: [{ t: 'We launch a satellite too slowly. It…', pic: ORBIT_ART, h: 'Gravity never stops pulling. Without enough speed, the satellite comes down.', o: [O('Falls back down', 'down-arrow'), O('Orbits', 'counterclockwise-arrows-button'), O('Stops still', 'stop-sign')] },
      { t: 'To stay in orbit, a satellite must be very…', pic: ORBIT_ART, h: 'In the orbit lab, only one launch went all the way round. What was different about it?', o: [O('Fast', 'high-voltage'), O('Heavy', 'rock'), O('Cold', 'snowflake')] }] },
  { pic: SPUTNIK_ART, why: 'Sputnik was the first satellite, in 1957.',
    ask: [{ t: 'What was Sputnik?', pic: SPUTNIK_ART, h: 'It was a shiny metal ball with four aerials. It beeped as it circled the Earth.', o: [O('The first satellite', 'satellite'), O('The first aeroplane', 'airplane'), O('A planet', 'ringed-planet')] },
      { t: 'Who was the first person in space?', pic: 'rocket', h: 'He flew once around the Earth in 1961. It took 108 minutes.', o: [O('Yuri Gagarin', 'man-astronaut'), O('Valentina Tereshkova', 'woman-astronaut'), O('Isaac Newton', 'red-apple')] }] },
  { pic: 'woman-astronaut', why: 'Valentina Tereshkova was the first woman in space.',
    ask: [{ t: 'Who was the first woman in space?', pic: 'rocket', h: 'She flew in 1963, and circled the Earth 48 times.', o: [O('Valentina Tereshkova', 'woman-astronaut'), O('Yuri Gagarin', 'man-astronaut'), O('Sputnik', SPUTNIK_ART)] },
      { t: 'Tereshkova circled the Earth 48 times. That took almost…', pic: 'woman-astronaut', h: 'One trip round takes about an hour and a half. She made 48 trips.', o: [O('Three days', 'spiral-calendar'), O('Three minutes', 'stopwatch'), O('Three years', 'calendar')] }] }
], 'russia');

/* ----- water and ice ----- */
bankSkill('ice', 'Water and ice', 'science', [
  { pic: 'ice', why: 'Ice is lighter than water, so it floats.',
    ask: [{ t: 'Why does ice float on water?', pic: 'ice', h: 'Ice takes up more room than the water it came from. Same stuff, more room.', o: [O('It is lighter', 'feather'), O('It is colder', 'snowflake'), O('It is harder', 'rock')] },
      { t: 'When water freezes, it takes up…', pic: 'droplet', h: 'In ice, the particles lock into a pattern with gaps in it.', o: [O('More room', 'up-arrow'), O('Less room', 'down-arrow'), O('The same room', 'balance-scale')] }] },
  { pic: LATTICE_ART, why: 'In ice, water particles lock into a six-sided pattern.',
    ask: [{ t: 'In ice, the water particles are…', pic: 'ice', h: 'A solid keeps its shape because its particles hold their places.', o: [O('Locked in a pattern', LATTICE_ART), O('Zooming about', 'dashing-away'), O('Gone', 'cross-mark')] },
      { t: 'Water turning into ice is called…', pic: 'droplet', h: 'It happens when water cools to zero degrees.', o: [O('Freezing', 'snowflake'), O('Melting', 'sun'), O('Boiling', 'hot-springs')] }] },
  { pic: 'thermometer', why: 'Water freezes at 0 degrees, and is heaviest at 4.',
    ask: [{ t: 'Water freezes at…', pic: 'thermometer', h: 'The lake turned to ice when the top of the water reached this number.', o: [O('0 degrees', 'snowflake'), O('10 degrees', 'cloud'), O('100 degrees', 'hot-springs')] },
      { t: 'Water is at its heaviest at…', pic: 'droplet', h: 'In the ice lab, water at this temperature sank to the bottom of the lake.', o: [O('4 degrees', 'down-arrow'), O('0 degrees', 'snowflake'), O('40 degrees', 'sun')] }] },
  { pic: 'fish', why: 'Ice on top keeps the water below from freezing.',
    ask: [{ t: 'In winter, the fish in a frozen lake live…', pic: 'fish', h: 'The ice is a lid. Under it, the water stays liquid.', o: [O('Under the ice', 'down-arrow'), O('On the ice', 'up-arrow'), O('In the snow', 'snowman-without-snow')] },
      { t: 'A lake freezes from the…', pic: 'water-wave', h: 'Ice floats. So where does it stay?', o: [O('Top', 'up-arrow'), O('Bottom', 'down-arrow'), O('Middle', 'left-right-arrow')] }] },
  { pic: 'seal', why: 'Lake Baikal is the deepest lake on Earth.',
    ask: [{ t: 'Lake Baikal is the … lake on Earth.', s: 'Lake Baikal is the what lake on Earth?', pic: 'water-wave', h: 'It goes down more than one and a half kilometres.', o: [O('Deepest', 'down-arrow'), O('Hottest', 'fire'), O('Saltiest', 'salt')] },
      { t: 'The nerpa of Lake Baikal is a…', pic: 'water-wave', h: 'It is the only one of its kind that lives in fresh water. It breathes through holes in the ice.', o: [O('Seal', 'seal'), O('Shark', 'shark'), O('Whale', 'whale')] }] }
], 'russia');

bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: ORBIT_ART, hint: 'Each faster launch landed further away. A pattern like that lets us predict the next one.', why: 'A pattern lets us predict what comes next.',
    ask: [{ t: 'Each faster launch landed further away. Faster still, it lands…', o: [O('Even further', 'right-arrow'), O('Nearer', 'left-arrow'), O('In the same place', 'round-pushpin')] },
      { t: 'A pattern in our results helps us to…', o: [O('Predict', 'crystal-ball'), O('Forget', 'zzz'), O('Stop testing', 'stop-sign')] }] },
  { pic: 'thinking-face', hint: 'A wrong prediction is not a mistake. It shows us something we did not know.', why: 'A wrong prediction teaches us something new.',
    ask: [{ t: 'Your prediction was wrong. That means you…', o: [O('Learned something', 'light-bulb'), O('Must stop', 'stop-sign'), O('Broke the test', 'hammer')] },
      { t: 'Scientists like surprises because they…', o: [O('Show something new', 'light-bulb'), O('Are funny', 'grinning-face'), O('Waste time', 'hourglass-done')] }] },
  { pic: 'straight-ruler', hint: 'A number needs a unit. 28,000 what? Kilometres an hour.', why: 'A measurement needs a number and a unit.',
    ask: [{ t: 'Sputnik flew at 28,000 km an hour. "Km an hour" is the…', pic: SPUTNIK_ART, s: 'Sputnik flew at 28,000 kilometres an hour. Kilometres an hour is the what?', o: [O('Unit', 'straight-ruler'), O('Colour', 'artist-palette'), O('Name', 'name-badge')] },
      { t: 'Which one measures speed?', pic: 'rocket', o: [O('Km an hour', 'high-voltage'), O('Degrees', 'thermometer'), O('Kilograms', 'balance-scale')] }] }
], 'russia');

/* ----- the rocket lab: she fills the tanks, lights the engine, flies above the air and drops the boosters.
   The engine pushes hot gas down; the gas pushes the rocket up, just as hard (Newton's third law). It needs no air to push on, and it carries its own oxygen. ----- */
const ROCKET_LAB = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rocket on its launch pad, with arrows showing the gas pushed down and the rocket pushed up. In space, the Earth is seen below">' +
  '<rect class="sky" width="400" height="290" rx="14"/><g class="stars" fill="#fff"><circle cx="40" cy="40" r="1.800"/><circle cx="110" cy="90" r="1.400"/><circle cx="330" cy="50" r="1.800"/><circle cx="360" cy="150" r="1.400"/><circle cx="60" cy="190" r="1.400"/><circle cx="290" cy="230" r="1.600"/><circle cx="150" cy="30" r="1.300"/><circle cx="250" cy="110" r="1.300"/></g>' +
  '<g class="gnd"><path d="M0 250q100-14 200 0t200 0v40H0z" fill="#fff"/><rect x="150" y="246" width="100" height="8" rx="3" fill="#8E95A6"/><path d="M246 250V150h6v100zM246 170h-22M246 200h-22" stroke="#8E95A6" stroke-width="4" fill="none"/></g>' +
  '<defs><clipPath id="rkclip"><rect width="400" height="290" rx="14"/></clipPath></defs><g clip-path="url(#rkclip)"><g class="earth"><circle cx="200" cy="560" r="330" fill="#9AD8F0" opacity=".45"/><circle cx="200" cy="566" r="328" fill="#2F86C8"/><path d="M40 300q40-34 96-30 30 14 12 40-50 22-108-10zM214 262q60-22 120 4 26 20 8 44-70 16-132-12-12-22 4-36zM150 250q20-8 36 0-8 12-36 0z" fill="#57B26A"/><g fill="#fff" opacity=".85"><ellipse cx="110" cy="262" rx="44" ry="7"/><ellipse cx="300" cy="280" rx="52" ry="7"/><ellipse cx="206" cy="246" rx="30" ry="5"/></g></g></g>' +
  '<g class="rk"><g class="flame"><path d="M186 246q14 54 28 0z" fill="#FF7A1A"/><path d="M192 246q8 32 16 0z" fill="#FFD95E"/><path class="bflame" d="M168 246q10 30 18 0zM214 246q8 30 18 0z" fill="#FF9A3D"/></g>' + rocketSvg(200, 246, 1.7) + '</g>' +
  '<g class="push" font-size="12.500" font-weight="700"><g transform="translate(104 170)"><rect x="-58" y="-17" width="116" height="24" rx="12" fill="#fff"/><text y="0" text-anchor="middle" fill="#C0392B">gas pushed down</text><path d="M0 16v34m-9-11 9 13 9-13" stroke="#E5484D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
  '<g transform="translate(304 150)"><rect x="-60" y="-7" width="120" height="24" rx="12" fill="#fff"/><text y="10" text-anchor="middle" fill="#0C7C8C">rocket pushed up</text><path d="M0-16v-36m-9 11 9-13 9 13" stroke="#19A7B8" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>' +
  '<g font-weight="700"><rect x="12" y="12" width="138" height="34" rx="12" fill="#fff" opacity=".92"/><text class="spd" x="81" y="35" font-size="18" text-anchor="middle" fill="#1B2A4E">0 km/h</text></g></svg>';
function rocketSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab rocketlab fill', 'data-s': 'start', html: ROCKET_LAB })); }
async function rocketSim(stage, ui) {
  rocketSetup(stage); const g = $('.lab', stage), spd = $('.spd', g), T = t => () => { spd.textContent = t; };
  ui.prompt('A rocket on the launch pad. Fill its tanks!', 'This rocket is like the one that carried Sputnik into space. Its tanks are empty. Tap the button to fill them.');
  await labStep(ui, g, 'Fill the tanks', 'fuel', 'Fuel, and oxygen to burn it. Both go in.', 'A fire needs oxygen. In space there is no air, so a rocket carries its own oxygen, as well as its fuel.');
  await labStep(ui, g, 'Light the engine', 'fire', 'The engine pushes gas down. The gas pushes the rocket up!', 'The fuel burns, and makes hot gas. The engine pushes the gas down, very fast. And the gas pushes the rocket up, just as hard. Every push has an equal push back.', T('1,000 km/h'));
  await labStep(ui, g, 'Fly above the air', 'space', 'No air up here. The rocket pushes on its own gas.', 'Now the rocket is above the air, in space. The engine still works. It does not need air to push against. It pushes on its own gas.', T('10,000 km/h'));
  await labStep(ui, g, 'Drop the boosters', 'stage', 'Empty boosters drop away. Lighter means faster!', 'The boosters are empty, so they drop away. Now the rocket is lighter, and the same push makes it go faster. It reaches 28,000 kilometres an hour. That is fast enough to stay in orbit.', T('28,000 km/h'));
}

/* ----- the orbit lab: Newton's test. Sputnik is launched sideways from a very tall tower, faster each time.
   Gravity always pulls it down. Slow, it lands close by. Faster, it lands further round. At 28,000 km/h the ground curves away as fast as it falls: an orbit. At 40,000 km/h it leaves the Earth. ----- */
const ORBIT_PATHS = ['M200 75Q236 78 251 114', 'M200 75C286 75 322 160 269 215', 'M200 75A100 100 0 1 1 199.900 75', 'M200 75Q320 78 418 14'];
const ORBIT_LAB = '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Earth with a very tall tower. A satellite is launched sideways from the top, and its path is drawn">' +
  '<rect width="400" height="300" rx="14" fill="#1E2A5A"/><g fill="#fff" opacity=".7"><circle cx="30" cy="30" r="1.500"/><circle cx="110" cy="52" r="1.200"/><circle cx="350" cy="70" r="1.500"/><circle cx="370" cy="210" r="1.200"/><circle cx="40" cy="250" r="1.300"/><circle cx="330" cy="270" r="1.500"/><circle cx="70" cy="150" r="1.200"/></g>' +
  '<circle cx="200" cy="175" r="80" fill="#3BA7F0"/><path d="M150 150q20-26 44-12t30-10q20 16 6 34-22 6-36-4t-30 12q-16-4-14-20zM190 214q20-10 36 2t-8 26q-26 6-28-28z" fill="#57BF7F"/><circle cx="200" cy="175" r="80" fill="none" stroke="#BFE3F7" stroke-width="2.500"/>' +
  '<path d="M200 96V78" stroke="#C9CEDA" stroke-width="5" stroke-linecap="round"/><text x="188" y="92" font-size="10" font-weight="700" fill="#C9CEDA" text-anchor="end">tower</text>' +
  ORBIT_PATHS.map((d, i) => '<path class="otrail t' + (i + 1) + '" pathLength="1" d="' + d + '" fill="none" stroke="' + ['#FF9DA0', '#FFC83D', '#7BE08E', '#B8A9FF'][i] + '" stroke-width="3.500" stroke-linecap="round"/>').join('') +
  '<g class="sat" transform="translate(200 75)"><g stroke="#C9CEDA" stroke-width="1.600" stroke-linecap="round"><path d="M-4 3-14 12M-1 5-6 16M-5 0-16 4"/></g><circle r="7" fill="#F2F4F8" stroke="#1B2A4E" stroke-width="1.500"/></g>' +
  '<g font-weight="700"><rect x="12" y="12" width="150" height="34" rx="12" fill="#fff" opacity=".94"/><text class="spd" x="87" y="35" font-size="17" text-anchor="middle" fill="#1B2A4E">ready</text><text x="200" y="182" font-size="14" text-anchor="middle" fill="#fff">Earth</text></g></svg>';
function orbitSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab orbitlab fill', 'data-s': 'start', html: ORBIT_LAB })); }
/* fly the satellite along path i, drawing its trail behind it. The orbit goes round and round */
function orbitFly(g, i, loop) {
  const p = $('.t' + i, g), sat = $('.sat', g), L = p.getTotalLength(), T = loop ? 4200 : 2300, me = g._fly = (g._fly || 0) + 1; let t0 = null;
  g.querySelectorAll('.otrail').forEach(x => { if (x.style.opacity === '1') x.style.strokeDashoffset = 0; }); p.style.opacity = 1;   /* an earlier launch keeps its whole trail */
  const step = ts => { if (g._fly !== me || !g.isConnected) return; if (t0 == null) t0 = ts; const el = (ts - t0) / T, f = loop ? el % 1 : Math.min(1, el), q = p.getPointAtLength(f * L);
    sat.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ')'); p.style.strokeDashoffset = 1 - Math.min(1, el); if (loop || el < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
async function orbitSim(stage, ui) {
  orbitSetup(stage); const g = $('.lab', stage), spd = $('.spd', g), go = (i, t, loop) => () => { spd.textContent = t; orbitFly(g, i, loop); };
  ui.prompt('Sputnik is on a very tall tower. Launch it sideways!', 'A great scientist, Isaac Newton, thought of this test three hundred years ago. Sputnik sits on top of a very tall tower. We launch it sideways, faster each time. Gravity pulls it down, all the time. Tap the button for a slow launch.');
  await labStep(ui, g, 'Launch: 10,000 km/h', 'a', 'Gravity pulls it down. It lands close by.', 'At 10,000 kilometres an hour, gravity pulls it down, and it lands not far away.', go(1, '10,000 km/h'));
  await labStep(ui, g, 'Launch: 20,000 km/h', 'b', 'Faster. It falls further round the Earth.', 'Faster this time. It still falls. But the Earth is round, so the ground curves away, and it lands much further round.', go(2, '20,000 km/h'));
  await labStep(ui, g, 'Launch: 28,000 km/h', 'c', 'It falls all the way round. That is an orbit!', 'At 28,000 kilometres an hour, it is still falling. But the ground curves away just as fast as it falls. So it never lands. It goes round and round. That is an orbit. Sputnik went round the Earth every 96 minutes.', go(3, '28,000 km/h', true));
  await labStep(ui, g, 'Launch: 40,000 km/h', 'd', 'Too fast for gravity to hold. It flies away!', 'At 40,000 kilometres an hour, it is too fast for the Earth to hold. It flies off into space. That is how spacecraft leave for the Moon and the planets.', go(4, '40,000 km/h'));
}

/* ----- the ice lab: Lake Baikal through the winter. Cooling water gets heavier until 4 °C and sinks. At 0 °C it freezes: the particles lock into six-sided rings with gaps,
   so ice takes up about a tenth more room, is lighter than water, and floats. The ice is a lid: the water under it stays liquid, and the fish and the seals live through the winter. ----- */
const ICE_LAB = (() => {
  const mol = [[60, 120], [110, 150], [84, 190], [150, 110], [176, 170], [210, 132], [236, 196], [130, 216], [44, 226], [196, 232], [70, 156], [160, 196]].map((p, i) => '<circle class="mol" cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="1.200" style="animation-delay:-' + (i * .37).toFixed(2) + 's"/>').join('');
  const liq = [[-22, -18], [-6, -24], [12, -18], [24, -4], [-26, 0], [-10, -6], [6, -2], [20, 14], [-18, 16], [-2, 12], [10, 26], [-12, 28]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="1.200"/>').join('');
  const hex = [[0, -28], [24, -14], [24, 14], [0, 28], [-24, 14], [-24, -14]], lat = hex.map((p, i) => { const q = hex[(i + 1) % 6]; return '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#9FC6EE" stroke-width="3"/>'; }).join('') + hex.map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#CFEAFF" stroke="#1B2A4E" stroke-width="1.200"/>').join('');
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lake Baikal cut through from the side: the water, its particles, and the ice that forms on top">' +
    '<rect width="400" height="290" rx="14" fill="#DCEBFA"/><path d="M0 84V60q30-30 62-12t40 36zM268 84q20-40 52-34t40 34z" fill="#fff"/><g fill="#3F7A5E"><path d="M22 62l-10 22h20zM44 54l-10 30h20zM300 60l-10 24h20zM326 52l-11 32h22z"/></g>' +
    '<path d="M0 84h268v6q0 180-134 190Q20 270 0 180z" fill="#5FB6E8"/><path d="M0 180q20 90 134 100 60-4 96-40-70 34-150 10T0 150z" fill="#3D8FC9"/>' + mol +
    '<g class="sink"><path d="M40 108v80m-9-12 9 14 9-14" stroke="#1B4E8A" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<g class="life">' + V.pic('fish', 52, 196, 30) + V.pic('tropical-fish', 186, 208, 26) + '</g>' +
    '<g class="icel"><rect x="0" y="84" width="268" height="30" fill="#F4FBFF" stroke="#9FC6EE" stroke-width="2"/><path d="M20 96h36M90 104h44M170 94h40M226 106h26" stroke="#CFE6F7" stroke-width="2.500" stroke-linecap="round"/></g>' +
    '<g class="seal">' + V.pic('seal', 168, 54, 36) + '<ellipse cx="150" cy="86" rx="12" ry="4" fill="#3D8FC9"/></g>' +
    '<text class="deep" x="128" y="262" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">4°C down here</text>' +
    '<g transform="translate(336 176)"><circle r="54" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><path d="M-40 40-72 76" stroke="#1B2A4E" stroke-width="7" stroke-linecap="round"/><g class="liq">' + liq + '</g><g class="lat">' + lat + '</g>' +
    '<text class="zlab" y="76" font-size="13" font-weight="700" text-anchor="middle" fill="#1B2A4E">water, close up</text></g>' +
    '<g font-weight="700"><rect x="276" y="12" width="112" height="52" rx="12" fill="#fff" opacity=".94"/><text class="icap" x="332" y="31" font-size="11.500" text-anchor="middle" fill="#5A678A">top of the lake</text><text class="itemp" x="332" y="54" font-size="20" text-anchor="middle" fill="#1B2A4E">10°C</text></g></svg>';
})();
function iceSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab icelab fill', 'data-s': 'start', html: ICE_LAB })); }
async function iceSim(stage, ui) {
  iceSetup(stage); const g = $('.lab', stage), temp = $('.itemp', g), zl = $('.zlab', g), T = (t, z, cap) => () => { temp.textContent = t; if (z) zl.textContent = z; if (cap) $('.icap', g).textContent = cap; };
  ui.prompt('Lake Baikal in autumn. Cool the water!', 'This is Lake Baikal, the deepest lake on Earth, cut through so we can see inside. It is autumn, and the water is 10 degrees. The dots are water particles, moving about. Winter is coming. Tap the button to cool the water.');
  await labStep(ui, g, 'Cool the water', 'cool', 'At 4 degrees, water is at its heaviest. It sinks.', 'As the water at the top cools, its particles slow down and pack closer together. At 4 degrees, water is at its heaviest. So it sinks to the bottom of the lake.', T('4°C'));
  await labStep(ui, g, 'Cool it to zero', 'zero', 'At 0 degrees it freezes. The particles lock into a pattern.', 'The top of the lake cools to zero. Now the water freezes. Look in the magnifying glass. The particles lock into a six-sided pattern, with gaps in it. So ice takes up more room than the water it came from.', T('0°C', 'ice, close up'));
  await labStep(ui, g, 'Watch the ice', 'ice', 'More room, same stuff. Ice is lighter, so it floats.', 'Ice takes up more room, but it is the same amount of stuff. So ice is lighter than water. It floats on top.');
  await labStep(ui, g, 'Deep winter', 'deep', 'The ice is a lid. Below it, the water stays liquid.', 'By deep winter the ice is a metre thick. You could drive a truck across it. The ice is a lid that keeps the cold out. Under it, the water stays at 4 degrees, and the fish and the seals live through the winter. The seal keeps a hole open in the ice, to breathe.', T('−20°C', null, 'the air above'));
}

/* Moon looks for the coding grid: Lunokhod 1, the first rover on another world */
const MOON = { mover: LUNOKHOD_ART, goal: 'satellite-antenna', goalName: 'radio dish', flag: 'glowing-star', flagName: 'star', rock: CRATER_ART, cls: 'moon' };
GRAPH_SETS.russia = { noun: 'animals', one: 'animal', items: [{ name: 'tigers', art: 'tiger' }, { name: 'bears', art: 'bear' }, { name: 'seals', art: 'seal' }, { name: 'owls', art: 'owl' }, { name: 'reindeer', art: 'deer' }] };
THING_NAMES['nesting-dolls'] = 'dolls';
const PRIVET = 'pree-vyet';

COUNTRIES.russia = {
  cheers: ['Ura!'],   /* "hooray" in Russian, used only here */
  name: 'Russia', hello: 'Privet! Start with Space maths.', helloSay: [RU('привет', PRIVET), 'Start with Space maths.'], scene: RU_SCENE,
  thing: 'nesting-dolls', boat: 'rocket',
  videos: {
    rockets: { yt: 'Lti6a_YYQl0', title: 'How do rockets fly?', by: 'SciShow Kids', icon: 'rocket' },
    orbit: { yt: 'eQ4rOmlU3xI', title: 'How do satellites stay in place?', by: 'BBC Earth Science', icon: ORBIT_ART },
    ice: { yt: 'UukRgqzk-KE', title: 'Why does ice float in water?', by: 'TED-Ed', icon: 'ice' },
    woman: { yt: 'QwBI-7NJh2g', title: 'The first woman in space: Valentina Tereshkova', by: 'New Mexico Museum of Space History', icon: 'woman-astronaut' }
  },
  souvenirs: [
    { id: 'ru-doll', art: 'nesting-dolls', name: 'Nesting dolls', price: 20, need: 'm1' }, { id: 'ru-rocket', art: 'rocket', name: 'Rocket', price: 30, need: 'm1' },
    { id: 'ru-sputnik', art: SPUTNIK_ART, move: 'hover', name: 'Sputnik', price: 25, need: 'm2' }, { id: 'ru-cosmo', art: 'woman-astronaut', name: 'Cosmonaut', price: 30, need: 'm2' },
    { id: 'ru-seal', art: 'seal', name: 'Baikal seal', price: 25, need: 'm3' }, { id: 'ru-tiger', art: 'tiger', name: 'Amur tiger', price: 30, need: 'm3' },
    { id: 'ru-rover', art: LUNOKHOD_ART, move: 'slide', name: 'Moon rover', price: 25, need: 'm4' }, { id: 'ru-domes', art: DOMES_ART, name: 'Onion domes', price: 40, need: 'boss' }
  ],
  themes: { snowy: { name: 'Snowy room', price: 40, need: 'boss', wall: '#E4EEFA', wall2: '#CFE0F4', floor: '#8FA6C4', line: '#6F87A8', rug: '#E5484D', sky: ['#5B7FD6', '#FDE9EF'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['rockets'] }, { id: 'v2', after: ['boss'], choose: ['orbit', 'ice', 'woman'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Space maths', icon: 'satellite', sticker: 'satellite',
      intro: { text: 'Big numbers and solar panels. Count down to launch!', say: [RU('привет', PRIVET), 'Russia is the biggest country on Earth, and it sent the first satellite into space. Space needs big numbers. Ready?'] },
      rounds: [{ skill: 'place' }, { skill: 'area' }, { skill: 'place' }, { skill: '@review', or: 'temp' }, { skill: 'area' }, { skill: 'place' }, { skill: '@review', or: 'coords' }, { skill: 'area' }] },
    { id: 'm2', name: 'Rocket lab', icon: 'rocket', sticker: 'rocket',
      intro: { text: 'How does a rocket fly? How does Sputnik stay up?', say: 'In 1957, a rocket carried Sputnik into space. It was the first satellite ever. Today you find out how a rocket flies, and why a satellite stays up.' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on the rocket.', say: 'This is a space rocket. Put each name on the right part.', board: ROCKET_BOARD, items: ROCKET_PARTS, done: { text: 'You know your rocket. Now, the rocket lab!' } },
        { act: 'predict', q: 'Space has no air. Will a rocket engine still work?', qsay: 'Here is an experiment. A rocket engine pushes the rocket up. But in space there is no air at all. Will the engine still work up there? Make a prediction.',
          options: [O('Yes', 'thumbs-up'), O('No', 'thumbs-down'), O('Only slowly', 'snail')], answer: 0, setup: rocketSetup, sim: rocketSim,
          right: 'You predicted it! A rocket pushes on its own gas.', wrong: 'Surprise! It works. A rocket pushes on its own gas.',
          tryit: { icon: 'balloon', big: 'Make a balloon rocket!', text: 'Blow up a balloon. Let it go!', say: 'Now try it. Blow up a balloon, and hold the end shut. Then let it go. The air rushes out one way, and the balloon shoots off the other way. That is how a rocket works.' } },
        { skill: 'space' },
        { act: 'order', text: 'Firsts in space. Tap in order.', say: 'Russia was first into space, again and again. Tap the firsts in order, starting with the earliest.',
          steps: [{ art: SPUTNIK_ART, label: '1957: Sputnik', say: 'In 1957, Sputnik became the first satellite.' }, { icon: 'man-astronaut', label: '1961: Yuri Gagarin', say: 'In 1961, Yuri Gagarin became the first person in space.' }, { icon: 'woman-astronaut', label: '1963: Valentina Tereshkova', say: 'In 1963, Valentina Tereshkova became the first woman in space.' }, { art: LUNOKHOD_ART, label: '1970: Moon rover', say: 'In 1970, Lunokhod became the first rover to drive on the Moon.' }],
          hints: ['Look at the years. Which is the smallest number?', 'Next: the first person in space.', 'Then the first woman in space.', 'Last, the rover on the Moon.'] },
        { act: 'predict', q: 'We launch Sputnik sideways, very fast. What happens?', qsay: 'Here is another experiment. Sputnik sits on top of a very tall tower. We launch it sideways, as fast as a rocket can go. Gravity is pulling it down. What do you think happens? Make a prediction.',
          options: [O('It circles the Earth', 'counterclockwise-arrows-button'), O('It falls straight down', 'down-arrow'), O('It stops still', 'stop-sign')], answer: 0, setup: orbitSetup, sim: orbitSim,
          right: 'You predicted it! Fast enough, and it circles the Earth.', wrong: 'Surprise! Fast enough, and it circles the Earth.',
          tryit: { icon: 'softball', big: 'Throw it faster!', text: 'Throw a ball gently. Then throw it harder.', say: 'Now try it, outside. Throw a ball gently, straight out. Then throw it harder. The faster it goes, the further away it lands. A satellite is thrown so fast that it never lands.' } },
        { skill: 'space' }, { skill: 'space' }, { skill: 'scithink' }, { skill: 'scithink' }] },
    { id: 'm3', name: 'Privet!', nameSay: RU('привет', PRIVET, true), icon: 'nesting-dolls', sticker: 'nesting-dolls',
      intro: { text: 'Find Russia, speak Russian, and freeze a lake!', say: 'Time to find Russia on the map, learn some Russian words, and find out why a frozen lake is full of life.' },
      rounds: [
        { act: 'findmap', text: 'Where is Russia? Tap it.', say: 'This is the top of Asia and Europe. Where is Russia? Tap it.', view: [530, 30, 390, 175], targets: ['643', '156', '398', '496'], answer: '643',
          hint: { text: 'Russia is the biggest country of all, right across the top.' }, done: { text: 'You found Russia! The biggest country on Earth.', say: 'You found Russia! It is the biggest country on Earth. It is so wide that it has eleven time zones.' } },
        { act: 'meet', text: 'Tap each card to hear Russian.', say: 'People in Russia speak Russian. Tap each card to hear the word.', lang: 'ru', words: RUSSIAN },
        { skill: 'russian' }, { skill: 'russian' },
        { act: 'predict', q: 'Lake Baikal freezes in winter. Where does the ice form?', qsay: 'Here is an experiment. Lake Baikal, in Russia, is the deepest lake on Earth. In winter it freezes. Where do you think the ice forms? Make a prediction.',
          options: [O('On top', 'up-arrow'), O('At the bottom', 'down-arrow'), O('All the way through', 'ice')], answer: 0, setup: iceSetup, sim: iceSim,
          right: 'You predicted it! Ice floats, so the lake freezes on top.', wrong: 'Surprise! Ice floats, so the lake freezes on top.',
          tryit: { icon: 'ice', big: 'Float an ice cube!', text: 'Put an ice cube in a glass of water.', say: 'Now try it. Put an ice cube in a glass of water. Does it sink, or float? Look from the side. A little of it sticks up above the water: about one tenth.' } },
        { skill: 'ice' }, { skill: 'ice' },
        { act: 'match', text: 'Match each animal to its fact.', pairs: [
          { a: { art: 'tiger', label: 'Amur tiger' }, b: { art: 'cat', label: 'Biggest cat' }, text: 'The Amur tiger is the biggest cat on Earth.' },
          { a: { art: 'seal', label: 'Nerpa' }, b: { art: 'water-wave', label: 'Lives in a lake' }, text: 'The nerpa is the only seal that lives in fresh water.' },
          { a: { art: 'bear', label: 'Brown bear' }, b: { art: 'zzz', label: 'Sleeps all winter' }, text: 'A brown bear sleeps through the winter in its den.' },
          { a: { art: 'deer', label: 'Reindeer' }, b: { art: 'snowflake', label: 'Digs in snow' }, text: 'Reindeer dig through the snow to find food.' }] },
        { skill: 'russian' }] },
    { id: 'm4', name: 'Read and code', icon: 'abacus', sticker: 'full-moon',
      intro: { text: 'Read Russian letters. Then drive a rover on the Moon!', say: 'Russian is written in different letters. With a key, you can read them. Then you will drive the first rover on the Moon.' },
      rounds: [
        { act: 'match', text: 'Trick letters! Match each to its sound.', say: 'Some Russian letters look like ours, but say something different. Match each letter to its sound.', pairs: [
          { a: { art: letterArt('Р'), label: 'Looks like P' }, b: { art: 'rocket', label: 'r for rocket' }, text: 'This letter looks like a P. It says r.' },
          { a: { art: letterArt('С'), label: 'Looks like C' }, b: { art: 'sun', label: 's for sun' }, text: 'This letter looks like a C. It says s.' },
          { a: { art: letterArt('Н'), label: 'Looks like H' }, b: { art: 'nose', label: 'n for nose' }, text: 'This letter looks like an H. It says n.' },
          { a: { art: letterArt('В'), label: 'Looks like B' }, b: { art: 'violin', label: 'v for violin' }, text: 'This letter looks like a B. It says v.' }] },
        { skill: 'cyr' }, { skill: 'cyr' },
        { skill: 'cyr', fixed: () => { const nk = S.name.length >= 2 && S.name.length <= 9 ? cyrName(S.name) : null, pool = CWORDS[2].concat(CWORDS[1]);
          const it = cyrItem(nk ? [nk, S.name, 'star-struck'] : CWORDS[2][0], nk ? pool.concat([[nk, S.name, 'star-struck']]) : CWORDS[2]); it.text = 'One more word. Read it!';
          if (nk) it.explain = { text: nk.split('').join('-') + ' says ' + S.name + '. That is you!', say: [RU(nk.toLowerCase(), S.name), 'That is you!'], pic: 'star-struck' }; return it; } },
        { act: 'order', text: 'Open the dolls. Biggest first.', say: 'These are matryoshka dolls. Each one opens, and a smaller one is inside. Tap them in order, from the biggest to the smallest.',
          steps: [{ art: DOLL_4, label: 'Holds 3 dolls', say: 'The biggest doll holds all three of the others.' }, { art: DOLL_3, label: 'Holds 2 dolls', say: 'Inside her is the next one. She holds two.' }, { art: DOLL_2, label: 'Holds 1 doll', say: 'And inside her, a smaller one, which holds just one.' }, { art: DOLL_1, label: 'Holds none', say: 'The smallest doll does not open at all.' }],
          hints: ['The biggest doll has the most dolls inside her.', 'Next: the one that fits just inside her.', 'Smaller again. She holds only one.', 'Last is the tiny one in the middle.'] },
        { act: 'code', look: MOON, text: 'Drive the rover to the radio dish.', say: 'This is Lunokhod, the first rover on the Moon. People on Earth drove it by sending it commands. Count the squares to the radio dish. Tap or drag arrows into the boxes to make a path. Then tap Go.', cols: 5, rows: 3, start: [0, 2], goal: [4, 0], rocks: [[1, 1], [3, 2], [4, 1]], slots: 7,
          path: [[0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [3, 0], [4, 0]], legs: [[2, 2], [2, 0], [4, 0]], solution: [['r'], ['r'], ['u'], ['u'], ['r'], ['r']] },
        { act: 'code', look: MOON, text: 'Drive around the craters!', say: 'This one is longer. Steer the rover around the craters.', cols: 5, rows: 4, start: [4, 3], goal: [0, 0], rocks: [[3, 3], [4, 1], [3, 1], [1, 1], [1, 2]], slots: 9,
          path: [[4, 3], [4, 2], [3, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]], legs: [[4, 2], [2, 2], [2, 0], [0, 0]], solution: [['u'], ['l'], ['l'], ['u'], ['u'], ['l'], ['l']] },
        { act: 'code', look: MOON, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long drive, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [5, 4], goal: [0, 0], rocks: [[1, 4], [3, 2], [5, 1], [1, 0]], slots: 4, repeat: true,
          path: [[5, 4], [4, 4], [3, 4], [2, 4], [2, 3], [2, 2], [2, 1], [1, 1], [0, 1], [0, 0]], legs: [[2, 4], [2, 1], [0, 1], [0, 0]], solution: [['l', 3], ['u', 3], ['l', 2], ['u', 1]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'trophy',
      intro: { text: 'Show everything you know about Russia!', say: 'The big one! Show everything you have learned in Russia.' },
      rounds: [{ skill: 'place' }, { skill: 'space' }, { skill: 'area' }, { skill: 'ice' }, { skill: 'russian' }, { skill: 'cyr' }, { skill: 'scithink' }, { skill: '@review', or: 'divide' }, { skill: '@review', or: 'fractions' }] }
  ]
};
