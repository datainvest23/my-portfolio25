"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HomeIcon, BookmarkIcon, ChatBubbleLeftRightIcon, Bars3Icon, XMarkIcon, FolderIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/providers/SupabaseProvider";
import bcrypt from "bcryptjs";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export default function TopNav() {
  const supabase = useSupabase();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function getUserProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.name) {
        setUserName(session.user.user_metadata.name);
      }
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        sendUserToGoogleAnalytics(session.user.email);
      }
    }
    getUserProfile();
  }, [supabase]);

  function sendUserToGoogleAnalytics(email: string) {
    if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
      window.gtag("event", "user_logged_in", {
        email_hash: hashEmail(email), // ✅ Securely hash email before sending
      });
    }
  }

  function hashEmail(email: string) {
    return bcrypt.hashSync(email, 10); // ✅ Uses bcrypt for secure hashing
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial render

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = [
    {
      label: "Portfolio",
      href: "/",
      icon: FolderIcon,
    },
    {
      label: "Conversation",
      href: "/conversation",
      icon: ChatBubbleOvalLeftEllipsisIcon,
      highlight: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: User Name or Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-black rounded-lg" />
            <span className="font-medium text-sm">
              {userName || "Marc Muller"}
            </span>
          </Link>

          {/* Center: Desktop Menu */}
          {!isMobile && (
            <nav className="flex-grow">
              <ul className="flex items-center justify-center gap-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "nav-link",
                          link.highlight ? "nav-link-highlighted" : "nav-link-default"
                        )}
                      >
                        <Icon 
                          className={cn(
                            "nav-icon",
                            link.highlight ? "nav-icon-highlighted" : ""
                          )}
                        />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Right side text */}
          {!isMobile && (
            <div className="flex-shrink-0 ml-8">
              <span className="font-bold text-gray-800">
                Portfolio | Marc Muller
              </span>
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="border-t py-4">
            <ul className="flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "nav-link",
                        link.highlight ? "nav-link-highlighted" : "nav-link-default"
                      )}
                    >
                      <Icon 
                        className={cn(
                          "nav-icon",
                          link.highlight ? "nav-icon-highlighted" : ""
                        )}
                      />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
