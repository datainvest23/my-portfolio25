"use client";

import { useState, useEffect } from 'react';
import PortfolioCard from '@/components/PortfolioCard';
import { Button } from '@/components/ui/3d-button';
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { filterConfig, type FilterType } from '@/lib/config';
import type { Project } from '@/lib/types';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects?type=${activeFilter}`);
        
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/login';
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch projects');
        }
        
        const data = await response.json();
        console.log('Fetched projects:', data);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [activeFilter]);

  return (
    <div className="container relative">
      <div className="relative overflow-hidden rounded-lg">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-100%] h-[300%]",
          )}
        />
        <h1 className="page-title text-4xl font-normal text-neutral-600 relative z-10">
          Build solutions that{" "}
          <FlipWords 
            words={["Engage", "Inspire", "Perform", "Scale"]} 
            className="text-blue-600 font-semibold"
          />.
        </h1>
      </div>
      
      <div className="filter-buttons">
        {Object.entries(filterConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            onClick={() => setActiveFilter(key as FilterType)}
            className={cn(
              "font-medium transition-colors border rounded-lg px-4 py-2",
              "border-[1px]",
              activeFilter === key 
                ? [
                    config.bgColor,
              config.textColor,
                    config.borderColor,
                    "shadow-sm"
                  ]
                : [
                    "bg-white",
                    "text-gray-700",
                    "border-gray-900",
                    config.hoverBg
                  ]
            )}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="portfolio-grid">
          {projects.map((project) => (
            <PortfolioCard
              key={project.id}
              {...project}
            />
          ))}
        </div>
      )}
    </div>
  );
}