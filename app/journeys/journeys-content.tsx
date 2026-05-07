"use client";

import { useState, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { TopicList } from "@/app/topic-list";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

const categories = [
  "All journeys",
  "I procrastinate",
  "I feel anxious",
  "My mind won't settle",
  "I feel lost",
  "I lose my temper",
  "I can't stay consistent",
  "I lack purpose",
  "My ego gets in the way",
];

export function JourneysContent({ topics }: { topics: TopicSummary[] }) {
  const [category, setCategory] = useState("All journeys");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deviceId = useAppStore((s) => s.deviceId);

  const displayedTopics = searchResults !== null
    ? topics.filter((t) => searchResults.includes(t.id))
    : topics;

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, deviceId, topics: topics.map((t) => ({ id: t.id, title: t.title, tagline: t.tagline })) }),
      });
      const data = await res.json();
      setSearchResults(data.ids ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setSearchResults(null);
    inputRef.current?.focus();
  }

  return (
    <div className="pb-20 -mx-6">
      <div className="mx-4 rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(180,160,210,0.13)]" style={{ background: "#f8f4ff" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(160deg,#d8ccf0 0%,#ecdff8 100%)", padding: "24px 20px 20px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#3d2f5e", marginBottom: 2 }}>Your Journeys</h1>
          <p style={{ fontSize: 13, color: "#7a6898", marginBottom: 16 }}>Choose a path to begin or continue</p>

          {/* Search bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fff", borderRadius: 14,
              border: "1.5px solid #d8ccf0", padding: "10px 14px",
              boxShadow: "0 2px 8px rgba(120,80,200,0.06)",
            }}>
              {searching
                ? <Loader2 style={{ width: 15, height: 15, color: "#a389d4", flexShrink: 0 }} className="animate-spin" />
                : <Search style={{ width: 15, height: 15, color: "#a389d4", flexShrink: 0 }} />
              }
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="What is your intention today?"
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: 13,
                  color: "#3d2f5e", background: "transparent",
                }}
              />
              {query && (
                <button onClick={clearSearch}>
                  <X style={{ width: 14, height: 14, color: "#a389d4" }} />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          {searchResults === null && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    border: "1.5px solid", cursor: "pointer",
                    background: category === cat ? "#7c4fc4" : "rgba(255,255,255,0.7)",
                    borderColor: category === cat ? "#7c4fc4" : "#d8ccf0",
                    color: category === cat ? "#fff" : "#6a4a98",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Search result label */}
          {searchResults !== null && searchResults.length > 0 && (
            <p style={{ fontSize: 12, color: "#7a6898" }}>
              {searchResults.length} journey{searchResults.length > 1 ? "s" : ""} found
              {" · "}
              <button onClick={clearSearch} style={{ color: "#7c4fc4", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>
                Clear
              </button>
            </p>
          )}
        </div>

        {/* No results message */}
        {searchResults !== null && searchResults.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 28, marginBottom: 14 }}>🙏</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#3d2f5e", marginBottom: 8 }}>
              No journeys found
            </p>
            <p style={{ fontSize: 13, color: "#7a6898", lineHeight: 1.7, marginBottom: 20 }}>
              Try describing how you feel — like{" "}
              <em>&quot;I feel restless&quot;</em> or{" "}
              <em>&quot;I want more focus&quot;</em>
            </p>
            <button
              onClick={clearSearch}
              style={{ background: "linear-gradient(135deg,#7c4fc4,#a389d4)", borderRadius: 12, padding: "10px 24px", fontSize: 13, fontWeight: 500, color: "#fff", border: "none", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        ) : (
          <div style={{ padding: "18px 14px 24px" }}>
            <TopicList topics={displayedTopics} activeCategory={searchResults !== null ? "All journeys" : category} />
          </div>
        )}

      </div>
    </div>
  );
}
