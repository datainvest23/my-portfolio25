"use client";

<<<<<<< HEAD
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => generateSquares(numSquares));

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: getPos(),
            }
          : sq,
      ),
    );
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
=======
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
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
  );
} 