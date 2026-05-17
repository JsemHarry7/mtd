---
subject: SWI
number: 2
title: "Algoritmus"
tags: ["algoritmy", "složitost", "programování"]
share: public
status: review
speakingTime: 8
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> Algoritmus je **konečná posloupnost přesně definovaných kroků**, která pro daný vstup vede k požadovanému výstupu. V informatice je algoritmus to, co počítač **vykonává** — programovací jazyk je jen způsob, jak ho zapsat tak, aby mu rozuměl počítač. Slovo pochází od arabského matematika **al-Chvárizmího** (9. stol.).

---

## Klíčové pojmy

- **Algoritmus** — konečná řada kroků vedoucí ke splnění úkolu
- **Vlastnosti algoritmu** — univerzální požadavky, které musí splňovat (níže)
- **Zápis algoritmu** — způsob, jak ho zapíšu (slovně, vývojový diagram, pseudokód, programovací jazyk)
- **Časová složitost** — kolik kroků (operací) algoritmus provede v závislosti na velikosti vstupu `n`
- **Prostorová složitost** — kolik paměti zabere v závislosti na `n`
- **Asymptotická složitost / Big O notace** — `O(1)`, `O(log n)`, `O(n)`, `O(n²)`, `O(2ⁿ)` — jak se chová pro **velká** `n`
- **Best / worst / average case** — chování v nejlepším, nejhorším a průměrném případě

---

## Hlavní výklad (3–7 min mluvení)

### Vlastnosti algoritmu (musím vyjmenovat)

1. **Konečnost (finitnost)** — algoritmus musí v konečném čase skončit. Žádný nekonečný cyklus.
2. **Determinovanost (jednoznačnost)** — každý krok je jednoznačně určen, není v něm nejasnost. Při stejném vstupu algoritmus vždy projde **stejnými kroky**.
3. **Rezultativnost (výslednost)** — algoritmus **vrací výsledek** (výstup).
4. **Hromadnost (obecnost)** — řeší **třídu problémů**, ne jen jeden konkrétní vstup. Algoritmus výpočtu obvodu obdélníka funguje pro libovolné rozměry, ne jen pro 5 × 3.
5. **Vstup / Výstup** — má definovaný vstup (může být i prázdný) a alespoň jeden výstup.
6. **Správnost** — pro každý platný vstup vydá **správný** výsledek.
7. **Efektivnost** — provedení v rozumném čase a s rozumnými zdroji.

> ⚠️ Některé materiály uvádějí 5 vlastností, jiné 7 — kdykoliv to dovoluje, vyjmenuj **konečnost, determinovanost, rezultativnost, hromadnost, efektivnost** jako jádro a doplň správnost a vstup/výstup.

### Typy algoritmů

**Podle struktury** (jak se kroky řídí):
- **Lineární** — kroky následují za sebou, žádné větvení
- **Větvené** — obsahují podmínky (`if`, `switch`)
- **Cyklické (iterativní)** — opakují kroky cyklem (`for`, `while`)
- **Rekurzivní** — funkce volá sama sebe (např. faktoriál) — viz DAT 10

**Podle účelu** (co dělají):
- **Vyhledávací** — najít prvek (lineární vyhledávání, binární vyhledávání)
- **Řadící (třídící)** — seřadit data (bublinkové, výběrové, rychlé řazení)
- **Výpočetní** — spočítat hodnotu (faktoriál, druhá odmocnina)
- **Rozhodovací** — vybrat řešení / strategii

### Zápis algoritmu

| Forma | Popis | Pro koho |
|---|---|---|
| **Slovní popis** | věty v přirozeném jazyce | člověk, návrh |
| **Vývojový diagram (flowchart)** | grafické symboly (ovál = start/konec, obdélník = akce, kosočtverec = rozhodnutí, rovnoběžník = vstup/výstup) | člověk, dokumentace |
| **Strukturogram (Nassi-Shneiderman)** | obdélníkové bloky vnořené | učebnice, výuka |
| **Pseudokód** | mix přirozeného jazyka a programovacích konstrukcí | programátor mezi sebou |
| **Programovací jazyk** | konkrétní jazyk (C#, Python, …) | počítač |

### Algoritmická složitost — proč o tom mluvíme

Dva algoritmy mohou řešit ten samý problém, ale **jinak rychle**. Při velkém vstupu (`n = 10⁶`) je rozdíl mezi `O(n)` a `O(n²)` rozdíl mezi sekundou a hodinou.

**Big O notace** popisuje **chování pro velká `n`** — abstrahuje od konstant a méně rostoucích členů.

| Notace | Název | Příklad |
|---|---|---|
| `O(1)` | konstantní | přímý přístup k poli `arr[5]`, Gauss vzorec |
| `O(log n)` | logaritmická | binární vyhledávání |
| `O(n)` | lineární | lineární vyhledávání, jeden cyklus přes pole |
| `O(n log n)` | linearitmická | rychlé řazení, merge sort |
| `O(n²)` | kvadratická | bublinkové řazení, dvojitý vnořený cyklus |
| `O(2ⁿ)` | exponenciální | naivní rekurze pro Fibonacci |
| `O(n!)` | faktoriálová | hrubou silou problém obchodního cestujícího |

**Best / worst / average case:**
- *Best case* — nejlepší možný vstup (např. pole už je seřazené)
- *Worst case* — nejhorší vstup (pole je seřazené pozpátku)
- *Average case* — typický vstup
- Pokud někdo řekne jen "složitost je `O(n²)`", bez upřesnění se obvykle myslí **worst case**.

---

## Konkrétní příklady / kód

### Tentýž problém, dva algoritmy — `O(n)` vs. `O(1)`

Spočítej součet `1 + 2 + … + n`.

```csharp
// Algoritmus 1 — cyklus, lineární složitost O(n)
int Soucet1(int n) {
    int s = 0;
    for (int i = 1; i <= n; i++) {
        s += i;
    }
    return s;
}

// Algoritmus 2 — Gauss vzorec, konstantní složitost O(1)
int Soucet2(int n) {
    return n * (n + 1) / 2;
}
```

Pro `n = 10⁹`:
- `Soucet1` udělá **miliardu** sčítání — sekundy až minuta
- `Soucet2` udělá **3 operace** (násobení, sčítání, dělení) — okamžitě

**Stejný výsledek, dramaticky jiná efektivita.** Tohle je hlavní důvod, proč o složitosti mluvíme.

### Vlastnosti — co se stane, když některá chybí

```csharp
// Porušená KONEČNOST — nekonečný cyklus
while (true) { Console.WriteLine("..."); }

// Porušená DETERMINOVANOST — náhoda v kroku
if (new Random().Next(2) == 0) doX(); else doY();
// Pro stejný vstup může vrátit různý výsledek
```

### Vývojový diagram — symboly

```
  ⬭  start / konec
  ▭  výpočet / akce
  ◇  rozhodnutí (podmínka — z něj jdou 2+ šipky)
  ▱  vstup / výstup
  →  tok řízení
```

---

## Vztahy / kontrasty

- **Algoritmus vs. program:** Algoritmus je **abstraktní** popis řešení. Program je **konkrétní** zápis algoritmu v programovacím jazyce.
- **Algoritmus vs. heuristika:** Algoritmus dává **zaručeně správný** výsledek. Heuristika je **přibližný** postup, který obvykle funguje rychle, ale nemusí dát optimum (např. odhad cesty na mapě).
- **Algoritmus vs. funkce (matematicky):** Funkce je vztah vstup→výstup; algoritmus je **postup**, jak k tomu výstupu dojít.
- **Iterace vs. rekurze:** Většinu rekurzivních algoritmů lze přepsat na iterativní (cyklem) a naopak. Rekurze je často **čitelnější**, iterace bývá **rychlejší a paměťově úspornější** (rekurze plní zásobník volání).

---

## Časté otázky komise

**Q:** Vyjmenuj alespoň 5 vlastností algoritmu.
**A:** Konečnost, determinovanost (jednoznačnost), rezultativnost (výslednost), hromadnost (obecnost), efektivnost. Volitelně správnost a vstup/výstup.

**Q:** Co znamená `O(n²)` a kdy ho potkáš?
**A:** Kvadratická složitost — počet operací roste s druhou mocninou velikosti vstupu. Typicky **dva vnořené cykly** přes stejnou kolekci, např. bublinkové řazení nebo porovnání každého prvku s každým.

**Q:** Jak se algoritmus dá zapsat?
**A:** Slovně, vývojovým diagramem (flowchart), strukturogramem, pseudokódem nebo přímo v programovacím jazyce. Volba závisí na cíli (návrh × dokumentace × spuštění).

**Q:** Proč potřebujeme algoritmickou složitost, když máme rychlé počítače?
**A:** Protože při velkých datech (databáze, big data) **konstanty rostou pomaleji než velikost vstupu**. Algoritmus `O(n²)` na milionu prvků udělá `10¹²` operací — i miliardová cena CPU to neujme.

**Q:** Jaký je rozdíl mezi algoritmem a programem?
**A:** Algoritmus je abstraktní postup nezávislý na jazyce. Program je konkrétní implementace algoritmu v určitém programovacím jazyce.

**Q:** Co je rekurze a kdy se vyplatí?
**A:** Rekurze = funkce volá sama sebe. Musí mít **ukončovací podmínku** (jinak StackOverflow). Vyplatí se u problémů s **přirozenou hierarchií** — strom, faktoriál, dělení a panování. (Detail viz DAT 10 — podprogramy a lambda.)

---

## Co bych ještě měl vědět (volně)

- **Determinismus vs. nedeterminismus:** Většina běžných algoritmů je deterministická. Existují i **randomizované** algoritmy (používají náhodu vědomě, např. quicksort s náhodným pivotem) — tam determinovanost neplatí ve striktním smyslu, ale očekávané chování je zaručené.
- **Pojmenování v hlavě:** *Konečnost = "doběhne"*, *determinovanost = "stejně"*, *rezultativnost = "vrátí"*, *hromadnost = "obecně"*, *efektivnost = "rychle"*.
- **Big O ignoruje konstanty:** Algoritmus, který udělá `100n + 50` operací, je pořád `O(n)`. Big O sleduje **trend růstu**, ne přesný počet.
- **Související pojmy z xlsx:** *zápis* a *vlastnosti* jsou v Popisu, *typy algoritmů* nejsou — tvé poznámky z hodiny je ale řeší, takže se hodí mít v záloze.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Některé české zdroje uvádějí jako vlastnost **vstupnost** místo *vstup/výstup*. V tvých vlastních poznámkách z hodiny je "vstupnost" ("ochrana před programátorskými zlozvyky"). Neobvyklý termín — pokud by se učitel ptal, řekni "vstupnost = algoritmus má definované vstupy". Standardní formulace ale je *vstup/výstup*.
- ⚠️ "Hromadnost" vs. "obecnost" — synonyma, používá se obojí. Tvé poznámky z hodiny říkají "obecnost".
- ⚠️ Pojmenování složitostí (`O(log n)`, `O(n log n)`) **není** ve tvých zápiscích z hodiny — doplněno z obecných znalostí. Učitel SWI standardně tuhle nomenklaturu chce, ale ověř si jeho preferované příklady (např. zda chce konkrétně bublinkové řazení nebo jiný).

---

## Status

- **Sebehodnocení (před):** 3/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-08
