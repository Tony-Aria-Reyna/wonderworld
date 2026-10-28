# The periodic table's rewards and clues (068-spine.js), Tony, 11 October: "the periodic table needs to have a similar reward system as the learning japanese. Small rewards along
# the way and it needs to be fun!" and, on "it comes straight after strontium": "stupid hint!". From the passport's lab book, with the game's hooks:
#   1 the home bar: how many of 118, the medals so far, the next gift
#   2 elements 26 to 30 with two slips on one tile: the first clue is a fact, the second where it sits in the table, never "comes after"; not passed, so a summary and a star
#   3 the same five with no slips: a cheer for 3 in a row, the summary, the medal for 30, the lab gift (owned), stars
#   4 elements 36 to 40: row 4 complete (the row lights up), the medal for 40, the gift
#   5 the shop's "Lab gifts" shelf: the gifts she has are hers, the next ones are locked
# python3 tools/t_elprize.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'lap'
WATCH = '''()=>{window.__seen={combo:0,row:0,medal:0,gift:0,sum:[]}; new MutationObserver(ms=>{for(const m of ms) for(const n of m.addedNodes){ if(!n.classList) continue;
  if(n.classList.contains('el-combo')) __seen.combo++; if(n.classList.contains('el-rowwin')) __seen.row++; if(n.querySelector&&n.querySelector('.el-medalbig')) __seen.medal++; if(n.querySelector&&n.querySelector('.jp-gift-big')) __seen.gift++;
  if(n.classList.contains('el-summary')) __seen.sum.push(n.textContent);}}).observe(document.body,{childList:true,subtree:true});}'''
PROMPT = '()=>(document.querySelector(".bubble .txt, .bub-txt, .prompt")||{}).textContent||""'
async def play(page, misses):
    """play one set of five; misses: how many wrong tiles to tap on the first tile of the order test. Returns the clues heard"""
    clues = []; done = 0
    for i in range(900):
        await page.wait_for_timeout(30)
        c = await page.evaluate('()=>__ww.cur?{t:__ww.cur.type,k:Object.keys(__ww.cur).join(","),elem:__ww.cur.elem||null}:null')
        if not c: continue
        if c['t'] == 'labmenu': return clues
        if c['elem'] == 'order' and done < misses:
            await page.evaluate('()=>__ww.cur.miss()'); done += 1; await page.wait_for_timeout(120); clues.append(await page.evaluate(PROMPT)); continue
        if 'auto' in c['k']: await page.evaluate('()=>__ww.cur.auto()')
    return clues
async def main():
    w, h = SIZES[size]; issues = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        await page.evaluate(WATCH)
        await page.evaluate('()=>{const S=__ww.S(); S.elem={n:25,placed:true,g:0}; S.stars=0; __ww.save(); __ww.go("labbook","elements")}'); await page.wait_for_timeout(500)
        await page.screenshot(path=f'shots/elp_{size}_home.png')
        hb = await page.evaluate('()=>({bar:!!document.querySelector(".el-homebar"), prog:(document.querySelector(".el-prog")||{}).textContent, medals:document.querySelectorAll(".el-medal").length, next:(document.querySelector(".el-next")||{}).textContent})')
        if not hb['bar'] or '25 of 118' not in (hb['prog'] or '') or hb['medals'] != 2 or 'Next gift at 30' not in (hb['next'] or ''): issues.append('home bar: ' + json.dumps(hb))
        # 2: two slips on one tile
        await page.evaluate('()=>__ww.cur.pick("next")'); clues = await play(page, 2)
        if len(clues) != 2 or any('after' in c.lower() for c in clues) or 'Clue:' not in clues[0] or not ('sits right under' in clues[1] or 'column' in clues[1]) or clues[0] == clues[1]: issues.append('clues: ' + json.dumps(clues))
        s = await page.evaluate('()=>({n:__ww.S().elem.n, stars:__ww.S().stars, seen:__seen})')
        if s['n'] != 25 or not s['seen']['sum'] or 'Nearly' not in s['seen']['sum'][-1] or s['stars'] < 1: issues.append('a set with two slips: ' + json.dumps(s))
        # 3: the same five, no slips
        await page.evaluate('()=>__ww.cur.pick("next")'); await play(page, 0)
        s = await page.evaluate('()=>({n:__ww.S().elem.n, stars:__ww.S().stars, owned:!!(__ww.S().owned||{})["elg-alembic"], seen:__seen})')
        if s['n'] != 30 or s['seen']['combo'] < 1 or s['seen']['medal'] != 1 or s['seen']['gift'] != 1 or not s['owned'] or s['stars'] < 9 or 'learnt' not in s['seen']['sum'][-1]: issues.append('passing 26 to 30: ' + json.dumps(s))
        # 4: a row completed
        await page.evaluate('()=>{const S=__ww.S(); S.elem.n=35; __ww.save(); __ww.go("labbook","elements")}'); await page.wait_for_timeout(400)
        await page.evaluate('()=>__ww.cur.pick("next")'); await play(page, 0)
        s = await page.evaluate('()=>({n:__ww.S().elem.n, owned:!!(__ww.S().owned||{})["elg-magnet"], seen:__seen})')
        if s['n'] != 40 or s['seen']['row'] != 1 or s['seen']['medal'] != 2 or not s['owned']: issues.append('passing 36 to 40: ' + json.dumps(s))
        # 5: the shop shelf
        await page.evaluate('()=>__ww.go("room")'); await page.wait_for_timeout(500)
        o = await page.query_selector('.overlay .btn.go')
        if o: await o.click(); await page.wait_for_timeout(300)
        await page.click('.room .topbar [data-do="shop"]'); await page.wait_for_timeout(500)
        sh = await page.evaluate('''()=>({shelf:[...document.querySelectorAll('.shop-body h4')].some(x=>x.textContent==='Lab gifts'), own:!!document.querySelector('.shop-item.own[data-id="elg-magnet"]'), lock:!!document.querySelector('.shop-item.lock[data-id="elg-microscope"]')})''')
        await page.screenshot(path=f'shots/elp_{size}_shop.png')
        if not (sh['shelf'] and sh['own'] and sh['lock']): issues.append('shop: ' + json.dumps(sh))
        bad = [l for l in logs if 'PAGEERROR' in l]
        print(size, 'TOTAL', len(issues) + len(bad), 'problems'); [print('   ', i) for i in issues]; [print('   ', l) for l in bad[:5]]
        await b.close()
asyncio.run(main())
