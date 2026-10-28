# Fredoka has no ready-made macron vowels (ā ē ī ō ū), which te reo Māori needs. Browsers then build them badly ("tūi¯").
# This makes a tiny extra font per weight holding just those ten letters, built from Fredoka's own letters and macron.
# Pinyin, for China, also needs the third-tone vowels (ǎ ě ǐ ǒ ǔ). Fredoka's caron mark is only in its latin-ext file, so it is copied across first. They go in the same small font.
# Run once: python3 tools/mkfont.py   (needs fonttools and brotli). Output: gen/fredoka-macron-<weight>.woff2
import sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent
from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
PAIRS = {'ā': 'a', 'ē': 'e', 'ī': 'ı', 'ō': 'o', 'ū': 'u', 'Ā': 'A', 'Ē': 'E', 'Ī': 'I', 'Ō': 'O', 'Ū': 'U'}
CARON = {'ǎ': 'a', 'ě': 'e', 'ǐ': 'ı', 'ǒ': 'o', 'ǔ': 'u'}
for w in (500, 600, 700):
    f = TTFont(f'node_modules/@fontsource/fredoka/files/fredoka-latin-{w}-normal.woff2')
    cmap = f.getBestCmap(); glyf = f['glyf']; hmtx = f['hmtx']
    mark = cmap[0x304]; mg = glyf[mark]; mg.recalcBounds(glyf)
    def top(ch): g = glyf[cmap[ord(ch)]]; g.recalcBounds(glyf); return g.yMax
    lift = top('H') - top('x')
    # the caron, flattened to a plain outline, from the latin-ext file of the same weight
    ext = TTFont(f'node_modules/@fontsource/fredoka/files/fredoka-latin-ext-{w}-normal.woff2'); gs = ext.getGlyphSet(); rp = DecomposingRecordingPen(gs); gs[ext.getBestCmap()[0x2C7]].draw(rp); pen = TTGlyphPen(None); rp.replay(pen)
    f.setGlyphOrder(f.getGlyphOrder() + ['wwcaron']); glyf['wwcaron'] = pen.glyph(); cg = glyf['wwcaron']; cg.recalcBounds(glyf); hmtx['wwcaron'] = (0, cg.xMin)
    for new, base in list(PAIRS.items()) + list(CARON.items()):
        car = new in CARON; mark, mg = ('wwcaron', cg) if car else (cmap[0x304], glyf[cmap[0x304]])
        bn = cmap[ord(base)]; bg = glyf[bn]; bg.recalcBounds(glyf)
        dx = round((bg.xMin + bg.xMax) / 2 - (mg.xMin + mg.xMax) / 2); dy = lift if new.isupper() else 0
        g = Glyph(); g.numberOfContours = -1; g.components = []
        for name, x, y in ((bn, 0, 0), (mark, dx, dy)):
            c = GlyphComponent(); c.glyphName = name; c.x, c.y = x, y; c.flags = 0x0002 | 0x0004; g.components.append(c)
        name = 'uni%04X' % ord(new)
        f.setGlyphOrder(f.getGlyphOrder() + [name]); glyf[name] = g; g.recalcBounds(glyf); hmtx[name] = (hmtx[bn][0], g.xMin)   # the left side bearing must be the glyph's own left edge, or a wide mark (the caron on i) pushes the letter right, into the space after it
        for t in f['cmap'].tables:
            if t.isUnicode(): t.cmap[ord(new)] = name
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = []; opts.name_IDs = [1, 2]; opts.notdef_outline = False
    s = subset.Subsetter(opts); s.populate(unicodes=[ord(c) for c in list(PAIRS) + list(CARON)]); s.subset(f)
    out = f'gen/fredoka-macron-{w}.woff2'; f.flavor = 'woff2'; f.save(out)
    import os; print(out, os.path.getsize(out), 'bytes; macron lift for capitals', lift)
