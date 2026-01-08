-- Migration: Seed initial batch data from courses.json

insert into batches (id, topic, date, time_slots, sessions, max_seats, is_active, price)
values
  (
    'batch-001',
    'AI Agent Fundamentals',
    'January 20 & January 21',
    '12pm - 3pm CET',
    '[{"start": "20260120T110000Z", "end": "20260120T140000Z"}, {"start": "20260121T110000Z", "end": "20260121T140000Z"}]'::jsonb,
    6,
    true,
    200
  ),
  (
    'batch-002',
    'SaaS Builder Intensive',
    'January 27 & January 28',
    '12pm - 5pm CET',
    '[{"start": "20260127T110000Z", "end": "20260127T160000Z"}, {"start": "20260128T110000Z", "end": "20260128T160000Z"}]'::jsonb,
    6,
    true,
    333
  ),
  (
    'batch-003',
    'Modern UI/UX with AI',
    'February 10 & February 11',
    '12pm - 3pm CET',
    '[{"start": "20260210T110000Z", "end": "20260210T140000Z"}, {"start": "20260211T110000Z", "end": "20260211T140000Z"}]'::jsonb,
    6,
    true,
    333
  ),
  (
    'batch-test',
    'Vibe Integration Test',
    'Instant Access',
    'N/A',
    '[]'::jsonb,
    999,
    true,
    1
  )
on conflict (id) do nothing;
