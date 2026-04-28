create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum (
      'draft',
      'pending',
      'approved',
      'scheduled',
      'published',
      'failed'
    );
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  account_name text,
  account_id text,
  access_token text,
  refresh_token text,
  expires_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.ecommerce_stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  store_name text,
  api_key text,
  api_secret text,
  access_token text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.content_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text,
  media_urls text[],
  platform text,
  scheduled_at timestamp,
  status public.content_status default 'draft',
  retry_count int default 0,
  error_message text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.ai_generation_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text,
  response text,
  status text,
  error_message text,
  created_at timestamp default now()
);

create index if not exists idx_content_queue_user_id on public.content_queue(user_id);
create index if not exists idx_content_queue_status on public.content_queue(status);
create index if not exists idx_content_queue_scheduled_at on public.content_queue(scheduled_at);
create index if not exists idx_social_accounts_user_id on public.social_accounts(user_id);
create index if not exists idx_ecommerce_user_id on public.ecommerce_stores(user_id);
create index if not exists idx_ai_log_user_id on public.ai_generation_log(user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_social_accounts on public.social_accounts;
create trigger set_updated_at_social_accounts
before update on public.social_accounts
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_ecommerce on public.ecommerce_stores;
create trigger set_updated_at_ecommerce
before update on public.ecommerce_stores
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_content_queue on public.content_queue;
create trigger set_updated_at_content_queue
before update on public.content_queue
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.social_accounts enable row level security;
alter table public.ecommerce_stores enable row level security;
alter table public.content_queue enable row level security;
alter table public.ai_generation_log enable row level security;

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can manage their content" on public.content_queue;
create policy "Users can manage their content"
on public.content_queue for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their social accounts" on public.social_accounts;
create policy "Users can manage their social accounts"
on public.social_accounts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their stores" on public.ecommerce_stores;
create policy "Users can manage their stores"
on public.ecommerce_stores for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their AI logs" on public.ai_generation_log;
create policy "Users can manage their AI logs"
on public.ai_generation_log for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
