-- ============================================================
-- 0002_rls_policies.sql
-- Row Level Security: หน้าเว็บ (public) อ่านได้อย่างเดียว, แก้ไขได้เฉพาะ admin
-- ============================================================

alter table rooms enable row level security;
alter table room_images enable row level security;
alter table amenities enable row level security;
alter table room_amenities enable row level security;
alter table price_periods enable row level security;
alter table bookings enable row level security;
alter table coupons enable row level security;
alter table reviews enable row level security;
alter table attractions enable row level security;
alter table admin_users enable row level security;

-- Helper: เช็คว่า user ปัจจุบันเป็น admin/staff หรือไม่
create or replace function is_admin()
returns boolean as $$
    select exists (
        select 1 from admin_users where auth_user_id = auth.uid()
    );
$$ language sql stable security definer;

-- ---------- PUBLIC READ (ลูกค้าดูหน้าเว็บ) ----------
create policy "public read rooms" on rooms for select using (status = 'available' or is_admin());
create policy "public read room_images" on room_images for select using (true);
create policy "public read amenities" on amenities for select using (true);
create policy "public read room_amenities" on room_amenities for select using (true);
create policy "public read price_periods" on price_periods for select using (true);
create policy "public read approved reviews" on reviews for select using (is_approved = true or is_admin());
create policy "public read attractions" on attractions for select using (true);
create policy "public read active coupons check" on coupons for select using (is_admin()); -- coupon ตรวจผ่าน Edge Function เท่านั้น ไม่ให้ query ตรงจากหน้าเว็บ

-- ปฏิทินห้องว่าง: ฝั่งลูกค้าเห็นแค่ room_id + ช่วงวันที่ถูกจอง (ไม่เห็นชื่อ/เบอร์ผู้เข้าพัก) -> ทำผ่าน VIEW ด้านล่าง
create policy "admin full access bookings" on bookings for all using (is_admin()) with check (is_admin());

create view public_booked_dates as
    select room_id, check_in, check_out
    from bookings
    where status <> 'cancelled';

grant select on public_booked_dates to anon, authenticated;

-- ---------- ADMIN ONLY (เขียน/แก้ไข/ลบ) ----------
create policy "admin write rooms" on rooms for insert with check (is_admin());
create policy "admin update rooms" on rooms for update using (is_admin()) with check (is_admin());
create policy "admin delete rooms" on rooms for delete using (is_admin());

create policy "admin all room_images" on room_images for all using (is_admin()) with check (is_admin());
create policy "admin all amenities" on amenities for all using (is_admin()) with check (is_admin());
create policy "admin all room_amenities" on room_amenities for all using (is_admin()) with check (is_admin());
create policy "admin all price_periods" on price_periods for all using (is_admin()) with check (is_admin());
create policy "admin all coupons" on coupons for all using (is_admin()) with check (is_admin());
create policy "admin all reviews" on reviews for all using (is_admin()) with check (is_admin());
create policy "admin all attractions" on attractions for all using (is_admin()) with check (is_admin());
create policy "admin read admin_users" on admin_users for select using (is_admin());

-- อนุญาตให้ลูกค้าส่งรีวิวได้ (แต่ต้องรออนุมัติ)
create policy "anyone can submit review" on reviews for insert with check (is_approved = false);
