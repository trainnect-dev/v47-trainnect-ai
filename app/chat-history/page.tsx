"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { ChatType } from "@/lib/db";

interface Conversation {
  conversation_id: string;
  start_time: number;
  message_count: number;
  chat_type: ChatType;
  metadata?: string;
}

function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayOfMonth = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${hours}${minutes}-${month}${dayOfMonth}${year}`;
}

export default function ChatHistoryPage() {
  const [selectedType, setSelectedType] = useState<ChatType | 'all'>('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/chat/history?type=${selectedType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data.conversations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat history');
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [selectedType]);

  const renderMetadata = (conversation: Conversation) => {
    if (!conversation.metadata) return null;
    const metadata = JSON.parse(conversation.metadata);
    
    switch (conversation.chat_type) {
      case 'ai-search':
        return metadata.searchQuery ? (
          <p className="text-sm text-gray-500">
            Search: {metadata.searchQuery}
          </p>
        ) : null;
      case 'ai-agent':
        return metadata.primaryModel ? (
          <p className="text-sm text-gray-500">
            Models: {metadata.primaryModel.label} + {metadata.secondaryModel.label}
          </p>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Chat History</h1>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ChatType | 'all')}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Chats</option>
              <option value="chat">Regular Chat</option>
              <option value="ai-search">AI Search</option>
              <option value="ai-agent">AI Agent</option>
            </select>
          </div>
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const dateTime = formatDateTime(conversation.start_time);
              return (
                <div
                  key={conversation.conversation_id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <Link
                    href={`${conversation.chat_type === 'chat' 
                      ? '/' 
                      : conversation.chat_type === 'ai-search'
                      ? '/tavily-ai-search'
                      : '/ai-agents'}?conversation=${conversation.conversation_id}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h2 className="text-lg font-medium">{dateTime}</h2>
                      <div>
                        <p className="text-sm text-gray-500">
                          {conversation.message_count} messages
                        </p>
                        {renderMetadata(conversation)}
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
