"use client";

import { useState, useEffect } from "react";
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
  Lock,
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

type StepKey = "sutra" | "reflection" | "practice" | "journal" | "gita";

interface StepCardDef {
  key: StepKey;
  label: string;
  description: string;
  icon: any;
  href: string;
  gradient: string;
  iconColor: string;
  checkColor: string;
}

const STEP_CARDS: StepCardDef[] = [
  {
    key: "sutra",
    label: "Sutra & Insight",
    description: "Read the sutra and explore its meaning",
    icon: BookOpen,
    href: "sutra",
    gradient: "from-amber-50 to-orange-50",
    iconColor: "bg-amber-100 text-amber-500",
    checkColor: "text-amber-500",
  },
  {
    key: "reflection",
    label: "Reflection",
    description: "Reflect on the teaching and share your thoughts",
    icon: MessageCircle,
    href: "reflection",
    gradient: "from-teal-50 to-emerald-50",
    iconColor: "bg-teal-100 text-teal-500",
    checkColor: "text-teal-500",
  },
  {
    key: "practice",
    label: "Micro Practice",
    description: "A small action and meditation for the day",
    icon: Dumbbell,
    href: "practice",
    gradient: "from-violet-50 to-blue-50",
    iconColor: "bg-violet-100 text-violet-500",
    checkColor: "text-violet-500",
  },
  {
    key: "journal",
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const getSectionStatus = useAppStore((s) => s.getSectionStatus);
  const getSectionAnswers = useAppStore((s) => s.getSectionAnswers);
  const completeAndNext = useAppStore((s) => s.completeAndNext);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const firstName = profile?.name?.split(" ")[0];

  const status = getSectionStatus(topicId, section.section);
  const isDone = status === "done";
  const answers = getSectionAnswers(topicId, section.section);
  const isLast = section.section >= totalSections;

  const activeSteps: StepCardDef[] = [...STEP_CARDS];
  if (section.shlokaFrom || section.wisdomFrom) {
    activeSteps.push({
      key: "gita" as const,
      label: "Wisdom from the Gita",
      description: "Read related wisdom from the Bhagavad Gita",
      icon: BookOpen,
      href: "gita",
      gradient: "from-indigo-50 to-blue-50",
      iconColor: "bg-indigo-100 text-indigo-500",
      checkColor: "text-indigo-500",
    });
  }

  const allStepsComplete = activeSteps.every((s) =>
    answers.completedSteps.includes(s.key as "sutra" | "reflection" | "practice" | "journal" | "gita")
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
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/topic/${topicId}`}
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold opacity-70">{topicTitle}</p>
          <h1 className="text-xl font-bold text-foreground leading-tight mt-0.5">
            {section.theme}
          </h1>
        </div>
        {isDone && (
          <span className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </span>
        )}
      </div>

      {/* Theme banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-purple-50/80 to-pink-50/60 p-5 border border-purple-100/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">
            {firstName ? `${firstName}'s Focus` : "Today's Focus"}
          </span>
        </div>
      </div>

      {/* Step progress */}
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-2">
          {activeSteps.map((step) => {
            const done = answers.completedSteps.includes(step.key as "sutra" | "reflection" | "practice" | "journal" | "gita");
            return (
              <div key={step.key} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    done ? "bg-purple-300" : "bg-gray-100"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {activeSteps.filter(s => answers.completedSteps.includes(s.key as any)).length} of {activeSteps.length} steps complete
        </p>
      </div>

      {/* Step cards */}
      <div className="space-y-3.5">
        {activeSteps.map((step) => {
          const Icon = step.icon;
          const done = answers.completedSteps.includes(step.key as any);
          return (
            <Link key={step.key} href={`${basePath}/${step.href}`}>
              <div
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all active:scale-[0.98] bg-gradient-to-r ${step.gradient} hover:shadow-sm`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${step.iconColor}`}
                >
                  {done ? (
                    <CheckCircle2 className={`w-5 h-5 ${step.checkColor}`} />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground">
                      {step.label}
                    </span>
                    {done && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-green-600">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Unified Action Button */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/90 backdrop-blur-md border-t border-gray-100/50">
          <div className="max-w-md mx-auto sm:max-w-lg space-y-4">
            <Button
              onClick={handleCompleteSection}
              className={`w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                allStepsComplete
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200/50 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 border border-gray-200/50"
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {!allStepsComplete && <Lock className="w-4 h-4 opacity-50" />}
                <span>
                  {allStepsComplete 
                    ? (isLast ? "Complete Your Journey" : "Complete & Next Section") 
                    : `Complete ${activeSteps.length - answers.completedSteps.length} more steps`}
                </span>
                {allStepsComplete && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
              
              {/* Progress background for the button itself? Maybe too complex, let's keep it clean */}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
