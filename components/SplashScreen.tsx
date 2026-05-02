"use client";

import { useEffect, useState } from "react";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1571766700642-7b5e4e007a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
    />
  );
}

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Start title pulse after a short delay
    const pulseTimer = setTimeout(() => setPulse(true), 300);
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  function handleTap() {
    setFading(true);
    setTimeout(onDone, 500);
  }

  return (
    <div
      onClick={handleTap}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        cursor: "pointer",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        background: "#1a0a2e",
      }}
    >
      {/* Background image */}
      <ImageWithFallback src={BG_IMAGE} alt="Swadhyaya" />

      {/* Purple gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(170deg, rgba(88,28,135,0.40) 0%, rgba(88,28,135,0.30) 50%, rgba(88,28,135,0.50) 100%)",
        }}
      />

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
