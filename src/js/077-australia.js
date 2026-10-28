/* ===== Australia: the fourth country. Everything here is content, not code.
   (B64, B32 and O, the small helpers, come from the earlier files.)
   Three labs she works herself: the coral lab (photosynthesis, symbiosis, bleaching), the seasons lab (the Earth's tilt) and the sound lab (vibration and pitch).
   Sources: Woods Hole Oceanographic Institution, "Why do corals bleach?"; Wikipedia, "Didgeridoo" (developed by Aboriginal peoples of northern Australia; its age is not agreed, so the game says "many hundreds of years"; made from eucalyptus hollowed by termites);
   Wikipedia, "List of English words of Australian Aboriginal origin". ===== */

/* ----- hand-drawn pieces ----- */
const PLATYPUS = B64('<path d="M8 38q-7 3-6 9 9 2 13-5z" fill="#6B4A32"/><ellipse cx="30" cy="38" rx="20" ry="11" fill="#8A6244"/><path d="M14 34q14-8 30 0" stroke="#6B4A32" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<path d="M20 47l-3 7h8zM38 47l-2 7h8z" fill="#6B4A32"/><ellipse cx="47" cy="33" rx="9" ry="8" fill="#8A6244"/><path d="M53 31q10 0 10 4.500t-10 3.500z" fill="#3E4A5E" stroke="#2B3445" stroke-width="1" stroke-linejoin="round"/><circle cx="57" cy="33.500" r=".9" fill="#1B2A4E"/>' +
  '<circle cx="48" cy="30" r="2.300" fill="#fff"/><circle cx="48.600" cy="30" r="1.400" fill="#1B2A4E"/>');
const ECHIDNA = B64('<g stroke="#5A4332" stroke-width="2.600" stroke-linecap="round"><path d="M14 34 8 22M19 29 15 15M25 26 23 11M31 25 32 10M37 26 41 12M42 29 49 17M22 33 17 24M30 31 30 20M38 32 43 23"/></g>' +
  '<g stroke="#F3E3B5" stroke-width="1.300" stroke-linecap="round"><path d="M9 23.500 8 22M15.800 17 15 15M23.300 13 23 11M31.900 12 32 10M40.500 14 41 12M48 18.500 49 17"/></g>' +
  '<ellipse cx="28" cy="41" rx="19" ry="12" fill="#7A5A44"/><path d="M17 51v5m-3 0h6M37 51v5m-3 0h6" stroke="#5A4332" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<path d="M44 38q8-2 18 4-10 3-18 2z" fill="#5A4332"/><circle cx="43" cy="37" r="2.200" fill="#fff"/><circle cx="43.600" cy="37" r="1.300" fill="#1B2A4E"/>');
const ALGAE_ART = B32('<circle cx="10" cy="11" r="5.500" fill="#7FB34A"/><circle cx="21" cy="9" r="4.500" fill="#9CC95C"/><circle cx="23" cy="20" r="6" fill="#7FB34A"/><circle cx="12" cy="22" r="4.800" fill="#9CC95C"/><circle cx="16.500" cy="15.500" r="3.200" fill="#5E9335"/>' +
  '<circle cx="9" cy="10" r="1.500" fill="#DDF0B6"/><circle cx="22" cy="19" r="1.700" fill="#DDF0B6"/>');
const SEAGRASS_ART = B32('<path d="M3 29h26" stroke="#E3C98A" stroke-width="3" stroke-linecap="round"/><g fill="none" stroke-linecap="round" stroke-width="2.800"><path d="M8 28q-3-10 1-20" stroke="#3FA36B"/><path d="M13 28q4-12-1-23" stroke="#57BF7F"/><path d="M18 28q-4-9 2-18" stroke="#3FA36B"/><path d="M23 28q3-11-2-21" stroke="#57BF7F"/></g>');
const KELP_ART = B32('<path d="M3 29h26" stroke="#E3C98A" stroke-width="3" stroke-linecap="round"/><path d="M16 29Q10 22 17 16T15 3" stroke="#8A7A2E" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
  '<g fill="#A9983B"><ellipse cx="11" cy="23" rx="4.500" ry="2" transform="rotate(-25 11 23)"/><ellipse cx="21" cy="18" rx="4.500" ry="2" transform="rotate(25 21 18)"/><ellipse cx="11.500" cy="12" rx="4.500" ry="2" transform="rotate(-25 11.500 12)"/><ellipse cx="20" cy="7" rx="4.500" ry="2" transform="rotate(25 20 7)"/></g>');
/* a painted wooden tube, w squares long: the longer the tube, the lower its note */
const tubeArt = w => B32('<rect x="' + (16 - w / 2) + '" y="12" width="' + w + '" height="8" rx="3" fill="#8A5A34" stroke="#1B2A4E" stroke-width="1"/>' + [0.22, 0.5, 0.78].map((t, i) => '<rect x="' + (16 - w / 2 + w * t - 1) + '" y="12.500" width="2" height="7" fill="' + ['#F3E3B5', '#E5484D', '#F3E3B5'][i] + '"/>').join('') + '<ellipse cx="' + (16 + w / 2 - 1) + '" cy="16" rx="1.200" ry="3" fill="#3A2416"/>');
const TUBE_4 = tubeArt(28), TUBE_3 = tubeArt(21), TUBE_2 = tubeArt(14), TUBE_1 = tubeArt(8);
const DIDGE_ART = B64('<g transform="rotate(-28 32 32)"><rect x="4" y="27" width="56" height="10" rx="4" fill="#8A5A34" stroke="#1B2A4E" stroke-width="1.500"/><path d="M14 27.800v8.400M20 27.800v8.400" stroke="#F3E3B5" stroke-width="2.400"/><path d="M30 27.800v8.400" stroke="#E5484D" stroke-width="3"/><path d="M40 27.800v8.400M46 27.800v8.400" stroke="#F3E3B5" stroke-width="2.400"/><ellipse cx="57.500" cy="32" rx="2" ry="3.800" fill="#3A2416"/></g>');
const ULURU_ART = B64('<rect x="2" y="2" width="60" height="60" rx="14" fill="#8FD3F4"/><circle cx="48" cy="16" r="7" fill="#FFC83D"/><path d="M2 46h60v6q0 10-14 10H16Q2 62 2 52z" fill="#D98A4E"/><path d="M8 46q2-16 12-18 12-3 24 0 10 3 12 18z" fill="#C8552F"/><path d="M18 30v15M26 28v17M36 28v17M45 31v14" stroke="#A8421F" stroke-width="1.600" stroke-linecap="round"/>');
const BOTTLE_ART = B32('<path d="M13 3h6v7q5 3 5 9v8q0 2-2 2H10q-2 0-2-2v-8q0-6 5-9z" fill="#CDEBFF" stroke="#1B2A4E" stroke-width="1.300" stroke-linejoin="round"/><path d="M8.700 21h14.600v6q0 1.300-1.300 1.300H10q-1.300 0-1.300-1.300z" fill="#3BA7F0"/><path d="M4 6q4-3 8 0M22 2q3 2 3 6" stroke="#8B7BEA" stroke-width="1.400" fill="none" stroke-linecap="round"/>');
/* a mangrove: arching prop roots standing in the sea */
const MANGROVE_ART = B32('<path d="M1 26q3.500-2 7 0t7 0 7 0 7 0 2 0v5H1z" fill="#8FD3F4"/><g fill="none" stroke="#7A5234" stroke-width="1.700" stroke-linecap="round"><path d="M16 17v-5M16 17q-7 2-9 10M16 17q-3 3-4 10M16 17v10M16 17q3 3 4 10M16 17q7 2 9 10"/></g>' +
  '<g fill="#3F9E57"><ellipse cx="16" cy="8.500" rx="11" ry="6.500"/><ellipse cx="9" cy="11" rx="6" ry="4"/><ellipse cx="23" cy="11" rx="6" ry="4"/></g><g fill="#63BF74"><ellipse cx="12" cy="6.500" rx="5" ry="2.600"/><ellipse cx="21" cy="8" rx="4" ry="2"/></g><path d="M1 28q3.500-2 7 0t7 0 7 0 7 0 2 0" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>');
/* the try-it for the seasons: a lamp for the Sun and a ball on a stick, carried round it, leaning the same way all the way round. The red sticker is Australia */
const SEASONS_MODEL = (() => { const ball = (x, y) => '<g transform="translate(' + x + ' ' + y + ') rotate(23.500)"><path d="M0-24V24" stroke="#8A5A34" stroke-width="3" stroke-linecap="round"/><circle r="15" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="2"/><ellipse rx="15" ry="3.500" fill="none" stroke="#fff" stroke-width="1.300" opacity=".85"/><circle cx="0" cy="7.500" r="3.400" fill="#E5484D" stroke="#fff" stroke-width="1"/></g>';
  const arrow = (x, y, r) => '<path transform="translate(' + x + ' ' + y + ') rotate(' + r + ')" d="M-6-5 4 0-6 5z" fill="#8B7BEA"/>';
  return { svg: '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A lamp in the middle and a ball on a tilted stick at four places around it, always leaning the same way">' +
    '<ellipse cx="160" cy="95" rx="112" ry="62" fill="none" stroke="#8B7BEA" stroke-width="2.500" stroke-dasharray="2 8" stroke-linecap="round"/>' + arrow(100, 148, 12) + arrow(222, 42, 192) + arrow(256, 132, -52) + arrow(64, 58, 128) +
    '<circle cx="160" cy="88" r="30" fill="#FFE27A" opacity=".45"/><g stroke="#FFC83D" stroke-width="3" stroke-linecap="round"><path d="M160 46v-9M196 62l7-6M124 62l-7-6M204 90h9M116 90h-9"/></g><circle cx="160" cy="86" r="17" fill="#FFC83D" stroke="#1B2A4E" stroke-width="2"/><path d="M152 101h16v9h-16z" fill="#C9CEDA" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/><path d="M146 110h28l4 10h-36z" fill="#5A678A" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/>' +
    ball(48, 95) + ball(160, 157) + ball(272, 95) + ball(160, 30) + '</svg>' }; })();
/* the Earth cut in two by the equator, for naming its halves. The globe is the drawn one (Asia and Australia); the dots are places she knows */
const dotAt = (x, y, col, name, dx) => '<circle cx="' + x + '" cy="' + y + '" r="2.200" fill="' + col + '" stroke="#fff" stroke-width=".7"/><text x="' + (x + (dx || 3.500)) + '" y="' + (y + 1.300) + '" font-size="3.800" font-weight="700" fill="#fff" stroke="#1B2A4E" stroke-width="1.100" paint-order="stroke" stroke-linejoin="round">' + name + '</text>';
const EQUATOR_LINE = '<path d="M18.400 56.100Q51 61 84.200 56.100" stroke="#fff" stroke-width="2.200" fill="none" stroke-linecap="round"/><path d="M18.400 56.100Q51 61 84.200 56.100" stroke="#E5484D" stroke-width="1.300" fill="none" stroke-dasharray="2.600 2.200" stroke-linecap="round"/>';
const GLOBE_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="6" fill="#1E2A5A"/><g fill="#fff" opacity=".7"><circle cx="8" cy="10" r=".5"/><circle cx="92" cy="14" r=".5"/><circle cx="90" cy="90" r=".5"/><circle cx="9" cy="86" r=".4"/><circle cx="50" cy="6" r=".4"/></g>' +
  V.pic('globe-showing-asia-australia', 12, 12, 76) + EQUATOR_LINE + dotAt(56.800, 43.200, '#FFC83D', 'Japan') + dotAt(56.800, 68.200, '#E5484D', 'Australia', -21) + dotAt(69, 73.600, '#fff', 'NZ') + '</svg>';
const GLOBE_PARTS = [
  { id: 'north', label: 'Northern hemisphere', x: 34, y: 30, w: 12, fact: { text: 'The top half is the northern hemisphere. Japan is in it.' }, hint: { text: 'Northern means north: the half above the dotted line.' } },
  { id: 'eq', label: 'Equator', x: 91, y: 56, w: 12, fact: { text: 'The equator is a pretend line round the middle of the Earth.' }, hint: { text: 'The equator is the dotted line round the middle.' } },
  { id: 'south', label: 'Southern hemisphere', x: 32, y: 78, w: 12, fact: { text: 'Australia and New Zealand are in the southern hemisphere.' }, hint: { text: 'Southern means south: the half below the dotted line.' } }
];
const EARTH_EQ = B64(V.pic('globe-showing-asia-australia', 2, 2, 60) + '<path d="M7 36.500Q32.500 40.500 59 36.500" stroke="#fff" stroke-width="2.400" fill="none" stroke-linecap="round"/><path d="M7 36.500Q32.500 40.500 59 36.500" stroke="#E5484D" stroke-width="1.500" fill="none" stroke-dasharray="3 2.500" stroke-linecap="round"/><circle cx="37.500" cy="46.500" r="3" fill="#E5484D" stroke="#fff" stroke-width="1"/>');
const LAMP_BALL = B32('<circle cx="9" cy="16" r="6" fill="#FFC83D"/><g stroke="#FFC83D" stroke-width="1.600" stroke-linecap="round"><path d="M9 6.500v-3M9 28.500v-3M1.500 16h-1M16.500 16h1M3.500 10.500 1.500 8.500M3.500 21.500 1.500 23.500"/></g>' +
  '<g transform="rotate(23 23 16)"><circle cx="23" cy="16" r="6.500" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="1"/><path d="M23 7v18" stroke="#1B2A4E" stroke-width="1.200" stroke-linecap="round"/><circle cx="24.500" cy="19.500" r="1.600" fill="#E5484D"/></g>');

/* the leaning Earth, for the seasons questions: sun is 'l' (the south leans towards it), 'r' (the south leans away) or '' (the Earth alone); the red dot is Australia, the yellow dot Japan */
const tiltArt = (sun, japan) => { const ex = sun === 'l' ? 44 : sun === 'r' ? 20 : 32, sx = sun === 'l' ? 11 : 53, R = sun ? 13 : 19, k = R / 13;
  return B64((sun ? '<circle cx="' + sx + '" cy="32" r="12" fill="#FFC83D" opacity=".3"/><circle cx="' + sx + '" cy="32" r="8" fill="#FFC83D"/><g stroke="#F5B400" stroke-width="1.600" stroke-linecap="round" stroke-dasharray="1 4">' + [-6, 0, 6].map(o => '<path d="M' + (sun === 'l' ? sx + 11 : sx - 11) + ' ' + (32 + o) + 'H' + (sun === 'l' ? ex - R - 2 : ex + R + 2) + '"/>').join('') + '</g>' : '') +
    '<g transform="translate(' + ex + ' 32) rotate(23.500) scale(' + k + ')"><path d="M0-19V19" stroke="#1B2A4E" stroke-width="1.600" stroke-linecap="round"/><circle r="13" fill="#3BA7F0" stroke="#1B2A4E" stroke-width="1"/><ellipse rx="13" ry="3" fill="none" stroke="#fff" stroke-width=".9" opacity=".85"/>' +
    '<path d="M-7-8q4-3 7 0t5 1q-2 4-6 4t-6-5z" fill="#57BF7F"/><path d="M-4 4q5-2 7 2-2 4-6 3z" fill="#57BF7F"/><circle cx="0" cy="6.500" r="2.300" fill="#E5484D" stroke="#fff" stroke-width=".7"/>' + (japan ? '<circle cx="0" cy="-6.500" r="1.900" fill="#FFC83D" stroke="#fff" stroke-width=".6"/>' : '') + '</g>'); };
const EARTH_TILT = tiltArt(''), TILT_IN = tiltArt('l'), TILT_BOTH = tiltArt('l', true);

/* the coral polyp, cut open, for naming its parts */
const coralPolyp = (body, alg) => '<path d="M22 96q0-10 8-12h40q8 2 8 12z" fill="#E9E4D8" stroke="#1B2A4E" stroke-width="1.200" stroke-linejoin="round"/><path d="M30 84q-3-22 2-34h36q5 12 2 34z" fill="' + body + '" stroke="#1B2A4E" stroke-width="1.400" stroke-linejoin="round"/>' +
  '<g stroke="#1B2A4E" stroke-width="1.200" stroke-linejoin="round" fill="' + body + '"><path d="M32 51Q24 36 26 22q5 1 7 10 2 9 5 19z"/><path d="M41 50Q38 34 43 18q5 3 4 12-1 10 0 20z"/><path d="M53 50q1-10 0-20-1-9 4-12 5 16 2 32z"/><path d="M62 51q3-10 5-19 2-9 7-10 2 14-6 29z"/></g>' +
  '<ellipse cx="50" cy="52" rx="7" ry="2.600" fill="#B6513B"/>' + alg;
const CORAL_ALGAE = [[36, 60], [44, 66], [38, 74], [47, 78], [55, 62], [62, 68], [58, 76], [64, 58], [41, 58], [52, 71]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.300" fill="#6FA83A"/>').join('');
const CORAL_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="6" fill="#BDEBF5"/><path d="M0 90q25-8 50 0t50 0v10H0z" fill="#EBD9A6"/>' + coralPolyp('#F29B7A', CORAL_ALGAE) + '</svg>';
const CORAL_PARTS = [
  { id: 'tent', label: 'Tentacles', x: 20, y: 22, w: 12, fact: { text: 'Tentacles catch tiny food that drifts past.' }, hint: { text: 'The tentacles are the waving arms at the top.' } },
  { id: 'mouth', label: 'Mouth', x: 50, y: 44, w: 12, fact: { text: 'The mouth is in the middle of the tentacles.' }, hint: { text: 'The mouth is the dark opening in the middle.' } },
  { id: 'algae', label: 'Algae', x: 80, y: 66, w: 12, fact: { text: 'Tiny algae live inside. They make food from sunlight.' }, hint: { text: 'The algae are the little green dots inside.' } },
  { id: 'skel', label: 'Skeleton', x: 20, y: 90, w: 12, fact: { text: 'The hard skeleton is what builds the reef.' }, hint: { text: 'The skeleton is the hard white cup at the bottom.' } }
];

/* ----- the scene behind the mission path: Uluru, red earth, a gum tree and a kangaroo ----- */
const gumTree = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-7 0q5-50-2-96h16q-6 46 6 96z" fill="#E9E1D2"/><path d="M0-58q-30-16-44-44M4-70q22-18 34-48M-2-84q-8-22-2-44" stroke="#E9E1D2" stroke-width="8" stroke-linecap="round" fill="none"/>' +
  '<g fill="#6FA86B"><ellipse cx="-50" cy="-112" rx="40" ry="24"/><ellipse cx="44" cy="-126" rx="42" ry="26"/><ellipse cx="-6" cy="-142" rx="46" ry="26"/></g><g fill="#8CC487"><ellipse cx="-36" cy="-124" rx="22" ry="12"/><ellipse cx="24" cy="-144" rx="24" ry="12"/><ellipse cx="54" cy="-120" rx="18" ry="10"/></g></g>';
const AU_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="ausky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5CBDEE"/><stop offset=".6" stop-color="#BFE8F8"/><stop offset="1" stop-color="#FFE9C9"/></linearGradient>' +
  '<filter id="aush" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".18"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#ausky)"/><circle cx="170" cy="110" r="88" fill="#FFF3DC" opacity=".6"/><circle cx="170" cy="110" r="54" fill="#FFC83D"/>' +
  '<g fill="#fff" opacity=".9"><ellipse cx="560" cy="84" rx="60" ry="15"/><ellipse cx="612" cy="70" rx="40" ry="14"/><ellipse cx="880" cy="150" rx="54" ry="14"/></g>' +
  '<path filter="url(#aush)" d="M0 380Q160 344 330 366T660 356T1000 372V600H0z" fill="#E7A56B"/>' +
  '<g filter="url(#aush)"><path d="M300 392q14-112 96-134 150-36 300 0 82 22 96 134z" fill="#C8552F"/><path d="M396 258q150-36 300 0 34 10 54 34-190-40-408 0 20-24 54-34z" fill="#DD6E43"/>' +
  '<path d="M384 300v86M440 284v102M510 276v110M588 278v108M656 288v98M714 304v82" stroke="#A8421F" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>' +
  '<path filter="url(#aush)" d="M0 420Q230 372 500 412T1000 396V600H0z" fill="#D9824A"/>' +
  '<g fill="#8FA95A"><ellipse cx="120" cy="436" rx="26" ry="9"/><ellipse cx="270" cy="452" rx="22" ry="8"/><ellipse cx="830" cy="430" rx="28" ry="9"/><ellipse cx="930" cy="458" rx="20" ry="7"/><ellipse cx="610" cy="446" rx="18" ry="7"/></g>' +
  '<path filter="url(#aush)" d="M0 540Q260 494 520 532T1000 514V600H0z" fill="#C8623A"/>' +
  '<g filter="url(#aush)">' + gumTree(906, 566, 1.2) + gumTree(64, 574, .95) + '</g>' +
  '<g fill="#8FA95A"><ellipse cx="220" cy="566" rx="30" ry="10"/><ellipse cx="420" cy="582" rx="24" ry="8"/><ellipse cx="700" cy="572" rx="30" ry="10"/></g>' +
  '</svg>';

/* ----- life on the reef ----- */
bankSkill('reef', 'Life on the reef', 'science', [
  { pic: 'coral', why: 'Coral is made by tiny animals called polyps.',
    ask: [{ t: 'A coral reef is built by tiny…', pic: 'coral', h: 'Coral looks like rock, or a plant. But it has a mouth and tentacles, and it eats.', o: [O('Animals', 'crab'), O('Plants', 'potted-plant'), O('Rocks', 'rock')] },
      { t: 'What does a coral leave behind to build a reef?', pic: 'coral', h: 'Each coral animal sits in a hard cup. Cup upon cup, over thousands of years.', o: [O('A hard skeleton', 'rock'), O('A soft nest', 'feather'), O('A sand castle', 'beach-with-umbrella')] }] },
  { pic: ALGAE_ART, why: 'Photosynthesis: making food from sunlight, water and air.',
    ask: [{ t: 'What do the algae use to make food?', pic: ALGAE_ART, h: 'Algae are like tiny plants. Plants cannot eat, so they make food using light.', o: [O('Sunlight', 'sun'), O('Sand', 'desert'), O('Darkness', 'new-moon')] },
      { t: 'Making food from sunlight is called…', pic: 'sun', h: 'Photo means light. Synthesis means making. Put the two together.', o: [O('Photosynthesis', 'seedling'), O('Hibernation', 'zzz'), O('Evaporation', 'dashing-away')] }] },
  { pic: 'handshake', why: 'Symbiosis: two living things that help each other.',
    ask: [{ t: 'The coral gives the algae a home. The algae give…', pic: 'coral', h: 'The algae make sugar from sunlight. They make more than they need.', o: [O('Food', 'candy'), O('Shells', 'spiral-shell'), O('Legs', 'leg')] },
      { t: 'Two living things helping each other is…', pic: 'coral', h: 'The coral shelters the algae. The algae feed the coral. Both do better together.', o: [O('Symbiosis', 'handshake'), O('Camouflage', 'lizard'), O('Migration', 'eagle')] }] },
  { pic: 'thermometer', why: 'Too warm, and coral pushes out its algae. It bleaches.',
    ask: [{ t: 'The sea gets too warm. The coral turns…', pic: 'thermometer', h: 'The colour of a coral comes from its algae. Heat makes the coral push them out.', o: [O('White', 'white-circle'), O('Green', 'green-circle'), O('Purple', 'purple-circle')] },
      { t: 'Why does bleached coral go hungry?', pic: 'coral', h: 'Most of a coral\'s food is made by the algae living inside it.', o: [O('Its algae are gone', ALGAE_ART), O('It is asleep', 'zzz'), O('It is too cold', 'snowflake')] }] },
  { pic: 'sun', why: 'Every food chain starts with energy from the Sun.',
    ask: [{ t: 'Where does a food chain\'s energy start?', pic: 'tropical-fish', h: 'Algae and plants catch light and turn it into food. Everything else eats them, or eats their eaters.', o: [O('The Sun', 'sun'), O('A shark', 'shark'), O('The Moon', 'crescent-moon')] },
      { t: 'Algae, then fish, then shark. Who eats the fish?', pic: 'tropical-fish', h: 'A food chain is read in order. Each one is eaten by the next.', o: [O('The shark', 'shark'), O('The algae', ALGAE_ART), O('The Sun', 'sun')] }] }
], 'australia');

/* ----- the Earth and the Sun ----- */
bankSkill('sky', 'Earth and Sun', 'science', [
  { pic: EARTH_TILT, why: 'The Earth leans over. That tilt gives us seasons.',
    ask: [{ t: 'What gives the Earth its seasons?', pic: EARTH_TILT, h: 'The Earth does not stand up straight as it circles the Sun. It leans.', o: [O('Its tilt', 'triangular-ruler'), O('The clouds', 'cloud'), O('The Moon', 'crescent-moon')] },
      { t: 'The Earth leans over. That lean is called its…', pic: EARTH_TILT, h: 'It is the same word as leaning your chair back.', o: [O('Tilt', 'triangular-ruler'), O('Orbit', 'ringed-planet'), O('Shadow', 'new-moon')] }] },
  { pic: 'sun', why: 'Leaning to the Sun: straighter light, longer days. Summer.',
    ask: [{ t: 'Your half of Earth leans towards the Sun. It is…', pic: TILT_IN, h: 'Leaning in, the sunlight hits you straight on, and the days are long.', o: [O('Summer', 'sun'), O('Winter', 'snowflake'), O('Midnight', 'new-moon')] },
      { t: 'In summer, the days are…', pic: 'sunrise', h: 'Your half is leaning in, so it spends more of each spin in the light.', o: [O('Longer', 'sun'), O('Shorter', 'crescent-moon'), O('Darker', 'new-moon')] }] },
  { pic: 'snowflake', why: 'North and south have opposite seasons.',
    ask: [{ t: 'It is summer in Australia. In Japan it is…', pic: TILT_BOTH, h: 'When the south leans towards the Sun, the north leans away.', o: [O('Winter', 'snowflake'), O('Summer', 'sun'), O('Summer too', 'sunglasses')] },
      { t: 'In Australia, Christmas comes in…', pic: 'christmas-tree', hp: TILT_IN, h: 'Australia is in the south. In December the south leans towards the Sun.', why: 'North and south have opposite seasons. Australia is in the south.', o: [O('Summer', 'sun'), O('Winter', 'snowflake'), O('Autumn', 'fallen-leaf')] }] },
  { pic: EARTH_EQ, why: 'The equator splits the Earth into two halves: two hemispheres.',
    ask: [{ t: 'Which hemisphere is Australia in?', pic: EARTH_EQ, h: 'The dotted line is the equator. The red dot is Australia. Is it above the line, or below?', o: [O('Southern', 'down-arrow'), O('Northern', 'up-arrow'), O('Both', 'up-down-arrow')] },
      { t: 'The line round the middle of the Earth is the…', pic: EARTH_EQ, h: 'It splits the Earth into a top half and a bottom half.', o: [O('Equator', 'red-circle'), O('Orbit', 'ringed-planet'), O('Tilt', 'triangular-ruler')] }] },
  { pic: 'ringed-planet', why: 'One trip around the Sun takes one year.',
    ask: [{ t: 'How long does Earth take to circle the Sun?', pic: 'sun', h: 'Count the seasons: summer, autumn, winter, spring. Then it starts again.', o: [O('One year', 'spiral-calendar'), O('One day', 'sunrise'), O('One week', 'calendar')] },
      { t: 'The Earth\'s path around the Sun is its…', pic: 'sun', h: 'Planets, moons and satellites all travel in one of these.', o: [O('Orbit', 'ringed-planet'), O('Tilt', 'triangular-ruler'), O('Season', 'fallen-leaf')] }] }
], 'australia');

/* ----- sound ----- */
bankSkill('sound', 'Sound', 'science', [
  { pic: 'speaker-high-volume', why: 'Every sound is something vibrating.',
    ask: [{ t: 'Every sound is made by something…', pic: 'speaker-high-volume', h: 'Hum, and touch your throat. Feel that buzz?', o: [O('Vibrating', 'bell'), O('Melting', 'ice'), O('Glowing', 'light-bulb')] },
      { t: 'Shaking back and forth very fast is called…', pic: 'guitar', h: 'A plucked guitar string does it. So does the air in a tube.', o: [O('Vibrating', 'bell'), O('Freezing', 'snowflake'), O('Floating', 'balloon')] }] },
  { pic: 'musical-note', why: 'Faster vibrations make a higher note.',
    ask: [{ t: 'Faster vibrations make the note…', pic: 'musical-note', h: 'A tiny bird sings high. A big drum booms low. Which one shakes faster?', o: [O('Higher', 'up-arrow'), O('Lower', 'down-arrow'), O('Silent', 'muted-speaker')] },
      { t: 'A low, deep note means the air vibrates…', pic: 'long-drum', h: 'High notes come from fast vibrations. Low notes are the opposite.', o: [O('Slowly', 'snail'), O('Quickly', 'rabbit'), O('Not at all', 'cross-mark')] }] },
  { pic: TUBE_3, why: 'A longer tube plays a lower note.',
    ask: [{ t: 'Which tube plays the lowest note?', pic: 'musical-note', h: 'In a long tube the air has further to go, so it vibrates more slowly.', o: [O('The longest', TUBE_4), O('The middle one', TUBE_2), O('The shortest', TUBE_1)] },
      { t: 'To play a higher note, make the tube…', pic: TUBE_3, h: 'A short tube makes the air vibrate faster.', o: [O('Shorter', TUBE_1), O('Longer', TUBE_4), O('Heavier', 'rock')] }] }
], 'australia');

bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: LAMP_BALL, hint: 'A model is a small copy we can hold and test.', why: 'A model lets us test things too big to touch.',
    ask: [{ t: 'A lamp and a ball can show the seasons. That is a…', o: [O('Model', 'nesting-dolls'), O('Guess', 'game-die'), O('Holiday', 'beach-with-umbrella')] },
      { t: 'Why do scientists build models?', pic: 'globe-showing-asia-australia', o: [O('To test big ideas', 'light-bulb'), O('To decorate', 'ribbon'), O('To hide things', 'locked')] }] },
  { pic: TUBE_3, hint: 'A fair test changes just one thing. Everything else stays the same.', why: 'Change one thing. Keep the rest the same.',
    ask: [{ t: 'Testing tube length. What must stay the same?', o: [O('How hard we blow', 'wind-face'), O('The length', TUBE_4), O('Nothing', 'cross-mark')] },
      { t: 'In the tube test, what do we change?', o: [O('The length', TUBE_4), O('How hard we blow', 'wind-face'), O('Everything', 'game-die')] }] },
  { pic: 'thermometer', hint: 'Feeling warm is fuzzy. A number on a thermometer is exact.', why: 'Scientists measure, so they can be sure.',
    ask: [{ t: 'Is the sea getting warmer? To be sure, we…', pic: 'water-wave', o: [O('Measure it', 'thermometer'), O('Guess', 'game-die'), O('Ask a fish', 'tropical-fish')] },
      { t: 'A thermometer measures…', pic: 'thermometer', o: [O('Temperature', 'sun'), O('Weight', 'balance-scale'), O('Time', 'stopwatch')] }] }
], 'australia');

/* ----- the coral lab: she turns on the Sun, then warms the sea. The algae inside the coral make its food by photosynthesis;
   when the water gets too warm the coral pushes them out and turns white (bleaching); cooled in time, it takes them back. ----- */
const CORAL_LAB = (() => {
  const dots = [[168, 176], [186, 190], [174, 208], [196, 220], [214, 182], [230, 196], [222, 214], [236, 172], [182, 166], [206, 204], [200, 176], [218, 232]];
  const alg = dots.map((p, i) => '<circle class="alg" cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#6FA83A" style="--dx:' + ((i % 2 ? 1 : -1) * (30 + i * 9)) + 'px;--dy:' + (-80 - i * 7) + 'px;transition-delay:' + (i * .07).toFixed(2) + 's"/>').join('');
  const food = dots.slice(0, 8).map((p, i) => '<circle class="food" cx="' + p[0] + '" cy="' + p[1] + '" r="2.600" fill="#FFD95E" style="animation-delay:-' + (i * .3).toFixed(1) + 's"/>').join('');
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A coral animal cut open under the sea, with tiny green algae living inside it, the Sun above and a thermometer">' +
    '<rect width="400" height="46" fill="#CDEEFB"/><rect y="46" width="400" height="244" fill="#7CCDE8"/><path d="M0 46q25-7 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0v8H0z" fill="#A5DDF0"/>' +
    '<g class="sunrays" stroke="#FFE27A" stroke-width="5" stroke-linecap="round"><path d="M92 50 140 140M112 46 176 132M70 54 96 150"/></g><circle cx="78" cy="22" r="17" fill="#FFC83D" class="sun"/>' +
    '<path d="M0 262q50-10 100 0t100 0 100 0 100 0v28H0z" fill="#EBD9A6"/>' +
    '<g class="polyp"><path d="M132 268q0-18 14-22h108q14 4 14 22z" fill="#F2EEE3" stroke="#1B2A4E" stroke-width="2.500" stroke-linejoin="round"/>' +
    '<path class="body" d="M148 246q-6-48 4-88h96q10 40 4 88z" stroke="#1B2A4E" stroke-width="2.500" stroke-linejoin="round"/>' +
    '<g class="body" stroke="#1B2A4E" stroke-width="2.200" stroke-linejoin="round"><path d="M152 160q-18-32-14-66 12 2 16 22 4 20 12 44z"/><path d="M176 158q-8-36 4-72 12 6 10 28-2 22 0 44z"/><path d="M208 158q2-22 0-44-2-22 10-28 12 36 4 72z"/><path d="M234 160q8-24 12-44 4-20 16-22 4 34-14 66z"/></g>' +
    '<ellipse cx="200" cy="162" rx="17" ry="6" fill="#B6513B"/></g>' + alg + food +
    '<text class="lalg" x="300" y="206" font-size="14" font-weight="700" fill="#1B2A4E">algae</text><path class="lalg" d="M296 201 246 196" stroke="#1B2A4E" stroke-width="1.800" stroke-linecap="round"/>' +
    '<text x="200" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#7A5A2E">coral</text>' +
    '<g class="fish">' + V.pic('tropical-fish', 292, 124, 40) + V.pic('fish', 40, 176, 34) + '</g>' +
    '<g transform="translate(366 10)"><rect x="-8" y="0" width="16" height="60" rx="8" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><circle cy="68" r="13" fill="#E5484D" stroke="#1B2A4E" stroke-width="3"/><rect class="cmerc" x="-3.500" y="8" width="7" height="56" fill="#E5484D"/></g>' +
    '<text class="ctemp" x="350" y="104" text-anchor="end" font-size="22" font-weight="700" fill="#1B2A4E">27°C</text></svg>';
})();
function coralSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab coral fill', 'data-s': 'start', html: CORAL_LAB })); }
/* one press of a lab button: change the picture, say what happened, and keep it on screen long enough to watch */
const labStep = (ui, g, label, state, text, say, then) => ui.next(label).then(() => { ui.check(); sfx.step(); g.dataset.s = state; if (then) then(); return Promise.all([Promise.race([ui.prompt(text, say), wait(14000)]), wait(2800)]); }).then(() => { ui.check(); return ui.wait(400); });
async function coralSim(stage, ui) {
  coralSetup(stage); const g = $('.lab', stage), temp = $('.ctemp', g), T = t => () => { temp.textContent = t; };
  ui.prompt('Tiny green algae live inside the coral. Turn on the Sun!', 'This is one coral animal, cut open so we can see inside. The green dots are algae. They are like tiny plants, and they live inside the coral. Tap the button to let the Sun shine.');
  await labStep(ui, g, 'Shine the Sun', 'sun', 'The algae make food from sunlight. They share it.', 'Watch the yellow dots. The algae use sunlight to make sugar. That is called photosynthesis. They share the sugar with the coral, and the coral gives them a safe home. Helping each other like this is called symbiosis.');
  await labStep(ui, g, 'Warm the water', 'warm', 'The sea is 30 degrees. Too warm! The coral is stressed.', 'Now the sea warms up, to 30 degrees. That is too warm for this coral. It is stressed, and the algae inside are starting to cause it harm.', T('30°C'));
  await labStep(ui, g, 'Warm it more', 'bleach', 'The coral pushes its algae out. It turns white.', 'At 32 degrees, the coral pushes its algae out. Its colour came from the algae, so now we see straight through to its white skeleton. This is called coral bleaching. The coral is still alive. But with no algae to make food, it is starving.', T('32°C'));
  await labStep(ui, g, 'Cool the water', 'cool', 'Cooler water. The algae return. The coral recovers!', 'The water cools back to 27 degrees. The algae come back, and the coral recovers. But if the sea stays too warm for too long, the coral dies. That is why warmer seas are a danger to the Great Barrier Reef.', T('27°C'));
}

/* ----- the seasons lab: the Earth leans, and always leans the same way. She carries it around the Sun, a quarter of a year at a time.
   When the south leans towards the Sun it is summer in Australia (December); half a year later the south leans away (June). ----- */
const SEASON_POS = { jun: [70, 150], sep: [200, 232], dec: [330, 150], mar: [200, 68] };
const SEASON_NAME = { jun: ['June', 'winter'], sep: ['September', 'spring'], dec: ['December', 'summer'], mar: ['March', 'autumn'] };   /* Australia's seasons */
const SEASONS_LAB = '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Earth, leaning over, going around the Sun">' +
  '<rect width="400" height="300" rx="14" fill="#1E2A5A"/><g fill="#fff" opacity=".7"><circle cx="30" cy="30" r="1.500"/><circle cx="120" cy="18" r="1.200"/><circle cx="372" cy="40" r="1.500"/><circle cx="300" cy="22" r="1.200"/><circle cx="24" cy="262" r="1.300"/><circle cx="380" cy="270" r="1.500"/><circle cx="110" cy="282" r="1.200"/><circle cx="318" cy="284" r="1.200"/></g>' +
  '<ellipse cx="200" cy="150" rx="130" ry="82" fill="none" stroke="#9FB4FF" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round"/>' +
  '<circle cx="200" cy="150" r="40" fill="#FFC83D" opacity=".25"/><circle cx="200" cy="150" r="26" fill="#FFC83D"/><text x="200" y="155" text-anchor="middle" font-size="13" font-weight="700" fill="#7A4A00">Sun</text>' +
  '<g class="beams" stroke="#FFE27A" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 9" opacity=".85"><line class="beam b1"/><line class="beam b2"/><line class="beam b3"/></g>' +
  '<g class="stamps"></g><g class="earth"><g class="eb"><circle r="27" fill="#3BA7F0"/><g transform="rotate(23.500)"><path d="M0-40V40" stroke="#fff" stroke-width="2.500" stroke-linecap="round"/><ellipse rx="27" ry="6" fill="none" stroke="#fff" stroke-width="1.500" opacity=".8"/>' +
  '<path d="M-14-16q8-6 14 0t10 2q-4 8-12 8t-12-10z" fill="#57BF7F"/><path d="M-8 8q10-4 14 4-4 8-12 6z" fill="#57BF7F"/><circle cx="0" cy="13" r="4.200" fill="#E5484D" stroke="#fff" stroke-width="1.200"/><circle cx="0" cy="-13" r="3.200" fill="#FFC83D" stroke="#fff" stroke-width="1"/>' +
  '<text x="0" y="-44" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">N</text><text x="0" y="53" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">S</text></g>' +
  '</g></g>' +
  '<g font-size="11.500" font-weight="700" fill="#fff"><circle cx="18" cy="266" r="4.200" fill="#E5484D" stroke="#fff" stroke-width="1.200"/><text x="27" y="270">Australia</text><circle cx="18" cy="284" r="3.200" fill="#FFC83D" stroke="#fff" stroke-width="1"/><text x="27" y="288">Japan</text></g><text class="key" x="388" y="288" text-anchor="end" font-size="11.500" font-weight="700" fill="#FF9DA0">pink: the season in Australia</text></svg>';
/* move the Earth to a quarter of its orbit. Each place she has visited keeps a stamp: a faint Earth, its month and (once the lab is running) Australia's season there,
   so by the end the picture is the whole year: four Earths round the Sun, all leaning the same way. */
function seasonGo(g, key, season) {
  const p = SEASON_POS[key], e = $('.earth', g), dx = p[0] - 200, dy = p[1] - 150, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, side = dx === 0, nm = SEASON_NAME[key];
  e.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)';
  const old = $('.stamp-' + key, g); if (old) old.remove();
  const tx = side ? 44 : 0, anchor = side ? 'start' : 'middle', first = !$('.stamp', g);
  $('.stamps', g).insertAdjacentHTML('beforeend', '<g class="stamp stamp-' + key + (first ? ' now' : '') + '" transform="translate(' + p[0] + ' ' + p[1] + ')"><g opacity=".5">' + $('.eb', g).innerHTML + '</g>' +
    '<text x="' + tx + '" y="' + (side ? (dy < 0 ? -22 : 12) : -66) + '" text-anchor="' + anchor + '" font-size="15" font-weight="700" fill="#FFE27A">' + nm[0] + '</text>' +
    (season ? '<text x="' + tx + '" y="' + (side ? (dy < 0 ? -6 : 28) : -51) + '" text-anchor="' + anchor + '" font-size="13" font-weight="700" fill="#FF9DA0">' + nm[1] + '</text>' : '') + '</g>');   /* the words sit clear of the dotted orbit */
  /* three dotted beams of sunlight, from the edge of the Sun to the edge of the Earth */
  [-9, 0, 9].forEach((off, i) => { const b = $('.b' + (i + 1), g), ox = -uy * off, oy = ux * off; b.setAttribute('x1', 200 + ux * 30 + ox); b.setAttribute('y1', 150 + uy * 30 + oy); b.setAttribute('x2', p[0] - ux * 31 + ox); b.setAttribute('y2', p[1] - uy * 31 + oy); });
}
function seasonsSetup(stage) { stage.innerHTML = ''; const g = h('div', { class: 'lab seasons fill', html: SEASONS_LAB }); stage.append(g); seasonGo(g, 'jun', false); }   /* no season printed yet: that is her prediction */
async function seasonsSim(stage, ui) {
  seasonsSetup(stage); const g = $('.lab', stage), go = k => () => seasonGo(g, k, true);
  seasonGo(g, 'jun', true);
  ui.prompt('June. Australia leans away from the Sun. Winter!', 'The Earth takes one year to go around the Sun. It leans over, and it always leans the same way. The red dot is Australia, in the southern hemisphere. In June, the southern hemisphere leans away from the Sun. The sunlight is spread thin and the days are short. That is winter. Tap the button to move the Earth on.');
  await labStep(ui, g, 'Move the Earth', 'sep', 'September. Neither end leans in. Spring in Australia.', 'Three months later, it is September. Now neither hemisphere leans towards the Sun. Day and night are the same length. In Australia it is spring.', go('sep'));
  await labStep(ui, g, 'Move the Earth', 'dec', 'December. Australia leans to the Sun. Summer at Christmas!', 'December. The Earth still leans the same way, but now it is on the other side of the Sun. So the southern hemisphere, with Australia in it, leans towards the Sun. Sunlight hits it straight on, and the days are long. That is summer. Japan, the yellow dot, is in the northern hemisphere. It leans away, so Japan has winter.', go('dec'));
  await labStep(ui, g, 'Move the Earth', 'mar', 'March. Neither end leans in. Autumn in Australia.', 'March. Again neither hemisphere leans in. It is autumn in Australia, and spring in Japan.', go('mar'));
  await labStep(ui, g, 'Move the Earth', 'jun', 'June again. One trip round the Sun is one year.', 'And back to June. One whole trip around the Sun is one year. Look at the four Earths. They all lean the same way. The seasons come from that lean, not from how far away the Sun is.', go('jun'));
}

/* ----- the sound lab: a wooden tube, played like a didgeridoo. Sound is vibration; a shorter tube makes the air vibrate faster, and the note higher.
   The notes are real: a tube closed at one end sounds at (speed of sound) / (4 x length), so 88 cm gives 98 shakes a second, and half the length gives double. ----- */
const SOUND_TUBES = { long: [88, 98, 300], mid: [58, 147, 200], short: [44, 196, 150] };
const SOUND_LAB = '<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A wooden tube with the air inside it shaking, and sound coming out of the end">' +
  '<rect width="400" height="250" rx="14" fill="#FFF3DC"/>' +
  '<g class="tube"><rect class="tb" x="30" y="92" width="300" height="46" rx="14" fill="#8A5A34" stroke="#1B2A4E" stroke-width="3"/><rect class="tin" x="40" y="101" width="280" height="28" rx="9" fill="#3A2416"/>' +
  '<path class="wave" d="" fill="none" stroke="#FFD95E" stroke-width="4" stroke-linecap="round"/><g class="rings" fill="none" stroke="#8B7BEA" stroke-width="3.500" stroke-linecap="round"><path class="r1" d="M0-16q9 16 0 32"/><path class="r2" d="M10-26q15 26 0 52"/><path class="r3" d="M20-36q21 36 0 72"/></g></g>' +
  '<text class="tlen" x="30" y="72" font-size="19" font-weight="700" fill="#1B2A4E">Tube: 88 cm</text><text class="thz" x="30" y="184" font-size="19" font-weight="700" fill="#6453C9"></text>' +
  '<text x="30" y="222" font-size="14" font-weight="700" fill="#7A5A2E">The yellow line is the air inside, shaking.</text></svg>';
function soundSet(g, key, playing) {
  const t = SOUND_TUBES[key], L = t[2], x0 = 42, x1 = 30 + L - 12; let d = 'M' + x0 + ' 115';
  d += ' Q' + ((x0 + x1) / 2) + ' 86 ' + x1 + ' 115';   /* one bow of air from end to end: the longer the tube, the longer the wave, and the slower it swings */
  $('.tb', g).setAttribute('width', L); $('.tin', g).setAttribute('width', L - 20); $('.wave', g).setAttribute('d', d); $('.rings', g).setAttribute('transform', 'translate(' + (30 + L + 8) + ' 115)');
  $('.tlen', g).textContent = 'Tube: ' + t[0] + ' cm'; $('.thz', g).textContent = playing ? 'The air shakes ' + t[1] + ' times a second' : ''; g.dataset.s = playing ? key : 'quiet'; g.style.setProperty('--wv', (45 / t[1]).toFixed(3) + 's');
}
function soundSetup(stage) { stage.innerHTML = ''; const g = h('div', { class: 'lab sound fill', html: SOUND_LAB }); stage.append(g); soundSet(g, 'long', false); }
async function soundSim(stage, ui) {
  soundSetup(stage); const g = $('.lab', stage);
  const play = key => () => { soundSet(g, key, true); tone(SOUND_TUBES[key][1], 2.4, 'sawtooth', .13); };
  ui.prompt('A long wooden tube. Blow, and the air inside shakes.', 'This is a wooden tube, like a didgeridoo. Aboriginal peoples of northern Australia invented the didgeridoo, many hundreds of years ago. It is made from a gum tree that termites have hollowed out. Tap the button to play it.');
  await labStep(ui, g, 'Play the long tube', 'long', 'A low note. The air shakes 98 times a second.', 'Listen. A low, deep note. Every sound is made by something shaking very fast. That is called vibrating. In this long tube, the air vibrates 98 times every second.', play('long'));
  await labStep(ui, g, 'Make it shorter', 'mid', 'A shorter tube. The air shakes faster. A higher note!', 'We made the tube shorter. The air inside has less far to go, so it vibrates faster: 147 times a second. Faster vibrations make a higher note.', play('mid'));
  await labStep(ui, g, 'Half as long', 'short', 'Half as long. The air shakes twice as fast!', 'Now the tube is half as long as the first one. The air vibrates twice as fast: 196 times a second. The note is higher again.', play('short'));
}

/* reef looks for the coding grid */
const REEF = { mover: 'turtle', goal: 'herb', goalName: 'seagrass', flag: 'glowing-star', flagName: 'star', rock: 'coral', cls: 'sea' };
GRAPH_SETS.australia = { noun: 'animals', one: 'animal', items: [{ name: 'kangaroos', art: 'kangaroo' }, { name: 'koalas', art: 'koala' }, { name: 'turtles', art: 'turtle' }, { name: 'crocodiles', art: 'crocodile' }, { name: 'parrots', art: 'parrot' }] };

COUNTRIES.australia = {
  cheers: ['Good on ya!'],   /* a cheer in this country's own way of speaking, used only here */
  name: 'Australia', hello: "G'day! Start with Outback maths.", helloSay: 'Good day! Start with Outback maths.', scene: AU_SCENE,
  thing: 'boomerang', boat: 'boat',
  videos: {
    coral: { yt: 'UyEw_Rl8mqM', title: 'Coral bleaching: the story of Frank the coral', by: 'The Coral Garden', icon: 'coral' },
    seasons: { yt: 'BHbMW-6zhlg', title: "What causes the seasons? Earth's tilt", by: 'Miacademy', icon: 'globe-showing-asia-australia' },
    sound: { yt: '3-xKZKxXuu0', title: 'What is sound?', by: 'SciShow Kids', icon: 'speaker-high-volume' },
    pouch: { yt: '4s0Ewd3pG4s', title: 'Why do kangaroos have pouches?', by: 'SciShow Kids', icon: 'kangaroo' }
  },
  souvenirs: [
    { id: 'au-boomerang', art: 'boomerang', name: 'Boomerang', price: 15, need: 'm1' }, { id: 'au-kangaroo', art: 'kangaroo', name: 'Kangaroo', price: 25, need: 'm1' },
    { id: 'au-coral', art: 'coral', name: 'Coral', price: 20, need: 'm2' }, { id: 'au-turtle', art: 'turtle', name: 'Sea turtle', price: 25, need: 'm2' },
    { id: 'au-koala', art: 'koala', name: 'Koala', price: 25, need: 'm3' }, { id: 'au-platypus', art: PLATYPUS, move: 'crawl', head: [73, 40, 30], name: 'Platypus', price: 30, need: 'm3' },
    { id: 'au-didge', art: DIDGE_ART, name: 'Didgeridoo', price: 20, need: 'm4' }, { id: 'au-uluru', art: ULURU_ART, name: 'Uluru', price: 40, need: 'boss' }
  ],
  themes: { outback: { name: 'Outback room', price: 40, need: 'boss', wall: '#FBE3C4', wall2: '#F3CFA2', floor: '#C8623A', line: '#A84E2C', rug: '#19A7B8', sky: ['#7FD0F2', '#FFE9C9'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['coral'] }, { id: 'v2', after: ['boss'], choose: ['seasons', 'sound', 'pouch'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Outback maths', icon: 'kangaroo', sticker: 'kangaroo',
      intro: { text: 'Read the map. Read the thermometer. Off we go!', say: 'Good day! Australia is huge, hot and wild. Explorers need two things: a map, and a thermometer. Ready for some outback maths?' },
      rounds: [{ skill: 'coords' }, { skill: 'temp' }, { skill: 'coords' }, { skill: '@review', or: 'divide' }, { skill: 'temp' }, { skill: 'coords' }, { skill: '@review', or: 'clock' }, { skill: 'temp' }] },
    { id: 'm2', name: 'Reef lab', icon: 'coral', sticker: 'tropical-fish',
      intro: { text: 'The Great Barrier Reef is alive. Find out how!', say: 'The Great Barrier Reef is the biggest living thing on Earth. You can see it from space. Today you are a reef scientist.' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on the coral.', say: 'A coral reef is built by tiny animals called polyps. This is one polyp, cut open so we can see inside. Put each name on the right part.', board: CORAL_BOARD, items: CORAL_PARTS, done: { text: 'You know your coral. Now, the coral lab!' } },
        { act: 'predict', q: 'The sea gets too warm. What happens to the coral?', qsay: 'Here is an experiment. Tiny algae live inside this coral. We are going to warm up the sea. What do you think happens to the coral? Make a prediction.',
          options: [O('It turns white', 'white-circle'), O('It grows faster', 'up-arrow'), O('It swims away', 'tropical-fish')], answer: 0, setup: coralSetup, sim: coralSim,
          right: 'You predicted it! Too warm, and the coral bleached white.', wrong: 'Surprise! Too warm, and the coral bleached white.',
          tryit: { icon: 'leaf-fluttering-in-wind', big: 'A leaf makes oxygen!', text: 'Put a fresh leaf under water, in the Sun.', say: 'Now try it. Leaves make food from sunlight too, just like the algae. Put a fresh green leaf in a glass of water, and stand it in the Sun for an hour. Look closely. The tiny bubbles on the leaf are oxygen, the gas it gives off while it makes its food.' } },
        { act: 'sort', even: true, text: 'Does it make its own food?', say: 'Some living things make their own food from sunlight. Others have to eat. Does this one make its own food?', bins: [{ label: 'Makes its food', icon: 'sun' }, { label: 'Has to eat', icon: 'fork-and-knife' }],
          items: [{ art: ALGAE_ART, label: 'Algae', bin: 0, why: 'Algae make food from sunlight.' }, { art: SEAGRASS_ART, label: 'Seagrass', bin: 0, why: 'Seagrass is a plant. It makes food from sunlight.' },
            { art: KELP_ART, label: 'Seaweed', bin: 0, why: 'Seaweed makes its food from sunlight.' }, { art: MANGROVE_ART, label: 'Mangrove tree', bin: 0, why: 'A tree makes food in its leaves, from sunlight.' },
            { icon: 'turtle', label: 'Sea turtle', bin: 1, why: 'Green turtles eat seagrass.' }, { icon: 'tropical-fish', label: 'Clownfish', bin: 1, why: 'A clownfish eats tiny animals and algae.' },
            { icon: 'shark', label: 'Reef shark', bin: 1, why: 'A shark eats fish.' }, { icon: 'crab', label: 'Crab', bin: 1, why: 'A crab eats whatever it can find.' }],
          done: { text: 'Makers of food are producers. Eaters are consumers.', say: 'Living things that make their own food are called producers. Living things that eat are called consumers.' } },
        { skill: 'reef' }, { skill: 'reef' },
        { act: 'order', text: 'Follow the energy. Tap in order.', say: 'A food chain shows where energy goes. It starts with the Sun. Tap the pictures in order.',
          steps: [{ icon: 'sun', label: 'The Sun shines', say: 'All the energy starts with the Sun.' }, { art: ALGAE_ART, label: 'Algae make food', say: 'Algae catch the sunlight and make food.' }, { icon: 'tropical-fish', label: 'A fish eats algae', say: 'A little fish eats the algae.' }, { icon: 'shark', label: 'A shark eats fish', say: 'A shark eats the little fish.' }],
          hints: ['Where does all the energy come from?', 'Next, something turns sunlight into food.', 'Then, who eats the algae?', 'Last comes the biggest eater.'] },
        { skill: 'reef' }, { skill: 'scithink' }, { skill: 'scithink' }] },
    { id: 'm3', name: "G'day!", icon: 'koala', sticker: 'koala',
      intro: { text: 'Find Australia. Solve its seasons. Meet its animals!', say: 'Time to find Australia on the map, work out why it has summer at Christmas, and meet some very odd animals.' },
      rounds: [
        { act: 'findmap', text: 'Where is Australia? Tap it.', say: 'This is the bottom of the world map. Where is Australia? Tap it.', view: [786, 292, 192, 168], targets: ['036', '554', '598'], answer: '036',
          hint: { text: 'Australia is the biggest island here. A whole continent!' }, done: { text: 'You found Australia. A country and a continent!', say: 'You found Australia. It is a country, and a whole continent too.' } },
        { act: 'place', tags: true, text: 'Put each name on the Earth.', say: 'The Earth has two halves. Each half is called a hemisphere. The line round the middle is called the equator. Put each name in the right place.', board: GLOBE_BOARD, items: GLOBE_PARTS,
          done: { text: 'Australia is in the southern hemisphere. So is New Zealand!', say: 'Australia is in the southern hemisphere, below the equator. So is New Zealand!' } },
        { act: 'predict', q: 'In June, Australia leans away from the Sun. It has…', qsay: 'Here is an experiment. The Earth leans over as it goes around the Sun. In June, Australia leans away from the Sun. What season do you think Australia has in June? Make a prediction.',
          options: [O('Winter', 'snowflake'), O('Summer', 'sun'), O('No seasons', 'cross-mark')], answer: 0, setup: seasonsSetup, sim: seasonsSim,
          right: 'You predicted it! Leaning away from the Sun means winter.', wrong: 'Surprise! Leaning away from the Sun means winter.',
          tryit: { icon: LAMP_BALL, pic: SEASONS_MODEL, big: 'Make a Sun and an Earth!', text: 'Tilt a ball. Carry it around a lamp.', say: 'Now try it. A lamp is the Sun. A ball on a stick is the Earth. Put a sticker on the bottom half, for Australia. Tilt the stick, and carry the ball in a circle around the lamp. Keep it leaning the same way all the way round, like the picture. Where does the sticker get the most light?' } },
        { skill: 'sky' }, { skill: 'sky' },
        { act: 'sort', even: true, text: 'Does it hatch from an egg?', say: 'Most mammals are born alive. But Australia has two mammals that lay eggs! Does this animal hatch from an egg?', bins: [{ label: 'Hatches from an egg', icon: 'egg' }, { label: 'Born alive', icon: 'baby' }],
          items: [{ art: PLATYPUS, label: 'Platypus', bin: 0, why: 'A platypus is a mammal, but it lays eggs!' }, { art: ECHIDNA, label: 'Echidna', bin: 0, why: 'An echidna lays one egg, into her pouch.' },
            { icon: 'crocodile', label: 'Crocodile', bin: 0, why: 'Crocodiles are reptiles. They lay eggs in a nest.' }, { icon: 'turtle', label: 'Sea turtle', bin: 0, why: 'Sea turtles bury their eggs in the sand.' },
            { icon: 'kangaroo', label: 'Kangaroo', bin: 1, why: 'A joey is born tiny, then grows in the pouch.' }, { icon: 'koala', label: 'Koala', bin: 1, why: 'A baby koala is born alive, into a pouch.' },
            { icon: 'dolphin', label: 'Dolphin', bin: 1, why: 'Dolphins are mammals. Babies are born alive.' }, { icon: 'bat', label: 'Fruit bat', bin: 1, why: 'Bats are mammals. Babies are born alive.' }],
          done: { text: 'Only the platypus and echidnas are egg-laying mammals!', say: 'The platypus and the echidnas are the only mammals in the world that lay eggs.' } },
        { act: 'match', text: 'Match each one to its fact.', pairs: [
          { a: { art: 'kangaroo', label: 'Kangaroo' }, b: { art: 'baby-bottle', label: 'Joey in a pouch' }, text: 'A joey grows in the pouch. Kangaroo is an Aboriginal word.' },
          { a: { art: 'koala', label: 'Koala' }, b: { art: 'leaf-fluttering-in-wind', label: 'Eats gum leaves' }, text: 'Koalas eat gum leaves, and sleep most of the day.' },
          { a: { art: PLATYPUS, label: 'Platypus' }, b: { art: 'egg', label: 'Lays eggs' }, text: 'A platypus has fur, a bill, and lays eggs!' },
          { a: { art: 'boomerang', label: 'Boomerang' }, b: { art: 'repeat-button', label: 'Flies back' }, text: 'A boomerang is a curved wing. Thrown well, it returns.' }] },
        { act: 'order', text: "A joey's first year. Tap in order.", say: 'A baby kangaroo is called a joey. How does it grow up? Tap the pictures in order.',
          steps: [{ icon: 'pinching-hand', label: 'Born tiny', say: 'A newborn joey is as small as a jelly bean.' }, { icon: 'up-arrow', label: 'Climbs to the pouch', say: 'It climbs up its mother\'s fur, into the pouch.' }, { icon: 'baby-bottle', label: 'Drinks milk', say: 'It drinks milk in the pouch for months.' }, { icon: 'kangaroo', label: 'Hops out', say: 'At last it hops out, big and strong.' }],
          hints: ['First, the joey is born. How big is it?', 'Next, it has to get somewhere safe.', 'Then it feeds, and grows.', 'Last, it is big enough to leave.'] },
        { skill: 'sky' }] },
    { id: 'm4', name: 'Sound and code', icon: 'musical-note', sticker: 'musical-note',
      intro: { text: 'Make deep notes. Then guide a turtle home!', say: 'First, find out how a didgeridoo makes its deep sound. Then write code to guide a sea turtle through the reef.' },
      rounds: [
        { act: 'predict', q: 'We make the tube shorter. What happens to the note?', qsay: 'Here is an experiment. This long wooden tube plays a note when you blow it. We are going to make the tube shorter. What do you think happens to the note? Make a prediction.',
          options: [O('It gets higher', 'up-arrow'), O('It gets lower', 'down-arrow'), O('It stays the same', 'balance-scale')], answer: 0, setup: soundSetup, sim: soundSim,
          right: 'You predicted it! Shorter tube, higher note.', wrong: 'Surprise! A shorter tube plays a higher note.',
          tryit: { icon: BOTTLE_ART, big: 'Make your own notes!', text: 'Blow across a bottle. Add water. Blow again.', say: 'Now you try. Blow across the top of an empty bottle, and listen. Then pour in some water, and blow again. The water makes the space for the air shorter. Is the note higher, or lower?' } },
        { skill: 'sound' },
        { act: 'order', text: 'Lowest note first. Tap in order.', say: 'Four wooden tubes. Which plays the lowest note? Tap them in order, from the lowest note to the highest.',
          steps: [{ art: TUBE_4, label: 'Longest', say: 'The longest tube plays the lowest note.' }, { art: TUBE_3, label: 'Long', say: 'A bit shorter. A bit higher.' }, { art: TUBE_2, label: 'Short', say: 'Shorter again. Higher again.' }, { art: TUBE_1, label: 'Shortest', say: 'The shortest tube plays the highest note.' }],
          hints: ['Which tube makes the air shake most slowly?', 'Next: a little shorter, a little higher.', 'Shorter still.', 'Last is the highest note of all.'] },
        { skill: 'sound' },
        { act: 'code', look: REEF, text: 'Swim the turtle to the seagrass.', say: 'This green turtle is hungry. Count the squares to the seagrass. Tap or drag arrows into the boxes to make a path. Then tap Go.', cols: 5, rows: 3, start: [4, 2], goal: [0, 0], rocks: [[3, 1], [1, 1], [4, 0]], slots: 7,
          path: [[4, 2], [3, 2], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]], legs: [[2, 2], [2, 0], [0, 0]], solution: [['l'], ['l'], ['u'], ['u'], ['l'], ['l']] },
        { act: 'code', look: REEF, text: 'Swim around the coral!', say: 'This one is longer. Steer the turtle around the coral.', cols: 5, rows: 4, start: [0, 3], goal: [4, 0], rocks: [[1, 3], [0, 1], [1, 1], [3, 1], [3, 2]], slots: 9,
          path: [[0, 3], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [3, 0], [4, 0]], legs: [[0, 2], [2, 2], [2, 0], [4, 0]], solution: [['u'], ['r'], ['r'], ['u'], ['u'], ['r'], ['r']] },
        { act: 'code', look: REEF, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long swim, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 0], goal: [5, 4], rocks: [[4, 0], [2, 2], [0, 3], [4, 4]], slots: 4, repeat: true,
          path: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [4, 3], [5, 3], [5, 4]], legs: [[3, 0], [3, 3], [5, 3], [5, 4]], solution: [['r', 3], ['d', 3], ['r', 2], ['d', 1]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'boomerang',
      intro: { text: 'Show everything you know about Australia!', say: 'The big one! Show everything you have learned in Australia.' },
      rounds: [{ skill: 'coords' }, { skill: 'reef' }, { skill: 'temp' }, { skill: 'sky' }, { skill: 'sound' }, { skill: 'scithink' }, { skill: '@review', or: 'fractions' }, { skill: '@review', or: 'graphs' }] }
  ]
};
