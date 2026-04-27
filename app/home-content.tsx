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
  const [greeting, setGreeting] = useState("");
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (!profile) {
    return <Onboarding />;
  }

  const firstName = profile.name.split(" ")[0];

  return (
    <div className="space-y-10">
      <header className="space-y-5 pt-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-sm">
            <Flower2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {greeting},
            </p>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {firstName}
            </h1>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 p-5">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {profile.intention
              ? `Your intention: "${profile.intention}"`
              : "Reflect, practice, and grow — one small step at a time."}
          </p>
        </div>
      </header>

      {/* The Swadhyaya Method */}
      <section className="bg-orange-50/50 rounded-[32px] p-8 space-y-6 border border-orange-100/50">
        <h2 className="text-[20px] font-bold text-orange-900 tracking-tight">
          The Swadhyaya Method
        </h2>
        <ul className="space-y-4">
          {[
            "Daily contemplation of authentic Patanjali sutras",
            "Guided audio meditations (coming soon)",
            "Deep reflection questions for self-inquiry",
            "Daily micro-practices to integrate wisdom",
            "Personal journaling for insights"
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <p className="text-[14px] text-gray-600 font-medium leading-snug">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
          Choose Your Journey
        </h2>
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
