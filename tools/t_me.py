# Her explorer on one sheet: every top, bottoms, shoes, mouth, eye colour, hair style and face extra, so each can be looked at.
# python3 tools/t_me.py [word]     (writes shots/me_sheet.png; with a word, only the pictures whose label has it, drawn bigger: top, bottoms, dress, mouth, eyes, hair, costume)
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1600,1180,fast=True)
        want = sys.argv[1] if len(sys.argv) > 1 else ''
        n = await page.evaluate('''(want)=>{const H=__ww.home, d=document.createElement('div'); d.style.cssText='position:fixed;inset:0;background:#FFF8EC;z-index:99999;display:grid;grid-template-columns:repeat('+(want?6:12)+',1fr);gap:6px;padding:8px;overflow:auto;align-content:start';
          let n=0; const add=(label,o)=>{ if(want && !label.includes(want)) return; const m=H.newMe(Object.assign({skin:2,hair:'bob',hc:1,col:n%8},o)), c=document.createElement('div'); c.style.cssText='background:#fff;border-radius:12px;padding:4px 10px 2px';
            const pic=document.createElement('div'); pic.innerHTML=H.meSvg(m); pic.firstChild.style.cssText='display:block;width:100%;height:auto'; const t=document.createElement('div'); t.textContent=label; t.style.cssText='font:600 12px sans-serif;text-align:center';
            c.append(pic,t); d.append(c); n++;};
          H.TOPS.forEach((t,i)=>add('top: '+t.name,{top:t.id,bot:['shorts','trousers','skirt','long'][i%4],bcol:i%8,shoe:['boots','trainers','sandals'][i%3],scol:i%6}));
          H.TOPS.forEach((t,i)=>add('top: '+t.name+' (white)',{top:t.id,col:3,bot:'trousers',bcol:7,shoe:'trainers',scol:3,skin:5}));
          H.BOTS.forEach((t,i)=>add('bottoms: '+t.name,{bot:t.id,bcol:i+1,top:'tee'}));
          H.BOTS.forEach((t,i)=>add('dress over '+t.name,{bot:t.id,bcol:2,top:'dress',col:6,shoe:'sandals',scol:2}));
          H.SHOES.forEach((t,i)=>H.SHOECOL.forEach((c,j)=>{ if((i+j)%2===0) add(t.name+' '+(j+1),{shoe:t.id,scol:j,bot:i===1?'trousers':'shorts',bcol:1,skin:(i+j)%6}); }));
          H.MOUTHS.forEach((t,i)=>add('mouth: '+t.name,{mouth:t.id,skin:i}));
          H.EYECOL.forEach((c,i)=>add('eyes '+(i+1),{eye:i,skin:i%6,lash:i%2===1}));
          add('freckles',{freck:true,skin:0}); add('freckles dark skin',{freck:true,skin:5}); add('lashes',{lash:true}); add('hearing aid',{aid:true,hair:'short'}); add('aid + long hair',{aid:true,hair:'long'}); add('aid + afro',{aid:true,hair:'afro',skin:4});
          add('round glasses',{glasses:true}); add('square glasses',{glasses:'square'}); add('square + lashes',{glasses:'square',lash:true,mouth:'grin'});
          H.HAIRS.forEach((t,i)=>add('hair: '+t.name,{hair:t.id,hc:i%8,skin:i%6}));
          H.KINDS.forEach((k,i)=>add('costume: '+k.name,{kind:k.id,mouth:'gap',eye:2}));
          document.body.append(d); return n}''', want)
        await page.screenshot(path='shots/me_sheet' + ('_' + want.strip(':') if want else '') + '.png'); print(n, 'pictures', logs); await b.close()
asyncio.run(main())
