"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SectionStatus } from "./types";

interface TopicProgress {
  currentSection: number;
  completedSections: number[];
}

interface AppState {
  topics: Record<string, TopicProgress>;

  getSectionStatus: (topicId: string, section: number) => SectionStatus;
  getTopicProgress: (topicId: string) => TopicProgress;
  completeAndNext: (topicId: string, section: number, totalSections: number) => void;
}

const DEFAULT_PROGRESS: TopicProgress = {
  currentSection: 1,
  completedSections: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      topics: {},

      getTopicProgress: (topicId: string) => {
        return get().topics[topicId] ?? DEFAULT_PROGRESS;
      },

      getSectionStatus: (topicId: string, section: number): SectionStatus => {
        const progress = get().topics[topicId] ?? DEFAULT_PROGRESS;
        if (progress.completedSections.includes(section)) return "done";
        if (section === progress.currentSection) return "current";
        return "locked";
      },

      completeAndNext: (topicId: string, section: number, totalSections: number) => {
        set((state) => {
          const prev = state.topics[topicId] ?? { ...DEFAULT_PROGRESS };
          const completed = new Set(prev.completedSections);
          completed.add(section);

          const nextSection = Math.min(section + 1, totalSections);
          const newCurrent = nextSection > prev.currentSection ? nextSection : prev.currentSection;

          return {
            topics: {
              ...state.topics,
              [topicId]: {
                currentSection: completed.size >= totalSections ? totalSections : newCurrent,
                completedSections: Array.from(completed).sort((a, b) => a - b),
              },
            },
          };
        });
      },
    }),
    {
      name: "swadhyaya-progress",
    }
  )
);
