import { getAllTopicSummaries } from "@/lib/content";
import { Flower2 } from "lucide-react";
import { TopicList } from "./topic-list";

export default function HomePage() {
  const topics = getAllTopicSummaries();

  return (
    <div className="space-y-10">
      <header className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm p-4">
          <Flower2 className="w-9 h-9 text-purple-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Swadhyaya
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Simple daily journey to bring the wisdom of the Patanjali Yoga
            Sutras into your life.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
            Reflect, practice, and grow — one small step at a time.
          </p>
        </div>
      </header>

      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
          Choose a topic
        </h2>
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
