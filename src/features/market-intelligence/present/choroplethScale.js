export function getColorSale(value) {
  if (value == null) return "#94a3b8";
  if (value < 500) return "#15803d";
  if (value < 700) return "#22c55e";
  if (value < 900) return "#86efac";
  if (value < 1100) return "#bef264";
  if (value < 1400) return "#fde047";
  if (value < 1700) return "#fb923c";
  if (value < 2000) return "#ef4444";
  if (value < 2500) return "#dc2626";
  return "#7f1d1d";
}
export function getColorRent(value) {
  if (value == null) return "#94a3b8";
  if (value < 60000) return "#15803d";
  if (value < 90000) return "#22c55e";
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
  if (value < 5) return "#e0f2fe";
  if (value < 15) return "#7dd3fc";
  if (value < 30) return "#38bdf8";
  if (value < 60) return "#0ea5e9";
  if (value < 100) return "#0284c7";
  if (value < 200) return "#0369a1";
  if (value < 400) return "#1e40af";
  if (value < 700) return "#1e3a8a";
  return "#172554";
}
export function getColorForMode(value, mode) {
  if (mode === "transactions") return getColorTx(value);
  return mode.startsWith("rent") ? getColorRent(value) : getColorSale(value);
}
export const LEGEND_SALE = [{
  label: "< 500",
  color: "#15803d"
}, {
  label: "500 – 700",
  color: "#22c55e"
}, {
  label: "700 – 900",
  color: "#86efac"
}, {
  label: "900 – 1,100",
  color: "#bef264"
}, {
  label: "1,100 – 1,400",
  color: "#fde047"
}, {
  label: "1,400 – 1,700",
  color: "#fb923c"
}, {
  label: "1,700 – 2,000",
  color: "#ef4444"
}, {
  label: "2,000 – 2,500",
  color: "#dc2626"
}, {
  label: "> 2,500",
  color: "#7f1d1d"
}];
export const LEGEND_RENT = [{
  label: "< 60k",
  color: "#15803d"
}, {
  label: "60k – 90k",
  color: "#22c55e"
}, {
  label: "90k – 120k",
  color: "#86efac"
}, {
  label: "120k – 150k",
  color: "#bef264"
}, {
  label: "150k – 180k",
  color: "#fde047"
}, {
  label: "180k – 220k",
  color: "#fb923c"
}, {
  label: "220k – 260k",
  color: "#ef4444"
}, {
  label: "260k – 320k",
  color: "#dc2626"
}, {
  label: "> 320k",
  color: "#7f1d1d"
}];
export const LEGEND_TX = [{
  label: "< 5",
  color: "#e0f2fe"
}, {
  label: "5 – 15",
  color: "#7dd3fc"
}, {
  label: "15 – 30",
  color: "#38bdf8"
}, {
  label: "30 – 60",
  color: "#0ea5e9"
}, {
  label: "60 – 100",
  color: "#0284c7"
}, {
  label: "100 – 200",
  color: "#0369a1"
}, {
  label: "200 – 400",
  color: "#1e40af"
}, {
  label: "400 – 700",
  color: "#1e3a8a"
}, {
  label: "> 700",
  color: "#172554"
}];
export function getLegendForMode(mode) {
  if (mode === "transactions") return LEGEND_TX;
  if (mode.startsWith("rent")) return LEGEND_RENT;
  return LEGEND_SALE;
}
export function getLegendLabel(mode) {
  if (mode === "transactions") return "Deals - (2026)";
  if (mode.startsWith("sale")) return "AED / sqft";
  return "AED / year";
}
export function getModeHelpText(mode) {
  if (mode === "sale_apartment") return "Average apartment sale price (AED/sqft)";
  if (mode === "sale_villa") return "Average villa sale price (AED/sqft)";
  if (mode === "rent_apartment") return "Average apartment annual rent (AED/year)";
  if (mode === "rent_villa") return "Average villa annual rent (AED/year)";
  if (mode === "transactions") return "Number of sales transactions - 2026 · Source: DLD";
  return "";
}
