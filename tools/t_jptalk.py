# Every Japanese conversation's speech bubbles, and the new-carriage prize (0761-nihongo.js). Tony, 11 October: "the speach bubbles are overlapped", and the prize train ran
# off a phone. For every exchange in every station (Kenta's line, her reply, and Kenta's answer), both bubbles are drawn in the real talk scene, as the game draws them;
# the check fails if they overlap, if a line runs out of its bubble, or if a bubble leaves the scene. Then the whole train, a carriage for every station, is drawn on the prize screen and must fit.
# python3 tools/t_jptalk.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
CHECK = r'''async () => { const J = __ww.jp, out = [], stage = document.querySelector('.stage'); let pairs = 0;
  const box = r => [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
  /* a line of a bubble that starts with ！？。、 (11 October: "こんにちは / ！") */
  const lead = (e, l, where) => { const sp = e.querySelector('.jp'); if (!sp) return; const rng = document.createRange(), tw = document.createTreeWalker(sp, NodeFilter.SHOW_TEXT), lines = {}; let nd;
    while ((nd = tw.nextNode())) for (let i = 0; i < nd.length; i++) { rng.setStart(nd, i); rng.setEnd(nd, i + 1); const rc = rng.getBoundingClientRect(); if (rc.width) { const k = Math.round(rc.top / 4); lines[k] = (lines[k] || '') + nd.textContent[i]; } }
    Object.values(lines).forEach(x => { if (/^[！？。、]/.test(x.trim())) out.push(where + ': a line of the bubble starts with ' + x.trim()[0] + ': ' + l); }); };
  if (window.__OLD) { const c = document.createElement('style'); c.textContent = '.jp-nb{white-space:normal}'; document.head.append(c); }
  const ov = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  for (const [i, st] of J.JP_ST.entries()) for (const t of st.talk) { if (t.count) continue;
    const replies = t.any ? t.opts.map(o => [o[0], o[1]]) : [[J.jpFill(t.me), (t.meEn || '').replace('{en}', 'the player')]];
    for (const [dl, de] of [[t.dog, t.dogEn]].concat(t.after ? [[t.after, t.afterEn]] : [])) for (const [ml, me] of replies) {
      const sc = J.jpScene(t.scene); stage.innerHTML = ''; const talk = document.createElement('div'); talk.className = 'jp-talk'; talk.append(sc.box); stage.append(talk);
      await sc.say('dog', dl, de); await sc.say('me', ml, me); await new Promise(r => setTimeout(r, 380)); pairs++;
      const s = sc.box.getBoundingClientRect(), a = sc.dogBub.getBoundingClientRect(), b = sc.myBub.getBoundingClientRect();
      if (ov(a, b) > 0) out.push('station ' + (i + 1) + ': bubbles overlap: ' + dl + ' / ' + ml + ' ' + JSON.stringify([box(a), box(b)]));
      [[sc.dogBub, dl], [sc.myBub, ml]].forEach(([e, l]) => { lead(e, l, 'station ' + (i + 1)); if (e.scrollWidth > e.clientWidth + 1) out.push('station ' + (i + 1) + ': line runs out of its bubble: ' + l);
        const r = e.getBoundingClientRect(); if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1) out.push('station ' + (i + 1) + ': bubble leaves the scene: ' + l); }); } }
  /* KENTA'S TOWN (11 October): each line of a dialogue with the line after it, and each role-play turn with every reply. Also fails a bubble taller than the scene */
  const TW = __ww.town, fill = x => TW.townFill(x);
  for (const P of TW.TOWN.filter(p => !p.soon)) { const sets = [];
    for (let k = 0; k + 1 < P.watch.length; k++) { const a = P.watch[k], b = P.watch[k + 1]; const d = a[0] === 'dog' ? a : b, m = a[0] === 'dog' ? b : a; if (d[0] === 'dog' && m[0] !== 'dog') sets.push([d[1], d[2], m[1], m[2], !!P.watchLeft]); }
    P.role.forEach(t => (t.any ? t.any : [[t.me, t.meEn]]).forEach(r => sets.push([t.dog, t.dogEn, fill(r[0]), fill(r[1]), false])));
    for (const [dl, de, ml, me, fr] of sets) {
      const sc = J.jpScene(P.scene, fr ? { left: __ww.art(P.friend.art) } : {}); stage.innerHTML = ''; const talk = document.createElement('div'); talk.className = 'jp-talk'; talk.append(sc.box); stage.append(talk);
      await sc.say('dog', dl, de); await sc.say('me', ml, me); await new Promise(r => setTimeout(r, 380)); pairs++;
      const s = sc.box.getBoundingClientRect(), a = sc.dogBub.getBoundingClientRect(), b = sc.myBub.getBoundingClientRect();
      if (ov(a, b) > 0) out.push('town ' + P.id + ': bubbles overlap: ' + dl + ' / ' + ml);
      [[sc.dogBub, dl], [sc.myBub, ml]].forEach(([e, l]) => { lead(e, l, 'town ' + P.id); if (e.scrollWidth > e.clientWidth + 1) out.push('town ' + P.id + ': line runs out of its bubble: ' + l);
        const r = e.getBoundingClientRect(); if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1) out.push('town ' + P.id + ': bubble leaves the scene: ' + l); }); } }
  /* the prize train, every carriage */
  stage.innerHTML = ''; const pz = document.createElement('div'); pz.className = 'jp-prize'; const tr = J.jpTrain(J.JP_ST.length, true); pz.append(tr); stage.append(pz); J.jpFitRow(tr, pz, 2.4);
  await new Promise(r => setTimeout(r, 1200)); const S = stage.getBoundingClientRect(), T = tr.getBoundingClientRect();
  if (T.left < S.left - 1 || T.right > S.right + 1) out.push('the prize train is cut off: ' + JSON.stringify([box(T), box(S)]));
  if (T.width < S.width * .5 && !/scale\(2.400\)/.test(tr.style.transform)) out.push('the prize train is small: ' + Math.round(T.width) + ' of ' + Math.round(S.width));
  return { out, pairs }; }'''
async def main():
    w, h = SIZES[size]
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        await page.evaluate('()=>{__ww.S().jp={st:12,placed:true,met:{},stop:{},wins:12,again:[]}; __ww.go("nihongo")}'); await page.wait_for_timeout(600)
        if 'old' in sys.argv: await page.evaluate('()=>{window.__OLD=1}')
        r = await page.evaluate(CHECK)
        await page.screenshot(path=f'shots/jptalk_{size}_train.png')
        bad = r['out'] + [l for l in logs if 'PAGEERROR' in l]
        print(size, r['pairs'], 'pairs of bubbles; TOTAL', len(bad), 'problems'); [print('   ', x) for x in bad[:12]]
        await b.close()
asyncio.run(main())
