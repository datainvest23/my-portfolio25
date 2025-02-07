"use client";

import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/Spinner";
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';

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
        "w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl",
        "font-semibold transition-all duration-200",
        "border-2",
        isInterested
          ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed"
          : loading
          ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
          : [
              "bg-white text-blue-600 border-blue-200",
              "hover:bg-blue-50 hover:border-blue-300",
              "hover:transform hover:-translate-y-0.5",
              "shadow-sm hover:shadow-md",
              "active:bg-blue-100"
            ]
      )}
    >
      {loading ? (
        <Spinner className="h-5 w-5" />
      ) : (
        <HandThumbUpIcon 
          className={cn(
            "h-5 w-5",
            isInterested ? "text-emerald-500" : "text-blue-500"
          )}
        />
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
