"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("กรุณากรอกชื่อและความคิดเห็นให้ครบ");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    // is_approved ถูกบังคับเป็น false เสมอด้วย RLS policy ฝั่ง insert — ต้องรอแอดมินอนุมัติก่อนแสดงผล
    const { error } = await supabase.from("reviews").insert({
      guest_name: name.trim(),
      rating,
      comment: comment.trim(),
      is_approved: false,
    });
    setLoading(false);

    if (error) {
      toast.error("ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
      return;
    }

    toast.success("ขอบคุณสำหรับรีวิว! ทีมงานจะตรวจสอบก่อนแสดงผล");
    setName("");
    setComment("");
    setRating(5);
  }

  return (
    <form onSubmit={handleSubmit} className="resort-card p-6 space-y-4 max-w-lg mx-auto">
      <h3 className="font-semibold text-river-800 dark:text-river-200">เขียนรีวิวของคุณ</h3>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button type="button" key={i} onClick={() => setRating(i + 1)}>
            <Star
              size={24}
              className={i < rating ? "fill-gold-400 text-gold-400" : "text-river-200"}
            />
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="ชื่อของคุณ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        className="w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400"
      />
      <textarea
        placeholder="เล่าประสบการณ์การเข้าพักของคุณ..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={4}
        className="w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white font-semibold py-2.5 transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        ส่งรีวิว
      </button>
    </form>
  );
}
