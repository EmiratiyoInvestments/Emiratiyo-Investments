// Maps DLD CSV AREA_EN (normalized) to GeoJSON CNAME_E
// Used to reconcile DLD area names with Dubai GeoJSON community names
// Add entries when CSV and GeoJSON use different names for the same area

export function normArea(s) {
  return String(s ?? "").toUpperCase().trim().replace(/\s+/g, " ");
}

/** DLD AREA_EN (normalized) → GeoJSON CNAME_E */
const DLD_TO_GEOJSON = {
  "SUFOUH GARDENS": "MARSA DUBAI",
  "JUMEIRAH LAKES TOWERS": "AL THANYAH FIFTH",
  "AL THANYAH FIFTH": "AL THANYAH FIFTH",
  "TRADE CENTER SECOND": "TRADE CENTER SECOND",
  "TRADE CENTRE SECOND": "TRADE CENTER SECOND",
  "AL YELAYIS 1": "AL YALAYIS 4",
  "AL YELAYISS 1": "AL YALAYIS 4",
  "AL YELAYIS 2": "AL YALAYIS 2",
  "WARSAN FIRST": "WADI AL SHABAK",
  "WADI AL SAFA 4": "WADI AL SAFA 6",
  "WADI AL SAFA 7": "WADI AL SAFA 7",
  "NAD AL SHEBA GARDENS": "NADD AL SHIBA SECOND",
  "HADAEQ SHEIKH MOHAMMED BIN RASHID": "AL SAFOUH SECOND",
  "HORIZON": "AL CORNICHE",
  "MADINAT AL MATAAR": "AL MERYAL",
  "MADINAT HIND 4": "AL MERYAL",
  "PALM DEIRA": "PALM DEIRA",
  "AL MERKADH": "AL MERKADH",
  "AL MERKAD": "AL MERKADH",
  "DUBAI SCIENCE PARK": "MIRDIF",
};

/**
 * Resolve DLD area name to GeoJSON CNAME_E
 * @param {string} dldArea - AREA_EN from CSV
 * @returns {string} CNAME_E for GeoJSON lookup (or same if direct match)
 */
export function resolveAreaToGeoJSON(dldArea) {
  const n = normArea(dldArea);
  return DLD_TO_GEOJSON[n] ?? n;
}
