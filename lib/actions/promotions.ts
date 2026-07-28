"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CouponFormState {
  error?: string;
}

export async function addCouponAction(
  _prev: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  const supabase = createClient();

  const payload = {
    code: String(formData.get("code") ?? "").trim().toUpperCase(),
    discount_type: String(formData.get("discount_type") ?? "percent"),
    discount_value: Number(formData.get("discount_value") ?? 0),
    expiry_date: String(formData.get("expiry_date") ?? ""),
    usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : null,
    is_active: true,
  };

  if (!payload.code) return { error: "กรุณากรอกโค้ดคูปอง" };
  if (!payload.expiry_date) return { error: "กรุณาเลือกวันหมดอายุ" };
  if (payload.discount_value <= 0) return { error: "จำนวนส่วนลดต้องมากกว่า 0" };
  if (payload.discount_type === "percent" && payload.discount_value > 100) {
    return { error: "ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100" };
  }

  const { data: dup } = await supabase.from("coupons").select("id").eq("code", payload.code).maybeSingle();
  if (dup) return { error: "โค้ดคูปองนี้ถูกใช้แล้ว กรุณาใช้โค้ดอื่น" };

  const { error } = await supabase.from("coupons").insert(payload);
  if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };

  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
  return {};
}

export async function toggleCouponAction(id: string, isActive: boolean) {
  const supabase = createClient();
  await supabase.from("coupons").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

export async function deleteCouponAction(id: string) {
  const supabase = createClient();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}
