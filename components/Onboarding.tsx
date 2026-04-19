"use client";

import { useState } from "react";
import { Flower2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const INTENTIONS = [
  "Build daily discipline",
  "Find inner peace",
  "Deepen my meditation",
  "Understand yoga philosophy",
  "Manage stress better",
  "Grow spiritually",
];

export function Onboarding() {
  const setProfile = useAppStore((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");

  function handleFinish() {
    setProfile(name, intention);
  }

  if (step === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-2">
        <div className="space-y-6 w-full max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm p-5">
            <Flower2 className="w-10 h-10 text-purple-400" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome to Swadhyaya
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              When the movements of the mind settle, the Self is revealed.
            </p>
            <p className="text-sm text-muted-foreground/70">
              This is the journey of Swadhyaya.
            </p>
          </div>

          <Button
            onClick={() => setStep(1)}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-200/50"
          >
            Let&apos;s Begin
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-2">
        <div className="space-y-8 w-full max-w-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              What should we call you?
            </h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ll use this to personalize your experience
            </p>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            autoFocus
            className="w-full rounded-2xl px-5 py-4 text-lg text-center bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-muted-foreground/40"
          />

          <Button
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            className={`w-full h-14 text-base font-semibold rounded-2xl transition-all ${
              name.trim()
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-200/50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-2">
      <div className="space-y-8 w-full max-w-sm">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            What brings you here, {name.trim().split(" ")[0]}?
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose what resonates or write your own
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {INTENTIONS.map((item) => (
            <button
              key={item}
              onClick={() => setIntention(item)}
              className={`p-3.5 rounded-xl text-sm font-medium text-left transition-all ${
                intention === item
                  ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                  : "bg-white border border-gray-100 text-foreground hover:border-purple-200 hover:bg-purple-50/30"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={INTENTIONS.includes(intention) ? "" : intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Or type your own..."
            className="w-full rounded-xl px-4 py-3 text-sm bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-muted-foreground/40"
          />
        </div>

        <Button
          onClick={handleFinish}
          disabled={!intention.trim()}
          className={`w-full h-14 text-base font-semibold rounded-2xl transition-all ${
            intention.trim()
              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-200/50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start My Journey
        </Button>
      </div>
    </div>
  );
}
