import asyncio, sys, json
sys.path.insert(0,'tools')
from shot import *
# usage: t_m.py W H tag mission wrongEvery maxShots
async def main():
    w,h,tag,mid,wrong_every,maxshots = int(sys.argv[1]),int(sys.argv[2]),sys.argv[3],sys.argv[4],int(sys.argv[5]),int(sys.argv[6])
    pre = sys.argv[7] if len(sys.argv)>7 else ''
    async with async_playwright() as p:
        b,page,logs = await boot(p,w,h)
        if pre: await page.evaluate(pre)
        await page.evaluate('()=>__ww.go("country","egypt")'); await page.wait_for_timeout(200)
        await page.evaluate('(m)=>{const S=__ww.S(); ["m1","m2","m3","m4","boss"].forEach(x=>{ if(x!==m) S.missions["egypt."+x]={done:true}; });__ww.go("country","egypt"); __ww.cur.auto(m)}', mid)
        n=0; asked=0; last=None; idle=0
        while n<maxshots and idle<40:
            await page.wait_for_timeout(120)
            st = await page.evaluate('()=>{const c=__ww.cur; if(!c) return null; const scr=document.querySelector(".screen"); return {type:c.type, answer:c.answer, n:c.n, txt:(document.querySelector(".bubble .txt")||{}).textContent, help: !!document.querySelector(".act.help"), scr: scr?scr.className:"" , mode: c.state?c.state():null, ov: !!document.querySelector(".overlay")}}')
            if st is None: idle+=1; continue
            sig=json.dumps(st)
            if sig==last: idle+=1
            else: idle=0
            if 'country' in st['scr'] and not st['ov'] and n>2: break
            if sig!=last:
                n+=1; await page.screenshot(path=f'shots/{tag}_{n:02d}.png'); print(n, st)
            last=sig
            if st['type'] in('num','choice'):
                asked+=1
                bad = wrong_every and (asked % wrong_every==1) and not st['help']
                if st['type']=='num': await page.evaluate('(b)=>__ww.cur.give(b? __ww.cur.answer+1 : __ww.cur.answer)', bad)
                else: await page.evaluate('(b)=>__ww.cur.give(b? (__ww.cur.answer+1)%__ww.cur.n : __ww.cur.answer)', bad)
            elif st['type']=='btn': await page.evaluate('()=>__ww.cur.auto()')
            elif st['type']=='act':
                if st['mode'] and st['mode']['running']: continue
                await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
        print('LOGS',logs); print('STATE', await page.evaluate('()=>JSON.stringify({stars:__ww.S().stars, skills:__ww.S().skills, missions:__ww.S().missions, videos:__ww.S().videos, log:__ww.S().log.length})'))
        await b.close()
asyncio.run(main())
