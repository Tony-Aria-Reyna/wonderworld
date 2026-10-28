/* ===== Greece: the eighth country, and the first built on the spine (068-spine.js): it carries the periodic table and adds bones and muscles to the body atlas. Everything here is content, not code.
   (B64, B32, O, labStep, letterArt, the hare and the tortoise, OWL_IN, the factors skill, the sieve, the elements and the atlas come from the earlier files.)
   Four labs she works herself: the arm (a muscle can only pull, so muscles work in pairs), the atom builder (protons decide the element; shells of 2, 8, 8 give the table its rows and columns),
   the alkali metals in water (lithium, sodium, potassium: more reactive down the column) and the story of Archimedes and the crown (same weight, more room: less dense, so not pure gold).
   Sources, read 4 October 2026, Wikipedia unless named: "Democritus" (c. 460 to c. 370 BC; with Leucippus, atoms and the void; atomon, "uncuttable"), "Hippocrates" (born c. 460 BC on Kos; disease has natural causes; clinical observation),
   "Archimedes" and "Eureka (word)" (the crown of Hiero II of Syracuse; the only source is Vitruvius, two centuries later, and scholars doubt it happened as told: so the game says "the story goes"),
   "Archimedes' principle" (a body in a fluid is pushed up by a force equal to the weight of the fluid it displaces), "Sieve of Eratosthenes", "Euclid's theorem" (Elements IX.20), "Ancient Olympic Games" (776 BC, Olympia; the stadion, about 192 m; an olive wreath),
   "The Tortoise and the Hare" (Aesop, Perry 226), "Owl of Athena" (the little owl, Athene noctua), "Parthenon" (447 to 432 BC; 8 columns by 17), "Greek alphabet" (24 letters; alphabet from alpha and beta), "Pi".
   Bones and muscles: "Human skeleton" (206 bones in an adult; about 270 at birth; KidsHealth says about 300, so the game says "about 300"), "List of bones of the human skeleton" (12 pairs of ribs, 8 carpals a wrist, 14 phalanges a hand),
   "Vertebral column" (33 vertebrae), "Femur" (the longest bone), "Stapes" (the smallest, about 3 mm), "Skeletal muscle" (more than 600; antagonistic pairs), "Tendon", "Synovial joint" (hinge: elbow; ball and socket: shoulder and hip),
   OpenStax Anatomy and Physiology 11.1 (the forearm lifted by the biceps is a third-class lever, the elbow its fulcrum), RSC "Calcium" (calcium phosphate is the main component of bone).
   Chemistry: "Periodic table" (118 elements, 18 groups, 7 periods; Mendeleev, 1869), "Electron shell" (2, 8, 8 is the school model for the first 20), RSC "Alkali metals" demonstration (lithium fizzes, sodium melts into a ball, potassium burns lilac),
   "Noble gas" (a full outer shell; very unreactive). The crown's numbers are worked from densities (gold 19.3, silver 10.49 grams a cubic centimetre): 1 kg of gold is 52 mL; 700 g of gold with 300 g of silver is 65 mL.
   Greek words: spellings checked in Glosbe; modern Greek, as a Greek speaker says them today (οστό is the anatomical word for bone). ===== */

/* ----- hand-drawn pieces ----- */
const OWL_ART = { svg: '<svg viewBox="14 4 92 110" xmlns="http://www.w3.org/2000/svg">' + OWL_IN + '</svg>' };
const grTemple = (x, y, k, light) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M-64 0h128v-7h-6v-6H-58v6h-6z" fill="' + (light ? '#F3EADB' : '#E5D8C3') + '"/>' +
  [-49, -35, -21, -7, 7, 21, 35, 49].map(c => '<rect x="' + (c - 4) + '" y="-58" width="8" height="45" fill="#FBF6EC"/><path d="M' + (c - 1.5) + ' -57v43M' + (c + 1.5) + ' -57v43" stroke="#DCCFB8" stroke-width="1"/><rect x="' + (c - 5.5) + '" y="-61" width="11" height="4" fill="#EFE5D3"/>').join('') +
  '<rect x="-60" y="-70" width="120" height="9" fill="#EFE5D3"/><path d="M-60 -70h120" stroke="#3B6FD4" stroke-width="2.500" stroke-dasharray="5 4"/><path d="M-64 -70 0 -96l64 26z" fill="#FBF6EC"/><path d="M-50 -72 0 -92l50 20z" fill="#E5D8C3"/></g>';
const PARTHENON_ART = B64('<g transform="translate(32 60) scale(.44)">' + grTemple(0, 0, 1, true).replace(/^<g[^>]*>|<\/g>$/g, '') + '</g>');
const COLUMN_ART = B32('<ellipse cx="16" cy="29" rx="10" ry="2" fill="rgba(27,42,78,.18)"/><rect x="7" y="25" width="18" height="4" rx="1" fill="#E5D8C3"/><rect x="10.500" y="8" width="11" height="17" fill="#FBF6EC"/><path d="M13.500 8v17M16 8v17M18.500 8v17" stroke="#DCCFB8" stroke-width="1"/><rect x="8" y="4" width="16" height="4" rx="1" fill="#EFE5D3"/>');
const OLIVE_TREE = B64('<ellipse cx="32" cy="59" rx="18" ry="3" fill="rgba(27,42,78,.14)"/><path d="M30 58q-3-12 2-24" stroke="#8A6A4A" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="22" cy="26" r="13" fill="#8DB580"/><circle cx="40" cy="24" r="14" fill="#7AA76D"/><circle cx="32" cy="15" r="11" fill="#9CC28E"/><g fill="#3E4A5E"><circle cx="20" cy="28" r="2.200"/><circle cx="43" cy="27" r="2.200"/><circle cx="33" cy="18" r="2.200"/><circle cx="30" cy="31" r="2.200"/></g>');
const ATOM_ART = B64('<g fill="none" stroke="#3B6FD4" stroke-width="2.600"><ellipse cx="32" cy="32" rx="27" ry="10"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(-60 32 32)"/></g><circle cx="32" cy="32" r="7" fill="#E5484D"/><circle cx="29.500" cy="29.500" r="2.200" fill="#FFB1A8"/><g fill="#19A7B8"><circle cx="59" cy="32" r="3.600"/><circle cx="18.500" cy="8.600" r="3.600"/><circle cx="18.500" cy="55.400" r="3.600"/></g>');
/* the king's golden wreath: the story calls it a crown */
const crownLeaves = col => [[-1, 1], [1, 1]].map(sd => [0, 1, 2, 3, 4].map(i => { const a = (200 - i * 32) * Math.PI / 180, cx = 32 + sd[0] * 19 * Math.cos(a) * -1, cy = 36 + 19 * Math.sin(a) * -1; return '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="7.500" ry="3.200" fill="' + col + '" transform="rotate(' + (sd[0] * (60 - i * 30)).toFixed(0) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>'; }).join('')).join('');
const CROWN_IN = '<path d="M13 44a20 20 0 1 1 38 0" fill="none" stroke="#C98A12" stroke-width="3" stroke-linecap="round"/>' + crownLeaves('#FFC83D') + '<circle cx="32" cy="15" r="3.500" fill="#FFE27A" stroke="#C98A12" stroke-width="1.200"/>';
const CROWN_ART = B64(CROWN_IN);
const WREATH_ART = B64('<path d="M13 44a20 20 0 1 1 38 0" fill="none" stroke="#6B8F4E" stroke-width="3" stroke-linecap="round"/>' + crownLeaves('#7DB85F') + '<g fill="#3E4A5E"><circle cx="20" cy="22" r="2"/><circle cx="44" cy="22" r="2"/></g>');
const GOLDBAR_ART = B64('<path d="M12 44 20 26h24l8 18z" fill="#FFC83D" stroke="#C98A12" stroke-width="2.500" stroke-linejoin="round"/><path d="M20 26h24l-3-6H23z" fill="#FFE27A" stroke="#C98A12" stroke-width="2.500" stroke-linejoin="round"/><path d="M22 38h20" stroke="#C98A12" stroke-width="2" stroke-linecap="round"/>');
const PTABLE_ART = B64('<rect x="5" y="12" width="54" height="40" rx="5" fill="#fff" stroke="#1B2A4E" stroke-width="2.500"/>' + [[0, 0, '#8ED0F4'], [7, 0, '#B8A9FF'], [0, 1, '#FF9A8C'], [1, 1, '#FFC98A'], [2, 1, '#9BD48C'], [3, 1, '#9BD48C'], [4, 1, '#9BD48C'], [5, 1, '#9BD48C'], [6, 1, '#5CC8D6'], [7, 1, '#B8A9FF'], [0, 2, '#FF9A8C'], [1, 2, '#FFC98A'], [2, 2, '#9BD48C'], [3, 2, '#9BD48C'], [4, 2, '#9BD48C'], [5, 2, '#9BD48C'], [6, 2, '#5CC8D6'], [7, 2, '#B8A9FF'], [0, 3, '#FF9A8C'], [1, 3, '#FFC98A']].map(c => '<rect x="' + (9 + c[0] * 5.900) + '" y="' + (18 + c[1] * 7.600) + '" width="4.700" height="6" rx="1" fill="' + c[2] + '"/>').join(''));

/* ----- the scene behind the mission path: the Acropolis of Athens with the Parthenon on top, white houses with blue domes, olive trees, and the Aegean Sea ----- */
const grHouse = (x, y, w, hh, dome) => '<rect x="' + x + '" y="' + (y - hh) + '" width="' + w + '" height="' + hh + '" rx="5" fill="#FDFEFF"/>' + (dome ? '<path d="M' + (x + w * .22) + ' ' + (y - hh) + 'a' + (w * .28) + ' ' + (w * .28) + ' 0 0 1 ' + (w * .56) + ' 0z" fill="#3B6FD4"/>' : '<rect x="' + (x - 3) + '" y="' + (y - hh - 5) + '" width="' + (w + 6) + '" height="7" rx="3" fill="#EEF4FA"/>') +
  '<rect x="' + (x + w * .2) + '" y="' + (y - hh * .7) + '" width="' + (w * .2) + '" height="' + (hh * .3) + '" rx="2" fill="#3B6FD4"/><path d="M' + (x + w * .58) + ' ' + y + 'v-' + (hh * .5) + 'q' + (w * .11) + '-' + (w * .16) + ' ' + (w * .22) + ' 0v' + (hh * .5) + 'z" fill="#2A54A8"/>';
const grOlive = (x, y, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M0 0q-4-18 3-34" stroke="#8A6A4A" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-40" r="19" fill="#8DB580"/><circle cx="14" cy="-44" r="21" fill="#7AA76D"/><circle cx="2" cy="-58" r="16" fill="#9CC28E"/></g>';
const GR_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="grsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB3EA"/><stop offset=".7" stop-color="#C9ECFB"/><stop offset="1" stop-color="#F2FBFF"/></linearGradient>' +
  '<filter id="grsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".15"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#grsky)"/><circle cx="846" cy="92" r="56" fill="#FFE98F"/><circle cx="846" cy="92" r="40" fill="#FFD23F"/>' +
  '<g fill="#fff" opacity=".92"><ellipse cx="190" cy="92" rx="70" ry="20"/><ellipse cx="244" cy="76" rx="44" ry="18"/><ellipse cx="660" cy="150" rx="52" ry="15"/></g>' +
  '<path d="M0 330h1000v130H0z" fill="#2F86C8"/><g stroke="#8CC8EC" stroke-width="4" stroke-linecap="round" fill="none"><path d="M60 356q14-8 28 0t28 0M250 384q14-8 28 0t28 0M760 352q14-8 28 0t28 0M880 392q14-8 28 0t28 0"/></g>' +
  '<path d="M0 336q60-32 130-6t120 6z" fill="#8FB6C9"/><path d="M800 336q70-40 200-10v10z" fill="#8FB6C9"/>' +
  '<g filter="url(#grsh)"><path d="M290 470q46-176 160-216h220q114 40 160 216z" fill="#D9C7A6"/><path d="M430 262h260q20 8 34 20H396q14-12 34-20z" fill="#C9B48E"/><path d="M340 400q60-30 120-10M620 380q70-28 150 12" stroke="#C4AE85" stroke-width="5" fill="none" stroke-linecap="round"/>' + grTemple(560, 256, 1.5) + '</g>' +
  '<g filter="url(#grsh)">' + grOlive(360, 420, 1) + grOlive(770, 414, .9) + '</g>' +
  '<path filter="url(#grsh)" d="M0 452Q230 408 500 440T1000 426V600H0z" fill="#E9DDBF"/>' +
  '<g filter="url(#grsh)">' + grHouse(40, 470, 96, 70, true) + grHouse(150, 482, 78, 52, false) + grHouse(236, 476, 60, 42, false) + grHouse(730, 474, 70, 46, false) + grHouse(812, 484, 104, 74, true) + grHouse(926, 480, 60, 44, false) + '</g>' +
  '<path d="M0 512Q250 478 520 500T1000 488V600H0z" fill="#D9C99F"/><g fill="#7AA76D">' + [[90, 540], [300, 524], [640, 530], [900, 548], [480, 556]].map(p => '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="26" ry="9"/>').join('') + '</g>' +
  '<g filter="url(#grsh)">' + grOlive(60, 590, 1.1) + grOlive(952, 592, 1.2) + '</g></svg>';

/* ----- the skeleton, seen from the front, for the body atlas. Each bone has a point on it (x, y) and a place for its name beside the picture (lx, ly).
   Seen from the front with the palms forward, the radius is the outer bone of the forearm (the thumb side) and the fibula the outer bone of the lower leg. lv: which round first names it ----- */
const SKEL = [
  { id: 'skull', label: 'Skull', lv: 1, x: 45.6, y: 8, lx: 13, ly: 7, fact: { text: 'Your skull is a helmet of bone around your brain.' }, hint: { text: 'The skull is at the very top. It guards the brain.' } },
  { id: 'clavicle', label: 'Clavicle', lv: 2, x: 42, y: 25.2, lx: 13, ly: 18, fact: { text: 'The clavicle is your collarbone. Feel it below your neck.' }, hint: { text: 'The clavicle is the collarbone, from neck to shoulder.' } },
  { id: 'ribs', label: 'Ribs', lv: 1, x: 41.4, y: 34.6, lx: 13, ly: 29, fact: { text: 'Twelve pairs of ribs make a cage round your heart and lungs.' }, hint: { text: 'The ribs curve round the chest, like a cage.' } },
  { id: 'humerus', label: 'Humerus', lv: 1, x: 34.4, y: 38, lx: 13, ly: 40, fact: { text: 'The humerus is the one long bone of your upper arm.' }, hint: { text: 'The humerus goes from the shoulder to the elbow.' } },
  { id: 'radius', label: 'Radius', lv: 2, x: 28.6, y: 55, lx: 13, ly: 51, fact: { text: 'The radius is on the thumb side of your forearm.' }, hint: { text: 'The radius is the outer forearm bone, on the thumb side.' } },
  { id: 'carpals', label: 'Carpals', lv: 3, x: 27.8, y: 63.4, lx: 13, ly: 62, fact: { text: 'Eight small carpals in each wrist let your hand bend.' }, hint: { text: 'The carpals are the little bones of the wrist.' } },
  { id: 'femur', label: 'Femur', lv: 1, x: 43.5, y: 68, lx: 13, ly: 73, fact: { text: 'The femur, your thigh bone, is the longest bone you have.' }, hint: { text: 'The femur is the long bone of the thigh.' } },
  { id: 'patella', label: 'Patella', lv: 3, x: 43, y: 77.6, lx: 13, ly: 84, fact: { text: 'The patella is your kneecap. It shields the knee joint.' }, hint: { text: 'The patella is the small round bone on the knee.' } },
  { id: 'fibula', label: 'Fibula', lv: 3, x: 41.5, y: 88, lx: 13, ly: 94, fact: { text: 'The fibula is the thin bone beside the tibia.' }, hint: { text: 'The fibula is the thin outer bone of the lower leg.' } },
  { id: 'mandible', label: 'Mandible', lv: 2, x: 54.4, y: 19.4, lx: 87, ly: 8, fact: { text: 'The mandible is your jawbone: the only skull bone that moves.' }, hint: { text: 'The mandible is the jawbone, under the teeth.' } },
  { id: 'scapula', label: 'Scapula', lv: 2, x: 61.4, y: 29.6, lx: 87, ly: 19, fact: { text: 'The scapula is your shoulder blade: a flat triangle of bone.' }, hint: { text: 'The scapula is the flat triangle behind the shoulder.' } },
  { id: 'sternum', label: 'Sternum', lv: 2, x: 50.7, y: 33, lx: 87, ly: 30, fact: { text: 'The sternum is your breastbone. The ribs join on to it.' }, hint: { text: 'The sternum is the flat bone down the middle of the chest.' } },
  { id: 'spine', label: 'Spine', lv: 1, x: 50.7, y: 47.4, lx: 87, ly: 41, fact: { text: 'Your spine is 33 small bones, called vertebrae, in a stack.' }, hint: { text: 'The spine runs down the middle of your back.' } },
  { id: 'pelvis', label: 'Pelvis', lv: 1, x: 58.6, y: 56, lx: 87, ly: 52, fact: { text: 'The pelvis is a bowl of bone that holds up your body.' }, hint: { text: 'The pelvis is the wide bone at your hips.' } },
  { id: 'ulna', label: 'Ulna', lv: 2, x: 69.7, y: 58.4, lx: 87, ly: 62, fact: { text: 'The ulna is on the little-finger side. Its end is your elbow.' }, hint: { text: 'The ulna is the inner bone of the forearm.' } },
  { id: 'phalanges', label: 'Phalanges', lv: 3, x: 73.8, y: 68.6, lx: 87, ly: 72, fact: { text: 'Phalanges are finger and toe bones: fourteen in each hand.' }, hint: { text: 'The phalanges are the bones of the fingers.' } },
  { id: 'tibia', label: 'Tibia', lv: 3, x: 55.9, y: 86, lx: 87, ly: 84, fact: { text: 'The tibia is your shin bone. It carries your weight.' }, hint: { text: 'The tibia is the thick bone of the lower leg.' } }
];
SKEL.forEach(p => { p.w = 7.5; });
/* lines: the bones that get a line out to a name place; names: the bones whose names are already printed there */
function skelSvg(lines, names) {
  const B = '#FFFBEF', K = '#46527A', bone = (d, w) => '<path d="' + d + '" fill="none" stroke="' + K + '" stroke-width="' + (w + 1) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="' + B + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const both = f => f(1) + f(-1), X = (x, sd) => (50 + sd * (x - 50)).toFixed(2), shape = (d, sw) => '<path d="' + d + '" fill="' + B + '" stroke="' + K + '" stroke-width="' + (sw || .55) + '" stroke-linejoin="round"/>';
  let s = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="5" fill="#E3EEF9"/><ellipse cx="50" cy="97" rx="17" ry="1.800" fill="rgba(27,42,78,.12)"/>';
  s += both(sd => '<path d="M' + X(35.6, sd) + ' 26.600 ' + X(43, sd) + ' 27.800 ' + X(40, sd) + ' 39.500z" fill="#EFE3C8" stroke="' + K + '" stroke-width=".55" stroke-linejoin="round"/>');                                    /* scapulae, behind the ribs */
  s += bone('M50 22.500V53', 2.5) + '<path d="M50 22.500V53" stroke="' + K + '" stroke-width="2.500" stroke-dasharray=".3 1.75" fill="none"/>';       /* the spine: a stack of vertebrae */
  for (let i = 0; i < 6; i++) { const y = 28.6 + i * 2.5, rx = 6.4 + i * 1.05, back = i < 4 ? rx * .58 : rx * .3; s += both(sd => bone('M' + X(49, sd) + ' ' + y + 'q' + (-sd * rx) + ' -.5 ' + (-sd * rx) + ' 2.300q0 2.100 ' + (sd * back) + ' 2.500', 1)); }
  s += bone('M50 27.600V38', 2.1) + both(sd => bone('M' + X(49.2, sd) + ' 26.200Q' + X(44, sd) + ' 24.300 ' + X(37.6, sd) + ' 25.600', 1.4));          /* sternum, clavicles */
  s += '<ellipse cx="50" cy="10.300" rx="7.300" ry="7.900" fill="' + B + '" stroke="' + K + '" stroke-width=".6"/>' + shape('M44.200 14.200Q44.400 21.600 50 21.900 55.600 21.600 55.800 14.200 53 17.600 50 17.600 47 17.600 44.200 14.200z') +
    '<ellipse cx="47" cy="11.400" rx="1.800" ry="2.100" fill="' + K + '"/><ellipse cx="53" cy="11.400" rx="1.800" ry="2.100" fill="' + K + '"/><path d="M50 13.600l-.9 1.900h1.800z" fill="' + K + '"/><path d="M46.600 17.900h6.800" stroke="' + K + '" stroke-width=".5" stroke-dasharray=".7 .5"/>';
  s += both(sd => bone('M' + X(36.8, sd) + ' 27.600 ' + X(32.6, sd) + ' 45', 2.2) + bone('M' + X(31.5, sd) + ' 46.600 ' + X(27, sd) + ' 61', 1.2) + bone('M' + X(33.5, sd) + ' 46.600 ' + X(29.8, sd) + ' 61.400', 1.2) +
    '<g fill="' + B + '" stroke="' + K + '" stroke-width=".4">' + [[27.2, 62.8], [28.9, 62.9], [30.4, 63.2], [27.9, 64.2], [29.5, 64.4]].map(c => '<circle cx="' + X(c[0], sd) + '" cy="' + c[1] + '" r=".95"/>').join('') + '</g>' +
    [[26.2, 65.4, 24.6, 70.4], [27.6, 65.8, 27, 71.6], [29, 65.9, 29.3, 71.6], [30.4, 65.6, 31.5, 70.6], [25.6, 64.2, 22.8, 66.8]].map(f => bone('M' + X(f[0], sd) + ' ' + f[1] + ' ' + X(f[2], sd) + ' ' + f[3], .7)).join(''));
  s += shape('M41.400 53.200Q38.200 55.200 40.400 59.800 44 63.200 50 61.700 56 63.200 59.600 59.800 61.800 55.200 58.600 53.200 54.600 54.700 50 54.700 45.400 54.700 41.400 53.200z') + '<ellipse cx="46.400" cy="59.600" rx="1.500" ry="1.200" fill="' + K + '"/><ellipse cx="53.600" cy="59.600" rx="1.500" ry="1.200" fill="' + K + '"/><path d="M48.200 54.800h3.600l-1.800 4.600z" fill="#E3EEF9" stroke="' + K + '" stroke-width=".4"/>';
  s += both(sd => bone('M' + X(44.2, sd) + ' 60.400 ' + X(43.2, sd) + ' 75.600', 2.5) + '<circle cx="' + X(43, sd) + '" cy="77.600" r="1.800" fill="' + B + '" stroke="' + K + '" stroke-width=".55"/>' +
    bone('M' + X(44, sd) + ' 79.800 ' + X(44.4, sd) + ' 93.600', 1.9) + bone('M' + X(41.5, sd) + ' 80.200 ' + X(41.7, sd) + ' 93.600', .9) + bone('M' + X(40.6, sd) + ' 95.600H' + X(46.6, sd), 1.7));
  SKEL.forEach(p => { if (!lines.includes(p.id)) return; const left = p.lx < 50, ex = left ? p.lx + 6.5 : p.lx - 6.5;
    s += '<path d="M' + ex + ' ' + p.ly + 'L' + p.x + ' ' + p.y + '" stroke="#8B7BEA" stroke-width=".5" stroke-linecap="round"/><circle cx="' + p.x + '" cy="' + p.y + '" r="1.050" fill="#8B7BEA" stroke="#fff" stroke-width=".3"/>';
    if (names.includes(p.id)) { const w = p.label.length * 1.75 + 2.6; s += '<rect x="' + (p.lx - w / 2) + '" y="' + (p.ly - 2.6) + '" width="' + w + '" height="5.200" rx="2.200" fill="#fff" stroke="#34C17B" stroke-width=".5"/><text x="' + p.lx + '" y="' + (p.ly + 1.25) + '" font-size="3.300" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + p.label + '</text>'; } });
  return s + '</svg>';
}
const skelIds = lv => SKEL.filter(p => p.lv === lv).map(p => p.id), skelUpTo = lv => SKEL.filter(p => p.lv <= lv).map(p => p.id);
/* a round that names one level's bones by dragging name tags to the ends of the lines; the earlier levels' names are already printed */
const skelPlace = (lv, text, say, done) => ({ act: 'place', tags: true, text, say, board: skelSvg(skelUpTo(lv), skelUpTo(lv - 1)), items: SKEL.filter(p => p.lv === lv).map(p => ({ id: p.id, label: p.label, x: p.lx, y: p.ly, w: 10, fact: p.fact, hint: p.hint })), done });
ATLAS.skeleton = { name: 'Bones', icon: 'bone', cid: 'greece', need: 'greece.m2', board: skelSvg(SKEL.map(p => p.id), []), parts: SKEL };

/* ----- Greek words. Edge and Android both have a Greek voice; without one, the English voice sounds the word out from the spelling beside it.
   Doctors' words are built from Greek ones: kardiá (heart) gives cardiologist, dérma (skin) dermatologist, ostó (bone) osteology ----- */
const GR = (t, phon, inline) => ({ t, lang: 'el', fallback: phon, inline: !!inline });
const GREEK = [
  { native: 'γεια σου', rom: 'yia sou', en: 'hello', icon: 'waving-hand', phon: 'yah soo' },
  { native: 'ευχαριστώ', rom: 'efharistó', en: 'thank you', icon: 'folded-hands', phon: 'ef-kha-ree-stoh' },
  { native: 'καρδιά', rom: 'kardiá', en: 'heart', icon: 'anatomical-heart', phon: 'kar-thee-ah' },
  { native: 'δέρμα', rom: 'dérma', en: 'skin', icon: 'raised-hand', phon: 'thair-ma' },
  { native: 'οστό', rom: 'ostó', en: 'bone', icon: 'bone', phon: 'oss-toh' },
  { native: 'κουκουβάγια', rom: 'koukouvágia', en: 'owl', icon: OWL_ART, phon: 'koo-koo-vah-ya' }
];
wordSkill('greek', 'Greek words', 'el', GREEK);
const YIASOU = 'yah soo';

/* ----- bones ----- */
bankSkill('bones', 'Bones and joints', 'science', [
  { pic: 'bone', why: 'An adult has 206 bones. A baby has more.',
    ask: [{ t: 'How many bones does an adult have?', h: 'More than two hundred. A baby has about 300, and some join up as it grows.', o: [O('206', 'input-numbers'), O('26', 'keycap-2'), O('2,006', 'hundred-points')] },
      { t: 'A baby has about 300 bones. An adult has fewer, because…', pic: 'baby-bottle', h: 'As you grow, some of the small bones fuse into one bigger bone.', o: [O('Bones join together', 'handshake'), O('Bones fall out', 'down-arrow'), O('Bones melt', 'droplet')] }] },
  { pic: 'skull', why: 'Bones protect the soft parts inside you.',
    ask: [{ t: 'Which bone protects your brain?', pic: 'brain', h: 'It is a hard helmet at the very top of your skeleton.', o: [O('Skull', 'skull'), O('Femur', 'leg'), O('Pelvis', 'chair')] },
      { t: 'What do your ribs protect?', pic: 'shield', h: 'The ribs make a cage round your chest. What beats and breathes in there?', o: [O('Heart and lungs', 'lungs'), O('Brain', 'brain'), O('Knees', 'leg')] }] },
  { pic: 'leg', why: 'The femur, in your thigh, is the longest bone.',
    ask: [{ t: 'Which is the longest bone in your body?', pic: 'straight-ruler', h: 'It is in your thigh, between your hip and your knee.', o: [O('Femur', 'leg'), O('Humerus', 'flexed-biceps'), O('Clavicle', 'coat')] },
      { t: 'Where is your femur?', pic: 'bone', h: 'The femur is the longest bone of all. It joins the hip to the knee.', o: [O('In the thigh', 'leg'), O('In the arm', 'flexed-biceps'), O('In the head', 'skull')] }] },
  { pic: 'ear', why: 'The smallest bone, the stapes, is inside your ear.',
    ask: [{ t: 'Where is the smallest bone in your body?', pic: 'magnifying-glass-tilted-left', h: 'It is called the stapes, and it is about 3 millimetres long. It passes on sound.', o: [O('In the ear', 'ear'), O('In the toe', 'foot'), O('In the nose', 'nose')] },
      { t: 'The tiny stapes bone helps you to…', pic: 'bone', h: 'The stapes is deep inside your ear. It passes the vibrations of sound to the inner ear.', o: [O('Hear', 'ear'), O('See', 'eye'), O('Taste', 'tongue')] }] },
  { pic: 'glass-of-milk', why: 'Calcium makes bone hard. Bone is alive, and it grows.',
    ask: [{ t: 'Which mineral makes your bones hard?', h: 'It is element number 20. It is in milk, and in teeth and chalk too.', o: [O('Calcium', 'tooth'), O('Helium', 'balloon'), O('Neon', 'red-circle')] },
      { t: 'A broken bone can mend, because bone is…', pic: 'adhesive-bandage', h: 'Bone has blood running through it, and it grows new bone across the break.', o: [O('Alive', 'seedling'), O('Metal', 'nut-and-bolt'), O('Dead', 'rock')] }] },
  { pic: 'drop-of-blood', why: 'Bone marrow, inside your bones, makes new blood cells.',
    ask: [{ t: 'What does the marrow inside your bones make?', pic: 'bone', h: 'Marrow is the soft red middle of a bone. It is a factory for something red.', o: [O('Blood cells', 'drop-of-blood'), O('Air', 'wind-face'), O('Hair', 'scissors')] },
      { t: 'Where are new blood cells made?', h: 'They are made deep inside your big bones, in the soft red middle.', o: [O('In bone marrow', 'bone'), O('In the stomach', 'pot-of-food'), O('In the skin', 'raised-hand')] }] },
  { pic: 'mechanical-arm', why: 'A joint is where two bones meet, and move.',
    ask: [{ t: 'Your elbow bends one way, like a door. It is a…', pic: 'flexed-biceps', h: 'A door swings one way on its hinges. So does your elbow.', o: [O('Hinge joint', 'door'), O('Ball and socket', 'soccer-ball'), O('Fixed joint', 'locked')] },
      { t: 'Your shoulder turns every way. It is a…', pic: 'person-cartwheeling', h: 'The round top of the humerus sits in a cup in the scapula, so it can roll about.', o: [O('Ball and socket', 'soccer-ball'), O('Hinge joint', 'door'), O('Fixed joint', 'locked')] }] },
  { pic: 'x-ray', why: 'Doctors use one name for each bone, all over the world.',
    ask: [{ t: 'What is the real name of the collarbone?', pic: 'stethoscope', h: 'You named it on the skeleton. It runs from the neck to the shoulder.', o: [O('Clavicle', 'coat'), O('Patella', 'leg'), O('Tibia', 'foot')] },
      { t: 'What is the real name of the kneecap?', pic: 'leg', h: 'It is a small round bone that shields the knee.', o: [O('Patella', 'shield'), O('Scapula', 'coat'), O('Sternum', 'necktie')] }] }
], 'greece');

/* ----- muscles ----- */
bankSkill('muscles', 'Muscles', 'science', [
  { pic: 'flexed-biceps', why: 'A muscle can only pull. It can never push.',
    ask: [{ t: 'A muscle works by getting shorter. So it can only…', h: 'In the arm lab, the biceps got shorter and fatter. The forearm came towards it.', o: [O('Pull', 'hook'), O('Push', 'raised-hand'), O('Spin', 'counterclockwise-arrows-button')] },
      { t: 'Can a muscle push a bone?', pic: 'bone', h: 'A muscle is like a rope. A rope can pull a cart, but it cannot push one.', o: [O('No, only pull', 'hook'), O('Yes, always', 'thumbs-up'), O('Only at night', 'crescent-moon')] }] },
  { pic: 'left-right-arrow', why: 'Muscles work in pairs: one bends, the other straightens.',
    ask: [{ t: 'The biceps bends your arm. Which muscle straightens it?', pic: 'flexed-biceps', h: 'It is on the back of your upper arm. It pulls the other way.', o: [O('Triceps', 'mechanical-arm'), O('The heart', 'anatomical-heart'), O('The tongue', 'tongue')] },
      { t: 'Why do muscles come in pairs?', pic: 'handshake', h: 'One muscle pulls the bone one way. It cannot push it back, so a partner pulls it back.', o: [O('Each pulls one way', 'left-right-arrow'), O('To look even', 'mirror'), O('To keep warm', 'fire')] }] },
  { pic: 'hook', why: 'A tendon ties a muscle to a bone.',
    ask: [{ t: 'What joins a muscle to a bone?', pic: 'bone', h: 'It is a strong white cord. You can feel one at the back of your ankle.', o: [O('A tendon', 'hook'), O('A vein', 'drop-of-blood'), O('A hair', 'scissors')] },
      { t: 'A ligament joins a bone to a…', pic: 'mechanical-arm', h: 'Tendons tie muscle to bone. Ligaments tie bone to bone, at a joint.', o: [O('Bone', 'bone'), O('Muscle', 'flexed-biceps'), O('Tooth', 'tooth')] }] },
  { pic: 'anatomical-heart', why: 'Your heart is a muscle that never rests.',
    ask: [{ t: 'Which muscle works all day and all night?', pic: 'alarm-clock', h: 'It squeezes about once a second, your whole life long, even when you sleep.', o: [O('The heart', 'anatomical-heart'), O('The biceps', 'flexed-biceps'), O('The triceps', 'mechanical-arm')] },
      { t: 'Your heart is made of…', pic: 'drop-of-blood', h: 'Each squeeze of the heart is this kind of tissue getting shorter, to pump blood.', o: [O('Muscle', 'flexed-biceps'), O('Bone', 'bone'), O('Tendon', 'hook')] }] },
  { pic: 'balance-scale', why: 'Your forearm is a lever. The elbow is its pivot.',
    ask: [{ t: 'Your forearm works like a lever. Where is its pivot?', h: 'A pivot is the point a lever turns about. Bend your arm: which joint turns?', o: [O('The elbow', 'mechanical-arm'), O('The wrist', 'watch'), O('The shoulder', 'coat')] },
      { t: 'What pulls your forearm up, like a lever?', pic: 'red-apple', h: 'It is the muscle on the front of the upper arm. Its tendon is tied just past the elbow.', o: [O('The biceps', 'flexed-biceps'), O('The femur', 'leg'), O('The skull', 'skull')] }] },
  { pic: 'brain', why: 'Your brain sends a signal down a nerve. The muscle pulls.',
    ask: [{ t: 'What tells a muscle to pull?', pic: 'flexed-biceps', h: 'You decide to bend your arm. Where does the order come from?', o: [O('A brain signal', 'brain'), O('The bone', 'bone'), O('The skin', 'raised-hand')] },
      { t: 'The signal reaches the muscle along a…', pic: 'flexed-biceps', h: 'It works like a wire, carrying messages from your brain to every part of you.', o: [O('Nerve', 'high-voltage'), O('Bone', 'bone'), O('Hair', 'scissors')] }] }
], 'greece');

/* ----- atoms and the periodic table ----- */
bankSkill('atoms', 'Atoms and elements', 'science', [
  { pic: ATOM_ART, why: 'Everything is made of atoms, far too small to see.',
    ask: [{ t: 'Everything around you is made of tiny…', pic: 'magnifying-glass-tilted-left', h: 'A Greek thinker called Democritus named them, about 2,400 years ago.', o: [O('Atoms', ATOM_ART), O('Crumbs', 'cookie'), O('Dots of paint', 'artist-palette')] },
      { t: 'Democritus called them atomos. That means…', pic: 'scissors', h: 'He imagined cutting a thing in half, again and again, until a piece could not be cut.', o: [O('Cannot be cut', 'cross-mark'), O('Very heavy', 'rock'), O('Bright light', 'light-bulb')] }] },
  { pic: 'red-circle', why: 'Protons and neutrons are in the nucleus. Electrons whizz around it.',
    ask: [{ t: 'What is in the middle of an atom?', pic: ATOM_ART, h: 'In the atom lab, the red protons and grey neutrons were packed together in the centre.', o: [O('The nucleus', 'red-circle'), O('An electron', 'blue-circle'), O('Nothing', 'cross-mark')] },
      { t: 'Which tiny parts whizz round the outside of an atom?', pic: 'counterclockwise-arrows-button', h: 'In the atom lab, they were the small blue dots on the rings.', o: [O('Electrons', 'blue-circle'), O('Protons', 'red-circle'), O('Neutrons', 'white-circle')] }] },
  { pic: 'input-numbers', why: 'The number of protons decides which element it is.',
    ask: [{ t: 'An atom with just one proton is…', pic: 'red-circle', h: 'It is the very first element in the periodic table: number 1.', o: [O('Hydrogen', 'droplet'), O('Helium', 'balloon'), O('Gold', 'coin')] },
      { t: 'Add one proton to hydrogen. You get…', pic: 'plus', h: 'One proton is hydrogen. Two protons is the next element in the table.', o: [O('Helium', 'balloon'), O('Bigger hydrogen', 'droplet'), O('Water', 'potable-water')] }] },
  { pic: PTABLE_ART, why: 'An element is made of only one kind of atom.',
    ask: [{ t: 'Pure gold is made of only gold…', pic: 'coin', h: 'An element is one kind of the tiny pieces everything is built from.', o: [O('Atoms', ATOM_ART), O('Bricks', 'brick'), O('Seeds', 'seedling')] },
      { t: 'How many elements are in the periodic table?', h: 'It starts at hydrogen, number 1, and ends at oganesson. More than a hundred.', o: [O('118', 'hundred-points'), O('18', 'keycap-2'), O('1,180', 'input-numbers')] }] },
  { pic: 'bullseye', why: 'Electrons sit in shells. The first shell holds two.',
    ask: [{ t: 'How many electrons fit in the first shell?', pic: 'blue-circle', h: 'Helium filled the first shell in the atom lab. Helium is number 2.', o: [O('Two', 'keycap-2'), O('Eight', 'input-numbers'), O('Ten', 'hundred-points')] },
      { t: 'The first shell is full. The next electron starts a…', pic: ATOM_ART, h: 'Lithium, number 3, had one electron on a ring further out. And a new row in the table.', o: [O('New shell', 'bullseye'), O('New atom', ATOM_ART), O('New proton', 'red-circle')] }] },
  { pic: 'bubbles', why: 'Elements in one column of the table behave alike.',
    ask: [{ t: 'Lithium, sodium and potassium all fizz in water. They share a…', pic: PTABLE_ART, h: 'In the table, the three of them sit one under another, on the far left.', o: [O('Column', 'down-arrow'), O('Colour', 'artist-palette'), O('Country', 'world-map')] },
      { t: 'Going down the first column, the metals react…', pic: 'fire', h: 'Lithium fizzed. Sodium darted about. Potassium, the lowest, caught fire.', o: [O('More strongly', 'collision'), O('More gently', 'feather'), O('Not at all', 'cross-mark')] }] },
  { pic: 'balloon', why: 'Noble gases have full outer shells, so they hardly ever react.',
    ask: [{ t: 'Helium and neon hardly ever react. They are…', pic: PTABLE_ART, h: 'They sit in the last column of the table, on the far right.', o: [O('Noble gases', 'balloon'), O('Alkali metals', 'bubbles'), O('Halogens', 'salt')] },
      { t: 'Why does neon hardly ever react?', pic: 'red-circle', h: 'Atoms react to fill up their outer shell. Neon has two electrons, then eight.', o: [O('Its shell is full', 'bullseye'), O('It is too cold', 'snowflake'), O('It is too big', 'elephant')] }] },
  { pic: 'scroll', why: 'Mendeleev put the elements in order, and left gaps.',
    ask: [{ t: 'Who made the first periodic table that everyone used?', pic: PTABLE_ART, h: 'He was a Russian chemist, and he drew it up in 1869.', o: [O('Mendeleev', 'man-scientist'), O('Archimedes', 'bathtub'), O('Pasteur', 'microbe')] },
      { t: 'Mendeleev left gaps in his table, for elements…', pic: 'magnifying-glass-tilted-left', h: 'He was sure that more elements existed, and he said what they would be like.', o: [O('Not yet found', 'hourglass-not-done'), O('He did not like', 'thumbs-down'), O('Too heavy', 'rock')] }] }
], 'greece');

/* ----- density and floating: Archimedes ----- */
bankSkill('float', 'Density and floating', 'science', [
  { pic: 'rock', why: 'Dense means a lot of stuff packed into a small space.',
    ask: [{ t: 'A gold bar is small, but very heavy. Gold is very…', pic: GOLDBAR_ART, h: 'A lot of stuff is packed into a small space. There is a word for that.', o: [O('Dense', 'rock'), O('Bendy', 'left-right-arrow'), O('Hollow', 'balloon')] },
      { t: 'Same size: gold, or wood. Which is denser?', pic: 'balance-scale', h: 'The denser one has more stuff packed into the same space, so it is heavier.', o: [O('Gold', GOLDBAR_ART), O('Wood', 'wood'), O('The same', 'balance-scale')] }] },
  { pic: 'bathtub', why: 'A thing under water pushes aside its own size of water.',
    ask: [{ t: 'You climb into a full bath. The water…', h: 'Your body takes up room. The water that was in that room has to go.', o: [O('Spills over', 'water-wave'), O('Sinks lower', 'down-arrow'), O('Turns to ice', 'ice')] },
      { t: 'A bigger thing under water pushes aside…', pic: 'potable-water', h: 'In the crown lab, the bigger thing made the water rise higher.', o: [O('More water', 'up-arrow'), O('Less water', 'down-arrow'), O('No water', 'cross-mark')] }] },
  { pic: CROWN_ART, why: 'Same weight, but bigger: it is less dense, so not pure gold.',
    ask: [{ t: 'The crown pushed aside more water than the gold. It was…', pic: 'potable-water', h: 'The water rose 65 millilitres for the crown, and only 52 for the gold bar.', o: [O('Bigger', 'up-arrow'), O('Smaller', 'down-arrow'), O('Heavier', 'rock')] },
      { t: 'Same weight, but bigger. So the crown was not pure…', pic: 'balance-scale', h: 'Silver is less dense than gold, so a kilogram of it takes up more room.', o: [O('Gold', GOLDBAR_ART), O('Water', 'droplet'), O('Wood', 'wood')] }] },
  { pic: 'ship', why: 'Water pushes up as hard as the water pushed aside weighs.',
    ask: [{ t: 'A steel ship floats, because it is full of…', h: 'The ship is a huge hollow shape. Steel and what else is inside it?', o: [O('Air', 'wind-face'), O('Stones', 'rock'), O('Water', 'droplet')] },
      { t: 'What pushes a floating boat up?', pic: 'sailboat', h: 'The boat pushes water aside, and the water pushes back.', o: [O('The water', 'water-wave'), O('The wind', 'wind-face'), O('The sky', 'cloud')] }] },
  { pic: 'tangerine', why: 'Less dense than water: it floats. Denser: it sinks.',
    ask: [{ t: 'A cork is less dense than water. It will…', pic: 'bottle-with-popping-cork', h: 'Less dense means less stuff in the same space than water has.', o: [O('Float', 'up-arrow'), O('Sink', 'down-arrow'), O('Melt', 'droplet')] },
      { t: 'A stone is denser than water. It will…', pic: 'rock', h: 'Denser means more stuff in the same space than water has.', o: [O('Sink', 'down-arrow'), O('Float', 'up-arrow'), O('Fly', 'airplane')] }] }
], 'greece');

bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: 'stethoscope', hint: 'Hippocrates, a Greek doctor, watched his patients closely, and wrote down what he saw.', why: 'A doctor looks, listens, and writes down what is seen.',
    ask: [{ t: 'Hippocrates said illness is not magic. It has a…', o: [O('Natural cause', 'microbe'), O('Curse', 'magic-wand'), O('Ghost', 'ghost')] },
      { t: 'What did Hippocrates do with each patient first?', o: [O('Looked and listened', 'eye'), O('Guessed', 'game-die'), O('Ran away', 'person-running')] }] },
  { pic: CROWN_ART, hint: 'In the story, Archimedes did not guess about the crown. He measured the water.', why: 'Measuring settles what guessing cannot.',
    ask: [{ t: 'How did Archimedes test the crown?', o: [O('He measured', 'straight-ruler'), O('He guessed', 'game-die'), O('He asked the king', 'crown')] },
      { t: 'To be sure, a scientist…', o: [O('Measures', 'straight-ruler'), O('Guesses', 'game-die'), O('Hopes', 'shooting-star')] }] },
  { pic: ATOM_ART, hint: 'Democritus had the idea of atoms, but no way to test it. The proof took 2,000 years.', why: 'An idea becomes science when it is tested.',
    ask: [{ t: 'Democritus thought of atoms. But he could not…', o: [O('Test the idea', 'test-tube'), O('Say the word', 'speaking-head'), O('Write it down', 'pencil')] },
      { t: 'A good idea becomes science when it is…', o: [O('Tested', 'test-tube'), O('Shouted', 'loudspeaker'), O('Very old', 'scroll')] }] }
], 'greece');

/* ----- the arm lab: a muscle can only pull. The biceps shortens and the forearm swings up about the elbow; it cannot push the arm back, so its partner, the triceps, pulls it straight.
   The forearm is a lever (third class): pivot at the elbow, the pull of the biceps just past it, the load in the hand. A tendon ties each muscle to bone. ----- */
const ARM_LAB = (() => {
  const B = '#FFFBEF', K = '#46527A', M = '#E5484D', MK = '#A53030', bone = (d, w) => '<path d="' + d + '" fill="none" stroke="' + K + '" stroke-width="' + (w + 3) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + B + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  const tend = (cls, d) => '<path class="' + cls + '" d="' + d + '" fill="none" stroke="#F4E3B8" stroke-width="5" stroke-linecap="round"/>';
  const arrow = (x1, y1, x2, y2, col) => { const a = Math.atan2(y2 - y1, x2 - x1), hx = x2 - 9 * Math.cos(a), hy = y2 - 9 * Math.sin(a); return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'M' + (hx - 6 * Math.sin(a)).toFixed(1) + ' ' + (hy + 6 * Math.cos(a)).toFixed(1) + 'L' + x2 + ' ' + y2 + 'L' + (hx + 6 * Math.sin(a)).toFixed(1) + ' ' + (hy - 6 * Math.cos(a)).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'; };
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An arm seen from the side, with the skin drawn see-through: the bones, the biceps on top and the triceps underneath">' +
    '<rect width="400" height="290" rx="14" fill="#FDF3E7"/><path d="M0 120q40-8 62 30v110q-30 30-62 30z" fill="#19A7B8"/>' +
    '<path d="M50 152Q150 138 238 172V230Q150 262 50 248z" fill="#F3CFA5" opacity=".55"/>' + bone('M70 198 226 200', 12) + '<circle cx="66" cy="197" r="11" fill="' + B + '" stroke="' + K + '" stroke-width="1.500"/>' +
    tend('am-t0', 'M180 184 248 193') + tend('am-t1', 'M170 180 228 181') + tend('am-t0', 'M180 214 222 210') + tend('am-t1', 'M186 213 238 210') + tend('', 'M92 190 72 190') + tend('', 'M92 209 74 206') +
    '<g class="am-fore"><path d="M224 176Q300 170 352 184V218Q300 230 224 226z" fill="#F3CFA5" opacity=".55"/>' + bone('M224 207 346 207', 8) + bone('M234 195 348 194', 7) + '<circle cx="221" cy="209" r="7" fill="' + B + '" stroke="' + K + '" stroke-width="1.500"/>' +
    '<ellipse cx="366" cy="200" rx="17" ry="13" fill="#F3CFA5" stroke="#D9A873" stroke-width="1.500"/><path d="M372 190q12-2 14 6M376 198q12 0 12 7M372 207q10 2 10 8" stroke="#D9A873" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<g class="am-apple"><circle cx="372" cy="180" r="13" fill="#E5484D" stroke="#A53030" stroke-width="1.500"/><path d="M372 168q2-7 8-7" stroke="#6B4424" stroke-width="2.500" fill="none" stroke-linecap="round"/><ellipse cx="364" cy="165" rx="6" ry="3" fill="#57BF7F" transform="rotate(-30 364 165)"/></g></g>' +
    '<circle cx="230" cy="200" r="9" fill="' + B + '" stroke="' + K + '" stroke-width="1.500"/>' +
    '<path class="am-bi" d="M88 190Q150 164 208 186 150 198 88 190z" fill="' + M + '" stroke="' + MK + '" stroke-width="2" stroke-linejoin="round"/><path class="am-tri" d="M88 208Q150 234 204 212 150 204 88 208z" fill="' + M + '" stroke="' + MK + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<g class="am-pb">' + arrow(196, 150, 140, 150, '#6453C9') + '</g><g class="am-pt">' + arrow(196, 250, 140, 250, '#6453C9') + '</g>' +
    '<g class="am-lev"><path d="M230 216l-12 18h24z" fill="#FFC83D" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/>' + arrow(290, 58, 290, 92, '#E5484D') + '<g font-size="13" font-weight="700" fill="#1B2A4E" text-anchor="middle"><text x="230" y="250">pivot</text><text x="290" y="52">load</text></g></g>' +
    '<g class="am-zoom"><path d="M214 182 292 160" stroke="#1B2A4E" stroke-width="2" stroke-dasharray="4 4"/><g transform="translate(268 82)"><circle cx="72" cy="72" r="52" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><path d="M24 62q48-16 60 10-12 26-60 10z" fill="' + M + '"/><path d="M30 66h44M30 74h46M32 82h40" stroke="' + MK + '" stroke-width="1.500"/><path d="M82 72h22" stroke="#F4E3B8" stroke-width="10" stroke-linecap="round"/><rect x="102" y="56" width="18" height="32" rx="8" fill="' + B + '" stroke="' + K + '" stroke-width="2"/><text x="72" y="112" font-size="12" font-weight="700" text-anchor="middle" fill="#1B2A4E">tendon</text></g></g>' +
    '<g font-weight="700" text-anchor="middle"><text x="118" y="140" font-size="14" fill="#1B2A4E">biceps</text><text class="am-b" x="118" y="124" font-size="12" fill="#5A678A">resting</text><text x="118" y="268" font-size="14" fill="#1B2A4E">triceps</text><text class="am-r" x="118" y="283" font-size="12" fill="#5A678A">resting</text>' +
    '<rect x="238" y="254" width="154" height="28" rx="11" fill="#fff" opacity=".95"/><text class="am-say" x="315" y="273" font-size="13.500" fill="#1B2A4E">arm straight</text></g></svg>';
})();
function armSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab armlab fill', 'data-s': 'start', html: ARM_LAB })); }
async function armSim(stage, ui) {
  armSetup(stage); const g = $('.lab', stage), T = (b, r, s) => () => { $('.am-b', g).textContent = b; $('.am-r', g).textContent = r; $('.am-say', g).textContent = s; };
  ui.prompt('Inside your arm: bones and two muscles. Bend it!', 'This is the inside of your arm. The long bone is the humerus. On top is a muscle called the biceps. Underneath is its partner, the triceps. Tap the button to bend the arm.');
  await labStep(ui, g, 'Pull with the biceps', 'bend', 'The biceps gets shorter and fatter. It pulls the arm up!', 'The biceps gets shorter and fatter. That is all a muscle can do: get shorter, and pull. It pulls on the forearm, and the arm bends at the elbow. The triceps, underneath, is stretched out long.', T('PULLING', 'resting', 'arm bent'));
  await labStep(ui, g, 'Pull with the triceps', 'straight', 'A muscle cannot push. The triceps pulls the arm straight.', 'Now, how do we straighten the arm? The biceps cannot push it back. A muscle can never push. So its partner pulls instead. The triceps gets shorter, and pulls the arm straight. Muscles always work in pairs like this.', T('resting', 'PULLING', 'arm straight'));
  await labStep(ui, g, 'Lift an apple', 'lift', 'Your forearm is a lever. The elbow is its pivot.', 'Now lift an apple. The forearm is a lever, the kind of machine Archimedes studied. It turns about a pivot: the elbow. The biceps pulls just past the elbow, and the load is out in the hand. A small pull near the pivot swings the hand a long way.', T('PULLING', 'resting', 'lifting'));
  await labStep(ui, g, 'Look at a tendon', 'tendon', 'A tendon ties the muscle to the bone, like rope.', 'Look closely where the muscle ends. A tough white cord, called a tendon, ties the muscle to the bone. When the muscle pulls, the tendon pulls the bone. You have more than six hundred muscles, and every one of them works by pulling.', T('PULLING', 'resting', 'a tendon'));
}

/* ----- the atom builder: start with hydrogen (one proton, one electron). Each proton added makes the next element. Electrons fill shells: two in the first, then eight, then eight.
   A full shell ends a row of the table; one electron in a new shell starts the next row, in the same column as the element above it. This is the school model, true for the first twenty. ----- */
const ATOM_ST = { start: { z: 1, n: 0, sh: [1], sym: 'H', name: 'hydrogen' }, he: { z: 2, n: 2, sh: [2], sym: 'He', name: 'helium' }, li: { z: 3, n: 4, sh: [2, 1], sym: 'Li', name: 'lithium' }, ne: { z: 10, n: 10, sh: [2, 8], sym: 'Ne', name: 'neon' }, na: { z: 11, n: 12, sh: [2, 8, 1], sym: 'Na', name: 'sodium' } };
const atomPic = (st, cx, cy, R, k) => { const tot = st.z + st.n, r = (tot > 8 ? 4.2 : 6) * k; let s = '', p = st.z, n = st.n;
  st.sh.forEach((m, i) => { s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R[i] + '" fill="none" stroke="#9FB4D8" stroke-width="' + (1.6 * k) + '" stroke-dasharray="4 5"/>'; });
  for (let i = 0; i < tot; i++) { const a = i * 2.4, d = tot === 1 ? 0 : r * .98 * Math.sqrt(i + .25), isP = (i % 2 === 0 && p > 0) || n === 0; if (isP) p--; else n--;
    s += '<circle cx="' + (cx + d * Math.cos(a)).toFixed(1) + '" cy="' + (cy + d * Math.sin(a)).toFixed(1) + '" r="' + r + '" fill="' + (isP ? '#E5484D' : '#B8BFCC') + '" stroke="#fff" stroke-width="' + (.8 * k) + '"/>'; }
  st.sh.forEach((m, i) => { s += '<g class="ab-sh ab-sh' + i + '" style="transform-origin:' + cx + 'px ' + cy + 'px">'; for (let j = 0; j < m; j++) { const a = j / m * 2 * Math.PI + i * .5; s += '<circle cx="' + (cx + R[i] * Math.cos(a)).toFixed(1) + '" cy="' + (cy + R[i] * Math.sin(a)).toFixed(1) + '" r="' + (5.5 * k) + '" fill="' + (i === st.sh.length - 1 && m < (i ? 8 : 2) ? '#FFC83D' : '#19A7B8') + '" stroke="#1B2A4E" stroke-width="' + (1.2 * k) + '"/>'; } s += '</g>'; });
  return s; };
const ATOM_LAB = (() => {
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An atom: red protons and grey neutrons in the middle, and blue electrons on rings around it. Beside it, its name, and its place in the periodic table">' +
    '<rect width="400" height="290" rx="14" fill="#F2F5FB"/>';
  for (const id in ATOM_ST) s += '<g class="ab-st ab-' + id + '">' + atomPic(ATOM_ST[id], 132, 138, [42, 76, 108], 1) + '</g>';
  s += '<g font-weight="700"><g font-size="11" fill="#5A678A"><circle cx="18" cy="266" r="5" fill="#E5484D"/><text x="27" y="270">proton</text><circle cx="84" cy="266" r="5" fill="#B8BFCC"/><text x="93" y="270">neutron</text><circle cx="156" cy="266" r="5" fill="#19A7B8" stroke="#1B2A4E" stroke-width="1"/><text x="165" y="270">electron</text></g>' +
    '<rect x="258" y="14" width="132" height="118" rx="14" fill="#fff" stroke="#C9CEDA" stroke-width="2"/><text class="ab-sym" x="324" y="64" font-size="44" text-anchor="middle" fill="#1B2A4E">H</text><text class="ab-name" x="324" y="86" font-size="15" text-anchor="middle" fill="#1B2A4E">hydrogen</text>' +
    '<text class="ab-p" x="324" y="104" font-size="12" text-anchor="middle" fill="#E5484D">protons: 1</text><text class="ab-e" x="324" y="121" font-size="12" text-anchor="middle" fill="#0C7C8C">electrons: 1</text>' +
    '<text x="324" y="156" font-size="11" text-anchor="middle" fill="#5A678A">its place in the table</text>';
  for (let z = 1; z <= 18; z++) { const e = EL(z), col = e.group <= 2 ? e.group : e.group - 10; s += '<rect class="ab-c" data-z="' + z + '" x="' + (258 + (col - 1) * 16.6) + '" y="' + (164 + (e.period - 1) * 17) + '" width="15" height="15" rx="3.500" fill="#E6E9F0"/>'; }
  return s + '</g></svg>';
})();
function atomSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab atomlab fill', 'data-s': 'start', html: ATOM_LAB })); atomShow($('.lab', stage), 'start'); }
function atomShow(g, id) { const st = ATOM_ST[id]; $('.ab-sym', g).textContent = st.sym; $('.ab-name', g).textContent = st.name; $('.ab-p', g).textContent = 'protons: ' + st.z; $('.ab-e', g).textContent = 'electrons: ' + st.sh.join(', ');
  $$('.ab-c', g).forEach(c => { const z = Number(c.dataset.z); c.setAttribute('fill', z === st.z ? '#FFC83D' : z < st.z ? '#BFE3EF' : '#E6E9F0'); c.setAttribute('stroke', z === st.z ? '#1B2A4E' : 'none'); c.setAttribute('stroke-width', '1.500'); }); }
async function atomSim(stage, ui) {
  atomSetup(stage); const g = $('.lab', stage), T = id => () => { atomShow(g, id); tone(360 + ATOM_ST[id].z * 40, .16, 'sine', .05); };
  ui.prompt('This is hydrogen: one proton, one electron. Add a proton!', 'This is an atom of hydrogen, the simplest atom there is. In the middle is one red proton. Around it goes one electron. Tap the button to add another proton.');
  await labStep(ui, g, 'Add a proton', 'he', 'Two protons: it is helium now! The first shell is full.', 'Two protons. It is not hydrogen any more. It is a new element: helium. The number of protons decides which element an atom is. Helium has two electrons, and that fills the first ring, which is called a shell. Two grey neutrons have joined the protons in the nucleus.', T('he'));
  await labStep(ui, g, 'Add one more', 'li', 'Three: lithium. A new shell starts, and a new row.', 'Three protons: lithium. The first shell is full, so the third electron has to start a new shell, further out. Look at the table. Lithium starts a new row, underneath hydrogen.', T('li'));
  await labStep(ui, g, 'Add seven more', 'ne', 'Ten protons: neon. The second shell is full: eight.', 'Now we add seven more, one at a time: beryllium, boron, carbon, nitrogen, oxygen, fluorine, and neon. Neon has ten protons. Its second shell holds eight electrons, and now it is full. That is the end of the second row.', T('ne'));
  await labStep(ui, g, 'Add one more', 'na', 'Sodium: one electron in shell three. Just like lithium!', 'Eleven protons: sodium. Its last electron starts a third shell. So sodium has one outer electron, just as lithium has. In the table it sits right underneath lithium, in the same column. Elements in the same column behave alike.', T('na'));
}
const PAPER_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#EEF4FB"/>' +
  [[18, 28, 92, 116, 'the page'], [128, 28, 46, 116, '1 cut'], [192, 28, 46, 58, '2 cuts'], [256, 28, 23, 58, '3 cuts']].map(r => '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="3" fill="#fff" stroke="#1B2A4E" stroke-width="2.500"/><text x="' + (r[0] + r[2] / 2) + '" y="162" font-size="12" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + r[4] + '</text>').join('') +
  '<path d="M110 20v132" stroke="#8B7BEA" stroke-width="2.500" stroke-dasharray="6 5"/><g transform="translate(286 104)"><path d="M0 0l18 22M18 0 0 22" stroke="#5A678A" stroke-width="3.500" stroke-linecap="round"/><circle cx="-2" cy="26" r="6" fill="none" stroke="#E5484D" stroke-width="3"/><circle cx="20" cy="26" r="6" fill="none" stroke="#E5484D" stroke-width="3"/></g></svg>' };

/* ----- the alkali metals in water: lithium, sodium and potassium sit one under another in the first column, each with one outer electron.
   Lithium floats and fizzes; sodium melts into a silver ball and darts about; potassium catches fire with a lilac flame. The gas is hydrogen. Further down the column, the outer electron is further from the nucleus and leaves more easily. ----- */
const ALKALI_LAB = (() => {
  const mini = (st, x, y, lab) => '<g>' + atomPic(st, x, y, [12, 23, 34, 45], .62) + '<text x="' + x + '" y="' + (y + 62) + '" font-size="12" font-weight="700" text-anchor="middle" fill="#1B2A4E">' + lab + '</text></g>';
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A glass trough of water on a bench. A small piece of metal is dropped in. Beside it, the first column of the periodic table: lithium, sodium, potassium">' +
    '<defs><clipPath id="akclip"><rect x="34" y="100" width="252" height="146" rx="8"/></clipPath></defs><rect width="400" height="290" rx="14" fill="#EAF4FB"/><rect y="250" width="400" height="40" fill="#B98A4E"/><rect y="250" width="400" height="6" fill="#8A5A34"/>' +
    '<rect x="30" y="128" width="260" height="122" rx="10" fill="#F6FBFF" stroke="#1B2A4E" stroke-width="3"/><rect x="33" y="176" width="254" height="71" rx="7" fill="#9AD8F0"/><path d="M33 178q32-7 64 0t64 0 64 0 62 0" fill="none" stroke="#fff" stroke-width="2.500" opacity=".8"/>' +
    '<g clip-path="url(#akclip)"><g class="ak-move"><g class="ak-bub" fill="#fff" stroke="#7CC4E0" stroke-width="1">' + [[-20, 0], [-8, .3], [10, .6], [22, .15], [0, .45], [-14, .75], [16, .9], [-2, .2]].map(b => '<circle cx="' + (160 + b[0]) + '" cy="186" r="4.800" style="animation-delay:-' + b[1] + 's"/>').join('') + '</g>' +
    '<g class="ak-flame"><path d="M160 170q-22-22 0-52 5 15 11-2 20 30 0 54z" fill="#C9A0F2"/><path d="M160 170q-10-13 0-27 10 14 0 27z" fill="#F3E4FF"/></g>' +
    '<rect class="ak-li" x="145" y="164" width="30" height="19" rx="4" fill="#C9CEDA" stroke="#5A678A" stroke-width="2.500"/><circle class="ak-ball" cx="160" cy="173" r="12" fill="#E6E9F0" stroke="#5A678A" stroke-width="2.500"/><circle class="ak-ball" cx="156" cy="169" r="3.500" fill="#fff"/></g></g>' +
    '<g class="ak-tongs"><path d="M150 40 156 96M176 40l-8 56" stroke="#5A678A" stroke-width="4" stroke-linecap="round"/><rect x="147" y="92" width="30" height="19" rx="4" fill="#C9CEDA" stroke="#5A678A" stroke-width="2.500"/></g>' +
    '<g class="ak-why"><rect x="8" y="8" width="292" height="150" rx="12" fill="#fff" stroke="#C9CEDA" stroke-width="2"/>' + mini({ z: 3, n: 4, sh: [2, 1] }, 52, 74, 'lithium') + mini({ z: 11, n: 12, sh: [2, 8, 1] }, 136, 74, 'sodium') + mini({ z: 19, n: 20, sh: [2, 8, 8, 1] }, 240, 74, 'potassium') + '</g>' +
    '<g font-weight="700" text-anchor="middle">' + [['Li', 3, 'lithium', 'li'], ['Na', 11, 'sodium', 'na'], ['K', 19, 'potassium', 'k']].map((e, i) => '<g class="ak-card ak-c-' + e[3] + '"><rect x="314" y="' + (22 + i * 62) + '" width="72" height="54" rx="10" fill="#fff" stroke="#C9CEDA" stroke-width="2"/><text x="326" y="' + (38 + i * 62) + '" font-size="10" fill="#5A678A">' + e[1] + '</text><text x="350" y="' + (54 + i * 62) + '" font-size="24" fill="#1B2A4E">' + e[0] + '</text><text x="350" y="' + (69 + i * 62) + '" font-size="10" fill="#1B2A4E">' + e[2] + '</text></g>').join('') +
    '<path d="M304 30v160m-6-9 6 10 6-10" fill="none" stroke="#E5484D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="350" y="218" font-size="10.500" fill="#E5484D">more reactive</text><text x="350" y="231" font-size="10.500" fill="#E5484D">going down</text>' +
    '<rect x="62" y="258" width="196" height="26" rx="11" fill="#fff" opacity=".95"/><text class="ak-t" x="160" y="276" font-size="13.500" fill="#1B2A4E">a trough of water</text></g></svg>';
})();
function alkaliSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab alkalilab fill', 'data-s': 'start', html: ALKALI_LAB })); }
async function alkaliSim(stage, ui) {
  alkaliSetup(stage); const g = $('.lab', stage), T = (t, f) => () => { $('.ak-t', g).textContent = t; if (f) { tone(f, .5, 'sawtooth', .025); tone(f * 1.5, .4, 'triangle', .02, .08); } };
  ui.prompt('Three metals from one column. Drop in the first!', 'Lithium, sodium and potassium sit one under another, in the first column of the periodic table. They are the alkali metals. A chemist, behind a safety screen, drops a tiny piece of each into water. Tap the button for the first one.');
  await labStep(ui, g, 'Drop in lithium', 'li', 'Lithium floats, and fizzes. The bubbles are hydrogen gas!', 'Lithium floats on the water, and fizzes steadily. The metal is reacting with the water. It makes bubbles of hydrogen gas.', T('lithium: fizzing', 180));
  await labStep(ui, g, 'Drop in sodium', 'na', 'Sodium melts into a silver ball, and darts about!', 'Now sodium, one place down. The reaction is so hot that the sodium melts into a silver ball, and darts across the water, hissing. It is more reactive than lithium.', T('sodium: darting about', 260));
  await labStep(ui, g, 'Drop in potassium', 'k', 'Potassium bursts into a lilac flame!', 'Now potassium, one more place down. It reacts so fast that the hydrogen catches fire at once, and burns with a lilac flame. Each step down the column, the metal is more reactive.', T('potassium: a lilac flame', 380));
  await labStep(ui, g, 'Look at the atoms', 'why', 'One outer electron each. Further out, it leaves more easily.', 'Why are they alike? Look at their atoms. Each has just one electron in its outer shell, the yellow one. To react, an atom gives that electron away. In potassium, it is furthest from the nucleus, so it leaves most easily. That is why potassium reacts the fastest. Never try this yourself. These metals are kept under oil, for chemists only.', T('one outer electron each'));
}

/* ----- the crown lab: the story of Archimedes and the golden wreath of King Hiero of Syracuse. It was first written down by Vitruvius, two hundred years later, and may not have happened this way: the game says "the story goes".
   The science is sound. The crown and a bar of pure gold weigh the same. Under water, a thing pushes aside its own volume. The crown pushes aside more, so it is bigger for its weight: less dense than gold.
   1 kg of gold fills 52 mL (density 19.3 g a cubic centimetre). A crown of 700 g gold and 300 g silver (density 10.49) fills 36 + 29 = 65 mL. ----- */
const CROWN_LAB = (() => {
  const tick = (ml, y) => '<path d="M330 ' + y + 'h' + (ml % 50 ? 6 : 11) + '" stroke="#1B2A4E" stroke-width="1.500"/>' + (ml % 50 ? '' : '<text x="345" y="' + (y + 4) + '" font-size="10" font-weight="700" fill="#1B2A4E">' + ml + '</text>');
  let ticks = ''; for (let ml = 450; ml <= 600; ml += 10) ticks += tick(ml, 150 - (ml - 500) * .8);
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A balance with a golden crown on one side and a bar of gold on the other, level. Beside it, a tall glass of water with a scale in millilitres">' +
    '<rect width="400" height="290" rx="14" fill="#FBF4E4"/><rect y="250" width="400" height="40" fill="#C9B48E"/>' +
    '<g><path d="M100 250V96" stroke="#6B4424" stroke-width="7" stroke-linecap="round"/><path d="M70 250h60" stroke="#6B4424" stroke-width="9" stroke-linecap="round"/><path d="M30 100h140" stroke="#8A5A34" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="98" r="7" fill="#FFC83D" stroke="#6B4424" stroke-width="2"/>' +
    '<path d="M34 100 18 162M34 100l16 62M166 100l-16 62M166 100l16 62" stroke="#8A5A34" stroke-width="2"/><path d="M10 162h48q-6 14-24 14T10 162zM142 162h48q-6 14-24 14t-24-14z" fill="#E9C98A" stroke="#8A5A34" stroke-width="2" stroke-linejoin="round"/>' +
    '<g class="cr-c0" transform="translate(6 112) scale(.86)">' + CROWN_IN + '</g><g class="cr-b0" transform="translate(140 118) scale(.82)">' + GOLDBAR_ART.svg.replace(/<\/?svg[^>]*>/g, '') + '</g>' +
    '<g font-size="12" font-weight="700" text-anchor="middle" fill="#1B2A4E"><text x="34" y="196">crown: 1 kg</text><text x="166" y="196">gold: 1 kg</text></g></g>' +
    '<rect class="cr-water" x="262" y="150" width="66" height="94" fill="#8ED0F4"/><path class="cr-mark" d="M256 108.400h78" stroke="#C98A12" stroke-width="2.500" stroke-dasharray="6 4"/>' +
    '<g class="cr-b1" transform="translate(269 196) scale(.82)">' + GOLDBAR_ART.svg.replace(/<\/?svg[^>]*>/g, '') + '</g><g class="cr-c1" transform="translate(267 186) scale(.86)">' + CROWN_IN + '</g>' +
    '<path class="cr-str" d="M295 20v170" stroke="#5A678A" stroke-width="1.500"/><path d="M262 56v188h66V56" fill="none" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/>' + ticks +
    '<g class="cr-why"><rect x="14" y="12" width="230" height="74" rx="12" fill="#fff" stroke="#C9CEDA" stroke-width="2"/><rect x="28" y="38" width="30" height="30" rx="3" fill="#FFC83D" stroke="#C98A12" stroke-width="2"/><rect x="132" y="28" width="40" height="40" rx="3" fill="#D9DEE8" stroke="#8A93A8" stroke-width="2"/>' +
    '<g font-size="11" font-weight="700" fill="#1B2A4E"><text x="64" y="50">1 kg gold</text><text x="64" y="64">52 mL</text><text x="178" y="46">1 kg silver</text><text x="178" y="60">95 mL</text></g></g>' +
    '<g font-weight="700" text-anchor="middle"><rect x="218" y="256" width="174" height="26" rx="11" fill="#fff" opacity=".95"/><text class="cr-t" x="305" y="274" font-size="13" fill="#1B2A4E">water: 500 mL</text></g></svg>';
})();
function crownSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab crownlab fill', 'data-s': 'start', html: CROWN_LAB })); }
async function crownSim(stage, ui) {
  crownSetup(stage); const g = $('.lab', stage), T = t => () => { $('.cr-t', g).textContent = t; };
  ui.prompt('The crown and the gold weigh the same. Test them!', 'The story goes that King Hiero gave a goldsmith a bar of gold, to make a crown. The king feared the goldsmith had kept some gold, and mixed in cheaper silver. The crown weighs exactly the same as a bar of pure gold. So how can we tell? Archimedes had an idea, in his bath. Tap the button.');
  await labStep(ui, g, 'Lower the gold bar', 'gold', 'The gold bar pushes aside 52 millilitres of water.', 'Lower the bar of pure gold into the water. The water rises, because the gold takes up room. It pushes aside exactly its own size of water: 52 millilitres.', T('with the gold: 552 mL'));
  await labStep(ui, g, 'Lower the crown', 'crown', 'The crown pushes aside 65 millilitres. It is bigger!', 'Now take out the gold, and lower the crown. The water rises higher, past the gold mark: 65 millilitres. The crown weighs the same as the gold bar, but it takes up more room.', T('with the crown: 565 mL'));
  await labStep(ui, g, 'Find out why', 'why', 'Same weight, more room: silver was mixed in. Eureka!', 'Why is the crown bigger? Gold is very dense: a kilogram of it fills only 52 millilitres. Silver is less dense: a kilogram fills 95. So a crown with silver mixed in is bigger than pure gold of the same weight. The goldsmith cheated! The story says Archimedes leapt from his bath, shouting Eureka! That is Greek for: I have found it.', T('the crown is not pure gold'));
}
const ORANGE_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#EAF6FD"/>' +
  [80, 240].map((x, i) => '<path d="M' + (x - 46) + ' 30v108q0 12 12 12h68q12 0 12-12V30" fill="#F6FBFF" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/><rect x="' + (x - 43) + '" y="62" width="86" height="85" rx="9" fill="#9AD8F0"/>' +
    (i ? '<circle cx="' + x + '" cy="126" r="19" fill="#FFD9A0" stroke="#E0A04A" stroke-width="2.500"/><path d="M' + x + ' 107v38M' + (x - 16) + ' 116l32 20M' + (x + 16) + ' 116l-32 20" stroke="#E0A04A" stroke-width="1.500"/>' : '<circle cx="' + x + '" cy="64" r="22" fill="#FF9A3D" stroke="#C96A12" stroke-width="2.500"/><circle cx="' + (x - 7) + '" cy="56" r="1.500" fill="#C96A12"/><circle cx="' + (x + 6) + '" cy="62" r="1.500" fill="#C96A12"/><circle cx="' + (x - 2) + '" cy="72" r="1.500" fill="#C96A12"/>') +
    '<text x="' + x + '" y="20" font-size="13" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + (i ? 'peeled: it sinks' : 'with peel: it floats') + '</text>').join('') + '</svg>' };

/* ----- the race (the fable of the hare and the tortoise is Aesop's, a Greek storyteller), the coding look, and things to count ----- */
const GR_RACE = { act: 'race', me: TORTOISE_ART, rival: HARE_ART, rivalName: 'hare', track: 10,
  intro: { text: 'You are the tortoise. Answer fast to beat the hare!', say: 'The story of the hare and the tortoise was first told in Greece, by a storyteller called Aesop, more than two thousand years ago. Now it is your race. You are the tortoise. Tap the right answer, and the tortoise takes a step. The hare runs at a steady speed, and he never stops. Reach the flag before the hare, and you move up a level. Press Go when you are ready!' },
  win: { text: 'You beat the hare to the flag!', say: 'You beat the hare to the flag! Slow and steady wins the race, said Aesop. Quick and right wins it faster.' },
  lose: { text: 'The hare got there first this time.', say: 'The hare got there first this time. Quick answers will catch him.' } };
const AGORA = { mover: OWL_ART, goal: OLIVE_TREE, goalName: 'olive tree', flag: 'glowing-star', flagName: 'star', rock: COLUMN_ART, cls: 'agora' };
GRAPH_SETS.greece = { noun: 'foods', one: 'food', items: [{ name: 'olives', art: 'olive' }, { name: 'grapes', art: 'grapes' }, { name: 'lemons', art: 'lemon' }, { name: 'cheeses', art: 'cheese-wedge' }, { name: 'loaves', art: 'bread' }] };
THING_NAMES.olive = 'olives';

COUNTRIES.greece = {
  cheers: ['Eureka!', 'Opa!'],          /* "I have found it!" and a Greek shout of joy, used only here */
  ladders: ['sieve'],                   /* the sieve keeps its own progress; a country reset puts it back. The periodic table and the body atlas belong to no country and are not reset */
  name: 'Greece', hello: 'Yia sou! Start with Athens maths.', helloSay: [GR('γεια σου', YIASOU), 'Start with Athens maths.'], scene: GR_SCENE,
  thing: 'olive', boat: 'sailboat',
  videos: {
    body: { yt: '3haTJCOkyxA', title: 'How do our muscles and bones work?', by: 'BBC Teach', icon: 'bone' },
    song: { yt: 'rz4Dd1I_fX0', title: 'The Periodic Table Song', by: 'AsapSCIENCE', icon: 'musical-notes' },
    atom: { yt: 'yQP4UJhNn0I', title: 'Just how small is an atom?', by: 'TED-Ed', icon: 'magnifying-glass-tilted-left' },
    bath: { yt: 'ijj58xD5fDI', title: 'How taking a bath led to Archimedes’ principle', by: 'TED-Ed', icon: 'bathtub' }
  },
  souvenirs: [
    { id: 'gr-temple', art: PARTHENON_ART, name: 'The Parthenon', price: 30, need: 'm1' }, { id: 'gr-owl', art: OWL_ART, move: 'flap', head: [50, 16, 62], name: 'Athena’s owl', price: 25, need: 'm1' },
    { id: 'gr-wreath', art: WREATH_ART, name: 'Olive wreath', price: 15, need: 'm2' }, { id: 'gr-bone', art: 'bone', name: 'Model femur', price: 20, need: 'm2' },
    { id: 'gr-atom', art: ATOM_ART, move: 'spin', name: 'Model atom', price: 25, need: 'm3' }, { id: 'gr-table', art: PTABLE_ART, name: 'Periodic table poster', price: 25, need: 'm3' },
    { id: 'gr-crown', art: CROWN_ART, move: 'twinkle', name: 'Golden crown', price: 30, need: 'm4' }, { id: 'gr-vase', art: 'amphora', name: 'Champion’s vase', price: 40, need: 'boss' }
  ],
  themes: { aegean: { name: 'Greek island room', price: 40, need: 'boss', wall: '#F6FBFF', wall2: '#E4F1FB', floor: '#3B8FC4', line: '#2A74A6', rug: '#FFC83D', sky: ['#4FB3EA', '#D8F0FB'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['body'] }, { id: 'v2', after: ['boss'], choose: ['song', 'atom', 'bath'] }],
  path: [
    { m: 'm1', x: 10, y: 60, px: 28, py: 17 }, { m: 'm2', x: 24, y: 80, px: 70, py: 27 }, { video: 'v1', x: 38, y: 62, px: 30, py: 38 },
    { m: 'm3', x: 50, y: 82, px: 70, py: 49 }, { m: 'm4', x: 63, y: 64, px: 30, py: 60 }, { m: 'boss', x: 78, y: 82, px: 70, py: 71 }, { video: 'v2', x: 91, y: 62, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Athens maths', icon: PARTHENON_ART, sticker: 'abacus',
      intro: { text: 'Hunt for prime numbers, as the Greeks did!', say: [GR('γεια σου', YIASOU), 'Welcome to Greece! The Greeks loved numbers. They found out which numbers can be shared out equally, and which cannot. Those are the prime numbers. Today you hunt for them.'] },
      rounds: [{ skill: 'factors' },
        { act: 'sieve', intro: { say: 'This is the sieve of Eratosthenes, a Greek who ran the great library at Alexandria. It catches every prime number. One is special: it is not prime. Two is prime, so it stays. Now count in twos from two, and tap every number you land on. Those are multiples of two, so they are not prime.' } },
        { skill: 'factors' },
        { act: 'match', text: 'Greek letters! Match each one to its meaning.', say: 'Scientists and mathematicians still use Greek letters today. Match each letter to what it means.', pairs: [
          { a: { art: letterArt('α'), label: 'Alpha' }, b: { art: 'input-latin-letters', label: 'The first letter' }, text: 'Alpha and beta are the first two letters: the alphabet!' },
          { a: { art: letterArt('π'), label: 'Pi' }, b: { art: 'white-circle', label: 'Circles' }, text: 'Pi is how many times a circle’s width fits round it.' },
          { a: { art: letterArt('Δ'), label: 'Delta' }, b: { art: 'triangular-ruler', label: 'A triangle shape' }, text: 'A capital delta is a triangle. So is a river’s delta.' },
          { a: { art: letterArt('Ω'), label: 'Omega' }, b: { art: 'chequered-flag', label: 'The last letter' }, text: 'Omega is the last of the 24 Greek letters.' }] },
        GR_RACE, { skill: 'factors' }, { skill: '@review', or: 'chance' }, { skill: '@review', or: 'measure' }] },
    { id: 'm2', name: 'Olympic body', icon: 'bone', sticker: 'flexed-biceps',
      intro: { text: 'Name your bones. Then see how muscles move them!', say: 'The first Olympic Games were held in Greece, at Olympia, nearly three thousand years ago. And a Greek doctor called Hippocrates was the first to teach that the body can be studied, like anything else in nature. Today you study what makes an athlete move: bones and muscles.' },
      rounds: [
        skelPlace(1, 'Name the big bones. Put each name on its line.', 'This is your skeleton, seen from the front. Doctors all over the world use the same names for the bones. Start with six big ones. Drag each name to the end of its line.', { text: 'Six bones named. Your skeleton has 206!' }),
        { skill: 'bones' },
        { act: 'predict', q: 'To bend your arm, the biceps muscle must…', qsay: 'Here is an experiment. Hold out your arm, and bend it at the elbow. A muscle called the biceps, on top of your upper arm, does that. What do you think the biceps does, to bend your arm? Make a prediction.',
          options: [O('Pull', 'hook'), O('Push', 'raised-hand'), O('Go soft', 'cloud')], answer: 0, setup: armSetup, sim: armSim,
          right: 'You predicted it! A muscle works by pulling.', wrong: 'Surprise! A muscle can only pull, never push.',
          tryit: { icon: 'flexed-biceps', big: 'Feel your biceps!', text: 'Hold your upper arm. Bend, then straighten.', say: 'Now try it. Wrap one hand round your other upper arm. Bend your elbow, and feel the biceps on top go hard and fat. Now push your hand down on a table, to straighten the arm, and feel the triceps underneath go hard instead.' } },
        { skill: 'muscles' },
        skelPlace(2, 'Six more bones. Use their real names!', 'Now six more, with the names doctors use. The clavicle is the collarbone. The scapula is the shoulder blade. The sternum is the breastbone. The mandible is the jaw. The radius and the ulna are the two bones of the forearm.', { text: 'Twelve bones named. You sound like a doctor!' }),
        { act: 'sort', even: true, text: 'Which kind of joint is it?', say: 'A joint is where two bones meet. A hinge joint bends one way, like a door. A ball and socket joint turns every way. Which kind is this one?', bins: [{ label: 'Hinge', icon: 'door' }, { label: 'Ball and socket', icon: 'soccer-ball' }],
          items: [{ icon: 'flexed-biceps', label: 'Elbow', bin: 0, why: 'Your elbow bends one way only, like a door.' }, { icon: 'person-cartwheeling', label: 'Shoulder', bin: 1, why: 'Your shoulder can swing round in a full circle.' }, { icon: 'index-pointing-up', label: 'Finger joint', bin: 0, why: 'A finger joint bends one way only: a hinge.' }, { icon: 'person-running', label: 'Hip', bin: 1, why: 'Your hip lets your leg swing in every direction.' }],
          done: { text: 'Hinges bend one way. A ball and socket turns every way.' } },
        { skill: 'bones' }, { skill: 'muscles' },
        { act: 'point', system: 'skeleton', n: 6, ids: skelUpTo(2) }] },
    { id: 'm3', name: 'Atoms and elements', icon: ATOM_ART, sticker: 'test-tube',
      intro: { text: 'Build an atom. Then say the elements in order!', say: 'A Greek thinker called Democritus said that everything is made of tiny pieces, too small to cut. He called them atoms. Today you build some atoms, and then you say the elements of the periodic table, in order.' },
      rounds: [
        { act: 'predict', q: 'Add one proton to a hydrogen atom. What do you get?', qsay: 'Here is an experiment. Every atom has tiny parts called protons in its middle. Hydrogen, the simplest atom, has just one. What do you think you get, if you add one more proton to a hydrogen atom? Make a prediction.',
          options: [O('A new element', 'sparkles'), O('Bigger hydrogen', 'droplet'), O('Water', 'potable-water')], answer: 0, setup: atomSetup, sim: atomSim,
          right: 'You predicted it! The protons decide the element.', wrong: 'Surprise! One more proton makes a new element.',
          tryit: { icon: 'scissors', pic: PAPER_PIC, big: 'Cut it in half!', text: 'Cut paper in half, again and again. Count your cuts.', say: 'Now try what Democritus imagined, with a grown-up. Cut a sheet of paper in half. Cut one half in half again. Keep going, and count your cuts. You will manage about eight. To get down to one atom, you would need about thirty-one.' } },
        { skill: 'atoms' },
        { act: 'elements' },
        { skill: 'atoms' },
        { act: 'predict', q: 'Sodium fizzes in water. Potassium, just below it, will react…', qsay: 'Here is another experiment. Sodium is a soft metal. Drop a piece in water, and it fizzes and darts about. Potassium is just below sodium, in the same column of the periodic table. How do you think potassium will react with water? Make a prediction.',
          options: [O('More strongly', 'fire'), O('More gently', 'feather'), O('Not at all', 'cross-mark')], answer: 0, setup: alkaliSetup, sim: alkaliSim,
          right: 'You predicted it! Lower in the column, it reacts more.', wrong: 'Surprise! Lower in the column, it reacts more.',
          tryit: { icon: 'bubbles', big: 'Make a safe fizz!', text: 'A spoon of baking soda. Add vinegar. Watch it fizz!', say: 'Now try a safe reaction, with a grown-up. Put a spoonful of baking soda in a glass, and pour in some vinegar. It fizzes! The two are reacting, and making a new substance: bubbles of a gas called carbon dioxide.' } },
        { skill: 'atoms' },
        { act: 'elements', part: 'group' },
        { skill: 'atoms' }] },
    { id: 'm4', name: 'Eureka!', icon: CROWN_ART, sticker: 'crown',
      intro: { text: 'Find Greece, speak Greek, and test a king’s crown!', say: 'Time to find Greece on the map, learn some Greek words, test a golden crown as Archimedes did, and code an owl home to her olive tree.' },
      rounds: [
        { act: 'findmap', text: 'Where is Greece? Tap it.', say: 'This is the east of the Mediterranean Sea. Where is Greece? Tap it.', view: [512, 132, 96, 72], targets: ['300', '380', '792', '100'], answer: '300',
          hint: { text: 'Greece is at the tip of a peninsula, with many islands.' }, done: { text: 'You found Greece! It has more than a thousand islands.', say: 'You found Greece! It lies between Italy and Turkey, and it has more than a thousand islands, large and small.' } },
        { act: 'meet', text: 'Tap each card to hear Greek.', say: 'People in Greece speak Greek. It has its own alphabet. Tap each card to hear the word.', lang: 'el', words: GREEK },
        { skill: 'greek' },
        { act: 'match', text: 'Doctors use Greek! Match the word to the doctor.', say: 'Hippocrates and the first doctors spoke Greek, so doctors’ words are still built from Greek ones. Match each Greek word to the doctor’s word made from it.', pairs: [
          { a: { art: 'anatomical-heart', label: 'kardiá: heart' }, b: { art: 'stethoscope', label: 'Cardiologist' }, text: 'A cardiologist is a heart doctor. Kardiá means heart.', say: [GR('καρδιά', 'kar-thee-ah', true), 'means heart. A cardiologist is a heart doctor.'] },
          { a: { art: 'raised-hand', label: 'dérma: skin' }, b: { art: 'lotion-bottle', label: 'Dermatologist' }, text: 'A dermatologist is a skin doctor. Dérma means skin.', say: [GR('δέρμα', 'thair-ma', true), 'means skin. A dermatologist is a skin doctor.'] },
          { a: { art: 'brain', label: 'névro: nerve' }, b: { art: 'high-voltage', label: 'Neurologist' }, text: 'A neurologist is a doctor of nerves and the brain.', say: [GR('νεύρο', 'nev-ro', true), 'means nerve. A neurologist is a doctor of the nerves and the brain.'] },
          { a: { art: 'bone', label: 'ostó: bone' }, b: { art: 'x-ray', label: 'Osteology' }, text: 'Osteology is the study of bones. Ostó means bone.', say: [GR('οστό', 'oss-toh', true), 'means bone. Osteology is the study of bones.'] }] },
        { skill: 'greek' },
        { act: 'predict', q: 'If the crown is pure gold, it pushes aside…', qsay: 'Here is an experiment. A crown and a bar of pure gold weigh exactly the same. We lower each one into water, and see how much water it pushes aside. If the crown is pure gold too, how much water will it push aside, compared with the bar? Make a prediction.',
          options: [O('The same water', 'balance-scale'), O('More water', 'up-arrow'), O('Less water', 'down-arrow')], answer: 0, setup: crownSetup, sim: crownSim,
          right: 'Right: pure gold would match. This crown did not!', wrong: 'Pure gold would match the bar. This crown did not!',
          tryit: { icon: 'tangerine', pic: ORANGE_PIC, big: 'Sink an orange!', text: 'Float an orange. Peel it. Try again!', say: 'Now try it. Put an orange in a bowl of water. It floats, because its peel is full of tiny pockets of air. Now peel it, and try again. Without its peel, the orange is denser than water. It sinks!' } },
        { skill: 'float' }, { skill: 'float' },
        { act: 'code', look: AGORA, text: 'Code the owl to her olive tree.', say: 'The owl of Athena wants to get home to her olive tree. Count the squares. Tap or drag arrows into the boxes to make a path past the columns. Then tap Go.', cols: 5, rows: 3, start: [0, 2], goal: [4, 0], rocks: [[1, 2], [2, 0], [4, 1]], slots: 7,
          path: [[0, 2], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0], [4, 0]], legs: [[0, 1], [3, 1], [3, 0], [4, 0]], solution: [['u'], ['r'], ['r'], ['r'], ['u'], ['r']] },
        { act: 'code', look: AGORA, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long way, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 4], goal: [5, 0], rocks: [[3, 4], [1, 2], [4, 3], [2, 0], [0, 2]], slots: 4, repeat: true,
          path: [[0, 4], [1, 4], [2, 4], [2, 3], [2, 2], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]], legs: [[2, 4], [2, 1], [5, 1], [5, 0]], solution: [['r', 2], ['u', 3], ['r', 3], ['u', 1]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'trophy',
      intro: { text: 'Show everything you know about Greece!', say: 'The big one! Show everything you have learned in Greece.' },
      rounds: [{ skill: 'factors' }, { skill: 'bones' },
        skelPlace(3, 'The last five bones. Name them all!', 'Five bones to go. The carpals are in the wrist. The phalanges are the fingers. The patella is the kneecap. The tibia is the shin bone, and the thin fibula lies beside it.', { text: 'Every bone on the chart is named. Bravo, Doctor!' }),
        { skill: 'atoms' }, { skill: 'muscles' }, { act: 'elements' }, { skill: 'greek' }, { skill: 'float' },
        { act: 'point', system: 'skeleton', n: 8 }, { skill: 'scithink' }, { skill: '@review', or: 'chance' }] }
  ]
};
W.gr = { OWL_ART, PARTHENON_ART, COLUMN_ART, OLIVE_TREE, ATOM_ART, CROWN_ART, WREATH_ART, GOLDBAR_ART, PTABLE_ART, GR_SCENE, skelSvg, SKEL, PAPER_PIC, ORANGE_PIC };
