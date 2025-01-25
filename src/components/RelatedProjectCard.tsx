"use client";

import Image from 'next/image';
import Link from 'next/link';
import { NotionPage, NotionProperty } from '@/types/notion';

interface RelatedProjectCardProps {
  project: NotionPage;
}

export function RelatedProjectCard({ project }: RelatedProjectCardProps) {
  const title = project.properties.Name?.title[0]?.plain_text || 'Untitled';
  const description = project.properties['Short Description']?.rich_text[0]?.plain_text || '';
  const technologies = project.properties.Technologies?.multi_select || [];
  const coverUrl = project.cover?.external?.url || project.cover?.file?.url;
  const slug = project.properties.Slug?.rich_text[0]?.plain_text || project.id;

  return (
    <Link href={`/project/${slug}`} className="block">
      <div className="relative group rounded-lg overflow-hidden">
        {coverUrl && (
          <div className="relative aspect-video">
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        
        <div className="p-4">
          <h3 className="font-medium mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
          
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100"
                >
                  {tech.name}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                  +{technologies.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 