/* ===== start ===== */
loadState();
W.S = () => S; W.go = go; W.SKILLS = SKILLS; W.COUNTRIES = COUNTRIES; W.reset = () => { S = JSON.parse(JSON.stringify(DEF)); S.imported = true; S.name = 'Kai'; S.welcomed = true; saveState(); };   /* tests start past the Welcome guide, with a name */
W.findThing = findThing; W.say = (t, o) => Speech.say(t, o); W.clipOf = (l, w) => Speech.clip(l, w); W.cinema = cinema; W.videoWon = videoWon; W.art = art; W.setPlayer = setPlayer; W.save = saveState; W.who = () => WHO; W.guide = kiwi; W.clearSkill = clearSkill; W.resetCountry = resetCountry; window.__ww = W;
SCREENS.title();
