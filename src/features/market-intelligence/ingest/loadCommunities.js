export const COMMUNITIES_GEOJSON_PATH = "/data/dubai.geojson";

export async function loadCommunities() {
  const res = await fetch(COMMUNITIES_GEOJSON_PATH);
  if (!res.ok) throw new Error(`Failed to load dubai.geojson (${res.status})`);
  return res.json();
}
