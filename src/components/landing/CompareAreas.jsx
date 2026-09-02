import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapPin, Building2, BarChart3, ArrowRight } from "lucide-react";
import { deriveAreaDataFromRows, useTransactionData } from "../../features/market-intelligence";

const fmt = n => n != null ? new Intl.NumberFormat("en-AE").format(Math.round(n)) : "—";
const COLORS = ["#e83f25", "#3b82f6", "#22c55e"];
const getLabel = a => (a.alias || a.name || "").replace(/_/g, " ").trim() || a.name || "—";

export default function CompareAreas() {
  const [selected, setSelected] = useState(["", "", ""]);
  const { rows, loading } = useTransactionData();
  const areaData = useMemo(() => {
    if (loading) return null;
    return deriveAreaDataFromRows(rows, {}).areaDataByCommNum;
  }, [rows, loading]);

  const areasList = useMemo(() => {
    if (!areaData) return [];
    const areasListRaw = Object.entries(areaData).map(([key, d]) => d && typeof d === "object" ? {
      key,
      ...d
    } : null).filter(Boolean).filter(a => a.sale_apartment != null || (a._txCount || 0) > 0).sort((a, b) => (getLabel(a) || "").localeCompare(getLabel(b) || ""));
    const seenNames = new Set();
    return areasListRaw.filter(a => {
      const label = getLabel(a);
      if (seenNames.has(label)) return false;
      seenNames.add(label);
      return true;
    });
  }, [areaData]);

  const selectedAreas = selected.filter(Boolean).map(key => areasList.find(a => a.key === key)).filter(Boolean);
  const chartData = selectedAreas.map(a => ({
    name: getLabel(a).length > 18 ? getLabel(a).slice(0, 16) + "…" : getLabel(a),
    fullName: getLabel(a),
    sale_apartment: a.sale_apartment ?? 0,
    sale_villa: a.sale_villa ?? 0,
    transactions: a._txCount ?? 0
  }));
  const handleSelect = (slot, value) => {
    setSelected(prev => {
      const next = [...prev];
      next[slot] = value;
      return next;
    });
  };

  return <section className="relative bg-[#f8fafc] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#e83f25] font-bold text-sm uppercase tracking-wide mb-3" style={{
          fontFamily: "var(--font-body)"
        }}>
            Start with a community
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-4" style={{
          fontFamily: "var(--font-display)"
        }}>
            Choose areas that match your preference
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed" style={{
          fontFamily: "var(--font-body)"
        }}>
            Pick up to three Dubai communities and compare apartment prices and how active each market is — then decide where you want to invest.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
          {loading || !areaData ? <p className="text-center text-gray-400 py-16" style={{
          fontFamily: "var(--font-body)"
        }}>
              Loading community data…
            </p> : <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[0, 1, 2].map(slot => <div key={slot}>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2" style={{
                fontFamily: "var(--font-body)"
              }}>
                      <MapPin size={14} className="text-[#e83f25]" />
                      Preference {slot + 1}
                    </label>
                    <select value={selected[slot]} onChange={e => handleSelect(slot, e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e83f25]/20 focus:border-[#e83f25]" style={{
                  fontFamily: "var(--font-body)"
                }}>
                      <option value="">Select a community…</option>
                      {areasList.map(a => <option key={a.key} value={a.key}>
                          {getLabel(a)}
                        </option>)}
                    </select>
                  </div>)}
              </div>

              {selectedAreas.length === 0 ? <div className="border border-dashed border-gray-200 rounded-2xl py-14 px-6 text-center">
                  <p className="text-gray-500" style={{
              fontFamily: "var(--font-body)"
            }}>
                    Select a community above to see prices and activity side by side.
                  </p>
                </div> : <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {selectedAreas.map((a, i) => <div key={`compare-${i}-${a.key}`} className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-5" style={{
                borderLeft: `4px solid ${COLORS[i] ?? "#94a3b8"}`
              }}>
                        <p className="font-bold text-black mb-4" style={{
                  fontFamily: "var(--font-body)"
                }}>
                          {getLabel(a)}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">Apartments</span>
                          <span className="ml-auto font-bold text-black">{fmt(a.sale_apartment)} AED/sqft</span>
                        </div>
                        {a.sale_villa != null && <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500 pl-[22px]">Villas</span>
                            <span className="ml-auto font-bold text-black">{fmt(a.sale_villa)} AED/sqft</span>
                          </div>}
                        <div className="flex items-center gap-2">
                          <BarChart3 size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">Deals recorded</span>
                          <span className="ml-auto font-bold text-[#0369a1]">{fmt(a._txCount)}</span>
                        </div>
                      </div>)}
                  </div>

                  {chartData.length > 0 && <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3" style={{
                fontFamily: "var(--font-body)"
              }}>
                        Apartment sale price (AED/sqft)
                      </p>
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{
                      top: 8,
                      right: 16,
                      left: 8,
                      bottom: 8
                    }}>
                            <XAxis dataKey="name" tick={{
                        fontSize: 11,
                        fill: "#64748b"
                      }} axisLine={false} tickLine={false} />
                            <YAxis tick={{
                        fontSize: 10,
                        fill: "#94a3b8"
                      }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
                            <Tooltip formatter={v => `${fmt(v)} AED/sqft`} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""} contentStyle={{
                        fontFamily: "var(--font-body)",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb"
                      }} />
                            <Bar dataKey="sale_apartment" radius={[4, 4, 0, 0]}>
                              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i] ?? "#94a3b8"} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>}
                </>}

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <Link to="/market-insights" className="inline-flex items-center gap-2 text-sm font-semibold text-[#e83f25] hover:underline" style={{
              fontFamily: "var(--font-body)"
            }}>
                  See full market insights
                  <ArrowRight size={16} />
                </Link>
              </div>
            </>}
        </div>
      </div>
    </section>;
}
