import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { JournalList } from "./journal-list";

interface Props {
  params: Promise<{ topicId: string }>;
}

export default async function JournalPage({ params }: Props) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();
  return <JournalList topic={topic} />;
}
