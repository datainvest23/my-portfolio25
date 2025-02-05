<<<<<<< HEAD
=======
"use client"

import { useEffect, useRef } from "react"
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
import { cn } from "@/lib/utils"

interface OrbEffectProps {
  className?: string
<<<<<<< HEAD
}

export function OrbEffect({ className }: OrbEffectProps) {
  return (
    <div className={cn("relative w-full pt-12", className)}>
      <div className="relative w-full pt-[20%]">
        {/* Main Orb Container */}
        <div className="absolute -left-[50%] top-0 z-10 w-[200%] overflow-hidden 
          rounded-[100%] border-4 border-brand bg-background/50 pt-[100%] 
          shadow-[0px_0px_12px_hsla(var(--brand)/0.8),_0px_0px_64px_hsla(var(--brand-foreground)/0.5),0px_0px_12px_hsla(var(--brand)/0.8)_inset]"
        >
          {/* Animated Layers */}
          <div 
            className="absolute -left-[50%] top-0 h-[200%] w-[200%] 
              animate-pulse-hover rounded-[100%] bg-brand-foreground/50"
            style={{ 
              maskImage: "radial-gradient(140% 95%, transparent 0%, transparent 35%, black 55%)" 
            }}
          />
          <div 
            className="absolute -left-[50%] top-0 h-[200%] w-[200%] 
              animate-pulse-hover rounded-[100%] bg-brand/50"
            style={{ 
              maskImage: "radial-gradient(140% 110%, transparent 0%, transparent 35%, black 55%)" 
            }}
          />
          <div 
            className="absolute -left-[50%] -top-[5%] h-[200%] w-[200%] 
              animate-pulse-hover rounded-[100%] bg-white"
            style={{ 
              maskImage: "radial-gradient(140% 120%, transparent 0%, transparent 38%, black 43%)" 
            }}
          />
        </div>

        {/* Gradient Effects */}
        <div className="absolute w-full top-[50%]">
          <div className="absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 
            scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] 
            sm:h-[512px] -translate-y-1/2"
          />
          <div className="absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 
            scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] 
            sm:h-[256px] -translate-y-1/2"
          />
        </div>
      </div>
=======
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
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
    </div>
  )
} 