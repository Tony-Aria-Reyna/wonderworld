# Voices (0607-voices.js, 29 October): a device with no voice for a language says so on screen, and the fix is one screen away.
# The browser's voice list is replaced by a pretend one (Chromium here has no voices), on a pretend Android phone:
#  1 only English voices: a Japanese word brings up the note "No Japanese voice ... Fix it" once (not twice); Fix it opens the voices screen with a cross on every
#    language, the Android steps and an Open speech settings link to Android's speech settings; nothing off the screen; Test buttons 40 px or more.
#  2 the phone gains a Japanese voice while the game is away (as after downloading it in Settings): coming back, the screen shows a tick for Japanese, and the word is
#    now said by the Japanese voice.
#  3 the grown-ups page's Check the voices button opens the same screen.
#  4 a device with every voice: no note at all, and the screen says every language has its own voice.
# python3 tools/t_voices.py [ph|lap|phL|sm|tabP]
import asyncio, sys
from playwright.async_api import async_playwright
URL = 'http://localhost:8770/WonderWorld2.html'
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
FAKE = '''(langs)=>{ window.__voices = langs.map(l=>({name:'Google '+l, lang:l, localService:true, default:false, voiceURI:l}));
  window.__spoken = [];
  speechSynthesis.getVoices = () => window.__voices;
  speechSynthesis.speak = u => { window.__spoken.push({text:u.text, lang:u.lang, voice:u.voice?u.voice.lang:null}); setTimeout(()=>u.onend&&u.onend(), 30); };
  speechSynthesis.cancel = () => {};
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.voice = null; this.lang = ''; };   /* a real utterance only takes a real voice */ }'''
OFF = '''()=>{const out=[]; document.querySelectorAll('.vh-card button,.vh-card a,.vh-note button').forEach(e=>{const r=e.getBoundingClientRect(); if(!r.width) return;
  if(r.right>innerWidth+1||r.left<-1||r.bottom>innerHeight+1||r.top<-1){ const c=document.querySelector('.vh-card'); if(!c||!c.contains(e)||c.scrollHeight<=c.clientHeight) out.push('off screen: '+(e.textContent||e.className).trim().slice(0,20)); }
  if(r.height<39.5) out.push('small: '+(e.textContent||e.className).trim().slice(0,20)+' '+Math.round(r.height)); }); return out;}'''
async def main():
    w, h = SIZES[size]; bad = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for langs, case in ((['en-NZ', 'en-US'], 'none'), (['en_AU', 'ja_JP', 'ar_EG', 'ru_RU', 'pt_BR', 'fr_FR', 'el_GR', 'zh_CN', 'fr_CA'], 'all')):
            ctx = await b.new_context(viewport={'width': w, 'height': h}, user_agent=ANDROID, has_touch=True)
            await ctx.add_init_script('(' + FAKE + ')(' + str(langs).replace("'", '"') + ')')
            page = await ctx.new_page(); logs = []; page.on('pageerror', lambda e: logs.append(str(e)[:300]))
            await page.goto(URL); await page.evaluate('()=>{__ww.reset(); __ww.fast=false; __ww.S().sound=true; __ww.go("map")}'); await page.wait_for_timeout(500)
            await page.evaluate('()=>__ww.say([{t:"こんにちは", lang:"ja"}])'); await page.wait_for_timeout(300)
            await page.evaluate('()=>__ww.say([{t:"ありがとう", lang:"ja"}])'); await page.wait_for_timeout(300)
            notes = await page.evaluate('()=>[...document.querySelectorAll(".vh-note")].map(n=>n.textContent)')
            if case == 'all':
                if notes: bad.append('a note appeared on a device with every voice: ' + str(notes))
                # Android, way 1 (the default): the language in standard form (ja-JP although the phone reports ja_JP), no voice named
                sp = await page.evaluate('()=>__spoken.filter(s=>/[\\u3040-\\u30ff]/.test(s.text)).map(s=>[s.lang, s.voice])')
                if not sp or any(x != ['ja-JP', None] for x in sp): bad.append('way 1: Japanese not asked for as ja-JP by language: ' + str(sp))
                await page.evaluate('()=>__ww.voiceHelp()'); await page.wait_for_timeout(300)
                s = await page.evaluate('()=>[document.querySelector(".vh-sum").textContent, document.querySelectorAll(".vh-row.ok").length, !!document.querySelector(".vh-fix")]')
                txt = await page.evaluate('()=>document.querySelector(".vh-card").innerText')
                if 'null' in txt or 'undefined' in txt: bad.append('the screen prints null or undefined')
                if s[1] != 8 or s[2] or 'Every language' not in s[0]: bad.append('every voice: ' + str(s))
                await page.screenshot(path=f'shots/voices_{size}_all.png')
                # way 2, from the switch: the voice is named as well, and the choice is kept on this device
                await page.click('.vh-ways [data-way="voice"]'); await page.wait_for_timeout(200)
                await page.evaluate('()=>{__spoken.length=0}'); await page.click('.vh-row[data-lang="ja"] .vh-test'); await page.wait_for_timeout(200)
                sp = await page.evaluate('()=>__spoken.map(s=>[s.lang, s.voice])')
                kept = await page.evaluate('()=>localStorage.getItem("wonderworld2_voiceway")')
                on = await page.evaluate('()=>document.querySelector(\'.vh-ways [data-way="voice"]\').getAttribute("aria-pressed")')
                if sp != [['ja-JP', 'ja_JP']] or kept != 'voice' or on != 'true': bad.append('way 2: ' + str([sp, kept, on]))
                bad += ['screen: ' + x for x in await page.evaluate(OFF)]
            else:
                if len(notes) != 1 or 'Japanese' not in notes[0]: bad.append('the note for a missing Japanese voice: ' + str(notes))
                await page.screenshot(path=f'shots/voices_{size}_note.png')
                bad += ['note: ' + x for x in await page.evaluate(OFF)]
                await page.click('.vh-note .btn'); await page.wait_for_timeout(300)
                s = await page.evaluate('''()=>[document.querySelectorAll(".vh-row.no").length, [...document.querySelectorAll(".vh-fix li")].length, (document.querySelector(".vh-open")||{}).href||"", !!document.querySelector(".vh-note")]''')
                if s[0] != 8 or s[1] != 4 or 'TTS_SETTINGS' not in s[2] or s[3]: bad.append('the voices screen with no voices: ' + str(s))
                bad += ['screen: ' + x for x in await page.evaluate(OFF)]
                await page.screenshot(path=f'shots/voices_{size}_none.png')
                # the phone gains Japanese while away, then the game comes back
                await page.evaluate('()=>{ __voices.push({name:"Google ja-JP", lang:"ja-JP", localService:true}); document.dispatchEvent(new Event("visibilitychange")); }'); await page.wait_for_timeout(300)
                j = await page.evaluate('()=>document.querySelector(\'.vh-row[data-lang="ja"]\').className')
                if 'ok' not in j: bad.append('Japanese did not turn to a tick on coming back: ' + j)
                await page.screenshot(path=f'shots/voices_{size}_back.png')
                await page.evaluate('()=>{__spoken.length=0}'); await page.click('.vh-row[data-lang="ja"] .vh-test'); await page.wait_for_timeout(200)
                sp = await page.evaluate('()=>__spoken.map(s=>s.lang)')
                if sp != ['ja-JP']: bad.append('Test did not ask for Japanese: ' + str(sp))
                await page.click('.vh-btns [data-k="close"]'); await page.wait_for_timeout(200)
                if await page.query_selector('.vh-card'): bad.append('Done did not close the screen')
                # the grown-ups page
                await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(300)
                if await page.locator('.pinpad').count():
                    for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
                    await page.wait_for_timeout(400)
                await page.click('.vh-check'); await page.wait_for_timeout(300)
                if not await page.query_selector('.vh-card'): bad.append('Check the voices did not open the screen')
            bad += ['page error: ' + l for l in logs]
            await ctx.close()
        await b.close()
    for x in bad: print('  WRONG', x)
    print(size, 'TOTAL', len(bad), 'problems')
asyncio.run(main())
