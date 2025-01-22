"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HomeIcon, BookmarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = useSupabase();
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch user data on component mount
  React.useEffect(() => {
    async function getUserProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.name) {
        setUserName(session.user.user_metadata.name);
      }
    }
    getUserProfile();
  }, [supabase]);

  const links = [
    {
      label: "Portfolio",
      href: "/",
      icon: (
        <HomeIcon className="h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Interested",
      href: "/interested",
      icon: (
        <BookmarkIcon className="h-5 w-5 flex-shrink-0" />
      ),
      highlight: true,
    },
    {
      label: "Conversation",
      href: "/conversation",
      icon: (
        <ChatBubbleLeftRightIcon className="h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300 z-50",
        isOpen ? "w-[200px]" : "w-[60px]"
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo and User Name */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 py-1">
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black whitespace-nowrap"
              >
                {userName || 'Marc Muller'}
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    "text-neutral-600 hover:text-neutral-900",
                    link.highlight && "bg-blue-50 hover:bg-blue-100",
                    link.highlight && "text-blue-600 hover:text-blue-700"
                  )}
                >
                  <span className={cn(
                    link.highlight ? "text-blue-600" : "text-neutral-600"
                  )}>
                    {link.icon}
                  </span>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap text-sm font-medium"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
} 