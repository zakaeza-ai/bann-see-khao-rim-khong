"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAttractionAction } from "@/lib/actions/attractions";

export function DeleteAttractionButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`ยืนยันลบ "${name}"? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
    startTransition(async () => {
      await deleteAttractionAction(id);
      toast.success("ลบแล้ว");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 disabled:opacity-50"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}