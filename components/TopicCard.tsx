"use client";

import { useState, useEffect } from "react";
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
  Zap,
  Leaf,
  Orbit,
  Users,
  User,
  Accessibility,
  EyeOff,
  Target,
  Moon,
  CloudRain,
  Sun,
  Dumbbell
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
  zap: Zap,
  leaf: Leaf,
  orbit: Orbit,
  users: Users,
  user: User,
  accessibility: Accessibility,
  "eye-off": EyeOff,
  target: Target,
  moon: Moon,
  "cloud-rain": CloudRain,
  sun: Sun,
  dumbbell: Dumbbell,
};

const CARD_STYLES: Record<string, { bg: string; iconBg: string; accent: string }> = {
  flame: { bg: "bg-gradient-to-br from-rose-50 to-pink-50", iconBg: "bg-rose-100 text-rose-400", accent: "bg-rose-200" },
  repeat: { bg: "bg-gradient-to-br from-blue-50 to-sky-50", iconBg: "bg-blue-100 text-blue-400", accent: "bg-blue-200" },
  brain: { bg: "bg-gradient-to-br from-violet-50 to-purple-50", iconBg: "bg-violet-100 text-violet-400", accent: "bg-violet-200" },
  wind: { bg: "bg-gradient-to-br from-teal-50 to-emerald-50", iconBg: "bg-teal-100 text-teal-400", accent: "bg-teal-200" },
  "book-open": { bg: "bg-gradient-to-br from-amber-50 to-yellow-50", iconBg: "bg-amber-100 text-amber-400", accent: "bg-amber-200" },
  heart: { bg: "bg-gradient-to-br from-pink-50 to-rose-50", iconBg: "bg-pink-100 text-pink-400", accent: "bg-pink-200" },
  eye: { bg: "bg-gradient-to-br from-indigo-50 to-blue-50", iconBg: "bg-indigo-100 text-indigo-400", accent: "bg-indigo-200" },
  lotus: { bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50", iconBg: "bg-fuchsia-100 text-fuchsia-400", accent: "bg-fuchsia-200" },
  zap: { bg: "bg-gradient-to-br from-orange-50 to-amber-50", iconBg: "bg-orange-100 text-orange-400", accent: "bg-orange-200" },
  leaf: { bg: "bg-gradient-to-br from-lime-50 to-green-50", iconBg: "bg-lime-100 text-lime-400", accent: "bg-lime-200" },
  orbit: { bg: "bg-gradient-to-br from-slate-50 to-gray-50", iconBg: "bg-slate-200 text-slate-500", accent: "bg-slate-300" },
  users: { bg: "bg-gradient-to-br from-cyan-50 to-blue-50", iconBg: "bg-cyan-100 text-cyan-400", accent: "bg-cyan-200" },
  user: { bg: "bg-gradient-to-br from-sky-50 to-indigo-50", iconBg: "bg-sky-100 text-sky-400", accent: "bg-sky-200" },
  accessibility: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", iconBg: "bg-emerald-100 text-emerald-400", accent: "bg-emerald-200" },
  "eye-off": { bg: "bg-gradient-to-br from-gray-50 to-zinc-50", iconBg: "bg-gray-200 text-gray-500", accent: "bg-gray-300" },
  target: { bg: "bg-gradient-to-br from-red-50 to-rose-50", iconBg: "bg-red-100 text-red-400", accent: "bg-red-200" },
  moon: { bg: "bg-gradient-to-br from-indigo-50 to-violet-50", iconBg: "bg-indigo-100 text-indigo-400", accent: "bg-indigo-200" },
  "cloud-rain": { bg: "bg-gradient-to-br from-slate-50 to-zinc-50", iconBg: "bg-slate-200 text-slate-500", accent: "bg-slate-300" },
  sun: { bg: "bg-gradient-to-br from-yellow-50 to-amber-50", iconBg: "bg-yellow-100 text-yellow-400", accent: "bg-yellow-200" },
  dumbbell: { bg: "bg-gradient-to-br from-stone-50 to-neutral-50", iconBg: "bg-stone-200 text-stone-500", accent: "bg-stone-300" },
};

export function TopicCard({ topic }: { topic: TopicSummary }) {
  const [mounted, setMounted] = useState(false);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = mounted ? getTopicProgress(topic.id) : { completedSections: [] };

  const Icon = ICON_MAP[topic.icon] ?? Flame;
  const style = CARD_STYLES[topic.icon] ?? CARD_STYLES.flame;

  const hasStarted = progress.completedSections.length > 0;
  const isComplete = progress.completedSections.length >= topic.totalSections;
  const progressPercent =
    topic.totalSections > 0
      ? (progress.completedSections.length / topic.totalSections) * 100
      : 0;

  return (
    <Link href={`/topic/${topic.id}`} className="block h-full">
      <div
        className={`relative h-full overflow-hidden rounded-3xl p-5 ${style.bg} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex flex-col items-center justify-center`}
      >
        {/* Decorative blob */}
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${style.accent} opacity-30`}
        />

        <div className="relative flex flex-col items-center justify-center w-full min-h-[110px] gap-3">
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${style.iconBg}`}
          >
            <Icon className="w-7 h-7" />
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-1">
            <h3 className="font-bold text-foreground text-[13px] leading-tight text-center">
              {topic.title}
            </h3>

            {hasStarted && !isComplete && (
              <div className="w-12 h-1 bg-white/60 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${style.accent}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            {isComplete && (
              <span className="text-[10px] font-bold text-green-600 mt-2">
                COMPLETE
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
