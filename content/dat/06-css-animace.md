---
subject: DAT
number: 6
title: "CSS animace a transformace"
tags: ["web", "css", "frontend"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> CSS animace zahrnují **tři propojené koncepty:** **transformace** (`transform` — změna tvaru, velikosti, polohy bez ovlivnění layoutu), **přechody** (`transition` — plynulá změna vlastnosti při změně stavu, např. hover), a **animace klíčových snímků** (`@keyframes` + `animation` — složitější animace s víc mezikroky, spouští se automaticky). **Klíčový rozdíl:** transition potřebuje **změnu stavu** (hover, JS), keyframes **běží sám** bez interakce. Pro výkon je nejlepší animovat **`transform`** a **`opacity`** — běží na GPU (nepřepočítává layout).

---

## Klíčové pojmy

- **`transform`** — vlastnost pro 2D/3D transformace (translate, scale, rotate, skew)
- **`transform-origin`** — bod, kolem kterého se transformace aplikuje (default střed)
- **`transition`** — plynulá změna vlastnosti při změně stavu
- **`@keyframes`** — definice animace s víc mezikroky (0% → 100%)
- **`animation`** — aplikace keyframes na element
- **Timing function (easing)** — křivka průběhu rychlosti (`ease`, `linear`, `cubic-bezier`)
- **Iteration count** — počet opakování (`1`, `infinite`)
- **Fill mode** — stav prvku mimo animaci (`forwards`, `backwards`, `both`, `none`)
- **GPU × CPU animace** — transform/opacity jsou GPU (rychlé), width/margin jsou CPU (pomalé)
- **`prefers-reduced-motion`** — přístupnost: uživatel preferuje méně pohybu

---

## Hlavní výklad (5–10 min mluvení)

### 1. CSS Transformace (`transform`)

`transform` mění **tvar, velikost a polohu** prvku **bez ovlivnění layoutu** (ostatní prvky se nepřepočítávají).

#### 2D transformace

| Funkce | Co dělá | Příklad |
|---|---|---|
| `translate(x, y)` | posunutí | `translate(50px, 100px)` |
| `translateX(n)` / `translateY(n)` | posun po jedné ose | `translateY(-20px)` |
| `scale(n)` | změna velikosti | `scale(2)` = 200 %, `scale(0.5)` = 50 % |
| `scaleX(n)` / `scaleY(n)` | scale po jedné ose | |
| `rotate(Ndeg)` | otočení | `rotate(45deg)` po směru hodin |
| `skew(x, y)` | zkřivení | `skewX(20deg)` |

⚠️ **Řetězení transformací:** lze řetězit oddělené mezerou: `transform: translate(50px, 0) rotate(45deg) scale(1.2);`. **POŘADÍ ZÁLEŽÍ** — `rotate` před `translate` je jiný výsledek než opačně.

#### `transform-origin` — bod transformace

Default: **`50% 50%`** (střed prvku). Lze přepsat:
```css
transform-origin: top left;     /* levý horní roh */
transform-origin: 0 0;          /* stejné jako top left */
transform-origin: 100% 100%;    /* pravý dolní roh */
```

Příklad — rotace **kolem levého dolního rohu** (jako kniha otevírání):
```css
transform-origin: bottom left;
transform: rotate(-90deg);
```

#### 3D transformace (bonus)

```css
transform-style: preserve-3d;    /* děti zachovávají 3D prostor */
perspective: 600px;               /* vzdálenost pohledu */
transform: rotateY(180deg);       /* otočení v 3D */
backface-visibility: hidden;      /* skryje "zadní" stranu */
```

Použití: **flip karty** (přední / zadní strana), 3D kostky, perspektiva.

### 2. Přechody (`transition`)

**Plynulá změna vlastnosti** při **změně stavu** (hover, focus, active, přidání třídy přes JS).

#### Vlastnosti `transition-*`

| Vlastnost | Co řídí |
|---|---|
| `transition-property` | které vlastnosti animovat (`all`, `transform`, `color, background`) |
| `transition-duration` | délka přechodu (`0.3s`, `300ms`) |
| `transition-timing-function` | křivka rychlosti (viz níže) |
| `transition-delay` | zpoždění před spuštěním (`0.5s`) |

#### Timing functions (easing)

| Hodnota | Charakter |
|---|---|
| `ease` (default) | pomalý start, rychlý střed, pomalý konec |
| `linear` | konstantní rychlost |
| `ease-in` | pomalý start, rychlý konec |
| `ease-out` | rychlý start, pomalý konec |
| `ease-in-out` | pomalý start + pomalý konec |
| `cubic-bezier(x1, y1, x2, y2)` | vlastní křivka (4 čísla) |
| `steps(n)` | skoková animace v N krocích |

**Pro UX intuice:**
- **Vstupy** (modal otevírá, element přijede): `ease-out` (rychle dorazí, plynule zastaví)
- **Výstupy** (modal zavírá): `ease-in` (pomalu odjede)
- **Obecné mikrointerakce**: `ease` (default)

#### Shorthand `transition`

```css
transition: vlastnost trvani casova-funkce zpozdeni;

/* Příklady */
transition: all 0.3s ease;
transition: background-color 0.2s ease-out;
transition: transform 0.3s, opacity 0.2s;        /* víc přechodů čárkou */
```

#### Co lze a nelze animovat plynule

**Lze:**
- Barvy (color, background-color, border-color)
- Rozměry (width, height, padding, margin)
- `opacity`
- `transform`
- `border-radius`, `box-shadow`
- `font-size`
- Position offsets (top, left, right, bottom)

**Nelze plynule:**
- `display` (skok — `none` ↔ `block`)
- `visibility` (jen `0` ↔ `1`, ale element zabírá místo)
- `background-image` (skok)
- `z-index` (skoky po celých číslech)

⚠️ **Transition se spustí JEN PŘI ZMĚNĚ STAVU** (`:hover`, `:focus`, `:active`, JS přidání třídy). Nelze ho použít pro automatické animace bez interakce — to je `@keyframes`.

### 3. Animace klíčových snímků (`@keyframes` + `animation`)

**Složitější animace** s **více mezikroky**, spouští se **automaticky** bez interakce.

#### Syntax `@keyframes`

```css
@keyframes nazev-animace {
    from {                        /* nebo 0% */
        opacity: 0;
        transform: translateY(-20px);
    }
    to {                          /* nebo 100% */
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Víc mezikroků** přes procenta:
```css
@keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.3); }
    100% { transform: scale(1); }
}
```

#### Aplikace `animation`

```css
.element {
    animation: nazev-animace 2s ease infinite alternate forwards;
    /*         ^^^^^^^^^^^^ ^^ ^^^^ ^^^^^^^^ ^^^^^^^^^ ^^^^^^^^   */
    /*         name       duration easing iterations direction fill-mode */
}
```

#### Vlastnosti `animation-*`

| Vlastnost | Co řídí | Hodnoty |
|---|---|---|
| `animation-name` | název `@keyframes` | jméno (např. `pulse`) |
| `animation-duration` | délka jedné iterace | `2s`, `500ms` |
| `animation-timing-function` | easing | stejné jako u transition |
| `animation-delay` | zpoždění před spuštěním | `0s`, `1s` |
| `animation-iteration-count` | počet opakování | `1`, `3`, **`infinite`** |
| `animation-direction` | směr přehrávání | `normal`, `reverse`, **`alternate`**, `alternate-reverse` |
| `animation-fill-mode` | stav mimo animaci | **`none`** (default), **`forwards`**, `backwards`, `both` |
| `animation-play-state` | běh / pauza | `running`, `paused` |

#### `animation-fill-mode` — kritický koncept

| Hodnota | Co dělá |
|---|---|
| `none` (default) | Po animaci se vrátí do **původního stavu** (jako by se nic nestalo) |
| `forwards` | Po animaci **zůstane v posledním klíčovém snímku** |
| `backwards` | Během `delay` má hodnoty **prvního snímku** (ne původní) |
| `both` | Kombinuje forwards + backwards |

**Klasický use case `forwards`:** prvek slide-in na stránku — chci, aby tam **zůstal** po dokončení, ne aby zmizel zpátky.

```css
@keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.notification {
    animation: slideIn 0.5s ease-out forwards;
}
```

Bez `forwards` by se notifikace **vrátila** na pozici `-100%` po skončení (zmizela vlevo).

#### `animation-direction`

| Hodnota | Pořadí |
|---|---|
| `normal` | from → to (default) |
| `reverse` | to → from |
| `alternate` | from → to → from → to → ... (jako pendlovka) |
| `alternate-reverse` | nejdřív pozpátku |

### 4. `transition` × `@keyframes` — kdy co

| | `transition` | `@keyframes` |
|---|---|---|
| Spuštění | **Změna stavu** (hover, focus, JS) | **Automaticky** (po načtení / dle delay) |
| Mezikroky | Jen **začátek a konec** | Libovolný počet (0–100 %) |
| Opakování | **Nelze** | `iteration-count: infinite` |
| Směr | Vždy A → B (jednorázově) | normal/reverse/alternate |
| Stav po skončení | Vrátí se zpět při změně stavu zpět | Řídí `fill-mode` |
| Použití | Hover efekty, mikrointerakce | Loadery, slide-iny, složité animace |

**Pravidlo palce:**
- *"Reagují na akci uživatele?"* → `transition`
- *"Běží samy?"* → `@keyframes`

### 5. Výkon — GPU × CPU

**GPU vlastnosti** (rychlé, nezatěžují CPU):
- `transform: translate/rotate/scale/skew`
- `opacity`

Tyhle **nespouštějí reflow** (přepočet layoutu) ani repaint. Kompositing na GPU.

**CPU vlastnosti** (pomalé, zatěžují CPU):
- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom`
- `font-size`

Tyhle **spouštějí reflow** — browser přepočítává polohu všech ostatních prvků.

**Pravidlo:** *"Animuj jen `transform` a `opacity`."* Místo `width: 100px → 200px` použij `transform: scaleX(2)`. Místo `top: 0 → 50px` použij `transform: translateY(50px)`.

#### `will-change` (hint pro browser)

```css
.element {
    will-change: transform, opacity;
}
```

Říká browseru *"chystám se animovat tohle, připrav GPU vrstvu"*. **Nepřežij** — moc `will-change` zpomalí stránku.

### 6. Přístupnost — `prefers-reduced-motion`

**Někteří uživatelé mají v OS zapnutou možnost omezit pohyb** (epilepsie, kinetóza, ADHD). Respektuj to:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

**Best practice** — vždy zahrň. Komise to může pichnout *"co s přístupností u animací?"*.

Alternativa: zachovat základní transition, ale **vypnout keyframes**:
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Konkrétní příklady / kód

### Hover karta — zvedne se
```css
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
```

### Spinner — nekonečné rotace
```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ccc;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### Notifikace — slide-in s delay, zůstane na místě
```css
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification {
    animation: slideIn 0.5s ease-out 0.5s forwards;
    /*                              ^^^^ delay 0.5s   */
    /*                                   ^^^^^^^^ zůstane na místě */
    opacity: 0;                   /* skrytá před začátkem (kvůli delay) */
}
```

⚠️ **Bez `opacity: 0` na startu** by notifikace **blikla** v původní pozici během delay (před animací). `forwards` ji pak v `to` stavu nechá.

### Tlačítko — hover + active
```css
.btn {
    background: #3498db;
    color: white;
    padding: 0.8rem 1.5rem;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.btn:hover {
    background: #2980b9;
}

.btn:active {
    transform: scale(0.95);       /* stisk dolů */
}
```

### Flip karta (3D)
```css
.card-wrapper {
    perspective: 1000px;
}
.card {
    position: relative;
    width: 200px;
    height: 300px;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;
}
.card:hover {
    transform: rotateY(180deg);
}
.card-front, .card-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
}
.card-back {
    transform: rotateY(180deg);
}
```

### Pulzující tlačítko (pozornost)
```css
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,152,219,0.7); }
    70%      { box-shadow: 0 0 0 15px rgba(52,152,219,0); }
}

.btn-pulse {
    animation: pulse 2s ease-out infinite;
}
```

### Více animací současně
```css
.element {
    animation:
        spin 2s linear infinite,
        colorChange 4s ease-in-out infinite alternate;
}
```

---

## Vztahy / kontrasty

- **`transform` × `position`** — `transform` nepřepočítává layout (GPU). `position` (top/left změna) přepočítává (CPU). Pro animaci pohybu **vždy `transform: translate`**, ne `top/left`.
- **`transition` × `@keyframes`** — transition na akci, keyframes samostatně. Často kombinujem: keyframes pro loader, transition pro hover.
- **`animation-iteration-count: infinite` × `transition`** — transition nemůže opakovat. Pokud potřebuješ infinite, **musí to být keyframes**.
- **`forwards` × `none` (fill-mode)** — `none` se po animaci vrátí do CSS výchozího stavu, `forwards` zůstane v posledním frame.
- **GPU × CPU vlastnosti** — `transform/opacity` GPU, `width/height/top/left` CPU. Pro performance vždy první.
- **`will-change` × bez něj** — `will-change` připraví GPU vrstvu, ale **nepřežij**. Použij **jen** na elementu, který opravdu animuješ.

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi `transition` a `@keyframes`?
**A:** **`transition`** spouští plynulou změnu vlastnosti **při změně stavu** (hover, focus, JS přidání třídy). Jen 2 stavy: před a po. **`@keyframes`** definuje animaci s **víc mezikroky** (0 %, 50 %, 100 %), spouští se **automaticky** bez interakce, lze ji **opakovat infinite**, měnit směr (alternate). Transition pro hover efekty, keyframes pro loadery a slide-iny.

**Q:** Vyjmenuj timing funkce a uveď kdy které.
**A:** **`ease`** (default — pomalý start, rychlý střed, pomalý konec). **`linear`** (konstantní rychlost). **`ease-in`** (pomalý start, rychlý konec). **`ease-out`** (rychlý start, pomalý konec). **`ease-in-out`** (pomalý start + konec). **`cubic-bezier(x1,y1,x2,y2)`** (vlastní křivka). **Vstupy:** ease-out (přijíždí plynule). **Výstupy:** ease-in (odjíždí pomalu).

**Q:** Co dělá `animation-fill-mode: forwards` a kdy ho použiješ?
**A:** Po dokončení animace **prvek zůstane v posledním klíčovém snímku** (z `to` nebo `100%`). Bez něj se vrátí do **původního CSS stavu**. Klasický use case: **slide-in notifikace** — chci, aby zůstala viditelná, ne aby zmizela zpátky.

**Q:** Proč animovat `transform` a `opacity` místo `width` a `top`?
**A:** **`transform` a `opacity` běží na GPU** — nespouštějí reflow (přepočet layoutu). Browser tyto vlastnosti **kompozituje** na GPU vrstvě. **`width`, `height`, `top`, `left`** běží na CPU — spouštějí reflow, browser přepočítává polohu všech ostatních prvků. Pro plynulé 60 FPS animace **vždy `transform` a `opacity`**.

**Q:** Co je `transform-origin` a co je jeho default?
**A:** **Bod, kolem kterého se transformace aplikuje**. Default je **střed prvku** (`50% 50%`). Lze nastavit na `top left`, `0 0`, `100% 100%` atd. Použití: rotace kolem rohu (jako otevírající se kniha), scale od levého okraje.

**Q:** Vyjmenuj 2D transformace.
**A:** **`translate(x, y)`** (posunutí), **`scale(n)`** (změna velikosti), **`rotate(Ndeg)`** (otočení), **`skew(x, y)`** (zkřivení). Lze je řetězit oddělené mezerou: `transform: translate(50px, 0) rotate(45deg) scale(1.2)`.

**Q:** Co se stane, když prvek má `animation` ale není definovaný `@keyframes` se stejným jménem?
**A:** Animace **se nespustí**, prvek zůstane v výchozím stavu. Browser nevyhodí chybu, jen mlčky ignoruje. Klasický bug — překlep v názvu.

**Q:** Jak ošetříš animace pro přístupnost?
**A:** Přes **`@media (prefers-reduced-motion: reduce)`** — uživatel má v OS zapnutou možnost omezit pohyb (epilepsie, kinetóza). V tomto media query vypnu animace:
```css
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
}
```
Komise to oceňuje jako známku, že **myslím i na uživatele se speciálními potřebami**.

**Q:** Jak udělat nekonečnou animaci?
**A:** **Jen přes `@keyframes`** s `animation-iteration-count: infinite`. **Transition nemůže opakovat** — je vždy jednorázová (A → B při změně stavu).

**Q:** Co je rozdíl mezi `animation: spin 1s linear infinite` a stejnou věcí přes transition?
**A:** **Transition by tohle vůbec nezvládla.** Transition reaguje na **změnu stavu**, ne na čas. Pro nekonečné, automaticky spouštěné animace jako spinner **musíš použít keyframes**.

---

## Co bych ještě měl vědět (volně)

- **`animation-play-state: paused`** — pauza animace přes JS / CSS hover (např. zastavit hudbu na hover).
- **Více animací současně** — oddělené čárkou: `animation: spin 2s linear infinite, colorShift 4s ease-in-out infinite alternate;`.
- **JS přidání třídy** spustí transition (klasický trigger v moderním web vývoji).
- **`@property`** (moderní 2022+) — definice animovatelných custom properties s typem (advanced).
- **Web Animations API** v JS — alternativa CSS animací, programatický přístup.
- **CSS Spring** v moderním Safari — fyzicky inspirovaná timing function.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Materiál v `_materials/dat/06/spoluzaci-nezarucene/` je "šedé"** — učitel ho zamítl, **pravděpodobně kvůli typům a chybějícím code blokům** v DOCX (např. *"umóží"*, *"stvìdě"*, prázdné sekce). **Obsah byl ale solidní** — pokrývá transformace, transitions, keyframes, performance, prefers-reduced-motion. **Tento zápisek je vyčištěná verze** + doplněno z MDN-úrovně znalostí.
- ⚠️ **3D transformace** (`perspective`, `rotateY`, `preserve-3d`) byly v původním materiálu, ale komise se na ně zřídka ptá hluboce. Drž je jako *"existují a fungují tak, že..."*.
- ⚠️ **`@scroll-timeline` a moderní scroll-driven animations** — moc nové, ne v maturitě.

---

## Praktická příprava (pro 30 min u PC)

**Hlavní úloha** v `_practice/dat6-animace/` (kopie z assignment): 5 úkolů na **portfoliové stránce s produkty**:

1. **Hover karty** — zvedne se při najetí (transform + transition)
2. **Spinner** — nekonečná rotace loaderu (@keyframes + animation)
3. **Notifikace** — slide-in s delay, zůstane (animation + forwards)
4. **Tlačítko** — hover + active states (transition)
5. **Přístupnost** — prefers-reduced-motion media query

⚠️ **HTML nesahej**, pracuješ **jen v `style.css`**. Plný popis v `README.md`.

---

## Status

- **Sebehodnocení (před):** 2/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-11
