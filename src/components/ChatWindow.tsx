"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, PaperAirplaneIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

interface ChatWindowProps {
  threadId: string;
  initialMessage?: string | null;
  interestedProjects?: Array<{
    project_name: string;
    project_details?: {
      shortDescription?: string;
      type?: string;
    };
  }>;
}

export function ChatWindow({ threadId, initialMessage, interestedProjects }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const initializationRef = useRef(false);

  // Handle initial message and context initialization
  useEffect(() => {
    const initialize = async () => {
      // Only proceed if we haven't initialized yet
      if (initializationRef.current) return;
      initializationRef.current = true;

      // Set initial greeting
      if (initialMessage) {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: initialMessage,
          createdAt: new Date(),
        }]);
      }

      // If we have interested projects, initialize context
      if (interestedProjects?.length) {
        // Add loading message after a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMessages(prev => [...prev, {
          id: "loading",
          role: "assistant",
          content: "⏳ Analyzing your interests...",
          createdAt: new Date(),
        }]);

        try {
          const projectNames = interestedProjects.map(p => p.project_name).join(", ");
          const response = await fetch("/api/chat/context", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              threadId,
              projectNames,
              projects: interestedProjects 
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.details || 'Failed to initialize context');
          }
          
          if (data.message) {
            setMessages(prev => prev.filter(m => m.id !== "loading").concat({
              id: Date.now().toString(),
              role: "assistant",
              content: data.message,
              createdAt: new Date(),
            }));
          }
        } catch (error) {
          console.error("Error initializing context:", error);
          setMessages(prev => prev.filter(m => m.id !== "loading").concat({
            id: "error",
            role: "assistant",
            content: `I apologize, but I encountered an issue while loading the project information. ${error instanceof Error ? error.message : ''} Please try refreshing the page.`,
            createdAt: new Date(),
          }));
        }
      }
    };

    initialize();
  }, [threadId, initialMessage, interestedProjects]); // Include threadId in dependencies

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setIsStreaming(true);
      setCurrentStreamedMessage("");

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Stream the response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, message: input }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullMessage = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullMessage += chunk;
        setCurrentStreamedMessage(fullMessage); // Update with full message so far
      }

      // Add complete assistant response only once streaming is done
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: fullMessage,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStreamedMessage(""); // Clear streaming message

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setInput("");
    }
  };

  // Modify the message rendering to handle markdown properly
  const renderMessage = (message: Message) => (
    <div
      className={cn(
        "rounded-2xl px-4 py-2 text-sm shadow-sm",
        message.role === "assistant"
          ? "bg-white border border-gray-200 text-gray-800 prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
          : "bg-blue-600 text-white"
      )}
    >
      {message.id === "loading" ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
          <span>{message.content}</span>
        </div>
      ) : message.role === "assistant" && message.id !== "welcome" ? (
        <TypewriterText text={message.content} />
      ) : (
        <ReactMarkdown
          components={{
            strong: ({ children }) => <span className="font-semibold text-blue-700">{children}</span>,
            h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>,
            ul: ({ children }) => <ul className="mt-2 mb-2 list-disc pl-4">{children}</ul>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      )}
    </div>
  );

  // TypewriterText component with markdown support
  const TypewriterText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState("");
    
    useEffect(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text[index]);
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);

      return () => clearInterval(timer);
    }, [text]);

    return (
      <ReactMarkdown
        components={{
          strong: ({ children }) => <span className="font-semibold text-blue-700">{children}</span>,
          h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="mt-2 mb-2 list-disc pl-4">{children}</ul>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
        }}
      >
        {displayText}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 max-w-[80%]",
              message.role === "assistant" ? "self-start" : "self-end flex-row-reverse"
            )}
          >
            {/* Avatar */}
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="h-4 w-4 text-blue-600" />
              </div>
            )}

            {/* Message Bubble */}
            {renderMessage(message)}
          </div>
        ))}

        {/* Streaming message */}
        {isStreaming && currentStreamedMessage && (
          <div className="flex items-start gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="rounded-2xl px-4 py-2 text-sm shadow-sm bg-white border border-gray-200 text-gray-800 prose prose-sm max-w-none">
              <ReactMarkdown>{currentStreamedMessage}</ReactMarkdown>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with arrow icon button */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-sm bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-2 rounded-full",
              "bg-blue-600 hover:bg-blue-700 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center",
              "shadow-sm"
            )}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <ArrowRightIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
