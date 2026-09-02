import { normArea } from "../normalize/areaNames";
import { median } from "../aggregate/communityMedians";

export function buildGeoFeatureLookup(geoJSON) {
  const lookup = {};
  (geoJSON?.features || []).forEach(f => {
    const p = f?.properties;
    if (!p?.CNAME_E) return;
    const cname = String(p.CNAME_E).trim();
    const n = normArea(cname);
    lookup[n] = {
      COMM_NUM: p.COMM_NUM,
      CNAME_E: cname
    };
    lookup[cname] = lookup[n];
  });
  return lookup;
}

export function attachCommunityIds(byGeo, geoFeatures = {}) {
  const areaDataByCommNum = {};
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
        _source: "DLD"
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
        _areaKey: geoKey
      };
    }
  });
  return areaDataByCommNum;
}
