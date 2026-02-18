import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, TrendingUp, Home } from "lucide-react";
import Header from "../components/global/Header";
import GlobalMap from "../components/market-insights/GlobalMap";
import { client } from "../services/sanityClient";
import { ALL_PROPERTIES_QUERY } from "../lib/propertyQueries";
import DubaiHeatmap from "../components/market-insights/DubaiHeatMap";

const MarketInsightsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties-map"],
    queryFn: () => client.fetch(ALL_PROPERTIES_QUERY),
  });

  // Filter properties
  const filteredProperties = properties?.filter((property) => {
    const statusMatch =
      selectedStatus === "all" || property.status === selectedStatus;
    const typeMatch =
      selectedType === "all" || property.propertyType === selectedType;
    return statusMatch && typeMatch;
  });

  // Calculate stats
  const totalProperties = filteredProperties?.length || 0;
  const forSaleCount =
    filteredProperties?.filter((p) => p.status === "for-sale").length || 0;
  const forRentCount =
    filteredProperties?.filter((p) => p.status === "for-rent").length || 0;

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-gray-500"
            >
              Loading market insights...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <div className="mb-12 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Market Insights
            </p>
            <h1
              className="text-5xl font-bold text-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dubai Real Estate Market
            </h1>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Explore all our listed properties across Dubai on an interactive
              map.
            </p>
          </div>
          
          <div className="mb-12">
            <DubaiHeatmap />
          </div>

          {/* INFO BOX */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <p
              className="text-sm text-blue-800"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <strong>💡 Tip:</strong> Click on any marker to see property
              details. Use the filters above to narrow down by status and type.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketInsightsPage;
