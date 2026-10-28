/* ===== visuals: every maths picture is drawn here as SVG so it scales to any screen ===== */
const V = {};
V.put = (el, vbw, vbh, inner) => { el.innerHTML = '<svg class="viz" viewBox="0 0 ' + vbw + ' ' + vbh + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Fredoka,sans-serif" font-weight="700">' + inner + '</svg>'; };
const INK = '#1B2A4E';
function stone(x, y, w, h, o) {
  o = o || {};
  const top = o.hi ? '#FFD95E' : o.alt ? '#8FD9E3' : '#F6CF87', bot = o.hi ? '#E9A416' : o.alt ? '#3FA9B8' : '#D79C4D';
  const r = Math.min(w, h) * .16;
  return '<g opacity="' + (o.dim ? .22 : 1) + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + bot + '"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h * .78) + '" rx="' + r + '" fill="' + top + '"/>' +
    (o.n != null ? '<text x="' + (x + w / 2) + '" y="' + (y + h * .6) + '" font-size="' + (h * .5) + '" text-anchor="middle" fill="' + INK + '">' + o.n + '</text>' : '') + '</g>';
}
/* rows x cols of stone blocks. o: hiRow, dimOthers, nums, totals (how many row totals to show), rowTags, split (first column of the "ones" part), part ('tens'|'ones'), rowsOn (only the first n rows count; the rest fade) */
V.blocks = (el, r, c, o) => {
  o = o || {};
  const small = c > 10, bw = small ? 18 : 40, bh = small ? 18 : 30, g = small ? 2 : 5, tg = small ? 8 : 0;
  const colX = j => 44 + j * (bw + g) + (small ? Math.floor(j / 10) * tg : 0);
  const Wd = colX(c - 1) + bw + 64, Hd = r * (bh + g) + 16;
  let s = '';
  for (let i = 0; i < r; i++) {
    const y = 8 + i * (bh + g);
    for (let j = 0; j < c; j++) {
      const inOnes = o.split != null && j >= o.split;
      let dim = false, hi = false;
      if (o.hiRow != null && o.hiRow >= 0) { hi = i === o.hiRow; dim = o.dimOthers && !hi; }
      if (o.part === 'tens') dim = inOnes; if (o.part === 'ones') dim = !inOnes;
      if (o.rowsOn != null) { dim = i >= o.rowsOn; hi = !dim && o.rowsHi; }
      s += stone(colX(j), y, bw, bh, { hi, dim, alt: inOnes, n: (o.nums && (o.hiRow == null || i === o.hiRow)) ? (o.hiRow == null ? i * c + j + 1 : j + 1) : null });
    }
    if (o.rowTags) s += '<circle cx="20" cy="' + (y + bh / 2) + '" r="' + (o.rowTags === 'dots' ? 8 : 13) + '" fill="#8B7BEA"/>' + (o.rowTags === 'dots' ? '' : '<text x="20" y="' + (y + bh / 2 + 6) + '" font-size="17" text-anchor="middle" fill="#fff">' + (i + 1) + '</text>');
    if (o.totals != null && (o.rowsOn == null || i < o.rowsOn)) {
      const shown = i < o.totals;
      s += '<text x="' + (colX(c - 1) + bw + 10) + '" y="' + (y + bh * .7) + '" font-size="' + (small ? 15 : 22) + '" fill="' + (shown ? '#6453C9' : '#C7C2EA') + '">' + (shown ? (i + 1) * c : '?') + '</text>';
    }
  }
  V.put(el, Wd, Hd, s);
};
/* base-ten blocks for a (op) b */
V.baseTen = (el, a, b, op, o) => {
  o = o || {};
  const draw = (n, x0) => {
    let s = '', x = x0; const hN = Math.floor(n / 100), t = Math.floor(n % 100 / 10), u = n % 10;
    for (let i = 0; i < hN; i++) { s += '<rect x="' + x + '" y="' + (20 + (i % 2) * 6) + '" width="46" height="46" rx="5" fill="#8FD9E3" stroke="#3FA9B8" stroke-width="2"/><text x="' + (x + 23) + '" y="' + (50 + (i % 2) * 6) + '" font-size="15" text-anchor="middle" fill="' + INK + '">100</text>'; x += 52; }
    for (let i = 0; i < t; i++) { s += '<rect x="' + x + '" y="18" width="11" height="56" rx="3" fill="#F6CF87" stroke="#D79C4D" stroke-width="1.5"/>'; x += 14; }
    if (t) x += 6;
    for (let i = 0; i < u; i++) s += '<rect x="' + (x + (i % 3) * 14) + '" y="' + (18 + Math.floor(i / 3) * 14 + 14) + '" width="11" height="11" rx="2.5" fill="#FF9E8E" stroke="#DB5546" stroke-width="1.2"/>';
    if (u) x += Math.min(u, 3) * 14;
    return { s, w: Math.max(x - x0, 40) };
  };
  const A = draw(a, 14), sx = 14 + A.w + 14, B = draw(b, sx + 44);
  const Wd = Math.max(sx + 44 + B.w + 14, 300);
  let s = A.s + '<text x="' + (sx + 20) + '" y="60" font-size="40" text-anchor="middle" fill="' + INK + '">' + op + '</text>' + B.s;
  s += '<text x="' + (Wd / 2) + '" y="128" font-size="44" text-anchor="middle" fill="' + INK + '">' + (o.eq || (a + ' ' + op + ' ' + b + ' = ?')) + '</text>';
  V.put(el, Wd, 146, s);
};
/* an equation card on its own (big numbers, missing-number sums) */
V.equation = (el, text) => { el.innerHTML = ''; el.append(h('div', { class: 'bigtext' }, text)); };
/* small-number picture story: a icons (+ b more) or a icons with b crossed out. o.nums numbers them */
V.things = (el, icon, a, b, op, o) => {
  o = o || {}; el.innerHTML = '';
  const grp = (n, from, crossFrom) => { const g = h('div', { class: 'grp' }); for (let i = 0; i < n; i++) { const x = crossFrom != null && i >= crossFrom; g.append(h('div', { class: 'cell' + (x ? ' x' : '') }, ic(icon), (o.nums && !x) ? h('b', null, from + i + 1) : null)); } return g; };
  const w = h('div', { class: 'things' });
  if (op === '+') w.append(grp(a, 0), h('span', null, '+'), grp(b, a));
  else w.append(grp(a, 0, a - b));
  el.append(w);
};
/* number line with hops. hops: [{from,to,label}] */
/* hide: values on the line to show as "?" (the landing point she is working out) */
V.line = (el, lo, hi, hops, marks, hide) => {
  hide = hide || [];
  const X = v => 30 + (v - lo) / (hi - lo) * 440; let s = '<line x1="20" y1="100" x2="480" y2="100" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
  const pts = []; (hops || []).forEach(p => { pts.push(p.from, p.to); });
  marks = Array.from(new Set((marks || []).concat(pts))).filter(m => pts.includes(m) || !pts.some(q => Math.abs(q - m) / (hi - lo) < .09));
  marks.sort((a, b) => a - b); let lastX = -99, low = false;
  marks.forEach(m => { const x = X(m); low = (x - lastX < 34) ? !low : false; lastX = x; s += '<line x1="' + x + '" y1="90" x2="' + x + '" y2="110" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      (hide.includes(m) ? '<circle cx="' + x + '" cy="' + (low ? 154 : 130) + '" r="15" fill="#FFC83D" stroke="#E99A16" stroke-width="3"/><text x="' + x + '" y="' + (low ? 162 : 138) + '" font-size="22" text-anchor="middle" fill="' + INK + '">?</text>'
        : '<text x="' + x + '" y="' + (low ? 162 : 138) + '" font-size="24" text-anchor="middle" fill="' + INK + '">' + m + '</text>'); });
  (hops || []).forEach((p, i) => { const x1 = X(p.from), x2 = X(p.to), mx = (x1 + x2) / 2, c = i % 2 ? '#19A7B8' : '#8B7BEA';
    s += '<path d="M' + x1 + ' 92 Q' + mx + ' 20 ' + x2 + ' 92" fill="none" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/><text x="' + mx + '" y="40" font-size="24" text-anchor="middle" fill="' + c + '">' + p.label + '</text>'; });
  V.put(el, 500, 172, s);
};
/* number sequence on stepping stones; null = the "?" stone. jumps: labels above the gaps (null to hide) */
V.seq = (el, nums, jumps, hi) => {
  const n = nums.length, gap = 92, Wd = 40 + n * gap; let s = '';
  for (let i = 0; i < n - 1; i++) {
    const x1 = 60 + i * gap, x2 = x1 + gap, lab = jumps && jumps[i];
    if (lab != null) { const c = hi === i ? '#8B7BEA' : '#19A7B8';
      s += '<path d="M' + x1 + ' 58 Q' + ((x1 + x2) / 2) + ' 8 ' + x2 + ' 58" fill="none" stroke="' + c + '" stroke-width="' + (hi === i ? 6 : 4) + '" stroke-linecap="round"/><text x="' + ((x1 + x2) / 2) + '" y="26" font-size="22" text-anchor="middle" fill="' + c + '">' + lab + '</text>'; }
  }
  nums.forEach((v, i) => { const x = 60 + i * gap, q = v == null;
    s += '<ellipse cx="' + x + '" cy="104" rx="38" ry="9" fill="rgba(27,42,78,.12)"/><circle cx="' + x + '" cy="84" r="34" fill="' + (q ? '#FFC83D' : '#F6CF87') + '" stroke="' + (q ? '#E99A16' : '#D79C4D') + '" stroke-width="4"/>' +
      '<text x="' + x + '" y="' + (q ? 97 : 94) + '" font-size="' + (String(v).length > 2 ? 24 : 30) + '" text-anchor="middle" fill="' + INK + '">' + (q ? '?' : v) + '</text>'; });
  V.put(el, Wd, 124, s);
};
/* shape path helpers (used for stage pictures and for answer buttons) */
V.shapeSvg = (kind, color) => {
  const f = color || '#19A7B8', st = ' fill="' + f + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"';
  const poly = n => { let p = ''; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n + (n === 4 ? Math.PI / 4 : 0); p += (50 + 40 * Math.cos(a)).toFixed(1) + ',' + (52 + 40 * Math.sin(a)).toFixed(1) + ' '; } return '<polygon points="' + p + '"' + st + '/>'; };
  const m = { triangle: poly(3), square: poly(4), pentagon: poly(5), hexagon: poly(6), octagon: poly(8), circle: '<circle cx="50" cy="52" r="38"' + st + '/>', rectangle: '<rect x="8" y="28" width="84" height="48" rx="2"' + st + '/>' };
  return '<svg viewBox="0 0 100 104" xmlns="http://www.w3.org/2000/svg">' + m[kind] + '</svg>';
};
/* a regular polygon with sides or corners counted off. lit = how many are numbered */
const polyPts = n => { const P = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n + (n === 4 ? Math.PI / 4 : 0); P.push([150 + 100 * Math.cos(a), 125 + 100 * Math.sin(a)]); } return P; };
/* where to tap for each side (its middle) or corner, as fractions of the picture */
V.polySpots = (n, mode) => { const P = polyPts(n); return P.map((a, i) => { const b = P[(i + 1) % n], x = mode === 'sides' ? (a[0] + b[0]) / 2 : a[0], y = mode === 'sides' ? (a[1] + b[1]) / 2 : a[1]; return [x / 300, y / 250]; }); };
/* lit = how many are counted off; marks = which ones (a list of indexes, in the order tapped); hideLast shows "?" on the last one */
V.poly = (el, n, mode, lit, marks, hideLast) => {
  const P = polyPts(n), order = marks || Array.from({ length: lit || 0 }, (_, i) => i), tag = {}; order.forEach((ix, k) => { tag[ix] = (hideLast && k === order.length - 1) ? '?' : k + 1; });
  let s = '<polygon points="' + P.map(p => p.join(',')).join(' ') + '" fill="#BDEEF2" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
  for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], on = tag[i] != null, col = tag[i] === '?' ? '#E99A16' : '#8B7BEA';
    if (mode === 'sides') { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; if (on) s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + col + '" stroke-width="9" stroke-linecap="round"/><circle cx="' + mx + '" cy="' + my + '" r="16" fill="' + col + '"/><text x="' + mx + '" y="' + (my + 7) + '" font-size="20" text-anchor="middle" fill="#fff">' + tag[i] + '</text>'; }
    if (mode === 'corners') s += '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="' + (on ? 17 : 9) + '" fill="' + (on ? col : '#FF7A6B') + '"/>' + (on ? '<text x="' + a[0] + '" y="' + (a[1] + 7) + '" font-size="20" text-anchor="middle" fill="#fff">' + tag[i] + '</text>' : '');
  }
  V.put(el, 300, 250, s);
};
/* unit-square grid shapes. cells: list of [x,y,group]; labels: [{x,y,t}] ; o.hi group to highlight, o.dashed [w,h] outline, o.tri [w,h] */
V.grid = (el, w, hgt, o) => {
  o = o || {}; const u = 40, ox = 50, oy = 30; let s = '';
  const cells = o.cells || (() => { const c = []; for (let y = 0; y < hgt; y++) for (let x = 0; x < w; x++) c.push([x, y, 0]); return c; })();
  cells.forEach(c => { const dim = o.hi != null && c[2] !== o.hi, hiRow = o.hiRow != null && c[1] === o.hiRow;
    s += '<rect x="' + (ox + c[0] * u) + '" y="' + (oy + c[1] * u) + '" width="' + u + '" height="' + u + '" fill="' + (hiRow ? '#FFD95E' : c[2] ? '#FFC4BA' : '#BDEEF2') + '" stroke="' + (o.plain ? 'none' : '#fff') + '" stroke-width="3" opacity="' + (dim ? .25 : 1) + '"/>'; });
  if (o.outline) s += '<path d="' + o.outline.map((p, i) => (i ? 'L' : 'M') + (ox + p[0] * u) + ' ' + (oy + p[1] * u)).join(' ') + 'Z" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>';
  if (o.tri) { s += '<rect x="' + ox + '" y="' + oy + '" width="' + (w * u) + '" height="' + (hgt * u) + '" fill="none" stroke="' + INK + '" stroke-width="3" stroke-dasharray="8 8" opacity="' + (o.showRect ? 1 : .35) + '"/><polygon points="' + ox + ',' + (oy + hgt * u) + ' ' + (ox + w * u) + ',' + (oy + hgt * u) + ' ' + ox + ',' + oy + '" fill="#8B7BEA" opacity=".75" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>'; }
  (o.labels || []).forEach(l => { s += '<text x="' + (ox + l.x * u) + '" y="' + (oy + l.y * u + 9) + '" font-size="26" text-anchor="middle" fill="' + (l.c || INK) + '">' + l.t + '</text>'; });
  V.put(el, ox * 2 + w * u, oy * 2 + hgt * u, s);
};
V.rectOutline = (w, hgt) => [[0, 0], [w, 0], [w, hgt], [0, hgt]];
V.sideLabels = (w, hgt, which) => { const L = []; if (!which || which.w) { L.push({ x: w / 2, y: -.35, t: w }); L.push({ x: w / 2, y: hgt + .45, t: w, c: which && which.w ? '#6453C9' : INK }); } if (!which || which.h) { L.push({ x: -.5, y: hgt / 2, t: hgt }); L.push({ x: w + .5, y: hgt / 2, t: hgt }); } return L; };

/* ---------- pictures inside pictures: an icon name or a hand-drawn {svg} placed at x,y ---------- */
V.pic = (a, x, y, w, hgt) => {
  hgt = hgt || w;
  if (a && a.svg) return a.svg.replace('<svg ', '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '" ');
  return '<image href="' + icUri(a) + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '"/>';
};

/* ---------- fractions ---------- */
const FRAC_NAME = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
const NUM_WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const fracWord = (k, d) => NUM_WORD[k] + ' ' + FRAC_NAME[d][k === 1 ? 0 : 1];
/* a stacked fraction as SVG text, centred on x */
V.fracTxt = (x, y, k, d, size, col) => { const w = size * .62 * Math.max(String(k).length, String(d).length) + size * .2; col = col || INK;
  return '<text x="' + x + '" y="' + (y - size * .18) + '" font-size="' + size + '" text-anchor="middle" fill="' + col + '">' + k + '</text><line x1="' + (x - w / 2) + '" y1="' + y + '" x2="' + (x + w / 2) + '" y2="' + y + '" stroke="' + col + '" stroke-width="' + (size * .11) + '" stroke-linecap="round"/><text x="' + x + '" y="' + (y + size * .92) + '" font-size="' + size + '" text-anchor="middle" fill="' + col + '">' + d + '</text>'; };
/* one bar cut into parts. o: k (parts coloured), uneven (parts are not equal), x, y, w, h, label (text in coloured parts), nums (number every part), col */
let _fb = 0;
const fracBarSvg = (d, o) => {
  const x = o.x, y = o.y, w = o.w, hh = o.h, col = o.col || '#FFC83D', rx = hh * .16, id = 'fb' + (++_fb);
  const cuts = o.uneven ? { 2: [0, .3, 1], 3: [0, .2, .45, 1], 4: [0, .15, .3, .5, 1] }[d] : Array.from({ length: d + 1 }, (_, i) => i / d);
  let s = '<defs><clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="' + rx + '"/></clipPath></defs><g clip-path="url(#' + id + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="#fff"/>';
  for (let i = 0; i < d; i++) { const x0 = x + cuts[i] * w, pw = (cuts[i + 1] - cuts[i]) * w, fs = Math.min(hh * .5, pw * .55);
    if (i < (o.k || 0)) s += '<rect x="' + x0 + '" y="' + y + '" width="' + pw + '" height="' + hh + '" fill="' + col + '"/>';
    const lab = o.nums ? i + 1 : (i < (o.k || 0) ? o.label : (o.rest != null ? o.rest : null));
    if (lab != null) s += '<text x="' + (x0 + pw / 2) + '" y="' + (y + hh * .5 + fs * .36) + '" font-size="' + fs + '" text-anchor="middle" fill="' + (o.nums && i >= (o.numsTo || d) ? '#B9C0D2' : INK) + '">' + lab + '</text>'; }
  for (let i = 1; i < d; i++) s += '<line x1="' + (x + cuts[i] * w) + '" y1="' + y + '" x2="' + (x + cuts[i] * w) + '" y2="' + (y + hh) + '" stroke="' + INK + '" stroke-width="3"/>';
  return s + '</g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="' + rx + '" fill="none" stroke="' + INK + '" stroke-width="4"/>';
};
/* an answer button showing a cut bar */
V.fracOpt = (d, k, uneven, col) => '<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">' + fracBarSvg(d, { k, uneven, x: 4, y: 8, w: 92, h: 48, col }) + '</svg>';
/* a big fraction with its name */
V.fracBig = (el, k, d) => V.put(el, 300, 210, V.fracTxt(150, 96, k, d, 78) + '<text x="150" y="200" font-size="30" text-anchor="middle" fill="#0C7C8C">' + fracWord(k, d) + '</text>');
/* the bar model: "k/d of N". o: part (number or '?' written in the coloured parts), rest (written in the others), total (false hides the brace) */
V.fracOf = (el, k, d, N, o) => {
  o = o || {}; let s = o.bare ? '' : V.fracTxt(64, 58, k, d, 44) + '<text x="108" y="72" font-size="38" fill="' + INK + '">of ' + N + '</text>';
  s += '<path d="M24 136v-12h412v12" fill="none" stroke="#5A678A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="230" y="116" font-size="26" text-anchor="middle" fill="#5A678A">' + N + '</text>';
  s += fracBarSvg(d, { k, x: 24, y: 146, w: 412, h: 74, label: o.part != null ? o.part : '?', rest: o.rest });
  V.put(el, 460, 236, s);
};
/* two bars, one under the other, to show equal fractions. o.count numbers the small parts under the coloured part */
V.fracPair = (el, k1, d1, d2, o) => {
  o = o || {}; const m = k1 * d2 / d1, xe = 100 + 330 * k1 / d1;
  let s = V.fracTxt(50, 62, k1, d1, 36) + fracBarSvg(d1, { k: k1, x: 100, y: 28, w: 330, h: 68 });
  s += V.fracTxt(50, 174, o.done ? m : '?', d2, 36, '#6453C9') + fracBarSvg(d2, { k: o.done ? m : 0, x: 100, y: 140, w: 330, h: 68, nums: !!o.count, numsTo: m, col: '#C9C0FA' });
  if (o.count || o.done || o.line) s += '<line x1="' + xe + '" y1="18" x2="' + xe + '" y2="218" stroke="#8B7BEA" stroke-width="5" stroke-dasharray="3 11" stroke-linecap="round"/>';
  V.put(el, 450, 232, s);
};
/* N things, shared into d equal groups when o.split. o.nums counts the first group */
V.share = (el, icon, N, d, o) => {
  o = o || {}; el.innerHTML = ''; const w = h('div', { class: 'things share' });
  const grp = (n, nums, cls) => { const g = h('div', { class: 'grp' + (cls || '') }); for (let i = 0; i < n; i++) g.append(h('div', { class: 'cell' }, ic(icon), nums ? h('b', null, i + 1) : null)); return g; };
  /* o.people: the sharing is between people, so each person is drawn: beside the pile before it is shared, and on their own group after */
  const who = i => h('div', { class: 'who' }, ic(SHARERS[i % SHARERS.length]));
  if (o.split) for (let i = 0; i < d; i++) { const g = grp(N / d, o.nums && i === 0, i === 0 && o.nums ? ' hi' : ''); if (o.people) { g.classList.add('mine'); g.prepend(who(i)); } w.append(g); }
  else { w.append(grp(N)); if (o.people) w.append(h('div', { class: 'sharers' }, Array.from({ length: d }, (_, i) => who(i)))); }
  el.append(w);
};
const SHARERS = ['girl', 'boy', 'woman', 'man', 'child'];

/* ---------- a block graph. data: [{name, art, v}]. o: scale (what one block is worth), hi (bar to light up), nums (count that bar's blocks), noun ---------- */
V.bars = (el, data, o) => {
  o = o || {}; const sc = o.scale || 1, top = Math.max(...data.map(b => b.v)), rows = Math.max(top + 1, 5), bw = 64, bh = 30, gap = 22, ox = 54, oy = sc > 1 ? 44 : 14;
  const Wd = ox + data.length * (bw + gap) + 8, base = oy + rows * bh; let s = '';
  if (sc > 1) s += '<rect x="' + (Wd / 2 - 96) + '" y="6" width="26" height="20" rx="4" fill="#F6CF87" stroke="#D79C4D" stroke-width="2"/><text x="' + (Wd / 2 - 62) + '" y="24" font-size="20" fill="' + INK + '">= ' + sc + ' ' + (o.noun || 'things') + '</text>';
  for (let r = 0; r <= rows; r++) { const y = base - r * bh; s += '<line x1="' + (ox - 6) + '" y1="' + y + '" x2="' + (Wd - 4) + '" y2="' + y + '" stroke="' + (r ? '#E3E6EE' : INK) + '" stroke-width="' + (r ? 2 : 4) + '" stroke-linecap="round"/><text x="' + (ox - 12) + '" y="' + (y + 6) + '" font-size="17" text-anchor="end" fill="#5A678A" class="ax">' + (r * sc) + '</text>'; }
  data.forEach((b, i) => { const x = ox + gap / 2 + i * (bw + gap), lit = o.hi == null || o.hi === i || (Array.isArray(o.hi) && o.hi.includes(i));
    for (let k = 0; k < b.v; k++) s += stone(x, base - (k + 1) * bh + 2, bw, bh - 3, { hi: o.hi != null && lit, dim: !lit, n: (o.nums && lit) ? k + 1 : null });
    if (o.tops && lit) s += '<text x="' + (x + bw / 2) + '" y="' + (base - b.v * bh - 6) + '" font-size="22" text-anchor="middle" fill="#6453C9">' + (b.v * sc) + '</text>';
    s += '<g opacity="' + (lit ? 1 : .35) + '">' + V.pic(b.art, x + bw / 2 - 23, base + 6, 46) + '<text x="' + (x + bw / 2) + '" y="' + (base + 72) + '" font-size="19" text-anchor="middle" fill="' + INK + '">' + b.name + '</text></g>'; });
  V.put(el, Wd, base + 80, s);
};

/* ---------- compass and turns. Directions are numbered 0-7 clockwise from north in half-quarter steps ---------- */
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], DIR_NAME = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
const dirXY = (i, r) => { const a = i * Math.PI / 4; return [150 + r * Math.sin(a), 150 - r * Math.cos(a)]; };
/* o: show (which letters to print: list of direction numbers), eight (show the in-between points), face (where the waka points), was (where it pointed before, faint),
   arc {from, to, ccw, nums (number each step), unit (1 = half-quarter steps, 2 = quarter steps)}, ask (direction to mark with a ?) */
V.compass = (el, o) => {
  o = o || {}; let s = '<circle cx="150" cy="150" r="118" fill="#EAF7FA" stroke="' + INK + '" stroke-width="6"/><circle cx="150" cy="150" r="96" fill="#fff" stroke="#BDEEF2" stroke-width="3"/>';
  const show = o.show || [0, 2, 4, 6];
  for (let i = 0; i < 8; i++) { const main = i % 2 === 0; if (!main && !o.eight) continue;
    const a = dirXY(i, main ? 96 : 96), b = dirXY(i, main ? 78 : 86), t = dirXY(i, main ? 136 : 138);
    s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + INK + '" stroke-width="' + (main ? 6 : 4) + '" stroke-linecap="round"/>';
    if (o.goal === i) s += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="24" fill="#FFF0BF" stroke="#E99A16" stroke-width="3"/>';
    if (o.ask === i) s += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="17" fill="#FFC83D" stroke="#E99A16" stroke-width="3"/><text x="' + t[0] + '" y="' + (t[1] + 9) + '" font-size="24" text-anchor="middle" fill="' + INK + '">?</text>';
    else if (show.includes(i)) s += '<text x="' + t[0] + '" y="' + (t[1] + (main ? 11 : 8)) + '" font-size="' + (main ? 32 : 22) + '" text-anchor="middle" fill="' + (i === 0 ? '#DB5546' : INK) + '">' + DIRS[i] + '</text>'; }
  if (o.arc) { const A = o.arc, unit = A.unit || 2, n = ((A.ccw ? A.from - A.to : A.to - A.from) + 8) % 8 || 8, R = 58;
    const p0 = dirXY(A.from, R), p1 = dirXY(A.to, R), large = n > 4 ? 1 : 0;
    if (n === 8) s += '<circle cx="150" cy="150" r="' + R + '" fill="none" stroke="#8B7BEA" stroke-width="7" stroke-dasharray="2 12" stroke-linecap="round"/>';
    else s += '<path d="M' + p0[0] + ' ' + p0[1] + ' A' + R + ' ' + R + ' 0 ' + large + ' ' + (A.ccw ? 0 : 1) + ' ' + p1[0] + ' ' + p1[1] + '" fill="none" stroke="#8B7BEA" stroke-width="7" stroke-linecap="round"/>';
    const tip = dirXY(A.to, R), ang = A.to * 45 + (A.ccw ? -90 : 90);
    s += '<path d="M-11 -9L7 0L-11 9Z" fill="#8B7BEA" transform="translate(' + tip[0] + ' ' + tip[1] + ') rotate(' + (ang - 90) + ')"/>';
    if (A.nums || A.dots) for (let k = 1; k * unit <= n; k++) { const at = (A.from + (A.ccw ? -1 : 1) * (k * unit - unit / 2) + 16) % 8, q = dirXY(at, R); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (A.nums ? 14 : 9) + '" fill="#8B7BEA" stroke="#fff" stroke-width="3"/>' + (A.nums ? '<text x="' + q[0] + '" y="' + (q[1] + 7) + '" font-size="19" text-anchor="middle" fill="#fff">' + k + '</text>' : ''); } }
  const waka = (i, op) => '<g opacity="' + op + '" transform="rotate(' + (i * 45) + ' 150 150)"><path d="M150 62 L164 104 L158 104 L158 196 Q150 206 142 196 L142 104 L136 104Z" fill="#C9643B" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><circle cx="150" cy="150" r="9" fill="#FFC83D" stroke="' + INK + '" stroke-width="3"/></g>';
  if (o.was != null) s += waka(o.was, .22);
  if (o.face != null) s += waka(o.face, 1);
  /* a line under the compass: which way is clockwise (a little turning arrow, the way clock hands go), and any key such as "quarter turn = 90°" */
  if (o.spin || o.key) { const ccw = o.spin === 'ccw', txt = o.key || (ccw ? 'anticlockwise' : 'clockwise'), w = Math.min(292, 44 + txt.length * 11.5 + (o.spin ? 34 : 0)), x0 = 150 - w / 2;
    s += '<rect x="' + x0 + '" y="316" width="' + w + '" height="36" rx="18" fill="#EEEBFF"/>';
    if (o.spin) s += '<g transform="translate(' + (x0 + 24) + ' 334)' + (ccw ? ' scale(-1 1)' : '') + '"><path d="M-8 4A9 9 0 1 1 4 8" fill="none" stroke="#6453C9" stroke-width="4.500" stroke-linecap="round"/><path d="M-2 3 6 10 -3 15Z" fill="#6453C9"/></g>';
    s += '<text x="' + (150 + (o.spin ? 15 : 0)) + '" y="341" font-size="21" text-anchor="middle" fill="#6453C9">' + txt + '</text>'; }
  V.put(el, 332, (o.key || o.spin) ? 386 : 332, '<g transform="translate(16 16)">' + s + '</g>');
};
V.arrowSvg = (i, col) => '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(' + (i * 45) + ' 50 50)"><path d="M50 10 L80 46 H62 V90 H38 V46 H20Z" fill="' + (col || '#19A7B8') + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/></g></svg>';

/* ---------- an analogue clock. The numbers round the dial are marked "ax": reading the dial is the skill, like the axis of a graph.
   o: hi ('hr' | 'min': ring that hand), ghost (minute value where the long hand was, drawn faint), sector {from, to} (shade those minutes),
   dots {from, to} (a dot at each five-minute mark after "from", up to "to": one dot for each jump of 5), label (words under the dial), walk { from, by } (minutes; see HANDS.pic) ---------- */
const clockXY = (m, r, cx, cy) => { const a = m / 60 * 2 * Math.PI; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
const pad2 = n => (n < 10 ? '0' : '') + n, clockT = (hr, m) => hr + ':' + pad2(m);
function clockSvg(hr, min, o, cx, cy) {
  o = o || {}; const R = 116, f = n => n.toFixed(1); let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#fff" stroke="' + INK + '" stroke-width="7"/>';
  if (o.sector && o.sector.to > o.sector.from) { const a = clockXY(o.sector.from, R - 5, cx, cy), b = clockXY(o.sector.to, R - 5, cx, cy), big = o.sector.to - o.sector.from > 30 ? 1 : 0;
    s += '<path d="M' + cx + ' ' + cy + 'L' + f(a[0]) + ' ' + f(a[1]) + 'A' + (R - 5) + ' ' + (R - 5) + ' 0 ' + big + ' 1 ' + f(b[0]) + ' ' + f(b[1]) + 'Z" fill="#EEEBFF"/>'; }
  for (let i = 0; i < 60; i++) { const main = i % 5 === 0, a = clockXY(i, R - 6, cx, cy), b = clockXY(i, R - (main ? 19 : 12), cx, cy);
    s += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + (main ? INK : '#A9B1C6') + '" stroke-width="' + (main ? 4 : 2) + '" stroke-linecap="round"/>'; }
  const hand = (m, len, w, col, op) => { const p = clockXY(m, len, cx, cy), q = clockXY(m + 30, 14, cx, cy); return '<line x1="' + f(q[0]) + '" y1="' + f(q[1]) + '" x2="' + f(p[0]) + '" y2="' + f(p[1]) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + (op || 1) + '"/>'; };
  const hm = ((hr % 12) + min / 60) * 5;
  if (o.ghost != null) s += hand(o.ghost, 96, 7, '#19A7B8', .3);
  if (o.hi === 'hr') s += hand(hm, 62, 22, '#D6D0F5'); if (o.hi === 'min') s += hand(min, 96, 18, '#D6D0F5');
  s += hand(hm, 62, 12, '#C9643B') + hand(min, 96, 7, '#19A7B8') + '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + INK + '"/><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#FFC83D"/>';
  /* the numbers go on last, with a white edge, so a hand never hides the number it points at */
  for (let n = 1; n <= 12; n++) { const p = clockXY(n * 5, R - 39, cx, cy); s += '<text class="ax" x="' + f(p[0]) + '" y="' + f(p[1] + 9) + '" font-size="26" text-anchor="middle" fill="' + INK + '" stroke="#fff" stroke-width="6" stroke-linejoin="round" paint-order="stroke">' + n + '</text>'; }
  if (o.dots) for (let m = o.dots.from + 5; m <= o.dots.to; m += 5) { const p = clockXY(m - 2.5, R + 13, cx, cy); s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="8" fill="#8B7BEA" stroke="#fff" stroke-width="2.5"/>'; }
  if (o.label) s += '<text x="' + cx + '" y="' + (cy + R + 56) + '" font-size="30" text-anchor="middle" fill="#0C7C8C">' + o.label + '</text>';
  /* the hands-on walk round the dial: each tap on the clock puts a numbered counter on the next five-minute mark; the last is left as "?" */
  if (o.walk) { const k = o.walk, by = k.by || 5, lab = k.labels || [];
    for (let i = 1; i <= (k.done || 0); i++) { const p = clockXY(k.from + by * i, R + 14, cx, cy), last = lab[i - 1] === '?';
      s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="13.500" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + f(p[0]) + '" y="' + f(p[1] + 5.5) + '" font-size="' + (String(lab[i - 1]).length > 1 ? 14 : 16) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + lab[i - 1] + '</text>'; }
    if (k.live) s += '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="' + (R + 5) + '" fill="none" stroke="#8B7BEA" stroke-width="5" opacity=".5"/><circle class="hot" cx="' + cx + '" cy="' + cy + '" r="' + (R + 30) + '" fill="transparent"/>'; }
  return s;
}
V.clock = (el, hr, min, o) => V.put(el, 300, (o && o.label) ? 344 : 300, clockSvg(hr, min, o, 150, 150));
/* two clocks side by side: when the train leaves and when it arrives */
V.clocks = (el, a, b) => V.put(el, 640, 344, clockSvg(a[0], a[1], { label: 'Leaves' }, 150, 150) + clockSvg(b[0], b[1], { label: 'Arrives' }, 490, 150) +
  '<path d="M292 150h44" stroke="#8B7BEA" stroke-width="8" stroke-linecap="round"/><path d="M332 136l20 14-20 14z" fill="#8B7BEA"/>');
/* things laid out in groups of g, with any left over in a last group of their own. o.rest: 'hi' rings the left-overs */
V.groups = (el, icon, n, g, o) => {
  o = o || {}; el.innerHTML = ''; const w = h('div', { class: 'things share' }), full = Math.floor(n / g), rest = n - full * g;
  const grp = (k, cls) => { const d = h('div', { class: 'grp' + (cls || '') }); for (let i = 0; i < k; i++) d.append(h('div', { class: 'cell' }, ic(icon))); return d; };
  for (let i = 0; i < full; i++) w.append(grp(g));
  if (rest) w.append(grp(rest, o.rest === 'hi' ? ' hi' : ' loose'));
  el.append(w);
};

/* ---------- a map grid with coordinates: 0 is the bottom-left corner; things sit where the lines cross. Axis numbers are a scale to read (class "ax").
   o: w, h, pts [{x, y, art}], drop 'x' | 'y' (a dotted guide from the first thing to that axis), hiX (light up the upright line at x), walk { axis 'x' | 'y', at, from } (see HANDS.pic),
      seg [[x1, y1], [x2, y2]] (a dotted line between two places), move [x, y, dx, dy] (an arrow along, then up, ending in a ring) ---------- */
V.coordGrid = (el, o) => {
  const u = 44, ox = 62, top = 30, w = o.w, hgt = o.h, oy = top + hgt * u, X = x => ox + x * u, Y = y => oy - y * u; let s = '';
  s += '<rect x="' + ox + '" y="' + top + '" width="' + (w * u) + '" height="' + (hgt * u) + '" fill="#F3FBEA"/>';
  for (let x = 0; x <= w; x++) s += '<line x1="' + X(x) + '" y1="' + top + '" x2="' + X(x) + '" y2="' + oy + '" stroke="' + (x ? '#B9D6A0' : INK) + '" stroke-width="' + (x ? 2 : 4) + '" stroke-linecap="round"/><text class="ax" x="' + X(x) + '" y="' + (oy + 27) + '" font-size="22" text-anchor="middle" fill="' + INK + '">' + x + '</text>';
  for (let y = 0; y <= hgt; y++) s += '<line x1="' + ox + '" y1="' + Y(y) + '" x2="' + X(w) + '" y2="' + Y(y) + '" stroke="' + (y ? '#B9D6A0' : INK) + '" stroke-width="' + (y ? 2 : 4) + '" stroke-linecap="round"/>' + (y ? '<text class="ax" x="' + (ox - 12) + '" y="' + (Y(y) + 8) + '" font-size="22" text-anchor="end" fill="' + INK + '">' + y + '</text>' : '');
  s += '<text class="ax" x="' + X(w / 2) + '" y="' + (oy + 54) + '" font-size="19" text-anchor="middle" fill="#5A678A">along →</text><text class="ax" x="20" y="' + Y(hgt / 2) + '" font-size="19" text-anchor="middle" fill="#5A678A" transform="rotate(-90 20 ' + Y(hgt / 2) + ')">up →</text>';
  if (o.hiX != null) s += '<line x1="' + X(o.hiX) + '" y1="' + top + '" x2="' + X(o.hiX) + '" y2="' + oy + '" stroke="#FFC83D" stroke-width="9" stroke-linecap="round" opacity=".8"/>';
  const P = o.pts || [], dash = 'stroke="#8B7BEA" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round" fill="none"';
  if (o.drop && P[0]) s += o.drop === 'x' ? '<line x1="' + X(P[0].x) + '" y1="' + Y(P[0].y) + '" x2="' + X(P[0].x) + '" y2="' + oy + '" ' + dash + '/>' : '<line x1="' + X(P[0].x) + '" y1="' + Y(P[0].y) + '" x2="' + ox + '" y2="' + Y(P[0].y) + '" ' + dash + '/>';
  if (o.seg) s += '<line x1="' + X(o.seg[0][0]) + '" y1="' + Y(o.seg[0][1]) + '" x2="' + X(o.seg[1][0]) + '" y2="' + Y(o.seg[1][1]) + '" ' + dash + '/>';
  if (o.move) { const m = o.move, ax = X(m[0] + m[2]), ay = Y(m[1] + m[3]);
    s += '<path d="M' + X(m[0]) + ' ' + Y(m[1]) + 'H' + ax + 'V' + ay + '" stroke="#19A7B8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="' + ax + '" cy="' + ay + '" r="15" fill="#FFC83D" stroke="#E99A16" stroke-width="3"/><text x="' + ax + '" y="' + (ay + 8) + '" font-size="22" text-anchor="middle" fill="' + INK + '">?</text>'; }
  P.forEach(p => { s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="20" fill="#fff" stroke="' + INK + '" stroke-width="2.500"/>' + V.pic(p.art, X(p.x) - 15, Y(p.y) - 15, 30); });
  /* the hands-on walk: she taps each step along a line of the grid; a hop is drawn for each tap, numbered, and the last number is left as "?" */
  if (o.walk) { const k = o.walk, dir = k.dir || 1, at = k.at || 0, flat = k.axis === 'x', lab = k.labels || [], pt = v => flat ? [X(v), Y(at)] : [X(at), Y(v)];
    for (let i = 0; i < k.n; i++) { const a = pt(k.from + i * dir), b = pt(k.from + (i + 1) * dir), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (i < (k.done || 0)) { const last = lab[i] === '?';
        s += '<path d="M' + a[0] + ' ' + a[1] + 'Q' + (flat ? mx : mx + 30) + ' ' + (flat ? my - 30 : my) + ' ' + b[0] + ' ' + b[1] + '" stroke="#6453C9" stroke-width="4.500" fill="none" stroke-linecap="round"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="5.500" fill="#6453C9"/>' +
          '<circle cx="' + (flat ? mx : mx + 30) + '" cy="' + (flat ? my - 30 : my) + '" r="13" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + (flat ? mx : mx + 30) + '" y="' + ((flat ? my - 30 : my) + 6) + '" font-size="17" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + lab[i] + '</text>'; }
      else if (k.live) s += '<rect class="hot" x="' + (flat ? Math.min(a[0], b[0]) + 2 : a[0] - 34) + '" y="' + (flat ? a[1] - 34 : Math.min(a[1], b[1]) + 2) + '" width="' + (flat ? u - 4 : 68) + '" height="' + (flat ? 68 : u - 4) + '" rx="12" fill="#8B7BEA"/>'; } }
  V.put(el, X(w) + 30, oy + 66, s);
};

/* ---------- a thermometer to read. The numbers down the side are a scale (class "ax"); the red line stops at v.
   o: lo, hi, major (a number every so many degrees), minor (a small mark every so many), v, from (ring the mark to start counting from), cap (a word underneath), walk { from, by } (see HANDS.pic) ---------- */
function thermoSvg(cx, o) {
  const top = 30, bot = 262, Y = v => bot - (v - o.lo) / (o.hi - o.lo) * (bot - top); let s = '';
  s += '<rect x="' + (cx - 13) + '" y="' + (top - 14) + '" width="26" height="' + (bot - top + 40) + '" rx="13" fill="#fff" stroke="' + INK + '" stroke-width="4"/><circle cx="' + cx + '" cy="' + (bot + 34) + '" r="24" fill="#E5484D" stroke="' + INK + '" stroke-width="4"/>';
  if (o.v != null) s += '<rect x="' + (cx - 6) + '" y="' + Y(o.v) + '" width="12" height="' + (bot + 20 - Y(o.v)) + '" rx="3" fill="#E5484D"/>';
  for (let v = o.lo; v <= o.hi + 1e-9; v += o.minor) { const big = Math.round(v) % o.major === 0, y = Y(v);
    s += '<line x1="' + (cx - (big ? 34 : 26)) + '" y1="' + y + '" x2="' + (cx - 15) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="' + (big ? 3.5 : 2) + '" stroke-linecap="round"/>';
    if (big) s += '<text class="ax" x="' + (cx - 40) + '" y="' + (y + 8) + '" font-size="22" text-anchor="end" fill="' + (v < 0 ? '#2563C9' : INK) + '">' + (v < 0 ? '−' + (-v) : v) + '°</text>'; }
  if (o.lo < 0) s += '<line x1="' + (cx - 36) + '" y1="' + Y(0) + '" x2="' + (cx + 40) + '" y2="' + Y(0) + '" stroke="#2563C9" stroke-width="3" stroke-dasharray="6 6"/>' + ((o.cap || o.walk) ? '' : '<text class="ax" x="' + (cx + 44) + '" y="' + (Y(0) + 6) + '" font-size="17" fill="#2563C9">freezing</text>');
  if (o.from != null) s += '<circle cx="' + (cx - 25) + '" cy="' + Y(o.from) + '" r="13" fill="none" stroke="#8B7BEA" stroke-width="4"/>';
  if (o.cap) s += '<text x="' + cx + '" y="' + (bot + 86) + '" font-size="22" text-anchor="middle" fill="' + INK + '">' + o.cap + '</text>';
  /* the hands-on climb: each tap on the thermometer moves a marker one mark up (or down); the number beside it counts along, and the last is left as "?" */
  if (o.walk) { const k = o.walk, done = k.done || 0, lab = k.labels || [], y0 = Y(k.from), y1 = Y(k.from + k.by * k.n), x = cx + 27;
    s += '<rect' + (k.live ? ' class="pulse"' : '') + ' x="' + (cx + 18) + '" y="' + (Math.min(y0, y1) - 6) + '" width="18" height="' + (Math.abs(y1 - y0) + 12) + '" rx="9" fill="#8B7BEA" opacity=".22"/>';
    for (let i = 1; i <= done; i++) s += '<circle cx="' + x + '" cy="' + Y(k.from + k.by * i) + '" r="' + (i === done ? 7 : 3.5) + '" fill="#6453C9"/>';
    if (done) { const y = Y(k.from + k.by * done), last = lab[done - 1] === '?', wd = 20 + String(lab[done - 1]).length * 11;
      s += '<rect x="' + (cx + 40) + '" y="' + (y - 16) + '" width="' + wd + '" height="32" rx="16" fill="' + (last ? '#FFC83D' : '#6453C9') + '"/><text x="' + (cx + 40 + wd / 2) + '" y="' + (y + 8) + '" font-size="22" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + lab[done - 1] + '</text>'; }
    if (k.live) s += '<rect class="hot" x="' + (cx - 80) + '" y="0" width="190" height="330" fill="transparent"/>'; }
  return s;
}
V.thermo = (el, o) => V.put(el, o.lo < 0 ? 300 : 240, 330, thermoSvg(o.lo < 0 ? 130 : 150, o));
V.thermos = (el, a, b) => V.put(el, 440, 360, thermoSvg(140, a) + thermoSvg(350, b));

/* ---------- place-value counters on a chart: a column for thousands, hundreds, tens and ones, and a counter for each one of them. The digits are not printed: reading them is the skill.
   o: cols (how many columns, default just enough), hi (light up a column: 0 ones, 1 tens, 2 hundreds, 3 thousands), digits (print the digit under each column: for the "now you know" picture),
      ring [place, index] (ring one counter: the one just added or taken), big (the number written large above, with digit o.mark underlined),
      walk { order [[place, index]...] } (HANDS.pic: she taps the counters; each takes the next label, and the last is "?") ---------- */
const PLACE = [{ name: 'ones', v: 1, col: '#FF8E80' }, { name: 'tens', v: 10, col: '#FFC83D' }, { name: 'hundreds', v: 100, col: '#5CC8D6' }, { name: 'thousands', v: 1000, col: '#A99CF2' }];
V.placeChart = (el, n, o) => {
  o = o || {}; const digs = [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000) % 10], C = o.cols || (n >= 1000 ? 4 : n >= 100 ? 3 : 2);
  const cw = 108, top = o.big != null ? 64 : 8, X = p => 8 + (C - 1 - p) * cw, H0 = top + 34, rows = 5, pitch = 40, Hb = H0 + rows * pitch + 10, at = (p, i) => [X(p) + cw / 2 + (i % 2 ? 21 : -21), H0 + 26 + Math.floor(i / 2) * pitch];
  let s = '';
  if (o.big != null) { const str = String(o.big), fs = 44, w0 = str.length * 27; str.split('').forEach((ch, i) => { const x = (C * cw + 16) / 2 - w0 / 2 + i * 27 + 13, mark = o.mark != null && str.length - 1 - i === o.mark;
    s += (mark ? '<circle cx="' + x + '" cy="30" r="22" fill="#EEEBFF" stroke="#8B7BEA" stroke-width="3.500"/>' : '') + '<text class="ax" x="' + x + '" y="46" font-size="' + fs + '" text-anchor="middle" fill="' + INK + '">' + ch + '</text>'; }); }
  for (let p = C - 1; p >= 0; p--) { const x = X(p), hi = o.hi === p;
    s += '<rect x="' + (x + 3) + '" y="' + top + '" width="' + (cw - 6) + '" height="' + (Hb - top) + '" rx="12" fill="' + (hi ? '#FFF6D6' : '#fff') + '" stroke="' + (hi ? '#E9A416' : '#C9CEDA') + '" stroke-width="' + (hi ? 4 : 2.5) + '"/>' +
      '<rect x="' + (x + 3) + '" y="' + top + '" width="' + (cw - 6) + '" height="30" rx="12" fill="' + PLACE[p].col + '"/><text class="ax" x="' + (x + cw / 2) + '" y="' + (top + 21) + '" font-size="15.500" text-anchor="middle" fill="' + INK + '">' + PLACE[p].name + '</text>';
    for (let i = 0; i < digs[p]; i++) { const c = at(p, i); s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="17" fill="' + PLACE[p].col + '" stroke="' + INK + '" stroke-width="2"/><text class="ax" x="' + c[0] + '" y="' + (c[1] + (p === 3 ? 4 : 5)) + '" font-size="' + (p === 3 ? 10.5 : p === 2 ? 12.5 : 15) + '" text-anchor="middle" fill="' + INK + '">' + PLACE[p].v + '</text>'; }
    if (o.digits) s += '<text x="' + (x + cw / 2) + '" y="' + (Hb + 40) + '" font-size="40" text-anchor="middle" fill="#6453C9">' + digs[p] + '</text>'; }
  if (o.ring) { const c = at(o.ring[0], o.ring[1]); s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="22" fill="none" stroke="#8B7BEA" stroke-width="4" stroke-dasharray="5 5"/>'; }
  if (o.walk) { const k = o.walk, lab = k.labels || [], seq = k.seq || Array.from({ length: k.done || 0 }, (_, i) => i);
    if (k.live) s += '<rect class="hot" x="0" y="0" width="' + (C * cw + 16) + '" height="' + (Hb + 8) + '" fill="transparent"/>';    /* small counters on a phone: a tap anywhere counts the next one */
    k.order.forEach((pc, i) => { const c = at(pc[0], pc[1]), pos = seq.indexOf(i);
    if (pos >= 0) { const last = lab[pos] === '?', t = String(lab[pos]); s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="18" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + c[0] + '" y="' + (c[1] + (t.length > 3 ? 4 : 5.5)) + '" font-size="' + (t.length > 3 ? 11 : t.length > 2 ? 13 : 16) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; }
    else if (k.live) s += '<circle class="hot" data-i="' + i + '" cx="' + c[0] + '" cy="' + c[1] + '" r="21" fill="#6453C9"/>'; }); }
  V.put(el, C * cw + 16, Hb + (o.digits ? 52 : 8), s);
};
/* the counters of one column, in order; and every counter of a number, biggest place first */
V.placeOrder = (n, places) => { const out = []; (places || [3, 2, 1, 0]).forEach(p => { const d = Math.floor(n / PLACE[p].v) % 10; for (let i = 0; i < d; i++) out.push([p, i]); }); return out; };

/* ---------- a shape made of unit squares (a solar panel), for area and perimeter.
   o: w, h (squares across and down), grid (false hides the inside lines), faint (the inside lines are drawn faintly), dims [across, down] (words along two sides, when the lines are hidden),
      cells [[x, y]...] (the squares of the shape; default the whole w x h rectangle), hiRow, hiCol (light up one row or one column),
      rowsShown (only the first so many rows are drawn solid; the rest are outlines: for "how many rows make it?"),
      walk { mode 'cells' | 'edges' | 'rows', order } (HANDS.pic: she taps squares, edges round the outside, or whole rows) ---------- */
V.rectCells = (w, h) => { const out = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out.push([x, y]); return out; };
V.rectEdges = (w, h) => { const out = []; for (let x = 0; x < w; x++) out.push([x, 0, 't']); for (let y = 0; y < h; y++) out.push([w - 1, y, 'r']); for (let x = w - 1; x >= 0; x--) out.push([x, h - 1, 'b']); for (let y = h - 1; y >= 0; y--) out.push([0, y, 'l']); return out; };
V.gridShape = (el, o) => {
  const w = o.w, hgt = o.h, u = Math.min(46, Math.floor(400 / Math.max(w, hgt + 1))), ox = 44, oy = 40, X = x => ox + x * u, Y = y => oy + y * u, cells = o.cells || V.rectCells(w, hgt), has = (x, y) => cells.some(c => c[0] === x && c[1] === y);
  const lines = o.grid === false ? 'none' : o.faint ? '#7D9BE0' : '#C5D6FA'; let s = '';
  cells.forEach(c => { const ghost = o.rowsShown != null && c[1] >= o.rowsShown, hi = o.hiRow === c[1] || o.hiCol === c[0];
    s += '<rect x="' + X(c[0]) + '" y="' + Y(c[1]) + '" width="' + u + '" height="' + u + '" fill="' + (ghost ? '#EEF3FF' : hi ? '#FFC83D' : '#3B6FD4') + '" stroke="' + (ghost ? '#B9C8EE' : lines === 'none' ? (hi ? '#FFC83D' : '#3B6FD4') : hi ? '#E9A416' : lines) + '" stroke-width="' + (ghost ? 1.5 : 2) + '"' + (ghost ? ' stroke-dasharray="4 4"' : '') + '/>'; });
  /* the outline: every side of a square that has no neighbour */
  cells.forEach(c => { [[0, -1, 0, 0, 1, 0], [1, 0, 1, 0, 1, 1], [0, 1, 0, 1, 1, 1], [-1, 0, 0, 0, 0, 1]].forEach(d => { if (!has(c[0] + d[0], c[1] + d[1])) s += '<line x1="' + X(c[0] + d[2]) + '" y1="' + Y(c[1] + d[3]) + '" x2="' + X(c[0] + d[4]) + '" y2="' + Y(c[1] + d[5]) + '" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>'; }); });
  if (o.dims && !o.walk) s += '<text class="ax" x="' + X(w / 2) + '" y="' + (oy - 12) + '" font-size="22" text-anchor="middle" fill="' + INK + '">' + o.dims[0] + '</text><text class="ax" x="' + (X(w) + 12) + '" y="' + (Y(hgt / 2) + 8) + '" font-size="22" fill="' + INK + '">' + o.dims[1] + '</text>';
  const bub = (x, y, t) => { const last = t === '?', str = String(t); return '<circle cx="' + x + '" cy="' + y + '" r="' + (str.length > 2 ? 15 : 13) + '" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + x + '" y="' + (y + 5.5) + '" font-size="' + (str.length > 2 ? 13 : 16) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + str + '</text>'; };
  if (o.walk) { const k = o.walk, lab0 = k.labels || [], seq = k.seq || Array.from({ length: k.done || 0 }, (_, i) => i), lab = [];
    seq.forEach((i, pos) => { lab[i] = lab0[pos]; });
    k.order.forEach((e, i) => { const on = seq.includes(i);
      if (k.mode === 'cells') { if (on) s += bub(X(e[0]) + u / 2, Y(e[1]) + u / 2, lab[i]); else if (k.live) s += '<rect class="hot" data-i="' + i + '" x="' + (X(e[0]) + 3) + '" y="' + (Y(e[1]) + 3) + '" width="' + (u - 6) + '" height="' + (u - 6) + '" rx="8" fill="#fff"/>'; }
      else if (k.mode === 'rows') { if (on) s += '<rect x="' + X(0) + '" y="' + Y(e) + '" width="' + (w * u) + '" height="' + u + '" fill="#FFC83D" opacity=".55"/>' + bub(X(w) + 22, Y(e) + u / 2, lab[i]); else if (k.live) s += '<rect class="hot" data-i="' + i + '" x="' + X(0) + '" y="' + (Y(e) + 3) + '" width="' + (w * u) + '" height="' + (u - 6) + '" rx="8" fill="#fff"/>'; }
      else { const side = e[2], flat = side === 't' || side === 'b', x1 = X(e[0] + (side === 'r' ? 1 : 0)), y1 = Y(e[1] + (side === 'b' ? 1 : 0)), x2 = flat ? x1 + u : x1, y2 = flat ? y1 : y1 + u, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, out = { t: [0, -1], b: [0, 1], l: [-1, 0], r: [1, 0] }[side];
        if (on) s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#FFC83D" stroke-width="7" stroke-linecap="round"/>' + bub(mx + out[0] * 20, my + out[1] * 20, lab[i]);
        else if (k.live) s += '<rect class="hot" data-i="' + i + '" x="' + (flat ? x1 + 3 : x1 - 15) + '" y="' + (flat ? y1 - 15 : y1 + 3) + '" width="' + (flat ? u - 6 : 30) + '" height="' + (flat ? 30 : u - 6) + '" rx="10" fill="#6453C9"/>'; } }); }
  V.put(el, X(w) + (o.dims ? 86 : 44), Y(hgt) + 40, s);
};

/* ---------- Brazilian money: coins and notes to count. Every value is in centavos (100 centavos = 1 real, written R$1).
   Coins: 5, 10, 25 and 50 centavos and 1 real. Notes: 2, 5, 10, 20, 50 and 100 reais (Banco Central do Brasil; the 1 centavo coin is no longer made).
   o: items [centavos...], hi [indices ringed], ghost (the items are empty outlines until she taps them: change being counted out),
      tag { icon, price } (a price tag), paid (the note handed over, in centavos), cap (words underneath),
      walk { order [indices] } (HANDS.pic: she taps each coin or note in any order; it takes the running total, and the last is "?") ---------- */
const COIN = { 5: { r: 25, fill: '#D9A06B', edge: '#8A5A34' }, 10: { r: 23, fill: '#EBCB6B', edge: '#A47A1E' }, 25: { r: 28, fill: '#EBCB6B', edge: '#A47A1E' }, 50: { r: 26, fill: '#DDE2EC', edge: '#7E8798' }, 100: { r: 30, fill: '#EBCB6B', edge: '#A47A1E' } };
const NOTE_COL = { 200: '#8CC8F0', 500: '#C3ABEE', 1000: '#F29A8C', 2000: '#F6DB6B', 5000: '#E9B27A', 10000: '#8ADAD3' };
const brl = c => 'R$' + (c % 100 ? (c / 100).toFixed(2) : c / 100);
/* New Zealand money, for every country but Brazil (Tony, 11 October, on "R$1 is 100 centavos" in New Zealand: "The official minor currency unit in New Zealand is the cent (represented as c).
   also, get rid of the R in front of the $"). Coins: 10c, 20c, 50c, $1 and $2; notes: $5, $10, $20, $50 and $100 (Reserve Bank of New Zealand; the 5c coin went in 2006).
   Coin sizes follow their real diameters (10c 20.5 mm, 20c 21.75 mm, 50c 24.75 mm, $1 23 mm, $2 26.5 mm); notes take their real colours */
const COIN_NZ = { 10: { r: 22.5, fill: '#D99A6C', edge: '#8A5A34' }, 20: { r: 24, fill: '#DDE2EC', edge: '#7E8798' }, 50: { r: 27, fill: '#DDE2EC', edge: '#7E8798' }, 100: { r: 25.5, fill: '#EBCB6B', edge: '#A47A1E' }, 200: { r: 29, fill: '#EBCB6B', edge: '#A47A1E' } };
const NOTE_NZ = { 500: '#F2A65A', 1000: '#6FB7E8', 2000: '#7CCB8E', 5000: '#B79BDD', 10000: '#EE8A80' };
const nzd = c => '$' + (c % 100 ? (c / 100).toFixed(2) : c / 100);
const moneyNote = (v, cur) => cur === 'nzd' ? v >= 500 : v >= 200;
const coinR = (v, cur) => (cur === 'nzd' ? COIN_NZ : COIN)[v].r;
const moneySize = (v, cur) => moneyNote(v, cur) ? [106, 60] : [coinR(v, cur) * 2 + 6, coinR(v, cur) * 2 + 6];
function moneySvg(v, cx, cy, ghost, cur) {
  if (cur === 'nzd') {
    if (v >= 500) { const x = cx - 53, y = cy - 30, n = v / 100;
      if (ghost) return '<rect x="' + x + '" y="' + y + '" width="106" height="60" rx="9" fill="#fff" stroke="#B9C0D0" stroke-width="2.500" stroke-dasharray="6 5"/><text class="ax" x="' + cx + '" y="' + (cy + 9) + '" font-size="24" text-anchor="middle" fill="#B9C0D0">$' + n + '</text>';
      return '<rect x="' + x + '" y="' + y + '" width="106" height="60" rx="9" fill="' + NOTE_NZ[v] + '" stroke="' + INK + '" stroke-width="2.500"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="27" ry="21" fill="#fff" opacity=".6"/>' +
        '<text class="ax" x="' + cx + '" y="' + (cy + 10) + '" font-size="28" text-anchor="middle" fill="' + INK + '">$' + n + '</text><text class="ax" x="' + (x + 97) + '" y="' + (y + 52) + '" font-size="10.500" text-anchor="end" fill="' + INK + '">dollars</text>'; }
    const c = COIN_NZ[v], lab = v >= 100 ? '$' + v / 100 : v + 'c';
    if (ghost) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + c.r + '" fill="#fff" stroke="#B9C0D0" stroke-width="2.500" stroke-dasharray="6 5"/><text class="ax" x="' + cx + '" y="' + (cy + 7) + '" font-size="19" text-anchor="middle" fill="#B9C0D0">' + lab + '</text>';
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + c.r + '" fill="' + c.fill + '" stroke="' + c.edge + '" stroke-width="2.500"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (c.r - 5) + '" fill="none" stroke="#fff" stroke-width="1.300" opacity=".7"/>' +
      '<text class="ax" x="' + cx + '" y="' + (cy + 7) + '" font-size="' + (lab.length > 2 ? 17 : 20) + '" text-anchor="middle" fill="' + INK + '">' + lab + '</text>';
  }
  if (v >= 200) { const x = cx - 53, y = cy - 30, n = v / 100;
    if (ghost) return '<rect x="' + x + '" y="' + y + '" width="106" height="60" rx="9" fill="#fff" stroke="#B9C0D0" stroke-width="2.500" stroke-dasharray="6 5"/><text class="ax" x="' + cx + '" y="' + (cy + 9) + '" font-size="24" text-anchor="middle" fill="#B9C0D0">' + n + '</text>';
    return '<rect x="' + x + '" y="' + y + '" width="106" height="60" rx="9" fill="' + NOTE_COL[v] + '" stroke="' + INK + '" stroke-width="2.500"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="27" ry="21" fill="#fff" opacity=".6"/>' +
      '<text class="ax" x="' + (x + 9) + '" y="' + (y + 18) + '" font-size="11.500" fill="' + INK + '">R$</text><text class="ax" x="' + cx + '" y="' + (cy + 10) + '" font-size="28" text-anchor="middle" fill="' + INK + '">' + n + '</text><text class="ax" x="' + (x + 97) + '" y="' + (y + 52) + '" font-size="10.500" text-anchor="end" fill="' + INK + '">reais</text>'; }
  const c = COIN[v], one = v === 100;
  if (ghost) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + c.r + '" fill="#fff" stroke="#B9C0D0" stroke-width="2.500" stroke-dasharray="6 5"/><text class="ax" x="' + cx + '" y="' + (cy + 7) + '" font-size="19" text-anchor="middle" fill="#B9C0D0">' + (one ? 'R$1' : v) + '</text>';
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + c.r + '" fill="' + c.fill + '" stroke="' + c.edge + '" stroke-width="2.500"/>' + (one ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + (c.r * .66) + '" fill="#E3E7EF" stroke="#9AA3B5" stroke-width="1.500"/>' : '<circle cx="' + cx + '" cy="' + cy + '" r="' + (c.r - 5) + '" fill="none" stroke="#fff" stroke-width="1.300" opacity=".7"/>') +
    '<text class="ax" x="' + cx + '" y="' + (cy + (one ? 5 : 3)) + '" font-size="' + (one ? 20 : 19) + '" text-anchor="middle" fill="' + INK + '">' + (one ? 1 : v) + '</text><text class="ax" x="' + cx + '" y="' + (cy + (one ? 15.5 : 13.5)) + '" font-size="' + (one ? 7.5 : 7) + '" text-anchor="middle" fill="' + INK + '">' + (one ? 'real' : 'centavos') + '</text>';
}
V.money = (el, o) => {
  o = o || {}; const cur = o.cur, fmt = cur === 'nzd' ? nzd : brl, items = o.items || [], W0 = 400, gap = 12, pos = []; let s = "", y = 12;
  if (o.tag) {
    s += '<path d="M14 ' + (y + 40) + 'l22-30h132q8 0 8 8v44q0 8-8 8H36z" fill="#FFF6D6" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/><circle cx="34" cy="' + (y + 40) + '" r="5" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
      V.pic(o.tag.icon, 50, y + 16, 48) + '<text class="ax" x="' + (o.tag.price % 100 ? 136 : 134) + '" y="' + (y + 50) + '" font-size="' + (o.tag.price % 100 ? 22 : 27) + '" text-anchor="middle" fill="' + INK + '">' + fmt(o.tag.price) + '</text>';
    if (o.paid) s += '<text class="ax" x="322" y="' + (y + 8) + '" font-size="15" text-anchor="middle" fill="#5A678A">You pay</text>' + moneySvg(o.paid, 322, y + 46, false, cur);
    y += 96;
  }
  const k = o.walk, seq = k ? (k.seq || Array.from({ length: k.done || 0 }, (_, i) => i)) : [], lab = k ? (k.labels || []) : [], at = i => k ? k.order.indexOf(i) : -1;
  if (o.reach != null) {     /* counting change up: the price, and each amount the count has reached so far, in the order she tapped. With no taps (or a finished picture, o.cap) it is just the two ends */
    const stops = [o.reach]; (o.cap ? items.map((_, i) => i) : seq.map(w => k.order[w])).forEach(i => stops.push(stops[stops.length - 1] + items[i]));
    const n = stops.length, cw = 54, gapx = 22, tot = n * cw + (n - 1) * gapx, x0 = (W0 - tot) / 2;
    stops.forEach((v, j) => { const x = x0 + j * (cw + gapx), first = j === 0;
      s += '<rect x="' + x + '" y="' + (y - 2) + '" width="' + cw + '" height="26" rx="13" fill="' + (first ? '#FFF6D6' : '#E4F6EC') + '" stroke="' + (first ? '#E9A416' : '#34C17B') + '" stroke-width="2"/><text class="ax" x="' + (x + cw / 2) + '" y="' + (y + 16.5) + '" font-size="14.500" text-anchor="middle" fill="' + INK + '">' + fmt(v) + '</text>';
      if (j < n - 1) s += '<path d="M' + (x + cw + 4) + ' ' + (y + 11) + 'h' + (gapx - 9) + 'm-5-5 5 5-5 5" fill="none" stroke="#5A678A" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/>'; });
    y += 36; }
  /* lay the coins and notes out in rows */
  const rows = [[]]; let rw = 0;
  items.forEach((v, i) => { const sz = moneySize(v, cur); if (rw + sz[0] > W0 - 36 && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(i); rw += sz[0] + gap; });
  rows.forEach(r => { const wsum = r.reduce((a, i) => a + moneySize(items[i], cur)[0] + gap, -gap); let x = (W0 - wsum) / 2; r.forEach(i => { const sz = moneySize(items[i], cur); pos[i] = [x + sz[0] / 2, y + 38]; x += sz[0] + gap; }); y += 76; });
  items.forEach((v, i) => { const p = pos[i], w = at(i), tapped = w >= 0 && seq.includes(w);
    s += moneySvg(v, p[0], p[1], !!o.ghost && !tapped, cur);
    if ((o.hi || []).includes(i)) s += moneyNote(v, cur) ? '<rect x="' + (p[0] - 58) + '" y="' + (p[1] - 35) + '" width="116" height="70" rx="13" fill="none" stroke="#8B7BEA" stroke-width="4" stroke-dasharray="6 5"/>' : '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (coinR(v, cur) + 6) + '" fill="none" stroke="#8B7BEA" stroke-width="4" stroke-dasharray="6 5"/>';
    if (tapped) { const t = String(lab[seq.indexOf(w)]), last = t === '?', wd = 20 + t.length * 10.5, by = p[1] + (moneyNote(v, cur) ? 26 : coinR(v, cur) - 2);
      s += '<rect x="' + (p[0] - wd / 2) + '" y="' + (by - 14) + '" width="' + wd + '" height="28" rx="14" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + p[0] + '" y="' + (by + 6.5) + '" font-size="18" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; }
    else if (k && k.live && w >= 0) s += moneyNote(v, cur) ? '<rect class="hot" data-i="' + w + '" x="' + (p[0] - 55) + '" y="' + (p[1] - 32) + '" width="110" height="64" rx="11" fill="#6453C9"/>' : '<circle class="hot" data-i="' + w + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (coinR(v, cur) + 3) + '" fill="#6453C9"/>'; });
  if (o.cap) { s += '<text x="' + (W0 / 2) + '" y="' + (y + 22) + '" font-size="26" text-anchor="middle" fill="#6453C9">' + o.cap + '</text>'; y += 34; }
  V.put(el, W0, y + 6, s);
};

/* ---------- angles: a kick measured in degrees. The fan of faint slices is a protractor; nothing prints the size of the angle being asked for.
   o: a (the kick, anticlockwise from the ground on the right), slice (degrees in one faint slice, default 10), line (the ground carries on to the left: angles on a straight line),
      given [{ from, to, text }] (parts whose size is written in), ask [from, to] (the part asked for, marked "?"), sq (mark the square corner),
      full (a whole turn, drawn clockwise from the top; a is how far the ball has turned), walk { from, by } (HANDS.pic: each tap fills the next slice) ---------- */
/* a football player seen from the front, standing at (x, y): feet at y. Used on the angle picture: the kicker, and the team-mate the pass goes to */
const playerSvg = (x, y, k, shirt, hair) => '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><ellipse cx="0" cy="0" rx="9" ry="2.200" fill="rgba(27,42,78,.25)"/><path d="M-4-8v7M4-8v7" stroke="#1B2A4E" stroke-width="3.200" stroke-linecap="round"/><path d="M-6-11h12v4.500h-12z" fill="#2A54A8" stroke="#1B2A4E" stroke-width="1.100" stroke-linejoin="round"/>' +
  '<path d="M-8-24l-4 3 2 5 3-1v8h14v-8l3 1 2-5-4-3q-3 3-8 3t-8-3z" fill="' + shirt + '" stroke="#1B2A4E" stroke-width="1.200" stroke-linejoin="round"/><circle cx="0" cy="-30" r="5" fill="#E0AC7E" stroke="#1B2A4E" stroke-width="1.200"/><path d="M-5-31q5-6 10 0" fill="' + (hair || '#4A2F1D') + '"/></g>';
/* angles. The half picture (Tony, 8 October: "make this look like a football field... show kicking a ball to a person... which side we are measuring from") is a pitch seen from above:
   the kicker stands on the white touchline, the fan of slices opens over the grass, the orange line and its "0°" show where measuring starts and the curved arrow which way it goes,
   and the pass runs to a team-mate. o.full is a whole turn seen from above (a spinning ball). o: a (the pass), slice (degrees a slice), sq (mark the square corner), line (the touchline is the straight line in the question),
   rays (several lines), plain (rays only, no players), given [{ from, to, text, col }], ask [from, to] (a "?" there), walk (see HANDS.pic) */
V.angle = (el, o) => {
  const full = !!o.full, W0 = full ? 330 : 440, H0 = full ? 330 : 300, cx = full ? 165 : 212, cy = full ? 165 : 246, R = full ? 128 : 170, rad = t => t * Math.PI / 180, f1 = n => n.toFixed(1), span = full ? 360 : 180, m = o.slice || 10;
  const P = (t, r) => full ? [cx + r * Math.sin(rad(t)), cy - r * Math.cos(rad(t))] : [cx + r * Math.cos(rad(t)), cy - r * Math.sin(rad(t))];
  const sector = (t1, t2, r, attrs) => { if (t2 < t1) { const x = t1; t1 = t2; t2 = x; } if (t2 - t1 >= 359.9) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' + attrs + '/>'; const p = P(t1, r), q = P(t2, r);
    return '<path d="M' + cx + ' ' + cy + 'L' + f1(p[0]) + ' ' + f1(p[1]) + 'A' + r + ' ' + r + ' 0 ' + (t2 - t1 > 180 ? 1 : 0) + ' ' + (full ? 1 : 0) + ' ' + f1(q[0]) + ' ' + f1(q[1]) + 'z" ' + attrs + '/>'; };
  const ray = (t, w, col, r0, r1, extra) => { const p = P(t, r1 || R), q = P(t, r0 || 0); return '<line x1="' + f1(q[0]) + '" y1="' + f1(q[1]) + '" x2="' + f1(p[0]) + '" y2="' + f1(p[1]) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || '') + '/>'; };
  const bub = (t, r, text, last) => { const p = P(t, r), wd = 22 + String(text).length * 10.5; return '<rect x="' + f1(p[0] - wd / 2) + '" y="' + f1(p[1] - 15) + '" width="' + wd + '" height="30" rx="15" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + f1(p[0]) + '" y="' + f1(p[1] + 7) + '" font-size="19" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + text + '</text>'; };
  let s = '';
  if (!full) { s += '<rect width="' + W0 + '" height="' + H0 + '" rx="12" fill="#5DB972"/>'; for (let x = 0; x < W0; x += 88) s += '<rect x="' + x + '" y="0" width="44" height="' + cy + '" fill="#6CC57E"/>';
    s += '<rect x="0" y="' + cy + '" width="' + W0 + '" height="' + (H0 - cy) + '" fill="#4FA865"/><path d="M0 ' + cy + 'h' + W0 + '" stroke="#fff" stroke-width="4"/><circle cx="' + cx + '" cy="' + (cy - R - 60) + '" r="46" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>'; }
  s += sector(0, span, R, 'fill="#fff"' + (full ? '' : ' opacity=".9"') + ' stroke="' + (full ? '#9DB8F2' : INK) + '" stroke-width="2.500"');
  const given = o.given || [];
  given.forEach((g, i) => { s += sector(g.from, g.to, R, 'fill="' + (g.col || ['#FFE08A', '#A9E6EC', '#FFC2D4'][i % 3]) + '"'); });
  if (o.a != null && !given.length) s += sector(0, o.a, R, 'fill="#FFEFB8"');
  if (o.walk) { const k = o.walk, done = k.done || 0;
    s += sector(k.from, k.from + k.by * k.n, R, (k.live ? 'class="pulse" ' : '') + 'fill="#8B7BEA" opacity=".2"');
    for (let i = 1; i <= done; i++) s += sector(k.from + k.by * (i - 1), k.from + k.by * i, R, 'fill="#6453C9" opacity="' + (i === done ? .6 : .32) + '"'); }
  for (let t = 0; t < span + (full ? 0 : 1); t += m) s += ray(t, t % 90 === 0 ? 2.800 : 1.500, t % 90 === 0 ? '#5C73B8' : '#8FA3D6', 28);
  if (o.sq) { const a = P(0, 30), b = P(90, 30); s += '<path d="M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(a[0]) + ' ' + f1(b[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + '" fill="none" stroke="' + INK + '" stroke-width="3"/>'; }
  if (full) s += ray(0, 5.500, INK);
  else {     /* where measuring starts, and which way it goes */
    s += ray(0, 7, '#F2853D', 0, R + 6) + (o.line ? ray(180, 6, INK, 0, R + 6) : '');
    const a0 = P(5, R + 13), a1 = P(24, R + 13);
    s += '<path d="M' + f1(a0[0]) + ' ' + f1(a0[1]) + 'A' + (R + 13) + ' ' + (R + 13) + ' 0 0 0 ' + f1(a1[0]) + ' ' + f1(a1[1]) + '" fill="none" stroke="#F2853D" stroke-width="4.500" stroke-linecap="round"/><path d="M' + f1(a1[0] + 9.5) + ' ' + f1(a1[1] + 4.5) + 'L' + f1(a1[0]) + ' ' + f1(a1[1]) + 'L' + f1(a1[0] + .5) + ' ' + f1(a1[1] + 11) + '" fill="none" stroke="#F2853D" stroke-width="4.500" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="' + (cx + R + 10) + '" y="' + (cy + 8) + '" width="42" height="26" rx="13" fill="#F2853D" stroke="#fff" stroke-width="2"/><text x="' + (cx + R + 31) + '" y="' + (cy + 27) + '" font-size="17" text-anchor="middle" fill="#fff">0°</text>'; }
  (o.rays || (o.a != null ? [o.a] : [])).forEach(t => { const q = P(t, R - 24), mate = P(t, R + 4), ball = P(t, R - 34);
    s += ray(t, 5.500, INK, 0, full || o.plain ? R - 10 : R - 46) + (full ? '<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="7" fill="#E5484D" stroke="#fff" stroke-width="2"/>' : o.plain ? '' : V.pic('soccer-ball', f1(ball[0] - 12), f1(ball[1] - 12), 24) + playerSvg(f1(mate[0]), f1(mate[1] + 14), .92, '#FFD23F', '#2B1B10')); });
  given.forEach(g => { const p = P((g.from + g.to) / 2, R * .56); if (g.text) s += '<text class="ax" x="' + f1(p[0]) + '" y="' + f1(p[1] + 8) + '" font-size="24" text-anchor="middle" fill="' + INK + '">' + g.text + '</text>'; });
  if (o.ask) s += bub((o.ask[0] + o.ask[1]) / 2, R * .56, '?', true);
  s += full ? V.pic('soccer-ball', cx - 24, cy - 24, 48) : o.plain ? '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="' + INK + '"/>' : '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + INK + '"/>' + playerSvg(cx, cy + 40, 1.15, '#FFD23F');
  if (o.walk) { const k = o.walk, done = k.done || 0, lab = k.labels || [];
    if (done) s += bub(k.from + k.by * (done - .5), R * .74, lab[done - 1], lab[done - 1] === '?');
    if (k.live) s += '<rect class="hot" x="0" y="0" width="' + W0 + '" height="' + H0 + '" fill="transparent"/>'; }
  V.put(el, W0, H0, s);
};
/* a triangle of three passes, with two corners measured: a at the left, b at the right. o.show writes the third in; otherwise it is marked "?" */
V.tri = (el, a, b, o) => {
  o = o || {}; const rad = t => t * Math.PI / 180, f1 = n => n.toFixed(1), L = 300, hh = L * Math.sin(rad(a)) * Math.sin(rad(b)) / Math.sin(rad(a + b)), xc = hh / Math.tan(rad(a));
  const k = Math.min(330 / L, 176 / hh), ox = (440 - L * k) / 2, oy = 232, A = [ox, oy], B = [ox + L * k, oy], C = [ox + xc * k, oy - hh * k], c = 180 - a - b;
  const arc = (p, t1, t2, r) => { const q1 = [p[0] + r * Math.cos(rad(t1)), p[1] - r * Math.sin(rad(t1))], q2 = [p[0] + r * Math.cos(rad(t2)), p[1] - r * Math.sin(rad(t2))]; return '<path d="M' + f1(p[0]) + ' ' + f1(p[1]) + 'L' + f1(q1[0]) + ' ' + f1(q1[1]) + 'A' + r + ' ' + r + ' 0 0 0 ' + f1(q2[0]) + ' ' + f1(q2[1]) + 'z"'; };
  const at = (p, t, r) => [p[0] + r * Math.cos(rad(t)), p[1] - r * Math.sin(rad(t))], txt = (p, t, col) => '<text class="ax" x="' + f1(p[0]) + '" y="' + f1(p[1] + 7) + '" font-size="21" text-anchor="middle" fill="' + (col || INK) + '">' + t + '</text>';
  let s = '<rect x="0" y="0" width="440" height="270" rx="14" fill="#8FD694"/><path d="M0 135h440M220 0v270" stroke="#A9E2AE" stroke-width="3"/><circle cx="220" cy="135" r="44" fill="none" stroke="#A9E2AE" stroke-width="3"/>';
  s += '<path d="M' + f1(A[0]) + ' ' + f1(A[1]) + 'L' + f1(B[0]) + ' ' + f1(B[1]) + 'L' + f1(C[0]) + ' ' + f1(C[1]) + 'z" fill="#fff" fill-opacity=".85" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>';
  s += arc(A, 0, a, 34) + ' fill="#FFE9A8" stroke="' + INK + '" stroke-width="2"/>' + arc(B, 180 - b, 180, 34) + ' fill="#C9F0F3" stroke="' + INK + '" stroke-width="2"/>' + arc(C, 180 + a, 360 - b, 30) + ' fill="#FFD9E4" stroke="' + INK + '" stroke-width="2"/>';
  s += txt(at(A, a / 2, 60), a + '°') + txt(at(B, 180 - b / 2, 60), b + '°');
  const pc = at(C, 270 + (a - b) / 2, 56);
  s += o.show ? txt(pc, c + '°', '#6453C9') : '<circle cx="' + f1(pc[0]) + '" cy="' + f1(pc[1]) + '" r="15" fill="#FFC83D" stroke="#fff" stroke-width="2.500"/><text x="' + f1(pc[0]) + '" y="' + f1(pc[1] + 7) + '" font-size="20" text-anchor="middle" fill="' + INK + '">?</text>';
  [A, B, C].forEach((p, i) => { s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="11" fill="' + ['#FFC83D', '#3B6FD4', '#34C17B'][i] + '" stroke="' + INK + '" stroke-width="2.500"/>'; });
  s += V.pic('soccer-ball', f1((A[0] + B[0]) / 2 - 13), f1(oy - 13), 26);
  V.put(el, 440, 270, s);
};

/* ---------- a ruler to read: the metric system, which France gave the world. The numbers along it are a scale (class "ax"); nothing prints the length being asked for.
   o: lo, hi (the two ends of the scale, counted in its smallest unit), minor (one small mark), mid (a middle-sized mark every so many), major (a number every so many), fmt (how a number is written), unit (letters at the end),
      a, b (the thing being measured runs from a to b), shape (which long thing it is: see LONG), kind 'road' (a road with a rider at b, for kilometres; art is the rider), sign (words on a sign: what she has been told),
      walk { from, by } (HANDS.pic: each tap moves one mark along; hops: draw each step as a hop, for counting the gaps) ---------- */
/* long things to measure, each drawn to fill exactly the length it is given: x (its left end), w (its length), y (its top; it is 24 tall) */
const LONG = {
  baguette: (x, w, y, f) => { let t = '<rect x="' + f(x) + '" y="' + y + '" width="' + f(w) + '" height="24" rx="12" fill="#E9B95C" stroke="#8A5A34" stroke-width="2.500"/>'; for (let i = 14; i < w - 14; i += 22) t += '<path d="M' + f(x + i) + ' ' + (y + 6) + 'l8 12" stroke="#B9782E" stroke-width="3" stroke-linecap="round"/>'; return t; },
  pencil: (x, w, y, f) => '<rect x="' + f(x) + '" y="' + (y + 2) + '" width="' + f(w - 18) + '" height="20" fill="#FFC83D" stroke="' + INK + '" stroke-width="2.500"/><rect x="' + f(x) + '" y="' + (y + 2) + '" width="11" height="20" rx="3" fill="#FF8FB1" stroke="' + INK + '" stroke-width="2.500"/><path d="M' + f(x + w - 18) + ' ' + (y + 2) + 'L' + f(x + w) + ' ' + (y + 12) + 'L' + f(x + w - 18) + ' ' + (y + 22) + 'z" fill="#F6DFA4" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/><path d="M' + f(x + w - 7) + ' ' + (y + 8) + 'L' + f(x + w) + ' ' + (y + 12) + 'L' + f(x + w - 7) + ' ' + (y + 16) + 'z" fill="' + INK + '"/>',
  carrot: (x, w, y, f) => '<path d="M' + f(x) + ' ' + (y + 5) + 'l11 7-11 7z" fill="#3FA36B" stroke="#2E7D4F" stroke-width="2" stroke-linejoin="round"/><path d="M' + f(x + 9) + ' ' + (y + 1) + 'L' + f(x + w) + ' ' + (y + 12) + 'L' + f(x + 9) + ' ' + (y + 23) + 'Q' + f(x + 3) + ' ' + (y + 12) + ' ' + f(x + 9) + ' ' + (y + 1) + 'z" fill="#F2853D" stroke="#B4561C" stroke-width="2.500" stroke-linejoin="round"/>',
  caterpillar: (x, w, y, f) => { const n = Math.max(2, Math.round(w / 21)), sp = w / n; let t = ''; for (let i = 0; i < n; i++) t += '<ellipse cx="' + f(x + sp * (i + .5)) + '" cy="' + (y + 12) + '" rx="' + f(sp / 2) + '" ry="11" fill="' + (i % 2 ? '#57BF7F' : '#8FDFA6') + '" stroke="#2E7D4F" stroke-width="2"/>'; const hx = x + sp * (n - .5); return t + '<circle cx="' + f(hx + sp * .15) + '" cy="' + (y + 9) + '" r="2.600" fill="' + INK + '"/><path d="M' + f(hx - 2) + ' ' + (y + 2) + 'l-3-8M' + f(hx + 4) + ' ' + (y + 2) + 'l3-8" stroke="#2E7D4F" stroke-width="2" stroke-linecap="round"/>'; },
  nail: (x, w, y, f) => '<rect x="' + f(x) + '" y="' + (y + 2) + '" width="6" height="20" rx="2" fill="#9AA3B5" stroke="' + INK + '" stroke-width="2"/><path d="M' + f(x + 6) + ' ' + (y + 8) + 'H' + f(x + w - 14) + 'L' + f(x + w) + ' ' + (y + 12) + 'L' + f(x + w - 14) + ' ' + (y + 16) + 'H' + f(x + 6) + 'z" fill="#C9CEDA" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>',
  twig: (x, w, y, f) => '<rect x="' + f(x) + '" y="' + (y + 8) + '" width="' + f(w) + '" height="9" rx="4.500" fill="#A9743F" stroke="#5A3A1E" stroke-width="2"/><path d="M' + f(x + w * .45) + ' ' + (y + 8) + 'q4-12 16-9-2 10-16 9z" fill="#57BF7F" stroke="#2E7D4F" stroke-width="1.500"/>',
  ladder: (x, w, y, f) => { let t = ''; for (let i = 12; i < w - 6; i += 24) t += '<path d="M' + f(x + i) + ' ' + (y + 3) + 'v18" stroke="#B98A4E" stroke-width="4"/>'; return t + '<path d="M' + f(x + 2) + ' ' + (y + 3) + 'H' + f(x + w - 2) + 'M' + f(x + 2) + ' ' + (y + 21) + 'H' + f(x + w - 2) + '" stroke="#7A4A1E" stroke-width="5" stroke-linecap="round"/>'; },
  canoe: (x, w, y, f) => '<path d="M' + f(x) + ' ' + (y + 4) + 'H' + f(x + w) + 'Q' + f(x + w - 10) + ' ' + (y + 24) + ' ' + f(x + w - 34) + ' ' + (y + 24) + 'H' + f(x + 34) + 'Q' + f(x + 10) + ' ' + (y + 24) + ' ' + f(x) + ' ' + (y + 4) + 'z" fill="#E5484D" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/><path d="M' + f(x + 16) + ' ' + (y + 11) + 'H' + f(x + w - 16) + '" stroke="#fff" stroke-width="2.500" stroke-linecap="round" opacity=".7"/>',
  board: (x, w, y, f) => '<path d="M' + f(x) + ' ' + (y + 12) + 'Q' + f(x + w * .2) + ' ' + (y - 1) + ' ' + f(x + w * .62) + ' ' + (y + 1) + 'Q' + f(x + w) + ' ' + (y + 3) + ' ' + f(x + w) + ' ' + (y + 12) + 'Q' + f(x + w) + ' ' + (y + 21) + ' ' + f(x + w * .62) + ' ' + (y + 23) + 'Q' + f(x + w * .2) + ' ' + (y + 25) + ' ' + f(x) + ' ' + (y + 12) + 'z" fill="#5CC8D6" stroke="' + INK + '" stroke-width="2.500"/><path d="M' + f(x + 8) + ' ' + (y + 12) + 'H' + f(x + w - 6) + '" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
};
V.ruler = (el, o) => {
  const W0 = 440, ox = 24, Wr = W0 - 24 - 38, top = 118, hgt = 62, X = v => ox + (v - o.lo) / (o.hi - o.lo) * Wr, f1 = n => n.toFixed(1); let s = '';
  if (o.b != null) { const xa = X(o.a || 0), xb = X(o.b);
    s += '<path d="M' + f1(xa) + ' 72V' + top + 'M' + f1(xb) + ' 72V' + top + '" stroke="#8B7BEA" stroke-width="2.500" stroke-dasharray="5 5"/>';
    if (o.kind === 'road') s += '<rect x="' + f1(xa) + '" y="56" width="' + f1(xb - xa) + '" height="18" rx="4" fill="#7E8798"/><path d="M' + f1(xa + 6) + ' 65H' + f1(xb - 4) + '" stroke="#fff" stroke-width="2.500" stroke-dasharray="9 8"/>' + V.pic('chequered-flag', f1(xa - 6), 22, 34) + V.pic(o.art, f1(xb - 30), 12, 50);
    else if (o.kind === 'ice') s += '<rect x="' + f1(xa - 4) + '" y="58" width="' + f1(xb - xa + 8) + '" height="16" rx="8" fill="#DDF3FD" stroke="#9FD3EE" stroke-width="2"/><path d="M' + f1(xa + 4) + ' 63q' + f1((xb - xa) / 2) + ' 5 ' + f1(xb - xa - 10) + ' 0M' + f1(xa + 8) + ' 69q' + f1((xb - xa) / 2.4) + ' -4 ' + f1(xb - xa - 18) + ' 1" stroke="#fff" stroke-width="1.600" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="' + f1(xb) + '" cy="70" rx="12" ry="5" fill="#1B2A4E"/><rect x="' + f1(xb - 12) + '" y="62" width="24" height="8" fill="#2B3445"/><ellipse cx="' + f1(xb) + '" cy="62" rx="12" ry="5" fill="#3E4A5E"/>';
    else s += LONG[o.shape](xa, xb - xa, 46, f1); }
  /* marks: named pins above the scale, for comparing (two skaters' times). They show where each one is, never which is less */
  (o.marks || []).forEach((m, i) => { const x = X(m.v), col = m.col || ['#E5484D', '#3B6FD4'][i % 2], ry = i % 2 ? 40 : 6, lx = clamp(x, 38, W0 - 38);
    s += '<path d="M' + f1(x) + ' ' + (top - 2) + 'V' + (ry + 26) + '" stroke="' + col + '" stroke-width="3"/><circle cx="' + f1(x) + '" cy="' + top + '" r="5" fill="' + col + '"/>' +
      '<rect x="' + f1(lx - 34) + '" y="' + ry + '" width="68" height="28" rx="14" fill="' + col + '"/><text x="' + f1(lx) + '" y="' + (ry + 20) + '" font-size="17" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka,sans-serif">' + m.label + '</text>'; });
  if (o.sign) { const wd = 26 + o.sign.length * 12; s += '<rect x="' + (W0 - wd - 8) + '" y="6" width="' + wd + '" height="34" rx="10" fill="#fff" stroke="' + INK + '" stroke-width="2.500"/><text class="ax" x="' + (W0 - wd / 2 - 8) + '" y="30" font-size="21" text-anchor="middle" fill="' + INK + '">' + o.sign + '</text>'; }
  s += '<rect x="6" y="' + top + '" width="' + (W0 - 12) + '" height="' + hgt + '" rx="9" fill="#FFE9A8" stroke="' + INK + '" stroke-width="3"/>';
  const steps = Math.round((o.hi - o.lo) / o.minor);
  for (let i = 0; i <= steps; i++) { const v = o.lo + i * o.minor, big = v % o.major === 0, mid = !big && o.mid && v % o.mid === 0, x = f1(X(v));
    s += '<line x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="' + (top + (big ? 24 : mid ? 17 : 11)) + '" stroke="' + INK + '" stroke-width="' + (big ? 3 : 1.6) + '" stroke-linecap="round"/>';
    if (big) s += '<text class="ax" x="' + x + '" y="' + (top + 48) + '" font-size="19" text-anchor="middle" fill="' + INK + '">' + (o.fmt ? o.fmt(v) : v) + '</text>'; }
  if (o.unit) s += '<text class="ax" x="' + f1(X(o.lo) + 11) + '" y="' + (top + 48) + '" font-size="14" fill="#8A6A1E">' + o.unit + '</text>';
  if (o.from != null) s += '<ellipse cx="' + f1(X(o.from)) + '" cy="' + (top + 42) + '" rx="' + (9 + String(o.fmt ? o.fmt(o.from) : o.from).length * 5.5) + '" ry="15" fill="none" stroke="#8B7BEA" stroke-width="3.500"/>';
  /* the hands-on walk along the ruler: each tap moves one mark along; the number above it counts along, and the last is left as "?" */
  if (o.walk) { const k = o.walk, done = k.done || 0, lab = k.labels || [], xs = i => X(k.from + k.by * i), x0 = Math.min(xs(0), xs(k.n)), x1 = Math.max(xs(0), xs(k.n));
    s += '<rect' + (k.live ? ' class="pulse"' : '') + ' x="' + f1(x0 - 5) + '" y="' + (top - 10) + '" width="' + f1(x1 - x0 + 10) + '" height="12" rx="6" fill="#8B7BEA" opacity=".28"/>';
    for (let i = 1; i <= done; i++) { const a = xs(i - 1), b = xs(i), wide = Math.abs(b - a) >= 14;
      s += wide ? '<path d="M' + f1(a) + ' ' + (top - 4) + 'Q' + f1((a + b) / 2) + ' ' + (top - 4 - Math.min(26, Math.abs(b - a) * .7)) + ' ' + f1(b) + ' ' + (top - 4) + '" fill="none" stroke="#6453C9" stroke-width="3" stroke-linecap="round"/>' : '';
      s += '<circle cx="' + f1(b) + '" cy="' + (top - 4) + '" r="' + (i === done ? 6 : wide ? 3.5 : 2.6) + '" fill="#6453C9"/>'; }
    if (done) { const t = String(lab[done - 1]), last = t === '?', wd = 20 + t.length * 10.5, x = clamp(xs(done), wd / 2 + 4, W0 - wd / 2 - 4);
      s += '<rect x="' + f1(x - wd / 2) + '" y="' + (top - 42) + '" width="' + wd + '" height="28" rx="14" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + f1(x) + '" y="' + (top - 21.5) + '" font-size="18" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; }
    if (k.live) s += '<rect class="hot" x="0" y="0" width="' + W0 + '" height="' + (top + hgt + 8) + '" fill="transparent"/>'; }
  /* cap: words under the scale, for a finished picture whose pins fill the space above it */
  if (o.cap) s += '<text class="ax" x="' + W0 / 2 + '" y="' + (top + hgt + 30) + '" font-size="19" font-weight="700" text-anchor="middle" fill="' + INK + '">' + o.cap + '</text>';
  V.put(el, W0, top + hgt + (o.cap ? 40 : 8), s);
};

/* ---------- a box of macarons to pick from without looking: chance. Colour is never the only clue to a count: every count is made by tapping.
   o: items [colour letters, in the order they sit in the box], hi (ring every one of that colour), ghost [colour letters] (extra ones drawn as empty outlines until tapped: "how many more?"), cap (words underneath),
      walk { order [indices into items, then into ghost] } (HANDS.pic: she taps each one in any order; it takes the next number, and the last is "?") ---------- */
const MAC = { p: { name: 'pink', a: '#FF9DBB', b: '#E0638A' }, g: { name: 'green', a: '#8FDFA6', b: '#3FA36B' }, y: { name: 'yellow', a: '#FFE07A', b: '#D9A514' }, v: { name: 'purple', a: '#C2B4F7', b: '#7B68D9' }, b: { name: 'brown', a: '#C99A6B', b: '#7A5230' } };
const macSvg = (c, cx, cy, ghost) => { const m = MAC[c], st = ghost ? 'fill="#fff" stroke="#B9C0D0" stroke-width="2" stroke-dasharray="5 4"' : 'fill="' + m.a + '" stroke="' + m.b + '" stroke-width="2"';
  return '<path d="M' + (cx - 24) + ' ' + (cy - 4) + 'q0-15 24-15t24 15z" ' + st + '/><rect x="' + (cx - 22) + '" y="' + (cy - 4) + '" width="44" height="8" rx="4" fill="' + (ghost ? '#fff' : '#FFF6E6') + '" stroke="' + (ghost ? '#B9C0D0' : m.b) + '" stroke-width="1.500"' + (ghost ? ' stroke-dasharray="5 4"' : '') + '/><path d="M' + (cx - 24) + ' ' + (cy + 4) + 'q0 14 24 14t24-14z" ' + st + '/>' +
    (ghost ? '' : '<path d="M' + (cx - 13) + ' ' + (cy - 12) + 'q7-4 15-3" stroke="#fff" stroke-width="2.500" fill="none" stroke-linecap="round" opacity=".7"/>'); };
const macIcon = c => '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' + macSvg(c, 32, 32) + '</svg>';
V.jar = (el, o) => {
  const items = o.items, ghost = o.ghost || [], all = items.concat(ghost), n = all.length, cols = n <= 4 ? n : n <= 10 ? Math.ceil(n / 2) : Math.ceil(n / 3), rows = Math.ceil(n / cols), cw = 62, ch = 52, W0 = Math.max(300, cols * cw + 44), ox = (W0 - cols * cw) / 2, oy = 22;
  const at = i => [ox + (i % cols) * cw + cw / 2, oy + Math.floor(i / cols) * ch + ch / 2 + 2], H0 = oy + rows * ch + 16;
  let s = '<rect x="' + (ox - 14) + '" y="8" width="' + (cols * cw + 28) + '" height="' + (H0 - 8) + '" rx="14" fill="#FFF6E6" stroke="' + INK + '" stroke-width="3"/><path d="M' + (ox - 14) + ' 20h' + (cols * cw + 28) + '" stroke="#E86AA6" stroke-width="5"/>';
  const k = o.walk, seq = k ? (k.seq || Array.from({ length: k.done || 0 }, (_, i) => i)) : [], lab = k ? (k.labels || []) : [], pos = i => k ? k.order.indexOf(i) : -1;
  all.forEach((c, i) => { const p = at(i), w = pos(i), tapped = w >= 0 && seq.includes(w), isGhost = i >= items.length;
    s += macSvg(c, p[0], p[1], isGhost && !tapped);
    if (o.hi && c === o.hi && !isGhost && !k) s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="29" ry="24" fill="none" stroke="#8B7BEA" stroke-width="3.500" stroke-dasharray="6 5"/>';
    if (tapped) { const t = String(lab[seq.indexOf(w)]), last = t === '?'; s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + p[0] + '" y="' + (p[1] + 6) + '" font-size="' + (t.length > 1 ? 15 : 18) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; }
    else if (k && k.live && w >= 0) s += '<ellipse class="hot" data-i="' + w + '" cx="' + p[0] + '" cy="' + p[1] + '" rx="28" ry="23" fill="#6453C9"/>'; });
  let y = H0;
  if (o.cap) { s += '<text class="ax" x="' + (W0 / 2) + '" y="' + (y + 28) + '" font-size="22" text-anchor="middle" fill="' + INK + '">' + o.cap + '</text>'; y += 36; }
  V.put(el, W0, y + 6, s);
};
/* many picks, put into equal groups: in every group of d picks, about one is the colour asked about. o: n (picks), d (picks in a group), col, walk { order [group numbers] } (she taps each group; one of its picks takes the colour) */
V.picks = (el, o) => {
  const groups = o.n / o.d, cols = Math.min(groups, o.d >= 4 ? 2 : 3), rows = Math.ceil(groups / cols), r = 11, gw = o.d * (r * 2 + 6) + 14, gh = 50, W0 = Math.max(300, cols * (gw + 12) + 20), ox = (W0 - cols * (gw + 12) + 12) / 2;
  const k = o.walk, seq = k ? (k.seq || Array.from({ length: k.done || 0 }, (_, i) => i)) : [], lab = k ? (k.labels || []) : [], m = MAC[o.col]; let s = '';
  for (let g = 0; g < groups; g++) { const x = ox + (g % cols) * (gw + 12), y = 10 + Math.floor(g / cols) * (gh + 22), on = seq.includes(g);
    s += '<rect x="' + x + '" y="' + y + '" width="' + gw + '" height="' + gh + '" rx="12" fill="' + (on ? '#EEEBFF' : '#fff') + '" stroke="' + (on ? '#8B7BEA' : '#C9CEDA') + '" stroke-width="2.500"/>';
    for (let i = 0; i < o.d; i++) s += '<circle cx="' + (x + 7 + r + 3 + i * (r * 2 + 6)) + '" cy="' + (y + gh / 2) + '" r="' + r + '" fill="' + (on && i === 0 ? m.a : '#F2F4F8') + '" stroke="' + (on && i === 0 ? m.b : '#B9C0D0') + '" stroke-width="2"/>';
    if (on) { const t = String(lab[seq.indexOf(g)]), last = t === '?'; s += '<circle cx="' + (x + gw / 2) + '" cy="' + (y + gh + 6) + '" r="13" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2.500"/><text x="' + (x + gw / 2) + '" y="' + (y + gh + 11.5) + '" font-size="16" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; }
    else if (k && k.live) s += '<rect class="hot" data-i="' + g + '" x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (gw - 4) + '" height="' + (gh - 4) + '" rx="10" fill="#6453C9"/>'; }
  V.put(el, W0, 10 + rows * (gh + 22) + 4, s);
};

/* ---------- square tiles in equal rows, for factors and primes. Tiles that do not fill a row are set apart in another colour: the left-overs.
   o: n, per (tiles in a row), loose (a heap in tens, not yet put in rows), mode ('rows' | 'cols' | 'left': what she taps to count), walk, cap ---------- */
V.tiles = (el, o) => {
  const n = o.n, per = o.loose ? Math.min(10, n) : o.per, rows = Math.floor(n / per), rem = n % per, sz = per > 20 ? 11 : per > 14 ? 14 : per > 10 ? 19 : 25, gap = sz > 15 ? 3 : 2, st = sz + gap, sideL = 34;
  const W0 = Math.max(240, per * st + sideL + 26), ox = (W0 - per * st + gap) / 2 + (o.mode === 'rows' ? sideL / 2 - 6 : 0), oy = o.mode === 'cols' ? 34 : 12, remGap = rem && !o.loose ? 12 : 0;
  const k = o.walk, seq = k ? (k.seq || Array.from({ length: k.done || 0 }, (_, i) => i)) : [], lab = k ? (k.labels || []) : [];
  const at = i => { const r = Math.floor(i / per), c = i % per; return [ox + c * st, oy + r * st + (!o.loose && r === rows ? remGap : 0), r, c]; };
  let s = '';
  for (let i = 0; i < n; i++) { const p = at(i), left = !o.loose && p[2] === rows; s += '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + sz + '" height="' + sz + '" rx="' + (sz > 15 ? 5 : 3) + '" fill="' + (left ? '#FF9A8C' : p[2] % 2 ? '#8ED0F4' : '#5CC8D6') + '" stroke="' + INK + '" stroke-width="' + (sz > 15 ? 1.5 : 1) + '"/>'; }
  const bubble = (x, y, t) => { const last = t === '?'; return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="' + (String(t).length > 1 ? 12 : 15) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; };
  if (k && o.mode) { const things = o.mode === 'rows' ? rows : o.mode === 'cols' ? per : rem;
    for (let j = 0; j < things; j++) { const w = seq.indexOf(j), tapped = w >= 0; let x, y, ww, hh, bx, by;
      if (o.mode === 'rows') { x = ox - 3; y = oy + j * st - 2; ww = per * st - gap + 6; hh = sz + 4; bx = ox - 20; by = y + hh / 2; }
      else if (o.mode === 'cols') { x = ox + j * st - 2; y = oy - 3; ww = sz + 4; hh = rows * st - gap + 6; bx = x + ww / 2; by = oy - 18; }
      else { const p = at(rows * per + j); x = p[0] - 2; y = p[1] - 2; ww = sz + 4; hh = sz + 4; bx = p[0] + sz / 2; by = p[1] + sz / 2; }
      if (tapped) s += '<rect x="' + x + '" y="' + y + '" width="' + ww + '" height="' + hh + '" rx="6" fill="none" stroke="#6453C9" stroke-width="2.500"/>' + bubble(bx, by, String(lab[w]));
      else if (k.live) s += '<rect class="hot" data-i="' + j + '" x="' + x + '" y="' + y + '" width="' + ww + '" height="' + hh + '" rx="6" fill="#6453C9"/>'; } }
  let H0 = oy + (rows + (rem ? 1 : 0)) * st + remGap + 8;
  if (o.cap) { s += '<text class="ax" x="' + (W0 / 2) + '" y="' + (H0 + 22) + '" font-size="20" text-anchor="middle" fill="' + INK + '">' + o.cap + '</text>'; H0 += 32; }
  V.put(el, W0, H0, s);
};
/* three bags of tiles, each with its number on it: the choices of a "which one is prime?" question, shown without sorting them */
V.bags = (el, nums) => { let s = ''; nums.forEach((n, i) => { const x = 60 + i * 110; s += '<path d="M' + (x - 34) + ' 40q-10 46 4 62h60q14-16 4-62z" fill="#E9C98A" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/><path d="M' + (x - 26) + ' 40q26 12 52 0" fill="none" stroke="' + INK + '" stroke-width="2.500"/><path d="M' + (x - 16) + ' 32q16-12 32 0l-6 10h-20z" fill="#D2A363" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/><text x="' + x + '" y="84" font-size="26" text-anchor="middle" fill="' + INK + '">' + n + '</text>'; });
  V.put(el, nums.length * 110 + 10, 116, s); };

/* ---------- ratio: equal groups, each with so many of one thing and so many of another ("1 panda eats 3 sticks").
   o: k (groups), na, nb (how many of each thing in a group; either may be 0), A, B (their pictures), per (B things in a row), pile { n, art } (a loose heap of things under the groups: what she has to share out or feed),
      cap, mode 'sets' (tap each group) | 'in' (tap each thing in the first group; inAll counts the A things too), walk (see HANDS.pic). The picture never prints a number of its own ---------- */
const STICK_ART = { svg: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M13 30 19 3" stroke="#4E9A45" stroke-width="5.500" stroke-linecap="round"/><path d="M12.500 21.500l6 1.200M14.600 12l6 1.200" stroke="#2F6E2E" stroke-width="1.600" stroke-linecap="round"/><path d="M19 10q7-7 11-3-4 6-11 3z" fill="#6DBF5B"/><path d="M14 19q-7-5-11 0 5 4 11 0z" fill="#6DBF5B"/></svg>' };
V.ratio = (el, o) => {
  const k = o.k, na = o.na || 0, nb = o.nb || 0, sa = 32, sb = 25, perB = o.per || (nb <= 5 ? nb : Math.ceil(nb / 2)), rowsB = nb ? Math.ceil(nb / perB) : 0, gap = 12;
  const cw = Math.max(na * (sa + 2), perB * (sb + 3), 40) + 16, ch = 10 + (na ? sa + 4 : 0) + rowsB * (sb + 3) + 6;
  const cols = Math.min(k, Math.max(1, Math.floor(456 / (cw + gap)))), rows = Math.ceil(k / cols);
  const P = o.pile, ps = 24, pPer = P ? Math.min(P.n, 10) : 0, pRows = P ? Math.ceil(P.n / pPer) : 0, pw = P ? pPer * (ps + 3) + 20 : 0, ph = P ? pRows * (ps + 3) + 14 : 0;
  const W0 = Math.max(380, cols * (cw + gap) + gap + 8, pw + 24), ox = (W0 - cols * (cw + gap) + gap) / 2, oy = 16;
  const wk = o.walk, seq = wk ? (wk.seq || Array.from({ length: wk.done || 0 }, (_, i) => i)) : [], lab = wk ? (wk.labels || []) : [];
  const bubble = (x, y, t) => { const last = t === '?'; return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="' + (last ? '#FFC83D' : '#6453C9') + '" stroke="#fff" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" font-size="' + (String(t).length > 1 ? 12 : 15) + '" text-anchor="middle" fill="' + (last ? INK : '#fff') + '">' + t + '</text>'; };
  let s = '', top = '';
  for (let j = 0; j < k; j++) {
    const r = Math.floor(j / cols), c = j % cols, inRow = r === rows - 1 ? k - r * cols : cols, x = ox + c * (cw + gap) + (cols - inRow) * (cw + gap) / 2, y = oy + r * (ch + gap), spots = [];
    s += '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '" rx="12" fill="#FFF8E6" stroke="#E2C98B" stroke-width="2"/>';
    for (let i = 0; i < na; i++) { const ax = x + cw / 2 - na * (sa + 2) / 2 + i * (sa + 2) + 1; s += V.pic(o.A, ax, y + 8, sa); if (o.inAll) spots.push([ax, y + 8, sa]); }
    const by = y + 8 + (na ? sa + 4 : 0);
    for (let i = 0; i < nb; i++) { const row = Math.floor(i / perB), col = i % perB, here = row === rowsB - 1 ? nb - row * perB : perB, bx = x + cw / 2 - here * (sb + 3) / 2 + col * (sb + 3) + 1.5; s += V.pic(o.B, bx, by + row * (sb + 3), sb); spots.push([bx, by + row * (sb + 3), sb]); }
    if (wk && o.mode === 'sets') { const w = seq.indexOf(j);
      if (w >= 0) top += '<rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (cw + 4) + '" height="' + (ch + 4) + '" rx="13" fill="none" stroke="#6453C9" stroke-width="2.500"/>' + bubble(x + 3, y + 3, String(lab[w]));
      else if (wk.live) top += '<rect class="hot" data-i="' + j + '" x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '" rx="12" fill="#6453C9"/>'; }
    if (wk && o.mode === 'in' && j === 0) spots.forEach((p, i) => { const w = seq.indexOf(i);
      if (w >= 0) top += bubble(p[0] + p[2] / 2, p[1] + p[2] / 2, String(lab[w]));
      else if (wk.live) top += '<rect class="hot" data-i="' + i + '" x="' + (p[0] - 1) + '" y="' + (p[1] - 1) + '" width="' + (p[2] + 2) + '" height="' + (p[2] + 2) + '" rx="7" fill="#6453C9"/>'; });
  }
  let H0 = oy + rows * (ch + gap) - gap + 10;
  if (P) { const px = (W0 - pw) / 2, py = H0 + 8; s += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" rx="12" fill="#EAF4FB" stroke="#B9D3E8" stroke-width="2" stroke-dasharray="6 5"/>';
    for (let i = 0; i < P.n; i++) { const row = Math.floor(i / pPer), col = i % pPer, here = row === pRows - 1 ? P.n - row * pPer : pPer; s += V.pic(P.art, (W0 - here * (ps + 3)) / 2 + col * (ps + 3) + 1.5, py + 7 + row * (ps + 3), ps); }
    H0 = py + ph + 10; }
  if (o.cap) { top += '<text class="ax" x="' + (W0 / 2) + '" y="' + (H0 + 20) + '" font-size="20" text-anchor="middle" fill="' + INK + '">' + o.cap + '</text>'; H0 += 30; }
  V.put(el, W0, H0, s + top);
};
