"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h1 className="text-xl font-bold text-river-800 dark:text-river-200 mb-2">เกิดข้อผิดพลาดในระบบจัดการ</h1>
      <p className="text-river-500 mb-6 text-sm">{error.message || "กรุณาลองใหม่อีกครั้ง"}</p>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-6 py-2.5 text-sm font-semibold"
      >
        <RefreshCcw size={16} /> ลองใหม่
      </button>
    </div>
  );
}
