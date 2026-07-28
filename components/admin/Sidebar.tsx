"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, Tag, Percent, CalendarCheck, BarChart3, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/admin/bookings", label: "จัดการการจอง", icon: CalendarCheck },
  { href: "/admin/rooms", label: "จัดการห้องพัก", icon: BedDouble },
  { href: "/admin/pricing", label: "จัดการราคา", icon: Tag },
  { href: "/admin/promotions", label: "จัดการโปรโมชั่น", icon: Percent },
  { href: "/admin/reports", label: "รายงาน", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#101b28] border-r border-river-100 dark:border-[#1e2f3f] min-h-screen p-4 flex flex-col">
      <div className="px-2 py-3 mb-4">
        <p className="font-bold text-river-900 dark:text-river-100">🏞️ ระบบจัดการ</p>
        <p className="text-xs text-river-500">บ้านสีขาวริมโขง ธาตุพนม</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-river-500 text-white"
                  : "text-river-700 dark:text-river-300 hover:bg-river-50 dark:hover:bg-[#16273a]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction}>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full">
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </form>
    </aside>
  );
}
