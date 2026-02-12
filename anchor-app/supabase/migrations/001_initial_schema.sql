-- ═══════════════════════════════════════════════════════════
-- Anchor — Initial Database Schema
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Entry Type Enum ───
create type entry_type as enum (
  'lesson',
  'idea',
  'milestone',
  'note',
  'resource',
  'bookmark'
);

-- ─── Entries Table ───
create table entries (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  content     text,
  entry_type  entry_type not null default 'note',
  status      text,
  custom_date timestamptz,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived    boolean not null default false
);

-- ─── Tags Table ───
create table tags (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  color      text not null default '#6366f1',
  created_at timestamptz not null default now()
);

-- ─── Entry-Tags Junction Table ───
create table entry_tags (
  entry_id uuid not null references entries(id) on delete cascade,
  tag_id   uuid not null references tags(id) on delete cascade,
  primary key (entry_id, tag_id)
);

-- ─── Entry References Table ───
create table entry_references (
  id            uuid primary key default uuid_generate_v4(),
  from_entry_id uuid not null references entries(id) on delete cascade,
  to_entry_id   uuid not null references entries(id) on delete cascade,
  created_at    timestamptz not null default now(),
  -- Prevent self-references
  constraint no_self_reference check (from_entry_id != to_entry_id),
  -- Prevent duplicate references
  constraint unique_reference unique (from_entry_id, to_entry_id)
);

-- ─── Indexes ───
create index idx_entries_created_at on entries(created_at desc);
create index idx_entries_entry_type on entries(entry_type);
create index idx_entries_archived on entries(archived);
create index idx_entries_updated_at on entries(updated_at desc);
create index idx_entry_tags_entry_id on entry_tags(entry_id);
create index idx_entry_tags_tag_id on entry_tags(tag_id);
create index idx_entry_references_from on entry_references(from_entry_id);
create index idx_entry_references_to on entry_references(to_entry_id);

-- ─── Updated_at Trigger ───
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on entries
  for each row
  execute function update_updated_at_column();
