import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import PImage from 'pureimage';

export interface GenerateParams {
  jobId: string;
  prompt: string;
  width: number;
  height: number;
  fps: number;
  durationSec: number;
  onProgress?: (pct: number) => void;
}

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

async function drawFrame(
  outPath: string,
  idx: number,
  total: number,
  width: number,
  height: number,
  prompt: string
) {
  const img = PImage.make(width, height);
  const ctx = img.getContext('2d');

  // Animated gradient background
  const t = idx / total;
  const cx = width * (0.3 + 0.4 * Math.sin(t * Math.PI * 2));
  const cy = height * (0.3 + 0.4 * Math.cos(t * Math.PI * 2));
  const rad = Math.max(width, height) * 0.8;

  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rad);
  grad.addColorStop(0, '#1e40af');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad as any;
  ctx.fillRect(0, 0, width, height);

  // Floating orb
  const orbX = width * (0.5 + 0.25 * Math.sin(t * 6.2831));
  const orbY = height * (0.5 + 0.25 * Math.cos(t * 6.2831));
  const orbR = Math.min(width, height) * 0.12;
  const orbGrad = ctx.createRadialGradient(orbX - orbR * 0.3, orbY - orbR * 0.3, orbR * 0.1, orbX, orbY, orbR);
  orbGrad.addColorStop(0, '#93c5fd');
  orbGrad.addColorStop(1, 'rgba(147,197,253,0)');
  ctx.fillStyle = orbGrad as any;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
  ctx.fill();

  // Title text
  const font = await PImage.registerFont(path.join(process.cwd(), 'public', 'Inter-SemiBold.ttf'), 'Inter-SemiBold').load();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.floor(height * 0.07)}pt Inter-SemiBold`;
  ctx.fillText('Sora 2', width / 2, height * 0.18);

  // Prompt text
  ctx.font = `${Math.floor(height * 0.035)}pt Inter-SemiBold`;
  wrapText(ctx, prompt, width * 0.1, height * 0.8, width * 0.8, height * 0.05);

  await PImage.encodePNGToStream(img, fs.createWriteStream(outPath));
}

function wrapText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line = '';
  let offsetY = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line ? line + ' ' + words[n] : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x + maxWidth / 2, y + offsetY);
      line = words[n];
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x + maxWidth / 2, y + offsetY);
}

export async function generateVideo(params: GenerateParams): Promise<string> {
  const { jobId, prompt, width, height, fps, durationSec, onProgress } = params;
  if (!ffmpeg) throw new Error('ffmpeg binary not found');

  const jobDir = path.join(process.cwd(), '.sora2', 'jobs', jobId);
  const framesDir = path.join(jobDir, 'frames');
  const outputPath = path.join(jobDir, 'output.mp4');

  await ensureDir(framesDir);

  const totalFrames = Math.max(1, Math.floor(fps * durationSec));

  for (let i = 0; i < totalFrames; i++) {
    const filename = `frame-${String(i + 1).padStart(5, '0')}.png`;
    const out = path.join(framesDir, filename);
    await drawFrame(out, i, totalFrames, width, height, prompt);
    if (onProgress) onProgress(Math.floor((i / totalFrames) * 70));
  }

  // Encode frames to MP4 using ffmpeg
  await new Promise<void>((resolve, reject) => {
    const args = [
      '-y',
      '-framerate', String(fps),
      '-i', path.join(framesDir, 'frame-%05d.png'),
      '-pix_fmt', 'yuv420p',
      '-vf', `scale=${width}:${height}`,
      '-movflags', '+faststart',
      outputPath,
    ];
    const proc = spawn(ffmpeg as string, args, { stdio: 'ignore' });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
    proc.on('error', reject);
  });

  if (onProgress) onProgress(95);

  // Cleanup frames to save space (best-effort)
  try {
    const files = await fsp.readdir(framesDir);
    await Promise.all(files.map((f) => fsp.unlink(path.join(framesDir, f))));
    await fsp.rmdir(framesDir);
  } catch {
    // ignore
  }

  if (onProgress) onProgress(100);
  return outputPath;
}
