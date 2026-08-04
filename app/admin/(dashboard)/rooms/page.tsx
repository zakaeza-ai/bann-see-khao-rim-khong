import { getAvailableRooms } from "@/lib/data/rooms";
import { RoomCard } from "@/components/public/RoomCard";
import { OverallAvailabilityCalendar } from "@/components/public/OverallAvailabilityCalendar";

export const metadata = { title: "ห้องพักทั้งหมด | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 60;

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) {
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  const rooms = await getAvailableRooms();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">ห้องพักของเรา</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">
          เลือกห้องที่ใช่ แล้วแอดไลน์เพื่อจอง ทีมงานจะตอบกลับและออกใบจองให้ทันที
        </p>
      </div>

      <OverallAvailabilityCalendar year={year} month={month} />

      {rooms.length === 0 ? (
        <p className="text-center text-river-500 py-20">ขณะนี้ยังไม่มีห้องพักเปิดให้บริการ</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}