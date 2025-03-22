'use client';

import { PromptEditor } from '@/components/prompt-manager/prompt-editor';
import { Toaster } from '@/components/ui/sonner';

export default function PromptsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Prompt Management</h1>
      <Toaster />
      <PromptEditor />
    </div>
  );
}
