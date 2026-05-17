---
subject: SWI
number: 21
title: "RESTful"
tags: ["web", "rest", "api", "http", "architektura"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **REST (Representational State Transfer)** je **architektonický styl** pro tvorbu API, definovaný Royem Fieldingem v roce 2000. Komunikuje přes **HTTP protokol** a pracuje se **zdroji (resources)** — typicky entitami (uživatelé, články, produkty), identifikovanými přes **URL**. **Web API** = rozhraní, přes které spolu komunikují aplikace (klient ↔ server). **REST API** = Web API, které následuje REST principy. Klíčové vlastnosti: **stateless** (server si nepamatuje), **jednotné rozhraní** přes HTTP metody (GET/POST/PUT/DELETE), **datový formát typicky JSON** (dříve XML). **AJAX** je technika pro asynchronní volání API z prohlížeče bez reloadu stránky.

---

## Klíčové pojmy

- **Web API** — rozhraní pro komunikaci mezi aplikacemi
- **REST (RESTful)** — architektonický styl pro API přes HTTP
- **Resource (zdroj)** — entita identifikovaná URL (`/users/42`)
- **Endpoint** — konkrétní URL v API (`GET /api/users`)
- **CRUD** — Create, Read, Update, Delete (mapuje na POST/GET/PUT/DELETE)
- **Stateless** — server si nepamatuje předchozí requesty
- **JSON** — JavaScript Object Notation, dnes default formát dat
- **XML** — Extensible Markup Language, starší formát, deprecated v REST
- **AJAX** — Asynchronous JavaScript and XML, asynchronní API volání z browseru
- **Fetch API** — moderní browser API pro AJAX (nahradilo `XMLHttpRequest`)
- **CORS** — Cross-Origin Resource Sharing, bezpečnostní pravidlo

---

## Hlavní výklad (5–10 min mluvení)

### 1. Web API × REST

#### Web API (obecně)
**Rozhraní**, přes které spolu komunikují aplikace (typicky klient ↔ server přes internet/HTTP).

**Klient může být:**
- **Webová stránka** v prohlížeči (přes JavaScript)
- **Desktopová aplikace** (C# HttpClient, Electron)
- **Mobilní aplikace** (iOS, Android)
- **Jiný server** (microservices)

API definuje **endpoints** (URL) a **kontrakt** (jaká data se posílají/vrací).

#### REST (RESTful API)

**Architektonický styl** — sada pravidel a doporučení, JAK API postavit:

1. **Klient-server architektura** — oddělení odpovědnosti
2. **Stateless** — server si **NEPAMATUJE** stav klienta. Každý request obsahuje všechny info potřebné pro zpracování.
3. **Jednotné rozhraní** — stejné principy pro všechny zdroje
4. **Resource-based** — pracujeme se **zdroji** (entitami), identifikovanými přes **URL**
5. **HTTP metody jako sloveso** — GET (čti), POST (vytvoř), PUT (replace), DELETE (smaž)
6. **Cacheable** — odpovědi mohou být cachovány

**Alternativy REST:**
- **GraphQL** — jeden endpoint, klient určuje dotaz (úspora over-fetching)
- **gRPC** — binární protokol (Protobuf), rychlý, hlavně pro mikroslužby
- **SOAP** — starý, XML-based, formálnější
- **WebSocket** — trvalé spojení, real-time

### 2. REST URL struktura — resource-based

REST organizuje API přes **resources** (zdroje), které jsou identifikované **URL**.

**Standardní pattern:**

| HTTP metoda | URL | Co dělá |
|---|---|---|
| `GET` | `/api/users` | seznam všech uživatelů |
| `GET` | `/api/users/42` | konkrétní uživatel s id 42 |
| `POST` | `/api/users` | vytvoří nového uživatele (body = data) |
| `PUT` | `/api/users/42` | replace uživatele 42 (body = nová data) |
| `PATCH` | `/api/users/42` | částečná úprava uživatele 42 |
| `DELETE` | `/api/users/42` | smaže uživatele 42 |

**Vnořené zdroje:**
- `GET /api/users/42/posts` — všechny posty uživatele 42
- `GET /api/users/42/posts/15` — konkrétní post

**Pravidla pojmenování URL:**
- **Plurál pro kolekce:** `/users`, ne `/user`
- **Konkrétní zdroj** přes id: `/users/42`
- **Sloveso je v HTTP metodě**, NE v URL — špatně: `/getUsers`, `/createUser`. Správně: `GET /users`, `POST /users`.
- **Lowercase, pomlčky:** `/user-profiles`, ne `/UserProfiles`

### 3. HTTP metody = CRUD operace

REST mapuje HTTP metody na CRUD operace nad zdroji:

| HTTP | CRUD | Idempotent? |
|---|---|---|
| **POST** | **C**reate | ❌ Ne (vytvoří nový resource pokaždé) |
| **GET** | **R**ead | ✅ Ano |
| **PUT** | **U**pdate (replace celý) | ✅ Ano |
| **PATCH** | **U**pdate (částečně) | ❌ Většinou ne |
| **DELETE** | **D**elete | ✅ Ano (po prvním už neexistuje) |

**HEAD** — jako GET ale bez body (jen hlavičky). **OPTIONS** — zjišťuje, jaké metody/CORS hlavičky server podporuje.

⚠️ **Idempotency v REST:** klient může bezpečně opakovat GET, PUT, DELETE při timeout (network proxy je opakuje samy). POST nikdy — opakování by vytvořilo duplicity.

### 4. Datové formáty — JSON × XML

#### JSON (JavaScript Object Notation)

**Dnes standard pro REST API.** Lehký, čitelný, blízký JavaScriptu.

```json
{
    "id": 42,
    "name": "Anna Nováková",
    "email": "anna@example.com",
    "age": 25,
    "active": true,
    "skills": ["C#", "React", "SQL"],
    "address": {
        "city": "Praha",
        "zip": "11000"
    }
}
```

**Datové typy:**
- **string** — `"text"`
- **number** — `42`, `3.14`
- **boolean** — `true`, `false`
- **null** — `null`
- **array** — `[1, 2, 3]`
- **object** — `{ "key": "value" }`

**Charakteristiky:**
- Klíče v uvozovkách (na rozdíl od JS object literal)
- Žádné komentáře (v puristé JSON spec)
- Strict — chybný JSON = error

#### XML (Extensible Markup Language)

**Starší formát, dnes ustupuje v REST.** Stále se používá v SOAP, podnikových integracích, RSS.

```xml
<user id="42">
    <name>Anna Nováková</name>
    <email>anna@example.com</email>
    <age>25</age>
    <skills>
        <skill>C#</skill>
        <skill>React</skill>
    </skills>
</user>
```

**Výhody XML:**
- **Atributy** (`id="42"` na elementu)
- **Schemata (XSD)** pro validaci struktury
- **Namespaces** pro míchání slovníků
- **XPath, XSLT** pro dotazování a transformace

**Nevýhody:**
- **"Ukecaný"** — víc znaků pro stejná data
- **Pomalejší parsing** než JSON
- **Složitější** — víc featur znamená víc rozhodnutí

**Kdy XML:** legacy systémy, SOAP, dokumenty (Office, SVG, HTML jsou XML-based), enterprise integrace.

### 5. AJAX

**AJAX** = **A**synchronous **J**avaScript **a**nd **X**ML. Technika pro **asynchronní volání API** z prohlížeče **bez reloadu stránky**.

**Historie:**
- Vzniklo v ~2005 (Gmail, Google Maps) — průlom v UX
- "X" v názvu = XML, ale **dnes se používá JSON** (název zůstal)
- Technicky: založeno na **`XMLHttpRequest`** objektu

**Moderní AJAX = Fetch API:**

```javascript
fetch('/api/users/42')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

**Nebo `async/await`:**

```javascript
async function loadUser(id) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const user = await response.json();
    return user;
}
```

**Použití AJAX:**
- Načítání dat **bez reload** stránky (klíč pro SPA)
- **Autocomplete** ve vyhledávači
- **Live form validation**
- **Lazy load** obsahu při scrollu
- **Real-time** updates (s WebSocket alternativou)

### 6. Stavové kódy v REST

REST používá standardní HTTP kódy (detail v SWI 19):

| Kód | Význam | Kdy v REST |
|---|---|---|
| **200 OK** | Úspěch | GET, PUT, PATCH success |
| **201 Created** | Resource vytvořen | Po POST (vrátí URL nového resource v `Location` header) |
| **204 No Content** | Úspěch, žádný obsah | Po DELETE nebo PUT bez return body |
| **400 Bad Request** | Špatný JSON / parametry | Chybný formát, validace selhala |
| **401 Unauthorized** | Není přihlášen | Chybí nebo neplatný token |
| **403 Forbidden** | Nemá práva | Přihlášen, ale bez oprávnění |
| **404 Not Found** | Resource neexistuje | `GET /users/9999` neexistujícího uživatele |
| **422 Unprocessable Entity** | Validace selhala (sémantická) | Email neplatný formát, věk záporný |
| **500 Internal Server Error** | Chyba serveru | Bug v kódu, výjimka |

**Klient by měl:**
- **Ošetřit chyby** (try/catch nebo `.catch()` u promise)
- **Zobrazit zprávu uživateli** (ne raw error)
- **Retry pro 5xx, 408 Timeout** (ne pro 4xx — to je chyba klienta)

### 7. Bezpečnost základ

- **Vždy HTTPS** — ne plain HTTP (man-in-the-middle)
- **Token v `Authorization` hlavičce**:
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  ```
- **NIKDY hesla v URL** — URL se loguje do history, server logs, proxy logs
- **CORS** — server explicitně povolí, které origins mohou volat API
- **Rate limiting** — omezit počet requestů per IP/klienta
- **Input validation** — server **MUSÍ** validovat, nikdy nedůvěřuj klientovi

### 8. CORS — Cross-Origin Resource Sharing

**Bezpečnostní pravidlo prohlížeče.** Browser brání JS volat API na **jiné doméně** než aktuální stránka, pokud server explicitně nedovolí.

**Příklad problému:**
- Stránka běží na `https://app.example.com`
- JS chce volat `https://api.example.com/users`
- Browser to **zablokuje**, dokud `api.example.com` nepošle hlavičku:
  ```http
  Access-Control-Allow-Origin: https://app.example.com
  ```

**Preflight request:** pro "komplexní" requesty (PUT, DELETE, custom headers) browser pošle nejdřív **OPTIONS** request, aby zjistil, zda smí. Pak teprve skutečný PUT/DELETE.

---

## Konkrétní příklady / kód

### REST API — typické endpointy
```
GET    /api/products         → seznam všech produktů
GET    /api/products/42      → produkt 42
POST   /api/products         → vytvořit (body = JSON)
PUT    /api/products/42      → replace produkt 42
PATCH  /api/products/42      → částečně upravit
DELETE /api/products/42      → smazat
```

### Fetch — GET request
```javascript
fetch('/api/users/42')
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(data => console.log(data.name));
```

### Fetch — POST request s JSON body
```javascript
const newUser = {
    name: 'Anna',
    email: 'anna@example.com'
};

fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(newUser)
})
.then(r => r.json())
.then(created => console.log('Created with id:', created.id));
```

### Fetch — async/await
```javascript
async function deleteUser(id) {
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 204) {
        console.log('Smazáno.');
    } else if (response.status === 404) {
        console.log('Uživatel neexistuje.');
    } else {
        console.error('Chyba:', response.status);
    }
}
```

### REST API response — vytvoření nového resource
```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/43

{
    "id": 43,
    "name": "Anna",
    "email": "anna@example.com",
    "createdAt": "2026-05-13T10:30:00Z"
}
```

---

## Vztahy / kontrasty

- **Web API × REST** — Web API je obecný pojem (rozhraní mezi aplikacemi). REST je **konkrétní styl**, jak Web API postavit (přes HTTP + zdroje).
- **REST × GraphQL** — REST má **pevné endpointy** (URL + metoda). GraphQL má **jeden endpoint**, klient určuje query (úspora over-fetching).
- **REST × SOAP** — REST jednoduchý, JSON, HTTP-native. SOAP složitý, XML, enterprise.
- **JSON × XML** — JSON lehký, čitelný, dnes standard pro REST. XML "ukecaný", ale podporuje atributy a schemata. JSON pro nové projekty, XML pro legacy.
- **AJAX × WebSocket** — AJAX request-response (jednorázové). WebSocket trvalé obousměrné spojení (real-time).
- **`fetch()` × `XMLHttpRequest`** — fetch je moderní API (Promise-based). XHR je starý objekt (callback-based). Pro nové weby vždy fetch.

---

## Časté otázky komise

**Q:** Co je REST API?
**A:** **Architektonický styl** pro tvorbu API založený na HTTP protokolu a práci se **zdroji** (resources) identifikovanými přes URL. Charakteristiky: stateless, jednotné rozhraní (HTTP metody mapují na CRUD), datový formát typicky JSON. Definovaný Royem Fieldingem v roce 2000.

**Q:** Jaký je rozdíl mezi Web API a REST API?
**A:** **Web API** je obecný pojem — jakékoli rozhraní pro komunikaci aplikací přes web. **REST API** je Web API, které **následuje REST principy** (HTTP + zdroje + stateless + jednotné rozhraní). Alternativy: GraphQL, SOAP, gRPC.

**Q:** Vysvětli REST URL pattern pro CRUD operace nad uživateli.
**A:**
- `GET /api/users` — seznam všech
- `GET /api/users/42` — konkrétní uživatel
- `POST /api/users` — vytvořit (body = JSON s daty)
- `PUT /api/users/42` — replace celého uživatele
- `PATCH /api/users/42` — částečná úprava
- `DELETE /api/users/42` — smazat

Plurál pro kolekce, id přes path, sloveso v HTTP metodě (ne v URL).

**Q:** Co je JSON a v čem se liší od XML?
**A:** **JSON** = JavaScript Object Notation, lehký textový formát pro výměnu dat. Datové typy: string, number, boolean, null, array, object. Dnes **standard pro REST**. **XML** = starší značkovací jazyk, "ukecanější", ale podporuje atributy, schemata (XSD), namespaces. Dnes ustupuje, používá se v SOAP, legacy systémech, Office dokumentech.

**Q:** Co je AJAX?
**A:** **A**synchronous **J**avaScript **a**nd **X**ML — technika pro **asynchronní volání API z prohlížeče bez reloadu stránky**. Dnes přes **Fetch API** (moderní) nebo historicky `XMLHttpRequest`. Klíč pro SPA, autocomplete, lazy loading. Navzdory názvu se dnes používá JSON, ne XML.

**Q:** Co znamená "REST je stateless"?
**A:** Server si **NEPAMATUJE** stav klienta mezi requesty. Každý request musí obsahovat **všechny informace** potřebné pro zpracování (typicky token v Authorization header). Důsledky: jednodušší škálování (server může být nahrazen jiným bez ztráty stavu), nezávislé requesty, ale klient musí poslat víc dat.

**Q:** Vyjmenuj HTTP metody a co dělají v REST.
**A:** **GET** = read (čte data, idempotent). **POST** = create (vytvoří nový, ne idempotent). **PUT** = replace celého resource (idempotent). **PATCH** = částečná úprava. **DELETE** = smaže (idempotent). **HEAD** = jen hlavičky. **OPTIONS** = CORS preflight, zjišťuje dostupné metody.

**Q:** Co je rozdíl mezi PUT a PATCH?
**A:** **PUT** nahrazuje **celý resource** novými daty. Pokud pole v body chybí, vymaže se. **PATCH** dělá **částečnou úpravu** — pošleš jen pole, která se mají změnit, zbytek zůstane. PUT je idempotent, PATCH typicky ne.

**Q:** Vyjmenuj typické chybové kódy v REST API a kdy nastávají.
**A:** **400 Bad Request** (špatný JSON, validace), **401 Unauthorized** (chybí auth token), **403 Forbidden** (auth OK, ale bez oprávnění), **404 Not Found** (resource neexistuje), **422 Unprocessable Entity** (sémantická chyba — neplatný email), **500 Internal Server Error** (bug v serveru).

**Q:** Co je CORS?
**A:** **Cross-Origin Resource Sharing** — bezpečnostní pravidlo prohlížeče. Browser **brání JS volat API na jiné doméně** než aktuální stránka, pokud server explicitně nedovolí přes hlavičku `Access-Control-Allow-Origin`. Pro komplexní requesty (PUT, DELETE) browser pošle **OPTIONS preflight** nejdřív.

---

## Co bych ještě měl vědět (volně)

- **Versioning API** — `/api/v1/users` nebo `Accept: application/vnd.example.v2+json` header.
- **HATEOAS** — REST level 3 — odpověď obsahuje odkazy na další možné akce. Málokdy implementováno čistě.
- **OpenAPI / Swagger** — specifikace REST API v YAML/JSON, automatická dokumentace + client generation.
- **Postman / Insomnia / curl** — nástroje pro testování REST API ručně.
- **Rate limiting** — omezení počtu requestů (např. 100/min/uživatel) přes hlavičky `X-RateLimit-*`.
- **Pagination** — pro velké kolekce: `GET /users?page=2&limit=20` nebo cursor-based.
- **Filtering, sorting:** `GET /users?role=admin&sort=name&order=asc`.
- **Webhooks** — opačně než REST: server volá tvého klienta, když nastane událost.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na **validovaném PDF**. Obsah pokrývá xlsx Popis (*AJAX, REST, JSON, XML, kódy, vracení dat, Web API, význam metod*). Doplnění z obecných znalostí: CORS detail, HATEOAS, versioning, Fetch async/await, REST × GraphQL × SOAP kontrast.
- ⚠️ **HATEOAS** — málokdy v praxi implementováno čistě. Komise se na detail obvykle neptá.
- ⚠️ **OpenAPI/Swagger** — bonus pojem, ne nutné pro maturitu.

---

## Status

- **Sebehodnocení (před):** 1/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-13
