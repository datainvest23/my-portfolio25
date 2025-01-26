// /src/app/(auth)/login/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image'; //  Added import
// Custom Components
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading';
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

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, step]);

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


    const typewriterEffect = (text: string, callback: (newText: string) => void) => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                callback(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
    };

    const handleBotMessage = async (text: string) => {
        return new Promise<void>((resolve) => {
            const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            setMessages(prev => [...prev, { id: messageId, text: '', isBot: true }]);
            typewriterEffect(text, (newText) => {
              setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.id === messageId ? { ...message, text: newText } : message
                  )
              );
            resolve()
          });
        })
    }
  const handleSubmit = async (value: string) => {
    if (step === 'name') {
      setName(value);
      addMessage(value, false);
      await handleBotMessage(`Nice to meet you, ${value}! What's your email address?`);
       setStep('email');
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

          await handleBotMessage("Perfect! You're all set. Redirecting you to the portfolio...");
        setStep('complete');

        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);

      } catch (error) {
        console.error('Auth error:', error);
        toast.error("Sorry, something went wrong. Please try again.");
        await handleBotMessage("I'm sorry, there was an error with authentication. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0">
            <Image
                src="/background-image.jpg"
                alt="Login Background"
                layout="fill"
                objectFit="cover"
                className="opacity-50 blur-sm"
              />
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

      <div className="relative w-full max-w-md bg-transparent p-6 rounded-2xl">
        <div className="space-y-4 mb-6 max-h-[70vh] overflow-y-auto">
             <AnimatePresence initial={false}>
                    {messages.map((message) => (
                         <motion.div
                              key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                        <p className={`text-lg ${message.isBot ? 'text-yellow-300' : 'text-white'} font-medium mb-2`}>{message.text}</p>
                        </motion.div>
                    ))}
                   <div ref={messagesEndRef} />
                </AnimatePresence>
        </div>
       {step !== 'complete' && (
         <AIInputWithLoading
           onSubmit={handleSubmit}
           loadingDuration={1500}
           placeholder={step === 'name' ? 'INPUT: NAME' : 'INPUT: EMAIL'}
           className="bg-white/10 backdrop-blur-sm rounded-full text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
           inputRef={inputRef}
         />
       )}
          {step === 'complete' && (
             <div className="text-white text-center mt-4">
                  Thanks, {name}
                  <p className="text-yellow-500 font-medium text-xl">LOADING PORTFOLIO...</p>
             </div>
          )}
      </div>
    </div>
  );
}