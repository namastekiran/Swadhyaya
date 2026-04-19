import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content";
import { SectionDetail } from "./section-detail";

interface Props {
  params: Promise<{ topicId: string; section: string }>;
}

export default async function SectionPage({ params }: Props) {
  const { topicId, section: sectionStr } = await params;
  const sectionNum = parseInt(sectionStr, 10);

  const topic = getTopicById(topicId);
  if (!topic || isNaN(sectionNum)) {
    notFound();
  }

  const sectionData = topic.sections.find((s) => s.section === sectionNum);
  if (!sectionData) {
    notFound();
  }

  return (
    <SectionDetail
      topicId={topic.id}
      topicTitle={topic.title}
      section={sectionData}
      totalSections={topic.totalSections}
    />
  );
}
