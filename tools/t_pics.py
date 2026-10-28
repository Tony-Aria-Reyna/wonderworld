# Every picture of a levelled skill on one sheet, to look at: for each level the question's picture, its "now you know" picture, each help step's picture,
# and each hands-on tool part-way (still tappable) and finished. Saved to shots/pics_<skill>.png.   python3 tools/t_pics.py <skill> [levels, e.g. 1,2,3]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
JS = '''([skill, lvs])=>{ document.body.innerHTML=''; document.body.style.cssText='overflow:auto;background:#fff;user-select:none;height:auto'; document.documentElement.style.height='auto';
  const sk=__ww.SKILLS[skill], out=[]; const cell=(label, fn)=>{ const box=document.createElement('div'); box.style.cssText='display:inline-block;vertical-align:top;width:440px;margin:6px;border:1px solid #ccd;border-radius:8px;padding:4px;font:600 13px sans-serif;color:#345';
    const cap=document.createElement('div'); cap.textContent=label; const st=document.createElement('div'); st.style.cssText='width:430px;height:250px'; box.append(cap, st); try{ fn(st); }catch(e){ st.textContent='ERROR '+e.message; } return box; };
  for (const lv of lvs) { const it=sk.gen(lv, {}); const row=document.createElement('div'); row.style.cssText='white-space:nowrap;border-bottom:2px solid #99a;margin-bottom:6px';
    row.append(cell('L'+lv+': '+it.text+'  ['+(it.type==='num'?it.answer:it.options.map(o=>o.label).join('/')+' -> '+it.answer)+']', it.visual)); if (it.visualDone) row.append(cell('now you know: '+it.explain.text, it.visualDone));
    (it.steps||[]).forEach((s,i)=>{ row.append(cell('step '+(i+1)+': '+s.text+' ['+s.answer+']', s.visual)); (s.hands||[]).forEach(t=>{ if (t.k!=='pic') return; const lab=(d)=>Array.from({length:d},(_,k)=>k===t.n-1?'?':String(t.fmt?t.fmt((t.on||t.steps)?t.start+(t.steps?t.steps.slice(0,k+1).reduce((a,b)=>a+b,0):t.by*(k+1)):k+1):((t.on||t.steps)?t.start+(t.steps?t.steps.slice(0,k+1).reduce((a,b)=>a+b,0):t.by*(k+1)):k+1)));
        const mid=Math.max(1,Math.min(t.n-1,2)); row.append(cell('tool: '+t.text+' ('+mid+' of '+t.n+')', el=>t.draw(el,{done:mid,n:t.n,live:true,labels:lab(mid)}))); row.append(cell('tool finished', el=>t.draw(el,{done:t.n,n:t.n,live:false,labels:lab(t.n)}))); }); });
    document.body.append(row); } return document.body.scrollWidth+'x'+document.body.scrollHeight; }'''
async def main():
    skill = sys.argv[1]
    async with async_playwright() as p:
        b,page,logs = await boot(p,1400,900)
        mx = await page.evaluate('(s)=>__ww.SKILLS[s].max', skill); lvs = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else list(range(1, mx+1))
        print(await page.evaluate(JS, [skill, lvs]), logs)
        await page.screenshot(path=f'shots/pics_{skill}.png', full_page=True); print(f'shots/pics_{skill}.png')
        await b.close()
asyncio.run(main())
