import { createClient } from "@/lib/supabase/server";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponTable } from "@/components/admin/CouponTable";
import { PromotionPostForm } from "@/components/admin/PromotionPostForm";
import { PromotionPostList, type PromotionPostView } from "@/components/admin/PromotionPostList";
import { PromotionTabs } from "@/components/admin/PromotionTabs";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const supabase = createClient();

  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  const { data: posts } = await supabase
    .from("promotion_posts")
    .select("*, promotion_post_media(*)")
    .order("created_at", { ascending: false });

  const postsView: PromotionPostView[] = (posts ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    start_date: p.start_date,
    end_date: p.end_date,
    media: (p.promotion_post_media ?? []).map(
      (m: { id: string; media_type: "image" | "video"; storage_path: string }) => ({
        id: m.id,
        media_type: m.media_type,
        url: supabase.storage.from("promotion-media").getPublicUrl(m.storage_path).data.publicUrl,
      })
    ),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการโปรโมชั่น</h1>

      <PromotionTabs
        couponsSection={
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
            <CouponForm />
            <CouponTable coupons={coupons ?? []} />
          </div>
        }
        mediaSection={
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
            <PromotionPostForm />
            <PromotionPostList posts={postsView} />
          </div>
        }
      />
    </div>
  );
}