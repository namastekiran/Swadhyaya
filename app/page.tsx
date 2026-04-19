import { getAllTopicSummaries } from "@/lib/content";
import { TopicList } from "./topic-list";

export default function HomePage() {
  const topics = getAllTopicSummaries();

  return (
    <div className="space-y-8">
      <header className="text-center pt-6 pb-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 text-3xl mb-4 shadow-sm">
          🕉️
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Swadhyaya
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
          Your gentle journey through the Patanjali Yoga Sutras
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
