// Boot: fill the page from data.js, then (if GSAP loaded) add motion.
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const { FAMILIES, SKILLS, CASES, SHARE_URL } = window;

  // ---------- Content ----------
  function renderContent() {
    $$('[data-count="skills"]').forEach(el => { el.textContent = SKILLS.length; });

    const famLabel = Object.fromEntries(FAMILIES.map(f => [f.id, f.label]));
    $('#inv-filters').innerHTML =
      `<button type="button" data-family="all" aria-pressed="true">Tutte<small>${SKILLS.length}</small></button>` +
      FAMILIES.map(f => `<button type="button" data-family="${f.id}" aria-pressed="false">${esc(f.label)}<small>${SKILLS.filter(s => s.family === f.id).length}</small></button>`).join('');
    $('#inv-grid').innerHTML = SKILLS.map((s, i) =>
      `<button type="button" class="skill" data-family="${s.family}" data-i="${i}" title="${esc(famLabel[s.family])}">${esc(s.name)}</button>`).join('');

    $('#cases-track').innerHTML = CASES.map((c, i) => `
      <article class="case" data-at="${i + 1}">
        <div class="case-copy">
          <span class="case-kind">${esc(c.kind)}</span>
          <h3>${esc(c.name)}</h3>
          <p><b>Problema</b>${esc(c.problem)}</p>
          <div class="case-skills">${c.skills.map(n => `<code>${esc(n)}</code>`).join('')}</div>
          <p><b>Risultato</b>${esc(c.result)}</p>
        </div>
        <div class="case-visual" aria-hidden="true">${c.visual}</div>
      </article>`).join('');

    const labels = ['Richiesta', 'Domande', 'Spec', 'Piano', 'App'];
    const ll = CASES.find(c => c.id === 'layerlink');
    $('#anatomy').innerHTML = ll.steps.map((t, i) =>
      `<li data-at="${i + 1}"><span class="an-label">${String(i + 1).padStart(2, '0')} · ${labels[i]}</span><span class="an-text">${esc(t)}</span></li>`).join('');

    const link = $('#share-link');
    link.href = SHARE_URL;
    link.textContent = SHARE_URL.replace(/^https:\/\//, '').replace(/\/$/, '');
  }

  // ---------- Motion engine ----------
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const secs = $$('section.sec');
  const pins = new Map(); // section -> ScrollTrigger, only while pinning is active
  const presenter = window.presenter = { stops: [], go };

  function setStep(sec, k) {
    if (sec.dataset.step !== String(k)) {
      sec.dataset.step = k;
      sec.dispatchEvent(new CustomEvent('step', { detail: k }));
    }
  }

  function setupMotion() {
    document.documentElement.classList.add('motion');
    gsap.registerPlugin(ScrollTrigger);
    // ponytail: pin only on wide screens; phones read the sections stacked (Fase 2 refines mobile)
    gsap.matchMedia().add('(min-width: 901px)', () => {
      secs.filter(s => +s.dataset.steps > 1).forEach(sec => {
        const steps = +sec.dataset.steps;
        setStep(sec, 1);
        pins.set(sec, ScrollTrigger.create({
          trigger: sec, start: 'top top', end: '+=' + (steps - 1) * 100 + '%', pin: true,
          onUpdate: self => {
            sec.style.setProperty('--p', self.progress.toFixed(4));
            setStep(sec, 1 + Math.round(self.progress * (steps - 1)));
          },
        }));
      });
      return () => { pins.clear(); secs.forEach(s => setStep(s, s.dataset.steps)); };
    });
    ScrollTrigger.addEventListener('refresh', buildStops);
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .2 });
    secs.forEach(s => io.observe(s));
  }

  function buildStops() {
    const bar = innerWidth <= 900 ? $('.index').offsetHeight : 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    presenter.stops = computeStops(secs.map(sec => {
      const st = pins.get(sec);
      return {
        id: sec.id, num: sec.id.slice(1), steps: +sec.dataset.steps,
        top: Math.min(max, Math.max(0, st ? st.start : sec.getBoundingClientRect().top + scrollY - bar)),
        pinLength: st ? st.end - st.start : 0,
      };
    }));
    updateIndicator();
  }

  // Chain rapid presses from the pending target, not from the mid-animation scroll position.
  let pending = null, pendingTimer;
  function go(dir) {
    if (!presenter.stops.length) return;
    const s = targetStop(presenter.stops, pending ?? scrollY, dir);
    pending = s.y;
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => { pending = null; }, 1500); // fallback where scrollend is missing
    scrollTo({ top: s.y, behavior: reduced ? 'auto' : 'smooth' });
  }
  addEventListener('scrollend', () => { pending = null; });

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    const fwd = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const back = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!fwd && !back) return;
    e.preventDefault();
    go(fwd ? 1 : -1);
  });

  const posEl = $('#pos'), links = $$('.index nav a'), index = $('.index');
  function updateIndicator() {
    const st = presenter.stops;
    if (!st.length) return;
    const near = st.reduce((a, b) => Math.abs(b.y - scrollY) < Math.abs(a.y - scrollY) ? b : a);
    const label = stopLabel(near);
    if (posEl.textContent !== label) posEl.textContent = label;
    links.forEach(a => a.classList.toggle('on', a.dataset.num === near.num));
    const max = document.documentElement.scrollHeight - innerHeight;
    index.style.setProperty('--read', max > 0 ? (scrollY / max).toFixed(4) : 0);
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; updateIndicator(); });
  }, { passive: true });

  renderContent();
  if (motion) setupMotion();
  else secs.forEach(s => setStep(s, s.dataset.steps));
  if (motion) ScrollTrigger.refresh(); // fires 'refresh' → buildStops
  else { buildStops(); addEventListener('resize', buildStops); addEventListener('load', buildStops); }
})();
