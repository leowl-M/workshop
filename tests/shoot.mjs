// Walk every stop with the keyboard and screenshot each. Usage: node shoot.mjs <outDir> [w h]
import { chromium } from 'playwright';
const [out, w = 1440, h = 900] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(new URL('../index.html', import.meta.url).href);
await p.waitForFunction(() => window.site && window.site.ready, null, { timeout: 15000 });
await p.waitForTimeout(1500);
const n = await p.evaluate(() => window.site.stops.length);
console.log('stops', n, 'height', await p.evaluate(() => document.documentElement.scrollHeight));
for (let k = 0; k < n; k++) {
  if (k) { await p.keyboard.press('ArrowDown'); }
  await p.waitForTimeout(1700);
  await p.screenshot({ path: `${out}/${String(k).padStart(2, '0')}.jpg`, quality: 60 });
}
console.log('errors', errs);
await b.close();
