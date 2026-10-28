# The tukutuku panels. Default: one sheet of every finished panel, in its wide and its tall size (shots/weave_sheet.png).
#   t_weave.py play [phone|phoneL|tablet] [lv=N]  plays a panel with real clicks: a wrong square, the wrong thread, the guide, then finishes it.
#   t_weave.py sizes  every panel at all six screen sizes: squares at least 34 px, nothing off-screen, help never flashes a square she must weave, each panel can be finished.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES={'laptop':(1366,768),'phone':(360,740),'phoneL':(915,412),'tablet':(800,1280)}
async def sheet(p):
    b,page,logs = await boot(p,1500,1180)
    n = await page.evaluate('''()=>{ const ps=__ww.COUNTRIES.nz.missions.find(m=>m.id==="m4").rounds.find(r=>r.act==="weave").panels;
      const o=document.createElement("div"); o.style.cssText="position:fixed;inset:0;z-index:9999;background:#F3EFE4;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:auto 1fr auto 1.5fr;gap:14px 26px;padding:16px 22px;font:600 15px sans-serif";
      ps.forEach(p=>{const t=document.createElement("div"); t.textContent=p.name+"  wide "+p.wide.join("x"); o.append(t)});
      ps.forEach(p=>{const c=document.createElement("div"); c.style.cssText="min-height:0;min-width:0;padding:10px"; o.append(c); __ww.weavePreview(c,p,true)});
      ps.forEach(p=>{const t=document.createElement("div"); t.textContent="tall "+p.tall.join("x"); o.append(t)});
      ps.forEach(p=>{const c=document.createElement("div"); c.style.cssText="min-height:0;min-width:0;padding:10px"; o.append(c); __ww.weavePreview(c,p,false)});
      document.body.append(o); return ps.length }''')
    await page.wait_for_timeout(300); await page.screenshot(path='shots/weave_sheet.png'); print('panels', n, 'errors', logs); await b.close()
async def play(p, tag):
    w,h = SIZES[tag]; b,page,logs = await boot(p,w,h,fast=False)
    lv = int(next((a[3:] for a in sys.argv if a.startswith('lv=')), 1))
    await page.evaluate('(lv)=>{["m1","m2","m3"].forEach(m=>__ww.S().missions["nz."+m]={done:true}); __ww.S().weave=lv-1; __ww.go("country","nz")}', lv); await page.wait_for_timeout(300)
    await page.evaluate('()=>__ww.cur.auto("m4")'); await page.wait_for_timeout(400)
    await page.click('.btn.go'); await page.wait_for_timeout(900)
    cells = page.locator('.tcell.tapme'); print(tag, 'prompt:', await page.inner_text('.bubble .txt'), '| squares to choose from', await cells.count(), '| smallest', await page.evaluate('()=>Math.round(Math.min(...[...document.querySelectorAll(".tcell.tapme")].map(e=>e.getBoundingClientRect().width)))'), 'px')
    await page.screenshot(path=f'shots/weave_{tag}_L{lv}_a.png')
    info = await page.evaluate('()=>{const c=__ww.cur; return {panel:c.panel, wide:c.wide}}')
    # two wrong squares bring the guide
    await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(500); print('  1st miss ->', await page.inner_text('.bubble .txt'), '| numbers shown', await page.locator('.mnum').count())
    await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(500); print('  2nd miss ->', await page.inner_text('.bubble .txt'), '| numbers shown', await page.locator('.mnum').count(), '| flashing', await page.locator('.tcell.pulse').count(), '| flashing squares she must weave:', await page.locator('.tcell.tapme.pulse:not(.on)').count())
    await page.screenshot(path=f'shots/weave_{tag}_L{lv}_guide.png')
    # real clicks on every square that needs a stitch
    todo = await page.evaluate('''()=>{const p=__ww.COUNTRIES.nz.missions.find(m=>m.id==="m4").rounds.find(r=>r.act==="weave").panels.find(x=>x.id===__ww.cur.panel), wide=__ww.cur.wide, sz=wide?p.wide:p.tall, W=sz[0], H=sz[1], out=[]; let i=0;
      for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const given = x<W/2 && (p.sym===1 || y<H/2); if(given) continue; const d=x<W/2?W/2-1-x:x-W/2, e=y<H/2?Math.ceil(H/2)-1-y:y-Math.floor(H/2); const t=p.at(d,e,y,H,W)||0; if(t) out.push([i,t]); i++; } return out}''')
    wrongthread = 0
    for k,(i,t) in enumerate(todo):
        if await page.locator('.tbtn').count():
            if k == 0:   # first, the wrong thread on the right square
                other = 2 if t == 1 else 1; await page.click(f'.tbtn[data-t="{other}"]'); await cells.nth(i).click(); await page.wait_for_timeout(300); print('  wrong thread ->', await page.inner_text('.bubble .txt')); wrongthread = 1
            await page.click(f'.tbtn[data-t="{t}"]')
        await cells.nth(i).click()
    await page.wait_for_timeout(600); print('  finished ->', await page.inner_text('.bubble .txt'), '| stitches she made', await page.locator('.tcell.tapme.on').count(), 'of', len(todo))
    await page.wait_for_timeout(4800); await page.screenshot(path=f'shots/weave_{tag}_L{lv}_done.png')
    print('  buttons:', [await x.inner_text() for x in await page.locator('.wrow .btn').all()], '| errors', logs); await b.close()
ALL=[('laptop',1366,768),('tabL',1280,800),('tabP',800,1280),('phP',412,915),('phL',915,412),('phS',360,740)]
async def sizes(p):
    bad = 0
    for tag,w,h in ALL:
        out=[]
        for lv in range(1,7):
            b,page,logs = await boot(p,w,h)
            await page.evaluate('(lv)=>{["m1","m2","m3"].forEach(m=>__ww.S().missions["nz."+m]={done:true}); __ww.S().weave=lv-1; __ww.go("country","nz")}', lv); await page.wait_for_timeout(150)
            await page.evaluate('()=>__ww.cur.auto("m4")'); await page.wait_for_timeout(250)
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(450)
            r = await page.evaluate('()=>{const c=[...document.querySelectorAll(".tcell.tapme")].map(e=>e.getBoundingClientRect()), t=document.querySelector(".tuku").getBoundingClientRect(); return {n:c.length, min:Math.round(Math.min(...c.map(x=>Math.min(x.width,x.height)))), off:c.filter(x=>x.left<0||x.top<0||x.right>innerWidth||x.bottom>innerHeight).length + (t.left<0||t.right>innerWidth||t.bottom>innerHeight?1:0), pick:[...document.querySelectorAll(".tbtn")].map(e=>Math.round(e.getBoundingClientRect().height))}}')
            await page.evaluate('()=>{__ww.cur.miss(); __ww.cur.miss()}'); await page.wait_for_timeout(120)
            tell = await page.locator('.tcell.tapme.pulse:not(.on), .tcell.tapme.glow').count(); nums = await page.locator('.mnum').count()
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(350)
            done = await page.inner_text('.bubble .txt'); st = await page.evaluate('()=>__ww.S().weave')
            ok = r['min'] >= 34 and not r['off'] and not tell and nums and st == lv and not logs and all(x >= 40 for x in r['pick'])
            if not ok: bad += 1; print('  PROBLEM', tag, 'panel', lv, r, 'tells', tell, 'numbers', nums, 'woven', st, logs)
            out.append(f"{lv}:{r['min']}px"); await b.close()
        print(tag, 'smallest square per panel ->', ' '.join(out))
    print('PROBLEMS', bad); sys.exit(1 if bad else 0)
async def main():
    async with async_playwright() as p:
        if 'sizes' in sys.argv: await sizes(p)
        elif 'play' in sys.argv: await play(p, next((a for a in sys.argv[2:] if a in SIZES), 'laptop'))
        else: await sheet(p)
asyncio.run(main())
