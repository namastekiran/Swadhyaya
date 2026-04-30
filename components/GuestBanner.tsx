"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function GuestBanner() {
  const [mounted, setMounted] = useState(false);
  const authMode = useAppStore((s) => s.authMode);
  const setLoginModalOpen = useAppStore((s) => s.setLoginModalOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authMode !== "guest") {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-100/50 py-3 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left shadow-sm z-50 sticky top-0">
      <p className="text-[13px] font-medium text-orange-900">
        You are continuing as a guest. Save your journey to continue anytime.
      </p>
      <Button 
        onClick={() => setLoginModalOpen(true)}
        variant="outline" 
        size="sm"
        className="h-8 text-xs font-bold rounded-full bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
      >
        Save Journey
      </Button>
    </div>
  );
}
