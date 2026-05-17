/* ---------- Theme (light/dark) ----------
 *
 * Ported from rep/. Single source of truth: `data-theme` attribute on
 * <html>, persisted to localStorage. Default falls back to system pref.
 */

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "mtd.theme";
const EVENT = "mtd:theme-change";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function initTheme(): Theme {
  const initial = getStoredTheme() ?? getSystemTheme();
  applyTheme(initial);
  return initial;
}

export function useTheme(): [Theme, (next: Theme) => void, () => void] {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== "undefined" && document.documentElement.dataset.theme) {
      return document.documentElement.dataset.theme as Theme;
    }
    return getStoredTheme() ?? getSystemTheme();
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<Theme>).detail;
      setThemeState(next);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const setTheme = (next: Theme) => {
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  };

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  return [theme, setTheme, toggle];
}
