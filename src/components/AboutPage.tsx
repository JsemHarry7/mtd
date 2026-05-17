import { Link } from "wouter";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function AboutPage() {
  useDocumentTitle("about — mtd");

  return (
    <div className="mx-auto max-w-2xl px-6 pb-16 pt-10 sm:px-10 sm:pt-16">
      <Link
        href="/"
        className="data text-ink-muted hover:text-ink mb-10 inline-block text-[11px] uppercase tracking-[0.2em] no-underline"
      >
        ← rozcestník
      </Link>

      <header className="border-line mb-10 border-b pb-10">
        <div className="data text-accent text-[11px] uppercase tracking-[0.22em]">
          about
        </div>
        <h1 className="display text-ink mt-4 text-5xl sm:text-6xl">
          <span className="italic">mark that down.</span>
        </h1>
        <p className="text-ink-dim mt-5 max-w-prose text-base leading-relaxed">
          Veřejný rozcestník zápisků k maturitě 2026, postavený během
          přípravy. Markdown soubory v <code className="data text-ink">content/</code>,
          build script roztřídí podle frontmatteru, výsledek se sdílí URL.
        </p>
      </header>

      <Section label="co to dělá">
        <ul className="prose">
          <li>
            <strong>3 subjekty</strong> — SWI (Softwarové inženýrství), DAT
            (Data a kódování), ČJL (Čeština) — 51 ústních a literárních témat.
          </li>
          <li>
            <strong>graf souvislostí</strong> — bipartitní mapa zápisků a
            sdílených konceptů (tagů). Hover = stopuj, co s čím souvisí.
          </li>
          <li>
            <strong>plain markdown</strong> — žádný custom editor, jen{" "}
            <code className="data text-ink">.md</code> v repu s YAML hlavičkou.
          </li>
        </ul>
      </Section>

      <Section label="frontmatter contract">
        <p>
          Každý <code className="data text-ink">.md</code> v{" "}
          <code className="data text-ink">content/</code> musí mít hlavičku:
        </p>
        <pre className="prose"><code>{`---
subject: SWI         # SWI · DAT · CJL · ...
number: 4
title: "..."
tags: [oop, web]
share: public        # public · unlisted · private
status: review       # draft · review · done
speakingTime: 12
updated: 2026-05-17
---`}</code></pre>
        <p>
          Bez hlavičky se soubor přeskočí. <code className="data text-ink">share: private</code>{" "}
          (default) skryje zápisek z listingů, searche i grafu — chrání drafty
          před náhodným zveřejněním.
        </p>
      </Section>

      <Section label="jak sdílet">
        <p>
          Kdokoli s URL může číst <code className="data text-ink">public</code>{" "}
          zápisky. <code className="data text-ink">unlisted</code> dosažitelné jen
          přímým slug-linkem (neukazují se v navigaci). Žádný účet, žádný
          backend, žádné cookies.
        </p>
      </Section>

      <Section label="krafted by">
        <p>
          <a
            href="https://harrydeiml.ing"
            className="text-ink decoration-accent underline"
            target="_blank"
            rel="noopener"
          >
            harry
          </a>{" "}
          · ústní maturita 25.5.2026 · psáno v noci s mlhou ve hlavě.
        </p>
        <p className="text-ink-muted mt-3 text-sm">
          Sourozenec projektu{" "}
          <a
            href="https://rep.harrydeiml.ing"
            className="text-ink-dim decoration-accent underline"
            target="_blank"
            rel="noopener"
          >
            rep
          </a>
          {" "}— flashcards & SRS trénovačka pro stejnou maturitu. mtd je{" "}
          <em>rozcestník zápisků</em>, rep je <em>trénovačka</em>.
        </p>
      </Section>

      <Section label="open source">
        <p>
          MIT licence. Forkni, používej, uprav pro svoji školu / zkoušku /
          předmět. Stačí přepsat <code className="data text-ink">mtd.config.mjs</code>{" "}
          a nahrát svoje <code className="data text-ink">.md</code> do{" "}
          <code className="data text-ink">content/</code>.
        </p>
      </Section>

      <Section label="kontakt">
        <p>
          <a
            href="mailto:kontakt@harrydeiml.ing"
            className="text-ink decoration-accent underline"
          >
            kontakt@harrydeiml.ing
          </a>
        </p>
      </Section>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="data text-ink-muted mb-3 text-[11px] uppercase tracking-[0.22em]">
        {label}
      </h2>
      <div className="prose">{children}</div>
    </section>
  );
}
