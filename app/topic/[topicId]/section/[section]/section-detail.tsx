"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Dumbbell,
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

const STEP_CARDS = [
  {
    key: "sutra" as const,
    label: "Sutra & Insight",
    description: "Read the sutra and explore its meaning",
    icon: BookOpen,
    href: "sutra",
    gradient: "from-amber-50 to-orange-50",
    iconColor: "bg-amber-100 text-amber-500",
    checkColor: "text-amber-500",
  },
  {
    key: "reflection" as const,
    label: "Reflection",
    description: "Reflect on the teaching and share your thoughts",
    icon: MessageCircle,
    href: "reflection",
    gradient: "from-teal-50 to-emerald-50",
    iconColor: "bg-teal-100 text-teal-500",
    checkColor: "text-teal-500",
  },
  {
    key: "practice" as const,
    label: "Micro Practice",
    description: "A small action and meditation for the day",
    icon: Dumbbell,
    href: "practice",
    gradient: "from-violet-50 to-blue-50",
    iconColor: "bg-violet-100 text-violet-500",
    checkColor: "text-violet-500",
  },
  {
    key: "journal" as const,
    label: "Journal",
    description: "Write down your experience and insights",
    icon: PenLine,
    href: "journal",
    gradient: "from-rose-50 to-pink-50",
    iconColor: "bg-rose-100 text-rose-500",
    checkColor: "text-rose-500",
  },
];

export function SectionDetail({
  topicId,
  topicTitle,
  section,
  totalSections,
}: Props) {
  const router = useRouter();
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const completeAndNext = useAppStore((s) => s.completeAndNext);

  const status = getSectionStatus(topicId, section.section);
  const isDone = status === "done";
  const answers = getSectionAnswers(topicId, section.section);
  const isLast = section.section >= totalSections;

  const allStepsComplete = STEP_CARDS.every((s) =>
    answers.completedSteps.includes(s.key)
  );

  function handleCompleteSection() {
    completeAndNext(topicId, section.section, totalSections);
    if (isLast) {
      toast.success("Journey complete! You've finished all sections.");
      router.push(`/topic/${topicId}`);
    } else {
      toast.success("Section complete! Moving to next.");
      router.push(`/topic/${topicId}/section/${section.section + 1}`);
    }
  }

  const basePath = `/topic/${topicId}/section/${section.section}`;

  return (
    <div className="space-y-5 pb-28">
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
          <h1 className="text-lg font-bold text-foreground leading-tight">
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

      {/* Theme banner */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-purple-500 uppercase tracking-widest">
            Today&apos;s Focus
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {section.theme}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sutra {section.sutra.number}
        </p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-2 px-1">
        {STEP_CARDS.map((step, i) => {
          const done = answers.completedSteps.includes(step.key);
          return (
            <div key={step.key} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  done ? "bg-purple-300" : "bg-gray-100"
                }`}
              />
              {i < STEP_CARDS.length - 1 && <div className="w-0" />}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground px-1">
        {answers.completedSteps.length} of {STEP_CARDS.length} steps complete
      </p>

      {/* 4 step cards */}
      <div className="space-y-3">
        {STEP_CARDS.map((step) => {
          const Icon = step.icon;
          const done = answers.completedSteps.includes(step.key);
          return (
            <Link key={step.key} href={`${basePath}/${step.href}`}>
              <div
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] bg-gradient-to-r ${step.gradient} hover:shadow-sm`}
              >
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${step.iconColor}`}
                >
                  {done ? (
                    <CheckCircle2 className={`w-5 h-5 ${step.checkColor}`} />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {step.label}
                    </span>
                    {done && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-green-600">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Complete section button */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={handleCompleteSection}
              disabled={!allStepsComplete}
              className={`w-full h-12 text-base font-semibold rounded-2xl transition-all ${
                allStepsComplete
                  ? "bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
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
            {!allStepsComplete && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Complete all 4 steps to unlock
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
