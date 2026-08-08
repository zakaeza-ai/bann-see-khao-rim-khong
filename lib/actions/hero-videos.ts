"use server";

import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { revalidatePath } from "next/cache";

export interface HeroVideo {
  id: string;
  slot: number;
  title: string;
  video_url: string | null;
  poster_url: string | null;
  updated_at: string;
}

/** ดึงวิดีโอ hero ทั้ง 2 slot สำหรับหน้าแรก (public) */
export async function getHeroVideos(): Promise<HeroVideo[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("hero_videos")
    .select("*")
    .order("slot", { ascending: true });

  if (error || !data) return [];
  return data;
}

/** อัปโหลดวิดีโอ hero ตาม slot (1 หรือ 2) */
export async function uploadHeroVideoAction(
  slot: number,
  formData: FormData
) {
  const supabase = createClient();
  const file = formData.get("video") as File;

  if (!file || file.size === 0) {
    return { error: "กรุณาเลือกไฟล์วิดีโอ" };
  }

  const ext = file.name.split(".").pop();
  const path = `slot-${slot}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("hero-videos")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: "อัปโหลดไม่สำเร็จ: " + uploadError.message };
  }

  const { data: urlData } = supabase.storage
    .from("hero-videos")
    .getPublicUrl(path);

  await supabase
    .from("hero_videos")
    .update({ video_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  revalidatePath("/admin/hero-videos");
  revalidatePath("/");
  return {};
}

/** ลบวิดีโอ hero ตาม slot */
export async function removeHeroVideoAction(slot: number) {
  const supabase = createClient();
  await supabase
    .from("hero_videos")
    .update({ video_url: null })
    .eq("slot", slot);

  revalidatePath("/admin/hero-videos");
  revalidatePath("/");
  return {};
}