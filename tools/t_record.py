# The real-voice recorder on the grown-ups page: record with a (fake) microphone, choose a sound file, save and load the voices file,
# and check the game then listens instead of reads. Also checks the silent case: with no recording, no voice speaks a Māori word.
import asyncio, sys, json, wave, struct, math, os
from playwright.async_api import async_playwright
FAKE_TTS = '''(() => { const log = []; window.__spoken = log; const voices = [{name:'Microsoft Molly Online (Natural) - English (New Zealand)', lang:'en-NZ'}];
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push(u.text); setTimeout(()=>u.onend&&u.onend(), 20); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); window.SpeechSynthesisUtterance = function(t){ this.text=t; };
  const P = window.Audio; window.__clips = 0; window.Audio = function(u){ window.__clips++; return new P(u); }; })();'''
def tone(path, secs=0.6):
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(22050)
        n = int(22050 * (secs + 1.0)); frames = bytearray()
        for i in range(n):
            t = i / 22050; v = 0.6 * math.sin(2 * math.pi * 440 * t) if 0.5 <= t < 0.5 + secs else 0     # silence, tone, silence
            frames += struct.pack('<h', int(v * 32767))
        w.writeframes(bytes(frames))
async def main():
    os.makedirs('shots', exist_ok=True); tone('shots/_tone.wav'); bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
        ctx = await b.new_context(viewport={'width':1280,'height':800}, permissions=['microphone'], accept_downloads=True)
        await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
        await ctx.add_init_script(FAKE_TTS); page = await ctx.new_page(); logs=[]
        page.on('pageerror', lambda e: logs.append(str(e)[:300]))
        await page.goto('http://localhost:8770/WonderWorld2.html')
        await page.evaluate('()=>{localStorage.clear(); __ww.reset(); __ww.fast=false;}')
        # 1 a Māori word with no recording at all is never spoken by a voice (every listed word now has one built in, so use a word that is not listed)
        await page.evaluate('()=>{window.__spoken.length=0; return 1}')
        await page.evaluate('()=>__ww.say([{t:"aroha",lang:"mi",fallback:"ah-raw-hah"},"means love."])'); await page.wait_for_timeout(300)
        spoken = await page.evaluate('()=>window.__spoken.slice()')
        print('no recording -> spoken:', spoken)
        if any('aroha' in s.lower() or 'raw' in s for s in spoken): bad += 1; print('  WRONG: a Māori word was spoken without a real voice')
        # 2 record on the grown-ups page
        await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(200)
        for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
        await page.wait_for_timeout(400)
        rows = page.locator('.pa-body table:has(tr.w)').last.locator('tr.w'); print('words listed:', await rows.count())
        await page.screenshot(path='shots/record_a.png', full_page=False)
        await rows.nth(2).locator('button:text("Record")').click(); await page.wait_for_timeout(4200)
        st = await rows.nth(2).locator('td').nth(1).inner_text(); clip = await page.evaluate('()=>(__ww.clipOf("mi","maunga")||"").slice(0,22)+" len "+(__ww.clipOf("mi","maunga")||"").length')
        print('after Record ->', st, '|', clip)
        if 'data:audio/wav' not in clip: bad += 1
        # 3 choose a sound file for the second word: silence either side must be trimmed away
        await rows.nth(1).locator('input[type=file]').set_input_files('shots/_tone.wav'); await page.wait_for_timeout(1200)
        n = await page.evaluate('()=>{const u=__ww.clipOf("mi","moana"); if(!u) return -1; return (atob(u.split(",")[1]).length-44)/2/16000}')
        print('after Choose a sound file -> clip length %.2f s (the file was 1.6 s with a 0.6 s sound in it)' % n)
        if not (0.55 <= n <= 0.9): bad += 1
        await page.screenshot(path='shots/record_b.png')
        # 4 the game now listens for those two words, and plays the recording rather than a voice
        q = await page.evaluate('()=>{const S=__ww.SKILLS.tereo; let it; for(let i=0;i<50;i++){ it=S.gen(1,{}); if(it._w.native==="moana") break; } return {word:it._w.native, text:it.text, audio:!!it.audio}}')
        await page.evaluate('()=>{window.__spoken.length=0; window.__clips=0; return 1}')
        await page.evaluate('()=>__ww.say([{t:"moana",lang:"mi",fallback:"maw-ah-na"},"means sea."])'); await page.wait_for_timeout(1500)
        print('with a recording ->', q, '| clips played:', await page.evaluate('()=>window.__clips'), '| voice said:', await page.evaluate('()=>window.__spoken.slice()'))
        if not q['audio'] or await page.evaluate('()=>window.__clips') != 1: bad += 1
        # 5 save to a file, wipe, load it back
        async with page.expect_download() as dl: await page.click('button:text("Save the recordings to a file")')
        d = await dl.value; path = 'shots/_voices.json'; await d.save_as(path); saved = json.load(open(path, encoding='utf8'))
        print('saved file has (recordings made on this device only):', {k: sorted(v.keys()) for k, v in saved.items()}, '| size', os.path.getsize(path), 'bytes')
        await page.evaluate('()=>{localStorage.removeItem("wonderworld2_voices")}'); await page.reload(); await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(200)
        for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
        await page.wait_for_timeout(300); print('after wiping:', await page.evaluate('()=>!!__ww.clipOf("mi","moana")'))
        await page.locator('input[accept=".json,application/json"]').first.set_input_files(path); await page.wait_for_timeout(500)
        back = await page.evaluate('()=>[!!__ww.clipOf("mi","moana"), !!__ww.clipOf("mi","maunga")]'); print('after loading the file:', back)
        if back != [True, True]: bad += 1
        # 6 the recording studio: one word at a time. The first word without a recording of ours is "kia ora" (it has a built-in one).
        await page.click('button:text("Record the words")'); await page.wait_for_timeout(300)
        w1 = await page.inner_text('.studio .sword'); st1 = await page.inner_text('.studio .sstate')
        await page.screenshot(path='shots/record_studio_a.png')
        await page.click('.studio button:text-is("Record")'); await page.wait_for_timeout(1300)
        live = await page.inner_text('.studio .sstate'); await page.screenshot(path='shots/record_studio_b.png')
        await page.click('.studio button:text-is("Stop")'); await page.wait_for_timeout(1500)
        st2 = await page.inner_text('.studio .sstate'); mine = await page.evaluate('()=>(__ww.clipOf("mi","kia ora")||"").slice(0,14)')
        print('studio ->', w1, '|', st1, '| while recording:', live, '| after Stop:', st2, '| kia ora is now', mine)
        if w1 != 'kia ora' or 'Recording' not in live or 'Saved' not in st2 or 'audio/wav' not in mine: bad += 1; print('  WRONG: the studio did not record the word')
        await page.click('.studio button:text("Keep it")'); await page.wait_for_timeout(200); w2 = await page.inner_text('.studio .sword')
        await page.click('.studio button:text("Keep it")'); await page.click('.studio button:text("Keep it")'); await page.wait_for_timeout(200); w4 = await page.inner_text('.studio .sword')
        await page.screenshot(path='shots/record_studio_c.png')
        print('studio moves on ->', w2, 'then', w4, '(not yet recorded:', await page.inner_text('.studio .sstate'), ')')
        if w2 != 'moana' or w4 != 'waka': bad += 1
        await page.click('.studio button:text-is("Close")'); await page.wait_for_timeout(300)
        head = await page.locator('.pa-body h3', has_text='Your voice').inner_text(); print('grown-ups page heading:', head)
        if '3 of 20' not in head: bad += 1
        print('errors:', logs, '| PROBLEMS', bad + len(logs)); await b.close(); sys.exit(1 if bad or logs else 0)
asyncio.run(main())
