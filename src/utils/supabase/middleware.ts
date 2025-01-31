import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

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
          get: (name) => request.cookies.get(name)?.value,
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      if (GA_TRACKING_ID) {
        response.headers.set("X-Analytics-Event", "unauthorized_user"); // ✅ Track unauthorized access
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (GA_TRACKING_ID) {
      response.headers.set("X-Analytics-Event", "authenticated_user"); // ✅ Track authorized access
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
