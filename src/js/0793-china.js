/* ===== China: the ninth country. Only its first mission is built so far: Tony asked on 4 October to plan the whole country and build "Dragon maths" first.
   The other four missions are planned (see the plan, and the "soon" stops on the path below) and wait for his word. Everything here is content, not code.
   (B64, G_EYE, PANDA_IN, the ratio skill and its picture, the magic square and the race come from the earlier files.)
   Dragon maths: ratio and scaling (a new levelled skill), the Lo Shu magic square, and the flashcard race as the dragon against the rat.
   Sources, read 4 October 2026, Wikipedia unless named: "Lo Shu Square" (the turtle from the River Luo in the time of Yu the Great; 4 9 2 / 3 5 7 / 8 1 6; every line 15; clearly a magic square in texts by 80 CE: so the game says "about two thousand years"),
   "The Nine Chapters on the Mathematical Art" (compiled by the 1st century CE; chapter 2 is the rule of three for proportions; Liu Hui's commentary, 263),
   "Chinese zodiac" (the Great Race called by the Jade Emperor; the Rat rode the Ox and came first; the Dragon came fifth because it stopped to bring rain to a village and to help the Rabbit: a legend, so the game says "the story goes"),
   "Great Wall of China" (21,196 km in all, 2012 survey; the best-known parts are Ming), "Giant panda" (99% of its diet is bamboo).
   Mandarin: 你好 nǐ hǎo (hello). Pinyin tone marks need letters Fredoka does not have: tools/mkfont.py builds them. ===== */

/* ----- hand-drawn pieces ----- */
const PANDA_ART = { svg: '<svg viewBox="14 6 100 108" xmlns="http://www.w3.org/2000/svg">' + PANDA_IN + '</svg>' };
/* a Chinese dragon, running to the right: long and wingless, with horns, a mane and whiskers */
const DRAGON_ART = B64('<ellipse cx="32" cy="59" rx="25" ry="3" fill="rgba(27,42,78,.12)"/><path d="M7 42q-7-5-5-13 4 5 9 6z" fill="#E5484D"/>' +
  '<path d="M17 47v8M37 45v9" stroke="#2E7D4F" stroke-width="4" stroke-linecap="round"/><path d="M6 40q7 12 15 1t15 1q5 6 10-6" fill="none" stroke="#3FA36B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M6 40q7 12 15 1t15 1q5 6 10-6" fill="none" stroke="#FFC83D" stroke-width="2.600" stroke-linecap="round" stroke-dasharray=".5 5.500"/><path d="M12 49v7M31 48v7" stroke="#3FA36B" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M40 27q-7 1-8 9 5-3 9-1zM43 21q-6-2-10 3 6 0 9 3z" fill="#E5484D"/><path d="M40 22q9-9 18-1 6 2 5 9-1 7-9 7-9 1-14-5z" fill="#3FA36B"/><path d="M55 27q8-1 8 6-1 6-9 5z" fill="#57BF7F"/>' +
  '<path d="M45 19l-4-9M51 17l2-9" stroke="#FFC83D" stroke-width="2.800" stroke-linecap="round"/><circle cx="50" cy="25" r="3.600" fill="#fff"/>' + G_EYE(50.5, 25, 2.3) +
  '<path d="M54 35q4 1 7-2" fill="none" stroke="#1B2A4E" stroke-width="1.500" stroke-linecap="round"/><circle cx="60" cy="29" r="1" fill="#1B2A4E"/><path d="M62 32q3 3 1 9" fill="none" stroke="#FFC83D" stroke-width="1.600" stroke-linecap="round"/>');
/* the rat of the zodiac story, running to the right */
const RAT_ART = B64('<ellipse cx="31" cy="59" rx="22" ry="3" fill="rgba(27,42,78,.12)"/><path d="M13 49Q1 50 3 39q1-6 6-6" fill="none" stroke="#F2A7B5" stroke-width="2.800" stroke-linecap="round"/>' +
  '<path d="M20 54v4M38 54v4M27 55v3M44 53v5" stroke="#8A93A8" stroke-width="3.600" stroke-linecap="round"/><ellipse cx="29" cy="46" rx="18" ry="11" fill="#A9B1BE"/><ellipse cx="29" cy="50" rx="11" ry="5" fill="#C9CEDA"/>' +
  '<circle cx="41" cy="31" r="7" fill="#A9B1BE"/><circle cx="41" cy="31" r="4" fill="#F7C9D3"/><path d="M36 42q2-12 14-9 8 3 12 9-6 6-14 6-9 0-12-6z" fill="#A9B1BE"/><circle cx="61.500" cy="42" r="2" fill="#F28AA0"/>' +
  G_EYE(52, 39, 2.200) + '<path d="M57 45q4 2 6 5M57 46q2 3 2 6" fill="none" stroke="#5A678A" stroke-width="1" stroke-linecap="round"/>');

/* ----- the scene behind the mission path: misty peaks, the Great Wall running along a ridge with its watchtowers, a pagoda on a hill in the middle, and bamboo at the front ----- */
const cnRoof = (x, y, w) => '<path d="M' + (x - w / 2 - 15) + ' ' + (y - 5) + 'Q' + (x - w / 2 - 3) + ' ' + (y - 1) + ' ' + (x - w / 2 + 3) + ' ' + (y - 13) + 'H' + (x + w / 2 - 3) + 'Q' + (x + w / 2 + 3) + ' ' + (y - 1) + ' ' + (x + w / 2 + 15) + ' ' + (y - 5) + 'L' + (x + w / 2 + 8) + ' ' + (y + 3) + 'H' + (x - w / 2 - 8) + 'z" fill="#C0392B"/><path d="M' + (x - w / 2 - 8) + ' ' + (y + 3) + 'h' + (w + 16) + '" stroke="#8E2A20" stroke-width="3"/>';
const cnPagoda = (x, y, k) => { let s = '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">', ty = 0;
  [86, 72, 60, 48, 38].forEach((w, i) => { const hh = i ? 22 : 30; s += '<rect x="' + (-w / 2) + '" y="' + (ty - hh) + '" width="' + w + '" height="' + hh + '" fill="#F6E9CF"/>' + (i ? '<rect x="-5" y="' + (ty - hh + 6) + '" width="10" height="11" rx="5" fill="#8E2A20"/>' : '<path d="M-9 0v-19q9-9 18 0v19z" fill="#8E2A20"/>') +
      '<path d="M' + (-w / 2 + 7) + ' ' + (ty - hh) + 'v' + hh + 'M' + (w / 2 - 7) + ' ' + (ty - hh) + 'v' + hh + '" stroke="#C0392B" stroke-width="3"/>'; ty -= hh; s += cnRoof(0, ty, w); ty -= 13; });
  return s + '<path d="M0 ' + ty + 'v-22" stroke="#C98A12" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="' + (ty - 10) + '" r="5" fill="#FFC83D"/></g>'; };
const cnTower = (x, y) => '<rect x="' + (x - 13) + '" y="' + (y - 30) + '" width="26" height="30" fill="#E3D3B4"/><path d="M' + (x - 15) + ' ' + (y - 30) + 'v-7h6v4h6v-4h6v4h6v-4h6v7z" fill="#D2BF9A"/><rect x="' + (x - 4) + '" y="' + (y - 20) + '" width="8" height="11" rx="4" fill="#7C6A4D"/>';
const cnWall = d => '<path d="' + d + '" fill="none" stroke="#D2BF9A" stroke-width="15" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#E9DCC0" stroke-width="9" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#B9A47C" stroke-width="2.500" stroke-dasharray="7 6" stroke-linejoin="round" transform="translate(0 -7)"/>';
const cnBamboo = (x, y, hgt, lean) => { let s = '<g transform="rotate(' + lean + ' ' + x + ' ' + y + ')"><path d="M' + x + ' ' + y + 'v-' + hgt + '" stroke="#4E9A45" stroke-width="13" stroke-linecap="round"/>';
  for (let yy = y - 46; yy > y - hgt + 10; yy -= 52) s += '<path d="M' + (x - 6.5) + ' ' + yy + 'h13" stroke="#2F6E2E" stroke-width="3"/>';
  [[.42, 1], [.62, -1], [.82, 1], [.97, -1]].forEach(l => { const ly = y - hgt * l[0]; s += '<path d="M' + x + ' ' + ly + 'q' + (l[1] * 26) + ' -24 ' + (l[1] * 58) + ' -12q' + (-l[1] * 26) + ' 20 ' + (-l[1] * 58) + ' 12z" fill="#6DBF5B"/>'; });
  return s + '</g>'; };
const CN_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="cnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC8EE"/><stop offset=".6" stop-color="#DDF2F8"/><stop offset="1" stop-color="#FFF4DE"/></linearGradient>' +
  '<filter id="cnsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".14"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#cnsky)"/><circle cx="170" cy="112" r="58" fill="#FFD9C2"/><circle cx="170" cy="112" r="42" fill="#FF7A5C"/>' +
  '<g fill="#fff" opacity=".9"><ellipse cx="420" cy="86" rx="64" ry="18"/><ellipse cx="470" cy="72" rx="40" ry="16"/><ellipse cx="820" cy="124" rx="56" ry="16"/></g>' +
  '<path d="M0 330q30-150 70-20 30-170 80-10 36-120 70 0 40-190 90 0 30-110 64 0 40-160 86 0 36-130 70 0 44-180 96 0 30-120 60 0 40-150 84 0 36-110 66 0 30-100 64 30V420H0z" fill="#9CC9D6" opacity=".75"/>' +
  '<path d="M0 360q50-110 100-10 44-130 96 0 40-100 86 0 50-120 100 0 46-90 90 0 44-130 96 0 50-100 100 0 44-120 92 0 50-90 100 0 40-80 80 10 30-50 60 0V440H0z" fill="#79B3B0" opacity=".85"/>' +
  '<g filter="url(#cnsh)"><path d="M-10 372 120 306 230 346 330 286 440 338 520 320V470H-10z" fill="#7DB37A"/><path d="M600 326 700 302 762 276 850 324 902 302 1010 334V470H600z" fill="#7DB37A"/>' +
  cnWall('M-10 372 120 306 230 346 330 286 440 338 520 320') + cnWall('M600 326 700 302 762 276 850 324 902 302 1010 334') + cnTower(120, 304) + cnTower(330, 284) + cnTower(762, 274) + cnTower(902, 300) + '</g>' +
  '<g filter="url(#cnsh)"><path d="M380 452q180-150 372 0z" fill="#6FA86B"/>' + cnPagoda(564, 372, 1.12) + '</g>' +
  '<path filter="url(#cnsh)" d="M0 450Q240 408 500 440T1000 424V600H0z" fill="#8CC084"/><g fill="#F6A6B8">' + [[236, 452], [246, 462], [226, 464], [804, 444], [816, 454], [794, 456]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6"/>').join('') + '</g>' +
  '<path d="M0 512Q250 478 520 500T1000 488V600H0z" fill="#73AE6D"/><g fill="#5E9E63">' + [[110, 548], [330, 530], [650, 536], [880, 552], [490, 560]].map(p => '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="26" ry="9"/>').join('') + '</g>' +
  '<g filter="url(#cnsh)">' + cnBamboo(46, 610, 330, -4) + cnBamboo(86, 620, 270, 3) + cnBamboo(948, 610, 340, 4) + cnBamboo(906, 620, 260, -3) + '</g></svg>';

/* ----- Mandarin. Edge and Android both have Mandarin voices; without one, the English voice sounds the word out from the spelling beside it. A Cantonese voice is never used (01-core.js) ----- */
const ZH = (t, phon, inline) => ({ t, lang: 'zh', fallback: phon, inline: !!inline });
const NIHAO = 'nee how';

/* ----- the race. In the zodiac story the rat won and the dragon came fifth, because it stopped to help. Here she is the dragon ----- */
const CN_RACE = { act: 'race', me: DRAGON_ART, rival: RAT_ART, rivalName: 'rat', track: 10,
  intro: { text: 'You are the dragon. Answer fast to beat the rat!', say: 'The story goes that the Jade Emperor held a great race, to name the years after the animals. The clever rat came first. The dragon came fifth, because it stopped to help others on the way. Now it is your race, and you are the dragon. Tap the right answer, and the dragon takes a step. The rat runs at a steady speed, and it never stops. Reach the flag before the rat, and you move up a level. Press Go when you are ready!' },
  win: { text: 'The dragon beat the rat to the flag!', say: 'The dragon beat the rat to the flag! This time, the year is yours.' },
  lose: { text: 'The rat got there first this time.', say: 'The rat got there first this time. Quick answers will catch it.' } };
GRAPH_SETS.china = { noun: 'foods', one: 'food', items: [{ name: 'dumplings', art: 'dumpling' }, { name: 'moon cakes', art: 'moon-cake' }, { name: 'peaches', art: 'peach' }, { name: 'mandarins', art: 'tangerine' }, { name: 'rice bowls', art: 'cooked-rice' }] };
THING_NAMES.dumpling = 'dumplings';

COUNTRIES.china = {
  cheers: ['Tài bàng le!', 'Jiā yóu!'],     /* "that's great!" and "keep going!" (literally "add oil") in Mandarin, used only here */
  ladders: ['magic'],                        /* the magic square keeps its own progress; a country reset puts it back. The race level carries from country to country */
  name: 'China', hello: 'Nǐ hǎo! Start with Dragon maths.', helloSay: [ZH('你好', NIHAO), 'Start with Dragon maths.'], scene: CN_SCENE,
  thing: 'dumpling', boat: 'sailboat',
  videos: {}, gates: [], themes: {},         /* the videos and the room colour come with the later missions; none is offered until Tony approves it */
  souvenirs: [{ id: 'ch-panda', art: PANDA_ART, move: 'rock', head: [46, 14, 58], name: 'Giant panda', price: 30, need: 'm1' }, { id: 'ch-lantern', art: 'red-paper-lantern', move: 'sway', name: 'Red lantern', price: 20, need: 'm1' }],
  path: [
    /* on a phone held upright the pagoda fills the right of the screen, so the path keeps to the left of it */
    { m: 'm1', x: 10, y: 62, px: 24, py: 16 }, { soon: 'Heart and blood', icon: 'anatomical-heart', x: 28, y: 80, px: 38, py: 31 }, { soon: 'Fire and elements', icon: 'fireworks', x: 46, y: 64, px: 22, py: 46 },
    { soon: 'Great inventions', icon: 'compass', x: 64, y: 82, px: 38, py: 61 }, { soon: 'Explorer challenge', icon: 'trophy', x: 82, y: 64, px: 24, py: 76 }
  ],
  missions: [
    { id: 'm1', name: 'Dragon maths', icon: DRAGON_ART, sticker: 'dragon-face',
      intro: { text: 'Scale it up like a dragon. Then mend a magic square!', say: [ZH('你好', NIHAO), 'Welcome to China! Two thousand years ago, Chinese mathematicians wrote a famous book called the Nine Chapters. One whole chapter is about ratios: if one panda eats three sticks of bamboo, how many do four pandas eat? Today you work them out.'] },
      rounds: [{ skill: 'ratio' },
        { act: 'magic', intro: { say: 'The story goes that long ago, in China, a turtle climbed out of the River Luo with a pattern on its shell. It was the numbers one to nine, in a square. And every row, every column, and both diagonals added up to the same number: fifteen. It is called the Lo Shu square. Some numbers have washed off! Tap a number, then tap its square, to put them back.' } },
        { skill: 'ratio' }, CN_RACE, { skill: 'ratio' }, { skill: '@review', or: 'factors' },
        { act: 'magic' }, { skill: '@review', or: 'chance' }] }
  ]
};
W.cn = { PANDA_ART, DRAGON_ART, RAT_ART, CN_SCENE };
