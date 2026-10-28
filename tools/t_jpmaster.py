# Practise until right, and the look-backs (0761-nihongo.js). Tony, 10 October: "4/8 passed first time isnt a very good pass rate. those other 4 need to be worked
# through to ensure she passes 1st time. we need to have mid refreshers over all lessons/stops we have learnt."
# Plays one station's four teaching stops with the game's hooks, missing on purpose: the first two things asked in each stop, and the first look-back card.
# One item (STUCK) is missed every time it is practised, to show she is never trapped. After each stop it checks:
#   every first-time miss was asked again until right first time (or, for STUCK, three rounds then marked tricky); a look-back of up to three cards came half way;
#   a missed look-back card was practised too; the tricky letter set up beforehand came first in the look-back; the summary reports the practice and the look-back.
# python3 tools/t_jpmaster.py [lap|ph|phL|sm|tabP] [station, default 2]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'lap'; STN = int(sys.argv[2]) if len(sys.argv) > 2 else 2
CUR = '''()=>{const c=__ww.cur; if(!c) return null; return {t:c.type, item:c.item||null, mode:c.mode===undefined?null:c.mode, help:!!c.help, k:Object.keys(c).join(','),
  sum:!!document.querySelector('.jp-summary'), sumtxt:(document.querySelector('.jp-summary .jp-sumrow')||{}).textContent||'', look:!!document.querySelector('.jp-lookback')}}'''
async def main():
    w, h = SIZES[size]; issues = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        await page.evaluate('()=>{window.__looks=0; new MutationObserver(ms=>{for(const m of ms) for(const n of m.addedNodes) if(n.classList&&n.classList.contains("jp-lookback")) window.__looks++;}).observe(document.body,{childList:true,subtree:true});}')
        await page.evaluate('''(n)=>{const m={}, s={}; for(let i=1;i<n;i++){m[i]=1;s[i]=5;} s[n]=0; const k=[...__ww.jp.jpKnown(n-1)][1];
          __ww.S().jp={st:n-1,placed:true,met:m,stop:s,wins:n-1,again:[],weak:k?{['L:'+k]:3}:{}}; window.__tricky=k||null; __ww.go("map");}''', STN)
        tricky = await page.evaluate('()=>window.__tricky')
        await page.wait_for_timeout(300); await page.click('.jp-pill')
        stop = 0; rec = []; sums = []; last = None; idle = 0; firstmiss = {}; STUCK = None; seen_look = False; menus = 0
        while idle < 80 and stop < 4:
            await page.wait_for_timeout(40)
            c = await page.evaluate(CUR); sig = json.dumps(c)
            if c and c['look']: seen_look = True
            if sig == last: idle += 1; continue
            idle = 0; last = sig
            if not c: continue
            t, item, mode = c['t'], c['item'], c['mode']
            if c['sum'] and t == 'btn':
                # the end of a stop: check what happened in it
                first = [r for r in rec if r[0] == '']; rev = [r for r in rec if r[0] == 'review']; ret = [r for r in rec if r[0] == 'retry']
                missed1 = {r[1] for r in first if r[2]}
                for it in missed1:
                    tries = [r for r in ret if r[1] == it]
                    if it == STUCK: ok = len(tries) >= 3 and all(r[2] for r in tries)
                    else: ok = tries and not tries[-1][2]
                    if not ok: issues.append(f'stop {stop+1}: {it} missed, but not practised until right: {tries}')
                if not rev and not (STN == 1 and stop == 0): issues.append(f'stop {stop+1}: no look-back')
                if len({r[1] for r in rev}) > 3: issues.append(f'stop {stop+1}: look-back asked more than three things')
                if rev:
                    i0 = next(i for i, r in enumerate(rec) if r[0] == 'review')
                    if not any(r[0] == '' for r in rec[:i0]): issues.append(f'stop {stop+1}: the look-back came first, not half way')
                    revm = [r for r in rev if r[2]]
                    if revm and not any(r[1] == revm[0][1] and not r[2] for r in rev[rev.index(revm[0]) + 1:]): issues.append(f'stop {stop+1}: the missed look-back card {revm[0][1]} was not practised until right')
                if stop == 0 and rev and tricky and rev[0][1] != 'L:' + tricky: issues.append(f'letters stop: the tricky letter {tricky} did not come first in the look-back (got {rev[0][1]})')
                if missed1 and 'now right' not in c['sumtxt']: issues.append(f'stop {stop+1}: summary does not report the practice: ' + c['sumtxt'])
                if rev and 'Look back' not in c['sumtxt']: issues.append(f'stop {stop+1}: summary does not report the look-back: ' + c['sumtxt'])
                print(f'  stop {stop+1}: first time {len(first)} asked, {len(missed1)} missed on purpose; practice asks {len(ret)}; look-back {len(rev)} asks; summary: {c["sumtxt"]}')
                await page.screenshot(path=f'shots/jpmaster_{size}_{stop+1}.png')
                sums.append(c['sumtxt']); rec = []; firstmiss = {}; stop += 1
                await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
            if t == 'labmenu':
                menus += 1
                if menus > 8: issues.append('stuck at a menu'); break
                await page.evaluate('()=>__ww.cur.pick("next")'); last = None; continue
            if t == 'choice' or (t == 'act' and 'build' in c['k']):
                key = (mode, item)
                if mode == '':
                    n1 = len({r[1] for r in rec if r[0] == '' and r[2]})
                    miss = (item not in firstmiss and n1 < 2 and item is not None and not (STN and item == 'T:' + 'なんさい？'))
                    if miss and STUCK is None and stop == 0: STUCK = item
                elif mode == 'review': miss = not any(r[0] == 'review' and r[2] for r in rec) and item not in firstmiss
                else: miss = item == STUCK and item not in firstmiss
                if t == 'act':
                    if miss and not c.get('slip') and 'miss' in c['k']: await page.evaluate('()=>__ww.cur.miss()'); firstmiss[item] = 1; rec.append((mode, item, True)); last = None; continue
                    if not any(r[1] == item and r[0] == mode and r[2] for r in rec[-1:]) and not c.get('slip'): rec.append((mode, item, False))
                    firstmiss.pop(item, None); await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
                if miss and not c['help']:
                    firstmiss[item] = 1; rec.append((mode, item, True)); await page.evaluate('()=>__ww.cur.give((__ww.cur.answer+1)%__ww.cur.n)'); last = None; continue
                if not c['help']: rec.append((mode, item, False))
                firstmiss.pop(item, None); await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)'); last = None; continue
            if t in ('act', 'btn'): await page.evaluate('()=>__ww.cur.auto()'); last = None; continue
        S = await page.evaluate('()=>__ww.S().jp')
        if stop < 4: issues.append(f'only {stop} stops finished')
        if STUCK and not (S.get('weak') or {}).get(STUCK): issues.append(f'{STUCK}, never got right, was not marked tricky')
        looks = await page.evaluate('()=>window.__looks')
        if looks < (3 if STN == 1 else 4): issues.append(f'the "Look back!" card showed {looks} times in four stops')   # the very first stop has nothing to look back on
        if 'practise next time' not in ' '.join(sums): issues.append('the summary did not say one is still to practise')
        print(size, 'station', STN, 'stops', stop, 'stuck item', STUCK, 'weak', json.dumps(S.get('weak'))[:160])
        for i in issues: print('   ', i)
        for l in logs[:10]: print('   LOG', l)
        print(size, 'TOTAL', len(issues) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
