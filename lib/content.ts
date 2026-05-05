import { TopicData, TopicSummary } from "./types";

const topicIds = [
  // Core yoga philosophy
  "self-discipline",
  "intensity",
  "practice",
  "dhyana-samadhi",
  "knowledge",
  "yoga",
  "consciousness",
  "8-limbs",
  "obstacles-remedy",
  "who-is-god",
  // Yama (ethical restraints)
  "yama",
  "ahimsa",
  "satya",
  "asteya",
  "brahmacharya",
  "aparigraha",
  // Niyama (personal observances)
  "niyama",
  "shauch",
  "santosha",
  "tapas",
  "swadhyaya-niyama",
  "iswarpranidhana",
  // Other limbs
  "asana",
  "pranayama",
  "pratyahara",
  "dharana",
  // Mind & karma
  "attachment",
  "impressions-karma",
  "ignorance-suffering",
] as const;

let topicCache: Map<string, TopicData> | null = null;

function loadAllTopics(): Map<string, TopicData> {
  if (topicCache) return topicCache;

  topicCache = new Map();
  for (const id of topicIds) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data: TopicData = require(`../content/topics/${id}.json`);
    topicCache.set(id, data);
  }
  return topicCache;
}

export function getAllTopicSummaries(): TopicSummary[] {
  const topics = loadAllTopics();
  return Array.from(topics.values()).map(({ id, title, tagline, description, icon, totalSections }) => ({
    id,
    title,
    tagline,
    description,
    icon,
    totalSections,
  }));
}

export function getTopicById(topicId: string): TopicData | null {
  const topics = loadAllTopics();
  return topics.get(topicId) ?? null;
}
