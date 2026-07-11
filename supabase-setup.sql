create extension if not exists pgcrypto;

create table if not exists public.cmo_ai_maturity_responses (
  id uuid primary key default gen_random_uuid(),
  response_id text not null unique,
  created_at timestamptz not null default now(),
  source text not null default 'github_pages_alpha',
  overall_score integer not null,
  tier text not null,
  base_tier text,
  gates_passed boolean,
  percentile integer,
  dimension_scores jsonb not null default '{}'::jsonb,
  score_payload jsonb not null default '{}'::jsonb,
  benchmark_payload jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  demographics jsonb not null default '{}'::jsonb,
  participant jsonb not null default '{}'::jsonb,
  company_industry text,
  company_revenue text,
  company_acv text,
  company_gtm text,
  company_funding text,
  participant_level text,
  participant_function text,
  participant_email text,
  user_agent text
);

create table if not exists public.cmo_ai_maturity_opt_ins (
  id uuid primary key default gen_random_uuid(),
  response_id text not null,
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  company text,
  opt_benchmark_report boolean not null default false,
  opt_newsletter boolean not null default false,
  opt_starter boolean not null default false,
  consent_research boolean not null default false,
  overall_score integer,
  tier text,
  participant_level text,
  participant_function text,
  answers jsonb not null default '{}'::jsonb
);

create index if not exists cmo_ai_maturity_responses_response_id_idx
  on public.cmo_ai_maturity_responses (response_id);

create index if not exists cmo_ai_maturity_responses_score_idx
  on public.cmo_ai_maturity_responses (overall_score);

create index if not exists cmo_ai_maturity_responses_segments_idx
  on public.cmo_ai_maturity_responses (company_industry, company_revenue, company_gtm);

create index if not exists cmo_ai_maturity_opt_ins_response_id_idx
  on public.cmo_ai_maturity_opt_ins (response_id);

create index if not exists cmo_ai_maturity_opt_ins_email_idx
  on public.cmo_ai_maturity_opt_ins (email);

alter table public.cmo_ai_maturity_responses enable row level security;
alter table public.cmo_ai_maturity_opt_ins enable row level security;

drop policy if exists "Allow public assessment inserts" on public.cmo_ai_maturity_responses;
create policy "Allow public assessment inserts"
  on public.cmo_ai_maturity_responses
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public opt-in inserts" on public.cmo_ai_maturity_opt_ins;
create policy "Allow public opt-in inserts"
  on public.cmo_ai_maturity_opt_ins
  for insert
  to anon, authenticated
  with check (true);
