# The country path screen at laptop and phone size: python3 tools/t_scene.py <country>
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    cid = sys.argv[1] if len(sys.argv) > 1 else 'nz'
    async with async_playwright() as p:
        for (w,h,tag) in [(1366,768,'laptop'),(412,915,'phone'),(800,1280,'tablet')]:
            b,page,logs = await boot(p,w,h, fast=False)
            await page.evaluate('(c)=>{__ww.S().sound=false; __ww.go("country",c)}', cid); await page.wait_for_timeout(800)
            await page.screenshot(path=f'shots/scene_{cid}_{tag}.png'); await b.close()
asyncio.run(main())
