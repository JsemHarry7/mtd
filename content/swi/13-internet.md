---
subject: SWI
number: 13
title: "Internet"
tags: ["web", "http", "sítě"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Internet** je **celosvětová síť propojených počítačových sítí**, které komunikují pomocí **protokolů rodiny TCP/IP**. Vznikl z amerického projektu **ARPANET** v 60.–70. letech. Web (WWW) je jen jedna ze služeb na internetu — vedle e-mailu, FTP, DNS atd. Klíčové pojmy: **URL** jako jednoznačný identifikátor zdroje, **MIME typy** pro identifikaci formátu obsahu, **DNS** pro překlad doménových jmen na IP adresy, **domény** strukturované do hierarchie (TLD, SLD, subdoména).

---

## Klíčové pojmy

- **Internet** — globální síť sítí, TCP/IP rodina protokolů
- **WWW (World Wide Web)** — služba na internetu (HTTP/HTTPS), jedna z mnoha
- **Internetový zdroj** — dokument, data nebo služba dostupná online (web, obrázek, video, PDF, API)
- **URL (Uniform Resource Locator)** — jednoznačný identifikátor zdroje
- **MIME typ (Media Type)** — formát obsahu (`text/html`, `image/jpeg`)
- **DNS (Domain Name System)** — překlad doménového jména na IP adresu
- **TLD (Top Level Domain)** — nejvyšší úroveň domény (`.cz`, `.com`)
- **SLD (Second Level Domain)** — druhá úroveň (`google` v `google.com`)
- **Subdoména** — třetí a další úrovně (`www` v `www.google.com`)
- **Absolutní × relativní URL** — celá cesta vs. vztaženo k aktuálnímu dokumentu
- **TCP/IP** — rodina protokolů, na kterých internet stojí

---

## Hlavní výklad (5–10 min mluvení)

### 1. Co je internet

**Internet** je celosvětová síť propojených počítačových sítí. Komunikace běží přes **rodinu protokolů TCP/IP**:
- **IP (Internet Protocol)** — adresování, jak najít cílový počítač
- **TCP (Transmission Control Protocol)** — spolehlivý přenos dat (kontrola, znovuzaslání)
- **UDP** — alternativa, rychlejší ale méně spolehlivý

**Historie:** vznikl z amerického vojenského projektu **ARPANET** v 60.–70. letech. Cíl byl odolnost — síť, která funguje, i když část vypadne (decentralizace).

⚠️ **Past:** *"internet"* ≠ *"web"*. Internet je infrastruktura (síť), **web je jedna ze služeb** na ní (HTTP/HTTPS protokol, prohlížeče, HTML). Další služby: e-mail (SMTP, IMAP), souborový přenos (FTP), DNS, instant messaging atd.

### 2. Internetové zdroje

**Internetový zdroj** = dokument, data nebo služba dostupná online. Příklady:
- Webové stránky (HTML)
- Obrázky, videa, audio
- PDF dokumenty
- API endpointy (vracejí JSON, XML)
- Streamy

**Každý zdroj má dvě věci:**
1. **Adresu** — URL
2. **Typ obsahu** — MIME typ

### 3. URL (Uniform Resource Locator)

**Jednoznačný identifikátor zdroje** na internetu. Anatomie:

```
https://www.example.com:443/sekce/stranka.html?dotaz=ahoj#kotva
└───┬─┘   └─────┬─────┘ └┬┘└──────┬──────────┘└────┬────┘└──┬─┘
 protokol     doména     port    cesta            query   fragment
```

| Část URL | Popis | Příklad |
|---|---|---|
| **Protokol** | jak komunikovat | `http`, **`https`**, `ftp`, `mailto`, `file` |
| **Doménové jméno** (nebo IP) | kam | `www.example.com` |
| **Port** *(nepovinný)* | konkrétní vstupní bod služby | `443` (default HTTPS), `80` (HTTP) |
| **Cesta** | konkrétní soubor / skript | `/sekce/stranka.html` |
| **Query string** | data pro server (formulář) | `?dotaz=ahoj&id=42` |
| **Fragment (kotva)** | místo v dokumentu | `#kontakt` |

**Default porty (nepiš se):**
- **HTTP: 80**
- **HTTPS: 443**
- FTP: 21
- SSH: 22

⚠️ **Query × Fragment** — query (`?`) jde **na server** (server ho zpracuje). Fragment (`#`) zůstává **v prohlížeči** (server ho nikdy nevidí — slouží k posunu na sekci stránky).

### 4. Absolutní × relativní adresa

#### Absolutní URL
- **Obsahuje celou cestu** včetně protokolu a domény
- Funguje **odkudkoliv**
- Příklad: `https://example.com/obrazky/logo.png`

#### Relativní URL
- **Vztažená k aktuálnímu dokumentu**
- Závisí na umístění zdrojového souboru
- **Výhoda:** přenositelnost (dev / staging / production stejný kód)
- Příklady:
  - `obrazky/logo.png` — podadresář aktuálního umístění
  - `../obrazky/logo.png` — o úroveň výš (`..` = parent)
  - `/obrazky/logo.png` — od **root** domény
  - `//cdn.example.com/img.png` — bez protokolu (dědí HTTP/HTTPS od aktuální stránky)

**Pravidlo palce:**
- **Externí zdroje** → absolutní URL (`https://...`)
- **Interní zdroje vlastní stránky** → relativní (`/css/styles.css`)

### 5. MIME typy (Media Types)

**MIME (Multipurpose Internet Mail Extensions)** = formát souboru / obsahu.

**Server posílá v HTTP hlavičce:**
```
Content-Type: text/html; charset=UTF-8
Content-Type: image/jpeg
Content-Type: application/json
```

| Přípona | MIME typ | Popis |
|---|---|---|
| `.html` | `text/html` | HTML dokument |
| `.css` | `text/css` | CSS stylesheet |
| `.js` | `application/javascript` *(nebo `text/javascript`)* | JavaScript |
| `.json` | `application/json` | JSON data |
| `.jpg` | `image/jpeg` | JPEG obrázek |
| `.png` | `image/png` | PNG obrázek |
| `.svg` | `image/svg+xml` | SVG vektor |
| `.pdf` | `application/pdf` | PDF dokument |
| `.mp4` | `video/mp4` | video |
| `.mp3` | `audio/mpeg` | audio |
| `.zip` | `application/zip` | komprese |

**Formát MIME:** `typ/podtyp` (např. `text/html`, `image/jpeg`).

⚠️ **Past:** browser **NESPOLÉHÁ** na příponu souboru — řídí se MIME typem v HTTP hlavičce. Pokud server pošle `Content-Type: text/plain` u `.html` souboru, browser ho **NEzobrazí jako HTML** (zobrazí jako text).

### 6. DNS (Domain Name System)

**Lidé používají doménová jména** (`www.google.com`), **počítače používají IP adresy** (`142.250.187.132`). Mezi tím překládá **DNS**.

#### Jak funguje DNS:

1. Uživatel zadá `www.seznam.cz` v prohlížeči
2. Počítač **zeptá se DNS serveru** *"jaká je IP pro `www.seznam.cz`?"*
3. DNS server **odpoví IP adresou** (např. `77.75.79.222`)
4. Prohlížeč **se připojí na tuto IP** a stáhne stránku

**DNS hierarchie:**
- **Root DNS servery** (13 globálních)
- **TLD servery** (pro `.cz`, `.com` atd.)
- **Authoritative servery** (pro konkrétní doménu)
- **Recursive resolvers** (typicky u tvého ISP, např. Google DNS `8.8.8.8`)

#### IP adresy

- **IPv4**: 4 bajty, formát `xxx.xxx.xxx.xxx` (např. `192.168.1.1`). Maximum **~4.3 miliardy** adres — **vyčerpané**.
- **IPv6**: 16 bajtů, formát hexadecimální se dvojtečkami (`2001:0db8:...`). **Prakticky neomezené** množství adres.

### 7. Domény a jejich struktura

#### Struktura domény

```
www.google.com
└┬┘ └──┬─┘ └┬┘
sub-  SLD   TLD
doména
```

- **TLD (Top Level Domain)** — `.com`, `.cz`, `.org`. **Čte se zprava doleva!**
- **SLD (Second Level Domain)** — `google`, `seznam`
- **Subdoména** — `www`, `mail`, `blog`. Lze mít víc úrovní (`student.liberec.cz`).

#### Typy domén

| Typ | Příklady | Popis |
|---|---|---|
| **Národní (ccTLD)** | `.cz`, `.de`, `.sk` | Country Code TLD — určují stát |
| **Generické (gTLD)** | `.com`, `.org`, `.net`, `.edu`, `.gov` | Obecné použití |
| **Nové TLD** | `.tech`, `.shop`, `.app`, `.dev`, `.io` | Moderní využití (od 2014) |

**Speciální:**
- **`.gov`** — vyhrazeno pro vládní instituce USA
- **`.edu`** — vyhrazeno pro vzdělávací instituce
- **`.mil`** — armáda USA

#### Registrace domény

Doménu si lze **zaregistrovat** přes **registrátora** (např. Wedos, GoDaddy, Cloudflare Registrar) na **1+ rok**. Po vypršení **lze prodloužit** nebo expiruje a může si ji koupit někdo jiný.

---

## Konkrétní příklady / kód

### Anatomie URL
```
https://api.example.com:443/v1/users/42?format=json&lang=cs#profile
└─┬─┘   └─────┬──────┘ └┬┘└────┬──────┘└──────────┬───────┘└──┬───┘
HTTPS   subdomena+    port  cesta              query        fragment
        SLD+TLD       (default HTTPS, lze    (data pro      (kotva
                       vynechat)              server)        v dokumentu)
```

### Použití různých URL v HTML
```html
<!-- Absolutní -->
<img src="https://cdn.example.com/logo.png">

<!-- Relativní k aktuální stránce -->
<img src="images/photo.jpg">

<!-- Relativní k root domény (začíná /) -->
<link rel="stylesheet" href="/css/styles.css">

<!-- O úroveň výš -->
<a href="../about.html">Zpět</a>

<!-- Bez protokolu (dědí HTTP/HTTPS) -->
<script src="//cdn.jsdelivr.net/library.js"></script>

<!-- Pouze fragment (kotva v aktuální stránce) -->
<a href="#kontakt">Skoč na kontakt</a>
```

### MIME typy v HTTP odpovědi
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234

<!DOCTYPE html>
<html>...
```

### DNS query (zjednodušeně)
```
Uživatel → DNS resolver: "IP pro example.com?"
DNS resolver → Root DNS: "Kdo má .com?"
Root DNS → .com TLD servery
.com TLD → example.com authoritative
example.com authoritative → "93.184.216.34"
Uživatel ← IP adresa
Uživatel → 93.184.216.34: "GET /"
```

---

## Vztahy / kontrasty

- **Internet × Web** — internet je síťová infrastruktura, web je **jedna ze služeb** (HTTP). Email, FTP, DNS jsou další služby.
- **URL × URI × URN** — URL je podmnožina URI (Uniform Resource Identifier). URN identifikuje **abstraktně** (`urn:isbn:0451450523`), URL navíc **říká kde to získat**.
- **Absolutní × relativní URL** — absolutní funguje odkudkoliv, relativní jen v kontextu zdrojového dokumentu. Pro **interní odkazy** preferuj relativní (přenositelnost).
- **Query × Fragment** — query (`?`) **jde na server**, fragment (`#`) **zůstává v prohlížeči**.
- **MIME typ × přípona** — browser řídí dle MIME, ne přípony. Server musí poslat správnou hlavičku.
- **DNS × IP** — DNS je *"telefonní seznam internetu"*, překládá jméno na IP. Bez DNS bys musel psát `142.250.187.132` místo `google.com`.
- **TCP × UDP** — TCP **spolehlivý** (kontrola, znovuzaslání), pomalejší. UDP **rychlý**, ale bez záruky doručení (streaming, hry).
- **HTTP × HTTPS** — HTTPS = HTTP + **TLS šifrování**. Default port 443 vs. 80.

---

## Časté otázky komise

**Q:** Co je internet a kdy vznikl?
**A:** Celosvětová **síť propojených počítačových sítí**, které komunikují přes **rodinu protokolů TCP/IP**. Vznikl z amerického projektu **ARPANET v 60.–70. letech**, původně pro vojenské účely (decentralizace = odolnost při výpadku části sítě).

**Q:** Jaký je rozdíl mezi internetem a webem?
**A:** **Internet** je **infrastruktura** (síť počítačů + TCP/IP protokoly). **Web (WWW)** je **jedna ze služeb** na internetu — používá protokol HTTP/HTTPS pro přenos HTML dokumentů. Další služby na internetu: e-mail (SMTP), FTP, DNS, SSH atd.

**Q:** Vyjmenuj části URL.
**A:** **Protokol** (https), **doménové jméno** (`www.example.com`), **port** *(volitelný, default 80/443)*, **cesta** (`/sekce/stranka.html`), **query string** (`?dotaz=ahoj` — data pro server), **fragment** (`#kotva` — pozice v dokumentu).

**Q:** Co je rozdíl mezi absolutní a relativní URL?
**A:** **Absolutní URL** obsahuje **celou cestu** včetně protokolu a domény (`https://example.com/img/logo.png`), funguje odkudkoliv. **Relativní URL** je **vztažená k aktuálnímu dokumentu** (`img/logo.png` nebo `../parent/file.html`). Relativní výhody: přenositelnost mezi dev/staging/prod.

**Q:** Co je MIME typ a k čemu slouží?
**A:** **MIME (Multipurpose Internet Mail Extensions)** identifikuje **formát obsahu**. Server ho posílá v HTTP hlavičce `Content-Type`. Příklady: `text/html`, `image/jpeg`, `application/json`. Browser podle něj **rozhoduje, jak obsah zobrazit** — řídí se MIME, ne příponou souboru.

**Q:** Co je DNS a jak funguje?
**A:** **Domain Name System** — systém pro **překlad doménových jmen na IP adresy**. Lidé pamatují `google.com`, počítače potřebují IP `142.250.187.132`. **Postup:** prohlížeč zeptá DNS serveru, dostane IP, připojí se na tu IP. DNS má hierarchii: root → TLD servery → authoritative servery.

**Q:** Co znamená `https://www.google.com`?
**A:** **HTTPS** = protokol (zabezpečené HTTP přes TLS). **`www`** = subdoména. **`google`** = SLD (Second Level Domain). **`com`** = TLD (Top Level Domain — generický). Čte se **zprava doleva** (TLD první, pak SLD, pak subdomény).

**Q:** Vyjmenuj typy domén.
**A:** **Národní (ccTLD)** — `.cz`, `.de`, `.sk` (Country Code TLD). **Generické (gTLD)** — `.com`, `.org`, `.net`, `.edu`, `.gov`. **Nové TLD** — `.tech`, `.shop`, `.app`, `.dev` (od 2014).

**Q:** K čemu slouží fragment v URL (`#`)?
**A:** **Posun na konkrétní část stránky** — element s daným `id` (kotva). **Fragment ZŮSTÁVÁ v prohlížeči**, server ho **nikdy nedostane**. Použití: navigační odkazy v rámci stránky, single-page aplikace (SPA routing).

**Q:** Jaký je rozdíl mezi IPv4 a IPv6?
**A:** **IPv4** — 4 bajty, formát `192.168.1.1`, maximum ~4.3 miliardy adres (vyčerpané). **IPv6** — 16 bajtů, formát hexadecimální (`2001:0db8:...`), prakticky neomezeno. IPv6 nahrazuje IPv4 postupně, ale **stále jsou v paralelním provozu**.

---

## Co bych ještě měl vědět (volně)

- **Whois** — služba pro zjištění majitele domény. `whois example.com` v terminálu.
- **CDN (Content Delivery Network)** — síť serverů blíže uživatelům (geograficky), rychlejší doručení. Cloudflare, Akamai.
- **HTTP/2 a HTTP/3** — moderní verze protokolu, rychlejší (multiplexing, header kompresí). HTTP/3 přes QUIC (UDP), ne TCP.
- **TLS (Transport Layer Security)** — šifrovací vrstva pro HTTPS. Nahrazuje starší SSL.
- **`.local`** — speciální TLD pro lokální síť (mDNS, např. printer.local).
- **Reverse DNS** — překlad IP zpět na doménu (PTR záznam). Důležité pro mail servery.
- **DNSSEC** — kryptografické zabezpečení DNS proti spoofingu.
- **HTTP × WebSocket** — HTTP request/response, WebSocket bidirekcionální dlouhotrvající spojení.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném PDF** v `_materials/swi/13/spoluzaci-validovane/Internet.pdf`. Obsah zachován + doplnění o **IPv4 vs IPv6**, **HTTP verze**, **CDN** z obecných znalostí (nebyly v materiálu).
- ⚠️ **JavaScript MIME typ** — historicky `application/javascript`, dnes spec doporučuje `text/javascript`. Browsery akceptují obojí. Komise pravděpodobně nezáleží.
- ⚠️ **`mailto:` a `tel:`** protokoly — nepokryto v materiálu, ale občas se ptají. Zmiňuj jako *"další protokoly v URL: `mailto:` pro e-maily, `tel:` pro telefony, `ftp:` pro FTP"*.

---

## Status

- **Sebehodnocení (před):** 1/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-12
