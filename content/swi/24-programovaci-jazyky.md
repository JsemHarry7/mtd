---
subject: SWI
number: 24
title: "Programovací jazyky"
tags: ["programování", "c-sharp", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**Programovací jazyk** je **formální jazyk pro zápis algoritmů** — instrukce pro počítač. Dělíme podle **úrovně** (nízko vs vysoko-úrovňové), **způsobu zpracování** (kompilované vs interpretované vs hybridní), **paradigmatu** (imperativní, OOP, funkcionální) a **syntaxe** (C-derived, odsazovací). Hybridní jazyky jako **C# a Java** kombinují výhody obou — zdroják se kompiluje do **mezikódu**, ten běží na **virtuálním stroji** (CLR/JVM) a **JIT compiler** ho převede na nativní strojový kód za běhu.

---

## Klíčové pojmy

- **Programovací jazyk** — formální jazyk pro zápis algoritmů
- **Syntaxe** — pravidla, jak se kód píše
- **Sémantika** — význam zapsaného kódu
- **Klíčová slova (keywords)** — rezervovaná slova s speciálním významem
- **Kompilátor (compiler)** — celý kód → strojový kód
- **Interpret** — kód se vykonává řádek po řádku za běhu
- **JIT (Just-In-Time)** — překlad mezikódu na strojový kód za běhu
- **AOT (Ahead-Of-Time)** — překlad před spuštěním
- **Mezikód (IL, Bytecode)** — mezijazyk mezi zdrojákem a strojovým kódem
- **CLR (Common Language Runtime)** — VM pro .NET
- **JVM (Java Virtual Machine)** — VM pro Javu
- **Paradigma** — způsob myšlení o programu (imperativní/OOP/funkcionální)
- **Multiplatformnost** — schopnost běžet na různých OS

---

## Hlavní výklad

### 1. Co je programovací jazyk

**Formální jazyk pro zápis algoritmů** — prostředek, kterým dáváme instrukce počítači.

**Lexikální struktura:**
- **Klíčová slova (keywords)** — rezervovaná slova s speciálním významem (`if`, `while`, `class`, `public`)
- **Syntaxe** — pravidla psaní (závorky, středníky, odsazení)
- **Sémantika** — význam (co kód dělá)

**Úroveň jazyka:**

| Úroveň | Charakter | Příklady |
|---|---|---|
| **Nízkoúrovňové** | Blízko hardwaru | Assembler, strojový kód |
| **Vysokoúrovňové** | Srozumitelné pro člověka | C#, Python, Java |
| **Esoterické** | Pro zábavu / pokus | Brainfuck |

### 2. Rozdělení dle způsobu zpracování

**Klíčová otázka:** jak se dostane text, co napíšeš, do procesoru?

#### Kompilované jazyky
- **C, C++, Pascal, Rust**
- **Kód se celý najednou přeloží** do strojového kódu pro konkrétní procesor
- **Chyby** se objeví **při kompilaci**
- **Výhody:** rychlost (běží přímo na HW), optimalizace
- **Nevýhody:** kompilace pro každý OS zvlášť, při změně kódu nutnost rekompilace

#### Interpretované jazyky
- **Python, PHP, JavaScript** (původně, dnes JIT)
- **Interpretuje se za běhu**, postupně řádek po řádku
- Jazyk **nahlásí chyby až v okamžiku**, kdy na ně narazí
- **Výhody:** přenositelnost, flexibilita, rychlý vývoj (žádná kompilace)
- **Nevýhody:** pomalejší, chyby se objeví až za běhu

#### Hybridní (manažované) jazyky
- **C#, Java, Kotlin**
- Kombinují oba principy:
  1. Zdroják se **kompiluje do mezikódu** (IL pro .NET, Bytecode pro Javu)
  2. Mezikód spustí **VM (Virtual Machine)** — CLR pro .NET, JVM pro Javu
  3. VM ho přes **JIT (Just-In-Time)** kompiluje na nativní strojový kód **ve chvíli, kdy je to potřeba**

**Výhody hybrid:** multiplatformnost (mezikód běží všude, kde je VM) + rychlost (JIT optimalizuje pro aktuální hardware).

### 3. Paradigmata

Většina **moderních jazyků je multi-paradigmatických** (C# umí OOP, funkcionální i imperativní).

| Paradigma | Princip | Jazyky |
|---|---|---|
| **Imperativní** | Krok za krokem, GOTO | BASIC, C |
| **Objektově orientované (OOP)** | Objekty s atributy a metodami | C#, Java, Python |
| **Funkcionální** | Vychází z matematiky, funkce | F#, Haskell, Excel |
| **Logické** | Pravidla a fakta | Prolog |

### 4. Procedurální × neprocedurální

**Procedurální** — píšeš **krok za krokem**, **CO se má stát**:
- **Strukturované jazyky** (C, Pascal) — pořádek, logické bloky, cykly/podmínky/sekvence, kód shora dolů
- **OOP** (C++, C#, Java, Python) — svět plný objektů, které komunikují. Objekt má **vlastnosti** a **metody**.

**Neprocedurální** — **deklarativní přístup**, píšeš **CO chceš získat**, neřešíš JAK:
- **Funkcionální** (Haskell, F#, Excel) — vše je matematický výpočet
- **SQL** — deklarativní query jazyk

### 5. Syntaxe (jak jazyk vypadá)

| Styl | Charakter | Jazyky |
|---|---|---|
| **C-derived** | Závorky `{}`, středníky `;` | C, C++, C#, Java, JavaScript, PHP |
| **Odsazovací** | Logika přes odsazení (tab/mezery) | Python |
| **Keyword-based** | `begin ... end` | Pascal, Lua |
| **Skriptovací** | Příkazy | Bash, PowerShell |
| **SQL** | Deklarativní | SQL |

### 6. Architektura .NET

**.NET** je platforma od Microsoftu. Komponenty:

| Verze | Charakter |
|---|---|
| **.NET Framework** | Starší, jen Windows (dnes legacy) |
| **.NET (Core)** | Moderní, rychlý, **multiplatformní** (Windows/Linux/Mac) |
| **Mono** | Open-source implementace, umožnila C# na mobilech |

**Klíčové komponenty .NET:**

- **CLR (Common Language Runtime)** — VM, spravuje běh kódu, garbage collector, JIT
- **IL (Intermediate Language)** — mezikód (C# kompilace → IL)
- **JIT compiler** — IL → native machine code za běhu
- **BCL (Base Class Library)** — standardní knihovna

**Flow kompilace C# aplikace:**

```
C# zdroják (.cs)
    ↓ Roslyn kompilátor
IL mezikód (.dll / .exe)
    ↓ CLR načte, JIT překládá
Strojový kód (CPU instructions)
    ↓ vykoná procesor
```

**Využití .NET:**
- **ASP.NET** — webové aplikace
- **MAUI / Xamarin** — mobilní aplikace (iOS/Android)
- **Unity** — herní engine (C#)
- **WPF / WinForms** — desktop aplikace

### 7. Multiplatformnost

**Multiplatformnost** = schopnost jazyka/aplikace běžet na různých OS.

| Přístup | Jak | Příklady |
|---|---|---|
| **Kompilace pro každý OS zvlášť** | Cross-compile binárek | C, C++, Rust, Go |
| **Mezikód + VM** | Mezikód běží všude, kde je VM | .NET, Java |
| **Interpret** | Stačí mít interpret pro OS | Python, JavaScript |
| **WebAssembly** | Kód v prohlížeči, OS-agnostic | Rust, C++ → WASM |

**.NET multiplatformnost:**
- Kompilace na **mezikód (IL)** — stejné `.dll` na Windows i Linux
- CLR existuje pro Win/Mac/Linux → IL běží všude
- Plus **AOT compilation** (od .NET 7) — předkompilovaný native binary pro produkční nasazení

---

## Konkrétní příklady

### Kompilace vs interpretace

```csharp
// C# (hybrid)
int x = 5;
Console.WriteLine(x);
// → Kompilace do IL
// → CLR načte, JIT → machine code
// → Procesor vykoná
```

```python
# Python (interpret)
x = 5
print(x)
# → Interpret čte řádek
# → Vykoná příkaz, pokračuje
```

```c
// C (kompilace)
int x = 5;
printf("%d", x);
// → gcc kompiluje na native binary (.exe / ELF)
// → Procesor přímo vykonává
```

### Mezikód v C#

```csharp
// C# zdroják
public int Add(int a, int b) => a + b;
```

```il
// IL po kompilaci (zjednodušeně)
.method public int32 Add(int32 a, int32 b)
{
    ldarg.1
    ldarg.2
    add
    ret
}
```

CLR pak IL přečte a JIT ho převede na konkrétní x86/ARM instrukce dle CPU.

---

## Vztahy / kontrasty

- **Kompilace × interpretace × hybrid:** rychlost × přenositelnost × kompromis (multiplatformnost + rychlost)
- **CLR × JVM:** .NET × Java VM. Princip stejný (mezikód + JIT).
- **IL × Bytecode:** mezikód v .NET × mezikód v Javě
- **JIT × AOT:** překlad za běhu × před spuštěním. JIT optimalizuje pro aktuální HW, AOT je rychlejší start
- **Procedurální × deklarativní:** jak × co. "Iteruj a sčítej" × "vrať součet všech".
- **OOP × funkcionální:** stav v objektech × neměnnost a funkce. Hybridní jazyky umí oba.

---

## Časté otázky komise

**Q:** Co je programovací jazyk?
**A:** **Formální jazyk pro zápis algoritmů** — prostředek, kterým dáváme instrukce počítači. Má **syntaxi** (pravidla psaní — závorky, středníky), **sémantiku** (význam) a **klíčová slova** (rezervovaná slova jako `if`, `while`, `class`). Dělíme podle **úrovně** (nízko/vysoko), **způsobu zpracování** (kompilace/interpret/hybrid) a **paradigmatu**.

**Q:** Jaký je rozdíl mezi kompilovaným a interpretovaným jazykem?
**A:** **Kompilovaný** (C, C++, Pascal, Rust) — celý kód se **najednou přeloží** do strojového kódu pro konkrétní procesor. Chyby při kompilaci. Rychlý běh, ale rekompilace pro každý OS. **Interpretovaný** (Python, PHP) — kód se **vykonává za běhu**, řádek po řádku. Chyby až v běhu. Pomalejší, ale přenositelný a flexibilní.

**Q:** Co jsou hybridní/manažované jazyky?
**A:** **C#, Java, Kotlin.** Kombinují kompilaci a interpretaci: 1) Zdroják se **kompiluje do mezikódu** (IL pro .NET, Bytecode pro Javu). 2) Mezikód spustí **virtuální stroj (VM)** — CLR pro .NET, JVM pro Javu. 3) VM přes **JIT (Just-In-Time)** kompiluje na nativní strojový kód za běhu. Výhody: **multiplatformnost** (mezikód běží všude, kde je VM) + **rychlost** (JIT optimalizuje pro aktuální hardware).

**Q:** Co je mezikód a k čemu slouží?
**A:** **Mezijazyk** mezi zdrojákem a strojovým kódem. V .NET se jmenuje **IL (Intermediate Language)**, v Javě **Bytecode**. Vznikne kompilací zdrojáku. Není pro konkrétní procesor — je univerzální. **VM (CLR/JVM)** ho čte a přes JIT compiler ho převede na nativní instrukce pro aktuální CPU. Důvod: **multiplatformnost** — stejné `.dll` běží na Windows, Linuxu i Macu.

**Q:** Jaké jsou hlavní programovací paradigmata?
**A:** **Imperativní** — krok za krokem (C, BASIC). **Objektově orientované (OOP)** — svět objektů s vlastnostmi a metodami (C#, Java, Python). **Funkcionální** — vše je matematický výpočet, funkce (F#, Haskell, Excel). **Logické** — pravidla a fakta (Prolog). Většina moderních jazyků je **multi-paradigmatických**.

**Q:** Co je procedurální vs deklarativní programování?
**A:** **Procedurální** — píšeš **KROK ZA KROKEM, CO se má stát** (C, Pascal, OOP). **Deklarativní** — píšeš **CO chceš získat, neřešíš JAK** (SQL, Haskell, F#, Excel). Konkrétně SQL: `SELECT * FROM users WHERE age > 18` — neříkáš, jak má DB hledat, jen co chceš. DB query planner vybere algoritmus sám.

**Q:** Jaká je architektura .NET?
**A:** .NET je platforma od Microsoftu. **Verze:** .NET Framework (legacy, Windows-only), **.NET (Core)** moderní multiplatformní (Windows/Linux/Mac), **Mono** open-source. **Klíčové komponenty:** **CLR (Common Language Runtime)** = VM která spravuje běh kódu + garbage collector + JIT, **IL (Intermediate Language)** = mezikód, **JIT compiler** převede IL na native machine code za běhu, **BCL (Base Class Library)** = standardní knihovna. **Využití:** ASP.NET (web), MAUI/Xamarin (mobil), Unity (hry), WPF (desktop).

**Q:** Co je JIT a AOT compilation?
**A:** **JIT (Just-In-Time)** — překlad mezikódu na nativní kód **za běhu**, právě v okamžiku, kdy je metoda volaná poprvé. Optimalizuje pro aktuální CPU. Pomalejší startup, rychlejší stabilní běh. **AOT (Ahead-Of-Time)** — překlad **před spuštěním** (kompilace už dělá native binary). Rychlejší startup, menší flexibility. .NET 7+ podporuje AOT pro production nasazení.

---

## Status

- **Sebehodnocení (před):** 4/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-18
