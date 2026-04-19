"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SectionStatus } from "./types";
import {
  upsertProgress,
  upsertSectionAnswers,
  fetchAllProgress,
  fetchAllAnswers,
} from "./supabase/db";

interface TopicProgress {
  currentSection: number;
  completedSections: number[];
}

interface ReflectionEntry {
  text: string;
  savedAt: string;
}

interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SavedChat {
  messages: AiChatMessage[];
  savedAt: string;
}

interface SectionAnswers {
  reflections: ReflectionEntry[];
  practiceAnswer?: string;
  journalEntry?: string;
  completedSteps: ("sutra" | "reflection" | "practice" | "journal")[];
  savedChats: SavedChat[];
  updatedAt?: string;
}

interface AppState {
  userId: string | null;
  topics: Record<string, TopicProgress>;
  answers: Record<string, SectionAnswers>;

  setUserId: (id: string | null) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
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
  saveAiChat: (topicId: string, section: number, messages: AiChatMessage[]) => void;
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
  savedChats: [],
  completedSteps: [],
};

function answersKey(topicId: string, section: number) {
  return `${topicId}::${section}`;
}

function syncAnswersToDb(userId: string | null, topicId: string, section: number, answers: SectionAnswers) {
  if (!userId) return;
  upsertSectionAnswers(userId, topicId, section, {
    reflections: answers.reflections,
    practiceAnswer: answers.practiceAnswer,
    journalEntry: answers.journalEntry,
    completedSteps: answers.completedSteps,
    savedChats: answers.savedChats,
  }).catch(console.error);
}

function syncProgressToDb(userId: string | null, topicId: string, progress: TopicProgress) {
  if (!userId) return;
  upsertProgress(userId, topicId, progress.currentSection, progress.completedSections).catch(console.error);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      topics: {},
      answers: {},

      setUserId: (id) => set({ userId: id }),

      loadFromSupabase: async (userId: string) => {
        try {
          const [topics, answers] = await Promise.all([
            fetchAllProgress(userId),
            fetchAllAnswers(userId),
          ]);

          const typedAnswers: Record<string, SectionAnswers> = {};
          for (const [key, val] of Object.entries(answers)) {
            typedAnswers[key] = {
              reflections: val.reflections ?? [],
              practiceAnswer: val.practiceAnswer,
              journalEntry: val.journalEntry,
              completedSteps: (val.completedSteps ?? []) as SectionAnswers["completedSteps"],
              savedChats: (val.savedChats ?? []).map((c) => ({
                ...c,
                messages: c.messages.map((m) => ({
                  role: m.role as "user" | "assistant",
                  content: m.content,
                })),
              })),
            };
          }

          set({ userId, topics, answers: typedAnswers });
        } catch (err) {
          console.error("Failed to load from Supabase:", err);
        }
      },

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
          const updated = {
            ...prev,
            completedSteps: Array.from(steps) as SectionAnswers["completedSteps"],
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.userId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
        });
      },

      saveReflection: (topicId, section, answer) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("reflection");
          const updated: SectionAnswers = {
            ...prev,
            reflections: [...(prev.reflections ?? []), { text: answer, savedAt: new Date().toISOString() }],
            completedSteps: Array.from(steps) as SectionAnswers["completedSteps"],
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.userId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
        });
      },

      savePractice: (topicId, section, answer) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("practice");
          const updated: SectionAnswers = {
            ...prev,
            practiceAnswer: answer,
            completedSteps: Array.from(steps) as SectionAnswers["completedSteps"],
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.userId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
        });
      },

      saveJournal: (topicId, section, entry) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const steps = new Set(prev.completedSteps);
          steps.add("journal");
          const updated: SectionAnswers = {
            ...prev,
            journalEntry: entry,
            completedSteps: Array.from(steps) as SectionAnswers["completedSteps"],
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.userId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
        });
      },

      saveAiChat: (topicId, section, messages) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const newChat: SavedChat = { messages, savedAt: new Date().toISOString() };
          const updated: SectionAnswers = {
            ...prev,
            savedChats: [...(prev.savedChats ?? []), newChat],
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.userId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
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

          const updated: TopicProgress = {
            currentSection: completed.size >= totalSections ? totalSections : newCurrent,
            completedSections: Array.from(completed).sort((a, b) => a - b),
          };
          syncProgressToDb(state.userId, topicId, updated);
          return { topics: { ...state.topics, [topicId]: updated } };
        });
      },
    }),
    {
      name: "swadhyaya-progress",
      partialize: (state) => ({
        topics: state.topics,
        answers: state.answers,
        userId: state.userId,
      }),
    }
  )
);
