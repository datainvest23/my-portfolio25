// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import PortfolioCard from '../../components/PortfolioCard';
import { Button } from '@/components/ui/3d-button';
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { filterConfig, type FilterType } from '@/lib/config';

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
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects?type=${activeFilter}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
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
              "font-medium transition-colors",
              activeFilter === key 
                ? config.bgColor
                : "hover:bg-neutral-100/80",
              config.textColor,
              "border",
              config.borderColor
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