"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AttractionFormState {
  error?: string;
}

export async function saveAttractionAction(
  attractionId: string | null,
  _prevState: AttractionFormState,
  formData: FormData
): Promise<AttractionFormState> {
  const supabase = createClient();

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    distance_km: formData.get("distance_km") ? Number(formData.get("distance_km")) : null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  if (!payload.name) {
    return { error: "กรุณากรอกชื่อสถานที่" };
  }

  let newId = attractionId;
  if (attractionId) {
    const { error } = await supabase.from("attractions").update(payload).eq("id", attractionId);
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
  } else {
    const { data, error } = await supabase.from("attractions").insert(payload).select("id").single();
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
    newId = data.id;
  }

  revalidatePath("/admin/attractions");
  revalidatePath("/attractions");
  redirect(`/admin/attractions/${newId}/edit`);
}

export async function deleteAttractionAction(id: string) {
  const supabase = createClient();
  await supabase.from("attractions").delete().eq("id", id);
  revalidatePath("/admin/attractions");
  revalidatePath("/attractions");
}

export async function uploadAttractionImageAction(id: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const path = `attractions/${id}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("room-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return;

  const { data: urlData } = supabase.storage.from("room-images").getPublicUrl(path);
  await supabase.from("attractions").update({ image_url: urlData.publicUrl }).eq("id", id);

  revalidatePath(`/admin/attractions/${id}/edit`);
  revalidatePath("/attractions");
}