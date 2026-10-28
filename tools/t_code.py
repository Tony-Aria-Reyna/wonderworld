# Real mouse on the Camel coder: tap, drag in, reorder, remove, repeat blocks, and the help when she is stuck.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,768,fast=True)
        st = lambda: page.evaluate('()=>__ww.cur.state()')
        txt = lambda: page.inner_text('.bubble .txt')
        async def c(sel, i=0):
            r = await page.locator(sel).nth(i).bounding_box(); return r['x']+r['width']/2, r['y']+r['height']/2
        async def tap(sel, i=0):
            x,y = await c(sel,i); await page.mouse.click(x,y); await page.wait_for_timeout(60)
        async def drag(a, b, ai=0, bi=0, off=None):
            x,y = await c(a,ai); 
            if off: X,Y = off
            else: X,Y = await c(b,bi)
            await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move((x+X)/2,(y+Y)/2,steps=4); await page.mouse.move(X,Y,steps=4); await page.mouse.up(); await page.wait_for_timeout(80)
        async def wait_idle():
            for _ in range(80):
                await page.wait_for_timeout(60)
                s = await st()
                if not s['running']: return s
        await page.evaluate('()=>{["m1","m2","m3"].forEach(m=>__ww.S().missions["egypt."+m]={done:true}); __ww.go("country","egypt"); __ww.cur.auto("m4")}'); await page.wait_for_timeout(200)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(200)      # Let's go
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500)      # build the pyramid
        print('PUZZLE 1:', await txt())
        for _ in range(3): await tap('.arrows .r')
        for _ in range(2): await tap('.arrows .u')
        print(' tapped in      :', (await st())['prog'])
        await drag('.pb','.pb',3,0); print(' dragged 4th to 1st:', (await st())['prog'])
        await drag('.pb',None,0,0,off=(300,300)); print(' dragged 1st out :', (await st())['prog'])
        await drag('.arrows .u','.pb',0,1); print(' dragged up arrow onto box 2:', (await st())['prog'])
        await tap('.pb',1); await tap('.btn.quiet'); print(' selected box 2, pressed rub-out:', (await st())['prog'])
        await page.keyboard.press('ArrowDown'); print(' keyboard down arrow:', (await st())['prog'])
        await tap('.btn.go'); s = await wait_idle(); print(' RUN 1 ->', s['mode'], '|', await txt())
        await tap('.btn.go'); s = await wait_idle(); print(' RUN 2 ->', s['mode'], '| target:', s['target'], '|', await txt())
        print('   numbered squares:', await page.evaluate('()=>[...document.querySelectorAll(".cell.hintp")].map(c=>c.dataset.n).join(",")'))
        await page.screenshot(path='shots/code_help1.png')
        await tap('.arrows .l'); await tap('.btn.go'); s = await wait_idle(); print(' wrong again ->', await txt(), '| guiding:', s['guide'])
        await tap('.arrows .l'); await tap('.btn.go'); s = await wait_idle(); print(' wrong again ->', await txt(), '| guiding:', s['guide'])
        print('   lit-up buttons (must be none):', await page.evaluate('()=>document.querySelectorAll(".answer .glow").length'))
        await page.evaluate('()=>__ww.cur.autoLeg()'); await page.wait_for_timeout(100)
        await page.screenshot(path='shots/code_help2.png')
        s = await wait_idle(); print(' next bit -> target:', s['target'], '|', await txt(), '| numbered:', await page.evaluate('()=>[...document.querySelectorAll(".cell.hintp")].map(c=>c.dataset.n).join(",")'))
        await tap('.arrows .l'); await tap('.btn.go'); s = await wait_idle(); print(' wrong on this bit ->', await txt())
        await page.screenshot(path='shots/code_help3.png')
        await page.evaluate('()=>__ww.cur.autoLeg()'); s = await wait_idle(); await page.wait_for_timeout(300); print(' after all bits ->', (await st())['mode'], '|', await txt())
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(1500)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(2500)   # puzzle 2
        print('PUZZLE 3:', await txt())
        await tap('.reps button',2); print(' ×3 before any arrow:', (await st())['prog'] or '(nothing)', '|', await txt())
        await tap('.arrows .u'); await tap('.reps button',2); print(' up, then ×3:', (await st())['prog'])
        await tap('.arrows .r'); await drag('.reps button','.pb',4,1); print(' right, then dragged ×5 onto it:', (await st())['prog'])
        await page.screenshot(path='shots/code_rep.png')
        await tap('.btn.go'); await page.wait_for_timeout(1500)
        print(' finished:', await page.evaluate('()=>!!document.querySelector(".overlay")'), '| errors:', logs)
        await b.close()
asyncio.run(main())
