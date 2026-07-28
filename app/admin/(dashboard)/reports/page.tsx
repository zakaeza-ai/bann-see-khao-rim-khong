import { getMonthlyReport } from "@/lib/data/reports";
import { ReportsView } from "@/components/admin/ReportsView";
import { MonthSelector } from "@/components/admin/MonthSelector";

export const dynamic = "force-dynamic";

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) {
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  const { occupancy, topRooms, reportRows, totalRooms, avgOccupancy } = await getMonthlyReport(year, month);

  // สร้างตัวเลือกเดือนย้อนหลัง 12 เดือนสำหรับ dropdown
  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, label: `${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}` };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">รายงาน</h1>
        <MonthSelector options={monthOptions} currentYear={year} currentMonth={month} />
      </div>

      <ReportsView
        occupancy={occupancy}
        topRooms={topRooms}
        reportRows={reportRows}
        avgOccupancy={avgOccupancy}
        totalRooms={totalRooms}
        periodLabel={`${THAI_MONTHS[month - 1]}-${year}`}
      />
    </div>
  );
}
