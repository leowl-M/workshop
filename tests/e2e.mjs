// End-to-end checks in real Chromium. Usage: node e2e.mjs [checkName ...]
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const PAGE = new URL('../index.html', import.meta.url).href;
const checks = {};

checks.offline = async (browser) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/^https?:/, r => r.abort());
  const page = await ctx.newPage();
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  const hidden = await page.evaluate(() => {
    const bad = [];
    for (const sec of document.querySelectorAll('section.sec')) {
      const h = sec.querySelector('h1, h2');
      if (!h) { bad.push(`${sec.id}: no heading`); continue; }
      const cs = getComputedStyle(h);
      if (cs.opacity !== '1' || cs.visibility === 'hidden') bad.push(`${sec.id}: heading hidden`);
    }
    for (const el of document.querySelectorAll('[data-at]'))
      if (getComputedStyle(el).opacity !== '1') bad.push(`${el.closest('section')?.id} [data-at=${el.dataset.at}] hidden`);
    return bad;
  });
  assert.equal(await page.locator("section.sec").count(), 10);
  assert.deepEqual(hidden, []);
  await ctx.close();
};

checks.overflow = async (browser) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(PAGE);
  await page.waitForTimeout(800);
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(w <= 375, `scrollWidth ${w} > 375`);
  await ctx.close();
};


const only = process.argv.slice(2);
const browser = await chromium.launch();
let failed = 0;
for (const [name, fn] of Object.entries(checks)) {
  if (only.length && !only.includes(name)) continue;
  try { await fn(browser); console.log(`✓ ${name}`); }
  catch (e) { failed++; console.log(`✗ ${name}: ${e.message.split('\n').slice(0, 6).join('\n  ')}`); }
}
await browser.close();
process.exit(failed ? 1 : 0);
