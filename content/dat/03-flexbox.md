---
subject: DAT
number: 3
title: "Flexbox a rozmístění prvků"
tags: ["web", "css", "frontend", "layout"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Flexbox** (CSS Flexible Box Layout Module) je **jednorozměrný** model pro rozmístění prvků v kontejneru — rozděluje volný prostor po **jedné dominantní ose** (buď horizontální, nebo vertikální). Řeší klasické CSS problémy, které byly před ním "hacky": **vertikální centrování**, **vyrovnání výšky sousedních sloupců**, **rovnoměrné rozdělení prostoru** nezávisle na pixelových rozměrech. Aktivuje se pravidlem `display: flex` na rodičovském elementu, jeho přímí potomci se stávají **flex položkami**.

---

## Klíčové pojmy

- **Flex kontejner** — rodičovský element s `display: flex`
- **Flex položka** — přímý potomek flex kontejneru
- **Hlavní osa (main axis)** — primární osa, určená vlastností `flex-direction`
- **Křížová osa (cross axis)** — kolmá k hlavní ose
- **`display: flex`** — aktivace flex kontextu (blokový kontejner)
- **`display: inline-flex`** — flex kontext, ale kontejner je inline (chová se jako `<span>`)
- **Elasticita** — schopnost položky růst/zmenšovat se, řízená `flex-grow`, `flex-shrink`, `flex-basis`
- **Box model normalizace** — `box-sizing: border-box` pro celý dokument
- **1D × 2D layout** — Flexbox = 1D (jeden směr), CSS Grid = 2D (řádky + sloupce)

---

## Hlavní výklad (5–10 min mluvení)

### 1. Proč Flexbox vznikl

Před HTML5/CSS3 se layouty dělaly **floats**, **absolute positioning** nebo dokonce **HTML tabulkami**. Tyto metody byly navržené pro **textové dokumenty**, ne pro aplikační rozhraní. Klasické problémy:

- **Vertikální centrování** — bez Flexboxu vyžadovalo `transform: translateY(-50%)` triky
- **Vyrovnání výšky sloupců** — sousední sloupce s různým obsahem měly jinou výšku
- **Distribuce prostoru** — bez znalosti rozměrů nelze rovnoměrně rozdělit zbytek

Flexbox tohle řeší **nativně** přes pravidla na rodičovském kontejneru.

### 2. Souřadnicový systém — hlavní × křížová osa

**Klíčový koncept:** Flexbox **NEpoužívá** standardní X/Y. Místo toho má **relativní osy**, které se přepínají podle `flex-direction`.

```
flex-direction: row (default)
┌───────────────────────────────┐
│ → → → → → → → → →  [main]    │   hlavní osa = horizontální
│ ↓ cross                        │
└───────────────────────────────┘

flex-direction: column
┌────────┐
│ → main │   hlavní osa = vertikální
│ ↓      │
│ ↓      │
│ ↓      │
│ ↓      │
│ ↓      │
│ ↑ cross│   křížová osa = horizontální
└────────┘
```

**Důsledek:** `justify-content` (zarovnání na hlavní ose) se chová **jinak** podle `flex-direction`. Pro `row` zarovnává horizontálně, pro `column` vertikálně.

### 3. Aktivace + workflow (5 kroků)

```css
.kontejner {
    display: flex;                      /* 1. Aktivace */
    flex-direction: row;                /* 2. Směr hlavní osy */
    flex-wrap: wrap;                    /* 3. Zalamování */
    justify-content: space-between;     /* 4. Distribuce na hlavní ose */
    align-items: center;                /* 5. Zarovnání na křížové ose */
    gap: 1rem;                          /* mezery mezi položkami */
}
```

### 4. Vlastnosti FLEX KONTEJNERU (na rodiči)

| Vlastnost | Hodnoty | Co dělá |
|---|---|---|
| `display` | `flex` / `inline-flex` | aktivace flex kontextu |
| `flex-direction` | `row` (default) / `row-reverse` / `column` / `column-reverse` | směr hlavní osy |
| `flex-wrap` | `nowrap` (default) / `wrap` / `wrap-reverse` | zalamování při nedostatku místa |
| `flex-flow` | shorthand pro `flex-direction` + `flex-wrap` | např. `row wrap` |
| `justify-content` | `flex-start` / `flex-end` / `center` / `space-between` / `space-around` / `space-evenly` | zarovnání na **hlavní** ose |
| `align-items` | `flex-start` / `flex-end` / `center` / `stretch` (default) / `baseline` | zarovnání na **křížové** ose pro 1 řádek |
| `align-content` | jako justify-content + `stretch` | distribuce **mezi řádky** (efekt jen s `flex-wrap: wrap`) |
| `gap` / `row-gap` / `column-gap` | např. `1rem` / `20px` | mezera mezi položkami |

#### `justify-content` — vizualizace
```
flex-start       [▮▮▮          ]     položky vlevo
flex-end         [          ▮▮▮]     položky vpravo
center           [     ▮▮▮     ]     položky uprostřed
space-between    [▮     ▮     ▮]     krajní u krajů, zbytek rovnoměrně
space-around     [ ▮   ▮   ▮ ]      stejné mezery KOLEM (krajní = poloviční)
space-evenly     [  ▮  ▮  ▮  ]      všechny mezery stejné včetně krajních
```

#### `align-items` — křížová osa, jeden řádek
```
align-items: flex-start    všechny u horního okraje
align-items: center        všechny vertikálně uprostřed
align-items: flex-end      všechny u dolního okraje
align-items: stretch       (default) položky se natáhnou na výšku kontejneru
align-items: baseline      zarovnání podle základové linie textu
```

### 5. Vlastnosti FLEX POLOŽKY (na potomcích)

| Vlastnost | Co dělá |
|---|---|
| `flex-grow` | bezrozměrné číslo, **ochota růst** a zabrat volný prostor |
| `flex-shrink` | bezrozměrné, **ochota zmenšit se** při nedostatku místa |
| `flex-basis` | **výchozí velikost** položky před distribucí (např. `250px`, `auto`) |
| `flex` | **shorthand**: `flex: <grow> <shrink> <basis>` — např. `flex: 1 1 0%` |
| `align-self` | přepíše `align-items` jen pro tuto položku |
| `order` | bezrozměrné, mění **pořadí** v hlavní ose (default 0; nižší = dříve) |

#### Pružinová analogie
- **`flex-basis`** — *ideální délka pružiny v klidu*
- **`flex-grow`** — *síla, kterou pružina expanduje* (kolik volného prostoru pohltí v poměru k ostatním)
- **`flex-shrink`** — *ochota nechat se stlačit* při nedostatku místa

#### Shorthand `flex` — pamatuj si tři klasické hodnoty:
```css
flex: 0 1 auto;       /* default — neroste, smršťuje se, výchozí dle obsahu */
flex: 1 1 0%;          /* "rovnoměrně rozdělit" — všechny stejně velké */
flex: 1;               /* zkratka pro: 1 1 0% — nejčastější */
flex: none;            /* 0 0 auto — položka se nemění */
```

### 6. Trik `margin: auto` ve flexboxu

Když na flex položku dáš `margin-left: auto` (nebo `margin-top: auto` v column flex), **pohltí veškerý volný prostor** v daném směru. Klasické použití: **odsunout poslední položku na druhý kraj** (např. tlačítko "Přihlásit" v navigaci).

```html
<nav class="main-nav">
    <div class="logo">FLEX LAB</div>
    <ul class="nav-links">...</ul>
    <div class="actions">...</div>   <!-- tohle chci úplně vpravo -->
</nav>
```

```css
.main-nav { display: flex; align-items: center; }
.actions { margin-left: auto; }    /* odtlačí actions na pravý okraj */
```

To je **modernější** než `justify-content: space-between`, protože **logo a nav-links zůstávají vedle sebe** vlevo.

### 7. Klasické problémy a řešení

#### `min-width: 0` past
**Problém:** Flex položka může **přetéct kontejner**, pokud obsahuje **dlouhý nepřerušitelný text** (URL, dlouhé slovo) nebo nezmenšený obrázek. Důvod: výchozí `min-width: auto` znamená *"nesmí se zmenšit pod velikost obsahu"*.

**Řešení:**
```css
.flex-item {
    min-width: 0;          /* pro flex-direction: row */
    min-height: 0;         /* pro flex-direction: column */
}
```

#### Box-sizing normalizace (povinná)
```css
* {
    box-sizing: border-box;
}
```

Bez toho ti `width: 250px` neznamená 250 px (přidá se padding + border navrch). S `border-box` se **padding a border započítávají DOVNITŘ**.

#### Margin collapsing — neexistuje ve flexboxu
Ve standardním block layoutu se sousední vertikální marginy "slévají" (větší vyhrává). **Ve flexboxu k tomu nedochází** — marginy se vždy sčítají. Zjednodušuje matematiku mezer.

### 8. Flexbox × CSS Grid

| | Flexbox | Grid |
|---|---|---|
| Dimenze | **1D** (jeden směr) | **2D** (řádky + sloupce) |
| Nejvhodnější pro | Navigace, toolbary, karty v řadě, menu | Stránkové layouty, dashboards, šachovnice |
| Rozhodování | *"Chci uspořádat věci v jedné linii"* | *"Chci přesnou mřížku"* |

Často se **kombinují** — Grid pro hlavní layout stránky, Flexbox uvnitř každé buňky.

---

## Konkrétní příklady / kód (z 5 modulů zadaného assignmentu)

### Modul 1 — Horizontální nav bar
```css
.main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.actions {
    margin-left: auto;          /* odtlačí actions vpravo */
}
```

### Modul 2 — Hero centrování (justify + align)
```css
.hero {
    min-height: 400px;
    display: flex;
    justify-content: center;     /* horizontálně */
    align-items: center;          /* vertikálně */
}
```

### Modul 3 — Produktová galerie (wrap + grow + basis)
```css
.gallery-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.product-card {
    flex-grow: 1;
    flex-basis: 250px;
}
```

### Modul 4 — Cenové karty (column + margin auto)
```css
.pricing {
    display: flex;
    /* default align-items: stretch — všechny karty stejně vysoké */
}
.plan-card {
    display: flex;                /* vnořený flex kontext */
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 250px;
}
.buy-btn {
    margin-top: auto;             /* tlačítko dole, nezávisle na seznamu */
}
```

### Modul 5 — Media objekt (shrink + grow)
```css
.media-object {
    display: flex;
    align-items: flex-start;       /* avatar nahoře, ne uprostřed */
}
.avatar {
    width: 64px;
    height: 64px;
    flex-shrink: 0;                /* avatar se NEZMENŠUJE */
}
.comment-body {
    flex-grow: 1;
    min-width: 0;                  /* anti-overflow past */
}
```

---

## Vztahy / kontrasty

- **Flexbox × Grid** — Flexbox 1D, Grid 2D. Flexbox když chceš věci v řadě/sloupci, Grid pro mřížku.
- **`justify-content` × `align-items`** — `justify-content` na hlavní ose, `align-items` na křížové. **Kterou je která, určuje `flex-direction`.**
- **`align-items` × `align-content`** — `align-items` zarovnává **prvky v jednom řádku** (efekt vždy). `align-content` distribuuje **mezi více řádky** — efekt jen s `flex-wrap: wrap` a víc řádky.
- **`flex-grow` × `flex-shrink` × `flex-basis`** — `basis` výchozí, `grow` jak růst, `shrink` jak zmenšovat. Shorthand `flex: G S B`.
- **`gap` × `margin`** — `gap` definuje mezeru **mezi prvky** v kontejneru (čistší). `margin` může vést k double-margin problémům na okrajích. Pro flexbox **preferuj `gap`**.

---

## Časté otázky komise

**Q:** Co je Flexbox a k čemu se používá?
**A:** CSS modul pro jednorozměrné rozmístění prvků v kontejneru. Aktivuje se přes `display: flex` na rodiči, jeho přímí potomci se stávají flex položkami. Slouží k zarovnání, distribuci prostoru a vyrovnání rozměrů — typicky navigace, řady karet, vertikální centrování.

**Q:** Jaký je rozdíl mezi hlavní a křížovou osou?
**A:** Hlavní osa je primární směr, podél kterého jsou položky rozmísťovány — určuje ji `flex-direction`. Křížová osa je vždy kolmá. Pro `row` je hlavní horizontální, křížová vertikální. Pro `column` opačně.

**Q:** Co dělá `justify-content: space-between` a co `space-around`?
**A:** `space-between` — krajní položky u krajů, zbylé mezery rozdělí rovnoměrně mezi položkami. `space-around` — stejné mezery **kolem** každé položky (krajní mezery jsou poloviční oproti vnitřním). `space-evenly` — všechny mezery stejné včetně krajních.

**Q:** Jak vertikálně vycentruješ obsah pomocí Flexboxu?
**A:** Na rodičovský kontejner aplikuju `display: flex; justify-content: center; align-items: center;`. Tato kombinace centruje na obou osách současně.

**Q:** Co znamená `flex: 1` a co `flex: 1 1 0%`?
**A:** `flex: 1` je shorthand pro `flex: 1 1 0%` — položka roste (grow=1), smršťuje se (shrink=1), výchozí velikost 0. V praxi: položka pohltí veškerý dostupný prostor a všechny `flex: 1` položky budou stejně velké.

**Q:** Co dělá `margin: auto` ve flex položce?
**A:** Pohltí veškerý volný prostor v daném směru. Typické použití: `margin-left: auto` na poslední položce navigace odtlačí ji na pravý okraj kontejneru, nezávisle na obsahu před ní.

**Q:** Co je `flex-shrink: 0` a kdy se používá?
**A:** Položka se **nesmí zmenšit**, i kdyby na ni nezbylo místo. Typicky pro avatary, ikony nebo prvky s pevnými rozměry, které musí zachovat proporce.

**Q:** Jaký je rozdíl mezi `flex-wrap: wrap` a `flex-wrap: nowrap`?
**A:** `nowrap` (default) — položky zůstávají v jednom řádku/sloupci, i kdyby přetekly. `wrap` — pokud se nevejdou, zalomí se na další řádek/sloupec.

**Q:** Co je rozdíl mezi Flexbox a CSS Grid?
**A:** Flexbox je jednorozměrný (1D) — rozmísťuje po jedné ose (řádek nebo sloupec). Grid je dvourozměrný (2D) — řídí současně řádky i sloupce. Často se kombinují: Grid pro hlavní layout stránky, Flexbox uvnitř.

---

## Co bych ještě měl vědět (volně)

- **`order`** — bezrozměrné číslo (default 0). Položky s nižším order se zobrazí dříve. Užitečné pro **vizuální** přeuspořádání bez změny HTML (ale **pozor na přístupnost** — čtečka stále čte HTML pořadí).
- **`align-self`** — přepisuje `align-items` jen pro jednu položku. Když chceš jednu kartu zarovnat výš/níž než ostatní.
- **Stretch chování** — `align-items: stretch` (default) natáhne položky na výšku kontejneru. Proto všechny karty v řadě mají stejnou výšku **bez explicitního nastavení**.
- **Vendor prefixy historie** — ve starých prohlížečích (IE10, staré Safari) bylo třeba `-webkit-flex`, `-ms-flexbox`. Dnes řeší **PostCSS + Autoprefixer** automaticky podle `.browserslistrc`.
- **DevTools Flexbox inspektor** — Chrome/Firefox/Edge mají u flex kontejnerů ikonu, která vizualizuje hraniční čáry, volný prostor a osy přímo v okně. **Použij u zkoušky pro debug.**
- **Flexbox Froggy** ([flexboxfroggy.com](https://flexboxfroggy.com/#cs)) — gamifikované cvičení 24 úloh; pro samostatné drilování syntaxe.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném materiálu** ze `_materials/dat/03/spoluzaci-validovane/OM-WEB-Flexbox/README.md` — terminologie a struktura odpovídá učitelovým preferencím (kontejner, položka, hlavní/křížová osa, elasticita).
- ⚠️ **`align-content`** je v praxi používán zřídka — komise se na něj nemusí ptát hluboce. Pokud se dotkne, ber ho jako *"distribuce mezi řádky pro multi-row flexbox"*.
- ⚠️ **`order` přístupnost** — měnit pořadí přes `order` může matoucí pro slepé uživatele (čtečka jde podle DOM, ne CSS). U zkoušky komise nemusí řešit, ale pokud se ptá *"je `order` bezpečný?"* — odpověz *"vizuálně ano, pro screen readery problematické, lépe upravit HTML"*.

---

## Praktická příprava (pro 30 min u PC)

Trénuj tyto **5 modulů** ze zadaného assignmentu tak, abys je z prázdného CSS souboru napsal za **<25 minut**:

1. **Horizontální nav bar** — `display: flex`, `align-items: center`, `margin-left: auto`
2. **Hero centrování** — `display: flex`, `justify-content: center`, `align-items: center`
3. **Galerie s wrap** — `flex-wrap: wrap`, `gap`, `flex-grow`, `flex-basis`
4. **Cenové karty s margin-auto** — `display: flex`, vnořený `flex-direction: column`, `margin-top: auto`
5. **Media objekt** — `display: flex`, `align-items: flex-start`, `flex-shrink: 0`, `flex-grow: 1`, `min-width: 0`

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-09
