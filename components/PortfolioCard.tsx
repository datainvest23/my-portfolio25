// components/PortfolioCard.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IconExternalLink } from '@tabler/icons-react';
import { cn } from "@/lib/utils";
import { filterConfig } from '@/lib/config';

interface PortfolioCardProps {
    id: string;
    title: string;
  description: string;
    shortDescription: string;
    imageUrl: string;
  type: string;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  aiKeywords?: Array<string>;
    slug: string;
}

const filterConfig = {
  'ALL': {
    label: 'ALL',
    bgColor: 'bg-blue-50/90 hover:bg-blue-100/90',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200/50'
  },
  'PROJECT': {
    label: 'PROJECT',
    bgColor: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200/50'
  },
  'PROPOSAL': {
    label: 'PROPOSAL',
    bgColor: 'bg-amber-50/90 hover:bg-amber-100/90',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200/50'
  },
  'RESEARCH': {
    label: 'RESEARCH',
    bgColor: 'bg-purple-50/90 hover:bg-purple-100/90',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200/50'
  },
  'DASHBOARD': {
    label: 'DASHBOARD',
    bgColor: 'bg-rose-50/90 hover:bg-rose-100/90',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200/50'
  }
} as const;

export default function PortfolioCard({
  title,
  shortDescription,
  imageUrl,
  type,
  tags,
  aiKeywords = [],
  slug,
}: PortfolioCardProps) {
  const projectLink = `/project/${slug}`;

  const typeConfig = filterConfig[type.toUpperCase() as keyof typeof filterConfig];

  return (
    <Link href={projectLink}>
      <div className="card-container">
        <div className="card">
          <div className="card-front">
            <div className="card-image-container relative">
              {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
              <div className={cn(
                "absolute top-4 left-4 px-3 py-1.5 rounded-full",
                filterConfig[type as keyof typeof filterConfig]?.bgColor || 'bg-gray-50/90 hover:bg-gray-100/90',
                filterConfig[type as keyof typeof filterConfig]?.textColor || 'text-gray-700',
                filterConfig[type as keyof typeof filterConfig]?.borderColor || 'border-gray-200/50',
                "text-[0.65rem] font-medium tracking-wider uppercase border backdrop-blur-sm"
              )}>
                {type}
              </div>
            </div>
            <div className="card-content px-4 py-5">
              <h3>
                {title}
              </h3>
              {aiKeywords.length > 0 && (
                <div className="mt-auto pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {aiKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-100 rounded-md text-[0.65rem] text-neutral-600 font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card-back">
            <div className="link-icon">
              <IconExternalLink size={20} />
            </div>
            <div className="card-back-content">
              <div>
                <div className="tags-wrapper">
                  {tags.map((tag) => (
                    <span key={tag.id} className={`tag ${tag.color}`}>
                      {tag.name}
                    </span>
                  ))}
                </div>
                <p className="card-description">{shortDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}