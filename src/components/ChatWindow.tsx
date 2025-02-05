"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  threadId: string | null;
  onSend: (message: string) => Promise<void>;
  messages: Message[];
  className?: string;
}

export function ChatWindow({ 
  threadId,
  onSend,
  messages,
  className 
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToBottom = () => {
    if (!isScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (content: string) => {
    try {
      await onSend(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={() => setIsScrolling(true)}
        onScrollEnd={() => setIsScrolling(false)}
      >
          {messages.map((message) => (
          <ChatBubble
              key={message.id}
            variant={message.role === 'user' ? 'sent' : 'received'}
              >
                {message.content}
              </ChatBubble>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4">
        <AIInputWithLoading 
          onSubmit={handleSubmit}
          loadingDuration={3000}
          placeholder="Type your message..."
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm"
        />
      </div>
    </div>
  );
} 