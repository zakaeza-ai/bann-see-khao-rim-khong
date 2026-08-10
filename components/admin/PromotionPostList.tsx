"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { togglePromotionPostAction, deletePromotionPostAction } from "@/lib/actions/promotion-posts";
import { Badge } from "@/components/ui/Badge";

export interface PromotionPostMediaView {
  id: string;
  media_type: "image" | "video";
  url: string;
}

export interface PromotionPostView {
  id: string;
  title: string;
  status: "draft" | "published";
  start_date: string | null;
  end_date: string | null;
  media: PromotionPostMediaView[];
}

export function PromotionPostList({ posts }: { posts: PromotionPostView[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="resort-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-river-50 dark:bg-[#16273a] text-river-600 dark:text-river-300">
          <tr>
            <th className="text-left px-4 py-3">ตัวอย่าง</th>
            <th className="text-left px-4 py-3">ชื่อโปรโมชั่น</th>
            <th className="text-left px-4 py-3">ช่วงเวลา</th>
            <th className="text-center px-4 py-3">ไฟล์แนบ</th>
            <th className="text-center px-4 py-3">สถานะ</th>
            <th className="text-right px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const thumb = post.media.find((m) => m.media_type === "image") ?? post.media[0];
            return (
              <tr key={post.id} className="border-t border-river-50 dark:border-[#16273a]">
                <td className="px-4 py-3">
                  {thumb ? (
                    thumb.media_type === "image" ? (
                      <img src={thumb.url} alt="" className="w-14 h-14 object-cover rounded-lg" />
                    ) : (
                      <video src={thumb.url} className="w-14 h-14 object-cover rounded-lg" muted />
                    )
                  ) : (
                    <div className="w-14 h-14 bg-river-50 dark:bg-[#16273a] rounded-lg" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-river-800 dark:text-river-200">{post.title}</td>
                <td className="px-4 py-3 text-river-600 dark:text-river-400">
                  {post.start_date ?? "-"} ถึง {post.end_date ?? "-"}
                </td>
                <td className="px-4 py-3 text-center">{post.media.length} ไฟล์</td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() =>
                      startTransition(() =>
                        togglePromotionPostAction(post.id, post.status === "published" ? "draft" : "published")
                      )
                    }
                  >
                    <Badge variant={post.status === "published" ? "success" : "danger"}>
                      {post.status === "published" ? "เผยแพร่แล้ว" : "แบบร่าง"}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={pending}
                    onClick={() => startTransition(() => deletePromotionPostAction(post.id))}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
                  >
                    {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {posts.length === 0 && <p className="text-center text-river-500 py-8">ยังไม่มีโปรโมชั่น</p>}
    </div>
  );
}