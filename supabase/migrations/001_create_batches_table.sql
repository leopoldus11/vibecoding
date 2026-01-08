-- Migration: Create batches table for dynamic course management
-- This replaces the static courses.json file

create table if not exists batches (
  id text primary key,
  topic text not null,
  date text not null,
  time_slots text not null,
  sessions jsonb not null default '[]',
  max_seats integer not null default 6,
  is_active boolean not null default true,
  price numeric not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table batches enable row level security;

-- Allow public read access (courses are public info)
create policy "Allow public read" on batches for select using (true);

-- Create updated_at trigger
create or replace function update_batches_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger batches_updated_at
  before update on batches
  for each row execute function update_batches_updated_at();
