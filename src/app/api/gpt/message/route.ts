import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { threadId, message } = await request.json();

    // Create a message in the thread
    const messageResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      }
    );

    if (!messageResponse.ok) {
      throw new Error('Failed to create message');
    }

    // Run the assistant
    const runResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: process.env.OPENAI_ASSISTANT_ID
        })
      }
    );

    if (!runResponse.ok) {
      throw new Error('Failed to run assistant');
    }

    const runData = await runResponse.json();

    // Poll for completion
    let runStatus = await pollRunStatus(threadId, runData.id);

    // Get messages after completion
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );

    if (!messagesResponse.ok) {
      throw new Error('Failed to get messages');
    }

    const messagesData = await messagesResponse.json();
    const lastMessage = messagesData.data[0]; // Get the most recent message

    return NextResponse.json({ response: lastMessage.content[0].text.value });
  } catch (error: any) {
    console.error('Error in message processing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function pollRunStatus(threadId: string, runId: string) {
  let status = 'queued';
  
  while (status === 'queued' || status === 'in_progress') {
    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );

    const data = await response.json();
    status = data.status;

    if (status === 'completed') {
      return data;
    } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
      throw new Error(`Run ended with status: ${status}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
} 