import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { EMIRA_SECRET } from "./emiraFormatters";

/**
 * EmiraAuth — login overlay with 5-digit PIN entry.
 * Owns: codeChars, loginError, inputRefs.
 * Handles 72-hr auto-login check on mount.
 * Props: isAuthenticated, login, isLoggingOutRef
 */
export default function EmiraAuth({ isAuthenticated, login, isLoggingOutRef }) {
  const [codeChars, setCodeChars]   = useState(["", "", "", "", ""]);
  const [loginError, setLoginError] = useState("");
  const inputRefs = useRef([]);

  /* ── 72-hour auto-login ── */
  useEffect(() => {
    const savedTimestamp = localStorage.getItem("emira_auth_timestamp");
    if (savedTimestamp) {
      const elapsed  = Date.now() - parseInt(savedTimestamp, 10);
      const hours72  = 72 * 60 * 60 * 1000;
      if (elapsed < hours72) {
        login();
      } else {
        localStorage.removeItem("emira_auth_timestamp");
      }
    }
  }, []);

  const handleDigitChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...codeChars];
    next[index] = val;
    setCodeChars(next);
    if (val && index < 4) inputRefs.current[index + 1]?.focus();
    if (!val && index > 0) inputRefs.current[index - 1]?.focus();
    const full = next.join("");
    if (full.length === 5) {
      if (full === EMIRA_SECRET) {
        login();
        localStorage.setItem("emira_auth_timestamp", Date.now().toString());
        setLoginError("");
      } else {
        setLoginError("Invalid access code");
        setTimeout(() => setCodeChars(["", "", "", "", ""]), 600);
        setTimeout(() => inputRefs.current[0]?.focus(), 650);
      }
    } else {
      setLoginError("");
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeChars[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  return (
    <AnimatePresence>
      {!isAuthenticated && !isLoggingOutRef.current && (
        <>
          {/* frosted backdrop */}
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(247,247,247,0.6)",
            backdropFilter: "blur(8px) saturate(0.7)",
            zIndex: 98,
          }} />

          {/* modal */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
          >
            <div style={{
              width: "100%", maxWidth: 400,
              background: "#fff",
              border: "1.5px solid #e0e0e0",
              padding: "0 0 44px",
              position: "relative",
              boxShadow: "0 32px 80px rgba(0,0,0,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            }}>
              {/* red top bar */}
              <div style={{ height: 4, background: "#e83f25" }} />

              <div style={{ padding: "44px 44px 0" }}>
                {/* logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                  <div style={{ fontFamily: "Fields Display, sans-serif", fontSize: 52, fontWeight: 700, color: "#000", lineHeight: 1, letterSpacing: "0.02em" }}>
                    EMIRA<span style={{ color: "#e83f25" }}>.</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
                    <div style={{ height: 1, width: 28, background: "#ebebeb" }} />
                    <span className="e-label">Internal Intelligence Tool</span>
                    <div style={{ height: 1, width: 28, background: "#ebebeb" }} />
                  </div>
                </div>

                <div className="e-label" style={{ textAlign: "center", marginBottom: 18 }}>5-Digit Access Code</div>

                {/* digit inputs */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                  {codeChars.map((char, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="digit"
                    />
                  ))}
                </div>

                {/* error */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: "#fff8f7", border: "1px solid #fad0c9",
                        padding: "10px 16px", marginBottom: 8,
                      }}
                    >
                      <AlertCircle size={13} style={{ color: "#e83f25" }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#e83f25", letterSpacing: "0.06em" }}>
                        {loginError}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p style={{ textAlign: "center", fontSize: 10, color: "#ccc", letterSpacing: "0.05em", marginTop: 20 }}>
                  Auto-submits on 5th digit
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
