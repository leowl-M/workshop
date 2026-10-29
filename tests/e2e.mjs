// End-to-end checks in real Chromium. Usage: node e2e.mjs [checkName ...]
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const PAGE = new URL('../index.html', import.meta.url).href;
const checks = {};

async function open(browser, opts = {}, hash = '') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(PAGE + hash);
  await page.waitForFunction(() => window.site && window.site.ready, null, { timeout: 15000 });
  await page.waitForTimeout(400);
  return { ctx, page, errors };
}
// Wait until the (smooth) scroll stops moving.
const settle = (page) => page.evaluate(() => new Promise(res => {
  let last = -1, same = 0;
  const t = setInterval(() => {
    if (Math.abs(scrollY - last) < 1) { if (++same >= 5) { clearInterval(t); res(scrollY); } }
    else { same = 0; last = scrollY; }
  }, 80);
}));
const stops = (page) => page.evaluate(() => window.site.stops);
async function press(page, key, n = 1) {
  for (let i = 0; i < n; i++) await page.keyboard.press(key);
  return settle(page);
}
const near = (a, b, msg) => assert.ok(Math.abs(a - b) <= 3, `${msg}: ${a} vs ${b}`);
async function goToSection(page, id) {
  await page.evaluate(id => {
    const el = document.getElementById(id);
    window.site.scrollToY(el.getBoundingClientRect().top + scrollY, { immediate: true });
  }, id);
  await page.waitForTimeout(300);
}

checks.offline = async (browser) => {
  // No network at all: fonts, libraries, textures and screenshots are local.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const blocked = [];
  await ctx.route(/^https?:/, r => { blocked.push(r.request().url()); r.abort(); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(PAGE);
  await page.waitForFunction(() => window.site && window.site.ready, null, { timeout: 15000 });
  assert.ok(await page.evaluate(() => document.fonts.check('900 40px Archivo')), 'Archivo not loaded');
  assert.equal(await page.getAttribute('#keys-gl', 'data-ready'), '1', '3D keyboard not running');
  for (const id of ['chess-gl', 'base-gl', 'knight-gl', 'groups-gl', 'figma-gl', 'prisma-gl'])
    assert.equal(await page.getAttribute('#' + id, 'data-ready'), '1', id + ' not running');
  assert.deepEqual(blocked, []);
  assert.deepEqual(errors, []);
  await ctx.close();
};

checks.structure = async (browser) => {
  const { ctx, page, errors } = await open(browser);
  assert.equal(await page.locator('section.project').count(), 3, 'one pinned chapter per app');
  assert.ok(await page.locator('#g-app ~ #p-photoshop, #g-app ~ .pin-spacer #p-photoshop').count() >= 1 || await page.locator('#p-photoshop').count() === 1, 'Photoshop is an app');
  assert.equal(await page.locator('#mosaic, .pfcard, #tornado, #gl, .cursor, .cursor-pill').count(), 0, 'no bento, no cards, no custom cursor');
  assert.equal(await page.locator('.pill, .where, #chapters, #rail button').count(), 0, 'one indicator only');
  assert.equal(await page.locator('#sphere a[href^="https://"]').count(), 21, 'every app online in the sphere');
  assert.equal(await page.locator('.kit-tabs [role="tab"]').count(), 7);
  assert.equal(await page.locator('.kit-list li').count(), 50, 'the whole kit');
  assert.equal(await page.locator('.mq, .keys-hint, .kb-hint, #pattern-gl, .sphere-preview, .pdemo').count(), 0, 'removed on request');
  assert.equal(await page.locator('#sphere .cube3').count(), 21, 'a cube over every name');
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.kit-panel')).overflowY), 'visible', 'kit cards never scroll');
  assert.equal(await page.locator('#metodo .mstep').count(), 9, 'nine steps');
  assert.equal(await page.locator('#metodo .mbase #base-gl').count(), 1, 'then the solid base, no real project');
  assert.ok((await stops(page)).length >= 50, 'stops');
  assert.ok(await page.evaluate(() => document.querySelectorAll('.pin-spacer').length >= 12), 'pins');
  const broken = await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('.wall img, .doc img')];
    imgs.forEach(i => { i.loading = 'eager'; });
    await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    return imgs.filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
  });
  assert.deepEqual(broken, []);
  assert.deepEqual(errors, []);
  await ctx.close();
};

checks.keys = async (browser) => {
  const { ctx, page } = await open(browser);
  const s = await stops(page);
  near(await press(page, 'ArrowDown'), s[1], 'first press');
  near(await press(page, 'ArrowRight'), s[2], 'second press');
  near(await press(page, 'ArrowUp'), s[1], 'back');
  near(await press(page, 'End'), s[s.length - 1], 'End');
  near(await press(page, 'Home'), s[0], 'Home');
  await ctx.close();
};

checks.rapid = async (browser) => {
  const { ctx, page } = await open(browser);
  const s = await stops(page);
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowDown');
  near(await settle(page), s[3], 'three quick presses = three stops');
  await ctx.close();
};

checks.themes = async (browser) => {
  const { ctx, page } = await open(browser);
  const seen = new Set();
  const s = await stops(page);
  for (let i = 0; i < Math.min(s.length, 12); i++) {
    await page.evaluate(y => window.site.scrollToY(y, { immediate: true }), s[i]);
    await page.waitForTimeout(120);
    seen.add(await page.evaluate(() => document.body.dataset.theme));
  }
  for (const t of ['deep', 'cream', 'blue']) assert.ok(seen.has(t), `theme ${t} never shown`);
  await ctx.close();
};

checks.modal = async (browser) => {
  const { ctx, page } = await open(browser);
  await goToSection(page, 'p-figma');
  await page.evaluate(() => window.site.open('export'));
  await page.waitForSelector('#modal:not([hidden])');
  assert.equal(await page.textContent('#modal-title'), 'Export');
  assert.match(await page.textContent('#modal-media'), /IMG-02/);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.textContent('#modal-title'), 'Type & Color Swap', 'arrows move between plugins, not slides');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
  assert.equal(await page.textContent('#modal-title'), 'Modulink', 'Photoshop is not among the plugins');
  const y = await page.evaluate(() => scrollY);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  assert.ok(await page.locator('#modal').isHidden());
  assert.equal(await page.evaluate(() => scrollY), y, 'page did not move under the modal');
  await ctx.close();
};

checks.groups = async (browser) => {
  const { ctx, page } = await open(browser);
  await goToSection(page, 'progetti');
  await page.waitForTimeout(1600);
  await page.evaluate(() => window.site.groupKeys.press(1)); // the "App" key
  await page.waitForTimeout(500); await settle(page);
  assert.ok(Math.abs(await page.evaluate(() => document.getElementById('g-app').getBoundingClientRect().top)) < 5, 'App key jumps to the apps');
  await ctx.close();
};

checks.prisma = async (browser) => {
  const { ctx, page } = await open(browser, {}, '#p-prisma');
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.site.prismaKeys.press(1)); // ⌘ Strumenti
  await page.waitForTimeout(500);
  assert.equal(await page.getAttribute('#pplay', 'data-mode'), 'cmd');
  // Drag the file, the ⌘ fan opens around it; drop on "Comprimi".
  const f = await page.locator('#pplay .pp-file').boundingBox();
  await page.mouse.move(f.x + f.width / 2, f.y + f.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(700);
  const labels = await page.$$eval('#pplay .pp-bubble', b => b.map(x => x.textContent));
  assert.ok(labels.includes('Comprimi') && labels.includes('Ritaglia'), 'the real ⌘ fan for an image');
  const t = await page.locator('#pplay .pp-bubble', { hasText: 'Comprimi' }).boundingBox();
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 12 });
  await page.keyboard.down('Shift'); await page.waitForTimeout(400); // a held modifier switches the fan mid-drag
  assert.equal(await page.getAttribute('#pplay', 'data-mode'), 'shift');
  await page.keyboard.up('Shift');
  const w = await page.locator('#pplay .pp-bubble', { hasText: 'WEBP' }).boundingBox();
  await page.mouse.move(w.x + w.width / 2, w.y + w.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => window.site.prismaLast), 'WEBP');
  assert.match(await page.textContent('#pplay .pp-out li'), /copertina\.webp/);
  assert.equal(await page.locator('#psim, .ps-cursor').count(), 0, 'no fake desktop');
  await ctx.close();
};

checks.tabs = async (browser) => {
  const { ctx, page } = await open(browser);
  await goToSection(page, 'risorse');
  await page.click('#kt-1');
  assert.ok(await page.isVisible('#kp-1') && await page.isHidden('#kp-0'));
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getAttribute('#kt-2', 'aria-selected'), 'true', 'arrow keys move between tabs');
  await page.click('#kt-1');
  const btn = page.locator('#kp-1 .cmd').first();
  assert.match(await btn.textContent(), /^\/plugin /);
  await ctx.close();
};

checks.keyboard3d = async (browser) => {
  const { ctx, page } = await open(browser);
  assert.equal((await page.evaluate(() => window.site.keys)).length, 9);
  const s = await stops(page);
  await page.evaluate(y => window.site.scrollToY(y, { immediate: true }), s[1]);
  await page.waitForTimeout(1500);
  assert.equal(await page.evaluate(() => getComputedStyle(document.getElementById('keys-gl')).pointerEvents), 'auto', 'keys clickable once landed');
  await ctx.close();
};

checks.hash = async (browser) => {
  const { ctx, page } = await open(browser, {}, '#p-prisma');
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => window.site.chapter), 'Progetti');
  assert.ok(await page.isVisible('#p-prisma .pname'));
  await ctx.close();
};

checks.lens = async (browser) => {
  const { ctx, page } = await open(browser);
  const s = await stops(page);
  const seq = [];
  for (const y of s) {
    await page.evaluate(y => window.site.scrollToY(y, { immediate: true }), y);
    await page.waitForTimeout(150);
    if (await page.evaluate(() => window.site.chapter === 'Lenti'))
      seq.push(await page.getAttribute('#lens-stage', 'data-lens'));
  }
  assert.deepEqual(seq, ['base', 'brutalist', 'soft', 'editorial']);
  await ctx.close();
};

checks.project = async (browser) => {
  const { ctx, page } = await open(browser);
  // The stop after Composer's title shows the problem beat, and only that one.
  const s = await stops(page);
  const top = await page.evaluate(() => { const el = document.getElementById('p-composer'); return el.getBoundingClientRect().top + scrollY; });
  const k = s.findIndex(y => y >= top - 3);
  await page.evaluate(y => window.site.scrollToY(y, { immediate: true }), s[k + 1]);
  await page.waitForTimeout(1200);
  const visible = await page.evaluate(() => [...document.querySelectorAll('#p-composer .pbeat')].map(b => +getComputedStyle(b).opacity > .9));
  assert.deepEqual(visible, [false, true, false, false]);
  await ctx.close();
};

checks.reduced = async (browser) => {
  const { ctx, page } = await open(browser, { reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), false);
  assert.equal(await page.locator('.pin-spacer').count(), 0, 'no pins without motion');
  const s = await stops(page);
  near(await press(page, 'ArrowDown'), s[1], 'keys still step');
  assert.ok(await page.isVisible('#p-composer .pproblem'), 'project beats readable as a page');
  await ctx.close();
};

checks.copy = async (browser) => {
  const { ctx, page } = await open(browser, { permissions: ['clipboard-read', 'clipboard-write'] });
  await goToSection(page, 'risorse');
  await page.click('#kt-1');
  const btn = page.locator('#kp-1 .cmd').first();
  const text = await btn.getAttribute('data-copy');
  await btn.click();
  await page.waitForTimeout(100);
  assert.ok(await btn.evaluate(b => b.classList.contains('copied')));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), text);
  await ctx.close();
};

checks.qr = async (browser) => {
  const { ctx, page } = await open(browser);
  assert.ok(await page.locator('#qr img, #qr canvas').count() > 0, 'no QR rendered');
  assert.equal(await page.getAttribute('#share-link', 'href'), await page.evaluate(() => window.SHARE_URL));
  await ctx.close();
};

// ---------- Runner ----------
const only = process.argv.slice(2);
const browser = await chromium.launch();
let failed = 0;
for (const [name, fn] of Object.entries(checks)) {
  if (only.length && !only.includes(name)) continue;
  try { await fn(browser); console.log('ok  ', name); }
  catch (e) { failed++; console.log('FAIL', name, '\n     ', e.message.split('\n')[0]); }
}
await browser.close();
process.exit(failed ? 1 : 0);
