"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";
import { addCouponAction, type CouponFormState } from "@/lib/actions/promotions";

const inputClass =
  "w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
      สร้างคูปอง
    </button>
  );
}

export function CouponForm() {
  const [state, formAction] = useFormState<CouponFormState, FormData>(addCouponAction, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4">
      <h3 className="font-semibold text-river-800 dark:text-river-200">สร้างคูปองใหม่</h3>
      {state?.error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>}

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">โค้ดคูปอง</label>
        <input name="code" required placeholder="เช่น SONGKRAN2026" className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ประเภทส่วนลด</label>
          <select name="discount_type" defaultValue="percent" className={inputClass}>
            <option value="percent">เปอร์เซ็นต์ (%)</option>
            <option value="amount">จำนวนเงิน (บาท)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">มูลค่าส่วนลด</label>
          <input name="discount_value" type="number" min={1} required className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วันหมดอายุ</label>
          <input name="expiry_date" type="date" required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">จำกัดจำนวนใช้ (ไม่บังคับ)</label>
          <input name="usage_limit" type="number" min={1} className={inputClass} />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
