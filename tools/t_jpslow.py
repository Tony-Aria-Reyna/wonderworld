# "Slowly" on the say-it panel (0761-nihongo.js). Tony, 11 October: "when I click slowly, none of the words are said slowly". Some Android voices ignore a slower rate,
# so Slowly says the word sound by sound, each its own utterance with a gap between, then the whole word at a slow rate. The speech engine is replaced with a recorder;
# a word card is opened with real clicks and Slowly is pressed.
# python3 tools/t_jpslow.py [lap|ph]
import asyncio, sys, json
from playwright.async_api import async_playwright
SIZES = {'lap': (1280, 800), 'ph': (390, 844)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
FAKE = '''(() => { const log = []; window.__spoken = log; const voices = [{name:'Sonia', lang:'en-GB'},{name:'Nanami', lang:'ja-JP'}];
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null, rate:u.rate}); setTimeout(()=>u.onend&&u.onend(), 5); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); window.SpeechSynthesisUtterance = function(t){ this.text=t; }; })();'''
async def main():
    w, h = SIZES[size]; issues = []
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': w, 'height': h})
        await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort()); await ctx.add_init_script(FAKE)
        page = await ctx.new_page(); errs = []; page.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await page.goto('http://localhost:8770/WonderWorld2.html')
        await page.evaluate('()=>{__ww.reset(); __ww.fast=false; __ww.S().sound=true; __ww.S().jp={st:2,placed:true,met:{1:1,2:1},stop:{1:5,2:5},wins:2,again:[]}; __ww.go("nihongo")}')
        await page.wait_for_timeout(800); await page.click('.lb-b[data-k="words"]'); await page.wait_for_timeout(800)
        for word in ['そら', 'いぬ', 'かお']:
            card = await page.query_selector(f'.jp-wcard[data-w="{word}"]') or await page.query_selector('.jp-wcard')
            word = await card.get_attribute('data-w'); await card.click(); await page.wait_for_timeout(600)
            await page.evaluate('()=>{window.__spoken.length=0}')
            await page.click('.jp-wfocus .jp-eb[data-k="slow"]'); await page.wait_for_timeout(1500)
            log = await page.evaluate('()=>window.__spoken')
            ja = [x for x in log if x['voice'] == 'ja-JP']
            parts = [x['text'] for x in ja]
            if len(word) == 1: ok1 = len(ja) == 1 and parts[0] == word and ja[0]['rate'] <= .6   # one sound: nothing to split, said once, slowly
            if (len(word) == 1 and not ok1) or (len(word) > 1 and (len(ja) < 3 or parts[-1] != word or ''.join(parts[:-1]).replace('わ', 'は') != word.replace('わ', 'は') or any(x['rate'] > .6 for x in ja))): issues.append(word + ': ' + json.dumps(log, ensure_ascii=False))
            print('  ', word, '->', ' / '.join(parts), 'rate', ja[0]['rate'] if ja else None)
        print(size, 'TOTAL', len(issues) + len(errs), 'problems'); [print('   ', i) for i in issues + errs]
        await b.close()
asyncio.run(main())
