// Derives area-level pricing from DLD transaction CSV
// Single source: transaction-26.csv → pricing + transaction counts

import { normArea, resolveAreaToGeoJSON } from "./areaMapping";

const SQM_TO_SQFT = 10.7639;
const TRANSACTION_CSV_PATH = "/data/transaction-26.csv";

/**
 * Parse CSV row: compute price per sqft (AED/sqft)
 * PROCEDURE_AREA is in sqm in DLD data
 */
function pricePerSqft(row) {
  const area = parseFloat(row.PROCEDURE_AREA) || parseFloat(row.ACTUAL_AREA);
  const val = parseFloat(row.TRANS_VALUE);
  if (!area || area <= 0 || !val || val <= 0) return null;
  const sqft = area * SQM_TO_SQFT;
  return Math.round(val / sqft);
}

function isApartment(row) {
  const t = (row.PROP_SB_TYPE_EN || row.PROP_TYPE_EN || "").toLowerCase();
  return t.includes("flat") || t.includes("apartment") || t.includes("unit");
}

function isVilla(row) {
  const t = (row.PROP_SB_TYPE_EN || row.PROP_TYPE_EN || "").toLowerCase();
  const pt = (row.PROP_TYPE_EN || "").toLowerCase();
  return t.includes("villa") || pt.includes("building");
}

/**
 * Derive area-level data from raw CSV rows
 * @param {Array} rows - Parsed CSV rows
 * @param {Object} geoFeatures - { CNAME_E: { COMM_NUM, ... } } from GeoJSON
 * @returns {{ areaDataByCommNum: Object, txDataByArea: Object }}
 */
export function deriveAreaDataFromRows(rows, geoFeatures = {}) {
  const sales = rows.filter((r) => r.GROUP_EN?.trim() === "Sales");

  // Group by normalized AREA_EN
  const byArea = {};
  sales.forEach((r) => {
    const area = r.AREA_EN?.trim();
    if (!area) return;
    const key = normArea(area);
    if (!byArea[key]) {
      byArea[key] = { name: area, aptPrices: [], villaPrices: [], txCount: 0 };
    }
    byArea[key].txCount += 1;
    const price = pricePerSqft(r);
    if (price != null) {
      if (isApartment(r)) byArea[key].aptPrices.push(price);
      else if (isVilla(r)) byArea[key].villaPrices.push(price);
    }
  });

  // Build txDataByArea: normArea(CNAME_E) -> count (merge when multiple DLD areas map to same GeoJSON)
  const txDataByArea = {};
  Object.entries(byArea).forEach(([key, d]) => {
    const geoName = resolveAreaToGeoJSON(d.name);
    const n = normArea(geoName);
    txDataByArea[n] = (txDataByArea[n] || 0) + d.txCount;
    txDataByArea[key] = (txDataByArea[key] || 0) + d.txCount; // also key by DLD name
  });

  // Build areaDataByCommNum: COMM_NUM -> { name, sale_apartment, sale_villa, ... }
  const areaDataByCommNum = {};
  const median = (arr) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
  };

  // Aggregate by GeoJSON CNAME_E (multiple DLD areas may map to same GeoJSON)
  const byGeo = {};
  Object.entries(byArea).forEach(([key, d]) => {
    const geoName = resolveAreaToGeoJSON(d.name);
    const n = normArea(geoName);
    if (!byGeo[n]) byGeo[n] = { aptPrices: [], villaPrices: [], txCount: 0, dldNames: [] };
    byGeo[n].aptPrices.push(...d.aptPrices);
    byGeo[n].villaPrices.push(...d.villaPrices);
    byGeo[n].txCount += d.txCount;
    byGeo[n].dldNames.push(d.name);
  });

  Object.entries(byGeo).forEach(([geoKey, g]) => {
    const saleApt = median(g.aptPrices);
    const saleVilla = median(g.villaPrices);
    if (saleApt == null && saleVilla == null && g.txCount === 0) return;

    const geo = geoFeatures[geoKey] || geoFeatures[geoKey];

    if (geo?.COMM_NUM) {
      areaDataByCommNum[String(geo.COMM_NUM)] = {
        name: geo.CNAME_E ?? geoKey,
        alias: g.dldNames[0] !== geo.CNAME_E ? g.dldNames[0] : undefined,
        sale_apartment: saleApt,
        sale_villa: saleVilla || null,
        rent_apartment: null,
        rent_villa: null,
        _txCount: g.txCount,
        _source: "DLD",
      };
    } else {
      areaDataByCommNum[`_area_${geoKey}`] = {
        name: g.dldNames[0] || geoKey,
        sale_apartment: saleApt,
        sale_villa: saleVilla || null,
        rent_apartment: null,
        rent_villa: null,
        _txCount: g.txCount,
        _source: "DLD",
        _areaKey: geoKey,
      };
    }
  });

  return { areaDataByCommNum, txDataByArea };
}

/**
 * Build GeoJSON feature lookup: CNAME_E -> { COMM_NUM, CNAME_E }
 */
export function buildGeoFeatureLookup(geoJSON) {
  const lookup = {};
  (geoJSON?.features || []).forEach((f) => {
    const p = f?.properties;
    if (!p?.CNAME_E) return;
    const cname = String(p.CNAME_E).trim();
    const n = normArea(cname);
    lookup[n] = { COMM_NUM: p.COMM_NUM, CNAME_E: cname };
    lookup[cname] = lookup[n];
  });
  return lookup;
}

export { TRANSACTION_CSV_PATH, SQM_TO_SQFT };
