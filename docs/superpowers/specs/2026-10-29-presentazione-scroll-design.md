# Presentazione a scroll — "Design × AI" — Documento di design

Data: 2026-10-29 · Autore: Leonardo (con Claude)

## 1. Intento e perché

Leonardo è un designer in un web studio / agenzia di prodotti digitali. Ogni giorno lavora con Claude Code e un set di ~60 skill e plugin per costruirsi da solo gli strumenti che gli mancano: plugin Figma, app macOS (es. ponte Photoshop↔Figma, app di conversione), piattaforme condivise con amici, tool per il proprio workflow.

Vuole raccontarlo ai colleghi in un **workshop interno sulla sua metodologia d'uso dell'AI nel design**, che sconfina nel coding. Il messaggio: *un designer che smette di aspettare gli strumenti giusti e se li costruisce*. Non "l'AI fa i siti".

Il mezzo è una **pagina web a scroll, a sezioni**, al posto delle slide: deve dimostrare ciò che racconta (motion, 3D, interazioni) invece di descriverlo.

## 2. Pubblico e uso

- Colleghi del web studio: soprattutto designer, alcuni sviluppatori. Parte in sala, parte in call.
- **Uso 1 — live (~20 minuti):** Leonardo scorre e racconta, in condivisione schermo. Aperta in locale dal Mac (nessuna dipendenza dalla rete della sala per il funzionamento base).
- **Uso 2 — link dopo il talk:** chi la apre da solo deve capire tutto senza la voce di Leonardo. Il testo regge da solo.
- Lingua: italiano. (Termini tecnici e nomi delle skill restano in inglese.)
- **Testo unico e breve** (deciso da Leonardo): un solo livello di testo, corto abbastanza da non competere con lui in sala e chiaro abbastanza da reggersi da solo nel link. Niente modalità presenter/lettore. Le descrizioni lunghe (es. dettagli delle skill) stanno dietro hover/click, non sempre visibili.

## 3. Obiettivi

1. Mostrare **le skill**: cosa sono, a cosa servono, quando Leonardo le usa — per famiglie.
2. Mostrare **il metodo** (superpowers: capire → progettare → pianificare → costruire → verificare).
3. Mostrare **casi studio** di problemi risolti con strumenti fatti su misura.
4. Essere **immersiva e dinamica**: motion legata allo scroll, 3D (Three.js), tante micro-interazioni e hover curati.
5. Essere **ri-stilizzabile**: base minimale che può "cambiare pelle" (vedi §5.3).

## 4. Non-obiettivi e anti-obiettivi

Non-obiettivi (per questa prima stesura):
- Progetti reali: si usano **casi studio inventati ma credibili**; i reali si inseriscono dopo la prima stesura.
- "Uniformare alcune cose" (citato da Leonardo): rimandato a dopo la prima stesura.
- Backend, CMS, analytics, login.

Anti-obiettivi (fallimento anche se "funziona"):
- **Sembrare un tema**: niente stile forte che "ti etichetta" (dark-tech, editoriale caldo, brutalista, pastello giocoso sono stati scartati come base). La base è neutra.
- Sembrare un sito AI generico (eyebrow-pill sopra il titolo, glow colorati, serif corsivo hero, font abusati tipo Inter/Geist/Space Grotesk).
- Motion che scatta o sfarfalla in condivisione schermo; effetti che rendono il testo illeggibile.
- Un elenco piatto di 60 skill senza spiegare perché e quando.

## 5. Direzione visiva (decisa)

### 5.1 Base
- **Minimale, luminosa, con la calma di una documentazione**: sfondo bianco caldo, inchiostro quasi nero, **un solo colore d'accento**, molto spazio, linee sottili.
- **Indice laterale fisso** in stile docs con numero di sezione, che evidenzia la sezione corrente. Su mobile diventa una barra compatta o un indicatore di progresso.
- Tipografia: un grotesk sobrio per testo/titoli + eventuale mono per dettagli/numeri. **Font scelto dal builder**, evitando i font abusati (sopra).

### 5.2 Immersività
- Motion legata allo scroll: reveal, sezioni pinnate, scroll orizzontale pinnato dove indicato, scrub.
- 3D con Three.js dove spiega qualcosa (minimo: costellazione skill in apertura; img2threejs in §6.06).
- Micro-interazioni e hover su ogni elemento interattivo.
- `prefers-reduced-motion` rispettato (contenuto sempre leggibile senza animazioni).

### 5.3 Idea portante: "le skill come lenti"
La base è neutra; le skill di stile la **trasformano dal vivo** con transizione animata. Approvato su mockup: lo stesso componente cambia pelle cliccando brutalist-skill / soft-skill / minimalist-editoriale. Nella versione finale l'idea si estende (scelta del builder fin dove: almeno la sezione 05; idealmente un selettore di "lente" che può ri-stilizzare anche altre parti della pagina).

Riferimento mockup approvato: `.superpowers/brainstorm/19677-1793264469/content/base-minimale.html`.

### 5.4 Comandi live
- **Navigazione passo per passo** (deciso da Leonardo): frecce / PagSu-PagGiù / spazio avanzano di **un passo**, come le build delle slide. Nelle sezioni a più fasi (02 pila di workaround, 03 percorso del metodo, 06 immagine→codice→3D, 07 i 5 casi, 08 timeline) ogni tasto mostra la fase successiva; nelle altre il passo è la sezione intera. Leonardo non deve mai toccare il trackpad durante il talk.
- Serve quindi un **modello centrale delle fermate** (sezione + passo) che porta lo scroll a posizioni esatte delle timeline ScrollTrigger.
- Lo scroll normale (trackpad) resta libero e non bloccato; il prossimo tasto riparte dalla fermata più vicina alla posizione corrente.
- Un indicatore discreto di posizione (es. "07 · 3/5") aiuta Leonardo durante il live (scelta del builder come mostrarlo).

## 6. Struttura (10 sezioni, ~20 min) — approvata

| # | Sezione | Contenuto e interazione | ~min |
|---|---|---|---|
| 01 | Apertura — "Ho smesso di aspettare gli strumenti giusti." | Titolo + sottotitolo; costellazione 3D di ~60 punti (le skill) che reagisce al mouse e allo scroll | 1 |
| 02 | Il prima — problemi senza soluzione | Pila di workaround (export a mano, screenshot, tool a pagamento, "chiedo a uno sviluppatore") che si sgretola/ricompone allo scroll | 2 |
| 03 | Il metodo | Percorso superpowers che si disegna: brainstorming → spec → piano → build (subagenti/TDD) → verifica/code-review. Più "stile di lavoro": ponytail (codice minimo), caveman (risposte brevi), output-skill (niente output troncati) | 3 |
| 04 | L'inventario | Catalogo di tutte le skill/plugin per famiglia, filtrabile; hover/click mostra cosa fa e "quando la uso". Collegato visivamente alla costellazione 01 | 3 |
| 05 | Le skill come lenti | Demo §5.3 | 2 |
| 06 | Dall'immagine al codice e al 3D | Flusso: imagegen-frontend-web/mobile genera il mockup → image-to-code lo implementa → img2threejs costruisce un oggetto 3D. Mostrato come sequenza animata | 2 |
| 07 | Casi studio | Scroll orizzontale pinnato, 5 casi (§7) | 4 |
| 08 | Anatomia di un progetto | Un caso (consigliato: Layerlink) dall'inizio alla fine: prima richiesta → domande → spec → piano → app funzionante, come timeline | 2 |
| 09 | Come iniziare domani | 3 skill per designer + 3 per sviluppatori, con perché | 1 |
| 10 | Chiusura | Messaggio finale, QR + link alla pagina | — |

## 7. Casi studio inventati (placeholder, da sostituire)

1. **Tokenizer** — plugin Figma: esporta variabili Figma in token CSS e Swift.
2. **Layerlink** — app macOS: porta i livelli Photoshop in Figma mantenendo struttura e nomi.
3. **Squeeze** — app macOS: conversione batch di immagini e video per il web (AVIF, WebP, MP4).
4. **Handoff Check** — plugin Figma: controlla un file prima della consegna agli sviluppatori (naming, stili scollegati, contrasto).
5. **Tavolo** — piattaforma condivisa con amici per organizzare cene e viaggi.

Per ognuno: problema → skill usate → risultato, con una visual (mockup UI costruita in HTML/CSS o SVG, nessuna foto reale richiesta). Devono essere **facili da sostituire**: contenuti dei casi raccolti in un unico punto (es. un array di dati in cima allo script).

## 8. Inventario skill da mostrare (tutte)

Famiglie e membri (fonte: `~/.claude/skills`, plugin installati, skill di sessione):

- **Metodo** — superpowers (brainstorming, writing-plans, executing-plans, subagent-driven-development, dispatching-parallel-agents, test-driven-development, systematic-debugging, requesting/receiving-code-review, verification-before-completion, using-git-worktrees, finishing-a-development-branch, writing-skills), code-review, simplify, security-review.
- **Stile di lavoro** — ponytail (+ review, audit, debt), caveman (+ commit, review, compress), output-skill.
- **Gusto e design** — taste-skill v2 (design-taste-frontend), taste-skill-v1, gpt-taste, soft-skill, minimalist-skill, brutalist-skill, stitch-skill, redesign-skill, impeccable.
- **Dall'immagine al codice** — imagegen-frontend-web, imagegen-frontend-mobile, image-to-code, brandkit.
- **3D** — img2threejs, threejs-fundamentals, -geometry, -materials, -lighting, -textures, -shaders, -animation, -interaction, -loaders, -postprocessing.
- **Framer** — framer, framer-code-components, Framer MCP.
- **Conoscenza e strumenti** — graphify, inventario, skill-auditor, claude-code-setup, dataviz, artifact-design.
- **Compliance** — compliance (custom di Leonardo), gdprgard-compliance, privacy-legal, compliance-es.
- **Documenti** — pdf, docx, pptx, xlsx, docs.

Ogni skill: nome, una riga "cosa fa", una riga "quando la uso" (scritta dal builder in modo credibile; Leonardo rivedrà). Dati in un unico array, facile da modificare.

## 9. Vincoli tecnici

- **Pagina statica**: HTML + CSS + JS, nessun build step necessario per aprirla in locale (doppio clic o server statico).
- Librerie da CDN con versione esatta (es. GSAP + ScrollTrigger, Three.js); per il funzionamento in locale offline è accettabile che 3D/fonti dipendano dalla rete, ma la pagina deve restare leggibile se il CDN non carica. *(Scelta del builder se includere copie locali delle librerie.)*
- **Pubblicazione**: come Artifact su claude.ai (privato, condivisibile, stesso URL ad ogni aggiornamento). **Chi deve aprire il link non è ancora deciso**: la pagina deve quindi essere **portabile** — funzionare identica come Artifact e su un qualsiasi host statico (Vercel/Netlify/GitHub Pages) senza modifiche: solo percorsi relativi, nessuna dipendenza dal runtime Artifact. Rispetta comunque i vincoli Artifact: script solo da cdnjs / jsdelivr / unpkg con versione esatta, font da Google Fonts, il resto inline o come file del progetto; ≤16 MB. L'URL del QR in sezione 10 è una costante facile da cambiare, decisa dopo.
- Responsive fino a mobile (il link verrà aperto anche da telefono); nessuno scroll orizzontale indesiderato.
- Prestazioni: fluida su un MacBook in condivisione schermo; 3D con pixel ratio limitato e pausa quando fuori viewport.
- Accessibilità di base: contrasto, focus visibile, reduced-motion, testo reale (non in canvas).
- File nella cartella `~/Desktop/Workshop - Design Ai/`.

## 10. Tempi e priorità

Il workshop è **entro una settimana** (deciso da Leonardo). Lavoro a fasi; la fase 1 deve essere completa e solida prima di toccare la fase 2.

**Fase 1 — indispensabile per il live**
- Base visiva (§5.1), indice laterale, reveal e motion fluida in condivisione schermo.
- Navigazione passo per passo (§5.4) affidabile.
- Tutte le 10 sezioni presenti con contenuto e animazione di base.
- Sezioni curate al massimo: **01** (costellazione 3D), **05** (lenti), **07** (casi studio pinnati).
- Inventario (04) completo e filtrabile.
- reduced-motion e leggibilità senza CDN.

**Fase 2 — se c'è tempo**
- Lente globale che ri-stilizza anche altre parti della pagina.
- Oggetto 3D img2threejs nella sezione 06 (in fase 1 la sezione usa una sequenza animata in 2D).
- Rifinitura mobile oltre il "funziona e si legge".

## 11. Lasciato al builder

- Font, colore d'accento preciso, scala tipografica.
- Coreografia esatta delle animazioni di ogni sezione, nel rispetto di §5.
- Struttura dei file (consigliato: pochi file — `index.html`, `styles.css`, `main.js`, `data.js`).
- Testi definitivi (italiano, tono diretto, in prima persona di Leonardo).
- Quali skill usare per costruirla (consigliate: taste-skill v2 / impeccable per direzione e controllo qualità, threejs-* per il 3D, gpt-taste per GSAP ScrollTrigger).
