-- ============================================================
-- 0004_storage_setup.sql — ตั้งค่า Storage bucket สำหรับรูปห้องพัก
-- หมายเหตุ: บาง Supabase project ต้องสร้าง bucket ผ่าน Dashboard > Storage แทน
-- (SQL นี้ใช้ได้กับ Supabase ที่เปิดสิทธิ์แก้ไข storage.buckets ผ่าน SQL Editor)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do nothing;

-- อนุญาตให้ทุกคนดูรูปได้ (bucket public)
create policy "public read room-images"
on storage.objects for select
using (bucket_id = 'room-images');

-- อัปโหลด/แก้ไข/ลบ ได้เฉพาะแอดมินเท่านั้น
create policy "admin upload room-images"
on storage.objects for insert
with check (bucket_id = 'room-images' and is_admin());

create policy "admin update room-images"
on storage.objects for update
using (bucket_id = 'room-images' and is_admin());

create policy "admin delete room-images"
on storage.objects for delete
using (bucket_id = 'room-images' and is_admin());
