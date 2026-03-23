import React from "react";
import { Trash2, X, RefreshCcw } from "lucide-react";
import { TYPE_LABELS, formatDate } from "./emiraFormatters";

export default function EmiraHistory({
  history,
  historyLoading,
  selectedHistoryId,
  confirmDeleteId,
  setConfirmDeleteId,
  loadHistoryItem,
  deleteHistoryItem,
  fetchHistory,
}) {
  return (
    <div style={{
      width: 240,
      flexShrink: 0,
      background: "#fff",
      border: "1.5px solid #ebebeb",
      display: "flex",
      flexDirection: "column",
      height: 780,
      overflow: "hidden",
      position: "sticky",
      top: 100,
    }}>
      {/* red top stripe */}
      <div style={{ height: 3, background: "#e83f25", flexShrink: 0 }} />

      {/* header row */}
      <div style={{
        padding: "13px 16px",
        borderBottom: "1px solid #ebebeb",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <span className="e-label">History</span>
        <button onClick={fetchHistory} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: "#939393", padding: 4, display: "flex", alignItems: "center",
        }}>
          <RefreshCcw size={12} className={historyLoading ? "spin" : ""} />
        </button>
      </div>

      {/* list */}
      <div className="r-scroll" style={{ flex: 1, overflowY: "auto" }}>
        {history.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", fontSize: 11, color: "#ccc", lineHeight: 1.6 }}>
            No analyses yet
          </div>
        ) : (
          history.map((item) => {
            const isSel = selectedHistoryId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item.id)}
                className="history-entry"
                style={{
                  padding: "14px 16px",
                  paddingLeft: isSel ? 13 : 16,
                  borderBottom: "1px solid #f5f5f5",
                  borderLeft: isSel ? "3px solid #e83f25" : "3px solid transparent",
                  cursor: "pointer",
                  position: "relative",
                  background: isSel ? "#fff9f8" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: "#000", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.area || "General Dubai"}
                </div>
                <div style={{ fontSize: 10, color: "#939393", marginBottom: 3 }}>
                  {TYPE_LABELS[item.analysisType] || item.analysisType}
                </div>
                <div style={{ fontSize: 10, color: "#ccc" }}>
                  {formatDate(item.createdAt)}
                </div>

                {confirmDeleteId === item.id ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#e83f25", letterSpacing: "0.08em", textTransform: "uppercase" }}>Sure?</span>
                    <button
                      onClick={(e) => { deleteHistoryItem(e, item.id); setConfirmDeleteId(null); }}
                      style={{ background: "#e83f25", border: "none", cursor: "pointer", color: "#fff", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, borderRadius: 2 }}
                    >
                      <X size={10} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{ background: "#f0f0f0", border: "none", cursor: "pointer", color: "#939393", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, borderRadius: 2 }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.id); }}
                    style={{
                      position: "absolute", top: 10, right: 10,
                      background: "transparent", border: "none",
                      cursor: "pointer", color: "#ccc",
                      display: "flex", alignItems: "center", padding: 0,
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
