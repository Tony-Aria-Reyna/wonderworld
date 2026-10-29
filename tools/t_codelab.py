# The Code Lab (0763-code.js, 28 October; all built stations from 29 October): every built station played through at one screen size, with wrong programs and wrong picks on purpose.
# Checks: the map's Code Lab button opens it (real click); every chip on the board can be tapped where it is drawn; a station still to come and a locked one stay shut;
# a program built with real taps (three forwards; then a repeat with a forward inside, 5 picked from its number picker) makes the robot do the job; every puzzle finishes and the
# stations are passed; nothing is off the screen or too small to tap; the robot stays on its board; the gifts arrive and the shop's "Code Lab gifts" shelf shows them;
# the passport's Code Lab button; the grown-ups note. Screenshots: shots/cl_<size>_NNN.png.   python3 tools/t_codelab.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
STATE = '''()=>{const c=__ww.cur; const where=document.querySelector('.cd-board')?'home':'';
  return c? {type:c.type, where, k:Object.keys(c).join(','), cd:c.cd||'', item:c.item||'', phase:c.phase||'', n:c.n, ans:c.answer} : {type:null, where}}'''
OFF = '''()=>{const out=[]; const W=innerWidth,H=innerHeight;
  document.querySelectorAll('.cd-pb,.cd-b,.cd-rh,.cd-n,.cd-go,.cd-del,.cd-chip,button.cd-cell,.cd-shp,.cd-test,.btn').forEach(e=>{const r=e.getBoundingClientRect(); if(!r.width||getComputedStyle(e).visibility=='hidden') return;
    if(r.right>W+1||r.bottom>H+1||r.left<-1||r.top<-1) out.push('off screen: '+e.className.split(' ').slice(0,2).join(' '));
    const min = e.matches('button.cd-cell') ? [30,30] : e.matches('.cd-b,.cd-rh,.cd-n') ? [38,38] : [40,38];
    if(e.matches('.cd-pb,.cd-b,.cd-rh,.cd-n,.cd-go,.cd-chip,button.cd-cell,.cd-shp') && (r.width<min[0]-.5||r.height<min[1]-.5)) out.push('small: '+e.className.split(' ').slice(0,2).join(' ')+' '+Math.round(r.width)+'x'+Math.round(r.height)); });
  const st=document.querySelector('.stage'); const g=document.querySelector('.cd-grid');
  if(st&&g){const S=st.getBoundingClientRect(),R=g.getBoundingClientRect(); if(R.width<60) out.push('board tiny '+Math.round(R.width)); if(R.left<S.left-2||R.right>S.right+2||R.top<S.top-2||R.bottom>S.bottom+2) out.push('board outside the stage');
    const b=document.querySelector('.cd-bot'); if(b){const B=b.getBoundingClientRect(); if(B.left<R.left-2||B.right>R.right+2||B.top<R.top-2||B.bottom>R.bottom+2) out.push('robot off its board');}}
  const ph=document.querySelector('.cd-ph'); if(ph){const P=ph.getBoundingClientRect(); if(P.right>W+1) out.push('program runs off the screen');}
  return out;}'''
TAPS = '''()=>[...document.querySelectorAll('.cd-chip')].filter(b=>{const r=b.getBoundingClientRect(),e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !e||e.closest('.cd-chip')!==b}).map(b=>b.dataset.k)'''
async def main():
    w, h = SIZES[size]; bad = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        BUILT = await page.evaluate('()=>__ww.code.CD_BUILT')
        # the map's top bar, now with the Code Lab button, with a four-digit star count: every button on the screen, none overlapping
        await page.evaluate('()=>{__ww.S().stars=9999; __ww.go("map")}'); await page.wait_for_timeout(500)
        hb = await page.evaluate('''()=>{const bs=[...document.querySelectorAll('.hud button, .hud .pill')].filter(b=>b.getBoundingClientRect().width); const rs=bs.map(b=>b.getBoundingClientRect()); const out=[];
          rs.forEach((r,i)=>{ if(r.right>innerWidth+1||r.left<-1||r.top<-1) out.push('off screen '+(bs[i].getAttribute('aria-label')||bs[i].className));
            rs.forEach((q,j)=>{ if(j>i && !bs[i].contains(bs[j]) && !bs[j].contains(bs[i]) && r.left<q.right-1 && q.left<r.right-1 && r.top<q.bottom-1 && q.top<r.bottom-1) out.push('overlap '+(bs[i].getAttribute('aria-label')||'?')+' / '+(bs[j].getAttribute('aria-label')||'?')); }); }); return out;}''')
        if hb: bad.append('map top bar: ' + str(hb))
        await page.screenshot(path=f'shots/cl_{size}_map.png')
        await page.evaluate('()=>{__ww.S().stars=0}')
        await page.click('.cd-pill'); await page.wait_for_timeout(600)
        if not await page.query_selector('.cd-board'): bad.append('the map button did not open the Code Lab')
        await page.screenshot(path=f'shots/cl_{size}_000home.png')
        cov = await page.evaluate(TAPS)
        if cov: bad.append('chips covered where drawn: ' + ','.join(cov))
        for k in ('stn-2', 'stn-5'):
            await page.click(f'.cd-chip[data-k="{k}"]'); await page.wait_for_timeout(300)
            if not await page.query_selector('.cd-board'): bad.append(k + ' opened when it should be shut')
        await page.click('.cd-chip[data-k="next"]', force=True); await page.wait_for_timeout(500)
        issues = {}; n = 0; last = None; idle = 0; miss = 0; real = set(); kinds = set()
        while idle < 60:
            await page.wait_for_timeout(70)
            st = await page.evaluate(STATE)
            sig = json.dumps(st)
            if sig == last: idle += 1; continue
            idle = 0; last = sig; n += 1
            await page.wait_for_timeout(240)
            for i in await page.evaluate(OFF): i = i + ' @' + (st.get('cd') or st.get('item') or st.get('type') or '?'); issues[i] = issues.get(i, 0) + 1
            if n < 300: await page.screenshot(path=f'shots/cl_{size}_{n:03d}.png')
            t = st['type']
            if t is None: continue
            if t == 'labmenu':
                stp = await page.evaluate('()=>(__ww.S().code||{}).st||0')
                if stp >= BUILT: break
                await page.evaluate('()=>__ww.cur && __ww.cur.pick && __ww.cur.pick("next")'); last = None; continue
            if t == 'act' and st['cd']:
                kinds.add('build')
                # real taps: three forwards for 1a; a repeat with forward inside, counted up to 5, for 3a
                if st['cd'] == '1a' and '1a' not in real:
                    real.add('1a')
                    for i in range(3): await page.click('.cd-pb[data-t="F"]'); await page.wait_for_timeout(120)
                    cnt = await page.evaluate('()=>document.querySelectorAll(".cd-prog .cd-b").length')
                    if cnt != 3: bad.append('three taps made %d blocks' % cnt)
                    await page.click('.cd-go'); last = None; continue
                if st['cd'] == '3a' and '3a' not in real and st['phase'] == 'full':
                    real.add('3a')
                    await page.click('.cd-pb[data-t="R"]'); await page.wait_for_timeout(120); await page.click('.cd-pb[data-t="F"]'); await page.wait_for_timeout(120)
                    await page.click('.cd-n'); await page.wait_for_timeout(150); await page.click('.cd-pick .cd-pk[data-n="5"]'); await page.wait_for_timeout(120)   # the number picker (29 October)
                    txt = await page.evaluate('()=>[document.querySelector(".cd-n").textContent, document.querySelectorAll(".cd-body .cd-b").length]')
                    if txt != ['×5', 1]: bad.append('the repeat block did not build as tapped: ' + str(txt))
                    await page.click('.cd-go'); last = None; continue
                if st['cd'] == '5a' and '5a' not in real and st['phase'] == 'full':
                    real.add('5a')   # an if inside a repeat, with real taps: repeat, forward, if (asks about blue), turn clockwise inside the if; the repeat's number 6 from its picker
                    for t in ('R', 'F', 'I', 'cw'): await page.click(f'.cd-pb[data-t="{t}"]'); await page.wait_for_timeout(120)
                    await page.click('.cd-k-R > .cd-n'); await page.wait_for_timeout(150); await page.click('.cd-pick .cd-pk[data-n="6"]'); await page.wait_for_timeout(120)
                    got = await page.evaluate('()=>__ww.cur.prog()')
                    if got != 'R6(F I(blue: cw))': bad.append('the if block did not build as tapped: ' + got)
                    await page.click('.cd-go'); last = None; continue
                if miss < 70 and n % 3 == 0 and st['phase'] in ('full', 'free'): miss += 1; await page.evaluate('()=>__ww.cur.miss()'); last = None; continue
                await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
            if t == 'choice':
                kinds.add(st['item'][:1] + ':choice')
                wrong = miss < 70 and n % 3 == 0 and st['n'] > 1
                if wrong: miss += 1
                await page.evaluate('(b)=>__ww.cur.give(b? (__ww.cur.answer+1)%__ww.cur.n : __ww.cur.answer)', wrong); last = None; continue
            if t == 'btn': await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
        C = await page.evaluate('()=>__ww.S().code')
        if not C or C.get('st') != BUILT: bad.append('stations not passed: ' + json.dumps(C))
        for k in ('1a', '3a', '5a'):
            if k not in real: bad.append('real taps not tried on ' + k)
        own = await page.evaluate('()=>__ww.code.CD_GIFTS.map(g=>!!(__ww.S().owned||{})[g.id])')
        if not all(own): bad.append('gifts not given: ' + str(own))
        # back on the home: every built chip done, badges shown
        await page.evaluate('()=>__ww.go("code")'); await page.wait_for_timeout(500)
        m = await page.evaluate('()=>({done:document.querySelectorAll(".cd-chip.done").length, soon:document.querySelectorAll(".cd-chip.soon").length, badges:document.querySelectorAll(".cd-bar .cd-badge").length})')
        if m != {'done': BUILT, 'soon': 12 - BUILT, 'badges': BUILT}: bad.append('home after every station: ' + json.dumps(m))
        await page.screenshot(path=f'shots/cl_{size}_999home.png')
        # the shop shelf, the passport button, the grown-ups note
        shelf = await page.evaluate('''()=>{__ww.go("room"); return new Promise(r=>setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Shop/.test(x.textContent)); if(b) b.click(); setTimeout(()=>{r([...document.querySelectorAll('*')].some(e=>e.children.length===0&&/Code Lab gifts/.test(e.textContent)))},500)},500))}''')
        if not shelf: bad.append('no "Code Lab gifts" shelf in the shop')
        await page.screenshot(path=f'shots/cl_{size}_shop.png')
        await page.evaluate('()=>__ww.go("passport")'); await page.wait_for_timeout(400)
        lab = await page.evaluate('''()=>{const bs=[...document.querySelectorAll('.pp-labs [data-lab]')]; const rs=bs.map(b=>b.getBoundingClientRect()); const out=[];
          rs.forEach((r,i)=>{ if(r.width<40||r.height<38) out.push('small '+bs[i].dataset.lab); if(r.right>innerWidth+1||r.left<-1) out.push('off screen '+bs[i].dataset.lab);
            rs.forEach((q,j)=>{ if(j>i && r.left<q.right-1 && q.left<r.right-1 && r.top<q.bottom-1 && q.top<r.bottom-1) out.push('overlap '+bs[i].dataset.lab+' '+bs[j].dataset.lab); }); }); return [bs.map(b=>b.dataset.lab).join(','), out];}''')
        if lab[0] != 'elements,atlas,nihongo,code' or lab[1]: bad.append('passport lab book: ' + str(lab))
        await page.screenshot(path=f'shots/cl_{size}_passport.png')
        await page.click('.pp-labs [data-lab="code"]'); await page.wait_for_timeout(500)
        if not await page.query_selector('.cd-board'): bad.append('the passport button did not open the Code Lab')
        await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(300)
        if await page.locator('.pinpad').count():
            for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
            await page.wait_for_timeout(400)
        note = await page.evaluate('()=>(document.querySelector(".cd-note")||{}).textContent||""')
        if f'{BUILT} of 12' not in note: bad.append('grown-ups note: ' + note[:80])
        print(size, 'states', n, 'wrong tries', miss, 'kinds', sorted(kinds))
        for k, v in issues.items(): print('  ', v, k)
        for x in bad: print('  WRONG', x)
        for l in logs[:20]: print('  LOG', l)
        print('TOTAL', len(issues) + len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
