"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { buildLineUrl } from "@/lib/utils/line";

interface LineBookingButtonProps {
  roomName?: string;
  message?: string; // ข้อความล่วงหน้า เช่น วันที่เช็คอิน-เช็คเอาท์ ที่เลือกจากปฏิทิน
  className?: string;
  fullWidth?: boolean;
}

/**
 * ปุ่มนี้เป็นช่องทางจองเดียวของเว็บ — กดแล้วเด้งไปแอด LINE OA ทันที
 * ไม่มีระบบจองในเว็บ เพราะร้านมีระบบออกใบจองแยกอยู่แล้ว เว็บนี้ทำหน้าที่แค่ "โชว์ห้องว่าง" แล้วส่งต่อไป LINE
 */
export function LineBookingButton({
  roomName,
  message,
  className,
  fullWidth,
}: LineBookingButtonProps) {
  const handleClick = () => {
    window.open(buildLineUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-white font-semibold shadow-md hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all duration-200",
        fullWidth && "w-full",
        className
      )}
    >
      <MessageCircle size={20} />
      {roomName ? `แอดไลน์จอง "${roomName}"` : "แอดไลน์เพื่อจองห้องพัก"}
    </button>
  );
}
