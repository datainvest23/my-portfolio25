"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

type Step = 'name' | 'email' | 'complete';
type Message = { id: string; text: string; isBot: boolean };

// Function to generate a secure random password
const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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

      try {
        // First try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: generateSecurePassword(), // Try with a random password
        });

        // If sign in fails, create a new account
        if (signInError) {
          const password = generateSecurePassword();
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (signUpError) throw signUpError;

          // Auto-sign in after signup
          const { error: autoSignInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (autoSignInError) throw autoSignInError;
        }

        // Success message and redirect
        addMessage("Perfect! You're all set. Redirecting you to the portfolio...", true);
        setStep('complete');
        
        // Update user profile if needed
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name,
              email,
              last_login: new Date().toISOString(),
            });
        }

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);

      } catch (error) {
        console.error('Auth error:', error);
        toast.error("Sorry, something went wrong. Please try again.");
        addMessage("I'm sorry, there was an error with authentication. Please try again.", true);
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