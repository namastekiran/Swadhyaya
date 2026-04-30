"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function LoginModal() {
  const [mounted, setMounted] = useState(false);
  const isLoginModalOpen = useAppStore((s) => s.isLoginModalOpen);
  const setLoginModalOpen = useAppStore((s) => s.setLoginModalOpen);
  const setAuthMode = useAppStore((s) => s.setAuthMode);
  const executePendingAction = useAppStore((s) => s.executePendingAction);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGuest = () => {
    setAuthMode("guest");
    setLoginModalOpen(false);
    executePendingAction();
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Google login failed", { description: error.message });
    }
  };

  const handleEmailLogin = async () => {
    const email = window.prompt("Enter your email for a magic link:");
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Login failed", { description: error.message });
    } else {
      toast.success("Magic link sent!", { description: "Check your email to log in." });
      setLoginModalOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setLoginModalOpen(open);
    if (!open) {
      // If the user dismisses the modal without choosing, we drop the pending action.
      useAppStore.setState({ pendingAction: null });
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-[28px] p-6 sm:p-8 bg-white border-none shadow-xl">
        <DialogHeader className="text-center sm:text-center space-y-3">
          <DialogTitle className="text-[22px] font-bold text-gray-900 tracking-tight">
            Save Your Journey
          </DialogTitle>
          <DialogDescription className="text-[15px] text-gray-500 leading-relaxed max-w-[280px] mx-auto font-medium">
            Your reflections and progress will be saved so you can continue anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-[52px] text-[15px] font-semibold rounded-2xl bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm flex items-center justify-center gap-3 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>
          
          <Button
            onClick={handleEmailLogin}
            className="w-full h-[52px] text-[15px] font-semibold rounded-2xl bg-gray-900 text-white hover:bg-gray-800 shadow-sm flex items-center justify-center gap-2.5 transition-all"
          >
            <Mail className="w-[18px] h-[18px]" />
            Continue with Email
          </Button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400 font-bold">Or</span>
            </div>
          </div>

          <Button
            onClick={handleGuest}
            variant="ghost"
            className="w-full h-[52px] text-[15px] font-semibold rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
