-- Schema for CADENCE v2 (Supabase Postgres)
create extension if not exists pgcrypto with schema public;

-- Users table (handled by Supabase auth, but we'll add a profiles table for extended user data)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  role text check (role in ('artist','manager','producer','engineer')) not null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text check (type in ('single','ep','album')) not null,
  status text check (status in ('not_released','released')) not null,
  image_url text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  due_date date,
  release_date date,
  phase text check (phase in ('pre_production','recording','mixing','mastering','marketing')) default 'pre_production',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project members table
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text check (role in ('owner','collaborator')) not null,
  joined_at timestamptz default now(),
  unique(project_id, user_id)
);

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  assignee_id uuid references auth.users(id) on delete set null,
  status text check (status in ('todo','in_progress','pending','completed')) default 'todo',
  priority text check (priority in ('low','medium','high')) default 'medium',
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  date date not null,
  time time,
  type text check (type in ('recording','production','creative','release')) not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Contracts table
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  type text not null,
  status text check (status in ('draft','pending','signed')) default 'draft',
  signers jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

-- Activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  description text not null,
  created_at timestamptz default now()
);

-- Objectives table
create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  target_date date,
  status text check (status in ('active','completed')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Key results table
create table if not exists public.key_results (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid not null references public.objectives(id) on delete cascade,
  description text not null,
  target_value decimal(10,2) not null check (target_value > 0),
  current_value decimal(10,2) default 0 check (current_value >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project templates table
create table if not exists public.project_templates (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('single','ep','album')) not null,
  status text check (status in ('not_released','released')) not null,
  template_tasks jsonb not null,
  template_contracts jsonb not null,
  created_at timestamptz default now(),
  unique(type, status)
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger handle_tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

create trigger handle_contracts_updated_at
  before update on public.contracts
  for each row execute function public.handle_updated_at();

create trigger handle_objectives_updated_at
  before update on public.objectives
  for each row execute function public.handle_updated_at();

create trigger handle_key_results_updated_at
  before update on public.key_results
  for each row execute function public.handle_updated_at();