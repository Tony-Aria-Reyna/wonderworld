# Her home, with real clicks: an old save keeps its things; choosing and designing her explorer; buying clothes and extras;
# things that move and what each room colour does to them (asleep at night, a brimmed hat in the Outback room);
# the parts of the house that open with gold stamps; and the garden. Saves screenshots to shots/home_<size>_*.png.
# Usage: python3 tools/t_room.py [lap|ph|phL|sm|tabP]
import asyncio, sys
sys.path.insert(0,'tools')
from shot import *
SIZES = [(1366,768,'lap'),(412,915,'ph'),(915,412,'phL'),(360,740,'sm'),(800,1280,'tabP')]
async def main():
    want = [a for a in sys.argv[1:]]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        for (w,h,tag) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}')
            b,page,logs = await boot(p,w,h,fast=False)
            # an old save: things in the bedroom, no explorer, no other rooms
            await page.evaluate('''()=>{const S=__ww.S(); S.sound=false; S.stars=900; S.life=900; S.played=3; S.owned={bed:true,cat:true}; S.themes={sun:true,ocean:true}; S.room={theme:"ocean",items:[{id:"bed",x:24,y:86,s:1.9},{id:"cat",x:46,y:90,s:1}]};
              ["egypt","nz","japan","australia","russia"].forEach(c=>["m1","m2","m3","m4","boss"].forEach(m=>S.missions[c+"."+m]={done:true})); __ww.save(); __ww.go("room")}''')
            await page.wait_for_timeout(500)
            check(tag, await page.locator('.ritem:not(.me)').count() == 2, 'an old save keeps the two things she had put out')
            check(tag, await page.locator('.ward .me-card[data-i]').count() == 6, 'the first visit offers six explorers to choose from')
            await page.screenshot(path=f'shots/home_{tag}_1choose.png')
            await page.click('.ward .me-card[data-i="3"]'); await page.wait_for_timeout(250)
            me = lambda: page.evaluate('()=>JSON.parse(JSON.stringify(__ww.S().me))')
            pic = lambda: page.evaluate('()=>document.querySelector(".ward-pic").innerHTML')
            small = []
            async def sizes():
                small.extend(await page.evaluate('()=>[...document.querySelectorAll(".ward .sw, .ward .me-card, .ward .btn")].map(e=>{const r=e.getBoundingClientRect(); return Math.round(Math.min(r.width,r.height))}).filter(x=>x>0&&x<40)'))
            async def change(sel, what):          # every change must show on her at once
                before = await pic(); await page.click(sel); await page.wait_for_timeout(110)
                if await pic() == before: bad.append(f'{tag}: {what} did not change how she looks'); print('  FAIL', what, 'did not change how she looks')
            await change('.ward .me-card[data-hair="curly"]', 'hair style')
            before = await pic(); await page.locator('.ward .sw-row').nth(0).locator('.sw').nth(2).click(); await page.wait_for_timeout(110); skin_ok = await pic() != before
            before = await pic(); await page.locator('.ward .sw-row').nth(1).locator('.sw').nth(4).click(); await page.wait_for_timeout(110); hc_ok = await pic() != before
            m = await me(); check(tag, m['hair'] == 'curly' and m['skin'] == 2 and m['hc'] == 4 and skin_ok and hc_ok, 'Me: hair style, hair colour and skin change her')
            check(tag, await page.locator('.ward .me-card[data-hair]').count() == 12, 'twelve hair styles are offered')
            await sizes(); await page.click('.ward-tabs [data-tab="face"]'); await page.wait_for_timeout(150)
            before = await pic(); await page.locator('.ward .sw-row').nth(0).locator('.sw').nth(2).click(); await page.wait_for_timeout(110); eye_ok = await pic() != before
            await change('.ward .me-card[data-mouth="gap"]', 'mouth'); await change('.ward [data-glasses="square"]', 'square glasses'); await change('.ward [data-glasses="yes"]', 'round glasses')
            for k in ['freck', 'lash', 'aid']: await change(f'.ward [data-flip="{k}"]', k)
            m = await me(); check(tag, eye_ok and m['eye'] == 2 and m['mouth'] == 'gap' and m['glasses'] is True and m['freck'] and m['lash'] and m['aid'], 'Face: eye colour, mouth, glasses, freckles, eyelashes and a hearing aid change her')
            await sizes(); await page.screenshot(path=f'shots/home_{tag}_2face.png')
            await page.click('.ward-tabs [data-tab="body"]'); await page.wait_for_timeout(120); await page.screenshot(path=f'shots/home_{tag}_2me.png')
            await page.click('.ward-tabs [data-tab="clothes"]'); await page.wait_for_timeout(150)
            stars1 = await page.evaluate('()=>__ww.S().stars')
            await change('.ward .me-card[data-top="hoodie"]', 'top'); await change('.ward .me-card[data-bot="trousers"]', 'bottoms'); await change('.ward .me-card[data-shoe="trainers"]', 'shoes')
            rows = page.locator('.ward .sw-row'); oks = []
            for r, n in [(0, 5), (1, 3), (2, 2)]:
                before = await pic(); await rows.nth(r).locator('.sw').nth(n).click(); await page.wait_for_timeout(110); oks.append(await pic() != before)
            m = await me(); check(tag, m['top'] == 'hoodie' and m['bot'] == 'trousers' and m['shoe'] == 'trainers' and m['col'] == 5 and m['bcol'] == 3 and m['scol'] == 2 and all(oks) and await page.evaluate('()=>__ww.S().stars') == stars1,
                  'Clothes: top, bottoms and shoes, each with its own colour, change her and cost nothing')
            await sizes(); await page.screenshot(path=f'shots/home_{tag}_2clothes.png')
            check(tag, not small, f'every wardrobe button is at least 40 px (too small: {small})')
            await page.click('.ward-tabs [data-tab="clothes"]'); await page.wait_for_timeout(150)
            stars0 = await page.evaluate('()=>__ww.S().stars')
            await page.click('.ward .me-card[data-kind="scientist"]'); await page.wait_for_timeout(200)
            await page.screenshot(path=f'shots/home_{tag}_3buy.png')
            await page.click('.overlay:last-child .btn.go'); await page.wait_for_timeout(250)
            check(tag, await page.evaluate('()=>__ww.S().me.kind') == 'scientist' and await page.evaluate('()=>__ww.S().stars') == stars0 - 20, 'scientist clothes cost 20 stars and are put on')
            hidden = await page.locator('.ward .me-card[data-top]').count() == 0
            await page.click('.ward .me-card[data-kind="explorer"]'); await page.wait_for_timeout(150)
            m = await me(); check(tag, hidden and m['kind'] == 'explorer' and m['top'] == 'hoodie' and await page.locator('.ward .me-card[data-top]').count() == 6, 'taking a costume off gives her own clothes back as she left them')
            await page.click('.ward .me-card[data-kind="scientist"]'); await page.wait_for_timeout(150)
            check(tag, await page.evaluate('()=>__ww.S().me.kind') == 'scientist' and await page.evaluate('()=>__ww.S().stars') == stars0 - 20, 'a costume she owns goes back on without paying again')
            await page.click('.ward-tabs [data-tab="extras"]'); await page.wait_for_timeout(150)
            for x in ['x-wizard', 'x-pack', 'x-lens']:
                await page.click(f'.ward .me-card[data-extra="{x}"]'); await page.wait_for_timeout(150); await page.click('.overlay:last-child .btn.go'); await page.wait_for_timeout(200)
            await page.screenshot(path=f'shots/home_{tag}_4extras.png')
            await page.click('.ward .me-card[data-extra="x-wizard"]'); await page.wait_for_timeout(120)     # take the hat off again: the room's hat shows instead
            check(tag, await page.evaluate('()=>!__ww.S().me.wear.head && !!__ww.S().me.extras["x-wizard"]'), 'a bought extra can be taken off and kept')
            await page.click('.ward .shop-top .btn.go'); await page.wait_for_timeout(300)
            check(tag, await page.locator('.ritem.me').count() == 1, 'her explorer stands in the room')
            off = await page.evaluate('()=>[...document.querySelectorAll(".room .topbar .btn, .room .topbar .round, .room .topbar .pill")].filter(e=>{const r=e.getBoundingClientRect(); return r.right>innerWidth+1||r.left<-1}).map(e=>e.textContent.trim())')
            check(tag, not off, f'every button along the top of the room is on the screen (off: {off})')
            # the shop: things that move, and the room colours
            await page.evaluate('()=>__ww.cur.shop()'); await page.wait_for_timeout(250)
            for it in ['teddy-bear','dog','parrot','balloon','soccer-ball','robot','sunflower','tropical-fish','theme-night','theme-outback']:
                await page.evaluate('(i)=>__ww.cur.buy(i)', it); await page.wait_for_timeout(60)
            await page.click('.shop-item[data-id="theme-night"]'); await page.wait_for_timeout(100)
            await page.click('.shop-top .btn.go'); await page.wait_for_timeout(250)
            await page.evaluate('''()=>{const R=__ww.S().room, pos={bed:[20,84,1.9],cat:[40,92,1],"teddy-bear":[27,70,.9],dog:[58,92,1.1],parrot:[82,36,1],balloon:[66,34,1],"soccer-ball":[72,94,.8],robot:[88,88,1.2],sunflower:[10,72,1],"tropical-fish":[50,30,.9]}; R.items.forEach(i=>{const q=pos[i.id]; if(q){i.x=q[0];i.y=q[1];i.s=q[2];}}); const m=__ww.S().me; m.x=48; m.y=88; __ww.save(); __ww.go("room")}''')
            await page.wait_for_timeout(600)
            live = await page.locator('.ritem.live').count(); movers = await page.locator('.ritem.mover').count()
            check(tag, await page.locator('.room.asleep').count() == 1 and await page.locator('.ritem.live .fx-zzz').count() == live and live >= 6, f'Night sky room: the {live} living things are asleep, with z z z')
            check(tag, movers >= 9 and await page.locator('.ritem:not(.mover)').count() == 1, f'{movers} things move; the bed does not')
            check(tag, await page.locator('.ritem .hat').count() == live - 1, 'every living thing wears the room\'s hat (her explorer\'s is drawn on her)')
            await page.screenshot(path=f'shots/home_{tag}_5night.png')
            await page.evaluate('()=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(l.min, l.vw/2, l.vh/2)}'); await page.wait_for_timeout(120)     # the whole room, so every thing can be tapped
            bx = await page.locator('.ritem.mv-rock').first.bounding_box(); await page.mouse.click(bx['x']+bx['width']/2, bx['y']+bx['height']/2); await page.wait_for_timeout(120)
            bg = await page.evaluate('()=>{const e=document.querySelector(".ritem.trick"); return e ? getComputedStyle(e).backgroundColor : "none"}')
            check(tag, await page.locator('.ritem.trick').count() == 1 and bg == 'rgba(0, 0, 0, 0)', f'a tap makes a thing do its trick, with nothing drawn behind it (background {bg})')
            mb = await page.locator('.ritem.me').bounding_box(); await page.mouse.click(mb['x']+mb['width']/2, mb['y']+mb['height']/2); await page.wait_for_timeout(120)
            bg = await page.evaluate('()=>{const e=document.querySelector(".ritem.me"); return [e.classList.contains("trick"), getComputedStyle(e).backgroundColor]}')
            check(tag, bg[0] and bg[1] == 'rgba(0, 0, 0, 0)', f'a tap on her explorer makes her jump, with nothing drawn behind her ({bg})')
            await page.screenshot(path=f'shots/home_{tag}_5tap.png')
            await page.mouse.click(bx['x']+bx['width']/2, bx['y']+bx['height']/2); await page.wait_for_timeout(120)
            check(tag, await page.locator('.room-tools .btn').count() == 4, 'a selected thing can be made bigger, smaller, flipped and put away')
            await page.evaluate('()=>{__ww.S().room.theme="outback"; __ww.save(); __ww.go("room")}'); await page.wait_for_timeout(600)
            check(tag, await page.locator('.room.t-outback').count() == 1 and await page.locator('.room.asleep').count() == 0 and await page.locator('.ritem.live .fx-dust').count() == live, 'Outback room: awake, in brimmed hats, with dust in the air')
            await page.screenshot(path=f'shots/home_{tag}_6outback.png')
            # the house: locked until gold stamps
            await page.evaluate('()=>__ww.cur.house()'); await page.wait_for_timeout(250)
            check(tag, await page.locator('.place.lock').count() == 3 and await page.locator('.place:not(.lock)').count() == 2, 'with no gold stamps: the bedroom and garden are open, three rooms are locked')
            await page.screenshot(path=f'shots/home_{tag}_7house.png')
            await page.click('.place[data-place="play"]'); await page.wait_for_timeout(150)
            check(tag, await page.evaluate('()=>__ww.S().place') == 'bedroom', 'a locked room cannot be entered')
            await page.click('.house .shop-top .btn.go'); await page.wait_for_timeout(150)
            await page.evaluate('()=>{const S=__ww.S(); ["m1","m2","m3"].forEach(m=>S.missions["egypt."+m].gold=true); __ww.save(); __ww.go("room")}'); await page.wait_for_timeout(500)
            check(tag, 'Playroom' in await page.inner_text('.room-hint .txt'), 'three gold stamps: the guide announces the Playroom')
            await page.evaluate('()=>__ww.cur.house()'); await page.wait_for_timeout(200); await page.click('.place[data-place="play"]'); await page.wait_for_timeout(400)
            check(tag, await page.evaluate('()=>__ww.S().place') == 'play' and await page.locator('.ritem.me').count() == 1 and await page.locator('.ritem:not(.me)').count() == 0, 'the Playroom opens, empty, and her explorer comes too')
            await page.screenshot(path=f'shots/home_{tag}_8play.png')
            await page.evaluate('''()=>{const S=__ww.S(); Object.keys(S.missions).slice(0,16).forEach(k=>S.missions[k].gold=true); ["deciduous-tree","playground-slide","rabbit","duck","butterfly","tent","hibiscus","bicycle"].forEach(i=>S.owned[i]=true);
              S.places.garden={theme:"sun",items:[{id:"deciduous-tree",x:86,y:70,s:2.4},{id:"playground-slide",x:62,y:86,s:2},{id:"rabbit",x:40,y:92,s:.9},{id:"duck",x:74,y:94,s:.8},{id:"butterfly",x:52,y:40,s:.7},{id:"tent",x:20,y:92,s:1.8},{id:"hibiscus",x:48,y:78,s:.7},{id:"bicycle",x:90,y:92,s:1.2}]};
              S.places.lab={theme:"ocean",items:[]}; S.places.attic={theme:"night",items:[]}; S.place="garden"; __ww.save(); __ww.go("room")}''')
            await page.wait_for_timeout(600); await page.screenshot(path=f'shots/home_{tag}_9garden.png')
            check(tag, await page.locator('.room.p-garden').count() == 1 and await page.locator('.ritem.mover').count() >= 6, 'the garden shows her outside things, and they move')
            for pl in ['lab', 'attic']:
                await page.evaluate('(pl)=>{__ww.S().place=pl; __ww.save(); __ww.go("room")}', pl); await page.wait_for_timeout(500); await page.screenshot(path=f'shots/home_{tag}_9{pl}.png')
            check(tag, await page.locator('.room.p-attic.asleep').count() == 1, 'each room keeps its own colour (the attic is in Night sky)')
            check(tag, not logs, f'no script errors ({logs})')
            await b.close()
    print('PROBLEMS', len(bad), bad)
    if bad: sys.exit(1)
asyncio.run(main())
