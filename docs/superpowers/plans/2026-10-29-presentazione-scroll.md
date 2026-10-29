# Presentazione a scroll "Design × AI" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, scroll-driven, 10-section web presentation (Italian) about Leonardo's design×AI method and skills, presentable live step-by-step with the keyboard and shareable as a link.

**Architecture:** Plain static files, no build step, opened via `file://` or any static host. Content lives in `data.js` (globals), the step/stop model in `nav.js` (pure, unit-tested in Node), motion in `main.js`. GSAP ScrollTrigger pins multi-step sections and writes `data-step` on each section; CSS transitions per `data-step` do the choreography (crisp over screen share, trivially reversible). Three.js is loaded with dynamic `import()` from a CDN only for the hero; everything degrades to readable static content if CDNs fail.

**Tech Stack:** HTML/CSS/vanilla JS · GSAP 3.12.5 + ScrollTrigger (cdnjs, classic scripts) · Three.js 0.160.0 (jsdelivr, `import()`) · qrcodejs 1.0.0 (cdnjs) · Google Fonts · Node `node:test` for unit tests · Playwright for e2e checks.

**Spec:** `docs/superpowers/specs/2026-10-29-presentazione-scroll-design.md` (read it before any task).

## Global Constraints

- Root: `~/Desktop/Workshop - Design Ai/`. Published files: `index.html`, `styles.css`, `data.js`, `nav.js`, `main.js`. Nothing else is required at runtime.
- **No ES module imports of local files** (breaks on `file://`). Local scripts are classic `<script defer>`; `nav.js` also does `if (typeof module !== 'undefined') module.exports = {...}` for Node tests.
- CDN URLs, exact versions only:
  - `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
  - `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
  - `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js` (via `import()` inside `main.js`)
  - `https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js`
- Fonts (Google Fonts): **Schibsted Grotesk** 400/500/600 (text + titles), **DM Mono** 400/500 (numbers, labels), **Instrument Serif** 400 roman only, used sparingly for one emphasized phrase per heading at most. Never italic serif headlines, never Inter/Geist/Space Grotesk/Fraunces.
- Tokens on `:root`: `--bg:#fbfbfa; --ink:#111113; --mute:#6f6f76; --line:#e7e7e4; --acc:#3b5bff; --card:#ffffff`. One accent only.
- Anti-slop (impeccable hook rules): no eyebrow pill above hero title, no colored glow shadows, no body text < 14px, no functional text < 12px.
- All copy Italian, first person (Leonardo), short: headline ≤ 12 words, section body ≤ 2 sentences; long text only behind hover/click/focus. Skill names stay English.
- Content readable with JS/CDN off: hidden-initial states are scoped under `html.motion` (class added only after GSAP loads and motion isn't reduced).
- `prefers-reduced-motion: reduce` → no pinning, no `html.motion`, every step's content visible; keyboard still jumps section to section.
- No horizontal page scroll at 375px width; sidebar becomes a top progress bar < 900px.
- Page weight ≤ 16 MB; no images required (case visuals are HTML/CSS/SVG).
- The QR/link target is the single constant `window.SHARE_URL` in `data.js`.

## Review Focus

1. **Trackpad then keyboard:** presenter scrolls by hand mid-section, then presses ↓ → lands on the next stop *after the current scroll position*, never jumps back. → unit test in Task 1.
2. **Key held / pressed fast:** five quick ↓ presses → advance exactly five stops, computed from the pending target, not the mid-animation scroll position. → unit test in Task 1 + e2e in Task 4.
3. **Window resized / fullscreen toggled before the talk:** stops recomputed after ScrollTrigger refresh; ↓ still lands on the right label. → e2e in Task 4.
4. **Focus inside a control** (filter chip, lens button): Space/arrows on a focused `button` still advance the presentation (buttons activate with Enter); keys inside `input/textarea/select/[contenteditable]` are ignored. → e2e in Task 4 (and Task 6 once controls exist).
5. **Offline room / CDN blocked:** every section's heading and body visible (opacity 1), keyboard jumps between section tops. → e2e in Task 3, re-run in Task 8.

---

## File Structure

| File | Responsibility |
|---|---|
| `index.html` | All 10 sections' semantic markup and static copy; containers that `main.js` fills from data (inventory grid, case cards, QR). |
| `styles.css` | Tokens, base layout, sidebar/progress, per-section layout, per-`data-step` choreography, lens styles, reduced-motion, responsive. |
| `data.js` | `window.FAMILIES`, `window.SKILLS`, `window.CASES`, `window.SHARE_URL`. The only file Leonardo edits to swap content. |
| `nav.js` | Pure stop model: `computeStops`, `targetStop`, `stopLabel`. No DOM. |
| `main.js` | Boot: render data into DOM, GSAP pins + `data-step`, keyboard, indicator, Three.js hero, inventory filter, lenses, QR. |
| `tests/nav.test.js` | Unit tests for `nav.js`. |
| `tests/data.test.js` | Content-integrity tests for `data.js`. |
| `tests/e2e.mjs` | Playwright checks (offline, keyboard, overflow, reduced motion). |
| `tests/package.json` | `{"type":"module","private":true}` + playwright devDependency. |

`main.js` is expected to land around 400–500 lines; if it passes ~600, split the hero into `hero3d.js` (classic script, same globals pattern).

---

### Task 1: Scaffold + stop model (`nav.js`)

**Files:**
- Create: `nav.js`, `tests/nav.test.js`, `tests/package.json`, `.gitignore` (`node_modules/`, `.superpowers/`, `.impeccable/`)
- Run once: `git init` in the root.

**Interfaces:**
- Produces:
  - `computeStops(sections: Array<{id: string, num: string, top: number, steps: number, pinLength: number}>) -> Array<{id, num, step: number /*1-based*/, steps: number, y: number}>` — for `steps===1 || pinLength===0`: one stop at `top`; else `steps` stops at `top + pinLength * k/(steps-1)`, k=0..steps-1. Output sorted by `y`.
  - `targetStop(stops, fromY: number, dir: 1|-1, eps = 4) -> stop` — `dir=1`: first stop with `y > fromY + eps`, else last stop. `dir=-1`: last stop with `y < fromY - eps`, else first stop.
  - `stopLabel(stop) -> string` — `"07 · 3/5"` when `steps>1`, else `"07"`.

- [ ] **Step 1: Write failing tests** in `tests/nav.test.js` (CommonJS `require('../nav.js')` via `createRequire`, `node:test` + `node:assert/strict`):

```js
const S = [
  { id:'s01', num:'01', top:0,    steps:1, pinLength:0 },
  { id:'s07', num:'07', top:1000, steps:5, pinLength:2000 },
  { id:'s09', num:'09', top:4000, steps:1, pinLength:0 },
];
test('computeStops spreads pinned steps across pinLength', () => {
  const st = computeStops(S);
  assert.deepEqual(st.map(s => s.y), [0, 1000, 1500, 2000, 2500, 3000, 4000]);
  assert.equal(st[3].step, 3); assert.equal(st[3].steps, 5);
});
test('pinLength 0 (reduced motion) collapses to one stop', () => {
  assert.equal(computeStops([{ ...S[1], pinLength:0 }]).length, 1);
});
test('next after manual scroll mid-section goes forward, not back', () => {
  assert.equal(targetStop(computeStops(S), 1720, 1).y, 2000);
});
test('prev from exact stop goes to previous stop', () => {
  assert.equal(targetStop(computeStops(S), 1500, -1).y, 1000);
});
test('five rapid presses chained from pending target = five stops', () => {
  const st = computeStops(S); let y = 0;
  for (let i = 0; i < 5; i++) y = targetStop(st, y, 1).y;
  assert.equal(y, 3000);
});
test('clamps at ends', () => {
  const st = computeStops(S);
  assert.equal(targetStop(st, 4000, 1).y, 4000);
  assert.equal(targetStop(st, 0, -1).y, 0);
});
test('stopLabel', () => {
  const st = computeStops(S);
  assert.equal(stopLabel(st[3]), '07 · 3/5');
  assert.equal(stopLabel(st[0]), '01');
});
```

- [ ] **Step 2:** `cd tests && node --test` → FAIL (`Cannot find module '../nav.js'`).
- [ ] **Step 3:** Implement the three functions in `nav.js`; attach to `window` when defined, `module.exports` when defined.
- [ ] **Step 4:** `cd tests && node --test` → 7 pass.
- [ ] **Step 5:** `git add -A && git commit -m "feat: stop model for step-by-step navigation"`

---

### Task 2: Content (`data.js`)

**Files:** Create `data.js`, `tests/data.test.js`.

**Interfaces:**
- Produces (globals on `window`, also `module.exports` for tests):
  - `FAMILIES: Array<{id, label, blurb}>` — ids exactly: `metodo, stile, gusto, immagine, 3d, framer, strumenti, compliance, documenti` (labels/membership from spec §8).
  - `SKILLS: Array<{name, family, what, when}>` — every skill/plugin in spec §8 (≈67 entries). `what` ≤ 90 chars, `when` ≤ 110 chars, Italian, first person for `when` ("Quando…", "La uso per…").
  - `CASES: Array<{id, name, kind, problem, skills: string[], result, steps?: string[], visual: string /*HTML*/}>` — the 5 cases of spec §7, in that order. `kind` ∈ `"Plugin Figma" | "App macOS" | "Piattaforma web"`. `layerlink` also has `steps` = 5 short strings for section 08 (richiesta → domande → spec → piano → app).
  - `SHARE_URL: string` — placeholder `"https://claude.ai/"` until published.

- [ ] **Step 1: Failing tests** (`tests/data.test.js`, load `data.js` via `vm.runInNewContext` with a `window` object):

```js
test('families are the nine of the spec', () =>
  assert.deepEqual(FAMILIES.map(f => f.id),
    ['metodo','stile','gusto','immagine','3d','framer','strumenti','compliance','documenti']));
test('every skill complete, family valid, names unique', () => {
  const ids = new Set(FAMILIES.map(f => f.id));
  for (const s of SKILLS) {
    assert.ok(s.name && s.what && s.when, s.name);
    assert.ok(ids.has(s.family), s.name);
    assert.ok(s.what.length <= 90 && s.when.length <= 110, s.name);
  }
  assert.equal(new Set(SKILLS.map(s => s.name)).size, SKILLS.length);
  assert.ok(SKILLS.length >= 60);
});
test('every family has at least one skill', () =>
  FAMILIES.forEach(f => assert.ok(SKILLS.some(s => s.family === f.id), f.id)));
test('five cases in spec order; their skills exist', () => {
  assert.deepEqual(CASES.map(c => c.id), ['tokenizer','layerlink','squeeze','handoff-check','tavolo']);
  const names = new Set(SKILLS.map(s => s.name));
  CASES.forEach(c => c.skills.forEach(n => assert.ok(names.has(n), `${c.id}: ${n}`)));
  assert.equal(CASES.find(c => c.id === 'layerlink').steps.length, 5);
});
test('SHARE_URL is https', () => assert.match(SHARE_URL, /^https:\/\//));
```

- [ ] **Step 2:** `cd tests && node --test` → data tests FAIL.
- [ ] **Step 3:** Write `data.js`. Each case `visual` is a small self-contained HTML mock UI using only classes prefixed `cv-` (styled in Task 7).
- [ ] **Step 4:** `node --test` → all pass.
- [ ] **Step 5:** Commit `feat: skills inventory and case studies data`.

---

### Task 3: Static page — all 10 sections readable without JS

**Files:** Create `index.html`, `styles.css`, `tests/e2e.mjs`, update `tests/package.json` (devDependency `playwright`, script `"e2e": "node e2e.mjs"`).

**Interfaces:**
- Consumes: globals from Tasks 1–2 (scripts included `defer`, order: `data.js`, `nav.js`, GSAP, ScrollTrigger, qrcode, `main.js`).
- Produces (DOM contract for later tasks):
  - `<aside class="index">` with one `<a href="#sNN" data-num="NN">` per section; `<div id="pos">` position indicator (empty for now).
  - Each section: `<section id="sNN" class="sec" data-steps="N" aria-labelledby="sNN-h">` with `<h2 id="sNN-h">` (s01 uses `h1`). `data-steps`: s01 1, s02 4, s03 5, s04 1, s05 4, s06 3, s07 5, s08 5, s09 1, s10 1.
  - Step-bearing children carry `data-at="k"` (1-based) — later CSS reveals them when `section[data-step] >= k`.
  - Fill containers: `#hero-gl` (canvas), `#inv-filters`, `#inv-grid`, `#lens-stage` (with `data-lens="base"`), `#cases-track`, `#anatomy`, `#qr`.
  - Section copy: from spec §6, Italian, within Global Constraints length limits. s09: 3 skill per designer (`design-taste-frontend`, `imagegen-frontend-web`, `superpowers:brainstorming`) + 3 per sviluppatori (`superpowers:test-driven-development`, `code-review`, `ponytail`), one line "perché" each.

- [ ] **Step 1: Write `tests/e2e.mjs`** (Playwright chromium, `file://` URL of `index.html`) with two checks, exit code ≠ 0 on failure:
  - `offline`: `context.route(/^https?:/, r => r.abort())`; for every `section.sec`: its heading's computed `opacity === '1'` and `visibility !== 'hidden'`; all `[data-at]` elements opacity `'1'`.
  - `overflow`: viewport 375×812 → `document.documentElement.scrollWidth <= 375`.
- [ ] **Step 2:** `cd tests && npm i && npx playwright install chromium && npm run e2e` → FAIL (no `index.html`).
- [ ] **Step 3:** Write `index.html` + `styles.css`: tokens, Schibsted/DM Mono/Instrument Serif, two-column shell (220px sticky index + main with left hairline), sections `min-height:100vh`, generous padding (96px desktop / 64px mobile), < 900px index becomes a fixed 2px top progress bar + current number. Approved mockup `.superpowers/brainstorm/19677-1793264469/content/base-minimale.html` is the visual reference.
- [ ] **Step 4:** `npm run e2e` → offline + overflow pass. Open in browser, screenshot desktop 1440×900 and 375×812, look at them.
- [ ] **Step 5:** Commit `feat: static 10-section page, readable without JS`.

---

### Task 4: Motion engine — pins, `data-step`, keyboard, indicator

**Files:** Create `main.js` (engine part); modify `styles.css` (`html.motion` initial states + transitions), `tests/e2e.mjs`.

**Interfaces:**
- Consumes: `computeStops`, `targetStop`, `stopLabel`; DOM contract of Task 3.
- Produces:
  - `html.motion` class iff `window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches`.
  - For each section with `data-steps > 1` (motion on): `ScrollTrigger.create({trigger: sec, start:'top top', end: '+=' + (steps-1)*100 + '%', pin:true, onUpdate: self => sec.dataset.step = 1 + Math.round(self.progress*(steps-1))})`. Sections with 1 step get `data-step="1"` once in view.
  - `window.presenter = { stops: [], go(dir: 1|-1): void }`; stops rebuilt on `ScrollTrigger.addEventListener('refresh', …)` (and on load/resize without GSAP) from each section's `top` (`st.start` or `offsetTop`) and `pinLength` (`st.end - st.start` or 0).
  - Keyboard: ArrowDown/ArrowRight/PageDown/Space → `go(1)`; ArrowUp/ArrowLeft/PageUp/Shift+Space → `go(-1)`; `preventDefault`; ignored when `e.target.closest('input,textarea,select,[contenteditable]')`. `go` chains from a `pending` y (cleared on `scrollend`) and calls `window.scrollTo({top: y, behavior: reduced ? 'auto' : 'smooth'})`.
  - `#pos` shows `stopLabel` of the nearest stop; sidebar link with that `data-num` gets `.on`.
  - CSS: under `html.motion`, `[data-at]` elements start `opacity:0; transform:translateY(16px)` and transition in (`.6s cubic-bezier(.2,.8,.2,1)`) when `section[data-step]` ≥ their `data-at` (write selectors for k=1..5).

- [ ] **Step 1: Add e2e checks** to `tests/e2e.mjs` (motion on, viewport 1440×900):
  - `keys`: from top (`#pos` = `'01'`), press ArrowDown 6× waiting for `scrollend` each → labels in order `02 · 1/4`, `02 · 2/4`, `02 · 3/4`, `02 · 4/4`, `03 · 1/5`, `03 · 2/5`. Then ArrowUp 1× → `'03 · 1/5'`.
  - `rapid`: from top, 4 presses with no wait, then wait 2s → `'02 · 4/4'`.
  - `resize`: set viewport 1280×720, wait 500ms, press ArrowDown 1× from top → `'02 · 1/4'`.
  - `focus`: focus the first `#lens-stage` area button (exists after Task 6 — guard with `if` until then), press Space → `#pos` advanced.
  - `reduced`: `emulateMedia({reducedMotion:'reduce'})` → `html` lacks `motion`; 1 press from top → `'02'`.
- [ ] **Step 2:** `npm run e2e` → new checks FAIL.
- [ ] **Step 3:** Implement engine in `main.js` + CSS.
- [ ] **Step 4:** `npm run e2e` → all pass; `cd tests && node --test` still green.
- [ ] **Step 5:** Commit `feat: pinned step engine and keyboard presenter`.

---

### Task 5: Hero 3D constellation (s01)

**Files:** Modify `main.js` (or create `hero3d.js` per the size rule), `styles.css`.

**Interfaces:** Consumes `SKILLS`, `FAMILIES`, `#hero-gl`. Produces nothing used elsewhere.

- One point per skill on a Fibonacci sphere (radius 1.7, as in the mockup), lines between points closer than 0.75 at opacity .12, ink color; points of the family currently hovered in s04 not required (YAGNI).
- Mouse tilts the group (lerp .04); slow idle rotation; scroll through s01 scales/drifts it out.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`; render loop stops when `#hero-gl` is out of view (IntersectionObserver) and when motion is reduced (render one static frame).
- `import()` failure → canvas hidden, layout unchanged.

- [ ] **Step 1:** Add e2e check `hero`: motion on, within 3s `#hero-gl` has non-zero width and `canvas.dataset.ready === '1'` (set by the code after the first rendered frame). Offline variant: `#hero-gl` hidden, `#s01-h` still visible.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS, and offline check still passes. Screenshot the hero, look at it.
- [ ] **Step 5:** Commit `feat: hero skill constellation`.

---

### Task 6: Interactive sections — inventory (s04) and lenses (s05)

**Files:** Modify `main.js`, `styles.css`, `tests/e2e.mjs`.

**Interfaces:**
- Inventory: `#inv-filters` gets one `button[data-family]` per family + "Tutte" (`data-family="all"`), `aria-pressed`. `#inv-grid` gets one `button.skill[data-family]` per skill showing `name`; hover/focus/click opens its `what`+`when` in a detail panel `#inv-detail` (`aria-live="polite"`). Filtering hides non-matching skills with a FLIP-style transition (GSAP `Flip` not allowed — plain CSS opacity/scale + `hidden` after transition is enough). Counter "N skill" updates.
- Lenses: `#lens-stage[data-lens]` ∈ `base | brutalist | soft | editorial`, buttons `button[data-lens]` (labels: `Base`, `brutalist-skill`, `soft-skill`, `minimalist-skill`). In s05, `data-step` 1..4 maps to those four lenses in order; clicking a button sets the lens directly. Lens CSS ports the approved mockup's `.brut/.soft/.edit` rules to `[data-lens=…]` selectors with `.6s` transitions; the demo component is a mini UI of the Squeeze case.

- [ ] **Step 1:** e2e `inventory`: click `[data-family="3d"]` → visible `.skill` count equals `SKILLS.filter(f==='3d').length` (11); focus first visible skill → `#inv-detail` contains its `what`. e2e `lens`: step through s05 via keys → `#lens-stage` `data-lens` sequence `base, brutalist, soft, editorial`; click `[data-lens="soft"]` → attribute `soft`. Enable the Task 4 `focus` check.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. Screenshot s04 and each lens, look at them.
- [ ] **Step 5:** Commit `feat: inventory filter and style lenses`.

---

### Task 7: Step choreographies — s02, s03, s06, s07, s08 + case visuals

**Files:** Modify `index.html`, `styles.css`, `main.js`.

**Interfaces:** Consumes `CASES` (`visual`, `steps`), `data-step` from Task 4. CSS only drives step states except where noted.

- **s02 Il prima (4):** four workaround cards stacked ("Esporto a mano", "Screenshot e incollo", "Pago un tool che fa metà", "Chiedo a uno sviluppatore e aspetto"); each step tilts/drops one card away; step 4 reveals the line "E se il tool me lo costruissi io?".
- **s03 Il metodo (5):** horizontal path of 5 nodes (brainstorming → spec → piano → build → verifica) with an SVG line whose `stroke-dashoffset` follows the step; active node shows its skill names; below, a fixed row "Stile di lavoro: ponytail · caveman · output-skill".
- **s06 Immagine → codice → 3D (3):** three panes crossfading: (1) generated mockup frame (CSS mock), (2) same frame as code (monospace snippet typed in with CSS steps), (3) wireframe object (CSS 3D rotating cube made of borders — real img2threejs object is Phase 2).
- **s07 Casi (5):** `#cases-track` horizontal strip, `transform: translateX(-(step-1) * card width)` driven from `data-step` via CSS custom property set in `onUpdate` (`--p` = raw progress, for smooth scrub). Card: kind · name · problem · skills chips · result · `visual`. Style `cv-` classes.
- **s08 Anatomia (5):** vertical timeline of `layerlink.steps`, each step lights the next item and shows a mini artifact (chat bubble, question list, spec snippet, checklist, app window).

- [ ] **Step 1:** e2e `cases`: navigate to `07 · 3/5` → the third card's bounding box is inside the viewport horizontally and the first is not.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. Screenshot each step of s02, s03, s06, s07, s08 (1440×900 and 375×812), look at them, fix what reads badly.
- [ ] **Step 5:** Commit `feat: step choreographies and case studies`.

---

### Task 8: Closing, quality pass, publish

**Files:** Modify `main.js` (QR), `index.html`, `styles.css`.

- s10: `new QRCode(document.getElementById('qr'), {text: SHARE_URL, width: 200, height: 200, colorDark:'#111113', colorLight:'#fbfbfa'})`; visible link text = `SHARE_URL`; QR library missing → link text only.
- Quality: run the **impeccable** audit (and/or `design-taste-frontend` inspector) on `index.html`; fix real findings; disclose any suppressions.
- Full verification: `cd tests && node --test && npm run e2e` → all green. Manual: open via `file://` in Brave, present 01→10 with keys only, once with Network offline.
- Publish: Artifact tool, `file_path: index.html`, `files: {styles.css, data.js, nav.js, main.js}`, icon `slides`. Put the returned URL into `SHARE_URL`, republish same path.
- [ ] Commit `feat: closing QR, quality pass, published`.

---

## Fase 2 (only after Tasks 1–8 are green and Leonardo has seen them)

- **Task 9 — Global lens:** a small floating lens switcher; `document.documentElement.dataset.lens` restyles base tokens (type, radius, borders, accent) site-wide using the same four lens definitions. e2e: switching to `brutalist` changes `getComputedStyle(h2).fontFamily`.
- **Task 10 — img2threejs object in s06 pane 3:** replace the CSS cube with a procedural Three.js model (use the `img2threejs` skill), sharing the hero's lazy-loaded THREE.
- **Task 11 — Mobile polish:** review each step at 375×812 and 768×1024; pinned horizontal s07 becomes vertical stacked cards below 600px.
