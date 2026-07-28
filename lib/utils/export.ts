import type { ReportBookingRow } from "@/lib/data/reports";

const STATUS_TH: Record<string, string> = {
  pending: "รอยืนยัน",
  confirmed: "ยืนยันแล้ว",
  checked_in: "เช็คอินแล้ว",
  checked_out: "เช็คเอาท์แล้ว",
  cancelled: "ยกเลิก",
};

/** Export รายการจองเป็นไฟล์ Excel (.xlsx) — โหลดไลบรารีแบบ dynamic import เพื่อลดขนาด bundle ฝั่ง client */
export async function exportBookingsToExcel(rows: ReportBookingRow[], fileName: string) {
  const XLSX = await import("xlsx");

  const sheetData = rows.map((r) => ({
    "เลขที่จอง": r.booking_code,
    "ห้องพัก": r.room_name,
    "ผู้เข้าพัก": r.guest_name,
    "เบอร์โทร": r.guest_phone,
    "เช็คอิน": r.check_in,
    "เช็คเอาท์": r.check_out,
    "สถานะ": STATUS_TH[r.status] ?? r.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  worksheet["!cols"] = [
    { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "รายการจอง");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Export รายการจองเป็นไฟล์ PDF
 * หมายเหตุสำคัญ: jsPDF ไม่รองรับฟอนต์ภาษาไทยในตัว (built-in font เป็นละติน) ข้อความไทยในไฟล์ PDF
 * ที่ได้อาจแสดงผลไม่ถูกต้อง วิธีแก้ที่แนะนำคือ embed ฟอนต์ไทย (เช่น Noto Sans Thai .ttf แปลงเป็น base64)
 * ด้วย doc.addFont() ก่อน deploy จริง — รายละเอียด: https://github.com/parallax/jsPDF#use-of-unicode-characters--utf-8
 */
export async function exportBookingsToPDF(rows: ReportBookingRow[], fileName: string, title: string) {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);

  (doc as any).autoTable({
    startY: 22,
    head: [["เลขที่จอง", "ห้องพัก", "ผู้เข้าพัก", "เช็คอิน", "เช็คเอาท์", "สถานะ"]],
    body: rows.map((r) => [
      r.booking_code,
      r.room_name,
      r.guest_name,
      r.check_in,
      r.check_out,
      STATUS_TH[r.status] ?? r.status,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [14, 165, 233] },
  });

  doc.save(`${fileName}.pdf`);
}
