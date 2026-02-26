'use client';

import React from 'react';
import useSWR from 'swr';
import { ProgressBar } from '@/components/ProgressBar';

type JobResponse = {
  job: {
    id: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    error?: string;
  };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const [prompt, setPrompt] = React.useState('A serene neon orb drifting through cosmic gradients');
  const [width, setWidth] = React.useState(1280);
  const [height, setHeight] = React.useState(720);
  const [fps, setFps] = React.useState(30);
  const [durationSec, setDurationSec] = React.useState(3);
  const [currentJobId, setCurrentJobId] = React.useState<string | null>(null);

  const { data, mutate } = useSWR<JobResponse>(
    currentJobId ? `/api/job/${currentJobId}` : null,
    fetcher,
    { refreshInterval: 500 }
  );

  const job = data?.job;

  async function onGenerate() {
    setCurrentJobId(null);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, width, height, fps, durationSec }),
    });
    const json = await res.json();
    if (res.ok) {
      setCurrentJobId(json.id);
      mutate();
    } else {
      alert('Failed to start job: ' + JSON.stringify(json));
    }
  }

  return (
    <main>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">Prompt</h2>
            <textarea
              className="input min-h-[120px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you want to generate..."
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="text-neutral-400">Width</span>
                <input className="input mt-1" type="number" value={width} min={320} max={1920} onChange={(e) => setWidth(parseInt(e.target.value || '0'))} />
              </label>
              <label className="block text-sm">
                <span className="text-neutral-400">Height</span>
                <input className="input mt-1" type="number" value={height} min={240} max={1080} onChange={(e) => setHeight(parseInt(e.target.value || '0'))} />
              </label>
              <label className="block text-sm">
                <span className="text-neutral-400">FPS</span>
                <input className="input mt-1" type="number" value={fps} min={1} max={60} onChange={(e) => setFps(parseInt(e.target.value || '0'))} />
              </label>
              <label className="block text-sm">
                <span className="text-neutral-400">Duration (sec)</span>
                <input className="input mt-1" type="number" value={durationSec} min={1} max={15} onChange={(e) => setDurationSec(parseInt(e.target.value || '0'))} />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button className="btn" onClick={onGenerate} disabled={!prompt.trim()}>
                Generate Video
              </button>
              {job && (
                <div className="text-sm text-neutral-400">
                  <span className="uppercase tracking-wide text-neutral-500">Status:</span> {job.status}
                </div>
              )}
            </div>

            {job && job.status !== 'completed' && (
              <div className="mt-4">
                <ProgressBar value={job.progress} />
              </div>
            )}

            {job?.status === 'failed' && (
              <p className="mt-4 text-sm text-red-400">{job.error}</p>
            )}
          </div>

          {(job?.status === 'completed') && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6">
              <h2 className="mb-4 text-lg font-semibold">Result</h2>
              <video className="w-full rounded" src={`/api/download/${job.id}`} controls preload="metadata" />
              <div className="mt-3">
                <a className="btn" href={`/api/download/${job.id}`}>Download MP4</a>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6">
            <h3 className="mb-2 font-semibold">About Sora 2</h3>
            <p className="text-sm text-neutral-400">Sora 2 is a demo web app that generates short abstract videos from text prompts. It procedurally renders frames on the server and encodes them to MP4.</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6">
            <h3 className="mb-2 font-semibold">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-neutral-400 space-y-1">
              <li>Keep duration short (≤ 5–8s) for faster results.</li>
              <li>Use lower resolution if generation is slow.</li>
              <li>Describe colors, vibes, motion, and style.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
