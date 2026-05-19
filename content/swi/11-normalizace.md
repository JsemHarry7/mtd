---
subject: SWI
number: 11
title: "Normalizace databáze"
tags: ["databáze", "sql", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**Normalizace** je **postup návrhu relační databáze**, který **omezuje redundanci** (duplicitní data) a **chrání před anomáliemi** při práci s daty (insert, update, delete). Probíhá v **normálních formách** — 1NF (atomické hodnoty) → 2NF (závislost na celém klíči) → 3NF (bez tranzitivních závislostí) → BCNF (přísnější 3NF). V praxi se kombinuje s **denormalizací** pro výkon — kompromis mezi konzistencí a rychlostí čtení.

---

## Klíčové pojmy

- **Normalizace** — postup snižování redundance
- **Redundance** — duplikování dat na víc místech
- **Anomálie** — update / insert / delete problémy
- **Funkční závislost (FD)** — `X → Y` = hodnota X určuje hodnotu Y
- **Primární klíč (PK)** — jednoznačný identifikátor řádku
- **Kandidátní klíč** — minimální množina atributů určující řádek
- **Složený klíč** — PK z více sloupců
- **Neklíčový atribut** — atribut není součástí žádného kandidátního klíče
- **Tranzitivní závislost** — `PK → A → B` (přes mezičlánek A)
- **Superklíč** — jakákoli množina, která jednoznačně určuje řádek
- **OLTP / OLAP** — produkční × analytické zpracování
- **Denormalizace** — schválné porušení normalizace pro výkon

---

## Hlavní výklad

### 1. Proč normalizovat — 3 anomálie

Bez normalizace vznikají problémy:

| Anomálie | Co se rozbije |
|---|---|
| **Update anomálie** | Jednu informaci musíš měnit na **víc místech** (a někde zapomeneš → nekonzistence) |
| **Insert anomálie** | Nelze vložit část informací **bez jiné** (zákazník bez objednávky neexistuje) |
| **Delete anomálie** | Smazáním řádku omylem **smažeš i informaci**, kterou chceš zachovat |

**Cíl normalizace:** každá informace existuje **přesně na jednom místě**.

### 2. OLTP vs OLAP — kde se normalizace používá

**OLTP (Online Transaction Processing)** — produkční aplikace (e-shop, banka):
- Hodně CRUD, hodně zápisů
- Důraz na **konzistenci** a transakce
- DB bývá **více normalizovaná**
- Nevýhoda: pro čtení často víc JOINů

**OLAP (Online Analytical Processing)** — analytika, reporting:
- Data jsou "připravená", často ve velkých tabulkách
- Důraz na **rychlé čtení a agregace**
- Častá **denormalizace** (méně JOINů)

**Workflow v praxi:** zapisuješ do OLTP → pravidelně přesouvá/transformuje do OLAP → odtud se čte pro reporty.

### 3. Funkční závislost (FD)

**`X → Y`** = "hodnota X určuje hodnotu Y" (jednoznačně, deterministicky).

Příklad: `student_id → jmeno` (jeden student má jedno jméno).

**Triviální FD:** `X → X` (sama na sebe). Zajímavé jsou jen **netriviální**.

### 4. Normální formy

#### 0NF — nenormalizovaná (neoficiální)
"Všechno v jedné tabulce", **vícenásobné hodnoty** v jednom sloupci, opakující se skupiny.

#### 1NF — atomické hodnoty
**Pravidlo:** každý sloupec obsahuje **JEDNU atomickou hodnotu** (ne seznam, ne víc věcí v jednom poli).

❌ **Špatně:** `Name = "Honza Hyxa"` (mix dvou údajů) nebo `telefony = "123,456,789"` (seznam)

✅ **Správně:** `FirstName`, `LastName`. Pro více telefonů → samostatná tabulka `Telefon(id, person_id, cislo)`.

#### 2NF — závislost na celém klíči
**Pravidlo:** 1NF + **každý neklíčový atribut závisí na CELÉM kandidátním klíči** (řeší **částečné závislosti** u **složených klíčů**).

❌ **Špatně:** `OrderItem(order_id, product_id, product_name, quantity)` s PK `(order_id, product_id)`.
- `product_name` závisí **jen na `product_id`** (nepotřebuje order_id) → porušení 2NF

✅ **Správně:**
- `Product(product_id, product_name, ...)`
- `OrderItem(order_id, product_id, quantity)`

#### 3NF — bez tranzitivních závislostí
**Pravidlo:** 2NF + **neklíčové atributy nezávisí na jiných neklíčových** (žádná tranzitivní závislost).

**Tranzitivní závislost:** `PK → A → B` (kde A není klíč).

❌ **Špatně:** `Employee(employee_id, dept_id, dept_name)`
- `dept_name` závisí na `dept_id`, `dept_id` na `employee_id` → tranzitivně

✅ **Správně:**
- `Department(dept_id, dept_name)`
- `Employee(employee_id, dept_id, ...)`

#### BCNF — Boyce-Coddova normální forma (silnější než 3NF)
**Pravidlo:** Pro každou netriviální FD `X → Y` musí **X být superklíč**.

Řeší "vzácnější situace" — typicky když:
- Existuje **více kandidátních klíčů**
- Vznikají závislosti, které 3NF pustí, ale BCNF už ne

### 5. Normalizace × denormalizace (trade-off)

| Normalizace | Denormalizace |
|---|---|
| Víc tabulek | Méně tabulek (slučování) |
| Víc vazeb | Méně vazeb |
| Méně duplicity | Schválná duplicita |
| Vyšší **konzistence** | Vyšší **rychlost čtení** |
| Více JOINů → pomalejší čtení | Méně JOINů → rychlejší |
| Riziko: nic | Riziko: **nekonzistence** (musíš hlídat) |

**V praxi je databáze často kombinace obojího:**
- Hlavní data v 3NF
- Pro reporty / dashboardy denormalizované pohledy (views) nebo OLAP

---

## Konkrétní příklady

### 0NF → 1NF (atomicita)

❌ **Před:**
| id | jmeno | telefony |
|---|---|---|
| 1 | Anna | "123,456,789" |

✅ **Po (1NF):**
| id | jmeno |
|---|---|
| 1 | Anna |

| id | person_id | telefon |
|---|---|---|
| 1 | 1 | 123 |
| 2 | 1 | 456 |
| 3 | 1 | 789 |

### 1NF → 2NF (částečná závislost)

❌ **Před** s PK `(order_id, product_id)`:
| order_id | product_id | product_name | quantity |
|---|---|---|---|

`product_name` závisí jen na `product_id`.

✅ **Po (2NF):**
- `Product(product_id, product_name)`
- `OrderItem(order_id, product_id, quantity)`

### 2NF → 3NF (tranzitivní závislost)

❌ **Před:**
| employee_id | jmeno | dept_id | dept_name |
|---|---|---|---|

`dept_name` závisí na `dept_id` (přes mezičlánek).

✅ **Po (3NF):**
- `Department(dept_id, dept_name)`
- `Employee(employee_id, jmeno, dept_id)`

---

## Vztahy / kontrasty

- **Normalizace × denormalizace:** snižování × schválné porušení pro výkon
- **OLTP × OLAP:** transakční (normalizováno) × analytické (denormalizováno)
- **1NF × 2NF × 3NF:** atomicita × celý PK × bez tranzitivních
- **3NF × BCNF:** 3NF dovolí výjimky, BCNF přísnější
- **Funkční závislost × superklíč:** vztah hodnot × množina atributů určující řádek

---

## Časté otázky komise

**Q:** Co je normalizace a proč se používá?
**A:** **Postup návrhu relační databáze**, který **omezuje redundanci** (duplikování dat) a **chrání před 3 anomáliemi**: **update** (musíš měnit info na víc místech), **insert** (nelze vložit jednu věc bez druhé) a **delete** (smazáním řádku omylem smažeš i info, kterou chceš). Cíl: každá informace existuje **přesně na jednom místě**.

**Q:** Co je 1NF?
**A:** **První normální forma** — každý sloupec obsahuje **jednu atomickou hodnotu** (ne seznam, ne víc věcí v jedné buňce). Klasická chyba: `telefony = "123, 456, 789"` v jednom sloupci → porušení 1NF. Oprava: vytáhnout do samostatné tabulky `Telefon` s FK (vazba 1:N).

**Q:** Co je 2NF a kdy ji řeším?
**A:** **Druhá normální forma** = 1NF + **každý neklíčový atribut závisí na CELÉM kandidátním klíči**. Řeší **částečné závislosti**, typicky u **složených klíčů**. Příklad: `OrderItem(order_id, product_id, product_name, quantity)` s PK `(order_id, product_id)` — `product_name` závisí jen na `product_id`, ne na celém PK → porušení 2NF. Oprava: vyhodit `product_name` do tabulky `Product`.

**Q:** Co je 3NF?
**A:** **Třetí normální forma** = 2NF + **neklíčové atributy nezávisí na jiných neklíčových** (žádná tranzitivní závislost). Tranzitivní = `PK → A → B`, kde A není klíč. Příklad: `Employee(id, dept_id, dept_name)` — `dept_name` závisí na `dept_id`, ten na `id` (tranzitivně). Oprava: vytáhnout `Department(dept_id, dept_name)`.

**Q:** Co je BCNF?
**A:** **Boyce-Coddova normální forma** — **silnější varianta 3NF**. Pro každou netriviální funkční závislost `X → Y` musí být **X superklíč**. Řeší "vzácnější situace", kdy existuje víc kandidátních klíčů a vznikají závislosti, které 3NF ještě pustí, ale BCNF ne. V praxi 3NF stačí, BCNF se řeší méně často.

**Q:** Co je denormalizace a kdy se používá?
**A:** **Schválné porušení normalizace** ve prospěch **rychlosti čtení**. Typicky v **OLAP** (analytické zpracování, reporty) — data se duplikují, aby se vyhnulo JOINům. Trade-off: rychlost vs konzistence. Při denormalizaci **musíš hlídat duplicity** (změnit data na víc místech, jinak nekonzistence).

**Q:** Jaký je rozdíl mezi OLTP a OLAP?
**A:** **OLTP (Online Transaction Processing)** — produkční aplikace (e-shop, banka), **hodně zápisů**, důraz na konzistenci, **více normalizováno**. **OLAP (Online Analytical Processing)** — analytika, reporting, **hodně čtení**, často **denormalizováno** (méně JOINů → rychlejší dotazy). Workflow: zapisuješ do OLTP, pravidelně se data transformují do OLAP pro reporty.

---

## Co bych ještě měl vědět (volně)

- **4NF, 5NF** — vyšší normální formy, řeší vícehodnotové závislosti. V praxi se používají zřídka.
- **6NF** — extrémní normalizace pro temporal databases.
- **Star schema** (denormalizovaný) — typický OLAP pattern: jedna fact tabulka + víc dimension tabulek
- **Snowflake schema** — částečně normalizované hvězdové schéma

---

## Status

- **Sebehodnocení (před):** 3/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-19
