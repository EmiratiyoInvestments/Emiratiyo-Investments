// src/components/market-insights/WeeklySnapshot.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../services/sanityClient";
import { TrendingUp, TrendingDown, Minus, Calendar, Building2, Home, Landmark } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ── GROQ Query ────────────────────────────────────────────────────────────────
const QUERY = `*[_type == "marketReport"] | order(weekEnding desc) [0...24] {
  weekEnding,
  "totalValue": statsGroup.totalValue,
  "valueChangePct": statsGroup.valueChangePct,
  "totalVolume": statsGroup.totalVolume,
  "volumeChangePct": statsGroup.volumeChangePct,
  "pricePerSqft": statsGroup.pricePerSqft,
  "priceChangePct": statsGroup.priceChangePct,
  offPlanApartments,
  offPlanVillas,
  readyApartments,
  readyVillas,
  plots
}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtValue = (n) => {
  if (n == null) return "—";
  if (n >= 1000) return `AED ${(n / 1000).toFixed(1)}B`;
  return `AED ${n.toFixed(0)}M`;
};

const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const shortDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

// ── Sub-components ────────────────────────────────────────────────────────────
const ChangeBadge = ({ pct }) => {
  if (pct == null) return null;
  const isUp = pct > 0;
  const isZero = pct === 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--font-body)",
        background: isZero ? "#f1f5f9" : isUp ? "#dcfce7" : "#fee2e2",
        color: isZero ? "#64748b" : isUp ? "#15803d" : "#dc2626",
      }}
    >
      {isUp ? (
        <TrendingUp size={11} />
      ) : isZero ? (
        <Minus size={11} />
      ) : (
        <TrendingDown size={11} />
      )}
      {pct > 0 ? "+" : ""}
      {Number(pct).toFixed(2)}%
    </span>
  );
};

const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "" }) => {
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
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 800 }}>
          {valuePrefix}{p.value?.toLocaleString()}{valueSuffix}
        </p>
      ))}
    </div>
  );
};

const ProjectTable = ({ rows }) => {
  if (!rows?.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "28px 0",
          color: "#94a3b8",
          fontSize: 13,
          fontFamily: "var(--font-body)",
        }}
      >
        No data entered for this week yet.
      </div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "#f8fafc" }}>
          {["#", "Project", "Volume", "Value (AED)"].map((h, i) => (
            <th
              key={h}
              style={{
                padding: "8px 14px",
                textAlign: i >= 2 ? "right" : "left",
                color: "#64748b",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-body)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{
              borderTop: "1px solid #f1f5f9",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <td
              style={{
                padding: "11px 14px",
                fontWeight: 800,
                color: i === 0 ? "#e83f25" : "#94a3b8",
                fontFamily: "var(--font-display)",
                fontSize: 14,
              }}
            >
              {i + 1}
            </td>
            <td
              style={{
                padding: "11px 14px",
                fontWeight: 600,
                color: "#0f172a",
                fontFamily: "var(--font-body)",
              }}
            >
              {row.projectName}
            </td>
            <td
              style={{
                padding: "11px 14px",
                textAlign: "right",
                color: "#475569",
                fontFamily: "var(--font-body)",
              }}
            >
              {row.volume?.toLocaleString() ?? "—"}
            </td>
            <td
              style={{
                padding: "11px 14px",
                textAlign: "right",
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "var(--font-body)",
              }}
            >
              {row.valueMillion != null ? fmtValue(row.valueMillion) : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TABS = [
  { key: "offPlanApartments", label: "Off-Plan Apts", icon: Building2 },
  { key: "offPlanVillas", label: "Off-Plan Villas", icon: Home },
  { key: "readyApartments", label: "Ready Apts", icon: Building2 },
  { key: "readyVillas", label: "Ready Villas", icon: Home },
  { key: "plots", label: "Plots", icon: Landmark },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function WeeklySnapshot() {
  const [activeTab, setActiveTab] = useState("offPlanApartments");

  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ["market-reports"],
    queryFn: () => client.fetch(QUERY),
  });

  if (isLoading) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontFamily: "var(--font-body)" }}>
        Loading weekly snapshot…
      </div>
    );
  }

  if (isError || !reports?.length) {
    return (
      <div
        style={{
          background: "#f8fafc",
          border: "1px dashed #cbd5e1",
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          color: "#94a3b8",
          fontFamily: "var(--font-body)",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>No weekly reports yet</p>
        <p style={{ fontSize: 13 }}>Add a Market Report in Sanity Studio to see data here.</p>
      </div>
    );
  }

  const latest = reports[0];

  // Chart data — oldest first
  const chartData = [...reports]
    .reverse()
    .map((r) => ({
      week: shortDate(r.weekEnding),
      value: r.totalValue,
      volume: r.totalVolume,
      price: r.pricePerSqft,
    }));

  const statCards = [
    {
      label: "Transaction Value",
      value: fmtValue(latest.totalValue),
      pct: latest.valueChangePct,
      accent: "#e83f25",
    },
    {
      label: "Transaction Volume",
      value: latest.totalVolume != null ? latest.totalVolume.toLocaleString() : "—",
      pct: latest.volumeChangePct,
      accent: "#3b82f6",
    },
    {
      label: "Price / sqft",
      value: latest.pricePerSqft != null ? `AED ${latest.pricePerSqft.toLocaleString()}` : "—",
      pct: latest.priceChangePct,
      accent: "#8b5cf6",
    },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Calendar size={14} style={{ color: "#e83f25" }} />
          <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            For the week ending {fmtDate(latest.weekEnding)}
          </p>
        </div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#0f172a",
            fontFamily: "var(--font-display)",
            margin: 0,
          }}
        >
          Weekly Market Snapshot
        </h2>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {statCards.map(({ label, value, pct, accent }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: "20px 22px",
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
                marginBottom: 8,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#0f172a",
                fontFamily: "var(--font-display)",
                marginBottom: 10,
                lineHeight: 1.1,
              }}
            >
              {value}
            </p>
            <ChangeBadge pct={pct} />
          </div>
        ))}
      </div>

      {/* ── Trend Charts ── */}
      {chartData.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {/* Value Trend */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
              Transaction Value Trend
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>AED Millions</p>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CustomTooltip valuePrefix="AED " valueSuffix="M" />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#e83f25"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#e83f25" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Trend */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
              Transaction Volume Trend
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>No. of Transactions</p>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#3b82f6" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Best Selling Projects ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Best Selling Projects</p>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #f1f5f9",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-body)",
                  background: activeTab === tab.key ? "#fff" : "#f8fafc",
                  color: activeTab === tab.key ? "#e83f25" : "#64748b",
                  borderBottom: activeTab === tab.key ? "2px solid #e83f25" : "2px solid transparent",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "4px 0 8px" }}>
          <ProjectTable rows={latest[activeTab]} />
        </div>
      </div>

      {/* Data note */}
      <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right", marginTop: 10 }}>
        Source: Dubai Land Department · Updated weekly
      </p>
    </div>
  );
}