---
subject: SWI
number: 3
title: "Reprezentace dat"
tags: ["kódování", "datové-typy", "programování", "c-sharp"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> Počítač pracuje výhradně s **jedničkami a nulami** — používá **dvojkovou (binární) soustavu**. Veškerá data (čísla, text, obrázky, zvuk) musí být převedena do této reprezentace. **Jednotka informace:** 1 bit (b) = 0 nebo 1. 1 bajt (B) = 8 bitů. Pro lidskou čitelnost se používá **hexadecimální** soustava (0x), pro běžné výpočty **desítková**. Znaky se kódují přes **ASCII** (1 bajt, 128 znaků) nebo dnes **UTF-8** (proměnná velikost, podporuje všechny jazyky). Datum se interně reprezentuje jako **Unix Time** (počet sekund od 1.1.1970).

---

## Klíčové pojmy

- **Bit (b)** — základní jednotka informace, hodnota 0 nebo 1
- **Bajt (B)** — 8 bitů
- **Číselná soustava** — způsob zápisu čísel pomocí číslic (báze určuje, kolik číslic)
- **Binární (dvojková)** — báze 2, počítačová
- **Desítková (decimal)** — báze 10, lidská
- **Hexadecimální** — báze 16, lidsky čitelná reprezentace binární
- **ASCII** — American Standard Code for Information Interchange (7 bitů, 128 znaků)
- **UTF-8** — Unicode Transformation Format, proměnná velikost 1–4 bajty
- **Unicode** — standard pro reprezentaci všech znaků světa, ~150 000+ kódových bodů
- **Unix Time** — počet sekund od 1.1.1970 (epocha)
- **Elementární typ** — jedna nedělitelná hodnota (int, bool, char)
- **Složený typ** — z více prvků (array, string, struct, class)

---

## Hlavní výklad (5–10 min mluvení)

### 1. Bit, bajt, jednotky

**Bit (b)** = nejmenší jednotka informace, **2 stavy** (0 / 1). **Bajt (B)** = 8 bitů → 2⁸ = **256 různých hodnot**.

#### Jednotky podle SI (násobky 1000)
| Zkratka | Velikost |
|---|---|
| B | 1 bajt |
| **kB** | 1 000 B = 10³ |
| **MB** | 1 000 000 B = 10⁶ |
| **GB** | 10⁹ |
| **TB** | 10¹² |
| **PB** | 10¹⁵ |

#### Jednotky podle IEC (násobky 1024)
| Zkratka | Velikost |
|---|---|
| **KiB** (kibibyte) | 1 024 B = 2¹⁰ |
| **MiB** (mebibyte) | 1 048 576 B = 2²⁰ |
| **GiB** (gibibyte) | 2³⁰ |
| **TiB** (tebibyte) | 2⁴⁰ |

⚠️ **Past:** historicky se "1 KB" často používalo pro 1024 B (binární), což matlo. Standardně dnes:
- **kB = 1 000 B** (SI)
- **KiB = 1 024 B** (IEC, binární)

Rozdíl je ~2.4 % — proč 1 TB disk ukazuje ve Windows jen ~931 GiB (Windows počítá binární GiB, výrobce SI GB).

### 2. Číselné soustavy

**Soustava (báze N)** = systém zápisu čísel pomocí N různých číslic.

| Soustava | Báze | Číslice | Použití |
|---|---|---|---|
| **Binární** | 2 | 0, 1 | počítač (CPU, paměť) |
| **Osmičková** | 8 | 0–7 | Unix práva (`chmod 755`) |
| **Desítková** | 10 | 0–9 | lidská |
| **Šestnáctková (hex)** | 16 | 0–9, A–F | barvy CSS (`#FF0000`), MAC adresy, prefix `0x` |
| **Dvanáctková** | 12 | 0–9, A, B | historická (hodiny, tucet) |
| **Šedesátková** | 60 | — | Babylon (čas, úhly) |
| **Dvacítková** | 20 | — | Mayové (10 prstů + 10 nohou) |

#### Konverze — desítková → binární

```
Příklad: 13 → binární
13 / 2 = 6  zbytek 1
 6 / 2 = 3  zbytek 0
 3 / 2 = 1  zbytek 1
 1 / 2 = 0  zbytek 1

Čteme zbytky odspoda nahoru: 1101₂

Ověření: 1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 8 + 4 + 0 + 1 = 13 ✓
```

#### Konverze — binární → desítková

Sečteme **mocniny 2** podle jedniček v zápise:
```
1101₂ = 1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 8 + 4 + 0 + 1 = 13
```

#### Konverze — binární → hexadecimální

**Snadné:** 4 bity = 1 hex číslice (protože 2⁴ = 16).

```
binární:    1101 1010
              ↓    ↓
hex:         D    A     → 0xDA
```

Tabulka 4-bit → hex:
```
0000=0  0100=4  1000=8  1100=C
0001=1  0101=5  1001=9  1101=D
0010=2  0110=6  1010=A  1110=E
0011=3  0111=7  1011=B  1111=F
```

#### Hex v praxi

- **CSS barvy:** `#FF0000` (červená) = R:255 G:0 B:0
- **Prefix `0x` v C#:** `int hex = 0xFF; // 255`
- **MAC adresa:** `A4:5E:60:84:8E:0B`
- **Memory adresy v debuggeru:** `0x7FFE8A2C`

### 3. Znaky a kódování

**Počítač zná jen čísla** — pro reprezentaci znaků (písmen, symbolů) musí být **mapování číslo ↔ znak**.

#### ASCII

**American Standard Code for Information Interchange** (1963).
- **7 bitů** → 128 znaků (později rozšířen na 8 bitů = 256 znaků v různých "code pages")
- Pokrývá: anglickou abecedu (A–Z, a–z), číslice (0–9), interpunkce, řídicí znaky (newline, tab)
- **Nepokrývá** diakritiku (háčky, čárky), čínské znaky, emoji

Klíčové hodnoty:
- `'A'` = 65, `'a'` = 97 (rozdíl 32)
- `'0'` = 48, `'9'` = 57
- `' '` (space) = 32
- `'\n'` (newline) = 10
- `'\t'` (tab) = 9

#### Unicode + UTF-8

**Unicode** = standard pro reprezentaci znaků všech jazyků světa (~150 000+ kódových bodů).

**UTF-8** = nejpoužívanější kódování Unicode:
- **Proměnná velikost** 1–4 bajty na znak
- **ASCII zpětně kompatibilní** — anglické znaky stále 1 bajt
- Diakritika (`á`, `ě`) → 2 bajty
- Čínské znaky → 3 bajty
- Emoji → 4 bajty

**UTF-16** = jiné kódování, používané ve Windows interně (každý znak 2 nebo 4 bajty).

**Praxe:** `<meta charset="UTF-8">` v HTML, `using System.Text;` v C# pro práci s `Encoding.UTF8`.

### 4. Datum — Unix Time

Počítače interně reprezentují datum jako **počet sekund od 1.1.1970 00:00:00 UTC** (epocha).

**Příklady:**
- `0` = 1.1.1970 00:00:00
- `1_700_000_000` ≈ listopad 2023
- **Year 2038 problem** — 32-bit signed int přeteče 19.1.2038 (2³¹ sekund). Řešení: 64-bit timestamp.

**Formátování pro člověka:**
- ISO 8601: `2026-05-13T14:30:00Z` (mezinárodní standard)
- Americké: `MM/DD/YYYY` → `05/13/2026`
- České: `DD.MM.YYYY` → `13.5.2026`

V C#: `DateTime`, `DateTimeOffset`, `ToString("yyyy-MM-dd")`.

### 5. Datové typy

**Elementární (primitivní)** — jedna nedělitelná hodnota:

| Typ | Velikost | Rozsah |
|---|---|---|
| `bool` | 1 bit (logicky) | true / false |
| `byte` (unsigned) | 1 B | 0 – 255 |
| `sbyte` (signed) | 1 B | -128 – 127 |
| `short` | 2 B | -32 768 – 32 767 |
| `int` | 4 B | -2.1 mld – 2.1 mld |
| `long` | 8 B | -9.2·10¹⁸ – 9.2·10¹⁸ |
| `float` | 4 B | ±3.4·10³⁸, ~7 desetinných míst |
| `double` | 8 B | ±1.7·10³⁰⁸, ~15 desetinných míst |
| `decimal` | 16 B | přesné desetinné (peníze) |
| `char` | 2 B | jeden Unicode znak |
| **Pointer / Reference** | 4 nebo 8 B | adresa v paměti |

**Složené (strukturované)** — z více prvků:
- **Pole (array)** — homogenní, fixní velikost
- **String** — sekvence znaků (v C# imutabilní)
- **Enum** — výčtový typ
- **Struct** — hodnotový složený typ
- **Class** — referenční složený typ
- **Interface** — kontrakt

### 6. Reprezentace záporných čísel — dvojkový doplněk

⚠️ *(Doplněno z obecných znalostí — v hodina-poznámkách chybí, ale komise to může pichnout.)*

**Two's complement** = standardní způsob reprezentace záporných čísel. Pro 8-bit:

```
 5 = 00000101
-5:
1) invertuj bity:  11111010
2) přičti 1:       11111011

Ověření: 0xFB v hex = -5 decimal (signed 8-bit)
```

**Výhody:**
- Pouze jedna reprezentace nuly (`00000000`)
- Sčítání a odčítání používá stejné CPU operace

**Důsledek pro `int` (32-bit signed):**
- Rozsah: -2³¹ až 2³¹-1 = -2 147 483 648 až 2 147 483 647
- Jeden záporný "navíc" — `Math.Abs(int.MinValue)` přeteče!

### 7. Reprezentace desetinných čísel — IEEE 754

⚠️ *(Doplněno z obecných znalostí.)*

**IEEE 754** = standard pro floating-point čísla. `float` (32-bit) a `double` (64-bit) mají strukturu:

```
[znaménko: 1 bit] [exponent: 8/11 bitů] [mantisa: 23/52 bitů]
```

**Důsledek:** floating-point čísla jsou **nepřesná**:
```cs
Console.WriteLine(0.1 + 0.2);  // 0.30000000000000004 (ne 0.3!)
```

**Pro peníze používej `decimal`** — přesná reprezentace.

---

## Konkrétní příklady / kód

### Konverze v C#
```cs
// Decimal → Binary string
int n = 13;
string bin = Convert.ToString(n, 2);    // "1101"

// Decimal → Hex string
string hex = n.ToString("X");            // "D"
string hexUpper = $"0x{n:X}";            // "0xD"

// Hex string → Decimal
int dec = Convert.ToInt32("FF", 16);    // 255
int prefix = Convert.ToInt32("0xFF".Substring(2), 16);

// Binary string → Decimal
int b = Convert.ToInt32("1101", 2);     // 13
```

### Práce se znaky a ASCII
```cs
char c = 'A';
int ascii = (int)c;                     // 65

char back = (char)97;                    // 'a'

// Porovnání case-insensitive
char upper = 'A', lower = 'a';
bool same = upper + 32 == lower;        // true (rozdíl 32)
```

### Práce s Unix Time
```cs
DateTimeOffset now = DateTimeOffset.UtcNow;
long unix = now.ToUnixTimeSeconds();    // např. 1_747_138_800

DateTimeOffset epoch = DateTimeOffset.FromUnixTimeSeconds(1_747_138_800);
string formated = epoch.ToString("yyyy-MM-dd HH:mm");
```

### Floating-point past
```cs
double a = 0.1 + 0.2;
Console.WriteLine(a);           // 0.30000000000000004 (ne 0.3!)
Console.WriteLine(a == 0.3);    // false

// Řešení pro peníze:
decimal cena = 0.1m + 0.2m;
Console.WriteLine(cena);        // 0.3 přesně
```

---

## Vztahy / kontrasty

- **Bit × bajt** — bit nejmenší, bajt = 8 bitů.
- **kB × KiB** — kB = 1000 (SI), KiB = 1024 (IEC). 1 TB disk = 931 GiB ve Windows.
- **Binární × hex** — počítač používá binární, lidé hex pro čitelnost (1 hex číslice = 4 bity).
- **ASCII × UTF-8** — ASCII jen anglické znaky (7 bitů). UTF-8 univerzální, proměnná velikost, ASCII-kompatibilní.
- **`float` × `decimal`** — float rychlý, ale **nepřesný** pro desetinné. decimal **přesný** (důležité pro peníze).
- **Elementární × složené typy** — elementární = jeden nedělitelný kus dat. Složený = více prvků (array, struct, class).
- **Unix Time × ISO 8601** — Unix Time interní (sekundy od epochy). ISO 8601 textová reprezentace pro lidi.

---

## Časté otázky komise

**Q:** Kolik bitů je v jednom bajtu?
**A:** **8 bitů.** 1 bajt umí reprezentovat 2⁸ = 256 různých hodnot.

**Q:** Jaký je rozdíl mezi kB a KiB?
**A:** **kB** (kilobajt, SI) = 1000 B. **KiB** (kibibyte, IEC) = 1024 B (= 2¹⁰). Historicky se zaměňovalo. Důsledek: 1 TB disk ukazuje ve Windows ~931 GiB (Windows počítá binární GiB).

**Q:** Převeď číslo 13 do binární soustavy.
**A:** 13 = 8 + 4 + 1 = 2³ + 2² + 2⁰ = **1101₂**. Postup dělením 2 se zbytky: 13/2=6r1, 6/2=3r0, 3/2=1r1, 1/2=0r1, čteme odspoda.

**Q:** Co je hex `0xFF` v decimal?
**A:** **255.** Výpočet: F·16¹ + F·16⁰ = 15·16 + 15·1 = 240 + 15 = 255. Hex `FF` reprezentuje maximální hodnotu 1 bajtu.

**Q:** Jaký je rozdíl mezi ASCII a UTF-8?
**A:** **ASCII** = 7 bitů, 128 znaků, jen anglická abeceda + interpunkce. **UTF-8** = Unicode kódování, proměnná velikost 1–4 bajty, podporuje všechny jazyky a emoji. UTF-8 je **zpětně kompatibilní** s ASCII (anglické znaky stále 1 bajt).

**Q:** Co je Unix Time?
**A:** Počet **sekund od 1.1.1970 00:00 UTC** (epocha). Standardní reprezentace data v počítači — jedno číslo místo komplexní struktury. Formátování pro člověka přes ISO 8601 (`2026-05-13`) nebo regionální (`13.5.2026`).

**Q:** Vyjmenuj elementární datové typy.
**A:** `bool` (true/false), `byte`/`int`/`long` (celé), `float`/`double`/`decimal` (desetinné), `char` (znak), `pointer`/`reference` (adresa). Plus jejich varianty: `short`, `sbyte`, `uint` atd.

**Q:** Co znamená prefix `0x` u čísla?
**A:** Označuje **hexadecimální (šestnáctkový) zápis**. Např. `0xFF` = 255 v desítkové, `0x10` = 16 v desítkové. Používá se v programovacích jazycích (C#, C++, Java).

**Q:** Proč `0.1 + 0.2` v C# vrátí `0.30000000000000004`?
**A:** `double` používá **binární floating-point** reprezentaci (IEEE 754). Číslo 0.1 nelze v binární soustavě přesně vyjádřit konečným počtem bitů — vznikne zaokrouhlovací chyba. Pro **peníze a přesné výpočty** používej `decimal` (16 bajtů, přesná decimal reprezentace).

**Q:** Co je dvojkový doplněk a k čemu slouží?
**A:** **Standardní způsob reprezentace záporných čísel** v binární soustavě. Postup: invertuj bity + přičti 1. Výhody: jedna reprezentace nuly, sčítání/odčítání = stejná operace CPU. Důsledek: 32-bit signed int má rozsah -2³¹ až 2³¹-1 (jeden záporný "navíc").

---

## Co bych ještě měl vědět (volně)

- **Endianness** — pořadí bajtů ve víceslovních číslech. **Little-endian** (x86, ARM — nižší bajt první) × **Big-endian** (sítě, některé starší procesory).
- **Binární operátory v C#:** `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), `<<` (shift left), `>>` (shift right).
- **Bit flags v enum:** `[Flags] enum Permissions { Read = 1, Write = 2, Execute = 4 }` — kombinace přes OR.
- **Base64** — kódování binárních dat do ASCII textu (pro email, JSON). 3 bajty → 4 znaky.
- **Hash funkce** — SHA-256, MD5 — fixní délka, jednosměrné (detail v SWI 7/8).
- **NaN, Infinity** — speciální hodnoty u float/double pro nedefinované operace (0/0, ∞-∞).
- **Boxing/Unboxing** — převod hodnotového typu na referenční přes obal `object` (`object o = 5;`) — pomalé.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na `_materials/swi/03/prchal/` (hodina-poznámky) + `nezarucene/` DOCX. Materiál pokrývá xlsx Popis (*"Jednotky, datum, číselné soustavy, znaky, základní a složené typy"*) + doplněno o **dvojkový doplněk** a **IEEE 754** (komise se na ně občas ptá).
- ⚠️ **Konverze mezi soustavami** — v hodina-poznámkách není podrobně, doplněno standardní algoritmus dělením/sčítáním mocnin.
- ⚠️ **Velikost typů v C#** — některé jsou platform-dependent (`IntPtr`, ne `int`). Pro maturitu drž standardní velikosti uvedené v tabulce.

---

## Status

- **Sebehodnocení (před):** 4/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-13
