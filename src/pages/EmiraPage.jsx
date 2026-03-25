import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useEmiraStore }        from "../store/emiraStore";
import { useCsvData }           from "../hooks/useCsvData";
import { performEmiraAnalysis } from "../hooks/useEmiraMutations";

import {
  ANALYSIS_BUTTONS,
  PROCESSING_MSGS,
  getRequestCount,
  incrementRequestCount,
  buildMarketContext,
} from "../features/emira/emiraFormatters";
import EmiraAuth       from "../features/emira/EmiraAuth";
import EmiraHistory    from "../features/emira/EmiraHistory";
import EmiraControls   from "../features/emira/EmiraControls";
import EmiraResultCard from "../features/emira/EmiraResultCard";

/* ─────────────────────────────────────────── component */

export default function EmiraPage() {
  const navigate = useNavigate();

  const {
    isAuthenticated, login, logout,
    analysisResult, isStreaming, isComplete, error: streamError,
    activeAnalysis, lastAnalysisTime,
    appendAnalysisResult, setIsStreaming, setIsComplete,
    setError, setActiveAnalysis, setLastAnalysisTime, resetAnalysis,
  } = useEmiraStore();

  const [selectedArea,      setSelectedArea]      = useState("");
  const [additionalContext, setAdditionalContext]  = useState("");
  const [history,           setHistory]            = useState([]);
  const [selectedHistoryId, setSelectedHistoryId]  = useState(null);
  const [historyLoading,    setHistoryLoading]     = useState(false);
  const [confirmDeleteId,   setConfirmDeleteId]    = useState(null);
  const [processingMsgIdx,  setProcessingMsgIdx]   = useState(0);
  const [requestCount,      setRequestCount]       = useState(() => getRequestCount());
  const [historyMobileOpen, setHistoryMobileOpen]  = useState(false);

  const abortControllerRef = useRef(null);
  const isLoggingOutRef    = useRef(false);
  const resultEndRef       = useRef(null);

  const { stats, loading: csvLoading } = useCsvData();

  /* ── history ── */
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/internal/history`, { headers: { "X-Internal-Key": import.meta.env.VITE_EMIRA_SECRET || '49352' } });
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Failed to fetch history:", err); }
    finally { setHistoryLoading(false); }
  };

  const loadHistoryItem = async (id) => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/internal/history/${id}`, { headers: { "X-Internal-Key": import.meta.env.VITE_EMIRA_SECRET || '49352'} });
      const data = await res.json();
      if (data?.responseText) {
        useEmiraStore.getState().setAnalysisResult(data.responseText);
        setActiveAnalysis(data.analysisType);
        setSelectedArea(data.area || "");
        setIsComplete(true);
        setSelectedHistoryId(id);
      }
    } catch (err) { console.error("Failed to load history item:", err); }
  };

  const deleteHistoryItem = async (e, id) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try { await fetch(`${import.meta.env.VITE_BACKEND_API}/api/internal/history/${id}`, { method: "DELETE", headers: { "X-Internal-Key": import.meta.env.VITE_EMIRA_SECRET || '49352' } }); }
    catch (err) { console.error("Failed to delete history item:", err); }
  };

  useEffect(() => { if (isAuthenticated) fetchHistory(); }, [isAuthenticated]);
  useEffect(() => { resultEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [analysisResult]);

  /* ── rotating processing messages ── */
  useEffect(() => {
    if (!isStreaming) return;
    setProcessingMsgIdx(0);
    const id = setInterval(() => setProcessingMsgIdx((i) => (i + 1) % PROCESSING_MSGS.length), 2000);
    return () => clearInterval(id);
  }, [isStreaming]);

  /* ── analysis ── */
  const startAnalysis = async (typeId) => {
    if (isStreaming) abortControllerRef.current?.abort();
    setRequestCount(incrementRequestCount());
    resetAnalysis();
    setSelectedHistoryId(null);
    setIsStreaming(true);
    setActiveAnalysis(typeId);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await performEmiraAnalysis({
        payload: { area: selectedArea, analysisType: typeId, marketContext: buildMarketContext(stats, selectedArea), additionalContext },
        signal: controller.signal,
      });
      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setIsComplete(true);
        setLastAnalysisTime(new Date());
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("event:error") || line.includes("event: error")) { setError("Emira is temporarily unavailable. Please try again."); return; }
          if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try { const p = JSON.parse(data); if (p.content) appendAnalysisResult(p.content + " "); }
            catch { appendAnalysisResult(data + " "); }
          }
        }
      }
    } catch (err) { if (err.name !== "AbortError") setError(err.message || "An error occurred."); }
    finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      toast.success("Report saved — click it in History to see the formatted result.", {
        duration: 7000,
        style: { fontFamily: "Raleway, sans-serif", fontSize: 13, fontWeight: 600 },
      });
    }
  };

  const stopAnalysis = () => { abortControllerRef.current?.abort(); setIsStreaming(false); };

  const handleLogout = () => {
    isLoggingOutRef.current = true;
    logout();
    localStorage.removeItem("emira_auth_timestamp");
    resetAnalysis();
    navigate("/");
  };

  const activeBtn = ANALYSIS_BUTTONS.find((b) => b.id === activeAnalysis);

  /* ══════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');

        .emira-root *, .emira-root *::before, .emira-root *::after { box-sizing: border-box; }
        .emira-root { min-height: 100vh; background: #f7f7f7; font-family: 'Raleway', sans-serif; color: #000; }

        .e-label { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #939393; font-family: 'Raleway', sans-serif; }

        .ab { width: 100%; background: #fff; border: none; border-bottom: 1px solid #f0f0f0; padding: 16px 24px; cursor: pointer; display: flex; align-items: center; gap: 16px; font-family: 'Raleway', sans-serif; text-align: left; position: relative; overflow: hidden; }
        .ab::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #e83f25; transform: scaleY(0); transform-origin: bottom; transition: transform 0.22s ease; }
        .ab:hover { background: #fafafa; }
        .ab:hover::after { transform: scaleY(1); }
        .ab.ab-active { background: #fff9f8; }
        .ab.ab-active::after { transform: scaleY(1); }
        .ab:disabled { opacity: 0.35; cursor: not-allowed; background: #fff; pointer-events: none; }
        .ab:disabled::after { transform: scaleY(0); }

        .digit { width: 46px; height: 60px; background: #fff; border: 1.5px solid #e5e5e5; color: #000; font-size: 24px; font-family: 'Fields Display', 'Raleway', sans-serif; font-weight: 700; text-align: center; outline: none; transition: border-color 0.18s, box-shadow 0.18s; border-radius: 0; caret-color: #e83f25; }
        .digit:focus { border-color: #e83f25; box-shadow: 0 0 0 3px rgba(232,63,37,0.1); }

        .e-select { width: 100%; background: #fff; border: 1.5px solid #ebebeb; color: #000; font-size: 12px; font-family: 'Raleway', sans-serif; font-weight: 600; padding: 12px 40px 12px 14px; outline: none; appearance: none; cursor: pointer; border-radius: 0; }
        .e-select:focus { border-color: #e83f25; }
        .e-textarea { width: 100%; background: #fff; border: 1.5px solid #ebebeb; color: #000; font-size: 12px; font-family: 'Raleway', sans-serif; font-weight: 500; padding: 12px 14px; outline: none; resize: none; border-radius: 0; line-height: 1.6; }
        .e-textarea:focus { border-color: #e83f25; }

        .r-scroll::-webkit-scrollbar { width: 4px; }
        .r-scroll::-webkit-scrollbar-track { background: transparent; }
        .r-scroll::-webkit-scrollbar-thumb { background: #ebebeb; border-radius: 2px; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes blink   { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake   { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }

        .spin     { animation: spin 0.9s linear infinite; }
        .blink    { animation: blink 1.4s ease-in-out infinite; }
        .fade-up  { animation: fadeUp 0.4s ease both; }
        .shake    { animation: shake 0.5s ease; }

        .logout-btn:hover { border-color: #e83f25 !important; color: #e83f25 !important; }
        .history-entry .delete-btn { opacity: 0; transition: opacity 0.15s; }
        .history-entry:hover .delete-btn { opacity: 1; }
        .history-entry:hover { background: #fafafa !important; }
        .delete-btn:hover { color: #e83f25 !important; }

        /* ── Responsive layout ── */
        .emira-header { padding: 0 40px; }
        .emira-header-left { gap: 20px; }
        .emira-header-right { gap: 20px; }
        .emira-request-counter { display: flex; align-items: center; gap: 10px; }
        .emira-logout-label { display: inline; }
        .emira-main { padding-top: 100px; padding-bottom: 60px; padding-left: 40px; padding-right: 40px; }
        .emira-flex-outer { display: flex; gap: 24px; align-items: flex-start; }
        .emira-inner-grid { display: grid; grid-template-columns: 300px 1fr; gap: 24px; min-height: 680px; }

        /* tablet: 600–900px */
        @media (max-width: 900px) {
          .emira-header { padding: 0 20px; }
          .emira-header-left { gap: 12px; }
          .emira-header-right { gap: 10px; }
          .emira-request-counter { gap: 6px; }
          .emira-main { padding-top: 84px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px; }
          .emira-flex-outer { flex-direction: column; }
          .emira-inner-grid { grid-template-columns: 1fr; min-height: auto; }
        }

        /* mobile: <480px */
        @media (max-width: 480px) {
          .emira-header { padding: 0 14px; height: 56px !important; }
          .emira-header-left h1 { font-size: 18px !important; }
          .emira-request-counter { display: none; }
          .emira-logout-label { display: none; }
          .emira-main { padding-top: 72px; padding-left: 14px; padding-right: 14px; padding-bottom: 30px; }
          .digit { width: 40px !important; height: 52px !important; font-size: 20px !important; }
        }
      `}</style>

      <div className="emira-root">

        {/* PAGE (blurred when unauthed) */}
        <div style={{ filter: !isAuthenticated ? "blur(4px) brightness(0.85)" : "none", transition: "filter 0.4s ease", pointerEvents: !isAuthenticated ? "none" : "auto", userSelect: !isAuthenticated ? "none" : "auto" }}>

          {/* HEADER */}
          <header className="emira-header" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#fff", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#e83f25" }} />
            <div className="emira-header-left" style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ fontFamily: "Fields Display, sans-serif", fontSize: 24, fontWeight: 700, color: "#000", letterSpacing: "0.02em", lineHeight: 1 }}>
                EMIRA<span style={{ color: "#e83f25" }}>.</span>
              </h1>
              <div style={{ width: 1, height: 18, background: "#ebebeb", margin: "0 12px" }} />
              <span className="e-label">AI Market Analyst v1.0</span>
            </div>

            <div className="emira-header-right" style={{ display: "flex", alignItems: "center" }}>
              {/* daily request counter */}
              <div className="emira-request-counter">
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#ebebeb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke={requestCount >= 10 ? "#ef4444" : "#e83f25"} strokeWidth="3" strokeDasharray={`${Math.min(requestCount, 10) / 10 * 87.96} 87.96`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                  <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="800" fill={requestCount >= 10 ? "#ef4444" : "#000"} fontFamily="Raleway, sans-serif">{Math.min(requestCount, 10)}</text>
                </svg>
                <div>
                  <div className="e-label" style={{ marginBottom: 2 }}>Today</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: requestCount >= 10 ? "#ef4444" : "#000" }}>{Math.max(0, 10 - requestCount)}/10 left</div>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1.5px solid #ebebeb", color: "#939393", padding: "8px 14px", fontFamily: "Raleway, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.18s", borderRadius: 0 }}>
                <LogOut size={13} /> <span className="emira-logout-label">Terminate</span>
              </button>
            </div>
          </header>

          {/* MAIN */}
          <main className="emira-main" style={{ maxWidth: 1600, margin: "0 auto" }}>
            <div className="emira-flex-outer">

              <EmiraHistory
                history={history}
                historyLoading={historyLoading}
                selectedHistoryId={selectedHistoryId}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                loadHistoryItem={loadHistoryItem}
                deleteHistoryItem={deleteHistoryItem}
                fetchHistory={fetchHistory}
                isMobileOpen={historyMobileOpen}
                setMobileOpen={setHistoryMobileOpen}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* page title */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 3, background: "#e83f25" }} />
                      <span className="e-label" style={{ color: "#e83f25" }}>Dubai Real Estate</span>
                    </div>
                    <h2 style={{ fontFamily: "Fields Display, sans-serif", fontSize: "clamp(28px, 4.5vw, 64px)", fontWeight: 700, color: "#000", lineHeight: 0.9, letterSpacing: "-0.025em" }}>
                      Market<br /><span style={{ color: "#e83f25" }}>Intelligence.</span>
                    </h2>
                  </div>
                  {lastAnalysisTime && (
                    <div style={{ textAlign: "right" }}>
                      <div className="e-label" style={{ marginBottom: 6 }}>Last Transmission</div>
                      <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 24, fontWeight: 700, color: "#000" }}>
                        {lastAnalysisTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  )}
                </div>

                {/* inner grid: controls | results */}
                <div className="emira-inner-grid">

                  <EmiraControls
                    selectedArea={selectedArea}
                    setSelectedArea={setSelectedArea}
                    additionalContext={additionalContext}
                    setAdditionalContext={setAdditionalContext}
                    stats={stats}
                    csvLoading={csvLoading}
                    requestCount={requestCount}
                    isStreaming={isStreaming}
                    isComplete={isComplete}
                    activeAnalysis={activeAnalysis}
                    startAnalysis={startAnalysis}
                    stopAnalysis={stopAnalysis}
                  />

                  <div style={{ minHeight: "auto" }}>
                    <AnimatePresence mode="wait">
                      <EmiraResultCard
                        key={activeAnalysis || "empty"}
                        analysisResult={analysisResult}
                        isComplete={isComplete}
                        activeAnalysis={activeAnalysis}
                        selectedArea={selectedArea}
                        stats={stats}
                        isStreaming={isStreaming}
                        streamError={streamError}
                        processingMsgIdx={processingMsgIdx}
                        resultEndRef={resultEndRef}
                        activeBtn={activeBtn}
                        lastAnalysisTime={lastAnalysisTime}
                      />
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </div>
          </main>
        </div>

        {/* AUTH OVERLAY */}
        <EmiraAuth
          isAuthenticated={isAuthenticated}
          login={login}
          isLoggingOutRef={isLoggingOutRef}
        />

      </div>
    </>
  );
}