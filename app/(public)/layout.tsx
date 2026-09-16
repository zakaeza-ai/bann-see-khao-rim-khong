import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BackgroundMusic } from "@/components/public/BackgroundMusic";

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
    </>
  );
}
