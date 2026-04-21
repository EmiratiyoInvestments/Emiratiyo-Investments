import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";

const SQM_TO_SQFT = 10.7639;

const fmt = (n) => new Intl.NumberFormat("en-AE").format(Math.round(n));
const fmtM = (n) => {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  return `AED ${fmt(n)}`;
};

const fetchCsvData = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse("/data/transaction-26.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
};

export function useCsvData() {
  const { data: rows = [], isLoading: loading, error } = useQuery({
    queryKey: ["transaction-csv"],
    queryFn: fetchCsvData,
    staleTime: Infinity,
  });

  const stats = useMemo(() => {
    if (!rows.length) return null;

    const sales = rows.filter((r) => r.GROUP_EN?.trim() === "Sales");
    const totalTx = sales.length;
    const totalValue = sales.reduce((s, r) => s + (parseFloat(r.TRANS_VALUE) || 0), 0);
    const offPlanCount = sales.filter((r) => r.IS_OFFPLAN_EN?.trim() === "Off-Plan").length;
    const readyCount = sales.filter((r) => r.IS_OFFPLAN_EN?.trim() === "Ready").length;

    const withArea = sales.filter((r) => parseFloat(r.PROCEDURE_AREA) > 0 && parseFloat(r.TRANS_VALUE) > 0);
    const avgPriceSqftGlobal = withArea.length
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
      if (sqm > 0 && val > 0) {
        areaMap[area].priceSum += val / (sqm * SQM_TO_SQFT);
        areaMap[area].priceCount += 1;
      }
    });

    const uniqueAreas = Object.keys(areaMap).sort((a, b) => a.localeCompare(b));

    const topAreasByCount = Object.entries(areaMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, d]) => ({
        name: name.length > 22 ? name.slice(0, 20) + "…" : name,
        fullName: name,
        value: d.count,
        count: d.count,
        avgPrice: d.priceCount > 0 ? d.priceSum / d.priceCount : null,
        formattedValue: `${d.count.toLocaleString()} transactions`,
      }));

    const topAreasByValue = Object.entries(areaMap)
      .sort((a, b) => b[1].value - a[1].value)
      .slice(0, 10)
      .map(([name, d]) => ({
        name: name.length > 22 ? name.slice(0, 20) + "…" : name,
        fullName: name,
        value: Math.round(d.value / 1_000_000),
        formattedValue: fmtM(d.value),
      }));

    const topAreasByPrice = Object.entries(areaMap)
      .filter(([, d]) => d.priceCount >= 3)
      .sort((a, b) => b[1].priceSum / b[1].priceCount - a[1].priceSum / a[1].priceCount)
      .slice(0, 10)
      .map(([name, d]) => ({
        name: name.length > 22 ? name.slice(0, 20) + "…" : name,
        fullName: name,
        value: Math.round(d.priceSum / d.priceCount),
        formattedValue: `AED ${fmt(Math.round(d.priceSum / d.priceCount))}/sqft`,
      }));

    const projectMap = {};
    sales.forEach((r) => {
      const proj = r.PROJECT_EN?.trim() || r.MASTER_PROJECT_EN?.trim();
      if (!proj || proj === "0" || proj === "") return;
      if (!projectMap[proj]) projectMap[proj] = { count: 0, value: 0 };
      projectMap[proj].count += 1;
      projectMap[proj].value += parseFloat(r.TRANS_VALUE) || 0;
    });

    const topProjects = Object.entries(projectMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, d]) => ({
        name: name.length > 26 ? name.slice(0, 24) + "…" : name,
        fullName: name,
        value: d.count,
        formattedValue: `${d.count} deals · ${fmtM(d.value)}`,
      }));

    const offPlanVsReady = [
      { name: "Off-Plan", value: offPlanCount },
      { name: "Ready", value: readyCount },
    ];

    const usageSplit = Object.entries(
      sales.reduce((acc, r) => {
        const u = r.USAGE_EN?.trim() || "Other";
        acc[u] = (acc[u] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const propTypeSplit = Object.entries(
      sales.reduce((acc, r) => {
        const t = r.PROP_SB_TYPE_EN?.trim() || r.PROP_TYPE_EN?.trim() || "Other";
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    const roomsSplit = Object.entries(
      sales.reduce((acc, r) => {
        const raw = r.ROOMS_EN?.trim();
        const room = !raw || raw.toLowerCase() === "unknown" || raw === "NA" ? "Other" : raw;
        acc[room] = (acc[room] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    return {
      totalTx,
      totalValue,
      offPlanCount,
      readyCount,
      avgPriceSqftGlobal,
      areaMap,
      uniqueAreas,
      topAreasByCount,
      topAreasByValue,
      topAreasByPrice,
      topProjects,
      offPlanVsReady,
      usageSplit,
      propTypeSplit,
      roomsSplit,
      offPlanPercent: (offPlanCount / totalTx) * 100,
      readyPercent: (readyCount / totalTx) * 100,
    };
  }, [rows]);

  return { rows, stats, loading, error };
}
