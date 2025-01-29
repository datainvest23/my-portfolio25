"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface AIInputWithLoadingProps {
  onSubmit: (value: string) => void;
  placeholder: string;
  loadingDuration?: number;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const AIInputWithLoading: React.FC<AIInputWithLoadingProps> = ({
  onSubmit,
  placeholder,
  loadingDuration = 1000,
  className,
  inputRef
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || !value.trim()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, loadingDuration));
    await onSubmit(value);
    setValue("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={`${className} w-full py-3 px-6`}
        ref={inputRef}
        disabled={loading}
      />
      <motion.button
        ref={submitButtonRef}
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 
                   bg-yellow-500 hover:bg-yellow-600 transition-all 
                   text-black font-bold rounded-md w-12 h-12 flex items-center justify-center"
        disabled={loading}
        animate={{
          opacity: loading || !value.trim() ? 0.5 : 1,
          scale: loading || !value.trim() ? 0.9 : 1,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </motion.button>
    </form>
  );
};
