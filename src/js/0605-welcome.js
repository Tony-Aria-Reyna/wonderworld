/* ===== the Welcome guide and About (Tony, 29 October: "ideally I have a Welcome guide + About", and "considering friends will use this, we want to have them add their own names so it is personolised").
   The Welcome guide runs the first time the game opens on a device (no name saved yet): welcome, the player's name, how the game works. It can be shown again from the grown-ups page.
   About is for grown-ups: what the game is, how it teaches, what is inside, privacy, putting it on a phone, and credits. It opens from the title screen, the Welcome guide and the grown-ups page ===== */

/* a name as the player types it: letters (any script), spaces, hyphens and apostrophes; at most 16 characters; first letter capital */
function cleanName(v) {
  const t = String(v || '').replace(/[^\p{L}\p{M} '\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  return t ? t[0].toUpperCase() + t.slice(1) : '';
}

SCREENS.welcome = again => {
  let step = 0;
  const box = h('div', { class: 'wl-card' }), dots = h('div', { class: 'wl-dots' });
  const scr = h('div', { class: 'screen welcome' }, h('div', { class: 'wave' }), box, dots);
  show(scr);
  const draw = () => {
    box.innerHTML = ''; dots.innerHTML = ''; [0, 1, 2].forEach(i => dots.append(h('i', { class: i === step ? 'on' : '' })));
    if (step === 0) {
      box.append(ic('globe-showing-asia-australia', 'wl-globe'), h('h1', { class: 'wl-h' }, 'Welcome to WonderWorld!'),
        h('p', { class: 'wl-p' }, 'Travel the world. Solve puzzles. Do real science. Learn Japanese and program a robot.'),
        h('button', { class: 'btn go big', 'data-k': 'next', onclick: () => { ac(); sfx.pop(); step = 1; draw(); } }, "Let's go!"),
        h('button', { class: 'btn quiet wl-about', 'data-k': 'about', onclick: () => { sfx.tap(); go('about', 'welcome'); } }, ic('information'), 'For grown-ups: about WonderWorld'));
      Speech.say('Welcome to WonderWorld! Travel the world, solve puzzles, do real science, learn Japanese, and program a robot.');
      W.cur = { type: 'btn', auto: () => $('[data-k=next]', box).click() };
    } else if (step === 1) {
      const inp = h('input', { class: 'wl-name', type: 'text', maxlength: 16, value: again ? S.name || '' : '', placeholder: 'Your name', 'aria-label': 'Your name', autocomplete: 'off', autocapitalize: 'words', spellcheck: 'false', enterkeyhint: 'done' });
      const ok = h('button', { class: 'btn go big', 'data-k': 'next', disabled: true }, "That's me!");
      const save = () => { const v = cleanName(inp.value); if (!v) { inp.focus(); return; } S.name = v; saveState(); sfx.great(); step = 2; draw(); };
      inp.addEventListener('input', () => { ok.disabled = !cleanName(inp.value); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
      ok.addEventListener('click', save);
      box.append(ic('waving-hand', 'wl-globe'), h('h1', { class: 'wl-h' }, "What's your name?"), h('p', { class: 'wl-p' }, 'Type it, or ask a grown-up to help.'), inp, ok);
      Speech.say("What's your name? Type it in, or ask a grown-up to help.");
      setTimeout(() => { try { inp.focus(); } catch (e) {} }, 300);
      W.cur = { type: 'name', give: n => { inp.value = n; inp.dispatchEvent(new Event('input')); ok.click(); } };
    } else {
      const tips = [['world-map', 'Tap a flag to visit a country.'], ['check-mark-button', 'Finish its missions. The next country opens.'],
        ['trophy', 'A finished country gets a trophy on the map.'], ['sparkles', 'Bonus: Japanese and the Code Lab.'], ['house-with-garden', 'Spend your stars in your room.']];
      box.append(h('h1', { class: 'wl-h' }, 'Hi ' + S.name + '!'), h('p', { class: 'wl-p' }, 'Here is how it works.'),
        h('div', { class: 'wl-tips' }, tips.map(([i, t]) => h('div', { class: 'wl-tip' }, ic(i), h('span', null, t)))),
        h('button', { class: 'btn go big', 'data-k': 'next', onclick: () => { sfx.great(); S.welcomed = true; saveState(); go('map'); } }, 'Start exploring!'));
      Speech.say(['Hi ' + S.name + '! Here is how it works.'].concat(tips.map(x => x[1])));
      W.cur = { type: 'btn', auto: () => $('[data-k=next]', box).click() };
    }
  };
  draw();
};

/* About: for grown-ups. from: where Back goes (title, welcome, parent) */
SCREENS.about = from => {
  const back = from === 'parent' ? 'parent' : from === 'welcome' ? 'welcome' : 'title';
  const order = ORDER.filter(id => COUNTRIES[id]).map(id => COUNTRIES[id].name);
  const sec = (icon, title, ...body) => h('section', { class: 'ab-sec' }, h('h3', null, ic(icon), title), ...body);
  const p = t => h('p', null, t), li = arr => h('ul', null, arr.map(t => h('li', null, t)));
  const card = h('div', { class: 'ab-body' },
    h('div', { class: 'ab-hero' }, ic('globe-showing-asia-australia', 'wl-globe'), h('h2', null, 'About WonderWorld'), p('A free learning game for children of about 6 to 11, made in Aotearoa New Zealand. It runs in a web browser, on a laptop, tablet or phone, and keeps working without the internet once it has been opened.')),
    sec('light-bulb', 'How it teaches',
      p('A wrong answer means the question was too hard. So the game breaks it into smaller steps, gives a hands-on tool on the same picture, teaches the idea, and then asks a fresh question. It never shows or lights up the answer.'),
      p('Anything a child gets wrong is practised again until it is right first time. Maths finds each child’s level (Levels 1 to 8, roughly New Zealand Curriculum Years 1 to 8) and earlier skills come back for review.')),
    sec('world-map', 'What is inside',
      p('Countries open one at a time, in this order: ' + order.join(', ') + '. Each has five missions: maths, science labs the child runs, the human body, the periodic table, a few words of the language, and coding or making. A finished country gets a trophy on the map.'),
      p('Bonus areas: Japanese (the hiragana and katakana train line, then Kenta’s Town for real conversations), which opens when the child reaches Japan; and the Code Lab, where the child programs a robot, open from the start.')),
    sec('locked-with-key', 'Privacy',
      li(['No accounts, no adverts, no tracking. Nothing about the child is sent anywhere.',
        'Progress is saved only in this browser, on this device. The grown-ups page has a backup code to move it to another device.',
        'The microphone is used only when the child presses Record me, to hear their own voice. Nothing is saved or sent.',
        'Reward videos play from YouTube.'])),
    sec('mobile-phone', 'Put it on a phone or tablet',
      li(['Android (Chrome): open the web address, then the ⋮ menu, then Add to Home screen or Install app.',
        'iPhone or iPad (Safari): open the web address, tap Share, then Add to Home Screen.',
        'Each device keeps its own progress. Use the backup code to move it.'])),
    sec('gear', 'For grown-ups',
      p('The gear on the map opens the grown-ups page (you choose a 4-digit PIN the first time): the child’s name, the level of every skill, a test player so you can try things without changing the child’s progress, recording your own voice for te reo Māori and Japanese, and the backup code.')),
    sec('heart-hands', 'Credits',
      li(['Pictures: Fluent Emoji by Microsoft (MIT licence). Flags: Circle Flags by HatScripts (MIT).',
        'World map: Natural Earth data (public domain), through world-atlas.',
        'Letters: Fredoka and Klee One (Fontworks), SIL Open Font Licence. Kana stroke order: KanjiVG by Ulrich Apel (CC BY-SA 3.0).',
        'Voices: the speech voices on each device. Te reo Māori words play only from a real recording, which a grown-up can make on the grown-ups page.',
        'Source code: github.com/Tony-Aria-Reyna/wonderworld'])));
  show(h('div', { class: 'screen about' }, h('div', { class: 'topbar act-top' }, h('button', { class: 'round', 'aria-label': 'Back', 'data-k': 'back', onclick: () => { sfx.tap(); go(back, back === 'welcome' ? 'again' : undefined); } }, ic(back === 'parent' ? 'gear' : 'left-arrow')), h('h2', null, 'About')), card));
  W.cur = { type: 'about', back: () => $('[data-k=back]').click() };
};
