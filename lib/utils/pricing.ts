import type { Room, PricePeriod } from "@/types/database";

/**
 * คำนวณราคาห้องต่อคืนสำหรับวันที่ที่กำหนด
 * ลำดับความสำคัญ: price_periods เฉพาะวัน (เทศกาล/วันหยุดพิเศษ) > weekend (ศ-ส) > ราคาปกติ
 */
export function getPriceForDate(
  room: Room,
  date: Date,
  pricePeriods: PricePeriod[] = []
): { price: number; label: string } {
  const dateStr = date.toISOString().slice(0, 10);

  // 1) เช็คว่ามีช่วงราคาพิเศษเฉพาะวันนี้ที่ตั้งไว้ในระบบไหม (ของห้องนี้ หรือของทุกห้อง)
  const matched = pricePeriods.find(
    (p) =>
      (p.room_id === room.id || p.room_id === null) &&
      dateStr >= p.start_date &&
      dateStr <= p.end_date
  );
  if (matched) {
    return { price: matched.override_price, label: matched.label ?? matched.period_type };
  }

  // 2) เช็คว่าเป็นวันศุกร์-เสาร์ (weekend) ไหม
  const day = date.getDay(); // 0 = อาทิตย์, 5 = ศุกร์, 6 = เสาร์
  if (day === 5 || day === 6) {
    return { price: room.price_weekend, label: "วันหยุดสุดสัปดาห์" };
  }

  // 3) ราคาปกติ
  return { price: room.price_normal, label: "ราคาปกติ" };
}

/** คำนวณราคารวมทั้งช่วงพัก (คืนคูณราคาต่อคืนของแต่ละวัน) */
export function getTotalPrice(
  room: Room,
  checkIn: Date,
  checkOut: Date,
  pricePeriods: PricePeriod[] = []
): number {
  let total = 0;
  const current = new Date(checkIn);
  while (current < checkOut) {
    total += getPriceForDate(room, current, pricePeriods).price;
    current.setDate(current.getDate() + 1);
  }
  return total;
}

export function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}
