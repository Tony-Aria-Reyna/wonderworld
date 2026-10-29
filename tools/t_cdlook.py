# Code Lab: draw chosen puzzles (and a station's meet) as she first sees them, and with the answer built in (not run), on one contact sheet to look at.
# python3 tools/t_cdlook.py <size> <id,id,...|meet5,...>     Sheet: shots/cdlook_<size>.png
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
from PIL import Image
import re
OFF = re.search(r"OFF = '''(.*?)'''", open('tools/t_codelab.py').read(), re.S).group(1)
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1]; ids = sys.argv[2].split(',')
if ids == ['every']: ids = None
async def main():
    w, h = SIZES[size]; files = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        global ids
        if ids is None: ids = await page.evaluate('()=>__ww.code.CD_ST.flatMap((s,n)=>["meet"+(n+1)].concat(s.items.map(i=>i.id)))')
        for i in ids:
            if i.startswith('meet'):
                await page.evaluate('(n)=>{const ui=__ww.jpTry(ui=>__ww.code.cdMeet(ui,n)); ui.root.classList.add("c-cd")}', int(i[4:]))
                await page.wait_for_timeout(900); f = f'shots/cdlook_{size}_{i}.png'; await page.screenshot(path=f); files.append(f)
                if 'all' in sys.argv:
                    await page.evaluate('()=>__ww.cur&&__ww.cur.auto&&__ww.cur.auto()'); await page.wait_for_timeout(400)
                    o = await page.evaluate(OFF)
                    if o: print(i, 'after', o)
                continue
            await page.evaluate('''(id)=>{const st=__ww.code.CD_ST.find(s=>(s.items||[]).some(x=>x.id===id)), it=st.items.find(x=>x.id===id);
              const ui=__ww.jpTry(ui=>__ww.code.cdAskOne(ui,it,st)); ui.root.classList.add("c-cd")}''', i)
            await page.wait_for_timeout(700); f = f'shots/cdlook_{size}_{i}_a.png'; await page.screenshot(path=f); files.append(f)
            o = await page.evaluate(OFF)
            if o: print(i, o)
            if await page.evaluate('()=>!!(__ww.cur&&__ww.cur.fill)'):
                await page.evaluate('()=>__ww.cur.fill()'); await page.wait_for_timeout(300); f = f'shots/cdlook_{size}_{i}_b.png'; await page.screenshot(path=f); files.append(f)
                await page.evaluate('()=>{const p=document.querySelector(".prompt, .bubble, .say"); if(p) p.firstChild && (p.firstChild.textContent="It bumped on press 4. Which button was that one, then?")}')
                o = await page.evaluate(OFF)
                if o: print(i, 'filled', o, await page.evaluate('()=>Math.round(document.querySelector(".cd-grid").getBoundingClientRect().width)'))
        for l in logs[:10]: print('LOG', l)
        await b.close()
    ims = [Image.open(f) for f in files]; sc = 0.5 if w >= 800 else 0.6
    ims = [im.resize((int(im.width * sc), int(im.height * sc))) for im in ims]
    cols = min(len(ims), 6 if w < 800 else 3); rows = (len(ims) + cols - 1) // cols
    W2, H2 = ims[0].width, ims[0].height; sheet = Image.new('RGB', (cols * W2 + (cols - 1) * 6, rows * H2 + (rows - 1) * 6), 'white')
    for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * (W2 + 6), (k // cols) * (H2 + 6)))
    sheet.save(f'shots/cdlook_{size}.png'); print('sheet', f'shots/cdlook_{size}.png', len(files))
asyncio.run(main())
