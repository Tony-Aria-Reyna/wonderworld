import asyncio, sys, json
from playwright.async_api import async_playwright
URL='http://localhost:8770/WonderWorld2.html'
async def boot(p, w, h, fast=True, touch=False):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={'width':w,'height':h}, has_touch=touch)
    await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    page = await ctx.new_page()
    logs=[]
    page.on('pageerror', lambda e: logs.append('PAGEERROR '+str(e)[:400]))
    page.on('console', lambda m: logs.append('CONSOLE '+m.text[:300]) if m.type=='error' and 'ERR_FAILED' not in m.text and 'Failed to load resource' not in m.text else None)
    await page.goto(URL)
    await page.evaluate('()=>{__ww.reset(); __ww.fast=%s;}' % ('true' if fast else 'false'))
    return b, page, logs
