# The grown-ups page controls that protect the player's progress: Clear one skill, Reset one country, and the separate test player.
# Also checks that a country's own-language cheer stays in that country, and that the backup code can be copied, pasted and restored with buttons alone.
import asyncio, sys, json
sys.path.insert(0,'tools')
from shot import *
SEED = '''()=>{ const S=__ww.S(); S.stars=120; S.life=200; S.weave=3; S.pixel=2;
  ["egypt.m1","egypt.m2","nz.m1","nz.m2","nz.m3","japan.m1"].forEach(k=>{S.missions[k]={done:true,gold:k==="nz.m1",n:1,t:1}; S.stickers[k]=true});
  S.videos={nz:{quake:1}, egypt:{heart:1}};
  [["fractions",4],["turns",3],["addsub",5],["earth",1],["tereo",1],["arrays",6],["scithink",1]].forEach(x=>{S.skills[x[0]]={lv:x[1],streak:1,placed:true,clean:7,helped:2,review:false}});
  S.log=[{t:Date.now(),s:"fractions",l:4},{t:Date.now(),s:"addsub",l:5}]; __ww.save(); return JSON.stringify(S) }'''
async def pin(page):
    await page.evaluate('()=>__ww.go("parent")'); await page.wait_for_timeout(200)
    if await page.locator('.pinpad').count():
        for d in '1234': await page.click(f'.pinpad .np button:text-is("{d}")')
        await page.wait_for_timeout(300)
async def main():
    bad = 0
    def check(ok, msg):
        nonlocal bad
        print(('  ok   ' if ok else '  WRONG ') + msg); bad += 0 if ok else 1
    async with async_playwright() as p:
        b,page,logs = await boot(p,1366,900)
        await page.evaluate(SEED); await pin(page); await page.screenshot(path='shots/admin_a.png', full_page=False)
        st = lambda: page.evaluate('()=>JSON.parse(JSON.stringify(__ww.S()))')
        # 1 clear one skill
        row = page.locator('.pa-body table').first.locator('tr', has_text='Fractions'); await row.locator('button').click(); s1 = await st()
        check('fractions' in s1['skills'], 'one press on Clear does nothing yet (it asks to press again)')
        await row.locator('button').click(); await page.wait_for_timeout(200); s2 = await st()
        check('fractions' not in s2['skills'] and all(l['s'] != 'fractions' for l in s2['log']), 'Clear removed Fractions and its re-teaching log')
        check(s2['skills']['addsub']['lv'] == 5 and s2['stars'] == 120 and len(s2['missions']) == 6, 'every other skill, the stars and the missions are untouched')
        # 2 reset one country
        row = page.locator('.pa-body table tr', has_text='New Zealand').filter(has_text='missions done'); print('   row says:', (await row.inner_text()).replace('\n',' | '))
        await row.locator('button').click(); await row.locator('button').click(); await page.wait_for_timeout(200); s3 = await st()
        check(not any(k.startswith('nz.') for k in s3['missions']) and not any(k.startswith('nz.') for k in s3['stickers']) and 'nz' not in s3['videos'], 'Reset New Zealand cleared its missions, stickers and videos')
        check(s3['missions'].get('egypt.m1',{}).get('done') and s3['missions'].get('japan.m1',{}).get('done') and 'egypt' in s3['videos'], 'Egypt and Japan are untouched')
        check('turns' not in s3['skills'] and 'earth' not in s3['skills'] and 'tereo' not in s3['skills'] and s3['weave'] == 0, 'the skills only New Zealand teaches, and the weaving, went back to the start')
        check(s3['skills']['addsub']['lv'] == 5 and s3['skills']['arrays']['lv'] == 6 and s3['skills']['scithink']['clean'] == 7 and s3['pixel'] == 2 and s3['stars'] == 120, 'shared skills, Japan pictures and stars are kept')
        aria = await page.evaluate('()=>localStorage.getItem("wonderworld2_v1")')
        # 3 the test player
        await page.click('button:text("Switch to the test player")'); await page.wait_for_timeout(300); t = await st()
        check(await page.evaluate('()=>__ww.who()') == 'test' and await page.evaluate('()=>document.body.classList.contains("testing")'), 'now the test player, and every screen is labelled')
        check(t['stars'] == 300 and not t['missions'] and not t['skills'] and t['pin'] == '1234', 'the test player starts fresh, with stars to spend and the same PIN')
        await page.screenshot(path='shots/admin_b.png')
        await page.evaluate('()=>__ww.go("country","japan")'); await page.wait_for_timeout(300)
        locked = await page.locator('.node.locked:not(.video)').count(); check(locked == 0, f'every Japan mission is open to the test player ({locked} locked)')
        await page.screenshot(path='shots/admin_c.png')
        await page.evaluate('()=>__ww.fast=true'); await page.evaluate('()=>__ww.cur.auto("m4")')
        cheers = set()
        for i in range(400):
            await page.wait_for_timeout(40)
            stt = await page.evaluate('()=>{const c=__ww.cur, scr=document.querySelector(".screen"); return {type:c?c.type:null, country: scr && scr.classList.contains("country"), ov: !!document.querySelector(".overlay"), ch: __ww.cheers}}')
            cheers.update(stt['ch'] or [])
            if stt['country'] and not stt['ov'] and i > 5: break
            if stt['type'] == 'choice': await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            elif stt['type'] == 'num': await page.evaluate('()=>__ww.cur.give(__ww.cur.answer)')
            elif stt['type']: await page.evaluate('()=>__ww.cur.auto()')
        t2 = await st(); check(t2['missions'].get('japan.m4',{}).get('done') is True, 'the test player finished Fold and code without doing missions 1 to 3')
        check(cheers == {'Sugoi!'}, f'in Japan the only own-language cheer is Sugoi ({sorted(cheers)})')
        check(await page.evaluate('()=>localStorage.getItem("wonderworld2_v1")') == aria, "the player's saved progress did not change by one character while the test player played")
        await page.reload(); await page.wait_for_timeout(300)
        check(await page.evaluate('()=>__ww.who()') == 'test' and await page.evaluate('()=>document.body.classList.contains("testing")'), 'after closing and reopening, it is still the test player, still labelled')
        await pin(page); await page.click('button:text("Switch back to")'); await page.wait_for_timeout(300); s4 = await st()
        check(await page.evaluate('()=>__ww.who()') == '' and not await page.evaluate('()=>document.body.classList.contains("testing")'), 'switched back to the player; the label is gone')
        check(json.dumps(s4, sort_keys=True) == json.dumps(json.loads(aria), sort_keys=True), "the player's progress is exactly as it was")
        await page.evaluate('()=>__ww.go("country","japan")'); await page.wait_for_timeout(300)
        check(await page.locator('.node.locked:not(.video)').count() > 0, 'for the player, later missions are still locked until she does the earlier ones')
        # 4 New Zealand keeps Ka pai
        await page.evaluate('()=>{__ww.fast=true; __ww.go("country","nz")}'); await page.wait_for_timeout(200); await page.evaluate('()=>__ww.cur.auto("m1")'); await page.wait_for_timeout(300)
        check(await page.evaluate('()=>__ww.cheers') == ['Ka pai!'], 'in New Zealand the own-language cheer is Ka pai')
        # 5 the backup: one button copies the whole code; Paste and Restore bring it back, with no keyboard needed
        await page.context.grant_permissions(['clipboard-read', 'clipboard-write'])
        await pin(page); before = await st(); code = await page.input_value('.pa-body textarea.bk-code')
        await page.click('[data-b="copy"]'); await page.wait_for_timeout(200); clip = await page.evaluate('()=>navigator.clipboard.readText()')
        check(clip == code and len(code) > 200 and 'Copied' in await page.inner_text('.bk-said'), f'Copy the code puts the whole backup code ({len(code)} letters) on the clipboard, and says so')
        ro = await page.evaluate('()=>{const a=document.querySelector(".pa-body textarea.bk-code"), b=document.querySelector(".pa-body textarea.bk-in"); return [a.readOnly, b.readOnly, b.disabled, getComputedStyle(b).userSelect, parseFloat(getComputedStyle(b).fontSize)]}')
        check(ro[0] is True and ro[1] is False and ro[2] is False and ro[3] != 'none' and ro[4] >= 16, f'the code box is read-only; the box to paste into takes typing, and its letters are 16 px or more so a phone does not zoom ({ro})')
        await page.evaluate('()=>{const S=__ww.S(); S.stars=7; S.missions={}; __ww.save();}'); await pin(page)
        await page.click('.pa-body textarea.bk-in'); focused = await page.evaluate('()=>document.activeElement.classList.contains("bk-in")'); await page.keyboard.type('xyz'); typed = await page.input_value('.pa-body textarea.bk-in')
        check(focused and typed == 'xyz', 'a tap on the paste box puts the cursor in it, and typing goes in')
        await page.click('[data-b="restore"]'); await page.wait_for_timeout(200)
        check('did not work' in await page.inner_text('.bk-said') and (await st())['stars'] == 7, 'a code that is not a backup is refused, and nothing changes')
        await page.click('[data-b="paste"]'); await page.wait_for_timeout(200)
        check(await page.input_value('.pa-body textarea.bk-in') == code and 'Restore' in await page.inner_text('.bk-said'), 'Paste drops the copied code into the box')
        await page.click('[data-b="restore"]'); await page.wait_for_timeout(300); after = await st()
        check(json.dumps(after, sort_keys=True) == json.dumps(before, sort_keys=True), 'Restore brings back the progress exactly as it was when the code was copied')
        await page.screenshot(path='shots/admin_d.png', full_page=False)
        print('errors:', logs, '| PROBLEMS', bad + len(logs)); await b.close(); sys.exit(1 if bad or logs else 0)
asyncio.run(main())
