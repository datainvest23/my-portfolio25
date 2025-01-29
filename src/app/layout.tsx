"use client";

import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { AuthStateListener } from "@/components/AuthStateListener";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const inter = Inter({ subsets: ["latin"] });
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Fetch session data on first render to prevent SSR/CSR mismatch
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }
    checkAuth();

    // Listen for auth state changes to dynamically update TopNav visibility
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} ${workSans.variable}`}>
        <SupabaseProvider>
          <ToastProvider>
            <AuthStateListener>
              {/* Ensure TopNav always renders for authenticated users */}
              {isAuthenticated !== null && isAuthenticated && <TopNav />}
              <div className={`min-h-screen ${isAuthenticated ? "pt-16" : ""}`}>
                {children}
              </div>
            </AuthStateListener>
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
