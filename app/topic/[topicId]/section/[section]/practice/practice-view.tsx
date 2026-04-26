"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Timer, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

export function PracticeView({
  topicId,
  section,
}: {
  topicId: string;
  section: SectionData;
}) {
  const router = useRouter();
  const savePractice = useAppStore((s) => s.savePractice);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const done = answers.completedSteps.includes("practice");

  const [text, setText] = useState(answers.practiceAnswer ?? "");
  const [submitted, setSubmitted] = useState(done);

  function handleSubmit() {
    if (!text.trim()) return;
    savePractice(topicId, section.section, text.trim());
    setSubmitted(true);
  }

  const backPath = `/topic/${topicId}/section/${section.section}`;

  return (
    <div className="space-y-5 pb-28">
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
          <h1 className="text-lg font-bold text-foreground">Micro Practice</h1>
        </div>
      </div>

      {/* Practice action */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="w-4 h-4 text-violet-500 opacity-70" />
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">
            Today&apos;s Practice
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {section.practice}
        </p>
      </div>

      {/* Meditation */}
      {section.meditation && (
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-4 h-4 text-blue-500 opacity-70" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Meditation
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {section.meditation}
          </p>
        </div>
      )}

      {/* Q&A */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
          How did the practice feel?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience — what did you notice?"
          rows={5}
          disabled={submitted}
          className={`w-full rounded-2xl p-4 text-sm leading-relaxed resize-none transition-all focus:outline-none focus:ring-2 focus:ring-violet-200 ${
            submitted
              ? "bg-violet-50/50 text-foreground/80 border border-violet-100"
              : "bg-white border border-gray-100 shadow-sm placeholder:text-muted-foreground/40"
          }`}
        />
        {submitted && (
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 className="w-4 h-4 text-violet-500" />
            <span className="text-xs text-violet-600 font-medium">
              Practice response saved
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
        <div className="max-w-lg mx-auto">
          {submitted ? (
            <Link href={backPath}>
              <Button
                className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-md shadow-violet-200/50"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Done — Back to Section
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={`w-full h-12 text-base font-semibold rounded-2xl transition-all ${
                text.trim()
                  ? "bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-md shadow-violet-200/50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save Response
              <Send className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
