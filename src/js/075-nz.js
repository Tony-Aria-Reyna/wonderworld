/* ===== New Zealand (Aotearoa): the second country. Everything here is content, not code. ===== */

/* ----- hand-drawn pieces ----- */
const B64 = inner => ({ svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>' });
const B32 = inner => ({ svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>' });
const birdEye = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 1.5) + '" fill="#fff"/><circle cx="' + (x + .6) + '" cy="' + y + '" r="' + r + '" fill="#1B2A4E"/><circle cx="' + (x + 1.4) + '" cy="' + (y - .9) + '" r=".8" fill="#fff"/>';
const birdLegs = (x1, x2, y, len, col, w) => '<path d="M' + x1 + ' ' + y + 'v' + len + 'm-4 1h8M' + x2 + ' ' + y + 'v' + len + 'm-4 1h8" stroke="' + col + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" fill="none"/>';
const KIWI_BIRD = B64(birdLegs(24, 35, 49, 9, '#E0A458', 3.4) +
  '<ellipse cx="27" cy="37" rx="21" ry="17" fill="#9A6A45"/><path d="M12 36q5 6 2 13M22 30q6 8 2 17M33 31q5 8 1 16" stroke="#7E5333" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
  '<circle cx="46" cy="24" r="10.5" fill="#9A6A45"/><path d="M53.500 24.500 63 44l-2.600 1.300L50 29z" fill="#F5E3B5" stroke="#E0C489" stroke-width="1.2" stroke-linejoin="round"/>' + birdEye(48, 21.5, 2.3));
const KAKAPO = B64(birdLegs(25, 36, 51, 7, '#8E97A8', 3.4) + '<path d="M10 40 2 50l10-2z" fill="#5E8F36"/>' +
  '<ellipse cx="29" cy="38" rx="20" ry="18" fill="#7DB04A"/><ellipse cx="36" cy="43" rx="11" ry="11" fill="#B4D464"/>' +
  '<path d="M14 32l3 2M20 27l3 2M15 41l3 2M22 36l3 2M19 46l3 2M27 30l3 2" stroke="#4F7A2C" stroke-width="2" stroke-linecap="round"/>' +
  '<circle cx="44" cy="22" r="12.500" fill="#86BB4E"/><circle cx="47" cy="24" r="8.500" fill="#DDE27E"/><path d="M52 21q7 2 5.500 9-4 1-6.500-3z" fill="#9AA3B5" stroke="#6F7890" stroke-width="1"/>' + birdEye(46, 21, 2.3));
const TAKAHE = B64(birdLegs(24, 35, 49, 9, '#E5484D', 3.6) + '<path d="M9 36 3 44l9 1z" fill="#fff"/>' +
  '<ellipse cx="28" cy="37" rx="20" ry="16" fill="#3454B4"/><ellipse cx="21" cy="33" rx="14" ry="10" fill="#2F9E6B"/><path d="M12 33q8 6 18 0" stroke="#237A52" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<circle cx="45" cy="22" r="10.500" fill="#2C3F96"/><path d="M51 13.500 63 25 51 30.500z" fill="#E5484D" stroke="#C7363B" stroke-width="1" stroke-linejoin="round"/><path d="M52 24h7" stroke="#C7363B" stroke-width="1.200" stroke-linecap="round"/>' + birdEye(46.500, 20, 2.3));
const KORORA = B64('<path d="M24 58h10M36 58h9" stroke="#F2A98E" stroke-width="4.500" stroke-linecap="round"/>' +
  '<path d="M16 38c0-17 6-30 17-30 9 0 15 9 15 24 0 15-6 26-16 26-9 0-16-8-16-20z" fill="#4E6FA8"/><path d="M27 30c0-9 5-14 11-13 6 2 9 9 9 19 0 12-5 20-12 20-6 0-8-12-8-26z" fill="#fff"/>' +
  '<path d="M27 28q-9 10-4 24 7-8 7-22z" fill="#3B5688"/><path d="M45 17l11 4-11 4z" fill="#2B3A55" stroke="#2B3A55" stroke-width="1" stroke-linejoin="round"/>' + birdEye(39, 18, 2.3));
const TUI = B64(birdLegs(27, 35, 47, 9, '#5A678A', 2.6) + '<path d="M14 40 1 54l11-2 7-8z" fill="#172036"/>' +
  '<ellipse cx="29" cy="36" rx="19" ry="13.500" transform="rotate(-14 29 36)" fill="#1F2A44"/><ellipse cx="24" cy="36" rx="12.500" ry="7.500" transform="rotate(-14 24 36)" fill="#1E8E96"/><path d="M15 38q9 4 18-2" stroke="#7BD3D9" stroke-width="1.600" fill="none" stroke-linecap="round"/>' +
  '<circle cx="45" cy="23" r="9.500" fill="#1F2A44"/><path d="M52 20q8 1.500 11 7-7 .5-11-2z" fill="#111827"/><path d="M37 27q4 3 8 2" stroke="#fff" stroke-width="1.300" fill="none" stroke-linecap="round" opacity=".8"/>' +
  '<circle cx="46.500" cy="33.500" r="3.400" fill="#fff"/><circle cx="50.500" cy="36" r="2.800" fill="#fff"/>' + birdEye(46.500, 21, 2.1));
const KERERU = B64(birdLegs(25, 35, 51, 7, '#E5484D', 3) + '<path d="M10 38 1 46l10 1z" fill="#2F6347"/>' +
  '<ellipse cx="28" cy="37" rx="20.500" ry="17" fill="#3F7F5A"/><path d="M22 42.500c0-6 5-9 13-9 7 0 12 3 12.500 7-2 8-8 13-16 13-5 0-9.500-4-9.500-11z" fill="#fff"/>' +
  '<ellipse cx="20" cy="33" rx="12.500" ry="8.500" fill="#6B4E8E"/><path d="M11 33q8 5 17 0" stroke="#523A70" stroke-width="1.800" fill="none" stroke-linecap="round"/>' +
  '<circle cx="46" cy="21" r="8.500" fill="#3F7F5A"/><path d="M53 18.500l9 3-9 3z" fill="#E5484D"/><path d="M59 20.500l3 1-3 1z" fill="#FFC83D"/>' + birdEye(47.500, 19.500, 2));
const PIWAKAWAKA = B64(birdLegs(33, 40, 49, 8, '#3A2E28', 2) +
  '<path d="M26 42 2 44 4 34 8 24 15 16 24 10z" fill="#4A3B32"/><path d="M26 42 3 39M26 42 6 29M26 42 11.500 20M26 42 19.500 13" stroke="#fff" stroke-width="2.200" stroke-linecap="round"/>' +
  '<ellipse cx="35" cy="40" rx="12.500" ry="10.500" fill="#6B5444"/><ellipse cx="39" cy="43.500" rx="8.500" ry="7" fill="#EDB97A"/>' +
  '<circle cx="46" cy="29" r="8.500" fill="#4A3B32"/><path d="M41 24.500q4-2.500 9-1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M41 35q5 3 10 0" stroke="#fff" stroke-width="2.400" fill="none" stroke-linecap="round"/><path d="M53.500 27.500l7 2-7 2z" fill="#1B2A4E"/>' + birdEye(47.500, 28.500, 1.9));
const KEA = B64(birdLegs(25, 35, 50, 8, '#6F7890', 3.2) + '<path d="M11 38 1 47l10 .5z" fill="#2E8C8C"/>' +
  '<ellipse cx="28" cy="37" rx="19.500" ry="15.500" fill="#7C9A3C"/><path d="M12 39q10 9 24 1l-2 6q-11 6-20 0z" fill="#F28C28"/><ellipse cx="22" cy="34" rx="13" ry="8" fill="#5E7B2C"/>' +
  '<path d="M12 34q9 5 19 0M16 30q6 3 12 0" stroke="#4A6222" stroke-width="1.600" fill="none" stroke-linecap="round"/>' +
  '<circle cx="45" cy="22" r="10.500" fill="#86A544"/><path d="M52 15.500q12 2 9.500 15.500-3.500-6-9.500-6z" fill="#5B6170" stroke="#444A58" stroke-width="1"/>' + birdEye(46.500, 20, 2.3));
const BIRD_SAY = { 'kiwi': 'kiwi', 'kākāpō': 'kah-kah-paw', 'takahē': 'tah-kah-heh', 'kororā': 'koh-roh-rah', 'tūī': 'too-ee', 'kererū': 'keh-reh-roo', 'pīwakawaka': 'pee-wah-kah-wah-kah', 'kea': 'kee-ah' };
const sayBird = n => () => Speech.word(n, BIRD_SAY[n]);                                   // inside an English sentence
const bird1 = n => () => [{ t: n, lang: 'mi', inline: true, fallback: BIRD_SAY[n] }];     // the name on its own: a recording if there is one
GRAPH_SETS.nz = { noun: 'birds', one: 'bird', items: [
  { name: 'kiwi', art: KIWI_BIRD, say: sayBird('kiwi') }, { name: 'tūī', art: TUI, say: sayBird('tūī') }, { name: 'kea', art: KEA, say: sayBird('kea') },
  { name: 'kererū', art: KERERU, say: sayBird('kererū') }, { name: 'takahē', art: TAKAHE, say: sayBird('takahē') }, { name: 'kākāpō', art: KAKAPO, say: sayBird('kākāpō') }] };

/* small block towers for the shake test */
const blk = (x, y, c) => '<rect x="' + x + '" y="' + y + '" width="6" height="5.400" rx="1.200" fill="' + c + '" stroke="#1B2A4E" stroke-width=".7"/>';
const BLK_COL = ['#FF7A6B', '#FFC83D', '#34C17B', '#19A7B8', '#8B7BEA', '#FF9E8E'];
const stack = (x, n, top) => Array.from({ length: n }, (_, i) => blk(x, (top || 27.500) - 5.500 * (i + 1) + .1, BLK_COL[i % 6])).join('');
const TABLE_TOP = '<rect x="2" y="27.500" width="28" height="2.600" rx="1" fill="#B9793F"/>';
const TALL_ART = B32(TABLE_TOP + stack(13, 5)), SHORT_ART = B32(TABLE_TOP + stack(13, 2)), TOWERS_ART = B32(TABLE_TOP + stack(7, 5) + stack(19, 2));
const WIDE_ART = B32(TABLE_TOP + [0, 1, 2].map(i => blk(6.500 + i * 6.300, 22, BLK_COL[i])).join('') + [0, 1].map(i => blk(9.700 + i * 6.300, 16.500, BLK_COL[3 + i])).join('') + blk(12.900, 11, BLK_COL[5]));
const TOPHEAVY_ART = B32(TABLE_TOP + blk(12.900, 22, BLK_COL[5]) + [0, 1].map(i => blk(9.700 + i * 6.300, 16.500, BLK_COL[3 + i])).join('') + [0, 1, 2].map(i => blk(6.500 + i * 6.300, 11, BLK_COL[i])).join(''));
const QUAKE_ART = B32('<path d="M2 21h28v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#B9793F"/><path d="M2 20h28v3.500H2z" fill="#7CCB6B"/><path d="M16 20l2.500 3.500-4 2.500 3 4" stroke="#3F2719" stroke-width="1.800" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<g transform="rotate(-9 10 14)"><path d="M5.500 11h9v9h-9z" fill="#fff" stroke="#1B2A4E" stroke-width="1.100"/><path d="M4 11.500 10 5.500l6 6z" fill="#E5484D" stroke="#1B2A4E" stroke-width="1.100" stroke-linejoin="round"/><path d="M8.500 15h3v5h-3z" fill="#19A7B8"/></g>' +
  '<path d="M21 6q2.500 2 0 4t0 4M26 8q2.500 2 0 4t0 4" stroke="#8B7BEA" stroke-width="1.700" fill="none" stroke-linecap="round"/>');
const TABLE_ART = B32('<rect x="3" y="9" width="26" height="4" rx="1.500" fill="#B9793F" stroke="#1B2A4E" stroke-width="1"/><path d="M6 13v15M26 13v15" stroke="#9A632F" stroke-width="3" stroke-linecap="round"/>' +
  '<circle cx="16" cy="19" r="3.600" fill="#FFD9B0"/><path d="M10.500 28q0-6 5.500-6t5.500 6z" fill="#19A7B8"/><path d="M12.500 18.500q3.500-5 7 0" stroke="#6B4226" stroke-width="2.200" fill="none" stroke-linecap="round"/>');

const PLATES_ART = B32('<circle cx="16" cy="16" r="13.500" fill="#3BA7D9"/><path d="M8 9q4-3 8 0l1 5-4 4-5-2zM19 15l6-2 2 6-4 6-5-3z" fill="#7CCB6B"/><circle cx="16" cy="16" r="13.500" fill="none" stroke="#1B2A4E" stroke-width="1.200"/>' +
  '<path d="M16 2.500l-2 6 4 5-3 6 3 5-1 5M3 13l6 3 6 3M29 19l-6-1-5-5 3-7" stroke="#1B2A4E" stroke-width="1.500" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray=".1 0"/>');
/* the Earth, cut through the middle */
const EARTH_CORE = (hi) => {
  const c = k => !hi || hi === k;
  return '<circle cx="50" cy="53" r="45" fill="' + (c('crust') ? '#8A5A3C' : '#D9DCE5') + '"/><circle cx="50" cy="53" r="41.200" fill="' + (c('mantle') ? '#F28C28' : '#E9EBF1') + '"/>' +
    '<circle cx="50" cy="53" r="25" fill="' + (c('outer') ? '#FFC83D' : '#D9DCE5') + '"/><circle cx="50" cy="53" r="11.500" fill="' + (c('inner') ? '#FFF3B0' : '#E9EBF1') + '" stroke="' + (c('inner') ? '#F2C94C' : '#D0D4DE') + '" stroke-width="1.200"/>';
};
const EARTH_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + EARTH_CORE() +
  '<path d="M24 41q7-7 14 0M63 83q7 5 14-2M68 30q5-5 11 0M22 68q5 5 11 1" stroke="#DB7417" stroke-width="1.500" fill="none" stroke-linecap="round"/>' +
  '<path d="M40 47q4-4 8 0M53 66q4 3 8-1" stroke="#EDAE22" stroke-width="1.300" fill="none" stroke-linecap="round"/>' +
  '<circle cx="50" cy="53" r="45" fill="none" stroke="#3BA7D9" stroke-width="2.600"/><path d="M11 30.500A45 45 0 0 1 89 30.500" fill="none" stroke="#34C17B" stroke-width="2.600" stroke-linecap="round"/>' +
  '<g transform="rotate(-24 50 53)"><rect x="49.300" y="3.800" width="1.400" height="3.800" fill="#8A5A3C"/><circle cx="50" cy="2.900" r="2.700" fill="#1E9C5C"/></g>' +
  '<rect x="47.400" y="3.600" width="5.200" height="4.200" fill="#fff" stroke="#1B2A4E" stroke-width=".5"/><path d="M46.300 3.900 50 .7l3.700 3.200z" fill="#E5484D" stroke="#1B2A4E" stroke-width=".5" stroke-linejoin="round"/>' +
  '<g transform="rotate(25 50 53)"><path d="M45.500 7.800 48.800 2.400h2.400l3.300 5.400z" fill="#6E7F99"/><path d="M48.800 2.400h2.400L50 4.600z" fill="#FF7A6B"/></g></svg>';
const LAYER = k => ({ svg: '<svg viewBox="2 5 96 96" xmlns="http://www.w3.org/2000/svg">' + EARTH_CORE(k) + '</svg>' });
const LAYERS = [
  { id: 'crust', label: 'Crust', x: 17, y: 25, w: 12, fact: { text: 'The crust: thin, rocky skin. We live on it!' }, hint: { text: 'The crust is the thin skin on the outside.' } },
  { id: 'mantle', label: 'Mantle', x: 83, y: 53, w: 12, fact: { text: 'The mantle: thick, hot rock that slowly flows.' }, hint: { text: 'The mantle is the thick layer under the crust.' } },
  { id: 'outer', label: 'Outer core', x: 50, y: 72, w: 12, fact: { text: 'The outer core: liquid metal, hotter than lava.' }, hint: { text: 'The outer core wraps around the middle ball.' } },
  { id: 'inner', label: 'Inner core', x: 50, y: 53, w: 12, fact: { text: 'The inner core: a solid metal ball. Super hot!' }, hint: { text: 'The inner core is right in the middle.' } }
];

/* ----- the scene behind the mission path: long white cloud, snowy mountains, a volcano, green hills and ponga ferns ----- */
const frond = (x, y, a, len, col) => '<path transform="translate(' + x + ' ' + y + ') rotate(' + a + ')" d="M0 0Q' + (len * .55) + ' ' + (-len * .5) + ' ' + len + ' ' + (len * .22) + 'Q' + (len * .55) + ' ' + (-len * .24) + ' 0 0z" fill="' + col + '"/>';
const ponga = (x, y, s, col, col2) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-7 0q5-70-2-128h14q-5 60 3 128z" fill="#7A5238"/><path d="M-5-20h8M-6-50h9M-6-80h9M-5-108h9" stroke="#5B3A29" stroke-width="4" stroke-linecap="round"/>' +
  [-196, -172, -150, -128, -104, -76, -52, -30, -8, 16].map((a, i) => frond(0, -126, a, i % 2 ? 84 : 100, i % 2 ? col2 : col)).join('') +
  '<path d="M0-126q-4-34 10-42 12-4 14 8 0 9-8 8" fill="none" stroke="' + col + '" stroke-width="6" stroke-linecap="round"/></g>';
const sheep = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-7 6v8M7 6v8" stroke="#3A2E28" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="14" ry="10" fill="#fff"/><circle cx="-9" cy="-5" r="6" fill="#fff"/><circle cx="6" cy="-7" r="6" fill="#fff"/><ellipse cx="15" cy="-3" rx="5.500" ry="4.500" fill="#3A2E28"/></g>';
const NZ_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="nzsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FC0EE"/><stop offset=".6" stop-color="#BDEBFA"/><stop offset="1" stop-color="#E9F9EE"/></linearGradient>' +
  '<filter id="nzsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".18"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#nzsky)"/>' +
  '<circle cx="318" cy="112" r="78" fill="#FFF6C9" opacity=".5"/><circle cx="318" cy="112" r="48" fill="#FFD23F"/>' +
  '<g fill="#fff" filter="url(#nzsh)"><ellipse cx="420" cy="118" rx="120" ry="22"/><ellipse cx="560" cy="104" rx="150" ry="26"/><ellipse cx="730" cy="116" rx="140" ry="22"/><ellipse cx="880" cy="128" rx="90" ry="16"/><ellipse cx="300" cy="130" rx="70" ry="13"/></g>' +
  '<g filter="url(#nzsh)"><path d="M-10 360 70 262l44 44 86-116 62 96 52-58 74 92 62-62 70 102H-10z" fill="#86AFD3"/>' +
  '<path d="M200 190l-34 46 20-8 14 16 16-18 20 14zM70 262l-22 27 22-7 12 10 10-9zM314 228l-20 23 20-6 22 9z" fill="#fff"/></g>' +
  '<g filter="url(#nzsh)"><path d="M520 372 676 176q14-12 28 0l156 196z" fill="#6F92BC"/><path d="M676 176q14-12 28 0l46 58-22-10-20 20-18-22-22 20-18-14-22 8z" fill="#fff"/>' +
  '<g fill="#fff" opacity=".85"><circle cx="690" cy="150" r="12"/><circle cx="706" cy="134" r="9"/><circle cx="696" cy="118" r="6"/></g></g>' +
  '<path filter="url(#nzsh)" d="M0 372Q150 306 330 356T660 348T1000 338V600H0z" fill="#8FD67A"/>' + sheep(248, 372, 1) + sheep(300, 388, .8) + sheep(820, 372, .9) +
  '<path filter="url(#nzsh)" d="M0 420Q230 362 480 410T1000 392V600H0z" fill="#6CC56A"/>' +
  '<path d="M-20 478Q170 430 330 462T640 484T1020 444V528Q840 566 640 540T330 522T-20 548z" fill="#3BA7D9"/><path d="M40 500q40-14 80 0M420 506q40-14 80 0M770 490q40-14 80 0" stroke="#BFEBF7" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<g filter="url(#nzsh)" transform="translate(585 492)"><path d="M0-4V-62" stroke="#7A5238" stroke-width="5" stroke-linecap="round"/><path d="M4-60Q46-44 40-8L4-12z" fill="#fff"/><path d="M4-60Q46-44 40-8" stroke="#E5484D" stroke-width="4" fill="none"/><path d="M-66-8Q0 22 66-8L74-22 58-12H-58L-74-24z" fill="#9A632F"/><path d="M-58-4H58" stroke="#fff" stroke-width="3" stroke-dasharray="6 9" stroke-linecap="round"/></g>' +
  '<g filter="url(#nzsh)">' + ponga(86, 520, 1.25, '#2F9E6B', '#34B27A') + ponga(930, 500, 1.05, '#34B27A', '#2F9E6B') + '</g>' +
  '<path filter="url(#nzsh)" d="M0 552Q260 500 520 544T1000 524V600H0z" fill="#4FAF62"/>' +
  '<g fill="none" stroke="#2F8F4E" stroke-width="7" stroke-linecap="round"><path d="M700 592q-6-40 16-52 20-8 26 10 2 14-12 14-10-2-6-10"/><path d="M228 596q-4-34 14-44 16-6 22 8 2 12-10 12"/></g>' +
  '</svg>';

/* ----- te reo Māori. No device has a Māori voice, so these words are only ever spoken by a real recording
   (made on the grown-ups page, or built in from voices/mi/). Until then she reads them. ----- */
/* a constellation: the Southern Cross and its two Pointers, joined with dotted lines */
const STARS_ART = B64('<rect x="2" y="2" width="60" height="60" rx="14" fill="#1E2A5A"/><circle cx="12" cy="12" r="1.200" fill="#fff" opacity=".7"/><circle cx="55" cy="52" r="1.200" fill="#fff" opacity=".7"/><circle cx="20" cy="44" r="1" fill="#fff" opacity=".6"/><circle cx="54" cy="11" r="1" fill="#fff" opacity=".6"/><path d="M40 10 37 50M27 26 52 27M10 53 20 57" stroke="#9FB4FF" stroke-width="1.500" stroke-linecap="round" fill="none" opacity=".85"/><path d="M40 3.5 42 8.1 46.5 10 42 11.9 40 16.5 38 11.9 33.5 10 38 8.1z" fill="#FFE27A"/><path d="M52 21.5 53.6 25.4 57.5 27 53.6 28.6 52 32.5 50.4 28.6 46.5 27 50.4 25.4z" fill="#FFE27A"/><path d="M37 42.5 39.2 47.8 44.5 50 39.2 52.2 37 57.5 34.8 52.2 29.5 50 34.8 47.8z" fill="#FFE27A"/><path d="M27 20.5 28.6 24.4 32.5 26 28.6 27.6 27 31.5 25.4 27.6 21.5 26 25.4 24.4z" fill="#FFE27A"/><path d="M44 32 44.9 34.1 47 35 44.9 35.9 44 38 43.1 35.9 41 35 43.1 34.1z" fill="#FFF3C4"/><path d="M10 48.5 11.3 51.6 14.5 53 11.3 54.4 10 57.5 8.7 54.4 5.5 53 8.7 51.6z" fill="#FFF3C4"/><path d="M20 53 21.2 55.8 24 57 21.2 58.2 20 61 18.8 58.2 16 57 18.8 55.8z" fill="#FFF3C4"/>');
const TEREO = [
  { native: 'kia ora', rom: 'kia ora', en: 'hello', icon: 'waving-hand', phon: 'kee-a aw-ra' },
  { native: 'moana', rom: 'moana', en: 'sea', icon: 'water-wave', phon: 'maw-ah-na' },
  { native: 'maunga', rom: 'maunga', en: 'mountain', icon: 'snow-capped-mountain', phon: 'moe-nga' },
  { native: 'waka', rom: 'waka', en: 'canoe', icon: 'canoe', phon: 'wah-ka' },
  { native: 'manu', rom: 'manu', en: 'bird', icon: TUI, phon: 'mah-noo' },
  { native: 'tātai whetū', rom: 'tātai whetū', en: 'constellation', icon: STARS_ART, phon: 'tah-tie feh-too' }
];
wordSkill('tereo', 'Te reo Māori words', 'mi', TEREO);

/* ----- Earth science ----- */
bankSkill('earth', 'Earth science', 'science', [
  { pic: LAYER('crust'), why: "We live on the crust, Earth's thin rocky skin.",
    ask: [{ t: 'Which layer of Earth do we live on?', pic: 'house', h: 'Earth has layers, like an onion. We live on the outside skin.', o: [O('Crust', LAYER('crust')), O('Mantle', LAYER('mantle')), O('Inner core', LAYER('inner'))] },
      { t: "What is Earth's crust like?", pic: LAYER('crust'), h: 'The crust is the ground under your feet. It is the outside skin.', o: [O('Thin and rocky', 'rock'), O('Liquid metal', 'droplet'), O('A ball of fire', 'fire')] }] },
  { pic: LAYER('inner'), why: "Earth's inner core is a hot, solid ball of iron.",
    ask: [{ t: 'What is at the very middle of the Earth?', pic: 'globe-showing-asia-australia', h: 'Deep down it gets hotter and hotter. The inner core is iron, squeezed solid.', o: [O('A hot metal ball', LAYER('inner')), O('Cold ice', 'ice'), O('Water', 'droplet')] },
      { t: 'Where is the Earth hottest?', pic: 'thermometer', h: 'The deeper you go, the hotter it gets.', o: [O('In the middle', 'bullseye'), O('On the crust', 'rock'), O('In the sea', 'water-wave')] }] },
  { pic: PLATES_ART, why: 'The crust is in giant plates. They push, and the ground shakes.',
    ask: [{ t: 'What makes an earthquake?', pic: QUAKE_ART, h: 'The crust is cracked into giant pieces called plates. They push and slip.', o: [O('Plates moving', 'puzzle-piece'), O('Loud thunder', 'cloud-with-lightning'), O('Big waves', 'water-wave')] },
      { t: "Earth's crust is cracked into giant…", pic: 'globe-showing-asia-australia', h: 'They fit together like a jigsaw, and they slowly move.', o: [O('Plates', 'puzzle-piece'), O('Balloons', 'balloon'), O('Ice cubes', 'ice')] }] },
  { pic: 'volcano', why: 'Melted rock, called magma, rises and bursts out as lava.',
    ask: [{ t: 'What bursts out of a volcano?', pic: 'volcano', h: 'Deep down, rock melts into magma. It rises. At the top it gets a new name.', o: [O('Lava', 'fire'), O('Snow', 'snowflake'), O('Sand', 'desert')] },
      { t: 'Where does lava come from?', pic: 'fire', h: 'Lava is melted rock. Where is it hot enough to melt rock?', o: [O('Deep underground', 'down-arrow'), O('The clouds', 'cloud'), O('The sea', 'water-wave')] }] },
  { pic: 'hot-springs', why: 'Trapped steam builds pressure. The pressure blasts the water out.',
    ask: [{ t: 'What heats the water in a geyser?', pic: 'hot-springs', h: 'Rotorua has hot rock close under the ground. Rain trickles down and touches it.', o: [O('Hot rock below', 'rock'), O('The Sun', 'sun'), O('A big kettle', 'teapot')] },
      { t: 'What pushes a geyser up into the air?', pic: 'fountain', h: 'Boiling water turns into a gas. The gas is trapped, so its pressure builds.', o: [O('Steam pressure', 'dashing-away'), O('Wind', 'wind-face'), O('Sea waves', 'water-wave')] }] },
  { pic: 'pot-of-food', why: 'Steam is water as a gas. Ice is water as a solid.',
    ask: [{ t: 'Water boils. What does it turn into?', pic: 'pot-of-food', h: 'Water can be a solid, a liquid or a gas. Heat changes it from one to the next.', o: [O('Steam, a gas', 'dashing-away'), O('Ice, a solid', 'ice'), O('Rock', 'rock')] },
      { t: 'Steam is water as a…', pic: 'thermometer', h: 'Ice is solid water. The water you drink is liquid. Boil it, and it floats away.', o: [O('Gas', 'dashing-away'), O('Solid', 'ice'), O('Liquid', 'droplet')] }] },
  { pic: 'balloon', why: 'Gas particles fly apart. Steam needs far more room than water.',
    ask: [{ t: 'Water turns to steam. How much room does it need?', pic: 'balloon', h: 'In a liquid the particles stay close. In a gas they fly far apart.', o: [O('Much more room', 'left-right-arrow'), O('Less room', 'pinching-hand'), O('The same room', 'balance-scale')] },
      { t: 'Steam is trapped under rock. What builds up?', pic: 'rock', h: 'The steam needs more room, but the rock holds it in. It pushes harder and harder.', o: [O('Pressure', 'collision'), O('Ice', 'ice'), O('Sand', 'desert')] }] },
  { pic: TABLE_ART, why: 'In an earthquake: drop, cover and hold.',
    ask: [{ t: 'The ground starts to shake! What do you do?', pic: QUAKE_ART, h: 'Get down low, get under something strong, and hold on.', o: [O('Drop, cover, hold', TABLE_ART), O('Run outside', 'person-running'), O('Stand and watch', 'eye')] },
      { t: 'Where is safest in an earthquake?', pic: QUAKE_ART, h: 'You want something strong over your head.', o: [O('Under a table', TABLE_ART), O('By a window', 'window'), O('On the stairs', 'ladder')] }] }
], 'nz');
bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: TOWERS_ART, hint: 'A fair test changes just one thing. Everything else stays the same.', why: 'A fair test changes one thing only.',
    ask: [{ t: 'Tall tower or short tower? Shake them…', o: [O('The same way', 'balance-scale'), O('One much harder', 'flexed-biceps'), O('Only the tall one', TALL_ART)] },
      { t: 'In a fair test, how many things change?', o: [O('One thing', 'keycap-1'), O('Two things', 'keycap-2'), O('Everything', 'game-die')] }] },
  { pic: WIDE_ART, hint: 'A tower tips when its weight leans out past its base.', why: 'A wide base makes a tower hard to tip.',
    ask: [{ t: 'Which tower is hardest to knock over?', pic: 'building-construction', o: [O('Wide at the bottom', WIDE_ART), O('Wide at the top', TOPHEAVY_ART), O('Thin all the way', TALL_ART)] },
      { t: 'To make a tower safer, make the base…', pic: 'building-construction', o: [O('Wider', WIDE_ART), O('Thinner', TALL_ART), O('Wobbly', TOPHEAVY_ART)] }] },
  { pic: 'clipboard', hint: 'Scientists do not trust their memory. They write things down.', why: 'Scientists count and write down what they see.',
    ask: [{ t: 'You watch birds for science. What do you do?', pic: TUI, o: [O('Count and write', 'clipboard'), O('Just remember', 'thought-balloon'), O('Guess later', 'game-die')] },
      { t: 'Why do scientists write their counts down?', pic: 'magnifying-glass-tilted-left', o: [O('To compare later', 'balance-scale'), O('To look busy', 'zzz'), O('Just for fun', 'balloon')] }] },
  { pic: 'repeat-button', hint: 'One try can be a fluke. Scientists test again to be sure.', why: 'Test more than once to be sure.',
    ask: [{ t: 'Your tower fell once. To be sure, you…', pic: TOWERS_ART, o: [O('Test it again', 'repeat-button'), O('Stop there', 'stop-sign'), O('Change the answer', 'pencil')] },
      { t: 'One test is good. Three tests are…', pic: 'test-tube', o: [O('Better', 'thumbs-up'), O('Worse', 'thumbs-down'), O('Just the same', 'balance-scale')] }] }
], 'nz');

/* the shake-table experiment */
function quakeSetup(stage) {
  stage.innerHTML = '';
  const mk = (n, cls) => h('div', { class: 'twr ' + cls }, Array.from({ length: n }, (_, i) => h('i', { style: { background: BLK_COL[i % 6] } })));
  stage.append(h('div', { class: 'quake fill' }, h('div', { class: 'tbl' }, mk(6, 'tall'), mk(2, 'short'))));
}
async function quakeSim(stage, ui) {
  quakeSetup(stage); const q = $('.quake', stage), tall = $('.twr.tall', stage), short = $('.twr.short', stage);
  await ui.wait(1300); ui.prompt('Shake, shake, shake!'); q.classList.add('shake'); tall.classList.add('sway');
  for (let i = 0; i < 6; i++) { q.style.setProperty('--amp', (.12 + i * .09) + 'rem'); tall.style.setProperty('--sw', (1.5 + i * 1.5) + 'deg'); sfx.step(); await ui.wait(430); }
  /* the tall tower tumbles into a heap: four blocks along the table, two on top */
  const heap = [[-.5, 0], [.55, 0], [-1.6, 0], [1.65, 0], [-.55, 1], [.55, 1]];
  $$('i', tall).forEach((b, k) => { b.style.setProperty('--tx', 'calc(var(--b) * ' + heap[k][0] + ')'); b.style.setProperty('--ty', 'calc((var(--b) + .1rem) * ' + (k - heap[k][1]) + ')'); b.style.setProperty('--tr', ((k % 2 ? 1 : -1) * (6 + k * 5)) + 'deg'); });
  tall.classList.remove('sway'); tall.classList.add('fall'); sfx.bonk();
  short.style.setProperty('--sw', '1.5deg'); short.classList.add('sway'); await ui.wait(1300);
  q.classList.remove('shake'); short.classList.remove('sway'); await ui.wait(800);
}

/* a pot on the stove: steam lifts the lid */
const POT_ART = B64('<path d="M22 14q-5-5 0-10M32 12q-5-5 0-10M42 14q-5-5 0-10" stroke="#A9BAD6" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<g transform="rotate(-9 32 24)"><rect x="12" y="19" width="40" height="7" rx="3.500" fill="#6F7890"/><rect x="27" y="13" width="10" height="7" rx="3" fill="#1B2A4E"/></g>' +
  '<path d="M10 31q-6-1-6 4t6 4M54 31q6-1 6 4t-6 4" stroke="#6F7890" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M12 29h40v17q0 9-9 9H21q-9 0-9-9z" fill="#9AA3B5"/><path d="M12 29h40v5H12z" fill="#B9C1D1"/>' +
  '<path d="M20 62q-1-5 4-6 1 3 4 0 1 3 4 0 1 3 4 0 5 1 4 6z" fill="#FF9A3D"/><path d="M26 62q0-3 3-4 1 2 3 0 1 2 3 0 3 1 3 4z" fill="#FFC83D"/>');
/* the geyser lab: she heats water trapped underground and watches it boil into steam, a gas that needs far more room, until the pressure blasts it out.
   (Liquid water grows about 1,700 times in volume when it becomes steam at normal pressure.) */
const GEYSER_SVG = '<svg viewBox="0 -44 400 334" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A cut-away of a geyser: water in a space underground, hot rock below it, and a narrow pipe up to the surface"><rect y="-44" width="400" height="134" fill="#D4F1F9"/><g class="jet"><g transform="translate(200 90) scale(1.3 1.46) translate(-200 -90)"><path d="M190 90Q184 40 200 2Q216 40 210 90z" fill="#6EC3F4"/><path d="M196 90Q194 50 200 20Q206 50 204 90z" fill="#BDE7FF"/><circle cx="182" cy="26" r="9" fill="#fff" opacity=".9"/><circle cx="216" cy="20" r="11" fill="#fff" opacity=".9"/><circle cx="200" cy="10" r="10" fill="#fff"/><circle cx="170" cy="52" r="3.500" fill="#6EC3F4"/><circle cx="231" cy="46" r="3.500" fill="#6EC3F4"/><circle cx="164" cy="72" r="3" fill="#6EC3F4"/><circle cx="238" cy="70" r="3" fill="#6EC3F4"/></g></g><rect y="90" width="400" height="200" fill="#A9774F"/><path d="M0 90h172q14-12 28-12t28 12h172v10H0z" fill="#E9DFC8"/><path d="M0 128q100 10 200 0t200 0M0 200q60 8 110 0M290 200q60-8 110 0" stroke="#8E6140" stroke-width="3" fill="none" opacity=".6"/><rect class="hot" y="244" width="400" height="46" fill="#E5484D"/><path class="hot2" d="M0 244q25-9 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0v10H0z" fill="#FF9A3D"/><path d="M108 178q0-36 92-36t92 36v30q0 28-92 28t-92-28z" fill="#1F5F9E"/><rect x="189" y="84" width="22" height="64" fill="#3A2A20"/><rect class="pipew" x="189" y="84" width="22" height="64" fill="#2E86D1"/><path d="M108 178q0-36 92-36t92 36v30q0 28-92 28t-92-28z" fill="#2E86D1"/><ellipse class="steam" cx="200" cy="160" rx="78" ry="17" fill="#EAF6FF"/><circle class="bub" cx="140" cy="218" r="4.0" style="animation-delay:-0.00s"/><circle class="bub" cx="165" cy="218" r="5.0" style="animation-delay:-0.50s"/><circle class="bub" cx="190" cy="218" r="3.5" style="animation-delay:-0.90s"/><circle class="bub" cx="215" cy="218" r="5.0" style="animation-delay:-0.20s"/><circle class="bub" cx="240" cy="218" r="4.0" style="animation-delay:-0.70s"/><circle class="bub" cx="262" cy="218" r="3.5" style="animation-delay:-0.40s"/><circle class="wp" cx="175" cy="166" r="4.200" style="animation-delay:-1.30s"/><circle class="wp" cx="138" cy="188" r="4.200" style="animation-delay:-0.73s"/><circle class="wp" cx="136" cy="186" r="4.200" style="animation-delay:-0.07s"/><circle class="wp" cx="190" cy="162" r="4.200" style="animation-delay:-0.18s"/><circle class="wp" cx="189" cy="204" r="4.200" style="animation-delay:-0.25s"/><circle class="wp" cx="160" cy="193" r="4.200" style="animation-delay:-1.90s"/><circle class="wp" cx="211" cy="180" r="4.200" style="animation-delay:-1.95s"/><circle class="wp" cx="135" cy="206" r="4.200" style="animation-delay:-0.58s"/><circle class="wp" cx="149" cy="165" r="4.200" style="animation-delay:-0.62s"/><circle class="wp" cx="246" cy="168" r="4.200" style="animation-delay:-1.16s"/><circle class="wp" cx="220" cy="179" r="4.200" style="animation-delay:-1.10s"/><circle class="wp" cx="137" cy="161" r="4.200" style="animation-delay:-0.41s"/><circle class="wp" cx="226" cy="182" r="4.200" style="animation-delay:-0.63s"/><circle class="wp" cx="212" cy="183" r="4.200" style="animation-delay:-0.60s"/><text x="200" y="231" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" class="lw">water</text><text class="ls" x="200" y="165" text-anchor="middle" font-size="13" font-weight="700" fill="#1B2A4E">steam: a gas</text><text x="200" y="274" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">hot rock</text><g transform="translate(58 18)"><circle r="34" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><path d="M-24 10A26 26 0 0 1-13-22.500" stroke="#34C17B" stroke-width="7" fill="none"/><path d="M-13-22.500A26 26 0 0 1 13-22.500" stroke="#FFC83D" stroke-width="7" fill="none"/><path d="M13-22.500A26 26 0 0 1 24 10" stroke="#E5484D" stroke-width="7" fill="none"/><path class="needle" d="M0 4V-24" stroke="#1B2A4E" stroke-width="4" stroke-linecap="round"/><circle r="4.500" fill="#1B2A4E"/><text y="24" text-anchor="middle" font-size="11.500" font-weight="700" fill="#1B2A4E">pressure</text></g><g transform="translate(352 -16)"><rect x="-7" y="0" width="14" height="52" rx="7" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><circle cy="58" r="12" fill="#E5484D" stroke="#1B2A4E" stroke-width="3"/><rect class="merc" x="-3" y="6" width="6" height="48" fill="#E5484D"/></g><text class="gtemp" x="326" y="24" text-anchor="end" font-size="22" font-weight="700" fill="#1B2A4E">20°C</text></svg>';
function geyserSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'geyser fill', 'data-s': 'cold', html: GEYSER_SVG })); }
async function geyserSim(stage, ui) {
  geyserSetup(stage); const g = $('.geyser', stage), temp = $('.gtemp', g);
  const step = async (label, state, t, text, say) => { await ui.next(label); ui.check(); sfx.step(); g.dataset.s = state; temp.textContent = t; await Promise.all([Promise.race([ui.prompt(text, say), wait(12000)]), wait(2600)]); ui.check(); await ui.wait(400); };
  ui.prompt('Hot rock sits under the water. Heat it up!', 'Rain has soaked deep underground and filled a space in the rock. Hot rock sits just below it. Tap the button to heat the water.');
  await step('Heat it', 'warm', '60°C', 'The water gets hotter. Its particles jiggle faster.', 'The water is getting hotter. Water is made of tiny particles. As it heats up, they jiggle faster and faster.');
  await step('Heat it more', 'boil', '100°C', 'It boils! Liquid water turns into steam, a gas.', 'One hundred degrees. It boils! Liquid water is turning into steam. Steam is still water, but now it is a gas.');
  await step('Keep heating', 'press', '100°C', 'Steam needs far more room. Trapped, its pressure builds.', 'In a gas, the particles fly far apart. Steam needs more than a thousand times the room the water did. But the rock traps it. So the steam pushes harder and harder. That push is called pressure. Watch the pressure dial.');
  await ui.wait(700); g.dataset.s = 'erupt'; sfx.win();
  await Promise.all([Promise.race([ui.prompt('Whoosh! The pressure blasts water and steam out.', 'Whoosh! The pressure blasts the water and steam up the pipe and out of the ground. That is a geyser.'), wait(8000)]), wait(3200)]); ui.check(); await ui.wait(600);
}

/* sailing looks for the coding grid */
const SEA = { mover: 'canoe', goal: 'desert-island', goalName: 'island', flag: 'glowing-star', flagName: 'star', cls: 'sea' };

const MI = (t, phon) => ({ t, lang: 'mi', fallback: phon });

/* ----- tukutuku: six traditional patterns, easiest first. Thread 1 is white (kiekie), thread 2 is gold (pīngao).
   Each rule gives the thread for a crossing from d (squares from the upright mirror line), e (squares from the level line) and y (row from the top).
   Sources for the patterns and their meanings: Pūawaitanga o te Ringa (Christchurch City Libraries) and Te Ara. ----- */
const TUKUTUKU = [
  { id: 'niho', name: 'niho taniwha', means: "the taniwha's teeth", sym: 1, threads: 1, look: 'black', wide: [6, 6], tall: [6, 6],
    at: (d, e, y) => d <= y % 3 ? 1 : 0,
    done: { text: 'Niho taniwha: the teeth of the taniwha!', say: [MI('niho taniwha', 'nee-haw tah-nee-fah'), 'You wove the teeth of the taniwha!'] } },
  { id: 'poutama', name: 'poutama', means: 'the stairway of learning', sym: 1, threads: 2, look: 'red', wide: [8, 6], tall: [8, 6],
    at: (d, e, y, H) => [0, 2, 1][(Math.floor(d / 2) + Math.floor((H - 1 - y) / 2)) % 3],
    done: { text: 'Poutama: the stairway. Keep climbing and learning!', say: [MI('poutama', 'poe-tah-mah'), 'This is the stairway. It stands for climbing up, step by step, as you learn.'] } },
  { id: 'kaokao', name: 'kaokao', means: 'strong arms in a haka', sym: 1, threads: 2, look: 'black', wide: [10, 6], tall: [8, 8],
    at: (d, e, y) => [1, 2, 0, 0][(d + y) % 4],
    done: { text: 'Kaokao: the strong arms of a haka.', say: [MI('kaokao', 'kow-kow'), 'These zigzags stand for the strong arms of warriors doing a haka.'] } },
  { id: 'roimata', name: 'roimata toroa', means: 'the tears of the albatross', sym: 1, threads: 1, look: 'red', wide: [12, 6], tall: [8, 9],
    at: (d, e, y) => (d + 2 * Math.floor(y / 3)) % 4 < 2 ? 1 : 0,
    done: { text: 'Roimata toroa: the tears of the albatross.', say: [MI('roimata toroa', 'roy-mah-tah taw-raw-ah'), 'These falling lines are the tears of the albatross.'] } },
  { id: 'patiki', name: 'pātiki', means: 'the flounder', sym: 2, threads: 2, look: 'black', wide: [10, 8], tall: [8, 10], low: [10, 6],
    at: (d, e) => [2, 0, 1, 0, 2, 0, 1, 0, 2][d + e],
    done: { text: 'Pātiki: the flounder. It means food to share.', say: [MI('pātiki', 'pah-tee-kee'), 'This diamond is the flounder, a flat fish. It stands for having plenty of food to share.'] } },
  { id: 'patikitiki', name: 'pātikitiki', means: 'many flounder', sym: 2, threads: 2, look: 'red', wide: [12, 6], tall: [6, 12],
    at: (d, e) => [2, 0, 1, 0, 2][[0, 1, 2, 2, 1, 0][d % 6] + [0, 1, 2, 2, 1, 0][e % 6]],
    done: { text: 'Pātikitiki: many flounder. Plenty for everyone!', say: [MI('pātikitiki', 'pah-tee-kee-tee-kee'), 'Lots of little diamonds: many flounder. Plenty for everyone!'] } }
];

COUNTRIES.nz = {
  cheers: ['Ka pai!'],   /* a cheer in this country's own language, used only here */
  ladders: ['weave'],   /* making activities that keep their own progress; a country reset puts them back to the start */
  name: 'New Zealand', hello: 'Kia ora! Start with Navigator maths.', helloSay: [MI('Kia ora!', 'kee-a aw-ra'), 'Start with Navigator maths.'], scene: NZ_SCENE,
  thing: 'kiwi-fruit', boat: 'waka',
  /* words that need a real recorded voice (grown-ups page): the six taught words, the bird names, the weaving patterns */
  voices: { lang: 'mi', label: 'te reo Māori',
    groups: [{ title: 'Words taught in Kia ora!', words: TEREO.map(w => w.native) }, { title: 'Bird names', words: Object.keys(BIRD_SAY) }, { title: 'Weaving patterns', words: TUKUTUKU.map(p => p.name) }],
    words: TEREO.map(w => w.native).concat(Object.keys(BIRD_SAY), TUKUTUKU.map(p => p.name)),
    means: Object.assign({}, ...TEREO.map(w => ({ [w.native]: w.en })), ...TUKUTUKU.map(p => ({ [p.name]: p.means }))) },
  videos: {
    quake: { yt: 'dJpIU1rSOFY', title: 'What is an earthquake?', by: 'Peekaboo Kidz', icon: QUAKE_ART },
    way: { yt: 'm8bDCaPhOek', title: 'How wayfinders crossed the Pacific', by: 'TED-Ed', icon: 'canoe' },
    kiwi: { yt: 'NPc25pbM95c', title: 'The furry kiwi bird', by: 'National Geographic', icon: KIWI_BIRD },
    volcano: { yt: 'lAmqsMQG3RM', title: 'Volcanoes', by: 'Peekaboo Kidz', icon: 'volcano' }
  },
  souvenirs: [
    { id: 'nz-compass', art: 'compass', name: 'Compass', price: 15, need: 'm1' }, { id: 'nz-kiwifruit', art: 'kiwi-fruit', name: 'Kiwifruit', price: 8, need: 'm1' },
    { id: 'nz-volcano', art: 'volcano', name: 'Volcano', price: 25, need: 'm2' }, { id: 'nz-hotpool', art: 'hot-springs', name: 'Hot pool', price: 15, need: 'm2' },
    { id: 'nz-kiwi', art: KIWI_BIRD, move: 'hop', name: 'Kiwi', price: 30, need: 'm3' }, { id: 'nz-tui', art: TUI, move: 'flap', name: 'Tūī', price: 25, need: 'm3' },
    { id: 'nz-waka', art: 'canoe', move: 'rock', name: 'Waka', price: 30, need: 'm4' }, { id: 'nz-whale', art: 'spouting-whale', move: 'swim', name: 'Whale', price: 40, need: 'boss' }
  ],
  themes: { bush: { name: 'Kiwi bush', price: 40, need: 'boss', wall: '#DDF2D3', wall2: '#CBEABD', floor: '#5E9E63', line: '#4B864F', rug: '#C9643B', sky: ['#4FC0EE', '#E9F9EE'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['quake'] }, { id: 'v2', after: ['boss'], choose: ['way', 'kiwi', 'volcano'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Navigator maths', icon: 'compass', sticker: 'compass',
      intro: { text: 'Navigators crossed the sea with stars and maths!', say: [MI('Kia ora!', 'kee-a aw-ra'), 'Long ago, navigators crossed the ocean with no map. They used the stars, and maths. Ready?'] },
      rounds: [{ skill: 'turns' }, { skill: 'fractions' }, { skill: 'graphs' }, { skill: '@review', or: 'addsub' }, { skill: 'turns' }, { skill: 'fractions' }, { skill: 'graphs' }, { skill: '@review', or: 'patterns' }] },
    { id: 'm2', name: 'Shaky lab', icon: 'volcano', sticker: 'volcano',
      intro: { text: 'Volcanoes, earthquakes, geysers. Find out why!', say: 'New Zealand has volcanoes, earthquakes and geysers. Today you are an Earth scientist. Let us find out why.' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on its layer.', say: 'The Earth has layers, like an onion. The crust is the thin skin on the outside. Under it is the thick mantle. Then the outer core. Right in the middle is the inner core. Put each name on its layer.',
          board: EARTH_BOARD, items: LAYERS, done: { text: 'You labelled the whole Earth. Well done!' } },
        { act: 'match', text: 'Match each word to what happens.', pairs: [
          { a: { art: 'volcano', label: 'Volcano' }, b: { art: 'fire', label: 'Lava bursts out' }, text: 'Lava is melted rock from deep underground.' },
          { a: { art: QUAKE_ART, label: 'Earthquake' }, b: { art: 'house', label: 'Ground shakes' }, text: 'Giant pieces of crust move. The ground shakes!' },
          { a: { art: 'hot-springs', label: 'Geyser' }, b: { art: 'fountain', label: 'Hot water shoots up' }, text: 'Hot rock boils water into steam. Pressure blasts it up!' },
          { a: { art: PLATES_ART, label: 'Plates' }, b: { art: 'puzzle-piece', label: 'Pieces of crust' }, text: "Earth's crust is cracked into giant plates." }] },
        { act: 'predict', q: 'Hot rock boils water trapped underground. What happens?', qsay: 'Here is an experiment. Rain water is trapped in a space deep underground. Hot rock boils it. What do you think happens? Make a prediction.',
          options: [O('It bursts out', 'fountain'), O('It stays put', 'rock'), O('It turns to ice', 'ice')], answer: 0, setup: geyserSetup, sim: geyserSim,
          right: 'You predicted it! Steam pressure blasted the water out.', wrong: 'Surprise! Steam pressure blasted the water out. Now we know.',
          tryit: { icon: POT_ART, big: 'Watch the lid jump!', text: 'With a grown-up: boil a pot with its lid on.', say: 'Now try it, with a grown-up. Put a lid on a pot of water and heat it. When the water boils, it turns into steam. Steam needs more room, so it pushes the lid up and makes it rattle. Stand back. Steam is very hot.' } },
        { act: 'order', text: 'How does a geyser blow? Tap in order.', say: 'Rotorua has geysers. The biggest can shoot as high as a ten storey building. How does a geyser blow? Tap the pictures in order.',
          steps: [{ icon: 'cloud-with-rain', label: 'Rain soaks in', say: 'First, rain soaks down into the ground.' }, { icon: 'fire', label: 'Hot rock heats it', say: 'Deep down, hot rock heats the water.' }, { icon: 'hot-springs', label: 'Steam pressure builds', say: 'The water boils into steam. Trapped steam builds pressure.' }, { icon: 'fountain', label: 'It blasts out', say: 'Whoosh! The pressure blasts water and steam into the sky.' }],
          hints: ['First, water has to get underground.', 'Next, what makes the water hot?', 'Then the water boils. What does trapped steam build?', 'Last, the pressure has to go somewhere!'] },
        { skill: 'earth' }, { skill: 'earth' }, { skill: 'earth' },
        { act: 'predict', q: 'Shake the table. Which tower falls first?', qsay: 'Here is an experiment. Two towers stand on a table. We shake the table, like an earthquake. Which tower falls first? Make a prediction.',
          options: [O('Tall tower', TALL_ART), O('Short tower', SHORT_ART), O('Both together', TOWERS_ART)], answer: 0, setup: quakeSetup, sim: quakeSim,
          right: 'You predicted it! The tall tower tipped first.', wrong: 'Surprise! The tall tower tipped first. Now we know.',
          tryit: { icon: TOWERS_ART, big: 'Build and shake!', text: 'Your turn. Build two towers. Shake the table gently.', say: 'Now you try. Build one tall tower and one short tower from blocks. Shake the table gently. Which one falls first?' } },
        { skill: 'scithink' }, { skill: 'scithink' }] },
    { id: 'm3', name: 'Kia ora!', nameSay: { t: 'Kia ora!', lang: 'mi', inline: true, fallback: 'kee-a aw-ra' }, icon: KIWI_BIRD, sticker: KIWI_BIRD,
      intro: { text: 'Find Aotearoa, learn te reo, meet the birds!', say: 'Time to find New Zealand on the map, learn some Māori words, and meet the birds.' },
      rounds: [
        { act: 'findmap', text: 'Where is New Zealand? Tap it.', say: 'This is the bottom of the world map. Where is New Zealand? Tap it.', view: [786, 292, 192, 168], targets: ['554', '036', '598'], answer: '554',
          hint: { text: 'New Zealand is two long islands, far to the south.' }, done: { text: 'You found Aotearoa New Zealand. That is home!', say: 'You found New Zealand. That is home!' } },
        { act: 'meet', text: 'Tap each card to hear te reo Māori.', say: 'Te reo Māori is the first language of New Zealand. Tap each card to hear the word.',
          textRead: 'Tap each card. Say the word out loud!', sayRead: 'Te reo Māori is the first language of New Zealand. Tap each card, read the word, and say it out loud.', lang: 'mi', words: TEREO },
        { skill: 'tereo' }, { skill: 'tereo' }, { skill: 'tereo' },
        { act: 'sort', even: true, text: 'Can this bird fly?', say: 'New Zealand has birds found nowhere else. Some of them cannot fly! Can this bird fly?', bins: [{ label: 'Can fly', icon: 'wing' }, { label: 'Cannot fly', icon: 'footprints' }],
          items: [{ art: KIWI_BIRD, label: 'Kiwi', say: bird1('kiwi'), bin: 1, why: 'Kiwi have tiny wings. They walk and sniff.' }, { art: KAKAPO, label: 'Kākāpō', say: bird1('kākāpō'), bin: 1, why: 'Kākāpō are too heavy to fly. They climb!' },
            { art: TAKAHE, label: 'Takahē', say: bird1('takahē'), bin: 1, why: 'Takahē are big and strong, but cannot fly.' }, { art: KORORA, label: 'Kororā', say: bird1('kororā'), bin: 1, why: 'Kororā are little penguins. They swim, not fly.' },
            { art: TUI, label: 'Tūī', say: bird1('tūī'), bin: 0, why: 'Tūī fly fast and sing loud songs.' }, { art: KERERU, label: 'Kererū', say: bird1('kererū'), bin: 0, why: 'Kererū fly with big, noisy wing beats.' },
            { art: PIWAKAWAKA, label: 'Pīwakawaka', say: bird1('pīwakawaka'), bin: 0, why: 'Pīwakawaka flit about, catching bugs in the air.' }, { art: KEA, label: 'Kea', say: bird1('kea'), bin: 0, why: 'Kea are clever parrots that fly over mountains.' }],
          done: { text: 'No hunters long ago, so some birds stopped flying!' , say: 'Long ago, New Zealand had no animals that hunted birds. So some birds stopped flying.' } },
        { act: 'order', text: 'How did people first get here? Tap in order.', say: 'Long ago, Polynesian explorers sailed across the biggest ocean on Earth to find New Zealand. How did they do it? Tap the pictures in order.',
          steps: [{ icon: 'hammer', label: 'Build a waka', say: 'First, they built a great canoe: a waka.' }, { icon: 'milky-way', label: 'Follow the stars', say: 'At night, the stars showed the way.' }, { art: KERERU, label: 'Watch the birds', say: 'Birds fly home to land. Follow them!' }, { icon: 'snow-capped-mountain', label: 'Land!', say: 'A long white cloud. Land ahead!' }],
          hints: ['First they needed something to sail in.', 'At night, what shows the way?', 'Near land, something flies home each evening.', 'Last, they arrive!'] }] },
    { id: 'm4', name: 'Waka voyage', icon: 'canoe', sticker: 'canoe',
      intro: { text: 'Weave tukutuku. Then steer the waka!', say: 'First, weave two tukutuku panels. Then write code to steer the waka across the sea.' },
      rounds: [
        { act: 'weave', panels: TUKUTUKU }, { act: 'weave', panels: TUKUTUKU },
        { act: 'code', look: SEA, text: 'Steer the waka to the island.', say: 'Count the squares to the island. Tap or drag arrows into the boxes to make a path. Then tap Go.', cols: 5, rows: 3, start: [0, 2], goal: [4, 0], rocks: [[2, 2], [2, 1]], slots: 7,
          path: [[0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], legs: [[0, 0], [4, 0]], solution: [['u'], ['u'], ['r'], ['r'], ['r'], ['r']] },
        { act: 'code', look: Object.assign({}, SEA, { rock: 'spouting-whale' }), text: 'Sail around the whales!', say: 'This one is longer. Sail around the whales.', cols: 5, rows: 4, start: [0, 0], goal: [4, 3], rocks: [[1, 0], [1, 1], [3, 2], [3, 3]], slots: 10,
          path: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [3, 1], [4, 1], [4, 2], [4, 3]], legs: [[0, 2], [2, 2], [4, 1], [4, 3]], solution: [['d'], ['d'], ['r'], ['r'], ['u'], ['r'], ['r'], ['d'], ['d']] },
        { act: 'code', look: SEA, text: 'Only 3 boxes! Tap an arrow, then a number.', say: 'A long trip, but only three boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 4, start: [0, 0], goal: [5, 3], rocks: [[4, 0], [0, 2], [1, 2]], slots: 3, repeat: true,
          path: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [4, 3], [5, 3]], legs: [[3, 0], [3, 3], [5, 3]], solution: [['r', 3], ['d', 3], ['r', 2]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'milky-way',
      intro: { text: 'Show everything you know about Aotearoa!', say: 'The big one! Show everything you have learned in New Zealand.' },
      rounds: [{ skill: 'turns' }, { skill: 'earth' }, { skill: 'fractions' }, { skill: 'tereo' }, { act: 'weave', panels: TUKUTUKU }, { skill: 'graphs' }, { skill: 'scithink' }, { skill: '@review', or: 'addsub' }, { skill: '@review', or: 'shapes' }] }
  ]
};
