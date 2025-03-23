"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Messages } from "./messages";
import { models } from "@/lib/models";
import { Footnote } from "./footnote";
import { ArrowUpIcon, CheckedSquare, StopIcon, UncheckedSquare, PaperClipIcon, XIcon } from "./icons";
import { ModelSelector } from "./model-selector";
import { Input } from "./input";
import Image from "next/image";

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("claude-3.7-sonnet");
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default values for the following features 
  const reasoningModeEnabled = true;
  const multimodalEnabled = true;

  const selectedModel = models.find((model) => model.id === selectedModelId);

  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversation') || undefined;

  const { messages, append, status, stop, setMessages } = useChat({
    id: conversationId || "primary",
    body: {
      selectedModelId,
      isReasoningEnabled: reasoningModeEnabled ? isReasoningEnabled : false,
      conversationId,
    },
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
  });

  // Load conversation history without triggering LLM responses
  useEffect(() => {
    async function loadHistory() {
      if (conversationId && messages.length === 0 && !isLoadingHistory) {
        setIsLoadingHistory(true);
        try {
          const response = await fetch(`/api/chat/history/${conversationId}`);
          const data = await response.json();
          
          if (data.messages) {
            // Transform messages to match expected format with parts array
            const formattedMessages = data.messages.map((msg: any) => {
              const messageParts = [];
              
              // Add reasoning block if it exists in metadata
              if (msg.metadata) {
                try {
                  const metadata = JSON.parse(msg.metadata);
                  if (metadata.reasoning) {
                    messageParts.push({
                      type: "reasoning",
                      reasoning: metadata.reasoning,
                      details: [{ type: "text", text: metadata.reasoning }]
                    });
                  }
                } catch (e) {
                  console.error('Error parsing message metadata:', e);
                }
              }
              
              // Try to parse and format JSON content if present
              const content = msg.content;
              const isJson = content.trim().startsWith('{') || content.trim().startsWith('[');
              
              if (isJson) {
                try {
                  const formattedJson = JSON.stringify(JSON.parse(content), null, 2);
                  messageParts.push({
                    type: "text",
                    text: "```json\n" + formattedJson + "\n```"
                  });
                } catch (e) {
                  messageParts.push({
                    type: "text",
                    text: content
                  });
                }
              } else {
                messageParts.push({
                  type: "text",
                  text: content
                });
              }

              return {
                id: msg.id,
                role: msg.role,
                content: msg.content,
                parts: messageParts,
                ...(msg.metadata && {
                  experimental_attachments: (() => {
                    try {
                      const metadata = JSON.parse(msg.metadata);
                      return metadata.attachments || [];
                    } catch (e) {
                      return [];
                    }
                  })()
                })
              };
            });
            
            setMessages(formattedMessages);
          }
        } catch (err) {
          console.error('Failed to load chat history:', err);
          toast.error("Failed to load chat history");
        } finally {
          setIsLoadingHistory(false);
        }
      }
    }
    
    loadHistory();
  }, [conversationId, messages.length, setMessages, isLoadingHistory]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = () => {
    if (input === "" && (!files || files.length === 0)) {
      return;
    }

    if (isGeneratingResponse) {
      stop();
    } else {
      append({
        role: "user",
        content: input,
      }, {
        experimental_attachments: files || undefined,
      });
    }

    setInput("");
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Create file preview URL
  const filePreviewUrl = files && files.length > 0 && files[0].type.startsWith('image/') 
    ? URL.createObjectURL(files[0]) 
    : null;

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        },
      )}
    >
      {isLoadingHistory ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : messages.length > 0 ? (
        <Messages messages={messages} status={status} />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl md:w-1/2 w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>Trainnect AI.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            Search Less, Learn More
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:w-1/2 w-full">
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
          {multimodalEnabled && files && files.length > 0 && (
            <div className="mb-2 flex items-center" data-testid="file-preview">
              {filePreviewUrl ? (
                <div className="relative w-16 h-16 mr-2">
                  <Image 
                    src={filePreviewUrl} 
                    alt={files[0].name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-md mr-2">
                  <span className="text-xs">{files[0].name.split('.').pop()?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm truncate">{files[0].name}</div>
                <div className="text-xs text-zinc-500">{(files[0].size / 1024).toFixed(1)} KB</div>
              </div>
              <button 
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <Input
            input={input}
            setInput={setInput}
            selectedModelId={selectedModelId}
            isGeneratingResponse={isGeneratingResponse}
            isReasoningEnabled={reasoningModeEnabled ? isReasoningEnabled : false}
            append={append}
          />

          {reasoningModeEnabled && (
            <div className="absolute bottom-2.5 left-2.5">
              <div
                className={cn(
                  "relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-2 dark:hover:bg-zinc-600 hover:bg-zinc-200 cursor-pointer",
                  {
                    "dark:bg-zinc-600 bg-zinc-200": isReasoningEnabled,
                  },
                )}
                onClick={() => {
                  setIsReasoningEnabled(!isReasoningEnabled);
                }}
              >
                {isReasoningEnabled ? <CheckedSquare /> : <UncheckedSquare />}
                <div>Reasoning</div>
              </div>
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            {multimodalEnabled && (
              <button
                className="size-8 flex flex-row justify-center items-center dark:bg-zinc-700 bg-zinc-300 dark:text-zinc-300 text-zinc-700 p-1.5 rounded-full hover:bg-zinc-400 dark:hover:bg-zinc-600 hover:scale-105 active:scale-95 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperClipIcon />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFiles(e.target.files)}
                  ref={fileInputRef}
                  accept="image/*, application/pdf"
                  data-testid="file-upload"
                />
              </button>
            )}
            
            <ModelSelector 
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
            />

            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
                {
                  "dark:bg-zinc-200 dark:text-zinc-500":
                    isGeneratingResponse || (input === "" && (!files || files.length === 0)),
                },
              )}
              onClick={handleSendMessage}
              aria-label="send"
            >
              {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}
