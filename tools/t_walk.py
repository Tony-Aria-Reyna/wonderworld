# Hands-on help worked on the picture itself (HANDS.pic): the map grid, the thermometer, the clock, the place-value chart, the solar panel, the coins and notes, the angle fan, the ruler, the box of macarons, the tiles for factors and the ice lane and timing scale for decimals.
# For each case: miss the question, miss the help step, then work the tool with real clicks.
# Checks: something on the picture can be tapped; a square, edge, row or counter takes its number where she tapped it (the last one first);
# every tap is taken; the tool finishes and asks its question; and how big the tap targets are on that screen.
# Usage: python3 tools/t_walk.py [phone] [skill ...]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
CASES = [('coords',1,'australia'), ('coords',5,'australia'), ('coords',6,'australia'), ('temp',1,'australia'), ('temp',5,'australia'), ('clock',2,'japan'), ('clock',5,'japan'),
  ('place',2,'russia'), ('place',4,'russia'), ('place',5,'russia'), ('area',2,'russia'), ('area',3,'russia'), ('area',4,'russia'), ('area',5,'russia'), ('area',6,'russia'),
  ('money',1,'brazil'), ('money',2,'brazil'), ('money',3,'brazil'), ('money',4,'brazil'), ('money',5,'brazil'), ('money',6,'brazil'), ('angles',1,'brazil'), ('angles',2,'brazil'), ('angles',3,'brazil'), ('angles',4,'brazil'), ('angles',5,'brazil'), ('angles',6,'brazil'),
  ('measure',1,'france'), ('measure',2,'france'), ('measure',3,'france'), ('measure',4,'france'), ('measure',5,'france'), ('measure',6,'france'), ('chance',1,'france'), ('chance',3,'france'), ('chance',4,'france'), ('chance',5,'france'), ('chance',6,'france'),
  ('factors',1,'greece'), ('factors',2,'greece'), ('factors',3,'greece'), ('factors',4,'greece'), ('factors',5,'greece'), ('factors',6,'greece'),
  ('decimals',1,'canada'), ('decimals',2,'canada'), ('decimals',4,'canada'), ('decimals',6,'canada')]
async def main():
    phone = 'phone' in sys.argv; W,Hh = (360,740) if phone else (1280,800); want = [a for a in sys.argv[1:] if a != 'phone']; bad = []
    async with async_playwright() as p:
        for skill, lv, cid in [c for c in CASES if not want or c[0] in want]:
            b,page,logs = await boot(p,W,Hh, fast=True)
            await page.evaluate('''([skill,lv,cid])=>{__ww.setPlayer("test"); const S=__ww.S(); S.sound=false; for(const id in __ww.SKILLS){const k=__ww.SKILLS[id]; if(k.max>1) S.skills[id]={lv:Math.min(id===skill?lv:1,k.max),streak:0,placed:true,clean:0,helped:0,review:false};}
              const m=__ww.COUNTRIES[cid].missions[0]; m.rounds=[{skill}]; __ww.go("country",cid); }''', [skill,lv,cid])
            await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
            wrong = '()=>{const c=__ww.cur; __ww.cur=null; c.give(c.type==="num"? c.answer+1 : (c.answer+1)%c.n)}'; right='()=>{const c=__ww.cur; __ww.cur=null; c.give(c.answer)}'
            tools = 0; missed_q = False; step_missed = False
            for _ in range(400):
                c = await page.evaluate('()=>{const c=__ww.cur; return c?{t:c.type, help:!!document.querySelector(".act.help"), ex:!!document.querySelector(".explain")}:null}')
                if not c: await page.wait_for_timeout(100); continue
                if c['t'] == 'hands':
                    tools += 1; tag = f'{skill} L{lv} tool {tools}'
                    hot = page.locator('.viz .hot'); n = await hot.count()
                    if not n: bad.append(tag + ': nothing on the picture to tap'); await page.evaluate('()=>__ww.cur.auto()'); continue
                    sizes = await page.evaluate('()=>[...document.querySelectorAll(".viz .hot")].map(e=>{const r=e.getBoundingClientRect(); return Math.round(Math.min(r.width,r.height))})')
                    free = page.locator('.viz .hot[data-i]'); nf = await free.count(); note = ''
                    if nf > 1:
                        last = await free.last.get_attribute('data-i'); await free.last.click(force=True); await page.wait_for_timeout(120)
                        gone = await page.locator(f'.viz .hot[data-i="{last}"]').count() == 0; first_left = await page.locator('.viz .hot[data-i="0"]').count() == 1
                        if not (gone and first_left): bad.append(tag + ': the tapped one did not take its number where she tapped')
                        note = ' | tapped the last one first: it took number 1' if gone and first_left else ''
                    taps = 1 if nf > 1 else 0
                    for _k in range(40):
                        if await page.evaluate('()=>!(__ww.cur && __ww.cur.type==="hands")'): break
                        h = page.locator('.viz .hot[data-i]') if await page.locator('.viz .hot[data-i]').count() else page.locator('.viz .hot')
                        if not await h.count(): break
                        await h.first.click(force=True); taps += 1; await page.wait_for_timeout(90)
                    await page.wait_for_timeout(250)
                    asked = await page.inner_text('.bubble .txt'); still = await page.locator('.viz .hot').count()
                    if still: bad.append(tag + ': still tappable after the last tap')
                    print(f'{tag}: {n} tap targets, smallest {min(sizes)} px, {taps} taps, then asks "{asked}"{note}')
                    await page.screenshot(path=f'shots/walk_{skill}{lv}_{tools}{"_phone" if phone else ""}.png'); continue
                if c['t'] == 'btn':
                    if c['ex']: break
                    await page.evaluate('()=>{const c=__ww.cur; __ww.cur=null; c.auto()}'); continue
                if not missed_q: missed_q = True; await page.evaluate(wrong); await page.wait_for_timeout(150); continue
                if c['help'] and c['t'] == 'num' and not step_missed: step_missed = True; await page.evaluate(wrong); await page.wait_for_timeout(150); continue
                step_missed = False; await page.evaluate(right); await page.wait_for_timeout(150)
            if not tools: bad.append(f'{skill} L{lv}: no hands-on tool came up')
            if logs: bad.append(f'{skill} L{lv}: errors {logs}')
            await b.close()
    print('PROBLEMS', len(bad), bad)
    if bad: sys.exit(1)
asyncio.run(main())
