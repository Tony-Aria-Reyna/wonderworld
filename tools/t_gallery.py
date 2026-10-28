import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
JS='''(skill)=>{
  document.body.style.overflow='auto'; document.body.style.background='#fff'; const app=document.getElementById('app'); app.style.position='static';
  app.innerHTML=''; const sk=__ww.SKILLS[skill]; const grid=document.createElement('div'); grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px;user-select:text';
  for(let lv=1; lv<=sk.max; lv++){ const it=sk.gen(lv,{}); const all=[it].concat(it.steps||[]);
    all.forEach((x,i)=>{ const card=document.createElement('div'); card.style.cssText='border:2px solid '+(i?'#8B7BEA':'#1B2A4E')+';border-radius:12px;padding:6px;font-size:14px';
      const st=document.createElement('div'); st.className='stage'; st.style.cssText='height:190px;box-shadow:none'; if(x.visual) x.visual(st);
      const t=document.createElement('div'); t.textContent=(i?'  step '+i:'L'+lv)+': '+x.text+'  → '+(x.type==='choice'? 'opt '+x.answer+' of ['+x.options.map(o=>o.label||'pic').join('|')+']' : x.answer)+(i?'':'   // '+it.explain.text);
      card.append(st,t); grid.append(card); });
  }
  app.append(grid); return grid.scrollHeight;
}'''
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1400,900)
        for sk in sys.argv[1:]:
            hgt = await page.evaluate(JS, sk)
            await page.wait_for_timeout(200)
            await page.screenshot(path=f'shots/gal_{sk}.png', full_page=True)
            print(sk, hgt, logs)
        await b.close()
asyncio.run(main())
