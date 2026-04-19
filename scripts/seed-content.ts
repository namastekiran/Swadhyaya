/**
 * One-time script: parse Swadhyaya (1).xlsx into content/topics/*.json
 *
 * Run with: npx tsx scripts/seed-content.ts
 */

import * as fs from "fs";
import * as path from "path";

// We'll use the openpyxl-style parsing via a JS xlsx library
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

    const firstLine = meaning.split(/[.\n]/)[0].trim();
    const theme =
      firstLine.length > 60 ? firstLine.substring(0, 57) + "..." : firstLine;

    const cleanedSutraNo = sutraNo
      .split(/\n/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(", ");

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
