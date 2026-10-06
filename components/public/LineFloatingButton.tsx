"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildLineUrl } from "@/lib/utils/line";

/**
 * ปุ่มแอดไลน์ลอยมุมขวาล่าง ติดตามทุกหน้า
 *
 * ลูกค้าส่วนใหญ่เปิดจากมือถือและเลื่อนดูรูปห้องยาว ๆ
 * ถ้าปุ่มจองอยู่แค่ท้ายหน้า คนที่ตัดสินใจระหว่างทางต้องเลื่อนหา
 *
 * โผล่หลังเลื่อนลงมาหน่อยนึง จะได้ไม่บังรูปแรกที่เป็นจุดขายของเว็บ
 */
export function LineFloatingButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildLineUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="แอดไลน์เพื่อจองห้องพัก"
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:brightness-105 active:scale-95 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">แอดไลน์จองห้อง</span>
    </a>
  );
}
