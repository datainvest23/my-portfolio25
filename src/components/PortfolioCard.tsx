// components/PortfolioCard.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { NotionPage } from '@/types/notion';

interface PortfolioCardProps {
  project: NotionPage;
  className?: string;
}

export default function PortfolioCard({ project, className = '' }: PortfolioCardProps) {
  // Add null check for project
  if (!project) {
    return null;
  }

  const title = project.properties?.Name?.title[0]?.plain_text || 'Untitled';
  const description = project.properties?.['Short Description']?.rich_text[0]?.plain_text || '';
  const technologies = project.properties?.Technologies?.multi_select || [];
  const coverUrl = project.cover?.external?.url || project.cover?.file?.url;
  const slug = project.properties?.Slug?.rich_text[0]?.plain_text || project.id;

  return (
    <Link href={`/project/${slug}`}>
      <div className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg ${className}`}>
        {/* Cover Image */}
        <div className="aspect-[16/9] relative">
          {coverUrl ? (
            <>
              <Image 
                src={coverUrl} 
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-200 line-clamp-2">{description}</p>
          )}
          
          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="px-2 py-1 text-xs rounded-full bg-white/20 text-white"
                >
                  {tech.name}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/20 text-white">
                  +{technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}