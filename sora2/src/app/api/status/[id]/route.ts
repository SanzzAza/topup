import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jobStore } from "@/lib/jobStore";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const job = jobStore.getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}
