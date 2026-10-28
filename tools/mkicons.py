# The app icons for the web address (gen/icons/*.png): the Fluent Emoji globe on WonderWorld's teal, drawn in Chromium and saved as PNG.
# python3 tools/mkicons.py
import asyncio, json
from playwright.async_api import async_playwright
I = json.load(open('node_modules/@iconify-json/fluent-emoji-flat/icons.json'))['icons']
def icon(n, x, y, s, rot=0):   # a Fluent Emoji (32 x 32) placed at x, y on a 100 x 100 drawing, s wide, turned rot degrees
    return f'<g transform="translate({x} {y}) rotate({rot} {s/2} {s/2}) scale({s/32})">{I[n]["body"]}</g>'
# Tony, 29 October: "This icon needs to be more fun". A sunburst, the globe, a rocket swooping round it, a rainbow, stars and sparkles
RAYS = ''.join(f'<path d="M50 50 L{50+80*__import__("math").cos(__import__("math").radians(a))} {50+80*__import__("math").sin(__import__("math").radians(a))} L{50+80*__import__("math").cos(__import__("math").radians(a+15))} {50+80*__import__("math").sin(__import__("math").radians(a+15))}Z" fill="#FFFFFF" opacity=".22"/>' for a in range(0, 360, 30))
def art(g):
    k = g / .72   # the maskable icon keeps everything inside its safe circle
    inner = (RAYS + '<path d="M14 66a36 36 0 0 1 72 0" fill="none" stroke="#FF5A6E" stroke-width="5"/><path d="M19 66a31 31 0 0 1 62 0" fill="none" stroke="#FFB020" stroke-width="5"/><path d="M24 66a26 26 0 0 1 52 0" fill="none" stroke="#3CC46A" stroke-width="5"/><path d="M29 66a21 21 0 0 1 42 0" fill="none" stroke="#3B8BFF" stroke-width="5"/>'
      + icon('globe-showing-asia-australia', 26, 30, 48) + icon('rocket', 62, 8, 30, 10) + icon('glowing-star', 8, 10, 20, -12) + icon('sparkles', 72, 66, 20) + icon('star', 12, 70, 14, 15))
    return f'<g transform="translate({50-50*k} {50-50*k}) scale({k})">{inner}</g>'
def page(size, maskable):
    r = 0 if maskable else round(size * .22); g = .6 if maskable else .72
    return f'''<html><body style="margin:0;background:transparent"><div style="width:{size}px;height:{size}px;border-radius:{r}px;overflow:hidden;background:radial-gradient(circle at 50% 42%,#9AF2FF,#37B8F0 55%,#5A5AE6);display:grid;place-items:center">
      <svg viewBox="0 0 100 100" width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">{art(g)}</svg></div></body></html>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, size, mask in [('icon-192.png', 192, False), ('icon-512.png', 512, False), ('icon-maskable-512.png', 512, True), ('apple-touch-icon.png', 180, True)]:
            pg = await b.new_page(viewport={'width': size, 'height': size})
            await pg.set_content(page(size, mask)); await pg.screenshot(path='gen/icons/' + name, omit_background=True); await pg.close()
        await b.close()
asyncio.run(main())
