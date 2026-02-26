import { NextResponse } from 'next/server';
import { jobStore } from '@/lib/jobs';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = jobStore.get(params.id);
  if (!job) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ job });
}
