import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

async function waitForRun(threadId: string, runId: string) {
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout
  
  while (attempts < maxAttempts) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    
    if (run.status === 'completed') {
      return run;
    }
    
    if (run.status === 'failed' || run.status === 'cancelled') {
      throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Run timed out');
}

async function cancelActiveRuns(threadId: string) {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    const activeRuns = runs.data.filter(run => 
      ['queued', 'in_progress', 'requires_action'].includes(run.status)
    );

    for (const run of activeRuns) {
      try {
        await openai.beta.threads.runs.cancel(threadId, run.id);
        // Wait for the run to be fully cancelled
        let attempts = 0;
        while (attempts < 10) {
          const run_status = await openai.beta.threads.runs.retrieve(threadId, run.id);
          if (run_status.status === 'cancelled') break;
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
      } catch (error) {
        console.error(`Failed to cancel run ${run.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error canceling runs:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { threadId, projectNames, projects } = await request.json();

    // First, ensure no active runs and wait for confirmation
    await cancelActiveRuns(threadId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Format project information
    const projectInfo = projects.map(project => ({
      name: project.project_name,
      description: project.project_details?.shortDescription || '',
      type: project.project_details?.type || '',
    }));

    // Create context message
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `Context: I'm interested in these projects: ${projectNames}. 
        
        Project Details:
        ${projectInfo.map(p => `
          Project: ${p.name}
          ${p.description ? `Description: ${p.description}` : ''}
          ${p.type ? `Type: ${p.type}` : ''}
        `).join('\n')}
        
        Instructions: 
        1. Use this context to provide personalized responses
        2. Reference specific project details in your answers
        3. Suggest related features or aspects I might be interested in
        4. Make connections between different projects when relevant`
    });

    // Create and wait for run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    // Wait for run to complete
    await waitForRun(threadId, run.id);

    // Get the latest message
    const messages = await openai.beta.threads.messages.list(threadId);
    const latestMessage = messages.data[0];

    // Return the message
    return NextResponse.json({ 
      success: true,
      message: latestMessage.content[0].text.value 
    });

  } catch (error) {
    console.error('Error initializing context:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize context',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 