"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageLoading } from "@/components/ui/message-loading"

interface ChatBubbleProps {
  variant?: "sent" | "received"
  _layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback: string
  className?: string
}

interface ChatBubbleMessageProps {
  isLoading?: boolean
  className?: string
  children: React.ReactNode
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

interface ChatBubbleActionWrapperProps {
  className?: string
  children: React.ReactNode
}

export function ChatBubble({
  variant = "received",
  _layout = "default",
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        className
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          variant === "sent"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ChatBubbleAvatar({
  src,
  fallback,
  className,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

export function ChatBubbleMessage({
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-2 max-w-md text-sm bg-muted",
        className
      )}
    >
      {isLoading ? <MessageLoading /> : children}
    </div>
  )
}

export function ChatBubbleAction({
  icon,
  onClick,
  className,
}: ChatBubbleActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

export function ChatBubbleActionWrapper({
  className,
  children,
}: ChatBubbleActionWrapperProps) {
  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {children}
    </div>
  )
} 