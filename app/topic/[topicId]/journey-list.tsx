"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { useAppStore } from "@/lib/store";
import type { TopicData } from "@/lib/types";

export function JourneyList({ topic }: { topic: TopicData }) {
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  const progress = getTopicProgress(topic.id);

  const completedCount = progress.completedSections.length;
  const isComplete = completedCount >= topic.totalSections;
  const progressPercent =
    topic.totalSections > 0
      ? (completedCount / topic.totalSections) * 100
      : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{topic.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isComplete
              ? "Journey complete!"
              : `Section ${Math.min(progress.currentSection, topic.totalSections)} of ${topic.totalSections}`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Progress
          </span>
          <span className="text-xs font-semibold text-foreground">
            {completedCount}/{topic.totalSections}
          </span>
        </div>
        <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-200 to-pink-200 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Section heading */}
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
        My Journey
      </h2>

      {/* Sections */}
      <div className="space-y-2">
        {topic.sections.map((section) => (
          <SectionCard
            key={section.section}
            topicId={topic.id}
            section={section}
            status={getSectionStatus(topic.id, section.section)}
          />
        ))}
      </div>
    </div>
  );
}
