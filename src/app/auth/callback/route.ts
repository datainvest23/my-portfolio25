// src/app/(auth)/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`/login?error=auth_failed`);
      }
      
      return NextResponse.redirect(next);
    } catch (error) {
      console.error('Unexpected error during auth callback:', error);
       return NextResponse.redirect(`/login?error=unexpected_auth_error`);
     }
  }

  return NextResponse.redirect(`/login?error=no_code_provided`);
}
