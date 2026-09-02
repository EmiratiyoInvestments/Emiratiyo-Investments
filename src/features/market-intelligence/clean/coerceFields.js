export function parseNumeric(value) {
  return parseFloat(value);
}

export function parseMoney(value) {
  return parseFloat(value) || 0;
}

export function trimText(value) {
  return value?.trim();
}
