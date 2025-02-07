import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { StreamingTextResponse, OpenAIStream } from 'ai';

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const { threadId, message } = await request.json();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });

    // Create a run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    // Create a stream
    const stream = OpenAIStream(await openai.beta.threads.runs.streamResponse(threadId, run.id));

    // Return streaming response
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
} 