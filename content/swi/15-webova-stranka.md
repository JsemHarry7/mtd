---
subject: SWI
number: 15
title: "Webová stránka (HTML)"
tags: ["web", "html", "frontend", "sémantika"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **HTML (HyperText Markup Language)** je **značkovací jazyk** pro **sémantické definování struktury** webové stránky. **Neřeší vzhled** (od toho je CSS), ale **význam** jednotlivých částí — co je navigace, co hlavní obsah, co patička. Skládá se z **tagů** (značek, které obalují obsah) a **atributů** (doplňující informace tagu). Každá HTML5 stránka má pevnou kostru: `<!DOCTYPE html>`, `<html>` s atributem `lang`, uvnitř `<head>` s metadaty a `<body>` s viditelným obsahem. Hierarchii nadpisů řeší **header tagy `<h1>`–`<h6>`**.

---

## Klíčové pojmy

- **HTML** — HyperText Markup Language, značkovací jazyk pro strukturu stránek
- **Tag (značka)** — instrukce pro browser, obaluje obsah a dává mu význam
- **Párový × nepárový tag** — párový má otevírací + uzavírací (`<p>...</p>`), nepárový stojí sám (`<img>`, `<br>`)
- **Element** — kompletní jednotka v DOMu (tag + obsah + uzavírací tag)
- **Atribut** — doplňující informace v tagu (`<img src="..." alt="...">`)
- **Globální atribut** — funguje na jakýkoliv tag (`id`, `class`, `style`, `title`, `data-*`)
- **Specifický atribut** — patří jen ke konkrétnímu tagu (`href` pro `<a>`, `src` pro `<img>`)
- **`<head>`** — metadata o stránce, **neviditelná** v body (kromě title)
- **`<body>`** — viditelný obsah stránky
- **Header tagy (h1–h6)** — hierarchie nadpisů, **NE element `<header>`**
- **Sémantický tag** — nese **význam** (`<nav>`, `<article>`) na rozdíl od `<div>` (bez sémantiky)

---

## Hlavní výklad (5–10 min mluvení)

### 1. Co je HTML a k čemu

**HTML = struktura.** **CSS = vzhled.** **JS = chování.** Trojice, která dělá web web. HTML říká *"tady je nadpis, tady seznam, tady odkaz"*; CSS *"nadpis bude modrý, seznam bez teček"*; JS *"po kliku na tlačítko se otevře dialog"*.

HTML je **značkovací** (markup), ne programovací jazyk — nemá proměnné, smyčky, podmínky. Jen popisuje, co je co.

### 2. Kostra HTML5 stránky

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Popis stránky pro Google">
    <title>Název stránky</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico">
</head>
<body>
    <!-- viditelný obsah -->
</body>
</html>
```

- **`<!DOCTYPE html>`** — řekne browseru, že je to **HTML5**. Bez něj browser jede v *"quirks mode"* (kompatibilita se starými stránkami, nepředvídatelné chování).
- **`<html lang="cs">`** — kořenový element s **language atributem** (pro čtečky obrazovky, vyhledávače, automatický překlad).
- **`<head>`** — meta-informace **neviditelné v body** (kromě `<title>`).
- **`<body>`** — co uživatel vidí.

### 3. Co patří do `<head>`

| Tag | Účel |
|---|---|
| `<meta charset="UTF-8">` | kódování znaků (UTF-8 pro češtinu) |
| `<meta name="viewport" content="...">` | **responzivita** na mobilech |
| `<meta name="description" content="...">` | SEO — Google zobrazuje pod nadpisem |
| `<title>...</title>` | text v záložce + SEO klíč |
| `<link rel="stylesheet" href="...">` | připojí CSS |
| `<link rel="icon" href="...">` | favicon (ikonka v záložce) |
| `<script src="...">` | připojí JavaScript |

⚠️ **Bez viewport meta** je stránka na mobilu zoom-out (celá v malinkém rozměru). Esenciální pro responsive.

### 4. Tagy — párové × nepárové

**Párové** (otevírací + obsah + uzavírací):
```html
<p>Tohle je odstavec.</p>
<div class="karta">Obsah</div>
<a href="https://...">Odkaz</a>
```

**Nepárové (samouzavírací)** — nemají obsah:
```html
<img src="kytka.jpg" alt="Bílá kopretina">
<br>     <!-- zalomení řádku -->
<hr>     <!-- horizontální čára -->
<input type="text">
<meta charset="UTF-8">
```

V **XHTML stylu** se zapisují s lomítkem: `<br />`. V HTML5 je to **volitelné** — `<br>` i `<br />` jsou ekvivalentní.

### 5. Atributy

**Atribut = doplňující info v tagu**, ve formátu `název="hodnota"`:

```html
<img src="foto.jpg" alt="Popis obrázku" width="300" height="200">
<!--    ^^^^^^^^^^^^ specifické                                    -->
<!--                                ^^^^^^^^^^^                    -->

<div id="hlavni" class="karta primarni" title="Tooltip">
<!--    ^^^^^^^ unikátní v rámci stránky                            -->
<!--             ^^^^^^^^^^^^^^^^^^ může být víc tříd, oddělené mezerou -->
```

#### Globální atributy (na **jakýkoliv** tag)

| Atribut | Účel |
|---|---|
| `id` | **unikátní** identifikátor (jen 1× na stránce), pro JS / CSS / kotvy `#` |
| `class` | třída pro CSS / JS — víc tříd oddělených mezerou |
| `style` | inline CSS (`style="color: red"`) — **vyhýbat se** |
| `title` | tooltip při hover |
| `data-*` | vlastní data (`data-id`, `data-target`) — pro JS |
| `hidden` | element je skrytý |
| `lang` | jazyk obsahu (přístupnost) |

#### Specifické atributy (pro konkrétní tag)

| Tag | Atribut | Příklad |
|---|---|---|
| `<a>` | `href`, `target`, `rel` | `<a href="/" target="_blank" rel="noopener">` |
| `<img>` | `src`, `alt`, `width`, `height` | `<img src="..." alt="...">` |
| `<input>` | `type`, `name`, `value`, `placeholder`, `required` | `<input type="email" required>` |
| `<form>` | `action`, `method` | `<form action="/submit" method="POST">` |

#### `alt` u `<img>` — povinný

```html
<img src="kytka.jpg" alt="Bílá kopretina na louce">
```

Důvody:
- **Přístupnost** — čtečka obrazovky čte alt slepému uživateli
- **Failover** — když se obrázek nenačte (špatná URL, slabá síť), zobrazí se alt text
- **SEO** — Google ho používá k indexaci obrázků

Pokud je obrázek **čistě dekorativní** (např. divider), použij **`alt=""`** (prázdný) — čtečka ho přeskočí.

### 6. Header tagy `<h1>`–`<h6>` (hierarchie nadpisů)

**Nezaměňovat s elementem `<header>`!** Header tagy jsou nadpisy.

```html
<h1>Hlavní nadpis (jen 1× na stránce)</h1>
<h2>Sekce</h2>
<h3>Podsekce</h3>
<h4>...</h4>
<h5>...</h5>
<h6>Nejmenší úroveň</h6>
```

**Pravidla:**
- **`<h1>` jen jednou** na stránku (hlavní téma)
- **Neskákej** v hierarchii (z `<h1>` na `<h4>`)
- **Hierarchii dodržuj** podle **významu**, ne podle velikosti písma (na velikost je CSS `font-size`)
- **Pro SEO:** Google používá hierarchii k pochopení struktury

⚠️ **Past:** `<header>` = sémantický element pro hlavičku stránky/sekce. **Není to to samé** jako `<h1>`–`<h6>`.

### 7. Sémantické tagy *(detail v DAT 1)*

HTML5 přidal **sémantické tagy**, které říkají *"co tahle část znamená"* (přístupnost, SEO, čitelnost kódu):

```html
<body>
    <header>...</header>      <!-- hlavička stránky / sekce -->
    <nav>...</nav>             <!-- navigace -->
    <main>                     <!-- hlavní obsah (1× per stránka) -->
        <article>...</article> <!-- samostatný uzavřený obsah -->
        <section>...</section> <!-- tematická sekce -->
        <aside>...</aside>     <!-- doplňkový obsah -->
    </main>
    <footer>...</footer>       <!-- patička -->
</body>
```

Detail viz **`_notes/dat/01-html5-a-semantika.md`** — DAT 1 to pokrývá hluboce.

### 8. Inline × blokové elementy

| Typ | Chování | Příklady |
|---|---|---|
| **Blokový** | Zabírá **celou šířku** rodiče, začíná na **novém řádku** | `<div>`, `<p>`, `<h1>`-`<h6>`, `<section>`, `<header>` |
| **Inline** | Zabírá **jen tolik**, kolik potřebuje, **zůstává v řádku** | `<span>`, `<a>`, `<strong>`, `<em>`, `<img>` |
| **Inline-block** | Hybrid — chová se inline, ale lze nastavit `width`/`height` | `<input>`, `<button>` (částečně) |

⚠️ **`<img>` je inline** — proto pod ním často vznikne mezera. Lze přepnout v CSS `display: block`.

### 9. HTML entity — speciální znaky

Pro znaky, které mají v HTML zvláštní význam, nebo jsou těžko napsatelné:

| Entita | Znak | Význam |
|---|---|---|
| `&nbsp;` | (nedělitelná mezera) | Nezalomí se na konci řádku |
| `&amp;` | `&` | ampersand |
| `&lt;` | `<` | menší než |
| `&gt;` | `>` | větší než |
| `&quot;` | `"` | uvozovky |
| `&copy;` | © | copyright |
| `&trade;` | ™ | trademark |

**Past:** pokud chceš v HTML zobrazit `<` nebo `>` jako text (ne jako tag), **MUSÍŠ použít entity** `&lt;` a `&gt;`. Jinak browser interpretuje jako tag.

### 10. Validní HTML

**Validní HTML** = odpovídá specifikaci W3C. Kontrola přes [validator.w3.org](https://validator.w3.org).

**Klasické chyby:**
- Nezavřený párový tag (`<div>` bez `</div>`)
- Špatné vnořování (`<p><div></div></p>` — div nesmí být uvnitř p)
- Chybějící `alt` u `<img>`
- Duplicitní `id` na stránce

---

## Konkrétní příklady / kód

### Plná kostra stránky
```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Můj osobní blog o programování">
    <title>Můj blog | Harry</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico">
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
            <header>
                <h2>Můj první článek</h2>
                <time datetime="2026-05-11">11. května 2026</time>
            </header>
            <p>Lorem <strong>ipsum</strong> <em>dolor</em> sit amet.</p>
            <figure>
                <img src="kytka.jpg" alt="Bílá kopretina">
                <figcaption>Kopretina na louce.</figcaption>
            </figure>
        </article>
    </main>
    <footer>
        <p>&copy; 2026 Harry Deimling</p>
    </footer>
</body>
</html>
```

### Atributy demonstrace
```html
<!-- Odkaz s plnou specifikací -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer" title="Otevře externí stránku">
    Externí odkaz
</a>

<!-- Obrázek s rozměry a fallback alt -->
<img src="logo.png" alt="Logo firmy" width="200" height="100" loading="lazy">

<!-- Element s víc třídami a data atributy -->
<div id="produkt-42" class="card card--featured" data-product-id="42" data-price="199">
    Obsah karty
</div>
```

---

## Vztahy / kontrasty

- **HTML × CSS × JS** — HTML struktura, CSS vzhled, JS chování. Tři pilíře webu.
- **Tag × element** — tag je značka (`<p>`), element je celek (tag + obsah + uzavírací).
- **`<header>` × `<h1>`** — `<header>` je sémantická hlavička, `<h1>` je hlavní **nadpis**. Klidně může být `<h1>` uvnitř `<header>`.
- **Atribut × CSS vlastnost** — atribut je v HTML (`width="200"`), CSS vlastnost v CSS (`width: 200px`). Pro vzhled raději CSS.
- **`id` × `class`** — `id` jen 1× na stránce (unikátní), `class` může být víc + víc tříd na elementu.
- **Inline × blokový element** — blokový celá šířka + nový řádek, inline jen co potřebuje.
- **Sémantický × nesémantický** — `<article>` říká *"samostatný obsah"*, `<div>` říká *"krabice"*. Sémantický preferuj.

---

## Časté otázky komise

**Q:** Co je HTML a k čemu slouží?
**A:** HyperText Markup Language — **značkovací jazyk pro strukturu webové stránky**. Není programovací (žádné proměnné, smyčky). Skládá se z tagů, které obalují obsah a dávají mu sémantický význam. Vzhled řeší CSS, chování JS.

**Q:** Jaký je rozdíl mezi párovým a nepárovým tagem?
**A:** **Párový** má otevírací a uzavírací značku, obsahuje obsah mezi nimi (`<p>text</p>`). **Nepárový** stojí sám, **neobsahuje obsah** (`<img>`, `<br>`, `<meta>`). V XHTML se nepárové psaly s lomítkem `<br />`, v HTML5 volitelné.

**Q:** Co patří do `<head>` a co do `<body>`?
**A:** **`<head>`** obsahuje **metadata** — info o stránce, **neviditelné** v body (kromě title): charset, viewport, title, link na CSS, meta description pro SEO, favicon. **`<body>`** obsahuje **viditelný obsah** — vše, co uživatel uvidí.

**Q:** Co je rozdíl mezi atributy `id` a `class`?
**A:** **`id`** musí být **unikátní** v rámci celé stránky — jeden element s daným id. **`class`** může být na více elementech a jeden element může mít více tříd (oddělených mezerou). `id` pro JS / kotvy `#`, `class` primárně pro styling.

**Q:** Vyjmenuj header tagy a uveď pravidla pro jejich použití.
**A:** **`<h1>` až `<h6>`** — hierarchie nadpisů od nejvyšší úrovně k nejnižší. Pravidla: `<h1>` **jen jednou** na stránku (hlavní téma), **neskákej úrovně** (nelze z h1 rovnou na h4), používej je podle **významu**, ne podle velikosti písma (na velikost je CSS).

**Q:** Co je atribut `alt` u `<img>` a proč je povinný?
**A:** **Alternativní text** popisující obrázek. Povinný kvůli třem důvodům: **přístupnost** (čtečka obrazovky čte slepému uživateli), **failover** (když se obrázek nenačte, zobrazí se text), **SEO** (Google indexuje obrázky podle alt). U dekorativních obrázků `alt=""` (prázdný — čtečka přeskočí).

**Q:** Co je rozdíl mezi `<header>` a `<h1>`?
**A:** **`<header>`** je sémantický element pro **hlavičku stránky nebo sekce** — obvykle obsahuje logo, nadpis, navigaci. **`<h1>`** je **hlavní nadpis** stránky, jeden z header tagů (h1–h6). `<header>` je krabice, `<h1>` je text v ní.

**Q:** Co je `<!DOCTYPE html>` a proč ho píšeme?
**A:** Deklarace, že jde o **HTML5**. Musí být **úplně první řádek** v souboru. Bez něj browser jede v **quirks mode** — kompatibilita se starými stránkami, nepředvídatelné chování. V HTML5 stačí těchto 15 znaků (v HTML4 to byla dlouhá DTD).

**Q:** Co znamená `<meta name="viewport" content="width=device-width, initial-scale=1.0">`?
**A:** Říká **mobilnímu browseru**, aby šířku stránky **odpovídala šířce zařízení** (`width=device-width`) a výchozí zoom byl 1:1 (`initial-scale=1.0`). Bez tohoto meta je stránka na mobilu zoom-out a nečitelná. **Esenciální** pro responzivitu.

**Q:** Vyjmenuj alespoň 3 globální atributy.
**A:** **`id`** (unikátní identifikátor), **`class`** (třída pro CSS/JS), **`style`** (inline CSS), **`title`** (tooltip), **`data-*`** (vlastní data pro JS), **`hidden`** (skrytý element), **`lang`** (jazyk obsahu).

---

## Co bych ještě měl vědět (volně)

- **`<picture>` + `<source>`** — responzivní obrázky, browser vybere variantu podle viewportu.
- **Open Graph tagy** (`<meta property="og:title">`) — pro náhledy při sdílení na sítích.
- **WAI-ARIA atributy** (`aria-label`, `role`) — doplnění sémantiky pro přístupnost.
- **`<noscript>`** — obsah pro uživatele bez JavaScriptu.
- **`tabindex`** — určuje pořadí tabulátoru přes elementy.
- **`<iframe>`** — vkládání jiné stránky (YouTube videa, mapy). Bezpečnostní riziko, ošetřit `sandbox`.
- **`<dialog>`** — moderní nativní modální okno (od HTML5).

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Materiál v `_materials/swi/15/` je v `nezarucene/`** a uživatel uvedl, že je **"šedé"** — učitel ho neoznačil za schválené. Pravděpodobně **vadí mu tenkost** materiálu (bullety bez kódu, bez příkladů). **Tato verze notes je rozšířena z obecných znalostí** + překryv s validovanými notes DAT 1 (HTML5 a sémantika).
- ⚠️ **Možná chybějící téma:** formuláře (`<form>`, `<input>`, `<label>`) — tady je nezmiňuji deeply, protože **patří do DAT 19** (ASP.NET Tag Helpers a formuláře). Pokud komise SWI 15 pichne *"a co formuláře?"*, řekni *"formulářové elementy jsou součástí DAT 19 — `<form>` s atributy `action` a `method`, `<input>` s `type`, párovaný `<label>` přes `for`/`id`"*.
- ⚠️ **Multimédia** (`<audio>`, `<video>`, `<canvas>`) — také nedeep zde, ale HTML5 to umí nativně.

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-11
