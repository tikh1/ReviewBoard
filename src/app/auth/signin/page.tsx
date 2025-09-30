"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <main
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100svh",
        padding: "2rem",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          display: "grid",
          gap: "0.75rem",
          background: "white",
          padding: "2rem",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            ReviewBoard
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, marginTop: "0.5rem" }}>
            Devam etmek için giriş yapın
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          style={{
            marginTop: "0.5rem",
            padding: "0.875rem 1.25rem",
            background: "#fff",
            color: "#3c4043",
            borderRadius: 8,
            border: "1px solid #dadce0",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(60,64,67,0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"/>
            <path fill="#FBBC05" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"/>
          </svg>
          Google ile devam et
        </button>

        <button
          onClick={() => signIn("github", { callbackUrl })}
          style={{
            padding: "0.875rem 1.25rem",
            background: "#24292e",
            color: "#fff",
            borderRadius: 8,
            border: "1px solid #1b1f23",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#2f363d";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#24292e";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub ile devam et
        </button>

        <p style={{ 
          textAlign: "center", 
          fontSize: 13, 
          color: "#9ca3af", 
          marginTop: "1rem" 
        }}>
          Giriş yaparak{" "}
          <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Hizmet Şartları
          </a>{" "}
          ve{" "}
          <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Gizlilik Politikası
          </a>
          nı kabul etmiş olursunuz.
        </p>
      </div>
    </main>
  );
}