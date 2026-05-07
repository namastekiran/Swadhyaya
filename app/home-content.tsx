"use client";

import { useState, useEffect } from "react";
import { ReturningHome } from "./returning-home";
import { Onboarding } from "@/components/Onboarding";
import { SplashScreen } from "@/components/SplashScreen";
import { useAppStore } from "@/lib/store";
import type { TopicSummary } from "@/lib/types";

let splashShown = false;

export function HomeContent({ topics }: { topics: TopicSummary[] }) {
  const [mounted, setMounted] = useState(false);
  const [splashDone, setSplashDone] = useState(splashShown);
  const profile = useAppStore((s) => s.profile);
  const topicsProgress = useAppStore((s) => s.topics);
  const answers = useAppStore((s) => s.answers);

  useEffect(() => { setMounted(true); }, []);

  const hasJourney = Object.keys(topicsProgress).length > 0 || Object.keys(answers).length > 0;

  if (!mounted) return null;
  if (!splashDone) return <SplashScreen onDone={() => { splashShown = true; setSplashDone(true); }} />;
  if (!profile) return <Onboarding />;
  if (hasJourney) return <ReturningHome topics={topics} />;

  // First-time user with no journeys yet — send them to journeys page
  if (typeof window !== "undefined") window.location.replace("/journeys");
  return null;
}
