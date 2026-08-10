"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PromotionPostFormState {
  error?: string;
}

export async function addPromotionPostAction(
  _prev: PromotionPostFormState,
  formData: FormData
): Promise<PromotionPostFormState> {
  const supabase = createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "") || null;
  const endDate = String(formData.get("end_date") ?? "") || null;

  if (!title) return { error: "กรุณากรอกชื่อโปรโมชั่น" };

  // 1. สร้างโพสต์ก่อน
  const { data: post, error: insertError } = await supabase
    .from("promotion_posts")
    .insert({
      title,
      description: description || null,
      start_date: startDate,
      end_date: endDate,
      status: "draft",
    })
    .select("id")
    .single();

  if (insertError || !post) {
    return { error: "บันทึกโปรโมชั่นไม่สำเร็จ: " + insertError?.message };
  }

  // 2. อัปโหลดไฟล์ภาพ (หลายไฟล์)
  const images = formData.getAll("images") as File[];
  const video = formData.get("video") as File | null;
  const mediaRows: { post_id: string; media_type: string; storage_path: string; sort_order: number }[] = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (!file || file.size === 0) continue;
    const path = `${post.id}/image-${i}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: upErr } = await supabase.storage
      .from("promotion-media")
      .upload(path, file, { contentType: file.type });
    if (upErr) return { error: "อัปโหลดภาพไม่สำเร็จ: " + upErr.message };
    mediaRows.push({ post_id: post.id, media_type: "image", storage_path: path, sort_order: i });
  }

  if (video && video.size > 0) {
    const path = `${post.id}/video-${Date.now()}.${video.name.split(".").pop()}`;
    const { error: upErr } = await supabase.storage
      .from("promotion-media")
      .upload(path, video, { contentType: video.type });
    if (upErr) return { error: "อัปโหลดวิดีโอไม่สำเร็จ: " + upErr.message };
    mediaRows.push({ post_id: post.id, media_type: "video", storage_path: path, sort_order: 0 });
  }

  if (mediaRows.length > 0) {
    const { error: mediaError } = await supabase.from("promotion_post_media").insert(mediaRows);
    if (mediaError) return { error: "บันทึกไฟล์แนบไม่สำเร็จ: " + mediaError.message };
  }

  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
  return {};
}

export async function togglePromotionPostAction(id: string, status: "draft" | "published") {
  const supabase = createClient();
  await supabase.from("promotion_posts").update({ status }).eq("id", id);
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}

export async function deletePromotionPostAction(id: string) {
  const supabase = createClient();

  // ลบไฟล์ใน Storage ก่อน
  const { data: mediaList } = await supabase
    .from("promotion_post_media")
    .select("storage_path")
    .eq("post_id", id);

  if (mediaList && mediaList.length > 0) {
    await supabase.storage.from("promotion-media").remove(mediaList.map((m) => m.storage_path));
  }

  await supabase.from("promotion_posts").delete().eq("id", id);
  revalidatePath("/admin/promotions");
  revalidatePath("/promotions");
}