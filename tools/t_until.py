# Play a mission until a part of the screen appears, then take a picture: python3 tools/t_until.py <country> <mission> <CSS selector> [phone|laptop|phoneL|tabP] [nth time it appears, default 1]
# Used to look at one round as she meets it (a coding grid, a lab before it starts). Saves shots/until_<country>_<mission>_<selector><n>_<size>.png
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES={'laptop':(1366,768),'phone':(360,740),'phoneL':(915,412),'tabP':(800,1280),'tabL':(1280,800)}
async def main():
    cid, mid, want = sys.argv[1], sys.argv[2], sys.argv[3]; tag = sys.argv[4] if len(sys.argv)>4 else 'phone'; nth = int(sys.argv[5]) if len(sys.argv)>5 else 1; w,h = SIZES[tag]
    async with async_playwright() as p:
        b,page,logs = await boot(p,w,h,fast=True)
        await page.evaluate('()=>{__ww.setPlayer("test"); __ww.go("country","%s")}' % cid); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("%s")' % mid); await page.wait_for_timeout(300)
        seen = 0
        for i in range(400):
            st = await page.evaluate('(q)=>{const c=__ww.cur; return {type:c?c.type:null, hit:!!document.querySelector(q)}}', want)
            if st['hit']:
                seen += 1
                if seen == nth: break
            if st['type'] == 'country': raise Exception('the mission ended before ' + want)
            if st['type'] in ('btn','act','hands'): await page.evaluate('()=>__ww.cur.auto()')
            elif st['type'] in ('choice','num'): await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            await page.wait_for_timeout(150)
        else: raise Exception('never reached ' + want)
        await page.evaluate('()=>{__ww.fast=false}'); await page.wait_for_timeout(900)
        slug = ''.join(ch for ch in want if ch.isalnum()); out = f'shots/until_{cid}_{mid}_{slug}{nth}_{tag}.png'; await page.screenshot(path=out); print(out, logs); await b.close()
asyncio.run(main())
