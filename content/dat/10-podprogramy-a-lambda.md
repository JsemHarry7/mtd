---
subject: DAT
number: 10
title: "Podprogramy a lambda funkce"
tags: ["programování", "c-sharp"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Podprogram** je oddělená, pojmenovaná část kódu, kterou voláme opakovaně. Jeho cílem je **dekompozice** — rozdělení složitého problému na menší, srozumitelné a opakovaně použitelné části. Podle toho, zda vrací výsledek, rozlišujeme **funkci** (vrací) a **proceduru** (nevrací). V objektově orientovaném programování se podprogram uvnitř třídy nazývá **metoda**. Moderní jazyky umí podprogram zapsat i bez jména — jako **lambda funkci** — a předat ji jako parametr jiné funkci.

---

## Klíčové pojmy

- **Podprogram** — pojmenovaná část kódu vykonávající jeden konkrétní úkol (= funkce / procedura / metoda)
- **Funkce** — podprogram, který vrací hodnotu (`int`, `string`, …); musí mít `return`
- **Procedura** — podprogram bez návratové hodnoty; v C#/Javě označen `void`
- **Metoda** — funkce / procedura uvnitř třídy (OOP)
- **Parametr (argument)** — vstup do podprogramu
- **Návratová hodnota** — výstup z funkce (`return`)
- **Předávání hodnotou** — podprogram dostane *kopii* proměnné
- **Předávání referencí** — podprogram dostane *adresu* na originál (`ref`, `out`)
- **Obor platnosti (scope)** — odkud je proměnná viditelná
- **Lambda funkce** — anonymní funkce v krátkém zápisu `(parametry) => výraz`
- **Delegát** — proměnná držící odkaz na funkci (typový předpis pro funkce)
- **Funkce vyššího řádu** — funkce, která bere funkci jako parametr nebo ji vrací
- **Rekurze** — funkce volající sama sebe; nutná **ukončovací podmínka**

---

## Hlavní výklad (5–10 min mluvení)

### 1. Co je podprogram a proč ho píšeme

Podprogram skládáme ze tří částí:
- **Vstupy** — parametry (argumenty), se kterými pracuje
- **Tělo** — kód, logika
- **Výstup** — návratová hodnota přes `return` (volitelně)

Důvody, proč program rozdělit do podprogramů:
1. **Dekompozice** — složitý problém rozložím na menší
2. **Opakovanost** — kus kódu mám napsaný jednou, volám ho mnohokrát (DRY = *Don't Repeat Yourself*)
3. **Čitelnost** — pojmenovaná akce (`SoucetDoN(10)`) je srozumitelnější než inline cyklus
4. **Testovatelnost** — malou funkci snadno otestuji izolovaně

### 2. Funkce × procedura

| | Funkce | Procedura |
|---|---|---|
| Vrací hodnotu | **Ano** | Ne |
| `return` | povinné, s hodnotou | nepovinné (`return;` nebo žádný) |
| V C#/Javě | typovaná: `int`, `string`, … | `void` |
| Příklad | `int Secti(int a, int b)` | `void Pozdrav()` |

V OOP (C#, Java) jsou všechny podprogramy **uvnitř tříd** → říkáme jim **metody**. V *top-level statements* moderního C# (od C# 9) můžeš metody psát i bez třídy.

### 3. Parametry — předávání hodnotou × referencí

#### Předávání hodnotou (default)
- Vytvoří se **lokální kopie** proměnné
- Funkce pracuje jen s kopií
- Změna uvnitř funkce **neovlivní** originál
- **Originál zůstává čistý**

#### Předávání referencí
- Funkce dostane **adresu** v paměti
- Pracuje přímo s originálem
- Změna **se ihned projeví venku**
- V C# se vyznačuje klíčovými slovy:
  - **`ref`** — funkce může číst i měnit; proměnná musí být inicializovaná před voláním
  - **`out`** — funkce musí do parametru zapsat; proměnná nemusí být inicializovaná
  - Klasický příklad `out`: `int.TryParse(input, out int cislo)` — vrací `bool` (úspěch) a přes `out` převedené číslo

### 4. Obor platnosti (scope)

Definuje, **odkud v kódu je proměnná viditelná**.

- **Globální** — dostupná v celé třídě / projektu, mění ji odkudkoliv kdokoliv (rizikové)
- **Lokální:**
  - **Funkční** — platí jen uvnitř funkce
  - **Bloková** — platí jen uvnitř `{ … }` (např. `for`, `if`, `while`); po opuštění bloku proměnná zaniká, paměť se uvolní
- **Hoisting** (typické pro JavaScript) — proměnná se *vynese* na začátek scope; lze ji použít před deklarací, ale s hodnotou `undefined`. **C# hoisting nepodporuje** — proměnná musí být deklarovaná před použitím.
- **Closure** — funkce si **pamatuje prostředí**, ve kterém vznikla, i když to prostředí už zaniklo. Lambda v C# si "uzavírá" lokální proměnné z okolního scope. Umožňuje to mít privátní stav.

### 5. Způsoby zápisu funkce

#### Pojmenovaná funkce (klasika)
```csharp
int Secti(int x) {
    return x + 1;
}
```

#### Anonymní funkce (delegate keyword)
```csharp
delegate(int x) { return x + 1; }
```
Nemá jméno. Vytváří se inline, předává se proměnné nebo jiné funkci.

#### Lambda funkce (arrow funkce)
```csharp
x => x + 1
```
Nejkratší zápis anonymní funkce. Pro víc parametrů `(a, b) => a + b`. Pro víc řádků těla `(a, b) => { ... return ...; }`. **Nevytváří vlastní `this` kontext** (na rozdíl od běžných funkcí v JS) — přebírá ten z okolí.

### 6. Delegát a funkce vyššího řádu

**Delegát** = proměnná, která drží **odkaz na funkci**. Je to typový předpis: *"sem patří jen funkce, které berou tyto parametry a vrací tento typ."*

```csharp
Func<int, int> mojeFunkce = x => x * 2;
int vysledek = mojeFunkce(5);  // 10
```

`Func<int, int>` = generický delegát, který bere `int` a vrací `int`.

**Funkce vyššího řádu** = funkce, která **přijímá funkci jako parametr** nebo **funkci vrací**. Klasika v C#:

```csharp
List<int> cisla = new List<int> { 1, 2, 3, 4, 5 };
var sude = cisla.Where(x => x % 2 == 0);  // vrací 2, 4
```

`Where` je funkce vyššího řádu z LINQ, lambda `x => x % 2 == 0` je její argument.

### 7. Rekurze

**Rekurze** = funkce volá sama sebe. Slouží jako alternativa k cyklům, používá se hlavně u problémů s **přirozenou hierarchií** (strom, dělení a panování, faktoriál).

**Dvě nutné části:**
1. **Ukončovací podmínka** (base case) — kdy se má rekurze zastavit
2. **Rekurzivní volání** — voláme sebe s **jinými** (typicky menšími) daty

Bez ukončovací podmínky → **StackOverflowException** (každé volání zabírá místo na zásobníku, dojde paměť).

```csharp
int Faktorial(int n) {
    if (n <= 1) return 1;            // ukončovací podmínka
    return n * Faktorial(n - 1);     // rekurzivní volání s menším n
}
// Faktorial(5) = 5 * Faktorial(4) = 5 * 4 * Faktorial(3) = ... = 5*4*3*2*1 = 120
```

---

## Konkrétní příklady / kód

### Funkce vs procedura
```csharp
// funkce — vrací hodnotu
int Secti(int a, int b) {
    return a + b;
}

// procedura — nevrací nic
void Pozdrav(string jmeno) {
    Console.WriteLine($"Ahoj, {jmeno}");
}
```

### Hodnotou × referencí
```csharp
int x = 10;
ZkusZmenit(x);              Console.WriteLine(x);  // 10 — originál nezměněn
ZmenNaOriginalu(ref x);     Console.WriteLine(x);  // 999 — originál změněn

void ZkusZmenit(int p)        { p = 999; }
void ZmenNaOriginalu(ref int p) { p = 999; }
```

### Lambda v praxi (LINQ)
```csharp
var cisla = new List<int> { 5, 2, 8, 1, 9, 3 };
var sudaSerazena = cisla
    .Where(x => x % 2 == 0)        // lambda jako filtr
    .OrderBy(x => x)               // lambda jako klíč pro řazení
    .ToList();                      // → { 2, 8 }
```

### Rekurze — faktoriál
```csharp
int Faktorial(int n) {
    if (n <= 1) return 1;
    return n * Faktorial(n - 1);
}
```

---

## Vztahy / kontrasty

- **Funkce × procedura:** funkce **vrací**, procedura **vykonává**. V matematicé tradici je funkce čistá (`y = f(x)`), procedura má vedlejší efekty (vypsat, zapsat do souboru).
- **Iterace × rekurze:** většina rekurzivních algoritmů jde přepsat na cyklus a naopak. Rekurze je **čitelnější** u stromových struktur, iterace je **paměťově úspornější** (nezatěžuje zásobník volání).
- **Pojmenovaná × lambda:** pojmenovaná funkce má vlastní jméno a deklaraci, používáš ji opakovaně. Lambda je **jednorázová**, předaná jako argument. Když by se ti lambda opakovala 3× v kódu, vytáhni ji do pojmenované funkce.
- **Hodnotou × referencí (C# specifické):** value typy (`int`, `double`, `bool`, `struct`) se předávají kopií. Reference typy (`string`, pole, třídy) se předávají kopií **reference** — obě strany ukazují na stejný objekt, takže změna *vnitřku* objektu je viditelná. Tohle je častý zdroj zmatku.

---

## Časté otázky komise

**Q:** Jaký je rozdíl mezi funkcí a procedurou?
**A:** Funkce vrací hodnotu (má návratový typ a `return`). Procedura nevrací nic, jen provede akci — v C#/Javě se značí klíčovým slovem `void`.

**Q:** Co je předávání hodnotou a co předávání referencí?
**A:** Hodnotou — funkce dostane kopii, originál se nemění. Referencí — funkce dostane adresu na originál, jeho změny zůstávají i venku. V C# se reference vyžadují klíčovým slovem `ref` nebo `out`.

**Q:** K čemu slouží `out` parametr a uveď příklad.
**A:** `out` je reference, do které **musí** funkce zapsat. Používá se, když potřebuje funkce vrátit víc než jednu hodnotu. Příklad: `int.TryParse(input, out int cislo)` — vrací `bool` o úspěchu a přes `out` převedené číslo.

**Q:** Co je lambda funkce a kdy ji použiju?
**A:** Anonymní funkce v krátkém zápisu `parametr => výraz`. Používám ji, když potřebuji **jednorázovou** logiku jako argument jiné funkci — typicky filtrace v LINQ (`Where`, `Select`, `OrderBy`).

**Q:** Co je rekurze a co se stane, když nemá ukončovací podmínku?
**A:** Rekurze je situace, kdy funkce volá sama sebe. Bez ukončovací podmínky volá nekonečně, každé volání obsadí místo na zásobníku, až dojde paměť — vyhodí se **StackOverflowException**.

**Q:** Co je obor platnosti (scope)?
**A:** Pravidlo, odkud v kódu je proměnná viditelná. Globální = celá třída/projekt. Lokální funkční = jen uvnitř funkce. Lokální bloková = jen uvnitř bloku `{ }`. Po opuštění scope proměnná zaniká.

**Q:** Co je delegát a co funkce vyššího řádu?
**A:** Delegát je proměnná držící odkaz na funkci — typový předpis, jaké funkce do ní pasují. Funkce vyššího řádu je funkce, která bere jinou funkci jako parametr nebo ji vrací (např. LINQ `Where`).

---

## Co bych ještě měl vědět (volně)

- **Přetížení (overloading):** v jedné třídě můžu mít víc metod **se stejným jménem**, pokud se liší **počtem nebo typy parametrů**. C# vybere správnou variantu podle volání. *(Patří hlavně k SWI 9 OOP.)*
- **Default parametry:** parametr může mít defaultní hodnotu — `int Secti(int a, int b = 0)`. Když se nepošle, použije se default.
- **`params` keyword:** parametr přijímající **proměnný počet argumentů** — `void Vypis(params int[] cisla)`. Volá se `Vypis(1, 2, 3)`.
- **Funkcionální programování:** styl, kde se s funkcemi pracuje jako s daty (předávají se, vracejí, skládají). Jazyky F#, Haskell, ale i C# díky LINQ a lambdám podporuje funkcionální prvky.
- **Stack vs. heap:** lokální proměnné value typů žijí na **zásobníku** (stack), reference typy na **haldě** (heap). Rekurze plní zásobník — proto StackOverflow.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Hoisting** je v tvých zápiscích uveden jako podtéma scope. To je **JavaScript-specifické** — v C# hoisting **nefunguje**. Učitel ho v PRG kontextu může zmínit jako srovnání ("v JS to je takhle, v C# ne"), ale není to klíčové C# pravidlo.
- ⚠️ **Closure** — v tvých zápiscích zmíněna. V C# lambda **uzavírá** lokální proměnné automaticky — když lambda v sobě používá proměnnou z okolního scope, drží na ni "skrytou referenci" i poté, co metoda skončí. To je téma na pomezí lambda a scope; učitel ho buď zmíní, nebo ne. Pokud mě komise pichne *"co je closure?"*, řeknu: *"Funkce, která si pamatuje proměnné z prostředí, kde vznikla — i když to prostředí už zaniklo."*
- ⚠️ **Funkcionální programování** uvedeno v hodina-poznámkách jen okrajově (F#, Excel). Můj odhad: učitel po něm jako po hlavním tématu nepůjde, ale na *"znáte funkcionální paradigma?"* mít připravenou jednu větu.

---

## Status

- **Sebehodnocení (před):** 2/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-08
