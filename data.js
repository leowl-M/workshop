// Contenuti della presentazione. Per sostituire skill, casi studio o link, si modifica solo questo file.

window.SHARE_URL = 'https://claude.ai/artifact/8kAega2RsnSgdo4PPaGEdH';

window.FAMILIES = [
  { id: 'metodo',     label: 'Metodo',              blurb: 'Come lavoriamo: prima capire, poi pianificare, poi costruire e verificare.' },
  { id: 'stile',      label: 'Stile di lavoro',     blurb: 'Codice minimo, risposte brevi, niente output tagliati.' },
  { id: 'gusto',      label: 'Gusto e design',      blurb: 'Direzione visiva che non sembra fatta da un\'AI.' },
  { id: 'immagine',   label: 'Immagine → codice',   blurb: 'Prima genero il mockup, poi lo traduco in codice.' },
  { id: '3d',         label: '3D',                  blurb: 'Scene, modelli e shader nel browser con Three.js.' },
  { id: 'framer',     label: 'Framer',              blurb: 'Costruire e pubblicare siti su Framer senza aprirlo.' },
  { id: 'strumenti',  label: 'Conoscenza e strumenti', blurb: 'Mappare progetti, controllare skill, fare grafici.' },
  { id: 'compliance', label: 'Compliance',          blurb: 'GDPR, cookie, DPA: i controlli che nessuno ha voglia di fare.' },
  { id: 'documenti',  label: 'Documenti',           blurb: 'PDF, Word, PowerPoint, Excel quando servono davvero.' },
];

window.SKILLS = [
  // Metodo
  { family: 'metodo', name: 'superpowers:brainstorming', what: 'Mi fa domande una alla volta finché l\'idea è chiara.', when: 'All\'inizio di ogni progetto, prima di scrivere una riga di codice.' },
  { family: 'metodo', name: 'superpowers:writing-plans', what: 'Trasforma il documento di design in un piano a task piccoli.', when: 'Appena approvo la spec: il piano è il contratto per costruire.' },
  { family: 'metodo', name: 'superpowers:executing-plans', what: 'Esegue il piano task per task, con un registro dei progressi.', when: 'Quando voglio andare veloce e lavorare in una sola sessione.' },
  { family: 'metodo', name: 'superpowers:subagent-driven-development', what: 'Un agente nuovo per ogni task e un revisore che lo controlla.', when: 'Sui progetti lunghi, quando un errore costerebbe caro.' },
  { family: 'metodo', name: 'superpowers:dispatching-parallel-agents', what: 'Divide il lavoro indipendente tra più agenti in parallelo.', when: 'Quando devo esplorare tre strade diverse nello stesso momento.' },
  { family: 'metodo', name: 'superpowers:test-driven-development', what: 'Prima il test che fallisce, poi il codice che lo fa passare.', when: 'Su ogni logica vera: convertitori, export, calcoli.' },
  { family: 'metodo', name: 'superpowers:systematic-debugging', what: 'Cerca la causa del bug prima di proporre una correzione.', when: 'Quando qualcosa si rompe e la prima idea non ha funzionato.' },
  { family: 'metodo', name: 'superpowers:requesting-code-review', what: 'Chiede una revisione indipendente del lavoro finito.', when: 'Prima di considerare chiusa una funzione importante.' },
  { family: 'metodo', name: 'superpowers:receiving-code-review', what: 'Valuta i commenti di revisione con rigore, senza accettarli a occhi chiusi.', when: 'Quando arrivano commenti da un revisore o da un collega.' },
  { family: 'metodo', name: 'superpowers:verification-before-completion', what: 'Niente "fatto" senza aver eseguito i controlli e letto l\'output.', when: 'Sempre, prima di dire che qualcosa funziona.' },
  { family: 'metodo', name: 'superpowers:using-git-worktrees', what: 'Lavora in una copia isolata del progetto.', when: 'Quando provo una modifica grossa senza toccare la versione buona.' },
  { family: 'metodo', name: 'superpowers:finishing-a-development-branch', what: 'Chiude il lavoro: merge, pull request o pulizia.', when: 'Alla fine di una funzione, quando tutti i test passano.' },
  { family: 'metodo', name: 'superpowers:writing-skills', what: 'Mi aiuta a scrivere e testare skill nuove.', when: 'Quando un mio processo si ripete e voglio insegnarlo a Claude.' },
  { family: 'metodo', name: 'code-review', what: 'Revisione delle modifiche alla ricerca di bug veri.', when: 'Prima di consegnare un plugin o un\'app a qualcun altro.' },
  { family: 'metodo', name: 'simplify', what: 'Rilegge il codice cambiato e lo semplifica.', when: 'Dopo che una funzione va, per renderla più pulita.' },
  { family: 'metodo', name: 'security-review', what: 'Controllo di sicurezza delle modifiche in corso.', when: 'Quando un tool tocca file, credenziali o dati di altri.' },

  // Stile di lavoro
  { family: 'stile', name: 'ponytail', what: 'La soluzione più semplice che funziona, niente sovra-ingegneria.', when: 'Sempre attiva: meno codice da capire quando lo riapro tra sei mesi.' },
  { family: 'stile', name: 'ponytail-review', what: 'Revisione che cerca solo cosa si può togliere.', when: 'Quando un tool è cresciuto troppo e non so più dove mettere le mani.' },
  { family: 'stile', name: 'ponytail-audit', what: 'Scansiona tutto il progetto alla ricerca di complessità inutile.', when: 'Prima di riprendere un progetto vecchio.' },
  { family: 'stile', name: 'ponytail-debt', what: 'Raccoglie le scorciatoie lasciate apposta in un registro.', when: 'Quando voglio sapere cosa avevo rimandato a "dopo".' },
  { family: 'stile', name: 'caveman', what: 'Risposte telegrafiche: stesso contenuto tecnico, molte meno parole.', when: 'Sempre attiva: leggo meno e capisco prima.' },
  { family: 'stile', name: 'caveman-commit', what: 'Messaggi di commit brevi e precisi.', when: 'A ogni salvataggio su git.' },
  { family: 'stile', name: 'caveman-review', what: 'Commenti di revisione da una riga: dove, problema, correzione.', when: 'Quando rivedo il lavoro di un collega.' },
  { family: 'stile', name: 'caveman-compress', what: 'Comprime i file di memoria per risparmiare contesto.', when: 'Quando le mie istruzioni per Claude diventano lunghe.' },
  { family: 'stile', name: 'output-skill', what: 'Vieta codice troncato e segnaposto tipo "il resto qui".', when: 'Sui file lunghi, quando mi serve tutto il codice e non un riassunto.' },

  // Gusto e design
  { family: 'gusto', name: 'design-taste-frontend', what: 'Direzione artistica da 247 siti premiati, con controllo nel browser.', when: 'Ogni volta che una pagina deve sembrare progettata, non generata.' },
  { family: 'gusto', name: 'taste-skill-v1', what: 'La prima versione di taste-skill, conservata così com\'era.', when: 'Sui progetti vecchi costruiti con quelle regole.' },
  { family: 'gusto', name: 'gpt-taste', what: 'Motion GSAP rigorosa: pin, scrub, griglie senza buchi.', when: 'Quando una landing deve muoversi allo scroll come un sito da premio.' },
  { family: 'gusto', name: 'soft-skill', what: 'Ombre, spaziature e card da agenzia di alto livello.', when: 'Per interfacce morbide e "costose" da presentare a un cliente.' },
  { family: 'gusto', name: 'minimalist-skill', what: 'Editoriale, monocromo caldo, contrasto tipografico.', when: 'Per portfolio, documentazione e pagine dove parla il contenuto.' },
  { family: 'gusto', name: 'brutalist-skill', what: 'Griglie svizzere e look da terminale tecnico.', when: 'Per dashboard dense o progetti che devono sembrare un manuale.' },
  { family: 'gusto', name: 'stitch-skill', what: 'Genera un DESIGN.md con regole anti-generiche per Google Stitch.', when: 'Quando voglio fissare un sistema visivo prima di generare schermate.' },
  { family: 'gusto', name: 'redesign-skill', what: 'Analizza un sito esistente e lo porta a qualità premium.', when: 'Sui siti dei clienti che funzionano ma sembrano datati.' },
  { family: 'gusto', name: 'impeccable', what: 'Critica, audit e rifinitura di un\'interfaccia, regola per regola.', when: 'Alla fine di ogni pagina: è il mio controllo qualità visivo.' },

  // Immagine → codice
  { family: 'immagine', name: 'imagegen-frontend-web', what: 'Genera un\'immagine di riferimento per ogni sezione di un sito.', when: 'Prima di scrivere codice, per vedere la pagina e scegliere la direzione.' },
  { family: 'immagine', name: 'imagegen-frontend-mobile', what: 'Schermate di app native in mockup di telefono.', when: 'Quando esploro un\'app prima di aprire Figma.' },
  { family: 'immagine', name: 'image-to-code', what: 'Genera il design, lo analizza e lo implementa fedelmente.', when: 'Quando l\'aspetto conta più di tutto e voglio partire da un\'immagine.' },
  { family: 'immagine', name: 'brandkit', what: 'Tavole di brand identity: logo, palette, mockup.', when: 'All\'inizio di un progetto personale che ha bisogno di un\'identità.' },

  // 3D
  { family: '3d', name: 'img2threejs', what: 'Da un\'immagine a un modello 3D procedurale, costruito in codice.', when: 'Quando mi serve un oggetto 3D su misura senza aprire Blender.' },
  { family: '3d', name: 'threejs-fundamentals', what: 'Scena, camera, renderer e gerarchia degli oggetti.', when: 'Per impostare qualsiasi scena 3D.' },
  { family: '3d', name: 'threejs-geometry', what: 'Forme, geometrie custom e instancing.', when: 'Per costellazioni, particelle e forme generate.' },
  { family: '3d', name: 'threejs-materials', what: 'Materiali PBR, vetro, metallo, shader.', when: 'Quando l\'oggetto deve sembrare fatto di qualcosa.' },
  { family: '3d', name: 'threejs-lighting', what: 'Luci, ombre e illuminazione ambientale.', when: 'Per dare profondità e atmosfera a una scena.' },
  { family: '3d', name: 'threejs-textures', what: 'Texture, UV, mappe d\'ambiente e HDR.', when: 'Quando servono superfici realistiche.' },
  { family: '3d', name: 'threejs-shaders', what: 'Effetti custom in GLSL.', when: 'Per sfondi vivi, distorsioni e transizioni uniche.' },
  { family: '3d', name: 'threejs-animation', what: 'Animazioni, scheletri, morph e mix.', when: 'Quando un modello deve muoversi o reagire.' },
  { family: '3d', name: 'threejs-interaction', what: 'Mouse, touch, raycasting e controlli.', when: 'Quando il 3D deve rispondere al visitatore.' },
  { family: '3d', name: 'threejs-loaders', what: 'Caricamento di modelli GLTF, texture e HDR.', when: 'Quando parto da un modello esistente.' },
  { family: '3d', name: 'threejs-postprocessing', what: 'Bloom, profondità di campo, color grading.', when: 'Per il tocco finale cinematografico.' },

  // Framer
  { family: 'framer', name: 'framer', what: 'Costruisce, modifica e pubblica siti Framer.', when: 'Quando il cliente vuole aggiornare il sito da solo dopo la consegna.' },
  { family: 'framer', name: 'framer-code-components', what: 'Componenti di codice custom dentro Framer.', when: 'Quando a Framer manca un componente e lo scrivo io.' },
  { family: 'framer', name: 'Framer MCP', what: 'Collegamento diretto tra Claude e i miei progetti Framer.', when: 'Per modificare pagine e CMS parlando, senza aprire l\'editor.' },

  // Conoscenza e strumenti
  { family: 'strumenti', name: 'graphify', what: 'Trasforma un progetto in un grafo di conoscenza interrogabile.', when: 'Quando riapro un progetto grande e devo ricordarmi come è fatto.' },
  { family: 'strumenti', name: 'inventario', what: 'Elenca skill e plugin installati e dice quali servono qui.', when: 'All\'inizio di un progetto, per scegliere gli strumenti giusti.' },
  { family: 'strumenti', name: 'skill-auditor', what: 'Controlla una skill esterna prima di installarla.', when: 'Ogni volta che trovo una skill su GitHub e voglio fidarmi.' },
  { family: 'strumenti', name: 'claude-code-setup', what: 'Suggerisce automazioni, hook e plugin per un progetto.', when: 'Quando imposto un progetto nuovo da zero.' },
  { family: 'strumenti', name: 'dataviz', what: 'Grafici coerenti, accessibili, in chiaro e in scuro.', when: 'Quando un tool deve mostrare numeri.' },
  { family: 'strumenti', name: 'artifact-design', what: 'Regole di design per le pagine pubblicate come Artifact.', when: 'Quando pubblico una pagina da condividere con un link.' },

  // Compliance
  { family: 'compliance', name: 'compliance', what: 'La mia skill: audit GDPR e cookie, correzioni e report.', when: 'Prima di mettere online un sito per un cliente.' },
  { family: 'compliance', name: 'gdprgard-compliance', what: 'Cookie, privacy policy, DPIA, data breach.', when: 'Quando un mio tool raccoglie dati di altre persone.' },
  { family: 'compliance', name: 'privacy-legal', what: 'Revisione DPA, valutazioni d\'impatto, richieste di accesso.', when: 'Quando un cliente manda un contratto sui dati da firmare.' },
  { family: 'compliance', name: 'compliance-es', what: 'Audit di conformità per il mercato spagnolo.', when: 'Sui progetti per clienti in Spagna.' },

  // Documenti
  { family: 'documenti', name: 'pdf', what: 'Legge, crea e modifica PDF.', when: 'Per brief, preventivi e documentazione dei clienti.' },
  { family: 'documenti', name: 'docx', what: 'Documenti Word formattati.', when: 'Quando un cliente vuole il file Word e non un link.' },
  { family: 'documenti', name: 'pptx', what: 'Presentazioni PowerPoint.', when: 'Quando la presentazione deve passare per la posta.' },
  { family: 'documenti', name: 'xlsx', what: 'Fogli Excel con formule e grafici.', when: 'Per stime, budget e liste di contenuti.' },
  { family: 'documenti', name: 'docs', what: 'Documenti vivi su claude.ai, modificabili insieme.', when: 'Per spec e note da scrivere a quattro mani con il team.' },
];

window.CASES = [
  {
    id: 'tokenizer', name: 'Tokenizer', kind: 'Plugin Figma',
    problem: 'Le variabili restavano in Figma: ogni modifica la ricopiavo a mano nel codice.',
    skills: ['superpowers:brainstorming', 'superpowers:test-driven-development', 'ponytail'],
    result: 'Un clic esporta le variabili in token CSS e Swift, sempre allineati.',
    visual: `
      <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>Tokenizer</span></div>
        <div class="cv-body">
          <div class="cv-row"><b class="cv-sw" style="background:#3b5bff"></b><span>color/accent</span><code>#3B5BFF</code></div>
          <div class="cv-row"><b class="cv-sw" style="background:#111113"></b><span>color/ink</span><code>#111113</code></div>
          <div class="cv-row"><b class="cv-sw cv-sw-num">16</b><span>space/m</span><code>16px</code></div>
          <div class="cv-row"><b class="cv-sw cv-sw-num">12</b><span>radius/card</span><code>12px</code></div>
          <div class="cv-btn">Esporta CSS · Swift</div>
        </div></div>`,
  },
  {
    id: 'layerlink', name: 'Layerlink', kind: 'App macOS',
    problem: 'I PSD dei clienti arrivavano in Figma come immagini piatte.',
    skills: ['superpowers:brainstorming', 'superpowers:writing-plans', 'superpowers:subagent-driven-development', 'superpowers:systematic-debugging'],
    result: 'I livelli arrivano in Figma con gruppi, nomi e testi modificabili.',
    steps: [
      '«Voglio i livelli dei PSD in Figma, non un\'immagine piatta.»',
      'Claude chiede: quali livelli? Testi modificabili? Smart object?',
      'Una spec di una pagina: cosa fa, cosa non fa, come si verifica.',
      'Un piano in 9 task, ognuno con il suo test.',
      'App per Mac funzionante: trascini il PSD, si apre in Figma.',
    ],
    visual: `
      <div class="cv-split">
        <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>campagna.psd</span></div>
          <div class="cv-body cv-layers"><div>▾ Hero</div><div class="cv-in">T Titolo</div><div class="cv-in">▢ Foto prodotto</div><div>▾ CTA</div><div class="cv-in">T Scopri</div></div></div>
        <div class="cv-arrow">→</div>
        <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>Figma</span></div>
          <div class="cv-body cv-layers"><div>▾ Hero</div><div class="cv-in">T Titolo</div><div class="cv-in">▢ Foto prodotto</div><div>▾ CTA</div><div class="cv-in">T Scopri</div></div></div>
      </div>`,
  },
  {
    id: 'squeeze', name: 'Squeeze', kind: 'App macOS',
    problem: 'Convertire immagini e video per il web voleva dire tre tool diversi e mille preset.',
    skills: ['ponytail', 'superpowers:executing-plans', 'impeccable'],
    result: 'Trascino una cartella: escono AVIF, WebP e MP4 ottimizzati, in un passaggio.',
    visual: `
      <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>Squeeze</span></div>
        <div class="cv-body">
          <div class="cv-drop">Trascina qui una cartella</div>
          <div class="cv-file"><span>hero.png</span><em>AVIF · −82%</em><div class="cv-prog"><b style="width:100%"></b></div></div>
          <div class="cv-file"><span>reel.mov</span><em>MP4 · −64%</em><div class="cv-prog"><b style="width:72%"></b></div></div>
          <div class="cv-file"><span>team.jpg</span><em>WebP · −58%</em><div class="cv-prog"><b style="width:35%"></b></div></div>
        </div></div>`,
  },
  {
    id: 'handoff-check', name: 'Handoff Check', kind: 'Plugin Figma',
    problem: 'Gli sviluppatori trovavano livelli senza nome e stili scollegati solo dopo la consegna.',
    skills: ['superpowers:brainstorming', 'code-review', 'impeccable'],
    result: 'Prima di consegnare, una lista dei problemi con il pulsante per correggerli.',
    visual: `
      <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>Handoff Check</span></div>
        <div class="cv-body">
          <div class="cv-chk cv-warn"><b>!</b><span>12 livelli senza nome</span><u>Correggi</u></div>
          <div class="cv-chk cv-warn"><b>!</b><span>4 colori fuori dagli stili</span><u>Collega</u></div>
          <div class="cv-chk cv-ok"><b>✓</b><span>Contrasto testi AA</span></div>
          <div class="cv-chk cv-ok"><b>✓</b><span>Auto layout sui componenti</span></div>
        </div></div>`,
  },
  {
    id: 'tavolo', name: 'Tavolo', kind: 'Piattaforma web',
    problem: 'Cene e viaggi con gli amici si perdevano tra chat, fogli condivisi e sondaggi.',
    skills: ['design-taste-frontend', 'image-to-code', 'superpowers:subagent-driven-development', 'gdprgard-compliance'],
    result: 'Una piattaforma condivisa: date, quote e decisioni in un posto solo.',
    visual: `
      <div class="cv-win"><div class="cv-bar"><i></i><i></i><i></i><span>tavolo.app</span></div>
        <div class="cv-body">
          <div class="cv-event"><strong>Weekend a Matera</strong><span>6 persone · €142 a testa</span></div>
          <div class="cv-poll"><span>Ven 14</span><div class="cv-prog"><b style="width:83%"></b></div><em>5</em></div>
          <div class="cv-poll"><span>Ven 21</span><div class="cv-prog"><b style="width:33%"></b></div><em>2</em></div>
          <div class="cv-avatars"><i>LM</i><i>GR</i><i>SA</i><i>FB</i><i>+2</i></div>
        </div></div>`,
  },
];

