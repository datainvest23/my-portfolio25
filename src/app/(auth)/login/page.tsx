"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'name' | 'email' | 'complete';
type Message = { text: string; isBot: boolean };

// Function to generate a secure random password
const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export default function LoginPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! What's your name?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, isBot: boolean) => {
    setMessages(prev => [...prev, { text, isBot }]);
  };

  const createAndStoreGptThread = async (userId: string) => {
    try {
      // Create thread
      const response = await fetch("/api/gpt/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create GPT thread');
      }

      const { threadId } = await response.json();
      console.log("Created thread:", threadId);

      // Store thread ID in user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ gpt_thread_id: threadId })
        .eq('id', userId);

      if (updateError) {
        console.error("Failed to store thread ID:", updateError);
        throw updateError;
      }

      return threadId;
    } catch (error) {
      console.error("Error in thread creation/storage:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'name') {
      setName(inputValue);
      addMessage(inputValue, false);
      addMessage("Nice to meet you! What's your email?", true);
      setStep('email');
      setInputValue('');
    } 
    else if (step === 'email') {
      try {
        setIsLoading(true);
        addMessage(inputValue, false);
        addMessage("Just a moment...", true);

        console.log("Starting authentication for:", { name, email: inputValue });
        const password = generateSecurePassword();

        // Try sign up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: inputValue,
          password,
          options: {
            data: {
              name: name
            }
          }
        });

        console.log("SignUp attempt result:", { signUpData, signUpError });
        let userId = null;
        let isNewUser = true;

        // Handle existing user case
        if (signUpError?.message === 'User already registered') {
          console.log("User exists, attempting sign in");
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: inputValue,
            password
          });

          console.log("SignIn attempt result:", { signInData, signInError });
          if (signInError) throw signInError;
          
          // Update user metadata for existing users
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              name: name
            }
          });

          if (updateError) throw updateError;
          
          userId = signInData?.user?.id;
          isNewUser = false;
        } else {
          if (!signUpData.user) throw new Error("Failed to create user");
          userId = signUpData.user.id;
        }

        if (!userId) throw new Error("No user ID available");

        // Check if user has a GPT thread
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('gpt_thread_id')
          .eq('id', userId)
          .single();

        console.log("Existing profile check:", existingProfile);

        // Create new GPT thread if needed
        let gptThreadId = existingProfile?.gpt_thread_id;
        if (!gptThreadId) {
          console.log("Creating new GPT thread for user");
          gptThreadId = await createAndStoreGptThread(userId);
        }

        // Create/Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: inputValue,
            name: name,
            last_login: new Date().toISOString(),
            gpt_thread_id: gptThreadId
          }, {
            onConflict: 'id'
          });

        if (profileError) throw profileError;

        // Success path
        console.log("Authentication successful, preparing redirect");
        addMessage("You're in! Redirecting to portfolio...", true);
        setStep('complete');

        // Use router for client-side navigation
        router.push('/');
        router.refresh();

      } catch (error: any) {
        console.error('Authentication error:', error);
        addMessage(
          `Error: ${error.message || "Something went wrong. Please try again."}`,
          true
        );
        setInputValue('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome</h1>
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {step !== 'complete' && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type={step === 'email' ? 'email' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
              placeholder={step === 'name' ? "Enter your name..." : "Enter your email..."}
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${
                isLoading 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 