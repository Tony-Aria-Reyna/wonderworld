# Drawings on one sheet, large, to look at: python3 tools/t_art.py <name> "<JS expression giving [[label, svg or html, width, height], ...]>"
# The expression runs in the built game, so it can use __ww (for example __ww.ca.SKATER_ART.svg, or __ww.guide('', 'canada').outerHTML).
# Saves shots/art_<name>.png. Used to look at a country's guide, souvenirs, race runners and coding pieces before delivery.
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
JS = '''(list)=>{ document.body.innerHTML=''; document.body.style.cssText='background:#fff;overflow:auto;height:auto;padding:10px'; document.documentElement.style.height='auto';
  for (const [label, html, w, h] of list) { const d=document.createElement('div'); d.style.cssText='display:inline-block;vertical-align:top;margin:6px;text-align:center;font:600 13px sans-serif';
    const i=document.createElement('div'); i.style.cssText='width:'+(w||220)+'px;height:'+(h||220)+'px;border:1px solid #dde;background:#F7F8FC;position:relative'; i.innerHTML=html;
    i.querySelectorAll(':scope > svg, :scope > div > svg').forEach(s=>{ s.style.width='100%'; s.style.height='100%'; });
    d.append(i, label); document.body.append(d); }
  return list.length; }'''
async def main():
    name, expr = sys.argv[1], sys.argv[2]
    async with async_playwright() as p:
        b, page, logs = await boot(p, 1400, 900)
        lst = await page.evaluate('()=>(' + expr + ')')
        await page.evaluate(JS, lst); await page.wait_for_timeout(400)
        await page.screenshot(path='shots/art_' + name + '.png', full_page=True)
        print('shots/art_' + name + '.png', len(lst), logs); await b.close()
asyncio.run(main())
