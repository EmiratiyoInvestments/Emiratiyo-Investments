import React from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PolarRadiusAxis, Cell,
} from "recharts";
import { AlertCircle, Loader2, CheckCircle2, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { extractNumber, extractMidpoint, PROCESSING_MSGS } from "./emiraFormatters";

/**
 * EmiraResultCard — all display logic: formatResult, stat cards, and charts.
 * Props: analysisResult, isComplete, activeAnalysis, selectedArea, stats,
 *        isStreaming, streamError, processingMsgIdx, resultEndRef, activeBtn,
 *        lastAnalysisTime
 */
export default function EmiraResultCard({
  analysisResult,
  isComplete,
  activeAnalysis,
  selectedArea,
  stats,
  isStreaming,
  streamError,
  processingMsgIdx,
  resultEndRef,
  activeBtn,
  lastAnalysisTime,
}) {

  /* ── format result ── */
  const formatResult = (text) => {
    if (!text) return null;
    const HEADERS = [
      "CURRENT PRICE:", "1 YEAR FORECAST:", "3 YEAR FORECAST:", "5 YEAR FORECAST:",
      "GROSS YIELD:", "NET YIELD:", "RISK LEVEL:", "OVERALL OUTLOOK:", "HOT OR NOT:",
      "OVERSUPPLY RISK:", "MACRO RISKS:", "LIQUIDITY RISK:", "REGULATORY RISK:",
      "MARKET TIMING:", "TRANSACTION ACTIVITY:", "BUYER DEMAND:", "PRICE TREND:",
    ];
    const ACCENT_HEADERS = [
      "CURRENT PRICE", "1 YEAR FORECAST", "3 YEAR FORECAST", "5 YEAR FORECAST",
      "CURRENT AVG RENT", "GROSS YIELD", "NET YIELD",
      "1 YEAR RENTAL INCOME", "3 YEAR RENTAL INCOME", "5 YEAR RENTAL INCOME",
      "RENTAL DEMAND OUTLOOK", "BEST PROPERTY TYPE",
      "RISK LEVEL", "OVERSUPPLY RISK", "MACRO RISKS", "LIQUIDITY RISK",
      "REGULATORY RISK", "MARKET TIMING", "RISK SUMMARY",
      "OVERALL OUTLOOK", "GOVERNMENT INITIATIVES", "INFRASTRUCTURE",
      "DEMAND FACTORS", "SUPPLY PIPELINE", "MARKET MOMENTUM", "VERDICT",
      "TRANSACTION ACTIVITY", "PRICE TREND", "OFF-PLAN VS READY",
      "BUYER DEMAND", "COMPARED TO DUBAI", "HOT OR NOT",
      "CONFIDENCE", "KEY DRIVERS", "DISCLAIMER",
    ];

    const renderHighlighted = (str) => {
      const RED_WORDS   = /\b(High|Strong|Bullish|Excellent)\b/g;
      const GREEN_WORDS = /\b(Low risk|Safe|Stable)\b/gi;
      return str.split(/(\*\*.*?\*\*)/g).flatMap((part, pi) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return [<strong key={`b${pi}`} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>];
        const segments = [];
        let remaining = part;
        let safetyIdx = 0;
        while (remaining.length > 0 && safetyIdx++ < 200) {
          const redMatch   = RED_WORDS.exec(remaining);   RED_WORDS.lastIndex = 0;
          const greenMatch = GREEN_WORDS.exec(remaining); GREEN_WORDS.lastIndex = 0;
          const first = [redMatch, greenMatch].filter(Boolean).sort((a, b) => a.index - b.index)[0];
          if (!first) { segments.push(remaining); break; }
          if (first.index > 0) segments.push(remaining.slice(0, first.index));
          const isRed = first === redMatch;
          segments.push(
            <span key={`h${pi}-${first.index}`} style={{ color: isRed ? "#e83f25" : "#22c55e", fontWeight: 600 }}>
              {first[0]}
            </span>
          );
          remaining = remaining.slice(first.index + first[0].length);
        }
        return segments;
      });
    };

    return text.split("\n").map((line, i) => {
      const trimmed = line.trim().replace(/\*\*/g, "");
      if (!trimmed) return <div key={i} style={{ height: 12 }} />;

      const matchedHeader = HEADERS.find((h) => trimmed.toUpperCase().includes(h));
      if (matchedHeader && trimmed.includes(":")) {
        const [label, ...valueParts] = trimmed.split(":");
        const value    = valueParts.join(":").trim();
        const labelUp  = label.trim().toUpperCase();
        const isAccent = ACCENT_HEADERS.some((ah) => labelUp.includes(ah));
        const isShort  = value.length < 15;
        return (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1.5px solid #f0f0f0" }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: isAccent ? "#e83f25" : "#939393", display: "block", marginBottom: 6 }}>
              {label.trim()}
            </span>
            <span style={isShort ? {
              fontFamily: "Fields Display, sans-serif", fontSize: 28, fontWeight: 700, color: "#000", lineHeight: 1.1,
            } : {
              fontFamily: "Raleway, sans-serif", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.5,
            }}>
              {value}
            </span>
          </div>
        );
      }

      if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
        return (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e83f25", marginTop: 8, flexShrink: 0 }} />
            <p style={{ color: "#333", lineHeight: 1.7, margin: 0, fontSize: 14 }}>
              {renderHighlighted(trimmed.replace(/^[-*•]\s*/, ""))}
            </p>
          </div>
        );
      }

      if (trimmed.toUpperCase().includes("DISCLAIMER:")) {
        return (
          <p key={i} style={{ fontSize: 11, color: "#939393", marginTop: 40, fontStyle: "italic", borderTop: "1px solid #ebebeb", paddingTop: 20, lineHeight: 1.6 }}>
            {trimmed}
          </p>
        );
      }

      return (
        <p key={i} style={{ color: "#444", marginBottom: 16, lineHeight: 1.8, fontSize: 14 }}>
          {renderHighlighted(trimmed)}
        </p>
      );
    });
  };

  /* ── stat cards ── */
  const renderStatCards = () => {
    if (!isComplete || !analysisResult) return null;
    let cards = [];

    if (activeAnalysis === "PRICE_FORECAST") {
      const current = extractNumber(analysisResult, "CURRENT PRICE:");
      const yr5     = extractMidpoint(analysisResult, "5 YEAR FORECAST:");
      if (current) cards.push({ label: "Current Price",    value: `AED ${current.toLocaleString()}` });
      if (yr5)     cards.push({ label: "5yr Target",       value: `AED ${yr5.toLocaleString()}` });
      if (current && yr5) {
        const growth = Math.round((yr5 - current) / current * 100);
        if (growth !== null) cards.push({ label: "Projected Growth", value: `+${growth}%`, color: "#22c55e" });
      }
    } else if (activeAnalysis === "RENTAL_YIELD") {
      const gross      = extractMidpoint(analysisResult, "GROSS YIELD:") || extractNumber(analysisResult, "GROSS YIELD:");
      const net        = extractMidpoint(analysisResult, "NET YIELD:")   || extractNumber(analysisResult, "NET YIELD:");
      const yr5Income  = extractNumber(analysisResult, "5 YEAR RENTAL INCOME:");
      if (gross)     cards.push({ label: "Gross Yield", value: `${gross}%` });
      if (net)       cards.push({ label: "Net Yield",   value: `${net}%` });
      if (yr5Income) cards.push({ label: "5yr Income",  value: `AED ${yr5Income.toLocaleString()}` });
    } else if (activeAnalysis === "RISK_ASSESSMENT") {
      const levelMatch  = analysisResult.match(/RISK LEVEL:[^\n]*(Low|Medium|High)/i);
      const timingMatch = analysisResult.match(/MARKET TIMING:[^\n]*(good time|wait)/i);
      if (levelMatch) {
        const lvl = levelMatch[1];
        const lvlColor = lvl.toLowerCase() === "low" ? "#22c55e" : lvl.toLowerCase() === "medium" ? "#f59e0b" : "#ef4444";
        cards.push({ label: "Risk Level", value: lvl.toUpperCase(), color: lvlColor });
      }
      if (timingMatch) {
        const isBuy = timingMatch[1].toLowerCase() === "good time";
        cards.push({ label: "Market Timing", value: isBuy ? "BUY" : "WAIT", color: isBuy ? "#22c55e" : "#f59e0b" });
      }
    } else if (activeAnalysis === "MARKET_PULSE") {
      const demandMatch = analysisResult.match(/BUYER DEMAND:[^\n]*(Strong|Moderate|Weak)/i);
      const trendMatch  = analysisResult.match(/PRICE TREND:[^\n]*(Upward|Rising|Increasing|Stable|Declining)/i);
      const hotMatch    = analysisResult.match(/HOT OR NOT:[^\n]*?(Hot|Not Hot|Warm|Cold)/i);
      if (demandMatch) cards.push({ label: "Buyer Demand", value: demandMatch[1].toUpperCase() });
      if (trendMatch)  cards.push({ label: "Price Trend",  value: trendMatch[1].toUpperCase() });
      if (hotMatch)    cards.push({ label: "Hot or Not",   value: hotMatch[1].toUpperCase() });
    } else if (activeAnalysis === "GROWTH_DRIVERS") {
      const outlookMatch  = analysisResult.match(/OVERALL OUTLOOK:[^\n]*(Bullish|Neutral|Bearish)/i);
      const momentumMatch = analysisResult.match(/MARKET MOMENTUM:[^\n]*(Strong|Moderate|Weak|High|Low)/i);
      if (outlookMatch) {
        const ok = outlookMatch[1];
        const okColor = ok.toLowerCase() === "bullish" ? "#22c55e" : ok.toLowerCase() === "neutral" ? "#f59e0b" : "#ef4444";
        cards.push({ label: "Outlook", value: ok.toUpperCase(), color: okColor });
      }
      if (momentumMatch) cards.push({ label: "Market Momentum", value: momentumMatch[1].toUpperCase() });
    }

    if (cards.length === 0) return null;
    return (
      <div className="fade-up" style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {cards.map((card, i) => (
          <div key={i} style={{ flex: "1 1 160px", background: "#fff", border: "1.5px solid #ebebeb", borderRadius: 0, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e83f25" }} />
            <div className="e-label" style={{ marginBottom: 10 }}>{card.label}</div>
            <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 32, fontWeight: 700, lineHeight: 1, color: card.color || "#000" }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ── charts ── */
  const renderCharts = () => {
    if (!isComplete || !analysisResult) return null;

    const ttStyle = {
      contentStyle: { background: "#fff", border: "1.5px solid #ebebeb", borderRadius: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
      itemStyle: { color: "#e83f25", fontWeight: 700 },
      labelStyle: { fontWeight: 800, marginBottom: 4, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#939393" },
    };

    const ChartCard = ({ title, children }) => (
      <div className="fade-up" style={{ marginTop: 40, background: "#fff", border: "1.5px solid #ebebeb", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e83f25" }} />
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <div className="e-label">{title}</div>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    );

    /* ──────────── PRICE_FORECAST */
    if (activeAnalysis === "PRICE_FORECAST") {
      const current  = extractNumber(analysisResult, "CURRENT PRICE:");
      const yr1      = extractMidpoint(analysisResult, "1 YEAR FORECAST:");
      const yr3      = extractMidpoint(analysisResult, "3 YEAR FORECAST:");
      const yr5      = extractMidpoint(analysisResult, "5 YEAR FORECAST:");
      const areaData = stats?.topAreasByCount?.slice(0, 6).map((a) => ({
        area: a.fullName.length > 12 ? a.fullName.slice(0, 12) + "…" : a.fullName,
        fullName: a.fullName,
        price: Math.round(a.avgPrice),
      })) || [];

      if (!current && !yr1 && areaData.length === 0) return null;
      const pctLabel = ({ x, y, index, value }) => {
        const pct = index === 0 ? "Base" : `+${Math.round((value - current) / current * 100)}%`;
        return <text x={x} y={y - 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#e83f25">{pct}</text>;
      };
      return (
        <>
          {current && yr1 && yr3 && yr5 && (
            <ChartCard title="Visual Summary">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={[{ period: "Now", price: current }, { period: "1 Year", price: yr1 }, { period: "3 Years", price: yr3 }, { period: "5 Years", price: yr5 }]} margin={{ top: 36, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} tickFormatter={(v) => `AED ${v}`} />
                  <Tooltip {...ttStyle} />
                  <Line type="monotone" dataKey="price" stroke="#e83f25" strokeWidth={3} dot={{ r: 6, fill: "#e83f25", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} label={pctLabel} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
          {areaData.length > 0 && (
            <ChartCard title="Area Price Comparison">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={areaData} margin={{ top: 10, right: 20, left: 20, bottom: 44 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#555" }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#555" }} tickFormatter={(v) => `AED ${v}`} />
                  <Tooltip {...ttStyle} />
                  <Bar dataKey="price" radius={[3, 3, 0, 0]} barSize={36}>
                    {areaData.map((entry, index) => (
                      <Cell key={`cell-area-${index}`} fill={entry.fullName === selectedArea ? "#e83f25" : "#1e293b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      );
    }

    /* ──────────── RENTAL_YIELD */
    if (activeAnalysis === "RENTAL_YIELD") {
      const gross      = extractMidpoint(analysisResult, "GROSS YIELD:") || extractNumber(analysisResult, "GROSS YIELD:");
      const net        = extractMidpoint(analysisResult, "NET YIELD:")   || extractNumber(analysisResult, "NET YIELD:");
      const yr1Income  = extractNumber(analysisResult, "1 YEAR RENTAL INCOME:");
      const yr3Income  = extractNumber(analysisResult, "3 YEAR RENTAL INCOME:");
      const yr5Income  = extractNumber(analysisResult, "5 YEAR RENTAL INCOME:");
      const costs      = gross && net ? gross - net : 0;

      if (!gross && !net && !(yr1Income && yr3Income && yr5Income)) return null;
      return (
        <>
          <ChartCard title="Visual Summary">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {(gross || net) && (
                <div style={{ display: "flex", gap: 16 }}>
                  {gross && <div style={{ flex: 1, padding: 20, border: "1.5px solid #f0f0f0" }}><div className="e-label" style={{ marginBottom: 8 }}>Gross Yield</div><div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 32, fontWeight: 700, color: "#000" }}>{gross}%</div></div>}
                  {net && <div style={{ flex: 1, padding: 20, border: "1.5px solid #f0f0f0" }}><div className="e-label" style={{ marginBottom: 8 }}>Net Yield</div><div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 32, fontWeight: 700, color: "#000" }}>{net}%</div></div>}
                </div>
              )}
              {yr1Income && yr3Income && yr5Income && (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[{ period: "1 Year", income: yr1Income }, { period: "3 Years", income: yr3Income }, { period: "5 Years", income: yr5Income }]} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} tickFormatter={(v) => `AED ${v / 1000}k`} />
                    <Tooltip cursor={{ fill: "#fcfcfc" }} contentStyle={{ background: "#fff", border: "1.5px solid #ebebeb", borderRadius: 0 }} />
                    <Bar dataKey="income" fill="#e83f25" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
          {gross && net && gross > net && (
            <ChartCard title="Yield Breakdown">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[{ name: "Net Yield", value: net }, { name: "Fees & Costs", value: costs }]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#fde8e4" />
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: 0, border: "1.5px solid #ebebeb" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      );
    }

    /* ──────────── RISK_ASSESSMENT */
    if (activeAnalysis === "RISK_ASSESSMENT") {
      const parseRisk = (label) => {
        const match = analysisResult.match(new RegExp(label + "[^\\w]*(Low|Medium|High)", "i"));
        if (!match) return 0;
        return { low: 1, medium: 2, high: 3 }[match[1].toLowerCase()] ?? 0;
      };
      const timingMatch = analysisResult.match(/MARKET TIMING:[^.]*(good time|wait)/i);
      const data = [
        { risk: "Oversupply", value: parseRisk("OVERSUPPLY RISK:") },
        { risk: "Macro",      value: parseRisk("MACRO RISKS:") },
        { risk: "Liquidity",  value: parseRisk("LIQUIDITY RISK:") },
        { risk: "Regulatory", value: parseRisk("REGULATORY RISK:") },
        { risk: "Timing",     value: timingMatch ? (timingMatch[1].toLowerCase() === "good time" ? 1 : 2) : 2 },
      ];
      if (!data.some((d) => d.value > 0)) return null;
      const activeValues = data.filter((d) => d.value > 0);
      const avgRisk      = activeValues.reduce((s, d) => s + d.value, 0) / activeValues.length;
      const riskColor    = avgRisk <= 1.5 ? "#22c55e" : avgRisk <= 2.2 ? "#f59e0b" : "#e83f25";
      const gaugeScore   = Math.round(avgRisk / 3 * 10);
      const arcLen       = 251.3;
      const filled       = (gaugeScore / 10) * arcLen;
      return (
        <>
          <ChartCard title="Risk Breakdown">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="risk" tick={{ fontSize: 10, fontWeight: 700, fill: "#444" }} />
                <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                <Radar name="Risk" dataKey="value" stroke={riskColor} fill={riskColor} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Risk Score">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 200 120" width="220" height="132">
                <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#fde8e4" strokeWidth="14" strokeLinecap="round" />
                <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke={riskColor} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${filled} ${arcLen}`} />
                <text x="100" y="90" textAnchor="middle" fontSize="38" fontWeight="800" fill={riskColor} fontFamily="Raleway, sans-serif">{gaugeScore}</text>
                <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#555" fontFamily="Raleway, sans-serif">/ 10</text>
              </svg>
              <div className="e-label" style={{ marginTop: 4 }}>Overall Risk Score</div>
            </div>
          </ChartCard>
        </>
      );
    }

    /* ──────────── MARKET_PULSE */
    if (activeAnalysis === "MARKET_PULSE") {
      const parsePulse = (label, rules) => {
        const regex = new RegExp(label + "([^\\n]*)", "i");
        const match = analysisResult.match(regex);
        if (!match) return null;
        const val = match[1].toLowerCase();
        for (const rule of rules)
          if (rule.keywords.some((k) => val.includes(k))) return rule.score;
        return null;
      };
      const transaction = parsePulse("TRANSACTION ACTIVITY:", [
        { keywords: ["high", "above average", "strong", "robust"],                          score: 80 },
        { keywords: ["moderate", "average", "balanced"],                                    score: 55 },
        { keywords: ["low", "below", "marginal", "limited", "minimal"],                     score: 30 },
      ]);
      const demand = parsePulse("BUYER DEMAND:", [
        { keywords: ["strong", "high", "robust", "excellent"],                              score: 85 },
        { keywords: ["moderate", "average", "steady"],                                      score: 55 },
        { keywords: ["weak", "low", "limited", "constrained"],                              score: 25 },
      ]);
      const trend = parsePulse("PRICE TREND:", [
        { keywords: ["upward", "rising", "increasing", "strong", "appreciat", "premium"],   score: 75 },
        { keywords: ["stable", "steady", "flat"],                                           score: 50 },
        { keywords: ["declining", "falling", "downward"],                                   score: 25 },
      ]);
      const data = [
        { metric: "Transaction Activity", score: transaction ?? 0 },
        { metric: "Buyer Demand",         score: demand ?? 0 },
        { metric: "Price Trend",          score: trend ?? 0 },
      ];
      if (!data.some((d) => d.score > 0)) return null;

      const areaStatEntry = selectedArea ? stats?.areaMap?.[selectedArea] : null;
      const dubaiAvg = stats?.totalTx && stats?.uniqueAreas?.length
        ? Math.round(stats.totalTx / stats.uniqueAreas.length) : null;

      return (
        <>
          <ChartCard title="Visual Summary">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#333" }} width={130} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 0, border: "1.5px solid #ebebeb" }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 70 ? "#22c55e" : entry.score >= 50 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          {areaStatEntry && dubaiAvg !== null && (
            <ChartCard title="Transaction Volume vs Dubai Average">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{ name: (selectedArea || "Selected").slice(0, 14), value: areaStatEntry.count }, { name: "Dubai Avg", value: dubaiAvg }]} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#939393" }} />
                  <Tooltip {...ttStyle} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={52}>
                    <Cell fill="#e83f25" />
                    <Cell fill="#1e293b" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      );
    }

    /* ──────────── GROWTH_DRIVERS */
    if (activeAnalysis === "GROWTH_DRIVERS") {
      const parseDriver = (label) => {
        const regex = new RegExp(label + "([\\s\\S]*?)(?=\\n[A-Z]{2,}:|$)", "i");
        const match = analysisResult.match(regex);
        if (!match) return 60;
        const text = match[1].toLowerCase();
        const highWords = ["robust", "excellent", "strong", "significant", "major", "pivotal", "key", "critical", "extensive", "expanding", "continuous", "world-class"];
        const lowWords  = ["limited", "weak", "poor", "minimal", "lacking", "insufficient", "constrained"];
        const highCount = highWords.filter(w => text.includes(w)).length;
        const lowCount  = lowWords.filter(w => text.includes(w)).length;
        if (highCount >= 2) return 90;
        if (highCount >= 1 && lowCount === 0) return 75;
        if (lowCount >= 2) return 30;
        if (lowCount >= 1) return 40;
        return 60;
      };
      const gdData = [
        { metric: "Government Initiatives", score: parseDriver("GOVERNMENT INITIATIVES:") },
        { metric: "Infrastructure",         score: parseDriver("INFRASTRUCTURE:") },
        { metric: "Demand Factors",         score: parseDriver("DEMAND FACTORS:") },
      ];
      if (!gdData.some((d) => d.score > 0)) return null;

      const scorePhase = (regex) => {
        const m = analysisResult.match(regex);
        if (!m) return 60;
        const kw = m[1].toLowerCase();
        if (["strong", "high"].some((k) => kw.startsWith(k))) return 85;
        if (["moderate", "medium"].some((k) => kw.startsWith(k))) return 60;
        return 35;
      };
      const phaseData = [
        { phase: "Short Term", score: scorePhase(/short[\s-]term.*?\b(strong|high|moderate|medium|weak|low)\b/i) },
        { phase: "Mid Term",   score: scorePhase(/mid[\s-]term.*?\b(strong|high|moderate|medium|weak|low)\b/i) },
        { phase: "Long Term",  score: scorePhase(/long[\s-]term.*?\b(strong|high|moderate|medium|weak|low)\b/i) },
      ];
      return (
        <>
          <ChartCard title="Growth Drivers">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={gdData} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#333" }} width={150} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 0, border: "1.5px solid #ebebeb" }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                  {gdData.map((entry, index) => (
                    <Cell key={`cell-gd-${index}`} fill={entry.score >= 70 ? "#22c55e" : entry.score >= 50 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Growth Phase Outlook">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={phaseData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e83f25" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e83f25" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="phase" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#939393" }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#939393" }} />
                <Tooltip contentStyle={{ borderRadius: 0, border: "1.5px solid #ebebeb" }} />
                <Area type="monotone" dataKey="score" stroke="#e83f25" strokeWidth={2} fill="url(#growthGrad)" dot={{ r: 5, fill: "#e83f25", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      );
    }

    return null;
  };

  /* ── result card render ── */
  if (!activeAnalysis) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ minHeight: 620, border: "2px dashed #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, textAlign: "center", position: "relative", background: "#fff", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", fontFamily: "Fields Display, sans-serif", fontSize: "clamp(120px, 14vw, 220px)", fontWeight: 700, color: "rgba(232,63,37,0.04)", letterSpacing: "-0.05em", userSelect: "none", lineHeight: 1 }}>E</div>
        <div style={{ width: 48, height: 48, border: "1.5px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: "#ddd" }}>
          <Play size={20} fill="currentColor" />
        </div>
        <h3 style={{ fontFamily: "Fields Display, sans-serif", fontSize: 28, fontWeight: 700, color: "#ddd", marginBottom: 12 }}>Ready for Intelligence</h3>
        <p style={{ color: "#ccc", maxWidth: 340, lineHeight: 1.8, fontSize: 13 }}>
          Select a focus area and choose an analysis module to begin. Emira processes live transaction data to generate actionable insights.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ height: "100%", minHeight: 620, background: "#fff", border: "1.5px solid #ebebeb", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e83f25" }} />

      {/* result header */}
      <div style={{ padding: "28px 36px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {isStreaming && <Loader2 size={12} className="spin" style={{ color: "#e83f25" }} />}
            {isComplete && !isStreaming && <CheckCircle2 size={12} style={{ color: "#e83f25" }} />}
            <span className="e-label" style={{ color: isStreaming ? "#e83f25" : "#939393" }}>
              {isStreaming ? "Live Transmission" : isComplete ? "Report Complete" : "Initialising"}
            </span>
          </div>
          <h3 style={{ fontFamily: "Fields Display, sans-serif", fontSize: "clamp(22px, 2.5vw, 36px)", fontWeight: 700, color: "#000", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {activeBtn?.label}
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="e-label" style={{ marginBottom: 6 }}>Subject</div>
          <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 17, fontWeight: 700, color: "#e83f25" }}>{selectedArea || "General Dubai Market"}</div>
          <div style={{ fontSize: 10, color: "#939393", marginTop: 2 }}>{activeBtn?.sub}</div>
        </div>
      </div>

      {/* result body */}
      <div className="r-scroll" style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {streamError ? (
          <div style={{ background: "#fff8f7", border: "1.5px solid #fad0c9", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <AlertCircle style={{ color: "#e83f25" }} size={28} />
            <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 22, color: "#e83f25" }}>Analysis Failed</div>
            <p style={{ color: "#939393", fontSize: 13 }}>{streamError}</p>
          </div>
        ) : analysisResult ? (
          <div className="fade-up">
            {renderStatCards()}
            {formatResult(analysisResult)}
            {renderCharts()}
            <div ref={resultEndRef} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
            <div style={{ position: "relative", width: 50, height: 50 }}>
              <div style={{ position: "absolute", inset: 0, border: "2px solid #ebebeb", borderTopColor: "#e83f25", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            </div>
            <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 22, color: "#000" }}>Processing</div>
            <p key={processingMsgIdx} className="fade-up" style={{ color: "#939393", fontSize: 12, letterSpacing: "0.04em", textAlign: "center", maxWidth: 260 }}>
              {PROCESSING_MSGS[processingMsgIdx]}
            </p>
          </div>
        )}
      </div>

      {/* result footer */}
      <div style={{ padding: "14px 36px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
        <div>{isStreaming && <span className="e-label blink" style={{ color: "#e83f25" }}>— Receiving secure transmission</span>}</div>
        {lastAnalysisTime && <span className="e-label">Timestamp: {lastAnalysisTime.toLocaleTimeString()}</span>}
      </div>
    </motion.div>
  );
}
