import { Tag, Calendar } from "lucide-react";
import type { Coupon } from "@/types/database";

export function PromotionCard({ coupon, index = 0 }: { coupon: Coupon; index?: number }) {
  const discountLabel =
    coupon.discount_type === "percent"
      ? `ลด ${coupon.discount_value}%`
      : `ลด ${coupon.discount_value.toLocaleString()} บาท`;

  return (
    <div
      className="resort-card p-6 flex flex-col gap-3 border-dashed border-2 border-gold-200 dark:border-gold-800 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2 text-gold-600">
        <Tag size={20} />
        <span className="text-2xl font-bold">{discountLabel}</span>
      </div>
      <p className="font-mono tracking-widest text-river-800 dark:text-river-200 bg-river-50 dark:bg-[#16273a] rounded-lg px-3 py-2 text-center text-lg">
        {coupon.code}
      </p>
      <div className="flex items-center gap-1 text-xs text-river-500">
        <Calendar size={14} /> หมดเขต {new Date(coupon.expiry_date).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      <p className="text-xs text-river-400">แจ้งโค้ดนี้กับแอดมินตอนแอดไลน์จองห้องพัก</p>
    </div>
  );
}
