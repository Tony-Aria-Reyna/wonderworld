# Who says the te reo Māori words? The rule: only a real voice. Two devices are faked.
#   1. A New Zealand English voice only (Edge today): Māori word cards must NOT be spoken by it. The cards are read; English says the meaning.
#   2. A device with a real Māori voice: that voice says the words.
# A word with a recording built in (voices/mi/…) is played from the recording on every device, so no voice says it: the test asks the game which words have one.
# (Making recordings is covered by t_record.py.) Bird names inside English questions are still read by the narrator.
import asyncio, sys, json
from playwright.async_api import async_playwright
def fake(voices): return '''
(() => { const log = []; window.__spoken = log; const voices = %s;
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null}); setTimeout(()=>u.onend&&u.onend(), 25); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); window.SpeechSynthesisUtterance = function(t){ this.text=t; };
})();''' % json.dumps(voices)
SETUPS = {
  'NZ English voice only': [{'name':'Microsoft Molly Online (Natural) - English (New Zealand)','lang':'en-NZ'}],
  'A Maori voice installed': [{'name':'Microsoft Molly Online (Natural) - English (New Zealand)','lang':'en-NZ'},{'name':'Reo Maori voice','lang':'mi-NZ'}],
}
MAORI = ['kia ora','moana','maunga','waka','manu','whetū','tātai','kee-a','maw-ah','moe-nga','wah-ka','mah-noo','feh-too','tah-tie']
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); bad = 0
        for name, voices in SETUPS.items():
            ctx = await b.new_context(viewport={'width':1366,'height':768})
            await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
            await ctx.add_init_script(fake(voices)); page = await ctx.new_page(); logs=[]
            page.on('pageerror', lambda e: logs.append(str(e)[:300]))
            await page.goto('http://localhost:8770/WonderWorld2.html')
            await page.evaluate('()=>{localStorage.clear(); __ww.reset(); __ww.fast=false; ["m1","m2"].forEach(m=>__ww.S().missions["nz."+m]={done:true}); __ww.go("country","nz")}'); await page.wait_for_timeout(300)
            spoken = lambda: page.evaluate('()=>{const l=window.__spoken.slice(); window.__spoken.length=0; return l.map(x=>[x.text,x.voice])}')
            await page.evaluate('()=>__ww.cur.auto("m3")'); await page.wait_for_timeout(300)
            await page.click('.btn.go'); await page.wait_for_timeout(300)
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(4200); await spoken()      # find NZ
            prompt = await page.inner_text('.bubble .txt')
            for i in range(6): await page.locator('.wcard').nth(i).click(); await page.wait_for_timeout(350)
            said = await spoken(); words = [x for x in said if any(m in x[0].lower() for m in MAORI)]
            clips = await page.evaluate('()=>["kia ora","moana","maunga","waka","manu","tātai whetū"].filter(w=>__ww.clipOf("mi",w))')
            q = await page.evaluate('()=>{for(let i=0;i<200;i++){const it=__ww.SKILLS.tereo.gen(1,{}); if(!__ww.clipOf("mi",it._w.native)) return it.text} return "none"}')
            qc = await page.evaluate('()=>{for(let i=0;i<200;i++){const it=__ww.SKILLS.tereo.gen(1,{}); if(__ww.clipOf("mi",it._w.native)) return it.text} return ""}')
            sent = await page.evaluate('()=>__ww.SKILLS.graphs.gen(1,{tag:"nz"}).say')
            print(f'== {name}\n   words with a recording built in: {clips}\n   cards screen says: {prompt}\n   on tapping the cards, Māori words spoken: {words}\n   everything spoken: {[x[0] for x in said][:8]}\n   quiz: {q}\n   a graph question (narrator): {sent}\n   errors: {logs}')
            real = any(v['lang']=='mi-NZ' for v in voices)
            if real and not (len(words) == 6 - len(clips) and all(v == 'mi-NZ' for _, v in words)): bad += 1; print('   WRONG: the Māori voice should say every word that has no recording')
            if any(c in x[0].lower() for x in said for c in clips): bad += 1; print('   WRONG: a word with a recording was spoken by a voice')
            if clips and 'Listen' not in qc: bad += 1; print('   WRONG: a word with a recording should be a listening question')
            if not real and words: bad += 1; print('   WRONG: a Māori word was spoken by a voice that is not Māori')
            if q != 'none' and (not real) != ('Read' in q): bad += 1; print('   WRONG: quiz mode')   # 'none': every word has a recording built in, so there is no reading question to check
            if not real and 0 < len(clips) < 6 and 'hear te reo' in prompt: bad += 1; print('   WRONG: the cards screen promises sound for every word')
            await ctx.close()
        print('PROBLEMS', bad); await b.close(); sys.exit(1 if bad else 0)
asyncio.run(main())
