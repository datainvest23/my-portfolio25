"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

type InterestedItem = {
  id: string;
  portfolio_item_id: string;
  project_name: string;
  created_at: string;
  cover_image?: string;
  image_url?: string;
  project_details?: {
    description?: string;
    shortDescription?: string;
    type?: string;
    tags?: any[];
    slug?: string;
  };
};

export default function InterestedPage() {
  const [items, setItems] = useState<InterestedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/interested');

      if (!response.ok) {
        console.error('Error fetching user interests:', response.statusText);
          toast.error('Failed to load interested items');
        setLoading(false);
        return;
      }

      const { interests } = await response.json();
      setItems(interests);
        
    } catch (error) {
        console.error('Error fetching data from /api/interested:', error);
        toast.error('Something went wrong while loading your interested items');
    } finally {
        setLoading(false);
    }
  };

  const removeItem = async (itemId: string, projectName: string) => {
    try {
      const response = await fetch(`/api/interested?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to remove item. Please try again.');
        return;
      }

      setItems(items.filter(item => item.id !== itemId));
      toast.success(`Removed "${projectName}" from your interested list`);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Interested Projects</h1>
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>No interested items yet.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group hover:shadow-lg rounded-lg p-6 
                  transition-all duration-200 bg-white relative"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-48 h-32 relative rounded-lg overflow-hidden bg-gray-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.project_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <Link 
                      href={`/project/${item.project_details?.slug || item.portfolio_item_id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium 
                        text-lg hover:underline"
                    >
                      {item.project_name}
                    </Link>
                    
                    <div className="text-sm text-gray-500 mt-2">
                      Added on {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.project_name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity 
                      p-2 text-gray-400 hover:text-red-500 rounded-full 
                      hover:bg-red-50 focus:outline-none focus:ring-2 
                      focus:ring-red-500 focus:ring-offset-2"
                    title="Remove from interested"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}