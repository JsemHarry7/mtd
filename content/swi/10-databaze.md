---
subject: SWI
number: 10
title: "Databáze"
tags: ["databáze", "sql", "architektura", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**Databáze** je systém pro **uchovávání, organizaci a získávání dat**. Nejrozšířenější jsou **relační databáze (RDBMS)** založené na **relačním modelu** Edgara F. Codda (1970) — data v **tabulkách**, pevné schéma, dotaz přes **SQL**. Příklady: MySQL, PostgreSQL, MS SQL Server. Alternativa: **NoSQL** (MongoDB, Redis) pro nestrukturovaná data. Datové modelování probíhá ve **3 fázích**: konceptuální (ER diagram), logický (tabulky + PK/FK), fyzický (typy, indexy).

---

## Klíčové pojmy

- **Databáze** — systém pro uchovávání a získávání dat
- **DBMS** — Database Management System (software, který spravuje databázi)
- **RDBMS** — Relational DBMS (relační)
- **Relační model** — Codd 1970, data v tabulkách
- **Tabulka (relace)** — strukturovaná data se sloupci a řádky
- **Entita** — objekt reálného světa (Student, Auto)
- **Atribut** — vlastnost entity (jméno, věk)
- **Primární klíč (PK)** — unikátní identifikátor řádku
- **Cizí klíč (FK)** — odkaz na PK jiné tabulky
- **Vazby (relace)** — 1:1, 1:N, M:N
- **Vazební tabulka** — řeší M:N
- **Integrita** — doménová, referenční, transakční
- **ACID** — vlastnosti transakcí
- **Index** — datová struktura pro rychlé vyhledávání
- **NoSQL** — Not Only SQL, alternativa pro nestrukturovaná data

---

## Hlavní výklad

### 1. Co je databáze a RDBMS

**Databáze** = organizovaná kolekce dat. **DBMS** = software, který databázi spravuje (vytváří, mění, dotazuje).

**Relační databáze (RDBMS):**
- Vychází z **relačního modelu** (Edgar F. Codd, 1970)
- Data v **tabulkách (relacích)**
- **Pevné schéma** — předem musíme vědět, jaké sloupce a typy budou
- Komunikace přes **SQL** (Structured Query Language)
- Zástupci: **PostgreSQL, MySQL, MS SQL Server, SQLite, Oracle**

### 2. Datové modelování (3 fáze)

**A. Konceptuální model — ER diagram**

Nezajímá nás technické řešení, ale **CO** v databázi bude. Používáme **ER model (Entity-Relationship)**.

- **Entita** — objekt reálného světa, o kterém uchováváme info (Student, Auto)
  - **Entitní typ** — šablona ("Člověk")
  - **Instance entity** — konkrétní objekt ("Franta")
- **Atribut** — vlastnost entity (jméno, věk)
- **Relace** — vazba mezi entitami

**B. Logický model**

Převádíme entity na **tabulky**.
- Řešíme **primární klíče (PK)** a **cizí klíče (FK)**
- Vyřešíme vazby, které relační model přímo neumí (M:N → vazební tabulka)

**C. Fyzický model**

Implementace pro vybraný systém (MySQL, PostgreSQL...):
- Definují se přesné **datové typy** (INT, VARCHAR, DATE)
- Řeší se **indexy**, fyzické uložení na disku, optimalizace

### 3. Typy relací (vazeb)

**1:1 (jeden k jednomu)**
- Jednomu záznamu odpovídá **právě jeden záznam** v druhé tabulce
- Příklad: Člověk a jeho rodné číslo
- V praxi se často **slučují do jedné tabulky**, pokud není nutné oddělit (privacy, výkon)

**1:N (jeden k mnoha)** — nejčastější
- Jeden záznam → mnoho záznamů
- Příklad: **Třída a Studenti** — jedna třída má mnoho studentů, ale student chodí jen do jedné třídy
- **Realizace:** do tabulky "Student" se přidá **sloupec s ID třídy (FK)**

**M:N (mnoho k mnoha)**
- Příklad: **Herci a Filmy** — jeden herec hraje ve více filmech, jeden film má víc herců
- **Problém:** relační DB neumí M:N přímo uložit
- **Řešení: vazební (asociační) tabulka** — vznikne rozpad na **dvě vazby 1:N**

```
HEREC (id PK, jmeno)
FILM (id PK, nazev)
HRAJE_V (id_herec FK, id_film FK, role)   ← vazební tabulka
```

### 4. Speciální typy vazeb

**Rekurzivní vazba** — vztah entity **samé k sobě**.
- Příklad: **Zaměstnanec a jeho nadřízený** (oba jsou v tabulce Zaměstnanci, FK `manager_id` ukazuje na `Zamestnanec.id`)
- Příklad: **Rodič ↔ Potomek**

**IS-A (Generalizace/Specializace)** — dědičnost na úrovni dat.
- Příklad: `Vozidlo` (obecná) + podtypy `Auto` a `Motorka`. `Auto IS A Vozidlo`.
- Řešení v DB: **buď jedna tabulka** s NULL sloupci pro specifické atributy, **nebo více tabulek** se společným ID.

### 5. Integrita dat

**Integrita** = data jsou správná, konzistentní, dávají smysl.

**A. Doménová integrita (sloupcová)**
- Hlídá, **jaké hodnoty mohou být ve sloupci**
- Zajišťují to **datové typy** (do číselného sloupce nenapíšeš text) a **omezení (constraints)**:
  - `NOT NULL` — hodnota musí existovat
  - `UNIQUE` — žádné duplicity
  - `CHECK` — vlastní pravidlo (`věk >= 0 AND věk <= 120`)
  - `DEFAULT` — výchozí hodnota
- Příklad: věk nesmí být záporný

**B. Referenční integrita (vazební)**
- Hlídá **vztahy mezi tabulkami** (přes cizí klíče)
- Pravidlo: **nemůže existovat odkaz na neexistující záznam**
- Příklad: nemůžeš smazat Třídu, dokud v ní jsou Studenti

**Řešení při mazání rodiče:**
| Akce | Co dělá |
|---|---|
| `RESTRICT` / `NO ACTION` | Zakáže smazání, dokud existují potomci |
| `CASCADE` | Smaže rodiče + automaticky všechny potomky |
| `SET NULL` | Smaže rodiče, potomkům nastaví FK na NULL |
| `SET DEFAULT` | Smaže rodiče, potomkům nastaví FK na default hodnotu |

**C. Transakční zpracování (logická integrita)**
- Složitější operace (např. převod peněz mezi účty) musí proběhnout **celá, nebo vůbec**
- Zajišťuje to **transakce** s vlastnostmi **ACID** (viz dál)

### 6. Transakce a ACID

**Transakce** = sekvence operací, která se musí provést **jako celek**. Buď proběhne všechno, nebo nic (atomická).

**Klasický příklad:** převod 1000 Kč z účtu A na účet B
```sql
BEGIN TRANSACTION;
    UPDATE ucty SET zustatek = zustatek - 1000 WHERE id = A;
    UPDATE ucty SET zustatek = zustatek + 1000 WHERE id = B;
COMMIT;
-- nebo při chybě:
ROLLBACK;
```

Bez transakce: pokud první UPDATE projde a druhý spadne, peníze "zmizí".

**ACID — 4 vlastnosti transakcí:**

| Vlastnost | Co znamená |
|---|---|
| **A — Atomicity** | Vše nebo nic. Buď všechny operace projdou, nebo žádná. |
| **C — Consistency** | Po transakci je DB v konzistentním stavu (constraints splněny). |
| **I — Isolation** | Souběžné transakce se navzájem neruší (jako by každá běžela sama). |
| **D — Durability** | Po commitnutí jsou data trvale uložena (i při výpadku napájení). |

### 7. Indexy

**Index** = pomocná datová struktura, která **urychluje vyhledávání** v tabulce.

**Bez indexu:** DB musí projít **všechny řádky** tabulky (full table scan) — `O(n)`.
**S indexem:** DB najde záznam rychle — typicky `O(log n)` (B-tree).

**Příklad:**
```sql
CREATE INDEX idx_users_email ON users(email);
-- nyní SELECT ... WHERE email = '...' je rychlý
```

**Typy indexů:**
- **B-tree** — default, vhodný pro rovnost i range queries
- **Hash** — jen pro rovnost, velmi rychlý
- **Full-text** — pro vyhledávání v textu

**Trade-off:**
- ✅ **Rychlejší SELECT**
- ❌ **Pomalejší INSERT/UPDATE/DELETE** (index musí být aktualizován)
- ❌ **Větší velikost** databáze

**PK má automatický index** (proto je vyhledávání podle PK rychlé).

### 8. NoSQL databáze

**NoSQL** = **Not Only SQL.** Vzniklo jako reakce na potřebu ukládat **velká množství dat bez pevné struktury** (Big Data, sociální sítě, mikroslužby).

**Hlavní rozdíly oproti SQL:**
- **Schemaless** — nemusíš předem definovat sloupce
- **Horší podpora složitých vazeb** (joiny jsou omezené nebo neexistují)
- **Vyšší škálovatelnost** (horizontal scaling)

**4 typy NoSQL:**

| Typ | Princip | Zástupce | Použití |
|---|---|---|---|
| **Dokumentové** | JSON objekty | **MongoDB** | E-shopy, CMS, různorodá data |
| **Klíč-hodnota** | Velmi jednoduché úložiště | **Redis** | Cache, session, leaderboardy |
| **Grafové** | Uzly a hrany | **Neo4j** | Sociální sítě, knowledge graphs |
| **Sloupcové** | Optimalizace pro analytiku | **Cassandra**, HBase | Big Data analytika |

**Kdy SQL vs NoSQL:**
- **SQL:** strukturovaná data, komplexní vazby, transakce, ACID kritické (banky, finance, ERP)
- **NoSQL:** velký objem, různorodá data, eventual consistency OK, horizontal scaling potřeba

---

## Vztahy / kontrasty

- **SQL × NoSQL:** strukturované × nestrukturované, ACID × eventual consistency
- **Relační × dokumentové:** tabulky s pevným schématem × JSON objekty bez schématu
- **PK × FK:** unikátní identifikátor vlastní tabulky × odkaz na PK jiné tabulky
- **1:N × M:N:** jedno-k-více (FK ve straně N) × více-k-více (vazební tabulka)
- **Doménová × referenční × logická integrita:** jednotlivá hodnota × vztah tabulek × celá transakce
- **Index × žádný index:** O(log n) × O(n) hledání, ale pomalejší INSERT/UPDATE
- **CASCADE × RESTRICT × SET NULL:** vymaž potomky × zakaž mazání × nastav NULL

---

## Časté otázky komise

**Q:** Co je relační databáze?
**A:** Databáze založená na **relačním modelu** (Edgar F. Codd, 1970), kde **data jsou uložena v tabulkách (relacích)**. Má **pevné schéma** — předem definované sloupce a datové typy. Komunikace přes **SQL** (Structured Query Language). Zástupci: MySQL, PostgreSQL, MS SQL Server, SQLite, Oracle.

**Q:** Co je primární klíč a cizí klíč?
**A:** **Primární klíč (PK)** = **unikátní identifikátor řádku** v tabulce. Nemůže být NULL ani duplicitní. Typicky číslo (INT auto-increment) nebo GUID. **Cizí klíč (FK)** = **odkaz na PK jiné tabulky**. Vytváří **vztah** mezi tabulkami. Příklad: tabulka `Student` má sloupec `trida_id` (FK), který ukazuje na `Trida.id` (PK).

**Q:** Jak se realizují vztahy 1:1, 1:N, M:N v relační DB?
**A:** **1:1** — buď FK v jedné z tabulek (s UNIQUE), nebo (často) **sloučit do jedné tabulky**. **1:N** — **FK ve straně N** (na straně "mnoho"). Příklad: `Student.trida_id` ukazuje na `Trida.id`. **M:N** — **vazební (asociační) tabulka** s dvojicí FK. Příklad: tabulka `HRAJE_V(id_herec FK, id_film FK)`. Relační DB neumí M:N přímo uložit, vždy potřebuje vazební tabulku.

**Q:** Co je referenční integrita?
**A:** Pravidlo, že **nemůže existovat odkaz na neexistující záznam**. Pokud má `Student.trida_id` FK na `Trida.id`, nemůžu smazat třídu, dokud v ní jsou studenti. **Akce při mazání rodiče:** `RESTRICT` (zakáže), `CASCADE` (smaže i potomky), `SET NULL` (nastaví FK na NULL), `SET DEFAULT`.

**Q:** Co je ACID?
**A:** **4 vlastnosti transakcí** v relačních DB. **A — Atomicity** (vše nebo nic). **C — Consistency** (po transakci je DB v konzistentním stavu, constraints splněny). **I — Isolation** (souběžné transakce se neruší, jako by každá běžela sama). **D — Durability** (po commitnutí jsou data trvale uložena, i při výpadku napájení). NoSQL databáze často **rezignují na ACID** ve prospěch škálovatelnosti (eventual consistency).

**Q:** Co je transakce a proč se používá?
**A:** **Sekvence operací, která se musí provést jako celek.** Buď proběhne všechno, nebo nic (atomicita). Klasický příklad: převod peněz mezi účty — `UPDATE A -= 1000; UPDATE B += 1000`. Bez transakce: pokud první projde a druhý spadne, peníze "zmizí". S transakcí: pokud cokoli selže, `ROLLBACK` vrátí stav před transakcí, jinak `COMMIT` ji potvrdí.

**Q:** Co je index a kdy se hodí?
**A:** **Pomocná datová struktura, která urychluje vyhledávání** v tabulce. Bez indexu DB dělá **full table scan** (O(n)). S indexem typicky **O(log n)** (B-tree). Trade-off: rychlejší SELECT, ale **pomalejší INSERT/UPDATE/DELETE** (index musí být aktualizován) a **větší velikost DB**. Hodí se na **sloupce často používané ve WHERE / JOIN / ORDER BY**. PK má automatický index.

**Q:** Jaký je rozdíl mezi SQL a NoSQL?
**A:** **SQL (relační)** — pevné schéma (sloupce + typy), data v tabulkách, komplexní vazby přes JOIN, **ACID transakce**. Dobré pro strukturovaná data, finance, ERP. **NoSQL** — **schemaless**, různé typy (dokumentové JSON, klíč-hodnota, grafové, sloupcové), horší joiny, ale **lepší škálovatelnost** (horizontal). Dobré pro Big Data, nestrukturovaná data, mikroslužby. **NoSQL** = "Not Only SQL" — komplement, ne náhrada.

**Q:** Vyjmenuj 4 typy NoSQL databází.
**A:** **1) Dokumentové** — JSON objekty, MongoDB, vhodné pro e-shopy/CMS. **2) Klíč-hodnota** — Redis, vhodné pro cache/session. **3) Grafové** — Neo4j, vhodné pro sociální sítě (vztahy). **4) Sloupcové** — Cassandra, vhodné pro Big Data analytiku.

---

## Status

- **Sebehodnocení (před):** 2/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-18
