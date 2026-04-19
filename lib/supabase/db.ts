"use client";

import { createClient } from "./client";

interface TopicProgressRow {
  topic_id: string;
  current_section: number;
  completed_sections: number[];
}

interface SectionAnswersRow {
  topic_id: string;
  section_num: number;
  reflections: { text: string; savedAt: string }[];
  practice_answer: string | null;
  journal_entry: string | null;
  completed_steps: string[];
  saved_chats: { messages: { role: string; content: string }[]; savedAt: string }[];
}

export async function fetchAllProgress(deviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("topic_id, current_section, completed_sections")
    .eq("device_id", deviceId);

  if (error) throw error;

  const topics: Record<string, { currentSection: number; completedSections: number[] }> = {};
  for (const row of (data ?? []) as TopicProgressRow[]) {
    topics[row.topic_id] = {
      currentSection: row.current_section,
      completedSections: row.completed_sections ?? [],
    };
  }
  return topics;
}

export async function fetchAllAnswers(deviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("section_answers")
    .select("topic_id, section_num, reflections, practice_answer, journal_entry, completed_steps, saved_chats")
    .eq("device_id", deviceId);

  if (error) throw error;

  const answers: Record<string, {
    reflections: { text: string; savedAt: string }[];
    practiceAnswer?: string;
    journalEntry?: string;
    completedSteps: string[];
    savedChats: { messages: { role: string; content: string }[]; savedAt: string }[];
  }> = {};

  for (const row of (data ?? []) as SectionAnswersRow[]) {
    const key = `${row.topic_id}::${row.section_num}`;
    answers[key] = {
      reflections: row.reflections ?? [],
      practiceAnswer: row.practice_answer ?? undefined,
      journalEntry: row.journal_entry ?? undefined,
      completedSteps: row.completed_steps ?? [],
      savedChats: row.saved_chats ?? [],
    };
  }
  return answers;
}

export async function upsertProgress(
  deviceId: string,
  topicId: string,
  currentSection: number,
  completedSections: number[]
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        device_id: deviceId,
        topic_id: topicId,
        current_section: currentSection,
        completed_sections: completedSections,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id,topic_id" }
    );
  if (error) throw error;
}

export async function upsertSectionAnswers(
  deviceId: string,
  topicId: string,
  sectionNum: number,
  data: {
    reflections?: { text: string; savedAt: string }[];
    practiceAnswer?: string;
    journalEntry?: string;
    completedSteps?: string[];
    savedChats?: { messages: { role: string; content: string }[]; savedAt: string }[];
  }
) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("section_answers")
    .select("id, reflections, practice_answer, journal_entry, completed_steps, saved_chats")
    .eq("device_id", deviceId)
    .eq("topic_id", topicId)
    .eq("section_num", sectionNum)
    .single();

  const row = {
    device_id: deviceId,
    topic_id: topicId,
    section_num: sectionNum,
    reflections: data.reflections ?? existing?.reflections ?? [],
    practice_answer: data.practiceAnswer ?? existing?.practice_answer ?? null,
    journal_entry: data.journalEntry ?? existing?.journal_entry ?? null,
    completed_steps: data.completedSteps ?? existing?.completed_steps ?? [],
    saved_chats: data.savedChats ?? existing?.saved_chats ?? [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("section_answers")
    .upsert(row, { onConflict: "device_id,topic_id,section_num" });

  if (error) throw error;
}
