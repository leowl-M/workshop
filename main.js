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

  renderContent();
})();
