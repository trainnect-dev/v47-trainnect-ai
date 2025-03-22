'use client';

import { useState, useEffect } from 'react';
import { PromptConfig, TavilySettings } from '@/lib/config/prompts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function PromptEditor() {
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [editedContent, setEditedContent] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<PromptConfig | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      if (data.prompts) {
        setPrompts(data.prompts);
      }
    } catch (error) {
      toast.error('Failed to fetch prompts');
    }
  }

  useEffect(() => {
    const foundPrompt = prompts.find(p => p.id === selectedPrompt);
    if (foundPrompt) {
      setEditedContent(foundPrompt.content);
      setVariables(foundPrompt.variables || []);
      setCurrentPrompt(foundPrompt);
    }
  }, [selectedPrompt, prompts]);

  async function handleSave() {
    setIsLoading(true);
    try {
      const updatedPrompt = prompts.find(p => p.id === selectedPrompt);
      if (!updatedPrompt) return;

      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPrompt,
          config: {
            ...updatedPrompt,
            content: editedContent,
            tavilySettings: currentPrompt?.tavilySettings
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }

      await fetchPrompts();
      toast.success('Prompt updated successfully');
    } catch (error) {
      toast.error('Failed to update prompt');
    } finally {
      setIsLoading(false);
    }
  }

  const updateTavilySettings = (updates: Partial<TavilySettings>) => {
    if (!currentPrompt) return;

    const updatedPrompt = {
      ...currentPrompt,
      tavilySettings: {
        ...currentPrompt.tavilySettings as TavilySettings,
        ...updates
      }
    };

    setCurrentPrompt(updatedPrompt);
    setPrompts(prompts.map(p => p.id === selectedPrompt ? updatedPrompt : p));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Editor</CardTitle>
          <CardDescription>
            Select and edit system prompts for different features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Prompt</label>
            <Select
              value={selectedPrompt}
              onValueChange={setSelectedPrompt}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {prompts.map(prompt => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {currentPrompt && (
            <div className="space-y-6">
              {selectedPrompt === 'tavily-chat' && currentPrompt.tavilySettings && (
                <div className="space-y-4 mb-6 p-4 border rounded-lg">
                  <h3 className="font-medium">Tavily Search Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Include Domains (comma-separated)</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={currentPrompt.tavilySettings.includeDomains?.join(', ') || ''}
                        onChange={(e) => {
                          const domains = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
                          updateTavilySettings({ includeDomains: domains });
                        }}
                        placeholder="e.g., example.com, another-site.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Exclude Domains (comma-separated)</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={currentPrompt.tavilySettings.excludeDomains?.join(', ') || ''}
                        onChange={(e) => {
                          const domains = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
                          updateTavilySettings({ excludeDomains: domains });
                        }}
                        placeholder="e.g., exclude.com, block-this.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Search Depth</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          value={currentPrompt.tavilySettings.searchDepth}
                          onChange={(e) => {
                            updateTavilySettings({
                              searchDepth: e.target.value as "basic" | "advanced"
                            });
                          }}
                        >
                          <option value="basic">Basic</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Results</label>
                        <input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          value={currentPrompt.tavilySettings.maxResults}
                          onChange={(e) => {
                            updateTavilySettings({
                              maxResults: parseInt(e.target.value)
                            });
                          }}
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={currentPrompt.tavilySettings.includeAnswer}
                          onChange={(e) => {
                            updateTavilySettings({
                              includeAnswer: e.target.checked
                            });
                          }}
                        />
                        <span className="text-sm font-medium">Include Answer</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={currentPrompt.tavilySettings.includeRawContent}
                          onChange={(e) => {
                            updateTavilySettings({
                              includeRawContent: e.target.checked
                            });
                          }}
                        />
                        <span className="text-sm font-medium">Include Raw Content</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Available Variables</label>
                <div className="flex flex-wrap gap-2">
                  {variables.map(variable => (
                    <Badge key={variable} variant="secondary">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Edit Prompt</label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px] font-mono"
                  placeholder="Enter prompt content..."
                />
              </div>

              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
