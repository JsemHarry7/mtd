---
subject: SWI
number: 16
title: "CSS kaskáda"
tags: ["web", "css", "frontend"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **CSS Kaskáda** je mechanismus, kterým browser **rozhoduje, který CSS pravidlo vyhraje**, když na ten samý element míří více konfliktních deklarací. Vítězné pravidlo se vybírá podle tří faktorů: **původ** (kdo styl definoval), **specificita** (jak "přesný" je selektor) a **pořadí** (které pravidlo je v kódu později). V této otázce projdu **kaskádový algoritmus, selektory a jejich specificity, kombinátory, pseudo-třídy, @media queries, kaskádové vrstvy `@layer` a konvence BEM** pro udržení nízké specificity.

---

## Klíčové pojmy

- **Kaskáda (Cascade)** — algoritmus, kterým browser řeší konflikty mezi CSS deklaracemi
- **Specificita** — číselné ohodnocení selektoru, vyjadřuje "přesnost" výběru elementu
- **Selektor** — vzor, který vybírá elementy v DOMu, na které se aplikuje pravidlo
- **Kombinátor** — znak mezi dvěma selektory definující jejich vztah (potomek, dítě, sourozenec)
- **Pseudo-třída** — vybírá elementy podle **stavu** nebo **pozice** (`:hover`, `:nth-child`)
- **Pseudo-element** — styluje **část elementu** nebo **generovaný obsah** (`::before`, `::first-letter`)
- **`!important`** — flag, který přebíjí standardní kaskádu
- **`@media`** — pravidlo pro podmíněné aplikování CSS (responzivita)
- **`@layer`** — kaskádové vrstvy, řízení priority napříč skupinami pravidel
- **BEM** — konvence pojmenování (Block, Element, Modifier) pro izolaci a nízkou specificitu

---

## Hlavní výklad (5–10 min mluvení)

### 1. Tři faktory, které rozhodují vítěze

Když na jeden element míří víc konfliktních deklarací, browser je **seřadí** podle:

1. **Původ (Origin)** — odkud styl pochází
2. **Specificita** — jak "přesný" je selektor
3. **Pořadí (Source Order)** — které pravidlo je v kódu **později**

Pravidla se vyhodnocují **v tomhle pořadí**: nejdřív se podívá na původ, pak na specificity, a teprve když jsou shodné, vyhraje **později definované**.

### 2. Původ stylů — 5 priorit (od nejnižší)

| Priorita | Origin | Popis |
|---|---|---|
| 1 (nejnižší) | **User Agent** | výchozí styly prohlížeče (`<h1>` velký, `<a>` modrá podtržená) |
| 2 | **Author** | tvé standardní CSS pravidla |
| 3 | **User** | uživatelské styly (z rozšíření prohlížeče, accessibility) |
| 4 | **Author `!important`** | tvé pravidla s `!important` |
| 5 (nejvyšší) | **User `!important`** | uživatelská `!important` (přístupnost má přednost) |

⚠️ **Klíčová past:** `!important` **otáčí pořadí** v rámci priority User vs Author — bez `!important` Author > User, **s** `!important` User > Author. Důvod: uživatel se zdravotním omezením musí mít možnost přepsat developera.

### 3. Specificita — číselný systém `(a, b, c, d)`

Specificita se počítá jako čtyřprvkový tuple `(inline, ID, třída, element)`:

| Selektor | Znak | Specificita | Příklad |
|---|---|---|---|
| **Inline styl** | `style="..."` v HTML | `(1, 0, 0, 0)` | `<div style="color: red">` |
| **ID** | `#` | `(0, 1, 0, 0)` | `#menu` |
| **Třída / atribut / pseudo-třída** | `.` / `[]` / `:` | `(0, 0, 1, 0)` | `.btn`, `[type="text"]`, `:hover` |
| **Element / pseudo-element** | název / `::` | `(0, 0, 0, 1)` | `p`, `::before` |
| **Univerzální** | `*` | `(0, 0, 0, 0)` | `*` |

**Porovnání specificit:** porovnává se zleva doprava. Vyhraje **vyšší číslo v nejvyšším řádu** — ID vždy vyhraje nad libovolným počtem tříd, třída nad libovolným počtem elementů.

**Příklad:**
```css
#hlavni .btn      → (0, 1, 1, 0)
.btn.large        → (0, 0, 2, 0)
div .btn          → (0, 0, 1, 1)
```

`#hlavni .btn` vyhraje, protože má **1 ID** (řád b), zatímco ostatní nemají žádné.

⚠️ `!important` **NENÍ** součást specificity — má vlastní vyšší prioritu nad celou specificitou.

### 4. Selektory v hloubce

#### Kombinátory (vztah mezi selektory)

| Kombinátor | Znak | Příklad | Význam |
|---|---|---|---|
| Potomka | mezera | `div p` | všechny `<p>` uvnitř `<div>` (libovolně hluboko) |
| Dítěte | `>` | `ul > li` | jen **přímé** `<li>` v `<ul>` |
| Přímý sourozenec | `+` | `h1 + p` | první `<p>` přímo po `<h1>` na stejné úrovni |
| Obecný sourozenec | `~` | `h1 ~ p` | všechny `<p>` po `<h1>` na stejné úrovni |

**Specificita kombinovaného selektoru** = **součet** specificit jednotlivých selektorů.

#### Atributové selektory

| Selektor | Význam |
|---|---|
| `[hidden]` | element má atribut `hidden` (bez ohledu na hodnotu) |
| `[type="email"]` | hodnota se **přesně** rovná |
| `[href^="https"]` | hodnota **začíná** "https" |
| `[href$=".pdf"]` | hodnota **končí** ".pdf" |
| `[class*="icon-"]` | hodnota **obsahuje** "icon-" kdekoli |
| `[class~="aktivni"]` | hodnota obsahuje "aktivni" jako **samostatné slovo** v seznamu |

#### Pseudo-třídy (`:`) — stav nebo pozice

```css
a:hover         /* myš nad odkazem */
input:focus      /* aktivní vstupní pole */
button:active    /* tlačítko právě stisknuté */
li:first-child   /* první <li> mezi sourozenci */
li:nth-child(2n) /* každé sudé <li> */
:not(#hlavni)    /* cokoli, co NENÍ #hlavni */
:root            /* kořenový element <html> */
:empty           /* element bez obsahu */
```

**Specificita pseudo-třídy** = `(0, 0, 1, 0)` (jako třída). Výjimka: `:not(...)` **dědí specificitu** ze svého obsahu (`:not(#id)` má specificitu `(0, 1, 0, 0)`).

#### Pseudo-elementy (`::`) — část elementu nebo generovaný obsah

```css
p::first-letter   /* první písmeno odstavce */
p::first-line     /* první řádek */
::selection        /* uživatelem vybraný text */

.button::before {
    content: "→ ";    /* generovaný obsah PŘED elementem */
}
.button::after {
    content: " ←";    /* generovaný obsah ZA elementem */
}
```

⚠️ **`::before` a `::after` vyžadují `content` vlastnost**, jinak nic nezobrazí (i prázdná `content: "";` stačí pro vizuální triky).

**Specificita pseudo-elementu** = `(0, 0, 0, 1)` (jako element).

### 5. `@media` queries — responzivita

Pravidlo `@media` aplikuje CSS **podmíněně** podle vlastnosti zařízení nebo prostředí. **Specificitu pravidel uvnitř NEMĚNÍ**.

```css
@media (max-width: 600px) {
    .menu { flex-direction: column; }
}
```

**Klíčové media features:**

| Vlastnost | Příklad | Popis |
|---|---|---|
| `width` / `height` | `(max-width: 600px)` | šířka/výška viewportu |
| `orientation` | `(orientation: landscape)` | šířka × výška |
| `prefers-color-scheme` | `(prefers-color-scheme: dark)` | preferované téma uživatele |
| `prefers-reduced-motion` | `(prefers-reduced-motion: reduce)` | uživatel nechce animace (přístupnost) |
| `display-mode` | `(display-mode: standalone)` | běžící jako PWA × normální browser |
| `print` (typ média) | `@media print { ... }` | jen pro tisk |

**Logické operátory:**

```css
@media (min-width: 768px) and (orientation: landscape) { ... }   /* obojí */
@media not screen and (color) { ... }                              /* negace */
@media screen, print { ... }                                       /* OR (čárka) */
```

### 6. `@layer` — kaskádové vrstvy (moderní řešení izolace)

`@layer` poskytuje **novou dimenzi priorit**, která **přebíjí specificitu** uvnitř vrstev. Vrstva deklarovaná **později** v seznamu má **vyšší prioritu** — bez ohledu na specificity selektorů uvnitř.

```css
/* Definuj a seřaď vrstvy (zleva = nejnižší priorita) */
@layer reset, base, components, utilities;

@layer base {
    div { padding: 10px; }                  /* specificita 0,0,0,1 */
}

@layer components {
    .card { padding: 0; }                    /* specificita 0,0,1,0 */
}
```

V tomto příkladu **vrstva `components` přebíjí `base`**, takže `.card` má `padding: 0;` i bez vyšší specificity. Bez `@layer` by `div` (později v kódu nebo stejně specifický) mohl `card` přebít.

**Pořadí priority:**
1. Pravidla **mimo** vrstvy (nejvyšší ze standardních)
2. Pozdější vrstva > dřívější vrstva
3. Uvnitř vrstvy: standardní specificita

**K čemu:** drží **nízkou předvídatelnou specificity** napříč velkým projektem. Bez `@layer` se v týmu hromadí ID selektory a `!important` jako **specificity wars**.

### 7. BEM — konvence pojmenování (izolace)

⚠️ *(Doplněno z obecných znalostí — ve validovaných materiálech není.)*

**BEM = Block, Element, Modifier** — naming convention, kterou vymyslel Yandex pro **udržení nízké a předvídatelné specificity**.

```html
<!-- Block — samostatná komponenta -->
<div class="card">
    <!-- Element — část bloku, "card__"  -->
    <h3 class="card__title">Název</h3>
    <p class="card__text">Text</p>
    <button class="card__button card__button--primary">Klik</button>
                       <!-- Modifier — varianta, "block--" nebo "element--" -->
</div>
```

**Pravidla BEM:**
- **Block** = nezávislá entita (`card`, `menu`, `form`)
- **Element** = část bloku, **NEexistuje samostatně** (`card__title`, `menu__item`) — dvojité podtržení
- **Modifier** = varianta (`button--primary`, `card--featured`) — dvojitá pomlčka

**Proč BEM:**
1. **Plochá specificita** — všechno jsou jen třídy `(0,0,1,0)`. Žádný kombinátor `.card .title .icon` se specificitou `(0,0,3,0)`.
2. **Žádné konflikty** — `card__title` je unikátní jméno, nemůže kolidovat s `menu__title`.
3. **Self-documenting** — z názvu třídy vidíš, kam patří.

**Alternativy:** SMACSS, OOCSS, ITCSS, Tailwind utility-first. BEM je nejzákladnější a nejčastěji vyučovaná.

---

## Konkrétní příklady / kód

### Konflikt řešený specificitou
```css
p { color: black; }              /* (0, 0, 0, 1) */
.text { color: blue; }            /* (0, 0, 1, 0) */
#hlavni { color: red; }           /* (0, 1, 0, 0) */
```
```html
<p id="hlavni" class="text">Tady jsem.</p>
```
**Výsledek: červená.** Specificita ID vyhrává.

### `!important` přebije specificitu
```css
p { color: green !important; }   /* (0, 0, 0, 1) + !important */
#hlavni { color: red; }           /* (0, 1, 0, 0) */
```
**Výsledek: zelená.** `!important` přebíjí kaskádu (kromě User !important).

### Kombinátor specificity
```css
.menu a { color: blue; }          /* (0, 0, 1, 1) */
a { color: red; }                  /* (0, 0, 0, 1) */
```
Odkaz uvnitř `.menu` bude **modrý**, ostatní červené.

### Pseudo-třída a pseudo-element
```css
a:hover { color: orange; }                       /* :hover = třída */
a::before { content: "→ "; color: gray; }        /* ::before = element */
```

### @media s logickým operátorem
```css
@media (min-width: 768px) and (max-width: 1199px) {
    /* tablety */
    .container { width: 90%; }
}
```

### BEM struktura
```html
<button class="btn btn--primary btn--large">Klik</button>
```
```css
.btn { padding: 0.5rem 1rem; }
.btn--primary { background: blue; color: white; }
.btn--large { font-size: 1.5rem; }
```

---

## Vztahy / kontrasty

- **Specificita × Pořadí** — když je specificita stejná, vyhraje **později definované**. Proto je `<link rel="stylesheet">` **na konci `<head>`** (po normalizačních CSS) standardní praxe.
- **`!important` × `@layer`** — obojí jsou nástroje proti specificity wars. `!important` je **nuclear option** (těžko se odpřísahá), `@layer` je **architektonický** (předvídatelný od začátku). Moderní praxe: `@layer` ano, `!important` jen pro výjimky (např. utility classes v Tailwindu).
- **Inline styl × CSS** — inline má specificity `(1, 0, 0, 0)`, **přebije** všechno bez `!important`. Proto se inline styly **vyhýbat** kromě specifických případů (JS-generated, e-mailové šablony).
- **Pseudo-třída `:` × Pseudo-element `::`** — dvojí dvojtečka u elementů je rozlišení, **CSS3 standard**. Starší syntax (`:before`) je legacy. **Pro maturitu používej `::`**.
- **Třída × ID** — třída pro styling, ID pro **JS / kotvu / form**. **Vyhýbej se ID v CSS** — ničí specificity.

---

## Časté otázky komise

**Q:** Jaké tři faktory rozhodují o vítězném CSS pravidle?
**A:** Původ (origin — kdo styl definoval), specificita (jak "přesný" je selektor) a source order (které pravidlo je v kódu později). Vyhodnocují se v tomto pořadí — pořadí rozhoduje až při shodě v původu i specificitě.

**Q:** Co je specificita a jak se počítá?
**A:** Číselné ohodnocení selektoru, vyjadřuje jeho prioritu. Počítá se jako čtveřice `(inline, ID, třída, element)`. Inline = (1,0,0,0), ID = (0,1,0,0), třída/atribut/pseudo-třída = (0,0,1,0), element/pseudo-element = (0,0,0,1). Porovnává se zleva doprava — vyšší řád vyhrává.

**Q:** Vyjmenuj kombinátory v CSS a co znamenají.
**A:** Mezera (potomek, libovolně hluboko), `>` (přímé dítě), `+` (přímý sourozenec), `~` (obecný sourozenec).

**Q:** Jaký je rozdíl mezi pseudo-třídou a pseudo-elementem?
**A:** Pseudo-třída `:` vybírá elementy podle stavu/pozice (`:hover`, `:first-child`). Pseudo-element `::` styluje část elementu nebo generovaný obsah (`::before`, `::first-letter`). Specificita: pseudo-třída jako třída (0,0,1,0), pseudo-element jako element (0,0,0,1).

**Q:** Co dělá `!important` a kdy ho použít?
**A:** Přebíjí standardní kaskádu — pravidlo s `!important` vyhrává nad libovolnou specificitou. Použít jen jako **poslední možnost** — typicky utility classes (Tailwind), override třetí strany, nebo specifické přístupnostní úpravy. V architektonickém kódu vyhnout, používat `@layer` místo toho.

**Q:** Jaký je rozdíl mezi `(min-width: 768px)` a `(max-width: 768px)`?
**A:** `min-width` = pravidlo platí, **když je viewport šíří 768 px nebo větší** (typicky pro **mobile-first** přístup — desktop styly v media query). `max-width` = pravidlo platí **do 768 px** (typicky pro mobilní override desktop verze).

**Q:** Co je BEM a proč ho používáme?
**A:** Naming convention (Block, Element, Modifier), která drží specificitu nízkou a předvídatelnou. Block = komponenta (`card`), Element = část (`card__title`), Modifier = varianta (`card--featured`). Důsledek: všechny CSS pravidla jsou jen třídy se specificitou `(0,0,1,0)` — žádné kombinátorové wars, žádné konflikty.

**Q:** K čemu slouží `@layer`?
**A:** Kaskádové vrstvy poskytují novou dimenzi priorit nad rámec specificity. Vrstvy se deklarují v pořadí, pozdější má vyšší prioritu, **bez ohledu na specificity selektorů uvnitř**. Moderní řešení specificity wars v rozsáhlých projektech.

---

## Co bych ještě měl vědět (volně)

- **`:focus-visible`** — moderní pseudo-třída, která se aktivuje **jen při klávesnicovém focusu**, ne při kliku myší. Přístupnost (a11y).
- **`:has(...)`** — "rodičovský selektor" (dlouho neexistoval). `div:has(> img)` = `<div>` který má jako přímé dítě `<img>`. Nový, ale komise se nemusí ptát.
- **Custom properties (CSS variables)** — `--main-color: #1b7f5f;` deklarováno v `:root`, použité přes `var(--main-color)`. **Specificita custom properties** — patří k tématu, ale je pokročilé.
- **Container queries** — alternativa k `@media`, podle velikosti **rodičovského kontejneru**, ne celého viewportu. Modernější, mladší specifikace.
- **Reset CSS / Normalize** — buď browserové defaults vynulovat (reset), nebo sjednotit napříč browsery (normalize). Standardně se používá Normalize.css nebo CSS reset jako Eric Meyer's.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **BEM v xlsx Popisu, ale NENÍ ve validovaných materiálech.** Doplněno z obecných znalostí. Pokud učitel chce **konkrétní variantu BEM** (např. dvojitá pomlčka × dvojité podtržení × varianta), tato verze odpovídá **klasické BEM od Yandex**. Existují varianty (CamelCase pro modifier, atd.).
- ⚠️ **`:where(...)` a `:is(...)`** — moderní pseudo-třídy s nulovou nebo dědičnou specificitou. Komise se nemusí ptát, ale jsou součástí moderní CSS specifikace.
- ⚠️ **Animace a keyframes** patří spíš k DAT 6 (CSS animace), ne k SWI 16. Pokud se komise zeptá *"jak udělat animaci?"* — odkaž, že to je **DAT 6** detail, nebo zmiň `@keyframes` jako podmínkovou součást.
- ⚠️ **`@scope`** — nová v CSS Cascade Layers spec, řeší izolaci stylu na podstrom DOMu. Velmi nová, browser support omezený. **Nezmiňuj jako hlavní, jen jako "moderní vývoj"** kdyby se otevřela debata o izolaci.

---

## Status

- **Sebehodnocení (před):** 3/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-09
