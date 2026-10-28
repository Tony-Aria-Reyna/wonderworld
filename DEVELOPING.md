# WonderWorld 2 — source

`dist/WonderWorld2.html` (the home build) and `docs/` (the web address) are built from these files. Do not edit the built file by hand; change the source and rebuild.

## Rebuild

```
npm install          # once: icons, fonts, map data
node tools/genmap.mjs   # once: writes gen/map.json (already included)
node tools/build.mjs    # writes dist/WonderWorld2.html and dist/Play WonderWorld.cmd
node tools/build.mjs --public   # writes docs/: the web address (GitHub Pages), with no recordings from voices/
python3 tools/mkicons.py        # only to redraw the app icons in gen/icons/
```

## Check before shipping

```
node tools/test_skills.mjs      # 160,000 generated questions across every country; word limits, coding puzzles, tukutuku panels, pixel pictures, paper folds, band parts, vague science wording, own-language cheers, unlocks
cd dist && python3 -m http.server 8770 &
python3 tools/qa.py 0           # plays every mission of every country at six screen sizes, all answers right
python3 tools/qa.py 3           # same, with wrong answers, so the re-teaching screens are checked too
python3 tools/qa.py 3 lv=7 only=m1   # the hardest questions: every levelled skill starts at Level 7 (repeat with lv=6, lv=5)
python3 tools/qa.py 3 deep      # also keeps missing a help step in every mission: exercises the hands-on tools and the easier-question path
python3 tools/qa.py 3 all nz    # one country only, saving a screenshot of every screen to shots/ (then: python3 tools/sheet.py laptop)
python3 tools/t_leak.py         # draws every picture of every skill and fails if one prints its own answer
python3 tools/t_hands.py        # the help ladder for each maths skill as a sheet of screenshots (add "phone", a skill name, miss=2)
python3 tools/t_weave.py sizes  # every tukutuku panel at six screen sizes: squares big enough, help never flashes a square she must weave
python3 tools/t_weave.py        # a sheet of every finished panel, wide and tall (then: t_weave.py play phone lv=3 for real clicks)
python3 tools/t_geyser.py       # the geyser lab played with real clicks, as a strip of its stages (add phone or phoneL)
python3 tools/t_lab.py australia m2 "too warm"   # any predict-and-test lab played with real clicks, as a strip (words from its question; add phone or phoneL)
python3 tools/t_walk.py         # every hands-on tool that is worked on the picture itself, with real clicks (add phone, or a skill name)
python3 tools/t_q.py money 3 brazil   # one skill at one level as she sees it: the question, the first help step and the hands-on tool, side by side (add phone)
python3 tools/t_pics.py measure   # every picture of a levelled skill on one sheet: the question, the "now you know" picture, each help step, and each tool part-way and finished (add levels: 1,2,3)
python3 tools/t_race.py         # the flashcard race with real clicks at five sizes, then once in real time to time the hare (add lap, ph, phL, sm or tabP)
python3 tools/t_beat.py         # the band with real clicks at four sizes: two misses, the right beat, each new part, then free play (add lap, ph, phL or sm)
python3 tools/t_elem.py         # the periodic table ladder and the body atlas from the passport, with real clicks at five sizes: "how far can you go?", meet, say, put in order, grouping, the atlas pages and "Test me" (add lap, ph, phL, sm or tabP)
python3 tools/t_sieve.py        # the sieve of Eratosthenes with real clicks at five sizes: wrong taps only wobble, the sweep, exactly the primes left, the grid to 100 the second time
python3 tools/t_el.py           # who says the Greek words: a Greek voice where there is one, never the Greek spelling handed to the English voice
python3 tools/t_nav.py          # moving around the world map and her home with real fingers (touch events) and a real mouse at five sizes: drag, pinch, + and −, arrows, flags that never touch, every corner of every room reached (add lap, ph, phL, sm or tabP)
python3 tools/t_room.py         # her home with real clicks at four sizes: an old save, her explorer, every wardrobe change, things that move, room colours, locked rooms, the garden (add lap, ph, phL or sm)
python3 tools/t_me.py           # her explorer on one sheet: every top, bottoms, shoes, mouth, eye colour, hair style and costume (add a word such as top or hair for a bigger sheet of those)
python3 tools/t_heads.py night  # every living thing in the shop wearing one room colour's hat, on one sheet, to see the hat sits on the head
python3 tools/t_frames.py rain start,sun,leaf,cloud,wind,rain   # a lab's picture at each state, after its movement has settled, on one sheet (add a wait in ms and a width; also eel, braille, spin, dizzy, aurora, glide)
python3 tools/t_until.py brazil m1 .codegrid phone   # plays a mission as the test player until a selector appears, and screenshots it (add an nth match)
python3 tools/t_magic.py       # the Lo Shu magic square with real clicks at five sizes, all four levels: wrong numbers, the clue after two wrong lines, every line making 15
python3 tools/t_ca.py          # who says the Canadian French: a Canadian voice (fr-CA) first, then a voice of France, never the French spelling handed to the English voice
python3 tools/t_art.py canada "[['guide', __ww.guide('', 'canada').innerHTML]]"   # drawings on one sheet, large, to look at (any JS expression giving [label, svg, width, height] rows)
python3 tools/t_jp.py lap 2 miss   # the Japanese strand: placement, meeting and tracing letters, listening, reading, building, talking and the race, for two stations, with wrong picks (sizes lap ph phL sm tabP; add from=10 to start further along)
python3 tools/t_trace.py lap   # tracing a letter with real mouse drags: a stroke the right way counts; backwards, or a scribble, does not
python3 tools/t_jplose.py lap  # the Japanese race lost: the review, back to basics, and winning it again
python3 tools/t_jpcount.py ph  # counting with Kenta, with real taps, fewest and most of each thing
python3 tools/t_jpline.py ph   # the Japanese line as the menu, her train, the rule pairs and the letter families, with real clicks
python3 tools/t_jpslow.py ph   # Slowly says a word sound by sound
python3 tools/t_elprize.py ph  # the periodic table: the clues, the summary, a row completed, medals, lab gifts and the shop shelf
python3 tools/t_jpmaster.py lap 2  # a station's four stops with misses on purpose: practise until right, look-backs, never stuck
python3 tools/t_kata.py ph      # katakana: the longest word, ニュージーランド, in every place it appears (cards, reading, splitting, building), and the katakana chart in My letters
python3 tools/t_town.py ph      # Kenta's Town: every built place (the Park, Home, the Zoo, the Shop), all six steps, with wrong picks; the map with real clicks; the grown-ups talk card, recording groups and the test player's "open every station"
python3 tools/t_unlock.py ph    # countries opening one at a time, trophies, the bonus row, Japanese inside Japan, the Welcome guide, About, the player's name; real clicks
python3 tools/t_codelab.py ph   # the Code Lab: the map button, the chips with real clicks, programs built with real taps, all four stations with wrong tries, gifts, the shop shelf, the passport button, the grown-ups note, the map's top bar with 9999 stars
python3 tools/t_jpprize.py     # passing a station: stamp, carriage, gift, the shop shelf; and the say-it panel recording with a simulated microphone
python3 tools/t_zh.py          # who says the Mandarin: a Mandarin voice where there is one, never a Cantonese one, never pinyin handed to the English voice
```

`qa.py` needs Python Playwright with Chromium. It fails a screen if a button is off-screen, a tap target is under 40 px, the prompt is over 12 words, or anything overflows. It exits non-zero if anything is wrong.

Other checks: `t_levels.py <skill> <country>` (every level of a skill on one sheet), `t_scene.py <country>` (the path screen), `t_file.py` (opened as a file, real clicks), `t_code.py` (coding help), `t_voice.py`, `t_reo.py`, `t_ja.py` (the Japan words and every line of the Japanese strand), `t_ru.py`, `t_pt.py` and `t_fr.py` (who says the Arabic, Māori, Japanese, Russian, Portuguese and French words), `t_record.py` (recording, the recording studio, and loading real voices), `t_nzclick.py` and `t_nz.py` (New Zealand close-ups), `t_weave.py play` (weaving with real clicks), `t_japan.py` (Japan close-ups: every drawing, the magnet experiment and the paper folding in real time), `t_admin.py` (test player, Clear, Reset a country).

## Layout

| File | What it holds |
|---|---|
| `src/js/01-core.js` | helpers, saved state, sound effects, speech and voice choice, the guides (`GUIDES`: one animal per country), the `COUNTRIES` list |
| `src/js/02-visuals.js` | every maths picture (blocks, base-ten, number line, patterns, shapes, grids, fraction bars, block graphs, compass, clocks, equal groups, the coordinate grid `V.coordGrid`, thermometers `V.thermo` and `V.thermos`, the place-value chart `V.placeChart`, the grid of squares `V.gridShape`, coins and notes `V.money`, the angle fan `V.angle`, the triangle `V.tri`, the ruler `V.ruler` with its long things to measure, the box of macarons `V.jar` and the grouped picks `V.picks`) |
| `src/js/03-skills.js` | levelled question generators (multiplying, adding, patterns, shapes, fractions, turns, graphs, telling the time, sharing and dividing, coordinates and maps, temperature and scales, place value and big numbers, area and perimeter, money and decimals, angles) with break-down steps and explanations; `bankSkill` and `wordSkill`. France added measuring in metric (`measure`) and chance (`chance`); Greece factors; China ratio (`ratio`); Canada decimals (`decimals`: tenths and hundredths on the ice, worked on `V.ruler`, which now also draws an ice lane (`kind: 'ice'`), named pins (`marks`) and words under the scale (`cap`)). |
| `src/js/04-acts.js` | the activity shell and kit: number pad, choices, drag-to-place (pictures or name tags), sort, match, order, meet words, predict-and-test, find on map, build, coding grid, tukutuku weaving (`ACTS.weave`, `weaveGrid`), pixel pictures (`ACTS.pixel`), paper folding, a band to build (`ACTS.beat`, `drum`). A place round can take `cls: 'smalltags'` for long names (the ear's). Also the flashcard race (`ACTS.race`, with its dots in tens and a strategy line from `raceHow`) and the Lo Shu magic square (`ACTS.magic`, four levels, progress in `S.magic`). |
| `src/js/05-engine.js` | runs a mission; the wrong-answer loop; review rounds; stars, stamps and video unlocks |
| `src/js/059-pan.js` | `panZoom`: a picture bigger than the screen that can be dragged, pinched and zoomed. The world map and every part of her home use it |
| `src/js/068-spine.js` | the two strands that run through every country: the periodic table ladder (`ELEMENTS`, `ACTS.elements`) and the body atlas (`ATLAS`, `ACTS.point`), and their practice screens in the passport (`SCREENS.labbook`) |
| `src/js/06-screens.js` | title, world map (flags that make room for each other: `place()`), country path, passport, grown-ups page |
| `src/js/0605-welcome.js` | the Welcome guide (first launch: welcome, the player's name, how it works) and About (for grown-ups: method, contents, privacy, phones, credits) |
| `src/js/065-room.js` | Her home: five places (bedroom, garden, playroom, science lab, star attic), the shop, room colours, things that move, her explorer and the wardrobe. Country souvenirs come from each country file |
| `src/js/07-egypt.js` | Egypt: scene, missions, question banks, Arabic words, videos |
| `src/js/075-nz.js` | New Zealand: scene, native birds, Earth science and the geyser lab, te reo Māori words, the six tukutuku panels, missions, videos |
| `src/js/076-japan.js` | Japan: scene, the bullet train, forces and magnets, the origami dog, five pixel pictures, missions, videos. Its language mission now uses the Japanese strand. It uses the small drawing helpers from the New Zealand file |
| `src/js/0761-nihongo.js` | にほんご, the Japanese strand that runs through the whole game: fifteen stations (twelve of hiragana, three of katakana), each with five stops (letters, words, read and build, talk, the fox race), say-it practice, prizes (stamps, carriages, gifts), and its own screen (`SCREENS.nihongo`), opened from the map and the passport |
| `src/js/0762-town.js` | けんたの まち, Kenta's Town: the conversation stage after the line. Eight places on a town map (the Park, Home, the Zoo and the Shop built), six steps each, the family talk card and the Japanese recording groups |
| `src/js/0763-code.js` | Code Lab: programming a robot, a strand of its own. Twelve stations on a circuit board (four built: steps in order, find the bug, repeat, draw with loops), tapped-in blocks, the help ladder, rewards, gifts (`CD_GIFTS`), `SCREENS.code` |
| `src/js/077-australia.js` | Australia: scene, the coral lab (photosynthesis, symbiosis, bleaching), the seasons lab (the Earth's tilt), the sound lab (vibration and pitch), egg-laying mammals, the reef coding grid, missions, videos |
| `src/js/078-russia.js` | Russia: scene, the rocket lab (every push has an equal push back), the orbit lab (Newton's cannon), the ice lab (why ice floats), Russian words, reading Russian letters, the Moon-rover coding grid, missions, videos |
| `src/js/079-brazil.js` | Brazil: scene, the rain lab (transpiration and the water cycle; the model for every lab, see "The lab standard"), the electric eel lab (cells in a row add their volts; the eel drawn along a curve), the banana kick lab (spin and the Magnus effect), Portuguese words, the samba band, the football coding grid, missions, videos |
| `src/js/0791-france.js` | France: scene, Pasteur's flask lab (microbes arrive on dust; they multiply by splitting), the X-ray lab (X-rays pass through skin and are stopped by bone and metal), the balloon lab (hot air spreads out and is lighter), French words, reading Braille (`SKILLS.braille`) and the Braille lab on an egg box (the rule that builds the alphabet), the hare and tortoise for the flashcard race, the meadow look for the coding grid, missions, videos. The measuring and chance skills it uses are in `03-skills.js`; the race itself is in `04-acts.js` |
| `src/js/0792-greece.js` | Greece: scene, the skeleton and its seventeen bones (the atlas's second page), the arm lab (muscles pull in pairs), the atom builder (protons, shells of 2, 8, 8), the alkali metals lab, the crown lab (density), Greek words, the owl coding grid, missions, videos. The first country built on the spine |
| `src/js/0793-china.js` | China: scene (a pagoda), the giant panda guide's art, Dragon maths (ratio and the Lo Shu magic square), the dragon and the rat for the race, Mandarin hello, the path with four missions shown as "coming soon" (`soon: true` on a path node). Only Mission 1 is built; the plan for the rest is in the plan document |
| `src/js/0794-canada.js` | Canada: scene (the northern lights over a frozen lake), the beaver guide's art, the spin lab (arms in, she spins faster), the dizzy lab (the fluid in a semicircular canal), the aurora lab (oxygen and nitrogen glowing), the glide lab (friction; the ice's watery top layer), the ear for the body atlas (`EAR`, `earSvg`, `earPlace`), Canadian French words (spoken by a fr-CA voice), the skater and the polar bear for the race, the rink coding grid, missions, videos. The front-view skater (`SKATER_FRONT`) is shared by two labs |
| `src/css/app.css` | all styling |
| `tools/launcher.ps1` | the script inside `Play WonderWorld.cmd`; the build wraps it into the .cmd |
| `tools/mkfont.py` | builds the macron vowels (ā ē ī ō ū) and the pinyin third-tone vowels (ǎ ě ǐ ǒ ǔ) from Fredoka. A made letter's left side bearing must equal its own left edge (`g.xMin`), not the plain vowel's, or it shifts right and closes up the space before it into `gen/fredoka-macron-*.woff2`; already run |
| `voices/<language>/<word>.mp3` | real recorded voices built into the game (also `voices/*.json` saved from the grown-ups page). Keep the game private while it holds recordings that are not yours to share |

## How the game teaches (read this before writing any question)

The game never says, shows or lights up an answer. This is enforced by the tests.

1. A missed question is broken into smaller steps (`steps`), each answerable from the picture.
2. A missed step becomes hands-on: a tool she works herself (`hands`, drawn by `HANDS` in `04-acts.js`): `H.count`, `H.skip`, `H.on`, `H.back`, `H.gap`, `H.rest`, `H.deal`, `H.spots`, `H.turn`. The game counts along but hides the last number, which is hers to say. A step can also start with a tool (`pre`).
3. If the tools do not land, `scaffold()` returns false and the engine gives an easier question.
4. Every number step is written `N(text, answer, picture, spoken line, [tools], startTool)`. `test_skills.mjs` fails a step with no tool, or a tool that does not land on the step's answer.
5. A step's picture must not print the step's answer (numbered blocks, a labelled landing point). `t_leak.py` draws every picture and fails any that does.
6. Choice steps (facts, words): on a miss the clue is repeated and the wrong pick is greyed out. Nothing glows.

## Tukutuku weaving (`ACTS.weave`)

A panel is a rule, not a list of squares: `at(d, e, y, H)` gives the thread (0 none, 1 white, 2 gold) for each crossing from its distance `d` from the upright mirror line and `e` from the level one, so every panel is symmetrical by construction and can be drawn at any size. Each has a `wide` size for landscape screens, a `tall` size for portrait, and, if `wide` has more than six rows, a `low` size for a phone on its side. `sym: 1` gives her one side to mirror; `sym: 2` gives a quarter to reflect across both lines. Her progress is `S.weave` (panels woven); a weave round gives the next panel, and "Weave another" lets her carry on. A wrong square is never punished: the first miss says to count from the mirror line, the second flashes a finished stitch and numbers the squares out from the line.

## Pixel pictures (`ACTS.pixel`)

A picture is rows of letters, one per square, with a palette (`pal`) and colour names (`names`). Only the left half is written; `PXM` mirrors it, so both sides always match. Each picture has a `big` drawing (up to 16 x 14, for a laptop or tablet) and a `small` one (up to 8 x 10, for a phone), and each of those has `frames`: whole pictures of the same size that play in turn once she finishes, with a `move` (bob, hop, fly, rock, launch). She picks a colour, then taps a square or drags along a run; a wrong square never sticks, and the drag stops at it. Progress is `S.pixel`; "Make another" carries on. `t_pixel.py` draws the sheet, plays one with real clicks and a real drag, and checks every size.

## A flashcard race (`ACTS.race`)

Asked for by Tony on 4 October 2026: quick recall against a rival that runs at one steady speed from the start line to the finish and never stops. She is the tortoise. A card shows a sum and four answers. Right: the tortoise takes a step (ten steps to the flag). Wrong: that answer greys out and she has one more try. Wrong again: the card changes. Nothing ever shows or lights an answer.

- A round is `{ act: 'race', me, rival, rivalName, track, intro {text, say}, win {text, say}, lose {text, say} }`; the country lists `race` in its `ladders`.
- Her progress is `S.race { lv, again, wins }`. **She moves up a level only by winning.** A lost race leaves the level where it was, and costs nothing: she can race again or go on.
- A level is a set of cards and a speed. There are six sets (`raceCard`: number bonds and doubles; adding and taking away within 20; the 2, 5 and 10 times tables; the 3 and 4; the 6 to 9; dividing mixed with multiplying), each raced first at `RACE_PACE[0]` seconds for each step of the hare, then at `RACE_PACE[1]`: twelve levels. To make every race quicker or slower, change `RACE_PACE` (now 7 and 5). A child whose multiplying skill is already at Level 3 starts at the times tables (`raceStart`).
- Cards missed twice are set aside. After the race they come back one at a time with dots to count (`raceDots`: it never prints a number) and no rival, and they are the first cards of her next race (`S.race.again`).
- `t_race.py` plays it with real clicks at five sizes and times the hare in real time; `test_skills.mjs` checks every set of cards.

## A band to build (`ACTS.beat`)

She copies each instrument's beat by ear, one instrument at a time, and the band plays it back while her explorer and the guide dance. A round is `{ act: 'beat', parts: [...] }`. A part is data: `{ id, name, sayName, art, sound, col, hits, intro {text, say}, done {text, say} }`. `hits` is eight boxes, one bar, written `'x...x...'`. `sound` is one of four synthesised drums (`low`, `shake`, `bell`, `tick`, made by `drum()`; no sound files). Which hits are louder, or the higher bell, depends only on where in the bar they fall (`beatStrong`), never on the pattern, so her own boxes sound exactly as the real part would and the sound cannot give a box away. Progress is `S.beat` (parts learnt); each round adds the next part over the ones she has, and once she has them all the round is free play. Help never shows a box. Listening is unhurried (0.34 s a box) and the numbers 1 to 8 light as it plays, from the first time. It breaks itself down (Tony, 9 October, after the player gave up on the tamborim): a first miss splits the bar, so she does boxes 1 to 4 slowly (0.46 s a box) with 5 to 8 dimmed, then 5 to 8; two misses in a half and it goes one box at a time: the drum plays up to the ringed box and she answers "A hit" or "No hit"; a wrong answer replays it and marks nothing. The finished bar plays back at full speed (0.25 s a box). With the sound off, the instrument jumps on each hit, so it can still be done by eye. List `beat` in the country's `ladders`. `test_skills.mjs` checks every part; `t_beat.py` plays it with real clicks.

## Hands-on help is worked on the picture (`HANDS.pic`)

Tony's rule: when she needs her hands, she uses them on the thing she was asked about, never on a separate screen of boxes. A skill gives a step a tool made with `H.walk(n, draw, words)` (count 1, 2, 3), `H.walkOn(start, by, n, draw, words)` (count on in equal steps) or `H.walkSteps(start, [amounts], draw, words)` (count on by a different amount each tap). `draw(walk)` returns the picture function; the picture draws anything tappable with `class="hot"` and, where the order is free (squares, edges, counters), `data-i` so the thing she touched takes the number. The last label is always "?". Pictures that support a walk: `V.coordGrid` (hops along a line), `V.thermo` (a marker climbing), `V.clock` (counters round the dial), `V.placeChart` (counters), `V.gridShape` (squares, edges, rows), `V.money` (coins and notes, in any order) and `V.angle` (slices of the fan). `test_skills.mjs` checks every such tool lands on its step's answer and draws something to tap; `t_walk.py` works each with real clicks. Give any new picture a walk before writing its skill.

## Labs she drives (`predict` rounds with `setup` and `sim`)

A lab is a predict-and-test round whose experiment she runs herself, one press at a time. `setup(stage)` draws the picture for the prediction question; `sim(stage, ui)` plays it. Inside `sim`, each stage is one `labStep(ui, g, label, state, text, say, then)` (in `077-australia.js`): a button with a verb on it ("Warm the water"), which sets `data-s` on the lab so the stylesheet moves the picture, shows a line of 12 words or fewer, speaks the fuller explanation with the real words, and stays on screen at least 2.8 seconds. The picture carries the science: the coral's colour is its algae, so when they leave it turns white; the Earth leans the same way all year, so the lean points to the Sun in December and away in June; a tube half as long vibrates twice as fast (88 cm: 98 a second; 44 cm: 196). Figures are worked out or sourced and noted beside the lab. Each lab ends with a try-it she can do with real things (a leaf in water, a lamp and a ball, a bottle); `tryit.pic` shows a drawing of what to set up. A lab whose picture builds up as she goes (the seasons lab leaves an Earth at each quarter; the orbit lab leaves a trail for each launch) ends as the diagram a textbook would print.

## The lab standard (9 October, from Tony's rain-lab storyboard)

Tony asked for the rainforest lab to look "so slick that we then continue developing wonderworld to be similar to it". `RAIN_LAB` in `079-brazil.js` is the model; the eel lab and the Braille lab follow it. Every new or revised lab:

1. Has a camera: the scene sits in a group (`.rl-cam`) that the stylesheet moves and scales for each state, so the view goes down to the roots, up the trunk, close to one leaf, out to the sky. A long move uses keyframes. The words, counter and caption sit outside the camera and never move.
2. Draws each moving thing as its own layer, with the movement in CSS keyed on `data-s`. Each press starts one clear movement with an ease-out. Small movements are already going before the first press (water shimmering, leaves swaying). Nothing that belongs to a later press shows early.
3. Draws water as flowing dashed strokes, vapour as faint wisps and cloud as solid white; loop arrows draw themselves on with `pathLength="1"` and a dash offset. Staggered starts use a CSS variable (`style="--d:.4s"`), not inline animation delays.
4. Gives big numbers a size she knows (1,000 litres is five baths filling as the counter climbs), and joins any close-up to the one thing it shows.
5. Is looked at state by state with `t_frames.py` at laptop and phone width before it ships, as well as played with `t_lab.py`.

The game has one set of colours, and they are light: `index.html` and `app.css` declare `color-scheme: only light`, so a phone in dark mode does not recolour the pictures. Samsung Internet may still do so; the grown-ups page names the setting.

## Moving around: the map and the rooms (`059-pan.js`)

Tony's brief, from a phone held upright: the countries on the map were hard to see, and the room showed only its middle. "We should be able to navigate around the place."

- **`panZoom(view, stage, o)`** makes `stage` a picture that is looked at through `view`. One finger or the mouse drags it, two fingers pinch it, the wheel zooms, and it returns the + and − buttons (`ctl`) and four edge arrows (`arrows`) for the screen to add. The stage is laid out at its real size (`st.w` wide, `st.w * o.ratio` high) and moved with a transform, so pictures stay sharp. `o.limits(vw, vh)` gives the smallest, biggest and starting widths, `pad` (the part of the screen under bars, kept clear), `ext` (room round the stage that may be shown) and `bars` (where the buttons and arrows go). `o.skip(target)` says a press is not the stage's (a thing in a room is dragged, not the room). `o.on(st, zoomed)` runs after every move. A drag that begins on a button inside the view does not also click it.
- **The map** (`SCREENS.map`): flags keep their size while the map grows, so zooming in pulls a crowd apart. `place()` runs whenever the size changes: any two flags or names that touch are nudged apart (an open country gives way less than one still to come), each is pulled gently back to its country, and a flag that ended up away from its country gets a line and a dot. A new country therefore needs only its entry in `WORLD` and its point in `gen/map.json`; there is no hand-set flag position. The map starts on the next country, big enough to tell the countries apart (`limits`), and never shrinks so far that the flags cover it.
- **The rooms** (`SCREENS.room`): each part of the house is a place 5 wide and 3 high. Things are placed in per cent of the room (`it.x`, `it.y`), not of the screen, and sized from `--u`, one hundredth of the room's height, so a room is the same on every device and a phone held upright looks at part of it. `roomSvg` draws the wall, floor, sky, grass, fence and attic roof on past the picture's edges (`EX0`, `EX1`, `EY0`, `EY1`) so any screen is filled when the whole room is shown. Carrying a thing to the edge of the screen slides the room along (`pz.nudge`). What comes out of the box or the shop lands where she is looking (`pz.spot()`).
- Check with `python3 tools/t_nav.py`. It uses touch events through the browser's own protocol, because a test's ordinary "click" cannot drag or pinch.

## The spine: the periodic table and the body atlas (`068-spine.js`)

Tony's brief (4 October): "We need a bit of structure across all the countries"; "We need the player to recite the tables. We have been practicing through in order to help memorise first and then we are wanting to start grouping them"; "the player needs to be a master" of anatomy. Every country from Greece on carries both strands. Her place in each belongs to no country: `resetCountry` leaves it alone.

- **The periodic table.** `ELEMENTS` holds all 118 (symbol, name, period, group, family by column, state, metal or not, and for the common ones what it is found in). Her place is `S.elem { n, placed, g, tries }`: `n` is how many she can put in order, `g` the grouping game she has passed.
  - A round is `{ act: 'elements' }`: the first time, `elPlacement` ("How far can you go?"); then `elLearn`: `elMeet` (the next five, tapped to hear), `elSay` (face down, she says each aloud and taps to check, in order), `elOrder` (shuffled tiles with no numbers, tapped in order). One slip at most moves `n` on by `EL_CHUNK`.
  - `{ act: 'elements', part: 'group' }` plays the next grouping game (`elGroupGame`) once `n` is 20 or more; before that it is another round of the next five. Put both in the chemistry mission, the second after the chemistry lab.
  - The rule holds here too: a wrong tile greys out and `elClue(z, miss)` gives a clue, never the name. Nothing lights up. The first miss gives what it is used for, or a story about it (every element from 1 to 118 has one, five words or fewer, from the Royal Society of Chemistry's periodic table); another miss gives where it sits: under the element above it in its column, or its row and column. Never "it comes straight after…": she can see that already (Tony, 11 October: "stupid hint!"). `test_skills.mjs` fails a clue that names the element, says what it follows, or repeats itself.
  - **Rewards** (Tony, 11 October: "a similar reward system as the learning japanese. Small rewards along the way and it needs to be fun!"): a progress bar while she orders (`elScore`, `elTick`); a cheer at 3, 5, 8 and 12 in a row; a summary after every set of five (`elSummary`: right first time, best run, stars, how many of 118, a daily streak of atoms); a row lighting up when she completes one, with "a row is called a period" (`EL_ROWS`); and every ten elements, and at 118, a medal and a lab gift for her room (`EL_GIFTS`, twelve, on the shop's "Lab gifts" shelf and in her toy box), plus 5 stars (`elPrizes`). A set passed earns 3 stars, a set not passed 1, a practice set 1. The home screen shows how many of 118, her medals, her streak and the next gift (`elHomebar`). No lives.
  - `elTable` draws the table: eight columns up to calcium, so the tiles are big; all eighteen beyond.
- **The body atlas.** A country adds one system: `ATLAS.<id> = { name, icon, cid, need: '<country>.<mission>', board, parts }`. A part is `{ id, label, x, y (where it is on the picture), lx, ly (where its name goes, at the end of a line), w, lv, fact { text }, hint { text } }`, or for a picture part `{ id, kind, art, x, y }` (Egypt's organs).
  - Naming: a `place` round with `tags: true` (Greece's `skelPlace(level, …)` builds one from the parts of that level, with the names already learnt printed in place).
  - Testing: `{ act: 'point', system: '<id>', n, ids }`: "Tap the femur." Every part is a place to tap; a wrong place is marked and the part's `hint` is given; the right place is never shown.
  - A system should come with a lab that shows how it works and a `bankSkill` of questions, so review rounds in later countries bring it back.
- **Practice.** The passport's "My lab book" opens `SCREENS.labbook('elements' | 'atlas')`: the same activities, with no mission. A passed grouping game or a clean point test earns 3 stars; sets of five earn as above.
- **The grown-ups page** reports both (`spineNote`), with a two-press "Start the table again".
- **Checks.** `test_skills.mjs` compares the 118 names and symbols with the npm package `periodic-table` (installed by `npm install`), checks every atlas part has a place, a fact and a clue of 12 words or fewer, and that every `point` round names real parts. `t_elem.py` plays both strands with real clicks.

## にほんご: the Japanese strand (`0761-nihongo.js`)

Tony, 9 October: "It should be based on year 1 words in hirigana. Remember, this needs to be the main piece for Wonderworld. She needs to have a system that sets her up well to start conversation. I like to have the flashcards to test each stage before she moves up a level. Make it fun!" Revised the same evening after he played it ("I really need this to flow well for her"; "Dualingo has some great ideas ... follow similar principles").

- **Fifteen stations** (`JP_ST`) on a bullet-train line: the hiragana rows in chart order (あ, か, さ, た, な, は, ま, や, ら, わ/を/ん), then the two dots and the circle (が, ぱ), then the small letters (しゃ, っ); then three katakana stations (`kata: true`, 11 October), chosen for the words she needs first: her name アリア, パン, ニュージーランド, then everyday words (ア イ ス リ パ ペ ン; ニ ュ ー ジ ラ ド; キ ウ ケ コ メ ロ). Each katakana is met beside its hiragana twin (the rule's pairs あ→ア; a "twin" tag on the letter card); twins are never offered side by side (`jpAlike`); the long line ー holds the sound before it (`jpMora`, `jpSlowParts` says ジュー as one sound); spare tiles in a build are in the word's own script; `jpListenPool` never asks ー or a small letter on its own. Pictures can be her explorer (`'me'`, for アリア), Kenta (`'kenta'`), a flag (`'flag:nz'`) or a cake with an age (`'age:7'`): `jpArt`. A word of seven letters or more is drawn smaller (`vlong`) and splits onto two rows. My letters has a katakana chart once she has met katakana. Each has `kana`, a `rule` (`text`, and `intro`/`outro` for the voice; the letters themselves are chanted by the Japanese voice as each lights on the chart), `anch` (each letter's picture word), `words` (only letters met so far; `test_skills.mjs` checks it) and `talk`.
- **Five stops per station** (`JP_STOPS`), done in order and saved after each (`S.jp.stop[n]`): 1 Letters (`jpMeet`: the chant, each letter writing itself, tracing, then hear-and-tap); 2 Words (`jpWordsStop`: every word met first on a card with picture, English and Japanese, said in Japanese then English, with the say-it panel; then hear-and-find); 3 Read and build (`jpReadStop`); 4 Talk (`jpTalk`, with Kenta the Shiba); 5 the fox race (`jpRace`), open only after the first four. Winning the race passes the station (Tony: "I am ok with more mistakes").
- **Practise until right** (`jpMaster`; Tony, 10 October: "4/8 passed first time isnt a very good pass rate. those other 4 need to be worked through to ensure she passes 1st time"): every letter, word, build or conversation she misses in a stop is taught again on its card, then asked fresh, until she gets each one right first time. At most three rounds, so she is never stuck; anything still tricky is marked (`S.jp.weak`, letters as `L:` plus the letter) and leads the next look-back. The stop summary shows right first time, how many tricky ones are now right, and any still to practise.
- **Back to basics**: three misses in a stop, or a lost race, and the whole set of letter or word cards comes back first (`jpLetterCards`, `jpWordCards`); then the missed ones are practised as above.
- **Look back** (`jpRefresh`, `jpLookPlan`; Tony: "we need to have mid refreshers over all lessons/stops we have learnt"): half way through every stop, a "Look back!" card and three quick questions from everything learnt so far, on this station and every earlier one (a letter to hear, a word to hear, a word to read, as far as she has got), the tricky ones first. A missed one is practised until right. Look-backs do not fill the stop's bar and are counted on their own in the summary. The very first stop has nothing to look back on and skips it.
- **The line is the menu** (Tony, 11 October: "i want the stations to be click links. we dont need the green station button"): tap the pink station to go on, any passed station to practise its stops again (with Back), and a later one only says to pass the one before. Her train (`jpTrain`) has its nose in front, a coupling before each carriage and a tail car with a red light; the train on the line faces the way it will go.
- **Two dots, the circle, and small letters**: the rule's pairs are buttons to tap and hear again; after each letter is written and traced, its whole family is met on cards she taps (か→が … こ→ご; き+ゃ=きゃ), so every letter the listening check asks has been seen and heard first (`jpFamily`, `JP_MARKPOOL`, `JP_SMALLPOOL`). Every letter's picture word has that letter in it (ぱ: らっぱ).
- **Counting on** says し for 4 and しち for 7, as children in Japan chant it (`JP_NUM`).
- **Speech bubbles** are each at most 45% of the scene, so two never meet; a word too long for its bubble breaks onto the next line, and a closing ！ or ？ stays with the letter before it (`jpBubText`) (`t_jptalk.py` draws every exchange at five sizes, the town's too). Every reply must answer what Kenta asked (11 October: "Was it yummy?" had "Thank you for the meal"). The prize train is scaled to fit any screen (`jpFitRow`).
- **Counting with Kenta** (`jpCount`): the things sit in the open between the player and Kenta, in front of everything (the first apple was once under the player and could not be tapped). Kenta says what to count in Japanese, then English ("かぞえて！", "Count the apples!"). A tap on any speech bubble says it again.
- **Every finished word** is shown and said in Japanese, then English (`jpShowWord`, `jpBoth`). Every picture has its English word under it (`jpPic`).
- **Say it** (`jpEcho`): Listen, Slowly, Record me, Play me. Slowly (`jpSlow`) says a word sound by sound (そ… ら…), a sentence word by word, each its own utterance, then the whole at a slow rate: some Android voices ignore a slower rate (Tony, 11 October: "none of the words are said slowly"). Recording uses the device's microphone only where the browser allows it; nothing is saved or sent. An online voice check was offered and declined by Tony (9 October: "leave the internet voice check out for now").
- **Fun**: a progress bar along the top of each stop (`jpScore`, `jpTick`); a cheer at 3, 5, 8 and 12 in a row; a summary at the end of each stop; a daily streak of lanterns (`jpStreak`); "My words" brings back the words she found hard (`S.jp.weak`). No lives to lose.
- **Prizes**: a star per stop; passing a station gives its eki stamp, a new carriage on her bullet train (`jpTrain`) and a gift for her room (`JP_GIFTS`, fifteen, in the shop's "Japanese train gifts" shelf and her toy box), plus 5 stars.
- **In Japan**: Mission 3 plays her next two stops (`{ act: 'nihongo', stops: 2 }`); the challenge plays a conversation and her race (`part: 'talk'`, `part: 'race'`). The にほんご button on the map and the passport open the line any day.
- **Her place**: `S.jp { st, placed, met, stop, wins, again, weak, seen, day, streak, sday }`. No country owns it. The first visit asks how far she can read (`jpPlace`). Grown-ups page: a note and "Start Japanese again".
- **No romaji on screen.** `jpRom` and `jpPhon` are for a device with no Japanese voice and for the tests.
- **Letters** are drawn in Klee One (`'Klee Kana'`, hiragana and katakana, subset from `KleeOne-SemiBold.ttf` in github.com/google/fonts), strokes from KanjiVG (`gen/kana.json`, `tools/mkkana.py`). Wrap Japanese in `jpEl(text)`.
- **Checks**: `t_jp.py` (visits at every size, with wrong picks), `t_jplose.py` (a lost race), `t_trace.py` (tracing with real drags), `t_jpcount.py` (counting with real taps: every thing can be tapped, none under a character, what is counted is said), `t_jpline.py` (the line as a menu, her train, the rule pairs and the families, with real clicks), `t_jpslow.py` (Slowly, sound by sound), `t_jptalk.py` (every conversation's bubbles at five sizes, and the prize train), `t_jpmaster.py` (missed items practised until right, look-backs half way, tricky ones first, never stuck), `t_jpprize.py` (stamp, carriage, gift, shop shelf, and recording with a simulated microphone), `t_ja.py` (every line in the right voice), `test_skills.mjs`.

## けんたの まち: Kenta's Town, the conversation stage (`0762-town.js`)

Tony, 11 October: "How do we get to the next step to ensure the player can start having conversation in Japanese?" Proposed that day, approved ("Commence with items 1 and 2"; Park and Home first, then a review with the player).

- **Opens** from the Japanese home ("Kenta's Town") once all fifteen stations are passed. Before then the button says how to open it. The map (`townMap`) has eight places; the Park, Home, the Zoo and the Shop are built, the other four (school, weather, food, feelings) show as coming soon. A place opens when the one before it is finished.
- **Each place** (`TOWN`) teaches one sentence pattern in six steps (`TOWN_STEPS`), in order, saved after each (`S.jp.town.done`): Watch (`townWatch`: a four-to-six-line dialogue, Japanese then English, then the new words on cards); Fill the gap (`townSwap`: the pattern with a gap, she taps the word that fits the picture, then hears the whole sentence); Your answer (`townOwn`: Kenta asks, every choice is right, she picks her own true answer and says it aloud); Ask Kenta (`townAsk`: she picks the question that asks what she wants to know, with no English, hears his answer and shows she understood it); Listen fast (`townListen`: natural speed, no words on screen, pick the picture); Role-play (`townRole`: five turns; English under every reply for two turns, faint for two, then gone; English goes under every reply or none, `townEn`).
- **Rules held**: every line uses only letters met on the line (`test_skills.mjs`); misses are practised until right (`jpMaster`); a clue with Japanese in it is spoken with the Japanese in the Japanese voice (`townMix`); boys say ぼく, girls わたし (Kenta is a boy).
- **The Zoo** (28 October, Tony: "build the zoo"): likes and dislikes, ＿が すき です / ＿が すきじゃない です, だいすき, こわい, and asking なにが すき ですか？ The animals are words she already reads from the line (ぞう さる くま へび わに うさぎ きつね コアラ); ペンギン is only a picture word on the line, so it is not used. Its scene (`jpSceneSvg('zoo')`) is a fence along the hill, a giraffe and a zebra beyond it, and a gate.
- **The Shop** (29 October, Tony: "build the shop"): ＿を ください (met on the line), いくら ですか, and prices in yen in tens up to ひゃく, built like the place-value chart (に + じゅう = にじゅう). Prices use only the tens whose first word matches the counting chant (10, 20, 30, 50, 60, 80, 100); 40, 70 and 90 wait, because prices say よん and なな where the chant says し and しち. Pretend prices, all 100 yen or less. Two new pictures through `jpArt`: a price tag (`'yen:50'`) and a real yen coin (`'coin:50'`: 10 yen copper, 50 yen silver with a hole, 100 yen silver). The scene is the line's shop stall.
- **Rewards** as on the line: progress bar, cheers, a summary and a star per step; a finished place gives a sticker on the town map, a new friend (the Park: Tama the cat; Home: Rin, Kenta's little sister; the Zoo: Momo, a little monkey; the Shop: Hana, a rabbit) and 3 stars.
- **For the family** (grown-ups page, "Japanese with the family"): this week's talk card, three phrases from the place she is on, with romaji and English for the grown-up, to copy into a message or print (`townCard`, `townCardText`); and "A family voice for Japanese": the recording studio for every line of each built place, the line's conversations and its words (`townLines`). A recording replaces the computer voice wherever that line is said (`Speech.clip`; keys ignore Japanese punctuation). The test player has "Open every Japanese station".
- **Checks**: `t_town.py` (all six steps of every built place with wrong picks, the map with real clicks, the grown-ups page), `t_jptalk.py` (the town's bubbles too), `test_skills.mjs`.

## Code Lab: programming (`0763-code.js`)

Approved by Tony on 28 October ("Approve the plan of attack"): programming runs through every subject at a good intermediate school, and the countries' coding puzzles stop at moves and repeats.

- **Twelve stations** (`CD_ST`) on a circuit board, opened from the map's Code Lab button or the passport. Built: 1 Steps in order (a sequence), 2 Find the bug (debugging), 3 Repeat (loops), 4 Draw with loops (patterns; a loop inside a loop earns the gold gear on the big square). Still to come, shown as coming soon: If, If or else, Repeat until, Counters, My own blocks, Blocks with numbers, Buttons and events, Real code. Pitched against the NZ Curriculum's computational thinking progress outcomes 1 to 4 (tki.org.nz, read 28 October 2026).
- **The robot** is seen from above and faces one way (`CD_BOT`). Blocks: forward, turn clockwise, turn anticlockwise, repeat (`cdParse` writes them short: `R4(F F cw)`). Blocks are tapped in where the pink line is; tap a block to move the line after it, tap a repeat to go inside, tap its end to come out, tap its number to change it (`cdEditor`).
- **Puzzles**: build (reach the battery, collect every gem, or draw the dotted shape, sometimes within a block limit), fix (a buggy program to test and mend), bug (tap the wrong block; Test it as often as she likes), predict (tap the square where it will stop), shape (which drawing will it make). Each station starts with the robot showing the idea (`cdMeet`).
- **The teaching rule**: a wrong program runs and shows what it did. The first miss names what happened (bumped after the red block, stopped on the red square, missed a gem, not the dotted shape, too many blocks); the second breaks it down (a flag at each corner of the trip, part by part, then the whole trip fresh; with a block limit, make it work at any length first, then make it short; a fix gets which half the bug is in); the third counts the squares out, or marks the two blocks the bug is in. Predictions: a miss crosses out the square; another runs part of the program and greys the blocks done. Never stuck: after eight tries, or two at making it short, it comes back at the end. Anything that needed help is practised again until right first time (`cdMaster`). A look back half way through each station from the second on.
- **Rewards**: the progress bar, cheers at 3, 5 and 8 in a row, a gold gear for the fewest blocks, a star per puzzle, the summary; the first time through a station, a badge, a gift for her room (the shop's "Code Lab gifts" shelf, `it.cd`) and 5 stars.
- **Her place**: `S.code { st, gold, weak, day }`. No country owns it. Grown-ups page: a note and "Start the Code Lab again".
- **Checks**: `test_skills.mjs` (every answer works within its limit and makes its best count, every part of a broken-down trip can be done, a block limit really needs a loop, a buggy program really fails, predictions move, shapes differ, prompts and pictures), `t_codelab.py` at five sizes.
- **The map's top bar** has six buttons now: below 900 px wide the labels hide, and on a small phone the buttons pack closer, so it fits a 360 px phone with a four-digit star count.

## The sieve, and factors and primes

- `SKILLS.factors` (in `03-skills.js`, Levels 1 to 6: does it fit exactly; the other number of a factor pair; pick a factor; square numbers; primes to 30; primes to 100). Its picture is `V.tiles` (square tiles in rows, the left-overs in pink; she taps rows, tiles along a row, or left-overs to count); `V.bags` shows three numbers without sorting them.
- `ACTS.sieve` (in `04-acts.js`): `{ act: 'sieve', intro: { say }, done: { say } }`. Progress `S.sieve` (1: done to 50; 2: done to 100); list `sieve` in the country's `ladders`. `SIEVE_SHOW` is how many of a times table she crosses out herself before the rest sweeps out.

## Her home (`065-room.js`)

Tony's brief: anything that moves in real life moves; things change with the room colour; she has a character of her own to design and dress; more of the house opens with gold stamps; and there is an outside.

- **Things that move** (`MOVES`): keyed by the picture's name (`'teddy-bear': 'rock'`), so a souvenir that uses the same picture moves the same way. A souvenir can give its own: `move: 'hover'`. The movements are the `mv-*` keyframes in `app.css` (hop, flap, crawl, swim, rock, hover, wobble, tick, sway, float, twinkle, bounce, strum, slide, bob, waddle, flutter, spin, prowl). A tap plays the thing's trick (class `trick`; never reuse a class the shell already styles, such as `act`, which is the activity screen and paints a background).
- **Living things** (`HEADS`): `[across %, down %, hat width %]` of the picture, the top of the head. A living thing wears the room's hat and sleeps at night. A hand-drawn souvenir gives its own: `head: [73, 40, 30]`. Run `t_heads.py` and look at the sheet after adding one: the hat must sit on the head.
- **Room colours** (`THEME_LOOK`): each colour has a hat (drawn in a 60 x 44 box, bottom middle on the head) and something drifting in the air (`fx`: spark, bubble, petal, leaf, zzz, dust, snow). `sleep: true` (Night sky) shuts her explorer's eyes, slows the living things to a sleeper's breathing and sends up z z z. A country's new room colour needs an entry here, or it falls back to the Sunny cap.
- **Her explorer** (`S.me`, `meSvg`): six ready-made explorers to start from, then everything about her can be changed at any time, free, in four tabs. *Me*: six skin tones, twelve hair styles (`HAIRS`; one is a headscarf, one shaved), eight hair colours. *Face*: six eye colours (`EYECOL`), four mouths (`MOUTHS`), glasses (none, round, square), freckles, eyelashes, a hearing aid. *Clothes*: her own clothes piece by piece, six tops (`TOPS`), four bottoms (`BOTS`) and three kinds of shoes (`SHOES`), each with its own colour (`OUTCOL`, `BOTCOL`, `SHOECOL`). *Extras*: sixteen things to buy and wear (`EXTRAS`), one in each place: head, face, neck, back, hand; a bought extra can be taken off and kept. Four whole costumes cost stars (`KINDS`: scientist 20, artist 20, superhero 30, astronaut 35) and replace her own clothes while worn; her own clothes come back as she left them. Every choice must change the picture at once: `t_room.py` fails one that does not. She wears the room's hat when she has none of her own on. The wardrobe opens by itself on the first visit, and afterwards from the "Me" button or by tapping her and "Dress up". To add a choice, add it to the list and draw it in `outfitSvg` or `meSvg`, then look at `t_me.py`'s sheet on light and dark skin.
- **Places** (`PLACES`): the bedroom and the garden are open from the start; the playroom opens at 3 gold stamps, the science lab at 8, the star attic at 15. Once open, a place stays open (`S.open`) even if a country is reset. Each place keeps its own things and its own colour (`S.places[id]`; the bedroom stays `S.room`, so old saves load unchanged). The guide announces a newly opened place once (`S.seen`).
- **The shop** (`SHOP`): six shelves, two of them for the garden ("Outside things", "Garden friends"). Each thing is in one place at a time: "Put away" sends it to the tray, and the tray is offered in every place, so anything can be moved to any room or the garden.
- State added: `S.places`, `S.place`, `S.open`, `S.seen`, `S.me`. All are optional, so a save from before the upgrade opens as it was.

## Grown-ups page: protecting her progress

- **Test player** (`setPlayer`): a second save (`wonderworld2_v1_test`) with every mission open and 300 stars. A red "Test player" label shows on every screen. the player's save is not read or written while it is on.
- **Clear** on a skill row (`clearSkill`): forgets that skill's level, counts and re-teaching log.
- **Reset a country** (`resetCountry`): its missions, stamps, stickers and videos, the skills only that country names (`ownSkills`), and its making ladders (`ladders: ['weave']`). Stars and the room stay.
- Each needs two presses. `t_admin.py` checks all three and that the player's save does not change by one character while the test player plays.
- **Backup**: "Copy the code" selects the whole backup code and copies it; "Paste" drops a copied code into the box below (so it works on a tablet without a keyboard), and "Restore" brings that progress in. A code that is not a backup is refused. `t_admin.py` checks copy, paste, typing and restore.

## Testing only what changed

After a change, run `test_skills.mjs` (fast, covers all content) and then play only the missions that were touched: `python3 tools/qa.py 3 deep <country> only=m4,boss`, plus the close-up test for that activity. With `only=`, `qa.py` plays as the test player, because a later mission is locked for a new player; check the line it prints says more than 0 states. Run the whole play-through only when the engine, the shell or the stylesheet's shared rules change.

## The wrong-answer rule (in `05-engine.js`, `skillRound`)

1. A miss is logged and treated as "the step was too big".
2. `scaffold()` asks the item's smaller steps one at a time, turning a missed step into a hands-on tool, then shows the explanation.
3. A fresh question of the same kind is asked at the same level.
4. A second miss, or help that did not land, steps the level down one and repeats.
5. The round ends only on a correct answer. A helped round earns 1 star and no gold stamp; a clean round earns 2.

## Adding a country

A country is one data file. New Zealand (`075-nz.js`), Japan (`076-japan.js`), Australia (`077-australia.js`, for labs), Russia (`078-russia.js`), Brazil (`079-brazil.js`, whose rain lab is the model for every lab), France (`0791-france.js`), Greece (`0792-greece.js`, the model for the spine), China (`0793-china.js`; one mission built so far) and Canada (`0794-canada.js`, the newest, with four labs to the lab standard) are the models to copy: between them they use everything the engine offers.

1. Create `src/js/07x-<name>.js` so it sorts after the existing countries and before `08-main.js` (for example `0795-italy.js`; later files use helpers such as `labStep` from earlier ones). The country must already be in `WORLD` in `06-screens.js` (thirteen are) and its flag code in the list in `tools/build.mjs`.
2. Define `COUNTRIES.<id> = { name, hello, helloSay, scene, thing, boat, videos, souvenirs, themes, gates, path, missions }`, plus `cheers` (a cheer in the country's own words) and `ladders` (making activities to reset with the country) where they apply.
   - The guide: add the country's own animal to `GUIDES` in `01-core.js`, drawn in the 120 x 120 box with `SVG120`, `G_EYE` and `G_HAT`. The kiwi is New Zealand's only (Tony's rule). Egypt has a camel, Japan a Shiba Inu, Australia a koala, Russia a brown bear, Brazil a toucan, France a rooster, Greece a little owl, China a giant panda, Canada a beaver; away from any country the guide is a globe in an explorer's hat. A country with no entry gets the globe.
   - `scene`: a 1000 x 600 SVG, layered paper cut-outs, `preserveAspectRatio="xMidYMid slice"`. Keep the middle clear for the path. Give gradient and filter ids a country prefix.
   - `path`: reuse the seven positions from Egypt and New Zealand (they are already tested at every size).
   - `missions`: five, ids `m1 m2 m3 m4 boss`, each with `name, icon, sticker, intro {text, say}, rounds`.
   - `gates`: `v1` after `m1` and `m2` gives one video; `v2` after `boss` offers a choice of three.
   - `souvenirs`: eight, ids starting with the first two letters of the country id, each unlocked by a mission. Give one that moves in real life a `move`, and a hand-drawn animal a `head` (see "Her home"). `themes`: one room colour unlocked by `boss`, with its hat and drifting effect added to `THEME_LOOK` in `065-room.js`.
   - `thing`: the icon counted in small sums and sharing questions. `boat`: the word used in turn questions.
   - **The spine** (every country from Greece on): one body system added to `ATLAS` with a naming round, a lab, a bank of questions and a `point` round; a chemistry mission with `{ act: 'elements' }`, a chemistry lab, and `{ act: 'elements', part: 'group' }`; and the race (`{ act: 'race', … }`), which no longer has to be in the country's `ladders`.
3. A round is `{ skill: 'id' }`, `{ skill: '@review', or: 'fallback' }` or `{ act: 'place' | 'sort' | 'match' | 'order' | 'meet' | 'predict' | 'findmap' | 'build' | 'code' | 'weave' | 'pixel' | 'fold' | 'beat' | 'race' | 'sieve' | 'elements' | 'point', ... }`. A `fold` round is a paper model folded one fold at a time: each fold gives its fold line, the corner that moves, other corners to choose from, and the picture before and after (see the origami dog in `076-japan.js`). `test_skills.mjs` checks that every fold really moves its corner.
4. Facts to learn go in a bank: `bankSkill(id, name, strand, ideas, '<country id>')`. Each idea needs a picture, a one-line reason, and two ways of asking with three options each (the right one first). Adding ideas to an existing skill (for example `scithink`) with a new tag keeps one row on the grown-ups page while each country asks only its own.
5. Words in another language: `wordSkill(id, name, langCode, words)` plus a `meet` round. If no device has a voice for the language (te reo Māori), add its code to `REAL_ONLY` in `01-core.js` and give the country a `voices: { lang, label, words, groups, means }` entry: the words are then spoken only from real recordings and are shown, not spoken, until one exists. Tony records them himself in the recording studio on the grown-ups page (one word at a time: Record, Listen, Keep); his recording always replaces a built-in one. Sound files or a saved `wonderworld-voices.json` put in `voices/` are built in by `build.mjs` so every device has them. Never substitute another language's voice, and inside a spoken sentence use `{ t, lang }` (silent without a recording) followed by the English meaning rather than letting the narrator say the word.
6. Things to count on a graph: `GRAPH_SETS.<id> = { noun, one, items: [{ name, art, say }] }`.
7. Hand-drawn pictures are `{ svg: '<svg…>' }` and can be used anywhere an icon name can. Icon names come from Fluent Emoji Flat; the build fails on a name that does not exist.
8. Every video ID must be checked before it goes in. Use `https://noembed.com/embed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D<ID>`: it returns the title and channel and echoes the address it checked, or an error. Fetching YouTube's own `oembed` address through WebFetch more than once can return a cached answer for a different video, so do not rely on it.
9. Rebuild, then run every check above. Look at the screenshots: the checks cannot tell whether a drawing looks right.

## Rules for content

- Every on-screen prompt is 12 words or fewer and is spoken aloud.
- Answer labels are 4 words or fewer.
- Every assessed question has break-down steps whose last step lands on the answer, hands-on tools for each number step, and a one-line explanation that gives the idea, not the answer.
- Turns are clockwise or anticlockwise, never left or right.
- A cheer in a country's language (`cheers: ['Ka pai!']`) is only used inside that country.
- A sharing or counting question says what is shared and between whom ("Share 8 boomerangs between 4 people. How many does each person get?"). Things are named by `THING_NAMES` in `03-skills.js`, or a country's `things`.
- A bank question can carry its own closing line (`why`) and its own help picture (`hp`), for when the idea's shared line does not say enough ("Australia is in the south").
- Science is taught with the real mechanism in the real words (gas, pressure, magma, particles). A clue never says "something that…"; `test_skills.mjs` fails one that does. A new idea is first met in something she does (the geyser lab) and only then asked.
- Anything from a culture (a tukutuku panel, a pattern, a word) is researched and modelled on real examples, with its real name and meaning, and the sources noted beside it in the code.
- No activity is "read, then press Next".
- A bank of "thinking like a scientist" ideas looks back at the labs. Ask it only in a mission that comes after every lab it mentions.
- New class names must not collide with the shell's. `act`, `pb`, `cell` and `glow` are already styled, and each has caused a fault when reused. Give a lab's parts a prefix (`ecell`, `kpush`) and grep `app.css` first.
- A question about a shape names the shape ("How many corners does the hexagon have?").
- The picture beside a question is a clue to the question, never a picture of the answer. `test_skills.mjs` fails the build on both of these.
- A new fact or word is met in an activity (place, match, order, meet) before it is asked as a question. Levelled maths skills start easy instead and find her level.
- Words in another language are spelled correctly (macrons included) and said by the best voice the device has.
- Words taught in another language are common words whose English meanings do not sound alike (Tony, 8 October: balloon and tortoise were too close). Check every set of words as a set.
- Money uses the coins and notes the country really has (Brazil: a R$1 coin, R$2 and R$5 notes), and the fewest of them, the way a shopkeeper would. In Brazil she counts reais (`SKILLS.money.genBR`); everywhere else in New Zealand dollars and cents, written $ and c (`moneyNZ`, `V.money({ cur: 'nzd' })`: 10c, 20c, 50c, $1 and $2 coins; $5 to $100 notes). Tony, 11 October: "The official minor currency unit in New Zealand is the cent (represented as c). also, get rid of the R in front of the $".
- Help teaches an efficient strategy, not counting all: bridge through ten (16 − 7 is 16 − 6 − 1), count change up with real notes, lay dots out in tens.
- A picture matches the situation in the question (a pass on a football pitch, a goal facing the ball) and says where measuring starts.

## Countries in order, the bonus row, Welcome and About, the web address (29 October)

Tony, 29 October: "The over all structure of the game should only allow the kid to unlock each country as they pass each one. when they have finished the country, an icon should be clearly displayed on the map so it is easy to see. The coding and japanese icon at the top needs to be highlighted as a bonus section and clearly identify what it is." And: "considering friends will use this, we want to have them add their own names so it is personolised".

- **Order** (`ORDER` in `06-screens.js`): Egypt, New Zealand, Japan, Australia, Russia, Brazil, France, Greece, Canada, China. Only the first is open on a new device; each opens when every mission of the one before is done (`countryOpen`). A country already started stays open, so no saved progress is shut away; the test player sees every country. A locked flag is grey with a lock and says which country to finish first; a finished one has a gold ring and a trophy. A new country goes on the end of `ORDER`.
- **Bonus row** under the map's top bar, labelled: Japanese (once Japan is reached, `jpOpen`) and the Code Lab (always). Japanese lives in Japan: Japan's top bar has its own Bonus button (`COUNTRIES.japan.bonus`), and the passport's Japanese button says "Opens in Japan" until then.
- **Welcome guide** (`SCREENS.welcome`): runs when no name is saved: welcome, the player's name (`cleanName`: letters, spaces, hyphens, 16 at most), how it works. Shown again from the grown-ups page, which also changes the name. The game has no fixed child's name: every line uses the saved one, and the katakana station that taught one child's name now teaches ordinary words; the conversations still write each player's name in katakana where it can be (`jpName`).
- **About** (`SCREENS.about`): from the title, the Welcome guide and the grown-ups page.
- **Web address** (`node tools/build.mjs --public` → `docs/`): the same game plus a manifest, icons and a service worker (`tools/sw.js`) so it installs as a phone app and plays offline. It takes recordings only from `voices-public/`, never from `voices/` (home-use recordings, such as the Te Aka dictionary clips, stay off the internet). The safe-area insets keep it clear of a phone's notch and home bar.

## Two ways to open the game

- Double-click `WonderWorld2.html`: works everywhere, but YouTube will not play inside a page opened as a file, so reward videos open in a YouTube tab.
- Double-click `Play WonderWorld.cmd` (Windows): serves the same file at `http://localhost:8777` to this computer only and opens it in Microsoft Edge, so videos can play inside the game and Edge's natural voices are available. Progress is stored per address, so move it across once with the backup code on the grown-ups page.

Voices depend on the browser, not the game. Google Chrome on Windows has no Arabic voice, so Egypt's words are sounded out by the English voice there; Edge has Arabic, Japanese and Russian voices when online. The grown-ups page names the browser, each language's voice and how many voices the device is offering. `Speech.native()` asks the browser for its voice list again whenever a language's voice is not found, because browsers load the list late.

## Credits

Icons: Microsoft Fluent Emoji (MIT). Flags: circle-flags (MIT). Map shapes: Natural Earth (public domain). Typeface: Fredoka (Open Font Licence). Hiragana typeface: Klee One by Fontworks (SIL Open Font License 1.1). Hiragana stroke order and paths: KanjiVG by Ulrich Apel (kanjivg.tagaini.net, Creative Commons Attribution-Share Alike 3.0).
