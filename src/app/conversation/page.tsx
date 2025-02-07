"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { ChatWindow } from "@/components/ChatWindow";
import { createThread } from "@/lib/openai";
import { PostgrestError } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, DocumentIcon } from "@heroicons/react/24/outline";

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
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function initializeChat() {
      try {
        // Get user session and profile
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("No authenticated user");
        }

        // Get user name from metadata
        const userName = session.user.user_metadata?.name || "there";
        setUserName(userName);

        // Get interested projects
        const { data: userInterests, error: interestsError } = await supabase
          .from("user_interests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (interestsError) throw interestsError;
        setInterestedProjects(userInterests || []);

        // Create personalized greeting
        let greeting = `Hi ${userName}! `;
        if (userInterests && userInterests.length > 0) {
          greeting += `I see you're interested in ${userInterests.length} project${userInterests.length > 1 ? 's' : ''}: `;
          greeting += userInterests.map(p => p.project_name).join(", ") + ". ";
          greeting += "Feel free to ask me anything about these projects or explore other projects in the portfolio!";
        } else {
          greeting += "I'm here to help you explore the portfolio projects. What would you like to know about?";
        }

        // Create thread with context
        const thread = await createThread();
        setThreadId(thread.id);
        setInitialMessage(greeting);

      } catch (error) {
        console.error("Error initializing chat:", error);
        setError("Failed to initialize chat");
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, [supabase]);

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Interested Projects Section */}
      <div className="flex-grow overflow-y-auto">
        {interestedProjects.length > 0 && (
          <div className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h2 className="text-xl font-semibold">Your Interested Projects</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {interestedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative bg-white rounded-lg shadow-sm hover:shadow-md 
                      transition-all duration-200 overflow-hidden border border-gray-100"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveProject(project.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 
                        backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity
                        hover:bg-red-50 border border-red-100"
                      aria-label="Remove project"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                    </button>

                    {/* Project Link */}
                    <Link 
                      href={`/project/${project.project_details?.slug || project.portfolio_item_id}`}
                      className="block"
                    >
                      {/* Image Container */}
                      <div className="aspect-[4/3] relative">
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={project.project_name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <DocumentIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 
                          group-hover:text-blue-600 transition-colors">
                          {project.project_name}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto h-[calc(100vh-300px)] md:h-[500px]">
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
    </div>
  );
}
