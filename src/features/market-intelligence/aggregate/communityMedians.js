import { filterValidSales, hasValidAreaName } from "../clean/filterValidSales";
import { normArea, resolveAreaToGeoJSON } from "../normalize/areaNames";
import { pricePerSqft } from "../transform/pricePerSqft";
import { isApartment, isVilla } from "../transform/propertyType";

export function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export function groupPricesByArea(rows) {
  const sales = filterValidSales(rows);
  const byArea = {};
  sales.forEach(r => {
    if (!hasValidAreaName(r)) return;
    const area = r.AREA_EN.trim();
    const key = normArea(area);
    if (!byArea[key]) {
      byArea[key] = {
        name: area,
        aptPrices: [],
        villaPrices: [],
        txCount: 0
      };
    }
    byArea[key].txCount += 1;
    const price = pricePerSqft(r);
    if (price != null) {
      if (isApartment(r)) byArea[key].aptPrices.push(price);else if (isVilla(r)) byArea[key].villaPrices.push(price);
    }
  });
  return byArea;
}

export function buildTxCountsByArea(byArea) {
  const txDataByArea = {};
  Object.entries(byArea).forEach(([, d]) => {
    const geoName = resolveAreaToGeoJSON(d.name);
    const n = normArea(geoName);
    const key = normArea(d.name);
    txDataByArea[n] = (txDataByArea[n] || 0) + d.txCount;
    txDataByArea[key] = (txDataByArea[key] || 0) + d.txCount;
  });
  return txDataByArea;
}

export function mergeAreasToGeoNames(byArea) {
  const byGeo = {};
  Object.entries(byArea).forEach(([, d]) => {
    const geoName = resolveAreaToGeoJSON(d.name);
    const n = normArea(geoName);
    if (!byGeo[n]) byGeo[n] = {
      aptPrices: [],
      villaPrices: [],
      txCount: 0,
      dldNames: []
    };
    byGeo[n].aptPrices.push(...d.aptPrices);
    byGeo[n].villaPrices.push(...d.villaPrices);
    byGeo[n].txCount += d.txCount;
    byGeo[n].dldNames.push(d.name);
  });
  return byGeo;
}
