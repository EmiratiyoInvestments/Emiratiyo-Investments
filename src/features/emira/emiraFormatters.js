import { TrendingUp, Home, Layers, Shield, BarChart2 } from "lucide-react";
export const ANALYSIS_BUTTONS = [{
  id: "PRICE_FORECAST",
  label: "Price Forecast",
  sub: "Predictive valuation",
  Icon: TrendingUp
}, {
  id: "RENTAL_YIELD",
  label: "Rental Yield",
  sub: "Income potential",
  Icon: Home
}, {
  id: "GROWTH_DRIVERS",
  label: "Growth Drivers",
  sub: "Market catalysts",
  Icon: Layers
}, {
  id: "RISK_ASSESSMENT",
  label: "Risk Assessment",
  sub: "Exposure analysis",
  Icon: Shield
}, {
  id: "MARKET_PULSE",
  label: "Market Pulse",
  sub: "Live transaction trends",
  Icon: BarChart2
}];
export const TYPE_LABELS = {
  PRICE_FORECAST: "Price Forecast",
  RENTAL_YIELD: "Rental Yield",
  GROWTH_DRIVERS: "Growth Drivers",
  RISK_ASSESSMENT: "Risk Assessment",
  MARKET_PULSE: "Market Pulse"
};
export const PROCESSING_MSGS = ["Analysing transaction patterns...", "Cross-referencing DLD market data...", "Evaluating government initiatives...", "Computing price trajectories...", "Synthesising risk factors...", "Scanning area demand signals...", "Generating investment insights...", "Calibrating confidence levels..."];
export const EMIRA_SECRET = import.meta.env.VITE_EMIRA_SECRET || "49352";
export const getRequestCount = () => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem("emira_request_date");
  if (storedDate !== today) {
    localStorage.setItem("emira_request_date", today);
    localStorage.setItem("emira_request_count", "0");
    return 0;
  }
  return parseInt(localStorage.getItem("emira_request_count") || "0", 10);
};
export const incrementRequestCount = () => {
  const next = getRequestCount() + 1;
  localStorage.setItem("emira_request_count", next.toString());
  return next;
};
export const formatDate = value => {
  const d = parseEmiraDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  }) + ", " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

function parseEmiraDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) || value.getTime() === 0 ? null : value;
  }
  if (typeof value === "number") {
    const ms = value > 0 && value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) || d.getTime() === 0 ? null : d;
  }
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, day, h = 0, min = 0, s = 0] = value;
    const d = new Date(Date.UTC(y, m - 1, day, h, min, s));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime()) || d.getTime() === 0) return null;
  return d;
}
export const extractNumber = (text, label) => {
  const match = text.match(new RegExp(label + "[^\\d]*(\\d[\\d,]*)", "i"));
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
};
export const extractMidpoint = (text, label) => {
  const match = text.match(new RegExp(label + "[^\\d]*(\\d[\\d,]*)\\s*[-–]\\s*(\\d[\\d,]*)", "i"));
  if (!match) return null;
  return Math.round((parseInt(match[1].replace(/,/g, ""), 10) + parseInt(match[2].replace(/,/g, ""), 10)) / 2);
};
export const buildMarketContext = (stats, selectedArea) => {
  if (!stats) return "";
  const top8Str = stats.topAreasByCount.slice(0, 8).map(a => `- ${a.fullName}: ${a.count} deals, Avg: AED ${Math.round(a.avgPrice)}/sqft`).join("\n");
  const offPlanSplit = `Off-plan: ${stats.offPlanPercent.toFixed(1)}% vs Ready: ${stats.readyPercent.toFixed(1)}%`;
  const totals = `Total Tx: ${stats.totalTx.toLocaleString()}, Value: AED ${(stats.totalValue / 1_000_000_000).toFixed(2)}B`;
  let area = "";
  if (selectedArea && stats.areaMap?.[selectedArea]) {
    const s = stats.areaMap[selectedArea];
    area = `Focus (${selectedArea}): ${s.count} tx, Avg: AED ${Math.round(s.priceSum / s.priceCount)}/sqft`;
  }
  return `Top 8 Areas:\n${top8Str}\n\n- ${offPlanSplit}\n- ${totals}\n\n${area}`.trim();
};
