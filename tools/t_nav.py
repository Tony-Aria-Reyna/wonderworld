# Moving around the world map and her home, with real fingers (touch events) on phones and tablets and a real mouse on the laptop.
# The map: it starts on the next country; no two flags touch at any size; every country has a name; every flag can be brought fully on to the screen;
#   a finger drags it, two fingers pinch it, + and − and the arrows work, a drag that begins on a flag does not open that country, a tap does.
# Her home: the whole room can be seen and every corner reached; a finger on the floor moves the room, a finger on a thing moves the thing;
#   a thing carried to the edge of the screen slides the room along; things keep their place in the room on every device.
# Saves pictures to shots/nav_<size>_*.png.   Usage: python3 tools/t_nav.py [lap|ph|phL|sm|tabP]
import asyncio, sys
sys.path.insert(0, 'tools')
from shot import *
SIZES = [(1366, 768, 'lap', False), (412, 915, 'ph', True), (915, 412, 'phL', True), (360, 740, 'sm', True), (800, 1280, 'tabP', True)]
ST = '()=>{const s=__ww.cur.pz.st; return {w:s.w,x:s.x,y:s.y}}'
# every flag with its name as one box, and whether any two touch
PINS = '''()=>{const out=[]; document.querySelectorAll('.pin').forEach(p=>{const a=p.getBoundingClientRect(), l=p.querySelector('.lbl'), b=l?l.getBoundingClientRect():a;
  out.push({id:p.dataset.id, on:p.classList.contains('on'), l:Math.min(a.left,b.left), r:Math.max(a.right,b.right), t:a.top, b:Math.max(a.bottom,b.bottom), cl:a.left, cr:a.right, cb:a.bottom, ll:b.left, lr:b.right, lt:b.top, lb:b.bottom, w:a.width, name:l?l.textContent:''})}); return out}'''
def touching(P):
    bad = []
    for i in range(len(P)):
        for j in range(i + 1, len(P)):
            a, b = P[i], P[j]
            # circle against circle, circle against the other's name, name against name
            def hit(al, ar, at, ab, bl, br, bt, bb): return min(ar, br) - max(al, bl) > 1.5 and min(ab, bb) - max(at, bt) > 1.5
            if hit(a['cl'], a['cr'], a['t'], a['cb'], b['cl'], b['cr'], b['t'], b['cb']) or hit(a['cl'], a['cr'], a['t'], a['cb'], b['ll'], b['lr'], b['lt'], b['lb']) or \
               hit(a['ll'], a['lr'], a['lt'], a['lb'], b['cl'], b['cr'], b['t'], b['cb']) or hit(a['ll'], a['lr'], a['lt'], a['lb'], b['ll'], b['lr'], b['lt'], b['lb']): bad.append(a['id'] + '+' + b['id'])
    return bad
async def main():
    want = sys.argv[1:]; bad = []
    def check(tag, ok, what):
        print(('  ok   ' if ok else '  FAIL ') + what)
        if not ok: bad.append(tag + ': ' + what)
    async with async_playwright() as p:
        for (w, h, tag, touch) in [s for s in SIZES if not want or s[2] in want]:
            print(tag, f'{w}x{h}', 'fingers' if touch else 'mouse')
            b, page, logs = await boot(p, w, h, fast=False, touch=touch)
            cdp = await page.context.new_cdp_session(page)
            async def fingers(kind, pts): await cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [{'x': x, 'y': y, 'id': i} for i, (x, y) in enumerate(pts)]})
            async def drag(x0, y0, x1, y1, steps=10, hold=0):
                if touch:
                    await fingers('touchStart', [(x0, y0)])
                    for i in range(1, steps + 1): await fingers('touchMove', [(x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps)]); await page.wait_for_timeout(16)
                    if hold: await page.wait_for_timeout(hold)
                    await fingers('touchEnd', [])
                else:
                    await page.mouse.move(x0, y0); await page.mouse.down(); await page.mouse.move(x1, y1, steps=steps)
                    if hold: await page.wait_for_timeout(hold)
                    await page.mouse.up()
                await page.wait_for_timeout(120)
            async def pinch(cx, cy, d0, d1, steps=8):
                await fingers('touchStart', [(cx - d0 / 2, cy), (cx + d0 / 2, cy)])
                for i in range(1, steps + 1): d = d0 + (d1 - d0) * i / steps; await fingers('touchMove', [(cx - d / 2, cy), (cx + d / 2, cy)]); await page.wait_for_timeout(16)
                await fingers('touchEnd', []); await page.wait_for_timeout(120)
            st = lambda: page.evaluate(ST)
            await page.evaluate('''()=>{const S=__ww.S(); S.sound=false; S.stars=900; S.life=900; S.played=3; S.owned={bed:true,cat:true,books:true,telescope:true,rocket:true,robot:true,dog:true};
              S.room={theme:"sun",items:[{id:"bed",x:8,y:86,s:1.9},{id:"cat",x:46,y:90,s:1},{id:"books",x:78,y:36,s:1.3},{id:"telescope",x:92,y:88,s:1.5},{id:"rocket",x:30,y:80,s:1.2},{id:"robot",x:64,y:84,s:1.2}]};
              S.me=__ww.home.newMe(__ww.home.PRESETS[0]); __ww.save(); __ww.go("map")}''')
            await page.wait_for_timeout(600)
            # ---------- the world map ----------
            clear = await page.evaluate('()=>{const l=__ww.cur.pz.lim(); return {top:l.pad[1], bot:l.vh-l.pad[3], vw:l.vw, min:l.min, max:l.max, start:l.start}}')
            P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]
            check(tag, egypt['l'] >= 0 and egypt['r'] <= w and egypt['t'] >= clear['top'] - 1 and egypt['b'] <= clear['bot'] + 1, 'the map starts with the next country (Egypt) fully in view, clear of the bars')
            nw = await page.evaluate('()=>__ww.WORLD ? __ww.WORLD.length : 14')
            check(tag, len(P) == nw and all(q['name'] for q in P), f'all {nw} countries on the map have a flag and a name ({len(P)})')
            check(tag, not touching(P), f'no two flags or names touch at the start ({touching(P)})')
            check(tag, min(q['w'] for q in P if q['on']) >= 40, 'flags of open countries are at least 40 px')
            await page.screenshot(path=f'shots/nav_{tag}_map1.png')
            # at every size from smallest to biggest
            worst = []
            for k in range(0, 13):
                await page.evaluate('(k)=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(l.min*Math.pow(l.max/l.min,k/12), l.vw/2, l.vh/2)}', k)
                t = touching(await page.evaluate(PINS))
                if t: worst.append((k, t))
            check(tag, not worst, f'no two flags or names touch at any of 13 sizes from smallest to biggest ({worst[:3]})')
            # every flag can be brought fully on to the screen, at the smallest, the starting and the biggest size
            cut = []
            for size in ['min', 'start', 'max']:
                for q in P:
                    r = await page.evaluate('''([id,size])=>{const z=__ww.cur.pz, l=z.lim(); const p=document.querySelector('.pin[data-id="'+id+'"]');
                      const s0=z.st; if(Math.abs(s0.w-l[size])>1) z.zoomTo(l[size], l.vw/2, l.vh/2);
                      const a=p.getBoundingClientRect(), v=document.querySelector('.pz-view').getBoundingClientRect(); z.nudge(v.left+l.vw/2-(a.left+a.right)/2, (l.pad[1]+l.vh-l.pad[3])/2-(a.top+a.bottom)/2);
                      const c=p.getBoundingClientRect(), n=p.querySelector('.lbl').getBoundingClientRect(); return {l:Math.min(c.left,n.left), r:Math.max(c.right,n.right), t:c.top, b:n.bottom, top:l.pad[1], bot:l.vh-l.pad[3], vw:l.vw}}''', [q['id'], size])
                    if r['l'] < -1 or r['r'] > r['vw'] + 1 or r['t'] < r['top'] - 1 or r['b'] > r['bot'] + 1: cut.append((size, q['id'], round(r['l']), round(r['r']), round(r['t']), round(r['b'])))
            check(tag, not cut, f'every flag and its name can be brought fully on to the screen at the smallest, starting and biggest size ({cut[:4]})')
            await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.wait_for_timeout(100)
            # a finger (or the mouse) drags the map; a drag that begins on a flag does not open that country
            P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]; ex, ey = (egypt['cl'] + egypt['cr']) / 2, (egypt['t'] + egypt['cb']) / 2
            if not touch:      # on the laptop the whole world fits at the start: zoom in first, then drag
                await page.mouse.move(ex, ey); await page.mouse.wheel(0, -500); await page.wait_for_timeout(200)
                P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]; ex, ey = (egypt['cl'] + egypt['cr']) / 2, (egypt['t'] + egypt['cb']) / 2
            s0 = await st(); dx = -min(120, w * .25); dy = -40; await drag(ex, ey, ex + dx, ey + dy); s1 = await st()
            still_map = await page.evaluate('()=>__ww.cur.type') == 'map'
            R = await page.evaluate('()=>{const r=__ww.cur.pz.ranges(); return {x:r.x[1]-r.x[0]>150, y:r.y[1]-r.y[0]>60}}')   # which ways there is more map than screen
            check(tag, still_map, 'a drag that begins on a flag does not open that country')
            check(tag, R['x'] or R['y'], 'there is more map than fits on the screen, so it can be moved')
            check(tag, (not R['x'] or abs((s1['x'] - s0['x']) - dx) < 12) and (not R['y'] or abs((s1['y'] - s0['y']) - dy) < 12), f'dragging moves the map with the finger (asked {round(dx)},{dy}; moved {round(s1["x"] - s0["x"])},{round(s1["y"] - s0["y"])}; free across {R["x"]}, up and down {R["y"]})')
            if touch:
                s0 = await st(); cx, cy = w / 2, (clear['top'] + clear['bot']) / 2
                before = await page.evaluate('([x,y])=>{const s=__ww.cur.pz.st, v=document.querySelector(".pz-view").getBoundingClientRect(); return [(x-v.left-s.x)/s.w,(y-v.top-s.y)/(s.w*.52)]}', [cx, cy])
                await pinch(cx, cy, 80, 200); s1 = await st()
                after = await page.evaluate('([x,y])=>{const s=__ww.cur.pz.st, v=document.querySelector(".pz-view").getBoundingClientRect(); return [(x-v.left-s.x)/s.w,(y-v.top-s.y)/(s.w*.52)]}', [cx, cy])
                grew = s1['w'] / s0['w']
                check(tag, grew > 1.5 or abs(s1['w'] - clear['max']) < 2, f'two fingers moving apart make the map bigger ({grew:.2f} times)')
                check(tag, abs(after[0] - before[0]) * s1['w'] < 14, 'the place between the two fingers stays under them')
                await pinch(cx, cy, 220, 70); s2 = await st()
                check(tag, s2['w'] < s1['w'] * .6 or abs(s2['w'] - clear['min']) < 2, 'two fingers moving together make it smaller')
                check(tag, await page.evaluate('()=>__ww.cur.type') == 'map', 'pinching does not open a country')
            else:
                await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.wait_for_timeout(100)
                s0 = await st(); await page.mouse.move(w / 2, h / 2); await page.mouse.wheel(0, -400); await page.wait_for_timeout(150); s1 = await st()
                check(tag, s1['w'] > s0['w'] * 1.1, 'the mouse wheel zooms in')
                await page.mouse.wheel(0, 2000); await page.wait_for_timeout(150)
            # the buttons
            await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.wait_for_timeout(100); s0 = await st()
            await page.click('.pz-ctl .pz-b >> nth=0'); await page.wait_for_timeout(450); s1 = await st()
            check(tag, s1['w'] > s0['w'] * 1.3, 'the + button makes the map bigger')
            await page.screenshot(path=f'shots/nav_{tag}_map2in.png')
            for i in range(8):
                if await page.evaluate('()=>document.querySelector(".pz-ctl .pz-b:nth-child(2)").classList.contains("off")'): break
                await page.click('.pz-ctl .pz-b >> nth=1'); await page.wait_for_timeout(420)
            s2 = await st(); check(tag, abs(s2['w'] - clear['min']) < 2, 'the − button makes it smaller, down to the smallest size, and then greys out')
            await page.screenshot(path=f'shots/nav_{tag}_map3out.png')
            await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.wait_for_timeout(100)
            R = await page.evaluate('()=>__ww.cur.pz.more()')
            if R:
                which = await page.evaluate('()=>{const e=document.querySelector(".pz-go.on"); return e?[...e.classList].find(c=>"lrud".includes(c)&&c.length===1):null}')
                check(tag, which is not None, 'an arrow shows where there is more map to see')
                if which:
                    s0 = await st(); await page.click('.pz-go.' + which, force=True); await page.wait_for_timeout(450); s1 = await st()
                    check(tag, abs(s1['x'] - s0['x']) + abs(s1['y'] - s0['y']) > 30, f'tapping the arrow moves the map ({which})')
            # nothing sits on top of anything else
            over = await page.evaluate('''()=>{const R=e=>e.getBoundingClientRect(), hit=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1, out=[];
              const ctl=[...document.querySelectorAll('.pz-b, .pz-go.on')], bars=[...document.querySelectorAll('.hud > *:not(.sp), .map-foot .kiwi, .map-foot .bubble')];
              ctl.forEach(c=>{const r=R(c); if(Math.min(r.width,r.height)<40) out.push('small '+c.className+' '+Math.round(r.width)); if(r.left<0||r.right>innerWidth||r.top<0||r.bottom>innerHeight) out.push('off '+c.className);
                bars.forEach(b=>{ if(hit(r,R(b))) out.push(c.className+' on '+b.className) }); ctl.forEach(d=>{ if(d!==c&&hit(r,R(d))) out.push(c.className+' on '+d.className) }) }); return out}''')
            check(tag, not over, f'the zoom buttons and arrows are at least 40 px, on screen, and clear of the bars and of each other ({over[:3]})')
            # the screen turns
            await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.set_viewport_size({'width': h, 'height': w}); await page.wait_for_timeout(400)
            P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]
            check(tag, egypt['l'] >= 0 and egypt['r'] <= h and egypt['t'] >= 0 and egypt['b'] <= w and not touching(P), 'when the screen turns, the same country stays in view and no flags touch')
            await page.screenshot(path=f'shots/nav_{tag}_map4turned.png')
            await page.set_viewport_size({'width': w, 'height': h}); await page.wait_for_timeout(400)
            # a tap on a flag opens the country
            await page.evaluate('()=>__ww.cur.pz.reset(582/1000,211/520)'); await page.wait_for_timeout(500)
            P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]; ex, ey = (egypt['cl'] + egypt['cr']) / 2, (egypt['t'] + egypt['cb']) / 2
            if touch: await page.touchscreen.tap(ex, ey)
            else: await page.mouse.click(ex, ey)
            await page.wait_for_timeout(350)
            check(tag, await page.evaluate('()=>__ww.cur.type') == 'country', 'a tap on a flag opens that country')

            # ---------- her home ----------
            await page.evaluate('()=>__ww.go("room")'); await page.wait_for_timeout(600)
            V = await page.evaluate('()=>{const z=__ww.cur.pz, l=z.lim(); return {vw:l.vw, vh:l.vh, min:l.min, max:l.max, start:l.start, more:z.more()}}')
            RECTS = '''()=>{const v=document.querySelector('.pz-view').getBoundingClientRect(), s=document.querySelector('.room-stage').getBoundingClientRect();
              return {stage:{l:s.left,r:s.right,t:s.top,b:s.bottom,w:s.width,h:s.height}, items:[...document.querySelectorAll('.ritem')].map(e=>{const r=e.getBoundingClientRect(); return {id:e._it&&e._it.id||'me', me:e.classList.contains('me'), l:r.left,r:r.right,t:r.top,b:r.bottom, x:e._it.x, y:e._it.y}})}}'''
            A = await page.evaluate(RECTS); me = [i for i in A['items'] if i['me']][0]
            check(tag, me['l'] >= 0 and me['r'] <= w and me['t'] >= 0 and me['b'] <= h, 'her home opens with her explorer in view')
            check(tag, abs(A['stage']['h'] / A['stage']['w'] - .6) < .002, 'the room keeps its shape (5 wide, 3 high) on this screen')
            await page.screenshot(path=f'shots/nav_{tag}_room1.png')
            # things keep their place in the room: each sits at its own x% and y% of the room, whatever the screen
            off = [i['id'] for i in A['items'] if abs(((i['l'] + i['r']) / 2 - A['stage']['l']) / A['stage']['w'] * 100 - i['x']) > 1.2]
            check(tag, not off, f'each thing sits at its own place in the room, not on the screen ({off})')
            # the whole room at once
            await page.evaluate('()=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(l.min, l.vw/2, l.vh/2)}'); await page.wait_for_timeout(100)
            A = await page.evaluate(RECTS); out = [i['id'] for i in A['items'] if i['l'] < -1 or i['r'] > w + 1 or i['t'] < -1 or i['b'] > h + 1]
            check(tag, A['stage']['l'] >= -1 and A['stage']['r'] <= w + 1 and A['stage']['t'] >= -1 and A['stage']['b'] <= h + 1 and not out, f'at its smallest the whole room and everything in it is on the screen at once ({out})')
            await page.screenshot(path=f'shots/nav_{tag}_room2whole.png')
            # every corner can be reached at the starting size and the biggest
            for size in ['start', 'max']:
                reach = []
                for fx in [0, 1]:
                    for fy in [0, 1]:
                        r = await page.evaluate('''([size,fx,fy])=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(l[size], l.vw/2, l.vh/2); z.nudge(fx?-99999:99999, fy?-99999:99999); const s=document.querySelector('.room-stage').getBoundingClientRect();
                          return {x: fx? s.right : s.left, y: fy? s.bottom : s.top}}''', [size, fx, fy])
                        if not (-1 <= r['x'] <= w + 1 and -1 <= r['y'] <= h + 1): reach.append((fx, fy, round(r['x']), round(r['y'])))
                check(tag, not reach, f'all four corners of the room can be brought on to the screen at the {size} size ({reach})')
            await page.evaluate('()=>__ww.cur.pz.reset(.5,.5)'); await page.wait_for_timeout(100)
            # a finger on the floor moves the room and leaves the things where they are
            V = await page.evaluate('()=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(Math.min(l.max, Math.max(l.start, l.min*1.6)), l.vw/2, l.vh/2); return {more:z.more()}}')
            items0 = await page.evaluate('()=>JSON.stringify(__ww.S().room.items)')
            free = await page.evaluate('''()=>{const hit=(x,y)=>{const e=document.elementFromPoint(x,y); return e && !e.closest('.ritem') && e.closest('.pz-view')}; for(let y=innerHeight*.3;y<innerHeight*.8;y+=20) for(let x=innerWidth*.35;x<innerWidth*.7;x+=20) if(hit(x,y)&&hit(x-70,y)) return [x,y]; return null}''')
            s0 = await st(); await drag(free[0], free[1], free[0] - 70, free[1]); s1 = await st()
            check(tag, abs((s1['x'] - s0['x']) + 70) < 10, f'a finger on the wall or floor slides the room (asked -70, moved {round(s1["x"] - s0["x"])})')
            check(tag, await page.evaluate('()=>JSON.stringify(__ww.S().room.items)') == items0, 'sliding the room leaves every thing where it was')
            # a finger on a thing moves the thing, not the room
            await page.evaluate('()=>__ww.cur.pz.reset(.64,.5)'); await page.wait_for_timeout(100)
            cat = await page.evaluate('''()=>{const e=[...document.querySelectorAll('.ritem')].find(e=>e._it.id==='robot'), r=e.getBoundingClientRect(); return {x:(r.left+r.right)/2,y:(r.top+r.bottom)/2,ix:e._it.x,iy:e._it.y}}''')
            s0 = await st(); await drag(cat['x'], cat['y'], cat['x'] + 40, cat['y'] - 30); s1 = await st()
            cat2 = await page.evaluate('''()=>{const e=[...document.querySelectorAll('.ritem')].find(e=>e._it.id==='robot'); return {ix:e._it.x,iy:e._it.y}}''')
            check(tag, abs(s1['x'] - s0['x']) < .5 and cat2['ix'] > cat['ix'] + 1 and cat2['iy'] < cat['iy'] - 1, 'a finger on a thing moves the thing and the room stays still')
            # carried to the edge, the room slides along
            if V['more'] and (await page.evaluate('()=>{const z=__ww.cur.pz,l=z.lim(); return z.st.w>l.vw+40}')):
                await page.evaluate('()=>__ww.cur.pz.nudge(99999,0)'); await page.wait_for_timeout(80)   # look at the left end
                bed = await page.evaluate('''()=>{const e=[...document.querySelectorAll('.ritem')].find(e=>e._it.id==='bed'), r=e.getBoundingClientRect(); return {x:(r.left+r.right)/2,y:(r.top+r.bottom)/2,ix:e._it.x}}''')
                s0 = await st(); await drag(bed['x'], bed['y'], w - 14, bed['y'], steps=12, hold=2600); s1 = await st()
                bed2 = await page.evaluate('''()=>{const e=[...document.querySelectorAll('.ritem')].find(e=>e._it.id==='bed'), r=e.getBoundingClientRect(); return {ix:e._it.x, r:r.right, l:r.left}}''')
                far = (w / s1['w']) * 100
                check(tag, s1['x'] < s0['x'] - 40 and bed2['ix'] > bed['ix'] + far * .8, f'a thing carried to the edge slides the room along, so it can cross the whole room (bed went from {round(bed["ix"])}% to {round(bed2["ix"])}%)')
                await page.screenshot(path=f'shots/nav_{tag}_room3carried.png')
            if touch:
                await page.evaluate('()=>__ww.cur.pz.reset(.5,.5)'); await page.wait_for_timeout(100)
                s0 = await st(); await pinch(free[0] - 30, free[1], 60, 170); s1 = await st()
                check(tag, s1['w'] > s0['w'] * 1.3 or abs(s1['w'] - (await page.evaluate('()=>__ww.cur.pz.lim().max'))) < 2, f'two fingers pinch the room bigger ({s1["w"] / s0["w"]:.2f} times)')
            # what she takes out of her box, and what she buys, lands in the part of the room she is looking at
            await page.evaluate('()=>{const z=__ww.cur.pz,l=z.lim(); z.zoomTo(l.start,l.vw/2,l.vh/2); z.nudge(-99999,0)}'); await page.wait_for_timeout(100)
            await page.click('.room-tray .chip'); await page.wait_for_timeout(250)
            A = await page.evaluate(RECTS); dog = [i for i in A['items'] if i['id'] == 'dog']
            check(tag, len(dog) == 1 and dog[0]['l'] >= -1 and dog[0]['r'] <= w + 1, 'a thing taken out of the box lands in the part of the room she is looking at')
            await page.evaluate('()=>__ww.cur.shop()'); await page.wait_for_timeout(250); await page.evaluate('()=>__ww.cur.buy("guitar")'); await page.wait_for_timeout(150); await page.click('.shop-top .btn.go'); await page.wait_for_timeout(300)
            A = await page.evaluate(RECTS); g = [i for i in A['items'] if i['id'] == 'guitar']
            check(tag, len(g) == 1 and (g[0]['l'] + g[0]['r']) / 2 >= 0 and (g[0]['l'] + g[0]['r']) / 2 <= w, 'a thing bought in the shop lands in the part of the room she is looking at')
            # buttons and arrows
            await page.evaluate('()=>__ww.cur.pz.reset(.5,.5)'); await page.wait_for_timeout(100); s0 = await st()
            await page.click('.pz-ctl .pz-b >> nth=0'); await page.wait_for_timeout(450); s1 = await st()
            check(tag, s1['w'] > s0['w'] * 1.2 or abs(s1['w'] - (await page.evaluate('()=>__ww.cur.pz.lim().max'))) < 2, 'the + button makes the room bigger')
            which = await page.evaluate('()=>{const e=document.querySelector(".pz-go.on"); return e?[...e.classList].find(c=>"lrud".includes(c)&&c.length===1):null}')
            if which:
                s0 = await st(); await page.click('.pz-go.' + which, force=True); await page.wait_for_timeout(450); s1 = await st()
                check(tag, abs(s1['x'] - s0['x']) + abs(s1['y'] - s0['y']) > 30, f'an arrow shows where there is more room to see, and tapping it moves there ({which})')
            # with a thing chosen (its buttons showing) nothing sits on anything else
            await page.evaluate('()=>__ww.cur.pz.reset(.64,.5)'); await page.wait_for_timeout(100)
            cat = await page.evaluate('''()=>{const e=[...document.querySelectorAll('.ritem')].find(e=>e._it.id==='robot'), r=e.getBoundingClientRect(); return {x:(r.left+r.right)/2,y:(r.top+r.bottom)/2}}''')
            if touch: await page.touchscreen.tap(cat['x'], cat['y'])
            else: await page.mouse.click(cat['x'], cat['y'])
            await page.wait_for_timeout(300)
            check(tag, await page.locator('.room-tools .btn').count() == 4, 'a tap on a thing chooses it and shows its four buttons')
            over = await page.evaluate('''()=>{const R=e=>e.getBoundingClientRect(), hit=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1, out=[];
              const ctl=[...document.querySelectorAll('.pz-b, .pz-go.on')], bars=[...document.querySelectorAll('.room .topbar > *, .room-tools .btn, .room-tray, .room-hint:not(.gone) .bubble')];
              ctl.forEach(c=>{const r=R(c); if(Math.min(r.width,r.height)<40) out.push('small '+c.className+' '+Math.round(r.width)); if(r.left<0||r.right>innerWidth||r.top<0||r.bottom>innerHeight) out.push('off '+c.className);
                bars.forEach(b=>{ if(hit(r,R(b))) out.push(c.className+' on '+b.className) }); ctl.forEach(d=>{ if(d!==c&&hit(r,R(d))) out.push(c.className+' on '+d.className) }) }); return out}''')
            check(tag, not over, f'the zoom buttons and arrows are at least 40 px, on screen, and clear of the bars, the box and each other ({over[:3]})')
            await page.screenshot(path=f'shots/nav_{tag}_room4chosen.png')
            # every part of the house, whole and close up
            await page.evaluate('()=>{const S=__ww.S(); S.open={play:true,lab:true,attic:true}; S.places={garden:{theme:"sun",items:[{id:"dog",x:8,y:90,s:1.2}]},attic:{theme:"night",items:[]},play:{theme:"ocean",items:[]},lab:{theme:"jungle",items:[]}}; __ww.save()}')
            for place in ['garden', 'play', 'lab', 'attic']:
                await page.evaluate('()=>__ww.cur.house()'); await page.wait_for_timeout(200); await page.click(f'.place[data-place="{place}"]'); await page.wait_for_timeout(350)
                await page.evaluate('()=>{const z=__ww.cur.pz, l=z.lim(); z.zoomTo(l.min, l.vw/2, l.vh/2)}'); await page.wait_for_timeout(120)
                await page.screenshot(path=f'shots/nav_{tag}_place_{place}.png')
            # the guide says how to move the map when it is bigger than the screen, and the first country is still fully in view under the taller bubble
            await page.evaluate('()=>{const S=__ww.S(); S.stars=5; Object.keys(__ww.COUNTRIES).forEach(c=>S.missions[c+".m1"]={done:true}); __ww.save(); __ww.go("map")}'); await page.wait_for_timeout(500)
            txt = await page.evaluate('()=>document.querySelector(".map-foot .bubble .txt").textContent'); more = await page.evaluate('()=>__ww.cur.pz.more()')
            P = await page.evaluate(PINS); egypt = [q for q in P if q['id'] == 'egypt'][0]; L = await page.evaluate('()=>{const l=__ww.cur.pz.lim(); return {top:l.pad[1], bot:l.vh-l.pad[3]}}')
            check(tag, ('Slide the map' in txt) == more and len(txt.split()) <= 12, f'the guide says how to move the map only when there is more to see ("{txt}")')
            check(tag, egypt['l'] >= 0 and egypt['r'] <= w and egypt['t'] >= L['top'] - 1 and egypt['b'] <= L['bot'] + 1, 'the next country is fully in view above the guide')
            await page.screenshot(path=f'shots/nav_{tag}_map5guide.png')
            # her home when the screen turns
            await page.evaluate('()=>__ww.go("room")'); await page.wait_for_timeout(500); await page.set_viewport_size({'width': h, 'height': w}); await page.wait_for_timeout(400)
            A = await page.evaluate(RECTS); me = [i for i in A['items'] if i['me']][0]
            check(tag, me['l'] >= 0 and me['r'] <= h and me['t'] >= 0 and me['b'] <= w and abs(A['stage']['h'] / A['stage']['w'] - .6) < .002, 'when the screen turns, the room keeps its shape and her explorer stays in view')
            await page.screenshot(path=f'shots/nav_{tag}_room5turned.png'); await page.set_viewport_size({'width': w, 'height': h})
            check(tag, not logs, f'no errors on the page ({logs[:2]})')
            await b.close()
    print('\n' + ('ALL OK' if not bad else f'{len(bad)} FAILED:\n  ' + '\n  '.join(bad)))
asyncio.run(main())
