"use client";

const SAMPLE = {
  number: "1.2",
  sanskrit: "योगश्चित्तवृत्तिनिरोधः",
  transliteration: "yogaś citta-vṛtti-nirodhaḥ",
  padaVibhaga: "yogaḥ | citta | vṛtti | nirodhaḥ",
  wordMeanings: "yogaḥ = yoga/union; citta = mind-stuff/consciousness; vṛtti = fluctuations/modifications; nirodhaḥ = restraint/cessation",
  meaning: "Yoga is the restraint of the fluctuations of the mind.",
};

const BORDER = "1px solid #ddd6f3";

// ── Helpers ──────────────────────────────────────────────────────────────────
function PadaWords({ text }: { text: string }) {
  const words = text.split("|").map((w) => w.trim()).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          {w}
          {i < words.length - 1 && <span style={{ color: "#9a80c8", margin: "0 6px" }}>·</span>}
        </span>
      ))}
    </>
  );
}

function WordMeaningsInline({ text }: { text: string }) {
  const entries = text.split(";").map((e) => e.trim()).filter(Boolean);
  return (
    <>
      {entries.map((e, i) => (
        <span key={i}>
          {e}
          {i < entries.length - 1 && <span style={{ color: "#9a80c8", margin: "0 6px" }}>·</span>}
        </span>
      ))}
    </>
  );
}

function WordMeaningsPairs({ text }: { text: string }) {
  const entries = text.split(";").map((e) => e.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px" }}>
      {entries.map((e, i) => {
        const [word, ...rest] = e.split("=");
        return (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontWeight: 700, color: "#5a3a8a", fontSize: 11 }}>{word.trim()}</span>
            <span style={{ color: "#888", fontSize: 10 }}>=</span>
            <span style={{ color: "#3d2f5e", fontSize: 11 }}>{rest.join("=").trim()}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Option A : Two-column table (current) ────────────────────────────────────
function OptionA() {
  const rows = [
    { label: "Transliteration", content: <em>{SAMPLE.transliteration}</em> },
    { label: "Pada-vibhāga",    content: <PadaWords text={SAMPLE.padaVibhaga} /> },
    { label: "Word meanings",   content: <WordMeaningsInline text={SAMPLE.wordMeanings} /> },
  ];
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: BORDER }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", borderBottom: i < rows.length - 1 ? BORDER : "none" }}>
          <div style={{ width: 110, flexShrink: 0, padding: "11px 14px", background: "#f0ebff", borderRight: BORDER }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4a3870" }}>{r.label}</span>
          </div>
          <div style={{ flex: 1, padding: "11px 14px", background: "#faf8ff", fontSize: 12, color: "#2e2048", lineHeight: 1.7 }}>
            {r.content}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Option B : Stacked cards with label above ─────────────────────────────────
function OptionB() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { label: "TRANSLITERATION", content: <p style={{ fontSize: 14, fontStyle: "italic", color: "#3d2f5e", margin: 0 }}>{SAMPLE.transliteration}</p> },
        { label: "PADA-VIBHĀGA", content: <p style={{ fontSize: 13, color: "#3d2f5e", margin: 0, lineHeight: 1.8 }}><PadaWords text={SAMPLE.padaVibhaga} /></p> },
        { label: "WORD MEANINGS", content: <WordMeaningsPairs text={SAMPLE.wordMeanings} /> },
      ].map((r, i) => (
        <div key={i} style={{ background: "#faf8ff", borderRadius: 12, padding: "12px 14px", border: BORDER }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: "#9a80c8", letterSpacing: "0.1em", marginBottom: 6 }}>{r.label}</p>
          {r.content}
        </div>
      ))}
    </div>
  );
}

// ── Option C : Flowing inline prose ──────────────────────────────────────────
function OptionC() {
  const words = SAMPLE.padaVibhaga.split("|").map((w) => w.trim()).filter(Boolean);
  const meanings = SAMPLE.wordMeanings.split(";").map((e) => e.trim()).filter(Boolean);
  return (
    <div style={{ background: "#faf8ff", borderRadius: 14, padding: "16px 18px", border: BORDER }}>
      <p style={{ fontSize: 15, fontStyle: "italic", color: "#4a3870", marginBottom: 10, lineHeight: 1.6 }}>
        {SAMPLE.transliteration}
      </p>
      <div style={{ height: 1, background: "#ede8f7", marginBottom: 10 }} />
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9a80c8", letterSpacing: "0.08em", marginBottom: 6 }}>WORDS</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 0", marginBottom: 12 }}>
        {words.map((w, i) => (
          <span key={i}>
            <span style={{ fontSize: 12, color: "#3d2f5e" }}>{w}</span>
            {i < words.length - 1 && <span style={{ color: "#c9a8e0", margin: "0 6px" }}>·</span>}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9a80c8", letterSpacing: "0.08em", marginBottom: 8 }}>MEANINGS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {meanings.map((e, i) => {
          const [w, ...rest] = e.split("=");
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#7c4fc4", minWidth: 80, flexShrink: 0 }}>{w.trim()}</span>
              <span style={{ fontSize: 11, color: "#4a3870" }}>{rest.join("=").trim()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Option D : Pill words + meaning below each ────────────────────────────────
function OptionD() {
  const words = SAMPLE.padaVibhaga.split("|").map((w) => w.trim()).filter(Boolean);
  const meaningMap: Record<string, string> = {};
  SAMPLE.wordMeanings.split(";").forEach((e) => {
    const [w, ...rest] = e.split("=");
    if (w) meaningMap[w.trim()] = rest.join("=").trim();
  });
  return (
    <div style={{ background: "#faf8ff", borderRadius: 14, padding: "16px 18px", border: BORDER }}>
      <p style={{ fontSize: 13, fontStyle: "italic", color: "#4a3870", marginBottom: 14, lineHeight: 1.6 }}>
        {SAMPLE.transliteration}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {words.map((w, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ background: "#ede8f7", borderRadius: 20, padding: "5px 14px", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#5a3a8a" }}>{w}</span>
            </div>
            <span style={{ fontSize: 10, color: "#7a6898", lineHeight: 1.4, display: "block", maxWidth: 90 }}>
              {meaningMap[w] ?? ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Option E : Minimal dark strip (like the screenshot) ───────────────────────
function OptionE() {
  const rows = [
    { label: "Transliteration", content: <em style={{ fontFamily: "monospace" }}>{SAMPLE.transliteration}</em> },
    { label: "Pada-vibhaga",    content: <PadaWords text={SAMPLE.padaVibhaga} /> },
    { label: "Word meanings",   content: <WordMeaningsInline text={SAMPLE.wordMeanings} /> },
  ];
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #3a2e5a", background: "#1e1630" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", borderBottom: i < rows.length - 1 ? "1px solid #3a2e5a" : "none" }}>
          <div style={{ width: 120, flexShrink: 0, padding: "12px 14px", borderRight: "1px solid #3a2e5a" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a8e0" }}>{r.label}</span>
          </div>
          <div style={{ flex: 1, padding: "12px 14px", fontSize: 12, color: "#e8e0f8", lineHeight: 1.7 }}>
            {r.content}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SutraOptionsPage() {
  const options = [
    { id: "A", label: "Two-column table (current)", component: <OptionA /> },
    { id: "B", label: "Stacked cards", component: <OptionB /> },
    { id: "C", label: "Flowing prose with word list", component: <OptionC /> },
    { id: "D", label: "Word pills with meaning below", component: <OptionD /> },
    { id: "E", label: "Dark table (like your screenshot)", component: <OptionE /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f0fc", padding: "28px 20px 80px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9a80c8", letterSpacing: "0.1em", marginBottom: 4 }}>SUTRA DISPLAY</p>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#3d2f5e", marginBottom: 4 }}>Layout Options</h1>
      <p style={{ fontSize: 12, color: "#7a6898", marginBottom: 28 }}>Pick the one you like — tell me Option A/B/C/D/E</p>

      {/* Sanskrit reference */}
      <div style={{ background: "linear-gradient(135deg,#4a3070,#7c4fc4)", borderRadius: 14, padding: "14px 18px", marginBottom: 28 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Sutra 1.2</p>
        <p style={{ fontSize: 16, color: "#fff", fontStyle: "italic", fontFamily: "serif" }}>{SAMPLE.sanskrit}</p>
      </div>

      {options.map((opt) => (
        <div key={opt.id} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#7c4fc4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{opt.id}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#3d2f5e" }}>{opt.label}</p>
          </div>
          {opt.component}
        </div>
      ))}
    </div>
  );
}
