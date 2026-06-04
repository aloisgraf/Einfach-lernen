"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "./actions";

function LoginForm() {
  const params = useSearchParams();
  const rawFrom = params.get("from") ?? "";
  const from =
    rawFrom.startsWith("/admin/") && !rawFrom.startsWith("/admin/login")
      ? rawFrom
      : "/admin/dashboard";

  const [state, action, pending] = useActionState(loginAction, null);
  const [showPw, setShowPw] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font-raleway), sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#1a5c4a", margin: "0 0 4px" }}>Einfach Lernen</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Admin-Bereich · Pongau</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8eceb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>Anmelden</h2>

          {state?.error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
              {state.error}
            </div>
          )}

          <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="hidden" name="from" value={from} />

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>E-Mail</label>
              <input
                type="email"
                name="email"
                required
                autoFocus
                style={inputStyle}
                placeholder="admin@beispiel.at"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Passwort</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}
                >
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              style={{
                background: pending ? "#9ca3af" : "#1a5c4a",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                fontSize: 14,
                fontWeight: 700,
                cursor: pending ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              {pending ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Wird überprüft…</> : "Einloggen"}
            </button>
          </form>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
