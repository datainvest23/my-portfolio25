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
        setIsLoading(true);

        // Get user session and profile
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("No authenticated user");
        }

        // Get user name from metadata and extract first name
        const fullName = session.user.user_metadata?.name || "there";
        const firstName = fullName.split(' ')[0]; // Get only the first name
        setUserName(firstName);

        // Get interested projects
        const { data: userInterests, error: interestsError } = await supabase
          .from("user_interests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (interestsError) throw interestsError;
        setInterestedProjects(userInterests || []);

        // Get existing or create new thread ID
        let threadIdFromProfile: string | null = null;
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("gpt_thread_id")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile", profileError);
        } else {
          threadIdFromProfile = userProfile?.gpt_thread_id;
        }

        let threadIdToUse = threadIdFromProfile;
        if (!threadIdToUse) {
          const thread = await createThread();
          threadIdToUse = thread.id;

          // update the public.profiles table
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ gpt_thread_id: threadIdToUse })
            .eq("id", session.user.id);
          if (updateError) {
            console.error("Error updating profile", updateError);
          }
        }

        // Create initial greeting
        let greeting = `Hi ${firstName}! I appreciate your interest. Allow me a moment to load the information...`;
        setInitialMessage(greeting);

        setThreadId(threadIdToUse);

      } catch (error) {
        console.error("Error initializing chat:", error);
        setError("Failed to initialize chat");
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, [supabase]);


  const handleRemoveProject = async (itemId: string) => {
    //Add the action you want when removing items.
    //this function is not defined, leaving it as an stub.
  }

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
      {interestedProjects.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Interested Projects</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {interestedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 
                    transition-all duration-200 overflow-hidden hover:shadow-md"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 
                      opacity-0 group-hover:opacity-100 transition-opacity
                      hover:bg-red-50 border border-red-200 shadow-sm"
                    aria-label="Remove project"
                  >
                    <XMarkIcon className="h-3.5 w-3.5 text-red-500" />
                  </button>

                  <Link 
                    href={`/project/${project.project_details?.slug || project.portfolio_item_id}`}
                    className="flex items-start space-x-3 p-3"
                  >
                    {/* Smaller Image Container */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.project_name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <DocumentIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {project.project_name}
                      </h3>
                      {project.project_details?.type && (
                        <p className="mt-1 text-xs text-gray-500">
                          {project.project_details.type}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto h-[calc(100vh-300px)] md:h-[600px] bg-white rounded-lg shadow-sm border my-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Initializing chat...</p>
              </div>
            </div>
          ) : threadId ? (
            <ChatWindow 
              threadId={threadId} 
              initialMessage={initialMessage}
              interestedProjects={interestedProjects}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600">
              Unable to initialize chat. Please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}