import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-river-800 dark:text-river-200 mb-2">ไม่พบห้องพักนี้</h1>
      <p className="text-river-500 mb-6">ห้องพักอาจถูกลบหรือปิดให้บริการแล้ว</p>
      <Link href="/rooms" className="text-river-600 font-semibold hover:text-gold-600">
        ← กลับไปดูห้องพักทั้งหมด
      </Link>
    </div>
  );
}
