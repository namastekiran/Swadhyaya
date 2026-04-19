"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiChatProps {
  sutraNumber: string;
  sutraMeaning: string;
  insight: string;
  reflectionPrompt: string;
  onClose: () => void;
}

export function AiChat({
  sutraNumber,
  sutraMeaning,
  insight,
  reflectionPrompt,
  onClose,
}: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/ai/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sutraNumber,
          sutraMeaning,
          insight,
          reflectionPrompt,
          userMessage: text,
          history: messages,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                accumulated = "Sorry, I couldn't respond right now. Please try again.";
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please check your API key and try again.",
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-semibold text-foreground">
            AI Insights
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/60 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="max-h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Ask anything about this sutra, its meaning, or how to apply it in your life.
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center pt-1">
              {[
                "What does this sutra mean for me?",
                "How can I practice this today?",
                "Explain this simply",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center mt-0.5">
                <Bot className="w-3.5 h-3.5 text-purple-500" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-100 text-foreground rounded-tr-md"
                  : "bg-gray-50 text-foreground/80 rounded-tl-md"
              }`}
            >
              {msg.content || (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center mt-0.5">
                <User className="w-3.5 h-3.5 text-teal-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about this sutra..."
            disabled={isStreaming}
            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-muted-foreground/40 disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className={`rounded-xl h-10 w-10 transition-all ${
              input.trim() && !isStreaming
                ? "bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white"
                : "bg-gray-100 text-gray-300"
            }`}
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
