import { getActivePromotions, getActivePromotionPosts } from "@/lib/data/content";
import { PromotionCard } from "@/components/public/PromotionCard";
import { PromotionPostCard } from "@/components/public/PromotionPostCard";
import { LineBookingButton } from "@/components/public/LineBookingButton";
import { OverallAvailabilityCalendar } from "@/components/public/OverallAvailabilityCalendar";

export const metadata = { title: "เช็ควันห้องว่าง | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 60;

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) {
  const [promotions, posts] = await Promise.all([getActivePromotions(), getActivePromotionPosts()]);

  const now = new Date();
  const year = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">เช็ควันห้องว่าง</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">แจ้งโค้ดกับแอดมินตอนจองผ่าน LINE เพื่อรับส่วนลด</p>
      </div>

      <OverallAvailabilityCalendar year={year} month={month} />

      {posts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((p) => (
            <PromotionPostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {promotions.length === 0 ? (
        <p className="text-center text-river-500 py-20">ขณะนี้ยังไม่มีโปรโมชั่น กรุณาติดตามเร็ว ๆ นี้</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {promotions.map((c, i) => (
            <PromotionCard key={c.id} coupon={c} index={i} />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <LineBookingButton />
      </div>
    </section>
  );
}
