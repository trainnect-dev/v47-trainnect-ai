import { promptManager } from '@/lib/services/prompt-manager';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ prompts: promptManager.getAllPrompts() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, config } = await req.json();
    
    if (!id || !config) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    promptManager.setPrompt(id, config);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 400 });
  }
}
