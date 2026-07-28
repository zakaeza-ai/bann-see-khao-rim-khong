# คำอธิบายไฟล์ทั้งหมดในโปรเจกต์

เอกสารนี้อธิบายหน้าที่ของทุกไฟล์ในโปรเจกต์ เรียงตามโฟลเดอร์

---

## Config ระดับ Root

| ไฟล์ | หน้าที่ |
|---|---|
| `package.json` | รายการ dependencies ทั้งหมด (Next.js, Supabase, Tailwind, react-day-picker, xlsx, jspdf, recharts ฯลฯ) และคำสั่ง `dev`/`build`/`start` |
| `tsconfig.json` | ตั้งค่า TypeScript compiler และ path alias `@/*` ให้ชี้ไปที่ root โปรเจกต์ |
| `tailwind.config.ts` | กำหนดโทนสี (ขาว/ฟ้าอ่อน/น้ำเงิน = river, ทอง = gold), animation (`fade-up`, `shimmer`), border radius และ shadow ของธีมรีสอร์ท |
| `postcss.config.js` | ตั้งค่า PostCSS ให้ใช้ Tailwind และ autoprefixer |
| `next.config.js` | อนุญาต Next/Image ให้โหลดรูปจากโดเมน Supabase Storage (`*.supabase.co`) |
| `.env.example` | ตัวแปรสภาพแวดล้อมที่ต้องตั้งค่า (Supabase URL/keys, LINE OA URL/ID, เบอร์โทร) — คัดลอกเป็น `.env.local` |
| `.gitignore` | ไฟล์/โฟลเดอร์ที่ไม่ต้อง commit เช่น `node_modules`, `.env.local`, `.next` |
| `middleware.ts` | ป้องกันทุก route ใต้ `/admin` ไม่ให้เข้าถึงได้ถ้ายังไม่ login (เช็ค Supabase session จาก cookie) |
| `README.md` | คู่มือติดตั้ง, ตั้งค่า Supabase, และ deploy บน Vercel |

---

## `supabase/migrations/` — ฐานข้อมูล

| ไฟล์ | หน้าที่ |
|---|---|
| `0001_init_schema.sql` | สร้างตารางหลักทั้งหมด (rooms, room_images, amenities, room_amenities, price_periods, admin_users, coupons, bookings, reviews, attractions) พร้อม exclusion constraint กัน Double Booking/Overbooking ระดับฐานข้อมูล และ trigger อัปเดต `updated_at` อัตโนมัติ |
| `0002_rls_policies.sql` | เปิด Row Level Security ทุกตาราง กำหนดสิทธิ์: คนทั่วไปอ่านได้เฉพาะข้อมูลที่เผยแพร่ (ห้องที่เปิดขาย, รีวิวที่อนุมัติแล้ว), แก้ไข/ลบได้เฉพาะแอดมิน (ผ่านฟังก์ชัน `is_admin()`), และสร้าง view `public_booked_dates` ที่ซ่อนข้อมูลลูกค้าไว้ ใช้แสดงปฏิทินฝั่งเว็บ |
| `0003_seed_data.sql` | ข้อมูลตัวอย่างสำหรับทดสอบ (3 ห้อง, สิ่งอำนวยความสะดวก, สถานที่ท่องเที่ยว, คูปอง) — ลบทิ้งได้ก่อนใช้งานจริง |
| `0004_storage_setup.sql` | สร้าง Storage bucket `room-images` แบบ public พร้อม policy ให้ทุกคนดูรูปได้ แต่อัปโหลด/แก้ไข/ลบได้เฉพาะแอดมิน |

## `docs/`

| ไฟล์ | หน้าที่ |
|---|---|
| `ER_DIAGRAM.md` | แผนภาพความสัมพันธ์ตารางทั้งหมด (Mermaid ER diagram) พร้อมคำอธิบายแต่ละตาราง |

---

## `types/`

| ไฟล์ | หน้าที่ |
|---|---|
| `database.ts` | TypeScript type ของทุกตารางในฐานข้อมูล ตรงกับ schema ในไฟล์ migration ใช้กับ Supabase client เพื่อให้ autocomplete และ type-safety ทั้งโปรเจกต์ |

---

## `lib/supabase/` — การเชื่อมต่อฐานข้อมูล

| ไฟล์ | หน้าที่ |
|---|---|
| `client.ts` | สร้าง Supabase client สำหรับใช้ใน Client Component (`"use client"`) ใช้ anon key ที่ถูกจำกัดสิทธิ์ด้วย RLS |
| `server.ts` | สร้าง Supabase client สำหรับ Server Component/Route Handler (ผูกกับ cookie session ของผู้ใช้) และ `createServiceRoleClient()` สำหรับงานที่ต้องข้าม RLS (ใช้อย่างระมัดระวัง เฉพาะฝั่ง server) |

## `lib/data/` — ฟังก์ชันดึงข้อมูล (อ่านอย่างเดียว)

| ไฟล์ | หน้าที่ |
|---|---|
| `rooms.ts` | ดึงห้องพักทั้งหมดที่เปิดขาย หรือดึงห้องเดียวตาม id พร้อมแนบรูปภาพและสิ่งอำนวยความสะดวก |
| `bookings.ts` | ดึงช่วงวันที่ถูกจองแล้วของห้องหนึ่ง (จาก view ที่ไม่เปิดเผยข้อมูลลูกค้า) ใช้กับปฏิทิน |
| `content.ts` | ดึงโปรโมชั่นที่ยังไม่หมดอายุ, สถานที่ท่องเที่ยว, และรีวิวที่อนุมัติแล้ว |
| `reports.ts` | คำนวณสถิติ Occupancy Rate รายวันทั้งเดือน และจัดอันดับ Top Room จากข้อมูลการจองจริง |

## `lib/actions/` — Server Actions (เขียน/แก้ไขข้อมูล เรียกจากฟอร์ม)

| ไฟล์ | หน้าที่ |
|---|---|
| `auth.ts` | `signInAction` (login แอดมิน), `signOutAction` (logout) |
| `rooms.ts` | `saveRoomAction` (เพิ่ม/แก้ไขห้อง พร้อม validation และกันรหัสซ้ำ), `deleteRoomAction`, `uploadRoomImagesAction` (อัปโหลดหลายรูปไป Storage), `deleteRoomImageAction`, `setCoverImageAction` |
| `pricing.ts` | `addPricePeriodAction` (เพิ่มช่วงราคาพิเศษ พร้อม validation วันที่/ราคา), `deletePricePeriodAction` |
| `promotions.ts` | `addCouponAction` (สร้างคูปอง พร้อมกันโค้ดซ้ำ), `toggleCouponAction` (เปิด/ปิดใช้งาน), `deleteCouponAction` |
| `bookings.ts` | `createBookingAction` (บันทึกการจองจาก LINE เข้าระบบ — จับ error กัน Overbooking จาก DB constraint), `updateBookingAction` (แก้ไข/เปลี่ยนห้อง/เปลี่ยนวันที่), `cancelBookingAction`, `checkInAction`, `checkOutAction` |

## `lib/utils/`

| ไฟล์ | หน้าที่ |
|---|---|
| `cn.ts` | รวม Tailwind class หลายอันเข้าด้วยกัน พร้อมจัดการ class ที่ขัดแย้งกัน |
| `pricing.ts` | คำนวณราคาห้องต่อคืนตามวันที่ (ลำดับ: ช่วงพิเศษ > weekend > ปกติ) และราคารวมทั้งช่วงพัก + ฟังก์ชัน `formatTHB` |
| `line.ts` | สร้างลิงก์ LINE OA พร้อมข้อความล่วงหน้า (ชื่อห้อง + วันที่ที่เลือก) |
| `export.ts` | Export รายการจองเป็นไฟล์ Excel (.xlsx) และ PDF (โหลดไลบรารีแบบ dynamic import เพื่อลดขนาด bundle) |

---

## `app/layout.tsx`, `app/globals.css`, `app/not-found.tsx`

| ไฟล์ | หน้าที่ |
|---|---|
| `layout.tsx` | Root layout ทั้งเว็บ: โหลดฟอนต์ Noto Sans Thai, ครอบด้วย `ThemeProvider` (dark mode) และ `Toaster` (แจ้งเตือน) |
| `globals.css` | สไตล์พื้นฐาน, ตัวแปรสี light/dark, class `.skeleton` (shimmer loading), `.resort-card` (การ์ดมาตรฐานทั้งเว็บ), สไตล์ปฏิทิน `.resort-daypicker` |
| `not-found.tsx` | หน้า 404 ระดับ root เมื่อเข้า URL ที่ไม่มีอยู่จริง |

## `app/(public)/` — หน้าเว็บลูกค้า

| ไฟล์ | หน้าที่ |
|---|---|
| `layout.tsx` | ครอบทุกหน้าสาธารณะด้วย `Navbar` และ `Footer` |
| `page.tsx` | หน้า Home: Hero section + ห้องพักแนะนำ 3 ห้องแรก + โปรโมชั่นเด่น (ดึงข้อมูลจริงจาก Supabase) |
| `error.tsx` | จับ error ที่เกิดขึ้นในหน้าเว็บฝั่งลูกค้า แสดงปุ่ม "ลองใหม่" |
| `rooms/page.tsx` | รายการห้องพักทั้งหมดที่เปิดขาย |
| `rooms/loading.tsx` | Skeleton loading ระหว่างโหลดรายการห้อง |
| `rooms/[id]/page.tsx` | รายละเอียดห้องพัก: gallery, ราคา 3 แบบ, สิ่งอำนวยความสะดวก, ปฏิทินเช็กห้องว่าง |
| `rooms/[id]/loading.tsx` | Skeleton loading ระหว่างโหลดรายละเอียดห้อง |
| `rooms/[id]/not-found.tsx` | แสดงเมื่อห้องพักถูกลบหรือไม่มีอยู่จริง |
| `promotions/page.tsx` | รายการโปรโมชั่น/คูปองที่ยังไม่หมดอายุ |
| `attractions/page.tsx` | รายการสถานที่ท่องเที่ยวใกล้เคียง |
| `reviews/page.tsx` | รีวิวลูกค้าที่อนุมัติแล้ว + คะแนนเฉลี่ย + ฟอร์มส่งรีวิวใหม่ |
| `contact/page.tsx` | ข้อมูลติดต่อ (โทร/ที่ตั้ง/เวลาทำการ) + ปุ่มแอดไลน์ |

## `app/admin/` — ระบบจัดการหลังบ้าน

| ไฟล์ | หน้าที่ |
|---|---|
| `login/page.tsx` | หน้า login แอดมิน (อีเมล/รหัสผ่าน ผ่าน Supabase Auth) |
| `(dashboard)/layout.tsx` | ครอบทุกหน้าแอดมิน (ยกเว้น login) ด้วย Sidebar เมนู |
| `(dashboard)/error.tsx` | จับ error ที่เกิดขึ้นในระบบจัดการ |
| `(dashboard)/bookings/page.tsx` | หน้าจัดการการจอง: ฟอร์มเพิ่มการจองใหม่ + ค้นหา/กรองสถานะ + ตารางจัดการ (แก้ไข/ยกเลิก/เช็คอิน/เช็คเอาท์) |
| `(dashboard)/bookings/loading.tsx` | Skeleton loading หน้าจัดการการจอง |
| `(dashboard)/rooms/page.tsx` | ตารางรายการห้องพักทั้งหมด พร้อมปุ่มเพิ่ม/แก้ไข/ลบ |
| `(dashboard)/rooms/loading.tsx` | Skeleton loading หน้ารายการห้อง |
| `(dashboard)/rooms/new/page.tsx` | ฟอร์มเพิ่มห้องพักใหม่ |
| `(dashboard)/rooms/[id]/edit/page.tsx` | ฟอร์มแก้ไขห้องพัก + ตัวจัดการรูปภาพ |
| `(dashboard)/pricing/page.tsx` | ดูราคาพื้นฐานทุกห้อง + เพิ่ม/ลบช่วงราคาพิเศษ (Weekend/Holiday/Festival) |
| `(dashboard)/promotions/page.tsx` | สร้าง/เปิด-ปิด/ลบคูปองโปรโมชั่น |
| `(dashboard)/reports/page.tsx` | เลือกเดือน แสดง Occupancy Rate, Top Room, ปุ่ม Export |

---

## `components/public/` — ส่วนประกอบหน้าเว็บลูกค้า

| ไฟล์ | หน้าที่ |
|---|---|
| `Navbar.tsx` | เมนูบนสุด 6 หัวข้อ + ปุ่มแอดไลน์ + ปุ่มสลับ dark mode + เมนูมือถือแบบ hamburger |
| `Footer.tsx` | ข้อมูลติดต่อและลิงก์เมนูท้ายเว็บ |
| `LineBookingButton.tsx` | ปุ่มจองหลักของเว็บ — กดแล้วเด้งไป LINE OA (รองรับส่งข้อความล่วงหน้า) |
| `RoomCard.tsx` | การ์ดแสดงห้องพักในหน้ารายการ (รูป, ราคา, สิ่งอำนวยความสะดวก) |
| `AmenityIcon.tsx` | แปลง `icon_key` ในฐานข้อมูลเป็นไอคอนจริง (Wi-Fi, แอร์, ทีวี ฯลฯ) |
| `AvailabilityCalendar.tsx` | ปฏิทินเช็กห้องว่างอัตโนมัติ ปิดวันที่ถูกจองแล้ว คำนวณราคารวม แล้วส่งต่อ LINE |
| `PromotionCard.tsx` | การ์ดแสดงคูปองโปรโมชั่น |
| `ReviewCard.tsx` | การ์ดแสดงรีวิวลูกค้า 1 รายการ |
| `ReviewForm.tsx` | ฟอร์มให้ลูกค้าส่งรีวิวใหม่ (เข้าคิวรออนุมัติ) |

## `components/admin/` — ส่วนประกอบระบบจัดการ

| ไฟล์ | หน้าที่ |
|---|---|
| `Sidebar.tsx` | เมนูด้านข้างของระบบแอดมิน + ปุ่ม logout |
| `RoomForm.tsx` | ฟอร์มเพิ่ม/แก้ไขห้องพัก (ใช้ร่วมกันทั้ง 2 หน้า) |
| `RoomImageManager.tsx` | อัปโหลดรูปหลายรูป, ตั้งรูปปก, ลบรูป |
| `DeleteRoomButton.tsx` | ปุ่มลบห้องพักพร้อม confirm dialog |
| `PricePeriodForm.tsx` / `PricePeriodTable.tsx` | ฟอร์มเพิ่ม และตารางแสดง/ลบช่วงราคาพิเศษ |
| `CouponForm.tsx` / `CouponTable.tsx` | ฟอร์มสร้าง และตารางแสดง/เปิดปิด/ลบคูปอง |
| `NewBookingForm.tsx` | ฟอร์มบันทึกการจองใหม่จากที่ลูกค้าแจ้งผ่าน LINE |
| `BookingsTable.tsx` | ตารางจัดการการจอง รองรับแก้ไขแบบ inline (เปลี่ยนห้อง/วันที่), ยกเลิก, เช็คอิน/เช็คเอาท์ |
| `ReportsView.tsx` | กราฟ Occupancy Rate, ตาราง Top Room, ปุ่ม Export Excel/PDF |
| `MonthSelector.tsx` | ตัวเลือกเดือนสำหรับหน้ารายงาน (client component เพื่อ navigate ด้วย router) |

## `components/ui/` — ส่วนประกอบพื้นฐานใช้ร่วมกัน

| ไฟล์ | หน้าที่ |
|---|---|
| `Skeleton.tsx` | กล่อง shimmer loading พื้นฐาน + `RoomCardSkeleton` สำเร็จรูป |
| `Badge.tsx` | ป้ายข้อความสถานะ/หมวดหมู่ (4 สี: gold, river, success, danger) |

---

## หมายเหตุไฟล์ที่ไม่ได้แสดงในตารางนี้

- `next-env.d.ts` — ไฟล์ที่ Next.js สร้างอัตโนมัติตอน `npm run dev` ครั้งแรก ไม่ต้องแก้ไข
- `node_modules/` — ติดตั้งอัตโนมัติจาก `npm install` ไม่รวมอยู่ใน zip ที่ส่งมอบ
