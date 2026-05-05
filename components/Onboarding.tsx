"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

const BG_IMAGE = "/zen-stones.jpg";
const BLEND_COLOR = "#3d2468";

export function Onboarding() {
  const setProfile = useAppStore((s) => s.setProfile);
  const [name, setName] = useState("");

  function handleStart() {
    if (!name.trim()) return;
    setProfile(name.trim(), "");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: BLEND_COLOR }}>

      {/* Top — image fading into BLEND_COLOR at the bottom */}
      <div style={{ height: "52vh", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, rgba(61,36,104,0.05) 0%, rgba(61,36,104,0.0) 30%, rgba(61,36,104,0.70) 80%, ${BLEND_COLOR} 100%)`,
        }} />
        <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center" }}>
          <h1 style={{ fontSize: 46, fontWeight: 700, color: "#fff", fontFamily: "serif", textShadow: "0 2px 16px rgba(0,0,0,0.35)", lineHeight: 1.1, marginBottom: 6 }}>
            Swadhyaya
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", letterSpacing: "0.12em", fontStyle: "italic", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            Journey Within
          </p>
        </div>
      </div>

      {/* Bottom — starts at exactly BLEND_COLOR, same as image fade endpoint */}
      <div style={{
        flex: 1, position: "relative", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "28px 28px 48px", overflow: "hidden",
        background: `linear-gradient(170deg, ${BLEND_COLOR} 0%, #4a2d7a 40%, #3a2060 100%)`,
      }}>
        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.12, mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 1.7, marginBottom: 24 }}>
            A guided journey through Patanjali&apos;s Yoga Sutras — reflection, practice &amp; deep insights by Gurudev Sri Sri Ravi Shankar, one sutra at a time.
          </p>

          <p style={{ fontSize: 17, fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: 6 }}>
            How should we greet you?
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
            Ancient wisdom unfolds as a personal conversation. Tell us your name to begin.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Your first name"
            autoFocus
            style={{
              width: "100%", background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.22)",
              borderRadius: 18, padding: "15px 20px", fontSize: 16, fontWeight: 500, textAlign: "center",
              color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            style={{
              width: "100%", height: 54, fontSize: 16, fontWeight: 700, borderRadius: 18, border: "none",
              background: name.trim() ? "linear-gradient(135deg, #a389d4, #7c4fc4)" : "rgba(255,255,255,0.12)",
              color: name.trim() ? "#fff" : "rgba(255,255,255,0.35)",
              cursor: name.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s",
            }}
          >
            <span>Start Your Journey</span>
            <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
