# Real mouse clicks and drags on naming the Earth's layers. (The tukutuku weaving is played with real clicks by t_weave.py play.)
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        for (w,h,tag) in [(1280,800,'tablet'),(412,915,'phone')]:
            b,page,logs = await boot(p,w,h, fast=False)
            await page.evaluate('()=>{const S=__ww.S(); S.sound=false; ["m1","m2","m3"].forEach(m=>S.missions["nz."+m]={done:true}); __ww.go("country","nz")}'); await page.wait_for_timeout(300)
            async def centre(loc):
                r = await loc.bounding_box(); return r['x']+r['width']/2, r['y']+r['height']/2
            # --- Earth layers: one wrong drop, then tap-tap and drags
            await page.click('.node[data-n="m2"]'); await page.wait_for_timeout(300); await page.click('.btn.go'); await page.wait_for_timeout(400)
            items = await page.evaluate('()=>__ww.COUNTRIES.nz.missions[1].rounds[0].items.map(i=>i.label)')
            chip = lambda name: page.locator('.chip', has_text=name).first
            slot = lambda i: page.locator('.slot').nth(i)
            cx,cy = await centre(chip('Crust')); sx,sy = await centre(slot(items.index('Inner core')))
            await page.mouse.move(cx,cy); await page.mouse.down(); await page.mouse.move(sx,sy,steps=6); await page.mouse.up(); await page.wait_for_timeout(200)
            print(tag, 'crust dropped on the inner core ->', await page.inner_text('.bubble .txt'), '| filled', await page.locator('.slot.filled').count())
            for k,name in enumerate(items):
                cx,cy = await centre(chip(name)); sx,sy = await centre(slot(k))
                if k % 2: await page.mouse.click(cx,cy); await page.wait_for_timeout(80); await page.mouse.click(sx,sy)
                else: await page.mouse.move(cx,cy); await page.mouse.down(); await page.mouse.move(sx+6,sy+5,steps=6); await page.mouse.up()
                await page.wait_for_timeout(150)
            tags = await page.evaluate('()=>[...document.querySelectorAll(".slot.tag")].map(s=>{const r=s.getBoundingClientRect(), b=s.closest(".board").getBoundingClientRect(); return s.textContent+" "+(r.left>=b.left-2&&r.right<=b.right+2?"inside":"OUTSIDE "+Math.round(r.left-b.left)+".."+Math.round(r.right-b.right))})')
            print(tag, 'labels on the Earth:', tags)
            await page.screenshot(path=f'shots/nzclick_{tag}_earth.png')
            print(tag, 'errors:', logs); await b.close()
asyncio.run(main())
