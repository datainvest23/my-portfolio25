"use client";

import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/Spinner";

interface ProjectDetails {
  id: string;
  name: string;
  imageUrl: string | null;
  shortDescription?: string;
  type?: string;
  tags?: Array<{ id: string; name: string; color: string }>;
  slug: string;
}

export function InterestButton({ project }: { project: ProjectDetails }) {
  const supabase = useSupabase();
  const [isInterested, setIsInterested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInterested = async () => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        toast.error("Please log in to mark projects as interesting");
        return;
      }

      const { error } = await supabase
        .from("user_interests")
        .insert({
          user_id: session.user.id,
          portfolio_item_id: project.id,
          project_name: project.name,
          image_url: project.imageUrl,
          project_details: {
            shortDescription: project.shortDescription,
            type: project.type,
            tags: project.tags,
            slug: project.slug,
          },
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("You have already marked this project as interesting");
        } else {
          throw error;
        }
      } else {
        setIsInterested(true);
        toast.success("Project marked as interesting!");
      }
    } catch (error) {
      console.error("Error marking as interested:", error);
      toast.error("Failed to mark project as interesting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleInterested}
      disabled={loading || isInterested}
      aria-busy={loading}
      aria-disabled={loading || isInterested}
      className={cn(
        "w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
        "font-medium transition-all duration-200",
        "shadow-sm hover:shadow-md",
        isInterested
          ? "bg-emerald-500 text-white cursor-not-allowed opacity-75"
          : loading
          ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
          : "bg-blue-600 hover:bg-blue-700 text-white hover:transform hover:-translate-y-0.5"
      )}
    >
      {loading ? (
        <Spinner className="h-5 w-5" />
      ) : (
        <BookmarkIcon className="h-5 w-5" />
      )}
      <span>
        {isInterested
          ? "Marked as Interesting!"
          : loading
          ? "Processing..."
          : "Mark as Interesting"}
      </span>
    </button>
  );
}
