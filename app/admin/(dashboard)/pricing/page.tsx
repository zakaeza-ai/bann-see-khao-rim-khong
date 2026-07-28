import { createClient } from "@/lib/supabase/server";
import { PricePeriodForm } from "@/components/admin/PricePeriodForm";
import { PricePeriodTable } from "@/components/admin/PricePeriodTable";
import { formatTHB } from "@/lib/utils/pricing";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const supabase = createClient();

  const [{ data: rooms }, { data: periods }] = await Promise.all([
    supabase.from("rooms").select("*").order("sort_order"),
    supabase.from("price_periods").select("*, rooms(name)").order("start_date", { ascending: false }),
  ]);

  const rows = (periods ?? []).map((p: any) => ({
    id: p.id,
    room_name: p.rooms?.name ?? "ทุกห้อง",
    period_type: p.period_type,
    start_date: p.start_date,
    end_date: p.end_date,
    override_price: p.override_price,
    label: p.label,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-1">จัดการราคา</h1>
        <p className="text-sm text-river-500">ราคาพื้นฐานของแต่ละห้อง (แก้ไขได้ในหน้าจัดการห้องพัก)</p>
      </div>

      <div className="resort-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
            <tr>
              <th className="text-left px-4 py-3">ห้อง</th>
              <th className="text-right px-4 py-3">ราคาปกติ</th>
              <th className="text-right px-4 py-3">Weekend</th>
              <th className="text-right px-4 py-3">Holiday/Festival ตั้งต้น</th>
            </tr>
          </thead>
          <tbody>
            {(rooms ?? []).map((r) => (
              <tr key={r.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-right">{formatTHB(r.price_normal)}</td>
                <td className="px-4 py-3 text-right">{formatTHB(r.price_weekend)}</td>
                <td className="px-4 py-3 text-right">{formatTHB(r.price_festival)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-lg font-bold text-river-900 dark:text-river-100 mb-3">ช่วงราคาพิเศษ (วันที่เฉพาะ)</h2>
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
          <PricePeriodForm rooms={rooms ?? []} />
          <PricePeriodTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
