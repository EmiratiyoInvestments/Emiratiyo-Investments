import { parseNumeric } from "../clean/coerceFields";

export const SQM_TO_SQFT = 10.7639;

export function pricePerSqft(row) {
  const area = parseNumeric(row.PROCEDURE_AREA) || parseNumeric(row.ACTUAL_AREA);
  const val = parseNumeric(row.TRANS_VALUE);
  if (!area || area <= 0 || !val || val <= 0) return null;
  const sqft = area * SQM_TO_SQFT;
  return Math.round(val / sqft);
}
