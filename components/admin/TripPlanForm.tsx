"use client";

import { useFormState } from "react-dom";
import { saveTripPlanAction, type TripPlanFormState } from "@/lib/actions/trip-plans";

export function TripPlanForm({
  tripPlan,
}: {
  tripPlan?: { id: string; title: string; description: string | null; sort_order: number };
}) {
  const action = saveTripPlanAction.bind(null, tripPlan?.id ?? null);
  const [state, formAction] = useFormState<TripPlanFormState, FormData>(action, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-4 max-w-xl">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-river-700 dark:text-river-300 mb-1">หัวข้อ</label>
        <input
          name="title"
          defaultValue={tripPlan?.title}
          required
          className="w-full px-3 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-river-700 dark:text-river-300 mb-1">รายละเอียด</label>
        <textarea
          name="description"
          defaultValue={tripPlan?.description ?? ""}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-river-700 dark:text-river-300 mb-1">ลำดับการแสดง</label>
        <input
          type="number"
          name="sort_order"
          defaultValue={tripPlan?.sort_order ?? 0}
          className="w-full px-3 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520]"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-river-600 hover:bg-river-700 text-white px-6 py-2.5 text-sm font-semibold"
      >
        บันทึก
      </button>
    </form>
  );
}
