import asyncio, sys, time, json
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,768,fast=False)
        t0=time.time()
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(400)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(600)
        await page.evaluate('()=>__ww.cur.auto("m1")')
        asked=0; last=None; shots=0
        while time.time()-t0 < 240:
            await page.wait_for_timeout(250)
            st = await page.evaluate('()=>{const c=__ww.cur; if(!c) return null; const scr=document.querySelector(".screen"); return {type:c.type, txt:(document.querySelector(".bubble .txt")||{}).textContent, help: !!document.querySelector(".act.help"), scr: scr?scr.className:"", ov: !!document.querySelector(".overlay")}}')
            if st is None: continue
            if 'country' in st['scr'] and not st['ov'] and asked>3: break
            sig=json.dumps(st)
            if sig==last: continue
            last=sig
            if st['type']=='num':
                asked+=1; bad = asked==2 or asked==3
                await page.wait_for_timeout(500)
                if shots<3 and st['help']: shots+=1; await page.screenshot(path=f'shots/real_help{shots}.png')
                await page.evaluate('(b)=>{const c=__ww.cur; if(c&&c.type==="num") c.give(b? c.answer+1 : c.answer)}', bad)
            elif st['type']=='choice':
                asked+=1; await page.wait_for_timeout(400); await page.evaluate('()=>{const c=__ww.cur; if(c&&c.type==="choice") c.give(c.answer)}')
            elif st['type']=='btn':
                await page.wait_for_timeout(700)
                if st['ov']: await page.screenshot(path='shots/real_done.png')
                elif 'Now you know' in (st['txt'] or ''): await page.screenshot(path='shots/real_explain.png')
                await page.evaluate('()=>{const c=__ww.cur; if(c&&c.auto) c.auto()}')
        print('seconds', round(time.time()-t0), 'asked', asked, logs)
        print(await page.evaluate('()=>JSON.stringify(__ww.S().missions)'))
        # leave mid-mission and start another: no errors expected
        await page.evaluate('()=>__ww.go("country","egypt")'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(800)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(800)
        await page.click('.act-top .round'); await page.wait_for_timeout(600)
        print('after leaving:', await page.evaluate('()=>document.querySelector(".screen").className'), logs)
        await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(300)
        for d in '2468':
            await page.click(f'.pinpad .np button:text-is("{d}")')
        await page.wait_for_timeout(500); await page.screenshot(path='shots/parent.png', full_page=False)
        print('parent text:', (await page.inner_text('.pa-body'))[:900].replace('\n',' | '))
        await b.close()
asyncio.run(main())
