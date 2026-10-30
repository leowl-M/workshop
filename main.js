// Boot: load content.json (edited from Pages CMS, .pages.yml), build the page, then (motion allowed) smooth scroll, pinned set pieces and the 3D scenes.
// The 3D vocabulary is always the same two things, keycaps and chess pieces, used in different ways.
fetch('content.json', { cache: 'no-cache' }).then(r => r.json()).then(content => {
  Object.assign(window, content);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const { FAMILIES, SKILLS, PROJECTS, GROUPS, METHOD, METHOD_KEYS, FOLDER, SLOTS, SLOT_SIZE, KEYS, KIT, WEBAPPS, TEXTS, PRISMA_SIM } = window;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const html = document.documentElement;
  if (motion) html.classList.add('motion');
  history.scrollRestoration = 'manual'; // the deck decides where a reload lands: the hash, else the stop you were on, else the top
  const IMG = 'media/projects/';
  const ORDER = GROUPS.flatMap(g => PROJECTS.filter(p => p.group === g.id));
  const byId = (id) => PROJECTS.find(p => p.id === id);
  const inGroup = (g) => ORDER.filter(p => p.group === g);

  // Placeholder: a numbered solid block; it shows the real picture as soon as media/projects/img-NN.jpg exists.
  const slot = (id, cls = '') => `<div class="slot ${cls}" data-n="${+id.slice(4)}">
    <img src="${IMG}${id}.jpg" alt="${esc(SLOTS[id])}" onerror="this.remove()">
    <span class="slot-num">${id.toUpperCase()}</span><span class="slot-txt">Immagine da cambiare · ${esc(SLOTS[id])}</span>
    <span class="slot-size">${SLOT_SIZE} px · media/projects/${id}.jpg</span></div>`;

  // How it works: steps on the left, a mock on the right; .how-vis[data-step] drives the mock, one state per stop.
  // Built after data-t runs, so it reads its texts from TEXTS[key] itself.
  const how = (key, vis) => { const T = TEXTS[key]; return `<section id="${key}-how" class="sec pin how" data-theme="blue" data-chapter="Progetti">
    <div class="stage img-stage demo-stage">
      <div class="img-steps">
        <p class="kicker">${T.kicker}</p><h2 class="demo-title">${T.titolo}</h2>
        <ol class="isteps">${[1, 2, 3, 4].map(n => `<li class="istep"><b>${n}</b><div><h3>${T[`passo${n}_titolo`]}</h3><p>${T[`passo${n}_testo`]}</p></div></li>`).join('')}</ol>
      </div>
${vis}    </div></section>`; };
  const HOW = {
    composer: `
      <div class="cp how-vis" id="cp" data-step="3" aria-hidden="true">
        <div class="ed-bar"><i></i><i></i><i></i><span>Composer</span><span class="cp-crumb">Studio Rossi › Autunno 2026</span></div>
        <div class="cp-body">
          <div class="cp-side">
            <div class="cp-p p0"><p class="h">Livelli · Figma</p>
              <ul class="cp-layers"><li><b>#</b>Titolo<span>testo</span></li><li><b>#</b>Data<span>testo</span></li><li><b>$</b>Cerchio<span>forma</span></li><li><b>^</b>Logo<span>overlay</span></li></ul>
              <p class="cp-note">Il simbolo dice cosa si potrà cambiare.</p></div>
            <div class="cp-p p1"><p class="h">Controllo di fedeltà</p>
              <ul class="cp-check"><li>4 livelli riconosciuti</li><li>Font disponibili</li><li class="fix">Testo fuori dal frame<small>corretto in un clic</small></li></ul>
              <span class="cp-btn">Estrai template</span></div>
            <div class="cp-p p2"><p class="h">Compila</p>
              <p class="cp-field">Titolo<span>Nuova collezione</span></p><p class="cp-field">Data<span>Dal 1 dicembre</span></p>
              <p class="cp-field">Colori<span class="cp-sw"><i></i><i></i><i></i></span></p></div>
            <div class="cp-p p3"><p class="h">Clienti</p>
              <ul class="cp-tree"><li>Studio Rossi</li><li class="d1">Autunno 2026</li><li class="d2 on">Nuova collezione</li><li>Caffè Bruno</li><li>Libreria Est</li></ul></div>
          </div>
          <div class="cp-stage">
            <div class="cp-post"><span class="f-lab">Post · 1080×1350</span><div class="art"><i></i><b>● Studio</b><small><span class="t-a">Dal 3 al 10 novembre</span><span class="t-b">Dal 1 dicembre</span></small><strong><span class="t-a">Saldi <br>d'autunno</span><span class="t-b">Nuova <br>collezione</span></strong></div></div>
            <div class="cp-story"><span class="f-lab">Storia · 1080×1920</span><div class="art"><i></i><b>● Studio</b><small><span class="t-a">Dal 3 al 10 novembre</span><span class="t-b">Dal 1 dicembre</span></small><strong><span class="t-a">Saldi <br>d'autunno</span><span class="t-b">Nuova <br>collezione</span></strong></div></div>
          </div>
        </div>
      </div>
`,
    editor: `
      <div class="ed how-vis" id="ed" data-step="3" aria-hidden="true">
        <div class="ed-bar"><i></i><i></i><i></i><span>studio.html · Editor</span>
          <span class="ed-roles"><b class="r-ospite">Ospite</b><b class="r-cliente">Cliente</b><b class="r-staff">Staff</b></span></div>
        <div class="ed-body">
          <ul class="ed-index"><li class="g">Sito pubblico</li><li class="on">Home</li><li>Lezioni</li><li>Prezzi</li><li class="g">Area riservata</li><li>Prenota</li><li>Le mie prenotazioni</li><li>Calendario</li></ul>
          <div class="ed-screen">
            <div class="ed-page"><p class="ed-url">app.studio.it</p>
              <div class="ed-nav"><b>● Studio</b><span>Lezioni</span><span>Prezzi</span><span class="ed-who"><i class="v-cliente">Giulia</i><i class="v-ospite">Accedi</i></span></div>
              <div class="ed-hero"><div><p class="ed-h"><span class="v-cliente">Ciao Giulia</span><span class="v-ospite">Allenati con noi</span></p>
                <p class="ed-sub"><span class="v-cliente">Hai 2 lezioni questa settimana.</span><span class="v-ospite">Yoga, pilates e funzionale, tutti i giorni.</span></p>
                <span class="ed-btn"><span class="v-cliente">Prenota</span><span class="v-ospite">Prova gratis</span></span></div><i class="ed-img"></i></div>
              <p class="ed-k">Le tue prossime lezioni</p>
              <div class="ed-cards">${['Lun 18:30 · Yoga', 'Gio 18:30 · Pilates', 'Sab 10:00 · Funzionale'].map(t => `<span>${t}</span>`).join('')}
                <div class="ed-lock"><b>Solo per Cliente e Staff</b><small>Serve un account per vederle.</small></div></div></div>
          </div>
          <div class="ed-side">
            <div class="s-cliente"><p class="h">Cliente · può</p><p>Vedere le sue prossime lezioni</p><p>Prenotare dalla home</p><p class="h no">Non può</p><p>Vedere chi altro è iscritto</p></div>
            <div class="s-ospite"><p class="h">Ospite · può</p><p>Vedere lezioni e prezzi</p><p>Chiedere una prova gratis</p><p class="h no">Non può</p><p>Vedere le prossime lezioni</p></div>
          </div>
        </div>
        <pre class="ed-code"><b>// progetti/studio/spec.js</b>
{ id: 'home', g: 'pub', label: 'Home',
  acc: { ospite: 'read', cliente: 'write',
         staff: 'full' },
  can:  { cliente: ['Prenotare dalla home'] },
  cant: { ospite: ['Vedere le prossime lezioni'] } }</pre>
        <div class="ed-share"><b>✓ studio.html</b><span>1 file · si apre offline</span><span class="ed-figma">→ In Figma, con livelli veri</span></div>
      </div>
`,
  };

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
        if (HOW[p.id]) { // a one-screen preview, then how it works
          out += `<section id="p-${p.id}" class="sec screen project-one" data-theme="${themes[n % 2]}" data-chapter="Progetti">
            <div class="stage"><div class="ptext"><p class="pindex">${pad(n)} / ${pad(ORDER.length)}</p><h3 class="pname split">${esc(p.name)}</h3><span class="pkind">${esc(p.kind)}</span>
              <p class="plabel">Il problema</p><p class="pproblem">${esc(p.problem)}</p><p class="plabel">Cosa fa</p><p class="psolution">${esc(p.solution)}</p></div>
            <div class="pone">${p.imgs.map(id => slot(id, 'pone-img')).join('')}</div></div></section>` + how(p.id, HOW[p.id]);
          return;
        }
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
    // The Claude Code folder: in full with notes once, then beside every step with the file it works on lit up.
    const tree = (here, notes) => FOLDER.map(f => `<li style="--d: ${f.d}"${f.name === here ? ' class="here"' : ''}><b>${esc(f.name)}</b>${notes ? `<span>${esc(f.note)}</span>` : ''}</li>`).join('');
    $('#folder').innerHTML = tree(null, true);
    // Claude Code window: each line of a conversation is a span, so the lines come in one after the other.
    $$('#claude .cc-convo').forEach(pre => { pre.innerHTML = pre.innerHTML.split('\n').map((l, i) => `<span class="ln" style="--i: ${i}">${l || ' '}</span>`).join(''); });
    // Overview first: all nine steps at a glance, then one per panel.
    $('#method-track').insertAdjacentHTML('beforeend', `<div class="panel mover"><h3>Nove passi, <em>dall'idea al rilascio.</em></h3>
      <div class="mover-phases">${['Preparare', 'Progettare', 'Costruire'].map((p, i) => `<span style="--i: ${i * 3}">${p}</span>`).join('')}</div>
      <ol class="mover-list"><i class="mover-line" aria-hidden="true"></i>${METHOD.map((m, i) => `<li style="--i: ${i}"><b>${i + 1}</b><span>${esc(m.name)}</span></li>`).join('')}</ol></div>`);
    // The nine steps as one Claude Code session: per stop the conversation of that step, the file it works on lit in the folder,
    // then the finished plugin and the 3D base.
    const ccWin = (body) => `<div class="cc-bar"><i></i><i></i><i></i><span>claude — ~/formati-plugin</span></div>
      <div class="cc-body">${body}<div class="cc-input"><span>&gt;</span><i></i></div><p class="cc-hint">? for shortcuts</p></div>`;
    $('#passi').innerHTML = `<div class="stage cc-stage">
      <div class="cc-head"><p class="kicker">Il metodo, dal vivo</p>
        <ol class="cc-tabs cc-dots">${METHOD.map((m, i) => `<li><b>${i + 1}</b><span>${esc(m.name)}</span></li>`).join('')}<li><b>✓</b><span>Il prodotto</span></li></ol></div>
      <div class="cc-main">
        <div class="cc ps" id="ps" data-step="0" aria-label="Una sessione di Claude Code, passo per passo">${ccWin(`
          <div class="ps-cols"><ul class="tree ps-tree" aria-label="Cartella del progetto">${FOLDER.map(f => `<li style="--d: ${f.d}" data-name="${esc(f.name)}"><b>${esc(f.name)}</b></li>`).join('')}</ul>
            <div class="cc-log">${METHOD.map(m => `<pre class="cc-convo">${m.chat.map((l, i) => `<span class="ln" style="--i: ${i}">${l || ' '}</span>`).join('')}</pre>`).join('')}
              <div class="cc-convo ps-done"><div class="ps-plugin"><p>Dieci formati.<br><em>Un pulsante.</em></p><span>Fai la<br>magia</span></div>
                <p class="ps-ok"><i>●</i> formati-plugin · installato nel team   ✓</p></div></div></div>`)}</div>
        <div class="cc-caps">${METHOD.map((m, i) => `<div class="cc-cap"><span class="big-num">${i + 1}</span><h3>${esc(m.name)}</h3><p>${esc(m.what)}</p>${m.skill ? `<code>${esc(m.skill)}</code>` : ''}</div>`).join('')}
          <div class="cc-cap"><span class="big-num">✓</span><h3>Il prodotto.</h3><p>Un plugin Figma vero, pronto per il team. Adesso vediamolo in azione.</p></div></div>
      </div>
      <div class="panel mbase"><canvas class="base-gl" id="base-gl" aria-hidden="true"></canvas>
        <div class="mbase-copy"><h3>Nove passi.<br><em>Una base solida.</em></h3><p>Ogni progetto parte da qui. Ecco cosa ne è uscito.</p></div></div>
    </div>`;


    // Demo: the ten formats the plugin makes, in three rows of the Figma canvas (row height in % of the canvas).
    const FORMATS = [
      [26, [['Post', 1080, 1080], ['Post verticale', 1080, 1350], ['Storia', 1080, 1920]]],
      [20, [['Pin', 1000, 1500], ['A4', 2480, 3508], ['Banner', 300, 250]]],
      [15, [['YouTube', 1920, 1080], ['Link', 1200, 628]]],
      [7, [['Leaderboard', 728, 90], ['Header X', 1500, 500]]],
    ];
    const art = $('#fig .fig-orig .art').outerHTML;
    let fi = 0;
    $('#fig-out').innerHTML = FORMATS.map(([h, row]) => `<div class="fig-row" style="height: ${h}cqmin">${row.map(([name, w, hh]) =>
      `<div class="ff${w / hh > 5 ? ' wide' : ''}" style="--w: ${w}; --h: ${hh}; --i: ${fi++}"><span class="f-lab">${name}</span>${art}</div>`).join('')}</div>`).join('');
    $('#fig-list').innerHTML = FORMATS.flatMap(([, row]) => row).map(([name, w, hh]) => `<li><b>${name}</b><span>${w}×${hh}</span></li>`).join('');

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
    if (lenis) lenis.scrollTo(y, { duration: opts.immediate ? 0 : 1, easing: t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2), immediate: !!opts.immediate, lock: false, force: true, onComplete: () => { pending = null; } });
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
  let current = null, lastFocus = null, modalList = [];
  const modalOpen = () => !modal.hidden;
  function openProject(id, list) { // list: the projects ← → move through (hero keys pass all of theirs)
    const p = byId(id);
    if (!p) return;
    if (list) { showInModal(p, list); return; }
    if (p.group !== 'figma') { scrollToY(firstStop(document.getElementById('p-' + id))); return; }
    showInModal(p, inGroup('figma'));
  }
  // Every project in the list is a card on an arc; the current one sits on top, the arc turns to the next.
  const modalCard = (p, list) => `<article class="modal-card" data-id="${p.id}"><div class="modal-body">
      <p class="pindex">${esc(GROUPS.find(g => g.id === p.group)?.label ?? '')} · ${pad(list.indexOf(p) + 1)} / ${pad(list.length)}</p>
      <h3 class="modal-name">${esc(p.name)}</h3><span class="pkind">${esc(p.kind)}</span>
      <div class="modal-cols">${p.problem ? `<div><p class="plabel">Il problema</p><p class="modal-text">${esc(p.problem)}</p></div>` : ''}
        <div><p class="plabel">Cosa fa</p><p class="modal-text">${esc(p.solution)}</p></div></div>
      <ul class="pdetails">${p.details.map(d => `<li>${esc(d)}</li>`).join('')}<li class="stack">${esc(p.stack)}</li></ul></div></article>`;
  function showInModal(p, list = modalList) {
    const arc = $('#modal-arc'), n = list.length, i = list.indexOf(p);
    if (list !== modalList || !arc.children.length) arc.innerHTML = list.map(q => modalCard(q, list)).join('');
    current = p; modalList = list;
    if (modal.hidden) {
      lastFocus = document.activeElement;
      modal.hidden = false;
      lenis?.stop();
      if (motion) gsap.fromTo('.modal-arc', { y: 60, scale: .96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .6, ease: 'expo.out' });
      if (motion) gsap.fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: .3 });
      $('.modal-close').focus();
    }
    // Step angle so neighbours sit side by side: chord at the cards' bottom edge (5 heights from the pivot) = width + gap.
    arc.style.setProperty('--step', 2 * Math.asin(Math.min(1, (arc.offsetWidth + 32) / (10 * arc.offsetHeight))) + 'rad');
    $$('.modal-card', arc).forEach((c, j) => {
      const r = ((j - i) % n + n) % n, o = r > n / 2 ? r - n : r; // shortest way round
      c.style.setProperty('--o', o);
      c.style.opacity = Math.abs(o) > 2 ? 0 : 1;
      c.style.zIndex = 10 - Math.abs(o);
      c.classList.toggle('on', o === 0);
      c.setAttribute('aria-hidden', o !== 0);
      c.querySelector('.modal-name').id = o === 0 ? 'modal-title' : '';
    });
    $('#modal-count').textContent = `${pad(i + 1)} / ${pad(n)}`;
    $$('.modal-card', arc).forEach(c => { // all the text fits: shrink the title until the card stops scrolling
      const b = $('.modal-body', c), t = $('.modal-name', c);
      t.style.fontSize = '';
      for (let f = parseFloat(getComputedStyle(t).fontSize); b.scrollHeight > b.clientHeight && f > 24; f -= 2) t.style.fontSize = f - 2 + 'px';
    });
  }
  function closeModal() {
    if (modal.hidden) return;
    const done = () => { modal.hidden = true; lenis?.start(); lastFocus?.focus?.({ preventScroll: true }); };
    if (motion) gsap.to('.modal-arc', { y: 40, opacity: 0, duration: .25, ease: 'power2.in', onComplete: done }); else done();
  }
  function stepModal(d) {
    const list = modalList;
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
      const side = e.target.closest('.modal-card:not(.on)'); // a card at the side turns the arc to it
      if (side) showInModal(byId(side.dataset.id));
    });
  }

  // ---------- Motion: pinned set pieces ----------
  // Pin a section for `len` screens; `at` lists the progress of each stop inside it.
  function pin(sec, len, build, at) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: '+=' + Math.round(len * 100) + '%', pin: true, scrub: true, animation: tl });
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
        .to('#hero .hero-by', { autoAlpha: 0, duration: .2 }, .05)
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

    // The question and its two answers, all inside one blue circle: it opens from the centre, then each line hands over to the next.
    const beats = $$('#domanda .beat'), words = (el) => $$('.w > span', el);
    gsap.set(beats.slice(1), { autoAlpha: 0 });
    pin($('#domanda'), 3, (tl) => {
      tl.fromTo('#domanda .growbox', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1, ease: 'power2.inOut' })
        .set('#domanda', { attr: { 'data-theme': 'blue' } }, .95) // once the circle covers the screen the page is blue: logo and rail turn cream
        .addLabel('b0', 1);
      [1, 2].forEach(k => {
        const t = tl.labels['b' + (k - 1)] + .2;
        tl.to(words(beats[k - 1]), { yPercent: -110, stagger: .02, duration: .35, ease: 'power2.in' }, t)
          .set(beats[k - 1], { autoAlpha: 0 }, t + .45)
          .set(beats[k], { autoAlpha: 1 }, t + .45)
          .fromTo(words(beats[k]), { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .45, ease: 'power3.out' }, t + .45)
          .addLabel('b' + k, t + 1.05);
      });
      tl.to({}, { duration: .2 });
    }, (tl) => labelsAt(tl, 3));

    // Method: two horizontal tracks, each panel a stop; between them the Claude Code window. The last panel builds the base in 3D.
    const hTrack = (sec) => {
      const track = $('.track', sec), panels = $$('.panel', sec);
      const maxX = () => track.scrollWidth - innerWidth;
      pin(sec, panels.length, (tl) => {
        tl.to(track, { x: () => -maxX(), duration: 1 });
      }, () => panels.map(p => Math.min(1, Math.max(0, (p.offsetLeft + p.offsetWidth / 2 - innerWidth / 2) / maxX()))));
      ScrollTrigger.create({
        trigger: sec, start: 'top top', end: () => fractions.get(sec).st.end, onUpdate: self => {
          const x = self.progress * maxX() + innerWidth / 2;
          panels.forEach(p => p.classList.toggle('on', x > p.offsetLeft && x < p.offsetLeft + p.offsetWidth));
        },
      });
    };
    hTrack($('#metodo'));
    // A Claude Code window that moves one stop at a time: tab, conversation and caption k are on; onStep does the rest.
    const ccPin = (sec, n, onStep) => {
      const cc = $('.cc', sec), lists = [$$('.cc-tabs li', sec), $$('.cc-cap', sec), $$('.cc-convo', sec)];
      pin(sec, n - 1, () => {}, Array.from({ length: n }, (_, i) => .04 + i * .92 / (n - 1)));
      const st = fractions.get(sec).st;
      const set = (k) => {
        if (cc.dataset.step === String(k)) return;
        cc.dataset.step = k; window.site[sec.id + 'Step'] = k;
        lists.forEach(list => list.forEach((el, i) => el.classList.toggle('on', i === k)));
        onStep?.(k);
      };
      ScrollTrigger.create({ trigger: sec, start: () => st.start, end: () => st.end, onUpdate: self => set(Math.min(n - 1, Math.floor(self.progress * n))) });
      cc.dataset.step = ''; set(0);
    };
    // Skills in practice: four questions.
    ccPin($('#claude'), 4);
    hTrack($('#metodo-passi'));
    // The nine steps live, then the product, then the base (its panel turns on, so the 3D keys land).
    const psTree = $$('#ps .ps-tree li'), base = $('#passi .mbase');
    ccPin($('#passi'), METHOD.length + 2, (k) => {
      psTree.forEach(li => li.classList.toggle('here', li.dataset.name === METHOD[k]?.here));
      $('#passi').classList.toggle('at-base', k === METHOD.length + 1);
      base.classList.toggle('on', k === METHOD.length + 1);
    });

    // Demo: one Figma state per stop (selected, plugin open, creating, done).
    const dsteps = $$('#demo .istep'), fig = $('#fig');
    pin($('#demo'), 3, () => {}, [.06, .36, .66, .96]);
    const demoST = fractions.get($('#demo')).st;
    const setDemoStep = (k) => {
      if (fig.dataset.step === String(k)) return;
      fig.dataset.step = k; window.site.demoStep = k;
      dsteps.forEach((s, i) => s.classList.toggle('on', i === k));
    };
    ScrollTrigger.create({ trigger: '#demo', start: () => demoST.start, end: () => demoST.end, onUpdate: self => setDemoStep(Math.min(3, Math.floor(self.progress * 4))) });
    setDemoStep(0);

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

    // How it works: one mock state per stop.
    window.site.how = {};
    $$('.how').forEach(sec => {
      const steps = $$('.istep', sec), vis = $('.how-vis', sec);
      pin(sec, 3, () => {}, [.06, .36, .66, .96]);
      const st = fractions.get(sec).st;
      const set = (k) => {
        if (vis.dataset.step === String(k)) return;
        vis.dataset.step = k; window.site.how[sec.id] = k;
        steps.forEach((s, i) => s.classList.toggle('on', i === k));
      };
      ScrollTrigger.create({ trigger: sec, start: () => st.start, end: () => st.end, onUpdate: self => set(Math.min(3, Math.floor(self.progress * 4))) });
      set(0);
    });

    wordScrub($('#tempo'));

    // Finale (last pin, pins are created in page order): the closing page (live, chess included) shrinks into the MacBook, then the terminal and the notes open beside it, line by line.
    const lines = (pre) => { pre.innerHTML = pre.innerHTML.split('\n').map(l => `<span class="ln">${l || ' '}</span>`).join(''); return $$('.ln', pre); };
    const termLines = lines($('#outro .term-win pre')), noteLines = lines($('#outro .notes-win pre'));
    pin($('#outro'), 2.8, (tl) => {
      tl.addLabel('b0', .05)
        .addLabel('b1', 1.1)
        .fromTo('#outro .term-win', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: .3, ease: 'power3.out' }, 1.25)
        .fromTo('#outro .notes-win', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: .3, ease: 'power3.out' }, 1.35)
        .fromTo(termLines, { opacity: 0 }, { opacity: 1, stagger: .045, duration: .01 }, 1.45)
        .fromTo(noteLines, { opacity: 0 }, { opacity: 1, stagger: .022, duration: .01 }, 1.5)
        .addLabel('b2', 2.4)
        .to('#outro .win', { opacity: 0, y: 30, duration: .25, ease: 'power2.in' }, 2.5) // then the lid closes (LID_CLOSE) and the thanks land
        .fromTo('#outro .outro-grazie .w > span', { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: .03, duration: .4, ease: 'power3.out' }, 3.15)
        .addLabel('b3', 3.7).to({}, { duration: .2 });
    }, (tl) => labelsAt(tl, 4));

    // Reveals for headings and copy outside pins.
    // The hero is on screen at load: play once, no trigger (the name sits below 90% and never fired; reversing hid the title).
    const trig = (el, start) => el.closest('#hero') ? undefined : { trigger: el, start, toggleActions: 'play none none reverse' };
    $$('.split').forEach(el => {
      if (el.closest('#domanda, #outro')) return;
      gsap.fromTo($$('.w > span', el), { yPercent: 115, rotateX: -25 }, { yPercent: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', stagger: .045,
        scrollTrigger: trig(el, 'top 85%') });
    });
    $$('.reveal').forEach(el => gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: trig(el, 'top 90%') }));

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
  const land = (t) => 1 - Math.pow(1 - t, 4); // soft landing, no bounce
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
  function keyboard(canvas, defs, { rows, onPress, progress, fill = .62, look = [0, 1.6, -.6], spin = .12, tilt, rise } = {}) {
    if (!canvas) return null;
    const renderer = makeRenderer(canvas);
    if (!renderer) { canvas.remove(); return null; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(rise ? 8 : 28, 1, .1, 200); // rise: a long lens, nearly flat
    studio(scene, { shadow: !rise });
    // rise: keys come up from under the page in their own place instead of falling; nothing below the page shows.
    if (rise) { renderer.clippingPlanes = [new T.Plane(new T.Vector3(0, 1, 0), .08)]; canvas.style.height = '100%'; } // no sky needed: the keys stay in the box
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
      frame(cam, widest + .6, groups.length * 1.2, fill, look, tilt);
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
      gsap.timeline().to(k.userData, { press: 1, duration: .14, ease: 'power2.inOut' }).to(k.userData, { press: 0, duration: .6, ease: 'power3.out' });
      setTimeout(() => onPress?.(k.userData.def), 240);
    };
    area.addEventListener('click', () => { if (hovered && landed) press(hovered); });
    gsap.ticker.add(() => {
      if (!vis.on) { since = null; return; }
      const now = performance.now() / 1000;
      if (since === null) since = now;
      const drop = progress ? progress() : clamp01((now - since) / 1.6);
      landed = drop >= 1;
      if (area === canvas) canvas.style.pointerEvents = landed ? 'auto' : 'none';
      ray.setFromCamera(ndc, cam);
      const hit = landed ? ray.intersectObjects(keys.flatMap(k => k.children))[0] : null;
      hovered = hit ? hit.object.userData.key : null;
      area.style.cursor = hovered ? 'pointer' : '';
      keys.forEach((k, i) => {
        const d = clamp01(drop * 1.6 - i * (.6 / keys.length));
        const u = k.userData;
        u.lift += ((hovered === k ? .22 : 0) - u.lift) * .1;
        k.position.y = (1 - land(d)) * (rise ? -1.2 : 9) + u.lift - u.press * .32 + (landed ? Math.sin(now * 1.4 + i) * .02 : 0);
        k.rotation.z = rise ? 0 : (1 - d) * (i % 2 ? .6 : -.5);
        k.rotation.x = rise ? 0 : (1 - d) * .4;
        k.visible = d > 0;
      });
      board.rotation.y += ((mx * spin) - board.rotation.y) * .035;
      board.rotation.x += ((-my * spin / 2) - board.rotation.x) * .035;
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
    const hero = keyboard($('#keys-gl'), KEYS, { rows: [5, KEYS.length - 5], progress: () => clamp01((heroP() - .03) / .36), onPress: k => openProject(k.to, KEYS.map(k => byId(k.to)).filter(Boolean)) });
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
    ], { fill: .74, look: [0, .2, 0], spin: .06, tilt: .995, rise: true, onPress: k => prismaMode(k.g) });

    baseScene($('#base-gl'));
    knightScene($('#knight-gl'));
    chessFloat($('#chess-gl'));
    macScene($('#mac-gl'), () => { const f = fractions.get($('#outro')); return f ? f.st.progress * f.tl.duration() : 0; }, $('#outro .outro-page'));
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
        const d = clamp01((t - i * .16) / 1.1);
        k.position.copy(k.userData.home); k.position.y += (1 - land(d)) * 10;
        k.rotation.y = (1 - d) * (i % 2 ? 1 : -1);
        k.visible = d > 0;
      });
      const dk = clamp01((t - 2.1) / 1.3);
      king.position.set(0, KEY_H + .08 + (1 - land(dk)) * 12, 0);
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
    let k = -1, x = 0, y = 0, spin = 0;
    const spot = [{ x: 0, y: .9, s: 28, ry: -Math.PI / 2 }, { x: 1.7, y: .05, s: 46, ry: -1.2 }, { x: 0, y: .1, s: 40, ry: 0 }]; // 1: high in the poster, above its title
    sizer(canvas, renderer, cam, () => {
      cam.position.set(0, 1.6, 9); cam.lookAt(0, 1.6, 0);
      // 2: keep the wireframe inside the page card on narrow canvases
      const halfW = 9 * Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * cam.aspect;
      spot[1].x = Math.min(1.7, halfW * .45); spot[1].s = 46 * Math.min(1, halfW / 3.4);
      if (k === 1) knight.scale.setScalar(spot[1].s);
    });
    const vis = onScreen(canvas);
    gsap.ticker.add(() => {
      if (!vis.on) return;
      const step = window.site.imgStep ?? 0;
      if (step !== k) {
        const s = knight.scale.x;
        k = step; knight.material = mats[k];
        gsap.fromTo(knight.scale, { x: s * .85, y: s * .85, z: s * .85 }, { x: spot[k].s, y: spot[k].s, z: spot[k].s, duration: 1.1, ease: 'power3.out' });
      }
      x += (spot[k].x - x) * .05; y += (spot[k].y - y) * .05;
      spin = k === 0 ? 0 : spin + (k === 2 ? .012 : .006);
      knight.position.set(x, y, 0);
      knight.rotation.y = spot[k].ry + spin;
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
  }

  // "Grazie": chess pieces drift and bounce like brandappart's keychains; the pointer pushes them.
  // Finale: the real MacBook model (model/macbook.glb), tilted and swaying on black. The screen shows the closing page;
  // at the end the lid closes. `time` is the outro timeline's playhead, so the lid follows the scroll.
  const LID_CLOSE = [2.65, 3.35], SHRINK = [.3, .95]; // timeline seconds: the camera pulls back from inside the screen; the lid closes
  function macScene(canvas, time, page) {
    if (!canvas || !T.GLTFLoader) { canvas?.remove(); return; }
    const renderer = makeRenderer(canvas, false);
    if (!renderer) { canvas.remove(); return; }
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 100);
    studio(scene, { shadow: false });
    // A soft grey room with two light panels, for the metal to reflect: without it the dark aluminium vanishes on black.
    const room = new T.Scene(), lightPanel = (x, y, z, w, h) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: 0xffffff })); m.position.set(x, y, z); m.lookAt(0, 0, 0); room.add(m); };
    room.add(new T.Mesh(new T.BoxGeometry(20, 20, 20), new T.MeshBasicMaterial({ color: 0x3a3a3c, side: T.BackSide })));
    lightPanel(-6, 6, 6, 6, 3); lightPanel(7, 3, -4, 4, 6);
    scene.environment = new T.PMREMGenerator(renderer).fromScene(room, .04).texture;
    const mac = new T.Group(); scene.add(mac);
    let lid = null, lid0 = 0, shut = 1.5, display = null, tex = null;
    // The screen shows the page live, redrawn every frame (chess canvas + title). The camera starts square on the screen,
    // with the glass exactly as wide as the window, where the drawing matches the page pixel for pixel: the page hands over there.
    const live = document.createElement('canvas'), lctx = live.getContext('2d'), chess = page && $('#chess-gl', page);
    let words = null;
    const STRETCH = [[62.5, 'extra-condensed'], [75, 'condensed'], [87.5, 'semi-condensed'], [100, 'normal'], [112.5, 'semi-expanded'], [125, 'expanded'], [150, 'extra-expanded']];
    const layout = () => { // the title's text, in page px, read from the DOM whatever the page's current transform
      const pr = page.getBoundingClientRect(), sx = pr.width / page.offsetWidth, sy = pr.height / page.offsetHeight, range = document.createRange(), out = [];
      const walk = document.createTreeWalker($('.end-title', page), NodeFilter.SHOW_TEXT);
      for (let n; (n = walk.nextNode());) {
        if (!n.data.trim()) continue;
        range.selectNodeContents(n);
        const r = range.getBoundingClientRect(), cs = getComputedStyle(n.parentElement);
        // cs.font comes back empty, and a canvas only takes keyword stretches: rebuild it, nearest keyword
        const st = parseFloat(cs.fontStretch) || 100, stretch = STRETCH.reduce((a, b) => Math.abs(b[0] - st) < Math.abs(a[0] - st) ? b : a)[1];
        out.push({ text: n.data, x: (r.left - pr.left) / sx, y: (r.top - pr.top) / sy, font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, stretch, spacing: cs.letterSpacing, color: cs.color });
      }
      return out;
    };
    let glassW = 1, aspect = 1.5;
    const drawLive = () => {
      const W = page.offsetWidth, H = page.offsetHeight, k = Math.min(devicePixelRatio, 1.5);
      glassW = Math.max(W, H * aspect); // the glass covers the window: the page sits in its middle
      const gh = glassW / aspect;
      if (live.width !== Math.round(glassW * k) || live.height !== Math.round(gh * k)) { live.width = Math.round(glassW * k); live.height = Math.round(gh * k); words = null; }
      words ||= layout();
      lctx.setTransform(k, 0, 0, k, 0, 0);
      lctx.fillStyle = getComputedStyle(page).backgroundColor; lctx.fillRect(0, 0, glassW, gh);
      lctx.translate((glassW - W) / 2, (gh - H) / 2);
      if (chess) lctx.drawImage(chess, 0, 0, W, H); // drawn this same frame by chessFloat's ticker, so its buffer is still there
      lctx.textBaseline = 'alphabetic';
      words.forEach(w => {
        lctx.font = w.font; lctx.fontStretch = w.stretch; lctx.letterSpacing = w.spacing; lctx.fillStyle = w.color;
        lctx.fillText(w.text, w.x, w.y + lctx.measureText(w.text).fontBoundingBoxAscent);
      });
      tex.needsUpdate = true;
    };
    addEventListener('resize', () => { words = null; });
    // The angle that lays the screen flat on the base, found on the model itself: turn the lid until the screen faces straight down.
    const shutAngle = () => {
      const n = new T.Vector3(), q = new T.Quaternion(), down = new T.Vector3(0, -1, 0);
      const front = () => { lid.updateMatrixWorld(true); return n.set(0, 0, 1).applyQuaternion(display.getWorldQuaternion(q)); };
      const f = Math.sign(front().z) || 1; // the side that faces the viewer when open
      let best = 0, err = Infinity;
      for (let a = -2.4; a <= 2.4; a += .001) { lid.rotation.z = lid0 + a; const e = front().multiplyScalar(f).angleTo(down); if (e < err) { err = e; best = a; } }
      lid.rotation.z = lid0;
      return best;
    };
    // 16 MB: fetch it only when the finale gets close.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      new T.GLTFLoader().load('model/macbook.glb', ({ scene: m }) => {
        const box = new T.Box3().setFromObject(m), k = 6 / box.getSize(new T.Vector3()).x;
        m.scale.setScalar(k); m.position.copy(box.getCenter(new T.Vector3())).multiplyScalar(-k);
        tex = new T.CanvasTexture(live); tex.colorSpace = T.SRGBColorSpace; tex.flipY = false;
        tex.repeat.set(1.6043, 1.9048); tex.offset.set(-.3036, -.3982); // the display's UVs cover u .189–.813, v .209–.734: stretch the drawing over exactly that
        m.traverse(o => {
          if (/^Rotate/.test(o.name)) lid = o;
          if (o.isMesh && o.material.name === 'Display.002') { o.material = new T.MeshBasicMaterial({ map: tex, toneMapped: false }); display = o; }
          if (o.isMesh && /Metalic/.test(o.material.name)) { o.material.color.set(0x9A9DA3); o.material.metalness = .85; o.material.roughness = .32; } // space grey shell
        });
        // The logo floats 3 cm behind the lid in the model, so in perspective it looks off centre: lay it on the lid's back.
        const logo = m.getObjectByName('Apple-Logo-Iconic-Tech-Brand-Symbol-PNG-Transparent-Representa');
        if (logo?.isMesh && display) {
          const back = new T.Box3(), b = new T.Box3();
          display.parent.children.forEach(o => { if (o.isMesh && o !== logo) { o.geometry.computeBoundingBox(); back.union(o.geometry.boundingBox); } });
          logo.updateMatrix(); logo.geometry.computeBoundingBox();
          b.copy(logo.geometry.boundingBox).applyMatrix4(logo.matrix);
          logo.position.z += back.min.z - .0004 - b.max.z;
        }
        // A sticker on the lid, seen once it shuts.
        if (display) {
          const back = new T.Box3();
          display.parent.children.forEach(o => { if (o.isMesh && /Display|Bezel|Metalic/.test(o.material.name || '')) { o.geometry.computeBoundingBox(); back.union(o.geometry.boundingBox); } });
          const map = new T.TextureLoader().load('media/outro/sticker.png'); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8;
          const w = .11, sticker = new T.Mesh(new T.PlaneGeometry(w, w * 773 / 1070),
            new T.MeshStandardMaterial({ map, transparent: true, alphaTest: .5, roughness: .55, polygonOffset: true, polygonOffsetFactor: -2 }));
          sticker.rotation.set(0, Math.PI, Math.PI + .3); // the lid's back faces -z; upright when the lid is shut
          sticker.position.set(.075, .135, back.min.z - .0008);
          display.parent.add(sticker);
        }
        mac.rotation.set(0, 0, 0);
        mac.add(m);
        if (lid && display) { lid0 = lid.rotation.z; shut = shutAngle(); }
        if (display) { const g = display.geometry; g.computeBoundingBox(); const z = g.boundingBox.getSize(new T.Vector3()); aspect = z.x / z.y; }
      });
    }, { rootMargin: '300% 0px' });
    io.observe(canvas);
    // The end pose; the camera starts close on the screen (the page *is* the screen) and pulls back to it.
    const endPos = new T.Vector3(), endLook = new T.Vector3(0, .3, 0), sc = new T.Vector3(), sn = new T.Vector3(), look = new T.Vector3();
    sizer(canvas, renderer, cam, () => { frame(cam, 6.4, 5.6, .58, endLook.toArray(), .3); endPos.copy(cam.position); });
    const vis = onScreen(canvas), box = new T.Box3(), v = new T.Vector3();
    // Where the screen sits on the page, in px.
    const screenRect = () => {
      // The screen's own (flat) box, not the world one: a tilted screen's world box has corners off the glass.
      box.copy(display.geometry.boundingBox);
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < 8; i++) {
        v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(display.matrixWorld).project(cam);
        const x = (v.x + 1) / 2 * canvas.clientWidth, y = (1 - v.y) / 2 * canvas.clientHeight;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    };
    let mx = 0, smx = 0;
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth * 2 - 1; });
    gsap.ticker.add(() => {
      if (!vis.on) return;
      const t = performance.now() / 1000, at = time(), ease = (x) => x * x * (3 - 2 * x);
      const q = ease(clamp01((at - SHRINK[0]) / (SHRINK[1] - SHRINK[0])));
      const sway = ease(clamp01((at - SHRINK[1] - .1) / .6)), close = ease(clamp01((at - LID_CLOSE[0]) / (LID_CLOSE[1] - LID_CLOSE[0])));
      smx += (mx - smx) * .05;
      // Straight on to the camera while it pulls back from the screen, then it starts to sway; closing, it tips towards us and sinks.
      mac.rotation.y = sway * (-.3 + Math.sin(t * .45) * .14 * (1 - close) + smx * .15);
      mac.rotation.x = close * .25 + sway * Math.sin(t * .32) * .04;
      mac.position.y = sway * Math.sin(t * .7) * .07 - close * .6;
      if (lid) lid.rotation.z = lid0 + shut * close;
      mac.updateMatrixWorld(true);
      const W = canvas.clientWidth;
      if (tex && page && close < 1) drawLive();
      cam.position.copy(endPos); cam.lookAt(endLook);
      if (display && q < 1) {
        // Start: square in front of the screen, at the distance where the glass is glassW px wide.
        box.setFromObject(display).getCenter(sc);
        sn.set(0, 0, 1).applyQuaternion(display.getWorldQuaternion(new T.Quaternion()));
        if (sn.z < 0) sn.negate();
        cam.position.copy(sc).addScaledVector(sn, 4); cam.lookAt(sc); cam.updateMatrixWorld();
        const d0 = 4 * screenRect().w / glassW;
        cam.position.copy(sc).addScaledVector(sn, d0).lerp(endPos, q);
        cam.lookAt(look.copy(sc).lerp(endLook, q));
      }
      cam.updateMatrixWorld();
      if (page) page.style.opacity = display && at > SHRINK[0] ? 0 : 1; // opacity, not visibility: the chess canvas must keep drawing
      renderer.render(scene, cam);
    });
    canvas.dataset.ready = '1';
  }

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
  // A reload comes back to the stop you were on (this tab only); without storage it starts from the top.
  const RESUME = 'workshop-stop';
  const nearestStop = () => { const s = window.site.stops || []; let k = 0; s.forEach((y, i) => { if (Math.abs(y - scrollY) < Math.abs(s[k] - scrollY)) k = i; }); return k; };
  addEventListener('pagehide', () => { try { sessionStorage.setItem(RESUME, nearestStop()); } catch (e) {} });
  const resumeStop = () => { try { const k = sessionStorage.getItem(RESUME); return k === null ? null : +k; } catch (e) { return null; } };
  $('.tiny-logo').append($('.brand .logo').cloneNode(true));
  renderContent();
  $$('.split, #domanda .beat').forEach(el => wrapWords(el, true));
  $$('.scrub-words').forEach(el => wrapWords(el, false));
  copyButtons();
  kitTabs();
  wireOpen();
  if (motion) setupMotion();
  const ready = () => {
    if (motion) ScrollTrigger.refresh(); else { buildStops(); onScroll(); }
    const target = location.hash && document.getElementById(location.hash.slice(1));
    lenis?.resize(); // Lenis caches the page height; pins just made it much taller
    const k = resumeStop(), s = window.site.stops || [];
    if (target) scrollToY(firstStop(target), { immediate: true });
    else if (k > 0 && k < s.length) scrollToY(s[k], { immediate: true });
    scenes();
    sphere();
    prisma();
    window.site.ready = true;
  };
  if (!motion) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { buildStops(); onScroll(); }); }
  document.fonts ? document.fonts.ready.then(ready) : addEventListener('load', ready);
});
