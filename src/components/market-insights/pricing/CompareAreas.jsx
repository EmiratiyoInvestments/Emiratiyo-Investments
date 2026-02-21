// src/components/market-insights/pricing/CompareAreas.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GitCompare, Building2, BarChart3 } from "lucide-react";
import { deriveAreaDataFromRows } from "../../../lib/transactionDataUtils";

const fmt = (n) => (n != null ? new Intl.NumberFormat("en-AE").format(Math.round(n)) : "—");
const MAX_AREAS = 3;

const getLabel = (a) => (a.alias || a.name || "").replace(/_/g, " ").trim() || a.name || "—";

export default function CompareAreas() {
  const [areaData, setAreaData] = useState(null);
  const [selected, setSelected] = useState(["", "", ""]);

  useEffect(() => {
    Papa.parse("/data/transaction-26.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { areaDataByCommNum } = deriveAreaDataFromRows(results.data || [], {});
        setAreaData(areaDataByCommNum);
      },
      error: console.error,
    });
  }, []);

  if (!areaData) return null;

  const areasList = Object.entries(areaData)
    .map(([key, d]) => (d && typeof d === "object" ? { key, ...d } : null))
    .filter(Boolean)
    .filter((a) => a.sale_apartment != null || (a._txCount || 0) > 0)
    .sort((a, b) => (getLabel(a) || "").localeCompare(getLabel(b) || ""));

  const selectedAreas = selected
    .filter(Boolean)
    .map((key) => areasList.find((a) => a.key === key))
    .filter(Boolean);

  const chartData = selectedAreas.map((a) => ({
    name: getLabel(a).length > 18 ? getLabel(a).slice(0, 16) + "…" : getLabel(a),
    fullName: getLabel(a),
    sale_apartment: a.sale_apartment ?? 0,
    sale_villa: a.sale_villa ?? 0,
    transactions: a._txCount ?? 0,
  }));

  const handleSelect = (slot, value) => {
    setSelected((prev) => {
      const next = [...prev];
      next[slot] = value;
      return next;
    });
  };

  const COLORS = ["#e83f25", "#3b82f6", "#22c55e"];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
        marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <GitCompare size={22} strokeWidth={2.5} style={{ color: "#e83f25" }} />
        <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", margin: 0 }}>
          Compare Areas
        </h3>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, fontFamily: "var(--font-body)" }}>
        Select up to 3 areas to compare sale prices (AED/sqft) and transaction volume.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {[0, 1, 2].map((slot) => (
          <div key={slot} style={{ minWidth: 200, flex: "1 1 180px" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
              Area {slot + 1}
            </label>
            <select
              value={selected[slot]}
              onChange={(e) => handleSelect(slot, e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="">Select area…</option>
              {areasList.map((a) => (
                <option key={a.key} value={a.key}>
                  {getLabel(a)} {a._txCount ? `(${a._txCount} tx)` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {selectedAreas.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {selectedAreas.map((a, i) => (
              <div
                key={a.key}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 16,
                  borderLeft: `4px solid ${COLORS[i] ?? "#94a3b8"}`,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12, fontFamily: "var(--font-body)" }}>
                  {getLabel(a)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Building2 size={14} strokeWidth={2.5} style={{ color: "#64748b" }} />
                    <span style={{ fontSize: 12, color: "#64748b" }}>Sale Apt</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginLeft: "auto" }}>
                      {fmt(a.sale_apartment)} AED/sqft
                    </span>
                  </div>
                  {a.sale_villa != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#64748b", width: 22 }}>Villa</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginLeft: "auto" }}>
                        {fmt(a.sale_villa)} AED/sqft
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BarChart3 size={14} strokeWidth={2.5} style={{ color: "#64748b" }} />
                    <span style={{ fontSize: 12, color: "#64748b" }}>Transactions</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0369a1", marginLeft: "auto" }}>
                      {fmt(a._txCount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>Sale price (AED/sqft) comparison</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip
                    formatter={(v) => `${fmt(v)} AED/sqft`}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                    contentStyle={{ fontFamily: "var(--font-body)", borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="sale_apartment" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i] ?? "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
