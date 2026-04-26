import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { GitaView } from "./gita-view";

interface Props {
  params: Promise<{ topicId: string; section: string }>;
}

export default async function GitaPage({ params }: Props) {
  const { topicId, section: sectionStr } = await params;
  const sectionNum = parseInt(sectionStr, 10);
  const topic = getTopicById(topicId);

  if (!topic || isNaN(sectionNum)) notFound();
  const section = topic.sections.find((s) => s.section === sectionNum);
  if (!section || (!section.shlokaFrom && !section.wisdomFrom)) notFound();

  return <GitaView topicId={topicId} section={section} />;
}
