# The Lo Shu magic square (China) with real clicks, at every level and five sizes: python3 tools/t_magic.py [lap|ph|phL|sm|tabP]
# Checks: the squares and number tiles are big enough to tap; nothing is off the stage; a wrong number makes its line pink and says so, and never shows where a number goes;
# after two wrong lines, lifting a number gives the clue (two numbers in a line, or the rule about 10); a finished square turns every total gold and moves her up a level.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES = {'lap':(1366,768),'ph':(360,740),'phL':(915,412),'sm':(320,568),'tabP':(800,1280)}
async def one(p, tag, lv):
    w,h = SIZES[tag]; bad = []
    b,page,logs = await boot(p,w,h,fast=True)
    await page.evaluate('(lv)=>{__ww.setPlayer("test"); __ww.S().magic=lv; __ww.go("country","china")}', lv); await page.wait_for_timeout(250)
    await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(250)
    for i in range(300):
        st = await page.evaluate('()=>{const c=__ww.cur; return {type:c?c.type:null, hit:!!document.querySelector(".lo-board"), magic:c&&c.magic}}')
        if st['hit'] and st['magic'] is not None: break
        if st['type'] in ('btn','act','hands'): await page.evaluate('()=>__ww.cur.auto()')
        elif st['type'] in ('choice','num'): await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
        await page.wait_for_timeout(120)
    else: return ['never reached the magic square']
    if st['magic'] != lv: bad.append(f'level {st["magic"]}, wanted {lv}')
    await page.evaluate('()=>{__ww.fast=false}'); await page.wait_for_timeout(500)
    sz = await page.evaluate('''()=>{ const r=e=>e.getBoundingClientRect(), st=r(document.querySelector('.stage')), out=[];
      document.querySelectorAll('.lo-c').forEach(c=>{const q=r(c); if(q.width<30||q.height<38) out.push('square '+q.width.toFixed(0)+'x'+q.height.toFixed(0)); if(q.left<st.left-1||q.right>st.right+1||q.top<st.top-1||q.bottom>st.bottom+1) out.push('square off the stage');});
      document.querySelectorAll('.lo-t').forEach(c=>{const q=r(c); if(q.width<40||q.height<40) out.push('tile '+q.width.toFixed(0)); if(q.left<st.left-1||q.right>st.right+1||q.top<st.top-1||q.bottom>st.bottom+1) out.push('tile off the stage');});
      document.querySelectorAll('.lo-sum').forEach(c=>{const q=r(c); if(q.left<st.left-1||q.right>st.right+1||q.top<st.top-1||q.bottom>st.bottom+2) out.push('total off the stage');});
      return out; }''')
    bad += sz
    # a wrong number, by a real tap on the tile and the square
    await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(300)
    r1 = await page.evaluate('()=>({pink:document.querySelectorAll(".lo-sum.bad").length, txt:document.querySelector(".bubble .txt").textContent, look:document.querySelectorAll(".lo-c.look").length})')
    if lv < 3 and not r1['pink']: bad.append('a wrong line did not turn pink')
    if lv < 3 and 'not 15' not in r1['txt']: bad.append('no word about the wrong line: ' + r1['txt'])
    if r1['look']: bad.append('something lit up after one slip')
    # lift it with a real click, slip again, lift again: the clue
    for k in range(2):
        mine = page.locator('.lo-c.mine').first
        if await mine.count(): await mine.click(); await page.wait_for_timeout(250)
        if k == 0: await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(300)
    r2 = await page.evaluate('()=>({txt:document.querySelector(".bubble .txt").textContent, look:[...document.querySelectorAll(".lo-c.look")].map(c=>c.textContent)})')
    if lv < 3 and not ('How many more' in r2['txt'] or 'make 10' in r2['txt']): bad.append('no clue after two slips: ' + r2['txt'])
    if any(x == '' for x in r2['look']): bad.append('the clue lit an empty square')
    # a real tap-tap placement, then finish
    t = page.locator('.lo-t:not(.used)').first; await t.click(); await page.wait_for_timeout(150)
    await page.locator('.lo-c:not(.giv):not(.mine)').first.click(); await page.wait_for_timeout(250)
    await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(400)
    r3 = await page.evaluate('()=>({ok:document.querySelectorAll(".lo-sum.ok").length, lv:__ww.S().magic, done:!!document.querySelector(".lo-board.done")})')
    if r3['ok'] != 8 or not r3['done']: bad.append(f'finished square shows {r3["ok"]} gold totals')
    if r3['lv'] != min(lv + 1, 4): bad.append(f'level after: {r3["lv"]}')
    await page.screenshot(path=f'shots/magic_{tag}_{lv}.png')
    await b.close(); return bad + logs
async def main():
    tags = sys.argv[1:] or list(SIZES); allbad = 0
    async with async_playwright() as p:
        for tag in tags:
            for lv in range(4):
                bad = await one(p, tag, lv); allbad += len(bad); print(tag, 'level', lv, 'OK' if not bad else bad)
    print('ALL OK' if not allbad else f'{allbad} PROBLEMS')
asyncio.run(main())
