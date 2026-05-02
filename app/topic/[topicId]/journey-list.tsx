"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicData, SectionStatus, TopicSummary } from "@/lib/types";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickRandom } from "@/lib/images";

// ── Session card (used in both normal + completed journey views) ────────────
function SessionCard({
  topicId,
  sectionNum,
  sutraNumber,
  theme,
  status,
  completedSteps,
  totalSteps,
  isFirst,
  forceRevisit = false,
}: {
  topicId: string;
  sectionNum: number;
  sutraNumber: string;
  theme: string;
  status: SectionStatus;
  completedSteps: number;
  totalSteps: number;
  isFirst: boolean;
  forceRevisit?: boolean;
}) {
  const isDone = status === "done" || forceRevisit;
  const isCurrent = !forceRevisit && status === "current";
  const isLocked = !forceRevisit && status === "locked";
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const dotBg = isDone ? "#c8b8f0" : isCurrent ? "#f5c090" : "#e0d8f0";
  const dotColor = isDone ? "#5a3aaa" : isCurrent ? "#a05010" : "#8070a8";
  const connectorColor = isDone ? "#a389d4" : "#d0c8e8";

  const content = (
    <div
      className="flex items-center gap-3"
      style={{
        background: isDone ? "#f5f0ff" : "#fff",
        borderRadius: 14,
        padding: "13px 14px",
        border: isDone ? "1px solid #c8b8e8" : isCurrent ? "1.5px solid #e08848" : "1px solid #d8d0ec",
        opacity: isLocked ? 0.6 : 1,
        cursor: isLocked ? "not-allowed" : "pointer",
      }}
    >
      <div className="flex items-center justify-center flex-shrink-0"
        style={{ width: 36, height: 36, borderRadius: "50%", background: dotBg }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: dotColor }}>{sectionNum}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: isLocked ? "#b0aec8" : "#1e1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>
          {/^\d+[\.\d\n\s]*$/.test(theme?.trim() ?? "") ? `Sutra ${sutraNumber}` : theme}
        </p>
        <p style={{ fontSize: 10, color: "#5a5070" }}>
          Day {sectionNum} · Sutra {sutraNumber}
        </p>
        {isCurrent && totalSteps > 0 && (
          <div style={{ marginTop: 6, height: 3, borderRadius: 3, background: "#f0e8d8" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: "#f0a070" }} />
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {isDone && (
          <>
            <Check style={{ width: 18, height: 18, color: "#7c5cbf" }} />
            <span style={{ fontSize: 10, color: "#5a5070" }}>Revisit</span>
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
        {isLocked && <Lock style={{ width: 14, height: 14, color: "#c0bcd8" }} />}
      </div>
    </div>
  );

  return (
    <div>
      {!isFirst && (
        <div style={{ width: 2, height: 14, marginLeft: 17, background: connectorColor, borderRadius: 2 }} />
      )}
      {isLocked ? <div>{content}</div> : (
        <Link href={`/topic/${topicId}/section/${sectionNum}`}>{content}</Link>
      )}
    </div>
  );
}

// ── Journey Complete screen ────────────────────────────────────────────────
function JourneyComplete({ topic, answers }: { topic: TopicData; answers: Record<string, { completedSteps?: string[]; updatedAt?: string }> }) {
  const [nextTopics, setNextTopics] = useState<TopicSummary[]>([]);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data: TopicSummary[]) => {
        const others = data.filter((t) => t.id !== topic.id).slice(0, 2);
        setNextTopics(others);
      })
      .catch(() => {});
  }, [topic.id]);

  // Stats
  const totalSessions = topic.totalSections;
  const totalSteps = topic.sections.reduce((sum, s) => {
    return sum + 3 + (s.shlokaFrom || s.wisdomFrom ? 1 : 0) + 1;
  }, 0);
  const totalMinutes = topic.sections.reduce((sum, s) => {
    const sutraWords = (s.sutra.sanskrit?.split(/\s+/).length ?? 0) + (s.sutra.meaning?.split(/\s+/).length ?? 0) + (s.insight?.split(/\s+/).length ?? 0);
    const practiceWords = s.practice?.split(/\s+/).length ?? 0;
    const gitaWords = ((s.shlokaFrom ?? "").split(/\s+/).length) + ((s.wisdomFrom ?? "").split(/\s+/).length);
    return sum + Math.max(3, Math.ceil(sutraWords / 200)) + 5 + Math.max(7, Math.ceil(practiceWords / 200) + 5) + (s.shlokaFrom || s.wisdomFrom ? Math.max(2, Math.ceil(gitaWords / 200)) : 0) + 5;
  }, 0);

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={pickRandom(IMAGES.sessionComplete)} overlay="linear-gradient(160deg,rgba(60,30,110,0.45) 0%,rgba(40,18,80,0.78) 100%)" height={150} padding="22px 22px 20px">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="flex items-center justify-center flex-shrink-0"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}>
              <ArrowLeft style={{ width: 12, height: 12, color: "#fff" }} />
            </Link>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>{topic.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)" }}>{topic.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ paddingLeft: 42 }}>
            <div className="flex items-center justify-center"
              style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }}>
              <Check style={{ width: 11, height: 11, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>All {totalSessions} sessions complete</span>
          </div>
        </ImageHeader>

        <div style={{ padding: "20px 20px 26px" }}>

          {/* Celebration card */}
          <div style={{ background: "linear-gradient(135deg,#f0ebff,#fdeef8)", borderRadius: 18, padding: "22px 20px", textAlign: "center", marginBottom: 16, border: "1px solid #e8dff5" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "#3d2f5e", marginBottom: 6 }}>
              Journey complete!
            </p>
            <p style={{ fontSize: 12, color: "#6a5888", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
              &ldquo;{topic.description}&rdquo;
            </p>

            {/* 3 stats */}
            <div className="flex" style={{ borderTop: "1px solid #e8dff5", paddingTop: 14 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#6030c0" }}>{totalSessions}</p>
                <p style={{ fontSize: 9, color: "#6a5888", marginTop: 2 }}>sessions</p>
              </div>
              <div style={{ width: 1, background: "#e8dff5" }} />
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#d4600a" }}>{totalSteps}</p>
                <p style={{ fontSize: 9, color: "#6a5888", marginTop: 2 }}>steps done</p>
              </div>
              <div style={{ width: 1, background: "#e8dff5" }} />
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#1a8a60" }}>{totalMinutes}</p>
                <p style={{ fontSize: 9, color: "#6a5888", marginTop: 2 }}>min practiced</p>
              </div>
            </div>
          </div>

          {/* All sessions revisitable */}
          <p style={{ fontSize: 9, fontWeight: 600, color: "#6a5888", letterSpacing: "0.08em", marginBottom: 10 }}>
            ALL SESSIONS — TAP TO REVISIT
          </p>
          <div style={{ marginBottom: 18 }}>
            {topic.sections.map((section, i) => {
              const key = `${topic.id}::${section.section}`;
              const sectionAnswers = answers[key];
              const completedSteps = sectionAnswers?.completedSteps?.length ?? 0;
              const totalStepsForSection = 3 + (section.shlokaFrom || section.wisdomFrom ? 1 : 0) + 1;
              return (
                <SessionCard
                  key={section.section}
                  topicId={topic.id}
                  sectionNum={section.section}
                  sutraNumber={section.sutra.number.replace(/,\s*/g, " · ")}
                  theme={section.theme}
                  status="done"
                  completedSteps={completedSteps}
                  totalSteps={totalStepsForSection}
                  isFirst={i === 0}
                  forceRevisit={true}
                />
              );
            })}
          </div>

          {/* What's next */}
          <p style={{ fontSize: 9, fontWeight: 600, color: "#6a5888", letterSpacing: "0.08em", marginBottom: 10 }}>
            CONTINUE YOUR PRACTICE
          </p>

          {nextTopics.map((t) => (
            <Link
              key={t.id}
              href={`/topic/${t.id}`}
              className="flex items-center justify-between mb-3"
              style={{ background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)", borderRadius: 14, padding: "14px 16px" }}
            >
              <div>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", marginBottom: 3 }}>NEXT JOURNEY</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 1 }}>{t.title}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{t.tagline} · {t.totalSections} sessions</p>
              </div>
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}>
                <ArrowRight style={{ width: 14, height: 14, color: "#fff" }} />
              </div>
            </Link>
          ))}

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#a389d4,#c9a8e0)", borderRadius: 12, padding: "11px 16px" }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Browse all journeys</span>
            <ArrowRight style={{ width: 13, height: 13, color: "#fff" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Normal journey list ────────────────────────────────────────────────────
export function JourneyList({ topic }: { topic: TopicData }) {
  const [mounted, setMounted] = useState(false);
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  const completeAndNext = useAppStore((s) => s.completeAndNext);
  const answers = useAppStore((s) => s.answers);

  useEffect(() => { setMounted(true); }, []);

  // Self-heal: call completeAndNext for any section whose steps are all done
  // but isn't yet in completedSections (handles stale data from old app versions)
  useEffect(() => {
    if (!mounted) return;
    topic.sections.forEach((section) => {
      const key = `${topic.id}::${section.section}`;
      const sectionAnswers = answers[key];
      const totalStepsForSection = 3 + (section.shlokaFrom || section.wisdomFrom ? 1 : 0) + 1;
      if ((sectionAnswers?.completedSteps?.length ?? 0) >= totalStepsForSection) {
        completeAndNext(topic.id, section.section, topic.totalSections);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  const progress = getTopicProgress(topic.id);
  const completedCount = progress.completedSections.length;
  const progressPercent = topic.totalSections > 0 ? (completedCount / topic.totalSections) * 100 : 0;
  const journeyComplete = completedCount >= topic.totalSections;

  // Show journey complete screen when all sessions done
  if (journeyComplete) {
    return <JourneyComplete topic={topic} answers={answers} />;
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={pickRandom(IMAGES.journeyList)} overlay="linear-gradient(160deg,rgba(60,30,110,0.50) 0%,rgba(40,18,80,0.80) 100%)" height={150} padding="22px 22px 20px">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="flex items-center justify-center flex-shrink-0"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}>
              <ArrowLeft style={{ width: 12, height: 12, color: "#fff" }} />
            </Link>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>{topic.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)" }}>{topic.tagline} · {topic.totalSections} sessions</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.70)" }}>
              Session {Math.min(completedCount + 1, topic.totalSections)} of {topic.totalSections}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 4 }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 4, transition: "width 0.6s ease" }} />
          </div>
        </ImageHeader>

        {/* Session list */}
        <div style={{ padding: "20px 18px 26px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#5a5070", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            Your journey
          </p>
          <p style={{ fontSize: 12, color: "#6a5888", marginBottom: 16 }}>
            Tap any completed session to revisit it.
          </p>

          {topic.sections.map((section, i) => {
            const status: SectionStatus = getSectionStatus(topic.id, section.section);
            const key = `${topic.id}::${section.section}`;
            const sectionAnswers = answers[key];
            const completedSteps = sectionAnswers?.completedSteps?.length ?? 0;
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
