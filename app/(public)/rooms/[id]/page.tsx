import Image from "next/image";
import { notFound } from "next/navigation";
import { Users, BedDouble, Maximize } from "lucide-react";
import { getRoomById, getAvailableRooms } from "@/lib/data/rooms";
import { AmenityIcon } from "@/components/public/AmenityIcon";
import { LineBookingButton } from "@/components/public/LineBookingButton";
import { AvailabilityCalendar } from "@/components/public/AvailabilityCalendar";
import { formatTHB } from "@/lib/utils/pricing";

export const revalidate = 60;

export async function generateStaticParams() {
  const rooms = await getAvailableRooms();
  return rooms.map((r) => ({ id: r.id }));
}

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  if (!room) notFound();

  const gallery = room.room_images.length > 0 ? room.room_images : [];

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      {/* Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[280px] md:h-[420px] rounded-xl2 overflow-hidden mb-8">
        {gallery.length > 0 ? (
          gallery.slice(0, 5).map((img, i) => (
            <div
              key={img.id}
              className={`relative ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} bg-river-50`}
            >
              <Image src={img.image_url} alt={room.name} fill className="object-cover" sizes="50vw" />
            </div>
          ))
        ) : (
          <div className="col-span-4 row-span-2 flex items-center justify-center bg-river-50 text-river-300">
            ไม่มีรูปภาพ
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-river-900 dark:text-river-100">{room.name}</h1>
            <p className="text-river-500">{room.type}</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-river-700 dark:text-river-300 border-y border-river-100 dark:border-[#1e2f3f] py-4">
            <span className="flex items-center gap-2"><Users size={18} /> {room.capacity} ท่าน</span>
            {room.bed_type && <span className="flex items-center gap-2"><BedDouble size={18} /> {room.bed_type}</span>}
            {room.room_size_sqm && <span className="flex items-center gap-2"><Maximize size={18} /> {room.room_size_sqm} ตร.ม.</span>}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">รายละเอียดห้องพัก</h2>
            <p className="text-river-600 dark:text-river-400 leading-relaxed">{room.description}</p>
          </div>

          {room.amenities.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-3">สิ่งอำนวยความสะดวก</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 text-sm text-river-700 dark:text-river-300">
                    <AmenityIcon iconKey={a.icon_key} className="text-gold-500" />
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <AvailabilityCalendar room={room} />
        </div>

        {/* กล่องราคา + ปุ่มจอง (sticky) */}
        <aside className="md:sticky md:top-24 h-fit resort-card p-6 space-y-4">
          <h3 className="font-semibold text-river-800 dark:text-river-200">อัตราค่าห้องพัก</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-river-600 dark:text-river-400">วันธรรมดา</span>
              <span className="font-semibold">{formatTHB(room.price_normal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-river-600 dark:text-river-400">ศุกร์-เสาร์</span>
              <span className="font-semibold">{formatTHB(room.price_weekend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-river-600 dark:text-river-400">เทศกาล/วันหยุดยาว</span>
              <span className="font-semibold text-gold-600">{formatTHB(room.price_festival)}</span>
            </div>
          </div>
          <LineBookingButton roomName={room.name} fullWidth />
          <p className="text-xs text-center text-river-400">จองผ่าน LINE เท่านั้น ทีมงานจะยืนยันห้องว่างและออกใบจองให้</p>
        </aside>
      </div>
    </section>
  );
}
