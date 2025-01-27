// src/app/layout.tsx
"use client";

import { Inter, Work_Sans } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthStateListener } from '@/components/AuthStateListener';
import TopNav from '@/components/TopNav';

const inter = Inter({ subsets: ['latin'] });
const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
});

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
              <TopNav />
              <div className="min-h-screen pt-16">
                {children}
              </div>
            </AuthStateListener>
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}