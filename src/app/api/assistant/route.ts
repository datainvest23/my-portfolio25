import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Check if assistant already exists
    const assistants = await openai.beta.assistants.list();
    const existingAssistant = assistants.data.find(
      (assistant) => assistant.name === "Portfolio Assistant"
    );

    if (existingAssistant) {
      return NextResponse.json(existingAssistant);
    }

    // Create a new assistant if one doesn't exist
    const assistant = await openai.beta.assistants.create({
      name: "Portfolio Assistant",
      instructions: `You are a helpful assistant for a portfolio website. You help users understand projects and provide relevant information.
      You should be professional but friendly, and always try to provide specific, relevant information based on the user's interests.
      When users ask about projects, provide detailed insights and suggestions based on their interests.`,
      model: "gpt-4-turbo-preview",
      tools: [{ type: "code_interpreter" }], // Using supported tool type
    });

    return NextResponse.json(assistant);
  } catch (error) {
    console.error('Assistant creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize assistant' },
      { status: 500 }
    );
  }
} 