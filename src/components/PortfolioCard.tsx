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
        className="group relative h-full transition-transform transform hover:scale-[1.02] bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300">
          {/* Image Section */}
          <div className="relative w-full h-56 bg-gray-100">
            <Image
              src={imageUrl || "/placeholder-image.jpg"}
              alt={`Project image for ${title}`}
              width={500}
              height={300}
              className="object-cover w-full h-full"
              priority
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
            {/* Overlay: hidden by default, appears on hover */}
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            {/* Type Badge */}
            {type && (
              <div className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
                {type}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <h3 className="font-bold text-xl mb-2 text-gray-900">{title}</h3>
          </div>

          {/* Tags */}
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
