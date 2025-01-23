"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { ChatWindow } from '@/components/ChatWindow';
import { createThread } from '@/lib/openai';
import { PostgrestError } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

type InterestedItem = {
  id: string;
  portfolio_item_id: string;
  project_name: string;
  created_at: string;
  image_url?: string;
  project_details?: {
    description?: string;
    shortDescription?: string;
    type?: string;
    tags?: any[];
    slug?: string;
  };
};

export default function ConversationPage() {
  const supabase = useSupabase();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [interestedProjects, setInterestedProjects] = useState<InterestedItem[]>([]);

  useEffect(() => {
    async function fetchInterestedProjects() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: userInterests, error: interestsError } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!interestsError && userInterests) {
        setInterestedProjects(userInterests);
      }
    }

    fetchInterestedProjects();
  }, [supabase]);

  useEffect(() => {
    async function initializeChat() {
      try {
        const thread = await createThread();
        setThreadId(thread.id);
        setInitialMessage(
          "Welcome! I'm here to help you explore the projects. Feel free to ask questions about any project that interests you."
        );
      } catch (error) {
        console.error('Error creating thread:', error);
        setError('Failed to initialize chat');
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Interested Projects Cards */}
      {interestedProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Interested Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                  duration-200 overflow-hidden border border-gray-100"
              >
                <div className="aspect-video relative">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.project_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link 
                    href={`/project/${project.project_details?.slug || project.portfolio_item_id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 
                      transition-colors duration-200"
                  >
                    {project.project_name}
                  </Link>
                  {project.project_details?.shortDescription && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {project.project_details.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Window */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing chat...</p>
          </div>
        ) : threadId ? (
          <ChatWindow threadId={threadId} initialMessage={initialMessage} />
        ) : (
          <div className="p-8 text-center text-gray-600">
            Unable to initialize chat. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
}