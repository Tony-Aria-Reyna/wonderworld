/* ===== France: the seventh country. Everything here is content, not code.
   (B64, B32 and O, the small helpers, labStep, letterArt, ROOSTER_IN, the race, and the measuring and chance skills come from the earlier files.)
   Three labs she works herself: Pasteur's flask lab (boiled broth stays clear until dust from the air reaches it), the X-ray lab (X-rays pass through skin and are stopped by bone and metal)
   and the balloon lab (hot air spreads out, some leaves, and the lighter balloon is pushed up by the heavier air around it).
   Sources, all Wikipedia unless named: "Louis Pasteur" (fermentation is the work of living yeast; the swan-neck flask experiments of 1859 to 1862 against spontaneous generation; pasteurisation patented 1865;
   6 July 1885, Joseph Meister, aged 9, the first person given the rabies vaccine), "Swan neck flask" (the bend traps dust and the microbes on it; the broth stays free of microbes),
   "Pasteurization" (milk: 72 degrees C for 15 seconds; it does not sterilise), "Marie Curie" (born in Warsaw, 1867; Nobel Prizes in physics, 1903, and chemistry, 1911: the first woman to win one, the first person to win two;
   polonium named after Poland; in the First World War 20 mobile X-ray vans, the "petites Curies", and 200 fixed units; over a million wounded soldiers treated; her daughter Irène, 17, helped),
   "Montgolfier brothers" (paper makers of Annonay; first public flight 4 June 1783; 19 September 1783 at Versailles, before Louis XVI and Marie Antoinette: a sheep called Montauciel, a duck and a rooster flew
   about 8 minutes, 3 km, to about 500 m; first free flight by people 21 November 1783, 25 minutes over Paris), "Hot air balloon" (air at 20 degrees C weighs 1.2041 kg a cubic metre, at 99 degrees 0.9486 kg),
   "Louis Braille" (born 1809 at Coupvray; blinded by an accident at 3; showed his six-dot code at 15; published 1829), "French Braille" (a to j use the top four dots; k to t add dot 3; u, v, x, y, z add dots 3 and 6; w is j with dot 6),
   "Eiffel Tower" (330 m; finished 1889; 18,038 iron parts, 2.5 million rivets), "History of the metric system" (France, law of 7 April 1795; the metre as one ten-millionth of the distance from the North Pole to the Equator
   through Paris, surveyed 1792 to 1798 by Delambre and Méchain), "Problem of points" (Pascal and Fermat, letters of 1654: the start of the maths of chance),
   "The Tortoise and the Hare" (Aesop; La Fontaine's "Le Lièvre et la Tortue", Fables, book 6, fable 10, 1668). ===== */

/* ----- hand-drawn pieces ----- */
const ROOSTER_ART = { svg: '<svg viewBox="6 16 110 100" xmlns="http://www.w3.org/2000/svg">' + ROOSTER_IN + '</svg>' };
/* the two runners, both facing the finish line on the right */
const HARE_ART = B64('<ellipse cx="32" cy="59" rx="24" ry="3" fill="rgba(27,42,78,.12)"/><circle cx="8" cy="38" r="5" fill="#fff"/>' +
  '<path d="M14 54l-9 3M22 55l-8 4" stroke="#A9743F" stroke-width="5" stroke-linecap="round"/><path d="M44 50l11 6M38 52l9 6" stroke="#A9743F" stroke-width="4.500" stroke-linecap="round"/>' +
  '<ellipse cx="27" cy="42" rx="19" ry="11.500" fill="#C99A6B"/><ellipse cx="17" cy="46" rx="10" ry="8.500" fill="#B98858"/>' +
  '<g transform="rotate(-36 46 26)"><ellipse cx="41" cy="12" rx="3.800" ry="12" fill="#C99A6B"/><ellipse cx="41" cy="12" rx="1.700" ry="8.500" fill="#F4B8B0"/></g><g transform="rotate(-18 48 26)"><ellipse cx="46" cy="11" rx="3.800" ry="12.500" fill="#B98858"/></g>' +
  '<circle cx="49" cy="31" r="9.500" fill="#C99A6B"/><ellipse cx="55" cy="35" rx="5" ry="4" fill="#E3C39A"/><circle cx="58.500" cy="33.500" r="1.700" fill="#5A3413"/><circle cx="50" cy="28.500" r="2.300" fill="#1B2A4E"/><circle cx="50.800" cy="27.700" r=".8" fill="#fff"/>');
const TORTOISE_ART = B64('<ellipse cx="31" cy="58" rx="25" ry="3" fill="rgba(27,42,78,.12)"/><path d="M6 47l-4 4" stroke="#7DB85F" stroke-width="4" stroke-linecap="round"/><path d="M15 47v8M39 47v8" stroke="#6FAE55" stroke-width="7.500" stroke-linecap="round"/>' +
  '<path d="M3 47q0-27 24-27t24 27z" fill="#8A5A34"/><path d="M27 21v26M16 26l6 21M38 26l-6 21M6 36h42" stroke="#B98A4E" stroke-width="2.200" fill="none"/><path d="M2 47h50" stroke="#6B4424" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M46 43q6-2 8-8" stroke="#8CC66E" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="55" cy="31" r="7.500" fill="#8CC66E"/><circle cx="57.500" cy="29.500" r="2" fill="#1B2A4E"/><circle cx="58.100" cy="28.800" r=".7" fill="#fff"/><path d="M55.500 34.500q2.500 1.500 4.500-.300" stroke="#3F7A3A" stroke-width="1.400" fill="none" stroke-linecap="round"/>');
const TOWER_ART = B64('<path d="M32 2v6" stroke="#5A4530" stroke-width="2"/><path d="M32 6l-4 17h8zM26.500 26l-4 15h19l-4-15zM21 44 11 61h9q2-11 12-11t12 11h9L43 44z" fill="#8A6A4A"/>' +
  '<rect x="25" y="22" width="14" height="3.600" rx="1" fill="#5A4530"/><rect x="19.500" y="40.500" width="25" height="4" rx="1" fill="#5A4530"/><path d="M28.500 27l7 13M35.500 27l-7 13M30 9l4 12M34 9l-4 12" stroke="#C9B08F" stroke-width="1.300"/>');
/* Pasteur's flask, with its neck bent like a swan's */
const FLASK_ART = B64('<path d="M24 31V17q0-9 9-9h3q9 0 9 10v12q0 7 6 7t6-7v-5" fill="none" stroke="#1B2A4E" stroke-width="7" stroke-linecap="round"/><path d="M24 31V17q0-9 9-9h3q9 0 9 10v12q0 7 6 7t6-7v-5" fill="none" stroke="#EAF6FF" stroke-width="3.400" stroke-linecap="round"/>' +
  '<circle cx="24" cy="45" r="15" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="2"/><path d="M10.500 48a14 14 0 0 0 27 0z" fill="#E9B95C"/><path d="M15 38q3-5 8-6" stroke="#fff" stroke-width="2.500" fill="none" stroke-linecap="round"/>');
const FLASK_OPEN_ART = B64('<rect x="19" y="6" width="10" height="26" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="2"/><circle cx="24" cy="45" r="15" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="2"/><rect x="20.200" y="26" width="7.600" height="8" fill="#EAF6FF"/><path d="M10.500 48a14 14 0 0 0 27 0z" fill="#E9B95C"/><path d="M15 38q3-5 8-6" stroke="#fff" stroke-width="2.500" fill="none" stroke-linecap="round"/>');
/* the Montgolfier balloon of 1783: blue and gold, with a gallery round the bottom */
const BALLOON_IN = '<path d="M32 3C15 3 7 15 7 26c0 12 11 19 15 27h20c4-8 15-15 15-27C57 15 49 3 32 3z" fill="#3B6FD4" stroke="#1B2A4E" stroke-width="1.600"/><path d="M8 23q24 9 48 0" stroke="#FFC83D" stroke-width="3" fill="none"/>' +
  '<path d="M14 36q6 5 9-1 4 6 9 0 5 6 9 0 3 6 9 1" stroke="#FFC83D" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="32" cy="13.500" r="5" fill="#FFC83D"/><path d="M22 53h20l-2 4H24z" fill="#C0392B" stroke="#1B2A4E" stroke-width="1.300"/><rect x="24" y="57" width="16" height="5" rx="1.500" fill="#B98A4E" stroke="#1B2A4E" stroke-width="1.300"/>';
const BALLOON_ART = B64(BALLOON_IN);
const HEDGE_ART = B32('<ellipse cx="16" cy="28" rx="11" ry="2" fill="rgba(27,42,78,.18)"/><circle cx="9" cy="20" r="7" fill="#3FA36B"/><circle cx="23" cy="20" r="7" fill="#3FA36B"/><circle cx="16" cy="14" r="8.500" fill="#57BF7F"/><circle cx="12" cy="13" r="1.600" fill="#E5484D"/><circle cx="20" cy="18" r="1.600" fill="#E5484D"/><circle cx="16" cy="22" r="1.600" fill="#E5484D"/>');
const METRE_ART = B32('<circle cx="16" cy="16" r="12" fill="#8ED0F4" stroke="#1B2A4E" stroke-width="1.500"/><path d="M9 9q5 2 4 7-3 1-3 6M19 6q-2 5 3 6 3-2 5 2" fill="none" stroke="#57BF7F" stroke-width="3" stroke-linecap="round"/><path d="M4 16h24" stroke="#fff" stroke-width="1.200" stroke-dasharray="2 2"/><path d="M16 4a12 12 0 0 1 12 12" fill="none" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="4" r="2" fill="#E5484D"/><circle cx="28" cy="16" r="2" fill="#E5484D"/>');

/* Pasteur's bench, for naming what is on it */
const BENCH_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="6" fill="#EAF2FB"/><rect x="0" y="80" width="100" height="20" fill="#B98A4E"/><rect x="0" y="80" width="100" height="4" fill="#8A5A34"/>' +
  '<path d="M16 80l3-23h16l3 23" fill="none" stroke="#5A678A" stroke-width="2" stroke-linejoin="round"/><g transform="translate(8 9) scale(.78)">' + FLASK_ART.svg.replace(/<\/?svg[^>]*>/g, '') + '</g>' +
  '<path d="M27 76q-6-7 0-14 2 4 3-1 6 8 0 15z" fill="#FF9A3D"/><path d="M27 76q-3-4 0-7 3 3 0 7z" fill="#FFD23F"/><rect x="20" y="76" width="14" height="4" rx="1" fill="#3E4A5E"/>' +
  '<g transform="translate(54 28)"><rect x="12" y="46" width="26" height="6" rx="2" fill="#3E4A5E"/><path d="M30 46V20" stroke="#3E4A5E" stroke-width="6" stroke-linecap="round"/><g transform="rotate(-24 22 22)"><rect x="17" y="2" width="10" height="32" rx="3" fill="#5A678A"/><rect x="18.500" y="33" width="7" height="6" rx="1" fill="#1B2A4E"/><rect x="15" y="0" width="14" height="6" rx="2" fill="#1B2A4E"/></g><rect x="6" y="40" width="22" height="3" rx="1" fill="#9AA3B5"/></g></svg>';
const BENCH_ITEMS = [
  { id: 'fl', label: 'Swan-neck flask', x: 42, y: 24, w: 13, fact: { text: 'Its neck bends like a swan. Air gets in.' }, hint: { text: 'The flask is the glass bottle with a bent neck.' } },
  { id: 'br', label: 'Broth', x: 27, y: 49, w: 13, fact: { text: 'Broth is thin soup. Microbes love to eat it.' }, hint: { text: 'The broth is the golden soup inside the flask.' } },
  { id: 'bu', label: 'Burner', x: 27, y: 70, w: 13, fact: { text: 'The flame boils the broth, and kills microbes.' }, hint: { text: 'The burner is the flame under the flask.' } },
  { id: 'mi', label: 'Microscope', x: 76, y: 48, w: 13, fact: { text: 'A microscope shows things too small to see.' }, hint: { text: 'The microscope is the tall tool with a tube to look down.' } }
];

/* ----- the scene behind the mission path: Paris. The Eiffel Tower, the roofs, the river Seine and its bridge, a balloon in the sky, and lavender fields in front ----- */
const frTower = (x, y, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M0-322v-26" stroke="#5A4530" stroke-width="3"/><path d="M0-322l-9 96h18zM-13-214l-15 92h56l-15-92zM-32-112-78 0h36q6-54 42-54t42 54h36L32-112z" fill="#7A6652"/>' +
  '<rect x="-17" y="-228" width="34" height="12" rx="2" fill="#5A4530"/><rect x="-36" y="-124" width="72" height="13" rx="2" fill="#5A4530"/><path d="M-12-208l36 82M12-208l-36 82" stroke="#A8927A" stroke-width="2.500"/></g>';
const frRoofs = [[20, 70, 86], [96, 60, 110], [162, 76, 92], [244, 58, 120], [308, 84, 98], [398, 62, 112], [652, 70, 94], [728, 60, 112], [794, 76, 88], [876, 58, 118], [940, 70, 96]].map(b =>
  '<rect x="' + b[0] + '" y="' + (392 - b[2]) + '" width="' + b[1] + '" height="' + b[2] + '" fill="#D9CBE6"/><path d="M' + (b[0] - 3) + ' ' + (392 - b[2]) + 'l8-18h' + (b[1] - 10) + 'l8 18z" fill="#8D86A8"/>' +
  [0, 1, 2].map(i => '<rect x="' + (b[0] + 10 + i * (b[1] - 26) / 2) + '" y="' + (392 - b[2] + 16) + '" width="7" height="12" rx="1" fill="#FFF3C9"/><rect x="' + (b[0] + 10 + i * (b[1] - 26) / 2) + '" y="' + (392 - b[2] + 42) + '" width="7" height="12" rx="1" fill="#FFF3C9"/>').join('')).join('');
const FR_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="frsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4EE"/><stop offset=".6" stop-color="#D5EEFB"/><stop offset="1" stop-color="#FFE7CF"/></linearGradient>' +
  '<filter id="frsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".16"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#frsky)"/><circle cx="150" cy="96" r="58" fill="#FFE98F"/><circle cx="150" cy="96" r="41" fill="#FFD23F"/>' +
  '<g fill="#fff" opacity=".92"><ellipse cx="700" cy="84" rx="72" ry="21"/><ellipse cx="752" cy="68" rx="46" ry="19"/><ellipse cx="880" cy="130" rx="58" ry="17"/><ellipse cx="840" cy="118" rx="34" ry="15"/></g>' +
  '<g transform="translate(372 84) scale(1.9)">' + BALLOON_IN + '</g>' +
  '<g filter="url(#frsh)">' + frRoofs + '</g><g filter="url(#frsh)">' + frTower(558, 400, 1) + '</g>' +
  '<path d="M0 392h1000v84H0z" fill="#5BB3DC"/><g stroke="#A8DDF2" stroke-width="4" stroke-linecap="round" fill="none"><path d="M70 418q14-8 28 0t28 0M600 430q14-8 28 0t28 0M860 414q14-8 28 0t28 0M430 452q14-8 28 0t28 0"/></g>' +
  '<g filter="url(#frsh)"><rect x="60" y="384" width="400" height="64" fill="#EADBC0"/><g fill="#4FA3CC"><path d="M86 448q0-44 50-44t50 44z"/><path d="M210 448q0-44 50-44t50 44z"/><path d="M334 448q0-44 50-44t50 44z"/></g><path d="M54 384h412" stroke="#C9B48E" stroke-width="8" stroke-linecap="round"/></g>' +
  '<path filter="url(#frsh)" d="M0 476Q250 440 520 466T1000 452V600H0z" fill="#9BCB7C"/>' +
  '<g fill="none" stroke="#A98AE0" stroke-width="13" stroke-linecap="round"><path d="M-10 520Q250 480 520 506T1010 492"/><path d="M-10 552Q250 512 520 538T1010 524"/><path d="M-10 584Q250 544 520 570T1010 556"/></g>' +
  '<g fill="none" stroke="#C9B5F2" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 14"><path d="M-10 514Q250 474 520 500T1010 486"/><path d="M-10 546Q250 506 520 532T1010 518"/><path d="M-10 578Q250 538 520 564T1010 550"/></g>' +
  '<g filter="url(#frsh)"><path d="M70 470q-16-70 0-128 16 58 0 128z" fill="#3F8F5A"/><path d="M930 462q-18-80 0-146 18 66 0 146z" fill="#3F8F5A"/><path d="M968 470q-13-56 0-104 13 48 0 104z" fill="#57A56C"/></g>' +
  '</svg>';

/* ----- French words. Edge and Android both have a French voice; without one, the English voice sounds the word out from the spelling beside it ----- */
const FR = (t, phon, inline) => ({ t, lang: 'fr', fallback: phon, inline: !!inline });
const FRENCH = [
  { native: 'bonjour', rom: 'bonjour', en: 'hello', icon: 'waving-hand', phon: 'bon-zhoor' },
  { native: 'merci', rom: 'merci', en: 'thank you', icon: 'folded-hands', phon: 'mair-see' },
  { native: 'lait', rom: 'lait', en: 'milk', icon: 'glass-of-milk', phon: 'leh' },
  { native: 'chat', rom: 'chat', en: 'cat', icon: 'cat', phon: 'shah' },
  { native: 'pomme', rom: 'pomme', en: 'apple', icon: 'red-apple', phon: 'pom' },
  { native: 'lièvre', rom: 'lièvre', en: 'hare', icon: HARE_ART, phon: 'lee-ev-ruh' }
];
wordSkill('french', 'French words', 'fr', FRENCH);
const BONJOUR = 'bon-zhoor';

/* ----- microbes and germs: what Louis Pasteur found out ----- */
bankSkill('germs', 'Microbes and germs', 'science', [
  { pic: 'microbe', why: 'Microbes are living things, too small to see.',
    ask: [{ t: 'To see a microbe, you need a…', pic: 'microbe', h: 'A microbe is far smaller than a grain of sand. This tool makes tiny things look big.', o: [O('Microscope', 'microscope'), O('Telescope', 'telescope'), O('Mirror', 'mirror')] },
      { t: 'A microbe is a tiny … thing.', s: 'A microbe is a tiny what thing?', pic: 'microscope', h: 'In the flask lab, each one grew, and split into two. Only one kind of thing can do that.', o: [O('Living', 'seedling'), O('Metal', 'nut-and-bolt'), O('Frozen', 'ice')] }] },
  { pic: FLASK_OPEN_ART, why: 'Microbes come from other microbes, never from nothing.',
    ask: [{ t: 'Microbes got into the open flask by riding on…', pic: FLASK_OPEN_ART, h: 'It floats in the air, and you see it in a sunbeam. It fell straight down the neck.', o: [O('Dust', 'dashing-away'), O('Light', 'light-bulb'), O('Sound', 'musical-note')] },
      { t: 'Pasteur showed that microbes come from…', pic: FLASK_ART, h: 'The boiled broth stayed clear for a year, until the dust touched it. Nothing grew from nothing.', o: [O('Other microbes', 'microbe'), O('Nothing at all', 'cross-mark'), O('Old broth', 'pot-of-food')] }] },
  { pic: 'fire', why: 'Heat kills microbes. Pasteurised milk is safe to drink.',
    ask: [{ t: 'What killed the microbes in the broth at the start?', pic: FLASK_ART, h: 'Pasteur lit the burner under both flasks, until the broth bubbled.', o: [O('Boiling', 'fire'), O('Shaking', 'left-right-arrow'), O('Waiting', 'hourglass-not-done')] },
      { t: 'Milk is heated to 72 degrees to kill germs. That is…', s: 'Milk is heated to 72 degrees for 15 seconds, to kill germs. What is that called?', pic: 'glass-of-milk', h: 'It is named after the scientist who thought of it: Louis Pasteur.', o: [O('Pasteurising', 'fire'), O('Freezing', 'ice'), O('Skimming', 'spoon')] }] },
  { pic: 'microbe', why: 'Microbes multiply by splitting in two, again and again.',
    ask: [{ t: 'One microbe splits into two. Those two split into…', pic: 'microscope', h: 'Each of the two splits in half. Two lots of two.', o: [O('Four', 'microbe'), O('Three', 'cross-mark'), O('Two', 'balance-scale')] },
      { t: '1, 2, 4, 8. Each time, the number of microbes…', pic: 'microscope', h: 'Every microbe becomes two. So there are twice as many each time.', o: [O('Doubles', 'up-arrow'), O('Halves', 'down-arrow'), O('Stays the same', 'balance-scale')] }] },
  { pic: FLASK_ART, why: 'Air got in, but the bend trapped the dust.',
    ask: [{ t: 'Why did the swan-neck broth stay clear?', pic: FLASK_ART, h: 'Air reached that broth every day. But what was stuck in the bend of the neck?', o: [O('The dust got stuck', 'dashing-away'), O('No air got in', 'cross-mark'), O('It was colder', 'snowflake')] },
      { t: 'Pasteur tipped the flask. The broth touched the dust and went…', pic: FLASK_ART, h: 'The dust carried microbes. Once they reached the broth, they began to split and multiply.', o: [O('Cloudy', 'cloud'), O('Clearer', 'droplet'), O('Solid', 'rock')] }] },
  { pic: 'syringe', why: 'A vaccine trains your body to fight a germ.',
    ask: [{ t: 'A vaccine shows your body a harmless piece of a…', pic: 'syringe', h: 'Your body studies it, and makes defenders called antibodies, shaped to catch that one kind.', o: [O('Germ', 'microbe'), O('Bone', 'bone'), O('Leaf', 'herb')] },
      { t: 'After a vaccine, your body can … that germ.', s: 'After a vaccine, your body can do what, with that germ?', pic: 'adhesive-bandage', h: 'Next time the real germ comes, your body knows it at once, and beats it fast.', o: [O('Remember', 'brain'), O('Forget', 'cross-mark'), O('Feed', 'spoon')] }] },
  { pic: 'bread', why: 'Some microbes help us. Yeast makes bread rise.',
    ask: [{ t: 'Which microbe makes bread rise?', pic: 'baguette-bread', h: 'Pasteur studied it too. It is alive, and bakers stir it into the dough.', o: [O('Yeast', 'bread'), O('A flu virus', 'sneezing-face'), O('Mould', 'cheese-wedge')] },
      { t: 'Yeast eats sugar and makes a gas. The gas makes bread…', pic: 'bread', h: 'The gas blows thousands of tiny bubbles in the dough. That is why bread is full of holes.', o: [O('Rise', 'up-arrow'), O('Sink', 'down-arrow'), O('Freeze', 'ice')] }] },
  { pic: 'soap', why: 'Soap and water wash germs off your hands.',
    ask: [{ t: 'What washes germs off your hands best?', pic: 'raised-hand', h: 'Germs cling to the grease on your skin. This breaks the grease up, and water carries it away.', o: [O('Soap and water', 'soap'), O('A dry towel', 'roll-of-paper'), O('Cold air', 'wind-face')] },
      { t: 'Why do doctors wash their hands before touching a patient?', pic: 'stethoscope', h: 'Hands pick up microbes from everything they touch, and can carry them to the next person.', o: [O('To remove germs', 'soap'), O('To warm them', 'fire'), O('To look smart', 'necktie')] }] }
], 'france');

/* ----- X-rays, and the scientist who drove them to the wounded: Marie Curie ----- */
bankSkill('xray', 'X-rays', 'science', [
  { pic: 'x-ray', why: 'Bone is dense. It stops X-rays, so it shows white.',
    ask: [{ t: 'X-rays pass through skin and muscle. What stops them?', pic: 'raised-hand', h: 'In the X-ray lab, one part of the hand showed up white on the picture.', o: [O('Bone', 'bone'), O('Air', 'dashing-away'), O('Water', 'droplet')] },
      { t: 'On an X-ray picture, the bones show up…', pic: 'bone', h: 'Where the X-rays are stopped, the picture stays pale. Where they get through, it goes dark.', o: [O('White', 'white-circle'), O('Green', 'green-circle'), O('Red', 'red-circle')] }] },
  { pic: 'bone', why: 'The denser a thing is, the more X-rays it stops.',
    ask: [{ t: 'Bone stops X-rays because it is dense and full of…', pic: 'bone', h: 'It is the same hard mineral that is in milk, and it makes bones and teeth strong.', o: [O('Calcium', 'glass-of-milk'), O('Air', 'dashing-away'), O('Sugar', 'candy')] },
      { t: 'A gold ring stops more X-rays than bone. Metal is more…', pic: 'ring', h: 'Dense means a lot of stuff packed into a small space. That is what blocks the rays.', o: [O('Dense', 'rock'), O('Bendy', 'left-right-arrow'), O('See-through', 'window')] }] },
  { pic: 'flashlight', why: 'X-rays are light with far more energy than torchlight.',
    ask: [{ t: 'X-rays are a kind of … our eyes cannot see.', s: 'X-rays are a kind of what, that our eyes cannot see?', pic: 'eye', h: 'It travels in straight lines and makes shadows, just as a torch beam does.', o: [O('Light', 'light-bulb'), O('Sound', 'musical-note'), O('Wind', 'wind-face')] },
      { t: 'Why can a torch not show your bones?', pic: 'flashlight', h: 'Torchlight has too little energy. It is stopped at the very first layer.', o: [O('Skin stops its light', 'raised-hand'), O('It is too bright', 'sun'), O('Bones give out light', 'bone')] }] },
  { pic: 'stethoscope', why: 'X-rays show the inside of a body without cutting.',
    ask: [{ t: 'A doctor thinks an arm is broken. What shows the crack?', pic: 'flexed-biceps', h: 'It makes a picture of the bones, right through the skin.', o: [O('An X-ray', 'x-ray'), O('A thermometer', 'thermometer'), O('A torch', 'flashlight')] },
      { t: 'An X-ray lets a doctor see inside without…', pic: 'x-ray', h: 'Before X-rays, the only way to look at a bone was to open the body up.', o: [O('Cutting the skin', 'adhesive-bandage'), O('Any light', 'light-bulb'), O('A hospital', 'hospital')] }] },
  { pic: 'woman-scientist', why: 'Marie Curie won two Nobel Prizes, and saved many lives.',
    ask: [{ t: 'In the war, Marie Curie drove X-ray vans to help wounded…', pic: 'ambulance', h: 'She came from Poland and worked in Paris. Her twenty vans went to the battlefields.', o: [O('Soldiers', 'military-helmet'), O('Horses', 'horse'), O('Sailors', 'sailboat')] },
      { t: 'Marie Curie was the first person to win two…', pic: 'woman-scientist', h: 'It is the greatest prize in science. She won it for physics, and again for chemistry.', o: [O('Nobel Prizes', 'sports-medal'), O('Bike races', 'bicycle'), O('Gold cups', 'trophy')] }] },
  { pic: 'x-ray', why: 'A few X-rays are safe. Too many can harm you.',
    ask: [{ t: 'Too many X-rays can harm you. So the worker stands…', pic: 'x-ray', h: 'The screen is made with lead, a metal so dense that X-rays cannot get through it.', o: [O('Behind a screen', 'shield'), O('Very close', 'magnifying-glass-tilted-left'), O('On a chair', 'chair')] },
      { t: 'One X-ray photo uses only a … amount of rays.', s: 'One X-ray photo uses only what amount of rays?', pic: 'bone', h: 'A photo takes less than a second. That is safe. It is working with X-rays all day that needs a screen.', o: [O('Tiny', 'pinching-hand'), O('Huge', 'elephant'), O('Hot', 'fire')] }] }
], 'france');

/* ----- hot air: why the first balloon flew ----- */
bankSkill('hotair', 'Hot air and floating', 'science', [
  { pic: 'fire', why: 'Hot particles move faster, and spread further apart.',
    ask: [{ t: 'Heat the air. Its particles move…', pic: 'fire', h: 'In the balloon lab, look in the magnifying glass when the fire is lit.', o: [O('Faster', 'dashing-away'), O('Slower', 'snail'), O('Not at all', 'stop-sign')] },
      { t: 'Fast particles bump each other further…', pic: 'dashing-away', h: 'Each bump knocks them away from one another. So hot air takes up more room.', o: [O('Apart', 'left-right-arrow'), O('Together', 'handshake'), O('Down', 'down-arrow')] }] },
  { pic: BALLOON_ART, why: 'Hot air is less dense: lighter for its size.',
    ask: [{ t: 'A balloon of hot air holds … air than a cold one.', s: 'A balloon full of hot air holds how much air, compared with a cold one?', pic: BALLOON_ART, h: 'As the air spread out, some was pushed out of the hole at the bottom.', o: [O('Less', 'down-arrow'), O('More', 'up-arrow'), O('The same', 'balance-scale')] },
      { t: 'Which is lighter: a box of hot air, or cold?', pic: 'package', h: 'Cold air: 1.2 kilograms in a cubic metre. Hot air: only 0.95.', o: [O('Hot air', 'fire'), O('Cold air', 'snowflake'), O('Neither', 'balance-scale')] }] },
  { pic: 'up-arrow', why: 'Heavier air sinks under the balloon, and pushes it up.',
    ask: [{ t: 'What pushes a hot-air balloon up?', pic: BALLOON_ART, h: 'It is all around the balloon, and it is heavier than the air inside. It sinks underneath.', o: [O('The cold air outside', 'snowflake'), O('The basket', 'basket'), O('The ropes', 'knot')] },
      { t: 'A balloon floats in air the way a cork floats in…', pic: BALLOON_ART, h: 'The cork is lighter for its size than what is around it. So it is pushed up.', o: [O('Water', 'water-wave'), O('Sand', 'desert'), O('Rock', 'rock')] }] },
  { pic: 'snowflake', why: 'Cool air shrinks and gets heavier, so the balloon sinks.',
    ask: [{ t: 'The fire goes out. The air inside the balloon…', pic: BALLOON_ART, h: 'Without the fire, the particles slow down, and crowd back together.', o: [O('Cools and shrinks', 'snowflake'), O('Gets hotter', 'fire'), O('Turns to water', 'droplet')] },
      { t: 'To come down, a balloon pilot lets the air…', pic: 'down-arrow', h: 'Cooler air is heavier for its size. A heavier balloon floats lower.', o: [O('Cool', 'snowflake'), O('Boil', 'fire'), O('Glow', 'light-bulb')] }] },
  { pic: 'ewe', why: 'In 1783, animals flew first. People flew two months later.',
    ask: [{ t: 'The first balloon passengers: a sheep, a duck and a…', s: 'The first passengers ever to fly in a balloon were a sheep, a duck, and a what?', pic: 'ewe', h: 'He is the bird that crows at sunrise, and he is a symbol of France.', o: [O('Rooster', 'rooster'), O('Horse', 'horse'), O('Cat', 'cat')] },
      { t: 'In 1783, the Montgolfier brothers built the first…', pic: 'scroll', h: 'They were paper makers. They made a huge bag of paper and cloth, and lit a fire under it.', o: [O('Hot-air balloon', BALLOON_ART), O('Aeroplane', 'airplane'), O('Rocket', 'rocket')] }] },
  { pic: 'ice', why: 'Lighter for its size floats. Heavier for its size sinks.',
    ask: [{ t: 'Ice floats on water. Hot air floats on…', pic: 'ice', h: 'Each one is lighter for its size than what is around it.', o: [O('Cold air', 'snowflake'), O('Water', 'water-wave'), O('Fire', 'fire')] },
      { t: 'A thing floats up when it is … for its size.', s: 'A thing floats up when it is what, for its size?', pic: BALLOON_ART, h: 'Scientists say less dense. A cork in water, ice on a lake, hot air in cold air.', o: [O('Lighter', 'feather'), O('Heavier', 'rock'), O('Hotter', 'fire')] }] }
], 'france');

bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: 'test-tube', hint: 'Both flasks had the same broth, boiled the same way. Only the neck was different.', why: 'Change one thing only. Keep the rest the same.',
    ask: [{ t: 'Pasteur used two flasks. What was different about them?', o: [O('The neck', FLASK_ART), O('The broth', 'pot-of-food'), O('The room', 'house')] },
      { t: 'Same broth, same boiling, a different neck. That is a…', s: 'The same broth, the same boiling, and a different neck. What do we call a test like that?', o: [O('Fair test', 'balance-scale'), O('Lucky guess', 'four-leaf-clover'), O('Magic trick', 'magic-wand')] }] },
  { pic: 'microscope', hint: 'People believed microbes grew out of nothing. Pasteur did not just argue. He tested it.', why: 'A scientist tests an idea, even one everybody believes.',
    ask: [{ t: 'Everyone believed microbes grew from nothing. What did Pasteur do?', o: [O('He tested it', FLASK_ART), O('He agreed', 'thumbs-up'), O('He gave up', 'cross-mark')] },
      { t: 'What settles an argument in science?', o: [O('An experiment', 'test-tube'), O('The loudest voice', 'loudspeaker'), O('The oldest book', 'books')] }] },
  { pic: 'x-ray', hint: 'Eyes cannot see a microbe, or a bone under the skin. A microscope and an X-ray can.', why: 'Tools let scientists see what eyes alone cannot.',
    ask: [{ t: 'A microscope and an X-ray machine both help us…', o: [O('See hidden things', 'eye'), O('Hear better', 'ear'), O('Run faster', 'running-shoe')] },
      { t: 'Which tool shows things too small to see?', o: [O('A microscope', 'microscope'), O('A ruler', 'straight-ruler'), O('A thermometer', 'thermometer')] }] }
], 'france');

/* ----- Pasteur's flask lab: two flasks of the same broth, boiled the same way. One has a straight neck; the other a neck bent like a swan's. Air reaches both.
   Dust falls straight into the first, and the microbes on it multiply (one becomes two, two become four): the broth goes cloudy. In the second, the dust is caught in the bend, and the broth stays clear for a year.
   Tip that flask so the broth washes over the trapped dust, and it goes cloudy too. So microbes are not made by the broth or by the air: they arrive on the dust. ----- */
const FLASK_LAB = (() => {
  const flame = x => '<g class="fk-flame"><path d="M' + x + ' 252q-15-15 0-32 4 9 7-1 13 17 0 33z" fill="#FF9A3D"/><path d="M' + x + ' 252q-7-8 0-16 6 8 0 16z" fill="#FFD23F"/></g>';
  const stand = x => '<path d="M' + (x - 34) + ' 252l8-30h52l8 30" fill="none" stroke="#5A678A" stroke-width="4" stroke-linejoin="round"/>';
  const broth = (x, cls, col, op) => '<path class="' + cls + '" d="M' + (x - 43.300) + ' 186a44 44 0 0 0 86.600 0z" fill="' + col + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
  const bubs = x => '<g class="fk-bub" fill="#fff" opacity=".9">' + [-18, -4, 10, 22].map((d, i) => '<circle cx="' + (x + d) + '" cy="212" r="' + (3 + i % 2) + '" style="animation-delay:-' + (i * .27) + 's"/>').join('') + '</g>';
  const steam = (x, y) => '<g class="fk-steam" fill="#fff">' + [0, 1, 2].map(i => '<circle cx="' + (x + (i - 1) * 6) + '" cy="' + y + '" r="6" style="animation-delay:-' + (i * .5) + 's"/>').join('') + '</g>';
  const mics = (x, cls) => '<g class="' + cls + '" fill="#3FA36B">' + [[-20, 200, 0], [6, 206, .8], [-6, 196, 1.6], [20, 198, 1.6], [-28, 192, 2.4], [14, 214, 2.4], [-12, 212, 2.4], [28, 190, 2.4], [0, 216, 3], [-22, 208, 3]].map(p => '<circle cx="' + (x + p[0]) + '" cy="' + p[1] + '" r="3.200" style="animation-delay:' + p[2] + 's"/>').join('') + '</g>';
  const lens = [[0, 0, 0], [12, 4, .8], [-10, 10, 1.6], [6, -12, 1.6], [-16, -6, 2.4], [18, -8, 2.4], [-4, -18, 2.4], [14, 16, 2.4]].map(p => '<g class="fk-m" style="animation-delay:' + p[2] + 's" transform="translate(' + p[0] + ' ' + p[1] + ')"><ellipse rx="6.500" ry="4" fill="#57BF7F" stroke="#2E7D4F" stroke-width="1.200"/><circle cx="-2" r="1" fill="#2E7D4F"/></g>').join('');
  const neckB = 'M270 138V98q0-26 26-26h8q26 0 26 26v24q0 16 15 16t15-16v-14';
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two glass flasks of broth on a bench, each over a burner. One has a straight neck. The other has a neck bent like a swan. Dust drifts down through the air">' +
    '<rect width="400" height="290" rx="14" fill="#EEF4FB"/><rect y="252" width="400" height="38" fill="#B98A4E"/><rect y="252" width="400" height="6" fill="#8A5A34"/>' +
    '<g class="fk-air" fill="#9AA3B5">' + [[30, 40], [70, 90], [150, 30], [190, 110], [220, 50], [320, 30], [380, 70], [160, 170], [200, 200], [384, 170]].map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.800" style="animation-delay:-' + (i * .6) + 's"/>').join('') + '</g>' +
    stand(104) + flame(104) + stand(270) + flame(270) +
    '<g class="fk-dustA" fill="#5A678A">' + [0, 1, 2, 3].map(i => '<circle cx="' + (100 + i * 3) + '" cy="24" r="2.400" style="animation-delay:-' + (i * .75) + 's"/>').join('') + '</g>' +
    '<rect x="92" y="62" width="24" height="80" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="3"/><circle cx="104" cy="178" r="44" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="3"/><rect x="93.500" y="130" width="21" height="14" fill="#EAF6FF"/>' +
    broth(104, 'fk-brothA', '#E9B95C') + broth(104, 'fk-murkA', '#8E8A5A') + mics(104, 'fk-micA') + bubs(104) + steam(104, 52) +
    '<g class="fk-B"><path d="' + neckB + '" fill="none" stroke="#1B2A4E" stroke-width="24" stroke-linecap="butt"/><path d="' + neckB + '" fill="none" stroke="#EAF6FF" stroke-width="18" stroke-linecap="butt"/><path class="fk-run" pathLength="1" d="' + neckB + '" fill="none" stroke="#E9B95C" stroke-width="13"/>' +
    '<g class="fk-dustB" fill="#5A678A">' + [0, 1, 2, 3].map(i => '<circle cx="' + (357 + i * 2) + '" cy="24" r="2.400" style="animation-delay:-' + (i * .75) + 's"/>').join('') + '</g>' +
    '<g class="fk-pile" fill="#5A678A"><circle cx="340" cy="141" r="2.600"/><circle cx="346" cy="143" r="2.600"/><circle cx="352" cy="141" r="2.600"/><circle cx="343" cy="138" r="2.200"/><circle cx="349" cy="138" r="2.200"/></g>' +
    '<circle cx="270" cy="178" r="44" fill="#EAF6FF" stroke="#1B2A4E" stroke-width="3"/><rect x="261.500" y="130" width="17" height="14" fill="#EAF6FF"/>' +
    '<g class="fk-liq">' + broth(270, 'fk-brothB', '#E9B95C') + broth(270, 'fk-murkB', '#8E8A5A') + mics(270, 'fk-micB') + '</g>' + bubs(270) + steam(360, 96) + '</g>' +
    '<path d="M70 168 52 132" stroke="#1B2A4E" stroke-width="2" stroke-dasharray="4 4"/><g class="fk-lens" transform="translate(40 96)"><path d="M24 26 44 50" stroke="#1B2A4E" stroke-width="7" stroke-linecap="round"/><circle r="36" fill="#FFF6D6" stroke="#1B2A4E" stroke-width="3"/>' + lens + '</g>' +
    '<g font-weight="700" text-anchor="middle"><text x="104" y="277" font-size="13" fill="#fff">straight neck</text><text x="270" y="277" font-size="13" fill="#fff">swan neck</text>' +
    '<rect x="128" y="8" width="170" height="32" rx="12" fill="#fff" stroke="#C9CEDA" stroke-width="2"/><text class="fk-t" x="213" y="30" font-size="14.500" fill="#1B2A4E">two flasks of broth</text></g></svg>';
})();
function flaskSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab flasklab fill', 'data-s': 'start', html: FLASK_LAB })); }
async function flaskSim(stage, ui) {
  flaskSetup(stage); const g = $('.lab', stage), T = t => () => { $('.fk-t', g).textContent = t; };
  ui.prompt('Two flasks of broth. Light the burners!', 'This is Louis Pasteur’s bench. Two glass flasks hold the same broth. One has a straight neck. The other has a long neck, bent like the neck of a swan. Air can get into both of them. Tap the button to light the burners.');
  await labStep(ui, g, 'Boil the broth', 'boil', 'Boiling kills every microbe in both flasks.', 'Pasteur boiled the broth in both flasks. Heat kills microbes, so now both flasks are clean. Steam rushes out through the necks.', T('boiling: 100 °C'));
  await labStep(ui, g, 'Wait three days', 'wait', 'Dust falls in. The straight-neck broth goes cloudy!', 'Now we wait. Air drifts into both flasks, and the air carries dust. Microbes ride on the dust. Down the straight neck, the dust falls right into the broth. Look in the magnifying glass. One microbe splits into two. Two split into four. Four into eight. Soon there are millions, and the broth goes cloudy and bad. In the swan neck, the dust is caught in the bend.', T('three days later'));
  await labStep(ui, g, 'Wait a year', 'year', 'A year on, the swan-neck broth is still clear.', 'A whole year later, the broth in the swan-neck flask is still clear. Air has reached it every single day. But the dust could not climb the bend. So the microbes do not come from the broth, and they do not come from the air alone. They come in on the dust.', T('one year later'));
  await labStep(ui, g, 'Tip the flask', 'tip', 'The broth touches the dust. Now it goes cloudy too!', 'Now Pasteur tipped the flask, so that the clean broth washed into the bend, touched the trapped dust, and ran back. A few days later, this broth was cloudy too. That proved it. Microbes do not appear from nothing. They are living things, and every one comes from another microbe.', T('three days after tipping'));
}
const YEAST_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#FFF6E6"/><rect x="0" y="146" width="320" height="24" rx="0" fill="#E9D3A8"/>' +
  '<path d="M134 60h22v20q0 8 10 14v52h-42V94q10-6 10-14z" fill="#DDF1FB" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/><path d="M125 112h40v33h-40z" fill="#E9C98A"/><g fill="#fff"><circle cx="134" cy="124" r="3"/><circle cx="148" cy="132" r="2.500"/><circle cx="156" cy="118" r="2.500"/><circle cx="140" cy="138" r="2"/></g>' +
  '<ellipse cx="145" cy="36" rx="26" ry="28" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="3"/><path d="M134 58h22v6h-22z" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="3"/><path d="M132 22q5-8 14-8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<g font-family="Fredoka,sans-serif" font-weight="700" font-size="14" fill="#1B2A4E"><text x="196" y="96">yeast</text><text x="196" y="116">sugar</text><text x="196" y="136">warm water</text></g><path d="M190 92l-22 22M190 112l-22 10M190 132l-22 0" stroke="#1B2A4E" stroke-width="2"/>' +
  '<g font-family="Fredoka,sans-serif" font-weight="700" font-size="14" fill="#8A5A34"><text x="36" y="40">gas from</text><text x="36" y="58">the yeast</text></g><path d="M96 44h18" stroke="#8A5A34" stroke-width="2.500"/></svg>' };

/* ----- the X-ray lab: a hand between a lamp and a screen. Torchlight is stopped by the whole hand: a shadow. X-rays (light with far more energy) pass through skin and muscle, and are stopped by bone, which is dense and full of calcium:
   so the bones show. Metal is denser still: a ring shows brightest. A crack in a bone shows as a dark line. ----- */
const XRAY_LAB = (() => {
  /* a hand, fingers up. kind: 'skin' (the hand itself), 'dark' (its shadow), 'bone' (its bones) */
  const fingers = [[70, 84, 152], [89, 70, 150], [108, 78, 152], [126, 100, 156]], seg = (x, y1, y2, w) => '<path d="M' + x + ' ' + y1 + 'V' + y2 + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  const skin = col => '<g fill="' + col + '"><rect x="58" y="146" width="80" height="92" rx="24"/>' + fingers.map(f => '<rect x="' + (f[0] - 8.500) + '" y="' + f[1] + '" width="17" height="' + (f[2] - f[1] + 20) + '" rx="8.500"/>').join('') + '<path d="M62 204q-22-12-30-40 8-10 18 0 8 18 20 22z"/><rect x="72" y="230" width="52" height="28" rx="8"/></g>';
  const bones = (col, crack) => '<g stroke="' + col + '" fill="none">' + fingers.map((f, i) => { const top = f[1] + 7, L = f[2] - top, a = top + L * .3, b = top + L * .64; return seg(f[0], top, a - 3, 6.500) + seg(f[0], a + 3, b - 3, 7) + seg(f[0], b + 3, f[2] + 2, 7.500) + ((crack && i === 1) ? '' : seg(f[0] + (99 - f[0]) * .12, f[2] + 12, 214 - i * 2, 8)); }).join('') +
    (crack ? '<path d="M90.200 162V182M91 190V210" stroke-width="8" stroke-linecap="round"/>' : '') + seg(40, 172, 176, 6.500) + '<path d="M44 184q8 14 20 20" stroke-width="7.500" stroke-linecap="round"/></g><g fill="' + col + '">' + [[78, 228], [91, 226], [104, 227], [116, 230], [84, 240], [98, 239], [111, 241]].map(p => '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="6" ry="5"/>').join('') + '</g>';
  const ring = cls => '<ellipse class="' + cls + '" cx="108" cy="132" rx="11" ry="5.500" fill="none" stroke-width="5"/>';
  const cracked = col => '<path d="M84 186l5 3-3 3 6 3" fill="none" stroke="' + col + '" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/>';
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A hand under a lamp, and beside it the picture the light makes on a screen">' +
    '<rect width="400" height="290" rx="14" fill="#2B3445"/>' +
    '<rect x="62" y="6" width="74" height="22" rx="8" fill="#9AA3B5" stroke="#1B2A4E" stroke-width="2"/><rect x="84" y="26" width="30" height="10" rx="3" fill="#5A678A"/>' +
    '<path class="xr-beamL" d="M86 36h26l62 230H24z" fill="#FFE98F"/><g class="xr-beamX" stroke="#C9BEFF" stroke-width="2.500" stroke-dasharray="7 7" stroke-linecap="round">' + [-48, -28, -10, 10, 28, 48].map(d => '<path d="M' + (99 + d * .2) + ' 38L' + (99 + d * 1.5) + ' 266"/>').join('') + '</g>' +
    '<g class="xr-skin">' + skin('#E0AC7E') + '</g><g class="xr-bones xr-whole">' + bones('#F6F8FC') + '</g><g class="xr-bones xr-broke">' + bones('#F6F8FC', true) + cracked('#F6F8FC') + '</g>' + ring('xr-ring').replace('fill="none"', 'fill="none" stroke="#FFC83D"') +
    '<circle class="xr-ouch" cx="90" cy="186" r="15" fill="none" stroke="#FF7A6B" stroke-width="3" stroke-dasharray="5 4"/>' +
    '<g transform="translate(214 30)"><rect x="-6" y="-6" width="182" height="244" rx="12" fill="#5A678A"/><rect class="xr-plate" width="170" height="232" rx="8" fill="#0E1422"/>' +
    '<g class="xr-shadow"><rect width="170" height="232" rx="8" fill="#FFF3C9"/><g transform="translate(6 -10) scale(.92)">' + skin('#1B2A4E') + '</g></g>' +
    '<g class="xr-film" transform="translate(6 -10) scale(.92)"><g opacity=".34">' + skin('#9AA3B5') + '</g><g class="xr-whole">' + bones('#fff') + '</g><g class="xr-broke">' + bones('#fff', true) + cracked('#fff') + '</g>' + ring('xr-fring').replace('fill="none"', 'fill="none" stroke="#fff"') + '<circle class="xr-ouch" cx="90" cy="186" r="15" fill="none" stroke="#FF7A6B" stroke-width="3" stroke-dasharray="5 4"/></g></g>' +
    '<g font-weight="700" text-anchor="middle"><text x="299" y="22" font-size="13" fill="#C9CEDA">the picture on the screen</text><rect x="8" y="254" width="186" height="28" rx="11" fill="#fff" opacity=".95"/><text class="xr-t" x="101" y="273" font-size="13.500" fill="#1B2A4E">the lamp is off</text></g></svg>';
})();
function xraySetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab xraylab fill', 'data-s': 'start', html: XRAY_LAB })); }
async function xraySim(stage, ui) {
  xraySetup(stage); const g = $('.lab', stage), T = t => () => { $('.xr-t', g).textContent = t; tone(t === 'torchlight' ? 520 : 880, .14, 'sine', .05); };
  ui.prompt('A hand, a lamp and a screen. Shine a torch first!', 'A hand is held under a lamp. Beside it is a screen, which shows the picture the light makes. First, try an ordinary torch. Tap the button.');
  await labStep(ui, g, 'Shine a torch', 'light', 'Torchlight cannot pass through a hand. It makes a shadow.', 'Torchlight cannot get through a hand. So the hand makes a dark shadow on the screen. We can see its shape, but nothing inside it.', T('torchlight'));
  await labStep(ui, g, 'Switch on the X-rays', 'xray', 'X-rays pass through skin. Bone stops them!', 'Now, X-rays. X-rays are a kind of light with far more energy, and our eyes cannot see them. They pass straight through skin and muscle. But bone is dense, and full of calcium, so bone stops them. On the screen, the bones show up white.', T('X-rays'));
  await labStep(ui, g, 'Put on a ring', 'ring', 'Metal stops X-rays too. The ring shows brightest.', 'Now a gold ring. Metal is even denser than bone, so it stops every X-ray. The ring shows up brightest of all.', T('X-rays, and a gold ring'));
  await labStep(ui, g, 'X-ray a sore hand', 'hurt', 'A crack in the bone! Now a doctor can mend it.', 'This hand is sore. The X-ray shows a crack in one of the bones, without anyone cutting the skin. In the First World War, a scientist called Marie Curie filled twenty vans with X-ray machines, and drove one herself. People called them little Curies. They helped doctors treat more than a million wounded soldiers. Too many X-rays can harm you, so the person working the machine stands behind a screen.', T('X-rays: a sore hand'));
}
const GLOW_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#2B3445"/><circle cx="196" cy="84" r="62" fill="#FF7A6B" opacity=".22"/><circle cx="196" cy="84" r="40" fill="#FF7A6B" opacity=".3"/>' +
  '<g fill="#F2853D" stroke="#B4561C" stroke-width="2"><rect x="168" y="34" width="20" height="70" rx="10"/><rect x="190" y="26" width="20" height="78" rx="10"/><rect x="212" y="36" width="20" height="68" rx="10"/><rect x="164" y="92" width="72" height="56" rx="20"/></g>' +
  '<g fill="#FFB199" opacity=".9"><rect x="172" y="38" width="6" height="56" rx="3"/><rect x="200" y="30" width="6" height="64" rx="3"/><rect x="222" y="40" width="6" height="54" rx="3"/></g>' +
  '<path d="M22 70h86l28-16v60l-28-16H22q-10 0-10-10V80q0-10 10-10z" fill="#9AA3B5" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/><path d="M136 62l26 14v16l-26 14z" fill="#FFE98F"/></svg>' };

/* ----- the balloon lab: Versailles, 19 September 1783. A fire heats the air inside the balloon; its particles move faster and spread out, and about a fifth of the air is pushed out of the bottom.
   The balloon now holds less air than the same space of cold air outside, so the heavier air around it pushes it up. When the air cools, it shrinks, more flows back in, and the balloon sinks.
   A cubic metre of air weighs about 1.2 kg at 20 degrees, 1.06 kg at 60 degrees and 0.95 kg at 100 degrees. ----- */
const BALLOON_LAB = (() => {
  const parts = [[-30, -22], [-8, -30], [18, -26], [32, -8], [-36, 4], [-14, -6], [8, -4], [26, 16], [-24, 24], [0, 20], [-6, 34], [16, 34], [-40, -12], [36, -30]].map((p, i) => '<circle class="bn-p' + (i > 10 ? ' bn-out' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="5" style="animation-delay:-' + (i * .13).toFixed(2) + 's"/>').join('');
  const tree = (x, y, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><rect x="-2.500" y="-14" width="5" height="14" fill="#8A5A34"/><circle cy="-22" r="12" fill="#3FA36B"/><circle cx="-4" cy="-26" r="6" fill="#57BF7F"/></g>';
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A blue and gold hot-air balloon with a sheep, a duck and a rooster in a cage under it, in front of a palace. A magnifying glass shows the air inside">' +
    '<defs><clipPath id="bnclip"><rect width="400" height="290" rx="14"/></clipPath></defs><g clip-path="url(#bnclip)"><rect width="400" height="290" fill="#CDEEFB"/><g class="bn-sky" fill="#fff" opacity=".9"><ellipse cx="60" cy="140" rx="34" ry="11"/><ellipse cx="86" cy="132" rx="22" ry="10"/><ellipse cx="330" cy="22" rx="30" ry="9"/></g>' +
    '<g class="bn-ground"><path d="M-20 240h860v180H-20z" fill="#8FD694"/><path d="M-20 240h860" stroke="#57B26A" stroke-width="6"/>' +
    '<g transform="translate(10 0)"><path d="M0 240v-34h96v34zM-6 206l14-16h80l14 16zM36 190l12-12 12 12z" fill="#E3D2B4" stroke="#B9A27A" stroke-width="2" stroke-linejoin="round"/><g fill="#8D86A8"><rect x="10" y="214" width="9" height="14"/><rect x="28" y="214" width="9" height="14"/><rect x="59" y="214" width="9" height="14"/><rect x="77" y="214" width="9" height="14"/><path d="M42 240v-16q6-6 12 0v16z"/></g></g>' +
    '<g fill="#5A678A">' + [118, 130, 304, 318, 334, 350].map(x => '<circle cx="' + x + '" cy="236" r="4.500"/><rect x="' + (x - 3.500) + '" y="240" width="7" height="9" rx="2"/>').join('') + '</g>' +
    tree(470, 240, 1.2) + tree(520, 240, 1) + tree(736, 240, 1.3) + tree(790, 240, 1) + '</g>' +
    '<g class="bn-fly"><g class="bn-rope" stroke="#8A5A34" stroke-width="2"><path d="M168 150 142 240M256 150l26 90"/></g>' +
    '<g transform="translate(138.400 46) scale(2.300)">' + BALLOON_IN + '</g>' +
    '<g class="bn-fire"><path d="M212 172q-14-14 0-31 3 9 7-1 12 17 0 32z" fill="#FF9A3D"/><path d="M212 172q-6-8 0-15 6 7 0 15z" fill="#FFD23F"/></g>' +
    '<path d="M196 189l-14 15M228 189l14 15" stroke="#8A5A34" stroke-width="2"/><rect x="176" y="204" width="72" height="32" rx="6" fill="#E9C98A" stroke="#8A5A34" stroke-width="2.500"/><path d="M188 204v32M200 204v32M212 204v32M224 204v32M236 204v32" stroke="#C9A25E" stroke-width="1.500"/>' +
    V.pic('ewe', 178, 206, 27) + V.pic('duck', 201, 210, 22) + V.pic('rooster', 220, 206, 27) + '</g>' +
    '<path d="M264 112l26-6" stroke="#1B2A4E" stroke-width="2" stroke-dasharray="4 4"/><g transform="translate(340 104)"><path d="M32 36 52 60" stroke="#1B2A4E" stroke-width="7" stroke-linecap="round"/><circle r="48" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><g class="bn-parts" fill="#5CC8D6" stroke="#2F8FA0" stroke-width="1.300" transform="scale(.9)">' + parts + '</g></g>' +
    '<text x="340" y="176" font-size="12" font-weight="700" text-anchor="middle" fill="#1B2A4E">the air inside</text>' +
    '<g font-weight="700"><rect x="8" y="8" width="134" height="52" rx="12" fill="#fff" opacity=".95"/><text x="17" y="27" font-size="11" fill="#5A678A">air inside the balloon</text><text class="bn-temp" x="17" y="49" font-size="18" fill="#1B2A4E">20 °C</text>' +
    '<rect x="8" y="66" width="134" height="42" rx="12" fill="#fff" opacity=".95"/><text x="17" y="83" font-size="9.800" fill="#5A678A">one cubic metre weighs</text><text class="bn-w" x="17" y="101" font-size="15" fill="#1B2A4E">1.2 kg</text>' +
    '<rect x="264" y="252" width="128" height="30" rx="12" fill="#fff" opacity=".95"/><text class="bn-h" x="328" y="272" font-size="14" text-anchor="middle" fill="#1B2A4E">on the ground</text></g></g></svg>';
})();
function balloonSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab balloonlab fill', 'data-s': 'start', html: BALLOON_LAB })); }
async function balloonSim(stage, ui) {
  balloonSetup(stage); const g = $('.lab', stage), T = (t, w, hh) => () => { $('.bn-temp', g).textContent = t; $('.bn-w', g).textContent = w; $('.bn-h', g).textContent = hh; };
  ui.prompt('The first balloon, in 1783. Light the fire!', 'It is the year 1783, at the palace of Versailles. Two brothers, the Montgolfiers, have made a huge balloon of cloth and paper. In the basket are a sheep, a duck and a rooster. The magnifying glass shows the air inside the balloon. Tap the button to light the fire.');
  await labStep(ui, g, 'Light the fire', 'fire', 'The air inside warms up. Its particles speed up.', 'The brothers light a fire of straw and wool. It heats the air inside the balloon. Look in the magnifying glass. Hot particles move faster, and bump each other further apart.', T('60 °C', '1.06 kg', 'on the ground'));
  await labStep(ui, g, 'Make it hotter', 'hot', 'The air spreads out. Some is pushed out. It is lighter!', 'Hotter still: 100 degrees. The air has spread out so much that about one fifth of it has been pushed out through the hole at the bottom. The balloon now holds less air than before, so it weighs less. A cubic metre of cold air weighs 1.2 kilograms. Hot, it weighs only 0.95.', T('100 °C', '0.95 kg', 'pulling at the ropes'));
  await labStep(ui, g, 'Let go of the ropes', 'up', 'Up it goes! The heavier cold air pushes it up.', 'The cold air outside is heavier. It sinks under the balloon, and pushes it up, the way water pushes up a cork. Up they go: a sheep, a duck and a rooster, the first passengers ever to fly, 500 metres above the palace. The King and Queen of France are watching.', T('100 °C', '0.95 kg', '500 m up'));
  await labStep(ui, g, 'Let the air cool', 'cool', 'The air cools and shrinks. Down they float, safe.', 'Now the fire is out. The air inside cools. Its particles slow down and crowd together, and cold air flows back in at the bottom. The balloon gets heavier, and floats gently down. After eight minutes it landed, three kilometres away. The sheep, the duck and the rooster were all safe. Two months later, two men flew over Paris.', T('30 °C', '1.16 kg', 'landed, 3 km away'));
}
const BOTTLE_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#E6F6FD"/>' +
  [70, 230].map((x, i) => '<path d="M' + (x - 44) + ' 110h88l-8 44h-72z" fill="' + (i ? '#FFD9D0' : '#D6ECFB') + '" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/><path d="M' + (x - 9) + ' 70h18v18q0 6 9 10v44h-36V98q9-4 9-10z" fill="#DDF1FB" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/>' +
    (i ? '<ellipse cx="' + x + '" cy="42" rx="24" ry="28" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="3"/><path d="M' + (x - 10) + ' 28q4-7 12-7" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M' + (x - 8) + ' 68h16v5h-16z" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="2.500"/>'
      : '<path d="M' + (x - 8) + ' 70q-10-4-6 10 4 6 14 2z" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="2.500" stroke-linejoin="round"/>') +
    '<text x="' + x + '" y="166.500" font-size="12" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">' + (i ? 'hot water' : 'cold water') + '</text>').join('') +
  '<path d="M132 96h44m-12-9 13 9-13 9" stroke="#8B7BEA" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' };

/* ----- Braille: reading with your fingertips. Louis Braille, a blind French boy, showed his code of raised dots at 15. Each letter is a pattern in a cell of six dots: 1, 2, 3 down the left, 4, 5, 6 down the right.
   The code has a rule: a to j use only the top four dots; k to t are the same ten with dot 3 added; u, v, x, y and z add dots 3 and 6. (French had no w in 1829: it was added later, as j with dot 6.) ----- */
const BRL = { a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5] };
'klmnopqrst'.split('').forEach((c, i) => { BRL[c] = BRL['abcdefghij'[i]].concat(3); }); 'uvxyz'.split('').forEach((c, i) => { BRL[c] = BRL['abcde'[i]].concat(3, 6); }); BRL.w = [2, 4, 5, 6];
const brlSvg = ch => { const on = BRL[ch] || []; let s = ''; for (let d = 1; d <= 6; d++) { const x = d <= 3 ? 12 : 30, y = 11 + ((d - 1) % 3) * 17; s += on.includes(d) ? '<circle cx="' + x + '" cy="' + y + '" r="6.500" fill="#1B2A4E"/>' : '<circle cx="' + x + '" cy="' + y + '" r="3.500" fill="none" stroke="#B9C0D0" stroke-width="1.500"/>'; }
  return '<svg viewBox="0 0 42 56" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>'; };
const brlArt = ch => ({ svg: brlSvg(ch) });
const brlName = name => { const s = String(name).toLowerCase(); return s.length >= 2 && s.length <= 8 && s.split('').every(c => BRL[c]) ? s : null; };
/* [word, picture]. Level 1 uses only a to j; Level 2 adds k to t; Level 3 uses any letter. English words only: the English narrator says them, and a French word is only ever said by the French voice */
const BWORDS = {
  1: [['bee', 'honeybee'], ['bed', 'bed'], ['egg', 'egg'], ['ice', 'ice'], ['bag', 'handbag'], ['face', 'grinning-face'], ['dice', 'game-die'], ['beach', 'beach-with-umbrella'], ['chef', 'cook']],
  2: [['cat', 'cat'], ['dog', 'dog'], ['star', 'star'], ['moon', 'crescent-moon'], ['tree', 'deciduous-tree'], ['train', 'locomotive'], ['rocket', 'rocket'], ['goat', 'goat'], ['lion', 'lion'], ['ship', 'ship'], ['kite', 'kite'], ['milk', 'glass-of-milk']],
  3: [['fox', 'fox'], ['zebra', 'zebra'], ['music', 'musical-note'], ['snow', 'snowflake'], ['crown', 'crown'], ['tower', TOWER_ART], ['window', 'window'], ['pizza', 'pizza'], ['puzzle', 'puzzle-piece']]
};
function brailleItem(word, pool) {
  const w = word[0], chars = w.split(''), uniq = chars.filter((c, i) => chars.indexOf(c) === i), all = Object.keys(BRL);
  const keyChars = uniq.concat(shuffle(all.filter(c => !uniq.includes(c))).slice(0, Math.max(3, 8 - uniq.length))).sort();
  const gw = 'min(5.2rem,14vmin,' + (76 / chars.length).toFixed(1) + 'vmin)';
  const view = (hi, known) => el => { el.innerHTML = ''; el.append(h('div', { class: 'codewrap' },
    h('div', { class: 'glyphs' }, chars.map(c => h('div', { class: 'glyph brl' + (hi === c ? ' hi' : ''), style: { '--gw': gw } }, h('span', { class: 'bcl', html: brlSvg(c) }), h('small', null, known.includes(c) ? c : '')))),
    h('div', { class: 'key brl' }, keyChars.map(c => h('div', { class: 'k' }, h('span', { class: 'bcl', html: brlSvg(c) }), '= ' + c))))); };
  const same = pool.filter(x => x[0] !== w && x[0].length === w.length), others = shuffle(same.length >= 2 ? same : pool.filter(x => x[0] !== w)).slice(0, 2), opts = shuffle([word].concat(others));
  const steps = uniq.map((c, i) => { const ls = shuffle([c].concat(shuffle(keyChars.filter(x => x !== c)).slice(0, 2)));
    return { type: 'choice', text: 'Find these dots in the key. Which letter?', say: 'Look at the key. Find the pattern of dots with the purple ring. Which letter is it?', options: ls.map(x => ({ label: x })), answer: ls.indexOf(c), visual: view(c, uniq.slice(0, i)), nudge: 'Not that one. Find the same dots in the key.' }; });
  return { type: 'choice', text: 'Read the Braille dots. Which word?', say: 'This is Braille, the writing that blind people read with their fingertips. Each box of dots is one letter. The big dots are the raised ones. Use the key to read the word. Which word is it?', options: opts.map(x => ({ label: x[0] })), answer: opts.indexOf(word), visual: view(null, []), visualDone: view(null, uniq), steps,
    explain: { text: 'The dots spell ' + chars.join('-') + ': ' + w + '.', say: 'The dots spell ' + w + '.', pic: word[1] } };
}
SKILLS.braille = { name: 'Reading Braille', strand: 'patterns', start: 1, max: 3,
  gen(lv, ctx) { ctx = ctx || {}; const pool = BWORDS[clamp(lv, 1, 3)], used = ctx.used || (ctx.used = {}), free = pool.filter(x => !used['br' + x[0]]), w = pick(free.length ? free : pool); used['br' + w[0]] = 1; return brailleItem(w, pool); } };

/* ----- the Braille lab (Tony, 8 October: "how does the whole alphabet work? are there any particular rules to help learn? why is this related to this country?").
   Why France: Louis Braille was French (born 1809 at Coupvray, near Paris; blind by five after an accident with an awl in his father's workshop). At the Royal Institute for Blind Youth in Paris,
   Charles Barbier's code of up to twelve raised dots was too hard to feel, so Louis made a cell of six; he had it worked out at fifteen, and published it in 1829 (Wikipedia, "Louis Braille").
   The rule that makes it learnable: a to j use only the top four dots; k to t are a to j plus dot 3; u, v, x, y, z are a to e plus dots 3 and 6; w, which French hardly used in 1829, was added later as j plus dot 6.
   The lab builds the alphabet one row at a time, so she can see each row made from the one above it. ----- */
const BRL_LAB = (() => {
  const mini = (ch, x, y, extra, col) => { const on = BRL[ch]; let s = '<g class="bl-c" transform="translate(' + x + ' ' + y + ')"><rect x="-9.500" y="-6" width="19" height="34" rx="5" fill="#fff" stroke="#E3C891" stroke-width="1.200"/>';
    for (let d = 1; d <= 6; d++) { const dx = d <= 3 ? -4.200 : 4.200, dy = ((d - 1) % 3) * 9; s += on.includes(d) ? '<circle cx="' + dx + '" cy="' + dy + '" r="3.200" fill="' + (extra.includes(d) ? col : '#1B2A4E') + '"/>' : '<circle cx="' + dx + '" cy="' + dy + '" r="1.500" fill="#C9CEDA"/>'; }
    return s + '<text y="44" font-size="13" font-weight="700" text-anchor="middle" fill="#1B2A4E">' + ch + '</text></g>'; };
  const row = (letters, y, extra, col, cls) => '<g class="bl-row ' + cls + '">' + letters.split('').map((c, i) => '<g style="--i:' + i + '">' + mini(c, 140 + i * 25.6, y, extra, col) + '</g>').join('') + '</g>';
  const big = [[1, 46, 44], [2, 46, 82], [3, 46, 120], [4, 86, 44], [5, 86, 82], [6, 86, 120]].map(d => '<g class="bl-d bl-d' + d[0] + '"><circle cx="' + d[1] + '" cy="' + d[2] + '" r="14"/><text x="' + d[1] + '" y="' + (d[2] + 5) + '" font-size="13" font-weight="700" text-anchor="middle">' + d[0] + '</text></g>').join('');
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One Braille cell of six numbered dots, and the Braille alphabet built row by row: a to j, then k to t with dot 3 added, then u to z with dots 3 and 6 added">' +
    '<rect width="400" height="290" rx="14" fill="#FFF6E2"/><rect x="10" y="10" width="112" height="156" rx="14" fill="#fff" stroke="#E3C891" stroke-width="2"/><rect class="bl-top" x="24" y="22" width="84" height="80" rx="12" fill="#FFE9A8"/>' + big +
    '<text x="66" y="154" font-size="12" font-weight="700" text-anchor="middle" fill="#5A678A">one cell, six dots</text>' +
    '<g font-weight="700"><rect x="130" y="10" width="260" height="70" rx="14" fill="#fff" stroke="#E3C891" stroke-width="2"/><g transform="translate(150 22)"><rect width="34" height="46" rx="4" fill="#3B6FD4"/><rect x="11" width="12" height="46" fill="#fff"/><rect x="23" width="11" height="46" rx="0" fill="#E5484D"/><rect width="34" height="46" rx="4" fill="none" stroke="#C9CEDA" stroke-width="1.500"/></g>' +
    '<text x="198" y="38" font-size="15" fill="#1B2A4E">Louis Braille, France</text><text x="198" y="57" font-size="12" fill="#5A678A">worked it out at 15</text><text x="198" y="72" font-size="12" fill="#5A678A">and shared it in 1829</text></g>' +
    row('abcdefghij', 102, [], '', 'bl-r1') + row('klmnopqrst', 162, [3], '#F2853D', 'bl-r2') + row('uvxyz', 222, [3, 6], '#F2853D', 'bl-r3') +
    '<g class="bl-row bl-w"><g style="--i:0">' + mini('w', 140 + 6.4 * 25.6, 222, [6], '#8B5CF6') + '</g><text x="' + (140 + 6.4 * 25.6 + 46) + '" y="244" font-size="12" font-weight="700" text-anchor="middle" fill="#8B5CF6">added later</text></g>' +
    '<g class="bl-tag2"><rect x="10" y="176" width="112" height="44" rx="12" fill="#FFE4CC"/><text x="66" y="203" font-size="13" font-weight="700" text-anchor="middle" fill="#B5531B">+ dot 3</text></g>' +
    '<g class="bl-tag3"><rect x="10" y="230" width="112" height="44" rx="12" fill="#FFE4CC"/><text x="66" y="257" font-size="13" font-weight="700" text-anchor="middle" fill="#B5531B">+ dots 3 and 6</text></g></svg>';
})();
const EGGBOX_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#FFF6E2"/><rect x="104" y="10" width="112" height="150" rx="16" fill="#D9C3A0" stroke="#A88B62" stroke-width="3"/>' +
  [[134, 40, 1], [186, 40, 1], [134, 85, 1], [186, 85, 0], [134, 130, 0], [186, 130, 0]].map(c => '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="21" ry="18" fill="#C4A97F" stroke="#A88B62" stroke-width="2"/>' + (c[2] ? '<circle cx="' + c[0] + '" cy="' + (c[1] - 3) + '" r="13" fill="#E5484D"/><circle cx="' + (c[0] - 4) + '" cy="' + (c[1] - 7) + '" r="4" fill="#FF9A8C"/>' : '')).join('') +
  '<text x="262" y="96" font-size="44" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">f</text><path d="M232 86h-8" stroke="#1B2A4E" stroke-width="3" stroke-linecap="round"/></svg>' };
function brSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab brlab fill', 'data-s': 'start', html: BRL_LAB })); }
async function brSim(stage, ui) {
  brSetup(stage); const g = $('.lab', stage);
  ui.prompt('Braille: letters you read with your fingertips.', 'Louis Braille was born in France, in 1809. When he was three, an accident in his father’s workshop hurt his eyes, and by five he was blind. At his school for blind children in Paris, a man called Charles Barbier showed them a code of raised dots, up to twelve for each sound. It was too hard to feel. So Louis made it simpler: every letter fits in a cell of just six dots, two across and three down. He had it worked out when he was fifteen. The dots are numbered: one, two, three down the left, and four, five, six down the right. Tap the button to see the first ten letters.');
  await labStep(ui, g, 'Show a to j', 'ten', 'a to j use only the top four dots.', 'Here are the first ten letters, a to j. They only ever use the top four dots: one, two, four and five. Learn these ten, and you can work out almost the whole alphabet, because the rest are made from them.');
  await labStep(ui, g, 'Add dot 3', 'add3', 'k to t: the same ten, plus dot 3.', 'Now the next row. k is a, with dot three added, at the bottom left. l is b, plus dot three. m is c, plus dot three. All the way to t, which is j plus dot three. The same ten patterns, each with one more dot.');
  await labStep(ui, g, 'Add dots 3 and 6', 'add36', 'u, v, x, y, z: a to e, plus 3 and 6.', 'The last row is a to e again, with both bottom dots added: three and six. That makes u, v, x, y and z.');
  await labStep(ui, g, 'Find the w', 'w', 'w is the odd one. French had no w then!', 'Did you notice that w was missing? French hardly used the letter w in 1829, when Louis shared his code, so he left it out. It was added later, as j with dot six. It is the only letter that breaks the rule. Today, Braille is read all over the world, in almost every language.');
}

/* ----- the race, the coding look, and things to count ----- */
const RACE = { me: TORTOISE_ART, rival: HARE_ART, rivalName: 'hare', track: 10,
  intro: { text: 'You are the tortoise. Answer fast to beat the hare!', say: 'Long ago, a French poet called La Fontaine told the story of the hare and the tortoise. Now it is your race. You are the tortoise. Each card has a sum, and four answers. Tap the right answer, and the tortoise takes a step. The hare runs at a steady speed, and he never stops. If you get one wrong, you have one more try. Reach the flag before the hare, and you move up a level. Press Go when you are ready!' },
  win: { text: 'You beat the hare to the flag!', say: 'You beat the hare to the flag! In the story, the tortoise won because she never stopped. So did you.' },
  lose: { text: 'The hare got there first this time.', say: 'The hare got there first this time. Quick answers will catch him.' } };
const MEADOW = { mover: TORTOISE_ART, goal: 'chequered-flag', goalName: 'flag', flag: 'glowing-star', flagName: 'star', rock: HEDGE_ART, cls: 'meadow' };
GRAPH_SETS.france = { noun: 'cakes', one: 'cake', items: [{ name: 'croissants', art: 'croissant' }, { name: 'baguettes', art: 'baguette-bread' }, { name: 'cupcakes', art: 'cupcake' }, { name: 'cookies', art: 'cookie' }, { name: 'doughnuts', art: 'doughnut' }] };
THING_NAMES.croissant = 'croissants';

COUNTRIES.france = {
  cheers: ['Très bien!', 'Bravo!'],     /* "very good" and "well done", used only here */
  ladders: ['race'],                    /* her race level keeps its own progress; a country reset puts it back to the start */
  name: 'France', hello: 'Bonjour! Start with Paris maths.', helloSay: [FR('bonjour', BONJOUR), 'Start with Paris maths.'], scene: FR_SCENE,
  thing: 'croissant', boat: 'sailboat',
  videos: {
    vaccine: { yt: 'rb7TVW77ZCs', title: 'How do vaccines work?', by: 'TED-Ed', icon: 'syringe' },
    curie: { yt: 'w6JFRi0Qm_s', title: 'The genius of Marie Curie', by: 'TED-Ed', icon: 'woman-scientist' },
    xray: { yt: 'gsV7SJDDCY4', title: 'How X-rays see through your skin', by: 'TED-Ed', icon: 'x-ray' },
    metric: { yt: '7bUVjJWA6Vw', title: 'Why the metric system matters', by: 'TED-Ed', icon: 'straight-ruler' }
  },
  souvenirs: [
    { id: 'fr-tower', art: TOWER_ART, name: 'Eiffel Tower', price: 30, need: 'm1' }, { id: 'fr-croissant', art: 'croissant', name: 'Croissant', price: 15, need: 'm1' },
    { id: 'fr-flask', art: FLASK_ART, name: 'Pasteur’s flask', price: 25, need: 'm2' }, { id: 'fr-xray', art: 'x-ray', name: 'X-ray picture', price: 25, need: 'm2' },
    { id: 'fr-balloon', art: BALLOON_ART, move: 'float', name: 'Hot-air balloon', price: 30, need: 'm3' }, { id: 'fr-rooster', art: ROOSTER_ART, move: 'flap', head: [72, 12, 34], name: 'Rooster', price: 25, need: 'm3' },
    { id: 'fr-hare', art: HARE_ART, move: 'hop', head: [77, 30, 32], name: 'Hare', price: 25, need: 'm4' }, { id: 'fr-tortoise', art: TORTOISE_ART, move: 'crawl', head: [86, 34, 28], name: 'Champion tortoise', price: 40, need: 'boss' }
  ],
  themes: { paris: { name: 'Paris room', price: 40, need: 'boss', wall: '#EDE7F8', wall2: '#DDD3F0', floor: '#C99A6B', line: '#A9743F', rug: '#C0392B', sky: ['#8CC8EE', '#FFE2CC'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['vaccine'] }, { id: 'v2', after: ['boss'], choose: ['curie', 'xray', 'metric'] }],
  path: [
    { m: 'm1', x: 10, y: 62, px: 28, py: 17 }, { m: 'm2', x: 24, y: 40, px: 70, py: 27 }, { video: 'v1', x: 38, y: 62, px: 30, py: 38 },
    { m: 'm3', x: 52, y: 40, px: 70, py: 49 }, { m: 'm4', x: 60, y: 66, px: 30, py: 60 }, { m: 'boss', x: 82, y: 62, px: 70, py: 71 }, { video: 'v2', x: 92, y: 38, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Paris maths', icon: TOWER_ART, sticker: 'croissant',
      intro: { text: 'Measure with a ruler. Then try your luck with macarons!', say: [FR('bonjour', BONJOUR), 'Welcome to France! The French invented the metre, the kilogram and the litre, which the whole world now measures with. First, measure some things with a ruler. Then try your luck with a box of macarons.'] },
      rounds: [{ skill: 'measure' }, { skill: 'chance' }, { skill: 'measure' }, { skill: '@review', or: 'money' }, { skill: 'chance' }, { skill: 'measure' }, { skill: '@review', or: 'angles' }, { skill: 'chance' }] },
    { id: 'm2', name: 'Paris lab', icon: FLASK_ART, sticker: 'microbe',
      intro: { text: 'Where do germs come from? And how can we see bones?', say: 'Two of the greatest scientists in history worked in Paris: Louis Pasteur, and Marie Curie. Their discoveries have saved millions of lives. Today you run their experiments. First: where do germs come from?' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on Pasteur’s bench.', say: 'This is Louis Pasteur’s bench. Put each name on the right thing.', board: BENCH_BOARD, items: BENCH_ITEMS, done: { text: 'The bench is ready. Now, the experiment!' } },
        { act: 'predict', q: 'Both flasks are open to the air. Which goes bad?', qsay: 'Here is an experiment. In Pasteur’s day, people believed that microbes simply grew out of broth, from nothing. Pasteur boiled the same broth in two flasks. Both are open to the air. One has a straight neck, and one has a neck bent like a swan’s. Which broth do you think will go bad? Make a prediction.',
          options: [O('The straight neck', FLASK_OPEN_ART), O('The swan neck', FLASK_ART), O('Both of them', 'balance-scale')], answer: 0, setup: flaskSetup, sim: flaskSim,
          right: 'You predicted it! Dust carried the microbes in.', wrong: 'Surprise! Only the straight neck let the dust in.',
          tryit: { icon: 'bread', pic: YEAST_PIC, big: 'Wake up some yeast!', text: 'Yeast, sugar and warm water. Watch the balloon!', say: 'Now try it, with a grown-up. Yeast is a helpful microbe, the one that makes bread rise. Put a spoon of yeast and a spoon of sugar into a bottle of warm water. Stretch a balloon over the top. Wait twenty minutes. The yeast eats the sugar and makes a gas, and the gas blows up the balloon. Pasteur was the first to show that yeast is alive.' } },
        { skill: 'germs' },
        { act: 'sort', even: true, text: 'Does this microbe help us, or make us ill?', say: 'Most microbes do us no harm at all, and some are a great help. Does this one help us, or make us ill?', bins: [{ label: 'Helps us', icon: 'thumbs-up' }, { label: 'Makes us ill', icon: 'face-with-thermometer' }],
          items: [{ icon: 'bread', label: 'Yeast in bread', bin: 0, why: 'Yeast makes gas bubbles, so bread rises.' }, { icon: 'sneezing-face', label: 'A flu virus', bin: 1, why: 'The flu virus gives you a fever and aches.' }, { icon: 'glass-of-milk', label: 'Yoghurt bacteria', bin: 0, why: 'Good bacteria turn milk into yoghurt.' },
            { icon: 'adhesive-bandage', label: 'Bacteria in a cut', bin: 1, why: 'Bacteria in a cut can make it sore and red.' }, { icon: 'cheese-wedge', label: 'Mould in blue cheese', bin: 0, why: 'A mould gives blue cheese its taste.' }],
          done: { text: 'Most microbes are harmless. Many help us!' } },
        { skill: 'germs' },
        { act: 'order', text: 'How a vaccine works. Tap in order.', say: 'In 1885, a boy of nine called Joseph Meister was bitten by a dog with a deadly disease called rabies. Louis Pasteur gave him a new vaccine, and Joseph lived. How does a vaccine work? Tap the steps in order.',
          steps: [{ icon: 'syringe', label: 'Vaccine goes in', say: 'First, the vaccine goes in: a harmless piece of the germ.' }, { icon: 'microscope', label: 'Body studies it', say: 'Your body studies the piece, and learns its shape.' }, { icon: 'shield', label: 'It makes antibodies', say: 'It makes antibodies: defenders shaped to catch that germ.' }, { icon: 'flexed-biceps', label: 'Real germ is beaten', say: 'The real germ comes. Your body knows it, and wins.' }],
          hints: ['Start with the vaccine going in.', 'Next, your body looks at the harmless piece.', 'Then it makes defenders shaped to catch that germ.', 'Last, the real germ arrives, and loses.'] },
        { act: 'predict', q: 'X-rays shine through a hand. What shows up?', qsay: 'Here is another experiment. Marie Curie came to Paris from Poland, and became the first person to win two Nobel Prizes. She worked with rays that can pass through things. What do you think will show up on the screen, when X-rays shine through a hand? Make a prediction.',
          options: [O('The bones', 'bone'), O('The skin', 'raised-hand'), O('Nothing at all', 'cross-mark')], answer: 0, setup: xraySetup, sim: xraySim,
          right: 'You predicted it! Bone stops the X-rays.', wrong: 'Surprise! X-rays go through skin. Bone stops them.',
          tryit: { icon: 'flashlight', pic: GLOW_PIC, big: 'Glowing fingers!', text: 'In a dark room, hold a torch behind your fingers.', say: 'Now try it. In a dark room, press a torch against your fingertips. They glow red. A little torchlight does get through thin skin. But to see your bones, you need X-rays.' } },
        { skill: 'xray' }, { skill: 'xray' }] },
    { id: 'm3', name: 'Bonjour!', nameSay: FR('bonjour', BONJOUR, true), icon: ROOSTER_ART, sticker: 'rooster',
      intro: { text: 'Find France, speak French, and fly the first balloon!', say: 'Time to find France on the map, learn some French words, and fly the very first hot-air balloon.' },
      rounds: [
        { act: 'findmap', text: 'Where is France? Tap it.', say: 'This is the west of Europe. Where is France? Tap it.', view: [466, 104, 96, 84], targets: ['250', '724', '276', '380', '826'], answer: '250',
          hint: { text: 'France has six sides. It lies between Spain and Germany.' }, done: { text: 'You found France! The French call it the Hexagon.', say: 'You found France! It has six sides, so the French call it the Hexagon. It is the biggest country in the west of Europe, with a sea on three of its sides.' } },
        { act: 'meet', text: 'Tap each card to hear French.', say: 'People in France speak French. Tap each card to hear the word.', lang: 'fr', words: FRENCH },
        { skill: 'french' }, { skill: 'french' },
        { act: 'predict', q: 'Heat the air in a balloon. The air inside gets…', qsay: 'Here is an experiment. Two French brothers noticed that smoke from a fire floats upwards. They wondered: could a bag of hot air lift something? If we heat the air inside a balloon, what do you think happens to that air? Make a prediction.',
          options: [O('Lighter', 'feather'), O('Heavier', 'rock'), O('No different', 'balance-scale')], answer: 0, setup: balloonSetup, sim: balloonSim,
          right: 'You predicted it! Hot air spreads out, so it is lighter.', wrong: 'Surprise! Hot air spreads out, so it is lighter.',
          tryit: { icon: 'balloon', pic: BOTTLE_PIC, big: 'Heat a balloon!', text: 'A balloon on a bottle. Stand it in hot water.', say: 'Now try it, with a grown-up. Stretch a balloon over the top of an empty bottle. Stand the bottle in a bowl of hot tap water. The air inside warms up and spreads out, and the balloon starts to fill. Then stand it in cold water, and watch it shrink.' } },
        { skill: 'hotair' }, { skill: 'hotair' },
        { act: 'match', text: 'Match each one to its fact.', pairs: [
          { a: { art: TOWER_ART, label: 'Eiffel Tower' }, b: { art: 'straight-ruler', label: '330 metres tall' }, text: 'The Eiffel Tower is 330 metres tall: 18,038 pieces of iron.' },
          { a: { art: METRE_ART, label: 'The metre' }, b: { art: 'globe-showing-europe-africa', label: 'Measured from Earth' }, text: 'Ten million metres reach from the North Pole to the Equator.' },
          { a: { art: 'baguette-bread', label: 'Baguette' }, b: { art: 'microbe', label: 'Raised by yeast' }, text: 'Yeast, a microbe, fills a baguette with bubbles of gas.' },
          { a: { art: ROOSTER_ART, label: 'Rooster' }, b: { art: BALLOON_ART, label: 'Flew in 1783' }, text: 'A rooster flew in the first balloon. He stands for France.' }] },
        { skill: 'french' }, { skill: 'hotair' }] },
    { id: 'm4', name: 'Race and code', icon: HARE_ART, sticker: 'turtle',
      intro: { text: 'Race the hare. Read with dots. Code the tortoise!', say: 'Today you race a hare, read the writing that a French boy invented for blind people, and code a tortoise to the finish line.' },
      rounds: [
        { skill: 'scithink' },      /* the three scientist ideas look back at all three labs, so they are asked only once she has done them all */
        { act: 'race', me: RACE.me, rival: RACE.rival, rivalName: RACE.rivalName, track: RACE.track, intro: RACE.intro, win: RACE.win, lose: RACE.lose },
        { act: 'predict', q: 'k is the letter a, with one more dot. Where?', qsay: 'Here is a puzzle. In Braille, the letter a is one raised dot, at the top left. The letter k is the letter a, with one more dot added. Where do you think the new dot goes? Make a prediction.',
          options: [O('Bottom left', brlArt('k')), O('Top right', brlArt('c')), O('Middle right', brlArt('e'))], answer: 0, setup: brSetup, sim: brSim,
          right: 'You predicted it! k is a, plus dot 3.', wrong: 'Surprise! k is a, plus dot 3, at the bottom left.',
          tryit: { icon: 'egg', pic: EGGBOX_PIC, big: 'Make a Braille cell!', text: 'Six cups of an egg box. Fill some. Read them!', say: 'Now make your own, with a grown-up. Cut an egg box down to six cups: two across, and three down. Put a ball or a pom-pom in some of the cups, to make the raised dots. This one is f: dots one, two and four. Make a, then b, then k. Close your eyes, and read them with your fingertips.' } },
        { skill: 'braille' }, { skill: 'braille' },
        { skill: 'braille', fixed: () => { const nm = brlName(S.name), pool = BWORDS[2].concat(BWORDS[1]);
          const it = brailleItem(nm ? [nm, 'star-struck'] : BWORDS[2][0], nm ? pool.concat([[nm, 'star-struck']]) : BWORDS[2]); it.text = 'One more word. Read it!';
          if (nm) it.explain = { text: 'The dots spell ' + nm.split('').join('-') + '. That is you!', say: 'The dots spell ' + S.name + '. That is you!', pic: 'star-struck' }; return it; } },
        { act: 'code', look: MEADOW, text: 'Code the tortoise to the flag.', say: 'The tortoise needs your help to find the way. Count the squares to the flag. Tap or drag arrows into the boxes to make a path past the hedges. Then tap Go.', cols: 5, rows: 3, start: [0, 0], goal: [4, 2], rocks: [[1, 0], [2, 2], [4, 1]], slots: 7,
          path: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2], [4, 2]], legs: [[0, 1], [3, 1], [3, 2], [4, 2]], solution: [['d'], ['r'], ['r'], ['r'], ['d'], ['r']] },
        { act: 'code', look: MEADOW, text: 'Steer round the hedges!', say: 'This one is longer. Steer the tortoise round the hedges.', cols: 5, rows: 4, start: [0, 3], goal: [4, 0], rocks: [[0, 2], [2, 2], [2, 0], [4, 1], [3, 3]], slots: 9,
          path: [[0, 3], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [3, 0], [4, 0]], legs: [[1, 3], [1, 1], [3, 1], [3, 0], [4, 0]], solution: [['r'], ['u'], ['u'], ['r'], ['r'], ['u'], ['r']] },
        { act: 'code', look: MEADOW, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long way, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 0], goal: [5, 4], rocks: [[3, 0], [1, 2], [4, 2], [3, 4], [0, 3]], slots: 4, repeat: true,
          path: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [3, 3], [4, 3], [5, 3], [5, 4]], legs: [[2, 0], [2, 3], [5, 3], [5, 4]], solution: [['r', 2], ['d', 3], ['r', 3], ['d', 1]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'trophy',
      intro: { text: 'Show everything you know about France!', say: 'The big one! Show everything you have learned in France.' },
      rounds: [{ skill: 'measure' }, { skill: 'germs' }, { skill: 'chance' }, { skill: 'hotair' }, { skill: 'french' }, { skill: 'xray' }, { act: 'race', me: RACE.me, rival: RACE.rival, rivalName: RACE.rivalName, track: RACE.track, intro: RACE.intro, win: RACE.win, lose: RACE.lose }, { skill: 'braille' }, { skill: 'scithink' }, { skill: '@review', or: 'money' }, { skill: '@review', or: 'angles' }] }
  ]
};
W.labs = Object.assign(W.labs || {}, { braille: brSetup });
