/* ===== Canada: the tenth country, built 9 October on Tony's instruction: "OK, lets develop Canada. My daughter loves ice skating".
   Everything turns on the ice: a skater's spin (angular momentum), why a spin makes you dizzy (the inner ear, the body system for the atlas),
   why ice is slippery (friction), and the northern lights (oxygen and nitrogen glowing: the chemistry step). Decimals are the new maths, on the rink.
   (B64, G_EYE, MAPLE_D, BEAVER_IN, labStep, the race, the decimals skill and the ruler come from the earlier files.)
   Sources, read 9 October 2026, Wikipedia unless named:
   "Canada" (second-largest country by total area; the world's longest coastline, 243,042 km; English and French are official; capital Ottawa; ten provinces and three territories; First Nations, Inuit and Métis),
   "Rideau Canal Skateway" (7.8 km cleared, "the world's largest skating rink"; no skating days at all in the 2022–23 winter, only 10 in 2023–24),
   Guinness World Records, "Fastest spin on ice skates" (Olivia Oliver of Canada, 342 revolutions a minute, Warsaw, 19 January 2015),
   "Semicircular canals" (three in each inner ear; filled with endolymph; when the head turns the fluid lags and bends the cupula, whose hair cells signal the brain;
     in a steady spin the fluid catches up and the feeling fades; when the spin stops the fluid keeps moving, so it feels like turning the other way),
   Mental Floss, "Do figure skaters get dizzy?" (they are not immune: they build tolerance with practice, start with one or two turns, and pick a fixed spot to look at as they stop),
   "Ear" (pinna, ear canal about 2.5 cm, eardrum, malleus, incus, stapes, "the smallest named bone in the body", Eustachian tube, vestibule, three semicircular canals, cochlea, vestibulocochlear nerve),
   "Aurora" (the solar wind; Earth's magnetic field guides electrons and protons into the upper air around both poles, centred near 67° latitude; light from above 80 km, most near 100 km;
     oxygen gives green, 557.7 nm, and at the highest altitudes red, 630 nm; nitrogen gives blue and purple, lowest down; seen from Canada),
   "Ice skating" (skating began in southern Finland over 4,000 years ago; the pressure from a blade cannot explain skating below about −3.5 °C; ice has a "quasi-fluid" surface layer),
   Quanta Magazine, "Why is ice slippery?", 8 December 2025 (agreed: a watery layer on the surface makes ice slippery; pressure alone cannot explain it; why the layer forms is still argued about),
   "Friction" (coefficients of friction: rubber on concrete 0.6 to 0.85 sliding; wood on wood 0.32 to 0.48 sliding; steel on ice 0.03),
   "Insulin" (isolated by Banting and Best in Macleod's laboratory, University of Toronto, 1921; first given to Leonard Thompson, 14, on 11 January 1922), "Maple syrup" (Canada makes more than three-quarters of the world's maple syrup).
   Canadian French: a Canadian French voice (fr-CA) where there is one. ===== */

/* ----- hand-drawn pieces ----- */
const BEAVER_ART = { svg: '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' + BEAVER_IN + '</svg>' };
/* a figure skater gliding to the right on one foot, the other leg stretched behind her: the player in the race and on the rink */
const SKATER_IN = '<ellipse cx="34" cy="60" rx="18" ry="2.400" fill="rgba(27,42,78,.14)"/><path d="M22 57.500h20q3 0 4-2" stroke="#8C98AC" stroke-width="1.800" fill="none" stroke-linecap="round"/>' +
  '<path d="M30 41 33 53" stroke="#F3C7A5" stroke-width="4.200" stroke-linecap="round"/><path d="M29.500 52.500h7.500l1 3.600H28.600z" fill="#fff" stroke="#3E4A5E" stroke-width="1.100" stroke-linejoin="round"/>' +
  '<path d="M29 41 17 37.500 7 37" stroke="#F3C7A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M2.500 34.500l1.200 5.600 6 .4-.6-4.600z" fill="#fff" stroke="#3E4A5E" stroke-width="1.100" stroke-linejoin="round"/><path d="M1 41.500h10" stroke="#8C98AC" stroke-width="1.600" stroke-linecap="round"/>' +
  '<path d="M23 43q5-8 14-5 4 2 2 6-8 2-16-1z" fill="#19A7B8"/><path d="M27 41q3-13 9-16 5 0 5 5-2 9-6 13z" fill="#19A7B8"/>' +
  '<path d="M37 28q6-1 13-6M34 29q-7-1-14-5" stroke="#F3C7A5" stroke-width="3.200" stroke-linecap="round" fill="none"/><circle cx="50.500" cy="21.500" r="1.900" fill="#F3C7A5"/><circle cx="19.500" cy="23.500" r="1.900" fill="#F3C7A5"/>' +
  '<circle cx="40" cy="18" r="6" fill="#F6CBA8"/><path d="M34 16q1-7 7-7 6 0 6 6-4-3-13 1z" fill="#6B4424"/><circle cx="33.500" cy="14" r="3.200" fill="#6B4424"/><circle cx="42.500" cy="18" r="1" fill="#1B2A4E"/>' +
  '<path d="M41.500 21.500q1.500 1 3 0" stroke="#C0392B" stroke-width=".9" fill="none" stroke-linecap="round"/><g fill="#FFD95E"><circle cx="30" cy="34" r=".9"/><circle cx="33" cy="30" r=".9"/><circle cx="27" cy="38" r=".9"/></g>';
const SKATER_ART = B64(SKATER_IN);
/* a snowbank on the rink: what the skater must steer round in the coding puzzles */
const SNOWBANK_ART = B64('<ellipse cx="32" cy="50" rx="27" ry="10" fill="#C9DDF0"/><path d="M6 50q2-16 14-14 4-10 14-8 10-6 16 4 10 2 9 18z" fill="#fff" stroke="#9FB8DA" stroke-width="2"/><path d="M16 42q4-4 8-2M34 34q5-2 9 2" stroke="#D9E8F6" stroke-width="2.200" fill="none" stroke-linecap="round"/>');
/* a red maple leaf, Canada's symbol, at centre ice: the goal of the coding puzzles */
const MAPLE_ART = B64('<path transform="translate(32 33) scale(2.050)" d="' + MAPLE_D + '" fill="#E5484D" stroke="#B3262B" stroke-width=".55" stroke-linejoin="round"/><path d="M32 42v12" stroke="#B3262B" stroke-width="2.400" stroke-linecap="round"/>');
/* an inukshuk: a figure of piled stones built by the Inuit to mark a way across the open land */
const INUKSHUK_ART = B64('<ellipse cx="32" cy="59" rx="20" ry="3" fill="rgba(27,42,78,.14)"/><g fill="#A9B1BE" stroke="#5A678A" stroke-width="1.600" stroke-linejoin="round"><path d="M18 57l2-14h8l1 14zM35 57l1-14h8l2 14z"/><path d="M12 43l2-7h36l2 7z"/><path d="M22 36l1-9h18l1 9z"/><path d="M8 27l3-6h42l3 6z"/><path d="M25 21l2-9h10l2 9z"/></g>');
/* a mug of hot chocolate, for after skating */
const COCOA_ART = B64('<path d="M24 14q-4 4 0 8t0 8M32 12q-4 4 0 8t0 8M40 14q-4 4 0 8t0 8" stroke="#C9CEDA" stroke-width="2.400" fill="none" stroke-linecap="round"/><path d="M14 34h32l-3 20q-1 5-6 5H23q-5 0-6-5z" fill="#E5484D"/><path d="M46 38q10 0 9 8-1 7-10 6" stroke="#E5484D" stroke-width="4.500" fill="none"/>' +
  '<ellipse cx="30" cy="34" rx="16" ry="4" fill="#7A4A26"/><g fill="#fff"><rect x="22" y="30" width="6" height="5" rx="1.500"/><rect x="31" y="29" width="6" height="5" rx="1.500" transform="rotate(14 34 31)"/></g><path transform="translate(30 47) scale(.55)" d="' + MAPLE_D + '" fill="#fff"/>');
/* a tuque: the knitted winter hat, with a pompom */
const TOQUE_ART = B64('<path d="M12 44q0-30 20-30t20 30z" fill="#E5484D"/><path d="M18 26q14-6 28 0M14 35q18-6 36 0" stroke="#C0392B" stroke-width="2.400" fill="none"/><path d="M9 48q23-10 46 0v-8q-23-10-46 0z" fill="#fff" stroke="#DDE3EC" stroke-width="1.200"/><circle cx="32" cy="11" r="6.500" fill="#fff" stroke="#DDE3EC" stroke-width="1.200"/>');
/* the northern lights over a dark hill: a souvenir picture */
const AURORA_ART = B64('<rect x="4" y="6" width="56" height="52" rx="8" fill="#10264A"/><defs><linearGradient id="caag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5484D" stop-opacity=".0"/><stop offset=".3" stop-color="#FF7A8A" stop-opacity=".5"/><stop offset=".55" stop-color="#5BF2A3"/><stop offset="1" stop-color="#8B7BEA" stop-opacity=".4"/></linearGradient></defs>' +
  '<path d="M6 30q12-18 26-10t26-8v18q-12 8-26 2T6 42z" fill="url(#caag)"/><g fill="#fff"><circle cx="14" cy="13" r=".9"/><circle cx="48" cy="10" r="1"/><circle cx="30" cy="9" r=".7"/></g><path d="M4 50q14-10 28-4t28-2v6q0 8-8 8H12q-8 0-8-8z" fill="#2E4A3A"/>' +
  '<path d="M14 50l4-9 4 9zM44 50l4-10 4 10z" fill="#1F3A2C"/>');

/* ----- the scene behind the mission path: a winter night with the northern lights over the Rockies, pines, a log cabin, and a frozen lake with a skater in the middle ----- */
const caPine = (x, y, k, snow) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M-3 0h6v14h-6z" fill="#4A3020"/><path d="M0-78 22-40H12L30-14H-30L-12-40H-22z" fill="#1F5E46"/>' +
  (snow ? '<path d="M0-78 9-63Q3-60-1-64-5-58-9-63zM-14-42q8-3 16 1 8-4 13-1l-4-6H-12zM-24-17q14-4 26 1 12-5 22-1l-6-6h-40z" fill="#fff"/>' : '') + '</g>';
const CA_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="casky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D2140"/><stop offset=".45" stop-color="#1C4B76"/><stop offset=".72" stop-color="#5FA9C6"/><stop offset="1" stop-color="#CDEAF0"/></linearGradient>' +
  '<linearGradient id="caaur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A8A" stop-opacity="0"/><stop offset=".25" stop-color="#FF8FA3" stop-opacity=".35"/><stop offset=".5" stop-color="#5BF2A3" stop-opacity=".9"/><stop offset=".85" stop-color="#3FD98C" stop-opacity=".35"/><stop offset="1" stop-color="#8B7BEA" stop-opacity="0"/></linearGradient>' +
  '<filter id="cash" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#0D2140" flood-opacity=".18"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#casky)"/>' +
  '<g fill="#fff">' + [[60, 40], [140, 90], [230, 30], [330, 70], [420, 24], [520, 60], [610, 30], [700, 80], [790, 36], [880, 70], [960, 30], [180, 150], [760, 150], [470, 140], [40, 180], [930, 170]].map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.6 : 2.4) + '" opacity=".85"/>').join('') + '</g>' +
  '<path d="M-20 70Q160 10 330 90T640 60 1020 100V250Q840 200 640 240T330 230-20 260z" fill="url(#caaur)" opacity=".85"/><path d="M80 150Q280 100 470 170T880 140V230Q690 210 470 250T80 240z" fill="url(#caaur)" opacity=".6"/>' +
  '<path d="M-10 380 120 220 210 320 320 190 430 330 540 200 650 320 760 210 870 330 1010 240V420H-10z" fill="#8FB4CF"/>' +
  '<path d="M120 220 150 258 132 252 110 266 96 250zM320 190 352 232 330 226 306 242 290 228zM540 200 574 244 552 236 528 252 512 238zM760 210 792 250 770 244 748 258 734 244z" fill="#fff"/>' +
  '<path d="M-10 410Q150 340 330 390T680 370 1010 380V470H-10z" fill="#E6F2F8"/>' +
  '<g filter="url(#cash)">' + [[40, 420, .9], [90, 430, 1.1], [150, 415, .8], [820, 412, .85], [880, 425, 1.05], [950, 418, .9], [700, 410, .6], [300, 405, .55], [350, 410, .65]].map(t => caPine(t[0], t[1], t[2], true)).join('') + '</g>' +
  '<g filter="url(#cash)"><path d="M180 452v-56h104v56z" fill="#8A5A34"/><path d="M180 404h104M180 416h104M180 428h104M180 440h104" stroke="#6B4424" stroke-width="3"/><path d="M168 400l64-40 64 40z" fill="#fff" stroke="#C9DDF0" stroke-width="3"/>' +
  '<rect x="206" y="414" width="22" height="20" fill="#FFD23F" stroke="#6B4424" stroke-width="3"/><rect x="246" y="416" width="20" height="36" fill="#5A3A22"/><path d="M262 370v-26h14v34z" fill="#7E8798"/><g fill="#E3EAF2" opacity=".8"><circle cx="270" cy="330" r="9"/><circle cx="280" cy="312" r="7"/><circle cx="292" cy="298" r="5"/></g></g>' +
  '<ellipse cx="560" cy="478" rx="340" ry="62" fill="#CDEFFB" stroke="#9FD3EE" stroke-width="5"/><path d="M330 470q120-24 240-6t250-4M380 492q150 14 300-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<path d="M420 486q60-26 120-10t96 0" stroke="#9FD3EE" stroke-width="2" fill="none" stroke-dasharray="10 8"/>' +
  '<g transform="translate(520 404) scale(1.9)">' + SKATER_IN + '</g>' +
  '<path filter="url(#cash)" d="M0 520Q260 500 520 540T1000 520V600H0z" fill="#fff"/><path d="M0 560Q300 540 600 570T1000 556V600H0z" fill="#EAF4FB"/>' +
  '<g filter="url(#cash)">' + caPine(30, 600, 1.9, true) + caPine(110, 610, 1.4, true) + caPine(960, 600, 2, true) + caPine(890, 612, 1.3, true) + '</g></svg>';

/* ----- Canadian French. Edge and Android have Canadian French voices (fr-CA); without one a French voice is used, and without that the English voice sounds the word out.
   Six winter words, none of them sounding like an English word (Tony, 8 October: "use common words") ----- */
const CAF = (t, phon, inline) => ({ t, lang: 'fr-ca', fallback: phon, inline: !!inline });
const CAFRENCH = [
  { native: 'patin', rom: 'patin', en: 'skate', icon: 'ice-skate', phon: 'pah-tan' },
  { native: 'neige', rom: 'neige', en: 'snow', icon: 'snowflake', phon: 'nezh' },
  { native: 'hiver', rom: 'hiver', en: 'winter', icon: 'snowman-without-snow', phon: 'ee-vair' },
  { native: 'érable', rom: 'érable', en: 'maple tree', icon: 'maple-leaf', phon: 'ay-rabl' },
  { native: 'castor', rom: 'castor', en: 'beaver', icon: BEAVER_ART, phon: 'kas-tor' },
  { native: 'tuque', rom: 'tuque', en: 'woolly hat', icon: TOQUE_ART, phon: 'took' }
];
wordSkill('cafrench', 'Canadian French words', 'fr-ca', CAFRENCH);

/* ----- the race: she is the skater, racing a polar bear across the frozen lake ----- */
const CA_RACE = { act: 'race', me: SKATER_ART, rival: 'polar-bear', rivalName: 'polar bear', track: 10,
  intro: { text: 'You are the skater. Answer fast to beat the polar bear!', say: 'Race time on the frozen lake! You are the skater. The polar bear is fast on the ice too, and it never stops. Each right answer is one glide forward. Answer fast to reach the flag first!' },
  win: { text: 'You beat the polar bear to the flag!', say: 'You beat the polar bear to the flag! What a skater.' },
  lose: { text: 'The polar bear got there first this time.', say: 'The polar bear got there first this time. Quick answers will catch it.' } };
GRAPH_SETS.canada = { noun: 'winter things', one: 'winter thing', items: [{ name: 'skates', art: 'ice-skate' }, { name: 'snowmen', art: 'snowman-without-snow' }, { name: 'maple leaves', art: 'maple-leaf' }, { name: 'mittens', art: 'gloves' }, { name: 'pine trees', art: 'evergreen-tree' }] };
THING_NAMES['maple-leaf'] = 'maple leaves';

/* ----- the coding grid: a rink, the skater, snowbanks to steer round, and a maple leaf at centre ice ----- */
const RINK = { mover: SKATER_ART, goal: MAPLE_ART, goalName: 'maple leaf', flag: 'glowing-star', flagName: 'star', rock: SNOWBANK_ART, cls: 'rink' };

/* ----- the room colour: the northern lights, a red toque with a pompom, and snow falling ----- */
THEME_LOOK.aurora = { fx: 'snow', hat: '<path d="M12 37q0-26 18-26t18 26z" fill="#E5484D"/><path d="M10 39q20-9 40 0v-7q-20-9-40 0z" fill="#fff"/><path d="M16 22q14-6 28 0M14 29q16-6 32 0" stroke="#C0392B" stroke-width="2" fill="none"/><circle cx="30" cy="9" r="5.500" fill="#fff" stroke="#DDE3EC" stroke-width="1"/>' };

/* ----- the ear, for the body atlas: a cut through the right ear, seen from the front. The outer ear on the left, the middle ear with its three tiny bones, and the inner ear in the skull bone on the right.
   Each part has a point on it (x, y) and a place for its name (lx, ly) in the rows above and below the picture. lv: which round first names it ----- */
const EAR = [
  { id: 'pinna', label: 'Pinna', lv: 1, x: 9, y: 50, w: 11, lx: 9, ly: 6, fact: { text: 'The pinna is the part you can see. It funnels sound in.' }, hint: { text: 'The pinna is the outer flap on the side of your head.' } },
  { id: 'canal', label: 'Ear canal', lv: 1, x: 25, y: 49, w: 9, lx: 12, ly: 94, fact: { text: 'The ear canal is a tube about 2.5 centimetres long.' }, hint: { text: 'The ear canal is the tube leading in from outside.' } },
  { id: 'eardrum', label: 'Eardrum', lv: 1, x: 35.4, y: 49, w: 5.5, lx: 30, ly: 94, fact: { text: 'Sound makes the eardrum shake, like the skin of a drum.' }, hint: { text: 'The eardrum is a thin skin across the end of the tube.' } },
  { id: 'malleus', label: 'Malleus', lv: 2, x: 39.6, y: 41.5, w: 5.5, lx: 27, ly: 6, fact: { text: 'The malleus, or hammer, is joined to the eardrum.' }, hint: { text: 'The malleus is the first tiny bone, touching the eardrum.' } },
  { id: 'incus', label: 'Incus', lv: 2, x: 45.2, y: 39.5, w: 5.5, lx: 42, ly: 6, fact: { text: 'The incus, or anvil, passes the shaking along.' }, hint: { text: 'The incus is the middle one of the three tiny bones.' } },
  { id: 'stapes', label: 'Stapes', lv: 2, x: 51, y: 47, w: 5.5, lx: 56, ly: 6, fact: { text: 'The stapes, or stirrup, is the smallest bone in your body.' }, hint: { text: 'The stapes is the last tiny bone, shaped like a stirrup.' } },
  { id: 'canals', label: 'Semicircular canals', lv: 1, x: 65, y: 29, w: 10, lx: 82, ly: 6, fact: { text: 'Three loops of fluid. They feel your head turning.' }, hint: { text: 'The semicircular canals are the three loops at the top.' } },
  { id: 'cochlea', label: 'Cochlea', lv: 1, x: 66.5, y: 60.5, w: 9, lx: 76, ly: 94, fact: { text: 'The cochlea is a snail shell of fluid. It hears sounds.' }, hint: { text: 'The cochlea is coiled up like a snail shell.' } },
  { id: 'eustachian', label: 'Eustachian tube', lv: 3, x: 40, y: 72, w: 8, lx: 52, ly: 94, fact: { text: 'This tube joins your ear to your throat. It makes ears pop.' }, hint: { text: 'The Eustachian tube runs down, towards your throat.' } },
  { id: 'nerve', label: 'Auditory nerve', lv: 3, x: 87, y: 48.5, w: 9, lx: 87, ly: 72, fact: { text: 'The auditory nerve carries the signals to your brain.' }, hint: { text: 'The auditory nerve leads away, towards the brain.' } }
];
/* lines: the parts that get a line out to a name place; names: the parts whose names are already printed there */
function earSvg(lines, names) {
  const tube = (d, out, inn, w) => '<path d="' + d + '" fill="none" stroke="' + out + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="' + inn + '" stroke-width="' + (w * .48) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const BONE = '#FFF2CC', BK = '#8A6A3A';
  let s = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="5" fill="#E3EEF9"/>';
  s += '<path d="M15 16H96V86H15Q19 70 19 50T15 16z" fill="#F7DCCB"/><path d="M52 18H95V84H55Q50 70 52 52T52 18z" fill="#EFE3C8" stroke="#D8C6A2" stroke-width=".6"/>';      /* the side of the head, and the skull bone round the inner ear */
  s += '<path d="M18 21Q2 19 3 42Q4 66 15 80Q19 85 21.500 79Q15.500 66 15.500 51Q15.500 35 20 29z" fill="#F2B9A0" stroke="#B9735C" stroke-width=".7"/><path d="M14.500 31Q7 35 7.500 48Q8.500 61 14 69" stroke="#D98E76" stroke-width="1" fill="none" stroke-linecap="round"/>';   /* the pinna */
  s += '<path d="M17 44.600Q26 43 35 44.300V53.700Q26 55 17 53.400z" fill="#FFF3EC" stroke="#C98A74" stroke-width=".7"/>';                                                    /* the ear canal */
  s += '<path d="M36 37.500Q46 32.500 55.500 38.500V58.500Q46 63.500 36 58.500z" fill="#FFF9F3" stroke="#C98A74" stroke-width=".6"/>';                                         /* the middle ear: a space full of air */
  s += tube('M43.500 60Q42 74 33 89', '#E3A893', '#FFF3EC', 3.400);                                                                                                       /* the Eustachian tube, down to the throat */
  s += '<ellipse cx="35.400" cy="49" rx="1.200" ry="5.800" fill="#F7C0AE" stroke="#B5654F" stroke-width=".7"/>';                                                          /* the eardrum */
  s += tube('M36.600 52.500 38.800 43.500', BK, BONE, 2.200) + '<ellipse cx="40" cy="40.600" rx="2.600" ry="3" fill="' + BONE + '" stroke="' + BK + '" stroke-width=".6"/>';   /* malleus */
  s += tube('M46 41.500 47 46.600', BK, BONE, 1.800) + '<ellipse cx="45.200" cy="39.400" rx="2.900" ry="2.300" fill="' + BONE + '" stroke="' + BK + '" stroke-width=".6"/>'; /* incus */
  s += '<path d="M48 47.200 53.600 44.400M48 47.200 53.600 50" stroke="' + BK + '" stroke-width="1.300" stroke-linecap="round"/><circle cx="48" cy="47.200" r="1.300" fill="' + BONE + '" stroke="' + BK + '" stroke-width=".55"/><path d="M53.900 43.800V50.600" stroke="' + BK + '" stroke-width="1.700" stroke-linecap="round"/>';   /* stapes, on the oval window */
  s += '<ellipse cx="59" cy="47.500" rx="4.200" ry="5.200" fill="#CDEAF7" stroke="#2F86C8" stroke-width=".8"/>';                                                            /* the vestibule */
  s += tube('M57.300 43C52 32 58 21.500 64.500 25.500C69.500 28.500 66 37 61.200 42.600', '#2F86C8', '#BFE6FA', 2.800) + tube('M61.600 43.400C66 31.500 78 30 78 39.200C78 46 70 47.200 63.200 46.800', '#2F86C8', '#BFE6FA', 2.800) +
    tube('M60.200 44C63 37.800 69.500 36.500 71 40C72 43 67.500 44.800 62.800 45', '#2F86C8', '#BFE6FA', 2.400);                                                       /* the three semicircular canals */
  s += tube('M60 52C62 57 70.500 54.500 71.500 59.500C72.600 65.600 64.200 67.400 62.600 62.400C61.400 58.400 67.400 57.200 67.800 60.700C68 62.700 65.600 63.200 65.100 61.700', '#9B5FC0', '#EAD3F8', 2.800);   /* the cochlea */
  s += tube('M63 50.500C70 50 77 49.600 84 48.800L97 48.200', '#C98A12', '#FFD95E', 2.600) + tube('M70.500 57C76 55 79 51.500 84 49', '#C98A12', '#FFD95E', 1.800);           /* the auditory nerve, to the brain */
  s += '<text x="95.500" y="54" font-size="3" font-family="Fredoka,sans-serif" fill="#8A93A8" text-anchor="end">to the brain</text>';
  EAR.forEach(p => { if (!lines.includes(p.id)) return; const top = p.ly < 50, side = p.ly > 20 && p.ly < 80, ex = side ? p.lx : p.lx, ey = side ? p.ly - 2.800 : top ? p.ly + 2.800 : p.ly - 2.800;
    s += '<path d="M' + ex + ' ' + ey + 'L' + p.x + ' ' + p.y + '" stroke="#8B7BEA" stroke-width=".5" stroke-linecap="round"/><circle cx="' + p.x + '" cy="' + p.y + '" r="1.050" fill="#8B7BEA" stroke="#fff" stroke-width=".3"/>';
    if (names.includes(p.id)) { const w = p.label.length * 1.6 + 2.6; s += '<rect x="' + (p.lx - w / 2) + '" y="' + (p.ly - 2.600) + '" width="' + w + '" height="5.200" rx="2.200" fill="#fff" stroke="#34C17B" stroke-width=".5"/><text x="' + p.lx + '" y="' + (p.ly + 1.250) + '" font-size="3" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + p.label + '</text>'; } });
  return s + '</svg>';
}
const earUpTo = lv => EAR.filter(p => p.lv <= lv).map(p => p.id);
const earPlace = (lv, text, say, done) => ({ act: 'place', tags: true, cls: 'smalltags', text, say, board: earSvg(earUpTo(lv), earUpTo(lv - 1)), items: EAR.filter(p => p.lv === lv).map(p => ({ id: p.id, label: p.label, x: p.lx, y: p.ly, w: 10, fact: p.fact, hint: p.hint })), done });
ATLAS.ear = { name: 'The ear', icon: 'ear', cid: 'canada', need: 'canada.m2', board: earSvg(EAR.map(p => p.id), []), parts: EAR };

/* ----- what she learns in the labs, asked afterwards ----- */
bankSkill('spin', 'Skating science', 'science', [
  { pic: SKATER_ART, why: 'Arms in, she spins faster. Arms out, she slows down.',
    ask: [{ t: 'A spinning skater pulls her arms in. Her spin…', h: 'Her spin is the same amount, packed closer to the middle. Closer in goes round quicker.', o: [O('Speeds up', 'fast-forward-button'), O('Slows down', 'snail'), O('Stops', 'stop-sign')] },
      { t: 'To slow her spin down, a skater…', h: 'Spreading out makes the spin go round more slowly.', o: [O('Opens her arms', 'open-hands'), O('Pulls her arms in', 'fast-forward-button'), O('Shuts her eyes', 'sleeping-face')] }] },
  { pic: 'stopwatch', why: 'The fastest spin on skates: 342 turns a minute.',
    ask: [{ t: 'The fastest spin on skates was by a skater from…', h: 'Olivia Oliver set the record in 2015. She comes from the country you are visiting.', o: [O('Canada', 'maple-leaf'), O('Brazil', 'soccer-ball'), O('Egypt', 'camel')] },
      { t: 'The record spin was 342 turns in…', h: 'That is nearly six turns every second.', o: [O('One minute', 'timer-clock'), O('One hour', 'hourglass-done'), O('One day', 'sun')] }] },
  { pic: 'ice-skate', why: 'People have skated for more than 4,000 years.',
    ask: [{ t: 'The first skates, thousands of years ago, were made of…', h: 'Long before steel, people tied animal bones under their boots.', o: [O('Animal bone', 'bone'), O('Plastic', 'bottle-with-popping-cork'), O('Glass', 'mirror')] },
      { t: 'People have been skating for more than…', h: 'Skating began in Finland, on long winter journeys, in the Bronze Age or before.', o: [O('4,000 years', 'hourglass-done'), O('40 years', 'calendar'), O('4 days', 'sun')] }] },
  { pic: 'cyclone', why: 'Spinning on a chair works the same way as a skater.',
    ask: [{ t: 'Spinning on a chair, you pull your legs in. You spin…', h: 'It is the skater’s trick again: closer to the middle, quicker round.', o: [O('Faster', 'fast-forward-button'), O('Slower', 'snail'), O('Backwards', 'left-arrow')] },
      { t: 'A diver curls into a ball in the air. She turns…', h: 'Divers and gymnasts use the skater’s trick too. Curled up tight is packed close to the middle.', o: [O('Faster', 'fast-forward-button'), O('Slower', 'snail'), O('Not at all', 'stop-sign')] }] }
], 'canada');

bankSkill('balance', 'Ears and balance', 'science', [
  { pic: 'ear', why: 'Three loops of fluid in each ear feel your head turn.',
    ask: [{ t: 'Which part of your ear feels you turning?', h: 'They are three loops of fluid, deep inside, at right angles to each other.', o: [O('Semicircular canals', 'cyclone'), O('Eardrum', 'drum'), O('Pinna', 'ear')] },
      { t: 'How many semicircular canals are in each ear?', h: 'One for nodding, one for shaking your head, one for tipping to your shoulder.', o: [O('Three', 'keycap-3'), O('One', 'keycap-1'), O('Ten', 'keycap-10')] }] },
  { pic: 'cyclone', why: 'After a spin, the fluid keeps swirling. That is dizziness.',
    ask: [{ t: 'After a spin, the room seems to keep turning because…', h: 'The fluid in your ear goes on moving when you stop, like water in a stirred cup.', o: [O('The fluid keeps swirling', 'droplet'), O('The room really moves', 'house'), O('Her skates are wet', 'ice-skate')] },
      { t: 'In a long, steady spin, the turning feeling…', h: 'The fluid catches up with the loop, so the tiny hairs stand straight again.', o: [O('Fades away', 'cloud'), O('Gets stronger', 'up-arrow'), O('Never starts', 'cross-mark')] }] },
  { pic: SKATER_ART, why: 'Skaters practise, and look at one spot as they stop.',
    ask: [{ t: 'How do skaters get less dizzy?', h: 'Their brains get used to it, a turn or two at a time. A few days off and it comes back.', o: [O('Lots of practice', 'repeat-button'), O('Eating ice', 'ice'), O('Spinning faster', 'fast-forward-button')] },
      { t: 'As she stops spinning, a skater looks at…', h: 'Her eyes tell her brain the truth: the room is still.', o: [O('One fixed spot', 'bullseye'), O('Her skates', 'ice-skate'), O('Nothing at all', 'sleeping-face')] }] },
  { pic: 'drum', why: 'Sound shakes the eardrum, then three tiny bones.',
    ask: [{ t: 'Sound makes your eardrum…', h: 'Sound is a vibration in the air. It reaches the thin skin at the end of your ear canal.', o: [O('Shake', 'vibration-mode'), O('Melt', 'droplet'), O('Glow', 'light-bulb')] },
      { t: 'The snail-shaped cochlea helps you…', h: 'It is filled with fluid and tiny hairs that turn sound into signals.', o: [O('Hear', 'ear'), O('Taste', 'tongue'), O('See', 'eye')] }] },
  { pic: 'airplane', why: 'The Eustachian tube lets air in and out: your ears pop.',
    ask: [{ t: 'Your ears pop in an aeroplane because of the…', h: 'It is a tube from the middle ear down to your throat, that lets air through.', o: [O('Eustachian tube', 'yawning-face'), O('Cochlea', 'spiral-shell'), O('Pinna', 'ear')] },
      { t: 'The Eustachian tube joins your ear to your…', h: 'Swallowing or yawning opens it. That is why it helps to chew on a plane.', o: [O('Throat', 'tongue'), O('Brain', 'brain'), O('Nose tip', 'nose')] }] }
], 'canada');

bankSkill('aurora', 'The northern lights', 'science', [
  { pic: 'sparkles', why: 'The northern lights begin with particles from the Sun.',
    ask: [{ t: 'The northern lights begin with tiny particles from…', h: 'A stream of them blows out into space all the time. It is called the solar wind.', o: [O('The Sun', 'sun'), O('The Moon', 'crescent-moon'), O('The snow', 'snowflake')] },
      { t: 'The stream of particles from the Sun is called…', h: 'It blows out from the Sun all the time, like a wind.', o: [O('The solar wind', 'wind-face'), O('Moonlight', 'crescent-moon'), O('Snowfall', 'snowflake')] }] },
  { pic: 'globe-showing-americas', why: 'Earth’s magnetism steers the particles to the poles.',
    ask: [{ t: 'Why are the lights near the North and South Poles?', h: 'Earth is a giant magnet. Its magnetism guides the particles in near the poles.', o: [O('Earth’s magnetism steers them', 'magnet'), O('It is colder there', 'snowflake'), O('There is more snow', 'snowman-without-snow')] },
      { t: 'Lights near the South Pole are called…', h: 'The northern lights are the aurora borealis. The southern ones have a matching name.', o: [O('Aurora australis', 'globe-showing-asia-australia'), O('Moon lights', 'crescent-moon'), O('Ice lights', 'ice')] }] },
  { pic: AURORA_ART, why: 'Oxygen glows green. Nitrogen glows purple and blue.',
    ask: [{ t: 'Green northern lights are glowing atoms of…', h: 'You breathe it in every second. It is element number 8.', o: [O('Oxygen', 'wind-face'), O('Gold', 'coin'), O('Helium', 'balloon')] },
      { t: 'The purple edge at the bottom is glowing…', h: 'Most of the air is this gas. It is element number 7.', o: [O('Nitrogen', 'wind-face'), O('Iron', 'nut-and-bolt'), O('Neon', 'red-circle')] }] },
  { pic: 'glowing-star', why: 'A hit atom gives the energy back out as light.',
    ask: [{ t: 'An atom hit by a particle gives the energy back as…', h: 'An electron is bumped up, then drops back, and lets out a flash.', o: [O('Light', 'light-bulb'), O('Snow', 'snowflake'), O('Sound', 'speaker-high-volume')] },
      { t: 'Most northern lights are about how high up?', h: 'Far above the clouds and the aeroplanes, but far below the Moon.', o: [O('100 kilometres', 'rocket'), O('1 kilometre', 'house'), O('At the Moon', 'crescent-moon')] }] }
], 'canada');

bankSkill('glide', 'Ice and friction', 'science', [
  { pic: 'ice', why: 'Friction slows sliding things. Ice has very little.',
    ask: [{ t: 'The rubbing force that slows a sliding thing is…', h: 'Rough surfaces catch on each other. Smooth, slippery ones hardly do.', o: [O('Friction', 'raised-hand'), O('Gravity', 'red-apple'), O('Magnetism', 'magnet')] },
      { t: 'The same push slides a puck farthest on…', pic: 'ice-hockey', h: 'Which surface has the least rubbing?', o: [O('Ice', 'ice'), O('Carpet', 'roll-of-paper'), O('A footpath', 'construction')] }] },
  { pic: 'droplet', why: 'Ice has a loose, watery skin on top. It is slippery.',
    ask: [{ t: 'Ice is slippery because its top layer is…', h: 'The molecules on the very top are loose, and move almost like water.', o: [O('Almost like water', 'water-wave'), O('Very sticky', 'honey-pot'), O('Made of sand', 'desert')] },
      { t: 'Can a skater’s weight alone melt the ice?', h: 'Scientists worked it out: you would need to weigh thousands of kilograms.', o: [O('No: far too light', 'feather'), O('Yes, easily', 'check-mark-button'), O('Only if she jumps', 'up-arrow')] }] },
  { pic: 'magnifying-glass-tilted-left', why: 'Scientists still argue about why ice is so slippery.',
    ask: [{ t: 'Do scientists agree on exactly why ice is slippery?', h: 'They agree a watery layer does it. They still argue about why it forms.', o: [O('No, still arguing', 'thinking-face'), O('Yes, long ago', 'books'), O('Nobody has ever asked', 'zipper-mouth-face')] },
      { t: 'A blade glides on ice. A rubber boot…', h: 'Rubber on ice still has more friction than a steel blade.', o: [O('Slides much less', 'snail'), O('Slides much more', 'fast-forward-button'), O('Floats', 'balloon')] }] }
], 'canada');

bankSkill('canada', 'Canada', 'world', [
  { pic: 'maple-leaf', why: 'Canada is the second-biggest country in the world.',
    ask: [{ t: 'How big is Canada, compared with other countries?', h: 'Only Russia is bigger.', o: [O('Second biggest', 'trophy'), O('The smallest', 'ant'), O('The tenth', 'keycap-10')] },
      { t: 'Which country has the longest coastline in the world?', pic: 'water-wave', h: 'It has thousands of islands up in the Arctic, each with its own shore.', o: [O('Canada', 'maple-leaf'), O('Egypt', 'camel'), O('Greece', 'classical-building')] }] },
  { pic: 'speaking-head', why: 'Canada has two official languages: English and French.',
    ask: [{ t: 'Canada’s two official languages are English and…', h: 'In Quebec, most people speak it at home. You heard some on the rink.', o: [O('French', 'baguette-bread'), O('Japanese', 'sushi'), O('Greek', 'classical-building')] },
      { t: 'In Canadian French, “patin” means…', s: ['In Canadian French,', CAF('patin', 'pah-tan', true), 'means?'], h: 'You wear them on the ice.', o: [O('Skate', 'ice-skate'), O('Snow', 'snowflake'), O('Bear', 'polar-bear')] }] },
  { pic: 'hospital', why: 'Insulin was found in Toronto, in 1921. It saves lives.',
    ask: [{ t: 'In 1922, Canadian doctors first saved a boy with…', h: 'Frederick Banting and Charles Best found it in Toronto. It helps the body use sugar.', o: [O('Insulin', 'syringe'), O('Chocolate', 'chocolate-bar'), O('Snow', 'snowflake')] },
      { t: 'Insulin helps your body to use…', h: 'Without it, sugar from food builds up in the blood. That illness is called diabetes.', o: [O('Sugar', 'candy'), O('Air', 'wind-face'), O('Light', 'light-bulb')] }] },
  { pic: 'thermometer', why: 'A warm winter means thin ice, and no skating.',
    ask: [{ t: 'A skating canal needs thick ice. A warm winter means…', h: 'In the winter of 2022 to 2023, Ottawa’s canal did not open even once.', o: [O('No skating', 'cross-mark'), O('More skating', 'ice-skate'), O('Faster skates', 'fast-forward-button')] },
      { t: 'Canada makes most of the world’s…', h: 'It is boiled down from the sap of a tree on Canada’s flag.', o: [O('Maple syrup', 'maple-leaf'), O('Rice', 'cooked-rice'), O('Olive oil', 'olive')] }] }
], 'canada');

/* ----- the spin lab: a skater spins with her arms out, pulls them in, then lifts them up, and opens them again.
   Her spin is the same amount all the time (angular momentum is conserved): packed closer to the middle, it goes round faster.
   The circle shows her from above, so the reach of her hands can be seen. About 2 and 4 turns a second are round numbers for an upright spin;
   nearly 6 is the record: Olivia Oliver, 342 turns a minute (5.7 a second). ----- */
/* a figure skater seen from the front, standing at x = 150, her blades at y = 238. Shared by the spin lab and the dizzy lab, which style her classes (sk-) the same way */
const SK_SKIN = '#F3C7A5', SK_DRESS = '#19A7B8', SK_HAIR = '#6B4424';
const SKATER_FRONT = (() => {
  const SK = SK_SKIN, DR = SK_DRESS, DR2 = '#13808D', HAIR = SK_HAIR;
  const arms = (cls, d) => '<g class="sk-arm ' + cls + '"><path d="' + d + '" fill="none" stroke="' + SK + '" stroke-width="5.500" stroke-linecap="round" stroke-linejoin="round"/></g>';
  /* the skater, seen from the front. Her body looks much the same from every side, so when she spins only her arms sweep round (.sk-turn squeezes and flips about her middle),
     her face slides round out of sight and the back of her head comes round, and her skirt flares out */
  return '<ellipse cx="150" cy="238" rx="30" ry="5.500" fill="rgba(27,42,78,.14)"/><ellipse class="sk-trace" cx="150" cy="238" rx="40" ry="8" fill="none" stroke="#fff" stroke-width="2.500" stroke-dasharray="6 7"/>' +
    '<g class="sk-blur" fill="none" stroke="#fff" stroke-linecap="round"><path d="M100 150q50 22 100 0" stroke-width="3"/><path d="M106 186q44 18 88 0" stroke-width="2.500"/><path d="M112 120q38 14 76 0" stroke-width="2"/></g>' +
    '<g class="sk-body">' +
    '<path d="M145.500 178V226M154.500 178V226" stroke="' + SK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M139 222h12v9h-13zM149 222h12v9h-13z" fill="#fff" stroke="#3E4A5E" stroke-width="1.300" stroke-linejoin="round"/><path d="M136 235h15M149 235h15" stroke="#8C98AC" stroke-width="2.200" stroke-linecap="round"/>' +
    '<g class="sk-skirt"><path d="M137 176Q150 168 163 176L176 196Q150 205 124 196z" fill="' + DR + '"/><path d="M130 194q20 6 40 0" stroke="' + DR2 + '" stroke-width="1.600" fill="none"/></g>' +
    '<path d="M140 141Q150 135 160 141L163 180H137z" fill="' + DR + '"/><g fill="#FFD95E"><circle cx="146" cy="152" r="1.300"/><circle cx="154" cy="160" r="1.300"/><circle cx="148" cy="168" r="1.300"/></g>' +
    '<rect x="147" y="128" width="6" height="9" fill="' + SK + '"/>' +
    '<g class="sk-turn">' + arms('sk-out', 'M141 143Q120 144 101 147M159 143Q180 144 199 147') + arms('sk-in', 'M141 143Q136 156 144 162L156 157M159 143Q164 156 156 162L144 157') + arms('sk-up', 'M142 141Q130 118 147 89M158 141Q170 118 153 89') +
    '<g class="sk-hands" fill="' + SK + '"><circle class="sk-out" cx="100" cy="147" r="4"/><circle class="sk-out" cx="200" cy="147" r="4"/><circle class="sk-up" cx="150" cy="87" r="4.400"/></g></g>' +
    '<circle cx="150" cy="117" r="12.500" fill="#F6CBA8"/><g class="sk-back"><circle cx="150" cy="117" r="12.600" fill="' + HAIR + '"/><path d="M144 124q6 3 12 0" stroke="#4A2E18" stroke-width="1.200" fill="none"/></g>' +
    '<path d="M137.500 116Q137.500 103 150 103Q162.500 103 162.500 116Q156 109 150 110Q144 109 137.500 116z" fill="' + HAIR + '"/><g class="sk-face">' +
    '<circle cx="145" cy="118" r="1.500" fill="#1B2A4E"/><circle cx="155" cy="118" r="1.500" fill="#1B2A4E"/><path d="M146.500 123q3.500 2.500 7 0" stroke="#C0392B" stroke-width="1.300" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="141.500" cy="122" rx="2.400" ry="1.400" fill="#FF9E8E" opacity=".6"/><ellipse cx="158.500" cy="122" rx="2.400" ry="1.400" fill="#FF9E8E" opacity=".6"/></g><circle class="sk-bun" cx="150" cy="101" r="6" fill="' + HAIR + '"/></g>';
})();
const SPIN_LAB = (() => {
  const SK = SK_SKIN, DR = SK_DRESS, HAIR = SK_HAIR;
  const pine = (x, y, k) => '<path d="M' + x + ' ' + (y - 34 * k) + 'l' + (12 * k) + ' ' + (20 * k) + 'h' + (-5 * k) + 'l' + (9 * k) + ' ' + (14 * k) + 'h' + (-32 * k) + 'l' + (9 * k) + ' ' + (-14 * k) + 'h' + (-5 * k) + 'z" fill="#2F6E58"/>';
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A figure skater spinning on the ice, with a circle above showing her from above: as she pulls her arms in, she spins faster">' +
    '<defs><linearGradient id="sksky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD8F2"/><stop offset="1" stop-color="#E9F7FD"/></linearGradient>' +
    '<linearGradient id="skice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2F5FD"/><stop offset="1" stop-color="#B6E0F4"/></linearGradient>' +
    '<clipPath id="skclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="sklens"><circle cx="312" cy="98" r="54"/></clipPath></defs>' +
    '<g clip-path="url(#skclip)"><rect width="400" height="290" fill="url(#sksky)"/><g class="sk-cam">';
  /* far away: snowy hills and pines, then the ice */
  s += '<path d="M-10 150Q60 110 140 132T300 120 410 134V170H-10z" fill="#fff"/><g>' + [[20, 152, 1], [46, 150, 1.3], [74, 154, .9], [250, 150, 1.1], [282, 148, 1.4], [318, 152, 1], [366, 150, 1.2], [392, 152, .9]].map(p => pine(p[0], p[1], p[2])).join('') + '</g>';
  s += '<rect x="-10" y="150" width="420" height="150" fill="url(#skice)"/><path d="M-10 150H410" stroke="#fff" stroke-width="3"/>' +
    '<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M20 196q60-10 100 0M250 210q60-12 120 2M40 262q80 8 150-4"/></g>' +
    '<path class="sk-shine" d="M220 176l40-8M236 186l40-8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
  s += SKATER_FRONT;
  /* the circle: her, seen from above. Her hands sweep round a circle that shrinks as she pulls them in */
  const top = (cls, d, r) => '<g class="sk-top ' + cls + '"><circle cx="312" cy="98" r="' + r + '" fill="none" stroke="#7FB6D8" stroke-width="1.600" stroke-dasharray="4 4"/>' + d + '</g>';
  s += '<g class="sk-zoom"><path d="M162 108L262 58L262 138z" fill="#fff" opacity=".35"/><path d="M162 108L264 58M162 108L264 138" stroke="#fff" stroke-width="1.600" opacity=".9"/>' +
    '<g clip-path="url(#sklens)"><rect x="250" y="40" width="130" height="120" fill="#E6F6FD"/><g stroke="#fff" stroke-width="2" fill="none" opacity=".8"><path d="M262 140q40-20 100-6M270 62q30 10 84-4"/></g>' +
    '<g class="sk-rot">' +
    top('sk-out', '<path d="M276 98H348" stroke="' + SK + '" stroke-width="5" stroke-linecap="round"/><circle cx="274" cy="98" r="4.500" fill="' + SK + '"/><circle cx="350" cy="98" r="4.500" fill="' + SK + '"/>', 38) +
    top('sk-in', '<path d="M302 95Q302 106 312 106Q322 106 322 95" stroke="' + SK + '" stroke-width="5" fill="none" stroke-linecap="round"/>', 13) +
    top('sk-up', '<circle cx="312" cy="98" r="3.800" fill="' + SK + '"/>', 6) +
    '<ellipse cx="312" cy="98" rx="11" ry="7.500" fill="' + DR + '"/><circle cx="312" cy="98" r="6.500" fill="' + HAIR + '"/><circle cx="312" cy="98" r="2.600" fill="#4A2E18"/><path d="M318 93l7-3" stroke="#fff" stroke-width="1.600" stroke-linecap="round" opacity=".8"/></g></g>' +
    '<circle cx="312" cy="98" r="54" fill="none" stroke="#1B2A4E" stroke-width="3.500"/><circle cx="312" cy="98" r="57" fill="none" stroke="#fff" stroke-width="2.500"/>' +
    '<rect x="262" y="26" width="100" height="20" rx="10" fill="#1B2A4E" opacity=".85"/><text x="312" y="40" font-size="11.500" font-weight="700" text-anchor="middle" fill="#fff">seen from above</text></g>';
  s += '</g>';      /* end of the camera */
  /* on top, still: what she is doing, and how fast she turns */
  s += '<g class="sk-bar" font-weight="700"><rect x="8" y="261" width="384" height="24" rx="12" fill="#fff" opacity=".93"/><text class="sk-word" x="20" y="277.500" font-size="13" fill="#13808D"></text>' +
    '<text x="380" y="277.500" font-size="13" text-anchor="end" fill="#1B2A4E"><tspan class="sk-n" font-size="15">0</tspan> turns a second</text></g></g></svg>';
  return s;
})();
function spinSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab spinlab fill', 'data-s': 'start', html: SPIN_LAB })); }
async function spinSim(stage, ui) {
  spinSetup(stage); const g = $('.lab', stage), word = $('.sk-word', g), num = $('.sk-n', g);
  const T = (w, n) => () => { word.textContent = w; num.textContent = n; };
  ui.prompt('A figure skater on a frozen lake. Push off into a spin!', 'This skater is standing on the ice, with her arms out wide. Tap the button, and she will push off with the edge of her blade, into a spin.');
  await labStep(ui, g, 'Push off', 'spin', 'Arms out wide: about 2 turns a second.', 'She pushes off with her blade, and spins on the spot, with her arms out wide. The circle shows her from above. Her hands sweep round a big circle, far from the middle. She turns about two times every second.', T('arms out wide', '2'));
  await labStep(ui, g, 'Pull your arms in', 'in', 'Arms in: the same spin goes twice as fast!', 'Now she pulls her arms in, close to her body. Nobody pushed her again. But she spins faster: about four turns every second. Her spin is the same amount as before, but packed closer to the middle. Packed in closer, it goes round quicker. Scientists call this the conservation of angular momentum.', T('arms in close', '4'));
  await labStep(ui, g, 'Arms up high', 'up', 'Arms up, as thin as a pencil: nearly 6 a second!', 'Now her arms go up above her head, and she is as thin as a pencil. Even closer to the middle, so even faster: nearly six turns every second. In 2015, a Canadian skater called Olivia Oliver spun three hundred and forty two times in one minute. That is the world record.', T('arms up, thin as a pencil', 'nearly 6'));
  await labStep(ui, g, 'Open your arms', 'out', 'Arms out again: she slows down.', 'To finish, she opens her arms out wide again. Her spin spreads out, so it slows down, gently. Skaters steer how fast they spin just by moving their arms. Divers and gymnasts use the same trick, curling up tight to turn faster.', T('arms out: slower', '2'));
}
/* ----- the dizzy lab: inside one of her semicircular canals while she spins, keeps spinning, stops, and finds a spot to look at.
   The loop turns with her head; the fluid in it (endolymph) is slow to follow, so it lags and bends the cupula, a soft flap on hair cells: "turning!".
   In a steady spin the fluid catches up, the flap stands straight, and the feeling fades. When she stops, the fluid keeps going and bends the flap the other way: dizziness.
   Skaters practise to get used to it, and fix their eyes on one spot as they stop. The loop is drawn in her head's frame, so it stays still on the screen and the fluid moves inside it. ----- */
const DIZZY_LAB = (() => {
  const C = [272, 118], R = 60, f = n => (+n).toFixed(1);
  const pine = (x, y, k) => '<path d="M' + x + ' ' + (y - 34 * k) + 'l' + (12 * k) + ' ' + (20 * k) + 'h' + (-5 * k) + 'l' + (9 * k) + ' ' + (14 * k) + 'h' + (-32 * k) + 'l' + (9 * k) + ' ' + (-14 * k) + 'h' + (-5 * k) + 'z" fill="#2F6E58"/>';
  /* a curved arrow round the loop, showing which way the fluid moves inside it */
  const arc = (cls, a0, a1) => { const r = R + 25, p = a => [C[0] + r * Math.cos(a * Math.PI / 180), C[1] + r * Math.sin(a * Math.PI / 180)], s0 = p(a0), s1 = p(a1), sw = a1 > a0 ? 1 : 0, d = 'M' + f(s0[0]) + ' ' + f(s0[1]) + 'A' + r + ' ' + r + ' 0 0 ' + sw + ' ' + f(s1[0]) + ' ' + f(s1[1]);
    const t = (a1 + (a1 > a0 ? -14 : 14)), q = p(t), L = 12, ang = Math.atan2(s1[1] - q[1], s1[0] - q[0]), hd = 'M' + f(s1[0] - L * Math.cos(ang - .5)) + ' ' + f(s1[1] - L * Math.sin(ang - .5)) + 'L' + f(s1[0]) + ' ' + f(s1[1]) + 'L' + f(s1[0] - L * Math.cos(ang + .5)) + ' ' + f(s1[1] - L * Math.sin(ang + .5));
    return '<g class="dz-arrow ' + cls + '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '" stroke="#1B2A4E" stroke-width="7"/><path d="' + d + '" stroke="#FFC83D" stroke-width="4"/><path d="' + hd + '" stroke="#1B2A4E" stroke-width="7"/><path d="' + hd + '" stroke="#FFC83D" stroke-width="4"/></g>'; };
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A skater spinning, and one of the fluid-filled loops in her inner ear, close up: the fluid lags, catches up, and swirls on after she stops">' +
    '<defs><linearGradient id="dzsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD8F2"/><stop offset="1" stop-color="#E9F7FD"/></linearGradient>' +
    '<linearGradient id="dzice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2F5FD"/><stop offset="1" stop-color="#B6E0F4"/></linearGradient>' +
    '<radialGradient id="dzbone" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#FFF6E2"/><stop offset="1" stop-color="#EAD9B6"/></radialGradient>' +
    '<clipPath id="dzclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="dzlens"><circle cx="' + C[0] + '" cy="' + C[1] + '" r="104"/></clipPath></defs>' +
    '<g clip-path="url(#dzclip)"><rect width="400" height="290" fill="url(#dzsky)"/><g class="dz-cam">';
  s += '<path d="M-10 150Q60 112 150 130T410 126V170H-10z" fill="#fff"/>' + [[18, 152, 1.2], [44, 150, 1], [120, 152, 1.1], [150, 150, .9]].map(p => pine(p[0], p[1], p[2])).join('') +
    '<rect x="-10" y="150" width="420" height="150" fill="url(#dzice)"/><path d="M-10 150H410" stroke="#fff" stroke-width="3"/>' +
    '<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M14 200q50-8 90 0M30 262q70 8 130-4"/></g>';
  /* the spot she looks at as she stops: a red flag on the snow */
  s += '<g class="dz-spot"><path d="M14 150V118" stroke="#5A3A22" stroke-width="2.500" stroke-linecap="round"/><path d="M15 118l18 6-18 6z" fill="#E5484D"/><path class="dz-look" d="M74 118L34 126" stroke="#E5484D" stroke-width="2" stroke-dasharray="4 4" fill="none"/></g>';
  s += '<g transform="translate(-74 0)">' + SKATER_FRONT + '</g>';
  s += '<g class="dz-stars" fill="#FFC83D" stroke="#C98A12" stroke-width="1">' + [0, 120, 240].map(a => '<path style="--a:' + a + 'deg" d="M76 96l2.200 4.400 4.800.7-3.500 3.400.8 4.800-4.300-2.300-4.300 2.300.8-4.800-3.500-3.400 4.800-.7z"/>').join('') + '</g>';
  /* the close-up: one semicircular canal, in the bone of her skull, joined to her ear by a cone of light */
  s += '<g class="dz-zoom"><path d="M88 118L176 70L176 166z" fill="#fff" opacity=".35"/><path d="M88 118L178 68M88 118L178 168" stroke="#fff" stroke-width="1.600" opacity=".9"/>' +
    '<g clip-path="url(#dzlens)"><rect x="160" y="8" width="230" height="230" fill="url(#dzbone)"/>' +
    '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" fill="none" stroke="#2F86C8" stroke-width="24"/><circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" fill="none" stroke="#9AD7F5" stroke-width="17"/>' +
    '<ellipse cx="' + C[0] + '" cy="' + (C[1] + R + 4) + '" rx="26" ry="20" fill="#9AD7F5" stroke="#2F86C8" stroke-width="3.500"/>' +
    '<circle class="dz-flow" cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" fill="none" stroke="#fff" stroke-width="3.500" stroke-linecap="round" stroke-dasharray="7 15" opacity=".95"/>' +
    '<g class="dz-hairs" stroke="#C98A12" stroke-width="2" stroke-linecap="round">' + [-10, -5, 0, 5, 10].map(x => '<path d="M' + (C[0] + x) + ' ' + (C[1] + R + 21) + 'v-8"/>').join('') + '</g>' +
    '<path d="M' + (C[0] - 14) + ' ' + (C[1] + R + 22) + 'h28" stroke="#E9A416" stroke-width="5" stroke-linecap="round"/>' +
    '<g class="dz-cup"><path d="M' + (C[0] - 12) + ' ' + (C[1] + R + 15) + 'Q' + (C[0] - 13) + ' ' + (C[1] + R - 16) + ' ' + C[0] + ' ' + (C[1] + R - 22) + 'Q' + (C[0] + 13) + ' ' + (C[1] + R - 16) + ' ' + (C[0] + 12) + ' ' + (C[1] + R + 15) + 'z" fill="#FFF6D6" fill-opacity=".85" stroke="#C98A12" stroke-width="2"/>' +
    '<path d="M' + (C[0] - 4) + ' ' + (C[1] + R + 12) + 'q-2-14 3-26M' + (C[0] + 4) + ' ' + (C[1] + R + 12) + 'q2-14-2-26" stroke="#E9C77A" stroke-width="1.600" fill="none"/></g>' +
    '<text x="' + C[0] + '" y="' + (C[1] + 4) + '" font-size="12" font-weight="700" text-anchor="middle" fill="#8A6A3A">fluid</text><path d="M' + C[0] + ' ' + (C[1] + 10) + 'V' + (C[1] + 38) + '" stroke="#B9A47C" stroke-width="1.400" stroke-dasharray="2 3"/>' +
    arc('dz-lag', 60, -30) + arc('dz-on', 120, 210) + '</g>' +
    '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="104" fill="none" stroke="#1B2A4E" stroke-width="3.500"/><circle cx="' + C[0] + '" cy="' + C[1] + '" r="107" fill="none" stroke="#fff" stroke-width="2.500"/>' +
    '<rect x="196" y="4" width="152" height="20" rx="10" fill="#1B2A4E" opacity=".85"/><text x="272" y="18" font-size="11.500" font-weight="700" text-anchor="middle" fill="#fff">one loop inside her ear</text>' +
    '<rect x="218" y="216" width="108" height="18" rx="9" fill="#fff" opacity=".9"/><text x="272" y="229" font-size="10.500" font-weight="700" text-anchor="middle" fill="#8A6A3A">the flap, on tiny hairs</text></g>';
  s += '</g>';      /* end of the camera */
  /* on top, still: what her brain feels, in a thought bubble, and what she is really doing */
  s += '<g class="dz-think"><circle cx="72" cy="80" r="3" fill="#fff"/><circle cx="66" cy="70" r="4.500" fill="#fff"/><rect x="8" y="22" width="172" height="40" rx="20" fill="#fff" stroke="#8B7BEA" stroke-width="2.500"/>' +
    '<text class="dz-feel" x="94" y="47" font-size="13" font-weight="700" text-anchor="middle" fill="#4B3DB4">All still.</text></g>' +
    '<g class="dz-bar" font-weight="700"><rect x="8" y="261" width="384" height="24" rx="12" fill="#fff" opacity=".93"/><text class="dz-word" x="20" y="277.500" font-size="13" fill="#1E6FB0">a semicircular canal</text>' +
    '<text x="380" y="277.500" font-size="13" text-anchor="end" fill="#1B2A4E">she is <tspan class="dz-is">still</tspan></text></g></g></svg>';
  return s;
})();
function dizzySetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab dizzylab fill', 'data-s': 'start', html: DIZZY_LAB })); }
async function dizzySim(stage, ui) {
  dizzySetup(stage); const g = $('.lab', stage), word = $('.dz-word', g), feel = $('.dz-feel', g), is = $('.dz-is', g);
  const T = (w, f, i) => () => { word.textContent = w; feel.textContent = f; is.textContent = i; };
  ui.prompt('Inside her ear: a loop of fluid. Start her spinning!', 'Deep inside each ear, this skater has three loops full of fluid. They are called the semicircular canals. The circle shows one of them, close up. At the bottom is a soft flap, sitting on tiny hairs. Tap the button to start her spinning.');
  await labStep(ui, g, 'Start spinning', 'spin', 'The loop turns. The fluid lags behind and bends the flap.', 'She starts to spin. The loop in her ear turns with her head. But the fluid inside is slow to get moving, so it lags behind, and pushes the soft flap over. The tiny hairs bend, and send a message to her brain: I am turning!', T('the fluid lags behind', 'I’m turning!', 'spinning'));
  await labStep(ui, g, 'Keep spinning', 'keep', 'The fluid catches up. The flap stands straight. She feels still!', 'She keeps spinning, round and round, at the same speed. Now the fluid has caught up, and turns along with the loop. Nothing pushes the flap, so it stands up straight. Her brain gets no message, so it feels as if she has stopped. But she is still spinning!', T('the fluid catches up', 'I’ve stopped?', 'spinning'));
  await labStep(ui, g, 'Stop!', 'stop', 'She stops. The fluid swirls on. The room seems to spin!', 'She stops. But the fluid in the loop keeps on swirling, like water in a cup you have stirred. It pushes the flap over the other way. Her brain gets the message: I am turning the other way! But she is standing still. That mixed-up feeling is dizziness.', T('the fluid swirls on: dizzy!', 'Turning the other way!', 'still'));
  await labStep(ui, g, 'Look at one spot', 'spot', 'Her eyes hold one spot. The fluid settles. Still again!', 'Skaters have tricks. They practise, a turn or two at a time, so their brains get used to it. And as they stop, they fix their eyes on one spot, so their eyes can tell their brain the truth: the room is still. Soon the fluid settles, and the flap stands straight again.', T('her eyes help her brain', 'Still again. Phew!', 'still'));
}

/* ----- the aurora lab: the solar wind, Earth's magnetism steering it to the poles, the green curtains over Canada, one oxygen atom flashing green,
   and all the colours: red oxygen high up, green oxygen about 100 km up, purple nitrogen at the bottom edge. The dots are particles, not to scale. ----- */
const AURORA_LAB = (() => {
  const E = [292, 146], ER = 50, f = n => (+n).toFixed(1);
  const stars = [[20, 20], [60, 250], [110, 30], [150, 270], [200, 18], [230, 250], [360, 24], [380, 120], [340, 270], [250, 60], [160, 80], [372, 210], [214, 120]];
  /* particles from the Sun: in the solar wind they fly straight; with the magnetism on, each one is steered to the north or south pole */
  const parts = [[-56, -1], [-38, -1], [-22, -1], [-8, -1], [8, 1], [22, 1], [38, 1], [56, 1], [-46, -1], [30, 1], [-14, -1], [14, 1]].map((p, i) => '<circle class="au-p" style="--y:' + p[0] + 'px;--py:' + (p[1] * -(ER + 2) - p[0]) + 'px;--d:' + (i * .23).toFixed(2) + 's" cx="72" cy="' + E[1] + '" r="2.600"/>').join('');
  /* field lines: loops from pole to pole, either side of the Earth */
  const loop = (w) => 'M' + E[0] + ' ' + (E[1] - ER) + 'C' + (E[0] - w) + ' ' + (E[1] - ER - w * .55) + ' ' + (E[0] - w) + ' ' + (E[1] + ER + w * .55) + ' ' + E[0] + ' ' + (E[1] + ER) + 'M' + E[0] + ' ' + (E[1] - ER) + 'C' + (E[0] + w) + ' ' + (E[1] - ER - w * .55) + ' ' + (E[0] + w) + ' ' + (E[1] + ER + w * .55) + ' ' + E[0] + ' ' + (E[1] + ER);
  const L = [126, 110], LR = 96;
  /* a curtain of the aurora: a ribbon of vertical rays that ripples */
  const curtain = (cls, d, grad) => '<path class="' + cls + '" d="' + d + '" fill="url(#' + grad + ')"/>';
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Sun blows particles at the Earth; Earth’s magnetism steers them to the poles, where they make the air glow: green and red from oxygen, purple from nitrogen">' +
    '<defs><radialGradient id="ausun"><stop offset=".45" stop-color="#FFE98F"/><stop offset=".7" stop-color="#FFB23F" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A3D" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="auearth" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#5DB7F2"/><stop offset="1" stop-color="#2369B3"/></radialGradient>' +
    '<linearGradient id="ausky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081530"/><stop offset=".7" stop-color="#173F66"/><stop offset="1" stop-color="#2D5E7E"/></linearGradient>' +
    '<linearGradient id="augreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BF2A3" stop-opacity="0"/><stop offset=".55" stop-color="#5BF2A3" stop-opacity=".9"/><stop offset=".85" stop-color="#3FD98C" stop-opacity=".55"/><stop offset="1" stop-color="#3FD98C" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="aured" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A6E" stop-opacity="0"/><stop offset=".6" stop-color="#FF5A6E" stop-opacity=".75"/><stop offset="1" stop-color="#FF5A6E" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="aupurple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0"/><stop offset=".5" stop-color="#B07CFF" stop-opacity=".95"/><stop offset="1" stop-color="#B07CFF" stop-opacity="0"/></linearGradient>' +
    '<clipPath id="auclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="aulens"><circle cx="' + L[0] + '" cy="' + L[1] + '" r="' + LR + '"/></clipPath><clipPath id="auglobe"><circle cx="' + E[0] + '" cy="' + E[1] + '" r="' + ER + '"/></clipPath></defs>' +
    '<g clip-path="url(#auclip)"><rect width="400" height="290" fill="#0B1A36"/><g class="au-cam">';
  s += '<g fill="#fff">' + stars.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.1 : 1.7) + '" opacity=".8"/>').join('') + '</g>';
  /* the Sun, at the left edge, its corona pulsing */
  s += '<g class="au-sun"><circle cx="-6" cy="' + E[1] + '" r="96" fill="url(#ausun)" class="au-halo"/><circle cx="-6" cy="' + E[1] + '" r="62" fill="#FFD23F"/><circle cx="-6" cy="' + E[1] + '" r="62" fill="none" stroke="#FFB23F" stroke-width="4"/></g>';
  s += '<g class="au-wind" fill="#FFE98F">' + parts + '</g>';
  /* Earth's magnetism: field lines from pole to pole */
  s += '<g class="au-field" fill="none" stroke="#8B7BEA" stroke-width="1.800" stroke-dasharray="5 6">' + [80, 130, 190].map(w => '<path d="' + loop(w) + '"/>').join('') + '</g>';
  /* the Earth, with North America and the ice at the top, and a ring of light round each pole */
  s += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="' + (ER + 5) + '" fill="#5DB7F2" opacity=".25"/><circle cx="' + E[0] + '" cy="' + E[1] + '" r="' + ER + '" fill="url(#auearth)"/>' +
    '<g clip-path="url(#auglobe)"><path d="M250 112Q262 98 282 100Q298 104 300 116Q294 124 296 134Q288 142 278 146Q270 158 262 150Q256 138 248 132Q244 122 250 112z" fill="#57B26A"/><path d="M300 98q10-4 16 4-4 8-14 6z" fill="#E9F4FB"/>' +
    '<path d="M300 170q14-4 22 6-6 16-18 12-6-8-4-18z" fill="#57B26A"/><path d="M240 96Q292 84 344 96V80H240z" fill="#F2F8FC"/><path d="M240 196Q292 208 344 196V214H240z" fill="#F2F8FC"/></g>' +
    '<path d="M262 116l4 4" stroke="#E5484D" stroke-width="2.600" stroke-linecap="round"/><circle cx="262" cy="114" r="3" fill="#E5484D" stroke="#fff" stroke-width="1"/>' +
    '<g class="au-oval"><ellipse cx="' + E[0] + '" cy="' + (E[1] - ER + 6) + '" rx="22" ry="6" fill="none" stroke="#5BF2A3" stroke-width="4"/><ellipse cx="' + E[0] + '" cy="' + (E[1] + ER - 6) + '" rx="22" ry="6" fill="none" stroke="#5BF2A3" stroke-width="4"/></g>' +
    '<text class="au-lab" x="' + E[0] + '" y="' + (E[1] + ER + 22) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#BFD9EA">Earth</text><text class="au-lab" x="40" y="' + (E[1] + 84) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#FFE98F">the Sun</text>';
  /* the close-up, joined to Canada by a cone of light: the night sky over Canada, or one oxygen atom */
  s += '<g class="au-zoom"><path d="M262 114L' + (L[0] + 60) + ' ' + (L[1] - 84) + 'L' + (L[0] + 92) + ' ' + (L[1] + 44) + 'z" fill="#fff" opacity=".18"/>' +
    '<g clip-path="url(#aulens)"><rect x="' + (L[0] - LR) + '" y="0" width="' + (2 * LR) + '" height="230" fill="url(#ausky)"/><g fill="#fff">' + [[60, 30], [90, 18], [150, 26], [190, 44], [44, 60], [210, 80]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.200" opacity=".85"/>').join('') + '</g>' +
    '<g class="au-sky">' + curtain('au-red', 'M24 26Q80 4 130 22T236 16V70Q180 58 130 72T24 70z', 'aured') +
      '<g class="au-cur">' + curtain('au-green', 'M24 52Q80 30 130 52T236 46V136Q180 118 130 134T24 132z', 'augreen') +
      '<g class="au-rays" stroke="#C8FFE0" stroke-width="1.400" opacity=".45">' + [40, 58, 76, 94, 112, 130, 148, 166, 184, 202, 220].map((x, i) => '<path d="M' + x + ' ' + (60 + (i % 3) * 6) + 'v' + (56 - (i % 2) * 10) + '"/>').join('') + '</g></g>' +
      curtain('au-purple', 'M24 126Q80 108 130 124T236 118V140Q180 128 130 142T24 144z', 'aupurple') +
      '<path d="M20 176Q60 160 100 168T170 160 240 170V210H20z" fill="#1E3A2E"/>' + [[44, 176, .8], [62, 172, 1], [196, 170, .9], [214, 174, .7]].map(p => '<path d="M' + p[0] + ' ' + (p[1] - 30 * p[2]) + 'l' + (10 * p[2]) + ' ' + (18 * p[2]) + 'h' + (-4 * p[2]) + 'l' + (8 * p[2]) + ' ' + (12 * p[2]) + 'h' + (-28 * p[2]) + 'l' + (8 * p[2]) + ' ' + (-12 * p[2]) + 'h' + (-4 * p[2]) + 'z" fill="#12261C"/>').join('') +
      '<ellipse cx="128" cy="190" rx="60" ry="9" fill="#3E6D8C" opacity=".8"/><path class="au-refl" d="M86 190h84" stroke="#5BF2A3" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
      '<g class="au-tags" font-size="10.500" font-weight="700"><g class="au-tg"><rect x="118" y="76" width="74" height="17" rx="8.500" fill="#0B1A36" opacity=".75"/><text x="155" y="88" text-anchor="middle" fill="#7DF7B6">oxygen: green</text></g>' +
      '<g class="au-tr"><rect x="104" y="34" width="66" height="17" rx="8.500" fill="#0B1A36" opacity=".75"/><text x="137" y="46" text-anchor="middle" fill="#FF8A9A">oxygen: red</text></g>' +
      '<g class="au-tp"><rect x="50" y="140" width="84" height="17" rx="8.500" fill="#0B1A36" opacity=".75"/><text x="92" y="152" text-anchor="middle" fill="#C9A7FF">nitrogen: purple</text></g></g>' +
      '<g class="au-km"><path d="M46 96h14" stroke="#BFD9EA" stroke-width="1.500"/><text x="44" y="92" font-size="9.500" font-weight="700" fill="#BFD9EA">100 km up</text></g></g>';
  /* one oxygen atom, 8 protons: a particle bumps an electron up a level; when it drops back it sends out a flash of green light */
  const A = [L[0], L[1]];
  s += '<g class="au-atom"><rect x="' + (L[0] - LR) + '" y="0" width="' + (2 * LR) + '" height="230" fill="#0B1A36"/>' +
    '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="24" fill="none" stroke="#5A678A" stroke-width="1.600"/><circle cx="' + A[0] + '" cy="' + A[1] + '" r="48" fill="none" stroke="#5A678A" stroke-width="1.600"/>' +
    '<circle class="au-exc" cx="' + A[0] + '" cy="' + A[1] + '" r="72" fill="none" stroke="#8B7BEA" stroke-width="1.600" stroke-dasharray="5 6"/>' +
    '<g>' + [[-5, -4], [4, -5], [0, 1], [-6, 4], [6, 3], [-1, 8], [7, -1], [-8, -2]].map((p, i) => '<circle cx="' + (A[0] + p[0]) + '" cy="' + (A[1] + p[1]) + '" r="4.300" fill="' + (i % 2 ? '#E5484D' : '#C9CEDA') + '" stroke="#1B2A4E" stroke-width=".8"/>').join('') + '</g>' +
    '<text x="' + A[0] + '" y="' + (A[1] + 3.500) + '" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">O</text>' +
    [[0, -24], [0, 24]].map(p => '<circle cx="' + (A[0] + p[0]) + '" cy="' + (A[1] + p[1]) + '" r="4" fill="#3BA7F0" stroke="#fff" stroke-width="1"/>').join('') +
    [[48, 0], [-48, 0], [24, 41.600], [-24, 41.600], [-24, -41.600]].map(p => '<circle cx="' + f(A[0] + p[0]) + '" cy="' + f(A[1] + p[1]) + '" r="4" fill="#3BA7F0" stroke="#fff" stroke-width="1"/>').join('') +
    '<circle class="au-jump" cx="' + f(A[0] + 24) + '" cy="' + f(A[1] - 41.600) + '" r="4.600" fill="#3BA7F0" stroke="#fff" stroke-width="1.200"/>' +
    '<circle class="au-hit" cx="' + (A[0] - 96) + '" cy="' + (A[1] - 80) + '" r="3.600" fill="#FFE98F"/>' +
    '<path class="au-photon" d="M' + (A[0] + 30) + ' ' + (A[1] - 36) + 'q5-7 11 1t11 1 11 1 11 1" fill="none" stroke="#5BF2A3" stroke-width="3.200" stroke-linecap="round"/>' +
    '<g class="au-glow"><circle cx="' + (A[0] + 80) + '" cy="' + (A[1] - 32) + '" r="8" fill="#5BF2A3" opacity=".9"/><circle cx="' + (A[0] + 80) + '" cy="' + (A[1] - 32) + '" r="14" fill="#5BF2A3" opacity=".25"/></g>' +
    '<text x="' + A[0] + '" y="' + (A[1] + 70) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#BFD9EA">oxygen: 8 protons</text></g></g>' +
    '<circle cx="' + L[0] + '" cy="' + L[1] + '" r="' + LR + '" fill="none" stroke="#fff" stroke-width="3.500"/><rect x="' + (L[0] - 62) + '" y="' + (L[1] + LR - 8) + '" width="124" height="20" rx="10" fill="#fff" opacity=".92"/>' +
    '<text class="au-cap" x="' + L[0] + '" y="' + (L[1] + LR + 6) + '" font-size="11.500" font-weight="700" text-anchor="middle" fill="#1B2A4E">the sky over Canada</text></g>';
  s += '</g>';      /* end of the camera */
  s += '<g class="au-bar" font-weight="700"><rect x="8" y="261" width="384" height="24" rx="12" fill="#fff" opacity=".93"/><text class="au-word" x="20" y="277.500" font-size="13" fill="#1E6FB0"></text>' +
    '<text class="au-el" x="380" y="277.500" font-size="13" text-anchor="end" fill="#1B2A4E"></text></g></g></svg>';
  return s;
})();
function auroraSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab auroralab fill', 'data-s': 'start', html: AURORA_LAB })); }
async function auroraSim(stage, ui) {
  auroraSetup(stage); const g = $('.lab', stage), word = $('.au-word', g), el = $('.au-el', g), cap = $('.au-cap', g);
  const T = (w, e, c) => () => { word.textContent = w; el.textContent = e; if (c) cap.textContent = c; };
  ui.prompt('The Sun and the Earth, in space. Switch on the solar wind!', 'Out in space, here is the Sun, and here is the Earth. The red dot on the Earth is Canada. Tap the button to switch on the solar wind.');
  await labStep(ui, g, 'Switch on the solar wind', 'wind', 'Tiny particles stream out from the Sun, all the time.', 'The Sun is so hot that it blows a stream of tiny particles out into space, all the time, in every direction. It is called the solar wind. Some of it heads straight for the Earth.', T('the solar wind', ''));
  await labStep(ui, g, 'Switch on Earth’s magnet', 'field', 'Earth is a giant magnet. It steers them to the poles.', 'Deep inside, the Earth is a giant magnet. Its magnetism reaches far out into space, and it steers the particles round the Earth and down near the North and South Poles. That is why the lights glow in rings round the poles: over Canada in the north, and over the south of New Zealand too.', T('Earth’s magnetism', ''));
  await labStep(ui, g, 'Look up from Canada', 'sky', 'Over Canada, the sky glows green: the aurora borealis!', 'Here we are in northern Canada, on a winter night. High above, about a hundred kilometres up, the particles crash into the air, and the air glows in green curtains that ripple across the sky. These are the northern lights. Their Latin name is the aurora borealis.', T('the aurora borealis', 'about 100 km up', 'the sky over Canada'));
  await labStep(ui, g, 'Zoom into the air', 'atom', 'A particle bumps an oxygen atom. It flashes green light!', 'Now zoom in on the air, a hundred kilometres up. It is made of atoms. This is an atom of oxygen, element number 8, with 8 protons in the middle. A particle from the Sun bumps one of its electrons up, out of its place. When the electron drops back, it gives the energy out again, as a flash of green light. Billions of flashes make the curtain.', T('one oxygen atom', 'O: oxygen, element 8', 'one atom of the air'));
  await labStep(ui, g, 'See all the colours', 'colours', 'High up, oxygen glows red. Low down, nitrogen glows purple.', 'Higher up, where the air is thinnest, oxygen glows red instead. And at the bottom edge of the curtain, nitrogen glows purple and blue. Nitrogen is element number 7. So the colour tells you which element is glowing. Scientists use the same idea to find out what the stars are made of.', T('oxygen and nitrogen', 'N: nitrogen, element 7', 'the sky over Canada'));
}

/* ----- the glide lab: the same push for a rubber boot on a footpath, a wooden block on a wooden floor, and a skate on ice.
   Distances from d = v² ÷ (2 × friction × g), with a push of 3 m/s: rubber on concrete (friction about 0.65) 0.7 m; wood on wood (about 0.4) 1.1 m; steel on ice (about 0.03) 15 m.
   The camera follows the skate down the ice. Then a close-up of the ice: its top layer of molecules is loose, almost like water. Why that layer forms is still argued about. ----- */
const GLIDE_LAB = (() => {
  const PX = 120, X0 = 52, lanes = [{ y: 74, d: .7 }, { y: 150, d: 1.1 }, { y: 226, d: 15 }];
  const pine = (x, y, k) => '<path d="M' + x + ' ' + (y - 34 * k) + 'l' + (12 * k) + ' ' + (20 * k) + 'h' + (-5 * k) + 'l' + (9 * k) + ' ' + (14 * k) + 'h' + (-32 * k) + 'l' + (9 * k) + ' ' + (-14 * k) + 'h' + (-5 * k) + 'z" fill="#2F6E58"/>';
  /* the same spring plunger at the start of every lane */
  const plunger = (y, i) => '<g class="gl-pl gl-pl' + i + '"><rect x="4" y="' + (y - 22) + '" width="14" height="26" rx="3" fill="#5A678A"/><path class="gl-spring" d="M18 ' + (y - 9) + 'l4-6 4 12 4-12 4 12 4-12 4 6" fill="none" stroke="#8C98AC" stroke-width="2.400" stroke-linejoin="round"/>' +
    '<g class="gl-rod"><rect x="40" y="' + (y - 17) + '" width="6" height="16" rx="2" fill="#E5484D"/></g></g>';
  const mark = (y, m, big) => '<path d="M' + (X0 + m * PX) + ' ' + (y + 6) + 'v' + (big ? 10 : 6) + '" stroke="#1B2A4E" stroke-width="' + (big ? 2.200 : 1.400) + '" opacity=".55"/>' + (big ? '<text x="' + (X0 + m * PX) + '" y="' + (y + 28) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#1B2A4E" opacity=".75">' + m + ' m</text>' : '');
  const sign = (cls, x, y, t) => '<g class="gl-sign ' + cls + '"><rect x="' + (x - 26) + '" y="' + (y - 50) + '" width="52" height="22" rx="11" fill="#1B2A4E"/><text x="' + x + '" y="' + (y - 34.500) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">' + t + '</text><path d="M' + x + ' ' + (y - 28) + 'v8" stroke="#1B2A4E" stroke-width="2"/></g>';
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The same push for a boot on a footpath, a block on a wooden floor and a skate on ice: the skate glides more than twenty times as far">' +
    '<defs><linearGradient id="glsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6F7"/><stop offset="1" stop-color="#EAF7FD"/></linearGradient>' +
    '<linearGradient id="glice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2F5FD"/><stop offset="1" stop-color="#B6E0F4"/></linearGradient>' +
    '<pattern id="glwood" width="40" height="12" patternUnits="userSpaceOnUse"><rect width="40" height="12" fill="#D9A86A"/><path d="M0 11.500h40M24 0v12" stroke="#B9874E" stroke-width="1"/><path d="M4 5q8-2 14 0" stroke="#C99A5E" stroke-width=".8" fill="none"/></pattern>' +
    '<pattern id="glpath" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#B9C0CC"/><circle cx="6" cy="8" r="1.300" fill="#9AA3B2"/><circle cx="22" cy="20" r="1.600" fill="#A3ABB8"/><circle cx="14" cy="28" r="1" fill="#8E97A6"/><circle cx="28" cy="6" r="1" fill="#8E97A6"/></pattern>' +
    '<clipPath id="glclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="gllens"><circle cx="2014" cy="108" r="86"/></clipPath></defs>' +
    '<g clip-path="url(#glclip)"><rect width="400" height="290" fill="url(#glsky)"/><g class="gl-cam">';
  /* scenery all the way along, so the camera's journey can be seen: a snowbank and pines */
  s += '<rect x="-10" y="30" width="2420" height="270" fill="#F3FAFE"/><path d="M-10 30Q200 10 400 26T800 22 1200 28 1600 20 2000 26 2400 22V46H-10z" fill="#fff"/>' + Array.from({ length: 30 }, (_, i) => pine(10 + i * 82 + (i % 3) * 14, 34, .6 + (i % 4) * .12)).join('') +
    /* past the end of the two short lanes, snowbanks and small pines go by as the camera follows the skate */
    Array.from({ length: 12 }, (_, i) => { const x = 440 + i * 170 + (i % 2) * 30; return '<ellipse cx="' + x + '" cy="' + (i % 2 ? 150 : 104) + '" rx="46" ry="14" fill="#fff" stroke="#D6E9F5" stroke-width="2"/>' + pine(x + 10, i % 2 ? 150 : 104, .8); }).join('');
  /* the lanes: a footpath, a wooden floor, and a long ice lane */
  s += '<rect x="0" y="' + (lanes[0].y - 26) + '" width="380" height="34" fill="url(#glpath)"/><path d="M120 ' + (lanes[0].y - 20) + 'l10 8-4 10M250 ' + (lanes[0].y - 24) + 'l-8 12 6 8" stroke="#8E97A6" stroke-width="1.400" fill="none"/><rect x="378" y="' + (lanes[0].y - 30) + '" width="10" height="42" rx="3" fill="#8A5A34"/>';
  s += '<rect x="0" y="' + (lanes[1].y - 26) + '" width="380" height="34" fill="url(#glwood)"/><rect x="378" y="' + (lanes[1].y - 30) + '" width="10" height="42" rx="3" fill="#8A5A34"/>';
  s += '<rect x="0" y="' + (lanes[2].y - 28) + '" width="2400" height="38" rx="6" fill="url(#glice)" stroke="#8CC8E8" stroke-width="2.500"/><g fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round" opacity=".8">' +
    Array.from({ length: 12 }, (_, i) => '<path d="M' + (60 + i * 190) + ' ' + (lanes[2].y + (i % 2 ? 6 : -4)) + 'q40-6 80 0"/>').join('') + '</g>';
  [0, 1].forEach(i => { for (let m = 0; m <= 2.5; m += .5) s += mark(lanes[i].y, m, m % 1 === 0); });
  for (let m = 0; m <= 16; m++) s += mark(lanes[2].y + 6, m, m % 5 === 0 || m < 3);
  s += lanes.map((l, i) => plunger(l.y, i)).join('');
  /* what is pushed: a rubber boot, a wooden block, a skate */
  s += '<g class="gl-it gl-boot" style="--x:' + (lanes[0].d * PX) + 'px"><path d="M' + X0 + ' ' + (lanes[0].y + 4) + 'V' + (lanes[0].y - 30) + 'h16v20q8 2 12 10v4z" fill="#E5484D" stroke="#8E2A20" stroke-width="1.800" stroke-linejoin="round"/><path d="M' + (X0 - 1) + ' ' + (lanes[0].y + 4) + 'h30" stroke="#2B3445" stroke-width="3.500" stroke-linecap="round"/></g>';
  s += '<g class="gl-it gl-block" style="--x:' + (lanes[1].d * PX) + 'px"><rect x="' + X0 + '" y="' + (lanes[1].y - 22) + '" width="30" height="26" rx="3" fill="#C98A4E" stroke="#7A4A26" stroke-width="1.800"/><path d="M' + (X0 + 4) + ' ' + (lanes[1].y - 14) + 'q10-3 22 0M' + (X0 + 4) + ' ' + (lanes[1].y - 4) + 'q10 3 22 0" stroke="#A9743F" stroke-width="1.200" fill="none"/></g>';
  s += '<g class="gl-it gl-skate" style="--x:' + (lanes[2].d * PX) + 'px"><path d="M' + (X0 + 2) + ' ' + (lanes[2].y - 4) + 'V' + (lanes[2].y - 36) + 'h14v16q12 2 16 12v8z" fill="#fff" stroke="#3E4A5E" stroke-width="1.800" stroke-linejoin="round"/><path d="M' + (X0 + 6) + ' ' + (lanes[2].y - 30) + 'h8M' + (X0 + 6) + ' ' + (lanes[2].y - 24) + 'h8" stroke="#E5484D" stroke-width="1.600"/>' +
    '<path d="M' + (X0 + 4) + ' ' + (lanes[2].y - 4) + 'v4M' + (X0 + 28) + ' ' + (lanes[2].y - 4) + 'v4" stroke="#8C98AC" stroke-width="2.400"/><path d="M' + (X0 - 2) + ' ' + (lanes[2].y + 1) + 'H' + (X0 + 34) + 'q4 0 4-4" stroke="#8C98AC" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
    '<g class="gl-spray" fill="#fff">' + [[-6, -2], [-12, -6], [-10, 2]].map(p => '<circle cx="' + (X0 + p[0]) + '" cy="' + (lanes[2].y + p[1]) + '" r="2"/>').join('') + '</g></g>';
  s += sign('gl-s0', X0 + 15 + lanes[0].d * PX, lanes[0].y, '0.7 m') + sign('gl-s1', X0 + 15 + lanes[1].d * PX, lanes[1].y, '1.1 m') + sign('gl-s2', X0 + 18 + lanes[2].d * PX, lanes[2].y, '15 m');
  /* the close-up, at the end of the glide: the blade on the ice, molecule by molecule */
  const LC = [2014, 108], mol = (x, y, cls, d) => '<g class="' + cls + '" style="--d:' + d + 's"><circle cx="' + x + '" cy="' + y + '" r="5.500" fill="#E5484D"/><circle cx="' + (x - 5) + '" cy="' + (y + 4) + '" r="3" fill="#fff" stroke="#C9CEDA" stroke-width=".8"/><circle cx="' + (x + 5) + '" cy="' + (y + 4) + '" r="3" fill="#fff" stroke="#C9CEDA" stroke-width=".8"/></g>';
  let lat = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) lat += mol(LC[0] - 84 + c * 21 + (r % 2) * 10, LC[1] + 34 + r * 18, 'gl-m', 0);
  let top = ''; for (let c = 0; c < 9; c++) top += mol(LC[0] - 80 + c * 20 + (c % 2) * 4, LC[1] + 14 + (c % 3) * 3, 'gl-loose', (c * .17).toFixed(2));
  s += '<g class="gl-zoom"><path d="M' + (X0 + 18 + lanes[2].d * PX) + ' ' + (lanes[2].y + 2) + 'L' + (LC[0] - 70) + ' ' + (LC[1] + 50) + 'L' + (LC[0] + 70) + ' ' + (LC[1] + 50) + 'z" fill="#fff" opacity=".35"/>' +
    '<g clip-path="url(#gllens)"><rect x="' + (LC[0] - 90) + '" y="' + (LC[1] - 90) + '" width="180" height="180" fill="#DDF3FD"/><g class="gl-latt">' + lat + '</g>' +
    '<rect x="' + (LC[0] - 90) + '" y="' + (LC[1] + 6) + '" width="180" height="24" fill="#9AD7F5" opacity=".45"/>' + top +
    '<g class="gl-blade"><rect x="' + (LC[0] - 150) + '" y="' + (LC[1] - 22) + '" width="120" height="26" rx="4" fill="#A9B1BE" stroke="#5A678A" stroke-width="2"/><path d="M' + (LC[0] - 148) + ' ' + (LC[1] - 14) + 'h114" stroke="#E3E8F0" stroke-width="3"/></g></g>' +
    '<circle cx="' + LC[0] + '" cy="' + LC[1] + '" r="86" fill="none" stroke="#1B2A4E" stroke-width="3.500"/><circle cx="' + LC[0] + '" cy="' + LC[1] + '" r="89" fill="none" stroke="#fff" stroke-width="2.500"/>' +
    '<rect x="' + (LC[0] - 92) + '" y="' + (LC[1] - 102) + '" width="184" height="20" rx="10" fill="#1B2A4E" opacity=".85"/><text x="' + LC[0] + '" y="' + (LC[1] - 88) + '" font-size="11.500" font-weight="700" text-anchor="middle" fill="#fff">where the blade meets the ice</text>' +
    '<rect x="' + (LC[0] - 6) + '" y="' + (LC[1] - 52) + '" width="88" height="18" rx="9" fill="#fff" opacity=".92"/><path d="M' + (LC[0] + 30) + ' ' + (LC[1] - 34) + 'L' + (LC[0] + 18) + ' ' + (LC[1] + 10) + '" stroke="#1E6FB0" stroke-width="1.400"/><text x="' + (LC[0] + 38) + '" y="' + (LC[1] - 39) + '" font-size="10" font-weight="700" text-anchor="middle" fill="#1E6FB0">loose, like water</text></g>';
  s += '</g>';      /* end of the camera */
  /* on top, still, once the skate has gone: the three distances side by side, to scale */
  s += '<g class="gl-chart" font-size="10.500" font-weight="700"><rect x="8" y="52" width="160" height="62" rx="10" fill="#fff" opacity=".94"/>' +
    [['boot', .7, '#E5484D'], ['block', 1.1, '#C98A4E'], ['skate', 15, '#3B8FC9']].map((r, i) => '<text x="16" y="' + (68 + i * 17) + '" fill="#1B2A4E">' + r[0] + '</text><text x="52" y="' + (68 + i * 17) + '" fill="#5A678A">' + r[1] + ' m</text>' +
      '<rect x="86" y="' + (60 + i * 17) + '" width="' + Math.max(3, r[1] * 4.8).toFixed(1) + '" height="10" rx="3" fill="' + r[2] + '"/>').join('') + '</g>';
  s += '<g class="gl-bar" font-weight="700"><rect x="8" y="261" width="384" height="24" rx="12" fill="#fff" opacity=".93"/><text class="gl-word" x="20" y="277.500" font-size="13" fill="#1E6FB0"></text>' +
    '<text x="380" y="277.500" font-size="13" text-anchor="end" fill="#1B2A4E">the same push for each</text></g></g></svg>';
  return s;
})();
function glideSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab glidelab fill', 'data-s': 'start', html: GLIDE_LAB })); }
async function glideSim(stage, ui) {
  glideSetup(stage); const g = $('.lab', stage), word = $('.gl-word', g);
  const T = w => () => { word.textContent = w; };
  ui.prompt('Three things on three floors. The same push for each!', 'Here are three lanes. A rubber boot on a footpath, a wooden block on a wooden floor, and a skate on ice. Each one gets exactly the same push from a spring. Tap the button to push the boot.');
  await labStep(ui, g, 'Push the boot', 'boot', 'Rubber on a footpath: it stops in under 1 metre.', 'The boot stops after less than a metre: about seventy centimetres. The rough path and the rubber sole rub against each other, and slow it down. That rubbing is called friction.', T('friction'));
  await labStep(ui, g, 'Push the block', 'block', 'Wood on wood: it slides just over 1 metre.', 'Wood on wood is smoother, so there is less friction. The block slides a little further: about one metre ten.', T('less friction'));
  await labStep(ui, g, 'Push the skate', 'skate', 'A skate on ice glides about 15 metres!', 'Now the skate, with its steel blade, on ice. The same push, and look how far it goes: about fifteen metres. That is more than twenty times as far as the boot. Ice has very little friction.', T('very little friction'));
  await labStep(ui, g, 'Look at the ice', 'close', 'The very top of the ice is loose, almost like water.', 'Zoom in where the blade touches the ice. Ice is water molecules, locked together in a pattern. But the molecules on the very top have fewer neighbours to hold on to, so they are loose, and they wobble almost like water. The blade glides on that slippery layer. Scientists agree on the watery layer, but they still argue about exactly how it forms. People once thought the skater’s weight melted the ice. But that would need a skater weighing thousands of kilograms!', T('a watery layer'));
}

COUNTRIES.canada = {
  cheers: ['Bon travail!', 'Lâche pas!'],     /* "good work!" and, in Quebec, "don't give up!" (literally "don't let go"), used only here */
  name: 'Canada', hello: 'Bonjour! Hello! Start with Rink maths.', helloSay: [CAF('bonjour', BONJOUR), 'Hello! Start with Rink maths.'], scene: CA_SCENE,
  thing: 'maple-leaf', boat: 'canoe',
  videos: {
    balance: { yt: 'W61uEyp7ilg', title: 'Balance: how your ears keep you upright', by: 'Operation Ouch (CBBC)', icon: 'ear' },
    auroras: { yt: 'nHn5OO1t1yc', title: 'All about auroras', by: 'Free School', icon: 'milky-way' },
    spin: { yt: 'goOcWWxsEt0', title: 'Why figure skaters spin faster', by: 'Ratna Nidhi Charitable Trust', icon: 'ice-skate' },
    ears: { yt: 'uSZVmX5UW3M', title: 'Excellent ears', by: 'Operation Ouch (CBBC)', icon: 'ear' }
  },
  souvenirs: [
    { id: 'ca-skate', art: 'ice-skate', move: 'slide', name: 'Figure skates', price: 25, need: 'm1' }, { id: 'ca-bear', art: 'polar-bear', name: 'Polar bear', price: 30, need: 'm1' },
    { id: 'ca-cocoa', art: COCOA_ART, name: 'Hot chocolate', price: 15, need: 'm2' }, { id: 'ca-toque', art: TOQUE_ART, name: 'A tuque', price: 15, need: 'm2' },
    { id: 'ca-aurora', art: AURORA_ART, move: 'twinkle', name: 'Northern lights picture', price: 25, need: 'm3' }, { id: 'ca-moose', art: 'moose', name: 'Moose', price: 30, need: 'm3' },
    { id: 'ca-inukshuk', art: INUKSHUK_ART, name: 'Inukshuk', price: 25, need: 'm4' }, { id: 'ca-beaver', art: BEAVER_ART, move: 'rock', head: [52, 12, 56], name: 'Beaver', price: 40, need: 'boss' }
  ],
  themes: { aurora: { name: 'Northern lights room', price: 40, need: 'boss', wall: '#EEF5FB', wall2: '#DCEAF6', floor: '#8A5A34', line: '#6B4424', rug: '#E5484D', sky: ['#10264A', '#2FB58C'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['balance'] }, { id: 'v2', after: ['boss'], choose: ['auroras', 'spin', 'ears'] }],
  path: [
    { m: 'm1', x: 10, y: 60, px: 28, py: 17 }, { m: 'm2', x: 24, y: 80, px: 70, py: 27 }, { video: 'v1', x: 38, y: 62, px: 30, py: 38 },
    { m: 'm3', x: 50, y: 82, px: 70, py: 49 }, { m: 'm4', x: 63, y: 64, px: 30, py: 60 }, { m: 'boss', x: 78, y: 82, px: 70, py: 71 }, { video: 'v2', x: 91, y: 62, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Rink maths', icon: SKATER_ART, sticker: 'ice-skate',
      intro: { text: 'Find out how skaters spin so fast. Then maths on ice!', say: [CAF('bonjour', BONJOUR), 'Welcome to Canada! In winter, lakes and rivers here freeze solid, and the whole country goes skating. Today you find out how a skater spins so fast, and you do maths on the ice.'] },
      rounds: [
        { act: 'predict', q: 'She spins with her arms out, then pulls them in. Her spin…', qsay: 'Here is an experiment. A figure skater spins on the spot, with her arms out wide. Then she pulls her arms in, close to her body. Nobody pushes her. What do you think happens to her spin? Make a prediction.',
          options: [O('Speeds up', 'fast-forward-button'), O('Slows down', 'snail'), O('Stays the same', 'balance-scale')], answer: 0, setup: spinSetup, sim: spinSim,
          right: 'You predicted it! Arms in, she spins faster.', wrong: 'Surprise! Pulling her arms in makes her spin faster.',
          tryit: { icon: 'cyclone', big: 'Spin on a chair!', text: 'Sit on a spinning chair. Arms out, then pull them in.', say: 'Now try it, with a grown-up to give you a gentle push. Sit on a spinning chair, and hold two books with your arms out wide. When you are turning, pull the books in to your chest. You speed up! Push them out again, and you slow down.' } },
        { skill: 'spin' },
        { skill: 'decimals' }, { skill: 'decimals' },
        CA_RACE,
        { skill: 'decimals' }, { skill: '@review', or: 'ratio' }, { skill: '@review', or: 'measure' }] },
    { id: 'm2', name: 'Balance', icon: 'ear', sticker: 'ear',
      intro: { text: 'Name your ear’s parts. Then see why spins make you dizzy!', say: 'Your ears do two jobs. They hear, and they keep your balance. A skater needs both: she skates to music, and she spins without falling over. Today you study the ear, the way a doctor does.' },
      rounds: [
        earPlace(1, 'Name the ear’s big parts. Drag each name to its line.', 'This is a cut through the ear, seen from the front. On the left is the part you can see. Deeper in, inside the bone of the skull, are the parts that hear and the parts that balance. Drag each name to the end of its line.', { text: 'Five parts named. Now, how do they keep you balanced?' }),
        { skill: 'balance' },
        { act: 'predict', q: 'She stops spinning. Why does the room seem to keep turning?', qsay: 'Here is an experiment. Spin round and round, then stop. The room seems to keep on turning, even though you are standing still. Why do you think that happens? Make a prediction.',
          options: [O('Her ear fluid swirls', 'droplet'), O('The ice is moving', 'ice'), O('Her skates keep spinning', 'ice-skate')], answer: 0, setup: dizzySetup, sim: dizzySim,
          right: 'You predicted it! The fluid in her ear swirls on.', wrong: 'Surprise! It is the fluid in her ear, still swirling.',
          tryit: { icon: 'teacup-without-handle', big: 'Stir a cup of water!', text: 'Turn a cup of water round. Stop it. Watch the bits swirl.', say: 'Now try it, with a grown-up. Drop a few tea leaves or bits of herb into a cup of water. Turn the cup round and round, then stop it. Watch the bits: the water keeps swirling, even after the cup has stopped. That is just what the fluid in your ear does.' } },
        { skill: 'balance' },
        earPlace(2, 'Three tiny bones. Name them with their real names!', 'Behind the eardrum are three tiny bones, the smallest in your body. The malleus is joined to the eardrum. Then comes the incus. The stapes, last of all, pushes on the inner ear. Drag each name to its line.', { text: 'Eight parts named. You sound like an ear doctor!' }),
        { skill: 'balance' },
        { act: 'point', system: 'ear', n: 6, ids: earUpTo(2) }] },
    { id: 'm3', name: 'Northern lights', icon: AURORA_ART, sticker: 'sparkles',
      intro: { text: 'Make the northern lights glow. Then say the elements in order!', say: 'On winter nights in Canada, the sky can glow green, red and purple. These are the northern lights. Today you find out which elements make them glow, and you learn the next elements of the periodic table.' },
      rounds: [
        { act: 'predict', q: 'Why are the northern lights green?', qsay: 'Here is an experiment. On winter nights in northern Canada, the sky can glow with rippling green lights, called the northern lights. What do you think makes them green? Make a prediction.',
          options: [O('Glowing oxygen', 'wind-face'), O('Green clouds', 'cloud'), O('Moonlight on snow', 'crescent-moon')], answer: 0, setup: auroraSetup, sim: auroraSim,
          right: 'You predicted it! Oxygen, high up, glows green.', wrong: 'Surprise! It is oxygen in the air, glowing green.',
          tryit: { icon: 'compass', big: 'Steer a compass!', text: 'Move a magnet near a compass. Watch the needle turn.', say: 'Now try it. Put a compass flat on a table, and slowly move a fridge magnet round it. The needle swings to follow the magnet. In the same way, Earth’s magnetism steers the particles from the Sun to the poles.' } },
        { skill: 'aurora' },
        { act: 'elements' },
        { act: 'match', text: 'Which element glows which colour? Match them.', say: 'Each element glows its own colour when it is given energy. Match each one to its colour.', pairs: [
          { a: { art: 'wind-face', label: 'Oxygen, 100 km up' }, b: { art: 'green-circle', label: 'Green' }, text: 'Oxygen about 100 km up glows green.' },
          { a: { art: 'rocket', label: 'Oxygen, higher still' }, b: { art: 'red-circle', label: 'Red' }, text: 'Higher up, where the air is thin, oxygen glows red.' },
          { a: { art: 'wind-face', label: 'Nitrogen' }, b: { art: 'purple-circle', label: 'Purple' }, text: 'Nitrogen glows purple and blue, at the bottom edge.' },
          { a: { art: 'light-bulb', label: 'Neon, in a sign' }, b: { art: 'orange-circle', label: 'Orange-red' }, text: 'Neon glows orange-red. That is a neon sign.' }] },
        { skill: 'aurora' },
        { act: 'elements', part: 'group' },
        { skill: 'aurora' }] },
    { id: 'm4', name: 'True north', icon: MAPLE_ART, sticker: 'maple-leaf',
      intro: { text: 'Find Canada, speak Canadian French, and glide on the ice!', say: 'Time to find Canada on the map, learn some Canadian French, find out why ice is so slippery, and code a skater across the rink.' },
      rounds: [
        { act: 'findmap', text: 'Where is Canada? Tap it.', say: 'This is the top half of the Americas. Where is Canada? Tap it.', view: [96, 16, 330, 230], targets: ['124', '840', '304', '484'], answer: '124',
          hint: { text: 'Canada is the huge country in the north, above the USA.' }, done: { text: 'You found Canada! Only Russia is bigger.', say: 'You found Canada! It is the second-biggest country in the world. Only Russia is bigger. It also has the longest coastline of any country.' } },
        { act: 'meet', text: 'Tap each card to hear Canadian French.', say: 'Canada has two official languages: English and French. In Quebec, most people speak French at home. Tap each card to hear a winter word.', lang: 'fr-ca', words: CAFRENCH },
        { skill: 'cafrench' },
        { act: 'predict', q: 'The same push for each. Which slides farthest?', qsay: 'Here is an experiment. A rubber boot on a footpath, a wooden block on a wooden floor, and a skate on ice. Each one gets exactly the same push. Which one do you think slides the farthest? Make a prediction.',
          options: [O('The skate on ice', 'ice-skate'), O('The boot on concrete', 'construction'), O('The block on wood', 'wood')], answer: 0, setup: glideSetup, sim: glideSim,
          right: 'You predicted it! The skate on ice: about 15 metres.', wrong: 'Surprise! The skate on ice glides about 15 metres.',
          tryit: { icon: 'ice', big: 'Slide an ice cube!', text: 'Push an ice cube, then a rubber, across a plate.', say: 'Now try it. Put an ice cube and a rubber eraser on a plate. Give each one the same small flick. Which slides further? Then put a tea towel on the plate, and try again.' } },
        { skill: 'glide' }, { skill: 'cafrench' },
        { act: 'code', look: RINK, text: 'Code the skater to the maple leaf.', say: 'The skater wants to reach the maple leaf in the middle of the rink. Count the squares. Tap or drag arrows into the boxes to make a path round the snowbanks. Then tap Go.', cols: 5, rows: 3, start: [0, 2], goal: [4, 0], rocks: [[2, 2], [1, 0], [3, 0]], slots: 7,
          path: [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [4, 0]], legs: [[1, 2], [1, 1], [4, 1], [4, 0]], solution: [['r'], ['u'], ['r'], ['r'], ['r'], ['u']] },
        { act: 'code', look: RINK, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long glide, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 4], goal: [5, 0], rocks: [[1, 2], [2, 0], [4, 2], [5, 3], [0, 1]], slots: 4, repeat: true,
          path: [[0, 4], [1, 4], [2, 4], [3, 4], [3, 3], [3, 2], [3, 1], [3, 0], [4, 0], [5, 0]], legs: [[3, 4], [3, 0], [5, 0]], solution: [['r', 3], ['u', 4], ['r', 2]] },
        { skill: 'canada' }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'trophy',
      intro: { text: 'Show everything you know about Canada!', say: 'The big one! Show everything you have learned in Canada.' },
      rounds: [{ skill: 'decimals' }, { skill: 'balance' },
        earPlace(3, 'The last two parts. Name every one!', 'Two parts to go. The Eustachian tube runs down to your throat: it is what pops on an aeroplane. The auditory nerve carries signals from the inner ear to the brain.', { text: 'Every part of the ear is named. Bravo, Doctor!' }),
        { skill: 'aurora' }, { skill: 'spin' }, { act: 'elements' }, { skill: 'cafrench' }, { skill: 'glide' },
        { act: 'point', system: 'ear', n: 8 }, { skill: 'canada' }, { skill: '@review', or: 'factors' }] }
  ]
};
W.ca = { BEAVER_ART, SKATER_ART, SNOWBANK_ART, MAPLE_ART, INUKSHUK_ART, COCOA_ART, AURORA_ART, TOQUE_ART, CA_SCENE, earSvg, EAR };

W.labs = Object.assign(W.labs || {}, { spin: spinSetup, dizzy: dizzySetup, aurora: auroraSetup, glide: glideSetup });
