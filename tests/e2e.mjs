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

// ---------- Presenter (motion on, needs network for GSAP) ----------
const settle = (page) => page.evaluate(() => new Promise(res => {
  let last = -1, same = 0;
  const t = setInterval(() => {
    if (Math.abs(scrollY - last) < 1) { if (++same >= 4) { clearInterval(t); res(); } }
    else { same = 0; last = scrollY; }
  }, 100);
}));
const pos = async (page) => (await page.textContent('#pos')).trim();
async function open(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  await page.goto(PAGE);
  await page.waitForFunction(() => window.presenter && window.presenter.stops.length > 0);
  await page.waitForTimeout(300);
  return { ctx, page };
}
async function press(page, key, n = 1) {
  for (let i = 0; i < n; i++) { await page.keyboard.press(key); await settle(page); }
  await page.waitForTimeout(150);
}

checks.keys = async (browser) => {
  const { ctx, page } = await open(browser);
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), true);
  assert.equal(await pos(page), '01');
  const seen = [];
  for (let i = 0; i < 6; i++) { await press(page, 'ArrowDown'); seen.push(await pos(page)); }
  assert.deepEqual(seen, ['02 · 1/4', '02 · 2/4', '02 · 3/4', '02 · 4/4', '03 · 1/5', '03 · 2/5']);
  await press(page, 'ArrowUp');
  assert.equal(await pos(page), '03 · 1/5');
  await ctx.close();
};

checks.rapid = async (browser) => {
  const { ctx, page } = await open(browser);
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(2000); await settle(page);
  assert.equal(await pos(page), '02 · 4/4');
  await ctx.close();
};

checks.resize = async (browser) => {
  const { ctx, page } = await open(browser);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(600);
  await press(page, 'ArrowDown');
  assert.equal(await pos(page), '02 · 1/4');
  await ctx.close();
};

checks.focus = async (browser) => {
  const { ctx, page } = await open(browser);
  const btn = page.locator('.lenses button').first();
  if (await btn.count()) {
    await btn.focus();
    const before = await page.evaluate(() => scrollY);
    await page.keyboard.press('Space'); await settle(page);
    assert.ok(await page.evaluate(() => scrollY) !== before, 'Space on focused button did not advance');
  }
  await ctx.close();
};

checks.reduced = async (browser) => {
  const { ctx, page } = await open(browser, { reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), false);
  await press(page, 'ArrowDown');
  assert.equal(await pos(page), '02');
  await ctx.close();
};

checks.hero = async (browser) => {
  const { ctx, page } = await open(browser);
  await page.waitForFunction(() => document.getElementById('hero-gl').dataset.ready === '1', null, { timeout: 8000 });
  assert.ok(await page.evaluate(() => document.getElementById('hero-gl').clientWidth > 0));
  await ctx.close();
};

checks.heroOffline = async (browser) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/^https?:/, r => r.abort());
  const page = await ctx.newPage();
  await page.goto(PAGE);
  await page.waitForFunction(() => getComputedStyle(document.getElementById('hero-gl')).display === 'none', null, { timeout: 8000 });
  assert.equal(await page.evaluate(() => getComputedStyle(document.getElementById('s01-h')).opacity), '1');
  await ctx.close();
};

async function jump(page, id, step = 1) {
  await page.evaluate(([id, step]) => {
    const s = window.presenter.stops.find(s => s.id === id && s.step === step);
    window.scrollTo(0, s.y);
  }, [id, step]);
  await settle(page); await page.waitForTimeout(200);
}

checks.inventory = async (browser) => {
  const { ctx, page } = await open(browser);
  await jump(page, 's04');
  await page.click('#inv-filters [data-family="3d"]');
  await page.waitForTimeout(500);
  assert.equal(await page.locator('#inv-grid .skill:visible').count(), 11);
  assert.equal(await page.getAttribute('#inv-filters [data-family="3d"]', 'aria-pressed'), 'true');
  const first = page.locator('#inv-grid .skill:visible').first();
  await first.focus();
  const what = await page.evaluate(() => {
    const el = [...document.querySelectorAll('#inv-grid .skill')].find(b => !b.hidden);
    return window.SKILLS[+el.dataset.i].what;
  });
  assert.ok((await page.textContent('#inv-detail')).includes(what));
  await ctx.close();
};

checks.lens = async (browser) => {
  const { ctx, page } = await open(browser);
  await jump(page, 's05', 1);
  const lens = () => page.getAttribute('#lens-stage', 'data-lens');
  const seq = [await lens()];
  for (let i = 0; i < 3; i++) { await press(page, 'ArrowDown'); seq.push(await lens()); }
  assert.deepEqual(seq, ['base', 'brutalist', 'soft', 'editorial']);
  await page.click('.lenses [data-lens="soft"]');
  assert.equal(await lens(), 'soft');
  assert.equal(await page.getAttribute('.lenses [data-lens="soft"]', 'aria-pressed'), 'true');
  await ctx.close();
};

checks.cases = async (browser) => {
  const { ctx, page } = await open(browser);
  await jump(page, 's07', 3);
  assert.equal(await pos(page), '07 · 3/5');
  await page.waitForTimeout(800);
  const box = await page.evaluate(() => [...document.querySelectorAll('#cases-track .case')].map(c => {
    const r = c.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)];
  }));
  const vw = 1440;
  assert.ok(box[2][0] >= 0 && box[2][1] <= vw, `card 3 not fully visible: ${box[2]}`);
  assert.ok(box[0][1] <= 240, `card 1 still visible: ${box[0]}`); // 240 = sidebar width
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
