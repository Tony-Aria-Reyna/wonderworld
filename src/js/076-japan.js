/* ===== Japan: the third country. Everything here is content, not code.
   (B64, B32 and birdEye, the small drawing helpers, come from the New Zealand file.) ===== */

/* ----- hand-drawn pieces ----- */
const MAG_N = '#E5484D', MAG_S = '#3B7DD8';
/* a bar magnet from x to x + 13: red end is north, blue end is south. flip puts north on the left */
const magBar = (x, y, flip) => '<rect x="' + x + '" y="' + y + '" width="6.500" height="9" fill="' + (flip ? MAG_N : MAG_S) + '"/><rect x="' + (x + 6.5) + '" y="' + y + '" width="6.500" height="9" fill="' + (flip ? MAG_S : MAG_N) + '"/>' +
  '<rect x="' + x + '" y="' + y + '" width="13" height="9" rx="1.200" fill="none" stroke="#1B2A4E" stroke-width="1"/>' +
  '<text x="' + (x + 3.25) + '" y="' + (y + 6.7) + '" font-size="5.600" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#fff">' + (flip ? 'N' : 'S') + '</text>' +
  '<text x="' + (x + 9.75) + '" y="' + (y + 6.7) + '" font-size="5.600" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#fff">' + (flip ? 'S' : 'N') + '</text>';
/* the two ends that meet, drawn large: the end of one magnet on the left, the end of another on the right */
const magEnds = (l, r) => { const col = p => p === 'N' ? MAG_N : MAG_S, other = p => p === 'N' ? MAG_S : MAG_N, T = (x, p) => '<text x="' + x + '" y="19.600" font-size="10" font-weight="700" font-family="Fredoka,sans-serif" text-anchor="middle" fill="#fff">' + p + '</text>';
  return B32('<rect x="1" y="9" width="4.500" height="14" fill="' + other(l) + '"/><rect x="5.500" y="9" width="9.500" height="14" fill="' + col(l) + '"/><rect x="1" y="9" width="14" height="14" rx="1.600" fill="none" stroke="#1B2A4E" stroke-width="1.200"/>' + T(10.2, l) +
    '<rect x="17" y="9" width="9.500" height="14" fill="' + col(r) + '"/><rect x="26.500" y="9" width="4.500" height="14" fill="' + other(r) + '"/><rect x="17" y="9" width="14" height="14" rx="1.600" fill="none" stroke="#1B2A4E" stroke-width="1.200"/>' + T(21.8, r)); };
const NN_ART = magEnds('N', 'N'), NS_ART = magEnds('N', 'S'), SS_ART = magEnds('S', 'S');
const arrowH = (x, y, dir, col) => '<path transform="translate(' + x + ' ' + y + ') scale(' + dir + ' 1)" d="M-6-2.200H1.500V-5.500L7 0 1.500 5.500V2.200H-6z" fill="' + col + '" stroke="#1B2A4E" stroke-width=".9" stroke-linejoin="round"/>';
const PUSH_ART = B32(arrowH(8.5, 16, -1, '#FF7A6B') + arrowH(23.5, 16, 1, '#FF7A6B') + '<path d="M16 8v16" stroke="#1B2A4E" stroke-width="1.400" stroke-dasharray="1.500 2.500" stroke-linecap="round"/>');
const PULL_ART = B32(arrowH(8.5, 16, 1, '#34C17B') + arrowH(23.5, 16, -1, '#34C17B'));
const MAGLEV_ART = B32('<path d="M2 25h28v3H2z" fill="#8E97A8"/><path d="M5 25h4v-2.500H5zM14 25h4v-2.500h-4zM23 25h4v-2.500h-4z" fill="' + MAG_N + '"/>' +
  '<path d="M3 9.500h17q8 0 9.500 7.500v1.500H3z" fill="#fff" stroke="#1B2A4E" stroke-width="1.100" stroke-linejoin="round"/><path d="M3 14.500h26" stroke="#3B7DD8" stroke-width="1.600"/>' +
  '<path d="M6 11h3v2.300H6zM10.500 11h3v2.300h-3zM15 11h3v2.300h-3z" fill="#19A7B8"/><path d="M21 11q4 .3 5.500 2.300H21z" fill="#1B2A4E"/>' +
  '<path d="M6 18.500h4v1.800H6zM15 18.500h4v1.800h-4zM23 18.500h4v1.800h-4z" fill="' + MAG_N + '"/><path d="M8 21.200v1M17 21.200v1M25 21.200v1" stroke="#8B7BEA" stroke-width="1" stroke-linecap="round"/>');
const WHEEL_ART = B32('<path d="M1 27h30" stroke="#5A678A" stroke-width="2.600" stroke-linecap="round"/><path d="M3 6h26v9H3z" fill="#fff" stroke="#1B2A4E" stroke-width="1.100" stroke-linejoin="round"/><path d="M3 11h26" stroke="#3B7DD8" stroke-width="1.600"/>' +
  '<circle cx="10" cy="20" r="5.600" fill="#5A678A" stroke="#1B2A4E" stroke-width="1.100"/><circle cx="10" cy="20" r="2" fill="#E3E6EE"/><circle cx="22" cy="20" r="5.600" fill="#5A678A" stroke="#1B2A4E" stroke-width="1.100"/><circle cx="22" cy="20" r="2" fill="#E3E6EE"/>');
/* three train fronts for the nose test */
const noseTrain = front => '<path d="M2 24h28" stroke="#5A678A" stroke-width="2" stroke-linecap="round"/><path d="' + front + '" fill="#fff" stroke="#1B2A4E" stroke-width="1.200" stroke-linejoin="round"/>';
const NOSE_POINTY = B32(noseTrain('M2 11h10Q24 11 30 21v1.500H2z') + '<path d="M2 17.500h24.500" stroke="#3B7DD8" stroke-width="1.600"/><path d="M13.500 12.800q5 .5 8 4H13.500z" fill="#1B2A4E"/>');
const NOSE_FLAT = B32(noseTrain('M2 9h20v13.500H2z') + '<path d="M2 17.500h20" stroke="#FF7A6B" stroke-width="1.600"/><path d="M15 11h5.500v4.500H15z" fill="#1B2A4E"/><path d="M25 12v8M28 13.500v5" stroke="#8B7BEA" stroke-width="1.400" stroke-linecap="round"/>');
const NOSE_BOX = B32(noseTrain('M2 5h17v17.500H2z') + '<path d="M2 17.500h17" stroke="#34C17B" stroke-width="1.600"/><path d="M11 7.500h6.500V13H11z" fill="#1B2A4E"/><path d="M22 8v12M25.500 10v8M29 12v4" stroke="#8B7BEA" stroke-width="1.400" stroke-linecap="round"/>');
const NOSES_ART = B32('<g transform="translate(1 -5) scale(.66)">' + noseTrain('M2 11h10Q24 11 30 21v1.500H2z') + '<path d="M2 17.500h24.500" stroke="#3B7DD8" stroke-width="1.600"/></g><g transform="translate(10 11) scale(.66)">' + noseTrain('M2 9h20v13.500H2z') + '<path d="M2 17.500h20" stroke="#FF7A6B" stroke-width="1.600"/></g>');
const KINGFISHER = B64('<path d="M24 50v7m-4 1h8M33 50v7m-4 1h8" stroke="#E0703A" stroke-width="2.600" stroke-linecap="round" fill="none"/><path d="M13 44 3 54l11-3z" fill="#1F6FB5"/>' +
  '<ellipse cx="27" cy="38" rx="17" ry="14" fill="#F28C28"/><path d="M11 36c0-10 7-16 17-15 4 6 3 18-4 24-8 1-13-3-13-9z" fill="#1E88C8"/><path d="M15 33q6 5 10 0M14 39q6 4 9 0" stroke="#7CCBEF" stroke-width="1.600" fill="none" stroke-linecap="round"/>' +
  '<circle cx="41" cy="22" r="11" fill="#1E88C8"/><path d="M36 27q5 4 11 1l-1 5q-6 2-10-2z" fill="#fff"/><path d="M50 18.500 63.500 23 50 26z" fill="#2B3A55" stroke="#2B3A55" stroke-width="1" stroke-linejoin="round"/><path d="M44 25q3 1.500 6 .5" stroke="#F28C28" stroke-width="2.400" fill="none" stroke-linecap="round"/>' + birdEye(44, 19.5, 2.2));

/* the Shinkansen, for naming its parts */
const TRAIN_BOARD = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M9 16v64" stroke="#8E97A8" stroke-width="2.200" stroke-linecap="round"/><path d="M2 16h96" stroke="#5A678A" stroke-width="1.300" stroke-linecap="round"/><path d="M9 21h8" stroke="#8E97A8" stroke-width="1.600" stroke-linecap="round"/>' +
  '<path d="M0 81h100" stroke="#5A678A" stroke-width="2.400" stroke-linecap="round"/><path d="M6 84h4M20 84h4M34 84h4M48 84h4M62 84h4M76 84h4M90 84h4" stroke="#B9793F" stroke-width="2.400" stroke-linecap="round"/>' +
  '<g fill="#5A678A" stroke="#1B2A4E" stroke-width=".9"><circle cx="16" cy="76.500" r="4.200"/><circle cx="27" cy="76.500" r="4.200"/><circle cx="58" cy="76.500" r="4.200"/><circle cx="69" cy="76.500" r="4.200"/></g>' +
  '<g fill="#E3E6EE"><circle cx="16" cy="76.500" r="1.400"/><circle cx="27" cy="76.500" r="1.400"/><circle cx="58" cy="76.500" r="1.400"/><circle cx="69" cy="76.500" r="1.400"/></g>' +
  '<path d="M3 45h56Q82 45 96 68v2q0 4-5 4H3z" fill="#fff" stroke="#1B2A4E" stroke-width="1.500" stroke-linejoin="round"/><path d="M3 62h89.500" stroke="#3B7DD8" stroke-width="3"/><path d="M3 65.500h91" stroke="#19A7B8" stroke-width="1.200"/>' +
  '<g fill="#19A7B8"><rect x="8" y="50" width="6" height="6.500" rx="1.200"/><rect x="17" y="50" width="6" height="6.500" rx="1.200"/><rect x="26" y="50" width="6" height="6.500" rx="1.200"/><rect x="35" y="50" width="6" height="6.500" rx="1.200"/><rect x="44" y="50" width="6" height="6.500" rx="1.200"/></g>' +
  '<path d="M55.500 47.500v25" stroke="#C7CCD9" stroke-width="1"/><path d="M61 49q11 .5 17 9H61z" fill="#1B2A4E"/>' +
  '<path d="M28 45l7-13-7-14" fill="none" stroke="#1B2A4E" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.500 17.300h11" stroke="#1B2A4E" stroke-width="2.400" stroke-linecap="round"/><path d="M24 45h9" stroke="#1B2A4E" stroke-width="2.400" stroke-linecap="round"/>' +
  '</svg>';
const TRAIN_PARTS = [
  { id: 'nose', label: 'Nose', x: 91, y: 59, w: 12, fact: { text: 'The long nose slips through the air quietly.' }, hint: { text: 'The nose is the long, pointed front.' } },
  { id: 'panto', label: 'Pantograph', x: 31, y: 30, w: 12, fact: { text: 'The pantograph takes electricity from the wire.' }, hint: { text: 'The pantograph is the folding arm on the roof.' } },
  { id: 'wheels', label: 'Wheels', x: 21.5, y: 77, w: 12, fact: { text: 'Steel wheels roll on smooth steel rails.' }, hint: { text: 'The wheels are down low, on the rails.' } },
  { id: 'cab', label: 'Cab', x: 68, y: 53, w: 12, fact: { text: 'The driver sits in the cab, at the front.' }, hint: { text: 'The cab has the dark window, near the front.' } }
];

/* ----- the scene behind the mission path: Mount Fuji, a pagoda, a torii gate, cherry trees and the bullet train ----- */
const sakura = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-5 0q4-46-3-84h14q-4 40 4 84z" fill="#7A5238"/><path d="M0-52q-26-12-42-34M2-60q20-14 36-36" stroke="#7A5238" stroke-width="7" stroke-linecap="round" fill="none"/>' +
  '<g fill="#F9A8C4"><circle cx="-44" cy="-92" r="30"/><circle cx="40" cy="-100" r="32"/><circle cx="-2" cy="-118" r="38"/><circle cx="-26" cy="-66" r="22"/><circle cx="26" cy="-70" r="22"/></g>' +
  '<g fill="#FFD3E2"><circle cx="-34" cy="-104" r="15"/><circle cx="8" cy="-130" r="17"/><circle cx="46" cy="-108" r="14"/><circle cx="14" cy="-84" r="12"/></g>' +
  '<g fill="#fff" opacity=".9"><circle cx="-52" cy="-84" r="3.500"/><circle cx="-10" cy="-104" r="3.500"/><circle cx="30" cy="-124" r="3.500"/><circle cx="52" cy="-92" r="3.500"/><circle cx="-22" cy="-134" r="3.500"/></g></g>';
const pagodaRoof = (y, w) => '<path d="M' + (-w) + ' ' + y + 'q' + (w * .28) + '-4 ' + (w * .5) + '-16h' + w + 'q' + (w * .22) + ' 12 ' + (w * .5) + ' 16l-6 5H' + (-w + 6) + 'z" fill="#C8372D"/><path d="M' + (-w + 6) + ' ' + (y + 5) + 'h' + (2 * w - 12) + '" stroke="#8E2A22" stroke-width="3"/>';
const JAPAN_SCENE = '<svg class="scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><linearGradient id="jpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CC3EE"/><stop offset=".55" stop-color="#CDEBF8"/><stop offset="1" stop-color="#FFE4EC"/></linearGradient>' +
  '<filter id="jpsh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="#1B2A4E" flood-opacity=".18"/></filter></defs>' +
  '<rect width="1000" height="600" fill="url(#jpsky)"/>' +
  '<circle cx="806" cy="118" r="84" fill="#FFF3DC" opacity=".6"/><circle cx="806" cy="118" r="52" fill="#EF5B50"/>' +
  '<g fill="#fff" opacity=".92"><ellipse cx="150" cy="96" rx="64" ry="17"/><ellipse cx="200" cy="82" rx="42" ry="16"/><ellipse cx="640" cy="64" rx="52" ry="14"/><ellipse cx="930" cy="212" rx="50" ry="13"/></g>' +
  '<path filter="url(#jpsh)" d="M0 372Q110 300 240 336T470 330T760 322T1000 344V600H0z" fill="#A9D7C4"/>' +
  '<g filter="url(#jpsh)"><path d="M214 388Q352 300 410 178q8-18 26-20h44q18 2 26 20Q566 300 704 388z" fill="#6E8FCB"/>' +
  '<path d="M410 178q8-18 26-20h44q18 2 26 20 14 30 34 58l-26-12-16 26-22-28-18 30-20-30-18 26-14-24-28 14q18-28 32-60z" fill="#fff"/></g>' +
  '<path filter="url(#jpsh)" d="M0 404Q210 350 470 398T1000 380V600H0z" fill="#8FD67A"/>' +
  '<g filter="url(#jpsh)" transform="translate(150 404)"><path d="M-26 0h52v-36h-52z" fill="#F7E7C6"/><path d="M-20-36h40v-34h-40z" fill="#F7E7C6"/><path d="M-15-70h30v-30h-30z" fill="#F7E7C6"/><path d="M-6 0h12v-20H-6z" fill="#7A5238"/>' +
  pagodaRoof(-34, 44) + pagodaRoof(-68, 36) + pagodaRoof(-98, 28) + '<path d="M0-114v-26" stroke="#8E2A22" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-142" r="5" fill="#FFC83D"/></g>' +
  '<g filter="url(#jpsh)" transform="translate(868 426)"><path d="M-36 0v-74M36 0v-74" stroke="#D8402F" stroke-width="12" stroke-linecap="round"/><path d="M-52-58h104" stroke="#D8402F" stroke-width="9" stroke-linecap="round"/><path d="M-62-84q62 12 124 0l4-12q-66 12-132 0z" fill="#D8402F"/><path d="M-66-98q66 12 132 0" stroke="#3A2E28" stroke-width="6" fill="none" stroke-linecap="round"/></g>' +
  '<g filter="url(#jpsh)"><path d="M0 468h1000v10H0z" fill="#C7CCD9"/><path d="M60 478v60M220 478v60M380 478v60M540 478v60M700 478v60M860 478v60" stroke="#B4BACB" stroke-width="16"/>' +
  '<path d="M250 428h330q64 0 96 34v6H250z" fill="#fff"/><path d="M250 452h416" stroke="#3B7DD8" stroke-width="7"/><path d="M250 460h424" stroke="#19A7B8" stroke-width="3"/>' +
  '<g fill="#19A7B8"><rect x="266" y="434" width="26" height="12" rx="3"/><rect x="302" y="434" width="26" height="12" rx="3"/><rect x="338" y="434" width="26" height="12" rx="3"/><rect x="374" y="434" width="26" height="12" rx="3"/><rect x="410" y="434" width="26" height="12" rx="3"/><rect x="446" y="434" width="26" height="12" rx="3"/><rect x="482" y="434" width="26" height="12" rx="3"/><rect x="518" y="434" width="26" height="12" rx="3"/></g>' +
  '<path d="M586 432q34 2 54 20h-54z" fill="#1B2A4E"/><path d="M250 428v40" stroke="#C7CCD9" stroke-width="3"/></g>' +
  '<path filter="url(#jpsh)" d="M0 548Q250 500 520 540T1000 522V600H0z" fill="#6CC56A"/>' +
  '<g filter="url(#jpsh)">' + sakura(70, 566, 1.15) + sakura(948, 560, 1) + '</g>' +
  '<g fill="#F9A8C4"><circle cx="210" cy="566" r="5"/><circle cx="330" cy="580" r="4"/><circle cx="470" cy="570" r="5"/><circle cx="640" cy="584" r="4"/><circle cx="780" cy="566" r="5"/><circle cx="560" cy="558" r="3.500"/></g>' +
  '</svg>';

/* ----- Japanese, spoken by a native voice when the device has one ----- */
const JA = (t, phon, inline) => ({ t, lang: 'ja', fallback: phon, inline: !!inline });
const JAPANESE = [
  { native: 'こんにちは', rom: 'konnichiwa', en: 'hello', icon: 'waving-hand', phon: 'kon-nee-chee-wah' },
  { native: 'ありがとう', rom: 'arigatō', en: 'thank you', icon: 'folded-hands', phon: 'ah-ree-gah-toh' },
  { native: 'ねこ', rom: 'neko', en: 'cat', icon: 'cat', phon: 'neh-koh' },
  { native: 'いぬ', rom: 'inu', en: 'dog', icon: 'dog', phon: 'ee-noo' },
  { native: 'やま', rom: 'yama', en: 'mountain', icon: 'mount-fuji', phon: 'yah-mah' },
  { native: 'でんしゃ', rom: 'densha', en: 'train', icon: 'bullet-train', phon: 'den-shah' }
];
wordSkill('japanese', 'Japanese words', 'ja', JAPANESE);

/* ----- reading hiragana: each letter is a sound. She reads a word with the key, one letter at a time ----- */
const KANA = { 'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o', 'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko', 'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to', 'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no', 'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo', 'や': 'ya', 'ゆ': 'yu', 'よ': 'yo', 'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro', 'わ': 'wa', 'ん': 'n' };
const KANA_OF = {}; Object.keys(KANA).forEach(c => { KANA_OF[KANA[c]] = c; });
const kanaRom = w => w.split('').map(c => KANA[c]).join('');
/* how the English voice should sound a word out, if the device has no Japanese voice */
const kanaPhon = w => { const out = []; w.split('').forEach(c => { const r = KANA[c]; if (r === 'n' && out.length) out[out.length - 1] += 'n'; else out.push(r.slice(0, -1) + { a: 'ah', i: 'ee', u: 'oo', e: 'eh', o: 'oh', n: 'n' }[r.slice(-1)]); }); return out.join('-'); };
/* a name written in hiragana, when every sound in it has a letter here (the player: a-ri-a) */
const kanaName = name => { let s = String(name).toLowerCase(), out = ''; while (s.length) { const m = [3, 2, 1].map(n => s.slice(0, n)).find(x => KANA_OF[x]); if (!m) return null; out += KANA_OF[m]; s = s.slice(m.length); } return out; };
/* [word, meaning, picture] */
const KWORDS = {
  1: [['ねこ', 'cat', 'cat'], ['いぬ', 'dog', 'dog'], ['すし', 'sushi', 'sushi'], ['やま', 'mountain', 'mount-fuji'], ['かさ', 'umbrella', 'umbrella'], ['うま', 'horse', 'horse'], ['くま', 'bear', 'bear'], ['とり', 'bird', 'bird'],
    ['はな', 'flower', 'blossom'], ['ほし', 'star', 'star'], ['うみ', 'sea', 'water-wave'], ['つき', 'moon', 'crescent-moon'], ['たこ', 'octopus', 'octopus'], ['かに', 'crab', 'crab'], ['さる', 'monkey', 'monkey'], ['あめ', 'rain', 'cloud-with-rain'],
    ['ゆき', 'snow', 'snowflake'], ['そら', 'sky', 'cloud']],
  2: [['さくら', 'cherry blossom', 'cherry-blossom'], ['さかな', 'fish', 'fish'], ['くるま', 'car', 'automobile'], ['きつね', 'fox', 'fox'], ['にほん', 'Japan', 'map-of-japan'], ['とけい', 'clock', 'mantelpiece-clock'],
    ['みかん', 'mandarin', 'tangerine'], ['ひかり', 'light', 'light-bulb'], ['かえる', 'frog', 'frog'], ['ひよこ', 'chick', 'baby-chick']],
  3: [['しんかんせん', 'bullet train', 'bullet-train'], ['ひまわり', 'sunflower', 'sunflower'], ['かみなり', 'thunder', 'cloud-with-lightning'], ['にわとり', 'chicken', 'rooster'], ['かたつむり', 'snail', 'snail'], ['せんせい', 'teacher', 'woman-teacher'],
    ['おはよう', 'good morning', 'sunrise'], ['さようなら', 'goodbye', 'waving-hand']]
};
function kanaItem(word, pool) {
  const k = word[0], chars = k.split(''), rom = kanaRom(k), uniq = chars.filter((c, i) => chars.indexOf(c) === i);
  const keyChars = shuffle(uniq.concat(shuffle(Object.keys(KANA).filter(c => !uniq.includes(c))).slice(0, Math.max(3, 8 - uniq.length))));
  const gw = 'min(6.4rem,16vmin,' + (78 / chars.length).toFixed(1) + 'vmin)';
  const view = (hi, known) => el => { el.innerHTML = ''; el.append(h('div', { class: 'codewrap' },
    h('div', { class: 'glyphs' }, chars.map(c => h('div', { class: 'glyph kana' + (hi === c ? ' hi' : ''), style: { '--gw': gw } }, h('b', null, c), h('small', null, known.includes(c) ? KANA[c] : '')))),
    h('div', { class: 'key kana' }, keyChars.map(c => h('div', { class: 'k' }, h('b', null, c), '= ' + KANA[c]))))); };
  const same = pool.filter(x => x[0] !== k && x[0].length === k.length), others = shuffle(same.length >= 2 ? same : pool.filter(x => x[0] !== k)).slice(0, 2), opts = shuffle([word].concat(others));
  const steps = uniq.map((c, i) => { const ls = shuffle([KANA[c]].concat(shuffle(keyChars.filter(x => x !== c)).slice(0, 2).map(x => KANA[x])));
    return { type: 'choice', text: 'Find ' + c + ' in the key. Which sound?', say: 'Look at the key. Find the letter with the purple ring. Which sound does it make?', options: ls.map(x => ({ label: x })), answer: ls.indexOf(KANA[c]), visual: view(c, uniq.slice(0, i)), nudge: 'Not that one. Find the letter in the key.' }; });
  return { type: 'choice', text: 'Read the hiragana. Which word?', say: 'These letters are hiragana. Each one makes a sound. Use the key to read the word. Which word is it?', options: opts.map(x => ({ label: kanaRom(x[0]) })), answer: opts.indexOf(word), visual: view(null, []), visualDone: view(null, uniq), steps,
    explain: { text: chars.join('-') + ' says ' + rom + '. It means ' + word[1] + '.', say: [JA(k, kanaPhon(k)), 'means ' + word[1] + '.'], pic: word[2] } };
}
SKILLS.kana = { name: 'Reading hiragana', strand: 'world', start: 1, max: 3,
  gen(lv, ctx) { ctx = ctx || {}; const pool = KWORDS[clamp(lv, 1, 3)], used = ctx.used || (ctx.used = {}), free = pool.filter(x => !used['kn' + x[0]]), w = pick(free.length ? free : pool); used['kn' + w[0]] = 1; return kanaItem(w, pool); } };

/* ----- forces and magnets ----- */
bankSkill('forces', 'Forces and magnets', 'science', [
  { pic: 'magnet', why: 'Magnets pull iron and steel.',
    ask: [{ t: 'Which one will a magnet pull?', pic: 'magnet', h: 'Magnets pull things made of iron or steel.', o: [O('Paperclip', 'paperclip'), O('Pencil', 'pencil'), O('Balloon', 'balloon')] },
      { t: 'Magnets pull things made of…', pic: 'magnet', h: 'Think of a paperclip, or a nut and bolt. What are they made of?', o: [O('Iron and steel', 'nut-and-bolt'), O('Wood', 'wood'), O('Rubber', 'balloon')] }] },
  { pic: NN_ART, why: 'Two ends the same push each other away.',
    ask: [{ t: 'North meets north. The magnets…', pic: NN_ART, h: 'A magnet has two ends, called north and south. Two ends the same do not like each other.', o: [O('Push apart', PUSH_ART), O('Snap together', PULL_ART), O('Do nothing', 'zzz')] },
      { t: 'Which ends push each other away?', pic: 'magnet', h: 'Ends that are the same push away. Ends that are different pull together.', o: [O('Two the same', NN_ART), O('Two different', NS_ART), O('None at all', 'cross-mark')] }] },
  { pic: NS_ART, why: 'North and south pull together. Snap!',
    ask: [{ t: 'North meets south. The magnets…', pic: NS_ART, h: 'North and south are different ends. Different ends like each other.', o: [O('Snap together', PULL_ART), O('Push apart', PUSH_ART), O('Spin round', 'cyclone')] },
      { t: 'Which two ends pull together?', pic: 'magnet', h: 'Ends that are different pull together. Ends that are the same push away.', o: [O('North and south', NS_ART), O('North and north', NN_ART), O('South and south', SS_ART)] }] },
  { pic: MAGLEV_ART, why: 'Magnets lift a maglev train off its track.',
    ask: [{ t: 'What lifts a maglev train off the track?', pic: MAGLEV_ART, h: 'Maglev means magnetic levitation. Two ends the same push apart, so the train is pushed up.', o: [O('Magnets', 'magnet'), O('Balloons', 'balloon'), O('Wings', 'wing')] },
      { t: 'A maglev train floats. It does not need…', pic: MAGLEV_ART, h: 'It floats just above the track and touches nothing. So what can it leave off?', o: [O('Wheels', WHEEL_ART), O('Doors', 'door'), O('Windows', 'window')] }] },
  { pic: WHEEL_ART, why: 'Rubbing slows things down. That is friction.',
    ask: [{ t: 'Rubbing slows things down. It is called…', pic: WHEEL_ART, h: 'Rub your hands together, fast. Feel them push back, and warm up?', o: [O('Friction', 'raised-hand'), O('Magnetism', 'magnet'), O('Lightning', 'high-voltage')] },
      { t: 'Why can a floating train go so fast?', pic: MAGLEV_ART, h: 'Wheels rub on rails. A floating train touches nothing at all.', o: [O('Nothing rubs', 'feather'), O('More wheels', WHEEL_ART), O('It is heavier', 'rock')] }] },
  { pic: NOSE_POINTY, why: 'A long, pointed nose slips through the air.',
    ask: [{ t: 'Which nose slips through the air best?', pic: 'wind-face', h: 'Air has to get out of the way. A pointed shape pushes it aside gently.', o: [O('Long and pointed', NOSE_POINTY), O('Flat', NOSE_FLAT), O('Tall and square', NOSE_BOX)] },
      { t: 'The bullet train nose copies a…', pic: 'bullet-train', h: 'This bird dives into water with hardly a splash.', o: [O('Kingfisher beak', KINGFISHER), O('Snail shell', 'snail'), O('Elephant ear', 'elephant')] }] }
], 'japan');
bankSkill('scithink', 'Thinking like a scientist', 'science', [
  { pic: KINGFISHER, hint: 'Nature has been testing its ideas for millions of years.', why: 'Engineers copy good ideas from nature.',
    ask: [{ t: 'The train was too loud. The engineer studied…', pic: 'bullet-train', o: [O('A diving bird', KINGFISHER), O('A loud drum', 'drum'), O('A cloud', 'cloud')] },
      { t: 'Copying a good idea from nature is called…', pic: 'herb', o: [O('Biomimicry', 'dna'), O('Magic', 'magic-wand'), O('Guessing', 'game-die')] }] },
  { pic: NOSES_ART, hint: 'A fair test changes just one thing. Everything else stays the same.', why: 'Change one thing. Keep the rest the same.',
    ask: [{ t: 'Testing two train noses. What stays the same?', o: [O('The speed', 'stopwatch'), O('Nothing', 'cross-mark'), O('The nose shape', NOSE_POINTY)] },
      { t: 'In the nose test, what do we change?', o: [O('The nose shape', NOSE_POINTY), O('The speed', 'stopwatch'), O('Everything', 'game-die')] }] },
  { pic: 'straight-ruler', hint: 'Words like "fast" are fuzzy. Numbers are exact.', why: 'Scientists measure, so they can compare.',
    ask: [{ t: 'Which train is faster? To be sure, we…', pic: 'bullet-train', o: [O('Time them', 'stopwatch'), O('Guess', 'game-die'), O('Ask a friend', 'speech-balloon')] },
      { t: 'Scientists measure with numbers so they can…', pic: 'straight-ruler', o: [O('Compare', 'balance-scale'), O('Forget', 'zzz'), O('Guess', 'game-die')] }] },
  { pic: 'thinking-face', hint: 'A prediction is a careful guess. Then you test it to find out.', why: 'A wrong prediction still teaches you something.',
    ask: [{ t: 'Before a test, a scientist makes a…', pic: 'test-tube', o: [O('Prediction', 'thought-balloon'), O('Sandwich', 'sandwich'), O('Mess', 'collision')] },
      { t: 'Your prediction was wrong. So you have…', pic: 'thinking-face', o: [O('Learned something', 'light-bulb'), O('Failed', 'thumbs-down'), O('To stop', 'stop-sign')] }] }
], 'japan');

/* the two-magnets experiment: north is pushed towards north, and the other magnet slides away without being touched */
function magSetup(stage) {
  stage.innerHTML = '';
  const mag = (cls, flip) => h('div', { class: 'mag ' + cls + (flip ? ' flip' : '') }, h('i', { class: 's' }, 'S'), h('i', { class: 'n' }, 'N'));
  stage.append(h('div', { class: 'magsim fill' }, h('div', { class: 'bench' }, mag('a', false), mag('b', true))));
}
async function magSim(stage, ui) {
  magSetup(stage); const a = $('.mag.a', stage), b = $('.mag.b', stage);
  await ui.wait(1000); ui.prompt('North towards north. Push!'); sfx.step();
  a.style.left = '20%'; await ui.wait(450); b.style.left = '64%'; await ui.wait(1500);
  ui.prompt('It slides away! Push again.'); sfx.step();
  a.style.left = '26%'; await ui.wait(400); b.style.left = '69%'; await ui.wait(1500);
  ui.prompt('They never touch. They push apart!'); await ui.wait(1800);
}

/* ----- origami: a dog's face from a square of paper. Each fold is a mirror line ----- */
const ORI = { T: [100, 14], R: [186, 100], B: [100, 186], L: [14, 100], a1: [60, 100], a2: [32, 118], b1: [140, 100], b2: [168, 118], c1: [80, 166], c2: [120, 166], n: [100, 146] };
ORI.e1 = foldMirror(ORI.L, [ORI.a1, ORI.a2]); ORI.e2 = foldMirror(ORI.R, [ORI.b1, ORI.b2]);     // where the ear tips land: they hang a little below the edge, like floppy ears
const ORI_PAPER = '#FFFDF5', ORI_TAN = '#F2A65A', ORI_EAR = '#D98538', ORI_CHIN = '#FBD9AE';
const ORI_EAR1 = { pts: [ORI.e1, ORI.a1, ORI.a2], fill: ORI_EAR }, ORI_EAR2 = { pts: [ORI.e2, ORI.b1, ORI.b2], fill: ORI_EAR };
const ORI_FACE = '<circle cx="87" cy="124" r="6" fill="#1B2A4E"/><circle cx="113" cy="124" r="6" fill="#1B2A4E"/><circle cx="89" cy="122" r="1.800" fill="#fff"/><circle cx="115" cy="122" r="1.800" fill="#fff"/><ellipse cx="100" cy="153" rx="7.500" ry="5.200" fill="#1B2A4E"/>';
const ORI_HEAD = [ORI.a1, ORI.b1, ORI.b2, ORI.c2, ORI.c1, ORI.a2];
const ORIGAMI_DOG = { svg: '<svg viewBox="24 57 152 152" xmlns="http://www.w3.org/2000/svg">' + [{ pts: ORI_HEAD, fill: ORI_TAN }, ORI_EAR1, ORI_EAR2, { pts: [ORI.n, ORI.c1, ORI.c2], fill: ORI_CHIN }].map(p => '<polygon points="' + p.pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ') + '" fill="' + p.fill + '" stroke="#1B2A4E" stroke-width="3" stroke-linejoin="round"/>').join('') + ORI_FACE + '</svg>' };
const FOLD_DOG = [
  { line: [ORI.L, ORI.R], corner: ORI.T, decoys: [ORI.L, ORI.R], flap: [ORI.L, ORI.T, ORI.R], fill: ORI_PAPER, back: ORI_TAN, under: [{ pts: [ORI.L, ORI.R, ORI.B], fill: ORI_PAPER }], after: [{ pts: [ORI.L, ORI.R, ORI.B], fill: ORI_TAN }],
    text: 'Fold on the dotted line. Which corner lands on the star?', say: 'This is a square of paper. We fold it on the dotted line. Which corner will land on the star? Tap that corner.',
    done: { text: 'You folded the square in half!' },
    ask: { text: 'Half a square. What shape is it now?', say: 'Half of the square. What shape is the paper now?', options: [{ svg: V.shapeSvg('square', ORI_TAN) }, { svg: V.shapeSvg('triangle', ORI_TAN) }, { svg: V.shapeSvg('circle', ORI_TAN) }], answer: 1, nudge: 'Count the corners of the paper. Try again.' } },
  { line: [ORI.a1, ORI.a2], corner: ORI.L, decoys: [ORI.R, ORI.B], flap: [ORI.L, ORI.a1, ORI.a2], fill: ORI_TAN, back: ORI_EAR, under: [{ pts: [ORI.a1, ORI.R, ORI.B, ORI.a2], fill: ORI_TAN }], after: [{ pts: [ORI.a1, ORI.R, ORI.B, ORI.a2], fill: ORI_TAN }, ORI_EAR1],
    text: 'Now an ear. Which corner lands on the star?', say: 'Now we fold an ear. Look at the dotted line. Which corner will land on the star?', done: { text: 'One ear, folded down. A little triangle!' } },
  { line: [ORI.b1, ORI.b2], corner: ORI.R, decoys: [ORI.B, ORI.e1], flap: [ORI.R, ORI.b1, ORI.b2], fill: ORI_TAN, back: ORI_EAR, under: [{ pts: [ORI.a1, ORI.b1, ORI.b2, ORI.B, ORI.a2], fill: ORI_TAN }, ORI_EAR1], after: [{ pts: [ORI.a1, ORI.b1, ORI.b2, ORI.B, ORI.a2], fill: ORI_TAN }, ORI_EAR1, ORI_EAR2],
    text: 'The other ear. Which corner lands on the star?', say: 'Now the other ear. Which corner will land on the star?', done: { text: 'Two ears! Both sides match, like a mirror.' } },
  { line: [ORI.c1, ORI.c2], corner: ORI.B, decoys: [ORI.e1, ORI.e2], flap: [ORI.B, ORI.c1, ORI.c2], fill: ORI_TAN, back: ORI_CHIN, under: [{ pts: ORI_HEAD, fill: ORI_TAN }, ORI_EAR1, ORI_EAR2], after: [{ pts: ORI_HEAD, fill: ORI_TAN }, ORI_EAR1, ORI_EAR2, { pts: [ORI.n, ORI.c1, ORI.c2], fill: ORI_CHIN }],
    text: 'Last fold: the chin. Which corner lands on the star?', say: 'One more fold, for the chin. Which corner will land on the star?', done: { text: 'A flat chin. Now for a face!' } }
];

/* ----- pixel pictures. Each is written as its left half only and mirrored, so both sides always match.
   A frame is another whole picture of the same size; the frames play in turn once she has finished it. ----- */
const PXM = half => half.map(r => r + r.split('').reverse().join(''));
const PXSET = (rows, set) => { const g = rows.map(r => r.split('')); set.forEach(c => { g[c[1]][c[0]] = c[2]; }); return g.map(r => r.join('')); };
const PXPAL = { k: '#1B2A4E', w: '#FFFFFF', b: '#3BA7F0', d: '#2563C9', y: '#FFC83D', o: '#FF8A3D', r: '#E5484D', p: '#F58FB0', g: '#9AA3B5', c: '#FFE8C2', m: '#A08BF5', v: '#6A55D8' };
const PXNAMES = { k: 'Navy', w: 'White', b: 'Blue', d: 'Deep blue', v: 'Deep purple', y: 'Yellow', o: 'Orange', r: 'Red', p: 'Pink', g: 'Grey', c: 'Cream', m: 'Purple' };
const pxPic = (id, move, big, small, done, beat) => ({ id, move, beat, pal: PXPAL, names: PXNAMES, big, small, done });
const PX_BFLY = PXM(['.....k..', '......k.', '.vvvv..k', 'vmmmmv.k', 'vmywmmvk', 'vmyymmmk', 'vmmymmmk', '.vmmmmvk', '..vvvv.k', '.vppppvk', 'vppyppvk', 'vppwppv.', '.vpppv..', '..vvv...']);
const PX_BFLY_S = PXM(['..k.', '...k', 'mm.k', 'mymk', 'mmmk', '.m.k', 'pppk', 'pyp.', 'pp..']);
const PX_ROBOT = PXM(['.......r', '.......d', '..kkkkkk', '.dkbbbbb', '.dkbwwbb', '..kbwkbb', '..kbbbbb', '..kbbkwk', '..kkkkkk', '.ddkbbbb', '.d.kbyyy', '.y.kbyyr', '....dd..', '...kkk..']);
const PX_ROBOT_S = PXM(['...y', '.bbb', '.bwb', '.bbk', '...g', 'gbbb', 'gbyy', 'gbbb', 'y.g.', '.kk.']);
const PX_CAT = PXM(['..kk....', '..kpk...', '..kwwkkk', '.kwwwwww', '.kwwkwww', '.kwwkwww', '.kwwwwwp', '.kwpwwwk', '..kwwwww', '..krrrrr', '.kwwwwwy', '.kwwwwww', '.kwwkwww', '..kkkkkk']);
const PX_CAT_S = PXM(['.k..', '.kkk', 'kwww', 'kwkw', 'kwwp', '.kww', '.rrr', 'kwwy', 'kwww', '.kkk']);
const PX_ROCKET = PXM(['......r', '.....rr', '.....rr', '....kww', '....kwk', '....kkb', '....kkb', '....kwk', '...rkww', '..rrkww', '.rrrkww', 'rrr.kkk', '.....yo', '......y']);
const PX_ROCKET_S = PXM(['...r', '..rr', '..kw', '..kb', '..kw', '.rkw', 'rrkw', 'r.kk', '...y', '....']);
const PX_DARUMA = PXM(['....rrrr', '..rrrrrr', '.rrrcccc', '.rrckkcc', 'rrrcwwcc', 'rrrcwkcc', 'rrrccccc', 'rrrrcckk', 'rrrrrccc', 'rrrrrrrr', '.rrryrry', '.rrrryyy', '..rrrrrr']);
const PX_DARUMA_S = PXM(['..rr', '.rrr', 'rrcc', 'rckc', 'rccc', 'rrck', 'rrrr', 'rryy', '.rrr']);
const PIXELS = [
  pxPic('butterfly', 'fly',
    { rows: PX_BFLY, frames: [PX_BFLY, PXM(['.....k..', '......k.', '.....v.k', '....vmvk', '....vymk', '....vymk', '....vmmk', '....vmvk', '.....v.k', '....vpvk', '....vypk', '....vpv.', '.....v..', '........'])] },
    { rows: PX_BFLY_S, frames: [PX_BFLY_S, PXM(['..k.', '...k', '..mk', '..yk', '..mk', '...k', '..pk', '..y.', '..p.'])] },
    { text: 'A butterfly! In Japanese: chōcho.', say: ['A butterfly! Watch it fly. In Japanese, a butterfly is', JA('ちょうちょ', 'choh-choh')] }, 260),
  pxPic('robot', 'hop',
    { rows: PX_ROBOT, frames: [PX_ROBOT, PXM(['.......y', '.......d', '..kkkkkk', '.dkbbbbb', '.dkbbbbb', '..kbkkbb', 'y.kbbbbb', 'd.kbbkwk', 'd.kkkkkk', '.ddkbbbb', '...kbyyy', '...kbyyy', '....dd..', '...kkk..'])] },
    { rows: PX_ROBOT_S, frames: [PX_ROBOT_S, PXM(['...r', '.bbb', '.bkb', 'ybbk', 'g..g', 'gbbb', '.byy', '.bbb', '..g.', '.kk.'])] },
    { text: 'Beep! A robot. In Japanese: robotto.', say: ['Beep, beep! A robot. Look, it is waving. In Japanese, a robot is', JA('ロボット', 'roh-bot-toh')] }, 420),
  pxPic('cat', 'bob',
    { rows: PX_CAT, frames: [PXSET(PX_CAT, [[15, 1, 'k'], [15, 2, 'w'], [15, 3, 'w'], [15, 4, 'k']]), PXSET(PX_CAT, [[15, 4, 'k'], [15, 5, 'w'], [15, 6, 'w'], [15, 7, 'k']])] },
    { rows: PX_CAT_S, frames: [PX_CAT_S, PXSET(PX_CAT_S, [[2, 3, 'w'], [5, 3, 'w'], [3, 7, 'o'], [4, 7, 'o']])] },
    { text: 'A lucky cat! In Japanese, a cat is neko.', say: ['A lucky cat! In Japan, a waving cat in a shop window is there to bring good luck. In Japanese, a cat is', JA('ねこ', 'neh-koh')] }, 480),
  pxPic('rocket', 'launch',
    { rows: PX_ROCKET, frames: [PX_ROCKET, PXM(['......r', '.....rr', '.....rr', '....kww', '....kwk', '....kkb', '....kkb', '....kwk', '...rkww', '..rrkww', '.rrrkww', 'rrr.kkk', '....yoo', '.....oy'])] },
    { rows: PX_ROCKET_S, frames: [PX_ROCKET_S, PXM(['...r', '..rr', '..kw', '..kb', '..kw', '.rkw', 'rrkw', 'r.kk', '..yo', '...y'])] },
    { text: 'A rocket! In Japanese: roketto. Lift off!', say: ['A rocket! Three, two, one, lift off! In Japanese, a rocket is', JA('ロケット', 'roh-ket-toh')] }, 160),
  pxPic('daruma', 'rock',
    { rows: PX_DARUMA, frames: [PX_DARUMA, PX_DARUMA, PX_DARUMA, PXM(['....rrrr', '..rrrrrr', '.rrrcccc', '.rrckkcc', 'rrrccccc', 'rrrckkcc', 'rrrccccc', 'rrrrcckk', 'rrrrrccc', 'rrrrrrrr', '.rrryrry', '.rrrryyy', '..rrrrrr'])] },
    { rows: PX_DARUMA_S, frames: [PX_DARUMA_S, PX_DARUMA_S, PX_DARUMA_S, PXSET(PX_DARUMA_S, [[2, 3, 'c'], [5, 3, 'c'], [2, 4, 'k'], [5, 4, 'k']])] },
    { text: 'A daruma! Push it over. It stands back up.', say: ['A daruma doll. Push it over, and it rocks back up again. In Japan it means: never give up.', JA('だるま', 'dah-roo-mah')] }, 420)
];

/* robot-workshop looks for the coding grid */
const WORKSHOP = { mover: 'robot', goal: 'battery', goalName: 'battery', flag: 'glowing-star', flagName: 'star', rock: 'package', cls: 'lab' };
GRAPH_SETS.japan = { noun: 'snacks', one: 'snack', items: [{ name: 'sushi', art: 'sushi' }, { name: 'rice balls', art: 'rice-ball' }, { name: 'dumplings', art: 'dango' }, { name: 'noodles', art: 'steaming-bowl' }, { name: 'crackers', art: 'rice-cracker' }] };
const KONNICHIWA = 'kon-nee-chee-wah';

COUNTRIES.japan = {
  cheers: ['Sugoi!'],   /* a cheer in this country's own language, used only here */
  ladders: ['pixel'],   /* making activities that keep their own progress; a country reset puts them back to the start */
  /* Japanese lives in Japan (Tony, 29 October: "The Japanese stuff should really be in japan"): the line and Kenta's Town open from here, and from the map's bonus row once Japan is reached */
  bonus: [{ go: 'nihongo', icon: 'japanese-symbol-for-beginner', label: 'Japanese', jp: 'にほんご' }],
  name: 'Japan', hello: 'Konnichiwa! Start with Bullet train maths.', helloSay: [JA('こんにちは', KONNICHIWA), 'Start with Bullet train maths.'], scene: JAPAN_SCENE,
  thing: 'rice-ball', boat: 'robot',
  videos: {
    magnets: { yt: 's236Q1nuWXg', title: 'Fun with magnets!', by: 'SciShow Kids', icon: 'magnet' },
    maglev: { yt: '2A1IEBFt6Xg', title: 'How do maglev trains work?', by: 'TED-Ed', icon: MAGLEV_ART },
    beak: { yt: 'iMtXqTmfta0', title: 'The bird that fixed the bullet train', by: 'Vox', icon: KINGFISHER },
    origami: { yt: 'etCW9M9VdGk', title: 'The maths of folding origami', by: 'TED-Ed', icon: ORIGAMI_DOG }
  },
  souvenirs: [
    { id: 'ja-train', art: 'bullet-train', name: 'Bullet train', price: 30, need: 'm1' }, { id: 'ja-clock', art: 'alarm-clock', move: 'strum', name: 'Station clock', price: 12, need: 'm1' },
    { id: 'ja-maglev', art: MAGLEV_ART, move: 'slide', name: 'Floating train', price: 25, need: 'm2' }, { id: 'ja-kingfisher', art: KINGFISHER, move: 'flap', name: 'Kingfisher', price: 20, need: 'm2' },
    { id: 'ja-lantern', art: 'red-paper-lantern', name: 'Paper lantern', price: 15, need: 'm3' }, { id: 'ja-blossom', art: 'cherry-blossom', name: 'Cherry blossom', price: 12, need: 'm3' },
    { id: 'ja-dog', art: ORIGAMI_DOG, name: 'Origami dog', price: 25, need: 'm4' }, { id: 'ja-fuji', art: 'mount-fuji', name: 'Mount Fuji', price: 40, need: 'boss' }
  ],
  themes: { tatami: { name: 'Tatami room', price: 40, need: 'boss', wall: '#F6EBD2', wall2: '#EFDFBC', floor: '#B9C77C', line: '#9BAC5E', rug: '#D8402F', sky: ['#8FD3F4', '#FFE4EC'] } },
  gates: [{ id: 'v1', after: ['m1', 'm2'], give: ['magnets'] }, { id: 'v2', after: ['boss'], choose: ['maglev', 'beak', 'origami'] }],
  path: [
    { m: 'm1', x: 11, y: 40, px: 27, py: 17 }, { m: 'm2', x: 25, y: 62, px: 70, py: 27 }, { video: 'v1', x: 39, y: 38, px: 30, py: 38 },
    { m: 'm3', x: 53, y: 62, px: 70, py: 49 }, { m: 'm4', x: 66, y: 38, px: 30, py: 60 }, { m: 'boss', x: 79, y: 62, px: 70, py: 71 }, { video: 'v2', x: 91, y: 40, px: 34, py: 82 }
  ],
  missions: [
    { id: 'm1', name: 'Bullet train maths', icon: 'bullet-train', sticker: 'bullet-train',
      intro: { text: 'The bullet train is never late. Use your maths!', say: [JA('こんにちは', KONNICHIWA), 'The bullet train is called the Shinkansen. It is famous for being exactly on time. Ready for some train maths?'] },
      rounds: [{ skill: 'clock' }, { skill: 'divide' }, { skill: 'clock' }, { skill: '@review', or: 'arrays' }, { skill: 'divide' }, { skill: 'clock' }, { skill: '@review', or: 'fractions' }, { skill: 'divide' }] },
    { id: 'm2', name: 'Train lab', icon: 'magnet', sticker: 'magnet',
      intro: { text: 'Magnets, floating trains and a clever bird!', say: 'Japan builds some of the fastest trains in the world. Today you are a train engineer. Let us find out how they work.' },
      rounds: [
        { act: 'place', tags: true, text: 'Put each name on the bullet train.', say: 'This is the Shinkansen, the bullet train. It goes at 320 kilometres an hour. Put each name on the right part.', board: TRAIN_BOARD, items: TRAIN_PARTS, done: { text: 'You know your bullet train. Well done!' } },
        { act: 'sort', even: true, text: 'Will a magnet pull it?', say: 'Magnets pull some things, and not others. Will a magnet pull this one?', bins: [{ label: 'Magnet pulls it', icon: 'magnet' }, { label: 'No pull', icon: 'cross-mark' }],
          items: [{ icon: 'paperclip', label: 'Paperclip', bin: 0, why: 'A paperclip is steel. Magnets pull steel.' }, { icon: 'nut-and-bolt', label: 'Nut and bolt', bin: 0, why: 'Nuts and bolts are steel. Magnets pull steel.' },
            { icon: 'wrench', label: 'Spanner', bin: 0, why: 'A spanner is steel. Steel has iron in it.' }, { icon: 'scissors', label: 'Scissors', bin: 0, why: 'The blades are steel. Magnets pull steel.' },
            { icon: 'pencil', label: 'Pencil', bin: 1, why: 'A pencil is wood. No iron, so no pull.' }, { icon: 'teddy-bear', label: 'Teddy', bin: 1, why: 'Teddy is soft cloth. No iron, so no pull.' },
            { icon: 'balloon', label: 'Balloon', bin: 1, why: 'A balloon is rubber. No iron, so no pull.' }, { icon: 'leaf-fluttering-in-wind', label: 'Leaf', bin: 1, why: 'A leaf has no iron for a magnet to pull.' }],
          done: { text: 'Magnets pull iron and steel. Nothing else here!', say: 'Magnets pull iron and steel. Not wood, not cloth, not rubber.' } },
        { act: 'match', text: 'Match each one to what happens.', pairs: [
          { a: { art: NN_ART, label: 'North and north' }, b: { art: PUSH_ART, label: 'Push apart' }, text: 'Two ends the same push each other away.' },
          { a: { art: NS_ART, label: 'North and south' }, b: { art: PULL_ART, label: 'Pull together' }, text: 'Two different ends pull together. Snap!' },
          { a: { art: MAGLEV_ART, label: 'Maglev train' }, b: { art: 'feather', label: 'Floats on magnets' }, text: 'Magnets lift the train. No wheels rubbing!' },
          { a: { art: 'compass', label: 'Compass needle' }, b: { art: 'up-arrow', label: 'Points north' }, text: 'A compass needle is a tiny magnet.' }] },
        { skill: 'forces' },
        { act: 'order', text: 'How was the loud train fixed? Tap in order.', say: 'The first bullet trains had a problem. An engineer fixed it by watching a bird. How did he do it? Tap the pictures in order.',
          steps: [{ icon: 'loudspeaker', label: 'A loud boom', say: 'The train made a loud boom in tunnels.' }, { art: KINGFISHER, label: 'Watch a kingfisher', say: 'A kingfisher dives with hardly a splash.' }, { art: NOSE_POINTY, label: 'Copy its beak', say: 'So the nose was shaped like its beak.' }, { icon: 'bullet-train', label: 'Quiet and fast', say: 'Now the train is quieter, and faster too!' }],
          hints: ['First there was a problem. What was it?', 'Next the engineer looked at nature.', 'Then he copied what he saw.', 'Last, the problem is fixed!'] },
        { skill: 'forces' },
        { act: 'predict', q: 'Push north towards north. What happens?', qsay: 'Here is an experiment. Each magnet has a red north end. We push north towards north. What will happen? Make a prediction.',
          options: [O('They push apart', PUSH_ART), O('They snap together', PULL_ART), O('Nothing happens', 'zzz')], answer: 0, setup: magSetup, sim: magSim,
          right: 'You predicted it! Two ends the same push apart.', wrong: 'Surprise! Two ends the same push apart. Now we know.',
          tryit: { icon: 'magnet', big: 'Try two magnets!', text: 'Your turn. Push two fridge magnets together, both ways.', say: 'Now you try. Find two fridge magnets. Push them together one way, then turn one round. Can you feel the push?' } },
        { skill: 'forces' }, { skill: 'scithink' }, { skill: 'scithink' }] },
    { id: 'm3', name: 'Konnichiwa!', nameSay: JA('こんにちは', KONNICHIWA, true), icon: 'red-paper-lantern', sticker: 'cherry-blossom',
      intro: { text: 'Find Japan, then ride the hiragana train!', say: 'Time to find Japan on the map. Then ride the Japanese train line: new letters, new words, and a chat with Kenta.' },
      rounds: [
        { act: 'findmap', text: 'Where is Japan? Tap it.', say: 'This is the east of Asia. Where is Japan? Tap it.', view: [730, 110, 175, 175], targets: ['392', '156', '608'], answer: '392',
          hint: { text: 'Japan is a long chain of islands, east of China.' }, done: { text: 'You found Japan! It is thousands of islands.', say: 'You found Japan! It is made of thousands of islands.' } },
        /* Japanese is its own strand (0761-nihongo.js): this plays the next two stops of her station on the train line */
        { act: 'nihongo', stops: 2 },
        { act: 'order', text: "A cherry tree's year. Start with winter.", say: 'In spring, families in Japan have picnics under the cherry blossom. Put the cherry tree’s year in order. Start with winter.',
          steps: [{ icon: 'snowflake', label: 'Bare in winter', say: 'In winter the branches are bare.' }, { icon: 'cherry-blossom', label: 'Pink blossom', say: 'In spring the tree bursts into pink blossom.' }, { icon: 'deciduous-tree', label: 'Green leaves', say: 'In summer the leaves are big and green.' }, { icon: 'maple-leaf', label: 'Red leaves fall', say: 'In autumn the leaves turn red and fall.' }],
          hints: ['Start with the cold, bare branches.', 'After winter comes spring. The tree flowers.', 'The petals fall. Then leaves grow, big and green.', 'Last, the leaves change colour and fall.'] },
        { act: 'nihongo', part: 'talk' }] },
    { id: 'm4', name: 'Fold and code', icon: 'robot', sticker: 'robot',
      intro: { text: 'Fold paper, draw with pixels, code a robot!', say: 'Origami is the Japanese art of folding paper. First, fold a paper dog. Then finish two pixel pictures and watch them come alive. Then write code to guide a robot.' },
      rounds: [
        { act: 'fold', text: FOLD_DOG[0].text, start: [{ pts: [ORI.T, ORI.R, ORI.B, ORI.L], fill: ORI_PAPER }], folds: FOLD_DOG, face: ORI_FACE,
          done: { text: 'A paper dog! In Japanese, a dog is inu.', say: ['You folded a paper dog! In Japanese, a dog is', JA('いぬ', 'ee-noo')] } },
        { act: 'pixel', pics: PIXELS, say: 'Many famous video games were made in Japan. Their characters were drawn with tiny squares, called pixels. Here is half of a pixel picture.' }, { act: 'pixel', pics: PIXELS, say: 'Many famous video games were made in Japan. Their characters were drawn with tiny squares, called pixels. Here is half of a pixel picture.' },
        { act: 'code', look: WORKSHOP, text: 'Take the robot to its battery.', say: 'The robot is running low. Count the squares to its battery. Tap or drag arrows into the boxes to make a path. Then tap Go.', cols: 5, rows: 3, start: [0, 0], goal: [4, 2], rocks: [[1, 0], [1, 1], [3, 1]], slots: 7,
          path: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], legs: [[0, 2], [4, 2]], solution: [['d'], ['d'], ['r'], ['r'], ['r'], ['r']] },
        { act: 'code', look: WORKSHOP, text: 'Go around the boxes!', say: 'This one is longer. Steer the robot around the boxes.', cols: 5, rows: 4, start: [4, 0], goal: [0, 3], rocks: [[3, 0], [3, 1], [1, 2], [1, 3]], slots: 10,
          path: [[4, 0], [4, 1], [4, 2], [3, 2], [2, 2], [2, 1], [1, 1], [0, 1], [0, 2], [0, 3]], legs: [[4, 2], [2, 2], [0, 1], [0, 3]], solution: [['d'], ['d'], ['l'], ['l'], ['u'], ['l'], ['l'], ['d'], ['d']] },
        { act: 'code', look: WORKSHOP, text: 'Only 4 boxes! Tap an arrow, then a number.', say: 'A long trip, but only four boxes. Tap an arrow first. Then tap a number to repeat it.', cols: 6, rows: 5, start: [0, 4], goal: [5, 0], rocks: [[3, 4], [2, 1], [0, 2], [4, 0]], slots: 4, repeat: true,
          path: [[0, 4], [1, 4], [2, 4], [2, 3], [2, 2], [3, 2], [4, 2], [5, 2], [5, 1], [5, 0]], legs: [[2, 4], [2, 2], [5, 2], [5, 0]], solution: [['r', 2], ['u', 2], ['r', 3], ['u', 2]] }] },
    { id: 'boss', name: 'Explorer challenge', icon: 'trophy', sticker: 'mount-fuji',
      intro: { text: 'Show everything you know about Japan!', say: 'The big one! Show everything you have learned in Japan.' },
      rounds: [{ skill: 'clock' }, { skill: 'forces' }, { skill: 'divide' }, { act: 'nihongo', part: 'talk' }, { act: 'pixel', pics: PIXELS, say: 'Many famous video games were made in Japan. Their characters were drawn with tiny squares, called pixels. Here is half of a pixel picture.' }, { act: 'nihongo', part: 'race' }, { skill: 'scithink' }, { skill: '@review', or: 'addsub' }, { skill: '@review', or: 'turns' }] }
  ]
};
