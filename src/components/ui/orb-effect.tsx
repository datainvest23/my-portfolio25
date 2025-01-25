"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OrbEffectProps {
  className?: string
  backgroundColor?: string
  gradientColor?: string
  size?: number
  blur?: number
  speed?: number
}

export function OrbEffect({
  className,
  backgroundColor = "bg-neutral-950",
  gradientColor = "from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20",
  size = 800,
  blur = 100,
  speed = 4,
}: OrbEffectProps) {
  const orbRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    const wrapper = wrapperRef.current
    if (!orb || !wrapper) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      mouseX = e.clientX - rect.left - rect.width / 2
      mouseY = e.clientY - rect.top - rect.height / 2
    }

    const animate = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY
      currentX += dx / speed
      currentY += dy / speed

      orb.style.transform = `translate(${currentX}px, ${currentY}px)`
      requestAnimationFrame(animate)
    }

    wrapper.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove)
    }
  }, [speed])

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden", backgroundColor, className)}
    >
      <div
        ref={orbRef}
        className={cn(
          "absolute transition-transform duration-100 ease-out",
          "rounded-full blur-[100px] opacity-50",
          "bg-gradient-to-r",
          gradientColor
        )}
            style={{ 
          width: size,
          height: size,
          filter: `blur(${blur}px)`,
          left: `calc(50% - ${size / 2}px)`,
          top: `calc(50% - ${size / 2}px)`,
        }}
      />
    </div>
  )
} 