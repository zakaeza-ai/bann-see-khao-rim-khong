import { createPublicClient } from "@/lib/supabase/public";
import type { RoomWithDetails } from "@/types/database";

/** ดึงห้องพักทั้งหมดที่เปิดขาย พร้อมรูปภาพและสิ่งอำนวยความสะดวก */
export async function getAvailableRooms(): Promise<RoomWithDetails[]> {
  const supabase = createPublicClient();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("status", "available")
    .order("sort_order", { ascending: true });

  if (error || !rooms) return [];

  return attachRoomDetails(supabase, rooms);
}

/** ดึงห้องพัก 1 ห้องตาม id พร้อมรายละเอียดครบ (ใช้หน้ารายละเอียดห้อง) */
export async function getRoomById(id: string): Promise<RoomWithDetails | null> {
  const supabase = createPublicClient();

  const { data: room, error } = await supabase.from("rooms").select("*").eq("id", id).single();
  if (error || !room) return null;

  const [withDetails] = await attachRoomDetails(supabase, [room]);
  return withDetails ?? null;
}

// ฟังก์ชันช่วยแนบรูปภาพ + สิ่งอำนวยความสะดวกให้กับห้องพักแต่ละห้อง
async function attachRoomDetails(
  supabase: ReturnType<typeof createPublicClient>,
  rooms: any[]
): Promise<RoomWithDetails[]> {
  const roomIds = rooms.map((r) => r.id);
  if (roomIds.length === 0) return [];

  const [{ data: images }, { data: roomAmenities }] = await Promise.all([
    supabase.from("room_images").select("*").in("room_id", roomIds).order("sort_order"),
    supabase
      .from("room_amenities")
      .select("room_id, amenities(id, name, icon_key)")
      .in("room_id", roomIds),
  ]);

  return rooms.map((room) => ({
    ...room,
    room_images: (images ?? []).filter((img) => img.room_id === room.id),
    amenities: (roomAmenities ?? [])
      .filter((ra: any) => ra.room_id === room.id)
      .map((ra: any) => ra.amenities)
      .filter(Boolean),
  }));
}
