import { getAllTopicSummaries } from "@/lib/content";
import { Flower2 } from "lucide-react";
import { TopicList } from "./topic-list";
import { UserMenu } from "@/components/UserMenu";

export default function HomePage() {
  const topics = getAllTopicSummaries();

  return (
    <div className="space-y-8">
      <div className="flex justify-end pt-2">
        <UserMenu />
      </div>

      <header className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 mb-4 shadow-sm">
          <Flower2 className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Swadhyaya
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto leading-relaxed">
          Simple daily journey to bring the wisdom of the Patanjali Yoga Sutras
          into your life.
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
          Reflect, practice, and grow — one small step at a time.
        </p>
      </header>

      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-1">
          Choose a topic
        </h2>
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
