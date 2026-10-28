# The geyser lab in Shaky lab (New Zealand): plays up to the experiment, then heats the water step by step with real clicks and
# saves a strip of the five stages (shots/geyser_<size>.png). Usage: t_geyser.py [laptop|phone|phoneL]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
from PIL import Image
SIZES={'laptop':(1366,768),'phone':(360,740),'phoneL':(915,412)}
async def main():
    tag = sys.argv[1] if len(sys.argv)>1 else 'laptop'; w,h = SIZES[tag]
    async with async_playwright() as p:
        b,page,logs = await boot(p,w,h,fast=False)
        await page.evaluate('()=>{__ww.S().missions["nz.m1"]={done:true}; __ww.go("country","nz")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m2")'); await page.wait_for_timeout(400)
        # skip through to the prediction question
        for i in range(80):
            st = await page.evaluate('()=>{const c=__ww.cur; return c?{type:c.type, txt:(document.querySelector(".bubble .txt")||{}).textContent}:null}')
            if st and st['type']=='choice' and 'trapped underground' in st['txt']: break
            if st and st['type'] in ('btn','act'): await page.evaluate('()=>__ww.cur.auto()')
            await page.wait_for_timeout(350)
        shots=[]; snap = lambda n: page.screenshot(path=f'shots/_g{n}.png')
        print(tag, 'question:', st['txt'], '| options:', [await x.inner_text() for x in await page.locator('.opt').all()])
        await snap(0); shots.append(0)
        await page.locator('.opt').first.click(); await page.wait_for_timeout(3200)
        for n in range(1,4):
            await page.wait_for_selector('.answer .btn'); label = await page.inner_text('.answer .btn'); before = await page.inner_text('.bubble .txt')
            if n == 1: await snap(1); shots.append(1); print('  start ->', before)
            await page.click('.answer .btn'); await page.wait_for_timeout(2300)
            print(f'  [{label}] ->', await page.inner_text('.bubble .txt'), '|', await page.text_content('.gtemp'), '| state', await page.get_attribute('.geyser','data-s'))
            await snap(n+1); shots.append(n+1)
        await page.wait_for_function('document.querySelector(".geyser").dataset.s==="erupt"'); await page.wait_for_timeout(1500)
        print('  then ->', await page.inner_text('.bubble .txt')); await snap(5); shots.append(5)
        await page.wait_for_selector('.answer .btn', timeout=20000); print('  after ->', await page.inner_text('.bubble .txt'))
        await page.click('.answer .btn'); await page.wait_for_timeout(600); print('  try it ->', await page.inner_text('.bubble .txt')); await snap(6); shots.append(6)
        ims=[Image.open(f'shots/_g{n}.png') for n in shots]; cols = 2 if w>h else 4; tw = 660 if w>h else 330; th=int(ims[0].height*tw/ims[0].width); rows=-(-len(ims)//cols)
        sheet=Image.new('RGB',(cols*tw,rows*th),'white')
        for i,im in enumerate(ims): sheet.paste(im.convert('RGB').resize((tw,th)),((i%cols)*tw,(i//cols)*th))
        sheet.save(f'shots/geyser_{tag}.png'); print('  errors:', logs); await b.close()
asyncio.run(main())
