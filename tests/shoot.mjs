// Screenshot helper: node shoot.mjs <outDir> [w h] [selector...]  (full page if no selector)
import { chromium } from 'playwright';
const [out, w = 1440, h = 900, ...sels] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(new URL('../index.html', import.meta.url).href);
await p.waitForTimeout(1500);
if (!sels.length) await p.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
for (const s of sels) {
  await p.evaluate(sel => { const el = document.querySelector(sel); window.scrollTo(0, el.getBoundingClientRect().top + scrollY); }, s);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/${s.replace(/\W/g, '')}-${w}.png` });
}
await b.close();
