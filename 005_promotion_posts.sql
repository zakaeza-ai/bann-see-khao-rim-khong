-- ตารางโพสต์โปรโมชั่น (คลิป+ภาพ)
create table if not exists promotion_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  start_date date,
  end_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ไฟล์แนบของแต่ละโพสต์ (คลิป 1 ไฟล์ + ภาพหลายไฟล์)
create table if not exists promotion_post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references promotion_posts(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_promotion_post_media_post_id on promotion_post_media(post_id);