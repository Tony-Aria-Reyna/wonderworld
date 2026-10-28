# Countries open one at a time, the bonus row, Japanese inside Japan, the Welcome guide and About (29 October), at one screen size, with real clicks.
# Checks: a new device opens on the Welcome guide; the name typed is used; the map shows only Egypt open, the others locked with a lock and a message naming the country before;
# finishing a country puts a trophy on its flag and opens the next; Japanese joins the bonus row only once Japan is reached; Japan's own bonus button opens the line;
# the passport's Japanese button is locked until then; a country already started stays open; the test player sees every country; nothing in the top bar or the bonus row
# is off the screen, overlaps, or is under 40 px; About opens from the title and from the grown-ups page; the grown-ups page saves a new name.
# python3 tools/t_unlock.py [lap|ph|phL|sm|tabP]     Screenshots: shots/unlock_<size>_*.png
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
PINS = '''()=>Object.fromEntries([...document.querySelectorAll('.pin.on')].map(p=>[p.dataset.id,(p.classList.contains('locked')?'locked':'open')+(p.classList.contains('done')?'+done':'')+(p.querySelector('.pin-done')?'+trophy':'')+(p.querySelector('.pin-lock')?'+lock':'')]))'''
LAYOUT = '''()=>{const out=[],W=innerWidth,H=innerHeight,R=e=>e.getBoundingClientRect();
  const els=[...document.querySelectorAll('.hud .pill,.hud .round,.bonus-row,.bonus-b,.pz-ctl button')].filter(e=>R(e).width);
  els.forEach(e=>{const r=R(e); if(r.left<-1||r.top<-1||r.right>W+1||r.bottom>H+1) out.push('off screen: '+e.className+' '+e.textContent.slice(0,12));
    if(e.matches('button')&&(r.width<40||r.height<40)) out.push('too small: '+e.className+' '+Math.round(r.width)+'x'+Math.round(r.height));});
  const hudB=document.querySelector('.hud'), bon=document.querySelector('.bonus-row');
  if(bon){ const b=R(bon); [...document.querySelectorAll('.hud .pill,.hud .round,.pz-ctl button')].forEach(e=>{const r=R(e); if(r.width&&r.left<b.right-1&&r.right>b.left+1&&r.top<b.bottom-1&&r.bottom>b.top+1) out.push('bonus row overlaps '+e.className);});
    const foot=document.querySelector('.map-foot .bubble'); if(foot){const f=R(foot); if(f.left<b.right-1&&f.right>b.left+1&&f.top<b.bottom-1&&f.bottom>b.top+1) out.push('bonus row overlaps the guide bubble');}
    [...bon.querySelectorAll('.bonus-b span')].forEach(s=>{ if(!R(s).width) out.push('bonus label hidden: '+s.textContent); }); }
  return out;}'''
async def realclick(page, sel):
    r = await page.evaluate('(s)=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2]}', sel)
    if not r: return False
    hit = await page.evaluate('([x,y,s])=>{const e=document.elementFromPoint(x,y); return !!e && !!e.closest(s)}', [r[0], r[1], sel])
    await page.mouse.click(r[0], r[1]); return hit
def done_js(ids): return '()=>{const S=__ww.S(); for (const c of %s) __ww.COUNTRIES[c].missions.forEach(m=>S.missions[c+"."+m.id]={done:true,gold:false}); __ww.save();}' % json.dumps(ids)
async def main():
    w, h = SIZES[size]; bad = []
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        # a new device: the Welcome guide, the name, how it works
        await page.evaluate('()=>{localStorage.clear(); location.reload()}'); await page.wait_for_timeout(900)
        await page.evaluate('()=>{__ww.fast=true}')
        if not await page.query_selector('.welcome'): bad.append('a new device did not open on the Welcome guide')
        await page.screenshot(path=f'shots/unlock_{size}_w1.png')
        if not await realclick(page, '.welcome [data-k=next]'): bad.append('the first Welcome button is covered')
        await page.wait_for_timeout(300)
        if await page.evaluate('()=>!document.querySelector(".wl-name")'): bad.append('no name box')
        if await page.evaluate('()=>!document.querySelector(".welcome [data-k=next]").disabled'): bad.append('"That\'s me!" works with no name')
        await page.click('.wl-name'); await page.keyboard.type('mia-rose 7'); await page.wait_for_timeout(100)
        await page.screenshot(path=f'shots/unlock_{size}_w2.png')
        await realclick(page, '.welcome [data-k=next]'); await page.wait_for_timeout(300)
        nm = await page.evaluate('()=>__ww.S().name')
        if nm != 'Mia-rose': bad.append('the name was saved as ' + repr(nm))
        if 'Hi Mia-rose' not in (await page.evaluate('()=>document.querySelector(".wl-h").textContent')): bad.append('the guide does not greet by name')
        await page.screenshot(path=f'shots/unlock_{size}_w3.png')
        await realclick(page, '.welcome [data-k=next]'); await page.wait_for_timeout(600)
        if not await page.query_selector('.screen.map'): bad.append('the Welcome guide did not end on the map')
        # the map for a new player
        pins = await page.evaluate(PINS)
        exp = {k: 'locked+lock' for k in pins}; exp['egypt'] = 'open'
        if pins != exp: bad.append('new player pins: ' + json.dumps(pins))
        bon = await page.evaluate('()=>[...document.querySelectorAll(".bonus-b")].map(b=>b.dataset.k)')
        if bon != ['code']: bad.append('new player bonus row: ' + str(bon))
        for i in await page.evaluate(LAYOUT): bad.append('map: ' + i)
        await page.screenshot(path=f'shots/unlock_{size}_m1.png')
        await page.evaluate('()=>__ww.go("map")'); await page.wait_for_timeout(300)
        await page.evaluate('()=>document.querySelector(\'.pin[data-id="nz"]\').click()'); await page.wait_for_timeout(200)
        msg = await page.evaluate('()=>document.querySelector(".map-foot .bubble").textContent')
        if 'Finish Egypt first' not in msg or await page.query_selector('.screen.country'): bad.append('a locked country: ' + msg)
        if not await realclick(page, '.bonus-b[data-k=code]'): bad.append('the Code Lab bonus is covered')
        await page.wait_for_timeout(400)
        if not await page.query_selector('.cd-board, .cd-home, .labmenu, .lb'): bad.append('the Code Lab bonus did not open the Code Lab')
        # the passport: Japanese locked
        await page.evaluate('()=>__ww.go("passport")'); await page.wait_for_timeout(300)
        pj = await page.evaluate('()=>{const b=document.querySelector(\'[data-lab="nihongo"]\'); return [b.classList.contains("locked"), b.textContent]}')
        if not pj[0] or 'Opens in Japan' not in pj[1]: bad.append('passport Japanese before Japan: ' + str(pj))
        # Egypt finished: a trophy, New Zealand open
        await page.evaluate(done_js(['egypt'])); await page.evaluate('()=>__ww.go("map")'); await page.wait_for_timeout(400)
        pins = await page.evaluate(PINS)
        if pins.get('egypt') != 'open+done+trophy' or pins.get('nz') != 'open' or pins.get('japan') != 'locked+lock': bad.append('after Egypt: ' + json.dumps(pins))
        tr = await page.evaluate('()=>{const t=document.querySelector(".pin[data-id=egypt] .pin-done").getBoundingClientRect(); return [Math.round(t.width),Math.round(t.height)]}')
        if tr[0] < 18: bad.append('the trophy is too small to see: ' + str(tr))
        await page.screenshot(path=f'shots/unlock_{size}_m2.png')
        await page.evaluate('()=>__ww.go("country","egypt")'); await page.wait_for_timeout(300)
        eb = await page.evaluate('()=>document.querySelector(".foot .bubble").textContent')
        if 'New Zealand is open' not in eb: bad.append('Egypt finished says: ' + eb)
        # New Zealand finished: Japan open, Japanese joins the bonus row
        await page.evaluate(done_js(['nz'])); await page.evaluate('()=>__ww.go("map")'); await page.wait_for_timeout(400)
        bon = await page.evaluate('()=>[...document.querySelectorAll(".bonus-b")].map(b=>b.dataset.k)')
        if bon != ['nihongo', 'code']: bad.append('bonus row once Japan is open: ' + str(bon))
        for i in await page.evaluate(LAYOUT): bad.append('map with Japanese: ' + i)
        await page.screenshot(path=f'shots/unlock_{size}_m3.png')
        if not await realclick(page, '.bonus-b[data-k=nihongo]'): bad.append('the Japanese bonus is covered')
        await page.wait_for_timeout(500)
        if not await page.query_selector('.c-jp'): bad.append('the Japanese bonus did not open the line')
        # Japan's own bonus button
        await page.evaluate('()=>__ww.go("country","japan")'); await page.wait_for_timeout(400)
        jb = await page.evaluate('''()=>{const b=document.querySelector('.country .bonus-b[data-k=nihongo]'); if(!b) return null; const r=b.getBoundingClientRect(), h2=document.querySelector('.country .topbar h2').getBoundingClientRect(), st=document.querySelector('.country .topbar .pill').getBoundingClientRect();
          return {w:Math.round(r.width),h:Math.round(r.height),in:r.left>=0&&r.right<=innerWidth+1&&r.top>=0, overStars:r.right>st.left+1&&r.left<st.right-1, overTitle:r.left<h2.right-1&&r.right>h2.left+1}}''')
        if not jb or jb['h'] < 40 or not jb['in'] or jb['overStars'] or jb['overTitle']: bad.append("Japan's bonus button: " + json.dumps(jb))
        await page.screenshot(path=f'shots/unlock_{size}_japan.png')
        if not await realclick(page, '.country .bonus-b[data-k=nihongo]'): bad.append("Japan's bonus button is covered")
        await page.wait_for_timeout(500)
        if not await page.query_selector('.c-jp'): bad.append("Japan's bonus button did not open the line")
        await page.evaluate('()=>__ww.go("passport")'); await page.wait_for_timeout(300)
        if await page.evaluate('()=>document.querySelector(\'[data-lab="nihongo"]\').classList.contains("locked")'): bad.append('passport Japanese still locked once Japan is open')
        # a country already started stays open, even out of order; and the test player sees every country
        await page.evaluate('()=>{const S=__ww.S(); S.missions={"greece.m1":{done:true}}; __ww.save(); __ww.go("map")}'); await page.wait_for_timeout(400)
        pins = await page.evaluate(PINS)
        if pins.get('greece') != 'open' or pins.get('nz') != 'locked+lock': bad.append('a started country: ' + json.dumps(pins))
        await page.evaluate('()=>{__ww.setPlayer("test"); __ww.go("map")}'); await page.wait_for_timeout(400)
        pins = await page.evaluate(PINS)
        if any(v.startswith('locked') for v in pins.values()): bad.append('test player has locked countries: ' + json.dumps(pins))
        await page.evaluate('()=>__ww.setPlayer("")')
        # About from the title, and the grown-ups page: About and a new name
        await page.evaluate('()=>__ww.go("title")'); await page.wait_for_timeout(300)
        if not await realclick(page, '.title .about-b'): bad.append('About on the title is covered')
        await page.wait_for_timeout(300)
        ab = await page.evaluate('()=>[document.querySelectorAll(".ab-sec").length, document.querySelector(".ab-body").scrollHeight > 0]')
        if ab[0] < 6: bad.append('About has ' + str(ab[0]) + ' sections')
        await page.screenshot(path=f'shots/unlock_{size}_about.png')
        wide = await page.evaluate('()=>[...document.querySelectorAll(".ab-sec,.ab-body p,.ab-body li")].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length')
        if wide: bad.append(str(wide) + ' About parts run off the screen')
        await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(300)
        for _ in range(2):   # the first visit chooses a PIN, then asks for it
            if not await page.locator('.pinpad').count(): break
            for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
            await page.wait_for_timeout(400)
        await page.fill('.nm-in', 'Tane'); await page.click('[data-b=name-save]'); await page.wait_for_timeout(200)
        if await page.evaluate('()=>__ww.S().name') != 'Tane': bad.append('the grown-ups page did not save the name')
        await page.click('[data-b=about]'); await page.wait_for_timeout(300)
        if not await page.query_selector('.screen.about'): bad.append('About did not open from the grown-ups page')
        for l in logs[:20]: print('  LOG', l)
        for x in bad: print('  WRONG', x)
        print(size, 'TOTAL', len(bad) + len([l for l in logs if 'PAGEERROR' in l]), 'problems')
        await b.close()
asyncio.run(main())
