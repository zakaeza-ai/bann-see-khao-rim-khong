import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoomForm } from "@/components/admin/RoomForm";
import { RoomImageManager } from "@/components/admin/RoomImageManager";
import { RoomVideoManager } from "@/components/admin/RoomVideoManager";
export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: room }, { data: amenities }, { data: roomAmenities }, { data: images }] = await Promise.all([
    supabase.from("rooms").select("*").eq("id", params.id).single(),
    supabase.from("amenities").select("*").order("name"),
    supabase.from("room_amenities").select("amenity_id").eq("room_id", params.id),
    supabase.from("room_images").select("*").eq("room_id", params.id).order("sort_order"),
  ]);

  if (!room) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">แก้ไขห้องพัก: {room.name}</h1>
        <RoomForm
          room={room}
          amenities={amenities ?? []}
          selectedAmenityIds={(roomAmenities ?? []).map((ra) => ra.amenity_id)}
        />
      </div>

      <RoomImageManager roomId={room.id} images={images ?? []} />
      <RoomVideoManager roomId={room.id} videoUrl={room.video_url} />
    </div>
  );
}
