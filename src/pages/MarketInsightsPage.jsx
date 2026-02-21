// src/pages/MarketInsightsPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/sanityClient";
import { ALL_PROPERTIES_QUERY } from "../lib/propertyQueries";
import DubaiHeatmap from "../components/market-insights/maps/DubaiHeatMap";
import WeeklySnapshot from "../components/market-insights/pricing/WeeklySnapshot";
import AutoInsights from "../components/market-insights/pricing/AutoInsights";
import TransactionInsights from "../components/market-insights/transaction/TransactionInsights";
import TransactionTable from "../components/market-insights/transaction/TransactionTable";
import { Briefcase, Home, Key } from "lucide-react";

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "56px 0 32px" }}>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
  </div>
);

const MarketInsightsPage = () => {
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

          {/* 2 — TRANSACTION INTELLIGENCE (charts) */}
          <SectionDivider label="Transaction Intelligence · DLD Open Data" />
          <TransactionInsights />

          {/* 3 — BROWSE TRANSACTIONS (table) */}
          <SectionDivider label="Browse Individual Transactions · DLD Open Data" />
          <TransactionTable />

          {/* 4 — HEATMAP */}
          <SectionDivider label="Interactive Map" />
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-display)", marginBottom: 4 }}>
              Dubai Price & Transaction Heatmap
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", fontFamily: "var(--font-body)" }}>
              Switch between price view and transaction volume view. Click any area for detailed data.
            </p>
          </div>
          <div className="mb-4">
            <DubaiHeatmap />
          </div>

          {/* 5 — AREA INTELLIGENCE */}
          <SectionDivider label="Area Intelligence" />
          <AutoInsights />

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
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
              <p className="text-sm text-blue-800" style={{ fontFamily: "var(--font-body)" }}>
                <strong>💡 Tip:</strong> Use the interactive heatmap above to explore price averages by area, then browse our listings to find properties in your target community.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MarketInsightsPage;