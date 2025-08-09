import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import ProjectsModule from './components/ProjectsModule';
import Header from './components/Header';

export default async function ProjectsPage() {
  const s = supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect('/login');

  const { data: projects, error } = await s
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;

  return (
    <>
      <Header title="Projects" />
      <main className="overflow-y-auto h-[calc(100vh-73px)]">
        <ProjectsModule initialProjects={projects || []} />
      </main>
    </>
  );
}

export const dynamic = 'force-dynamic';