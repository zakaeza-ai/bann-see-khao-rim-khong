import { createPublicClient } from "@/lib/supabase/public";
import type { Coupon, Attraction, Review } from "@/types/database";

export async function getActivePromotions(): Promise<Coupon[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_active", true)
    .gte("expiry_date", today)
    .order("expiry_date", { ascending: true });

  return error || !data ? [] : data;
}

export async function getAttractions(): Promise<Attraction[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("attractions")
    .select("*")
    .order("sort_order", { ascending: true });

  return error || !data ? [] : data;
}

export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return error || !data ? [] : data;
}
export interface PromotionPostView {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  media: { id: string; media_type: "image" | "video"; url: string }[];
}

export async function getActivePromotionPosts(): Promise<PromotionPostView[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("promotion_posts")
    .select("*, promotion_post_media(*)")
    .eq("status", "published")
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("sort_order", { ascending: true });
  if (error) {
  console.error("getActivePromotionPosts error:", error);
  return [];
}
if (!data) return [];

  return data.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    start_date: p.start_date,
    end_date: p.end_date,
    media: (p.promotion_post_media ?? []).map(
      (m: { id: string; media_type: "image" | "video"; storage_path: string }) => ({
        id: m.id,
        media_type: m.media_type,
        url: supabase.storage.from("promotion-media").getPublicUrl(m.storage_path).data.publicUrl,
      })
    ),
  }));
}