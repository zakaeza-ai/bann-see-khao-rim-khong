import { createClient } from "@/lib/supabase/server";

export interface OccupancyPoint {
  date: string; // YYYY-MM-DD
  occupiedRooms: number;
  totalRooms: number;
  occupancyRate: number; // 0-100
}

export interface TopRoomStat {
  roomId: string;
  roomName: string;
  bookedNights: number;
  bookingCount: number;
}

export interface ReportBookingRow {
  booking_code: string;
  room_name: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: string;
}

/** ดึงสถิติรายงานของเดือนที่กำหนด (ค่าเริ่มต้น = เดือนปัจจุบัน) */
export async function getMonthlyReport(year: number, month: number) {
  const supabase = createClient();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // วันสุดท้ายของเดือน
  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = endDate.toISOString().slice(0, 10);

  const [{ data: rooms }, { data: bookings }] = await Promise.all([
    supabase.from("rooms").select("id, name"),
    supabase
      .from("bookings")
      .select("room_id, check_in, check_out, status, booking_code, guest_name, guest_phone, rooms(name)")
      .neq("status", "cancelled")
      .lte("check_in", endStr)
      .gte("check_out", startStr),
  ]);

  const totalRooms = rooms?.length ?? 0;
  const bookingRows = bookings ?? [];

  // คำนวณ Occupancy Rate รายวันตลอดเดือน
  const occupancy: OccupancyPoint[] = [];
  const daysInMonth = endDate.getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month - 1, d).toISOString().slice(0, 10);
    const occupiedRooms = new Set(
      bookingRows
        .filter((b: any) => dateStr >= b.check_in && dateStr < b.check_out)
        .map((b: any) => b.room_id)
    ).size;
    occupancy.push({
      date: dateStr,
      occupiedRooms,
      totalRooms,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 1000) / 10 : 0,
    });
  }

  // คำนวณ Top Room จากจำนวนคืนที่ถูกจองในเดือนนี้
  const roomStats = new Map<string, TopRoomStat>();
  for (const b of bookingRows as any[]) {
    const nights = Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000);
    const key = b.room_id;
    const existing = roomStats.get(key);
    const roomName = b.rooms?.name ?? "ไม่ทราบชื่อห้อง";
    if (existing) {
      existing.bookedNights += nights;
      existing.bookingCount += 1;
    } else {
      roomStats.set(key, { roomId: key, roomName, bookedNights: nights, bookingCount: 1 });
    }
  }
  const topRooms = Array.from(roomStats.values()).sort((a, b) => b.bookedNights - a.bookedNights);

  const reportRows: ReportBookingRow[] = (bookingRows as any[]).map((b) => ({
    booking_code: b.booking_code,
    room_name: b.rooms?.name ?? "-",
    guest_name: b.guest_name,
    guest_phone: b.guest_phone,
    check_in: b.check_in,
    check_out: b.check_out,
    status: b.status,
  }));

  const avgOccupancy =
    occupancy.length > 0
      ? Math.round((occupancy.reduce((s, o) => s + o.occupancyRate, 0) / occupancy.length) * 10) / 10
      : 0;

  return { occupancy, topRooms, reportRows, totalRooms, avgOccupancy };
}
