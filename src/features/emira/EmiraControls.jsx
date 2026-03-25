import React from "react";
import { ChevronDown, Play, Square, CheckCircle2 } from "lucide-react";
import { ANALYSIS_BUTTONS } from "./emiraFormatters";

/**
 * EmiraControls — area selector + context textarea + analysis engine buttons.
 */
export default function EmiraControls({
  selectedArea,
  setSelectedArea,
  additionalContext,
  setAdditionalContext,
  stats,
  csvLoading,
  requestCount,
  isStreaming,
  isComplete,
  activeAnalysis,
  startAnalysis,
  stopAnalysis,
}) {
  const isLimitReached = requestCount >= 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* focus area + context row: side by side on tablet */}
      <div className="emira-controls-top">
        {/* focus area */}
        <div style={{ flex: 1 }}>
          <div className="e-label" style={{ marginBottom: 8 }}>Focus Area</div>
          <div style={{ position: "relative" }}>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="e-select"
              disabled={csvLoading}
            >
              <option value="">All Dubai Market</option>
              {stats?.uniqueAreas?.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#939393", pointerEvents: "none" }} />
          </div>
        </div>

        {/* additional context */}
        <div style={{ flex: 1 }}>
          <div className="e-label" style={{ marginBottom: 8 }}>Additional Context</div>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Property details, price points, investment goals..."
            rows={4}
            className="e-textarea"
          />
        </div>
      </div>

      {/* analysis engine */}
      <div style={{ flex: 1, border: "1.5px solid #ebebeb", background: "#fff", overflow: "hidden" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, background: "#e83f25", borderRadius: "50%" }} />
          <span className="e-label">Analysis Engine</span>
        </div>

        <div className="emira-btn-grid">
          {ANALYSIS_BUTTONS.map((btn) => {
            const isActive   = activeAnalysis === btn.id;
            const isBusy     = isStreaming && isActive;
            const isDisabled = (isStreaming && !isActive) || (isLimitReached && !isBusy);
            return (
              <button
                key={btn.id}
                onClick={() => isBusy ? stopAnalysis() : startAnalysis(btn.id)}
                disabled={isDisabled}
                className={`ab ${isActive ? "ab-active" : ""}`}
              >
                <div style={{
                  width: 38, height: 38, flexShrink: 0,
                  background: isActive ? "#e83f25" : "#f7f7f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isActive ? "#fff" : "#939393",
                  transition: "all 0.18s",
                }}>
                  {isBusy
                    ? <Square size={14} fill="currentColor" style={{ color: "#fff" }} />
                    : <btn.Icon size={15} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#000", letterSpacing: "0.01em" }}>{btn.label}</div>
                  <div style={{ fontSize: 10, color: "#939393", marginTop: 2, fontWeight: 500 }}>{btn.sub}</div>
                </div>
                {isBusy     && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#e83f25" }} className="blink" />}
                {isActive   && !isBusy && isComplete && <CheckCircle2 size={14} style={{ color: "#e83f25" }} />}
                {!isActive  && !isBusy && <Play size={12} fill="currentColor" style={{ color: "#ddd" }} />}
              </button>
            );
          })}
        </div>

        {isLimitReached && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid #ebebeb", background: "#fff8f7", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", letterSpacing: "0.06em" }}>
              Daily limit reached. Resets at midnight.
            </span>
          </div>
        )}
      </div>

      <style>{`
        .emira-controls-top {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .emira-btn-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) and (max-width: 900px) {
          .emira-controls-top {
            flex-direction: row;
            align-items: flex-start;
          }
          .emira-btn-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
