import { Star } from "lucide-react";
import type { Review } from "@/types/database";

export function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  return (
    <div
      className="resort-card p-6 space-y-3 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-river-200"}
          />
        ))}
      </div>
      <p className="text-river-700 dark:text-river-300 text-sm leading-relaxed">{review.comment}</p>
      <p className="text-xs font-semibold text-river-500">— {review.guest_name}</p>
    </div>
  );
}
