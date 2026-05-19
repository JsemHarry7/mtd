---
subject: DAT
number: 15
title: "ER model a návrh databáze"
tags: ["databáze", "sql", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**ER model** (Entity-Relationship) je **konceptuální model databáze** — popisuje **CO** budeme ukládat (entity + atributy + vazby), neřeší **JAK**. Návrh DB má **3 úrovně**: konceptuální (ER diagram) → logický (tabulky + PK/FK) → fyzický (datové typy, indexy v konkrétním DBMS). Klíčové pojmy: **entita** (objekt), **atribut** (vlastnost), **klíč** (identifikátor), **kardinalita** (1:1 / 1:N / M:N).

---

## Klíčové pojmy

- **ER model** — Entity-Relationship, konceptuální návrh DB
- **Entita** — typ objektu reálného světa (Student, Auto)
- **Instance entity** — konkrétní výskyt (Karel Novák)
- **Atribut** — vlastnost entity (jméno, věk)
- **Relace (vazba)** — vztah mezi entitami
- **Kardinalita** — kolik výskytů jedné entity souvisí s druhou
- **Kandidátní klíč** — minimální množina atributů identifikující řádek
- **Primární klíč (PK)** — vybraný kandidátní, NOT NULL + UNIQUE
- **Cizí klíč (FK)** — odkaz na PK jiné tabulky
- **Surrogate klíč** — uměle generovaný (AUTO_INCREMENT, GUID)
- **Přirozený klíč** — z reálného atributu (ISBN)
- **Složený klíč** — PK z více sloupců (typicky vazební tabulka)
- **Vazební tabulka** — řeší N:M
- **Slabá entita** — bez vlastního PK, identifikuje se přes silnou
- **Rekurzivní vazba** — entita odkazuje sama na sebe
- **ISA vazba** — dědičnost (Student ISA Osoba)

---

## Hlavní výklad

### 1. Tři úrovně návrhu databáze

| Úroveň | Co řeší | Výstup |
|---|---|---|
| **Konceptuální** | *CO* chceme ukládat. Objekty + vztahy z reálného světa | **ER diagram** (entity + relace) |
| **Logický** | Převod do tabulek. PK, FK, propojení | **Relační schéma** |
| **Fyzický** | Detaily pro konkrétní DBMS. Datové typy, indexy | **`CREATE TABLE`** skripty |

```
Konceptuální:   "Studenti mají třídu"  (kreslíme entity)
                       ▼
Logický:        Tabulka Student s FK trida_id → tabulka Trida.id
                       ▼
Fyzický:        CREATE TABLE Student (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    trida_id INT NOT NULL,
                    FOREIGN KEY (trida_id) REFERENCES Trida(id)
                );
```

### 2. ER model — klíčové pojmy

| Pojem | Význam | Příklad |
|---|---|---|
| **Data** | Jednotlivé hodnoty | "Anna", "25", "2026-05-11" |
| **Informace** | Data v kontextu | "Zákaznice Anna, 25 let" |
| **Entita** | Typ objektu reálného světa | `Zakaznik`, `Produkt`, `Objednavka` |
| **Instance** | Konkrétní výskyt entity | "Karel Novák, 18 let" |
| **Atribut** | Vlastnost entity | `jmeno`, `email`, `cena` |
| **Klíč** | Atribut(y) jednoznačně identifikující záznam | `id_zakaznika` |
| **Relace (vazba)** | Vztah mezi entitami | Zákazník → Objednávka |
| **Kardinalita** | Kolik výskytů souvisí | 1:1, 1:N, M:N |

> **Pozor:** Entita je TYP (Student obecně), instance je KONKRÉTNÍ ZÁZNAM (Karel Novák). V ER diagramu kreslíš entity, ne instance.

### 3. Změna terminologie ER → logický model

| Konceptuální (ER) | Logický (relační DB) |
|---|---|
| Entita | **Tabulka** |
| Atribut | **Sloupec** (column) |
| Relace (čára) | **Propojení přes klíče** (FK) |
| Instance | **Řádek** (row) |

### 4. Klíče v relační databázi

| Klíč | Význam | Příklad |
|---|---|---|
| **Kandidátní** | Sloupec(e), které **jednoznačně identifikují** záznam | `id_zakaznika`, `email` |
| **Primární (PK)** | **Vybraný** kandidátní klíč, NOT NULL + UNIQUE | `id_zakaznika` |
| **Alternativní** | Ostatní kandidátní klíče | `email` (taky unikátní) |
| **Cizí (FK)** | Odkaz na PK jiné tabulky | `zakaznik_id` v `Objednavka` |
| **Surrogate** | Uměle vygenerované ID | `id INT AUTO_INCREMENT` |
| **Přirozený** | Z reálného atributu | `rodne_cislo`, `ISBN` |
| **Složený** | PK z **více sloupců** (vazební tabulka) | `(id_studenta, id_predmetu)` |

**Surrogate vs přirozený:**
- Surrogate je **stabilní** (nemění se), **krátký** (INT), **bez business významu** → doporučené pro většinu případů
- Přirozený má smysl pro uživatele, ale může být **citlivý** (rodné_číslo) nebo **nestabilní** (jméno se mění)

### 5. Kardinalita vazeb

#### 1:1 (jeden ku jednomu)

```
ZAMESTNANEC ──────────── OBCANKA
   (1)                    (1)
```

Jeden zaměstnanec má jednu občanku. **Implementace:** FK + `UNIQUE` v jedné z tabulek.

**Kdy 1:1** (oproti sloučení do jedné tabulky):
- Profilová data nečteš často (rozdělení pro výkon)
- Profil je volitelný (nullable FK)
- Profil má jiná oprávnění (zabezpečení)

#### 1:N (jeden ku mnoha) — nejčastější

```
ODDELENI ──────────< ZAMESTNANEC
  (1)                    (N)
```

Jedno oddělení má mnoho zaměstnanců, zaměstnanec patří do jednoho.

**Implementace:** FK **na straně N**.

```sql
CREATE TABLE Zamestnanec (
    id INT PRIMARY KEY,
    oddeleni_id INT NOT NULL,
    FOREIGN KEY (oddeleni_id) REFERENCES Oddeleni(id)
);
```

Příklady: Autor → Knihy, Kategorie → Produkty, Třída → Studenti.

#### M:N (mnoho ku mnoha)

```
STUDENT >────────< PREDMET
   (M)              (N)
```

**Problém:** relační DB tohle **napřímo neumí**. Musí se rozložit přes **vazební (spojovací) tabulku**.

```
STUDENT ───< ZAPIS >─── PREDMET
            (vazební)
```

```sql
CREATE TABLE Zapis (
    student_id INT NOT NULL,
    predmet_id INT NOT NULL,
    datum_zapisu DATE,
    znamka VARCHAR(5),
    PRIMARY KEY (student_id, predmet_id),    -- složený PK
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (predmet_id) REFERENCES Predmet(id)
);
```

**Vlastnosti vazební tabulky:**
- **PK = složený klíč** `(student_id, predmet_id)`
- 2 cizí klíče
- Může mít **vlastní atributy** (datum, známka, role)

**Klíčová věta pro obhajobu:** *"M:N nelze v relační DB implementovat napřímo, **vždy se rozkládá na 2 vazby 1:N přes vazební tabulku**."*

### 6. Speciální typy vazeb

#### Rekurzivní vazba (self-referencing)

Entita má vztah **sama na sebe**.

```sql
CREATE TABLE Zamestnanec (
    id INT PRIMARY KEY,
    jmeno VARCHAR(50),
    manager_id INT NULL,        -- NULL pro CEO!
    FOREIGN KEY (manager_id) REFERENCES Zamestnanec(id)
);
```

**Příklady:**
- Zaměstnanec → nadřízený (manager)
- Komentář → odpověď (vlákno diskuse)
- Kategorie → nadřazená kategorie (strom)

**CEO má `manager_id = NULL`** — nemá nadřízeného. Proto NULL v rekurzivním FK je běžné.

#### Slabá entita

Entita **bez vlastního PK**, identifikuje se přes vztah k silné.

```sql
CREATE TABLE Polozka (
    objednavka_id INT NOT NULL,
    poradi INT NOT NULL,
    nazev VARCHAR(100),
    PRIMARY KEY (objednavka_id, poradi),
    FOREIGN KEY (objednavka_id) REFERENCES Objednavka(id) ON DELETE CASCADE
);
```

Položka existuje **jen v rámci objednávky**, bez ní nedává smysl. `CASCADE` při mazání rodiče.

#### ISA vazba (dědičnost)

"Něco je druhem něčeho." Student ISA Osoba (Student je druh Osoby).

**2 implementace:**

1. **Single Table** — jedna velká tabulka se všemi sloupci, NULL kde neaplikovatelné
2. **Class Table** — Osoba (společné) + Student (specifické), propojené 1:1

### 7. Notace ER diagramů

| Notace | Kdy zvolit |
|---|---|
| **UML Class** | Doporučení pro maturitu (objektový pohled) |
| **Crow's Foot** | Klasická pro DB, kompaktní, snadné kreslení rukou |
| **Mermaid** | Jen pro digitální přípravu |
| **Chen** | Klasický akademický, zřídka |

**Pro maturitu (kreslení rukou):** UML s multiplicitami (1, 0..1, *, 0..*, 1..*) nebo Crow's Foot.

**Pravidla:**
- Pojmenuj vazby **slovesem** ("vlastní", "patří k", "obsahuje")
- Entity v **jednotném čísle** (`Zamestnanec`, ne `Zamestnanci`)

### 8. ON DELETE strategie (referenční integrita)

| Akce | Co dělá |
|---|---|
| **`CASCADE`** | Smaže potomky s rodičem |
| **`RESTRICT`** | Zakáže smazání, dokud existují potomci (bezpečnější default) |
| **`SET NULL`** | Vynuluje FK na NULL |
| **`SET DEFAULT`** | Nastaví default hodnotu |
| **`NO ACTION`** | Jako RESTRICT, kontrola na konci transakce |

**Pravidlo:** **CASCADE** jen tam, kde **potomek bez rodiče nedává smysl** (položka bez objednávky). Pro většinu vazeb je **RESTRICT** nebo **SET NULL** bezpečnější.

---

## Formát praktické úlohy

**Per Prchal:** 30 min, **kreslení ER modelu na papír** podle textového zadání. Bez počítače.

**Typický obsah** (z minulých let):
- **Rekurzivní vztah** (např. zaměstnanec → nadřízený)
- **Vazba 1:1** (např. oddělení → leader)
- **Vazba M:N** (např. zaměstnanec ↔ projekt s rolí ve vazební tabulce)

### Postup návrhu krok za krokem

```
1. Sběr požadavků — "Co potřebuje uživatel uchovávat?"
        ▼
2. Identifikace ENTIT (podstatná jména v zadání) — "zaměstnanec", "oddělení"
        ▼
3. Atributy + PK pro každou entitu — Zamestnanec: id, jmeno, email
        ▼
4. Vztahy + kardinalita (slovesa: patří, vede, rezervuje) — "patří do" → 1:N
        ▼
5. Doplnění FK (1:N → FK na straně N) — Zamestnanec.oddeleni_id
        ▼
6. Vazební tabulky pro N:M — UcastNaProjektu(zamestnanec_id, projekt_id, role)
        ▼
7. Normalizace (1NF, 2NF, 3NF kontrola)
        ▼
8. ER diagram (kreslení rukou)
```

---

## Příklad: Firemní databáze (Prchal)

**Zadání:**
- Zaměstnanec + Oddělení: zaměstnanec patří do jednoho (1:N). Oddělení má **leadera** (1:1).
- Projekt + Role: zaměstnanec na více projektech, projekt má více lidí (**N:M**). Vazební tabulka s `role`.
- **Rekurzivní:** zaměstnanec má nadřízeného (taky zaměstnance).
- Místnost: patří k oddělení (1:N).
- Rezervace: zaměstnanec rezervuje místnost s časem (**N:M**).

**Řešení — 6 tabulek:**
1. **Oddeleni** (id, nazev, lokace, leader_id NULL UNIQUE) — leader_id = 1:1 s Zamestnanec
2. **Zamestnanec** (id, jmeno, prijmeni, email UNIQUE, plat, oddeleni_id, manager_id NULL) — rekurze
3. **Projekt** (id, nazev, datum_zahajeni)
4. **UcastNaProjektu** (zamestnanec_id, projekt_id, role) — vazební, PK složený
5. **Mistnost** (id, cislo, kapacita, oddeleni_id)
6. **Rezervace** (id, zamestnanec_id, mistnost_id, datum_od, datum_do, ucel)

**Cyklus FK Oddeleni ↔ Zamestnanec** — řeší se **nullable `leader_id`**:
1. Insert Oddeleni s `leader_id = NULL`
2. Insert Zamestnanec s `oddeleni_id = X`
3. UPDATE Oddeleni SET `leader_id = Y`

---

## Vztahy / kontrasty

- **Entita × instance:** typ (Student obecně) × konkrétní výskyt (Karel)
- **Kandidátní × primární klíč:** všechny unikátní × vybraný jeden (NOT NULL)
- **PK × FK:** identifikuje vlastní × odkazuje na cizí
- **Surrogate × přirozený klíč:** umělý (AUTO_INCREMENT) × business (ISBN)
- **1:1 × sloučit do 1 tabulky:** kdy 1:1 zvolit
- **1:N × M:N:** FK na straně N × vazební tabulka
- **Slabá × silná entita:** s/bez vlastního PK
- **Single Table × Class Table** pro ISA: jedna velká s NULL × normalizováno s 1:1

---

## Časté otázky komise

**Q:** Co je ER model a k čemu slouží?
**A:** **Entity-Relationship model** — **konceptuální model databáze**. Popisuje **CO** budeme ukládat (entity + atributy + vazby) z reálného světa, neřeší implementační detaily. Slouží jako **prostředník** mezi business požadavky a logickým / fyzickým návrhem DB. Z ER diagramu se převede na **relační schéma** (tabulky, PK, FK).

**Q:** Co je rozdíl mezi entitou a instancí entity?
**A:** **Entita = TYP** objektu reálného světa, šablona (Student obecně, Zaměstnanec, Auto). **Instance entity = KONKRÉTNÍ VÝSKYT** té entity (Karel Novák — konkrétní student, Toyota Yaris SPZ 1AB 2345 — konkrétní auto). V ER diagramu kreslíš **entity, ne instance**. V tabulce: entita = tabulka, instance = řádek.

**Q:** Jaké jsou druhy klíčů v relační databázi?
**A:** **Kandidátní klíč** = sloupec(e) jednoznačně identifikující záznam. **Primární klíč (PK)** = vybraný kandidátní, NOT NULL + UNIQUE, **právě jeden** per tabulka. **Alternativní klíče** = ostatní kandidátní (např. email vedle id). **Cizí klíč (FK)** = odkaz na PK jiné tabulky. **Surrogate klíč** = uměle vygenerované ID (AUTO_INCREMENT). **Přirozený klíč** = z reálného atributu (ISBN). **Složený klíč** = PK z více sloupců (typicky vazební tabulka).

**Q:** Jak realizuješ vazbu 1:N v relační DB?
**A:** **FK na straně N** (na straně "mnoho"). Příklad: třída ↔ studenti (1:N) → FK `trida_id` v tabulce `Student`. Tím se zaručí, že každý student patří **právě jedné** třídě, a třída může mít **mnoho** studentů.

**Q:** Jak realizuješ vazbu M:N v relační DB?
**A:** **Relační DB neumí M:N přímo.** Musí se rozložit přes **vazební (spojovací) tabulku** s dvojicí FK. Příklad: studenti ↔ předměty (M:N) → tabulka `Zapis(student_id, predmet_id, datum, znamka)` se **složeným PK** `(student_id, predmet_id)`. Vazební tabulka může mít vlastní atributy (datum zápisu, známka, role).

**Q:** Co je rekurzivní vazba a jak ji implementuješ?
**A:** **Entita má vazbu sama na sebe.** Příklad: zaměstnanec má nadřízeného (taky zaměstnance). Implementace: FK ve stejné tabulce ukazující na vlastní PK. **`manager_id` musí být NULLABLE** pro nejvyšší úroveň (CEO nemá nadřízeného). Další příklady: komentář ↔ odpověď (vlákno diskuse), kategorie ↔ nadřazená kategorie (strom).

**Q:** Co je slabá entita?
**A:** **Entita bez vlastního PK** — identifikuje se přes vztah k silné entitě. Klasický příklad: **Položka objednávky** — neexistuje samostatně, vždy patří k konkrétní objednávce. PK = `(objednavka_id, poradi)` — kombinace FK na rodiče + diskriminátor. `ON DELETE CASCADE` se hodí (smaž objednávku → smaž její položky).

**Q:** Surrogate × přirozený klíč — kdy co?
**A:** **Surrogate (umělý ID)** — `id INT AUTO_INCREMENT` nebo `GUID`. **Stabilní** (nemění se), **krátký**, **bez business významu**. **Doporučené pro většinu případů.** **Přirozený** — z reálného atributu (ISBN, rodné_číslo). Má smysl pro uživatele, ale může být **citlivý** (rodné_číslo, ochrana osobních údajů) nebo **nestabilní** (jméno se mění). Dnes se **skoro vždy** používají surrogate klíče.

---

## Status

- **Sebehodnocení (před):** 2/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-19
