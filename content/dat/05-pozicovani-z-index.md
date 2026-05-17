---
subject: DAT
number: 5
title: "Pozicování prvků a z-index"
tags: ["web", "css", "frontend", "layout"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **CSS pozicování** přes vlastnost `position` určuje, **jak se prvek chová v dokumentovém toku** a **kam se vykresluje**. Existuje **5 hlavních hodnot:** `static` (default — normální tok), `relative` (zůstává v toku, lze posunout), `absolute` (vytržen z toku, pozicuje se vůči nejbližšímu pozicovanému rodiči), `fixed` (vytržen z toku, vůči viewportu), `sticky` (hybrid relative + fixed). Pro vrstvení překrývajících se prvků slouží **`z-index`** — funguje pouze na **pozicovaných prvcích**. Hloubku komplikuje **stacking context** — z-index není globální, platí v rámci svého kontextu. K obtékání textem se historicky používal **`float`**, dnes nahrazen Flexboxem/Gridem (zůstal pro text wrap kolem obrázku).

---

## Klíčové pojmy

- **`position`** — CSS vlastnost určující způsob pozicování
- **Normal flow (normální tok)** — výchozí chování, prvky jdou za sebou jak v HTML
- **Out of flow (vytržení z toku)** — prvek je ignorován ostatními, jako by neexistoval
- **Top / right / bottom / left** — offset vlastnosti pro posun pozicovaných prvků
- **`z-index`** — pořadí překryvu na ose Z (hloubka)
- **Stacking context** — izolovaná oblast pro porovnávání z-index
- **`float`** — historický mechanismus pro obtékání, dnes hlavně pro text + obrázek
- **`clear`** — zrušení obtékání (text/element se posune pod plovoucí prvek)
- **Modální okno (modal)** — překryv obsahu pro dialog, typicky `position: fixed`
- **Sticky header** — hlavička, která se "přilepí" při scrollu

---

## Hlavní výklad (5–10 min mluvení)

### 1. `position` — 5 hodnot

#### 1.1 `static` (default)
- Prvek je v **normálním toku** dokumentu
- **Ignoruje** `top`, `right`, `bottom`, `left`, `z-index`
- Prvky se řadí za sebe podle HTML

```css
.element {
    position: static;   /* default — vlastně nepotřeba psát */
}
```

#### 1.2 `relative`
- Zůstává v **normálním toku** (původní místo **rezervováno**)
- Lze ho **posunout** přes `top`/`right`/`bottom`/`left` **od původní pozice**
- **Hlavní využití:** kotva (referenční bod) pro pozicování vnořených `absolute` prvků

```css
.parent {
    position: relative;        /* kotva pro absolutní děti */
}
.child {
    position: absolute;
    top: 10px;                 /* posune se vůči rodiči */
    right: 10px;
}
```

#### 1.3 `absolute`
- **Vytržen z toku** — ostatní prvky se chovají, jako by neexistoval
- Pozicuje se vůči **nejbližšímu pozicovanému předkovi** (= ten, který má `position` jinou než `static`)
- Pokud takový předek neexistuje, vztahuje se k **`<body>`** (resp. viewport)

**Klasický pattern: relative + absolute**
```html
<div class="card">
    <span class="badge">SLEVA</span>
    <h3>Produkt</h3>
</div>
```
```css
.card {
    position: relative;        /* kotva */
}
.badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
}
```
**Štítek "SLEVA" se vždy umístí v pravém horním rohu karty**, bez ohledu na obsah karty.

#### 1.4 `fixed`
- **Vytržen z toku**
- Pozicuje se vůči **viewportu** (okno prohlížeče)
- **Zůstává na místě při scrollu** — typicky modal, cookie lišta, top bar

```css
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);   /* dokonalé centrování */
}
```

⚠️ **Past `transform: translate(-50%, -50%)`** — `top: 50%` posune **levý horní roh** prvku do středu viewportu, ne celý prvek. `transform` ho pak posune o **polovinu jeho vlastní velikosti** zpět, takže střed prvku je teď ve středu viewportu.

#### 1.5 `sticky`
- **Hybrid mezi `relative` a `fixed`**
- Chová se jako **relativní**, dokud scrollování nedosáhne určené hranice (např. `top: 0`)
- Pak se **"přilepí"** a chová se jako **fixed**, dokud rodič neopustí viewport

```css
header {
    position: sticky;
    top: 0;                    /* přilepí se nahoru po scroll */
}
```

⚠️ **Omezení `sticky`:**
- Pohybuje se **jen v rámci rodičovského kontejneru** — když rodič odjede, sticky odjede s ním
- Rodič **NESMÍ mít `overflow: hidden`** nebo `overflow: scroll`, jinak sticky nefunguje
- Rodič musí mít **definovanou výšku** nebo obsah

### 2. Shrnutí — kdy co použít

| Hodnota | V toku? | Vůči čemu | Typický use case |
|---|---|---|---|
| `static` | ano | normální tok | default, nepotřebuje řešení |
| `relative` | ano | sama sebe (původní pozice) | drobné posunutí + kotva pro absolute dětí |
| `absolute` | **ne** | nejbližší pozicovaný předek | štítky, dropdowny, tooltipy |
| `fixed` | **ne** | viewport | modal, cookie lišta, sticky bottom bar |
| `sticky` | ano (do hranice) | nejbližší scroll kontejner | navigace, table header |

### 3. `float` — historie a dnešní použití

**`float`** byl **původně určen pro obtékání textem kolem obrázku** (jako v časopise).

```css
.float-image {
    float: left;
    margin-right: 1rem;
    margin-bottom: 1rem;
}
```

Text obteče obrázek vlevo.

**Historicky** se `float` zneužíval pro **layout** (sloupce stránky). Dnes je **nahrazen Flexboxem a Gridem**.

**Hlavní problém float:** rodič **zhroutí svou výšku**, pokud obsahuje **jen plovoucí prvky**. Řešení:
- **clearfix** (starý hack): pseudo-element `::after { content: ""; display: block; clear: both; }`
- **modernější:** `overflow: hidden` nebo `display: flow-root` na rodiči

**`clear` vlastnost** — zruší obtékání:
- `clear: left` — prvek se posune **pod** plovoucí prvky vlevo
- `clear: right` — totéž pro pravé
- `clear: both` — pod oba typy

### 4. Z-index a stacking context

#### Z-index — pořadí překryvu

Když se prvky **překrývají**, browser musí rozhodnout, který je nahoře. K tomu slouží **`z-index`** — číselná hodnota:

- **Vyšší číslo = blíž k uživateli** (překrývá ostatní)
- **Záporné číslo = pod ostatní** (skryje se za)
- Funguje **POUZE** na prvcích s `position` jinou než `static` (nebo dětech flex/grid kontejneru)

```css
.layer-1 { z-index: 1; }
.layer-2 { z-index: 10; }    /* nad layer-1 */
.layer-3 { z-index: -1; }    /* pod ostatní */
```

⚠️ **Z-index nefunguje na `position: static`** — typická past. Pokud chceš měnit pořadí, **musíš element pozicovat** (typicky `relative`).

#### Stacking context — izolovaný kontext

**`z-index` není globální pro celou stránku.** Platí v rámci svého **stacking contextu**.

**Stacking context vzniká** např. u:
- prvku s `position: absolute/relative/fixed/sticky` **+ nastaveným `z-index`**
- prvku s **`opacity` < 1**
- prvku s **`transform`**, **`filter`**, **`will-change`**
- prvku s **`position: fixed`** (vždy)
- root prvku (`<html>`)

**Důsledek:** prvek s `z-index: 9999` uvnitř kontextu A se může schovat **pod** prvek s `z-index: 1` z kontextu B, pokud je kontext B **v hierarchii výše**.

```html
<div class="A" style="position: relative; z-index: 1;">
    <div class="A-inner" style="position: relative; z-index: 9999;">9999 ale jen v A</div>
</div>
<div class="B" style="position: relative; z-index: 2;">2, ale překrývá A-inner</div>
```

`.A-inner` má `z-index: 9999`, ale celé `.A` má jen `z-index: 1`. `.B` s `z-index: 2` přebíjí celé A i s vnitřním 9999.

**Mantra:** *"Z-index porovnává jen sourozence ve stejném stacking contextu."*

### 5. Klasické patterny

#### Sticky header
```css
header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;    /* aby překryl obsah pod sebou při scroll */
}
```

#### Karta + štítek
```css
.card {
    position: relative;    /* kotva */
}
.badge {
    position: absolute;
    top: -10px;            /* mírně přesahuje ven */
    right: -10px;
    background: red;
    color: white;
}
```

#### Modal (vycentrované okno)
```css
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.overlay {
    position: fixed;
    inset: 0;              /* zkratka pro top/right/bottom/left: 0 */
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}
```

#### Floating image v textu
```css
.float-image {
    float: left;
    width: 200px;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
}
```

#### Cookie banner vpravo dole
```css
.cookie-banner {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;          /* nad vším */
}
```

---

## Vztahy / kontrasty

- **`relative` × `absolute`** — relative zůstává v toku, absolute z něj vytržen. Páruje se: `relative` rodič jako kotva pro `absolute` dítě.
- **`absolute` × `fixed`** — absolute se kotví **rodiči**, fixed **viewportu**. Při scrollu absolute scrolluje s obsahem, fixed zůstává na místě.
- **`fixed` × `sticky`** — fixed je **trvale** přilepený, sticky se **přilepí jen u hranice** a chová se jako relative jindy.
- **Flexbox/Grid × position** — Flexbox/Grid pro **layout** (uspořádání více prvků), position pro **vrstvení** a **vytržené prvky** (modaly, štítky, sticky bary).
- **`float` × moderní layout** — float jen pro **obtékání textem**, ne pro layout sloupců (to dnes Flexbox/Grid).
- **`z-index` × stacking context** — z-index **uvnitř** kontextu rozhoduje pořadí, **mezi** kontexty rozhoduje pořadí jejich rodičů.

---

## Časté otázky komise

**Q:** Vyjmenuj všechny hodnoty CSS `position` a stručně popiš.
**A:** **`static`** (default, normální tok, ignoruje top/left), **`relative`** (v toku, lze posunout od původní pozice + kotva pro absolute děti), **`absolute`** (vytržen z toku, kotví se nejbližšímu pozicovanému předkovi), **`fixed`** (vytržen z toku, kotví se viewportu, drží při scrollu), **`sticky`** (hybrid — relative dokud nedoraží na hranici, pak fixed).

**Q:** Jaký je rozdíl mezi `position: absolute` a `position: fixed`?
**A:** **`absolute`** se pozicuje vůči **nejbližšímu pozicovanému předkovi** (nebo body) — při scrollu se posouvá s obsahem. **`fixed`** se pozicuje vůči **viewportu** (oknu prohlížeče) — **zůstává na stejném místě i při scrollu**. Fixed pro modaly, cookie lišty, sticky bary.

**Q:** Co je sticky pozicování a kdy ho použiješ?
**A:** Hybrid mezi `relative` a `fixed`. Prvek se chová jako relativní, **dokud scrollování nedosáhne nastavené hranice** (např. `top: 0`). Pak se **přilepí** a chová se jako fixed, **dokud rodičovský kontejner neopustí viewport**. Typické použití: **sticky navigace**, header tabulky.

**Q:** Jak vycentruješ modální okno přes `position: fixed`?
**A:**
```css
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```
`top: 50%; left: 50%;` posune **levý horní roh** prvku do středu viewportu. `transform: translate(-50%, -50%)` posune prvek o polovinu jeho vlastní velikosti zpátky — teď je střed prvku ve středu viewportu, nezávisle na rozměrech.

**Q:** Co je `z-index` a kdy nefunguje?
**A:** Číselná hodnota určující **pořadí překryvu** na ose Z. Vyšší = blíž k uživateli. **NEFUNGUJE na prvcích s `position: static`** — pokud chceš měnit pořadí, prvek musí být `relative`, `absolute`, `fixed` nebo `sticky` (případně dítě Flex/Grid).

**Q:** Co je stacking context a proč na něm záleží?
**A:** **Izolovaná oblast** pro porovnání z-index. **Z-index funguje jen mezi sourozenci ve stejném contextu.** Prvek s `z-index: 9999` uvnitř kontextu A se může schovat **pod** prvek s `z-index: 1` z kontextu B, pokud je B v hierarchii výše. Stacking context vzniká u `position` + `z-index`, `opacity < 1`, `transform`, `filter` aj.

**Q:** K čemu sloužil `float` historicky a k čemu dnes?
**A:** **Historicky** sloužil pro **layout** (sloupce stránky) a pro **obtékání textem** kolem obrázku. **Dnes je nahrazen Flexboxem a Gridem** pro layout. **Float se používá už jen pro obtékání textu kolem obrázku/elementu** v článcích (jako v časopise).

**Q:** Co je klasická "past" s `float` a jak se řeší?
**A:** Rodičovský prvek **"zhroutí svou výšku"**, když obsahuje **jen plovoucí prvky** (browser je počítá jako vytržené). Řešení: **clearfix** (pseudo-element `::after` s `clear: both`), nebo modernější `overflow: hidden` / `display: flow-root` na rodiči.

**Q:** Kdy bys použil `absolute` a kdy `fixed`?
**A:** **`absolute`** když chci prvek umístit **vůči konkrétnímu rodiči** — typicky štítek na kartě, dropdown na tlačítku, badge v navigaci. **`fixed`** když chci prvek **vůči obrazovce** — modal, cookie banner, "back to top" tlačítko v rohu.

**Q:** Co je rozdíl mezi `position` a `display: flex`/`grid`?
**A:** **`position`** řídí, **jak se prvek umístí** (v toku × vytržen, vůči čemu). **Flex/Grid** je **layout systém** pro uspořádání více prvků uvnitř kontejneru. Často se **kombinují** — Grid pro hlavní layout stránky, position pro **modaly a překryvy**.

---

## Co bych ještě měl vědět (volně)

- **`inset` shorthand** — moderní (od 2021), zkratka pro `top + right + bottom + left`. `inset: 0` = všechny 0 = roztáhne přes celý kontejner.
- **`position: sticky` browser support** — moderní browsery od 2017, IE nepodporuje (ten už nás stejně netrápí).
- **`overflow: hidden` ruší `position: sticky`** dětí — klasický bug.
- **`isolation: isolate`** — moderní vlastnost, **vytvoří stacking context** bez jiných side-effects (na rozdíl od `transform`, `opacity`).
- **Vrstvení formulářových prvků** — `select`, `dropdown` historicky vždy nahoře (kvůli OS). Dnes řešeno přes `<dialog>` nebo `popover` API.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném DOCX** v `_materials/dat/05/spoluzaci-validovane/`. Terminologie a struktura odpovídá učitelovým preferencím.
- ⚠️ **`@scope` CSS spec** — moderní 2024+, ne nutně součást maturitního curriculum.
- ⚠️ **Pseudo-elementy a stacking** — `::before/::after` vytvářejí v určitých případech stacking context, ale komise se na detaily ptá zřídka.

---

## Praktická příprava (pro 30 min u PC)

**Hlavní úloha** je v `_practice/dat5-pozicovani/` (kopie z assignment): postavit layout s:
1. **Sticky header** (přilepí se nahoru při scrollu)
2. **Float image** v textu článku (obtékaný text vlevo)
3. **Author card** s **TOP AUTOR štítkem** v pravém horním rohu (relative + absolute)
4. **Fixed modal** v pravém dolním rohu (vždy viditelný, nad vším)

Detaily v `_materials/dat/05/spoluzaci-validovane/Z-index a pozicování uloha.md`.

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-11
