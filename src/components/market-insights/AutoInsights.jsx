// src/components/market-insights/AutoInsights.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-AE").format(Math.round(n));
const fmtPct = (n) => {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
};
const getLabel = (a) =>
  (a.alias || a.name || a.commNum || "").replace(/_/g, " ");
const shortLabel = (a) => {
  const l = getLabel(a);
  const words = l.split(" ");
  return words.length > 2 ? words.slice(0, 2).join(" ") : l;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        fontFamily: "var(--font-body)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill, fontWeight: 800 }}>
          {p.payload.formattedValue ?? p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AutoInsights() {
  const [areaData, setAreaData] = useState(null);

  useEffect(() => {
    fetch("/data/dubai-area-data.json")
      .then((r) => r.json())
      .then(setAreaData)
      .catch(console.error);
  }, []);

  if (!areaData) return null;

  // Build area array — verified only (no __estimated)
  const areas = Object.entries(areaData)
    .map(([commNum, d]) => (d && typeof d === "object" ? { commNum, ...d } : null))
    .filter(Boolean)
    .filter((d) => !d.__estimated);

  // ── Computations ────────────────────────────────────────────────────────────

  // Top 10 most expensive to buy (sale_apartment)
  const topSale = [...areas]
    .filter((a) => a.sale_apartment)
    .sort((a, b) => b.sale_apartment - a.sale_apartment)
    .slice(0, 10)
    .map((a) => ({
      name: shortLabel(a),
      fullName: getLabel(a),
      value: a.sale_apartment,
      formattedValue: `AED ${fmt(a.sale_apartment)}/sqft`,
    }));

  // Most affordable (sale_apartment asc)
  const affordable = [...areas]
    .filter((a) => a.sale_apartment)
    .sort((a, b) => a.sale_apartment - b.sale_apartment)
    .slice(0, 5);

  // Best rental yield: annual_rent / (sale_price * avg_sqft) * 100
  // Using 1,000 sqft as average apartment size
  const AVG_SQFT = 1000;
  const topYield = [...areas]
    .filter((a) => a.sale_apartment && a.rent_apartment)
    .map((a) => ({
      ...a,
      yieldPct: (a.rent_apartment / (a.sale_apartment * AVG_SQFT)) * 100,
    }))
    .sort((a, b) => b.yieldPct - a.yieldPct)
    .slice(0, 10)
    .map((a) => ({
      name: shortLabel(a),
      fullName: getLabel(a),
      value: parseFloat(a.yieldPct.toFixed(2)),
      formattedValue: `${a.yieldPct.toFixed(2)}% yield`,
    }));

  // Highest YoY growth
  const topGrowth = [...areas]
    .filter((a) => a.yoy_change != null)
    .sort((a, b) => b.yoy_change - a.yoy_change)
    .slice(0, 5);

  // Biggest YoY drops (good for buyers)
  const topDrops = [...areas]
    .filter((a) => a.yoy_change != null && a.yoy_change < 0)
    .sort((a, b) => a.yoy_change - b.yoy_change)
    .slice(0, 5);

  // Dubai-wide averages
  const saleVals = areas.filter((a) => a.sale_apartment).map((a) => a.sale_apartment);
  const rentVals = areas.filter((a) => a.rent_apartment).map((a) => a.rent_apartment);
  const avgSale = saleVals.length ? saleVals.reduce((s, v) => s + v, 0) / saleVals.length : null;
  const avgRent = rentVals.length ? rentVals.reduce((s, v) => s + v, 0) / rentVals.length : null;
  const avgYield = avgSale && avgRent ? (avgRent / (avgSale * AVG_SQFT)) * 100 : null;
  const verifiedCount = areas.length;

  // ── Bar chart colors ─────────────────────────────────────────────────────────
  const saleColors = ["#e83f25", "#ef4444", "#fb923c", "#fbbf24", "#fde047",
    "#fde047", "#bef264", "#86efac", "#4ade80", "#22c55e"];
  const yieldColors = ["#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac",
    "#86efac", "#bef264", "#fde047", "#fb923c", "#ef4444"];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#0f172a",
            fontFamily: "var(--font-display)",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Area Intelligence
        </h2>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Auto-computed from verified market research
        </p>
      </div>

      {/* ── Dubai Averages ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Avg Apartment Sale",
            value: avgSale ? `AED ${fmt(avgSale)}/sqft` : "—",
            emoji: "🏢",
            accent: "#e83f25",
          },
          {
            label: "Avg Annual Rent (Apt)",
            value: avgRent ? `AED ${fmt(avgRent)}` : "—",
            emoji: "🔑",
            accent: "#3b82f6",
          },
          {
            label: "Avg Gross Yield",
            value: avgYield ? `${avgYield.toFixed(2)}%` : "—",
            emoji: "📈",
            accent: "#22c55e",
          },
        ].map(({ label, value, emoji, accent }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: "18px 20px",
              borderTop: `3px solid ${accent}`,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 6,
              }}
            >
              {emoji} {label}
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#0f172a",
                fontFamily: "var(--font-display)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-7">
        {/* Most Expensive Chart */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
            Most Expensive Areas to Buy
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
            Apartment sale price · AED/sqft
          </p>
          <div className="h-[320px] sm:h-[400px] lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSale}
                layout="vertical"
                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topSale.map((_, i) => (
                    <Cell key={i} fill={saleColors[i] ?? "#e5e7eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Yield Chart */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
            Best Rental Yield Areas
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
            Gross yield % · based on 1,000 sqft avg apartment
          </p>
          <div className="h-[320px] sm:h-[400px] lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topYield}
                layout="vertical"
                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topYield.map((_, i) => (
                    <Cell key={i} fill={yieldColors[i] ?? "#e5e7eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Tables Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {/* Most Affordable */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>💰</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Most Affordable</p>
              <p style={{ fontSize: 11, color: "#94a3b8" }}>Lowest sale price · AED/sqft</p>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>#</th>
                <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>AREA</th>
                <th style={{ padding: "7px 16px", textAlign: "right", color: "#64748b", fontWeight: 700, fontSize: 11 }}>AED/SQFT</th>
              </tr>
            </thead>
            <tbody>
              {affordable.map((a, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 16px", color: "#94a3b8", fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: "10px 16px", fontWeight: 600, color: "#0f172a" }}>{getLabel(a)}</td>
                  <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 800, color: "#22c55e" }}>
                    {fmt(a.sale_apartment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highest YoY Growth */}
        {topGrowth.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🚀</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Highest YoY Growth</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>Best performing areas year-on-year</p>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>#</th>
                  <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>AREA</th>
                  <th style={{ padding: "7px 16px", textAlign: "right", color: "#64748b", fontWeight: 700, fontSize: 11 }}>YoY</th>
                </tr>
              </thead>
              <tbody>
                {topGrowth.map((a, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                    <td style={{ padding: "10px 16px", color: "#94a3b8", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: "#0f172a" }}>{getLabel(a)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <span
                        style={{
                          padding: "2px 9px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          background: "#dcfce7",
                          color: "#15803d",
                        }}
                      >
                        {fmtPct(a.yoy_change)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Biggest Price Drops (buyer opportunities) */}
        {topDrops.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🎯</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Buyer Opportunities</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>Areas with biggest price corrections</p>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>#</th>
                  <th style={{ padding: "7px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11 }}>AREA</th>
                  <th style={{ padding: "7px 16px", textAlign: "right", color: "#64748b", fontWeight: 700, fontSize: 11 }}>YoY</th>
                </tr>
              </thead>
              <tbody>
                {topDrops.map((a, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                    <td style={{ padding: "10px 16px", color: "#94a3b8", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: "#0f172a" }}>{getLabel(a)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <span
                        style={{
                          padding: "2px 9px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          background: "#fee2e2",
                          color: "#dc2626",
                        }}
                      >
                        {fmtPct(a.yoy_change)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data note */}
      <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right", marginTop: 12 }}>
        Based on verified research data · Yield estimates assume 1,000 sqft avg apartment · Not financial advice
      </p>
    </div>
  );
}