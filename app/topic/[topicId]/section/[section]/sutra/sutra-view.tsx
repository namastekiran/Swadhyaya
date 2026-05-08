"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

export function SutraView({ topicId, section }: { topicId: string; section: SectionData }) {
  const router = useRouter();
  const completeStep = useAppStore((s) => s.completeStep);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const done = answers.completedSteps.includes("sutra");
  const backPath = `/topic/${topicId}/section/${section.section}`;

  function handleDone() {
    completeStep(topicId, section.section, "sutra");
    router.push(backPath);
  }

  const sutraLines = section.sutra.sanskrit.split(/\n+/).filter(Boolean);
  const sutraNumbers = section.sutra.number.split(/[,،]\s*/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="pb-20 -mx-6">
      <div
        className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]"
        style={{ background: "#f8f4ff" }}
      >
        {/* Top card — no image, pure design */}
        <div style={{
          background: "linear-gradient(150deg, #4a3070 0%, #7c4fc4 60%, #a389d4 100%)",
          padding: "20px 20px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          {/* Back button + label */}
          <div className="flex items-center gap-3" style={{ marginBottom: 20, position: "relative" }}>
            <Link href={backPath} className="flex items-center justify-center flex-shrink-0"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
              <ArrowLeft style={{ width: 12, height: 12, color: "#fff" }} />
            </Link>
            <div>
              {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{section.theme.replace(/[.!?]+$/, '')}</p>
              )}
              <p style={{ fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "0.01em" }}>Sutra & Insight</p>
            </div>
          </div>

          {/* Sutra number badge */}
          <div style={{ marginBottom: 10, position: "relative" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.15)", borderRadius: 20,
              padding: "3px 10px", letterSpacing: "0.08em",
            }}>
              SUTRA {sutraNumbers[0]}
            </span>
          </div>

          {/* Sanskrit text */}
          <div style={{ position: "relative" }}>
            {sutraLines.map((line, i) => (
              <p key={i} className="font-devanagari"
                style={{ fontSize: 17, color: "#fff", lineHeight: 1.8, fontStyle: "italic", marginBottom: i < sutraLines.length - 1 ? 2 : 0 }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Sutra breakdown — simple */}
          {(section.sutra.transliteration || section.sutra.padaVibhaga || section.sutra.wordMeanings) && (
            <div style={{ marginBottom: 18 }}>

              {section.sutra.transliteration && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 6 }}>TRANSLITERATION</p>
                  <p style={{ fontSize: 13, color: "#3d2f5e", fontStyle: "italic", lineHeight: 1.6 }}>{section.sutra.transliteration}</p>
                </div>
              )}

              {section.sutra.padaVibhaga && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 6 }}>PADA VIBHAGA</p>
                  <p style={{ fontSize: 13, color: "#3d2f5e", lineHeight: 2, wordBreak: "break-word", whiteSpace: "normal" }}>
                    {section.sutra.padaVibhaga.split("|").map((w, i, arr) => (
                      <span key={i} style={{ display: "inline" }}>{w.trim()}{i < arr.length - 1 ? <span style={{ color: "#c9a8e0", margin: "0 6px" }}>·</span> : null}</span>
                    ))}
                  </p>
                </div>
              )}

              {section.sutra.wordMeanings && (
                <div style={{ marginBottom: 4 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 6 }}>WORD MEANING</p>
                  <p style={{ fontSize: 13, color: "#3d2f5e", lineHeight: 2 }}>
                    {section.sutra.wordMeanings.split(";").filter(e => e.trim()).map((entry, i, arr) => (
                      <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: i < arr.length - 1 ? 0 : 0 }}>
                        {entry.trim()}
                        {i < arr.length - 1 && <span style={{ color: "#c9a8e0", margin: "0 6px" }}>·</span>}
                      </span>
                    ))}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* Meaning */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 10 }}>SUTRA MEANING</p>
            <p style={{ fontSize: 13, color: "#2e2048", lineHeight: 1.7 }}>
              {section.sutra.meaning}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#ede8f7", marginBottom: 18 }} />

          {/* Insight */}
          {section.insight && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 10 }}>INSIGHT</p>
              <div style={{ background: "linear-gradient(135deg,#f0ebff,#fdeef8)", borderRadius: 14, padding: "14px 16px", border: "1px solid #e8dff5" }}>
                <p style={{ fontSize: 13, color: "#2e2048", lineHeight: 1.6 }}>
                  {section.insight}
                </p>
              </div>
            </div>
          )}

          {/* Reflect prompt */}
          {section.reflectionPrompt && (
            <div style={{ background: "#f7f4ff", borderRadius: 12, padding: "12px 14px", marginBottom: 20, borderLeft: "3px solid #c9a8e0" }}>
              <p style={{ fontSize: 11, color: "#6040a0", fontWeight: 600, marginBottom: 3 }}>Reflect before you move on</p>
              <p style={{ fontSize: 12, color: "#2e2048", lineHeight: 1.5 }}>{section.reflectionPrompt}</p>
            </div>
          )}

          {/* CTA */}
          {done ? (
            <Link
              href={backPath}
              className="flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#a389d4,#c9a8e0)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </Link>
          ) : (
            <button
              onClick={handleDone}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#a389d4,#c9a8e0)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>I&apos;ve read this</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
