// Layout QA: at every stop (and halfway between stops) report visible text that is cut by the screen,
// cut by its container, or overlapping other visible text. Usage: node qa.mjs [w h] [--mid]
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
const args = process.argv.slice(2);
const mid = args.includes('--mid');
const [w = 1440, h = 900] = args.filter(a => !a.startsWith('--')).map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h } });
const errors = [];
p.on('pageerror', e => errors.push(e.message));
await p.goto(await serve() + 'index.html');
await p.waitForFunction(() => window.site && window.site.ready, null, { timeout: 20000 });
await p.waitForTimeout(1200);
const stops = await p.evaluate(() => window.site.stops);
const points = mid ? stops.slice(0, -1).map((y, i) => Math.round((y + stops[i + 1]) / 2)) : stops;

const scan = () => {
  const vw = innerWidth, vh = innerHeight;
  const vis = (el) => {
    let o = 1;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      o *= +cs.opacity;
      const cp = cs.clipPath;
      if (cp && cp !== 'none' && /inset\((?:100%|[^)]*100%)/.test(cp)) return 0;
    }
    return o;
  };
  // Leaf-ish text blocks: elements with their own non-empty text.
  const blocks = [...document.querySelectorAll('main *, .rail *')].filter(el => {
    if (el.closest('.lens-stage, .pdemo, .art, .doc pre, .mq, .tornado, .ring, .mini-cyl, svg')) return false;
    return [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  }).map(el => {
    const r = el.getBoundingClientRect();
    return { el, r, o: vis(el), label: `${el.tagName.toLowerCase()}.${el.className || ''} "${el.textContent.trim().slice(0, 40)}"` };
  }).filter(x => x.o > .6 && x.r.width > 2 && x.r.height > 2 && x.r.bottom > 0 && x.r.top < vh && x.r.right > 0 && x.r.left < vw);
  const out = [];
  for (const x of blocks) {
    const { r } = x;
    if (r.left < -2 || r.right > vw + 2 || r.top < -2 || r.bottom > vh + 2) out.push(`CUT-SCREEN ${x.label} [${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.right)},${Math.round(r.bottom)}]`);
    for (let a = x.el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (a.classList.contains('w')) continue;
      const cs = getComputedStyle(a);
      if (cs.overflow === 'visible' && cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (r.right > ar.right + 3 || r.bottom > ar.bottom + 3 || r.left < ar.left - 3 || r.top < ar.top - 3) {
        out.push(`CUT-BOX ${x.label} by ${a.tagName.toLowerCase()}.${a.className}`); break;
      }
    }
  }
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
    const A = blocks[i], B = blocks[j];
    if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
    const ix = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
    const iy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
    if (ix <= 2 || iy <= 2) continue;
    const small = Math.min(A.r.width * A.r.height, B.r.width * B.r.height);
    if (ix * iy > small * .15) out.push(`OVERLAP ${A.label} × ${B.label}`);
  }
  return [...new Set(out)];
};

const report = [];
for (let k = 0; k < points.length; k++) {
  await p.evaluate(y => window.site.scrollToY(y, { immediate: true }), points[k]);
  await p.waitForTimeout(mid ? 500 : 1300);
  const found = await p.evaluate(scan);
  const where = await p.evaluate(() => window.site.chapter);
  if (found.length) report.push(`#${k} ${where} y=${points[k]}\n  ` + found.join('\n  '));
}
console.log(`${w}x${h}${mid ? ' mid' : ''}: ${points.length} points, ${report.length} with issues`);
console.log(report.join('\n'));
if (errors.length) console.log('ERRORS', errors);
await b.close();
