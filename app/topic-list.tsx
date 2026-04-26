"use client";

import { TopicCard } from "@/components/TopicCard";
import type { TopicSummary } from "@/lib/types";

export function TopicList({ topics }: { topics: TopicSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
