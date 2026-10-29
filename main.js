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
      `<button type="button" class="skill" data-family="${s.family}" data-i="${i}" aria-label="${esc(s.name)}">${esc(s.name.replace('superpowers:', ''))}</button>`).join('');

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

  // ---------- 04 Inventario ----------
  function inventory() {
    const famLabel = Object.fromEntries(FAMILIES.map(f => [f.id, f.label]));
    const detail = $('#inv-detail'), skills = $$('#inv-grid .skill');
    const show = (btn) => {
      const s = SKILLS[+btn.dataset.i];
      skills.forEach(b => b.classList.toggle('on', b === btn));
      detail.innerHTML = `<span class="fam">${esc(famLabel[s.family])}</span><h3>${esc(s.name)}</h3>
        <p><b>Cosa fa</b>${esc(s.what)}</p><p><b>Quando la uso</b>${esc(s.when)}</p>`;
    };
    skills.forEach(b => ['mouseenter', 'focus', 'click'].forEach(ev => b.addEventListener(ev, () => show(b))));
    $$('#inv-filters button').forEach(btn => btn.addEventListener('click', () => {
      const f = btn.dataset.family;
      $$('#inv-filters button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      let i = 0;
      skills.forEach(b => {
        b.hidden = f !== 'all' && b.dataset.family !== f;
        if (b.hidden) return;
        b.classList.remove('pop'); void b.offsetWidth; // restart the entrance animation
        b.style.animationDelay = (i++ * 14) + 'ms';
        b.classList.add('pop');
      });
    }));
  }

  // ---------- 05 Lenti ----------
  const LENSES = ['base', 'brutalist', 'soft', 'editorial'];
  function lenses() {
    const stage = $('#lens-stage'), btns = $$('.lenses button');
    const set = (l) => {
      stage.dataset.lens = l;
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lens === l)));
    };
    btns.forEach(b => b.addEventListener('click', () => set(b.dataset.lens)));
    $('#s05').addEventListener('step', e => set(LENSES[e.detail - 1] || 'base'));
  }

  // ---------- 07 / 08: mark the current item of a stepped list ----------
  function stepItems(secSel, itemSel) {
    const items = $$(itemSel);
    $(secSel).addEventListener('step', e => items.forEach((el, i) => {
      el.classList.toggle('active', i === e.detail - 1);
      el.classList.toggle('done', i < e.detail - 1);
    }));
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
      return () => { pins.clear(); secs.forEach(s => { s.dataset.step = s.dataset.steps; }); };
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

  // ---------- Hero: one point per skill on a sphere ----------
  async function hero3d() {
    const canvas = $('#hero-gl');
    let THREE;
    try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); }
    catch { canvas.style.display = 'none'; return; }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
    cam.position.z = 6.2;
    const group = new THREE.Group();
    scene.add(group);

    const R = 1.7, N = SKILLS.length;
    const pts = SKILLS.map((_, i) => {
      const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996; // Fibonacci sphere
      return new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(R);
    });
    const ink = new THREE.Color('#111113'), acc = new THREE.Color('#3b5bff');
    const own = new Set(['inventario', 'compliance']); // skill scritte da Leonardo
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 14, 14), new THREE.MeshBasicMaterial(), N);
    const m = new THREE.Matrix4();
    pts.forEach((p, i) => {
      const s = own.has(SKILLS[i].name) ? 1.9 : 1;
      dots.setMatrixAt(i, m.makeScale(s, s, s).setPosition(p));
      dots.setColorAt(i, own.has(SKILLS[i].name) ? acc : ink);
    });
    group.add(dots);
    const seg = [];
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && a.distanceTo(b) < .9) seg.push(a, b); }));
    group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),
      new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: .12 })));

    const size = () => { const w = canvas.clientWidth; renderer.setSize(w, w, false); };
    new ResizeObserver(size).observe(canvas);
    size();

    // Hover a point → its skill name.
    const tip = document.createElement('div');
    tip.className = 'gl-tip';
    canvas.after(tip);
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(2, 2);
    let mx = 0, my = 0;
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      tip.style.transform = `translate(${canvas.offsetLeft + e.clientX - r.left + 14}px, ${canvas.offsetTop + e.clientY - r.top + 14}px)`;
    });
    canvas.addEventListener('pointerleave', () => { ndc.set(2, 2); tip.classList.remove('on'); });
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });

    const frame = (t) => {
      const p = Math.min(1, scrollY / innerHeight);
      group.rotation.y += .0022;
      group.rotation.x += (my * .7 - group.rotation.x) * .04;
      group.rotation.z += (mx * .35 - group.rotation.z) * .04;
      group.scale.setScalar((1 + Math.sin(t * .0012) * .015) * (1 + p * .35));
      group.position.y = p * .8;
      ray.setFromCamera(ndc, cam);
      const hit = ray.intersectObject(dots)[0];
      if (hit) { tip.textContent = SKILLS[hit.instanceId].name; tip.classList.add('on'); }
      else tip.classList.remove('on');
      renderer.render(scene, cam);
    };
    frame(0);
    canvas.dataset.ready = '1';
    if (reduced) return;
    new IntersectionObserver(([e]) => renderer.setAnimationLoop(e.isIntersecting ? frame : null)).observe(canvas);
  }

  renderContent();
  inventory();
  lenses();
  stepItems('#s07', '#cases-track .case');
  stepItems('#s08', '#anatomy li');
  hero3d();
  if (motion) setupMotion();
  else secs.forEach(s => { s.dataset.step = s.dataset.steps; }); // no step events: lenses stay on base
  if (motion) ScrollTrigger.refresh(); // fires 'refresh' → buildStops
  else { buildStops(); addEventListener('resize', buildStops); addEventListener('load', buildStops); }
})();
