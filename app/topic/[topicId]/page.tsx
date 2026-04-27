import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { JourneyList } from "./journey-list";

interface Props {
  params: Promise<{ topicId: string }>;
}

export default async function JourneyPage({ params }: Props) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  return <JourneyList topic={topic} />;
}
