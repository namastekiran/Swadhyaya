-- Run this in your Supabase Dashboard > SQL Editor
-- This creates the tables needed for Swadhyaya

-- 1. User progress per topic
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id text not null,
  current_section integer default 1,
  completed_sections integer[] default '{}',
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);

-- 2. Section answers (reflections, practice, journal, AI chats)
create table if not exists section_answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id text not null,
  section_num integer not null,
  reflections jsonb default '[]',
  practice_answer text,
  journal_entry text,
  completed_steps text[] default '{}',
  saved_chats jsonb default '[]',
  updated_at timestamptz default now(),
  unique(user_id, topic_id, section_num)
);

-- 3. Enable Row Level Security
alter table user_progress enable row level security;
alter table section_answers enable row level security;

-- 4. RLS Policies: users can only access their own data
create policy "Users can read own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress for update
  using (auth.uid() = user_id);

create policy "Users can read own answers"
  on section_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own answers"
  on section_answers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own answers"
  on section_answers for update
  using (auth.uid() = user_id);
