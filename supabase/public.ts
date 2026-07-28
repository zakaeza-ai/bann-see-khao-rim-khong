import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ใช้สำหรับดึงข้อมูลสาธารณะ (ห้องพัก, โปรโมชั่น, รีวิว ฯลฯ) ที่ไม่ต้องรู้ว่าใคร login อยู่
// ไม่ผูกกับ cookies จึงใช้ได้ทั้งตอน build (static) และตอนมี request จริง
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}