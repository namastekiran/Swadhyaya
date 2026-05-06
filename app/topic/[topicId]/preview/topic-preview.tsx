"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { ImageHeader } from "@/components/ImageHeader";
import { IMAGES, pickForTopic } from "@/lib/images";
import type { TopicData } from "@/lib/types";

const ICON_TO_IMAGES: Record<string, string[]> = {
  "book-open":  IMAGES.sutra,
  orbit:        IMAGES.gita,
  moon:         IMAGES.reflection,
  heart:        IMAGES.reflection,
  "cloud-rain": IMAGES.reflection,
};

function heroImage(topic: TopicData) {
  const set = ICON_TO_IMAGES[topic.icon] ?? IMAGES.journeyList;
  return pickForTopic(set, topic.id);
}

const STEP_LABELS: Record<string, string> = {
  sutra: "Sutra", reflection: "Reflection", practice: "Practice",
  gita: "Gita", gurudev: "Gurudev", journal: "Journal",
};

function getStepsForTopic(topic: TopicData): string[] {
  const s = topic.sections[0];
  if (!s) return ["Sutra", "Reflection", "Practice", "Journal"];
  const steps = ["Sutra", "Reflection", "Practice"];
  if (s.shlokaFrom || s.wisdomFrom) steps.push("Gita");
  if (s.gurudevInsight) steps.push("Gurudev");
  steps.push("Journal");
  return steps;
}

function SessionRow({ s, divider }: { s: TopicData["sections"][number]; divider: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: divider ? "1px solid #ede8f8" : "none" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#ede8f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#7c5cbf", flexShrink: 0 }}>
        {s.section}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: "#3d2f5e", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {/^\d+[\.\d\n\s]*$/.test(s.theme?.trim() ?? "") ? `Sutra ${s.sutra.number}` : s.theme}
        </p>
        <p style={{ fontSize: 10, color: "#9a88b8" }}>Sutra {s.sutra.number}</p>
      </div>
    </div>
  );
}

export function TopicPreview({ topic }: { topic: TopicData }) {
  const router = useRouter();
  const PREVIEW_COUNT = 3;
  const [expanded, setExpanded] = useState(false);
  const shown = topic.sections.slice(0, PREVIEW_COUNT);
  const rest = topic.sections.slice(PREVIEW_COUNT);
  const remaining = topic.totalSections - PREVIEW_COUNT;
  const steps = getStepsForTopic(topic);

  // Group steps into pairs for pills
  const stepPills: string[] = [];
  for (let i = 0; i < steps.length; i += 2) {
    stepPills.push(steps.slice(i, i + 2).join(" · "));
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        <ImageHeader
          imageUrl={heroImage(topic)}
          overlay="linear-gradient(160deg,rgba(60,30,110,0.42) 0%,rgba(40,18,80,0.82) 100%)"
          height={200}
          padding="20px 20px 22px"
        >
          {/* Back button */}
          <Link href="/" className="flex items-center justify-center flex-shrink-0 mb-auto"
            style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", marginBottom: 40 }}>
            <ArrowLeft style={{ width: 12, height: 12, color: "#fff" }} />
          </Link>

          {/* Title block */}
          <div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.70)", letterSpacing: "0.10em", marginBottom: 4 }}>
              JOURNEY · {topic.totalSections} SESSIONS
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>
              {topic.title}
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
              {topic.tagline}
            </p>
          </div>
        </ImageHeader>

        <div style={{ padding: "20px 18px 26px" }}>

          {/* Description */}
          <p style={{ fontSize: 13, color: "#5a4880", lineHeight: 1.7, marginBottom: 18 }}>
            {topic.description}
          </p>

          {/* Stats pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#ede8f8", borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a389d4", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#5a3aaa", fontWeight: 500 }}>{topic.totalSections} sessions</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#ede8f8", borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a389d4", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#5a3aaa", fontWeight: 500 }}>~15 min each</span>
            </div>
            {stepPills.map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 5, background: "#ede8f8", borderRadius: 20, padding: "5px 12px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a389d4", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#5a3aaa", fontWeight: 500 }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Session glimpse */}
          <p style={{ fontSize: 9, fontWeight: 700, color: "#9a88b8", letterSpacing: "0.10em", marginBottom: 12 }}>
            WHAT YOU&apos;LL EXPLORE
          </p>
          <div style={{ marginBottom: 22 }}>
            {shown.map((s, i) => (
              <SessionRow key={s.section} s={s} divider={i < shown.length - 1 || (expanded && rest.length > 0)} />
            ))}
            {expanded && rest.map((s, i) => (
              <SessionRow key={s.section} s={s} divider={i < rest.length - 1} />
            ))}
            {remaining > 0 && (
              <button
                onClick={() => setExpanded(e => !e)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 0", background: "none", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontSize: 11, color: "#a389d4", fontWeight: 500 }}>
                  {expanded ? "Show less" : `+ ${remaining} more session${remaining > 1 ? "s" : ""}`}
                </span>
                {expanded
                  ? <ChevronUp style={{ width: 12, height: 12, color: "#a389d4" }} />
                  : <ChevronDown style={{ width: 12, height: 12, color: "#a389d4" }} />
                }
              </button>
            )}
          </div>

          {/* CTAs */}
          <Link
            href={`/topic/${topic.id}`}
            className="w-full flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#7c4fc4,#a389d4)", borderRadius: 16, padding: "15px 20px", marginBottom: 10 }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Begin Journey</span>
            <ArrowRight style={{ width: 16, height: 16, color: "#fff" }} />
          </Link>

          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2"
            style={{ borderRadius: 16, padding: "13px 20px", border: "1.5px solid #c8b8e8", background: "transparent", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, color: "#7c5cbf", fontWeight: 500 }}>Maybe Later</span>
          </button>

        </div>
      </div>
    </div>
  );
}
