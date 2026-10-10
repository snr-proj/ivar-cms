-- ============================================================================
-- Ivar Delos Santos Portfolio — Supabase schema
--
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL
-- Editor → New query → paste → Run). It creates all tables, indexes, and
-- Row Level Security (RLS) policies.
--
-- After this, run seed.sql to load the initial content described in your
-- brief (no invented clients, awards, or credits).
-- ============================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text,
  category text not null check (
    category in ('commercial', 'digital-ooh', 'film', 'photography', 'early-production')
  ),
  project_type text,
  production_company text,
  role text,
  year text,
  description text,
  contributions text[],
  featured boolean not null default false,
  sort_order integer not null default 0,
  cover_image text,
  gallery_images text[],
  video_url text,
  -- Digital OOH-specific fields (nullable; only used when category = 'digital-ooh')
  ooh_format text,
  ooh_location text,
  ooh_original_material text,
  ooh_adapted_material text,
  ooh_live_display_image text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- ----------------------------------------------------------------------------
-- project_media (extra gallery/video assets per project)
-- ----------------------------------------------------------------------------
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  url text not null,
  thumbnail_url text,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_media_project_id_idx on public.project_media (project_id);

-- ----------------------------------------------------------------------------
-- experience
-- ----------------------------------------------------------------------------
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  organization text,
  position text not null,
  start_date date,
  end_date date,
  current boolean not null default false,
  description text,
  responsibilities text[],
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- skills
-- ----------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (
    category in ('Production', 'Digital & LED', 'Camera & Visual', 'Software')
  ),
  name text not null,
  sort_order integer not null default 0
);

-- ----------------------------------------------------------------------------
-- site_settings (single row)
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  professional_title text not null,
  location text not null,
  email text not null,
  phone text,
  bio text,
  linkedin_url text,
  instagram_url text,
  vimeo_url text,
  showreel_url text,
  education jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
--
-- Public (anonymous) visitors may only READ published content — the public
-- site reads straight from Supabase with the anon key, so this is what
-- protects it.
--
-- Admin writes no longer go through the anon key at all: they're proxied
-- through the /api/* Vercel serverless functions (see api/), which use the
-- service_role key (bypasses RLS) and check the caller's Supabase session on
-- every request instead — see api/_lib/auth.ts. The "authenticated users can
-- manage ..." policies below are kept anyway as defense-in-depth, in case
-- anything ever talks to Supabase directly with a signed-in user's token.
-- ============================================================================

alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.site_settings enable row level security;

-- projects: public can read only published rows
create policy "Public can read published projects"
  on public.projects for select
  using (published = true);

create policy "Authenticated users can manage projects"
  on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- project_media: public can read media belonging to a published project
create policy "Public can read media of published projects"
  on public.project_media for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.published = true
    )
  );

create policy "Authenticated users can manage project media"
  on public.project_media for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- experience: public read-all (no "published" flag needed, it's your resume)
create policy "Public can read experience"
  on public.experience for select
  using (true);

create policy "Authenticated users can manage experience"
  on public.experience for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- skills: public read-all
create policy "Public can read skills"
  on public.skills for select
  using (true);

create policy "Authenticated users can manage skills"
  on public.skills for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- site_settings: public read-all
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

create policy "Authenticated users can manage site settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- Keep updated_at fresh automatically
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.projects;
create trigger set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.experience;
create trigger set_updated_at before update on public.experience
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
