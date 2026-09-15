import { createPublicClient } from "@/lib/supabase/public";
import { createBookingAppClient } from "@/lib/supabase/booking-app";
import { ROOM_ID_MAP } from "@/lib/data/room-mapping";

export interface DayAvailability {
  date: string;
  totalRooms: number;
  availableRooms: number;
}

export async function getMonthlyAvailability(year: number, month: number): Promise<DayAvailability[]> {
  const supabase = createPublicClient();
  const bookingAppSupabase = createBookingAppClient();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = endDate.toISOString().slice(0, 10);

  const [{ data: rooms }, { data: bookedDates }] = await Promise.all([
    supabase.from("rooms").select("id").eq("status", "available"),
    bookingAppSupabase
      .from("public_booked_dates_saikhao")
      .select("room_id, check_in, check_out")
      .lte("check_in", endStr)
      .gte("check_out", startStr),
  ]);

  const totalRooms = rooms?.length ?? 0;
  const daysInMonth = endDate.getDate();
  const bookingAppToWebRoomId = new Map(
    Object.entries(ROOM_ID_MAP).map(([webId, bookingAppId]) => [bookingAppId, webId])
  );

  const result: DayAvailability[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month - 1, d).toISOString().slice(0, 10);
    const occupiedRoomIds = new Set(
      (bookedDates ?? [])
        .filter((b: any) => dateStr >= b.check_in && dateStr < b.check_out)
        .map((b: any) => bookingAppToWebRoomId.get(b.room_id))
        .filter(Boolean)
    );
    result.push({
      date: dateStr,
      totalRooms,
      availableRooms: Math.max(totalRooms - occupiedRoomIds.size, 0),
    });
  }

  return result;
}
