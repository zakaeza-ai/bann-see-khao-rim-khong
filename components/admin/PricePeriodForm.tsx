"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";
import { addPricePeriodAction, type PricingFormState } from "@/lib/actions/pricing";
import type { Room } from "@/types/database";

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
      เพิ่มช่วงราคา
    </button>
  );
}

export function PricePeriodForm({ rooms }: { rooms: Room[] }) {
  const [state, formAction] = useFormState<PricingFormState, FormData>(addPricePeriodAction, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4">
      <h3 className="font-semibold text-river-800 dark:text-river-200">เพิ่มช่วงราคาพิเศษ</h3>
      {state?.error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ห้องที่ใช้</label>
          <select name="room_id" defaultValue="all" className={inputClass}>
            <option value="all">ทุกห้อง</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ประเภทช่วง</label>
          <select name="period_type" defaultValue="holiday" className={inputClass}>
            <option value="weekend">Weekend</option>
            <option value="holiday">Holiday</option>
            <option value="festival">Festival</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วันที่เริ่ม</label>
          <input type="date" name="start_date" required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วันที่สิ้นสุด</label>
          <input type="date" name="end_date" required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ราคา/คืน (บาท)</label>
          <input type="number" name="override_price" min={0} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ป้ายกำกับ (เช่น สงกรานต์)</label>
        <input type="text" name="label" className={inputClass} />
      </div>

      <SubmitButton />
    </form>
  );
}
