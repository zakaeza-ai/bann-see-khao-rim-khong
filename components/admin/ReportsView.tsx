"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FileSpreadsheet, FileText, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";
import { exportBookingsToExcel, exportBookingsToPDF } from "@/lib/utils/export";
import type { OccupancyPoint, TopRoomStat, ReportBookingRow } from "@/lib/data/reports";

export function ReportsView({
  occupancy,
  topRooms,
  reportRows,
  avgOccupancy,
  totalRooms,
  periodLabel,
}: {
  occupancy: OccupancyPoint[];
  topRooms: TopRoomStat[];
  reportRows: ReportBookingRow[];
  avgOccupancy: number;
  totalRooms: number;
  periodLabel: string;
}) {
  const chartData = occupancy.map((o) => ({
    day: new Date(o.date).getDate(),
    rate: o.occupancyRate,
  }));

  async function handleExportExcel() {
    if (reportRows.length === 0) return toast.error("ไม่มีข้อมูลให้ Export");
    await exportBookingsToExcel(reportRows, `bookings-${periodLabel}`);
    toast.success("Export Excel สำเร็จ");
  }

  async function handleExportPDF() {
    if (reportRows.length === 0) return toast.error("ไม่มีข้อมูลให้ Export");
    await exportBookingsToPDF(reportRows, `bookings-${periodLabel}`, `รายงานการจอง ${periodLabel}`);
    toast.success("Export PDF สำเร็จ");
  }

  return (
    <div className="space-y-6">
      {/* สรุปตัวเลขหลัก */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="resort-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-river-100 dark:bg-river-900/30 text-river-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-river-500">Occupancy Rate เฉลี่ย</p>
            <p className="text-2xl font-bold text-river-900 dark:text-river-100">{avgOccupancy}%</p>
          </div>
        </div>
        <div className="resort-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-gold-100 text-gold-600">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs text-river-500">ห้องยอดนิยม</p>
            <p className="text-lg font-bold text-river-900 dark:text-river-100">
              {topRooms[0]?.roomName ?? "-"}
            </p>
          </div>
        </div>
        <div className="resort-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-river-500">จำนวนห้องทั้งหมด</p>
            <p className="text-2xl font-bold text-river-900 dark:text-river-100">{totalRooms}</p>
          </div>
        </div>
      </div>

      {/* กราฟ Occupancy Rate รายวัน */}
      <div className="resort-card p-6">
        <h3 className="font-semibold text-river-800 dark:text-river-200 mb-4">Occupancy Rate รายวัน ({periodLabel})</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip formatter={(v: number) => [`${v}%`, "Occupancy"]} labelFormatter={(d) => `วันที่ ${d}`} />
            <Bar dataKey="rate" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Room ranking */}
      <div className="resort-card overflow-x-auto">
        <div className="px-6 py-4 border-b border-river-50 dark:border-[#16273a]">
          <h3 className="font-semibold text-river-800 dark:text-river-200">ห้องยอดนิยม (Top Room)</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
            <tr>
              <th className="text-left px-4 py-3">อันดับ</th>
              <th className="text-left px-4 py-3">ห้อง</th>
              <th className="text-right px-4 py-3">จำนวนคืนที่ถูกจอง</th>
              <th className="text-right px-4 py-3">จำนวนครั้งที่จอง</th>
            </tr>
          </thead>
          <tbody>
            {topRooms.map((r, i) => (
              <tr key={r.roomId} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-bold text-gold-600">#{i + 1}</td>
                <td className="px-4 py-3">{r.roomName}</td>
                <td className="px-4 py-3 text-right">{r.bookedNights}</td>
                <td className="px-4 py-3 text-right">{r.bookingCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topRooms.length === 0 && <p className="text-center text-river-500 py-8">ยังไม่มีข้อมูลการจองในช่วงนี้</p>}
      </div>

      {/* ปุ่ม Export */}
      <div className="flex gap-3">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <FileSpreadsheet size={16} /> Export Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <FileText size={16} /> Export PDF
        </button>
      </div>
    </div>
  );
}
