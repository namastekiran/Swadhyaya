"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame, Repeat, Brain, Wind, BookOpen, Heart, Eye, Flower2,
  Zap, Leaf, Orbit, Users, User, Accessibility, EyeOff,
  Target, Moon, CloudRain, Sun, Dumbbell, ArrowRight, Check
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  flame: Flame, repeat: Repeat, brain: Brain, wind: Wind,
  "book-open": BookOpen, heart: Heart, eye: Eye, lotus: Flower2,
  zap: Zap, leaf: Leaf, orbit: Orbit, users: Users, user: User,
  accessibility: Accessibility, "eye-off": EyeOff, target: Target,
  moon: Moon, "cloud-rain": CloudRain, sun: Sun, dumbbell: Dumbbell,
};

// Color per icon — matches the palette used across step screens
const ICON_STYLES: Record<string, { icon: string; bg: string }> = {
  flame:         { icon: "#c87060", bg: "#fde8e4" }, // rose-red — discipline/fire
  zap:           { icon: "#c48450", bg: "#fde8c8" }, // amber — intensity/energy
  repeat:        { icon: "#4a7860", bg: "#e0f0e8" }, // sage — practice/repetition
  leaf:          { icon: "#5a8850", bg: "#e4f0e0" }, // green — growth/nature
  moon:          { icon: "#5a6aa0", bg: "#e4e8f8" }, // indigo — meditation/samadhi
  "book-open":   { icon: "#a07030", bg: "#f8ecd8" }, // gold — knowledge/study
  accessibility: { icon: "#4a8878", bg: "#e0f0ec" }, // teal — asana/body
  wind:          { icon: "#5a7aa0", bg: "#e6eef8" }, // sky blue — pranayama/breath
  "eye-off":     { icon: "#7a6898", bg: "#ede8f8" }, // muted purple — pratyahara
  target:        { icon: "#6858a8", bg: "#eae8f8" }, // deep purple — dharana/focus
  brain:         { icon: "#9060b0", bg: "#f0e8f8" }, // violet — consciousness/mind
  heart:         { icon: "#c07080", bg: "#f8e8ec" }, // rose — attachment/niyama
  orbit:         { icon: "#b87840", bg: "#fdecd8" }, // warm amber — karma/cycles
  "cloud-rain":  { icon: "#5888a0", bg: "#e4eef8" }, // blue-grey — suffering/rain
  eye:           { icon: "#7870b8", bg: "#eceaf8" }, // lavender — samyama/awareness
  lotus:         { icon: "#b06888", bg: "#f5e4ec" }, // mauve — yoga/lotus
  users:         { icon: "#4a8060", bg: "#e4f0e8" }, // sage — yama/social
  user:          { icon: "#6878b0", bg: "#e8ecf8" }, // periwinkle — self
  sun:           { icon: "#c09040", bg: "#f8f0d8" }, // golden — radiance
  dumbbell:      { icon: "#7870a0", bg: "#eeecf8" }, // muted purple — strength
};

const FALLBACK_STYLE = { icon: "#a389d4", bg: "#ede8f8" };

export function TopicCard({ topic, index }: { topic: TopicSummary; index: number }) {
  const [mounted, setMounted] = useState(false);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);

  useEffect(() => { setMounted(true); }, []);

  const progress = mounted ? getTopicProgress(topic.id) : { completedSections: [] };
  const Icon = ICON_MAP[topic.icon] ?? Flame;
  const { icon: iconColor, bg: iconBg } = ICON_STYLES[topic.icon] ?? FALLBACK_STYLE;

  const hasStarted = progress.completedSections.length > 0;
  const isComplete = progress.completedSections.length >= topic.totalSections;
  const progressPercent = topic.totalSections > 0
    ? (progress.completedSections.length / topic.totalSections) * 100
    : 0;

  return (
    <Link href={`/topic/${topic.id}`} className="block h-full">
      <div style={{
        position: "relative",
        height: "100%",
        minHeight: 138,
        borderRadius: 18,
        padding: "13px 13px 11px",
        background: "#fff",
        border: "1px solid #e0d8f0",
        boxShadow: "0 2px 8px rgba(120,80,200,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        overflow: "hidden",
      }}>

        {/* Icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon style={{ width: 16, height: 16, color: iconColor }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#2e1f5e", lineHeight: 1.3, marginBottom: 3 }}>
            {topic.title}
          </h3>
          <p style={{ fontSize: 10, color: "#7a6898", lineHeight: 1.5, flex: 1 }}>
            {topic.tagline}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: 7,
          borderTop: "1px solid #ede8f8",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#a389d4", letterSpacing: "0.06em" }}>
            {topic.totalSections} SESSIONS
          </span>
          {isComplete && (
            <div style={{ width: 15, height: 15, borderRadius: "50%", background: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check style={{ width: 8, height: 8, color: "#fff" }} />
            </div>
          )}
          {!isComplete && hasStarted && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 3, background: iconBg }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 3, background: iconColor }} />
              </div>
            </div>
          )}
          {!isComplete && !hasStarted && (
            <ArrowRight style={{ width: 11, height: 11, color: "#c8b8e8" }} />
          )}
        </div>
      </div>
    </Link>
  );
}
