import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatTHB } from "@/lib/utils/pricing";
import { DeleteRoomButton } from "@/components/admin/DeleteRoomButton";
import { Badge } from "@/components/ui/Badge";
import type { Room } from "@/types/database";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { text: string; variant: "success" | "danger" | "gold" }> = {
  available: { text: "เปิดให้บริการ", variant: "success" },
  maintenance: { text: "ปรับปรุง", variant: "gold" },
  inactive: { text: "ปิดใช้งาน", variant: "danger" },
};

export default async function AdminRoomsPage() {
  const supabase = createClient();
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการห้องพัก</h1>
          <p className="text-sm text-river-500">ทั้งหมด {rooms?.length ?? 0} ห้อง</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> เพิ่มห้องพัก
        </Link>
      </div>

      <div className="resort-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
            <tr>
              <th className="text-left px-4 py-3">รหัส</th>
              <th className="text-left px-4 py-3">ชื่อห้อง</th>
              <th className="text-left px-4 py-3">ประเภท</th>
              <th className="text-right px-4 py-3">ราคาปกติ</th>
              <th className="text-center px-4 py-3">สถานะ</th>
              <th className="text-right px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {(rooms as Room[] | null)?.map((room) => (
              <tr key={room.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-mono text-xs text-river-500">{room.room_code}</td>
                <td className="px-4 py-3 font-medium text-river-900 dark:text-river-100">{room.name}</td>
                <td className="px-4 py-3 text-river-600 dark:text-river-400">{room.type}</td>
                <td className="px-4 py-3 text-right">{formatTHB(room.price_normal)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={STATUS_LABEL[room.status].variant}>{STATUS_LABEL[room.status].text}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      className="p-2 rounded-lg hover:bg-river-50 dark:hover:bg-[#16273a] text-river-600"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteRoomButton roomId={room.id} roomName={room.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!rooms || rooms.length === 0) && (
          <p className="text-center text-river-500 py-10">ยังไม่มีห้องพักในระบบ</p>
        )}
      </div>
    </div>
  );
}
