---
subject: DAT
number: 18
title: "Razor Pages — zpracování požadavku"
tags: ["web", "aspnet", "razor", "c-sharp", "http", "frontend"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

> **Cíl:** za 30 min u PC vytvořit/upravit Razor Pages aplikaci podle zadání + 15 min defense s komisí.
> **Předmět:** DAT (praktická zkouška)
> **Popis (oficiální):** RazorPages, GET a POST požadavky, bindování dat, návratové metody (Redirect, Page), routování, pretty URL
> **Souvisí s:** SWI 22 (ASP.NET teorie), SWI 21 (HTTP metody), DAT 19 (Tag Helpers — navazuje)

---

## Cílový obrázek (architektura)

```
Pages/
  Register.cshtml         ← HTML šablona (formulář)
  Register.cshtml.cs      ← PageModel (OnGet, OnPost, validace)
  Confirm.cshtml          ← HTML šablona (zobrazení potvrzení)
  Confirm.cshtml.cs       ← PageModel (čte TempData / query params)
  _ViewStart.cshtml       ← (volitelné) layout setup
Program.cs                ← entry point, builder, middleware pipeline
appsettings.json          ← konfigurace
```

Aplikace běží na Kestrelu (`dotnet run` ji spustí na `https://localhost:5001`).

---

## 1. Struktura PageModelu (kostra)

```csharp
public class RegisterModel : PageModel
{
    // 1. Property pro binding formulářových dat
    [BindProperty]
    public InputModel Input { get; set; } = new();

    // 2. Property pro URL parametry / query string (GET)
    [BindProperty(SupportsGet = true)]
    public string? Email { get; set; }

    // 3. Property pro načítaný seznam (např. dropdown kurzů)
    public List<string> Courses { get; set; } = new();

    // 4. Handler GET — první načtení stránky
    public void OnGet()
    {
        Courses = new List<string> { "C#", "React", "SQL" };
        if (!string.IsNullOrEmpty(Email))
            Input.Email = Email;
    }

    // 5. Handler POST — odeslání formuláře
    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
        {
            // Re-loadnout dropdown při chybě
            Courses = new List<string> { "C#", "React", "SQL" };
            return Page();
        }

        // Předat data na další stránku přes TempData
        TempData["Name"] = Input.Name;
        TempData["Surname"] = Input.Surname;
        TempData["Email"] = Input.Email;
        TempData["Course"] = Input.Course;

        return RedirectToPage("Confirm");
    }

    // 6. Nested model pro formulářová data (umožňuje validační atributy)
    public class InputModel
    {
        [Required(ErrorMessage = "Jméno je povinné")]
        public string Name { get; set; } = "";

        [Required]
        public string Surname { get; set; } = "";

        [Required, EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public string Course { get; set; } = "";
    }
}
```

---

## 2. GET vs POST handlery

| Handler | Kdy se volá | Typický obsah |
|---|---|---|
| **`OnGet()`** | První návštěva stránky (`GET /Register`) | Načtení dropdown dat, předvyplnění z URL parametru |
| **`OnPost()`** | Odeslání formuláře (`POST /Register`) | Validace, uložení, redirect |
| **`OnGetAsync()`** | GET s asynchronními operacemi (DB, API) | `await db.GetCoursesAsync()` |
| **`OnPostAsync()`** | POST s asynchronními operacemi | `await db.SaveUserAsync(...)` |

**Pojmenované handlery** — když má stránka více tlačítek:

```csharp
public IActionResult OnPostSave() { /* uložit */ return RedirectToPage("List"); }
public IActionResult OnPostDelete(int id) { /* smazat */ return RedirectToPage("List"); }
```

V HTML formuláři se vybírá přes `asp-page-handler`:

```html
<button type="submit" asp-page-handler="Save">Uložit</button>
<button type="submit" asp-page-handler="Delete" asp-route-id="42">Smazat</button>
```

---

## 3. Model binding — jak data z formuláře dorazí do C#

Formulář v HTML:

```html
<form method="post">
    <input asp-for="Input.Name" />
    <input asp-for="Input.Email" />
    <select asp-for="Input.Course" asp-items="@(new SelectList(Model.Courses))"></select>
    <button type="submit">Registrovat</button>
</form>
```

**Klíč:** atribut **`[BindProperty]`** nad property v PageModelu. ASP.NET při POSTu automaticky:
1. Načte formulářová data podle jmen polí
2. Naplní property `Input`
3. Validuje podle atributů (`[Required]`, `[EmailAddress]`)
4. Pokud něco selže, `ModelState.IsValid == false`

**Pro GET parametry** (z URL `?email=anna@example.com`) — atribut `[BindProperty(SupportsGet = true)]`:

```csharp
[BindProperty(SupportsGet = true)]
public string? Email { get; set; }
```

Při `GET /Register?email=anna@example.com` se property automaticky naplní hodnotou z URL.

---

## 4. Návratové metody handleru

Handler vrací **`IActionResult`** — instrukci, **co se má stát po zpracování**:

| Návratová metoda | Co dělá | HTTP výsledek |
|---|---|---|
| **`Page()`** | Vrátí samotnou stránku (re-render) | 200 OK + HTML |
| **`RedirectToPage("Confirm")`** | Přesměruje na jinou Razor Page | 302 Redirect → `/Confirm` |
| **`RedirectToPage("Confirm", new { id = 42 })`** | Redirect s parametrem | 302 → `/Confirm?id=42` |
| **`Redirect("/external/url")`** | Redirect na libovolnou URL | 302 |
| **`NotFound()`** | Stránka neexistuje | 404 |
| **`BadRequest()`** | Chybný request od klienta | 400 |
| **`Content("text")`** | Vrátí čistý text | 200 + plain text |

**Typický pattern pro POST:**

```csharp
public IActionResult OnPost()
{
    if (!ModelState.IsValid)
        return Page();           // chyba — zůstaň na stránce, ukaž validační hlášky

    SaveToDatabase(Input);
    return RedirectToPage("Confirm");   // úspěch — přesměruj na potvrzení
}
```

**PRG pattern** (Post-Redirect-Get) — po POSTu **vždy redirect**, nikdy přímo re-render. Důvod: pokud uživatel zmáčkne F5 na výsledné stránce, prohlížeč by chtěl POST opakovat → duplicitní uložení.

---

## 5. TempData — předání dat mezi stránkami

**TempData** = slovník dostupný **jeden následující request** (typicky po redirectu). Drží se v cookie / session, automaticky se maže po přečtení.

**Uložení (v OnPost před redirectem):**

```csharp
TempData["Name"] = Input.Name;
TempData["Email"] = Input.Email;
return RedirectToPage("Confirm");
```

**Čtení (na druhé stránce):**

```csharp
public class ConfirmModel : PageModel
{
    public string? Name { get; set; }
    public string? Email { get; set; }

    public void OnGet()
    {
        Name = TempData["Name"] as string;
        Email = TempData["Email"] as string;
    }
}
```

**Pozor:** TempData podporuje jen **primitivní typy** (string, int...). Pro objekt → JSON serialize / nebo použít session.

**Alternativy k TempData pro předání dat:**
- **Redirect s query parametry** — `RedirectToPage("Confirm", new { name = "Anna", email = "..." })` → `/Confirm?name=Anna&email=...`
- **Session** — pro větší / strukturovaná data, persistentní napříč více requesty
- **Database** — pro permanentní uložení (registrace by reálně šla do DB)

---

## 6. Routování + pretty URL

**Konvenční routing** — odpovídá struktuře `Pages/`:

| Soubor | URL |
|---|---|
| `Pages/Index.cshtml` | `/` |
| `Pages/Register.cshtml` | `/Register` |
| `Pages/Admin/Users.cshtml` | `/Admin/Users` |

**Pretty URL přes `@page` direktivu** — na začátku `.cshtml` lze nadefinovat custom route s parametry:

```cshtml
@page "{id:int}"
@model DetailModel

<h1>Detail produktu @Model.Id</h1>
```

Tahle stránka pak je dostupná na URL `/Detail/42` (místo `/Detail?id=42`). Parametr `{id:int}` znamená, že `id` musí být celé číslo.

**Volitelné parametry:**

```cshtml
@page "{slug?}"
```

→ stránka dostupná na `/Page` i na `/Page/cokoliv`.

**Typy parametrů:** `{id:int}`, `{slug:alpha}`, `{date:datetime}`, `{guid:guid}`, `{name:minlength(3)}`...

---

## 7. Validace

**Server-side validace** přes atributy v InputModelu:

```csharp
[Required(ErrorMessage = "Jméno je povinné")]
public string Name { get; set; }

[Required, EmailAddress]
public string Email { get; set; }

[StringLength(50, MinimumLength = 3)]
public string Surname { get; set; }

[Range(18, 99)]
public int Age { get; set; }
```

**V handleru** se kontroluje `ModelState.IsValid`:

```csharp
public IActionResult OnPost()
{
    if (!ModelState.IsValid)
        return Page();   // re-render s validačními hláškami

    // ... pokračování
}
```

**V HTML šabloně** se zobrazují chyby pomocí Tag Helperů:

```html
<input asp-for="Input.Email" />
<span asp-validation-for="Input.Email" class="text-danger"></span>
```

---

## Časté otázky komise (defense)

**Q:** Jak Razor Pages zpracovává GET vs POST request?
**A:** Když přijde **GET** na `/Register`, framework najde `Pages/Register.cshtml.cs`, vytvoří instanci `RegisterModel` (DI vstříkne závislosti), zavolá `OnGet()`, ten naplní property, pak se vyrenderuje šablona `Register.cshtml`. Při **POST** se zavolá `OnPost()`, který přijme bind-ovaná data v `[BindProperty]` properties, zvaliduje (`ModelState`), a vrátí `IActionResult` — typicky `Page()` při chybě nebo `RedirectToPage()` při úspěchu.

**Q:** Co je `[BindProperty]`?
**A:** Atribut, který říká ASP.NET: "při POSTu naplň tuto property hodnotami z formuláře, jména polí matchni podle property". S `SupportsGet = true` funguje i pro GET parametry z URL/query stringu.

**Q:** Jaký je rozdíl mezi `Page()` a `RedirectToPage()` jako návratovou hodnotou?
**A:** `Page()` znamená *"zůstaň na této stránce, vrať mi HTML znovu"* — typicky při chybě validace, kdy uživatel musí opravit formulář. `RedirectToPage("X")` znamená *"přesměruj na stránku X"* — typicky po úspěšném POSTu (PRG pattern), aby F5 neposlal request znovu.

**Q:** Co je TempData a kdy se používá?
**A:** TempData je slovník dostupný **jeden následující request** (typicky po redirectu). Používá se pro předání zprávy/dat mezi stránkami při PRG patternu — např. po POSTu na `/Register` se data uloží do TempData, pak `RedirectToPage("Confirm")` a `ConfirmModel.OnGet()` data z TempData přečte. Automaticky se maže po přečtení.

**Q:** Co je pretty URL v Razor Pages?
**A:** Vlastní route definovaná přes `@page "{id:int}"` direktivu — umožňuje místo `/Detail?id=42` použít `/Detail/42`. Parametry mohou mít typy (`:int`, `:guid`, `:datetime`) a být volitelné (`{slug?}`). Cestou se mapují na property handler metody nebo přímo na property PageModelu.

**Q:** Jak validuju formulář v Razor Pages?
**A:** Validační atributy se píší nad property v `InputModel` (`[Required]`, `[EmailAddress]`, `[StringLength]`, `[Range]`). V `OnPost()` se kontroluje `ModelState.IsValid` — pokud false, vrátit `Page()` s validačními hláškami. V šabloně se chyby zobrazují přes `<span asp-validation-for="Input.Email">`. Klientskou validaci aktivuje partial `_ValidationScriptsPartial.cshtml` (jQuery validation).

**Q:** Jak se v Razor Pages dělá routování?
**A:** Konvenčně podle umístění souboru — `Pages/Register.cshtml` → URL `/Register`, `Pages/Admin/Users.cshtml` → `/Admin/Users`. Pro custom route se používá `@page` direktiva s parametry (`@page "{id:int}"`). Routing řeší middleware `UseRouting()` + `MapRazorPages()` registrované v `Program.cs`.

---

## Co bych ještě měl vědět (volně)

- **`_ViewStart.cshtml`** — definuje layout pro všechny stránky v adresáři
- **`_Layout.cshtml`** — sdílená HTML kostra (header, footer, nav)
- **`_ValidationScriptsPartial.cshtml`** — aktivuje klientskou JS validaci (jQuery)
- **Anti-forgery token** — Razor Pages automaticky přidává CSRF token do POST formulářů
- **`@inject`** — injektuje službu přímo do šablony bez nutnosti přes PageModel
- **Page filters** — middleware specifický pro Razor Pages (IPageFilter)

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
