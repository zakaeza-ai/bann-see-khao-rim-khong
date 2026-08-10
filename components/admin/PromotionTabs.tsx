"use client";

import { useState } from "react";

export function PromotionTabs({
  couponsSection,
  mediaSection,
}: {
  couponsSection: React.ReactNode;
  mediaSection: React.ReactNode;
}) {
  const [tab, setTab] = useState<"coupons" | "media">("coupons");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("coupons")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            tab === "coupons"
              ? "bg-river-600 text-white"
              : "text-river-600 dark:text-river-300 hover:bg-river-50 dark:hover:bg-[#16273a]"
          }`}
        >
          คูปองส่วนลด
        </button>
        <button
          onClick={() => setTab("media")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            tab === "media"
              ? "bg-river-600 text-white"
              : "text-river-600 dark:text-river-300 hover:bg-river-50 dark:hover:bg-[#16273a]"
          }`}
        >
          โปรโมชั่น (คลิป/ภาพ)
        </button>
      </div>
      {tab === "coupons" ? couponsSection : mediaSection}
    </div>
  );
}