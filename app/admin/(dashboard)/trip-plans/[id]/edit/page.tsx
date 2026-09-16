import { createClient } from "@/lib/supabase/server";
import { TripPlanForm } from "@/components/admin/TripPlanForm";
import { uploadTripPlanImageAction } from "@/lib/actions/trip-plans";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EditTripPlanPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: tripPlan } = await supabase
    .from("trip_plans")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!tripPlan) notFound();

  const uploadAction = uploadTripPlanImageAction.bind(null, tripPlan.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">แก้ไขแผนเที่ยว</h1>
        <TripPlanForm tripPlan={tripPlan} />
      </div>

      <div className="resort-card p-6 max-w-xl space-y-4">
        <h2 className="font-semibold text-river-900 dark:text-river-100">รูปภาพ</h2>
        {tripPlan.image_url && (
          <div className="relative h-40 w-full rounded-lg overflow-hidden">
            <Image src={tripPlan.image_url} alt={tripPlan.title} fill className="object-cover" />
          </div>
        )}
        <form action={uploadAction} className="flex items-center gap-3">
          <input type="file" name="image" accept="image/*" required className="text-sm" />
          <button
            type="submit"
            className="rounded-full bg-river-600 hover:bg-river-700 text-white px-5 py-2 text-sm font-semibold"
          >
            อัปโหลด
          </button>
        </form>
      </div>
    </div>
  );
}
