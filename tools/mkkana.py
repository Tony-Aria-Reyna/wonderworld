# Builds gen/kana.json: the stroke paths of every hiragana and katakana, in stroke order, from KanjiVG (kanjivg.tagaini.net, by Ulrich Apel, CC BY-SA 3.0).
# Usage: python3 tools/mkkana.py <folder of KanjiVG files 03041.svg ... 03094.svg and 030a1.svg ... 030fa.svg, 030fc.svg>
# Get them from https://github.com/KanjiVG/kanjivg (the "kanji" folder). Each path is drawn in a 109 x 109 box.
import sys, os, re, json
src = sys.argv[1]; out = {}
for c in list(range(0x3041, 0x3095)) + list(range(0x30a1, 0x30fb)) + [0x30fc]:   # hiragana; katakana and the long line (11 October)
    f = os.path.join(src, '%05x.svg' % c)
    if not os.path.exists(f): continue
    t = open(f, encoding='utf8').read()
    paths = re.findall(r'<path id="kvg:%05x-s(\d+)"[^>]*\sd="([^"]+)"' % c, t)
    if not paths: continue
    paths.sort(key=lambda p: int(p[0]))
    out[chr(c)] = [re.sub(r'\s+', ' ', d.strip()) for _, d in paths]
json.dump(out, open('gen/kana.json', 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'kana,', sum(len(v) for v in out.values()), 'strokes,', os.path.getsize('gen/kana.json'), 'bytes')
