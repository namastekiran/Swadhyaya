"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  Moon,
  Wind,
  Dumbbell,
  Brain,
  Orbit,
  Users,
  Target,
  BookOpen,
  Zap,
  Leaf,
  Sun,
  Heart,
  Eye,
  Sparkles,
  Compass,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { TopicData, SectionStatus } from "@/lib/types";

function getSectionIcon(theme: string) {
  const t = theme.toLowerCase();
  if (t.includes("meditation") || t.includes("dhyana") || t.includes("sleep")) return Moon;
  if (t.includes("breath") || t.includes("pranayama") || t.includes("wind")) return Wind;
  if (t.includes("body") || t.includes("asana") || t.includes("posture") || t.includes("physical")) return Dumbbell;
  if (t.includes("mind") || t.includes("thought") || t.includes("brain") || t.includes("conscious")) return Brain;
  if (t.includes("action") || t.includes("karma") || t.includes("path")) return Orbit;
  if (t.includes("moral") || t.includes("yama") || t.includes("niyama") || t.includes("people") || t.includes("discipline")) return Users;
  if (t.includes("focus") || t.includes("dharana") || t.includes("target") || t.includes("concentration")) return Target;
  if (t.includes("knowledge") || t.includes("study") || t.includes("book") || t.includes("learning")) return BookOpen;
  if (t.includes("effort") || t.includes("tapas") || t.includes("intensity") || t.includes("fire") || t.includes("energy")) return Zap;
  if (t.includes("attachment") || t.includes("letting go") || t.includes("vairagya") || t.includes("nature") || t.includes("leaf")) return Leaf;
  if (t.includes("joy") || t.includes("happy") || t.includes("bliss") || t.includes("light") || t.includes("sun")) return Sun;
  if (t.includes("heart") || t.includes("love") || t.includes("compassion") || t.includes("feeling")) return Heart;
  if (t.includes("vision") || t.includes("seeing") || t.includes("insight") || t.includes("eye")) return Eye;
  if (t.includes("spirit") || t.includes("spark") || t.includes("divine")) return Sparkles;
  return Compass;
}

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
  const Icon = getSectionIcon(theme);

  const content = (
    <div className="flex items-start gap-6">
      {/* Left timeline */}
      <div className="flex flex-col items-center flex-shrink-0 mt-1">
        <div
          className={`w-4 h-4 rounded-full transition-all duration-500 ${
            isDone
              ? "bg-emerald-500"
              : isCurrent
                ? "bg-white border-2 border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                : "bg-white border-2 border-gray-200"
          }`}
        />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[80px] my-1 rounded-full ${
              isDone ? "bg-emerald-500" : "bg-gray-200 border-l-2 border-dashed border-gray-100"
            }`}
          />
        )}
      </div>

      {/* Right content card */}
      <div className="flex-1 pb-10">
        <div
          className={`group relative rounded-[28px] p-5 bg-white transition-all duration-300 ${
            isLocked 
              ? "opacity-60 border border-gray-100/50" 
              : "shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Icon circle */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isDone
                  ? "bg-emerald-50 text-emerald-500"
                  : isCurrent
                    ? "bg-purple-50 text-purple-600"
                    : "bg-gray-50 text-gray-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${isLocked ? "opacity-30" : ""}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                {isCurrent && (
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full tracking-wider uppercase">
                    CURRENT
                  </span>
                )}
                {isDone && (
                  <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">
                    COMPLETED
                  </span>
                )}
              </div>
              <h3 className={`text-base font-bold leading-tight ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                {theme}
              </h3>
              {!isLocked && (
                <p className="text-xs text-gray-500 mt-1.5 font-medium group-hover:text-purple-500 transition-colors">
                  {isDone ? "Review session →" : "Continue journey →"}
                </p>
              )}
            </div>

            {!isLocked && (
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
            )}
          </div>
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
  const [mounted, setMounted] = useState(false);
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const progress = getTopicProgress(topic.id);

  const completedCount = progress.completedSections.length;
  const isComplete = completedCount >= topic.totalSections;
  const progressPercent =
    topic.totalSections > 0
      ? (completedCount / topic.totalSections) * 100
      : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            {topic.tagline}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Your Progress</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isComplete 
                ? "Journey complete! Well done." 
                : `${topic.totalSections - completedCount} sessions remaining`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-purple-600">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
        <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="pl-1">
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
