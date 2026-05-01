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
import { createClient } from "./supabase/client";

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
  completedSteps: ("sutra" | "reflection" | "practice" | "journal" | "gita" | "gurudev")[];
  savedChats: SavedChat[];
  updatedAt?: string;
}

interface UserProfile {
  name: string;
  intention: string;
  createdAt: string;
}

interface AppState {
  deviceId: string;
  profile: UserProfile | null;
  topics: Record<string, TopicProgress>;
  answers: Record<string, SectionAnswers>;
  hydrated: boolean;

  authMode: "unknown" | "guest" | "authenticated";
  isLoginModalOpen: boolean;
  pendingAction: (() => void) | null;

  setAuthMode: (mode: "unknown" | "guest" | "authenticated") => void;
  setLoginModalOpen: (isOpen: boolean) => void;
  requestAuth: (action: () => void) => void;
  executePendingAction: () => void;
  checkSession: () => Promise<void>;

  setProfile: (name: string, intention: string) => void;
  initDevice: () => void;
  loadFromSupabase: () => Promise<void>;
  getSectionStatus: (topicId: string, section: number) => SectionStatus;
  getTopicProgress: (topicId: string) => TopicProgress;
  getSectionAnswers: (topicId: string, section: number) => SectionAnswers;
  completeStep: (
    topicId: string,
    section: number,
    step: "sutra" | "reflection" | "practice" | "journal" | "gita" | "gurudev"
  ) => void;
  saveReflection: (topicId: string, section: number, answer: string) => void;
  deleteReflection: (topicId: string, section: number, index: number) => void;
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

function generateDeviceId(): string {
  return "dev_" + crypto.randomUUID();
}

function syncAnswersToDb(deviceId: string, topicId: string, section: number, answers: SectionAnswers) {
  if (!deviceId) return;
  upsertSectionAnswers(deviceId, topicId, section, {
    reflections: answers.reflections,
    practiceAnswer: answers.practiceAnswer,
    journalEntry: answers.journalEntry,
    completedSteps: answers.completedSteps,
    savedChats: answers.savedChats,
  }).then(() => {
    console.log(`[Supabase] Synced answers: ${topicId}::${section}`);
  }).catch((err) => {
    console.warn(`[Supabase] Could not sync answers (offline?):`, (err as Error)?.message ?? err);
  });
}

function syncProgressToDb(deviceId: string, topicId: string, progress: TopicProgress) {
  if (!deviceId) return;
  upsertProgress(deviceId, topicId, progress.currentSection, progress.completedSections).then(() => {
    console.log(`[Supabase] Synced progress: ${topicId}`);
  }).catch((err) => {
    console.warn(`[Supabase] Could not sync progress (offline?):`, (err as Error)?.message ?? err);
  });
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      deviceId: "",
      profile: null,
      topics: {},
      answers: {},
      hydrated: false,
      authMode: "unknown",
      isLoginModalOpen: false,
      pendingAction: null,

      setAuthMode: (mode) => set({ authMode: mode }),
      setLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
      requestAuth: (action) => {
        const { authMode } = get();
        if (authMode === "unknown") {
          set({ pendingAction: action, isLoginModalOpen: true });
        } else {
          action();
        }
      },
      executePendingAction: () => {
        const { pendingAction } = get();
        if (pendingAction) {
          pendingAction();
          set({ pendingAction: null });
        }
      },

      setProfile: (name, intention) => {
        set({
          profile: {
            name: name.trim(),
            intention: intention.trim(),
            createdAt: new Date().toISOString(),
          },
        });
      },

      initDevice: () => {
        // Prevent double-init from React Strict Mode double-mount
        if ((globalThis as any).__swInit) return;
        (globalThis as any).__swInit = true;
        let id = get().deviceId;
        if (!id) {
          id = generateDeviceId();
          set({ deviceId: id });
        }
        get().checkSession();
        get().loadFromSupabase();
      },

      checkSession: async () => {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session) set({ authMode: "authenticated" });
        } catch {
          // silently ignore — network errors or React Strict Mode auth lock
        }
      },

      loadFromSupabase: async () => {
        const deviceId = get().deviceId;
        if (!deviceId) return;

        try {
          const [topics, answers] = await Promise.all([
            fetchAllProgress(deviceId),
            fetchAllAnswers(deviceId),
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

          const localTopics = get().topics;
          const localAnswers = get().answers;
          const hasLocal = Object.keys(localTopics).length > 0 || Object.keys(localAnswers).length > 0;
          const hasRemote = Object.keys(topics).length > 0 || Object.keys(typedAnswers).length > 0;

          if (hasRemote) {
            set({ topics, answers: typedAnswers, hydrated: true });
            console.log("[Supabase] Loaded data from cloud");
          } else if (hasLocal) {
            set({ hydrated: true });
            console.log("[Supabase] Using local data (nothing in cloud yet)");
          } else {
            set({ hydrated: true });
          }
        } catch (err) {
          console.warn("[Supabase] Could not load from cloud (offline or config missing):", (err as Error)?.message ?? err);
          set({ hydrated: true });
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
        get().requestAuth(() => {
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
            syncAnswersToDb(state.deviceId, topicId, section, updated);
            return { answers: { ...state.answers, [key]: updated } };
          });
        });
      },

      saveReflection: (topicId, section, answer) => {
        get().requestAuth(() => {
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
            syncAnswersToDb(state.deviceId, topicId, section, updated);
            return { answers: { ...state.answers, [key]: updated } };
          });
        });
      },

      deleteReflection: (topicId, section, index) => {
        set((state) => {
          const key = answersKey(topicId, section);
          const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
          const reflections = [...(prev.reflections ?? [])];
          reflections.splice(index, 1);
          const updated: SectionAnswers = {
            ...prev,
            reflections,
            updatedAt: new Date().toISOString(),
          };
          syncAnswersToDb(state.deviceId, topicId, section, updated);
          return { answers: { ...state.answers, [key]: updated } };
        });
      },

      savePractice: (topicId, section, answer) => {
        get().requestAuth(() => {
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
            syncAnswersToDb(state.deviceId, topicId, section, updated);
            return { answers: { ...state.answers, [key]: updated } };
          });
        });
      },

      saveJournal: (topicId, section, entry) => {
        get().requestAuth(() => {
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
            syncAnswersToDb(state.deviceId, topicId, section, updated);
            return { answers: { ...state.answers, [key]: updated } };
          });
        });
      },

      saveAiChat: (topicId, section, messages) => {
        get().requestAuth(() => {
          set((state) => {
            const key = answersKey(topicId, section);
            const prev = state.answers[key] ?? { ...DEFAULT_ANSWERS };
            const newChat: SavedChat = { messages, savedAt: new Date().toISOString() };
            const updated: SectionAnswers = {
              ...prev,
              savedChats: [...(prev.savedChats ?? []), newChat],
              updatedAt: new Date().toISOString(),
            };
            syncAnswersToDb(state.deviceId, topicId, section, updated);
            return { answers: { ...state.answers, [key]: updated } };
          });
        });
      },

      completeAndNext: (topicId, section, totalSections) => {
        get().requestAuth(() => {
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
            syncProgressToDb(state.deviceId, topicId, updated);
            return { topics: { ...state.topics, [topicId]: updated } };
          });
        });
      },
    }),
    {
      name: "swadhyaya-progress",
      partialize: (state) => ({
        deviceId: state.deviceId,
        profile: state.profile,
        topics: state.topics,
        answers: state.answers,
        authMode: state.authMode, // Persist auth mode so guest stays guest
      }),
    }
  )
);
