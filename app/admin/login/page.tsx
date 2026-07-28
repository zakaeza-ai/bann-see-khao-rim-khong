"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, LogIn } from "lucide-react";
import { signInAction } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 rounded-full bg-river-600 hover:bg-river-700 text-white font-semibold py-2.5 transition-colors disabled:opacity-60"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
      เข้าสู่ระบบ
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(signInAction, { error: undefined as string | undefined });

  return (
    <div className="min-h-screen flex items-center justify-center bg-river-50 dark:bg-[#0b1520] px-4">
      <form action={formAction} className="resort-card w-full max-w-sm p-8 space-y-4">
        <div className="text-center mb-2">
          <p className="text-2xl">🏞️</p>
          <h1 className="font-bold text-lg text-river-900 dark:text-river-100">ระบบจัดการ</h1>
          <p className="text-xs text-river-500">บ้านสีขาวริมโขง ธาตุพนม</p>
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">{state.error}</p>
        )}

        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300">อีเมล</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-river-700 dark:text-river-300">รหัสผ่าน</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-river-400"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
