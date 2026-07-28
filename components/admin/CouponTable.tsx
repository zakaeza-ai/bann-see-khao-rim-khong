"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toggleCouponAction, deleteCouponAction } from "@/lib/actions/promotions";
import { Badge } from "@/components/ui/Badge";
import type { Coupon } from "@/types/database";

export function CouponTable({ coupons }: { coupons: Coupon[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="resort-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
          <tr>
            <th className="text-left px-4 py-3">โค้ด</th>
            <th className="text-left px-4 py-3">ส่วนลด</th>
            <th className="text-left px-4 py-3">หมดอายุ</th>
            <th className="text-center px-4 py-3">ใช้แล้ว</th>
            <th className="text-center px-4 py-3">สถานะ</th>
            <th className="text-right px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-t border-river-50 dark:border-[#16273a]">
              <td className="px-4 py-3 font-mono">{c.code}</td>
              <td className="px-4 py-3">
                {c.discount_type === "percent" ? `${c.discount_value}%` : `${c.discount_value.toLocaleString()} บาท`}
              </td>
              <td className="px-4 py-3 text-river-600 dark:text-river-400">{c.expiry_date}</td>
              <td className="px-4 py-3 text-center">
                {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => toggleCouponAction(c.id, !c.is_active))}
                >
                  <Badge variant={c.is_active ? "success" : "danger"}>
                    {c.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => deleteCouponAction(c.id))}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
                >
                  {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {coupons.length === 0 && <p className="text-center text-river-500 py-8">ยังไม่มีคูปอง</p>}
    </div>
  );
}
