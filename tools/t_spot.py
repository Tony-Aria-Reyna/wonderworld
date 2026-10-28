import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,768)
        out=[]
        # shapes at level 3 (corners), then body questions: record prompt + what the stage shows + the right answer
        await page.evaluate('()=>{const S=__ww.S(); S.skills.shapes={lv:3,streak:0,placed:true,clean:0,helped:0}; S.missions["egypt.m1"]={done:true}; __ww.go("country","egypt"); __ww.cur.auto("m1")}'); await page.wait_for_timeout(200)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(150)
        for k in range(4):
            t = await page.inner_text('.bubble .txt')
            if 'does the' in t: await page.screenshot(path='shots/spot_shape.png'); out.append('SHAPE: '+t)
            await page.evaluate('()=>{const c=__ww.cur; c.give(c.answer)}'); await page.wait_for_timeout(200)
        await page.evaluate('()=>{__ww.go("country","egypt"); __ww.cur.auto("m2")}'); await page.wait_for_timeout(200)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(150)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
        for k in range(2):
            info = await page.evaluate('()=>{const c=__ww.cur; const o=[...document.querySelectorAll(".opt")]; return {q:document.querySelector(".bubble .txt").textContent, right:o[c.answer].innerText.trim(), stageImg:(document.querySelector(".stage img")||{}).src===o[c.answer].querySelector("img,svg")?.src}}')
            out.append('BODY: '+str(info)); await page.screenshot(path=f'shots/spot_body{k}.png')
            await page.evaluate('()=>{const c=__ww.cur; c.give(c.answer)}'); await page.wait_for_timeout(250)
        print('\n'.join(out)); print(logs); await b.close()
asyncio.run(main())
