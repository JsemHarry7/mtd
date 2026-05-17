---
subject: SWI
number: 19
title: "Webové aplikace"
tags: ["web", "http", "frontend", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Webová aplikace** je program, který běží v prohlížeči a umožňuje uživateli interaktivně pracovat s daty na vzdáleném serveru. Liší se od **statické webové stránky** (jen zobrazení obsahu) **interaktivitou a propojením se serverem**. Komunikace probíhá přes **HTTP(S) protokol** v **request–response modelu**. Existují dva hlavní typy aplikací: **MPA** (Multi Page Application — každá akce nová stránka, tradiční) a **SPA** (Single Page Application — jedna HTML, obsah se mění JavaScriptem přes API). Klíčové pojmy: HTTP metody, návratové kódy, nestavovost HTTP, HTTPS (TLS šifrování).

---

## Klíčové pojmy

- **Webová stránka** — statický obsah, generován serverem, žádná interaktivita za hranicí JS
- **Webová aplikace** — interaktivní aplikace v prohlížeči, komunikace se serverem
- **MPA (Multi Page Application)** — tradiční, každá akce = nová stránka
- **SPA (Single Page Application)** — jedna HTML, obsah mění JS přes API
- **HTTP** — protokol pro komunikaci klient-server, nestavový
- **HTTPS** — HTTP + TLS šifrování
- **Request-Response** — model komunikace: klient pošle požadavek, server odpoví
- **HTTP metoda** — typ akce (GET, POST, PUT, DELETE, ...)
- **Návratový kód** — třímístné číslo signalizující výsledek (200, 404, 500, ...)
- **Nestavovost** — server si nepamatuje předchozí požadavky (řešeno cookies, sessions, tokens)
- **TLS (Transport Layer Security)** — šifrovací vrstva pro HTTPS (dříve SSL)
- **PWA (Progressive Web App)** — webová aplikace s vlastnostmi mobilní app (offline, install)
- **WebSocket** — alternativa HTTP, trvalé obousměrné spojení

---

## Hlavní výklad (5–10 min mluvení)

### 1. Webová stránka × webová aplikace

| | Webová stránka | Webová aplikace |
|---|---|---|
| Účel | Zobrazit obsah | Vykonat úkol (přihlášení, správa dat) |
| Interaktivita | Minimální (form, link) | Vysoká |
| Komunikace se serverem | Statická / generovaná | Aktivní (API calls) |
| Příklady | Wikipedia, blog, novinky | Gmail, Facebook, GitHub, Trello |

**Hranice se rozmazává** — moderní weby kombinují obojí (např. blog s komentáři je hybrid).

### 2. SPA — Single Page Application

**Princip:** stránka se **načte jednou** (jedna HTML), pak se **obsah dynamicky mění** přes JavaScript. Komunikace se serverem probíhá přes **API** (typicky JSON), aniž by se znovu načítala celá stránka.

**Výhody:**
- **Rychlá odezva** UI po prvním načtení
- **Moderní UX** (plynulé přechody, animace)
- Méně dat přenášeno (jen data, ne celé HTML)

**Nevýhody:**
- **Pomalé první načtení** (velký JS bundle)
- **Horší SEO** bez dodatečných technik (SSR — Server-Side Rendering, prerendering)
- **Závislost na JS** — bez JavaScriptu nefunguje
- **Složitější implementace** (state management, routing)

**Frameworky:** React, Angular, Vue, Svelte.

### 3. MPA — Multi Page Application

**Princip:** každá akce uživatele (klik na odkaz, submit formuláře) **vyvolá nový HTTP request**, server vrátí **novou HTML stránku**, browser ji načte.

**Výhody:**
- **Jednoduchá architektura** (server-side rendering)
- **Lepší SEO** (každá stránka má unikátní URL a HTML)
- **Snadnější zabezpečení** (server kontroluje vše)
- Funguje **bez JavaScriptu**

**Nevýhody:**
- **Pomalejší přechody** mezi stránkami (full reload)
- Více dat přenášeno (HTML opakovaně)

**Příklady stacků:** PHP (Laravel, Symfony), Python (Django, Flask), Ruby on Rails, **ASP.NET Razor Pages**.

### 4. Request-Response model

**Základ HTTP komunikace.** Klient pošle **požadavek** (request), server vrátí **odpověď** (response).

#### HTTP Request obsahuje:

```
GET /api/users/42 HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGc...
Accept: application/json
User-Agent: Mozilla/5.0...

{body — pro POST/PUT}
```

- **URL** — kam mířit
- **HTTP metoda** (GET, POST, PUT, DELETE, ...)
- **Hlavičky (headers)** — metadata (Accept, Authorization, Cookie, Content-Type)
- **Body** — data (jen u POST, PUT, PATCH typicky)

#### HTTP Response obsahuje:

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 87

{"id": 42, "name": "Anna", "email": "anna@example.com"}
```

- **Stavový kód** (200, 404, 500)
- **Hlavičky** (Content-Type, Set-Cookie, ...)
- **Body** — data (HTML, JSON, obrázek, ...)

### 5. HTTP metody

**Standardní HTTP metody:**

| Metoda | Účel | Idempotent? | Body? |
|---|---|---|---|
| **`GET`** | Získat data (read) | Ano | Ne |
| **`POST`** | Vytvořit (create) nebo non-idempotent akce | **Ne** | Ano |
| **`PUT`** | Aktualizovat celý resource | Ano | Ano |
| **`PATCH`** | Částečná aktualizace | Ne | Ano |
| **`DELETE`** | Smazat | Ano | Volitelně |
| **`HEAD`** | Jen hlavičky (jako GET bez body) | Ano | Ne |
| **`OPTIONS`** | Zjistit dostupné metody (CORS preflight) | Ano | Ne |

**Idempotent** = opakované volání = stejný výsledek. `GET /users/42` můžeš zavolat 100×, vrátí to samé. `POST /users` vytvoří 100 nových uživatelů.

**Default browseru:** `GET` (klik na odkaz, načtení obrázku). `POST` použije se u `<form method="POST">` nebo přes JavaScript `fetch()`.

### 6. HTTP × HTTPS

#### HTTP
- Protokol pro komunikaci klient-server
- Běží **nad TCP** (spolehlivý transportní protokol)
- **Default port 80**
- **Nešifrováno** — útočník mezi klientem a serverem může číst (man-in-the-middle attack)
- **Nestavový** — server si nepamatuje předchozí požadavky (řešeno cookies, sessions)

#### HTTPS
- **HTTP + TLS** (Transport Layer Security)
- **Default port 443**
- **Šifrovaná komunikace** — útočník vidí jen šifrovaný šum
- **Ověřuje identitu serveru** přes **SSL certifikát**
- **Dnes standard** — Google penalizuje HTTP weby v SEO, browsery varují

**SSL × TLS:** SSL je starý (zranitelný), TLS je moderní nástupce. Mluví se ale často o "SSL certifikátech" historicky.

**Cena certifikátu:** dříve placené (DigiCert, Verisign), dnes free přes **Let's Encrypt**.

### 7. Návratové kódy HTTP

Třímístné číslo, **první číslice určuje kategorii**:

| Kategorie | Co | Příklady |
|---|---|---|
| **1xx** | Informational (informativní) | 100 Continue, 101 Switching Protocols |
| **2xx** | Success (úspěch) | **200 OK**, 201 Created, 204 No Content |
| **3xx** | Redirection (přesměrování) | 301 Moved Permanently, 302 Found, **304 Not Modified** |
| **4xx** | Client Error (chyba klienta) | **400 Bad Request**, **401 Unauthorized**, **403 Forbidden**, **404 Not Found**, 422 Unprocessable Entity |
| **5xx** | Server Error (chyba serveru) | **500 Internal Server Error**, 502 Bad Gateway, **503 Service Unavailable**, 504 Gateway Timeout |

**Klíčové k zapamatování:**
- **200 OK** — vše v pořádku
- **201 Created** — POST vytvořil nový resource
- **301/302** — redirect (permanent / temporary)
- **400 Bad Request** — chybný request od klienta
- **401 Unauthorized** — chybí autentizace
- **403 Forbidden** — autentizován, ale nemá oprávnění
- **404 Not Found** — resource neexistuje
- **500 Internal Server Error** — chyba serveru (typicky bug v kódu)

### 8. Nestavovost HTTP — jak řešit identitu

HTTP je **stateless** — každý request je samostatný, server **nepamatuje** předchozí.

**Jak udržet identitu mezi requesty:**

1. **Cookies** — server pošle `Set-Cookie` header, browser ho při dalších requestech automaticky posílá zpět v `Cookie` header. Cookies mohou obsahovat **session ID** nebo **token**.
2. **Session** — server-side úložiště dat o uživateli, identifikované přes cookie. Server: *"cookie ABC123 = uživatel Anna"*.
3. **Token (JWT)** — kryptograficky podepsaný token v `Authorization: Bearer ...` header. Stateless — server nemusí nic ukládat, ověří podpis. *(Detail v SWI 20.)*

### 9. Alternativy HTTP

| Protokol | Charakter |
|---|---|
| **WebSocket** | Trvalé obousměrné spojení. Real-time chat, notifikace, hry. |
| **gRPC** | Binární protokol (Protobuf) od Google. Rychlý, pro mikroslužby server-server. |
| **GraphQL** | Dotazovací jazyk pro API. Klient určuje, jaká data dostane. |
| **HTTP/2** | Modernizace HTTP — multiplexing, header compression. |
| **HTTP/3** | Přes QUIC (UDP základ), ne TCP. Rychlejší, hlavně mobilní sítě. |

### 10. Moderní rozšíření — PWA, WebAssembly

**PWA (Progressive Web App)** — webová aplikace s vlastnostmi mobilní app:
- **Installable** (přidat na home screen)
- **Offline funkční** (přes Service Worker + Cache API)
- **Push notifications**
- Vypadá jako native app

**Service Worker** — JavaScript běžící na pozadí browseru, zachytává requesty, cachuje, umožňuje offline.

**WebAssembly (Wasm)** — binární formát, umožňuje spustit **C, C++, Rust kód** v browseru s nativní rychlostí. Vyšší výkon než JavaScript.

---

## Konkrétní příklady / kód

### HTTP request (raw)
```http
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGc...

```

### HTTP response (raw)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 87

[
  {"id": 1, "name": "Anna"},
  {"id": 2, "name": "Bob"}
]
```

### Fetch API (JavaScript)
```javascript
fetch('https://api.example.com/users/42', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
})
.then(response => {
    console.log(response.status);    // 200
    return response.json();
})
.then(data => console.log(data));
```

### POST formuláře (HTML)
```html
<form action="/login" method="POST">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Přihlásit</button>
</form>
```

Browser pošle:
```http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 45

email=anna@example.com&password=secret123
```

---

## Vztahy / kontrasty

- **SPA × MPA** — SPA dynamický obsah přes JS+API. MPA každá akce nová stránka. **Kombinace v moderních frameworcích** (Next.js, Nuxt) přes SSR.
- **HTTP × HTTPS** — HTTPS je HTTP + TLS šifrování. Dnes standard, HTTP penalizováno.
- **GET × POST** — GET pro čtení (idempotent, data v URL). POST pro vytváření/akce (data v body).
- **Cookie × Token (JWT)** — cookie je server-state (sessions), JWT je stateless (vše v podepsaném tokenu).
- **REST × WebSocket** — REST request-response (jednorázové), WebSocket trvalé spojení (real-time).
- **PUT × PATCH** — PUT replace celý resource, PATCH částečná úprava.

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi SPA a MPA?
**A:** **SPA (Single Page Application)** načte stránku jednou, obsah se mění dynamicky JavaScriptem přes API. Příklady: React, Vue. Výhody: rychlá odezva, moderní UX. Nevýhody: pomalé první načtení, horší SEO. **MPA (Multi Page Application)** — každá akce vyvolá nový HTTP request a server vrátí novou HTML stránku. Příklady: PHP, ASP.NET Razor Pages. Výhody: lepší SEO, jednodušší. Nevýhody: pomalejší přechody.

**Q:** Co je request-response model?
**A:** Základní způsob komunikace mezi klientem a serverem v HTTP. Klient odešle **request** (URL + metoda + hlavičky + body), server zareaguje **response** (stavový kód + hlavičky + body). Synchronní — klient čeká na odpověď.

**Q:** Vyjmenuj HTTP metody a jejich účely.
**A:** **GET** (číst, idempotent, bez body), **POST** (vytvořit / akce, ne idempotent, s body), **PUT** (replace celý resource), **PATCH** (částečná úprava), **DELETE** (smazat), **HEAD** (jen hlavičky), **OPTIONS** (zjistit dostupné metody — CORS preflight).

**Q:** Co znamená "HTTP je nestavový protokol"?
**A:** Server si **NEPAMATUJE předchozí requesty** — každý je zpracován samostatně. Důsledek: aplikace musí stav řešit jinak — **cookies** (browser posílá automaticky), **sessions** (server-side storage identifikované cookie), **tokeny JWT** (kryptografické, stateless).

**Q:** Jaký je rozdíl mezi HTTP a HTTPS?
**A:** **HTTP** = nešifrovaný, port 80. **HTTPS** = HTTP + **TLS šifrování**, port 443, vyžaduje SSL certifikát, ověřuje identitu serveru. Dnes standard — Google penalizuje HTTP weby ve výsledcích vyhledávání, browsery varují.

**Q:** Co znamenají HTTP stavové kódy v rozsahu 4xx a 5xx?
**A:** **4xx (Client Error)** — chyba na straně klienta. Klasické: **400** Bad Request (špatný formát), **401** Unauthorized (chybí přihlášení), **403** Forbidden (přihlášen, ale bez práv), **404** Not Found. **5xx (Server Error)** — chyba serveru. **500** Internal Server Error (typicky bug v kódu), **503** Service Unavailable (přetížený nebo údržba).

**Q:** Co je TLS a SSL?
**A:** **TLS (Transport Layer Security)** — moderní kryptografický protokol pro šifrovanou komunikaci. **SSL (Secure Socket Layer)** — starý předchůdce, dnes zranitelný a nepoužívaný. Historicky se mluví o "SSL certifikátech", ale technologie je TLS. HTTPS = HTTP nad TLS.

**Q:** Co je PWA?
**A:** **Progressive Web App** — webová aplikace s vlastnostmi mobilní aplikace. Lze ji nainstalovat na home screen, **funguje offline** (přes Service Worker + Cache), umožňuje push notifications. Hybrid mezi webem a native app.

**Q:** Co je Service Worker?
**A:** Speciální JavaScript běžící na pozadí prohlížeče (nezávisle na stránce). **Zachytává HTTP requesty**, může je cachovat, reagovat i bez internetu. Základ PWA. Umožňuje offline funkcionalitu a push notifications.

**Q:** Co je WebAssembly?
**A:** Binární formát kódu, který browser umí spustit **přímo** (bez JavaScript interpretace). Umožňuje spustit kód napsaný v **C, C++, Rust** v browseru s **téměř nativní rychlostí**. Použití: hry, video editing, výpočetně náročné aplikace. Doplňuje JavaScript, nezahazuje ho.

---

## Co bych ještě měl vědět (volně)

- **CORS (Cross-Origin Resource Sharing)** — bezpečnostní pravidlo prohlížeče. Browser brání JavaScriptu volat API na **jiné doméně** než aktuální stránka, pokud server explicitně nedovolí (přes `Access-Control-Allow-Origin` header). OPTIONS preflight request.
- **REST × GraphQL** — REST má pevné endpointy s URL strukturou. GraphQL jeden endpoint, klient určuje co chce v query.
- **AJAX** — historická zkratka pro JS volání API bez reload stránky. Dnes se říká "fetch" nebo "API call".
- **Long polling × WebSocket** — alternativa real-time komunikace. Long polling = klient drží GET dlouho otevřený, server odpoví až má co. WebSocket = trvalé obousměrné.
- **WebRTC** — peer-to-peer komunikace v browseru (video chat, file transfer).
- **Caching** — browser cache, CDN cache, server cache. Sníží zátěž, zrychlí UX.
- **HTTP/2 multiplexing** — víc requestů v jednom TCP spojení. Bez head-of-line blocking (jeden pomalý request neblokuje ostatní).

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném DOCX** (Pesser, Scollick). Obsah zachován + doplnění HTTP metod (PUT, PATCH, DELETE detailněji), idempotency, CORS, alternativy HTTP/2/3.
- ⚠️ **Idempotency** — komise se na detailní rozdíl mezi POST/PUT/PATCH idempotency obvykle neptá, ale připravený výklad neuškodí.

---

## Status

- **Sebehodnocení (před):** 1/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-13
