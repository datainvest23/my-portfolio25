import { cookies, type CookieOptions } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies(); // ✅ Ensure `cookies()` is awaited properly

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name); // ✅ Now correctly gets the cookie
          return cookie?.value || null;
        },
        async set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options }); // ✅ Ensure cookies are correctly set
        },
        async remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options }); // ✅ Properly remove cookies
        },
      },
    }
  );
}
