"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { LineBookingButton } from "./LineBookingButton";

const MENU = [
  { href: "/", label: "หน้าแรก" },
  { href: "/rooms", label: "ห้องพัก" },
  { href: "/promotions", label: "โปรโมชั่น" },
  { href: "/attractions", label: "สถานที่ท่องเที่ยว" },
  { href: "/reviews", label: "รีวิวลูกค้า" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b1520]/90 backdrop-blur-md border-b border-river-100 dark:border-[#1e2f3f]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-river-800 dark:text-river-200">
          <span className="text-gold-500 text-xl">🏞️</span>
          <span className="text-lg">บ้านสีขาวริมโขง ธาตุพนม</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-river-800 dark:text-river-200 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="สลับโหมดมืด/สว่าง"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-river-50 dark:hover:bg-[#16273a] transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <LineBookingButton className="text-sm py-2 px-4" />
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="เมนู">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* เมนูมือถือ */}
      {open && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 animate-fade-up">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-river-800 dark:text-river-200 font-medium border-b border-river-50 dark:border-[#16273a] last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 text-sm text-river-700 dark:text-river-300"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} สลับธีม
            </button>
          </div>
          <LineBookingButton fullWidth className="mt-3" />
        </div>
      )}
    </header>
  );
}
