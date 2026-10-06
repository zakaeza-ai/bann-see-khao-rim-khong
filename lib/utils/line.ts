/**
 * ลิงก์ LINE OA
 *
 * ใช้ NEXT_PUBLIC_LINE_OA_ID เป็นแหล่งข้อมูลหลักเพียงที่เดียว
 * แล้วประกอบ URL เอาเอง
 *
 * ทำไมถึงเปลี่ยนมาเป็นแบบนี้ (6 ต.ค. 2026):
 * เดิมมีตัวแปร 2 ตัว (OA_ID กับ OA_URL) ที่ต้องชี้ไปบัญชีเดียวกัน
 * ตอนย้ายจากไลน์ส่วนตัวมาเป็น OA แก้ไปแค่ตัวเดียว
 * ปุ่มบนเว็บเลยพาลูกค้าไปไลน์ส่วนตัวต่ออีกพักใหญ่กว่าจะรู้ตัว
 *
 * NEXT_PUBLIC_LINE_OA_URL ยังรองรับอยู่ แต่ใช้เป็นตัวสำรองเท่านั้น
 * (เผื่อวันหลังใช้ลิงก์รูปแบบอื่น เช่น lin.ee/xxxx)
 *
 * รูปแบบลิงก์ที่ LINE รองรับ:
 *   https://line.me/R/ti/p/@xxxxx            -> แอดเพื่อนเฉย ๆ
 *   https://line.me/R/oaMessage/@xxxxx/?TEXT -> แอดเพื่อน + พิมพ์ข้อความให้อัตโนมัติ
 */

/** คืน LINE ID ที่ตั้งค่าไว้ เติม @ ให้อัตโนมัติถ้าลืมใส่ */
function getOaId(): string {
  const raw = process.env.NEXT_PUBLIC_LINE_OA_ID?.trim();
  if (!raw) return "";
  return raw.startsWith("@") ? raw : `@${raw}`;
}

export function buildLineUrl(message?: string): string {
  const oaId = getOaId();

  if (oaId) {
    return message
      ? `https://line.me/R/oaMessage/${encodeURIComponent(oaId)}/?${encodeURIComponent(message)}`
      : `https://line.me/R/ti/p/${encodeURIComponent(oaId)}`;
  }

  // ไม่ได้ตั้ง OA_ID -> ใช้ URL ที่ตั้งไว้ตรง ๆ
  return process.env.NEXT_PUBLIC_LINE_OA_URL ?? "https://line.me/";
}

/** LINE ID ไว้โชว์บนหน้าเว็บ ว่างได้ถ้ายังไม่ได้ตั้งค่า */
export function getLineOaId(): string {
  return getOaId();
}

export function buildBookingMessage(roomName: string, checkIn?: Date, checkOut?: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
  let msg = `สวัสดีค่ะ/ครับ สนใจจองห้อง "${roomName}"`;
  if (checkIn && checkOut) {
    msg += ` เช็คอิน ${fmt(checkIn)} เช็คเอาท์ ${fmt(checkOut)}`;
  }
  return msg;
}
