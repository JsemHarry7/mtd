import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initTheme } from "@/lib/theme";
import { App } from "./App";

initTheme();

if (typeof console !== "undefined") {
  /* eslint-disable no-console */
  console.log(
    "%c mtd ",
    "font: italic 600 18px Iowan Old Style, Georgia, serif; color: #fafaf9; background: #2563eb; padding: 4px 12px; border-radius: 2px;",
  );
  console.log(
    "%cmark that down · crafted by harry · maturita 25.5.2026",
    "color: #2563eb; font-style: italic; font-size: 12px;",
  );
  console.log(
    "%charrydeiml.ing · kontakt@harrydeiml.ing",
    "color: #74747a; font-size: 11px;",
  );
  /* eslint-enable no-console */
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
