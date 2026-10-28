# The Japanese race lost: two wrong picks on a card send it to the review, the fox reaches the lantern, the station is not passed,
# the missed card comes back after the race with no clock and leads the next race, and "Race again" then a win passes the station. python3 tools/t_jplose.py [lap|ph]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844)}
async def main():
    size = sys.argv[1] if len(sys.argv) > 1 else 'lap'; w, hh = SIZES[size]; bad = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, hh)
        await page.evaluate('()=>{__ww.S().jp={st:2,placed:true,met:{1:1,2:1,3:1},wins:2,again:[]}; __ww.go("nihongo")}'); await page.wait_for_timeout(400)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(400)   # the line, then station 3's stops: the race is next
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(300)
        for _ in range(40):
            c = await page.evaluate('()=>__ww.cur && {t:__ww.cur.type, k:Object.keys(__ww.cur)}')
            if c and c['t'] == 'btn': break
            if c and c['t'] == 'choice': await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            await page.wait_for_timeout(150)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)   # Go!
        await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(800)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(500)
        await page.screenshot(path=f'shots/jplose_{size}_race.png')
        await page.evaluate('()=>__ww.cur.lose()'); await page.wait_for_timeout(1500)
        S = await page.evaluate('()=>__ww.S().jp')
        if S['st'] != 2: bad.append('station passed after a loss: ' + json.dumps(S))
        if len(S.get('again', [])) != 1: bad.append('the missed card was not kept for next time: ' + json.dumps(S.get('again')))
        seen_review = False
        for _ in range(60):
            c = await page.evaluate('()=>__ww.cur && {t:__ww.cur.type, k:Object.keys(__ww.cur)}')
            txt = await page.evaluate('()=>document.querySelector(".act-body .prompt")?.textContent||""')
            if 'No rush' in txt or 'letter' in txt.lower() or 'Practise' in txt: seen_review = True
            if c and c['t'] == 'btn' and 'more' in c['k']: break
            if c and c['t'] == 'choice': seen_review = True; await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            elif c and c['t'] == 'act': seen_review = True; await page.evaluate('()=>__ww.cur.auto()')
            elif c and c['t'] == 'btn': await page.evaluate('()=>__ww.cur.auto()')
            await page.wait_for_timeout(200)
        if not seen_review: bad.append('no review of the missed card after the race')
        await page.screenshot(path=f'shots/jplose_{size}_end.png')
        btns = await page.evaluate('()=>[...document.querySelectorAll(".rc-end .btn")].map(b=>b.textContent)')
        if 'Race again' not in btns: bad.append('no Race again button after a loss: ' + str(btns))
        await page.evaluate('()=>__ww.cur.more()'); await page.wait_for_timeout(400)
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)   # Go
        first = await page.evaluate('()=>document.querySelector(".rc-card")?.textContent + "|" + [...document.querySelectorAll(".rc-opt")].map(b=>b.dataset.w).join(",")')
        for _ in range(12):
            await page.evaluate('()=>__ww.cur && __ww.cur.auto && __ww.cur.auto()'); await page.wait_for_timeout(450)
        await page.wait_for_timeout(5500)
        S = await page.evaluate('()=>__ww.S().jp')
        for _ in range(20):
            if await page.evaluate('()=>__ww.S().jp.st') == 3: break
            await page.evaluate('()=>__ww.cur && (__ww.cur.type=="btn") && __ww.cur.auto()'); await page.wait_for_timeout(400)
        S = await page.evaluate('()=>__ww.S().jp')
        if S['st'] != 3: bad.append('winning the second race did not pass station 3: ' + json.dumps(S))
        print(size, 'first card of the second race:', first)
        for l in logs: print('LOG', l)
        for x in bad: print('  ', x)
        print('TOTAL', len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems'); await b.close()
asyncio.run(main())
