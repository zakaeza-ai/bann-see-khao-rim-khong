"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface RoomFormState {
  error?: string;
}

/** เพิ่ม/แก้ไขห้องพัก — ถ้ามี roomId แปลว่าแก้ไข ถ้าไม่มีแปลว่าเพิ่มใหม่ */
export async function saveRoomAction(
  roomId: string | null,
  _prevState: RoomFormState,
  formData: FormData
): Promise<RoomFormState> {
  const supabase = createClient();

  const payload = {
    room_code: String(formData.get("room_code") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    capacity: Number(formData.get("capacity") ?? 1),
    bed_type: String(formData.get("bed_type") ?? "").trim(),
    room_size_sqm: formData.get("room_size_sqm") ? Number(formData.get("room_size_sqm")) : null,
    price_normal: Number(formData.get("price_normal") ?? 0),
    price_weekend: Number(formData.get("price_weekend") ?? 0),
    price_festival: Number(formData.get("price_festival") ?? 0),
    status: String(formData.get("status") ?? "available"),
  };

  // Validation พื้นฐาน (ตรวจสอบข้อมูลทุกช่อง)
  if (!payload.room_code || !payload.name || !payload.type) {
    return { error: "กรุณากรอกรหัสห้อง ชื่อห้อง และประเภทห้องให้ครบ" };
  }
  if (payload.capacity <= 0) return { error: "จำนวนผู้เข้าพักต้องมากกว่า 0" };
  if (payload.price_normal < 0 || payload.price_weekend < 0 || payload.price_festival < 0) {
    return { error: "ราคาต้องไม่ติดลบ" };
  }

  // กันรหัสห้องซ้ำ (กันข้อมูลซ้ำ)
  const dupQuery = supabase.from("rooms").select("id").eq("room_code", payload.room_code);
  const { data: dup } = roomId ? await dupQuery.neq("id", roomId).maybeSingle() : await dupQuery.maybeSingle();
  if (dup) return { error: "รหัสห้องนี้ถูกใช้แล้ว กรุณาใช้รหัสอื่น" };

  const amenityIds = formData.getAll("amenity_ids") as string[];

  let newRoomId = roomId;
  if (roomId) {
    const { error } = await supabase.from("rooms").update(payload).eq("id", roomId);
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
  } else {
    const { data, error } = await supabase.from("rooms").insert(payload).select("id").single();
    if (error) return { error: "บันทึกไม่สำเร็จ: " + error.message };
    newRoomId = data.id;
  }

  // อัปเดตสิ่งอำนวยความสะดวก: ลบของเดิมแล้วเพิ่มใหม่ตามที่เลือก
  if (newRoomId) {
    await supabase.from("room_amenities").delete().eq("room_id", newRoomId);
    if (amenityIds.length > 0) {
      await supabase
        .from("room_amenities")
        .insert(amenityIds.map((amenity_id) => ({ room_id: newRoomId, amenity_id })));
    }
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect("/admin/rooms");
}

export async function deleteRoomAction(roomId: string) {
  const supabase = createClient();
  await supabase.from("rooms").delete().eq("id", roomId);
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
}

/** อัปโหลดรูปห้องพักหลายรูปไปยัง Supabase Storage bucket "room-images" แล้วบันทึก URL ลงตาราง room_images */
export async function uploadRoomImagesAction(roomId: string, formData: FormData) {
  const supabase = createClient();
  const files = formData.getAll("images") as File[];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${roomId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("room-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) continue;

    const { data: urlData } = supabase.storage.from("room-images").getPublicUrl(path);

    await supabase.from("room_images").insert({
      room_id: roomId,
      image_url: urlData.publicUrl,
      is_cover: false,
    });
  }

  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath("/rooms");
}

export async function deleteRoomImageAction(imageId: string, roomId: string) {
  const supabase = createClient();
  await supabase.from("room_images").delete().eq("id", imageId);
  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath("/rooms");
}

export async function setCoverImageAction(imageId: string, roomId: string) {
  const supabase = createClient();
  await supabase.from("room_images").update({ is_cover: false }).eq("room_id", roomId);
  await supabase.from("room_images").update({ is_cover: true }).eq("id", imageId);
  revalidatePath(`/admin/rooms/${roomId}/edit`);
  revalidatePath("/rooms");
}
