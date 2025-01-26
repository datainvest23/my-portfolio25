import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Protect all routes except static assets
  ],
};

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const { data: { session } } = await supabase.auth.getSession();

  // If no session and not on the login page, redirect to login
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      // For API routes, return a 401 response
      return NextResponse.json(
        { error: 'Unauthorized', code: 'SESSION_REQUIRED' },
        { status: 401 }
      );
    }
    // Redirect unauthenticated page requests to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return res;
}
