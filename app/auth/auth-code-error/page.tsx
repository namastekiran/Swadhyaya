"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
        <p className="text-gray-500 max-w-xs mx-auto">
          We couldn't verify your login link. It may have expired or already been used.
        </p>
      </div>

      <div className="flex flex-col w-full gap-3">
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "default" }), "w-full h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center")}
        >
          Try Logging In Again
        </Link>
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "ghost" }), "w-full h-12 rounded-2xl flex items-center justify-center")}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
