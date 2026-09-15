import { createBookingAppClient } from "@/lib/supabase/booking-app";
import { toBookingAppRoomId } from "@/lib/data/room-mapping";

/** ดึงช่วงวันที่ถูกจองแล้วของห้องหนึ่ง จากระบบจองจริง (booking-app-supabase) */
export async function getBookedDateRanges(roomId: string) {
  const bookingAppRoomId = toBookingAppRoomId(roomId);
  if (!bookingAppRoomId) return []; // ห้องนี้ไม่มีคู่ในระบบจองจริง ถือว่าไม่มีข้อมูลจอง

  const supabase = createBookingAppClient();
  const { data, error } = await supabase
    .from("public_booked_dates_saikhao")
    .select("check_in, check_out")
    .eq("room_id", bookingAppRoomId);

  if (error || !data) return [];
  return data as { check_in: string; check_out: string }[];
}
