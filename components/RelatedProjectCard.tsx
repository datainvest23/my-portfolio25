"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface RelatedProjectCardProps {
  title: string;
  shortDescription: string;
  imageUrl: string;
  slug: string;
}

export default function RelatedProjectCard({
  title,
  shortDescription,
  imageUrl,
  slug,
}: RelatedProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const passkey = searchParams.get('passkey');
  const projectLink = passkey ? `/project/${slug}?passkey=${passkey}` : `/project/${slug}`;

  return (
    <div 
      className={`related-project-card ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link href={projectLink}>
        <div className="related-card-content">
          <div className="related-card-image">
            {imageUrl && <img src={imageUrl} alt={title} />}
          </div>
          <div className="related-card-info">
            <h3 className="related-card-title">{title}</h3>
            <p className="related-card-description">{shortDescription}</p>
          </div>
        </div>
      </Link>
    </div>
  );
} 