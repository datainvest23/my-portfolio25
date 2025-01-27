"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HomeIcon, BookmarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function TopNav() {
  const supabase = useSupabase();
  const [userName, setUserName] = useState<string | null>(null);

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
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      label: "Interested",
      href: "/interested",
      icon: <BookmarkIcon className="h-5 w-5" />,
      highlight: true,
    },
    {
      label: "Conversation",
      href: "/conversation",
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
    },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and User Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 bg-black rounded-lg flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {userName || 'Marc Muller'}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="flex items-center gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      "hover:bg-gray-100",
                      link.highlight && "text-blue-600",
                    )}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    <span className="text-sm font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 