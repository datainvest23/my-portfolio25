import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// ✅ Server Action for modifying authentication cookies
export async function setAuthCookie(name: string, value: string, options: CookieOptions) {
  try {
    const cookieStore = await cookies();
    cookieStore.set({ name, value, ...options });
    if (GA_TRACKING_ID) {
      console.log(`Google Analytics Event: Cookie Set - ${name}`); // ✅ Track cookie setting
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Cookie set error:", error);
    }
  }
}

// ✅ Server Action for removing authentication cookies
export async function removeAuthCookie(name: string, options: CookieOptions) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete({ name, ...options });
    if (GA_TRACKING_ID) {
      console.log(`Google Analytics Event: Cookie Removed - ${name}`); // ✅ Track cookie removal
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Cookie remove error:", error);
    }
  }
}

export async function createClient() {
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          await setAuthCookie(name, value, options);
        },
        async remove(name: string, options: CookieOptions) {
          await removeAuthCookie(name, options);
        },
      },
    }
  );
}
