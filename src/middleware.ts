import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware sees session:', session);

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/auth/callback', '/auth-test'];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  console.log('Middleware check:', {
    path: req.nextUrl.pathname,
    isPublicPath,
    hasSession: !!session,
    sessionData: session
  });

  // If no session and not on a public path, redirect to login
  if (!session && !isPublicPath) {
    console.log('No session, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If session exists and on login page, redirect to home
  if (session && req.nextUrl.pathname === '/login') {
    console.log('Session exists, redirecting to home');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}; 