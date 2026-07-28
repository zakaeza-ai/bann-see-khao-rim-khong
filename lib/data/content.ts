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
