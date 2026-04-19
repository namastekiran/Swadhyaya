"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Dumbbell,
  Timer,
  PenLine,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { SectionData } from "@/lib/types";

interface Props {
  topicId: string;
  topicTitle: string;
  section: SectionData;
  totalSections: number;
}

function ContentCard({
  icon: Icon,
  label,
  colorClass,
  children,
}: {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl p-5 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 opacity-60" />
        <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export function SectionDetail({
  topicId,
  topicTitle,
  section,
  totalSections,
}: Props) {
  const router = useRouter();
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const completeAndNext = useAppStore((s) => s.completeAndNext);

  const status = getSectionStatus(topicId, section.section);
  const isDone = status === "done";
  const isLast = section.section >= totalSections;

  function handleCompleteAndNext() {
    completeAndNext(topicId, section.section, totalSections);

    if (isLast) {
      toast.success("Journey complete! You've finished all sections.");
      router.push(`/topic/${topicId}`);
    } else {
      router.push(`/topic/${topicId}/section/${section.section + 1}`);
    }
  }

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/topic/${topicId}`}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{topicTitle}</p>
          <h1 className="text-lg font-bold text-foreground leading-tight truncate">
            Section {section.section}
          </h1>
        </div>
        {isDone && (
          <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </span>
        )}
      </div>

      {/* Theme */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-foreground">
            {section.theme}
          </span>
        </div>
      </div>

      {/* Sutra */}
      <ContentCard
        icon={BookOpen}
        label={`Sutra ${section.sutra.number}`}
        colorClass="bg-gradient-to-br from-amber-50/80 to-orange-50/60 text-amber-900"
      >
        <p className="font-devanagari text-xl leading-relaxed text-foreground mb-3">
          {section.sutra.sanskrit}
        </p>
        <p className="text-xs text-muted-foreground italic mb-3">
          {section.sutra.transliteration}
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {section.sutra.meaning}
        </p>
      </ContentCard>

      {/* Insight */}
      {section.insight && (
        <ContentCard
          icon={Lightbulb}
          label="Insight"
          colorClass="bg-gradient-to-br from-violet-50/70 to-blue-50/50 text-violet-900"
        >
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {section.insight}
          </p>
        </ContentCard>
      )}

      {/* Reflection */}
      {section.reflectionPrompt && (
        <ContentCard
          icon={MessageCircle}
          label="Reflection"
          colorClass="bg-gradient-to-br from-teal-50/70 to-emerald-50/50 text-teal-900"
        >
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            &ldquo;{section.reflectionPrompt}&rdquo;
          </p>
        </ContentCard>
      )}

      {/* Practice */}
      {section.practice && (
        <ContentCard
          icon={Dumbbell}
          label="Practice"
          colorClass="bg-gradient-to-br from-rose-50/70 to-pink-50/50 text-rose-900"
        >
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {section.practice}
          </p>
        </ContentCard>
      )}

      {/* Meditation */}
      {section.meditation && (
        <ContentCard
          icon={Timer}
          label="Meditation"
          colorClass="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 text-blue-900"
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            {section.meditation}
          </p>
        </ContentCard>
      )}

      {/* Journal */}
      {section.journalPrompt && (
        <ContentCard
          icon={PenLine}
          label="Journal"
          colorClass="bg-gradient-to-br from-yellow-50/70 to-amber-50/50 text-amber-900"
        >
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            &ldquo;{section.journalPrompt}&rdquo;
          </p>
        </ContentCard>
      )}

      {/* Complete & Next */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={handleCompleteAndNext}
              className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-100 transition-all"
            >
              {isLast ? (
                <>
                  Complete Journey
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Complete & Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
