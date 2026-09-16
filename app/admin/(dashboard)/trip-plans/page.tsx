import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteTripPlanButton } from "@/components/admin/DeleteTripPlanButton";

export const dynamic = "force-dynamic";

export default async function AdminTripPlansPage() {
  const supabase = createClient();
  const { data: plans } = await supabase
    .from("trip_plans")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการวางแผนการท่องเที่ยว</h1>
          <p className="text-sm text-river-500">ทั้งหมด {plans?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/admin/trip-plans/new"
          className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> เพิ่มแผนเที่ยว
        </Link>
      </div>

      <div className="resort-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
            <tr>
              <th className="text-left px-4 py-3">หัวข้อ</th>
              <th className="text-right px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {plans?.map((p) => (
              <tr key={p.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-medium text-river-900 dark:text-river-100">{p.title}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/trip-plans/${p.id}/edit`}
                      className="p-2 rounded-lg hover:bg-river-50 dark:hover:bg-[#16273a] text-river-600"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteTripPlanButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!plans || plans.length === 0) && (
          <p className="text-center text-river-500 py-10">ยังไม่มีข้อมูลในระบบ</p>
        )}
      </div>
    </div>
  );
}
