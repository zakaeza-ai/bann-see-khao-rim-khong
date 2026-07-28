import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// รวม className หลายอันเข้าด้วยกัน พร้อมจัดการ Tailwind class ที่ขัดแย้งกันอัตโนมัติ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
