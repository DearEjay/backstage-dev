import { createProject } from './actions'
import ProjectForm from './ProjectForm'
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export default async function ProjectsPage() {
  const s = supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect('/login');

  const { data: projects, error } = await s.from('projects').select('id,title,created_at').order('created_at', { ascending: false });
  if (error) throw error;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Your Projects</h1>
      < ProjectForm />
      <ul className="space-y-2">
        {(projects ?? []).map(p => (
          <li key={p.id} className="rounded border bg-white p-3">{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
export const dynamic = 'force-dynamic'
