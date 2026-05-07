import { getAllTopicSummaries } from "@/lib/content";
import { JourneysContent } from "./journeys-content";

export default function JourneysPage() {
  const topics = getAllTopicSummaries();
  return <JourneysContent topics={topics} />;
}
