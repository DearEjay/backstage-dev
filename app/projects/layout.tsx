import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Navigation from './components/Navigation';

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}