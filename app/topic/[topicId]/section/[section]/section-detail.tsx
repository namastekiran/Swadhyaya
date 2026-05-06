"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, MessageCircle, Dumbbell, PenLine, Check, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickForTopic, pickRandom } from "@/lib/images";

interface Props {
  topicId: string;
  topicTitle: string;
  section: SectionData;
  totalSections: number;
}

type StepKey = "sutra" | "reflection" | "practice" | "gita" | "gurudev" | "journal";

interface StepDef {
  key: StepKey;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  minutes: number;
  optional?: boolean;
}

function countWords(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function calcStepTimes(section: SectionData) {
  const sutraWords = countWords(section.sutra.sanskrit) + countWords(section.sutra.meaning) + countWords(section.insight);
  const practiceWords = countWords(section.practice);
  const gitaWords = countWords(section.shlokaFrom ?? "") + countWords(section.wisdomFrom ?? "");
  return {
    sutra: Math.max(3, Math.ceil(sutraWords / 200)),
    reflection: 5,
    practice: Math.max(7, Math.ceil(practiceWords / 200) + 5),
    gita: Math.max(2, Math.ceil(gitaWords / 200)),
    journal: 5,
  };
}

function buildSteps(section: SectionData, times: ReturnType<typeof calcStepTimes>): StepDef[] {
  const steps: StepDef[] = [
    { key: "sutra", label: "Sutra & Insight", description: "Read the sutra and explore its meaning", href: "sutra", icon: BookOpen, minutes: times.sutra },
    { key: "reflection", label: "Reflection", description: "Reflect on the teaching and share your thoughts", href: "reflection", icon: MessageCircle, minutes: times.reflection },
    { key: "practice", label: "Micro Practice", description: "A small action and meditation for the day", href: "practice", icon: Dumbbell, minutes: times.practice },
  ];
  if (section.shlokaFrom || section.wisdomFrom) {
    steps.push({ key: "gita", label: "Wisdom from the Gita", description: "Read related wisdom from the Bhagavad Gita", href: "gita", icon: BookOpen, minutes: times.gita });
  }
  if (section.gurudevInsight) {
    steps.push({ key: "gurudev", label: "Deep Dive with Gurudev", description: "Gurudev's commentary on this sutra", href: "gurudev", icon: Sparkles, minutes: 3, optional: true });
  }
  steps.push({ key: "journal", label: "Journal", description: "Write down your experience and insights", href: "journal", icon: PenLine, minutes: times.journal });
  return steps;
}

function calcStreak(answers: Record<string, { updatedAt?: string }>): number {
  const dates = new Set<string>();
  for (const val of Object.values(answers)) {
    if (val.updatedAt) dates.add(val.updatedAt.slice(0, 10));
  }
  if (dates.size === 0) return 1;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dates.has(d.toISOString().slice(0, 10))) streak++;
    else if (i > 0) break;
  }
  return Math.max(1, streak);
}

// ── Session Complete Screen ────────────────────────────────────────────────
function SessionComplete({
  topicId,
  topicTitle,
  section,
  totalSections,
  steps,
  totalMinutes,
}: {
  topicId: string;
  topicTitle: string;
  section: SectionData;
  totalSections: number;
  steps: StepDef[];
  totalMinutes: number;
}) {
  const completeAndNext = useAppStore((s) => s.completeAndNext);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);
  const allAnswers = useAppStore((s) => s.answers);

  const [nextTheme, setNextTheme] = useState("");
  const [nextSutra, setNextSutra] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [headerImg, setHeaderImg] = useState(IMAGES.sessionComplete[0]);

  const isLast = section.section >= totalSections;
  const nextNum = section.section + 1;

  useEffect(() => {
    completeAndNext(topicId, section.section, totalSections);
    setHeaderImg(pickRandom(IMAGES.sessionComplete));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLast) return;
    fetch(`/api/topics/${topicId}`)
      .then((r) => r.json())
      .then((data) => {
        const next = data.sections?.find((s: { section: number }) => s.section === nextNum);
        if (next) {
          setNextTheme(next.theme);
          setNextSutra(next.sutra?.number ?? "");
        }
      })
      .catch(() => {});
  }, [topicId, nextNum, isLast]);

  const progress = getTopicProgress(topicId);
  const journeyPct = Math.round((progress.completedSections.length / totalSections) * 100);
  const streak = calcStreak(allAnswers);
  const quote = section.sutra.meaning.split(/[.।]/)[0].trim();

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={headerImg} overlay="linear-gradient(160deg,rgba(60,30,110,0.42) 0%,rgba(40,18,80,0.70) 100%)" height={110} padding="22px 20px 24px">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href={`/topic/${topicId}`}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#fff" }} />
            </Link>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em" }}>
              {topicTitle.toUpperCase()} · SESSION {section.section}
            </p>
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.3, paddingLeft: 38 }}>
            {/^\d+[\.\d\n\s]*$/.test(section.theme?.trim() ?? "") ? `Sutra ${section.sutra.number.replace(/,\s*/g, " · ")}` : section.theme}
          </p>
        </ImageHeader>

        <div style={{ padding: "20px 20px 26px" }}>

          {/* Celebration card */}
          <div style={{ background: "linear-gradient(135deg,#f0ebff,#fdeef8)", borderRadius: 18, padding: "22px 20px", textAlign: "center", marginBottom: 16, border: "1px solid #e8dff5" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🌸</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: "#3d2f5e", marginBottom: 8 }}>Session complete!</p>
            <p style={{ fontSize: 12, color: "#7a6898", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
              &ldquo;{quote}&rdquo;
            </p>

            {/* 3 stats with dividers */}
            <div className="flex" style={{ borderTop: "1px solid #e8dff5", paddingTop: 14 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#d4600a" }}>{streak}</p>
                <p style={{ fontSize: 9, color: "#7a6898", marginTop: 2 }}>day streak 🔥</p>
              </div>
              <div style={{ width: 1, background: "#e8dff5" }} />
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#6030c0" }}>{journeyPct}%</p>
                <p style={{ fontSize: 9, color: "#7a6898", marginTop: 2 }}>journey done</p>
              </div>
              <div style={{ width: 1, background: "#e8dff5" }} />
              <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#1a8a60" }}>{totalMinutes} min</p>
                <p style={{ fontSize: 9, color: "#7a6898", marginTop: 2 }}>time spent</p>
              </div>
            </div>
          </div>

          {/* Up Next / Journey Complete */}
          {isLast ? (
            <div style={{ background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)", borderRadius: 14, padding: "20px 18px", textAlign: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🎉</p>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Journey complete!</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
                You&apos;ve completed all sessions in this journey.
              </p>
              <Link
                href="/"
                style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 500, color: "#fff", display: "inline-block" }}
              >
                Back to dashboard
              </Link>
            </div>
          ) : (
            <Link
              href={`/topic/${topicId}`}
              className="flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)", borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}
            >
              <div>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", marginBottom: 4 }}>UP NEXT</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 2 }}>
                  {nextTheme || `Session ${nextNum}`}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                  Session {nextNum}{nextSutra ? ` · Sutra ${nextSutra.split(",")[0].trim()}` : ""}
                </p>
              </div>
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}
              >
                <ArrowRight style={{ width: 14, height: 14, color: "#fff" }} />
              </div>
            </Link>
          )}

          {/* Revisit steps */}
          <button
            onClick={() => setShowSteps((v) => !v)}
            className="w-full flex items-center justify-between"
            style={{ border: "1.5px solid #ede8f7", borderRadius: 12, padding: "11px 16px" }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: "#7c5cbf" }}>
              {showSteps ? "Hide steps" : "Revisit this session"}
            </span>
            <ArrowRight
              style={{ width: 13, height: 13, color: "#a389d4", transform: showSteps ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
            />
          </button>

          {showSteps && (
            <div className="space-y-2 mt-3">
              {steps.map((step) => {
                const Icon = step.icon;
                const STEP_COLORS: Record<string, { icon: string; bg: string }> = {
                  sutra:      { icon: "#7c5cbf", bg: "#d4c8ff" },
                  reflection: { icon: "#c4707a", bg: "#f5bec5" },
                  practice:   { icon: "#5a9e78", bg: "#bde8d0" },
                  gita:       { icon: "#c48450", bg: "#f8d4a8" },
                  gurudev:    { icon: "#b87840", bg: "#fde8c8" },
                  journal:    { icon: "#5a7aa0", bg: "#bcd4f0" },
                };
                const sc = STEP_COLORS[step.key] ?? STEP_COLORS.sutra;
                return (
                  <Link
                    key={step.key}
                    href={`/topic/${topicId}/section/${section.section}/${step.href}`}
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: "#faf8ff", border: "1px solid #ede8f7" }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 36, height: 36, borderRadius: 10, background: sc.bg }}
                    >
                      <Icon style={{ width: 15, height: 15, color: sc.icon }} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#3d2f5e" }}>{step.label}</p>
                      <p style={{ fontSize: 10, color: "#7a6898" }}>{step.minutes} min · completed</p>
                    </div>
                    <Check style={{ width: 12, height: 12, color: "#c9a8e0", flexShrink: 0 }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Session Detail ────────────────────────────────────────────────────
export function SectionDetail({ topicId, topicTitle, section, totalSections }: Props) {
  const [mounted, setMounted] = useState(false);
  const [nextTheme, setNextTheme] = useState("");
  const [nextSutra, setNextSutra] = useState("");
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const completeAndNext = useAppStore((s) => s.completeAndNext);

  useEffect(() => { setMounted(true); }, []);

  const answers = getSectionAnswers(topicId, section.section);
  const times = calcStepTimes(section);
  const steps = buildSteps(section, times);

  const completedKeys = answers.completedSteps as StepKey[];
  const allDone = steps.filter((s) => !s.optional).every((s) => completedKeys.includes(s.key));
  const isLast = section.section >= totalSections;
  const nextNum = section.section + 1;

  // Mark section done in store and unlock next section when all steps complete
  useEffect(() => {
    if (allDone) completeAndNext(topicId, section.section, totalSections);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  useEffect(() => {
    if (!allDone || isLast) return;
    fetch(`/api/topics/${topicId}`)
      .then((r) => r.json())
      .then((data) => {
        const next = data.sections?.find((s: { section: number }) => s.section === nextNum);
        if (next) { setNextTheme(next.theme); setNextSutra(next.sutra?.number ?? ""); }
      })
      .catch(() => {});
  }, [allDone, isLast, topicId, nextNum]);

  const router = useRouter();

  // When last session is done, auto-redirect to journey page (shows JourneyComplete screen)
  useEffect(() => {
    if (allDone && isLast) {
      router.replace(`/topic/${topicId}`);
    }
  }, [allDone, isLast, router, topicId]);

  if (!mounted) return null;

  // First incomplete step — used only as a visual "resume here" hint, not a gate
  const currentIdx = steps.findIndex((s) => !completedKeys.includes(s.key));
  const nonJournalDone = steps.filter((s) => s.key !== "journal").every((s) => completedKeys.includes(s.key));

  const basePath = `/topic/${topicId}/section/${section.section}`;

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={pickForTopic(IMAGES.journeyList, topicId)} overlay="linear-gradient(160deg,rgba(60,30,110,0.42) 0%,rgba(40,18,80,0.70) 100%)" height={140} padding="22px 20px 20px">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href={`/topic/${topicId}`}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#fff" }} />
            </Link>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em" }}>
              {topicTitle.toUpperCase()} · SESSION {section.section}
            </p>
          </div>
          <div className="flex items-center gap-2 mb-3" style={{ paddingLeft: 38 }}>
            <p style={{ fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
              {/^\d+[\.\d\n\s]*$/.test(section.theme?.trim() ?? "") ? `Sutra ${section.sutra.number.replace(/,\s*/g, " · ")}` : section.theme}
            </p>
            {allDone && (
              <span className="flex items-center gap-1 flex-shrink-0" style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.25)", padding: "3px 9px", borderRadius: 20 }}>
                <Check style={{ width: 10, height: 10 }} /> Completed
              </span>
            )}
          </div>

          {/* Step dots progress */}
          <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 14px" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>
                {completedKeys.length} of {steps.length} steps complete
              </span>
              <span style={{ fontSize: 10, fontWeight: 500, color: "#fff" }}>
                {Math.round((completedKeys.length / steps.length) * 100)}%
              </span>
            </div>
            <div className="flex gap-1">
              {steps.map((s) => (
                <div
                  key={s.key}
                  style={{
                    flex: 1, height: 3, borderRadius: 4,
                    background: completedKeys.includes(s.key) ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.30)",
                  }}
                />
              ))}
            </div>
          </div>
        </ImageHeader>

        {/* Step list */}
        <div style={{ padding: "20px 20px 26px" }}>

          {/* Celebration banner — shown only when all steps done */}
          {allDone && (
            <div style={{ background: "linear-gradient(135deg,#f0ebff,#fdeef8)", borderRadius: 16, padding: "16px 18px", textAlign: "center", marginBottom: 16, border: "1px solid #e8dff5" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🌸</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#3d2f5e", marginBottom: 4 }}>Session complete!</p>
              <p style={{ fontSize: 11, color: "#7a6898", fontStyle: "italic" }}>
                &ldquo;{section.sutra.meaning.split(/[.।]/)[0].trim()}&rdquo;
              </p>
            </div>
          )}

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isDone = completedKeys.includes(step.key);
              const isCurrent = !allDone && idx === currentIdx;
              const isJournalNudge = step.key === "journal" && !isDone && !nonJournalDone;
              const isOptionalNudge = step.optional && !isDone;
              const Icon = step.icon;

              const STEP_COLORS: Record<string, { icon: string; bg: string; border: string; label: string }> = {
                sutra:      { icon: "#7c5cbf", bg: "#d4c8ff", border: "#b8a0e8", label: "#a389d4" },
                reflection: { icon: "#c4707a", bg: "#f5bec5", border: "#d898a8", label: "#c4707a" },
                practice:   { icon: "#5a9e78", bg: "#bde8d0", border: "#88c8a8", label: "#5a9e78" },
                gita:       { icon: "#c48450", bg: "#f8d4a8", border: "#d8b478", label: "#c48450" },
                gurudev:    { icon: "#b87840", bg: "#fde8c8", border: "#e8b878", label: "#b87840" },
                journal:    { icon: "#5a7aa0", bg: "#bcd4f0", border: "#88acd0", label: "#5a7aa0" },
              };
              const sc = STEP_COLORS[step.key] ?? STEP_COLORS.sutra;

              return (
                <Link key={step.key} href={`${basePath}/${step.href}`}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                    style={{
                      border: isCurrent ? `1.5px solid ${sc.border}` : `1px solid ${sc.border}bb`,
                      background: isCurrent ? "#fff" : isDone ? `${sc.bg}80` : `${sc.bg}55`,
                      boxShadow: isCurrent ? `0 2px 12px ${sc.border}aa` : undefined,
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 44, height: 44, borderRadius: 12, background: isDone ? `${sc.bg}99` : sc.bg }}
                    >
                      <Icon style={{ width: 18, height: 18, color: sc.icon }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isCurrent && (
                        <p style={{ fontSize: 9, fontWeight: 600, color: sc.label, letterSpacing: "0.07em", marginBottom: 2 }}>RESUME HERE</p>
                      )}
                      {isJournalNudge && (
                        <p style={{ fontSize: 9, fontWeight: 600, color: "#90a8c8", letterSpacing: "0.07em", marginBottom: 2 }}>BEST DONE LAST</p>
                      )}
                      {isOptionalNudge && (
                        <p style={{ fontSize: 9, fontWeight: 600, color: "#b87840", letterSpacing: "0.07em", marginBottom: 2 }}>OPTIONAL</p>
                      )}
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#3d2f5e" }}>
                        {step.label}
                      </p>
                      <p style={{ fontSize: 11, color: "#7a6898", marginTop: 1 }}>
                        {step.description} · {step.minutes} min
                      </p>
                    </div>
                    {isDone ? (
                      <div className="flex items-center justify-center flex-shrink-0"
                        style={{ width: 22, height: 22, borderRadius: "50%", background: sc.bg }}>
                        <Check style={{ width: 11, height: 11, color: sc.icon }} />
                      </div>
                    ) : (
                      <ArrowRight style={{ width: 14, height: 14, color: sc.icon, flexShrink: 0 }} />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* UP NEXT card — shown when session complete and not the last session */}
          {allDone && !isLast && (
            <div style={{ marginTop: 20 }}>
              <Link
                href={`/topic/${topicId}/section/${nextNum}`}
                className="flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#a389d4 0%,#c9a8e0 100%)", borderRadius: 14, padding: "16px 18px" }}
              >
                <div>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", marginBottom: 4 }}>UP NEXT</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 2 }}>
                    {nextTheme || `Session ${nextNum}`}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>
                    Session {nextNum}{nextSutra ? ` · Sutra ${nextSutra.split(",")[0].trim()}` : ""}
                  </p>
                </div>
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}>
                  <ArrowRight style={{ width: 14, height: 14, color: "#fff" }} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
