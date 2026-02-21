// src/components/market-insights/heatmapUtils.js

export function getColorSale(value) {
  if (value == null) return "#94a3b8";
  if (value < 500)  return "#15803d";
  if (value < 700)  return "#22c55e";
  if (value < 900)  return "#86efac";
  if (value < 1100) return "#bef264";
  if (value < 1400) return "#fde047";
  if (value < 1700) return "#fb923c";
  if (value < 2000) return "#ef4444";
  if (value < 2500) return "#dc2626";
  return "#7f1d1d";
}

export function getColorRent(value) {
  if (value == null) return "#94a3b8";
  if (value < 60000)  return "#15803d";
  if (value < 90000)  return "#22c55e";
  if (value < 120000) return "#86efac";
  if (value < 150000) return "#bef264";
  if (value < 180000) return "#fde047";
  if (value < 220000) return "#fb923c";
  if (value < 260000) return "#ef4444";
  if (value < 320000) return "#dc2626";
  return "#7f1d1d";
}

export function getColorTx(value) {
  if (value == null) return "#94a3b8";
  if (value < 5)    return "#e0f2fe";
  if (value < 15)   return "#7dd3fc";
  if (value < 30)   return "#38bdf8";
  if (value < 60)   return "#0ea5e9";
  if (value < 100)  return "#0284c7";
  if (value < 200)  return "#0369a1";
  if (value < 400)  return "#1e40af";
  if (value < 700)  return "#1e3a8a";
  return "#172554";
}

export function getColorForMode(value, mode) {
  if (mode === "transactions") return getColorTx(value);
  return mode.startsWith("rent") ? getColorRent(value) : getColorSale(value);
}

export const LEGEND_SALE = [
  { label: "< 500",        color: "#15803d" },
  { label: "500 – 700",    color: "#22c55e" },
  { label: "700 – 900",    color: "#86efac" },
  { label: "900 – 1,100",  color: "#bef264" },
  { label: "1,100 – 1,400",color: "#fde047" },
  { label: "1,400 – 1,700",color: "#fb923c" },
  { label: "1,700 – 2,000",color: "#ef4444" },
  { label: "2,000 – 2,500",color: "#dc2626" },
  { label: "> 2,500",      color: "#7f1d1d" },
];

export const LEGEND_RENT = [
  { label: "< 60k",        color: "#15803d" },
  { label: "60k – 90k",    color: "#22c55e" },
  { label: "90k – 120k",   color: "#86efac" },
  { label: "120k – 150k",  color: "#bef264" },
  { label: "150k – 180k",  color: "#fde047" },
  { label: "180k – 220k",  color: "#fb923c" },
  { label: "220k – 260k",  color: "#ef4444" },
  { label: "260k – 320k",  color: "#dc2626" },
  { label: "> 320k",       color: "#7f1d1d" },
];

export const LEGEND_TX = [
  { label: "< 5",      color: "#e0f2fe" },
  { label: "5 – 15",   color: "#7dd3fc" },
  { label: "15 – 30",  color: "#38bdf8" },
  { label: "30 – 60",  color: "#0ea5e9" },
  { label: "60 – 100", color: "#0284c7" },
  { label: "100 – 200",color: "#0369a1" },
  { label: "200 – 400",color: "#1e40af" },
  { label: "400 – 700",color: "#1e3a8a" },
  { label: "> 700",    color: "#172554" },
];

export function getLegendForMode(mode) {
  if (mode === "transactions") return LEGEND_TX;
  if (mode.startsWith("rent")) return LEGEND_RENT;
  return LEGEND_SALE;
}

export function getLegendLabel(mode) {
  if (mode === "transactions") return "Deals (Jan–Feb 2026)";
  if (mode.startsWith("sale")) return "AED / sqft";
  return "AED / year";
}

export function fmt(n) {
  return new Intl.NumberFormat("en-AE").format(n);
}

export function fmtPct(n) {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export function normArea(s) {
  return String(s ?? "").toUpperCase().trim().replace(/\s+/g, " ");
}

export function fallbackValue(commNum, mode) {
  let hash = 0;
  for (let i = 0; i < commNum.length; i++) hash = (hash * 31 + commNum.charCodeAt(i)) >>> 0;
  if (mode.startsWith("sale")) return 600 + (hash % 2200);
  return 45000 + (hash % 140000);
}

export function buildAutoDescription(area, mode) {
  if (!area) return "";
  if (area.__estimated) return "Estimated values are shown for visual completeness.";
  const alias = area.alias;
  const official = area.name;
  const title = alias && alias !== official ? `${alias} (${official})` : official;
  const parts = [`${title} is shown here with indicative market averages for residential property.`];
  if (area.sale_apartment != null) parts.push(`Average apartment sale pricing is around ${fmt(area.sale_apartment)} AED/sqft.`);
  if (area.rent_apartment != null) parts.push(`Typical apartment rents are around ${fmt(area.rent_apartment)} AED/year.`);
  if (area.yoy_change     != null) parts.push(`Year-on-year change: ${fmtPct(area.yoy_change)}.`);
  if (mode?.startsWith("sale")) parts.push("Use this view to compare relative sale pricing across communities.");
  else if (mode?.startsWith("rent")) parts.push("Use this view to compare relative rental pricing across communities.");
  return parts.join(" ");
}

export function getModeHelpText(mode) {
  if (mode === "sale_apartment") return "Average apartment sale price (AED/sqft)";
  if (mode === "sale_villa")     return "Average villa sale price (AED/sqft)";
  if (mode === "rent_apartment") return "Average apartment annual rent (AED/year)";
  if (mode === "rent_villa")     return "Average villa annual rent (AED/year)";
  if (mode === "transactions")   return "Number of sales transactions · Jan–Feb 2026 · Source: DLD";
  return "";
}