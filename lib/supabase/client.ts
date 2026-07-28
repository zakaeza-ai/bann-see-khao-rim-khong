import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// ใช้ใน Client Components เท่านั้น ("use client")
// ใช้ anon key ซึ่งถูกจำกัดสิทธิ์ด้วย Row Level Security (RLS) ในฐานข้อมูลแล้ว
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
