import { createPublicClient } from "@/lib/supabase/public";

/** ดึงช่วงวันที่ถูกจองแล้วของห้องหนึ่ง (จาก view ที่ไม่เปิดเผยข้อมูลลูกค้า) ใช้กับปฏิทินฝั่งเว็บ */
export async function getBookedDateRanges(roomId: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("public_booked_dates")
    .select("check_in, check_out")
    .eq("room_id", roomId);

  if (error || !data) return [];
  return data as { check_in: string; check_out: string }[];
}
