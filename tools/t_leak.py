# Does any picture print its own answer? For every skill and level, many questions are generated and each picture
# (the question's and every help step's) is drawn and read. If the answer appears as a number in the picture nearly every
# time, that picture is giving the answer away. Graph axis numbers are exempt: reading the axis is the skill.
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
JS = '''()=>{ const out=[]; const host=document.createElement('div'); host.style.cssText='position:fixed;left:-9999px;top:0;width:600px;height:400px'; document.body.append(host);
  const seen=(fn,ans)=>{ host.innerHTML=''; try{ fn(host); }catch(e){ return 'ERR '+e.message; } const toks=[]; host.querySelectorAll('text:not(.ax)').forEach(t=>toks.push(t.textContent.trim()));
    const w=document.createTreeWalker(host,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(!n.parentNode.closest('svg')) toks.push(n.textContent.trim()); } return toks.includes(String(ans)); };
  const looks=[{}].concat(Object.keys(__ww.COUNTRIES).map(c=>({tag:c,thing:__ww.COUNTRIES[c].thing,boat:__ww.COUNTRIES[c].boat})));
  for(const id in __ww.SKILLS){ const sk=__ww.SKILLS[id]; if(id==='coding') continue;
    for(let lv=1; lv<=sk.max; lv++){ const tally={}; const N=sk.max>1?90:40;
      for(let k=0;k<N;k++){ const it=sk.gen(lv,Object.assign({used:{}},looks[k%looks.length])); const parts=[['question',it]].concat(it.steps.map((s,i)=>['step '+(i+1)+' "'+s.text.replace(/[0-9]+/g,'#')+'"',s]));
        parts.forEach(([name,p])=>{ if(p.type!=='num') return; const key=name.replace(/"[^"]*"/, m=>m); const t=tally[key]||(tally[key]={n:0,hit:0,err:null}); const r=seen(p.visual,p.answer); if(typeof r==='string') t.err=r; else { t.n++; if(r) t.hit++; } }); }
      for(const key in tally){ const t=tally[key]; if(t.err) out.push(id+' L'+lv+' '+key+': '+t.err); else if(t.n>=8 && t.hit/t.n>=0.85) out.push('ANSWER SHOWN IN PICTURE: '+id+' L'+lv+' '+key+' ('+t.hit+' of '+t.n+')'); }
    } }
  host.remove(); return out; }'''
async def main():
    async with async_playwright() as p:
        b,page,logs = await boot(p,1280,800)
        res = await page.evaluate(JS)
        for r in res: print('  ', r)
        print('PROBLEMS', len(res), logs); await b.close(); sys.exit(1 if res else 0)
asyncio.run(main())
