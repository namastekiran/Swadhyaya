-- Run this in your Supabase Dashboard > SQL Editor
-- ⚠️  If you ran the old schema, drop old tables first:
--   DROP TABLE IF EXISTS section_answers;
--   DROP TABLE IF EXISTS user_progress;

-- 1. User progress per topic (no auth required, uses device_id)
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  device_id text not null,
  topic_id text not null,
  current_section integer default 1,
  completed_sections integer[] default '{}',
  updated_at timestamptz default now(),
  unique(device_id, topic_id)
);

-- 2. Section answers (reflections, practice, journal, AI chats)
create table if not exists section_answers (
  id uuid default gen_random_uuid() primary key,
  device_id text not null,
  topic_id text not null,
  section_num integer not null,
  reflections jsonb default '[]',
  practice_answer text,
  journal_entry text,
  completed_steps text[] default '{}',
  saved_chats jsonb default '[]',
  updated_at timestamptz default now(),
  unique(device_id, topic_id, section_num)
);

-- 3. Disable RLS (no auth, public access via anon key)
alter table user_progress disable row level security;
alter table section_answers disable row level security;
