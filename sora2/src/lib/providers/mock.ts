import { Provider } from "../types";

const SAMPLE_VIDEOS = [
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockProvider: Provider = {
  name: "mock",
  async start(job, onUpdate) {
    onUpdate({ status: "processing", progress: 5 });

    // Simulate staged progress over ~8 seconds
    for (const pct of [15, 30, 45, 60, 75, 90]) {
      await sleep(1000);
      onUpdate({ progress: pct });
    }

    await sleep(800);
    const url = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    onUpdate({ status: "succeeded", progress: 100, videoUrl: url });
  },
};
