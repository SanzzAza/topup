import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jobStore } from "@/lib/jobStore";
import { GenerationParams, ProviderName } from "@/lib/types";
import { selectProvider, RequestedProvider } from "@/lib/providers";

function parseBody(body: unknown): { prompt: string; provider: RequestedProvider; params: GenerationParams } {
  const b = body as {
    prompt?: unknown;
    provider?: RequestedProvider;
    params?: { durationSeconds?: unknown; aspectRatio?: unknown };
  };
  const prompt = typeof b?.prompt === "string" ? b.prompt.trim() : "";
  const provider = (b?.provider as RequestedProvider) ?? "auto";
  const durationSeconds = Number(b?.params?.durationSeconds ?? 5);
  const aspectRatio = (b?.params?.aspectRatio ?? "16:9") as GenerationParams["aspectRatio"];

  if (!prompt) {
    throw new Error("Prompt is required");
  }
  if (!["16:9", "9:16", "1:1", "4:3"].includes(aspectRatio)) {
    throw new Error("Invalid aspect ratio");
  }
  const duration = Math.max(1, Math.min(30, Number.isFinite(durationSeconds) ? durationSeconds : 5));

  return {
    prompt,
    provider,
    params: { durationSeconds: duration, aspectRatio },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, provider: requestedProvider, params } = parseBody(body);
    const provider = selectProvider(requestedProvider);

    const job = jobStore.createJob(prompt, provider.name as ProviderName, params);

    // Start the generation asynchronously
    (async () => {
      try {
        await provider.start(job, (patch) => jobStore.updateJob(job.id, patch));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        jobStore.updateJob(job.id, { status: "failed", errorMessage: message });
      }
    })();

    return NextResponse.json({ id: job.id, status: job.status }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
