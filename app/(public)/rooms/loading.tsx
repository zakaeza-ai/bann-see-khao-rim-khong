import { RoomCardSkeleton } from "@/components/ui/Skeleton";

export default function LoadingRooms() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
