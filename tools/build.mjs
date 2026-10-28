// Builds dist/WonderWorld2.html: one self-contained file (fonts, icons, map and code all inside).
// node tools/build.mjs --public  builds the web address instead: docs/ (index.html, manifest, service worker, icons) for GitHub Pages.
//   The public build takes recordings only from voices-public/, never from voices/ (which holds home-use recordings such as the Te Aka clips),
//   and it adds what a phone needs to install it as an app and play it offline.
import fs from 'fs';
import crypto from 'crypto';
const PUBLIC = process.argv.includes('--public');
const VDIR = PUBLIC ? 'voices-public' : 'voices';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const flat = require('@iconify-json/fluent-emoji-flat/icons.json');
const flags = require('@iconify-json/circle-flags/icons.json');
const jsFiles = fs.readdirSync('src/js').filter(f => f.endsWith('.js')).sort();
const js = jsFiles.map(f => fs.readFileSync('src/js/' + f, 'utf8')).join('\n');
const css = fs.readFileSync('src/css/app.css', 'utf8');
// every quoted lower-case word in the source that is an icon name gets bundled
const names = new Set(); for (const m of js.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)*)'/g)) if (flat.icons[m[1]]) names.add(m[1]);
const ICONS = {}; for (const n of names) ICONS[n] = flat.icons[n].body;
// icons the code asks for by name must exist
const asked = new Set(); for (const m of js.matchAll(/\b(?:ic|icon:|art:|pic:|sticker:)\s*\(?\s*'([a-z0-9-]+)'/g)) asked.add(m[1]);
for (const m of js.matchAll(/O\('[^']*',\s*'([a-z0-9-]+)'\)/g)) asked.add(m[1]);
for (const m of js.matchAll(/\['([a-z0-9-]+)', '[^']+', \d+\]/g)) asked.add(m[1]);
for (const m of js.matchAll(/b\('[^']+', '([a-z0-9-]+)'/g)) asked.add(m[1]);
const missing = [...asked].filter(n => !flat.icons[n]); if (missing.length) { console.error('MISSING ICONS:', missing.join(', ')); process.exit(1); }
const FLAGS = {}; for (const c of ['eg','jp','gr','nz','nl','in','cn','it','fr','br','ke','au','ru','mx','ca']) FLAGS[c] = flags.icons[c].body;
const MAP = JSON.parse(fs.readFileSync('gen/map.json', 'utf8'));
const font = w => fs.readFileSync(`node_modules/@fontsource/fredoka/files/fredoka-latin-${w}-normal.woff2`).toString('base64');
// the macron vowels for te reo Māori (ā ē ī ō ū) and the third-tone vowels of pinyin (ǎ ě ǐ ǒ ǔ) are not in Fredoka; tools/mkfont.py builds them into gen/
const macron = w => fs.readFileSync(`gen/fredoka-macron-${w}.woff2`).toString('base64');
const fonts = [500, 600, 700].map(w => `@font-face{font-family:'Fredoka';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${font(w)}) format('woff2')}
@font-face{font-family:'Fredoka';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${macron(w)}) format('woff2');unicode-range:U+0100-016B,U+01CD-01D4}`).join('\n') +
// hiragana and katakana in Klee One (Fontworks, SIL Open Font License 1.1): a hand-written, school-book style, so each letter looks the way she will write it. Only the kana are kept (tools: pyftsubset, KleeOne-SemiBold.ttf from github.com/google/fonts), about 166 KB
`\n@font-face{font-family:'Klee Kana';font-style:normal;font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync('gen/klee-kana-600.woff2').toString('base64')}) format('woff2')}`;
// real recorded voices for languages no device can speak (te reo Māori). Two ways to supply them:
//   voices/<language code>/<word>.wav|mp3|m4a|ogg|webm   one sound file per word, named as the word is spelled ("whetū.mp3")
//   voices/*.json                                         a file saved from the grown-ups page ("Save the recordings to a file")
const CLIPS = {}; const MIME = { wav: 'audio/wav', mp3: 'audio/mpeg', m4a: 'audio/mp4', ogg: 'audio/ogg', webm: 'audio/webm' };
if (fs.existsSync(VDIR)) for (const e of fs.readdirSync(VDIR, { withFileTypes: true })) {
  if (e.isFile() && e.name.endsWith('.json')) { const o = JSON.parse(fs.readFileSync(VDIR + '/' + e.name, 'utf8')); for (const lang in o) { CLIPS[lang] = CLIPS[lang] || {}; Object.assign(CLIPS[lang], o[lang]); } }
  if (e.isDirectory()) for (const f of fs.readdirSync(VDIR + '/' + e.name)) { const m = f.normalize('NFC').match(/^(.+)\.(wav|mp3|m4a|ogg|webm)$/i); if (!m) continue;
    (CLIPS[e.name] = CLIPS[e.name] || {})[m[1].toLowerCase().replace(/[!?.,！？。、]/g, '').replace(/\s+/g, ' ').trim()] = 'data:' + MIME[m[2].toLowerCase()] + ';base64,' + fs.readFileSync(VDIR + '/' + e.name + '/' + f).toString('base64'); }
}
const nClips = Object.values(CLIPS).reduce((n, o) => n + Object.keys(o).length, 0);
// the stroke paths of each hiragana and katakana, in stroke order, from KanjiVG (CC BY-SA 3.0): tools/mkkana.py
const KANA_PATHS = fs.readFileSync('gen/kana.json', 'utf8');
const data = `const KANA_STROKES=${KANA_PATHS};\nconst ICONS=${JSON.stringify(ICONS)};\nconst FLAGS=${JSON.stringify(FLAGS)};\nconst MAP=${JSON.stringify(MAP)};\nconst CLIPS=${JSON.stringify(CLIPS)};`;
let html = fs.readFileSync('src/index.html', 'utf8');
html = html.replace('/*FONTS*/', () => fonts).replace('/*CSS*/', () => css).replace('/*DATA*/', () => data).replace('/*JS*/', () => js);
if (PUBLIC) {
  /* the web address: a page a phone can install (manifest, icons) and play offline (a service worker that keeps a copy). The cache name changes with every build, so a new version replaces the old */
  const ver = crypto.createHash('md5').update(html).digest('hex').slice(0, 10);
  const head = ['<link rel="manifest" href="manifest.webmanifest">', '<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">', '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">',
    '<meta name="apple-mobile-web-app-capable" content="yes">', '<meta name="mobile-web-app-capable" content="yes">', '<meta name="apple-mobile-web-app-status-bar-style" content="default">', '<meta name="apple-mobile-web-app-title" content="WonderWorld">',
    '<meta name="description" content="A free learning game: travel the world, solve puzzles, do real science, learn Japanese and program a robot.">'].join('\n');
  html = html.replace('<!--PWA-->', () => head).replace('</body>', () => "<script>if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});</script>\n</body>");
  fs.mkdirSync('docs/icons', { recursive: true });
  fs.writeFileSync('docs/index.html', html);
  for (const f of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']) fs.copyFileSync('gen/icons/' + f, 'docs/icons/' + f);
  fs.writeFileSync('docs/manifest.webmanifest', JSON.stringify({ name: 'WonderWorld', short_name: 'WonderWorld', description: 'Travel the world, solve puzzles, do real science, learn Japanese and program a robot.',
    start_url: './', scope: './', display: 'standalone', orientation: 'any', background_color: '#BDEBF2', theme_color: '#19A7B8', lang: 'en-NZ',
    icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2));
  fs.writeFileSync('docs/sw.js', fs.readFileSync('tools/sw.js', 'utf8').replace('__VERSION__', ver));
  fs.writeFileSync('docs/.nojekyll', '');
  console.log('public site in docs/, version', ver, 'recorded voices', Object.values(CLIPS).reduce((n, o) => n + Object.keys(o).length, 0), 'bytes', html.length);
  process.exit(0);
}
html = html.replace('<!--PWA-->\n', '');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/WonderWorld2.html', html);
fs.writeFileSync('dist/check.js', "'use strict';\n" + data + '\n' + js);
// the Windows launcher: a .cmd that hands its own tail to PowerShell
const ps = fs.readFileSync('tools/launcher.ps1', 'utf8');
const cmd = ['@echo off', 'title WonderWorld', 'set "WW_DIR=%~dp0"', 'set "WW_SELF=%~f0"',
  'powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:WW_SELF); iex $s.Substring($s.LastIndexOf(\'#PS-START#\')+10)"',
  'exit /b', '#PS-START#'].join('\n') + '\n' + ps;
fs.writeFileSync('dist/Play WonderWorld.cmd', cmd.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
console.log('icons', names.size, 'recorded voices', nClips, 'bytes', html.length);
