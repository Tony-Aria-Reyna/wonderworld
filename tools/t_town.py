# Kenta's Town (0762-town.js, 11 October; the Zoo 28 October): every built place (the Park, Home, the Zoo) played through all six steps each, with wrong picks on purpose, at one screen size.
# Checks: the town opens from the Japanese line once every station is passed; each place on the map can be tapped where it is drawn (real clicks); the five "coming soon"
# places, Home and the Zoo stay shut until their turn; every step finishes and saves; nothing is off the screen or too small; the two speech bubbles never overlap;
# a finished place puts its sticker and its friend on the map; then the grown-ups page: this week's talk card, the Japanese recording groups, and a family recording
# of こんにちは！ is found for こんにちは (Japanese punctuation is ignored). Screenshots: shots/town_<size>_NN.png
# python3 tools/t_town.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
STATE = '''()=>{const c=__ww.cur; const where=document.querySelector('.tw-map')?'map':document.querySelector('.tw-steps')?'steps':document.querySelector('.jp-line')?'line':'';
  return c? {type:c.type, where, k:Object.keys(c).join(','), ans:c.answer, n:c.n, item:c.item||'', txt:(document.querySelector('.prompt, .bubble .txt')||{}).textContent} : {type:null, where}}'''
OFF = '''()=>{const out=[]; const W=innerWidth,H=innerHeight;
  document.querySelectorAll('.jp-opt,.jp-reply,.jp-play,.btn,.tw-place,.jp-hearb,.jp-wcard,.tw-frame,.jp-done-card,.jp-scene').forEach(e=>{const r=e.getBoundingClientRect(); if(!r.width||getComputedStyle(e).visibility=='hidden') return;
    if(r.right>W+1||r.bottom>H+1||r.left<-1||r.top<-1) out.push('off screen: '+e.className.split(' ')[0]+' '+(e.textContent||'').slice(0,14));
    if(e.matches('.jp-opt,.jp-reply') && (r.width<40||r.height<38)) out.push('small: '+e.className+' '+Math.round(r.width)+'x'+Math.round(r.height)); });
  const a=document.querySelector('.jp-bub.me.on'), b=document.querySelector('.jp-bub.dog.on');
  if(a&&b){const A=a.getBoundingClientRect(),B=b.getBoundingClientRect(); if(A.right>B.left+1&&A.left<B.right-1&&A.bottom>B.top+1&&A.top<B.bottom-1) out.push('speech bubbles overlap: '+a.textContent.slice(0,10)+' / '+b.textContent.slice(0,10));}
  document.querySelectorAll('.jp-bub.on').forEach(x=>{const R=x.getBoundingClientRect(); x.querySelectorAll('.jp,small').forEach(t=>{const r=t.getBoundingClientRect(); if(r.width&&(r.left<R.left-1||r.right>R.right+1)) out.push('words out of their bubble: '+t.textContent.slice(0,12));});
    const S=x.closest('.jp-scene').getBoundingClientRect(); if(R.left<S.left-1||R.right>S.right+1||R.top<S.top-1) out.push('bubble leaves the scene: '+x.textContent.slice(0,12));});
  return out;}'''
TAPS = '''()=>[...document.querySelectorAll('.tw-place')].filter(b=>{const r=b.getBoundingClientRect(),e=document.elementFromPoint(r.left+r.width/2,r.top+r.height*.3);return !e||e.closest('.tw-place')!==b}).map(b=>b.dataset.k)'''
async def main():
    w, h = SIZES[size]; bad = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        # the town is shut until every station is passed
        await page.evaluate('()=>{__ww.S().jp={st:12,placed:true,met:{},stop:{},wins:12,again:[]}; __ww.go("nihongo")}'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("town")'); await page.wait_for_timeout(500)
        if await page.query_selector('.tw-map'): bad.append('the town opened before the katakana stations were passed')
        await page.evaluate('()=>{const m={}; for(let i=1;i<=15;i++) m[i]=1; __ww.S().jp={st:15,placed:true,met:m,stop:{},wins:15,again:[]}; __ww.go("map")}'); await page.wait_for_timeout(300)
        await page.click('.jp-pill'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("town")'); await page.wait_for_timeout(600)
        await page.screenshot(path=f'shots/town_{size}_00map.png')
        BUILT = await page.evaluate('()=>__ww.town.TOWN.filter(p=>!p.soon).map(p=>p.id)')
        print(size, 'built places:', BUILT)
        cov = await page.evaluate(TAPS)
        if cov: bad.append('places covered where drawn: ' + ','.join(cov))
        # a place still to come, and Home before the Park, stay shut (real clicks)
        for k in ('place-school', 'place-shop', 'place-zoo', 'place-home'):
            await page.click(f'.tw-place[data-k="{k}"]'); await page.wait_for_timeout(300)
            if not await page.query_selector('.tw-map'): bad.append(k + ' opened when it should be shut')
        # the Park, by a real click where it is drawn
        r = await page.evaluate('()=>{const r=document.querySelector(\'.tw-place[data-k="place-park"]\').getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height*.3]}')
        await page.mouse.click(r[0], r[1]); await page.wait_for_timeout(500)
        if not await page.query_selector('.tw-steps'): bad.append('the Park did not open on a real click')
        issues = {}; n = 0; last = None; idle = 0; miss = 0; seen = set()
        while idle < 60:
            await page.wait_for_timeout(70)
            st = await page.evaluate(STATE)
            sig = json.dumps(st)
            if sig == last: idle += 1; continue
            idle = 0; last = sig; n += 1
            await page.wait_for_timeout(260)
            for i in await page.evaluate(OFF): issues[i] = issues.get(i, 0) + 1
            if n < 220: await page.screenshot(path=f'shots/town_{size}_{n:03d}.png')
            t = st['type']
            if t is None: continue
            if t == 'labmenu':
                T = await page.evaluate('()=>__ww.S().jp.town.done')
                todo = [k for k in BUILT if T.get(k, 0) < 6]
                if not todo: break
                if st['where'] == 'map': await page.evaluate('(k)=>__ww.cur.pick(k)', 'place-' + todo[0])
                elif st['where'] == 'steps': await page.evaluate('()=>__ww.cur.pick("next")||__ww.cur.pick("back")')
                elif st['where'] == 'line': await page.evaluate('()=>__ww.cur.pick("town")')
                last = None; continue
            if t == 'choice':
                seen.add(st['item'][:2])
                wrong = miss < 15 * len(BUILT) and n % 3 == 0 and st['n'] > 1
                if wrong: miss += 1
                await page.evaluate('(b)=>__ww.cur.give(b? (__ww.cur.answer+1)%__ww.cur.n : __ww.cur.answer)', wrong); last = None; continue
            if t in ('btn', 'act'):
                await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
        J = await page.evaluate('()=>__ww.S().jp')
        if J.get('town', {}).get('done') != {k: 6 for k in BUILT}: bad.append('places not finished: ' + json.dumps(J.get('town')))
        # back on the map: two stickers, two friends; Home finished; the rest still to come
        await page.evaluate('()=>{__ww.go("map")}'); await page.wait_for_timeout(300); await page.click('.jp-pill'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("town")'); await page.wait_for_timeout(600)
        m = await page.evaluate('()=>({stick:document.querySelectorAll(".tw-place .tw-sticker").length, fr:document.querySelectorAll(".tw-fr").length, soon:document.querySelectorAll(".tw-place.soon.lock").length})')
        if m != {'stick': len(BUILT), 'fr': len(BUILT), 'soon': 8 - len(BUILT)}: bad.append('town map after both places: ' + json.dumps(m))
        await page.screenshot(path=f'shots/town_{size}_99map.png')
        # the grown-ups page
        await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(300)
        if await page.locator('.pinpad').count():
            for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
            await page.wait_for_timeout(400)
        g = await page.evaluate('''()=>({rows:document.querySelectorAll('.tw-card tr.tw-q').length, head:(document.querySelector('.tw-card h4')||{}).textContent, groups:[...document.querySelectorAll('.jp-recgroups button')].map(b=>b.textContent),
          copy:!!document.querySelector('[data-b=card-copy]'), print:!!document.querySelector('[data-b=card-print]'), open:!!document.querySelector('[data-b=jp-open]')})''')
        print(size, 'grown-ups:', json.dumps(g, ensure_ascii=False))
        if g['rows'] != 3 or not g['copy'] or not g['print'] or len(g['groups']) != len(BUILT) + 2 or g['open']: bad.append('grown-ups page: ' + json.dumps(g, ensure_ascii=False))
        await page.locator('.tw-card').screenshot(path=f'shots/town_{size}_card.png')
        await page.click('.jp-recgroups button >> nth=0'); await page.wait_for_timeout(300)
        sw = await page.evaluate('()=>(document.querySelector(".studio .sword")||{}).textContent')
        if not sw or 'こんにちは' not in sw: bad.append('the studio does not start on the first Park line: ' + str(sw))
        await page.screenshot(path=f'shots/town_{size}_studio.png')
        # a family recording: keyed without Japanese punctuation, so it plays for the line with or without it
        await page.evaluate('''()=>{localStorage.setItem('wonderworld2_voices', JSON.stringify({ja:{'こんにちは':'data:audio/wav;base64,AAAA'}}))}''')
        await page.reload(); await page.wait_for_timeout(500)
        c = await page.evaluate('()=>[!!__ww.clipOf("ja","こんにちは！"), !!__ww.clipOf("ja","こんにちは"), !!__ww.clipOf("ja","おはよう！")]')
        if c != [True, True, False]: bad.append('family recording lookup: ' + str(c))
        await page.evaluate('()=>localStorage.removeItem("wonderworld2_voices")')
        # the test player can open every Japanese station from the grown-ups page (only the test player)
        await page.evaluate('()=>{__ww.setPlayer("test"); __ww.go("parent")}'); await page.wait_for_timeout(300)
        if await page.locator('.pinpad').count():
            for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
            await page.wait_for_timeout(400)
        await page.click('[data-b=jp-open]'); await page.wait_for_timeout(300)
        tj = await page.evaluate('()=>[__ww.who(), __ww.S().jp.st]')
        if tj[1] != 15: bad.append('the test player could not open every station: ' + str(tj))
        await page.evaluate('()=>__ww.setPlayer("")')
        print(size, 'states', n, 'wrong picks', miss, 'kinds asked', sorted(seen))
        for k, v in issues.items(): print('  ', v, k)
        for x in bad: print('  WRONG', x)
        for l in logs[:20]: print('  LOG', l)
        print('TOTAL', len(issues) + len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
