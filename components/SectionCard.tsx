"use client";

import Link from "next/link";
import { CheckCircle2, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { SectionData, SectionStatus } from "@/lib/types";

interface SectionCardProps {
  topicId: string;
  section: SectionData;
  status: SectionStatus;
}

export function SectionCard({ topicId, section, status }: SectionCardProps) {
  if (status === "locked") {
    return (
      <button
        onClick={() => toast.info("Complete the previous section first")}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/40 opacity-50 cursor-not-allowed">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Lock className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground/60 truncate">
              {section.theme}
            </p>
          </div>
        </div>
      </button>
    );
  }

  const isDone = status === "done";
  const isCurrent = status === "current";

  return (
    <Link href={`/topic/${topicId}/section/${section.section}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
          isCurrent
            ? "bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm ring-1 ring-purple-100"
            : isDone
              ? "bg-green-50/60 hover:bg-green-50"
              : "bg-white/60 hover:bg-white"
        }`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            isDone
              ? "bg-green-100 text-green-500"
              : isCurrent
                ? "bg-purple-100 text-purple-500"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <span className="text-sm font-bold">{section.section}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isCurrent && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                Current
              </span>
            )}
            {isDone && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                Done
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground mt-0.5 truncate">
            {section.theme}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
      </div>
    </Link>
  );
}
