//Homepage that redirects authenticated users to projects page or unauthenticated users to login
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export default async function HomePage() {
  const s = supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  redirect('/projects');
}