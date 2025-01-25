import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/api/chat',
    '/api/interested/:path*',
    '/interested',
    '/portfolio/:path*'  // Added portfolio routes
  ]
};

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Check if accessing protected route without session
  if (!session) {
    // If API request, return 401
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'SESSION_REQUIRED' },
        { status: 401 }
      );
    }
    // If page request, redirect to home for auth
    return NextResponse.redirect(new URL('/', request.url));
  }

  return res;
} 