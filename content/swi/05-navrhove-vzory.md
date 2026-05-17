---
subject: SWI
number: 5
title: "Návrhové vzory (Design Patterns)"
tags: ["oop", "design-patterns", "architektura", "c-sharp", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

**Návrhové vzory** jsou **opakovaně použitelná řešení často se opakujících problémů** v OOP návrhu softwaru. Nejsou to hotové knihovny ani kus kódu — jsou to **způsoby, jak strukturovat třídy a jejich vztahy**. Pochází z knihy *Design Patterns* (1994) od **Gang of Four (GoF)** — Gamma, Helm, Johnson, Vlissides — kteří definovali 23 vzorů ve třech kategoriích: **vytvářecí, strukturální, behaviorální**.

---

## Klíčové pojmy

- **Návrhový vzor** — strukturální šablona pro řešení návrhového problému
- **Gang of Four (GoF)** — autoři knihy *Design Patterns* z 1994 (Gamma, Helm, Johnson, Vlissides)
- **Vytvářecí (creational)** — řeší, **jak vytvářet objekty**
- **Strukturální (structural)** — řeší, **jak skládat třídy/objekty do větších celků**
- **Behaviorální (behavioral)** — řeší **komunikaci mezi objekty** a **rozdělení odpovědnosti**
- **Singleton** — třída s právě jednou instancí
- **Observer** — vztah 1:N, Publisher → Subscriberi
- **Factory Method** — delegace vytváření instancí na podtřídy
- **Command** — zabalení akce jako objektu (umožní undo, frontu, log)
- **SOLID** — principy OOP (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)
- **Anti-pattern** — vzor, který vypadá jako řešení, ale způsobuje problémy

---

## Hlavní výklad

### 1. Tři kategorie GoF (23 vzorů celkem)

| Kategorie | Co řeší | Příklady |
|---|---|---|
| **Vytvářecí** (creational) | Jak vytvářet objekty bez svázání s konkrétními třídami | **Singleton**, **Factory Method**, Builder, Abstract Factory, Prototype |
| **Strukturální** (structural) | Jak skládat třídy/objekty do větších celků | Adapter, Composite, Facade, Decorator, Proxy |
| **Behaviorální** (behavioral) | Komunikace mezi objekty + rozdělení odpovědnosti | **Observer**, **Command**, Strategy, State, Template Method |

Pro maturitu se soustředíme na **4 konkrétní vzory** (per Prchal): **Singleton, Observer, Factory Method, Command**.

---

### 2. Singleton (vytvářecí)

**Účel:** zaručí, že třída má **právě jednu instanci** v celé aplikaci + poskytuje k ní **globální přístup**.

**Princip:**
- **Privátní konstruktor** — nikdo zvenku nemůže udělat `new`
- **Statická metoda** `getInstance()` — vrátí instanci (a při prvním volání ji vytvoří)
- **Statické pole** drží referenci

```csharp
class Logger
{
    private static Logger instance;

    private Logger() {}    // nikdo zvenku nemůže new

    public static Logger getInstance()
    {
        if (instance == null)
            instance = new Logger();   // lazy initialization
        return instance;
    }
}
```

**Použití:**
- **Logger** (jeden zápis do log souboru)
- **Konfigurace** aplikace
- **Cache**
- V Unity: `GameManager`, `AudioManager`

**Výhody:**
- Jistota právě jedné instance
- Globální přístup
- Lazy initialization

**Nevýhody (Singleton je často považován za anti-pattern):**
- V podstatě **globální proměnná** → skryté závislosti mezi částmi kódu
- Porušuje **Single Responsibility Principle** (řeší logiku i svůj životní cyklus)
- Špatně se **testuje** (nejde mockovat, drží stav mezi testy)
- Problémy ve **vícevláknovém prostředí** — 2 vlákna mohou současně projít `if == null` a vytvořit 2 instance. Řeší se: `synchronized`, **double-checked locking**, nebo **enum implementací**.

---

### 3. Observer (behaviorální)

**Účel:** Definuje vztah **1:N** — když jeden objekt (**Publisher / Subject**) změní stav, všichni jeho odběratelé (**Subscribers / Observers**) jsou **automaticky informováni**.

**Princip:**
- Publisher drží **seznam observerů** a metody `subscribe()`, `unsubscribe()`, `notify()`
- Subscriber implementuje **rozhraní** s metodou `update()`, kterou Subject volá
- Subscriber se sám přihlásí, Publisher ho jen obslouží — **nezná konkrétní typy** odběratelů (loose coupling)

```csharp
interface IObserver
{
    void Update(string message);
}

class Publisher
{
    private List<IObserver> observers = new();

    public void Subscribe(IObserver o) => observers.Add(o);
    public void Unsubscribe(IObserver o) => observers.Remove(o);

    public void Notify(string message)
    {
        foreach (var o in observers)
            o.Update(message);
    }
}
```

**Použití:**
- **GUI eventy** (kliknutí na tlačítko → handler)
- **C# `event` / `delegate`**, JavaScript `addEventListener`
- **Reaktivní knihovny** (RxJS)
- **MVC** — View pozoruje Model
- **Pub/sub messaging** (Apache Kafka, MQTT)

**Výhody:**
- **Loose coupling** — Subject a Observer se znají jen přes rozhraní
- Dynamické přihlašování/odhlašování za běhu
- Jeden Subject může mít **libovolný počet** odběratelů různých typů

**Nevýhody:**
- **Memory leaks** — pokud se Observer zapomene odhlásit, Subject ho drží v seznamu, GC ho neuvolní
- **Neřízené pořadí** notifikací — nelze spoléhat, kdo dostane update první
- **Těžké debugovat** — když přijde event, není okamžitě jasné, kdo všechno na něj zareaguje (kaskáda updatů)
- Riziko **nekonečné smyčky** — Observer při updatu změní Subject → další notifikace → ...

**Observer = základ událostmi řízeného programování** (viz SWI 23).

---

### 4. Factory Method (vytvářecí)

**Účel:** umožňuje třídě **delegovat vytváření instancí na své podtřídy**. Klient pracuje s abstraktním rozhraním, neví, jaký konkrétní typ dostane.

**Princip:**
- Abstraktní třída / interface s metodou `createProduct()` (= Factory Method)
- Každá podtřída ji **přepíše** a vrátí jiný konkrétní typ
- Zbytek kódu v rodičovské třídě používá `createProduct()` aniž by věděl, co přesně vznikne

```csharp
abstract class Dialog
{
    public void Render()
    {
        Button b = CreateButton();   // Factory Method
        b.Render();
    }

    protected abstract Button CreateButton();   // podtřídy rozhodnou
}

class WindowsDialog : Dialog
{
    protected override Button CreateButton() => new WindowsButton();
}

class MacDialog : Dialog
{
    protected override Button CreateButton() => new MacButton();
}
```

**Použití:**
- **Cross-platform UI** (jeden kód, různé widgety podle OS)
- Různé typy **dokumentů** v textovém editoru
- **Parsery** (XML/JSON/YAML) vybírané podle vstupu
- **ORM** — `EntityManager.createQuery()`

**Výhody:**
- **Open/Closed Principle** — přidání nového typu = přidat podtřídu, ne měnit existující kód
- Odděluje **vytváření** objektu od jeho **použití**
- Klient nezávisí na konkrétních třídách, jen na rozhraní

**Nevýhody:**
- **Víc tříd** = vyšší složitost u jednoduchých případů
- Vyžaduje **hierarchii dědičnosti** (Factory Method = polymorfismus)
- Pro nezkušené může působit zbytečně abstraktně

---

### 5. Command (behaviorální)

**Účel:** zabalí **požadavek (akci) jako objekt**. Místo přímého volání metody vznikne objekt, který nese informaci *co* udělat a *na čem* — dá se **uložit do fronty, logovat, vrátit zpět (undo), zopakovat**.

**Princip — typické role:**
- **`Command`** — rozhraní s metodou `Execute()` (často i `Undo()`)
- **`ConcreteCommand`** — implementace konkrétní akce, drží odkaz na receivera a parametry
- **`Receiver`** — objekt, který akci skutečně provede
- **`Invoker`** — spouštěč (např. tlačítko), **neví nic** o tom, co Command dělá
- **`Client`** — vytváří Command a předává ho Invokerovi

```csharp
interface ICommand
{
    void Execute();
    void Undo();
}

class CopyCommand : ICommand
{
    private Editor editor;
    private string backup;

    public CopyCommand(Editor e) { editor = e; }

    public void Execute()
    {
        backup = editor.GetSelection();
        editor.CopyToClipboard();
    }

    public void Undo() { /* clipboard zpět */ }
}

class Button   // Invoker
{
    private ICommand command;
    public void Click() => command.Execute();
}
```

**Použití:**
- **Undo/Redo** (Ctrl+Z) — Photoshop, IDE, Word: historie je stack commandů
- **Makra** — sekvence commandů, kterou lze přehrát
- **GUI tlačítka a menu** — stejná akce dosažitelná z víc míst (toolbar, klávesa, menu)
- **Queueing / scheduling** — joby ve frontě, transakce v DB
- **Logování operací** (audit log, event sourcing)
- **Network requesty** (zabalit, poslat po síti, provést na druhé straně)

**Výhody:**
- **Odděluje odesílatele** (Invoker) **od příjemce** (Receiver) — tlačítko neví, co se po stisku stane
- Snadno se realizuje **undo/redo** (každý Command si pamatuje, jak se vrátit)
- Commandy lze **kombinovat** (makro = složený command), **frontovat, logovat, odložit**
- Open/Closed — nová akce = nová třída, žádné zásahy

**Nevýhody:**
- **Hodně malých tříd** — pro každou akci vlastní třída
- Pro jednoduché případy **overengineering** (proč Command, když stačí volat metodu?)
- Undo bývá komplikovaný u akcí, které mají **vedlejší efekty** (smazaný soubor z disku)

---

## Konkrétní příklady

### Singleton — thread-safe verze v C#

```csharp
class Logger
{
    private static readonly Lazy<Logger> instance =
        new Lazy<Logger>(() => new Logger());

    public static Logger Instance => instance.Value;

    private Logger() {}

    public void Log(string message) => /* ... */;
}
```

`Lazy<T>` zaručuje **thread-safety** automaticky.

### Observer — C# event idiom

```csharp
class Publisher
{
    public event Action<string> OnMessage;

    public void DoSomething()
    {
        OnMessage?.Invoke("Něco se stalo");
    }
}

// Subscriber
publisher.OnMessage += msg => Console.WriteLine(msg);
```

C# má **vestavěné `event`** klíčové slovo — Observer pattern není nutné implementovat ručně.

---

## Vztahy / kontrasty

- **Singleton × Static class:** Singleton je instance (lze předat, mockovat, implementovat interface). Static class = jen statické metody, nelze instanciovat. Singleton flexibilnější.
- **Observer × Mediator:** Observer 1:N (Publisher → mnoho Subscriberů). Mediator centralizuje komunikaci mezi komponentami (1 prostředník propojuje N peers).
- **Factory Method × Abstract Factory:** Factory Method = 1 metoda v subclass. Abstract Factory = celé rozhraní pro **rodinu** souvisejících produktů (Button + TextField + Window pro daný OS).
- **Command × Strategy:** Command = akce jako objekt (umí undo, queue). Strategy = algoritmus jako objekt (vyměnitelný za běhu).
- **Vytvářecí × Strukturální × Behaviorální:** "Jak vznikají" × "Jak jsou složené" × "Jak komunikují".

---

## Výhody návrhových vzorů obecně

- **Ověřená řešení** — neřešíš problém od nuly
- **Společný slovník** — *"udělej to jako Observer"* a tým ví, co tím myslíš
- Zlepšují **udržovatelnost** a **rozšiřitelnost**
- Podporují principy **SOLID** (zejména Open/Closed a Dependency Inversion)
- Usnadňují **komunikaci v týmu** a **code review**

## Nevýhody návrhových vzorů obecně

- **Zbytečná složitost (overengineering)** — vzor přidaný "protože je elegantní" zhorší kód
- Riziko **nadužívání** — někdy stačí obyčejná funkce nebo `if`
- **Vyšší vstupní bariéra** pro nezkušené (víc tříd, víc abstrakce)
- Vzory z roku 1994 jsou částečně **kompenzací slabin starších jazyků** — v moderních (Kotlin, Python, JS) se některé řeší vestavěnými prostředky (lambdy, first-class funkce)
- **Singleton** je často považován přímo za **anti-pattern**

---

## Časté otázky komise

**Q:** Co je návrhový vzor a kde se vzaly?
**A:** Návrhové vzory jsou **opakovaně použitelná řešení často se opakujících problémů** v OOP návrhu softwaru. Nejsou to hotové knihovny ani kus kódu — jsou to **způsoby, jak strukturovat třídy a jejich vztahy**. Pochází z knihy *Design Patterns* (1994) od **Gang of Four (GoF)** — Gamma, Helm, Johnson, Vlissides — kteří definovali 23 vzorů.

**Q:** Jaké jsou tři kategorie návrhových vzorů?
**A:** **Vytvářecí (creational)** — řeší, jak vytvářet objekty (Singleton, Factory Method, Builder...). **Strukturální (structural)** — jak skládat objekty do větších celků (Adapter, Composite, Facade...). **Behaviorální (behavioral)** — komunikace mezi objekty a rozdělení odpovědnosti (Observer, Command, Strategy, State).

**Q:** Vysvětli Singleton.
**A:** Singleton zaručí, že třída má **právě jednu instanci** v celé aplikaci + poskytuje globální přístup. Princip: privátní konstruktor (nikdo zvenku nemůže `new`), statická metoda `getInstance()`, statické pole drží referenci. Lazy initialization — instance se vytvoří až při prvním volání. Použití: logger, konfigurace, cache. Nevýhody: skryté globální závislosti, špatně testovatelné, problémy ve vícevláknovém prostředí.

**Q:** Vysvětli Observer.
**A:** Observer definuje vztah **1:N** — když Publisher změní stav, všichni Subscriberi jsou automaticky informováni. Publisher drží seznam observerů + metody `subscribe/unsubscribe/notify`. Subscriber implementuje rozhraní s metodou `update()`. **Loose coupling** — Publisher nezná konkrétní typy odběratelů, jen rozhraní. Použití: GUI eventy, C# `event`/`delegate`, MVC (View pozoruje Model), pub/sub messaging. Nevýhody: memory leaks (zapomenuté odhlášení), neřízené pořadí notifikací.

**Q:** Co je Factory Method a kdy se hodí?
**A:** Factory Method umožňuje třídě **delegovat vytváření instancí na podtřídy**. Klient pracuje s abstraktním rozhraním, podtřída rozhodne, jaký konkrétní typ vrátí. Princip: abstraktní třída s `createProduct()`, každá podtřída ji přepíše. Použití: cross-platform UI (jeden kód, různé widgety podle OS), parsery vybírané podle vstupu, ORM. Výhoda: **Open/Closed** — nový typ = nová podtřída, neměníš existující kód.

**Q:** Co je Command a kde se používá?
**A:** Command **zabalí akci jako objekt** — místo přímého volání metody vznikne objekt s `Execute()` a `Undo()`. Role: Command (rozhraní), ConcreteCommand (konkrétní akce), Receiver (kdo to provede), Invoker (kdo spouští, např. tlačítko), Client (vytváří). Použití: **Undo/Redo** (stack commandů), makra, GUI tlačítka, queueing, audit logging. Výhoda: odděluje odesílatele od příjemce, snadné undo.

**Q:** Proč je Singleton často označován za anti-pattern?
**A:** Singleton je v podstatě **globální proměnná v hávu OOP**. Vytváří **skryté závislosti** (třída A používá Singleton B, ale není to vidět v rozhraní), **porušuje Single Responsibility Principle** (třída řeší svou logiku i svůj životní cyklus), **špatně se testuje** (nejde mockovat, drží stav mezi testy). V moderních aplikacích se místo Singleton používá **Dependency Injection** — DI kontejner se postará o lifetime, ale závislosti jsou explicitní.

---

## Co bych ještě měl vědět (volně)

- **SOLID principy** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **MVC** (Model-View-Controller) — **architektonický vzor**, ne GoF. Odděluje data (Model), UI (View), logiku (Controller). Použito v ASP.NET MVC, ne Razor Pages.
- **Strategy** — algoritmus jako vyměnitelný objekt (např. různé sorty)
- **State** — chování objektu se mění podle vnitřního stavu
- **Adapter** — propojí nekompatibilní rozhraní (USB → USB-C adaptér)
- **Decorator** — dynamicky přidává funkčnost (HttpClient + Logging decorator + Retry decorator)
- **Facade** — jednoduché rozhraní pro komplexní subsystém

---

## ⚠️ Důležitá poznámka

**Per pokyn uživatele a Prchalovy zápisky:** Pokud se komise zeptá *"jaké další vzory znáš"*, můžeš jmenovat **Strategy, Adapter, Decorator, Facade** (jednou větou), ale **detailně rozebírat jen 4 hlavní** (Singleton, Observer, Factory Method, Command). MVC zmínit jen jako **architektonický vzor**, ne GoF (Popis ho uvádí, ale Prchal ho ne — držet se Prchala).

---

## Status

- **Sebehodnocení (před):** 2/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
