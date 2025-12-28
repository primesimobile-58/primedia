create table if not exists oauth_tokens (
  id bigint generated always as identity primary key,
  provider text not null,
  refresh_token text not null,
  created_at timestamp with time zone default now()
);

create index if not exists oauth_tokens_provider_idx on oauth_tokens(provider);

