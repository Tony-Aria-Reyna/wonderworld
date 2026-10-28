# Tracing a letter with a finger, in real time with real mouse drags (0761-nihongo.js, jpTrace).
# For each stroke of the first letters of station 1: one drag the wrong way round (must not count), then one along the stroke (must count).
# Also a scribble across the box (must not count). python3 tools/t_trace.py [lap|ph]
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844)}
size = sys.argv[1] if len(sys.argv) > 1 else 'lap'
PTS = '''(rev)=>{const g=document.querySelector('.jp-glyph.trace'); if(!g) return null; const svg=g.querySelector('svg'), m=svg.getScreenCTM();
  const p=[...g.querySelectorAll('.jp-ink path')].find(x=>!x.classList.contains('on')); if(!p) return []; const L=p.getTotalLength(), out=[];
  for(let i=0;i<=24;i++){const a=p.getPointAtLength(L*i/24); const q=svg.createSVGPoint(); q.x=a.x; q.y=a.y; const s=q.matrixTransform(m); out.push([s.x,s.y]);}
  return rev? out.reverse(): out;}'''
async def drag(page, pts):
    await page.mouse.move(*pts[0]); await page.mouse.down()
    for q in pts[1:]: await page.mouse.move(*q, steps=2)
    await page.mouse.up(); await page.wait_for_timeout(300)
async def main():
    w, h = SIZES[size]; bad = 0
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h, fast=False)
        await page.evaluate('()=>{const S=__ww.S(); S.jp={st:0,placed:true,met:{},wins:0,again:[]}; S.sound=false; __ww.go("nihongo")}')
        await page.wait_for_timeout(600)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(500)   # the line, then the station's stops
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(300)
        for _ in range(60):                                                                      # the row's chant, then "Let's learn them!"
            t = await page.evaluate('()=>__ww.cur && __ww.cur.type')
            if t == 'btn': await page.evaluate('()=>__ww.cur.auto()'); break
            await page.wait_for_timeout(500)
        for letter in range(3):
            await page.wait_for_selector('.jp-glyph.trace:not(.done)', timeout=40000); await page.wait_for_timeout(500)
            nstrokes = await page.evaluate('()=>document.querySelectorAll(".jp-glyph.trace .jp-ink path").length')
            if letter == 0:
                box = await page.evaluate('()=>{const r=document.querySelector(".jp-glyph.trace").getBoundingClientRect(); return [r.left,r.top,r.width,r.height]}')
                x0, y0, bw, bh = box; await drag(page, [[x0 + bw * .1 + i * bw * .04, y0 + bh * .9 - i * bh * .04] for i in range(20)])
                on = await page.evaluate('()=>document.querySelectorAll(".jp-glyph.trace .jp-ink path.on").length')
                print('scribble counted?', on > 0); bad += on > 0
            for s in range(nstrokes):
                rev = await page.evaluate(PTS, True)
                if len(rev) > 3 and abs(rev[0][0] - rev[-1][0]) + abs(rev[0][1] - rev[-1][1]) > 20:
                    await drag(page, rev); on = await page.evaluate('()=>document.querySelectorAll(".jp-glyph.trace .jp-ink path.on").length')
                    if on > s: print('  letter', letter, 'stroke', s, 'counted BACKWARDS'); bad += 1
                    await page.wait_for_timeout(1200)
                fwd = await page.evaluate(PTS, False)
                await drag(page, fwd); on = await page.evaluate('()=>document.querySelectorAll(".jp-glyph.trace .jp-ink path.on").length')
                print('  letter', letter, 'stroke', s + 1, 'of', nstrokes, 'counted' if on > s else 'NOT COUNTED'); bad += on <= s
            await page.screenshot(path=f'shots/trace_{size}_{letter}.png')
        for l in logs: print('LOG', l)
        print('TOTAL', bad + len([l for l in logs if 'PAGEERROR' in l]), 'problems'); await b.close()
asyncio.run(main())
