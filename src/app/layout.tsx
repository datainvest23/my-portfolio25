"use client";

import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { AuthStateListener } from "@/components/AuthStateListener";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Google Analytics (GA4) - Loads only if GA ID is set */}
        {GA_TRACKING_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
            <Script id="ga-script" strategy="afterInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        )}
      </head>
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
