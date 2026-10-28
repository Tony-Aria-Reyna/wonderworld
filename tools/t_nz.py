# Close-up pictures of the New Zealand art for a visual check: python3 tools/t_nz.py
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,768, fast=False)
        await page.evaluate('()=>{__ww.S().sound=false}')
        # 1 birds and small art
        await page.evaluate('''()=>{const nz=__ww.COUNTRIES.nz; const items=nz.missions[2].rounds[5].items;
          const extra=[]; const E=__ww.SKILLS.earth.bank, T=__ww.SKILLS.scithink.bank.filter(i=>i.tag==='nz');
          E.concat(T).forEach(i=>{ if(i.pic&&i.pic.svg) extra.push(['',i.pic]); i.ask.forEach(q=>{ if(q.pic&&q.pic.svg) extra.push(['',q.pic]); q.o.forEach(o=>{ if(o.icon&&o.icon.svg) extra.push([o.label,o.icon]); }); }); });
          const seen=new Set(); const ex=extra.filter(e=>{ if(seen.has(e[1].svg)) return false; seen.add(e[1].svg); return true; });
          const d=document.createElement('div'); d.id='gal'; d.style.cssText='position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-wrap:wrap;gap:14px;padding:14px;align-content:flex-start;font:600 20px Fredoka';
          items.forEach(it=>{ const c=document.createElement('div'); c.style.cssText='width:230px;text-align:center'; c.innerHTML='<div style="width:230px;height:230px;background:#F4FBF0;border-radius:20px">'+it.art.svg+'</div>'+it.label; d.append(c); });
          ex.forEach(e=>{ const c=document.createElement('div'); c.style.cssText='width:110px;text-align:center;font-size:13px'; c.innerHTML='<div style="width:110px;height:110px;background:#F4FBF0;border-radius:14px">'+e[1].svg+'</div>'+e[0]; d.append(c); });
          const t=document.createElement('div'); t.style.cssText='width:100%;font:700 44px Fredoka'; t.textContent='Tūī kākāpō takahē kererū pīwakawaka kororā whetū Māori ĀĒĪŌŪ'; d.append(t);
          const t2=document.createElement('div'); t2.style.cssText='width:100%;font:500 30px Fredoka'; t2.textContent='Tūī kākāpō takahē kererū pīwakawaka kororā whetū Māori ĀĒĪŌŪ (500)'; d.append(t2);
          document.body.append(d);}''')
        await page.wait_for_timeout(400); await page.screenshot(path='shots/nz_gallery.png')
        await page.evaluate('()=>document.getElementById("gal").remove()')
        # 2 the country scene, landscape and portrait
        await page.evaluate('()=>__ww.go("country","nz")'); await page.wait_for_timeout(700); await page.screenshot(path='shots/nz_scene_laptop.png')
        await page.set_viewport_size({'width':412,'height':915}); await page.wait_for_timeout(700); await page.screenshot(path='shots/nz_scene_phone.png')
        await page.set_viewport_size({'width':1366,'height':768}); await page.wait_for_timeout(300)
        # 3 Shaky lab: the Earth board before and after, the match, the shake test in real time
        await page.evaluate('()=>{const S=__ww.S(); S.missions["nz.m1"]={done:true}; S.missions["nz.m2"]={done:true}; S.missions["nz.m3"]={done:true}; __ww.go("country","nz")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>{__ww.fast=true; __ww.cur.auto("m2")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(600); await page.screenshot(path='shots/nz_earth_a.png')
        await page.evaluate('()=>{__ww.fast=false; __ww.cur.auto()}'); await page.wait_for_timeout(500); await page.screenshot(path='shots/nz_earth_b.png')
        await page.evaluate('()=>{__ww.fast=true}')
        for k in range(40):
            st = await page.evaluate('()=>{const c=__ww.cur; return c?{t:c.type, txt:document.querySelector(".bubble .txt").textContent}:null}')
            if st and 'Which tower' in st['txt']: break
            if st: await page.evaluate('()=>{const c=__ww.cur; if(c.type==="num"||c.type==="choice") c.give(c.answer); else c.auto()}')
            await page.wait_for_timeout(250)
        await page.evaluate('()=>{__ww.fast=false; __ww.cur.give(0)}')
        for t,name in [(2300,'a'),(1500,'b'),(1300,'c'),(1500,'d'),(2500,'e')]:
            await page.wait_for_timeout(t); await page.screenshot(path=f'shots/nz_quake_{name}.png')
        # 4 the bird sort and the weaving, at phone size
        await page.set_viewport_size({'width':412,'height':915})
        await page.evaluate('()=>{__ww.fast=true; __ww.go("country","nz")}'); await page.wait_for_timeout(300)
        await page.evaluate('()=>__ww.cur.auto("m3")'); await page.wait_for_timeout(300)
        for k in range(40):
            st = await page.evaluate('()=>{const c=__ww.cur; return c?{t:c.type, txt:document.querySelector(".bubble .txt").textContent}:null}')
            if st and 'Can this bird' in st['txt']: break
            if st: await page.evaluate('()=>{const c=__ww.cur; if(c.type==="num"||c.type==="choice") c.give(c.answer); else c.auto()}')
            await page.wait_for_timeout(250)
        await page.wait_for_timeout(500); await page.screenshot(path='shots/nz_sort_phone.png')
        print(logs)
        await b.close()
asyncio.run(main())
