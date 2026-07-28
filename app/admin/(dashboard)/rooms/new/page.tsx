import { createClient } from "@/lib/supabase/server";
import { RoomForm } from "@/components/admin/RoomForm";

export default async function NewRoomPage() {
  const supabase = createClient();
  const { data: amenities } = await supabase.from("amenities").select("*").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">เพิ่มห้องพักใหม่</h1>
      <RoomForm amenities={amenities ?? []} />
      <p className="text-xs text-river-400 mt-3 max-w-3xl">
        * บันทึกข้อมูลห้องก่อน แล้วจึงเข้ามาอัปโหลดรูปภาพได้ในหน้าแก้ไขห้อง
      </p>
    </div>
  );
}
