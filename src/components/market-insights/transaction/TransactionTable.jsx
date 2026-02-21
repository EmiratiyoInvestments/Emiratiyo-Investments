// src/components/market-insights/transaction/TransactionTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { Download, Settings2 } from "lucide-react";

const SQM_TO_SQFT = 10.7639;
const PAGE_SIZE   = 15;

const fmt  = (n) => new Intl.NumberFormat("en-AE").format(Math.round(n));
const fmtM = (n) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(2)}M`;
  return fmt(n);
};

const Badge = ({ label, color, bg }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: bg, color, whiteSpace: "nowrap" }}>
    {label}
  </span>
);

const SortArrow = ({ sortKey, k, sortDir }) => {
  if (sortKey !== k) return <span style={{ color: "#cbd5e1", marginLeft: 4 }}>↕</span>;
  return <span style={{ color: "#e83f25", marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
};

// All columns definition — toggle visibility per column
const ALL_COLUMNS = [
  { key: "txNum",        label: "Tx #",           sortable: false },
  { key: "date",         label: "Date",            sortable: true  },
  { key: "area",         label: "Area",            sortable: false },
  { key: "masterProject",label: "Master Project",  sortable: false },
  { key: "project",      label: "Project",         sortable: false },
  { key: "type",         label: "Type",            sortable: false },
  { key: "procedure",    label: "Procedure",       sortable: false },
  { key: "freehold",     label: "Freehold",        sortable: false },
  { key: "usage",        label: "Usage",           sortable: false },
  { key: "propType",     label: "Property",        sortable: false },
  { key: "rooms",        label: "Rooms",           sortable: false },
  { key: "parking",      label: "Parking",         sortable: false },
  { key: "value",        label: "Value (AED)",     sortable: true  },
  { key: "priceSqft",    label: "AED/sqft",        sortable: true  },
  { key: "sizeSqft",     label: "Size (sqft)",     sortable: true  },
  { key: "actualSqft",   label: "Actual (sqft)",   sortable: false },
  { key: "buyers",       label: "Buyers",          sortable: false },
  { key: "sellers",      label: "Sellers",         sortable: false },
  { key: "metro",        label: "Nearest Metro",   sortable: false },
  { key: "mall",         label: "Nearest Mall",    sortable: false },
  { key: "landmark",     label: "Nearest Landmark",sortable: false },
];

// Default visible columns
const DEFAULT_VISIBLE = new Set([
  "txNum","date","area","project","type","freehold","usage",
  "propType","rooms","parking","value","priceSqft","sizeSqft",
  "buyers","metro",
]);

export default function TransactionTable() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showColPicker, setShowColPicker] = useState(false);
  const [visibleCols, setVisibleCols]     = useState(DEFAULT_VISIBLE);

  // Filters
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState("all");
  const [filterUsage, setFilterUsage] = useState("all");
  const [filterFreehold, setFilterFreehold] = useState("all");
  const [filterArea, setFilterArea]   = useState("all");
  const [sortKey, setSortKey]         = useState("date");
  const [sortDir, setSortDir]         = useState("desc");
  const [page, setPage]               = useState(1);

  useEffect(() => {
    Papa.parse("/data/transaction-26.csv", {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => { setRows(results.data); setLoading(false); },
      error:    (err)     => { setError(err.message); setLoading(false); },
    });
  }, []);

  const salesRows = useMemo(() => rows.filter((r) => r.GROUP_EN?.trim() === "Sales"), [rows]);

  const areaOptions = useMemo(() => (
    [...new Set(salesRows.map((r) => r.AREA_EN?.trim()).filter(Boolean))].sort()
  ), [salesRows]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let data = [...salesRows];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((r) =>
        r.AREA_EN?.toLowerCase().includes(q) ||
        r.PROJECT_EN?.toLowerCase().includes(q) ||
        r.MASTER_PROJECT_EN?.toLowerCase().includes(q) ||
        r.TRANSACTION_NUMBER?.toLowerCase().includes(q) ||
        r.NEAREST_METRO_EN?.toLowerCase().includes(q) ||
        r.NEAREST_LANDMARK_EN?.toLowerCase().includes(q)
      );
    }
    if (filterType     !== "all") data = data.filter((r) => r.IS_OFFPLAN_EN?.trim() === filterType);
    if (filterUsage    !== "all") data = data.filter((r) => r.USAGE_EN?.trim() === filterUsage);
    if (filterFreehold !== "all") data = data.filter((r) => r.IS_FREE_HOLD_EN?.trim() === filterFreehold);
    if (filterArea     !== "all") data = data.filter((r) => r.AREA_EN?.trim() === filterArea);

    data.sort((a, b) => {
      let va, vb;
      if      (sortKey === "date")      { va = a.INSTANCE_DATE || ""; vb = b.INSTANCE_DATE || ""; }
      else if (sortKey === "value")     { va = parseFloat(a.TRANS_VALUE) || 0; vb = parseFloat(b.TRANS_VALUE) || 0; }
      else if (sortKey === "priceSqft") {
        const sA = parseFloat(a.PROCEDURE_AREA), sB = parseFloat(b.PROCEDURE_AREA);
        va = sA > 0 ? (parseFloat(a.TRANS_VALUE) || 0) / (sA * SQM_TO_SQFT) : 0;
        vb = sB > 0 ? (parseFloat(b.TRANS_VALUE) || 0) / (sB * SQM_TO_SQFT) : 0;
      }
      else if (sortKey === "sizeSqft")  { va = parseFloat(a.PROCEDURE_AREA) || 0; vb = parseFloat(b.PROCEDURE_AREA) || 0; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

    return data;
  }, [salesRows, search, filterType, filterUsage, filterFreehold, filterArea, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const toggleCol = (key) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const resetFilters = () => {
    setSearch(""); setFilterType("all"); setFilterUsage("all");
    setFilterFreehold("all"); setFilterArea("all");
    setSortKey("date"); setSortDir("desc"); setPage(1);
  };

  const hasActiveFilters = search || filterType !== "all" || filterUsage !== "all" || filterFreehold !== "all" || filterArea !== "all";

  const exportToCsv = () => {
    if (!filtered.length) return;
    const csv = Papa.unparse(filtered, { header: true });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dubai-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontFamily: "var(--font-body)" }}>Loading transactions…</div>
  );
  if (error) return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: 24, fontFamily: "var(--font-body)" }}>
      <p style={{ fontWeight: 700, color: "#991b1b" }}>Failed to load: {error}</p>
    </div>
  );

  const visibleColDefs = ALL_COLUMNS.filter((c) => visibleCols.has(c.key));

  const thStyle = (col) => ({
    padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700,
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em",
    background: "#f8fafc", borderBottom: "2px solid #e5e7eb",
    cursor: col.sortable ? "pointer" : "default", whiteSpace: "nowrap", userSelect: "none",
  });

  const tdBase = { padding: "11px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };

  // Cell renderer per column key
  const renderCell = (col, r, i) => {
    const sqm       = parseFloat(r.PROCEDURE_AREA);
    const actualSqm = parseFloat(r.ACTUAL_AREA);
    const val       = parseFloat(r.TRANS_VALUE);
    const sqft      = sqm > 0 ? Math.round(sqm * SQM_TO_SQFT) : null;
    const actualSqft= actualSqm > 0 ? Math.round(actualSqm * SQM_TO_SQFT) : null;
    const priceSqft = sqm > 0 && val > 0 ? Math.round(val / (sqm * SQM_TO_SQFT)) : null;
    const isOffPlan = r.IS_OFFPLAN_EN?.trim() === "Off-Plan";
    const isFreehold = r.IS_FREE_HOLD_EN?.trim() === "Free Hold";
    const date      = r.INSTANCE_DATE ? r.INSTANCE_DATE.slice(0, 10) : "—";
    const project   = r.PROJECT_EN?.trim() || "—";
    const master    = r.MASTER_PROJECT_EN?.trim() || "—";

    switch (col.key) {
      case "txNum":
        return <td key={col.key} style={{ ...tdBase, fontSize: 11, color: "#94a3b8", fontFamily: "monospace", whiteSpace: "nowrap" }}>{r.TRANSACTION_NUMBER?.replace("-2026","") || "—"}</td>;
      case "date":
        return <td key={col.key} style={{ ...tdBase, whiteSpace: "nowrap" }}>{date}</td>;
      case "area":
        return <td key={col.key} style={{ ...tdBase, fontWeight: 700, color: "#0f172a", minWidth: 140 }}>{r.AREA_EN?.trim() || "—"}</td>;
      case "masterProject":
        return <td key={col.key} style={{ ...tdBase, color: "#64748b", minWidth: 140 }}>{master.length > 28 ? master.slice(0,26)+"…" : master}</td>;
      case "project":
        return <td key={col.key} style={{ ...tdBase, color: "#475569", minWidth: 160 }}>{project.length > 30 ? project.slice(0,28)+"…" : project}</td>;
      case "type":
        return <td key={col.key} style={tdBase}><Badge label={isOffPlan ? "Off-Plan" : "Ready"} color={isOffPlan ? "#0369a1" : "#15803d"} bg={isOffPlan ? "#eff6ff" : "#f0fdf4"} /></td>;
      case "procedure":
        return <td key={col.key} style={{ ...tdBase, fontSize: 12, color: "#64748b", minWidth: 160 }}>{r.PROCEDURE_EN?.trim() || "—"}</td>;
      case "freehold":
        return <td key={col.key} style={tdBase}><Badge label={isFreehold ? "Freehold" : "Non-Freehold"} color={isFreehold ? "#15803d" : "#92400e"} bg={isFreehold ? "#f0fdf4" : "#fffbeb"} /></td>;
      case "usage":
        return <td key={col.key} style={{ ...tdBase, whiteSpace: "nowrap" }}>{r.USAGE_EN?.trim() || "—"}</td>;
      case "propType":
        return <td key={col.key} style={tdBase}>{r.PROP_SB_TYPE_EN?.trim() || r.PROP_TYPE_EN?.trim() || "—"}</td>;
      case "rooms":
        return <td key={col.key} style={{ ...tdBase, whiteSpace: "nowrap" }}>{r.ROOMS_EN?.trim() || "—"}</td>;
      case "parking":
        return <td key={col.key} style={{ ...tdBase, textAlign: "center" }}>{r.PARKING?.trim() || "—"}</td>;
      case "value":
        return <td key={col.key} style={{ ...tdBase, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>{val > 0 ? `AED ${fmtM(val)}` : "—"}</td>;
      case "priceSqft":
        return <td key={col.key} style={{ ...tdBase, fontWeight: 700, color: "#7c3aed", whiteSpace: "nowrap" }}>{priceSqft ? `${fmt(priceSqft)}` : "—"}</td>;
      case "sizeSqft":
        return <td key={col.key} style={{ ...tdBase, whiteSpace: "nowrap" }}>{sqft ? sqft.toLocaleString() : "—"}</td>;
      case "actualSqft":
        return <td key={col.key} style={{ ...tdBase, whiteSpace: "nowrap" }}>{actualSqft ? actualSqft.toLocaleString() : "—"}</td>;
      case "buyers":
        return <td key={col.key} style={{ ...tdBase, textAlign: "center" }}>{r.TOTAL_BUYER?.trim() || "—"}</td>;
      case "sellers":
        return <td key={col.key} style={{ ...tdBase, textAlign: "center" }}>{r.TOTAL_SELLER?.trim() || "—"}</td>;
      case "metro":
        return <td key={col.key} style={{ ...tdBase, fontSize: 12, color: "#64748b", minWidth: 140 }}>{r.NEAREST_METRO_EN?.trim() || "—"}</td>;
      case "mall":
        return <td key={col.key} style={{ ...tdBase, fontSize: 12, color: "#64748b", minWidth: 140 }}>{r.NEAREST_MALL_EN?.trim() || "—"}</td>;
      case "landmark":
        return <td key={col.key} style={{ ...tdBase, fontSize: 12, color: "#64748b", minWidth: 160 }}>{r.NEAREST_LANDMARK_EN?.trim() || "—"}</td>;
      default:
        return <td key={col.key} style={tdBase}>—</td>;
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", margin: 0, marginBottom: 4 }}>
          Browse Transactions
        </h2>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Every individual sale record from Dubai Land Department · Jan–Feb 2026 · {salesRows.length.toLocaleString()} total transactions
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍  Search area, project, transaction #, landmark…"
          style={{ flex: 1, minWidth: 240, border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }}
        />
        <select value={filterArea} onChange={(e) => { setFilterArea(e.target.value); setPage(1); }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer", maxWidth: 200 }}>
          <option value="all">All Areas</option>
          {areaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
          <option value="all">All Types</option>
          <option value="Off-Plan">Off-Plan</option>
          <option value="Ready">Ready</option>
        </select>
        <select value={filterUsage} onChange={(e) => { setFilterUsage(e.target.value); setPage(1); }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
          <option value="all">All Usage</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        <select value={filterFreehold} onChange={(e) => { setFilterFreehold(e.target.value); setPage(1); }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-body)", background: "#fff", cursor: "pointer" }}>
          <option value="all">All Tenure</option>
          <option value="Free Hold">Freehold</option>
          <option value="Non Free Hold">Non-Freehold</option>
        </select>

        <button
          onClick={exportToCsv}
          disabled={!filtered.length}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            background: "#0f172a",
            color: "#fff",
            cursor: filtered.length ? "pointer" : "not-allowed",
            opacity: filtered.length ? 1 : 0.6,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Download size={14} strokeWidth={2.5} />
          Export CSV
        </button>

        {/* Column picker */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowColPicker((v) => !v)}
            style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-body)", background: showColPicker ? "#0f172a" : "#fff", color: showColPicker ? "#fff" : "#374151", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Settings2 size={14} strokeWidth={2.5} />
            Columns ({visibleCols.size})
          </button>
          {showColPicker && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", padding: "12px 16px", zIndex: 100, minWidth: 220, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
              <div style={{ gridColumn: "1/-1", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Toggle columns</div>
              {ALL_COLUMNS.map((col) => (
                <label key={col.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={visibleCols.has(col.key)} onChange={() => toggleCol(col.key)}
                    style={{ accentColor: "#e83f25", cursor: "pointer" }} />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button onClick={resetFilters}
            style={{ border: "1px solid #fecaca", borderRadius: 10, padding: "9px 14px", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-body)", background: "#fef2f2", color: "#991b1b", cursor: "pointer" }}>
            Clear filters
          </button>
        )}
        <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
          {filtered.length.toLocaleString()} results
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {visibleColDefs.map((col) => (
                  <th key={col.key} style={thStyle(col)} onClick={() => col.sortable && handleSort(col.key)}>
                    {col.label}
                    {col.sortable && <SortArrow sortKey={sortKey} k={col.key} sortDir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={i}
                  style={{ background: i % 2 === 0 ? "#fff" : "#fafbfc", transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f9ff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafbfc"}>
                  {visibleColDefs.map((col) => renderCell(col, r, i))}
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={visibleColDefs.length} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    No transactions match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} transactions
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "«", action: () => setPage(1),                                     disabled: page === 1 },
                { label: "‹ Prev", action: () => setPage((p) => Math.max(1, p - 1)),        disabled: page === 1 },
                { label: "Next ›", action: () => setPage((p) => Math.min(totalPages, p+1)), disabled: page === totalPages },
                { label: "»", action: () => setPage(totalPages),                            disabled: page === totalPages },
              ].map(({ label, action, disabled }) => (
                <button key={label} onClick={action} disabled={disabled}
                  style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#cbd5e1" : "#374151", background: "#fff", fontWeight: 600, fontFamily: "var(--font-body)" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right", marginTop: 8 }}>
        Source: Dubai Land Department Open Data · Not financial advice
      </p>
    </div>
  );
}