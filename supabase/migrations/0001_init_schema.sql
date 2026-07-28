-- ============================================================
-- 0001_init_schema.sql
-- บ้านสีขาวริมโขง ธาตุพนม — Initial Database Schema
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- ---------- ENUM TYPES ----------
create type room_status as enum ('available', 'maintenance', 'inactive');
create type booking_status as enum ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
create type booking_source as enum ('line', 'admin');
create type discount_type as enum ('percent', 'amount');
create type period_type as enum ('weekend', 'holiday', 'festival');

-- ---------- ROOMS ----------
create table rooms (
    id uuid primary key default uuid_generate_v4(),
    room_code text unique not null,
    name text not null,
    type text not null,
    description text,
    capacity int not null check (capacity > 0),
    bed_type text,
    room_size_sqm numeric(6,2),
    price_normal numeric(10,2) not null check (price_normal >= 0),
    price_weekend numeric(10,2) not null check (price_weekend >= 0),
    price_festival numeric(10,2) not null check (price_festival >= 0),
    status room_status not null default 'available',
    sort_order int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table rooms is 'ข้อมูลห้องพักหลัก';

-- ---------- ROOM IMAGES ----------
create table room_images (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid not null references rooms(id) on delete cascade,
    image_url text not null,
    sort_order int not null default 0,
    is_cover boolean not null default false,
    created_at timestamptz not null default now()
);
create index idx_room_images_room_id on room_images(room_id);

-- ---------- AMENITIES ----------
create table amenities (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    icon_key text not null -- map กับ icon component ฝั่ง frontend เช่น 'wifi','ac','tv','fridge'
);

create table room_amenities (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid not null references rooms(id) on delete cascade,
    amenity_id uuid not null references amenities(id) on delete cascade,
    unique (room_id, amenity_id)
);

-- ---------- PRICE PERIODS (Weekend / Holiday / Festival ตามช่วงวันที่) ----------
create table price_periods (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid references rooms(id) on delete cascade, -- null = ใช้กับทุกห้อง
    period_type period_type not null,
    start_date date not null,
    end_date date not null,
    override_price numeric(10,2) not null check (override_price >= 0),
    label text,
    created_at timestamptz not null default now(),
    check (end_date >= start_date)
);
create index idx_price_periods_dates on price_periods(start_date, end_date);

-- ---------- ADMIN USERS ----------
create table admin_users (
    id uuid primary key default uuid_generate_v4(),
    auth_user_id uuid unique not null references auth.users(id) on delete cascade,
    full_name text not null,
    role text not null default 'staff' check (role in ('admin', 'staff')),
    created_at timestamptz not null default now()
);

-- ---------- COUPONS / โปรโมชั่น ----------
create table coupons (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,
    discount_type discount_type not null,
    discount_value numeric(10,2) not null check (discount_value >= 0),
    expiry_date date not null,
    is_active boolean not null default true,
    usage_limit int,
    used_count int not null default 0,
    created_at timestamptz not null default now()
);

-- ---------- BOOKINGS ----------
create table bookings (
    id uuid primary key default uuid_generate_v4(),
    booking_code text unique not null default ('BK-' || upper(substr(uuid_generate_v4()::text, 1, 8))),
    room_id uuid not null references rooms(id),
    guest_name text not null,
    guest_phone text not null,
    check_in date not null,
    check_out date not null,
    status booking_status not null default 'confirmed',
    source booking_source not null default 'admin',
    coupon_id uuid references coupons(id),
    created_by uuid references admin_users(id),
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (check_out > check_in)
);
create index idx_bookings_room_dates on bookings(room_id, check_in, check_out);
create index idx_bookings_status on bookings(status);

-- ป้องกัน DOUBLE BOOKING / OVERBOOKING: ห้องเดียวกัน ช่วงวันที่ทับกัน (ยกเว้นที่ยกเลิกแล้ว) ไม่สามารถเกิดได้ระดับ DB
alter table bookings
    add constraint no_overlapping_bookings
    exclude using gist (
        room_id with =,
        daterange(check_in, check_out, '[)') with &&
    )
    where (status <> 'cancelled');

-- ---------- REVIEWS ----------
create table reviews (
    id uuid primary key default uuid_generate_v4(),
    guest_name text not null,
    rating int not null check (rating between 1 and 5),
    comment text not null,
    image_url text,
    is_approved boolean not null default false,
    created_at timestamptz not null default now()
);

-- ---------- ATTRACTIONS ----------
create table attractions (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    image_url text,
    distance_km numeric(5,2),
    sort_order int not null default 0,
    created_at timestamptz not null default now()
);

-- ---------- UPDATED_AT TRIGGER ----------
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_rooms_updated_at before update on rooms
    for each row execute function set_updated_at();

create trigger trg_bookings_updated_at before update on bookings
    for each row execute function set_updated_at();
