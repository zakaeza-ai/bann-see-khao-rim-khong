import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-river-50 dark:bg-[#0b1520]">
      <p className="text-6xl mb-4">🏞️</p>
      <h1 className="text-3xl font-bold text-river-900 dark:text-river-100 mb-2">ไม่พบหน้านี้</h1>
      <p className="text-river-500 mb-6">หน้าที่คุณค้นหาอาจถูกย้ายหรือไม่มีอยู่จริง</p>
      <Link href="/" className="rounded-full bg-river-600 hover:bg-river-700 text-white px-6 py-2.5 font-semibold">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
