"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";
import { addPromotionPostAction, type PromotionPostFormState } from "@/lib/actions/promotion-posts";

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
      สร้างโปรโมชั่น
    </button>
  );
}

export function PromotionPostForm() {
  const [state, formAction] = useFormState<PromotionPostFormState, FormData>(addPromotionPostAction, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4" encType="multipart/form-data">
      <h3 className="font-semibold text-river-800 dark:text-river-200">สร้างโปรโมชั่นใหม่</h3>
      {state?.error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>}

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ชื่อโปรโมชั่น</label>
        <input name="title" required placeholder="เช่น โปรพักผ่อนสงกรานต์" className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">รายละเอียด</label>
        <textarea name="description" rows={3} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วันเริ่ม</label>
          <input type="date" name="start_date" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วันสิ้นสุด</label>
          <input type="date" name="end_date" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">รูปภาพ (เลือกได้หลายรูป)</label>
        <input type="file" name="images" multiple accept="image/*" className="text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">วิดีโอ (1 ไฟล์)</label>
        <input type="file" name="video" accept="video/*" className="text-sm" />
      </div>

      <SubmitButton />
    </form>
  );
}