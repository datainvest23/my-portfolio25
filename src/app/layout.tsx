// src/app/layout.tsx
"use client";

import { Inter, Work_Sans } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

const inter = Inter({ subsets: ['latin'] });
const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
});

export function AuthStateListener({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${workSans.variable}`}>
        <SupabaseProvider>
          <ToastProvider>
            <AuthStateListener>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AuthStateListener>
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}