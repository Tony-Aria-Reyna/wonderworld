# The help ladder, seen step by step: miss the question, miss a step, use the hands-on tool, answer.
# Saves one sheet per case to shots/hands_<case>.jpg.   python3 tools/t_hands.py [phone] [skill | skill+level ...] [miss=2]
# A tool worked on the picture itself (HANDS.pic: the map grid, the thermometer, the clock) is tapped with real clicks on its "hot" parts.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
from PIL import Image, ImageDraw
CASES = [('arrays',4,'egypt','m1'), ('arrays',6,'egypt','m1'), ('addsub',3,'egypt','m1'), ('patterns',2,'egypt','m1'), ('shapes',3,'egypt','m1'), ('fractions',2,'nz','m1'), ('fractions',5,'nz','m1'), ('turns',3,'nz','m1'), ('turns',4,'nz','m1'), ('graphs',3,'nz','m1'), ('graphs',5,'nz','m1'),
  ('clock',2,'japan','m1'), ('clock',5,'japan','m1'), ('clock',6,'japan','m1'), ('clock',1,'japan','m1'), ('clock',4,'japan','m1'), ('divide',2,'japan','m1'), ('divide',3,'japan','m1'), ('divide',5,'japan','m1'), ('divide',6,'japan','m1'), ('divide',7,'japan','m1'),
  ('coords',1,'australia','m1'), ('coords',2,'australia','m1'), ('coords',3,'australia','m1'), ('coords',5,'australia','m1'), ('coords',6,'australia','m1'), ('temp',1,'australia','m1'), ('temp',2,'australia','m1'), ('temp',3,'australia','m1'), ('temp',4,'australia','m1'), ('temp',5,'australia','m1'), ('temp',6,'australia','m1'),
  ('place',1,'russia','m1'), ('place',2,'russia','m1'), ('place',3,'russia','m1'), ('place',4,'russia','m1'), ('place',5,'russia','m1'), ('place',6,'russia','m1'), ('area',1,'russia','m1'), ('area',2,'russia','m1'), ('area',3,'russia','m1'), ('area',4,'russia','m1'), ('area',5,'russia','m1'), ('area',6,'russia','m1')]
async def main():
    phone = 'phone' in sys.argv; W,Hh = (412,915) if phone else (1280,800)
    async with async_playwright() as p:
        miss_at = next((int(a[5:]) for a in sys.argv[1:] if a.startswith('miss=')), 1)
        want = [a for a in sys.argv[1:] if a != 'phone' and not a.startswith('miss=')]
        for skill, lv, cid, mid in [c for c in CASES if not want or (c[0] + str(c[1])) in want or c[0] in want]:
            b,page,logs = await boot(p,W,Hh, fast=True)
            await page.evaluate('''([skill,lv,cid,mid])=>{const S=__ww.S(); S.sound=false; for(const id in __ww.SKILLS){const k=__ww.SKILLS[id]; if(k.max>1) S.skills[id]={lv:Math.min(id===skill?lv:1,k.max),streak:0,placed:true,clean:0,helped:0,review:false};}
              const m=__ww.COUNTRIES[cid].missions.find(x=>x.id===mid); m._rounds=m._rounds||m.rounds; m.rounds=[{skill}]; __ww.go("country",cid); }''', [skill,lv,cid,mid])
            await page.wait_for_timeout(200); await page.evaluate('(m)=>__ww.cur.auto(m)', mid); await page.wait_for_timeout(200)
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
            shots=[]; n=0
            async def snap(label):
                nonlocal n; n+=1; path=f'shots/_h_{skill}{lv}_{n:02d}.png'; await page.wait_for_timeout(450); await page.screenshot(path=path); shots.append((path,label + ' | ' + (await page.inner_text('.bubble .txt'))))
            async def cur(): return await page.evaluate('()=>{const c=__ww.cur; return c?{t:c.type, a:c.answer, n:c.n, help:!!document.querySelector(".act.help"), ex:!!document.querySelector(".explain")}:null}')
            async def wait_cur(types, tries=80):
                for _ in range(tries):
                    c = await cur()
                    if c and c['t'] in types: return c
                    await page.wait_for_timeout(120)
                return None
            wrong = '()=>{const c=__ww.cur; __ww.cur=null; c.give(c.type==="num"? c.answer+1 : (c.answer+1)%c.n)}'; right='()=>{const c=__ww.cur; __ww.cur=null; c.give(c.answer)}'
            c = await wait_cur(['num','choice']); await snap('1 question'); await page.evaluate(wrong)
            step=0; missed=False
            while True:
                c = await wait_cur(['num','choice','hands','btn'])
                if not c: break
                if c['t']=='btn':
                    if c['ex']: await snap('now you know'); await page.evaluate('()=>{const c=__ww.cur; __ww.cur=null; c.auto()}'); c = await wait_cur(['num','choice']); await snap('fresh question, no help'); break
                    await page.evaluate('()=>{const c=__ww.cur; __ww.cur=null; c.auto()}'); continue
                if c['t']=='hands':
                    await snap('hands-on: start')
                    SEL = 'button.htok, button.hpile, .spot, .turnbtn, .viz .hot'; toks = page.locator(SEL); k = await toks.count()
                    half = 2 if await page.locator('.viz .hot').count() else max(1, (k if await page.locator('button.htok,.spot').count() else 3)//2)   # a walk on the picture: two real taps, then look
                    for i in range(half):
                        if await page.locator(SEL).count(): await page.locator(SEL).first.click(force=True); await page.wait_for_timeout(60)
                    if await page.locator(SEL).count(): await snap('hands-on: part way')
                    await page.evaluate('()=>__ww.cur && __ww.cur.type==="hands" && __ww.cur.auto()'); c = await wait_cur(['num','choice']); await snap('asked again, her tool still showing'); await page.evaluate(right); continue
                step+=1
                if not missed and c['t']=='num' and step>=miss_at: await snap(f'step {step}'); await page.evaluate(wrong); missed=True; continue
                if c['t']=='choice' and not missed and step==1 and skill in ('turns',): await snap(f'step {step}'); await page.evaluate(right); continue
                await snap(f'step {step}'); await page.evaluate(right)
            tw = 300 if phone else 426; ims=[Image.open(s[0]).convert('RGB') for s in shots]; th=int(ims[0].height*tw/ims[0].width); cols = 5 if phone else 3; rows=-(-len(ims)//cols)
            sheet=Image.new('RGB',(cols*tw, rows*(th+16)),'white'); d=ImageDraw.Draw(sheet)
            for i,im in enumerate(ims): x,y=(i%cols)*tw,(i//cols)*(th+16); sheet.paste(im.resize((tw,th)),(x,y+16)); d.text((x+3,y+2),shots[i][1][:70],fill='black')
            out=f'shots/hands_{skill}{lv}{"_phone" if phone else ""}.jpg'; sheet.save(out,quality=86); print(out, len(shots), logs)
            await b.close()
asyncio.run(main())
