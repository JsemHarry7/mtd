---
subject: DAT
number: 2
title: "Bootstrap a návrh designu"
tags: ["web", "css", "frontend", "responzivita"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Bootstrap** je **nejpopulárnější CSS framework** (vytvořený Twitterem v roce 2011) pro **rychlou tvorbu responzivních webů**. Poskytuje hotový **grid systém** (12 sloupců, 5 breakpointů), **komponenty** (navbar, cards, buttons, forms, modals) a **utility classes** (spacing, colors, display, flex) — vše přes CSS třídy bez psaní vlastního CSS. **Aktuální verze Bootstrap 5** (2021+) je **bez závislosti na jQuery**, používá vanilla JS + CSS custom properties. Klíčové výhody: **rychlost vývoje, konzistentní design, mobile-first** přístup, široká community a dokumentace.

---

## Klíčové pojmy

- **CSS framework** — knihovna hotových CSS tříd a komponent
- **Grid systém** — 12 sloupců, řízení layoutu přes utility třídy
- **Container** — wrapper pro grid, max-width podle breakpointu
- **Row** — kontejner pro sloupce, používá flexbox
- **Col** — sloupec mřížky, šířka 1–12
- **Breakpoint** — bod přepnutí responzivního layoutu (sm/md/lg/xl/xxl)
- **Komponenta** — předpřipravený UI prvek (navbar, card, modal)
- **Utility class** — single-purpose CSS třída (`mt-3`, `text-center`, `d-flex`)
- **Mobile-first** — Bootstrap je mobile-first (default = mobile, breakpoints přidávají styly nahoru)
- **`data-bs-*`** atributy — propojení s JavaScript komponentami

---

## Hlavní výklad (5–10 min mluvení)

### 1. Co je Bootstrap a proč ho používat

**Bootstrap** je **CSS framework** = knihovna **hotových CSS tříd a komponent**. Místo psaní vlastního CSS pro každý prvek **dáš třídu na HTML element** a máš funkční styling.

**Výhody:**
1. **Rychlost** — místo hodin vlastního CSS máš design za 30 min
2. **Konzistence** — design system je vestavěný, všechny prvky vypadají kompatibilně
3. **Responzivita** — built-in breakpointy a mobile-first
4. **Cross-browser** — testováno napříč prohlížeči
5. **Komunita + dokumentace** — největší CSS framework, vše dohledáš
6. **Customizace** — Sass variables, CSS custom properties

**Nevýhody:**
- **Generic look** — bez customizace všechny weby vypadají stejně
- **Velikost** — celý balík je velký (lze tree-shaking)
- **Závislost** — vendor lock-in na framework

**Verze:**
- **Bootstrap 3** (2013) — jQuery, mobile-first
- **Bootstrap 4** (2018) — flexbox grid, Sass
- **Bootstrap 5** (2021) — **bez jQuery**, vanilla JS, CSS custom properties

### 2. Připojení Bootstrap do projektu

#### Přes CDN (jednoduché, doporučeno pro malé projekty)
```html
<head>
    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- obsah s Bootstrap classes -->

    <!-- JS (pokud potřebujeme interaktivní komponenty) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
```

⚠️ **JS dej před `</body>`** — DOM musí být načtený dřív než JS, který s ním pracuje.

#### Přes npm (větší projekty)
```bash
npm install bootstrap
```

#### Přes Bootstrap source (vlastní customizace)
```scss
@import "bootstrap/scss/bootstrap";
// + override Sass variables
```

### 3. Grid systém — 12 sloupců + breakpoints

**Bootstrap grid je založen na 12 sloupcích a flexboxu.**

#### Struktura

```html
<div class="container">           <!-- wrapper s max-width -->
    <div class="row">              <!-- řádek s flexbox -->
        <div class="col">          <!-- sloupec -->
            Sloupec 1
        </div>
        <div class="col">
            Sloupec 2
        </div>
    </div>
</div>
```

#### 5 breakpointů

| Prefix | Šířka | Zařízení |
|---|---|---|
| (žádný) | `< 576px` | Extra small (mobil) |
| `sm` | `≥ 576px` | Small (velký mobil) |
| `md` | `≥ 768px` | Medium (tablet) |
| `lg` | `≥ 992px` | Large (desktop) |
| `xl` | `≥ 1200px` | Extra large |
| `xxl` | `≥ 1400px` | XX large (jen v Bootstrap 5) |

⚠️ **Bootstrap je MOBILE-FIRST** — breakpoint prefixu znamená *"od této velikosti nahoru"*. `col-md-6` = 6/12 od **medium nahoru**. Pod tím (mobile) je default (typicky `col-12` = full width).

#### Příklady gridu

```html
<!-- 3 sloupce stejné šířky -->
<div class="row">
    <div class="col">A</div>
    <div class="col">B</div>
    <div class="col">C</div>
</div>

<!-- Explicitní šířka (6 + 6 = 12) -->
<div class="row">
    <div class="col-6">Polovina</div>
    <div class="col-6">Polovina</div>
</div>

<!-- Responzivní: mobile full, tablet+ rozdělené -->
<div class="row">
    <div class="col-12 col-md-4">Sidebar</div>
    <div class="col-12 col-md-8">Content</div>
</div>

<!-- Různé layouty per breakpoint -->
<div class="row">
    <div class="col-12 col-sm-6 col-lg-4">Card</div>
    <div class="col-12 col-sm-6 col-lg-4">Card</div>
    <div class="col-12 col-sm-6 col-lg-4">Card</div>
</div>
<!-- mobil: 1 sloupec, tablet: 2 sloupce, desktop+: 3 sloupce -->
```

#### Auto-layout sloupce
```html
<div class="row">
    <div class="col">Roste</div>
    <div class="col-3">Pevný 3/12</div>
    <div class="col">Roste</div>
</div>
```

#### Offset a alignment
```html
<div class="row justify-content-center">
    <div class="col-6">Centered</div>
</div>

<div class="row">
    <div class="col-4 offset-4">S offsetem</div>
</div>
```

#### Container varianty

| Třída | Chování |
|---|---|
| `.container` | max-width se zvětšuje s breakpointy (576, 768, 992, 1140, 1320) |
| `.container-fluid` | **100 % šířky** vždy |
| `.container-md` | fluid až do `md`, pak max-width |

### 4. Komponenty Bootstrap

Bootstrap má **desítky hotových komponent**. Nejpoužívanější:

#### Navbar
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Logo</a>

        <!-- Hamburger pro mobile -->
        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menu -->
        <div class="collapse navbar-collapse" id="navContent">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Domů</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">O nás</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

**Klíčové třídy:**
- `navbar` — základní
- `navbar-expand-lg` — od `lg` se rozbalí horizontálně (pod tím hamburger)
- `navbar-dark bg-dark` — tmavé téma
- `data-bs-toggle="collapse"` + `data-bs-target="#id"` — Bootstrap JS rozbalí/sbalí

#### Karty (cards)
```html
<div class="card" style="width: 18rem;">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">Název</h5>
        <p class="card-text">Popis...</p>
        <a href="#" class="btn btn-primary">Akce</a>
    </div>
</div>
```

#### Tlačítka
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-outline-primary">Outline</button>
<button class="btn btn-lg btn-primary">Velké</button>
<button class="btn btn-sm btn-primary">Malé</button>
```

#### Formuláře
```html
<form>
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email">
        <div class="form-text">Nikdy nesdílíme.</div>
    </div>
    <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="check1">
        <label class="form-check-label" for="check1">Souhlasím</label>
    </div>
    <button type="submit" class="btn btn-primary">Odeslat</button>
</form>
```

#### Modální okno
```html
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mojeModal">
    Otevři modal
</button>

<div class="modal fade" id="mojeModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nadpis</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">Obsah...</div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Zavřít</button>
            </div>
        </div>
    </div>
</div>
```

#### Další klasické komponenty
- **Alerts** — `<div class="alert alert-warning">Pozor!</div>`
- **Badges** — `<span class="badge bg-primary">New</span>`
- **Carousel** — slideshow
- **Accordion** — rozbalovací sekce
- **Dropdown** — dropdown menu
- **Pagination** — stránkování
- **Toast** — notifikace

### 5. Utility classes — single-purpose třídy

**Bootstrap má stovky utility tříd** pro běžné CSS úpravy. Bez psaní vlastního CSS.

#### Spacing — `m` (margin), `p` (padding)

```
formát: {property}{sides}-{size}
        m / p   t/b/s/e/x/y / 0-5/auto
```

| Třída | Význam |
|---|---|
| `m-3` | margin všechny strany, 3 = 1rem |
| `mt-2` | margin-top (t) |
| `mb-4` | margin-bottom (b) |
| `ms-1` | margin-start (left v LTR) (s = start) |
| `me-3` | margin-end (right v LTR) (e = end) |
| `mx-auto` | margin-left + margin-right auto (centrování) |
| `my-3` | margin-top + margin-bottom |
| `p-0` | padding 0 |
| `pt-5` | padding-top |

**Stupnice 0–5:** 0, 1 (0.25rem), 2 (0.5rem), 3 (1rem), 4 (1.5rem), 5 (3rem). Plus `auto`.

**Responzivní:** `mt-md-4` = margin-top 4 **od medium nahoru**.

#### Display — `d-*`

```html
<div class="d-none">Skryté</div>
<div class="d-block">Block</div>
<div class="d-flex">Flexbox</div>
<div class="d-grid">Grid</div>
<div class="d-inline-block">Inline-block</div>

<!-- Responzivní -->
<div class="d-none d-md-block">Skryté na mobilu, viditelné od md</div>
```

#### Flex utilities

```html
<div class="d-flex justify-content-center align-items-center">
    Centrovaný flex
</div>
<div class="d-flex flex-column">Sloupec</div>
<div class="d-flex gap-3">Mezery</div>
```

`justify-content-{start|center|end|between|around|evenly}`
`align-items-{start|center|end|baseline|stretch}`
`flex-{row|column|wrap}`

#### Text utilities

```html
<p class="text-center">Centrovaný text</p>
<p class="text-end">Vpravo</p>
<p class="text-primary">Modrá</p>
<p class="text-success">Zelená</p>
<p class="text-muted">Šedá</p>
<p class="fw-bold">Tučný</p>
<p class="fst-italic">Kurzíva</p>
<p class="text-uppercase">VELKÁ</p>
```

#### Barvy

**Pojmenované barvy** (theme colors):
- `primary` (modrá), `secondary` (šedá), `success` (zelená)
- `danger` (červená), `warning` (žlutá), `info` (světle modrá)
- `light` (světlá), `dark` (tmavá)

**Použití:**
- Text: `text-primary`, `text-danger`
- Background: `bg-primary`, `bg-light`
- Border: `border-primary`, `border-danger`
- Button: `btn-primary`, `btn-outline-success`

### 6. data-bs-* atributy a JavaScript komponenty

Některé komponenty (modal, dropdown, navbar collapse, carousel, accordion, tooltip) **potřebují JavaScript** pro interakci. Bootstrap JS se k nim vážě přes `data-bs-*` atributy.

```html
<!-- Toggle navbar collapse -->
<button data-bs-toggle="collapse" data-bs-target="#navMenu">☰</button>

<!-- Open modal -->
<button data-bs-toggle="modal" data-bs-target="#mujModal">Otevři</button>

<!-- Close modal -->
<button data-bs-dismiss="modal">Zavřít</button>

<!-- Dropdown -->
<button data-bs-toggle="dropdown">Menu</button>

<!-- Tab -->
<button data-bs-toggle="tab" data-bs-target="#tab1">Tab 1</button>
```

⚠️ Pro tyto komponenty **MUSÍŠ načíst Bootstrap JS** (`bootstrap.bundle.min.js`). Bez JS budou tlačítka kliknutelná, ale nic se nestane.

### 7. Bootstrap × jiné frameworky

| Framework | Charakter |
|---|---|
| **Bootstrap** | Komponenty + utility, design je "vestavěný" |
| **Tailwind CSS** | **Pouze utility classes** ("utility-first"), vlastní design |
| **Bulma** | Komponenty, **bez JS**, pure CSS |
| **Material UI / MUI** | React komponenty, Google Material Design |
| **Chakra UI** | React komponenty, accessibility-first |
| **Foundation** | Komponenty, podobné Bootstrap, méně populární |

**Filozofie:**
- **Bootstrap** = *"přidej třídy, máš design"* — komponenty + utility mix
- **Tailwind** = *"sestav si vlastní design z utility tříd"* — žádné komponenty

Pro maturitu Bootstrap stačí. Tailwind je trend, ale komise pravděpodobně preferuje Bootstrap.

---

## Konkrétní příklady / kód

### Plný responzivní layout (3 sloupce karty)
```html
<div class="container my-4">
    <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">Karta 1</h5>
                    <p class="card-text">Text karty.</p>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">Karta 2</h5>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">Karta 3</h5>
                </div>
            </div>
        </div>
    </div>
</div>
```

- `g-3` na `.row` — gap mezi sloupci
- `h-100` na `.card` — všechny karty stejné výšky
- Responzivita: mobil 1 sloupec → tablet 2 → desktop 3

### Hero section s gradientem (centered)
```html
<header class="bg-primary text-white py-5 text-center">
    <div class="container">
        <h1 class="display-3">Velký nadpis</h1>
        <p class="lead">Lead text pro hero.</p>
        <a href="#" class="btn btn-lg btn-light">Akce</a>
    </div>
</header>
```

- `py-5` — padding vertikální 5
- `display-3` — velký nadpis (1-6 dostupné, default `h1` je menší)
- `lead` — větší úvodní odstavec
- `btn-lg` — velké tlačítko

### Centrovaný element (flexbox utility)
```html
<div class="d-flex justify-content-center align-items-center vh-100">
    <h1>Centrum</h1>
</div>
```

`vh-100` = výška 100vh.

---

## Vztahy / kontrasty

- **Bootstrap × vlastní CSS** — Bootstrap rychlejší, vlastní CSS flexibilnější. **Hybrid** je běžný: Bootstrap pro grid + utility, vlastní CSS pro brand-specific styling.
- **Bootstrap × Tailwind** — Bootstrap má **komponenty** (`btn`, `card`), Tailwind má **jen utility** (`bg-blue-500`, `p-4`). Tailwind = více flexibility, ale víc tříd na element.
- **`.container` × `.container-fluid`** — container má max-width (centrovaný se okraji), container-fluid 100 % šířky.
- **Bootstrap 4 × 5** — v5 **bez jQuery**, vanilla JS, RTL support, CSS variables.
- **Grid `col-md-6` × `col-md-4 col-lg-3`** — single-breakpoint × multi-breakpoint stacking.
- **Utility `mt-3` × Sass mixin** — utility funguje ihned, Sass vyžaduje build process.

---

## Časté otázky komise

**Q:** Co je Bootstrap a k čemu slouží?
**A:** **Nejpopulárnější CSS framework** (Twitter, 2011). Poskytuje **hotové CSS třídy a komponenty** pro rychlou tvorbu responzivních webů. Místo psaní vlastního CSS jen přidáš třídy na HTML. Výhody: rychlost, konzistence, mobile-first, dokumentace.

**Q:** Jak funguje Bootstrap grid systém?
**A:** Založen na **12 sloupcích a flexboxu**. Struktura: `.container` → `.row` → `.col-{size}`. Můžu mít `col-6 col-6` (2 stejné polovice) nebo `col-4 col-8` (1/3 + 2/3). **Bootstrap je mobile-first**, breakpointy `sm, md, lg, xl, xxl` přidávají styly nahoru.

**Q:** Vyjmenuj breakpointy Bootstrap 5.
**A:** **`sm` ≥ 576 px** (velký mobil), **`md` ≥ 768 px** (tablet), **`lg` ≥ 992 px** (desktop), **`xl` ≥ 1200 px** (extra large), **`xxl` ≥ 1400 px** (od Bootstrap 5). Pod 576 px je default (extra small, bez prefixu).

**Q:** Co znamená `col-12 col-md-6 col-lg-4`?
**A:** Responzivní sloupec:
- **Default (mobile):** 12/12 = **plná šířka**
- **Od md (768+):** 6/12 = **polovina**
- **Od lg (992+):** 4/12 = **třetina**

Mobil 1 sloupec → tablet 2 sloupce → desktop 3 sloupce.

**Q:** Jaký je rozdíl mezi `.container` a `.container-fluid`?
**A:** **`.container`** má max-width, která roste s breakpointy (až 1320 px na xxl). Centrovaný s okraji. **`.container-fluid`** je **vždy 100 % šířky** parent elementu. Pro celostránkové hero/banner použij fluid, pro běžný obsah container.

**Q:** Co jsou Bootstrap utility classes? Uveď příklad.
**A:** **Single-purpose CSS třídy** pro běžné úpravy bez psaní vlastního CSS. Příklady:
- **Spacing:** `mt-3` (margin-top), `p-2` (padding), `mx-auto` (margin x auto)
- **Display:** `d-flex`, `d-none`, `d-md-block`
- **Text:** `text-center`, `text-primary`, `fw-bold`
- **Barvy:** `bg-primary`, `text-success`

**Q:** Vyjmenuj alespoň 3 Bootstrap komponenty.
**A:** **Navbar** (navigace s mobile collapse), **Card** (karta s img/title/body/footer), **Modal** (popup okno), **Form controls** (`.form-control`), **Buttons** (`.btn btn-primary`), **Alert**, **Carousel**, **Accordion**, **Dropdown**.

**Q:** Jak v Bootstrapu skryješ element na mobilu, ale ukážeš ho na desktopu?
**A:** Přes responzivní display utility:
```html
<div class="d-none d-md-block">Viditelné od md nahoru</div>
```
`d-none` = skrytý default (mobile), `d-md-block` = block od md nahoru. Bootstrap je mobile-first, takže approach jde "od malého k většímu".

**Q:** Co dělají `data-bs-*` atributy?
**A:** **Propojení s Bootstrap JavaScript komponentami**. Příklady:
- `data-bs-toggle="modal" data-bs-target="#mojeModal"` — otevře modal
- `data-bs-toggle="collapse" data-bs-target="#nav"` — rozbalí navigaci
- `data-bs-dismiss="modal"` — zavře modal

**Vyžadují načtený Bootstrap JS** (`bootstrap.bundle.min.js`).

**Q:** Co je rozdíl mezi Bootstrap a Tailwind CSS?
**A:** **Bootstrap** = komponenty + utility, **vestavěný design** (všechny weby vypadají podobně). **Tailwind** = **pouze utility** ("utility-first"), žádné komponenty, **vlastní design** sestavuješ z atomických tříd. Bootstrap rychlejší pro standardní web, Tailwind flexibilnější pro custom design.

---

## Co bych ještě měl vědět (volně)

- **Sass customizace** — Bootstrap má v Sass všechny variables (`$primary`, `$spacer`, breakpointy). Lze importovat jen části `@import "bootstrap/scss/grid";`.
- **Tree-shaking v Bootstrap 5** — lze importovat **jen použité komponenty**, redukce bundle size.
- **Bootstrap Icons** — separátní icon set (1700+ ikon, `<i class="bi bi-house"></i>`).
- **Themes** — Bootstrap má placené themes (Themeforest), Bootswatch (free) — pre-built design varianty.
- **`display-1` až `display-6`** — extra-velké nadpisy pro hero sekce.
- **`g-{0-5}`** na `.row` — gap mezi sloupci.
- **`offcanvas`** — sliding sidebar (mobile menu alternative).
- **Form floating labels** — `.form-floating` (modern look, labels uvnitř inputu).

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Materiál v `_materials/dat/02/`** je v adresáři **bez `validovane/` markeru** — je to assignment "P4A Restaurace Bootstrap Cvičení" s HTML kostrou + 4 obrázky breakpointů (desktop, tablet1, tablet2, mobile) + README. Předpokládám, že je to materiál od učitele (assignment), ne spolužácký zápis.
- ⚠️ **Bootstrap 4 vs 5** — assignment používá **`data-bs-*`** atributy (Bootstrap 5) + **jQuery** ve `<script>` na konci (`$(document).ready`). To je **smíšené** — Bootstrap 5 jQuery nepotřebuje, ale assignment ho používá pro custom filter logic. Pokud učitel chce **Bootstrap 4 syntax** (data-toggle bez bs-), použij to. Drž **Bootstrap 5 syntax** (`data-bs-*`) — moderní default.
- ⚠️ **Bootstrap verze CDN linku** — drž **5.3+** (nejnovější stable).

---

## Praktická příprava (pro 30 min u PC)

**Hlavní úloha** v `_practice/dat2-bootstrap/`: doplnit Bootstrap třídy do **HTML kostry restaurace** podle 4 breakpoint screenshotů.

**Komponenty assignmentu:**
1. **Navbar** s mobile hamburger collapse (`navbar-expand-lg`, `data-bs-toggle="collapse"`)
2. **Hero header** (centered)
3. **Hero image** (responsive img-fluid)
4. **Sidebar + content** layout (`row` + `col-md-3 col-md-9`)
5. **Filtrovatelné karty** kategorií (jQuery filter logic z `<script>`)
6. **Card komponenty** pro menu items
7. **About sekce** s `row` (2 sloupce — image + text)
8. **Footer** s 3 sloupcovým gridem

**Náročnost:** **Větší než typicky 30 min** (assignment je rich). Tip: **30 min cílový čas u zkoušky, realistická příprava 60–90 min**.

---

## Status

- **Sebehodnocení (před):** 3/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-12
