---
subject: SWI
number: 17
title: "Vlastnosti CSS"
tags: ["web", "css", "frontend"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Vlastnosti CSS** jsou parametry definující, jak prvky webové stránky **vypadají** — text, barvy, písma, rozložení, mezery. V této otázce projdu **CSS jednotky** (absolutní `px` × relativní `em`, `rem`, `%`, `vw`, `vh`), **barvy** (od názvů přes HEX a RGB až po HSL a moderní `oklch`), **CSS proměnné** (`var()` s `--name` v `:root`), **písma** (`font-family`, `font-size`, `@font-face` pro vlastní fonty) a **ligatury**.

---

## Klíčové pojmy

- **Vlastnost (property)** — pravidlo, **co** se má nastavit (`color`, `font-size`)
- **Hodnota (value)** — konkrétní nastavení (`red`, `16px`)
- **Jednotka** — typ číselné hodnoty (`px`, `em`, `rem`, `%`)
- **Absolutní jednotka** — pevná, nezávislá na kontextu (`px`)
- **Relativní jednotka** — odvozená od kontextu (`em`, `rem`, `%`, `vw`, `vh`)
- **CSS proměnná** — uživatelsky definovaná hodnota pro opakování (`--main-color`)
- **`:root`** — kořenový element dokumentu (= `<html>`); typické místo pro globální proměnné
- **`var()`** — funkce pro čtení CSS proměnné
- **`@font-face`** — pravidlo pro načtení vlastního písma ze souboru
- **Ligatura** — grafické spojení 2+ znaků do jednoho symbolu

---

## Hlavní výklad (5–10 min mluvení)

### 1. CSS jednotky — absolutní × relativní

#### Absolutní

| Jednotka | Význam |
|---|---|
| **`px`** | CSS pixel — **logický** pixel (na retina display = několik fyzických pixelů). Nezávisle na rodiči nebo viewportu. |

⚠️ "Absolutní" v CSS neznamená vždy stejná **fyzická** velikost — `px` je vázaný na **CSS pixel grid** prohlížeče, který se přizpůsobuje DPI. Na retina displeji je 1 CSS px = 2 fyzické pixely. Pro layout je ale stále **predvídatelný**.

#### Relativní

| Jednotka | Vztah | Příklad |
|---|---|---|
| **`em`** | k font-size **rodiče** | rodič 16px → 1.5em = 24px |
| **`rem`** | k font-size **kořene** (`<html>`) | root 16px → 1.5rem = 24px |
| **`%`** | k vlastnosti **rodiče** (záleží, jaké) | width 50% rodiče s 1000px = 500px |
| **`vw`** | k **šířce viewportu** | 50vw = 50 % šířky okna |
| **`vh`** | k **výšce viewportu** | 100vh = 100 % výšky okna |

**Klíčový rozdíl `em` × `rem`:**
- `em` se kaskáduje — **`em` v `em` v `em` násobí** (může jít po hierarchii nahoru)
- `rem` je **vždy** vůči root, předvídatelnější

**`%` se chová podle vlastnosti:**
- `width: 50%` → 50 % **šířky** rodiče
- `height: 50%` → 50 % **výšky** rodiče (jen pokud rodič má explicit height)
- `font-size: 150%` → 150 % font-size rodiče (=1.5em)

**Pro většinu případů preferuj:**
- `rem` pro typografii (font-size, line-height)
- `%` nebo `fr` pro layout šířky
- `vw` / `vh` pro viewport-based sizing (full-screen sekce)
- `px` pro **fixní okraje, borders, malé pixel-perfect detaily**

### 2. CSS barvy

Barva = **kombinace kanálů** (R, G, B + případně Alpha pro průhlednost).

#### Formáty barev

| Formát | Příklad | Kdy použít |
|---|---|---|
| **Named** (klíčová slova) | `red`, `blue`, `gainsboro` | rychlé prototypy, přesný 140 názvů |
| **HEX** | `#FF0000` | nejrozšířenější, kompaktní |
| **RGB** | `rgb(255, 0, 0)` | čitelnější než hex |
| **RGBA** | `rgba(0, 0, 0, 0.5)` | RGB s **průhledností** (alpha 0–1) |
| **HSL** (Hue, Saturation, Lightness) | `hsl(0, 100%, 50%)` | **intuitivnější ladění** — měnit jas/sytost beze změny odstínu |
| **HSLA** | `hsla(0, 100%, 50%, 0.5)` | HSL s alpha |
| **`oklch()`** | `oklch(70% 0.15 240)` | moderní, **HDR** podpora, lepší vnímání rozdílů |
| **`color-mix()`** | `color-mix(in srgb, red 50%, blue)` | míchání barev v CSS |

**HSL — proč intuitivnější:**
- **H (Hue)** — odstín 0–360° (0 = červená, 120 = zelená, 240 = modrá)
- **S (Saturation)** — sytost 0–100 % (0 = šedá, 100 = plná barva)
- **L (Lightness)** — jas 0–100 % (0 = černá, 50 = plná barva, 100 = bílá)

Pro **tlumenější verzi** modré stačí snížit S (např. `hsl(240, 50%, 50%)` místo `hsl(240, 100%, 50%)`). V HEX bys počítal nové hex čísla.

**Alpha kanál** = průhlednost. `0` = úplně průhledné, `1` = neprůhledné. `rgba(0,0,0,0.5)` = poloprůhledná černá.

⚠️ **Hex 3-znakový shortcut:** `#FFF` = `#FFFFFF` (bílá), `#0AB` = `#00AABB`. Funguje jen když mají dvojice stejné znaky.

### 3. CSS proměnné (custom properties)

CSS proměnné = **uživatelsky definované hodnoty**, znovu použitelné v celém stylesheet.

```css
:root {
    --main-color: #1b7f5f;
    --accent-color: #d17432;
    --base-spacing: 1rem;
    --font-stack: 'Inter', sans-serif;
}

.button {
    background: var(--main-color);
    padding: var(--base-spacing) calc(var(--base-spacing) * 2);
}
```

**Pravidla:**
- **Definice:** `--name: value;` (dvě pomlčky před jménem)
- **Použití:** `var(--name)` nebo `var(--name, fallback)`
- **`:root`** = globální rozsah (na celý dokument)
- **Lze definovat i na konkrétním elementu** — pak platí **jen v tom subtree** (kaskádují)
- **Kompletně dynamické** — JS může měnit za běhu (na rozdíl od Sass proměnných, které jsou kompilační)

**Výhody:**
1. **Jedno místo pro klíčové hodnoty** — barva, písmo, mezera. Změníš jednou, projeví se všude.
2. **Theme switching** — `[data-theme="dark"]` přepíše hodnoty proměnných, celý web změní vzhled.
3. **DRY** — neopakuješ `#1b7f5f` na 50 místech.

**Theme příklad:**
```css
:root {
    --bg: white;
    --text: black;
}
[data-theme="dark"] {
    --bg: #1a1a1a;
    --text: #f0f0f0;
}
body {
    background: var(--bg);
    color: var(--text);
}
```

### 4. Písma (typografie v CSS)

#### Vlastnosti písma

| Vlastnost | Co řídí | Příklad |
|---|---|---|
| `font-family` | rodina písem (s fallback chain) | `font-family: 'Inter', Arial, sans-serif;` |
| `font-size` | velikost | `font-size: 1rem;` |
| `font-weight` | tučnost (100–900, nebo `normal`/`bold`) | `font-weight: 700;` |
| `font-style` | kurzíva | `font-style: italic;` |
| `line-height` | výška řádku (1.5 = 1.5× font-size) | `line-height: 1.6;` |
| `letter-spacing` | mezera mezi znaky | `letter-spacing: 0.02em;` |
| `text-align` | zarovnání textu | `text-align: center;` |
| `text-decoration` | podtržení, přeškrtnutí | `text-decoration: underline;` |
| `text-transform` | velikost znaků | `text-transform: uppercase;` |

#### Generické rodiny (vždy fallback)

```css
font-family: 'Custom Font', Arial, sans-serif;
/*           ^^^^^^^^^^^^^                    konkrétní font */
/*                          ^^^^^             web-safe fallback */
/*                                 ^^^^^^^^^^ generická skupina */
```

| Generická skupina | Příklady | Kdy |
|---|---|---|
| `serif` | Times, Georgia | dlouhé texty, knihy |
| `sans-serif` | Arial, Helvetica, Inter | weby, UI |
| `monospace` | Courier, Consolas | kód |
| `cursive` | krasopis | dekorativní |
| `fantasy` | netradiční | nadpisy |

#### `@font-face` — vlastní písmo

Načtení **vlastního fontu** z externího souboru:

```css
@font-face {
    font-family: 'MujFont';
    src: url('/fonts/mujfont.woff2') format('woff2'),
         url('/fonts/mujfont.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

body {
    font-family: 'MujFont', sans-serif;
}
```

**Formáty:**
- **`.woff2`** — moderní, nejlepší komprese, browser support 95%+
- **`.woff`** — fallback pro starší prohlížeče
- **`.ttf` / `.otf`** — tradiční, větší soubory

**`font-display: swap`** — během načítání fontu se zobrazí fallback, pak se prohodí. Bez `swap` může být **invisible text flicker** (FOIT — Flash of Invisible Text).

### 5. Ligatury

**Ligatura** = **grafické spojení dvou nebo více znaků do jednoho glyfu** (symbolu). Typografická estetika a čitelnost.

**Typické ligatury:**
- "fi" → znak s propojeným bodem nad i a ratlíkem f
- "fl" → propojené f a l
- "ffi", "ffl" — víc znaků v jedné ligatuře

**V CSS:**
```css
font-feature-settings: "liga" on, "dlig" on;
/* "liga" — standardní ligatury (default zapnuté) */
/* "dlig" — discretionary (umělecké) ligatury (default vypnuté) */
```

**Ligatury v ikonových fontech (Font Awesome, Material Icons):**
```html
<i class="material-icons">favorite</i>
<!-- místo slova "favorite" se zobrazí ❤ -->
```

Font má v sobě nadefinované, že posloupnost znaků `f-a-v-o-r-i-t-e` reprezentuje glyf srdíčka. To je **ligatura na úrovni celého slova**. Snadné použití místo `<img>` ikon — stylovatelné jako text (`color`, `font-size`).

### 6. Způsoby zobrazení grafiky (bonus z xlsx)

| Způsob | Kdy použít |
|---|---|
| **`<img>`** | rastrová grafika (foto), velké obrázky, externí zdroje |
| **SVG inline** | vektorové ikony, loga; **stylovatelné CSS** (color, stroke, atd.) |
| **CSS tvary** | jednoduché geometrie (kruhy, rámečky) bez extra souboru |
| **`background-image`** | dekorativní pozadí, repeating patterns |
| **Font icons** | sady ikon (Font Awesome), **stylovatelné jako text** |

**SVG inline výhoda:** přímo v HTML, **CSS na něj sahá**:
```html
<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>
```
```css
svg circle { fill: red; transition: fill 0.3s; }
svg:hover circle { fill: blue; }
```

---

## Konkrétní příklady / kód

### CSS proměnné s theme switchingem
```css
:root {
    --bg: #ffffff;
    --text: #222222;
    --accent: #1b7f5f;
}

[data-theme="dark"] {
    --bg: #1a1a1a;
    --text: #f0f0f0;
    --accent: #4dd0a8;
}

body {
    background: var(--bg);
    color: var(--text);
}

a { color: var(--accent); }
```

```html
<body data-theme="dark">  <!-- aplikuje dark theme -->
```

### Typografie s rem hierarchií
```css
:root { font-size: 16px; }   /* base */

h1 { font-size: 2.5rem; line-height: 1.2; }    /* 40px */
h2 { font-size: 1.875rem; line-height: 1.3; }  /* 30px */
p  { font-size: 1rem; line-height: 1.6; }      /* 16px */
```

### Custom font + fallback
```css
@font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

body {
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
}
```

### HSL pro variace barvy
```css
.btn-primary { background: hsl(150, 60%, 40%); }
.btn-primary:hover { background: hsl(150, 60%, 30%); }    /* tmavší stejnou barvou */
.btn-primary:disabled { background: hsl(150, 20%, 40%); }  /* méně sytá */
```

V HEX bys musel přepočítávat. V HSL měníš **jen jeden kanál**.

---

## Vztahy / kontrasty

- **`em` × `rem`** — `em` se kaskáduje (multiplikuje), `rem` je vždy vůči root. Pro typografii: **rem**. Pro vnitřní spacing v komponentě: někdy **em** (škálování s textem).
- **`px` × `rem`** — `px` je nezávislé na user font preference, `rem` ji respektuje (uživatel může zvětšit text v prohlížeči). Pro **přístupnost** preferuj `rem`.
- **HEX × HSL** — HEX je kompaktní, ale **neintuitivní** pro variace. HSL je delší, ale **snadno měnit jas/sytost**. Pro design system preferuj HSL nebo CSS proměnné.
- **CSS proměnné × Sass proměnné** — Sass jsou **kompilační** (převedou se na statické hodnoty), CSS proměnné jsou **runtime** (lze měnit JS, kaskádují, mají scope).
- **`<img>` × SVG inline × Font icons** — `<img>` pro foto, SVG pro vektorové ikony se stylováním, font icons pro velké sady ikon (FA).

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi `em` a `rem`?
**A:** `em` je relativní k font-size **rodičovského** elementu — kaskáduje, takže nesting násobí (1.5em ve 1.5em rodiči = 2.25em base). `rem` je relativní k font-size **kořenového** elementu (`<html>`) — vždy předvídatelný, nezávisí na hierarchii. Pro typografii preferuj `rem`.

**Q:** Vyjmenuj absolutní a relativní CSS jednotky.
**A:** **Absolutní:** `px` (CSS pixel). **Relativní:** `em` (k rodiči), `rem` (k root), `%` (k rodiči, dle vlastnosti), `vw`/`vh` (viewport šířka/výška), `vmin`/`vmax`.

**Q:** V čem je rozdíl mezi RGB a HSL formátem?
**A:** RGB míchá tři kanály (červená, zelená, modrá). HSL používá Hue (odstín 0–360°), Saturation (sytost 0–100 %), Lightness (jas 0–100 %). HSL je **intuitivnější pro variace** — snížíš jas, dostaneš tmavší verzi stejné barvy bez přepočítávání.

**Q:** Co jsou CSS proměnné a kde se definují?
**A:** Uživatelsky definované hodnoty (custom properties) pro opakované použití. Definují se prefixem `--` (např. `--main-color: red`), čtou přes `var(--main-color)`. Globální rozsah typicky v `:root` selector. Hlavní výhody: jedno místo pro definici, snadné theme switching, runtime dynamika (JS může měnit).

**Q:** K čemu slouží `@font-face`?
**A:** Pravidlo pro načtení vlastního písma z externího souboru. Uvedu `font-family` jméno a cestu k souboru (`.woff2`, `.woff`, `.ttf`). Pak používám jméno v `font-family` jako kterýkoliv jiný font. Doplnění o `font-display: swap` — během načítání fontu se zobrazí fallback písmo, pak se prohodí.

**Q:** Co je ligatura?
**A:** Grafické spojení dvou nebo více znaků do jednoho glyfu. Typografické (např. "fi" → propojené f-i) nebo umělecké. V ikonových fontech může ligatura zastoupit celé slovo glyfem ikony (např. slovo "favorite" → srdíčko). V CSS přes `font-feature-settings`.

**Q:** Jak uděláš poloprůhlednou černou v CSS?
**A:** `rgba(0, 0, 0, 0.5)` — RGB s alpha 0.5 (50 % průhlednost). Alternativy: `hsla(0, 0%, 0%, 0.5)`, `#00000080` (hex s alpha — moderní browsery), `color: black; opacity: 0.5;` (ale to změní průhlednost **celého** elementu, ne jen barvy).

**Q:** Jaký je rozdíl mezi `width: 100%` a `width: 100vw`?
**A:** `100%` je 100 % **rodičovského** kontejneru — pokud rodič má 800px, je to 800px. `100vw` je 100 % **viewport** šířky — vždy celá šířka okna prohlížeče. Pro full-page sekce použij `100vw`, pro fluidní layout uvnitř `100%`.

---

## Co bych ještě měl vědět (volně)

- **`calc()`** — kombinace jednotek za běhu: `calc(100% - 50px)` (užitečné, když chceš odečíst pevnou hodnotu od relativní).
- **`min()`, `max()`, `clamp()`** — moderní matematické funkce. `clamp(1rem, 2vw, 3rem)` = mezi 1rem a 3rem, ideálně 2vw.
- **`currentColor`** — speciální hodnota = aktuální `color`. Užitečné pro SVG ikony, které se barví podle textu.
- **`font-feature-settings`** — pokročilé typografické featury (ligatury, číslice, atd.).
- **Variable fonts** — moderní formát fontů, jeden soubor obsahuje všechny varianty (váha, šířka, slant). Místo 8 souborů jen 1, plynulé interpolace.
- **`accent-color`** — moderní vlastnost pro barvu nativních UI elementů (checkbox, radio, progress).

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném DOCX** (`Vlastnosti_CSS_Hudec_Cihula.docx`) — terminologie a struktura odpovídá učitelovým preferencím (pojmenování formátů barev, jednotky, ligatury).
- ⚠️ **`oklch()`, `color-mix()`** zmíněné v materiálu — moderní funkce s rostoucím podporou. Pro maturitu drž **HSL** jako "moderní intuitivní" volbu, `oklch` zmiň jen jako *"další moderní vývoj pro HDR"*.
- ⚠️ **Variable fonts** nejsou v materiálu — doplněno z obecných znalostí. Komise se na ně nemusí ptát.
- ⚠️ **Ligatury v ikonových fontech** — ne všechny ikonové fonty je podporují. Material Icons ano, Font Awesome ne (FA používá pseudo-element s `content`).

---

## Status

- **Sebehodnocení (před):** 3/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-10
