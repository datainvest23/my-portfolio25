"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
  const { title, shortDescription, imageUrl, tags, slug, type } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/project/${slug}`} aria-label={`View details for ${title}`}>
      <motion.div
        className="group relative h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={`Project image for ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Type Badge */}
            {type && (
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg 
                  bg-black text-white shadow-md"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} // Inline fallback for tag background
                >
                  {type}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 flex flex-col justify-center items-center p-6 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85))',
                backdropFilter: 'blur(2px)',
              }}
            >
              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm rounded-full bg-white/15 text-white
                      backdrop-blur-sm border border-white/20 shadow-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Short Description */}
              <p className="text-sm text-white text-center font-light leading-relaxed max-w-prose">
                {shortDescription}
              </p>
            </motion.div>
          </div>

          {/* Content Below Image */}
          <div className="p-4">
            <h3
              className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 
              transition-colors duration-200"
            >
              {title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
