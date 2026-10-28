# Counting with Kenta (0761-nihongo.js, the Talk stop of stations 6 and 8), played with real mouse clicks, not the game's own hooks.
# Tony, 10 October: "i cant trigger the next step" - the first apple sat under the player and could not be tapped. For each count (fewest and most of each thing)
# it checks every thing can be tapped where it is drawn, is not under the player or Kenta, does not overlap another, is big enough for a finger;
# then taps each one, picks the number, and checks Kenta said what to count in Japanese and then English.
# python3 tools/t_jpcount.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
from playwright.async_api import async_playwright
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'lap'
FAKE = '''(() => { const log = []; window.__spoken = log; const voices = [{name:'Sonia', lang:'en-GB'},{name:'Nanami', lang:'ja-JP'}];
  const fake = { getVoices: () => voices, cancel(){}, speak(u){ log.push({text:u.text, voice:u.voice?u.voice.lang:null}); setTimeout(()=>u.onend&&u.onend(), 5); }, addEventListener(){} };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); window.SpeechSynthesisUtterance = function(t){ this.text=t; }; })();'''
GEOM = '''()=>{const out=[]; const sc=document.querySelector('.jp-scene').getBoundingClientRect(); const ch=[...document.querySelectorAll('.jp-me,.jp-dog')].map(e=>e.getBoundingClientRect());
  const T=[...document.querySelectorAll('.jp-thing')]; const R=T.map(e=>e.getBoundingClientRect()); const ov=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  T.forEach((e,i)=>{const r=R[i], cx=r.left+r.width/2, cy=r.top+r.height/2, hit=document.elementFromPoint(cx,cy);
    if(!hit||hit.closest('.jp-thing')!==e) out.push('thing '+i+' cannot be tapped: '+(hit?hit.className.baseVal!==undefined?hit.className.baseVal:hit.className:'nothing')+' is on top');
    if(r.width<30) out.push('thing '+i+' only '+Math.round(r.width)+' px wide');
    if(r.left<sc.left-1||r.right>sc.right+1||r.top<sc.top-1||r.bottom>sc.bottom+1) out.push('thing '+i+' outside the scene');
    ch.forEach((c,k)=>{ if(ov(r,c)>0.15*r.width*r.height) out.push('thing '+i+' is under '+(k?'Kenta':'the player')); });
    R.forEach((q,j)=>{ if(j>i && ov(r,q)>0.1*r.width*r.height) out.push('things '+i+' and '+j+' overlap'); }); });
  document.querySelectorAll('.jp-bub.on,.jp-bub.on small').forEach(e=>{const r=e.getBoundingClientRect(); if(r.left<sc.left-1||r.right>sc.right+1||e.scrollWidth>e.clientWidth+2) out.push('speech bubble runs off: '+e.textContent);});
  return {out, centres:R.map(r=>[r.left+r.width/2, r.top+r.height/2])};}'''
CASES = [(6, 'apples', 2), (6, 'apples', 5), (8, 'cherry blossoms', 6), (8, 'cherry blossoms', 10)]
async def one(p, stn, many, N):
    w, h = SIZES[size]; issues = []
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': w, 'height': h})
    await ctx.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort()); await ctx.add_init_script(FAKE)
    page = await ctx.new_page(); errs = []; page.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await page.goto('http://localhost:8770/WonderWorld2.html')
    await page.evaluate('''([n,N])=>{__ww.reset(); __ww.fast=false; __ww.S().sound=true; const m={}, s={}; for(let i=1;i<n;i++){m[i]=1;s[i]=5;} s[n]=3;
      __ww.S().jp={st:n-1,placed:true,met:m,stop:s,wins:n-1,again:[]}; __ww.jpCountN=N; __ww.go("map");}''', [stn, N])
    await page.wait_for_timeout(400); await page.click('.jp-pill')
    async def cur(): return await page.evaluate('()=>__ww.cur? {t:__ww.cur.type, k:Object.keys(__ww.cur).join(",")} : null')
    for _ in range(2):   # her home, then the station: pick the glowing next one each time
        for _ in range(60):
            c = await cur()
            if c and c['t'] == 'labmenu': break
            await page.wait_for_timeout(100)
        await page.evaluate('()=>__ww.cur.pick("next")'); await page.wait_for_timeout(300)
    for _ in range(150):
        if await page.evaluate('(N)=>document.querySelectorAll(".jp-thing").length==N && __ww.cur && __ww.cur.type=="act"', N): break
        await page.wait_for_timeout(100)
    else: issues.append('the counting screen never came'); 
    await page.wait_for_timeout(500)
    g = await page.evaluate(GEOM); issues += g['out']
    await page.screenshot(path=f'shots/jpcount_{size}_{stn}_{N}.png')
    for (x, y) in g['centres']: await page.mouse.click(x, y); await page.wait_for_timeout(120)
    for _ in range(60):
        c = await cur()
        if c and c['t'] == 'choice': break
        await page.wait_for_timeout(100)
    else: issues.append('tapping every one did not reach "How many?"')
    txt = await page.evaluate('()=>(document.querySelector(".bubble .txt, .bub-txt, .prompt")||{}).textContent||""')
    if many not in txt: issues.append('the question does not say what is counted: ' + txt)
    ans = await page.evaluate('()=>__ww.cur&&__ww.cur.answer')
    if ans is not None:
        try: await page.click(f'.jp-opts .jp-opt >> nth={ans}', timeout=5000)
        except Exception as e:
            await page.screenshot(path=f'shots/jpcount_{size}_{stn}_{N}_stuck.png'); issues.append('no number to pick; cur=' + json.dumps(await cur()))
    for _ in range(80):
        c = await cur()
        if c and c['t'] == 'btn': break
        await page.wait_for_timeout(100)
    else: issues.append('the right number did not lead on to "say it"')
    log = await page.evaluate('()=>window.__spoken')
    texts = [(x['text'], x['voice']) for x in log]
    if ('かぞえて！', 'ja-JP') not in texts: issues.append('Kenta did not say かぞえて in the Japanese voice')
    if not any(t == f'Count the {many}!' and v == 'en-GB' for t, v in texts): issues.append(f'"Count the {many}!" was not said in English')
    if not any(t.startswith(f'Tap each {many[:-1] if many.endswith("s") else many}') for t, v in texts): issues.append('the prompt did not say what to tap')
    issues += ['PAGEERROR ' + e for e in errs]
    await b.close()
    print(f'  station {stn}, {N} {many}: {len(issues)} problems'); [print('     ', i) for i in issues]
    return len(issues)
async def main():
    async with async_playwright() as p:
        n = 0
        for c in CASES: n += await one(p, *c)
    print(size, 'TOTAL', n, 'problems')
asyncio.run(main())
