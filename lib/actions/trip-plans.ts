"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTripPlanAction(formData: FormData) {
  const supabase = createClient();

  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const image_url = String(formData.get("image_url") ?? "");
  const sort_order = Number(formData.get("sort_order") ?? 0);

  await supabase.from("trip_plans").insert({
    title,
    description: description || null,
    image_url: image_url || null,
    sort_order,
  });

  revalidatePath("/admin/trip-plans");
  redirect("/admin/trip-plans");
}

export async function updateTripPlanAction(id: string, formData: FormData) {
  const supabase = createClient();

  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const image_url = String(formData.get("image_url") ?? "");
  const sort_order = Number(formData.get("sort_order") ?? 0);

  await supabase
    .from("trip_plans")
    .update({
      title,
      description: description || null,
      image_url: image_url || null,
      sort_order,
    })
    .eq("id", id);

  revalidatePath("/admin/trip-plans");
  redirect("/admin/trip-plans");
}

export async function deleteTripPlanAction(id: string) {
  const supabase = createClient();
  await supabase.from("trip_plans").delete().eq("id", id);
  revalidatePath("/admin/trip-plans");
}
