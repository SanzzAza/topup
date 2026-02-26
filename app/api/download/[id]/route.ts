import { NextResponse } from 'next/server';
import { jobStore } from '@/lib/jobs';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = jobStore.get(params.id);
  if (!job || job.status !== 'completed' || !job.outputPath) {
    return NextResponse.json({ error: 'not ready' }, { status: 400 });
  }
  const file = await fs.promises.readFile(job.outputPath);
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="sora2-${job.id}.mp4"`,
      'Cache-Control': 'no-store',
    },
  });
}
