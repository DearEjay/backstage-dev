// app/auth/signout/route.ts
import { NextResponse } from 'next/server'
import { supabaseWithResponse } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url))
  const s = supabaseWithResponse(res)
  await s.auth.signOut()
  return res
}