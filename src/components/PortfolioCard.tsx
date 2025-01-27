"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
    
    return (
        <Link href={`/project/${slug}`}>
            <motion.div
                className="group relative h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
            >
                <div className="relative w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Image and Content Container */}
                    <div className="relative aspect-video">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Type Badge - Top Left */}
                        {type && (
                            <div className="absolute top-3 left-3 z-10">
                                <span className="px-3 py-1 text-xs font-medium rounded-full 
                                    bg-white/90 text-gray-800 shadow-sm">
                                    {type}
                                </span>
                            </div>
                        )}

                        {/* Hover Overlay with Tags */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 flex flex-col justify-center items-center p-6">
                            {/* Tags on Hover */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 text-sm rounded-full bg-white/10 text-white
                                            backdrop-blur-sm border border-white/20"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 
                            transition-colors duration-200">
                            {title}
                        </h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {shortDescription}
                            </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}