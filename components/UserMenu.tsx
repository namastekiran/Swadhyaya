"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-sm font-medium text-foreground hover:shadow-sm transition-all"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign in
      </Link>
    );
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-100">
        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="w-3 h-3 text-purple-500" />
        </div>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <button
        onClick={handleLogout}
        className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors"
        title="Sign out"
      >
        <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
