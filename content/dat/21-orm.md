---
subject: DAT
number: 21
title: "ORM (Object-Relational Mapper)"
tags: ["databáze", "sql", "c-sharp", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**ORM (Object-Relational Mapper)** je **vrstva mezi aplikačním kódem a relační databází**. Místo psaní SQL pracuješ s **objekty a metodami** v jazyce, ORM je přeloží na SQL. Hlavní výhody: **typová bezpečnost** (chyby při kompilaci), **přenositelnost mezi DB** (SQLite vs PostgreSQL), **automatické migrace**. Hlavní nástroje: **Prisma** (TypeScript/Next.js), **Entity Framework Core** (C#/.NET), **Drizzle** (TypeScript, SQL-blízký).

---

## Klíčové pojmy

- **ORM** — Object-Relational Mapper, most mezi kódem a DB
- **Code-first** — schéma v kódu, migrace generuje DB (běžnější)
- **DB-first** — DB existuje, generuji modely z ní
- **Schéma** — definice modelů (tabulky, sloupce, vazby)
- **Migrace** — verzování změn DB schématu (jako git)
- **Prisma 7** — TypeScript ORM s `schema.prisma` + driver adapter
- **`prisma.config.ts`** — NOVÉ v Prismě 7: URL, schema path
- **Driver adapter** — NOVÉ: most mezi Prisma Client a DB driverem
- **Prisma Client** — vygenerovaný typed API
- **EF Core** — C# ORM s LINQ dotazy
- **`findMany / findUnique`** — Prisma read operace
- **`include / select`** — JOIN / výběr sloupců v Prismě
- **`migrate dev` / `migrate deploy`** — vytvoření / aplikace migrace

---

## Hlavní výklad

### 1. Co je ORM a proč ho používáme

```
Tvůj kód (TypeScript / C# / Python)
        ▲
        │  prisma.post.findMany({ where: { published: true } })
        ▼
       ORM
        ▲
        │  SELECT * FROM Post WHERE published = true
        ▼
Relační databáze
```

### 2. Raw SQL × ORM

| | Raw SQL | ORM |
|---|---|---|
| **Syntaxe** | `SELECT * FROM Post WHERE id = 1` | `prisma.post.findUnique({ where: { id: 1 } })` |
| **Typová bezpečnost** | String, chyba za běhu | TypeScript typy, chyba při kompilaci |
| **Migrace** | Ruční SQL soubory | Automatické z definice schématu |
| **Přenositelnost DB** | Dialekty se liší | ORM to abstrahuje |
| **Refactoring** | IDE neumí najít všechny dotazy | TypeScript najde všechny použití |
| **Složité dotazy** | Plná kontrola, optimální | Escape hatch raw SQL |

**Pravidlo:** 90 % dotazů ORM zvládne výborně. Zbylých 10 % (komplexní reporty) → raw SQL pod ORM (Prisma má `$queryRaw`).

### 3. Code-first × DB-first

- **Code-first** (běžnější): schéma v kódu → migrace generuje SQL → aplikuje na DB. Pravda v kódu.
- **DB-first**: DB existuje → ORM generuje modely z ní. Pravda v DB.

**Prisma a EF Core typicky code-first.**

### 4. Přehled ORM nástrojů

| ORM | Jazyk | Prostředí |
|---|---|---|
| **Prisma** | TypeScript / JS | Next.js, Node.js |
| **Drizzle ORM** | TypeScript | Edge, serverless |
| **Entity Framework Core** | C# | ASP.NET Core |
| **TypeORM** | TypeScript | NestJS |
| **Hibernate** | Java | Spring |
| **SQLAlchemy** | Python | FastAPI, Flask |

### 5. Prisma 7 — klíčové změny oproti 6

| Co | Prisma 6 | Prisma 7 |
|---|---|---|
| **Generator** | `prisma-client-js` | `prisma-client` |
| **Generated do** | `node_modules/@prisma/client` | `app/generated/prisma/` (explicit) |
| **Connection URL** | `schema.prisma` | **`prisma.config.ts`** (NOVÉ) |
| **PrismaClient** | `new PrismaClient()` | **`new PrismaClient({ adapter })`** |
| **Driver** | Built-in Rust engine | **Driver adapter** (`@prisma/adapter-*`) |
| **Modules** | CommonJS + ESM | **ESM only** |
| **Engine** | Rust binary | **WebAssembly + JS** |

### 6. Setup Prismy 7

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install @prisma/adapter-better-sqlite3 better-sqlite3
npm install dotenv

# package.json: "type": "module"
npx prisma init
```

### 7. `prisma.config.ts` (NOVÉ)

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### 8. Schéma (`prisma/schema.prisma`)

```
generator client {
    provider = "prisma-client"        // ne prisma-client-js!
    output   = "../app/generated/prisma"
}

datasource db {
    provider = "sqlite"               // url NENÍ tady (v prisma.config.ts)
}

model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?                  // ? = nullable
    published Boolean  @default(false)
    createdAt DateTime @default(now())

    author   Author @relation(fields: [authorId], references: [id])
    authorId Int
}

model Author {
    id    Int    @id @default(autoincrement())
    name  String
    email String @unique

    posts Post[]                       // 1:N relace
}
```

### 9. Atributy schématu

**Column-level:**
- `@id` — primární klíč
- `@default(autoincrement())` — auto-increment
- `@default(now())` — aktuální čas
- `@unique` — unikátní
- `@relation(fields, references)` — FK
- `@updatedAt` — auto-update
- `@map("nazev_v_db")` — jiné jméno v DB

**Block-level:**
- `@@unique([col1, col2])` — složený UNIQUE
- `@@index([col])` — index
- `@@map("nazev_tabulky")` — jiné jméno tabulky

### 10. Migrace

```bash
# Vytvoří + aplikuje migraci
npx prisma migrate dev --name init

# V produkci (bez promptu)
npx prisma migrate deploy

# Reset (smaže vše, znovu aplikuje migrace)
npx prisma migrate reset

# Push bez migrace (rychlý prototyping)
npx prisma db push
```

**Co `migrate dev` udělá:**
1. Načte `prisma.config.ts` pro URL
2. Porovná aktuální schéma s předchozím
3. Vygeneruje SQL do `prisma/migrations/`
4. Aplikuje na DB
5. Regeneruje Prisma Client

### 11. Prisma Client (lib/prisma.ts)

```typescript
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**Klíčové:** sdílená instance v dev mode kvůli hot-reload (jinak connection pool overflow).

### 12. Prisma Client — základní operace

**Čtení:**
```typescript
// Všechny
const posts = await prisma.post.findMany();

// Jeden podle ID
const post = await prisma.post.findUnique({ where: { id: 1 } });

// First match
const first = await prisma.post.findFirst({ where: { published: true } });

// Filtrování + řazení + paging
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: { name: "axo" },                  // přes relaci
    createdAt: { gte: new Date("2026-01-01") },
    title: { contains: "Next" },              // SQL LIKE
  },
  orderBy: { createdAt: "desc" },
  take: 10,                                   // LIMIT 10
  skip: 20,                                   // OFFSET 20
});

// include = JOIN
const posts = await prisma.post.findMany({
  include: { author: true },
});

// select = vyber sloupce
const posts = await prisma.post.findMany({
  select: { id: true, title: true },
});
```

**Vytvoření:**
```typescript
const newPost = await prisma.post.create({
  data: {
    title: "Můj post",
    author: { connect: { id: 1 } },           // propoj existujícího
  },
});

// Batch
await prisma.post.createMany({
  data: [{ title: "A" }, { title: "B" }],
});
```

**Update:**
```typescript
await prisma.post.update({
  where: { id: 1 },
  data: { published: true },
});

// Upsert (update nebo create)
await prisma.post.upsert({
  where: { id: 1 },
  update: { title: "Změna" },
  create: { title: "Nový", authorId: 1 },
});
```

**Smazání:**
```typescript
await prisma.post.delete({ where: { id: 1 } });
await prisma.post.deleteMany({ where: { published: false } });
```

### 13. Relace v Prismě

```
// 1:N (jeden Author má víc Postů)
model Author { posts Post[] }
model Post {
    author   Author @relation(fields: [authorId], references: [id])
    authorId Int
}

// 1:1
model User { profile Profile? }
model Profile {
    user   User @relation(fields: [userId], references: [id])
    userId Int  @unique                       // UNIQUE = 1:1
}

// N:M (implicit)
model Post { tags Tag[] }
model Tag  { posts Post[] }
```

### 14. Prisma Studio

```bash
npx prisma studio
# Otevře http://localhost:5555 — GUI pro DB
```

Můžeš procházet, přidávat, editovat data bez SQL.

### 15. EF Core (alternativa pro C#)

```csharp
// Entity
public class Post {
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public Author Author { get; set; } = null!;
    public int AuthorId { get; set; }
}

// DbContext
public class AppDbContext : DbContext {
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Author> Authors => Set<Author>();
}

// LINQ dotazy
var posts = await db.Posts
    .Where(p => p.Published)
    .Include(p => p.Author)
    .OrderByDescending(p => p.CreatedAt)
    .ToListAsync();
```

**Migrace v EF Core:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Vztahy / kontrasty

- **ORM × Raw SQL:** typová bezpečnost + přenositelnost × plná kontrola + výkon
- **Code-first × DB-first:** schéma v kódu × DB první, generuj kód
- **`include` × `select`:** přidej relaci × jen vyjmenované sloupce
- **`findMany` × `findUnique`:** pole × 1 záznam nebo null
- **`migrate dev` × `db push`:** s migracemi × bez (prototyping)
- **Prisma × EF Core × Drizzle:** TS deklarativní × C# LINQ × TS SQL-blízký

---

## Časté otázky komise

**Q:** Co je ORM a proč ho používáme?
**A:** **Object-Relational Mapper** = vrstva mezi aplikačním kódem a relační databází. Místo psaní SQL pracuješ s **objekty a metodami** v jazyce, ORM je přeloží na SQL. **Výhody:** typová bezpečnost (chyby při kompilaci ne za běhu), přenositelnost mezi DB (SQLite vs PostgreSQL — ORM abstraktuje), automatické migrace, refactoring (IDE najde všechny použití). **Nevýhody:** overhead, méně kontroly nad přesným SQL pro komplexní reporty.

**Q:** Rozdíl code-first a db-first?
**A:** **Code-first** = definuji **strukturu DB v kódu** (schéma), migrace ji vygeneruje. Pravda v kódu. Běžnější přístup. **DB-first** = **DB už existuje**, ORM z ní vygeneruje modely a klienta. Pravda v DB. Hodí se pro legacy systémy. Prisma a EF Core typicky code-first.

**Q:** Co je migrace?
**A:** **Verzování změn DB schématu**, jako git verzuje kód. Při změně schématu (přidání sloupce, tabulky) ORM porovná aktuální stav s předchozím a vygeneruje **SQL skript** (CREATE TABLE, ALTER TABLE) pro tu změnu. Aplikuje ho na DB. Příkaz: `npx prisma migrate dev --name add-categories`. V produkci `migrate deploy`.

**Q:** Co jsou klíčové změny v Prismě 7 oproti 6?
**A:** **5 hlavních:** 1) `prisma.config.ts` — nový konfigurační soubor pro URL (přesunuto ze schema.prisma). 2) **Driver adapter** povinný — `new PrismaClient({ adapter })` místo `new PrismaClient()`. 3) **Generator `prisma-client`** (ne `prisma-client-js`) generuje mimo `node_modules` (explicit output). 4) **ESM only** — package.json musí mít `"type": "module"`. 5) **WebAssembly engine** místo Rust binary.

**Q:** Co je driver adapter v Prismě 7?
**A:** **Most mezi Prisma Client a JavaScript DB driverem**. Prisma 7 odstranila Rust engine, klient běží čistě v JS/WASM. Driver adapter zajišťuje skutečné připojení k DB. Příklady: `@prisma/adapter-better-sqlite3` (SQLite), `@prisma/adapter-pg` (PostgreSQL), `@prisma/adapter-d1` (Cloudflare D1). Lepší pro edge runtime, menší bundle.

**Q:** Rozdíl `include` a `select`?
**A:** **`include`** přidá **relaci k defaultu** (všechny scalar fields + tahle relace). Užitečné pro JOIN. **`select`** určuje, **co se vrátí** — limit fieldů. Pokud chceš jen některé sloupce a navíc relaci: `select: { id: true, title: true, author: { select: { name: true } } }`.

**Q:** Rozdíl `findMany` a `findUnique`?
**A:** **`findMany`** vrací **pole** záznamů (může být prázdné). Hodí se pro filtry, listy. **`findUnique`** vrací **jeden záznam nebo null**. Vyžaduje hledání podle **unique sloupce** (PK, UNIQUE). Hodí se pro detail podle ID. Vždy kontrolovat null před dalším použitím.

**Q:** Co je N+1 problém a jak se mu vyhnout?
**A:** **N+1** = **antipattern**: místo 1 dotazu s JOIN provedeš 1 dotaz pro získání seznamu + N dotazů pro každý prvek (1 + N). Příklad: načteš 100 postů, pak pro každý jednotlivě jeho autora = 101 dotazů. **Řešení:** Prisma `include`, EF Core `Include`, který naloaduje relaci v jednom dotazu (JOIN).

**Q:** Co je Prisma Studio?
**A:** **GUI prohlížeč databáze** v prohlížeči. `npx prisma studio` otevře `localhost:5555`. Můžeš procházet tabulky, přidávat/editovat/mazat záznamy **bez SQL**. Skvělé pro debug a maturitu (ukaž data komise vizuálně).

**Q:** Proč sdílená instance Prisma Client v dev modu?
**A:** Next.js v dev modu používá **hot reload** — při změně kódu se moduly přenačítají. Bez sdílené instance by `new PrismaClient()` byl volaný při každém reloadu, vytvářel by **nové connection k DB**, časem by se **vyčerpal connection pool**. Pattern `globalThis.prisma ?? createClient()` zaručí jednu instanci across reloads v dev modu.

---

## Časté chyby (Prisma 7)

- **Import z `'@prisma/client'`** → Prisma 7 generuje do `app/generated/prisma/client`
- **`new PrismaClient()` bez adapteru** → runtime error
- **Zapomenutý `import "dotenv/config"`** → `process.env.DATABASE_URL` = undefined
- **`url` v `schema.prisma`** → validation error (přesunout do `prisma.config.ts`)
- **`package.json` bez `"type": "module"`** → ESM import nefunguje
- **`findUnique` bez null check** → crash při `.title` na null
- **`find` v cyklu místo `include`** → N+1 query, pomalé
- **Editace schématu bez `migrate dev`** → DB neaktualizovaná
- **`.env` v gitu** → bezpečnostní leak (přidat do `.gitignore`)

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-20
