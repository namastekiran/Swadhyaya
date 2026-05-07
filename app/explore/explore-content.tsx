"use client";

import { useState } from "react";
import { TopicList } from "@/app/topic-list";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES } from "@/lib/images";
import type { TopicSummary } from "@/lib/types";

const categories = [
  "All journeys",
  "I procrastinate",
  "I feel anxious",
  "My mind won't settle",
  "I feel lost",
  "I lose my temper",
  "I can't stay consistent",
  "I lack purpose",
  "My ego gets in the way",
];

export function ExploreContent({ topics }: { topics: TopicSummary[] }) {
  const [category, setCategory] = useState("All journeys");

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>
        <ImageHeader
          imageUrl={IMAGES.home[0]}
          overlay="linear-gradient(160deg,rgba(60,30,110,0.45) 0%,rgba(40,18,80,0.82) 100%)"
          height={160}
          padding="24px 22px 20px"
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginBottom: 4 }}>Find what resonates</p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>Explore</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: category === cat ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.20)",
                  color: category === cat ? "#5a3aaa" : "rgba(255,255,255,0.85)",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </ImageHeader>
        <div style={{ padding: "18px 14px 24px" }}>
          <TopicList topics={topics} activeCategory={category} />
        </div>
      </div>
    </div>
  );
}
