/**
 * จับคู่ room.id ของ web_bansrikhow (ฝั่งที่ลูกค้าเห็น)
 * กับ room.id ของ booking-app-supabase (ฝั่งที่แอดมินกรอกจองจริง)
 * ห้องไม่เกิน 5 ห้อง จึง hardcode ไว้ตรงนี้ ไม่ต้องทำ UI จับคู่
 */
export const ROOM_ID_MAP: Record<string, string> = {
  "501dacb5-899a-4124-9e4e-3d3e26e4de1d": "b48fdc6b-a07b-4a8d-8ea7-aad3528ec424", // DLX-01 -> R1
  "b352d511-23bc-46f9-a72c-dee7f8bdace4": "aba604d1-6d5e-4bf4-beff-7a1c29bc4a24", // st01   -> R2
  "5a4b869f-bd87-4095-973e-01c80a2b4ba3": "8d126778-8aae-4eb6-b5fe-59a8e327a478", // DLX-03 -> R3
  "ba3d8765-f563-4ec6-b6ad-10ea006f73d6": "01a01f1f-0363-4edb-88c3-5be36d75ab9b", // DLX-04 -> R4
  "2b5f4795-a644-4404-b3d3-f91800e66682": "4913256e-4db2-4f64-93e0-522c722bf056", // DLX-05 -> R5
};

export function toBookingAppRoomId(webRoomId: string): string | null {
  return ROOM_ID_MAP[webRoomId] ?? null;
}
