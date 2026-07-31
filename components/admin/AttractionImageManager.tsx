"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadAttractionImageAction } from "@/lib/actions/attractions";

export function AttractionImageManager({ id, imageUrl }: { id: string; imageUrl: string | null }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadAttractionImageAction(id, formData);
      toast.success("อัปโหลดรูปภาพสำเร็จ");
      formRef.current?.reset();
    });
  }

  return (
    <div className="resort-card p-6 space-y-4 max-w-2xl">
      <h3 className="font-semibold text-river-800 dark:text-river-200">รูปภาพสถานที่ท่องเที่ยว</h3>

      {imageUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-river-100 dark:border-[#1e2f3f]">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      )}

      <form ref={formRef} action={handleUpload} className="flex items-center gap-3">
        <input
          type="file"
          name="image"
          accept="image/*"
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
    </div>
  );
}