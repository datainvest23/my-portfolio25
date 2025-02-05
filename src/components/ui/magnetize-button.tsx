"use client" 

import * as React from "react"
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Point {
    x: number;
    y: number;
}

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    _attractRadius?: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

export function MagnetizeButton({
    children,
    className,
    _attractRadius = 200,
    ...props
}: MagnetizeButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current || !isHovered) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        setPosition({ x: deltaX * 0.2, y: deltaY * 0.2 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i].x,
            y: particles[i].y,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        }));
    }, [particlesControl, particles]);

    return (
        <button
            ref={buttonRef}
            className={cn(
                "relative inline-flex items-center justify-center transition-transform duration-150 ease-linear",
                className
            )}
            onMouseEnter={() => {
                setIsHovered(true);
                handleInteractionStart();
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            {...props}
        >
            {particles.map((_, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    initial={{ x: particles[index].x, y: particles[index].y }}
                    animate={particlesControl}
                    className={cn(
                        "absolute w-1.5 h-1.5 rounded-full",
                        "bg-violet-400 dark:bg-violet-300",
                        "transition-opacity duration-300",
                        isAttracting ? "opacity-100" : "opacity-40"
                    )}
                />
            ))}
            <span className="relative w-full flex items-center justify-center gap-2">
                <Magnet
                    className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isAttracting && "scale-110"
                    )}
                />
                {isAttracting ? "Interesting!" : "Interesting?"}
            </span>
            {children}
        </button>
    );
} 