import { randomUUID } from 'crypto';
import path from 'path';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  prompt: string;
  settings: {
    width: number;
    height: number;
    fps: number;
    durationSec: number;
  };
  status: JobStatus;
  progress: number; // 0-100
  error?: string;
  outputPath?: string;
  createdAt: number;
  updatedAt: number;
}

class JobStore {
  private jobs: Map<string, Job> = new Map();

  create(prompt: string, settings: Job['settings']): Job {
    const id = randomUUID();
    const job: Job = {
      id,
      prompt,
      settings,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.jobs.set(id, job);
    return job;
  }

  get(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  update(jobId: string, update: Partial<Job>): Job | undefined {
    const job = this.jobs.get(jobId);
    if (!job) return undefined;
    const next = { ...job, ...update, updatedAt: Date.now() } as Job;
    this.jobs.set(jobId, next);
    return next;
  }

  list(): Job[] {
    return [...this.jobs.values()].sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const jobStore = new JobStore();

export function getJobOutputPath(jobId: string) {
  return path.join(process.cwd(), '.sora2', 'jobs', jobId, 'output.mp4');
}
