import { getHeroVideos } from "@/lib/actions/hero-videos";
import { HeroVideoManager } from "@/components/admin/HeroVideoManager";

export default async function HeroVideosPage() {
  const videos = await getHeroVideos();

  const slot1 = videos.find((v) => v.slot === 1);
  const slot2 = videos.find((v) => v.slot === 2);

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">
          วิดีโอหน้าแรก
        </h1>
        <p className="text-river-600 dark:text-river-400 mt-2">
          อัปโหลดวิดีโอ 2 คลิปสำหรับแสดงในหน้าแรกของเว็บไซต์ (ไฟล์ไม่เกิน 4.5 MB)
        </p>
      </div>

      <div className="space-y-8">
        <HeroVideoManager
          slot={1}
          title="ห้องพักทั้งหมด"
          currentVideoUrl={slot1?.video_url ?? null}
        />
        <HeroVideoManager
          slot={2}
          title="ที่ท่องเที่ยวแนะนำ"
          currentVideoUrl={slot2?.video_url ?? null}
        />
      </div>
    </section>
  );
}