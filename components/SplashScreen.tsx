"use client";

import { useEffect, useRef, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    const pulseTimer = setTimeout(() => setPulse(true), 300);
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(() => onDoneRef.current(), 2800);
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        background: "#1a0a2e",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/splash.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(60,30,10,0.30) 0%, rgba(20,10,40,0.55) 100%)" }} />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 12,
            fontFamily: "serif",
            textShadow: "0 2px 16px rgba(0,0,0,0.45)",
            animation: pulse ? "swadhyaya-pulse 2s ease-in-out infinite" : "none",
          }}
        >
          Swadhyaya
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.12em",
            fontStyle: "italic",
            textShadow: "0 1px 10px rgba(0,0,0,0.4)",
          }}
        >
          Journey Within
        </p>
      </div>

      <style>{`
        @keyframes swadhyaya-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}
