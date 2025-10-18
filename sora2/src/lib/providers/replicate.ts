import { Provider } from "../types";
import { ENV } from "../env";

// We dynamically import to avoid bundling on the client 
async function getClient() {
  const { default: Replicate } = await import("replicate");
  return new Replicate({ auth: ENV.REPLICATE_API_TOKEN });
}

export const replicateProvider: Provider = {
  name: "replicate",
  async start(job, onUpdate) {
    const replicate = await getClient();

    // The model and input schema are configurable via env; we pass a minimum viable payload
    const input: Record<string, unknown> = {
      prompt: job.prompt,
      duration: job.params.durationSeconds,
      aspect_ratio: job.params.aspectRatio,
    };

    // Kick off prediction
    const prediction = await replicate.predictions.create({
      model: ENV.REPLICATE_MODEL,
      input,
    });

    // Poll until finished
    while (true) {
      const current = await replicate.predictions.get(prediction.id);
      if (current.status === "succeeded") {
        const output = current.output as unknown;
        let videoUrl: string | undefined;
        if (Array.isArray(output)) {
          // Many models return an array of URLs with the last being the MP4
          videoUrl = output[output.length - 1] as string;
        } else if (typeof output === "string") {
          videoUrl = output;
        } else if (output && typeof output === "object" && "video" in output) {
          const v = (output as { video?: unknown }).video;
          if (typeof v === "string") {
            videoUrl = v;
          }
        }
        onUpdate({ status: "succeeded", progress: 100, videoUrl });
        break;
      }
      if (current.status === "failed" || current.status === "canceled") {
        onUpdate({ status: "failed", errorMessage: JSON.stringify(current.error) });
        break;
      }
      // Provide a coarse progress approximation if available
      let pct: number | undefined;
      const maybeMetrics = (current as unknown as { metrics?: unknown }).metrics;
      if (maybeMetrics && typeof maybeMetrics === "object" && "progress" in maybeMetrics) {
        const p = (maybeMetrics as { progress?: unknown }).progress;
        if (typeof p === "number" && Number.isFinite(p)) {
          pct = Math.round(p * 100);
        }
      }
      onUpdate({ status: "processing", progress: pct ?? Math.min(99, (job.progress || 0) + 1) });
      await new Promise((r) => setTimeout(r, 1500));
    }
  },
};
