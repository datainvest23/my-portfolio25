import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use server-side environment variable
});

async function cancelActiveRuns(threadId: string) {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    const activeRuns = runs.data.filter(run => 
      ['queued', 'in_progress', 'requires_action'].includes(run.status)
    );

    for (const run of activeRuns) {
      await openai.beta.threads.runs.cancel(threadId, run.id);
    }
  } catch (error) {
    console.error('Error canceling active runs:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { threadId, message, isSystemMessage, requiresResponse } = await request.json();

    if (!threadId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the assistant
    const assistants = await openai.beta.assistants.list();
    const assistant = assistants.data.find(
      (ast) => ast.name === "Portfolio Assistant"
    );

    if (!assistant) {
      throw new Error('Assistant not found');
    }

    // Cancel any active runs before proceeding
    await cancelActiveRuns(threadId);

    // Send the message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user", // OpenAI doesn't support system messages in threads
      content: message,
    });

    // Create a run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    if (!requiresResponse && isSystemMessage) {
      return NextResponse.json({ 
        success: true,
        message: 'Context message sent successfully'
      });
    }

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 30; // Maximum 30 seconds wait

    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
      
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ${runStatus.status}`);
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Request timed out waiting for assistant response');
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    // Safely extract text content
    const textContent = lastMessage.content.find(
      content => content.type === 'text'
    );

    if (!textContent || textContent.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    return NextResponse.json({
      id: lastMessage.id,
      response: textContent.text.value,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process message',
        details: error
      },
      { status: 500 }
    );
  }
} 