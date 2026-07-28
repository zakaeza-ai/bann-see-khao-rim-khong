"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface BookingFormState {
  error?: string;
}

const OVERLAP_ERROR = "no_overlapping_bookings";

/** แอดมินบันทึกการจองที่รับผ่าน LINE เข้าระบบ เพื่อบล็อกวันที่ในปฏิทินและกัน Double Booking */
export async function createBookingAction(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const supabase = createClient();

  const payload = {
    room_id: String(formData.get("room_id") ?? ""),
    guest_name: String(formData.get("guest_name") ?? "").trim(),
    guest_phone: String(formData.get("guest_phone") ?? "").trim(),
    check_in: String(formData.get("check_in") ?? ""),
    check_out: String(formData.get("check_out") ?? ""),
    notes: String(formData.get("notes") ?? "").trim(),
    source: "admin" as const,
    status: "confirmed" as const,
  };

  if (!payload.room_id || !payload.guest_name || !payload.guest_phone) {
    return { error: "กรุณากรอกห้อง ชื่อผู้เข้าพัก และเบอร์โทรให้ครบ" };
  }
  if (!payload.check_in || !payload.check_out || payload.check_out <= payload.check_in) {
    return { error: "กรุณาเลือกวันเช็คอิน-เช็คเอาท์ให้ถูกต้อง" };
  }

  const { error } = await supabase.from("bookings").insert(payload);

  if (error) {
    // Exclusion constraint ของฐานข้อมูลจะ throw error ตัวนี้เมื่อช่วงวันที่ทับกับการจองเดิม (กัน Overbooking)
    if (error.message.includes(OVERLAP_ERROR) || error.code === "23P01") {
      return { error: "ห้องนี้ถูกจองแล้วในช่วงวันที่เลือก กรุณาเลือกวันอื่นหรือห้องอื่น" };
    }
    return { error: "บันทึกไม่สำเร็จ: " + error.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/rooms");
  return {};
}

export async function updateBookingAction(
  bookingId: string,
  updates: {
    room_id?: string;
    check_in?: string;
    check_out?: string;
    guest_name?: string;
    guest_phone?: string;
  }
): Promise<BookingFormState> {
  const supabase = createClient();
  const { error } = await supabase.from("bookings").update(updates).eq("id", bookingId);

  if (error) {
    if (error.message.includes(OVERLAP_ERROR) || error.code === "23P01") {
      return { error: "ห้องนี้ถูกจองแล้วในช่วงวันที่เลือก ไม่สามารถเปลี่ยนแปลงได้" };
    }
    return { error: "แก้ไขไม่สำเร็จ: " + error.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/rooms");
  return {};
}

export async function cancelBookingAction(bookingId: string) {
  const supabase = createClient();
  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
  revalidatePath("/admin/bookings");
  revalidatePath("/rooms");
}

export async function checkInAction(bookingId: string) {
  const supabase = createClient();
  await supabase.from("bookings").update({ status: "checked_in" }).eq("id", bookingId);
  revalidatePath("/admin/bookings");
}

export async function checkOutAction(bookingId: string) {
  const supabase = createClient();
  await supabase.from("bookings").update({ status: "checked_out" }).eq("id", bookingId);
  revalidatePath("/admin/bookings");
}
