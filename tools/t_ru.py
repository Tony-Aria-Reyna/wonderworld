# Who says the Russian words? The browser's speech engine is replaced with a recorder and every spoken line of the Russia
# country is played twice: on a device with a Russian voice (Edge, Android) and on one without.
#   With a Russian voice: every Russian word must be said by it, and nothing else may be.
#   Without one: no Russian letters may ever be handed to the English voice (the word is sounded out from its spelling in our letters instead).
import asyncio, sys
from playwright.async_api import async_playwright
FAKE = '''
(() => { const log = []; window.__spoken = log;
  const voices = VOICES;
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null}); setTimeout(()=>u.onend&&u.onend(), 5); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = function(t){ this.text=t; };
})();'''
EN = "{name:'Microsoft Sonia Online (Natural) - English (United Kingdom)', lang:'en-GB'}"
JA = "{name:'Microsoft Svetlana Online (Natural) - Russian (Russia)', lang:'ru-RU'}"
PLAY = '''async () => { const C = __ww.COUNTRIES.russia, say = x => __ww.say(x); __ww.fast = false; __ww.S().sound = true;
  await say(C.helloSay);
  for (const m of C.missions) { await say(m.intro.say); if (m.nameSay) await say(['Next up:', m.nameSay]);
    for (const r of m.rounds) { if (r.say) await say(r.say); if (r.done && r.done.say) await say(r.done.say); if (r.folds) for (const f of r.folds) await say(f.say); } }
  for (let k = 0; k < 14; k++) { const it = __ww.SKILLS.russian.gen(1, { used: {} }); await say(it.say); if (it.audio) await it.audio(); await say(it.steps[0].say); if (it.steps[0].audio) await it.steps[0].audio(); await say(it.explain.say); }
  for (let lv = 1; lv <= 3; lv++) for (let k = 0; k < 12; k++) { const it = __ww.SKILLS.cyr.gen(lv, {}); await say(it.say); for (const s of it.steps) await say(s.say); await say(it.explain.say); }
  const fixed = C.missions[3].rounds.find(r => r.fixed).fixed(); await say(fixed.say); for (const st of fixed.steps) await say(st.say); await say(fixed.explain.say);
  for (const id of ['space', 'ice', 'scithink']) for (let k = 0; k < 30; k++) { const it = __ww.SKILLS[id].gen(1, { used: {}, tag: 'russia' }); await say(it.say); await say(it.steps[0].say); await say(it.explain.say || it.explain.text); }
  return window.__spoken.slice(); }'''
KANA = lambda t: any('Ѐ' <= ch <= 'ӿ' for ch in t)   # any Cyrillic letter
async def run(p, voices, label):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width':1366,'height':768})
    await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    await ctx.add_init_script(FAKE.replace('VOICES', voices))
    page = await ctx.new_page(); errs = []
    page.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await page.goto('http://localhost:8770/WonderWorld2.html')
    log = await page.evaluate(PLAY); await b.close()
    ja = [x for x in log if x['voice'] == 'ru-RU']; en = [x for x in log if x['voice'] != 'ru-RU']
    bad = [x for x in en if KANA(x['text'])] + [x for x in ja if not KANA(x['text'])]
    print(f'{label}: {len(log)} lines spoken; {len(ja)} by the Russian voice, {len(en)} by the English voice; wrong voice: {len(bad)}; errors: {errs}')
    for x in bad[:8]: print('   WRONG VOICE', x)
    print('   examples:', [(x['text'], x['voice']) for x in log if x['voice'] == 'ru-RU'][:4] or [(x['text'], x['voice']) for x in log if '-' in x['text']][:6])
    return len(bad) + len(errs) + (0 if log else 1)
async def main():
    async with async_playwright() as p:
        n = await run(p, '[' + EN + ',' + JA + ']', 'With a Russian voice') + await run(p, '[' + EN + ']', 'English voice only')
    print('PROBLEMS', n); sys.exit(1 if n else 0)
asyncio.run(main())
