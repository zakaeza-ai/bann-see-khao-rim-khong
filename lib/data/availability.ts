import { createPublicClient } from "@/lib/supabase/public";

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  totalRooms: number;
  availableRooms: number;
}

/** คำนวณจำนวนห้องว่างรายวันตลอดเดือนที่กำหนด สำหรับแสดงภาพรวมให้ลูกค้าดู */
export async function getMonthlyAvailability(year: number, month: number): Promise<DayAvailability[]> {
  const supabase = createPublicClient();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = endDate.toISOString().slice(0, 10);

  const [{ data: rooms }, { data: bookedDates }] = await Promise.all([
    supabase.from("rooms").select("id").eq("status", "available"),
    supabase
      .from("public_booked_dates")
      .select("room_id, check_in, check_out")
      .lte("check_in", endStr)
      .gte("check_out", startStr),
  ]);

  const totalRooms = rooms?.length ?? 0;
  const daysInMonth = endDate.getDate();

  const result: DayAvailability[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month - 1, d).toISOString().slice(0, 10);
    const occupiedRoomIds = new Set(
      (bookedDates ?? [])
        .filter((b: any) => dateStr >= b.check_in && dateStr < b.check_out)
        .map((b: any) => b.room_id)
    );
    result.push({
      date: dateStr,
      totalRooms,
      availableRooms: Math.max(totalRooms - occupiedRoomIds.size, 0),
    });
  }

  return result;
}