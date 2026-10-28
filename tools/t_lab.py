# Any predict-and-test lab, played with real clicks, as a strip of its stages (shots/lab_<country>_<mission>_<size>.png).
# Usage: t_lab.py <country> <mission> "<words from the prediction question>" [laptop|phone|phoneL]
#   t_lab.py australia m2 "too warm"      t_lab.py australia m3 "leans away"      t_lab.py australia m4 "tube shorter"      t_lab.py nz m2 "trapped underground"
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
from PIL import Image
SIZES={'laptop':(1366,768),'phone':(360,740),'phoneL':(915,412)}
async def main():
    cid, mid, words = sys.argv[1], sys.argv[2], sys.argv[3]; tag = sys.argv[4] if len(sys.argv)>4 else 'laptop'; w,h = SIZES[tag]
    async with async_playwright() as p:
        b,page,logs = await boot(p,w,h,fast=False)
        await page.evaluate('()=>{__ww.setPlayer("test"); __ww.go("country","%s")}' % cid); await page.wait_for_timeout(300)
        await page.evaluate('()=>{__ww.fast=true; __ww.cur.auto("%s")}' % mid); await page.wait_for_timeout(300)
        st = None
        for i in range(200):
            st = await page.evaluate('()=>{const c=__ww.cur; return c?{type:c.type, txt:(document.querySelector(".bubble .txt")||{}).textContent}:null}')
            if st and st['type']=='choice' and words in st['txt']: break
            if st and st['type'] in ('btn','act','hands'): await page.evaluate('()=>__ww.cur.auto()')
            elif st and st['type'] in ('choice','num'): await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            await page.wait_for_timeout(120)
        else: raise Exception('never reached the question: ' + words)
        await page.evaluate('()=>{__ww.fast=false}')
        n = 0; shots = []
        async def snap():
            nonlocal n; await page.screenshot(path=f'shots/_lab{n}.png'); shots.append(n); n += 1
        print(tag, 'question:', st['txt'], '| options:', [await x.inner_text() for x in await page.locator('.opt').all()]); await snap()
        await page.locator('.opt').first.click(); await page.wait_for_timeout(3200)
        for k in range(8):
            await page.wait_for_selector('.answer .btn', timeout=30000); label = await page.inner_text('.answer .btn')
            if k == 0: print('  start ->', await page.inner_text('.bubble .txt')); await snap()
            if label in ('Next', 'I did it!'): break
            await page.click('.answer .btn'); await page.wait_for_timeout(2500)
            print(f'  [{label}] ->', await page.inner_text('.bubble .txt'), '| state', await page.get_attribute('.lab, .geyser', 'data-s')); await snap()
        print('  after ->', await page.inner_text('.bubble .txt'))
        await page.click('.answer .btn'); await page.wait_for_timeout(700); print('  try it ->', await page.inner_text('.bubble .txt'), '|', await page.inner_text('.bigtext')); await snap()
        ims=[Image.open(f'shots/_lab{k}.png') for k in shots]; cols = 2 if w>h else 4; tw = 660 if w>h else 330; th=int(ims[0].height*tw/ims[0].width); rows=-(-len(ims)//cols)
        sheet=Image.new('RGB',(cols*tw,rows*th),'white')
        for i,im in enumerate(ims): sheet.paste(im.convert('RGB').resize((tw,th)),((i%cols)*tw,(i//cols)*th))
        out=f'shots/lab_{cid}_{mid}_{tag}.png'; sheet.save(out); print('  saved', out, '| errors:', logs); await b.close()
asyncio.run(main())
