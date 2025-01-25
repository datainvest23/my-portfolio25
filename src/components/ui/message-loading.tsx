"use client"

import { cn } from "@/lib/utils"

interface MessageLoadingProps {
  className?: string
  dotClassName?: string
}

export function MessageLoading({ className, dotClassName }: MessageLoadingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current opacity-60",
            "animate-pulse",
            dotClassName
          )}
          style={{
            animationDelay: `${(i - 1) * 200}ms`,
          }}
        />
      ))}
    </div>
  )
} 