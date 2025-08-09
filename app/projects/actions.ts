'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'

export async function createProject(formData: FormData) {
  // 1) Auth
  const s = supabaseServer()
  const { data: { user } } = await s.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // 2) Read + validate fields
  const title  = (formData.get('title')  as string | null)?.toString().trim() ?? ''
  const type   = (formData.get('type')   as string | null)?.toString().trim() || 'single'
  const status = (formData.get('status') as string | null)?.toString().trim() || 'not_released'
  if (!title) throw new Error('Title required')

  // 3) Insert project (matches your schema)
  const { data: project, error } = await s
    .from('projects')
    .insert({ title, type, status, owner_id: user.id })
    .select('id')
    .single()
  if (error) throw error

  // 4) Add creator as owner to project_members
  const { error: memErr } = await s
    .from('project_members')
    .insert({ project_id: project.id, user_id: user.id, role: 'owner' })
  if (memErr) throw memErr

  // 5) Refresh the /projects page so the new project shows up
  revalidatePath('/projects')

  // No redirect → this returns 200 OK to the client
  return { success: true, projectId: project.id }
}