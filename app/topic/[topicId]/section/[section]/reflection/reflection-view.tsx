"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  CheckCircle2,
  Send,
  Plus,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiChat } from "@/components/AiChat";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReflectionView({
  topicId,
  section,
}: {
  topicId: string;
  section: SectionData;
}) {
  const saveReflection = useAppStore((s) => s.saveReflection);
  const deleteReflection = useAppStore((s) => s.deleteReflection);
  const saveAiChat = useAppStore((s) => s.saveAiChat);
  const profile = useAppStore((s) => s.profile);
  const answersKey = `${topicId}::${section.section}`;
  const answers = useAppStore(
    (s) => s.answers[answersKey] ?? { reflections: [], savedChats: [], completedSteps: [] }
  );
  const reflections = answers.reflections ?? [];
  const hasReflections = reflections.length > 0;

  const [text, setText] = useState("");
  const [showInput, setShowInput] = useState(!hasReflections);
  const [showAi, setShowAi] = useState(false);

  function handleSubmit() {
    if (!text.trim()) return;
    saveReflection(topicId, section.section, text.trim());
    setText("");
    setShowInput(false);
  }

  const backPath = `/topic/${topicId}/section/${section.section}`;

  return (
    <div className="space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={backPath}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">
            {section.theme}
          </p>
          <h1 className="text-lg font-bold text-foreground">Reflection</h1>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-teal-500 opacity-70" />
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
            Reflect on this
          </span>
        </div>
        <p className="text-base font-medium text-foreground leading-relaxed">
          {section.reflectionPrompt}
        </p>
      </div>

      {/* AI Insights button or chat */}
      {showAi ? (
        <AiChat
          sutraNumber={section.sutra.number}
          sutraMeaning={section.sutra.meaning}
          insight={section.insight}
          reflectionPrompt={section.reflectionPrompt}
          userName={profile?.name}
          userIntention={profile?.intention}
          savedChats={answers.savedChats ?? []}
          onSaveChat={(msgs) =>
            saveAiChat(topicId, section.section, msgs)
          }
          onClose={() => setShowAi(false)}
        />
      ) : (
        <button
          onClick={() => setShowAi(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 hover:shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-left flex-1">
            <span className="text-sm font-semibold text-foreground">
              Get Insights from AI
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ask questions and explore this sutra deeper
            </p>
          </div>
        </button>
      )}

      {/* Past reflections */}
      {hasReflections && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Your reflections
            </span>
            <span className="text-xs text-muted-foreground">
              {reflections.length}{" "}
              {reflections.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="space-y-2">
            {reflections.map((entry, i) => (
              <div
                key={i}
                className="rounded-xl p-4 bg-white border border-teal-100/60 group"
              >
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {entry.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-[11px] text-muted-foreground/60">
                      {formatDate(entry.savedAt)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      deleteReflection(topicId, section.section, i)
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New reflection input */}
      {showInput ? (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
            {hasReflections ? "Add another reflection" : "Your thoughts"}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Take a moment to reflect and write your thoughts here..."
            rows={5}
            autoFocus
            className="w-full rounded-2xl p-4 text-sm leading-relaxed resize-none bg-white border border-gray-100 shadow-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
          />
          <div className="flex gap-2">
            {hasReflections && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowInput(false);
                  setText("");
                }}
                className="flex-1 h-10 rounded-xl text-sm border-gray-200"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={`flex-1 h-10 text-sm font-semibold rounded-xl transition-all ${
                text.trim()
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-md shadow-teal-200/50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save
              <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-teal-200/60 text-teal-600 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add another reflection
        </button>
      )}

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
        <div className="max-w-lg mx-auto">
          <Link href={backPath}>
            <Button
              className={`w-full h-12 text-base font-semibold rounded-2xl ${
                hasReflections
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-md shadow-teal-200/50"
                  : "bg-white border border-gray-200 text-foreground hover:bg-gray-50"
              }`}
            >
              {hasReflections && <CheckCircle2 className="w-5 h-5 mr-2" />}
              {hasReflections ? "Done — Back to Section" : "Back to Section"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
