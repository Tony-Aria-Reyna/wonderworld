# Plays every mission at several screen sizes, with some wrong answers, and checks the layout at every step.
import asyncio, sys, json
sys.path.insert(0,'tools')
from shot import *
CHECK=r'''()=>{
  const W=innerWidth,H=innerHeight, out=[];
  const sel='.btn,.opt,.np button,.chip:not(.used),.bin,.mcard,.ocard,.wcard,.pslot,.round,.node,.pin.on,.arrows button,.reps button,.tbtn,.pbtn,.mcell.tapme,button.htok,button.hpile,.spot,.spk,.spkbig,.vid,.shop-item,.hud .pill,.ritem';
  document.querySelectorAll(sel).forEach(e=>{ if(e.offsetParent===null) return; const r=e.getBoundingClientRect(); if(r.width<1) return;
    const name=(e.className||e.tagName).toString().split(' ').slice(0,2).join('.')+':'+(e.innerText||'').trim().slice(0,14);
    if(r.left<-2||r.top<-2||r.right>W+2||r.bottom>H+2){ if(!e.closest('.pz-view') && !e.closest('.shop-body') && !e.closest('.room-tray')) out.push('OFFSCREEN '+name+' '+[r.left,r.top,r.right,r.bottom].map(Math.round)); }
    if(Math.min(r.width,r.height)<40) out.push('SMALL '+name+' '+Math.round(r.width)+'x'+Math.round(r.height));
  });
  document.querySelectorAll('.tcell.tapme').forEach(e=>{ const r=e.getBoundingClientRect(); if(Math.min(r.width,r.height)<34) out.push('SMALL weave square '+Math.round(r.width)+'x'+Math.round(r.height)); if(r.left<-2||r.top<-2||r.right>W+2||r.bottom>H+2) out.push('OFFSCREEN weave square'); });
  document.querySelectorAll('.pcell.tapme').forEach(e=>{ const r=e.getBoundingClientRect(); if(Math.min(r.width,r.height)<20) out.push('SMALL pixel square '+Math.round(r.width)+'x'+Math.round(r.height)); if(r.left<-2||r.top<-2||r.right>W+2||r.bottom>H+2) out.push('OFFSCREEN pixel square'); });
  document.querySelectorAll('.bcell.tapme').forEach(e=>{ const r=e.getBoundingClientRect(); if(r.width<30||r.height<38) out.push('SMALL band box '+Math.round(r.width)+'x'+Math.round(r.height)); if(r.left<-2||r.top<-2||r.right>W+2||r.bottom>H+2) out.push('OFFSCREEN band box'); });
  if(document.documentElement.scrollWidth>W+2) out.push('HSCROLL');
  const st=document.querySelector('.stage'); if(st){ const s=st.getBoundingClientRect(); st.querySelectorAll('*').forEach(e=>{ if(e.closest('svg')&&e.tagName!=='svg') return; const r=e.getBoundingClientRect(); if(r.width<1||r.height<1) return; if(r.left<s.left-4||r.right>s.right+4||r.top<s.top-4||r.bottom>s.bottom+4) out.push('STAGE-OVERFLOW '+(e.className||e.tagName).toString().slice(0,24)+' '+Math.round(r.right-s.right)+','+Math.round(r.bottom-s.bottom)); }); }
  // the teaching rule: nothing lights up an answer and no help line says one
  if(document.querySelector('.np .glow,.opts .glow,.opt.glow,.slot.hint')) out.push('TELLS-ANSWER something is glowing');
  const b=document.querySelector('.bubble .txt'); if(b && /\bIt is \d|Type \d/.test(b.textContent)) out.push('TELLS-ANSWER '+b.textContent);
  if(b){ const n=b.textContent.trim().split(/\\s+/).length; if(n>12) out.push('WORDS '+n+': '+b.textContent); const br=b.parentNode.getBoundingClientRect(); if(br.height>H*0.34) out.push('BUBBLE-TALL '+Math.round(br.height)); }
  const an=document.querySelector('.answer'); if(an && an.offsetParent!==null){ const a=an.getBoundingClientRect(); an.querySelectorAll('button').forEach(e=>{const r=e.getBoundingClientRect(); if(r.bottom>a.bottom+3||r.right>a.right+3||r.top<a.top-3) out.push('ANSWER-OVERFLOW '+(e.innerText||'').slice(0,10)+' '+Math.round(r.bottom-a.bottom));}); if(st){const s=st.getBoundingClientRect(); if(s.height<110) out.push('STAGE-SHORT '+Math.round(s.height));} }
  return out;
}'''
STATE='()=>{const c=__ww.cur; if(!c) return null; const scr=document.querySelector(".screen"); return {type:c.type, answer:c.answer, n:c.n, txt:(document.querySelector(".bubble .txt")||{}).textContent, help: !!document.querySelector(".act.help"), scr: scr?scr.className:"", mode: c.state?c.state():null, miss: !!c.miss, ov: !!document.querySelector(".overlay"), ex: !!document.querySelector(".explain")}}'
async def run(p, w, h, tag, wrong_mod, shots, only=None, lv=None, missions=None, deep=False):
    b,page,logs = await boot(p,w,h)
    issues={}; nstate=0; hands=0
    if missions: await page.evaluate('()=>__ww.setPlayer("test")')   # the test player has every mission open, so one mission can be played on its own
    if lv: await page.evaluate('(lv)=>{const S=__ww.S(); for(const id in __ww.SKILLS){const k=__ww.SKILLS[id]; if(k.max>1) S.skills[id]={lv:Math.min(lv,k.max),streak:0,placed:true,clean:0,helped:0,review:false};}}', lv)
    await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(150)
    for i in await page.evaluate(CHECK): issues.setdefault(i.split(' ')[0]+' map '+i,0)
    plan = await page.evaluate('()=>Object.keys(__ww.COUNTRIES).map(c=>[c, __ww.COUNTRIES[c].missions.map(m=>m.id)])')
    if only: plan = [x for x in plan if x[0] in only]
    if missions: plan = [[c, [m for m in ms if m in missions]] for c, ms in plan]
    for cid, mids in plan:
        for mid0 in mids:
            mid = cid+'.'+mid0
            await page.evaluate('(c)=>__ww.go("country",c)', cid); await page.wait_for_timeout(120)
            for i in await page.evaluate(CHECK): issues.setdefault(cid+' country: '+i,0)
            if shots is not None and mid0==mids[0]: await page.screenshot(path=f'shots/qa_{tag}_{cid}_country.png')
            await page.evaluate('(m)=>__ww.cur.auto(m)', mid0)
            last=None; idle=0; asked=0; codefail=0; n=0; washelp=False; mirrormiss=0; st=None; deepmiss=0
            while idle<60:
                await page.wait_for_timeout(60)
                st = await page.evaluate(STATE)
                if st is None: idle+=1; continue
                if 'country' in st['scr'] and not st['ov']: break
                sig=json.dumps(st)
                if sig==last: idle+=1
                else:
                    idle=0; n+=1; nstate+=1
                    await page.wait_for_timeout(380 if st.get('ex') or st.get('ov') else 40)
                    for i in await page.evaluate(CHECK): issues[mid+': '+i]=issues.get(mid+': '+i,0)+1
                    if shots=='all': await page.screenshot(path=f'shots/qa_{tag}_{mid}_{n:02d}.png')
                last=sig
                if st['type'] in ('num','choice'):
                    asked+=1; bad = wrong_mod and (asked % wrong_mod == 2) and not (washelp and not st['help'])
                    if st['help'] and wrong_mod==2: bad = (asked % 4 == 0)
                    # "deep" mode: once per mission, keep missing one help step so the hands-on tool, its repeat and the easier question all run
                    if deep and st['help'] and st['type']=='num' and deepmiss<3: deepmiss+=1; bad=True
                    washelp = st['help'] or bad
                    if st['type']=='num': await page.evaluate('(b)=>__ww.cur.give(b? __ww.cur.answer+1 : __ww.cur.answer)', bad)
                    else: await page.evaluate('(b)=>__ww.cur.give(b? (__ww.cur.answer+1)%__ww.cur.n : __ww.cur.answer)', bad)
                elif st['type']=='btn': await page.evaluate('()=>__ww.cur.auto()')
                elif st['type']=='hands':
                    hands+=1
                    if shots=='all': await page.screenshot(path=f'shots/qa_{tag}_{mid}_{n:02d}_hands.png')
                    await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(120); last=None
                elif st['type']=='act':
                    if st['mode']:
                        if st['mode']['running']: continue
                        if wrong_mod and codefail<2 and st['mode']['mode']=='full': codefail+=1; await page.evaluate('()=>__ww.cur.autoFail()'); await page.wait_for_timeout(250); last=None; continue
                        if st['mode']['mode']=='sub': await page.evaluate('()=>__ww.cur.autoLeg()'); await page.wait_for_timeout(250); last=None; continue
                        codefail=0
                    if st.get('miss') and wrong_mod and mirrormiss<3:
                        mirrormiss+=1; await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(150)
                        for i in await page.evaluate(CHECK): issues[mid+': '+i]=issues.get(mid+': '+i,0)+1
                        if shots=='all': await page.screenshot(path=f'shots/qa_{tag}_{mid}_{n:02d}_miss{mirrormiss}.png')
                        last=None; continue
                    await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(200); last=None
            if idle>=60: issues[mid+': STUCK at '+json.dumps(st)[:160]]=1
    final = await page.evaluate('()=>{const S=__ww.S(); return {stars:S.stars, done:Object.keys(S.missions).filter(k=>S.missions[k].done).length, gold:Object.keys(S.missions).filter(k=>S.missions[k].gold).length, videos:S.videos, log:S.log.length, levels:Object.fromEntries(Object.entries(S.skills).map(([k,v])=>[k,v.lv]))}}')
    final['hands_on'] = hands
    await page.evaluate('()=>__ww.go("passport")'); await page.wait_for_timeout(150)
    for i in await page.evaluate(CHECK): issues.setdefault('passport: '+i,0)
    if shots is not None: await page.screenshot(path=f'shots/qa_{tag}_passport.png')
    if missions: await b.close(); return nstate, final, issues, logs      # a part-run skips the shop: its souvenirs are still locked
    # the room and the shop
    await page.evaluate('()=>{const S=__ww.S(); S.stars=400; __ww.go("map")}'); await page.wait_for_timeout(120)
    for i in await page.evaluate(CHECK): issues.setdefault('map2: '+i,0)
    if shots is not None: await page.screenshot(path=f'shots/qa_{tag}_map.png')
    await page.evaluate('()=>__ww.go("room")'); await page.wait_for_timeout(150)
    for i in await page.evaluate(CHECK): issues.setdefault('room-empty: '+i,0)
    await page.evaluate('()=>__ww.cur.shop()'); await page.wait_for_timeout(150)
    for i in await page.evaluate(CHECK): issues.setdefault('shop: '+i,0)
    await page.click('.shop-item[data-id="cat"]'); await page.wait_for_timeout(120)
    for i in await page.evaluate(CHECK): issues.setdefault('shop-confirm: '+i,0)
    await page.click('.overlay:last-child .btn.go'); await page.wait_for_timeout(100)
    home = {'eg-camel':'egypt','nz-kiwi':'nz','nz-waka':'nz','theme-bush':'nz','ja-train':'japan','ja-dog':'japan','theme-tatami':'japan'}
    want = ['bed','telescope','theme-night'] + [x for x in home if not only or home[x] in only]
    for it in want:
        await page.evaluate('(i)=>__ww.cur.buy(i)', it); await page.wait_for_timeout(50)
    await page.click('.shop-top .btn.go'); await page.wait_for_timeout(150)
    bx = await page.locator('.ritem').first.bounding_box(); await page.mouse.click(bx['x']+bx['width']/2, bx['y']+bx['height']/2); await page.wait_for_timeout(150)
    for i in await page.evaluate(CHECK): issues.setdefault('room: '+i,0)
    final['room'] = await page.evaluate('()=>({stars:__ww.S().stars, items:__ww.S().room.items.length, theme:__ww.S().room.theme})')
    if shots is not None: await page.screenshot(path=f'shots/qa_{tag}_room.png')
    await b.close()
    return nstate, final, issues, logs
async def main():
    # usage: qa.py <wrong_mod> [shots|all] [deep] [country ...] [lv=N] [only=m1,boss]
    #   deep = in each mission keep missing one help step, so the hands-on tools and the "easier question" path are exercised
    #   wrong_mod 0 = every answer right; 3 = every third answer wrong.  lv=N starts every levelled skill at level N, so the hard questions get checked too.
    wrong = int(sys.argv[1]) if len(sys.argv)>1 else 0
    rest = sys.argv[2:]
    shots = 'all' if 'all' in rest else ('some' if 'shots' in rest else None)
    lv = next((int(a[3:]) for a in rest if a.startswith('lv=')), None); missions = next((a[5:].split(',') for a in rest if a.startswith('only=')), None)
    deep = 'deep' in rest
    only = [a for a in rest if a not in ('shots','all','deep') and '=' not in a] or None
    sizes=[(1366,768,'laptop'),(1280,800,'tabL'),(800,1280,'tabP'),(412,915,'phP'),(915,412,'phL'),(360,740,'phS')]
    pick = next((a[5:].split(',') for a in rest if a.startswith('size=')), None)   # size=phS,laptop plays only those sizes
    if pick: sizes = [z for z in sizes if z[2] in pick]
    bad=0
    async with async_playwright() as p:
        for (w,h,tag) in sizes:
            n, final, issues, logs = await run(p,w,h,tag,wrong,shots,only,lv,missions,deep)
            print(f'== {tag} {w}x{h}: {n} states; {final}')
            for k,v in sorted(issues.items()): print('   ',k, ('x'+str(v)) if v>1 else '')
            if logs: print('   LOGS', logs[:5])
            bad += len(issues) + len(logs)
    print('TOTAL PROBLEMS', bad)
    sys.exit(1 if bad else 0)
if __name__ == '__main__': asyncio.run(main())
