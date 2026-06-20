"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, background: "#0a0a0f", color: "#f3f3f6", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#9b9bab", margin: "0 0 20px" }}>Please reload the page to try again.</p>
          <button
            onClick={() => reset()}
            style={{ background: "#6366f1", color: "#fff", border: 0, borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
