"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Square {
  x: number;
  y: number;
  opacity: number;
  delay: number;
}

interface AnimatedGridPatternProps {
  className?: string;
  containerClassName?: string;
  patternClassName?: string;
  squares?: number;
  squareSize?: number;
  animationDuration?: number;
  delayMultiplier?: number;
  _repeatDelay?: number; // Prefixed with _ since it's unused
}

export function AnimatedGridPattern({
  className,
  containerClassName,
  patternClassName,
  squares = 30,
  squareSize = 40,
  animationDuration = 4000,
  delayMultiplier = 100,
  _repeatDelay = 3000,
}: AnimatedGridPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [squareElements, setSquareElements] = useState<Square[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const generateSquares = () => {
    if (!containerRef.current) return [];

    const { width, height } = containerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });

    const newSquares: Square[] = [];
    const cols = Math.floor(width / squareSize);
    const rows = Math.floor(height / squareSize);

    for (let i = 0; i < squares; i++) {
      newSquares.push({
        x: Math.floor(Math.random() * cols) * squareSize,
        y: Math.floor(Math.random() * rows) * squareSize,
        opacity: Math.random(),
        delay: i * delayMultiplier,
      });
    }

    return newSquares;
  };

  useEffect(() => {
    const squares = generateSquares();
    setSquareElements(squares);

    const observer = new ResizeObserver(() => {
      const newSquares = generateSquares();
      setSquareElements(newSquares);
    });

    if (containerRef.current) {
      const currentContainer = containerRef.current;
      observer.observe(currentContainer);
      return () => observer.unobserve(currentContainer);
    }
  }, [squares, squareSize, delayMultiplier]);

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      ref={containerRef}
    >
      <div className={cn("absolute inset-0", className)}>
        <div className={cn("absolute inset-0", patternClassName)}>
          {squareElements.map((square, i) => (
            <div
              key={`${square.x}-${square.y}-${i}`}
              className="absolute bg-foreground/20"
              style={{
                left: square.x,
                top: square.y,
                width: squareSize,
                height: squareSize,
                opacity: square.opacity,
                animation: `fade-in ${animationDuration}ms infinite`,
                animationDelay: `${square.delay}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 