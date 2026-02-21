// src/pages/MarketInsightsPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/sanityClient";
import { ALL_PROPERTIES_QUERY } from "../lib/propertyQueries";
import DubaiHeatmap from "../components/market-insights/maps/DubaiHeatMap";
import WeeklySnapshot from "../components/market-insights/pricing/WeeklySnapshot";
import AutoInsights from "../components/market-insights/pricing/AutoInsights";
import CompareAreas from "../components/market-insights/pricing/CompareAreas";
import TransactionInsights from "../components/market-insights/transaction/TransactionInsights";
import TransactionTable from "../components/market-insights/transaction/TransactionTable";
import { Briefcase, Home, Key, BarChart3, TrendingUp, Lightbulb } from "lucide-react";

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "56px 0 32px" }}>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
  </div>
);

const TABS = [
  { key: "transaction", label: "Transaction Data", icon: BarChart3 },
  { key: "pricing", label: "Pricing & Area Intelligence", icon: TrendingUp },
];

const MarketInsightsPage = () => {
  const [activeTab, setActiveTab] = useState("transaction"); // default: transaction
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties-map"],
    queryFn: () => client.fetch(ALL_PROPERTIES_QUERY),
  });

  const totalProperties = properties?.length || 0;
  const forSaleCount    = properties?.filter((p) => p.status === "for-sale").length || 0;
  const forRentCount    = properties?.filter((p) => p.status === "for-rent").length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin" />
          <p style={{ fontFamily: "var(--font-body)" }} className="text-gray-500">Loading market insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Market Insights
            </p>
            <h1 className="text-5xl font-bold text-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Dubai Real Estate Market
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Weekly transaction data, area intelligence, and interactive price heatmaps — all in one place.
            </p>
          </div>

          {/* 1 — WEEKLY SNAPSHOT */}
          <WeeklySnapshot />

          {/* 2 — TRANSACTION INTELLIGENCE (charts + Top Projects) */}
          <SectionDivider label="Transaction Intelligence · DLD Open Data" />
          <TransactionInsights />

          {/* 3 — TABBED: Transaction Data | Pricing & Area Intelligence */}
          <SectionDivider label="Explore Data & Map" />
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {/* Tab buttons — sticky when scrolling */}
            <div
              style={{
                display: "flex",
                borderBottom: "2px solid #e5e7eb",
                background: "#f8fafc",
                position: "sticky",
                top: 72,
                zIndex: 30,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "18px 24px",
                      border: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#e83f25" : "#64748b",
                      fontSize: 16,
                      fontWeight: 800,
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      borderBottom: isActive ? "2px solid #fff" : "2px solid transparent",
                      marginBottom: isActive ? "-2px" : 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div style={{ padding: "28px 24px" }}>
              {activeTab === "transaction" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                      Browse Individual Transactions
                    </h2>
                    <TransactionTable />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                      Transaction Choropleth Map
                    </h2>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, fontFamily: "var(--font-body)" }}>
                      Heatmap by transaction volume per area. Click any area for details.
                    </p>
                    <DubaiHeatmap initialMode="transactions" />
                  </div>
                </div>
              )}

              {activeTab === "pricing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  <CompareAreas />
                  <AutoInsights />
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                      Price Choropleth Map
                    </h2>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, fontFamily: "var(--font-body)" }}>
                      Heatmap by sale price (AED/sqft). Switch between apartment and villa views.
                    </p>
                    <DubaiHeatmap initialMode="sale_apartment" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6 — OUR LISTINGS */}
          <SectionDivider label="Our Listings" />
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 32px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", marginBottom: 20 }}>
              Our Active Listings
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Listed", value: totalProperties, icon: <Home size={14} />,     accent: "#e83f25" },
                { label: "For Sale",     value: forSaleCount,    icon: <Briefcase size={14} />, accent: "#3b82f6" },
                { label: "For Rent",     value: forRentCount,    icon: <Key size={14} />,       accent: "#22c55e" },
              ].map(({ label, value, icon, accent }) => (
                <div key={label} style={{ background: "#f8fafc", borderRadius: 14, padding: "18px 20px", borderLeft: `4px solid ${accent}` }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6 }}>
                    {icon} {label}
                  </p>
                  <p style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)" }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl flex gap-3">
              <Lightbulb size={20} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-sm text-blue-800" style={{ fontFamily: "var(--font-body)" }}>
                <strong>Tip:</strong> Use the choropleth maps in the Explore Data & Map section above to explore transaction volume and price averages by area, then browse our listings to find properties in your target community.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MarketInsightsPage;