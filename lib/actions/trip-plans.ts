"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface TripPlanFormState {
  error?: string;
}

export async function saveTripPlanAction(
  tripPlanId: string | null,
  _prevState: TripPlanFormState,
  formData: FormData
): Promise<TripPlanFormState> {
  const supabase = createClient();

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (!payload.title) {
    return { error: "กรุณากรอกหัวข้อ" };
  }

  let newId = tripPlanId;
  if (tripPlanId) {
    const { error } = await supabase.from("trip_plans").update(payload).eq("id", tripPlanId);
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
  } else {
    const { data, error } = await supabase.from("trip_plans").insert(payload).select("id").single();
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
    newId = data.id;
  }

  revalidatePath("/admin/trip-plans");
  revalidatePath("/reviews");
  redirect(`/admin/trip-plans/${newId}/edit`);
}

export async function deleteTripPlanAction(id: string) {
  const supabase = createClient();
  await supabase.from("trip_plans").delete().eq("id", id);
  revalidatePath("/admin/trip-plans");
  revalidatePath("/reviews");
}

export async function uploadTripPlanImageAction(id: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const path = `trip-plans/${id}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("room-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return;

  const { data: urlData } = supabase.storage.from("room-images").getPublicUrl(path);
  await supabase.from("trip_plans").update({ image_url: urlData.publicUrl }).eq("id", id);

  revalidatePath(`/admin/trip-plans/${id}/edit`);
  revalidatePath("/reviews");
}
