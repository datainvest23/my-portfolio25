"use client";

<<<<<<< HEAD
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { cn } from "@/lib/utils";

export function InterestingButton() {
  return (
    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-20">
      <MagnetizeButton 
        className={cn(
          "rounded-full",
          "shadow-md hover:shadow-lg",
          "border-neutral-100"
        )}
        particleCount={14}
        attractRadius={50}
      />
    </div>
  );
=======
import * as React from "react"
import { cn } from "@/lib/utils"

interface InterestingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  glowClassName?: string
}

export function InterestingButton({
  children,
  className,
  glowClassName,
  ...props
}: InterestingButtonProps) {
  return (
    <button
      className={cn(
        "group relative flex items-center justify-center",
        "rounded-lg px-4 py-2 text-sm font-medium",
        "bg-gradient-to-b from-zinc-50/50 to-white/90",
        "shadow-[0_1px_1px_0_rgba(0,0,0,.1),0_1px_3px_0_rgba(0,0,0,.1)]",
        "transition-all duration-150",
        "hover:shadow-[0_2px_2px_0_rgba(0,0,0,.1),0_3px_6px_0_rgba(0,0,0,.1)]",
        "focus:outline-none focus:ring-2 focus:ring-zinc-200/60 focus:ring-offset-2",
        "active:scale-[0.98] active:shadow-[0_1px_1px_0_rgba(0,0,0,.1)]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-lg",
          glowClassName
        )}
      >
        <div className="absolute inset-x-0 aspect-square w-full -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200 to-transparent blur-xl" />
        </div>
      </div>
    </button>
  )
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
} 