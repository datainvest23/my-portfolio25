"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center",
        "font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-offset-2 disabled:pointer-events-none",
        "disabled:opacity-50 active:translate-y-0.5",
        // Size variations
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        // Variant styles
        variant === "default" && [
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "shadow-[0_4px_0_0_rgb(0,0,0,0.2)]",
          "active:shadow-[0_0_0_0_rgb(0,0,0,0.2)]",
        ],
        variant === "outline" && [
          "border-2 border-primary bg-background",
          "hover:bg-primary/10 text-foreground",
          "shadow-[0_4px_0_0_rgb(0,0,0,0.1)]",
          "active:shadow-[0_0_0_0_rgb(0,0,0,0.1)]",
        ],
        variant === "ghost" && [
          "hover:bg-accent hover:text-accent-foreground",
          "shadow-none active:translate-y-0",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}