/* ---------- mtd site config ----------
 *
 * Subjects auto-discover from frontmatter `subject:` across all .md files
 * in content/. This file is purely for *display tuning*: pretty labels,
 * ordering, accent color. Subjects not listed here still appear — labelled
 * with their raw key, ordered alphabetically after the configured ones.
 *
 * @typedef {Object} SubjectConfig
 * @property {string} label
 * @property {string} [description]
 * @property {number} order
 * @property {string} [color]   Hex color used in graph view + accents. Recommended: distinct hue per subject for the graph node coloring.
 *
 * @typedef {Object} MtdConfig
 * @property {string} siteName
 * @property {string} siteDescription
 * @property {Record<string, SubjectConfig>} subjects
 */

/** @type {MtdConfig} */
const config = {
  siteName: "mtd",
  siteDescription: "mark that down — zápisky maturita 2026",
  subjects: {
    SWI: {
      label: "Softwarové inženýrství",
      description: "25 ústních témat",
      order: 1,
      color: "#2563eb", // cobalt — matches site accent
    },
    DAT: {
      label: "Data a kódování",
      description: "25 ústních témat",
      order: 2,
      color: "#0891b2", // teal-cyan
    },
    CJL: {
      label: "Český jazyk a literatura",
      description: "20 knih, rozbory + kontext",
      order: 3,
      color: "#f97316", // coral
    },
  },
};

export default config;
