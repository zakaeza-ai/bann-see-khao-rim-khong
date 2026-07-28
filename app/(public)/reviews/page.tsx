import { getApprovedReviews } from "@/lib/data/content";
import { ReviewCard } from "@/components/public/ReviewCard";
import { ReviewForm } from "@/components/public/ReviewForm";

export const metadata = { title: "รีวิวลูกค้า | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">รีวิวจากลูกค้าจริง</h1>
        {avgRating && (
          <p className="text-gold-600 font-semibold mt-2">
            ⭐ {avgRating} / 5 จาก {reviews.length} รีวิว
          </p>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-14">
          {reviews.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-center text-river-500 py-10">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเราสิ!</p>
      )}

      <ReviewForm />
    </section>
  );
}
