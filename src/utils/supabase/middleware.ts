import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('Updating session...')
  console.log('Request path:', request.nextUrl.pathname)
  
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            console.log(`Middleware getting cookie: ${name}`)
            const value = request.cookies.get(name)?.value
            console.log(`Cookie value for ${name}:`, value)
            return value
          },
          async set(name: string, value: string, options: {}) {
            console.log(`Middleware setting cookie: ${name}`)
            response.cookies.set({ name, value, ...options })
          },
          async remove(name: string, options: {}) {
            console.log(`Middleware removing cookie: ${name}`)
            response.cookies.delete({ name, ...options })
          },
        },
      }
    )

    console.log('Checking user in middleware...')
    await supabase.auth.getUser()
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
} 