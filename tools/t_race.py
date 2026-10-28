# The flashcard race (ACTS.race) with real clicks: France's hare and tortoise.
# Checks at each size: the four answers are big enough to tap and on the screen, and both runners stay on the track; nothing happens before Go;
# a wrong answer greys that answer and leaves the card (one more try); a second wrong answer changes the card, and never shows the answer;
# a right answer moves the tortoise one step; the hare moves at one steady speed and does not stop for a wrong answer or a changed card;
# ten right answers win, and only a win moves her up a level; a lost race leaves her level alone;
# the cards that changed come back after the race with dots to count and no hare, and are in the pack again next race.
# Saves shots/race_<size>_*.png.   Usage: python3 tools/t_race.py [lap|ph|phL|sm|tabP]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES = [(1366,768,'lap'),(412,915,'ph'),(915,412,'phL'),(360,740,'sm'),(800,1280,'tabP')]
START = '''(lv)=>{__ww.setPlayer("test"); const S=__ww.S(); S.sound=false; S.race={lv, again:[], wins:1, seen:1}; __ww.save(); const C=__ww.COUNTRIES.france, r=C.missions[3].rounds.find(x=>x.act==="race"); C.missions[0].rounds=[r]; __ww.go("country","france"); }'''
P = '''()=>{const g=s=>{const e=document.querySelector(s); return e?Number(getComputedStyle(e).getPropertyValue("--p")||e.style.getPropertyValue("--p")||0):null}; return {hare:g(".rc-rival"), me:g(".rc-me"), sum:(document.querySelector(".rc-sum")||{}).textContent, note:(document.querySelector(".rc-note")||{}).textContent, opts:[...document.querySelectorAll(".rc-opt")].map(b=>[b.textContent,b.disabled]), lv:(__ww.S().race||{}).lv, again:(__ww.S().race||{}).again}}'''
CLICK = '(v)=>{ document.querySelector(\'.rc-opt[data-v="\'+v+\'"]\').click(); const e=document.querySelector(".rc-me"); return e?Number(e.style.getPropertyValue("--p")):null }'
def answer(sumtxt):
    a, op, b = sumtxt.split(' '); a = int(a); b = int(b)
    return a + b if op == '+' else a - b if op == '−' else a * b if op == '×' else a // b
async def main():
    want = sys.argv[1:]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        for (w,h,tag) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}')
            b,page,logs = await boot(p,w,h,fast=True)
            await page.evaluate(START, 5); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(400)
            # before Go
            s0 = await page.evaluate(P); check(tag, s0['hare'] == 0 and s0['me'] == 0 and await page.locator('.rc-go').count() == 1 and not s0['opts'], 'before Go: both runners on the start line, no card yet, a Go button')
            await page.screenshot(path=f'shots/race_{tag}_0ready.png')
            await page.click('.rc-go'); await page.wait_for_timeout(250)
            s1 = await page.evaluate(P); ans = answer(s1['sum']); vals = [int(o[0]) for o in s1['opts']]
            check(tag, len(vals) == 4 and len(set(vals)) == 4 and ans in vals, f'a card ({s1["sum"]}) with four different answers, the right one among them: {vals}')
            sizes = await page.evaluate('()=>[...document.querySelectorAll(".rc-opt")].map(e=>{const r=e.getBoundingClientRect(); return [Math.round(r.width),Math.round(r.height),Math.round(r.right),Math.round(r.bottom),Math.round(r.left),Math.round(r.top)]})')
            runners = await page.evaluate('()=>{const t=document.querySelector(".rc-track").getBoundingClientRect(), st=document.querySelector(".stage").getBoundingClientRect(); return {track:[t.left,t.top,t.right,t.bottom].map(Math.round), stage:[st.left,st.top,st.right,st.bottom].map(Math.round), run:[...document.querySelectorAll(".rc-run")].map(e=>{const r=e.getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom,r.width].map(Math.round)}), card:(()=>{const r=document.querySelector(".rc-card").getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom].map(Math.round)})()}}')
            mn = min(min(s[0], s[1]) for s in sizes)
            check(tag, mn >= 44 and all(s[2] <= w+1 and s[3] <= h+1 and s[4] >= -1 for s in sizes), f'answers at least 44 px ({mn}), all on the screen')
            T = runners['track']; S_ = runners['stage']
            check(tag, T[0] >= S_[0]-1 and T[2] <= S_[2]+1 and T[3] <= S_[3]+1 and all(r[0] >= T[0]-1 and r[2] <= T[2]+1 and r[1] >= T[1]-1 and r[3] <= T[3]+1 and r[4] >= 30 for r in runners['run']), f'the track is inside the stage and both runners are on it, at least 30 px wide ({[r[4] for r in runners["run"]]})')
            check(tag, (runners['card'][3] <= min(s[5] for s in sizes) + 1 or runners['card'][2] <= min(s[4] for s in sizes) + 1) and max(s[3] for s in sizes) <= T[1] + 1 and runners['card'][3] <= T[1] + 1, 'card above or beside the answers, and both above the track: nothing overlaps')
            await page.screenshot(path=f'shots/race_{tag}_1card.png')
            # one wrong answer: it greys, the card stays, the tortoise stays, and the answer is not shown
            wrong = [v for v in vals if v != ans]
            await page.click(f'.rc-opt[data-v="{wrong[0]}"]'); await page.wait_for_timeout(150); s2 = await page.evaluate(P)
            greyed = [o for o in s2['opts'] if o[1]]
            check(tag, s2['sum'] == s1['sum'] and s2['me'] == 0 and len(greyed) == 1 and greyed[0][0] == str(wrong[0]) and 'more try' in s2['note'] and await page.locator('.rc-opt.rc-ok').count() == 0, f'one wrong answer: it greys out, the card stays, the tortoise stays, nothing lights ("{s2["note"]}")')
            await page.screenshot(path=f'shots/race_{tag}_2wrong.png')
            # a second wrong answer: the card changes
            await page.click(f'.rc-opt[data-v="{wrong[1]}"]'); await page.wait_for_timeout(60)
            lit = await page.locator('.rc-opt.rc-ok').count(); await page.wait_for_timeout(300); s3 = await page.evaluate(P)
            check(tag, s3['sum'] != s1['sum'] and s3['me'] == 0 and lit == 0 and all(not o[1] for o in s3['opts']), f'a second wrong answer: the card changes to {s3["sum"]}, the answer was never lit')
            missed = s1['sum']
            # right answers: one step each
            steps = []
            for k in range(10):
                st = await page.evaluate(P)
                if not st['opts'] or st['sum'] in ('?', None): break
                steps.append(await page.evaluate(CLICK, answer(st["sum"]))); await page.wait_for_timeout(90)
            check(tag, len(steps) == 10 and all(abs(steps[i] - (i+1)/10) < .001 for i in range(10)), f'each right answer moves the tortoise one step of ten: {[round(x,1) for x in steps]}')
            lv = (await page.evaluate(P))['lv']
            check(tag, lv == 6, f'ten right answers win the race, and she moves up a level (5 to {lv})')
            # the card that changed comes back, with dots and no hare
            for _ in range(60):
                c = await page.evaluate('()=>{const c=__ww.cur; return c?c.type:null}')
                if c == 'choice': break
                await page.wait_for_timeout(100)
            txt = await page.inner_text('.bubble .txt'); dots = await page.locator('.stage .viz circle').count(); a0, op0, b0 = missed.split(' '); want_d = int(a0)+int(b0) if op0 == '+' else int(a0) if op0 in '−÷' else int(a0)*int(b0)
            texts = await page.locator('.stage .viz text').count(); hare = await page.locator('.rc-rival').count()
            check(tag, missed in txt and dots == want_d and texts == 0 and hare == 0, f'after the race the changed card ({missed}) comes back with {dots} dots to count, no number printed, and no hare')
            await page.screenshot(path=f'shots/race_{tag}_4review.png')
            # a wrong answer here greys out; then the right one
            ans0 = answer(missed); labels = [int(await x.inner_text()) for x in await page.locator('.opt').all()]; w0 = [v for v in labels if v != ans0][0]
            await page.locator('.opt', has_text=str(w0)).filter(has=page.locator(f'span:text-is("{w0}")')).first.click(); await page.wait_for_timeout(700)
            for _ in range(40):
                if await page.evaluate('()=>__ww.cur && __ww.cur.type==="choice"'): break
                await page.wait_for_timeout(100)
            gone = await page.locator('.opt.gone').count(); check(tag, gone == 1, 'a wrong answer on the dots card greys out; the answer is not shown')
            await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)'); await page.wait_for_timeout(900)
            for _ in range(40):
                if await page.locator('.rc-end').count(): break
                await page.wait_for_timeout(100)
            endt = await page.inner_text('.rc-endt'); again = (await page.evaluate(P))['again']
            check(tag, 'Level 6' in endt and again == [missed.replace(' ', '')], f'the end screen says "{endt}", and the changed card is kept for the next race: {again}')
            ends = await page.evaluate('()=>[...document.querySelectorAll(".rc-end .btn")].map(e=>{const r=e.getBoundingClientRect(); return [Math.round(Math.min(r.width,r.height)), Math.round(r.bottom), e.textContent, e.classList.contains("go")]})')
            check(tag, all(e[0] >= 40 and e[1] <= h+1 for e in ends) and ends[0][2] == 'Next' and ends[0][3], f'after a win, Next is the main button: {[(e[2], e[0]) for e in ends]}')
            await page.screenshot(path=f'shots/race_{tag}_5end.png')
            # race again: the kept card is in the pack, and this time the hare wins
            await page.locator('.rc-end .btn', has_text='Race again').click(); await page.wait_for_timeout(300); await page.click('.rc-go'); await page.wait_for_timeout(200)
            seen = []
            for k in range(3):
                st = await page.evaluate(P); seen.append(st['sum']); await page.click(f'.rc-opt[data-v="{answer(st["sum"])}"]'); await page.wait_for_timeout(90)
            check(tag, seen[0] == missed, f'the next race starts with the card she missed ({seen[0]})')
            await page.evaluate('()=>__ww.cur.lose()'); await page.wait_for_timeout(700)
            st = await page.evaluate(P)
            check(tag, st['lv'] == 6, f'the hare reaches the flag first: the race is lost, and her level stays at {st["lv"]}')
            for _ in range(60):
                if await page.locator('.rc-end').count(): break
                await page.wait_for_timeout(100)
            ends = await page.evaluate('()=>[...document.querySelectorAll(".rc-end .btn")].map(e=>[e.textContent, e.classList.contains("go")])'); endt = await page.inner_text('.rc-endt')
            check(tag, ends[0] == ['Race again', True] and 'Level 6' in endt, f'after a loss, Race again is the main button and the level is unchanged: {ends}, "{endt}"')
            await page.screenshot(path=f'shots/race_{tag}_7lostend.png')
            if logs: bad.append(tag + ': errors ' + str(logs))
            await b.close()
        # real time, once: the hare runs at one steady speed, and does not stop for a wrong answer or a changed card
        if not want or 'lap' in want:
            print('real time: the hare at level 5 (7 seconds a step)')
            b,page,logs = await boot(p,1366,768,fast=False)
            await page.evaluate(START, 5); await page.wait_for_timeout(400); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(600); await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(900)
            await page.click('.rc-go'); t0 = asyncio.get_event_loop().time(); samples = []
            for k in range(6):
                await page.wait_for_timeout(1500); st = await page.evaluate(P); samples.append((asyncio.get_event_loop().time() - t0, st['hare']))
                if k == 1: await page.click('.rc-opt:not(:disabled)')            # whatever it is: right or wrong, the hare must not care
                if k == 2:
                    st = await page.evaluate(P); ws = [o[0] for o in st['opts'] if int(o[0]) != answer(st['sum']) and not o[1]]
                    for v in ws[:2]: await page.click(f'.rc-opt[data-v="{v}"]'); await page.wait_for_timeout(80)
            rates = [(samples[i][1] - samples[i-1][1]) / (samples[i][0] - samples[i-1][0]) for i in range(1, len(samples))]; want_rate = 1 / 70
            print('   hare speed between samples (fraction of the track per second):', [round(r, 4) for r in rates], 'wanted', round(want_rate, 4))
            check('real', all(abs(r - want_rate) < want_rate * .2 for r in rates), 'the hare keeps one steady speed (7 seconds a step) through a wrong answer and a changed card')
            await page.screenshot(path='shots/race_real_1running.png')
            won = False; st = None
            for k in range(12):
                st = await page.evaluate(P)
                await page.click(f'.rc-opt[data-v="{answer(st["sum"])}"]'); await page.wait_for_timeout(200)
                if await page.locator('.race.rc-won').count(): won = True; st = await page.evaluate(P); await page.screenshot(path='shots/race_real_2won.png'); break
                await page.wait_for_timeout(220)
            check('real', won and st['me'] == 1 and st['hare'] is not None and st['hare'] < 1, f'she reaches the flag first: the race is won with the hare at {st["hare"]} of the track')
            if logs: bad.append('real: errors ' + str(logs))
            await b.close()
    print('PROBLEMS', len(bad), bad)
    if bad: sys.exit(1)
asyncio.run(main())
