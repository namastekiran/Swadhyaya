"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { TopicData, SectionStatus } from "@/lib/types";

function SectionRow({
  topicId,
  sectionNum,
  sutraNumber,
  meaning,
  theme,
  status,
  isLast,
  index,
}: {
  topicId: string;
  sectionNum: number;
  sutraNumber: string;
  meaning: string;
  theme: string;
  status: SectionStatus;
  isLast: boolean;
  index: number;
}) {
  const isDone = status === "done";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  const lockedOpacity = Math.max(0.12, 0.45 - index * 0.12);

  const dot = (
    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
      {isDone && (
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a8e0", border: "2px solid #fdfcff", marginTop: 4 }} />
      )}
      {isCurrent && (
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#a389d4", border: "2.5px solid #fdfcff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
        </div>
      )}
      {isLocked && (
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ddd6f0", border: "2px solid #fdfcff", marginTop: 6 }} />
      )}
      {!isLast && (
        <div style={{ width: 2, background: "#ede8f7", flex: 1, minHeight: 40, marginTop: 4, borderRadius: 4 }} />
      )}
    </div>
  );

  if (isDone) {
    return (
      <Link href={`/topic/${topicId}/section/${sectionNum}`} className="flex gap-3 mb-4">
        {dot}
        <div className="flex-1 flex items-center justify-between pb-4">
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#a389d4" }}>{theme}</p>
            <p style={{ fontSize: 10, color: "#c0b0d8", marginTop: 1 }}>Sutra {sutraNumber} · completed</p>
          </div>
          <Check style={{ width: 12, height: 12, color: "#c9a8e0", flexShrink: 0 }} />
        </div>
      </Link>
    );
  }

  if (isCurrent) {
    return (
      <div className="flex gap-3 mb-4">
        {dot}
        <div className="flex-1 pb-4">
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e0d5f5", padding: 14, boxShadow: "0 2px 12px rgba(163,137,212,0.1)" }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#a389d4", letterSpacing: "0.07em", marginBottom: 4 }}>NOW</p>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#3d2f5e", marginBottom: 3 }}>{theme}</p>
            <p style={{ fontSize: 11, color: "#b0a0c8", marginBottom: 10, lineHeight: 1.4 }}>
              Sutra {sutraNumber}{meaning ? ` — ${meaning.slice(0, 60)}${meaning.length > 60 ? "…" : ""}` : ""}
            </p>
            <Link
              href={`/topic/${topicId}/section/${sectionNum}`}
              className="flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#a389d4,#c9a8e0)", borderRadius: 8, padding: "9px 12px" }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>Begin session</span>
              <ArrowRight style={{ width: 12, height: 12, color: "#fff" }} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Locked
  return (
    <button
      onClick={() => toast.info("Complete the previous section first")}
      className="flex gap-3 mb-4 w-full text-left"
      style={{ opacity: lockedOpacity }}
    >
      {dot}
      <div className="flex-1 pb-4">
        <p style={{ fontSize: 13, fontWeight: 500, color: "#3d2f5e" }}>{theme}</p>
        <p style={{ fontSize: 10, color: "#c0b0d8", marginTop: 1 }}>Sutra {sutraNumber}</p>
      </div>
    </button>
  );
}

export function JourneyList({ topic }: { topic: TopicData }) {
  const [mounted, setMounted] = useState(false);
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getTopicProgress = useAppStore((s) => s.getTopicProgress);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const progress = getTopicProgress(topic.id);
  const completedCount = progress.completedSections.length;
  const progressPercent = topic.totalSections > 0 ? (completedCount / topic.totalSections) * 100 : 0;

  const lockedSections = topic.sections.filter(s => getSectionStatus(topic.id, s.section) === "locked");

  return (
    <div className="pb-20 -mx-6">
      <div
        className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]"
        style={{ background: "#fdfcff" }}
      >
        {/* Lavender header */}
        <div style={{ background: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)", padding: "24px 22px 26px" }}>
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/"
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 12, height: 12, color: "#7c5cbf" }} />
            </Link>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#3d2f5e" }}>{topic.title}</p>
              <p style={{ fontSize: 11, color: "#b0a0c8" }}>{topic.tagline} · {topic.totalSections} sessions</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 11, color: "#b0a0c8" }}>
              Session {completedCount + 1} of {topic.totalSections}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7c5cbf" }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.5)", borderRadius: 4 }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#a389d4", borderRadius: 4, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: "20px 22px 26px" }}>
          <p style={{ fontSize: 9, fontWeight: 500, color: "#c0b0d8", letterSpacing: "0.08em", marginBottom: 14 }}>
            YOUR PATH
          </p>

          <div style={{ borderLeft: "2px solid #ede8f7", paddingLeft: 16 }}>
            {topic.sections.map((section, i) => {
              const status: SectionStatus = getSectionStatus(topic.id, section.section);
              const lockedIndex = lockedSections.findIndex(s => s.section === section.section);
              return (
                <SectionRow
                  key={section.section}
                  topicId={topic.id}
                  sectionNum={section.section}
                  sutraNumber={section.sutra.number.replace(/,\s*/g, " · ")}
                  meaning={section.sutra.meaning}
                  theme={section.theme}
                  status={status}
                  isLast={i === topic.sections.length - 1}
                  index={lockedIndex >= 0 ? lockedIndex : 0}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
