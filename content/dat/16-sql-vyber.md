---
subject: DAT
number: 16
title: "SQL výběr a filtrování dat"
tags: ["databáze", "sql", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**SQL** je **deklarativní jazyk** pro relační DB — říkám CO chci, ne JAK. Příkazy se dělí na **DDL/DML/DQL/DCL/TCL**, pro tuhle úlohu klíčové **DQL = SELECT**. **SELECT má pevné pořadí klauzulí**: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. **Logické pořadí provádění** je jiné: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Důsledek: v WHERE **nemůžu použít alias** ze SELECT.

---

## Klíčové pojmy

- **SELECT** — výběr sloupců
- **FROM** — zdrojová tabulka
- **JOIN** — propojení tabulek
- **WHERE** — filtrace ŘÁDKŮ (před agregací)
- **GROUP BY** — seskupení
- **HAVING** — filtrace SKUPIN (po agregaci)
- **ORDER BY** — řazení (ASC / DESC)
- **LIMIT / OFFSET** — stránkování
- **INNER JOIN** — průnik (shoda v obou)
- **LEFT JOIN** — vše z levé + shody z pravé
- **CROSS JOIN** — kartézský součin
- **SELF JOIN** — tabulka sama se sebou
- **DISTINCT** — bez duplicit
- **NULL** — `IS NULL` ne `= NULL`!
- **Agregační funkce** — COUNT, SUM, AVG, MIN, MAX
- **Subquery** — dotaz uvnitř dotazu
- **CTE (WITH)** — pojmenovaný dočasný výsledek

---

## Hlavní výklad

### 1. SELECT — pevné syntaktické pořadí

```sql
SELECT     sloupce                -- 1. co chci zobrazit
FROM       tabulka                -- 2. odkud
JOIN       jina ON podmínka       -- 3. připojení dalších tabulek
WHERE      podmínka               -- 4. filtrace ŘÁDKŮ (před agregací)
GROUP BY   sloupce                -- 5. seskupení
HAVING     podmínka               -- 6. filtrace SKUPIN (po agregaci)
ORDER BY   sloupce                -- 7. řazení
LIMIT      n OFFSET m;            -- 8. stránkování
```

**Logické pořadí provádění** (jak DB skutečně zpracovává):
```
1. FROM → 2. JOIN → 3. WHERE → 4. GROUP BY → 5. HAVING → 6. SELECT → 7. DISTINCT → 8. ORDER BY → 9. LIMIT
```

**Důsledky:**
- `ORDER BY alias` funguje (SELECT už proběhl)
- `WHERE alias` **nefunguje** (SELECT ještě neproběhl)
- `WHERE AVG(x) > 5` **nefunguje** (agregace je až v GROUP BY) → použij **HAVING**

### 2. SELECT + FROM základ

```sql
SELECT * FROM student;                             -- všechny sloupce
SELECT jmeno, prijmeni FROM student;               -- jen vybrané
SELECT jmeno AS J FROM student;                    -- alias sloupce
SELECT DISTINCT trida_id FROM student;             -- bez duplicit
SELECT jmeno, vek + 1 AS pristi_rok FROM student;  -- výpočet

-- Alias tabulky (pro JOINy):
SELECT s.jmeno, t.nazev
FROM student AS s
JOIN trida AS t ON s.trida_id = t.id;
```

> **Pozor na `SELECT *`** — pro debug fajn, v produkci špatně. Když někdo přidá sloupec, dotaz vrátí víc dat než aplikace očekává.

### 3. WHERE — filtrace řádků

| Operátor | Příklad |
|---|---|
| `=` `<` `>` `<=` `>=` `!=` (nebo `<>`) | `vek >= 18` |
| `BETWEEN x AND y` | `vek BETWEEN 15 AND 19` |
| `IN (a, b, c)` | `trida_id IN (1, 2)` |
| `LIKE 'vzor'` | `jmeno LIKE 'J%'` (`%` = libovolný počet, `_` = právě 1) |
| `IS NULL` / `IS NOT NULL` | `email IS NULL` |
| `AND` `OR` `NOT` | logické operátory |

```sql
SELECT * FROM student
WHERE vek > 18 AND trida_id = 1;

SELECT * FROM student
WHERE prijmeni LIKE 'No%';   -- Novák, Novotný

SELECT * FROM student
WHERE trida_id IN (1, 3);
```

### ⚠️ NULL je speciální

**`WHERE sloupec = NULL` NEFUNGUJE!** NULL není rovno ničemu, ani sobě.

```sql
-- ❌ Špatně, vždy 0 řádků
WHERE email = NULL;

-- ✅ Správně
WHERE email IS NULL;
WHERE email IS NOT NULL;
```

### 4. ORDER BY a LIMIT

```sql
SELECT * FROM student ORDER BY prijmeni ASC;        -- vzestupně (výchozí)
SELECT * FROM student ORDER BY vek DESC;            -- sestupně
SELECT * FROM student ORDER BY prijmeni, jmeno;     -- víc kritérií

-- Stránkování: 2. stránka po 3 záznamech
SELECT * FROM student
ORDER BY prijmeni
LIMIT 3 OFFSET 3;        -- přeskoč 3, vezmi 3
```

> **MS SQL Server** používá `TOP 5` místo `LIMIT 5`. **SQLite/MySQL/PostgreSQL**: `LIMIT ... OFFSET`.

### 5. JOIN — spojování tabulek

| Typ | Co vrátí |
|---|---|
| **INNER JOIN** | Jen řádky se **shodou v obou** tabulkách |
| **LEFT JOIN** | **Všechny z levé** + shoda z pravé (NULL kde není shoda) |
| **RIGHT JOIN** | Vše z pravé + shoda z levé (méně časté) |
| **FULL OUTER JOIN** | Vše z obou (MySQL/SQLite **nemá**) |
| **CROSS JOIN** | Kartézský součin (každý s každým) |
| **SELF JOIN** | Tabulka sama se sebou (rekurzivní vazba) |

```sql
-- INNER JOIN: studenti, kteří MAJÍ aspoň jedno hodnocení
SELECT s.jmeno, h.skore
FROM student s
INNER JOIN hodnoceni h ON s.id = h.student_id;

-- LEFT JOIN: VŠICHNI studenti, i bez hodnocení
SELECT s.jmeno, h.skore
FROM student s
LEFT JOIN hodnoceni h ON s.id = h.student_id;

-- 3 tabulky: student → hodnoceni → predmet
SELECT s.jmeno, p.nazev, h.skore
FROM student s
JOIN hodnoceni h ON s.id = h.student_id
JOIN predmet   p ON p.id = h.predmet_id;

-- SELF JOIN pro rekurzivní vazby (manager_id)
SELECT z.jmeno AS zamestnanec, m.jmeno AS manager
FROM zamestnanec z
LEFT JOIN zamestnanec m ON z.manager_id = m.id;
```

> **Pozor: JOIN bez `ON`** = **kartézský součin** (m × n řádků). U velkých tabulek katastrofa.

### 6. GROUP BY + agregační funkce

| Funkce | K čemu |
|---|---|
| `COUNT(*)` | Počet řádků ve skupině |
| `COUNT(sloupec)` | Počet ne-NULL hodnot |
| `COUNT(DISTINCT sloupec)` | Počet unikátních |
| `SUM(sloupec)` | Součet |
| `AVG(sloupec)` | Průměr |
| `MIN`, `MAX` | Extrémy |

```sql
-- Počet studentů v každé třídě
SELECT trida_id, COUNT(*) AS pocet
FROM student
GROUP BY trida_id;

-- Top 5 studentů podle průměru
SELECT student_id, AVG(skore) AS prumer
FROM hodnoceni
GROUP BY student_id
ORDER BY prumer DESC
LIMIT 5;
```

**⚠️ Pravidlo:** vše v `SELECT`, co **není agregační funkce**, musí být v `GROUP BY` (nebo funkčně závislé na PK skupiny).

```sql
-- ❌ Špatně: jmeno není v GROUP BY ani v agregaci
SELECT trida_id, jmeno, COUNT(*) FROM student GROUP BY trida_id;

-- ✅ Buď přidat do GROUP BY (nemá smysl):
SELECT trida_id, jmeno, COUNT(*) FROM student GROUP BY trida_id, jmeno;

-- ✅ Nebo agregovat:
SELECT trida_id, MIN(jmeno), COUNT(*) FROM student GROUP BY trida_id;
```

### 7. HAVING — filtrace skupin

**WHERE filtruje řádky před agregací. HAVING filtruje skupiny po agregaci.**

```sql
-- Předměty s průměrným skóre > 80
SELECT predmet_id, AVG(skore) AS prumer
FROM hodnoceni
GROUP BY predmet_id
HAVING AVG(skore) > 80;

-- Třídy, kde jsou víc než 2 studenti
SELECT trida_id, COUNT(*) AS pocet
FROM student
GROUP BY trida_id
HAVING COUNT(*) > 2;
```

| | WHERE | HAVING |
|---|---|---|
| **Filtruje** | Jednotlivé řádky | Skupiny |
| **Před / po agregaci** | Před | Po |
| **Agregační funkce** | Ne | Ano |

```sql
-- WHERE + HAVING dohromady:
SELECT trida_id, COUNT(*) AS pocet
FROM student
WHERE vek > 17                  -- nejdřív filtruj řádky
GROUP BY trida_id
HAVING COUNT(*) > 2;            -- pak filtruj skupiny
```

### 8. Subquery (poddotaz)

**Skalární** (vrací 1 hodnotu):
```sql
-- Studenti starší než průměr
SELECT jmeno, vek
FROM student
WHERE vek > (SELECT AVG(vek) FROM student);
```

**S IN:**
```sql
-- Studenti s hodnocením z "Databáze"
SELECT jmeno FROM student
WHERE id IN (
    SELECT student_id FROM hodnoceni
    WHERE predmet_id = (SELECT id FROM predmet WHERE nazev = 'Databáze')
);
```

**Anti-join pattern** (LEFT JOIN + IS NULL):
```sql
-- Studenti BEZ hodnocení
SELECT s.jmeno
FROM student s
LEFT JOIN hodnoceni h ON s.id = h.student_id
WHERE h.student_id IS NULL;
```

### 9. CTE (Common Table Expression)

Pojmenovaný dočasný výsledek, čitelnější než vnořené subquery:

```sql
WITH prumery AS (
    SELECT student_id, AVG(skore) AS prumer
    FROM hodnoceni
    GROUP BY student_id
)
SELECT s.jmeno, p.prumer
FROM prumery p
JOIN student s ON s.id = p.student_id
ORDER BY p.prumer DESC
LIMIT 5;
```

### 10. SQLite specifika (důležité pro `exams.sqlite`)

- **`AUTOINCREMENT`** místo MySQL `AUTO_INCREMENT`
- **`TEXT`** místo `VARCHAR`
- **Žádné `FULL OUTER JOIN`** (použij LEFT JOIN s otočením)
- **Datumy jako TEXT** v ISO formátu `YYYY-MM-DD`
- **`STRFTIME`** pro formátování datumů (ne MySQL `YEAR()`)
- **Concat:** `jmeno || ' ' || prijmeni` (NE `CONCAT()` jako MySQL)

### 11. Užitečné funkce

```sql
-- Textové
UPPER('ahoj')                       -- 'AHOJ'
LOWER('AHOJ')                       -- 'ahoj'
LENGTH(jmeno)                       -- délka stringu
SUBSTR(jmeno, 1, 3)                 -- prvních 3 znaků
jmeno || ' ' || prijmeni            -- concat v SQLite

-- Číselné
ROUND(prumer, 2)                    -- 2 desetinná místa
ABS(-67)                            -- 67

-- Datumové (SQLite)
DATE('now')                         -- aktuální datum
STRFTIME('%Y', datum)               -- jen rok

-- Podmíněné
COALESCE(sloupec, 'default')        -- první ne-NULL hodnota
CASE WHEN podminka THEN ... ELSE ... END
```

---

## DB Browser for SQLite — workflow

1. **Otevři** `exams.sqlite` přes File → Open Database
2. **Zkontroluj schéma** v tabu *Database Structure* (jaké tabulky tam jsou)
3. **Prohlédni data** v *Browse Data* (rychlý overview)
4. **Piš SQL** v *Execute SQL* — pošli dotaz, vyhodnotí, ukáže výsledek
5. **Pokud nevíš schéma:**
   ```sql
   SELECT name FROM sqlite_master WHERE type = 'table';   -- výpis tabulek
   .schema student                                          -- struktura tabulky
   ```

---

## Příklad dotazů pro typickou školní DB

**Schéma předpokládáme:**
```
Student (id, jmeno, prijmeni, vek, trida_id)
Trida (id, nazev)
Predmet (id, nazev)
Hodnoceni (student_id, predmet_id, skore, datum)
```

### Úkol 1: Jednoduché SELECTy

```sql
-- 1a) Jména všech studentů
SELECT jmeno FROM Student;

-- 1b) Studenti ze třídy "1.A"
SELECT s.jmeno, s.prijmeni
FROM Student s
JOIN Trida t ON s.trida_id = t.id
WHERE t.nazev = '1.A';

-- 1c) Studenti starší 18, seřazení podle příjmení
SELECT jmeno, prijmeni, vek
FROM Student
WHERE vek > 18
ORDER BY prijmeni ASC;
```

### Úkol 2: JOINy

```sql
-- 2a) Studenti s hodnocením z "Databáze"
SELECT DISTINCT s.jmeno, s.prijmeni
FROM Student s
JOIN Hodnoceni h ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
WHERE p.nazev = 'Databáze';

-- 2b) Všechna hodnocení s celým jménem a předmětem
SELECT
    s.jmeno || ' ' || s.prijmeni AS cele_jmeno,
    p.nazev AS predmet,
    h.skore
FROM Hodnoceni h
JOIN Student s ON s.id = h.student_id
JOIN Predmet p ON p.id = h.predmet_id
ORDER BY s.prijmeni;
```

### Úkol 3: GROUP BY + agregace

```sql
-- 3a) Top 5 studentů podle průměrného skóre
SELECT
    s.jmeno || ' ' || s.prijmeni AS student,
    ROUND(AVG(h.skore), 2) AS prumer
FROM Student s
JOIN Hodnoceni h ON s.id = h.student_id
GROUP BY s.id, s.jmeno, s.prijmeni
ORDER BY prumer DESC
LIMIT 5;
```

### Úkol 4: HAVING

```sql
-- 4a) Předměty s průměrným skóre > 80
SELECT p.nazev, ROUND(AVG(h.skore), 2) AS prumer
FROM Predmet p
JOIN Hodnoceni h ON p.id = h.predmet_id
GROUP BY p.id, p.nazev
HAVING AVG(h.skore) > 80
ORDER BY prumer DESC;

-- 4b) Třídy, kde je víc než 2 studenti
SELECT t.nazev, COUNT(s.id) AS pocet
FROM Trida t
JOIN Student s ON s.trida_id = t.id
GROUP BY t.id, t.nazev
HAVING COUNT(s.id) > 2;
```

### Bonus: anti-join pattern

```sql
-- Studenti BEZ hodnocení (NULL po LEFT JOIN)
SELECT s.jmeno, s.prijmeni
FROM Student s
LEFT JOIN Hodnoceni h ON s.id = h.student_id
WHERE h.student_id IS NULL;
```

---

## Vztahy / kontrasty

- **WHERE × HAVING:** filtruje řádky před agregací × skupiny po agregaci
- **INNER JOIN × LEFT JOIN:** jen shody × vše z levé + shody
- **`=` × `IS`:** porovnání hodnot × kontrola NULL
- **Syntaktické × logické pořadí SELECT:** SELECT-first × FROM-first
- **Subquery × CTE × JOIN:** vnořené × pojmenované × spojení tabulek
- **`COUNT(*)` × `COUNT(sloupec)`:** všechny řádky × ne-NULL hodnoty

---

## Časté otázky komise (obhajoba)

**Q:** Jaký je rozdíl mezi WHERE a HAVING?
**A:** **WHERE filtruje JEDNOTLIVÉ ŘÁDKY před agregací.** **HAVING filtruje SKUPINY PO agregaci.** Klíčový důsledek: **agregační funkce** (`AVG`, `COUNT`, `SUM`) **lze použít jen v HAVING**, ne ve WHERE (ve WHERE ještě neproběhla agregace). Lze kombinovat: WHERE odfiltruje řádky, GROUP BY seskupí, HAVING filtruje výsledné skupiny.

**Q:** Jaký je rozdíl mezi INNER JOIN a LEFT JOIN?
**A:** **INNER JOIN** vrací **jen řádky se shodou v OBOU tabulkách**. Pokud levá tabulka má 100 studentů a 30 z nich nemá hodnocení, INNER JOIN s tabulkou hodnocení vrátí jen 70. **LEFT JOIN** vrací **VŠECHNY řádky z levé** tabulky + shody z pravé. Pokud nejsou shody, **NULL v pravých sloupcích**. Vrátil by všech 100, 30 by mělo NULL ve sloupcích hodnocení.

**Q:** Proč `WHERE jmeno = NULL` nefunguje?
**A:** **NULL není rovno ničemu, ani sobě.** `NULL = NULL` v SQL **NENÍ pravda** (je to UNKNOWN). Důsledek: `WHERE x = NULL` vždy vrátí 0 řádků. **Musíš použít `IS NULL`** nebo `IS NOT NULL`. SQL používá **3-hodnotovou logiku** (TRUE/FALSE/UNKNOWN), kde NULL = UNKNOWN.

**Q:** Jaké je logické pořadí provádění SELECT?
**A:** **FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.** Důsledky: v WHERE **nelze použít alias ze SELECT** (alias ještě neexistuje). V ORDER BY **lze**, protože SELECT už proběhl. Agregace **nelze ve WHERE** (jsou až v GROUP BY), proto se filtruje skupin přes HAVING.

**Q:** Co je kartézský součin a jak se mu vyhnout?
**A:** **Spojení tabulek bez podmínky** — každý řádek levé × každý řádek pravé. Pro 1000 × 1000 = **1 milion řádků**, většinou katastrofa. Vzniká při: `SELECT * FROM A, B` bez WHERE, nebo `JOIN ... bez ON`. **Vyhnutí:** vždy `JOIN ... ON podmínka` s explicitní vazbou.

**Q:** Co je rozdíl mezi `COUNT(*)` a `COUNT(sloupec)`?
**A:** **`COUNT(*)`** = počet **všech řádků** (i s NULL hodnotami ve všech sloupcích). **`COUNT(sloupec)`** = počet řádků, kde **`sloupec` NENÍ NULL**. Příklad: tabulka s 100 studenty, 30 nemá email. `COUNT(*) = 100`, `COUNT(email) = 70`. Plus **`COUNT(DISTINCT sloupec)`** = počet unikátních hodnot.

**Q:** Co je DISTINCT?
**A:** **Odstraní duplicitní řádky** z výsledku. `SELECT DISTINCT trida_id FROM Student` vrátí jen unikátní `trida_id` (každá třída jednou). Hodí se po JOINu, který může duplikovat řádky (např. student s víc hodnoceními se po JOIN s Hodnoceni objeví víckrát).

**Q:** Co je subquery a kdy ho použít vs JOIN?
**A:** **Dotaz uvnitř jiného dotazu**. **Skalární** (vrací 1 hodnotu) — pro porovnání: `WHERE vek > (SELECT AVG(vek) FROM ...)`. **Korelovaný** (závisí na vnějším dotazu, spustí se pro každý řádek — pomalejší). **Subquery × JOIN:** JOIN je často **rychlejší** (optimalizátor lépe pracuje), subquery **čitelnější** pro jednoduché případy. CTE (`WITH ...`) je nejčistší pro komplexní dotazy.

**Q:** Co je CTE (Common Table Expression)?
**A:** **Pojmenovaný dočasný výsledek** definovaný přes `WITH name AS (SELECT ...)`. Čitelnější než vnořené subquery — čteš shora dolů jako prozaický postup. Lze mít **víc CTE** oddělených čárkami, lze i **rekurzivní** (`WITH RECURSIVE` pro stromy / hierarchie). Příklad: spočítej průměry → spoj se studenty → top 5.

---

## Status

- **Sebehodnocení (před):** 5/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-19
