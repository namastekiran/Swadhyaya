import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const SYSTEM_PROMPT = `You are a warm, wise guide helping someone explore the Patanjali Yoga Sutras in their daily life. You speak with the calm clarity of a teacher who has practiced yoga for decades — compassionate, non-judgmental, and gently encouraging.

Your role:
- Help the user reflect more deeply on the sutra and its meaning
- Offer practical, grounded insights they can apply in everyday life
- Ask gentle follow-up questions to deepen their self-awareness
- Keep responses concise (2-4 sentences) and conversational
- Draw connections between the ancient teaching and modern life
- Never be preachy or lecture — be like a supportive friend who happens to be wise

Respond in the same language the user writes in. If they write in Hindi or Hinglish, respond accordingly.`;

export async function POST(request: Request) {
  const { sutraNumber, sutraMeaning, insight, reflectionPrompt, userMessage, history } =
    await request.json();

  const contextMessage = `Context for this conversation:
- Sutra: ${sutraNumber}
- Meaning: ${sutraMeaning}
- Insight: ${insight}
- Reflection prompt: ${reflectionPrompt}

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
    model: "gpt-4.1-mini",
    max_tokens: 300,
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
