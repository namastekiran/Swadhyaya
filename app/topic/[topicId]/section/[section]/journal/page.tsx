import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { JournalView } from "./journal-view";

interface Props {
  params: Promise<{ topicId: string; section: string }>;
}

export default async function JournalPage({ params }: Props) {
  const { topicId, section: sectionStr } = await params;
  const sectionNum = parseInt(sectionStr, 10);
  const topic = getTopicById(topicId);

  if (!topic || isNaN(sectionNum)) notFound();
  const section = topic.sections.find((s) => s.section === sectionNum);
  if (!section) notFound();

  return <JournalView topicId={topicId} section={section} />;
}
