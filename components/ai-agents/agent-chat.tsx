'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { ModelConfig, AVAILABLE_MODELS } from '@/lib/ai-agents/types';
import { cn } from '@/lib/utils';
import type { Message } from 'ai';
import { CopyIcon, CheckIcon, PlusIcon } from '@/components/icons';

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface ExtendedMessage extends Message {
  toolCalls?: ToolCall[];
}

interface AgentChatProps {
  className?: string;
}

function ModelSelect({ 
  label, 
  value, 
  onChange, 
  models = AVAILABLE_MODELS 
}: { 
  label: string; 
  value: ModelConfig; 
  onChange: (model: ModelConfig) => void; 
  models?: ModelConfig[]; 
}) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full p-2 rounded-md border bg-background"
        value={value.model}
        onChange={(e) => {
          const model = models.find(m => m.model === e.target.value);
          if (model) onChange(model);
        }}
      >
        {models.map((model) => (
          <option key={model.model} value={model.model}>
            {model.label} ({model.provider})
          </option>
        ))}
      </select>
    </div>
  );
}

export function AgentChat({ className }: AgentChatProps) {
  const [primaryModel, setPrimaryModel] = useState<ModelConfig>(AVAILABLE_MODELS[0]);
  const [secondaryModel, setSecondaryModel] = useState<ModelConfig>(AVAILABLE_MODELS[1]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/ai-agents',
    body: {
      primaryModel,
      secondaryModel,
    },
  });

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedMessageId) {
      const timer = setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedMessageId]);

  // Function to copy message content to clipboard
  const copyToClipboard = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className={cn('flex flex-col h-[calc(100vh-12rem)]', className)}>
      <div className="flex gap-4 mb-4">
        <ModelSelect
          label="Primary Model (Research)"
          value={primaryModel}
          onChange={setPrimaryModel}
        />
        <ModelSelect
          label="Secondary Model (Processing)"
          value={secondaryModel}
          onChange={setSecondaryModel}
        />
      </div>

      <div className="flex-1 overflow-auto border rounded-md p-4 mb-4 relative">
        {messages.length > 0 && (
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={handleNewChat}
              className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
              title="New Chat"
              aria-label="Start a new chat"
            >
              <PlusIcon size={18} />
              <span className="sr-only">New Chat</span>
            </button>
          </div>
        )}
        {messages.map((message) => {
          const extendedMessage = message as ExtendedMessage;
          return (
            <div
              key={message.id}
              className={cn(
                'mb-4 last:mb-0',
                message.role === 'assistant' ? 'pl-4 border-l-2' : ''
              )}
            >
              <div className="font-medium mb-1">
                <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
              </div>
              <div className="whitespace-pre-wrap">
                {message.content}
                {extendedMessage.role === 'assistant' && extendedMessage.toolCalls?.map((tool, index) => (
                  <div key={index} className="bg-muted p-2 rounded my-2 text-sm font-mono">
                    <div className="font-medium">Tool Call: {tool.function.name}</div>
                    <pre className="mt-1">
                      {JSON.stringify(JSON.parse(tool.function.arguments), null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
              
              {/* Copy button for assistant messages - positioned at bottom left */}
              {message.role === 'assistant' && (
                <div className="mt-2">
                  <button
                    onClick={() => copyToClipboard(message)}
                    className="flex items-center gap-1 text-sm p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Copy to clipboard"
                    title="Copy to clipboard"
                  >
                    {copiedMessageId === message.id ? (
                      <>
                        <CheckIcon className="text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon />
                        <span>Copy to clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="flex-1 p-2 rounded-md border bg-background"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'px-4 py-2 rounded-md bg-primary text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Send
        </button>
      </form>
    </div>
  );
}
