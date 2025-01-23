"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  return <>{children}</>;
} 