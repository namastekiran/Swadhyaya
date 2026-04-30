"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TopicData } from "@/lib/types";

const STOP_WORDS = new Set([
  "the","and","that","have","for","not","with","you","this","but","from","they",
  "will","when","what","your","which","there","their","about","been","more","also",
  "into","then","than","some","could","would","should","after","each","just","even",
  "most","over","such","like","very","only","both","back","well","were","while",
  "where","those","during","before","through","always","never","every","again",
]);

function extractTags(text: string): string[] {
  const words = text.split(/\s+/);
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const raw of words) {
    const word = raw.replace(/[^a-zA-Z]/g, "");
    if (word.length < 5) continue;
    const lower = word.toLowerCase();
    if (STOP_WORDS.has(lower) || seen.has(lower)) continue;
    seen.add(lower);
    tags.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    if (tags.length >= 3) break;
  }
  return tags;
}

function formatEntryDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isThisWeek(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
}

interface JournalEntry {
  sectionNum: number;
  theme: string;
  text: string;
  savedAt: string;
}

export function JournalList({ topic }: { topic: TopicData }) {
  const answers = useAppStore((s) => s.answers);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Collect all journal entries for this topic
  const entries: JournalEntry[] = [];
  for (const section of topic.sections) {
    const key = `${topic.id}::${section.section}`;
    const ans = answers[key];
    if (ans?.journalEntry && ans.updatedAt) {
      entries.push({
        sectionNum: section.section,
        theme: section.theme,
        text: ans.journalEntry,
        savedAt: ans.updatedAt,
      });
    }
  }
  // Newest first
  entries.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  // Auto-expand the most recent
  const [autoExpanded] = useState(() => {
    if (entries.length > 0) return new Set([entries[0].sectionNum]);
    return new Set<number>();
  });
  const [expandedSet, setExpandedSet] = useState<Set<number>>(autoExpanded);

  function toggle(sectionNum: number) {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(sectionNum)) next.delete(sectionNum);
      else next.add(sectionNum);
      return next;
    });
  }

  const thisWeek = entries.filter((e) => isThisWeek(e.savedAt));
  const earlier = entries.filter((e) => !isThisWeek(e.savedAt));

  const backPath = `/topic/${topic.id}`;

  function renderEntry(entry: JournalEntry, strong: boolean) {
    const open = expandedSet.has(entry.sectionNum);
    const tags = extractTags(entry.text);
    return (
      <div
        key={entry.sectionNum}
        style={{
          background: "#fff",
          borderRadius: 16,
          border: strong && open ? "1.5px solid #e0d5f5" : "1px solid #ede8f7",
          padding: 14,
          marginBottom: 8,
          boxShadow: strong && open ? "0 2px 10px rgba(163,137,212,0.08)" : "none",
        }}
      >
        <button
          onClick={() => toggle(entry.sectionNum)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#3d2f5e" }}>{entry.theme}</p>
              <p style={{ fontSize: 10, color: "#b0a0c8", marginTop: 2 }}>
                Session {entry.sectionNum} · {formatEntryDate(entry.savedAt)}
              </p>
            </div>
            <div
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: open ? "#f0ebff" : "#f7f4ff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {open
                ? <ChevronUp style={{ width: 10, height: 10, color: "#a389d4" }} />
                : <ChevronDown style={{ width: 10, height: 10, color: "#c0b0d8" }} />
              }
            </div>
          </div>
        </button>

        {open && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 12, color: "#5a4a7a", lineHeight: 1.7, padding: "10px 12px", background: "#faf8ff", borderRadius: 10, marginBottom: 10 }}>
              &ldquo;{entry.text}&rdquo;
            </p>
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span key={tag} style={{ padding: "4px 10px", background: "#f0ebff", borderRadius: 20, fontSize: 10, color: "#a389d4" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#fdfcff" }}>

        {/* Lavender header */}
        <div style={{ background: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)", padding: "20px 20px 22px" }}>
          <div className="flex items-center gap-3">
            <Link
              href={backPath}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#7c5cbf" }} />
            </Link>
            <div>
              <p style={{ fontSize: 10, color: "#b0a0c8" }}>{topic.title}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#3d2f5e" }}>My Journal</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontSize: 13, color: "#b0a0c8", lineHeight: 1.6 }}>
                Your journal entries will appear here after each session.
              </p>
            </div>
          ) : (
            <>
              {thisWeek.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 9, fontWeight: 500, color: "#c0b0d8", letterSpacing: "0.07em", marginBottom: 8 }}>THIS WEEK</p>
                  {thisWeek.map((e, i) => renderEntry(e, i === 0))}
                </div>
              )}

              {earlier.length > 0 && (
                <div>
                  <p style={{ fontSize: 9, fontWeight: 500, color: "#c0b0d8", letterSpacing: "0.07em", marginBottom: 8 }}>EARLIER</p>
                  {earlier.map((e) => renderEntry(e, false))}
                </div>
              )}
            </>
          )}

          {/* Your words, your mirror */}
          <div style={{ background: "#f7f4ff", borderRadius: 12, padding: "12px 14px", borderLeft: "3px solid #c9a8e0", marginTop: 8 }}>
            <p style={{ fontSize: 11, color: "#a389d4", fontWeight: 500, marginBottom: 2 }}>Your words, your mirror</p>
            <p style={{ fontSize: 11, color: "#b0a0c8", lineHeight: 1.5 }}>Each entry is a reflection of where you were. Read them as the journey unfolds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
