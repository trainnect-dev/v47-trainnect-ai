import type { ChatType } from '@/lib/db';
import { db, stmts } from '@/lib/db/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ChatType | 'all';

    const conversations = type === 'all' 
      ? stmts.getAllConversations.all()
      : stmts.getConversationsByType.all(type);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
