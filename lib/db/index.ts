// Type definitions for chat database
interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: number;
  conversation_id: string;
  chat_type: 'chat' | 'ai-search' | 'ai-agent';
  metadata?: string;
}

type ChatType = Message['chat_type'];

interface Conversation {
  conversation_id: string;
  start_time: number;
  message_count: number;
  chat_type: ChatType;
  metadata?: string;
}

export type { Message, ChatType, Conversation };
