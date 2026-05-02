"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickForTopic } from "@/lib/images";

export function GitaView({ topicId, section }: { topicId: string; section: SectionData }) {
  const router = useRouter();
  const completeStep = useAppStore((s) => s.completeStep);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const done = answers.completedSteps.includes("gita");

  const backPath = `/topic/${topicId}/section/${section.section}`;

  function handleDone() {
    completeStep(topicId, section.section, "gita");
    router.push(backPath);
  }

  // shlokaFrom may contain multiple verses separated by line breaks or periods
  const shlokaLines = (section.shlokaFrom ?? "").split(/\n+/).filter(Boolean);

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={pickForTopic(IMAGES.gita, topicId)} overlay="linear-gradient(160deg,rgba(120,70,10,0.25) 0%,rgba(80,40,5,0.50) 100%)">
          <div className="flex items-center gap-3">
            <Link href={backPath} className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}>
              <ArrowLeft style={{ width: 11, height: 11, color: "#fff" }} />
            </Link>
            <div>
              {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)" }}>{section.theme}</p>
              )}
              <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Wisdom from the Gita</p>
            </div>
          </div>
        </ImageHeader>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Verse card */}
          {section.shlokaFrom && (
            <div style={{ background: "linear-gradient(135deg,#fef0e0,#fff5e8)", borderRadius: 16, padding: 18, border: "1px solid #f0d8b8", marginBottom: 16 }}>
              <p className="font-devanagari" style={{ fontSize: 13, color: "#4a2e18", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {shlokaLines.join("\n")}
              </p>
            </div>
          )}

          {/* Meaning */}
          {section.wisdomFrom && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 500, color: "#7a5838", letterSpacing: "0.08em", marginBottom: 10 }}>MEANING</p>
              <p style={{ fontSize: 13, color: "#4a2e18", lineHeight: 1.7 }}>{section.wisdomFrom}</p>
            </div>
          )}

          {/* How this connects */}
          {section.insight && (
            <div style={{ background: "#fef5e8", borderRadius: 12, padding: "12px 14px", marginBottom: 20, borderLeft: "3px solid #dda870" }}>
              <p style={{ fontSize: 11, color: "#c48450", fontWeight: 500, marginBottom: 3 }}>How this connects</p>
              <p style={{ fontSize: 12, color: "#5a3818", lineHeight: 1.5 }}>{section.insight}</p>
            </div>
          )}

          {/* CTA */}
          {done ? (
            <Link
              href={backPath}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#c48450,#dda870)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </Link>
          ) : (
            <button
              onClick={handleDone}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#c48450,#dda870)", borderRadius: 14, padding: 13 }}
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
