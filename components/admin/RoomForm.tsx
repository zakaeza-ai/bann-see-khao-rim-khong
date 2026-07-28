"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { saveRoomAction, type RoomFormState } from "@/lib/actions/rooms";
import type { Room, Amenity } from "@/types/database";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      บันทึกข้อมูล
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-river-700 dark:text-river-300 block mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400";

export function RoomForm({
  room,
  amenities,
  selectedAmenityIds = [],
}: {
  room?: Room;
  amenities: Amenity[];
  selectedAmenityIds?: string[];
}) {
  const action = saveRoomAction.bind(null, room?.id ?? null);
  const [state, formAction] = useFormState<RoomFormState, FormData>(action, {});

  return (
    <form action={formAction} className="resort-card p-6 space-y-5 max-w-3xl">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="รหัสห้อง *">
          <input name="room_code" defaultValue={room?.room_code} required className={inputClass} />
        </Field>
        <Field label="ชื่อห้อง *">
          <input name="name" defaultValue={room?.name} required className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="ประเภทห้อง *">
          <input name="type" defaultValue={room?.type} required placeholder="เช่น Deluxe River View" className={inputClass} />
        </Field>
        <Field label="สถานะ">
          <select name="status" defaultValue={room?.status ?? "available"} className={inputClass}>
            <option value="available">เปิดให้บริการ</option>
            <option value="maintenance">ปรับปรุง</option>
            <option value="inactive">ปิดใช้งาน</option>
          </select>
        </Field>
      </div>

      <Field label="รายละเอียดห้องพัก">
        <textarea name="description" defaultValue={room?.description ?? ""} rows={3} className={inputClass} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="จำนวนผู้เข้าพัก *">
          <input name="capacity" type="number" min={1} defaultValue={room?.capacity ?? 2} required className={inputClass} />
        </Field>
        <Field label="ประเภทเตียง">
          <input name="bed_type" defaultValue={room?.bed_type ?? ""} placeholder="เช่น เตียงคิงไซส์" className={inputClass} />
        </Field>
        <Field label="ขนาดห้อง (ตร.ม.)">
          <input name="room_size_sqm" type="number" step="0.1" defaultValue={room?.room_size_sqm ?? ""} className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="ราคาปกติ (บาท) *">
          <input name="price_normal" type="number" min={0} defaultValue={room?.price_normal ?? 0} required className={inputClass} />
        </Field>
        <Field label="ราคาวันหยุด (บาท) *">
          <input name="price_weekend" type="number" min={0} defaultValue={room?.price_weekend ?? 0} required className={inputClass} />
        </Field>
        <Field label="ราคาเทศกาล (บาท) *">
          <input name="price_festival" type="number" min={0} defaultValue={room?.price_festival ?? 0} required className={inputClass} />
        </Field>
      </div>

      <Field label="สิ่งอำนวยความสะดวก">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {amenities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-river-700 dark:text-river-300">
              <input
                type="checkbox"
                name="amenity_ids"
                value={a.id}
                defaultChecked={selectedAmenityIds.includes(a.id)}
                className="rounded border-river-300 text-river-600 focus:ring-river-400"
              />
              {a.name}
            </label>
          ))}
        </div>
      </Field>

      <SubmitButton />
    </form>
  );
}
