// src/components/market-insights/maps/HeatmapPanel.jsx
import React from "react";
import { Building2 } from "lucide-react";
import { fmt, fmtPct, buildAutoDescription } from "./HeatmapUtils";

export default function HeatmapPanel({ selected, onClose, searchQuery, onSearchChange, onSearchGo, mode }) {
  if (!selected) return null;

  return (
    <div
      style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 360, maxWidth: "92vw", zIndex: 1200, background: "rgba(15,23,42,0.35)", display: "flex" }}
      onClick={onClose}
    >
      <div
        style={{ width: 380, maxWidth: "92vw", background: "#fff", borderTopRightRadius: 16, borderBottomRightRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", padding: 16, overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSearchGo(); }}
            placeholder="Search area (e.g., Marina, Business Bay)"
            style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", fontSize: 13, outline: "none" }}
          />
          <button onClick={onSearchGo} style={{ border: "none", borderRadius: 12, padding: "10px 12px", background: "#e83f25", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 13 }}>
            Go
          </button>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
              {selected.alias ? selected.alias : selected.name}
            </div>
            {selected.alias && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{selected.name}</div>}
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, padding: "6px 10px", cursor: "pointer", color: "#334155", fontSize: 13, fontWeight: 800 }}>
            Close
          </button>
        </div>

        {/* Badges */}
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selected.data?.yoy_change != null && (
            <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 999, background: "#ecfeff", color: "#0e7490", fontWeight: 800 }}>
              YoY {fmtPct(selected.data.yoy_change)}
            </span>
          )}
          {selected.txCount != null && (
            <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 999, background: "#eff6ff", color: "#0369a1", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Building2 size={12} strokeWidth={2.5} /> {selected.txCount} deals (Jan–Feb 2026)
            </span>
          )}
          {selected.data?.__estimated && (
            <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 999, background: "#fff7ed", color: "#c2410c", fontWeight: 800 }}>
              Estimated
            </span>
          )}
        </div>

        {/* Price grid */}
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {[
            { label: "Sale Apartment", value: selected.data?.sale_apartment, unit: "AED/sqft" },
            { label: "Sale Villa",     value: selected.data?.sale_villa,     unit: "AED/sqft" },
            { label: "Rent Apartment", value: selected.data?.rent_apartment, unit: "AED/year" },
            { label: "Rent Villa",     value: selected.data?.rent_villa,     unit: "AED/year" },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontSize: 13, color: "#475569", fontWeight: 800 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: value != null ? "#0f172a" : "#cbd5e1" }}>
                {value != null ? `${fmt(value)} ${unit}` : "—"}
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>About</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
            {selected.data?.__estimated && (
              <div style={{ marginBottom: 8, fontWeight: 900, color: "#c2410c" }}>No verified price data for this community yet.</div>
            )}
            {buildAutoDescription({ ...(selected.data || {}), name: selected.name, alias: selected.alias }, mode)}
          </div>
        </div>

        {/* Data notes */}
        <div style={{ marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>Data notes</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Price averages are indicative. Transaction counts from DLD Open Data (Jan–Feb 2026). Not financial advice.
          </div>
          {selected.data?.mapping_note && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{selected.data.mapping_note}</div>
          )}
          {selected.data?.source_url && (
            <a href={selected.data.source_url} target="_blank" rel="noreferrer"
              style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 900, color: "#e83f25", textDecoration: "none" }}>
              Open source
            </a>
          )}
          <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
            {selected.data?.source_name   ? `Source: ${selected.data.source_name}`   : ""}
            {selected.data?.report_period ? ` · ${selected.data.report_period}`       : ""}
            {selected.data?.updated_at    ? ` · Updated ${selected.data.updated_at}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}