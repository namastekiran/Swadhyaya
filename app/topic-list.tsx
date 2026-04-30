"use client";

import { TopicCard } from "@/components/TopicCard";
import type { TopicSummary } from "@/lib/types";

export function TopicList({
  topics,
  activeCategory,
}: {
  topics: TopicSummary[];
  activeCategory: string;
}) {
  const filteredTopics = topics.filter((topic) => {
    const id = topic.id.toLowerCase();
    if (activeCategory === "All journeys") return true;
    
    if (activeCategory === "I procrastinate") {
      return ["discipline", "tapas", "intensity", "practice"].some(key => id.includes(key));
    }
    if (activeCategory === "I feel anxious") {
      return ["stress", "pranayama", "concentration", "mind"].some(key => id.includes(key));
    }
    if (activeCategory === "My mind won't settle") {
      return ["concentration", "mind", "dharana", "meditation"].some(key => id.includes(key));
    }
    if (activeCategory === "I feel lost") {
      return ["knowledge", "spirit", "samadhi", "yoga"].some(key => id.includes(key));
    }
    if (activeCategory === "I lose my temper") {
      return ["detachment", "mind", "consciousness", "yamas"].some(key => id.includes(key));
    }
    if (activeCategory === "I can't stay consistent") {
      return ["discipline", "tapas", "practice", "consistency"].some(key => id.includes(key));
    }
    if (activeCategory === "I lack purpose") {
      return ["knowledge", "spirit", "yoga", "purpose"].some(key => id.includes(key));
    }
    if (activeCategory === "My ego gets in the way") {
      return ["detachment", "consciousness", "self-discipline"].some(key => id.includes(key));
    }
    return true;
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      {filteredTopics.map((topic, i) => (
        <TopicCard key={topic.id} topic={topic} index={i} />
      ))}
    </div>
  );
}
