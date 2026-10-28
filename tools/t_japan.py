# Close-up pictures of the Japan art and its two new activities, played in real time: python3 tools/t_japan.py
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
ADV = '()=>{const c=__ww.cur; if(!c) return; if(c.type==="num"||c.type==="choice") c.give(c.answer); else c.auto()}'
async def upto(page, words, limit=60):
    for k in range(limit):
        st = await page.evaluate('()=>{const c=__ww.cur, b=document.querySelector(".bubble .txt"); return c?{t:c.type, txt:b?b.textContent:""}:null}')
        if st and any(w in st['txt'] for w in words): return True
        if st: await page.evaluate(ADV)
        await page.wait_for_timeout(250)
    return False
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,768, fast=False)
        await page.evaluate('()=>{__ww.S().sound=false}')
        # 1 a gallery of every hand-drawn piece, souvenir and video icon
        await page.evaluate('''()=>{const C=__ww.COUNTRIES.japan, pics=[];
          C.souvenirs.forEach(s=>pics.push([s.name,s.art])); Object.values(C.videos).forEach(v=>pics.push([v.title,v.icon]));
          ['forces','scithink'].forEach(id=>__ww.SKILLS[id].bank.filter(i=>i.tag==='japan').forEach(i=>{ pics.push(['idea',i.pic]); i.ask.forEach(q=>{ if(q.pic) pics.push(['clue',q.pic]); q.o.forEach(o=>pics.push([o.label,o.icon])); }); }));
          const seen=new Set(), d=document.createElement('div'); d.id='gal'; d.style.cssText='position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-wrap:wrap;gap:10px;padding:12px;align-content:flex-start;font:600 13px Fredoka;overflow:auto';
          pics.forEach(([name,a])=>{ const key=JSON.stringify(a); if(seen.has(key)) return; seen.add(key); const c=document.createElement('div'); c.style.cssText='width:104px;text-align:center';
            const box=document.createElement('div'); box.style.cssText='width:104px;height:104px;background:#FFF6F8;border-radius:14px;display:grid;place-items:center'; const e=__ww.art(a); e.style.width='88px'; e.style.height='88px'; box.append(e);
            c.append(box, name); d.append(c); });
          document.body.append(d);}''')
        await page.wait_for_timeout(400); await page.screenshot(path='shots/jp_gallery.png')
        await page.evaluate('()=>document.getElementById("gal").remove()')
        # 2 Train lab: naming the train, then the magnet experiment in real time
        await page.evaluate('()=>{const S=__ww.S(); S.missions["japan.m1"]={done:true}; __ww.fast=true; __ww.go("country","japan")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m2")'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500); await page.screenshot(path='shots/jp_train_a.png')
        await page.evaluate('()=>{__ww.cur.auto()}'); await page.wait_for_timeout(600); await page.screenshot(path='shots/jp_train_b.png')
        await upto(page, ['Push north towards north'])
        await page.screenshot(path='shots/jp_mag_0.png')
        await page.evaluate('()=>{__ww.fast=false; __ww.cur.give(0)}')
        for t,name in [(3300,'a'),(1300,'b'),(1700,'c'),(1900,'d'),(2200,'e')]:
            await page.wait_for_timeout(t); await page.screenshot(path=f'shots/jp_mag_{name}.png')
        # 3 the origami dog, fold by fold, in real time
        await page.evaluate('()=>{const S=__ww.S(); ["m1","m2","m3"].forEach(m=>S.missions["japan."+m]={done:true}); __ww.fast=true; __ww.go("country","japan")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m4")'); await page.wait_for_timeout(300)
        await page.evaluate('()=>{__ww.cur.auto(); __ww.fast=false}'); await page.wait_for_timeout(700)
        n = 0
        for k in range(14):
            st = await page.evaluate('()=>{const c=__ww.cur; return c?c.type:null}')
            await page.screenshot(path=f'shots/jp_fold_{n:02d}.png'); n += 1
            if st == 'btn': break
            if st == 'act':
                await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(350); await page.screenshot(path=f'shots/jp_fold_{n:02d}_mid.png'); n += 1
            await page.wait_for_timeout(4200)
        # 4 at phone size: the fold, a hiragana word and the word cards
        await page.set_viewport_size({'width':412,'height':915})
        await page.evaluate('()=>{__ww.fast=true; __ww.go("country","japan")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m4")'); await page.wait_for_timeout(300); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500); await page.screenshot(path='shots/jp_fold_phone.png')
        await page.evaluate('()=>__ww.go("country","japan")'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m3")'); await page.wait_for_timeout(300)
        await upto(page, ['Tap each card']); await page.wait_for_timeout(300); await page.screenshot(path='shots/jp_words_phone.png')
        await upto(page, ['Read the hiragana']); await page.wait_for_timeout(300); await page.screenshot(path='shots/jp_kana_phone.png')
        print(logs)
        await b.close()
asyncio.run(main())
