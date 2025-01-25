"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlipCardProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  flipOnClick?: boolean
  flipOnHover?: boolean
  front: React.ReactNode
  back: React.ReactNode
}

export function FlipCard({
  children,
  className,
  containerClassName,
  flipOnClick = false,
  flipOnHover = true,
  front,
  back,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  const handleFlip = () => {
    if (flipOnClick) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleHover = () => {
    if (flipOnHover) {
      setIsFlipped(true)
    }
  }

  const handleHoverEnd = () => {
    if (flipOnHover) {
      setIsFlipped(false)
    }
  }

  return (
    <div
      className={cn(
        "relative h-full w-full cursor-pointer perspective-1000",
        containerClassName
      )}
      onClick={handleFlip}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      <motion.div
        className={cn(
          "relative h-full w-full transform-style-3d transition-transform duration-500",
          className
        )}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </motion.div>
    </div>
  )
} 