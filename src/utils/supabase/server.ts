import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in development
            if (process.env.NODE_ENV === 'development') {
              console.warn('Cookie set error:', error)
            }
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle cookie errors in development
            if (process.env.NODE_ENV === 'development') {
              console.warn('Cookie remove error:', error)
            }
          }
        },
      },
    }
  )
} 