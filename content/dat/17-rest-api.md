---
subject: DAT
number: 17
title: "REST API v ASP.NET Core"
tags: ["web", "rest", "api", "aspnet", "c-sharp", "http", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

> **Cíl:** za 30 min u PC implementovat Web API controller s 4-8 endpointy + 15 min defense.
> **Předmět:** DAT (praktická zkouška)
> **Popis (oficiální):** Implementace Rest API v ASP.NET, routování, controller, metody HTTP (GET, POST, PUT, DELETE)
> **Souvisí s:** SWI 21 (RESTful teorie), SWI 22 (ASP.NET), DAT 18/19 (Razor Pages — alternativní cesta v ASP.NET)

---

## Co řeknu jako první (30 s úvod)

Web API v ASP.NET Core je **HTTP rozhraní vracející JSON** (na rozdíl od Razor Pages, které vrací HTML). Postavené na **controllerech** — třídách, které dědí z `ControllerBase` a mají **action metody** mapované na HTTP metody (GET/POST/PUT/DELETE) přes atributy. Data se serializují do JSON automaticky, statusy přes pomocné metody (`Ok()`, `NotFound()`, `Created()`, `NoContent()`).

---

## Klíčové pojmy

- **Controller** — třída v `Controllers/`, dědí z `ControllerBase`, sdružuje endpointy
- **`[ApiController]`** — atribut nad třídou, aktivuje API conventions (auto model validation, automatic 400 při chybě)
- **`[Route("api/[controller]")]`** — base route, `[controller]` = jméno třídy bez "Controller" suffixu (`MoviesController` → `/api/movies`)
- **Action metoda** — public metoda v kontroleru, vrací `IActionResult` nebo `ActionResult<T>` nebo přímo objekt
- **HTTP atributy** — `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]` nad action metodou
- **`[FromQuery]` / `[FromBody]` / `[FromRoute]`** — odkud framework parametr získá
- **DbContext** — Entity Framework Core přístup k DB, dostaný DI v konstruktoru
- **Minimal API** — alternativa bez controllerů, jen `app.MapGet("/", ...)` v `Program.cs`

---

## Hlavní výklad

### 1. Controller — kostra

```csharp
using Microsoft.AspNetCore.Mvc;
using MovieClub.Data;
using MovieClub.Models;
using Microsoft.EntityFrameworkCore;

namespace MovieClub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MoviesController(ApplicationDbContext db)
    {
        _db = db;
    }

    // ... action metody
}
```

**Klíčové:**

- **`: ControllerBase`** — ne `: Controller` (Controller je pro MVC s views, ControllerBase pro Web API bez views, lehčí)
- **`[ApiController]`** — auto-validace modelu, automatický 400 při neplatném modelu, parsing z route/query/body
- **`[Route("api/[controller]")]`** — všechny endpointy budou pod `/api/movies` (MoviesController → "movies")
- **DI v konstruktoru** — DbContext dodán automaticky

### 2. HTTP metody a routing v controllerech

```csharp
// GET /api/movies
[HttpGet]
public ActionResult<List<Movie>> GetAll()
{
    return _db.Movies.OrderByDescending(m => m.Votes).ToList();
}

// GET /api/movies/42
[HttpGet("{id}")]
public ActionResult<Movie> GetById(int id)
{
    var movie = _db.Movies.Find(id);
    if (movie == null) return NotFound();
    return movie;
}

// GET /api/movies/unwatched
[HttpGet("unwatched")]
public ActionResult<List<Movie>> GetUnwatched()
{
    return _db.Movies.Where(m => !m.IsWatched).ToList();
}

// POST /api/movies
[HttpPost]
public ActionResult<Movie> Create(Movie movie)
{
    movie.Votes = 0;
    movie.IsWatched = false;
    movie.AddedAt = DateTime.UtcNow;
    _db.Movies.Add(movie);
    _db.SaveChanges();
    return CreatedAtAction(nameof(GetById), new { id = movie.MovieId }, movie);
}

// PUT /api/movies/42
[HttpPut("{id}")]
public IActionResult Update(int id, Movie movie)
{
    var existing = _db.Movies.Find(id);
    if (existing == null) return NotFound();

    existing.Title = movie.Title;
    existing.Year = movie.Year;
    existing.Genre = movie.Genre;
    _db.SaveChanges();

    return NoContent();   // 204
}

// DELETE /api/movies/42
[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var movie = _db.Movies.Find(id);
    if (movie == null) return NotFound();

    _db.Movies.Remove(movie);
    _db.SaveChanges();

    return NoContent();
}
```

**Pozor na pořadí routes:**

`[HttpGet("unwatched")]` musí být **PŘED** `[HttpGet("{id}")]` v kódu — jinak by routing pokusil interpretovat `unwatched` jako parametr `id` typu `int` a selhal s 400. **Specifičtější routes (literály) PŘED generičtějšími (parametry).**

### 3. Parametry — odkud framework data vezme

```csharp
// Query string: GET /api/movies?genre=Horror&addedBy=Honza
[HttpGet]
public ActionResult<List<Movie>> Filter([FromQuery] string? genre, [FromQuery] string? addedBy)
{
    var query = _db.Movies.AsQueryable();
    if (!string.IsNullOrEmpty(genre))    query = query.Where(m => m.Genre == genre);
    if (!string.IsNullOrEmpty(addedBy))  query = query.Where(m => m.AddedBy == addedBy);
    return query.ToList();
}

// Route parameter: PUT /api/movies/42
[HttpPut("{id}")]
public IActionResult Update([FromRoute] int id, [FromBody] Movie movie) { ... }

// Body: POST /api/movies (s JSON v body)
[HttpPost]
public ActionResult<Movie> Create([FromBody] Movie movie) { ... }
```

**Defaulty (s `[ApiController]`):**

| Zdroj parametru | Default kdy |
|---|---|
| `[FromRoute]` | Pokud jméno parametru matchne placeholder v route (`{id}`) |
| `[FromQuery]` | Pro **primitivní typy** (string, int, bool) — pokud nematchne route |
| `[FromBody]` | Pro **komplexní objekty** (Movie, User, ...) |

Atributy stačí psát explicitně, **když chceš jiný default** — nebo aby bylo jasnější.

### 4. Návratové typy a status kódy

| Návrat | HTTP status | Použití |
|---|---|---|
| `Ok(data)` nebo přímý objekt | **200 OK** | Úspěšný GET, vrátí data |
| `Created(uri, data)` | **201 Created** | Úspěšný POST, vrátí nový resource |
| `CreatedAtAction(nameof(X), new { id }, data)` | **201 Created** + `Location` header | Idiomatic POST |
| `NoContent()` | **204 No Content** | Úspěšný PUT/DELETE bez vrácení dat |
| `NotFound()` | **404 Not Found** | Resource neexistuje |
| `BadRequest("msg")` | **400 Bad Request** | Chybný vstup od klienta |
| `Unauthorized()` | **401 Unauthorized** | Chybí autentizace |
| `Forbid()` | **403 Forbidden** | Autentizován, ale bez práv |
| `Conflict()` | **409 Conflict** | Konflikt (např. duplicitní vote) |
| `StatusCode(500)` | **500 Internal Server Error** | Chyba serveru |

**Mantra:**
- POST → **201 Created** (úspěch) + Location header
- PUT/DELETE → **204 No Content** (úspěch, žádná odpověď)
- GET → **200 OK** (najde) nebo **404 Not Found** (nenajde)

### 5. Konfigurace API v Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();             // Web API controllers
builder.Services.AddOpenApi();                 // Scalar/Swagger UI

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();                          // /openapi/v1.json + Scalar UI
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();                          // routing podle [Route] atributů
app.Run();
```

`AddControllers()` × `AddRazorPages()` × `AddControllersWithViews()` — různá DI registrace podle toho, co aplikace umí.

### 6. Entity Framework Core — práce s DB

```csharp
// Načtení všech
var all = _db.Movies.ToList();

// Filtrování
var horrors = _db.Movies.Where(m => m.Genre == "Horror").ToList();

// Jeden podle id (primary key)
var one = _db.Movies.Find(42);

// Komplexnější query
var winner = _db.Movies
    .Where(m => !m.IsWatched)
    .OrderByDescending(m => m.Votes)
    .ThenBy(m => m.AddedAt)
    .FirstOrDefault();

// Vložení
_db.Movies.Add(newMovie);
_db.SaveChanges();           // ← důležité, jinak se nezapíše

// Update
existing.Title = "Nový titul";
_db.SaveChanges();           // EF auto-detekuje změny

// Smazání
_db.Movies.Remove(movie);
_db.SaveChanges();
```

**Async varianty** (rychlejší při velkém zatížení):

```csharp
var movies = await _db.Movies.ToListAsync();
var one = await _db.Movies.FindAsync(42);
await _db.SaveChangesAsync();
```

Pro async action metodu: `public async Task<ActionResult<Movie>> GetById(int id)`.

### 7. Migrace databáze

```bash
# Vytvoř migraci po změně modelu
dotnet ef migrations add NazevMigrace

# Aplikuj na DB
dotnet ef database update

# Smaž poslední migraci (pokud ještě nebyla aplikována)
dotnet ef migrations remove
```

Migrace je C# soubor (v `Migrations/`), který popisuje **změnu schématu DB** (CREATE TABLE, ADD COLUMN...). EF ho aplikuje SQL kódem.

---

## Konkrétní příklady

### Voting endpoint (POST s query parametrem)

```csharp
// In-memory tracking: kdo už hlasoval pro jaký film
private static readonly List<(int MovieId, string Voter)> _votes = new();

[HttpPost("{id}/vote")]
public IActionResult Vote(int id, [FromQuery] string voter)
{
    var movie = _db.Movies.Find(id);
    if (movie == null) return NotFound();
    if (movie.IsWatched) return BadRequest("Film už byl shlédnut");

    if (_votes.Any(v => v.MovieId == id && v.Voter == voter))
        return BadRequest("Už jsi hlasoval pro tento film");

    _votes.Add((id, voter));
    movie.Votes++;
    _db.SaveChanges();
    return Ok(new { movie.MovieId, movie.Votes });
}
```

Volání: `POST /api/movies/3/vote?voter=Petra`

### Filtrování přes query

```csharp
[HttpGet]
public ActionResult<List<Movie>> GetAll([FromQuery] string? genre, [FromQuery] string? addedBy)
{
    var query = _db.Movies.AsQueryable();

    if (!string.IsNullOrEmpty(genre))
        query = query.Where(m => m.Genre == genre);

    if (!string.IsNullOrEmpty(addedBy))
        query = query.Where(m => m.AddedBy == addedBy);

    return query.OrderByDescending(m => m.Votes).ToList();
}
```

---

## Vztahy / kontrasty

- **Web API × Razor Pages:** Web API vrací **JSON** přes controllery, Razor Pages vrací **HTML** přes PageModely. Web API pro mobil/SPA/integrace, Razor Pages pro klasické weby.
- **Controller × ControllerBase:** Controller dědí z ControllerBase + má `View()` metodu (pro MVC s views). ControllerBase je lehčí, jen API. Pro REST API použít ControllerBase.
- **Minimal API × Controllers:** Minimal API = `app.MapGet("/api/x", () => ...)` v Program.cs, bez controllerů. Vhodné pro malé API. Controllery pro větší, strukturovanější.
- **`[FromRoute]` × `[FromQuery]` × `[FromBody]`:** kde framework hledá parametr. Route = path, Query = `?key=value`, Body = JSON v requestu.
- **`Ok(x)` × `return x`:** S `[ApiController]` se `return x` automaticky obalí jako `Ok(x)`. Explicitně `Ok(x)` je čitelnější.
- **Sync × Async EF:** ToList vs ToListAsync, Find vs FindAsync, SaveChanges vs SaveChangesAsync. Async neblokuje vlákno při čekání na DB.

---

## Časté otázky komise (defense)

**Q:** Jaký je rozdíl mezi Web API a Razor Pages v ASP.NET Core?
**A:** Web API vrací **JSON** přes **controllery** s **action metodami** mapovanými na HTTP metody přes atributy (`[HttpGet]`, `[HttpPost]`...). Razor Pages vrací **HTML** přes **PageModely** s **handlery** (`OnGet`, `OnPost`). Web API pro mobilní aplikace, SPA frontend (React), integrace s jinými systémy. Razor Pages pro klasické server-rendered weby.

**Q:** Co dělá atribut `[ApiController]`?
**A:** Aktivuje API conventions: 1) **Auto model validation** — když `ModelState.IsValid` je false, automaticky vrátí 400 Bad Request s detaily. 2) **Default binding sources** — primitiva z query, komplexní objekty z body. 3) **Problem details** — chyby ve standardizovaném JSON formátu. Bez něj bys musel ručně volat `if (!ModelState.IsValid) return BadRequest()` v každé akci.

**Q:** Jak funguje routing v Web API controlleru?
**A:** Routing je **atributový** — definovaný atributy nad třídou a metodou. `[Route("api/[controller]")]` nad třídou = base path (`[controller]` je placeholder pro jméno třídy bez "Controller"). `[HttpGet("{id}")]` nad metodou = HTTP metoda + relativní path. Kompletní URL = base + relativní. Specifičtější routes musí být **definovány před** generičtějšími — jinak by `/unwatched` se mohlo interpretovat jako parametr `{id}`.

**Q:** Kdy vrátit 200 vs 201 vs 204?
**A:** **200 OK** = úspěšný GET (vrátí data). **201 Created** = úspěšný POST (nový resource vytvořen, vrátí ho + Location header). **204 No Content** = úspěšný PUT nebo DELETE (operace proběhla, není co vracet).

**Q:** Jak controller dostane DbContext?
**A:** Přes **Dependency Injection v konstruktoru**. V `Program.cs` se DbContext zaregistruje (`builder.Services.AddDbContext<ApplicationDbContext>(...)` jako Scoped). Framework při každém requestu vytvoří instanci DbContextu (lifetime = jeden request) a dodá ji do konstruktoru controlleru. Controller pak může volat `_db.Movies.ToList()` atd. Po requestu se DbContext zlikviduje.

**Q:** Co je `CreatedAtAction` a proč je idiomatic pro POST?
**A:** Pomocná metoda, která vrací **201 Created** + nastaví `Location` HTTP header na URL, kde lze nový resource najít. Volání: `CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie)`. Klient (typicky SPA frontend) z hlavičky vyčte URL, kde najde detail nového záznamu. Idiomatic REST pattern.

**Q:** Co je rozdíl mezi `[FromQuery]`, `[FromRoute]`, `[FromBody]`?
**A:** Říká frameworku, **odkud má vzít hodnotu parametru** action metody. **`[FromRoute]`** = z URL path (`/api/movies/42` → `id=42`). **`[FromQuery]`** = z query stringu (`?genre=Horror` → `genre="Horror"`). **`[FromBody]`** = z JSON body requestu (deserializuje do C# objektu). S `[ApiController]` se defaulty určí automaticky (primitiva z query, objekty z body).

---

## Co bych ještě měl vědět (volně)

- **DTO** (Data Transfer Object) — pro velké aplikace se vrací DTO třídy místo entitních (oddělení API kontraktu od DB schématu)
- **AutoMapper** — knihovna pro mapování mezi DTO a entitou
- **JSON serialization** — `System.Text.Json` (default), camelCase property names v JSON
- **CORS** — pokud React frontend volá API na jiné doméně, nutné `app.UseCors(...)`
- **Authentication** — JWT Bearer tokens (`[Authorize]` atribut nad controller/akcí)
- **Validation atributes** — `[Required]`, `[StringLength]`, `[Range]` v entity model, `[ApiController]` je vynutí automaticky
- **OpenAPI / Swagger / Scalar** — auto-generated UI pro testování API

---

## ⚠️ Nejisté / k ověření

- `AddOpenApi()` je nový v .NET 9+ a poskytuje OpenAPI spec. Pro UI buď Swagger UI nebo **Scalar** (modernější). MovieClubPractice používá Scalar (`/scalar`).
- Order routes — pokud máš `[HttpGet("unwatched")]` po `[HttpGet("{id}")]`, framework v některých verzích umí rozlišit (string "unwatched" nelze parsovat jako int), v jiných ne. Bezpečné je literály psát **dřív**.

---

## Status

- **Sebehodnocení (před):** 2/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
