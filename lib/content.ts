import { TopicData, TopicSummary } from "./types";

const topicIds = [
  "self-discipline",
  "intensity",
  "practice",
  "dhyana-samadhi",
  "knowledge",
  "yoga",
  "consciousness",
  "8-limbs",
  "yama",
  "niyama",
  "asana",
  "pranayama",
  "pratyahara",
  "dharana",
  "dhyana",
  "attachment",
  "impressions-karma",
  "ignorance-suffering",
  "samyama",
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
  return Array.from(topics.values()).map(({ id, title, tagline, icon, totalSections }) => ({
    id,
    title,
    tagline,
    icon,
    totalSections,
  }));
}

export function getTopicById(topicId: string): TopicData | null {
  const topics = loadAllTopics();
  return topics.get(topicId) ?? null;
}
