create type if not exists shorts_status as enum ('queued','processing','done','failed');

create table if not exists shorts_queue (
  id uuid default gen_random_uuid() primary key,
  topic text not null,
  locale text default 'US',
  variant text default 'A',
  status shorts_status default 'queued',
  scheduled_at timestamp with time zone,
  payload jsonb,
  result jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists shorts_queue_status_idx on shorts_queue(status);
create index if not exists shorts_queue_created_idx on shorts_queue(created_at);

