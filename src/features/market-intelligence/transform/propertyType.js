export function isApartment(row) {
  const t = (row.PROP_SB_TYPE_EN || row.PROP_TYPE_EN || "").toLowerCase();
  return t.includes("flat") || t.includes("apartment") || t.includes("unit");
}

export function isVilla(row) {
  const t = (row.PROP_SB_TYPE_EN || row.PROP_TYPE_EN || "").toLowerCase();
  const pt = (row.PROP_TYPE_EN || "").toLowerCase();
  return t.includes("villa") || pt.includes("building");
}
