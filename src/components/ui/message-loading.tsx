<<<<<<< HEAD
function MessageLoading() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle cx="4" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}

export { MessageLoading }; 
=======
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
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
