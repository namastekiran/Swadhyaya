import { NextResponse } from "next/server";
import { getAllTopicSummaries } from "@/lib/content";

export async function GET() {
  const topics = getAllTopicSummaries();
  return NextResponse.json(topics);
}
