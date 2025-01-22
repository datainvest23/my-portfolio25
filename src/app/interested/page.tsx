"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

type InterestedItem = {
  id: string;
  portfolio_item_id: string;
  project_name: string;
  created_at: string;
};

export default function InterestedPage() {
  const supabase = useSupabase();
  const [items, setItems] = useState<InterestedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interested items:', error);
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  const removeItem = async (itemId: string, projectName: string) => {
    try {
      const { error } = await supabase
        .from('user_interests')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
      toast.success(`Removed "${projectName}" from your interested list`);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [supabase]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Your Interested Projects</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No projects marked as interested yet.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group p-4 border rounded-lg shadow-sm hover:shadow-md transition-all bg-white relative"
            >
              <div className="flex justify-between items-center">
                <Link
                  href={`/project/${item.portfolio_item_id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex-grow"
                >
                  {item.project_name || 'Unknown Project'}
                </Link>
                
                <button
                  onClick={() => removeItem(item.id, item.project_name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 p-1 
                    text-gray-400 hover:text-red-500 rounded-full 
                    hover:bg-red-50 focus:outline-none focus:ring-2 
                    focus:ring-red-500 focus:ring-offset-2"
                  title="Remove from interested"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mt-1">
                Added on {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 