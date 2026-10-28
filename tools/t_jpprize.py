# The Japanese strand's rewards and say-it panel, in real time:
#  1. passing a station shows the stamp, a new carriage on her train and a gift, and the gift lands in her toy box (S.owned) and on the shop's "Japanese train gifts" shelf;
#  2. the say-it panel records and plays back with a (simulated) microphone, and Listen and Slowly work. python3 tools/t_jpprize.py
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
async def main():
    bad = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'])
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, permissions=['microphone'])
        page = await ctx.new_page(); logs = []
        page.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)[:300]))
        await page.goto(URL); await page.evaluate('()=>{__ww.reset(); __ww.fast=false; __ww.S().sound=false}')
        # 1. a race won at station 1 (all four stops done), in real time
        await page.evaluate('()=>{__ww.S().jp={st:0,placed:true,met:{1:1},stop:{1:4},wins:0,again:[]}; __ww.go("nihongo")}'); await page.wait_for_timeout(600)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(1500)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500)
        for _ in range(10): await page.evaluate('()=>__ww.cur && __ww.cur.auto && __ww.cur.auto()'); await page.wait_for_timeout(1000)
        seen = {}
        for i in range(40):
            await page.wait_for_timeout(500)
            for sel in ['.jp-stamp.press', '.jp-car.new', '.jp-gift-big']:
                if await page.locator(sel).count() and sel not in seen: seen[sel] = 1; await page.screenshot(path=f'shots/prize_{len(seen)}.png')
            if len(seen) == 3: break
        for sel in ['.jp-stamp.press', '.jp-car.new', '.jp-gift-big']:
            if sel not in seen: bad.append('not shown: ' + sel)
        S = await page.evaluate('()=>({st:__ww.S().jp.st, owned:Object.keys(__ww.S().owned||{})})')
        if S['st'] != 1 or 'jpg-koi' not in S['owned']: bad.append('station or gift not saved: ' + str(S))
        print('passed station 1:', S)
        # the shop shelf shows the gift as owned and the next one locked
        await page.evaluate('()=>__ww.go("room")'); await page.wait_for_timeout(500)
        if await page.locator('.overlay .btn.go').count(): await page.click('.overlay .btn.go'); await page.wait_for_timeout(400)   # the first visit asks her to choose an explorer
        await page.click('.room .topbar [data-do="shop"]'); await page.wait_for_timeout(400)
        shelf = await page.evaluate('()=>[...document.querySelectorAll(".shop-item[data-id^=jpg-]")].map(e=>e.dataset.id+":"+(e.classList.contains("own")?"own":e.classList.contains("lock")?"lock":"open"))')
        print('gifts shelf:', shelf[:3], '...', len(shelf))
        if len(shelf) != 15 or not shelf[0].endswith('own') or not shelf[1].endswith('lock'): bad.append('gift shelf wrong: ' + str(shelf))
        # 2. the say-it panel with a microphone
        await page.evaluate('()=>{__ww.S().jp.stop={2:1}; __ww.go("nihongo")}'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(400)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(800)
        await page.click('.jp-wcard'); await page.wait_for_timeout(400)
        has = await page.evaluate('()=>[...document.querySelectorAll(".jp-eb")].map(b=>b.dataset.k)')
        print('say-it buttons:', has)
        if has[:2] != ['listen', 'slow']: bad.append('Listen and Slowly missing: ' + str(has))
        if 'rec' in has:
            await page.click('.jp-eb[data-k=rec]'); await page.wait_for_timeout(1500); await page.click('.jp-eb[data-k=rec]'); await page.wait_for_timeout(800)
            ready = await page.evaluate('()=>!document.querySelector(".jp-eb[data-k=play]").disabled')
            print('recorded and ready to play back:', ready)
            if not ready: bad.append('recording did not become ready to play')
        else: bad.append('no Record me button with a microphone available')
        await page.screenshot(path='shots/prize_echo.png')
        for l in logs: print('LOG', l)
        for x in bad: print('  ', x)
        print('TOTAL', len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems'); await b.close()
asyncio.run(main())
