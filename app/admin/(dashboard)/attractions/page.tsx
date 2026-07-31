import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteAttractionButton } from "@/components/admin/DeleteAttractionButton";
import type { Attraction } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminAttractionsPage() {
  const supabase = createClient();
  const { data: attractions } = await supabase
    .from("attractions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการสถานที่ท่องเที่ยว</h1>
          <p className="text-sm text-river-500">ทั้งหมด {attractions?.length ?? 0} แห่ง</p>
        </div>
        <Link
          href="/admin/attractions/new"
          className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> เพิ่มสถานที่
        </Link>
      </div>

      <div className="resort-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
            <tr>
              <th className="text-left px-4 py-3">ชื่อสถานที่</th>
              <th className="text-left px-4 py-3">ระยะทาง</th>
              <th className="text-right px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {(attractions as Attraction[] | null)?.map((a) => (
              <tr key={a.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-medium text-river-900 dark:text-river-100">{a.name}</td>
                <td className="px-4 py-3 text-river-600 dark:text-river-400">
                  {a.distance_km != null ? `${a.distance_km} กม.` : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/attractions/${a.id}/edit`}
                      className="p-2 rounded-lg hover:bg-river-50 dark:hover:bg-[#16273a] text-river-600"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteAttractionButton id={a.id} name={a.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!attractions || attractions.length === 0) && (
          <p className="text-center text-river-500 py-10">ยังไม่มีสถานที่ท่องเที่ยวในระบบ</p>
        )}
      </div>
    </div>
  );
}