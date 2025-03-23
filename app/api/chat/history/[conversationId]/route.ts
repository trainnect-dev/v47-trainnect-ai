import { stmts } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    conversationId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const messages = stmts.getMessagesByConversation.all(params.conversationId);
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
