"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { TopicData, SectionStatus } from "@/lib/types";

function SectionRow({
  topicId,
  sectionNum,
  theme,
  status,
  isLast,
}: {
  topicId: string;
  sectionNum: number;
  theme: string;
  status: SectionStatus;
  isLast: boolean;
}) {
  const isDone = status === "done";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  const content = (
    <div className="flex items-start gap-4">
      {/* Left timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDone
              ? "bg-green-100"
              : isCurrent
                ? "bg-purple-100 ring-4 ring-purple-50"
                : "bg-gray-50"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : isCurrent ? (
            <Play className="w-4 h-4 text-purple-500 ml-0.5" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-gray-300" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[24px] mt-1 rounded-full ${
              isDone ? "bg-green-200" : "bg-gray-100"
            }`}
          />
        )}
      </div>

      {/* Right content */}
      <div
        className={`flex-1 pb-4 ${
          isCurrent ? "" : isLocked ? "opacity-45" : ""
        }`}
      >
        <div
          className={`rounded-2xl p-4 transition-all ${
            isCurrent
              ? "bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm"
              : isDone
                ? "bg-white/80"
                : "bg-white/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <span
                className={`text-[11px] font-bold uppercase tracking-widest ${
                  isCurrent
                    ? "text-purple-500"
                    : isDone
                      ? "text-green-500"
                      : "text-gray-300"
                }`}
              >
                Section {sectionNum}
              </span>
              <h3
                className={`text-sm font-semibold mt-0.5 ${
                  isLocked ? "text-muted-foreground/50" : "text-foreground"
                }`}
              >
                {theme}
              </h3>
            </div>

            {!isLocked && (
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 ml-2 ${
                  isCurrent ? "text-purple-400" : "text-muted-foreground/30"
                }`}
              />
            )}
          </div>

          {isCurrent && (
            <p className="text-xs text-purple-500 mt-2 font-medium">
              Continue your journey →
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <button
        onClick={() => toast.info("Complete the previous section first")}
        className="w-full text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/topic/${topicId}/section/${sectionNum}`}>{content}</Link>
  );
}

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
            {topic.tagline}
          </p>
        </div>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest">
            {isComplete ? "Journey Complete" : "Your Progress"}
          </span>
          <span className="text-sm font-bold text-foreground">
            {completedCount}/{topic.totalSections}
          </span>
        </div>
        <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-300 to-pink-300 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {!isComplete && (
          <p className="text-xs text-muted-foreground mt-2">
            {topic.totalSections - completedCount} sections remaining
          </p>
        )}
      </div>

      {/* Timeline */}
      <div>
        {topic.sections.map((section, i) => (
          <SectionRow
            key={section.section}
            topicId={topic.id}
            sectionNum={section.section}
            theme={section.theme}
            status={getSectionStatus(topic.id, section.section)}
            isLast={i === topic.sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
