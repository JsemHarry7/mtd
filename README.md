# mtd — mark that down

> Veřejný rozcestník studijních zápisků z markdownu. Postaveno během
> přípravy na maturitu 2026 (SWI · DAT · ČJL), ale použitelné pro
> jakýkoli předmět / zkoušku — stačí přepsat config a nahrát svoje `.md`.

**Stack:** Vite + React 19 + TypeScript + Tailwind v4 · **Hosting:** Cloudflare Pages (plánováno)

## Co to umí

- **Plain markdown** v `content/` se YAML frontmatterem — žádný custom editor
- **Auto-tříděné podle subjectu** přes frontmatter (`subject: SWI`, `subject: DAT`, ...)
- **Bipartitní graf souvislostí** — uzly = zápisky + sdílené koncepty (tagy), `/graf`
- **3 share módy** — `public` / `unlisted` / `private` (default private = bezpečné)
- **Magazine reading layout** — single-column prose, kolofon, prev/next nav
- **Dark / light** s respektem k OS preference
- **Žádný backend** — static deploy, žádné účty, žádné cookies, žádný JS od třetích stran
- **Vše v češtině**

## Frontmatter contract

Každý `.md` v `content/` musí mít hlavičku:

```yaml
---
subject: SWI         # SWI · DAT · CJL · ...
number: 4
title: "Datové typy"
tags: [datové-typy, c-sharp, oop]
share: public        # public · unlisted · private
status: review       # draft · review · done
speakingTime: 12
updated: 2026-05-17
---
```

Bez hlavičky se soubor přeskočí. Slug = `{subject-lower}-{number-padded}` (např. `swi-04`).

## Stack

| Vrstva | Co tam je |
|---|---|
| Frontend | Vite 6, React 19, TypeScript 5.7, Tailwind v4 (`@theme` tokens) |
| State | `useState` (lehký), Zustand jen pokud bude potřeba |
| Routing | wouter (history mode) |
| MD pipeline | gray-matter + unified (remark/rehype) + rehype-slug + autolink |
| Graph | react-force-graph-2d (Canvas), lazy-loaded |
| Fonty | Instrument Serif (display) · Inter (body) · JetBrains Mono (chrome) |

## Adresářová struktura

```
content/                     Tvoje .md zápisky (organizováno per subject)
  swi/01-uml.md
  dat/17-rest-api.md
  cjl/01_romeo_a_julie.md
mtd.config.mjs               Site name + subject display config (label, order, color)
public/
  favicon.svg                Italic `m` v cobaltu, dark-mode aware
  icon.svg                   PWA touch icon
  data/                      [generated] manifest.json + per-note JSON + graph.json
scripts/
  build-content.mjs          Walks content/, parses frontmatter, emits public/data/
  migrate-from-notes.mjs     One-off importer z externích _notes/ složek
src/
  App.tsx                    Routes (TopBar + Footer)
  components/
    TopBar.tsx               Sticky nav (SWI · DAT · CJL · GRAF · ABOUT)
    Landing.tsx              Magazine masthead + subjects + recent
    SubjectPage.tsx          Number-listed table of notes
    NotePage.tsx             Single-column reader + colophon
    Graph.tsx                Force-directed bipartite map (lazy)
    MobileMenu.tsx           Full-screen overlay
    AboutPage.tsx
  index.css                  Design tokens + prose styles
  types.ts                   Frontmatter / Manifest / GraphNode etc.
  lib/
    manifest.ts              Fetch + cache /data/*
    theme.ts                 light/dark toggle + persistence
    useDocumentTitle.ts      Per-route <title>
```

## Lokální development

```sh
npm install
npm run dev          # vite dev na http://localhost:5174
npm run build        # build content + tsc + vite build do dist/
npm run typecheck    # tsc -b --noEmit
npm run build:content   # jen markdown pipeline (regeneruje public/data/)
```

`npm run dev` nejdřív spustí `build:content` a pak Vite — když přidáš/upravíš `.md`, je potřeba `dev` restartovat (nebo zvlášť `npm run build:content`). Watch mode je TODO.

## Deploy

Plánovaný target: **Cloudflare Pages** (jako sourozenec [rep](https://rep.harrydeiml.ing)).
Build command: `npm run build`. Output: `dist/`. Žádné env vars, žádný backend.

## Design rozhodnutí

- **Cobalt + cream** paleta, žádné brand colors z `rep` — záměrné odlišení sourozenců
- **Magazine layout** místo "tool" UI (sidebar + statusbar) — mtd je čtení, ne práce
- **Serif headings v prose** (Instrument Serif) — knižní cítění, ne docs site
- **§ sigil před `h2`**, em-dash bullets, leading-zero `<ol>` — typografická identita
- **Bipartitní graf** (notes + tag nody) místo all-pairs hran — vidíš co spojuje co
- **No drag** na grafu — je to zobrazení vztahů, ne layout tool

## Status

Pre-MVP. Verze `0.0.1` = funkční ale ne stabilní API. Frontmatter contract
se ještě může změnit. Záloha .md souborů přes git.

## Open source

MIT licence. Forkni, používej, uprav pro svoji školu / zkoušku / předmět.
Tipy pro vlastní setup:

- Změnit subjecty + barvy → `mtd.config.mjs`
- Změnit paletu / fonty → `src/index.css` (`@theme` tokens)
- Nový subject = nová složka v `content/` + entry v config
- Vlastní site name + tagline → `mtd.config.mjs` + `src/components/Landing.tsx`

## Credits

Crafted by [harry](https://harrydeiml.ing) · ústní maturita 25.5.2026 ·
licensováno pod [MIT](./LICENSE)

[kontakt@harrydeiml.ing](mailto:kontakt@harrydeiml.ing)
