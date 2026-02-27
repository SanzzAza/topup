"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Job = {
  id: string;
  status: "queued" | "processing" | "succeeded" | "failed";
  progress: number;
  videoUrl?: string;
  errorMessage?: string;
  prompt: string;
};

async function startGeneration(
  prompt: string,
  params: { durationSeconds: number; aspectRatio: "16:9" | "9:16" | "1:1" | "4:3" },
  provider?: "auto" | "mock" | "replicate"
) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, params, provider }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data?.error || "Failed to start");
  }
  return (await res.json()) as { id: string; status: Job["status"] };
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:3">("16:9");
  const [duration, setDuration] = useState(5);
  const [provider, setProvider] = useState<"auto" | "mock" | "replicate">("auto");
  const [jobs, setJobs] = useState<Job[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  async function refreshJobs() {
    const res = await fetch("/api/jobs");
    if (res.ok) {
      const data = (await res.json()) as Job[];
      setJobs(data);
    }
  }

  useEffect(() => {
    refreshJobs();
    if (!pollingRef.current) {
      pollingRef.current = setInterval(() => {
        refreshJobs();
      }, 1500);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const canSubmit = useMemo(() => prompt.trim().length > 0, [prompt]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await startGeneration(
        prompt.trim(),
        { durationSeconds: duration, aspectRatio },
        provider
      );
      setPrompt("");
      await refreshJobs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start generation";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Sora 2</h1>
        <p className="text-sm opacity-80 mt-1">AI video generation playground</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-2">
            <span className="text-sm">Prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic shot of a golden retriever surfing at sunset"
              className="w-full rounded-md border border-black/10 dark:border-white/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 min-h-24"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="grid gap-2">
              <span className="text-sm">Aspect ratio</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as "16:9" | "9:16" | "1:1" | "4:3")}
                className="rounded-md border border-black/10 dark:border-white/10 bg-transparent p-2"
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
                <option value="4:3">4:3</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm">Duration (s)</span>
              <input
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="rounded-md border border-black/10 dark:border-white/10 bg-transparent p-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm">Provider</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as "auto" | "mock" | "replicate")}
                className="rounded-md border border-black/10 dark:border-white/10 bg-transparent p-2"
              >
                <option value="auto">Auto</option>
                <option value="mock">Mock</option>
                <option value="replicate">Replicate</option>
              </select>
            </label>
          </div>

          <div className="mt-2">
            <button
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 disabled:opacity-50"
            >
              Generate
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-xl font-medium mb-3">Recent jobs</h2>
          <div className="grid gap-4">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm opacity-80 truncate pr-4">{j.prompt}</div>
                  <div className="text-sm">
                    {j.status !== "succeeded" ? (
                      <span>
                        {j.status} {typeof j.progress === "number" ? `· ${j.progress}%` : null}
                      </span>
                    ) : (
                      <span className="text-green-600">done</span>
                    )}
                  </div>
                </div>
                {j.status === "failed" && j.errorMessage ? (
                  <div className="mt-2 text-sm text-red-600">{j.errorMessage}</div>
                ) : null}
                {j.videoUrl ? (
                  <video className="mt-3 w-full rounded" src={j.videoUrl} controls playsInline />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
