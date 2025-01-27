"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/login');

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
} 