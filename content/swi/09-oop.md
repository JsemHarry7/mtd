---
subject: SWI
number: 9
title: "Objektové programování"
tags: ["oop", "c-sharp", "dědičnost", "polymorfismus", "abstrakce", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Objektově orientované programování (OOP)** je paradigma, ve kterém se program staví z **objektů** — instancí **tříd**, které **kombinují data (vlastnosti) a chování (metody)** v jedné jednotce. Stojí na **třech pilířích — zapouzdření, dědičnosti a polymorfismu**. Doplňuje je **abstrakce** (skrytí složitosti) přes **abstraktní třídy** a **rozhraní**. C# je čistě OOP jazyk — všechno žije ve třídách. V této otázce projdu **třídy, objekty, jmenné prostory, vlastnosti, modifikátory přístupu, dědičnost, polymorfismus (přetěžování × overriding), abstraktní třídy, interface, statiku a generika.**

---

## Klíčové pojmy

- **Třída (class)** — šablona definující, jaký objekt vypadá a co umí
- **Objekt (instance)** — konkrétní výtvor podle třídy (`new Trida()`)
- **Konstruktor** — speciální metoda volaná při vytváření objektu; **nedědí se**
- **Destruktor** — volá se při zániku; v C# se nepoužívá (řeší **garbage collector**)
- **Vlastnost (property)** — datový člen třídy (`string Jmeno { get; set; }`)
- **Metoda** — funkce příslušející třídě (`void JdiPesky()`)
- **Modifikátor přístupu** — `private` / `protected` / `public` / `internal`
- **Jmenný prostor (namespace)** — logické seskupení tříd, předchází kolizi jmen
- **Dědičnost** — třída získá vlastnosti a metody předka (`Student : Clovek`)
- **Polymorfismus** — schopnost objektů chovat se různě podle typu/situace
- **Přetěžování (overloading)** — víc metod se stejným jménem, jinými parametry
- **Přetížení podle instance (overriding)** — potomek změní chování metody předka
- **Abstraktní třída** — nehotová, nelze z ní vytvořit instanci, slouží jako základ
- **Rozhraní (interface)** — smlouva *"co třída umí"*, bez kódu
- **Statika (`static`)** — patří třídě, ne objektu
- **Generika (`<T>`)** — šablona pro typy

---

## Hlavní výklad (10–15 min mluvení)

### 1. Třída × objekt

- **Třída** je **šablona** (popis). Definuje, **jak bude objekt vypadat** a **co bude umět**.
- **Objekt (instance)** je konkrétní **výtvor** podle té šablony.

**Analogie:** třída = **plán domu**, objekt = **postavený dům** podle plánu. Z jedné třídy můžeš vytvořit libovolný počet objektů.

```csharp
class Auto {
    string Barva;
    void Jed() { Console.WriteLine("Jedu!"); }
}

Auto skodaFabia = new Auto();           // objekt 1
Auto bmwM3 = new Auto();                 // objekt 2
```

### 2. Co třída obsahuje

1. **Vlastnosti (atributy)** — data, která objekt nese: `string Jmeno;`
2. **Metody** — chování objektu: `void JdiPesky();`
3. **Konstruktor** — speciální metoda volaná **při vytváření** objektu (`new Trida()`). **NEDĚDÍ SE.**
4. **Destruktor** — volá se **při zániku**. V **C# se nepoužívá** — uvolnění paměti řeší **garbage collector** automaticky. (V C++ ano.)

**Příklad třídy:**
```csharp
class Auto {
    // pole (vlastnost)
    public string Barva;
    public int RokVyroby;

    // konstruktor
    public Auto(string barva, int rok) {
        Barva = barva;
        RokVyroby = rok;
    }

    // metoda
    public void Vypis() {
        Console.WriteLine($"{Barva} auto z roku {RokVyroby}");
    }
}

Auto a = new Auto("červená", 2010);
a.Vypis();      // → "červená auto z roku 2010"
```

### 3. Jmenné prostory (namespaces)

⚠️ *(Doplněno z obecných znalostí — chybí v hodina-poznámkách, ale xlsx Popis chce.)*

**Jmenný prostor (namespace)** = **logické seskupení souvisejících tříd**, předchází kolizi jmen napříč projektem nebo knihovnami.

```csharp
namespace Mojeapp.Modely {
    class Auto { ... }
    class Student { ... }
}

namespace Mojeapp.Sluzby {
    class Auto { ... }       // jiné Auto než výše — kolize neexistuje
}
```

Použití přes:
- **Plně kvalifikované jméno**: `Mojeapp.Modely.Auto`
- **`using` direktiva** na začátku souboru: `using Mojeapp.Modely;` → pak stačí `Auto`

```csharp
using System;                       // namespace System
using System.Collections.Generic;   // namespace pro List<T>, Dictionary<K,V>

class Program {
    static void Main() {
        Console.WriteLine("...");   // Console je v System
        List<int> cisla = new List<int>();   // List<T> v System.Collections.Generic
    }
}
```

**Standardní C# namespacy:**
- `System` — základní typy (`Console`, `String`, `Int32`)
- `System.Collections.Generic` — kolekce (`List<T>`, `Dictionary<K,V>`)
- `System.IO` — soubory, streamy
- `System.Linq` — LINQ rozšíření

V moderním C# 10+ existuje **`global using`** — namespace importovaný globálně pro celý projekt, není třeba ho opakovat v každém souboru.

### 4. Tři pilíře OOP

#### 4.1 Zapouzdření (encapsulation)

> *Objekt by měl **skrývat vnitřní data** a nabízet jen to, co je **bezpečné** přes vnější rozhraní.*

V C# **velmi striktně omezené** — `private` opravdu znamená nepřístupné zvnějšku. V Pythonu/JS je to konvence (lze obcházet).

**Modifikátory přístupu:**

| Modifikátor | Vidí |
|---|---|
| `public` | **všichni** (tatáž třída, potomci, jiné třídy, jiné assembly) |
| `protected` | **třída a její potomci** |
| `private` | **jen táž třída** |
| `internal` | **stejné assembly** (typicky stejný projekt) |
| `protected internal` | kombinace — potomci nebo stejné assembly |

**Typický pattern v C#:** `private` field + `public` property:

```csharp
class Osoba {
    private int vek;                            // skryté pole

    public int Vek {                             // veřejná property
        get { return vek; }
        set {
            if (value < 0) throw new ArgumentException();
            vek = value;
        }
    }
}
```

**Auto-property** (zjednodušený zápis bez explicitního pole):
```csharp
public int Vek { get; set; }
public string Jmeno { get; private set; }   // čte kdokoliv, mění jen třída sama
```

#### 4.2 Dědičnost (inheritance)

> *Schopnost vytvořit novou třídu **na základě existující**.*

```csharp
class Clovek {
    public string Jmeno;
    public void Pozdrav() => Console.WriteLine($"Ahoj, jsem {Jmeno}");
}

class Student : Clovek {            // Student dědí z Clovek
    public string Skola;
    public void Studuj() => Console.WriteLine("Studuju...");
}

Student s = new Student();
s.Jmeno = "Harry";       // zděděno z Clovek
s.Pozdrav();             // zděděná metoda
s.Skola = "P4A";          // vlastní vlastnost
s.Studuj();              // vlastní metoda
```

**Pravidla dědičnosti v C#:**
- **Jen z JEDNÉ třídy** (single inheritance) — na rozdíl od C++ a Pythonu
- **Z VÍC interfaces** ano (multiple inheritance přes interface)
- **Konstruktor předka se volá NEJDŘÍV**, pak potomka
- `protected` členové předka jsou v potomku přístupní
- `private` členové předka **nejsou** přístupní v potomku
- **Konstruktor se NEDĚDÍ** — potomek si musí svůj definovat (může volat předka přes `: base(...)`)

```csharp
class Student : Clovek {
    public Student(string jmeno, string skola) : base(jmeno) {
        // base(jmeno) zavolá konstruktor Clovek
        Skola = skola;
    }
}
```

#### 4.3 Polymorfismus

> *Schopnost objektů **chovat se různě** podle situace nebo typu.*

##### a) Přetěžování (overloading) — podle parametrů

Více metod se **stejným jménem**, ale **jinými parametry**:

```csharp
void Vypis(int cislo) => Console.WriteLine($"Číslo: {cislo}");
void Vypis(string text) => Console.WriteLine($"Text: {text}");
void Vypis(int a, int b) => Console.WriteLine($"Dvě čísla: {a}, {b}");

Vypis(5);              // "Číslo: 5"
Vypis("ahoj");         // "Text: ahoj"
Vypis(3, 7);           // "Dvě čísla: 3, 7"
```

Kompilátor vybere správnou variantu podle typů argumentů.

##### b) Přetížení podle instance (overriding) — potomek mění předka

Potomek **přepíše** chování metody zděděné od předka. Musí být **explicitně dovoleno** přes `virtual` (předek) + `override` (potomek):

```csharp
class Clovek {
    public virtual void Pozdrav() => Console.WriteLine("Ahoj!");
}

class Student : Clovek {
    public override void Pozdrav() => Console.WriteLine("Čau, jsem student!");
}
```

**Klasická past — polymorfní volání:**
```csharp
Clovek osoba = new Student();    // proměnná typu Clovek, uvnitř Student
osoba.Pozdrav();                  // ?

// Pokud je Pozdrav virtual/override → "Čau, jsem student!" (volá se ze Studenta)
// Pokud Pozdrav NENÍ virtual → "Ahoj!" (volá se z Clovek)
```

To je **podstata polymorfismu** — **stejné volání, různé chování** podle skutečného typu objektu.

##### c) `base.Method()` — volání předka

Potomek může v override metodě **rozšířit** chování předka:
```csharp
public override void Pozdrav() {
    base.Pozdrav();                                  // nejdřív zavolá z Clovek
    Console.WriteLine("...a navíc, jsem student!");
}
```

### 5. Abstrakce — abstraktní třídy a interface

#### Abstraktní třída (`abstract`)

> *Společný **základ** pro skupinu tříd. **"Nehotová"** třída.*

- **Nelze z ní vytvořit instanci** (`new AbstrTrida()` ❌)
- Může obsahovat:
  - **Hotové metody** (s tělem, dědí se jak jsou)
  - **Abstraktní metody** (bez těla, potomek je **MUSÍ** dopsat)
- Definuje **šablonu chování**, ale nucí potomky doplnit specifika

```csharp
abstract class Zvire {
    public string Jmeno;

    public void Spi() => Console.WriteLine($"{Jmeno} spí.");   // hotová

    public abstract void Zvuk();                                 // abstraktní — bez těla
}

class Pes : Zvire {
    public override void Zvuk() => Console.WriteLine("Haf!");   // MUSÍ implementovat
}

class Kocka : Zvire {
    public override void Zvuk() => Console.WriteLine("Mňau!");
}
```

#### Rozhraní (interface)

> *Definuje **smlouvu**: říká **CO** má třída umět, ale **neřeší JAK** to udělá.*

- **Žádný kód, žádná implementace** (jen seznam metod a vlastností) — *historicky; v C# 8+ jsou default implementace, ale to je advanced*
- Vynucení: třída implementující interface **MUSÍ** naprogramovat **všechny** jeho metody
- Třída může implementovat **VÍCE interfaces** najednou — to je C# způsob "multiple inheritance"

```csharp
interface IZvire {
    void Zvuk();
    void Spi();
}

interface IChlupatej {
    string TypSrsti { get; }
}

class Pes : IZvire, IChlupatej {            // implementuje OBĚ
    public void Zvuk() => Console.WriteLine("Haf!");
    public void Spi() => Console.WriteLine("Spím...");
    public string TypSrsti => "krátká";
}
```

**Konvence:** jména interfaces začínají velkým **`I`** (`IComparable`, `IEnumerable`, `IDisposable`).

#### Abstraktní třída × interface — kdy co?

| | Abstraktní třída | Interface |
|---|---|---|
| Tělo metod | **Může mít** (hotové metody) | **Tradičně nemá** |
| Kolik najednou | Jen 1 (single inheritance) | **Více najednou** |
| Vlastnosti (fields) | Ano | Ne (jen properties bez fieldu) |
| Konstruktor | Ano | Ne |
| Use case | "Je to typ X" (sdílený základ) | "Umí tohle" (capability) |

**Pravidlo:** *"abstraktní třída = co to JE, interface = co to UMÍ."*

### 6. Další důležité pojmy

#### `static` — statický člen

> *Patří **třídě**, ne objektu. Nepotřebuješ instanci.*

```csharp
class Math {
    public static int Sectej(int a, int b) => a + b;
}

int x = Math.Sectej(3, 5);    // bez new Math()
```

**Standardní use case:** utility metody (`Math.Sqrt`, `Console.WriteLine`), konstanty (`Math.PI`), Singleton pattern.

```csharp
class Pocitadlo {
    public static int PocetVytvorenych = 0;     // sdíleno mezi všemi instancemi

    public Pocitadlo() {
        PocetVytvorenych++;
    }
}

new Pocitadlo();
new Pocitadlo();
new Pocitadlo();
Console.WriteLine(Pocitadlo.PocetVytvorenych);   // 3
```

#### `sealed` — neděditelná třída

> *Z této třídy **nelze dědit**.*

```csharp
sealed class Final {
    // jiné třídy nemůžou napsat: class X : Final
}
```

Použití: bezpečnost (chceš zaručit, že nikdo logiku nepřepíše), performance (kompilátor může lépe optimalizovat).

#### Generika `<T>` — šablona pro typy

> *Umožňuje napsat metodu nebo třídu **univerzálně**, konkrétní typ se doplní **až při použití**.*

```csharp
class Krabice<T> {                  // generická třída
    public T Obsah;

    public void Vypis() {
        Console.WriteLine(Obsah);
    }
}

Krabice<int> k1 = new Krabice<int> { Obsah = 42 };
Krabice<string> k2 = new Krabice<string> { Obsah = "ahoj" };
```

**Klasické použití generik v C#:**
- `List<T>`, `Dictionary<K, V>`, `Queue<T>`, `Stack<T>` — kolekce *(detail v DAT 11)*
- `Func<T1, T2, TResult>` — typový předpis pro funkci *(viz DAT 10)*
- `Nullable<T>` (= `T?`) — povolení `null` u value typů

**Výhody generik:**
1. **Type safety** — kompilátor zachytí špatný typ
2. **Žádné boxing/unboxing** — performance (na rozdíl od `ArrayList` s `object`)
3. **Reusability** — jedna třída pro libovolný typ

---

## Konkrétní příklady / kód

### Plná OOP demonstrace
```csharp
namespace Skola.Modely {
    public abstract class Clovek {
        public string Jmeno { get; set; }
        public int Vek { get; set; }

        public Clovek(string jmeno, int vek) {
            Jmeno = jmeno;
            Vek = vek;
        }

        public virtual void Pozdrav() {
            Console.WriteLine($"Ahoj, jsem {Jmeno}");
        }

        public abstract string Role();   // abstraktní — potomek MUSÍ implementovat
    }

    public class Student : Clovek {
        public string Skola { get; set; }

        public Student(string jmeno, int vek, string skola) : base(jmeno, vek) {
            Skola = skola;
        }

        public override void Pozdrav() {
            base.Pozdrav();
            Console.WriteLine($"Studuju na {Skola}.");
        }

        public override string Role() => "student";
    }
}

// použití
Student s = new Student("Harry", 18, "P4A");
s.Pozdrav();          // dvouřádkový výstup (base + override)
Console.WriteLine(s.Role());    // "student"
```

### Interface
```csharp
interface IPlavec {
    void Plav();
}

interface IBezec {
    void Bez();
}

class Triathlonista : IPlavec, IBezec {
    public void Plav() => Console.WriteLine("Plavu...");
    public void Bez() => Console.WriteLine("Běžím...");
}
```

### Generika v praxi
```csharp
public class Stack<T> {
    private List<T> data = new List<T>();

    public void Push(T item) => data.Add(item);

    public T Pop() {
        T item = data[data.Count - 1];
        data.RemoveAt(data.Count - 1);
        return item;
    }
}

Stack<int> cisla = new Stack<int>();
cisla.Push(1);
cisla.Push(2);
int x = cisla.Pop();    // 2
```

---

## Vztahy / kontrasty

- **Třída × objekt** — třída je šablona, objekt je instance. Z jedné třídy libovolně mnoho objektů.
- **Konstruktor × destruktor** — konstruktor při vzniku, destruktor při zániku. **V C# se destruktor nepoužívá** (GC).
- **Field × property** — field je obyčejná proměnná v třídě. Property je `get`/`set` přístup, který může mít validaci/logiku. **V C# preferuj property nad public field.**
- **`virtual` × `abstract`** — `virtual` má hotové tělo (lze override), `abstract` nemá tělo (potomek MUSÍ override).
- **Abstraktní třída × interface** — abstraktní třída může mít kód, interface neměl tradičně. Jedna abstraktní třída × více interfaces.
- **Přetěžování × override** — overloading = stejné jméno, jiné parametry (jeden compile-time pick). Override = potomek mění chování (runtime polymorfismus).
- **`static` × instance** — `static` patří třídě, voláš přes jméno třídy. Instance metoda potřebuje objekt.
- **Single inheritance × multiple interface** — C# omezení/feature: dědíš jen z jedné třídy, ale implementuješ víc interfaces.

---

## Časté otázky komise

**Q:** Vyjmenuj 3 pilíře OOP a stručně popiš.
**A:** **Zapouzdření** — skrytí vnitřních dat objektu, expozice jen přes vnější rozhraní (private/public). **Dědičnost** — třída získává vlastnosti a metody předka. **Polymorfismus** — schopnost objektů chovat se různě (přetěžování dle parametrů, override dle instance).

**Q:** Jaký je rozdíl mezi třídou a objektem?
**A:** Třída je šablona, definuje strukturu a chování. Objekt je konkrétní instance vytvořená podle třídy přes `new`. Z jedné třídy můžu vytvořit libovolně mnoho objektů.

**Q:** Jaký je rozdíl mezi přetěžováním a overridingem?
**A:** **Přetěžování (overloading)** — víc metod se stejným jménem, ale jinými parametry; kompilátor vybere variantu při překladu. **Override** — potomek přepíše chování metody předka, vyžaduje `virtual` u předka a `override` u potomka; rozhodnutí, která metoda se zavolá, je za běhu (runtime polymorfismus).

**Q:** Co je abstraktní třída a jak se liší od interface?
**A:** Abstraktní třída je nehotová — nelze z ní vytvořit instanci, slouží jako základ pro potomky. Může obsahovat hotové i abstraktní metody. Interface je smlouva — definuje, co třída umí, ale nemá kód (tradičně). C# umí **jednu abstraktní třídu + víc interfaces** zároveň.

**Q:** Co je polymorfismus a kdy ho potřebuješ?
**A:** Polymorfismus = "mnohotvarnost" — schopnost stejného volání chovat se různě podle skutečného typu objektu. Příklad: `Clovek osoba = new Student(); osoba.Pozdrav();` — pokud je `Pozdrav` virtual/override, zavolá se ze Studenta i přes proměnnou typu Člověk. Potřebuju ho při práci s polymorfními kolekcemi (`List<Zvire>` obsahující psy a kočky).

**Q:** Co je `static` a kdy ho použiješ?
**A:** `static` patří **třídě**, ne instanci. Volá se přes `Trida.Metoda()` bez `new`. Použiju ho pro **utility metody** (`Math.Sqrt`), **konstanty** (`Math.PI`), nebo když potřebuju jednu sdílenou hodnotu pro všechny instance (např. počítadlo objektů).

**Q:** Co jsou generika a uveď příklad.
**A:** Generika = šablony pro typy. Třída nebo metoda je **univerzální** pro libovolný typ, konkrétní typ se doplní až při použití. Klasický příklad: `List<T>` — `List<int>` pro čísla, `List<string>` pro řetězce. Stejná logika, různé typy. Výhody: type safety, žádný boxing/unboxing, reusability.

**Q:** Co je `virtual` a `override`?
**A:** `virtual` u předka označuje metodu, která **může být přepsána**. `override` u potomka **přepisuje** virtual metodu předka. Bez těchto klíčových slov potomek metodu jen překryje (compile-time), ale polymorfní volání by používalo metodu předka.

**Q:** Co je rozdíl mezi `private` a `protected` modifikátorem?
**A:** `private` — vidí **jen tatáž třída**. `protected` — vidí **třída a její potomci**. Public vidí všichni.

**Q:** Co je jmenný prostor a k čemu slouží?
**A:** Logické seskupení tříd, předchází kolizi jmen. V C# definuje přes `namespace`. Importuje se přes `using` direktivu na začátku souboru. Standardní namespacy: `System`, `System.Collections.Generic`, `System.Linq`.

**Q:** Co se stane, když zapomeneš `override` u virtual metody potomka?
**A:** Bez `override` (a bez `new` keywordu) kompilátor varuje. Metoda potomka **překryje** předka, ale **při polymorfním volání** přes proměnnou typu předka se zavolá metoda **předka**, ne potomka. To rozbije polymorfismus.

---

## Co bych ještě měl vědět (volně)

- **Konstruktor přetěžování** — víc konstruktorů s různými parametry (`new Auto()`, `new Auto("červené")`).
- **`this` keyword** — odkaz na aktuální instanci. Potřebuje, když parametr má stejné jméno jako field (`this.jmeno = jmeno`).
- **`base` keyword** — odkaz na předka, volá konstruktor (`: base(...)`) nebo metodu (`base.Pozdrav()`).
- **Property `init`** — moderní (C# 9+), property nastavitelná **JEN při inicializaci**, pak immutable.
- **Records** — moderní (C# 9+), zjednodušená syntax pro **immutable data classes**: `public record Osoba(string Jmeno, int Vek);`.
- **`partial class`** — třídu lze rozdělit do víc souborů.
- **Extension methods** — přidávání metod k existujícím třídám zvenčí, bez dědění.
- **Nested classes** — třída uvnitř jiné třídy.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Jmenné prostory (namespaces)** — chybí v hodina-poznámkách, doplněno z obecných znalostí. Pokud učitel chce konkrétní detail (např. **file-scoped namespace** v C# 10+), ten formát je: `namespace MujNamespace;` na začátku souboru bez složených závorek. Komise standardně chce klasický `namespace { }` s blokem.
- ⚠️ **Default interface methods** (C# 8+) — moderní rozšíření, kde interface může mít hotovou metodu. Tradičně se učí *"interface = bez kódu"*. Komise pravděpodobně očekává tradiční výklad.
- ⚠️ **Records** (C# 9+) — moderní, ale ne nutně v maturitním curriculu. Pokud se komise zeptá *"co je `record`?"*, odpověz *"immutable data class, syntax sugar"*.
- ⚠️ **`new` keyword** (skrývání metod místo override) — komise se může zeptat *"co dělá `new` před metodou potomka?"*. Odpověz: *"překryje metodu předka, ale není to override — polymorfní volání pořád volá předka"*. Je to **proti polymorfismu** — vyhýbat se.

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-10
