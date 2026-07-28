"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PricingFormState {
  error?: string;
}

export async function addPricePeriodAction(
  _prev: PricingFormState,
  formData: FormData
): Promise<PricingFormState> {
  const supabase = createClient();

  const roomId = String(formData.get("room_id") ?? "");
  const payload = {
    room_id: roomId === "all" ? null : roomId,
    period_type: String(formData.get("period_type") ?? "holiday"),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    override_price: Number(formData.get("override_price") ?? 0),
    label: String(formData.get("label") ?? "").trim(),
  };

  if (!payload.start_date || !payload.end_date) {
    return { error: "กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด" };
  }
  if (payload.end_date < payload.start_date) {
    return { error: "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น" };
  }
  if (payload.override_price < 0) {
    return { error: "ราคาต้องไม่ติดลบ" };
  }

  const { error } = await supabase.from("price_periods").insert(payload);
  if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };

  revalidatePath("/admin/pricing");
  return {};
}

export async function deletePricePeriodAction(id: string) {
  const supabase = createClient();
  await supabase.from("price_periods").delete().eq("id", id);
  revalidatePath("/admin/pricing");
}
