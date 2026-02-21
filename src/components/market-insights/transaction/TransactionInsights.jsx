// src/components/market-insights/TransactionInsights.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";
import { BarChart3, DollarSign, Building2, Home, Ruler } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const SQM_TO_SQFT = 10.7639;
const fmt  = (n) => new Intl.NumberFormat("en-AE").format(Math.round(n));
const fmtM = (n) => {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`;
  return `AED ${fmt(n)}`;
};

const COLORS = ["#e83f25","#3b82f6","#22c55e","#8b5cf6","#f59e0b",
                "#06b6d4","#ec4899","#84cc16","#f97316","#6366f1"];

const PAGE_SIZE = 20;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "var(--font-body)", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      <p style={{ color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill || p.color, fontWeight: 800 }}>
          {p.payload?.formattedValue ?? p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "18px 20px", borderTop: `3px solid ${accent}` }}>
    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6 }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />} {label}
    </p>
    <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>{value}</p>
    {sub && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{sub}</p>}
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ label, color, bg }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: bg, color, whiteSpace: "nowrap" }}>
    {label}
  </span>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function TransactionInsights() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeTab, setActiveTab] = useState("areas");

  // Browse tab state
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("all");   // all | Off-Plan | Ready
  const [filterUsage, setFilterUsage] = useState("all"); // all | Residential | Commercial
  const [sortKey, setSortKey]       = useState("date");  // date | value | priceSqft
  const [sortDir, setSortDir]       = useState("desc");
  const [page, setPage]             = useState(1);

  useEffect(() => {
    Papa.parse("/data/transaction-26.csv", {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => { setRows(results.data); setLoading(false); },
      error:    (err)     => { setError(err.message); setLoading(false); },
    });
  }, []);

  // ── Computed analytics ────────────────────────────────────────────────────
  const computed = useMemo(() => {
    if (!rows.length) return null;
    const sales = rows.filter((r) => r.GROUP_EN?.trim() === "Sales");
    const totalTx    = sales.length;
    const totalValue = sales.reduce((s, r) => s + (parseFloat(r.TRANS_VALUE) || 0), 0);
    const offPlanCount = sales.filter((r) => r.IS_OFFPLAN_EN?.trim() === "Off-Plan").length;
    const readyCount   = sales.filter((r) => r.IS_OFFPLAN_EN?.trim() === "Ready").length;
    const withArea = sales.filter((r) => parseFloat(r.PROCEDURE_AREA) > 0 && parseFloat(r.TRANS_VALUE) > 0);
    const avgPriceSqft = withArea.length
      ? withArea.reduce((s, r) => s + parseFloat(r.TRANS_VALUE) / (parseFloat(r.PROCEDURE_AREA) * SQM_TO_SQFT), 0) / withArea.length
      : null;

    const areaMap = {};
    sales.forEach((r) => {
      const area = r.AREA_EN?.trim();
      if (!area) return;
      if (!areaMap[area]) areaMap[area] = { count: 0, value: 0, priceSum: 0, priceCount: 0 };
      areaMap[area].count += 1;
      areaMap[area].value += parseFloat(r.TRANS_VALUE) || 0;
      const sqm = parseFloat(r.PROCEDURE_AREA), val = parseFloat(r.TRANS_VALUE);
      if (sqm > 0 && val > 0) { areaMap[area].priceSum += val / (sqm * SQM_TO_SQFT); areaMap[area].priceCount += 1; }
    });

    const topAreasByCount = Object.entries(areaMap).sort((a, b) => b[1].count - a[1].count).slice(0, 10)
      .map(([name, d]) => ({ name: name.length > 22 ? name.slice(0, 20) + "…" : name, fullName: name, value: d.count, formattedValue: `${d.count.toLocaleString()} transactions` }));

    const topAreasByValue = Object.entries(areaMap).sort((a, b) => b[1].value - a[1].value).slice(0, 10)
      .map(([name, d]) => ({ name: name.length > 22 ? name.slice(0, 20) + "…" : name, fullName: name, value: Math.round(d.value / 1_000_000), formattedValue: fmtM(d.value) }));

    const topAreasByPrice = Object.entries(areaMap).filter(([, d]) => d.priceCount >= 3)
      .sort((a, b) => b[1].priceSum / b[1].priceCount - a[1].priceSum / a[1].priceCount).slice(0, 10)
      .map(([name, d]) => ({ name: name.length > 22 ? name.slice(0, 20) + "…" : name, fullName: name, value: Math.round(d.priceSum / d.priceCount), formattedValue: `AED ${fmt(Math.round(d.priceSum / d.priceCount))}/sqft` }));

    const projectMap = {};
    sales.forEach((r) => {
      const proj = r.PROJECT_EN?.trim() || r.MASTER_PROJECT_EN?.trim();
      if (!proj || proj === "0" || proj === "") return;
      if (!projectMap[proj]) projectMap[proj] = { count: 0, value: 0 };
      projectMap[proj].count += 1;
      projectMap[proj].value += parseFloat(r.TRANS_VALUE) || 0;
    });
    const topProjects = Object.entries(projectMap).sort((a, b) => b[1].count - a[1].count).slice(0, 10)
      .map(([name, d]) => ({ name: name.length > 26 ? name.slice(0, 24) + "…" : name, fullName: name, value: d.count, formattedValue: `${d.count} deals · ${fmtM(d.value)}` }));

    const offPlanVsReady = [{ name: "Off-Plan", value: offPlanCount }, { name: "Ready", value: readyCount }];
    const usageSplit = Object.entries(sales.reduce((acc, r) => { const u = r.USAGE_EN?.trim() || "Other"; acc[u] = (acc[u] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
    const propTypeSplit = Object.entries(sales.reduce((acc, r) => { const t = r.PROP_SB_TYPE_EN?.trim() || r.PROP_TYPE_EN?.trim() || "Other"; acc[t] = (acc[t] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
    const roomsSplit = Object.entries(sales.reduce((acc, r) => { const raw = r.ROOMS_EN?.trim(); const room = (!raw || raw.toLowerCase() === "unknown" || raw === "NA") ? "Other" : raw; acc[room] = (acc[room] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));

    return { totalTx, totalValue, offPlanCount, readyCount, avgPriceSqft, topAreasByCount, topAreasByValue, topAreasByPrice, topProjects, offPlanVsReady, usageSplit, propTypeSplit, roomsSplit };
  }, [rows]);

  // ── Browse table data ─────────────────────────────────────────────────────
  const browseData = useMemo(() => {
    if (!rows.length) return [];
    let data = rows.filter((r) => r.GROUP_EN?.trim() === "Sales");

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((r) =>
        r.AREA_EN?.toLowerCase().includes(q) ||
        r.PROJECT_EN?.toLowerCase().includes(q) ||
        r.MASTER_PROJECT_EN?.toLowerCase().includes(q) ||
        r.TRANSACTION_NUMBER?.toLowerCase().includes(q)
      );
    }

    // filters
    if (filterType !== "all")  data = data.filter((r) => r.IS_OFFPLAN_EN?.trim() === filterType);
    if (filterUsage !== "all") data = data.filter((r) => r.USAGE_EN?.trim() === filterUsage);

    // sort
    data = [...data].sort((a, b) => {
      let va, vb;
      if (sortKey === "date")      { va = a.INSTANCE_DATE || ""; vb = b.INSTANCE_DATE || ""; }
      else if (sortKey === "value"){ va = parseFloat(a.TRANS_VALUE) || 0; vb = parseFloat(b.TRANS_VALUE) || 0; }
      else { // priceSqft
        const sqmA = parseFloat(a.PROCEDURE_AREA); const sqmB = parseFloat(b.PROCEDURE_AREA);
        va = sqmA > 0 ? (parseFloat(a.TRANS_VALUE) || 0) / (sqmA * SQM_TO_SQFT) : 0;
        vb = sqmB > 0 ? (parseFloat(b.TRANS_VALUE) || 0) / (sqmB * SQM_TO_SQFT) : 0;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, search, filterType, filterUsage, sortKey, sortDir]);

  const totalPages   = Math.ceil(browseData.length / PAGE_SIZE);
  const pagedRows    = browseData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const SortArrow = ({ k }) => {
    if (sortKey !== k) return <span style={{ color: "#cbd5e1" }}> ↕</span>;
    return <span style={{ color: "#e83f25" }}> {sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontFamily: "var(--font-body)" }}>
      Loading transaction data…
    </div>
  );

  if (error || !computed) return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "32px 24px", textAlign: "center", fontFamily: "var(--font-body)" }}>
      <p style={{ fontWeight: 700, color: "#991b1b" }}>Failed to load transaction data</p>
      <p style={{ fontSize: 12, color: "#7f1d1d", marginTop: 6 }}>Make sure <code>/public/data/transaction-26.csv</code> exists.</p>
    </div>
  );

  const TABS = [
    { key: "areas",    label: "Top Areas",    Icon: BarChart3 },
    { key: "value",    label: "By Value",     Icon: DollarSign },
    { key: "price",    label: "Avg Price/sqft", Icon: Ruler },
    { key: "projects", label: "Top Projects", Icon: Building2 },
  ];

  const tabData = {
    areas:    { data: computed.topAreasByCount,  color: "#e83f25", label: "Transactions" },
    value:    { data: computed.topAreasByValue,  color: "#3b82f6", label: "AED Millions" },
    price:    { data: computed.topAreasByPrice,  color: "#8b5cf6", label: "AED/sqft" },
    projects: { data: computed.topProjects,      color: "#22c55e", label: "Deals" },
  };

  const active = tabData[activeTab];

  const thStyle = (k) => ({
    padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700,
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em",
    background: "#f8fafc", borderBottom: "1px solid #e5e7eb",
    cursor: k ? "pointer" : "default", whiteSpace: "nowrap", userSelect: "none",
  });

  const tdStyle = { padding: "10px 12px", fontSize: 12, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "top" };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", margin: 0, marginBottom: 4 }}>
          Transaction Intelligence
        </h2>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Computed from official Dubai Land Department data · Jan–Feb 2026
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={BarChart3} label="Total Transactions" value={fmt(computed.totalTx)} accent="#e83f25" />
        <StatCard icon={DollarSign} label="Total Value" value={fmtM(computed.totalValue)} accent="#3b82f6" />
        <StatCard icon={Building2} label="Off-Plan Deals" value={fmt(computed.offPlanCount)} sub={`${Math.round(computed.offPlanCount / computed.totalTx * 100)}% of total`} accent="#8b5cf6" />
        <StatCard icon={Home} label="Ready Deals" value={fmt(computed.readyCount)} sub={`${Math.round(computed.readyCount / computed.totalTx * 100)}% of total`} accent="#22c55e" />
        {computed.avgPriceSqft && (
          <StatCard icon={Ruler} label="Avg Price/sqft" value={`AED ${fmt(computed.avgPriceSqft)}`} sub="Sales transactions" accent="#f59e0b" />
        )}
      </div>

      {/* Tabbed section */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Rankings & Transactions</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TABS.map((t) => {
              const TabIcon = t.Icon;
              return (
                <button key={t.key} onClick={() => { setActiveTab(t.key); setPage(1); }}
                  style={{ padding: "6px 14px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", background: activeTab === t.key ? "#e83f25" : "#f1f5f9", color: activeTab === t.key ? "#fff" : "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                  {TabIcon && <TabIcon size={14} strokeWidth={2.5} />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart tabs */}
        {activeTab !== "browse" && active && (
          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>{active.label}</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={active.data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} width={130} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {active.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Browse tab */}
        {activeTab === "browse" && (
          <div style={{ padding: 20 }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search area, project, transaction number…"
                style={{ flex: 1, minWidth: 220, border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }}
              />
              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
                <option value="all">All Types</option>
                <option value="Off-Plan">Off-Plan</option>
                <option value="Ready">Ready</option>
              </select>
              <select value={filterUsage} onChange={(e) => { setFilterUsage(e.target.value); setPage(1); }}
                style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
                <option value="all">All Usage</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <span style={{ fontSize: 12, color: "#94a3b8", alignSelf: "center", whiteSpace: "nowrap" }}>
                {browseData.length.toLocaleString()} results
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #e5e7eb" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
                <thead>
                  <tr>
                    <th style={thStyle(null)}>Transaction #</th>
                    <th style={thStyle("date")} onClick={() => handleSort("date")}>Date <SortArrow k="date" /></th>
                    <th style={thStyle(null)}>Area</th>
                    <th style={thStyle(null)}>Project</th>
                    <th style={thStyle(null)}>Type</th>
                    <th style={thStyle(null)}>Property</th>
                    <th style={thStyle(null)}>Rooms</th>
                    <th style={thStyle("value")} onClick={() => handleSort("value")}>Value (AED) <SortArrow k="value" /></th>
                    <th style={thStyle("priceSqft")} onClick={() => handleSort("priceSqft")}>Price/sqft <SortArrow k="priceSqft" /></th>
                    <th style={thStyle(null)}>Size (sqft)</th>
                    <th style={thStyle(null)}>Nearest Metro</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((r, i) => {
                    const sqm       = parseFloat(r.PROCEDURE_AREA);
                    const val       = parseFloat(r.TRANS_VALUE);
                    const sqft      = sqm > 0 ? Math.round(sqm * SQM_TO_SQFT) : null;
                    const priceSqft = sqm > 0 && val > 0 ? Math.round(val / (sqm * SQM_TO_SQFT)) : null;
                    const isOffPlan = r.IS_OFFPLAN_EN?.trim() === "Off-Plan";
                    const date      = r.INSTANCE_DATE ? r.INSTANCE_DATE.slice(0, 10) : "—";
                    const project   = r.PROJECT_EN?.trim() || r.MASTER_PROJECT_EN?.trim() || "—";

                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ ...tdStyle, fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>
                          {r.TRANSACTION_NUMBER?.slice(0, 14)}…
                        </td>
                        <td style={tdStyle}>{date}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: "#0f172a", maxWidth: 140 }}>
                          {r.AREA_EN?.trim() || "—"}
                        </td>
                        <td style={{ ...tdStyle, maxWidth: 160, color: "#475569" }}>
                          {project.length > 28 ? project.slice(0, 26) + "…" : project}
                        </td>
                        <td style={tdStyle}>
                          <Badge
                            label={isOffPlan ? "Off-Plan" : "Ready"}
                            color={isOffPlan ? "#0369a1" : "#15803d"}
                            bg={isOffPlan ? "#eff6ff" : "#f0fdf4"}
                          />
                        </td>
                        <td style={tdStyle}>{r.PROP_SB_TYPE_EN?.trim() || r.PROP_TYPE_EN?.trim() || "—"}</td>
                        <td style={tdStyle}>{r.ROOMS_EN?.trim() || "—"}</td>
                        <td style={{ ...tdStyle, fontWeight: 800, color: "#0f172a" }}>
                          {val > 0 ? `AED ${fmt(val)}` : "—"}
                        </td>
                        <td style={{ ...tdStyle, color: "#7c3aed", fontWeight: 700 }}>
                          {priceSqft ? `${fmt(priceSqft)}` : "—"}
                        </td>
                        <td style={tdStyle}>{sqft ? sqft.toLocaleString() : "—"}</td>
                        <td style={{ ...tdStyle, fontSize: 11, color: "#94a3b8" }}>
                          {r.NEAREST_METRO_EN?.trim() || "—"}
                        </td>
                      </tr>
                    );
                  })}
                  {pagedRows.length === 0 && (
                    <tr>
                      <td colSpan={11} style={{ ...tdStyle, textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Page {page} of {totalPages} · {browseData.length.toLocaleString()} transactions
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setPage(1)} disabled={page === 1}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#cbd5e1" : "#374151", background: "#fff" }}>
                    «
                  </button>
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#cbd5e1" : "#374151", background: "#fff" }}>
                    ‹ Prev
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#cbd5e1" : "#374151", background: "#fff" }}>
                    Next ›
                  </button>
                  <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#cbd5e1" : "#374151", background: "#fff" }}>
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donut charts */}
      {activeTab !== "browse" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { title: "Off-Plan vs Ready", sub: "By number of sales", data: computed.offPlanVsReady },
            { title: "Usage Breakdown",   sub: "Residential vs Commercial", data: computed.usageSplit },
            { title: "Property Type",     sub: "Flat, Villa, Townhouse etc.", data: computed.propTypeSplit },
            { title: "Unit Size",         sub: "Studio, 1BR, 2BR, 3BR etc.", data: computed.roomsSplit },
          ].map(({ title, sub, data }) => (
            <div key={title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{title}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{sub}</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: "#475569" }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right", marginTop: 4 }}>
        Source: Dubai Land Department Open Data · Official transaction records
      </p>
    </div>
  );
}