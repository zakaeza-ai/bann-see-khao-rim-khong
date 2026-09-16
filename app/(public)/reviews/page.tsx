import Image from "next/image";
import { getTripPlans } from "@/lib/data/content";

export const metadata = { title: "วางแผนการท่องเที่ยว | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 300;

export default async function TripPlansPage() {
  const plans = await getTripPlans();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">วางแผนการท่องเที่ยว</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">แนะนำช่วงเวลาและตารางเที่ยวที่เหมาะกับคุณ</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={p.id}
            className="resort-card overflow-hidden animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative h-44 bg-river-50">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.title} fill className="object-cover" sizes="33vw" />
              ) : (
                <div className="h-full flex items-center justify-center text-river-300">ไม่มีรูปภาพ</div>
              )}
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-river-900 dark:text-river-100">{p.title}</h3>
              {p.description && (
                <p className="text-sm text-river-600 dark:text-river-400 line-clamp-3">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-center text-river-500 py-20">เร็ว ๆ นี้จะมีคำแนะนำการวางแผนเที่ยวมาอัปเดต</p>
      )}
    </section>
  );
}
