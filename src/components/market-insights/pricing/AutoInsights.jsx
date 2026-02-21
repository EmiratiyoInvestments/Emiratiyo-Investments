// src/components/market-insights/pricing/AutoInsights.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
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
import { Building2, BarChart3, MapPin, DollarSign } from "lucide-react";
import { deriveAreaDataFromRows } from "../../../lib/transactionDataUtils";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-AE").format(Math.round(n));
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
          {p.payload?.formattedValue ?? p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AutoInsights() {
  const [areaData, setAreaData] = useState(null);

  useEffect(() => {
    Papa.parse("/data/transaction-26.csv", {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const { areaDataByCommNum } = deriveAreaDataFromRows(results.data || [], {});
        setAreaData(areaDataByCommNum);
      },
      error: console.error,
    });
  }, []);

  if (!areaData) return null;

  const areas = Object.entries(areaData)
    .map(([commNum, d]) => (d && typeof d === "object" ? { commNum, ...d } : null))
    .filter(Boolean);

  // ── Computations (from DLD CSV) ─────────────────────────────────────────────

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

  const affordable = [...areas]
    .filter((a) => a.sale_apartment)
    .sort((a, b) => a.sale_apartment - b.sale_apartment)
    .slice(0, 5);

  // Most active areas by transaction count (replaces rental yield)
  const topByTxCount = [...areas]
    .filter((a) => (a._txCount || 0) > 0)
    .sort((a, b) => (b._txCount || 0) - (a._txCount || 0))
    .slice(0, 10)
    .map((a) => ({
      name: shortLabel(a),
      fullName: getLabel(a),
      value: a._txCount || 0,
      formattedValue: `${(a._txCount || 0).toLocaleString()} transactions`,
    }));

  const saleVals = areas.filter((a) => a.sale_apartment).map((a) => a.sale_apartment);
  const avgSale = saleVals.length ? saleVals.reduce((s, v) => s + v, 0) / saleVals.length : null;
  const totalTx = areas.reduce((s, a) => s + (a._txCount || 0), 0);

  const saleColors = ["#e83f25", "#ef4444", "#fb923c", "#fbbf24", "#fde047",
                      "#fde047", "#bef264", "#86efac", "#4ade80", "#22c55e"];

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
          Derived from DLD transaction data · Sale prices & activity
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
            Icon: Building2,
            accent: "#e83f25",
          },
          {
            label: "Total Transactions",
            value: totalTx ? fmt(totalTx) : "—",
            Icon: BarChart3,
            accent: "#3b82f6",
          },
          {
            label: "Areas with Data",
            value: String(areas.length),
            Icon: MapPin,
            accent: "#22c55e",
          },
        ].map(({ label, value, Icon, accent }) => (
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
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon size={14} strokeWidth={2.5} /> {label}
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

        {/* Most Active Areas (replaces rental yield) */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
            Most Active Areas by Transactions
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
            Number of sales transactions · DLD data
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topByTxCount}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "#475569" }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {topByTxCount.map((_, i) => (
                  <Cell key={i} fill={["#e83f25", "#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1"][i] ?? "#e5e7eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
            <DollarSign size={18} strokeWidth={2.5} style={{ color: "#22c55e" }} />
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
      </div>

      {/* Data note */}
      <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right", marginTop: 12 }}>
        Source: Dubai Land Department Open Data · Sale prices from transactions · Not financial advice
      </p>
    </div>
  );
}