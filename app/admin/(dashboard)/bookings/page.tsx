import { createClient } from "@/lib/supabase/server";
import { NewBookingForm } from "@/components/admin/NewBookingForm";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const supabase = createClient();
  const { data: rooms } = await supabase.from("rooms").select("*").order("sort_order");

  let query = supabase
    .from("bookings")
    .select("*, rooms(name)")
    .order("check_in", { ascending: false })
    .limit(100);

  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.q) {
    // ค้นหาจากชื่อผู้เข้าพัก เบอร์โทร หรือเลขที่จอง
    query = query.or(
      `guest_name.ilike.%${searchParams.q}%,guest_phone.ilike.%${searchParams.q}%,booking_code.ilike.%${searchParams.q}%`
    );
  }

  const { data: bookings } = await query;

  const rows = (bookings ?? []).map((b: any) => ({
    id: b.id,
    booking_code: b.booking_code,
    room_id: b.room_id,
    room_name: b.rooms?.name ?? "-",
    guest_name: b.guest_name,
    guest_phone: b.guest_phone,
    check_in: b.check_in,
    check_out: b.check_out,
    status: b.status,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการการจอง</h1>

      <NewBookingForm rooms={rooms ?? []} />

      <form className="flex flex-wrap gap-3 items-center" action="/admin/bookings" method="get">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-river-400" />
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="ค้นหาชื่อ / เบอร์โทร / เลขที่จอง"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] text-sm focus:outline-none focus:ring-2 focus:ring-river-400"
          />
        </div>
        <select
          name="status"
          defaultValue={searchParams.status ?? ""}
          className="px-4 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] text-sm"
        >
          <option value="">ทุกสถานะ</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="checked_in">เช็คอินแล้ว</option>
          <option value="checked_out">เช็คเอาท์แล้ว</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
        <button type="submit" className="px-5 py-2 rounded-lg bg-river-600 hover:bg-river-700 text-white text-sm font-semibold">
          ค้นหา
        </button>
      </form>

      <BookingsTable bookings={rows} rooms={rooms ?? []} />
    </div>
  );
}
