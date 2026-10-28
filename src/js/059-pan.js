/* ===== a picture bigger than the screen that she can move around: the world map, and every part of her home.
   One finger (or the mouse) drags it. Two fingers pinch it bigger and smaller. The mouse wheel zooms too.
   The + and − buttons and the arrows at the edges do the same for anyone who does not find the gestures.
   The stage is laid out at its real size (st.w wide, st.w * ratio high) and moved with a transform, so pictures stay sharp and whatever is inside can be sized from it.
   o.ratio      height of the stage / its width
   o.limits     (vw, vh) => { min, max, start, pad: [left, top, right, bottom] kept clear for bars, ext: [l, t, r, b] of room around the stage that may also be shown,
                bars: [top, bottom] where the buttons and arrows go if that is not the same as pad }
   o.skip       target => true when a press on that target is not ours (a thing in a room is dragged, not the room)
   o.on         (st, zoomed) => after every move; zoomed is true when the size changed ===== */
const PZ_ICON = sign => '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M26 26l9 9" stroke="#1B2A4E" stroke-width="5" stroke-linecap="round"/><circle cx="17" cy="17" r="11.500" fill="#DFF3FF" stroke="#1B2A4E" stroke-width="3.500"/><path d="' + (sign > 0 ? 'M11.500 17h11M17 11.500v11' : 'M11.500 17h11') + '" stroke="#1B2A4E" stroke-width="3.500" stroke-linecap="round"/></svg>';
const PZ_ARROW = '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 9l12 11-12 11" fill="none" stroke="#1B2A4E" stroke-width="5.500" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function panZoom(view, stage, o) {
  const st = { w: 0, x: 0, y: 0 }, pts = new Map(); let lim = null, one = null, two = null, moved = false, blockUntil = 0, anim = 0, lastW = -1;
  const btn = (cls, label, html, fn) => h('button', { class: cls, 'aria-label': label, html, onclick: e => { e.stopPropagation(); sfx.tap(); fn(); } });
  const zin = btn('round pz-b', 'Bigger', PZ_ICON(1), () => zoomBy(1.6)), zout = btn('round pz-b', 'Smaller', PZ_ICON(-1), () => zoomBy(1 / 1.6));
  const ctl = h('div', { class: 'pz-ctl' }, zin, zout);
  const arrows = { l: btn('round pz-go l', 'Look left', PZ_ARROW, () => panBy(.6, 0)), r: btn('round pz-go r', 'Look right', PZ_ARROW, () => panBy(-.6, 0)),
    u: btn('round pz-go u', 'Look up', PZ_ARROW, () => panBy(0, .6)), d: btn('round pz-go d', 'Look down', PZ_ARROW, () => panBy(0, -.6)) };
  const measure = () => { const r = view.getBoundingClientRect(), L = o.limits(view.clientWidth, view.clientHeight); lim = { vw: view.clientWidth, vh: view.clientHeight, l: r.left, t: r.top, min: L.min, max: Math.max(L.max, L.min), start: clamp(L.start, L.min, Math.max(L.max, L.min)), pad: L.pad || [0, 0, 0, 0], ext: L.ext || [0, 0, 0, 0] };
    const bars = L.bars || [lim.pad[1], lim.pad[3]], host = view.parentNode; if (host) { host.style.setProperty('--pz-t', bars[0] + 'px'); host.style.setProperty('--pz-b', bars[1] + 'px'); } };
  /* where the stage may sit along one side: lo..hi is the clear part of the screen; e0 and e1 are the room before and after the stage that may be shown */
  const range = (len, lo, hi, e0, e1) => { const span = hi - lo, full = len + e0 + e1; if (full <= span) { const c = lo + (span - full) / 2 + e0; return [c, c]; } return [hi - len - e1, lo + e0]; };
  const ranges = () => { const hh = st.w * o.ratio; return { x: range(st.w, lim.pad[0], lim.vw - lim.pad[2], lim.ext[0], lim.ext[2]), y: range(hh, lim.pad[1], lim.vh - lim.pad[3], lim.ext[1], lim.ext[3]) }; };
  const apply = () => {
    st.w = clamp(st.w, lim.min, lim.max); const R = ranges(); st.x = clamp(st.x, R.x[0], R.x[1]); st.y = clamp(st.y, R.y[0], R.y[1]);
    const zoomed = Math.abs(st.w - lastW) > .01; lastW = st.w;
    if (zoomed) { stage.style.width = st.w + 'px'; stage.style.height = (st.w * o.ratio) + 'px'; }
    stage.style.transform = 'translate3d(' + st.x.toFixed(2) + 'px,' + st.y.toFixed(2) + 'px,0)';
    arrows.l.classList.toggle('on', st.x < R.x[1] - 6); arrows.r.classList.toggle('on', st.x > R.x[0] + 6); arrows.u.classList.toggle('on', st.y < R.y[1] - 6); arrows.d.classList.toggle('on', st.y > R.y[0] + 6);
    zin.classList.toggle('off', st.w >= lim.max - .5); zout.classList.toggle('off', st.w <= lim.min + .5);
    if (o.on) o.on(st, zoomed);
  };
  /* make the stage w wide, keeping the point of it that is under (cx, cy) on the screen where it is */
  const zoomTo = (w, cx, cy) => { w = clamp(w, lim.min, lim.max); const fx = (cx - st.x) / st.w, fy = (cy - st.y) / (st.w * o.ratio); st.w = w; st.x = cx - fx * w; st.y = cy - fy * w * o.ratio; apply(); };
  const mid = () => [(lim.pad[0] + lim.vw - lim.pad[2]) / 2, (lim.pad[1] + lim.vh - lim.pad[3]) / 2];
  const glide = (to, ms) => {       /* move smoothly to { w, x, y } */
    cancelAnimationFrame(anim); const from = { w: st.w, x: st.x, y: st.y }, t0 = performance.now();
    if (W.fast || !ms) { st.w = to.w; st.x = to.x; st.y = to.y; apply(); return; }
    const step = now => { const k = clamp((now - t0) / ms, 0, 1), e = 1 - Math.pow(1 - k, 3); st.w = from.w + (to.w - from.w) * e; st.x = from.x + (to.x - from.x) * e; st.y = from.y + (to.y - from.y) * e; apply(); if (k < 1 && view.isConnected) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  };
  const zoomBy = f => { const c = mid(), w = clamp(st.w * f, lim.min, lim.max), fx = (c[0] - st.x) / st.w, fy = (c[1] - st.y) / (st.w * o.ratio); glide({ w, x: c[0] - fx * w, y: c[1] - fy * w * o.ratio }, 220); };
  const panBy = (fx, fy) => glide({ w: st.w, x: st.x + fx * (lim.vw - lim.pad[0] - lim.pad[2]), y: st.y + fy * (lim.vh - lim.pad[1] - lim.pad[3]) }, 260);
  /* put the point (fx, fy) of the stage, as fractions of it, in the middle of the clear part of the screen */
  const focus = (fx, fy, w, ms) => { const c = mid(); w = clamp(w || st.w, lim.min, lim.max); glide({ w, x: c[0] - fx * w, y: c[1] - fy * w * o.ratio }, ms || 0); };
  const spot = () => { const c = mid(); return { x: (c[0] - st.x) / st.w * 100, y: (c[1] - st.y) / (st.w * o.ratio) * 100 }; };
  const reset = (fx, fy) => { cancelAnimationFrame(anim); measure(); st.w = lim.start; lastW = -1; focus(fx == null ? .5 : fx, fy == null ? .5 : fy); };

  const at = e => ({ x: e.clientX - lim.l, y: e.clientY - lim.t });
  const startOne = () => { const p = pts.values().next().value; one = { x: p.x, y: p.y, sx: st.x, sy: st.y }; two = null; };
  const startTwo = () => { const [a, b] = [...pts.values()]; two = { d: Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)), w: st.w, fx: ((a.x + b.x) / 2 - st.x) / st.w, fy: ((a.y + b.y) / 2 - st.y) / (st.w * o.ratio) }; one = null; };
  const move = e => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, at(e));
    if (two && pts.size >= 2) { const [a, b] = [...pts.values()], w = clamp(two.w * Math.hypot(a.x - b.x, a.y - b.y) / two.d, lim.min, lim.max); moved = true; st.w = w; st.x = (a.x + b.x) / 2 - two.fx * w; st.y = (a.y + b.y) / 2 - two.fy * w * o.ratio; apply(); return; }
    if (!one) return; const p = pts.get(e.pointerId), dx = p.x - one.x, dy = p.y - one.y;
    if (!moved && Math.hypot(dx, dy) < 8) return;
    if (!moved) { moved = true; view.classList.add('pz-drag'); }
    st.x = one.sx + dx; st.y = one.sy + dy; apply();
  };
  const up = e => {
    if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId);
    if (pts.size === 1) startOne();
    if (!pts.size) { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); view.classList.remove('pz-drag'); if (moved) blockUntil = performance.now() + 350; one = two = null; }
  };
  view.addEventListener('pointerdown', e => {
    if (e.button > 0 || (o.skip && o.skip(e.target))) return;
    cancelAnimationFrame(anim); measure();
    if (!pts.size) { moved = false; window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up); }
    pts.set(e.pointerId, at(e)); if (pts.size === 1) startOne(); else if (pts.size === 2) startTwo();
  });
  /* a drag that began on a flag must not also count as a tap on it */
  view.addEventListener('click', e => { if (performance.now() < blockUntil) { e.stopPropagation(); e.preventDefault(); } }, true);
  view.addEventListener('wheel', e => { e.preventDefault(); cancelAnimationFrame(anim); measure(); const p = at(e); zoomTo(st.w * (e.deltaY < 0 ? 1.15 : 1 / 1.15), p.x, p.y); }, { passive: false });
  /* the screen turned or changed size: keep looking at the same place */
  const resized = () => { if (!view.isConnected) { window.removeEventListener('resize', resized); return; } const s = spot(), wasStart = Math.abs(st.w - lim.start) < 1, tall = lim.vh > lim.vw; measure(); if (wasStart || tall !== (lim.vh > lim.vw)) st.w = lim.start; lastW = -1; focus(s.x / 100, s.y / 100); };
  window.addEventListener('resize', resized);
  return { st, ctl, arrows, reset, focus, spot, zoomBy, panBy, zoomTo, apply: () => { measure(); apply(); }, lim: () => lim, ranges, more: () => { const R = ranges(); return R.x[1] - R.x[0] > 6 || R.y[1] - R.y[0] > 6; },
    nudge: (dx, dy) => { const x0 = st.x, y0 = st.y; st.x += dx; st.y += dy; apply(); return [st.x - x0, st.y - y0]; } };
}
