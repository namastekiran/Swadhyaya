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
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (!profile) {
    return <Onboarding />;
  }

  const firstName = profile.name.split(" ")[0];

  return (
    <div className="space-y-12">
      <header className="space-y-3 pt-6 px-1">
        <h1 className="text-[38px] font-light text-orange-900 tracking-tight">
          Choose Your Journey
        </h1>
        <p className="text-[17px] text-orange-400/90 font-medium leading-relaxed">
          Select a topic to begin your practice with Patanjali&apos;s wisdom
        </p>
      </header>

      <div className="space-y-6">
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
