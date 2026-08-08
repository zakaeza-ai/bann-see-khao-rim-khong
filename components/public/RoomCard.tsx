import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AmenityIcon } from "./AmenityIcon";
import { formatTHB } from "@/lib/utils/pricing";
import type { RoomWithDetails } from "@/types/database";

export function RoomCard({ room, index = 0 }: { room: RoomWithDetails; index?: number }) {
  const cover = room.room_images.find((i) => i.is_cover) ?? room.room_images[0];

  return (
    <div
      className="resort-card overflow-hidden group animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
<div className="relative h-52 w-full overflow-hidden bg-river-50">
  {room.video_url ? (
    <video
      src={room.video_url}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : cover ? (
    <Image
      src={cover.image_url}
      alt={room.type}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="h-full w-full flex items-center justify-center text-river-400">
      ไม่มีรูปภาพ
    </div>
  )}
  <Badge variant="gold" className="absolute top-3 left-3 shadow-sm">
    {room.type}
  </Badge>
</div>

      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg text-river-900 dark:text-river-100">{room.name}</h3>
        <p className="text-sm text-river-600 dark:text-river-400 line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-4 text-xs text-river-600 dark:text-river-400">
          <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} ท่าน</span>
          {room.bed_type && <span className="flex items-center gap-1"><BedDouble size={14} /> {room.bed_type}</span>}
          {room.room_size_sqm && <span className="flex items-center gap-1"><Maximize size={14} /> {room.room_size_sqm} ตร.ม.</span>}
        </div>

        {room.amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {room.amenities.slice(0, 6).map((a) => (
              <span
                key={a.id}
                title={a.name}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300"
              >
                <AmenityIcon iconKey={a.icon_key} size={16} />
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-2 border-t border-river-50 dark:border-[#16273a]">
          <div>
            <p className="text-xs text-river-500">เริ่มต้น</p>
            <p className="text-xl font-bold text-gold-600">{formatTHB(room.price_normal)}<span className="text-xs font-normal text-river-500"> /คืน</span></p>
          </div>
          <Link
            href={`/rooms/${room.id}`}
            className="text-sm font-semibold text-river-700 dark:text-river-300 hover:text-gold-600 transition-colors"
          >
            ดูรายละเอียด →
          </Link>
        </div>
      </div>
    </div>
  );
}
