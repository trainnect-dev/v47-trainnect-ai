import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { Sidebar, SidebarBody, SidebarLinks } from '@/components/sidebar';
import { Providers } from './providers';

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen dark:bg-gray-950">
        <Providers>
        <Toaster position="top-center" />
        <div className="flex">
          <Sidebar>
            <SidebarBody>
              <SidebarLinks />
            </SidebarBody>
          </Sidebar>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
        </Providers>
      </body>
    </html>
  );
}
