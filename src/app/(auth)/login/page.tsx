"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { toast } from 'react-hot-toast';

type Step = 'name' | 'email' | 'complete';
type Message = { id: string; text: string; isBot: boolean };

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('name');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      text: "Hola. I appreciate your interest in my projects. What's your name?",
      isBot: true 
    }
  ]);
  const [name, setName] = useState('');

  const addMessage = (text: string, isBot: boolean) => {
    setMessages(prev => [
      ...prev,
      { 
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text, 
        isBot 
      }
    ]);
  };

  const handleSubmit = async (value: string) => {
    if (step === 'name') {
      setName(value);
      addMessage(value, false);
      setTimeout(() => {
        addMessage(`Nice to meet you, ${value}! What's your email address?`, true);
        setStep('email');
      }, 1000);
    } else if (step === 'email') {
      const email = value;
      addMessage(email, false);
      setLoading(true);

      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-8),
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        addMessage("Perfect! You're all set. Redirecting you to the portfolio...", true);
        setStep('complete');
        
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);

      } catch (error) {
        console.error('Auth error:', error);
        toast.error("Sorry, something went wrong. Please try again.");
        addMessage("I'm sorry, there was an error with authentication. Please try again.", true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Welcome to Project Explorer
          </h1>
          
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatBubble variant={message.isBot ? "received" : "sent"}>
                    {message.text}
                  </ChatBubble>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {step !== 'complete' && (
            <AIInputWithLoading 
              onSubmit={handleSubmit}
              loadingDuration={1500}
              placeholder={step === 'name' ? "Enter your name..." : "Enter your email..."}
              className="bg-white/80 backdrop-blur-sm rounded-2xl"
            />
          )}
        </div>
      </div>
    </div>
  );
} 