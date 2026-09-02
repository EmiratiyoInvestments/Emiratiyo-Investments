export function fmt(n) {
  return new Intl.NumberFormat("en-AE").format(n);
}
export function fmtPct(n) {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
}
export function fallbackValue(commNum, mode) {
  let hash = 0;
  for (let i = 0; i < commNum.length; i++) hash = hash * 31 + commNum.charCodeAt(i) >>> 0;
  if (mode.startsWith("sale")) return 600 + hash % 2200;
  return 45000 + hash % 140000;
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
  if (area.yoy_change != null) parts.push(`Year-on-year change: ${fmtPct(area.yoy_change)}.`);
  if (mode?.startsWith("sale")) parts.push("Use this view to compare relative sale pricing across communities.");else if (mode?.startsWith("rent")) parts.push("Use this view to compare relative rental pricing across communities.");
  return parts.join(" ");
}
