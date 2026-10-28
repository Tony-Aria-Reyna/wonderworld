/* ===== Brazil: the sixth country. Everything here is content, not code.
   (B64, B32 and O, the small helpers, labStep, TOUCAN_IN and the money and angle skills come from the earlier files.)
   Three labs she works herself: the rain lab (a tree breathes out water, and the forest makes its own rain), the electric eel lab (cells in a row add their volts)
   and the banana kick lab (a spinning ball throws air one way, so the air pushes it the other).
   Sources: ideas.ted.com, "This airborne river may be the largest river on Earth" (Antonio Nobre, INPA: a big tree puts 1,000 litres a day into the air; the forest 20 billion tonnes a day, the Amazon River 17 billion);
   Wikipedia, "Electric eel" (Electrophorus voltai, up to 860 V; about 6,000 electrocytes in a row; a knifefish, not a true eel; breathes air; weak pulses to find prey), "Electric organ (fish)" (each cell about 0.15 V; Volta's pile of 1800),
   "Magnus effect" (the wake is thrown one way, the ball is pushed the other), "Roberto Carlos" (3 June 1997, against France), "Brazil" (fifth largest country; 60% of the Amazon rainforest; the Equator and the Tropic of Capricorn both cross it),
   "Samba" (Afro-Brazilian communities of Bahia and Rio de Janeiro; 2/4 time), "Surdo" (the first surdo sounds on beat two, the second on beat one), "Agogô" (two bells; from West Africa), "Tamborim", "Rainforest" (the four layers),
   "Brazilian real" (coins and notes); alexpertout.com, "Samba: essential parts" (the ganzá plays a steady flow of sixteenth notes). The bell and tamborim parts here are simple patterns in the samba style, not named traditional ones. ===== */

/* ----- hand-drawn pieces ----- */
const TOUCAN_ART = { svg: '<svg viewBox="12 6 110 110" xmlns="http://www.w3.org/2000/svg">' + TOUCAN_IN + '</svg>' };
const CAPY_ART = B64('<ellipse cx="32" cy="59" rx="25" ry="3" fill="rgba(27,42,78,.12)"/><path d="M15 54v5M25 55v4M35 55v4M44 53v6" stroke="#8A5A34" stroke-width="5.500" stroke-linecap="round"/>' +
  '<path d="M6 42q0-17 17-17h20q7 0 7 9v12q0 11-11 11H15Q6 57 6 42z" fill="#A9743F"/><path d="M37 23q2-10 13-10 12 0 12 13v6q0 7-7 7H45q-9 0-9-9z" fill="#B88248"/><ellipse cx="43" cy="13.500" rx="3.800" ry="3.200" fill="#8A5A34"/>' +
  '<circle cx="51" cy="22" r="2.300" fill="#1B2A4E"/><circle cx="51.800" cy="21.200" r=".8" fill="#fff"/><ellipse cx="59" cy="25.500" rx="1.500" ry="2.200" fill="#5A3413"/><path d="M54 33.500h7" stroke="#5A3413" stroke-width="1.600" stroke-linecap="round"/><path d="M12 40q8-6 18-4" stroke="#8A5A34" stroke-width="1.800" fill="none" stroke-linecap="round" opacity=".6"/>');
const EEL_ART = B64('<path d="M7 44q12-22 26-9t25-12" stroke="#55624A" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M36 39q11 5 21-12" stroke="#F2853D" stroke-width="4.500" fill="none" stroke-linecap="round"/>' +
  '<circle cx="55.500" cy="21" r="2.300" fill="#fff"/><circle cx="56" cy="21" r="1.200" fill="#1B2A4E"/><path d="M17 6 9 19h7l-3 11 11-14h-7z" fill="#FFD23F" stroke="#E9A416" stroke-width="1.200" stroke-linejoin="round"/>');
const MASK_ART = B64([[-36, '#19A7B8'], [-12, '#FFC83D'], [12, '#FF7A6B'], [36, '#8B7BEA']].map(f => '<g transform="rotate(' + f[0] + ' 32 34)"><ellipse cx="32" cy="14" rx="5.500" ry="14" fill="' + f[1] + '"/><path d="M32 3v24" stroke="#fff" stroke-width="1" opacity=".6"/></g>').join('') +
  '<path d="M5 36q11-9 27-3 16-6 27 3 0 15-12 15-9 0-15-8-6 8-15 8Q5 51 5 36z" fill="#E86AA6" stroke="#1B2A4E" stroke-width="1.800" stroke-linejoin="round"/><ellipse cx="19" cy="39" rx="6.500" ry="4" fill="#1B2A4E"/><ellipse cx="45" cy="39" rx="6.500" ry="4" fill="#1B2A4E"/>' +
  '<g fill="#FFD95E"><circle cx="32" cy="34" r="2.200"/><circle cx="9.500" cy="40" r="1.500"/><circle cx="54.500" cy="40" r="1.500"/></g>');
const SHIRT_ART = B64('<path d="M21 8 6 16l6 13 8-4v31h24V25l8 4 6-13-15-8q-5 6-11 6T21 8z" fill="#FFD23F" stroke="#1B2A4E" stroke-width="1.800" stroke-linejoin="round"/><path d="M21 8q5 8 11 8t11-8" stroke="#2E9E5B" stroke-width="3.200" fill="none"/>' +
  '<path d="M7.500 19l5 9M56.500 19l-5 9" stroke="#2E9E5B" stroke-width="3"/><text x="32" y="46" font-size="18" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#2E9E5B">10</text>');
/* the four drums of her band */
const SURDO_ART = B64('<ellipse cx="30" cy="52" rx="21" ry="6.500" fill="#2A54A8"/><rect x="9" y="22" width="42" height="30" fill="#3B6FD4"/><path d="M17 27v22M30 29v24M43 27v22" stroke="#C9CEDA" stroke-width="2.200"/><ellipse cx="30" cy="22" rx="21" ry="6.500" fill="#F6ECDD" stroke="#C9CEDA" stroke-width="2.500"/>' +
  '<path d="M58 5 43 19" stroke="#8A5A34" stroke-width="3.200" stroke-linecap="round"/><circle cx="41.500" cy="20.500" r="5" fill="#F2F4F8" stroke="#9AA3B5" stroke-width="1.500"/>');
const GANZA_ART = B64('<g transform="rotate(-24 32 32)"><rect x="10" y="21" width="44" height="22" rx="11" fill="#D5DAE6" stroke="#5A678A" stroke-width="2.200"/><path d="M22 21v22M42 21v22" stroke="#9AA3B5" stroke-width="2"/><g fill="#5A678A"><circle cx="29" cy="28" r="1.500"/><circle cx="35" cy="35" r="1.500"/><circle cx="32" cy="31" r="1.500"/></g></g>' +
  '<path d="M7 20q5 3 5 9M57 35q-5 3-5 9" stroke="#8B7BEA" stroke-width="2.500" fill="none" stroke-linecap="round"/>');
const AGOGO_ART = B64('<path d="M22 27q2-17 20-18" stroke="#A47A1E" stroke-width="3.500" fill="none" stroke-linecap="round"/><path d="M8 32l17-7 11 27q-11 9-21 2z" fill="#FFC83D" stroke="#A47A1E" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M35 11l14-3 5 22q-8 6-15 0z" fill="#FFD95E" stroke="#A47A1E" stroke-width="2" stroke-linejoin="round"/><path d="M60 40 46 50" stroke="#8A5A34" stroke-width="3" stroke-linecap="round"/>');
const TAMBORIM_ART = B64('<ellipse cx="28" cy="39" rx="21" ry="16" fill="#E5484D" stroke="#1B2A4E" stroke-width="2"/><ellipse cx="28" cy="35" rx="21" ry="16" fill="#FFF6E6" stroke="#1B2A4E" stroke-width="2"/><g fill="#C9CEDA"><circle cx="9" cy="40" r="1.800"/><circle cx="28" cy="53" r="1.800"/><circle cx="47" cy="40" r="1.800"/></g>' +
  '<path d="M60 6 37 29" stroke="#8A5A34" stroke-width="3.200" stroke-linecap="round"/>');
const DEFENDER_ART = B32('<ellipse cx="16" cy="28" rx="9" ry="2" fill="rgba(27,42,78,.2)"/><path d="M8 14l-4 3 2 5 3-1v8h14v-8l3 1 2-5-4-3q-3 3-8 3t-8-3z" fill="#E5484D" stroke="#1B2A4E" stroke-width="1.200" stroke-linejoin="round"/><circle cx="16" cy="8" r="5" fill="#E0AC7E" stroke="#1B2A4E" stroke-width="1.200"/><path d="M11 7q5-6 10 0" fill="#4A2F1D"/>');
const FOREST_ART = B32('<path d="M7 28V17M16 29V14M25 28V18" stroke="#6B4424" stroke-width="2.500" stroke-linecap="round"/><circle cx="7" cy="13" r="6" fill="#3FA36B"/><circle cx="25" cy="14" r="6" fill="#3FA36B"/><circle cx="16" cy="9" r="7.500" fill="#57BF7F"/><path d="M2 29h28" stroke="#3F7A5E" stroke-width="2" stroke-linecap="round"/>');
/* one cell of the eel, drawn like a tiny battery: a push at one end, a pull at the other */
const CELL_ART = B32('<rect x="8" y="5" width="16" height="22" rx="4" fill="#F2F4F8" stroke="#1B2A4E" stroke-width="1.500"/><rect x="8" y="5" width="16" height="9" rx="4" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="1.500"/><path d="M13.500 9.500h5M16 7v5" stroke="#fff" stroke-width="1.600" stroke-linecap="round"/><path d="M13.500 21h5" stroke="#1B2A4E" stroke-width="1.600" stroke-linecap="round"/>');
/* a ball seen from above, spinning: for the questions after the kick lab */
const SPIN_ART = B32('<circle cx="16" cy="17" r="8.500" fill="#fff" stroke="#1B2A4E" stroke-width="1.500"/><path d="M16 12.500l4 3-1.500 4.500h-5L12 15.500z" fill="#1B2A4E"/><path d="M4 12a13 13 0 0 1 17-8" stroke="#8B7BEA" stroke-width="2.500" fill="none" stroke-linecap="round"/><path d="M22.500 1 21 5.500l-4.500-1z" fill="#8B7BEA"/>');

/* the layers of the rainforest, for naming them: the giants on top, the thick roof, the dim middle and the dark floor */
const LAYERS_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="6" fill="#BFE8F7"/><rect x="0" y="48" width="100" height="34" fill="#2F6B46"/><rect x="0" y="80" width="100" height="20" rx="0" fill="#6B4A2B"/>' +
  '<path d="M12 82V40M31 82V44M50 82V42M69 82V40M88 82V44" stroke="#5A3A1E" stroke-width="3.500"/><path d="M24 82V10M78 82V12" stroke="#5A3A1E" stroke-width="4.500"/>' +
  '<g fill="#245A39"><ellipse cx="20" cy="70" rx="8" ry="5"/><ellipse cx="41" cy="72" rx="7" ry="4.500"/><ellipse cx="60" cy="69" rx="8" ry="5"/><ellipse cx="82" cy="72" rx="7" ry="4.500"/></g>' +
  '<g fill="#3FA36B"><circle cx="6" cy="40" r="12"/><circle cx="24" cy="42" r="12"/><circle cx="42" cy="40" r="13"/><circle cx="60" cy="42" r="12"/><circle cx="78" cy="40" r="13"/><circle cx="95" cy="42" r="12"/></g>' +
  '<g fill="#57BF7F"><circle cx="14" cy="34" r="8"/><circle cx="34" cy="33" r="8"/><circle cx="52" cy="34" r="8"/><circle cx="70" cy="33" r="8"/><circle cx="88" cy="34" r="8"/></g>' +
  '<g fill="#2E8B57"><circle cx="24" cy="11" r="10"/><circle cx="78" cy="13" r="10"/></g><g fill="#57BF7F"><circle cx="21" cy="8" r="5"/><circle cx="76" cy="10" r="5"/></g>' +
  '<g fill="#8A6A3C"><ellipse cx="18" cy="90" rx="5" ry="2"/><ellipse cx="46" cy="93" rx="6" ry="2"/><ellipse cx="74" cy="89" rx="5" ry="2"/></g><path d="M34 88q0-5 4-5t4 5z" fill="#E5484D"/><rect x="37" y="88" width="2" height="4" fill="#F6ECDD"/><rect x="0" y="0" width="100" height="100" rx="6" fill="none"/></svg>';
const FOREST_LAYERS = [
  { id: 'em', label: 'Emergent layer', x: 24, y: 11, w: 12, fact: { text: 'The giants. They poke out, 50 metres up.' }, hint: { text: 'The emergent layer is the very top, above the roof.' } },
  { id: 'ca', label: 'Canopy', x: 50, y: 38, w: 12, fact: { text: 'The canopy is a roof of leaves. Most animals live here.' }, hint: { text: 'The canopy is the thick green roof.' } },
  { id: 'un', label: 'Understory', x: 50, y: 62, w: 12, fact: { text: 'The understory is dim. Little sunlight gets through.' }, hint: { text: 'The understory is the shady part under the roof.' } },
  { id: 'fl', label: 'Forest floor', x: 62, y: 91, w: 12, fact: { text: 'The floor is dark. Fallen leaves rot and feed the trees.' }, hint: { text: 'The forest floor is right at the bottom.' } }
];

/* ----- the scene behind the mission path: Rio's bay, with rounded rock mountains, the sea, a beach, and the rainforest ----- */
const brPalm = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-5 0q10-70 2-150h12q6 80 4 150z" fill="#8A5A34"/><g fill="#2E9E5B"><path d="M4-150q-50-30-90 6 46-14 90 4z"/><path d="M4-150q50-30 90 6-46-14-90 4z"/><path d="M4-150q-30-46-74-40 44 8 74 50z"/><path d="M4-150q30-46 74-40-44 8-74 50z"/><path d="M4-150q-4-50 20-70-4 40-12 76z"/></g><g fill="#6B4424"><circle cx="-2" cy="-142" r="7"/><circle cx="10" cy="-140" r="7"/></g></g>';
const BR_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="brsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FC0EE"/><stop offset=".62" stop-color="#C4EEFB"/><stop offset="1" stop-color="#FFF3C9"/></linearGradient>' +
  '<filter id="brsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".16"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#brsky)"/><circle cx="850" cy="104" r="62" fill="#FFE98F"/><circle cx="850" cy="104" r="44" fill="#FFD23F"/>' +
  '<g fill="#fff" opacity=".92"><ellipse cx="170" cy="90" rx="70" ry="22"/><ellipse cx="220" cy="74" rx="46" ry="20"/><ellipse cx="560" cy="60" rx="60" ry="18"/><ellipse cx="610" cy="48" rx="36" ry="16"/></g>' +
  '<g filter="url(#brsh)"><path d="M520 392q6-170 64-196 62 22 80 196z" fill="#86A995"/><path d="M640 392q18-110 62-120 50 14 66 120z" fill="#9BBBA8"/><path d="M548 250q20-40 36-54 30 12 42 60-40-18-78-6z" fill="#A8C7B4"/></g>' +
  '<path d="M0 372h1000v100H0z" fill="#2FA9C9"/><g stroke="#8FDDEE" stroke-width="4" stroke-linecap="round" fill="none"><path d="M430 404q14-8 28 0t28 0M700 420q14-8 28 0t28 0M860 396q14-8 28 0t28 0M560 440q14-8 28 0t28 0"/></g>' +
  '<path filter="url(#brsh)" d="M0 350Q110 286 240 330T470 384L480 600H0z" fill="#2E8B57"/>' +
  '<g fill="#3FA36B"><circle cx="40" cy="330" r="46"/><circle cx="120" cy="306" r="54"/><circle cx="210" cy="322" r="48"/><circle cx="290" cy="350" r="44"/><circle cx="370" cy="372" r="40"/></g><g fill="#57BF7F"><circle cx="76" cy="296" r="30"/><circle cx="170" cy="282" r="32"/><circle cx="250" cy="312" r="28"/><circle cx="336" cy="344" r="26"/></g>' +
  '<path filter="url(#brsh)" d="M0 470Q260 428 520 458T1000 436V600H0z" fill="#F6DFA4"/>' +
  '<g filter="url(#brsh)"><path d="M770 470v-56h90v56" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M782 420v48M798 420v48M814 420v48M830 420v48M846 420v48M772 434h86M772 452h86" stroke="#fff" stroke-width="2" opacity=".8"/></g>' +
  '<g filter="url(#brsh)">' + brPalm(930, 590, 1.1) + brPalm(60, 596, .95) + '</g>' +
  '<path filter="url(#brsh)" d="M0 548Q250 510 520 540T1000 524V600H0z" fill="#EFD08A"/>' +
  '<g transform="translate(650 520)"><circle r="20" fill="#fff" stroke="#1B2A4E" stroke-width="3"/><path d="M0-9l9 6-3 10h-12l-3-10z" fill="#1B2A4E"/></g>' +
  '</svg>';

/* ----- Portuguese words. Edge and Android both have a Brazilian Portuguese voice; without one, the English voice sounds the word out from the spelling beside it ----- */
const PT = (t, phon, inline) => ({ t, lang: 'pt', fallback: phon, inline: !!inline });
const PORTUGUESE = [
  { native: 'olá', rom: 'olá', en: 'hello', icon: 'waving-hand', phon: 'oh-lah' },
  { native: 'obrigada', rom: 'obrigada', en: 'thank you', icon: 'folded-hands', phon: 'oh-bree-gah-dah' },
  { native: 'chuva', rom: 'chuva', en: 'rain', icon: 'cloud-with-rain', phon: 'shoo-vah' },
  { native: 'árvore', rom: 'árvore', en: 'tree', icon: 'deciduous-tree', phon: 'ar-vo-ree' },
  { native: 'peixe', rom: 'peixe', en: 'fish', icon: 'fish', phon: 'pay-shee' },
  { native: 'gato', rom: 'gato', en: 'cat', icon: 'cat', phon: 'gah-too' }
];
wordSkill('portuguese', 'Portuguese words', 'pt', PORTUGUESE);

/* ----- the water cycle, as the rainforest runs it ----- */
bankSkill('water', 'The water cycle', 'science', [
  { pic: 'deciduous-tree', why: 'A tree breathes water out through its leaves.',
    ask: [{ t: 'A tree drinks water. Most of it leaves through the…', s: 'A tree drinks water through its roots. Most of that water leaves the tree again, through the what?', pic: 'droplet', h: 'In the rain lab, tiny holes opened and let the water out. Where were they?', o: [O('Leaves', 'herb'), O('Roots', 'down-arrow'), O('Bark', 'wood')] },
      { t: 'Water leaving a plant through its leaves is called…', pic: 'deciduous-tree', h: 'It starts like the word transport. The plant moves water out into the air.', o: [O('Transpiration', 'herb'), O('Condensation', 'cloud'), O('Freezing', 'snowflake')] }] },
  { pic: 'sun', why: 'Evaporating turns liquid water into a gas: water vapour.',
    ask: [{ t: 'Water that evaporates becomes water vapour. Vapour is a…', pic: 'droplet', h: 'It floats in the air, and you cannot see it. Is that a solid, a liquid or a gas?', o: [O('Gas', 'dashing-away'), O('Liquid', 'water-wave'), O('Solid', 'ice')] },
      { t: 'A puddle dries up in the Sun. The water has…', pic: 'sun', h: 'The Sun warms the water. Its particles speed up, and escape into the air.', o: [O('Evaporated', 'dashing-away'), O('Frozen', 'ice'), O('Sunk', 'down-arrow')] }] },
  { pic: 'cloud', why: 'Cooling turns water vapour back into tiny drops: condensation.',
    ask: [{ t: 'High up, the air is cold. Water vapour turns into…', pic: 'snow-capped-mountain', h: 'When a gas cools, its particles slow down, and gather together again.', o: [O('Tiny drops', 'droplet'), O('Smoke', 'fire'), O('Sunlight', 'sun')] },
      { t: 'What is a cloud made of?', pic: 'sun-behind-cloud', h: 'In the rain lab, vapour rose, cooled and gathered. What did it gather into?', o: [O('Tiny water drops', 'droplet'), O('Cotton wool', 'yarn'), O('Smoke', 'fire')] }] },
  { pic: 'droplet', why: 'Water particles cling together, so leaving water pulls more up.',
    ask: [{ t: 'Water leaves the top of a tree. What happens in the trunk?', pic: 'deciduous-tree', h: 'Water particles cling to each other, like a chain. When the top ones leave, they pull the rest.', o: [O('More is pulled up', 'up-arrow'), O('The water stops', 'stop-sign'), O('The water falls', 'down-arrow')] },
      { t: 'Water climbs a tree inside thin…', pic: 'deciduous-tree', h: 'They run from the roots, up the trunk, to every leaf, like drinking straws.', o: [O('Tubes', 'test-tube'), O('Ropes', 'knot'), O('Bones', 'bone')] }] },
  { pic: 'cloud-with-rain', why: 'The rainforest makes its own rain.',
    ask: [{ t: "Where does much of the Amazon's rain come from?", pic: 'cloud-with-rain', h: 'Each big tree breathes out 1,000 litres a day. That water becomes cloud.', o: [O('The trees', 'deciduous-tree'), O('The Moon', 'full-moon'), O('The rocks', 'rock')] },
      { t: 'Scientists call the water in the Amazon sky a flying…', s: 'Scientists call the water in the Amazon sky a flying what?', pic: 'cloud', h: 'It carries more water than the Amazon itself, but through the air.', o: [O('River', 'water-wave'), O('Fish', 'fish'), O('Kite', 'kite')] }] },
  { pic: 'counterclockwise-arrows-button', why: 'Water goes round and round: the water cycle.',
    ask: [{ t: 'Rain falls. Trees drink it and breathe it out. Then it…', pic: 'deciduous-tree', h: 'The water cycle has no end. After the last step comes the first again.', o: [O('Rains again', 'cloud-with-rain'), O('Is gone', 'cross-mark'), O('Turns to rock', 'rock')] },
      { t: 'People cut down the forest. The land nearby gets…', pic: 'axe', h: 'Fewer trees breathe out less water. Less water in the air makes fewer clouds.', o: [O('Less rain', 'sun'), O('More rain', 'cloud-with-rain'), O('More snow', 'snowflake')] }] }
], 'brazil');

/* ----- electricity, as the electric eel makes it ----- */
bankSkill('electric', 'Electricity', 'science', [
  { pic: 'high-voltage', why: 'Volts measure the push that moves electricity.',
    ask: [{ t: 'The push that moves electricity is measured in…', pic: 'battery', h: 'The eel lab had a meter. It counted them: 0.15, then 1.5, then 15.', o: [O('Volts', 'high-voltage'), O('Litres', 'droplet'), O('Degrees', 'thermometer')] },
      { t: 'A torch battery pushes with about one and a half…', pic: 'flashlight', h: 'They are named after Alessandro Volta, who built the first battery.', o: [O('Volts', 'high-voltage'), O('Metres', 'straight-ruler'), O('Kilograms', 'balance-scale')] }] },
  { pic: CELL_ART, why: 'Cells in a row add their pushes together.',
    ask: [{ t: 'One cell makes 0.15 volts. Ten in a row make…', pic: CELL_ART, h: 'Cells in a row add up. Ten times as many cells, ten times the volts.', o: [O('1.5 volts', 'high-voltage'), O('0.15 volts', 'balance-scale'), O('0.015 volts', 'down-arrow')] },
      { t: 'To get more volts, the eel fires more cells in a…', s: 'To get more volts, the eel fires more cells in a what?', pic: EEL_ART, h: 'End to end, like the batteries in a torch. Each one adds its push to the next.', o: [O('Row', 'right-arrow'), O('Circle', 'hollow-red-circle'), O('Heap', 'rock')] }] },
  { pic: EEL_ART, why: 'An electric eel can make up to 860 volts.',
    ask: [{ t: "The electric eel's body is packed with thousands of…", pic: EEL_ART, h: 'They are flat and tiny, stacked in rows like coins. Each makes a little push.', o: [O('Tiny cells', CELL_ART), O('Tiny magnets', 'magnet'), O('Tiny lamps', 'light-bulb')] },
      { t: 'How does the electric eel stun a fish?', pic: 'fish', h: 'Its brain tells every cell to fire at the same moment. The pushes add up to 860 volts.', o: [O('An electric shock', 'high-voltage'), O('A loud noise', 'loudspeaker'), O('A bright light', 'flashlight')] }] },
  { pic: 'battery', why: "A battery is a stack of cells, like the eel's.",
    ask: [{ t: 'Volta built the first battery in 1800. It was a stack of…', s: 'Alessandro Volta built the first battery in the year 1800. It was a stack of what?', pic: 'battery', h: 'He built it like the electric fish. Its body is a stack of them too.', o: [O('Cells', CELL_ART), O('Books', 'books'), O('Bricks', 'brick')] },
      { t: 'Two torch batteries in a row push … one.', s: 'Two torch batteries in a row push how hard, compared with one?', pic: 'flashlight', h: 'Each battery is 1.5 volts. In a row, their pushes add up.', o: [O('Twice as hard as', 'high-voltage'), O('The same as', 'balance-scale'), O('Half as hard as', 'down-arrow')] }] },
  { pic: 'anatomical-heart', why: 'Your heart, nerves and muscles work by tiny electric signals.',
    ask: [{ t: 'Your heart beats because of tiny … signals.', s: 'Your heart beats because of tiny what signals?', pic: 'anatomical-heart', h: "The same kind of signal runs along your nerves. The eel's cells make a much bigger one.", o: [O('Electric', 'high-voltage'), O('Sound', 'musical-note'), O('Light', 'light-bulb')] },
      { t: 'Which of these carries tiny electric signals?', pic: 'brain', h: 'They run from your brain to every muscle, and tell it when to move.', o: [O('Your nerves', 'high-voltage'), O('Your hair', 'scissors'), O('Your nails', 'nail-polish')] }] },
  { pic: 'water-wave', why: 'In muddy water, the eel finds its way with weak pulses.',
    ask: [{ t: 'The river is muddy and dark. The eel finds fish with…', pic: 'water-wave', h: 'It sends out small pulses of electricity, and feels how they come back.', o: [O('Weak electric pulses', 'high-voltage'), O('Bright light', 'flashlight'), O('Its feet', 'foot')] },
      { t: 'An electric eel is a fish, but it comes up to breathe…', pic: EEL_ART, h: 'It gulps at the surface of the river every few minutes.', o: [O('Air', 'dashing-away'), O('Fire', 'fire'), O('Mud', 'rock')] }] }
], 'brazil');

/* ----- spin: why a kicked ball can bend ----- */
bankSkill('spin', 'Spin and forces', 'science', [
  { pic: SPIN_ART, why: 'A spinning ball curves as it flies.',
    ask: [{ t: 'A ball spins as it flies through the air. It will…', pic: 'soccer-ball', h: 'In the kick lab, only the spinning balls left the straight line.', o: [O('Curve', 'right-arrow-curving-left'), O('Fly straight', 'up-arrow'), O('Stop', 'stop-sign')] },
      { t: 'A ball kicked with no spin flies…', pic: 'soccer-ball', h: 'With no spin, the ball throws no air to either side. So no push comes back.', o: [O('Straight', 'up-arrow'), O('In a curve', 'right-arrow-curving-left'), O('In a circle', 'counterclockwise-arrows-button')] }] },
  { pic: 'dashing-away', why: 'The ball throws air one way. The air pushes it the other.',
    ask: [{ t: 'A spinning ball throws air to the right. The ball goes…', pic: SPIN_ART, h: 'Every push has an equal push back. If the air goes one way, the ball goes the other.', o: [O('Left', 'left-arrow'), O('Right', 'right-arrow'), O('Straight on', 'up-arrow')] },
      { t: 'What does a spinning ball push against?', pic: SPIN_ART, h: 'It drags it round as it spins, and throws it off to one side.', o: [O('The air', 'dashing-away'), O('The grass', 'herb'), O('The goal', 'goal-net')] }] },
  { pic: 'counterclockwise-arrows-button', why: 'More spin throws more air, so the ball bends more.',
    ask: [{ t: 'More spin makes the ball bend…', pic: SPIN_ART, h: 'A faster spin throws more air to the side. So the push back is bigger.', o: [O('More', 'up-arrow'), O('Less', 'down-arrow'), O('The same', 'balance-scale')] },
      { t: 'Spin the ball the other way. It bends…', pic: SPIN_ART, h: 'Now the air is thrown off the other side. The push back swaps over too.', o: [O('The other way', 'left-right-arrow'), O('The same way', 'right-arrow'), O('Not at all', 'stop-sign')] }] },
  { pic: 'rocket', why: 'A rocket and a bending ball obey the same law.',
    ask: [{ t: 'A rocket pushes gas down and goes up. A spinning ball…', pic: 'rocket', h: 'Both push on a gas, and the gas pushes back just as hard.', o: [O('Pushes air sideways', 'dashing-away'), O('Pushes the ground', 'desert'), O('Pushes nothing', 'cross-mark')] },
      { t: "Scientists call a spinning ball's curve the … effect.", s: "Scientists have a name for a spinning ball's curve. It is called the what effect?", pic: SPIN_ART, h: 'It is named after Gustav Magnus, the scientist who studied it.', o: [O('Magnus', 'soccer-ball'), O('Magnet', 'magnet'), O('Magic', 'magic-wand')] }] }
], 'brazil');

bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: 'soccer-ball', hint: 'In the kick lab, every kick was the same. Only the spin changed.', why: 'Change one thing only. Keep the rest the same.',
    ask: [{ t: 'In the kick lab, what did we change each time?', o: [O('The spin', 'counterclockwise-arrows-button'), O('The ball', 'softball'), O('The goal', 'goal-net')] },
      { t: 'We kicked the same way each time. That makes it a…', o: [O('Fair test', 'balance-scale'), O('Guess', 'thinking-face'), O('Game', 'video-game')] }] },
  { pic: 'battery', hint: 'A number needs a unit. 860 what? Volts.', why: 'Volts are the unit for the push of electricity.',
    ask: [{ t: 'The eel makes 860 volts. "Volts" is the…', s: 'The eel makes 860 volts. Volts is the what?', pic: EEL_ART, o: [O('Unit', 'straight-ruler'), O('Animal', 'fish'), O('River', 'water-wave')] },
      { t: 'Which unit measures the push of electricity?', o: [O('Volts', 'high-voltage'), O('Litres', 'droplet'), O('Degrees', 'thermometer')] }] },
  { pic: 'cloud-with-rain', hint: 'Rain, roots, leaves, cloud, and rain again. It ends where it began.', why: 'A cycle goes round, and comes back to the start.',
    ask: [{ t: 'Rain, roots, leaves, cloud, rain. A path that comes back is a…', s: 'Rain, roots, leaves, cloud, and rain again. A path that comes back to its start is a what?', o: [O('Cycle', 'counterclockwise-arrows-button'), O('Line', 'right-arrow'), O('Stop', 'stop-sign')] },
      { t: 'In a cycle, what comes after the last step?', o: [O('The first step', 'counterclockwise-arrows-button'), O('Nothing', 'cross-mark'), O('The end', 'chequered-flag')] }] }
], 'brazil');

/* ----- the rain lab (rebuilt 9 October 2026 to Tony's storyboard, as the standard for every lab after it). A giant rainforest tree, cut open, and the forest far away.
   The roots drink; water climbs thin tubes in the trunk; tiny holes (stomata) under each leaf open and the water leaves as vapour (transpiration); the vapour rises, cools and turns back
   into tiny drops (condensation); the wind carries the cloud away; it rains on far forest, those trees drink, and it goes round again. The forest makes its own rain.
   How it is built: everything that moves is its own layer, and the stylesheet moves it. A camera (.rl-cam) frames each moment like a film: the roots, up the trunk, the leaf,
   then the whole sky. Words and the counter sit on top, outside the camera, so they never move or blur. The storyboard's six fixes: the close-up is tied to one leaf;
   vapour is drawn as faint wisps, the cloud as solid white; thin tubes in the trunk; the loop is drawn with arrows at the end; 1,000 litres is shown as five baths; room for words. ----- */
const RAIN_LAB = (() => {
  const f = n => (+n).toFixed(1);
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => '<path d="M0-30v-11" transform="rotate(' + a + ')"/>').join('');
  const roots = ['M58 258Q74 232 104 216', 'M90 264Q100 240 108 216', 'M138 262Q126 240 116 216', 'M170 254Q148 230 120 216'];
  const tubes = [109.5, 112, 114.5].map(x => 'M' + x + ' 212V128');
  const farTree = (x, y, k, i) => '<g class="rl-ft rl-ft' + i + '" style="transform-origin:' + x + 'px ' + y + 'px"><path d="M' + (x - 2.5) + ' ' + y + 'v-' + (15 * k) + 'h5v' + (15 * k) + 'z" fill="#8A5A34"/>' +
    '<circle cx="' + x + '" cy="' + (y - 24 * k) + '" r="' + (12 * k) + '" fill="#3F9A63"/><circle cx="' + (x - 5 * k) + '" cy="' + (y - 29 * k) + '" r="' + (6.5 * k) + '" fill="#57BF7F"/><circle cx="' + (x + 6 * k) + '" cy="' + (y - 21 * k) + '" r="' + (5 * k) + '" fill="#4CAF72"/></g>';
  const farRoots = [300, 338, 376].map(x => 'M' + (x - 9) + ' 236Q' + (x - 4) + ' 224 ' + x + ' 215M' + (x + 9) + ' 238Q' + (x + 4) + ' 224 ' + x + ' 215').join('');
  /* a soft wisp of vapour: a thin, see-through curl, nothing like a bubble or a drop */
  const wisp = (x, y, s, d, cls) => '<path class="' + (cls || 'rl-wisp') + '" style="--d:' + d + 's" d="M' + x + ' ' + y + 'q' + f(-6 * s) + ' ' + f(-7 * s) + ' 0 ' + f(-14 * s) + 't0 ' + f(-14 * s) + '"/>';
  /* one stoma: a pore between two bean-shaped guard cells */
  const stoma = (x, y, rot, d) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><g class="rl-gl"><path d="M-1-10Q-11-10-11 0t10 10q-5-10 0-20z" fill="#3FA36B" stroke="#24683F" stroke-width="1.300"/></g>' +
    '<g class="rl-gr"><path d="M1-10Q11-10 11 0T1 10q5-10 0-20z" fill="#3FA36B" stroke="#24683F" stroke-width="1.300"/></g><ellipse class="rl-pore" rx="2.600" ry="7.500" fill="#173F2A"/>' +
    '<g class="rl-out" style="--d:' + d + 's"><path d="M0-4q-4-6 0-12t0-12" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" opacity=".9"/></g></g>';
  const bath = (x, i) => '<g class="rl-bath rl-b' + i + '" transform="translate(' + x + ' 274)"><path d="M-8-4h16q0 7-8 7t-8-7z" fill="#fff" stroke="#5A678A" stroke-width="1.300"/><path class="rl-bw" d="M-7-3h14q-1 5-7 5t-7-5z" fill="#4FA8E0"/><path d="M-6 3v2M6 3v2" stroke="#5A678A" stroke-width="1.300" stroke-linecap="round"/></g>';
  /* the loop, drawn at the end: up the trunk, up into the sky, across with the wind, down as rain, back through the ground */
  const LOOP = ['M134 204C138 180 138 152 134 130', 'M156 64C164 46 166 30 176 20', 'M196 16C240 6 278 8 304 22', 'M386 74C392 112 392 156 384 192', 'M326 238C270 245 214 244 162 234'];
  const head = d => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number), x = n[n.length - 2], y = n[n.length - 1], px = n[n.length - 4], py = n[n.length - 3], a = Math.atan2(y - py, x - px), L = 9, W = 6;
    return 'M' + f(x - L * Math.cos(a) - W * Math.sin(a)) + ' ' + f(y - L * Math.sin(a) + W * Math.cos(a)) + 'L' + f(x) + ' ' + f(y) + 'L' + f(x - L * Math.cos(a) + W * Math.sin(a)) + ' ' + f(y - L * Math.sin(a) - W * Math.cos(a)); };
  let s = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A giant rainforest tree cut open: water climbs from its roots to its leaves, leaves the leaves as vapour, becomes a cloud, and rains on forest far away">' +
    '<defs><linearGradient id="rlsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC8EE"/><stop offset=".75" stop-color="#D4F0FB"/><stop offset="1" stop-color="#EAF8FD"/></linearGradient>' +
    '<linearGradient id="rlsoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C6B40"/><stop offset="1" stop-color="#6E4627"/></linearGradient>' +
    '<radialGradient id="rlsun"><stop offset=".55" stop-color="#FFE98F"/><stop offset="1" stop-color="#FFE98F" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="rlclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="rllens"><circle cx="250" cy="128" r="47"/></clipPath>' +
    '<filter id="rlsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".16"/></filter></defs>' +
    '<g clip-path="url(#rlclip)"><rect width="400" height="290" fill="url(#rlsky)"/><g class="rl-cam">';
  /* far away: hills, the far forest and its roots */
  s += '<path d="M180 220Q250 186 320 196T400 192V230H180z" fill="#A7DDB0"/><path d="M226 222Q296 196 360 204T400 202V230H226z" fill="#8FD694"/>';
  s += '<g class="rl-sun" transform="translate(44 42)"><circle r="44" fill="url(#rlsun)" class="rl-halo"/><g class="rl-rays" stroke="#FFC83D" stroke-width="4.500" stroke-linecap="round">' + rays + '</g><circle r="22" fill="#FFD23F"/><circle r="22" fill="none" stroke="#F2B521" stroke-width="2"/></g>';
  s += '<g class="rl-far" filter="url(#rlsh)">' + farTree(300, 214, 1, 0) + farTree(338, 210, 1.2, 1) + farTree(376, 213, 1, 2) + '</g>';
  /* the ground, cut through: grass, soil in layers, and water low in the ground */
  s += '<path d="M0 216H400V290H0z" fill="url(#rlsoil)"/><g fill="none" stroke="#B07D50" stroke-width="2" opacity=".5"><path d="M0 232q60-6 120 0t140 2 140-2"/><path d="M0 243q80 5 160 0t160 0 80 2"/></g>' +
    '<g fill="#B88A5E"><ellipse cx="24" cy="238" rx="5" ry="3"/><ellipse cx="208" cy="228" rx="4" ry="2.500"/><ellipse cx="250" cy="240" rx="6" ry="3.500"/><ellipse cx="350" cy="242" rx="4" ry="2.500"/></g>' +
    '<path d="M0 250q25-6 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0V290H0z" fill="#3D8FC9"/><path class="rl-shimmer" d="M0 251q25-6 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="#9AD3F2" stroke-width="2.500" stroke-dasharray="14 22"/>' +
    '<path d="M0 214q100-5 200 0t200 0v5H0z" fill="#57B26A"/><path d="M0 214q100-5 200 0t200 0" fill="none" stroke="#3F9A57" stroke-width="1.500"/>';
  s += '<g fill="none" stroke-linecap="round"><path d="' + farRoots + '" stroke="#6B4424" stroke-width="2.600"/><path class="rl-fw" d="' + farRoots + '" stroke="#4FA8E0" stroke-width="1.400" stroke-dasharray="3 3.500"/></g>';
  /* the big tree: roots in the water, a trunk cut open to show its thin tubes, and the canopy with one leaf hanging at its edge */
  s += '<g fill="none" stroke-linecap="round">' + roots.map(d => '<path d="' + d + '" stroke="#5A3A1E" stroke-width="6.500"/><path d="' + d + '" stroke="#A9743F" stroke-width="3.600"/>').join('') +
    roots.map(d => '<path class="rl-rw" d="' + d + '" stroke="#2F8FD6" stroke-width="2" stroke-dasharray="3.500 4"/>').join('') + '</g>';
  s += '<path d="M99 218Q104 170 103 122H121Q120 170 125 218z" fill="#A9743F" stroke="#6B4424" stroke-width="2" stroke-linejoin="round"/><path d="M106 214Q108 170 107.500 126H116.500Q116 170 118 214z" fill="#EBD3A8"/>' +
    '<g fill="none" stroke-linecap="round">' + tubes.map(d => '<path d="' + d + '" stroke="#D2E9F6" stroke-width="1.700"/>').join('') + tubes.map((d, i) => '<path class="rl-tw" style="--d:' + (i * .35) + 's" d="' + d + '" stroke="#2F8FD6" stroke-width="1.900" stroke-dasharray="3.500 4.500"/>').join('') + '</g>';
  s += '<g class="rl-canopy" filter="url(#rlsh)"><circle cx="112" cy="102" r="40" fill="#2F8A55"/><circle cx="70" cy="98" r="33" fill="#3F9A63"/><circle cx="154" cy="98" r="33" fill="#3F9A63"/><circle cx="112" cy="70" r="46" fill="#46A86C"/>' +
    '<circle cx="86" cy="52" r="28" fill="#57BF7F"/><circle cx="136" cy="54" r="28" fill="#57BF7F"/><circle cx="112" cy="40" r="22" fill="#6CCB8A"/>' +
    '<g fill="none" stroke="#7FD69B" stroke-width="2.500" stroke-linecap="round" opacity=".7"><path d="M78 44q6-6 14-6M128 46q6-6 14-5M102 30q6-5 12-4"/></g>' +
    '<g class="rl-leaf"><path d="M158 112q6 2 8 8" stroke="#2E7D4F" stroke-width="2" fill="none"/><path d="M166 119q14-4 20 12-14 6-20-12z" fill="#6CCB8A" stroke="#2E7D4F" stroke-width="1.800" stroke-linejoin="round"/><path d="M167 120q9 2 17 10" stroke="#2E7D4F" stroke-width="1.200" fill="none"/></g></g>';
  s += '<g class="rl-vapour" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">' + [[70, 40, 1, 0], [92, 26, 1.2, .9], [116, 20, 1.1, 1.8], [138, 28, 1, .5], [160, 44, .9, 1.4], [104, 36, .8, 2.2]].map(p => wisp(p[0], p[1], p[2], p[3])).join('') + '</g>';
  /* the cloud: it forms above the tree, the wind carries it to the far forest, and it rains */
  s += '<g class="rl-wind" fill="none" stroke="#fff" stroke-width="3.500" stroke-linecap="round"><path d="M160 30q30-8 60 0"/><path d="M190 64q26-8 48 0"/><path d="M150 86q22-6 40 0"/></g>' +
    '<g class="rl-cloudmove"><g class="rl-rain" stroke="#2F8FD6" stroke-width="3" stroke-linecap="round" fill="none"><path d="M112 52V196M124 56V196M136 52V196M148 56V196M160 52V196"/></g>' +
    '<g class="rl-cloud"><g class="rl-puff" fill="#fff" stroke="#BFD9EA" stroke-width="2"><ellipse cx="114" cy="38" rx="22" ry="14"/><ellipse cx="160" cy="40" rx="22" ry="13"/><ellipse cx="136" cy="28" rx="28" ry="19"/><path d="M98 44h76" stroke="none"/></g>' +
    '<g class="rl-drops" fill="#9AD3F2">' + [[118, 36], [130, 30], [142, 36], [154, 32], [126, 42], [148, 44], [138, 22]].map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" style="--d:' + (i * .12) + 's"/>').join('') + '</g></g></g>';
  s += '<g class="rl-farvap" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round">' + [[300, 176, .7, 0], [338, 168, .8, .8], [376, 176, .7, 1.6]].map(p => wisp(p[0], p[1], p[2], p[3])).join('') + '</g>';
  /* the close-up: one leaf, from underneath, in a magnifying glass joined to it by a cone of light */
  s += '<g class="rl-zoom"><path d="M178 122L238 82L238 174z" fill="#fff" opacity=".35"/><path d="M178 122L240 82M178 122L240 174" stroke="#fff" stroke-width="1.600" opacity=".9"/>' +
    '<g clip-path="url(#rllens)"><rect x="200" y="78" width="100" height="100" fill="#7BCB8C"/><g fill="none" stroke="#9EDCAD" stroke-width="3" stroke-linecap="round"><path d="M200 150Q250 128 300 96"/><path d="M226 140q-6-20-24-28M262 122q0-20-16-36M274 116q14 10 26 30"/></g>' +
    stoma(232, 112, 30, 0) + stoma(266, 140, -20, .6) + stoma(238, 158, 10, 1.2) + '</g><circle cx="250" cy="128" r="47" fill="none" stroke="#1B2A4E" stroke-width="3.500"/><circle cx="250" cy="128" r="50" fill="none" stroke="#fff" stroke-width="2.500"/>' +
    '<rect x="176" y="50" width="148" height="22" rx="11" fill="#1B2A4E" opacity=".85"/><text x="250" y="65.500" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">under the leaf, close up</text></g>';
  s += '<g class="rl-loop" fill="none" stroke-linecap="round" stroke-linejoin="round">' + LOOP.map((d, i) => '<g class="rl-a rl-a' + i + '"><path d="' + d + '" pathLength="1" stroke="#1B2A4E" stroke-width="7"/><path d="' + d + '" pathLength="1" stroke="#FFC83D" stroke-width="4"/>' +
    '<path class="rl-ah" d="' + head(d) + '" stroke="#1B2A4E" stroke-width="7"/><path class="rl-ah" d="' + head(d) + '" stroke="#FFC83D" stroke-width="4"/></g>').join('') + '</g>';
  s += '</g>';      /* end of the camera */
  /* on top, still: a strip for the word that names what is happening, and the counter with its five baths */
  s += '<g class="rl-bar" font-weight="700"><rect x="8" y="261" width="384" height="24" rx="12" fill="#fff" opacity=".93"/><text class="rl-word" x="20" y="277.500" font-size="13" fill="#1E6FB0"></text>' +
    '<g class="rl-count"><text x="292" y="277.500" font-size="13" text-anchor="end" fill="#1B2A4E"><tspan class="rl-n">0</tspan> litres a day</text>' + [304, 321, 338, 355, 372].map(bath).join('') + '</g></g></g></svg>';
  return s;
})();
function rainSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab rainlab fill', 'data-s': 'start', html: RAIN_LAB })); }
async function rainSim(stage, ui) {
  rainSetup(stage); const g = $('.lab', stage), word = $('.rl-word', g), num = $('.rl-n', g);
  const W_ = t => () => { word.textContent = t; };
  /* the counter climbs to 1,000 as the baths fill, one at a time */
  const count = () => { word.textContent = 'transpiration'; if (W.fast) { num.textContent = '1,000'; return; } const t0 = performance.now(), go = t => { const k = Math.min(1, (t - t0) / 2200), v = Math.round(1000 * (1 - Math.pow(1 - k, 3)) / 10) * 10; num.textContent = v.toLocaleString('en-NZ'); if (k < 1 && g.isConnected) requestAnimationFrame(go); }; requestAnimationFrame(go); };
  ui.prompt('A giant rainforest tree. Shine the Sun on it!', 'This is a giant tree in the Amazon rainforest, cut open, so that we can see inside. Its roots reach down to the water in the ground. Tap the button to shine the Sun on it.');
  await labStep(ui, g, 'Shine the Sun', 'sun', 'The roots drink. Water climbs thin tubes in the trunk.', 'The Sun warms the leaves. Down below, the roots drink water from the ground. The water climbs up thin tubes inside the trunk, all the way to the leaves.', W_('the roots drink'));
  await labStep(ui, g, 'Open the leaves', 'leaf', 'Tiny holes under each leaf open. Water escapes as vapour.', 'Look in the magnifying glass. It shows that leaf, from underneath. Under every leaf there are tiny holes. They open, and the Sun turns the water into vapour. It evaporates. Vapour is water as a gas, too small to see. A plant losing water like this is called transpiration. One big tree breathes out a thousand litres a day. That is five baths full. Water particles cling together, so as each one leaves, it pulls the next one up the tube behind it.', count);
  await labStep(ui, g, 'Lift the vapour', 'cloud', 'High up it is cold. The vapour turns into cloud.', 'Warm air rises, and carries the vapour up with it. High up, the air is cold. The vapour cools, and turns back into tiny drops of water. That is called condensation. Billions of tiny drops make a cloud.', W_('condensation'));
  await labStep(ui, g, 'Blow the wind', 'wind', 'The wind carries the cloud away. A flying river!', 'The wind blows the clouds across the forest. So much water moves through the sky here that scientists call it a flying river. It carries more water than the Amazon River itself.', W_('a flying river'));
  await labStep(ui, g, 'Let it rain', 'rain', 'Rain falls far away. Other trees drink it. Round it goes!', 'The tiny drops join together, until they are heavy enough to fall as rain. The rain falls on forest far away. Those trees drink it, and breathe it out again. Follow the yellow arrows: round and round it goes. That is the water cycle. The rainforest makes its own rain. If people cut the forest down, fewer trees make fewer clouds, and less rain falls.', W_('the water cycle'));
}
const BAG_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#E6F6FD"/><circle cx="272" cy="42" r="22" fill="#FFD23F"/><g stroke="#FFC83D" stroke-width="4" stroke-linecap="round"><path d="M272 8v-4M272 80v-4M238 42h-4M310 42h-4M248 18l-3-3M296 66l3 3M296 18l3-3M248 66l-3 3"/></g>' +
  '<path d="M0 108q70-16 150-22" stroke="#8A5A34" stroke-width="9" fill="none" stroke-linecap="round"/><g fill="#3FA36B" stroke="#2E7D4F" stroke-width="1.500"><ellipse cx="140" cy="70" rx="22" ry="11" transform="rotate(-30 140 70)"/><ellipse cx="172" cy="92" rx="22" ry="11" transform="rotate(14 172 92)"/><ellipse cx="150" cy="108" rx="22" ry="11" transform="rotate(40 150 108)"/><ellipse cx="60" cy="88" rx="18" ry="9" transform="rotate(-50 60 88)"/></g>' +
  '<path d="M112 92q-6-52 44-52t50 52q0 44-50 44t-44-44z" fill="#fff" fill-opacity=".45" stroke="#7FB9DE" stroke-width="3"/><path d="M110 88q-10 4-14 0M112 96q-10 6-16 4" stroke="#E5484D" stroke-width="3.500" stroke-linecap="round" fill="none"/>' +
  '<g fill="#3BA7F0"><path d="M190 76q4 7 0 9t-4 0q-2-2 4-9zM182 110q4 7 0 9t-4 0q-2-2 4-9zM132 118q4 7 0 9t-4 0q-2-2 4-9zM160 126q3 5 0 7t-3 0q-2-2 3-7z"/></g></svg>' };

/* ----- the electric eel lab (redrawn 9 October 2026, in the style of the rain lab: Tony asked for a better picture). An electric eel in a dark Amazon river.
   One cell makes a tiny push (about 0.15 volts). In a row, the pushes add: ten cells make 1.5 volts, the same as a torch battery; a hundred, 15; a thousand, 150.
   The whole eel fires about 6,000 in a row at once: the strongest ever measured was 860 volts (cells differ a little, so it is less than 6,000 x 0.15).
   Its body is drawn from a curve along its middle, so the outline, the pale belly, the long fin underneath and the stack of cells inside all follow the same line.
   About four fifths of its length is electric organ: thousands of flat cells (electrocytes) in rows, shown as stripes when the body turns see-through.
   The meter is a dial in powers of ten (1, 10, 100, 1,000 volts): each press is ten times the cells, so the needle moves one mark. At full power the field lines run from head to tail. ----- */
const EEL_LAB = (() => {
  const f = n => n.toFixed(1), N = 70, X0 = 20, X1 = 304;
  const at = t => [X0 + (X1 - X0) * t, 186 - 50 * t + 24 * Math.sin(t * 2 * Math.PI)];
  const half = t => t < .85 ? 1.8 + 13.2 * Math.pow(t / .85, .7) : 15 - 3.5 * Math.pow((t - .85) / .15, 2);
  const P = [], U = [], L = [], Nn = [];
  for (let i = 0; i <= N; i++) { const t = i / N, c = at(t), d = at(Math.min(1, t + .002)), e = at(Math.max(0, t - .002)), dx = d[0] - e[0], dy = d[1] - e[1], m = Math.hypot(dx, dy), n = [dy / m, -dx / m], w = half(t);
    P.push(c); Nn.push(n); U.push([c[0] + n[0] * w, c[1] + n[1] * w]); L.push([c[0] - n[0] * w, c[1] - n[1] * w]); }
  const pts = a => a.map(p => f(p[0]) + ' ' + f(p[1])).join('L');
  /* the snout: a half circle round the end of the head */
  const hc = P[N], hn = Nn[N], tg = [-hn[1], hn[0]], hw = half(1), snout = []; for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; snout.push([hc[0] + hw * (hn[0] * Math.cos(a) + tg[0] * Math.sin(a)), hc[1] + hw * (hn[1] * Math.cos(a) + tg[1] * Math.sin(a))]); }
  const body = 'M' + pts(U) + 'L' + pts(snout) + 'L' + pts(L.slice().reverse()) + 'z';
  const belly = 'M' + pts(P.slice(8)) + 'L' + pts(snout.slice(6)) + 'L' + pts(L.slice(8).reverse()) + 'z';
  const sheen = 'M' + pts(P.slice(10, N - 2).map((c, i) => { const j = i + 10, w = half(j / N); return [c[0] + Nn[j][0] * w * .55, c[1] + Nn[j][1] * w * .55]; }));
  /* the long fin under the body, from near the tail to behind the head, with a wavy edge */
  const F = []; for (let i = 4; i <= 60; i++) { const k = 4 + 1.6 * Math.sin(i * .9); F.push([L[i][0] - Nn[i][0] * k, L[i][1] - Nn[i][1] * k]); }
  const fin = 'M' + pts(L.slice(4, 61)) + 'L' + pts(F.slice().reverse()) + 'z', finEdge = 'M' + pts(F);
  const rays = F.filter((_, i) => i % 2 === 0).map((p, k) => { const i = 4 + k * 2; return 'M' + f(L[i][0]) + ' ' + f(L[i][1]) + 'L' + f(p[0]) + ' ' + f(p[1]); }).join('');
  /* the electric organ: from just behind the head back towards the tail. The reveal runs the same way, head first */
  const organ = 'M' + pts(P.slice(4, 61).reverse());
  const eye = [hc[0] + hn[0] * 4.5 - tg[0] * 5, hc[1] + hn[1] * 4.5 - tg[1] * 5];
  const mouth = 'M' + f(hc[0] + tg[0] * 9 - hn[0] * 2) + ' ' + f(hc[1] + tg[1] * 9 - hn[1] * 2) + 'Q' + f(hc[0] + tg[0] * 3 - hn[0] * 6) + ' ' + f(hc[1] + tg[1] * 3 - hn[1] * 6) + ' ' + f(hc[0] - tg[0] * 4 - hn[0] * 4) + ' ' + f(hc[1] - tg[1] * 4 - hn[1] * 4);
  const spots = [14, 22, 30, 38, 46, 54].map(i => { const w = half(i / N); return '<ellipse cx="' + f(P[i][0] + Nn[i][0] * w * .45) + '" cy="' + f(P[i][1] + Nn[i][1] * w * .45) + '" rx="2.400" ry="1.500" fill="#3B4530" opacity=".55"/>'; }).join('');
  /* the dial: 0.1 at the left, 1, 10, 100, 1,000 volts round to the right */
  const DX = 85, DY = 80, DR = 40, pol = (a, r) => [DX - r * Math.cos(a * Math.PI / 180), DY - r * Math.sin(a * Math.PI / 180)];
  let dial = '<path d="M' + (DX - DR) + ' ' + DY + 'A' + DR + ' ' + DR + ' 0 0 1 ' + (DX + DR) + ' ' + DY + '" fill="none" stroke="#E6E9F0" stroke-width="9" stroke-linecap="round"/>' +
    '<path class="e-arc" pathLength="1" d="M' + (DX - DR) + ' ' + DY + 'A' + DR + ' ' + DR + ' 0 0 1 ' + (DX + DR) + ' ' + DY + '" fill="none" stroke="#FFC83D" stroke-width="9" stroke-linecap="round"/>';
  [0, 45, 90, 135, 180].forEach((a, i) => { const p = pol(a, DR - 8), q = pol(a, DR + 5), l = pol(a, DR + 14); dial += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(q[0]) + ' ' + f(q[1]) + '" stroke="#1B2A4E" stroke-width="2"/>' + (i ? '<text x="' + f(l[0] - (i === 4 ? 4 : 0)) + '" y="' + f(l[1] + (i === 4 ? 15 : 4)) + '" font-size="10.500" text-anchor="middle" fill="#5A678A">' + ['', '1', '10', '100', '1,000'][i] + '</text>' : ''); });
  dial += '<g class="e-needle"><path d="M' + DX + ' ' + (DY - 2.5) + 'L' + (DX - DR + 6) + ' ' + DY + 'L' + DX + ' ' + (DY + 2.5) + 'z" fill="#E5484D"/><circle cx="' + DX + '" cy="' + DY + '" r="5" fill="#1B2A4E"/></g>';
  const field = ['M300 136C230 40 100 70 34 184', 'M302 140C238 74 120 98 42 190', 'M300 156C240 250 110 262 34 210', 'M298 152C236 226 120 236 44 204'];
  return '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An electric eel in a dark Amazon river, seen from the side. A dial shows the volts it makes, and its body turns see-through to show the rows of cells that fire">' +
    '<defs><linearGradient id="eelw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DB59A"/><stop offset=".55" stop-color="#4E8670"/><stop offset="1" stop-color="#2F5848"/></linearGradient>' +
    '<linearGradient id="eelb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E8F62"/><stop offset=".7" stop-color="#C79A4E"/><stop offset="1" stop-color="#E8B04A"/></linearGradient>' +
    '<clipPath id="eelclip"><rect width="400" height="290" rx="14"/></clipPath><clipPath id="eelbody"><path d="' + body + '"/></clipPath>' +
    '<mask id="eelm" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="290"><path class="e-rev" d="' + organ + '" pathLength="1" fill="none" stroke="#fff" stroke-width="40"/></mask>' +
    '<clipPath id="eellens"><circle cx="62" cy="246" r="29"/></clipPath><filter id="eelsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="0" flood-color="#0D2A22" flood-opacity=".28"/></filter></defs>' +
    '<g clip-path="url(#eelclip)"><rect width="400" height="290" fill="url(#eelw)"/><rect width="400" height="8" fill="#B9E0C9" opacity=".7"/>' +
    '<g class="e-rays" fill="#fff" opacity=".08"><path d="M60 0h40L60 260H10z"/><path d="M180 0h30L190 260h-50z"/><path d="M300 0h44L330 260h-60z"/></g>' +
    '<g fill="#6B8F3E"><ellipse cx="148" cy="6" rx="12" ry="4"/><ellipse cx="262" cy="5" rx="9" ry="3.200" transform="rotate(12 262 5)"/></g>' +
    '<g class="e-bub" fill="none" stroke="#DDF2E8" stroke-width="1.300" opacity=".7">' + [[40, 240, 0], [120, 250, 1.3], [230, 246, .6], [362, 236, 2.1], [190, 252, 2.8]].map(b => '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="2.600" style="--d:' + b[2] + 's"/>').join('') + '</g>' +
    '<path d="M0 252q60-10 120-2t140 0 140-6V290H0z" fill="#5B4430"/><path d="M0 262q80-6 170 0t230-4V290H0z" fill="#4A3826"/><g fill="#7A6048"><ellipse cx="140" cy="262" rx="9" ry="4"/><ellipse cx="300" cy="258" rx="7" ry="3.500"/><ellipse cx="380" cy="266" rx="6" ry="3"/></g>' +
    '<g class="e-weed" fill="none" stroke="#3E7A55" stroke-width="5" stroke-linecap="round"><path d="M350 262q-10-34 6-62"/><path d="M366 264q10-28-4-52"/><path d="M14 262q10-30-4-54"/></g>' +
    '<g class="prey" filter="url(#eelsh)">' + V.pic('fish', 328, 104, 38) + '</g>' +
    '<g class="e-field" fill="none" stroke="#FFE45E" stroke-width="2.200" stroke-dasharray="6 7" stroke-linecap="round">' + field.map(d => '<path d="' + d + '"/>').join('') + '</g>' +
    '<g class="e-eel" filter="url(#eelsh)"><path d="' + fin + '" fill="#6E7B52" opacity=".9"/><path d="' + rays + '" stroke="#55603F" stroke-width=".9"/><path class="e-ripple" d="' + finEdge + '" fill="none" stroke="#A9B58A" stroke-width="1.600" stroke-dasharray="8 14" stroke-linecap="round"/>' +
    '<path d="' + body + '" fill="#4F5A3C"/><path d="' + belly + '" fill="url(#eelb)" opacity=".9"/><path d="' + sheen + '" fill="none" stroke="#7D8C5F" stroke-width="2.200" stroke-linecap="round" opacity=".7"/>' + spots +
    '<g clip-path="url(#eelbody)"><path class="e-org" d="' + organ + '" fill="none" stroke="#F4EDD0" stroke-width="36" stroke-dasharray="1.300 1.900"/><g class="e-lit" mask="url(#eelm)"><path d="' + organ + '" fill="none" stroke="#FFE45E" stroke-width="36" stroke-dasharray="1.300 1.900"/></g></g>' +
    '<path d="' + body + '" fill="none" stroke="#2E3624" stroke-width="1.600"/><path d="' + mouth + '" fill="none" stroke="#2E3624" stroke-width="1.600" stroke-linecap="round"/>' +
    '<circle cx="' + f(eye[0]) + '" cy="' + f(eye[1]) + '" r="2.800" fill="#F4E7B0"/><circle cx="' + f(eye[0] + .5) + '" cy="' + f(eye[1]) + '" r="1.600" fill="#1B2A4E"/></g>' +
    '<g class="zap" fill="#FFE45E" stroke="#E9A416" stroke-width="1.200" stroke-linejoin="round"><path d="M316 128l12 6-5 5 13 9-18-5 5-5z"/><path d="M312 104l10-10-1 8 14-6-12 12 1-8z"/><path d="M318 156l8 12-7 0 6 14-13-16 7 0z"/></g>' +
    /* the close-up: cells in a row, like coins in a stack */
    '<path d="M' + f(P[18][0]) + ' ' + f(P[18][1]) + 'L76 216" stroke="#fff" stroke-width="1.600" stroke-dasharray="4 4" opacity=".9"/><g filter="url(#eelsh)"><circle cx="62" cy="246" r="32" fill="#FFF8E6" stroke="#1B2A4E" stroke-width="3"/>' +
    '<g clip-path="url(#eellens)"><rect x="30" y="214" width="64" height="64" fill="#E8DFC6"/>' + [-25, -15, -5, 5, 15, 25].map((x, i) => '<g class="ecell c' + i + '"><rect x="' + (57 + x) + '" y="226" width="9" height="28" rx="2.500" fill="#F4F1E6" stroke="#1B2A4E" stroke-width="1.200"/><rect class="ehalf" x="' + (57 + x) + '" y="226" width="4.500" height="28" rx="2" fill="#E8A090"/></g>').join('') + '</g>' +
    '<rect x="22" y="262" width="80" height="17" rx="8.500" fill="#1B2A4E" opacity=".86"/><text x="62" y="274.500" font-size="11" font-weight="700" text-anchor="middle" fill="#fff">cells in a row</text></g>' +
    /* the dial, the count of cells, and the comparison */
    '<g font-weight="700"><rect x="10" y="10" width="150" height="100" rx="13" fill="#fff" opacity=".96"/>' + dial + '<text class="ev" x="' + DX + '" y="103" font-size="16" text-anchor="middle" fill="#1B2A4E">0 volts</text>' +
    '<rect x="222" y="10" width="168" height="30" rx="12" fill="#fff" opacity=".96"/><text class="ec" x="306" y="30.500" font-size="13" text-anchor="middle" fill="#1B2A4E">no cells firing</text>' +
    '<g class="cmp"><rect x="150" y="250" width="240" height="30" rx="12" fill="#FFF6D6" stroke="#E9A416" stroke-width="2"/><text class="ecmp" x="270" y="270" font-size="13" text-anchor="middle" fill="#1B2A4E"></text></g></g></g></svg>';
})();
function eelSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab eellab fill', 'data-s': 'start', html: EEL_LAB })); }
async function eelSim(stage, ui) {
  eelSetup(stage); const g = $('.lab', stage), T = (v, c, cmp) => () => { $('.ev', g).textContent = v; $('.ec', g).textContent = c; $('.ecmp', g).textContent = cmp; if (v === '860 volts') { tone(90, .5, 'sawtooth', .16); tone(1400, .25, 'square', .05, .05); } else tone(220, .12, 'square', .05); };
  ui.prompt('An electric eel in the Amazon. Switch on one cell!', 'This is an electric eel, in a muddy river in the Amazon. It is a fish that comes up to breathe air. The water is so dark that it finds its way with weak pulses of electricity. Most of its long body is packed with thousands of tiny flat cells, in rows, like coins in a stack. Each cell can make a tiny push of electricity. We measure the push in volts. Tap the button to switch on one cell.');
  await labStep(ui, g, 'Use one cell', 'c1', 'One cell: 0.15 volts. A tiny push.', 'One cell makes about 0.15 volts. That is a tiny push, far too small to feel.', T('0.15 volts', '1 cell', 'too small to feel'));
  await labStep(ui, g, 'Ten in a row', 'c10', 'Ten cells in a row: 1.5 volts. A torch battery!', 'Now ten cells fire together, end to end, in a row. Their pushes add up. Ten times 0.15 is 1.5 volts. That is the same as one torch battery.', T('1.5 volts', '10 cells in a row', 'the same as a torch battery'));
  await labStep(ui, g, 'A hundred in a row', 'c100', 'A hundred cells: 15 volts. More than a car battery.', 'A hundred cells in a row. Ten times more cells, so ten times more volts: 15 volts. That is more than a car battery.', T('15 volts', '100 cells in a row', 'more than a car battery'));
  await labStep(ui, g, 'A thousand in a row', 'c1000', 'A thousand cells: 150 volts. That would hurt!', 'A thousand cells in a row make 150 volts. Every time we use ten times as many cells, we get ten times the volts.', T('150 volts', '1,000 cells in a row', 'enough to hurt'));
  await labStep(ui, g, 'Fire the whole eel', 'all', 'About 6,000 cells in a row: 860 volts. Zap!', "The whole eel has about six thousand cells in every row. Its brain tells them all to fire at the very same moment. Together they make up to 860 volts. That is almost four times the push of a wall socket, and the shock stuns a fish in an instant. Long ago, a scientist called Alessandro Volta built the first battery. It was a stack of cells, just like the eel's. The volt is named after him.", T('860 volts', 'about 6,000 cells in a row', 'almost 4 times a wall socket'));
}
const TORCH_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#FFF6E6"/><path d="M236 60l60-34v118l-60-34z" fill="#FFE98F"/><path d="M36 60h176l24-14v78l-24-14H36q-12 0-12-12V72q0-12 12-12z" fill="#5A678A" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/>' +
  '<rect x="40" y="68" width="166" height="34" rx="6" fill="#F2F4F8"/>' + [44, 124].map(x => '<g transform="translate(' + x + ' 70)"><rect width="70" height="30" rx="5" fill="#34C17B" stroke="#1B2A4E" stroke-width="2"/><rect x="70" y="9" width="7" height="12" rx="2" fill="#C9CEDA" stroke="#1B2A4E" stroke-width="1.500"/><rect width="16" height="30" rx="5" fill="#1B2A4E"/><text x="43" y="20" font-size="12" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#fff">1.5 V</text></g>').join('') +
  '<text x="124" y="136" font-size="15" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#1B2A4E">1.5 + 1.5 = 3 volts</text></svg>' };

/* ----- the banana kick lab: a free kick, seen from above. Every kick starts the same way, to the right of the wall. Only the spin changes (a fair test).
   A ball spinning anticlockwise (seen from above) drags air round with it and throws its wake off to the right; by Newton's third law the air pushes the ball to the left: the Magnus effect.
   More spin, more push. Spin the other way and it bends the other way. ----- */
const KICK_PATHS = ['M200 250L308 34', 'M200 250Q250 150 287 34', 'M200 250Q250 150 236 37', 'M200 250Q250 150 392 104'];
const KICK_LAB = '<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A football pitch seen from above: a ball, a wall of four players, and the goal. The path of each kick is drawn">' +
  '<rect width="400" height="290" rx="14" fill="#4FAE62"/><g fill="#5ABB6D"><rect y="58" width="400" height="58"/><rect y="174" width="400" height="58"/></g>' +
  '<g fill="none" stroke="#fff" stroke-width="2.500" opacity=".85"><path d="M0 30h400M84 30v84h232V30M150 30v30h100V30"/><path d="M160 114a44 44 0 0 0 80 0"/></g>' +
  '<rect x="140" y="6" width="120" height="24" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width="3.500"/><path d="M152 6v24M164 6v24M176 6v24M188 6v24M200 6v24M212 6v24M224 6v24M236 6v24M248 6v24M140 18h120" stroke="#fff" stroke-width="1" opacity=".7"/>' +
  '<g stroke="#1B2A4E" stroke-width="1.800"><circle cx="186" cy="40" r="9" fill="#FF9A3D"/>' + [172, 187, 202, 217].map(x => '<circle cx="' + x + '" cy="150" r="8.500" fill="#3B6FD4"/>').join('') + '</g>' +
  KICK_PATHS.map((d, i) => '<path class="ktrail t' + (i + 1) + '" pathLength="1" d="' + d + '" fill="none" stroke="' + ['#fff', '#FFE45E', '#FF9DA0', '#C9BEFF'][i] + '" stroke-width="4" stroke-linecap="round"/>').join('') +
  '<g class="push" font-size="13.500" font-weight="700"><g class="kair" transform="translate(322 176)"><rect x="-66" y="-13" width="132" height="25" rx="12" fill="#fff"/><text y="5" text-anchor="middle" fill="#C0392B">air thrown this way</text><path d="M-18 22h36m-11-8 12 8-12 8" stroke="#E5484D" stroke-width="4.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
  '<g class="kpush" transform="translate(96 196)"><rect x="-70" y="-13" width="140" height="25" rx="12" fill="#fff"/><text y="5" text-anchor="middle" fill="#0C7C8C">ball pushed this way</text><path d="M18 22h-36m11-8-12 8 12 8" stroke="#19A7B8" stroke-width="4.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>' +
  '<text class="gol" x="200" y="96" font-size="44" font-weight="700" text-anchor="middle" fill="#FFE45E" stroke="#1B2A4E" stroke-width="2" paint-order="stroke">GOL!</text>' +
  '<g class="ball" transform="translate(200 250)"><g class="spin">' + V.pic('soccer-ball', -12, -12, 24) + '</g><g class="sarrow" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path class="ccw" d="M18 8A20 20 0 0 0-8-18.300m6-5-7 5 6 6"/><path class="cw" d="M-18 8A20 20 0 0 1 8-18.300m-6-5 7 5-6 6"/></g></g>' +
  '<g font-weight="700"><rect x="12" y="246" width="150" height="34" rx="12" fill="#fff" opacity=".95"/><text class="ks" x="87" y="268" font-size="15" text-anchor="middle" fill="#1B2A4E">ready</text></g></svg>';
function kickSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'lab kicklab fill', 'data-s': 'start', html: KICK_LAB })); }
/* fly the ball along kick i, drawing its trail behind it. Earlier kicks keep their trails */
function kickFly(g, i) {
  const p = $('.t' + i, g), ball = $('.ball', g), L = p.getTotalLength(), T = 1700, me = g._fly = (g._fly || 0) + 1; let t0 = null;
  g.querySelectorAll('.ktrail').forEach(x => { if (x.style.opacity === '1') x.style.strokeDashoffset = 0; }); p.style.opacity = 1; g.classList.remove('landed');
  const step = ts => { if (g._fly !== me || !g.isConnected) return; if (t0 == null) t0 = ts; const f = Math.min(1, (ts - t0) / T), q = p.getPointAtLength(f * L);
    ball.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ')'); p.style.strokeDashoffset = 1 - f; if (f < 1) requestAnimationFrame(step); else { g.classList.add('landed'); if (i === 3) { sfx.great(); confetti(30); } } };
  requestAnimationFrame(step);
}
async function kickSim(stage, ui) {
  kickSetup(stage); const g = $('.lab', stage), go = (i, t) => () => { $('.ks', g).textContent = t; kickFly(g, i); };
  ui.prompt('A free kick! A wall of players blocks the goal.', 'It is a free kick. A wall of players stands between the ball and the goal. We will kick the ball to the right of the wall, the same way every time. Only one thing will change: the spin. Tap the button to kick with no spin.');
  await labStep(ui, g, 'Kick: no spin', 'k0', 'No spin. The ball flies straight, and misses.', 'With no spin, the ball flies in a straight line. It goes past the wall, but it misses the goal.', go(1, 'no spin'));
  await labStep(ui, g, 'Kick: a little spin', 'k1', 'It spins. It bends a little. Not enough!', 'This time the ball spins as it flies. A spinning ball drags the air round with it, and throws the air off to one side: to the right. So the air pushes the ball the other way: to the left. Every push has an equal push back. The ball bends, but not enough.', go(2, 'a little spin'));
  await labStep(ui, g, 'Kick: lots of spin', 'k2', 'More spin, more push. It bends into the goal. Gol!', 'More spin throws more air, so the push on the ball is bigger. The ball bends round the wall, and into the goal! Scientists call this the Magnus effect. In 1997, Roberto Carlos of Brazil scored a famous goal just like this, from 35 metres out.', go(3, 'lots of spin'));
  await labStep(ui, g, 'Spin the other way', 'k3', 'Spin the other way. It bends the other way!', 'Now the ball spins the other way. It throws the air off to the left, so the air pushes the ball to the right. It bends away from the goal.', go(4, 'spin the other way'));
}
const BALLOON_PIC = { svg: '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="170" rx="16" fill="#EAF7EE"/><path d="M92 150Q150 40 250 60" stroke="#8B7BEA" stroke-width="4" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/><path d="M244 50l10 11-14 4z" fill="#8B7BEA"/>' +
  '<ellipse cx="150" cy="78" rx="34" ry="40" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="3"/><path d="M136 56q6-10 18-10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M150 118l-5 8h10z" fill="#FF7A6B" stroke="#1B2A4E" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M196 50a52 52 0 0 1 0 56" stroke="#1B2A4E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M190 102l6 10 8-10" fill="none" stroke="#1B2A4E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<g transform="translate(84 122) rotate(48)">' + V.pic('raised-hand', -26, -26, 52) + '</g><path d="M104 100l10-7M110 112l13-3" stroke="#1B2A4E" stroke-width="3" stroke-linecap="round"/></svg>' };

/* pitch looks for the coding grid: dribble the ball past the defenders to the goal */
/* a goal seen from above, its mouth to the left: two posts, the goal line between them, and the net behind. The coding puzzle turns it to face the ball's last step */
const GOAL_ART = B64('<rect x="12" y="9" width="42" height="46" rx="7" fill="#fff" opacity=".3"/><g stroke="#fff" stroke-width="1.700" opacity=".95"><path d="M22 10v44M32 10v44M42 10v44M12 20h42M12 32h42M12 44h42"/></g>' +
  '<path d="M12 9h34q8 0 8 8v30q0 8-8 8H12" fill="none" stroke="#1B2A4E" stroke-width="6.500" stroke-linecap="round"/><path d="M12 9h34q8 0 8 8v30q0 8-8 8H12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M12 9v46" stroke="#fff" stroke-width="2.500" stroke-dasharray="3 3"/><circle cx="12" cy="9" r="5" fill="#fff" stroke="#1B2A4E" stroke-width="1.800"/><circle cx="12" cy="55" r="5" fill="#fff" stroke="#1B2A4E" stroke-width="1.800"/>');
const PITCH = { mover: 'soccer-ball', goal: GOAL_ART, aim: true, goalName: 'goal', flag: 'glowing-star', flagName: 'star', rock: DEFENDER_ART, cls: 'pitch' };
GRAPH_SETS.brazil = { noun: 'animals', one: 'animal', items: [{ name: 'sloths', art: 'sloth' }, { name: 'toucans', art: TOUCAN_ART }, { name: 'frogs', art: 'frog' }, { name: 'monkeys', art: 'monkey' }, { name: 'parrots', art: 'parrot' }] };
THING_NAMES['soccer-ball'] = 'footballs';
const OLA = 'oh-lah';

/* the four parts of her samba band. Eight boxes are one bar: two beats, each split in four (1 e and a, 2 e and a). */
const SAMBA = [
  { id: 'surdo', name: 'surdo', sayName: 'soor-doo', art: SURDO_ART, sound: 'low', col: '#3B6FD4', hits: 'x...x...',
    intro: { text: 'This is the surdo. Listen. Then tap its beat.', say: ['Samba is the music of carnival in Brazil. It began with African Brazilian people, in Bahia and Rio de Janeiro. A samba band is all drums and bells, and every part plays a different beat. This big drum is the', PT('surdo', 'soor-doo', true), 'It is the heartbeat of the band. Listen to it. Then tap the boxes to copy its beat. Press Check when you are ready.'] },
    done: { text: 'The heartbeat! Boom, boom. Now hear your band.', say: 'That is it! The big drum plays on beat one and beat two. It is the heartbeat of the samba.' } },
  { id: 'ganza', name: 'ganzá', sayName: 'gan-zah', art: GANZA_ART, sound: 'shake', col: '#8B7BEA', hits: 'xxxxxxxx',
    intro: { text: 'This shaker is the ganzá. Listen. Then tap its beat.', say: ['This shaker, full of little beads, is the', PT('ganzá', 'gan-zah', true), 'Listen to it. Then tap the boxes to copy its beat.'] },
    done: { text: 'The ganzá never stops! It fills every box.', say: 'Yes! The shaker never stops. It fills in all the little beats between the big ones, and keeps the band together.' } },
  { id: 'agogo', name: 'agogô', sayName: 'ah-go-go', art: AGOGO_ART, sound: 'bell', col: '#E9A416', hits: 'x.xx.xx.',
    intro: { text: 'Two bells: the agogô. Listen. Then tap its beat.', say: ['Two bells, one high and one low. This is the', PT('agogô', 'ah-go-go', true), 'It came to Brazil from West Africa. Listen to it. Then tap the boxes to copy its beat.'] },
    done: { text: 'Ding, dong! The bells sing over the drums.', say: 'You have it! The bells jump between high and low, and sing over the top of the drums.' } },
  { id: 'tamborim', name: 'tamborim', sayName: 'tam-bo-reen', art: TAMBORIM_ART, sound: 'tick', col: '#E5484D', hits: 'x.x.xx.x',
    intro: { text: 'The little tamborim. Listen. Then tap its beat.', say: ['This small drum, which you hold in one hand and hit with a stick, is the', PT('tamborim', 'tam-bo-reen', true), 'It plays a tricky beat: some of its hits fall between the big beats. Listen. Then tap the boxes to copy it.'] },
    done: { text: 'A full samba band! Carnival time!', say: 'That is the whole band! Four parts, four different beats, and together they make samba. It is carnival time!' } }
];

COUNTRIES.brazil = {
  cheers: ['Muito bem!', 'Gol!'],   /* "very good" and "goal" in Portuguese, used only here */
  ladders: ['beat'],                /* her samba band keeps its own progress; a country reset puts it back to the start */
  name: 'Brazil', hello: 'Olá! Start with Match-day maths.', helloSay: [PT('olá', OLA), 'Start with Match-day maths.'], scene: BR_SCENE,
  thing: 'soccer-ball', boat: 'canoe',
  videos: {
    river: { yt: 'VGurBZ0b6nI', title: 'The largest river on Earth is in the sky', by: 'Be Smart', icon: 'cloud-with-rain' },
    eel: { yt: 'z0M7_HPSi14', title: 'How do fish make electricity?', by: 'TED-Ed', icon: EEL_ART },
    kick: { yt: 'm57cimnJ7fc', title: 'Football physics: the "impossible" free kick', by: 'TED-Ed', icon: 'soccer-ball' },
    sloth: { yt: '-64U7WoBrqM', title: 'Why are sloths so slow?', by: 'TED-Ed', icon: 'sloth' }
  },
  souvenirs: [
    { id: 'br-shirt', art: SHIRT_ART, name: 'Football shirt', price: 20, need: 'm1' }, { id: 'br-capy', art: CAPY_ART, move: 'waddle', head: [78, 20, 34], name: 'Capybara', price: 25, need: 'm1' },
    { id: 'br-sloth', art: 'sloth', name: 'Sloth', price: 25, need: 'm2' }, { id: 'br-cloud', art: 'cloud-with-rain', move: 'float', name: 'Rain cloud', price: 15, need: 'm2' },
    { id: 'br-eel', art: EEL_ART, move: 'swim', head: [86, 22, 30], name: 'Electric eel', price: 30, need: 'm3' }, { id: 'br-toucan', art: TOUCAN_ART, move: 'flap', head: [42, 16, 40], name: 'Toucan', price: 25, need: 'm3' },
    { id: 'br-drum', art: SURDO_ART, move: 'strum', name: 'Samba drum', price: 20, need: 'm4' }, { id: 'br-mask', art: MASK_ART, name: 'Carnival mask', price: 40, need: 'boss' }
  ],
  themes: { carnival: { name: 'Carnival room', price: 40, need: 'boss', wall: '#FFE0EF', wall2: '#FFCDE4', floor: '#19A7B8', line: '#0C8797', rug: '#FFC83D', sky: ['#63C9F2', '#FFE9B8'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['river'] }, { id: 'v2', after: ['boss'], choose: ['eel', 'kick', 'sloth'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Match-day maths', icon: 'soccer-ball', sticker: 'soccer-ball',
      intro: { text: 'Buy snacks with Brazilian money. Then measure the kicks!', say: [PT('olá', OLA), 'Welcome to Brazil! It is match day. First, buy some snacks with Brazilian money. Then measure the kicks on the pitch. Ready?'] },
      rounds: [{ skill: 'money' }, { skill: 'angles' }, { skill: 'money' }, { skill: '@review', or: 'place' }, { skill: 'angles' }, { skill: 'money' }, { skill: '@review', or: 'area' }, { skill: 'angles' }] },
    { id: 'm2', name: 'Rainforest lab', icon: 'deciduous-tree', sticker: 'cloud-with-rain',
      intro: { text: 'Where does the rainforest get all its rain?', say: 'More than half of the Amazon rainforest is in Brazil. It rains there nearly every day. Today you find out where all that rain comes from.' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on the rainforest.', say: 'A rainforest has four layers, like the floors of a building. Put each name on the right layer.', board: LAYERS_BOARD, items: FOREST_LAYERS, done: { text: 'You know the rainforest. Now, the rain lab!' } },
        { act: 'predict', q: 'A big tree drinks 1,000 litres a day. Where does it go?', qsay: 'Here is an experiment. A big rainforest tree drinks about one thousand litres of water every day. That is five baths full. Where do you think all that water goes? Make a prediction.',
          options: [O('Into the air', 'cloud'), O('It stays inside', 'deciduous-tree'), O('Back into the ground', 'down-arrow')], answer: 0, setup: rainSetup, sim: rainSim,
          right: 'You predicted it! The water leaves through the leaves.', wrong: 'Surprise! The water goes out through the leaves, into the air.',
          tryit: { icon: 'deciduous-tree', pic: BAG_PIC, big: "Catch a tree's breath!", text: 'Tie a clear bag over some leaves in the Sun.', say: 'Now try it. On a sunny day, tie a clear plastic bag over a few leaves on a tree, or on a pot plant. Come back in an hour. The inside of the bag will be misty, with drops of water. That water came out of the leaves.' } },
        { skill: 'water' },
        { act: 'order', text: 'A drop of water travels. Tap in order.', say: 'Follow one drop of water through the rain lab. Tap the steps in order, starting in the ground.',
          steps: [{ icon: 'droplet', label: 'Roots drink it', say: 'First, the roots drink the water from the ground.' }, { icon: 'herb', label: 'Leaves let it out', say: 'It climbs the trunk. The leaves let it out as vapour.' }, { icon: 'cloud', label: 'It cools into cloud', say: 'High up, the vapour cools into tiny drops: a cloud.' }, { icon: 'cloud-with-rain', label: 'It falls as rain', say: 'The drops join and fall as rain. Roots drink it again.' }],
          hints: ['Start in the ground. What takes the water in?', 'Next: how does the water get out of the tree?', 'Then the vapour rises and cools. What does it make?', 'Last, the water comes back down.'] },
        { act: 'sort', even: true, text: 'Liquid water, or water vapour?', say: 'Water can be a liquid, which you can see. Or it can be a gas called vapour, which you cannot see. Which is this one?', bins: [{ label: 'Liquid water', icon: 'droplet' }, { label: 'Water vapour', icon: 'dashing-away' }],
          items: [{ icon: 'cloud-with-rain', label: 'Rain', bin: 0, why: 'Rain is drops of liquid water.' }, { icon: 'herb', label: 'Air from a leaf', bin: 1, why: 'Leaves let water out as vapour: a gas.' }, { icon: 'cloud', label: 'A cloud', bin: 0, why: 'A cloud is billions of tiny drops of liquid water.' },
            { icon: 'hot-springs', label: 'Steam in a geyser', bin: 1, why: 'Steam is water as a gas.' }, { icon: 'water-wave', label: 'A river', bin: 0, why: 'A river is liquid water, flowing to the sea.' }],
          done: { text: 'A cloud is liquid! Tiny drops, floating.' } },
        { skill: 'water' }, { skill: 'water' }] },
    { id: 'm3', name: 'Olá!', nameSay: PT('olá', OLA, true), icon: TOUCAN_ART, sticker: 'parrot',
      intro: { text: 'Find Brazil, speak Portuguese, and meet an electric fish!', say: 'Time to find Brazil on the map, learn some Portuguese words, and meet a fish that makes electricity.' },
      rounds: [
        { act: 'findmap', text: 'Where is Brazil? Tap it.', say: 'This is South America. Where is Brazil? Tap it.', view: [246, 244, 186, 240], targets: ['076', '032', '604', '170'], answer: '076',
          hint: { text: 'Brazil is the biggest one. It fills half of South America.' }, done: { text: 'You found Brazil! The biggest country in South America.', say: 'You found Brazil! It is the biggest country in South America, and the fifth biggest in the world. The Equator crosses the top of it, so most of Brazil is in the southern hemisphere.' } },
        { act: 'meet', text: 'Tap each card to hear Portuguese.', say: ['People in Brazil speak Portuguese. Tap each card to hear the word. To say thank you, a girl says', PT('obrigada', 'oh-bree-gah-dah', true), 'and a boy says', PT('obrigado', 'oh-bree-gah-doo', true)], lang: 'pt', words: PORTUGUESE },
        { skill: 'portuguese' }, { skill: 'portuguese' },
        { act: 'predict', q: 'One cell: a tiny push. What do ten in a row make?', qsay: 'Here is an experiment. Your heart and your nerves work by tiny electric signals. One fish in the Amazon has turned that into a weapon. Its body is full of cells, and each one makes a tiny push of electricity. What do you think ten cells in a row will make? Make a prediction.',
          options: [O('Ten times the push', 'high-voltage'), O('The same push', 'balance-scale'), O('A smaller push', 'down-arrow')], answer: 0, setup: eelSetup, sim: eelSim,
          right: 'You predicted it! Cells in a row add their pushes.', wrong: 'Surprise! Cells in a row add their pushes together.',
          tryit: { icon: 'flashlight', pic: TORCH_PIC, big: 'Batteries in a row!', text: 'Open a torch. See how the batteries sit.', say: 'Now try it, with a grown-up. Open a torch, and look at the batteries. They sit in a row, nose to tail, so that their pushes add up. Two batteries of one and a half volts make three volts. Turn one around, and the torch will not light. And remember: a wall socket is dangerous. Never play with one.' } },
        { skill: 'electric' }, { skill: 'electric' },
        { act: 'match', text: 'Match each animal to its fact.', pairs: [
          { a: { art: 'sloth', label: 'Sloth' }, b: { art: 'herb', label: 'Grows algae' }, text: "Green algae grow in a sloth's fur, and help it hide." },
          { a: { art: TOUCAN_ART, label: 'Toucan' }, b: { art: 'thermometer', label: 'Beak cools it' }, text: 'A toucan loses heat through its huge beak to stay cool.' },
          { a: { art: CAPY_ART, label: 'Capybara' }, b: { art: 'mouse', label: 'Biggest rodent' }, text: 'The capybara is the biggest rodent on Earth.' },
          { a: { art: 'ant', label: 'Leafcutter ant' }, b: { art: 'mushroom', label: 'Farms fungus' }, text: 'Leafcutter ants carry leaves home to grow fungus to eat.' }] },
        { skill: 'portuguese' }, { skill: 'electric' }] },
    { id: 'm4', name: 'Samba and code', icon: SURDO_ART, sticker: 'drum',
      intro: { text: 'Bend a free kick. Build a samba band. Code a goal!', say: 'Brazil has won the football World Cup five times, more than any other country. Today you bend a free kick, build your own samba band, and code a goal.' },
      rounds: [
        { act: 'predict', q: 'A ball spins as it flies. What will it do?', qsay: 'Here is an experiment. A footballer kicks the ball so that it spins as it flies. What do you think the ball will do? Make a prediction.',
          options: [O('Curve to one side', 'right-arrow-curving-left'), O('Fly straight', 'up-arrow'), O('Stop in the air', 'stop-sign')], answer: 0, setup: kickSetup, sim: kickSim,
          right: 'You predicted it! Spin makes the ball bend.', wrong: 'Surprise! Spin makes the ball bend.',
          tryit: { icon: 'balloon', pic: BALLOON_PIC, big: 'Bend it yourself!', text: 'Hit a balloon on one side, so it spins.', say: 'Now try it. Throw a balloon or a light ball into the air, and hit it on one side, so that it spins. Watch it curve. Then hit it in the middle, with no spin, and see the difference.' } },
        { skill: 'spin' }, { skill: 'spin' }, { skill: 'scithink' },      /* the three scientist ideas look back at all three labs, so they are asked only once she has done them all */
        { act: 'beat', parts: SAMBA }, { act: 'beat', parts: SAMBA },
        { act: 'code', look: PITCH, text: 'Dribble the ball to the goal.', say: 'Now you are the coach. Tell the ball where to go. Count the squares to the goal. Tap or drag arrows into the boxes to make a path past the defenders. Then tap Go.', cols: 5, rows: 3, start: [0, 2], goal: [4, 0], rocks: [[1, 1], [2, 0], [4, 1]], slots: 7,
          path: [[0, 2], [1, 2], [2, 2], [3, 2], [3, 1], [3, 0], [4, 0]], legs: [[3, 2], [3, 0], [4, 0]], solution: [['r'], ['r'], ['r'], ['u'], ['u'], ['r']] },
        { act: 'code', look: PITCH, text: 'Dribble around the defenders!', say: 'This one is longer. Steer the ball around the defenders.', cols: 5, rows: 4, start: [0, 0], goal: [4, 3], rocks: [[1, 0], [3, 1], [1, 2], [3, 2], [4, 1]], slots: 9,
          path: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [2, 3], [3, 3], [4, 3]], legs: [[0, 1], [2, 1], [2, 3], [4, 3]], solution: [['d'], ['r'], ['r'], ['d'], ['d'], ['r'], ['r']] },
        { act: 'code', look: PITCH, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long run, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 4], goal: [5, 0], rocks: [[1, 3], [4, 4], [2, 1], [4, 0]], slots: 4, repeat: true,
          path: [[0, 4], [1, 4], [2, 4], [3, 4], [3, 3], [3, 2], [4, 2], [5, 2], [5, 1], [5, 0]], legs: [[3, 4], [3, 2], [5, 2], [5, 0]], solution: [['r', 3], ['u', 2], ['r', 2], ['u', 2]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'trophy',
      intro: { text: 'Show everything you know about Brazil!', say: 'The big one! Show everything you have learned in Brazil.' },
      rounds: [{ skill: 'money' }, { skill: 'water' }, { skill: 'angles' }, { skill: 'electric' }, { skill: 'portuguese' }, { skill: 'spin' }, { act: 'beat', parts: SAMBA }, { skill: 'scithink' }, { skill: '@review', or: 'place' }, { skill: '@review', or: 'coords' }] }
  ]
};
/* for tools/t_frames.py: each lab's set-up, so a test can step through its stages and photograph them */
W.labs = Object.assign(W.labs || {}, { rain: rainSetup, eel: eelSetup });
