"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedHeaderCardProps {
  projectName: string;
  projectDescription: string;
  projectTechnologies: any[];
  children?: React.ReactNode;
}

export function AnimatedHeaderCard({ 
  projectName, 
  projectDescription, 
  projectTechnologies,
  children 
}: AnimatedHeaderCardProps) {
  const [isZoomed, setIsZoomed] = useState(true);
  const { scrollY } = useScroll();
  
  // Handle automatic zoom out after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsZoomed(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle zoom out on scroll
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 10 && isZoomed) {
        setIsZoomed(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY, isZoomed]);

  return (
    <motion.div
      className="container mx-auto px-4 relative -mt-32"
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ 
        scale: isZoomed ? 1.5 : 1,
        opacity: 1,
      }}
      transition={{
        scale: {
          type: "spring",
          damping: 30,
          stiffness: 100
        },
        opacity: { duration: 0.5 }
      }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-8 mb-8 relative"
        layout
      >
        <div className="flex items-center gap-2 mb-4">
          {projectTechnologies.map((tech: any) => (
            <span key={tech.id} className={`tag ${tech.color}`}>
              {tech.name}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-normal mb-4">{projectName}</h1>
        <p className="text-lg text-neutral-600 max-w-3xl">
          {projectDescription}
        </p>
      </motion.div>
      {children}
    </motion.div>
  );
} 