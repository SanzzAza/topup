import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jobStore } from "@/lib/jobStore";

export async function GET(_req: NextRequest) {
  return NextResponse.json(jobStore.listJobs());
}
