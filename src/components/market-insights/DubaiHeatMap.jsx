import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BarChart2, Map, Maximize, Minimize } from "lucide-react";

// ── Color Scale ───────────────────────────────────────────────────────────────
function getColorSale(value) {
  if (value == null) return "#94a3b8";

  if (value < 500) return "#15803d";
  if (value < 700) return "#22c55e";
  if (value < 900) return "#86efac";
  if (value < 1100) return "#bef264";
  if (value < 1400) return "#fde047";
  if (value < 1700) return "#fb923c";
  if (value < 2000) return "#ef4444";
  if (value < 2500) return "#dc2626";
  return "#7f1d1d";
}

function getColorRent(value) {
  if (value == null) return "#94a3b8";

  if (value < 60000) return "#15803d";
  if (value < 90000) return "#22c55e";
  if (value < 120000) return "#86efac";
  if (value < 150000) return "#bef264";
  if (value < 180000) return "#fde047";
  if (value < 220000) return "#fb923c";
  if (value < 260000) return "#ef4444";
  if (value < 320000) return "#dc2626";
  return "#7f1d1d";
}

function getColorForMode(value, mode) {
  return mode.startsWith("rent") ? getColorRent(value) : getColorSale(value);
}

const LEGEND_SALE = [
  { label: "< 500", color: "#15803d" },
  { label: "500 – 700", color: "#22c55e" },
  { label: "700 – 900", color: "#86efac" },
  { label: "900 – 1,100", color: "#bef264" },
  { label: "1,100 – 1,400", color: "#fde047" },
  { label: "1,400 – 1,700", color: "#fb923c" },
  { label: "1,700 – 2,000", color: "#ef4444" },
  { label: "2,000 – 2,500", color: "#dc2626" },
  { label: "> 2,500", color: "#7f1d1d" },
];

const LEGEND_RENT = [
  { label: "< 60k", color: "#15803d" },
  { label: "60k – 90k", color: "#22c55e" },
  { label: "90k – 120k", color: "#86efac" },
  { label: "120k – 150k", color: "#bef264" },
  { label: "150k – 180k", color: "#fde047" },
  { label: "180k – 220k", color: "#fb923c" },
  { label: "220k – 260k", color: "#ef4444" },
  { label: "260k – 320k", color: "#dc2626" },
  { label: "> 320k", color: "#7f1d1d" },
];

function fmt(n) {
  return new Intl.NumberFormat("en-AE").format(n);
}

function fmtPct(n) {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

function buildAutoDescription(area, mode) {
  if (!area) return "";
  if (area.__estimated) {
    return "Estimated values are shown for visual completeness. Replace with verified market data when available.";
  }

  const alias = area.alias;
  const official = area.name;
  const title =
    alias && alias !== official ? `${alias} (${official})` : official;
  const saleApt = area.sale_apartment;
  const rentApt = area.rent_apartment;
  const yoy = area.yoy_change;

  const parts = [
    `${title} is shown here with indicative market averages for residential property.`,
  ];

  if (saleApt != null)
    parts.push(
      `Average apartment sale pricing is around ${fmt(saleApt)} AED/sqft.`,
    );
  if (rentApt != null)
    parts.push(`Typical apartment rents are around ${fmt(rentApt)} AED/year.`);
  if (yoy != null) parts.push(`Year-on-year change: ${fmtPct(yoy)}.`);

  if (mode?.startsWith("sale")) {
    parts.push(
      "Use this view to compare relative sale pricing across communities.",
    );
  } else if (mode?.startsWith("rent")) {
    parts.push(
      "Use this view to compare relative rental pricing across communities.",
    );
  }

  return parts.join(" ");
}

const DEBUG_GEOJSON_KEYS = false;
const DEMO_FILL_MISSING = true;

function fallbackValue(commNum, mode) {
  let hash = 0;
  for (let i = 0; i < commNum.length; i += 1) {
    hash = (hash * 31 + commNum.charCodeAt(i)) >>> 0;
  }

  if (mode.startsWith("sale")) {
    return 600 + (hash % 2200);
  }

  return 45000 + (hash % 140000);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DubaiHeatmap() {
  const [mode, setMode] = useState("sale_apartment");
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [dubaiGeoJSON, setDubaiGeoJSON] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loggedMissing = React.useRef(new Set());
  const selectedLayerRef = React.useRef(null);
  const mapContainerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const datasetMeta = React.useMemo(() => {
    if (!areaData) return null;

    let updatedAt = null;
    let reportPeriod = null;
    let sourceName = null;
    let sourceUrl = null;

    for (const v of Object.values(areaData)) {
      if (!v || typeof v !== "object") continue;
      if (!updatedAt && v.updated_at) updatedAt = v.updated_at;
      if (!reportPeriod && v.report_period) reportPeriod = v.report_period;
      if (!sourceName && v.source_name) sourceName = v.source_name;
      if (!sourceUrl && v.source_url) sourceUrl = v.source_url;
      if (updatedAt && reportPeriod && sourceName && sourceUrl) break;
    }

    return { updatedAt, reportPeriod, sourceName, sourceUrl };
  }, [areaData]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadError(null);
      const parseJsonOrThrow = async (res, label) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `[DubaiHeatmap] Failed to load ${label} (${res.status} ${res.statusText}). ` +
              `First bytes: ${JSON.stringify(text.slice(0, 80))}`,
          );
        }

        const contentType = res.headers.get("content-type") || "";
        if (
          !contentType.includes("application/json") &&
          !contentType.includes("geo+json")
        ) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `[DubaiHeatmap] ${label} did not return JSON (content-type: ${contentType}). ` +
              `First bytes: ${JSON.stringify(text.slice(0, 80))}`,
          );
        }

        return res.json();
      };

      const [geoRes, dataRes] = await Promise.all([
        fetch("/data/dubai.geojson"),
        fetch("/data/dubai-area-data.json"),
      ]);

      const [geo, data] = await Promise.all([
        parseJsonOrThrow(geoRes, "/data/dubai.geojson"),
        parseJsonOrThrow(dataRes, "/data/dubai-area-data.json"),
      ]);

      if (!cancelled) {
        setDubaiGeoJSON(geo);
        setAreaData(data);
      }
    })().catch((err) => {
      console.error(err);
      if (!cancelled) setLoadError(err);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedLayerRef.current) return;
    try {
      selectedLayerRef.current.setStyle({ weight: 1, fillOpacity: 0.7 });
    } catch {
      // ignore
    }
    selectedLayerRef.current = null;
  }, [mode]);

  const modeHelpText = React.useMemo(() => {
    if (mode === "sale_apartment")
      return "Average apartment sale price (AED/sqft)";
    if (mode === "sale_villa") return "Average villa sale price (AED/sqft)";
    if (mode === "rent_apartment")
      return "Average apartment annual rent (AED/year)";
    if (mode === "rent_villa") return "Average villa annual rent (AED/year)";
    return "";
  }, [mode]);

  const [resetNonce, setResetNonce] = useState(0);

  const handleResetView = () => {
    setResetNonce((n) => n + 1);
  };

  function ResetViewController({ nonce }) {
    const map = useMap();

    useEffect(() => {
      if (!nonce) return;
      map.setView([25.2, 55.3], 11);
    }, [nonce, map]);

    return null;
  }

  const normalize = (s) =>
    String(s ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const findCommNumByQuery = (query) => {
    const q = normalize(query);
    if (!q || !areaData) return null;

    let best = null;
    for (const [commNum, v] of Object.entries(areaData)) {
      if (!v || typeof v !== "object") continue;
      const candidates = [v.alias, v.name, v.mapping_note];
      for (const c of candidates) {
        const n = normalize(c);
        if (!n) continue;
        if (n === q) return commNum;
        if (n.includes(q)) best = best ?? commNum;
      }
    }
    return best;
  };

  const handleSearchGo = () => {
    const commNum = findCommNumByQuery(searchQuery);
    if (!commNum || !dubaiGeoJSON) return;

    const feature = dubaiGeoJSON?.features?.find(
      (f) => String(f?.properties?.COMM_NUM ?? "") === String(commNum),
    );
    if (!feature) return;

    const data = areaData?.[String(commNum)];
    const name = data?.name ?? feature?.properties?.CNAME_E;
    const alias = data?.alias;
    const effectiveData =
      data ??
      (DEMO_FILL_MISSING && commNum
        ? {
            [mode]: fallbackValue(String(commNum), mode),
            __estimated: true,
          }
        : undefined);

    setSelected({ name, alias, commNum: String(commNum), data: effectiveData });
  };

  const style = (feature) => {
    const commNum = String(feature?.properties?.COMM_NUM ?? "");
    const data = areaData?.[commNum];
    const value =
      data?.[mode] ??
      (DEMO_FILL_MISSING && commNum ? fallbackValue(commNum, mode) : undefined);

    if (showVerifiedOnly && !data) {
      return {
        fillColor: "#e2e8f0",
        fillOpacity: 0.15,
        color: "#cbd5e1",
        weight: 1,
      };
    }

    if (
      DEBUG_GEOJSON_KEYS &&
      areaData &&
      !data &&
      commNum &&
      !loggedMissing.current.has(commNum)
    ) {
      loggedMissing.current.add(commNum);
      console.log(
        "[DubaiHeatmap] Missing areaData for COMM_NUM:",
        commNum,
        "CNAME_E:",
        feature?.properties?.CNAME_E,
      );
    }

    return {
      fillColor: getColorForMode(value, mode),
      fillOpacity: 0.7,
      color: data ? "#fff" : "#64748b",
      weight: 1,
      dashArray: data ? undefined : "3",
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        if (showVerifiedOnly) {
          const commNum0 = String(feature?.properties?.COMM_NUM ?? "");
          const data0 = areaData?.[commNum0];
          if (!data0) return;
        }

        const commNum = String(feature?.properties?.COMM_NUM ?? "");
        const data = areaData?.[commNum];
        const name = data?.name ?? feature?.properties?.CNAME_E;
        const alias = data?.alias;

        const effectiveData =
          data ??
          (DEMO_FILL_MISSING && commNum
            ? {
                [mode]: fallbackValue(commNum, mode),
                __estimated: true,
              }
            : undefined);

        setHovered({ name, alias, commNum, data: effectiveData });
        e.target.setStyle({ fillOpacity: 0.9, weight: 2 });
      },

      mouseout: (e) => {
        setHovered(null);
        e.target.setStyle({ fillOpacity: 0.7, weight: 1 });
      },
      click: () => {
        if (showVerifiedOnly) {
          const commNum0 = String(feature?.properties?.COMM_NUM ?? "");
          const data0 = areaData?.[commNum0];
          if (!data0) return;
        }

        const commNum = String(feature?.properties?.COMM_NUM ?? "");
        const data = areaData?.[commNum];
        const name = data?.name ?? feature?.properties?.CNAME_E;
        const alias = data?.alias;

        const effectiveData =
          data ??
          (DEMO_FILL_MISSING && commNum
            ? {
                [mode]: fallbackValue(commNum, mode),
                __estimated: true,
              }
            : undefined);

        setSelected({ name, alias, commNum, data: effectiveData });

        if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
          try {
            selectedLayerRef.current.setStyle({ weight: 1, fillOpacity: 0.7 });
          } catch {
            // ignore
          }
        }

        selectedLayerRef.current = layer;
        try {
          layer.setStyle({ weight: 3, fillOpacity: 0.95 });
          if (layer.bringToFront) layer.bringToFront();
        } catch {
          // ignore
        }
      },
    });
  };

  return (
    <>
      <style>{`
        .heatmap-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-body);
        }
      `}</style>

      <div
        style={{
          fontFamily: "var(--font-body)",
          background: "#f7f7f7",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            padding: "14px 20px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart2 size={20} style={{ color: "#e83f25" }} />
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#000",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Dubai Price Heatmap
                </span>
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontWeight: 600,
                  }}
                >
                  {datasetMeta?.reportPeriod ?? "Market Averages"}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  margin: "4px 0 0 28px",
                }}
              >
                {modeHelpText} · Indicative market averages (not a live feed)
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  margin: "6px 0 0 28px",
                }}
              >
                {datasetMeta?.updatedAt
                  ? `Last updated: ${datasetMeta.updatedAt}`
                  : ""}
                {datasetMeta?.sourceName
                  ? ` · Source: ${datasetMeta.sourceName}`
                  : ""}
              </p>
            </div>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                borderRadius: 10,
                padding: 3,
                gap: 3,
              }}
            >
              <button
                className="heatmap-btn"
                onClick={() => setMode("sale_apartment")}
                style={{
                  background:
                    mode === "sale_apartment" ? "#e83f25" : "transparent",
                  color: mode === "sale_apartment" ? "#fff" : "#64748b",
                }}
              >
                Sale Apt
              </button>
              <button
                className="heatmap-btn"
                onClick={() => setMode("sale_villa")}
                style={{
                  background: mode === "sale_villa" ? "#e83f25" : "transparent",
                  color: mode === "sale_villa" ? "#fff" : "#64748b",
                }}
              >
                Sale Villa
              </button>
              <button
                className="heatmap-btn"
                onClick={() => setMode("rent_apartment")}
                style={{
                  background:
                    mode === "rent_apartment" ? "#e83f25" : "transparent",
                  color: mode === "rent_apartment" ? "#fff" : "#64748b",
                }}
              >
                Rent Apt
              </button>
              <button
                className="heatmap-btn"
                onClick={() => setMode("rent_villa")}
                style={{
                  background: mode === "rent_villa" ? "#e83f25" : "transparent",
                  color: mode === "rent_villa" ? "#fff" : "#64748b",
                }}
              >
                Rent Villa
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="heatmap-btn"
                onClick={handleResetView}
                style={{
                  background: "#f1f5f9",
                  color: "#334155",
                }}
              >
                Reset view
              </button>

              {/* <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569", fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                />
                Only verified data
              </label> */}
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          ref={mapContainerRef}
          style={{ position: "relative", height: 600 }}
        >
          <MapContainer
            center={[25.2, 55.3]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <ResetViewController nonce={resetNonce} />
            {dubaiGeoJSON && areaData && (
              <GeoJSON
                data={dubaiGeoJSON}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>

          {!dubaiGeoJSON && !loadError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                zIndex: 1100,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 16,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                }}
              >
                <div
                  style={{ fontWeight: 900, color: "#0f172a", marginBottom: 6 }}
                >
                  Loading map…
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Fetching boundary and market data.
                </div>
              </div>
            </div>
          )}

          {loadError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.75)",
                zIndex: 1100,
                padding: 16,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #fecaca",
                  borderRadius: 14,
                  padding: 16,
                  maxWidth: 520,
                  width: "100%",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                }}
              >
                <div
                  style={{ fontWeight: 900, color: "#991b1b", marginBottom: 6 }}
                >
                  Failed to load heatmap data
                </div>
                <div
                  style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}
                >
                  {String(loadError?.message ?? loadError)}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
                  Check that <code>/public/data/dubai.geojson</code> and{" "}
                  <code>/public/data/dubai-area-data.json</code> exist and
                  contain valid JSON.
                </div>
              </div>
            </div>
          )}

          {/* Hover Tooltip */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                top: 14,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: "10px 14px",
                pointerEvents: "none",
                minWidth: 200,
                border: `2px solid ${getColorForMode(hovered.data?.[mode], mode)}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: getColorForMode(hovered.data?.[mode], mode),
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>
                  {hovered.alias
                    ? `${hovered.alias} (${hovered.name})`
                    : hovered.name}
                </span>
                {hovered.data?.__estimated && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: "#fff7ed",
                      color: "#c2410c",
                      fontWeight: 700,
                    }}
                  >
                    Estimated
                  </span>
                )}
              </div>
              {hovered.data?.[mode] ? (
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: getColorForMode(hovered.data[mode], mode),
                  }}
                >
                  {mode.startsWith("sale")
                    ? `${fmt(hovered.data[mode])} AED/sqft`
                    : `${fmt(hovered.data[mode])} AED/year`}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  No data for this type
                </div>
              )}
            </div>
          )}

          {/* Slide-in Details Panel */}
          {selected && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 360,
                maxWidth: "92vw",
                zIndex: 1200,
                background: "rgba(15, 23, 42, 0.35)",
                display: "flex",
              }}
              onClick={() => setSelected(null)}
            >
              <div
                style={{
                  width: 380,
                  maxWidth: "92vw",
                  background: "#fff",
                  borderTopRightRadius: 16,
                  borderBottomRightRadius: 16,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  padding: 16,
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchGo();
                    }}
                    placeholder="Search area (e.g., Marina, Business Bay)"
                    style={{
                      flex: 1,
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleSearchGo}
                    style={{
                      border: "none",
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "#e83f25",
                      color: "#fff",
                      fontWeight: 900,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Go
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#0f172a",
                        fontFamily: "var(--font-display)",
                        lineHeight: 1.1,
                      }}
                    >
                      {selected.alias ? selected.alias : selected.name}
                    </div>
                    {selected.alias && (
                      <div
                        style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}
                      >
                        {selected.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: 10,
                      padding: "6px 10px",
                      cursor: "pointer",
                      color: "#334155",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: "#f1f5f9",
                      color: "#475569",
                      fontWeight: 800,
                    }}
                  >
                    {mode.startsWith("sale") ? "AED/sqft" : "AED/year"}
                  </span>
                  {selected.data?.__estimated && (
                    <span
                      style={{
                        fontSize: 12,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "#fff7ed",
                        color: "#c2410c",
                        fontWeight: 800,
                      }}
                    >
                      Estimated
                    </span>
                  )}
                  {selected.data?.yoy_change != null && (
                    <span
                      style={{
                        fontSize: 12,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "#ecfeff",
                        color: "#0e7490",
                        fontWeight: 800,
                      }}
                    >
                      YoY {fmtPct(selected.data.yoy_change)}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {[
                    {
                      label: "Sale Apartment",
                      value: selected.data?.sale_apartment,
                      unit: "AED/sqft",
                    },
                    {
                      label: "Sale Villa",
                      value: selected.data?.sale_villa,
                      unit: "AED/sqft",
                    },
                    {
                      label: "Rent Apartment",
                      value: selected.data?.rent_apartment,
                      unit: "AED/year",
                    },
                    {
                      label: "Rent Villa",
                      value: selected.data?.rent_villa,
                      unit: "AED/year",
                    },
                  ].map(({ label, value, unit }) => (
                    <div
                      key={label}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#475569",
                          fontWeight: 800,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color: value != null ? "#0f172a" : "#cbd5e1",
                        }}
                      >
                        {value != null ? `${fmt(value)} ${unit}` : "—"}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#0f172a",
                      marginBottom: 6,
                    }}
                  >
                    About
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}
                  >
                    {selected.data?.__estimated && (
                      <div
                        style={{
                          marginBottom: 8,
                          fontWeight: 900,
                          color: "#c2410c",
                        }}
                      >
                        No verified data for this community yet.
                      </div>
                    )}
                    {buildAutoDescription(
                      {
                        ...(selected.data || {}),
                        name: selected.name,
                        alias: selected.alias,
                      },
                      mode,
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#0f172a",
                      marginBottom: 8,
                    }}
                  >
                    Data notes
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}
                  >
                    Indicative market averages from publicly available sources.
                    Not a live feed and not financial advice.
                  </div>

                  {selected.data?.mapping_note && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: "#64748b",
                        lineHeight: 1.6,
                      }}
                    >
                      {selected.data.mapping_note}
                    </div>
                  )}

                  {selected.data?.source_url && (
                    <a
                      href={selected.data.source_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#e83f25",
                        textDecoration: "none",
                      }}
                    >
                      Open source
                    </a>
                  )}
                  <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                    {selected.data?.source_name
                      ? `Source: ${selected.data.source_name}`
                      : ""}
                    {selected.data?.report_period
                      ? ` · ${selected.data.report_period}`
                      : ""}
                    {selected.data?.updated_at
                      ? ` · Updated ${selected.data.updated_at}`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Fullscreen Button */}
          <button
            onClick={() =>
              isFullscreen
                ? document.exitFullscreen?.()
                : mapContainerRef.current?.requestFullscreen?.()
            }
            style={{
              position: "absolute",
              bottom: 14,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 999,
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              fontSize: 12,
              fontWeight: 600,
              color: "#334155",
              fontFamily: "var(--font-body)",
            }}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            {isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          </button>

          {/* Legend */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 1000,
              background: "rgba(255,255,255,0.96)",
              borderRadius: 10,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {mode.startsWith("sale") ? "AED / sqft" : "AED / year"}
            </div>
            {(mode.startsWith("rent") ? LEGEND_RENT : LEGEND_SALE).map((l) => (
              <div
                key={l.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 10,
                    borderRadius: 2,
                    background: l.color,
                  }}
                />
                <span style={{ fontSize: 10, color: "#374151" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 10,
              zIndex: 1000,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 9,
              color: "#9ca3af",
            }}
          >
            Boundaries &copy; Kaggle &middot; Data: indicative market averages
          </div>
        </div>
      </div>
    </>
  );
}
