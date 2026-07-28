# บ้านสีขาวริมโขง ธาตุพนม — Resort Booking Website

Next.js 14 (App Router) + TailwindCSS + Supabase

## โครงสร้างโปรเจกต์ (จนถึงเฟส 2)

```
baan-see-khao-rim-khong/
├── app/
│   ├── (public)/          # หน้าเว็บลูกค้า: home, rooms, promotions, attractions, reviews, contact
│   ├── admin/              # หน้าแอดมิน: login, bookings, rooms, pricing, promotions, reports
│   ├── api/                 # Route handlers (ถ้าจำเป็น)
│   ├── layout.tsx           # Root layout: font ไทย, ThemeProvider (dark mode)
│   └── globals.css
├── components/
│   ├── public/               # Navbar, Footer, LineBookingButton ฯลฯ
│   ├── admin/                 # (จะเพิ่มเฟส 5)
│   └── ui/                     # ปุ่ม, การ์ด, skeleton ฯลฯ (จะเพิ่มเฟส 3)
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client ฝั่ง browser
│   │   └── server.ts          # Supabase client ฝั่ง server + service role
│   └── utils/
│       ├── cn.ts                # รวม Tailwind class
│       └── pricing.ts           # คำนวณราคาห้องตามวันที่/ช่วงเทศกาล
├── types/database.ts          # Type ตรงกับ schema ฐานข้อมูล
├── middleware.ts               # ป้องกันเส้นทาง /admin ต้อง login ก่อน
├── supabase/migrations/        # SQL schema, RLS, seed data (เฟส 1)
└── docs/ER_DIAGRAM.md
```

## วิธีติดตั้ง (Local Development)

1. ติดตั้ง dependencies
   ```bash
   npm install
   ```

2. สร้างโปรเจกต์ Supabase ใหม่ที่ https://supabase.com/dashboard

3. รัน SQL migration ตามลำดับใน **SQL Editor** ของ Supabase:
   - `supabase/migrations/0001_init_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_seed_data.sql` (ข้อมูลตัวอย่าง ลบได้ก่อนใช้งานจริง)
   - `supabase/migrations/0004_storage_setup.sql` (สร้าง Storage bucket `room-images` อัตโนมัติ ถ้ารันไม่ผ่านให้สร้างด้วยมือตามข้อ 4 ด้านล่าง)

   หรือถ้าติดตั้ง Supabase CLI แล้วสามารถรัน:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

4. สร้าง Storage bucket ชื่อ `room-images` (Public bucket) ใน Supabase Dashboard > Storage
   สำหรับเก็บรูปห้องพักที่อัปโหลดจากหน้าแอดมิน

5. สร้างบัญชีแอดมินคนแรก:
   - ไปที่ Supabase Dashboard > Authentication > Users > Add user (กรอกอีเมล/รหัสผ่าน)
   - คัดลอก User UID ที่ได้
   - ไปที่ SQL Editor รัน:
     ```sql
     insert into admin_users (auth_user_id, full_name, role)
     values ('วาง-UID-ที่คัดลอกมา', 'ชื่อแอดมิน', 'admin');
     ```

6. คัดลอก `.env.example` เป็น `.env.local` แล้วกรอกค่าจาก Supabase Dashboard > Project Settings > API

7. รันเซิร์ฟเวอร์:
   ```bash
   npm run dev
   ```
   เปิด http://localhost:3000

## วิธี Deploy จริง (Vercel)

1. Push โค้ดขึ้น GitHub repository
2. ไปที่ https://vercel.com/new แล้วเลือก import repository นี้
3. ในหน้า Configure Project ใส่ Environment Variables ให้ตรงกับ `.env.example`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_LINE_OA_URL`, `NEXT_PUBLIC_CONTACT_PHONE`)
4. กด Deploy — Vercel จะ build และให้โดเมน `.vercel.app` มาใช้งานได้ทันที
5. (ถ้ามีโดเมนของตัวเอง) ไปที่ Project Settings > Domains เพื่อผูกโดเมน เช่น `baansikhaorimkhong.com`

## สถานะความคืบหน้า

- [x] เฟส 1: Database Schema + RLS + ER Diagram
- [x] เฟส 2: Project Scaffold (Next.js + Tailwind + Supabase client + Navbar/Footer + Home เบื้องต้น)
- [x] เฟส 3: หน้าเว็บสาธารณะทั้งหมด (ห้องพัก, โปรโมชั่น, สถานที่ท่องเที่ยว, รีวิว, ติดต่อเรา)
- [x] เฟส 4: ระบบปฏิทินเช็กห้องว่างอัตโนมัติ + ส่งข้อความวันที่ไป LINE
- [x] เฟส 5: Admin Dashboard (login, จัดการห้อง/ราคา/โปรโมชั่น/การจอง — search, edit, cancel, เปลี่ยนห้อง, check in/out)
- [x] เฟส 6: Reports (Occupancy Rate รายวัน, Top Room, Export Excel, Export PDF)
- [x] เฟส 7: Polish (error boundaries, 404, loading skeleton ครบทุกหน้าหลัก, ตรวจสอบ dark mode, เอกสารอธิบายทุกไฟล์ที่ `docs/FILES.md`)

โปรเจกต์เสร็จสมบูรณ์ครบทั้ง 7 เฟสแล้ว ✅

## ข้อจำกัดที่ควรทราบ

- **Export PDF ภาษาไทย**: jsPDF ไม่มีฟอนต์ไทยในตัว ต้อง embed ฟอนต์ (เช่น Noto Sans Thai) เองก่อนใช้งานจริง มิฉะนั้นข้อความไทยในไฟล์ PDF อาจแสดงผลผิดเพี้ยน (ดูคอมเมนต์ใน `lib/utils/export.ts`) — Export Excel ไม่มีปัญหานี้เพราะใช้ฟอนต์ของโปรแกรมเปิดไฟล์เอง
