---
subject: SWI
number: 6
title: "Chyby, testování a ladění"
tags: ["testování", "výjimky", "debugging", "c-sharp", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

Chyby v programu se dělí podle **kdy nastanou** a **co je způsobí** — syntaktické (kompilátor), sémantické (během běhu funguje, ale vrací nesmysl), typové (špatný typ) a běhové (výjimky). Řešení jsou dvě cesty: **defensivní programování** (předem ověřit stav, např. `File.Exists`) a **try/catch** (chytit výjimku až se objeví). Ladění používá **breakpointy, watch, krokování**. Testování dělíme podle rozsahu na **unit, integrační a end-to-end** testy.

---

## Klíčové pojmy

- **Syntaktická chyba** — porušení pravidel jazyka, odchytí kompilátor
- **Sémantická chyba** — program běží, ale dělá špatnou věc (off-by-one, špatný vzorec)
- **Typová chyba** — špatný typ (kompilátor v statickém jazyce, runtime v dynamickém)
- **Runtime exception** — výjimka za běhu (`NullReferenceException`, `FileNotFoundException`)
- **Defensivní programování** — ověř stav PŘED akcí
- **Race condition** — chyba kdy se dvě vlákna zaplete (ověřil jsem soubor → mezitím ho jiný proces smazal)
- **try/catch/finally** — strukturované zachycení výjimek
- **Breakpoint** — místo zastavení programu při ladění
- **Watch** — okno s aktuálními hodnotami proměnných
- **Stepping** — Step Over (další řádek) / Step Into (do funkce)
- **Unit test** — testuje 1 funkci/metodu izolovaně
- **Integrační test** — testuje spolupráci modulů
- **E2E test** — simuluje uživatele (Cypress, Playwright)
- **Mock** — falešný objekt nahrazující reálnou závislost v testech

---

## Hlavní výklad

### 1. Druhy chyb (4 kategorie)

| Druh | Kdy | Příklad | Kdo odchytí |
|---|---|---|---|
| **Syntaktická** | Compile-time | chybějící středník, překlep v keywordu | Kompilátor |
| **Sémantická** | Runtime, ale program nepadá | špatný algoritmus, off-by-one, špatný vzorec | **Lidská kontrola / testy** |
| **Typová** | Compile-time (C#) / runtime (JS) | string vs int přiřazení | Kompilátor / type checker |
| **Běhová (runtime)** | Při běhu | NullReferenceException, FileNotFoundException, NetworkError | `try/catch` |

**Mantra:** *"Syntaktickou chytí compiler, sémantickou jen testy, typovou typový systém, běhovou výjimky."*

### 2. Důvody runtime chyb

- **"Uživatel je debil"** — neočekávaný vstup (text místo čísla)
- **"Uživatel je zákeřný"** — útoky, SQL injection, malformed data
- **Externí prostředí** — soubor neexistuje, disk plný, výpadek sítě
- **Hardware** — odpojené zařízení, nedostatek paměti

### 3. Dva přístupy k řešení chyb

#### Defensivní programování

Ověř stav **PŘED** akcí:

```csharp
if (File.Exists(cesta))
{
    var obsah = File.ReadAllText(cesta);
    // ...
}
```

**Výhoda:** explicitní, čitelné.
**Nevýhoda:** **race condition** — mezi `if` a `ReadAllText` jiný proces soubor smaže.

#### Ošetřování výjimek (try/catch)

Nech chybu nastat, **chyť ji**:

```csharp
try
{
    var obsah = File.ReadAllText(cesta);
}
catch (FileNotFoundException ex)
{
    Console.WriteLine("Soubor nenalezen: " + ex.Message);
}
catch (Exception ex)
{
    Console.WriteLine("Jiná chyba: " + ex.Message);
}
finally
{
    // úklid, vždy proběhne (např. zavření streamu)
}
```

**Bloky:**
- **`try`** — kód, kde čekáme problém
- **`catch`** — co dělat při chybě (lze mít víc `catch` pro různé typy)
- **`finally`** — proběhne **vždy** (úspěch i chyba), typicky úklid

**Propagace výjimky:** pokud `catch` nezachytí, výjimka **jede nahoru zásobníkem** (call stack) až do funkce, která ji chytí. Pokud nikdo, **aplikace spadne**.

### 4. Ladění (debugging)

**Cíl:** najít, **proč** program nedělá to, co má.

#### Nástroje

- **`Console.WriteLine` / `console.log`** — primitivní, ale rychlé pro malé bugy
- **Breakpoint** — značka v IDE, program se na ní zastaví. Můžeš prohlédnout stav.
- **Watch** — okno s aktuálními hodnotami proměnných (lze sledovat změny)
- **Call Stack** — kdo zavolal koho (kde jsme v hierarchii volání)
- **Krokování (stepping):**
  - **Step Over** — další řádek (přes funkci, ne dovnitř)
  - **Step Into** — vleze dovnitř volané funkce
  - **Step Out** — dokončí aktuální funkci a vrátí se k volajícímu

**Limit:** debugger **nefunguje dobře u async kódu** — vlákna se přepínají, stack je jiný.

### 5. Mechanismy hlášení chyb

#### Návratové kódy (starší přístup)

```c
int result = openFile("data.txt");
if (result == -1) { /* chyba */ }
```

**Nevýhoda:** musíš kontrolovat **po každém volání**. Lehce zapomeneš → tichá chyba.

#### Výjimky (moderní, OOP)

```csharp
try {
    var f = OpenFile("data.txt");
}
catch (FileNotFoundException) {
    // ...
}
```

**Výhoda:** chyba **nemůže být tiše ignorována** — vyhodí se na povrch.

### 6. Testování — rozsah testů

| Typ | Co testuje | Rychlost | Příklad |
|---|---|---|---|
| **Unit test** | 1 metodu/funkci izolovaně | rychlý (ms) | `Soucet(2, 3) == 5` |
| **Integrační test** | Spolupráci 2+ modulů | středně rychlý | API + DB komunikace |
| **End-to-end (E2E)** | Celý průchod aplikací jako uživatel | pomalý (s) | Login → košík → objednávka |
| **Render test** | Renderování UI komponent | středně | React komponenta zobrazí správný HTML |

**Pyramida testů:** hodně unit, méně integračních, málo E2E. Důvod: unit jsou rychlé a stabilní, E2E pomalé a křehké (selhávají na drobnostech jako loading state).

### 7. Unit testy — detail

**Cíl:** otestovat **edge cases**:
- Prázdný vstup (`""`, `null`, `0`)
- Hraniční hodnoty (min, max, jeden pod, jeden nad)
- Záporná čísla, NaN, infinity
- Neobvyklé vstupy (Unicode, emoji, mezery)

**Mockování:** pokud testovaná metoda volá externí závislost (DB, API, file system), nahradíme ji **mockem** (fake objekt s předem nadefinovaným chováním). Důvody:
- Testy musí být **rychlé** (ne čekat na DB)
- **Deterministické** (nezáleží na stavu DB)
- **Izolované** (selhání jiného modulu nezpůsobí selhání tohoto testu)

**C# framework:** **xUnit**, NUnit, MSTest. Mocking: **Moq**, NSubstitute.

```csharp
[Fact]
public void Soucet_DvouCisel_VraciSpravnyVysledek()
{
    var result = Kalkulator.Soucet(2, 3);
    Assert.Equal(5, result);
}
```

### 8. E2E testy

Simulují **reálného uživatele** klikajícího v prohlížeči.

**Nástroje:**
- **Cypress** — JS framework, populární
- **Playwright** — od Microsoftu, podporuje Chrome/Firefox/Safari
- **Selenium** — starší klasika

**Testování proti reálné DB** typicky v testovacím prostředí (ne produkční).

---

## Konkrétní příklady

### Try/catch hierarchie

```csharp
try
{
    var conn = OpenConnection();        // může vyhodit SqlException
    var data = conn.Query("SELECT...");  // může vyhodit InvalidOperationException
}
catch (SqlException ex)
{
    Logger.Error("DB chyba: " + ex.Message);
}
catch (Exception ex)              // catch-all jako poslední
{
    Logger.Error("Jiná chyba: " + ex.Message);
}
finally
{
    conn?.Close();                // vždy zavři, ať se cokoli stane
}
```

**Pořadí catch bloků:** specifický → obecný. Jinak by obecný `Exception` chytil všechno a specifický nikdy nedostal šanci.

### Unit test příklad (xUnit)

```csharp
public class KalkulatorTests
{
    [Fact]
    public void Deleni_NulouVyhodiException()
    {
        Assert.Throws<DivideByZeroException>(() => Kalkulator.Deleni(10, 0));
    }

    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(0, 0, 0)]
    [InlineData(-5, 5, 0)]
    public void Soucet_RuznaCisla_VraciSpravneVysledky(int a, int b, int expected)
    {
        Assert.Equal(expected, Kalkulator.Soucet(a, b));
    }
}
```

---

## Vztahy / kontrasty

- **Syntaktická × sémantická:** compile-time × runtime. Kompilátor chytí syntax, sémantiku jen člověk/testy.
- **Defensivní × try/catch:** ověř před × chyť po. Defensivní má **race condition** problém, try/catch je robustnější.
- **Návratové kódy × výjimky:** kódy lze tiše ignorovat, výjimky vyhazují na povrch. Výjimky moderní default.
- **Unit × integrační × E2E:** izolace × spolupráce × celá appka. Pyramida = hodně unit, málo E2E.
- **`finally` × `using`:** `finally` univerzální blok, `using` v C# specificky pro IDisposable (auto-zavře).

---

## Časté otázky komise

**Q:** Jaké druhy chyb znáš a kdy nastávají?
**A:** Čtyři kategorie: **syntaktické** (porušení pravidel jazyka, chytí kompilátor), **sémantické** (program běží, ale počítá nesmysl — off-by-one, špatný vzorec), **typové** (špatný datový typ, v C# chytí kompilátor), **běhové / runtime výjimky** (něco neočekávaného za běhu — null reference, soubor nenalezen, výpadek sítě). První tři chytí compiler nebo IDE, runtime výjimky se řeší přes `try/catch`.

**Q:** Co je rozdíl mezi defensivním programováním a try/catch?
**A:** **Defensivní** = ověříš stav **PŘED** akcí, např. `if (File.Exists(...))`. Čitelné, ale má problém **race condition** — mezi if a akcí může jiný proces stav změnit (soubor smazat). **Try/catch** = necháš chybu nastat a chytíš ji. Robustnější proti race condition, ale méně explicitní. V praxi se kombinuje — typicky try/catch pro I/O a sítě, defensivní pro null kontroly.

**Q:** Co je výjimka a jak se propaguje?
**A:** Výjimka je **objekt typu `Exception`**, který se vyhodí (`throw`) při chybě. Pokud není v aktuální funkci zachycena přes `try/catch`, **jede nahoru zásobníkem volání** (call stack) až do funkce, která ji chytí. Pokud nikdo, **aplikace spadne**. Výhoda oproti návratovým kódům: nemůžeš ji tiše ignorovat.

**Q:** Co je `try / catch / finally`?
**A:** **`try`** = blok, kde čekáme problém. **`catch`** = co dělat při výjimce (lze mít víc catch pro různé typy, pořadí specifický → obecný). **`finally`** = proběhne vždy (úspěch i chyba), typicky úklid (zavřít stream, uvolnit zdroj). V C# alternativa: `using` block pro objekty implementující `IDisposable`.

**Q:** Co je breakpoint a jak ladění funguje?
**A:** Breakpoint je značka v IDE, kde se program **zastaví během běhu**. V tom okamžiku můžeš prohlédnout stav: hodnoty proměnných (přes Watch okno), call stack (kdo volal koho), pokračovat krokováním (**Step Over** = další řádek, **Step Into** = vleze do volané funkce, **Step Out** = dokončí aktuální funkci). Plus k tomu primitivnější `Console.WriteLine` pro rychlé debug výpisy.

**Q:** Co jsou unit testy a jak se liší od integračních a E2E?
**A:** **Unit test** testuje **jednu metodu/funkci izolovaně**, typicky pomocí mocků pro závislosti (DB, API). Rychlý (milisekundy), deterministický. **Integrační test** testuje **spolupráci modulů** (např. API → DB). Pomalejší, ale validuje, že komponenty do sebe zapadají. **E2E test** simuluje **reálného uživatele** (Cypress, Playwright klikají v prohlížeči), testuje celý průchod aplikací. Nejpomalejší a nejkřehčí. **Pyramida testů:** hodně unit, méně integračních, málo E2E.

**Q:** Co je mock a proč se používá v unit testech?
**A:** Mock je **falešný objekt** nahrazující reálnou závislost. Příklad: testuješ metodu, která volá databázi. Místo reálné DB (pomalá, závisí na stavu) podstrčíš mock, který vrací předem nadefinované hodnoty. Důvody: **rychlost** (žádné DB volání), **determinismus** (nezáleží na stavu DB), **izolace** (selhání DB nezpůsobí selhání testu funkce). C# knihovny: **Moq**, NSubstitute.

---

## Co bych ještě měl vědět (volně)

- **`throw`** vs **`throw ex`** v C# — první rethrowuje stejnou výjimku se zachovaným stack trace, druhý "resetuje" stack trace (špatně pro debugging)
- **Custom výjimky** — `public class MojeException : Exception` pro doménově-specifické chyby
- **Logging** — `ILogger<T>` v ASP.NET, Serilog, NLog pro produkční logování chyb
- **Try-Test-Driven Development (TDD)** — napsat test → napsat implementaci → refaktorovat
- **Assertion** — `Assert.Equal`, `Assert.Throws`, `Assert.True/False` v xUnit
- **Code coverage** — kolik % kódu pokrývá testy (nástroj: dotCover, OpenCover)

---

## Status

- **Sebehodnocení (před):** 3/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
