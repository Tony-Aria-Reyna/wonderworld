# Replaces the browser's speech engine with a recorder, with an English and an Arabic voice installed (as in Edge), and checks who says what.
import asyncio, sys, json
from playwright.async_api import async_playwright
FAKE = '''
(() => { const log = []; window.__spoken = log;
  const voices = [{name:'Microsoft Sonia Online (Natural) - English (United Kingdom)', lang:'en-GB'}, {name:'Microsoft Salma Online (Natural) - Arabic (Egypt)', lang:'ar-EG'}];
  const fake = { getVoices: () => voices, cancel(){ log.push({cancel:true}); }, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null, rate:u.rate}); setTimeout(()=>u.onend&&u.onend(), 30); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = function(t){ this.text=t; };
})();'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width':1366,'height':768})
        await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
        await ctx.add_init_script(FAKE)
        page = await ctx.new_page(); logs=[]
        page.on('pageerror', lambda e: logs.append(str(e)[:300]))
        await page.goto('http://localhost:8770/WonderWorld2.html')
        await page.evaluate('()=>{__ww.reset(); __ww.fast=false; ["m1","m2"].forEach(m=>__ww.S().missions["egypt."+m]={done:true}); __ww.go("country","egypt")}'); await page.wait_for_timeout(300)
        spoken = lambda: page.evaluate('()=>{const l=window.__spoken.filter(x=>!x.cancel); window.__spoken.length=0; return l}')
        await spoken()
        await page.evaluate('()=>__ww.cur.auto("m3")'); await page.wait_for_timeout(400)
        await page.click('.btn.go'); await page.wait_for_timeout(400)                       # Let's go
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(4500)      # find Egypt
        await spoken()
        await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(1500)      # meet the words
        print('MEET words:', [ (x['text'], x['voice']) for x in await spoken()][:6])
        # first listening question: answer wrongly to reach the explanation
        for _ in range(40):
            await page.wait_for_timeout(200)
            if await page.evaluate('()=>__ww.cur && __ww.cur.type==="choice"'): break
        await page.wait_for_timeout(900)
        print('QUESTION:', [ (x['text'], x['voice']) for x in await spoken()])
        await page.evaluate('()=>{const c=__ww.cur; c.give((c.answer+1)%c.n)}')
        for _ in range(60):
            await page.wait_for_timeout(200)
            if await page.evaluate('()=>!!document.querySelector(".act.help") && __ww.cur && __ww.cur.type==="choice"'): break
        await page.wait_for_timeout(1200); await spoken()
        await page.evaluate('()=>{const c=__ww.cur; c.give(c.answer)}')
        for _ in range(40):
            await page.wait_for_timeout(200)
            if await page.evaluate('()=>!!document.querySelector(".explain")'): break
        await page.wait_for_timeout(1200)
        card = await page.inner_text('.explain p')
        ex = await spoken()
        print('EXPLAIN card text:', card)
        print('EXPLAIN spoken:', [ (x['text'], x['voice']) for x in ex])
        await page.click('.bubble .spk'); await page.wait_for_timeout(900)
        print('REPEAT button:', [ (x['text'], x['voice']) for x in await spoken()])
        # the same with no Arabic voice installed (Chrome): falls back to sounding it out in English
        await page.evaluate('()=>{speechSynthesis.getVoices().pop(); }'); await page.reload()
        await page.evaluate('()=>{window.__spoken.length=0; __ww.fast=false; __ww.go("country","egypt")}'); await page.wait_for_timeout(1500)
        print('ERRORS:', logs)
        await b.close()
asyncio.run(main())
