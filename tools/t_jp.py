# The Japanese strand (0761-nihongo.js), played with the game's own hooks: a first visit (placement, meeting and tracing letters, listening, reading, building, talking, the race),
# then each station in turn. Saves a screenshot of every new screen to shots/jp_<size>_NN.png and reports page errors and anything off the screen.
# python3 tools/t_jp.py [lap|ph|phL|tabP|sm] [stations to play, default 2] [miss: also make wrong picks] [from=N: start with N stations passed]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'lap'; STN = int(sys.argv[2]) if len(sys.argv) > 2 else 2; MISS = 'miss' in sys.argv
STATE = '''()=>{const c=__ww.cur; const scr=[...document.querySelectorAll('.screen')].map(s=>s.className).join(' ');
  return c? {type:c.type, scr, k:Object.keys(c).join(','), ans:c.answer, n:c.n, txt:(document.querySelector('.bubble .txt, .bub-txt, .prompt')||{}).textContent} : {type:null, scr}}'''
OFF = '''()=>{const out=[]; const W=innerWidth,H=innerHeight;
  document.querySelectorAll('.jp-opt,.jp-tile,.jp-reply,.jp-play,.rc-opt,.btn,.jp-cc,.jp-stn,.jp-let,.jp-thing,.jp-hearb').forEach(e=>{const r=e.getBoundingClientRect(); if(!r.width||getComputedStyle(e).visibility=='hidden') return;
    if(r.right>W+1||r.bottom>H+1||r.left<-1||r.top<-1) out.push('off screen: '+e.className+' '+(e.textContent||'').slice(0,12)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round));
    if(e.matches('.jp-opt,.jp-tile,.rc-opt,.jp-reply') && (r.width<40||r.height<38)) out.push('small: '+e.className+' '+Math.round(r.width)+'x'+Math.round(r.height)); });
  document.querySelectorAll('.jp-scene,.jp-line,.jp-glyph,.jp-chart').forEach(e=>{const r={width:e.offsetWidth,height:e.offsetHeight};   /* its laid-out size: a card popping in is scaled down for a moment */ if(r.width<60||r.height<40) out.push('tiny: '+e.className+' in '+(e.parentNode&&e.parentNode.className)+' '+Math.round(r.width)+'x'+Math.round(r.height));});
  const st=document.querySelector('.stage'); if(st){const S=st.getBoundingClientRect(); document.querySelectorAll('.jp-glyph,.jp-scene,.jp-card,.jp-line,.jp-chart,.race').forEach(e=>{const r=e.getBoundingClientRect(); if(!r.width) return; if(r.left<S.left-2||r.right>S.right+2||r.top<S.top-2||r.bottom>S.bottom+2) out.push('outside the stage: '+e.className+' '+[r.left-S.left,r.top-S.top,S.right-r.right,S.bottom-r.bottom].map(Math.round));});}
  return out;}'''
async def main():
    w, h = SIZES[size]
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        FROM = [int(a[5:]) for a in sys.argv if a.startswith('from=')]
        if FROM: await page.evaluate('(n)=>{const m={}; for(let i=1;i<=n;i++) m[i]=1; __ww.S().jp={st:n,placed:true,met:m,wins:n,again:[]}}', FROM[0])
        await page.evaluate('()=>{__ww.go("map")}'); await page.wait_for_timeout(300)
        await page.screenshot(path=f'shots/jp_{size}_00map.png')
        await page.click('.jp-pill'); await page.wait_for_timeout(300)
        issues = {}; n = 0; last = None; idle = 0; miss = 0; races = 0
        while idle < 50 and races < STN:
            await page.wait_for_timeout(70)
            st = await page.evaluate(STATE)
            sig = json.dumps(st)
            if sig == last: idle += 1; continue
            idle = 0; last = sig; n += 1
            await page.wait_for_timeout(250)
            for i in await page.evaluate(OFF): issues[i] = issues.get(i, 0) + 1
            if n < 160: await page.screenshot(path=f'shots/jp_{size}_{n:02d}.png')
            t = st['type']
            if t is None: continue
            if t == 'labmenu':
                stp = await page.evaluate('()=>__ww.S().jp && __ww.S().jp.st')
                if (stp or 0) >= STN + (FROM[0] if FROM else 0): break
                await page.evaluate('()=>__ww.cur.pick("next")'); last = None; continue
            if t == 'choice':
                bad = MISS and miss < 40 and n % 3 == 0
                if bad: miss += 1
                await page.evaluate('(b)=>__ww.cur.give(b? (__ww.cur.answer+1)%__ww.cur.n : __ww.cur.answer)', bad); last = None; continue
            if t == 'btn':
                if 'more' in st['k']: races += 1
                await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
            if t == 'act':
                if MISS and 'miss' in st['k'] and miss < 40 and n % 4 == 0: miss += 1; await page.evaluate('()=>__ww.cur.miss()'); last = None; continue
                await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
        S = await page.evaluate('()=>__ww.S().jp')
        print(size, 'states', n, 'jp', json.dumps(S)[:200])
        for k, v in issues.items(): print('  ', v, k)
        for l in logs[:20]: print('  LOG', l)
        print('TOTAL', len(issues) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
