"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { SectionData } from "@/lib/types";

export function SutraView({
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
  const done = answers.completedSteps.includes("sutra");

  function handleDone() {
    completeStep(topicId, section.section, "sutra");
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
            Section {section.section}
          </p>
          <h1 className="text-lg font-bold text-foreground">Sutra & Insight</h1>
        </div>
      </div>

      {/* Sutra card */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/60">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-500 opacity-70" />
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
            Sutra {section.sutra.number}
          </span>
        </div>
        <p className="font-devanagari text-2xl leading-relaxed text-foreground mb-4">
          {section.sutra.sanskrit}
        </p>
        <p className="text-xs text-muted-foreground italic mb-3">
          {section.sutra.transliteration}
        </p>
        <div className="h-px bg-amber-200/40 my-4" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          {section.sutra.meaning}
        </p>
      </div>

      {/* Insight card */}
      {section.insight && (
        <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-50/70 to-blue-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-violet-500 opacity-70" />
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">
              Insight
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {section.insight}
          </p>
        </div>
      )}

      {/* What others said */}
      {section.whatOthersSaid &&
        section.whatOthersSaid !== "Provide LInk to Gurudevs audio" && (
          <div className="rounded-2xl p-5 bg-gradient-to-br from-pink-50/50 to-rose-50/30">
            <span className="text-xs font-semibold text-pink-600 uppercase tracking-widest">
              What others have said
            </span>
            <p className="text-sm text-foreground/70 leading-relaxed mt-2 whitespace-pre-line">
              {section.whatOthersSaid}
            </p>
          </div>
        )}

      {/* Mark done */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
        <div className="max-w-lg mx-auto">
          {done ? (
            <Link href={backPath}>
              <Button
                variant="outline"
                className="w-full h-12 text-base rounded-2xl border-green-200 text-green-600"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Completed — Back to Section
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleDone}
              className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 text-amber-900 shadow-sm"
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
