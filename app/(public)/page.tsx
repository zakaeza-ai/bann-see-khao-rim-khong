import Link from "next/link";
import { LineBookingButton } from "@/components/public/LineBookingButton";
import { RoomCard } from "@/components/public/RoomCard";
import { PromotionCard } from "@/components/public/PromotionCard";
import { getAvailableRooms } from "@/lib/data/rooms";
import { getActivePromotions } from "@/lib/data/content";

export const revalidate = 60;

export default async function HomePage() {
  const [rooms, promotions] = await Promise.all([getAvailableRooms(), getActivePromotions()]);
  const featuredRooms = rooms.slice(0, 3);
  const featuredPromotions = promotions.slice(0, 2);

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-36 bg-gradient-to-b from-river-50 to-white dark:from-[#0b1520] dark:to-[#0b1520] overflow-hidden">
      <span className="inline-block mb-4 px-4 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-semibold tracking-wide animate-fade-up">
        ที่พักวิวแม่น้ำโขง ใกล้พระธาตุพนม
      </span>
      <h1 className="text-3xl md:text-5xl font-bold text-river-900 dark:text-river-100 max-w-3xl animate-fade-up">
        บ้านสีขาวริมโขง <span className="text-gold-500">ธาตุพนม</span>
      </h1>
      <p className="mt-4 max-w-xl text-river-700 dark:text-river-300 animate-fade-up">
        พักผ่อนริมแม่น้ำโขง บรรยากาศสงบ ตกแต่งสไตล์รีสอร์ทโมเดิร์น
        ห่างจากพระธาตุพนมเพียงไม่กี่นาที
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up">
        <LineBookingButton />
        <a
          href="/rooms"
          className="inline-flex items-center justify-center rounded-full border-2 border-river-300 dark:border-river-700 px-6 py-3 font-semibold text-river-800 dark:text-river-200 hover:bg-river-50 dark:hover:bg-[#101b28] transition-colors"
        >
          ดูห้องพักทั้งหมด
        </a>
      </div>

      {/* Featured Rooms */}
      {featuredRooms.length > 0 && (
        <div className="w-full max-w-7xl mx-auto mt-20 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-river-900 dark:text-river-100">ห้องพักแนะนำ</h2>
            <Link href="/rooms" className="text-sm font-semibold text-river-600 hover:text-gold-600">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Featured Promotions */}
      {featuredPromotions.length > 0 && (
        <div className="w-full max-w-7xl mx-auto mt-20 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-river-900 dark:text-river-100">โปรโมชั่นเด่น</h2>
            <Link href="/promotions" className="text-sm font-semibold text-river-600 hover:text-gold-600">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featuredPromotions.map((c, i) => (
              <PromotionCard key={c.id} coupon={c} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
