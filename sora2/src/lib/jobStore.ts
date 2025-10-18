import { Job, JobStatus, ProviderName, GenerationParams } from "./types";
import crypto from "node:crypto";

class InMemoryJobStore {
  private jobs = new Map<string, Job>();

  createJob(prompt: string, provider: ProviderName, params: GenerationParams): Job {
    const id = crypto.randomUUID();
    const now = Date.now();
    const job: Job = {
      id,
      prompt,
      provider,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      progress: 0,
      params,
    };
    this.jobs.set(id, job);
    return job;
  }

  updateJob(id: string, patch: Partial<Job>): Job | undefined {
    const current = this.jobs.get(id);
    if (!current) return undefined;
    const updated: Job = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
    };
    this.jobs.set(id, updated);
    return updated;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  listJobs(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const jobStore = new InMemoryJobStore();

export function setJobStatus(id: string, status: JobStatus, extra?: Partial<Job>) {
  jobStore.updateJob(id, { status, ...extra });
}
