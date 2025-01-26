"use client";

import { useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { toast } from 'react-hot-toast';

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
      if (!session) {
        toast.error('Please log in to mark projects as interesting');
        return;
      }

      const { error } = await supabase
        .from('user_interests')
        .insert({
          user_id: session.user.id,
          portfolio_item_id: project.id,
          project_name: project.name,
          image_url: project.imageUrl,
          project_details: {
            shortDescription: project.shortDescription,
            type: project.type,
            tags: project.tags,
            slug: project.slug
          }
        });

      if (error) {
        if (error.code === '23505') { // Unique violation - user already interested
          toast.error('You have already marked this project as interesting');
        } else {
          throw error;
        }
      } else {
        setIsInterested(true);
        toast.success('Project marked as interesting!');
      }
    } catch (error) {
      console.error('Error marking as interested:', error);
      toast.error('Failed to mark project as interesting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleInterested}
      disabled={loading || isInterested}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isInterested
          ? 'bg-green-500 text-white cursor-not-allowed'
          : loading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {isInterested ? 'Interested!' : loading ? 'Adding...' : 'Mark as Interested'}
    </button>
  );
} 