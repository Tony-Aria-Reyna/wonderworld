# The sieve of Eratosthenes with real clicks at five sizes: a number that is not a multiple only wobbles; five right taps and the rest of that table sweeps itself out;
# what is left at the end is exactly the primes (15 up to 50, 25 up to 100); every square is at least 30 px; the second time she plays, the grid runs to 100.
# Saves pictures to shots/sieve_<size>_*.png.   Usage: python3 tools/t_sieve.py [lap|ph|phL|sm|tabP]
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
SIZES = [(1366, 768, 'lap'), (412, 915, 'ph'), (915, 412, 'phL'), (360, 740, 'sm'), (800, 1280, 'tabP')]
PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
async def main():
    want = sys.argv[1:]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        for (w, h, tag) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}')
            b, page, logs = await boot(p, w, h, fast=False)
            await page.evaluate('()=>{__ww.setPlayer("test"); __ww.S().sound=false; __ww.save(); __ww.go("country","greece")}'); await page.wait_for_timeout(400)
            for top in [50, 100]:
                await page.evaluate('()=>{__ww.go("country","greece")}'); await page.wait_for_timeout(350)
                await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(450); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500)
                for i in range(40):          # answer the first question, whatever it takes
                    if await page.locator('.sv-grid').count(): break
                    await page.evaluate('()=>{const c=__ww.cur; if(!c) return; if(c.give) c.give(c.answer); else if(c.auto) c.auto();}'); await page.wait_for_timeout(250)
                await page.wait_for_timeout(500)
                n = await page.locator('.sv-c').count(); size = await page.evaluate('()=>{const r=document.querySelector(".sv-c").getBoundingClientRect(); return Math.round(Math.min(r.width,r.height))}')
                inside = await page.evaluate('()=>{const s=document.querySelector(".stage").getBoundingClientRect(); return [...document.querySelectorAll(".sv-c")].every(c=>{const r=c.getBoundingClientRect(); return r.left>=s.left-2&&r.right<=s.right+2&&r.top>=s.top-2&&r.bottom<=s.bottom+2})}')
                check(tag, n == top and size >= 30 and inside, f'the grid runs 1 to {top}; squares are {size} px and all inside the stage')
                cell = lambda v: page.locator(f'.sv-c[data-v="{v}"]')
                await cell(9).click(); await page.wait_for_timeout(200)
                check(tag, await page.locator('.sv-c.out').count() == 1 and await page.evaluate('()=>__ww.cur.sieve') == 2, 'a tap on 9 while counting in 2s crosses nothing out')
                await cell(2).click(); await page.wait_for_timeout(100); check(tag, not await cell(2).evaluate('e=>e.classList.contains("out")'), '2 itself is prime: it cannot be crossed out')
                lit = await page.evaluate('()=>[...document.querySelectorAll(".sv-c")].filter(c=>Number(c.dataset.v)%2===0&&!c.classList.contains("keep")&&!c.classList.contains("out")&&(getComputedStyle(c).animationName!=="none"||getComputedStyle(c).backgroundColor!=="rgb(255, 255, 255)")).length')
                check(tag, lit == 0, 'no square she has to find is lit or moving')
                for v in [4, 6, 8, 10]: await cell(v).click(); await page.wait_for_timeout(90)
                if top == 50: await page.screenshot(path=f'shots/sieve_{tag}_1.png')
                await cell(12).click(); await page.wait_for_timeout(2600 if top == 50 else 4200)
                evens = await page.evaluate('()=>[...document.querySelectorAll(".sv-c.out")].length')
                check(tag, evens == top // 2 and await page.evaluate('()=>__ww.cur.sieve') == 3, f'after five right taps the rest of the 2 times table sweeps itself out ({evens - 1} crossed), and the 3s begin')
                for i in range(60):
                    if await page.locator('.sv-go').count(): break
                    await page.evaluate('()=>__ww.cur&&__ww.cur.auto&&__ww.cur.auto()'); await page.wait_for_timeout(260)
                await page.wait_for_timeout(1600)
                left = await page.evaluate('()=>[...document.querySelectorAll(".sv-c.prime")].map(c=>Number(c.dataset.v))')
                check(tag, left == [x for x in PRIMES if x <= top], f'what is left is exactly the {len([x for x in PRIMES if x <= top])} primes up to {top}')
                await page.screenshot(path=f'shots/sieve_{tag}_{2 if top == 50 else 3}.png')
                await page.click('.sv-go'); await page.wait_for_timeout(300)
                check(tag, await page.evaluate('()=>__ww.S().sieve') == (1 if top == 50 else 2), 'her progress is kept, so the next time the grid is bigger')
            check(tag, not logs, f'no errors on the page ({logs[:2]})'); await b.close()
    print('\n' + ('ALL OK' if not bad else f'{len(bad)} FAILED:\n  ' + '\n  '.join(bad))); sys.exit(1 if bad else 0)
asyncio.run(main())
