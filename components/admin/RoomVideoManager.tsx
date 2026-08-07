"use client";

import { useRef, useTransition, useState } from "react";
import { Upload, Trash2, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { uploadRoomVideoAction, removeRoomVideoAction } from "@/lib/actions/rooms";

export function RoomVideoManager({ roomId, videoUrl }: { roomId: string; videoUrl: string | null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      const res = await uploadRoomVideoAction(roomId, formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setError(undefined);
      toast.success("อัปโหลดวิดีโอสำเร็จ");
      formRef.current?.reset();
    });
  }

  function handleRemove() {
    if (!confirm("ยืนยันลบวิดีโอนี้? ห้องจะกลับไปแสดงรูปภาพแทน")) return;
    startTransition(async () => {
      await removeRoomVideoAction(roomId);
      toast.success("ลบวิดีโอแล้ว");
    });
  }

  return (
    <div className="resort-card p-6 space-y-4 max-w-2xl">
      <h3 className="font-semibold text-river-800 dark:text-river-200 flex items-center gap-2">
        <Video size={18} className="text-gold-500" /> วิดีโอห้องพัก (ไม่บังคับ)
      </h3>
      <p className="text-xs text-river-400">
        ถ้าตั้งวิดีโอไว้ หน้าเว็บจะเล่นวิดีโอแทนรูปภาพ แนะนำคลิปสั้น 10-30 วินาที ขนาดไม่เกิน 20-30 MB
      </p>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {videoUrl && (
        <div className="space-y-2">
          <video src={videoUrl} controls className="w-full rounded-lg max-h-64" />
          <button
            onClick={handleRemove}
            disabled={pending}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
          >
            <Trash2 size={14} /> ลบวิดีโอนี้
          </button>
        </div>
      )}

      <form ref={formRef} action={handleUpload} className="flex items-center gap-3">
        <input
          type="file"
          name="video"
          accept="video/*"
          required
          className="text-sm text-river-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-river-100 file:text-river-700 hover:file:bg-river-200 file:text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60 shrink-0"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {videoUrl ? "อัปโหลดใหม่" : "อัปโหลด"}
        </button>
      </form>
    </div>
  );
}