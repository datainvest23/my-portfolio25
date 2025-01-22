"use client";

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSend } from '@tabler/icons-react';

interface Message {
  id: number;
  message: string;
  sender: "user" | "bot";
}

export default function ConnectPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: "Hi there! How can I help you today?",
      sender: "bot",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      message: inputMessage,
      sender: "user",
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // TODO: Implement OpenAI API call here
      // For now, simulate a response
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now(),
          message: "I'm a simulated response. OpenAI integration coming soon!",
          sender: "bot",
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Let's Connect
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6 max-h-[600px] overflow-y-auto mb-6">
            {messages.map((message) => {
              const variant = message.sender === "user" ? "sent" : "received";
              return (
                <ChatBubble key={message.id} variant={variant}>
                  <ChatBubbleAvatar
                    fallback={variant === "sent" ? "ME" : "AI"}
                  />
                  <ChatBubbleMessage variant={variant}>
                    {message.message}
                  </ChatBubbleMessage>
                </ChatBubble>
              );
            })}
            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar fallback="AI" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
            >
              <IconSend size={18} />
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 