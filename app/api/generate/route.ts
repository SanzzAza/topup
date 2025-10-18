import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jobStore } from '@/lib/jobs';
import { generateVideo } from '@/lib/generator';

export const runtime = 'nodejs';

const bodySchema = z.object({
  prompt: z.string().min(1).max(500),
  width: z.number().int().min(320).max(1920).default(1280),
  height: z.number().int().min(240).max(1080).default(720),
  fps: z.number().int().min(1).max(60).default(30),
  durationSec: z.number().int().min(1).max(15).default(3),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { prompt, width, height, fps, durationSec } = parsed.data;

    const job = jobStore.create(prompt, { width, height, fps, durationSec });

    // Fire and forget generation
    (async () => {
      try {
        jobStore.update(job.id, { status: 'processing', progress: 1 });
        const outputPath = await generateVideo({
          jobId: job.id,
          prompt,
          width,
          height,
          fps,
          durationSec,
          onProgress: (pct) => jobStore.update(job.id, { progress: pct }),
        });
        jobStore.update(job.id, { status: 'completed', progress: 100, outputPath });
      } catch (err: any) {
        jobStore.update(job.id, { status: 'failed', error: String(err?.message || err), progress: 100 });
      }
    })();

    return NextResponse.json({ id: job.id });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
