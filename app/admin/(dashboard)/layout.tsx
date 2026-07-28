import { AdminSidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-river-50/50 dark:bg-[#0b1520] p-6 md:p-8">{children}</main>
    </div>
  );
}
