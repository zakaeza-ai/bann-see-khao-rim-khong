"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { saveAttractionAction, type AttractionFormState } from "@/lib/actions/attractions";
import type { Attraction } from "@/types/database";

const inputClass =
  "w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      บันทึกข้อมูล
    </button>
  );
}

export function AttractionForm({ attraction }: { attraction?: Attraction }) {
  const action = saveAttractionAction.bind(null, attraction?.id ?? null);
  const [state, formAction] = useFormState<AttractionFormState, FormData>(action, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4 max-w-2xl">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ชื่อสถานที่ *</label>
        <input name="name" defaultValue={attraction?.name} required className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">รายละเอียด</label>
        <textarea name="description" defaultValue={attraction?.description ?? ""} rows={3} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ระยะทางจากที่พัก (กม.)</label>
          <input name="distance_km" type="number" step="0.1" defaultValue={attraction?.distance_km ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">ลำดับการแสดงผล</label>
          <input name="sort_order" type="number" defaultValue={attraction?.sort_order ?? 0} className={inputClass} />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}