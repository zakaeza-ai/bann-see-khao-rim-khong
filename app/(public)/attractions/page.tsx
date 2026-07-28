import Image from "next/image";
import { MapPin } from "lucide-react";
import { getAttractions } from "@/lib/data/content";

export const metadata = { title: "สถานที่ท่องเที่ยว | บ้านสีขาวริมโขง ธาตุพนม" };
export const revalidate = 300;

export default async function AttractionsPage() {
  const attractions = await getAttractions();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">สถานที่ท่องเที่ยวใกล้เคียง</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">เดินทางสะดวกจากที่พักของเรา</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((a, i) => (
          <div
            key={a.id}
            className="resort-card overflow-hidden animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative h-44 bg-river-50">
              {a.image_url ? (
                <Image src={a.image_url} alt={a.name} fill className="object-cover" sizes="33vw" />
              ) : (
                <div className="h-full flex items-center justify-center text-river-300">ไม่มีรูปภาพ</div>
              )}
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-river-900 dark:text-river-100">{a.name}</h3>
              <p className="text-sm text-river-600 dark:text-river-400 line-clamp-3">{a.description}</p>
              {a.distance_km != null && (
                <div className="flex items-center gap-1 text-xs text-gold-600 font-medium">
                  <MapPin size={14} /> ห่างจากที่พัก {a.distance_km} กม.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
