# A lab's stages one by one, each photographed once its animation has played: python3 tools/t_frames.py <lab> <state,state,...> [wait ms, default 7000] [width, default 800]
# The lab is drawn on its own, at a fixed size (the width you give, by 290/400 of it), and each state is set in turn, as the buttons would. Saves shots/frames_<lab>.png (a sheet) and shots/frames_<lab>_<n>.png
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
from PIL import Image
async def main():
    lab, states = sys.argv[1], sys.argv[2].split(','); wait = int(sys.argv[3]) if len(sys.argv)>3 else 7000; W0 = int(sys.argv[4]) if len(sys.argv)>4 else 800; H0 = round(W0*290/400)
    async with async_playwright() as p:
        b,page,logs = await boot(p,W0+40,H0+40,fast=False)
        await page.evaluate('''([lab,w,h])=>{ const st=document.createElement('div'); st.id='tf'; st.style.cssText='position:fixed;left:20px;top:20px;width:'+w+'px;height:'+h+'px;z-index:99999;background:#fff;display:grid'; document.body.append(st); __ww.labs[lab](st); }''', [lab, W0, H0])
        files = []
        for i, s in enumerate(states):
            await page.evaluate('(s)=>{ document.querySelector("#tf .lab").dataset.s = s; }', s)
            await page.wait_for_timeout(wait if i else 600)
            f = f'shots/frames_{lab}_{i}.png'; await page.locator('#tf').screenshot(path=f); files.append(f)
        ims = [Image.open(f) for f in files]; cols = 2; tw, th = ims[0].size; rows = -(-len(ims)//cols)
        sheet = Image.new('RGB', (cols*tw, rows*th), 'white')
        for i, im in enumerate(ims): sheet.paste(im.convert('RGB'), ((i%cols)*tw, (i//cols)*th))
        sheet.save(f'shots/frames_{lab}.png'); print(f'shots/frames_{lab}.png', logs); await b.close()
asyncio.run(main())
