"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  uploadRoomImagesAction,
  deleteRoomImageAction,
  setCoverImageAction,
} from "@/lib/actions/rooms";
import type { RoomImage } from "@/types/database";

export function RoomImageManager({ roomId, images }: { roomId: string; images: RoomImage[] }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadRoomImagesAction(roomId, formData);
      toast.success("อัปโหลดรูปภาพสำเร็จ");
      formRef.current?.reset();
    });
  }

  return (
    <div className="resort-card p-6 space-y-4 max-w-3xl">
      <h3 className="font-semibold text-river-800 dark:text-river-200">รูปภาพห้องพัก (อัปโหลดได้หลายรูป)</h3>

      <form ref={formRef} action={handleUpload} className="flex items-center gap-3">
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          required
          className="text-sm text-river-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-river-100 file:text-river-700 hover:file:bg-river-200 file:text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60 shrink-0"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          อัปโหลด
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-river-100 dark:border-[#1e2f3f]">
            <Image src={img.image_url} alt="" fill className="object-cover" />
            {img.is_cover && (
              <span className="absolute top-1 left-1 bg-gold-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                รูปปก
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!img.is_cover && (
                <button
                  title="ตั้งเป็นรูปปก"
                  onClick={() => startTransition(() => setCoverImageAction(img.id, roomId))}
                  className="p-2 bg-white rounded-full text-gold-600"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                title="ลบรูปนี้"
                onClick={() => startTransition(() => deleteRoomImageAction(img.id, roomId))}
                className="p-2 bg-white rounded-full text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-sm text-river-400 col-span-full">ยังไม่มีรูปภาพ</p>}
      </div>
    </div>
  );
}
