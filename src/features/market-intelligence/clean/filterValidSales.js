export function filterValidSales(rows) {
  return rows.filter(r => r.GROUP_EN?.trim() === "Sales");
}

export function hasValidAreaName(row) {
  return Boolean(row.AREA_EN?.trim());
}

export function hasValidProjectName(proj) {
  return Boolean(proj) && proj !== "0" && proj !== "";
}
