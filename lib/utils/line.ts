/**
 * LINE OA รองรับ 2 รูปแบบลิงก์:
 * 1) https://line.me/R/ti/p/@xxxxx            -> แค่แอดเพื่อน ไม่มีข้อความล่วงหน้า
 * 2) https://line.me/R/oaMessage/@xxxxx/?TEXT -> แอดเพื่อน + พิมพ์ข้อความให้อัตโนมัติ (ต้องตั้งค่า NEXT_PUBLIC_LINE_OA_ID)
 *
 * ถ้าตั้งค่า NEXT_PUBLIC_LINE_OA_ID ไว้ (เช่น "@baansikhaorimkhong") จะใช้แบบที่ 2 เพื่อความสะดวกของลูกค้า
 * ถ้าไม่ตั้งค่า จะ fallback ไปที่ NEXT_PUBLIC_LINE_OA_URL แบบธรรมดา
 */
export function buildLineUrl(message?: string): string {
  const oaId = process.env.NEXT_PUBLIC_LINE_OA_ID;
  const fallbackUrl = process.env.NEXT_PUBLIC_LINE_OA_URL ?? "https://line.me/";

  if (oaId && message) {
    return `https://line.me/R/oaMessage/${encodeURIComponent(oaId)}/?${encodeURIComponent(message)}`;
  }
  return fallbackUrl;
}

export function buildBookingMessage(roomName: string, checkIn?: Date, checkOut?: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
  let msg = `สวัสดีค่ะ/ครับ สนใจจองห้อง "${roomName}"`;
  if (checkIn && checkOut) {
    msg += ` เช็คอิน ${fmt(checkIn)} เช็คเอาท์ ${fmt(checkOut)}`;
  }
  return msg;
}
