---
subject: SWI
number: 20
title: "Ověřování identity v prostředí internetu"
tags: ["web", "http", "bezpečnost", "autentizace"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

Ověřování identity v prostředí internetu řeší **kdo jsi** a **co smíš**. Skládá se ze tří kroků: **identifikace** (uživatel říká, kdo je), **autentizace** (potvrzení, že je to opravdu on) a **autorizace** (určení, k čemu má přístup). Moderní web stojí na **tokenech** (typicky JWT) a **delegovaném přístupu** přes protokoly **OAuth 2.0** a **OpenID Connect** — uživatel nemusí svěřovat heslo každé aplikaci.

---

## Klíčové pojmy

- **Identifikace** — uživatel deklaruje identitu (uživatelské jméno, e-mail). Odpověď na *"kdo jsi?"*
- **Autentizace** — potvrzení, že je to opravdu daná osoba. Odpověď na *"opravdu jsi to ty?"*
- **Autorizace** — určení, co smí ověřený uživatel dělat. Odpověď na *"co smíš?"*
- **Faktor** — kategorie ověřovacího prvku: *něco co víš* (heslo), *něco co máš* (telefon, token), *něco co jsi* (biometrie)
- **2FA / MFA** — dvou- / vícefaktorová autentizace, kombinuje 2+ nezávislé faktory
- **Token** — dočasný digitální klíč vydaný serverem po přihlášení, posílá se místo hesla
- **JWT** (JSON Web Token) — konkrétní formát tokenu, podepsaný, obsahuje data o uživateli
- **OAuth 2.0** — protokol pro **delegovaný přístup** (autorizace, ne autentizace)
- **OpenID Connect** — vrstva nad OAuth 2.0, přidává **autentizaci** (identitu uživatele)
- **Sociální přihlášení** — *"Přihlásit se přes Google/Facebook/Apple"*, využívá OAuth + OIDC
- **Passwordless** — bezheslové přihlášení, FIDO2, Passkeys (budoucnost)

---

## Hlavní výklad

### 1. Tři pilíře: identifikace × autentizace × autorizace

Tři kroky, snadno se pletou:

1. **Identifikace** — uživatel řekne *"jsem Anna"* (zadá e-mail). Žádné ověření, jen tvrzení.
2. **Autentizace** — server řekne *"dokaž to"*. Uživatel pošle heslo / kód z SMS / otisk prstu. Server porovná → pustí dál nebo zamítne.
3. **Autorizace** — *"smíš číst své fotky, ale ne fotky jiných uživatelů"*. Probíhá po autentizaci, většinou pro každý request.

Mantra: **identifikace = tvrzení, autentizace = důkaz, autorizace = oprávnění**.

### 2. Hesla — slabý článek

Heslo je **něco, co víš**. Problémy:
- **Slabá hesla** — uživatelé volí 123456, password, jméno
- **Phishing** — útočník vyláká heslo přes falešnou stránku
- **Únik databáze** — pokud server ukládá hesla v plaintextu, je po hře
- **Reuse** — uživatel má stejné heslo všude → 1 únik = všechny účty kompromitované

**Server NESMÍ ukládat hesla v plaintextu.** Místo toho **hashuje** s pomalou hashovací funkcí (bcrypt, Argon2, scrypt) + **salt** (náhodný řetězec proti rainbow table útokům).

Při přihlášení: server vezme zadané heslo, hashuje ho stejnou funkcí + saltem a porovná s uloženým hashem. Heslo se z hashe **nedá vrátit zpět**.

### 3. Dvoufaktorová a multifaktorová autentizace

**2FA** = heslo (co víš) + druhý faktor (co máš nebo co jsi). Výrazně zvyšuje bezpečnost — i když útočník zná heslo, nemá druhý faktor.

Druhý faktor v praxi:
- **SMS kód** — pohodlné, ale **slabé** (SIM swap útok, odposlech)
- **Authenticator app (TOTP)** — Google Authenticator, Authy. Generuje 6-místný kód každých 30 s podle sdíleného tajemství. **Doporučeno.**
- **Hardwarový token** — YubiKey, fyzický klíč přes USB / NFC. Nejvyšší bezpečnost.
- **Biometrie** — otisk prstu, Face ID. Pohodlné, ale data o těle nelze "změnit" jako heslo.
- **E-mailový odkaz** — magic link. Pohodlné, ale závisí na bezpečnosti e-mailu.

**MFA** = 2+ faktory, často všechny tři kategorie (víš + máš + jsi).

### 4. Tokeny a JWT

Po úspěšném přihlášení server vydá **token** — dočasný klíč. Klient ho posílá v hlavičce `Authorization: Bearer <token>` při každém requestu. Server token ověří a pustí klienta dál.

**Výhody tokenů oproti opakovanému posílání hesla:**
- Heslo se posílá **jednou** (při login), pak už nikdy
- Token má **omezenou platnost** (typicky minuty - hodiny)
- Token lze **odvolat** (logout, kompromitace)
- **Stateless** — server si nemusí pamatovat session (klíčové pro REST, viz SWI 21)

**JWT** = konkrétní formát tokenu. Skládá se ze 3 částí oddělených tečkami:

```
header.payload.signature
```

- **Header** — algoritmus podpisu (HS256, RS256), typ (JWT)
- **Payload** — data (claims): ID uživatele, role, doba expirace `exp`, vydavatel `iss`...
- **Signature** — kryptografický podpis hlavičky a payloadu serverovým klíčem

**Důležité:** JWT je **base64-encoded, NE šifrovaný**. Kdokoli si payload může přečíst. Hodnota je v **podpisu** — útočník nemůže payload změnit, aniž by se rozbil podpis.

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYW5uYSIsImV4cCI6MTcwMDB9.X8sdf...
```

Hodí se hlavně pro **stateless API** (REST) — server nemusí ukládat session do DB, vše je v tokenu.

### 5. OAuth 2.0 — delegovaný přístup

**OAuth 2.0 ≠ autentizace, je to autorizační protokol.**

**Příklad:** chceš nahrát fotku z Google Photos do aplikace na úpravu fotek. Aplikace **nemá** vědět tvé Google heslo. Místo toho:

1. Aplikace pošle uživatele na Google login stránku
2. Uživatel se přihlásí (svým Google účtem, na **Google**, ne aplikaci)
3. Google se zeptá: *"Chceš dát aplikaci XY přístup ke svým fotkám?"*
4. Uživatel klikne **Povolit**
5. Google vydá aplikaci **access token** s omezenou platností a rozsahem (jen čtení fotek)
6. Aplikace pak používá token pro přístup k Google Photos API

**Aktéři:**
- **Resource Owner** — uživatel (vlastník dat)
- **Client** — aplikace, která chce přístup
- **Authorization Server** — Google (vydává tokeny)
- **Resource Server** — Google Photos API (drží data)

**Klíčové výhody:**
- Aplikace **nikdy** nevidí heslo uživatele
- Přístup je **omezený** (scope: jen fotky, jen čtení)
- Lze **odvolat** kdykoli (uživatel v Google nastavení smaže přístup)

### 6. OpenID Connect (OIDC)

OAuth 2.0 řeší autorizaci. Když ale chce aplikace vědět, **kdo** se přihlašuje, potřebuje **autentizaci**. K tomu slouží **OpenID Connect** — vrstva nad OAuth 2.0.

OIDC přidává **ID Token** (samostatný JWT) s informacemi o uživateli: jméno, e-mail, foto. Aplikace tak ví *"přihlásil se Anna, e-mail anna@example.com"*.

**Mantra:** *"OAuth říká **co smíš**, OpenID Connect říká **kdo jsi**."*

### 7. Sociální přihlášení

*"Přihlásit se přes Google / Facebook / Apple / GitHub"* = praktická aplikace OAuth + OIDC.

**Výhody:**
- Uživatel si nemusí pamatovat další heslo
- Rychlejší registrace (jméno, e-mail, foto se přenese)
- Bezpečnější — útoky na heslo přesouvá na Google (který má lepší bezpečnost než malá aplikace)

**Nevýhody:**
- **Závislost** na poskytovateli (Google smaže účet → ztratíš přístup ke všemu)
- **Soukromí** — Google ví, do jakých aplikací se přihlašuješ
- **Vendor lock-in** — uživatel se "uvázal" k jedné platformě

### 8. Bezheslové přihlašování (Passwordless)

Trend, který se snaží **úplně odstranit hesla**:

- **Magic link** — pošle se na e-mail jednorázový odkaz, kliknutím se přihlásíš
- **WebAuthn / FIDO2** — kryptografický standard, prohlížeč drží klíč v zabezpečeném úložišti
- **Passkeys** — uživatelsky přívětivé FIDO2, klíče synchronizované mezi zařízeními (iCloud Keychain, Google Password Manager)
- **Biometrie** — otisk prstu odemkne klíč v zařízení

**Princip:** klient drží **privátní klíč**, server drží **veřejný klíč**. Při přihlášení server pošle výzvu, klient ji podepíše privátním klíčem. Heslo nikdy neexistuje → nemůže uniknout.

---

## Konkrétní příklady

### JWT struktura (decoded)

```
Header:    { "alg": "HS256", "typ": "JWT" }
Payload:   { "sub": "42", "name": "Anna", "role": "admin", "exp": 1735689600 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### HTTP request s JWT

```
GET /api/profile HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.X8sdf...
```

### OAuth 2.0 flow (zjednodušeně)

```
1. App → Google: "chci přístup k fotkám uživatele"
2. Google → User: login page + "povolíš?"
3. User → Google: "ano"
4. Google → App: access_token (omezený scope, omezená doba)
5. App → Google Photos API: "GET /photos" + Authorization: Bearer <token>
6. Google Photos API → App: data
```

---

## Vztahy / kontrasty

- **Autentizace × autorizace:** *kdo jsi* × *co smíš*. Autentizace musí proběhnout PŘED autorizací. **401 Unauthorized** (chyba autentizace) × **403 Forbidden** (chyba autorizace).
- **OAuth × OpenID Connect:** OAuth = autorizace (přístup k API). OIDC = autentizace (identita). OIDC staví NAD OAuth.
- **Session × Token:** Session je **stateful** (server si pamatuje, kdo je přihlášen, v DB/cache). Token je **stateless** (vše je v tokenu, server nic neukládá). Session se hodí pro klasické weby, token pro REST API a SPA.
- **Cookie × Authorization header:** Cookies jsou automaticky posílány prohlížečem, hodí se pro session. Authorization header se posílá explicitně, hodí se pro tokeny v SPA / mobilní aplikace.
- **JWT × opaque token:** JWT obsahuje data (self-contained, server nemusí volat DB). Opaque token je jen ID — server musí lookup do DB. JWT rychlejší, opaque flexibilnější (lze okamžitě zrušit).
- **2FA × MFA:** 2FA = právě 2 faktory. MFA = 2 nebo více. 2FA je podmnožina MFA.

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi autentizací a autorizací?
**A:** Autentizace ověří, **kdo** uživatel je (typicky heslem). Autorizace určuje, **co smí** dělat (jaké zdroje, jaké operace). Autentizace přichází vždy před autorizací. V HTTP: 401 Unauthorized = chyba autentizace, 403 Forbidden = chyba autorizace.

**Q:** Co je 2FA a proč se používá?
**A:** Dvoufaktorová autentizace kombinuje dva nezávislé faktory — typicky heslo (co víš) + kód z mobilu (co máš). I když útočník získá heslo (phishingem, únikem DB), bez druhého faktoru se nedostane dovnitř. Výrazně zvyšuje bezpečnost účtu.

**Q:** Co je JWT a z čeho se skládá?
**A:** JSON Web Token, formát dočasného přihlašovacího tokenu. Skládá se ze tří částí oddělených tečkami: **header** (algoritmus), **payload** (data o uživateli + doba platnosti), **signature** (kryptografický podpis serverem). Klient posílá JWT v `Authorization: Bearer` hlavičce při každém requestu. JWT je base64, ne šifrovaný — kdokoli vidí obsah, ale podpis nelze zfalšovat bez serverového klíče.

**Q:** Jaký je rozdíl mezi OAuth 2.0 a OpenID Connect?
**A:** OAuth 2.0 řeší **autorizaci** — dává aplikaci omezený přístup ke zdrojům uživatele (např. fotkám na Google) bez sdílení hesla. OpenID Connect je **vrstva nad OAuth**, která přidává **autentizaci** — aplikace získá ověřenou informaci o tom, **kdo** je uživatel. OAuth říká "co smíš", OIDC říká "kdo jsi".

**Q:** Proč se nesmí ukládat hesla v plaintextu?
**A:** Když dojde k úniku databáze, útočník má všechna hesla. Místo plaintextu se hesla **hashují** pomalou kryptografickou funkcí (bcrypt, Argon2) se **saltem** — náhodným řetězcem proti rainbow table útokům. Hash je jednosměrný — z hashe heslo nelze vrátit. Při přihlášení server hashuje zadané heslo stejnou funkcí a porovná hashe.

**Q:** Jaké jsou výhody a nevýhody sociálního přihlášení?
**A:** **Výhody:** pohodlné (jeden klik), žádné nové heslo, rychlá registrace, vyšší bezpečnost (Google/Apple mají lepší zabezpečení než malé weby). **Nevýhody:** uživatel svěřuje data velké platformě, závislost (smazaný Google účet = ztráta přístupu všude), platforma vidí, do jakých aplikací se přihlašuje.

**Q:** Co je passwordless přihlašování?
**A:** Trend, který se snaží úplně odstranit hesla. Místo nich se používají **kryptografické klíče** (FIDO2, Passkeys) uložené v zařízení a odemykané biometrií. Princip: klient drží privátní klíč, server veřejný; při přihlášení klient podepisuje výzvu serveru. Heslo neexistuje → nemůže uniknout, být odhaleno phishingem ani zapomenuto.

---

## Co bych ještě měl vědět (volně)

- **Refresh token** — vedle krátkodobého access tokenu (~15 min) existuje dlouhodobý refresh token (~30 dní). Když access token vyprší, klient ho vymění za nový pomocí refresh tokenu, aniž by uživatel musel znovu zadávat heslo.
- **CSRF (Cross-Site Request Forgery)** — útok, při kterém web třetí strany pošle request na cílový web s cookies uživatele. Obrana: CSRF token v formuláři.
- **XSS (Cross-Site Scripting)** — útočník vloží JS kód na stránku, který může ukrást JWT z localStorage. Proto se doporučuje JWT v httpOnly cookie (nedosažitelná pro JS), ne v localStorage.
- **SSO (Single Sign-On)** — jedno přihlášení, přístup k mnoha aplikacím (typicky ve firmě: jeden login = e-mail + intranet + cloud). Postavené nad OIDC / SAML.
- **SAML** — starší alternativa OIDC pro enterprise SSO, používá XML místo JSON. Stále časté v korporátech.
- **HSTS, HTTPS** — Authentizace bez HTTPS nedává smysl, heslo by šlo odposlechnout. HSTS donutí prohlížeč vždy používat HTTPS.

---

## ⚠️ Nejisté / k ověření

- Spolužácký materiál uvádí JWT jako "digitálně podepsaný, díky podpisu nelze zfalšovat" — to je správné, ale chybí explicitně, že **payload je čitelný komukoli** (jen base64). Doporučuji ověřit na jwt.io.
- "FIDO2 a Passkeys" se v materiálu zmiňují, ale není detail jejich vztahu — Passkeys je *brand* pro FIDO2 credentials syncované přes cloud (Apple/Google/Microsoft).

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-13
