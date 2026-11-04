# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Design × AI" workshop deck for The Wave: a full-screen scroll presentation, plain static files (no bundler, no build step). Written in Italian; keep copy in Italian, mixed IT/EN where the existing text already is. Design spec: `docs/specs/2026-10-29-presentazione-full.md` (section map, tech choices, open items). The sibling folder `../kit-claude/` is a separate installable skill kit and is not part of this site.

## Run and test

The page `fetch`es `content.json`, so it does not work from `file://`. Serve the folder over HTTP:

```sh
python3 -m http.server 8080          # from this folder, then open http://localhost:8080/
```

Tests live in `tests/` (own `package.json`, only dependency is Playwright):

```sh
cd tests
node --test                          # unit: content.json shape (data.test.js) + stop model (nav.test.js)
node --test data.test.js             # single file
node e2e.mjs                         # real Chromium, whole deck; spins up its own server (serve.mjs)
node e2e.mjs <checkName> ...         # only the named checks
node qa.mjs [w h] [--mid]            # at each stop (or halfway between): reports cut-off or overlapping text
node shoot.mjs <outDir> [w h]        # one screenshot per stop, walking with ArrowDown
```

`data.test.js` hard-codes counts (9 projects, 9 method steps, 50 kit entries, 21 web apps, 7 kit groups, ≥60 skills). Changing `content.json` content usually means updating these assertions too.

## Architecture

- `index.html` holds the section skeleton only (`<section id=… class="sec pin|screen" data-theme data-chapter data-beats>`). Many sections are filled by JS (`#passi`, `#base`, project/"how" sections).
- `content.json` is **all the copy and data** (TEXTS, SKILLS, PROJECTS, KIT, WEBAPPS, METHOD, KEYS, …). `main.js` boots by fetching it and doing `Object.assign(window, content)`; elements with `data-t="a.b"` are filled from `TEXTS`. Strings allow inline HTML (`<mark>`, `<em>`, `<code>`).
- `.pages.yml` mirrors `content.json` for Pages CMS (edits go to `master`, GitHub Pages republishes; `.nojekyll` is there). **Every key in `content.json` must also be declared in `.pages.yml`**, or a CMS save drops it.
- `main.js` (single ~1300-line IIFE-style file, sectioned by `// ----------` comments): content render → stop model → scrolling → project modal → pinned motion set pieces → Three.js scenes → Web sphere → Prisma demo → boot.
- `nav.js` is the pure, DOM-free stop model (`normalizeStops`, `nextStopY`, `nearestStop`), unit-tested in `tests/nav.test.js`.
- Everything is vendored for offline use: `vendor/` (GSAP + ScrollTrigger, Lenis, Three.js classic build, GLTFLoader, qrcode), `fonts/`, `media/` (project images, tool previews, `models.js` with the chess models embedded). No CDN.

### Navigation model (the part that needs several files to understand)

The deck is driven by **stops**: scroll positions where one idea is fully on screen. `buildStops()` in `main.js` collects them: a pinned section contributes one stop per entry of its `at` array (progress values inside the pin, usually `labelsAt(tl, n)` from timeline labels `b0..bN`); a `.screen` section contributes its top (plus its end if taller than the viewport); others center. Arrow/Space/PageUp/PageDown call `step()` → `nextStopY` → `scrollToY` (Lenis, duration grows with distance). Home/End jump to first/last stop; `F` toggles fullscreen; `window.site` exposes `stops`, `step`, `scrollToY`, `open` and is what the tests drive.

Rules that follow from this:
- **ScrollTrigger pins must be created in page order** (e.g. `#tempo` word-scrub is set up after the projects for that reason). Adding a pinned section means inserting its `pin(...)` call at the right place in the "Motion" block.
- `pin(sec, lenScreens, build, at)` registers the section in `fractions`; pinned timelines are scrubbed, so animation speed on a key press = timeline fraction ÷ scroll duration.
- With `prefers-reduced-motion` the page degrades to a normal page: no pins, no Lenis (`motion` flag, `html.motion` class). Every new effect must be guarded the same way.
- `data-theme` (cream, deep, blue, yellow) on each section switches the body background; `data-chapter` feeds the chapter indicator.

## Conventions worth knowing

- Brand (The Wave): cream `#FAF7ED`, black `#313131`, blue `#0057FF`, yellow `#FFD400`, red `#FF3C00`, orange `#F97D16`, sand `#CDC3BA`. Font: Archivo with `font-stretch: 125%` (stand-in for licensed Univers Pro).
- Style rules already applied: title always at the top, one radius/shadow per mockup, project images always 4px radius and never cropped (box takes the image's own ratio), yellow = highlights, blue = active step.
- Project images are numbered placeholders (`img-NN`, `SLOT_SIZE` px); dropping `media/projects/img-NN.jpg` replaces the placeholder automatically.
- The 3D vocabulary is only keycaps and chess pieces; keep to it.
- Not a claude.ai artifact: the user wants this as local/offline HTML. Do not republish it as an artifact unless asked. Mobile is out of scope.
- `.claude/settings.local.json` (git-ignored) switches off unrelated skills/plugins for this folder.
