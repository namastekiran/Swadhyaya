"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickForTopic } from "@/lib/images";

export function GurudevView({ topicId, section }: { topicId: string; section: SectionData }) {
  const completeStep = useAppStore((s) => s.completeStep);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const alreadyDone = answers.completedSteps.includes("gurudev");

  const backPath = `/topic/${topicId}/section/${section.section}`;

  useEffect(() => {
    if (!alreadyDone) {
      completeStep(topicId, section.section, "gurudev");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Strip page reference [PDF p.X] for display, keep the text clean
  const insight = (section.gurudevInsight ?? "").replace(/\s*\[PDF p\.\d+\]/g, "").trim();
  const pageMatch = section.gurudevInsight?.match(/\[PDF p\.(\d+)\]/);
  const pageNum = pageMatch ? pageMatch[1] : null;

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader imageUrl={pickForTopic(IMAGES.gurudev, topicId)} overlay="linear-gradient(160deg,rgba(110,60,10,0.28) 0%,rgba(70,35,5,0.52) 100%)">
          <div className="flex items-center gap-3">
            <Link href={backPath} className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}>
              <ArrowLeft style={{ width: 11, height: 11, color: "#fff" }} />
            </Link>
            <div>
              {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)" }}>{section.theme}</p>
              )}
              <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Deep Dive with Gurudev</p>
            </div>
          </div>
        </ImageHeader>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Gurudev intro card */}
          <div
            style={{
              background: "linear-gradient(135deg,#fdf0e0,#fff8f0)",
              borderRadius: 16,
              padding: "18px 18px",
              border: "1px solid #f0d8b8",
              marginBottom: 20,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 32, height: 32, borderRadius: 10, background: "#fde8c8" }}
              >
                <Sparkles style={{ width: 15, height: 15, color: "#b87840" }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#b87840", letterSpacing: "0.06em" }}>
                Gurudev Sri Sri Ravi Shankar
              </p>
            </div>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#8a6030", letterSpacing: "0.08em", marginBottom: 12 }}>
              COMMENTARY ON SUTRA {section.sutra.number}
            </p>
            <p style={{ fontSize: 14, color: "#5a3010", lineHeight: 1.8 }}>
              {insight}
            </p>
            {pageNum && (
              <p style={{ fontSize: 10, color: "#8a6030", marginTop: 12, textAlign: "right" }}>
                — Patanjali Yoga Sutras, p.{pageNum}
              </p>
            )}
          </div>

          {/* Sutra reminder */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #f0d8b8",
              padding: "12px 14px",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 9, fontWeight: 500, color: "#8a6030", letterSpacing: "0.08em", marginBottom: 6 }}>THE SUTRA</p>
            <p style={{ fontSize: 12, color: "#5a3010", lineHeight: 1.7, fontStyle: "italic" }}>
              {section.sutra.meaning}
            </p>
          </div>

          {/* Back CTA */}
          <Link
            href={backPath}
            className="w-full flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#c48450,#e8b070)", borderRadius: 14, padding: 13 }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
            <Check style={{ width: 14, height: 14, color: "#fff" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
