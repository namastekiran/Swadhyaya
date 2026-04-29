"use client";

import { useState, useEffect } from "react";
import { Flower2 } from "lucide-react";
import { TopicList } from "./topic-list";
import { Onboarding } from "@/components/Onboarding";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function HomeContent({ topics }: { topics: TopicSummary[] }) {
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState("All paths");
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!profile) {
    return <Onboarding />;
  }

  const categories = [
    "All journeys",
    "I procrastinate",
    "I feel anxious",
    "My mind won't settle",
    "I feel lost",
    "I lose my temper",
    "I can't stay consistent",
    "I lack purpose",
    "My ego gets in the way"
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Emotional Header - Original Style */}
      <header className="text-center space-y-4 pt-12">
        <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-[0.2em] px-1">
          SWADHYAYA — SELF STUDY
        </p>
        <h1 className="text-5xl font-serif text-gray-900 leading-tight">
          What&apos;s weighing on you?
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Filter by what you&apos;re going through — we&apos;ll show the right path
        </p>
      </header>

      {/* Emotional Filters - Original Style */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
              category === cat
                ? "bg-purple-600 text-white shadow-md shadow-purple-100"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic List */}
      <div className="px-1">
        <TopicList topics={topics} activeCategory={category} />
      </div>
    </div>
  );
}
