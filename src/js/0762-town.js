/* ===== けんたの まち: Kenta's Town, the conversation stage.
   Tony, 11 October: "How do we get to the next step to ensure the player can start having conversation in Japanese?" Proposed the same day (plan, "Proposed: the conversation stage"),
   approved: "Commence with items 1 and 2", building the Park and Home first, then a review with the player before the rest.

   THE IDEA. After the line she reads hiragana and her first katakana, and knows about 20 set exchanges. Conversation needs more: a sentence pattern she can put her own words into,
   understanding a question she has not rehearsed, answering aloud with her own true answer, asking questions back, and real people to talk to.
   The town has eight places. Each teaches one sentence pattern with words she can already read, in six steps, in order:
     1 WATCH   a short dialogue, Japanese then English, then the place's new words on cards (every word met before it is asked)
     2 SWAP    the pattern with a gap; she taps the word that fits the picture, and hears the whole sentence (how the sentence works)
     3 ANSWER  Kenta asks her; every choice is right, she picks her own true answer and says it aloud
     4 ASK     she asks Kenta a question, hears his answer, and shows she understood it (two-way turns)
     5 LISTEN  Kenta at natural speed, with no words on screen; she picks the picture
     6 ROLE    a role-play of five turns where the English help fades: full, then faint, then gone
   Rewards as on the line: the progress bar, cheers, a summary and a star for each step; a sticker on the town map and a new friend for each place.
   The teaching rule holds: a wrong pick greys out and a clue is given; nothing is lit; anything missed is practised until right (jpMaster).
   The Park and Home were built first (Tony's order: "Park and Home (Recommended)", 11 October); the Zoo on 28 October ("build the zoo"); the Shop on 29 October ("build the shop"). The other four show on the map as coming soon.
   Her progress is S.jp.town { done: { park: steps done } }. It belongs to no country.
   Sources for the patterns: the New Zealand Curriculum, Learning Languages, Level 1 and 2 (introduce yourself; give and ask for personal information; talk about family and belongings; express likes and dislikes).
   Ages: はっさい for eight is the standard (irregular) reading. Many boys say ぼく for "I" and Kenta is a boy; わたし is polite for anyone, so the player always says わたし ===== */

const TOWN = [
  { id: 'park', name: 'The park', jp: 'こうえん', icon: 'deciduous-tree', scene: 'park', pattern: 'わたしは ＿ です。', friend: { id: 'tama', name: 'Tama', jp: 'たま', art: 'cat', what: 'a cat' },
    teaches: 'Saying who you are: your name, your age and where you are from.',
    /* 1 watch: Kenta meets Tama, a cat from Japan */
    watchLeft: 'tama',
    watch: [['dog', 'こんにちは！ ぼくは けんた です。', 'Hello! I am Kenta.'], ['fr', 'こんにちは！ わたしは たま です。', 'Hello! I am Tama.'], ['dog', 'なんさい ですか？', 'How old are you?'],
      ['fr', 'ななさい です。', 'I am seven.'], ['dog', 'どこから きましたか？', 'Where are you from?'], ['fr', 'にほんから きました。', 'I am from Japan.']],
    words: [['なまえ', 'name', 'name-badge'], ['なんさい', 'how old', 'birthday-cake'], ['どこから', 'from where', 'world-map'], ['きました', 'came', 'airplane'], ['にほん', 'Japan', 'flag:jp'], ['ちゅうごく', 'China', 'flag:cn']],
    /* 2 swap: the word that fits the gap */
    swap: [{ frame: 'わたしは ＿ です。', img: 'cat', who: 'Tama', ask: 'Tama says her name. Which word fits?', fill: 'たま', no: ['けんた', 'くま'], en: 'I am Tama.', clue: 'Tama is the cat.' },
      { frame: 'ぼくは ＿ です。', img: 'kenta', who: 'Kenta', ask: 'Kenta says his name. Which word fits?', fill: 'けんた', no: ['たま', 'くま'], en: 'I am Kenta.', clue: 'This is Kenta the Shiba.' },
      { frame: '＿さい です。', img: 'age:7', who: 'seven', ask: 'How old? Which number fits?', fill: 'なな', no: ['ご', 'ろく'], en: 'I am seven.', clue: 'Count in Japanese: いち, に, さん…' },
      { frame: '＿から きました。', img: 'flag:nz', who: 'New Zealand', ask: 'Where from? Which word fits?', fill: 'ニュージーランド', no: ['にほん', 'ちゅうごく'], en: 'I am from New Zealand.', clue: 'Read each one in katakana and hiragana.' }],
    /* 3 her own true answers */
    own: [{ dog: 'おなまえは？', dogEn: 'What is your name?', ask: 'Kenta asks your name. Say it!', opts: [['わたしは {kname} です。', 'I am {en}.']] },
      { dog: 'なんさい ですか？', dogEn: 'How old are you?', ask: 'Kenta asks your age. Pick yours.', opts: [['ろくさい です。', 'I am six.'], ['ななさい です。', 'I am seven.'], ['はっさい です。', 'I am eight.']] },
      { dog: 'どこから きましたか？', dogEn: 'Where are you from?', ask: 'Where are you from? Pick yours.', opts: [['ニュージーランドから きました。', 'I am from New Zealand.'], ['にほんから きました。', 'I am from Japan.'], ['ちゅうごくから きました。', 'I am from China.']] }],
    /* 4 she asks Kenta, then shows she understood his answer */
    ask: [{ want: 'Ask Kenta how old he is.', q: 'なんさい ですか？', qEn: 'How old are you?', no: ['どこから きましたか？', 'おなまえは？'], clue: 'You want his age. Listen to each one.',
        ans: 'ぼくは ごさい です。', ansEn: 'I am five.', check: 'How old is Kenta?', pics: [['ご', 'five', 'age:5'], ['なな', 'seven', 'age:7'], ['はち', 'eight', 'age:8']] },
      { want: 'Ask Kenta where he is from.', q: 'どこから きましたか？', qEn: 'Where are you from?', no: ['なんさい ですか？', 'おなまえは？'], clue: 'You want his country. Listen to each one.',
        ans: 'ぼくは にほんから きました。', ansEn: 'I am from Japan.', check: 'Where is Kenta from?', pics: [['にほん', 'Japan', 'flag:jp'], ['ニュージーランド', 'New Zealand', 'flag:nz'], ['ちゅうごく', 'China', 'flag:cn']] }],
    /* 5 at natural speed, no words on screen */
    listen: [{ who: 'fr', t: 'わたしは ななさい です。', en: 'I am seven.', ask: 'Tama talks fast! How old is she?', pics: [['なな', 'seven', 'age:7'], ['ろく', 'six', 'age:6'], ['ご', 'five', 'age:5']] },
      { who: 'dog', t: 'たまは にほんから きました。', en: 'Tama is from Japan.', ask: 'Listen. Where is Tama from?', pics: [['にほん', 'Japan', 'flag:jp'], ['ちゅうごく', 'China', 'flag:cn'], ['ニュージーランド', 'New Zealand', 'flag:nz']] },
      { who: 'dog', t: 'ぼくは けんた です。 よろしく！', en: 'I am Kenta. Nice to meet you!', ask: 'Listen. Who is talking?', pics: [['けんた', 'Kenta', 'kenta'], ['たま', 'Tama', 'cat'], ['くま', 'bear', 'bear']] }],
    /* 6 the role-play: the English help fades */
    role: [{ dog: 'こんにちは！', dogEn: 'Hello!', me: 'こんにちは！', meEn: 'Hello!', no: ['おやすみ。', 'いただきます！'], ask: 'Kenta says hello.' },
      { dog: 'おなまえは？', dogEn: 'What is your name?', me: 'わたしは {kname} です。', meEn: 'I am {en}.', no: ['わたしは けんた です。', 'ななさい です。'], ask: 'Kenta asks your name.' },
      { dog: 'なんさい ですか？', dogEn: 'How old are you?', any: [['ろくさい です。', 'I am six.'], ['ななさい です。', 'I am seven.'], ['はっさい です。', 'I am eight.']], ask: 'Your turn.' },
      { dog: 'どこから きましたか？', dogEn: 'Where are you from?', any: [['ニュージーランドから きました。', 'I am from New Zealand.'], ['にほんから きました。', 'I am from Japan.'], ['ちゅうごくから きました。', 'I am from China.']], ask: 'Your turn.' },
      { dog: 'よろしく！', dogEn: 'Nice to meet you!', me: 'よろしく！', meEn: 'Nice to meet you!', no: ['さようなら！', 'おはよう！'], ask: 'Your turn.' }],
    /* the weekly talk card for a Japanese-speaking family member (three phrases from this place) */
    card: [['おなまえは？', 'What is your name?', 'わたしは {kname} です。', 'I am {en}.'], ['なんさい ですか？', 'How old are you?', 'ななさい です。', 'I am seven.'], ['どこから きましたか？', 'Where are you from?', 'ニュージーランドから きました。', 'I am from New Zealand.']],
    tip: 'Ask these at dinner, in any order. Wait for the answer before you help. Then let your child ask you the same questions.' },

  { id: 'home', name: 'Home', jp: 'いえ', icon: 'house-with-garden', scene: 'room', pattern: 'これは わたしの ＿ です。', friend: { id: 'rin', name: 'Rin', jp: 'りん', art: 'dog-face', what: "Kenta's little sister" },
    teaches: 'Showing your family and your things: this is my mum, my dad, my book.',
    /* 1 watch: Kenta shows her round his home */
    watch: [['dog', 'これは ぼくの いえ です。', 'This is my home.'], ['me', 'すごい！ これは なん ですか？', 'Wow! What is this?', 'bird'], ['dog', 'ぼくの とり です。', 'It is my bird.', 'bird'],
      ['me', 'かわいい！ これは だれ ですか？', 'Cute! Who is this?', 'rin'], ['dog', 'いもうとの りん です。', 'My little sister, Rin.', 'rin'], ['me', 'こんにちは、りん！', 'Hello, Rin!', 'rin']],
    words: [['わたしの', 'my (anyone)', 'person-raising-hand'], ['ぼくの', 'my (many boys)', 'boy'], ['なん', 'what', 'red-question-mark'], ['だれ', 'who', 'bust-in-silhouette'], ['いもうと', 'little sister', 'dog-face'], ['かわいい', 'cute', 'smiling-face-with-heart-eyes']],
    swap: [{ frame: 'これは わたしの ＿ です。', img: 'woman', who: 'mum', ask: 'This is my mum. Which word fits?', fill: 'おかあさん', no: ['おとうさん', 'ほん'], en: 'This is my mum.', clue: 'Mum is おかあさん. Read each one.' },
      { frame: 'これは わたしの ＿ です。', img: 'man', who: 'dad', ask: 'This is my dad. Which word fits?', fill: 'おとうさん', no: ['おかあさん', 'いぬ'], en: 'This is my dad.', clue: 'Dad is おとうさん. Read each one.' },
      { frame: 'これは わたしの ＿ です。', img: 'books', who: 'book', ask: 'This is my book. Which word fits?', fill: 'ほん', no: ['ねこ', 'くるま'], en: 'This is my book.', clue: 'Read each word, one letter at a time.' },
      { frame: 'これは ＿ ねこ です。', img: 'kenta', who: 'Kenta', ask: 'Kenta is a boy. Which word does he say?', fill: 'ぼくの', no: ['わたしの', 'だれ'], en: 'This is my cat.', clue: 'Kenta says ぼくは けんた です. Which word is his?' }],
    own: [{ dog: 'これは だれ ですか？', dogEn: 'Who is this?', thing: 'framed-picture', ask: 'Kenta sees your photo. Who is it?', opts: [['わたしの おかあさん です。', 'My mum.'], ['わたしの おとうさん です。', 'My dad.'], ['わたしの いもうと です。', 'My little sister.']] },
      { dog: 'これは なん ですか？', dogEn: 'What is this?', thing: 'wrapped-gift', ask: 'Show Kenta one of your things.', opts: [['これは わたしの ほん です。', 'This is my book.'], ['これは わたしの いぬ です。', 'This is my dog.'], ['これは わたしの ねこ です。', 'This is my cat.']] }],
    ask: [{ want: 'Kenta has a photo. Ask who it is.', thing: 'framed-picture', q: 'これは だれ ですか？', qEn: 'Who is this?', no: ['これは なん ですか？', 'なんさい ですか？'], clue: 'It is a person. Ask who.',
        ans: 'ぼくの おとうさん です。', ansEn: 'My dad.', check: "Who is in Kenta's photo?", pics: [['おとうさん', 'dad', 'man'], ['おかあさん', 'mum', 'woman'], ['いもうと', 'little sister', 'dog-face']] },
      { want: 'Kenta holds a thing. Ask what it is.', thing: 'wrapped-gift', q: 'これは なん ですか？', qEn: 'What is this?', no: ['これは だれ ですか？', 'どこから きましたか？'], clue: 'It is a thing, not a person. Ask what.',
        ans: 'ぼくの ほね です！', ansEn: 'My bone!', check: 'What is it?', pics: [['ほね', 'bone', 'bone'], ['ほん', 'book', 'books'], ['くるま', 'car', 'automobile']] }],
    listen: [{ who: 'dog', t: 'これは ぼくの くるま です。', en: 'This is my car.', ask: 'Kenta talks fast! What is it?', pics: [['くるま', 'car', 'automobile'], ['ほん', 'book', 'books'], ['いぬ', 'dog', 'dog']] },
      { who: 'dog', t: 'りんは ぼくの いもうと です。', en: 'Rin is my little sister.', ask: 'Listen. Who is Rin?', pics: [['いもうと', 'little sister', 'dog-face'], ['おかあさん', 'mum', 'woman'], ['おとうさん', 'dad', 'man']] },
      { who: 'me', t: 'これは わたしの ねこ です。', en: 'This is my cat.', ask: 'Listen. What are you showing?', pics: [['ねこ', 'cat', 'cat'], ['とり', 'bird', 'bird'], ['いぬ', 'dog', 'dog']] }],
    role: [{ dog: 'こんにちは！', dogEn: 'Hello!', me: 'こんにちは！', meEn: 'Hello!', no: ['おやすみ。', 'ごちそうさま！'], ask: 'Kenta comes to your home.' },
      { dog: 'これは なん ですか？', dogEn: 'What is this?', thing: 'books', me: 'これは わたしの ほん です。', meEn: 'This is my book.', no: ['これは わたしの いぬ です。', 'わたしは {kname} です。'], ask: 'Kenta points at your book.' },
      { dog: 'これは だれ ですか？', dogEn: 'Who is this?', thing: 'woman', me: 'わたしの おかあさん です。', meEn: 'My mum.', no: ['わたしの おとうさん です。', 'わたしの ほん です。'], ask: 'Your turn.' },
      { dog: 'かわいい！ これは？', dogEn: 'Cute! And this?', thing: 'cat', me: 'わたしの ねこ です。', meEn: 'My cat.', no: ['わたしの いぬ です。', 'わたしの とり です。'], ask: 'Your turn.' },
      { dog: 'またね！', dogEn: 'See you!', me: 'さようなら！', meEn: 'Goodbye!', no: ['おはよう！', 'いただきます！'], ask: 'Your turn.' }],
    card: [['これは なん ですか？', 'What is this?', 'これは わたしの ＿ です。', 'This is my ___. (a book, toy, cup…)'], ['これは だれ ですか？', 'Who is this? (point at a photo)', 'わたしの おかあさん です。', 'My mum. (or おとうさん, dad)'], ['かわいい！', 'Cute!', 'ありがとう！', 'Thank you!']],
    tip: 'Point at things and people around the house, or at family photos. Let your child answer with これは わたしの … です. Then they point and ask you.' },

  /* the zoo (Tony, 28 October: "build the zoo"). Likes and dislikes, with the animal words she already knows from the line (ぞう さる くま へび わに うさぎ きつね コアラ; ペンギン is only a picture word on the line, not readable, so it is left out).
     が is used for like and for don't like alike (＿が すき / ＿が すきじゃない), as the plan set out, so there is one pattern to learn; ＿は すきじゃない is also heard in Japan.
     Questions she answers about herself are "any" (every answer right); a line said by someone else (Rin, Kenta) is about them, never a guess at her own taste */
  { id: 'zoo', name: 'The zoo', jp: 'どうぶつえん', icon: 'zebra', scene: 'zoo', pattern: '＿が すき です。', friend: { id: 'momo', name: 'Momo', jp: 'もも', art: 'monkey', what: 'a little monkey at the zoo' },
    teaches: 'Saying what you like and do not like, and asking what others like.',
    /* 1 watch: Kenta takes her round the zoo */
    watch: [['dog', 'どうぶつえん です！ みて、ぞう！', 'The zoo! Look, an elephant!', 'elephant'], ['me', 'わあ！ ぞうが すき です。', 'Wow! I like elephants.', 'elephant'], ['dog', 'へびが すき ですか？', 'Do you like snakes?', 'snake'],
      ['me', 'すきじゃない です。 こわい！', "I don't like them. Scary!", 'snake'], ['dog', 'ぼくは さるが だいすき！', 'I love monkeys!', 'monkey'], ['me', 'わたしも！ かわいい！', 'Me too! So cute!', 'monkey']],
    words: [['すき', 'like', 'red-heart'], ['すきじゃない', "don't like", 'broken-heart'], ['だいすき', 'love', 'smiling-face-with-hearts'], ['こわい', 'scary', 'fearful-face'], ['なにが', 'what', 'red-question-mark'], ['どうぶつえん', 'zoo', 'zebra']],
    /* 2 swap: the animal in the gap, then the word for how you feel */
    swap: [{ frame: '＿が すき です。', img: 'elephant', who: 'elephant', ask: 'I like elephants. Which word fits?', fill: 'ぞう', no: ['へび', 'さる'], en: 'I like elephants.', clue: 'Find the elephant. Read each word, one letter at a time.' },
      { frame: '＿が すき です。', img: 'koala', who: 'koala', ask: 'I like koalas. Which word fits?', fill: 'コアラ', no: ['くま', 'わに'], en: 'I like koalas.', clue: 'Koala has three letters. Read each word.' },
      { frame: 'へびが ＿ です。', img: 'broken-heart', who: "don't like", ask: "I don't like snakes. Which word fits?", fill: 'すきじゃない', no: ['すき', 'だいすき'], en: "I don't like snakes.", clue: 'じゃない on the end means not.' },
      { frame: 'さるが ＿ です！', img: 'smiling-face-with-hearts', who: 'love', ask: 'I love monkeys! Which word fits?', fill: 'だいすき', no: ['すきじゃない', 'こわい'], en: 'I love monkeys!', clue: 'だい in front of すき means a lot.' }],
    /* 3 her own true answers */
    own: [{ dog: 'ぞうが すき ですか？', dogEn: 'Do you like elephants?', thing: 'elephant', ask: 'Do you like elephants? Pick yours.', opts: [['はい、すき です。', 'Yes, I like them.'], ['だいすき です！', 'I love them!'], ['いいえ、すきじゃない です。', "No, I don't like them."]] },
      { dog: 'へびが すき ですか？', dogEn: 'Do you like snakes?', thing: 'snake', ask: 'Do you like snakes? Pick yours.', opts: [['はい、すき です。', 'Yes, I like them.'], ['いいえ、すきじゃない です。', "No, I don't like them."], ['こわい！', 'Scary!']] },
      { dog: 'なにが すき ですか？', dogEn: 'What do you like?', ask: 'Which animal do you like? Pick yours.', opts: [['コアラが すき です。', 'I like koalas.'], ['きつねが すき です。', 'I like foxes.'], ['うさぎが すき です。', 'I like rabbits.']] }],
    /* 4 she asks Kenta, then shows she understood his answer */
    ask: [{ want: 'Ask Kenta what he likes.', q: 'なにが すき ですか？', qEn: 'What do you like?', no: ['これは なん ですか？', 'なんさい ですか？'], clue: 'You want to know what he likes. Listen to each one.',
        ans: 'ぼくは うさぎが すき です。', ansEn: 'I like rabbits.', check: 'What does Kenta like?', pics: [['うさぎ', 'rabbit', 'rabbit'], ['コアラ', 'koala', 'koala'], ['わに', 'crocodile', 'crocodile']] },
      { want: 'Ask Kenta if he likes crocodiles.', thing: 'crocodile', q: 'わにが すき ですか？', qEn: 'Do you like crocodiles?', no: ['くまが すき ですか？', 'なにが すき ですか？'], clue: 'You want to know about crocodiles. Listen to each one.',
        ans: 'いいえ、すきじゃない です。', ansEn: "No, I don't like them.", check: 'Does Kenta like crocodiles?', pics: [['すきじゃない', "doesn't like them", 'broken-heart'], ['すき', 'likes them', 'red-heart'], ['だいすき', 'loves them', 'smiling-face-with-hearts']] }],
    /* 5 at natural speed, no words on screen */
    listen: [{ who: 'dog', t: 'ぼくは くまが すき です。', en: 'I like bears.', ask: 'Kenta talks fast! Which animal does he like?', pics: [['くま', 'bear', 'bear'], ['うさぎ', 'rabbit', 'rabbit'], ['きつね', 'fox', 'fox']] },
      { who: 'fr', t: 'もも です。 わにが こわい！', en: 'I am Momo. Crocodiles are scary!', ask: 'Momo talks fast! Which animal is scary?', pics: [['わに', 'crocodile', 'crocodile'], ['うさぎ', 'rabbit', 'rabbit'], ['コアラ', 'koala', 'koala']] },
      { who: 'dog', t: 'りんは へびが すきじゃない です。', en: 'Rin does not like snakes.', ask: 'Listen. Does Rin like snakes?', pics: [['すきじゃない', "doesn't like them", 'broken-heart'], ['すき', 'likes them', 'red-heart'], ['だいすき', 'loves them', 'smiling-face-with-hearts']] }],
    /* 6 the role-play: the English help fades */
    role: [{ dog: 'みて！ ぞう です！', dogEn: 'Look! An elephant!', thing: 'elephant', me: 'わあ！ かわいい！', meEn: 'Wow! Cute!', no: ['おやすみ。', 'ななさい です。'], ask: 'Kenta shows you an elephant.' },
      { dog: 'ぞうが すき ですか？', dogEn: 'Do you like elephants?', thing: 'elephant', any: [['はい、すき です。', 'Yes, I like them.'], ['だいすき です！', 'I love them!'], ['いいえ、すきじゃない です。', "No, I don't like them."]], ask: 'Your turn.' },
      { dog: 'なにが すき ですか？', dogEn: 'What do you like?', any: [['コアラが すき です。', 'I like koalas.'], ['きつねが すき です。', 'I like foxes.'], ['うさぎが すき です。', 'I like rabbits.']], ask: 'Kenta asks what you like.' },
      { dog: 'これは なん ですか？', dogEn: 'What is this?', thing: 'koala', me: 'コアラ です！', meEn: 'A koala!', no: ['くま です！', 'わに です！'], ask: 'Your turn.' },
      { dog: 'またね！', dogEn: 'See you!', me: 'またね！', meEn: 'See you!', no: ['いただきます！', 'おはよう！'], ask: 'Your turn.' }],
    card: [['なにが すき ですか？', 'What do you like?', '＿が すき です。', 'I like ___. (koalas, rabbits, sushi…)'], ['いぬが すき ですか？', 'Do you like dogs? (try any animal or food)', 'はい、すき です。', 'Yes, I do. (or いいえ、すきじゃない です。 No, I don’t.)'],
      ['へびは こわい？', 'Are snakes scary?', 'こわい！', 'Scary! (or だいすき！ I love them!)']],
    tip: 'Ask about animals, foods and toys, one at a time. Say what you like too. Then let your child ask you: なにが すき ですか？' },

  /* the shop (Tony, 29 October: "build the shop"). Asking for things (＿を ください, met on the line), asking the price (いくら ですか), and prices in yen in tens up to ひゃく (100).
     The tens are built the way the place-value chart builds them: に (two) + じゅう (ten) = にじゅう, twenty. Prices use only tens whose first word matches the counting chant
     (じゅう にじゅう さんじゅう ごじゅう ろくじゅう はちじゅう ひゃく); 40, 70 and 90 are left for later, because prices say よん and なな where the chant says し and しち.
     The prices are pretend prices, all 100 yen or less so she can read every one; a real cake costs more. Yen coins are 1, 5, 10, 50, 100 and 500; the 50 yen coin has a hole, the 10 yen coin is copper (jpArt('coin:50')) */
  { id: 'shop', name: 'The shop', jp: 'おみせ', icon: 'convenience-store', scene: 'shop', pattern: '＿を ください。', friend: { id: 'hana', name: 'Hana', jp: 'はな', art: 'rabbit-face', what: 'a rabbit who shops at Kenta\'s shop' },
    teaches: 'Asking for things in a shop, asking how much, and prices in yen.',
    /* 1 watch: the player shops at Kenta's stall */
    watch: [['dog', 'いらっしゃいませ！', 'Welcome!'], ['me', 'りんごを ください。', 'An apple, please.', 'red-apple'], ['dog', 'はい、どうぞ。', 'Here you are.', 'red-apple'],
      ['me', 'いくら ですか？', 'How much is it?', 'red-apple'], ['dog', 'ごじゅう えん です。', 'It is 50 yen.', 'yen:50'], ['me', 'はい、どうぞ。', 'Here you are.', 'coin:50']],
    words: [['いくら', 'how much', 'label'], ['えん', 'yen', 'coin:100'], ['じゅう', 'ten', 'yen:10'], ['にじゅう', 'twenty', 'yen:20'], ['ごじゅう', 'fifty', 'yen:50'], ['ひゃく', 'one hundred', 'yen:100']],
    /* 2 swap: the thing, the price, the question */
    swap: [{ frame: '＿を ください。', img: 'tangerine', who: 'mandarin', ask: 'A mandarin, please. Which word fits?', fill: 'みかん', no: ['りんご', 'パン'], en: 'A mandarin, please.', clue: 'Find the mandarin. Read each word, one letter at a time.' },
      { frame: '＿ えん です。', img: 'yen:20', who: '20 yen', ask: 'It is 20 yen. Which word fits?', fill: 'にじゅう', no: ['ごじゅう', 'じゅう'], en: 'It is 20 yen.', clue: 'に is two. Two tens make twenty.' },
      { frame: '＿ えん です。', img: 'yen:100', who: '100 yen', ask: 'It is 100 yen. Which word fits?', fill: 'ひゃく', no: ['じゅう', 'はちじゅう'], en: 'It is 100 yen.', clue: 'じゅう is only ten. A hundred is ten tens.' },
      { frame: '＿ ですか？', img: 'label', who: 'how much', ask: 'You want the price. Which word fits?', fill: 'いくら', no: ['なん', 'だれ'], en: 'How much is it?', clue: 'なん asks what. だれ asks who.' }],
    /* 3 her own true answers */
    own: [{ dog: 'いらっしゃいませ！', dogEn: 'Welcome!', ask: 'What would you like? Pick yours.', opts: [['りんごを ください。', 'An apple, please.'], ['アイスを ください。', 'An ice cream, please.'], ['おにぎりを ください。', 'A rice ball, please.']] },
      { dog: 'なにが すき ですか？', dogEn: 'What do you like?', ask: 'Which food do you like? Pick yours.', opts: [['ケーキが すき です。', 'I like cake.'], ['パンが すき です。', 'I like bread.'], ['みかんが すき です。', 'I like mandarins.']] }],
    /* 4 she asks Kenta, then shows she understood his answer */
    ask: [{ want: 'You want the rice ball. Ask the price.', thing: 'rice-ball', q: 'いくら ですか？', qEn: 'How much is it?', no: ['これは なん ですか？', 'なにが すき ですか？'], clue: 'You want to know the price. Listen to each one.',
        ans: 'さんじゅう えん です。', ansEn: 'It is 30 yen.', check: 'How much is the rice ball?', pics: [['さんじゅう', '30 yen', 'yen:30'], ['ごじゅう', '50 yen', 'yen:50'], ['ひゃく', '100 yen', 'yen:100']] },
      { want: 'You want the cake. Ask Kenta for it.', thing: 'shortcake', q: 'ケーキを ください。', qEn: 'A cake, please.', no: ['ケーキが すき です。', 'いくら ですか？'], clue: 'You want him to give it to you. Listen to each one.',
        ans: 'はい、どうぞ。 ひゃく えん です。', ansEn: 'Here you are. 100 yen.', check: 'How much is the cake?', pics: [['ひゃく', '100 yen', 'yen:100'], ['じゅう', '10 yen', 'yen:10'], ['はちじゅう', '80 yen', 'yen:80']] }],
    /* 5 at natural speed, no words on screen */
    listen: [{ who: 'dog', t: 'みかんは にじゅう えん です。', en: 'Mandarins are 20 yen.', ask: 'Kenta talks fast! How much is a mandarin?', pics: [['にじゅう', '20 yen', 'yen:20'], ['ろくじゅう', '60 yen', 'yen:60'], ['はちじゅう', '80 yen', 'yen:80']] },
      { who: 'fr', t: 'はな です。 パンを ください！', en: 'I am Hana. Bread, please!', ask: 'Hana talks fast! What does she want?', pics: [['パン', 'bread', 'bread'], ['ケーキ', 'cake', 'shortcake'], ['りんご', 'apple', 'red-apple']] },
      { who: 'dog', t: 'ジュースは ごじゅう えん です。', en: 'Juice is 50 yen.', ask: 'Listen. How much is the juice?', pics: [['ごじゅう', '50 yen', 'yen:50'], ['じゅう', '10 yen', 'yen:10'], ['さんじゅう', '30 yen', 'yen:30']] }],
    /* 6 the role-play: the English help fades */
    role: [{ dog: 'いらっしゃいませ！', dogEn: 'Welcome!', any: [['りんごを ください。', 'An apple, please.'], ['アイスを ください。', 'An ice cream, please.'], ['ジュースを ください。', 'A juice, please.']], ask: 'You are at Kenta\'s shop. Ask for something.' },
      { dog: 'はい、どうぞ。', dogEn: 'Here you are.', me: 'いくら ですか？', meEn: 'How much is it?', no: ['これは だれ ですか？', 'おやすみ。'], ask: 'He gives it to you. What do you ask?' },
      { dog: 'ごじゅう えん です。', dogEn: 'It is 50 yen.', thing: 'coin:50', me: 'はい、どうぞ。', meEn: 'Here you are.', no: ['いただきます！', 'ななさい です。'], ask: 'Your turn.' },
      { dog: 'ありがとう ございます！', dogEn: 'Thank you very much!', me: 'ありがとう！', meEn: 'Thank you!', no: ['いらっしゃいませ！', 'おはよう！'], ask: 'Your turn.' },
      { dog: 'またね！', dogEn: 'See you!', me: 'さようなら！', meEn: 'Goodbye!', no: ['いらっしゃいませ！', 'いただきます！'], ask: 'Your turn.' }],
    card: [['いらっしゃいませ！', 'Welcome! (you are the shopkeeper)', '＿を ください。', '___, please. (fruit, a snack, a toy)'], ['いくら ですか？', 'How much is it?', 'ごじゅう えん です。', 'It is 50 yen. (try じゅう 10, にじゅう 20 … ひゃく 100)'],
      ['はい、どうぞ。', 'Here you are.', 'ありがとう！', 'Thank you!']],
    tip: 'Play shop with real things and coins. Take turns being the shopkeeper. Count the tens together: じゅう, にじゅう, さんじゅう … ひゃく.' },
  /* the other four places: planned in the plan document, shown on the map as coming soon */
  { id: 'school', name: 'School', jp: 'がっこう', icon: 'school', soon: true, pattern: '＿は どこ ですか？' },
  { id: 'weather', name: 'Weather', jp: 'てんき', icon: 'sun-behind-cloud', soon: true, pattern: 'きょうは ＿ です。' },
  { id: 'food', name: 'Food', jp: 'たべもの', icon: 'fork-and-knife-with-plate', soon: true, pattern: '＿を たべます' },
  { id: 'feel', name: 'Feelings', jp: 'きもち', icon: 'smiling-face-with-smiling-eyes', soon: true, pattern: '＿です' }
];
const TOWN_STEPS = [{ k: 'watch', icon: 'clapper-board', label: 'Watch' }, { k: 'swap', icon: 'puzzle-piece', label: 'Fill the gap' }, { k: 'own', icon: 'speaking-head', label: 'Your answer' },
  { k: 'ask', icon: 'red-question-mark', label: 'Ask Kenta' }, { k: 'listen', icon: 'ear', label: 'Listen fast' }, { k: 'role', icon: 'performing-arts', label: 'Role-play' }];
const townState = () => { const st = jpState(); if (!st.town || typeof st.town !== 'object') st.town = { done: {} }; if (!st.town.done) st.town.done = {}; return st.town; };
const townDone = id => townState().done[id] || 0;
/* a place opens when the one before it is finished; the park opens with the town */
const townOpen = i => !TOWN[i].soon && (i === 0 || townDone(TOWN[i - 1].id) >= TOWN_STEPS.length);
const townFill = t => jpFill(t).replace('{en}', S.name || 'Explorer');
const townFriend = P => P.friend.art === 'cat' || P.friend.art === 'dog-face' ? art(P.friend.art) : jpArt(P.friend.art);
/* the place she is on: the first one not finished, else the last one built */
const townNow = () => { const built = TOWN.filter(p => !p.soon); return built.find(p => townDone(p.id) < TOWN_STEPS.length) || built[built.length - 1]; };

/* ---- the town map: eight places along two streets, each a button. A finished place carries its sticker and its friend ---- */
function townMap(pick) {
  const tall = innerHeight > innerWidth, VW = tall ? 500 : 1000, VH = tall ? 760 : 520;
  const P = tall ? [[130, 120], [370, 120], [130, 300], [370, 300], [130, 480], [370, 480], [130, 660], [370, 660]] : [[120, 150], [370, 120], [620, 150], [870, 120], [120, 390], [370, 360], [620, 390], [870, 360]];
  const road = tall ? '<path d="M250 40V740" stroke="#B9BDCB" stroke-width="44" stroke-linecap="round"/><path d="M250 40V740" stroke="#fff" stroke-width="4" stroke-dasharray="16 16"/><path d="M40 210H460M40 390H460M40 570H460" stroke="#B9BDCB" stroke-width="30" stroke-linecap="round"/>'
    : '<path d="M40 260H960" stroke="#B9BDCB" stroke-width="46" stroke-linecap="round"/><path d="M40 260H960" stroke="#fff" stroke-width="4" stroke-dasharray="18 18"/><path d="M245 60V480M495 60V480M745 60V480" stroke="#B9BDCB" stroke-width="30" stroke-linecap="round"/>';
  const box = h('div', { class: 'tw-map' + (tall ? ' tall' : ''), style: { '--ar': (VW / VH).toFixed(4) }, html: '<svg viewBox="0 0 ' + VW + ' ' + VH + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="' + VW + '" height="' + VH + '" rx="28" fill="#CDEBC0"/>' + road +
    [[0.08, 0.06], [0.93, 0.08], [0.06, 0.94], [0.95, 0.92], [0.5, 0.02]].map(([x, y], i) => '<g class="tw-tree" style="--d:' + (i * .5) + 's"><circle cx="' + (x * VW) + '" cy="' + (y * VH + 18) + '" r="16" fill="#7CC36E"/><circle cx="' + (x * VW + 12) + '" cy="' + (y * VH + 10) + '" r="12" fill="#8FD67A"/></g>').join('') + '</svg>' });
  TOWN.forEach((p, i) => { const [x, y] = P[i], open = townOpen(i), done = townDone(p.id) >= TOWN_STEPS.length, now = open && !done;
    const b = h('button', { class: 'tw-place' + (p.soon ? ' soon' : '') + (done ? ' done' : '') + (now ? ' now' : '') + (!open ? ' lock' : ''), 'data-k': 'place-' + p.id, 'aria-label': p.name, style: { left: (x / VW * 100) + '%', top: (y / VH * 100) + '%' } },
      h('div', { class: 'tw-sign' }, art(p.icon)), h('b', { class: 'tw-name' }, p.name), p.soon ? h('small', { class: 'tw-soon' }, 'Coming soon') : jpEl(p.jp, 'tw-jp'),
      done ? h('div', { class: 'tw-sticker' }, ic('glowing-star')) : null, done && p.friend ? h('div', { class: 'tw-friend' }, townFriend(p)) : null);
    b.addEventListener('click', () => { if (!open) { sfx.soft(); const s = b.firstChild; s.classList.remove('wobble'); void s.offsetWidth; s.classList.add('wobble');
        Speech.say(p.soon ? p.name + ' is coming soon.' : 'Finish ' + TOWN[i - 1].name.toLowerCase() + ' first. Then this place opens.'); return; } sfx.pop(); pick(p); });
    box.append(b); });
  return box;
}
async function townHome(ui) {
  for (;;) {
    const P0 = townNow(), all = TOWN.filter(p => !p.soon).every(p => townDone(p.id) >= TOWN_STEPS.length), friends = TOWN.filter(p => p.friend && townDone(p.id) >= TOWN_STEPS.length);
    const run = await labMenu(ui, res => h('div', { class: 'tw-home' }, townMap(p => res(() => townPlace(ui, p))),
        h('div', { class: 'tw-bar' }, h('b', null, "Kenta's Town"), friends.length ? h('span', { class: 'tw-friends' }, h('small', null, 'Friends:'), friends.map(p => h('span', { class: 'tw-fr', title: p.friend.name }, townFriend(p)))) : null)),
      [{ k: 'back', label: 'Back to the line', run: 'exit' }],
      all ? 'Every open place is done! More places soon.' : 'Tap ' + P0.name.toLowerCase() + ' to go on.', all ? "You have finished every place that is open in Kenta's Town. More places are coming soon. You can play any place again." : "Welcome to Kenta's Town! Each place teaches you a new way to talk. Tap " + P0.name.toLowerCase() + ' to go on.');
    ui.check(); if (run === 'exit') return; await run(); ui.check();
  }
}
/* a place: its six steps, done in order, saved after each. A finished place can be played again, any step */
function townMenu(ui, P) {
  return new Promise(res => {
    const done = townDone(P.id); ui.wide(true); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const row = h('div', { class: 'jp-stops tw-steps' });
    TOWN_STEPS.forEach((s, i) => { const lock = i > done && done < TOWN_STEPS.length, cls = i < done ? ' done' : i === done ? ' now' : '';
      row.append(h('button', { class: 'jp-stop' + cls + (lock ? ' lock' : ''), 'data-k': i === done ? 'next' : s.k, onclick: () => { if (lock) { sfx.soft(); Speech.say('Do the steps in order.'); return; } sfx.pop(); res(i); } },
        h('i', { class: 'jp-stopn' }, i < done ? ic('check-mark-button') : String(i + 1)), art(lock ? 'locked' : s.icon), h('span', null, s.label))); });
    const back = h('button', { class: 'btn quiet lb-b', 'data-k': 'back', onclick: () => { sfx.tap(); res(-1); } }, 'Back');
    ui.stage.append(h('div', { class: 'elx lb jp-station tw-station' }, h('div', { class: 'jp-sthead' }, h('div', { class: 'jp-board big tw-board' }, art(P.icon)), h('b', null, P.name + ': ', jpEl(P.pattern))), row, h('div', { class: 'lb-row' }, back)));
    const nx = TOWN_STEPS[Math.min(done, TOWN_STEPS.length - 1)];
    ui.prompt(done >= TOWN_STEPS.length ? 'All done! Play any step again.' : 'Next: ' + nx.label.toLowerCase() + '.', done >= TOWN_STEPS.length ? P.name + ' is done. Play any step again, any time.' : P.name + '. ' + P.teaches + ' Next: ' + nx.label.toLowerCase() + '.');
    W.cur = { type: 'labmenu', pick: k => { const b = $('.jp-stop[data-k="' + k + '"], .lb-b[data-k="' + k + '"]', ui.stage); if (b) b.click(); return !!b; } };
  });
}
async function townPlace(ui, P) {
  for (;;) { const i = await townMenu(ui, P); ui.check(); if (i < 0) return; await townRunStep(ui, P, i); ui.check(); }
}
const TOWN_RUN = { watch: townWatch, swap: townSwap, own: townOwn, ask: townAsk, listen: townListen, role: townRole };
async function townRunStep(ui, P, i) {
  const s = TOWN_STEPS[i], T = townState(), first = (T.done[P.id] || 0) <= i;
  jpScore(ui, { watch: P.watch.length + 1, swap: P.swap.length, own: P.own.length, ask: P.ask.length * 2, listen: P.listen.length, role: P.role.length }[s.k]);
  await TOWN_RUN[s.k](ui, P); ui.check();
  if ((T.done[P.id] || 0) <= i) T.done[P.id] = i + 1; jpState().day = jpToday(); saveState(); addStars(1);
  ui.wide(true); ui.clear(); sfx.great(); kiwiMood(ui.root, 'cheer'); ui.steps(JPS.total, JPS.total);
  const newDay = jpStreak(), stk = jpState().streak || 1;
  ui.stage.append(h('div', { class: 'jp-prize jp-summary' }, art(s.icon, 'hero sticker'), h('div', { class: 'bigtext' }, s.label + ': done!'),
    h('div', { class: 'jp-sumrow' }, JPS.asked ? h('span', null, ic('check-mark-button'), JPS.first + ' of ' + JPS.asked + ' right first time') : null, JPS.fixed ? h('span', { class: 'jp-fixed' }, ic('flexed-biceps'), JPS.fixed + ' tricky ' + (JPS.fixed === 1 ? 'one' : 'ones') + ' now right') : null, JPS.left ? h('span', null, ic('repeat-button'), JPS.left + ' to practise next time') : null, JPS.best >= 3 ? h('span', null, ic('sparkles'), 'Best: ' + JPS.best + ' in a row') : null, h('span', null, ic('star'), '+1 star')),
    newDay ? h('div', { class: 'jp-streak big' }, Array.from({ length: Math.min(stk, 7) }, () => ic('red-paper-lantern')), h('b', null, stk === 1 ? 'Day 1. Come back tomorrow!' : stk + ' days in a row!')) : null));
  await jpHold(ui.prompt('Step done! A star for you.', 'That step is done. Here is a star.' + (newDay && stk > 1 ? ' And that is ' + stk + ' days in a row!' : '')), 1200, 3800); ui.check();
  await ui.next('Next', ui.stage.firstChild); ui.check();
  if (first && i === TOWN_STEPS.length - 1) await townPrize(ui, P);
}
/* a finished place: its sticker on the town map, a new friend, three stars, and the talk card for the family */
async function townPrize(ui, P) {
  ui.wide(true); ui.clear(); confetti(40); sfx.great(); addStars(3); saveState();
  ui.stage.append(h('div', { class: 'jp-prize tw-prize' }, h('div', { class: 'tw-sticker big' }, art(P.icon)), h('div', { class: 'bigtext' }, P.name + ': sticker!')));
  await jpHold(ui.prompt(P.name + ' is done! A sticker for your town map.', P.name + ' is done! Here is its sticker for your town map, and three stars.'), 2600, 5000); ui.check();
  ui.stage.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-prize tw-prize' }, h('div', { class: 'tw-newfr' }, townFriend(P)), h('div', { class: 'bigtext' }, P.friend.name + ' is your friend!')));
  await jpHold(ui.prompt('A new friend: ' + P.friend.name + '!', 'You made a new friend: ' + P.friend.name + ', ' + P.friend.what + '. Your friends live on the town map.'), 2600, 5000); ui.check();
  await Promise.race([ui.prompt('A talk card for your family is ready.', 'There is a talk card for your family on the grown-ups page, with three things to say in Japanese together this week.'), wait(5000)]); ui.check();
  await ui.next('Hooray!', ui.stage.firstChild); ui.check();
}

/* ---- STEP 1, watch: the dialogue line by line, Japanese then English, then the new words on cards ---- */
async function townWatch(ui, P) {
  const left = P.watchLeft ? townFriend(P) : null, sc = jpScene(P.scene, { left }); ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  ui.stage.append(h('div', { class: 'jp-talk' }, sc.box));
  const obj = h('div', { class: 'jp-obj tw-obj', style: { '--x': '50%', '--y': '62%' } }); sc.props.append(obj);
  const play = async () => { for (const [who, t, en, thing] of P.watch) { if (!ui.alive) return;
    obj.innerHTML = ''; if (thing) obj.append(thing === 'rin' ? art('dog-face') : jpArt(thing));   /* jpArt: an icon, or a price tag ('yen:50') */
    await sc.say(who === 'dog' ? 'dog' : 'me', townFill(t), en, ui, true); await ui.wait(W.fast ? 5 : 450);
    if (JPS.ui === ui) { JPS.done = Math.min(JPS.total, JPS.done + 1); ui.steps(JPS.total, JPS.done); } } };
  await Promise.race([ui.prompt('Watch and listen. Tap a bubble to hear it again.', 'Watch, and listen. You can tap a speech bubble to hear it again.'), wait(2600)]); ui.check();
  W.cur = null; await play(); ui.check();
  /* watch it again as often as she likes, then go on */
  await new Promise(res => { ui.answer.innerHTML = ''; const again = h('button', { class: 'btn quiet', 'data-k': 'again', onclick: async () => { sfx.tap(); again.disabled = true; JPS.done = 0; await play(); again.disabled = false; } }, ic('repeat-button'), 'Watch again');
    const go = h('button', { class: 'btn go', 'data-k': 'go', onclick: () => { sfx.pop(); res(); } }, 'Got it!'); ui.answer.append(h('div', { class: 'row wrow' }, again, go));
    ui.prompt('Watch again, or go on.', 'Watch again, or go on.'); W.cur = { type: 'btn', auto: () => go.click() }; }); ui.check();
  await jpWordCards(ui, P.words, 'New words! Tap each card to hear it.', 'Here are the new words from that talk. Tap each card to hear it in Japanese and English. Then say it yourself.'); ui.check();
  JPS.done = JPS.total; ui.steps(JPS.total, JPS.total);
}

/* ---- STEP 2, fill the gap: the pattern with a gap; she taps the word that fits the picture. The whole sentence is then said, and its English shown ---- */
function townFrame(frame, fill) { const [a, b] = frame.split('＿'); return h('div', { class: 'tw-frame' }, a ? jpEl(a.trim()) : null, h('span', { class: 'tw-gap' + (fill ? ' full' : '') }, fill ? jpEl(fill) : '?'), b ? jpEl(b.trim()) : null); }
const townWhole = it => it.frame.replace('＿', it.fill);
/* a clue with Japanese in it, said with each Japanese word in the Japanese voice (never kana handed to the English voice) */
const townMix = str => String(str).split(/([\u3040-\u30ff][\u3040-\u30ff、 ]*)/).filter(x => x && x.trim()).map(x => /[\u3040-\u30ff]/.test(x) ? JPV(x.trim()) : x);
async function townSwapOne(ui, it) {
  ui.wide(false);
  const top = h('div', { class: 'tw-swapq' }, h('span', { class: 'jp-pic big' }, jpArt(it.img), h('small', { class: 'jp-en' }, it.who)), townFrame(it.frame));
  const opts = shuffle([it.fill].concat(it.no)).map(x => ({ el: jpEl(x, 'jp-w'), ok: x === it.fill }));
  const ok = await jpAsk(ui, { word: [townWhole(it)], top, opts, text: it.ask, say: it.ask, clue: m => ({ text: m === 1 ? it.clue : 'Read each word. Which one fits?', say: m === 1 ? townMix(it.clue) : 'Read each word, one letter at a time. Which one fits?' }) }); ui.check();
  /* the sentence, whole */
  ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  ui.stage.append(h('div', { class: 'jp-done-card tw-whole' }, h('span', { class: 'jp-pic big' }, jpArt(it.img)), townFrame(it.frame, it.fill), h('b', { class: 'jp-done-en' }, it.en)));
  await Promise.race([Speech.say([JPV(townWhole(it)), it.en]), wait(4500)]); ui.check(); await ui.wait(W.fast ? 5 : 600);
  return ok;
}
/* the whole sentences on cards, to hear again (practising the ones she missed) */
const townSentCards = (ui, list) => jpWordCards(ui, list.map(it => [townWhole(it), it.en, it.img]), list.length === 1 ? 'Tap the card to hear it again.' : 'Tap each card to hear it again.', 'Listen to ' + (list.length === 1 ? 'this sentence' : 'these sentences') + ' again, in Japanese and English.');
async function townSwap(ui, P) {
  await Promise.race([ui.prompt('Fill the gap! Pick the word that fits.', ['This is how the sentence works.', JPV(P.pattern.replace('＿', '').replace(/\s+/g, ' ')), 'Pick the word that fits the gap.']), wait(5200)]); ui.check();
  const missed = []; for (const it of P.swap) { if (!await townSwapOne(ui, it)) missed.push(it); ui.check(); }
  await jpMaster(ui, missed, l => townSentCards(ui, l), it => townSwapOne(ui, it), it => townWhole(it));
}

/* ---- STEP 3, her own answer: Kenta asks; every choice is right; she picks her own true answer, her explorer says it, then she says it aloud ---- */
async function townOwn(ui, P) {
  for (const o of P.own) {
    await jpTalkOne(ui, { scene: P.scene, any: true, thing: o.thing, dog: o.dog, dogEn: o.dogEn, ask: o.ask, clue: o.ask, opts: o.opts.map(x => [townFill(x[0]), townFill(x[1])]) }, false); ui.check();
  }
}

/* ---- the reply buttons of a conversation: each with a speaker to hear it. lvl: how much English help (0 full, 1 faint, 2 none). Resolves { o, miss } ---- */
/* the English for a Japanese line, from everything the line and the town say, so a wrong reply can carry its English as well as the right one */
let TOWN_EN = null;
function townEn(t) {
  if (!TOWN_EN) { TOWN_EN = {}; const put = (j, e) => { if (j && e && !TOWN_EN[townFill(j)]) TOWN_EN[townFill(j)] = townFill(e); };
    JP_ST.forEach(st => st.talk.forEach(x => { put(x.dog, x.dogEn); put(x.me, x.meEn); put(x.after, x.afterEn); (x.opts || []).forEach(o => put(o[0], o[1])); }));
    TOWN.filter(p => !p.soon).forEach(P => { P.watch.forEach(l => put(l[1], l[2])); P.own.forEach(o => { put(o.dog, o.dogEn); o.opts.forEach(x => put(x[0], x[1])); });
      P.ask.forEach(it => { put(it.q, it.qEn); put(it.ans, it.ansEn); }); P.listen.forEach(it => put(it.t, it.en)); P.role.forEach(x => { put(x.dog, x.dogEn); put(x.me, x.meEn); (x.any || []).forEach(o => put(o[0], o[1])); }); });
    [['わたしは けんた です。', 'I am Kenta.'], ['わたしの ほん です。', 'My book.'], ['わたしの いぬ です。', 'My dog.'], ['わたしの とり です。', 'My bird.'], ['わたしの ねこ です。', 'My cat.'], ['くま です！', 'A bear!'], ['わに です！', 'A crocodile!']].forEach(x => put(x[0], x[1])); }
  return TOWN_EN[townFill(t)] || '';
}
function townReplies(ui, opts, text, clue, item, lvl) {
  return new Promise(res => {
    opts.forEach(o => { if (!o.en) o.en = townEn(o.t); });
    if (!opts.every(o => o.en)) lvl = 2;   /* English under every reply or under none: English only under the right one would give it away */
    const row = h('div', { class: 'jp-says tw-says' + (lvl ? ' fade' + lvl : '') }); ui.answer.innerHTML = ''; ui.answer.append(row); let miss = 0;
    const btns = opts.map((o, i) => { const b = h('div', { class: 'jp-sayb' }, h('button', { class: 'jp-hearb', 'aria-label': 'Hear it', onclick: () => { sfx.tap(); jpSay(o.t, { pitch: 1.25 }); } }, ic('speaker-high-volume')),
      h('button', { class: 'jp-opt jp-reply', 'data-i': i, onclick: () => choose(i) }, jpEl(o.t), o.en && lvl < 2 ? h('small', { class: 'tw-en' }, o.en) : null)); row.append(b); return b; });
    const ans = opts.findIndex(o => o.ok);
    const hook = () => { W.cur = { type: 'choice', answer: ans, n: opts.length, item, mode: JPS.mode, give: i => { const b = $('.jp-reply', btns[i]); if (b.disabled) return choose(ans); choose(i); } }; };
    const choose = async i => { const b = $('.jp-reply', btns[i]); if (b.disabled) return; W.cur = null;
      if (opts[i].ok) { sfx.pop(); b.classList.add('ok'); jpTick(miss === 0); return res({ o: opts[i], miss }); }
      miss++; sfx.soft(); b.disabled = true; btns[i].classList.add('gone'); await Promise.race([ui.prompt(clue, clue + ' Tap the speakers to hear each one.'), wait(3800)]); if (ui.alive) hook(); };
    ui.prompt(text, text + ' Tap a speaker to hear each one.'); hook();
  });
}

/* ---- STEP 4, ask Kenta: she picks the question that asks what she wants to know, her explorer asks it, Kenta answers, and she shows what he said ---- */
async function townAskOne(ui, P, it) {
  const sc = jpScene(P.scene); ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  if (it.thing) sc.props.append(h('div', { class: 'jp-obj', style: { '--x': '48%', '--y': '60%' } }, art(it.thing)));   /* in the open between the two, never over Kenta's face (the cake did, 29 October) */
  ui.stage.append(h('div', { class: 'jp-talk' }, sc.box));
  const opts = shuffle([{ t: it.q, en: it.qEn, ok: true }].concat(it.no.map(x => ({ t: x, ok: false }))));
  const r = await townReplies(ui, opts, it.want, it.clue, 'Q:' + it.q, 2); ui.check(); ui.answer.innerHTML = '';   /* no English: which Japanese question asks what she wants to know is the point */
  await sc.say('me', it.q, it.qEn, ui); await ui.wait(W.fast ? 5 : 300);
  await sc.say('dog', it.ans, '', ui); sc.dog.classList.add('happy'); await ui.wait(W.fast ? 5 : 300);
  /* did she understand his answer? His words stay in the bubble; tap it to hear again */
  const play = h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); jpSay(it.ans); } }, ic('speaker-high-volume'));
  const ok2 = await jpAsk(ui, { word: ['A:' + it.ans], top: h('div', { class: 'tw-check' }, h('div', { class: 'jp-sayline' }, jpEl(it.ans)), play), opts: shuffle(it.pics.slice()).map(x => ({ el: jpPic(x), ok: x === it.pics[0] })),
    text: it.check, say: [it.check, JPV(it.ans)], clue: () => ({ text: 'Listen to Kenta again.', say: ['Listen to Kenta again.', JPV(it.ans)] }) }); ui.check();
  ui.stage.innerHTML = ''; ui.answer.innerHTML = ''; ui.stage.append(h('div', { class: 'jp-done-card' }, jpPic(it.pics[0], 'big'), jpEl(it.ans, 'tw-sent'), h('b', { class: 'jp-done-en' }, it.ansEn)));
  await Promise.race([Speech.say([JPV(it.ans), it.ansEn]), wait(4200)]); ui.check(); await ui.wait(W.fast ? 5 : 500);
  return r.miss === 0 && ok2;
}
async function townAsk(ui, P) {
  const missed = []; for (const it of P.ask) { if (!await townAskOne(ui, P, it)) missed.push(it); ui.check(); }
  await jpMaster(ui, missed, async () => {}, it => townAskOne(ui, P, it), it => 'Q:' + it.q);
}

/* ---- STEP 5, listen fast: Kenta (or the friend) at natural speed, no words on screen. She picks the picture; then the words and English are shown ---- */
async function townListenOne(ui, P, it) {
  ui.wide(false); ui.help(false);
  const say = () => Speech.say([JPV(it.t)], { rate: 1 });   /* natural speed: the rate a Japanese voice speaks to an adult */
  const who = it.who === 'dog' ? jpArt('kenta') : it.who === 'me' ? jpArt('me') : townFriend(P);
  const play = h('button', { class: 'jp-play', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); say(); } }, ic('speaker-high-volume'));
  const top = h('div', { class: 'jp-hear tw-hear' }, h('span', { class: 'tw-who' }, who), play);
  const fast = Object.assign(JPV(it.t), { rate: 1 });
  const ok = await jpAsk(ui, { word: ['H:' + it.t], top, opts: shuffle(it.pics.slice()).map(x => ({ el: jpPic(x), ok: x === it.pics[0] })), text: it.ask, say: [it.ask, fast],
    clue: m => ({ text: m === 1 ? 'Listen again. Listen for the word you know.' : 'Listen again, as many times as you like.', say: ['Listen again.', fast] }) }); ui.check();
  ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
  ui.stage.append(h('div', { class: 'jp-done-card' }, jpPic(it.pics[0], 'big'), jpEl(it.t, 'tw-sent'), h('b', { class: 'jp-done-en' }, it.en)));
  await Promise.race([Speech.say([JPV(it.t), it.en], { rate: 1 }), wait(4500)]); ui.check(); await ui.wait(W.fast ? 5 : 500);
  return ok;
}
async function townListen(ui, P) {
  await Promise.race([ui.prompt('Listen fast! No words this time.', 'Now Kenta talks at normal speed, like a real conversation. There are no words to read. Listen for the words you know.'), wait(5000)]); ui.check();
  const missed = []; for (const it of P.listen) { if (!await townListenOne(ui, P, it)) missed.push(it); ui.check(); }
  await jpMaster(ui, missed, async () => {}, it => townListenOne(ui, P, it), it => 'H:' + it.t);
}

/* ---- STEP 6, role-play: five turns in one scene. The English help fades: under every line for two turns, faint for two, then gone ---- */
async function townRoleTurn(ui, P, sc, t, i, obj) {
  const lvl = i < 2 ? 0 : i < 4 ? 1 : 2;
  obj.innerHTML = ''; if (t.thing) obj.append(jpArt(t.thing));
  sc.myBub.classList.remove('on'); sc.dogBub.classList.toggle('faint', lvl === 1); sc.myBub.classList.toggle('faint', lvl === 1);
  await sc.say('dog', t.dog, lvl < 2 ? t.dogEn : '', ui);
  const opts = t.any ? t.any.map(o => ({ t: townFill(o[0]), en: o[1], ok: true })) : shuffle([{ t: townFill(t.me), en: townFill(t.meEn), ok: true }].concat(t.no.map(x => ({ t: townFill(x), ok: false }))));
  const r = await townReplies(ui, opts, lvl ? t.ask : t.ask + ' What do you say?', 'Listen to Kenta again. What did he say?', 'R:' + t.dog, lvl); ui.check(); ui.answer.innerHTML = '';
  await sc.say('me', r.o.t, lvl < 2 ? r.o.en : '', ui); await ui.wait(W.fast ? 5 : 400);
  return r.miss === 0;
}
async function townRole(ui, P) {
  const run = async (list, start) => { const sc = jpScene(P.scene); ui.wide(false); ui.help(false); ui.stage.innerHTML = ''; ui.answer.innerHTML = '';
    const obj = h('div', { class: 'jp-obj', style: { '--x': '50%', '--y': '60%' } }); sc.props.append(obj); ui.stage.append(h('div', { class: 'jp-talk' }, sc.box));
    const miss = []; for (let i = 0; i < list.length; i++) { if (!await townRoleTurn(ui, P, sc, list[i], start == null ? i : start, obj)) miss.push(list[i]); ui.check(); } sc.dog.classList.add('happy'); return miss; };
  await Promise.race([ui.prompt('Role-play with Kenta! The English slowly goes away.', 'Now a real conversation with Kenta. At first the English is there to help. Then it slowly goes away.'), wait(5000)]); ui.check();
  const missed = await run(P.role); ui.check();
  await jpMaster(ui, missed, async () => {}, async t => (await run([t], 0)).length === 0, t => 'R:' + t.dog);
  /* the last line, said aloud */
  const last = P.role[P.role.length - 1]; await jpSayIt(ui, townFill(last.me || last.any[0][0]), townFill(last.meEn || last.any[0][1]), { pitch: 1.25 }); ui.check();
}

/* ---- for the grown-ups page: this week's talk card, and every line of the town for a family member to record ---- */
const townCard = () => { const P = townNow(); return { P, rows: P.card.map(r => r.map(x => townFill(x))), tip: P.tip }; };
const townCardText = () => { const c = townCard(); return "Japanese talk card for this week (Kenta's Town: " + c.P.name.toLowerCase() + ')\n' + c.P.teaches + '\n\n' +
  c.rows.map(r => r[0] + '  (' + jpRom(r[0]) + ')  ' + r[1] + '\n  → ' + r[2] + '  (' + jpRom(r[2].replace('＿', '')) + ')  ' + r[3]).join('\n\n') + '\n\n' + c.tip; };
function townLines(P) {
  const out = [], add = (t, en) => { t = townFill(t); if (t && !t.includes('＿') && !out.some(x => x[0] === t)) out.push([t, en || '']); };
  P.watch.forEach(l => add(l[1], l[2])); P.words.forEach(w => add(w[0], w[1])); P.swap.forEach(it => add(townWhole(it), it.en));
  P.own.forEach(o => { add(o.dog, o.dogEn); o.opts.forEach(x => add(x[0], townFill(x[1]))); });
  P.ask.forEach(it => { add(it.q, it.qEn); add(it.ans, it.ansEn); it.no.forEach(x => add(x)); }); P.listen.forEach(it => add(it.t, it.en));
  P.role.forEach(t => { add(t.dog, t.dogEn); if (t.me) add(t.me, townFill(t.meEn)); (t.any || []).forEach(x => add(x[0], x[1])); (t.no || []).forEach(x => add(x)); });
  return out;
}
W.town = { townEn, TOWN, TOWN_STEPS, townState, townDone, townOpen, townNow, townCard, townCardText, townLines, townFill, townWhole };
/* for the close-up tests: open a Japanese screen and run one piece of it (t_kata.py, t_town.py) */
W.jpTry = run => { const ui = makeUI(() => go('map'), 'japan'); show(ui.root); ui.root.classList.add('c-jp'); (async () => { try { await run(ui); } catch (e) { if (e !== ABORT) console.error(e); } })(); return ui; };
W.townRun = { townHome, townPlace, townRunStep, townWatch, townSwap, townOwn, townAsk, townListen, townRole, townPrize };
