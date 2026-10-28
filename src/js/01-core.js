/* ===== core: helpers, state, sound, speech, icons, guide ===== */
const W = { fast: false, cur: null };
const COUNTRIES = {};   // each country file adds itself here
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const k in props) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') for (const s in v) el.style.setProperty(s, v[s]);
    else if (k === 'html') el.innerHTML = v;
    else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[rnd(0, a.length - 1)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, W.fast ? Math.min(ms, 15) : ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- icons ---------- */
const _icUri = {};
function icUri(name) {
  if (!_icUri[name]) {
    const body = ICONS[name];
    if (!body) { console.error('Missing icon: ' + name); return ''; }
    _icUri[name] = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + body + '</svg>');
  }
  return _icUri[name];
}
function ic(name, cls) { return h('img', { class: 'ic' + (cls ? ' ' + cls : ''), src: icUri(name), alt: '', draggable: 'false' }); }
function flag(code) { return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' + FLAGS[code] + '</svg>'); }
/* art: either an icon name or {svg:'<svg…>'} for hand-drawn pieces */
function art(a, cls) {
  if (a && a.svg) { const d = h('span', { class: 'ic' + (cls ? ' ' + cls : ''), html: a.svg }); d.style.display = 'inline-grid'; d.firstChild.style.cssText = 'width:100%;height:100%'; return d; }
  return ic(a, cls);
}

/* ---------- state ---------- */
const KEY = 'wonderworld2_v1';
const DEF = { v: 1, name: '', stars: 0, life: 0, skills: {}, missions: {}, videos: {}, stickers: {}, log: [], pin: null, sound: true, imported: false, played: 0, vmode: null, weave: 0, pixel: 0 };
/* opened as a file, YouTube will not play inside the page, so rewards open in YouTube unless a grown-up chooses otherwise */
function videoMode() { return S.vmode || (/^http/.test(location.protocol) ? 'in' : 'yt'); }
let S = JSON.parse(JSON.stringify(DEF));
/* two players on one device: the child (whose name the Welcome guide asks for), and a test player for grown-ups, so that trying things out never touches the child's progress */
const WHO_KEY = 'wonderworld2_player';
let WHO = ''; try { WHO = localStorage.getItem(WHO_KEY) === 'test' ? 'test' : ''; } catch (e) {}
const stateKey = () => KEY + (WHO ? '_' + WHO : '');
const _mem = {};
function loadState() {
  let raw = null; S = JSON.parse(JSON.stringify(DEF));
  try { raw = localStorage.getItem(stateKey()); } catch (e) { raw = _mem[stateKey()]; }
  if (raw) { try { S = Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(raw)); } catch (e) {} }
  if (!S.vset) S.vmode = null;  // only a grown-up's own choice of video mode is kept
  if (WHO) S.imported = true;
  if (!S.imported) {            // carry stars across from the first WonderWorld, once
    S.imported = true;
    try { const old = JSON.parse(localStorage.getItem('wonderworld_state_v1') || 'null'); if (old && old.lifetimeStars > 0) { S.life += old.lifetimeStars; S.stars += old.stars || 0; S.carried = old.lifetimeStars; } } catch (e) {}
    saveState();
  }
  try { document.body.classList.toggle('testing', WHO === 'test'); } catch (e) {}
}
function saveState() { const raw = JSON.stringify(S); _mem[stateKey()] = raw; try { localStorage.setItem(stateKey(), raw); } catch (e) {} }
/* switch player. The test player starts with every mission open and stars to spend, and keeps its own progress. */
function setPlayer(who) {
  saveState(); const keep = { pin: S.pin, name: S.name, sound: S.sound, vmode: S.vmode, vset: S.vset };
  WHO = who === 'test' ? 'test' : ''; try { localStorage.setItem(WHO_KEY, WHO); } catch (e) {}
  loadState();
  if (WHO === 'test') { if (!S.test) { S.test = true; S.stars = 300; S.life = 300; } Object.assign(S, keep); }
  saveState();
}
/* forget one skill: its level, its counts and its re-teaching log */
function clearSkill(id) { delete S.skills[id]; S.log = S.log.filter(l => l.s !== id); saveState(); }
/* the skills that only this country's missions name */
function ownSkills(cid) {
  const named = c => { const o = {}; COUNTRIES[c].missions.forEach(m => m.rounds.forEach(r => { if (r.skill && r.skill !== '@review') o[r.skill] = 1; })); return o; };
  const mine = named(cid); for (const c in COUNTRIES) if (c !== cid) { const o = named(c); for (const k in o) delete mine[k]; }
  return Object.keys(mine);
}
/* put one country back to never played: its missions, stamps, stickers, videos, its own skills and its making ladders. Stars and the room are kept. */
function resetCountry(cid) {
  const pre = cid + '.'; [S.missions, S.stickers].forEach(o => { for (const k in o) if (k.indexOf(pre) === 0) delete o[k]; });
  delete S.videos[cid]; ownSkills(cid).forEach(id => { delete S.skills[id]; S.log = S.log.filter(l => l.s !== id); });
  (COUNTRIES[cid].ladders || []).forEach(k => { S[k] = 0; delete S[k + 'N']; });
  saveState();
}
function canSave() { try { localStorage.setItem(KEY + '_t', '1'); const ok = localStorage.getItem(KEY + '_t') === '1'; localStorage.removeItem(KEY + '_t'); return ok; } catch (e) { return false; } }
function addStars(n) { S.stars += n; S.life += n; saveState(); $$('.starcount').forEach(e => { e.textContent = S.stars; e.parentNode.classList.remove('wobble'); void e.offsetWidth; e.parentNode.classList.add('wobble'); }); }
function skillState(id) { return S.skills[id] || (S.skills[id] = { lv: (SKILLS[id] && SKILLS[id].start) || 1, streak: 0, placed: false, clean: 0, helped: 0, review: false }); }

/* ---------- sound effects (synthesised, no files) ---------- */
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function tone(f, d, type, g, at) {
  if (!S.sound || W.fast) return; const a = ac(); if (!a) return;
  const o = a.createOscillator(), n = a.createGain(), t = a.currentTime + (at || 0);
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
  n.gain.setValueAtTime(0.0001, t); n.gain.exponentialRampToValueAtTime(g || 0.15, t + 0.015); n.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(n).connect(a.destination); o.start(t); o.stop(t + d + 0.03);
}
const sfx = {
  tap() { tone(620, .07, 'sine', .1); },
  pop() { tone(880, .09, 'triangle', .13); },
  place() { tone(392, .08, 'triangle', .15); tone(587, .12, 'triangle', .13, .07); },
  good() { [523, 659, 784].forEach((f, i) => tone(f, .16, 'triangle', .15, i * .08)); },
  great() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .2, 'triangle', .15, i * .09)); },
  soft() { tone(330, .18, 'sine', .1); tone(294, .25, 'sine', .1, .15); },
  step() { tone(440, .06, 'square', .05); },
  bonk() { tone(140, .18, 'sawtooth', .09); },
  win() { [392, 523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, .22, 'triangle', .14, i * .11)); }
};

/* ---------- speech ---------- */
const Speech = (() => {
  let voices = [];
  const has = 'speechSynthesis' in window;
  const load = () => { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } };
  if (has) { load(); try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) { speechSynthesis.onvoiceschanged = load; } }
  const norm = v => (v.lang || '').toLowerCase().replace('_', '-');
  function english() {
    const score = v => {
      const l = norm(v), n = v.name; let s = 0;
      if (/natural|neural/i.test(n)) s += 50; if (/google/i.test(n)) s += 20;
      if (l === 'en-nz') s += 30; else if (l === 'en-au') s += 25; else if (l === 'en-gb') s += 23; else if (l === 'en-us') s += 10;
      if (/female|molly|sonia|natasha|libby|maisie|hazel|susan|zira|samantha|karen|catherine/i.test(n)) s += 6;
      return s;
    };
    return voices.filter(v => norm(v).slice(0, 2) === 'en').sort((a, b) => score(b) - score(a))[0] || null;
  }
  function native(code) {
    /* a code with a region ("fr-ca": Canada's French) takes any voice of the language, and prefers that region's accent strongly */
    const reg = code.length > 2 ? code.toLowerCase() : null; code = code.slice(0, 2);
    /* "zh" covers two spoken languages. The game's Chinese words are Mandarin, so a Cantonese voice (zh-HK, yue) is never used for them: it would say different words */
    const speaks = v => norm(v).slice(0, 2) === code && !(code === 'zh' && /^(zh-hk|zh-mo|yue)|cantonese|hong kong/i.test(norm(v) + ' ' + v.name));
    let c = voices.filter(speaks);
    if (!c.length && has) { load(); c = voices.filter(speaks); }     /* Edge can add its online voices after the page has loaded, without always saying so: look again before giving up */
    const score = v => (/natural|neural/i.test(v.name) ? 50 : 0) + (/google/i.test(v.name) ? 20 : 0) + (reg ? (norm(v) === reg ? 45 : 0) : ['ar-eg', 'pt-br', 'fr-fr', 'zh-cn'].includes(norm(v)) ? 10 : 0);   /* Egypt's Arabic, Brazil's Portuguese, France's French and mainland China's Mandarin first, where a device offers several */
    return c.sort((a, b) => score(b) - score(a))[0] || null;
  }
  /* Languages no device has a voice for (te reo Māori). They are only ever spoken by a real recording:
     one made on this device (grown-ups page) or built into the file. Without one the word is shown, not spoken.
     The game does not fake a language with another language's voice. */
  const REAL_ONLY = { mi: 1 }, NARRATOR_SAYS = { mi: 'en-nz' };
  const VKEY = 'wonderworld2_voices'; let VOX = {};
  try { VOX = JSON.parse(localStorage.getItem(VKEY) || '{}') || {}; } catch (e) { VOX = {}; }
  const ckey = t => String(t).toLowerCase().replace(/[!?.,！？。、]/g, '').replace(/\s+/g, ' ').trim();   /* Japanese punctuation too, so a family recording of こんにちは！ plays for こんにちは */
  function clip(code, text) { const k = ckey(text); return (VOX[code] && VOX[code][k]) || ((typeof CLIPS !== 'undefined' && CLIPS[code] && CLIPS[code][k]) || null); }
  function setClip(code, text, dataUrl) { VOX[code] = VOX[code] || {}; if (dataUrl) VOX[code][ckey(text)] = dataUrl; else delete VOX[code][ckey(text)]; try { localStorage.setItem(VKEY, JSON.stringify(VOX)); return true; } catch (e) { return false; } }
  /* can this word be said properly here? a recording, the device's own voice for the language, or (for languages that allow it) a sounded-out fallback */
  function can(code, text) { return !!(clip(code, text) || native(code) || !REAL_ONLY[code]); }
  /* a foreign word inside an English sentence (a bird's name in a question): the narrator says it, from the real spelling if it is a New Zealand voice, else sounded out */
  function word(w, phon, code) { const v = english(); return (v && norm(v) === NARRATOR_SAYS[code || 'mi']) ? w : phon; }
  let playing = null;
  function playClip(url) { return new Promise(res => { try { const a = new Audio(url); playing = a; const fin = () => { if (playing === a) playing = null; res(true); }; a.onended = fin; a.onerror = fin; a.play().catch(fin); setTimeout(fin, 6000); } catch (e) { res(false); } }); }
  /* One utterance. Resolves true if a native-speaker voice was used. */
  function one(text, o) {
    return new Promise(res => {
      let done = false; const fin = v => { if (!done) { done = true; res(v); } };
      try {
        let voice, usedNative = false, slow = false, t = text;
        if (o.lang && o.lang !== 'en') {
          const rec = clip(o.lang, text); if (rec) { playClip(rec).then(() => fin(true)); return; }       // a real recording always wins
          voice = native(o.lang); slow = true;
          if (voice) usedNative = true;
          else if (REAL_ONLY[o.lang] && !o.inline) { fin(false); return; }                               // no real voice: stay silent, the word is on the screen
          else t = o.inline ? word(text, o.fallback || text, o.lang) : (o.fallback || text);
        }
        if (!voice) voice = english();
        const u = new SpeechSynthesisUtterance(t);
        if (voice) { u.voice = voice; u.lang = voice.lang; }
        u.rate = o.rate || (slow ? .8 : .95); u.pitch = o.pitch || (usedNative ? 1 : 1.08);   /* a pitch can be asked for: in a Japanese conversation her explorer speaks a little higher than Kotarō */
        u.onend = () => fin(usedNative); u.onerror = () => fin(false);
        speechSynthesis.speak(u);
        setTimeout(() => fin(usedNative), 1500 + t.length * 110);
      } catch (e) { fin(false); }
    });
  }
  /* Speak a line. A line can be a list of parts so a foreign word is said in its own voice mid-sentence:
     [{ t: 'شكرا', lang: 'ar', fallback: 'shook-ran' }, 'means thank you.'] */
  let gen = 0;
  async function say(text, o) {
    o = o || {};
    if (!S.sound || W.fast || !text) return false;
    if (has && !voices.length) load();
    const mine = ++gen; try { speechSynthesis.cancel(); } catch (e) {} if (playing) { try { playing.pause(); } catch (e) {} playing = null; }
    const parts = Array.isArray(text) ? text : [text]; let nativeUsed = false;
    for (const p of parts) {
      if (mine !== gen) return false;                      // something newer started talking
      const r = typeof p === 'string' ? await one(p, o) : await one(p.t, Object.assign({}, o, p));
      nativeUsed = nativeUsed || r;
    }
    return nativeUsed;
  }
  return { say, english, native, word, can, clip, setClip, playClip, key: ckey, clips: () => VOX, realOnly: code => !!REAL_ONLY[code], list: () => voices,
    stop() { gen++; try { speechSynthesis.cancel(); } catch (e) {} if (playing) { try { playing.pause(); } catch (e) {} playing = null; } } };
})();

/* ---------- the guide: Kiki the kiwi ---------- */
const KIWI_SVG = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
  '<ellipse cx="58" cy="112" rx="30" ry="4" fill="rgba(27,42,78,.15)"/>' +
  '<path d="M44 96v12m-7 2h12M70 96v12m-7 2h12" stroke="#E0A458" stroke-width="5" stroke-linecap="round" fill="none"/>' +
  '<rect x="14" y="58" width="22" height="28" rx="8" fill="#19A7B8"/><rect x="18" y="64" width="14" height="8" rx="3" fill="#0C7C8C"/>' +
  '<ellipse cx="56" cy="72" rx="36" ry="31" fill="#9A6A45"/>' +
  '<path d="M30 70q6 6 2 14M44 62q6 8 1 18M60 60q5 9 0 20" stroke="#7E5333" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<circle cx="82" cy="50" r="19" fill="#9A6A45"/>' +
  '<path d="M97 52 L119 67 L117 71 L94 60Z" fill="#F5E3B5" stroke="#E0C489" stroke-width="1.5" stroke-linejoin="round"/>' +
  '<circle cx="87" cy="46" r="5.5" fill="#fff"/><circle cx="88.5" cy="46.5" r="3" fill="#1B2A4E"/><circle cx="89.5" cy="45.3" r="1" fill="#fff"/>' +
  '<ellipse cx="78" cy="57" rx="5" ry="3" fill="#FF9E8E" opacity=".7"/>' +
  '<ellipse cx="80" cy="35" rx="24" ry="6" fill="#E9B95C"/><path d="M64 35q2-18 16-18t16 18z" fill="#F4C97B"/><path d="M65 31h30v4H64z" fill="#C9643B"/>' +
  '</svg>';
/* ----- the guide. Each country has its own: the kiwi belongs to New Zealand only (Tony: "Only use a kiwi for NZ").
   Away from any country (the world map, her room) the guide is a little globe in an explorer's hat. All share the same box, shadow and moods. ----- */
const G_SHADOW = '<ellipse cx="60" cy="112" rx="30" ry="4" fill="rgba(27,42,78,.15)"/>', G_EYE = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#1B2A4E"/><circle cx="' + (x + r * .35) + '" cy="' + (y - r * .4) + '" r="' + (r * .35) + '" fill="#fff"/>';
const G_HAT = (x, y, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><ellipse cx="0" cy="0" rx="26" ry="6.500" fill="#E9B95C"/><path d="M-16 0q2-18 16-18t16 18z" fill="#F4C97B"/><path d="M-15-4h30v4h-31z" fill="#C9643B"/></g>';
const SVG120 = inner => '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' + G_SHADOW + inner + '</svg>';
/* the toucan is drawn once and used twice: as Brazil's guide and as a souvenir */
const TOUCAN_IN = '<path d="M40 94 20 112l26-5z" fill="#1B1F2E"/><path d="M50 104v8m-5 1h10M65 104v8m-5 1h10" stroke="#5A88C9" stroke-width="4" stroke-linecap="round" fill="none"/>' +
  '<ellipse cx="56" cy="78" rx="23" ry="29" fill="#1B1F2E"/><path d="M38 92q8 10 18 12-10-4-12-14z" fill="#E5484D"/><path d="M38 66q2 24 20 34" stroke="#3A4156" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<circle cx="58" cy="42" r="21" fill="#1B1F2E"/><path d="M46 46q-2 26 18 32 12-9 12-30-13-11-30-2z" fill="#fff"/>' +
  '<path d="M74 30q31-11 43 20-4 9-12 6-12-8-31-6z" fill="#FF9A3D"/><path d="M78 32q22-6 33 13" stroke="#FFD95E" stroke-width="3.500" fill="none" stroke-linecap="round"/><path d="M74 50q19-2 31 6-6 7-15 4-8-4-16-4z" fill="#F2853D"/>' +
  '<path d="M111 41q6 5 6 9-4 9-12 6 6-5 6-15z" fill="#1B1F2E"/><path d="M74 29v22" stroke="#1B1F2E" stroke-width="3.500" stroke-linecap="round"/>' +
  '<circle cx="62" cy="38" r="9.500" fill="#FF9A3D"/><circle cx="62" cy="38" r="6.500" fill="#3BA7F0"/>' + G_EYE(62, 38, 3.800);
/* France's rooster (le coq): drawn once here, so the guide and the souvenir are the same bird */
const ROOSTER_IN = '<path d="M52 98v11m-6 2h11M68 98v11m-6 2h11" stroke="#E9A416" stroke-width="4" stroke-linecap="round" fill="none"/>' +
  '<path d="M40 88Q8 84 12 44q16 10 30 32z" fill="#2E4E8F"/><path d="M42 86Q20 62 30 30q14 18 18 46z" fill="#3B6FD4"/><path d="M46 84Q38 54 54 36q6 22 0 44z" fill="#19A7B8"/>' +
  '<path d="M36 82q0-24 26-24 10 0 14-12h16q4 8 4 22 0 34-32 34-28 0-28-20z" fill="#FBF3E4"/><path d="M46 76q12-12 28-4-6 18-20 18-8 0-8-14z" fill="#E9B95C"/><path d="M52 80q8-6 16-3" stroke="#C99A3B" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<circle cx="84" cy="40" r="16" fill="#FBF3E4"/><path d="M72 30q-2-13 7-9 1-11 9-4 8-6 9 6 1 7-8 8z" fill="#E5484D"/><path d="M98 38l13 5-13 6z" fill="#FFC83D"/><path d="M93 51q6 8 0 14-6-6 0-14z" fill="#E5484D"/>' + G_EYE(88, 38, 3.600);
/* Greece's little owl (Athene noctua), the bird of Athena and of Athens: drawn once here, so the guide and the souvenir are the same bird */
const OWL_IN = '<path d="M50 103v7m-5 1h10M70 103v7m-5 1h10" stroke="#E9A416" stroke-width="4" stroke-linecap="round" fill="none"/>' +
  '<path d="M33 66q-12 18-2 36 8-4 10-16zM87 66q12 18 2 36-8-4-10-16z" fill="#6B4E33"/><ellipse cx="60" cy="76" rx="27" ry="31" fill="#8A6A4A"/><ellipse cx="60" cy="84" rx="17" ry="21" fill="#EFE0C6"/>' +
  '<g stroke="#8A6A4A" stroke-width="2.200" stroke-linecap="round" fill="none"><path d="M52 76l3 4 3-4M62 76l3 4 3-4M56 86l3 4 3-4M48 90l2 3 2-3M67 90l2 3 2-3M57 97l3 3 3-3"/></g>' +
  '<ellipse cx="60" cy="42" rx="31" ry="25" fill="#8A6A4A"/><g fill="#EFE0C6"><circle cx="40" cy="26" r="1.800"/><circle cx="50" cy="21" r="1.800"/><circle cx="60" cy="19.500" r="1.800"/><circle cx="70" cy="21" r="1.800"/><circle cx="80" cy="26" r="1.800"/></g>' +
  '<circle cx="46" cy="45" r="14" fill="#F4E9D6"/><circle cx="74" cy="45" r="14" fill="#F4E9D6"/><path d="M33 34q12-6 24 2M87 34q-12-6-24 2" stroke="#FFFDF4" stroke-width="3.500" fill="none" stroke-linecap="round"/>' +
  '<circle cx="46" cy="46" r="8.500" fill="#FFC83D"/><circle cx="74" cy="46" r="8.500" fill="#FFC83D"/>' + G_EYE(46, 46, 4.400) + G_EYE(74, 46, 4.400) + '<path d="M60 50l-4.500 7h9z" fill="#E9A416"/>' +
  '<g fill="#6FA85B"><ellipse cx="34" cy="20" rx="7" ry="3" transform="rotate(-38 34 20)"/><ellipse cx="45" cy="13" rx="7" ry="3" transform="rotate(-18 45 13)"/><ellipse cx="75" cy="13" rx="7" ry="3" transform="rotate(18 75 13)"/><ellipse cx="86" cy="20" rx="7" ry="3" transform="rotate(38 86 20)"/></g><ellipse cx="60" cy="11" rx="6.500" ry="3.200" fill="#57944A"/>';
/* China's giant panda, with a stalk of bamboo: drawn once here, so the guide, the souvenir and the coding puzzle are the same panda */
const PANDA_IN = '<ellipse cx="44" cy="104" rx="12" ry="7.500" fill="#2B3445"/><ellipse cx="76" cy="104" rx="12" ry="7.500" fill="#2B3445"/><path d="M33 104q-8-36 27-37 35 1 27 37z" fill="#FBFBF7"/>' +
  '<path d="M34 80q26-15 52 0l4 15q-9 7-14-5-16-7-32 0-5 12-14 5z" fill="#2B3445"/><path d="M88 62 100 104" stroke="#4E9A45" stroke-width="6.500" stroke-linecap="round"/><path d="M90.500 73l7-2M94 86l7-2" stroke="#2F6E2E" stroke-width="2" stroke-linecap="round"/>' +
  '<path d="M90 64q10-12 20-8-6 10-20 8zM92 72q12-3 18 5-10 5-18-5z" fill="#6DBF5B"/><ellipse cx="90" cy="88" rx="8" ry="7" fill="#2B3445"/>' +
  '<circle cx="36" cy="25" r="11.500" fill="#2B3445"/><circle cx="84" cy="25" r="11.500" fill="#2B3445"/><ellipse cx="60" cy="46" rx="30" ry="26" fill="#FBFBF7"/>' +
  '<ellipse cx="47" cy="45" rx="8.500" ry="11" fill="#2B3445" transform="rotate(24 47 45)"/><ellipse cx="73" cy="45" rx="8.500" ry="11" fill="#2B3445" transform="rotate(-24 73 45)"/>' +
  '<circle cx="48.500" cy="44.500" r="4.200" fill="#fff"/><circle cx="71.500" cy="44.500" r="4.200" fill="#fff"/>' + G_EYE(48.5, 44.5, 2.9) + G_EYE(71.5, 44.5, 2.9) +
  '<ellipse cx="60" cy="56" rx="4.800" ry="3.300" fill="#2B3445"/><path d="M60 59v2q-4 4-8 1M60 61q4 4 8 1" stroke="#2B3445" stroke-width="1.800" fill="none" stroke-linecap="round"/><ellipse cx="41" cy="60" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/><ellipse cx="79" cy="60" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/>';
/* Canada's beaver, the national animal, in a red toque with a white maple leaf: drawn once here, so the guide and the souvenir are the same beaver */
const MAPLE_D = 'M0-13 2.400-7.600 5.600-9.200 4.800-3.600 9.600-6 8.400-2.400 11.600-.8 6.400 2.400 7.200 5.200 1.200 4.400 1.600 9.600H-1.600L-1.200 4.400-7.200 5.200-6.400 2.400-11.600-.8-8.400-2.400-9.600-6-4.800-3.600-5.600-9.200-2.400-7.600z';
const BEAVER_IN = '<g transform="rotate(-24 30 98)"><ellipse cx="30" cy="98" rx="24" ry="10" fill="#4A3020"/><path d="M12 98h36M18 92v12M26 89v18M34 89v18M42 92v12" stroke="#6B4A33" stroke-width="1.400"/></g>' +
  '<ellipse cx="62" cy="82" rx="29" ry="27" fill="#9A6233"/><ellipse cx="63" cy="88" rx="18" ry="18" fill="#C48A55"/>' +
  '<ellipse cx="48" cy="107" rx="10" ry="5" fill="#6B4424"/><ellipse cx="77" cy="107" rx="10" ry="5" fill="#6B4424"/>' +
  '<path d="M38 82q6 6 14 4M88 80q-6 7-15 5" stroke="#9A6233" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M36 84 92 74" stroke="#B98A4E" stroke-width="5" stroke-linecap="round"/><path d="M84 75q8-10 16-6-6 8-16 6z" fill="#57BF7F"/>' +
  '<circle cx="51" cy="85" r="5" fill="#7A4A26"/><circle cx="74" cy="81" r="5" fill="#7A4A26"/>' +
  '<circle cx="40" cy="38" r="7" fill="#7A4A26"/><circle cx="84" cy="38" r="7" fill="#7A4A26"/><circle cx="62" cy="47" r="24" fill="#9A6233"/>' +
  '<ellipse cx="62" cy="58" rx="15" ry="10.500" fill="#C48A55"/>' + G_EYE(52, 45, 3.500) + G_EYE(72, 45, 3.500) +
  '<ellipse cx="62" cy="52" rx="6" ry="4" fill="#2B3445"/><path d="M62 56v3" stroke="#2B3445" stroke-width="1.600" stroke-linecap="round"/>' +
  '<rect x="56.500" y="59" width="11" height="10" rx="2.200" fill="#FFB347" stroke="#B9652A" stroke-width="1.200"/><path d="M62 59v10" stroke="#B9652A" stroke-width="1.200"/>' +
  '<path d="M48 56l-9-2M48 59l-9 1M76 56l9-2M76 59l9 1" stroke="#5A3A22" stroke-width="1.100" stroke-linecap="round"/>' +
  '<ellipse cx="46" cy="55" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/><ellipse cx="78" cy="55" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/>' +
  '<path d="M38 36q0-28 24-28t24 28z" fill="#E5484D"/><path d="M36 37q26-9 52 0v-8q-26-9-52 0z" fill="#fff"/><path d="M36 37q26-9 52 0" stroke="#D9D9D9" stroke-width="1" fill="none"/>' +
  '<path d="M46 12q16-8 32 0" stroke="#C0392B" stroke-width="2" fill="none"/><circle cx="62" cy="7" r="6.500" fill="#fff" stroke="#E2E2E2" stroke-width="1"/>' +
  '<path transform="translate(62 21) scale(.62)" d="' + MAPLE_D + '" fill="#fff"/>';
const GUIDES = {
  nz: KIWI_SVG,
  /* Egypt: a camel */
  egypt: SVG120('<path d="M34 86v22M46 88v20M66 88v20M78 86v22" stroke="#B9853F" stroke-width="6" stroke-linecap="round"/><path d="M22 76q-8 2-9 12" stroke="#B9853F" stroke-width="4" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="56" cy="76" rx="34" ry="19" fill="#DDB06A"/><path d="M36 66q16-34 34-2z" fill="#DDB06A"/><path d="M44 62q8-12 18-2" stroke="#C99A52" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M76 78q10-8 12-36l12 2q0 30-12 44z" fill="#DDB06A"/><path d="M40 70h30v10H40z" fill="#C9643B"/><path d="M40 73h30M40 77h30" stroke="#F4C97B" stroke-width="1.500"/>' +
    '<ellipse cx="98" cy="38" rx="15" ry="11" fill="#DDB06A"/><ellipse cx="109" cy="42" rx="8" ry="6.500" fill="#EBC78C"/><path d="M106 45q4 2 7-1" stroke="#8A5A2B" stroke-width="1.600" fill="none" stroke-linecap="round"/><circle cx="112" cy="39.500" r="1" fill="#8A5A2B"/>' +
    '<path d="M86 30l-3-9 9 5z" fill="#C99A52"/>' + G_EYE(100, 35, 3.200) + G_HAT(94, 27, .72)),
  /* Japan: a Shiba Inu, the dog she folds from paper */
  japan: SVG120('<path d="M30 88q-16-4-12-22 4-12 14-6-8 4-6 12 2 6 10 6z" fill="#E8A257"/><path d="M22 66q4-6 10-6-7 4-6 11z" fill="#FBEBD3"/>' +
    '<path d="M34 108q-8-34 18-40 26-4 30 18l2 22z" fill="#E8A257"/><path d="M58 108q-6-24 10-34 12 8 14 34z" fill="#FBEBD3"/><path d="M46 108h14M68 108h14" stroke="#C9813A" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M48 34 44 12l18 12zM92 34l6-22-18 12z" fill="#E8A257"/><path d="M50 30l-2-11 9 6zM90 30l3-11-9 6z" fill="#F7C9A0"/>' +
    '<circle cx="70" cy="46" r="26" fill="#E8A257"/><path d="M48 50q4 22 22 22t22-22q-8-10-22-4-14-6-22 4z" fill="#FBEBD3"/>' + G_EYE(60, 42, 3.400) + G_EYE(80, 42, 3.400) +
    '<ellipse cx="70" cy="52" rx="4.500" ry="3.200" fill="#1B2A4E"/><path d="M70 55v4q-5 5-9 1M70 59q5 5 9 1" stroke="#1B2A4E" stroke-width="1.800" fill="none" stroke-linecap="round"/><ellipse cx="54" cy="52" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/><ellipse cx="86" cy="52" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/>' +
    '<path d="M50 70q20 10 40 0v8q-20 10-40 0z" fill="#E5484D"/><path d="M84 76l8 16-10-2z" fill="#C0392B"/>'),
  /* Australia: a koala in a wide-brimmed hat */
  australia: SVG120('<path d="M36 108q-10-36 24-38 34 2 24 38z" fill="#A9B1BE"/><ellipse cx="60" cy="92" rx="15" ry="14" fill="#E7EAF0"/><path d="M40 108h14M66 108h14" stroke="#7E8798" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="32" cy="38" r="15" fill="#A9B1BE"/><circle cx="88" cy="38" r="15" fill="#A9B1BE"/><circle cx="32" cy="39" r="8.500" fill="#F3D9DC"/><circle cx="88" cy="39" r="8.500" fill="#F3D9DC"/>' +
    '<ellipse cx="60" cy="50" rx="29" ry="25" fill="#B7BFCB"/>' + G_EYE(49, 47, 3.400) + G_EYE(71, 47, 3.400) + '<ellipse cx="60" cy="56" rx="7" ry="9.500" fill="#2B3445"/><path d="M57 51q3-2 5 0" stroke="#5A678A" stroke-width="1.500" fill="none" stroke-linecap="round"/>' +
    '<path d="M52 68q8 5 16 0" stroke="#2B3445" stroke-width="1.800" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="58" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/><ellipse cx="78" cy="58" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/>' +
    '<ellipse cx="60" cy="29" rx="38" ry="7.500" fill="#B98A4E"/><path d="M40 29q2-20 20-20t20 20z" fill="#D2A363"/><path d="M40.500 24h39v5h-40z" fill="#7A4A1E"/>'),
  /* Russia: a brown bear in a fur hat and scarf */
  russia: SVG120('<path d="M34 108q-10-38 26-40 36 2 26 40z" fill="#8A5A34"/><ellipse cx="60" cy="92" rx="15" ry="14" fill="#C99A6B"/><path d="M40 108h14M66 108h14" stroke="#6B4424" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="60" cy="48" r="27" fill="#8A5A34"/><ellipse cx="60" cy="58" rx="13" ry="10" fill="#E3C39A"/>' + G_EYE(49, 46, 3.400) + G_EYE(71, 46, 3.400) +
    '<ellipse cx="60" cy="54" rx="5" ry="3.500" fill="#2B3445"/><path d="M60 57v3q-4 4-8 1M60 60q4 4 8 1" stroke="#2B3445" stroke-width="1.800" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="56" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/><ellipse cx="78" cy="56" rx="4" ry="2.500" fill="#FF9E8E" opacity=".6"/>' +
    '<path d="M32 36q0-24 28-24t28 24q-28-10-56 0z" fill="#5A678A"/><path d="M30 38q30-12 60 0v-8q-30-12-60 0z" fill="#3E4A5E"/><path d="M30 32q-8 4-6 20 8 0 10-12zM90 32q8 4 6 20-8 0-10-12z" fill="#5A678A"/><circle cx="60" cy="14" r="4" fill="#3E4A5E"/><path d="M57 27l3-5 3 5-3 4z" fill="#E5484D"/>' +
    '<path d="M38 70q22 10 44 0v8q-22 10-44 0z" fill="#3B6FD4"/><path d="M44 76l-6 18 10-3z" fill="#2A54A8"/>'),
  /* Brazil: a toco toucan */
  brazil: SVG120(TOUCAN_IN),
  france: SVG120(ROOSTER_IN),
  greece: SVG120(OWL_IN),
  china: SVG120(PANDA_IN),
  canada: SVG120(BEAVER_IN),
  /* everywhere else: a globe in an explorer's hat */
  home: SVG120('<path d="M48 100v8m-6 2h11M72 100v8m-6 2h11" stroke="#E0A458" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="16" y="58" width="20" height="26" rx="8" fill="#C9643B"/>' +
    '<circle cx="60" cy="66" r="36" fill="#3BA7F0"/><path d="M34 52q10-14 26-8t16-4q12 8 8 22-14 2-22-6t-20 8q-10-2-8-12zM48 86q14-8 24 2t-6 14q-16 2-18-16z" fill="#57BF7F"/><circle cx="60" cy="66" r="36" fill="none" stroke="#1B2A4E" stroke-width="2.500"/>' +
    G_EYE(50, 62, 4.200) + G_EYE(72, 62, 4.200) + '<path d="M52 74q9 8 18 0" stroke="#1B2A4E" stroke-width="2.500" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="71" rx="4.500" ry="2.800" fill="#FF9E8E" opacity=".8"/><ellipse cx="80" cy="71" rx="4.500" ry="2.800" fill="#FF9E8E" opacity=".8"/>' + G_HAT(60, 33, 1.05))
};
/* the guide for a country (or for the screens that belong to no country). The class stays "kiwi": it is the guide's slot on the screen */
function kiwi(cls, cid) { return h('div', { class: 'kiwi' + (cls ? ' ' + cls : ''), html: GUIDES[cid] || GUIDES.home }); }
function kiwiMood(root, mood) { const k = $('.kiwi', root); if (!k) return; k.className = 'kiwi ' + (mood || ''); if (mood === 'cheer') setTimeout(() => { if (k.classList.contains('cheer')) k.className = 'kiwi'; }, 1100); }
/* a speech bubble with a repeat button */
function bubble(text, sayText, opts) {
  const txt = h('div', { class: 'txt' }, text);
  const b = h('div', { class: 'bubble' }, h('span', { class: 'helptag' }, "Let's work it out"), txt,
    h('button', { class: 'spk', 'aria-label': 'Hear it again', onclick: () => { sfx.tap(); b._again(); } }, ic('speaker-high-volume')));
  b._say = sayText || text; b._opts = opts || null;
  b._again = () => Speech.say(b._say, b._opts);
  b.set = (t, s, o) => { txt.textContent = t; b._say = s || t; b._opts = o || null; return Speech.say(b._say, b._opts); };
  return b;
}

/* ---------- celebrations ---------- */
function confetti(n) {
  if (W.fast) return;
  const c = h('div', { class: 'confetti' }), cols = ['#FFC83D', '#34C17B', '#FF7A6B', '#19A7B8', '#8B7BEA', '#fff'];
  for (let i = 0; i < (n || 60); i++) c.append(h('i', { style: { left: rnd(0, 100) + '%', background: pick(cols), 'animation-duration': (1.6 + Math.random() * 1.8) + 's', 'animation-delay': (Math.random() * .5) + 's', transform: 'rotate(' + rnd(0, 360) + 'deg)' } }));
  document.body.append(c); setTimeout(() => c.remove(), 4200);
}
function overlay(...kids) { const o = h('div', { class: 'overlay' }, ...kids); document.body.append(o); return o; }
/* cheers in English. Each country adds its own (cheers: [...]) and they are only used inside that country: "Ka pai!" belongs to New Zealand, not Japan. */
const CHEERS = ['Yes!', 'You got it!', 'Brilliant!', 'Spot on!', 'Nailed it!', 'Super!'];
const SOFT = ["Tricky one! Let's work it out.", "Good try. Let's break it down.", "Hmm, a big one. Let's go step by step."];
