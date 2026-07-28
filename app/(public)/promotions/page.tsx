import { getActivePromotions } from "@/lib/data/content";
import { PromotionCard } from "@/components/public/PromotionCard";
import { LineBookingButton } from "@/components/public/LineBookingButton";

export const metadata = { title: "โปรโมชั่น | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 60;

export default async function PromotionsPage() {
  const promotions = await getActivePromotions();

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">โปรโมชั่นพิเศษ</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">แจ้งโค้ดกับแอดมินตอนจองผ่าน LINE เพื่อรับส่วนลด</p>
      </div>

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
