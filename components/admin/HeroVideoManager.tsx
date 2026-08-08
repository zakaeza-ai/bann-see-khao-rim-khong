"use client";

import { useRef, useState, useTransition } from "react";
import { uploadHeroVideoAction, removeHeroVideoAction } from "@/lib/actions/hero-videos";

export function HeroVideoManager({
  slot,
  title,
  currentVideoUrl,
}: {
  slot: number;
  title: string;
  currentVideoUrl: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("กรุณาเลือกไฟล์วิดีโอ");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append("video", file);

    startTransition(async () => {
      const result = await uploadHeroVideoAction(slot, formData);
      if (result?.error) {
        setError(result.error);
      } else if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeHeroVideoAction(slot);
    });
  }

  return (
    <div className="rounded-xl border border-river-100 dark:border-[#1e2f3f] p-6">
      <h3 className="font-bold text-lg text-river-900 dark:text-river-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-river-500 mb-4">Slot {slot}</p>

      {currentVideoUrl ? (
        <div className="mb-4">
          <video
            src={currentVideoUrl}
            controls
            className="w-full max-h-64 rounded-lg bg-black"
          />
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="mt-2 text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            ลบวิดีโอนี้
          </button>
        </div>
      ) : (
        <p className="text-sm text-river-400 mb-4">ยังไม่มีวิดีโอ</p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="text-sm"
        />
        <button
          onClick={handleUpload}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {isPending ? "กำลังอัปโหลด..." : "อัปโหลด"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}