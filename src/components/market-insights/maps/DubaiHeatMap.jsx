import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BarChart2, Maximize, Minimize, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import HeatmapPanel from "./HeatmapPanel";
import { BASEMAP_URL, BASEMAP_ATTRIBUTION } from "./basemap";
import {
  getColorForMode,
  getColorTx,
  getLegendForMode,
  getLegendLabel,
  getModeHelpText,
  fallbackValue,
  normArea,
  fmt,
  deriveAreaDataFromRows,
  buildGeoFeatureLookup,
  loadCommunities,
  useTransactionData
} from "../../../features/market-intelligence";
const DEMO_FILL_MISSING = true;
function ResetViewController({
  nonce
}) {
  const map = useMap();
  useEffect(() => {
    if (!nonce) return;
    map.setView([25.2, 55.3], 11);
  }, [nonce, map]);
  return null;
}
export default function DubaiHeatmap({
  initialMode = "sale_apartment"
}) {
  const [mode, setMode] = useState(initialMode);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetNonce, setResetNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selectedLayerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const {
    rows,
    loading: csvLoading,
    error: csvError
  } = useTransactionData();
  const {
    data: geo,
    isLoading: geoLoading,
    error: geoError
  } = useQuery({
    queryKey: ["dubai-geojson"],
    queryFn: loadCommunities,
    staleTime: Infinity
  });
  const loadError = csvError || geoError;
  const derived = useMemo(() => {
    if (csvLoading || geoLoading || !geo) return null;
    const geoLookup = buildGeoFeatureLookup(geo);
    return deriveAreaDataFromRows(rows, geoLookup);
  }, [csvLoading, geoLoading, geo, rows]);
  const dubaiGeoJSON = derived ? geo : null;
  const areaData = derived?.areaDataByCommNum ?? null;
  const txData = derived?.txDataByArea ?? {};
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  useEffect(() => {
    if (!selectedLayerRef.current) return;
    try {
      selectedLayerRef.current.setStyle({
        weight: 1,
        fillOpacity: 0.7
      });
    } catch {}
    selectedLayerRef.current = null;
  }, [mode]);
  const datasetMeta = useMemo(() => {
    if (!areaData) return null;
    return {
      reportPeriod: " Sale prices from transactions",
      sourceName: "Dubai Land Department"
    };
  }, [areaData]);
  const normalize = s => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const findCommNumByQuery = query => {
    const q = normalize(query);
    if (!q || !areaData) return null;
    let best = null;
    for (const [commNum, v] of Object.entries(areaData)) {
      if (String(commNum).startsWith("_area_")) continue;
      if (!v || typeof v !== "object") continue;
      for (const c of [v.alias, v.name]) {
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
    const feature = dubaiGeoJSON.features?.find(f => String(f?.properties?.COMM_NUM ?? "") === String(commNum));
    if (!feature) return;
    const data = areaData?.[String(commNum)];
    const txCount = txData[normArea(feature?.properties?.CNAME_E ?? "")] ?? null;
    setSelected({
      name: data?.name ?? feature?.properties?.CNAME_E,
      alias: data?.alias,
      commNum: String(commNum),
      txCount,
      data: data ?? (DEMO_FILL_MISSING ? {
        [mode]: fallbackValue(String(commNum), mode),
        __estimated: true
      } : undefined)
    });
  };
  const style = feature => {
    const commNum = String(feature?.properties?.COMM_NUM ?? "");
    const data = areaData?.[commNum];
    if (mode === "transactions") {
      const count = txData[normArea(feature?.properties?.CNAME_E ?? "")] ?? null;
      return {
        fillColor: getColorTx(count),
        fillOpacity: count != null ? 0.75 : 0.15,
        color: count != null ? "#fff" : "#cbd5e1",
        weight: 1,
        dashArray: count != null ? undefined : "3"
      };
    }
    const value = data?.[mode] ?? (DEMO_FILL_MISSING && commNum ? fallbackValue(commNum, mode) : undefined);
    return {
      fillColor: getColorForMode(value, mode),
      fillOpacity: 0.7,
      color: data ? "#fff" : "#64748b",
      weight: 1,
      dashArray: data ? undefined : "3"
    };
  };
  const onEachFeature = (feature, layer) => {
    const getInfo = () => {
      const commNum = String(feature?.properties?.COMM_NUM ?? "");
      const data = areaData?.[commNum];
      const geoName = normArea(feature?.properties?.CNAME_E ?? "");
      return {
        name: data?.name ?? feature?.properties?.CNAME_E,
        alias: data?.alias,
        commNum,
        txCount: txData[geoName] ?? null,
        data: data ?? (DEMO_FILL_MISSING && commNum ? {
          [mode]: fallbackValue(commNum, mode),
          __estimated: true
        } : undefined)
      };
    };
    layer.on({
      mouseover: e => {
        setHovered(getInfo());
        e.target.setStyle({
          fillOpacity: 0.9,
          weight: 2
        });
      },
      mouseout: e => {
        setHovered(null);
        e.target.setStyle({
          fillOpacity: 0.7,
          weight: 1
        });
      },
      click: () => {
        setSelected(getInfo());
        if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
          try {
            selectedLayerRef.current.setStyle({
              weight: 1,
              fillOpacity: 0.7
            });
          } catch {}
        }
        selectedLayerRef.current = layer;
        try {
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.95
          });
          if (layer.bringToFront) layer.bringToFront();
        } catch {}
      }
    });
  };
  const PRICE_MODES = [{
    key: "sale_apartment",
    label: "Sale Apt"
  }, {
    key: "sale_villa",
    label: "Sale Villa"
  }, {
    key: "rent_apartment",
    label: "Rent Apt"
  }, {
    key: "rent_villa",
    label: "Rent Villa"
  }];
  const hoveredColor = mode === "transactions" ? getColorTx(hovered?.txCount) : getColorForMode(hovered?.data?.[mode], mode);
  return <>
      <style>{`.heatmap-btn { padding: 8px 16px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }`}</style>
      <div style={{
      fontFamily: "var(--font-body)",
      background: "#f7f7f7",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #e5e7eb"
    }}>

        <div style={{
        background: "#fff",
        padding: "14px 20px",
        borderBottom: "1px solid #e5e7eb"
      }}>
          <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10
        }}>
            <div>
              <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
                <BarChart2 size={20} style={{
                color: "#e83f25"
              }} />
                <span style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#000",
                fontFamily: "var(--font-display)"
              }}>
                  Dubai {mode === "transactions" ? "Transaction" : "Price"} Heatmap
                </span>
                <span style={{
                background: "#f1f5f9",
                color: "#64748b",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 600
              }}>
                  {mode === "transactions" ? "DLD Open Data" : datasetMeta?.reportPeriod ?? "Market Averages"}
                </span>
              </div>
              <p style={{
              fontSize: 12,
              color: "#64748b",
              margin: "4px 0 0 28px"
            }}>{getModeHelpText(mode)}</p>
            </div>
            <div style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center"
          }}>
              <div style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: 10,
              padding: 3,
              gap: 3
            }}>
                {PRICE_MODES.map(m => <button key={m.key} className="heatmap-btn" onClick={() => setMode(m.key)} style={{
                background: mode === m.key ? "#e83f25" : "transparent",
                color: mode === m.key ? "#fff" : "#64748b"
              }}>
                    {m.label}
                  </button>)}
              </div>
              <button className="heatmap-btn" onClick={() => setMode("transactions")} style={{
              background: mode === "transactions" ? "#0369a1" : "#f1f5f9",
              color: mode === "transactions" ? "#fff" : "#64748b",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}>
                <Building2 size={14} strokeWidth={2.5} /> Transactions
              </button>
              <button className="heatmap-btn" onClick={() => setResetNonce(n => n + 1)} style={{
              background: "#f1f5f9",
              color: "#334155"
            }}>
                Reset view
              </button>
            </div>
          </div>
        </div>

        <div ref={mapContainerRef} style={{
        position: "relative",
        height: 600
      }}>
          <MapContainer center={[25.2, 55.3]} zoom={11} style={{
          height: "100%",
          width: "100%"
        }} scrollWheelZoom>
            <TileLayer url={BASEMAP_URL} attribution={BASEMAP_ATTRIBUTION} />
            <ResetViewController nonce={resetNonce} />
            {dubaiGeoJSON && areaData && <GeoJSON key={mode} data={dubaiGeoJSON} style={style} onEachFeature={onEachFeature} />}
          </MapContainer>

          {!dubaiGeoJSON && !loadError && <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.7)",
          zIndex: 1100
        }}>
              <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)"
          }}>
                <div style={{
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 6
            }}>Loading map…</div>
                <div style={{
              fontSize: 12,
              color: "#64748b"
            }}>Fetching boundary and market data.</div>
              </div>
            </div>}

          {loadError && <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.75)",
          zIndex: 1100,
          padding: 16
        }}>
              <div style={{
            background: "#fff",
            border: "1px solid #fecaca",
            borderRadius: 14,
            padding: 16,
            maxWidth: 520,
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)"
          }}>
                <div style={{
              fontWeight: 900,
              color: "#991b1b",
              marginBottom: 6
            }}>Failed to load heatmap data</div>
                <div style={{
              fontSize: 12,
              color: "#7f1d1d",
              lineHeight: 1.5
            }}>{String(loadError?.message ?? loadError)}</div>
              </div>
            </div>}

          {hovered && <div style={{
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
          border: `2px solid ${hoveredColor}`
        }}>
              <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
                <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: hoveredColor
            }} />
                <span style={{
              fontWeight: 700,
              fontSize: 14,
              color: "#111"
            }}>
                  {hovered.alias ? `${hovered.alias} (${hovered.name})` : hovered.name}
                </span>
              </div>
              {mode === "transactions" ? <div style={{
            fontSize: 17,
            fontWeight: 800,
            color: hoveredColor
          }}>
                  {hovered.txCount != null ? `${hovered.txCount.toLocaleString()} transactions` : "No data"}
                </div> : hovered.data?.[mode] ? <div style={{
            fontSize: 17,
            fontWeight: 800,
            color: hoveredColor
          }}>
                  {mode.startsWith("sale") ? `${fmt(hovered.data[mode])} AED/sqft` : `${fmt(hovered.data[mode])} AED/year`}
                </div> : <div style={{
            fontSize: 12,
            color: "#9ca3af"
          }}>No data for this type</div>}
            </div>}

          <HeatmapPanel selected={selected} onClose={() => setSelected(null)} searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchGo={handleSearchGo} mode={mode} />

          <button onClick={() => isFullscreen ? document.exitFullscreen?.() : mapContainerRef.current?.requestFullscreen?.()} style={{
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
          fontFamily: "var(--font-body)"
        }}>
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            {isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          </button>

          <div style={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 1000,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "10px 12px"
        }}>
            <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6
          }}>{getLegendLabel(mode)}</div>
            {getLegendForMode(mode).map(l => <div key={l.label} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4
          }}>
                <div style={{
              width: 18,
              height: 10,
              borderRadius: 2,
              background: l.color
            }} />
                <span style={{
              fontSize: 10,
              color: "#374151"
            }}>{l.label}</span>
              </div>)}
          </div>

          <div style={{
          position: "absolute",
          bottom: 8,
          right: 10,
          zIndex: 1000,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 6,
          padding: "2px 8px",
          fontSize: 9,
          color: "#9ca3af"
        }}>
            {mode === "transactions" ? "Transactions: Dubai Land Department Open Data" : "Price data: derived from DLD sales transactions"}
          </div>
        </div>
      </div>
    </>;
}
