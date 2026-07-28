"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";
import { createBookingAction, type BookingFormState } from "@/lib/actions/bookings";
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
      บันทึกการจอง
    </button>
  );
}

export function NewBookingForm({ rooms }: { rooms: Room[] }) {
  const [state, formAction] = useFormState<BookingFormState, FormData>(createBookingAction, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4">
      <h3 className="font-semibold text-river-800 dark:text-river-200">
        บันทึกการจองใหม่ <span className="text-xs font-normal text-river-400">(จากที่ลูกค้าแจ้งผ่าน LINE)</span>
      </h3>
      {state?.error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>}

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ห้องพัก</label>
        <select name="room_id" required className={inputClass}>
          <option value="">-- เลือกห้อง --</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ชื่อผู้เข้าพัก</label>
          <input name="guest_name" required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">เบอร์โทร</label>
          <input name="guest_phone" required className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">เช็คอิน</label>
          <input name="check_in" type="date" required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">เช็คเอาท์</label>
          <input name="check_out" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">หมายเหตุ</label>
        <textarea name="notes" rows={2} className={inputClass} />
      </div>

      <SubmitButton />
    </form>
  );
}
