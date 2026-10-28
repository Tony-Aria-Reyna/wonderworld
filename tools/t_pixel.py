# Japan's pixel pictures. Default: a sheet of every picture, big and small, each frame (shots/pixel_sheet.png).
#   t_pixel.py play [laptop|phone|phoneL|tablet] [n=2]  plays picture n with real clicks and a real drag: a wrong square, the wrong colour, the guide, then finishes it and checks it moves.
#   t_pixel.py sizes  every picture at all six screen sizes: squares big enough, nothing off-screen, help never flashes a square she must colour, it can be finished, and it animates.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES={'laptop':(1366,768),'phone':(360,740),'phoneL':(915,412),'tablet':(800,1280)}
ALL=[('laptop',1366,768),('tabL',1280,800),('tabP',800,1280),('phP',412,915),('phL',915,412),('phS',360,740)]
PICS='__ww.COUNTRIES.japan.missions.find(m=>m.id==="m4").rounds.find(r=>r.act==="pixel").pics'
START='(n)=>{["m1","m2","m3"].forEach(m=>__ww.S().missions["japan."+m]={done:true}); __ww.S().pixel=n-1; __ww.go("country","japan")}'
async def to_pixel(page, n):
    await page.evaluate(START, n); await page.wait_for_timeout(200)
    await page.evaluate('()=>__ww.cur.auto("m4")'); await page.wait_for_timeout(300)
    for i in range(60):
        st = await page.evaluate('()=>{const c=__ww.cur; return c?{type:c.type, pic:c.pic||null}:null}')
        if st and st['pic']: return
        if st and st['type'] in ('btn','act','choice'): await page.evaluate('()=>{const c=__ww.cur; if(c.type==="choice") c.give(c.answer); else c.auto()}')
        await page.wait_for_timeout(250)
    raise Exception('never reached the pixel picture')
async def sheet(p):
    b,page,logs = await boot(p,1500,1000)
    n = await page.evaluate('''()=>{ const ps=%s; const o=document.createElement("div"); o.style.cssText="position:fixed;inset:0;z-index:9999;background:#FFF6F8;display:grid;grid-template-columns:repeat("+ps.length+",1fr);grid-template-rows:auto 1.4fr 1.4fr 1fr 1fr;gap:10px 22px;padding:14px 20px;font:600 15px sans-serif";
      ps.forEach(p=>{const t=document.createElement("div"); t.textContent=p.id+"  big "+p.big.rows[0].length+"x"+p.big.rows.length+"  small "+p.small.rows[0].length+"x"+p.small.rows.length; o.append(t)});
      [["big",0],["big",1],["small",0],["small",1]].forEach(z=>ps.forEach(p=>{const c=document.createElement("div"); c.style.cssText="min-height:0;min-width:0;padding:6px"; o.append(c); __ww.pixelPreview(c,p,z[0],Math.min(z[1]?p[z[0]].frames.length-1:0, p[z[0]].frames.length-1))}));
      document.body.append(o); return ps.length }''' % PICS)
    await page.wait_for_timeout(300); await page.screenshot(path='shots/pixel_sheet.png'); print('pictures', n, 'errors', logs); await b.close()
async def play(p, tag):
    w,h = SIZES[tag]; n = int(next((a[2:] for a in sys.argv if a.startswith('n=')), 2)); b,page,logs = await boot(p,w,h,fast=False)
    await to_pixel(page, n); await page.wait_for_timeout(600)
    cells = page.locator('.pcell.tapme'); info = await page.evaluate('()=>({pic:__ww.cur.pic, size:__ww.cur.size, cols:+getComputedStyle(document.querySelector(".pix")).getPropertyValue("--cols")})')
    print(tag, info, '| prompt:', await page.inner_text('.bubble .txt'), '| smallest square', await page.evaluate('()=>Math.round(Math.min(...[...document.querySelectorAll(".pcell.tapme")].map(e=>e.getBoundingClientRect().width)))'), 'px | colours', await page.locator('.pbtn').count())
    await page.screenshot(path=f'shots/pixel_{tag}_{n}_a.png')
    await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(400); print('  1st miss ->', await page.inner_text('.bubble .txt'))
    await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(400); print('  2nd miss ->', await page.inner_text('.bubble .txt'), '| numbers', await page.locator('.mnum').count(), '| flashing', await page.locator('.pcell.pulse').count(), '| flashing squares she must colour:', await page.locator('.pcell.tapme.pulse').count())
    await page.screenshot(path=f'shots/pixel_{tag}_{n}_guide.png')
    todo = await page.evaluate('''()=>{const p=%s.find(x=>x.id===__ww.cur.pic), rows=p[__ww.cur.size].rows, W=rows[0].length, out=[]; rows.forEach((r,y)=>{ for(let x=W/2;x<W;x++) out.push([y*(W/2)+(x-W/2), r[x]==="."?"":r[x], x, y]); }); return out}''' % PICS)
    want = [t for t in todo if t[1]]; half = info['cols']//2
    # the wrong colour on a right square
    other = next(t[1] for t in want if t[1] != want[0][1]); await page.click(f'.pbtn[data-t="{other}"]'); await cells.nth(want[0][0]).click(); await page.wait_for_timeout(300); print('  wrong colour ->', await page.inner_text('.bubble .txt'))
    # a real drag along the longest run of one colour in a row
    best = None
    for y in sorted(set(t[3] for t in want)):
        row = [t for t in todo if t[3]==y]; i = 0
        while i < len(row):
            j = i
            while j < len(row) and row[j][1] and row[j][1]==row[i][1]: j += 1
            if row[i][1] and (best is None or j-i > best[1]-best[0]) : best = (i, j, y, row)
            i = max(j, i+1)
    i,j,y,row = best; await page.click(f'.pbtn[data-t="{row[i][1]}"]')
    a = await cells.nth(row[i][0]).bounding_box(); z = await cells.nth(row[j-1][0]).bounding_box()
    await page.mouse.move(a['x']+a['width']/2, a['y']+a['height']/2); await page.mouse.down(); await page.mouse.move(z['x']+z['width']/2, z['y']+z['height']/2, steps=12); await page.mouse.up(); await page.wait_for_timeout(200)
    print(f'  dragged along {j-i} squares in row {y} ->', await page.locator('.pcell.tapme.on').count(), 'coloured')
    for t in want:
        if 'on' in (await cells.nth(t[0]).get_attribute('class')): continue
        await page.click(f'.pbtn[data-t="{t[1]}"]'); await cells.nth(t[0]).click()
    await page.wait_for_timeout(500); print('  finished ->', await page.inner_text('.bubble .txt'), '| coloured', await page.locator('.pcell.tapme.on').count(), 'of', len(want))
    snap = lambda: page.evaluate('()=>[...document.querySelectorAll(".pcell")].map(e=>e.style.background).join("|")')
    a1 = await snap(); await page.screenshot(path=f'shots/pixel_{tag}_{n}_alive1.png'); a2 = a1
    for k in range(12):
        await page.wait_for_timeout(90); a2 = await snap()
        if a2 != a1: break
    await page.screenshot(path=f'shots/pixel_{tag}_{n}_alive2.png')
    await page.wait_for_timeout(4200)
    print('  it moves:', a1 != a2, '| animation', await page.evaluate('()=>getComputedStyle(document.querySelector(".pix")).animationName'), '| buttons:', [await x.inner_text() for x in await page.locator('.wrow .btn').all()], '| errors', logs); await b.close()
async def sizes(p):
    bad = 0; N = 5
    for tag,w,h in ALL:
        out=[]
        for n in range(1,N+1):
            b,page,logs = await boot(p,w,h); await to_pixel(page, n); await page.wait_for_timeout(250)
            r = await page.evaluate('()=>{const c=[...document.querySelectorAll(".pcell.tapme")].map(e=>e.getBoundingClientRect()), t=document.querySelector(".pix").getBoundingClientRect(); return {size:__ww.cur.size, min:Math.round(Math.min(...c.map(x=>Math.min(x.width,x.height)))), off:c.filter(x=>x.left<0||x.top<0||x.right>innerWidth||x.bottom>innerHeight).length+(t.left<0||t.right>innerWidth||t.bottom>innerHeight?1:0), pick:[...document.querySelectorAll(".pbtn")].map(e=>Math.round(e.getBoundingClientRect().height)), poff:[...document.querySelectorAll(".pbtn")].filter(e=>{const r=e.getBoundingClientRect(); return r.left<0||r.top<0||r.right>innerWidth||r.bottom>innerHeight}).length}}')
            await page.evaluate('()=>{__ww.cur.miss(); __ww.cur.miss()}'); await page.wait_for_timeout(120)
            tell = await page.locator('.pcell.tapme.pulse').count(); nums = await page.locator('.mnum').count()
            await page.evaluate('()=>{const c=__ww.cur; c.auto()}'); await page.wait_for_timeout(30)
            alive = await page.evaluate('()=>document.querySelector(".pix") ? document.querySelector(".pix").classList.contains("alive") : null'); await page.wait_for_timeout(400)
            st = await page.evaluate('()=>__ww.S().pixel'); floor = 30 if r['size']=='big' else 20
            ok = r['min'] >= floor and not r['off'] and not r['poff'] and not tell and nums and st == n and alive and not logs and all(x >= 40 for x in r['pick'])
            if not ok: bad += 1; print('  PROBLEM', tag, 'picture', n, r, 'tells', tell, 'numbers', nums, 'made', st, 'alive', alive, logs)
            out.append(f"{n}:{r['size']} {r['min']}px"); await b.close()
        print(tag, 'squares ->', ' | '.join(out))
    print('PROBLEMS', bad); sys.exit(1 if bad else 0)
async def main():
    async with async_playwright() as p:
        if 'sizes' in sys.argv: await sizes(p)
        elif 'play' in sys.argv: await play(p, next((a for a in sys.argv[2:] if a in SIZES), 'laptop'))
        else: await sheet(p)
asyncio.run(main())
