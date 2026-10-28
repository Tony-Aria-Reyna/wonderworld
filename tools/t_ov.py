import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        for (w,h,tag) in [(1366,768,'lap'),(412,915,'ph')]:
            b,page,logs = await boot(p,w,h)
            await page.evaluate('()=>{__ww.go("country","egypt"); __ww.S().videos.egypt={heart:1}; __ww.videoWon("egypt",{id:"heart"})}'); await page.wait_for_timeout(300); await page.screenshot(path=f'shots/ov_{tag}_1.png')
            await page.evaluate('()=>{document.querySelectorAll(".overlay").forEach(o=>o.remove()); __ww.videoWon("egypt",{choose:["pyr","eg101","lungs"]})}'); await page.wait_for_timeout(300); await page.screenshot(path=f'shots/ov_{tag}_2.png')
            await page.evaluate('()=>{document.querySelectorAll(".overlay").forEach(o=>o.remove()); __ww.cinema("egypt")}'); await page.wait_for_timeout(300); await page.screenshot(path=f'shots/ov_{tag}_3.png')
            await page.click('.vid:not(.locked)'); await page.wait_for_timeout(400); await page.screenshot(path=f'shots/ov_{tag}_4.png')
            print(tag, logs)
            await b.close()
asyncio.run(main())
