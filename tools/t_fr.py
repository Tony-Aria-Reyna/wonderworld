# Who says the French words? The browser's speech engine is replaced with a recorder and every spoken line of France
# is played twice: on a device with a French voice (Edge, Android) and on one without.
#   With a French voice: every French word must be said by it (the voice of France, where a device also has a Canadian one), and nothing else may be.
#   Without one: the English voice never gets the French spelling; it sounds the word out from the spelling beside it (bon-zhoor).
import asyncio, sys, re
from playwright.async_api import async_playwright
FAKE = '''
(() => { const log = []; window.__spoken = log;
  const voices = VOICES;
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null}); setTimeout(()=>u.onend&&u.onend(), 5); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = function(t){ this.text=t; };
})();'''
EN = "{name:'Microsoft Sonia Online (Natural) - English (United Kingdom)', lang:'en-GB'}"
PT = "{name:'Microsoft Sylvie Online (Natural) - French (Canada)', lang:'fr-CA'}, {name:'Microsoft Denise Online (Natural) - French (France)', lang:'fr-FR'}"
PLAY = '''async () => { const C = __ww.COUNTRIES.france, say = x => __ww.say(x); __ww.fast = false; __ww.S().sound = true;
  await say(C.helloSay);
  for (const m of C.missions) { await say(m.intro.say); if (m.nameSay) await say(['Next up:', m.nameSay]);
    for (const r of m.rounds) { if (r.say) await say(r.say); if (r.qsay) await say(r.qsay); if (r.done && r.done.say) await say(r.done.say); if (r.tryit) await say(r.tryit.say);
      if (r.act === 'race') { await say(r.intro.say); await say(r.win.say); await say(r.lose.say); } if (r.pairs) for (const p of r.pairs) await say(p.say || p.text); } }
  for (const w of __ww.SKILLS.french.words.concat(__ww.SKILLS.french.words)) { const it = __ww.SKILLS.french.gen(1, { used: {}, retestOf: { _w: w } });   /* every word, twice: nothing left to chance */ await say(it.say); if (it.audio) await it.audio(); await say(it.steps[0].say); if (it.steps[0].audio) await it.steps[0].audio(); await say(it.explain.say); }
  for (const id of ['germs', 'xray', 'hotair', 'scithink']) for (let k = 0; k < 40; k++) { const it = __ww.SKILLS[id].gen(1, { used: {}, tag: 'france' }); await say(it.say); await say(it.steps[0].say); await say(it.explain.say || it.explain.text); }
  for (const id of ['measure', 'chance', 'braille']) for (let lv = 1; lv <= __ww.SKILLS[id].max; lv++) for (let k = 0; k < 8; k++) { const it = __ww.SKILLS[id].gen(lv, {}); await say(it.say); for (const s of it.steps) await say(s.say); await say(it.explain.say || it.explain.text); }
  return window.__spoken.slice(); }'''
NATIVE = {'bonjour', 'merci', 'lait', 'chat', 'pomme', 'lièvre'}
words = lambda t: set(re.findall(r"[a-záàâãéèêíóôõúç]+", t.lower()))
async def run(p, voices, label, want):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width':1366,'height':768})
    await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    await ctx.add_init_script(FAKE.replace('VOICES', voices))
    page = await ctx.new_page(); errs = []
    page.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await page.goto('http://localhost:8770/WonderWorld2.html')
    log = await page.evaluate(PLAY); await b.close()
    pt = [x for x in log if (x['voice'] or '').startswith('fr')]; en = [x for x in log if not (x['voice'] or '').startswith('fr')]
    bad = [x for x in en if words(x['text']) & NATIVE] + [x for x in pt if x['text'].lower().strip('!?. ') not in NATIVE] + [x for x in pt if x['voice'] != 'fr-FR']
    said = sorted(set(x['text'].lower() for x in pt))
    print(f'{label}: {len(log)} lines spoken; {len(pt)} by the French voice, {len(en)} by the English voice; wrong voice: {len(bad)}; errors: {errs}')
    for x in bad[:8]: print('   WRONG VOICE', x)
    print('   French voice said:', said if pt else 'nothing', '| sounded out:', sorted(set(x['text'] for x in en if re.fullmatch(r'[a-z]+(-[a-z]+)+', x['text'])))[:12])
    missing = (NATIVE - set(said)) if want else set()
    if missing: print('   NOT SAID BY THE PORTUGUESE VOICE:', missing)
    return len(bad) + len(errs) + (0 if log else 1) + len(missing)
async def main():
    async with async_playwright() as p:
        n = await run(p, '[' + EN + ',' + PT + ']', 'With a French voice', True) + await run(p, '[' + EN + ']', 'English voice only', False)
    print('PROBLEMS', n); sys.exit(1 if n else 0)
asyncio.run(main())
