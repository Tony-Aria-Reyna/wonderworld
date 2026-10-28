import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        for (w,h,tag) in [(1366,768,'lap'),(412,915,'ph')]:
            b,page,logs = await boot(p,w,h)
            await page.evaluate('()=>__ww.go("title")')   # a fresh page opens on the Welcome guide; the test player has a name, so the title shows
            await page.wait_for_timeout(400); await page.screenshot(path=f'shots/{tag}_01_title.png')
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500); await page.screenshot(path=f'shots/{tag}_02_map.png')
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500); await page.screenshot(path=f'shots/{tag}_03_country.png')
            print(tag, logs)
            await b.close()
asyncio.run(main())
