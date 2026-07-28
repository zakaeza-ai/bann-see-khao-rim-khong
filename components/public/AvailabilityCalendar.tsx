"use client";

import { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LineBookingButton } from "./LineBookingButton";
import { buildBookingMessage } from "@/lib/utils/line";
import { getTotalPrice, formatTHB } from "@/lib/utils/pricing";
import type { Room, PricePeriod } from "@/types/database";

interface BookedRange {
  check_in: string;
  check_out: string;
}

export function AvailabilityCalendar({ room }: { room: Room }) {
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [pricePeriods, setPricePeriods] = useState<PricePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DateRange | undefined>();

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();

      // ดึงช่วงวันที่ถูกจองแล้วของห้องนี้ (จาก view ที่ไม่เปิดเผยข้อมูลลูกค้า) เพื่อเช็คห้องว่างอัตโนมัติ
      const [{ data: booked }, { data: periods }] = await Promise.all([
        supabase.from("public_booked_dates").select("check_in, check_out").eq("room_id", room.id),
        supabase
          .from("price_periods")
          .select("*")
          .or(`room_id.eq.${room.id},room_id.is.null`),
      ]);

      if (!active) return;
      setBookedRanges(booked ?? []);
      setPricePeriods(periods ?? []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [room.id]);

  // แปลงช่วงที่ถูกจองแล้วเป็น matcher ของ react-day-picker เพื่อ "ไม่สามารถเลือกห้องที่ถูกจองแล้ว"
  const disabledRanges = bookedRanges.map((b) => ({
    from: new Date(b.check_in),
    to: new Date(new Date(b.check_out).getTime() - 86400000), // check_out เป็นแบบ exclusive จึงลบ 1 วัน
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nights =
    selected?.from && selected?.to
      ? Math.round((selected.to.getTime() - selected.from.getTime()) / 86400000)
      : 0;

  const totalPrice =
    selected?.from && selected?.to ? getTotalPrice(room, selected.from, selected.to, pricePeriods) : 0;

  const bookingMessage = selected?.from && selected?.to
    ? buildBookingMessage(room.name, selected.from, selected.to)
    : buildBookingMessage(room.name);

  if (loading) {
    return (
      <div className="resort-card p-8 flex items-center justify-center h-72">
        <Loader2 className="animate-spin text-river-400" size={28} />
      </div>
    );
  }

  return (
    <div className="resort-card p-4 md:p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-river-800 dark:text-river-200">
        <CalendarCheck size={20} className="text-gold-500" />
        เช็กวันว่าง เลือกวันที่ต้องการเข้าพัก
      </h2>

      <DayPicker
        mode="range"
        selected={selected}
        onSelect={setSelected}
        disabled={[{ before: today }, ...disabledRanges]}
        numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
        locale={undefined}
        className="resort-daypicker"
        modifiersClassNames={{
          disabled: "opacity-30 line-through",
          selected: "bg-river-500 text-white",
          range_middle: "bg-river-100 dark:bg-river-900/40",
        }}
      />

      <div className="flex items-center gap-4 mt-4 text-xs text-river-500">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-river-500 inline-block" /> วันที่เลือก
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-river-100 dark:bg-river-900/40 inline-block border border-river-300" /> ว่าง
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-river-50 opacity-30 inline-block border border-river-200 line-through" /> ไม่ว่าง
        </span>
      </div>

      {selected?.from && selected?.to && nights > 0 && (
        <div className="mt-6 border-t border-river-100 dark:border-[#1e2f3f] pt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-river-700 dark:text-river-300">
            <p>{nights} คืน</p>
            <p className="font-bold text-lg text-gold-600">{formatTHB(totalPrice)}</p>
          </div>
          <LineBookingButton roomName={room.name} message={bookingMessage} />
        </div>
      )}

      {(!selected?.from || !selected?.to) && (
        <p className="mt-4 text-xs text-river-400">เลือกวันเช็คอินและเช็คเอาท์บนปฏิทินเพื่อดูราคารวม แล้วกดแอดไลน์เพื่อยืนยันการจอง</p>
      )}
    </div>
  );
}
