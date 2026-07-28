"use client";

import { useState, useTransition } from "react";
import { Pencil, X, Check, LogIn, LogOut, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  updateBookingAction,
  cancelBookingAction,
  checkInAction,
  checkOutAction,
} from "@/lib/actions/bookings";
import { Badge } from "@/components/ui/Badge";
import type { Room, BookingStatus } from "@/types/database";

interface BookingRow {
  id: string;
  booking_code: string;
  room_id: string;
  room_name: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
}

const STATUS_LABEL: Record<BookingStatus, { text: string; variant: "success" | "danger" | "gold" | "river" }> = {
  pending: { text: "รอยืนยัน", variant: "gold" },
  confirmed: { text: "ยืนยันแล้ว", variant: "river" },
  checked_in: { text: "เช็คอินแล้ว", variant: "success" },
  checked_out: { text: "เช็คเอาท์แล้ว", variant: "river" },
  cancelled: { text: "ยกเลิก", variant: "danger" },
};

export function BookingsTable({ bookings, rooms }: { bookings: BookingRow[]; rooms: Room[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="resort-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
          <tr>
            <th className="text-left px-4 py-3">เลขที่จอง</th>
            <th className="text-left px-4 py-3">ห้อง</th>
            <th className="text-left px-4 py-3">ผู้เข้าพัก</th>
            <th className="text-left px-4 py-3">เช็คอิน</th>
            <th className="text-left px-4 py-3">เช็คเอาท์</th>
            <th className="text-center px-4 py-3">สถานะ</th>
            <th className="text-right px-4 py-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) =>
            editingId === b.id ? (
              <EditRow
                key={b.id}
                booking={b}
                rooms={rooms}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <tr key={b.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3 font-mono text-xs">{b.booking_code}</td>
                <td className="px-4 py-3">{b.room_name}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.guest_name}</p>
                  <p className="text-xs text-river-400">{b.guest_phone}</p>
                </td>
                <td className="px-4 py-3">{b.check_in}</td>
                <td className="px-4 py-3">{b.check_out}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={STATUS_LABEL[b.status].variant}>{STATUS_LABEL[b.status].text}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {b.status === "confirmed" && (
                      <button
                        title="เช็คอิน"
                        disabled={pending}
                        onClick={() => startTransition(async () => { await checkInAction(b.id); toast.success("เช็คอินแล้ว"); })}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600"
                      >
                        <LogIn size={15} />
                      </button>
                    )}
                    {b.status === "checked_in" && (
                      <button
                        title="เช็คเอาท์"
                        disabled={pending}
                        onClick={() => startTransition(async () => { await checkOutAction(b.id); toast.success("เช็คเอาท์แล้ว"); })}
                        className="p-2 rounded-lg hover:bg-river-50 text-river-600"
                      >
                        <LogOut size={15} />
                      </button>
                    )}
                    {(b.status === "confirmed" || b.status === "pending") && (
                      <button title="แก้ไข" onClick={() => setEditingId(b.id)} className="p-2 rounded-lg hover:bg-river-50 text-river-600">
                        <Pencil size={15} />
                      </button>
                    )}
                    {b.status !== "cancelled" && b.status !== "checked_out" && (
                      <button
                        title="ยกเลิกการจอง"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm("ยืนยันยกเลิกการจองนี้?")) return;
                          startTransition(async () => { await cancelBookingAction(b.id); toast.success("ยกเลิกการจองแล้ว"); });
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {bookings.length === 0 && <p className="text-center text-river-500 py-10">ไม่พบรายการจอง</p>}
    </div>
  );
}

function EditRow({
  booking,
  rooms,
  onDone,
}: {
  booking: BookingRow;
  rooms: Room[];
  onDone: () => void;
}) {
  const [roomId, setRoomId] = useState(booking.room_id);
  const [checkIn, setCheckIn] = useState(booking.check_in);
  const [checkOut, setCheckOut] = useState(booking.check_out);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const res = await updateBookingAction(booking.id, { room_id: roomId, check_in: checkIn, check_out: checkOut });
      if (res.error) {
        setError(res.error);
        return;
      }
      toast.success("แก้ไขการจองแล้ว");
      onDone();
    });
  }

  return (
    <tr className="border-t border-river-50 dark:border-[#16273a] bg-river-50/50 dark:bg-[#16273a]/50">
      <td className="px-4 py-3 font-mono text-xs">{booking.booking_code}</td>
      <td className="px-4 py-3">
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-2 py-1 text-xs">
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </td>
      <td className="px-4 py-3 text-xs">{booking.guest_name}</td>
      <td className="px-4 py-3">
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-2 py-1 text-xs" />
      </td>
      <td className="px-4 py-3">
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-2 py-1 text-xs" />
      </td>
      <td className="px-4 py-3 text-center text-xs text-red-500">{error}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button onClick={handleSave} disabled={pending} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600">
            {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          </button>
          <button onClick={onDone} className="p-2 rounded-lg hover:bg-river-100 text-river-500">
            <X size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
