---
subject: DAT
number: 11
title: "Kolekce: pole, zásobník, fronta, slovník"
tags: ["datové-struktury", "c-sharp", "oop", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Kolekce** jsou **kontejnery pro ukládání a správu skupiny dat**. Tradičně **homogenní** (uchovávají prvky stejného typu), v moderním C# přes **generika** `<T>`. Dělíme je na **statické** (pole — pevná velikost) a **dynamické** (List, Stack, Queue, Dictionary — mění velikost za běhu). V této otázce projdu **pole** (přímý přístup `O(1)`, statická délka), **List** (dynamická náhrada pole), **Stack** (LIFO — Push/Pop), **Queue** (FIFO — Enqueue/Dequeue), **Dictionary** (klíč-hodnota s `O(1)` přes hashování) a **HashSet** (unikátní množina).

---

## Klíčové pojmy

- **Kolekce (collection)** — kontejner pro skupinu dat
- **Pole (Array)** — statická homogenní struktura, souvislý blok paměti
- **List<T>** — dynamická obálka pole, automaticky roste/zmenšuje se
- **Stack<T>** — LIFO (Last In, First Out), Push/Pop
- **Queue<T>** — FIFO (First In, First Out), Enqueue/Dequeue
- **Dictionary<K, V>** — slovník klíč-hodnota, `O(1)` přístup
- **HashSet<T>** — slovník bez hodnot, unikátní množina
- **Hashování** — výpočet indexu z klíče (rychlé vyhledání)
- **LIFO / FIFO** — pravidla přidávání/odebírání
- **Generika `<T>`** — typový parametr, umožňuje univerzálnost *(viz SWI 9)*
- **Box/unbox** — staré `ArrayList` ukládá `object`, vyžaduje konverze (pomalé, nezí typově bezpečné)

---

## Hlavní výklad (5–10 min mluvení)

### 1. Taxonomie kolekcí

```
Kolekce
├── Statické (pevná velikost)
│     Pole (Array) — int[]
└── Dynamické (rostou/zmenšují se)
      ├── List<T>           — sekvenční přístup, ekvivalent dynamického pole
      ├── Stack<T>           — LIFO
      ├── Queue<T>           — FIFO
      ├── Dictionary<K, V>   — klíč/hodnota
      ├── HashSet<T>         — unikátní množina
      └── LinkedList<T>      — spojový seznam (DAT 9)
```

### 2. Pole (Array) — základ

**Statické**, **homogenní**, **souvislý blok paměti**. *(Detail v DAT 8.)*

```csharp
int[] cisla = new int[5];           // 5 nul
int[] cisla = { 1, 2, 3, 4, 5 };     // s inicializací
int prvni = cisla[0];                // index 0
cisla[0] = 99;                        // přepsání
int delka = cisla.Length;             // pozor: u pole je Length, u List Count
```

**Vlastnosti:**
- **Přístup `O(1)`** — index → přímá adresa v paměti
- **Délka pevná** — po vyrobení **nelze přidávat**. Pokud se pole "naplní", musíš vytvořit větší pole a překopírovat.

**Kdy:** když znáš velikost dopředu a nepotřebuješ přidávat/odebírat.

### 3. List<T> — dynamické pole

**Uvnitř List obaluje pole** — když se naplní, **automaticky vytvoří větší** a data překopíruje.

```csharp
List<int> cisla = new List<int>();        // prázdný
cisla.Add(10);                             // přidat na konec
cisla.Add(20);
cisla.Insert(0, 5);                        // přidat na index 0
cisla.RemoveAt(2);                         // odebrat z indexu

int delka = cisla.Count;                   // POZOR: Count, ne Length
int prvni = cisla[0];                      // přístup indexem
bool obsahuje = cisla.Contains(20);

foreach (int c in cisla) Console.WriteLine(c);
```

**Vlastnosti:**
- **Přístup indexem `O(1)`**
- **Add na konec amortizovaně `O(1)`** (občas se kopíruje, ale průměrně rychlé)
- **Insert/Remove uprostřed `O(n)`** — zbytek se musí posunout
- **`Count` (ne Length)** — drobnost, kterou si musíš pamatovat

**Kdy:** většina případů, kde potřebuješ dynamickou kolekci s indexovým přístupem.

⚠️ **Pozor — `ArrayList`** (starší C# typ): ukládá `object`, vyžaduje **boxing/unboxing**. Pomalý a typově nebezpečný. **NEPOUŽÍVAT**, vždy `List<T>`.

### 4. Stack<T> — zásobník (LIFO)

**LIFO = Last In, First Out** — *poslední dovnitř, první ven*.

**Analogie:** **trička ve skříni / talíře v dřezu** — přidáváš nahoru, odebíráš seshora.

```csharp
Stack<string> historie = new Stack<string>();

historie.Push("první akce");      // vrchol = "první akce"
historie.Push("druhá akce");      // vrchol = "druhá akce"
historie.Push("třetí akce");      // vrchol = "třetí akce"

string posledni = historie.Pop();  // → "třetí akce", vrchol teď = "druhá akce"
string vrchol = historie.Peek();   // → "druhá akce", BEZ odebrání
int kolik = historie.Count;
```

**Operace:**
- **`Push(item)`** — přidat na vrchol
- **`Pop()`** — odebrat z vrcholu (a vrátit)
- **`Peek()`** — **podívat se** na vrchol bez odebrání
- **`Count`** — počet prvků

**Klasické použití:**
- **Undo/redo** (`Ctrl+Z`) — historie akcí
- **Historie prohlížeče** (back button)
- **Rekurze** — interně se používá zásobník volání (call stack)
- **Vyhodnocení postfixové notace** kalkulačky

### 5. Queue<T> — fronta (FIFO)

**FIFO = First In, First Out** — *první dovnitř, první ven*.

**Analogie:** **fronta u pokladny** — kdo přijde první, je první obsloužen.

```csharp
Queue<string> tisk = new Queue<string>();

tisk.Enqueue("dokument1.pdf");    // do fronty
tisk.Enqueue("dokument2.pdf");
tisk.Enqueue("foto.jpg");

string dalsi = tisk.Dequeue();     // → "dokument1.pdf" (první přišel)
string nasledujici = tisk.Peek();  // → "dokument2.pdf", BEZ odebrání
```

**Operace:**
- **`Enqueue(item)`** — zařadit na konec
- **`Dequeue()`** — odebrat ze začátku (a vrátit)
- **`Peek()`** — podívat se na začátek bez odebrání
- **`Count`** — počet prvků

**Klasické použití:**
- **Tisková fronta** — printer postupně vyřizuje
- **Hudební fronta** (player queue)
- **Komunikace mezi vlákny** — jedno zadává, druhé zpracovává
- **BFS algoritmy** (Breadth-First Search)

### 6. Dictionary<K, V> — slovník

**Páry klíč-hodnota.** Hledá se **podle klíče**, ne podle indexu.

**Mechanika:** **hashování** — klíč se přepočítá na **index v hashovací tabulce**, počítač jde "najisto".

```csharp
Dictionary<string, int> telefony = new Dictionary<string, int>();

// Přidání
telefony.Add("Karel", 123456);
telefony["Jana"] = 987654;            // alternativní syntax (přidá nebo přepíše)

// Přístup
int karelovo = telefony["Karel"];

// Bezpečné čtení
if (telefony.ContainsKey("Pepa")) {
    int p = telefony["Pepa"];
} else {
    Console.WriteLine("Pepa neexistuje");
}

// TryGetValue — moderní bezpečný pattern
if (telefony.TryGetValue("Pepa", out int pepovo)) {
    Console.WriteLine(pepovo);
}

// Iterace přes pár klíč-hodnota
foreach (var pair in telefony) {
    Console.WriteLine($"{pair.Key}: {pair.Value}");
}

// Smazání
telefony.Remove("Karel");

int kolik = telefony.Count;
```

**Vlastnosti:**
- **Přístup `O(1)`** díky hashování (mnohem rychlejší než hledání v poli `O(n)`)
- **Klíče jsou unikátní** — nelze mít dva stejné. Druhý `Add` se stejným klíčem **vyhodí výjimku** (`ArgumentException`). `[]` přepíše.
- **Klíč může být libovolný typ** s implementací `GetHashCode()` (string, int, vlastní třída).

**Klasické použití:**
- **Konfigurace** (klíč "Heslo" → hodnota "1234")
- **JSON data** (parsované do dictionary)
- **Cache** (klíč URL → hodnota response)
- **Counting** (klíč slovo → hodnota počet výskytů)

### 7. HashSet<T> — unikátní množina

**Slovník BEZ hodnot** — drží jen **klíče**. Slouží k rychlé kontrole *"je tam ten prvek?"*.

```csharp
HashSet<string> navstivenaMesta = new HashSet<string>();

navstivenaMesta.Add("Praha");
navstivenaMesta.Add("Brno");
navstivenaMesta.Add("Praha");        // ignoruje se — duplikát

bool bylJsemVPraze = navstivenaMesta.Contains("Praha");   // true, O(1)
int kolikMest = navstivenaMesta.Count;                       // 2
```

**Vlastnosti:**
- **`O(1)` Contains** (vs. `O(n)` u List.Contains)
- **Žádné duplikáty** — druhý `Add` stejné hodnoty se ignoruje
- **Bez pořadí** — neslibuje, v jakém pořadí budeš iterovat

**Klasické použití:**
- **Detekce duplikátů** v datech
- **Tracking navštívených uzlů** v grafových algoritmech
- **Tagy / kategorie** s rychlým lookup

### 8. Tabulka složitostí — pamatovat!

| Operace | Pole | List<T> | Stack<T> | Queue<T> | Dictionary<K,V> | HashSet<T> |
|---|---|---|---|---|---|---|
| Přístup indexem | `O(1)` | `O(1)` | — | — | — | — |
| Add na konec | — | `O(1)` amortized | `O(1)` Push | `O(1)` Enqueue | `O(1)` | `O(1)` |
| Add na začátek | — | `O(n)` | — | — | — | — |
| Lookup hodnoty | `O(n)` | `O(n)` | — | — | `O(1)` | `O(1)` |
| Insert uprostřed | — | `O(n)` | — | — | — | — |
| Smazání | — | `O(n)` | `O(1)` Pop | `O(1)` Dequeue | `O(1)` | `O(1)` |

**Z toho plyne:** *Když máš mnoho dat a hledáš podle klíče, použij Dictionary nebo HashSet, ne List.*

---

## Konkrétní příklady / kód

### Praktický pattern — počítání slov v textu (Dictionary)
```csharp
string text = "ahoj svete ahoj svete ahoj";
string[] slova = text.Split(' ');
Dictionary<string, int> pocty = new Dictionary<string, int>();

foreach (string slovo in slova) {
    if (pocty.ContainsKey(slovo)) {
        pocty[slovo]++;
    } else {
        pocty[slovo] = 1;
    }
}

// Výsledek: { "ahoj": 3, "svete": 2 }
```

### Vlastní implementace zásobníku (z hodina-poznámek)
```csharp
class MujZasobnik {
    private List<string> data = new List<string>();

    public void Push(string polozka) {
        data.Add(polozka);
    }

    public string Pop() {
        if (data.Count == 0) return null;
        int posledniIndex = data.Count - 1;
        string hodnota = data[posledniIndex];
        data.RemoveAt(posledniIndex);
        return hodnota;
    }
}
```

### Vlastní implementace fronty (z hodina-poznámek)
```csharp
class MojeFronta {
    private List<string> data = new List<string>();

    public void Enqueue(string polozka) {
        data.Add(polozka);
    }

    public string Dequeue() {
        if (data.Count == 0) return null;
        string hodnota = data[0];
        data.RemoveAt(0);             // pozor: O(n) — všechno se posune
        return hodnota;
    }
}
```

⚠️ **Vlastní fronta přes List má `O(n)` Dequeue** — `RemoveAt(0)` posouvá celý zbytek pole. Pro lepší implementaci se používá **kruhový buffer** nebo **dvojně spojový seznam** *(viz DAT 9)*. Ale pro maturitu vlastní implementace přes List **stačí** — komise chce vidět pochopení principu, ne optimalizaci.

### Reálné použití `Stack<T>` / `Queue<T>` / `Dictionary<K, V>`
```csharp
// Stack pro undo
Stack<string> undoHistory = new Stack<string>();
undoHistory.Push("psanitext");
string poslední = undoHistory.Pop();

// Queue pro tiskovou frontu
Queue<string> printer = new Queue<string>();
printer.Enqueue("dokument.pdf");
string dalsi = printer.Dequeue();

// Dictionary pro telefonní seznam
Dictionary<string, string> telefony = new Dictionary<string, string>();
telefony["Karel"] = "+420 123";
telefony["Jana"] = "+420 456";
```

---

## Vztahy / kontrasty

- **Pole × List<T>** — pole má **pevnou velikost** a `Length`, List **dynamickou** a `Count`. List je v 90 % případů lepší volbou.
- **List × Spojový seznam (LinkedList<T>)** — List interně pole, indexový přístup `O(1)`, Insert uprostřed `O(n)`. LinkedList nemá indexový přístup, ale Insert/Remove uprostřed je `O(1)` *(detail v DAT 9)*.
- **Stack × Queue** — **LIFO × FIFO**. Stack reverse pořadí (poslední přišel, první odešel), Queue zachovává pořadí.
- **List × Dictionary** — List indexem (číselně), Dictionary klíčem (string nebo cokoliv hashovatelné). Dictionary lookup `O(1)`, List `O(n)`.
- **Dictionary × HashSet** — Dictionary má **klíč i hodnotu**, HashSet **jen klíč**. HashSet pro testy unikátnosti, Dictionary pro mapování.
- **`Add` × `[]` u Dictionary** — `Add` vyhodí výjimku, pokud klíč existuje. `[]` **přepíše** stávající hodnotu (nebo přidá novou).

---

## Časté otázky komise

**Q:** Vyjmenuj 4 hlavní typy kolekcí v C# a jejich princip.
**A:** **Pole** — statická, indexový přístup. **Stack** — LIFO (Push/Pop). **Queue** — FIFO (Enqueue/Dequeue). **Dictionary** — klíč/hodnota s O(1) přes hashování.

**Q:** Jaký je rozdíl mezi LIFO a FIFO?
**A:** **LIFO (Last In, First Out)** — poslední přidaný prvek je první odebraný. Reálná analogie: zásobník talířů, undo historie. **FIFO (First In, First Out)** — první přidaný je první odebraný. Reálná analogie: fronta u pokladny, tisková fronta.

**Q:** Jaká je časová složitost přístupu k poli, k Listu a k Dictionary?
**A:** **Pole** — `O(1)` (přístup indexem přes přímou adresu). **List** — `O(1)` (uvnitř pole). **Dictionary** — `O(1)` (přes hashování klíče). Hledání **konkrétní hodnoty** v poli/Listu je ale `O(n)`, v Dictionary podle klíče **`O(1)`**.

**Q:** Co je hashování a proč ho Dictionary používá?
**A:** Hashování je **výpočet indexu z hodnoty klíče**. Místo lineárního prohledávání (klíč po klíči) Dictionary klíč přepočítá na číslo a jde rovnou na to místo v paměti. Výsledek: O(1) přístup nezávisle na velikosti kolekce.

**Q:** Co se stane, když do Dictionary přidáš dva prvky se stejným klíčem?
**A:** Závisí na metodě:
- **`Add(klíč, hodnota)`** — vyhodí `ArgumentException`
- **`dict[klíč] = hodnota`** — **přepíše** stávající hodnotu

**Q:** Kdy bys použil Dictionary místo List?
**A:** Když mám **mnoho dat** a potřebuju **rychle vyhledávat podle klíče**. List musí prohledat lineárně (`O(n)`), Dictionary najde okamžitě (`O(1)`). Příklad: telefonní seznam podle jména, cache podle URL, konfigurace podle key.

**Q:** Co je `HashSet` a v čem se liší od Dictionary?
**A:** HashSet je kolekce **unikátních prvků** bez hodnot — jen klíče. Slouží k testu *"je tam tenhle prvek?"* v O(1). Liší se od Dictionary tím, že **nemá hodnoty** — drží jen seznam unikátních prvků.

**Q:** Co se stane, když u zásobníku zavoláš Pop na prázdný zásobník?
**A:** Vyhodí `InvalidOperationException`. Bezpečně se to ošetřuje **kontrolou `Count > 0`** nebo přes `TryPop` (moderní C#).

**Q:** Jaký je rozdíl mezi `Pop` a `Peek`?
**A:** **`Pop`** odebere a vrátí prvek z vrcholu. **`Peek`** **jen se podívá** na vrchol, prvek tam zůstává. Stejně to platí pro Queue (`Dequeue` × `Peek`).

**Q:** Proč nepoužívat `ArrayList` v moderním C#?
**A:** `ArrayList` ukládá `object` — vyžaduje **boxing/unboxing** (převod hodnotových typů na referenční), což je pomalé a typově nebezpečné. **`List<T>`** je generický, typově bezpečný a rychlejší.

---

## Co bych ještě měl vědět (volně)

- **`SortedList<K, V>` / `SortedDictionary<K, V>`** — udržují klíče seřazené, zato pomalejší (lookup `O(log n)`).
- **`ConcurrentDictionary` / `ConcurrentQueue`** — thread-safe verze pro multi-threaded scénáře.
- **`IEnumerable<T>`** — abstraktní rozhraní, "něco, přes co se dá foreachovat". Pole, List, Stack, Queue, Dictionary všechno implementuje IEnumerable.
- **`yield return`** — tvorba lazy IEnumerable bez explicitního Listu.
- **LINQ na kolekcích** — `cisla.Where(x => x > 5).ToList()`, `dict.OrderBy(p => p.Key)`. *(Detail v DAT 10.)*
- **Initial capacity** — když znáš dopředu, kolik prvků přidáš, předkažuj `new List<int>(1000)` — ušetří realokace.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Materiály v `_materials/dat/11/`** jsou v `nezarucene/` (žádný validation systém pro PRG, viz `feedback_validation_meaning`). Obsah ale **vypadá kvalitně** — pokrývá xlsx Popis přesně. Vyšel jsem z `prchal/` jako primárního zdroje.
- ⚠️ **Vlastní implementace fronty přes List** má `O(n)` Dequeue. Pro lepší výkon používá .NET interně **kruhový buffer**. Pro maturitu vlastní implementace přes List **stačí**, ale komise se může pichnout *"je tahle implementace efektivní?"* — odpověz *"Dequeue je O(n), pro lepší by byl LinkedList nebo kruhový buffer"*.
- ⚠️ **`HashSet`** explicitně v xlsx Popis chybí, ale je v hodina-poznámkách. Pravděpodobně se komise spíš ptá na 4 hlavní (pole/stack/queue/dict). HashSet jako bonus.

---

## Praktická příprava (pro 30 min u PC)

**Hlavní úloha** v `_practice/dat11-kolekce/Program.cs` (kopie z assignment):

> Bistro objednávky: Menu = Dictionary, Objednávky = Queue, Účtenky = Stack. Postupně zpracuj objednávky, kontroluj proti menu, přidávej ceny do zásobníku. Na konci vypiš celkovou tržbu a poslední položku.

Plus **drillovat tyto vzory** z hlavy:

1. **Vytvoření Dictionary s inicializací** + iterace přes `foreach (var pair in dict)`
2. **Stack** — Push, Pop, Peek, Count
3. **Queue** — Enqueue, Dequeue, Peek, Count
4. **Vlastní implementace zásobníku přes List** (jak v notes)
5. **Vlastní implementace fronty přes List** (jak v notes)
6. **Counting pattern** — `if (dict.ContainsKey(x)) dict[x]++; else dict[x] = 1;`

---

## Status

- **Sebehodnocení (před):** 3/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-10
