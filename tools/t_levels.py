# Every level of chosen skills on one sheet: question picture, each break-down step, and the "now you know" picture.
# python3 tools/t_levels.py fractions turns graphs [tag]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
async def main():
    TAGS=('nz','egypt','japan'); skills=[a for a in sys.argv[1:] if a not in TAGS]; tag=([a for a in sys.argv[1:] if a in TAGS] or ['nz'])[0]
    async with async_playwright() as p:
        b,page,logs = await boot(p,1500,900)
        for sk in skills:
            n = await page.evaluate('''([sk,tag])=>{ const S=__ww.SKILLS[sk], C=__ww.COUNTRIES[tag]; document.querySelectorAll('#lv').forEach(e=>e.remove());
              const d=document.createElement('div'); d.id='lv'; d.style.cssText='position:absolute;left:0;top:0;width:1500px;z-index:9999;background:#F4FBF0;padding:10px;font:600 15px Fredoka;color:#1B2A4E';
              const box=(title,fn,extra)=>{ const c=document.createElement('div'); c.style.cssText='width:232px;display:inline-block;vertical-align:top;margin:4px'; const st=document.createElement('div'); st.className='stage'; st.style.cssText='width:232px;height:190px;position:relative'; if(fn) fn(st); c.append(st); const t=document.createElement('div'); t.style.cssText='font-size:13px;line-height:1.2;min-height:34px'; t.textContent=title; c.append(t); if(extra){ const o=document.createElement('div'); o.style.cssText='display:flex;gap:3px;flex-wrap:wrap'; extra.forEach((x,i)=>{ const b=document.createElement('div'); b.style.cssText='background:#fff;border-radius:6px;padding:2px 5px;font-size:11px;border:2px solid '+(x.right?'#34C17B':'#D5DAE6'); if(x.svg){b.innerHTML=x.svg; b.firstChild.style.cssText='width:40px;height:40px;display:block'} else b.textContent=x.label; o.append(b); }); c.append(o);} return c; };
              let rows=0;
              for(let lv=1; lv<=S.max; lv++) for(let k=0;k<(S.max>1?2:3);k++){ const it=S.gen(lv,{tag,thing:C.thing,boat:C.boat,used:{}}); rows++;
                const r=document.createElement('div'); r.style.cssText='border-top:2px solid #cfe6c3;margin-top:4px;white-space:nowrap';
                const opts=x=>x.type==='choice'? x.options.map((o,i)=>({label:o.label||'', svg:o.svg|| (o.icon&&o.icon.svg), right:i===x.answer})) : [{label:'answer '+x.answer, right:true}];
                r.append(box('L'+lv+' Q: '+it.text+' | SAY: '+(typeof it.say==='string'?it.say:''), it.visual, opts(it)));
                it.steps.forEach((s,i)=>r.append(box('step '+(i+1)+': '+s.text+' | '+(typeof s.say==='string'?s.say:'')+(s.show?' | SHOW: '+s.show:''), s.visual, opts(s))));
                r.append(box('KNOW: '+it.explain.text+(it.explain.say&&typeof it.explain.say==='string'?' | '+it.explain.say:''), it.visualDone||it.visual));
                d.append(r); }
              document.body.style.overflow='auto'; document.getElementById('app').style.display='none'; document.body.append(d); return rows; }''', [sk,tag])
            await page.wait_for_timeout(300)
            el = await page.query_selector('#lv'); bb = await el.bounding_box(); h=int(bb['height']); part=0; y=0
            await page.set_viewport_size({'width':1500,'height':min(h,16000)})
            while y < h:
                hh=min(1500,h-y); await page.screenshot(path=f'shots/lv_{sk}_{part}.png', clip={'x':0,'y':y,'width':1500,'height':hh}, full_page=True); y+=hh; part+=1
            print(sk, n, 'rows', part, 'parts', logs)
        await b.close()
asyncio.run(main())
