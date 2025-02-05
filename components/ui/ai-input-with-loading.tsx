"use client"

import { CornerRightUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea"

interface AIInputWithLoadingProps {
  id?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  loadingDuration?: number
  className?: string
  onSubmit: (value: string) => Promise<void>
}

export function AIInputWithLoading({
  id,
  placeholder = "Type a message...",
  minHeight = 56,
  maxHeight,
  loadingDuration = 1000,
  className,
  onSubmit,
}: AIInputWithLoadingProps) {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  })

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false)
      }, loadingDuration)
      return () => clearTimeout(timer)
    }
  }, [submitted, loadingDuration])

  const handleSubmit = async () => {
    if (!value.trim() || submitted) return

    setSubmitted(true)
    try {
      await onSubmit(value.trim())
      setValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = `${minHeight}px`
      }
    } catch (error) {
      console.error("Failed to submit:", error)
      setSubmitted(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-end">
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value)
            adjustHeight()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void handleSubmit()
            }
          }}
          className={cn(
            "resize-none pr-12 text-base",
            submitted && "opacity-50"
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          }}
          disabled={submitted}
        />
        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => void handleSubmit()}
            disabled={!value.trim() || submitted}
            className={cn(
              "rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50",
              submitted && "animate-spin"
            )}
          >
            <CornerRightUp
              className={cn(
                "h-5 w-5 transition-transform",
                submitted && "scale-110"
              )}
            />
          </button>
        </div>
        <p className="pl-4 h-4 text-xs mx-auto text-black/70 dark:text-white/70">
          {submitted ? "AI is thinking..." : "Ready to submit!"}
        </p>
      </div>
    </div>
  )
} 