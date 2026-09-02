import { groupPricesByArea, buildTxCountsByArea, mergeAreasToGeoNames } from "./aggregate/communityMedians";
import { attachCommunityIds } from "./spatial/joinCommunities";

export { TRANSACTION_CSV_PATH, loadTransactions } from "./ingest/loadTransactions";
export { COMMUNITIES_GEOJSON_PATH, loadCommunities } from "./ingest/loadCommunities";
export { filterValidSales, hasValidAreaName, hasValidProjectName } from "./clean/filterValidSales";
export { parseNumeric, parseMoney, trimText } from "./clean/coerceFields";
export { normArea, resolveAreaToGeoJSON } from "./normalize/areaNames";
export { SQM_TO_SQFT, pricePerSqft } from "./transform/pricePerSqft";
export { isApartment, isVilla } from "./transform/propertyType";
export { computeCityStats } from "./aggregate/cityStats";
export { median, groupPricesByArea, buildTxCountsByArea, mergeAreasToGeoNames } from "./aggregate/communityMedians";
export { buildGeoFeatureLookup, attachCommunityIds } from "./spatial/joinCommunities";
export {
  getColorSale,
  getColorRent,
  getColorTx,
  getColorForMode,
  LEGEND_SALE,
  LEGEND_RENT,
  LEGEND_TX,
  getLegendForMode,
  getLegendLabel,
  getModeHelpText
} from "./present/choroplethScale";
export { fmt, fmtPct, fallbackValue, buildAutoDescription } from "./present/heatmapCopy";
export { useTransactionData } from "./hooks/useTransactionData";

export function deriveAreaDataFromRows(rows, geoFeatures = {}) {
  const byArea = groupPricesByArea(rows);
  const txDataByArea = buildTxCountsByArea(byArea);
  const byGeo = mergeAreasToGeoNames(byArea);
  const areaDataByCommNum = attachCommunityIds(byGeo, geoFeatures);
  return {
    areaDataByCommNum,
    txDataByArea
  };
}
