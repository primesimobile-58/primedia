create table if not exists secrets (
  id bigint generated always as identity primary key,
  name text not null unique,
  value_encrypted jsonb not null,
  created_at timestamp with time zone default now()
);

