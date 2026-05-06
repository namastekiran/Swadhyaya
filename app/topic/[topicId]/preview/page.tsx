import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { TopicPreview } from "./topic-preview";

interface Props {
  params: Promise<{ topicId: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();
  return <TopicPreview topic={topic} />;
}
