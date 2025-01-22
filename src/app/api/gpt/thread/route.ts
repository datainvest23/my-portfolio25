import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log("Starting GPT thread creation...");
    console.log("Using API key:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");

    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to create GPT thread' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Successfully created GPT thread:", data);
    
    return NextResponse.json({ threadId: data.id });
  } catch (error: any) {
    console.error("Error in thread creation:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Internal server error while creating GPT thread' },
      { status: 500 }
    );
  }
} 