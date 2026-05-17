---
subject: DAT
number: 4
title: "CSS Grid a tvorba layoutu"
tags: ["web", "css", "frontend", "layout"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **CSS Grid** je **dvourozměrný** layout systém — řídí současně **řádky a sloupce**. Aktivuje se přes `display: grid` na rodičovském elementu, jeho potomci se stávají **grid položkami**. Na rozdíl od Flexboxu (1D — buď řada, nebo sloupec) je Grid optimalizován pro **celkový layout stránky** — typicky holy grail layout (header / sidebar / content / aside / footer). Klíčové vlastnosti: `grid-template-columns`, `grid-template-rows`, `grid-template-areas`, `gap`. Položky se mohou umisťovat explicitně přes `grid-area` nebo přes line-numbers (`grid-column: 1 / 3`).

---

## Klíčové pojmy

- **Grid kontejner** — element s `display: grid`
- **Grid položka** — přímý potomek grid kontejneru
- **Track** — řádek nebo sloupec mřížky
- **Cell (buňka)** — průsečík řádku a sloupce
- **Grid line** — čára mezi tracky (číslovaná od 1)
- **Grid area** — pojmenovaná oblast pokrývající jednu nebo více buněk
- **`fr` (fraction)** — flexibilní jednotka, dělí volný prostor
- **`auto`** — velikost podle obsahu
- **`gap` / `row-gap` / `column-gap`** — mezera mezi tracky
- **`grid-template-areas`** — pojmenování oblastí "ASCII art" stylem

---

## Hlavní výklad (5–10 min mluvení)

### 1. Flexbox × Grid — kdy co

| | Flexbox | Grid |
|---|---|---|
| Dimenze | **1D** (jeden směr — řada NEBO sloupec) | **2D** (řádky **a** sloupce současně) |
| Hlavní use case | navigace, řada karet, distribuce v jedné linii | stránkový layout, dashboard, šachovnice |
| Mentální model | *"vyrovnám prvky podél osy"* | *"naplánuju mřížku, pak do ní umístím prvky"* |
| Definuje | obsah řídí layout | layout řídí obsah |

**Praxe:** často se **kombinují** — Grid pro hlavní strukturu stránky, Flexbox uvnitř každé buňky.

### 2. Aktivace + minimální Grid

```css
.kontejner {
    display: grid;
    grid-template-columns: 200px 1fr 200px;   /* 3 sloupce: 200px, flex, 200px */
    grid-template-rows: auto 1fr auto;         /* 3 řádky: dle obsahu, flex, dle obsahu */
    gap: 20px;                                   /* 20px mezera mezi všemi tracky */
}
```

### 3. Velikost tracků — `fr`, `auto`, fixní

| Hodnota | Význam | Příklad |
|---|---|---|
| **`fr`** (fraction) | dělí **volný prostor** v poměru | `1fr 2fr` = první 1/3, druhý 2/3 |
| **`auto`** | velikost dle **obsahu** track | `auto` = jen co je třeba |
| **`Npx`** / `Nrem` / `N%` | pevná velikost | `200px` = vždy 200 px |
| **`min-content`** | minimální velikost obsahu | nejdelší slovo |
| **`max-content`** | maximální velikost obsahu | celý text bez zalomení |
| **`minmax(min, max)`** | rozsah | `minmax(200px, 1fr)` — minimum 200px, max flexibilní |

**Klasická 3-sloupcová kombinace:**
```css
grid-template-columns: 250px 1fr 200px;
/* ↑ pevný sidebar, ↑ flexibilní content, ↑ pevný aside */
```

**fr je jiné než %**:
- `1fr 1fr 1fr` — rozdělí **volný prostor** (po odečtení gap a fixed tracků)
- `33% 33% 33%` — rozdělí **celkovou šířku** (gap se nepočítá, prvky můžou přetéct)

**Pro moderní layouty: preferuj `fr`** — chytřeji se vypořádá s gap a fixed tracky.

### 4. Pojmenované oblasti — `grid-template-areas`

Nejčitelnější způsob layoutu, **ideální pro maturitu** — komise vidí "ASCII art" mřížky a ihned chápe.

```css
.grid-container {
    display: grid;
    grid-template-columns: 250px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header  header"
        "sidebar content aside"
        "footer  footer  footer";
    gap: 20px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

**Pravidla `grid-template-areas`:**
- **Každý řádek je řetězec v uvozovkách**, slova oddělená mezerami
- **Stejné jméno = oblast přes víc buněk** (`"header header header"` — rozprostřeno přes 3 sloupce)
- **`.` (tečka)** = prázdná buňka (žádná oblast)
- **Jména musí tvořit obdélníky** — nelze "L-shape" oblast
- **Počet sloupců v řádcích musí být stejný** (jinak browser ignoruje)

**Důsledky:**
- ✅ Layout je **vizuálně čitelný** v CSS
- ✅ **Responzivita** = jen přepsat `grid-template-areas` v media query
- ❌ Neumí dynamický počet buněk (pro dynamické grid použij `grid-auto-flow`)

### 5. Umístění položek přes line-numbers (alternativa)

Místo `grid-area` jménem můžeš použít **čísla čar** (od 1):

```css
.header {
    grid-column: 1 / 4;     /* od čáry 1 do čáry 4 (pokrývá 3 sloupce) */
    grid-row: 1 / 2;
}
.sidebar {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
}
.content {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
}
```

**Shorthand `grid-area` přes čáry:**
```css
.header {
    grid-area: 1 / 1 / 2 / 4;   /* row-start / col-start / row-end / col-end */
}
```

**`span` keyword** — pokrytí N tracků:
```css
.header {
    grid-column: 1 / span 3;     /* od čáry 1, pokryj 3 tracky */
}
```

**Volba: pojmenované oblasti vs. line-numbers:**
- Pro **layout stránky** → pojmenované oblasti (čitelnější)
- Pro **dynamické položky** → line-numbers (flexibilnější)
- **Neměň přístupy** v jednom layoutu — drž se jednoho

### 6. `gap` — mezery v mřížce

```css
gap: 20px;                     /* všechny mezery 20px */
gap: 20px 30px;                /* row-gap 20px, column-gap 30px */
row-gap: 20px;
column-gap: 30px;
```

**Klíčové:** `gap` ovlivňuje **jen prostor mezi tracky**, ne kolem celé mřížky (na to máš `padding`). Funguje **identicky jako u Flexboxu**.

### 7. Zarovnání obsahu v buňkách

| Vlastnost | Co řídí |
|---|---|
| `justify-items` | zarovnání položek v buňce na **horizontální** ose (default `stretch`) |
| `align-items` | zarovnání položek v buňce na **vertikální** ose (default `stretch`) |
| `place-items` | shorthand pro oba (`place-items: center;`) |
| `justify-content` | distribuce **celé mřížky** v kontejneru (horizontálně) |
| `align-content` | distribuce **celé mřížky** v kontejneru (vertikálně) |
| `place-content` | shorthand |
| `justify-self` (na položce) | přepsání `justify-items` pro jednu položku |
| `align-self` (na položce) | přepsání `align-items` pro jednu položku |

⚠️ **U Gridu se osy neotáčí** podle `flex-direction` jako u Flexboxu — vždy `justify` = horizontální, `align` = vertikální.

### 8. Implicitní mřížka — `grid-auto-rows` / `-columns`

Když položek je víc než explicitně definovaných buněk, browser **vytvoří automaticky další tracky**. Velikost těchto tracků řídí:

```css
grid-auto-rows: 100px;        /* další řádky vždy 100px */
grid-auto-columns: 1fr;        /* další sloupce flexibilní */
grid-auto-flow: row;           /* default — naplň po řádcích */
grid-auto-flow: column;        /* nebo po sloupcích */
grid-auto-flow: dense;         /* zaplň "díry" v mřížce */
```

### 9. Repeat() funkce — pro pravidelné mřížky

```css
grid-template-columns: repeat(3, 1fr);              /* 3 stejné sloupce */
grid-template-columns: repeat(4, 200px 1fr);         /* opakující se vzor */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));   /* responzivní */
```

`repeat(auto-fit, minmax(250px, 1fr))` je **kouzlo** — automaticky vyrobí tolik sloupců, kolik se vejde, každý minimálně 250px, max flexibilní. Bez media query, full responsivita.

### 10. Responzivita — media query přepíše areas

```css
.grid-container {
    display: grid;
    grid-template-columns: 250px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header  header"
        "sidebar content aside"
        "footer  footer  footer";
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;          /* jeden sloupec */
        grid-template-areas:
            "header"
            "sidebar"
            "content"
            "aside"
            "footer";
    }
}
```

**Síla pojmenovaných oblastí** — nemusíš přepisovat každou položku, jen přepíšeš **areas** a layout se přerovná.

---

## Konkrétní příklady / kód

### Holy grail layout (přesně jako assignment)
```css
.grid-container {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 250px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header  header"
        "sidebar content aside"
        "footer  footer  footer";
    gap: 20px;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-areas:
            "header"
            "sidebar"
            "content"
            "aside"
            "footer";
    }
}
```

**Důvody k zapamatování:**
- **`min-height: 100vh`** — kontejner zabere alespoň celou výšku okna (jinak by se footer "vznášel" uprostřed)
- **`grid-template-rows: auto 1fr auto`** — header a footer zabírají jen kolik potřebují, content roste, aby vyplnil zbytek
- **`gap: 20px`** — mezery mezi všemi tracky

### Galerie "auto-fit" (responzivní bez media query)
```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
```
Ne potřebuje media query — automaticky se přizpůsobí šířce.

### Centrování přes Grid (alternativa k flexboxu)
```css
.center {
    display: grid;
    place-items: center;       /* horizontálně + vertikálně */
}
```

### Položka přes víc buněk
```css
.title {
    grid-column: 1 / -1;       /* od první do POSLEDNÍ čáry */
    grid-row: 1;
}
```
`-1` je **poslední čára** — užitečné, když nevíš počet sloupců.

---

## Vztahy / kontrasty

- **Grid × Flexbox** — Grid 2D, Flexbox 1D. Grid pro stránkový layout, Flexbox pro řady karet uvnitř. **Často kombinujeme** — Grid hlavní layout, Flexbox v každé buňce.
- **Pojmenované oblasti × line numbers** — **areas** je čitelnější pro layout, line-numbers flexibilnější pro dynamické položky.
- **`fr` × `%`** — `fr` rozděluje **volný** prostor (zohledňuje gap a fixed tracky), `%` je z celkového. **Pro Grid preferuj `fr`**.
- **`gap` × `margin`** — `gap` čistší (jeden zdroj pravdy), `margin` může vést k double-margin. **U Grid používej `gap`**.
- **`auto-fit` × `auto-fill`** v `repeat()` — `auto-fit` **stáhne prázdné tracky** (existující obsah se roztáhne), `auto-fill` **drží prázdné tracky** (víc buněk i bez obsahu).

---

## Časté otázky komise

**Q:** Co je CSS Grid a kdy ho použít?
**A:** Dvourozměrný layout systém v CSS, řídí současně řádky a sloupce. Aktivuje se přes `display: grid`. Použiju ho pro **stránkový layout** (header / sidebar / content / footer), dashboardy, mřížkové komponenty. Pro jednoduché řady je flexibilnější Flexbox.

**Q:** Jaký je rozdíl mezi Flexbox a Grid?
**A:** Flexbox je 1D — řídí buď řádek nebo sloupec, ne obě. Grid je 2D — řídí obě dimenze současně. Flexbox je pro distribuci v jedné linii (navigace, karty), Grid pro celé layouty. V praxi se kombinují.

**Q:** Co znamená `1fr` a jak se liší od `%`?
**A:** `fr` je flexibilní jednotka, dělí **volný prostor** v kontejneru po odečtení gap a fixed tracků. `1fr 2fr` = první track 1/3, druhý 2/3 zbývajícího prostoru. `%` je z **celkové šířky** kontejneru, nezohledňuje gap, takže může způsobit overflow.

**Q:** Co je `grid-template-areas` a proč ho použít?
**A:** Pojmenovává oblasti mřížky pomocí "ASCII art" — jména v řetězcích označují, kterou buňku zaberou. Stejné jméno přes víc buněk = jedna velká oblast. Hlavní výhody: čitelnost layoutu v CSS a snadná responzivita (v media query přepíšu jen areas).

**Q:** Jak udělám responzivní Grid bez media query?
**A:** Přes `repeat(auto-fit, minmax(250px, 1fr))` v `grid-template-columns`. Browser sám vyrobí tolik sloupců, kolik se vejde, každý minimálně 250px, max flexibilní. Žádný media query.

**Q:** Co dělá `grid-area: 1 / 2 / 3 / 4`?
**A:** Shorthand pro umístění položky přes line numbers. Pořadí: `row-start / column-start / row-end / column-end`. V tomto případě: položka začíná na řádku 1, sloupci 2, končí na řádku 3, sloupci 4 — pokrývá 2 řádky a 2 sloupce.

**Q:** Co je `min-height: 100vh` na grid kontejneru a proč?
**A:** Kontejner zabere alespoň celou výšku viewport okna (`100vh` = 100 % výšky viewportu). Bez něj by se short content (málo textu) zobrazil v malém prostoru a **footer by se "vznášel" uprostřed obrazovky**, ne dole. Standardní pattern pro full-page layouty.

**Q:** Jak vycentruješ obsah uvnitř buňky Gridu?
**A:** Na úrovni kontejneru `place-items: center` (oba osy). Na úrovni jedné položky `justify-self: center; align-self: center`. Stejně jako u Flexboxu, jen `justify` je vždy horizontální a `align` vždy vertikální (osy se neotáčí).

---

## Co bych ještě měl vědět (volně)

- **`grid-area` v media query** přepíše hodnotu mimo media query (kaskáda funguje normálně). Mobile-first nebo desktop-first je tvoje volba.
- **`subgrid`** (CSS Grid Level 2) — vnořený grid sdílí mřížku rodiče. Užitečné pro karty se zarovnaným obsahem napříč. Browser support stoupá, ale ještě není 100 %.
- **`grid` shorthand** — extrémně mocný, ale málokdy čitelný. Pro maturitu drž explicitní vlastnosti.
- **`order`** funguje i v Gridu — stejně jako u Flexboxu mění vizuální pořadí bez změny HTML.
- **Implicit grid** — když položek je víc než definovaných buněk, browser automaticky vytvoří další tracky podle `grid-auto-rows` / `grid-auto-columns`.
- **Browser DevTools** mají Grid inspektor (Chrome / Firefox / Edge) — vizualizuje line numbers, area names, gap. **Použij u zkoušky pro debug.**

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném assignment** v `_materials/dat/04/spoluzaci-validovane/css-grid-cidehululec/` — terminologie (track, line, cell, area) odpovídá CSS Grid specifikaci. Zachoval jsem strukturu z assignment README.
- ⚠️ **`subgrid`** je moderní (2023+), ne všechny prohlížeče ho podporují plně. Pro maturitu **nezmiňovat hlavně**, jen jako "moderní rozšíření".
- ⚠️ **Mobile-first × Desktop-first** filozofie volby breakpointu — assignment používá **desktop-first** (`max-width: 768px`). Komise se může zeptat *"proč max-width?"* — řeknu *"desktop je default, mobil je override pro menší zařízení"*. Mobile-first by používal `min-width`.

---

## Praktická příprava (pro 30 min u PC)

Trénuj tyto vzory tak, abys je z prázdného CSS souboru napsal za **<25 minut**:

1. **Holy grail layout** (header + 3-col + footer) s `grid-template-areas`
2. **Responzivita přes media query** (přepsání areas pro mobil)
3. **Galerie přes `auto-fit + minmax`** (žádný media query)
4. **Centrování přes `place-items: center`**
5. **Položka přes víc buněk** přes `grid-column: 1 / -1`

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-10
