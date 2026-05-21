---
subject: DAT
number: 12
title: "Souborový systém a streamy"
tags: ["programování", "c-sharp", "kódování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**Souborový systém** = způsob, jakým **OS organizuje data na disku** (hierarchie, metadata, oprávnění). Příklady: **NTFS** (Windows), **ext4** (Linux), **APFS** (macOS), **FAT32** (flash disky). Soubory jsou **textové** (převod bajt → znak podle kódování — UTF-8) nebo **binární** (raw data, obrázky, MP3). V C# se s nimi pracuje přes statické metody `File` (rychlé operace) nebo **streamy** `FileStream / StreamReader / StreamWriter` (pro velké soubory čtené po částech).

---

## Klíčové pojmy

- **Souborový systém** — OS organizuje data na disku
- **NTFS, ext4, FAT32, APFS** — konkrétní typy
- **Žurnálování** — deníček před zápisem, prevence poškození při výpadku
- **Cesta** — absolutní (`C:\...`) × relativní (`./...`, `../...`)
- **Metadata** — info o souboru (jméno, velikost, čas)
- **Kódování** — ASCII, UTF-8, Windows-1250
- **EOL (End-of-Line)** — `\r\n` (Win), `\n` (Linux)
- **Stream** — sekvenční proud bajtů
- **`FileStream`, `StreamReader/Writer`, `BinaryReader/Writer`** — C# stream třídy
- **Buffer** — mezi-paměť v RAM před zápisem
- **`using`** — garantované zavření (Dispose)
- **`Directory`** — operace nad složkami
- **stdin / stdout / stderr** — standardní streamy

---

## Hlavní výklad

### 1. Souborový systém — k čemu

OS organizuje data na disku:
- **Hierarchie** (složky a podsložky)
- **Metadata** (jméno, velikost, čas)
- **Oprávnění** (kdo smí číst/zapisovat)

### 2. Typy souborových systémů

| Systém | Princip | Použití |
|---|---|---|
| **FAT32 / exFAT** | Velká tabulka na začátku disku | Flash disky, SD karty |
| **NTFS** | Žurnálovaný, oprávnění, komprese, šifrování | Windows |
| **ext4** | Inody (metadata + adresy bloků odděleně) | Linux |
| **APFS** | Snapshoty, copy-on-write | macOS |

**Žurnálování** = před zápisem se poznamená "chci provést X". Při výpadku se po startu deníček dokončí nebo vrátí → **žádné poškozené soubory**.

### 3. Hierarchie a cesty

**Windows × Linux:**

| | Windows | Linux/macOS |
|---|---|---|
| **Oddělovač** | `\` | `/` |
| **Kořen** | `C:\`, `D:\` (každý disk vlastní) | `/` (jeden) |
| **Case sensitivity** | Nerozlišuje (`Foo.txt` = `foo.txt`) | Rozlišuje |

**Linuxové pravidlo:** *"vše je soubor"* — i klávesnice (`/dev/input`), disk (`/dev/sda`), tiskárna.

**Absolutní × relativní cesta:**
```
ABSOLUTNÍ:                      RELATIVNÍ:
C:\Users\axo\ukol.txt          ukol.txt           (tady)
/home/axo/ukol.txt             ./obrazky/foto.png (./ aktuální)
                               ../jine/text.txt   (.. o úroveň výš)
Funguje vždy, odkudkoliv       Funguje jen z konkrétního adresáře
```

### 4. Cesty v C#

```csharp
using System.IO;

string p1 = Path.Combine("data", "subor.txt");           // multiplatformně!
string jmeno = Path.GetFileName(p1);                     // "subor.txt"
string ext = Path.GetExtension(p1);                      // ".txt"
string slozka = Path.GetDirectoryName(p1);               // "data"
string abs = Path.GetFullPath(p1);                       // absolutní cesta
char sep = Path.DirectorySeparatorChar;                  // '\' Win, '/' Linux
string bezExt = Path.GetFileNameWithoutExtension(p1);    // "subor"
```

**Pravidlo:** vždy **`Path.Combine`**, ne ruční spojování přes `+`. Funguje na všech OS.

### 5. Metadata a oprávnění

**FileInfo v C#:**
```csharp
FileInfo fi = new FileInfo("subor.txt");
long velikost = fi.Length;
DateTime vytvoreno = fi.CreationTime;
DateTime upraveno = fi.LastWriteTime;
bool jenKeCteni = fi.IsReadOnly;
string ext = fi.Extension;
```

**Linuxová oprávnění (rwx):**
- `r` (read = 4), `w` (write = 2), `x` (execute = 1)
- 3 skupiny: User / Group / Other
- `chmod 755` = `rwxr-xr-x` (vlastník vše 7=4+2+1, ostatní 5=4+1)

### 6. Textové × binární soubory

| | Textové | Binární |
|---|---|---|
| **Pro koho** | Lidé | Stroje |
| **Obsah** | Znaky (převod bajty ↔ znaky podle kódování) | Raw data |
| **Příklady** | `.txt`, `.csv`, `.json`, `.xml`, `.cs` | `.png`, `.mp3`, `.exe`, `.pdf` |
| **C# čtení** | `StreamReader` (po řádcích) | `BinaryReader`, `FileStream` |

**Důležité:** koncovka **nedefinuje**, co je uvnitř. O typu rozhoduje **hlavička souboru** (magic number).

### 7. Kódování

| Kódování | Bity | Co umí |
|---|---|---|
| **ASCII** | 7 | Angličtina (A-Z, 0-9) |
| **Windows-1250** | 8 | Středoevropské (legacy) |
| **UTF-8** | 8+ (variabilní 1-4 B) | **Celý svět**, dnešní standard |
| **UTF-16** | 16+ | Vnitřně Windows API a .NET strings |

**UTF-8 default.** Pokud čteš starší soubor v jiném kódování → **mojibake** ("Ť ďÁ"). Řešení: explicitně specifikovat:
```csharp
using StreamReader sr = new StreamReader("legacy.txt", Encoding.GetEncoding("windows-1250"));
```

### 8. EOL (End-of-Line)

| OS | Znak | Hex |
|---|---|---|
| **Windows** | `\r\n` (CR LF) | 0D 0A |
| **Linux/macOS** | `\n` (LF) | 0A |
| **Klasický Mac** | `\r` (CR) | 0D |

Velký zdroj problémů při sdílení mezi systémy. **Git** to řeší přes `core.autocrlf`.

### 9. Postup práce se souborem

```
OTEVŘÍT → ZPRACOVAT → ZAVŘÍT
```

**Režimy otevření v C#:**
- `FileMode.Open` — existující
- `FileMode.Create` — **přepíše! smaže existující obsah**
- `FileMode.Append` — přidat na konec
- `FileMode.OpenOrCreate` — otevři, jinak vytvoř

**`FileAccess`:** `Read`, `Write`, `ReadWrite`

### 10. Buffer a Flush

Zápis na disk je pomalý → program píše do **bufferu v RAM**, ten se flushne na disk.

**⚠️ Pokud program spadne před `Close()` nebo `Flush()`, data v bufferu se ZTRATÍ.** Proto vždy `using`.

### 11. `using` v C# (garantované zavření)

```csharp
// ❌ Bez using: výjimka = soubor neuzavřený
StreamReader sr = new StreamReader("file.txt");
string text = sr.ReadToEnd();
sr.Close();    // pokud výjimka výše, sem se nedostaneme

// ✓ S using: GARANTOVANĚ zavře, i při výjimce
using (StreamReader sr = new StreamReader("file.txt"))
{
    string text = sr.ReadToEnd();
}

// ✓ Modernější (C# 8+):
using StreamReader sr = new StreamReader("file.txt");
string text = sr.ReadToEnd();
// uzavře na konci scope
```

### 12. Try-catch při I/O

**Všechny I/O operace jsou rizikové** (soubor neexistuje, chybí práva, disk plný, soubor využívá jiný proces, výpadek sítě).

```csharp
try
{
    string obsah = File.ReadAllText("data.txt");
}
catch (FileNotFoundException)
{
    Console.WriteLine("Soubor neexistuje");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("Nemám práva");
}
catch (IOException ex)
{
    Console.WriteLine($"I/O chyba: {ex.Message}");
}
```

**Nejčastější výjimky:**
- `FileNotFoundException` — soubor neexistuje
- `DirectoryNotFoundException` — složka neexistuje
- `UnauthorizedAccessException` — chybí práva
- `IOException` — obecná (disk plný, zamčený)
- `PathTooLongException` — Windows 260 znaků default

### 13. Třídy v .NET pro práci se soubory

```
File (statické metody)         — jednorázové operace
  ├── File.ReadAllText / WriteAllText
  ├── File.ReadAllLines / WriteAllLines
  ├── File.ReadAllBytes / WriteAllBytes
  └── File.Exists / Delete / Move / Copy

Streamy                         — velké soubory
  ├── FileStream (bajty)
  ├── StreamReader / StreamWriter (text, po řádcích)
  └── BinaryReader / BinaryWriter (binární data typovaně)

Adresáře
  ├── Directory.GetFiles / GetDirectories
  └── DirectoryInfo / FileInfo (bohatší API)
```

**Rychlé operace (`File`):**
```csharp
File.WriteAllText("a.txt", "Ahoj");
string text = File.ReadAllText("a.txt");

File.WriteAllLines("a.txt", new[] { "ř1", "ř2" });
string[] radky = File.ReadAllLines("a.txt");

byte[] data = File.ReadAllBytes("a.png");
File.WriteAllBytes("kopie.png", data);

File.AppendAllText("log.txt", "Nová položka\n");
bool ex = File.Exists("a.txt");
File.Delete("a.txt");
File.Move("a.txt", "b.txt");
File.Copy("a.txt", "kopie.txt", overwrite: true);
```

**Adresáře (`Directory`):**
```csharp
string[] soubory = Directory.GetFiles("data");
string[] vse = Directory.GetFiles("data", "*", SearchOption.AllDirectories);  // rekurzivně
string[] txt = Directory.GetFiles("data", "*.txt");
string[] slozky = Directory.GetDirectories("data");

Directory.CreateDirectory("nova/podslozka");
Directory.Delete("data", recursive: true);
bool ex = Directory.Exists("data");
```

### 14. Streamy (datové proudy)

**Analogie:**
- **Soubor jako celek** = voda v nádrži (můžeš se hrabat doprostřed)
- **Stream** = voda v hadici (teče k tobě, zpracováváš sekvenčně)

**`Stream`** je abstraktní třída v `System.IO`. Z ní dědí:
- **`FileStream`** — soubor
- **`MemoryStream`** — paměť
- **`NetworkStream`** — síť (socket)
- **`GZipStream`** — komprese

**Klíčová výhoda streamu:** **nečte celý soubor do paměti naráz**. Zvládne i soubory větší než RAM (10 GB log).

**StreamReader (čtení po řádcích):**
```csharp
using StreamReader sr = new StreamReader("velky.txt");
string radek;
while ((radek = sr.ReadLine()) != null)
{
    Console.WriteLine(radek);
}
```

**StreamWriter (zápis):**
```csharp
using StreamWriter sw = new StreamWriter("vystup.txt");
sw.WriteLine("První");
sw.WriteLine("Druhý");
// při Dispose se buffer flushne na disk
```

**BinaryReader / BinaryWriter (binární data typovaně):**
```csharp
using BinaryWriter bw = new BinaryWriter(File.Open("data.bin", FileMode.Create));
bw.Write(69);       // int (4 B)
bw.Write(3.14);     // double (8 B)
bw.Write("Ahoj");   // string s prefixem délky

using BinaryReader br = new BinaryReader(File.Open("data.bin", FileMode.Open));
int n = br.ReadInt32();
double d = br.ReadDouble();
string s = br.ReadString();
```

**`Seek` (skok v souboru):**
```csharp
fs.Seek(10, SeekOrigin.Begin);    // skok na bajt 10
fs.Seek(0, SeekOrigin.End);       // skok na konec
fs.Seek(-5, SeekOrigin.Current);  // 5 zpět od aktuální
```

### 15. Standardní streamy konzole

| # | Stream | Účel | C# |
|---|---|---|---|
| 0 | **stdin** | Vstup od uživatele | `Console.ReadLine()` |
| 1 | **stdout** | Výstup výsledku | `Console.WriteLine()` |
| 2 | **stderr** | Chybové hlášky | `Console.Error.WriteLine()` |

**Přesměrování (shell pipes):**
```bash
program > vystup.txt          # stdout do souboru
program 2> chyby.log          # stderr do souboru
program < vstup.txt           # vstup ze souboru
program1 | program2           # stdout prvního → stdin druhého
```

### 16. CSV / JSON

**CSV:**
```csharp
foreach (var radek in File.ReadAllLines("data.csv").Skip(1))   // přeskoč hlavičku
{
    var p = radek.Split(';');
    Console.WriteLine($"{p[0]} ({p[1]}, {p[2]} let)");
}
```

**JSON přes `System.Text.Json`:**
```csharp
using System.Text.Json;

var osoba = new { Jmeno = "axo", Vek = 18 };
string json = JsonSerializer.Serialize(osoba, new JsonSerializerOptions { WriteIndented = true });
File.WriteAllText("a.json", json);

string raw = File.ReadAllText("a.json");
var data = JsonSerializer.Deserialize<MujRecord>(raw);
```

### 17. Async I/O

```csharp
string text = await File.ReadAllTextAsync("velky.txt");
await File.WriteAllTextAsync("v.txt", text);

using StreamReader sr = new StreamReader("a.txt");
string line;
while ((line = await sr.ReadLineAsync()) != null) { /* ... */ }
```

---

## Vztahy / kontrasty

- **`File` × Stream:** statická pro jednorázové × stream pro postupné/velké
- **`ReadAllText` × `StreamReader.ReadLine`:** všechno do RAM × po řádcích (velké soubory)
- **Textový × binární soubor:** kódování (UTF-8) × raw bajty
- **`StreamReader` × `BinaryReader`:** text × binární typované
- **`Path.Combine` × string `+`:** multiplatformní × ne
- **`FileMode.Open` × `Create`:** existující × přepíše/vytvoří
- **`using` × manuální Close:** garantované × při výjimce neuzavřeno

---

## Časté otázky komise

**Q:** Co je souborový systém?
**A:** Způsob, jakým **OS organizuje data na disku**. Zajišťuje **hierarchii** (složky), **metadata** (jméno, velikost, čas), **oprávnění** (kdo smí číst/zapisovat). Příklady: **NTFS** (Windows, žurnálovaný), **ext4** (Linux), **APFS** (macOS), **FAT32** (flash disky).

**Q:** Co je rozdíl mezi textovým a binárním souborem?
**A:** Pro počítač jsou všechny soubory jen **bajty**. **Textový** = data určená pro lidi, bajty se převádějí na znaky přes **kódování** (UTF-8). Příklady: `.txt`, `.csv`, `.json`. **Binární** = data pro stroje, raw bajty bez převodu. Příklady: `.png`, `.mp3`, `.exe`. **Koncovka nedefinuje obsah** — o typu rozhoduje hlavička souboru (magic number).

**Q:** Co je stream a kdy ho použít?
**A:** **Stream** je **abstraktní třída v `System.IO`** reprezentující sekvenční proud bajtů. Analogie: soubor jako celek = voda v nádrži, stream = voda v hadici. **Klíčová výhoda:** nečte celý soubor do paměti, **zvládne soubory větší než RAM**. V .NET: `FileStream`, `StreamReader/Writer` (text), `BinaryReader/Writer` (binární), `NetworkStream`, `MemoryStream`.

**Q:** Proč používat `using` v C# pro práci se soubory?
**A:** **`using` garantuje zavření souboru (Dispose), i když nastane výjimka.** Bez něj se může soubor zaseknout otevřený nebo se ztratí data z bufferu. Buffer = mezi-paměť v RAM, kde se zápisy hromadí. Před `Close()` / `Flush()` se data **nezapsala na disk**. Pokud program spadne před `Close()`, data v bufferu se ztratí.

**Q:** Co dělá `Path.Combine` a proč ho používat?
**A:** **Spojuje cesty multiplatformně** — používá správný oddělovač (`\` na Windows, `/` na Linuxu). Příklad: `Path.Combine("data", "sub", "f.txt")`. **Bez něj** by ruční `"data" + "/" + "f.txt"` fungovalo jen na Linuxu, ne na Windows. Plus `Path.Combine` umí ignorovat duplicitní oddělovače.

**Q:** Co jsou stdin, stdout a stderr?
**A:** **Tři standardní streamy** každého procesu. **stdin** (id 0) = vstup od uživatele (`Console.ReadLine()`). **stdout** (id 1) = výstup výsledku (`Console.WriteLine()`). **stderr** (id 2) = chybové hlášky (`Console.Error.WriteLine()`). Oddělení stdout a stderr umožňuje shell přesměrování: `program > vystup.txt 2> chyby.log`.

**Q:** Co je rozdíl mezi `File.ReadAllText` a `StreamReader.ReadLine`?
**A:** **`File.ReadAllText`** = načte **celý soubor do paměti** (string). Rychlé pro malé soubory, **Out of Memory** pro velké. **`StreamReader.ReadLine`** = čte **řádek po řádku**, jen jeden řádek je v paměti najednou. Vhodné pro **velké soubory** (10 GB log). Pravidlo: pro malé textové soubory `ReadAllText`, pro velké stream s řádkovým čtením.

**Q:** Co je kódování a proč na něm záleží?
**A:** Kódování = **mapování bajtů na znaky**. Bez něj jsou všechny soubory jen čísla. **ASCII** (7 bitů, 128 znaků, jen angličtina). **UTF-8** = dnešní standard, variabilní 1-4 bajty na znak, podporuje všechny jazyky + emoji. **Windows-1250** (8 bitů, legacy česká). Pokud čteš soubor v jiném kódování bez specifikace → **mojibake** ("Ť ďÁ" místo "Řeč"). Řešení: explicit `new StreamReader(path, Encoding.GetEncoding("windows-1250"))`.

**Q:** Jaké výjimky můžou nastat při práci se soubory a jak je řešit?
**A:** **`FileNotFoundException`** (soubor neexistuje), **`DirectoryNotFoundException`** (složka neexistuje), **`UnauthorizedAccessException`** (chybí práva), **`IOException`** (obecná — disk plný, soubor zamčený), **`PathTooLongException`** (cesta delší než limit). Řešení: **`try-catch`** okolo I/O operací. Specifické catch bloky pro očekávané případy, obecný `catch (IOException)` na konci.

---

## Status

- **Sebehodnocení (před):** 4/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-20
