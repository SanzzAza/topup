export type ProviderName = "mock" | "replicate";

export type JobStatus = "queued" | "processing" | "succeeded" | "failed";

export interface GenerationParams {
  durationSeconds: number; // desired output duration in seconds
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:3";
}

export interface Job {
  id: string;
  prompt: string;
  provider: ProviderName;
  status: JobStatus;
  createdAt: number;
  updatedAt: number;
  progress: number; // 0..100
  params: GenerationParams;
  videoUrl?: string;
  errorMessage?: string;
}

export interface Provider {
  name: ProviderName;
  start(job: Job, onUpdate: (patch: Partial<Job>) => void): Promise<void>;
}
