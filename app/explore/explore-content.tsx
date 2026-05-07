"use client";

export function ExploreContent() {
  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>
        <div style={{ background: "linear-gradient(160deg,#d8ccf0 0%,#ecdff8 100%)", padding: "24px 20px 20px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#3d2f5e", marginBottom: 2 }}>Explore</h1>
          <p style={{ fontSize: 13, color: "#7a6898" }}>Discover new ways to grow</p>
        </div>
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
          <p style={{ fontSize: 18, fontWeight: 500, color: "#3d2f5e", marginBottom: 8 }}>Coming Soon</p>
          <p style={{ fontSize: 13, color: "#7a6898", lineHeight: 1.6 }}>
            We&apos;re crafting something meaningful here — curated collections, guided programmes, and deeper explorations await.
          </p>
        </div>
      </div>
    </div>
  );
}
