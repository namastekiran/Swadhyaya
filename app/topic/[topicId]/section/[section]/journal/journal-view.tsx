"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Lock, PenLine, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function JournalView({ topicId, section }: { topicId: string; section: SectionData }) {
  const router = useRouter();
  const saveJournal = useAppStore((s) => s.saveJournal);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const alreadyDone = answers.completedSteps.includes("journal");

  const [text, setText] = useState(answers.journalEntry ?? "");
  const backPath = `/topic/${topicId}/section/${section.section}`;
  const words = wordCount(text);

  // Split prompt: main sentence + sub
  const sentences = (section.journalPrompt ?? "").split(/(?<=[.?!])\s+/);
  const mainPrompt = sentences[0] ?? section.journalPrompt;
  const subPrompt = sentences.slice(1).join(" ");

  function handleSave() {
    if (!text.trim()) return;
    saveJournal(topicId, section.section, text.trim());
    router.push(backPath);
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#fdfcff" }}>

        {/* Lavender header */}
        <div style={{ background: "linear-gradient(160deg,#e6eef8 0%,#f0f4fb 100%)", padding: "20px 20px 22px" }}>
          <div className="flex items-center gap-3">
            <Link
              href={backPath}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#5a7aa0" }} />
            </Link>
            <div>
              <p style={{ fontSize: 10, color: "#90a8c8" }}>{section.theme}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#2a3a5e" }}>Journal</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Date + privacy */}
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#90a8c8" }}>{formatDate(new Date())}</p>
            <div className="flex items-center gap-1">
              <Lock style={{ width: 10, height: 10, color: "#90a8c8" }} />
              <span style={{ fontSize: 10, color: "#90a8c8" }}>Only visible to you</span>
            </div>
          </div>

          {/* Today's prompt */}
          <div style={{ background: "linear-gradient(135deg,#e6eef8,#f0f8ff)", borderRadius: 14, padding: "14px 16px", border: "1px solid #e8dff5", marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#5a7aa0", letterSpacing: "0.08em", marginBottom: 8 }}>TODAY&apos;S PROMPT</p>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#2a3a5e", lineHeight: 1.6 }}>{mainPrompt}</p>
            {subPrompt && (
              <p style={{ fontSize: 12, color: "#90a8c8", marginTop: 6, lineHeight: 1.5 }}>{subPrompt}</p>
            )}
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #c8d8f0", padding: 14, position: "relative" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write freely — this is your private space..."
                rows={6}
                className="w-full resize-none outline-none"
                style={{ fontSize: 12, color: "#2a3a5e", lineHeight: 1.8, background: "transparent", border: "none" }}
              />
              <p style={{ fontSize: 10, color: "#d0c8e8", textAlign: "right", marginTop: 4 }}>{words} words</p>
            </div>
          </div>

          {/* Encouragement */}
          <p style={{ fontSize: 11, color: "#90a8c8", textAlign: "center", marginBottom: 18 }}>
            No right or wrong — just you and the page 🌿
          </p>

          {/* Past entries link */}
          <Link
            href={`/topic/${topicId}/journal`}
            className="flex items-center justify-between"
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #d8e8f8", padding: "11px 14px", marginBottom: 18 }}
          >
            <div className="flex items-center gap-2">
              <PenLine style={{ width: 14, height: 14, color: "#5a7aa0" }} />
              <span style={{ fontSize: 12, color: "#2a3a5e" }}>View past entries</span>
            </div>
            <ArrowRight style={{ width: 13, height: 13, color: "#5a7aa0" }} />
          </Link>

          {/* CTA */}
          {alreadyDone && !text.trim() ? (
            <Link
              href={backPath}
              className="w-full flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#5a7aa0,#90a8c8)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </Link>
          ) : (
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="w-full flex items-center justify-center gap-2"
              style={{
                background: text.trim() ? "linear-gradient(135deg,#5a7aa0,#90a8c8)" : "#d8e8f8",
                borderRadius: 14,
                padding: 13,
                cursor: text.trim() ? "pointer" : "not-allowed",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: text.trim() ? "#fff" : "#90a8c8" }}>
                Save my entry
              </span>
              <Check style={{ width: 14, height: 14, color: text.trim() ? "#fff" : "#90a8c8" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
