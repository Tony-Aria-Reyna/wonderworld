import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        for (w,h,tag) in [(1366,768,'lap'),(412,915,'ph')]:
            b,page,logs = await boot(p,w,h)
            await page.evaluate('()=>{__ww.S().missions["egypt.m1"]={done:true}; __ww.go("country","egypt"); __ww.cur.auto("m2")}'); await page.wait_for_timeout(200)
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
            await page.screenshot(path=f'shots/body_{tag}_a.png')
            await page.evaluate('()=>{__ww.fast=false}')
            # place three by real taps: lung chip -> either lung slot
            chips = await page.evaluate('()=>[...document.querySelectorAll(".chip")].map(c=>c.innerText.trim())')
            print(chips)
            async def tap(sel, i):
                r = await page.locator(sel).nth(i).bounding_box(); await page.mouse.click(r['x']+r['width']/2, r['y']+r['height']/2)
            li=[i for i,c in enumerate(chips) if c=='Lung']
            await tap('.chip', li[0]); await tap('.slot', 2); await page.wait_for_timeout(200)   # first lung into the far-side lung slot
            await tap('.chip', li[1]); await tap('.slot', 1); await page.wait_for_timeout(200)
            await tap('.chip', chips.index('Heart')); await tap('.slot', 3); await page.wait_for_timeout(200)
            await tap('.chip', chips.index('Brain')); await tap('.slot', 0); await page.wait_for_timeout(300)
            print('filled', await page.evaluate('()=>document.querySelectorAll(".slot.filled").length'))
            await page.screenshot(path=f'shots/body_{tag}_b.png')
            print(logs); await b.close()
asyncio.run(main())
