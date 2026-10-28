# The web address (node tools/build.mjs --public, served from docs/): it installs as an app and plays offline.
# Checks: the manifest loads with its icons; the service worker takes control; the page then reloads with the network cut off and still reaches the Welcome guide;
# no recording from voices/ is inside it; a phone's safe-area rule is present. Serve docs/ first:  cd docs && python3 -m http.server 8771
# python3 tools/t_pwa.py
import asyncio, json
from playwright.async_api import async_playwright
URL = 'http://localhost:8771/'
async def main():
    bad = []
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': 390, 'height': 844}); page = await ctx.new_page()
        logs = []; page.on('pageerror', lambda e: logs.append(str(e)[:300]))
        await page.goto(URL); await page.wait_for_timeout(800)
        m = await page.evaluate('''async()=>{const l=document.querySelector('link[rel=manifest]'); if(!l) return null; const j=await (await fetch(l.href)).json();
          const ok=[]; for (const i of j.icons) { const r=await fetch(new URL(i.src, l.href)); ok.push(r.ok && (await r.blob()).size>1000); } return {name:j.name, display:j.display, icons:j.icons.length, iconsOk:ok.every(Boolean)}}''')
        print('manifest', m)
        if not m or m['display'] != 'standalone' or m['icons'] < 3 or not m['iconsOk']: bad.append('manifest: ' + json.dumps(m))
        ctl = await page.evaluate('async()=>{const r=await navigator.serviceWorker.ready; await new Promise(res=>setTimeout(res,600)); return !!r.active}')
        if not ctl: bad.append('no service worker')
        await page.reload(); await page.wait_for_timeout(800)
        if not await page.evaluate('()=>!!navigator.serviceWorker.controller'): bad.append('the service worker does not control the page')
        clips = await page.evaluate('()=>[!!document.querySelector(".welcome"), typeof __ww]')
        if not clips[0]: bad.append('a new device does not open on the Welcome guide')
        mi = await page.evaluate('()=>__ww.clipOf("mi","kiwi")')
        if mi: bad.append('a te reo recording from voices/ is inside the public build')
        await ctx.set_offline(True); await page.reload(); await page.wait_for_timeout(1000)
        off = await page.evaluate('()=>!!document.querySelector(".welcome")')
        print('offline reload reaches the Welcome guide:', off)
        if not off: bad.append('the game does not open offline')
        await ctx.set_offline(False)
        html = open('docs/index.html', encoding='utf8').read()
        if 'safe-area-inset-top' not in html or 'apple-touch-icon' not in html or 'viewport-fit=cover' not in html: bad.append('phone settings missing from the page')
        for l in logs: print('  LOG', l)
        for x in bad: print('  WRONG', x)
        print('TOTAL', len(bad) + len(logs), 'problems')
        await b.close()
asyncio.run(main())
