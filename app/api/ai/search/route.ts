import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY || "dummy-key-for-build",
});

export async function POST(request: Request) {
  const { query, topics } = await request.json();

  const topicList = topics
    .map((t: { id: string; title: string; tagline: string }) =>
      `- id: "${t.id}" | title: "${t.title}" | tagline: "${t.tagline}"`
    )
    .join("\n");

  const prompt = `You are a guide helping users find the right Yoga Sutra journey based on their intention or life situation.

Available journeys:
${topicList}

User's intention: "${query}"

Return ONLY a JSON array of journey IDs (strings) that are most relevant to the user's intention, ordered by relevance. Return between 1 and 6 IDs. Return an empty array [] if nothing matches.

Example response: ["self-discipline", "practice", "yoga"]
Respond with JSON only, no explanation.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const ids: string[] = JSON.parse(text);
    return Response.json({ ids });
  } catch {
    return Response.json({ ids: [] });
  }
}
