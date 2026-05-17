---
subject: SWI
number: 14
title: "Návrh a tvorba obsahového webu"
tags: ["web", "frontend", "ux", "responzivita"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Obsahový web** je web, jehož **primární cíl je předávat hodnotný obsah** — vzdělávat, informovat, zaujmout — **nikoli prodávat produkty** jako u e-shopu. Typicky blogy, zpravodajské portály, vzdělávací platformy. **Workflow tvorby** má 7 fází: analýza, informační architektura, wireframy, grafický návrh, implementace, testování, nasazení. Klíčové koncepty: **UX** (jak web funguje), **UI** (jak web vypadá), **SEO** (optimalizace pro vyhledávače), **responzivita** (přizpůsobení velikostem zařízení).

---

## Klíčové pojmy

- **Obsahový web** — web zaměřený na předávání obsahu, nikoli prodej
- **Cílová skupina** — konkrétní typ uživatelů, na které web cílí
- **Workflow** — sekvence kroků tvorby webu
- **Informační architektura** — struktura a hierarchie obsahu
- **Wireframe** — návrh rozložení bez grafiky (UX fáze)
- **Prototyp** — interaktivní mock-up
- **UX (User Experience)** — jak web **funguje**
- **UI (User Interface)** — jak web **vypadá**
- **SEO (Search Engine Optimization)** — optimalizace pro vyhledávače
- **Responzivita** — přizpůsobení velikostem obrazovek
- **Viewport** — viditelná oblast prohlížeče
- **Breakpoint** — bod, kde se layout přepíná na jiné rozložení (mobil/tablet/desktop)
- **Media query** — CSS pravidlo pro podmíněné styly podle viewportu

---

## Hlavní výklad (5–10 min mluvení)

### 1. Co je obsahový web

**Cíl:** předávat **hodnotný obsah**, nikoli prodávat.

**Typické obsahy:**
- **Text:** články, blogy, případové studie, popisy produktů (jako zdroj znalostí)
- **Media:** fotky, videa, animace, zvuky (vizuální obsah)
- **Smíšené:** tutoriály, návody (text + obrázky + videa)

**Příklady obsahových webů:**
- Zpravodajské portály — **iDNES.cz, Novinky.cz, BBC News**
- Vzdělávací — **Khan Academy, Coursera**
- Blogy — Medium, dev.to
- Wikipedie

**Klíčové vlastnosti dobrého obsahového webu:**
1. **Jednoduchá navigace** — uživatel rychle najde, co hledá
2. **Cílení** — konkrétní cílová skupina (ne "všichni")
3. **Pochopení cílové skupiny** — co je zajímá, jaký jazyk používají

⚠️ **Past:** *"univerzální web pro každého"* = web pro nikoho. **Před návrhem MUSÍŠ určit cílovou skupinu** a dělat rozhodnutí podle ní (jazyk, vizuální styl, hloubka informací).

### 2. Workflow tvorby webu — 7 fází

Standardní postup tvorby obsahového webu:

#### Fáze 1 — Analýza a zadání projektu
- Definice **cílové skupiny**
- Určení **cílů webu** (informovat, prodávat, propagovat, vzdělávat)
- **Konkurenční analýza** — co dělají podobné weby, co dělají dobře, co špatně

#### Fáze 2 — Návrh informační architektury
- **Struktura webu** — mapa stránek, hierarchie
- **Logické rozdělení do sekcí** — Články, O nás, Kontakt, atd.
- **Site map** dokument

#### Fáze 3 — Wireframy a prototypy
- **Wireframe** = návrh **rozložení prvků bez grafiky** (UX fáze)
- **Prototyp** = interaktivní mock-up (klikatelný)
- **Testování flow uživatele** — *"projde uživatel od homepage k cíli intuitivně?"*
- Nástroje: **Figma**, Adobe XD, Balsamiq

#### Fáze 4 — Grafický návrh (UI)
- **Barvy, typografie, vizuální styl**
- **Finální design** v nástroji (Figma, Adobe XD)
- **Design system** — opakovaně použitelné komponenty (tlačítka, formuláře, karty)

#### Fáze 5 — Implementace (kódování)
- **HTML + CSS + JS**
- Připojení backendu (pokud potřeba)
- CMS (Content Management System) jako WordPress, Ghost
- Frameworky: React, Vue, Next.js

#### Fáze 6 — Testování a ladění
- **Ověření funkčnosti** napříč browsery
- **Kompatibilita** s různými zařízeními
- **Odladění chyb** (bug fixing)

#### Fáze 7 — Nasazení a údržba
- **Publikace na server** (deploy)
- **Pravidelná aktualizace obsahu**
- **SEO optimalizace** — průběžná
- **Monitoring** (analytics, error tracking)

### 3. UX — User Experience

> **UX řeší, JAK web funguje.**

**Klíčové aspekty:**
- **Struktura** stránek a navigace
- **Rozvržení prvků** (layout)
- **Responzivní design** (mobil/tablet/desktop)
- **Plynulý přechod uživatele** od bodu A k bodu B (user flow)
- **Doba načítání** (performance)
- **Přístupnost** (accessibility)

**Cíl UX:** *"Uživatel udělá to, co chce, **rychle a bez frustrace**."*

**UX není o vzhledu** — je o **chování a struktuře**. Krásný web s špatným UX = uživatel ho opustí.

### 4. UI — User Interface

> **UI řeší, JAK web vypadá.**

**Klíčové aspekty:**
- **Paleta barev** — primární, sekundární, accent
- **Font** — typografie, hierarchie velikostí
- **Layout** — rozložení prvků na stránce
- **Tlačítka, ikony, formuláře** — vizuální styl komponent
- **Vizuální hierarchie** — velikost, kontrast, umístění zdůrazňují důležitost
- **Konzistence stylu** napříč stránkami
- **Animace a přechody** — transition, hover efekty
- **Grafické prvky a ilustrace**
- **Stylování komponent** — CSS, UI knihovny (Tailwind, Material UI, Bootstrap)
- **Přístupnost** — kontrast, čitelnost

**UX × UI:**
- **UX = funguje to**
- **UI = vypadá to**
- **Obojí MUSÍ být dobré** — jedno bez druhého ztrácí smysl

### 5. SEO — Search Engine Optimization

> **Úprava stránek pro lepší dohledatelnost v organických (neplacených) výsledcích vyhledávačů.**

**Cíl:** dostat se na **první příčky** Google/Seznam pro **klíčová slova** spojená s tvým obsahem.

**Co SEO ovlivňuje:**

#### On-page SEO (na stránce)
- **`<title>`** — text v záložce, klíčový pro SEO
- **`<meta name="description">`** — popis pod nadpisem ve výsledcích
- **Sémantické HTML** — `<h1>`, `<article>`, `<nav>` (Google chápe strukturu)
- **`alt` u obrázků** — Google indexuje obrázky
- **Klíčová slova** v obsahu (přirozeně, ne keyword stuffing)
- **Rychlost načítání** (Core Web Vitals)
- **Responzivita** (Google = mobile-first indexing)
- **Sémantické URL** — `/blog/jak-na-css-grid` lepší než `/p?id=42`

#### Off-page SEO (mimo stránku)
- **Backlinks** — kvalitní odkazy z jiných stránek
- **Social signals** — sdílení na sociálních sítích
- **Domain authority** — důvěryhodnost domény

**K čemu SEO slouží:**
- **Zvýšení návštěvnosti** (free traffic)
- **Ovlivnění výsledků vyhledávání** (vyšší pozice = víc kliknutí)
- **Konverze** — návštěvníci → zákazníci

**Lighthouse** = vestavěný nástroj v Chrome DevTools pro audit SEO + performance + accessibility. Hodnotí **na číselné škále** (0–100), čím vyšší, tím lépe.

### 6. Responzivita

> **Responzivní design = web se přizpůsobuje různým velikostem obrazovek.**

**Cíl:** zachovat **čitelnost a funkčnost** bez nutnosti zoomování / horizontálního scrollu.

#### Klasické breakpointy

| Zařízení | Šířka |
|---|---|
| **Mobilní telefon** | do 480–600 px |
| **Tablet** | 768–1024 px |
| **Notebook / Desktop** | 1280 px a více |
| **Velké displeje** | 1920 px a více |

#### Tailwind breakpointy

| Prefix | Šířka |
|---|---|
| `sm` | 640 px |
| `md` | 768 px |
| `lg` | 1024 px |
| `xl` | 1280 px |
| `2xl` | 1536 px |

⚠️ **Tailwind používá `min-width`** (mobile-first). `md:hidden` = skryje od 768 px nahoru (na mobilu vidět, na tabletu+ skryto).

#### Mobile-first × Desktop-first

- **Mobile-first** (moderní praxe) — výchozí styly pro mobil, **media query `min-width`** pro větší
- **Desktop-first** (starší) — výchozí pro desktop, **`max-width`** pro menší

#### Technologie pro responzivitu

**1. Media query** — nastavuje CSS pro daný rozsah velikostí:
```css
@media (min-width: 768px) and (max-width: 1023px) {
    body { background-color: red; }
}
```

**2. Flexbox** *(DAT 3)* — uspořádává prvky v řadě/sloupci, snadné zarovnání + distribuci.

**3. CSS Grid** *(DAT 4)* — dvourozměrná mřížka pro přesný layout.

**4. Relativní jednotky** — `rem`, `%`, `vw`, `vh` (na rozdíl od absolutního `px`).

**5. `<meta name="viewport">`** v HTML head — **esenciální** pro mobilní responzivitu.

### 7. Druhy viewportů

**Viewport** = viditelná oblast prohlížeče.

| Typ | Použití |
|---|---|
| **Layout viewport** | Šířka, kterou používá CSS pro layout |
| **Visual viewport** | Co uživatel reálně vidí (může být menší při zoom) |
| **Ideal viewport** | Šířka v CSS pixelech pro daný typ zařízení |

V HTML hlavičce:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
**Bez tohoto meta** prohlížeč na mobilu zobrazí stránku v defaultní šířce (typicky 980 px) zoom-out.

---

## Konkrétní příklady / kód

### Media query pro responzivitu
```css
/* Mobile-first: výchozí styly pro mobil */
.container {
    padding: 1rem;
    font-size: 14px;
}

/* Tablet a větší */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
        font-size: 16px;
    }
}

/* Desktop a větší */
@media (min-width: 1024px) {
    .container {
        padding: 3rem;
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### SEO friendly HTML
```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jak na CSS Grid — Můj blog</title>
    <meta name="description" content="Praktický návod na CSS Grid pro začátečníky. Holy grail layout, responzivita, příklady.">
    <link rel="canonical" href="https://blog.example.com/jak-na-css-grid">
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    <main>
        <article>
            <h1>Jak na CSS Grid</h1>
            <p>Úvod do tématu...</p>
            <img src="grid.png" alt="Diagram CSS Grid layoutu s 3 sloupci">
        </article>
    </main>
    <footer>...</footer>
</body>
</html>
```

### Wireframe vs Mock-up

**Wireframe** (UX fáze) — pouze rozložení, černobílé, žádná grafika:
```
┌────────────────────────┐
│ [LOGO]  Menu Menu Menu │
├────────────────────────┤
│                        │
│      Hero text         │
│      [Button]          │
│                        │
├──────┬──────┬─────────┤
│ Card │ Card │ Card    │
└──────┴──────┴─────────┘
```

**Mock-up / UI design** (UI fáze) — s barvami, fonty, ikonami, finální vzhled.

---

## Vztahy / kontrasty

- **UX × UI** — UX = jak to funguje, UI = jak to vypadá. **Obojí musí být dobré.**
- **Wireframe × Mock-up** — wireframe je UX fáze (struktura), mock-up je UI fáze (vzhled).
- **Mobile-first × Desktop-first** — mobile-first moderní praxe (`min-width`), desktop-first starší (`max-width`). Moderní web = vždy mobile-first.
- **On-page × Off-page SEO** — on-page (co máš na stránce — title, meta, sémantika), off-page (co se děje mimo — backlinks, social).
- **Obsahový web × e-shop** — obsahový web předává informace, e-shop prodává. Měří se jinak (návštěvnost vs konverze).
- **Responzivita × adaptivita** — **responzivní** = jeden web, **plynule** se mění podle viewportu. **Adaptivní** = několik verzí pro různé breakpointy (méně používané dnes).

---

## Časté otázky komise

**Q:** Co je obsahový web a v čem se liší od e-shopu?
**A:** **Obsahový web** primárně **předává hodnotný obsah** — vzdělává, informuje, zaujímá. Cíl: návštěvníci konzumují obsah. **E-shop** primárně **prodává produkty**. Liší se měřitelnými cíli: obsahový web měří **návštěvnost a engagement**, e-shop **konverze a obrat**.

**Q:** Vyjmenuj fáze workflow tvorby webu.
**A:** **1. Analýza** (cílová skupina, cíle, konkurence). **2. Informační architektura** (mapa stránek). **3. Wireframy + prototypy** (UX). **4. Grafický návrh** (UI — barvy, font, layout). **5. Implementace** (HTML/CSS/JS). **6. Testování** (funkčnost, kompatibilita). **7. Nasazení a údržba** (deploy + průběžná aktualizace).

**Q:** Jaký je rozdíl mezi UX a UI?
**A:** **UX (User Experience)** řeší, **jak web FUNGUJE** — struktura, navigace, user flow, responzivita, performance. **UI (User Interface)** řeší, **jak web VYPADÁ** — barvy, fonty, layout, ikony, animace. **UX je o chování, UI o vzhledu.** Obojí musí být dobré — krásný web s špatným UX uživatele ztratí.

**Q:** Co je SEO a k čemu slouží?
**A:** **Search Engine Optimization** — úprava stránek pro **lepší dohledatelnost v organických (neplacených) výsledcích** vyhledávačů. Cíl: dostat se na **první příčky** pro klíčová slova. On-page SEO: title, meta description, sémantické HTML, alt obrázků, rychlost. Off-page: backlinks. **Nástroj:** Lighthouse v Chrome DevTools — číselné skóre 0–100.

**Q:** Co je responzivita a jaké jsou klasické breakpointy?
**A:** Web se **přizpůsobuje různým velikostem obrazovek**. Cíl: čitelnost + funkčnost bez zoomování. **Klasické rozměry:** mobil do 600 px, tablet 768–1024 px, desktop 1280 px+. **Tailwind:** sm 640, md 768, lg 1024, xl 1280, 2xl 1536. **Technologie:** media query, Flexbox, Grid, relativní jednotky, viewport meta.

**Q:** Jak se zapisuje media query a co dělá?
**A:** Pravidlo CSS, které **podmínečně aplikuje styly** podle viewportu:
```css
@media (min-width: 768px) {
    body { font-size: 18px; }
}
```
Aplikuje pravidlo **jen pokud je viewport ≥ 768 px**. Lze kombinovat (`and`, `or` přes čárku, `not`), kontrolovat orientation, prefers-color-scheme atd.

**Q:** Co je viewport meta a proč ho nesmíme zapomenout?
**A:** **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`** v `<head>`. Řekne mobilnímu prohlížeči, že má **odpovídat šířce zařízení** a výchozí zoom **1:1**. **Bez něj** mobil zobrazí stránku jako desktop (980 px) **zoom-out** — nečitelná. **Esenciální pro mobilní responzivitu.**

**Q:** Co je wireframe a kdy ho používáš?
**A:** **Návrh rozložení prvků BEZ grafiky** — UX fáze (před UI). Černobílý / minimální. Cíl: ověřit **strukturu a user flow** bez rozptylování barvami a fontem. Nástroje: Figma, Balsamiq, tužka na papír. Po wireframu následuje UI design (Figma, Adobe XD) — finální vzhled.

**Q:** Jaké faktory ovlivňují SEO?
**A:** **On-page:** title, meta description, sémantické HTML (h1, article, nav), alt obrázků, klíčová slova přirozeně v obsahu, rychlost načítání, responzivita, sémantické URL. **Off-page:** backlinks z kvalitních stránek, social signals, domain authority.

**Q:** Co je rozdíl mezi mobile-first a desktop-first přístupem?
**A:** **Mobile-first** (moderní praxe) — **výchozí styly pro mobil**, media query `min-width` přidávají styly pro větší. **Desktop-first** (starší) — výchozí pro desktop, `max-width` upravují pro menší. Mobile-first lepší pro performance (mobil dostane méně CSS) a respektuje "mobile-first indexing" Google.

---

## Co bych ještě měl vědět (volně)

- **CMS (Content Management System)** — systém pro správu obsahu bez psaní kódu. **WordPress** (~40 % webů), Ghost, Webflow, Drupal.
- **Static Site Generators** — Hugo, Jekyll, Astro — generují statické HTML z Markdownu, rychlé + bezpečné.
- **Google Analytics** — měření návštěvnosti, chování uživatelů.
- **Heatmaps** — vizualizace, kam uživatelé klikají (Hotjar, Microsoft Clarity).
- **A/B testing** — porovnání dvou variant stránky pro lepší konverze.
- **Core Web Vitals** — Google metriky pro UX (LCP, FID, CLS) — ovlivňují SEO.
- **Schema.org markup** — strukturovaná data v HTML pro vyhledávače (recepty, produkty, eventy).
- **Sitemap.xml** — soubor pro vyhledávače se seznamem všech stránek.
- **`robots.txt`** — soubor s instrukcemi pro crawler boty (co indexovat, co ne).

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném PDF** v `_materials/swi/14/spoluzaci-validovane/`. Obsah zachován + doplnění z obecných znalostí (CMS, SSG, Core Web Vitals, Schema.org) — nebyly v materiálu.
- ⚠️ **Tailwind breakpointy** byly v materiálu — můžou se v různých verzích lehce lišit. Pro maturitu drž ty z materiálu.
- ⚠️ **`lighthouse`** — pravopis: psáno malými písmeny (značka i CLI). Pokud učitel cituje "Lighthouse", drž oba způsoby.
- ⚠️ **Konkrétní příklady obsahových webů** (iDNES, Novinky, BBC) v materiálu — drž je jako "klasické příklady".

---

## Status

- **Sebehodnocení (před):** 1/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-12
