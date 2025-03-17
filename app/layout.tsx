import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';

import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Reasoning',
  description:
    'Trainnect-AI-Reasoning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
          <Toaster position="top-center" />
          <Navigation />
          {children}
      </body>
    </html>
  );
}
