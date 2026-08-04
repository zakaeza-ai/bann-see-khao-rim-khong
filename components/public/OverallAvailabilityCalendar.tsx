import Link from "next/link";
import { getMonthlyAvailability } from "@/lib/data/availability";

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export async function OverallAvailabilityCalendar({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const days = await getMonthlyAvailability(year, month);
  const firstDay = new Date(year, month - 1, 1);
  const startWeekday = firstDay.getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextMonth = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  return (
    <div className="resort-card p-5 max-w-3xl mx-auto mb-10 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/rooms?year=${prevMonth.y}&month=${prevMonth.m}`}
          className="px-3 py-1.5 rounded-full text-sm text-river-600 hover:bg-river-50 dark:hover:bg-[#16273a]"
        >
          ← เดือนก่อน
        </Link>
        <h2 className="font-semibold text-river-900 dark:text-river-100">
          ห้องว่างเดือน {THAI_MONTHS[month - 1]} {year + 543}
        </h2>
        <Link
          href={`/rooms?year=${nextMonth.y}&month=${nextMonth.m}`}
          className="px-3 py-1.5 rounded-full text-sm text-river-600 hover:bg-river-50 dark:hover:bg-[#16273a]"
        >
          เดือนถัดไป →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-river-500 mb-2">
        {THAI_DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateObj = new Date(day.date);
          const isPast = dateObj < today;
          const ratio = day.totalRooms > 0 ? day.availableRooms / day.totalRooms : 0;

          let colorClass = "bg-river-50 text-river-700 dark:bg-[#16273a] dark:text-river-300";
          if (isPast) {
            colorClass = "bg-gray-50 text-gray-300 dark:bg-[#0b1520] dark:text-gray-600";
          } else if (day.availableRooms === 0) {
            colorClass = "bg-red-50 text-red-500 dark:bg-red-950/30";
          } else if (ratio <= 0.3) {
            colorClass = "bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-300";
          } else {
            colorClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300";
          }

          return (
            <div key={day.date} className={`rounded-lg p-1.5 text-center ${colorClass}`}>
              <p className="text-xs font-semibold">{dateObj.getDate()}</p>
              {!isPast && (
                <p className="text-[10px] mt-0.5">
                  {day.availableRooms > 0 ? `ว่าง ${day.availableRooms}` : "เต็ม"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-river-500 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-emerald-100 inline-block" /> ว่างมาก
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-gold-100 inline-block" /> เหลือน้อย
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-red-100 inline-block" /> เต็ม
        </span>
      </div>
    </div>
  );
}