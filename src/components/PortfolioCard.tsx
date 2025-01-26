"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PortfolioCardProps {
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

export default function PortfolioCard(props: PortfolioCardProps) {
  const { id, title, shortDescription, imageUrl, tags, status, slug } = props;
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <Link href={`/project/${slug}`}>
      <motion.div 
        className="portfolio-card group perspective"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsFlipped(true)}
        onHoverEnd={() => setIsFlipped(false)}
      >
        <motion.div
          className={cn(
            "relative w-full h-full preserve-3d duration-500 transition-all",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4 bg-white rounded-b-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm mb-4">{shortDescription}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span 
                    key={tag.id}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color 
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl p-6">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600">{props.description}</p>
              </div>
              <div className="mt-4">
                <span 
                  className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    status === 'completed' ? "bg-green-100 text-green-800" :
                    status === 'in-progress' ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  )}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
} 