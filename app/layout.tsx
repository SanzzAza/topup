import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sora 2 — AI Video Generator',
  description: 'Generate short demo videos from text prompts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-brand-600"></div>
              <h1 className="text-2xl font-semibold tracking-tight">Sora 2</h1>
            </div>
            <a className="text-sm text-neutral-300 hover:text-white" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
