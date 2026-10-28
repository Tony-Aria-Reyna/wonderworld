# Who says the Japanese words? The browser's speech engine is replaced with a recorder and every spoken line of the Japan
# country is played twice: on a device with a Japanese voice (Edge, Android) and on one without.
#   With a Japanese voice: every Japanese word must be said by it, and nothing else may be.
#   Without one: no Japanese writing may ever be handed to the English voice (it is sounded out from the phonetic spelling instead).
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
JA = "{name:'Microsoft Nanami Online (Natural) - Japanese (Japan)', lang:'ja-JP'}"
PLAY = '''async () => { const C = __ww.COUNTRIES.japan, say = x => __ww.say(x); __ww.fast = false; __ww.S().sound = true;
  await say(C.helloSay);
  for (const m of C.missions) { await say(m.intro.say); if (m.nameSay) await say(['Next up:', m.nameSay]);
    for (const r of m.rounds) { if (r.say) await say(r.say); if (r.done && r.done.say) await say(r.done.say); if (r.folds) for (const f of r.folds) await say(f.say); } }
  for (let k = 0; k < 14; k++) { const it = __ww.SKILLS.japanese.gen(1, { used: {} }); await say(it.say); if (it.audio) await it.audio(); await say(it.steps[0].say); if (it.steps[0].audio) await it.steps[0].audio(); await say(it.explain.say); }
  for (let lv = 1; lv <= 3; lv++) for (let k = 0; k < 12; k++) { const it = __ww.SKILLS.kana.gen(lv, {}); await say(it.say); for (const s of it.steps) await say(s.say); await say(it.explain.say); }
  /* the Japanese strand (0761-nihongo.js): every letter, word, picture word and both sides of every conversation, as the game says them */
  const J = __ww.jp;
  for (const st of J.JP_ST) { await say(st.rule.intro); if (st.rule.outro) await say(st.rule.outro);
    for (const k of st.kana) await say([J.JPV(k), '.', 'As in', J.JPV(st.anch[0][0]), st.anch[0][1] + '.']);
    for (const w of st.words) await say([J.JPV(w[0])]);
    for (const a of st.anch) await say([J.JPV(a[0])]);
    for (const t of st.talk) { if (t.count) continue; for (const x of [t.dog, t.me, t.after].concat(t.no || []).concat((t.opts || []).map(o => o[0])).filter(Boolean)) await say([J.JPV(J.jpFill(x))]); await say(t.ask + ' Tap a speaker to hear each one.'); await say(t.clue); } }
  return window.__spoken.slice(); }'''
KANA = lambda t: any('぀' <= ch <= 'ヿ' for ch in t)
async def run(p, voices, label):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width':1366,'height':768})
    await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    await ctx.add_init_script(FAKE.replace('VOICES', voices))
    page = await ctx.new_page(); errs = []
    page.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await page.goto('http://localhost:8770/WonderWorld2.html')
    log = await page.evaluate(PLAY); await b.close()
    ja = [x for x in log if x['voice'] == 'ja-JP']; en = [x for x in log if x['voice'] != 'ja-JP']
    bad = [x for x in en if KANA(x['text'])] + [x for x in ja if not KANA(x['text'])]
    print(f'{label}: {len(log)} lines spoken; {len(ja)} by the Japanese voice, {len(en)} by the English voice; wrong voice: {len(bad)}; errors: {errs}')
    for x in bad[:8]: print('   WRONG VOICE', x)
    print('   examples:', [(x['text'], x['voice']) for x in log if x['voice'] == 'ja-JP'][:4] or [(x['text'], x['voice']) for x in log if '-' in x['text']][:6])
    return len(bad) + len(errs) + (0 if log else 1)
async def main():
    async with async_playwright() as p:
        n = await run(p, '[' + EN + ',' + JA + ']', 'With a Japanese voice') + await run(p, '[' + EN + ']', 'English voice only')
    print('PROBLEMS', n); sys.exit(1 if n else 0)
asyncio.run(main())
