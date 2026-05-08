"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";
import { IMAGES, pickForTopic } from "@/lib/images";

type Block = { type: "numbered"; num: string; content: string[] } | { type: "para"; content: string[] };

function formatInsight(raw: string) {
  // Strip wrapping quotes Excel sometimes adds
  const text = raw.replace(/^["]+|["]+$/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Group lines: numbered items can span multiple lines
  const blocks: Block[] = [];
  for (const line of lines) {
    const numMatch = line.match(/^(\d+)[).]\s+(.*)/);
    if (numMatch) {
      blocks.push({ type: "numbered", num: numMatch[1], content: [numMatch[2]] });
    } else if (blocks.length && blocks[blocks.length - 1].type === "numbered") {
      blocks[blocks.length - 1].content.push(line);
    } else if (blocks.length && blocks[blocks.length - 1].type === "para") {
      blocks[blocks.length - 1].content.push(line);
    } else {
      blocks.push({ type: "para", content: [line] });
    }
  }

  return blocks.map((block, i) => {
    if (block.type === "numbered") {
      const full = block.content.join(" ");
      const colonIdx = full.indexOf(":");
      const label = colonIdx > 0 && colonIdx < 50 ? full.slice(0, colonIdx) : null;
      const rest = label ? full.slice(colonIdx + 1).trim() : full;
      return (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
          <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "#fde8c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#b87840", marginTop: 2 }}>
            {block.num}
          </span>
          <p style={{ fontSize: 14, color: "#5a3010", lineHeight: 1.8, flex: 1, margin: 0 }}>
            {label && <span style={{ fontWeight: 700, color: "#8a4820" }}>{label}: </span>}
            {rest}
          </p>
        </div>
      );
    }

    const paraText = block.content.join(" ");

    // Detect inline list: "(1) Word (2) Word ..."
    const inlineMatches = [...paraText.matchAll(/\((\d+)\)\s+([^(]+)/g)];
    if (inlineMatches.length >= 3) {
      const before = paraText.slice(0, inlineMatches[0].index!).trim();
      return (
        <div key={i} style={{ marginBottom: 14 }}>
          {before && <p style={{ fontSize: 14, color: "#5a3010", lineHeight: 1.8, marginBottom: 10 }}>{before}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {inlineMatches.map(m => (
              <span key={m[1]} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fdf0e0", border: "1px solid #f0d8b8", borderRadius: 20, padding: "3px 10px 3px 4px", fontSize: 12 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fde8c8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#b87840" }}>{m[1]}</span>
                <span style={{ color: "#5a3010" }}>{m[2].trim()}</span>
              </span>
            ))}
          </div>
        </div>
      );
    }

    // "Term: explanation" highlight
    const colonMatch = paraText.match(/^([^:]{2,40}):\s+([\s\S]+)/);
    if (colonMatch) {
      return (
        <p key={i} style={{ fontSize: 14, color: "#5a3010", lineHeight: 1.8, marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: "#8a4820" }}>{colonMatch[1]}:</span>{" "}{colonMatch[2]}
        </p>
      );
    }

    return (
      <p key={i} style={{ fontSize: 14, color: "#5a3010", lineHeight: 1.8, marginBottom: 10 }}>
        {paraText}
      </p>
    );
  });
}

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

        {/* Full-bleed photo with overlaid nav */}
        <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pickForTopic(IMAGES.gurudev, topicId)}
            alt="Gurudev Sri Sri Ravi Shankar"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
          />
          {/* Top gradient for back button readability */}
          <div style={{ position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 40%, transparent 55%, rgba(20,10,5,0.55) 100%)" }} />
          {/* Back button + title overlaid at top */}
          <div style={{ position: "absolute", top: 20, left: 20, right: 20 }}>
            <div className="flex items-center gap-3">
              <Link href={backPath} className="flex items-center justify-center flex-shrink-0"
                style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
                <ArrowLeft style={{ width: 12, height: 12, color: "#fff" }} />
              </Link>
              <div>
                {section.theme && !/^\d+[\.\d\n]*$/.test(section.theme.trim()) && (
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{section.theme.replace(/[.!?]+$/, '')}</p>
                )}
                <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Deep Dive with Gurudev</p>
              </div>
            </div>
          </div>
          {/* Name at bottom of photo */}
          <div style={{ position: "absolute", bottom: 18, left: 20, right: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              Gurudev Sri Sri Ravi Shankar
            </p>
          </div>
          {/* Fade into card background */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
            background: "linear-gradient(to bottom, transparent, #f8f4ff)" }} />
        </div>

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
            <p style={{ fontSize: 9, fontWeight: 500, color: "#8a6030", letterSpacing: "0.08em", marginBottom: 12 }}>
              COMMENTARY ON SUTRA {section.sutra.number}
            </p>
            <div>{formatInsight(insight)}</div>
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
