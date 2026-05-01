"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const TIMER_SECONDS = 10 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 34;

export function PracticeView({ topicId, section }: { topicId: string; section: SectionData }) {
  const router = useRouter();
  const savePractice = useAppStore((s) => s.savePractice);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const alreadyDone = answers.completedSteps.includes("practice");

  const [text, setText] = useState(answers.practiceAnswer ?? "");
  const [initialText] = useState(answers.practiceAnswer ?? "");
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const backPath = `/topic/${topicId}/section/${section.section}`;
  const words = wordCount(text);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  function handleSave() {
    savePractice(topicId, section.section, text.trim() || "done");
    router.push(backPath);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeLabel = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const progress = secondsLeft / TIMER_SECONDS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Split practice into main sentence + rest
  const sentences = section.practice?.split(/(?<=[.?!])\s+/) ?? [];
  const mainPractice = sentences[0] ?? section.practice ?? "";
  const subPractice = sentences.slice(1).join(" ");

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        {/* Lavender header */}
        <div style={{ background: "linear-gradient(160deg,#c8e8d8 0%,#daf5e8 100%)", padding: "20px 20px 22px" }}>
          <div className="flex items-center gap-3">
            <Link
              href={backPath}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#5a9e78" }} />
            </Link>
            <div>
              {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                <p style={{ fontSize: 10, color: "#4a7860" }}>{section.theme}</p>
              )}
              <p style={{ fontSize: 14, fontWeight: 500, color: "#2a4a38" }}>Micro Practice</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Today's practice */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#4a7860", letterSpacing: "0.08em", marginBottom: 10 }}>TODAY&apos;S PRACTICE</p>
            <div style={{ background: "linear-gradient(135deg,#e8f5ee,#f0fff5)", borderRadius: 14, padding: 16, border: "1px solid #c8e8d8" }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#2a4a38", lineHeight: 1.5 }}>{mainPractice}</p>
              {subPractice && (
                <p style={{ fontSize: 12, color: "#4a7860", marginTop: 6, lineHeight: 1.6 }}>{subPractice}</p>
              )}
            </div>
          </div>

          {/* Meditation timer */}
          {section.meditation && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 9, fontWeight: 500, color: "#4a7860", letterSpacing: "0.08em", marginBottom: 10 }}>MEDITATION</p>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c8e8d8", padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "#4a7860", marginBottom: 12 }}>
                  {section.meditation.length < 80 ? section.meditation : "Sit comfortably. Begin when you're ready."}
                </p>
                {/* Timer ring */}
                <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 12px" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#d8f0e4" strokeWidth="5" />
                    <circle
                      cx="40" cy="40" r="34" fill="none" stroke="#a389d4" strokeWidth="5"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={secondsLeft === TIMER_SECONDS ? CIRCUMFERENCE : dashOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#2a4a38", lineHeight: 1 }}>{timeLabel}</p>
                    <p style={{ fontSize: 9, color: "#4a7860", marginTop: 2 }}>min</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (secondsLeft === 0) { setSecondsLeft(TIMER_SECONDS); setTimerRunning(false); return; }
                    setTimerRunning(!timerRunning);
                  }}
                  className="flex items-center justify-center gap-2 mx-auto"
                  style={{ background: "linear-gradient(135deg,#6aae88,#90c8a8)", borderRadius: 10, padding: "10px 20px" }}
                >
                  {timerRunning ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>
                    {secondsLeft === 0 ? "Reset timer" : timerRunning ? "Pause" : "Begin meditation"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "#d8f0e4", marginBottom: 18 }} />

          {/* How did it feel */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#4a7860", letterSpacing: "0.08em", marginBottom: 10 }}>HOW DID IT FEEL?</p>
            <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #c8e8d8", padding: 14, position: "relative" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share what you noticed during the practice..."
                rows={4}
                className="w-full resize-none outline-none"
                style={{ fontSize: 12, color: "#2a4a38", lineHeight: 1.7, background: "transparent", border: "none" }}
              />
              <p style={{ fontSize: 10, color: "#4a7860", textAlign: "right", marginTop: 4 }}>{words} words</p>
            </div>
          </div>

          {/* Encouragement */}
          <p style={{ fontSize: 11, color: "#4a7860", textAlign: "center", marginBottom: 18 }}>
            Optional — but the noticing matters 🌿
          </p>

          {/* CTA */}
          {alreadyDone && text === initialText ? (
            <Link
              href={backPath}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#6aae88,#90c8a8)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </Link>
          ) : (
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#6aae88,#90c8a8)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Practice complete</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
