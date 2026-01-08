-- Migration: Add seat locking mechanism to prevent overbooking
-- Implements 10-minute TTL seat locks when user clicks "Secure Your Seat"

-- Add seat lock columns to existing bookings table
alter table bookings
  add column if not exists seat_locked_at timestamptz,
  add column if not exists seat_lock_expires_at timestamptz;

-- Create index for efficient lock queries
create index if not exists idx_bookings_seat_lock
  on bookings (batch_id, seat_lock_expires_at)
  where payment_status = 'pending';

-- Function to count "effectively taken" seats (completed + actively locked)
create or replace function get_locked_seat_count(p_batch_id text)
returns integer as $$
declare
  completed_count integer;
  locked_count integer;
begin
  -- Count completed bookings
  select count(*) into completed_count
  from bookings
  where batch_id = p_batch_id
    and payment_status = 'completed';

  -- Count pending bookings with active lock (not expired)
  select count(*) into locked_count
  from bookings
  where batch_id = p_batch_id
    and payment_status = 'pending'
    and seat_lock_expires_at > now();

  return completed_count + locked_count;
end;
$$ language plpgsql;

-- Create view for real-time seat availability
create or replace view batch_availability as
select
  b.id as batch_id,
  b.topic,
  b.max_seats,
  get_locked_seat_count(b.id) as seats_taken,
  b.max_seats - get_locked_seat_count(b.id) as seats_available
from batches b
where b.is_active = true;
