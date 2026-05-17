---
subject: SWI
number: 4
title: "Datové typy a proměnné"
tags: ["datové-typy", "c-sharp", "oop", "programování"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Datový typ** určuje, jakou množinu hodnot může proměnná nést a kolik místa zabírá v paměti. **Proměnná** je pojmenovaná část paměti, do které se hodnota ukládá. Programovací jazyky se podle toho, jak striktně typy vynucují, dělí na **staticky typované** (C#, Java) a **dynamicky typované** (JavaScript, Python). V této otázce se zaměřím na **typovost, deklaraci, přetypování a rozdíl mezi hodnotovými a referenčními typy**.

---

## Klíčové pojmy

- **Datový typ** — pravidlo, jaké hodnoty může proměnná držet (`int`, `string`, `bool`, …)
- **Proměnná** — pojmenované místo v paměti pro hodnotu
- **Deklarace** — vyhlášení proměnné (`int x;`)
- **Inicializace** — první přiřazení hodnoty (`x = 5;`)
- **Statická typovost** — typ se určí **při překladu** a nejde změnit (C#)
- **Dynamická typovost** — typ proměnné určují **data v ní** za běhu (JS, Python)
- **Hodnotový typ (value type)** — proměnná drží **přímo data** (`int`, `bool`, `struct`, `enum`)
- **Referenční typ (reference type)** — proměnná drží **adresu na data** v paměti (`class`, `string`, pole)
- **Imutabilita** — hodnotu nelze měnit *na místě* (vždy se vytvoří nová)
- **Konstanta** — proměnná, jejíž hodnotu po inicializaci **nelze přepsat** (`const`)
- **Přetypování** — převod hodnoty z jednoho typu na druhý (implicitní, explicitní, konverze)
- **Obor platnosti (scope)** — odkud je proměnná viditelná *(detail viz DAT 10)*

---

## Hlavní výklad (5–10 min mluvení)

### 1. Statická × dynamická typovost

| | Statická (C#, Java, TS) | Dynamická (JS, Python) |
|---|---|---|
| Kdy se typ určí | **Při překladu** | **Za běhu**, podle dat |
| Lze typ změnit? | Ne — `int x` zůstane `int` | Ano — `x = 3; x = "ahoj";` |
| Chyby | Vidí se **ihned při překladu** | Až za běhu |
| Rychlost | Rychlejší (kompilátor zoptimalizuje) | Pomalejší |

**TypeScript** je pokus přidat statickou typovost do JavaScriptu — kompilátor (typicky **Babel**) převede TS na JS, který už typy nezná.

### 2. Kompilovaný × interpretovaný jazyk

- **Kompilovaný (C, C++, C# částečně)** — zdrojový kód se přeloží do **strojového kódu** (nebo mezikódu) předem
- **Interpretovaný (Python, JavaScript)** — kód se čte a vykonává **řádek po řádku** za běhu
- **C# je hybrid** — překládá se do **mezikódu (IL — Intermediate Language)**, ten pak za běhu spustí **CLR** (Common Language Runtime). *Detail v SWI 24.*

### 3. Deklarace, inicializace, konstanta

```csharp
int x;          // deklarace — vyhrazeno místo, hodnota nedefinovaná
x = 5;          // inicializace
int y = 10;     // deklarace + inicializace v jednom

const int DPH = 21;   // konstanta — po inicializaci nepřepíšeš
DPH = 22;             // ❌ kompilační chyba
```

**Konstanta vs. imutabilita** — odlišné pojmy:
- **Konstanta** = celá proměnná je "zamčená", **nepřepíšeš referenci ani hodnotu**
- **Imutabilita** = hodnota objektu se **nedá změnit zevnitř**, vždy se vytváří **nový objekt**

V C# je **`string` imutabilní** — když napíšeš `s = s + "a";`, vznikne **nový string**, starý zůstane v paměti, dokud ho garbage collector nesmaže.

### 4. Hodnotové × referenční typy (HLAVNÍ koncept)

| | Hodnotový typ | Referenční typ |
|---|---|---|
| Zástupci | `int`, `double`, `bool`, `char`, `struct`, `enum` | `class`, `string`, **pole**, `interface` |
| Co je v proměnné | **Přímo hodnota** (např. `5`) | **Adresa** v paměti (např. `0xFA31`) |
| Žije v paměti | **Stack** (zásobník — rychlý, malý) | **Heap** (halda — větší, řízený garbage collectorem) |
| Při přiřazení `a = b` | **Vytvoří se kopie hodnoty** | **Kopíruje se reference** — obě proměnné ukazují na stejný objekt |

**Důsledek** — co se stane, když do funkce předám:

```csharp
// Hodnotový typ — funkce dostane KOPII
int x = 5;
ZmenIt(x);              // x venku zůstane 5
void ZmenIt(int p) { p = 999; }

// Referenční typ — funkce dostane ADRESU na stejný objekt
List<int> list = new List<int> { 1, 2 };
PridejProsim(list);     // list venku má TEĎ 1, 2, 99
void PridejProsim(List<int> l) { l.Add(99); }
```

> ⚠️ **Past:** Pokud funkce **vytvoří NOVÝ objekt** a přiřadí ho do parametru (`l = new List<int>()`), **venku se nic nezmění** — měnila jen lokální kopii reference, ne původní proměnnou. Aby přepsala referenci venku, musela by mít `ref List<int> l`.

### 5. Přetypování (cast, conversion)

Tři druhy:

1. **Implicitní** — jazyk si poradí sám, **bez ztráty dat**:
   ```csharp
   int x = 5;
   double y = x;       // int → double, automaticky
   ```
2. **Explicitní (cast)** — programátor řekne *"vím, co dělám, riziko ztráty beru na sebe"*:
   ```csharp
   double a = 3.7;
   int b = (int)a;     // → 3 (desetinná část se zahodí)
   ```
3. **Konverze** — mezi typy, které spolu nesouvisí (string × číslo). Jazyk **nezná**, jak převod udělat — voláš metodu (`int.Parse`, `Convert.ToInt32`, `ToString`).

### 6. Imutabilita — proč to existuje

- **Bezpečnost** — když jsi si jist, že se hodnota nezmění "pod rukou", odpadají bugy se sdíleným stavem
- **Snadnější vlákna** — nemusí se zamykat
- **Funkcionální paradigma** — bez imutability funkcionální programování nedává smysl
- **String v C#** je imutabilní → každá `+` operace vyrábí nový string. Pro hodně manipulace s textem se používá **`StringBuilder`** (mutabilní).

---

## Konkrétní příklady / kód

### Statická typovost C#
```csharp
int x = 5;
x = "ahoj";    // ❌ kompilační chyba: "Cannot implicitly convert string to int"
```

### Hodnota × reference v praxi
```csharp
int a = 10;
int b = a;          // b je samostatná kopie
b = 999;
Console.WriteLine(a);   // 10 — nezměněno

List<int> x = new List<int> { 1, 2 };
List<int> y = x;        // y ukazuje na stejný objekt jako x
y.Add(3);
Console.WriteLine(x.Count);   // 3 — protože je to stejný objekt!
```

### Imutabilní string
```csharp
string s = "Ahoj";
s = s + " Harry";   // VZNIKL nový string "Ahoj Harry", původní stále v paměti
                     // s teď ukazuje na ten nový
```

### Konstanta
```csharp
const double DPH = 0.21;     // hodnota známá při překladu
// DPH = 0.22;               // ❌ chyba
```

---

## Vztahy / kontrasty

- **Datový typ × proměnná** — typ je "škatulka" (pravidlo), proměnná je "obsah škatulky" (instance s pamětí).
- **Konstanta × imutabilita** — konstanta zamyká **referenci** (proměnnou), imutabilita zamyká **obsah** (objekt). String v C# **není konstanta**, ale je **imutabilní**: `s = s + "a";` přepíše referenci, ale ten původní objekt nikdo nezměnil.
- **Statická × silná typovost** — pojmy se pletou. **Statická** = kdy se typ určí (překlad). **Silná** = jak striktně se prosazuje. C# je **statický** *i* **silný**. Python je **dynamický**, ale **silný** (`"5" + 1` spadne). JS je **dynamický** *a* **slabý** (`"5" + 1 = "51"`).
- **Hodnotový × referenční** — value je *"obsah je tady"*, reference je *"obsah je tam, mám lístek"*. Pamatuj si: **list/dům metafora** — value = "tady je dům", reference = "tady je lístek na dům, dům je adresa X".

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi staticky a dynamicky typovaným jazykem?
**A:** U statického (C#, Java) se typ proměnné určí při překladu a nelze ho změnit. U dynamického (JS, Python) typ určují data v proměnné za běhu. Statický jazyk chytí typové chyby dřív, dynamický je pružnější, ale chyby ti vyplivne až za běhu.

**Q:** Co je hodnotový a co referenční typ? Uveď příklady.
**A:** Hodnotový typ drží data přímo v proměnné, žije obvykle na zásobníku — `int`, `bool`, `struct`, `enum`. Referenční typ drží adresu na objekt v haldě — `class`, `string`, pole. Při přiřazení `a = b` u hodnotového se kopíruje hodnota, u referenčního jen adresa, takže obě proměnné ukazují na stejný objekt.

**Q:** Co je imutabilita a uveď příklad v C#.
**A:** Imutabilita znamená, že obsah objektu nelze změnit *zevnitř* — každá změna vyrobí nový objekt. V C# je takový **`string`** — `s = s + "a";` nezmění původní string, vyrobí nový a `s` na něj ukáže. Pro intenzivní práci s textem se používá `StringBuilder`, který je **mutabilní**.

**Q:** Co je přetypování a jaké druhy znáš?
**A:** Převod hodnoty mezi typy. Tři druhy: **implicitní** (jazyk si poradí sám, bez ztráty: `int → double`), **explicitní cast** (`(int)`, beru riziko ztráty), **konverze** (mezi typy, které spolu nesouvisí — `int.Parse(string)`).

**Q:** Co se stane, když do funkce předám List a uvnitř zavolám `Add`?
**A:** List je referenční typ, takže funkce dostane **kopii reference** — ukazuje na stejný objekt. `Add` mění objekt, takže změna **prosakuje ven**. Kdyby ale uvnitř funkce udělala `list = new List<int>()`, vytvořila by si **vlastní** referenci, a venku by se nic nezměnilo — protože změnila jen kopii reference.

**Q:** Co je konstanta a v čem se liší od imutability?
**A:** Konstanta je proměnná, do které **nelze po deklaraci přiřadit jinou hodnotu** — používá klíčové slovo `const`. Imutabilita se týká **obsahu objektu** — string v C# není konstanta (`s = "nove";` přepíše referenci), ale je imutabilní (samotný řetězec se nezmění zevnitř).

---

## Co bych ještě měl vědět (volně)

- **C# má alias pro typy:** `int` = `System.Int32`, `string` = `System.String`, `bool` = `System.Boolean`. Komise může pichnout *"co je `int` doopravdy?"* — odpověz aliasem.
- **`var` v C#** je **statický** typ inferovaný z pravé strany — **NENÍ to dynamický typ jako v JS**. `var x = 5;` znamená `int x = 5;`. Po deklaraci nemůžeš `x = "ahoj";`.
- **`dynamic`** v C# (málo používané) je skutečně dynamický typ — kontrola až za běhu.
- **Hierarchie typů v C#**: vše dědí z `System.Object`. Hodnotové typy přes `System.ValueType`.
- **Boxing / unboxing** — když hodnotový typ "obalíš" do referenčního typu (`object o = 5;`), nazývá se to **boxing**. Opačně **unboxing** (`int x = (int)o;`). Komise to může pichnout.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Tvoje hodina-poznámky uvádějí jako příklady "int8" a "object" v sekci "například"** — `int8` v C# **není standardní typ** (jsou tam `byte`, `sbyte`, `short`, `int`, `long`). Možná to byla obecná zmínka přes různé jazyky. Pro maturitu drž `int`, `double`, `decimal`, `bool`, `char`, `string` jako základní C# typy.
- ⚠️ **"Reference" v hodina-poznámkách** uveden jako *typ* mezi int8/string/boolean — to je matoucí, reference není **typ**, ale **kategorie typů** (referenční typy). Pravděpodobně zkratka v zápisu. Pro maturitu mluv o **hodnotových vs. referenčních typech** jako kategoriích.
- ⚠️ **Babel** v hodina-poznámkách — Babel je **JS/TS transpiler**, ne C# kompilátor. Pro otázky kolem C# kompilace mluv o **CLR / .NET / IL** (viz SWI 24).

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-08
