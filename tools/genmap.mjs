// Generates gen/map.json: projected SVG paths for every country (Natural Earth 110m) in a 1000x520 viewBox.
import fs from 'fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json','utf8'));
const fc = feature(topo, topo.objects.countries);
fc.features = fc.features.filter(f => f.id !== '010'); // drop Antarctica
const W = 1000, H = 520;
const proj = geoNaturalEarth1().fitExtent([[8,8],[W-8,H-8]], fc);
const path = geoPath(proj);
const round = d => d.replace(/-?\d+\.\d+/g, n => (+n).toFixed(1));
const out = { w: W, h: H, c: {} };
for (const f of fc.features) {
  const d = path(f); if (!d) continue;
  const [cx, cy] = path.centroid(f);
  out.c[f.id] = { n: f.properties.name, d: round(d), x: +cx.toFixed(1), y: +cy.toFixed(1) };
}
const pt = (lat,lng) => proj([lng,lat]).map(v => +v.toFixed(1));
out.pt = { egypt: pt(26.8,30.8), japan: pt(36.2,138.2), greece: pt(39,22), nz: pt(-41.3,173), netherlands: pt(52.3,5.3), india: pt(21,79), china: pt(35.9,104.2), italy: pt(42.5,12.5), france: pt(46.6,2.4), brazil: pt(-10,-52), kenya: pt(0.3,38), australia: pt(-25.3,134), russia: pt(61.5,95), mexico: pt(23.6,-102.5), canada: pt(57,-104) };
fs.writeFileSync('gen/map.json', JSON.stringify(out));
console.log('countries', Object.keys(out.c).length, 'bytes', fs.statSync('gen/map.json').size, out.pt);
