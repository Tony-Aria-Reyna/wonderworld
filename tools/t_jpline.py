# The Japanese line as a menu (0761-nihongo.js), Tony, 11 October: "i want the stations to be click links. we dont need the green station button. also, the train should be mirrored
# so it appears to be the nose of the train then the carriages behind it. havibg a tail and some sort of link between them". With real clicks: no green button; all fifteen stations (twelve hiragana, three katakana since 11 October) are
# buttons and can be tapped where drawn; her train has its engine first, a coupling before each carriage and a tail; a locked station stays shut; a passed station opens for practice
# with Back; the next station opens; the two-dots rule pairs are buttons that light; and every marked letter is met in its row before the listening check.
# python3 tools/t_jpline.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools'); from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
async def main(size):
    w,h=SIZES[size]; issues=[]
    async with async_playwright() as p:
        b,page,logs=await boot(p,w,h)
        await page.evaluate('()=>{const m={},s={}; for(let i=1;i<=10;i++){m[i]=1;s[i]=5;} __ww.S().jp={st:10,placed:true,met:m,stop:s,wins:10,again:[],streak:2,sday:"x"}; __ww.go("map")}')
        await page.wait_for_timeout(300); await page.click('.jp-pill'); await page.wait_for_timeout(700)
        await page.screenshot(path=f'shots/jph_{size}_home.png')
        info=await page.evaluate('''()=>({btn:!!document.querySelector('.lb-b[data-k="next"]'), stns:document.querySelectorAll('button.jp-stn').length,
           eng:(()=>{const e=document.querySelector('.jp-homebar .jp-engine'), c=document.querySelector('.jp-homebar .jp-car'); if(!e||!c) return null; return e.getBoundingClientRect().right<=c.getBoundingClientRect().left+2})(),
           tail:!!document.querySelector('.jp-homebar .jp-tail'), cpl:document.querySelectorAll('.jp-homebar .jp-cpl').length})''')
        if info['btn']: issues.append('the green station button is still there')
        if info['stns']!=15: issues.append('stations are not all buttons: '+str(info['stns']))
        if not info['eng'] or not info['tail'] or info['cpl']!=11: issues.append('train: engine first, 10 carriages, 11 couplings and a tail: '+json.dumps(info))
        # every station can be tapped where it is drawn
        cov=await page.evaluate('''()=>[...document.querySelectorAll('button.jp-stn')].filter(b=>{const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,e=document.elementFromPoint(x,y);return !e||e.closest('.jp-stn')!==b}).map(b=>b.dataset.n)''')
        if cov: issues.append('stations covered: '+','.join(cov))
        # a locked station stays put
        await page.click('button.jp-stn[data-n="15"]'); await page.wait_for_timeout(400)
        if not await page.query_selector('button.jp-stn'): issues.append('a locked station opened')
        # a passed station opens for practice, with every stop open, and Back
        await page.click('button.jp-stn[data-n="3"]'); await page.wait_for_timeout(500)
        m=await page.evaluate('()=>({stops:document.querySelectorAll(".jp-stop").length, lock:document.querySelectorAll(".jp-stop.lock").length, back:!!document.querySelector(".lb-b[data-k=back]")})')
        if m['stops']!=5 or m['lock'] or not m['back']: issues.append('passed station menu: '+json.dumps(m))
        await page.click('.lb-b[data-k=back]'); await page.wait_for_timeout(500)
        # the next station opens; its rule chart pairs are buttons; the families show
        await page.click('button.jp-stn[data-n="11"]'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("next")')
        for i in range(300):
            await page.wait_for_timeout(50)
            if await page.evaluate('()=>__ww.cur&&__ww.cur.type=="btn"'): break
        await page.screenshot(path=f'shots/jph_{size}_rule.png')
        np=await page.evaluate('()=>document.querySelectorAll("button.jp-pair").length')
        if np!=5: issues.append('rule pairs as buttons: '+str(np))
        await page.click('button.jp-pair >> nth=4'); await page.wait_for_timeout(200)
        if not await page.evaluate('()=>document.querySelectorAll("button.jp-pair")[4].classList.contains("lit")'): issues.append('tapping a pair does not light it')
        await page.evaluate('()=>__ww.cur.auto()')
        fam=0
        for i in range(600):
            await page.wait_for_timeout(50)
            c=await page.evaluate('()=>__ww.cur?Object.keys(__ww.cur).join(","):""')
            if await page.query_selector('.jp-fam'):
                fam+=1; await page.wait_for_timeout(500); await page.screenshot(path=f'shots/jph_{size}_fam{fam}.png')
                n=await page.evaluate('()=>[...document.querySelectorAll(".jp-fcard")].map(b=>b.dataset.k).join("")')
                cards=await page.query_selector_all('.jp-fcard')
                for cd in cards: await cd.click(); await page.wait_for_timeout(60)
                await page.wait_for_timeout(300); await page.click('.jp-go'); await page.wait_for_timeout(300)
                print('  family', fam, n)
                if fam>=2: break
                continue
            if 'auto' in c: await page.evaluate('()=>__ww.cur.auto()')
        if fam<2: issues.append('families not shown')
        print(size, 'TOTAL', len(issues)+len([l for l in logs if 'PAGEERROR' in l]), 'problems'); [print('  ',i) for i in issues]; [print('  LOG',l) for l in logs[:5]]
        await b.close()
asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else 'lap'))
