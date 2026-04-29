-- =========================
-- EXTENSIONS
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- ENUMS
-- =========================
create type content_status as enum (
  'draft',
  'pending',
  'approved',
  'scheduled',
  'published',
  'failed'
);

-- =========================
-- PROFILES (extend auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- SOCIAL ACCOUNTS
-- =========================
create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  provider text not null, -- facebook, instagram
  account_name text,
  account_id text,

  access_token text,
  refresh_token text,
  expires_at timestamp,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- ECOMMERCE STORES
-- =========================
create table if not exists public.ecommerce_stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  platform text not null, -- shopify, woocommerce
  store_name text,

  api_key text,
  api_secret text,
  access_token text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- CONTENT QUEUE (CORE)
-- =========================
create table if not exists public.content_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  content text,
  media_urls text[],

  platform text, -- facebook, instagram
  scheduled_at timestamp,

  status content_status default 'draft',

  retry_count int default 0,
  error_message text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- AI GENERATION LOG
-- =========================
create table if not exists public.ai_generation_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  prompt text,
  response text,

  status text, -- success, error
  error_message text,

  created_at timestamp default now()
);

-- =========================
-- INDEXES (performance)
-- =========================
create index if not exists idx_content_queue_user_id on content_queue(user_id);
create index if not exists idx_content_queue_status on content_queue(status);
create index if not exists idx_content_queue_scheduled_at on content_queue(scheduled_at);

create index if not exists idx_social_accounts_user_id on social_accounts(user_id);
create index if not exists idx_ecommerce_user_id on ecommerce_stores(user_id);
create index if not exists idx_ai_log_user_id on ai_generation_log(user_id);

-- =========================
-- UPDATED_AT TRIGGER
-- =========================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
before update on profiles
for each row execute procedure handle_updated_at();

create trigger set_updated_at_social_accounts
before update on social_accounts
for each row execute procedure handle_updated_at();

create trigger set_updated_at_ecommerce
before update on ecommerce_stores
for each row execute procedure handle_updated_at();

create trigger set_updated_at_content_queue
before update on content_queue
for each row execute procedure handle_updated_at();

-- =========================
-- ENABLE RLS
-- =========================
alter table profiles enable row level security;
alter table social_accounts enable row level security;
alter table ecommerce_stores enable row level security;
alter table content_queue enable row level security;
alter table ai_generation_log enable row level security;

-- =========================
-- RLS POLICIES
-- =========================

-- PROFILES
create policy "Users can view their profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update their profile"
on profiles for update
using (auth.uid() = id);

-- CONTENT QUEUE
create policy "Users can manage their content"
on content_queue
for all
using (auth.uid() = user_id);

-- SOCIAL ACCOUNTS
create policy "Users can manage their social accounts"
on social_accounts
for all
using (auth.uid() = user_id);

-- ECOMMERCE STORES
create policy "Users can manage their stores"
on ecommerce_stores
for all
using (auth.uid() = user_id);

-- AI LOG
create policy "Users can view their AI logs"
on ai_generation_log
for all
using (auth.uid() = user_id);

-- =========================
-- AUTO CREATE PROFILE
-- =========================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();