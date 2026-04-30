"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicData, SectionStatus } from "@/lib/types";

function SessionCard({
  topicId,
  sectionNum,
  sutraNumber,
  theme,
  status,
  completedSteps,
  totalSteps,
  isFirst,
}: {
  topicId: string;
  sectionNum: number;
  sutraNumber: string;
  theme: string;
  status: SectionStatus;
  completedSteps: number;
  totalSteps: number;
  isFirst: boolean;
}) {
  const isDone = status === "done";
  const isCurrent = status === "current";
  const isLocked = status === "locked";
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const dotBg = isDone ? "#a389d420" : isCurrent ? "#f0a07020" : "#ede8f7";
  const dotColor = isDone ? "#7c5cbf" : isCurrent ? "#c47820" : "#c0b8d0";
  const connectorColor = isDone ? "#a389d4" : "#e8e4f4";

  const content = (
    <div
      className="flex items-center gap-3"
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "13px 14px",
        border: isDone
          ? "1px solid #e5e3f0"
          : isCurrent
          ? "1.5px solid #f0a070"
          : "1px solid #ede8f7",
        opacity: isLocked ? 0.4 : 1,
        cursor: isLocked ? "not-allowed" : "pointer",
      }}
    >
      {/* Number circle */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 36, height: 36, borderRadius: "50%", background: dotBg }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: dotColor }}>{sectionNum}</span>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: "#9b97b0", marginBottom: 1 }}>
          Day {sectionNum} · Sutra {sutraNumber}
        </p>
        <p
          style={{
            fontSize: 14, fontWeight: 600,
            color: isLocked ? "#b0aec8" : "#1e1a2e",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {theme}
        </p>
        {isCurrent && totalSteps > 0 && (
          <div style={{ marginTop: 6, height: 3, borderRadius: 3, background: "#f0e8d8" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: "#f0a070" }} />
          </div>
        )}
      </div>

      {/* Right indicator */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {isDone && (
          <>
            <Check style={{ width: 18, height: 18, color: "#7c5cbf" }} />
            <span style={{ fontSize: 10, color: "#9b97b0" }}>Revisit</span>
          </>
        )}
        {isCurrent && (
          <>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#92400e", background: "#fef3c7", padding: "2px 8px", borderRadius: 20 }}>
              {completedSteps}/{totalSteps} steps
            </span>
            <ArrowRight style={{ width: 14, height: 14, color: "#f0a070" }} />
          </>
        )}
        {isLocked && (
          <Lock style={{ width: 14, height: 14, color: "#c0bcd8" }} />
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Connector line */}
      {!isFirst && (
        <div style={{ width: 2, height: 14, marginLeft: 17, background: connectorColor, borderRadius: 2 }} />
      )}
      {isLocked ? (
        <div>{content}</div>
      ) : (
        <Link href={`/topic/${topicId}/section/${sectionNum}`}>{content}</Link>
      )}
    </div>
  );
}

export function JourneyList({ topic }: { topic: TopicData }) {
  const [mounted, setMounted] = useState(false);
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  const answers = useAppStore((s) => s.answers);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const progress = getTopicProgress(topic.id);
  const completedCount = progress.completedSections.length;
  const progressPercent = topic.totalSections > 0 ? (completedCount / topic.totalSections) * 100 : 0;

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#fdfcff" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)", padding: "24px 22px 26px" }}>
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/"
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 12, height: 12, color: "#7c5cbf" }} />
            </Link>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#3d2f5e" }}>{topic.title}</p>
              <p style={{ fontSize: 11, color: "#b0a0c8" }}>{topic.tagline} · {topic.totalSections} sessions</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 11, color: "#b0a0c8" }}>
              Session {Math.min(completedCount + 1, topic.totalSections)} of {topic.totalSections}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7c5cbf" }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.5)", borderRadius: 4 }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#a389d4", borderRadius: 4, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Session list */}
        <div style={{ padding: "20px 18px 26px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#9b97b0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            Your journey
          </p>
          <p style={{ fontSize: 12, color: "#b0a0c8", marginBottom: 16 }}>
            Tap any completed session to revisit it.
          </p>

          {topic.sections.map((section, i) => {
            const status: SectionStatus = getSectionStatus(topic.id, section.section);
            const key = `${topic.id}::${section.section}`;
            const sectionAnswers = answers[key];
            const completedSteps = sectionAnswers?.completedSteps?.length ?? 0;
            // count steps for this section (sutra, reflection, practice, +gita if exists, journal)
            const totalSteps = 3 + (section.shlokaFrom || section.wisdomFrom ? 1 : 0) + 1;

            return (
              <SessionCard
                key={section.section}
                topicId={topic.id}
                sectionNum={section.section}
                sutraNumber={section.sutra.number.replace(/,\s*/g, " · ")}
                theme={section.theme}
                status={status}
                completedSteps={completedSteps}
                totalSteps={totalSteps}
                isFirst={i === 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
