# Presentazione "Design × AI": sito a scroll immersivo

Data: 2026-10-29 · Autore: Leonardo (con Claude)

## 1. Cosa e perché

Workshop per i colleghi, chiesto dal direttore d'area: designer che usano l'AI per risolvere problemi costruendosi plugin Figma, tool per asset in serie e app. Non per sostituire gli sviluppatori, ma per togliere i processi noiosi e avere più tempo per studiare, sperimentare e creare.

Forma: un **sito a scroll immersivo** sul modello di brandappart.com, usato come presentazione. Il ritmo lo decide chi presenta, scorrendo o con i tasti. **Un concetto per schermata.** La versione a slide fisse (Neo-Grid) è stata superata: troppi concetti per slide.

## 2. Struttura

3D sempre con gli stessi due elementi, **tasti e scacchi** (questi dai modelli di Keycap Reel), usati in modi diversi.

| Sezione | Momento |
|---|---|
| Hero | Nero col titolo; scorrendo cade una tastiera 3D, un tasto per strumento; premuto apre il progetto |
| Manifesto, Prima, Svolta | Frase parola per parola; mazzo di carte che si inclinano; riquadro blu che cresce; due frasi |
| Metodo | 9 passi su un binario, ognuno con l'estratto vero (Keycap Reel); poi **"Nove passi. Una base solida."**: nove tasti, uno per passo, cadono e formano una base 3×3; un re ci atterra sopra |
| Sempre accese, Skill, Lenti | Invariati (tolti i nastri di nomi sotto il 67) |
| Immagine → codice → 3D | Un oggetto solo attraversa i tre passi: il cavallo è una sagoma su una locandina, poi una pagina web con il suo codice (cavallo in wireframe), poi un pezzo 3D lucido che gira; a sinistra passo, spiegazione, esempio, skill |
| Progetti | Titolo + tre tasti 3D (Plugin Figma, App, Web) che portano al gruppo |
| Plugin Figma (5) | Un tasto 3D per plugin; premuto apre il dettaglio (← → fra i plugin, Esc chiude) |
| App (3) | Prisma: demo simulata nella pagina (scrivania, trascinamento, ventaglio di bolle con le voci vere dell'app per un'immagine, file nuovo accanto all'originale); i tasti 3D ⇧ ⌘ ⌃ cambiano ventaglio. Composer; Modifica in Photoshop (spostato dai plugin) |
| Web | Sfera di 21 nomi (dal sito, sezione Training), ognuno con un piccolo cubo 3D che ruota; clic apre il link online |
| Tempo, Partire | Invariati |
| Risorse | Tutto Kit Claude (50 voci in 7 schede, card su 3 colonne, niente scroll interno): cosa fa, come si usa, da dove; comandi `/plugin` da copiare |
| Fine | **"Grazie."** con gli scacchi che fluttuano dietro le parole |

Progetti: Squeeze, Export, Type & Color Swap, Split PDF, Modulink (plugin); Prisma, Composer, Modifica in Photoshop (app); Training (web). **Tea Pavia e Portfolio esclusi.**

## 3. Tecnica

- Lenis (scroll morbido) + GSAP ScrollTrigger (pin con scrub) + Three.js r160 (build classica, funziona da `file://`). Tutto in `vendor/`, font in `fonts/`, immagini in `media/projects/`, texture del 3D incorporate in `media/textures.js`.
- Sfondo che cambia per sezione (`data-theme`: cream, deep, blue, yellow).
- Tastiera: frecce, Spazio e PagSu/PagGiù vanno alla fermata successiva o precedente; Home/End; `F` schermo intero; link diretti `#p-prisma`.
- Un solo indicatore, come brandappart: una linea sottile a destra con un punto che avanza. Cursore di sistema (niente cursore personalizzato).
- Immagini dei progetti: segnaposto numerati IMG-01…IMG-10 (1600 × 1000 px), usati ora nel dettaglio dei plugin e nei capitoli delle app. Basta salvare `media/projects/img-NN.jpg` e la pagina la usa al posto del segnaposto.
- Demo di Prisma: voci dei ventagli prese da `OptionCatalog` (Converters.swift) per un file immagine; raggio dell'arco che cresce con le voci, bolle rimpicciolite se non ci stanno.
- Scacchi: modelli di Keycap Reel ("Chess Set" di Riley Queen, Poly Haven, CC0) incorporati in `media/models.js`.
- Anteprime dei tool: `media/tools/`, catturate da ogni strumento con un'immagine di prova caricata, ritagliate e centrate in 4:3. Demo di Prisma: copia della landing in `media/prisma/` con `?embed` (solo la demo, parte da sola); l'iframe nasce quando la sezione si avvicina.
- Movimento ridotto: niente pin né scroll morbido, la pagina si legge come una pagina normale.
- Mobile: non previsto.

## 4. Verifica

- `cd tests && node --test` (dati, fermate) e `node e2e.mjs` (offline, struttura, tasti, temi, capitoli, hash, lenti, progetti, movimento ridotto, copia, QR).
- `node shoot.mjs <cartella> [w h]`: percorre tutte le fermate da tastiera e salva uno screenshot per fermata.
- `node qa.mjs [w h] [--mid]`: a ogni fermata (o a metà fra due) segnala testo tagliato dallo schermo o dal contenitore e testi visibili sovrapposti.

## 5. Ancora aperto

- Link pubblico (QR e link finale) punta ancora alla vecchia pagina pubblicata.
- Fonte per le skill singole (oggi la sezione Risorse dice solo dove copiarle).
- Prova a voce completa e passata `/impeccable polish`.
