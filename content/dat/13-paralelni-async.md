---
subject: DAT
number: 13
title: "Paralelní a asynchronní programování"
tags: ["programování", "c-sharp", "async"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**Paralelní a asynchronní programování** umožňuje využít **více jader CPU** nebo **neblokovat vlákno** během čekání. **Klíčové rozlišení:** **CPU-bound** úlohy (náročný výpočet) řešit přes **`Task.Run` nebo `Parallel.For`** (víc jader). **I/O-bound** úlohy (čekání na disk, síť, DB) řešit přes **`async`/`await`** (uvolní vlákno bez vytváření nového). **Race condition** = více vláken pracuje se stejnou proměnnou → nedeterministická chyba. Řešení: `lock`, `Interlocked`, **concurrent kolekce**.

---

## Klíčové pojmy

- **Concurrent** — víc úloh se střídá na jednom jádře
- **Parallel** — víc úloh běží opravdu současně na různých jádrech
- **CPU-bound** — náročný výpočet
- **I/O-bound** — čekání na vnější zdroj (disk, síť, DB)
- **Process** — spuštěný program s vlastní pamětí
- **Thread** — vlákno uvnitř procesu, sdílí paměť
- **Task** — abstrakce nad vlákny, používá ThreadPool
- **ThreadPool** — sada znovupoužitelných vláken
- **`async` / `await`** — asynchronní programování bez blokování
- **`Task.Run` / `WhenAll` / `WhenAny`** — Task operace
- **`Parallel.For` / `ForEach`** — paralelní iterace
- **PLINQ** — `AsParallel()`, paralelní LINQ
- **Race condition** — souběh, nedeterministická chyba
- **`lock` / `Interlocked`** — synchronizace
- **Deadlock** — vzájemné čekání na zámek
- **`CancellationToken`** — zrušení tasku
- **`Stopwatch`** — měření času

---

## Hlavní výklad

### 1. Proč to potřebujeme

Moderní procesory mají **více jader**. Program v jednom vlákně využívá **jen jedno jádro**, ostatní jsou nečinná.

**Důvody:**
1. **Zrychlit výpočty** rozdělením práce mezi víc jader (CPU-bound)
2. **Neblokovat UI / hlavní vlákno** během čekání na pomalé operace (I/O-bound: HTTP, čtení souboru, DB)
3. **Reagovat na události** (UI funguje, data se stahují na pozadí)

### 2. Concurrent × Parallel

| Pojem | Význam |
|---|---|
| **Concurrent (souběžný)** | Víc úloh se **střídá na jednom jádře** (rychlé přepínání). Vypadá to paralelně. |
| **Parallel (paralelní)** | Víc úloh běží **opravdu současně na různých jádrech**. |

V .NET se pojmy často zaměňují — runtime se sám rozhodne, jestli pustí Task na jiné jádro nebo přidá do fronty.

### 3. CPU-bound × I/O-bound (klíčové rozdělení!)

| Typ | Co dělá | Jak řešit |
|---|---|---|
| **CPU-bound** | Náročný výpočet (faktoriál, šifrování, zpracování obrazu) | **`Task.Run`**, **`Parallel.For`** (využít víc jader) |
| **I/O-bound** | Čeká na vnější zdroj (disk, síť, DB) | **`async`/`await`** (vlákno se uvolní) |

**Pravidlo:** *"Task.Run na výpočty. await na čekání."*

### 4. Process × Thread × Task

| Pojem | Co to je |
|---|---|
| **Process** | Spuštěná instance programu s **vlastní pamětí** (chrome.exe) |
| **Thread** | Jednotka výkonu uvnitř procesu, **sdílí paměť** s ostatními vlákny |
| **Task** | Abstrakce nad vlákny, používá **ThreadPool** |

**ThreadPool** = sada **předem vytvořených vláken**, které se znovupoužívají. `Task.Run` si bere volné vlákno z poolu. Vytvoření nového `Thread` je drahé, proto preferujeme `Task`.

### 5. Thread (nízkoúrovňové API)

```csharp
using System.Threading;

Thread t = new Thread(() => {
    Console.WriteLine("Běžím v jiném vlákně!");
});
t.Start();
t.Join();    // počká, až skončí
```

**V moderním .NET kódu zřídka**, preferuj `Task`.

**Vrácení hodnoty z Thread** = jen přes **sdílenou proměnnou** (chyby-prone):
```csharp
int vysledek = 0;
Thread t = new Thread(() => vysledek = 1 + 2);
t.Start();
t.Join();
Console.WriteLine(vysledek);   // 3
```

### 6. Task (vysokoúrovňová abstrakce)

**99 % případů.**

```csharp
// Bez návratu
Task t = Task.Run(() => Console.WriteLine("Pracuji..."));
await t;     // nebo t.Wait() — pozor na deadlock

// S návratem
Task<int> t = Task.Run(() => {
    Thread.Sleep(1000);
    return 67;
});
int vysledek = await t;

// Více tasků paralelně
Task<int> t1 = Task.Run(() => Pocitej(1));
Task<int> t2 = Task.Run(() => Pocitej(2));

int[] vysledky = await Task.WhenAll(t1, t2);   // počkej na všechny
Task<int> prvni = await Task.WhenAny(t1, t2);   // počkej na první
```

**Důležité metody:**
| Metoda | Co dělá |
|---|---|
| `Task.Run(action)` | Pustí akci na ThreadPool |
| `Task.WhenAll(tasks)` | Skončí, až skončí **všechny** |
| `Task.WhenAny(tasks)` | Skončí, až skončí **první** |
| `Task.Delay(ms)` | Asynchronní čekání (nahrazuje Thread.Sleep) |
| `Task.Wait()` | **Synchronně** počká (blokuje, deadlock risk) |
| `await task` | **Asynchronně** počká (uvolní vlákno) |

### 7. async / await

**Asynchronní programování bez vytvoření nového vlákna** — pouze umožní vláknu se uvolnit, dokud čeká.

```csharp
public async Task<string> StahniDataAsync()
{
    using HttpClient klient = new HttpClient();
    string odpoved = await klient.GetStringAsync("https://api.example.com");
    return odpoved;
}
```

**Pravidla:**
- Metoda musí mít `async`
- Návratový typ: `Task`, `Task<T>` nebo `void` (jen event handlery!)
- Konvence: jméno končí `Async`
- `await` jen uvnitř `async` metody

**Jak to funguje pod kapotou:**
```
Synchronní:           Vlákno: [───čekám 1s───][pokračuji]   ← plýtvá vláknem
Asynchronní:          Vlákno: [─][pracuje jinde][pokračuji] ← uvolní se
```

Kompilátor přepíše async metodu na **state machine** rozdělující kód na části před/po každém `await`.

**⚠️ `async void` — vyhni se** (kromě event handlerů). Výjimka spadne aplikaci, nelze čekat. Vždy `async Task`.

### 8. Parallel (paralelní iterace)

```csharp
// Paralelní cyklus
Parallel.For(0, 100, i => {
    Console.WriteLine($"i = {i}");
});

// Paralelní foreach
Parallel.ForEach(soubory, soubor => {
    string obsah = File.ReadAllText(soubor);
    Zpracuj(obsah);
});

// Paralelní spuštění různých metod
Parallel.Invoke(
    () => Metoda1(),
    () => Metoda2(),
    () => Metoda3()
);

// Řízení počtu vláken
ParallelOptions opts = new ParallelOptions
{
    MaxDegreeOfParallelism = Environment.ProcessorCount
};
Parallel.For(0, 1000, opts, i => Pracuj(i));
```

`Environment.ProcessorCount` = počet logických jader CPU.

### 9. Předávání dat mezi vlákny

**Vstup — lambda capture:**
```csharp
int n = 10;
Task t = Task.Run(() => Console.WriteLine(n));   // n zachyceno
```

**⚠️ Closure problém v cyklu:**
```csharp
// ❌ ŠPATNĚ: všechny tasky vypíší 10
for (int i = 0; i < 10; i++)
{
    Task.Run(() => Console.WriteLine(i));
}

// ✓ SPRÁVNĚ: lokální kopie
for (int i = 0; i < 10; i++)
{
    int kopie = i;
    Task.Run(() => Console.WriteLine(kopie));
}
```

Lambda zachytí **referenci na proměnnou `i`**, ne hodnotu. Než task spustí, `i` může být jiné.

**Výstup:**
| Způsob | Příklad |
|---|---|
| **`Task<T>`** (preferované) | `int v = await Task.Run(() => 67);` |
| Sdílená proměnná + Join | Pro Thread, chyby-prone |
| Callback | `Task.Run(() => { var v = ...; OnHotovo(v); });` |

### 10. Synchronizace — Race condition

**Více vláken zapisuje do stejné proměnné → nedeterministická chyba.**

```csharp
int citac = 0;
Parallel.For(0, 1_000_000, i => citac++);
Console.WriteLine(citac);   // očekáváme 1 000 000, je to méně
```

`citac++` **není atomická** (čtení → +1 → zápis). Dvě vlákna mohou přečíst stejnou hodnotu a vzájemně se přepsat.

### 11. Řešení race condition

**1. `lock`** (blok kódu):
```csharp
object zamek = new object();
int citac = 0;

Parallel.For(0, 1_000_000, i => {
    lock (zamek)
    {
        citac++;
    }
});
```

**Pravidla:**
- Vždy zamykat **`private readonly object`**, ne `this` ani typ
- Drž zámek **co nejkratší dobu**
- **Nikdy `await` uvnitř lock** (může způsobit deadlock)

**2. `Interlocked`** (rychlejší pro jednoduché operace):
```csharp
int citac = 0;
Parallel.For(0, 1_000_000, i => {
    Interlocked.Increment(ref citac);   // atomické ++
});
```

Funkce: `Increment`, `Decrement`, `Add`, `Exchange`. CPU má speciální atomické instrukce.

**3. Concurrent kolekce** (thread-safe):
| Standardní | Thread-safe |
|---|---|
| `List<T>` | `ConcurrentBag<T>` |
| `Dictionary<K,V>` | `ConcurrentDictionary<K,V>` |
| `Queue<T>` | `ConcurrentQueue<T>` |
| `Stack<T>` | `ConcurrentStack<T>` |

### 12. Deadlock

Vzniká, když 2 vlákna čekají navzájem na uvolnění zámku:
```
Vlákno A:  lock(X) { lock(Y) { ... } }     A drží X, čeká na Y
Vlákno B:  lock(Y) { lock(X) { ... } }     B drží Y, čeká na X
                                             → Zamrznutí
```

**Prevence:** Vždy zamykej zámky ve **STEJNÉM POŘADÍ** (např. abecedně).

### 13. CancellationToken (zrušení tasku)

```csharp
CancellationTokenSource cts = new CancellationTokenSource();
CancellationToken token = cts.Token;

Task t = Task.Run(() => {
    for (int i = 0; i < 100; i++)
    {
        token.ThrowIfCancellationRequested();
        Thread.Sleep(100);
    }
}, token);

// Po 1 s zruš
await Task.Delay(1000);
cts.Cancel();   // způsobí OperationCanceledException
```

Použití: storno tlačítko v UI, timeout pro HTTP, atd.

### 14. PLINQ

```csharp
int[] cisla = Enumerable.Range(1, 1_000_000).ToArray();

int suma = cisla.AsParallel()
                .Where(x => x % 2 == 0)
                .Sum();
```

**Pozor:** PLINQ má overhead (rozdělení práce, sloučení). Pro **malá data pomalejší** než LINQ. Vyplatí se pro velká data / náročné operace.

### 15. Stopwatch (měření času)

```csharp
using System.Diagnostics;

Stopwatch sw = Stopwatch.StartNew();
// ... práce ...
sw.Stop();
Console.WriteLine($"Trvalo: {sw.ElapsedMilliseconds} ms");
```

Přesnější než `DateTime.Now` (high-resolution timer).

### 16. Cheat sheet — co kdy použít

| Situace | Použij |
|---|---|
| Stáhnout data z internetu | `await HttpClient.GetAsync(...)` |
| Načíst soubor | `await File.ReadAllTextAsync(...)` |
| Náročný výpočet | `await Task.Run(() => ...)` |
| Více výpočtů paralelně | `Parallel.For` nebo `Task.WhenAll` |
| Iterovat kolekci paralelně | `Parallel.ForEach` |
| Čekat na všechny | `await Task.WhenAll(t1, t2)` |
| Čekat na první | `await Task.WhenAny(t1, t2)` |
| Asynchronní pauza | `await Task.Delay(1000)` |
| Synchronizace | `lock`, `Interlocked`, `Concurrent*` |
| Zrušit Task | `CancellationToken` |
| Měřit čas | `Stopwatch.StartNew()` |

---

## Vztahy / kontrasty

- **Concurrent × Parallel:** střídání na 1 jádře × opravdu zároveň na víc jádrech
- **CPU-bound × I/O-bound:** výpočet × čekání. `Task.Run` × `await`
- **Thread × Task:** nízkoúrovňové × ThreadPool (recyklace)
- **`async`/`await` × `Parallel.For`:** I/O bez blokování × CPU výpočty
- **`lock` × `Interlocked`:** blok kódu × atomické instrukce (rychlejší pro `++`)
- **`Task.Wait()` × `await task`:** synchronní (deadlock risk) × asynchronní (uvolní vlákno)
- **Race condition × Deadlock:** chybný výsledek × zamrznutí

---

## Časté otázky komise

**Q:** Co je rozdíl mezi paralelním a asynchronním programováním?
**A:** **Paralelní** = víc úloh **opravdu současně na různých jádrech** (CPU-bound výpočty, `Task.Run`, `Parallel.For`). **Asynchronní** = uvolnění vlákna **bez vytváření nového** během čekání na pomalé operace (I/O-bound: HTTP, soubor, DB). `async`/`await`. **Async nepotřebuje víc jader** — uvolní vlákno pro jiný request.

**Q:** Co je rozdíl mezi CPU-bound a I/O-bound úlohou?
**A:** **CPU-bound** = úloha hodně **využívá CPU** (náročný výpočet — faktoriál, šifrování, zpracování obrazu). Řešení: **`Task.Run`** nebo **`Parallel.For`** pro rozložení mezi jádra. **I/O-bound** = úloha **čeká na vnější zdroj** (disk, síť, DB). Řešení: **`async`/`await`**, vlákno se uvolní během čekání. Pravidlo: *"Task.Run na výpočty, await na čekání."*

**Q:** Co je Task a proč je lepší než Thread?
**A:** **Task** = vysokoúrovňová abstrakce nad vlákny, používá **ThreadPool** (sada předem vytvořených vláken, recykluje se). **Thread** = nízkoúrovňový API, OS vytváří nové vlákno **drahé**. Plus Task má **vracení hodnoty** přes `Task<T>` (Thread musí přes sdílenou proměnnou + Join). Plus `async`/`await` funguje s Task, ne s Thread.

**Q:** Co jsou async a await?
**A:** Klíčová slova pro **asynchronní programování bez blokování vlákna**. **`async`** označuje metodu, která může používat `await`. **`await`** = počkej na dokončení Tasku, **mezitím uvolni vlákno pro jinou práci**. Návratový typ async metody musí být `Task`, `Task<T>` (nebo void pro event handlery, jinak vyhnout). Konvence: jméno končí `Async`.

**Q:** Co je race condition a jak ji řešit?
**A:** **Race condition** = **více vláken pracuje se stejnou proměnnou** a výsledek závisí na pořadí (nedeterministická chyba). Klasický příklad: `citac++` ze 2 vláken — operace není atomická (čtení → +1 → zápis), vlákna se mohou přepsat. **Řešení:** 1) **`lock(zamek) { citac++; }`** (blok kódu). 2) **`Interlocked.Increment(ref citac)`** (atomické, rychlejší). 3) **Concurrent kolekce** (`ConcurrentBag`, `ConcurrentDictionary`).

**Q:** Co je deadlock a jak mu předejít?
**A:** **Dvě vlákna se navzájem čekají** na uvolnění zámku → **zamrznutí**. Příklad: A drží zámek X a čeká na Y, B drží Y a čeká na X. **Prevence:** vždy zamykat zámky ve **STEJNÉM POŘADÍ** napříč celým kódem (např. abecedně podle jména). Plus **nikdy `await` uvnitř `lock`** (může způsobit deadlock).

**Q:** Co dělá `Task.WhenAll` a `Task.WhenAny`?
**A:** **`Task.WhenAll(tasks)`** = počká na **VŠECHNY** tasky a vrátí pole jejich výsledků. Použití: paralelní výpočty (rozděl práci, počkej až všichni skončí). **`Task.WhenAny(tasks)`** = počká na **PRVNÍHO**, kdo skončí. Použití: timeout pattern, race nejrychlejšího serveru.

**Q:** Proč je `async void` problematické?
**A:** **`async void` výjimky** se nedají odchytit přes `try-catch` u volajícího → **spadne celá aplikace**. Plus **nelze čekat na dokončení** (`await asyncVoidMethod()` nefunguje). Použij **JEN pro event handlery** (např. `Button_Click`), jinak vždy **`async Task`**. Pravidlo: `async void` = code smell.

**Q:** Co je closure problém v `for` cyklu s Tasky?
**A:** **Lambda zachytí REFERENCI na proměnnou, ne hodnotu.** Příklad: `for (int i = 0; i < 10; i++) Task.Run(() => Console.WriteLine(i));` — všechny tasky vypíší **10** (poslední hodnotu `i` po skončení cyklu). **Řešení:** lokální kopie uvnitř cyklu: `int kopie = i; Task.Run(() => Console.WriteLine(kopie));`. Drobné riziko ve `foreach` (od C# 5+ má každá iterace vlastní proměnnou).

**Q:** Co je `CancellationToken`?
**A:** Mechanismus pro **zrušení dlouho běžícího Tasku**. `CancellationTokenSource cts = new()` + `CancellationToken token = cts.Token`. V tasku pravidelně volat `token.ThrowIfCancellationRequested()`. Z venku `cts.Cancel()` způsobí `OperationCanceledException` uvnitř tasku. Použití: **storno tlačítko v UI, timeout pro HTTP, dlouho běžící výpočet**.

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-20
