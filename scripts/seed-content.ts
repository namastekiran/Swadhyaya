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
  process.env.USERPROFILE || process.env.HOME || "~",
  "Downloads/Swadhyaya_Content.xlsx"
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
  shlokaFrom?: string;
  wisdomFrom?: string;
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
  description: string;
  icon: string;
  hasTopicColumn: boolean;
}[] = [
  {
    sheetName: "Self-Discipline",
    id: "self-discipline",
    title: "Self-Discipline",
    tagline: "Anushasanam — the gentle art of commitment",
    description: "Master your mind and cultivate unwavering practice through the wisdom of Patanjali's foundational sutras on discipline, concentration, and mental mastery.",
    icon: "flame",
    hasTopicColumn: false,
  },
  {
    sheetName: "Intensity",
    id: "intensity",
    title: "Intensity",
    tagline: "Tapas — the fire of discipline",
    description: "Discover how to channel your inner fire and develop the intense focus required to break through mental obstacles and achieve profound results.",
    icon: "zap",
    hasTopicColumn: false,
  },
  {
    sheetName: "Practice",
    id: "practice",
    title: "Practice",
    tagline: "Abhyasa — steady effort, day after day",
    description: "Learn the secrets of sustainable progress by understanding how to establish a practice that is grounded, consistent, and long-lasting.",
    icon: "repeat",
    hasTopicColumn: false,
  },
  {
    sheetName: "Dhyana & Samadhi",
    id: "dhyana-samadhi",
    title: "Dhyana & Samadhi",
    tagline: "Deep meditation and absorption",
    description: "Journey into the highest stages of yoga, exploring the profound states of meditative absorption where the observer and the observed become one.",
    icon: "brain",
    hasTopicColumn: false,
  },
  {
    sheetName: "Knowledge",
    id: "knowledge",
    title: "Knowledge",
    tagline: "Pramana — the light of true understanding",
    description: "Explore the nature of true knowledge and learn to discriminate between the real and the unreal through sutras on wisdom and discernment.",
    icon: "book-open",
    hasTopicColumn: false,
  },
  {
    sheetName: "Yoga",
    id: "yoga",
    title: "Yoga",
    tagline: "Union of body, mind, and spirit",
    description: "Understand the core philosophy of yoga as a complete system for stilling the mind and reconnecting with your innermost self.",
    icon: "heart",
    hasTopicColumn: false,
  },
  {
    sheetName: "Consciousness",
    id: "consciousness",
    title: "Consciousness",
    tagline: "Chitta — exploring the depths of awareness",
    description: "Dive deep into the mechanics of consciousness, understanding how thoughts arise and how to find the stillness that lies beneath them.",
    icon: "eye",
    hasTopicColumn: false,
  },
  {
    sheetName: "8 Limbs of yoga",
    id: "8-limbs",
    title: "8 Limbs of Yoga",
    tagline: "Ashtanga — the complete path of yoga",
    description: "Master the comprehensive eightfold path of yoga, from ethical foundations and physical practice to deep internal states of awareness.",
    icon: "lotus",
    hasTopicColumn: true,
  },
  {
    sheetName: "Yama",
    id: "yama",
    title: "Yama",
    tagline: "Universal morality",
    description: "Build a strong ethical foundation for your journey by exploring the five universal restraints that harmonize your relationship with the world.",
    icon: "users",
    hasTopicColumn: false,
  },
  {
    sheetName: "Niyama",
    id: "niyama",
    title: "Niyama",
    tagline: "Personal observances",
    description: "Cultivate inner purity and contentment through the five personal observances that create a stable environment for spiritual growth.",
    icon: "user",
    hasTopicColumn: false,
  },
  {
    sheetName: "Asana",
    id: "asana",
    title: "Asana",
    tagline: "Physical postures",
    description: "Move beyond the physical and understand Asana as a meditative state of being—steady, comfortable, and perfectly balanced.",
    icon: "dumbbell",
    hasTopicColumn: false,
  },
  {
    sheetName: "Pranayama",
    id: "pranayama",
    title: "Pranayama",
    tagline: "Breath control",
    description: "Harness the power of your vital energy through breath mastery, learning to calm the nervous system and expand your awareness.",
    icon: "wind",
    hasTopicColumn: false,
  },
  {
    sheetName: "Pratyahara",
    id: "pratyahara",
    title: "Pratyahara",
    tagline: "Withdrawal of senses",
    description: "Learn to turn your attention inward, mastering the art of sense withdrawal to find peace amidst the noise of the external world.",
    icon: "eye-off",
    hasTopicColumn: false,
  },
  {
    sheetName: "Dharana",
    id: "dharana",
    title: "Dharana",
    tagline: "Concentration",
    description: "Develop the power of single-pointed concentration, the essential precursor to meditation and the key to mental clarity.",
    icon: "target",
    hasTopicColumn: false,
  },
  {
    sheetName: "Dhyana",
    id: "dhyana",
    title: "Dhyana",
    tagline: "Meditation",
    description: "Experience the effortless flow of meditation where the mind becomes quiet and the true nature of reality begins to reveal itself.",
    icon: "moon",
    hasTopicColumn: false,
  },
  {
    sheetName: "Attachment",
    id: "attachment",
    title: "Attachment",
    tagline: "Vairagya — freedom through letting go",
    description: "Discover the liberating power of non-attachment, learning how to engage fully with life without being bound by expectations or cravings.",
    icon: "leaf",
    hasTopicColumn: false,
  },
  {
    sheetName: "Impressions&karma",
    id: "impressions-karma",
    title: "Impressions & Karma",
    tagline: "Samskaras and action",
    description: "Understand the subtle imprints left by your actions and learn how to navigate the law of karma to create a life of purpose and freedom.",
    icon: "orbit",
    hasTopicColumn: false,
  },
  {
    sheetName: "Ignorance&suffering",
    id: "ignorance-suffering",
    title: "Ignorance & Suffering",
    tagline: "Avidya and kleshas",
    description: "Identify the root causes of mental suffering and learn the tools to overcome ignorance, ego, and attachment for lasting peace.",
    icon: "cloud-rain",
    hasTopicColumn: false,
  },
  {
    sheetName: "Samyama",
    id: "samyama",
    title: "Samyama",
    tagline: "Perfect integration",
    description: "Explore the most advanced stage of mental mastery—the perfect integration of concentration, meditation, and total absorption.",
    icon: "sun",
    hasTopicColumn: false,
  }
];

function clean(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function generateTransliteration(sutraNum: string): string {
  return `Sutra ${sutraNum}`;
}

function formatGitaShloka(raw: string): string {
  if (!raw) return "";

  let chapter = "";
  let verse = "";
  const refMatch = raw.match(/Bhag\w*\s*Gita\s*(\d+)[.:](\d+)/i);
  if (refMatch) {
    chapter = refMatch[1];
    verse = refMatch[2];
  }

  let cleaned = raw.replace(/Bhag\w*\s*Gita\s*\d+[.:]\d+/i, "").trim();

  function toDevanagari(numStr: string) {
    const devDigits = ['०','१','२','३','४','५','६','७','८','९'];
    return numStr.split('').map(char => {
      const d = parseInt(char, 10);
      return isNaN(d) ? char : devDigits[d];
    }).join('');
  }

  let suffix = "";
  if (chapter && verse) {
    const devCh = toDevanagari(chapter);
    const devV = toDevanagari(verse);
    cleaned = cleaned.replace(/॥\s*$/, "").trim();
    suffix = ` ॥ ${devCh}-${devV} ॥`;
  }

  // Replace single danda with danda + newline
  cleaned = cleaned.replace(/।/g, " ।\n").trim();
  // Remove extra spaces at start of new lines
  cleaned = cleaned.split("\n").map(l => l.trim()).join("\n");

  if (suffix) {
    cleaned = cleaned + suffix;
  } else {
    cleaned = cleaned.replace(/॥/g, " ॥ ");
  }

  return cleaned.trim();
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
    const shlokaFrom = formatGitaShloka(clean(row[8 + offset]));
    const wisdomFrom = clean(row[9 + offset]);
    const whatOthersSaid = clean(row[10 + offset]);

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
      shlokaFrom,
      wisdomFrom,
    });
  }


  return {
    id: config.id,
    title: config.title,
    tagline: config.tagline,
    description: config.description,
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
