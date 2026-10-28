# Contact sheets of QA screenshots: python3 tools/sheet.py <tag> [cols] [thumb_width]
import sys, glob, os
from PIL import Image, ImageDraw
tag = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3; tw = int(sys.argv[3]) if len(sys.argv) > 3 else 455
files = sorted(glob.glob(f'shots/qa_{tag}_*.png'))
per = cols * (4 if tw >= 400 else 3)
for s in range(0, len(files), per):
    chunk = files[s:s + per]; ims = [Image.open(f) for f in chunk]
    th = int(ims[0].height * tw / ims[0].width); rows = -(-len(chunk) // cols)
    sheet = Image.new('RGB', (cols * tw, rows * (th + 16)), 'white'); d = ImageDraw.Draw(sheet)
    for i, im in enumerate(ims):
        x, y = (i % cols) * tw, (i // cols) * (th + 16)
        sheet.paste(im.convert('RGB').resize((tw, th)), (x, y + 16)); d.text((x + 4, y + 2), os.path.basename(chunk[i])[3:-4], fill='black')
    sheet.save(f'shots/sheet_{tag}_{s // per:02d}.jpg', quality=82)
print(len(files), 'shots')
