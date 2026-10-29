/* ===== VOICES: hearing the real languages (29 October; Tony, after the language words were read in English on his Android: "This needs to be easier").
   The game speaks a language only through a voice the device offers for it. When a device has none (on Android: the phone's speech engine is not Google's,
   or the language's voice data has not been downloaded), the words were read by the English voice and nothing said why.
   Now: the first time a missing language is needed, a small note appears with "Fix it". "Fix it" (and "Check the voices" on the grown-ups page) opens one screen:
   every language with a tick or a cross and a Test button, the steps for this kind of device (with a button that opens Android's speech settings where the
   browser allows it), and Check again. The game looks for voices again whenever it comes back from the phone's settings, so no restart is needed ===== */

/* the languages the game speaks, the country (or strand) that uses each, and a word to test it with */
const VOICE_LANGS = [
  { code: 'ja', name: 'Japanese', use: 'Japan and にほんご', test: 'こんにちは' },
  { code: 'ar', name: 'Arabic', use: 'Egypt', test: 'مرحبا' },
  { code: 'ru', name: 'Russian', use: 'Russia', test: 'Привет' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', use: 'Brazil', test: 'Olá' },
  { code: 'fr', name: 'French', use: 'France', test: 'Bonjour' },
  { code: 'el', name: 'Greek', use: 'Greece', test: 'Γεια σου' },
  { code: 'zh-cn', name: 'Chinese (Mandarin)', use: 'China', test: '你好' },
  { code: 'fr-ca', name: 'French (Canada)', use: 'Canada', test: 'Bonjour' }
];
const voiceDevice = () => { const u = navigator.userAgent || '';
  return /SamsungBrowser/i.test(u) ? 'samsung' : /Android/i.test(u) ? 'android' : /iPhone|iPad|iPod/i.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1) ? 'ios'
    : /Edg\//.test(u) ? 'edge' : 'desktop'; };
/* Android's own speech settings: Chrome can open them from a tap; where it cannot, the steps below say where they are */
const ANDROID_TTS = 'intent:#Intent;action=com.android.settings.TTS_SETTINGS;end';
const VOICE_STEPS = {
  android: ['Tap Open speech settings below. (Or: Settings, then search for "Text-to-speech".)', 'Set the Preferred engine to Speech Services by Google.',
    'Tap the gear beside it, then Install voice data. Download each language with a cross.', 'Come back here. The game looks again by itself.'],
  samsung: ['Open the game in Chrome, not Samsung Internet. Samsung Internet often has no language voices.', 'In Chrome, if a language still has a cross, open this screen again for the next steps.'],
  ios: ['Open Settings, then Accessibility, then Spoken Content, then Voices.', 'Add a voice for each language with a cross.', 'Come back here. The game looks again by itself.'],
  edge: ['Microsoft Edge has natural voices for these languages when it is online. Check the laptop is connected to the internet.', 'Then tap Check again.'],
  desktop: ['Open the game in Microsoft Edge: it has natural voices for every language here. On the laptop, Play WonderWorld opens it in Edge.', 'Then tap Check again.']
};
let voiceOpen = null;
function voiceHelp() {
  if (voiceOpen) return; sfx.tap();
  const card = h('div', { class: 'card vh-card' }), o = overlay(card), dev = voiceDevice();
  const close = () => { sfx.tap(); o.remove(); voiceOpen = null; };
  const paint = () => {
    Speech.reload(); card.innerHTML = '';
    const rows = VOICE_LANGS.map(L => { const v = Speech.native(L.code), ok = !!v;
      return h('div', { class: 'vh-row' + (ok ? ' ok' : ' no'), 'data-lang': L.code },
        ic(ok ? 'check-mark-button' : 'cross-mark', 'vh-mark'),
        h('div', { class: 'vh-name' }, h('b', null, L.name), h('small', null, ok ? v.name + ' · ' + Speech.bcp(v.lang) : 'No voice on this device: read in English')),
        h('button', { class: 'btn quiet vh-test', 'aria-label': 'Test ' + L.name, onclick: () => { sfx.tap(); Speech.say([{ t: L.test, lang: L.code }]); } }, ic('speaker-high-volume'), 'Test')); });
    const missing = VOICE_LANGS.filter(L => !Speech.native(L.code)).length;
    card.append(...[
      h('h3', null, ic('speaking-head'), 'Hear the real languages'),
      h('p', { class: 'vh-sum' + (missing ? '' : ' good') }, missing ? missing + ' of ' + VOICE_LANGS.length + ' languages have no voice on this device, so their words are read in English.' : 'Every language has its own voice on this device.'),
      /* the fix first, where it is seen without scrolling; the languages after it */
      missing ? h('div', { class: 'vh-fix' }, h('b', null, 'To fix it:'), h('ol', null, VOICE_STEPS[dev].map(t => h('li', null, t))),
        dev === 'android' ? h('a', { class: 'btn go vh-open', href: ANDROID_TTS, onclick: () => sfx.tap() }, ic('gear'), 'Open speech settings') : null) : null,
      h('div', { class: 'row vh-btns' }, h('button', { class: 'btn', 'data-k': 'again', onclick: () => { sfx.tap(); paint(); } }, ic('repeat-button'), 'Check again'), h('button', { class: 'btn go', 'data-k': 'close', onclick: close }, 'Done')),
      /* every voice found, yet a language sounds English: Chrome on Android follows the language but not always the voice, laptops the other way. One tap switches it on this device */
      h('div', { class: 'vh-way' }, h('b', null, missing ? 'A language with a tick still sounds English?' : 'Does a language still sound English?'), h('span', null, 'Switch how the game asks for it, then tap Test.'),
        h('div', { class: 'vh-ways' }, [['lang', 'Way 1: by language'], ['voice', 'Way 2: by voice']].map(([k, l]) => h('button', { class: 'btn' + (Speech.way() === k ? ' go on' : ' quiet'), 'data-way': k, 'aria-pressed': Speech.way() === k ? 'true' : 'false',
          onclick: () => { Speech.setWay(k); sfx.pop(); paint(); } }, l)))),
      h('div', { class: 'vh-list' }, rows),
      h('p', { class: 'note' }, 'This device offers ' + Speech.list().length + ' voices. Te reo Māori has no device voice anywhere: it is played from recordings (grown-ups page).')].filter(Boolean));   /* append would print "null" */
  };
  voiceOpen = { paint, o }; paint();
}
/* the first time a lesson needs a language this device has no voice for: a small note, once per language each visit */
const voiceToldOf = {};
Speech.onMissing = code => {
  const L = VOICE_LANGS.find(x => x.code === code || x.code.slice(0, 2) === code.slice(0, 2)); const k = L ? L.code : code;
  if (voiceToldOf[k] || voiceOpen) return; voiceToldOf[k] = 1;
  const old = document.querySelector('.vh-note'); if (old) old.remove();
  const note = h('div', { class: 'vh-note', role: 'status' }, ic('speaking-head'), h('span', null, 'No ' + (L ? L.name : 'voice for this language') + ' voice on this device, so it sounds English.'),
    h('button', { class: 'btn go', onclick: () => { note.remove(); voiceHelp(); } }, 'Fix it'), h('button', { class: 'vh-x', 'aria-label': 'Close', onclick: () => note.remove() }, '✕'));
  document.body.append(note); setTimeout(() => note.remove(), 12000);
};
/* back from the phone's settings: look again, and if the voices screen is open, show the new ticks */
Speech.onBack = () => { if (voiceOpen) voiceOpen.paint(); };
W.voiceHelp = voiceHelp;
