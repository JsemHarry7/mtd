---
subject: SWI
number: 7
title: "Šifrování a kódování"
tags: ["kryptografie", "bezpečnost", "kódování", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**Kódování a šifrování se v běžné řeči pletou, v IT jsou to zásadně různé věci.** Kódování slouží k **převodu dat pro přenos/zobrazení** (ASCII, UTF-8, Base64) — je **veřejné**, kdokoli dekóduje. Šifrování slouží k **utajení** přes klíč. Dvě hlavní rodiny šifer: **symetrická** (1 sdílený klíč, rychlá, AES) a **asymetrická** (veřejný + privátní klíč, pomalá, RSA). V praxi se kombinují v **hybridním šifrování** — typický případ je HTTPS.

---

## Klíčové pojmy

- **Kódování** (encoding) — převod dat do jiného formátu, **veřejné**
- **Šifrování** (encryption) — utajení dat pomocí **klíče**
- **ASCII** — 7-bit, jen anglické znaky (128 znaků)
- **UTF-8** — mezinárodní, 1-4 bajty/znak, zpětně kompatibilní s ASCII
- **Base64** — binární → text (pro email, JSON, URL), **není šifrování**
- **Transpozice** — mění **pořadí** písmen
- **Substituce** — **nahrazuje** písmena jinými
- **Symetrické šifrování** — 1 sdílený klíč pro obě strany (AES, DES)
- **Asymetrické šifrování** — pár klíčů: veřejný + privátní (RSA, ECC)
- **Diffie-Hellman** — výměna klíče přes nezabezpečený kanál
- **Hybridní šifrování** — DH/RSA pro výměnu klíče → AES pro data
- **Hash** — jednosměrná funkce, vstup → otisk pevné délky
- **Salt** — náhodný řetězec přidaný k heslu před hashováním
- **HMAC** — Hash + tajný klíč (autenticita + integrita)
- **Digitální podpis** — hash zašifrovaný privátním klíčem

---

## Hlavní výklad

### 1. Kódování vs šifrování (klasický chyták)

|  | **Kódování** | **Šifrování** |
|---|---|---|
| **Účel** | Přenos, uložení, zobrazení dat | Utajení, bezpečnost |
| **Tajnost** | Veřejně známé, kdokoliv dekóduje | Pouze ten, kdo má klíč |
| **Reverzibilita** | Lze obousměrně bez čehokoliv | Zpět **jen s klíčem** |
| **Příklad** | ASCII, UTF-8, Base64, Morseovka | AES, RSA, Caesar |

**Mantra:** *"Kódování není o tajnosti, je o převodu. Base64 zakóduje obrázek pro email — kdokoli ho zpět dekóduje. Šifrování je o utajení."*

### 2. Kódování dat

#### Morseovka
Historicky první masově používané (telegraf, 19. století). Krátké/dlouhé signály pro písmena. `A: .-`, `SOS: ... --- ...`

#### ASCII
**7 bitů (128 znaků)**. Vznikl v USA 60. léta. Jen anglické písmena + číslice + speciální znaky. **Neumí** háčky, azbuku, čínštinu, emoji.

```
'A' = 65 (decimal)
'a' = 97
'0' = 48
```

#### Lokální 8-bit kódování
Pro národní abecedy: **Windows-1250** (střední Evropa), **ISO-8859-2**, **Windows-1251** (azbuka). **Problém:** otevřeš text v jiném kódování → "rozsypaný čaj" (nesmyslné znaky).

#### UTF-8
**Dnešní standard.** Mezinárodní, znaky všech jazyků + emoji. **Proměnná délka 1-4 bajty**:
- ASCII znaky = 1 bajt (zpětně kompatibilní)
- Češtinu s háčky = 2 bajty
- Asijské znaky = 3 bajty
- Emoji = 4 bajty

Pokrývá přes 140 000 znaků (Unicode 15.0). **Pro veškerý nový kód = UTF-8**, žádné nové Windows-1250.

#### Base64
Kóduje **binární data do textového formátu** přes 64 znaků `[A-Z, a-z, 0-9, +, /]`. Pro media, která zvládají jen text:
- **Email přílohy** (MIME)
- **Data URLs**: `data:image/png;base64,iVBORw0KG...`
- **JWT tokeny**
- **Embed obrázků** v CSS/HTML

**Není šifrování!** Kdokoliv to triviálně dekóduje.

---

### 3. Klasické (historické) šifry

#### Transpozice vs substituce

| **Transpozice** | **Substituce** |
|---|---|
| Písmena zůstávají, **mění se pořadí** | Pořadí zůstává, **mění se písmena** |
| Přesmyčka | Náhrada |
| "AHOJ" → "JOHA" | "AHOJ" → "DKRM" (Caesar +3) |

#### Caesarova šifra
Klasická **substituce**. **Posun písmen** o pevný počet.
```
Posun 3:  A → D,  B → E,  H → K
"AHOJ" → "DKRM"
```
**Slabiny:** jen 25 možných klíčů (brute force za sekundy), frekvenční analýza (`e` nejčastější v češtině/angličtině).

#### Vigenèrova šifra
Složitější **polyalfabetická** substituce. Klíč = **heslo**, každé písmeno se posune o jiný počet podle aktuálního písmene hesla.
```
Heslo:  AXOAXOAXO
Zpráva: AHOJSVETE
```
Před počítači extrémně silná. Dnes prolomená **Kasiského zkouškou**.

#### Enigma
**Elektromechanický šifrovací stroj** (Německo, WW2). Substituce, kde se pravidlo mění s každým stiskem klávesy (přes **rotory**). 158 kvintilionů kombinací. **Prolomil Alan Turing** ve Bletchley Parku → začátek éry **počítačové kryptoanalýzy**.

---

### 4. Symetrické šifrování

**Odesílatel i příjemce mají JEDEN STEJNÝ tajný klíč.** Tím se zpráva zamkne i odemkne.

```
Alice ──[ klíč K ]── šifruj ──▶ "X#9$@" ──▶ Bob ──[ klíč K ]── dešifruj
```

**Výhody:**
- **Rychlé** (GB/s s HW akcelerací)
- Nízká výpočetní náročnost
- Krátké klíče (128-256 bitů stačí)

**Nevýhody:**
- **Jak bezpečně předat klíč** přes nezabezpečený kanál? (chicken-and-egg)
- Pro N účastníků = N(N-1)/2 klíčů (pro 100 lidí = 4 950 klíčů)

**Příklady:**

| Algoritmus | Klíč | Stav |
|---|---|---|
| **AES** (Advanced Encryption Standard) | 128/192/256 bitů | **Dnešní standard** |
| **DES** | 56 bitů | **Prolomený** (1997) |
| **3DES** | 168 bitů | Deprecated 2023 |
| **ChaCha20** | 256 bitů | Moderní alternativa AES |

**AES-256:** 2²⁵⁶ klíčů. Prolomit brute-force = **déle než věk vesmíru**.

---

### 5. Asymetrické šifrování

**Každý má DVA klíče:**
- **Veřejný klíč** (public) — sdílíš komukoli, jím se zpráva šifruje
- **Soukromý klíč** (private) — drží jen majitel, jím se zpráva dešifruje

```
Alice chce poslat Bobovi tajnou zprávu:
1. Bob má pár: 🔓 (veřejný) + 🔑 (privátní)
2. Bob sdílí 🔓 veřejně
3. Alice zašifruje zprávu Bobovým 🔓
4. Pošle Bobovi
5. Bob dešifruje svým 🔑
```

**Výhody:**
- **Řeší problém předávání klíčů** (veřejný klíč můžeš poslat klidně po pohlednici)
- Umožňuje **digitální podpisy**
- Pro N účastníků jen N párů klíčů

**Nevýhody:**
- **Pomalé** (1000-10000× než symetrické)
- Vhodné jen pro malá data

**Příklady:**

| Algoritmus | Princip | Klíč |
|---|---|---|
| **RSA** (Rivest-Shamir-Adleman) | Faktorizace velkých čísel | 2048-4096 bitů |
| **ECC** (Elliptic Curve Cryptography) | Eliptické křivky | 256-384 bitů (= RSA 3072+) |
| **DSA, EdDSA** | Pro digitální podpisy | 256+ bitů |

**ECC vyhrává:** stejná bezpečnost při kratších klíčích → rychlejší, menší certifikáty, lépe pro mobil/IoT.

---

### 6. Diffie-Hellman — výměna klíčů

**Problém:** Alice a Bob chtějí stejný tajný klíč, ale komunikují jen **přes nezabezpečený kanál** (kdokoli odposlouchá).

**Analogie s mícháním barev:**

```
1. Veřejně se dohodnou: ŽLUTÁ (Eva odposlouchá, nevadí)
2. Alice si vybere tajnou červenou → smíchá žlutá+červená = oranžová → POŠLE veřejně
3. Bob si vybere tajnou modrou → smíchá žlutá+modrá = zelená → POŠLE veřejně
4. Alice: zelená (Bobova) + červená (svá tajná) = HNĚDÁ
5. Bob: oranžová (Aliciná) + modrá (svá tajná) = HNĚDÁ
   → Oba mají HNĚDOU, Eva ne (potřebovala by červenou nebo modrou)
```

**Matematicky** — místo barev **modulární umocňování** (`g^a mod p`). Pro hackera je z `g^a mod p` extrémně obtížné získat `a` = **diskrétní logaritmus**.

---

### 7. Hybridní šifrování (HTTPS)

V praxi se **kombinují obě techniky:**
```
1. Asymetricky (RSA nebo DH) si bezpečně domluvíme sdílený klíč
2. Pak rychle šifrujeme symetricky (AES)
```

**Proč:** asymetrické je pomalé, ale řeší výměnu. Symetrické je rychlé, ale neumí výměnu. **Hybrid = výhody obou.**

**TLS handshake (HTTPS):**
```
1. Klient → Server: "Podporuju TLS 1.3, AES-256, RSA"
2. Server → Klient: certifikát s veřejným klíčem
3. Klient ověří certifikát (CA: Certificate Authority)
4. DH (nebo ECDHE) výměna → sdílený AES klíč
5. Od teď: HTTP požadavky šifrovány AES-256
```

🔒 v prohlížeči = úspěšný TLS handshake.

---

### 8. Digitální podpis

**Obrácený směr** asymetrického šifrování. Cíl: dokázat, že **zprávu poslal opravdu autor** (autenticita) a **nebyla změněna** (integrita).

```
PODPIS (Alice):
1. Spočítá hash zprávy (SHA-256)
2. Hash zašifruje SVÝM PRIVÁTNÍM klíčem → toto je podpis
3. Pošle: zpráva + podpis

OVĚŘENÍ (Bob):
1. Dešifruje podpis Aliciným VEŘEJNÝM klíčem → hash A
2. Sám spočítá hash z přijaté zprávy → hash B
3. Pokud hash A == hash B → podpis platí
```

**Klíčový obrat:**
- U **šifrování**: šifruješ veřejným, dešifruješ privátním
- U **podpisu**: šifruješ (podepisuješ) **privátním**, ověřuješ **veřejným**

Tím se garantuje: jen majitel privátního klíče mohl vytvořit podpis, ale **kdokoli** ho ověří.

---

### 9. Hashovací funkce

**Hash** = matematický "mlýnek": data jdou dovnitř, **otisk pevné délky** ven.

```
"heslo123"        → SHA-256 → "ef92b778ba..."  (256 bitů)
"heslo124"        → SHA-256 → "5d41402abc..."  (úplně jiný!)
4 GB kniha         → SHA-256 → také 64 hex znaků (pevná délka!)
```

**5 vlastností:**

1. **Jednosměrnost** — z hashe **nelze rekonstruovat** vstup
2. **Deterministický** — stejný vstup → vždy stejný hash
3. **Avalanche effect** — drobná změna vstupu → úplně jiný hash
4. **Fixed-length output** — výstup vždy stejně dlouhý
5. **Collision resistance** — extrémně těžké najít dva různé vstupy se stejným hashem

**Použití:**
1. **Ukládání hesel** (nikdy plaintext, jen hash)
2. **Integrita souborů** (checksum)
3. **Digitální podpisy** (podepisuje se hash, ne celá zpráva)
4. **Blockchain** (každý blok obsahuje hash předchozího)
5. **Deduplikace** dat

**Algoritmy:**

| Algoritmus | Hash | Stav |
|---|---|---|
| **MD5** | 128 bitů | **Prolomený** (2004), nepoužívat |
| **SHA-1** | 160 bitů | **Zastaralý** (2017) |
| **SHA-256** | 256 bitů | **Současný standard** |
| **SHA-3** | 256 bitů | Nová generace |
| **BLAKE2/3** | Variabilní | Moderní, rychlejší |

---

### 10. Hashování hesel — kritické detaily

**Problém 1: Rainbow tables** — útočník si **předem** spočítá hashe pro miliony běžných hesel. Když získá DB hashů, vyhledává.

**Řešení 1: Salt** — náhodný řetězec **přidaný ke heslu před** hashováním.
```
Heslo:   "heslo123"
Salt:    "x7Hc9pL2qR"  (uložen v DB vedle hashe, OTEVŘENÝ!)
Hash = SHA-256("heslo123" + "x7Hc9pL2qR")
```

Každý uživatel má **jiný salt** → rainbow table útočník musí spočítat pro každý salt zvlášť, exponenciálně náročné.

**Problém 2: SHA-256 je moc rychlé** — GPU počítá **miliardy hashů/s**. I se saltem může útočník brute force.

**Řešení 2: Pomalé hash funkce pro hesla:**
- **bcrypt** (1999, Blowfish-based)
- **scrypt** (2009, memory-hard)
- **Argon2** (2015, doporučený dnes)

```
SHA-256:       ~10 nanosekund (GPU: miliardy/s)
bcrypt:        ~250 milisekund (GPU: ~10 000/s)
Argon2:        ~100 ms + GB paměti
```

**Pravidlo: pro hesla NIKDY SHA-256 ani MD5 samotné. Vždy bcrypt, scrypt nebo Argon2.**

---

### 11. HMAC — Hash s klíčem

**HMAC** (Hash-based Message Authentication Code) = **hash kombinovaný s tajným klíčem**.

```
HMAC(klíč, zpráva) = otisk_s_klíčem
```

**K čemu:**
- **Autenticita** — kdo poslal? Jen ten, kdo zná klíč.
- **Integrita** — nebyla zpráva změněna?

**Použití:** JWT (HS256 = HMAC-SHA256), API podpisy (AWS, Stripe webhooks), TLS.

---

## Vztahy / kontrasty

- **Kódování × šifrování:** převod (veřejné) × utajení (s klíčem). Base64 = kódování, AES = šifrování.
- **Transpozice × substituce:** mění pořadí × mění písmena.
- **Symetrické × asymetrické:** 1 klíč rychle × pár klíčů pomalu (řeší výměnu).
- **Šifrování × hash:** lze zpět s klíčem × jednosměrné.
- **Šifrování × podpis:** šifruj veřejným/dešifruj privátním × šifruj (podepiš) privátním/ověř veřejným.
- **SHA-256 × bcrypt pro hesla:** SHA rychlý (špatné pro hesla), bcrypt pomalý (správné).

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi kódováním a šifrováním?
**A:** **Kódování** slouží k **převodu dat pro přenos/zobrazení** (ASCII převede znaky na čísla, UTF-8 podporuje všechny jazyky, Base64 binární data na text). Je **veřejné**, kdokoli dekóduje. **Šifrování** je o **utajení** — zpráva se změní tak, aby ji přečetl jen ten, kdo má **správný klíč**. Příklady šifrování: AES, RSA.

**Q:** Co je rozdíl mezi symetrickým a asymetrickým šifrováním?
**A:** **Symetrické** — obě strany sdílí **jeden tajný klíč**, kterým se zpráva zamkne i odemkne. Je **rychlé** (gigabytes/s), ale **problém s předáním klíče** přes nezabezpečený kanál. Příklad: **AES**. **Asymetrické** — každý má **pár klíčů**: veřejný (sdílíš) + soukromý (tajný). Šifruje se veřejným, dešifruje privátním. **Řeší výměnu klíčů**, ale je **1000-10000× pomalejší**. Příklad: **RSA**.

**Q:** Co je Diffie-Hellman?
**A:** Matematický protokol pro **bezpečnou výměnu klíče přes nezabezpečený kanál**. Princip přes analogii s mícháním barev: oba se veřejně domluví na barvě, každý přidá svou tajnou, vymění mezi sebou směsi, finálně přidá svou tajnou do směsi druhého → oba mají stejnou barvu. Hacker vidí jen směsi, neumí oddělit tajnou barvu zpět. Matematicky: **modulární umocňování** + **diskrétní logaritmus**. Použití: TLS handshake v HTTPS.

**Q:** Co je hybridní šifrování a kde se používá?
**A:** **Kombinuje obě techniky:** asymetrické (RSA / DH) pro **bezpečnou výměnu klíče**, pak symetrické (AES) pro **rychlé šifrování dat**. **Příklad: HTTPS** — TLS handshake si asymetricky domluví AES klíč, pak všechny HTTP požadavky jdou symetricky AES-256. Důvod: asymetrické pomalé ale řeší výměnu, symetrické rychlé ale neřeší výměnu. Hybrid = výhody obou.

**Q:** Co je hash a jaké má vlastnosti?
**A:** **Jednosměrná funkce** převádějící libovolně dlouhý vstup na **otisk pevné délky**. 5 vlastností: **jednosměrnost** (zpět nelze), **determinismus** (stejný vstup → stejný hash), **avalanche effect** (drobná změna vstupu → úplně jiný hash), **fixed-length output**, **collision resistance** (těžké najít 2 vstupy se stejným hashem). Algoritmy: SHA-256 (standard), MD5/SHA-1 prolomené.

**Q:** Jak se správně ukládají hesla v databázi?
**A:** **Nikdy v plaintextu, ani zašifrovaná, ale jako hash + salt.** Salt = náhodný řetězec přidaný k heslu **před** hashováním, **jiný pro každého uživatele**, ukládá se vedle hashe (otevřený). Brání **rainbow table** útokům. Plus **nepoužívat SHA-256** — je moc rychlé (GPU počítá miliardy hashů/s). Pro hesla použít **bcrypt, scrypt nebo Argon2** — záměrně pomalé (stovky ms) a paměťově náročné, znemožňují masivní brute force.

**Q:** Jak funguje digitální podpis?
**A:** **Obrácený směr asymetrického šifrování.** Podepisuje se **hash** zprávy: 1) Alice spočítá hash zprávy. 2) Hash **zašifruje svým PRIVÁTNÍM klíčem** → to je digitální podpis. 3) Pošle zprávu + podpis. **Ověření (Bob):** 1) Dešifruje podpis Aliciným VEŘEJNÝM klíčem → získá hash. 2) Sám spočítá hash z přijaté zprávy. 3) Pokud se shodují, podpis platí. Garantuje: **autenticita** (jen Alice má privátní klíč) + **integrita** (změněná zpráva → jiný hash).

---

## Status

- **Sebehodnocení (před):** 5/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
