// Types นี้เขียนให้ตรงกับ supabase/migrations/0001_init_schema.sql ด้วยมือ
// เมื่อ deploy จริงแนะนำให้รัน `supabase gen types typescript` เพื่อ sync อัตโนมัติภายหลัง

export type RoomStatus = "available" | "maintenance" | "inactive";
export type BookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
export type BookingSource = "line" | "admin";
export type DiscountType = "percent" | "amount";
export type PeriodType = "weekend" | "holiday" | "festival";

export interface Room {
  id: string;
  room_code: string;
  name: string;
  type: string;
  description: string | null;
  capacity: number;
  bed_type: string | null;
  room_size_sqm: number | null;
  price_normal: number;
  price_weekend: number;
  price_festival: number;
  status: RoomStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon_key: string;
}

export interface RoomAmenity {
  id: string;
  room_id: string;
  amenity_id: string;
}

export interface PricePeriod {
  id: string;
  room_id: string | null;
  period_type: PeriodType;
  start_date: string;
  end_date: string;
  override_price: number;
  label: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  room_id: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  source: BookingSource;
  coupon_id: string | null;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  expiry_date: string;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
}

export interface Review {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  distance_km: number | null;
  sort_order: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  auth_user_id: string;
  full_name: string;
  role: "admin" | "staff";
  created_at: string;
}

// โครง Database type สำหรับส่งให้ createClient<Database>() ของ Supabase
export interface Database {
  public: {
    Tables: {
      rooms: { Row: Room; Insert: Partial<Room>; Update: Partial<Room> };
      room_images: { Row: RoomImage; Insert: Partial<RoomImage>; Update: Partial<RoomImage> };
      amenities: { Row: Amenity; Insert: Partial<Amenity>; Update: Partial<Amenity> };
      room_amenities: { Row: RoomAmenity; Insert: Partial<RoomAmenity>; Update: Partial<RoomAmenity> };
      price_periods: { Row: PricePeriod; Insert: Partial<PricePeriod>; Update: Partial<PricePeriod> };
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> };
      coupons: { Row: Coupon; Insert: Partial<Coupon>; Update: Partial<Coupon> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      attractions: { Row: Attraction; Insert: Partial<Attraction>; Update: Partial<Attraction> };
      admin_users: { Row: AdminUser; Insert: Partial<AdminUser>; Update: Partial<AdminUser> };
    };
  };
}

// Type รวมที่ใช้บ่อยฝั่ง UI: ห้องพักพร้อมรูปภาพและสิ่งอำนวยความสะดวก
export interface RoomWithDetails extends Room {
  room_images: RoomImage[];
  amenities: Amenity[];
}
