// Pastel color palettes per step type — blush, mint, lavender, peach, sky

export interface StepTheme {
  headerBg: string;
  cardBg: string;
  accent: string;
  accentMuted: string;
  border: string;
  ctaBg: string;
  labelColor: string;
}

export const STEP_THEMES: Record<string, StepTheme> = {
  sutra: {
    headerBg: "linear-gradient(160deg,#ede8f7 0%,#f7f0f5 100%)",
    cardBg: "linear-gradient(135deg,#f0ebff,#fdeef8)",
    accent: "#7c5cbf",
    accentMuted: "#b0a0c8",
    border: "#e8dff5",
    ctaBg: "linear-gradient(135deg,#a389d4,#c9a8e0)",
    labelColor: "#a389d4",
  },
  reflection: {
    headerBg: "linear-gradient(160deg,#fce8ea 0%,#fdf3f0 100%)",
    cardBg: "linear-gradient(135deg,#fce8ea,#fff0f3)",
    accent: "#c4707a",
    accentMuted: "#c8a0a8",
    border: "#f0d0d8",
    ctaBg: "linear-gradient(135deg,#c4707a,#dda0a8)",
    labelColor: "#c4707a",
  },
  practice: {
    headerBg: "linear-gradient(160deg,#e8f5ee 0%,#f0faf4 100%)",
    cardBg: "linear-gradient(135deg,#e8f5ee,#f0fff5)",
    accent: "#5a9e78",
    accentMuted: "#90b8a0",
    border: "#c8e8d8",
    ctaBg: "linear-gradient(135deg,#6aae88,#90c8a8)",
    labelColor: "#5a9e78",
  },
  gita: {
    headerBg: "linear-gradient(160deg,#fef0e0 0%,#fef8f0 100%)",
    cardBg: "linear-gradient(135deg,#fef0e0,#fff5e8)",
    accent: "#c48450",
    accentMuted: "#c8a888",
    border: "#f0d8b8",
    ctaBg: "linear-gradient(135deg,#c48450,#dda870)",
    labelColor: "#c48450",
  },
  journal: {
    headerBg: "linear-gradient(160deg,#e6eef8 0%,#f0f4fb 100%)",
    cardBg: "linear-gradient(135deg,#e6eef8,#f0f8ff)",
    accent: "#5a7aa0",
    accentMuted: "#90a8c8",
    border: "#c8d8f0",
    ctaBg: "linear-gradient(135deg,#6a8ab0,#90a8c8)",
    labelColor: "#5a7aa0",
  },
};

// Pastel rotation for topic cards & section steps
export const PASTEL_PALETTE = [
  { bg: "#fce8ea", accent: "#c4707a", text: "#7a3040" },  // blush
  { bg: "#e8f5ee", accent: "#5a9e78", text: "#2a5a40" },  // mint
  { bg: "#ede8f7", accent: "#7c5cbf", text: "#3d2f5e" },  // lavender
  { bg: "#fef0e0", accent: "#c48450", text: "#7a4820" },  // peach
  { bg: "#e6eef8", accent: "#5a7aa0", text: "#2a3a5e" },  // sky
  { bg: "#f0f7e8", accent: "#78a050", text: "#3a5020" },  // sage
];

export function getPastel(index: number) {
  return PASTEL_PALETTE[index % PASTEL_PALETTE.length];
}
