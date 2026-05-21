---
subject: SWI
number: 18
title: "Vývoj aplikací v React"
tags: ["web", "react", "frontend", "javascript"]
share: public
status: review
speakingTime: 12
updated: "2026-05-21"
---

## Co řeknu jako první (30 s úvod)

**React** je **JavaScriptová knihovna** pro tvorbu uživatelských rozhraní, vyvinutá firmou **Meta** (Facebook, 2013). Aplikace se skládá ze **znovupoužitelných komponent**, každá má vlastní stav a renderovací logiku. Tradičně používá **Virtual DOM** pro optimalizaci překreslování, v aktuální **React 19** (prosinec 2024) přidává **Server Components** a **automatický kompilátor** (React Compiler), který nahrazuje ruční memoizaci.

---

## Klíčové pojmy

- **React** — JS knihovna pro UI, komponentový + deklarativní přístup
- **Komponenta** — znovupoužitelný stavební blok UI (přijímá props, vrací JSX)
- **Virtual DOM** — odlehčená kopie DOMu v JS paměti pro optimalizaci
- **Shadow DOM** — **nativní webová technologie** pro izolaci stylů, **NESOUVISÍ s Virtual DOM!**
- **JSX** — rozšíření JS syntaxe, není HTML, transpiluje se na `React.createElement()`
- **Transpilace** — překlad source-to-source (JSX→JS, TS→JS)
- **Babel / SWC** — transpilery (SWC v Rustu, 10-20× rychlejší)
- **Vite** — moderní dev server + bundler (default dnes)
- **JS Engine** — V8 (Chrome), SpiderMonkey (Firefox), JavaScriptCore (Safari)
- **Event loop** — JS single-threaded async mechanismus
- **Props** — vstupní data komponenty (immutable!)
- **Hooks** — funkce `use*` (useState, useEffect, useRef, ...)
- **React 19** — Server Components, React Compiler, `use()`, ref jako prop

---

## Hlavní výklad

### 1. Co je React a klíčové vlastnosti

- **JS knihovna** (ne framework — debatable, hranice rozmazaná)
- **Komponentový přístup:** strom znovupoužitelných komponent
- **Deklarativní:** popisuješ *"jak má UI vypadat pro daný stav"*, ne *"jak ho měnit"*
- **Virtual DOM:** optimalizace překreslování
- **Unidirectional data flow:** data tečou od rodiče k potomkům přes props

**Use cases:**
| Typ aplikace | Vhodné? |
|---|---|
| SPA (Single Page Application) | Klasický use case |
| Komplexní web aplikace | Ideální |
| Statické weby (blog) | Spíš Astro/Hugo |
| Mobilní aplikace | React Native (jiná knihovna, podobné API) |
| Desktop | Electron + React |

### 2. JavaScript v prohlížeči

**3 pilíře webu:** HTML (struktura) + CSS (vzhled) + **JS (logika, interaktivita, komunikace se serverem)**.

**JS Engines:**
| Prohlížeč | Engine |
|---|---|
| Chrome, Edge, Opera | **V8** (Google) |
| Firefox | **SpiderMonkey** (Mozilla) |
| Safari | **JavaScriptCore (Nitro)** (Apple) |

**JS je single-threaded**, ale **asynchronní díky event loopu**:
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
// Sync kód → microtasks (Promise) → macrotasks (setTimeout)
```

**Co JS v prohlížeči umí:**
- DOM manipulace (`document.getElementById(...)`)
- Asynchronní HTTP (`fetch`)
- Eventy (`addEventListener`)
- Storage (`localStorage`, `sessionStorage`)
- Web APIs (geolocation, notifications, webcam)

**ES moduly** (od ES2015):
```html
<script type="module" src="app.js"></script>
```
```javascript
// utils.js
export const sum = (a, b) => a + b;

// app.js
import { sum } from './utils.js';
```

### 3. DOM, Virtual DOM, Shadow DOM (klasický chyták!)

#### DOM (Document Object Model)
**Stromová reprezentace HTML** v paměti prohlížeče. Každý element = uzel.

**Problém přímé manipulace:**
- **Reflow** (přepočet layoutu) = drahý
- **Repaint** (překreslení pixelů) = levnější
- **Composite** (skládání vrstev na GPU) = nejlevnější

Změna **jedné vlastnosti může spustit reflow celé stránky**. Frameworky DOM manipulaci **batchují**.

#### Virtual DOM

**Odlehčená kopie DOMu v JS paměti.** React s ní pracuje místo přímé manipulace s reálným DOMem.

**Princip:** každá změna stavu → React přepočítá Virtual DOM → porovná s předchozím stavem (**diff**) → aplikuje jen rozdíly na reálný DOM.

**Mýtus:** Virtual DOM **NENÍ vždy rychlejší** než vanilla JS! Pro malé interakce je díky diffing overheadu pomalejší. Výhoda = **velká UI s častými změnami stavu**, kde manuální optimalizace by byla peklo.

#### Shadow DOM (úplně jiná věc!)

**Nativní webová technologie** pro **izolaci stylů a struktury uvnitř komponenty**. Vytvoří oddělený DOM strom uvnitř prvku, skrytý před zbytkem stránky.

| | Klasický DOM | Shadow DOM |
|---|---|---|
| **Izolace stylů** | Ne (styly se prolínají) | Ano (kompletní) |
| **Viditelnost zvenku** | Globální | Zapouzdřená |
| **Použití** | Běžné HTML | **Web Components** |

```javascript
const el = document.querySelector('#muj-prvek');
const shadow = el.attachShadow({ mode: 'open' });
shadow.innerHTML = `
  <style>p { color: red; }</style>
  <p>Toto je izolovaný obsah</p>
`;
```

`<p>` uvnitř Shadow DOM bude červený, **ale jiné `<p>` na stránce NE**. Styly z hlavního dokumentu se dovnitř taky nedostanou.

### ⚠️ Klasický chyták u maturity

| Pojem | Co řeší | Kde |
|---|---|---|
| **Virtual DOM** | Výkon při překreslování | React, Vue (do v3) |
| **Shadow DOM** | Izolace stylů a struktury | **Web Components**, `<video>`, `<input type="range">` |

**React NEPOUŽÍVÁ Shadow DOM.** Má vlastní mechanismy izolace (CSS Modules, styled-components, Tailwind utility classes). Zaměňování = klasický chyták komise.

### 4. JSX (JavaScript XML)

**JSX** = rozšíření JS syntaxe pro psaní HTML-like kódu v JS souboru. **Není HTML** ani čistý JS. **Babel/SWC** ho transpiluje na `React.createElement()`.

```jsx
// Co píšeš
const element = <h1 className="nadpis">Ahoj, {jmeno}!</h1>;

// Co z toho vznikne po transpilaci
const element = React.createElement(
  "h1",
  { className: "nadpis" },
  "Ahoj, ", jmeno, "!"
);
```

**Pravidla JSX:**

1. **Jeden kořenový element** (nebo `<>...</>` Fragment)
2. **Atributy v camelCase:** `className` (ne `class`), `tabIndex`, `onClick`
3. **Vyhrazená slova přejmenovaná:** `htmlFor` místo `for`
4. **JS výrazy ve `{}`:** `<p>2+2 = {2+2}</p>`
5. **Samouzavírací tagy:** `<img />`, `<br />`
6. **Inline styly jako objekty:** `<div style={{ color: 'red', fontSize: '16px' }}>`
7. **Komentáře:** `{/* komentář */}`

**Conditional rendering:**
```jsx
return user ? <Profile user={user} /> : <Login />;
{isLoading && <Spinner />}                          // logical AND
```

**Lists + keys (povinné!):**
```jsx
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

**Atribut `key` je povinný** u každého renderovaného prvku v listu — React ho používá k identifikaci, který prvek se změnil/přidal/smazal. **Bez `key`** může React překreslit zbytečně moc nebo se zmást.

Nejlepší key: **unikátní ID z dat** (`item.id`). **Index pole** jen pokud se seznam nemění. **NIKDY `Math.random()`** (key se mění každý render).

### 5. Transpilace × kompilace

| | Kompilace | Transpilace |
|---|---|---|
| **Výstup** | Strojový kód (binární) | Jiný zdrojový kód (čitelný) |
| **Příklad** | C → strojový kód CPU | JSX → JS, TS → JS |
| **Alt. název** | Compiler | Source-to-source compiler |

**V React projektu se transpiluje:**
- **JSX → JavaScript** (přes Babel/SWC)
- **TypeScript → JavaScript** (přes tsc/Babel/SWC)
- **Moderní ES2024 → ES2015** (pro starší prohlížeče)

**Hlavní transpilery:**
| Nástroj | Charakter |
|---|---|
| **Babel** | Klasický JS transpiler, rozsáhlý plugin ekosystém |
| **SWC** | Náhrada Babelu v Rustu, **10-20× rychlejší**. Default ve Vite a Next.js. |
| **esbuild** | Bundler i transpiler v Go, **ještě rychlejší**. Default ve Vite pro dev. |
| **tsc** | TypeScript kompilátor, oficiální od Microsoftu |

V roce 2026 jsou Babel **na ústupu** ve prospěch SWC a esbuild kvůli rychlosti.

### 6. Toolchain v Reactu

**Toolchain** = sada nástrojů, které spolupracují při vývoji.

| Nástroj | Účel |
|---|---|
| **Node.js** | JS běhové prostředí mimo prohlížeč (pro dev nástroje) |
| **npm / pnpm / yarn / bun** | Správa balíčků |
| **Vite** | Moderní dev server + bundler (dominantní volba) |
| **Webpack** | Starší bundler, ztrácí pozici |
| **Babel / SWC** | Transpiler JSX + moderního JS |
| **ESLint** | Linter (chyby + styl) |
| **Prettier** | Auto-formátování |
| **TypeScript** | Statické typování JS |

**Vytvoření React projektu (2026):**
```bash
# Vite (pure React SPA)
npm create vite@latest moje-aplikace -- --template react-ts

# Next.js (produkční web)
npx create-next-app@latest moje-aplikace

# create-react-app (CRA) je DEPRECATED od 2023, NEPOUŽÍVAT!
```

**Build pipeline:**

**`package.json`** = manifest projektu:
```json
{
  "name": "moje-aplikace",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

**`dependencies`** = runtime (do produkce). **`devDependencies`** = jen při buildu.

### 7. Funkcionální komponenty

**Komponenta** = znovupoužitelný stavební blok UI. Přijímá **props** (vstupní data) a vrací **JSX** (co se zobrazí).

```jsx
const Pozdrav = ({ jmeno, vek }) => {
  return (
    <div>
      <h1>Ahoj, {jmeno}!</h1>
      <p>Je ti {vek} let.</p>
    </div>
  );
};

// Použití
<Pozdrav jmeno="Jan" vek={20} />
```

**Props:**
- **Immutable** (neměnitelná) — komponenta je **nesmí modifikovat**
- Destructuring: `({ title, body, footer = "Bez patičky" })`
- Spread: `<Karta {...props} />`

**`children` prop** — speciální, obsahuje obsah mezi otevíracím a uzavíracím tagem:
```jsx
const Karta = ({ children, title }) => (
  <div><h2>{title}</h2>{children}</div>
);

<Karta title="Novinka">
  <p>Obsah karty.</p>
</Karta>
```

**Třídní × funkcionální komponenty:**
| | Třídní (starší) | Funkcionální (moderní) |
|---|---|---|
| Syntaxe | `class X extends Component` | `const X = () => {}` |
| Stav | `this.state` + `this.setState()` | `useState()` |
| Lifecycle | `componentDidMount`, atd. | `useEffect()` |
| `this` | Komplikované | Není potřeba |
| Boilerplate | Hodně | Málo |
| Dnes | Legacy, NEPSAT nové | Standard |

**V 2026 funkcionální komponenty s hooky používají téměř výhradně.**

### 8. Hooks (přehled)

**Funkce začínající `use*`**, které dávají funkcionálním komponentám schopnosti dřív vyhrazené třídním.

| Hook | K čemu |
|---|---|
| **`useState`** | Lokální stav |
| **`useEffect`** | Vedlejší efekty (API, timery, DOM manipulace) |
| **`useContext`** | Sdílení dat napříč komponentami bez prop drilling |
| **`useRef`** | Reference na DOM element / mutable hodnota bez re-renderu |
| `useReducer` | Komplexní stav (alternativa useState) |
| `useMemo` | Memoizace náročných výpočtů |
| `useCallback` | Memoizace funkcí |
| **`useId`** | Unikátní ID (pro accessibility) |

**Pravidla hooks:**
1. Volat **jen na nejvyšší úrovni** komponenty (ne v cyklech, podmínkách, nested funkcích)
2. Volat **jen z React komponent nebo custom hooks**, ne z obyčejných funkcí

(Detaily v DAT 23 hooks.)

### 9. React 19 — moderní funkce (2026)

**React Server Components (RSC):**
- Renderují se **na serveru**, ne v prohlížeči
- Klient dostává hotové HTML, ne JS pro renderování
- **Defaultní v Next.js App Router**
- Můžou přímo volat DB / API (`async/await`)
- Nemůžou používat `useState`, `useEffect` (jen klient může)
- Klientské komponenty vyžadují `"use client"` direktivu

**React Compiler** (dřív "React Forget"):
- **Automaticky memoizuje** komponenty a hodnoty
- Konec ručního `useMemo`/`useCallback`/`React.memo`
- Píšeš obyčejný JS, kompilátor optimalizuje

**`use()` hook:**
- Pro práci s Promises a Context **podmíněně** (porušuje staré pravidlo)
- `const user = use(userPromise);` — suspense pod kapotou

**Další novinky:** `ref` jako prop (žádný `forwardRef`), document metadata, Actions a form handling, `useOptimistic`, `useFormStatus`.

---

## Vztahy / kontrasty

- **Knihovna × framework:** React = knihovna (UI rendering jen), Next.js = framework (routing + SSR + ...)
- **Virtual DOM × Shadow DOM:** výkon × izolace stylů. React má jen Virtual DOM!
- **JSX × HTML:** vypadá podobně, ale JSX se transpiluje, atributy v camelCase
- **Transpilace × kompilace:** zdrojový kód × strojový kód
- **Třídní × funkcionální:** legacy × moderní (hooks)
- **Server Component × Client Component:** server-render bez hooks × prohlížeč s hooks
- **`dependencies` × `devDependencies`:** runtime × build-time
- **Vite × Webpack:** moderní × starší, oba bundlery

---

## Časté otázky komise

**Q:** Co je React a kdo ho vytvořil?
**A:** **JavaScriptová knihovna pro tvorbu uživatelských rozhraní**. Vyvinula firma **Meta** (Facebook), poprvé vydaná **2013**. Aktuální stabilní verze **React 19** (prosinec 2024). Klíčové vlastnosti: **komponentový přístup** (znovupoužitelné bloky UI), **deklarativní** (popisuješ stav, ne změny), **Virtual DOM** (optimalizace překreslování), **unidirectional data flow** (data shora dolů přes props).

**Q:** Co je rozdíl mezi DOM, Virtual DOM a Shadow DOM? (klasický chyták!)
**A:** **DOM** = stromová reprezentace HTML v paměti prohlížeče, JS s ní manipuluje. **Virtual DOM** = **odlehčená kopie DOMu v JS paměti**, kterou používá React pro **optimalizaci překreslování** (diff + apply rozdíly). **Shadow DOM** = **úplně jiná věc** — nativní webová technologie pro **izolaci stylů a struktury** uvnitř komponenty (Web Components). **React NEPOUŽÍVÁ Shadow DOM**, má vlastní izolaci stylů (CSS Modules, Tailwind). Zaměňování Virtual DOM a Shadow DOM je klasický chyták.

**Q:** Co je JSX a jak funguje?
**A:** **JSX** je **rozšíření JavaScript syntaxe**, které umožňuje psát HTML-like kód přímo v JS souboru. **Není HTML ani čistý JS** — je to **syntaktický cukr pro volání `React.createElement()`**. **Babel/SWC** ho při buildu transpiluje. Pravidla: `className` místo `class`, `htmlFor` místo `for`, atributy v camelCase, JS výrazy ve `{}`, jeden kořenový element (nebo Fragment `<>`), samouzavírací tagy.

**Q:** Co je transpilace a jak se liší od kompilace?
**A:** **Kompilace** = překlad zdrojového kódu na **strojový kód** (binární, pro CPU). Příklad: C → exe. **Transpilace** = **source-to-source překlad** = z jednoho zdrojového jazyka do jiného (stále čitelného). Příklady: **JSX → JavaScript**, **TypeScript → JavaScript**, **moderní ES2024 → ES2015** pro starší prohlížeče. Hlavní transpilery v Reactu: **Babel** (klasika), **SWC** (Rust, 10-20× rychlejší, default ve Vite/Next.js), **esbuild** (Go).

**Q:** Jaký je rozdíl mezi knihovnou a frameworkem?
**A:** **Knihovna** = sada funkcí, **ty voláš ji** (např. `React.createElement`). Máš plnou kontrolu nad tokem. **Framework** = strukturovaná aplikace, **ona volá tvůj kód** (inversion of control). Diktuje strukturu, lifecycle. **React je knihovna** (jen UI rendering), **Next.js je framework** (přidává routing, SSR, RSC). Dnes je hranice rozmazaná — moderní knihovny mají framework-like patterns.

**Q:** Co jsou funkcionální komponenty a proč nahradily třídní?
**A:** **Funkcionální komponenta** = **JS funkce**, která přijímá `props` jako argument a vrací **JSX**. Příklad: `const Pozdrav = ({ jmeno }) => <h1>Ahoj, {jmeno}!</h1>;`. Nahradily **třídní komponenty** (`class X extends Component`) díky **hooks** (`useState`, `useEffect` zajišťují stav a lifecycle). **Výhody:** méně boilerplate, žádné komplikované `this`, lepší TypeScript inference. V 2026 jsou standard, třídní komponenty potkáš jen ve starých projektech.

**Q:** Co dělá toolchain v React projektu?
**A:** **Toolchain** = sada vývojářských nástrojů. **Node.js** = JS runtime mimo prohlížeč. **npm** = package manager. **Vite/Webpack** = dev server + bundler (spojí JS, CSS, obrázky do optimalizovaných souborů). **Babel/SWC** = transpiler (JSX → JS). **ESLint** = linter, **Prettier** = formátování, **TypeScript** = statické typování. Pro nový projekt: `npm create vite@latest` (SPA) nebo `npx create-next-app` (web aplikace). **`create-react-app` je deprecated** od 2023.

**Q:** Co umí JavaScript v prohlížeči?
**A:** **JS engine** v prohlížeči (V8 v Chrome, SpiderMonkey ve Firefoxu, JavaScriptCore v Safari) parsuje a vykonává JS. **JS je single-threaded**, ale **asynchronní díky event loopu** (microtasks/macrotasks). Funkce: **DOM manipulace** (`document.getElementById`), **HTTP requesty** (`fetch`), **eventy** (`addEventListener`), **storage** (`localStorage`), **Web APIs** (geolocation, notifications, webcam). **ES moduly** (`import/export`) od ES2015 jako moderní standard.

**Q:** Co jsou React Server Components?
**A:** **Komponenty, které se renderují na serveru, ne v prohlížeči**. Klient dostává hotové HTML/data, ne JS pro renderování. **Defaultní v Next.js App Router** (React 19). Můžou přímo volat **DB nebo API** přes `async/await`. **Nemůžou používat hooky** (`useState`, `useEffect`) — ty jsou jen pro **client komponenty** (vyžadují `"use client"` direktivu). **Výhody:** menší JS bundle pro klienta, lepší SEO, rychlejší first paint.

---

## Status

- **Sebehodnocení (před):** 1/10
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-20
