import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BackgroundMusic } from "@/components/public/BackgroundMusic";
import { LineFloatingButton } from "@/components/public/LineFloatingButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackgroundMusic />
      {/* ปุ่มแอดไลน์ลอย — ช่องทางจองเดียวของเว็บ ต้องกดได้จากทุกหน้า */}
      <LineFloatingButton />
    </>
  );
}
