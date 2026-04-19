"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initDevice = useAppStore((s) => s.initDevice);

  useEffect(() => {
    initDevice();
  }, [initDevice]);

  return <>{children}</>;
}
