"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickForTopic } from "@/lib/images";

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
        <ImageHeader
          imageUrl={pickForTopic(IMAGES.sutra, topicId)}
          overlay="linear-gradient(160deg,rgba(40,30,90,0.55) 0%,rgba(30,20,70,0.75) 100%)"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link href={backPath} className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}>
              <ArrowLeft style={{ width: 11, height: 11, color: "#fff" }} />
            </Link>
            <div>
              {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)" }}>{section.theme}</p>
              )}
              <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Sutra & Insight</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 16px" }}>
            {sutraLines.map((line, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3" style={{ marginBottom: i < sutraLines.length - 1 ? 6 : 0 }}>
                <p className="font-devanagari" style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, fontStyle: "italic" }}>
                  {line}
                </p>
                {sutraNumbers[i] && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {sutraNumbers[i]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ImageHeader>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Meaning */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "#4a3870", letterSpacing: "0.08em", marginBottom: 10 }}>MEANING</p>
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
