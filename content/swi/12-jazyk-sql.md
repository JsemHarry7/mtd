---
subject: SWI
number: 12
title: "Jazyk SQL"
tags: ["databáze", "sql", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**SQL (Structured Query Language)** je **deklarativní jazyk** pro komunikaci s relačními databázemi. Vyvinula ho **firma IBM** v 70. letech, původně **SEQUEL**, kvůli ochranné známce zkráceno na SQL. **První standard 1986 (ANSI)**. Říkám **CO chci**, ne **jak to počítač najde** — optimalizátor DB plánuje cestu sám. Existují **dialekty** (T-SQL od MS, PL/SQL Oracle, pgSQL PostgreSQL) — všechny dodržují standard, ale přidávají vlastní funkce.

---

## Klíčové pojmy

- **SQL** — Structured Query Language, deklarativní jazyk pro RDBMS
- **Deklarativní** — píšu CO chci, ne JAK
- **Dialekt** — variant SQL (T-SQL, PL/SQL, pgSQL)
- **DDL** — Data Definition Language (struktura)
- **DML** — Data Manipulation Language (data)
- **DCL** — Data Control Language (oprávnění)
- **TCL** — Transaction Control Language (transakce)
- **DQL** — Data Query Language (SELECT, někdy součást DML)
- **Tabulka** — základní úložiště dat
- **View** — virtuální tabulka (uložený dotaz)
- **Index** — datová struktura urychlující vyhledávání
- **Sekvence** — generátor čísel pro PK
- **Stored procedure** — kód uložený v DB
- **Constraint** — omezení dat (PK, FK, UNIQUE, NOT NULL, CHECK)
- **PK / FK** — primární / cizí klíč
- **Transakce** — sekvence operací jako celek
- **COMMIT / ROLLBACK** — potvrdit / zrušit transakci

---

## Hlavní výklad

### 1. Historie a charakteristika SQL

- **Vyvinula firma IBM** (70. léta)
- Původně **SEQUEL** (*Structured English QUEry Language*) — kvůli ochranné známce zkráceno na **SQL**
- **Slouží výhradně ke komunikaci s relačními databázemi**
- **Deklarativní jazyk** — říkám "CO" chci (`SELECT * FROM users WHERE age > 18`), nestaráme se "JAK" to počítač najde
- Design ve **dvou směrech**:
  1. **Pro lidi** — jednoduchá angličtina, čte se jako věta
  2. **Pro počítač** — jednoznačná syntaxe, snadný parsing

### 2. Standardizace a dialekty

- **První standard: SQL-86** (ANSI)
- **Problém:** výrobci si standard upravili a přidali vlastní funkce → **dialekty:**

| Dialekt | DBMS |
|---|---|
| **T-SQL** | Microsoft SQL Server |
| **PL/SQL** | Oracle |
| **pgSQL** | PostgreSQL |
| **MySQL dialect** | MySQL / MariaDB |
| **SQLite** | SQLite |

### 3. Rozdělení SQL příkazů (5 skupin)

| Skupina | Plný název | Příkazy | K čemu |
|---|---|---|---|
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | **Struktura** DB (tabulky, sloupce) |
| **DML** | Data Manipulation Language | `INSERT`, `UPDATE`, `DELETE` | **Data** v tabulkách |
| **DQL** | Data Query Language | `SELECT` | **Výběr** dat (někdy součást DML) |
| **DCL** | Data Control Language | `GRANT`, `REVOKE` | **Oprávnění** |
| **TCL** | Transaction Control Language | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | **Transakce** |

### 4. DDL — definice struktury

**CREATE** — vytvoří nový objekt:
```sql
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jmeno VARCHAR(50) NOT NULL,
    vek INT CHECK (vek >= 0)
);
```

**ALTER** — upraví existující objekt:
```sql
ALTER TABLE student ADD COLUMN email VARCHAR(120);
ALTER TABLE student DROP COLUMN vek;
```

**DROP** — smaže objekt **i s daty** (nenávratně):
```sql
DROP TABLE student;
```

**TRUNCATE** — smaže **všechna data** v tabulce, **strukturu nechá** (rychlejší než DELETE bez WHERE):
```sql
TRUNCATE TABLE student;
```

### 5. DML — manipulace s daty

**SELECT** (DQL, ale často počítáno jako DML):
```sql
SELECT * FROM student WHERE vek > 18;
```

**INSERT** — vloží nová data:
```sql
INSERT INTO student (jmeno, vek) VALUES ('Anna', 18);
```

**UPDATE** — aktualizuje existující data:
```sql
UPDATE student SET vek = 19 WHERE jmeno = 'Anna';
-- ⚠️ Bez WHERE přepíše VŠECHNY řádky!
```

**DELETE** — smaže konkrétní řádky:
```sql
DELETE FROM student WHERE jmeno = 'Anna';
-- ⚠️ Bez WHERE smaže VŠECHNY řádky (jako TRUNCATE, ale pomaleji)!
```

### 6. DCL — řízení přístupu

**GRANT** — udělí oprávnění:
```sql
GRANT SELECT, INSERT ON student TO uzivatel1;
```

**REVOKE** — odebere oprávnění:
```sql
REVOKE INSERT ON student FROM uzivatel1;
```

### 7. TCL — transakce

**Transakce** = sekvence operací, která se musí provést jako celek (atomicita).

```sql
BEGIN TRANSACTION;
    UPDATE ucty SET zustatek = zustatek - 1000 WHERE id = 1;
    UPDATE ucty SET zustatek = zustatek + 1000 WHERE id = 2;
COMMIT;
-- nebo
ROLLBACK;
```

**SAVEPOINT** — bod uvnitř transakce, ke kterému lze vrátit:
```sql
BEGIN TRANSACTION;
    UPDATE ...;
    SAVEPOINT po_prvnim;
    UPDATE ...;  -- pokud problém
    ROLLBACK TO po_prvnim;  -- vrátí jen tu druhou změnu
COMMIT;
```

### 8. Databázové objekty (přes CREATE)

| Objekt | K čemu |
|---|---|
| **Tabulka (Table)** | Základní úložiště (řádky + sloupce) |
| **Pohled (View)** | **Virtuální tabulka** — uložený SELECT, tváří se jako tabulka. Užitečné pro bezpečnost (skryjeme citlivé sloupce) |
| **Index** | Datová struktura (B-tree) urychlující vyhledávání |
| **Sekvence / Auto_increment** | Generátor čísel pro PK (1, 2, 3...) |
| **Stored procedure** | Kus kódu uložený přímo v DB |
| **Trigger** | Akce, která se spustí při určité události (INSERT/UPDATE/DELETE) |

### 9. Integritní omezení (Constraints)

Pravidla, která hlídají kvalitu dat při INSERT/UPDATE:

| Constraint | Co dělá |
|---|---|
| **`PRIMARY KEY`** (PK) | Jednoznačný identifikátor — `NOT NULL + UNIQUE` |
| **`FOREIGN KEY`** (FK) | Odkaz na PK jiné tabulky (vazba) |
| **`UNIQUE`** | Hodnoty se nesmí opakovat (např. email). Může být NULL (pokud není zároveň PK) |
| **`NOT NULL`** | Sloupec nesmí být prázdný |
| **`CHECK`** | Podmínka, kterou data musí splnit (`vek >= 0`) |
| **`DEFAULT`** | Výchozí hodnota při INSERT bez specifikace |

```sql
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL,
    vek INT CHECK (vek >= 0 AND vek <= 120),
    status VARCHAR(20) DEFAULT 'active',
    trida_id INT,
    FOREIGN KEY (trida_id) REFERENCES trida(id) ON DELETE SET NULL
);
```

### 10. SELECT — pevné pořadí klauzulí

```sql
SELECT     sloupce      -- 1. co chci
FROM       tabulka      -- 2. odkud
JOIN       jina ON ...  -- 3. připojení
WHERE      podmínka     -- 4. filtrace řádků
GROUP BY   sloupce      -- 5. seskupení
HAVING     podmínka     -- 6. filtrace skupin
ORDER BY   sloupce      -- 7. řazení
LIMIT      n            -- 8. limit
```

**Klíčové:** **WHERE filtruje řádky před agregací**, **HAVING filtruje skupiny po agregaci**. (Detail v DAT 16.)

---

## Konkrétní příklady

### Kompletní DDL

```sql
-- Tabulka třída
CREATE TABLE trida (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nazev VARCHAR(10) UNIQUE NOT NULL,
    rocnik INT CHECK (rocnik BETWEEN 1 AND 4)
);

-- Tabulka student s FK na třídu
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jmeno VARCHAR(50) NOT NULL,
    prijmeni VARCHAR(50) NOT NULL,
    email VARCHAR(120) UNIQUE,
    vek INT CHECK (vek >= 0),
    trida_id INT,
    FOREIGN KEY (trida_id) REFERENCES trida(id) ON DELETE SET NULL
);
```

### Pohled (View) pro bezpečnost

```sql
-- Skryjeme email + věk před nepovolanými uživateli
CREATE VIEW student_public AS
SELECT id, jmeno, prijmeni, trida_id
FROM student;

GRANT SELECT ON student_public TO public_user;
-- public_user vidí jen 4 sloupce, ne všechny
```

### Transakce s ROLLBACK

```sql
BEGIN TRANSACTION;
    UPDATE ucty SET zustatek = zustatek - 1000 WHERE id = 1;

    -- Kontrola, že zůstatek není záporný
    IF (SELECT zustatek FROM ucty WHERE id = 1) < 0 THEN
        ROLLBACK;
    ELSE
        UPDATE ucty SET zustatek = zustatek + 1000 WHERE id = 2;
        COMMIT;
    END IF;
```

---

## Vztahy / kontrasty

- **DDL × DML:** struktura × data. CREATE/ALTER × INSERT/UPDATE
- **DML × DQL:** zápis × čtení (SELECT)
- **DROP × TRUNCATE × DELETE:** zničí strukturu × vyprázdní strukturu × maže řádky
- **TRUNCATE × DELETE bez WHERE:** TRUNCATE rychlejší (DDL, neřeší per-řádek), DELETE pomalejší (DML, log per-řádek, lze rollback)
- **PK × UNIQUE:** PK je NOT NULL + UNIQUE, **právě jeden** per tabulka. UNIQUE povolí NULL, může být víc.
- **VIEW × TABLE:** view je uložený dotaz, table je fyzické úložiště
- **GRANT × REVOKE:** udělit × odebrat oprávnění

---

## Časté otázky komise

**Q:** Co je SQL a kdo ho vyvinul?
**A:** **Structured Query Language** — standardizovaný **deklarativní jazyk** pro práci s relačními databázemi. Vyvinula ho firma **IBM** v 70. letech, původně **SEQUEL** (Structured English QUEry Language), kvůli ochranné známce zkráceno. **První standard SQL-86** (ANSI). Deklarativní znamená, že říkám "CO" chci (`SELECT * FROM users WHERE age > 18`), nestaráme se "JAK" to počítač na disku najde — optimalizátor DB plánuje cestu (full table scan, index seek, hash join...).

**Q:** Jaké jsou skupiny SQL příkazů?
**A:** **5 skupin:** **DDL** (Data Definition: `CREATE/ALTER/DROP/TRUNCATE` — struktura), **DML** (Data Manipulation: `INSERT/UPDATE/DELETE` — data), **DQL** (Data Query: `SELECT` — výběr, někdy součást DML), **DCL** (Data Control: `GRANT/REVOKE` — oprávnění), **TCL** (Transaction Control: `COMMIT/ROLLBACK/SAVEPOINT` — transakce).

**Q:** Jaký je rozdíl mezi DROP, TRUNCATE a DELETE?
**A:** **DROP** = **smaže celý objekt** (tabulka i se strukturou). **TRUNCATE** = **vyprázdní tabulku**, ale strukturu nechá; rychlejší (DDL, neřeší per-řádek log). **DELETE** = **smaže řádky** podle WHERE; pomalejší (DML, log per-řádek, lze rollback). Bez WHERE chování podobné TRUNCATE, ale pomalejší.

**Q:** Co jsou constraints v SQL?
**A:** **Integritní omezení** — pravidla, která hlídají kvalitu dat při INSERT/UPDATE. Hlavní typy: **`PRIMARY KEY`** (jednoznačný identifikátor, NOT NULL + UNIQUE), **`FOREIGN KEY`** (odkaz na PK jiné tabulky), **`UNIQUE`** (žádné duplicity, povolí NULL), **`NOT NULL`** (nesmí být prázdný), **`CHECK`** (vlastní pravidlo, např. `vek >= 0`), **`DEFAULT`** (výchozí hodnota).

**Q:** Co je rozdíl mezi PRIMARY KEY a UNIQUE?
**A:** **PRIMARY KEY** = jednoznačný identifikátor řádku, **NOT NULL + UNIQUE**, **právě jeden** per tabulka (může být složený z víc sloupců). **UNIQUE** = sloupec/sloupce bez duplicit, ale **povolí NULL** a může být **víc UNIQUE constraints** v tabulce (např. email i rodné_číslo). PK se používá pro identifikaci, UNIQUE pro business pravidla (žádné dva uživatelé se stejným emailem).

**Q:** Co je view a kdy se používá?
**A:** **View (pohled)** = **virtuální tabulka** — uložený SQL dotaz, který se tváří jako tabulka. Není to fyzické úložiště dat, ale "okno" do dat. **Použití:** 1) **Bezpečnost** — skryjeme citlivé sloupce, uživatel vidí jen view. 2) **Zjednodušení** — komplexní JOINy schované za jednoduchý SELECT. 3) **Abstrakce** — změna podkladového schématu nemusí ovlivnit aplikaci.

**Q:** Co je transakce v SQL a jaké příkazy ji řídí?
**A:** **Transakce** = sekvence operací, která se musí provést **jako celek** (atomicita). Řídí ji **TCL příkazy**: **`BEGIN TRANSACTION`** (zahájí), **`COMMIT`** (potvrdí změny, uloží natrvalo), **`ROLLBACK`** (vrátí změny zpět). Plus **`SAVEPOINT`** = bod uvnitř transakce, ke kterému lze vrátit jen část. Použití: kritické operace jako převod peněz, kde buď všechno musí projít, nebo nic.

**Q:** Co je dialekt SQL a uveď 2-3 příklady.
**A:** **Dialekt** = variant SQL upravený konkrétním výrobcem DBMS. Vychází ze SQL standardu, ale přidává vlastní funkce a syntax. Příklady: **T-SQL** (Microsoft SQL Server), **PL/SQL** (Oracle), **pgSQL** (PostgreSQL), **MySQL dialect**. Důsledek: SQL dotazy přenositelné napůl — základ funguje všude, ale specifické funkce (datumové funkce, window funkce, JSON operace) se liší.

---

## Status

- **Sebehodnocení (před):** 5/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-19
