# The Code Lab's program editor by real mouse drags, real touch drags and real taps (29 October, Tony: "Ideally i want to be able to move the blocks around by clicking and dragging").
# On a puzzle with forward, both turns and repeat, it builds and rebuilds a program and reads back exactly what was built after every move:
# a block dragged in from the bottom row; a repeat; a block dropped inside the repeat; a block dropped AFTER the repeat (Tony's case); a block moved into, within and out of a repeat;
# the whole repeat moved; a block dragged off the program to take it off; the repeat's number chosen from its picker (and changed again, with no need to delete it);
# a gap tapped to move the pink line, then a block tapped in there; and a touch drag with a finger. Also: no ghost left behind, the picker fits the screen and its buttons are 40 px or more.
# python3 tools/t_codedrag.py [lap|ph|phL|sm|tabP]     Screenshots: shots/drag_<size>_NN.png
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
async def main():
    w, h = SIZES[size]; bad = []; shot = [0]
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h, touch=True)
        cdp = await page.context.new_cdp_session(page)
        await page.evaluate('()=>{const st=__ww.code.CD_ST[2]; __ww.jpTry(ui=>__ww.code.cdBuild(ui, st.items.find(i=>i.k==="build"), st))}'); await page.wait_for_timeout(700)
        prog = lambda: page.evaluate('()=>__ww.cur.prog()')
        async def pt(js):
            return await page.evaluate('()=>{' + js + '}')
        async def center(sel, i=0):
            return await page.evaluate('([s,i])=>{const e=document.querySelectorAll(s)[i]; if(!e) return null; const r=e.getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]}', [sel, i])
        async def drag(a, z):
            await page.mouse.move(a[0], a[1]); await page.mouse.down(); await page.mouse.move(a[0] + 4, a[1] + 4, steps=2)
            await page.mouse.move(z[0], z[1], steps=12); await page.wait_for_timeout(80)
            seen = await page.evaluate('()=>[!!document.querySelector(".cd-ghost"), getComputedStyle(document.querySelector(".cd-drop")||document.body).display]')
            await page.mouse.up(); await page.wait_for_timeout(150)
            return seen
        async def step(name, want, got_fn=None):
            got = await prog(); shot[0] += 1; await page.screenshot(path=f'shots/drag_{size}_{shot[0]:02d}.png')
            if got != want: bad.append(f'{name}: built "{got}", wanted "{want}"')
            if await page.query_selector('.cd-ghost'): bad.append(f'{name}: a dragged picture was left behind')
        def right_of(sel, i=0, dx=10):
            return page.evaluate('([s,i,dx])=>{const e=document.querySelectorAll(s)[i]; const r=e.getBoundingClientRect(); return [r.right+dx, r.top+r.height/2]}', [sel, i, dx])
        def left_of(sel, i=0, dx=8):
            return page.evaluate('([s,i,dx])=>{const e=document.querySelectorAll(s)[i]; const r=e.getBoundingClientRect(); return [r.left-dx, r.top+r.height/2]}', [sel, i, dx])
        PAL = lambda t: center(f'.cd-pb[data-t="{t}"]')
        # 1 a forward from the bottom row into the empty program
        s1 = await drag(await PAL('F'), await center('.cd-prog'))
        if not s1[0]: bad.append('no picture follows the pointer while dragging')
        if s1[1] != 'block': bad.append('no pink line shows where the block will land')
        await step('forward dragged in', 'F')
        # 2 a repeat after it
        await drag(await PAL('R'), await right_of('.cd-prog > .cd-b', 0)); await step('repeat dragged in', 'F R2()')
        # 3 a forward inside the empty repeat
        await drag(await PAL('F'), await center('.cd-body')); await step('forward dropped inside the repeat', 'F R2(F)')
        # 4 a clockwise turn AFTER the repeat: Tony's case
        await drag(await PAL('cw'), await right_of('.cd-re', 0, 12)); await step('turn dropped after the repeat', 'F R2(F) cw')
        # 5 the first forward moved into the repeat, after the forward there
        await drag(await center('.cd-prog > .cd-b', 0), await right_of('.cd-body .cd-b', 0, 6)); await step('forward moved into the repeat', 'R2(F F) cw')
        # 6 the turn moved to the start of the repeat's inside
        await drag(await center('.cd-prog > .cd-b.cd-cw'), await left_of('.cd-body .cd-b', 0, 6)); await step('turn moved into the repeat', 'R2(cw F F)')
        # 7 the last forward moved out, after the repeat
        await drag(await center('.cd-body .cd-b', 2), await right_of('.cd-re', 0, 12)); await step('forward moved out after the repeat', 'R2(cw F) F')
        # 8 the whole repeat moved to the end, by its head
        await drag(await center('.cd-rh'), await right_of('.cd-prog > .cd-b', 0, 10)); await step('the repeat moved, with its blocks', 'F R2(cw F)')
        # 9 the turn dragged off the program: taken off
        await drag(await center('.cd-body .cd-b.cd-cw'), await center('.cd-grid')); await step('a block dragged off is taken off', 'F R2(F)')
        # 10 the number picker: choose 4, then change to 3, with no deleting
        await page.click('.cd-n'); await page.wait_for_timeout(200)
        pk = await page.evaluate('()=>{const p=document.querySelector(".cd-pick"); if(!p) return null; const r=p.getBoundingClientRect(); const bs=[...p.querySelectorAll(".cd-pk")].map(b=>b.getBoundingClientRect()); return {in:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight, n:bs.length, min:Math.min(...bs.map(x=>Math.min(x.width,x.height)))}}')
        shot[0] += 1; await page.screenshot(path=f'shots/drag_{size}_{shot[0]:02d}.png')
        if not pk or not pk['in'] or pk['n'] != 8 or pk['min'] < 40: bad.append('the number picker: ' + str(pk))
        await page.click('.cd-pick .cd-pk[data-n="4"]'); await page.wait_for_timeout(150); await step('picked 4', 'F R4(F)')
        await page.click('.cd-n'); await page.wait_for_timeout(150); await page.click('.cd-pick .cd-pk[data-n="3"]'); await page.wait_for_timeout(150); await step('changed to 3', 'F R3(F)')
        await page.click('.cd-n'); await page.wait_for_timeout(150); await page.mouse.click(5, 5); await page.wait_for_timeout(150)
        if await page.query_selector('.cd-pick'): bad.append('the number picker did not close on a tap elsewhere')
        # 11 a tap in the gap just after the repeat moves the pink line there; a tapped block goes in there
        await page.click('.cd-prog > .cd-b'); await page.wait_for_timeout(100)   # line after the first forward
        g = await right_of('.cd-re', 0, 8); await page.mouse.click(g[0], g[1]); await page.wait_for_timeout(150)
        await page.click('.cd-pb[data-t="acw"]'); await page.wait_for_timeout(150); await step('tapped gap, then tapped block', 'F R3(F) acw')
        # 12 a finger: drag a forward to the very start
        a = await PAL('F'); z = await left_of('.cd-prog > .cd-b', 0, 8)
        async def finger(kind, x=None, y=None): await cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [] if x is None else [{'x': x, 'y': y, 'id': 1}]})
        await finger('touchStart', a[0], a[1])
        for k in range(1, 13): await finger('touchMove', a[0] + (z[0] - a[0]) * k / 12, a[1] + (z[1] - a[1]) * k / 12); await page.wait_for_timeout(16)
        await finger('touchEnd'); await page.wait_for_timeout(250); await step('a finger drag', 'F F R3(F) acw')
        # the program still runs: Go
        await page.click('.cd-go'); await page.wait_for_timeout(600)
        for l in logs[:10]: print('  LOG', l)
        for x in bad: print('  WRONG', x)
        print(size, 'TOTAL', len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
