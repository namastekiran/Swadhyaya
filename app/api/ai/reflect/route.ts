import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const SYSTEM_PROMPT = `You are a warm, wise guide helping someone explore the Patanjali Yoga Sutras in their daily life. You speak with the calm clarity of a teacher who has practiced yoga for decades — compassionate, non-judgmental, and gently encouraging.

Your role:
- Help the user reflect more deeply on the sutra and its meaning
- Offer practical, grounded insights they can apply in everyday life
- Ask gentle follow-up questions to deepen their self-awareness
- Draw connections between the ancient teaching and modern life
- Never be preachy or lecture — be like a supportive friend who happens to be wise

Formatting rules (IMPORTANT):
- Use bullet points (•) for lists, NOT markdown asterisks or dashes
- Use short paragraphs separated by blank lines for readability
- Do NOT use markdown syntax like **, ##, *, or _
- Do NOT use numbered lists with periods (1. 2. 3.)
- Keep each response to 3-5 short bullet points or 2-3 short paragraphs
- End with one gentle follow-up question on its own line

Respond in the same language the user writes in. If they write in Hindi or Hinglish, respond accordingly.`;

export async function POST(request: Request) {
  const { sutraNumber, sutraMeaning, insight, reflectionPrompt, userMessage, history, userName, userIntention } =
    await request.json();

  const personalContext = userName
    ? `\n- User's name: ${userName}${userIntention ? `\n- Their intention: ${userIntention}` : ""}\nAddress them by name occasionally to make it personal.`
    : "";

  const contextMessage = `Context for this conversation:
- Sutra: ${sutraNumber}
- Meaning: ${sutraMeaning}
- Insight: ${insight}
- Reflection prompt: ${reflectionPrompt}${personalContext}

The user is reflecting on this teaching. Help them go deeper.`;

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: contextMessage },
    {
      role: "assistant",
      content:
        "I understand the context. I'm ready to help the user reflect on this sutra. I'll be warm, concise, and insightful.",
    },
  ];

  if (history && Array.isArray(history)) {
    for (const msg of history) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }
  }

  messages.push({ role: "user", content: userMessage });

  const stream = await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    max_completion_tokens: 300,
    stream: true,
    messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
