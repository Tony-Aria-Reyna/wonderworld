import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width':1280,'height':800}, has_touch=True)
        await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('file:') else r.abort())
        page = await ctx.new_page(); logs=[]
        page.on('pageerror', lambda e: logs.append(str(e)[:300]))
        import os; await page.goto('file://' + os.path.abspath('dist/WonderWorld2.html'))
        await page.evaluate('()=>{__ww.reset(); __ww.fast=false; __ww.go("title")}')   # past the Welcome guide, which a fresh page opens on
        await page.click('.title .btn'); await page.wait_for_timeout(300)
        await page.click('.pin.on', force=True); await page.wait_for_timeout(300)
        # jump to mission 2 via state, then real clicks
        await page.evaluate('()=>{__ww.S().missions["egypt.m1"]={done:true}; __ww.go("country","egypt")}'); await page.wait_for_timeout(200)
        await page.click('.node[data-n="m2"]'); await page.wait_for_timeout(300)
        await page.click('.btn.go'); await page.wait_for_timeout(300)
        # place: tap-tap for brain, drag for the rest
        chips = await page.evaluate('()=>[...document.querySelectorAll(".chip")].map(c=>c.innerText.trim())')
        async def centre(sel, nth):
            r = await page.locator(sel).nth(nth).bounding_box(); return r['x']+r['width']/2, r['y']+r['height']/2
        lung_slots=[1,2]; slot_of={'Brain':0,'Heart':3,'Stomach':4}
        for i,name in enumerate(chips):
            cx,cy = await centre('.chip', i)
            si = lung_slots.pop() if name=='Lung' else slot_of[name]
            sx,sy = await centre('.slot', si)
            if name=='Brain':
                await page.mouse.click(cx,cy); await page.wait_for_timeout(80); await page.mouse.click(sx,sy)          # tap, then tap
            elif name=='Heart':
                await page.mouse.move(cx,cy); await page.mouse.down(); await page.mouse.move(sx+14,sy+16, steps=6); await page.mouse.up()   # dropped a little off-centre
            else:
                await page.mouse.move(cx,cy); await page.mouse.down(); await page.mouse.move((cx+sx)/2,(cy+sy)/2, steps=4); await page.mouse.move(sx,sy, steps=4); await page.mouse.up()
            await page.wait_for_timeout(120)
            print('  ', name, '-> filled so far', await page.evaluate('()=>document.querySelectorAll(".slot.filled").length'))
        print('placed:', await page.evaluate('()=>document.querySelectorAll(".slot.filled").length'), 'of 4')
        await page.wait_for_timeout(600)
        # match: wrong then right by real clicks
        print('now:', await page.inner_text('.bubble .txt'))
        L = page.locator('.mcard'); n = await L.count()
        texts = [ (await L.nth(i).inner_text()).strip() for i in range(n)]
        pair = {'Heart':'Pumps blood','Lungs':'Breathe air','Brain':'Thinks','Stomach':'Mashes food'}
        await L.nth(texts.index('Heart')).click(); await L.nth(texts.index('Thinks')).click(); await page.wait_for_timeout(500)   # a wrong one
        for a,bb in pair.items():
            await L.nth(texts.index(a)).click(); await L.nth(texts.index(bb)).click(); await page.wait_for_timeout(100)
        print('matched:', await page.evaluate('()=>document.querySelectorAll(".mcard.done").length'), 'of 8')
        for _ in range(40):
            await page.wait_for_timeout(150)
            if await page.evaluate('()=>!!(__ww.cur && __ww.cur.type==="choice")'): break
        print('now:', await page.inner_text('.bubble .txt'))
        # answer a choice wrongly by a real click, then follow the help by real clicks
        async def until(js, n=60):
            for _ in range(n):
                await page.wait_for_timeout(150)
                if await page.evaluate(js): return True
            return False
        ans = await page.evaluate('()=>__ww.cur.answer'); opts = page.locator('.opt')
        await opts.nth((ans+1)%3).click()
        await until('()=>!!document.querySelector(".act.help") && !!__ww.cur && __ww.cur.type==="choice"')
        print('help mode:', await page.evaluate('()=>!!document.querySelector(".act.help")'), '| options now:', await opts.count())
        ans = await page.evaluate('()=>__ww.cur.answer'); await opts.nth(ans).click()
        await until('()=>!!document.querySelector(".explain .btn")'); await page.click('.explain .btn')
        await until('()=>!document.querySelector(".act.help") && !!__ww.cur && __ww.cur.type==="choice"')
        print('after help:', await page.inner_text('.bubble .txt'), '| help mode:', await page.evaluate('()=>!!document.querySelector(".act.help")'))
        # keyboard on number pad (laptop): go to m1
        await page.click('.act-top .round'); await page.wait_for_timeout(200)
        await page.click('.node[data-n="m1"]'); await page.wait_for_timeout(200); await page.click('.btn.go'); await page.wait_for_timeout(300)
        ans = await page.evaluate('()=>__ww.cur.answer')
        await page.keyboard.type(str(ans)); await page.keyboard.press('Enter'); await page.wait_for_timeout(300)
        print('keyboard answer accepted, stars now:', await page.evaluate('()=>__ww.S().stars'))
        saved = await page.evaluate('()=>!!localStorage.getItem("wonderworld2_v1")')
        await page.reload(); await page.wait_for_timeout(300)
        print('saved to storage on file://:', saved, '| stars after reload:', await page.evaluate('()=>__ww.S().stars'), '| errors:', logs)
        await b.close()
asyncio.run(main())
