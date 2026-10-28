# Every living thing in the shop, and every souvenir with a head, wearing one room colour's hat, on one sheet, so the hat can be seen sitting on the head.
# python3 tools/t_heads.py [theme]     (default: outback)
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    theme = sys.argv[1] if len(sys.argv) > 1 else 'outback'
    async with async_playwright() as p:
        b,page,logs = await boot(p,1500,760,fast=True)
        n = await page.evaluate('''(theme)=>{const H=__ww.home, d=document.createElement('div'); d.style.cssText='position:fixed;inset:0;background:#FFF8EC;z-index:99999;display:grid;grid-template-columns:repeat(8,1fr);gap:8px;padding:10px;overflow:auto';
          const list=Object.keys(H.HEADS).map(id=>[id,id,H.HEADS[id]]); for(const cid in __ww.COUNTRIES) (__ww.COUNTRIES[cid].souvenirs||[]).forEach(sv=>{ if(sv.head) list.push([sv.id, sv.art, sv.head]); });
          list.forEach(([id,pic,a])=>{const c=document.createElement('div'); c.style.cssText='position:relative;background:#fff;border-radius:14px;padding:26px 14px 4px';
            const fl=document.createElement('div'); fl.className='fl'; fl.style.cssText='position:relative'; const im=__ww.art(pic); if(im.firstChild && im.firstChild.style) im.firstChild.style.cssText='display:block;width:100%;height:auto'; im.style.cssText='display:block;width:100%;height:auto;aspect-ratio:1'; fl.append(im);
            const hat=document.createElement('div'); hat.className='hat'; hat.style.cssText='position:absolute;transform:translate(-50%,-90%);left:'+a[0]+'%;top:'+a[1]+'%;width:'+a[2]+'%'; hat.innerHTML=H.HAT(H.THEME_LOOK[theme].hat); hat.firstChild.style.cssText='display:block;width:100%'; fl.append(hat);
            const g=document.createElement('div'); g.style.cssText='position:absolute;inset:0;background-image:linear-gradient(#0002 1px,transparent 1px),linear-gradient(90deg,#0002 1px,transparent 1px);background-size:10% 10%'; fl.append(g);
            const t=document.createElement('div'); t.textContent=id; t.style.cssText='font:600 12px sans-serif;text-align:center'; c.append(fl,t); d.append(c);}); document.body.append(d); return list.length}''', theme)
        await page.screenshot(path=f'shots/heads_{theme}.png'); print(n, logs); await b.close()
asyncio.run(main())
