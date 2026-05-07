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
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  // Start from today if active today, otherwise give grace and start from yesterday
  const startFrom = dates.has(todayStr) ? today : dates.has(yesterdayStr) ? yesterday : null;
  if (!startFrom) return 0;
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(startFrom);
    d.setDate(d.getDate() - i);
    if (dates.has(d.toISOString().slice(0, 10))) streak++;
    else break;
  }
  return streak;
}

function lastActivityForTopic(topicId: string, answers: Record<string, { updatedAt?: string }>): string {
  let latest = "";
  for (const [key, val] of Object.entries(answers)) {
    if (key.startsWith(`${topicId}::`) && val.updatedAt && val.updatedAt > latest) {
      latest = val.updatedAt;
    }
  }
  return latest;
}

const CARD_GRADIENTS = [
  "linear-gradient(135deg,#6a4aaa 0%,#9a78d0 100%)",  // deep lavender
  "linear-gradient(135deg,#3a6e78 0%,#5aA0aa 100%)",  // muted teal
  "linear-gradient(135deg,#7a4a88 0%,#aa78b8 100%)",  // plum
  "linear-gradient(135deg,#4a5a98 0%,#7888c8 100%)",  // periwinkle
  "linear-gradient(135deg,#885878 0%,#b888a8 100%)",  // mauve
  "linear-gradient(135deg,#4a7868 0%,#78a898 100%)",  // sage
];

interface ActiveJourney {
  topic: TopicSummary;
  currentSection: number;
  completed: number;
  total: number;
  lastActivity: string;
}

interface Props {
  topics: TopicSummary[];
}

export function ReturningHome({ topics }: Props) {
  const profile = useAppStore((s) => s.profile);
  const topicsProgress = useAppStore((s) => s.topics);
  const answers = useAppStore((s) => s.answers);

  const [greeting, setGreeting] = useState("");

  const firstName = profile?.name.split(" ")[0] ?? "";
  const initial = firstName[0]?.toUpperCase() ?? "?";

  const streak = calcStreak(answers);
  const startedTopics = topics.filter((t) =>
    Object.keys(answers).some((k) => k.startsWith(`${t.id}::`)) ||
    (topicsProgress[t.id] && topicsProgress[t.id].completedSections.length > 0)
  );
  const totalSections = startedTopics.reduce((sum, t) => sum + t.totalSections, 0);
  const completedSections = Object.values(topicsProgress).reduce((sum, p) => sum + p.completedSections.length, 0);
  const progressPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  // All topics the user has touched (any answers or any completed section), not yet fully done
  const activeJourneys: ActiveJourney[] = topics
    .filter((t) => {
      const p = topicsProgress[t.id];
      const hasAnswers = Object.keys(answers).some((key) => key.startsWith(`${t.id}::`));
      const hasStarted = hasAnswers || (p && p.completedSections.length > 0);
      const notFinished = !p || p.completedSections.length < t.totalSections;
      return hasStarted && notFinished;
    })
    .map((t) => ({
      topic: t,
      currentSection: topicsProgress[t.id]?.currentSection ?? 1,
      completed: topicsProgress[t.id]?.completedSections.length ?? 0,
      total: t.totalSections,
      lastActivity: lastActivityForTopic(t.id, answers),
    }))
    .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));

  // Completed journeys
  const completedJourneys = topics.filter((t) => {
    const p = topicsProgress[t.id];
    return p && p.completedSections.length >= t.totalSections;
  });

  useEffect(() => { setGreeting(getGreeting()); }, []);

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(160deg,#d8ccf0 0%,#ecdff8 100%)", padding: "28px 22px 24px" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ fontSize: 12, color: "#7a6898", marginBottom: 4 }}>{greeting} 🙏</p>
              <h1 style={{ fontSize: 22, fontWeight: 500, color: "#3d2f5e", lineHeight: 1.2 }}>Namaste, {firstName}</h1>
            </div>
            <div className="flex items-center justify-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8e0f5" }}>
              <span style={{ fontSize: 17, fontWeight: 500, color: "#7c5cbf" }}>{initial}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: String(streak), label: "day streak 🔥", color: "#d4600a" },
              { value: `${progressPct}%`, label: "progress", color: "#6030c0" },
              { value: String(activeJourneys.length), label: "journeys", color: "#1a8a60" },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center"
                style={{ background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "10px 8px" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 11, color: "#5a4878", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 26px" }}>

          {activeJourneys.length > 0 ? (
            <>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#9a88b8", letterSpacing: "0.10em", marginBottom: 12 }}>
                ONGOING JOURNEYS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {activeJourneys.map((j, idx) => (
                  <div key={j.topic.id}
                    style={{ background: CARD_GRADIENTS[idx % CARD_GRADIENTS.length], borderRadius: 18, padding: "16px 18px" }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.07em", marginBottom: 3 }}>
                          SESSION {j.currentSection} OF {j.total}
                        </p>
                        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {j.topic.title}
                        </h2>
                      </div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginLeft: 10, flexShrink: 0 }}>
                        {j.completed}/{j.total}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 12 }}>
                      <div style={{
                        width: `${Math.round((j.completed / j.total) * 100)}%`,
                        height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 4,
                      }} />
                    </div>

                    <Link href={`/topic/${j.topic.id}/section/${j.currentSection}`}
                      className="flex items-center justify-between"
                      style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 14px" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Resume</span>
                      <ArrowRight style={{ width: 13, height: 13, color: "#fff" }} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)", borderRadius: 18, padding: "18px 18px 16px", marginBottom: 14, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>
                {completedJourneys.length > 0 ? "All your journeys are complete 🎉" : "You haven't started a journey yet."}
              </p>
              <Link href="/journeys"
                style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 500, color: "#fff", textDecoration: "none" }}>
                Explore journeys →
              </Link>
            </div>
          )}

          {completedJourneys.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#9a88b8", letterSpacing: "0.10em", marginBottom: 10 }}>
                COMPLETED
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {completedJourneys.map((t) => (
                  <Link key={t.id} href={`/topic/${t.id}`}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: "#ede8f8", borderRadius: 20, padding: "5px 12px", textDecoration: "none" }}>
                    <span style={{ fontSize: 12, color: "#6a5888" }}>✓</span>
                    <span style={{ fontSize: 11, color: "#5a3aaa", fontWeight: 500 }}>{t.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/journeys"
            className="w-full flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#a389d4,#c9a8e0)", borderRadius: 12, padding: "11px 16px", textDecoration: "none" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Explore all journeys</span>
            <ArrowRight style={{ width: 13, height: 13, color: "#fff" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
