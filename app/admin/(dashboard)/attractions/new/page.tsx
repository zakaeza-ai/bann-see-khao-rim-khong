import { AttractionForm } from "@/components/admin/AttractionForm";

export default function NewAttractionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100 mb-6">เพิ่มสถานที่ท่องเที่ยวใหม่</h1>
      <AttractionForm />
      <p className="text-xs text-river-400 mt-3 max-w-2xl">
        * บันทึกข้อมูลก่อน แล้วจึงเข้ามาอัปโหลดรูปภาพได้ในหน้าแก้ไข
      </p>
    </div>
  );
}