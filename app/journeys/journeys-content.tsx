"use client";

import { TopicList } from "@/app/topic-list";
import type { TopicSummary } from "@/lib/types";

export function JourneysContent({ topics }: { topics: TopicSummary[] }) {
  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>
        <div style={{ background: "linear-gradient(160deg,#d8ccf0 0%,#ecdff8 100%)", padding: "28px 22px 24px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#3d2f5e", lineHeight: 1.2 }}>Your Journeys</h1>
          <p style={{ fontSize: 13, color: "#7a6898", marginTop: 4 }}>All paths available to explore</p>
        </div>
        <div style={{ padding: "18px 14px 24px" }}>
          <TopicList topics={topics} activeCategory="All journeys" />
        </div>
      </div>
    </div>
  );
}
