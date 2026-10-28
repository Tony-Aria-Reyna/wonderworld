# The band (ACTS.beat) with real clicks: Brazil's samba parts, one after another, then free play.
# Checks at each size: the boxes are big enough to tap (a box is at least 30 px wide and 38 tall on the smallest phone); a wrong check never marks a box; a first miss splits the bar into halves,
# two misses in a half go one box at a time (a wrong answer marks nothing), and the second half follows;
# the right beat is accepted; each new part sits over the ones she has; when every part is learnt the round is free play. Saves shots/beat_<size>_*.png.
# Usage: python3 tools/t_beat.py [lap|ph|phL|sm]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES = [(1366,768,'lap'),(412,915,'ph'),(915,412,'phL'),(360,740,'sm')]
async def main():
    want = sys.argv[1:]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        for (w,h,tag) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}')
            b,page,logs = await boot(p,w,h,fast=True)
            await page.evaluate('''()=>{__ww.setPlayer("test"); const S=__ww.S(); S.sound=false; S.me=__ww.home.newMe(__ww.home.PRESETS[0]); const C=__ww.COUNTRIES.brazil, parts=C.missions[3].rounds.find(r=>r.act==="beat").parts; C.missions[0].rounds=[{act:"beat",parts}]; __ww.go("country","brazil")}''')
            await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(400)
            parts = await page.evaluate('()=>__ww.COUNTRIES.brazil.missions[3].rounds.find(r=>r.act==="beat").parts.map(p=>[p.id,p.hits])')
            for k,(pid,hits) in enumerate(parts):
                n_rows = await page.locator('.brow:not(.bhead)').count(); open_cells = page.locator('.brow.open .bcell')
                check(tag, n_rows == k+1 and await open_cells.count() == 8 and await page.locator('.bcell.lock').count() == 8*k, f'part {k+1} ({pid}): {k+1} rows, the new one hers to fill, the {k} before it locked')
                sizes = await page.evaluate('()=>[...document.querySelectorAll(".bcell.tapme, .bbtns .btn")].map(e=>{const r=e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.right), Math.round(r.bottom), e.classList.contains("bcell")]})')
                cw = min(s[0] for s in sizes if s[4]); ch = min(s[1] for s in sizes if s[4]); bt = min(min(s[0], s[1]) for s in sizes if not s[4])
                check(tag, cw >= 30 and ch >= 38 and bt >= 40 and max(s[2] for s in sizes) <= w+1 and max(s[3] for s in sizes) <= h+1, f'boxes at least 30 px wide and 38 tall ({cw} x {ch}), buttons at least 40 px ({bt}), all on the screen')
                if k == 0:
                    await page.screenshot(path=f'shots/beat_{tag}_1start.png')
                    txt = lambda: page.inner_text('.bubble .txt')
                    on = lambda: page.evaluate('()=>[...document.querySelectorAll(".brow.open .bcell")].map(c=>c.classList.contains("on")?"x":".").join("")')
                    await page.click('.bbtns [data-b="check"]'); await page.wait_for_timeout(250)
                    t1 = await txt(); dim = await page.locator('.brow.open .bcell.bdim').count()
                    check(tag, 'half' in t1 and dim == 4 and await page.locator('.act.help').count() == 1, f'a first miss splits the bar: "{t1}"; boxes 5 to 8 dimmed ({dim})')
                    wrong = next(i for i in range(4) if hits[i] == '.'); await open_cells.nth(wrong).click(); await page.click('.bbtns [data-b="check"]'); await page.wait_for_timeout(250)
                    t2 = await txt(); o2 = await on()
                    check(tag, 'numbers' in t2 and o2 == ''.join('x' if i == wrong else '.' for i in range(8)), f'a miss in the half: "{t2}"; only her own box is marked')
                    await page.click('.bbtns [data-b="check"]'); await page.wait_for_timeout(300)
                    t3 = await txt(); hb = await page.locator('.bbtns [data-b="hit"]').count(); o3 = await on(); ring = await page.evaluate('()=>[...document.querySelectorAll(".brow.open .bcell")].findIndex(c=>c.classList.contains("bfocus"))')
                    check(tag, hb == 1 and o3 == '........' and ring == 0, f'two misses in the half: one box at a time ("{t3}"), box 1 ringed, her guesses cleared')
                    await page.screenshot(path=f'shots/beat_{tag}_2boxes.png')
                    first_wrong = 'none' if hits[0] == 'x' else 'hit'; await page.click(f'.bbtns [data-b="{first_wrong}"]'); await page.wait_for_timeout(250)
                    t4 = await txt(); o4 = await on()
                    check(tag, 'again' in t4.lower() and o4 == '........', f'a wrong answer on a box: "{t4}"; nothing is marked or lit')
                    for i in range(4):
                        await page.click('.bbtns [data-b="' + ('hit' if hits[i] == 'x' else 'none') + '"]'); await page.wait_for_timeout(250)
                    t5 = await txt(); o5 = await on(); dim2 = await page.evaluate('()=>[...document.querySelectorAll(".brow.open .bcell")].map(c=>c.classList.contains("bdim")?"d":"-").join("")')
                    check(tag, o5 == hits[:4] + '....' and '5 to 8' in t5 and dim2 == 'dddd----' and await page.locator('.bbtns [data-b="check"]').count() == 1, f'boxes 1 to 4 done one by one ({o5}); on to 5 to 8: "{t5}" ({dim2})')
                for i,ch in enumerate(hits):
                    if ch == 'x' and not (k == 0 and i < 4): await open_cells.nth(i).click()
                await page.click('.bbtns [data-b="check"]'); await page.wait_for_timeout(350)
                more = page.locator('.bbtns .btn', has_text='Add a drum' if k < len(parts)-1 else 'Make my own')
                check(tag, await more.count() == 1 and await page.locator('.bcell.tapme').count() == 0, f'{pid}: the right beat is accepted: "{await page.inner_text(".bubble .txt")}"')
                if k in (1, len(parts)-1): await page.screenshot(path=f'shots/beat_{tag}_3part{k+1}.png')
                await more.click(); await page.wait_for_timeout(350)
            check(tag, await page.locator('.beat.free').count() == 1 and await page.locator('.bcell.tapme').count() == 32 and await page.evaluate('()=>__ww.S().beat') == 4, 'every part learnt: free play, with all 32 boxes hers to change')
            await page.locator('.bcell.tapme').nth(9).click(); await page.click('.bbtns [data-b="play"]'); await page.wait_for_timeout(150); await page.screenshot(path=f'shots/beat_{tag}_4free.png')
            await page.click('.bbtns [data-b="next"]'); await page.wait_for_timeout(500)
            check(tag, await page.locator('.overlay .card').count() == 1, 'Next ends the round (the mission-complete card is up)')
            check(tag, not logs, f'no script errors ({logs})'); await b.close()
    print('PROBLEMS', len(bad), bad)
    if bad: sys.exit(1)
asyncio.run(main())
