"use client"

import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GlobeMarker {
  location: [number, number];
  size: number;
}

interface GlobeState {
  phi: number;
}

interface GlobeConfig extends Omit<COBEOptions, 'markers'> {
  markers?: GlobeMarker[];
  onRender?: (state: GlobeState) => void;
}

const DEFAULT_CONFIG: GlobeConfig = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

interface GlobeProps {
  config?: Partial<GlobeConfig>;
  className?: string;
}

export function Globe({ config = {}, className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteractionMovement = useRef<number | null>(null)
  const width = 800
  const [isMoving, setIsMoving] = useState(false)

  const updateMovement = useCallback((clientX: number) => {
    if (pointerInteractionMovement.current !== null) {
      const delta = clientX - pointerInteractionMovement.current
      pointerInteractionMovement.current = clientX
      setIsMoving(true)
      return delta / 100
    }
    return 0
  }, [])

  const updatePointerInteraction = useCallback(
    (clientX: number | null) => {
      pointerInteractionMovement.current = clientX
      setIsMoving(!!clientX)
    },
    []
  )

  useEffect(() => {
    if (!canvasRef.current) return

    const mergedConfig: GlobeConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      width,
      height: width,
      onRender: (state: GlobeState) => {
        state.phi += isMoving ? 0.005 : 0.005
        config.onRender?.(state)
      },
    }

    const globe = createGlobe(canvasRef.current, mergedConfig)

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    })

    return () => {
      globe.destroy()
    }
  }, [config, isMoving])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - (pointerInteractionMovement.current ?? 0)
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
} 