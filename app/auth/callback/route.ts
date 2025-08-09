// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { supabaseWithResponse } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // Redirect target after successful login
  const redirectTo = new URL('/projects', req.url)
  const res = NextResponse.redirect(redirectTo)

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url))
  }

  // IMPORTANT: pass the response so Supabase can set cookies
  const s = supabaseWithResponse(res)
  const { error } = await s.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=exchange_failed', req.url))
  }

  return res
}