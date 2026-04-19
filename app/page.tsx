import { getAllTopicSummaries } from "@/lib/content";
import { HomeContent } from "./home-content";

export default function HomePage() {
  const topics = getAllTopicSummaries();
  return <HomeContent topics={topics} />;
}
