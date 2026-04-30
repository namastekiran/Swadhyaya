"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function calcStreak(answers: Record<string, { updatedAt?: string }>): number {
  const dates = new Set<string>();
  for (const val of Object.values(answers)) {
    if (val.updatedAt) dates.add(val.updatedAt.slice(0, 10));
  }
  if (dates.size === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dates.has(d.toISOString().slice(0, 10))) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function findLastActive(
  topicsProgress: Record<string, { currentSection: number; completedSections: number[] }>,
  answers: Record<string, { updatedAt?: string }>,
  topics: TopicSummary[]
): { topicId: string; section: number } | null {
  let latestDate = "";
  let latestTopicId = "";
  for (const [key, val] of Object.entries(answers)) {
    if (val.updatedAt && val.updatedAt > latestDate) {
      latestDate = val.updatedAt;
      latestTopicId = key.split("::")[0];
    }
  }
  if (latestTopicId && topicsProgress[latestTopicId]) {
    return { topicId: latestTopicId, section: topicsProgress[latestTopicId].currentSection };
  }
  for (const topic of topics) {
    const p = topicsProgress[topic.id];
    if (p && (p.completedSections.length > 0 || p.currentSection > 1)) {
      return { topicId: topic.id, section: p.currentSection };
    }
  }
  return null;
}

interface Props {
  topics: TopicSummary[];
  onViewAll: () => void;
}

export function ReturningHome({ topics, onViewAll }: Props) {
  const profile = useAppStore((s) => s.profile);
  const topicsProgress = useAppStore((s) => s.topics);
  const answers = useAppStore((s) => s.answers);

  const [sectionTheme, setSectionTheme] = useState("");
  const [sutraNumber, setSutraNumber] = useState("");

  const firstName = profile?.name.split(" ")[0] ?? "";
  const initial = firstName[0]?.toUpperCase() ?? "?";

  const streak = calcStreak(answers);
  const totalSections = topics.reduce((sum, t) => sum + t.totalSections, 0);
  const completedSections = Object.values(topicsProgress).reduce((sum, p) => sum + p.completedSections.length, 0);
  const progressPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  const lastActive = findLastActive(topicsProgress, answers, topics);
  const lastActiveTopic = lastActive ? topics.find((t) => t.id === lastActive.topicId) : null;
  const topicCompleted = lastActive ? (topicsProgress[lastActive.topicId]?.completedSections.length ?? 0) : 0;
  const topicTotal = lastActiveTopic?.totalSections ?? 0;

  useEffect(() => {
    if (!lastActive) return;
    fetch(`/api/topics/${lastActive.topicId}`)
      .then((r) => r.json())
      .then((data) => {
        const sec = data.sections?.find((s: { section: number }) => s.section === lastActive.section);
        if (sec) {
          setSectionTheme(sec.theme);
          setSutraNumber(sec.sutra?.number ?? "");
        }
      })
      .catch(() => {});
  }, [lastActive?.topicId, lastActive?.section]);

  return (
    <div className="pb-20 -mx-6">
      <div
        className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]"
        style={{ background: "#fff" }}
      >
        {/* Lavender gradient header */}
        <div style={{ background: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)", padding: "28px 22px 24px" }}>
          {/* Greeting row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ fontSize: 12, color: "#b0a0c8", marginBottom: 4 }}>
                {getGreeting()} 🙏
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 500, color: "#3d2f5e", lineHeight: 1.2 }}>
                Hello, {firstName}
              </h1>
            </div>
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8e0f5" }}
            >
              <span style={{ fontSize: 17, fontWeight: 500, color: "#7c5cbf" }}>{initial}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: String(streak), label: "day streak 🔥" },
              { value: `${progressPct}%`, label: "progress" },
              { value: `${topicCompleted}/${topicTotal}`, label: "sessions" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="text-center"
                style={{ background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "10px 8px" }}
              >
                <div style={{ fontSize: 18, fontWeight: 500, color: "#7c5cbf" }}>{value}</div>
                <div style={{ fontSize: 9, color: "#b0a0c8", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 26px", background: "#fdfcff" }}>

          {/* Resume journey card */}
          {lastActive && lastActiveTopic ? (
            <div
              style={{
                background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)",
                borderRadius: 18,
                padding: "18px 18px 16px",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.07em", marginBottom: 6 }}>
                {lastActiveTopic.title.toUpperCase()} · SESSION {lastActive.section}
              </p>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>
                {sectionTheme || "Loading…"}
              </h2>
              {sutraNumber && (
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>
                  Sutra {sutraNumber.replace(/,\s*/g, " · ")}
                </p>
              )}

              {/* Progress bar */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 14 }}>
                <div
                  style={{
                    width: `${topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0}%`,
                    height: "100%",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: 4,
                  }}
                />
              </div>

              <Link
                href={`/topic/${lastActive.topicId}/section/${lastActive.section}`}
                className="flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 14px" }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Resume journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>
          ) : (
            <div
              style={{
                background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)",
                borderRadius: 18,
                padding: "18px 18px 16px",
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>
                You haven&apos;t started a journey yet.
              </p>
              <button
                onClick={onViewAll}
                style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 500, color: "#fff" }}
              >
                Explore journeys →
              </button>
            </div>
          )}

          {/* View all */}
          <button
            onClick={onViewAll}
            className="w-full flex items-center justify-center gap-2"
            style={{ border: "1.5px solid #e0d5f5", borderRadius: 12, padding: "11px 16px" }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7c5cbf" }}>View all journeys</span>
            <ArrowRight style={{ width: 13, height: 13, color: "#7c5cbf" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
