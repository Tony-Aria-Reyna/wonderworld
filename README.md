# WonderWorld

A free learning game for children of about 6 to 11, made in Aotearoa New Zealand. Travel the world, solve puzzles, do real science, learn Japanese and program a robot.

**Play it:** https://tonyandreynanz-max.github.io/wonderworld/

It runs in any modern web browser on a laptop, tablet or phone. Once it has been opened, it keeps working without the internet.

---

## Welcome guide (for families)

1. **Open the web address** on the device your child will use.
2. **Your child types their name.** The first time the game opens, a short Welcome guide asks for it and explains how the game works. The game calls them by that name from then on.
3. **Tap the flag on the map.** Countries open one at a time, in this order: Egypt, New Zealand, Japan, Australia, Russia, Brazil, France, Greece, Canada, China. Each one has five missions. When every mission is done, the country gets a **trophy** on the map and the next country opens.
4. **Try the Bonus areas.** These are the gold row under the top bar:
   - **Code Lab**: programming a robot. Open from the start.
   - **Japanese (にほんご)**: a train line through the hiragana and katakana, then Kenta's Town for real conversations. It opens when your child reaches Japan.
5. **Spend stars.** Stars buy things for your child's room and explorer.
6. **Grown-ups page.** Tap the gear on the map. The first time, you choose a 4-digit PIN. From there you can:
   - see the level of every skill and change your child's name;
   - use a **test player**, so you can try anything without touching your child's progress;
   - record your own voice for te reo Māori and Japanese words;
   - make a **backup code** to move progress to another device.

Each device keeps its own progress. Children sharing one device share one save, so give each child their own device or browser where you can.

## Put it on a phone or tablet as an app

- **Android (Chrome):** open the web address, tap the ⋮ menu, then **Add to Home screen** or **Install app**.
- **iPhone or iPad (Safari):** open the web address, tap **Share**, then **Add to Home Screen**.
- **Laptop (Chrome or Edge):** click the install icon at the right of the address bar.

## About

**How it teaches.** A wrong answer means the question was too hard. So the game:
- breaks the question into smaller steps;
- gives a hands-on tool on the same picture;
- teaches the idea, then asks a fresh question.

It never shows or lights up the answer. Anything a child gets wrong is practised again until it is right first time. Maths finds each child's level (Levels 1 to 8, roughly New Zealand Curriculum Years 1 to 8), and earlier skills come back for review.

**What is inside.** Each country has:
- maths;
- science labs the child runs themselves;
- the human body;
- the periodic table;
- a few words of the language;
- coding or making.

There is also a race against the clock for quick recall, a room to decorate and an explorer to dress.

**Privacy.**
- No accounts, no adverts and no tracking. Nothing about a child is sent anywhere.
- Progress is saved only in the browser on that device.
- The microphone is used only when the child presses **Record me** to hear their own voice. Nothing is saved or sent.
- Reward videos play from YouTube.

## For developers

```
npm install
node tools/build.mjs            # dist/WonderWorld2.html: one self-contained file, for home use
node tools/build.mjs --public   # docs/: this web address (GitHub Pages serves the docs folder)
node tools/test_skills.mjs      # the fast content test
```

How it is put together, the teaching rules, and every close-up test are in [DEVELOPING.md](DEVELOPING.md). Recordings in `voices/` are for home use and are never published. Only recordings in `voices-public/` go into the web address.

## Credits

The game uses these third-party works:
- Fluent Emoji by Microsoft (MIT)
- Circle Flags by HatScripts (MIT)
- Natural Earth map data via world-atlas (public domain)
- Fredoka and Klee One by Fontworks (SIL Open Font Licence 1.1)
- KanjiVG stroke data by Ulrich Apel (CC BY-SA 3.0)

Details are in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

The game itself is © Tony Ross. All rights reserved unless a licence is added to this repository.
