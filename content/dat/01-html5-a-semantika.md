---
subject: DAT
number: 1
title: "HTML5 a sémantika"
tags: ["web", "html", "frontend", "sémantika"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **HTML (HyperText Markup Language)** je značkovací jazyk pro strukturu webových stránek. **HTML5** je pátá hlavní verze (od roku 2014) a přinesla **sémantické tagy** (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`), nativní podporu **multimédií** (`audio`, `video`, `canvas`), **API** pro práci v prohlížeči (geolokace, lokální storage) a vylepšené formuláře. V této otázce projdu **strukturu HTML5 dokumentu, sémantické tagy a typografii na webu**.

---

## Klíčové pojmy

- **HTML** — značkovací jazyk pro strukturu webové stránky
- **Tag (značka)** — jednotka HTML, např. `<h1>`, `<p>`, `<img>`. Většinou párová (`<p>...</p>`), některé samouzavírací (`<img>`, `<br>`, `<hr>`)
- **Atribut** — dodatečná informace v tagu, např. `<img src="..." alt="...">`
- **Element** — kompletní tag s obsahem (otevírací + obsah + uzavírací)
- **DOM** (Document Object Model) — strom elementů, jak ho prohlížeč interpretuje
- **Sémantický tag** — tag, který nese **význam** (jaký druh obsahu), ne jen vzhled (`header` vs. `div`)
- **Atomový (inline) × blokový element** — `span` (inline) × `div` (blok)
- **Validní HTML** — odpovídá specifikaci W3C, dá se zkontrolovat přes [validator.w3.org](https://validator.w3.org/)
- **Typografie** — nauka o písmu, čitelnosti, kompozici textu na webu

---

## Hlavní výklad (5–10 min mluvení)

### 1. Struktura HTML5 dokumentu

Každá HTML5 stránka začíná takto:

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Název stránky</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- obsah stránky -->
</body>
</html>
```

**Co každá část dělá:**
- **`<!DOCTYPE html>`** — řekne prohlížeči, že je to **HTML5**. V HTML4 to byla dlouhá DTD definice; v HTML5 stačí těchto 15 znaků.
- **`<html lang="cs">`** — kořenový element. `lang="cs"` říká, že obsah je v češtině (důležité pro čtečky obrazovky, vyhledávače, hyphenation).
- **`<head>`** — meta-informace, **NE viditelný obsah**. Title, charset, link na CSS, scripty, SEO meta.
- **`<meta charset="UTF-8">`** — kódování znaků. Bez UTF-8 by se diakritika rozsypala na otazníky.
- **`<meta name="viewport" ...>`** — pro responzivitu na mobilech. Bez ní by byla stránka na mobilu zoom-out.
- **`<title>`** — text v záložce prohlížeče, ve výsledcích Google, ve sdílených linkách.
- **`<body>`** — viditelný obsah, kód, který uživatel vidí.

### 2. Sémantické tagy (HLAVNÍ NOVINKA HTML5)

Před HTML5 se vše dělalo **`<div class="header">`**, **`<div class="nav">`** atd. — **bez významu**, jen "kontejner". HTML5 zavedl **sémantické tagy**, které říkají *"co tahle část znamená"*:

```html
<body>
    <header>...</header>      <!-- hlavička stránky / sekce -->
    <nav>...</nav>             <!-- navigace -->
    <main>                     <!-- hlavní unikátní obsah stránky (1× per stránka) -->
        <article>             <!-- samostatný uzavřený obsah (článek, post, komentář) -->
            <h1>Nadpis</h1>
            <section>          <!-- tematická sekce -->
                ...
            </section>
            <section>...</section>
        </article>
        <aside>...</aside>     <!-- doplňkový obsah (sidebar, související odkazy) -->
    </main>
    <footer>...</footer>       <!-- patička -->
</body>
```

**Další sémantické tagy:**
- `<figure>` + `<figcaption>` — obrázek/diagram s popiskem
- `<time datetime="2026-05-09">9. května</time>` — datum/čas strojově čitelný
- `<mark>` — zvýrazněný text
- `<details>` + `<summary>` — rozbalovací sekce (nativně, bez JS)
- `<address>` — kontaktní info

**Proč sémantika?**
1. **Přístupnost** (čtečky obrazovky) — slepým uživatelům čtečka říká *"tady začíná hlavní obsah"*, ne *"tady je div"*
2. **SEO** — Google vyhledávač chápe strukturu, lépe indexuje
3. **Údržba kódu** — programátor po měsíci vidí strukturu, ne `div` soup
4. **Výchozí styly** — sémantické tagy mají rozumné default styly

### 3. Základní (nesémantické) tagy

| Tag | Význam | Příklad |
|---|---|---|
| `<h1>` – `<h6>` | nadpisy hierarchie | `<h1>Hlavní</h1>` |
| `<p>` | odstavec | `<p>Text...</p>` |
| `<a>` | odkaz | `<a href="https://...">text</a>` |
| `<img>` | obrázek | `<img src="..." alt="popis">` |
| `<ul>` / `<ol>` / `<li>` | seznam (un/ordered) + položka | `<ul><li>...</li></ul>` |
| `<table>`, `<tr>`, `<td>`, `<th>` | tabulka *(viz DAT 7)* | |
| `<form>`, `<input>`, `<label>`, `<button>` | formulář | |
| `<div>` | obecný blokový kontejner (bez sémantiky) | |
| `<span>` | obecný inline kontejner (bez sémantiky) | |

⚠️ **`<h1>` má být na stránce právě jednou.** Hlavní nadpis. Hierarchii dodržuj — neskákej z `<h1>` na `<h4>`.

### 4. Atributy

```html
<a href="https://example.com" target="_blank" rel="noopener">odkaz</a>
<img src="kytka.jpg" alt="Bílá kopretina" width="300" height="200">
<input type="email" id="email" name="email" required placeholder="vas@email.cz">
<div class="card primary" id="hlavni-karta" data-id="42">...</div>
```

**Univerzální atributy:**
- **`id`** — unikátní identifikátor (jen jeden element na stránce)
- **`class`** — třída pro CSS / JS, může být víc (oddělené mezerou: `class="card primary"`)
- **`data-*`** — vlastní data (`data-id`, `data-target`) — pro JS
- **`title`** — tooltip při hover
- **`style`** — inline CSS (raději vyhnout, používej třídy)

**Pro odkazy `<a>`:**
- `href` — kam odkazuje (URL nebo `#id`)
- `target="_blank"` — otevři v novém okně/tabu
- `rel="noopener"` — bezpečnostní pravidlo pro `_blank` (jinak nový tab může manipulovat s rodičem)

**Pro obrázky `<img>`:**
- `src` — URL obrázku
- `alt` — **POVINNÝ** alternativní text (pro slepé + když se obrázek nenačte)
- `width` / `height` — rozměry (i v CSS, ale v HTML pomáhá prohlížeči s layoutem)

### 5. Formuláře (DAT 1 dotyk + DAT 19 hloubka)

```html
<form action="/submit" method="POST">
    <label for="jmeno">Jméno:</label>
    <input type="text" id="jmeno" name="jmeno" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">

    <label>
        <input type="checkbox" name="newsletter">
        Chci newsletter
    </label>

    <button type="submit">Odeslat</button>
</form>
```

**HTML5 typy inputů:** `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `time`, `color`, `range`, `file`, `checkbox`, `radio`, `hidden`. Browser je **validuje** automaticky (např. `type="email"` musí mít `@`).

### 6. Typografie na webu

**Font-family v CSS:**
```css
body {
    font-family: 'Open Sans', Arial, sans-serif;
    /* fallback řetěz: pokud Open Sans není, zkus Arial, pak generic sans-serif */
}
```

**Generické rodiny (vždy fallback):**
- `serif` — patkové (Times)
- `sans-serif` — bezpatkové (Arial, Helvetica)
- `monospace` — monoprostorové (Courier — pro kód)
- `cursive` — kurzíva
- `fantasy` — dekorativní

**Web-safe fonty (na všech systémech):** Arial, Helvetica, Times New Roman, Courier New, Georgia, Verdana.

**Custom fonty přes `@font-face` nebo Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Inter', sans-serif; }
```

**Jednotky velikosti:**
- **`px`** — absolutní pixel; nereaguje na zoom uživatele
- **`em`** — relativní k font-size **rodiče** (1.5em = 1.5× rodič)
- **`rem`** — relativní k font-size **kořenu** (`html`); předvídatelnější než em
- **`%`** — procento z rodiče
- **`vw`/`vh`** — procento z viewportu (viewport width/height)

**Doporučení:** pro většinu fontů použij **`rem`** (přístupnost — uživatel může v prohlížeči zvětšit písmo).

**Další typografické vlastnosti:**
- `line-height: 1.5` — výška řádku (1.5× font-size)
- `letter-spacing: 0.05em` — odsazení mezi znaky
- `text-align: left/center/right/justify`
- `font-weight: 400/700` (normální / tučné)
- `font-style: italic`

### 7. HTML5 vs. HTML4 — co se změnilo

- **DOCTYPE** zkrácený (`<!DOCTYPE html>` místo dlouhé DTD)
- **Sémantické tagy** (header, nav, main, article, section, aside, footer)
- **Multimédia nativně** (`<audio>`, `<video>`, `<canvas>`)
- **Vylepšené formuláře** (nové `type` hodnoty, validace)
- **Web Storage API** (localStorage, sessionStorage)
- **Geolocation, WebSocket, Drag & Drop** API

---

## Konkrétní příklady / kód

### Minimum funkční HTML5 stránky
```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Blog</title>
</head>
<body>
    <header>
        <h1>Můj blog</h1>
        <nav>
            <ul>
                <li><a href="/">Domů</a></li>
                <li><a href="/o-mne">O mně</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <article>
            <h2>Můj první článek</h2>
            <time datetime="2026-05-09">9. května 2026</time>
            <p>Lorem ipsum...</p>
        </article>
    </main>
    <footer>
        <p>&copy; 2026 Harry Deimling</p>
    </footer>
</body>
</html>
```

### Formulář s validací
```html
<form>
    <label for="vek">Věk (18+):</label>
    <input type="number" id="vek" name="vek" min="18" max="120" required>

    <label for="datum">Datum narození:</label>
    <input type="date" id="datum" name="datum">

    <button type="submit">Pokračovat</button>
</form>
```

---

## Vztahy / kontrasty

- **HTML × CSS × JS** — HTML strukturu (kostry budovy), CSS vzhled (omítka, barvy), JS chování (výtahy, dveře). Tyhle tři patří k sobě.
- **Sémantický tag × `<div>`** — `<div>` je "krabice bez popisku". `<header>`, `<article>`, `<section>` jsou "krabice s popiskem". Kdykoliv můžeš použít sémantický, použij ho.
- **Inline × blokový element** — blokový (`div`, `p`, `h1`) zabírá celou šířku rodiče a začíná na novém řádku. Inline (`span`, `a`, `strong`) zabírá jen tolik, kolik potřebuje, a zůstává v řádku.
- **Atribut `id` × `class`** — `id` jen jeden na stránce (unikátní). `class` může být více, jeden element může mít víc tříd, jedna třída může být na víc elementech.
- **`alt` × `title` u obrázku** — `alt` je **povinný** (alternativní text pro slepé / nenačtený obrázek). `title` je tooltip (hover).

---

## Časté otázky komise

**Q:** Co znamená HTML5 a co přinesl oproti HTML4?
**A:** Pátá hlavní verze HTML (od 2014). Hlavní změny: zkrácený `<!DOCTYPE html>`, sémantické tagy (header, nav, main, article, section, aside, footer), nativní multimédia (audio, video, canvas), vylepšené formuláře (nové `type` hodnoty s automatickou validací) a JavaScript API jako geolokace nebo localStorage.

**Q:** Co jsou sémantické tagy a proč je používáme?
**A:** Tagy, které nesou **význam**, ne jen vzhled. `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`. Důvody: přístupnost (čtečky obrazovky), SEO (Google chápe strukturu), čitelnost kódu, výchozí styly.

**Q:** Vyjmenuj alespoň 5 sémantických tagů a kdy je použiješ.
**A:** `<header>` — hlavička stránky/sekce. `<nav>` — navigace. `<main>` — hlavní obsah (1× per stránka). `<article>` — samostatný uzavřený obsah (článek, post). `<section>` — tematická sekce. `<aside>` — doplňkový obsah. `<footer>` — patička.

**Q:** Jaký je rozdíl mezi `id` a `class`?
**A:** `id` musí být **unikátní** v rámci celé stránky — jeden element s daným `id`. `class` může být na více elementech a jeden element může mít více tříd. `id` se hodí pro JavaScript/anchor odkazy (`#`), `class` pro stylování.

**Q:** Proč musí mít `<img>` atribut `alt`?
**A:** **Přístupnost** — čtečky obrazovky čtou alt text slepým uživatelům. **Failover** — když se obrázek nenačte (špatná URL, pomalá síť), zobrazí se alt text. **SEO** — Google ho používá k indexaci obrázků.

**Q:** Co je rozdíl mezi `<div>` a `<section>`?
**A:** `<div>` je **bez sémantiky** — obecný blokový kontejner pro stylování. `<section>` je **sémantický** — říká *"tematická sekce obsahu"* a měla by mít vlastní nadpis (`<h1>`–`<h6>`).

**Q:** Co je `<!DOCTYPE html>` a proč ho píšeme?
**A:** Deklarace, že jde o HTML5 dokument. Bez ní prohlížeč spustí *"quirks mode"* — režim kompatibility se starými stránkami, kde se chová nepředvídatelně. Vždycky první řádek HTML souboru.

**Q:** Vysvětli rozdíl mezi `em` a `rem` v CSS.
**A:** `em` je relativní k **font-size rodičovského** elementu — když je rodič 16px a já dám 1.5em, mám 24px. `rem` je relativní k **font-size kořenového** elementu (`html`) — předvídatelnější, protože nezávisí na hierarchii rodičů. Pro většinu fontů preferuj `rem`.

---

## Co bych ještě měl vědět (volně)

- **`<picture>` + `<source>`** — responzivní obrázky. Browser sám vybere správnou variantu podle viewportu.
- **`<meta name="description">`** — Google ji zobrazuje pod nadpisem ve výsledcích vyhledávání.
- **`<link rel="icon">`** — favicon (ikonka v záložce prohlížeče).
- **Open Graph tagy** (`<meta property="og:title">` atd.) — pro pěkné náhledy při sdílení na sociálních sítích.
- **WAI-ARIA atributy** (`aria-label`, `role`) — pro přístupnost, doplnění sémantiky tam, kde nestačí.
- **HTML entity** — `&nbsp;` (nedělitelná mezera), `&amp;` (znak `&`), `&copy;` (©), `&lt;` `&gt;` (znaky < >).

---

## ⚠️ Nejisté / k ověření

- ⚠️ **V `_materials/dat/01/` není žádný materiál** od učitele ani spolužáků (ani prchal/, ani spoluzaci-validovane/, ani spoluzaci-nezarucene/). Celá tato část je **doplněna z obecných znalostí** podle xlsx Popisu *"Struktura stránky, sémantické tagy v HTML5, typografie na webu"*. Pokud má učitel specifické důrazy (např. konkrétní seznam sémantických tagů, které vyžaduje), tato verze je nemusí pokrývat. Při čtení vyber priority podle vlastního úsudku.
- ⚠️ **HTML5 specifikace** se technicky stále vyvíjí jako "WHATWG HTML Living Standard". Termín "HTML5" je marketingový pro to, co prohlížeče od ~2014 podporují. Pro maturitu drž *"HTML5 přinesl …"* tradiční výklad.
- ⚠️ **`<main>` má být v dokumentu jen jednou** — typická otázka. Ale technicky se to nevynucuje (browser to nepoznáš). Drž to jako pravidlo.

---

## Praktická příprava (pro 30 min u PC)

Trénuj tyto vzory tak, abys je z prázdného souboru napsal za **<10 minut**:

1. **Minimum HTML5 dokument** (DOCTYPE, html, head s charset+viewport+title, body)
2. **Sémantická struktura blogu** (header s nav, main s article+aside, footer)
3. **Formulář** s minimálně 3 různými `type` inputu + label + button
4. **Tabulka** s thead, tbody, th, td *(detail viz DAT 7)*
5. **Obrázek s figure+figcaption** s alt atributem

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-09
