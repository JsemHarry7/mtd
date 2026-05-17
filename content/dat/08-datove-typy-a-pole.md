---
subject: DAT
number: 8
title: "Datové typy a pole"
tags: ["datové-typy", "datové-struktury", "c-sharp", "oop", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Datové typy** určují, jaká data může proměnná nést a kolik místa zabírá v paměti. Dělíme je na **elementární** (jedna nedělitelná hodnota — `int`, `bool`, `char`) a **strukturované** (skládají se z více prvků). Strukturované dále na **homogenní** (všechny prvky stejného typu — pole, řetězec, enum) a **heterogenní** (různorodé prvky — třída, struktura). V této otázce projdu **pole** v jeho variantách (jednorozměrné, vícerozměrné, jagged), **enum** a **rozdíl mezi hodnotovými a referenčními typy**.

---

## Klíčové pojmy

- **Elementární typ** — nedělitelná hodnota (`int`, `bool`, `char`, `double`)
- **Strukturovaný typ** — skládá se z prvků (pole, struktura, třída)
- **Homogenní typ** — prvky stejného typu (pole, string, enum)
- **Heterogenní typ** — prvky různých typů (struct, class)
- **Pole (array)** — homogenní struktura, statická velikost, indexování od 0
- **Vícerozměrné pole** — pole s víc indexy (matice)
- **Jagged pole (zubaté)** — pole polí, řádky mohou být různě dlouhé
- **Enum (výčtový typ)** — datový typ s **omezenou množinou pojmenovaných stavů**
- **Hodnotový typ** — drží data přímo (`int`, `struct`, `enum`)
- **Referenční typ** — drží adresu na data v haldě (`class`, `string`, pole)
- **Stack (zásobník)** — paměť pro hodnotové typy, rychlá, malá
- **Heap (halda)** — paměť pro referenční typy, větší, řízena garbage collectorem

---

## Hlavní výklad (5–10 min mluvení)

### 1. Taxonomie datových typů

```
Datové typy
├── Elementární (1 nedělitelná hodnota)
│     int, bool, char, double, decimal, float, byte
└── Strukturované (více prvků)
      ├── Homogenní (stejnorodé)
      │     pole (array), string, enum
      └── Heterogenní (různorodé)
            struct, class
```

### 2. Pole (array) — homogenní struktura

**Vlastnosti:**
- Sada prvků **stejného typu**, v paměti **hned za sebou** (souvislý blok)
- **Indexování od 0**: `pole[0]` první, `pole[Length - 1]` poslední
- **Velikost je statická** — po vyrobení **nelze nafouknout** (na rozdíl od `List<T>`)
- `string` je v podstatě homogenní pole znaků

**Efektivita** *(viz SWI 2 algoritmická složitost)*:
- **Čtení / zápis na indexu**: `O(1)` — bleskurychlé, počítač zná adresu prvku přímo
- **Vkládání / mazání uprostřed**: `O(n)` — všechno za pozicí se musí posunout

**Deklarace v C#:**
```csharp
int[] pole = new int[5];                  // pole 5 nul (default int = 0)
int[] pole = { 1, 2, 3, 4, 5 };            // s inicializací
int[] pole = new int[] { 1, 2, 3 };       // explicitní

string[] jmena = { "Anna", "Bob", "Cyril" };
```

**Přístup:**
```csharp
int prvni = pole[0];                       // 1
pole[0] = 99;                              // přepiš první prvek
int delka = pole.Length;                   // pozor: u pole je Length, u List Count
```

**Iterace:**
```csharp
foreach (int x in pole) Console.WriteLine(x);

for (int i = 0; i < pole.Length; i++) {
    Console.WriteLine($"{i}: {pole[i]}");
}
```

⚠️ **Past:** Index **mimo rozsah** → `IndexOutOfRangeException`. `pole[10]` na 5-prvkovém poli spadne.

### 3. Vícerozměrná pole

#### Pravoúhlé (rectangular) — `[,]`

Klasická **matice** — všechny řádky stejně dlouhé. V paměti **jeden velký souvislý blok**.

```csharp
int[,] matice = new int[3, 4];             // 3 řádky × 4 sloupce
matice[0, 0] = 1;
matice[2, 3] = 99;

// S inicializací
int[,] m = {
    { 1, 2, 3 },
    { 4, 5, 6 }
};

// Velikost
int radky = m.GetLength(0);                // 2
int sloupce = m.GetLength(1);              // 3
```

#### Jagged (zubaté) — `[][]`

**Pole polí** — každý řádek může být **jinak dlouhý**. V paměti **rozprostřené** (každý vnitřní pole je samostatný objekt na haldě).

```csharp
int[][] zubate = new int[3][];             // 3 řádky, každý zatím null
zubate[0] = new int[] { 1, 2 };
zubate[1] = new int[] { 1, 2, 3, 4, 5 };
zubate[2] = new int[] { 7 };

// Přístup
int x = zubate[1][3];                      // 4

// Délka řádku
int delkaRadku0 = zubate[0].Length;        // 2
```

**Pravoúhlé × jagged — kdy co:**

| | Pravoúhlé `[,]` | Jagged `[][]` |
|---|---|---|
| Tvar | Pevný obdélník | Různé délky řádků |
| Paměť | Jeden souvislý blok | Roztříštěná, **víc objektů na haldě** |
| Garbage collector | Méně práce | **Větší zátěž pro GC** |
| Kdy použít | Matice, šachovnice, gridy s pevným tvarem | Trojúhelníkové matice, řádky proměnné délky |

### 4. Enum (výčtový typ)

**Datový typ s omezenou množinou pojmenovaných stavů.** Pro počítač je to **číslo**, pro programátora **text** — zvyšuje **čitelnost** a **bezpečnost** kódu.

```csharp
enum Dny { Pondeli, Utery, Streda, Ctvrtek, Patek, Sobota, Nedele }
// Bez explicitního =, čísla se přiřadí: Pondeli=0, Utery=1, ..., Nedele=6

enum Stav { Aktivni = 1, Neaktivni = 5, Smazany = 99 }
// Explicitní hodnoty

Dny dnes = Dny.Pondeli;
Console.WriteLine(dnes);             // "Pondeli"
int hodnota = (int)dnes;             // 0 (cast na underlying číslo)

// Použití v switchi (přehledné!)
switch (dnes) {
    case Dny.Pondeli: ... break;
    case Dny.Utery:   ... break;
}
```

**Proč enum místo `int`?**
- Kompilátor zachytí překlep — `Dny.Pondelu` je chyba, ale `int dnes = 7;` projde
- Kód je **čitelnější** — `if (stav == Stav.Aktivni)` vs. `if (stav == 1)`
- IDE napovídá hodnoty

### 5. Heterogenní struktury — `struct` × `class`

| | `struct` (struktura) | `class` (třída) |
|---|---|---|
| Typ | **Hodnotový** (value) | **Referenční** (reference) |
| Paměť | Stack (pokud není v třídě) | Heap, proměnná drží **adresu** |
| Při `a = b` | Data se **fyzicky zkopírují** — dvě nezávislé kopie | Kopíruje se **adresa** — obě ukazují na stejný objekt |
| Dědičnost | **Nepodporuje** | Podporuje |
| Zapouzdření | Ano (private/public/protected) | Ano |
| Použití | Malé objekty (Bod, KomplexniCislo, DTO) | Většina věcí v OOP |

```csharp
struct Bod {
    public int X;
    public int Y;
}

class Osoba {
    public string Jmeno;
    public int Vek;
}

Bod b1 = new Bod { X = 1, Y = 2 };
Bod b2 = b1;            // KOPIE — b2 je nezávislá
b2.X = 99;
Console.WriteLine(b1.X);   // 1 — nezměněno

Osoba o1 = new Osoba { Jmeno = "Harry", Vek = 18 };
Osoba o2 = o1;            // adresa zkopírována, ukazují na ten samý objekt
o2.Vek = 99;
Console.WriteLine(o1.Vek);   // 99 — změnilo se i na o1!
```

### 6. Hodnotové × referenční typy — souhrn

| Vlastnost | Hodnotové (Value) | Referenční (Reference) |
|---|---|---|
| Zástupci | `int`, `bool`, `double`, `enum`, `struct` | `class`, `string`, **pole**, `interface` |
| Kde žijí | **Stack** (zásobník) — rychlý, malý | **Heap** (halda) — větší, řízený GC |
| Přiřazení | Vytvoří se kopie hodnoty | Kopíruje se reference (adresa) |
| Co je v proměnné | Přímo data (`5`) | Adresa v paměti (`0xFA31`) |

> ⚠️ **Pole je referenční typ**, ačkoli prvky uvnitř mohou být hodnotové (`int[]`). Když dáš pole do funkce, funkce mění **stejné pole** — změny prosakují ven.

---

## Konkrétní příklady / kód

### Filtrování pole pomocí cyklu (bez LINQ)
```csharp
int[] cisla = { 1, 2, 3, 4, 5, 6, 7, 8 };
List<int> sude = new List<int>();
foreach (int c in cisla) {
    if (c % 2 == 0) sude.Add(c);
}
// sude = { 2, 4, 6, 8 }
```

### Násobilka 1–10 v pravoúhlé matici
```csharp
int[,] nasobilka = new int[10, 10];
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        nasobilka[i, j] = (i + 1) * (j + 1);
    }
}
```

### Trojúhelníková matice v jagged poli
```csharp
int[][] trojuhelnik = new int[5][];
for (int i = 0; i < 5; i++) {
    trojuhelnik[i] = new int[i + 1];      // i-tý řádek má i+1 prvků
    for (int j = 0; j <= i; j++) {
        trojuhelnik[i][j] = j + 1;
    }
}
// Řádky: [1], [1,2], [1,2,3], [1,2,3,4], [1,2,3,4,5]
```

### Enum v praxi
```csharp
enum Velikost { Mala, Stredni, Velka }

Velikost moje = Velikost.Stredni;
if (moje == Velikost.Velka) Console.WriteLine("Velká!");
```

---

## Vztahy / kontrasty

- **Pole × `List<T>`** — pole má **statickou velikost**, List je dynamický (umí `Add`/`Remove`). Pole je rychlejší a paměťově úspornější (žádný overhead na vyrovnávání), List flexibilnější. Pro maturitu: pole znát první.
- **Pole × řetězec** — `string` je v podstatě homogenní pole znaků (`char[]`), ale **imutabilní** *(viz SWI 4)*.
- **Pravoúhlé × jagged pole** — pravoúhlé je **rychlejší** (souvislá paměť), jagged je **flexibilnější** (různé délky), ale větší **GC zátěž**.
- **`struct` × `class`** — struct je *"data jako kopie"* (value), class je *"data sdílená přes adresu"* (reference). Struct nepodporuje dědičnost.
- **Enum × konstanta** — konstanta je jedna pojmenovaná hodnota, enum je **množina** pojmenovaných stavů, často vzájemně se vylučujících.

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi elementárním a strukturovaným datovým typem?
**A:** Elementární typ drží jednu nedělitelnou hodnotu — např. `int`, `bool`, `char`. Strukturovaný se skládá z více prvků — např. pole (homogenní), třída (heterogenní).

**Q:** Co je homogenní a heterogenní strukturovaný typ?
**A:** Homogenní obsahuje prvky stejného typu — např. pole, string, enum. Heterogenní obsahuje různorodé prvky — např. třída nebo struktura, kde každá vlastnost může být jiného typu.

**Q:** Jaký je rozdíl mezi pravoúhlým a jagged polem?
**A:** Pravoúhlé `[,]` je obdélník s pevně danými rozměry, v paměti **jeden souvislý blok**. Jagged `[][]` je **pole polí** — každý řádek může být jinak dlouhý, jednotlivé řádky jsou v paměti rozprostřené, větší zátěž pro garbage collector.

**Q:** Co je enum a k čemu slouží?
**A:** Enum (výčtový typ) je datový typ s omezenou pojmenovanou množinou stavů. Pro počítač je to číslo, pro programátora text. Zvyšuje čitelnost a bezpečnost — kompilátor chytne překlep.

**Q:** Pole je hodnotový nebo referenční typ?
**A:** **Referenční**. Když pole předáš funkci, funkce dostane referenci na stejný objekt, takže změny uvnitř (např. `pole[0] = 99`) jsou venku vidět.

**Q:** Jaká je složitost čtení z pole na indexu? A jaká vkládání uprostřed?
**A:** Čtení / zápis na konkrétním indexu je `O(1)` — bleskurychlé. Vkládání nebo mazání uprostřed je `O(n)`, protože všechny prvky za pozicí se musí posunout.

**Q:** Co se stane, když napíšeš `pole[10]` na poli, které má 5 prvků?
**A:** Vyhodí se výjimka `IndexOutOfRangeException` za běhu, program spadne. Kompilátor to nemůže chytit, protože index může být počítaný za běhu.

**Q:** Co se stane při `Bod b2 = b1;`, kde `Bod` je struktura, vs. `Osoba o2 = o1;`, kde `Osoba` je třída?
**A:** U struktury se vytvoří **nezávislá kopie** — `b2.X = 99;` nezmění `b1`. U třídy se kopíruje **reference** — obě proměnné ukazují na stejný objekt, `o2.Vek = 99;` se promítne i do `o1`.

---

## Co bych ještě měl vědět (volně)

- **Pole je v C# referenční typ**, ale obsah může být cokoliv — hodnotový (`int[]`) i referenční (`Osoba[]`).
- **`var` u pole**: `var pole = new int[5];` — `var` se rozšíří na `int[]`. **Není to "neznámý typ"**, je to inferovaný `int[]`.
- **Default hodnoty** v poli: `int[]` startuje **nulami**, `bool[]` startuje **`false`**, `string[]` startuje **`null`**.
- **`Array.Sort(pole)`** — třídí pole na místě. **`Array.Reverse(pole)`** otáčí.
- **`stackalloc`** (zřídka) — alokuje pole na stack místo na heap, pro performance-critical kód.

---

## ⚠️ Nejisté / k ověření

- ⚠️ V tvých hodina-poznámkách není **deklarační C# syntax pro pole** — doplněno z obecných znalostí. Pokud učitel chce **konkrétní C# zápis**, drž `int[] pole = new int[5];` jako základní formu.
- ⚠️ **`stackalloc`** a **`Span<T>`** v zápisku zmiňuju jako bonus — komise se na to standardně neptá, ale kdyby se mě někdo ptal *"existuje v C# i pole na stacku?"*, odpovím *"ano, přes `stackalloc`, ale je to advanced věc"*.
- ⚠️ Tvé hodina-poznámky uvádějí **string jako příklad homogenní struktury** — to je **správně** (sekvence `char` znaků). Detail: v C# je string **referenční typ** (žije na heapu), ale **chová se jako hodnotový** kvůli imutabilitě a operátorům porovnání — komise to může pichnout, řekni *"referenční typ s hodnotovou sémantikou"*.

---

## Praktická příprava (pro 30 min u PC)

Trénuj tyto vzory tak, abys je z prázdného souboru napsal za **<10 minut**:

1. **Deklaruj pole 5 čísel, vyplň cyklem, vypiš foreachem**
2. **Najdi maximum v poli** přes for cyklus
3. **Pravoúhlá matice 3×3, naplň přes vnořené for, vypiš s mezerami**
4. **Jagged pole — trojúhelníková matice (řádek `i` má `i+1` prvků)**
5. **Enum + switch — vyber hodnotu a podle ní vypiš popis**

---

## Status

- **Sebehodnocení (před):** 2/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-08
