# The periodic table ladder and the body atlas, from the passport, with real clicks at five sizes.
# The table: "how far can you go?" stops at the first slip and starts her there; the next five are met, said in order, then put in order from shuffled tiles with no numbers;
#   a wrong tile greys out and the clue never names the element; one slip at most moves her on, two leave her where she was; nothing glows; every button is at least 40 px and inside the stage.
#   A child who knows 25 gets the eighteen-column table and the grouping games.
# The atlas: pages open with their missions; every part is named on its page; "Test me" asks her to point; a wrong place is marked and a clue given; found parts are named at the ends of their lines.
# Saves pictures to shots/elem_<size>_*.png.   Usage: python3 tools/t_elem.py [lap|ph|phL|sm|tabP]
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
SIZES = [(1366, 768, 'lap'), (412, 915, 'ph'), (915, 412, 'phL'), (360, 740, 'sm'), (800, 1280, 'tabP')]
FIT = '''(sel)=>{const st=document.querySelector('.stage').getBoundingClientRect(), out=[]; document.querySelectorAll(sel).forEach(e=>{ if(e.offsetParent===null||getComputedStyle(e).visibility==='hidden') return; const r=e.getBoundingClientRect(); if(r.width<1) return;
  const nm=(e.className||'').toString().split(' ').slice(0,2).join('.')+':'+(e.textContent||'').trim().slice(0,12);
  if(Math.min(r.width,r.height)<40) out.push('small '+nm+' '+Math.round(r.width)+'x'+Math.round(r.height));
  if(r.left<st.left-3||r.right>st.right+3||r.top<st.top-3||r.bottom>st.bottom+3){ const sc=e.closest('.el-cards.many'); if(!sc) out.push('outside '+nm+' '+[Math.round(r.left-st.left),Math.round(st.right-r.right),Math.round(r.top-st.top),Math.round(st.bottom-r.bottom)]); } });
  const t=document.querySelector('.el-tab'); if(t && t.offsetParent!==null){     /* on a phone held sideways the grouping game leaves the small table out, to keep the card and bins big */ const r=t.getBoundingClientRect(); if(r.left<st.left-3||r.right>st.right+3||r.top<st.top-3||r.bottom>st.bottom+3) out.push('the table is outside the stage'); if(r.width<120) out.push('the table is only '+Math.round(r.width)+' px wide'); }
  return out}'''
async def main():
    want = sys.argv[1:]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        async def past():   # through the summary, and any row, medal and gift screens, back to the lab-book menu
            for _ in range(200):
                await page.wait_for_timeout(120); c = await page.evaluate('()=>__ww.cur?__ww.cur.type:null')
                if c == 'labmenu': return
                if c == 'btn': await page.evaluate('()=>__ww.cur.auto()')
        for (w, h, tag) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}')
            b, page, logs = await boot(p, w, h, fast=False)
            E = await page.evaluate('()=>null')
            names = await page.evaluate('()=>{__ww.S().sound=false; __ww.save(); return null}')
            el = lambda z: page.evaluate('(z)=>{const t=document.querySelector(".el-tab"); return null}', z)
            S = lambda: page.evaluate('()=>JSON.parse(JSON.stringify(__ww.S().elem||null))')
            bubble = lambda: page.evaluate('()=>document.querySelector(".bubble .txt").textContent')
            fit = lambda sel: page.evaluate(FIT, sel)
            glow = lambda: page.evaluate('()=>document.querySelectorAll(".el-tile.glow,.el-tile.hint,.el-c.glow,.el-opt.glow").length')
            await page.evaluate('()=>__ww.go("passport")'); await page.wait_for_timeout(300)
            check(tag, await page.evaluate('()=>[...document.querySelectorAll(".pp-labs [data-lab]")].map(b=>b.dataset.lab).join(",")') == 'elements,atlas,nihongo,code', 'the passport has "My lab book": the periodic table, the body atlas and Japanese')
            await page.click('.pp-labs [data-lab="elements"]'); await page.wait_for_timeout(500)
            # how far can you go? Seven right, then a slip
            order = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium']
            small = await fit('.el-opt')
            for nm in order[:7]: await page.click(f'.el-opt:text-is("{nm}")'); await page.wait_for_timeout(110)
            shown = await page.evaluate('()=>[...document.querySelectorAll(".el-c.on")].map(c=>c.dataset.z).join(",")')
            await page.screenshot(path=f'shots/elem_{tag}_1place.png')
            wrong = page.locator('.el-opt').filter(has_not_text='Oxygen').first
            await wrong.click(); await page.wait_for_timeout(5600)
            st = await S(); check(tag, st and st['placed'] and st['n'] == 7 and shown == '1,2,3,4,5,6,7', f'"How far can you go?" stops at her first slip and starts her there (7; {st})')
            check(tag, not small, f'the four choices are at least 40 px and inside the stage ({small[:3]})')
            check(tag, 'You know 7' in await bubble() and await page.locator('.lb-b').count() >= 3, 'the menu says how many she knows and offers what to do next')
            small = await fit('.lb-b'); check(tag, not small, f'the menu buttons fit ({small[:3]})'); await page.screenshot(path=f'shots/elem_{tag}_2menu.png')
            # the next five: meet
            await page.click('.lb-b[data-k="next"]'); await page.wait_for_timeout(500)
            cards = await page.evaluate('()=>[...document.querySelectorAll(".el-card")].map(c=>c.dataset.z+" "+c.querySelector(".el-nm").textContent+" | "+(c.querySelector(".el-ex")||{}).textContent)')
            check(tag, [c.split(' ')[0] for c in cards] == ['8', '9', '10', '11', '12'] and all('|' in c and len(c.split('|')[1]) > 3 for c in cards), f'the next five are met, each with where it is found ({cards[0]})')
            small = await fit('.el-card'); check(tag, not small, f'the five tiles fit and are at least 40 px ({small[:3]})')
            for i in range(5): await page.click(f'.el-card >> nth={i}'); await page.wait_for_timeout(80)
            await page.screenshot(path=f'shots/elem_{tag}_3meet.png'); await page.click('.el-go'); await page.wait_for_timeout(450)
            # say and check: in order only
            back = await page.locator('.el-card.back').count(); first = await page.evaluate('()=>document.querySelector(".el-card.now").dataset.z')
            await page.click('.el-card.back >> nth=3'); await page.wait_for_timeout(120)
            check(tag, back == 10 and first == '3' and await page.locator('.el-card.back').count() == 10, 'ten tiles are face down, numbers only, and only the next one in order turns over')
            hidden = await page.evaluate('()=>[...document.querySelectorAll(".el-card.back")].filter(c=>getComputedStyle(c.querySelector(".el-s")).display!=="none"||getComputedStyle(c.querySelector(".el-nm")).display!=="none").length')
            check(tag, hidden == 0, 'a face-down tile shows neither its symbol nor its name')
            small = await fit('.el-card'); check(tag, not small, f'the ten tiles fit and are at least 40 px ({small[:3]})')
            for i in range(10): await page.click('.el-card.now'); await page.wait_for_timeout(70)
            await page.screenshot(path=f'shots/elem_{tag}_4say.png'); await page.click('.el-go'); await page.wait_for_timeout(450)
            # put them in order: no numbers on the tiles; a wrong tile greys and the clue does not name the element
            nums = await page.evaluate('()=>[...document.querySelectorAll(".el-tile")].filter(t=>/[0-9]/.test(t.textContent)).length'); tiles = await page.locator('.el-tile').count()
            small = await fit('.el-tile'); check(tag, tiles == 10 and nums == 0 and not small, f'ten shuffled tiles with no numbers, each at least 40 px ({small[:3]})')
            await page.click('.el-tile[data-z="3"]'); await page.wait_for_timeout(100)
            await page.click('.el-tile[data-z="6"]'); await page.wait_for_timeout(250)        # carbon instead of beryllium
            clue = await bubble(); grey = await page.locator('.el-tile.gone').count()
            check(tag, grey == 1 and clue.startswith('Clue:') and 'eryllium' not in clue and await glow() == 0, f'a wrong tile greys out; the clue does not name the element and nothing glows ("{clue}")')
            await page.screenshot(path=f'shots/elem_{tag}_5order.png')
            for z in range(4, 13): await page.click(f'.el-tile[data-z="{z}"]'); await page.wait_for_timeout(90)
            await past(); st = await S()
            check(tag, st['n'] == 12, f'with one slip she moves on: 12 in order ({st["n"]})')
            # two slips: she stays
            await page.click('.lb-b[data-k="next"]'); await page.wait_for_timeout(450)
            for i in range(5): await page.click(f'.el-card >> nth={i}'); await page.wait_for_timeout(60)
            await page.click('.el-go'); await page.wait_for_timeout(400)
            for i in range(10): await page.click('.el-card.now'); await page.wait_for_timeout(60)
            await page.click('.el-go'); await page.wait_for_timeout(400)
            await page.click('.el-tile[data-z="10"]'); await page.wait_for_timeout(120); await page.click('.el-tile[data-z="12"]'); await page.wait_for_timeout(120)
            for z in range(8, 18): await page.click(f'.el-tile[data-z="{z}"]'); await page.wait_for_timeout(90)
            await past(); st = await S()
            check(tag, st['n'] == 12 and 'You know 12' in await bubble(), 'with two slips the same five come back next time: still 12')
            # a child who knows 25: the wide table, saying them all, and grouping
            await page.evaluate('()=>{const S=__ww.S(); S.elem={n:25,placed:true,g:0}; __ww.save(); __ww.go("labbook","elements")}'); await page.wait_for_timeout(500)
            cols = await page.evaluate('()=>getComputedStyle(document.querySelector(".el-tab")).getPropertyValue("--cols").trim()')
            check(tag, cols == '18' and await page.locator('.el-c.on').count() == 25 and await page.locator('.lb-b[data-k="group"]').count() == 1, 'at 25 the table has all eighteen columns, 25 symbols showing, and "Group them" is offered')
            small = await fit('.lb-b'); check(tag, not small, f'the menu fits with the wide table ({small[:3]})'); await page.screenshot(path=f'shots/elem_{tag}_6menu25.png')
            await page.click('.lb-b[data-k="say"]'); await page.wait_for_timeout(450)
            small = [x for x in await fit('.el-card') if x.startswith('small')]; check(tag, await page.locator('.el-card.back').count() == 25 and not small, f'"Say them all" lays out all 25, each at least 40 px ({small[:3]})')
            await page.screenshot(path=f'shots/elem_{tag}_7sayall.png')
            await page.evaluate('()=>__ww.go("labbook","elements")'); await page.wait_for_timeout(450); await page.click('.lb-b[data-k="group"]'); await page.wait_for_timeout(600)
            check(tag, await page.locator('.sortwrap.el-sort .el-tab').count() == 1 and await page.locator('.bin').count() == 2, 'grouping game 1 (metal or not) shows the table and two bins')
            small = await fit('.bin'); check(tag, not small, f'the bins fit ({small[:3]})'); await page.screenshot(path=f'shots/elem_{tag}_8group.png')
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(5200); st = await S()
            check(tag, st['g'] == 1, f'a clean game moves her to the next grouping game ({st})')
            await page.evaluate('()=>{const S=__ww.S(); S.elem.g=3; __ww.save(); __ww.go("labbook","elements")}'); await page.wait_for_timeout(450); await page.click('.lb-b[data-k="group"]'); await page.wait_for_timeout(9800)
            q = await bubble(); check(tag, q.startswith('Which family is') and await page.locator('.opt').count() == 4 and await page.locator('.el-c.ask').count() == 1, f'grouping game 4 asks for the family, with the element marked in the table ("{q}")')
            small = await page.evaluate('()=>[...document.querySelectorAll(".opt")].map(e=>e.getBoundingClientRect()).filter(r=>Math.min(r.width,r.height)<40||r.left<-2||r.right>innerWidth+2||r.bottom>innerHeight+2).length'); check(tag, not small, f'the four families are at least 40 px and on the screen ({small})'); await page.screenshot(path=f'shots/elem_{tag}_9family.png')
            # ---------- the body atlas ----------
            await page.evaluate('()=>{__ww.go("labbook","atlas")}'); await page.wait_for_timeout(450)
            lock = await page.evaluate('()=>[...document.querySelectorAll(".lb-card")].map(c=>c.dataset.sys+(c.classList.contains("lock")?":locked":":open")).join(",")')
            check(tag, lock and all(x.endswith(':locked') for x in lock.split(',')) and lock.startswith('organs:locked,skeleton:locked'), f'before their missions are played the pages are locked ({lock})')
            await page.evaluate('()=>{const S=__ww.S(); S.missions["egypt.m2"]={done:true}; S.missions["greece.m2"]={done:true}; __ww.save(); __ww.go("labbook","atlas")}'); await page.wait_for_timeout(450)
            small = await fit('.lb-card'); check(tag, await page.locator('.lb-card:not(.lock)').count() == 2 and not small, f'they open with Egypt\'s and Greece\'s body missions ({small[:3]})')
            await page.click('.lb-card[data-sys="skeleton"]'); await page.wait_for_timeout(500)
            labs = await page.evaluate('''()=>{const st=document.querySelector('.stage').getBoundingClientRect(), L=[...document.querySelectorAll('.at-lab')], R=L.map(e=>e.getBoundingClientRect()); let over=0, out=0;
              R.forEach((a,i)=>{ if(a.left<st.left-2||a.right>st.right+2||a.top<st.top-2||a.bottom>st.bottom+2) out++; R.forEach((b,j)=>{ if(j>i&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1) over++; }); }); return {n:L.length, over, out, h:Math.round(Math.min(...R.map(r=>r.height)))}}''')
            check(tag, labs['n'] == 17 and labs['over'] == 0 and labs['out'] == 0, f'the bones page names all 17 bones; no two names overlap and none is cut off ({labs})')
            await page.click('.at-lab[data-for="femur"]'); await page.wait_for_timeout(200); check(tag, 'longest' in await bubble(), 'a tap on a name tells her about that bone')
            await page.screenshot(path=f'shots/elem_{tag}_Apage.png')
            await page.click('.lb-b[data-k="test"]'); await page.wait_for_timeout(500)
            ask = await bubble(); check(tag, ask.startswith('Tap the ') and await page.locator('.at-lab').count() == 0, f'"Test me" asks her to point, with no names showing ("{ask}")')
            await page.evaluate('()=>__ww.cur.miss()'); await page.wait_for_timeout(300)
            clue = await bubble(); check(tag, await page.locator('.at-spot.no').count() == 1 and await page.locator('.at-lab').count() == 0 and clue != ask, f'a wrong place is marked and a clue is given; the right place is not shown ("{clue}")')
            await page.evaluate('()=>__ww.cur.auto()'); await page.wait_for_timeout(300)
            check(tag, await page.locator('.at-lab').count() == 1 and await page.locator('.at-spot.dot').count() == 1, 'the right place gets a dot, and its name at the end of its line')
            await page.screenshot(path=f'shots/elem_{tag}_Bpoint.png')
            await page.evaluate('()=>{const S=__ww.S(); __ww.go("labbook","atlas")}'); await page.wait_for_timeout(400); await page.click('.lb-card[data-sys="organs"]'); await page.wait_for_timeout(500)
            check(tag, await page.locator('.at-spot.filled').count() == 5, 'the organs page (from Egypt) shows its five parts in place')
            await page.screenshot(path=f'shots/elem_{tag}_Corgans.png')
            # the grown-ups page reports both
            await page.evaluate('()=>{const S=__ww.S(); S.pin="1234"; S.atlas={skeleton:{n:2,best:8}}; __ww.save(); __ww.go("parent")}'); await page.wait_for_timeout(300)
            if await page.locator('.pinpad').count():
                for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
                await page.wait_for_timeout(300)
            note = await page.evaluate('()=>{const e=document.querySelector(".elem-note"); return e?e.textContent:""}'); an = await page.evaluate('()=>{const e=document.querySelector(".atlas-note"); return e?e.textContent:""}')
            check(tag, '25 of the 118' in note and 'bones' in an, f'the grown-ups page says where she is with the table and the atlas ("{note[:52]}…")')
            check(tag, not logs, f'no errors on the page ({logs[:2]})')
            await b.close()
    print('\n' + ('ALL OK' if not bad else f'{len(bad)} FAILED:\n  ' + '\n  '.join(bad)))
    sys.exit(1 if bad else 0)
asyncio.run(main())
