import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { loadManifest } from "@/lib/manifest";
import type { Manifest } from "@/types";
import { TopBar } from "@/components/TopBar";
import { MobileMenu } from "@/components/MobileMenu";
import { Landing } from "@/components/Landing";
import { SubjectPage } from "@/components/SubjectPage";
import { NotePage } from "@/components/NotePage";
import { AboutPage } from "@/components/AboutPage";

const Graph = lazy(() => import("@/components/Graph"));

export function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((e) => setError(String(e)));
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll while menu open.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  return (
    <div className="bg-surface min-h-dvh">
      <a
        href="#main"
        className="sr-only focus-visible-only focus:bg-accent focus:text-accent-fg focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded-sm focus:px-3 focus:py-2 focus:text-sm"
      >
        Přeskočit na obsah
      </a>

      <TopBar
        manifest={manifest}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
      />
      <MobileMenu
        manifest={manifest}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main
        id="main"
        className="pt-[calc(64px+env(safe-area-inset-top))]"
      >
        {error && (
          <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
            <p className="data text-bad text-sm">manifest load failed: {error}</p>
            <p className="text-ink-dim mt-2 text-sm">
              spusť <code className="data">npm run build:content</code> a refresh.
            </p>
          </div>
        )}

        {!manifest && !error && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <span className="data text-ink-muted animate-pulse text-[10px] uppercase tracking-[0.2em]">
              načítám …
            </span>
          </div>
        )}

        {manifest && (
          <Switch>
            <Route path="/" component={() => <Landing manifest={manifest} />} />
            <Route path="/about" component={AboutPage} />
            <Route path="/graf">
              <Suspense
                fallback={
                  <div className="flex h-[calc(100dvh-64px)] items-center justify-center">
                    <span className="data text-ink-muted animate-pulse text-[10px] uppercase tracking-[0.2em]">
                      načítám graf …
                    </span>
                  </div>
                }
              >
                <Graph manifest={manifest} />
              </Suspense>
            </Route>
            <Route path="/:subject/:slug">
              {(params) => (
                <NotePage
                  manifest={manifest}
                  subject={params.subject}
                  slug={params.slug}
                />
              )}
            </Route>
            <Route path="/:subject">
              {(params) => (
                <SubjectPage manifest={manifest} subject={params.subject} />
              )}
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        )}

        {location !== "/graf" && <SiteFooter manifest={manifest} />}
      </main>
    </div>
  );
}

function SiteFooter({ manifest }: { manifest: Manifest | null }) {
  if (!manifest) return null;
  const buildTime = new Date(manifest.lastBuild);
  return (
    <footer className="border-line mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:px-10">
        <div className="data text-ink-muted flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11px]">
          <span className="wordmark text-ink mr-2 text-base leading-none">mtd</span>
          <span className="text-ink-muted">crafted by</span>
          <a
            href="https://harrydeiml.ing"
            className="text-ink-dim hover:text-ink decoration-accent underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener"
          >
            harry
          </a>
          <span className="text-ink-muted">· maturita 2026 ·</span>
          <Link
            href="/about"
            className="text-ink-dim hover:text-ink decoration-accent underline-offset-2 hover:underline no-underline"
          >
            about
          </Link>
        </div>
        <div className="data text-ink-muted flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
          <span>
            <span className="text-ink-dim tabular-nums">
              {Object.keys(manifest.notes).length}
            </span>{" "}
            notes
          </span>
          <span>
            <span className="text-ink-dim tabular-nums">{manifest.counts.public}</span>{" "}
            public
          </span>
          <span className="text-ink-muted">
            build{" "}
            <span className="tabular-nums">
              {buildTime.toLocaleString("cs-CZ", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 md:py-32">
      <div className="data text-accent text-[11px] uppercase tracking-[0.2em]">
        404 · ztraceno
      </div>
      <h1 className="display text-ink mt-4 text-6xl md:text-7xl">
        <span className="italic">Tady nic není.</span>
      </h1>
      <p className="text-ink-dim mt-5 max-w-prose text-base leading-relaxed">
        Buď je adresa špatně, nebo ten zápisek ještě neexistuje. Vrať se na{" "}
        <a href="/" className="text-ink underline decoration-accent">
          rozcestník
        </a>
        .
      </p>
    </div>
  );
}
