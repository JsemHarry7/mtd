---
subject: DAT
number: 7
title: "Tabulky v HTML a jejich stylování"
tags: ["web", "html", "frontend", "sémantika"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **HTML tabulka** (`<table>`) je sémantický element pro **zobrazení tabulárních dat** — řádky × sloupce. Skládá se z **`<table>`** kořene, volitelné **`<caption>`** (nadpis), **`<thead>`**, **`<tbody>`** a případně **`<tfoot>`** sekcí, řádků **`<tr>`**, hlavičkových buněk **`<th>`** a datových buněk **`<td>`**. Buňky lze **sloučit** přes atributy **`colspan`** (přes sloupce) a **`rowspan`** (přes řádky). Tabulky **nesmí být používány pro layout stránky** — od HTML5 je to čistě **sémantický element pro data**.

---

## Klíčové pojmy

- **`<table>`** — kořen tabulky
- **`<caption>`** — popisek/název tabulky (přístupnost + SEO)
- **`<colgroup>` + `<col>`** — definuje sloupce, lze stylovat (např. `background`)
- **`<thead>` / `<tbody>` / `<tfoot>`** — sémantické sekce tabulky
- **`<tr>`** (table row) — řádek
- **`<th>`** (table header cell) — buňka hlavičky (sémanticky důležitější, default bold)
- **`<td>`** (table data cell) — datová buňka
- **`colspan="N"`** — buňka **přes N sloupců**
- **`rowspan="N"`** — buňka **přes N řádků**
- **`scope`** atribut — pro přístupnost (`scope="col"`, `scope="row"`)
- **`border-collapse`** — CSS, zda se okraje sousedních buněk slučují
- **`border-spacing`** — vzdálenost mezi okraji buněk

---

## Hlavní výklad (5–10 min mluvení)

### 1. Struktura HTML tabulky

```html
<table>
    <caption>Popisek tabulky</caption>

    <colgroup>
        <col span="1">                <!-- definice prvního sloupce -->
        <col span="2">                <!-- definice dalších dvou sloupců -->
    </colgroup>

    <thead>                            <!-- hlavička -->
        <tr>
            <th>Sloupec 1</th>
            <th>Sloupec 2</th>
            <th>Sloupec 3</th>
        </tr>
    </thead>

    <tbody>                            <!-- tělo s daty -->
        <tr>
            <td>Buňka 1</td>
            <td>Buňka 2</td>
            <td>Buňka 3</td>
        </tr>
        <tr>
            <td>Buňka 4</td>
            <td>Buňka 5</td>
            <td>Buňka 6</td>
        </tr>
    </tbody>

    <tfoot>                            <!-- patička (volitelná) -->
        <tr>
            <td colspan="3">Souhrn</td>
        </tr>
    </tfoot>
</table>
```

**K čemu jednotlivé části:**
- **`<caption>`** — text **nad nebo pod** tabulkou, povinný pro přístupnost (čtečka řekne *"tabulka: Popisek..."*)
- **`<colgroup>` + `<col>`** — definuje sloupce pro **stylování celých sloupců** najednou. Nelze přidávat obsah, jen styling.
- **`<thead>`** — hlavička tabulky. Sémanticky se odlišuje (default bold + centered v `<th>`). Při tisku se opakuje na každé stránce.
- **`<tbody>`** — tělo dat. Pokud nepoužiješ explicitně, browser ho přidá automaticky.
- **`<tfoot>`** — patička (souhrny, totaly). Při tisku se taky opakuje.

⚠️ **`<thead>`, `<tbody>`, `<tfoot>` musí být v pořadí**: head → body → foot. *(Některé browsery to umí promíchat, ale jako standard drž pořadí.)*

### 2. `<th>` × `<td>` — sémantický rozdíl

```html
<th>Datum</th>           <!-- hlavičková buňka — popis dat -->
<td>2026-05-11</td>      <!-- datová buňka — konkrétní hodnota -->
```

**Vizuálně:** `<th>` má default `font-weight: bold` a `text-align: center`. `<td>` má normální váhu, zarovnání vlevo.

**Sémanticky:** `<th>` říká *"toto je popisek (header)"*, `<td>` *"toto je hodnota dat"*. Klíčové pro **přístupnost** a **vyhledávače**.

**Atribut `scope`** zlepšuje přístupnost — říká, zda hlavička platí pro **sloupec** nebo **řádek**:

```html
<th scope="col">Sloupec</th>   <!-- header sloupce -->
<th scope="row">Řádek</th>     <!-- header řádku -->
```

Bez `scope` čtečka může mít problém spojit hlavičku s daty u složitějších tabulek.

### 3. `colspan` a `rowspan` — sloučení buněk

**`colspan="N"`** — buňka pokryje **N sloupců**:

```html
<tr>
    <td colspan="2">Spojené dvě buňky</td>
    <td>Třetí buňka</td>
</tr>
```

**`rowspan="N"`** — buňka pokryje **N řádků**:

```html
<tr>
    <td rowspan="2">Spojené přes dva řádky</td>
    <td>Buňka v prvním řádku</td>
</tr>
<tr>
    <!-- první buňka chybí — pokryta rowspan -->
    <td>Buňka v druhém řádku</td>
</tr>
```

⚠️ **Past s rowspan**: druhý řádek **NEDOSTANE první `<td>`** — ta je už pokryta. Pokud bys ho přidal, layout se rozsype.

**Kombinace colspan + rowspan** funguje:
```html
<td colspan="2" rowspan="3">Velká buňka 2×3</td>
```

### 4. Stylování tabulky CSS

#### `border-collapse` — sloučení okrajů
```css
table {
    border-collapse: collapse;    /* okraje sousedních buněk se slijí */
    border-collapse: separate;    /* default — každá buňka má svůj okraj */
}
```

**`collapse`** je **téměř vždy preferováno** — čistší vzhled bez "dvojitých" linek.

#### `border-spacing` — mezery mezi buňkami (jen pro `separate`)
```css
table {
    border-collapse: separate;
    border-spacing: 10px;          /* 10px mezera mezi buňkami */
}
```

#### Klasický pattern — striped rows (zebra)
```css
tbody tr:nth-child(odd) {
    background-color: #f5f5f5;
}
tbody tr:nth-child(even) {
    background-color: #ffffff;
}

/* Alternativně přes :nth-of-type */
```

#### Hover effect
```css
tbody tr:hover {
    background-color: #fffae5;
}
```

#### Stylování celých sloupců (přes `<col>`)
```html
<colgroup>
    <col class="sloupec-cas">
    <col span="2" class="sloupec-info">
</colgroup>
```

```css
.sloupec-cas { background-color: #e8eaf6; }
.sloupec-info { background-color: #fdeed9; }
```

⚠️ **Limit `<col>`** — lze stylovat **jen omezené vlastnosti**: `background`, `border`, `width`, `visibility`. **Nelze:** padding, font, color (ty patří na buňky `td`/`th`).

#### BEM pattern pro tabulku (z validovaného assignmentu)
```css
.schedule { /* table */ }
.schedule__caption { /* caption */ }
.schedule__col--time { /* col první */ }
.schedule__col--room { /* col druhý-třetí */ }
.schedule__head { /* thead */ }
.schedule__head th { /* th uvnitř thead */ }
.schedule td { /* všechny td */ }
.schedule__time { /* td s časem */ }
.schedule__event--keynote { /* td s keynote */ }
.schedule__event--break { /* td s pauzou */ }
.schedule__event--networking { /* td s networkingem */ }
```

### 5. Tabulky × layout (anti-pattern)

**Historicky** se tabulky používaly pro **layout** stránek (sloupce, řádky). **DNES JE TO ANTI-PATTERN.**

Důvody:
1. **Sémanticky špatně** — `<table>` říká *"tabulární data"*, ne *"layout"*
2. **Přístupnost** — čtečka přečte layout jako tabulku, slepý uživatel se ztratí
3. **Responzivita** — tabulky nejde snadno upravit na mobil
4. **Náhrada** — **Flexbox** (DAT 3), **Grid** (DAT 4) pro layout

**Pravidlo:** *"Tabulka jen pro skutečná tabulární data — program konference, ceník, statistiky."* Pro layout stránky vždy Flexbox/Grid.

### 6. Responzivní tabulky (bonus)

Tabulky jsou notoricky obtížné na mobilu. Klasická řešení:

1. **Horizontální scroll** — wrap tabulky v kontejneru s `overflow-x: auto`:
   ```html
   <div style="overflow-x: auto;">
       <table>...</table>
   </div>
   ```

2. **Skrytí méně důležitých sloupců** v media query:
   ```css
   @media (max-width: 600px) {
       .schedule__col--secondary { display: none; }
   }
   ```

3. **Restrukturace na cards** (advanced) — `display: block` na řádcích, pseudo-elementy pro labels. Komise spíš ne.

### 7. Přístupnost tabulky — best practices

- **`<caption>`** povinný (popisek pro čtečku)
- **`<th>` s `scope`** atributem (`col` / `row`)
- **Nepoužívat `<br>`** v buňkách — místo toho víc buněk nebo `<span>`
- **`aria-label`** na složitějších tabulkách

---

## Konkrétní příklady / kód

### Minimální tabulka
```html
<table>
    <thead>
        <tr>
            <th>Jméno</th>
            <th>Věk</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anna</td>
            <td>25</td>
        </tr>
        <tr>
            <td>Petr</td>
            <td>30</td>
        </tr>
    </tbody>
</table>
```

### Tabulka s sloučením (colspan + rowspan)
```html
<table>
    <thead>
        <tr>
            <th>Den</th>
            <th>Dopoledne</th>
            <th>Odpoledne</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Pondělí</td>
            <td colspan="2">Workshop celý den</td>
        </tr>
        <tr>
            <td rowspan="2">Úterý-Středa</td>
            <td>Přednáška</td>
            <td>Cvičení</td>
        </tr>
        <tr>
            <!-- první td chybí — rowspan ze řádku výše -->
            <td>Přednáška</td>
            <td>Lab</td>
        </tr>
    </tbody>
</table>
```

### Plné stylování s BEM
```css
.schedule {
    border-collapse: collapse;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.schedule__caption {
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    background: white;
    border-radius: 1rem 1rem 0 0;
}

.schedule__head {
    background: linear-gradient(160deg, #667eea, #51257d);
}

.schedule__head th {
    padding: 0.8rem;
    color: white;
    text-align: center;
    border: 1px solid rgba(0,0,0,0.1);
}

.schedule td {
    padding: 0.8rem;
    text-align: center;
    border: 1px solid rgba(0,0,0,0.1);
}

.schedule__event--break {
    color: red;
    font-style: italic;
    font-weight: 700;
}

.schedule__event--keynote {
    background-color: #dbffde;
}
```

---

## Vztahy / kontrasty

- **`<th>` × `<td>`** — `<th>` hlavička (sémanticky důležitější, bold+center default), `<td>` data. Vždy preferuj `<th>` pro popisky.
- **`colspan` × `rowspan`** — colspan **horizontální** sloučení, rowspan **vertikální**. Lze kombinovat.
- **`<thead>` × `<tbody>` × `<tfoot>`** — head pro popisky sloupců, body pro data, foot pro souhrny (totaly). Pořadí v HTML matter.
- **`border-collapse: collapse` × `separate`** — collapse spojí okraje (čistší), separate má mezery.
- **Tabulka × Flexbox/Grid** — tabulka jen pro **skutečná tabulární data**, Flexbox/Grid pro layout.
- **`<col>` styling × cell styling** — `<col>` má **omezené** vlastnosti (jen background, border, width), pro padding/font musíš jít na `<td>`/`<th>`.

---

## Časté otázky komise

**Q:** Vyjmenuj základní strukturální tagy HTML tabulky.
**A:** **`<table>`** (kořen), **`<caption>`** (popisek), **`<colgroup>` + `<col>`** (definice sloupců), **`<thead>`** (hlavička), **`<tbody>`** (tělo), **`<tfoot>`** (patička), **`<tr>`** (řádek), **`<th>`** (hlavičková buňka), **`<td>`** (datová buňka).

**Q:** Jaký je rozdíl mezi `<th>` a `<td>`?
**A:** **`<th>`** je **hlavičková buňka** — sémanticky popisek dat. Default styling: bold + centered. Patří typicky do `<thead>`. **`<td>`** je **datová buňka** — konkrétní hodnota. Sémanticky důležité pro čtečky obrazovky a SEO.

**Q:** Co dělá atribut `colspan` a `rowspan`?
**A:** **`colspan="N"`** spojí buňku **přes N sloupců** horizontálně. **`rowspan="N"`** spojí buňku **přes N řádků** vertikálně. Při `rowspan` se v dalších řádcích vynechá první `<td>`, který je pokrytý. Lze kombinovat: `<td colspan="2" rowspan="3">`.

**Q:** K čemu slouží `border-collapse` a jaké má hodnoty?
**A:** CSS vlastnost určující, jak se chovají okraje sousedních buněk. **`collapse`** (preferováno) — okraje se slijí, žádné dvojité linky. **`separate`** (default) — každá buňka má svůj okraj, mezi nimi mezera (lze upravit přes `border-spacing`).

**Q:** Lze tabulky používat pro layout stránky?
**A:** **Historicky ano, dnes NE.** Tabulka je **sémantický element pro tabulární data**. Pro layout používej **Flexbox** (1D) nebo **CSS Grid** (2D). Důvody proti tabulkám pro layout: sémanticky špatně, problém pro přístupnost (čtečky), špatná responzivita, mixování dat s prezentací.

**Q:** Co je `<caption>` a kde se zobrazuje?
**A:** **Popisek/název tabulky**. Default se zobrazuje **nad** tabulkou, dá se přesunout pod přes `caption-side: bottom`. **Důležitý pro přístupnost** — čtečka přečte *"tabulka: [caption text]..."*. Také pro SEO.

**Q:** Co je `<colgroup>` a `<col>` a kdy ho použiješ?
**A:** **Definice sloupců tabulky** pro **stylování celých sloupců** najednou (background, border, width). `<col>` jednotlivý sloupec, `<colgroup>` skupina. **Omezení:** lze stylovat jen `background`, `border`, `width`, `visibility`. Pro padding, font, color musíš na `<td>`/`<th>`.

**Q:** Jak vytvořit "zebra" tabulku se střídavým pozadím řádků?
**A:** Pomocí CSS pseudo-třídy `:nth-child(odd)` nebo `:nth-child(even)`:
```css
tbody tr:nth-child(odd) { background: #f5f5f5; }
tbody tr:nth-child(even) { background: white; }
```
Selektor počítá od 1, takže `odd` = 1, 3, 5...

**Q:** Jak udělat tabulku responzivní na mobilech?
**A:** Nejjednodušší: **horizontální scroll** přes `overflow-x: auto` na obalu:
```html
<div style="overflow-x: auto;">
    <table>...</table>
</div>
```
Pokročilejší: skrýt méně důležité sloupce přes media query. Nejpokročilejší: změnit `display: block` na řádcích a pseudo-elementy s labely.

**Q:** Co je atribut `scope` u `<th>` a k čemu slouží?
**A:** Pro **přístupnost** — říká, zda hlavička platí pro **sloupec** (`scope="col"`) nebo **řádek** (`scope="row"`). Bez něj čtečka může mít problém spojit hlavičku s daty u složitějších tabulek. Doporučená best practice pro datové tabulky.

---

## Co bych ještě měl vědět (volně)

- **`<table>` má atribut `summary`** — historický, dnes nahrazen `<caption>` nebo `aria-describedby`.
- **`align`, `bgcolor`** atributy na `<table>` — **deprecated** v HTML5. Vše dělej v CSS.
- **`<table>` nemá `width` atribut v HTML5** — `style="width: 100%"` nebo CSS.
- **`empty-cells: hide`** — CSS, skryje prázdné buňky (jen u `border-collapse: separate`).
- **`table-layout: fixed`** — CSS, šířka sloupců se počítá podle prvního řádku (rychlejší pro velké tabulky).
- **`<th>` může být uvnitř `<tbody>`** (pro hlavičky řádků), nejen v `<thead>`.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném assignmentu** v `_materials/dat/07/spoluzaci-validovane/`. Plné řešení k dispozici v `table_klic/`. Terminologie a struktura odpovídají učitelovým preferencím (BEM třídy, colspan/rowspan, span tags pro lektory).
- ⚠️ **`<thead>`, `<tbody>`, `<tfoot>` pořadí** — formálně lze v HTML5 v libovolném pořadí, browsery to zobrazí správně (head nahoře, foot dole). Pro maturitu **drž head → body → foot** v pořadí.
- ⚠️ **`<col>` stylování** — historicky kontroverzní, různé limity v různých browserech. Pro background a width spolehlivé, ostatní opatrně.

---

## Praktická příprava (pro 30 min u PC)

**Hlavní úloha** v `_practice/dat7-tabulky/` (kopie z validated assignmentu):

> **Konference WebDev 2025** — program s 5 řádky, 3 sloupci. Použít `colspan` (keynote + networking přes 2 sloupce, "Přestávka" 2 sloupce), `rowspan` (workshop přes 2 řádky). BEM třídy podle README. CSS musí mít gradienty, barevné kategorie událostí (keynote zelený, networking růžový, break červený text italics), span tagy pro lektory.

Plný popis v `README.md` + obrázek očekávaného výsledku v `image.png` (v `_materials/`).

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-11
