create table if not exists hero_videos (
  id uuid primary key default gen_random_uuid(),
  slot integer not null unique check (slot in (1, 2)),
  title text not null,
  video_url text,
  poster_url text,
  updated_at timestamptz not null default now()
);

-- เตรียม 2 แถวไว้ล่วงหน้า (slot 1 = ห้องพักทั้งหมด, slot 2 = ที่ท่องเที่ยวแนะนำ)
insert into hero_videos (slot, title)
values
  (1, 'ห้องพักทั้งหมด'),
  (2, 'ที่ท่องเที่ยวแนะนำ')
on conflict (slot) do nothing;