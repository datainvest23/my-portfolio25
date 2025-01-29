// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return request.cookies.get(name)?.value;
          },
          async set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          async remove(name: string, options: any) {
            response.cookies.delete({ name, ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Redirect unauthenticated users to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch (error) {
    console.error('Error in middleware session update:', error);
    return response;
  }
}

// Apply middleware only to protected pages
export const config = {
  matcher: ["/", "/dashboard", "/profile"], // Add protected routes here
};
