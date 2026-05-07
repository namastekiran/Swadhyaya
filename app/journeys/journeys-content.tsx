"use client";

import { TopicList } from "@/app/topic-list";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES } from "@/lib/images";
import type { TopicSummary } from "@/lib/types";

export function JourneysContent({ topics }: { topics: TopicSummary[] }) {
  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>
        <ImageHeader
          imageUrl={IMAGES.home[0]}
          overlay="linear-gradient(160deg,rgba(60,30,110,0.45) 0%,rgba(40,18,80,0.82) 100%)"
          height={120}
          padding="24px 22px 20px"
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginBottom: 4 }}>All journeys</p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.2 }}>Your Journeys</h1>
        </ImageHeader>
        <div style={{ padding: "18px 14px 24px" }}>
          <TopicList topics={topics} activeCategory="All journeys" />
        </div>
      </div>
    </div>
  );
}
