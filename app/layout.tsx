import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { LayoutDashboard, Search, MessageSquare, Bot, PlusCircle, History, MoreVertical } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/sidebar';

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
      <body className="min-h-screen">
        <Toaster position="top-center" />
        <div className="flex">
          <Sidebar>
            <SidebarBody>
              <div className="flex flex-col gap-2">
                <SidebarLink
                  link={{
                    label: "Dashboard",
                    href: "/",
                    icon: <LayoutDashboard size={20} />,
                  }}
                />
                <SidebarLink
                  link={{
                    label: "New Chat",
                    href: "#",
                    icon: <PlusCircle size={20} />,
                  }}
                />
                <div className="relative group">
                  <div className="flex items-center">
                    <SidebarLink
                      link={{
                        label: "Chat History",
                        href: "#",
                        icon: <History size={20} />,
                      }}
                    />
                    <button className="absolute right-2 hidden group-hover:flex items-center justify-center">
                      <MoreVertical size={16} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent">
                        Share
                      </button>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <SidebarLink
                  link={{
                    label: "AI Search",
                    href: "/tavily-ai-search",
                    icon: <Search size={20} />,
                  }}
                />
                <SidebarLink
                  link={{
                    label: "AI Agents",
                    href: "/ai-agents",
                    icon: <Bot size={20} />,
                  }}
                />
                <SidebarLink
                  link={{
                    label: "AI Chat",
                    href: "/",
                    icon: <MessageSquare size={20} />,
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
