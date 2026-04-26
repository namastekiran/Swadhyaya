export interface SutraData {
  number: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
}

export interface SectionData {
  section: number;
  theme: string;
  sutra: SutraData;
  insight: string;
  reflectionPrompt: string;
  practice: string;
  meditation: string;
  journalPrompt: string;
  whatOthersSaid: string;
  shlokaFrom?: string;
  wisdomFrom?: string;
}

export interface TopicData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  totalSections: number;
  sections: SectionData[];
}

export interface TopicSummary {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  totalSections: number;
}

export type SectionStatus = "done" | "current" | "locked";
