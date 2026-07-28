"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePricePeriodAction } from "@/lib/actions/pricing";
import { Badge } from "@/components/ui/Badge";
import { formatTHB } from "@/lib/utils/pricing";

interface Row {
  id: string;
  room_name: string;
  period_type: string;
  start_date: string;
  end_date: string;
  override_price: number;
  label: string | null;
}

const TYPE_LABEL: Record<string, string> = { weekend: "Weekend", holiday: "Holiday", festival: "Festival" };

export function PricePeriodTable({ rows }: { rows: Row[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="resort-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
          <tr>
            <th className="text-left px-4 py-3">ห้อง</th>
            <th className="text-left px-4 py-3">ประเภท</th>
            <th className="text-left px-4 py-3">ช่วงวันที่</th>
            <th className="text-left px-4 py-3">ป้ายกำกับ</th>
            <th className="text-right px-4 py-3">ราคา/คืน</th>
            <th className="text-right px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-river-50 dark:border-[#16273a]">
              <td className="px-4 py-3">{row.room_name}</td>
              <td className="px-4 py-3"><Badge variant="gold">{TYPE_LABEL[row.period_type]}</Badge></td>
              <td className="px-4 py-3 text-river-600 dark:text-river-400">
                {row.start_date} → {row.end_date}
              </td>
              <td className="px-4 py-3">{row.label || "-"}</td>
              <td className="px-4 py-3 text-right font-semibold">{formatTHB(row.override_price)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => deletePricePeriodAction(row.id))}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
                >
                  {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-center text-river-500 py-8">ยังไม่มีช่วงราคาพิเศษ</p>}
    </div>
  );
}
