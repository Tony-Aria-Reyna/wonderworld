/* ===== engine: runs a mission, re-teaches on a miss, and only moves on after a pass ===== */
function logReteach(skill, level) { S.log.push({ t: Date.now(), s: skill, l: level }); if (S.log.length > 400) S.log.shift(); saveState(); }

async function skillRound(ui, id, ctx, r) {
  const sk = SKILLS[id], st = skillState(id);
  let level = clamp(st.lv, 1, sk.max), helped = false, tries = 0;
  const make = retestOf => (r && r.fixed) ? r.fixed() : sk.gen(level, Object.assign({}, ctx, { retestOf }));
  let item = make(null);
  ui.wide(false);
  for (;;) {
    const ok = await askItem(ui, item);
    if (ok) break;
    /* a miss means the step was too big: break it down, explain, then try a fresh one */
    helped = true; tries++; logReteach(id, level);
    await ui.soft();
    const worked = await scaffold(ui, item);
    /* the hands-on help did not land either: this level is too hard for now, so step down rather than tell her */
    const smaller = (!worked || tries >= 2) && level > 1; if (smaller) level--;
    item = make(worked ? item : null);
    await Promise.race([ui.prompt(smaller ? "Let's try an easier one first." : worked ? 'Your turn now!' : "Let's try a different one."), wait(1800)]); ui.check();
  }
  let up = false;
  if (helped) { st.helped++; st.streak = 0; st.placed = true; st.review = true; st.lv = level; ctx.helped++; ctx.run = 0; addStars(1); }
  else { st.clean++; st.streak++; st.review = false; ctx.clean++; ctx.run = (ctx.run || 0) + 1; addStars(2);
    if ((!st.placed || st.streak >= 3) && st.lv < sk.max) { st.lv++; st.streak = 0; up = true; } }
  saveState();
  if (helped) await ui.good('You worked it out!');
  else if (ctx.run === 3 || ctx.run === 6) await ui.good(ctx.run + ' in a row!', 'fire');
  else if (up && sk.max > 1 && st.lv > 2) await ui.good('Level up! Trickier ones next.', 'rocket');
  else await ui.good();
}

/* a "{ skill: '@review' }" round brings back a levelled skill from her other travels, picking first the ones that needed re-teaching */
function reviewSkill(r, m, ctx) {
  const own = {}, seen = ctx.rev || (ctx.rev = {}); m.rounds.forEach(x => { if (x.skill) own[x.skill] = 1; });
  let c = Object.keys(S.skills).filter(id => SKILLS[id] && SKILLS[id].max > 3 && !own[id] && (S.skills[id].clean + S.skills[id].helped) > 0);
  if (!c.length) return r.or;
  const fresh = c.filter(id => !seen[id]); if (fresh.length) c = fresh;
  const need = c.filter(id => S.skills[id].review), id = pick(need.length ? need : c);
  seen[id] = 1; return id;
}

async function runMission(cid, mid) {
  const country = COUNTRIES[cid], m = country.missions.find(x => x.id === mid), key = cid + '.' + mid;
  const ui = makeUI(() => go('country', cid), cid);
  show(ui.root);
  const ctx = { used: {}, helped: 0, clean: 0, tag: cid, thing: country.thing, things: country.things, boat: country.boat }, before = S.stars;
  ui.root.classList.add('c-' + cid);
  W.cheers = country.cheers || [];
  try {
    ui.steps(m.rounds.length, -1);
    ui.wide(true); ui.stage.append(h('div', { class: 'col' }, art(m.icon, 'hero'), h('div', { class: 'bigtext', style: { 'font-size': '2.2rem' } }, m.name)));
    ui.prompt(m.intro.text, m.intro.say);
    await ui.next("Let's go!", ui.stage.firstChild);
    for (let i = 0; i < m.rounds.length; i++) {
      const r = m.rounds[i];
      ui.steps(m.rounds.length, i); ui.help(false); ui.wide(false); ui.clear();
      if (r.skill) await skillRound(ui, r.skill === '@review' ? reviewSkill(r, m, ctx) : r.skill, ctx, r);
      else { await ACTS[r.act](ui, r, ctx); ui.check(); if (r.act !== 'code') addStars(2); else addStars(3); }
    }
    ui.steps(m.rounds.length, m.rounds.length);
    const prev = S.missions[key] || {}, gold = ctx.helped === 0, firstTime = !prev.done, newGold = gold && !prev.gold;
    S.missions[key] = { done: true, gold: prev.gold || gold, n: (prev.n || 0) + 1, t: Date.now() };
    S.stickers[key] = true; S.played++;
    addStars(5 + (gold ? 5 : 0));
    const unlocked = openGates(cid, newGold);
    saveState(); ui.dispose();
    await missionDone(m, gold, S.stars - before, firstTime);
    for (const v of unlocked) await videoWon(cid, v);
    go('country', cid);
  } catch (e) { if (e !== ABORT) { console.error(e); throw e; } }
}

/* which videos has she just earned? */
function openGates(cid, newGold) {
  const c = COUNTRIES[cid], have = S.videos[cid] || (S.videos[cid] = {}), done = id => S.missions[cid + '.' + id] && S.missions[cid + '.' + id].done, won = [];
  c.gates.forEach(g => {
    if (!g.after.every(done)) return;
    if (g.give) g.give.forEach(v => { if (!have[v]) { have[v] = Date.now(); won.push({ id: v }); } });
    if (g.choose) {
      const locked = g.choose.filter(v => !have[v]);
      if (locked.length === g.choose.length) won.push({ choose: g.choose });           // first ticket: she picks
      else if (newGold && locked.length) { have[locked[0]] = Date.now(); won.push({ id: locked[0], gold: true }); }  // each new gold stamp opens another
    }
  });
  return won;
}

function missionDone(m, gold, gained, firstTime) {
  return new Promise(res => {
    sfx.win(); confetti(90);
    const o = overlay(h('div', { class: 'card' },
      art(m.sticker, 'hero sticker'),
      h('h3', null, firstTime ? 'Mission complete!' : 'You did it again!'),
      h('div', { class: 'stamp' + (gold ? ' gold' : '') }, ic(gold ? '1st-place-medal' : 'check-mark-button'), gold ? 'Gold stamp: all first try!' : 'Stamp earned'),
      h('div', { class: 'gain' }, ic('star'), '+' + gained),
      h('button', { class: 'btn go big', onclick: () => { sfx.pop(); o.remove(); res(); } }, 'Keep going')));
    Speech.say(gold ? 'Mission complete! A gold stamp. Every answer right first time!' : 'Mission complete! You kept going and worked it all out.');
    W.cur = { type: 'btn', auto: () => $('.btn', o).click() };
  });
}

function videoWon(cid, v) {
  const c = COUNTRIES[cid], have = S.videos[cid];
  return new Promise(res => {
    sfx.great(); confetti(60);
    const close = () => { o.remove(); res(); };
    let body;
    if (v.choose) {
      body = [ic('admission-tickets', 'hero'), h('h3', null, 'You won a video ticket!'), h('p', null, 'Pick the one you want to watch.'),
        h('div', { class: 'vids' }, v.choose.map(id => h('button', { class: 'vid', onclick: () => { sfx.pop(); have[id] = Date.now(); saveState(); o.remove(); playVideo(c.videos[id], res); } }, art(c.videos[id].icon), c.videos[id].title, h('small', null, c.videos[id].by))))];
      Speech.say('You won a video ticket! Pick the one you want to watch.');
    } else {
      const vid = c.videos[v.id];
      body = [ic('clapper-board', 'hero'), h('h3', null, v.gold ? 'Gold stamp! A new video!' : 'You won a video!'), h('p', null, vid.title),
        h('div', { class: 'row' }, h('button', { class: 'btn go big', onclick: () => { sfx.pop(); o.remove(); playVideo(vid, res); } }, 'Watch now'), h('button', { class: 'btn quiet', onclick: () => { sfx.tap(); close(); } }, 'Later'))];
      Speech.say('You won a video! ' + vid.title + '.');
    }
    const o = overlay(h('div', { class: 'card' }, body));
    W.cur = { type: 'btn', auto: () => { if (v.choose) { have[v.choose[0]] = Date.now(); saveState(); } close(); } };
  });
}

/* the player. Opened as a local file, YouTube may refuse to play inside the page, so the YouTube button is always there. */
function playVideo(vid, onClose) {
  Speech.stop();
  const src = 'https://www.youtube-nocookie.com/embed/' + vid.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  const watch = 'https://www.youtube.com/watch?v=' + vid.yt;
  const inPage = videoMode() !== 'yt';
  const o = overlay(h('div', { class: 'player' },
    h('h3', null, vid.title),
    inPage ? h('div', { class: 'frame', html: '<iframe src="' + src + '" title="' + vid.title.replace(/"/g, '') + '" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' })
      : h('div', { class: 'card' }, art(vid.icon, 'hero'), h('p', null, 'Your video opens in YouTube.')),
    h('div', { class: 'row' },
      h('a', { class: 'btn ' + (inPage ? 'quiet' : 'go big'), href: watch, target: '_blank', rel: 'noopener' }, inPage ? 'Not playing? Open in YouTube' : 'Watch the video'),
      h('button', { class: 'btn', onclick: () => { o.remove(); if (onClose) onClose(); } }, 'Finished'))));
  W.cur = { type: 'btn', auto: () => { o.remove(); if (onClose) onClose(); } };
}
