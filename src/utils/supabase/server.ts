import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// ✅ Server Action for modifying authentication cookies
export async function setAuthCookie(name: string, value: string, options: CookieOptions) {
  try {
    cookies().set({ name, value, ...options });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Cookie set error:", error);
    }
  }
}

// ✅ Server Action for removing authentication cookies
export async function removeAuthCookie(name: string, options: CookieOptions) {
  try {
    cookies().delete({ name, ...options });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Cookie remove error:", error);
    }
  }
}

export async function createClient() {
  const cookieStore = cookies();

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
          await setAuthCookie(name, value, options); // ✅ Uses Server Action
        },
        async remove(name: string, options: CookieOptions) {
          await removeAuthCookie(name, options); // ✅ Uses Server Action
        },
      },
    }
  );
}
