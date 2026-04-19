"use client";

import Link from "next/link";
import {
  Flame,
  Repeat,
  Brain,
  Wind,
  BookOpen,
  Heart,
  Eye,
  Flower2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  flame: Flame,
  repeat: Repeat,
  brain: Brain,
  wind: Wind,
  "book-open": BookOpen,
  heart: Heart,
  eye: Eye,
  lotus: Flower2,
};

const CARD_STYLES: Record<string, { bg: string; iconBg: string; accent: string }> = {
  flame: {
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    iconBg: "bg-rose-100 text-rose-400",
    accent: "bg-rose-200",
  },
  repeat: {
    bg: "bg-gradient-to-br from-blue-50 to-sky-50",
    iconBg: "bg-blue-100 text-blue-400",
    accent: "bg-blue-200",
  },
  brain: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
    iconBg: "bg-violet-100 text-violet-400",
    accent: "bg-violet-200",
  },
  wind: {
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100 text-teal-400",
    accent: "bg-teal-200",
  },
  "book-open": {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100 text-amber-400",
    accent: "bg-amber-200",
  },
  heart: {
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    iconBg: "bg-pink-100 text-pink-400",
    accent: "bg-pink-200",
  },
  eye: {
    bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100 text-indigo-400",
    accent: "bg-indigo-200",
  },
  lotus: {
    bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50",
    iconBg: "bg-fuchsia-100 text-fuchsia-400",
    accent: "bg-fuchsia-200",
  },
};

export function TopicCard({ topic }: { topic: TopicSummary }) {
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  const progress = getTopicProgress(topic.id);

  const Icon = ICON_MAP[topic.icon] ?? Flame;
  const style = CARD_STYLES[topic.icon] ?? CARD_STYLES.flame;

  const hasStarted = progress.completedSections.length > 0;
  const isComplete = progress.completedSections.length >= topic.totalSections;
  const progressPercent =
    topic.totalSections > 0
      ? (progress.completedSections.length / topic.totalSections) * 100
      : 0;

  return (
    <Link href={`/topic/${topic.id}`} className="block">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 ${style.bg} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md`}
      >
        {/* Decorative blob */}
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${style.accent} opacity-30`}
        />
        <div
          className={`absolute -bottom-4 -right-2 w-16 h-16 rounded-full ${style.accent} opacity-20`}
        />

        <div className="relative flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-13 h-13 rounded-2xl flex items-center justify-center ${style.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-lg leading-tight">
              {topic.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-snug">
              {topic.tagline}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${style.accent}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {hasStarted
                  ? isComplete
                    ? "Complete"
                    : `${progress.completedSections.length}/${topic.totalSections}`
                  : `${topic.totalSections} sections`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
