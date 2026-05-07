import { getAllTopicSummaries } from "@/lib/content";
import { ExploreContent } from "./explore-content";

export default function ExplorePage() {
  const topics = getAllTopicSummaries();
  return <ExploreContent topics={topics} />;
}
