-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.contracts enable row level security;
alter table public.chat_messages enable row level security;
alter table public.activities enable row level security;
alter table public.objectives enable row level security;
alter table public.key_results enable row level security;
alter table public.project_templates enable row level security;

-- Helper function to check if user is a project member
create or replace function public.is_project_member(p uuid) returns boolean
language sql stable security definer as $$
  select exists(
    select 1 from public.project_members pm
    where pm.project_id = p and pm.user_id = auth.uid()
  ) or exists(
    select 1 from public.projects pr
    where pr.id = p and pr.owner_id = auth.uid()
  );
$$;

-- Helper function to check if user is project owner
create or replace function public.is_project_owner(p uuid) returns boolean
language sql stable security definer as $$
  select exists(
    select 1 from public.projects pr
    where pr.id = p and pr.owner_id = auth.uid()
  );
$$;

grant usage on schema public to anon, authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
grant execute on function public.is_project_owner(uuid) to authenticated;

-- User profiles policies
create policy user_profiles_read on public.user_profiles
  for select using (true); -- Users can read all profiles for collaboration

create policy user_profiles_write on public.user_profiles
  for all using (id = auth.uid())
  with check (id = auth.uid());

-- Projects policies
create policy projects_read on public.projects
  for select using (public.is_project_member(id));

create policy projects_write on public.projects
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Project members policies
create policy project_members_read on public.project_members
  for select using (public.is_project_member(project_id));

create policy project_members_write on public.project_members
  for all using (public.is_project_owner(project_id))
  with check (public.is_project_owner(project_id));

-- Tasks policies
create policy tasks_read on public.tasks
  for select using (public.is_project_member(project_id));

create policy tasks_write on public.tasks
  for all using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- Events policies
create policy events_read on public.events
  for select using (public.is_project_member(project_id));

create policy events_write on public.events
  for all using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- Contracts policies
create policy contracts_read on public.contracts
  for select using (public.is_project_member(project_id));

create policy contracts_write on public.contracts
  for all using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- Chat messages policies
create policy chat_messages_read on public.chat_messages
  for select using (public.is_project_member(project_id));

create policy chat_messages_write on public.chat_messages
  for insert with check (
    public.is_project_member(project_id) and sender_id = auth.uid()
  );

-- Activities policies
create policy activities_read on public.activities
  for select using (public.is_project_member(project_id));

create policy activities_write on public.activities
  for insert with check (
    public.is_project_member(project_id) and user_id = auth.uid()
  );

-- Objectives policies
create policy objectives_read on public.objectives
  for select using (public.is_project_member(project_id));

create policy objectives_write on public.objectives
  for all using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- Key results policies
create policy key_results_read on public.key_results
  for select using (
    exists(
      select 1 from public.objectives o
      where o.id = objective_id and public.is_project_member(o.project_id)
    )
  );

create policy key_results_write on public.key_results
  for all using (
    exists(
      select 1 from public.objectives o
      where o.id = objective_id and public.is_project_member(o.project_id)
    )
  )
  with check (
    exists(
      select 1 from public.objectives o
      where o.id = objective_id and public.is_project_member(o.project_id)
    )
  );

-- Project templates policies (read-only for all authenticated users)
create policy project_templates_read on public.project_templates
  for select using (auth.role() = 'authenticated');

create policy project_templates_write on public.project_templates
  for all using (false); -- Only allow through application logic/admin functions