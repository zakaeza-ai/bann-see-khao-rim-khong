import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AttractionForm } from "@/components/admin/AttractionForm";
import { AttractionImageManager } from "@/components/admin/AttractionImageManager";

export default async function EditAttractionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: attraction } = await supabase.from("attractions").select("*").eq("id", params.id).single();

  if (!attraction) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">
          แก้ไขสถานที่: {attraction.name}
        </h1>
        <AttractionForm attraction={attraction} />
      </div>

      <AttractionImageManager id={attraction.id} imageUrl={attraction.image_url} />
    </div>
  );
}