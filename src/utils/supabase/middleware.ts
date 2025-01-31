import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
          get: (name) => request.cookies.get(name)?.value, // ✅ Allowed
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch (error) {
    console.error("Error in middleware session update:", error);
    return response;
  }
}

// ✅ Apply middleware only to protected pages
export const config = {
  matcher: ["/", "/dashboard", "/profile", "/interested"],
};
