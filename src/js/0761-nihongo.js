/* ===== にほんご: Japanese, the strand that runs through the whole game.
   Tony, 9 October 2026: "We need to work on the japanese language. It should be based on year 1 words in hirigana. Remember, this needs to be the main piece for Wonderworld.
   She needs to have a system that sets her up well to start conversation. I like to have the flashcards to test each stage before she moves up a level. Make it fun! Keep the animation theme working well too."

   THE SYSTEM. Twelve stations on a bullet-train line (JP_ST). Each station is one row of the hiragana chart, in the order every Japanese child learns it (あいうえお, then か, さ, た, な, は, ま, や, ら, わ),
   then the two dots and the circle (が, ぱ), then the small letters (しゃ, っ). Each station also teaches one piece of conversation, in the order of the New Zealand Curriculum's
   Learning Languages, Level 1 (greet and farewell; introduce yourself; numbers; personal information; likes; asking for things).
   A visit to a station: MEET each new letter (it writes itself stroke by stroke, then she traces it), LISTEN (hear a sound, tap its letter), READ (read a word, pick its picture),
   BUILD (hear a word, put its letters in order), TALK (an animated conversation with Kenta the Shiba; she picks her reply, then says it out loud), and the FLASHCARD RACE against a fox.
   She moves to the next station only by winning the race (the same rule as the maths race). Each station she passes stamps her book with an eki stamp, as Japanese stations do.
   Words use only the letters she has met so far, so every word she is asked to read is one she can read. No romaji is ever shown to her: hiragana, pictures and sound.

   The teaching rule holds everywhere: a wrong pick greys out and a clue is given (what the letter sounds like in its picture word, or the word said again slowly). Nothing is lit.
   A word she cannot read is broken into its letters, which she taps to hear one at a time. A letter tile she cannot find is broken down to the next single sound.

   Her place is S.jp { st: stations passed (0 to 12), placed, met: { station: 1 }, wins, again: [card keys], seen, day }. It belongs to no country: a country reset leaves it alone.
   She can visit any day from the world map (the にほんご button) or her passport. Japan's missions use it: { act: 'nihongo' } is a visit, part: 'race' the race alone, part: 'talk' a conversation.

   Sources: hiragana order and the あいうえお chart, the standard gojūon table taught in Japanese first grade. Stroke order and paths: KanjiVG (kanjivg.tagaini.net, Ulrich Apel, CC BY-SA 3.0),
   built into gen/kana.json by tools/mkkana.py. Letters drawn in Klee One (Fontworks, SIL Open Font License), a hand-written school-book style.
   Conversation order: the New Zealand Curriculum, Learning Languages, Level 1 achievement objectives (1.1 greet, farewell and acknowledge people; 1.2 introduce themselves; numbers; personal information). ===== */

/* ---- each hiragana and its sound in romaji. Romaji is never shown to her: it sounds a word out on a device with no Japanese voice, and the tests use it ---- */
const JP_R = {};
('あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo ' +
 'らra りri るru れre ろro わwa をo んn がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda ぢji づzu でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo').split(' ').forEach(s => { JP_R[s[0]] = s.slice(1); });
/* katakana (Tony, 11 October, approving "katakana first: her name アリア, ニュージーランド, パン"): every hiragana has a katakana twin with the same sound, 0x60 further on in Unicode */
const jpKata = t => String(t).replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
const jpHira = t => String(t).replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const jpIsKata = t => /[\u30a1-\u30fc]/.test(String(t));
Object.keys(JP_R).forEach(c => { JP_R[jpKata(c)] = JP_R[c]; });
const JP_SMALL = { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o', 'ャ': 'a', 'ュ': 'u', 'ョ': 'o' };
/* a word as its sounds: きゃ is one sound; っ is a tiny pause that doubles the next sound */
function jpMora(w) {
  const out = [];
  for (const c of String(w)) {
    if (JP_SMALL[c] && !out.length) { out.push({ k: c, r: 'y' + JP_SMALL[c] }); continue; }       /* a small letter on its own says its big letter's sound */
    if (JP_SMALL[c] && out.length) { const p = out[out.length - 1]; p.k += c; p.r = /^(sh|ch|j)i$/.test(p.r) ? p.r.slice(0, -1) + JP_SMALL[c] : p.r.slice(0, -1) + 'y' + JP_SMALL[c]; continue; }
    if (c === 'っ' || c === 'ッ') { out.push({ k: c, r: '', gem: true }); continue; }
    if (c === 'ー') { const p = out[out.length - 1]; out.push({ k: c, r: p ? p.r.slice(-1) : '', long: true }); continue; }   /* the long line: the sound before it, held */
    if (JP_R[c] != null) out.push({ k: c, r: JP_R[c] });
  }
  out.forEach((m, i) => { if (m.gem && out[i + 1]) { const n = out[i + 1].r; m.r = n.startsWith('ch') ? 't' : n[0] || ''; } });
  return out;
}
const jpClean = t => String(t).replace(/[！？。、!?.,]/g, '');
/* romaji for a word or a sentence. A word ending in は (わたしは, こんにちは) says wa: は is a little job word there */
const jpRom = t => jpClean(t).split(/\s+/).filter(Boolean).map(w => { let r = jpMora(w).map(m => m.r).join(''); if (w.length > 1 && w.endsWith('は') && w !== 'はは') r = r.slice(0, -2) + 'wa'; return r; }).join(' ');
/* how an English voice should sound it out, if the device has no Japanese voice: ko-n-ni-chi-wa becomes kon-nee-chee-wah */
const JP_V = { a: 'ah', i: 'ee', u: 'oo', e: 'eh', o: 'oh' };
const jpPhon = t => jpClean(t).split(/\s+/).filter(Boolean).map(w => { const out = []; const ms = jpMora(w); if (w.length > 1 && w.endsWith('は')) ms[ms.length - 1] = { r: 'wa' };
  ms.forEach(m => { if (m.gem) { if (out.length) out[out.length - 1] += m.r; return; } if (m.long) { if (out.length) out[out.length - 1] += ''; return; } if (m.r === 'n') { if (out.length) out[out.length - 1] += 'n'; else out.push('n'); return; } const v = m.r.slice(-1); out.push(m.r.slice(0, -1) + (JP_V[v] || v)); });
  return out.join('-'); }).join(', ');
const JPV = t => ({ t, lang: 'ja', fallback: jpPhon(t) || 'a little pause' });
const jpSay = (t, o) => Speech.say([JPV(t)], o);
const jpEl = (t, cls) => h('span', { class: 'jp' + (cls ? ' ' + cls : '') + ([...String(t)].length > 4 ? ' long' : '') + ([...String(t).replace(/\s/g, '')].length > 6 ? ' vlong' : ''), lang: 'ja' }, t);   /* vlong: ニュージーランド, eight letters, is drawn smaller so it fits its card */
/* counting on, as children in Japan chant it: し for 4 and しち for 7 (Tony, 11 October: "if we are counting on, this should be 'Shi'"). よん and なな are the other ways to say them */
const JP_NUM = ['', 'いち', 'に', 'さん', 'し', 'ご', 'ろく', 'しち', 'はち', 'きゅう', 'じゅう'];
/* her name in hiragana (the player: ありあ), when every sound in it has a letter. Otherwise her name as it is */
const jpName = () => { const n = S.name || 'Explorer'; return (n.length >= 2 && n.length <= 8 && kanaName(n)) || n; };
const jpFill = t => String(t).replace('{name}', jpName()).replace('{kname}', jpKata(jpName()));   /* {kname}: her name in katakana, as a name from another country is written (アリア) */

/* ---- the twelve stations. kana: the new letters. anch: each new letter's picture word, as on a Japanese child's あいうえお chart (the letter is in it; the word may use letters still to come).
   words: words to read, using only letters met so far. talk: the conversation. rule: how this row works, said when she meets it ---- */
const JP_ST = [
  { head: 'あ', kana: 'あいうえお', name: 'The five vowels',
    rule: { text: 'あ い う え お: the five sounds in every letter.', intro: 'These five are the vowels. Listen.', outro: 'Every other letter ends in one of these five sounds. Learn these, and you have the key to them all.' },
    anch: [['あり', 'ant', 'ant'], ['いぬ', 'dog', 'dog'], ['うさぎ', 'rabbit', 'rabbit'], ['えんぴつ', 'pencil', 'pencil'], ['おにぎり', 'rice ball', 'rice-ball']],
    words: [['いえ', 'house', 'house'], ['うえ', 'up', 'up-arrow'], ['あお', 'blue', 'blue-circle'], ['え', 'picture', 'framed-picture'], ['いい', 'good', 'thumbs-up'], ['あい', 'love', 'red-heart']],
    talk: [{ scene: 'park', ask: 'Kenta says hello. What do you say?', dog: 'こんにちは！', dogEn: 'Hello!', me: 'こんにちは！', meEn: 'Hello!', no: ['おやすみ。', 'ありがとう！'], clue: 'You are meeting a friend. Say hello back.' }] },
  { head: 'か', kana: 'かきくけこ', name: 'The か row',
    rule: { text: 'k, then a vowel: か き く け こ.', intro: 'Here is the secret of the chart. This row starts with a k sound, then adds the five vowels. Listen.', outro: 'Every row works like this.' },
    anch: [['かさ', 'umbrella', 'umbrella'], ['きつね', 'fox', 'fox'], ['くま', 'bear', 'bear'], ['けむし', 'caterpillar', 'bug'], ['こおり', 'ice', 'ice']],
    words: [['かお', 'face', 'slightly-smiling-face'], ['あか', 'red', 'red-circle'], ['き', 'tree', 'deciduous-tree'], ['いか', 'squid', 'squid'], ['えき', 'station', 'station'], ['こえ', 'voice', 'speaking-head']],
    talk: [{ scene: 'morning', ask: 'The sun is up. Kenta says…', dog: 'おはよう！', dogEn: 'Good morning!', me: 'おはよう！', meEn: 'Good morning!', no: ['おやすみ。', 'こんにちは！'], clue: 'The sun is coming up. It is morning.' },
      { scene: 'night', ask: 'Bedtime! Kenta says…', dog: 'おやすみ。', dogEn: 'Good night.', me: 'おやすみ。', meEn: 'Good night.', no: ['おはよう！', 'こんにちは！'], clue: 'The moon is out. It is time for bed.' }] },
  { head: 'さ', kana: 'さしすせそ', name: 'The さ row',
    rule: { text: 's, then a vowel. But し says shi.', intro: 'This row starts with an s sound. Listen.', outro: ['Listen to the second one again.', JPV('し'), '. It sounds like she, not see.'] },
    anch: [['さかな', 'fish', 'fish'], ['しお', 'salt', 'salt'], ['すいか', 'watermelon', 'watermelon'], ['せんせい', 'teacher', 'woman-teacher'], ['そり', 'sled', 'sled']],
    words: [['すし', 'sushi', 'sushi'], ['いす', 'chair', 'chair'], ['あさ', 'morning', 'sunrise'], ['かさ', 'umbrella', 'umbrella'], ['しか', 'deer', 'deer'], ['あし', 'foot', 'foot']],
    talk: [{ scene: 'gift', ask: 'Kenta gives you a present. You say…', dog: 'どうぞ。', dogEn: 'Here you are.', me: 'ありがとう！', meEn: 'Thank you!', no: ['おはよう！', 'おやすみ。'], clue: 'Someone gave you a present. Thank them.', after: 'どういたしまして。', afterEn: 'You are welcome.' }] },
  { head: 'た', kana: 'たちつてと', name: 'The た row',
    rule: { text: 't, then a vowel. ち says chi, つ says tsu.', intro: 'This row starts with a t sound. Listen.', outro: ['Two of them are a little different.', JPV('ち'), 'and', JPV('つ'), '.'] },
    anch: [['たいこ', 'drum', 'drum'], ['ちず', 'map', 'world-map'], ['つき', 'moon', 'crescent-moon'], ['てがみ', 'letter', 'envelope'], ['とり', 'bird', 'bird']],
    words: [['たこ', 'octopus', 'octopus'], ['くつ', 'shoes', 'running-shoe'], ['て', 'hand', 'raised-hand'], ['いと', 'thread', 'thread'], ['とけい', 'clock', 'mantelpiece-clock'], ['くち', 'mouth', 'mouth']],
    talk: [{ scene: 'park', ask: 'Kenta says his name. Now say yours.', dog: 'ぼくは けんた。', dogEn: 'I am Kenta.', me: 'わたしは {name} です。', meEn: 'I am {en}.', no: ['おやすみ。', 'ありがとう！'], clue: 'Kenta told you his name. Tell him yours.' }] },
  { head: 'な', kana: 'なにぬねの', name: 'The な row',
    rule: { text: 'n, then a vowel: な に ぬ ね の.', intro: 'This row starts with an n sound. Listen.', outro: 'No surprises in this row!' },
    anch: [['なし', 'pear', 'pear'], ['にんじん', 'carrot', 'carrot'], ['ぬいぐるみ', 'teddy', 'teddy-bear'], ['ねずみ', 'mouse', 'mouse'], ['のこぎり', 'saw', 'carpentry-saw']],
    words: [['いぬ', 'dog', 'dog'], ['ねこ', 'cat', 'cat'], ['なす', 'eggplant', 'eggplant'], ['さかな', 'fish', 'fish'], ['にく', 'meat', 'cut-of-meat'], ['きのこ', 'mushroom', 'mushroom']],
    talk: [{ scene: 'park', ask: 'Kenta asks your name. You say…', dog: 'おなまえは？', dogEn: 'What is your name?', me: 'わたしは {name} です。', meEn: 'I am {en}.', no: ['こんにちは！', 'おやすみ。'], clue: 'Kenta asked your name. Tell him.', after: 'よろしく！', afterEn: 'Nice to meet you!' }] },
  { head: 'は', kana: 'はひふへほ', name: 'The は row',
    rule: { text: 'h, then a vowel. ふ says fu.', intro: 'This row starts with an h sound. Listen.', outro: ['Listen to the middle one again.', JPV('ふ'), '. It is soft, like blowing out a candle.'] },
    anch: [['はさみ', 'scissors', 'scissors'], ['ひよこ', 'chick', 'baby-chick'], ['ふうせん', 'balloon', 'balloon'], ['へび', 'snake', 'snake'], ['ほね', 'bone', 'bone']],
    words: [['はな', 'flower', 'blossom'], ['ほし', 'star', 'star'], ['ふね', 'ship', 'ship'], ['ひと', 'person', 'person-standing'], ['はし', 'chopsticks', 'chopsticks'], ['ひこうき', 'aeroplane', 'airplane']],
    talk: [{ count: [2, 5], scene: 'count', thing: 'red-apple', one: 'apple', many: 'apples' }] },
  { head: 'ま', kana: 'まみむめも', name: 'The ま row',
    rule: { text: 'm, then a vowel: ま み む め も.', intro: 'This row starts with an m sound. Listen.', outro: '' },
    anch: [['まど', 'window', 'window'], ['みかん', 'mandarin', 'tangerine'], ['むし', 'bug', 'lady-beetle'], ['めがね', 'glasses', 'glasses'], ['もみじ', 'maple leaf', 'maple-leaf']],
    words: [['め', 'eye', 'eye'], ['みみ', 'ear', 'ear'], ['くま', 'bear', 'bear'], ['もも', 'peach', 'peach'], ['うま', 'horse', 'horse'], ['むし', 'bug', 'lady-beetle']],
    talk: [{ scene: 'room', ask: 'Kenta asks what it is. You say…', dog: 'これは なんですか？', dogEn: 'What is this?', thing: 'cat', me: 'これは ねこ です。', meEn: 'This is a cat.', no: ['これは いぬ です。', 'これは ほし です。'], clue: 'Look at the picture. What is it?' },
      { scene: 'room', ask: 'And this one?', dog: 'これは？', dogEn: 'And this?', thing: 'peach', me: 'これは もも です。', meEn: 'This is a peach.', no: ['これは くま です。', 'これは め です。'], clue: 'Look at the picture. What is it?' }] },
  { head: 'や', kana: 'やゆよ', name: 'The や row',
    rule: { text: 'Only three: や ゆ よ.', intro: 'This row is short. There are only three. Listen.', outro: 'The other two sounds are not used in Japanese any more.' },
    anch: [['やぎ', 'goat', 'goat'], ['ゆきだるま', 'snowman', 'snowman'], ['よる', 'night', 'night-with-stars']],
    words: [['やま', 'mountain', 'mount-fuji'], ['ゆき', 'snow', 'snowflake'], ['ゆめ', 'dream', 'thought-balloon'], ['やさい', 'vegetables', 'leafy-green'], ['ゆかた', 'summer kimono', 'kimono']],
    talk: [{ count: [6, 10], scene: 'count', thing: 'cherry-blossom', one: 'cherry blossom', many: 'cherry blossoms' },
      { scene: 'park', any: true, ask: 'Kenta asks how old you are.', dog: 'なんさい？', dogEn: 'How old are you?', opts: [['ろくさい です。', 'I am six.'], ['ななさい です。', 'I am seven.'], ['はっさい です。', 'I am eight.']], clue: 'Pick your own age.' }] },
  { head: 'ら', kana: 'らりるれろ', name: 'The ら row',
    rule: { text: 'r, said softly: ら り る れ ろ.', intro: 'This row starts with a soft r, a little bit like an l. Listen.', outro: '' },
    anch: [['らっぱ', 'trumpet', 'trumpet'], ['りんご', 'apple', 'red-apple'], ['くるま', 'car', 'automobile'], ['れっしゃ', 'train', 'train'], ['ろうそく', 'candle', 'candle']],
    words: [['そら', 'sky', 'sun-behind-cloud'], ['さる', 'monkey', 'monkey'], ['くるま', 'car', 'automobile'], ['りす', 'squirrel', 'chipmunk'], ['とり', 'bird', 'bird'], ['いろ', 'colour', 'artist-palette']],
    talk: [{ scene: 'park', any: true, ask: 'Kenta asks what you like.', dog: 'なにが すき？', dogEn: 'What do you like?', opts: [['ねこが すき です。', 'I like cats.'], ['いぬが すき です。', 'I like dogs.'], ['すしが すき です。', 'I like sushi.']], clue: 'Pick the one you like best.', after: 'ぼくは ほねが すき！', afterEn: 'I like bones!' }] },
  { head: 'わ', kana: 'わをん', name: 'わ, を and ん',
    rule: { text: 'わ, the joining word を, and ん.', intro: 'The last three. Listen.', outro: ['The middle one is a joining word. It goes after the thing you want, as in', JPV('りんごを ください'), '. And the last one is the only letter that never starts a word.'] },
    anch: [['わに', 'crocodile', 'crocodile'], ['ほんを よむ', 'read a book', 'books'], ['みかん', 'mandarin', 'tangerine']],
    words: [['わに', 'crocodile', 'crocodile'], ['ほん', 'book', 'books'], ['みかん', 'mandarin', 'tangerine'], ['にわとり', 'chicken', 'rooster'], ['せんせい', 'teacher', 'woman-teacher']],
    talk: [{ scene: 'shop', ask: 'You want an apple. You say…', dog: 'いらっしゃいませ！', dogEn: 'Welcome to my shop!', want: 'red-apple', me: 'りんごを ください。', meEn: 'An apple, please.', no: ['みかんを ください。', 'ねこを ください。'], clue: 'Look at your thought bubble. What do you want?', after: 'はい、どうぞ。', afterEn: 'Here you are.' }] },
  { head: 'が', kana: 'がざだばぱ', name: 'Two dots and a circle', marks: true,
    rule: { text: 'Two dots make a sound buzz. A circle makes p.', intro: 'Two little dots change a sound. Listen to each one change.', outro: 'And a little circle turns the h sound into a p sound. One small mark, and you know twenty five new sounds.' },
    anch: [['めがね', 'glasses', 'glasses', 'か'], ['かざん', 'volcano', 'volcano', 'さ'], ['だんご', 'dango', 'dango', 'た'], ['かばん', 'bag', 'backpack', 'は'], ['らっぱ', 'trumpet', 'trumpet', 'は']],   /* each picture word has its own letter in it (Tony, 11 October, on ぱ shown with えんぴつ: "the character isnt in the word") */
    words: [['ごはん', 'rice', 'cooked-rice'], ['うさぎ', 'rabbit', 'rabbit'], ['ぶた', 'pig', 'pig'], ['ぞう', 'elephant', 'elephant'], ['たまご', 'egg', 'egg'], ['でんわ', 'telephone', 'telephone'], ['えんぴつ', 'pencil', 'pencil'], ['かばん', 'bag', 'backpack']],
    talk: [{ scene: 'table', ask: 'Dinner is ready! Before you eat, say…', dog: 'たべよう！', dogEn: "Let's eat!", me: 'いただきます！', meEn: 'I humbly receive!', no: ['ごちそうさま！', 'おやすみ。'], clue: 'You have not eaten yet. What do we say first?' },
      { scene: 'table', empty: true, ask: 'All gone! After eating, say…', dog: 'ぜんぶ たべたね！', dogEn: 'You ate it all!', me: 'ごちそうさま！', meEn: 'Thank you for the meal!', no: ['いただきます！', 'おはよう！'], clue: 'You have finished. What do we say after?' }] },
  { head: 'きゃ', kana: 'ゃゅょっ', name: 'Small letters', small: true,
    rule: { text: 'Small や ゆ よ join on. Small っ is a pause.', intro: 'Small letters join on to the letter before them. Listen.', outro: ['A small', JPV('つ'), 'is different. It is a tiny pause, like a hiccup, as in', JPV('がっこう'), ', school.'] },
    anch: [['でんしゃ', 'train', 'train', 'し'], ['ぎゅうにゅう', 'milk', 'glass-of-milk', 'に'], ['きんぎょ', 'goldfish', 'tropical-fish', 'ぎ'], ['がっこう', 'school', 'school']],
    words: [['でんしゃ', 'train', 'train'], ['しゃしん', 'photo', 'camera-with-flash'], ['きんぎょ', 'goldfish', 'tropical-fish'], ['ぎゅうにゅう', 'milk', 'glass-of-milk'], ['おかあさん', 'mother', 'woman'], ['おとうさん', 'father', 'man'], ['がっこう', 'school', 'school']],
    talk: [{ scene: 'park', ask: 'Kenta asks how you are.', dog: 'げんき？', dogEn: 'How are you?', me: 'げんき です！', meEn: 'I am well!', no: ['おやすみ。', 'いただきます！'], clue: 'He wants to know how you feel. Tell him.' },
      { scene: 'sunset', ask: 'Time to go home. Kenta says…', dog: 'またね！', dogEn: 'See you!', me: 'さようなら！', meEn: 'Goodbye!', no: ['おはよう！', 'いただきます！'], clue: 'You are going home. Say goodbye.' }] },
  /* ---- three katakana stations (proposed 11 October, approved: "Commence with items 1 and 2"). She knows every sound already, so each letter is met beside its hiragana twin.
     The letters are chosen for the words she needs first: her name アリア, ニュージーランド, パン, then everyday words. Words written in katakana are words from other languages.
     Sources: the katakana are the standard Japanese syllabary (gojūon, katakana form); the words are everyday loanwords in a Japanese first-grade reader. Strokes: KanjiVG, as for hiragana ---- */
  { head: 'ア', kana: 'アイスリパペン', name: 'Katakana: first words', kata: true,
    rule: { text: 'Katakana: the same sounds, a sharper shape.', intro: 'Every hiragana has a twin in katakana. The same sound, a sharper shape. Katakana writes words from other countries, like your name. Listen to each pair.', outro: ['Now you can read words from other countries, like', JPV('アイス'), ', ice cream!'] },
    anch: [['アイス', 'ice cream', 'soft-ice-cream'], ['イルカ', 'dolphin', 'dolphin'], ['スプーン', 'spoon', 'spoon'], ['リボン', 'ribbon', 'ribbon'], ['パン', 'bread', 'bread'], ['ペンギン', 'penguin', 'penguin'], ['ライオン', 'lion', 'lion']],
    words: [['アイス', 'ice cream', 'ice-cream'], ['パン', 'bread', 'bread'], ['パパ', 'dad', 'man-feeding-baby'], ['ペン', 'pen', 'pen'], ['パリ', 'Paris', 'flag:fr']],
    talk: [{ scene: 'park', ask: 'Kenta asks your name. You say…', dog: 'おなまえは？', dogEn: 'What is your name?', me: 'わたしは {kname} です。', meEn: 'I am {en}.', no: ['わたしは けんた です。', 'パンを ください。'], clue: 'Kenta asked your name. Tell him yours.' },
      { scene: 'room', ask: 'Kenta asks what it is. You say…', dog: 'これは なんですか？', dogEn: 'What is this?', thing: 'bread', me: 'これは パン です。', meEn: 'This is bread.', no: ['これは アイス です。', 'これは ペン です。'], clue: 'Look at the picture. What is it?' }] },
  { head: 'ニ', kana: 'ニュージラド', name: 'Katakana: New Zealand', kata: true,
    rule: { text: 'ー makes a sound long. A small ュ joins on.', intro: 'Two new marks today. A long line makes the sound before it long. And a small letter joins on, just as in hiragana. Listen to each pair.', outro: ['Put them together, and you can read', JPV('ニュージーランド'), '. New Zealand!'] },
    anch: [['テニス', 'tennis', 'tennis'], ['ジュース', 'juice', 'beverage-box'], ['ケーキ', 'cake', 'shortcake'], ['ジーンズ', 'jeans', 'jeans'], ['ラーメン', 'ramen', 'steaming-bowl'], ['ドーナツ', 'doughnut', 'doughnut']],
    words: [['ジュース', 'juice', 'beverage-box'], ['ニュージーランド', 'New Zealand', 'flag:nz'], ['ドア', 'door', 'door'], ['ニュース', 'the news', 'newspaper'], ['スーパー', 'supermarket', 'shopping-cart']],
    talk: [{ scene: 'park', ask: 'Kenta asks where you are from.', dog: 'どこから きましたか？', dogEn: 'Where are you from?', me: 'ニュージーランドから きました。', meEn: 'I am from New Zealand.', no: ['ジュースを ください。', 'こんにちは！'], clue: 'He asked which country you come from.' }] },
  { head: 'キ', kana: 'キウケコメロ', name: 'Katakana: treats and animals', kata: true,
    rule: { text: 'Six more twins: キ ウ ケ コ メ ロ.', intro: 'Six more twins. Some of them look a lot like their hiragana. Listen to each pair.', outro: 'Now you can read cake, koala and kiwifruit!' },
    anch: [['キウイ', 'kiwifruit', 'kiwi-fruit'], ['ウイルス', 'virus', 'microbe'], ['ケーキ', 'cake', 'shortcake'], ['コアラ', 'koala', 'koala'], ['メロン', 'melon', 'melon'], ['ロボット', 'robot', 'robot']],
    words: [['ケーキ', 'cake', 'shortcake'], ['キウイ', 'kiwifruit', 'kiwi-fruit'], ['コアラ', 'koala', 'koala'], ['ココア', 'cocoa', 'hot-beverage'], ['メロン', 'melon', 'melon']],
    talk: [{ scene: 'shop', goods: ['shortcake', 'melon', 'hot-beverage'], ask: 'You want cake. You say…', dog: 'いらっしゃいませ！', dogEn: 'Welcome to my shop!', want: 'shortcake', me: 'ケーキを ください。', meEn: 'Cake, please.', no: ['メロンを ください。', 'ココアを ください。'], clue: 'Look at your thought bubble. What do you want?', after: 'はい、どうぞ。', afterEn: 'Here you are.' }] }
];
const JP_HIRA_N = 12;   /* stations 1 to 12 are hiragana; the rest katakana */
const JP_N = JP_ST.length, JP_PACE = 8;   /* seconds the fox takes for each step of the race. Change this one number to make the race quicker or slower */
/* the letters met by the end of station n */
const JP_MARKED = 'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
function jpKnown(n) { let s = ''; for (let i = 0; i < Math.min(n, JP_N); i++) { const st = JP_ST[i]; s += st.marks ? JP_MARKED : st.kana; } return s; }
const jpCan = (w, n) => { const k = jpKnown(n); return [...jpClean(w).replace(/\s/g, '')].every(c => k.includes(c)); };
/* every word she can read by the end of station n */
const jpWords = n => { const out = []; JP_ST.slice(0, n).forEach((st, i) => st.words.forEach(w => { if (!out.some(x => x[0] === w[0])) out.push(w.concat([i + 1])); })); return out; };
const jpState = () => { if (!S.jp || typeof S.jp !== 'object') S.jp = { st: 0, placed: false, met: {}, wins: 0, again: [] }; if (!S.jp.met) S.jp.met = {}; return S.jp; };
const jpToday = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

/* ---- drawing a letter. Its strokes come from KanjiVG, in the order they are written, in a 109 x 109 box ---- */
function jpGlyph(k, o) {
  o = o || {}; const ps = KANA_STROKES[k] || [];
  const g = h('div', { class: 'jp-glyph' + (o.cls ? ' ' + o.cls : ''), html: '<svg viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="jp-guide"><path d="M54.5 4v101M4 54.5h101"/></g>' +
    '<g class="jp-faint">' + ps.map(d => '<path d="' + d + '"/>').join('') + '</g>' +
    '<g class="jp-ink">' + ps.map((d, i) => '<path data-i="' + i + '" d="' + d + '"/>').join('') + '</g><g class="jp-mine"></g><g class="jp-dots"></g></svg>' });
  const ink = [...g.querySelectorAll('.jp-ink path')];
  ink.forEach(p => { const L = p.getTotalLength ? (p.getTotalLength() || 60) : 60; p.style.setProperty('--L', L.toFixed(1)); });
  g.inkAll = on => ink.forEach(p => p.classList.toggle('on', !!on));
  /* write it, stroke by stroke */
  g.write = async (ui) => { ink.forEach(p => { p.classList.remove('on', 'draw'); }); void g.offsetWidth;
    for (const p of ink) { if (ui && !ui.alive) return; p.classList.add('draw'); await wait(W.fast ? 5 : 620); p.classList.add('on'); p.classList.remove('draw'); await wait(W.fast ? 2 : 120); } };
  g.strokes = ink;
  return g;
}

/* ---- trace it with a finger. Each stroke in turn: a green dot shows where it starts. She drags along it. A stroke counts when her line runs close to most of it and starts at the right end.
   Two misses on a stroke and it is shown being written again; after five she is helped through, because a seven-year-old's finger on a phone is not a pen ---- */
function jpTrace(ui, k, holder) {
  return new Promise(res => {
    const g = jpGlyph(k, { cls: 'trace' }), svg = g.querySelector('svg'), mine = g.querySelector('.jp-mine'), dots = g.querySelector('.jp-dots'), ink = g.strokes;
    let si = 0, pts = [], line = null, misses = 0, over = false;
    holder.innerHTML = ''; holder.append(g);
    const startDot = () => { dots.innerHTML = ''; const p = ink[si]; if (!p) return; const a = p.getPointAtLength(0); dots.innerHTML = '<circle class="jp-start" cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="6"/><text x="' + a.x.toFixed(1) + '" y="' + (a.y + 3.2).toFixed(1) + '">' + (si + 1) + '</text>'; };
    const local = e => { const m = svg.getScreenCTM(); if (!m) return null; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(m.inverse()); return [q.x, q.y]; };
    const good = (p, path) => { if (path.length < 2) return false; const L = p.getTotalLength(), n = 14, tol = 13; let hit = 0;
      for (let i = 0; i <= n; i++) { const a = p.getPointAtLength(L * i / n); if (path.some(q => Math.hypot(q[0] - a.x, q[1] - a.y) < tol)) hit++; }
      const a0 = p.getPointAtLength(0), a1 = p.getPointAtLength(L), s = path[0], e = path[path.length - 1];
      return hit >= (n + 1) * .7 && Math.hypot(s[0] - a0.x, s[1] - a0.y) < Math.hypot(s[0] - a1.x, s[1] - a1.y) + 4 && Math.hypot(e[0] - a1.x, e[1] - a1.y) < 26; };
    const pass = () => { const p = ink[si]; p.classList.add('on'); sfx.place(); mine.innerHTML = ''; si++; misses = 0; hook();
      if (si >= ink.length) { over = true; dots.innerHTML = ''; W.cur = null; sfx.great(); g.classList.add('done'); if (JPS.ui === ui) { JPS.done = Math.min(JPS.total, JPS.done + 1); ui.steps(JPS.total, JPS.done); } setTimeout(res, W.fast ? 5 : 700); return; } startDot(); };
    const fail = async () => { misses++; sfx.soft(); mine.innerHTML = ''; g.classList.remove('wobble'); void g.offsetWidth; g.classList.add('wobble');
      if (misses >= 5) return pass();
      if (misses === 2 || misses === 4) { ui.prompt('Watch this stroke once more.', 'Watch how this stroke goes. Start at the green dot.'); const p = ink[si]; p.classList.add('draw'); await wait(W.fast ? 5 : 900); p.classList.remove('draw'); }
      else ui.prompt('Start at the green dot. Follow the grey.', 'Start at the green dot, and follow the grey line with your finger.'); };
    svg.addEventListener('pointerdown', e => { if (over) return; e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch (x) {} const q = local(e); if (!q) return; pts = [q];
      line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); mine.innerHTML = ''; mine.append(line); line.setAttribute('points', q.join(',')); });
    svg.addEventListener('pointermove', e => { if (!line) return; const q = local(e); if (!q) return; pts.push(q); line.setAttribute('points', pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')); });
    const up = () => { if (!line) return; line = null; if (good(ink[si], pts)) pass(); else fail(); };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    const hook = () => { W.cur = over ? null : { type: 'act', trace: k, auto: () => { while (!over) pass(); }, miss: () => { fail(); } }; };
    startDot(); hook();
  });
}

/* ---- the letters she has, on a chart laid out the way Japanese children see it: the vowels across the top, a row for each sound ---- */
const JP_CHART = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や ゆ よ', 'らりるれろ', 'わ   を', 'ん    '];
function jpChart(known, o) {
  o = o || {}; const grid = h('div', { class: 'jp-chart' + (innerWidth > innerHeight ? ' across' : '') + (o.cls ? ' ' + o.cls : '') });   /* on a wide screen, the way a Japanese child's chart hangs: each row is a column, read top to bottom, starting on the right */
  (o.kata ? JP_CHART.map(jpKata) : JP_CHART).forEach(row => [...row.padEnd(5)].forEach(c => {   /* o.kata: the katakana chart, the same rows */
    if (c === ' ') return grid.append(h('i', { class: 'jp-cc blank' }));
    const have = known.includes(c), b = h('button', { class: 'jp-cc' + (have ? ' have' : '') + (o.now && o.now.includes(c) ? ' now' : ''), 'data-k': c, 'aria-label': have ? c : 'Not yet' }, have ? jpEl(c) : '');
    if (have && o.tap) b.addEventListener('click', () => o.tap(c, b));
    grid.append(b); }));
  return grid;
}

/* ---- scenes for the conversations: Kenta the Shiba and her own explorer. Each scene is a layered picture 400 x 240 with things that move ---- */
const JP_SKY = { park: ['#8FD3F4', '#E6F6FF'], morning: ['#FFB27A', '#FFE9C7'], night: ['#1B2A4E', '#3B4F86'], gift: ['#8FD3F4', '#E6F6FF'], count: ['#8FD3F4', '#E6F6FF'], room: ['#F6EBD2', '#EFDFBC'], shop: ['#BDE7F7', '#F2FAFF'], zoo: ['#9FDCF2', '#ECF8FF'], table: ['#F6EBD2', '#EFDFBC'], sunset: ['#FF9A6B', '#FFD7A8'] };
function jpSceneSvg(kind, o) {
  o = o || {}; const sky = JP_SKY[kind] || JP_SKY.park, indoor = kind === 'room' || kind === 'table';
  let s = '<svg class="jp-bg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="jpsk-' + kind + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' +
    '<rect width="400" height="240" fill="url(#jpsk-' + kind + ')"/>';
  if (indoor) {
    /* a tatami room: shoji screen behind, mats on the floor */
    s += '<g class="jp-shoji"><rect x="20" y="20" width="360" height="130" rx="4" fill="#FFFDF6" stroke="#B48A5A" stroke-width="5"/>' + [80, 140, 200, 260, 320].map(x => '<path d="M' + x + ' 22v126" stroke="#C9A779" stroke-width="2.500"/>').join('') + [55, 90, 120].map(y => '<path d="M22 ' + y + 'h356" stroke="#C9A779" stroke-width="2.500"/>').join('') + '</g>' +
      '<rect y="150" width="400" height="90" fill="#C9D48E"/>' + [0, 1, 2, 3].map(i => '<rect x="' + (i * 100 + 2) + '" y="152" width="96" height="86" rx="2" fill="none" stroke="#9BAC5E" stroke-width="2"/>').join('');
    if (kind === 'table') s += '<g class="jp-table"><rect x="120" y="150" width="160" height="16" rx="5" fill="#8E5A34"/><path d="M134 166v30M266 166v30" stroke="#6E4428" stroke-width="9" stroke-linecap="round"/></g>';
    else s += '<g class="jp-table"><rect x="150" y="160" width="100" height="12" rx="4" fill="#8E5A34"/><path d="M162 172v22M238 172v22" stroke="#6E4428" stroke-width="8" stroke-linecap="round"/></g>';
  } else {
    if (kind === 'night') s += '<g class="jp-stars">' + [[40, 30], [90, 60], [150, 24], [220, 46], [300, 20], [350, 64], [260, 80], [120, 90]].map(([x, y], i) => '<circle cx="' + x + '" cy="' + y + '" r="2.400" fill="#FFF6C9" style="--d:' + (i * .37).toFixed(2) + 's"/>').join('') + '</g><g class="jp-moon"><circle cx="320" cy="58" r="26" fill="#FFF3C4"/><circle cx="332" cy="50" r="24" fill="#2B3D6E"/></g>';
    else if (kind === 'morning') s += '<g class="jp-sun"><circle cx="300" cy="150" r="34" fill="#FFD95E"/><circle cx="300" cy="150" r="48" fill="#FFD95E" opacity=".25"/></g>';
    else if (kind === 'sunset') s += '<g class="jp-sunset"><circle cx="200" cy="140" r="40" fill="#FF7A4D"/></g>';
    else s += '<g class="jp-cloud"><ellipse cx="80" cy="40" rx="34" ry="11" fill="#fff"/><ellipse cx="104" cy="32" rx="22" ry="10" fill="#fff"/><ellipse cx="300" cy="56" rx="30" ry="9" fill="#fff" opacity=".85"/></g><circle cx="352" cy="36" r="16" fill="#FFD95E"/>';
    /* Fuji far away, a hill, a cherry tree */
    s += '<path d="M120 150 186 84q14-12 28 0l66 66z" fill="' + (kind === 'night' ? '#4B5E96' : '#8FA9DB') + '"/><path d="M178 92q22-20 44 0l-10 12-12-8-12 8z" fill="#fff" opacity="' + (kind === 'night' ? '.6' : '1') + '"/>' +
      '<path d="M0 160Q110 128 220 150T400 146V240H0z" fill="' + (kind === 'night' ? '#2F5D4A' : kind === 'sunset' ? '#6FA65A' : '#8FD67A') + '"/>' +
      '<g class="jp-tree"><path d="M44 196V150" stroke="#7A5238" stroke-width="9" stroke-linecap="round"/><g fill="#F9A8C4"><circle cx="30" cy="140" r="20"/><circle cx="56" cy="132" r="22"/><circle cx="46" cy="114" r="18"/><circle cx="68" cy="150" r="15"/></g></g>' +
      '<g class="jp-petals">' + [[120, 40], [180, 20], [250, 60], [330, 30], [90, 80]].map(([x, y], i) => '<ellipse cx="' + x + '" cy="' + y + '" rx="3.500" ry="2.200" fill="#F9A8C4" style="--d:' + (i * .9).toFixed(1) + 's"/>').join('') + '</g>';
    if (kind === 'night') s += '<g><rect x="300" y="150" width="56" height="40" fill="#C98A5A"/><path d="M292 152l36-24 36 24z" fill="#8E2A22"/><rect class="jp-win" x="318" y="160" width="18" height="16" fill="#FFE07A"/></g>';
    if (kind === 'shop') s += '<g class="jp-stall"><rect x="236" y="96" width="150" height="96" fill="#F2E3C6"/><path d="M228 92h166v18H228z" fill="#D8402F"/>' + [0, 1, 2, 3, 4].map(i => '<rect x="' + (240 + i * 30) + '" y="110" width="26" height="26" rx="2" fill="#1F4E8C"/>').join('') + '<rect x="236" y="160" width="150" height="14" fill="#8E5A34"/></g>';
    /* the zoo (Kenta's Town): a wooden fence along the hill, a giraffe and a zebra beyond it, and the gate on the right. The animals she talks about stand in front */
    if (kind === 'zoo') s += '<image href="' + icUri('giraffe') + '" x="128" y="78" width="70" height="70"/><image href="' + icUri('zebra') + '" x="262" y="112" width="44" height="44"/>' +
      '<g class="tw-fence"><path d="M0 164H400M0 178H400" stroke="#B07A4E" stroke-width="5"/>' + Array.from({ length: 21 }, (_, i) => '<rect x="' + (i * 20 - 2) + '" y="152" width="6" height="34" rx="2" fill="#8E5A34"/>').join('') + '</g>' +
      '<g class="tw-gate"><rect x="350" y="96" width="12" height="92" fill="#C0533A"/><rect x="392" y="96" width="12" height="92" fill="#C0533A"/><path d="M344 98q30-28 66 0" stroke="#E8A33C" stroke-width="12" fill="none" stroke-linecap="round"/></g>';
    if (kind === 'count') s += '<ellipse cx="200" cy="200" rx="130" ry="26" fill="#E5484D" opacity=".85"/><path d="M80 196q120 20 240 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>';
  }
  return s + '</svg>';
}
/* a line in a speech bubble: a closing ！？。、 is kept with the letter before it, so a line too long for its bubble breaks earlier (こんにち / は！), never leaving ！ alone on a line */
function jpBubText(t) { const e = jpEl(t); e.textContent = ''; String(t).split(/(.[！？。、]+)/).filter(Boolean).forEach(x => e.append(/[！？。、]$/.test(x) && x.length > 1 ? h('i', { class: 'jp-nb' }, x) : document.createTextNode(x))); return e; }
/* the scene, with her explorer on the left and Kenta on the right. Returns the parts so a conversation can make them speak */
function jpScene(kind, o) {
  o = o || {}; const me = h('div', { class: 'jp-me' + (o.left ? ' jp-fr' : '') }, o.left || meEl(S.me || newMe(PRESETS[0]))), dog = h('div', { class: 'jp-dog', html: GUIDES.japan });   /* o.left: a friend in her place (Kenta's Town) */
  const props = h('div', { class: 'jp-props' }), myBub = h('div', { class: 'jp-bub me' }), dogBub = h('div', { class: 'jp-bub dog' });
  const box = h('div', { class: 'jp-scene s-' + kind, html: jpSceneSvg(kind, o) }, props, me, dog, myBub, dogBub);
  /* both: the English is said too, after the Japanese. A tap on a bubble says it again */
  const line = (who, t, en, both) => Speech.say([JPV(t)].concat(both && en ? [en] : []), Object.assign(who === 'me' ? { pitch: o.left ? 1.4 : 1.25, rate: .85 } : { rate: .85 }, o.rate ? { rate: o.rate } : {}));
  [[myBub, 'me'], [dogBub, 'dog']].forEach(([b, who]) => b.addEventListener('click', () => { if (b._t) { sfx.tap(); line(who, b._t, b._en, true); } }));
  const say = async (who, t, en, ui, both) => { const b = who === 'me' ? myBub : dogBub, c = who === 'me' ? me : dog; b.innerHTML = ''; b.append(jpBubText(t), en ? h('small', null, en) : ''); b._t = t; b._en = en;
    b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); c.classList.remove('talk'); void c.offsetWidth; c.classList.add('talk');
    await Promise.race([line(who, t, en, both), wait(both ? 6500 : 4500)]); if (ui) ui.check(); };
  return { box, me, dog, props, myBub, dogBub, say };
}

/* ---- asking: one question with a picture or word on top and choices below. A wrong pick greys out and the clue is given; she keeps going until she has it.
   o: top (an element), opts [{ el, ok }], text, say, clue (miss number => { text, say }), onFirstMiss (async: break the question down), cls. Returns true if right first time ---- */
function jpAsk(ui, o) {
  return new Promise(res => {
    ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; let miss = 0, busy = false;
    const wrap = h('div', { class: 'jp-q' + (o.cls ? ' ' + o.cls : '') }, o.top), row = h('div', { class: 'jp-opts n' + o.opts.length });
    const btns = o.opts.map((p, i) => { const b = h('button', { class: 'jp-opt', 'data-i': i, onclick: () => pick(i) }, p.el); row.append(b); return b; });
    ui.stage.append(wrap); ui.answer.append(row);
    const ans = o.opts.findIndex(p => p.ok);
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: o.opts.length, help: miss > 0, item: o.word ? o.word[0] : null, mode: JPS.mode, give: i => { if (btns[i] && btns[i].disabled) i = ans; pick(i); } }; };
    const pick = async i => { if (busy) return; busy = true; W.cur = null;
      if (i === ans) { sfx.pop(); btns[i].classList.add('ok'); jpTick(miss === 0, o.word); await ui.wait(W.fast ? 5 : 450); return res(miss === 0); }
      miss++; sfx.soft(); btns[i].classList.add('gone'); btns[i].disabled = true; const wob = wrap.firstElementChild || wrap; wob.classList.remove('wobble'); void wob.offsetWidth; wob.classList.add('wobble');   /* the card wobbles, not the whole frame, so nothing moves past the edge */
      if (miss === 1 && o.onFirstMiss) { await o.onFirstMiss(wrap); ui.check(); }
      const c = o.clue ? o.clue(miss) : { text: 'Not that one. Look again.' }; await Promise.race([ui.prompt(c.text, c.say), wait(3200)]); ui.check();
      busy = false; hook(); };
    ui.prompt(o.text, o.say); hook();
  });
}
/* a word's picture: an icon, or her own explorer ('me', for アリア), Kenta ('kenta'), a flag ('flag:nz'), a birthday cake with an age on it ('age:7'), a price tag ('yen:50') or a yen coin ('coin:50') */
function jpArt(a) {
  a = String(a);
  if (a === 'me') return h('span', { class: 'ic jp-mepic' }, meEl(S.me || newMe(PRESETS[0])));
  if (a === 'kenta') return h('span', { class: 'ic jp-kpic', html: GUIDES.japan });
  if (a.startsWith('flag:')) return h('img', { class: 'ic jp-flag', src: flag(a.slice(5)), alt: '', draggable: 'false' });
  /* a price tag in yen ('yen:50', Kenta's Town shop): the number in figures, えん under it, so the figure and the Japanese word meet */
  if (a.startsWith('yen:')) { const n = a.slice(4); return h('span', { class: 'ic jp-yen', html: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M8 50 30 16h56a7 7 0 0 1 7 7v54a7 7 0 0 1-7 7H30z" fill="#FFE07A" stroke="#C99A1E" stroke-width="4" stroke-linejoin="round"/><circle cx="27" cy="50" r="5" fill="#fff" stroke="#C99A1E" stroke-width="3"/>' +
    '<text x="62" y="55" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (n.length > 2 ? 26 : 32) + '" fill="#1B2A4E">' + n + '</text><text x="62" y="77" text-anchor="middle" font-family="Klee Kana, sans-serif" font-weight="600" font-size="17" fill="#1B2A4E">えん</text></svg>' }); }
  /* a Japanese coin ('coin:50'): 10 yen copper, 50 yen silver with a hole, 100 yen silver, each with its number */
  if (a.startsWith('coin:')) { const n = a.slice(5), cu = n === '10', hole = n === '50' || n === '5', f = cu ? '#D08E52' : n === '5' ? '#E5C45C' : '#DCE1E8', e = cu ? '#8E5A2B' : n === '5' ? '#A9852A' : '#8A93A3';
    return h('span', { class: 'ic jp-yen', html: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="44" fill="' + f + '" stroke="' + e + '" stroke-width="4"/><circle cx="50" cy="50" r="36" fill="none" stroke="' + e + '" stroke-width="2" opacity=".55"/>' +
      (hole ? '<circle cx="50" cy="44" r="9" fill="#fff" stroke="' + e + '" stroke-width="3"/><text x="50" y="78" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#1B2A4E">' + n + '</text>'
        : '<text x="50" y="61" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (n.length > 2 ? 28 : 34) + '" fill="#1B2A4E">' + n + '</text>') + '</svg>' }); }
  if (a.startsWith('age:')) return h('span', { class: 'ic jp-age' }, h('img', { class: 'jp-agecake', src: icUri('birthday-cake'), alt: '', draggable: 'false' }), h('b', null, a.slice(4)));
  return art(a);
}
const jpPicOpt = w => ({ el: h('span', { class: 'jp-pic' }, jpArt(w[2])), w });
const jpWordOpt = w => ({ el: jpEl(w[0], 'jp-w'), w });
/* three or four other words to choose from, as unlike the answer's picture as possible, and never the same picture */
function jpOthers(w, pool, n) { const out = shuffle(pool.filter(x => x[0] !== w[0] && x[2] !== w[2])); const same = out.filter(x => [...x[0]].length === [...w[0]].length); return shuffle(same.concat(out.filter(x => !same.includes(x)))).slice(0, n); }
/* a word broken into its letters: she taps each to hear its sound, then reads it again */
function jpLetters(w, ui) {
  return new Promise(res => {
    const ms = jpMora(w[0]), row = h('div', { class: 'jp-split' + (ms.length > 5 ? ' many' : '') }); let heard = 0;   /* many: ニュージーランド has seven sounds */
    ms.forEach((m, i) => { const b = h('button', { class: 'jp-let' }, jpEl(m.k)); row.append(b);
      b.addEventListener('click', () => { sfx.tap(); if (m.long) jpSay((ms[i - 1] ? ms[i - 1].k : '') + 'ー'); else if (!m.gem) jpSay(m.k); else Speech.say('A little pause.'); if (!b.classList.contains('heard')) { b.classList.add('heard'); heard++; if (heard === ms.length) setTimeout(() => { row.classList.add('done'); res(row); }, W.fast ? 5 : 600); } }); });
    ui.prompt('Tap each letter to hear it.', 'Let us read it one letter at a time. Tap each letter to hear its sound.');
    W.cur = { type: 'act', auto: () => [...row.children].forEach(b => b.click()) };
    const t = $('.jp-qw', ui.stage); if (t) t.replaceWith(row); else ui.stage.prepend(row);
  });
}

/* ---- keeping it fun, on the same principles as the best language apps (Tony, 9 October: "Dualingo has some great ideas. I am not saying build it to their model, but follow similar principles"):
   short stops with a progress bar along the top; an instant cheer for each right answer and a bigger one for 3, 5 and 8 in a row; a summary at the end of each stop;
   a daily streak of lanterns; and the words she finds hard come back first. There are no lives to lose: a wrong answer only means a clue ---- */
const JPS = { total: 0, done: 0, first: 0, asked: 0, combo: 0, best: 0, ui: null, mode: '', fixed: 0, rev: 0, revOk: 0, left: 0 };
/* mode '' is the stop's own questions (they fill the bar and count for "right first time"); 'retry' is practising the tricky ones; 'review' is a look-back */
function jpScore(ui, total) { Object.assign(JPS, { total, done: 0, first: 0, asked: 0, combo: 0, best: 0, ui, mode: '', fixed: 0, rev: 0, revOk: 0, left: 0 }); ui.steps(total, 0); }
function jpTick(ok, w) {
  const ui = JPS.ui; if (!ui || !ui.alive) return;
  if (!JPS.mode) { JPS.done = Math.min(JPS.total, JPS.done + 1); JPS.asked++; if (ok) JPS.first++; ui.steps(JPS.total, JPS.done); }
  else if (JPS.mode === 'retry') { if (ok) JPS.fixed++; } else { JPS.rev++; if (ok) JPS.revOk++; }
  const st = jpState(); if (!st.weak) st.weak = {};
  if (w) { if (!ok) st.weak[w[0]] = (st.weak[w[0]] || 0) + 1; else if (st.weak[w[0]]) { st.weak[w[0]]--; if (!st.weak[w[0]]) delete st.weak[w[0]]; } }
  if (!ok) { JPS.combo = 0; return; }
  JPS.combo++; JPS.best = Math.max(JPS.best, JPS.combo); kiwiMood(ui.root, 'cheer');
  if ([3, 5, 8, 12].includes(JPS.combo)) { sfx.great(); const c = h('div', { class: 'jp-combo' }, ic('sparkles'), JPS.combo + ' in a row!'); ui.root.append(c); Speech.say([{ t: pick(['すごい！', 'やった！', 'じょうず！']), lang: 'ja', fallback: 'sugoi' }, JPS.combo + ' in a row!']); setTimeout(() => c.remove(), W.fast ? 10 : 1900); }
}
/* the daily streak: a lantern for each day in a row she has done a stop */
function jpStreak() { const st = jpState(), today = jpToday(); if (st.sday === today) return false;
  const y = new Date(); y.setDate(y.getDate() - 1); const yday = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
  st.streak = st.sday === yday ? (st.streak || 0) + 1 : 1; st.sday = today; saveState(); return true; }

/* ---- shared pieces: a picture with its English word under it (Tony, 9 October: "the images need to be a bit more clear of what they are. Perhaps an english word under the images?"),
   a word said in Japanese then English, and the "say it" panel ---- */
const jpPic = (w, cls) => h('span', { class: 'jp-pic' + (cls ? ' ' + cls : '') }, jpArt(w[2]), h('small', { class: 'jp-en' }, w[1]));
/* every time a word is finished, it is said in Japanese and then in English, with the word, its picture and its meaning shown together (Tony, 9 October) */
const jpBoth = w => Speech.say([JPV(w[0]), w[1] + '.']);
async function jpShowWord(ui, w, into) {
  const card = h('div', { class: 'jp-done-card' }, jpPic(w, 'big'), jpEl(w[0], 'jp-qw'), h('b', { class: 'jp-done-en' }, w[1]));
  const host = into || ui.stage; host.append(card);
  await Promise.race([jpBoth(w), wait(3200)]); ui.check(); await ui.wait(W.fast ? 5 : 500); card.remove();
}
/* SAY IT: hear it, hear it slowly, record yourself and play yourself back, to compare (Tony: "Is there a way to be able to repeat the word or saying ... to ensure it is pronounced correctly").
   The microphone is used only where the browser allows it; without it the panel still has Listen and Slowly. Nothing is saved or sent anywhere: the recording lives only until the panel goes */
/* SLOWLY (Tony, 11 October: "when I click slowly, none of the words are said slowly"). Some Android voices ignore a slower rate, so slowly does not rely on it:
   a word is said sound by sound (そ… ら…), a sentence word by word, each as its own utterance so there is a gap between, then the whole thing at a slow rate.
   A word ending in the joining word は says わ there (こんにちは), as it does in the whole word */
function jpSlowParts(t) {
  const words = jpClean(t).trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.map(w => JPV(w));
  const w = words[0] || '', ms = [];
  jpMora(w).forEach(m => { if (m.gem) return; if (m.long && ms.length) { ms[ms.length - 1] = { k: ms[ms.length - 1].k + 'ー' }; return; } ms.push(m); });   /* ジュー is said as one long sound */
  if (ms.length < 2) return [];
  return ms.map((m, i) => JPV(i === ms.length - 1 && m.k === 'は' && w.length > 1 && w !== 'はは' ? 'わ' : m.k));
}
const jpSlow = (t, o) => Speech.say(jpSlowParts(t).concat([JPV(t)]), Object.assign({ rate: .55 }, o && o.pitch ? { pitch: o.pitch } : {}));
const JP_MIC = { ok: !!(typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder), stream: null };
function jpEcho(t, o) {
  o = o || {}; let rec = null, url = null, chunks = [], stopT = null;
  const b = (k, icon, label, fn) => h('button', { class: 'jp-eb', 'data-k': k, onclick: () => { sfx.tap(); fn(); } }, ic(icon), h('span', null, label));
  const listen = b('listen', 'speaker-high-volume', 'Listen', () => Speech.say([JPV(t)], o.pitch ? { pitch: o.pitch } : {}));
  const slow = b('slow', 'turtle', 'Slowly', () => jpSlow(t, o));
  const me = b('rec', 'studio-microphone', 'Record me', () => toggle()), back = b('play', 'ear', 'Play me', () => { if (url) Speech.playClip(url); });
  back.disabled = true;
  const stop = () => { if (rec && rec.state === 'recording') rec.stop(); clearTimeout(stopT); };
  const toggle = async () => {
    if (rec && rec.state === 'recording') return stop();
    try { if (!JP_MIC.stream) JP_MIC.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { JP_MIC.ok = false; me.remove(); back.remove(); note.textContent = 'This browser will not share the microphone. Say it out loud instead!'; return; }
    Speech.stop(); chunks = []; rec = new MediaRecorder(JP_MIC.stream); rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => { me.classList.remove('on'); $('span', me).textContent = 'Record me'; if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); back.disabled = false; back.classList.add('ready'); Speech.playClip(url); };
    rec.start(); me.classList.add('on'); $('span', me).textContent = 'Stop'; stopT = setTimeout(stop, 4000);
  };
  const note = h('div', { class: 'jp-enote' });
  return h('div', { class: 'jp-echo' }, listen, slow, JP_MIC.ok ? me : null, JP_MIC.ok ? back : null, note);
}
/* "now you say it": the line on a card, the say-it panel, and a button she presses once she has said it */
async function jpSayIt(ui, t, en, o) {
  ui.answer.innerHTML = '';
  const panel = h('div', { class: 'jp-sayit' }, h('div', { class: 'jp-sayline' }, jpEl(t), en ? h('small', null, en) : null), jpEcho(t, o));
  (o && o.into ? o.into : ui.answer).append(panel);
  await Promise.race([ui.prompt('Now you say it! Listen, then copy.', ['Now you say it. Listen first, then copy.', JPV(t)]), wait(4000)]); ui.check();
  await ui.next('I said it!', panel); ui.check(); panel.remove();
}

/* ---- the rule of a row, as a chant: each new letter lights on the chart as the Japanese voice says it (Tony: the letters were said by the English voice) ---- */
async function jpRuleShow(ui, n) {
  const st = JP_ST[n - 1]; ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  const pairs = st.marks ? [['か', 'が'], ['さ', 'ざ'], ['た', 'だ'], ['は', 'ば'], ['は', 'ぱ']] : st.small ? [['き', 'ゃ', 'きゃ'], ['ぎ', 'ゅ', 'ぎゅ'], ['ぎ', 'ょ', 'ぎょ']]
    : st.kata ? [...st.kana].filter(k => k !== 'ー').map(k => [jpHira(k), k]) : null;   /* katakana: each letter beside its hiragana twin */
  const chart = pairs ? null : jpChart(jpKnown(n - 1) + st.kana, { now: '', cls: 'mini' });
  /* each pair is a button: tap it to hear the change again (Tony, 11 October: "i would like to click on all of these to hear the changes") */
  const pairSay = p => p[2] ? [JPV(p[0]), 'and a small', JPV(p[1] === 'ゃ' ? 'や' : p[1] === 'ゅ' ? 'ゆ' : 'よ'), 'make', JPV(p[2])] : [JPV(p[0]), JPV(p[1])];
  const rows = pairs ? pairs.map(p => { const b = h('button', { class: 'jp-pair', 'data-k': p[2] || p[1] }, jpEl(p[0]), h('i', null, p[2] ? '+' : '→'), jpEl(p[1], p[2] ? 'small' : ''), p[2] ? h('i', null, '=') : null, p[2] ? jpEl(p[2]) : null);
    b.addEventListener('click', () => { sfx.tap(); rows.forEach(r => r.classList.remove('lit')); b.classList.add('lit'); Speech.say(pairSay(p)); }); return b; }) : null;
  ui.stage.append(h('div', { class: 'jp-rule' }, pairs ? h('div', { class: 'jp-rbig' }, rows) : h('div', { class: 'jp-cwrap' }, chart)));
  W.cur = null;
  await Promise.race([ui.prompt(st.rule.text, st.rule.intro), wait(8000)]); ui.check();
  if (pairs) { for (let i = 0; i < pairs.length; i++) { rows[i].classList.add('lit'); await Promise.race([Speech.say(pairSay(pairs[i])), wait(4500)]); ui.check(); await ui.wait(W.fast ? 2 : 250); }
    await Promise.race([ui.prompt('Tap any pair to hear it again.', 'Tap any pair to hear it again.'), wait(2500)]); ui.check(); }
  else for (const k of st.kana) { const c = $('.jp-cc[data-k="' + k + '"]', chart); if (c) c.classList.add('say'); await Promise.race([jpSay(k), wait(2200)]); ui.check(); await ui.wait(W.fast ? 2 : 350); }
  if (st.rule.outro) { await Promise.race([Speech.say(st.rule.outro), wait(9000)]); ui.check(); }
  await ui.next("Let's learn them!", ui.stage.firstChild); ui.check();
}

/* ---- STOP 1, letters: each new letter writes itself, the Japanese voice says it, with its picture word; then she traces it. Then she hears letters and taps them ---- */
async function jpMeet(ui, n) {
  const st = JP_ST[n - 1];
  await jpRuleShow(ui, n);
  const letters = st.marks ? ['が', 'ざ', 'だ', 'ば', 'ぱ'] : st.small ? ['ゃ', 'ゅ', 'ょ', 'っ'] : [...st.kana];
  for (let i = 0; i < letters.length; i++) {
    const k = letters[i], a = st.anch[i] || st.anch[0], g = jpGlyph(k), pad = h('div', { class: 'jp-pad' });
    const hear = st.small ? a[0] : k;
    const twin = st.kata && k !== 'ー' ? h('div', { class: 'jp-twin' }, h('small', null, 'twin'), jpEl(jpHira(k))) : null;
    const card = h('div', { class: 'jp-meet' }, h('div', { class: 'jp-left' }, g, twin, h('button', { class: 'btn quiet jp-again', onclick: () => { sfx.tap(); g.write(ui); jpSay(k === 'ー' ? a[0] : hear); } }, ic('speaker-high-volume'), 'Again')),
      h('div', { class: 'jp-right' }, h('div', { class: 'jp-anch' }, jpPic([a[0], a[1], a[2]]), jpEl(a[0], 'jp-aw')), pad));
    ui.wide(true); ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; ui.stage.append(card);
    const big = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ' }[k];
    const says = st.marks ? [JPV(a[3]), 'and', JPV(k), '.', (k === 'ぱ' ? 'A little circle makes a p sound,' : 'Two little dots make the sound buzz,') + ' as in', JPV(a[0]), a[1] + '.']
      : st.small ? (k === 'っ' ? ['A small one of these is a tiny pause, as in', JPV(a[0]), a[1] + '.'] : ['A small', JPV(big), '. It joins on to the letter before it, as in', JPV(a[0]), a[1] + '.'])
      : k === 'ー' ? ['This long line makes the sound before it long, as in', JPV(a[0]), a[1] + '.']
      : k === 'ュ' ? ['A small one of these joins on to the letter before it, just like in hiragana, as in', JPV(a[0]), a[1] + '.']
      : st.kata ? [JPV(k), '. The twin of the hiragana you know. As in', JPV(a[0]), a[1] + '.']
      : [JPV(k), '.', 'As in', JPV(a[0]), a[1] + '.'];
    const p = ui.prompt(st.small || st.marks ? 'Watch it write. Listen.' : k === 'ー' ? 'A long line. Watch it write.' : 'This is ' + k + '. Watch it write.', says);
    await g.write(ui); ui.check(); await Promise.race([p, wait(7000)]); ui.check();
    if (k === 'は') { await Promise.race([ui.prompt('は is ha. As a joining word, it says wa.', ['One more thing about this letter. Usually it says', JPV('は'), '. But in', JPV('わたしは'), ', I am, it is a little joining word, and it says', JPV('わ'), '.']), wait(9000)]); ui.check(); }
    if (k === 'を') { await Promise.race([ui.prompt('を is a joining word. It goes after the thing you want.', ['This one sounds just like', JPV('お'), '. It is only ever a joining word, after the thing you want:', JPV('りんごを ください'), ', an apple, please.']), wait(9000)]); ui.check(); }
    await Promise.race([ui.prompt('Now you write it! Start at the green dot.', 'Now you write it with your finger. Start at the green dot, and follow the grey line.'), wait(400)]);
    await jpTrace(ui, k, pad); ui.check();
    await ui.good(pick(['すごい！', 'じょうず！', 'できた！']), null);
    await jpFamily(ui, st, k); ui.check();
  }
  await jpListen(ui, n);
}
/* the letters the listening check asks at a station: a long line or a small letter has no sound of its own */
const JP_MARKS_ONLY = 'ゃゅょっャュョッー';
const jpListenPool = st => st.marks ? JP_MARKPOOL : st.small ? JP_SMALLPOOL : [...st.kana].filter(k => !JP_MARKS_ONLY.includes(k));
/* letters that sound the same are never offered side by side: を says o, ぢ says ji, づ says zu */
const JP_SAME = [['お', 'を'], ['じ', 'ぢ'], ['ず', 'づ']];
const jpAlike = (a, b) => { a = jpHira(a); b = jpHira(b); return a === b || JP_SAME.some(p => p.includes(a) && p.includes(b)); };   /* a katakana and its hiragana twin say the same sound too */
/* a letter's picture word, from whichever station taught it */
function jpAnchor(k) {
  for (const st of JP_ST) {
    if (st.marks || st.small) { const a = st.anch.find(x => x[0].includes(k)); if (a) return a; continue; }
    const i = [...st.kana].indexOf(k); if (i >= 0) return st.anch[i] || null;
  }
  return null;
}
/* hear a letter, tap it from four. pool: the letters this check is about; old: other letters she knows, one of which joins the choices */
function jpHearLetter(ui, k, pool, old, help) {
  ui.wide(false); ui.help(false);
  const fit = x => !jpAlike(x, k);
  let others = shuffle(pool.filter(fit)).slice(0, 2); others = others.concat(shuffle(old.filter(x => fit(x) && !pool.includes(x) && !others.some(o => jpAlike(o, x)))).slice(0, 1));
  for (const x of shuffle(pool.concat(old))) { if (others.length >= 3) break; if (fit(x) && !others.includes(x) && !others.some(o => jpAlike(o, x))) others.push(x); }
  const list = shuffle([k].concat(others));
  const play = h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); jpSay(k); } }, ic('speaker-high-volume'));
  const a = jpAnchor(k);
  return jpAsk(ui, { word: ['L:' + k], top: h('div', { class: 'jp-hear' }, play), opts: list.map(x => ({ el: jpEl(x, 'jp-k'), ok: x === k })),
    text: 'Listen. Tap the letter you hear.', say: ['Listen, and tap the letter you hear.', JPV(k)],
    clue: () => { const first = a && a[0].startsWith(k); return { text: 'Listen again. ' + (a && help ? (first ? 'It starts ' : 'It is in ') + a[0] + '.' : ''), say: ['Listen again.', JPV(k), help && a ? (first ? 'It is the first sound of' : 'You hear it in') : '', help && a ? JPV(a[0]) : ''].filter(Boolean) }; } });
}
/* PRACTISE UNTIL RIGHT (Tony, 10 October: "4/8 passed first time isnt a very good pass rate. those other 4 need to be worked through to ensure she passes 1st time").
   Every item she missed is taught again on its card, then asked fresh, until each one is right first time. At most three rounds, so she is never stuck;
   anything still tricky is marked, and leads the next look-back. o.taught: the cards were just shown, so the first round goes straight to asking */
async function jpMaster(ui, missed, teach, ask, key, o) {
  o = o || {}; let left = missed.slice(); if (!left.length) return [];
  for (let round = 0; left.length && round < 3 && ui.alive; round++) {
    const one = left.length === 1;
    await Promise.race([ui.prompt(round ? 'Once more. You nearly have ' + (one ? 'it!' : 'them!') : 'Practise the tricky ' + (one ? 'one' : 'ones') + ' until easy!',
      round ? 'Once more. You nearly have ' + (one ? 'it.' : 'them.') : "Let's practise the tricky " + (one ? 'one' : 'ones') + " until " + (one ? 'it is' : 'they are') + ' easy.'), wait(3200)]); ui.check();
    if (round || !o.taught) { await teach(left); ui.check(); }
    const prev = JPS.mode; JPS.mode = prev === 'review' ? 'review' : 'retry'; const still = [];
    for (const x of shuffle(left.slice())) { const ok = await ask(x); ui.check(); if (!ok) still.push(x); }
    JPS.mode = prev; left = still;
  }
  if (left.length) { JPS.left += left.length; const st = jpState(); st.weak = st.weak || {}; left.forEach(x => { const k = key(x); st.weak[k] = (st.weak[k] || 0) + 1; }); saveState(); }
  else await ui.good(missed.length === 1 ? 'Got it first time now!' : 'All right first time now!', 'sparkles');
  return left;
}
/* THE WHOLE FAMILY of a letter with marks or a small letter: every letter she will be asked to hear, met first (Tony, 11 October: "the module following this tested me on
   characters with the extra lines and dot, but i had never seen them before"). Two dots: the whole row, か→が, き→ぎ … こ→ご. A small や: きゃ, しゃ, ちゃ, にゃ.
   She taps each card to hear the plain letter and then the changed one */
const JP_MARKPOOL = ['が', 'ぎ', 'ご', 'ざ', 'じ', 'ぞ', 'だ', 'で', 'ど', 'ば', 'ぶ', 'ぼ', 'ぱ', 'ぴ', 'ぽ'];   /* what the listening check asks: all met in the families first */
const JP_SMALLPOOL = ['きゃ', 'しゃ', 'ちゃ', 'きゅ', 'しゅ', 'きょ', 'しょ', 'ちょ', 'にゃ', 'ぎゅ'];
function jpFamilyOf(st, k) {
  if (st.marks) { const r = 'がざだばぱ'.indexOf(k); if (r < 0) return []; const m = [...JP_MARKED].slice(r * 5, r * 5 + 5), b = [...'かきくけこさしすせそたちつてとはひふへほはひふへほ'].slice(r * 5, r * 5 + 5); return m.map((x, i) => ({ from: b[i], to: x })); }
  if (st.small) return JP_SMALLPOOL.filter(c => c.includes(k)).map(c => ({ from: c[0], to: c, small: k }));
  return [];
}
function jpFamily(ui, st, k) {
  const fam = jpFamilyOf(st, k); if (!fam.length) return Promise.resolve();
  return new Promise(res => {
    ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; let seen = 0;
    const row = h('div', { class: 'jp-fam' + (st.small ? ' small' : '') });
    fam.forEach(f => { const c = h('button', { class: 'jp-pair jp-fcard', 'data-k': f.to }, jpEl(f.from), h('i', null, f.small ? '+' : '→'), f.small ? jpEl(f.small, 'small') : null, f.small ? h('i', null, '=') : null, jpEl(f.to));
      c.addEventListener('click', () => { sfx.tap(); $$('.jp-fcard.lit', row).forEach(x => x.classList.remove('lit')); c.classList.add('lit'); Speech.say([JPV(f.from), JPV(f.to)]);
        if (!c.classList.contains('heard')) { c.classList.add('heard'); seen++; if (seen === fam.length) ui.next(fam.length > 1 ? 'I know them' : 'I know it', ui.stage.firstChild, 'jp-go').then(res); } });
      row.append(c); });
    ui.stage.append(h('div', { class: 'jp-meetwords' }, row));
    const big = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ' }[k];
    ui.prompt(st.marks ? 'The whole row! Tap each one to hear it change.' : 'A small ' + k + ' joins others too. Tap each one.',
      st.marks ? ['Here is the whole row with the marks. Tap each one to hear it change.'].concat(k === 'だ' ? ['Two of them,', JPV('ぢ'), 'and', JPV('づ'), ', sound just like', JPV('じ'), 'and', JPV('ず'), '. They are not used much.'] : [])
        : ['A small', JPV(big), 'joins on to other letters too. Tap each one to hear it.']);
    W.cur = { type: 'act', auto: () => { $$('.jp-fcard', row).forEach(c => c.click()); setTimeout(() => { const g = $('.jp-go', ui.stage); if (g) g.click(); }, 20); } };
  });
}
/* hear a sound, tap its letter. Every new letter once, with a look-back half way. Three misses and the whole row is shown again first (back to basics); then the missed ones are practised until right */
async function jpListen(ui, n) {
  const st = JP_ST[n - 1], pool = jpListenPool(st);
  const ask = st.marks || st.small ? shuffle(pool).slice(0, 5) : shuffle(pool), back = [], half = Math.ceil(ask.length / 2);
  const old = [...jpKnown(n - 1)].filter(c => !st.marks || !JP_MARKED.includes(c)).filter(c => !JP_MARKS_ONLY.includes(c)).filter(c => !st.kata || jpIsKata(c));   /* in katakana, the choices are katakana */
  for (let i = 0; i < ask.length; i++) { if (i === half) { await jpRefresh(ui, n, 0); ui.check(); } const ok = await jpHearLetter(ui, ask[i], pool, old, true); ui.check(); if (!ok) back.push(ask[i]); }
  if (ask.length < 2) { await jpRefresh(ui, n, 0); ui.check(); }
  let taught = false;
  if (back.length >= 3 && !st.marks && !st.small) { await Promise.race([ui.prompt("Let's look at the letters again.", "These are tricky. Let's look at each letter again, and hear it."), wait(3500)]); ui.check(); await jpLetterCards(ui, n); ui.check(); taught = true; }
  await jpMaster(ui, back, l => jpLetterCards(ui, n, l), k => jpHearLetter(ui, k, pool, old, true), k => 'L:' + k, { taught });
}
/* letter cards: tap each to see it write and hear it with its picture word. list: just these letters (the tricky ones); otherwise the station's row (back to basics) */
function jpLetterCards(ui, n, list) {
  return new Promise(res => {
    const st = JP_ST[n - 1], ks = list || [...st.kana], row = h('div', { class: 'jp-lcards' }); let seen = 0; ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    ks.forEach(k => { const a = (!list && st.anch[[...st.kana].indexOf(k)]) || jpAnchor(k), g = KANA_STROKES[k] ? jpGlyph(k) : jpEl(k, 'jp-k jp-lbig'), c = h('button', { class: 'jp-lcard', 'data-k': k }, g, a ? jpPic([a[0], a[1], a[2]]) : null);
      c.addEventListener('click', () => { sfx.tap(); if (g.write) g.write(ui); Speech.say(k === 'ー' && a ? ['A long line, as in', JPV(a[0]), a[1] + '.'] : a ? [JPV(k), 'as in', JPV(a[0]), a[1] + '.'] : [JPV(k), '.']); if (!c.classList.contains('heard')) { c.classList.add('heard'); seen++; if (seen === ks.length) ui.next(ks.length === 1 ? 'I know it' : 'I know them', ui.stage.firstChild, 'jp-go').then(res); } }); row.append(c); });
    ui.stage.append(h('div', { class: 'jp-meetwords' }, row));
    ui.prompt(ks.length === 1 ? 'Tap the letter. Watch and listen.' : 'Tap each letter. Watch and listen.', ks.length === 1 ? 'Tap the letter to watch it write, and hear it.' : 'Tap each letter to watch it write, and hear it.');
    W.cur = { type: 'act', auto: () => { $$('.jp-lcard', row).forEach(c => c.click()); setTimeout(() => { const g = $('.jp-go', ui.stage); if (g) g.click(); }, 20); } };
  });
}

/* ---- STOP 2, words: she meets every word before she is asked to read it (Tony: "I jumped straight into read the word and match the picture before I even knew what I was looking at").
   Each card shows the picture, its English word and the Japanese. A tap says it in Japanese, then English, and opens the say-it panel. Then she hears each word and finds its picture ---- */
function jpWordCards(ui, list, text, say) {
  return new Promise(res => {
    ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; let seen = 0, shown = false;
    const grid = h('div', { class: 'jp-wcards n' + list.length }), focus = h('div', { class: 'jp-wfocus' });
    list.forEach(w => { const c = h('button', { class: 'jp-wcard', 'data-w': w[0] }, jpPic(w), jpEl(w[0], 'jp-w'));
      c.addEventListener('click', () => { sfx.tap(); $$('.jp-wcard.sel', grid).forEach(x => x.classList.remove('sel')); c.classList.add('sel'); jpBoth(w);
        focus.innerHTML = ''; focus.append(h('div', { class: 'jp-sayline' }, jpEl(w[0]), h('small', null, w[1])), jpEcho(w[0]));
        if (!c.classList.contains('heard')) { c.classList.add('heard'); seen++; if (seen === list.length && !shown) { shown = true; ui.next('I know them', focus.parentNode, 'jp-go').then(res); } } });
      grid.append(c); });
    ui.stage.append(h('div', { class: 'jp-meetwords' }, grid, focus));
    focus.append(h('div', { class: 'jp-wtip' }, 'Tap a card to hear it.'));
    ui.prompt(text || 'New words! Tap each card to hear it.', say || 'Here are the new words. Tap each card to hear it in Japanese and English. Then say it yourself.');
    W.cur = { type: 'act', auto: () => { $$('.jp-wcard', grid).forEach(c => c.click()); setTimeout(() => { const g = $('.jp-go', ui.stage); if (g) g.click(); }, 20); } };
  });
}
/* hear a word, find its picture. A right answer is said in Japanese and English */
async function jpFindOne(ui, w, pool) {
  ui.wide(false);
  const play = h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); jpSay(w[0]); } }, ic('speaker-high-volume'));
  const opts = shuffle([w].concat(jpOthers(w, pool, 2))).map(x => ({ el: jpPic(x), ok: x[0] === w[0] }));
  const ok = await jpAsk(ui, { word: w, top: h('div', { class: 'jp-hear' }, play), opts, text: 'Listen. Which picture is it?', say: ['Listen. Which picture is it?', JPV(w[0])], clue: () => ({ text: 'Listen again.', say: ['Listen again.', JPV(w[0])] }) }); ui.check();
  await jpShowWord(ui, w); return ok;
}
const jpTrickyCards = (ui, l) => jpWordCards(ui, l, l.length === 1 ? 'Tap the card to hear it again.' : 'Tap each card to hear it again.', 'Listen to ' + (l.length === 1 ? 'this one' : 'these') + ' again, in Japanese and English. Say ' + (l.length === 1 ? 'it' : 'each one') + ' yourself.');
/* the words stop: meet every word, then hear and find five, with a look-back half way. Three misses and every card comes back (back to basics); then the missed ones are practised until right */
async function jpWordsStop(ui, n) {
  const st = JP_ST[n - 1], pool = jpWords(n);
  await jpWordCards(ui, st.words); ui.check();
  const list = shuffle(st.words.slice()).slice(0, 5), half = Math.ceil(list.length / 2), missed = [];
  for (let i = 0; i < list.length; i++) { if (i === half) { await jpRefresh(ui, n, 1); ui.check(); } if (!await jpFindOne(ui, list[i], pool)) missed.push(list[i]); ui.check(); }
  let taught = false;
  if (missed.length >= 3) { await Promise.race([ui.prompt("Let's meet the words again.", "Those were tricky. Let's meet the words again."), wait(3500)]); ui.check(); await jpWordCards(ui, st.words); ui.check(); taught = true; }
  await jpMaster(ui, missed, l => jpTrickyCards(ui, l), w => jpFindOne(ui, w, pool), w => w[0], { taught });
}

/* ---- LOOK BACK (Tony, 10 October: "we need to have mid refreshers over all lessons/stops we have learnt"). Half way through every stop, three quick cards from everything
   she has learnt so far, on this station and every earlier one: a letter to hear, a word to hear, a word to read, as far as she has got. The ones she found tricky come first.
   A miss is taught again and asked again, as in the stop. Look-backs do not fill the stop's bar, and are counted on their own ---- */
function jpLookPlan(n, i) {
  const cur = JP_ST[n - 1], weak = jpState().weak || {};
  const curL = cur.marks ? ['が', 'ざ', 'だ', 'ば', 'ぱ'] : cur.small ? [] : jpListenPool(cur);
  const old = [...jpKnown(n - 1)].filter(c => !(JP_MARKS_ONLY + 'ぢづ').includes(c) && c !== 'を');
  const letters = old.concat(curL.filter(c => !old.includes(c) && c !== 'を'));
  const heard = jpWords(n - 1).concat(i >= 1 ? cur.words : []), read = jpWords(n - 1).concat(i >= 2 ? cur.words : []);
  const byWeak = (arr, key) => shuffle(arr.slice()).sort((a, b) => (weak[key(b)] || 0) - (weak[key(a)] || 0));
  /* in the letters stop, the new letters are being checked already: look back at older ones */
  const lpick = byWeak(i === 0 && old.length >= 4 ? old : letters, k => 'L:' + k);
  const kinds = read.length >= 3 ? ['L', 'H', 'R'] : heard.length >= 3 ? ['L', 'H', 'H'] : ['L', 'L', 'L'];
  const wpick = byWeak(heard, w => w[0]), rpick = byWeak(read, w => w[0]), used = new Set(), out = [];
  for (const k of kinds) {
    if (k === 'L') { const x = lpick.find(c => !used.has('L' + c)); if (x) { used.add('L' + x); out.push({ k, x }); } }
    else { const x = (k === 'R' ? rpick : wpick).find(w => !used.has(w[0])); if (x) { used.add(x[0]); out.push({ k, x }); } }
  }
  return { items: out, letters, heard, read };
}
async function jpRefresh(ui, n, i) {
  if (n === 1 && i === 0) return;   /* the very first stop: nothing learnt yet to look back on */
  const P = jpLookPlan(n, i); if (!P.items.length || !ui.alive) return;
  ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; W.cur = null; sfx.great(); $$('.jp-combo', ui.root).forEach(c => c.remove());
  ui.stage.append(h('div', { class: 'jp-lookback' }, h('div', { class: 'jp-lbl' }, ic('red-paper-lantern'), ic('red-paper-lantern'), ic('red-paper-lantern')), h('b', null, 'Look back!'), h('span', null, 'Do you remember these?')));
  await Promise.all([Promise.race([ui.prompt('Look back! Do you remember these?', 'Time to look back! Do you remember these?'), wait(3000)]), wait(W.fast ? 0 : 1800)]); ui.check(); await ui.wait(W.fast ? 5 : 400);   /* the card stays long enough to see with the sound off */
  const ask = it => it.k === 'L' ? jpHearLetter(ui, it.x, P.letters, [], true) : it.k === 'H' ? jpFindOne(ui, it.x, P.heard) : jpReadOne(ui, it.x, P.read);
  const prev = JPS.mode; JPS.mode = 'review'; const missed = [];
  for (const it of P.items) { if (!await ask(it)) missed.push(it); ui.check(); }
  await jpMaster(ui, missed, async l => { const ls = l.filter(x => x.k === 'L').map(x => x.x), ws = l.filter(x => x.k !== 'L').map(x => x.x);
      if (ls.length) { await jpLetterCards(ui, n, ls); ui.check(); } if (ws.length) { await jpTrickyCards(ui, ws); ui.check(); } },
    ask, it => it.k === 'L' ? 'L:' + it.x : it.x[0]);
  JPS.mode = prev;
}

/* ---- STOP 3, read and build ---- */
/* read a word; pick its picture. A miss breaks the word into letters she taps to hear. The right answer is said in Japanese and English */
async function jpReadOne(ui, w, pool) {
  ui.wide(false);
  const top = h('div', { class: 'jp-card' }, jpEl(w[0], 'jp-qw'));
  const opts = shuffle([w].concat(jpOthers(w, pool, 2))).map(x => ({ el: jpPic(x), ok: x[0] === w[0] }));
  const ok = await jpAsk(ui, { word: w, top, opts, text: 'Read the word. Which picture?', say: 'Read the word. Which picture is it?',
    onFirstMiss: () => jpLetters(w, ui),
    clue: m => ({ text: m === 1 ? 'Now put the sounds together.' : 'Say the sounds faster: ' + w[0], say: m === 1 ? 'Now say the sounds one after another, faster and faster. What word is it?' : 'Say the sounds faster, and faster. What do you hear?' }) });
  ui.check(); await jpShowWord(ui, w); return ok;
}
/* the read-and-build stop: read four words, practise any missed until right, a look-back, then build two words, practising any that slipped */
async function jpReadStop(ui, n) {
  const st = JP_ST[n - 1], pool = jpWords(n), list = shuffle(st.words.slice()).slice(0, 4), missed = [];
  for (const w of list) { if (!await jpReadOne(ui, w, pool)) missed.push(w); ui.check(); }
  let taught = false;
  if (missed.length >= 3) { await Promise.race([ui.prompt("Let's look at the words again.", "Let's go back and look at the words again."), wait(3500)]); ui.check(); await jpWordCards(ui, st.words); ui.check(); taught = true; }
  await jpMaster(ui, missed, l => jpTrickyCards(ui, l), w => jpReadOne(ui, w, pool), w => w[0], { taught }); ui.check();
  await jpRefresh(ui, n, 2); ui.check();
  const bw = shuffle(st.words.filter(w => jpMora(w[0]).length >= 2)).slice(0, 2), bmiss = [];
  for (const w of bw) { if (!await jpBuild(ui, w, n)) bmiss.push(w); ui.check(); }
  await jpMaster(ui, bmiss, l => jpTrickyCards(ui, l), w => jpBuild(ui, w, n), w => w[0]);
}
/* hear a word and see its picture; put its letters in order. A wrong tile wobbles; after two slips the next sound is said on its own. Finished: said in Japanese and English. Resolves true if built with no slip */
function jpBuild(ui, w, n) {
  return new Promise(res => {
    ui.wide(false); ui.help(false);
    const ms = jpMora(w[0]), kata = jpIsKata(w[0]), known = [...jpKnown(n)].filter(c => jpIsKata(c) === kata && !JP_MARKS_ONLY.includes(c));   /* spare tiles in the word's own script, and never a twin of a letter in it */
    const extra = shuffle(known.filter(c => !ms.some(m => jpAlike(m.k, c)))).slice(0, ms.length > 3 ? 2 : 3);
    const tiles = shuffle(ms.map(m => m.k).concat(extra)), slots = h('div', { class: 'jp-slots' }, ms.map(() => h('i', { class: 'jp-slot' }))), tray = h('div', { class: 'jp-tray' });
    let at = 0, slips = 0, busy = false, hadSlip = false;
    const play = h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); jpSay(w[0]); } }, ic('speaker-high-volume'));
    ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const q = h('div', { class: 'jp-q' }, h('div', { class: 'jp-build' }, jpPic(w, 'big'), play), slots);
    ui.stage.append(q); ui.answer.append(tray);
    const T = tiles.map((k, i) => { const b = h('button', { class: 'jp-tile', 'data-k': k, onclick: () => tap(i) }, jpEl(k)); tray.append(b); return b; });
    const hook = () => { const want = ms[at] && ms[at].k; W.cur = at >= ms.length ? null : { type: 'act', build: w[0], item: w[0], mode: JPS.mode, slip: hadSlip, auto: () => { const i = T.findIndex(b => !b.disabled && b.dataset.k === want); if (i >= 0) tap(i); }, miss: () => { const i = T.findIndex(b => !b.disabled && b.dataset.k !== want); if (i >= 0) tap(i); } }; };
    const tap = async i => { if (busy || T[i].disabled) return; const b = T[i];
      if (b.dataset.k === ms[at].k) { sfx.place(); b.disabled = true; b.classList.add('used'); const s = slots.children[at]; s.innerHTML = ''; s.append(jpEl(b.dataset.k)); s.classList.add('full'); at++; slips = 0;
        if (at >= ms.length) { W.cur = null; busy = true; slots.classList.add('done'); jpTick(!hadSlip, w); q.append(h('b', { class: 'jp-done-en' }, w[1])); await Promise.race([jpBoth(w), wait(3200)]); await ui.wait(W.fast ? 5 : 600); return res(!hadSlip); } hook(); return; }
      slips++; hadSlip = true; sfx.soft(); b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble'); busy = true;
      if (slips >= 2) await Promise.race([ui.prompt('Listen for just the next sound.', ['Listen for just the next sound.', JPV(ms[at].k)]), wait(3500)]);
      else await Promise.race([ui.prompt('Not that one. Listen again.', ['Not that one. Listen again.', JPV(w[0])]), wait(3500)]);
      busy = false; if (ui.alive) hook(); };
    ui.prompt('Listen. Put the letters in order.', ['Listen, and put the letters in order.', JPV(w[0])]); hook();
  });
}

/* COUNT, with Kenta: tap each thing and he counts it in Japanese; the last number is hers to say.
   The things sit in the open between the player and Kenta, in one row or two, and in front of everything, so each one can be tapped (Tony, 10 October: "i cant trigger the next step":
   the first apple was under the player). Kenta says what to count, in Japanese and then English ("it should say what we are counting") */
async function jpCount(ui, t) {
  const n = W.jpCountN || rnd(t.count[0], t.count[1]), sc = jpScene('count'), one = t.one || 'one', many = t.many || 'them';
  ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-talk' }, sc.box));
  const r1 = n > 5 ? Math.ceil(n / 2) : n, things = [];
  for (let i = 0; i < n; i++) { const row = i < r1 ? 0 : 1, m = row ? n - r1 : r1, j = row ? i - r1 : i;
    const b = h('button', { class: 'jp-thing hot', 'data-i': i, style: { '--x': (50 + (j - (m - 1) / 2) * 10.5).toFixed(1) + '%', '--y': (n > 5 ? (row ? 85 : 64) : 76) + '%' } }, art(t.thing), h('b', { class: 'jp-num' })); sc.props.append(b); things.push(b); }
  await sc.say('dog', 'かぞえて！', 'Count the ' + many + '!', ui, true);
  let c = 0;
  await new Promise(res => {
    const tap = b => { if (b.classList.contains('done') || c >= n) return; c++; sfx.step(); b.classList.add('done'); const lab = $('.jp-num', b);
      if (c < n) { lab.textContent = JP_NUM[c]; jpSay(JP_NUM[c]); hook(); } else { lab.textContent = '?'; W.cur = null; setTimeout(res, W.fast ? 5 : 500); } };
    const hook = () => { W.cur = { type: 'act', auto: () => { const b = things.find(x => !x.classList.contains('done')); if (b) tap(b); } }; };
    things.forEach(b => b.addEventListener('click', () => tap(b)));
    ui.prompt('Tap each ' + one + '. Kenta counts in Japanese!', 'Tap each ' + one + ', and Kenta will count them in Japanese. The last number is yours to say.'); hook();
  }); ui.check();
  const list = shuffle([n].concat(shuffle([n - 1, n + 1, n - 2, n + 2].filter(v => v >= 1 && v <= 10)).slice(0, 2)));
  const pickN = await new Promise(res => {
    const row = h('div', { class: 'jp-opts n3' }); ui.answer.innerHTML = ''; ui.answer.append(row); let miss = 0;
    const btns = list.map(v => { const b = h('button', { class: 'jp-opt', onclick: () => choose(v, b) }, jpEl(JP_NUM[v], 'jp-w')); row.append(b); return b; });
    const hook = () => { W.cur = { type: 'choice', answer: list.indexOf(n), n: list.length, item: 'T:count', mode: JPS.mode, give: i => { const b = btns[i]; if (b.disabled) return btns[list.indexOf(n)].click(); b.click(); } }; };
    const choose = async (v, b) => { if (v === n) { W.cur = null; b.classList.add('ok'); sfx.pop(); jpTick(miss === 0); return res(miss); }
      miss++; sfx.soft(); b.classList.add('gone'); b.disabled = true; W.cur = null; await Promise.race([ui.prompt('Count them again: いち, に, さん…', ['Count them again, in Japanese.', JPV(JP_NUM.slice(1, Math.min(n, 4)).join(' '))]), wait(3500)]); if (ui.alive) hook(); };
    ui.prompt('How many ' + many + '? Pick the last number.', 'How many ' + many + ' are there? What is the last number, in Japanese?'); hook();
  }); ui.check();
  sc.props.querySelectorAll('.jp-thing.done .jp-num').forEach((l, i) => { l.textContent = JP_NUM[i + 1]; });
  await sc.say('me', JP_NUM[n] + '！', n + ' ' + many + '!', ui, true); sc.dog.classList.add('happy');
  await jpSayIt(ui, JP_NUM[n], String(n), { pitch: 1.25 });
  return pickN === 0;
}
/* TALK: one exchange. The first time, watch both sides. Then her turn: Kenta speaks, she picks her reply, her explorer says it, and she says it out loud */
async function jpTalkOne(ui, t, first) {
  if (t.count) return jpCount(ui, t);
  const sc = jpScene(t.scene); ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  if (t.thing) sc.props.append(h('div', { class: 'jp-obj', style: { '--x': '50%', '--y': '64%' } }, art(t.thing)));
  if (t.want) sc.props.append(h('div', { class: 'jp-want' }, art(t.want)));
  if (t.scene === 'shop') sc.props.append(h('div', { class: 'jp-fruit' }, (t.goods || ['red-apple', 'tangerine', 'peach']).map(g => art(g))));
  if (t.scene === 'table') sc.props.append(h('div', { class: 'jp-bowl' + (t.empty ? ' empty' : '') }, art(t.empty ? 'bowl-with-spoon' : 'cooked-rice'), art('chopsticks')));
  if (t.scene === 'gift') sc.props.append(h('div', { class: 'jp-gift' }, art('wrapped-gift')));
  ui.stage.append(h('div', { class: 'jp-talk' }, sc.box));
  const en = S.name || 'Explorer', meT = jpFill(t.me || ''), meEn = (t.meEn || '').replace('{en}', en);
  if (first && !t.any) {
    await Promise.race([ui.prompt('Watch and listen.', 'Watch, and listen.'), wait(1600)]); ui.check();
    await sc.say('dog', t.dog, t.dogEn, ui); await ui.wait(W.fast ? 5 : 400);
    if (t.scene === 'gift') sc.box.classList.add('given');
    await sc.say('me', meT, meEn, ui); await ui.wait(W.fast ? 5 : 400);
    if (t.after) { await sc.say('dog', t.after, t.afterEn, ui); await ui.wait(W.fast ? 5 : 400); }
    await ui.next('My turn!'); ui.check();
    sc.box.classList.remove('given'); sc.myBub.classList.remove('on'); sc.dogBub.classList.remove('on');
  }
  await sc.say('dog', t.dog, t.dogEn, ui);
  const opts = t.any ? t.opts.map(o => ({ t: o[0], en: o[1], ok: true })) : shuffle([{ t: meT, en: meEn, ok: true }].concat(t.no.map(x => ({ t: jpFill(x), ok: false }))));
  let miss = 0;
  const got = await new Promise(res => {
    const row = h('div', { class: 'jp-says' }); ui.answer.innerHTML = ''; ui.answer.append(row);
    const btns = opts.map((o, i) => { const b = h('div', { class: 'jp-sayb' }, h('button', { class: 'jp-hearb', 'aria-label': 'Hear it', onclick: () => { sfx.tap(); jpSay(o.t, { pitch: 1.25 }); } }, ic('speaker-high-volume')), h('button', { class: 'jp-opt jp-reply', 'data-i': i, onclick: () => choose(i) }, jpEl(o.t))); row.append(b); return b; });
    const ans = opts.findIndex(o => o.ok);
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: opts.length, item: 'T:' + t.dog, mode: JPS.mode, give: i => { const b = $('.jp-reply', btns[i]); if (b.disabled) return choose(ans); choose(i); } }; };
    const choose = async i => { const b = $('.jp-reply', btns[i]); if (b.disabled) return; W.cur = null;
      if (opts[i].ok) { sfx.pop(); b.classList.add('ok'); jpTick(miss === 0); return res(opts[i]); }
      miss++; sfx.soft(); b.disabled = true; btns[i].classList.add('gone'); await Promise.race([ui.prompt(t.clue, t.clue + ' Tap the speakers to hear each one.'), wait(3800)]); if (ui.alive) hook(); };
    ui.prompt(t.ask, t.ask + ' Tap a speaker to hear each one.'); hook();
  }); ui.check();
  ui.answer.innerHTML = '';
  if (t.scene === 'gift') sc.box.classList.add('given');
  await sc.say('me', got.t, got.en || meEn, ui);
  sc.dog.classList.add('happy'); if (t.after) { await ui.wait(W.fast ? 5 : 300); await sc.say('dog', t.after, t.afterEn, ui); }
  await jpSayIt(ui, got.t, got.en || meEn, { pitch: 1.25 });
  return miss === 0;
}
async function jpTalk(ui, n, first) {
  const ts = JP_ST[n - 1].talk, half = Math.ceil(ts.length / 2), missed = [];
  for (let i = 0; i < ts.length; i++) { if (i === half) { await jpRefresh(ui, n, 3); ui.check(); } if (!await jpTalkOne(ui, ts[i], first)) missed.push(ts[i]); ui.check(); }
  if (ts.length < 2) { await jpRefresh(ui, n, 3); ui.check(); }
  await jpMaster(ui, missed, async () => {}, t => jpTalkOne(ui, t, true), t => 'T:' + (t.dog || 'count'));
}

/* ---- STOP 5, the flashcard race. The fox runs at one steady speed and never stops. A card is a word to read (pick its picture), a picture (pick its word) or a word to hear (pick it).
   A wrong pick greys out and she has one more try; wrong again and the card changes, and comes back after the race with no clock.
   She passes the station by winning. (A limit on wrong picks was tried on 9 October; Tony: "I am ok with more mistakes. Just leave this as it was.")
   What stops a lucky pass instead is the four stops before the race: she has met, heard, read and said every word first. Each right card says its word in Japanese and shows its English ---- */
const jpCardKey = c => c.kind + ':' + c.w[0];
function jpDeck(n) {
  const now = JP_ST[n - 1].words.map(w => w.concat([n])), all = jpWords(n), old = all.filter(w => !now.some(x => x[0] === w[0]));
  const cards = [], kinds = ['read', 'pic', 'hear'], used = {};
  const add = w => { const kind = kinds[cards.length % 3], c = { kind, w }; if (used[jpCardKey(c)]) return; used[jpCardKey(c)] = 1; cards.push(c); };
  const st = jpState(); (st.again || []).forEach(k => { const m = /^(read|pic|hear):(.+)$/.exec(k), w = m && all.find(x => x[0] === m[2]); if (w && !used[k]) { used[k] = 1; cards.push({ kind: m[1], w }); } });
  for (let r = 0; r < 4; r++) shuffle(now).forEach(add);
  shuffle(old).slice(0, 8).forEach(add);
  return { cards: cards.slice(0, (st.again || []).length).concat(shuffle(cards.slice((st.again || []).length))), pool: all };
}
function jpCardShow(c, pool, opts, face, onChoose) {
  face.innerHTML = ''; opts.innerHTML = '';
  const others = jpOthers(c.w, pool, 3), list = shuffle([c.w].concat(others));
  if (c.kind === 'read') face.append(jpEl(c.w[0], 'jp-rw'));
  else if (c.kind === 'pic') face.append(jpPic(c.w, 'big'));
  else { face.append(h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); jpSay(c.w[0]); } }, ic('speaker-high-volume'))); jpSay(c.w[0]); }
  list.forEach(x => { const b = h('button', { class: 'rc-opt jp-ropt', 'data-w': x[0] }, c.kind === 'read' ? jpPic(x) : jpEl(x[0], 'jp-w')); b.addEventListener('click', () => onChoose(x[0] === c.w[0], b)); opts.append(b); });
}
function jpRaceOne(ui, n) {
  return new Promise(res => {
    const st = jpState(), deck = jpDeck(n), L = 10, pace = JP_PACE, first = !st.seen;
    let t = 0, elapsed = 0, idx = 0, tries = 0, over = false, started = false, busy = false, last = 0, timer = null; const missed = [];
    const face = h('div', { class: 'rc-sum jp-face' }), note = h('div', { class: 'rc-note' }), card = h('div', { class: 'rc-card' }, face), opts = h('div', { class: 'rc-opts' });
    const fox = h('div', { class: 'rc-run rc-rival' }, art('fox')), me = h('div', { class: 'rc-run rc-me' }, meEl(S.me || newMe(PRESETS[0])));
    const track = h('div', { class: 'rc-track jp-track' }, h('div', { class: 'rc-ticks' }, Array.from({ length: L + 1 }, () => h('i'))), h('div', { class: 'rc-flag' }, ic('red-paper-lantern')), h('div', { class: 'rc-lane' }, fox), h('div', { class: 'rc-lane' }, me));
    const go = h('button', { class: 'btn go big rc-go', onclick: () => begin() }, 'Go!');
    const box = h('div', { class: 'race jp-race' }, h('div', { class: 'rc-top' }, h('div', { class: 'rc-lv' }, 'Station ' + n), card, note), opts, track);
    const put = (el, p) => el.style.setProperty('--p', Math.min(1, p / L).toFixed(4));
    const tick = () => { const now = performance.now(), dt = Math.min(.3, (now - last) / 1000); last = now; if (!started || over || !ui.alive) { if (!ui.alive) clearInterval(timer); return; } elapsed += dt; put(fox, elapsed / pace); if (elapsed >= L * pace) end(false); };
    const show = () => { if (over) return; const c = deck.cards[idx % deck.cards.length]; tries = 0; note.textContent = ''; card.classList.remove('rc-in', 'rc-out'); void card.offsetWidth; card.classList.add('rc-in');
      jpCardShow(c, deck.pool, opts, face, (ok, b) => choose(c, ok, b));
      const btn = ok => [...opts.children].find(b => !b.disabled && (b.dataset.w === c.w[0]) === ok);
      W.cur = { type: 'act', race: n, auto: () => { const b = btn(true); if (b) b.click(); }, miss: () => { const b = btn(false); if (b) b.click(); }, lose: () => { elapsed = L * pace; } }; };
    const choose = (c, ok, b) => { if (over || busy || !started) return;
      if (ok) { busy = true; W.cur = null; b.classList.add('rc-ok'); sfx.pop(); t++; put(me, t); me.classList.remove('rc-hop'); void me.offsetWidth; me.classList.add('rc-hop');
        note.textContent = c.w[0] + ' = ' + c.w[1]; if (c.kind !== 'hear') jpSay(c.w[0]);
        if (t >= L) return end(true); setTimeout(() => { busy = false; idx++; show(); }, W.fast ? 10 : 900); return; }
      tries++; sfx.soft(); b.classList.add('gone'); b.disabled = true;
      if (tries >= 2) { busy = true; W.cur = null; if (!missed.some(m => jpCardKey(m) === jpCardKey(c))) missed.push(c); card.classList.add('rc-out'); note.textContent = 'That card comes back after the race.'; setTimeout(() => { busy = false; idx++; show(); }, W.fast ? 10 : 520); }
      else { card.classList.remove('wobble'); void card.offsetWidth; card.classList.add('wobble'); note.textContent = 'Not that one. One more try!'; if (c.kind === 'hear') jpSay(c.w[0]); } };
    const end = won => { if (over) return; over = true; clearInterval(timer); W.cur = null; [...opts.children].forEach(b => { b.disabled = true; });
      const pass = won;
      st.again = missed.slice(0, 4).map(jpCardKey); st.seen = 1; st.day = jpToday(); if (won) st.wins = (st.wins || 0) + 1; if (pass && st.st < n) st.st = n; saveState();
      box.classList.add(pass ? 'rc-won' : 'rc-lost'); if (pass) { sfx.great(); confetti(40); kiwiMood(ui.root, 'cheer'); } else { if (!won) put(fox, L); sfx.soft(); }
      const p = pass ? ui.prompt('You beat the fox! Station ' + n + ' passed!', 'You beat the fox! You have passed station ' + n + '.')
        : ui.prompt('The fox won this time. Practise, then try again!', 'The fox won this time. Let us practise the tricky ones, then race again.');
      Promise.race([p, wait(4600)]).then(() => wait(W.fast ? 10 : 900)).then(() => res({ won, pass, missed })); };
    const begin = () => { if (started) return; started = true; sfx.pop(); go.remove(); box.classList.add('rc-on'); Speech.stop(); ui.prompt('Beat the fox!', ' '); last = performance.now(); timer = setInterval(tick, 100); show(); };
    put(fox, 0); put(me, 0); face.append(jpEl('？', 'jp-rw')); opts.append(go);
    ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; ui.stage.append(box);
    ui.prompt(first ? 'Flashcard race! Beat the fox to pass the station.' : 'Station ' + n + '. Ready? Press Go!', first ? 'Flashcard race! Each right answer moves you one step. The fox runs the whole way without stopping. Beat it, and you pass the station.' : 'Station ' + n + '. The fox takes ' + pace + ' seconds a step. Ready? Press Go!');
    ui.key = e => { if (e.key === 'Enter' && !started) begin(); else if (started && !over && /^[1-4]$/.test(e.key)) { const b = opts.children[Number(e.key) - 1]; if (b && !b.disabled) b.click(); } };
    W.cur = { type: 'btn', auto: () => begin() };
  });
}
/* a card that changed during the race, with no clock: its letters to tap and hear, then the question */
async function jpReview(ui, c, pool) {
  ui.wide(false); ui.help(true);
  if (c.kind === 'read') return jpReadOne(ui, c.w, pool);
  if (c.kind === 'hear') { await jpBuild(ui, c.w, JP_N); return; }
  const top = h('div', { class: 'jp-card' }, jpPic(c.w, 'big'));
  const opts = shuffle([c.w].concat(jpOthers(c.w, pool, 2))).map(x => ({ el: jpEl(x[0], 'jp-w'), ok: x[0] === c.w[0] }));
  await jpAsk(ui, { top, opts, text: 'Which word is this picture?', say: ['Which word is this picture?', JPV(c.w[0])], clue: () => ({ text: 'Read each word, one letter at a time.', say: 'Read each word, one letter at a time. Which one says it?' }) });
  ui.check(); await jpShowWord(ui, c.w);
}
/* the eki stamp: each station has its own, pressed into her book when she passes */
function jpStamp(n, cls) {
  const st = JP_ST[n - 1], w = st.words[0];
  return h('div', { class: 'jp-stamp' + (cls ? ' ' + cls : ''), style: { '--r': ((n * 37) % 17 - 8) + 'deg' } }, h('div', { class: 'jp-sin' }, jpArt(w[2]), jpEl(st.head, 'jp-sh'), h('small', null, n)));
}
/* her bullet train: an engine and one carriage for every station passed, each carriage with its station's letter */
/* her bullet train: the nose in front, a carriage for every station passed joined by couplings, and a tail car with its red light at the back
   (Tony, 11 October: "the train should be mirrored so it appears to be the nose of the train then the carriages behind it. having a tail and some sort of link between them would work well too") */
function jpTrain(n, fresh) {
  const t = h('div', { class: 'jp-trainrow' }, h('div', { class: 'jp-engine' }, ic('bullet-train')));
  for (let i = 1; i <= n; i++) t.append(h('i', { class: 'jp-cpl' }), h('div', { class: 'jp-car' + (fresh && i === n ? ' new' : ''), style: { '--c': JP_CAR[(i - 1) % JP_CAR.length] } }, jpEl(JP_ST[i - 1].head)));
  t.append(h('i', { class: 'jp-cpl' }), h('div', { class: 'jp-tail' + (fresh ? ' new' : '') }, h('i', { class: 'jp-tlight' })));
  return t;
}
/* the whole train on the prize screen, as big as fits, never cut off (Tony, 11 October: the nose and tail were off the screen on a phone) */
function jpFitRow(row, box, most) {
  const fit = () => { if (!row.isConnected) return removeEventListener('resize', fit); row.style.maxWidth = 'none'; const w = row.scrollWidth, room = box.clientWidth * .94; if (w && room) row.style.transform = 'scale(' + Math.min(most, room / w).toFixed(3) + ')'; };
  fit(); requestAnimationFrame(fit); setTimeout(fit, 350); addEventListener('resize', fit);   /* measured again once the screen has settled, and when it turns */
}
const JP_CAR = ['#E5484D', '#F28C28', '#F2C14E', '#5CB85C', '#3B9AD9', '#7A5CC9', '#E5689E', '#19A7B8', '#8E6A4A', '#4C6FD8', '#C2453D', '#2E9E5B', '#D9467A', '#2B8C8C', '#B5651D'];
/* a gift for her room at every station: Japanese things a child in Japan would know (Tony: "Prizes and points? Remember, this needs to be fun"). They arrive in her toy box */
const JP_GIFTS = [['jpg-koi', 'carp-streamer', 'Carp streamer'], ['jpg-chime', 'wind-chime', 'Wind chime'], ['jpg-lantern', 'red-paper-lantern', 'Paper lantern'], ['jpg-dolls', 'japanese-dolls', 'Festival dolls'],
  ['jpg-kite', 'kite', 'Kite'], ['jpg-bento', 'bento-box', 'Bento box'], ['jpg-dango', 'dango', 'Dango'], ['jpg-kimono', 'kimono', 'Kimono'], ['jpg-moon', 'moon-viewing-ceremony', 'Moon festival'],
  ['jpg-wish', 'tanabata-tree', 'Wish tree'], ['jpg-castle', 'japanese-castle', 'Japanese castle'], ['jpg-map', 'map-of-japan', 'Map of Japan'],
  ['jpg-tea', 'teacup-without-handle', 'Tea cup'], ['jpg-onigiri', 'rice-ball', 'Rice ball'], ['jpg-shrine', 'shinto-shrine', 'Shrine']].map((g, i) => ({ id: g[0], art: g[1], name: g[2], price: 0, jp: i + 1 }));
/* a prize screen stays at least min ms, even with the sound off (when a spoken line ends at once) */
const jpHold = (p, min, max) => Promise.all([Promise.race([p, wait(max)]), wait(W.fast ? 0 : min)]);
async function jpPassed(ui, n) {
  ui.wide(true); ui.clear(); const g = JP_GIFTS[n - 1];
  /* the stamp, the new carriage, the gift */
  ui.stage.append(h('div', { class: 'jp-stampwrap' }, jpStamp(n, 'press'))); sfx.place(); confetti(30);
  await jpHold(ui.prompt('Your station stamp! ' + JP_ST[n - 1].name + '.', 'Here is your stamp for station ' + n + '. In Japan, every station has its own stamp to collect.'), 2600, 5000); ui.check();
  ui.stage.innerHTML = ''; const tr = jpTrain(n, true), pz = h('div', { class: 'jp-prize' }, tr); ui.stage.append(pz); jpFitRow(tr, pz, 2.4); sfx.great();
  await jpHold(ui.prompt('A new carriage for your bullet train!', 'Your bullet train gets a new carriage. One for every station!'), 2600, 5000); ui.check();
  if (g && !(S.owned || {})[g.id]) { if (!S.owned) S.owned = {}; S.owned[g.id] = true; }
  if (g) { ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-prize' }, art(g.art, 'hero sticker jp-gift-big'), h('div', { class: 'bigtext' }, g.name))); sfx.great();
    ui.prompt('A gift for your room: ' + g.name.toLowerCase() + '!', 'And a present for your room: a ' + g.name.toLowerCase() + '. Find it in your toy box at home.'); await ui.next('Hooray!', ui.stage.firstChild); ui.check(); }
  addStars(5); saveState();
  if (n === JP_HIRA_N) { await Promise.race([ui.prompt('You can read all of hiragana! Katakana next.', 'You can read all of hiragana! Next on the line: katakana, for your name and New Zealand. Sugoi!'), wait(5000)]); ui.check(); }
  if (n === JP_N) { await Promise.race([ui.prompt("Every station! Kenta's Town is open!", "Every station on the line! You can read hiragana and your first katakana. Now Kenta's Town is open, to start real conversations. Sugoi!"), wait(5500)]); ui.check(); }
}
async function jpRace(ui, n, inMission) {
  const st = jpState();
  for (;;) {
    ui.wide(true); ui.clear(); ui.help(false);
    const was = st.st, r = await jpRaceOne(ui, n); ui.check();
    if (r.missed.length) { ui.clear(); await Promise.race([ui.prompt('Now the cards that changed. No rush.', 'Now, the cards that changed. There is no race this time, so take as long as you like.'), wait(4200)]); ui.check();
      const pool = jpWords(n); for (const c of r.missed) { await jpReview(ui, c, pool); ui.check(); } ui.help(false); }
    if (r.pass && was < n) await jpPassed(ui, n);
    /* not passed: back to basics, the station's words again, before she races again */
    if (!r.pass) { await jpWordCards(ui, JP_ST[n - 1].words, 'Practise the words, then race again.', 'Let us look at the words again. Tap each one, and say it. Then race the fox again.'); ui.check(); }
    ui.wide(true); ui.clear();
    const again = await new Promise(res => {
      const fin = v => { sfx.pop(); ui.key = null; res(v); }, next = h('button', { class: 'btn big' + (r.pass ? ' go' : ''), onclick: () => fin(false) }, inMission ? 'Next' : 'Done'), more = h('button', { class: 'btn big' + (r.pass ? '' : ' go'), onclick: () => fin(true) }, 'Race again');
      ui.stage.append(h('div', { class: 'col rc-end' }, h('div', { class: 'rc-pair' }, meEl(S.me || newMe(PRESETS[0]), null, 'hero jp-hero'), art('fox', 'hero' + (r.pass ? ' rc-dim' : ''))), h('div', { class: 'bigtext rc-endt' }, r.pass ? 'Station ' + n + ' passed!' : 'Station ' + n), h('div', { class: 'row wrow' }, r.pass ? [next] : [more, next])));
      ui.prompt(r.pass ? (n < JP_N ? 'Next time: station ' + (n + 1) + '!' : "Kenta's Town is open!") : 'Race again when you are ready.', r.pass ? (n < JP_N ? 'Next time, station ' + (n + 1) + '.' : "You have passed every station. Kenta's Town is open.") : 'Race again when you are ready.');
      W.cur = { type: 'btn', auto: () => next.click(), more: () => more.click() };
    }); ui.check();
    if (!again) return r.pass;
  }
}

/* ---- how far can she go already? Words from each station in turn; the first slip, or "Not yet", is where she starts. Nothing is marked wrong ---- */
async function jpPlace(ui) {
  const st = jpState(); ui.wide(false); ui.help(false);
  await Promise.race([ui.prompt('Can you read any hiragana? Let us see!', 'Do you know some hiragana already? Let us see how far you can read. If you do not know, tap Not yet.'), wait(4500)]); ui.check();
  let n = 0;
  outer: for (let s = 1; s <= JP_N; s++) {
    const ws = shuffle(JP_ST[s - 1].words.slice()).slice(0, 3), pool = jpWords(s);
    for (const w of ws) {
      const r = await new Promise(res => {
        ui.wide(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
        const list = shuffle([w].concat(jpOthers(w, pool, 2))), row = h('div', { class: 'jp-opts n4' });
        list.forEach(x => row.append(h('button', { class: 'jp-opt', onclick: () => { sfx.tap(); res(x[0] === w[0]); } }, jpPic(x))));
        row.append(h('button', { class: 'jp-opt jp-notyet', onclick: () => { sfx.tap(); res(false); } }, 'Not yet'));
        ui.stage.append(h('div', { class: 'jp-q' }, h('div', { class: 'jp-card' }, jpEl(w[0], 'jp-qw')))); ui.answer.append(row);
        ui.prompt('Read it. Which picture?', 'Read the word. Which picture is it?');
        W.cur = { type: 'act', jpPlace: s, auto: () => { if (s > (W.jpStop || 0)) return res(false); res(true); } };
      }); ui.check();
      if (!r) break outer;
    }
    n = s;
  }
  st.placed = true; st.st = Math.max(st.st || 0, n); if (!st.stop) st.stop = {}; for (let i = 1; i <= n; i++) { st.met[i] = 1; st.stop[i] = 5; } saveState(); W.cur = null;
  await Promise.race([ui.prompt(n ? 'You can read up to station ' + n + '! We start after.' : 'We start at the very first station!', n ? 'Well done! You can already read up to station ' + n + '. Your train starts from there.' : 'This is where we start: the very first station. All aboard!'), wait(4000)]); ui.check();
}

/* ---- a station's five stops, done in order and saved after each one (Tony: "It needs to flow"). The race opens only after the first four ---- */
const JP_STOPS = [{ k: 'letters', icon: 'japanese-symbol-for-beginner', label: 'Letters', run: jpMeet }, { k: 'words', icon: 'framed-picture', label: 'Words', run: jpWordsStop },
  { k: 'read', icon: 'books', label: 'Read and build', run: jpReadStop }, { k: 'talk', icon: 'speech-balloon', label: 'Talk', run: (ui, n) => jpTalk(ui, n, true) }, { k: 'race', icon: 'fox', label: 'Fox race', run: null }];
/* how many stops of station n are done. An older save that had met the station counts its first four as done */
const jpStopsDone = n => { const st = jpState(); if (!st.stop) st.stop = {}; if (st.st >= n) return 5; return st.stop[n] != null ? st.stop[n] : st.met[n] ? 4 : 0; };
async function jpRunStop(ui, n, i, inMission) {
  const st = jpState(), s = JP_STOPS[i];
  if (s.k === 'race') return jpRace(ui, n, inMission);
  const S0 = JP_ST[n - 1], ln = S0.marks || S0.small ? (S0.marks ? 5 : 4) * 2 : S0.kana.length + jpListenPool(S0).length, talks = S0.talk.length;
  jpScore(ui, [ln, S0.words.length > 5 ? 5 : S0.words.length, 6, talks][i] || 5);
  await s.run(ui, n); ui.check();
  if (!st.stop) st.stop = {}; if ((st.stop[n] || 0) <= i) st.stop[n] = i + 1; if (i === 3) st.met[n] = 1; st.day = jpToday(); saveState(); addStars(1);
  ui.wide(true); ui.clear(); sfx.great(); kiwiMood(ui.root, 'cheer'); ui.steps(JPS.total, JPS.total);
  const newDay = jpStreak(), stk = jpState().streak || 1;
  ui.stage.append(h('div', { class: 'jp-prize jp-summary' }, art(s.icon, 'hero sticker'), h('div', { class: 'bigtext' }, s.label + ': done!'),
    h('div', { class: 'jp-sumrow' }, JPS.asked ? h('span', null, ic('check-mark-button'), JPS.first + ' of ' + JPS.asked + ' right first time') : null, JPS.fixed ? h('span', { class: 'jp-fixed' }, ic('flexed-biceps'), JPS.fixed + ' tricky ' + (JPS.fixed === 1 ? 'one' : 'ones') + ' now right') : null, JPS.left ? h('span', null, ic('repeat-button'), JPS.left + ' to practise next time') : null, JPS.rev ? h('span', null, ic('red-paper-lantern'), 'Look back: ' + JPS.revOk + ' of ' + JPS.rev) : null, JPS.best >= 3 ? h('span', null, ic('sparkles'), 'Best: ' + JPS.best + ' in a row') : null, h('span', null, ic('star'), '+1 star')),
    newDay ? h('div', { class: 'jp-streak big' }, Array.from({ length: Math.min(stk, 7) }, () => ic('red-paper-lantern')), h('b', null, stk === 1 ? 'Day 1. Come back tomorrow!' : stk + ' days in a row!')) : null));
  await Promise.race([ui.prompt(i === 3 ? 'Ready for the fox race!' : 'Stop done! A star for you.', (i === 3 ? 'Well done. The fox race is open. Beat the fox to pass the station!' : 'That stop is done. Here is a star.') + (newDay && stk > 1 ? ' And that is ' + stk + ' days in a row!' : '')), wait(3800)]); ui.check();
  await ui.next('Next', ui.stage.firstChild); ui.check();
}
/* the station screen: the five stops as a row of stations, ticked when done; the next one glows */
function jpStationMenu(ui, n) {
  return new Promise(res => {
    const done = jpStopsDone(n), st = JP_ST[n - 1]; ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const row = h('div', { class: 'jp-stops' });
    JP_STOPS.forEach((s, i) => { const lock = i > done || (s.k === 'race' && done < 4), cls = i < done ? ' done' : i === done ? ' now' : '';
      row.append(h('button', { class: 'jp-stop' + cls + (lock ? ' lock' : ''), 'data-k': i === done ? 'next' : s.k, onclick: () => { if (lock) { sfx.soft(); Speech.say(s.k === 'race' ? 'Finish the other stops first. Then race the fox.' : 'Do the stops in order.'); return; } sfx.pop(); res(i); } },
        h('i', { class: 'jp-stopn' }, i < done ? ic('check-mark-button') : String(i + 1)), art(lock ? 'locked' : s.icon), h('span', null, s.label))); });
    const back = h('button', { class: 'btn quiet lb-b', 'data-k': 'back', onclick: () => { sfx.tap(); res(-1); } }, 'Back');
    ui.stage.append(h('div', { class: 'elx lb jp-station' }, h('div', { class: 'jp-sthead' }, h('div', { class: 'jp-board big' }, jpEl(st.head)), h('b', null, 'Station ' + n + ': ' + st.name)), row, h('div', { class: 'lb-row' }, back)));
    const nx = JP_STOPS[Math.min(done, 4)];
    ui.prompt(done >= 4 ? 'Race the fox to pass station ' + n + '!' : 'Next stop: ' + nx.label.toLowerCase() + '.', done >= 4 ? 'All four stops done. Race the fox to pass station ' + n + '!' : 'Station ' + n + '. Next stop: ' + nx.label.toLowerCase() + '.');
    W.cur = { type: 'labmenu', pick: k => { const b = $('.jp-stop[data-k="' + k + '"], .lb-b[data-k="' + k + '"]', ui.stage); if (b) b.click(); return !!b; } };
  });
}
/* a station's stops. One she has not passed: until she passes it. One she has passed: any stop again, as practice, until she taps Back */
async function jpStation(ui, n) {
  const was = jpState().st >= n;
  for (;;) {
    const st = jpState(); if (!was && st.st >= n) return;
    const i = await jpStationMenu(ui, n); ui.check(); if (i < 0) return;
    await jpRunStop(ui, n, i, false); ui.check();
  }
}
/* in a mission: the next stop or two of her station (Japan's Mission 3), or her race when it is open (the challenge) */
ACTS.nihongo = async (ui, d) => {
  const st = jpState(); d = d || {};
  if (!st.placed) { await jpPlace(ui); ui.check(); }
  if (d.part === 'talk') { const n = Math.max(1, Math.min(JP_N, st.st || 1)); const t = pick(JP_ST[pick([n, rnd(1, n)]) - 1].talk); await jpTalkOne(ui, t, false); return; }
  const n = Math.min(JP_N, st.st + 1);
  if (st.st >= JP_N) return jpRace(ui, JP_N, true);
  if (d.part === 'race' && jpStopsDone(n) >= 4) return jpRace(ui, n, true);
  for (let k = 0; k < (d.stops || 1); k++) { const done = jpStopsDone(n); if (done >= 4) { if (d.part === 'race' || k > 0) break; return jpRace(ui, n, true); } await jpRunStop(ui, n, done, true); ui.check(); }
};

/* ---- the station line: her home in Japanese. A bullet train sits at her station; each station passed has its stamp; her train with its carriages runs along the bottom ---- */
function jpLine(st, tall, pickStn) {   /* pickStn(n): a station was tapped (Tony, 11 October: "i want the stations to be click links") */
  /* a wide screen: one line across Japan. An upright screen: the line snakes in three rows of four, like a board game */
  /* fifteen stations: twelve of hiragana, then three of katakana (11 October). An upright screen: four rows of four, like a board game */
  const VW = tall ? 500 : 1000, VH = tall ? 720 : 260;
  const P = tall ? [0, 1, 2, 3].flatMap(r => [70, 190, 310, 430].map((x, i) => [r % 2 ? 500 - x : x, 105 + r * 170 + (i % 2 ? 14 : 0)])).slice(0, JP_N)
    : JP_ST.map((s, i) => [46 + i * (908 / (JP_N - 1)), [196, 156, 182, 136, 164, 116, 152, 106, 142, 100, 134, 96, 126, 90, 118][i % 15]]);
  let d = 'M' + P[0].join(' ');
  for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i];
    if (tall && Math.abs(a[1] - b[1]) > 60) { const dx = a[0] > 250 ? 80 : -80; d += ' C' + (a[0] + dx) + ' ' + a[1] + ' ' + (b[0] + dx) + ' ' + b[1] + ' ' + b[0] + ' ' + b[1]; }
    else { const mx = (a[0] + b[0]) / 2; d += ' C' + mx + ' ' + a[1] + ' ' + mx + ' ' + b[1] + ' ' + b[0] + ' ' + b[1]; } }
  const back = tall ? '<path d="M0 720V600Q250 570 500 610V720z" fill="#BFE8B0"/><path d="M150 330 230 250q20-14 40 0l80 80z" fill="#A8BDE6" opacity=".7"/><path d="M220 262q30-24 60 0l-12 12-18-10-18 10z" fill="#fff" opacity=".8"/>'
    : '<path d="M0 260V200Q250 170 500 200T1000 190V260z" fill="#BFE8B0"/><path d="M640 120 760 20q20-14 40 0l120 100z" fill="#A8BDE6"/><path d="M748 30q32-28 64 0l-14 14-18-10-18 10z" fill="#fff"/>';
  const box = h('div', { class: 'jp-line' + (tall ? ' tall' : ''), style: { '--ar': (VW / VH).toFixed(4) }, html: '<svg viewBox="0 0 ' + VW + ' ' + VH + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + back +
    '<path d="' + d + '" fill="none" stroke="#8C93A8" stroke-width="12" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 12"/>' +
    '<path class="jp-done" d="' + d + '" pathLength="1" fill="none" stroke="#D8402F" stroke-width="7" stroke-linecap="round" style="--p:' + (Math.max(0, st.st - 1) / (P.length - 1)).toFixed(3) + '"/></svg>' });
  const cur = Math.min(JP_N, st.st + 1);
  JP_ST.forEach((s, i) => { const n = i + 1, [x, y] = P[i], done = st.st >= n, now = st.st + 1 === n || (n === JP_N && st.st >= JP_N), lock = !done && !now;
    const b = h(pickStn ? 'button' : 'div', { class: 'jp-stn' + (done ? ' done' : '') + (now ? ' now' : '') + (lock ? ' lock' : '') + (s.kata ? ' kata' : ''), 'data-n': n, 'data-k': n === cur ? 'next' : 'stn-' + n, 'aria-label': 'Station ' + n, style: { left: (x / VW * 100) + '%', top: (y / VH * 100) + '%' } }, h('div', { class: 'jp-board' + ([...s.head].length > 1 ? ' two' : '') }, jpEl(s.head)));
    if (done) b.append(jpStamp(n, 'mini'));
    if (pickStn) b.addEventListener('click', () => { if (lock) { sfx.soft(); const bd = b.firstChild; bd.classList.remove('wobble'); void bd.offsetWidth; bd.classList.add('wobble'); Speech.say('Pass station ' + (n - 1) + ' first. Then this one opens.'); return; } sfx.pop(); pickStn(n); });
    box.append(b); });
  /* the bullet train sits at her station, facing the way it will go next */
  const ai = Math.min(P.length - 1, st.st), at = P[ai] || P[0], to = P[Math.min(P.length - 1, ai + 1)], prev = ai >= P.length - 1 ? P[ai - 1] : null;
  const right = prev ? at[0] > prev[0] : to[0] > at[0];
  box.append(h('div', { class: 'jp-train' + (right ? ' right' : ''), style: { left: (at[0] / VW * 100) + '%', top: (at[1] / VH * 100) + '%' } }, ic('bullet-train')));
  return box;
}
async function jpHome(ui) {
  const st = jpState();
  if (!st.placed) { await jpPlace(ui); ui.check(); }
  for (;;) {
    const n = Math.min(JP_N, st.st + 1), done = st.st >= JP_N, stops = done ? 5 : jpStopsDone(n);
    const run = await labMenu(ui, res => h('div', { class: 'jp-home' }, jpLine(st, innerHeight > innerWidth, k => res(() => jpStation(ui, k))), h('div', { class: 'jp-homebar' }, st.st ? jpTrain(st.st) : null, st.streak && st.sday ? h('div', { class: 'jp-streak' }, ic('red-paper-lantern'), h('b', null, st.streak + (st.streak === 1 ? ' day' : ' days'))) : null)), [
      /* Kenta's Town, the conversation stage: open once every station is passed. Before then the button says how to open it */
      st.st ? { k: 'town', icon: st.st >= JP_N ? 'houses' : 'locked', label: "Kenta's Town", go: st.st >= JP_N, run: async () => { if (st.st >= JP_N) return townHome(ui); sfx.soft();
        await Promise.race([ui.prompt("Pass every station to open Kenta's Town.", "Kenta's Town opens when you have passed every station on the line, the katakana ones too."), wait(3800)]); ui.check(); } } : null,
      { k: 'chart', icon: 'japanese-symbol-for-beginner', label: 'My letters', run: () => jpChartPage(ui) },
      st.st || st.met[1] ? { k: 'talk', icon: 'speech-balloon', label: 'Talk', run: async () => { const k = Math.max(1, Math.min(JP_N, st.met[n] ? n : st.st)); const t = pick(JP_ST[rnd(1, k) - 1].talk); await jpTalkOne(ui, t, false); } } : null,
      st.st ? { k: 'words', icon: 'books', label: 'My words', run: async () => { const pool = jpWords(st.st), weak = pool.filter(w => (st.weak || {})[w[0]]), pickw = weak.concat(shuffle(pool.filter(w => !weak.includes(w)))).slice(0, 8); await jpWordCards(ui, pickw, 'Your words. Tap each one to hear it.', 'Here are some of your words. Tap each one to hear it in Japanese and English.'); ui.check(); jpScore(ui, 4); for (const w of pickw.slice(0, 4)) { await jpReadOne(ui, w, pool); ui.check(); } addStars(1); } } : null],
      done ? "Every station! Kenta's Town is open." : 'Tap station ' + n + ' to go on: ' + JP_ST[n - 1].name + '.',
      done ? "You have passed every station on the line. Kenta's Town is open! Or tap any station to play it again." : (st.st ? 'You have passed ' + st.st + (st.st === 1 ? ' station' : ' stations') + '. Tap the pink station, number ' + n + ', to go on. You can tap a station you have passed to practise it again.' : 'Welcome to the Japanese line! Each station teaches new letters and words. Tap the first station to start. All aboard!'));
    ui.check(); await run(); ui.check();
  }
}
/* her letters: the whole chart, with what she has met in ink. Tap one to watch it write and hear it */
function jpChartPage(ui) {
  return new Promise(res => {
    const st = jpState(), known = jpKnown(Math.max(st.st, Object.keys(st.met).length ? Math.max(...Object.keys(st.met).map(Number)) : 0)), big = h('div', { class: 'jp-chartbig' });
    const tap = (k, b) => { sfx.tap(); $$('.jp-cc.sel', wrap).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); big.innerHTML = ''; const g = jpGlyph(k); big.append(g); g.write(ui); jpSay(k); };
    let chart = jpChart(known, { tap }); const wrap = h('div', { class: 'jp-cwrap' }, chart);
    ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const back = h('button', { class: 'btn quiet lb-b', 'data-k': 'back', onclick: () => { sfx.tap(); res(); } }, 'Back');
    /* once she has met katakana, a second chart: the same rows in katakana */
    const kat = [...known].some(jpIsKata) ? h('button', { class: 'btn quiet lb-b jp-kswap', 'data-k': 'kata', onclick: () => { sfx.tap(); const k = !wrap.classList.contains('kata'); wrap.classList.toggle('kata', k); chart.remove(); chart = jpChart(known, { tap, kata: k }); wrap.append(chart); kat.firstChild.textContent = k ? 'ひらがな' : 'カタカナ'; } }, jpEl('カタカナ')) : null;
    ui.stage.append(h('div', { class: 'jp-chartpage' }, wrap, h('div', { class: 'jp-cside' }, big, kat, back)));
    ui.prompt(known.length ? 'Your letters. Tap one to watch it write.' : 'Your letters will fill in here.', known.length ? 'Here are all your letters. Tap one to hear it and watch it write.' : 'As you pass each station, your letters fill in here.');
    W.cur = { type: 'labmenu', pick: k => { if (k === 'back') back.click(); if (k === 'kata' && kat) kat.click(); return k === 'back' || (k === 'kata' && !!kat); } };
  });
}
SCREENS.nihongo = () => {
  const ui = makeUI(() => go('map'), 'japan'); show(ui.root); ui.root.classList.add('c-jp'); W.cheers = ['すごい！', 'じょうず！'];
  (async () => { try { await jpHome(ui); } catch (e) { if (e !== ABORT) { console.error(e); throw e; } } })();
};
W.jp = { jpBuild, jpReadOne, jpWordCards, jpKata, jpHira, jpIsKata, jpListenPool, JP_HIRA_N, jpFitRow, JP_NUM, JP_MARKPOOL, JP_SMALLPOOL, jpFamilyOf, jpSlowParts, jpCount, jpRefresh, jpLookPlan, jpMaster, jpAlike, JPS, JPV, jpSay, jpFill, jpScene, jpStamp, jpGlyph, jpTrain, JP_ST, JP_GIFTS, JP_STOPS, jpStopsDone, jpKnown, jpWords, jpMora, jpRom, jpPhon, jpCan, jpDeck, JP_MARKED, jpState };
