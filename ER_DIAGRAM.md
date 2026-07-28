# ER Diagram — บ้านสีขาวริมโขง ธาตุพนม

```mermaid
erDiagram
    ROOMS ||--o{ ROOM_IMAGES : "มีหลายรูป"
    ROOMS ||--o{ BOOKINGS : "ถูกจอง"
    ROOMS ||--o{ PRICE_PERIODS : "มีช่วงราคาพิเศษ"
    ROOMS ||--o{ ROOM_AMENITIES : "มีสิ่งอำนวยความสะดวก"
    AMENITIES ||--o{ ROOM_AMENITIES : "ถูกใช้ใน"
    COUPONS ||--o{ BOOKINGS : "ถูกใช้ใน (optional)"
    ADMIN_USERS ||--o{ BOOKINGS : "จัดการโดย"

    ROOMS {
        uuid id PK
        text room_code
        text name
        text type
        text description
        int capacity
        text bed_type
        numeric room_size_sqm
        numeric price_normal
        numeric price_weekend
        numeric price_festival
        text status
        int sort_order
        timestamptz created_at
        timestamptz updated_at
    }

    ROOM_IMAGES {
        uuid id PK
        uuid room_id FK
        text image_url
        int sort_order
        boolean is_cover
    }

    AMENITIES {
        uuid id PK
        text name
        text icon_key
    }

    ROOM_AMENITIES {
        uuid id PK
        uuid room_id FK
        uuid amenity_id FK
    }

    PRICE_PERIODS {
        uuid id PK
        uuid room_id FK "null = ทุกห้อง"
        text period_type "weekend/holiday/festival"
        date start_date
        date end_date
        numeric override_price
        text label
    }

    BOOKINGS {
        uuid id PK
        uuid room_id FK
        text guest_name
        text guest_phone
        date check_in
        date check_out
        text status "pending/confirmed/checked_in/checked_out/cancelled"
        text source "line/admin"
        text booking_code
        uuid created_by FK
        timestamptz created_at
        timestamptz updated_at
    }

    COUPONS {
        uuid id PK
        text code
        text discount_type "percent/amount"
        numeric discount_value
        date expiry_date
        boolean is_active
        int usage_limit
        int used_count
    }

    REVIEWS {
        uuid id PK
        text guest_name
        int rating
        text comment
        text image_url
        boolean is_approved
        timestamptz created_at
    }

    ATTRACTIONS {
        uuid id PK
        text name
        text description
        text image_url
        numeric distance_km
        int sort_order
    }

    ADMIN_USERS {
        uuid id PK
        uuid auth_user_id FK
        text full_name
        text role "admin/staff"
    }
```

## คำอธิบายตารางหลัก

- **rooms** — ข้อมูลห้องพักหลัก ราคา 3 แบบ (ปกติ/วันหยุด/เทศกาล) ใช้เป็นค่าตั้งต้น ส่วนราคาช่วงพิเศษเฉพาะวันดูจาก `price_periods`
- **room_images** — เก็บ URL รูปจาก Supabase Storage bucket `room-images` รองรับหลายรูปต่อห้อง
- **bookings** — ใช้บันทึกการจองที่รับผ่าน LINE โดยแอดมิน กรอกเข้าระบบเพื่อ "บล็อกวันที่" ในปฏิทิน ป้องกัน Double Booking (ไม่ใช่ระบบจองออนไลน์ที่ลูกค้าจองเอง)
- **price_periods** — ใช้กำหนดวันหยุดยาว/เทศกาลที่ราคาต่างจากปกติ เช่น สงกรานต์ ปีใหม่
- **coupons** — โปรโมชั่นส่วนลด ใช้อ้างอิงตอนแอดมินออกใบจอง
- **reviews** — รีวิวลูกค้า ต้องผ่านการอนุมัติ (`is_approved`) ก่อนแสดงหน้าเว็บ
- **attractions** — สถานที่ท่องเที่ยวใกล้เคียง จัดการผ่าน Admin ได้เหมือนกัน
