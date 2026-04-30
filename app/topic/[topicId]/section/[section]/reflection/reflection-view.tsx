"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Trash2, Clock } from "lucide-react";
import { AiChat } from "@/components/AiChat";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const DEFAULT_ANSWERS = { reflections: [], savedChats: [], completedSteps: [] };

export function ReflectionView({ topicId, section }: { topicId: string; section: SectionData }) {
  const saveReflection = useAppStore((s) => s.saveReflection);
  const deleteReflection = useAppStore((s) => s.deleteReflection);
  const saveAiChat = useAppStore((s) => s.saveAiChat);
  const profile = useAppStore((s) => s.profile);

  const answersKey = `${topicId}::${section.section}`;
  const answers = useAppStore((s) => s.answers[answersKey] ?? DEFAULT_ANSWERS);
  const reflections = answers.reflections ?? [];
  const hasReflections = reflections.length > 0;
  const alreadyDone = (answers.completedSteps ?? []).includes("reflection");

  const [text, setText] = useState("");
  const [showAi, setShowAi] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const backPath = `/topic/${topicId}/section/${section.section}`;
  const words = wordCount(text);

  function handleSave() {
    if (!text.trim()) return;
    saveReflection(topicId, section.section, text.trim());
    setText("");
  }

  // Split prompt into main + sub if multiple sentences
  const sentences = section.reflectionPrompt.split(/(?<=[.?!])\s+/);
  const mainPrompt = sentences[0] ?? section.reflectionPrompt;
  const subPrompt = sentences.slice(1).join(" ");

  if (showAi) {
    return (
      <div className="pb-20 -mx-6 px-4">
        <AiChat
          sutraNumber={section.sutra.number}
          sutraMeaning={section.sutra.meaning}
          insight={section.insight}
          reflectionPrompt={section.reflectionPrompt}
          userName={profile?.name}
          userIntention={profile?.intention}
          savedChats={answers.savedChats ?? []}
          onSaveChat={(msgs) => saveAiChat(topicId, section.section, msgs)}
          onClose={() => setShowAi(false)}
        />
      </div>
    );
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#fdfcff" }}>

        {/* Blush header */}
        <div style={{ background: "linear-gradient(160deg,#fce8ea 0%,#fdf3f0 100%)", padding: "20px 20px 22px" }}>
          <div className="flex items-center gap-3">
            <Link
              href={backPath}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft style={{ width: 11, height: 11, color: "#c4707a" }} />
            </Link>
            <div>
              <p style={{ fontSize: 10, color: "#c8a0a8" }}>{section.theme}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#5e2f38" }}>Reflection</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 20px 24px" }}>

          {/* Sit with this */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#c8a0a8", letterSpacing: "0.08em", marginBottom: 10 }}>SIT WITH THIS</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#5e2f38", lineHeight: 1.6 }}>{mainPrompt}</p>
            {subPrompt && (
              <p style={{ fontSize: 12, color: "#c8a0a8", marginTop: 6, lineHeight: 1.6 }}>{subPrompt}</p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#ede8f7", marginBottom: 18 }} />

          {/* Textarea */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: "#c8a0a8", letterSpacing: "0.08em", marginBottom: 10 }}>YOUR REFLECTION</p>
            <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f0d0d8", padding: 14, position: "relative" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Let your thoughts flow here. There is no right answer, only honest ones..."
                rows={5}
                className="w-full resize-none outline-none"
                style={{ fontSize: 12, color: "#5e2f38", lineHeight: 1.7, background: "transparent", border: "none" }}
              />
              <p style={{ fontSize: 10, color: "#e0b8c0", textAlign: "right", marginTop: 4 }}>{words} words</p>
            </div>
          </div>

          {/* Encouragement */}
          <p style={{ fontSize: 11, color: "#c8a0a8", textAlign: "center", marginBottom: 18 }}>
            Even a few words carry meaning 🌿
          </p>

          {/* Past reflections toggle */}
          {hasReflections && (
            <button
              onClick={() => setShowPast(!showPast)}
              className="w-full text-left mb-4"
              style={{ fontSize: 11, color: "#c4707a", fontWeight: 500 }}
            >
              {showPast ? "Hide" : `View`} past reflections ({reflections.length}) ›
            </button>
          )}

          {showPast && (
            <div className="space-y-2 mb-4">
              {reflections.map((entry, i) => (
                <div key={i} style={{ background: "#fff5f6", borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: 12, color: "#7a3040", lineHeight: 1.6 }}>{entry.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Clock style={{ width: 10, height: 10, color: "#c8a0a8" }} />
                      <span style={{ fontSize: 10, color: "#c8a0a8" }}>{formatDate(entry.savedAt)}</span>
                    </div>
                    <button onClick={() => deleteReflection(topicId, section.section, i)}>
                      <Trash2 style={{ width: 12, height: 12, color: "#dda0a8" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI explore card */}
          <div
            onClick={() => setShowAi(true)}
            className="cursor-pointer flex items-center gap-3 mb-5"
            style={{ background: "linear-gradient(135deg,#fce8ea,#fff0f3)", borderRadius: 14, padding: "14px 16px", border: "1px solid #f0d0d8" }}
          >
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 12, background: "#f5d8dc" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4707a" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#5e2f38", marginBottom: 2 }}>Explore deeper with AI</p>
              <p style={{ fontSize: 11, color: "#c8a0a8", lineHeight: 1.4 }}>Ask questions, go further into this sutra</p>
            </div>
            <ArrowRight style={{ width: 13, height: 13, color: "#c4707a" }} />
          </div>

          {/* Save CTA */}
          {alreadyDone && !text.trim() ? (
            <Link
              href={backPath}
              className="w-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#c4707a,#dda0a8)", borderRadius: 14, padding: 13 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>Back to session</span>
              <Check style={{ width: 14, height: 14, color: "#fff" }} />
            </Link>
          ) : (
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="w-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{
                background: text.trim() ? "linear-gradient(135deg,#c4707a,#dda0a8)" : "#f5e0e3",
                borderRadius: 14,
                padding: 13,
                cursor: text.trim() ? "pointer" : "not-allowed",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: text.trim() ? "#fff" : "#c8a0a8" }}>
                Save my reflection
              </span>
              <Check style={{ width: 14, height: 14, color: text.trim() ? "#fff" : "#c8a0a8" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
