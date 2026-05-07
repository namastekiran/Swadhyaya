import OpenAI from "openai";
import { logSearch } from "@/lib/supabase/db";

// Semantic map — human feelings/situations → topic IDs
const INTENT_MAP: { keywords: string[]; ids: string[] }[] = [
  { keywords: ["bored", "boring", "dull", "empty", "meaningless", "pointless", "nothing", "restless", "listless"], ids: ["santosha", "self-discipline", "practice", "knowledge", "yoga"] },
  { keywords: ["anxious", "anxiety", "worry", "worried", "nervous", "fear", "scared", "stress", "stressed", "overthink"], ids: ["pranayama", "consciousness", "pratyahara", "dharana"] },
  { keywords: ["angry", "anger", "temper", "rage", "irritated", "frustrated", "annoyed"], ids: ["ahimsa", "attachment", "yama", "self-discipline"] },
  { keywords: ["lost", "confused", "direction", "purpose", "meaning", "why", "searching"], ids: ["knowledge", "yoga", "swadhyaya-niyama", "who-is-god", "8-limbs"] },
  { keywords: ["procrastinat", "lazy", "stuck", "delay", "avoid", "putting off"], ids: ["self-discipline", "tapas", "intensity", "practice"] },
  { keywords: ["focus", "distract", "concentrat", "attention", "mind wander", "scattered"], ids: ["dharana", "dhyana-samadhi", "pratyahara", "consciousness"] },
  { keywords: ["sad", "unhappy", "depress", "grief", "sorrow", "lonely", "alone"], ids: ["santosha", "yoga", "knowledge", "ignorance-suffering"] },
  { keywords: ["ego", "pride", "arrogant", "humble", "self-important", "show off"], ids: ["aparigraha", "asteya", "brahmacharya", "yama"] },
  { keywords: ["consistent", "habit", "routine", "discipline", "commit", "regular"], ids: ["self-discipline", "practice", "tapas", "intensity"] },
  { keywords: ["relationship", "family", "people", "social", "hurt", "betray", "trust"], ids: ["ahimsa", "satya", "yama", "attachment"] },
  { keywords: ["sleep", "tired", "exhaust", "energy", "fatigue", "burnout"], ids: ["pranayama", "asana", "pratyahara", "santosha"] },
  { keywords: ["meditat", "calm", "peace", "quiet", "still", "mind", "settle"], ids: ["dhyana-samadhi", "dharana", "pratyahara", "consciousness"] },
  { keywords: ["greed", "want", "desire", "more", "enough", "content", "grateful"], ids: ["santosha", "aparigraha", "attachment", "brahmacharya"] },
  { keywords: ["lie", "truth", "honest", "authentic", "fake", "real", "integrity"], ids: ["satya", "ahimsa", "yama", "swadhyaya-niyama"] },
  { keywords: ["body", "health", "yoga", "physical", "breath", "posture", "asana"], ids: ["asana", "pranayama", "8-limbs", "yoga"] },
  { keywords: ["karma", "action", "consequence", "past", "pattern", "repeat"], ids: ["impressions-karma", "attachment", "ignorance-suffering"] },
  { keywords: ["god", "divine", "spiritual", "prayer", "devotion", "faith", "surrender"], ids: ["who-is-god", "iswarpranidhana", "yoga", "knowledge"] },
  { keywords: ["obstacle", "block", "challenge", "problem", "difficult", "hard"], ids: ["obstacles-remedy", "self-discipline", "tapas", "practice"] },
  { keywords: ["success", "achieve", "goal", "accomplish", "win", "ambition", "excel"], ids: ["self-discipline", "tapas", "intensity", "practice", "dharana"] },
  { keywords: ["happy", "happiness", "joy", "content", "fulfil", "satisfied", "pleasure"], ids: ["santosha", "yoga", "knowledge", "who-is-god"] },
  { keywords: ["grief", "loss", "mourn", "miss", "death", "heartbreak", "pain"], ids: ["ignorance-suffering", "attachment", "yoga", "knowledge"] },
  { keywords: ["jealous", "envy", "compare", "comparison", "better than", "inferior"], ids: ["aparigraha", "santosha", "attachment", "asteya"] },
  { keywords: ["doubt", "self-doubt", "confidence", "insecure", "worthless", "not enough"], ids: ["self-discipline", "knowledge", "yoga", "consciousness"] },
  { keywords: ["clarity", "clear", "direction", "vision", "insight"], ids: ["knowledge", "dharana", "consciousness", "swadhyaya-niyama"] },
  { keywords: ["growth", "grow", "improve", "better", "progress", "evolve", "develop"], ids: ["self-discipline", "practice", "tapas", "8-limbs"] },
  { keywords: ["love", "compassion", "kindness", "forgive", "care", "empathy"], ids: ["ahimsa", "yama", "yoga", "attachment"] },
  { keywords: ["patient", "patience", "wait", "slow", "rushing", "hurry"], ids: ["practice", "santosha", "self-discipline", "pratyahara"] },
  { keywords: ["overthink", "ruminate", "spiral", "intrusive", "thought", "mental noise"], ids: ["dharana", "pratyahara", "dhyana-samadhi", "consciousness"] },
  { keywords: ["money", "financial", "wealth", "greed", "poverty", "enough"], ids: ["aparigraha", "santosha", "brahmacharya", "attachment"] },
];

function semanticSearch(query: string, validIds: string[]): string[] {
  const q = query.toLowerCase();
  const scores: Record<string, number> = {};

  for (const entry of INTENT_MAP) {
    const matched = entry.keywords.some((kw) => q.includes(kw));
    if (matched) {
      for (const id of entry.ids) {
        if (validIds.includes(id)) {
          scores[id] = (scores[id] ?? 0) + 1;
        }
      }
    }
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, 5);
}

export async function POST(request: Request) {
  const { query, topics, deviceId } = await request.json();
  const validIds = topics.map((t: { id: string }) => t.id);

  // Try semantic map first — instant, no API needed
  const localResults = semanticSearch(query, validIds);
  if (localResults.length > 0) {
    logSearch(query, localResults, "local", deviceId);
    return Response.json({ ids: localResults });
  }

  // Fall back to AI for queries not covered by the map
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY || "dummy-key-for-build",
    });

    const topicList = topics
      .map((t: { id: string; title: string; tagline: string }) =>
        `- id: "${t.id}" | title: "${t.title}" | tagline: "${t.tagline}"`
      )
      .join("\n");

    const prompt = `Match this user feeling/situation to relevant Yoga Sutra journey IDs.
Journeys: ${topicList}
User: "${query}"
Return JSON array of 2-5 IDs from the list only. Example: ["self-discipline","yoga"]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 100,
      messages: [
        { role: "system", content: "Return only a JSON array of IDs. No explanation." },
        { role: "user", content: prompt },
      ],
    });

    let text = response.choices[0]?.message?.content?.trim() ?? "[]";
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const raw: string[] = JSON.parse(text);
    const ids = raw.filter((id) => validIds.includes(id));
    logSearch(query, ids, ids.length > 0 ? "ai" : "none", deviceId);
    return Response.json({ ids });
  } catch (err) {
    console.error("[search] AI error:", err);
    logSearch(query, [], "none", deviceId);
    return Response.json({ ids: [] });
  }
}
