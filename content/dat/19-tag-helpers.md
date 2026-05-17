---
subject: DAT
number: 19
title: "ASP.NET Tag Helpers a formuláře"
tags: ["web", "aspnet", "razor", "c-sharp", "http", "frontend"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

> **Cíl:** za 30 min u PC vytvořit/upravit Razor Pages aplikaci s formulářem + validací + víc handlery.
> **Předmět:** DAT (praktická zkouška)
> **Popis (oficiální):** ASP.NET Tag Helpers, formuláře, vstupní prvky, validace
> **Souvisí s:** DAT 18 (Razor Pages základ), SWI 22 (ASP.NET teorie)

---

## Co řeknu jako první (30 s úvod)

**Tag Helpers** jsou speciální HTML atributy (s prefixem `asp-`), které **server-side** doplňují HTML o data z PageModelu — propojení formuláře s C#, validační hlášky, generování odkazů, výběr handleru. Místo psaní `name=""`, `id=""`, `value=""` ručně se používá jeden `asp-for="..."` a framework atributy vyrenderuje sám.

---

## Klíčové pojmy

- **Tag Helper** — HTML atribut s prefixem `asp-*`, který se na serveru přepíše na standardní HTML
- **`@addTagHelper`** — direktiva v `_ViewImports.cshtml`, registruje Tag Helpers (default už scaffold má)
- **Model binding** — automatické naplnění C# property z formulářových dat (viz DAT 18)
- **Validační atributy** — atributy nad property v InputModel (`[Required]`, `[EmailAddress]`, `[Range]`, `[StringLength]`)
- **`ModelState`** — slovník výsledků validace; `.IsValid` říká, zda všechno prošlo
- **Pojmenované handlery** — `OnPostSave`, `OnPostDelete` — různé akce na jedné stránce

---

## Hlavní výklad

### 1. Tag Helpers — princip a registrace

Tag Helpers se aktivují přes `_ViewImports.cshtml`:

```cshtml
@using YourApp
@namespace YourApp.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

`*, Microsoft.AspNetCore.Mvc.TagHelpers` = aktivuj všechny Tag Helpers z této assembly. **Default scaffold to už má** — nemusíš psát.

**Princip transformace** — Razor parser vidí HTML s `asp-*` atributem, **přepíše ho na čisté HTML**:

| Razor (server-side input) | HTML (klient dostane) |
|---|---|
| `<input asp-for="Input.Email" />` | `<input type="email" name="Input.Email" id="Input_Email" value="..." data-val="true" data-val-required="..." />` |
| `<label asp-for="Input.Email">Email</label>` | `<label for="Input_Email">Email</label>` |
| `<a asp-page="/About">O nás</a>` | `<a href="/About">O nás</a>` |

Klient (browser) **nikdy nevidí** `asp-*` atributy — vidí jen výsledné čisté HTML.

### 2. Formulářové Tag Helpers — vstupní prvky

#### `<form>`

```html
<form method="post">
    <!-- ... -->
</form>
```

Implicit: `action` se nastaví na **aktuální URL stránky**. Pro POST na jinou stránku:

```html
<form method="post" asp-page="/Subscribe">
    <!-- ... -->
</form>
```

#### `<input asp-for="X" />`

```html
<input asp-for="Input.Email" class="form-control" />
```

Razor vyrenderuje:
- `name="Input.Email"` (pro model binding)
- `id="Input_Email"` (pro label propojení)
- `value="@Model.Input.Email"` (předvyplnění)
- `type="email"` automaticky pokud property má `[EmailAddress]`
- `data-val-*` atributy pro klientskou validaci (jQuery validate)

**Typ inputu** je odvozený z C# typu property a atributů:

| C# property | Vyrendrovaný `type` |
|---|---|
| `string Email` s `[EmailAddress]` | `type="email"` |
| `int Age` | `type="number"` |
| `DateTime Birth` | `type="date"` |
| `bool IsActive` | `type="checkbox"` |
| `[DataType(DataType.Password)] string Pwd` | `type="password"` |
| `[DataType(DataType.PhoneNumber)] string Phone` | `type="tel"` |

#### `<label asp-for="X">`

```html
<label asp-for="Input.Email" class="form-label">Email</label>
```

Vyrenderuje `<label for="Input_Email">Email</label>` — automaticky napojí label na input.

**Bonus:** pokud property má atribut `[Display(Name = "E-mailová adresa")]`, label si vezme jméno odtud místo *"Email"*.

#### `<select asp-for="X" asp-items="Y">`

```html
<select asp-for="Input.Course" asp-items="@(new SelectList(Model.Courses))" class="form-select">
    <option value="">-- Zvolte kurz --</option>
</select>
```

- `asp-for="Input.Course"` — binding (kam uložit zvolenou hodnotu)
- `asp-items="@(new SelectList(Model.Courses))"` — items pro dropdown

**SelectList** přijímá:
- `new SelectList(IEnumerable<string>)` — pro jednoduchý seznam stringů
- `new SelectList(IEnumerable<object>, "ValueProp", "TextProp")` — pro objekty (např. `Course` třída s Id + Name):
  ```csharp
  new SelectList(Model.Courses, "Id", "Name")
  ```

#### `<textarea asp-for="X">`

```html
<textarea asp-for="Input.Message" rows="5" class="form-control"></textarea>
```

Stejný princip — bind + validace.

### 3. Validace — atributy v InputModel

```csharp
public class InputModel
{
    [Required(ErrorMessage = "Jméno je povinné")]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required, EmailAddress(ErrorMessage = "Neplatný formát emailu")]
    public string Email { get; set; } = "";

    [Range(18, 120, ErrorMessage = "Věk musí být mezi 18 a 120")]
    public int Age { get; set; }

    [Required]
    public string Course { get; set; } = "";

    [Compare("Password", ErrorMessage = "Hesla se neshodují")]
    public string ConfirmPassword { get; set; } = "";
}
```

**Klíčové validační atributy:**

| Atribut | Co kontroluje | Příklad |
|---|---|---|
| `[Required]` | Hodnota není null ani prázdný string | `[Required] public string Name` |
| `[EmailAddress]` | Hodnota je validní email | `[EmailAddress] public string Email` |
| `[StringLength(50, MinimumLength = 2)]` | Délka řetězce | `[StringLength(20)] public string Code` |
| `[Range(0, 100)]` | Číslo v rozsahu | `[Range(18, 99)] public int Age` |
| `[RegularExpression(@"^\d{9}$")]` | Match regex | `[RegularExpression(@"^\+?\d+$")] public string Phone` |
| `[Compare("OtherProp")]` | Hodnoty se shodují | `[Compare("Password")] public string Confirm` |
| `[DataType(DataType.Date)]` | Typ pro UI (input type=date) | viz výše |

### 4. Zobrazení validačních hlášek

```html
<input asp-for="Input.Email" class="form-control" />
<span asp-validation-for="Input.Email" class="text-danger"></span>
```

`<span asp-validation-for="Input.Email">` se za běhu naplní textem chybové hlášky pro property `Input.Email` (pokud je nějaká).

**Souhrnný validation summary** — zobrazí všechny chyby naráz:

```html
<div asp-validation-summary="All" class="text-danger"></div>
```

`asp-validation-summary` možnosti:
- `"All"` — všechny chyby (model-level i property-level)
- `"ModelOnly"` — jen chyby na úrovni modelu (ne specifických polí)
- `"None"` — vypnuté

### 5. Klientská validace (JS)

Server-side validace běží **vždy** (po POSTu, kontrolou `ModelState.IsValid`). Pro **klientskou** validaci (chyby hned při psaní, bez round-tripu na server) přidáme partial:

```cshtml
@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

Tento partial načítá jQuery + jQuery Validation, který umí číst `data-val-*` atributy v HTML a kontrolovat formulář před odesláním.

**Pozor:** klientská validace je **convenience, ne bezpečnost**. Server-side validace MUSÍ proběhnout vždy — útočník může klientskou validaci obejít.

### 6. Pojmenované handlery + `asp-page-handler`

Když má stránka víc tlačítek/akcí (Save, Delete, Approve...):

```csharp
public class ListModel : PageModel
{
    public List<Subscription> Items { get; set; } = new();

    public void OnGet() { /* načti Items */ }

    public IActionResult OnPostDelete(int id)
    {
        // smazat item s id
        return RedirectToPage();   // refresh stejné stránky
    }

    public IActionResult OnPostDetail(int id)
    {
        return RedirectToPage("Detail", new { id });
    }
}
```

V HTML se vybírá tlačítkem `asp-page-handler`:

```html
<form method="post">
    <button type="submit" asp-page-handler="Delete" asp-route-id="@item.Id" class="btn btn-danger">Smazat</button>
    <button type="submit" asp-page-handler="Detail" asp-route-id="@item.Id" class="btn btn-info">Detail</button>
</form>
```

- `asp-page-handler="Delete"` → router pošle POST do metody `OnPostDelete`
- `asp-route-id="@item.Id"` → URL parametr (předá se jako `int id` v signature handleru)

### 7. Odkazy mezi stránkami

```html
<a asp-page="/Subscribe">Přihlásit se</a>
<a asp-page="/Subscribe" asp-route-course="C#">Přihlásit se na C#</a>
<a asp-page="/Detail" asp-route-id="42">Detail #42</a>
```

- `asp-page="/X"` — cílová Razor Page
- `asp-route-{name}="value"` — parameter (do query stringu nebo pretty URL)

Razor vyrenderuje:

```html
<a href="/Subscribe">Přihlásit se</a>
<a href="/Subscribe?course=C%23">Přihlásit se na C#</a>
<a href="/Detail/42">Detail #42</a>   <!-- pokud Detail má @page "{id:int}" -->
```

---

## Konkrétní příklady

### Kompletní formulář s validací

```html
@page
@model SubscribeModel

<h1>Přihláška na kurz</h1>

<form method="post" class="needs-validation">
    <div class="mb-3">
        <label asp-for="Input.Name" class="form-label"></label>
        <input asp-for="Input.Name" class="form-control" />
        <span asp-validation-for="Input.Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Input.Email" class="form-label"></label>
        <input asp-for="Input.Email" class="form-control" />
        <span asp-validation-for="Input.Email" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Input.Course" class="form-label"></label>
        <select asp-for="Input.Course"
                asp-items="@(new SelectList(Model.AvailableCourses))"
                class="form-select">
            <option value="">-- Zvolte kurz --</option>
        </select>
        <span asp-validation-for="Input.Course" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-primary">Přihlásit</button>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

### Tabulka s tlačítky (asp-page-handler)

```html
<table class="table">
    <thead>
        <tr><th>Jméno</th><th>Email</th><th>Kurz</th><th>Akce</th></tr>
    </thead>
    <tbody>
        @foreach (var item in Model.Items)
        {
            <tr>
                <td>@item.Name</td>
                <td>@item.Email</td>
                <td>@item.Course</td>
                <td>
                    <form method="post" class="d-inline">
                        <button type="submit" asp-page-handler="Detail"
                                asp-route-id="@item.Id" class="btn btn-sm btn-info">Detail</button>
                        <button type="submit" asp-page-handler="Delete"
                                asp-route-id="@item.Id" class="btn btn-sm btn-danger"
                                onclick="return confirm('Opravdu smazat?')">Smazat</button>
                    </form>
                </td>
            </tr>
        }
    </tbody>
</table>
```

---

## Vztahy / kontrasty

- **Tag Helpers × HTML Helpers (staré MVC):** Tag Helpers = HTML-like syntax (`<input asp-for>`). HTML Helpers = method calls (`@Html.TextBoxFor(...)`). Tag Helpers jsou **moderní default** v ASP.NET Core, čitelnější.
- **Client-side × server-side validace:** klient = rychlá UX, server = bezpečnost. **Vždy obojí**, server NIKDY nevynechat.
- **`asp-page` × `asp-action`/`asp-controller`:** asp-page pro Razor Pages, asp-action/asp-controller pro MVC. Nemíchat.
- **`asp-page-handler` × form action:** handler vybírá metodu uvnitř stejné stránky. Pokud potřebuješ POSTovat na **jinou stránku**, použij `<form asp-page="/Other">`.
- **`asp-route-{name}` × query string:** asp-route automaticky generuje URL podle routing pravidel (pretty URL pokud existuje, query string jinak). Nemusíš ručně skládat URL.

---

## Časté otázky komise (defense)

**Q:** Co jsou Tag Helpers a proč existují?
**A:** Tag Helpers jsou speciální HTML atributy s prefixem `asp-*`, které server-side rozšiřují HTML o data z PageModelu. Razor parser je při renderování přepíše na standardní HTML atributy (`name`, `id`, `value`, `data-val-*`). Existují kvůli **DRY** — místo psaní 5 atributů ručně pro každý input napíšeš jeden `asp-for="X"` a framework zbytek doplní podle typu property a jejích atributů. Klient nikdy nevidí `asp-*` — jen čisté HTML.

**Q:** Co je `asp-for` a co všechno přidá do HTML?
**A:** Tag Helper, který propojí input/label/textarea s property v PageModelu. Vyrenderuje `name="..."` (pro model binding), `id="..."` (pro label-input pair), `value="..."` (předvyplnění), `type="..."` (odvozené z C# typu / atributů jako `[EmailAddress]`), a `data-val-*` atributy pro klientskou validaci podle validačních atributů property.

**Q:** Jaký je rozdíl mezi `asp-for` a `asp-items` v `<select>`?
**A:** `asp-for` určuje **kam uložit** zvolenou hodnotu (binding na property v PageModelu). `asp-items` určuje **co nabídnout** v dropdownu (kolekce možností typicky obalená v `new SelectList(...)`).

**Q:** Jak funguje validace v Razor Pages?
**A:** Validační atributy (`[Required]`, `[EmailAddress]`, `[Range]`...) se píší **nad property v InputModel**. Po POSTu framework provede model binding + validaci, výsledky zapíše do `ModelState`. V handleru `OnPost()` se kontroluje `ModelState.IsValid` — pokud false, vrátí `Page()` a `<span asp-validation-for>` v HTML zobrazí chybové hlášky. Pro klientskou validaci se přidá `_ValidationScriptsPartial` (jQuery), který kontroluje formulář bez round-tripu.

**Q:** Co je pojmenovaný handler a jak se aktivuje z HTML?
**A:** Pojmenovaný handler = metoda `OnPostXxx()` nebo `OnGetXxx()` v PageModelu, kde `Xxx` je vlastní jméno (Save, Delete, Detail). Umožňuje mít víc akcí na jedné stránce. Z HTML se aktivuje tlačítkem s atributem `asp-page-handler="Xxx"`. Parametry handleru se předávají přes `asp-route-{name}="value"`.

**Q:** Proč klientská validace nestačí?
**A:** Klientská validace běží v JS v prohlížeči — uživatel ji může obejít (vypnout JS, manipulovat s DOM, přímo poslat HTTP request přes Postman). Je to jen **UX vrstva** pro rychlou zpětnou vazbu. **Server-side validace** je jediná **bezpečnostní** vrstva — server vždy musí kontrolovat `ModelState.IsValid` v handleru a nikdy nedůvěřovat datům z klienta.

**Q:** Jak by se v Razor Pages udělal odkaz na detail záznamu s ID?
**A:** `<a asp-page="/Detail" asp-route-id="@item.Id">Detail</a>`. Razor vyrenderuje URL podle routing pravidel — pokud `/Detail` má `@page "{id:int}"`, výsledná URL bude `/Detail/42`. Pokud nemá, bude `/Detail?id=42`. Programátor se nestará o skládání URL ručně.

---

## Co bych ještě měl vědět (volně)

- **`asp-antiforgery="false"`** — vypne CSRF token (default je on, **nevypínat** bez důvodu)
- **Custom Tag Helpers** — můžeš si napsat vlastní (`public class MyTagHelper : TagHelper`), ale na zkoušku nemusíš
- **Environment Tag Helper** — `<environment include="Development">...</environment>` rendruje obsah jen v daném prostředí
- **Cache Tag Helper** — `<cache>...</cache>` cachuje fragment HTML
- **`asp-append-version="true"`** na `<script>` / `<link>` přidá hash souboru do URL pro cache busting

---

## ⚠️ Nejisté / k ověření

- `asp-for` umí v některých scénářích nesprávně určit `type="text"` místo specifického typu — pokud to nefunguje, dát `type` ručně přes `<input type="email" asp-for="...">`.
- Klientská validace pro custom atributy vyžaduje vlastní JS — default jQuery Validation pokrývá jen built-in atributy.

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-17
