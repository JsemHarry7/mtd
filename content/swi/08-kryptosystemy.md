---
subject: SWI
number: 8
title: "Kryptosystémy"
tags: ["kryptografie", "bezpečnost", "tls", "programování", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**Kryptosystém** je ucelený soubor algoritmů, klíčů a postupů pro bezpečnou komunikaci. Moderní kryptosystém řeší **4 vlastnosti**: **důvěrnost** (šifrování), **integritu** (hash/MAC), **autenticitu** (digitální podpisy) a **nepopiratelnost** (certifikáty). Existují dvě rodiny šifer: **symetrická** (1 klíč, rychlá — AES) a **asymetrická** (pár klíčů, řeší výměnu — RSA, ECC). V praxi se kombinují v **hybridním schématu**, klíčový příklad je **TLS** v HTTPS.

---

## Klíčové pojmy

- **Kryptografie** — věda o zabezpečení komunikace (důvěrnost, integrita, autenticita, nepopiratelnost)
- **Kryptoanalýza** — věda o **prolamování** šifer
- **Kryptologie** — kryptografie + kryptoanalýza dohromady
- **Kryptosystém** — ucelený soubor algoritmů, klíčů a postupů
- **Kerckhoffsův princip** — bezpečnost závisí **jen na utajení klíče**, ne algoritmu
- **AES, DES, 3DES, ChaCha20** — symetrické algoritmy
- **RSA, ECC, DH, ECDSA, Ed25519** — asymetrické algoritmy
- **Módy bloků** — ECB (špatný), CBC, CTR, **GCM** (moderní s autentizací)
- **TLS / SSL** — Transport Layer Security (modern) / SSL (deprecated marketing)
- **PKI** — Public Key Infrastructure
- **CA** — Certificate Authority (Let's Encrypt, DigiCert)
- **Forward Secrecy** — staré odposlechy bezpečné i po úniku klíče
- **MITM** — Man-in-the-Middle útok
- **E2EE** — End-to-End Encryption (Signal, WhatsApp)
- **PQC** — Post-Quantum Cryptography

---

## Hlavní výklad

### 1. 4 vlastnosti kryptosystému

| Vlastnost | Co znamená | Jak se zajišťuje |
|---|---|---|
| **Důvěrnost** *(confidentiality)* | Data nikdo cizí nepřečte | **Šifrování** |
| **Integrita** | Data nebyla cestou změněna | **Hash, MAC, digitální podpis** |
| **Autenticita** | Známe identitu protistrany | **Certifikáty, digitální podpis** |
| **Nepopiratelnost** *(non-repudiation)* | Odesílatel nemůže popřít odeslání | **Digitální podpis** |

### 2. Kerckhoffsův princip

**Bezpečnost kryptosystému by měla záviset JEN na utajení klíče, ne na utajení algoritmu** (Kerckhoffs, 1883).

Moderní kryptografie tomu věří — algoritmy AES, RSA jsou **veřejné, peer-reviewed**, ale bez klíče k ničemu. Opak (security through obscurity) bývá past — útočník stejně zjistí algoritmus reverse engineeringem.

### 3. Symetrické kryptografie — algoritmy a módy

#### AES (Advanced Encryption Standard)

- **Standard** od 2001 (NIST soutěž)
- Původně Rijndael (Belgická šifra)
- Klíče **128 / 192 / 256 bitů**
- Bloková šifra, blok = 128 bitů
- Použití: HTTPS, WPA2/3 (Wi-Fi), BitLocker, FileVault, LUKS

#### DES, 3DES, ChaCha20

| Algoritmus | Klíč | Stav |
|---|---|---|
| **DES** (1977) | 56 bitů | **Prolomený** brute-force (1997, 96 dní), dnes minuty |
| **3DES** (1995) | 168 bitů (3× DES) | Deprecated 2023 |
| **ChaCha20** (2008) | 256 bitů | Moderní, **rychlejší v SW** než AES, používá TLS |

#### Módy blokových šifer

Bloková šifra (AES) šifruje **fixní bloky** (128 bitů). Pro delší zprávu = **mód operace**.

| Mód | Princip | Bezpečnost |
|---|---|---|
| **ECB** *(Electronic Codebook)* | Každý blok zvlášť, nezávisle | **Špatný** (vzory viditelné) |
| **CBC** *(Cipher Block Chaining)* | XOR s předchozím | OK, ale **bez autentizace** |
| **CTR** *(Counter)* | Šifruje čítač, XOR s daty | Dobrý, paralelizovatelný |
| **GCM** *(Galois/Counter Mode)* | CTR + autentizace | **Moderní standard** (AES-GCM) |

**Slavný ECB tučňák:** zašifruj obrázek tučňáka pomocí AES-ECB → na výsledku **stále uvidíš tučňáka** (jen zdeformovaného). Stejné bloky se zašifrují stejně, vzory zůstanou. **Proto se ECB nepoužívá.**

---

### 4. Asymetrická kryptografie — algoritmy a princip

**Princip: matematicky obtížné úlohy**

Asymetrická kryptografie staví na problémech:
- **Snadné v jednom směru** (rychle spočítáš)
- **Nepředstavitelně těžké v opačném směru**

| Algoritmus | Princip obtížnosti | Klíč |
|---|---|---|
| **RSA** | Faktorizace velkých čísel | 2048-4096 bitů |
| **ECC** | "Logaritmus" na eliptické křivce | 256-384 bitů |
| **DH** (Diffie-Hellman) | Diskrétní logaritmus | 2048+ bitů |
| **ECDSA** | Eliptické křivky + podpis | 256+ bitů |
| **Ed25519** | EdDSA na Curve25519 | 256 bitů |

**RSA matematika:** násobení dvou prvočísel je snadné, **faktorizace zpět** je extrémně těžká.

### 5. Forward Secrecy (PFS)

**Perfect Forward Secrecy** = i kdyby útočník v budoucnu získal **soukromý klíč serveru**, **nemůže dešifrovat staré odposlechnuté komunikace**.

**Jak:** pro každé spojení se vygeneruje **efemérní (jednorázový) klíč** přes DH. Po skončení spojení se zahodí. Soukromý klíč serveru slouží jen k **autentizaci**, ne k šifrování dat.

**TLS 1.3 vyžaduje PFS povinně.** TLS 1.2 volitelně (`ECDHE` cipher suites).

---

### 6. Hashe — krátká rekapitulace (detail v SWI 7)

| Algoritmus | Hash | Stav |
|---|---|---|
| **MD5** | 128 bitů | **Prolomený** (2004) |
| **SHA-1** | 160 bitů | **Prolomený** (2017, Google) |
| **SHA-256** | 256 bitů | **Standard** |
| **SHA-3** | 224-512 bitů | Moderní alternativa |
| **BLAKE3** | Variabilní | Rychlejší |

**Použití hashů** v kryptosystému:
1. **Integrita souborů** (checksum)
2. **Hesla** (s **bcrypt/Argon2**, ne SHA samotné)
3. **Digitální podpisy** (podepisuje se hash)
4. **HMAC** — hash + tajný klíč (JWT, API)
5. **Blockchain** — Merkle stromy

---

### 7. Digitální podpis — detail

Slouží k ověření **autora** + **integrity** + **nepopiratelnosti**.

```
PODPIS:
1. Vytvoříš dokument
2. Spočítáš jeho hash (SHA-256)
3. Hash zašifruješ svým PRIVÁTNÍM klíčem → digitální podpis
4. Pošleš: dokument + podpis

OVĚŘENÍ:
1. Příjemce dešifruje podpis tvým VEŘEJNÝM klíčem → hash A
2. Sám spočítá hash z přijatého dokumentu → hash B
3. Pokud hash A == hash B → dokument je pravý a nezměněný
```

**Použití:**
- HTTPS / TLS certifikáty
- JWT tokeny (RS256, ES256)
- Software podpisy (Microsoft, Apple)
- Bitcoin / blockchain transakce
- PDF / e-podpisy (Adobe Sign, kvalifikované e-podpisy v EU)
- Git commits (`git commit -S`)
- Email (S/MIME, PGP)

---

### 8. Digitální certifikát a PKI

**Digitální certifikát** = **elektronicky podepsaný veřejný klíč** s metadata o vlastníkovi. Vydává ho **Certifikační autorita (CA)**.

**Obsah certifikátu:**
- **Veřejný klíč** vlastníka
- **Identita** (jméno, doména `example.com`)
- **Doba platnosti** (90 dní u Let's Encrypt, 1 rok u placených)
- **Vydávající CA** a její podpis
- **Použití** (server auth, code signing, email)

#### Chain of trust (řetězec důvěry)

```
Root CA  (důvěryhodný, v OS/prohlížeči preinstalovaný)
   │
   │ podpis
   ▼
Intermediate CA  ("Let's Encrypt R3")
   │
   │ podpis
   ▼
End-entity certifikát  (terpino.cz)
```

Prohlížeč ověří terpino.cz tak, že **projde řetězec až k Root CA**, kterou má v seznamu důvěryhodných.

#### Hlavní CA

| CA | Charakteristika |
|---|---|
| **Let's Encrypt** | Zdarma, automatická obnova, 90 dní, dnes dominantní |
| **DigiCert** | Placená, často s Extended Validation |
| **Sectigo** (Comodo) | Placená |
| **PostSignum** | Česká kvalifikovaná CA |

#### Self-signed certifikát
Podepsán **sám sebou** (neuznaný žádnou CA). Použití: dev na localhostu, interní systémy, IoT. Prohlížeč zobrazí varování.

---

### 9. TLS / SSL — protokoly internetu

| Verze | Rok | Stav |
|---|---|---|
| **SSL 1.0** | 1994 | Nikdy nevyšel |
| **SSL 2.0** | 1995 | **Deprecated** 2011 |
| **SSL 3.0** | 1996 | **Deprecated** 2015 (POODLE) |
| **TLS 1.0** | 1999 | **Deprecated** 2020 |
| **TLS 1.1** | 2006 | **Deprecated** 2020 |
| **TLS 1.2** | 2008 | Stále široce používaný |
| **TLS 1.3** | 2018 | **Moderní standard** |

**"SSL" žije už jen v marketingu** ("SSL certifikát" = vlastně TLS certifikát). Reálně se používá výhradně TLS.

#### TLS 1.2 Handshake

```
KLIENT                                  SERVER
   │── 1. ClientHello ─────────────▶  │  (TLS verze, šifry, random)
   │◀── 2. ServerHello ──────────── │  (vybraná šifra, random)
   │◀── 3. Certifikát ─────────── │   (řetězec důvěry)
   │  [ověří cert proti CA store]      │
   │── 4. ClientKeyExchange ──────▶   │  (RSA nebo ECDHE)
   │  [oba vypočítají sdílený klíč K]   │
   │── 5. Finished (zašifr.) ──────▶  │
   │◀── 6. Finished (zašifr.) ──── │
   │═══ 7. Aplikační data (AES-GCM) ═══│
```

**2 round-trips** než začne aplikační komunikace.

#### TLS 1.3 (zjednodušení)

- Odstraněny starší slabé algoritmy (RSA key exchange, CBC)
- **Povinný PFS** přes (EC)DHE
- **1-RTT** handshake
- **0-RTT resumption** (návrat na server posílá data v prvním paketu)

#### Cipher suite

```
TLS_AES_256_GCM_SHA384
│   │       │   │      │
│   │       │   │      └── Hash pro KDF (SHA-384)
│   │       │   └────────── Mód (GCM)
│   │       └────────────── Délka klíče (256 bitů)
│   └────────────────────── Symetrická šifra (AES)
└────────────────────────── Protokol
```

---

### 10. Klasické útoky na kryptosystémy

| Útok | Princip | Obrana |
|---|---|---|
| **Brute force** | Zkoušení všech klíčů | Dlouhý klíč (AES-256) |
| **Dictionary** | Zkoušení slov ze slovníku | Silná hesla |
| **Rainbow tables** | Předpočítané hashe | **Salt** |
| **MITM** (Man-in-the-Middle) | Útočník mezi klientem a serverem | **Certifikáty (CA), HSTS** |
| **Replay attack** | Zachytit a později poslat zprávu znovu | **Nonce**, timestamps |
| **Padding Oracle** | Útok na špatně implementovaný CBC | **AES-GCM** (autentizované) |
| **Side channel** | Měření času/spotřeby/EM záření | Konstantní časová implementace |
| **Birthday attack** | Hledání kolizí v hashi | Dostatečně dlouhý hash (SHA-256) |

#### MITM detail
```
Klient ←→ Útočník ←→ Server
         (proxy)
```
Útočník vidí komunikaci a může ji měnit. **TLS to řeší ověřením certifikátu** — útočník by potřeboval cert podepsaný důvěryhodnou CA.

---

### 11. End-to-end encryption (E2EE)

Šifrování, kdy data **vidí jen odesílatel a příjemce, ani server uprostřed ne**. Klíče jen u koncových uživatelů.

| Aplikace | Protokol |
|---|---|
| **Signal** | Signal Protocol (Double Ratchet, X3DH) |
| **WhatsApp** | Signal Protocol |
| **iMessage** | Apple proprietary |
| **ProtonMail** | OpenPGP |

**E2EE komplikuje serveru:**
- Server nemůže prohledávat zprávy
- Server nemůže obsah moderovat
- Pokud zapomeneš klíč, ztratíš zprávy

---

### 12. Post-quantum kryptografie (PQC)

**Problém:** dostatečně silný **kvantový počítač** by mohl prolomit RSA a ECC ve zlomku sekundy (**Shorův algoritmus**, 1994). Symetrické šifry (AES) jsou jen oslabené (**Groverův algoritmus**).

**Současný stav (2026):**
- Kvantové počítače existují, ale **nedostatečně silné** (stovky qubitů, potřebujeme miliony)
- **NIST 2024** standardizoval první PQC algoritmy:
  - **CRYSTALS-Kyber** (key encapsulation, lattice-based)
  - **CRYSTALS-Dilithium** (podpisy)
  - **SPHINCS+** (hash-based podpisy)
- TLS 1.3 podporuje hybridní (klasická + PQC) výměnu klíčů
- Chrome od 2024 nabízí Kyber768

**"Harvest now, decrypt later"** = státy sbírají dnes zašifrovaný traffic, čekají na kvantové počítače, pak dešifrují. Proto se s PQC pospíchá.

**Symetrické šifry (AES-256) a hash funkce (SHA-256) zůstávají kvantově odolnější** — Grover jen půlí efektivní velikost klíče.

---

## Vztahy / kontrasty

- **Kryptografie × kryptoanalýza:** věda o zabezpečení × věda o prolamování. Dohromady = **kryptologie**.
- **Symetrické × asymetrické:** rychlé/sdílený klíč × pomalé/pár klíčů.
- **Šifrování × hash:** zpět s klíčem × jednosměrné.
- **Digitální podpis × šifrování:** zaručuje autora × zaručuje utajení. Obě používají asymetrickou kryptografii, ale v **opačném směru** (podpis: privát/veřej, šifrování: veřej/privát).
- **Certifikát × klíč:** certifikát = veřejný klíč + identita + podpis CA. Není to klíč samotný.
- **TLS × SSL:** TLS moderní, SSL deprecated (žije v marketingu).
- **ECB × GCM:** ECB špatný (vzory), GCM moderní (CTR + autentizace).
- **PFS:** efemérní klíče per spojení, stará komunikace bezpečná i po úniku.

---

## Časté otázky komise

**Q:** Co je kryptosystém a jaké 4 vlastnosti zajišťuje?
**A:** Kryptosystém je **ucelený soubor algoritmů, klíčů a postupů** pro bezpečnou komunikaci. Zajišťuje 4 vlastnosti: **důvěrnost** (šifrování), **integritu** (hash, MAC), **autenticitu** (digitální podpisy, certifikáty), **nepopiratelnost** (digitální podpis — odesílatel nemůže popřít odeslání).

**Q:** Jaký je rozdíl mezi DES, 3DES a AES?
**A:** **DES** (1977, 56-bit klíč) — první moderní symetrická šifra, **prolomen brute-forcem** 1997, dnes nepoužívat. **3DES** = DES aplikovaný 3× (168-bit klíč), Deprecated 2023. **AES** (2001, Advanced Encryption Standard, klíče 128/192/256 bitů) — **dnešní standard**, použit v HTTPS, WPA, BitLocker. Bloková šifra, blok 128 bitů.

**Q:** Co jsou módy blokových šifer a proč nepoužívat ECB?
**A:** Bloková šifra (AES) šifruje **fixní bloky** (128 bitů). Pro delší zprávu se používá **mód operace**. **ECB** (Electronic Codebook) šifruje každý blok **nezávisle** — problém: stejné bloky vstupu produkují stejné bloky výstupu, **vzory v datech zůstávají viditelné**. Slavný "ECB tučňák" — zašifrovaný obrázek je stále rozpoznatelný. Moderní default je **AES-GCM** (Galois/Counter Mode) — CTR + autentizace integrity.

**Q:** Co je princip RSA?
**A:** **Asymetrický algoritmus** založený na **obtížnosti faktorizace velkých čísel**. Vynásobit dvě prvočísla (např. 2048-bitová) je snadné. **Rozložit součin zpět na prvočísla** je extrémně těžké (triliony let na klasickém počítači). Klíče: typicky 2048-4096 bitů. Použití: TLS certifikáty, digitální podpisy, šifrování klíčů.

**Q:** Co je Forward Secrecy (PFS)?
**A:** **Perfect Forward Secrecy** = i kdyby útočník v budoucnu získal soukromý klíč serveru, **nemůže dešifrovat staré odposlechnuté komunikace**. Princip: pro každé spojení se vygeneruje **efemérní (jednorázový)** DH klíč, po skončení se zahodí. Soukromý klíč serveru slouží jen k autentizaci, ne k šifrování dat. **TLS 1.3 vyžaduje PFS povinně.**

**Q:** Jak funguje TLS handshake?
**A:** TLS 1.2 v ~5 krocích: **1) ClientHello** (TLS verze, šifry). **2) ServerHello** (vybraná cipher suite). **3) Certifikát** — server pošle, klient ho ověří proti důvěryhodným CA v OS. **4) Výměna klíčů** (RSA nebo ECDHE pro forward secrecy) → oba mají sdílený symetrický klíč. **5) Finished** zprávy (potvrzení). **6) Aplikační data** šifrována AES-GCM. TLS 1.3 zjednodušil na 1-RTT (pošle key share v ClientHello).

**Q:** Co je digitální certifikát a PKI?
**A:** **Certifikát** = elektronicky **podepsaný veřejný klíč** + metadata o vlastníkovi (identita, doba platnosti, použití). Vydává ho **Certifikační autorita (CA)**. **PKI** (Public Key Infrastructure) je infrastruktura pro správu klíčů a certifikátů. **Chain of trust**: Root CA (v OS/prohlížeči) → Intermediate CA → End-entity cert. Prohlížeč ověří identitu serveru průchodem řetězce. Hlavní CA: Let's Encrypt (zdarma, dominantní), DigiCert (placená).

**Q:** Jaké útoky na kryptosystémy znáš?
**A:** **Brute force** (zkoušení všech klíčů, obrana: dlouhý klíč). **Dictionary** (slovníkové útoky na hesla). **Rainbow tables** (předpočítané hashe, obrana: salt). **MITM** (Man-in-the-Middle, obrana: certifikáty). **Replay attack** (opakování staré zprávy, obrana: nonce). **Padding Oracle** (CBC útok, obrana: AES-GCM). **Side channel** (měření času/spotřeby, obrana: konstantní časová implementace).

**Q:** Co je MITM útok a jak se proti němu chránit?
**A:** **Man-in-the-Middle** = útočník se **vloží mezi klienta a server** jako proxy. Vidí komunikaci a může ji měnit. Klient si myslí, že mluví se serverem, server si myslí, že mluví s klientem. **Obrana: certifikáty** — server prokáže identitu přes certifikát podepsaný důvěryhodnou CA. Útočník by potřeboval cert pro stejnou doménu podepsaný CA, kterou klient důvěřuje (extrémně těžké). Plus **HSTS** vynucuje HTTPS.

**Q:** Co je post-quantum kryptografie a proč je důležitá?
**A:** **PQC** jsou kryptografické algoritmy **odolné vůči kvantovým útokům**. Problém: dostatečně silný kvantový počítač by mohl pomocí **Shorova algoritmu** prolomit RSA a ECC ve zlomku sekundy. Aktuálně (2026) kvantové počítače existují, ale nejsou dostatečně silné. **NIST 2024** standardizoval první PQC algoritmy: **CRYSTALS-Kyber** (key encapsulation), **CRYSTALS-Dilithium** (podpisy). TLS 1.3 už podporuje hybridní výměnu. **Symetrické šifry a hash funkce zůstávají kvantově odolné** (AES-256 zůstává bezpečný).

---

## ⚠️ Nejisté / k ověření

- TLS 1.3 přesné kroky handshake — moje shrnutí jsou zjednodušená, full spec má víc vrstev (key share, encrypted extensions, certificate verify).
- AES módy — pro zkoušku stačí znát ECB (špatný), GCM (moderní). CBC a CTR jen pojmově.

---

## Status

- **Sebehodnocení (před):** 4/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
