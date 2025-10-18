# Sora 2 — AI Video Generator

A minimal Next.js app that turns text prompts into short abstract videos. It renders frames server-side using PureImage and encodes them with ffmpeg-static.

## Getting started

- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Open `http://localhost:3000`

## Notes

- Video generation happens on the server using a best-effort pure JS renderer. For more realistic results, integrate an external video generation API.
- Jobs and outputs are stored under `.sora2/jobs/<id>` and are not committed.
