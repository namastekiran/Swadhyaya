"use client";

import { useState, useEffect } from "react";
import { TopicList } from "./topic-list";
import { ReturningHome } from "./returning-home";
import { Onboarding } from "@/components/Onboarding";
import { SplashScreen } from "@/components/SplashScreen";
import { ImageHeader } from "@/components/ImageHeader";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";
import { IMAGES } from "@/lib/images";

export function HomeContent({ topics }: { topics: TopicSummary[] }) {
  const [mounted, setMounted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [category, setCategory] = useState("All journeys");
  const profile = useAppStore((s) => s.profile);
  const topicsProgress = useAppStore((s) => s.topics);
  const answers = useAppStore((s) => s.answers);

  useEffect(() => { setMounted(true); }, []);

  const hasJourney = Object.keys(topicsProgress).length > 0 || Object.keys(answers).length > 0;

  if (!mounted) return null;
  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;
  if (!profile) return <Onboarding />;
  if (hasJourney && !showAll) return <ReturningHome topics={topics} onViewAll={() => setShowAll(true)} />;

  const firstName = profile.name.split(" ")[0];

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

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader
          imageUrl={IMAGES.home[0]}
          overlay="linear-gradient(160deg,rgba(60,30,110,0.45) 0%,rgba(40,18,80,0.82) 100%)"
          height={160}
          padding="24px 22px 20px"
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginBottom: 4 }}>Namaste, {firstName} 🙏</p>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Choose your journey
          </h1>
          {/* Filter pills */}
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

        {/* Topic grid */}
        <div style={{ padding: "18px 14px 24px" }}>
          <TopicList topics={topics} activeCategory={category} />
        </div>

      </div>
    </div>
  );
}
