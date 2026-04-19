/**
 * One-time script: parse Swadhyaya (1).xlsx into content/topics/*.json
 *
 * Run with: npx tsx scripts/seed-content.ts
 */

import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const XLSX = require("xlsx");

const EXCEL_PATH = path.resolve(
  process.env.HOME || "~",
  "Downloads/Swadhyaya (1).xlsx"
);
const OUTPUT_DIR = path.resolve(__dirname, "../content/topics");

interface SutraData {
  number: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
}

interface SectionData {
  section: number;
  theme: string;
  sutra: SutraData;
  insight: string;
  reflectionPrompt: string;
  practice: string;
  meditation: string;
  journalPrompt: string;
  whatOthersSaid: string;
}

interface TopicData {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  totalSections: number;
  sections: SectionData[];
}

const SECTION_THEMES: Record<string, string[]> = {
  "self-discipline": [
    "The Sacred Beginning",
    "Stilling the Mind",
    "Five Movements of Mind",
    "Practice & Letting Go",
    "Steady Dedication",
    "Faith & Inner Strength",
    "Intensity of Effort",
    "Obstacles on the Path",
    "Signs of Imbalance",
    "The Three Pillars",
  ],
  practice: [
    "Practice & Detachment",
    "Steady Dedication",
    "Freedom from Craving",
    "Stages of Samadhi",
    "Intensity of Effort",
    "Faith & Confidence",
    "Total Focus",
    "Turning Inward",
    "One-Pointed Awareness",
    "The Sound of Om",
    "Cultivating Serenity",
    "Mastery of Contemplation",
  ],
  meditation: [
    "Stages of Samadhi",
    "Beyond Thought",
    "Dissolving into Nature",
    "Faith & Perseverance",
    "Intensity of Practice",
    "Surrendering to the Divine",
    "The Sound of Om",
    "Chanting & Inner Clarity",
    "Choosing Your Focus",
    "From Atom to Infinity",
    "The Crystal Mind",
    "Deepening Perception",
    "The Formless State",
    "Seeded Meditation",
    "Inner Joy Awakens",
    "Truth-Bearing Wisdom",
    "Beyond External Knowledge",
    "Overwriting Old Patterns",
    "The Seedless State",
    "Returning to Source",
    "Clearing Disturbances",
  ],
  detachment: [
    "Calm Through Letting Go",
    "The Five Afflictions",
    "Root of All Suffering",
    "Mistaking the Temporary",
    "Beyond the Ego",
    "The Pull of Pleasure",
    "The Push of Pain",
    "Clinging to Life",
    "The Web of Karma",
    "Karma & Life Experience",
    "Joy & Suffering in Action",
    "Seeing Change Clearly",
    "Preventing Future Pain",
    "Seer & Seen United",
    "Beginningless Desires",
    "Cause & Effect of Impressions",
  ],
  knowledge: [
    "Three Sources of Knowledge",
    "Wrong Understanding",
    "The Nature of Imagination",
    "The State of Sleep",
    "Infinite Knowledge",
  ],
  yoga: [
    "The Sacred Beginning",
    "Stilling the Mind",
    "Discipline & Self-Study",
    "Purification Through Practice",
    "The Eightfold Path",
  ],
  consciousness: [
    "Stilling the Mind",
    "Five Movements of Mind",
  ],
  "8-limbs": [
    "The Eight Limbs",
    "The Five Yamas",
    "Universal Vows",
    "The Five Niyamas",
    "Non-Violence",
    "Truthfulness",
    "Non-Stealing",
    "Moderation",
    "Non-Possessiveness",
    "Purity of Body & Mind",
    "Contentment",
    "Self-Discipline",
    "Self-Study",
    "Surrender to the Divine",
    "Steady & Comfortable Posture",
    "Effortless Balance",
    "Beyond Duality",
    "Breath Regulation",
    "Three Movements of Breath",
    "The Fourth Pranayama",
    "Lifting the Veil",
    "Withdrawal of Senses",
    "Mastery of the Senses",
  ],
};

const TOPIC_CONFIG: {
  sheetName: string;
  id: string;
  title: string;
  tagline: string;
  icon: string;
  hasTopicColumn: boolean;
}[] = [
  {
    sheetName: "Self-Discipline",
    id: "self-discipline",
    title: "Self-Discipline",
    tagline: "Anushasanam — the gentle art of commitment",
    icon: "flame",
    hasTopicColumn: false,
  },
  {
    sheetName: "Practice",
    id: "practice",
    title: "Practice",
    tagline: "Abhyasa — steady effort, day after day",
    icon: "repeat",
    hasTopicColumn: false,
  },
  {
    sheetName: "Meditation",
    id: "meditation",
    title: "Meditation",
    tagline: "Dhyana — the art of turning inward",
    icon: "brain",
    hasTopicColumn: false,
  },
  {
    sheetName: "Attachment",
    id: "detachment",
    title: "Detachment",
    tagline: "Vairagya — freedom through letting go",
    icon: "wind",
    hasTopicColumn: false,
  },
  {
    sheetName: "Knowledge",
    id: "knowledge",
    title: "Knowledge",
    tagline: "Pramana — the light of true understanding",
    icon: "book-open",
    hasTopicColumn: false,
  },
  {
    sheetName: "Yoga",
    id: "yoga",
    title: "Yoga",
    tagline: "Union of body, mind, and spirit",
    icon: "heart",
    hasTopicColumn: false,
  },
  {
    sheetName: "Cosciousness",
    id: "consciousness",
    title: "Consciousness",
    tagline: "Chitta — exploring the depths of awareness",
    icon: "eye",
    hasTopicColumn: false,
  },
  {
    sheetName: "8 Limbs of yoga",
    id: "8-limbs",
    title: "8 Limbs of Yoga",
    tagline: "Ashtanga — the complete path of yoga",
    icon: "lotus",
    hasTopicColumn: true,
  },
];

function clean(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function generateTransliteration(sutraNum: string): string {
  return `Sutra ${sutraNum}`;
}

function parseTopic(
  wb: ReturnType<typeof XLSX.readFile>,
  config: (typeof TOPIC_CONFIG)[0]
): TopicData {
  const ws = wb.Sheets[config.sheetName];
  if (!ws) {
    throw new Error(`Sheet "${config.sheetName}" not found`);
  }

  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const offset = config.hasTopicColumn ? 1 : 0;
  const themeList = SECTION_THEMES[config.id] || [];

  const sections: SectionData[] = [];
  let sectionNum = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0 + offset]) continue;

    const sutraNo = clean(row[0 + offset]);
    const sanskrit = clean(row[1 + offset]);
    const meaning = clean(row[2 + offset]);
    const insight = clean(row[3 + offset]);
    const reflection = clean(row[4 + offset]);
    const practice = clean(row[5 + offset]);
    const meditation = clean(row[6 + offset]);
    const journal = clean(row[7 + offset]);
    const whatOthersSaid = clean(row[8 + offset]);

    if (!sutraNo || !sanskrit) continue;

    sectionNum++;

    const cleanedSutraNo = sutraNo
      .split(/\n/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(", ");

    const theme = themeList[sectionNum - 1] || `Section ${sectionNum}`;

    sections.push({
      section: sectionNum,
      theme,
      sutra: {
        number: cleanedSutraNo,
        sanskrit: sanskrit.replace(/\n{3,}/g, "\n"),
        transliteration: generateTransliteration(cleanedSutraNo),
        meaning,
      },
      insight,
      reflectionPrompt: reflection,
      practice,
      meditation,
      journalPrompt: journal,
      whatOthersSaid,
    });
  }

  return {
    id: config.id,
    title: config.title,
    tagline: config.tagline,
    icon: config.icon,
    totalSections: sections.length,
    sections,
  };
}

function main() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`Excel file not found at: ${EXCEL_PATH}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const wb = XLSX.readFile(EXCEL_PATH);

  for (const config of TOPIC_CONFIG) {
    const topic = parseTopic(wb, config);
    const outPath = path.join(OUTPUT_DIR, `${topic.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(topic, null, 2), "utf-8");
    console.log(
      `  ${topic.title}: ${topic.totalSections} sections -> ${outPath}`
    );
  }

  console.log("\nDone! All topics seeded.");
}

main();
