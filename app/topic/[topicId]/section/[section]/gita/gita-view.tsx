"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

export function GitaView({
  topicId,
  section,
}: {
  topicId: string;
  section: SectionData;
}) {
  const router = useRouter();
  const completeStep = useAppStore((s) => s.completeStep);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const answers = getSectionAnswers(topicId, section.section);
  const done = answers.completedSteps.includes("gita");

  function handleDone() {
    completeStep(topicId, section.section, "gita");
    router.push(`/topic/${topicId}/section/${section.section}`);
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
          <h1 className="text-lg font-bold text-foreground">Wisdom from the Gita</h1>
        </div>
      </div>

      <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50/80 to-blue-50/60">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-500 opacity-70" />
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
            Gita Wisdom
          </span>
        </div>
        
        {section.shlokaFrom && (
          <>
            <p className="font-devanagari text-xl leading-relaxed text-foreground mb-4 whitespace-pre-wrap break-words">
              {section.shlokaFrom}
            </p>
            <div className="h-px bg-indigo-200/40 my-4" />
          </>
        )}
        
        {section.wisdomFrom && (
          <p className="text-sm text-foreground/80 leading-relaxed">
            {section.wisdomFrom}
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
        <div className="max-w-lg mx-auto">
          {done ? (
            <Link href={backPath}>
              <Button
                className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md shadow-green-200/50"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Completed — Back to Section
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleDone}
              className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md shadow-indigo-200/50"
            >
              I&apos;ve read this
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
