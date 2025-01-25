// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import PortfolioCard from '@/components/PortfolioCard';
import { Button } from '@/components/ui/button';
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { filterConfig, type FilterType } from '@/lib/config';
import { toast } from 'react-hot-toast';

// Define types for the project data
interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  status: string;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  slug: string;
  type: string;
}

export default function Page() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects?type=${activeFilter}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to fetch projects');
        }

        setProjects(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch projects';
        console.error('Error fetching projects:', error);
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProjects();
  }, [activeFilter]);

  return (
    <div className="min-h-screen p-4">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-lg mb-8">
        <AnimatedGridPattern />
        <div className="relative z-10 px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Build solutions that <span className="text-blue-600">Perform</span>
          </h1>
          <FlipWords 
            words={["Efficiently", "Reliably", "Securely"]}
            className="text-xl text-gray-600"
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(filterConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            onClick={() => setActiveFilter(key as FilterType)}
            className={cn(
              "font-medium transition-colors",
              activeFilter === key && [
                config.bgColor,
                config.textColor,
                "border",
                config.borderColor
              ]
            )}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => void fetchProjects()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Projects grid */}
      {!error && (
        isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="loading">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}