import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-4xl shadow-sm">
        🕉️
      </div>
      <h2 className="text-xl font-bold text-foreground">Page not found</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        The path you seek does not exist here. Return to the beginning.
      </p>
      <Link href="/">
        <Button
          variant="outline"
          className="rounded-xl border-purple-100 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>
      </Link>
    </div>
  );
}
