# Katakana (11 October): the longest katakana word, ニュージーランド, in every place it can appear, at five screen sizes: the word cards, the reading card,
# building it from tiles, the race face and its options, and the finished-word card. Checks no letter runs outside its card or off the screen, and nothing is too small to tap.
# python3 tools/t_kata.py [lap|ph|phL|sm|tabP]
import asyncio, sys, json
sys.path.insert(0, 'tools')
from shot import *
SIZES = {'lap': (1280, 800), 'ph': (390, 844), 'phL': (844, 390), 'tabP': (800, 1280), 'sm': (360, 640)}
size = sys.argv[1] if len(sys.argv) > 1 else 'ph'
CHECK = '''()=>{const out=[]; const W=innerWidth,H=innerHeight;
  document.querySelectorAll('.jp-wcard,.jp-card,.jp-opt,.rc-opt,.jp-done-card,.jp-slot,.jp-tile,.jp-let,.rc-card').forEach(c=>{const R=c.getBoundingClientRect(); if(!R.width) return;
    if(R.right>W+1||R.left<-1||R.bottom>H+1) out.push('off screen: '+c.className+' '+[R.left,R.right,R.bottom].map(Math.round));
    c.querySelectorAll('.jp').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width&&(r.left<R.left-1||r.right>R.right+1)) out.push('letters outside the card: '+c.className+' '+e.textContent+' '+Math.round(r.width)+' in '+Math.round(R.width));});
    if(c.matches('.jp-opt,.rc-opt,.jp-tile')&&(R.width<40||R.height<38)) out.push('small: '+c.className+' '+Math.round(R.width)+'x'+Math.round(R.height)); });
  return out;}'''
async def main():
    w, h = SIZES[size]
    async with async_playwright() as p:
        b, page, logs = await boot(p, w, h)
        await page.evaluate('()=>{const m={}; for(let i=1;i<=13;i++) m[i]=1; __ww.S().jp={st:13,placed:true,met:m,wins:13,again:[],stop:{14:2}}}')
        issues = {}
        async def look(tag):
            await page.wait_for_timeout(500)
            for i in await page.evaluate(CHECK): issues[i] = issues.get(i, 0) + 1
            await page.screenshot(path=f'shots/kata_{size}_{tag}.png')
        W = "['ニュージーランド','New Zealand','flag:nz']"
        # the word cards of station 14
        await page.evaluate('()=>__ww.jpTry(ui=>__ww.jp.jpWordCards(ui, __ww.jp.JP_ST[13].words))'); await look('cards')
        await page.evaluate("()=>{const c=[...document.querySelectorAll('.jp-wcard')].find(x=>x.dataset.w=='ニュージーランド'); c&&c.click()}"); await look('cardsel')
        # reading it: a wrong pick breaks it into letters
        await page.evaluate('()=>__ww.jpTry(ui=>__ww.jp.jpReadOne(ui, %s, __ww.jp.jpWords(14)))' % W); await look('read')
        await page.evaluate('()=>__ww.cur.give((__ww.cur.answer+1)%__ww.cur.n)'); await page.wait_for_timeout(400); await look('split')
        await page.evaluate('()=>__ww.cur&&__ww.cur.auto&&__ww.cur.auto()'); await page.wait_for_timeout(900); await page.evaluate('()=>__ww.cur&&__ww.cur.give&&__ww.cur.give(__ww.cur.answer)'); await look('done')
        # building it from tiles
        await page.evaluate('()=>__ww.jpTry(ui=>__ww.jp.jpBuild(ui, %s, 14))' % W); await look('build')
        for i in range(4): await page.evaluate('()=>__ww.cur&&__ww.cur.auto()'); await page.wait_for_timeout(150)
        await look('build4')
        # the race: the deck of station 14, each card it holds with the long word
        r = await page.evaluate('()=>__ww.jp.jpDeck(14).cards.filter(c=>c.w[0]=="ニュージーランド").map(c=>c.kind)')
        print(size, 'race cards with ニュージーランド:', r)
        # My letters: once she has met katakana, a second chart in katakana; a tap writes the letter
        await page.evaluate('()=>{__ww.S().jp.st=15; __ww.go("nihongo")}'); await page.wait_for_timeout(500)
        await page.evaluate('()=>__ww.cur.pick("chart")'); await page.wait_for_timeout(500)
        if not await page.query_selector('.jp-kswap'): issues['no katakana chart button'] = 1
        await page.click('.jp-kswap'); await page.wait_for_timeout(300)
        k = await page.evaluate('()=>({have:[...document.querySelectorAll(".jp-cc.have")].map(b=>b.dataset.k).join(""), all:document.querySelectorAll(".jp-cc").length})')
        print(size, 'katakana chart:', k)
        if not all(c in k['have'] for c in 'アイスリンニラキウケコメロ') or any('\u3041' <= c <= '\u3096' for c in k['have']): issues['katakana chart wrong: ' + json.dumps(k, ensure_ascii=False)] = 1
        await page.click('.jp-cc[data-k="ア"]'); await page.wait_for_timeout(300)
        if not await page.query_selector('.jp-chartbig .jp-glyph'): issues['tapping ア did not write it'] = 1
        await look('chart')
        print(size, 'checked')
        for k, v in issues.items(): print('  ', v, k)
        for l in logs[:20]: print('  LOG', l)
        print('TOTAL', len(issues) + len([l for l in logs if 'PAGEERROR' in l or 'error' in l.lower()]), 'problems')
        await b.close()
asyncio.run(main())
