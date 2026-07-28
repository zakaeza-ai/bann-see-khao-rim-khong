import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingRoomDetail() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <Skeleton className="h-[280px] md:h-[420px] w-full mb-8" />
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </section>
  );
}
