import { createClient } from "@/lib/supabase/server";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponTable } from "@/components/admin/CouponTable";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const supabase = createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-river-900 dark:text-river-100">จัดการโปรโมชั่น</h1>
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <CouponForm />
        <CouponTable coupons={coupons ?? []} />
      </div>
    </div>
  );
}
