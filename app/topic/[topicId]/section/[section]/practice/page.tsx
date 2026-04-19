import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { PracticeView } from "./practice-view";

interface Props {
  params: Promise<{ topicId: string; section: string }>;
}

export default async function PracticePage({ params }: Props) {
  const { topicId, section: sectionStr } = await params;
  const sectionNum = parseInt(sectionStr, 10);
  const topic = getTopicById(topicId);

  if (!topic || isNaN(sectionNum)) notFound();
  const section = topic.sections.find((s) => s.section === sectionNum);
  if (!section) notFound();

  return <PracticeView topicId={topicId} section={section} />;
}
