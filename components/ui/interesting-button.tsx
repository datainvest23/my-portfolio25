"use client";

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
} 