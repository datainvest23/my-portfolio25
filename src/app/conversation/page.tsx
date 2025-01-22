"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { ChatWindow } from '@/components/ChatWindow';
import { createThread } from '@/lib/openai';
import { PostgrestError } from '@supabase/supabase-js';

export default function ConversationPage() {
  const supabase = useSupabase();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initializeChat() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(`Session error: ${sessionError.message}`);
        }
        if (!session?.user) {
          throw new Error('No user session found');
        }

        // Get user's interested projects
        const { data: interests, error: interestsError } = await supabase
          .from('user_interests')
          .select('project_name')
          .eq('user_id', session.user.id);
        
        if (interestsError) {
          console.error('Interests error:', interestsError);
          throw new Error(`Failed to fetch interests: ${interestsError.message}`);
        }

        // Initialize or get assistant
        const assistantResponse = await fetch('/api/assistant');
        if (!assistantResponse.ok) {
          const errorData = await assistantResponse.json().catch(() => ({}));
          console.error('Assistant error:', errorData);
          throw new Error(errorData.error || `Failed to initialize assistant: ${assistantResponse.status}`);
        }
        const assistant = await assistantResponse.json();
        
        // First, check if user profile exists
        const { data: profileExists, error: checkError } = await supabase
          .from('user_profiles')
          .select('thread_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Profile check error:', checkError);
          throw new Error(`Failed to check user profile: ${checkError.message}`);
        }

        let currentThreadId = profileExists?.thread_id;
        let isNewThread = false;

        // If no profile or thread exists, create them
        if (!currentThreadId) {
          try {
            // Create new thread
            const threadResponse = await createThread();
            if (!threadResponse?.id) {
              throw new Error('Thread creation failed: No thread ID returned');
            }
            currentThreadId = threadResponse.id;
            isNewThread = true;
            
            // Create or update user profile
            const { error: upsertError } = await supabase
              .from('user_profiles')
              .upsert({
                user_id: session.user.id,
                thread_id: currentThreadId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error('Profile upsert error:', upsertError);
              throw new Error(`Failed to update user profile: ${upsertError.message}`);
            }
          } catch (threadError) {
            console.error('Thread creation/initialization error:', threadError);
            throw threadError;
          }
        }

        // Send context and get initial response
        if (isNewThread) {  // Only send context for new threads
          const userName = session.user.user_metadata.name?.split(' ')[0] || 'there';
          const projectsList = interests?.map(i => i.project_name).join(', ') || 'no specific projects yet';

          const contextResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              threadId: currentThreadId,
              message: `System Context Update:
                User's first name: ${userName}
                Interested Projects: ${projectsList}
                
                Instructions: Use this information to personalize responses. Address the user by their first name.
                If they ask about projects, reference their interests. Keep responses friendly and engaging.
                This is a new conversation - send a warm welcome message.`,
              isSystemMessage: true,
              requiresResponse: true,
            }),
          });

          const contextData = await contextResponse.json();

          if (!contextResponse.ok) {
            console.error('Context response error:', contextData);
            throw new Error(contextData.error || `Failed to send context message: ${contextResponse.status}`);
          }

          if (contextData.response) {
            setInitialMessage(contextData.response);
          }
        }

        setThreadId(currentThreadId);

      } catch (error) {
        console.error('Error initializing chat:', error);
        const errorMessage = error instanceof Error ? error.message : 
          (error as PostgrestError)?.message || 'An unexpected error occurred while initializing the chat';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse text-gray-600">
          Initializing chat...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!threadId) {
    return (
      <div className="p-8">
        <div className="text-amber-600 bg-amber-50 p-4 rounded-lg">
          Unable to initialize chat. Please try again later.
        </div>
      </div>
    );
  }

  return <ChatWindow threadId={threadId} initialMessage={initialMessage} />;
} 