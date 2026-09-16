import { TripPlanForm } from "@/components/admin/TripPlanForm";

export default function NewTripPlanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">เพิ่มแผนเที่ยวใหม่</h1>
      <TripPlanForm />
      <p className="text-xs text-river-400 mt-3 max-w-xl">
        * บันทึกข้อมูลก่อน แล้วจึงเข้ามาอัปโหลดรูปภาพได้ในหน้าแก้ไข
      </p>
    </div>
  );
}
