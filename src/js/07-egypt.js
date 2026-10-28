/* ===== Egypt: the pilot country. Everything here is content, not code. ===== */
const PYRAMID_ART = { svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 30 27H2z" fill="#F6CF87"/><path d="M16 4 30 27H16z" fill="#D79C4D"/><path d="M16 4l3.5 5.8h-7z" fill="#FFC83D"/></svg>' };
const STOMACH_ART = { svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M13 3v6c0 3-7 4-7 12 0 5 4 8 9 8 6 0 9-3 10-8l3-.5V17l-4-1c-2 5-8 4-8-1 0-3 2-4 2-7V3z" fill="#FF9E8E" stroke="#DB5546" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 20c2 3 6 3 8 1" stroke="#DB5546" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>' };

/* the scene behind the mission path: layered paper cut-outs */
const EGYPT_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="egsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#63C9F2"/><stop offset=".62" stop-color="#BFEBF7"/><stop offset="1" stop-color="#FFE9B8"/></linearGradient>' +
  '<filter id="egsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".18"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#egsky)"/>' +
  '<circle cx="800" cy="120" r="92" fill="#FFF6C9" opacity=".55"/><circle cx="800" cy="120" r="58" fill="#FFD23F"/>' +
  '<g fill="#fff" opacity=".9"><ellipse cx="170" cy="110" rx="60" ry="17"/><ellipse cx="215" cy="96" rx="40" ry="16"/><ellipse cx="560" cy="70" rx="48" ry="14"/></g>' +
  '<path filter="url(#egsh)" d="M0 330 Q170 262 360 316 T740 300 T1000 322V600H0z" fill="#F9DDA2"/>' +
  '<g filter="url(#egsh)"><path d="M360 345 500 150 640 345z" fill="#EFBE63"/><path d="M500 150 640 345H548z" fill="#CF9440"/><path d="M500 150l17 24h-34z" fill="#FFD23F"/>' +
  '<path d="M585 350 690 205 795 350z" fill="#EFBE63"/><path d="M690 205 795 350H726z" fill="#CF9440"/>' +
  '<path d="M225 352 300 250 375 352z" fill="#F3C877"/><path d="M300 250 375 352H326z" fill="#D29A47"/></g>' +
  '<path filter="url(#egsh)" d="M0 392 Q220 330 480 384 T1000 366V600H0z" fill="#F4C97B"/>' +
  '<path d="M-20 470 Q170 420 330 452 T640 476 T1020 432V520 Q840 560 640 532 T330 514 T-20 540z" fill="#3BA7D9"/><path d="M40 492 q40-14 80 0M420 498q40-14 80 0M760 480q40-14 80 0" stroke="#BFEBF7" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<g filter="url(#egsh)"><path d="M118 470q-4-70 8-118" stroke="#8A5A3C" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M126 352q-48-30-84 0 44-10 84 0zm0 0q46-36 86-10-46-6-86 10zm0 0q-30-46-70-40 40 12 70 40zm0 0q26-48 64-44-34 14-64 44z" fill="#2F9E6B"/>' +
  '<path d="M900 452q4-60-6-100" stroke="#8A5A3C" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M894 352q-40-26-72 0 38-8 72 0zm0 0q40-30 74-8-40-6-74 8zm0 0q-24-40-58-34 32 10 58 34zm0 0q22-40 54-38-28 12-54 38z" fill="#34B27A"/></g>' +
  '<path filter="url(#egsh)" d="M0 548 Q260 498 520 540 T1000 520V600H0z" fill="#EDB661"/>' +
  '</svg>';

/* ----- body lab ----- */
const KID_FIG = '<circle cx="50" cy="16" r="15.5" fill="#6B4226"/><circle cx="32" cy="9" r="6.5" fill="#6B4226"/><circle cx="68" cy="9" r="6.5" fill="#6B4226"/>' +
  '<path d="M30 34 14 54M70 34 86 54" stroke="#FFD9B0" stroke-width="8.5" stroke-linecap="round"/><path d="M42 80V93M58 80V93" stroke="#FFD9B0" stroke-width="9.5" stroke-linecap="round"/>' +
  '<path d="M37 96.5h10M53 96.5h10" stroke="#FF7A6B" stroke-width="6" stroke-linecap="round"/><rect x="29" y="68" width="42" height="14" rx="5" fill="#19A7B8"/>' +
  '<path d="M26 33Q50 25 74 33L71 73H29Z" fill="TORSO" stroke="#F0B98A" stroke-width="1.4" stroke-linejoin="round"/>' +
  '<circle cx="50" cy="18" r="13" fill="#FFD9B0"/><path d="M37.5 14Q50 1 62.5 14 50 9 37.5 14Z" fill="#6B4226"/>' +
  '<circle cx="45" cy="21.5" r="1.6" fill="#1B2A4E"/><circle cx="55" cy="21.5" r="1.6" fill="#1B2A4E"/><path d="M46 26q4 3 8 0" stroke="#1B2A4E" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
  '<ellipse cx="41.5" cy="25" rx="2.4" ry="1.4" fill="#FF9E8E" opacity=".7"/><ellipse cx="58.5" cy="25" rx="2.4" ry="1.4" fill="#FF9E8E" opacity=".7"/>';
const BODY_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + KID_FIG.replace('TORSO', '#FFF4E6') + '</svg>';
const KID_ART = { svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + KID_FIG.replace('TORSO', '#FFC83D') + '</svg>' };
/* one lung, drawn so a pair sits either side of the heart */
const LUNG_SHAPE = '<path d="M21 3v8c0 2.5-1.5 4-4 5" stroke="#F2B56B" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M17 8c-6 1.5-11 9-11 17.5 0 3.4 2.4 4.6 5.8 3.9C16 28.500 19 26.500 19 23V11c0-2-.7-3.200-2-3z" fill="#F7A3A3" stroke="#E36F6F" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 14c-3 2-5 6-5.500 10" stroke="#E36F6F" stroke-width="1.300" fill="none" stroke-linecap="round" opacity=".7"/>';
const LUNG_A = { svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' + LUNG_SHAPE + '</svg>' };
const LUNG_B = { svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g transform="translate(32 0) scale(-1 1)">' + LUNG_SHAPE + '</g></svg>' };
const LUNG_FACT = { text: 'Two lungs, one on each side. They fill with air.' }, LUNG_HINT = { text: 'You have two lungs, one each side of your chest.' };
const ORGANS = [
  { id: 'brain', art: 'brain', label: 'Brain', x: 50, y: 10, fact: { text: 'Your brain is the boss. It thinks!' }, hint: { text: 'The brain lives inside your head.' } },
  { id: 'lungA', kind: 'lung', art: LUNG_A, label: 'Lung', x: 36.5, y: 45, w: 15, ar: .7, fact: LUNG_FACT, hint: LUNG_HINT },
  { id: 'lungB', kind: 'lung', art: LUNG_B, label: 'Lung', x: 63.5, y: 45, w: 15, ar: .7, fact: LUNG_FACT, hint: LUNG_HINT },
  { id: 'heart', art: 'anatomical-heart', label: 'Heart', x: 51, y: 47, w: 12, fact: { text: 'Your heart sits between your lungs. Thump-thump!' }, hint: { text: 'The heart sits in the middle, between the lungs.' } },
  { id: 'stomach', art: STOMACH_ART, label: 'Stomach', x: 46, y: 63.5, w: 14, fact: { text: 'Your stomach mashes up your food.' }, hint: { text: 'The stomach is down in your tummy.' } }
];
/* the first page of the body atlas (068-spine.js): the four organs she places in the Body lab */
ATLAS.organs = { name: 'Organs', icon: 'anatomical-heart', cid: 'egypt', need: 'egypt.m2', board: BODY_BOARD, parts: ORGANS };
bankSkill('body', 'How the body works', 'science', [
  { pic: 'anatomical-heart', why: 'Your heart pumps blood around your whole body.',
    ask: [{ t: 'Which part pumps your blood?', pic: 'drop-of-blood', h: 'Feel your chest. Thump-thump! A muscle in there squeezes to push blood along.', o: [O('Heart', 'anatomical-heart'), O('Lungs', 'lungs'), O('Brain', 'brain')] },
      { t: 'What does your heart do?', pic: 'anatomical-heart', h: 'Your heart is a muscle. Thump-thump! What does each squeeze push around?', o: [O('Pumps blood', 'drop-of-blood'), O('Breathes air', 'wind-face'), O('Thinks', 'light-bulb')] }] },
  { pic: 'lungs', why: 'Your lungs take in air so your body gets oxygen.',
    ask: [{ t: 'Which part fills with air?', pic: 'wind-face', h: 'Take a big breath. Feel your chest grow as the air goes in.', o: [O('Lungs', 'lungs'), O('Heart', 'anatomical-heart'), O('Stomach', STOMACH_ART)] },
      { t: 'What do your lungs do?', pic: 'lungs', h: 'Take a big breath. Your lungs get bigger. What went in?', o: [O('Breathe air', 'wind-face'), O('Pump blood', 'drop-of-blood'), O('Mash food', 'red-apple')] }] },
  { pic: 'brain', why: 'Your brain thinks, and sends signals along your nerves.',
    ask: [{ t: 'Which part does your thinking?', pic: 'thought-balloon', h: 'It sits inside your head and sends signals along nerves to your body.', o: [O('Brain', 'brain'), O('Heart', 'anatomical-heart'), O('Stomach', STOMACH_ART)] },
      { t: 'What does your brain do?', pic: 'brain', h: 'Your brain sends signals to move your body. It also solves puzzles.', o: [O('Thinks', 'light-bulb'), O('Pumps blood', 'drop-of-blood'), O('Mashes food', 'red-apple')] }] },
  { pic: STOMACH_ART, why: 'Your stomach breaks food into tiny bits your body can use.',
    ask: [{ t: 'Where does food go when you swallow?', pic: 'sandwich', h: 'You swallow. Food slides down into your tummy.', o: [O('Stomach', STOMACH_ART), O('Lungs', 'lungs'), O('Brain', 'brain')] },
      { t: 'What does your stomach do?', pic: STOMACH_ART, h: 'Stomach muscles squeeze your food. Acid helps to break it down.', o: [O('Mashes food', 'red-apple'), O('Breathes air', 'wind-face'), O('Thinks', 'light-bulb')] }] }
], 'egypt');
bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: 'person-running', hint: 'Busy muscles need more blood. Resting muscles need less.', why: 'Exercise makes your heart beat faster. Rest slows it down.',
    ask: [{ t: 'You run fast. Your heart beats…', pic: 'person-running', o: [O('Faster', 'rabbit'), O('Slower', 'snail'), O('The same', 'balance-scale')] }, { t: 'You lie down and rest. Your heart beats…', pic: 'bed', o: [O('Slower', 'snail'), O('Faster', 'rabbit'), O('Twice as fast', 'rocket')] }] },
  { pic: 'microscope', hint: 'In a test, count the thing you are asking about. Keep the rest the same.', why: 'A fair test changes one thing and measures one thing.',
    ask: [{ t: 'Does jumping speed up hearts? What do we count?', o: [O('Heartbeats', 'red-heart'), O('Shoe size', 'running-shoe'), O('Hair colour', 'artist-palette')] }, { t: 'A fair test. Both kids must jump for…', o: [O('The same time', 'stopwatch'), O('Different times', 'hourglass-done'), O('No time at all', 'bed')] }] },
  { pic: 'flexed-biceps', hint: 'Your heart is a muscle. Muscles get strong with moving and good food.', why: 'Moving and eating plants keep your heart strong.',
    ask: [{ t: 'Which helps your heart most?', o: [O('Running', 'person-running'), O('Lollies all day', 'lollipop'), O('Sitting all day', 'couch-and-lamp')] }, { t: 'Which food keeps a heart strong?', o: [O('Vegetables', 'broccoli'), O('Lollies', 'candy'), O('Chips', 'french-fries')] }] },
  { pic: 'test-tube', hint: 'Scientists do not just guess. They try it and watch what happens.', why: 'Scientists test ideas to find out what is true.',
    ask: [{ t: 'Do plants need light? How can you find out?', pic: 'seedling', o: [O('Test it', 'test-tube'), O('Just guess', 'game-die'), O('Ask a cat', 'cat')] }, { t: 'Scientists check their ideas by…', pic: 'thinking-face', o: [O('Testing', 'microscope'), O('Guessing', 'game-die'), O('Wishing', 'shooting-star')] }] }
], 'egypt');
function heartSetup(stage) { stage.innerHTML = ''; stage.append(h('div', { class: 'heartsim fill' }, h('div', { class: 'who' }, art(KID_ART)), h('div', { class: 'hb', style: { '--beat': '.9s' } }, ic('red-heart'), h('div', { class: 'bpm' }, '80'), h('small', null, 'beats a minute')))); }
async function heartSim(stage, ui) {
  heartSetup(stage); const who = $('.who', stage), hb = $('.hb', stage), bpm = $('.bpm', stage);
  await ui.wait(1600); who.classList.add('jump'); ui.prompt('Jump, jump, jump!');
  for (let v = 80; v <= 132; v += 4) { bpm.textContent = v; hb.style.setProperty('--beat', (72 / v).toFixed(2) + 's'); sfx.step(); await ui.wait(190); }
  who.classList.remove('jump'); await ui.wait(900);
}

/* ----- Arabic, spoken by a native voice when the device has one ----- */
const ARABIC = [
  { native: 'مرحبا', rom: 'marhaba', en: 'hello', icon: 'waving-hand', phon: 'mar-ha-ba' },
  { native: 'شكرا', rom: 'shukran', en: 'thank you', icon: 'folded-hands', phon: 'shook-ran' },
  { native: 'قطة', rom: 'qitta', en: 'cat', icon: 'cat', phon: 'kit-ta' },
  { native: 'جمل', rom: 'jamal', en: 'camel', icon: 'camel', phon: 'jam-al' },
  { native: 'شمس', rom: 'shams', en: 'sun', icon: 'sun', phon: 'shams' }
];
wordSkill('arabic', 'Arabic words', 'ar', ARABIC);

/* ----- hieroglyph code-breaking ----- */
const GLYPH = { A: ['eagle', 'eagle'], B: ['foot', 'foot'], D: ['raised-hand', 'hand'], I: ['herb', 'reed'], K: ['basket', 'basket'], L: ['lion', 'lion'], M: ['owl', 'owl'], N: ['water-wave', 'water'], R: ['mouth', 'mouth'], T: ['bread', 'bread'], W: ['hatching-chick', 'chick'] };
const CODEWORDS = { 1: ['BAT', 'ANT', 'MAT', 'RAT', 'WIN', 'BIN', 'KIT', 'LID', 'ARM', 'INK', 'MAN', 'RAM'], 2: ['RAIN', 'MILK', 'LAMB', 'BARN', 'MINT', 'WIND', 'BIRD', 'KIND', 'DRAW', 'TRAM', 'MAIL', 'TAIL', 'WALK', 'DARK'], 3: ['TRAIN', 'BRAIN', 'DRINK', 'BLINK', 'TRAIL', 'DRAWN', 'ALARM', 'TIMID'] };
function codeItem(word, pool) {
  const letters = word.split('');
  const view = (hi, showLetters) => el => { el.innerHTML = ''; el.append(h('div', { class: 'codewrap' },
    h('div', { class: 'glyphs' }, letters.map((L, i) => h('div', { class: 'glyph' + (hi === i ? ' hi' : '') }, ic(GLYPH[L][0]), showLetters > i ? L : null))),
    h('div', { class: 'key' }, Object.keys(GLYPH).map(L => h('div', { class: 'k' }, ic(GLYPH[L][0]), '=' + L))))); };
  const wrong = shuffle(pool.filter(x => x !== word && x.length === word.length)).slice(0, 2), opts = shuffle([word].concat(wrong));
  const steps = letters.map((L, i) => { const ls = shuffle([L].concat(shuffle(Object.keys(GLYPH).filter(x => x !== L)).slice(0, 2)));
    return { type: 'choice', text: 'Find the ' + GLYPH[L][1] + '. Which letter?', say: 'Look at the key. Find the ' + GLYPH[L][1] + '. Which letter is it?', options: ls.map(x => ({ label: x })), answer: ls.indexOf(L), visual: view(i, i) }; });
  return { type: 'choice', text: 'Crack the code! Which word?', say: 'Crack the code. Use the key. Which word is it?', options: opts.map(x => ({ label: x })), answer: opts.indexOf(word), visual: view(null, 0), steps,
    explain: { text: letters.join(' - ') + ' spells ' + word + '.', say: 'Match each picture to its letter. It spells ' + word.toLowerCase() + '.', pic: 'scroll' }, visualDone: view(null, 9) };
}
SKILLS.codebreak = { name: 'Code-breaking (hieroglyphs)', strand: 'patterns', start: 1, max: 3,
  gen(lv, ctx) { ctx = ctx || {}; const pool = CODEWORDS[clamp(lv, 1, 3)], used = ctx.used || (ctx.used = {}); const free = pool.filter(x => !used['cw' + x]); const w = pick(free.length ? free : pool); used['cw' + w] = 1; return codeItem(w, pool); } };

COUNTRIES.egypt = {
  cheers: ['Mumtaz!'],   /* a cheer in this country's own language, used only here */
  name: 'Egypt', hello: 'Marhaba! Start with Pyramid maths.', helloSay: [{ t: 'مرحبا', lang: 'ar', fallback: 'mar-ha-ba' }, 'Start with Pyramid maths.'], scene: EGYPT_SCENE,
  videos: {
    heart: { yt: 'rnIUFrx0DjI', title: 'The human heart', by: 'Learn Bright', icon: 'anatomical-heart' },
    pyr: { yt: 'Xtc0LQuA3z4', title: 'The pyramids of Egypt', by: 'Free School', icon: 'camel' },
    eg101: { yt: 'hO1tzmi1V5g', title: 'Ancient Egypt', by: 'National Geographic', icon: 'scroll' },
    lungs: { yt: '8NUxvJS-_0k', title: 'How do lungs work?', by: 'TED-Ed', icon: 'lungs' }
  },
  souvenirs: [
    { id: 'eg-pyramid', art: PYRAMID_ART, name: 'Little pyramid', price: 20, need: 'm1' }, { id: 'eg-gem', art: 'gem-stone', name: 'Treasure gem', price: 25, need: 'm1' },
    { id: 'eg-steth', art: 'stethoscope', name: 'Stethoscope', price: 15, need: 'm2' }, { id: 'eg-jar', art: 'amphora', name: 'Clay jar', price: 12, need: 'm2' },
    { id: 'eg-scroll', art: 'scroll', name: 'Secret scroll', price: 15, need: 'm3' }, { id: 'eg-palm', art: 'palm-tree', name: 'Palm tree', price: 15, need: 'm3' },
    { id: 'eg-camel', art: 'camel', name: 'Camel', price: 30, need: 'm4' }, { id: 'eg-crown', art: 'crown', name: 'Pharaoh crown', price: 40, need: 'boss' }
  ],
  themes: { tent: { name: 'Desert tent', price: 40, need: 'boss', wall: '#F9DDA2', wall2: '#F3CC84', floor: '#EDB661', line: '#D79C4D', rug: '#C9643B', sky: ['#63C9F2', '#FFE9B8'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['heart'] }, { id: 'v2', after: ['boss'], choose: ['pyr', 'eg101', 'lungs'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Pyramid maths', icon: PYRAMID_ART, sticker: 'gem-stone',
      intro: { text: 'The builders need your maths!', say: [{ t: 'مرحبا', lang: 'ar', fallback: 'mar-ha-ba' }, 'The pyramid builders need your maths. Ready?'] },
      rounds: [{ skill: 'arrays' }, { skill: 'addsub' }, { skill: 'patterns' }, { skill: 'shapes' }, { skill: 'arrays' }, { skill: 'patterns' }, { skill: 'addsub' }, { skill: 'shapes' }] },
    { id: 'm2', name: 'Body lab', icon: 'stethoscope', sticker: 'anatomical-heart',
      intro: { text: 'Egypt had some of the first doctors. Be one!', say: 'Long ago, Egypt had some of the very first doctors. Today, you are the doctor!' },
      rounds: [
        { act: 'place', text: 'Put each part where it lives.', say: 'Drag each body part to where it lives.', board: BODY_BOARD, items: ORGANS, done: { text: 'A whole body. Well done, Doctor!' } },
        { act: 'match', text: 'Match each part to its job.', pairs: [
          { a: { art: 'anatomical-heart', label: 'Heart' }, b: { art: 'drop-of-blood', label: 'Pumps blood' } }, { a: { art: 'lungs', label: 'Lungs' }, b: { art: 'wind-face', label: 'Breathe air' } },
          { a: { art: 'brain', label: 'Brain' }, b: { art: 'light-bulb', label: 'Thinks' } }, { a: { art: STOMACH_ART, label: 'Stomach' }, b: { art: 'red-apple', label: 'Mashes food' } }] },
        { skill: 'body' }, { skill: 'body' },
        { act: 'predict', q: 'You jump 20 times. Your heart will beat…', qsay: 'Here is an experiment. You jump 20 times. What will your heart do? Make a prediction.',
          options: [O('Faster', 'rabbit'), O('Slower', 'snail'), O('The same', 'balance-scale')], answer: 0, setup: heartSetup, sim: heartSim,
          right: 'You predicted it! Jumping made her heart go faster.', wrong: 'Surprise! Her heart went faster. Now we know.',
          tryit: { icon: 'person-running', big: 'Jump 10 times!', text: 'Your turn. Feel your heart, jump, feel again.', say: 'Now you try. Put your hand on your chest and feel your heart. Jump ten times. Then feel it again.' } },
        { act: 'sort', text: 'Is it good for your heart?', bins: [{ label: 'Good for my heart', icon: 'red-heart' }, { label: 'Not so good', icon: 'thumbs-down' }],
          items: [{ icon: 'person-running', label: 'Running', bin: 0, why: 'Running makes your heart stronger.' }, { icon: 'broccoli', label: 'Vegetables', bin: 0, why: 'Vegetables help your heart.' },
            { icon: 'bed', label: 'A good sleep', bin: 0, why: 'Sleep lets your heart rest and mend.' }, { icon: 'red-apple', label: 'Fruit', bin: 0, why: 'Fruit is great for your heart.' },
            { icon: 'lollipop', label: 'Lollies all day', bin: 1, why: 'Too much sugar is hard on your heart.' }, { icon: 'couch-and-lamp', label: 'Sitting all day', bin: 1, why: 'Hearts need you to move.' },
            { icon: 'cup-with-straw', label: 'Fizzy drink', bin: 1, why: 'Fizzy drink is full of sugar.' }, { icon: 'droplet', label: 'Water', bin: 0, why: 'Water keeps your blood flowing well.' }],
          done: { text: 'You know how to look after a heart!' } },
        { skill: 'scithink' }, { skill: 'scithink' }] },
    { id: 'm3', name: 'Hello Egypt', icon: 'waving-hand', sticker: 'scroll',
      intro: { text: 'Find Egypt, speak Arabic, crack a code!', say: 'Time to find Egypt, speak some Arabic, and crack a secret code.' },
      rounds: [
        { act: 'findmap', text: 'Where is Egypt? Tap it.', say: 'This is Africa. Where is Egypt? Tap it.', view: [425, 150, 270, 285], targets: ['818', '180', '710'], answer: '818',
          hint: { text: 'Egypt is at the top of Africa, by the sea.' }, done: { text: 'You found Egypt! The River Nile runs through it.' } },
        { act: 'meet', text: 'Tap each card to hear Arabic.', say: 'People in Egypt speak Arabic. Tap each card to hear the word.', lang: 'ar', words: ARABIC },
        { skill: 'arabic' }, { skill: 'arabic' }, { skill: 'arabic' },
        { act: 'order', text: 'How does the Nile make bread? Tap in order.', say: 'The River Nile helped Egypt grow food. Tap the pictures in order.',
          steps: [{ icon: 'water-wave', label: 'River floods', say: 'First, the Nile floods the land.' }, { icon: 'seedling', label: 'Seeds go in', say: 'The mud is rich. Farmers plant seeds.' }, { icon: 'sheaf-of-rice', label: 'Wheat grows', say: 'The wheat grows tall in the sun.' }, { icon: 'bread', label: 'Bread!', say: 'Wheat is made into bread. Yum!' }],
          hints: ['What comes first? The river brings the water.', 'Next, something goes into the mud.', 'Then it grows tall.', 'Last, we eat!'] },
        { skill: 'codebreak' }, { skill: 'codebreak' },
        { skill: 'codebreak', fixed: () => { const nm = S.name.toUpperCase(), ok = nm.length >= 3 && nm.split('').every(L => GLYPH[L]), w = ok ? nm : 'TAIL'; const it = codeItem(w, [w, 'RAIN', 'MAIL', 'BARN', 'TRAM', 'BAT', 'ANT', 'TRAIN', 'BRAIN'].filter((x, i, a) => a.indexOf(x) === i)); it.text = 'One more secret word!'; if (ok) it.explain = { text: w.split('').join(' - ') + ' spells ' + S.name + '. That is you!', pic: 'star-struck' }; return it; } }] },
    { id: 'm4', name: 'Camel coder', icon: 'camel', sticker: 'camel',
      intro: { text: 'Build a pyramid. Then code the camel!', say: 'First build a pyramid. Then write code to guide the camel across the desert.' },
      rounds: [
        { act: 'build', text: 'Build it! Tap where a block can go.', say: 'Build the pyramid. Tap a space where a block can sit.', rows: [4, 3, 2, 1], hint: { text: 'A block needs two blocks under it.' }, done: { text: 'A pyramid! Each layer has one block less.' } },
        { act: 'code', text: 'Take the camel to the pyramid.', say: 'Count the squares to the pyramid. Tap or drag arrows into the boxes to make a path. Then tap Go.', cols: 4, rows: 3, start: [0, 2], goal: [3, 0], rocks: [[1, 0], [1, 1], [2, 0]], slots: 6,
          path: [[0, 2], [1, 2], [2, 2], [3, 2], [3, 1], [3, 0]], legs: [[3, 2], [3, 0]], solution: [['r'], ['r'], ['r'], ['u'], ['u']] },
        { act: 'code', text: 'Watch out for the rocks!', say: 'This one is longer. Go around the rocks.', cols: 5, rows: 4, start: [0, 3], goal: [4, 0], rocks: [[1, 3], [1, 2], [3, 0], [3, 1]], slots: 10,
          path: [[0, 3], [0, 2], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2], [4, 2], [4, 1], [4, 0]], legs: [[0, 1], [2, 1], [4, 2], [4, 0]], solution: [['u'], ['u'], ['r'], ['r'], ['d'], ['r'], ['r'], ['u'], ['u']] },
        { act: 'code', text: 'Only 3 boxes! Tap an arrow, then ×3 to repeat it.', say: 'A long trip, but only three boxes. Tap an arrow first. Then tap times three to repeat it three times.', cols: 6, rows: 4, start: [0, 3], goal: [5, 0], rocks: [[1, 3], [3, 1], [4, 2]], slots: 3, repeat: true,
          path: [[0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], legs: [[0, 0], [5, 0]], solution: [['u', 3], ['r', 5]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'crown',
      intro: { text: 'Show everything you know about Egypt!', say: 'The big one! Show everything you have learned in Egypt.' },
      rounds: [{ skill: 'arrays' }, { skill: 'body' }, { skill: 'addsub' }, { skill: 'arabic' }, { skill: 'patterns' }, { skill: 'scithink' }, { skill: 'shapes' }, { skill: 'codebreak' }] }
  ]
};
