"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};

interface ChatWindowProps {
  threadId: string;
  initialMessage?: string | null;
}

export function ChatWindow({ threadId, initialMessage }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: initialMessage || "Hi! I'm your AI assistant. How can I help you today?",
        createdAt: new Date(),
      },
    ]);
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: inputValue }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble 
                variant={message.role === 'assistant' ? "received" : "sent"}
                className="shadow-sm"
              >
                {message.content}
              </ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
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