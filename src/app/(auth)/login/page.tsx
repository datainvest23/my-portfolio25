"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Custom Components
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";

type Step = "name" | "email" | "complete";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter Effect Fix
  const fullMessage = "Hola. I appreciate your interest in my projects. What's your name?";
  const [typedMessage, setTypedMessage] = useState<string[]>([]); // Use an array instead of a string
  const [messageCompleted, setMessageCompleted] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setTypedMessage([]); // Reset before animation starts
    let i = 0;
    const tempMessage: string[] = [];

    const timer = setInterval(() => {
      if (i < fullMessage.length) {
        tempMessage.push(fullMessage.charAt(i)); // Push the correct character
        setTypedMessage([...tempMessage]); // Spread to trigger re-render
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setMessageCompleted(true), 500); // Show input field after a delay
      }
    }, 50); // Adjust speed (lower = faster)

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (value: string) => {
    if (step === "name") {
      setName(value);
      setTypedMessage([]); // Reset before showing new message
      setMessageCompleted(false);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
      const newMessage = `Nice to meet you, ${value}! What's your email address?`;
      setTypedMessage(newMessage.split("")); // Properly store in an array
      setMessageCompleted(true);
      setStep("email");
    } else if (step === "email") {
      const email = value;
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

        setTypedMessage("Perfect! You're all set. Redirecting you to the portfolio.".split(""));
        setStep("complete");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("Sorry, something went wrong. Please try again.");
        setTypedMessage("I'm sorry, there was an error with authentication. Please try again.".split(""));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background-image.jpg"
          alt="Login Background"
          fill
          className="object-cover opacity-50 blur-sm"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Chat Container */}
      <div className="relative w-full max-w-xl bg-transparent p-8">
        <div className="space-y-6 mb-8 max-h-[70vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Typewriter Effect */}
            <p className="text-2xl md:text-3xl text-yellow-300 font-medium mb-4">
              {typedMessage.join("")}
            </p>
          </motion.div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Field: Fade-in after message completion */}
        <AnimatePresence>
          {messageCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AIInputWithLoading
                onSubmit={handleSubmit}
                loadingDuration={1500}
                placeholder={step === "name" ? "YOUR NAME" : "YOUR EMAIL"}
                className="bg-white/10 backdrop-blur-sm text-white border border-gray-600 focus:border-yellow-500 focus:outline-none text-lg md:text-xl px-6 py-4 w-full"
                inputRef={inputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Message */}
        {step === "complete" && (
          <div className="text-white text-center mt-4">
            <p className="text-2xl md:text-3xl font-medium">Thanks, {name}</p>
            <p className="text-yellow-500 font-bold text-xl md:text-2xl">
              LOADING PORTFOLIO...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
