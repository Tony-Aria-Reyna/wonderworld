# One skill at one level, as she sees it: the question, the first help step, and the hands-on tool part-way and finished. Saved side by side to shots/q_<skill><level>[_phone].png.
# python3 tools/t_q.py <skill> <level> [country] [phone]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
from PIL import Image
async def main():
    args = [a for a in sys.argv[1:] if a != 'phone']; phone = 'phone' in sys.argv
    skill, lv = args[0], int(args[1]); cid = args[2] if len(args) > 2 else 'brazil'; W,Hh = (360,740) if phone else (1280,800)
    async with async_playwright() as p:
        b,page,logs = await boot(p,W,Hh, fast=True)
        await page.evaluate('''([skill,lv,cid])=>{__ww.setPlayer("test"); const S=__ww.S(); S.sound=false; for(const id in __ww.SKILLS){const k=__ww.SKILLS[id]; if(k.max>1) S.skills[id]={lv:Math.min(id===skill?lv:1,k.max),streak:0,placed:true,clean:0,helped:0,review:false};}
          const m=__ww.COUNTRIES[cid].missions[0]; m.rounds=[{skill}]; __ww.go("country",cid); }''', [skill,lv,cid])
        await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(400)
        shots = []
        async def snap(): 
            f = f'shots/_q{len(shots)}.png'; await page.screenshot(path=f); shots.append(f)
        wrong = '()=>{const c=__ww.cur; __ww.cur=null; c.give(c.type==="num"? c.answer+1 : (c.answer+1)%c.n)}'
        await snap(); print('question:', await page.inner_text('.bubble .txt'))
        await page.evaluate(wrong); await page.wait_for_timeout(500)
        for _ in range(60):
            c = await page.evaluate('()=>{const c=__ww.cur; return c?c.type:null}')
            if c in ('num','choice') and await page.locator('.act.help').count(): break
            if c == 'btn': await page.evaluate('()=>{const c=__ww.cur; __ww.cur=null; c.auto()}')
            await page.wait_for_timeout(120)
        await snap(); print('step:', await page.inner_text('.bubble .txt'))
        await page.evaluate(wrong); await page.wait_for_timeout(400)
        for _ in range(60):
            c = await page.evaluate('()=>{const c=__ww.cur; return c?c.type:null}')
            if c == 'hands': break
            if c == 'btn': await page.evaluate('()=>{const c=__ww.cur; __ww.cur=null; c.auto()}')
            await page.wait_for_timeout(120)
        print('tool:', await page.inner_text('.bubble .txt'))
        hot = page.locator('.viz .hot'); n = await hot.count()
        if n:
            await (page.locator('.viz .hot[data-i]').last if await page.locator('.viz .hot[data-i]').count() else hot.first).click(force=True); await page.wait_for_timeout(150)
            if await page.locator('.viz .hot').count(): await page.locator('.viz .hot').first.click(force=True); await page.wait_for_timeout(150)
        await snap()
        await page.evaluate('()=>{ if(__ww.cur && __ww.cur.type==="hands") __ww.cur.auto() }'); await page.wait_for_timeout(700); await snap(); print('asks:', await page.inner_text('.bubble .txt'), logs)
        ims = [Image.open(f) for f in shots]; sheet = Image.new('RGB', (sum(i.width for i in ims), ims[0].height), 'white'); x = 0
        for i in ims: sheet.paste(i, (x, 0)); x += i.width
        if not phone: sheet = sheet.resize((sheet.width // 2, sheet.height // 2))
        out = f'shots/q_{skill}{lv}{"_phone" if phone else ""}.png'; sheet.save(out); print(out); await b.close()
asyncio.run(main())
