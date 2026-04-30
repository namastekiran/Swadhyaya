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

  const sutraLabel = `SUTRA ${section.sutra.number.replace(/,\s*/g, " · ")}`;

  return (
    <div className="pb-20 -mx-6">
      <div
        className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]"
        style={{ background: "#fdfcff" }}
      >
        {/* Lavender header */}
        <div style={{ background: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)", padding: "20px 20px 22px" }}>
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={backPath}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#7c5cbf" }} />
            </Link>
            <div>
              <p style={{ fontSize: 10, color: "#b0a0c8" }}>{section.theme}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#3d2f5e" }}>Sutra & Insight</p>
            </div>
          </div>

          {/* Sanskrit box */}
          <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#a389d4", letterSpacing: "0.08em", marginBottom: 8 }}>
              {sutraLabel}
            </p>
            <p className="font-devanagari" style={{ fontSize: 15, color: "#3d2f5e", lineHeight: 1.7, fontStyle: "italic", marginBottom: 6, whiteSpace: "pre-wrap" }}>
              {section.sutra.sanskrit}
            </p>
            {section.sutra.transliteration && (
              <p style={{ fontSize: 10, color: "#b0a0c8", lineHeight: 1.6 }}>
                {section.sutra.transliteration}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Meaning */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#c0b0d8", letterSpacing: "0.08em", marginBottom: 10 }}>MEANING</p>
            <p style={{ fontSize: 13, color: "#5a4a7a", lineHeight: 1.7 }}>
              {section.sutra.meaning}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#ede8f7", marginBottom: 18 }} />

          {/* Insight */}
          {section.insight && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, fontWeight: 500, color: "#c0b0d8", letterSpacing: "0.08em", marginBottom: 10 }}>INSIGHT</p>
              <div style={{ background: "linear-gradient(135deg,#f0ebff,#fdeef8)", borderRadius: 14, padding: "14px 16px", border: "1px solid #e8dff5" }}>
                <p style={{ fontSize: 13, color: "#3d2f5e", lineHeight: 1.6 }}>
                  {section.insight}
                </p>
              </div>
            </div>
          )}

          {/* Reflect prompt */}
          {section.reflectionPrompt && (
            <div style={{ background: "#f7f4ff", borderRadius: 12, padding: "12px 14px", marginBottom: 20, borderLeft: "3px solid #c9a8e0" }}>
              <p style={{ fontSize: 11, color: "#a389d4", fontWeight: 500, marginBottom: 3 }}>Reflect before you move on</p>
              <p style={{ fontSize: 12, color: "#b0a0c8", lineHeight: 1.5 }}>{section.reflectionPrompt}</p>
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
