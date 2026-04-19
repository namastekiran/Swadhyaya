"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SectionStatus } from "./types";

interface TopicProgress {
  currentSection: number;
  completedSections: number[];
}

interface ReflectionEntry {
  text: string;
  savedAt: string;
}

interface SectionAnswers {
  reflections: ReflectionEntry[];
  practiceAnswer?: string;
  journalEntry?: string;
  completedSteps: ("sutra" | "reflection" | "practice" | "journal")[];
  updatedAt?: string;
}

interface AppState {
  topics: Record<string, TopicProgress>;
  answers: Record<string, SectionAnswers>;

  getSectionStatus: (topicId: string, section: number) => SectionStatus;
  getTopicProgress: (topicId: string) => TopicProgress;
  getSectionAnswers: (topicId: string, section: number) => SectionAnswers;
  completeStep: (
    topicId: string,
    section: number,
    step: "sutra" | "reflection" | "practice" | "journal"
  ) => void;
  saveReflection: (topicId: string, section: number, answer: string) => void;
  savePractice: (topicId: string, section: number, answer: string) => void;
  saveJournal: (topicId: string, section: number, entry: string) => void;
  completeAndNext: (
    topicId: string,
    section: number,
    totalSections: number
  ) => void;
}

const DEFAULT_PROGRESS: TopicProgress = {
  currentSection: 1,
  completedSections: [],
};

const DEFAULT_ANSWERS: SectionAnswers = {
  reflections: [],
  completedSteps: [],
};

function answersKey(topicId: string, section: number) {
  return `${topicId}::${section}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      topics: {},
      answers: {},

      getTopicProgress: (topicId: string) => {
        return get().topics[topicId] ?? DEFAULT_PROGRESS;
      },

      getSectionStatus: (topicId: string, section: number): SectionStatus => {
        const progress = get().topics[topicId] ?? DEFAULT_PROGRESS;
        if (progress.completedSections.includes(section)) return "done";
        if (section === progress.currentSection) return "current";
        return "locked";
      },

      getSectionAnswers: (topicId: string, section: number): SectionAnswers => {
        return get().answers[answersKey(topicId, section)] ?? { ...DEFAULT_ANSWERS };
      },

      completeStep: (topicId, section, step) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add(step);
          return {
            answers: {
              ...state.answers,
              [key]: {
                ...prev,
                completedSteps: Array.from(steps),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      saveReflection: (topicId, section, answer) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("reflection");
          const newEntry: ReflectionEntry = {
            text: answer,
            savedAt: new Date().toISOString(),
          };
          return {
            answers: {
              ...state.answers,
              [key]: {
                ...prev,
                reflections: [...(prev.reflections ?? []), newEntry],
                completedSteps: Array.from(steps),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      savePractice: (topicId, section, answer) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("practice");
          return {
            answers: {
              ...state.answers,
              [key]: {
                ...prev,
                practiceAnswer: answer,
                completedSteps: Array.from(steps),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      saveJournal: (topicId, section, entry) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("journal");
          return {
            answers: {
              ...state.answers,
              [key]: {
                ...prev,
                journalEntry: entry,
                completedSteps: Array.from(steps),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      completeAndNext: (topicId, section, totalSections) => {
        set((state) => {
          const prev = state.topics[topicId] ?? { ...DEFAULT_PROGRESS };
          const completed = new Set(prev.completedSections);
          completed.add(section);

          const nextSection = Math.min(section + 1, totalSections);
          const newCurrent =
            nextSection > prev.currentSection ? nextSection : prev.currentSection;

          return {
            topics: {
              ...state.topics,
              [topicId]: {
                currentSection:
                  completed.size >= totalSections ? totalSections : newCurrent,
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
