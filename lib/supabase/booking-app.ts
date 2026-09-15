import { createClient } from "@supabase/supabase-js";

// อ่านข้อมูลจาก booking-app-supabase (ระบบจัดการจองจริงที่แอดมินใช้)
// ใช้แค่ anon key เพราะอ่านผ่าน view ที่เปิด public ไว้แล้วเท่านั้น
export function createBookingAppClient() {
  return createClient(
    process.env.NEXT_PUBLIC_BOOKING_APP_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_BOOKING_APP_SUPABASE_ANON_KEY!
  );
}
