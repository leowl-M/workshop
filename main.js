// Boot: load content.json (edited from Pages CMS, .pages.yml), build the page, then (motion allowed) smooth scroll, pinned set pieces and the 3D scenes.
// The 3D vocabulary is always the same two things, keycaps and chess pieces, used in different ways.
fetch('content.json', { cache: 'no-cache' }).then(r => r.json()).then(content => {
  Object.assign(window, content);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const { FAMILIES, SKILLS, PROJECTS, GROUPS, METHOD, METHOD_KEYS, SLOTS, SLOT_SIZE, KEYS, KIT, WEBAPPS, SHARE_URL, TEXTS, PRISMA_SIM } = window;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const html = document.documentElement;
  if (motion) html.classList.add('motion');
  history.scrollRestoration = 'manual'; // the deck decides where a reload lands (hash or top)
  const IMG = 'media/projects/';
  const ORDER = GROUPS.flatMap(g => PROJECTS.filter(p => p.group === g.id));
  const byId = (id) => PROJECTS.find(p => p.id === id);
  const inGroup = (g) => ORDER.filter(p => p.group === g);

  // Placeholder: a numbered solid block; it shows the real picture as soon as media/projects/img-NN.jpg exists.
  const slot = (id, cls = '') => `<div class="slot ${cls}" data-n="${+id.slice(4)}">
    <img src="${IMG}${id}.jpg" alt="${esc(SLOTS[id])}" onerror="this.remove()">
    <span class="slot-num">${id.toUpperCase()}</span><span class="slot-txt">Immagine da cambiare · ${esc(SLOTS[id])}</span>
    <span class="slot-size">${SLOT_SIZE} px · media/projects/${id}.jpg</span></div>`;

  // ---------- Content ----------
  function renderContent() {
    // Static copy lives in content.json; data-t="section.key" names where it goes (HTML allowed, e.g. <mark>).
    $$('[data-t]').forEach(el => { const v = el.dataset.t.split('.').reduce((o, k) => o?.[k], TEXTS); if (v != null) el.innerHTML = v; });
    $$('[data-count="skills"]').forEach(el => { el.textContent = SKILLS.length; });

    // Figma plugins: one section, a keyboard with a key per plugin; pressing one opens it.
    // Apps: a divider, then one pinned chapter each. Web: a sphere with every tool online.
    const themes = ['cream', 'deep'];
    let out = '', n = 0;
    GROUPS.forEach(g => {
      const list = inGroup(g.id);
      if (g.id === 'figma') {
        n += list.length;
        out += `<section id="p-figma" class="sec screen figma" data-theme="blue" data-chapter="Progetti"><div class="stage">
          <p class="group-count reveal">${pad(list.length)} plugin · premi un tasto per aprirlo</p>
          <h2 class="group-name split">${esc(g.label)}</h2><p class="lead reveal">${esc(g.line)}</p>
          <div class="kb-wrap tall"><canvas class="kb-gl" id="figma-gl" aria-label="Plugin Figma: premi un tasto"></canvas></div></div></section>`;
        return;
      }
      if (g.id === 'web') {
        const t = list[0];
        out += `<section id="p-${t.id}" class="sec screen web" data-theme="deep" data-chapter="Progetti"><div class="stage web-stage">
          <div class="web-copy"><p class="group-count reveal">${pad(WEBAPPS.length)} online</p>
          <h2 class="group-name split">${esc(g.label)}</h2><p class="lead reveal">${esc(g.line)} ${esc(t.solution)}</p>
          <p class="web-hint reveal">Clic su un nome per aprirlo online.</p></div>
          <div class="sphere" id="sphere">${WEBAPPS.map((a, i) => `<a href="${esc(a.href)}" target="_blank" rel="noopener" style="--c: ${['#FFD400', '#0057FF', '#FAF7ED'][i % 3]}; --d: ${(i * .37) % 4}s">
            <i class="cube3" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b><b></b></i><span>${esc(a.name)}</span><small>${esc(a.kind)}</small></a>`).join('')}</div>
        </div></section>`;
        return;
      }
      out += `<section id="g-${g.id}" class="sec screen group" data-theme="yellow" data-chapter="Progetti">
        <div class="stage"><p class="group-count reveal">${pad(list.length)} progetti</p>
        <h2 class="group-name split">${esc(g.label)}</h2><p class="lead reveal">${esc(g.line)}</p></div></section>`;
      list.forEach(p => {
        n++;
        const beats = [
          `<div class="pbeat"><p class="pindex">${pad(n)} / ${pad(ORDER.length)}</p><h3 class="pname split">${esc(p.name)}</h3><span class="pkind">${esc(p.kind)}</span></div>`,
          p.problem && `<div class="pbeat"><p class="plabel">Il problema</p><p class="pproblem">${esc(p.problem)}</p></div>`,
          `<div class="pbeat"><p class="plabel">Cosa fa</p><p class="psolution">${esc(p.solution)}</p></div>`,
          `<div class="pbeat"><p class="plabel">Dettagli</p><ul class="pdetails">${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul><p class="pstack">${esc(p.stack)}</p></div>`,
        ].filter(Boolean);
        const media = p.id === 'prisma'
          ? `<div class="pplay" id="pplay" data-mode="shift">
              <div class="pp-fan" aria-hidden="true"></div>
              <ul class="pp-out" aria-live="polite"></ul>
              <p class="pp-label" aria-hidden="true"></p>
              <div class="pp-file" tabindex="0" role="button" aria-label="copertina.heic: trascinalo su una bolla">
                <i class="pp-thumb" aria-hidden="true"></i><b>copertina.heic</b><small>3,1 MB · 4032×3024</small></div>
            </div>
            <div class="pplay-keys"><canvas class="kb-gl" id="prisma-gl" aria-label="Le tre modalità di Prisma: premi un tasto"></canvas></div>`
          : `<div class="pcard">${p.imgs.map(id => slot(id, 'pimg')).join('')}</div>`;
        out += `<section id="p-${p.id}" class="sec pin project${p.id === 'prisma' ? ' has-play' : ''}" data-theme="${themes[n % 2]}" data-chapter="Progetti">
          <div class="stage"><div class="ptext">${beats.join('')}</div><div class="pmedia">${media}</div></div></section>`;
      });
    });
    $('#projects').outerHTML = out;

    // Ring of skill families.
    $('#ring').innerHTML = FAMILIES.map((f, i) => {
      const colors = ['yellow', 'blue', 'white', 'deep'];
      return `<div class="rcard ${colors[i % 4]}"><b>${SKILLS.filter(s => s.family === f.id).length}</b><div><strong>${esc(f.label)}</strong><p>${esc(f.blurb)}</p></div></div>`;
    }).join('');

    // Method: one panel per step with the real excerpt it produced; the last one shows the steps becoming a base.
    $('#method-track').insertAdjacentHTML('beforeend', METHOD.map((m, i) => `
      <div class="panel mstep"><div class="mleft"><span class="big-num">${i + 1}</span><h3>${esc(m.name)}</h3><p>${esc(m.what)}</p>${m.skill ? `<code>${esc(m.skill)}</code>` : ''}</div>
        <div class="doc"><div class="doc-bar"><i></i><i></i><i></i><span>${esc(m.file)}</span></div><pre>${m.lines.map(esc).join('\n')}</pre></div></div>`).join('') + `
      <div class="panel mbase"><canvas class="base-gl" id="base-gl" aria-hidden="true"></canvas>
        <div class="mbase-copy"><p class="kicker">Tutti insieme</p><h3>Nove passi.<br><em>Una base solida.</em></h3><p>Ogni progetto parte da qui. Sopra, ci costruisco quello che serve.</p></div></div>`);

    // Resources: the whole kit, one tab per group.
    $('#kit').innerHTML = `<div class="kit-tabs" role="tablist" aria-label="Gruppi del kit">${KIT.map((g, i) =>
      `<button type="button" role="tab" id="kt-${i}" aria-controls="kp-${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${esc(g.h)}<small>${g.rows.length}</small></button>`).join('')}</div>
      ${KIT.map((g, i) => `<div class="kit-panel" role="tabpanel" id="kp-${i}" aria-labelledby="kt-${i}" ${i ? 'hidden' : ''}>
        <p class="kit-note">${esc(g.p)}</p>
        <ul class="kit-list">${g.rows.map(r => `<li><div class="kit-name"><b>${esc(r.name)}</b>${r.mine ? '<span class="kit-mine">tua</span>' : ''}</div>
          <p class="kit-what">${esc(r.what)}</p>
          <p class="kit-use"><span>Come</span>${esc(r.use)}</p>
          ${r.src ? `<p class="kit-src"><span>Da</span>${r.href ? `<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.src)}</a>` : esc(r.src)}</p>` : ''}
          ${r.cmds?.length ? `<div class="kit-cmds">${r.cmds.map(c => `<button type="button" class="cmd" data-copy="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}</li>`).join('')}</ul></div>`).join('')}`;

    const link = $('#share-link');
    link.href = SHARE_URL;
    link.textContent = SHARE_URL.replace(/^https:\/\//, '').replace(/\/$/, '');
    if (window.QRCode) new QRCode($('#qr'), { text: SHARE_URL, width: 360, height: 360, colorDark: '#141312', colorLight: '#FAF7ED' });
  }

  // Tabs with arrow keys, as WAI-ARIA tabs expect.
  function kitTabs() {
    const tabs = $$('.kit-tabs [role="tab"]');
    const select = (t) => {
      tabs.forEach(b => { const on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('#' + b.getAttribute('aria-controls')).hidden = !on; });
      if (!motion) return;
      gsap.fromTo($$('#' + t.getAttribute('aria-controls') + ' li'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .025, ease: 'power3.out' });
      ScrollTrigger.refresh(); // the panel changed height: the pins after it move
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault(); e.stopPropagation();
        const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n);
      });
    });
  }

  // Wrap each word in a mask (.split) or a plain span (.scrub-words).
  function wrapWords(el, masked) {
    const walk = (node) => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const inner = document.createElement('span'); inner.textContent = part;
          if (masked) { const w = document.createElement('span'); w.className = 'w'; w.append(inner); frag.append(w); }
          else { inner.className = 'sw'; frag.append(inner); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el);
  }

  // ---------- Positions: sections, themes, stops ----------
  const sections = () => $$('main > .sec, main .pin-spacer > .sec');
  const outer = (sec) => sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
  const pageTop = (el) => el.getBoundingClientRect().top + scrollY;
  const fractions = new Map(); // pinned section -> { st, tl, at: progress of each stop (array, or fn of tl) }
  const atOf = (f) => typeof f.at === 'function' ? f.at(f.tl) : f.at;
  const firstStop = (sec) => { const f = fractions.get(sec); return f ? f.st.start + (f.st.end - f.st.start) * atOf(f)[0] : pageTop(outer(sec)); };
  let stops = [];

  function buildStops() {
    const vh = innerHeight, ys = [];
    sections().forEach(sec => {
      const f = fractions.get(sec);
      if (f) { atOf(f).forEach(p => ys.push(f.st.start + (f.st.end - f.st.start) * p)); return; }
      const o = outer(sec), top = pageTop(o), extra = o.offsetHeight - vh;
      if (!sec.classList.contains('screen')) { ys.push(top + Math.max(0, extra / 2)); return; }
      ys.push(top);
      if (extra > 80) ys.push(top + extra); // clearly taller than the screen: a second stop shows its end
    });
    stops = normalizeStops(ys.map(y => Math.round(Math.min(y, document.documentElement.scrollHeight - vh))));
    window.site.stops = stops;
  }

  // The only position indicator: a thin line on the right with a dot (as on brandappart).
  let lastTheme = '', lastChapter = '';
  function onScroll() {
    const y = scrollY, mid = y + innerHeight / 2;
    const sec = sections().find(s => { const o = outer(s), t = pageTop(o); return mid >= t && mid < t + o.offsetHeight; });
    if (sec && sec.dataset.theme !== lastTheme) { lastTheme = sec.dataset.theme; document.body.dataset.theme = lastTheme; }
    if (sec && sec.dataset.chapter !== lastChapter) { lastChapter = sec.dataset.chapter; window.site.chapter = lastChapter; }
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#rail').style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
  }

  // ---------- Scrolling: Lenis when motion is on, native otherwise ----------
  let lenis = null, pending = null;
  function scrollToY(y, opts = {}) {
    pending = y;
    if (lenis) lenis.scrollTo(y, { duration: opts.immediate ? 0 : 1.15, immediate: !!opts.immediate, lock: false, force: true, onComplete: () => { pending = null; } });
    else { scrollTo({ top: y, behavior: 'auto' }); pending = null; }
  }
  function step(dir) {
    if (!stops.length) return;
    scrollToY(nextStopY(stops, pending ?? scrollY, dir));
  }
  window.site = { stops, step, scrollToY };
  addEventListener('wheel', () => { pending = null; }, { passive: true }); // manual scroll cancels a pending key jump

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if (modalOpen()) { modalKeys(e); return; }
    if (e.target.closest?.('[role="tab"]') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return; // tabs own their arrows
    if (e.key === 'f' || e.key === 'F') {
      if (e.repeat) return;
      if (document.fullscreenElement) document.exitFullscreen(); else html.requestFullscreen?.().catch(() => {});
      return;
    }
    const fwd = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const back = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!fwd && !back && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (e.repeat) return; // a held key or sticky clicker must not fly through the talk
    if (e.key === 'Home') scrollToY(stops[0] ?? 0);
    else if (e.key === 'End') scrollToY(stops[stops.length - 1] ?? 0);
    else step(fwd ? 1 : -1);
  });

  // ---------- Open a project: Figma plugins in the modal, the others jump to their chapter ----------
  const modal = $('#modal');
  let current = null, lastFocus = null;
  const modalOpen = () => !modal.hidden;
  function openProject(id) {
    const p = byId(id);
    if (!p) return;
    if (p.group !== 'figma') { scrollToY(firstStop(document.getElementById('p-' + id))); return; }
    showInModal(p);
  }
  function showInModal(p) {
    const list = inGroup('figma'), i = list.indexOf(p);
    current = p;
    $('#modal-media').innerHTML = slot(p.imgs[0]);
    $('#modal-index').textContent = `Plugin Figma · ${pad(i + 1)} / ${pad(list.length)}`;
    $('#modal-title').textContent = p.name;
    $('#modal-kind').textContent = p.kind;
    $('#modal-problem').textContent = p.problem;
    $('#modal-solution').textContent = p.solution;
    $('#modal-details').innerHTML = p.details.map(d => `<li>${esc(d)}</li>`).join('') + `<li class="stack">${esc(p.stack)}</li>`;
    $('#modal-count').textContent = `${pad(i + 1)} / ${pad(list.length)}`;
    if (modal.hidden) {
      lastFocus = document.activeElement;
      modal.hidden = false;
      lenis?.stop();
      if (motion) gsap.fromTo('.modal-card', { y: 60, scale: .96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .6, ease: 'expo.out' });
      if (motion) gsap.fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: .3 });
      $('.modal-close').focus();
    } else if (motion) {
      gsap.fromTo('.modal-body > *, .modal-media', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out', stagger: .03 });
    }
  }
  function closeModal() {
    if (modal.hidden) return;
    const done = () => { modal.hidden = true; lenis?.start(); lastFocus?.focus?.({ preventScroll: true }); };
    if (motion) gsap.to('.modal-card', { y: 40, opacity: 0, duration: .25, ease: 'power2.in', onComplete: done }); else done();
  }
  function stepModal(d) {
    const list = inGroup('figma');
    showInModal(list[(list.indexOf(current) + d + list.length) % list.length]);
  }
  function modalKeys(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); if (!e.repeat) stepModal(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); if (!e.repeat) stepModal(-1); }
    else if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('button', modal), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function wireOpen() {
    window.site.open = openProject;
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open]');
      if (t) openProject(t.dataset.open);
      if (e.target.closest('[data-close]')) closeModal();
      const s = e.target.closest('.modal-nav [data-step]');
      if (s) stepModal(+s.dataset.step);
    });
  }

  // ---------- Motion: pinned set pieces ----------
  // Pin a section for `len` screens; `at` lists the progress of each stop inside it.
  function pin(sec, len, build, at) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: '+=' + Math.round(len * 100) + '%', pin: true, scrub: 0.6, animation: tl });
    build(tl, st);
    fractions.set(sec, { st, tl, at });
    return st;
  }
  const labelsAt = (tl, n) => Array.from({ length: n }, (_, k) => tl.labels['b' + k] / tl.duration());
  const progressOf = (sel) => () => { const f = fractions.get($(sel)); return f ? f.st.progress : 0; };

  // Elastic fan (brandappart testimonials): cards fly in, the hovered one straightens and the others make room.
  function fan(cards, trigger) {
    gsap.fromTo(cards, { x: () => innerWidth * .8, rotation: 40 }, { x: 0, rotation: 0, duration: 1.6, ease: 'elastic.out(1, 1)', stagger: .08,
      scrollTrigger: { trigger, start: 'top 85%', toggleActions: 'play none none reverse' } });
    if (fine) cards.forEach((c, i) => {
      c.addEventListener('mouseenter', () => cards.forEach((o, j) => gsap.to(o, { y: j === i ? -30 : 0, scale: j === i ? 1.08 : 1, xPercent: j === i ? 0 : 30 / (j - i), zIndex: j === i ? 5 : 1, duration: .8, ease: 'elastic.out(1, .8)' })));
      c.addEventListener('mouseleave', () => gsap.to(cards, { y: 0, scale: 1, xPercent: 0, zIndex: 1, duration: .8, ease: 'elastic.out(1, .8)' }));
    });
  }

  function setupMotion() {
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ duration: .9, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    // Hero: black and the title; scrolling lifts the title and the 3D keyboard drops in.
    pin($('#hero'), 1.6, (tl) => {
      tl.addLabel('b0', 0)
        .to('#hero .hero-copy', { y: () => -innerHeight * .27, scale: .56, duration: .55, ease: 'power2.inOut' }, .05)
        .to('#hero .hero-by, #hero .scroll-hint', { autoAlpha: 0, duration: .2 }, .05)
        .addLabel('b1', .8)
        .to('#hero .stage', { autoAlpha: 0, duration: .25 }, 1.25)
        .to({}, { duration: .05 });
    }, (tl) => labelsAt(tl, 2));

    // Word-scrub statements: each word lights up as you scroll.
    // Pins must be created in page order, so #tempo is set up after the projects.
    const wordScrub = (sec) => pin(sec, 1.6, (tl) => {
      tl.to($$('.sw', sec), { opacity: 1, stagger: .1, duration: .3 }).to({}, { duration: .6 });
    }, [1]);
    wordScrub($('#manifesto'));

    // Before: a deck of cards; each flies off tilted while the rest step forward (brandappart services stack).
    // Each card has its own perspective (no shared 3D space), so a tilting card never cuts through the next one.
    const cards = $$('#prima .tcard');
    gsap.set(cards, { transformOrigin: '50% 100%', transformPerspective: 1600, zIndex: i => cards.length - i, scale: i => 1 - .05 * i, yPercent: i => -6 * i });
    cards.slice(1).forEach(c => gsap.set(c.children, { autoAlpha: 0 })); // cards behind show only their edge
    pin($('#prima'), cards.length, (tl) => {
      tl.addLabel('b0', 0);
      cards.slice(0, -1).forEach((c, i) => {
        const t = i * 1 + .3;
        tl.to(c, { rotateX: 16, y: () => -innerHeight * 1.2, duration: .7, ease: 'power2.in' }, t);
        cards.slice(i + 1).forEach((r, j) => tl.to(r, { scale: 1 - .05 * j, yPercent: -6 * j, duration: .7, ease: 'power2.inOut' }, t));
        tl.to(cards[i + 1].children, { autoAlpha: 1, duration: .3, stagger: .05 }, t + .45);
        tl.addLabel('b' + (i + 1), t + .85);
      });
      tl.to({}, { duration: .3 });
    }, (tl) => labelsAt(tl, cards.length));

    // The question: a blue box grows to fill the screen (brandappart showreel).
    pin($('#domanda'), 1.4, (tl) => {
      tl.fromTo('#domanda .growbox', { width: '40vw', height: '28vh', borderRadius: 28 }, { width: '100vw', height: '100vh', borderRadius: 0, duration: 1, ease: 'power2.inOut' })
        .fromTo('#domanda .question', { scale: .62 }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
        .to({}, { duration: .4 });
    }, [1]);

    // Two statements, one at a time.
    const roles = $$('#ruolo .beat');
    gsap.set(roles[1], { autoAlpha: 0 });
    pin($('#ruolo'), 1.6, (tl) => {
      tl.addLabel('b0', .15)
        .to($$('.w > span', roles[0]), { yPercent: -110, stagger: .02, duration: .4, ease: 'power2.in' }, .4)
        .set(roles[0], { autoAlpha: 0 }, .75)
        .set(roles[1], { autoAlpha: 1 }, .75)
        .fromTo($$('.w > span', roles[1]), { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .5, ease: 'power3.out' }, .75)
        .addLabel('b1', 1.45).to({}, { duration: .2 });
    }, (tl) => labelsAt(tl, 2));

    // Method: a horizontal track; each panel is a stop. The last panel builds the base in 3D when it comes on.
    const track = $('#metodo .track'), panels = $$('#metodo .panel');
    const maxX = () => track.scrollWidth - innerWidth;
    pin($('#metodo'), panels.length, (tl) => {
      tl.to(track, { x: () => -maxX(), duration: 1 });
    }, () => panels.map(p => Math.min(1, Math.max(0, (p.offsetLeft + p.offsetWidth / 2 - innerWidth / 2) / maxX()))));
    ScrollTrigger.create({
      trigger: '#metodo', start: 'top top', end: () => fractions.get($('#metodo')).st.end, onUpdate: self => {
        const x = self.progress * maxX() + innerWidth / 2;
        panels.forEach(p => p.classList.toggle('on', x > p.offsetLeft && x < p.offsetLeft + p.offsetWidth));
      },
    });

    // Lenses: four looks for one component.
    const lensNames = ['base', 'brutalist', 'soft', 'editorial'];
    pin($('#lenti'), 3, () => {}, [.06, .37, .66, .97]);
    const lensST = fractions.get($('#lenti')).st;
    ScrollTrigger.create({ trigger: '#lenti', start: () => lensST.start, end: () => lensST.end, onUpdate: self => setLens(lensNames[Math.min(3, Math.floor(self.progress * 4))]) });
    function setLens(l) {
      const box = $('#lens-stage');
      if (box.dataset.lens === l) return;
      box.dataset.lens = l;
      $$('#lens-list li').forEach(li => li.classList.toggle('on', li.dataset.lens === l));
      gsap.fromTo('.lc', { scale: .95, rotate: -1.5 }, { scale: 1, rotate: 0, duration: .7, ease: 'back.out(2.2)' });
    }
    $$('#lens-list li')[0].classList.add('on');

    // Image → code → 3D: one step in focus per stop; the poster, the page and the 3D knight take turns.
    const isteps = $$('#immagine .istep'), ivis = [$('.ivis-poster'), $('.ivis-web')];
    pin($('#immagine'), 2.6, () => {}, [.08, .5, .93]);
    const imgST = fractions.get($('#immagine')).st;
    const setImgStep = (k) => {
      if (window.site.imgStep === k) return;
      window.site.imgStep = k;
      isteps.forEach((s, i) => s.classList.toggle('on', i === k));
      ivis.forEach((v, i) => v.classList.toggle('on', i === k));
    };
    ScrollTrigger.create({ trigger: '#immagine', start: () => imgST.start, end: () => imgST.end, onUpdate: self => setImgStep(Math.min(2, Math.floor(self.progress * 3))) });
    setImgStep(0);

    // Apps: beats swap on the left, the card turns in 3D and reveals the next image.
    $$('.project').forEach(sec => {
      const beats = $$('.pbeat', sec), imgs = $$('.pimg', sec), card = $('.pcard', sec);
      gsap.set(beats.slice(1), { autoAlpha: 0, y: 50 });
      if (card) gsap.set(card, { rotateY: -18, rotateX: 8, scale: .9 });
      pin(sec, beats.length * .95, (tl) => {
        tl.addLabel('b0', .1);
        for (let k = 1; k < beats.length; k++) {
          const t = (k - 1) + .35;
          tl.to(beats[k - 1], { autoAlpha: 0, y: -50, duration: .35, ease: 'power2.in' }, t)
            .to(beats[k], { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out' }, t + .3);
          if (card) tl.to(card, { rotateY: k % 2 ? 10 : -12, rotateX: k % 2 ? -4 : 6, scale: 1, duration: .8, ease: 'power2.inOut' }, t);
          if (imgs[k]) tl.to(imgs[k], { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'power3.inOut' }, t + .1);
          tl.addLabel('b' + k, t + .85);
        }
        tl.to({}, { duration: .25 });
      }, (tl) => labelsAt(tl, beats.length));
    });

    wordScrub($('#tempo'));

    // Reveals for headings and copy outside pins.
    $$('.split').forEach(el => {
      if (el.closest('#ruolo')) return;
      gsap.fromTo($$('.w > span', el), { yPercent: 115, rotateX: -25 }, { yPercent: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', stagger: .045,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
    });
    $$('.reveal').forEach(el => gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } }));

    fan($$('.fcard'), '.fan');

    // Skill ring: cards on a circle, spinning; scroll velocity spins it faster.
    const rcards = $$('#ring .rcard');
    rcards.forEach((c, i) => { c.style.transform = `rotate(${(360 / rcards.length) * i}deg) translateY(-36vw)`; });
    const ringLoop = gsap.to('#ring', { rotation: 360, duration: 70, ease: 'none', repeat: -1 });
    gsap.from(rcards, { scale: 0, duration: 2, ease: 'expo.inOut', stagger: .04,
      scrollTrigger: { trigger: '#skill', start: 'top 70%', toggleActions: 'play none none reverse' } });
    const mega = $('#skill .mega span');
    ScrollTrigger.create({ trigger: '#skill', start: 'top 60%', once: true, onEnter: () => {
      const n = { v: 0 }; gsap.to(n, { v: SKILLS.length, duration: 1.6, ease: 'power2.out', onUpdate: () => { mega.textContent = Math.round(n.v); } });
    } });

    // Velocity drives the loops (brandappart: timeScale follows getVelocity()).
    const loops = [ringLoop];
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
      const boost = 1 + Math.min(12, Math.abs(self.getVelocity()) / 250);
      window.site.velocity = boost;
      loops.forEach(l => gsap.to(l, { timeScale: boost, duration: .2, overwrite: true, onComplete: () => gsap.to(l, { timeScale: 1, duration: 1.2 }) }));
    } });

    lenis.on('scroll', onScroll);
    ScrollTrigger.addEventListener('refresh', () => { buildStops(); onScroll(); });
    new ResizeObserver(() => { clearTimeout(window._rz); window._rz = setTimeout(() => ScrollTrigger.refresh(), 200); }).observe(document.body);
  }

  // ======================================================================
  // 3D kit: keycaps and chess pieces, shared by every scene
  // ======================================================================
  const T = window.THREE;
  const PAL = { yellow: [0xFFD400, '#141312'], cream: [0xFAF7ED, '#141312'], blue: [0x0057FF, '#FAF7ED'], deep: [0x2A2826, '#FAF7ED'] };
  const bounceOut = (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; };
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  function makeRenderer(canvas, shadows = true) {
    try {
      const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2));
      r.toneMapping = T.ACESFilmicToneMapping;
      r.shadowMap.enabled = shadows;
      r.shadowMap.type = T.PCFSoftShadowMap;
      return r;
    } catch { return null; }
  }
  function studio(scene, { shadow = true, span = 10 } = {}) {
    scene.add(new T.HemisphereLight(0xfff4dc, 0x141312, 1.3));
    const sun = new T.DirectionalLight(0xffffff, 2.6);
    sun.position.set(-5, 12, 7);
    if (shadow) {
      sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 6;
      Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span });
      const floor = new T.Mesh(new T.PlaneGeometry(80, 80), new T.ShadowMaterial({ opacity: .45 }));
      floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    }
    scene.add(sun);
    const rim = new T.DirectionalLight(0xFFD400, .8); rim.position.set(6, 3, -6); scene.add(rim);
  }
  // Render only while the canvas is on screen.
  function onScreen(el) {
    const s = { on: false };
    new IntersectionObserver(([e]) => { s.on = e.isIntersecting; }, { rootMargin: '10% 0px' }).observe(el);
    return s;
  }
  function sizer(canvas, renderer, cam, after) {
    const size = () => {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      after?.(w, h);
    };
    addEventListener('resize', size); size();
    return size;
  }
  // Camera at a fixed angle, far enough that a `w × d` area fills `fill` of the frame.
  function frame(cam, w, d, fill = .7, look = [0, 0, 0], tilt = .62) {
    const hfov = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
    const dist = Math.max((w / fill / 2) / Math.tan(hfov / 2), (d / fill / 2) / Math.tan(cam.fov * Math.PI / 360));
    cam.position.set(look[0], look[1] + dist * tilt, look[2] + dist * Math.sqrt(1 - tilt * tilt));
    cam.lookAt(...look);
  }

  // A keycap: rounded rectangle extruded upwards with a soft bevel, narrower at the top like a real cap.
  const KEY_H = .62, capCache = new Map();
  function capGeo(w, d = 1) {
    const k = w + 'x' + d;
    if (capCache.has(k)) return capCache.get(k);
    const r = .18, x = -w / 2, y = -d / 2, s = new T.Shape();
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new T.ExtrudeGeometry(s, { depth: KEY_H, bevelEnabled: true, bevelThickness: .07, bevelSize: .07, bevelSegments: 5, curveSegments: 10 });
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const f = 1 - .16 * Math.max(0, p.getY(i)) / (KEY_H + .07); p.setX(i, p.getX(i) * f); p.setZ(i, p.getZ(i) * f); }
    g.computeVertexNormals();
    capCache.set(k, g);
    return g;
  }
  function labelTex(text, sub, w, d, ink) {
    const c = document.createElement('canvas'), S = 256;
    c.width = Math.round(S * w); c.height = Math.round(S * d);
    const x = c.getContext('2d');
    x.fillStyle = ink; x.textBaseline = 'middle';
    let size = 64; x.font = `800 ${size}px Archivo, sans-serif`;
    while (x.measureText(text).width > c.width * .8 && size > 26) { size -= 2; x.font = `800 ${size}px Archivo, sans-serif`; }
    x.fillText(text, c.width * .1, c.height * (sub ? .3 : .36));
    if (sub) { x.globalAlpha = .7; x.font = `500 ${Math.round(size * .55)}px "IBM Plex Mono", monospace`; x.fillText(sub, c.width * .1, c.height * .74); }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }
  function makeKey({ label = '', sub = '', u = 1, color = 'cream' }) {
    const [hex, ink] = PAL[color];
    const cap = new T.Mesh(capGeo(u), new T.MeshStandardMaterial({ color: hex, roughness: .55 }));
    cap.castShadow = true; cap.receiveShadow = true;
    const key = new T.Group(); key.add(cap);
    if (label) {
      const top = new T.Mesh(new T.PlaneGeometry(u * .8, .8), new T.MeshBasicMaterial({ map: labelTex(label, sub, u * .8, .8, ink), transparent: true, toneMapped: false }));
      top.rotation.x = -Math.PI / 2; top.position.y = KEY_H + .072;
      key.add(top);
    }
    key.children.forEach(c => { c.userData.key = key; });
    return key;
  }
  const chessCache = new Map();
  function chessGeo(name) {
    if (chessCache.has(name)) return chessCache.get(name);
    const m = MODELS[name], b64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0)).buffer;
    const g = new T.BufferGeometry(); // the models already stand on y = 0
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(b64(m.pos)), 3));
    g.setAttribute('normal', new T.BufferAttribute(new Float32Array(b64(m.nor)), 3));
    g.setIndex(new T.BufferAttribute(m.idx32 ? new Uint32Array(b64(m.idx)) : new Uint16Array(b64(m.idx)), 1));
    chessCache.set(name, g);
    return g;
  }
  const glossy = (hex) => new T.MeshPhysicalMaterial({ color: hex, roughness: .28, clearcoat: 1, clearcoatRoughness: .2 });

  // An interactive keyboard: keys drop in (from scroll progress, or when it comes on screen),
  // lift under the pointer, and run onPress when clicked.
  function keyboard(canvas, defs, { rows, onPress, progress, fill = .62, look = [0, 1.6, -.6], spin = .12 } = {}) {
    if (!canvas) return null;
    const renderer = makeRenderer(canvas);
    if (!renderer) { canvas.remove(); return null; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(28, 1, .1, 200);
    studio(scene);
    const board = new T.Group(); scene.add(board);
    const GAP = .16, groups = rows || [defs.length], keys = [];
    let at = 0, widest = 0;
    groups.forEach((count, r) => {
      const row = defs.slice(at, at + count); at += count;
      const total = row.reduce((a, k) => a + k.u, 0) + GAP * (row.length - 1);
      widest = Math.max(widest, total);
      let x = -total / 2;
      row.forEach(def => {
        const key = makeKey(def);
        key.position.set(x + def.u / 2, 0, (r - (groups.length - 1) / 2) * (1 + GAP));
        key.userData = { def, lift: 0, press: 0 };
        board.add(key); keys.push(key);
        x += def.u + GAP;
      });
    });
    // A .kb-gl canvas reaches far above its box so falling keys are never cut: the keys are framed in the box,
    // the canvas only adds sky above it, and the box takes the pointer.
    const area = canvas.classList.contains('kb-gl') ? canvas.parentElement : canvas;
    sizer(canvas, renderer, cam, (w, h) => {
      const hb = area.clientHeight || h;
      cam.aspect = w / hb; cam.setViewOffset(w, hb, 0, hb - h, w, h);
      frame(cam, widest + .6, groups.length * 1.2, fill, look);
    });
    const vis = onScreen(area);
    const ray = new T.Raycaster(), ndc = new T.Vector2(9, 9);
    let hovered = null, mx = 0, my = 0, landed = false, since = null;
    area.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      mx = ndc.x; my = ndc.y;
    });
    area.addEventListener('pointerleave', () => ndc.set(9, 9));
    const press = (k) => {
      gsap.timeline().to(k.userData, { press: 1, duration: .08, ease: 'power2.in' }).to(k.userData, { press: 0, duration: .7, ease: 'elastic.out(1, .4)' });
      setTimeout(() => onPress?.(k.userData.def), 240);
    };
    area.addEventListener('click', () => { if (hovered && landed) press(hovered); });
    gsap.ticker.add(() => {
      if (!vis.on) { since = null; return; }
      const now = performance.now() / 1000;
      if (since === null) since = now;
      const drop = progress ? progress() : clamp01((now - since) / 1.1);
      landed = drop >= 1;
      if (area === canvas) canvas.style.pointerEvents = landed ? 'auto' : 'none';
      ray.setFromCamera(ndc, cam);
      const hit = landed ? ray.intersectObjects(keys.flatMap(k => k.children))[0] : null;
      hovered = hit ? hit.object.userData.key : null;
      area.style.cursor = hovered ? 'pointer' : '';
      keys.forEach((k, i) => {
        const d = clamp01(drop * 1.6 - i * (.6 / keys.length));
        const u = k.userData;
        u.lift += ((hovered === k ? .22 : 0) - u.lift) * .18;
        k.position.y = (1 - bounceOut(d)) * 9 + u.lift - u.press * .32 + (landed ? Math.sin(now * 1.4 + i) * .02 : 0);
        k.rotation.z = (1 - d) * (i % 2 ? .6 : -.5);
        k.rotation.x = (1 - d) * .4;
        k.visible = d > 0;
      });
      board.rotation.y += ((mx * spin) - board.rotation.y) * .06;
      board.rotation.x += ((-my * spin / 2) - board.rotation.x) * .06;
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
    return { keys, press: (i) => press(keys[i]) };
  }

  // ---------- The scenes ----------
  function scenes() {
    if (!T || !window.MODELS || reduced) { $$('canvas[id$="-gl"]').forEach(c => c.remove()); return; }
    const heroP = progressOf('#hero');

    // Hero: one key per tool; keys fall as the hero scrolls; a key opens its tool.
    const hero = keyboard($('#keys-gl'), KEYS, { rows: [5, KEYS.length - 5], progress: () => clamp01((heroP() - .03) / .36), onPress: k => openProject(k.to) });
    window.site.keys = hero ? KEYS.map(k => k.label) : [];

    // Projects: three big keys, one per group.
    const count = (g) => g === 'web' ? WEBAPPS.length : inGroup(g).length;
    window.site.groupKeys = keyboard($('#groups-gl'), [
      { label: 'Plugin Figma', sub: `${pad(count('figma'))} plugin`, u: 2.6, color: 'blue', go: 'p-figma' },
      { label: 'App', sub: `${pad(count('app'))} app`, u: 2.1, color: 'yellow', go: 'g-app' },
      { label: 'Web', sub: `${pad(count('web'))} online`, u: 2.1, color: 'cream', go: 'p-training' },
    ], { fill: .62, look: [0, .2, 0], onPress: k => scrollToY(firstStop(document.getElementById(k.go))) });

    // Figma plugins: a key each, opened in the modal (as in the reel, every tool is a real key).
    const colors = ['yellow', 'cream', 'blue', 'cream', 'deep', 'yellow'];
    window.site.figmaKeys = keyboard($('#figma-gl'), inGroup('figma').map((p, i) => ({ label: p.name, sub: 'Plugin Figma', u: p.name.length > 12 ? 2.4 : 1.9, color: colors[i % colors.length], to: p.id })),
      { rows: [3, 2], fill: .6, look: [0, .2, 0], onPress: k => openProject(k.to) });

    // Prisma: the three modifier keys switch the simulated demo between its three fans.
    window.site.prismaKeys = keyboard($('#prisma-gl'), [
      { label: '⇧ Converti', sub: 'Maiuscole', u: 2.2, color: 'yellow', g: 'shift' },
      { label: '⌘ Strumenti', sub: 'Comando', u: 2.2, color: 'cream', g: 'cmd' },
      { label: '⌃ Azioni', sub: 'Controllo', u: 2.2, color: 'blue', g: 'ctrl' },
    ], { fill: .74, look: [0, .2, 0], spin: .06, onPress: k => prismaMode(k.g) });

    baseScene($('#base-gl'));
    knightScene($('#knight-gl'));
    chessFloat($('#chess-gl'));
  }

  // Method finale: the nine steps become nine keys that stack into a solid 3×3 base; a king lands on top.
  function baseScene(canvas) {
    if (!canvas) return;
    const renderer = makeRenderer(canvas);
    if (!renderer) { canvas.remove(); return; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 200);
    studio(scene, { span: 6 });
    const colors = ['yellow', 'cream', 'blue', 'cream', 'deep', 'cream', 'blue', 'cream', 'yellow'];
    const keys = METHOD_KEYS.map((label, i) => {
      const k = makeKey({ label, sub: pad(i + 1), u: 1.5, color: colors[i] });
      k.userData.home = new T.Vector3(((i % 3) - 1) * 1.62, 0, (Math.floor(i / 3) - 1) * 1.12);
      scene.add(k); return k;
    });
    const king = new T.Mesh(chessGeo('re'), glossy(0xFFD400));
    king.scale.setScalar(26); king.castShadow = true; scene.add(king);
    const panel = canvas.closest('.panel');
    // Close and low: the base fills the right side of the panel, the copy sits over the left.
    sizer(canvas, renderer, cam, () => frame(cam, 5.4, 5.4, .98, [-1.7, .7, 0], .5));
    const vis = onScreen(canvas);
    let t0 = null;
    gsap.ticker.add(() => {
      if (!vis.on) return;
      const on = panel.classList.contains('on');
      if (on && t0 === null) t0 = performance.now() / 1000;
      if (!on) t0 = null;
      const t = t0 === null ? 0 : performance.now() / 1000 - t0;
      keys.forEach((k, i) => {
        const d = clamp01((t - i * .14) / .7);
        k.position.copy(k.userData.home); k.position.y += (1 - bounceOut(d)) * 10;
        k.rotation.y = (1 - d) * (i % 2 ? 1 : -1);
        k.visible = d > 0;
      });
      const dk = clamp01((t - 1.7) / .9);
      king.position.set(0, KEY_H + .08 + (1 - bounceOut(dk)) * 12, 0);
      king.rotation.y = t * .5;
      king.visible = dk > 0;
      scene.rotation.y = -.35 + Math.sin(t * .25) * .3;
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
  }

  // Image → code → 3D: the same knight as a flat image, as wireframe "code", then as a real glossy piece.
  function knightScene(canvas) {
    if (!canvas) return;
    const renderer = makeRenderer(canvas, false);
    if (!renderer) { canvas.remove(); return; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 100);
    studio(scene, { shadow: false });
    const mats = [
      new T.MeshBasicMaterial({ color: 0x141312 }),                   // 1: a flat silhouette, like a printed image
      new T.MeshBasicMaterial({ color: 0x0057FF, wireframe: true }),  // 2: the structure, like code
      glossy(0xFFD400),                                               // 3: the real object
    ];
    const knight = new T.Mesh(chessGeo('cavallo'), mats[0]);
    knight.scale.setScalar(34);
    scene.add(knight);
    sizer(canvas, renderer, cam, () => { cam.position.set(0, 1.6, 9); cam.lookAt(0, 1.6, 0); });
    const vis = onScreen(canvas);
    const spot = [{ x: 0, y: .9, s: 28, ry: -Math.PI / 2 }, { x: 1.9, y: .5, s: 26, ry: -1.2 }, { x: 0, y: .1, s: 40, ry: 0 }]; // 1: high in the poster, above its title
    let k = -1, x = 0, y = 0, spin = 0;
    gsap.ticker.add(() => {
      if (!vis.on) return;
      const step = window.site.imgStep ?? 0;
      if (step !== k) {
        const s = knight.scale.x;
        k = step; knight.material = mats[k];
        gsap.fromTo(knight.scale, { x: s * .85, y: s * .85, z: s * .85 }, { x: spot[k].s, y: spot[k].s, z: spot[k].s, duration: .7, ease: 'back.out(2)' });
      }
      x += (spot[k].x - x) * .08; y += (spot[k].y - y) * .08;
      spin = k === 0 ? 0 : spin + (k === 2 ? .012 : .006);
      knight.position.set(x, y, 0);
      knight.rotation.y = spot[k].ry + spin;
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
  }

  // "Grazie": chess pieces drift and bounce like brandappart's keychains; the pointer pushes them.
  function chessFloat(canvas) {
    if (!canvas) return;
    const renderer = makeRenderer(canvas, false);
    if (!renderer) { canvas.remove(); return; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .1, 100);
    cam.position.set(0, 0, 16);
    studio(scene, { shadow: false });
    const mats = [0xFFD400, 0x0057FF, 0xFAF7ED, 0x2A2826].map(glossy);
    const names = ['re', 'regina', 'torre', 'alfiere', 'cavallo', 'pedone', 'pedone', 'cavallo', 'torre', 'pedone'];
    const pieces = names.map((n, i) => {
      const m = new T.Mesh(chessGeo(n), mats[i % mats.length]);
      m.scale.setScalar(22 + (i % 3) * 4);
      m.position.set((Math.random() - .5) * 10, (Math.random() - .5) * 5, (Math.random() - .5) * 3);
      m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      m.userData = { v: new T.Vector3((Math.random() - .5) * .04, (Math.random() - .5) * .03, 0), spin: new T.Vector3(.004 + Math.random() * .006, .006 + Math.random() * .008, 0) };
      scene.add(m); return m;
    });
    let bx = 7, by = 4;
    sizer(canvas, renderer, cam, () => { by = Math.tan(cam.fov * Math.PI / 360) * cam.position.z * .9; bx = by * cam.aspect; });
    const mouse = new T.Vector3(99, 99, 0), host = canvas.parentElement;
    host.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width * 2 - 1) * bx, -((e.clientY - r.top) / r.height * 2 - 1) * by, 0);
    });
    host.addEventListener('pointerleave', () => mouse.set(99, 99, 0));
    const vis = onScreen(canvas);
    gsap.ticker.add(() => {
      if (!vis.on) return;
      pieces.forEach(m => {
        const u = m.userData, d = m.position.distanceTo(mouse);
        if (d < 2.4) u.v.add(m.position.clone().sub(mouse).setZ(0).normalize().multiplyScalar(.012 * (2.4 - d)));
        u.v.clampLength(0, .12);
        m.position.add(u.v);
        if (Math.abs(m.position.x) > bx - 1) { u.v.x *= -1; m.position.x = Math.sign(m.position.x) * (bx - 1); }
        if (Math.abs(m.position.y) > by - 1.2) { u.v.y *= -1; m.position.y = Math.sign(m.position.y) * (by - 1.2); }
        u.v.multiplyScalar(.995); if (u.v.length() < .015) u.v.setLength(.015);
        m.rotation.x += u.spin.x; m.rotation.y += u.spin.y;
      });
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
  }

  // ---------- Web: a rotating sphere of names, each with a small spinning cube; a click opens the tool online ----------
  function sphere() {
    const box = $('#sphere');
    if (!box) return;
    const links = $$('a', box);
    const N = links.length, pts = links.map((_, i) => {
      const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996; // Fibonacci sphere
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    let ay = 0, ax = -.25, tx = -.25, paused = false, mx = 0;
    box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; tx = -((e.clientY - r.top) / r.height - .5) * .8; });
    box.addEventListener('pointerleave', () => { mx = 0; });
    links.forEach(a => {
      a.addEventListener('mouseenter', () => { paused = true; });
      a.addEventListener('mouseleave', () => { paused = false; });
      a.addEventListener('focus', () => { paused = true; });
      a.addEventListener('blur', () => { paused = false; });
    });
    const place = () => {
      const R = Math.min(box.clientWidth, box.clientHeight) * .42, cx = box.clientWidth / 2, cy = box.clientHeight / 2;
      const sy = Math.sin(ay), cyy = Math.cos(ay), sx = Math.sin(ax), cxx = Math.cos(ax);
      links.forEach((a, i) => {
        const [x0, y0, z0] = pts[i];
        const x1 = x0 * cyy + z0 * sy, z1 = -x0 * sy + z0 * cyy;
        const y2 = y0 * cxx - z1 * sx, z2 = y0 * sx + z1 * cxx;
        a.style.transform = `translate(${(cx + x1 * R).toFixed(1)}px, ${(cy + y2 * R).toFixed(1)}px) translate(-50%, -50%) scale(${(.55 + (z2 + 1) * .4).toFixed(3)})`;
        a.style.opacity = (.22 + (z2 + 1) * .39).toFixed(3);
        a.style.zIndex = Math.round((z2 + 1) * 100);
      });
    };
    if (!motion) { place(); addEventListener('resize', place); return; }
    const vis = onScreen(box);
    gsap.ticker.add(() => {
      if (!vis.on) return;
      if (!paused) ay += .0035 * (window.site.velocity || 1) + mx * .012;
      ax += (tx - ax) * .05;
      place();
    });
  }

  // ---------- Prisma, playable: drag the file; the active key (3D keys, or ⇧ ⌘ ⌃ on the real keyboard) opens its fan; drop on a bubble ----------
  // As in the app (ArcBubble): formats show their name, tools and actions their SF Symbol, drawn here as SVG.
  const folder = '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>';
  const stack = '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>';
  const ICONS = {
    'Annota': '<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2 3 21l4.8-.8z"/><path d="m15 5 4 4"/>',
    'Ritaglia': '<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>',
    'Ridimensiona': '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    'Design': '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
    'Comprimi': '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
    'Controlla': '<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    'Ruota': '<path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.7L21 8"/><path d="M21 3v5h-5"/>',
    'Metadati': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h.01M7 12h.01M7 15h.01M11 9h6M11 12h6M11 15h6"/>',
    'Apri con': '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M10 14l6-6M10 8h6v6"/>',
    'AirDrop': '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2"/>',
    'In primo piano': stack,
    'Copia in…': stack + '<path d="M15 12v6M12 15h6"/>',
    'Sposta in…': folder + '<path d="M12 10v6M9 13h6"/>',
    'Copia percorso': '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    'Terminale': '<path d="m4 17 6-6-6-6M12 19h8"/>',
    'Mostra': folder,
  };
  const bubble = (t) => ICONS[t]
    ? `<span class="pp-bubble"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[t]}</svg><span class="pp-sr">${esc(t)}</span></span>`
    : `<span class="pp-bubble">${esc(t)}</span>`;
  let setPrismaMode = () => {};
  const prismaMode = (g) => setPrismaMode(g);
  function prisma() {
    const box = $('#pplay');
    if (!box) return;
    const sim = PRISMA_SIM, fan = $('.pp-fan', box), file = $('.pp-file', box), out = $('.pp-out', box), label = $('.pp-label', box);
    let mode = 'shift', drag = null, bubbles = [], hovered = null;
    // Bubbles at even angles on the upper half circle around where the drag began. The radius is the smallest
    // that keeps every pair of neighbours apart (wide labels need room on top, only their height at the sides)
    // and clears the file; if that is too big for the box, the bubbles shrink.
    const openFan = () => {
      const m = sim[mode], W = box.clientWidth, cx = drag.ax, cy = drag.ay, n = m.items.length;
      const SPAN = Math.PI * .9, step = SPAN / (n - 1), a0 = Math.PI + (Math.PI - SPAN) / 2, Rmax = Math.min(W * .46, cy - 20);
      fan.innerHTML = m.items.map(bubble).join('');
      bubbles = $$('.pp-bubble', fan);
      const radius = (k) => {
        fan.style.setProperty('--k', k.toFixed(3));
        const s = bubbles.map(b => [b.offsetWidth, b.offsetHeight]), g = 12 * k;
        let R = (file.offsetWidth + Math.max(...s.map(x => x[0]))) / 2 + g;
        for (let i = 1; i < n; i++) {
          const t = a0 + (i - .5) * step, c = Math.min(((s[i - 1][0] + s[i][0]) / 2 + g) / Math.abs(Math.sin(t)), ((s[i - 1][1] + s[i][1]) / 2 + g) / Math.abs(Math.cos(t)));
          R = Math.max(R, c / 2 / Math.sin(step / 2));
        }
        return R;
      };
      let R = radius(1);
      if (R > Rmax) R = radius(Math.max(.45, Rmax / R));
      bubbles.forEach((b, i) => { const a = a0 + i * step; b.dataset.x = cx + R * Math.cos(a); b.dataset.y = cy + R * Math.sin(a); });
      gsap.fromTo(bubbles, { x: cx, y: cy, scale: 0, autoAlpha: 0 }, { x: (i, b) => +b.dataset.x, y: (i, b) => +b.dataset.y, scale: 1, autoAlpha: 1, duration: reduced ? 0 : .5, ease: 'back.out(1.7)', stagger: reduced ? 0 : .03 });
      hovered = null;
    };
    const closeFan = () => { gsap.to(bubbles, { scale: 0, autoAlpha: 0, duration: reduced ? 0 : .25, stagger: reduced ? 0 : .015 }); bubbles = []; hovered = null; };
    setPrismaMode = (g) => {
      if (g === mode) return;
      mode = g; box.dataset.mode = g; window.site.prismaMode = g;
      if (drag) openFan(); // switching key mid-drag swaps the fan without moving it
    };
    const result = (label) => {
      const what = mode === 'shift' ? `copertina.${label.toLowerCase()} · nuovo file`
        : mode === 'cmd' ? (/Annota|Ritaglia|Controlla|Metadati|Design/.test(label) ? 'si apre il mini tool' : 'copertina 2.heic · nuovo file')
        : 'fatto';
      const li = document.createElement('li');
      li.innerHTML = `<b>${esc(label)}</b><span>${esc(what)}</span>`;
      out.prepend(li);
      while (out.children.length > 3) out.lastElementChild.remove();
      gsap.fromTo(li, { x: -30, autoAlpha: 0, scale: .9 }, { x: 0, autoAlpha: 1, scale: 1, duration: reduced ? 0 : .5, ease: 'back.out(2)' });
      window.site.prismaLast = label;
    };
    file.addEventListener('pointerdown', e => {
      e.preventDefault();
      file.setPointerCapture(e.pointerId);
      const b = box.getBoundingClientRect(), r = file.getBoundingClientRect();
      drag = { ox: e.clientX - r.left - r.width / 2, oy: e.clientY - r.top - r.height / 2, ax: r.left - b.left + r.width / 2, ay: r.top - b.top + r.height / 2 };
      file.classList.add('drag');
      openFan();
    });
    file.addEventListener('pointermove', e => {
      if (!drag) return;
      const b = box.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      gsap.set(file, { x: x - drag.ox - drag.ax, y: y - drag.oy - drag.ay });
      const near = bubbles.reduce((best, bb) => { const d = Math.hypot(+bb.dataset.x - x, +bb.dataset.y - y); return d < (best ? best.d : 50) ? { bb, d } : best; }, null);
      const next = near ? near.bb : null;
      if (next !== hovered) { hovered?.classList.remove('on'); hovered = next; hovered?.classList.add('on'); label.textContent = hovered?.textContent || ''; }
    });
    const drop = () => {
      if (!drag) return;
      const picked = hovered?.textContent;
      drag = null; file.classList.remove('drag'); label.textContent = '';
      gsap.to(file, { x: 0, y: 0, duration: reduced ? 0 : .5, ease: 'power3.out' });
      if (picked) result(picked);
      closeFan();
    };
    file.addEventListener('pointerup', drop);
    file.addEventListener('pointercancel', drop);
    // The real modifiers work too, as in the app: each one presses its 3D key and, held during the drag, picks the fan.
    const MODS = { Shift: 'shift', Meta: 'cmd', Control: 'ctrl' };
    addEventListener('keydown', e => {
      const g = MODS[e.key];
      if (!g || e.repeat) return;
      window.site.prismaKeys?.press(Object.values(MODS).indexOf(g));
      setPrismaMode(g);
    });
    // Keyboard users: Enter on the file runs the suggested bubble of the active fan.
    file.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); result(sim[mode].pick); } });
  }

  // ---------- Copy a command ----------
  function copyButtons() {
    $$('.cmd').forEach(b => b.addEventListener('click', async () => {
      const text = b.dataset.copy;
      try { await navigator.clipboard.writeText(text); }
      catch { // file:// in some browsers: fall back to a hidden selection
        const t = Object.assign(document.createElement('textarea'), { value: text });
        document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
      }
      b.classList.add('copied');
      clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('copied'), 1400);
    }));
  }

  // ---------- Boot ----------
  renderContent();
  $$('.split, #ruolo .beat').forEach(el => wrapWords(el, true));
  $$('.scrub-words').forEach(el => wrapWords(el, false));
  copyButtons();
  kitTabs();
  wireOpen();
  if (motion) setupMotion();
  const ready = () => {
    if (motion) ScrollTrigger.refresh(); else { buildStops(); onScroll(); }
    const target = location.hash && document.getElementById(location.hash.slice(1));
    lenis?.resize(); // Lenis caches the page height; pins just made it much taller
    if (target) scrollToY(firstStop(target), { immediate: true });
    scenes();
    sphere();
    prisma();
    window.site.ready = true;
  };
  if (!motion) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { buildStops(); onScroll(); }); }
  document.fonts ? document.fonts.ready.then(ready) : addEventListener('load', ready);
});
