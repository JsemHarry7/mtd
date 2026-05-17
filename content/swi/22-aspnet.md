---
subject: SWI
number: 22
title: "ASP.NET"
tags: ["web", "aspnet", "c-sharp", "razor", "http", "architektura"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

> **Cíl:** umět o tom mluvit 10-15 min souvisle, k tomu odpovědět na 2-3 follow-up otázky komise.
> **Předmět:** SWI
> **Popis (oficiální):** Návrh webové aplikace ASP.NET, Razor Pages, handlery, Razor syntaxe, služby, konfigurace aplikace
> **Souvisí s:** SWI 21 (RESTful — JSON, HTTP), SWI 19 (Webové aplikace — SPA/MPA, kódy), DAT 17 (REST API praxe), DAT 18 (Razor Pages praxe), DAT 19 (Tag Helpers + validace)

---

## Co řeknu jako první (30 s úvod)

ASP.NET (přesněji **ASP.NET Core**) je multiplatformní framework od Microsoftu pro tvorbu webových aplikací a API v jazyce **C#**. Nabízí několik způsobů vývoje — **Razor Pages**, **MVC**, **Web API**, **Blazor** — sjednocuje je společný runtime, vlastní HTTP server **Kestrel** a **middleware pipeline**. Klíčové vlastnosti jsou **Dependency Injection** zabudovaná do frameworku, **konfigurace v `appsettings.json`** a **Razor syntaxe** pro dynamický HTML.

---

## Klíčové pojmy

- **ASP.NET Core** — multiplatformní (Windows/Linux/Mac) webový framework, postavený nad .NET
- **Kestrel** — vlastní HTTP server zabudovaný v ASP.NET Core (běží jako proces, `.exe`)
- **Middleware** — řetězec komponent, kterými prochází každý request → response
- **Razor Pages** — page-based přístup, každá stránka = pár souborů (`.cshtml` + `.cshtml.cs`)
- **MVC** — Model-View-Controller, tradiční architektura
- **Web API** — REST API endpointy v C#
- **Blazor** — SPA/komponentový framework od MS (server-side nebo WebAssembly)
- **PageModel** — třída v `.cshtml.cs` souboru, drží data + handler metody pro stránku
- **Handler** — metoda v PageModelu (`OnGet`, `OnPost`, `OnPostSave`…) zpracovávající HTTP požadavek
- **Razor syntax** — vkládání C# kódu do HTML přes `@`
- **Služba (service)** — třída s business logikou, registruje se v DI kontejneru
- **DI (Dependency Injection)** — vzor, kdy třída dostává své závislosti zvenčí (typicky přes konstruktor)
- **Lifetime služby** — Singleton / Scoped / Transient
- **appsettings.json** — konfigurační soubor (connection strings, klíče, URLs)

---

## Hlavní výklad

### 1. Návrh webové aplikace v ASP.NET — typy aplikací

ASP.NET Core nabízí 4 hlavní šablony / typy aplikací — výběr závisí na povaze projektu:

**Razor Pages**
- Page-based přístup — **každá stránka má vlastní model** (logiku v `.cshtml.cs`) a šablonu (`.cshtml`)
- Ideální pro **CRUD formuláře, jednoduché weby, server-rendered HTML**
- Jednodušší než MVC pro page-oriented scénáře
- Moderní defaultní volba MS pro nové webové aplikace

**MVC (Model-View-Controller)**
- **Tradiční přístup** — controllery sdružují akce, view jsou v sdílených složkách
- Vhodné pro **velké aplikace** s komplexní routovací logikou
- Více souborů na stránku než Razor Pages

**Web API (REST API)**
- Jen **JSON endpointy**, žádné HTML
- Pro **mobilní aplikace, SPA, externí integrace**
- **Minimal API** — odlehčená varianta bez controllerů (jen `app.MapGet("/", ...)` v Programu)

**Blazor**
- **SPA framework** v C#, nahrazuje JavaScript v prohlížeči
- Dvě varianty: **Server-side** (rendering na serveru, SignalR pro UI updaty) a **WebAssembly** (C# kód běží přímo v prohlížeči)
- Komponentový model, podobný Reactu, ale v C#

### 2. Flow aplikace (architektura, jak request projde aplikací)

ASP.NET Core aplikace běží **jako samostatný proces** (`.exe`) s vlastním HTTP serverem **Kestrel** — to znamená **sjednocená konfigurace** bez závislosti na IIS/Apache.

**Dva typické deployment modely:**

1. **Přímo na Kestrelu** — vhodné pro Docker kontejnery, dev prostředí, interní služby
2. **Za reverzní proxy** — typicky **IIS / NGINX / load balancer**. Proxy řeší TLS (HTTPS terminace), hlavičky, statické soubory; Kestrel za ní zpracovává jen aplikační logiku

**Reverzní proxy** ≠ klasická proxy. Klasická proxy chrání **klienta**, reverzní proxy chrání **server** (klient netuší o existenci reálné aplikační instance).

**Cesta requestu — middleware pipeline:**

```
Request → [Middleware 1] → [Middleware 2] → … → Endpoint → Response
```

Každé middleware je článek řetězu. Typické middleware:
- `UseHttpsRedirection` — vynucení HTTPS
- `UseStaticFiles` — servírování CSS, JS, obrázků
- `UseRouting` — určení, který endpoint zpracuje request
- `UseAuthentication` / `UseAuthorization` — bezpečnost (viz SWI 20)
- `MapRazorPages` / `MapControllers` — vlastní zpracování endpointem

**Endpoint** = konkrétní handler v PageModelu / kontroleru / Minimal API, který request fyzicky obslouží.

### 3. Razor Pages — způsob vývoje

Razor Pages je page-based — každá stránka má **dva soubory ve dvojici**:

```
Pages/
  Register.cshtml        ← HTML šablona + Razor syntax
  Register.cshtml.cs     ← PageModel (C# logika, handlery)
```

**Výhody oproti MVC:**
- **Přehlednější struktura** — vše související se stránkou je pohromadě
- **Lepší pro CRUD a formuláře** — handlery a model jsou v jednom souboru s view
- **Méně boilerplate** — žádné controllery, routes jsou implicitní podle umístění v `Pages/`

**Routing** v Razor Pages je **konvenční** — soubor `Pages/Register.cshtml` automaticky odpovídá URL `/Register`. Soubor `Pages/Admin/Users.cshtml` odpovídá `/Admin/Users`.

### 4. Handlery (HTTP metody na stránce)

**Handler** = veřejná metoda v PageModelu, která zpracovává konkrétní HTTP request.

**Pojmenovací konvence:**
- `OnGet()` — zpracuje **GET** request (typicky první načtení stránky)
- `OnPost()` — zpracuje **POST** request (odeslání formuláře)
- `OnGetAsync()` / `OnPostAsync()` — asynchronní varianty (pro DB volání, API calls)

**Pojmenované handlery** — pokud má stránka více tlačítek (např. *Uložit* a *Smazat*), lze handlery pojmenovat:

```csharp
public IActionResult OnPostSave() { /* uloží data */ }
public IActionResult OnPostDelete() { /* smaže data */ }
```

V HTML formuláři pak tlačítko vybírá konkrétní handler atributem `asp-page-handler`:

```html
<button asp-page-handler="Save">Uložit</button>
<button asp-page-handler="Delete">Smazat</button>
```

**Předávání parametrů** handlerům — z URL nebo formuláře přes argumenty metody:

```csharp
public IActionResult OnGet(int id) { /* /Detail?id=42 */ }
```

**Návratové typy handlerů:**
- `void` / `IActionResult` / `PageResult` — vrátí samotnou stránku (Razor render)
- `RedirectToPage("Confirm")` — přesměruje na jinou stránku (HTTP 302)
- `NotFound()` / `BadRequest()` — chybové stavy

### 5. Razor syntaxe

Razor je **šablonovací jazyk** umožňující vkládat C# kód do HTML. Přepínání mezi HTML a C# se děje znakem **`@`**.

**Inline výraz** — `@vyraz` vypíše hodnotu:

```html
<h1>@Model.Name</h1>
<p>Cena: @Model.Price Kč</p>
```

**Blok C# kódu** — `@{ ... }`:

```cshtml
@{
    var greeting = "Ahoj, " + Model.UserName;
    var isAdmin = User.IsInRole("Admin");
}
<p>@greeting</p>
```

**Řídicí konstrukce** — `@if`, `@foreach`, `@switch`:

```cshtml
@if (Model.IsLoggedIn)
{
    <p>Vítej, @Model.UserName!</p>
}
else
{
    <a href="/Login">Přihlásit se</a>
}

<ul>
@foreach (var item in Model.Items)
{
    <li>@item.Name — @item.Price Kč</li>
}
</ul>
```

**Šablony stránek** — `_Layout.cshtml` definuje sdílený rám (header, footer, nav); jednotlivé stránky se vykreslí v místě `@RenderBody()`.

### 6. Služby a Dependency Injection (DI)

**Služba** = třída, která drží business logiku (např. `OrderService`, `EmailSender`, `MovieRepository`). Logika se NEPÍŠE do PageModelu / kontroleru — ten ji jen volá.

**Dependency Injection** = vzor, kdy si třída **nevytváří závislosti sama** (`new OrderService()`), ale **dostává je zvenčí** přes konstruktor:

```csharp
public class IndexModel : PageModel
{
    private readonly OrderService _orders;

    public IndexModel(OrderService orders)  // DI to dodá automaticky
    {
        _orders = orders;
    }

    public void OnGet()
    {
        var list = _orders.GetAll();
    }
}
```

ASP.NET Core má **DI kontejner zabudovaný** — služby se registrují v `Program.cs`:

```csharp
builder.Services.AddScoped<OrderService>();
```

**Tři lifetime typy služeb:**

| Lifetime | Sdílení instance | Použití |
|---|---|---|
| **Singleton** | Jedna instance pro celou aplikaci (všechny requesty) | Cache, configuration, logování |
| **Scoped** | Jedna instance na jeden HTTP request (všechny komponenty v requestu sdílí) | DbContext, business services |
| **Transient** | Pokaždé nová instance | Lehké stateless služby, mailery |

**Mantra:** *"Singleton žije navždy, Scoped žije s requestem, Transient žije jen na voláním."*

**Výhody DI:**
- **Testovatelnost** — v testech lze nahradit reálnou službu mockem
- **Vyměnitelnost** — implementaci lze změnit, aniž by se sahalo do volajícího kódu
- **Lifetime management** — kontejner se stará o vytváření a uklízení

### 7. Konfigurace aplikace

Veškeré nastavení aplikace je centralizováno v **`appsettings.json`**:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MovieDb;Trusted_Connection=True"
  },
  "Logging": {
    "LogLevel": { "Default": "Information" }
  },
  "JwtSecret": "your-secret-key-here"
}
```

**Proč konfigurační soubor?**
- **Nesahá se do kódu** — změna URL DB nevyžaduje rekompilaci
- **Per-prostředí varianty:** `appsettings.Development.json`, `appsettings.Production.json` — různé hodnoty pro dev/prod, framework načte správnou podle prostředí
- **Sekrety** — pro citlivá data (API klíče, hesla) se používá **User Secrets** (dev) nebo **Azure Key Vault** / **environment variables** (prod), nikdy se necommitují

**Čtení konfigurace** v kódu — přes `IConfiguration` z DI:

```csharp
public class IndexModel : PageModel
{
    private readonly IConfiguration _config;

    public IndexModel(IConfiguration config) { _config = config; }

    public void OnGet()
    {
        var conn = _config.GetConnectionString("Default");
        var secret = _config["JwtSecret"];
    }
}
```

Lépe: silně typovaný **Options pattern** — definuje se třída s vlastnostmi, namapuje se na sekci v JSON, vstřikuje se přes DI jako `IOptions<MyOptions>`.

---

## Konkrétní příklady

### Minimální Program.cs (entry point Razor Pages app)

```csharp
var builder = WebApplication.CreateBuilder(args);

// Registrace služeb (DI)
builder.Services.AddRazorPages();
builder.Services.AddScoped<OrderService>();
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Middleware pipeline
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();

app.Run();
```

### Razor Page — Register.cshtml + Register.cshtml.cs

```cshtml
@page
@model RegisterModel

<h1>Registrace</h1>

<form method="post">
    <label asp-for="Input.Email"></label>
    <input asp-for="Input.Email" />
    <span asp-validation-for="Input.Email"></span>

    <button type="submit">Registrovat</button>
</form>
```

```csharp
public class RegisterModel : PageModel
{
    private readonly UserService _users;

    [BindProperty]
    public InputModel Input { get; set; }

    public RegisterModel(UserService users) { _users = users; }

    public void OnGet() { }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid) return Page();

        _users.Register(Input.Email);
        return RedirectToPage("Confirm");
    }

    public class InputModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
```

---

## Vztahy / kontrasty

- **Razor Pages × MVC:** Razor Pages = page-based, jeden file-pair na stránku. MVC = controller-based, akce a view ve sdílených složkách. Pro CRUD/formuláře RP, pro velké multi-action API MVC.
- **Razor Pages × Web API:** RP vrací **HTML** (server-rendered), Web API vrací **JSON** (REST endpointy). Pokud aplikace má HTML stránky i API, lze obojí kombinovat v jedné apce.
- **Razor Pages × Blazor:** RP renderuje HTML jednou na requestu (klasická MPA). Blazor je SPA — interaktivní komponenty bez full-page reloadu.
- **Kestrel × IIS:** Kestrel = ASP.NET vlastní HTTP server (běží uvnitř .exe). IIS = klasický Windows server, dnes typicky **před** Kestrelem jako reverzní proxy.
- **Singleton × Scoped × Transient:** sdílení instance — globálně / na request / nikdy.
- **Konfigurace × User Secrets × Environment variables:** appsettings = veřejné, User Secrets = dev sekrety, env vars = produkční sekrety.

---

## Časté otázky komise

**Q:** Jaké typy aplikací umí ASP.NET Core vytvořit?
**A:** Hlavně **Razor Pages** (page-based webové aplikace s HTML), **MVC** (tradiční controller-based), **Web API** (REST endpointy v JSON, případně Minimal API bez controllerů), a **Blazor** (SPA framework v C#, server-side nebo WebAssembly). Všechny sdílí společný runtime, Kestrel server a middleware pipeline.

**Q:** Co je Kestrel a jak souvisí s reverzní proxy?
**A:** Kestrel je HTTP server zabudovaný v ASP.NET Core — aplikace běží jako proces (`.exe`) s vlastním serverem. V dev prostředí aplikace běží přímo na Kestrelu na localhostu. V produkci bývá před Kestrelem reverzní proxy (IIS / NGINX / load balancer), která řeší TLS, statické soubory, distribuci zátěže. Proxy chrání server (na rozdíl od klasické proxy, která chrání klienta).

**Q:** Jak v Razor Pages funguje handler?
**A:** Handler je veřejná metoda v PageModelu (souboru `.cshtml.cs`), která zpracovává konkrétní HTTP request. **`OnGet()`** zpracuje GET (typicky první načtení stránky), **`OnPost()`** zpracuje POST (odeslání formuláře). Pokud má stránka více akcí (Save, Delete), používají se **pojmenované handlery** (`OnPostSave`, `OnPostDelete`), v HTML se vybírá přes atribut `asp-page-handler`. Handler vrací `IActionResult` — typicky `Page()` (zůstat na stránce), `RedirectToPage("Other")` (přesměrovat) nebo chybový kód.

**Q:** Co je Razor syntaxe?
**A:** Razor je šablonovací jazyk umožňující vkládat C# do HTML přes znak `@`. Inline výraz `@Model.Name` vypíše hodnotu. Blok `@{ ... }` umožňuje víc řádků C# logiky. Řídicí konstrukce: `@if`, `@foreach`, `@switch`. Klíčová pro dynamický rendering — jedna `.cshtml` šablona obsluží libovolný počet záznamů z databáze.

**Q:** Co je Dependency Injection a proč ji ASP.NET Core používá?
**A:** DI je návrhový vzor, kdy si třída nevytváří své závislosti sama, ale dostává je zvenčí (typicky přes konstruktor). ASP.NET Core má **DI kontejner zabudovaný v frameworku** — služby se registrují v `Program.cs` (`AddScoped`, `AddSingleton`, `AddTransient`) a framework je automaticky dodává do PageModelu, controlleru nebo jiné služby. Výhody: testovatelnost (snadná výměna za mock), vyměnitelnost implementace, automatický lifetime management.

**Q:** Jaké jsou tři lifetime typy služeb a kdy je použít?
**A:** **Singleton** — jedna instance pro celou aplikaci po celou dobu běhu (vhodné pro cache, konfiguraci, logging). **Scoped** — jedna instance na jeden HTTP request, sdílená všemi komponentami v rámci toho requestu (vhodné pro DbContext, business services). **Transient** — pokaždé nová instance při každém požadavku z DI kontejneru (vhodné pro lehké stateless služby, mailery). Mantra: *Singleton žije navždy, Scoped žije s requestem, Transient žije jen na voláním.*

**Q:** Jak se konfiguruje ASP.NET Core aplikace?
**A:** Centrálně v souboru **`appsettings.json`** v rootu projektu — obsahuje connection stringy, klíče, URLs, logging level. Existují **per-prostředí varianty** (`appsettings.Development.json`, `appsettings.Production.json`), framework načte správnou podle aktuálního prostředí. Pro citlivá data se v produkci používají environment variables nebo Azure Key Vault, v devu **User Secrets** (necommitují se do gitu). Konfigurace se v kódu čte přes `IConfiguration` injektovanou přes DI, lépe přes silně typovaný Options pattern.

---

## Co bych ještě měl vědět (volně)

- **Tag Helpers** (vlastní téma DAT 19) — atributy `asp-for`, `asp-page-handler`, `asp-validation-for` zjednodušují HTML form a propojují je s PageModelem
- **Model Binding** — automatické mapování formulářových dat na C# objekt (`[BindProperty]`)
- **Validace** — atributy nad properties (`[Required]`, `[EmailAddress]`, `[StringLength(50)]`) + `ModelState.IsValid` na serveru, `_ValidationScriptsPartial` pro klientskou validaci
- **Identity** — předpřipravený systém pro registraci/přihlašování (UserManager, SignInManager, default Razor Pages pro Login/Register/ResetPassword)
- **Entity Framework Core** — ORM od MS, integrován do DI přes `AddDbContext`, migrace přes `dotnet ef migrations`
- **HotReload** — `dotnet watch run` umožňuje editovat C# / Razor za běhu bez restartu
- **Endpoint routing** — středový bod ASP.NET Core, sjednocuje routing pro Razor Pages, MVC i Web API přes jeden middleware

---

## ⚠️ Nejisté / k ověření

- Spolužácký materiál tvrdí, že Razor syntaxe se přepíná **pouze** přes `@` — v praxi existují i konstrukce `@:` (escape do HTML uvnitř C# bloku) a `<text>...</text>` (multi-line HTML v rámci C# bloku). Pro maturitu stačí znát `@` a `@{}`.
- Pojem **"služba"** v ASP.NET = jakákoli třída registrovaná v DI kontejneru. Nemá speciální atribut ani base class — pouze konvence v registraci.

---

## Status

- **Sebehodnocení (před):** 2/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-15
