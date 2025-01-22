'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get error description from URL if it exists
        const error = searchParams?.get('error_description');
        if (error) throw new Error(error);

        const code = searchParams?.get('code');
        if (!code) throw new Error('No code in URL');

        // Exchange code for session
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) throw sessionError;

        // Get the session
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        if (getSessionError) throw getSessionError;

        if (session) {
          // Create or update profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              name: session.user.user_metadata.name,
              email: session.user.email,
              last_login: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error('Profile update error:', profileError);
          }
        }

        // Redirect to home page
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=Authentication failed');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging you in...</h1>
        <p className="text-gray-600">Please wait while we complete the authentication.</p>
      </div>
    </div>
  );
} 