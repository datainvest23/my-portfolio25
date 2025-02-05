"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface PortfolioCardProps {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string | null;
  status: string;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  slug: string;
  type: string;
}

export default function PortfolioCard({
  title,
  imageUrl,
  tags,
  slug,
  type,
}: PortfolioCardProps) {
  return (
    <Link href={`/project/${slug}`} aria-label={`View details for ${title}`}>
      <motion.div
        className="group relative h-full transition-transform transform hover:scale-[1.02]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full rounded-xl overflow-hidden shadow-card hover:shadow-card-hover border border-gray-200 bg-white transition-all duration-300 card-hover-effects">
          {/* Image Container with Hover Overlay */}
          <div className="relative overflow-hidden">
            <Image
              src={imageUrl || "/placeholder-image.jpg"}
              alt={title}
              width={400}
              height={225}
              className="w-full h-[225px] object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
            {/* Hover Overlay with Read Insights Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-start justify-center">
              <button className="mt-8 bg-gray-800/90 text-white px-6 py-2.5 rounded-lg font-medium transform transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-lg backdrop-blur-sm flex items-center group/btn">
                Read Insights
                <svg 
                  className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-semibold text-xl text-gray-900 line-clamp-2 min-h-[3.5rem]">
              {title}
            </h3>
            
            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    backgroundColor: `${tag.color}45`,
                    color: '#000000',
                    borderColor: tag.color
                  }}
                  className="inline-block rounded-full px-4 py-1.5 text-sm font-medium border"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
