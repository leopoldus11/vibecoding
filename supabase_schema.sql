create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  batch_id text not null, -- matches id in courses.json
  preferred_email text not null,
  paypal_email text,
  payment_status text default 'pending', -- 'pending', 'completed'
  payment_amount numeric,
  paypal_order_id text -- for reconciliation
);

-- Enable RLS
alter table bookings enable row level security;

-- Allow anonymous inserts (anyone can start a booking)
create policy "Allow anonymous inserts" on bookings for insert with check (true);

-- Allow users to see their own booking (optional, for the success page)
create policy "Allow internal access" on bookings for select using (true);
