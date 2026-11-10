-- CIVILVERSE Phase 1 foundation. Review against the target Supabase project before applying.
-- Existing quiz/resources tables are intentionally left untouched.

alter table if exists public.profiles
  add column if not exists full_name text,
  add column if not exists target_exam text default 'UPSC CSE',
  add column if not exists preferred_language text default 'en',
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  exam_id uuid references public.exams(id) on delete set null,
  language text not null default 'en' check (language in ('en','hi','bi')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  lesson_type text not null default 'reading' check (lesson_type in ('video','reading','quiz','live')),
  content jsonb not null default '{}'::jsonb,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(module_id, position)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','paused','revoked')),
  enrolled_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists courses_status_idx on public.courses(status);
create index if not exists course_modules_course_idx on public.course_modules(course_id, position);
create index if not exists lessons_module_idx on public.lessons(module_id, position);
create index if not exists enrollments_user_idx on public.enrollments(user_id, status);
create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id, updated_at desc);

alter table public.exams enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- Publicly readable catalogue only exposes published courses and their published lessons.
drop policy if exists "active exams are readable" on public.exams;
create policy "active exams are readable" on public.exams for select using (is_active = true);
drop policy if exists "published courses are readable" on public.courses;
create policy "published courses are readable" on public.courses for select using (status = 'published');
drop policy if exists "modules of published courses are readable" on public.course_modules;
create policy "modules of published courses are readable" on public.course_modules for select using (
  exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
);
drop policy if exists "published lessons are readable" on public.lessons;
create policy "published lessons are readable" on public.lessons for select using (
  is_published = true and exists (
    select 1 from public.course_modules m join public.courses c on c.id = m.course_id
    where m.id = module_id and c.status = 'published'
  )
);
drop policy if exists "students read own enrollments" on public.enrollments;
create policy "students read own enrollments" on public.enrollments for select to authenticated using (auth.uid() = user_id);
drop policy if exists "students read own lesson progress" on public.lesson_progress;
create policy "students read own lesson progress" on public.lesson_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "students insert own lesson progress" on public.lesson_progress;
create policy "students insert own lesson progress" on public.lesson_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "students update own lesson progress" on public.lesson_progress;
create policy "students update own lesson progress" on public.lesson_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
