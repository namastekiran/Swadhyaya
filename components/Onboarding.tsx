"use client";

import { useState } from "react";
import { Flower2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export function Onboarding() {
  const setProfile = useAppStore((s) => s.setProfile);
  const [name, setName] = useState("");

  function handleStart() {
    setProfile(name, "");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] px-6">
      <div className="w-full max-w-[440px] space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Brand/Icon Area */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-100/50 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-[28px] bg-white shadow-xl shadow-purple-100/20 flex items-center justify-center">
              <Flower2 className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Swadhyaya
            </h1>
            <p className="text-sm font-medium text-purple-600/80 uppercase tracking-widest">
              The Journey Inward
            </p>
          </div>
        </div>

        {/* Interaction Card */}
        <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                How should we greet you?
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                Ancient wisdom is best explored as a personal conversation. Tell us your name to begin.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && handleStart()}
                placeholder="Your first name"
                autoFocus
                className="w-full bg-gray-50/50 border border-gray-100 rounded-3xl px-6 py-5 text-lg font-medium text-center transition-all focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 outline-none placeholder:text-gray-300"
              />

              <Button
                onClick={handleStart}
                disabled={!name.trim()}
                className={`w-full h-16 text-lg font-bold rounded-3xl transition-all duration-300 ${
                  name.trim()
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-100/50 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
