import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
// ใช้ใน Server Components, Route Handlers, Server Actions เท่านั้น
// จัดการ session ผ่าน cookies เพื่อให้รู้ว่าแอดมินคนไหน login อยู่ (สำหรับตรวจสอบ RLS is_admin())
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // เรียกจาก Server Component ที่ไม่สามารถ set cookie ได้ (จะถูกจัดการโดย middleware แทน)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // เช่นเดียวกับด้านบน
          }
        },
      },
    }
  );
}

// ใช้เฉพาะงานฝั่ง server ที่ต้องข้าม RLS จริง ๆ เท่านั้น (เช่น Edge Function ยืนยันคูปอง)
// ห้าม import ไฟล์นี้ในไฟล์ที่ import โดย Client Component เด็ดขาด
export function createServiceRoleClient() {
  
  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
