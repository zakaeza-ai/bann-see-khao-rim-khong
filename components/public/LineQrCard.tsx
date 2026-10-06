"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buildLineUrl, getLineOaId } from "@/lib/utils/line";

/**
 * การ์ดแอดไลน์ — QR สำหรับคนเปิดจากคอม + ปุ่มสำหรับคนเปิดจากมือถือ
 *
 * ทำไมต้องมี QR ด้วยทั้งที่มีปุ่มแล้ว:
 * ลูกค้าที่วางแผนทริปมักเปิดเว็บบนคอม กดปุ่มแล้วเด้งไปหน้าเว็บ LINE
 * ซึ่งต้องล็อกอินหรือสแกนอีกที มี QR ให้ยกมือถือสแกนตรงนี้เลยจบในขั้นตอนเดียว
 *
 * รูป QR วางไว้ที่ public/line-qr.png (โหลดจาก LINE OA Manager > เพิ่มเพื่อน > QR code)
 */
export function LineQrCard() {
  const oaId = getLineOaId();
  const url = buildLineUrl();

  return (
    <div className="resort-card p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* QR — คนใช้คอมสแกนจากมือถือได้เลย */}
        <div className="shrink-0 rounded-2xl bg-white p-4 shadow-md">
          <Image
            src="/line-qr.png"
            alt="QR code สำหรับแอดไลน์ บ้านสีขาวริมโขง"
            width={200}
            height={200}
            className="h-[200px] w-[200px] object-contain"
            priority={false}
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <h2 className="text-xl font-bold text-river-900 dark:text-river-100">
            แอดไลน์เพื่อจองห้องพัก
          </h2>

          <p className="text-sm text-river-600 dark:text-river-400">
            สแกน QR จากมือถือ หรือกดปุ่มด้านล่างได้เลยค่ะ
            <br />
            แจ้งวันที่เข้าพักแล้วระบบจะเช็คห้องว่างให้ทันที ตอบ 24 ชั่วโมง
          </p>

          {oaId && (
            <p className="text-sm font-semibold text-river-800 dark:text-river-200">
              LINE ID: {oaId}
            </p>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-white font-semibold shadow-md hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <MessageCircle size={20} />
            แอดไลน์เลย
          </a>
        </div>
      </div>
    </div>
  );
}
