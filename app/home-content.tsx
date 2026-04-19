"use client";

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
  const profile = useAppStore((s) => s.profile);

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
              {getGreeting()},
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

      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
          Choose a topic
        </h2>
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
