---
subject: SWI
number: 23
title: "Událostmi řízené programování"
tags: ["oop", "c-sharp", "architektura", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-19"
---

## Co řeknu jako první (30 s úvod)

**Událostmi řízené programování (EDP)** je paradigma, kde tok programu **neurčuje sekvenční kód**, ale **události**: kliky, signály, síťové requesty, timery. Místo *"udělej 1, pak 2, pak 3"* program říká *"když nastane X, zareaguj takto, jinak čekej"*. Klíčové role: **Publisher** (vystřelí událost), **Subscriber** (přihlásí se a reaguje přes handler), **Event** (most mezi nimi). Hlavní návrhový vzor: **Observer**.

---

## Klíčové pojmy

- **EDP (Event-Driven Programming)** — paradigma, kde události řídí tok
- **Publisher (vydavatel)** — objekt, ve kterém událost vzniká (tlačítko, časovač, senzor)
- **Subscriber (odběratel)** — objekt, který chce reagovat (formulář)
- **Event** — most mezi Publisher a Subscriber (interní seznam handlerů)
- **Event Handler** — metoda Subscribera, která se vykoná při události
- **Subscribe / Unsubscribe** — přihlášení / odhlášení
- **Observer pattern** — 1:N, přímá komunikace Subject → Observers
- **Pub-Sub** — N:M přes brokera (message broker, event bus)
- **Delegát (C#)** — předpis pro tvar metody (parametry + návratový typ)
- **`event` keyword (C#)** — zapouzdřený delegát, mimo třídu jen `+=` a `-=`
- **Loose coupling** — Publisher a Subscriber se neznají přímo

---

## Hlavní výklad

### 1. Imperativní × událostmi řízené

```
Imperativní:        Start → Krok 1 → Krok 2 → Krok 3 → Konec
                    (program ovládá tok)

Událostmi řízený:   Start → [čekám] → Událost → Reakce → [čekám] → ...
                    (události ovládají tok)
```

**Kde se EDP používá:**
- **GUI aplikace** — klik, klávesa, resize
- **Webový frontend** — klik, scroll, submit
- **Síťové aplikace** — příchozí HTTP request
- **IoT / embedded** — data ze senzoru, stisk tlačítka
- **Hry** — kolize, vstup hráče
- **Backend (Node.js)** — request, čtení souboru

V současnosti **dominantní paradigma pro UI**: bez něj by aplikace pořád blokovala.

### 2. Tři klíčové role

#### Publisher (vydavatel)
- Objekt, ve kterém událost **vzniká** (tlačítko, časovač, síťové spojení)
- **Neví, kdo poslouchá** — je mu jedno, jestli reaguje 1 nebo 10 nebo nikdo
- 2 věci: definuje událost + **vystřelí** ji (raise/fire/emit)

#### Subscriber (odběratel)
- Objekt, který **chce reagovat** na událost
- **Přihlásí se** k Publisheru (subscribe)
- Obsahuje **Event Handler** — metodu, která se vykoná

#### Event (událost)
- **Most** mezi Publisher a Subscriber
- Technicky = **seznam odkazů na metody** (handlery)
- Publisher událost vystřelí → framework projde seznam → zavolá každý handler

```
Publisher (Tlačítko)
    │
    │  vystřelí event Click
    ▼
Event (seznam handlerů)
    │
    ├──▶ Handler1 (zavře okno)
    ├──▶ Handler2 (přehraje zvuk)
    └──▶ Handler3 (zapíše log)
```

### 3. Loose coupling — klíčová vlastnost

**Publisher a Subscriber se neznají přímo.** Tlačítko neví, co se má stát po kliku. Posluchač neví, kdo událost vystřelil. Komunikují **přes rozhraní events**.

**Důsledky:**
- **Modularita** — přidávat/odebírat subscribery bez změny publishera
- **Znovupoužitelnost** — publisher je univerzální
- **Testovatelnost** — snadno se mockují

### 4. Návrhové vzory v EDP

#### Observer pattern (GoF, behaviorální)
- **Subject (Publisher) zná Observers (Subscribers)** přímo
- Drží **seznam** observerů, volá `notify()`
- 1:N přímá komunikace

```
Subject ─── notify() ───▶ Observer1
                    ───▶ Observer2
                    ───▶ Observer3
```

| Role | Co dělá |
|---|---|
| **Subject** (Publisher) | Drží seznam, volá `notify()` |
| **Observer** (Subscriber) | Implementuje `update()`, registruje se |
| `subscribe()` / `attach()` | Přihlášení |
| `unsubscribe()` / `detach()` | Odhlášení |
| `notify()` | Zavolá `update()` na všech |

#### Publish-Subscribe (Pub-Sub)
- Volnější varianta. Publisher **NEMÁ přímou referenci na subscribery**, místo toho posílá zprávy přes **prostředníka** (message broker, event bus)
- Subscribery se přihlašují k **typu zprávy / topicu**
- N:M přes broker

```
Publisher ──▶ Message ──▶ Subscriber1
              Broker  ──▶ Subscriber2
Publisher ──▶ (Bus)   ──▶ Subscriber3
```

|  | Observer | Pub-Sub |
|---|---|---|
| **Propojení** | Přímé | Přes brokera |
| **Topicy** | Ne | Ano |
| **Komunikace** | 1:N přímá | N:M přes prostředníka |
| **Použití** | Desktop UI (WinForms, WPF) | Mikroslužby, Kafka, RabbitMQ |
| **Latence** | Bleskově | Vyšší (broker overhead) |

### 5. Implementace v C#: Delegát + Event

#### Delegát — předpis pro tvar metody
```csharp
public delegate void VideoEncodedEventHandler(object source, EventArgs args);
```
Delegát = "typesafe ukazatel na funkci". Metody s daným podpisem se do něj dají uložit.

#### Event — zapouzdřený delegát
```csharp
public event VideoEncodedEventHandler VideoEncoded;
```
`event` keyword **omezí přístup**. Mimo třídu lze jen `+=` (subscribe) a `-=` (unsubscribe). **Bez `event`** by kdokoli mohl přepsat seznam handlerů.

#### Kompletní příklad

```csharp
// PUBLISHER
public class VideoEncoder
{
    public event EventHandler<VideoEventArgs> VideoEncoded;

    public void Encode(string filename)
    {
        Console.WriteLine($"Kóduji {filename}...");
        OnVideoEncoded(filename);
    }

    protected virtual void OnVideoEncoded(string filename)
    {
        VideoEncoded?.Invoke(this, new VideoEventArgs { Filename = filename });
        //          ^^ null-conditional: neselže, když nikdo neposlouchá
    }
}

public class VideoEventArgs : EventArgs
{
    public string Filename { get; set; }
}

// SUBSCRIBER
public class MailService
{
    public void OnVideoEncoded(object source, VideoEventArgs e)
    {
        Console.WriteLine($"Email: Video '{e.Filename}' bylo zakódováno.");
    }
}

// PROPOJENÍ
var encoder = new VideoEncoder();
var mailService = new MailService();

encoder.VideoEncoded += mailService.OnVideoEncoded;   // Subscribe
encoder.Encode("vacation.mp4");
encoder.VideoEncoded -= mailService.OnVideoEncoded;   // Unsubscribe
```

#### Konvence pro event handler v .NET
```csharp
void Handler(object sender, EventArgs e)
{
    // sender = kdo událost vystřelil (Publisher)
    // e      = data o události
}
```

Pro vlastní data se dědí z `EventArgs`:
```csharp
public class ClickEventArgs : EventArgs
{
    public int X { get; set; }
    public int Y { get; set; }
}
```

### 6. Implementace v JavaScriptu

```javascript
const button = document.getElementById("submit");

// Subscribe
button.addEventListener("click", function(e) {
    console.log("Kliknuto na:", e.clientX, e.clientY);
});

// Unsubscribe (vyžaduje stejnou referenci!)
const handler = (e) => console.log("klik");
button.addEventListener("click", handler);
button.removeEventListener("click", handler);
```

**⚠️ Klasický chyták:** `removeEventListener` musí dostat **přesně stejnou referenci**. Anonymní funkce nelze odebrat — dvě anonymní funkce se stejným textem jsou různé objekty.

### Mapování JS ↔ C#

| C# | JavaScript |
|---|---|
| `button.Click += handler` | `button.addEventListener("click", handler)` |
| `button.Click -= handler` | `button.removeEventListener("click", handler)` |
| `EventArgs e` | `Event e` |
| `sender` | `e.target` / `e.currentTarget` |
| `event` keyword | (žádný ekvivalent, JS je dynamický) |

### 7. Memory leak při zapomenutém odhlášení

```
Publisher → drží referenci na Subscriber (přes event)
GC vidí: "Subscriber má živou referenci → nesmazat"
Subscriber zůstává v paměti, i když ho aplikace už nepotřebuje
```

**Řešení:** vždy `unsubscribe` (`-=` v C#, `removeEventListener` v JS) když Subscriber končí.

**Moderní JS — AbortController** (cleanup více listenerů naráz):
```javascript
const controller = new AbortController();
window.addEventListener("resize", handler1, { signal: controller.signal });
window.addEventListener("scroll", handler2, { signal: controller.signal });

controller.abort();   // zruší obě naráz
```

### 8. DOM eventy: bubbling, capturing, delegation

**Bubbling** — event **bublá od cíle k rodičům**:
```
btn → middle → outer → body → html → document
```

**Capturing** — opačně, od kořene k cíli (zřídka používáno, druhý parametr `addEventListener(..., true)`).

**Event delegation** — listener na **rodiči** místo na každém dítěti:
```javascript
// ❌ Špatně: listener na každém li
todoListItems.forEach(li => li.addEventListener("click", ...));

// ✓ Lépe: jeden listener na rodiči
todoList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log(e.target.textContent);
    }
});
```

Výhody event delegation: 1 listener bez ohledu na počet, funguje i pro **dynamicky přidané** prvky.

**`stopPropagation`** zastaví bubbling, **`preventDefault`** zruší default chování (submit, scroll).

---

## Vztahy / kontrasty

- **EDP × imperativní:** události řídí tok × kód řídí tok
- **Observer × Pub-Sub:** přímá komunikace × přes brokera
- **Delegát × event:** delegát je tvar funkce, event je zapouzdřený delegát s omezeným přístupem
- **`+=` × `=`:** `+=` přidá handler, `=` přepíše celý seznam (nelze s `event` keyword)
- **Bubbling × capturing:** dolů × nahoru, default je bubbling
- **Synchronní × async event:** sync handler proběhne hned, async po event loopu (setTimeout, Promise)

---

## Časté otázky komise

**Q:** Co je událostmi řízené programování?
**A:** Programovací paradigma, kde **tok programu neurčuje lineární kód, ale události** — kliky, signály, requests, timery. Místo *"udělej 1, 2, 3 a skonči"* aplikace čeká a reaguje na vstupy. Klíčové role: **Publisher** (vystřelí událost), **Subscriber** (přihlásí se a reaguje přes handler), **Event** (most mezi nimi). Dominantní paradigma pro **UI**.

**Q:** Jaké tři role definují EDP?
**A:** **Publisher (vydavatel)** — objekt, ve kterém událost vzniká (tlačítko, časovač). Neví, kdo poslouchá. **Subscriber (odběratel)** — objekt, který chce reagovat. Přihlásí se a obsahuje **Event Handler** (metodu, která se vykoná). **Event** — most mezi nimi, technicky seznam handlerů. Publisher vystřelí → framework projde seznam → zavolá handlery.

**Q:** Co je loose coupling v EDP a proč je výhoda?
**A:** **Publisher a Subscriber se navzájem neznají přímo** — komunikují přes rozhraní events. Tlačítko neví, co se má stát po kliku; posluchač neví, kdo událost vystřelil. **Výhody:** modularita (přidávat/odebírat subscribery bez změny publishera), znovupoužitelnost (publisher je univerzální), testovatelnost (snadné mockování).

**Q:** Jaký je hlavní návrhový vzor v EDP?
**A:** **Observer pattern** od GoF (behaviorální). Subject (Publisher) drží **seznam observerů** a sám je notifikuje voláním `notify()`. Observer implementuje `update()` a registruje se přes `subscribe()` / `attach()`. Komunikace je **1:N přímá** (Subject zná Observers).

**Q:** Rozdíl mezi Observer a Pub-Sub patternem?
**A:** **Observer**: Subject **drží přímou referenci** na observery, komunikace 1:N. Typicky desktop UI. **Pub-Sub**: Publisher nemá referenci na subscribery, posílá přes **prostředníka (message broker, event bus)**. Subscribers se přihlašují k **topic / type**. N:M, vyšší latence, ale persistence a retry. Typicky mikroslužby (Kafka, RabbitMQ).

**Q:** Jak se implementuje událost v C#?
**A:** Přes **delegát** (předpis pro tvar metody — parametry + návratový typ) a **`event`** keyword (zapouzdří delegát). `event EventHandler<TArgs> NazevUdalosti;` — mimo třídu lze jen `+=` (subscribe) a `-=` (unsubscribe). **Vyvolání** přes `NazevUdalosti?.Invoke(this, args)` — null-conditional pro případ, že nikdo neposlouchá. Konvence: handler má signaturu `void Handler(object sender, EventArgs e)`.

**Q:** Co je memory leak při eventech a jak se mu vyhnout?
**A:** Publisher **drží referenci na Subscribera** přes event handler. GC vidí živou referenci → Subscriber **nemůže být uvolněn**, i když ho aplikace už nepotřebuje. Aplikace pomalu nabývá zombie objekty. **Řešení:** vždy `unsubscribe` (`-=` v C#, `removeEventListener` v JS) když Subscriber končí. V moderním JS **AbortController** umí cleanup více listenerů naráz.

**Q:** Co je bubbling v DOM?
**A:** **DOM event prochází od cíle (target) směrem nahoru k rodičovským elementům.** Klik na `<button>` postupně proběhne na button → jeho rodiči `<div>` → další rodič → ... → `document`. Default chování. Lze zastavit přes `e.stopPropagation()`. Opačná fáze je **capturing** (shora dolů, zřídka používáno).

**Q:** Co je event delegation a kdy se hodí?
**A:** Místo přidávání event listeneru na **každý prvek seznamu**, přidáš ho na **rodiče** a v handleru zjistíš, kdo byl cíl přes `e.target`. **Výhody:** 1 listener bez ohledu na počet prvků, funguje i pro **dynamicky přidané** elementy (nově přidané `<li>` taky bude reagovat). Hodí se pro dlouhé/měnící se seznamy.

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-18
